"""Eval suite manifest loading and selection helpers."""

from pathlib import Path

from .errors import CliError
from .ids import require_id
from .io import read_json
from .workbench_paths import workbench_path


SOURCE_KINDS = {"branch", "current_worktree", "git_ref", "local_path", "none"}
DEFAULT_CANDIDATES = [
    {"candidate": "no-skill", "display": "No skill baseline", "source": {"kind": "none"}},
    {"candidate": "current", "display": "Current skill", "source": {"kind": "current_worktree", "ref": "."}},
]
DEFAULT_EVALS = {
    "skill_name": "TODO",
    "target": {"type": "skill", "ref": "SKILL.md"},
    "defaults": {
        "runner": "codex_app_server",
        "repetitions": 1,
    },
    "candidates": DEFAULT_CANDIDATES,
    "cases": [],
}


def suite_path(raw):
    path = Path(raw).expanduser() if raw else workbench_path(Path.cwd()) / "evals.json"
    if path.is_dir():
        path = workbench_path(path) / "evals.json"
    return path.resolve()


def workbench_from_suite(path):
    return path.parent


def project_from_suite(path):
    if path.parent.name.startswith("."):
        return path.parent.parent
    return path.parent


def case_dir(workbench, case_id):
    return workbench / "cases" / require_id("case id", case_id)


def task_sources(case):
    task = case.get("task") or {}
    sources = []
    if task.get("prompt") is not None:
        sources.append("prompt")
    if task.get("path"):
        sources.append("path")
    return sources


def is_prompt_case(case):
    return task_sources(case) == ["prompt"]


def load_manifest(path):
    data = read_json(path)
    if not isinstance(data, dict):
        raise CliError("eval suite must be a JSON object", 2)
    if data.get("schema_version") != 1:
        raise CliError("only evals.json schema_version 1 is supported", 2)
    if not isinstance(data.get("cases", []), list):
        raise CliError("evals.json cases must be a list", 2)
    if not isinstance(data.get("candidates", []), list) or not data.get("candidates"):
        raise CliError("evals.json candidates must be a non-empty list", 2)
    seen_case_ids = set()
    for case in data.get("cases", []):
        if not isinstance(case, dict):
            raise CliError("evals.json cases must be objects", 2)
        case_id = require_id("case id", case.get("id"))
        if case_id in seen_case_ids:
            raise CliError(f"duplicate case id: {case_id}", 2)
        seen_case_ids.add(case_id)
        task = case.get("task") or {}
        if not isinstance(task, dict):
            raise CliError(f"case {case_id} task must be an object", 2)
        sources = task_sources(case)
        if len(sources) != 1:
            raise CliError(f"case {case_id} must set exactly one task source: inline prompt or task path", 2)
        if "expectations" in case:
            expectations = case.get("expectations")
            if not isinstance(expectations, list) or not all(isinstance(item, str) and item.strip() for item in expectations):
                raise CliError(f"case {case_id} expectations must be non-empty strings", 2)
        if "fixtures" in case and (not isinstance(case.get("fixtures"), list) or not all(isinstance(item, str) and item.strip() for item in case.get("fixtures"))):
            raise CliError(f"case {case_id} fixtures must be non-empty strings", 2)
        graders = case.get("graders", [])
        if not isinstance(graders, list):
            raise CliError(f"case {case_id} graders must be a list", 2)
        for grader in graders:
            if not isinstance(grader, dict):
                raise CliError(f"case {case_id} graders must be objects", 2)
            if grader.get("kind") not in {"code", "model", "human"}:
                raise CliError(f"case {case_id} grader kind must be code, model, or human", 2)
            if grader.get("kind") == "human" and grader.get("path"):
                raise CliError(f"case {case_id} human grader must not set path", 2)
            if "uses_transcript" in grader and not isinstance(grader.get("uses_transcript"), bool):
                raise CliError(f"case {case_id} grader uses_transcript must be boolean", 2)
    seen_candidate_ids = set()
    for candidate in data.get("candidates", []):
        if not isinstance(candidate, dict):
            raise CliError("evals.json candidates must be objects", 2)
        candidate_id = require_id("candidate", candidate.get("candidate"))
        if candidate_id in seen_candidate_ids:
            raise CliError(f"duplicate candidate: {candidate_id}", 2)
        seen_candidate_ids.add(candidate_id)
        source = candidate.get("source") or {}
        kind = source.get("kind", "current_worktree")
        ref = source.get("ref")
        if kind not in SOURCE_KINDS:
            raise CliError(f"candidate {candidate_id} source.kind must be one of branch, current_worktree, git_ref, local_path, or none", 2)
        if kind == "none" and ref:
            raise CliError(f"candidate {candidate_id} source.kind none must not set ref", 2)
        if kind == "current_worktree" and ref not in (None, "."):
            raise CliError(f"candidate {candidate_id} source.kind current_worktree must not set a git ref", 2)
        if kind in {"branch", "git_ref"} and not ref:
            raise CliError(f"candidate {candidate_id} source.kind {kind} must set ref", 2)
        if kind in {"branch", "git_ref"} and ref == ".":
            raise CliError(f"candidate {candidate_id} source.kind {kind} must use a git ref, not .", 2)
        if kind == "local_path" and not (source.get("path") or ref):
            raise CliError(f"candidate {candidate_id} source.kind local_path must set path", 2)
    return data


def case_task_info(case):
    task = case.get("task") or {}
    if task.get("prompt") is not None:
        return {"source": "prompt", "path": None, "prompt": task.get("prompt") or ""}
    return {"source": "path", "path": task.get("path") or "task.md", "prompt": None}


def select_cases(manifest, split):
    cases = manifest.get("cases", [])
    if split:
        cases = [case for case in cases if case.get("split") == split]
    return cases


def filter_cases(cases, *, case_ids=None, case_types=None):
    selected = list(cases)
    wanted_ids = set(case_ids or [])
    wanted_types = set(case_types or [])
    if wanted_ids:
        selected = [case for case in selected if case.get("id") in wanted_ids]
    if wanted_types:
        selected = [case for case in selected if (case.get("type") or "unspecified") in wanted_types]
    return selected


def split_csv_or_repeat(values):
    out = []
    for value in values or []:
        out.extend(item.strip() for item in str(value).split(",") if item.strip())
    return out


def select_candidates(manifest, raw):
    candidates = manifest.get("candidates", [])
    if raw:
        wanted = {item.strip() for item in raw.split(",") if item.strip()}
        candidates = [candidate for candidate in candidates if candidate.get("candidate") in wanted]
    if not candidates:
        raise CliError("no candidates selected", 2)
    for candidate in candidates:
        if not candidate.get("candidate"):
            raise CliError("candidate missing candidate field", 2)
    return candidates


def trial_prompt(task_text):
    return task_text.strip() + "\n"
