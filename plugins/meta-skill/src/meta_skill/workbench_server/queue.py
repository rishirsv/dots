"""Absolute human-review queue."""

from ..grading import is_recorded_human_grade
from ..report import build_report


def _tier(trial):
    if trial["verdict"] == "failed":
        return 1
    if trial["verdict"] in {"inconclusive", "ungraded"}:
        return 2
    if trial.get("disagreements"):
        return 3
    if any(check.get("label") == "fail" for check in trial.get("failed_checks") or []):
        return 4
    return 5


def build_queue(run_dir):
    entries = []
    for trial in build_report(str(run_dir), blind_pending_human=True)["trials"]:
        entries.append(
            {
                "trial_id": trial["trial_id"],
                "eval_id": trial["eval_id"],
                "candidate": trial["candidate"],
                "repetition": trial["repetition"],
                "status": trial["status"],
                "verdict": trial["verdict"],
                "tier": _tier(trial),
                "grades": [
                    {
                        "metric": row.get("metric"),
                        "grader": row.get("grader") or {},
                        "grade_status": row.get("grade_status"),
                        "score": row.get("score"),
                    }
                    for row in trial.get("grades") or []
                ],
                "human_graded": any(is_recorded_human_grade(row) for row in trial.get("grades") or []),
            }
        )
    return sorted(
        entries,
        key=lambda row: (
            row["tier"], row.get("eval_id") or "", row.get("candidate") or "",
            row.get("repetition") or 0, row["trial_id"],
        ),
    )
