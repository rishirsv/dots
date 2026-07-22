"""Eval suite loading, validation, and selection helpers."""

from datetime import date
from pathlib import Path

from .eval_stats import calibration_metrics
from .errors import CliError
from .ids import require_id
from .io import read_json
from .scenario_format import load_scenario_suite
from .workbench_paths import evals_path, repository_root, skill_id_for_target, state_root


SOURCE_KINDS = {"current_worktree", "git_ref", "local_path", "none"}
CASE_TYPES = {"attached", "near_miss", "capability", "regression", "failure"}
EVALUATION_MODES = {"diagnostic", "readiness", "benchmark"}
OUTCOME_TYPES = {"response", "artifact", "stateful"}
REPETITION_POLICIES = {"any_trial", "all_trials"}
DEFAULT_CANDIDATES = [
    {"candidate": "no-skill", "display": "No skill baseline", "source": {"kind": "none"}},
    {"candidate": "current", "display": "Current skill", "source": {"kind": "current_worktree", "ref": "."}},
]
DEFAULT_EVALS = {
    "schema_version": 2,
    "skill_name": "TODO",
    "evaluation_mode": "diagnostic",
    "target": {"type": "skill", "ref": "SKILL.md"},
    "defaults": {
        "runner": "codex_exec",
        "repetitions": 1,
        "repetition_policy": "all_trials",
        "timeout_seconds": 600,
    },
    "candidates": DEFAULT_CANDIDATES,
    "evals": [],
}


def suite_path(raw):
    path = Path(raw).expanduser() if raw else evals_path(Path.cwd())
    if path.is_dir():
        if path.name != "evals":
            path = evals_path(path)
    return path.resolve()


def workbench_from_suite(path):
    return state_root(project_from_suite(path))


def project_from_suite(path):
    path = Path(path)
    if path.is_dir() and path.name == "evals":
        return path.parent.resolve()
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
    if suite.is_dir() and suite.name == "evals":
        return suite / require_id("case id", case_id)
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


def _relative_support_path(case_id, raw, label):
    if not isinstance(raw, str) or not raw.strip():
        raise CliError(f"case {case_id} {label} must be a non-empty relative path", 2)
    path = Path(raw)
    if path.is_absolute() or ".." in path.parts:
        raise CliError(f"case {case_id} {label} must stay inside its case folder", 2)
    return raw


def _validate_calibration(case_id, grader):
    calibration = grader.get("calibration")
    if grader.get("advisory"):
        if calibration is not None and not isinstance(calibration, dict):
            raise CliError(f"case {case_id} model grader calibration must be an object", 2)
        return
    if not isinstance(calibration, dict):
        raise CliError(
            f"case {case_id} load-bearing model grader {grader['id']} needs held-out calibration",
            2,
        )
    for field in ("dataset_id", "data_period", "validated_at", "model", "reasoning_effort", "judge_sha256"):
        if not isinstance(calibration.get(field), str) or not calibration[field].strip():
            raise CliError(f"case {case_id} model calibration {field} must be a non-empty string", 2)
    digest = calibration["judge_sha256"]
    if len(digest) != 64 or any(char not in "0123456789abcdef" for char in digest.lower()):
        raise CliError(f"case {case_id} model calibration judge_sha256 must be a SHA-256 hex digest", 2)
    if grader.get("model") != calibration.get("model"):
        raise CliError(f"case {case_id} calibrated model grader must pin the calibrated model", 2)
    if grader.get("reasoning_effort") != calibration.get("reasoning_effort"):
        raise CliError(f"case {case_id} calibrated model grader must pin the calibrated reasoning effort", 2)
    confidence = calibration.get("confidence_level", 0.95)
    if isinstance(confidence, bool) or not isinstance(confidence, (int, float)) or not 0.8 <= confidence < 1:
        raise CliError(f"case {case_id} model calibration confidence_level must be in [0.8, 1)", 2)
    for field in ("minimum_tpr", "minimum_tnr"):
        value = calibration.get(field, 0.9)
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not 0 < value <= 1:
            raise CliError(f"case {case_id} model calibration {field} must be in (0, 1]", 2)
    test = calibration.get("test")
    required = {"true_positive", "false_negative", "true_negative", "false_positive"}
    if not isinstance(test, dict) or set(test) != required:
        raise CliError(f"case {case_id} model calibration test must contain the full confusion matrix", 2)
    if any(isinstance(test[field], bool) or not isinstance(test[field], int) or test[field] < 0 for field in required):
        raise CliError(f"case {case_id} model calibration confusion counts must be non-negative integers", 2)
    metrics = calibration_metrics(calibration)
    if not metrics["fail_count"] or not metrics["pass_count"]:
        raise CliError(f"case {case_id} model calibration needs held-out Pass and Fail examples", 2)
    if metrics["tpr_interval"][0] < calibration.get("minimum_tpr", 0.9):
        raise CliError(f"case {case_id} model calibration TPR lower bound is below its trust threshold", 2)
    if metrics["tnr_interval"][0] < calibration.get("minimum_tnr", 0.9):
        raise CliError(f"case {case_id} model calibration TNR lower bound is below its trust threshold", 2)


def _validate_grader(case_id, grader):
    if not isinstance(grader, dict):
        raise CliError(f"case {case_id} graders must be objects", 2)
    if grader.get("kind") not in {"code", "model", "human"}:
        raise CliError(f"case {case_id} grader kind must be code, model, or human", 2)
    require_id(f"case {case_id} grader id", grader.get("id"))
    if grader.get("kind") == "human" and grader.get("path"):
        raise CliError(f"case {case_id} human grader must not set path", 2)
    if grader.get("kind") in {"code", "model"}:
        _relative_support_path(case_id, grader.get("path"), f"grader {grader['id']} path")
    if grader.get("kind") == "code" and grader.get("scope", "exact") not in {"exact", "open_ended"}:
        raise CliError(f"case {case_id} code grader scope must be exact or open_ended", 2)
    if "uses_transcript" in grader and not isinstance(grader.get("uses_transcript"), bool):
        raise CliError(f"case {case_id} grader uses_transcript must be boolean", 2)
    if "uses_state" in grader and not isinstance(grader.get("uses_state"), bool):
        raise CliError(f"case {case_id} grader uses_state must be boolean", 2)
    if "advisory" in grader and not isinstance(grader.get("advisory"), bool):
        raise CliError(f"case {case_id} grader advisory must be boolean", 2)
    if grader.get("kind") == "model":
        if not grader.get("advisory"):
            if not isinstance(grader.get("model"), str) or not grader["model"].strip():
                raise CliError(f"case {case_id} load-bearing model grader must pin model", 2)
            if grader.get("reasoning_effort") not in {"none", "minimal", "low", "medium", "high", "xhigh"}:
                raise CliError(f"case {case_id} load-bearing model grader must pin reasoning_effort", 2)
        _validate_calibration(case_id, grader)


def _validate_grader_tests(case, graders):
    case_id = case["id"]
    tests = case.get("grader_tests", [])
    if not isinstance(tests, list):
        raise CliError(f"case {case_id} grader_tests must be a list", 2)
    grader_ids = {grader["id"] for grader in graders}
    seen = set()
    for test in tests:
        if not isinstance(test, dict):
            raise CliError(f"case {case_id} grader_tests must be objects", 2)
        test_id = require_id(f"case {case_id} grader test id", test.get("id"))
        if test_id in seen:
            raise CliError(f"case {case_id} duplicate grader test id: {test_id}", 2)
        seen.add(test_id)
        if test.get("grader") not in grader_ids:
            raise CliError(f"case {case_id} grader test {test_id} names an unknown grader", 2)
        if test.get("expected") not in {"pass", "fail"}:
            raise CliError(f"case {case_id} grader test {test_id} expected must be pass or fail", 2)
        _relative_support_path(case_id, test.get("path"), f"grader test {test_id} path")
    for grader in graders:
        if grader["kind"] != "code" or grader.get("advisory"):
            continue
        labels = {test.get("expected") for test in tests if test.get("grader") == grader["id"]}
        if labels != {"pass", "fail"}:
            raise CliError(
                f"case {case_id} load-bearing code grader {grader['id']} needs known Pass and Fail tests",
                2,
            )
    for grader in graders:
        if grader["kind"] != "code" or grader.get("scope", "exact") != "open_ended":
            continue
        if not grader.get("advisory"):
            raise CliError(
                f"case {case_id} open-ended code grader {grader['id']} must be advisory",
                2,
            )
        pass_tests = [
            test for test in tests
            if test.get("grader") == grader["id"] and test.get("expected") == "pass"
        ]
        if len(pass_tests) < 2:
            raise CliError(
                f"case {case_id} open-ended code grader {grader['id']} needs at least two valid-output fixtures",
                2,
            )
        if not any(
            test.get("grader") == grader["id"] and test.get("expected") == "fail"
            for test in tests
        ):
            raise CliError(
                f"case {case_id} open-ended code grader {grader['id']} needs a known invalid-output fixture",
                2,
            )
        if not any(
            other.get("kind") in {"model", "human"} and not other.get("advisory")
            for other in graders
        ):
            raise CliError(
                f"case {case_id} open-ended code grader {grader['id']} needs a load-bearing human or calibrated model grader",
                2,
            )


def _validate_validity_review(data, mode):
    review = data.get("validity_review")
    if review is None and mode == "diagnostic":
        return
    if not isinstance(review, dict):
        raise CliError(f"{mode} suites need validity_review", 2)
    if review.get("status") not in {"pass", "fail", "unknown"}:
        raise CliError("validity_review.status must be pass, fail, or unknown", 2)
    if not isinstance(review.get("notes"), str) or not review["notes"].strip():
        raise CliError("validity_review.notes must be a non-empty string", 2)


def _validate_evaluation_design(data, cases):
    mode = data.get("evaluation_mode", "diagnostic")
    if mode not in EVALUATION_MODES:
        raise CliError(f"evaluation_mode must be one of {', '.join(sorted(EVALUATION_MODES))}", 2)
    defaults = data.get("defaults") or {}
    policy = defaults.get("repetition_policy", "all_trials")
    if policy not in REPETITION_POLICIES:
        raise CliError(f"defaults.repetition_policy must be one of {', '.join(sorted(REPETITION_POLICIES))}", 2)
    _validate_validity_review(data, mode)
    requirements = data.get("coverage_requirements", [])
    if not isinstance(requirements, list) or not all(isinstance(item, str) and item.strip() for item in requirements):
        raise CliError("coverage_requirements must be non-empty strings", 2)
    if mode in {"readiness", "benchmark"}:
        if len(cases) < 20:
            raise CliError(f"{mode} suites need at least 20 cases; use diagnostic for focused checks", 2)
        if not requirements:
            raise CliError(f"{mode} suites need coverage_requirements", 2)
        untagged = [case["id"] for case in cases if not case.get("coverage")]
        if untagged:
            raise CliError(f"{mode} cases need coverage tags: {', '.join(untagged)}", 2)
        covered = {tag for case in cases for tag in case.get("coverage", [])}
        missing = sorted(set(requirements) - covered)
        if missing:
            raise CliError(f"{mode} suite is missing required coverage: {', '.join(missing)}", 2)
    if mode == "benchmark":
        benchmark = data.get("benchmark")
        if not isinstance(benchmark, dict):
            raise CliError("benchmark suites need benchmark provenance", 2)
        for field in ("name", "source", "version", "held_out_split", "contamination_controls", "freshness"):
            if not isinstance(benchmark.get(field), str) or not benchmark[field].strip():
                raise CliError(f"benchmark.{field} must be a non-empty string", 2)
        splits = {case.get("split") for case in cases}
        if None in splits or benchmark["held_out_split"] not in splits or len(splits) < 2:
            raise CliError("benchmark suites need declared development and held-out splits on every case", 2)


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
    if kind == "git_ref" and (not ref or ref == "."):
        raise CliError(f"candidate {candidate_id} source.kind {kind} must set a git ref", 2)
    if kind == "local_path" and not (source.get("path") or ref):
        raise CliError(f"candidate {candidate_id} source.kind local_path must set path", 2)


def _normalize_variant(variant):
    if not isinstance(variant, dict):
        raise CliError("experiment variants must be objects", 2)
    variant_id = variant.get("variant") or variant.get("id")
    require_id("variant", variant_id)
    skill = variant.get("skill") or {"kind": "none"}
    if not isinstance(skill, dict):
        raise CliError(f"variant {variant_id} skill must be an object", 2)
    model = variant.get("model")
    if isinstance(model, str):
        model = {"name": model}
    if model is not None and (not isinstance(model, dict) or not isinstance(model.get("name"), str)):
        raise CliError(f"variant {variant_id} model must name a model", 2)
    for field in ("tools", "plugins"):
        value = variant.get(field, [])
        if not isinstance(value, list) or not all(isinstance(item, str) and item for item in value):
            raise CliError(f"variant {variant_id} {field} must be a list of names", 2)
    return {
        **variant,
        "variant": variant_id,
        "candidate": variant_id,
        "display": variant.get("display") or variant_id,
        "source": skill,
        "model": model,
    }


def load_manifest(path):
    path = Path(path)
    if path.is_dir():
        experiment_path = state_root(path.parent) / "experiment.json"
        experiment = read_json(experiment_path) if experiment_path.is_file() else None
        data = load_scenario_suite(path, experiment)
        data["candidates"] = [_normalize_variant(row) for row in data.pop("variants")]
    else:
        data = read_json(path)
        if isinstance(data, dict) and "variants" in data:
            data = {**data, "candidates": [_normalize_variant(row) for row in data["variants"]]}
    if not isinstance(data, dict):
        raise CliError("evals.json must be a JSON object", 2)
    if data.get("schema_version") not in {2, 3}:
        raise CliError("only standard scenarios or custom eval schema_version 2 are supported", 2)
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
        outcome = case.get("outcome", "response")
        if outcome not in OUTCOME_TYPES:
            raise CliError(f"case {case_id} outcome must be one of {', '.join(sorted(OUTCOME_TYPES))}", 2)
        if case.get("priority") is not None and case.get("priority") not in {"high", "medium", "low"}:
            raise CliError(f"case {case_id} priority must be high, medium, or low", 2)
        if case.get("split") is not None and (
            not isinstance(case.get("split"), str) or not case["split"].strip()
        ):
            raise CliError(f"case {case_id} split must be a non-empty string", 2)
        if case.get("created_at") is not None:
            if not isinstance(case.get("created_at"), str):
                raise CliError(f"case {case_id} created_at must be an ISO date", 2)
            try:
                date.fromisoformat(case["created_at"])
            except ValueError as exc:
                raise CliError(f"case {case_id} created_at must be an ISO date", 2) from exc
        coverage = case.get("coverage", [])
        if not isinstance(coverage, list) or not all(isinstance(item, str) and item.strip() for item in coverage):
            raise CliError(f"case {case_id} coverage must be non-empty strings", 2)
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
            if grader.get("kind") != "weighted_checklist":
                _validate_grader(case_id, grader)
        _validate_grader_tests(case, graders)
        state_capture = case.get("state_capture")
        if state_capture is not None:
            _relative_support_path(case_id, state_capture, "state_capture")
        if outcome == "stateful":
            if not state_capture:
                raise CliError(f"case {case_id} stateful outcome needs state_capture", 2)
            if not any(
                grader.get("kind") == "code"
                and grader.get("uses_state")
                and not grader.get("advisory")
                for grader in graders
            ):
                raise CliError(f"case {case_id} stateful outcome needs a load-bearing state-aware code grader", 2)

    seen_candidate_ids = set()
    for candidate in candidates:
        _validate_candidate(candidate, seen_candidate_ids)
    _validate_evaluation_design(data, cases)
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


select_variants = select_candidates


def trial_prompt(text):
    return text if text.endswith("\n") else text + "\n"
