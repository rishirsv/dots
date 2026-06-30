"""Build the single aggregate truth surface for eval runs."""

from collections import Counter, defaultdict
from pathlib import Path

from .io import read_json, read_jsonl, resolve_run_dir, write_json
from .verdicts import latest_grade_rows, normalize_grade_status, normalize_runtime_status, verdict_for_trial


def _counts(rows, key):
    return dict(sorted(Counter(row.get(key) or "unknown" for row in rows).items()))


def _planned_trials(run, results):
    planned = list(run.get("trials", []))
    planned_ids = {row.get("trial_id") for row in planned}
    planned.extend(row for row in results if row.get("trial_id") not in planned_ids)
    return sorted(planned, key=lambda row: (row.get("case_id") or "", row.get("candidate") or "", row.get("repetition") or 0, row.get("trial_id") or ""))


def build_summary(raw_run):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    results = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    all_grades = read_jsonl(run_dir / "grades.jsonl")
    latest_grades = latest_grade_rows(all_grades)
    grades_by_trial = defaultdict(list)
    for row in latest_grades:
        grades_by_trial[row.get("trial_id")].append(row)
    grading_mode = ((run.get("runner_config") or {}).get("grading_mode") or "expectations")
    trials = []
    for planned in _planned_trials(run, list(results.values())):
        trial_id = planned.get("trial_id")
        result = {**planned, **{key: value for key, value in (results.get(trial_id) or {}).items() if value is not None}}
        runtime_status = normalize_runtime_status(result.get("runtime_status"))
        grade_rows = grades_by_trial.get(trial_id, [])
        verdict = verdict_for_trial(result, grade_rows, grading_mode=grading_mode)
        trials.append(
            {
                "trial_id": trial_id,
                "case_id": result.get("case_id"),
                "candidate": result.get("candidate"),
                "repetition": result.get("repetition"),
                "runtime_status": runtime_status,
                "grade_statuses": [normalize_grade_status(row.get("grade_status")) for row in grade_rows],
                "verdict": verdict,
                "response_path": result.get("response_path"),
                "events_path": result.get("events_path"),
                "evidence_path": result.get("evidence_path"),
                "error": result.get("error"),
            }
        )
    verdict_counts = dict(sorted(Counter(row["verdict"] for row in trials).items()))
    grade_status_rows = [
        {"grade_status": normalize_grade_status(row.get("grade_status"))}
        for row in latest_grades
    ]
    totals_by_candidate = {}
    for candidate in sorted({row.get("candidate") for row in trials if row.get("candidate")}):
        scoped = [row for row in trials if row.get("candidate") == candidate]
        totals_by_candidate[candidate] = {
            "trials": len(scoped),
            "verdicts": dict(sorted(Counter(row["verdict"] for row in scoped).items())),
            "runtime_statuses": dict(sorted(Counter(row["runtime_status"] for row in scoped).items())),
        }
    totals_by_case = {}
    for case_id in sorted({row.get("case_id") for row in trials if row.get("case_id")}):
        scoped = [row for row in trials if row.get("case_id") == case_id]
        totals_by_case[case_id] = {
            "trials": len(scoped),
            "verdicts": dict(sorted(Counter(row["verdict"] for row in scoped).items())),
            "runtime_statuses": dict(sorted(Counter(row["runtime_status"] for row in scoped).items())),
        }
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
        "trials": trials,
    }
    write_json(run_dir / "summary.json", summary)
    return summary


def summary_exit_code(summary, *, runtime_only=False):
    if runtime_only:
        return 0 if not any(row["runtime_status"] in {"failed", "timed_out"} for row in summary.get("trials", [])) else 1
    verdicts = summary.get("final_verdict_totals") or {}
    return 0 if not any(verdicts.get(key, 0) for key in ("failed", "inconclusive")) else 1
