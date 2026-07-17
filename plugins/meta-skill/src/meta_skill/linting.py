"""Static lint checks for eval manifests."""

from collections import Counter

from .manifest import load_manifest, suite_path


FATAL_SUITE_WARNINGS = {
    "all_graders_advisory",
    "hidden_metadata_in_task",
    "implicit_advisory_model",
    "missing_grader",
    "unbalanced_attached_suite",
}
"""Warning kinds that must block eval execution when surfaced on the run path."""


def case_grader_kinds(case):
    kinds = Counter()
    for grader in case.get("graders") or []:
        kinds[grader.get("kind") or "unknown"] += 1
    if not case.get("graders") and (case.get("expectations") or case.get("expected_output") is not None):
        kinds["model_advisory"] += 1
    return kinds


def lint_suite(raw_suite):
    suite = suite_path(raw_suite)
    manifest = load_manifest(suite)
    cases = manifest.get("evals", [])
    warnings = []
    stats = {
        "tasks": len(cases),
        "task_types": Counter(case.get("type") or "unspecified" for case in cases),
        "grader_kinds": Counter(),
        "human_graders": 0,
        "transcript_aware_graders": 0,
    }
    has_attached = False
    has_negative = False
    benchmark = manifest.get("benchmark") or {}
    public_benchmark = str(benchmark.get("source") or "").startswith(("http://", "https://"))

    for case in cases:
        case_id = case.get("id")
        case_type = case.get("type") or "unspecified"
        if case_type == "attached":
            has_attached = True
        if case_type == "near_miss":
            has_negative = True
        if case_type == "unspecified":
            warnings.append({"case_id": case_id, "kind": "missing_type", "detail": "Set type to attached, near_miss, capability, regression, or failure."})
        prompt = case.get("prompt")
        if isinstance(prompt, dict) and prompt.get("path"):
            task_file = suite.parent / "cases" / case_id / "task.md"
            if task_file.is_file() and task_file.read_text().startswith("---"):
                warnings.append({"case_id": case_id, "kind": "hidden_metadata_in_task", "detail": "task.md must contain only visible agent bytes; move metadata into evals.json."})
        if not case.get("expectations") and not case.get("graders") and case.get("expected_output") is None:
            warnings.append({"case_id": case_id, "kind": "missing_grader", "detail": "Add code, model, or human grading guidance."})
        elif not case.get("graders"):
            warnings.append({
                "case_id": case_id,
                "kind": "implicit_advisory_model",
                "detail": "Expectations without an explicit grader produce advisory feedback only and cannot decide the verdict.",
            })
        if case_type == "regression" and not case.get("expectations"):
            warnings.append({"case_id": case_id, "kind": "missing_reference", "detail": "Regression tasks should have exact expectations."})
        if public_benchmark and not case.get("created_at"):
            warnings.append({
                "case_id": case_id,
                "kind": "benchmark_case_missing_created_at",
                "detail": "Public benchmark cases should record an ISO creation or release date when known.",
            })
        graders = case.get("graders") or []
        if graders and all(grader.get("advisory") for grader in graders):
            warnings.append({"case_id": case_id, "kind": "all_graders_advisory", "detail": "Case can never reach a passed verdict because every explicit grader is advisory."})
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

    if has_attached and not has_negative:
        warnings.append({"kind": "unbalanced_attached_suite", "detail": "Attached-skill behavior suites need matching near-miss tasks."})

    return {
        "ok": True,
        "suite": str(suite),
        "shape": "evals-v2",
        "stats": {
            "tasks": stats["tasks"],
            "task_types": dict(sorted(stats["task_types"].items())),
            "grader_kinds": dict(sorted(stats["grader_kinds"].items())),
            "human_graders": stats["human_graders"],
            "transcript_aware_graders": stats["transcript_aware_graders"],
        },
        "warnings": warnings,
    }
