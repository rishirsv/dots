"""Judge calibration against human grades."""

from .errors import CliError
from .ids import slug, utc_now
from .io import read_json, read_jsonl, resolve_run_dir, write_json


BINARY_LABELS = {"pass", "fail"}
ESCALATION_LABELS = {"unknown"}
ORDINAL_LABEL_VALUES = {"fail": 0, "partial": 1, "pass": 2}


def _grade_rows(run_dir, kind, metric=None):
    rows = []
    for row in read_jsonl(run_dir / "grades.jsonl"):
        grader = row.get("grader") or {}
        if grader.get("kind") != kind:
            continue
        if metric and row.get("metric") != metric:
            continue
        rows.append(row)
    return rows


def _pair_by_trial_metric(model_rows, human_rows, metric=None):
    model_by_trial = {}
    human_by_trial = {}
    for row in model_rows:
        key = (row.get("trial_id"), row.get("metric") if metric is None else metric)
        model_by_trial.setdefault(key, []).append(row)
    for row in human_rows:
        key = (row.get("trial_id"), row.get("metric") if metric is None else metric)
        human_by_trial.setdefault(key, []).append(row)
    pairs = []
    for key in sorted(set(model_by_trial) & set(human_by_trial)):
        pairs.append({"trial_id": key[0], "metric": key[1], "model": model_by_trial[key][0], "human": human_by_trial[key][0]})
    return pairs


def _safe_rate(numerator, denominator):
    return round(numerator / denominator, 4) if denominator else None


def _example(pair):
    return {
        "trial_id": pair["trial_id"],
        "metric": pair["metric"],
        "model_label": pair["model"].get("grade_status"),
        "human_label": pair["human"].get("grade_status"),
        "model_rationale": pair["model"].get("rationale"),
        "human_rationale": pair["human"].get("rationale"),
    }


def calibrate_run(raw_run, metric=None):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    model_rows = _grade_rows(run_dir, "model", metric)
    human_rows = _grade_rows(run_dir, "human", metric)
    pairs = _pair_by_trial_metric(model_rows, human_rows, metric)
    if not pairs:
        scope = f" for metric {metric!r}" if metric else ""
        raise CliError(f"no paired model and human grades found{scope}", 2)

    exact = sum(1 for pair in pairs if pair["model"].get("grade_status") == pair["human"].get("grade_status"))
    ordinal_pairs = [
        pair
        for pair in pairs
        if pair["model"].get("grade_status") in ORDINAL_LABEL_VALUES and pair["human"].get("grade_status") in ORDINAL_LABEL_VALUES
    ]
    tolerance_agreement = sum(
        1
        for pair in ordinal_pairs
        if abs(ORDINAL_LABEL_VALUES[pair["model"].get("grade_status")] - ORDINAL_LABEL_VALUES[pair["human"].get("grade_status")]) <= 1
    )
    binary_pairs = [pair for pair in pairs if pair["model"].get("grade_status") in BINARY_LABELS and pair["human"].get("grade_status") in BINARY_LABELS]
    human_pass = [pair for pair in binary_pairs if pair["human"].get("grade_status") == "pass"]
    human_fail = [pair for pair in binary_pairs if pair["human"].get("grade_status") == "fail"]
    true_positive = sum(1 for pair in human_fail if pair["model"].get("grade_status") == "fail")
    true_negative = sum(1 for pair in human_pass if pair["model"].get("grade_status") == "pass")
    false_pass = [pair for pair in human_fail if pair["model"].get("grade_status") == "pass"]
    false_fail = [pair for pair in human_pass if pair["model"].get("grade_status") == "fail"]
    model_escalations = [pair for pair in pairs if pair["model"].get("grade_status") in ESCALATION_LABELS]
    human_escalations = [pair for pair in pairs if pair["human"].get("grade_status") in ESCALATION_LABELS]
    disagreements = [pair for pair in pairs if pair["model"].get("grade_status") != pair["human"].get("grade_status")]
    non_binary = [
        pair
        for pair in pairs
        if pair["model"].get("grade_status") not in BINARY_LABELS or pair["human"].get("grade_status") not in BINARY_LABELS
    ]
    summary = {
        "paired": len(pairs),
        "exact_agreement": exact,
        "exact_agreement_rate": _safe_rate(exact, len(pairs)),
        "ordinal_paired": len(ordinal_pairs),
        "tolerance_agreement": tolerance_agreement,
        "tolerance_agreement_rate": _safe_rate(tolerance_agreement, len(ordinal_pairs)),
        "binary_paired": len(binary_pairs),
        "true_positive": true_positive,
        "true_negative": true_negative,
        "false_pass": len(false_pass),
        "false_fail": len(false_fail),
        "true_positive_rate": _safe_rate(true_positive, len(human_fail)),
        "true_negative_rate": _safe_rate(true_negative, len(human_pass)),
        "false_pass_rate": _safe_rate(len(false_pass), len(human_fail)),
        "false_fail_rate": _safe_rate(len(false_fail), len(human_pass)),
        "model_unknown": len(model_escalations),
        "human_unknown": len(human_escalations),
        "model_unknown_rate": _safe_rate(len(model_escalations), len(pairs)),
        "human_unknown_rate": _safe_rate(len(human_escalations), len(pairs)),
        "model_escalation_rate": _safe_rate(len(model_escalations), len(pairs)),
        "human_escalation_rate": _safe_rate(len(human_escalations), len(pairs)),
        "non_binary": len(non_binary),
    }
    artifact = {
        "ok": True,
        "run_id": run.get("run_id") or run_dir.name,
        "run_dir": str(run_dir),
        "metric": metric,
        "created_at": utc_now(),
        "summary": summary,
        "examples": {
            "false_pass": [_example(pair) for pair in false_pass[:5]],
            "false_fail": [_example(pair) for pair in false_fail[:5]],
            "disagreements": [_example(pair) for pair in disagreements[:10]],
            "non_binary": [_example(pair) for pair in non_binary[:10]],
        },
    }
    workbench = run_dir.parent.parent
    calibration_dir = workbench / "calibrations"
    calibration_id = slug(f"{artifact['run_id']}-{metric or 'all'}-{artifact['created_at']}")
    out_path = calibration_dir / f"{calibration_id}.json"
    artifact["calibration_path"] = str(out_path)
    write_json(out_path, artifact)
    return artifact
