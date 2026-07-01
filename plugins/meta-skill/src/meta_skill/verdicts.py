"""Verdict rules for eval runs."""

from .errors import CliError

RUNTIME_STATUSES = {"completed", "failed", "timed_out", "skipped", "no_result"}
GRADE_STATUSES = {"pass", "fail", "partial", "unknown", "ungraded"}
VERDICTS = {"passed", "failed", "inconclusive", "skipped", "ungraded"}


def normalize_runtime_status(value):
    if value in RUNTIME_STATUSES:
        return value
    return "failed"


def normalize_grade_status(value):
    if value in GRADE_STATUSES:
        return value
    return "unknown" if value else "unknown"


def require_runtime_status(row):
    if "runtime_status" not in row:
        trial_id = row.get("trial_id") or "<unknown>"
        raise CliError(f"result row missing runtime_status for trial {trial_id}", 2)
    status = row.get("runtime_status")
    if status not in RUNTIME_STATUSES or status == "no_result":
        trial_id = row.get("trial_id") or "<unknown>"
        raise CliError(f"result row has invalid runtime_status for trial {trial_id}: {status}", 2)
    return status


def require_grade_status(row):
    if "grade_status" not in row:
        trial_id = row.get("trial_id") or "<unknown>"
        raise CliError(f"grade row missing grade_status for trial {trial_id}", 2)
    status = row.get("grade_status")
    if status not in GRADE_STATUSES:
        trial_id = row.get("trial_id") or "<unknown>"
        raise CliError(f"grade row has invalid grade_status for trial {trial_id}: {status}", 2)
    return status


def latest_grade_rows(grades):
    latest = {}
    for index, row in enumerate(grades):
        grader = row.get("grader") or {}
        key = (
            row.get("trial_id"),
            row.get("metric"),
            grader.get("kind"),
            grader.get("id"),
        )
        latest[key] = (index, row)
    return [item[1] for item in sorted(latest.values(), key=lambda item: item[0])]


def verdict_for_trial(result, grades, *, grading_mode):
    runtime_status = normalize_runtime_status(result.get("runtime_status"))
    if runtime_status == "skipped":
        return "skipped"
    if runtime_status == "no_result":
        return "inconclusive"
    if runtime_status in {"failed", "timed_out"}:
        return "failed"
    if grading_mode == "none":
        return "ungraded"
    if not grades:
        return "inconclusive"
    statuses = [require_grade_status(row) for row in grades]
    if any(status == "fail" for status in statuses):
        return "failed"
    if any(status in {"partial", "unknown", "ungraded"} for status in statuses):
        return "inconclusive"
    if statuses and all(status == "pass" for status in statuses):
        return "passed"
    return "inconclusive"


def verdict_contribution(grade_status):
    status = normalize_grade_status(grade_status)
    if status == "pass":
        return "supports_pass"
    if status == "fail":
        return "supports_fail"
    if status == "partial":
        return "inconclusive_partial"
    if status == "ungraded":
        return "ungraded"
    return "inconclusive_unknown"
