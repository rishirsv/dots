"""Eval suite loading, validation, and selection helpers."""

from pathlib import Path

from .errors import CliError
from .ids import require_id
from .io import read_json
from .workbench_paths import evals_path, repository_root, skill_id_for_target, state_root


SOURCE_KINDS = {"branch", "current_worktree", "git_ref", "local_path", "none"}
CASE_TYPES = {"attached", "near_miss", "capability", "regression", "failure"}
DEFAULT_CANDIDATES = [
    {"candidate": "no-skill", "display": "No skill baseline", "source": {"kind": "none"}},
    {"candidate": "current", "display": "Current skill", "source": {"kind": "current_worktree", "ref": "."}},
]
DEFAULT_EVALS = {
    "schema_version": 2,
    "skill_name": "TODO",
    "target": {"type": "skill", "ref": "SKILL.md"},
    "defaults": {"runner": "codex_exec", "repetitions": 1, "timeout_seconds": 600},
    "candidates": DEFAULT_CANDIDATES,
    "evals": [],
}


def suite_path(raw):
    path = Path(raw).expanduser() if raw else evals_path(Path.cwd())
    if path.is_dir():
        path = path / "evals.json" if path.name == "evals" else evals_path(path)
    return path.resolve()


def workbench_from_suite(path):
    return state_root(project_from_suite(path))


def project_from_suite(path):
    path = Path(path)
    workspace = path.parent.parent if path.parent.name == "evals" else path.parent
    skill_dir = workspace.parent
    if workspace.name.startswith(".") and (skill_dir / "SKILL.md").is_file():
        return skill_dir
    return workspace


def repository_from_suite(path):
    return repository_root(project_from_suite(path))


def skill_id_from_suite(path):
    return skill_id_for_target(project_from_suite(path), root=repository_from_suite(path))


def runs_from_suite(path):
    return workbench_from_suite(path) / "runs"


def worktrees_from_suite(path):
    return workbench_from_suite(path) / "worktrees"


def case_dir(suite, case_id):
    suite = Path(suite)
    evals_root = suite.parent if suite.name == "evals.json" else suite
    return evals_root / "cases" / require_id("case id", case_id)


def _path_source(case, field, default_name):
    value = case.get(field)
    if isinstance(value, str):
        if not value.strip():
            raise CliError(f"case {case.get('id')} {field} must be a non-empty string", 2)
        return {"source": "inline", "text": value, "path": None}
    if isinstance(value, dict) and set(value) == {"path"}:
        raw_path = value.get("path")
        if not isinstance(raw_path, str) or not raw_path.strip():
            raise CliError(f"case {case.get('id')} {field}.path must be a non-empty string", 2)
        path = Path(raw_path)
        if path.is_absolute() or ".." in path.parts or path.as_posix() != default_name:
            raise CliError(f"case {case.get('id')} {field}.path must be {default_name}", 2)
        return {"source": "path", "text": None, "path": default_name}
    if value is None and field == "expected_output":
        return None
    raise CliError(
        f"case {case.get('id')} {field} must be a string or {{\"path\": \"{default_name}\"}}",
        2,
    )


def prompt_info(case):
    return _path_source(case, "prompt", "task.md")


def expected_output_info(case):
    return _path_source(case, "expected_output", "expected.md")


def is_inline_prompt(case):
    return prompt_info(case)["source"] == "inline"


def _validate_grader(case_id, grader):
    if not isinstance(grader, dict):
        raise CliError(f"case {case_id} graders must be objects", 2)
    if grader.get("kind") not in {"code", "model", "human"}:
        raise CliError(f"case {case_id} grader kind must be code, model, or human", 2)
    if grader.get("kind") == "human" and grader.get("path"):
        raise CliError(f"case {case_id} human grader must not set path", 2)
    if "uses_transcript" in grader and not isinstance(grader.get("uses_transcript"), bool):
        raise CliError(f"case {case_id} grader uses_transcript must be boolean", 2)
    if "advisory" in grader and not isinstance(grader.get("advisory"), bool):
        raise CliError(f"case {case_id} grader advisory must be boolean", 2)


def _validate_candidate(candidate, seen):
    if not isinstance(candidate, dict):
        raise CliError("evals.json candidates must be objects", 2)
    candidate_id = require_id("candidate", candidate.get("candidate"))
    if candidate_id in seen:
        raise CliError(f"duplicate candidate: {candidate_id}", 2)
    seen.add(candidate_id)
    source = candidate.get("source") or {}
    kind = source.get("kind", "current_worktree")
    ref = source.get("ref")
    if kind not in SOURCE_KINDS:
        raise CliError(f"candidate {candidate_id} source.kind must be one of {', '.join(sorted(SOURCE_KINDS))}", 2)
    if candidate_id == "no-skill" and kind != "none":
        raise CliError("candidate id no-skill is reserved for a source.kind none baseline", 2)
    if kind == "none" and ref:
        raise CliError(f"candidate {candidate_id} source.kind none must not set ref", 2)
    if kind == "current_worktree" and ref not in (None, "."):
        raise CliError(f"candidate {candidate_id} current_worktree ref must be . when present", 2)
    if kind in {"branch", "git_ref"} and (not ref or ref == "."):
        raise CliError(f"candidate {candidate_id} source.kind {kind} must set a git ref", 2)
    if kind == "local_path" and not (source.get("path") or ref):
        raise CliError(f"candidate {candidate_id} source.kind local_path must set path", 2)


def load_manifest(path):
    data = read_json(Path(path))
    if not isinstance(data, dict):
        raise CliError("evals.json must be a JSON object", 2)
    if data.get("schema_version") != 2:
        raise CliError("only evals.json schema_version 2 is supported; migrate legacy suites first", 2)
    if "cases" in data:
        raise CliError("legacy cases[] suites are no longer supported; migrate to schema_version 2 evals[]", 2)
    if "profiles" in data:
        raise CliError("eval run profiles are no longer supported", 2)
    cases = data.get("evals", [])
    candidates = data.get("candidates")
    if candidates is None:
        candidates = [dict(candidate) for candidate in DEFAULT_CANDIDATES]
        data = {**data, "candidates": candidates}
    if not isinstance(cases, list):
        raise CliError("evals.json evals must be a list", 2)
    if not isinstance(candidates, list) or not candidates:
        raise CliError("evals.json candidates must be a non-empty list when present", 2)
    if data.get("objective") is not None and (
        not isinstance(data.get("objective"), str) or not data.get("objective").strip()
    ):
        raise CliError("evals.json objective must be a non-empty string", 2)

    seen_case_ids = set()
    for case in cases:
        if not isinstance(case, dict):
            raise CliError("evals.json evals must be objects", 2)
        case_id = require_id("case id", case.get("id"))
        if case_id in seen_case_ids:
            raise CliError(f"duplicate case id: {case_id}", 2)
        seen_case_ids.add(case_id)
        if "task" in case:
            raise CliError(f"case {case_id} task is no longer supported; use prompt", 2)
        prompt_info(case)
        expected_output_info(case)
        case_type = case.get("type")
        if case_type and case_type not in CASE_TYPES:
            raise CliError(f"case {case_id} type must be one of {', '.join(sorted(CASE_TYPES))}", 2)
        if case.get("priority") is not None and case.get("priority") not in {"high", "medium", "low"}:
            raise CliError(f"case {case_id} priority must be high, medium, or low", 2)
        expectations = case.get("expectations", [])
        if not isinstance(expectations, list) or not all(isinstance(item, str) and item.strip() for item in expectations):
            raise CliError(f"case {case_id} expectations must be non-empty strings", 2)
        fixtures = case.get("fixtures", [])
        if not isinstance(fixtures, list) or not all(isinstance(item, str) and item.strip() for item in fixtures):
            raise CliError(f"case {case_id} fixtures must be non-empty strings", 2)
        annotations = case.get("annotations", [])
        if not isinstance(annotations, list) or not all(
            isinstance(item, dict)
            and isinstance(item.get("tag"), str)
            and item.get("tag").strip()
            and isinstance(item.get("note"), str)
            and item.get("note").strip()
            and isinstance(item.get("judge_use", "exclude"), str)
            and item.get("judge_use", "exclude") in {"rubric", "evidence", "exclude"}
            for item in annotations
        ):
            raise CliError(
                f"case {case_id} annotations must contain tag and note strings; "
                "judge_use must be rubric, evidence, or exclude when present",
                2,
            )
        graders = case.get("graders", [])
        if not isinstance(graders, list):
            raise CliError(f"case {case_id} graders must be a list", 2)
        for grader in graders:
            _validate_grader(case_id, grader)

    seen_candidate_ids = set()
    for candidate in candidates:
        _validate_candidate(candidate, seen_candidate_ids)
    return data


def select_cases(manifest, split=None, *, case_ids=None, case_types=None):
    cases = list(manifest.get("evals", []))
    if split:
        cases = [case for case in cases if case.get("split") == split]
    if case_ids:
        wanted = set(case_ids)
        unknown = sorted(wanted - {case.get("id") for case in cases})
        if unknown:
            raise CliError(f"unknown evals selected: {', '.join(unknown)}", 2)
        cases = [case for case in cases if case.get("id") in wanted]
    if case_types:
        wanted = set(case_types)
        cases = [case for case in cases if case.get("type") in wanted]
    return cases


def split_csv_or_repeat(values):
    out = []
    for value in values or []:
        out.extend(item.strip() for item in str(value).split(",") if item.strip())
    return out


def select_candidates(manifest, raw=None, *, include_baseline=True, baseline_id=None):
    candidates = list(manifest.get("candidates", []))
    requested = {item.strip() for item in str(raw or "").split(",") if item.strip()}
    if baseline_id:
        requested.add(str(baseline_id))
    if raw:
        candidates = [candidate for candidate in candidates if candidate.get("candidate") in requested]
    elif baseline_id:
        candidates = [candidate for candidate in candidates if candidate.get("candidate") in requested]
    if requested:
        unknown = sorted(requested - {candidate.get("candidate") for candidate in manifest.get("candidates", [])})
        if unknown:
            raise CliError(f"unknown candidates selected: {', '.join(unknown)}", 2)
    if baseline_id:
        include_baseline = False
    if include_baseline and not any((candidate.get("source") or {}).get("kind") == "none" for candidate in candidates):
        baseline = next(
            (candidate for candidate in manifest.get("candidates", []) if (candidate.get("source") or {}).get("kind") == "none"),
            DEFAULT_CANDIDATES[0],
        )
        candidates.insert(0, baseline)
    if not include_baseline and not baseline_id:
        candidates = [candidate for candidate in candidates if (candidate.get("source") or {}).get("kind") != "none"]
    if not candidates:
        raise CliError("no candidates selected", 2)
    return candidates


def trial_prompt(text):
    return text if text.endswith("\n") else text + "\n"
