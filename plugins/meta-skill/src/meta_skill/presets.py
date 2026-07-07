"""Eval preset loading, linting, running, and reporting."""

from __future__ import annotations

from pathlib import Path

from .errors import CliError
from .ids import require_id
from .io import read_json, read_jsonl
from .manifest import filter_cases, load_manifest, select_cases, suite_path, workbench_from_suite
from .report import build_comparisons, build_report, list_runs, md_cell, md_table, trial_behavior_state
from .verdicts import latest_grade_rows, require_grade_status


ALLOWED_METRICS = {
    "behavior_pass_rate",
    "comparison_counts",
    "gate_failures",
    "unknown_rate",
    "tokens",
}
ALLOWED_GATE_KEYS = {"metric", "required_label", "grader", "scope", "candidate", "candidates"}
ALLOWED_GATE_LABELS = {"pass", "partial", "fail", "unknown"}
ALLOWED_GATE_SCOPES = {"payloads", "baseline", "all"}
ALLOWED_INTEGRITY_KEYS = {"run_null_candidate_when_possible", "hidden_files_must_not_be_staged"}
ALLOWED_REPORT_KEYS = {"include_history"}
ALLOWED_DECISIONS = {"release", "quality", "trigger", "regression", "efficiency", "history"}
HARD_PRESET_POLICY_WARNINGS = {
    "invalid_gates",
    "invalid_gate",
    "unknown_gate_key",
    "missing_gate_metric",
    "invalid_gate_label",
    "invalid_gate_scope",
    "unknown_gate_candidate",
    "invalid_gate_candidates",
    "invalid_integrity_policy",
    "unknown_integrity_key",
    "invalid_report_policy",
    "unknown_report_key",
}


def preset_path(raw):
    if not raw:
        raise CliError("--preset is required", 2)
    path = Path(raw).expanduser()
    if path.is_dir():
        path = path / "preset.json"
    return path.resolve()


def suite_from_preset(preset_path_, preset):
    raw = preset.get("suite")
    if raw:
        path = Path(raw).expanduser()
        if not path.is_absolute():
            path = preset_path_.parent / path
        return suite_path(str(path))
    parent = preset_path_.parent
    if parent.name == "presets":
        return (parent.parent / "evals.json").resolve()
    return suite_path(None)


def resolve_preset_ref(raw_preset, suite=None):
    """Resolve a bare preset name or path to a preset file path."""
    if isinstance(raw_preset, dict):
        raw_preset = raw_preset.get("path")
    raw_preset = str(raw_preset)
    path = Path(raw_preset).expanduser()
    if path.suffix == ".json" or path.exists() or "/" in raw_preset or "\\" in raw_preset:
        return preset_path(raw_preset)
    workbench = workbench_from_suite(suite_path(suite))
    return preset_path(str(workbench / "presets" / f"{raw_preset}.json"))


def load_preset(raw_preset):
    path = preset_path(raw_preset)
    data = read_json(path)
    if not isinstance(data, dict):
        raise CliError("preset must be a JSON object", 2)
    if data.get("schema_version") != 1:
        raise CliError("only preset schema_version 1 is supported", 2)
    preset_id = require_id("preset id", data.get("id"))
    if "decision" in data and data.get("decision") not in ALLOWED_DECISIONS:
        raise CliError(f"preset decision must be one of {', '.join(sorted(ALLOWED_DECISIONS))}", 2)
    selection = data.get("task_selection") or {}
    if not isinstance(selection, dict):
        raise CliError("preset task_selection must be an object", 2)
    candidate_policy = data.get("candidates") or {}
    if not isinstance(candidate_policy, dict):
        raise CliError("preset candidates must be an object", 2)
    metrics = data.get("metrics") or []
    if not isinstance(metrics, list) or not all(isinstance(item, str) and item.strip() for item in metrics):
        raise CliError("preset metrics must be a list of strings", 2)
    unknown_metrics = sorted(set(metrics) - ALLOWED_METRICS)
    if unknown_metrics:
        raise CliError(f"unknown preset metrics: {', '.join(unknown_metrics)}", 2)
    suite = suite_from_preset(path, data)
    return {"path": path, "profile": data, "id": preset_id, "suite": suite}


def selected_case_ids(manifest, profile):
    selection = profile.get("task_selection") or {}
    cases = filter_cases(
        select_cases(manifest, selection.get("split")),
        case_ids=selection.get("case_ids"),
        case_types=selection.get("types"),
    )
    return [case.get("id") for case in cases]


def selected_candidate_ids(manifest, profile):
    candidate_policy = profile.get("candidates") or {}
    ids = []
    baseline = candidate_policy.get("baseline")
    if baseline:
        ids.append(baseline)
    ids.extend(candidate_policy.get("payloads") or [])
    ids.extend(candidate_policy.get("ids") or [])
    if not ids:
        ids = [candidate.get("candidate") for candidate in manifest.get("candidates", [])]
    seen = set()
    deduped = []
    for candidate_id in ids:
        if candidate_id not in seen:
            deduped.append(candidate_id)
            seen.add(candidate_id)
    return deduped


def _payload_candidate_ids(report):
    return {
        candidate.get("candidate")
        for candidate in report["candidates"]
        if candidate.get("source_kind") != "none"
    }


def _baseline_candidate_ids(report):
    return {
        candidate.get("candidate")
        for candidate in report["candidates"]
        if candidate.get("source_kind") == "none"
    }


def _gate_candidate_ids(gate, report):
    if gate.get("candidates"):
        return set(gate.get("candidates") or [])
    if gate.get("candidate"):
        return {gate.get("candidate")}
    scope = gate.get("scope") or "payloads"
    if scope == "all":
        return {candidate.get("candidate") for candidate in report["candidates"]}
    if scope == "baseline":
        return _baseline_candidate_ids(report)
    return _payload_candidate_ids(report)


def _profile_policy_warnings(profile, selected_candidate_ids_):
    warnings = []
    gates = profile.get("gates") or []
    if gates and not isinstance(gates, list):
        return [{"kind": "invalid_gates", "detail": "preset gates must be a list"}]
    selected_candidates = set(selected_candidate_ids_)
    for index, gate in enumerate(gates):
        if not isinstance(gate, dict):
            warnings.append({"kind": "invalid_gate", "gate_index": index, "detail": "gate must be an object"})
            continue
        unknown_keys = sorted(set(gate) - ALLOWED_GATE_KEYS)
        if unknown_keys:
            warnings.append({"kind": "unknown_gate_key", "gate_index": index, "keys": unknown_keys, "detail": "gate has unsupported keys"})
        if not gate.get("metric"):
            warnings.append({"kind": "missing_gate_metric", "gate_index": index, "detail": "gate should name the metric it enforces"})
        required = gate.get("required_label") or "pass"
        if required not in ALLOWED_GATE_LABELS:
            warnings.append({"kind": "invalid_gate_label", "gate_index": index, "label": required, "detail": "required_label must be pass, partial, fail, or unknown"})
        if gate.get("scope") and gate.get("scope") not in ALLOWED_GATE_SCOPES:
            warnings.append({"kind": "invalid_gate_scope", "gate_index": index, "scope": gate.get("scope"), "detail": "scope must be payloads, baseline, or all"})
        if gate.get("candidate") and gate.get("candidate") not in selected_candidates:
            warnings.append({"kind": "unknown_gate_candidate", "gate_index": index, "candidate": gate.get("candidate"), "detail": "gate candidate is not selected by this preset"})
        if gate.get("candidates"):
            if not isinstance(gate.get("candidates"), list):
                warnings.append({"kind": "invalid_gate_candidates", "gate_index": index, "detail": "gate candidates must be a list"})
            else:
                for candidate_id in gate.get("candidates"):
                    if candidate_id not in selected_candidates:
                        warnings.append({"kind": "unknown_gate_candidate", "gate_index": index, "candidate": candidate_id, "detail": "gate candidate is not selected by this preset"})
    integrity = profile.get("integrity")
    if integrity is None:
        warnings.append({"kind": "missing_integrity_policy", "detail": "Presets should declare integrity checks before their scores are trusted."})
    elif not isinstance(integrity, dict):
        warnings.append({"kind": "invalid_integrity_policy", "detail": "preset integrity must be an object"})
    else:
        unknown_keys = sorted(set(integrity) - ALLOWED_INTEGRITY_KEYS)
        if unknown_keys:
            warnings.append({"kind": "unknown_integrity_key", "keys": unknown_keys, "detail": "integrity has unsupported keys"})
    report_policy = profile.get("report")
    if report_policy is not None and not isinstance(report_policy, dict):
        warnings.append({"kind": "invalid_report_policy", "detail": "preset report must be an object"})
    elif isinstance(report_policy, dict):
        unknown_keys = sorted(set(report_policy) - ALLOWED_REPORT_KEYS)
        if unknown_keys:
            warnings.append({"kind": "unknown_report_key", "keys": unknown_keys, "detail": "report has unsupported keys"})
    return warnings


def repetitions_by_type(profile):
    raw = profile.get("repetitions") or {}
    if not isinstance(raw, dict):
        raise CliError("preset repetitions must be an object", 2)
    result = {}
    for key, value in raw.items():
        if key == "default":
            continue
        try:
            count = int(value)
        except (TypeError, ValueError):
            raise CliError(f"preset repetition for {key} must be an integer", 2)
        if count < 1:
            raise CliError(f"preset repetition for {key} must be at least 1", 2)
        result[key] = count
    return result


def default_repetitions(profile):
    raw = (profile.get("repetitions") or {}).get("default")
    if raw is None:
        return None
    try:
        count = int(raw)
    except (TypeError, ValueError):
        raise CliError("preset repetitions.default must be an integer", 2)
    if count < 1:
        raise CliError("preset repetitions.default must be at least 1", 2)
    return count


def preset_lint(raw_preset):
    loaded = load_preset(raw_preset)
    manifest = load_manifest(loaded["suite"])
    profile = loaded["profile"]
    case_ids = selected_case_ids(manifest, profile)
    candidate_ids = selected_candidate_ids(manifest, profile)
    manifest_case_ids = {case.get("id") for case in manifest.get("cases", [])}
    manifest_candidate_ids = {candidate.get("candidate") for candidate in manifest.get("candidates", [])}
    warnings = []
    if not case_ids:
        warnings.append({"kind": "no_cases_selected", "detail": "Preset selects no cases from the suite."})
    missing_cases = [case_id for case_id in (profile.get("task_selection") or {}).get("case_ids", []) if case_id not in manifest_case_ids]
    for case_id in missing_cases:
        warnings.append({"kind": "unknown_case", "case_id": case_id, "detail": "Case id is not present in the suite."})
    for candidate_id in candidate_ids:
        if candidate_id not in manifest_candidate_ids:
            warnings.append({"kind": "unknown_candidate", "candidate": candidate_id, "detail": "Candidate is not present in the suite."})
    selected_cases = [case for case in manifest.get("cases", []) if case.get("id") in set(case_ids)]
    if any((case.get("type") or "") == "trigger" for case in selected_cases):
        if not any((case.get("type") or "") == "near_miss" for case in selected_cases):
            warnings.append({"kind": "unbalanced_trigger_preset", "detail": "Trigger presets need should-trigger and should-not-trigger or near-miss tasks."})
    for case in selected_cases:
        if not case.get("expectations") and not case.get("graders"):
            warnings.append({"kind": "missing_grader", "case_id": case.get("id"), "detail": "Selected case has no declared grader or expectations."})
    if profile.get("decision") == "release" and not profile.get("gates"):
        warnings.append({"kind": "release_without_gates", "detail": "Release presets should declare selection gates."})
    if "unknown_rate" not in (profile.get("metrics") or []):
        warnings.append({"kind": "missing_unknown_rate", "detail": "Preset reports should track unknown or ungraded evidence."})
    warnings.extend(_profile_policy_warnings(profile, candidate_ids))
    return {
        "ok": True,
        "preset": loaded["id"],
        "profile": str(loaded["path"]),
        "suite": str(loaded["suite"]),
        "selected_cases": case_ids,
        "selected_candidates": candidate_ids,
        "metrics": profile.get("metrics") or [],
        "warnings": warnings,
    }


def apply_preset(args, loaded):
    """Fill preset-derived selection fields onto an eval-run args namespace."""
    manifest = load_manifest(loaded["suite"])
    profile = loaded["profile"]
    case_ids = selected_case_ids(manifest, profile)
    candidate_ids = selected_candidate_ids(manifest, profile)
    manifest_case_ids = {case.get("id") for case in manifest.get("cases", [])}
    missing_cases = [case_id for case_id in (profile.get("task_selection") or {}).get("case_ids", []) if case_id not in manifest_case_ids]
    if missing_cases:
        raise CliError(f"preset references unknown cases: {', '.join(missing_cases)}", 2)
    manifest_candidate_ids = {candidate.get("candidate") for candidate in manifest.get("candidates", [])}
    missing_candidates = [candidate_id for candidate_id in candidate_ids if candidate_id not in manifest_candidate_ids]
    if missing_candidates:
        raise CliError(f"preset references unknown candidates: {', '.join(missing_candidates)}", 2)
    if not case_ids:
        raise CliError("preset selected no cases", 2)
    if not candidate_ids:
        raise CliError("preset selected no candidates", 2)
    hard_warnings = sorted(
        {warning["kind"] for warning in _profile_policy_warnings(profile, candidate_ids) if warning["kind"] in HARD_PRESET_POLICY_WARNINGS}
    )
    if hard_warnings:
        raise CliError(f"preset policy errors: {', '.join(hard_warnings)}", 2)
    args.suite = str(loaded["suite"])
    args.candidates = ",".join(candidate_ids)
    args.split = None
    args.case = case_ids
    args.type = None
    args.repetitions = None
    args.repetitions_by_type = repetitions_by_type(profile)
    args.preset_default_repetitions = default_repetitions(profile)
    args.preset = {"id": loaded["id"], "path": str(loaded["path"])}
    return args


def _behavior_counts(report):
    counts = {}
    for trial in report["trials"]:
        state = trial_behavior_state(trial)
        counts[state] = counts.get(state, 0) + 1
    return counts


def _filter_report(report, manifest, profile):
    case_ids = set(selected_case_ids(manifest, profile))
    candidate_ids = set(selected_candidate_ids(manifest, profile))
    trials = [
        trial
        for trial in report["trials"]
        if trial.get("case_id") in case_ids and trial.get("candidate") in candidate_ids
    ]
    trial_ids = {trial.get("trial_id") for trial in trials}
    candidates = [candidate for candidate in report["candidates"] if candidate.get("candidate") in candidate_ids]
    filtered = dict(report)
    filtered["trials"] = trials
    filtered["candidates"] = candidates
    filtered["comparisons"] = build_comparisons(candidates, trials)
    filtered["needs_attention"] = [
        item for item in report["needs_attention"] if item.get("trial_id") in trial_ids
    ]
    filtered["totals"] = {
        "trials": len(trials),
        "passed": sum(1 for trial in trials if trial.get("verdict") == "passed"),
        "failed": sum(1 for trial in trials if trial.get("verdict") == "failed"),
        "inconclusive": sum(1 for trial in trials if trial.get("verdict") == "inconclusive"),
        "ungraded": sum(1 for trial in trials if trial.get("verdict") == "ungraded"),
    }
    return filtered


def _usage_scorecard(report):
    input_tokens = 0
    output_tokens = 0
    usage_trials = 0
    results_by_trial = report.get("results_by_trial") or {}
    for trial in report["trials"]:
        usage = (results_by_trial.get(trial.get("trial_id")) or {}).get("usage") or {}
        if not usage:
            continue
        usage_trials += 1
        input_tokens += int(usage.get("input_tokens") or 0)
        output_tokens += int(usage.get("output_tokens") or 0)
    return {
        "usage_trials": usage_trials,
        "input_tokens": input_tokens if usage_trials else None,
        "output_tokens": output_tokens if usage_trials else None,
        "total_tokens": (input_tokens + output_tokens) if usage_trials else None,
    }


def _comparison_scorecard(report):
    state_pairs = [(row.get("baseline_state"), row.get("candidate_state")) for row in report["comparisons"]]
    return {
        "baseline_fail_candidate_pass": state_pairs.count(("fail", "pass")),
        "baseline_pass_candidate_fail": state_pairs.count(("pass", "fail")),
        "both_fail": state_pairs.count(("fail", "fail")),
        "both_pass": state_pairs.count(("pass", "pass")),
        "unknown_state_pairs": sum(1 for baseline, candidate in state_pairs if "unknown" in {baseline, candidate}),
    }


def _history_rows(loaded):
    runs = preset_history(str(loaded["path"]))["runs"]
    return [
        {
            "run_id": row.get("run_id"),
            "created_at": row.get("created_at"),
            "trials": row.get("trials"),
            "grades": row.get("grades"),
            "candidates": row.get("candidates"),
            "trial_status": row.get("trial_status"),
        }
        for row in runs
    ]


def _calibration_rows(report):
    run_id = report["run_id"]
    workbench = Path(report["run_dir"]).parent.parent
    calibration_dir = workbench / "calibrations"
    if not calibration_dir.is_dir():
        return []
    rows = []
    for path in sorted(calibration_dir.glob("*.json")):
        try:
            artifact = read_json(path)
        except CliError:
            continue
        if artifact.get("run_id") == run_id:
            rows.append(
                {
                    "path": str(path),
                    "metric": artifact.get("metric") or "all",
                    "paired": (artifact.get("summary") or {}).get("paired"),
                    "exact_agreement_rate": (artifact.get("summary") or {}).get("exact_agreement_rate"),
                    "true_positive_rate": (artifact.get("summary") or {}).get("true_positive_rate"),
                    "true_negative_rate": (artifact.get("summary") or {}).get("true_negative_rate"),
                }
            )
    return rows


def _profile_gate_rows(report, profile):
    gates = profile.get("gates") if profile else []
    if not gates:
        return []
    trial_ids = {trial.get("trial_id") for trial in report["trials"]}
    grades_by_trial = {}
    run_dir = Path(report["run_dir"])
    for row in latest_grade_rows(read_jsonl(run_dir / "grades.jsonl")):
        if row.get("trial_id") in trial_ids:
            grades_by_trial.setdefault(row.get("trial_id"), []).append(row)
    rows = []
    for gate in gates:
        if not isinstance(gate, dict):
            rows.append({"gate": gate, "status": "invalid", "detail": "gate must be an object"})
            continue
        metric = gate.get("metric")
        required = gate.get("required_label") or "pass"
        grader_id = gate.get("grader")
        scoped_trials = [
            trial
            for trial in report["trials"]
            if trial.get("trial_id") in trial_ids and trial.get("candidate") in _gate_candidate_ids(gate, report)
        ]
        for trial in sorted(scoped_trials, key=lambda row: row.get("trial_id") or ""):
            trial_id = trial.get("trial_id")
            matches = [
                grade
                for grade in grades_by_trial.get(trial_id, [])
                if (not metric or grade.get("metric") == metric)
                and (not grader_id or (grade.get("grader") or {}).get("id") == grader_id)
            ]
            if not matches:
                rows.append({"trial_id": trial_id, "metric": metric, "required_label": required, "status": "unknown", "detail": "no matching grade"})
                continue
            for grade in matches:
                label = require_grade_status(grade)
                rows.append(
                    {
                        "trial_id": trial_id,
                        "candidate": trial.get("candidate"),
                        "metric": metric,
                        "grader": grade.get("grader"),
                        "required_label": required,
                        "actual_label": label,
                        "status": "pass" if label == required else "fail",
                    }
                )
    return rows


def _load_profile_for_report(raw_preset, run):
    if raw_preset:
        loaded = load_preset(str(resolve_preset_ref(raw_preset, run.get("suite"))))
        run_preset_id = run.get("preset_id")
        if run_preset_id and run_preset_id != loaded["id"]:
            raise CliError(f"run preset_id {run_preset_id} does not match preset {loaded['id']}", 2)
        run_preset_path = run.get("preset_path")
        if run_preset_path and Path(run_preset_path).expanduser().resolve() != loaded["path"]:
            raise CliError("run preset_path does not match supplied preset", 2)
        return loaded
    if run.get("preset_path"):
        return load_preset(run["preset_path"])
    raise CliError("preset report requires a preset; pass --preset or use eval report for plain eval runs", 2)


def build_preset_report(raw_run, raw_preset=None):
    report = build_report(raw_run)
    run_dir = Path(report["run_dir"])
    run = read_json(run_dir / "run.json")
    loaded = _load_profile_for_report(raw_preset, run)
    profile = loaded["profile"]
    profile_path = str(loaded["path"])
    manifest = load_manifest(loaded["suite"])
    report = _filter_report(report, manifest, profile)
    counts = _behavior_counts(report)
    total = len(report["trials"])
    passed = counts.get("pass", 0)
    failed = counts.get("fail", 0)
    unknown = counts.get("unknown", 0)
    usage = _usage_scorecard(report)
    comparison = _comparison_scorecard(report)
    profile_gates = _profile_gate_rows(report, profile)
    profile_gate_failures = [row for row in profile_gates if row.get("status") == "fail"]
    profile_gate_unknown = [row for row in profile_gates if row.get("status") in {"unknown", "invalid"}]
    report_policy = profile.get("report") or {}
    calibration = _calibration_rows(report)
    return {
        "ok": True,
        "preset": profile.get("id") or run.get("preset_id"),
        "preset_path": profile_path,
        "decision": profile.get("decision"),
        "metrics": profile.get("metrics") or sorted(ALLOWED_METRICS),
        "run": report,
        "scorecard": {
            "behavior_pass_rate": round(passed / total, 4) if total else None,
            "behavior_fail_rate": round(failed / total, 4) if total else None,
            "unknown_rate": round(unknown / total, 4) if total else None,
            "trials": total,
            **usage,
            **comparison,
            "profile_gate_failures": len(profile_gate_failures),
            "profile_gate_unknown": len(profile_gate_unknown),
        },
        "profile_gates": profile_gates,
        "history": _history_rows(loaded) if report_policy.get("include_history") else [],
        "calibration": calibration,
        "calibration_policy": profile.get("calibration"),
        "coverage_limits": [
            "Preset scores describe only the selected tasks, candidates, graders, and runner environment.",
            "Runner completion is not answer quality.",
            "Model-judge scores require calibration before high-judgment selection decisions.",
        ],
    }


def render_preset_markdown(model):
    run = model["run"]
    score = model["scorecard"]
    metrics = set(model.get("metrics") or [])
    score_rows = []
    if "behavior_pass_rate" in metrics:
        score_rows.extend(
            [
                ["Behavior pass rate", md_cell(score["behavior_pass_rate"])],
                ["Behavior fail rate", md_cell(score["behavior_fail_rate"])],
            ]
        )
    if "unknown_rate" in metrics:
        score_rows.append(["Unknown rate", md_cell(score["unknown_rate"])])
    if "gate_failures" in metrics:
        score_rows.extend(
            [
                ["Profile gate failures", md_cell(score["profile_gate_failures"])],
                ["Profile gate unknown", md_cell(score["profile_gate_unknown"])],
            ]
        )
    if "comparison_counts" in metrics:
        score_rows.extend(
            [
                ["Baseline fail / candidate pass", md_cell(score["baseline_fail_candidate_pass"])],
                ["Baseline pass / candidate fail", md_cell(score["baseline_pass_candidate_fail"])],
                ["Both pass", md_cell(score["both_pass"])],
                ["Both fail", md_cell(score["both_fail"])],
                ["Unknown state pairs", md_cell(score["unknown_state_pairs"])],
            ]
        )
    if "tokens" in metrics:
        score_rows.append(["Total tokens", md_cell(score["total_tokens"])])
    score_rows.append(["Trials", md_cell(score["trials"])])
    lines = [
        f"# Preset Report: {model.get('preset') or run['run_id']}",
        "",
        f"- Decision: {model.get('decision') or 'unknown'}",
        f"- Run: `{run['run_id']}`",
        f"- Preset: `{model.get('preset_path') or '-'}`",
        f"- Suite: `{run.get('suite') or 'unknown'}`",
        "",
        "## Scorecard",
        "",
    ]
    lines += md_table(
        ["Metric", "Value"],
        score_rows,
    )
    if run["comparisons"] and "comparison_counts" in metrics:
        lines += ["", "## Comparisons", ""]
        lines += md_table(
            ["Task", "Baseline", "Candidate", "Baseline state", "Candidate state"],
            [
                [
                    md_cell(row["case_id"]),
                    md_cell(row["baseline"]),
                    md_cell(row["candidate"]),
                    md_cell(row["baseline_state"]),
                    md_cell(row["candidate_state"]),
                ]
                for row in run["comparisons"]
            ],
        )
    if model["profile_gates"]:
        lines += ["", "## Preset Gates", ""]
        lines += md_table(
            ["Trial", "Metric", "Required", "Actual", "Status"],
            [
                [
                    md_cell(row.get("trial_id")),
                    md_cell(row.get("metric")),
                    md_cell(row.get("required_label")),
                    md_cell(row.get("actual_label") or row.get("detail")),
                    md_cell(row.get("status")),
                ]
                for row in model["profile_gates"]
            ],
        )
    if model.get("history"):
        lines += ["", "## History", ""]
        lines += md_table(
            ["Run", "Created", "Trials", "Grades", "Candidates"],
            [
                [
                    md_cell(row.get("run_id")),
                    md_cell(row.get("created_at")),
                    md_cell(row.get("trials")),
                    md_cell(row.get("grades")),
                    md_cell(", ".join(row.get("candidates") or [])),
                ]
                for row in model["history"]
            ],
        )
    if model.get("calibration") or model.get("calibration_policy"):
        lines += ["", "## Calibration", ""]
        if model.get("calibration"):
            lines += md_table(
                ["Metric", "Pairs", "Exact", "TPR", "TNR", "Artifact"],
                [
                    [
                        md_cell(row.get("metric")),
                        md_cell(row.get("paired")),
                        md_cell(row.get("exact_agreement_rate")),
                        md_cell(row.get("true_positive_rate")),
                        md_cell(row.get("true_negative_rate")),
                        md_cell(row.get("path")),
                    ]
                    for row in model["calibration"]
                ],
            )
        else:
            lines.append("No calibration artifact found for this run.")
    lines += ["", "## Needs Attention", ""]
    if run["needs_attention"]:
        lines += [f"- `{item['trial_id']}` {item['kind']}: {md_cell(item['detail'])}" for item in run["needs_attention"]]
    else:
        lines.append("Nothing needs attention.")
    lines += ["", "## Coverage Limits", ""]
    lines += [f"- {item}" for item in model["coverage_limits"]]
    return "\n".join(lines) + "\n"


def preset_history(raw_preset):
    loaded = load_preset(raw_preset)
    runs = list_runs(str(loaded["suite"]))["runs"]
    matching = []
    for row in runs:
        run_dir = workbench_from_suite(loaded["suite"]) / "runs" / row["run_id"]
        try:
            run = read_json(run_dir / "run.json")
        except CliError:
            continue
        if run.get("preset_id") == loaded["id"] or run.get("preset_path") == str(loaded["path"]):
            matching.append(row)
    return {
        "ok": True,
        "preset": loaded["id"],
        "profile": str(loaded["path"]),
        "suite": str(loaded["suite"]),
        "runs": matching,
    }
