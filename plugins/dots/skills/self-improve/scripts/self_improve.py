#!/usr/bin/env python3
"""Collect session evidence for a Codex or Claude Code workflow review.

The helper ranks evidence, extracts structured file activity, distinguishes
skill mentions from invocations, and derives aggregate statistics. It never
interprets findings or edits source.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


PLUGIN_SCRIPTS = Path(__file__).resolve().parents[3] / "scripts"
SKILL_SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(PLUGIN_SCRIPTS))
sys.path.insert(0, str(SKILL_SCRIPTS))

from codex_sessions import iter_session_events  # noqa: E402
from session_sources import (  # noqa: E402
    ClaudeSource,
    CodexSource,
    SessionRecord as Thread,
    SessionSource,
    parse_timestamp,
)


CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()
CLAUDE_HOME = Path(os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude")).expanduser()
SOURCE_SKILLS_ROOT = Path(__file__).resolve().parents[2]
# Derived per-session statistics, keyed by schema version + session id + mtime.
STATS_CACHE_FILE = CODEX_HOME / "self_improve_stats_cache.json"
STATS_SCHEMA = 5
PLATFORM = "codex"
SESSION_SOURCE: SessionSource = CodexSource(CODEX_HOME, iter_session_events)


def platform_paths(platform: str) -> dict[str, Any]:
    home = CODEX_HOME if platform == "codex" else CLAUDE_HOME
    plugin_cache = home / "plugins" / "cache"
    return {
        "home": home,
        "stats_cache": home / "self_improve_stats_cache.json",
        "skill_roots": (home / "skills", Path.home() / ".agents" / "skills", SOURCE_SKILLS_ROOT, plugin_cache),
        "plugin_cache": plugin_cache,
    }


def resolve_platform(requested: str) -> str:
    if requested != "auto":
        return requested
    configured = os.environ.get("SELF_IMPROVE_PLATFORM")
    if configured in {"codex", "claude"}:
        return configured
    if os.environ.get("CLAUDE_SESSION_ID") or os.environ.get("CLAUDECODE"):
        return "claude"
    if (CODEX_HOME / "state_5.sqlite").exists():
        return "codex"
    if (CLAUDE_HOME / "projects").exists():
        return "claude"
    raise SystemExit("No Codex or Claude Code session store found; pass --platform explicitly")


def configure_platform(platform: str) -> None:
    global PLATFORM, SESSION_SOURCE
    global STATS_CACHE_FILE, SKILL_ROOTS
    PLATFORM = platform
    paths = platform_paths(platform)
    STATS_CACHE_FILE = paths["stats_cache"]
    SKILL_ROOTS = paths["skill_roots"]
    SESSION_SOURCE = CodexSource(CODEX_HOME, iter_session_events) if platform == "codex" else ClaudeSource(CLAUDE_HOME)


configure_platform("codex")

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

# Coarse buckets for tool-output failures, ordered most specific first. Used only
# for aggregate profiling; a bucket is a lead about where friction concentrates.
ERROR_CATEGORIES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("Permission Denied", ("permission denied", "operation not permitted", "not authorized")),
    ("File Not Found", ("no such file or directory", "does not exist", "cannot find")),
    ("Edit Failed", ("string to replace not found", "no changes were made", "modified since")),
    ("Timeout", ("timed out", "timeout exceeded", "deadline exceeded")),
    ("Network", ("connection refused", "could not resolve host", "network is unreachable")),
    ("Crash Or Exception", ("traceback (most recent call last)", "segmentation fault", "unhandled exception")),
    ("Command Failed", ("exit code 1", "non-zero exit", "command not found", "fatal:")),
)

# Expected tool replies that read like failures but describe normal operation —
# a polling tool reporting that nothing arrived yet is not friction.
BENIGN_OUTPUT_MARKERS = (
    '"timed_out":true',
    "wait timed out",
    "no new events",
    "no output yet",
)

# The host's own interrupt sentinel is definitive.
INTERRUPT_SENTINEL_RE = re.compile(r"\[request interrupted", re.IGNORECASE)

# A stop phrase only means an interruption in a short imperative turn. A long task
# brief that happens to say "stop when done" is instruction, not interruption.
STOP_PHRASE_RE = re.compile(
    r"\b(?:stop|stop it|hold on|cancel that|never ?mind)\b|\bno,? (?:don't|do not|stop)\b",
    re.IGNORECASE,
)
SHORT_TURN_CHARS = 120


def _is_interruption(text: str) -> bool:
    if INTERRUPT_SENTINEL_RE.search(text):
        return True
    return len(text) <= SHORT_TURN_CHARS and bool(STOP_PHRASE_RE.search(text))

# Hosts inject instruction and context blocks that arrive with the user role but
# were never typed by the user. Counting them distorts message volume, timing,
# and every keyword signal derived from user turns.
INJECTED_USER_RE = re.compile(
    r"^\s*(?:"
    r"<(?:recommended_plugins|realtime_delegation|system[-_]reminder|user_instructions"
    r"|environment_context|instructions|context|persistent_state|memory|skill"
    r"|task[-_]notification|task[-_]reminder|local[-_]command[-_]caveat)\b"
    r"|#\s*(?:AGENTS|CLAUDE)\.md\b"
    r")",
    re.IGNORECASE,
)

# Report runs must not profile themselves. These markers identify a transcript
# whose early turns are a usage-report or self-improve pass.
SELF_REFERENTIAL_MARKERS = (
    "respond with only a valid json object",
    "self_improve.py",
    "self-improve insights",
    "agent usage review",
)

# File extension to language label, for aggregate language mix only.
LANGUAGE_BY_SUFFIX = {
    ".ts": "TypeScript", ".tsx": "TypeScript", ".js": "JavaScript", ".jsx": "JavaScript",
    ".py": "Python", ".rb": "Ruby", ".go": "Go", ".rs": "Rust", ".java": "Java",
    ".kt": "Kotlin", ".swift": "Swift", ".c": "C", ".h": "C", ".cpp": "C++", ".cc": "C++",
    ".hpp": "C++", ".cs": "C#", ".php": "PHP", ".lua": "Lua", ".sql": "SQL",
    ".md": "Markdown", ".json": "JSON", ".yaml": "YAML", ".yml": "YAML", ".toml": "TOML",
    ".sh": "Shell", ".zsh": "Shell", ".bash": "Shell", ".css": "CSS", ".scss": "CSS",
    ".html": "HTML", ".ipynb": "Notebook",
}

# Tool arguments that carry a real file path in a dedicated field (structured
# confidence per references/thread-evidence.md).
PATH_ARG_KEYS = ("file_path", "path", "notebook_path", "filePath", "target_file")
COMMAND_ARG_KEYS = ("command", "cmd", "script")

# Command classes used for validation-cost leads. These intentionally match
# executable-shaped tokens rather than prose mentioning "tests" or "build".
VALIDATION_COMMANDS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("Test", re.compile(
        r"(?:^|(?:&&|\|\||[;|])\s*)(?:python\d*\s+-m\s+(?:pytest|unittest)|pytest|"
        r"cargo\s+test|go\s+test|swift\s+test|xcodebuild\b[^\n]*\btest\b|"
        r"(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?test\b|"
        r"(?:gradle|\.\/gradlew)\s+\S*test\b|rspec|mix\s+test)"
    )),
    ("Type Check", re.compile(
        r"(?:^|(?:&&|\|\||[;|])\s*)(?:mypy|pyright|tsc(?:\s|$)|"
        r"(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:typecheck|type-check)\b)"
    )),
    ("Lint", re.compile(
        r"(?:^|(?:&&|\|\||[;|])\s*)(?:ruff(?:\s|$)|eslint|flake8|shellcheck|rubocop|"
        r"cargo\s+clippy|swiftlint|golangci-lint|"
        r"(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?lint\b)"
    )),
    ("Build", re.compile(
        r"(?:^|(?:&&|\|\||[;|])\s*)(?:cargo\s+build|go\s+build|swift\s+build|"
        r"xcodebuild\b[^\n]*\bbuild\b|(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?build\b|"
        r"(?:gradle|\.\/gradlew)\s+\S*build\b)"
    )),
    ("Validation", re.compile(
        r"(?:^|(?:&&|\|\||[;|])\s*)(?:[^\s;&|]*/)?(?:verify|validate)(?:\.sh|\.py)?(?:\s|$)|"
        r"quick_validate\.py(?:\s|$)"
    )),
)

EDIT_TOOL_NAMES = {
    "apply_patch", "edit", "multiedit", "write", "write_file", "notebookedit",
}

COMPLETION_CLAIM_RE = re.compile(
    r"\b(?:done|completed|finished|implemented|fixed|resolved|ready for review)\b",
    re.IGNORECASE,
)

RESPONSE_GAP_BUCKETS: tuple[tuple[str, int], ...] = (
    ("<10s", 10), ("10-30s", 30), ("30s-1m", 60), ("1-2m", 120),
    ("2-5m", 300), ("5-15m", 900), (">15m", 10**9),
)

# A resumed session's first-to-last span can cover days of wall clock, so summing
# spans overstates time worked. Engaged time sums consecutive event gaps and drops
# any gap longer than this, which bounds the total to plausible working time.
IDLE_GAP_SECONDS = 15 * 60

TRIAGE_MARKERS = {
    "correction": ("not what i asked", "wrong", "instead", "don't", "do not", "never"),
    "preference": ("prefer", "always", "default to", "i want you to", "make sure"),
    "persistence": ("continue", "keep going", "don't stop", "come on", "can't you just"),
    "skill": ("skill", "skill.md", "$", "plugin"),
    "tooling": ("tool", "script", "harness", "cli", "validation", "test", "verify"),
    "memory": ("memory", "remember", "forget", "chronicle"),
    "workflow": ("workflow", "process", "mode", "handoff", "pr", "commit", "review"),
}

# A raw $token is only a mention. Actual invocations require host-structured
# evidence so prompt drafts and pasted transcripts do not become usage.
SKILL_TOKEN_RE = re.compile(
    r"\$([a-z][a-z0-9]*(?:[a-z0-9-]*[a-z0-9])?(?::[a-z][a-z0-9]*(?:[a-z0-9-]*[a-z0-9])?)?)"
)
SKILL_BLOCK_RE = re.compile(
    r"^\s*<skill>\s*<name>\s*([^<]+?)\s*</name>.*?</skill>\s*$",
    re.IGNORECASE | re.DOTALL,
)
SKILL_ID_RE = re.compile(
    r"^[a-z][a-z0-9]*(?:[a-z0-9-]*[a-z0-9])?(?::[a-z][a-z0-9]*(?:[a-z0-9-]*[a-z0-9])?)?$"
)


def utc(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")


def shorten(value: str, width: int) -> str:
    value = " ".join((value or "").split())
    if len(value) <= width:
        return value
    return value[: max(1, width - 1)] + "..."


def threads(
    *,
    limit: int | None,
    archived: str,
    days: int | None = None,
    query: str | None = None,
    cwd: str | None = None,
) -> list[Thread]:
    return SESSION_SOURCE.list_sessions(
        limit=limit, archived=archived, days=days, query=query, cwd=cwd
    )


def thread_by_id(thread_id: str) -> Thread | None:
    rows = threads(limit=10_000, archived="all")
    exact = [thread for thread in rows if thread.id == thread_id]
    if exact:
        return exact[0]
    matches = [thread for thread in rows if thread.id.startswith(thread_id)]
    return matches[0] if matches else None


def recent_thread() -> Thread | None:
    rows = threads(limit=1, archived="all")
    return rows[0] if rows else None


def _message_payloads(thread: Thread) -> Iterable[dict[str, Any]]:
    """Yield message-bearing payloads from current and legacy rollouts."""
    try:
        for event in SESSION_SOURCE.events(thread):
            if event.kind != "message" or event.role not in {"user", "assistant"}:
                continue
            yield {
                "type": "user_message" if event.role == "user" else "agent_message",
                "message": event.text,
            }
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc


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
    # Hosts also emit tool output as a list of content blocks; flattening it is
    # required or error markers in block-form output are never seen.
    if isinstance(output, list):
        return " ".join(_output_text(item) for item in output)
    return ""


@dataclass
class ThreadSignals:
    """Heuristic per-thread signals. Candidate detection, not conclusions."""

    mentions: Counter = field(default_factory=Counter)
    invocations: Counter = field(default_factory=Counter)
    error_outputs: int = 0
    friction_cues: int = 0
    tool_calls: int = 0


def _skill_name(value: Any) -> str | None:
    name = str(value or "").strip().lower()
    return name if SKILL_ID_RE.fullmatch(name) else None


def _injected_skill_name(text: str, _known_skills: set[str] | None = None) -> str | None:
    match = SKILL_BLOCK_RE.match(text)
    if not match:
        return None
    return _skill_name(match.group(1))


def _tool_skill_name(payload: dict[str, Any], known_skills: set[str]) -> str | None:
    arguments = _arg_dict(payload)
    invoked = _skill_name(arguments.get("skill"))
    if invoked:
        return invoked
    name = str(payload.get("name") or "").strip().lower()
    namespace = str(payload.get("namespace") or "").strip().lower()
    for candidate in (name, namespace):
        if candidate in known_skills:
            return candidate
    return None


def thread_signals(thread: Thread, known_skills: set[str]) -> ThreadSignals:
    """Scan one rollout for mentions, structured invocations, and friction leads."""
    sig = ThreadSignals()
    seen_messages: set[tuple[str, str]] = set()
    try:
        for event in SESSION_SOURCE.events(thread, include_subagents=True):
            payload = event.payload or {}
            kind = event.kind
            if kind == "message":
                if event.role not in {"user", "assistant"}:
                    continue
                text = event.text
                message_key = (event.role, text)
                if message_key in seen_messages:
                    continue
                seen_messages.add(message_key)
                injected_skill = _injected_skill_name(text, known_skills)
                if injected_skill:
                    sig.invocations[injected_skill] += 1
                    continue
                if INJECTED_USER_RE.match(text):
                    continue
                lowered = text.lower()
                for token in SKILL_TOKEN_RE.findall(text):
                    skill = token.lower()
                    if skill in known_skills:
                        sig.mentions[skill] += 1
                for cue in FRICTION_CUES:
                    if cue in lowered:
                        sig.friction_cues += 1
            elif kind == "function_call":
                sig.tool_calls += 1
                invoked = _tool_skill_name(payload, known_skills)
                if invoked:
                    sig.invocations[invoked] += 1
            elif kind == "function_call_output":
                text = _output_text(payload.get("output"))[:2000].lower()
                if any(marker in text for marker in ERROR_MARKERS):
                    sig.error_outputs += 1
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    return sig


def friction_candidate_skills(signals: ThreadSignals) -> set[str]:
    if not (signals.error_outputs or signals.friction_cues):
        return set()
    return set(signals.invocations)


SOURCE_THREAD_RE = re.compile(r"<source_thread_id>([^<]+)</source_thread_id>", re.IGNORECASE)


def parent_thread_id(thread: Thread) -> str | None:
    """Return a declared parent without inferring one from incidental prose."""
    try:
        source = json.loads(thread.source)
    except (json.JSONDecodeError, TypeError):
        source = None
    if isinstance(source, dict):
        subagent = source.get("subagent")
        if isinstance(subagent, dict):
            thread_spawn = subagent.get("thread_spawn")
            if isinstance(thread_spawn, dict) and thread_spawn.get("parent_thread_id"):
                return str(thread_spawn["parent_thread_id"])
    match = SOURCE_THREAD_RE.search(thread.title)
    return match.group(1).strip() if match else None


def root_thread_id(thread: Thread, threads_by_id: dict[str, Thread]) -> str:
    """Resolve an explicit parent chain without inferring one from prose or title."""
    current = thread
    visited: set[str] = set()
    while current.id not in visited:
        visited.add(current.id)
        parent = parent_thread_id(current)
        if not parent:
            break
        parent_thread = threads_by_id.get(parent)
        if not parent_thread:
            return parent
        current = parent_thread
    return current.id


def conversation_turns(thread: Thread) -> tuple[tuple[str, str], ...]:
    """Return unique human/agent turns suitable for retry and resume matching."""
    turns: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()
    try:
        for event in SESSION_SOURCE.events(thread):
            if event.kind != "message" or event.role not in {"user", "assistant"}:
                continue
            text = " ".join(event.text.split())
            if not text or _injected_skill_name(text) or INJECTED_USER_RE.match(text):
                continue
            turn = (event.role, text)
            if turn in seen:
                continue
            seen.add(turn)
            turns.append(turn)
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    return tuple(turns)


def _is_resume_copy(left: tuple[tuple[str, str], ...], right: tuple[tuple[str, str], ...]) -> bool:
    """Match meaningful transcript copies while preserving independent short runs."""
    shorter, longer = sorted((left, right), key=len)
    roles = {role for role, _ in shorter}
    return (
        len(shorter) >= 4
        and roles == {"user", "assistant"}
        and longer[: len(shorter)] == shorter
    )


def session_cluster_keys(rows: list[Thread]) -> dict[str, str]:
    """Collapse explicit children and substantive transcript retry/resume copies."""
    threads_by_id = {thread.id: thread for thread in rows}
    roots = {thread.id: root_thread_id(thread, threads_by_id) for thread in rows}
    root_threads = {
        root_id: threads_by_id[root_id]
        for root_id in set(roots.values())
        if root_id in threads_by_id
    }
    parent = {root_id: root_id for root_id in root_threads}

    def find(thread_id: str) -> str:
        while parent[thread_id] != thread_id:
            parent[thread_id] = parent[parent[thread_id]]
            thread_id = parent[thread_id]
        return thread_id

    def union(left: str, right: str) -> None:
        left_root, right_root = find(left), find(right)
        if left_root != right_root:
            parent[max(left_root, right_root)] = min(left_root, right_root)

    turns = {thread_id: conversation_turns(thread) for thread_id, thread in root_threads.items()}
    comparable: dict[tuple[str, str], list[str]] = defaultdict(list)
    for thread_id, thread in root_threads.items():
        comparable[(thread.platform, thread.cwd)].append(thread_id)
    for thread_ids in comparable.values():
        for index, left in enumerate(thread_ids):
            for right in thread_ids[index + 1:]:
                if _is_resume_copy(turns[left], turns[right]):
                    union(left, right)

    keys: dict[str, str] = {}
    for thread in rows:
        root_id = roots[thread.id]
        if root_id not in root_threads:
            keys[thread.id] = f"{thread.platform}:parent:{root_id}"
            continue
        canonical = find(root_id)
        identity = f"{thread.platform}\0{thread.cwd}\0{canonical}"
        digest = hashlib.sha256(identity.encode("utf-8")).hexdigest()[:16]
        keys[thread.id] = f"{thread.platform}:thread:{digest}"
    return keys


def session_cluster_key(thread: Thread, threads_by_id: dict[str, Thread]) -> str:
    """Compatibility wrapper for callers that already hold a thread mapping."""
    return session_cluster_keys(list(threads_by_id.values()))[thread.id]


def skill_paths() -> list[Path]:
    paths: list[Path] = []
    plugin_cache = platform_paths(PLATFORM)["plugin_cache"]
    for root in SKILL_ROOTS:
        if not root.exists():
            continue
        if root == plugin_cache:
            paths.extend(sorted(root.glob("*/*/*/skills/*/SKILL.md")))
        else:
            paths.extend(sorted(root.glob("*/SKILL.md")))
    return list(dict.fromkeys(path.resolve() for path in paths))


def skill_ids(path: Path) -> set[str]:
    ids = {path.parent.name.lower()}
    plugin_cache = platform_paths(PLATFORM)["plugin_cache"]
    try:
        relative = path.resolve().relative_to(plugin_cache.resolve())
    except ValueError:
        return ids
    try:
        skills_index = relative.parts.index("skills")
    except ValueError:
        return ids
    if skills_index >= 2 and len(relative.parts) > skills_index + 1:
        ids.add(
            f"{relative.parts[skills_index - 2].lower()}:"
            f"{relative.parts[skills_index + 1].lower()}"
        )
    return ids


def known_skill_names() -> set[str]:
    return {skill_id for path in skill_paths() for skill_id in skill_ids(path)}


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


# --- derived session statistics ----------------------------------------------

def load_stats_cache() -> dict[str, dict[str, Any]]:
    if not STATS_CACHE_FILE.exists():
        return {}
    try:
        data = json.loads(STATS_CACHE_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    entries = data.get("sessions") if isinstance(data, dict) else None
    return entries if isinstance(entries, dict) else {}


def save_stats_cache(entries: dict[str, dict[str, Any]]) -> None:
    STATS_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATS_CACHE_FILE.write_text(
        json.dumps({"sessions": entries}, indent=2, sort_keys=True), encoding="utf-8"
    )


def stats_cache_key(thread: Thread) -> str:
    """Invalidate on transcript mtime so a growing session is recomputed.

    Bump STATS_SCHEMA whenever a derived field is added, removed, or redefined;
    otherwise a cached entry from an older shape is read as current."""
    try:
        mtime = int(Path(thread.rollout_path).stat().st_mtime)
    except OSError:
        mtime = thread.updated_at
    return f"v{STATS_SCHEMA}:{PLATFORM}:{thread.id}:{mtime}"


def _arg_dict(payload: dict[str, Any]) -> dict[str, Any]:
    arguments = payload.get("arguments") or payload.get("input") or {}
    if isinstance(arguments, str):
        try:
            arguments = json.loads(arguments)
        except json.JSONDecodeError:
            return {}
    return arguments if isinstance(arguments, dict) else {}


def _command_text(arguments: dict[str, Any]) -> str:
    for key in COMMAND_ARG_KEYS:
        value = arguments.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def _validation_category(command: str) -> str | None:
    lowered = " ".join(command.lower().split())
    for label, pattern in VALIDATION_COMMANDS:
        if pattern.search(lowered):
            return label
    return None


def _command_fingerprint(command: str) -> str:
    """Return a stable correlation token without retaining raw command text."""
    normalized = " ".join(command.strip().split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16]


def _output_failed(payload: dict[str, Any]) -> bool:
    text = _output_text(payload.get("output"))[:2000].lower()
    if any(marker in text for marker in ERROR_MARKERS):
        return True
    exit_code = payload.get("exit_code")
    return isinstance(exit_code, int) and exit_code != 0


def _error_category(text: str) -> str | None:
    if any(marker in text for marker in BENIGN_OUTPUT_MARKERS):
        return None
    for label, markers in ERROR_CATEGORIES:
        if any(marker in text for marker in markers):
            return label
    return None


def _is_self_referential(early_user_text: str) -> bool:
    return any(marker in early_user_text for marker in SELF_REFERENTIAL_MARKERS)


def derive_session_stats(thread: Thread, known_skills: set[str]) -> dict[str, Any]:
    """Derive one session's quantitative profile from its normalized event stream.

    Counts only what the stream states. Anything the host does not record stays
    absent rather than estimated, so the report can name its own coverage gaps.
    """
    tool_counts: Counter = Counter()
    error_categories: Counter = Counter()
    validation_categories: Counter = Counter()
    validation_seconds_by_category: Counter = Counter()
    validation_fingerprints: Counter = Counter()
    languages: Counter = Counter()
    skills: Counter = Counter()
    hours: Counter = Counter()
    files: set[str] = set()
    user_messages = 0
    injected_messages = 0
    assistant_messages = 0
    tool_calls = 0
    tool_errors = 0
    friction_cues = 0
    interruptions = 0
    commits = 0
    pushes = 0
    response_gaps: list[int] = []
    early_user_text: list[str] = []
    last_assistant_ts: int | None = None
    malformed: str | None = None
    engaged_seconds = 0
    stamped_events = 0
    previous_ts: int | None = None
    first_ts: int | None = None
    last_ts: int | None = None
    validation_calls = 0
    validation_paired = 0
    validation_timed = 0
    validation_unpaired = 0
    validation_ambiguous_outputs = 0
    validation_failed = 0
    validation_repeats = 0
    validation_total_seconds = 0
    validation_longest_seconds = 0
    validation_after_completion_claims = 0
    failure_edit_retest_cycles = 0
    completion_claim_seen = False
    validation_call_ids: set[str] = set()
    pending_validation: dict[str, dict[str, Any]] = {}
    failed_validation_after_edit: dict[str, bool] = {}

    try:
        for event in SESSION_SOURCE.events(thread):
            payload = event.payload or {}
            stamp = parse_timestamp(event.timestamp) if event.timestamp else None
            if stamp is not None:
                stamped_events += 1
                first_ts = stamp if first_ts is None else min(first_ts, stamp)
                last_ts = stamp if last_ts is None else max(last_ts, stamp)
                if previous_ts is not None:
                    delta = stamp - previous_ts
                    if 0 <= delta <= IDLE_GAP_SECONDS:
                        engaged_seconds += delta
                previous_ts = stamp
            if event.kind == "message":
                if event.role == "user":
                    injected_skill = _injected_skill_name(event.text, known_skills)
                    if injected_skill:
                        skills[injected_skill] += 1
                        injected_messages += 1
                        continue
                    if INJECTED_USER_RE.match(event.text):
                        injected_messages += 1
                        continue
                    user_messages += 1
                    lowered = event.text.lower()
                    if len(early_user_text) < 5:
                        early_user_text.append(lowered)
                    if any(cue in lowered for cue in FRICTION_CUES):
                        friction_cues += 1
                    if _is_interruption(event.text):
                        interruptions += 1
                    if stamp is not None:
                        hours[stamp // 3600 % 24] += 1
                        if last_assistant_ts is not None and stamp >= last_assistant_ts:
                            response_gaps.append(stamp - last_assistant_ts)
                elif event.role == "assistant":
                    assistant_messages += 1
                    if COMPLETION_CLAIM_RE.search(event.text):
                        completion_claim_seen = True
                    if stamp is not None:
                        last_assistant_ts = stamp
            elif event.kind == "function_call":
                tool_calls += 1
                name = str(payload.get("name") or "").strip()
                if name:
                    tool_counts[name] += 1
                arguments = _arg_dict(payload)
                lowered_name = name.lower()
                if lowered_name in EDIT_TOOL_NAMES:
                    for fingerprint in failed_validation_after_edit:
                        failed_validation_after_edit[fingerprint] = True
                for key in PATH_ARG_KEYS:
                    value = arguments.get(key)
                    if isinstance(value, str) and value:
                        files.add(value)
                        language = LANGUAGE_BY_SUFFIX.get(Path(value).suffix.lower())
                        if language:
                            languages[language] += 1
                command = _command_text(arguments)
                if command:
                    lowered = command.lower()
                    if "git commit" in lowered:
                        commits += 1
                    if "git push" in lowered:
                        pushes += 1
                    validation_category = _validation_category(command)
                    if validation_category:
                        fingerprint = _command_fingerprint(command)
                        validation_calls += 1
                        validation_categories[validation_category] += 1
                        if validation_fingerprints[fingerprint]:
                            validation_repeats += 1
                        validation_fingerprints[fingerprint] += 1
                        if completion_claim_seen:
                            validation_after_completion_claims += 1
                        if failed_validation_after_edit.get(fingerprint):
                            failure_edit_retest_cycles += 1
                            failed_validation_after_edit[fingerprint] = False
                        if event.call_id:
                            validation_call_ids.add(event.call_id)
                            pending_validation[event.call_id] = {
                                "category": validation_category,
                                "fingerprint": fingerprint,
                                "start": stamp,
                            }
                        else:
                            validation_unpaired += 1
                invoked = _tool_skill_name(payload, known_skills)
                if invoked:
                    skills[invoked] += 1
            elif event.kind == "function_call_output":
                text = _output_text(payload.get("output"))[:2000].lower()
                failed = _output_failed(payload)
                if failed:
                    tool_errors += 1
                category = _error_category(text)
                if category:
                    error_categories[category] += 1
                if event.call_id in validation_call_ids:
                    pending = pending_validation.pop(event.call_id, None)
                    if pending is None:
                        validation_ambiguous_outputs += 1
                    else:
                        validation_paired += 1
                        start = pending["start"]
                        if start is not None and stamp is not None and stamp >= start:
                            duration = stamp - start
                            validation_timed += 1
                            validation_total_seconds += duration
                            validation_longest_seconds = max(validation_longest_seconds, duration)
                            validation_seconds_by_category[pending["category"]] += duration
                        if failed:
                            validation_failed += 1
                            failed_validation_after_edit[pending["fingerprint"]] = False
    except ValueError as exc:
        # A malformed rollout line is reported, not silently dropped.
        malformed = str(exc)

    validation_unpaired += len(pending_validation)
    span_minutes = max(0, thread.updated_at - thread.created_at) // 60
    # Prefer the stamped event window; a record's span can predate a resume.
    if first_ts is not None and last_ts is not None:
        span_minutes = min(span_minutes, max(0, last_ts - first_ts) // 60) or span_minutes
    return {
        "session_id": thread.id,
        "platform": PLATFORM,
        "cwd": thread.cwd,
        "model": thread.model,
        "start": thread.created_at,
        "end": thread.updated_at,
        "duration_minutes": span_minutes,
        "engaged_minutes": engaged_seconds // 60,
        "stamped_events": stamped_events,
        "user_messages": user_messages,
        "injected_messages": injected_messages,
        "assistant_messages": assistant_messages,
        "tool_calls": tool_calls,
        "tool_counts": dict(tool_counts),
        "tool_errors": tool_errors,
        "error_categories": dict(error_categories),
        "validation_calls": validation_calls,
        "validation_categories": dict(validation_categories),
        "validation_paired": validation_paired,
        "validation_timed": validation_timed,
        "validation_unpaired": validation_unpaired,
        "validation_ambiguous_outputs": validation_ambiguous_outputs,
        "validation_failed": validation_failed,
        "validation_repeats": validation_repeats,
        "validation_total_seconds": validation_total_seconds,
        "validation_longest_seconds": validation_longest_seconds,
        "validation_seconds_by_category": dict(validation_seconds_by_category),
        "validation_fingerprints": dict(validation_fingerprints),
        "validation_after_completion_claims": validation_after_completion_claims,
        "failure_edit_retest_cycles": failure_edit_retest_cycles,
        "friction_cues": friction_cues,
        "interruptions": interruptions,
        "commits": commits,
        "pushes": pushes,
        "languages": dict(languages),
        "files_touched": len(files),
        "skills": dict(skills),
        "hours": {str(hour): count for hour, count in hours.items()},
        "response_gaps": response_gaps,
        "self_referential": _is_self_referential(" ".join(early_user_text)),
        "malformed": malformed,
    }


def is_low_signal(entry: dict[str, Any]) -> bool:
    """Drop sessions too small to describe how the user works."""
    return entry["user_messages"] < 2 or entry["duration_minutes"] < 1


def collect_session_stats(
    rows: list[Thread], *, max_new: int, refresh: bool
) -> tuple[list[dict[str, Any]], dict[str, int]]:
    """Return per-session stats plus a coverage record naming what was skipped."""
    known = known_skill_names()
    cache = load_stats_cache()
    coverage = {
        "listed": len(rows),
        "cached": 0,
        "computed": 0,
        "capped": 0,
        "missing_transcript": 0,
        "low_signal": 0,
        "self_referential": 0,
        "malformed": 0,
    }
    entries: list[dict[str, Any]] = []
    updated = False
    for thread in rows:
        if not Path(thread.rollout_path).exists():
            coverage["missing_transcript"] += 1
            continue
        key = stats_cache_key(thread)
        entry = None if refresh else cache.get(key)
        if entry is None:
            if coverage["computed"] >= max_new:
                coverage["capped"] += 1
                continue
            entry = derive_session_stats(thread, known)
            cache[key] = entry
            updated = True
            coverage["computed"] += 1
        else:
            coverage["cached"] += 1
        if entry.get("malformed"):
            coverage["malformed"] += 1
        if entry.get("self_referential"):
            coverage["self_referential"] += 1
            continue
        if is_low_signal(entry):
            coverage["low_signal"] += 1
            continue
        entries.append(entry)
    if updated:
        save_stats_cache(cache)
    entries.sort(key=lambda item: -item["end"])
    return entries, coverage


def _project_label(cwd: str) -> str:
    return Path(cwd).name if cwd else "unknown"


def aggregate_session_stats(entries: list[dict[str, Any]]) -> dict[str, Any]:
    tool_counts: Counter = Counter()
    error_categories: Counter = Counter()
    validation_categories: Counter = Counter()
    validation_seconds_by_category: Counter = Counter()
    validation_fingerprints: Counter = Counter()
    languages: Counter = Counter()
    skills: Counter = Counter()
    hours: Counter = Counter()
    projects: Counter = Counter()
    models: Counter = Counter()
    gaps: list[int] = []
    totals = Counter()
    for entry in entries:
        tool_counts.update(entry["tool_counts"])
        error_categories.update(entry["error_categories"])
        validation_categories.update(entry.get("validation_categories", {}))
        validation_seconds_by_category.update(entry.get("validation_seconds_by_category", {}))
        validation_fingerprints.update(entry.get("validation_fingerprints", {}))
        languages.update(entry["languages"])
        skills.update(entry["skills"])
        hours.update({int(hour): count for hour, count in entry["hours"].items()})
        projects[_project_label(entry["cwd"])] += 1
        if entry["model"]:
            models[entry["model"]] += 1
        gaps.extend(entry["response_gaps"])
        for field_name in (
            "user_messages", "injected_messages", "assistant_messages", "tool_calls", "tool_errors",
            "friction_cues", "interruptions", "commits", "pushes",
            "duration_minutes", "engaged_minutes", "files_touched", "stamped_events",
            "validation_calls", "validation_paired", "validation_timed",
            "validation_unpaired", "validation_ambiguous_outputs", "validation_failed",
            "validation_repeats", "validation_total_seconds",
            "validation_after_completion_claims", "failure_edit_retest_cycles",
        ):
            totals[field_name] += entry.get(field_name, 0)

    gap_histogram: dict[str, int] = {label: 0 for label, _ in RESPONSE_GAP_BUCKETS}
    for gap in gaps:
        for label, ceiling in RESPONSE_GAP_BUCKETS:
            if gap < ceiling:
                gap_histogram[label] += 1
                break

    installed = sorted(known_skill_names())
    return {
        "platform": PLATFORM,
        "sessions": len(entries),
        "date_range": {
            "start": utc(min(entry["start"] for entry in entries)) if entries else "",
            "end": utc(max(entry["end"] for entry in entries)) if entries else "",
        },
        "totals": dict(totals),
        "hours_engaged": round(totals["engaged_minutes"] / 60, 1),
        "hours_span": round(totals["duration_minutes"] / 60, 1),
        "projects": projects.most_common(),
        "models": models.most_common(),
        "tools": tool_counts.most_common(),
        "error_categories": error_categories.most_common(),
        "validation_categories": validation_categories.most_common(),
        "validation_seconds_by_category": validation_seconds_by_category.most_common(),
        "validation_longest_seconds": max(
            (entry.get("validation_longest_seconds", 0) for entry in entries), default=0
        ),
        "validation_repeated_fingerprints": sum(
            1 for count in validation_fingerprints.values() if count > 1
        ),
        "languages": languages.most_common(),
        "skills_used": skills.most_common(),
        "skills_installed_unused": [name for name in installed if name not in skills],
        "response_gap_histogram": gap_histogram,
        "response_gap_samples": len(gaps),
        "hour_histogram": {str(hour): hours.get(hour, 0) for hour in range(24)},
    }


# --- printers ----------------------------------------------------------------

# --- commands ----------------------------------------------------------------

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


def cmd_show(args: argparse.Namespace) -> None:
    thread = recent_thread() if args.thread_id == "latest" else thread_by_id(args.thread_id)
    if not thread:
        raise SystemExit(f"No thread found for {args.thread_id}")
    path = Path(thread.rollout_path)
    print(f"# {thread.title or thread.id}\n")
    print(f"- platform: `{thread.platform}`")
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


def _argument_paths(value: Any, key: str = "") -> Iterable[str]:
    if isinstance(value, dict):
        for child_key, child in value.items():
            yield from _argument_paths(child, str(child_key))
    elif isinstance(value, list):
        for child in value:
            yield from _argument_paths(child, key)
    elif isinstance(value, str) and key.lower() in {
        "file", "file_path", "filepath", "path", "paths", "notebook_path", "target",
    }:
        yield value


def cmd_files(args: argparse.Namespace) -> None:
    thread = recent_thread() if args.thread_id == "latest" else thread_by_id(args.thread_id)
    if not thread:
        raise SystemExit(f"No {PLATFORM} session found for {args.thread_id}")
    found: dict[str, tuple[str, bool]] = {}
    try:
        for event in SESSION_SOURCE.events(thread, include_subagents=True):
            if event.kind != "function_call":
                continue
            payload = event.payload or {}
            arguments = payload.get("arguments") or {}
            if isinstance(arguments, str):
                try:
                    arguments = json.loads(arguments)
                except json.JSONDecodeError:
                    continue
            for original in _argument_paths(arguments):
                path = Path(original).expanduser()
                if not path.is_absolute():
                    path = Path(thread.cwd or Path.cwd()) / path
                resolved = str(path.resolve(strict=False))
                found[resolved] = (original, path.exists())
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc
    print(f"# Files: {thread.title or thread.id}\n")
    print(f"- platform: `{thread.platform}`")
    print(f"- session_id: `{thread.id}`\n")
    if not found:
        print("No structured file references found.")
        return
    for resolved, (original, exists) in sorted(found.items()):
        print(f"- `{resolved}` ({'present' if exists else 'missing'}; recorded as `{original}`)")


def cmd_skill_usage(args: argparse.Namespace) -> None:
    """Separate prose mentions, structured invocations, and friction leads."""
    cutoff = int(datetime.now(tz=timezone.utc).timestamp())
    rows = threads(limit=None, archived=args.archived, days=args.days, cwd=args.cwd)
    rows = [thread for thread in rows if thread.updated_at <= cutoff]
    if args.limit is not None:
        rows = rows[: args.limit]
    known = known_skill_names()
    selected = _skill_name(args.skill) if args.skill else None
    if args.skill and not selected:
        raise SystemExit(f"Invalid skill id: {args.skill}")
    mention_names = known | ({selected} if selected else set())

    cluster_keys = session_cluster_keys(rows)
    per_skill_mentions: Counter = Counter()
    per_skill_clusters: dict[str, dict[str, Thread]] = defaultdict(dict)
    per_skill_friction: dict[str, dict[str, Thread]] = defaultdict(dict)
    scanned = 0
    for thread in rows:
        if not Path(thread.rollout_path).exists():
            continue
        scanned += 1
        sig = thread_signals(thread, mention_names)
        per_skill_mentions.update(sig.mentions)
        cluster = cluster_keys[thread.id]
        for skill in sig.invocations:
            representative = per_skill_clusters[skill].get(cluster)
            if representative is None or thread.updated_at > representative.updated_at:
                per_skill_clusters[skill][cluster] = thread
            if skill in friction_candidate_skills(sig):
                per_skill_friction[skill].setdefault(cluster, thread)

    window = f"last {args.days} days" if args.days is not None else "whole retained window"
    print(f"## Skill Usage ({scanned} rollouts scanned, {window})\n")
    print(f"- Cohort cutoff: `{utc(cutoff)}`")
    print(f"- Requested limit: `{args.limit if args.limit is not None else 'none'}`")
    if selected:
        print(f"- Exact skill filter: `{selected}`")
    print()
    reported = set(per_skill_mentions) | set(per_skill_clusters)
    if selected:
        reported &= {selected}
    if not reported:
        print("No skill mentions or invocations detected in the scanned rollouts.")
        return
    print("Mentions Invoked Friction candidates Resolution Skill")
    print("-------- ------- ------------------- ---------- --------------------------------")
    ordered = sorted(reported, key=lambda skill: (-len(per_skill_clusters[skill]), -per_skill_mentions[skill], skill))
    for skill in ordered:
        n_friction = len(per_skill_friction[skill])
        resolution = "current" if skill in known else "historical/local"
        print(
            f"{per_skill_mentions[skill]:<8} {len(per_skill_clusters[skill]):<7} "
            f"{n_friction:<19} {resolution:<10} {skill}"
        )

    print(
        "\nInvoked counts host-injected skill blocks and exact structured tool "
        "calls after collapsing delegated children and retries. Friction candidates "
        "are thread-level co-occurrences, not causal findings.\n"
    )

    print("## Invocation Ledger\n")
    print("Status Resolution Skill Representative Updated UTC Rollout")
    print("------ ---------- ----- -------------- ----------- -------")
    for skill in ordered:
        for cluster, thread in sorted(
            per_skill_clusters[skill].items(), key=lambda item: -item[1].updated_at
        ):
            status = "friction" if cluster in per_skill_friction[skill] else "invoked"
            resolution = "current" if skill in known else "historical/local"
            print(
                f"{status:<8} {resolution:<10} {skill} {thread.id} "
                f"{utc(thread.updated_at)} {thread.rollout_path}"
            )
    print()
    print(
        "Next: use this frozen representative ledger to read every invocation. "
        "Explain what the successful and friction clusters say about the user's "
        "workflow before proposing any skill change."
    )


def cmd_stats(args: argparse.Namespace) -> None:
    """Emit structured aggregate evidence for downstream interpretation."""
    rows = threads(limit=args.limit, archived=args.archived, days=args.days, query=args.query, cwd=args.cwd)
    entries, coverage = collect_session_stats(rows, max_new=args.max_new, refresh=args.refresh)
    summary = aggregate_session_stats(entries)
    print(json.dumps({"summary": summary, "coverage": coverage, "sessions": entries}, indent=2))


# --- parser ------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Collect Codex or Claude Code session evidence.")
    parser.add_argument("--platform", choices=("auto", "codex", "claude"), default="auto")
    sub = parser.add_subparsers(dest="cmd", required=True)

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

    files_p = sub.add_parser("files", help="List structured file references from a session")
    files_p.add_argument("thread_id", help="exact session id, id prefix, or 'latest'")
    files_p.set_defaults(func=cmd_files)

    usage_p = sub.add_parser("skill-usage", help="Report which skills ran, how often, and where they hit friction")
    usage_p.add_argument("--limit", type=int, default=250)
    usage_p.add_argument("--archived", choices=("active", "archived", "all"), default="all")
    usage_p.add_argument("--days", type=int, default=7)
    usage_p.add_argument("--skill", help="filter the completed scan by exact skill id")
    usage_p.add_argument("--cwd")
    usage_p.set_defaults(func=cmd_skill_usage)

    stats_p = sub.add_parser("stats", help="Collect aggregate session evidence")
    stats_p.add_argument("--limit", type=int)
    stats_p.add_argument("--archived", choices=("active", "archived", "all"), default="all")
    stats_p.add_argument("--days", type=int)
    stats_p.add_argument("--query")
    stats_p.add_argument("--cwd")
    stats_p.add_argument("--max-new", type=int, default=200,
                         help="cap on sessions derived this run; capped sessions are reported")
    stats_p.add_argument("--refresh", action="store_true", help="ignore the cache and recompute")
    stats_p.set_defaults(func=cmd_stats)

    return parser


def main() -> None:
    args = build_parser().parse_args()
    configure_platform(resolve_platform(args.platform))
    args.func(args)


if __name__ == "__main__":
    main()
