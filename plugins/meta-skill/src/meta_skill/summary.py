"""Build the single aggregate truth surface for eval runs."""

from collections import Counter, defaultdict
from pathlib import Path

from .io import read_json, read_jsonl, resolve_run_dir, write_json
from .verdicts import latest_grade_rows, require_grade_status, require_runtime_status, verdict_for_trial


def _counts(rows, key):
    return dict(sorted(Counter(row.get(key) or "unknown" for row in rows).items()))


def _scoped_totals(rows):
    scoped = list(rows)
    return {
        "trials": len(scoped),
        "verdicts": dict(sorted(Counter(row["verdict"] for row in scoped).items())),
        "runtime_statuses": dict(sorted(Counter(row["runtime_status"] for row in scoped).items())),
    }


def _grader_error_total(latest_grades):
    total = 0
    for row in latest_grades:
        detail = row.get("detail")
        if isinstance(detail, dict) and detail.get("grader_error"):
            total += 1
    return total


def _usage_pair(usage):
    if not isinstance(usage, dict):
        return None
    return int(usage.get("input_tokens") or 0), int(usage.get("output_tokens") or 0)


def _token_usage(result_rows, latest_grades):
    trial_input = trial_output = judge_input = judge_output = 0
    trials_with_usage = 0
    for row in result_rows:
        pair = _usage_pair(row.get("usage"))
        if pair is None:
            continue
        trials_with_usage += 1
        trial_input += pair[0]
        trial_output += pair[1]
    for row in latest_grades:
        detail = row.get("detail")
        if not isinstance(detail, dict):
            continue
        pair = _usage_pair(detail.get("usage"))
        if pair is None:
            continue
        judge_input += pair[0]
        judge_output += pair[1]
    return {
        "trial_input_tokens": trial_input,
        "trial_output_tokens": trial_output,
        "judge_input_tokens": judge_input,
        "judge_output_tokens": judge_output,
        "total_tokens": trial_input + trial_output + judge_input + judge_output,
        "trials_with_usage": trials_with_usage,
    }


def _planned_trials(run, results):
    planned = list(run.get("trials", []))
    planned_ids = {row.get("trial_id") for row in planned}
    planned.extend(row for row in results if row.get("trial_id") not in planned_ids)
    return sorted(planned, key=lambda row: (row.get("case_id") or "", row.get("candidate") or "", row.get("repetition") or 0, row.get("trial_id") or ""))


def build_summary(raw_run):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    result_rows = read_jsonl(run_dir / "results.jsonl")
    for row in result_rows:
        require_runtime_status(row)
    results = {row.get("trial_id"): row for row in result_rows}
    all_grades = read_jsonl(run_dir / "grades.jsonl")
    for row in all_grades:
        require_grade_status(row)
    latest_grades = latest_grade_rows(all_grades)
    grades_by_trial = defaultdict(list)
    for row in latest_grades:
        grades_by_trial[row.get("trial_id")].append(row)
    grading_mode = ((run.get("runner_config") or {}).get("grading_mode") or "expectations")
    trials = []
    trials_by_candidate = defaultdict(list)
    trials_by_case = defaultdict(list)
    for planned in _planned_trials(run, list(results.values())):
        trial_id = planned.get("trial_id")
        result_row = results.get(trial_id)
        if result_row is None:
            result = {**planned, "runtime_status": "no_result"}
        else:
            runtime_status = require_runtime_status(result_row)
            result = {**planned, **{key: value for key, value in result_row.items() if value is not None}, "runtime_status": runtime_status}
        runtime_status = result["runtime_status"]
        grade_rows = grades_by_trial.get(trial_id, [])
        verdict = verdict_for_trial(result, grade_rows, grading_mode=grading_mode)
        trial = {
            "trial_id": trial_id,
            "case_id": result.get("case_id"),
            "candidate": result.get("candidate"),
            "repetition": result.get("repetition"),
            "runtime_status": runtime_status,
            "grade_statuses": [require_grade_status(row) for row in grade_rows],
            "verdict": verdict,
            "response_path": result.get("response_path"),
            "events_path": result.get("events_path"),
            "evidence_path": result.get("evidence_path"),
            "error": result.get("error"),
        }
        trials.append(trial)
        if trial.get("candidate"):
            trials_by_candidate[trial["candidate"]].append(trial)
        if trial.get("case_id"):
            trials_by_case[trial["case_id"]].append(trial)
    verdict_counts = dict(sorted(Counter(row["verdict"] for row in trials).items()))
    grade_status_rows = [{"grade_status": require_grade_status(row)} for row in latest_grades]
    totals_by_candidate = {candidate: _scoped_totals(rows) for candidate, rows in sorted(trials_by_candidate.items())}
    totals_by_case = {case_id: _scoped_totals(rows) for case_id, rows in sorted(trials_by_case.items())}
    summary = {
        "ok": True,
        "run_id": run.get("run_id") or Path(run_dir).name,
        "run_dir": str(run_dir),
        "created_at": run.get("created_at"),
        "runner_config": run.get("runner_config") or {},
        "model_config": run.get("model_config") or {},
        "grading_mode": grading_mode,
        "total_trials": len(trials),
        "totals_by_candidate": totals_by_candidate,
        "totals_by_case": totals_by_case,
        "runtime_status_totals": _counts(trials, "runtime_status"),
        "grade_status_totals": _counts(grade_status_rows, "grade_status"),
        "final_verdict_totals": verdict_counts,
        "grader_error_total": _grader_error_total(latest_grades),
        "token_usage": _token_usage(result_rows, latest_grades),
        "trials": trials,
    }
    write_json(run_dir / "summary.json", summary)
    return summary


def summary_exit_code(summary, *, runtime_only=False):
    if runtime_only:
        return 0 if not any(row["runtime_status"] in {"failed", "timed_out"} for row in summary.get("trials", [])) else 1
    verdicts = summary.get("final_verdict_totals") or {}
    return 0 if not any(verdicts.get(key, 0) for key in ("failed", "inconclusive")) else 1
