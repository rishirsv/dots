"""Static lint checks for eval manifests."""

from collections import Counter

from .manifest import load_manifest, suite_path


def case_grader_kinds(case):
    kinds = Counter()
    for grader in case.get("graders") or []:
        kinds[grader.get("kind") or "unknown"] += 1
    if case.get("expectations"):
        kinds["model"] += 1
    return kinds


def lint_suite(raw_suite):
    suite = suite_path(raw_suite)
    manifest = load_manifest(suite)
    cases = manifest.get("cases", [])
    warnings = []
    stats = {
        "tasks": len(cases),
        "task_types": Counter(case.get("type") or "unspecified" for case in cases),
        "grader_kinds": Counter(),
        "human_graders": 0,
        "transcript_aware_graders": 0,
    }
    trigger_types = {"trigger", "implicit_trigger", "activation"}
    negative_types = {"negative_control", "boundary", "should_not_trigger", "near_miss"}
    has_trigger = False
    has_negative = False

    for case in cases:
        case_id = case.get("id")
        case_type = case.get("type") or "unspecified"
        if case_type in trigger_types:
            has_trigger = True
        if case_type in negative_types:
            has_negative = True
        if case_type == "unspecified":
            warnings.append({"case_id": case_id, "kind": "missing_type", "detail": "Set type to capability, regression, trigger, negative_control, failure, or gate."})
        task = case.get("task") or {}
        has_task = bool(task.get("prompt") is not None or task.get("path"))
        if not has_task:
            warnings.append({"case_id": case_id, "kind": "missing_task_source", "detail": "Add exactly one visible task source: inline prompt or task path."})
        if not case.get("expectations") and not case.get("graders"):
            warnings.append({"case_id": case_id, "kind": "missing_grader", "detail": "Add code, model, or human grading guidance."})
        if case_type in {"regression", "gate"} and not case.get("expectations"):
            warnings.append({"case_id": case_id, "kind": "missing_reference", "detail": "Regression and gate tasks should have exact expectations."})
        kinds = case_grader_kinds(case)
        stats["grader_kinds"].update(kinds)
        for grader in case.get("graders") or []:
            if grader.get("kind") == "human":
                stats["human_graders"] += 1
            if grader.get("uses_transcript"):
                stats["transcript_aware_graders"] += 1
            if grader.get("kind") == "code" and not grader.get("path"):
                warnings.append({"case_id": case_id, "kind": "code_grader_missing_path", "detail": f"Code grader {grader.get('id') or '<unnamed>'} needs a validate.* path."})
            if grader.get("kind") == "human" and not grader.get("metric"):
                warnings.append({"case_id": case_id, "kind": "human_metric_missing", "detail": f"Human grader {grader.get('id') or '<unnamed>'} should name the judgment metric."})

    if has_trigger and not has_negative:
        warnings.append({"kind": "unbalanced_trigger_suite", "detail": "Trigger suites need should-trigger and should-not-trigger or near-miss tasks."})

    return {
        "ok": True,
        "suite": str(suite),
        "shape": manifest.get("_manifest_shape") or "suite",
        "stats": {
            "tasks": stats["tasks"],
            "task_types": dict(sorted(stats["task_types"].items())),
            "grader_kinds": dict(sorted(stats["grader_kinds"].items())),
            "human_graders": stats["human_graders"],
            "transcript_aware_graders": stats["transcript_aware_graders"],
        },
        "warnings": warnings,
    }
