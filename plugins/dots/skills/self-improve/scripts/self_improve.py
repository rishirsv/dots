#!/usr/bin/env python3
"""Mine Codex sessions, memories, goal state, and instruction state for durable,
evidence-backed improvement proposals.

Division of labor (keep this honest):
- This script SURFACES candidates: it scans sessions for preference and correction
  sentences, scores evidence strength, ranks threads, detects skill usage and
  friction, flags unconsolidated memory summaries, flags stale durable goals, and
  inspects a repo for missing scaffolding.
- The AGENT extracts the real evidence (expected vs actual behavior, the durable
  correction) by reading the cited threads, and proposes the smallest change.

The script never edits skills, instructions, memories, docs, scripts, or repos.
It only reads, scores, and (with the `decide` command) records human decisions
about proposals so future runs do not resurface settled items.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sqlite3
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Iterable


CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()
SOURCE_SKILLS_ROOT = Path(__file__).resolve().parents[2]
STATE_DB = CODEX_HOME / "state_5.sqlite"
SESSION_INDEX = CODEX_HOME / "session_index.jsonl"
GLOBAL_AGENTS = CODEX_HOME / "AGENTS.md"
MEMORIES_DIR = CODEX_HOME / "memories"
MEMORY_MD = MEMORIES_DIR / "MEMORY.md"
MEMORIES_DB = CODEX_HOME / "memories_1.sqlite"
GOALS_DB = CODEX_HOME / "goals_1.sqlite"
# Durable record of proposal decisions so weekly runs don't resurface settled items.
DECISIONS_FILE = CODEX_HOME / "self_improve_decisions.json"
SKILL_ROOTS = (
    CODEX_HOME / "skills",
    Path.home() / ".agents" / "skills",
    SOURCE_SKILLS_ROOT,
)

# Sentences that signal a durable preference (how the user wants work done).
PREFERENCE_MARKERS = (
    "always",
    "default to",
    "prefer",
    "preserve",
    "should",
    "make sure",
    "i want you to",
    "keep ",
    "from now on",
    "going forward",
)

# Sentences that signal a correction (the agent did the wrong thing).
CORRECTION_MARKERS = (
    "do not",
    "don't",
    "never",
    "instead of",
    "instead,",
    "not what i asked",
    "that's wrong",
    "thats wrong",
    "stop doing",
    "you keep",
    "again",
)

# Strong, unambiguous directive cues that raise evidence strength.
EXPLICIT_MARKERS = (
    "always",
    "never",
    "do not",
    "don't",
    "must",
    "from now on",
    "going forward",
)

# Frustration / persistence cues — useful for thread triage, not for proposals.
FRICTION_CUES = (
    "come on",
    "can't you just",
    "cant you just",
    "keep going",
    "don't stop",
    "dont stop",
    "why did you",
    "i already told you",
)

# Strong error markers in tool output (kept narrow to avoid false positives).
ERROR_MARKERS = (
    "traceback (most recent call last)",
    "fatal:",
    "command not found",
    "no such file or directory",
    "permission denied",
    "exit code 1",
    "non-zero exit",
    "segmentation fault",
    "unhandled exception",
)

NOISY_RE = re.compile(
    r"```|^#+\s|^[-+]{1,3}|^file:\s|^lines:\s|diff hunk|review findings",
    re.IGNORECASE,
)

COMMON_WORDS = {
    "about", "after", "again", "also", "because", "could", "doing", "have",
    "instead", "please", "should", "that", "their", "there", "these", "thing",
    "things", "this", "those", "using", "want", "would", "your",
}

TRIAGE_MARKERS = {
    "correction": ("not what i asked", "wrong", "instead", "don't", "do not", "never"),
    "preference": ("prefer", "always", "default to", "i want you to", "make sure"),
    "persistence": ("continue", "keep going", "don't stop", "come on", "can't you just"),
    "skill": ("skill", "skill.md", "$", "plugin"),
    "tooling": ("tool", "script", "harness", "cli", "validation", "test", "verify"),
    "memory": ("memory", "remember", "forget", "chronicle"),
    "workflow": ("workflow", "process", "mode", "handoff", "pr", "commit", "review"),
}

# A $token only counts as a skill use when it matches a known installed skill or
# follows an explicit invocation marker. This avoids counting shell vars like $PATH.
SKILL_TOKEN_RE = re.compile(r"\$([a-z][a-z0-9](?:[a-z0-9-]*[a-z0-9])?)")
SKILL_INVOKE_RE = re.compile(
    r"(?:launching|invoking|using|loaded)\s+skill[:\s]+[`\"']?([a-z][a-z0-9-]+)",
    re.IGNORECASE,
)

STRENGTH_ORDER = {"weak": 0, "medium": 1, "strong": 2}
PROPOSAL_BUCKETS = (
    "Skills",
    "New Skills",
    "Project AGENTS.md",
    "Global AGENTS.md",
    "Memory Notes",
    "Repo Docs",
    "Scripts Or Harnesses",
    "Validation Checks",
    "Conflicts Or Deletions",
)


@dataclass(frozen=True)
class Thread:
    id: str
    title: str
    source: str
    cwd: str
    created_at: int
    updated_at: int
    archived: bool
    model: str
    rollout_path: str


@dataclass(frozen=True)
class Evidence:
    thread_id: str
    title: str
    updated_at: int
    rollout_path: str
    cwd: str
    cluster: str
    kind: str  # "preference" or "correction"
    explicit: bool


def require_db() -> None:
    if not STATE_DB.exists():
        raise SystemExit(f"Missing Codex state DB: {STATE_DB}")


def sqlite_count(path: Path, table: str) -> int | None:
    if not path.exists():
        return None
    try:
        with sqlite3.connect(path) as conn:
            row = conn.execute(f"SELECT count(*) FROM {table}").fetchone()
    except sqlite3.Error:
        return None
    return int(row[0]) if row else None


def utc(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def now_iso() -> str:
    return datetime.now(tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def shorten(value: str, width: int) -> str:
    value = " ".join((value or "").split())
    if len(value) <= width:
        return value
    return value[: max(1, width - 1)] + "..."


def threads(
    *,
    limit: int,
    archived: str,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
) -> list[Thread]:
    require_db()
    where: list[str] = []
    params: list[Any] = []

    if archived == "active":
        where.append("archived = 0")
    elif archived == "archived":
        where.append("archived = 1")
    elif archived != "all":
        raise SystemExit("--archived must be active, archived, or all")

    if days:
        cutoff = int((datetime.now(tz=timezone.utc) - timedelta(days=days)).timestamp())
        where.append("updated_at >= ?")
        params.append(cutoff)
    if query:
        needle = f"%{query.lower()}%"
        where.append("(lower(title) LIKE ? OR lower(first_user_message) LIKE ?)")
        params.extend([needle, needle])
    if cwd:
        where.append("cwd LIKE ?")
        params.append(f"{cwd}%")

    where_sql = "WHERE " + " AND ".join(where) if where else ""
    sql = f"""
        SELECT id, title, source, cwd, created_at, updated_at, archived,
               coalesce(model, ''), rollout_path
        FROM threads
        {where_sql}
        ORDER BY updated_at DESC, id DESC
        LIMIT ?
    """
    params.append(limit)
    with sqlite3.connect(STATE_DB) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [_thread_from_row(row) for row in rows]


def _thread_from_row(row: Any) -> Thread:
    return Thread(
        id=row[0],
        title=row[1] or "",
        source=row[2] or "",
        cwd=row[3] or "",
        created_at=int(row[4]),
        updated_at=int(row[5]),
        archived=bool(row[6]),
        model=row[7] or "",
        rollout_path=row[8] or "",
    )


def thread_by_id(thread_id: str) -> Thread | None:
    require_db()
    with sqlite3.connect(STATE_DB) as conn:
        row = conn.execute(
            """
            SELECT id, title, source, cwd, created_at, updated_at, archived,
                   coalesce(model, ''), rollout_path
            FROM threads
            WHERE id = ? OR id LIKE ?
            ORDER BY updated_at DESC
            LIMIT 1
            """,
            (thread_id, f"{thread_id}%"),
        ).fetchone()
    return _thread_from_row(row) if row else None


def recent_thread() -> Thread | None:
    rows = threads(limit=1, archived="all")
    return rows[0] if rows else None


def iter_events(path: Path) -> Iterable[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        for line_no, line in enumerate(handle, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError as exc:
                raise SystemExit(f"Bad JSON in {path}:{line_no}: {exc}") from exc


def _message_payloads(thread: Thread) -> Iterable[dict[str, Any]]:
    """Yield message-bearing payloads from a rollout (event_msg user/agent messages)."""
    path = Path(thread.rollout_path)
    if not path.exists():
        return
    for event in iter_events(path):
        if event.get("type") != "event_msg":
            continue
        payload = event.get("payload") or {}
        if payload.get("type") in {"user_message", "agent_message"}:
            yield payload


def user_messages(thread: Thread) -> list[str]:
    out: list[str] = []
    for payload in _message_payloads(thread):
        if payload.get("type") != "user_message":
            continue
        message = (payload.get("message") or "").strip()
        if message:
            out.append(message)
    return out


def all_messages(thread: Thread, *, max_chars: int = 20000) -> str:
    chunks: list[str] = [thread.title]
    total = len(thread.title)
    for payload in _message_payloads(thread):
        message = (payload.get("message") or "").strip()
        if not message:
            continue
        chunks.append(message)
        total += len(message)
        if total >= max_chars:
            break
    return "\n".join(chunks)


def _output_text(output: Any) -> str:
    if isinstance(output, str):
        return output
    if isinstance(output, dict):
        return " ".join(str(v) for v in output.values() if isinstance(v, (str, int, float)))
    return ""


@dataclass
class ThreadSignals:
    """Heuristic per-thread signals. Candidate detection, not conclusions."""

    skills: Counter = field(default_factory=Counter)
    error_outputs: int = 0
    friction_cues: int = 0
    tool_calls: int = 0


def thread_signals(thread: Thread, known_skills: set[str]) -> ThreadSignals:
    """Scan the full rollout for skill usage, tool errors, and friction cues."""
    sig = ThreadSignals()
    path = Path(thread.rollout_path)
    if not path.exists():
        return sig
    for event in iter_events(path):
        payload = event.get("payload") or {}
        if not isinstance(payload, dict):
            continue
        kind = payload.get("type")
        if kind in {"user_message", "agent_message"}:
            text = (payload.get("message") or "")
            lowered = text.lower()
            for token in SKILL_TOKEN_RE.findall(text):
                if token.lower() in known_skills:
                    sig.skills[token.lower()] += 1
            for match in SKILL_INVOKE_RE.findall(text):
                sig.skills[match.lower()] += 1
            for cue in FRICTION_CUES:
                if cue in lowered:
                    sig.friction_cues += 1
        elif kind == "function_call":
            sig.tool_calls += 1
            name = (payload.get("name") or "").lower()
            namespace = (payload.get("namespace") or "").lower()
            for skill in known_skills:
                if skill == name or skill == namespace or f"/{skill}/" in namespace:
                    sig.skills[skill] += 1
        elif kind == "function_call_output":
            text = _output_text(payload.get("output"))[:2000].lower()
            if any(marker in text for marker in ERROR_MARKERS):
                sig.error_outputs += 1
    return sig


def split_sentences(message: str) -> Iterable[str]:
    normalized = re.sub(r"\s+", " ", message).strip()
    for chunk in re.split(r"(?<=[.!?])\s+|;\s+|\s+\|\s+", normalized):
        chunk = chunk.strip(" \t\r\n\"'`")
        if chunk:
            yield chunk


def sentence_kind(sentence: str) -> str | None:
    """Classify a sentence as a preference, a correction, or neither."""
    lowered = sentence.lower()
    if len(sentence) < 14 or len(sentence) > 600:
        return None
    if NOISY_RE.search(sentence):
        return None
    if sentence.endswith("?") and not any(
        token in lowered for token in ("prefer", "make sure", "default")
    ):
        return None
    if any(marker in lowered for marker in CORRECTION_MARKERS):
        return "correction"
    if any(marker in lowered for marker in PREFERENCE_MARKERS):
        return "preference"
    return None


def is_explicit(sentence: str) -> bool:
    lowered = sentence.lower()
    return any(marker in lowered for marker in EXPLICIT_MARKERS)


def normalize_suggestion(sentence: str) -> str:
    value = sentence.strip()
    value = re.sub(r"^(okay|ok|yeah|and then)[, ]+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^(can you|could you)\s+(please\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^make sure\s+(that\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^i want you to\s+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+", " ", value).strip(" .!?")
    if not value:
        return ""
    value = value[0].upper() + value[1:]
    if not value.endswith("."):
        value += "."
    return value


def token_key(value: str) -> str:
    tokens = [
        token
        for token in re.findall(r"[a-z0-9]+", value.lower())
        if token not in COMMON_WORDS
    ]
    return "-".join(tokens[:12])


def cluster_key(thread: Thread, target: str) -> str:
    day = datetime.fromtimestamp(thread.updated_at, tz=timezone.utc).strftime("%Y-%m-%d")
    title = token_key(thread.title) or token_key(thread.cwd) or thread.id
    return f"{target}::{title}::{day}"


def proposal_key(bucket: str, target: str, suggestion: str) -> str:
    digest = hashlib.sha1(f"{bucket}|{target}|{suggestion}".encode("utf-8")).hexdigest()
    return digest[:12]


def skill_paths() -> list[Path]:
    paths: list[Path] = []
    for root in SKILL_ROOTS:
        if not root.exists():
            continue
        paths.extend(sorted(root.glob("*/SKILL.md")))
    return paths


def known_skill_names() -> set[str]:
    return {path.parent.name.lower() for path in skill_paths()}


def infer_project_agents(cwd: str) -> str:
    path = Path(cwd).expanduser()
    for candidate in [path, *path.parents]:
        if candidate == Path.home():
            break
        if (candidate / "AGENTS.md").exists():
            return str(candidate / "AGENTS.md")
        if (candidate / ".git").exists():
            return str(candidate / "AGENTS.md")
    return str(path / "AGENTS.md")


def infer_skill_target(sentence: str, cwd: str) -> str:
    lowered = sentence.lower()
    for skill in skill_paths():
        name = skill.parent.name.lower()
        if name in lowered or str(skill.parent).lower() in lowered:
            return str(skill)
    cwd_path = Path(cwd).expanduser()
    for skill in skill_paths():
        try:
            cwd_path.relative_to(skill.parent)
            return str(skill)
        except ValueError:
            pass
    return str(CODEX_HOME / "skills" / "<new-skill>" / "SKILL.md")


def classify(sentence: str, thread: Thread) -> tuple[str, str]:
    """Route a sentence to a proposal bucket. This is a HINT for the agent, not a
    verified destination — keyword routing is lossy, so the agent should confirm
    the bucket by reading the cited thread."""
    lowered = sentence.lower()
    if "new skill" in lowered or "create skill" in lowered:
        return "New Skills", str(CODEX_HOME / "skills" / "<new-skill>" / "SKILL.md")
    if "skill" in lowered or "skill.md" in lowered or "/skills/" in lowered:
        return "Skills", infer_skill_target(sentence, thread.cwd)
    if any(token in lowered for token in ("memory", "remember", "forget", "chronicle")):
        return "Memory Notes", str(MEMORY_MD)
    if any(token in lowered for token in ("script", "harness", "tool", "cli")):
        return "Scripts Or Harnesses", str(Path(thread.cwd or Path.cwd()) / "<script-or-harness>")
    if any(token in lowered for token in ("validation", "test", "verify", "check")):
        return "Validation Checks", str(Path(thread.cwd or Path.cwd()) / "<validation>")
    if any(token in lowered for token in ("readme", "docs", "documentation", "runbook")):
        return "Repo Docs", str(Path(thread.cwd or Path.cwd()) / "<doc>")
    if any(token in lowered for token in ("conflict", "contradict", "delete", "remove")):
        return "Conflicts Or Deletions", "<resolve-conflict-or-delete-stale-guidance>"
    if any(token in lowered for token in ("globally", "all repos", "across repos", "for any repo")):
        return "Global AGENTS.md", str(GLOBAL_AGENTS)
    if thread.cwd and thread.cwd != str(Path.home()):
        return "Project AGENTS.md", infer_project_agents(thread.cwd)
    return "Global AGENTS.md", str(GLOBAL_AGENTS)


def strength_label(evidence: list[Evidence]) -> str:
    """Honest, multi-factor evidence strength — NOT a probability.

    Factors: deduped support (thread clusters), explicit directive language,
    cross-repo spread, and whether a correction (not just a preference) was seen.
    """
    support = len({item.cluster for item in evidence})
    explicit = any(item.explicit for item in evidence)
    spread = len({item.cwd for item in evidence if item.cwd}) >= 2
    has_correction = any(item.kind == "correction" for item in evidence)

    score = 0
    if support >= 3:
        score += 2
    elif support == 2:
        score += 1
    if explicit:
        score += 1
    if spread:
        score += 1
    if has_correction:
        score += 1

    if score >= 3:
        return "strong"
    if score == 2:
        return "medium"
    return "weak"


def collect(
    rows: list[Thread],
    min_support: int,
    min_strength: str,
    *,
    decided: dict[str, dict[str, Any]] | None = None,
    include_decided: bool = False,
) -> list[dict[str, Any]]:
    decided = decided or {}
    grouped: dict[tuple[str, str, str], list[Evidence]] = defaultdict(list)
    for thread in rows:
        for message in user_messages(thread):
            if len(message) > 5000:
                continue
            for sentence in split_sentences(message):
                kind = sentence_kind(sentence)
                if kind is None:
                    continue
                suggestion = normalize_suggestion(sentence)
                if len(suggestion) < 25:
                    continue
                bucket, target = classify(sentence, thread)
                grouped[(bucket, target, suggestion)].append(
                    Evidence(
                        thread_id=thread.id,
                        title=thread.title,
                        updated_at=thread.updated_at,
                        rollout_path=thread.rollout_path,
                        cwd=thread.cwd,
                        cluster=cluster_key(thread, target),
                        kind=kind,
                        explicit=is_explicit(sentence),
                    )
                )

    proposals: list[dict[str, Any]] = []
    min_rank = STRENGTH_ORDER[min_strength]
    for (bucket, target, suggestion), evidence in grouped.items():
        support = len({item.cluster for item in evidence})
        if support < min_support:
            continue
        strength = strength_label(evidence)
        if STRENGTH_ORDER[strength] < min_rank:
            continue
        key = proposal_key(bucket, target, suggestion)
        decision = decided.get(key, {}).get("decision")
        if decision in {"rejected", "applied"} and not include_decided:
            continue
        kinds = {item.kind for item in evidence}
        proposals.append(
            {
                "key": key,
                "bucket": bucket,
                "target": target,
                "suggestion": suggestion,
                "support": support,
                "strength": strength,
                "kind": "correction" if "correction" in kinds else "preference",
                "decision": decision,
                "evidence": evidence,
            }
        )
    return sorted(
        proposals,
        key=lambda x: (x["bucket"], -STRENGTH_ORDER[x["strength"]], -x["support"], x["target"]),
    )


def triage_thread(thread: Thread) -> dict[str, Any]:
    text = all_messages(thread).lower()
    reasons: list[str] = []
    score = 0
    for reason, markers in TRIAGE_MARKERS.items():
        hits = sum(1 for marker in markers if marker in text)
        if hits:
            reasons.append(reason)
            score += min(3, hits)
    if "subagent" in thread.source.lower():
        score -= 2
        reasons.append("subagent")
    if thread.cwd and str(Path.cwd()) in thread.cwd:
        score += 2
        reasons.append("current-repo")
    return {
        "thread": thread,
        "score": max(0, score),
        "reasons": sorted(set(reasons)),
    }


def memory_files(limit: int = 12) -> list[Path]:
    if not MEMORIES_DIR.exists():
        return []
    files = [path for path in MEMORIES_DIR.rglob("*.md") if path.is_file()]
    return sorted(files, key=lambda path: path.stat().st_mtime, reverse=True)[:limit]


# --- proposal decision state -------------------------------------------------

def load_decisions() -> dict[str, dict[str, Any]]:
    if not DECISIONS_FILE.exists():
        return {}
    try:
        data = json.loads(DECISIONS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    return data.get("decided", {}) if isinstance(data, dict) else {}


def save_decisions(decided: dict[str, dict[str, Any]]) -> None:
    DECISIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    DECISIONS_FILE.write_text(
        json.dumps({"decided": decided}, indent=2, sort_keys=True), encoding="utf-8"
    )


# --- printers ----------------------------------------------------------------

def print_thread_table(rows: list[Thread]) -> None:
    print("Updated UTC         St Source       Model           CWD                              Title                            Thread")
    print("------------------- -- ------------ --------------- -------------------------------- -------------------------------- ------------------------------------")
    for row in rows:
        state = "AR" if row.archived else "AC"
        print(
            f"{utc(row.updated_at):<19} {state:<2} {shorten(row.source, 12):<12} "
            f"{shorten(row.model, 15):<15} {shorten(row.cwd, 32):<32} "
            f"{shorten(row.title, 32):<32} {row.id}"
        )


def print_proposals(proposals: list[dict[str, Any]], *, emit_patch: bool) -> None:
    if not proposals:
        print("No proposals met the support/strength thresholds.")
        return
    print("## Self-Improve Proposals\n")
    for bucket in PROPOSAL_BUCKETS:
        bucket_items = [item for item in proposals if item["bucket"] == bucket]
        if not bucket_items:
            continue
        print(f"### {bucket}\n")
        for item in bucket_items:
            decided = f" [decision: {item['decision']}]" if item.get("decision") else ""
            print(f"- Target: `{item['target']}`  (key `{item['key']}`){decided}")
            print(f"  Suggestion: {item['suggestion']}")
            print(f"  Kind: {item['kind']}")
            print(f"  Support: {item['support']}")
            print(f"  Strength: {item['strength']}")
            print("  Evidence:")
            for evidence in item["evidence"][:5]:
                print(
                    f"  - `{evidence.thread_id}` ({evidence.kind}) updated "
                    f"{utc(evidence.updated_at)} at `{evidence.rollout_path}`"
                )
            if emit_patch:
                print("  Draft patch note: propose this edit; do not apply without approval.")
            print()


# --- commands ----------------------------------------------------------------

def cmd_inventory(args: argparse.Namespace) -> None:
    print("## Self-Improve Sources\n")
    session_count = sqlite_count(STATE_DB, "threads")
    print(f"- Codex state DB: `{STATE_DB}` ({session_count if session_count is not None else 'unreadable'} threads)")
    print(f"- Sessions dir: `{CODEX_HOME / 'sessions'}` ({'present' if (CODEX_HOME / 'sessions').exists() else 'missing'})")
    print(f"- Archived sessions dir: `{CODEX_HOME / 'archived_sessions'}` ({'present' if (CODEX_HOME / 'archived_sessions').exists() else 'missing'})")
    print(f"- Session index: `{SESSION_INDEX}` ({'present' if SESSION_INDEX.exists() else 'missing'}; convenience only)")
    print(f"- Global instructions: `{GLOBAL_AGENTS}` ({'present' if GLOBAL_AGENTS.exists() else 'missing'})")
    print(f"- Memory file: `{MEMORY_MD}` ({'present' if MEMORY_MD.exists() else 'missing'})")
    memory_count = sqlite_count(MEMORIES_DB, "stage1_outputs")
    print(f"- Memory DB: `{MEMORIES_DB}` ({memory_count if memory_count is not None else 'unreadable or missing'} rollup rows)")
    print(f"- Decision log: `{DECISIONS_FILE}` ({len(load_decisions())} recorded decisions)")
    print("- Skill roots:")
    for root in SKILL_ROOTS:
        count = len(list(root.glob("*/SKILL.md"))) if root.exists() else 0
        print(f"  - `{root}` ({count} skills)")
    if args.memories:
        print("\n## Recent Memory Files\n")
        for path in memory_files(args.memories):
            print(f"- `{path}`")


def cmd_triage(args: argparse.Namespace) -> None:
    rows = threads(
        limit=args.limit,
        archived=args.archived,
        days=args.days,
        query=args.query,
        cwd=args.cwd,
    )
    ranked = [item for item in (triage_thread(thread) for thread in rows) if item["score"] >= args.min_score]
    ranked.sort(key=lambda item: (-item["score"], -item["thread"].updated_at))
    print("Score Updated UTC         Reasons                         CWD                              Title                            Thread")
    print("----- ------------------- ------------------------------- -------------------------------- -------------------------------- ------------------------------------")
    for item in ranked[: args.top]:
        thread = item["thread"]
        print(
            f"{item['score']:<5} {utc(thread.updated_at):<19} "
            f"{shorten(','.join(item['reasons']), 31):<31} {shorten(thread.cwd, 32):<32} "
            f"{shorten(thread.title, 32):<32} {thread.id}"
        )


def stage1_status(limit: int) -> tuple[int | None, int | None, list[sqlite3.Row]]:
    """Return (total summaries, unconsolidated count, unconsolidated rows).

    A `stage1_outputs` row is unconsolidated when `selected_for_phase2 = 0` —
    Codex generated a per-thread rollout summary but never promoted it into
    `MEMORY.md`. These are candidates for a proposed Memory Notes entry.
    """
    if not MEMORIES_DB.exists():
        return None, None, []
    try:
        with sqlite3.connect(MEMORIES_DB) as conn:
            conn.row_factory = sqlite3.Row
            total = conn.execute("SELECT count(*) FROM stage1_outputs").fetchone()[0]
            unconsolidated = conn.execute(
                "SELECT count(*) FROM stage1_outputs WHERE selected_for_phase2 = 0"
            ).fetchone()[0]
            rows = conn.execute(
                "SELECT thread_id, rollout_slug, source_updated_at, usage_count "
                "FROM stage1_outputs WHERE selected_for_phase2 = 0 "
                "ORDER BY source_updated_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
    except sqlite3.Error:
        return None, None, []
    return total, unconsolidated, rows


def cmd_memory_audit(args: argparse.Namespace) -> None:
    print("## Memory Audit\n")
    print(f"- Memory file: `{MEMORY_MD}` ({'present' if MEMORY_MD.exists() else 'missing'})")
    print(f"- Memory DB: `{MEMORIES_DB}` ({'present' if MEMORIES_DB.exists() else 'missing'})")
    print(f"- Raw memories: `{MEMORIES_DIR / 'raw_memories.md'}` ({'present' if (MEMORIES_DIR / 'raw_memories.md').exists() else 'missing'})")
    print(
        "\nThis command lists memory sources. It does not itself compare memory to "
        "session evidence — read the recent memory files below, then verify each "
        "claim against the cited transcripts before proposing a memory note.\n"
    )
    total, unconsolidated, rows = stage1_status(args.limit)
    if total is not None:
        print(
            f"- Stage1 summaries: {total} total, {unconsolidated} not yet consolidated "
            f"into `{MEMORY_MD}` (`selected_for_phase2 = 0`)\n"
        )
        if rows:
            print("## Unconsolidated Summaries (memory-promotion candidates)\n")
            for row in rows:
                print(
                    f"- `{row['thread_id']}` ({row['rollout_slug'] or 'no-slug'}) "
                    f"updated {utc(row['source_updated_at'])}, used {row['usage_count'] or 0}x — "
                    "read its rollout_summary in the DB, verify it against the transcript, then "
                    "propose a promoted Memory Notes entry if it is durable."
                )
            print()
    print("## Recent Memory Files\n")
    for path in memory_files(args.limit):
        print(f"- `{path}`")


def goal_health_rows(stale_days: int) -> list[dict[str, Any]]:
    """Flag durable goals stuck in a non-terminal, non-active state."""
    if not GOALS_DB.exists():
        return []
    cutoff_ms = int((datetime.now(tz=timezone.utc) - timedelta(days=stale_days)).timestamp() * 1000)
    try:
        with sqlite3.connect(GOALS_DB) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT thread_id, goal_id, objective, status, updated_at_ms FROM thread_goals "
                "WHERE status IN ('blocked', 'paused', 'usage_limited', 'budget_limited') "
                "ORDER BY updated_at_ms ASC"
            ).fetchall()
    except sqlite3.Error:
        return []
    return [{**dict(row), "stale": row["updated_at_ms"] < cutoff_ms} for row in rows]


def cmd_goal_health(args: argparse.Namespace) -> None:
    print("## Goal Health\n")
    print(f"- Goals DB: `{GOALS_DB}` ({'present' if GOALS_DB.exists() else 'missing'})")
    if not GOALS_DB.exists():
        return
    try:
        with sqlite3.connect(GOALS_DB) as conn:
            counts = conn.execute(
                "SELECT status, count(*) FROM thread_goals GROUP BY status"
            ).fetchall()
    except sqlite3.Error:
        print("Goals DB is unreadable.")
        return
    print("\n## Status Counts\n")
    for status, count in counts:
        print(f"- {status}: {count}")
    rows = goal_health_rows(args.stale_days)
    if not rows:
        print("\nNo blocked, paused, or limited goals found.")
        return
    print(f"\n## Needs Attention (stale threshold {args.stale_days}d)\n")
    for row in rows:
        flag = "STALE" if row["stale"] else "recent"
        print(
            f"- [{flag}] `{row['goal_id']}` ({row['status']}) — {shorten(row['objective'], 90)}\n"
            f"  thread `{row['thread_id']}`, last updated {utc(row['updated_at_ms'] // 1000)}"
        )
    print(
        "\nThis command only surfaces status; it does not revive, resume, or close "
        "goals. For each stale entry, read the thread (`show <thread_id>`) and propose "
        "revive (unblock, resume) or close (mark complete, abandon) — ultra-goal owns "
        "applying the goal-execution change."
    )


def cmd_list(args: argparse.Namespace) -> None:
    print_thread_table(
        threads(
            limit=args.limit,
            archived=args.archived,
            days=args.days,
            query=args.query,
            cwd=args.cwd,
        )
    )


def cmd_show(args: argparse.Namespace) -> None:
    thread = recent_thread() if args.thread_id == "latest" else thread_by_id(args.thread_id)
    if not thread:
        raise SystemExit(f"No thread found for {args.thread_id}")
    path = Path(thread.rollout_path)
    print(f"# {thread.title or thread.id}\n")
    print(f"- thread_id: `{thread.id}`")
    print(f"- updated_at: `{utc(thread.updated_at)}`")
    print(f"- cwd: `{thread.cwd}`")
    print(f"- rollout_path: `{path}`\n")
    if not path.exists():
        print("Rollout file not found.")
        return
    for payload in _message_payloads(thread):
        kind = payload.get("type")
        message = (payload.get("message") or "").strip()
        if not message:
            continue
        if kind == "user_message":
            print("## User\n")
            print(message)
            print()
        elif kind == "agent_message":
            print("## Assistant\n")
            print(message[: args.max_chars])
            if len(message) > args.max_chars:
                print("\n... truncated ...")
            print()


def cmd_skill_usage(args: argparse.Namespace) -> None:
    """Increment 2: which skills ran, how often, and where they hit friction.

    Heuristic and honest: skill use is detected from `$skill` tokens that match a
    known installed skill, explicit invocation markers, and matching tool-call
    names. Friction is co-occurring tool errors and frustration cues in the same
    thread. These are CANDIDATES for review, not verdicts."""
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query, cwd=args.cwd)
    known = known_skill_names()
    if not known:
        print("No installed skills found under the configured skill roots.")
        return

    per_skill_threads: dict[str, set[str]] = defaultdict(set)
    per_skill_uses: Counter = Counter()
    per_skill_friction: dict[str, list[Thread]] = defaultdict(list)
    scanned = 0
    for thread in rows:
        if not Path(thread.rollout_path).exists():
            continue
        scanned += 1
        sig = thread_signals(thread, known)
        has_friction = sig.error_outputs > 0 or sig.friction_cues > 0
        for skill, count in sig.skills.items():
            per_skill_threads[skill].add(thread.id)
            per_skill_uses[skill] += count
            if has_friction:
                per_skill_friction[skill].append(thread)

    print(f"## Skill Usage ({scanned} rollouts scanned, last {args.days} days)\n")
    if not per_skill_uses:
        print("No skill invocations detected in the scanned rollouts.")
        return
    print("Uses  Threads Friction Skill")
    print("----- ------- -------- --------------------------------")
    for skill, uses in per_skill_uses.most_common():
        n_threads = len(per_skill_threads[skill])
        n_friction = len(per_skill_friction[skill])
        print(f"{uses:<5} {n_threads:<7} {n_friction:<8} {skill}")

    print("\n## Where Skills May Have Gone Wrong (review candidates)\n")
    any_friction = False
    for skill in sorted(per_skill_friction, key=lambda s: -len(per_skill_friction[s])):
        threads_with_friction = per_skill_friction[skill]
        if not threads_with_friction:
            continue
        any_friction = True
        print(f"### `{skill}` — {len(threads_with_friction)} friction thread(s)\n")
        for thread in sorted(threads_with_friction, key=lambda t: -t.updated_at)[:5]:
            print(f"- `{thread.id}` updated {utc(thread.updated_at)} at `{thread.rollout_path}`")
        print()
    if not any_friction:
        print("No co-occurring friction detected. Read the highest-use skills for quality review anyway.\n")
    print(
        "Next: read the cited threads to confirm whether the skill underperformed, "
        "then propose a skill-by-skill fix (route source edits through skill-doctor)."
    )


def _detect_stack(root: Path) -> dict[str, bool]:
    def has(*names: str) -> bool:
        return any((root / name).exists() for name in names)

    def glob_any(pattern: str) -> bool:
        return any(True for _ in root.glob(pattern))

    return {
        "git": (root / ".git").exists(),
        "node": has("package.json"),
        "python": has("pyproject.toml", "setup.py", "requirements.txt"),
        "rust": has("Cargo.toml"),
        "go": has("go.mod"),
        "swift": has("Package.swift") or glob_any("*.xcodeproj"),
        "agents_md": has("AGENTS.md"),
        "agents_override": has("AGENTS.override.md"),
        "readme": has("README.md", "README.rst", "readme.md"),
        "ci_github": (root / ".github" / "workflows").is_dir(),
        "ci_gitlab": has(".gitlab-ci.yml"),
        "ci_circle": (root / ".circleci").is_dir(),
        "tests_dir": (root / "tests").is_dir() or (root / "test").is_dir(),
        "pytest": has("pytest.ini", "tox.ini") or glob_any("**/conftest.py"),
        "linter_ruff": has("ruff.toml", ".ruff.toml"),
        "linter_eslint": has(".eslintrc", ".eslintrc.json", ".eslintrc.js", "eslint.config.js"),
        "prettier": has(".prettierrc", ".prettierrc.json", "prettier.config.js"),
        "precommit": has(".pre-commit-config.yaml"),
        "editorconfig": has(".editorconfig"),
    }


def cmd_scaffold(args: argparse.Namespace) -> None:
    """Increment 3: inspect a repo and surface missing scaffolding + a research handoff.

    The script DETECTS presence/absence. It does not decide the recommendation —
    it emits a research handoff so the agent can run a follow-on pass (e.g. via the
    research skill with subagents) to choose CI/CD steps and matching skills."""
    root = Path(args.path or Path.cwd()).expanduser().resolve()
    if not root.is_dir():
        raise SystemExit(f"Not a directory: {root}")
    stack = _detect_stack(root)
    print(f"## Scaffolding Scan: `{root}`\n")

    languages = [lang for lang in ("node", "python", "rust", "go", "swift") if stack[lang]]
    print(f"- Detected stack: {', '.join(languages) or 'unknown'}")
    print(f"- Git repo: {'yes' if stack['git'] else 'no'}")
    print(f"- AGENTS.md: {'present' if stack['agents_md'] else 'MISSING'}"
          f"{' (+ AGENTS.override.md)' if stack['agents_override'] else ''}")
    print(f"- README: {'present' if stack['readme'] else 'MISSING'}")

    ci = [name.split('_', 1)[1] for name in ("ci_github", "ci_gitlab", "ci_circle") if stack[name]]
    print(f"- CI/CD: {', '.join(ci) if ci else 'MISSING'}")
    print(f"- Tests: {'present' if stack['tests_dir'] or stack['pytest'] else 'MISSING'}")
    linters = [n.split('_', 1)[-1] for n in ("linter_ruff", "linter_eslint", "prettier", "precommit") if stack[n]]
    print(f"- Lint/format: {', '.join(linters) if linters else 'MISSING'}")

    gaps = []
    if not stack["agents_md"]:
        gaps.append("No AGENTS.md — agents have no checked-in guidance. See references/agents-md.md.")
    if not (stack["ci_github"] or stack["ci_gitlab"] or stack["ci_circle"]):
        gaps.append("No CI/CD — no automated verification gate on changes.")
    if not (stack["tests_dir"] or stack["pytest"]):
        gaps.append("No test directory detected — no automated correctness signal.")
    if not linters:
        gaps.append("No linter/formatter config — mechanical quality is unenforced.")

    print("\n## Gaps\n")
    if gaps:
        for gap in gaps:
            print(f"- {gap}")
    else:
        print("- No top-level scaffolding gaps detected.")

    print("\n## Research Handoff (for the agent)\n")
    print("The script only detects presence/absence. Run a bounded research pass to decide:")
    print(f"- Which CI/CD verification steps fit a {', '.join(languages) or 'this'} repo "
          "(test command, lint, type-check, build) and how to wire them.")
    print("- Which installed skills fit this repo's stack and workflow "
          "(compare detected stack to the skill roots listed by `inventory`).")
    print("- Which Codex automations to recommend (see references/scaffolding-and-automations.md): "
          "a weekly self-improve automation, codex-action PR gating, or `@codex review`.")
    print("- Whether an AGENTS.md should be created or tightened (see references/agents-md.md).")
    print("\nDo not invent recommendations from this scan alone; verify against the repo and current docs.")


def cmd_dream(args: argparse.Namespace) -> None:
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query)
    decided = load_decisions()
    proposals = collect(
        rows, args.min_support, args.min_strength,
        decided=decided, include_decided=args.include_decided,
    )
    print_proposals(proposals, emit_patch=args.emit_patch)


def cmd_skill_audit(args: argparse.Namespace) -> None:
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query)
    decided = load_decisions()
    proposals = [
        proposal
        for proposal in collect(
            rows, args.min_support, args.min_strength,
            decided=decided, include_decided=args.include_decided,
        )
        if proposal["bucket"] in {"Skills", "New Skills"}
    ]
    print_proposals(proposals, emit_patch=args.emit_patch)


def cmd_deep(args: argparse.Namespace) -> None:
    """The flagship everything pass: orchestrates the other modes into one report."""
    print("# Self-Improve: Deep Improvement Pass\n")
    print("This is the orchestration spine. The script surfaces candidates across all")
    print("modes; you (the agent) read the highest-signal threads, extract the real")
    print("expected/actual/correction evidence, and propose the smallest durable change.\n")

    print("---\n")
    cmd_inventory(argparse.Namespace(memories=args.memories))

    print("\n---\n## Top Threads To Read\n")
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query, cwd=None)
    ranked = [item for item in (triage_thread(t) for t in rows) if item["score"] >= 2]
    ranked.sort(key=lambda item: (-item["score"], -item["thread"].updated_at))
    if ranked:
        print("Score Updated UTC         Reasons                         Title                            Thread")
        print("----- ------------------- ------------------------------- -------------------------------- ------------------------------------")
        for item in ranked[: args.top]:
            t = item["thread"]
            print(f"{item['score']:<5} {utc(t.updated_at):<19} "
                  f"{shorten(','.join(item['reasons']), 31):<31} {shorten(t.title, 32):<32} {t.id}")
    else:
        print("No high-signal threads in range.")

    print("\n---\n")
    decided = load_decisions()
    proposals = collect(
        rows, args.min_support, args.min_strength,
        decided=decided, include_decided=args.include_decided,
    )
    print_proposals(proposals, emit_patch=args.emit_patch)

    print("\n---\n")
    cmd_skill_usage(argparse.Namespace(
        limit=args.limit, archived=args.archived, days=args.days, query=args.query, cwd=None,
    ))

    if args.path:
        print("\n---\n")
        cmd_scaffold(argparse.Namespace(path=args.path))

    print("\n---\n")
    cmd_memory_audit(argparse.Namespace(limit=args.memories or 12))

    print("\n---\n")
    cmd_goal_health(argparse.Namespace(stale_days=7))


def cmd_decide(args: argparse.Namespace) -> None:
    decided = load_decisions()
    if args.action == "status":
        if not decided:
            print("No recorded proposal decisions.")
            return
        print("## Recorded Proposal Decisions\n")
        for key, record in sorted(decided.items(), key=lambda kv: kv[1].get("at", "")):
            note = f" — {record['note']}" if record.get("note") else ""
            print(f"- `{key}` {record.get('decision', '?')} at {record.get('at', '?')}{note}")
        return
    if not args.key:
        raise SystemExit("accept/reject/apply require a proposal key (see the `key` field in proposals)")
    decided[args.key] = {
        "decision": {"accept": "accepted", "reject": "rejected", "apply": "applied"}[args.action],
        "at": now_iso(),
        "note": args.note or "",
    }
    save_decisions(decided)
    print(f"Recorded `{args.key}` as {decided[args.key]['decision']}.")


# --- parser ------------------------------------------------------------------

def _add_mining_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--limit", type=int, default=250)
    parser.add_argument("--archived", choices=("active", "archived", "all"), default="all")
    parser.add_argument("--days", type=int, default=365)
    parser.add_argument("--query")
    parser.add_argument("--min-support", type=int, default=2)
    parser.add_argument("--min-strength", choices=("weak", "medium", "strong"), default="medium")
    parser.add_argument("--include-decided", action="store_true",
                        help="include proposals previously rejected or applied")
    parser.add_argument("--emit-patch", action="store_true")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Mine Codex sessions for durable improvement proposals.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    inventory_p = sub.add_parser("inventory", help="List session, memory, instruction, skill, and decision sources")
    inventory_p.add_argument("--memories", type=int, default=0, help="also list this many recent memory files")
    inventory_p.set_defaults(func=cmd_inventory)

    list_p = sub.add_parser("list", help="List Codex threads from state_5.sqlite")
    list_p.add_argument("--limit", type=int, default=25)
    list_p.add_argument("--archived", choices=("active", "archived", "all"), default="active")
    list_p.add_argument("--days", type=int)
    list_p.add_argument("--query")
    list_p.add_argument("--cwd")
    list_p.set_defaults(func=cmd_list)

    triage_p = sub.add_parser("triage", help="Rank threads likely to contain self-improvement evidence")
    triage_p.add_argument("--limit", type=int, default=100)
    triage_p.add_argument("--top", type=int, default=25)
    triage_p.add_argument("--archived", choices=("active", "archived", "all"), default="all")
    triage_p.add_argument("--days", type=int, default=30)
    triage_p.add_argument("--query")
    triage_p.add_argument("--cwd")
    triage_p.add_argument("--min-score", type=int, default=2)
    triage_p.set_defaults(func=cmd_triage)

    show_p = sub.add_parser("show", help="Render a thread transcript")
    show_p.add_argument("thread_id", help="exact thread id, id prefix, or 'latest'")
    show_p.add_argument("--max-chars", type=int, default=6000)
    show_p.set_defaults(func=cmd_show)

    memory_p = sub.add_parser("memory-audit", help="List memory sources and flag unconsolidated summaries")
    memory_p.add_argument("--limit", type=int, default=20)
    memory_p.set_defaults(func=cmd_memory_audit)

    goal_p = sub.add_parser("goal-health", help="Flag blocked/paused/stale durable goals for revive-or-close review")
    goal_p.add_argument("--stale-days", type=int, default=7)
    goal_p.set_defaults(func=cmd_goal_health)

    usage_p = sub.add_parser("skill-usage", help="Report which skills ran, how often, and where they hit friction")
    usage_p.add_argument("--limit", type=int, default=250)
    usage_p.add_argument("--archived", choices=("active", "archived", "all"), default="all")
    usage_p.add_argument("--days", type=int, default=7)
    usage_p.add_argument("--query")
    usage_p.add_argument("--cwd")
    usage_p.set_defaults(func=cmd_skill_usage)

    scaffold_p = sub.add_parser("scaffold", help="Inspect a repo for missing scaffolding + emit a research handoff")
    scaffold_p.add_argument("--path", help="repo directory to inspect (default: cwd)")
    scaffold_p.set_defaults(func=cmd_scaffold)

    decide_p = sub.add_parser("decide", help="Record a human decision on a proposal so it stops resurfacing")
    decide_p.add_argument("action", choices=("accept", "reject", "apply", "status"))
    decide_p.add_argument("key", nargs="?", help="proposal key from a proposals report")
    decide_p.add_argument("--note")
    decide_p.set_defaults(func=cmd_decide)

    dream_p = sub.add_parser("dream", help="Mine sessions for improvement proposals across all buckets")
    _add_mining_args(dream_p)
    dream_p.set_defaults(func=cmd_dream)

    audit_p = sub.add_parser("skill-audit", help="Mine sessions for skill-only improvement proposals")
    _add_mining_args(audit_p)
    audit_p.set_defaults(func=cmd_skill_audit)

    deep_p = sub.add_parser("deep", help="Flagship everything pass: orchestrate all modes into one report")
    _add_mining_args(deep_p)
    deep_p.add_argument("--top", type=int, default=15)
    deep_p.add_argument("--memories", type=int, default=10)
    deep_p.add_argument("--path", help="optional repo directory to also run a scaffolding scan on")
    deep_p.set_defaults(func=cmd_deep)

    return parser


def main() -> None:
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
