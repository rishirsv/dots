"""Build the prioritized human-review queue for a run.

Tiering uses the machine verdict (model/code grades only) so that trials a
human has already graded still sort by what the machines concluded:

  1. machine verdict failed
  2. machine verdict inconclusive, or any machine grade unknown/ungraded
  3. model-vs-human disagreement on the same trial + metric
  4. suspicious pass: passed, but a judge check failed or judge score < 0.6
  5. remaining passes

Within a tier, ordering is deterministic: (case_id, candidate, repetition,
trial_id).
"""

from ..io import read_json, read_jsonl
from ..verdicts import latest_grade_rows, verdict_for_trial

SUSPICIOUS_SCORE_FLOOR = 0.6
_PENDING_HUMAN_RATIONALE = "Human grader declared;"


def is_recorded_human_grade(row):
    """True for a human grade a reviewer actually recorded (not a pending placeholder)."""
    grader = row.get("grader") or {}
    if grader.get("kind") != "human":
        return False
    if row.get("grade_status") == "unknown" and str(row.get("rationale") or "").startswith(_PENDING_HUMAN_RATIONALE):
        return False
    return True


def _machine_rows(rows):
    return [row for row in rows if (row.get("grader") or {}).get("kind") in {"model", "code", "none"}]


def _model_rows(rows):
    return [row for row in rows if (row.get("grader") or {}).get("kind") == "model"]


def _has_disagreement(model_rows, human_rows):
    model_by_metric = {row.get("metric"): row for row in model_rows}
    for human in human_rows:
        model = model_by_metric.get(human.get("metric"))
        if model is not None and model.get("grade_status") != human.get("grade_status"):
            return True
    return False


def _is_suspicious_pass(model_rows):
    for row in model_rows:
        for check in row.get("checks") or []:
            if isinstance(check, dict) and check.get("label") == "fail":
                return True
        score = row.get("score")
        if isinstance(score, (int, float)) and score < SUSPICIOUS_SCORE_FLOOR:
            return True
    return False


def _tier(machine_verdict, machine_rows, model_rows, human_rows):
    if machine_verdict == "failed":
        return 1
    if machine_verdict == "inconclusive" or any(row.get("grade_status") in {"unknown", "ungraded"} for row in machine_rows):
        return 2
    if _has_disagreement(model_rows, human_rows):
        return 3
    if machine_verdict == "passed" and _is_suspicious_pass(model_rows):
        return 4
    return 5


def _grade_summary(rows):
    return [
        {
            "metric": row.get("metric"),
            "grader": row.get("grader") or {},
            "grade_status": row.get("grade_status"),
            "score": row.get("score"),
        }
        for row in rows
    ]


def build_queue(run_dir):
    """Return prioritized review-queue entries for the run at run_dir."""
    run = read_json(run_dir / "run.json")
    results = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    grading_mode = (run.get("runner_config") or {}).get("grading_mode") or "expectations"
    grades_by_trial = {}
    for row in latest_grade_rows(read_jsonl(run_dir / "grades.jsonl")):
        grades_by_trial.setdefault(row.get("trial_id"), []).append(row)

    planned = list(run.get("trials", []))
    planned_ids = {row.get("trial_id") for row in planned}
    planned.extend(row for tid, row in sorted(results.items()) if tid not in planned_ids)

    entries = []
    for planned_trial in planned:
        trial_id = planned_trial.get("trial_id")
        result_row = results.get(trial_id)
        if result_row is None:
            result = {**planned_trial, "runtime_status": "no_result"}
        else:
            result = {**planned_trial, **{k: v for k, v in result_row.items() if v is not None}}
        rows = grades_by_trial.get(trial_id, [])
        machine_rows = _machine_rows(rows)
        model_rows = _model_rows(rows)
        human_rows = [row for row in rows if is_recorded_human_grade(row)]
        machine_verdict = verdict_for_trial(result, machine_rows, grading_mode=grading_mode)
        verdict = verdict_for_trial(result, machine_rows + human_rows, grading_mode=grading_mode)
        entries.append(
            {
                "trial_id": trial_id,
                "case_id": result.get("case_id"),
                "candidate": result.get("candidate"),
                "repetition": result.get("repetition"),
                "verdict": verdict,
                "tier": _tier(machine_verdict, machine_rows, model_rows, human_rows),
                "grades": _grade_summary(rows),
                "human_graded": bool(human_rows),
            }
        )
    entries.sort(key=lambda e: (e["tier"], e.get("case_id") or "", e.get("candidate") or "", e.get("repetition") or 0, e.get("trial_id") or ""))
    return entries
