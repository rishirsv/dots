"""Small, shared verdict rules for trial read models."""

from .errors import CliError

RUNTIME_STATUSES = {"queued", "running", "completed", "failed", "timed_out", "skipped", "no_result"}
GRADE_STATUSES = {"pass", "fail", "partial", "unknown", "ungraded"}


def normalize_runtime_status(value):
    return value if value in RUNTIME_STATUSES else "failed"


def normalize_grade_status(value):
    return value if value in GRADE_STATUSES else "unknown"


def require_grade_status(row):
    status = row.get("grade_status")
    if status not in GRADE_STATUSES:
        raise CliError(
            f"grade row has invalid grade_status for trial {row.get('trial_id') or '<unknown>'}: {status}",
            2,
        )
    return status


def latest_grade_rows(grades):
    """Return the newest row for each declared grader identity and metric."""
    latest = {}
    for index, row in enumerate(grades):
        grader = row.get("grader") or {}
        key = (row.get("trial_id"), row.get("metric"), grader.get("kind"), grader.get("id"))
        latest[key] = (index, row)
    return [value[1] for value in sorted(latest.values(), key=lambda value: value[0])]


def verdict_for_trial(state, grades, *, grading_enabled=True):
    runtime = normalize_runtime_status(state.get("status") or state.get("runtime_status") or "no_result")
    if runtime == "skipped":
        return "skipped"
    if runtime in {"queued", "running", "no_result"}:
        return "inconclusive"
    if runtime in {"failed", "timed_out"}:
        return "failed"
    if not grading_enabled:
        return "ungraded"
    grades = latest_grade_rows(grades)
    if not grades:
        return "inconclusive"
    statuses = [(row, require_grade_status(row)) for row in grades]
    required = [(row, status) for row, status in statuses if not (row.get("grader") or {}).get("advisory")]
    advisory = [(row, status) for row, status in statuses if (row.get("grader") or {}).get("advisory")]
    if any(status == "fail" for _row, status in required):
        return "failed"
    if any(status == "fail" for _row, status in advisory):
        return "inconclusive"
    if any(status in {"partial", "unknown", "ungraded"} for _row, status in statuses):
        return "inconclusive"
    if required and all(status == "pass" for _row, status in required):
        return "passed"
    return "inconclusive"
