#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
from collections import defaultdict
from dataclasses import dataclass
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
SKILL_ROOTS = (
    CODEX_HOME / "skills",
    Path.home() / ".agents" / "skills",
    SOURCE_SKILLS_ROOT,
)

PREFERENCE_MARKERS = (
    "always",
    "default to",
    "do not",
    "don't",
    "i don't want",
    "i want you to",
    "keep ",
    "make sure",
    "never",
    "prefer",
    "preserve",
    "should",
    "instead of",
    "continue",
    "keep going",
    "don't stop",
    "come on",
    "can't you just",
)

NOISY_RE = re.compile(
    r"```|^#+\s|^[-+]{1,3}|^file:\s|^lines:\s|diff hunk|review findings",
    re.IGNORECASE,
)

COMMON_WORDS = {
    "about",
    "after",
    "again",
    "also",
    "because",
    "could",
    "doing",
    "have",
    "instead",
    "please",
    "should",
    "that",
    "their",
    "there",
    "these",
    "thing",
    "things",
    "this",
    "those",
    "using",
    "want",
    "would",
    "your",
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
    return [
        Thread(
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
        for row in rows
    ]


def thread_by_id(thread_id: str) -> Thread | None:
    rows = threads(limit=1, archived="all", query=None)
    del rows
    with sqlite3.connect(STATE_DB) as conn:
        row = conn.execute(
            """
            SELECT id, title, source, cwd, created_at, updated_at, archived,
                   coalesce(model, ''), rollout_path
            FROM threads
            WHERE id = ?
            """,
            (thread_id,),
        ).fetchone()
    if not row:
        return None
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


def user_messages(thread: Thread) -> list[str]:
    path = Path(thread.rollout_path)
    if not path.exists():
        return []
    out: list[str] = []
    for event in iter_events(path):
        if event.get("type") != "event_msg":
            continue
        payload = event.get("payload") or {}
        if payload.get("type") != "user_message":
            continue
        message = (payload.get("message") or "").strip()
        if message:
            out.append(message)
    return out


def all_messages(thread: Thread, *, max_chars: int = 20000) -> str:
    path = Path(thread.rollout_path)
    if not path.exists():
        return ""
    chunks: list[str] = [thread.title]
    total = len(thread.title)
    for event in iter_events(path):
        if event.get("type") != "event_msg":
            continue
        payload = event.get("payload") or {}
        kind = payload.get("type")
        if kind not in {"user_message", "agent_message"}:
            continue
        message = (payload.get("message") or "").strip()
        if not message:
            continue
        chunks.append(message)
        total += len(message)
        if total >= max_chars:
            break
    return "\n".join(chunks)


def split_sentences(message: str) -> Iterable[str]:
    normalized = re.sub(r"\s+", " ", message).strip()
    for chunk in re.split(r"(?<=[.!?])\s+|;\s+|\s+\|\s+", normalized):
        chunk = chunk.strip(" \t\r\n\"'`")
        if chunk:
            yield chunk


def looks_like_preference(sentence: str) -> bool:
    lowered = sentence.lower()
    if len(sentence) < 14 or len(sentence) > 600:
        return False
    if NOISY_RE.search(sentence):
        return False
    if sentence.endswith("?") and not any(token in lowered for token in ("prefer", "make sure", "default")):
        return False
    return any(marker in lowered for marker in PREFERENCE_MARKERS)


def normalize_suggestion(sentence: str) -> str:
    value = sentence.strip()
    value = re.sub(r"^(okay|ok|yeah|and then)[, ]+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^(can you|could you)\s+(please\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^make sure\s+(that\s+)?", "", value, flags=re.IGNORECASE)
    value = re.sub(r"^i want you to\s+", "", value, flags=re.IGNORECASE)
    value = re.sub(r"\s+", " ", value).strip(" .!?")
    lowered = value.lower()
    if lowered in {"continue", "keep going", "just keep going"} or "don't stop" in lowered:
        return "When the user says `continue`, `keep going`, or `don't stop`, continue the current task unless a real blocker or approval boundary exists."
    if "come on" in lowered or "can't you just" in lowered:
        return "Treat `Come on` or `can't you just...` as frustration cues; inspect the local environment directly, reduce prose, and move forward with concrete actions."
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


def skill_paths() -> list[Path]:
    paths: list[Path] = []
    for root in SKILL_ROOTS:
        if not root.exists():
            continue
        paths.extend(sorted(root.glob("*/SKILL.md")))
    return paths


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


def collect(rows: list[Thread], min_support: int, min_confidence: float) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str, str], list[Evidence]] = defaultdict(list)
    for thread in rows:
        for message in user_messages(thread):
            if len(message) > 5000:
                continue
            for sentence in split_sentences(message):
                if not looks_like_preference(sentence):
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
                    )
                )

    proposals: list[dict[str, Any]] = []
    for (bucket, target, suggestion), evidence in grouped.items():
        support = len({item.cluster for item in evidence})
        confidence = min(0.95, 0.38 + support * 0.14)
        if support < min_support or confidence < min_confidence:
            continue
        proposals.append(
            {
                "bucket": bucket,
                "target": target,
                "suggestion": suggestion,
                "support": support,
                "confidence": confidence,
                "evidence": evidence,
            }
        )
    return sorted(proposals, key=lambda x: (x["bucket"], -x["confidence"], x["target"]))


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


def cmd_memory_audit(args: argparse.Namespace) -> None:
    print("## Memory Audit\n")
    print(f"- Memory file: `{MEMORY_MD}` ({'present' if MEMORY_MD.exists() else 'missing'})")
    print(f"- Memory DB: `{MEMORIES_DB}` ({'present' if MEMORIES_DB.exists() else 'missing'})")
    print(f"- Raw memories: `{MEMORIES_DIR / 'raw_memories.md'}` ({'present' if (MEMORIES_DIR / 'raw_memories.md').exists() else 'missing'})")
    print("\nUse memories as supporting context. Verify proposed instruction changes against session transcripts before patching.\n")
    print("## Recent Memory Files\n")
    for path in memory_files(args.limit):
        print(f"- `{path}`")


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
    for event in iter_events(path):
        if event.get("type") != "event_msg":
            continue
        payload = event.get("payload") or {}
        kind = payload.get("type")
        if kind == "user_message":
            message = (payload.get("message") or "").strip()
            if message:
                print("## User\n")
                print(message)
                print()
        elif kind == "agent_message":
            message = (payload.get("message") or "").strip()
            if message:
                print("## Assistant\n")
                print(message[: args.max_chars])
                if len(message) > args.max_chars:
                    print("\n... truncated ...")
                print()


def print_proposals(proposals: list[dict[str, Any]], *, emit_patch: bool) -> None:
    if not proposals:
        print("No proposals met the support/confidence thresholds.")
        return
    print("## Self-Improve Proposals\n")
    buckets = (
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
    for bucket in buckets:
        bucket_items = [item for item in proposals if item["bucket"] == bucket]
        if not bucket_items:
            continue
        print(f"### {bucket}\n")
        for item in bucket_items:
            print(f"- Target: `{item['target']}`")
            print(f"  Suggestion: {item['suggestion']}")
            print(f"  Support: {item['support']}")
            print(f"  Confidence: {item['confidence']:.2f}")
            print("  Evidence:")
            for evidence in item["evidence"][:5]:
                print(
                    f"  - `{evidence.thread_id}` updated {utc(evidence.updated_at)} "
                    f"at `{evidence.rollout_path}`"
                )
            if emit_patch:
                print("  Draft patch note: propose this edit; do not apply without approval.")
            print()


def cmd_dream(args: argparse.Namespace) -> None:
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query)
    proposals = collect(rows, args.min_support, args.min_confidence)
    print_proposals(proposals, emit_patch=args.emit_patch)


def cmd_skill_audit(args: argparse.Namespace) -> None:
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query)
    proposals = [
        proposal
        for proposal in collect(rows, args.min_support, args.min_confidence)
        if proposal["bucket"] in {"Skills", "New Skills"}
    ]
    print_proposals(proposals, emit_patch=args.emit_patch)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Mine Codex sessions for durable improvement proposals.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    inventory_p = sub.add_parser("inventory", help="List available session, memory, instruction, and skill sources")
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
    show_p.add_argument("thread_id", help="exact thread id, or 'latest'")
    show_p.add_argument("--max-chars", type=int, default=6000)
    show_p.set_defaults(func=cmd_show)

    memory_p = sub.add_parser("memory-audit", help="List memory sources for supporting context")
    memory_p.add_argument("--limit", type=int, default=20)
    memory_p.set_defaults(func=cmd_memory_audit)

    for name, func in (("dream", cmd_dream), ("skill-audit", cmd_skill_audit)):
        p = sub.add_parser(name, help="Mine sessions for improvement proposals")
        p.add_argument("--limit", type=int, default=250)
        p.add_argument("--archived", choices=("active", "archived", "all"), default="all")
        p.add_argument("--days", type=int, default=365)
        p.add_argument("--query")
        p.add_argument("--min-support", type=int, default=2)
        p.add_argument("--min-confidence", type=float, default=0.6)
        p.add_argument("--emit-patch", action="store_true")
        p.set_defaults(func=func)

    return parser


def main() -> None:
    args = build_parser().parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
