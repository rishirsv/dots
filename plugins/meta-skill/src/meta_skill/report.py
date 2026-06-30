"""Summary-only run listing and report rendering."""

from pathlib import Path

from .io import read_json, read_jsonl, resolve_run_dir
from .manifest import suite_path, workbench_from_suite
from .summary import build_summary


def list_runs(raw_suite):
    runs_root = workbench_from_suite(suite_path(raw_suite)) / "runs"
    rows = []
    run_dirs = sorted(path for path in runs_root.iterdir() if (path / "run.json").exists()) if runs_root.is_dir() else []
    for run_dir in run_dirs:
        summary_path = run_dir / "summary.json"
        if not summary_path.exists():
            rows.append({"run_id": run_dir.name, "summary_status": "missing"})
            continue
        try:
            summary = read_json(summary_path)
        except CliError as exc:
            rows.append({"run_id": run_dir.name, "error": exc.message})
            continue
        rows.append(
            {
                "run_id": summary.get("run_id") or run_dir.name,
                "created_at": summary.get("created_at"),
                "trials": summary.get("total_trials"),
                "runtime_status_totals": summary.get("runtime_status_totals") or {},
                "grade_status_totals": summary.get("grade_status_totals") or {},
                "final_verdict_totals": summary.get("final_verdict_totals") or {},
                "summary_path": str(summary_path),
            }
        )
    return {"ok": True, "runs_dir": str(runs_root), "runs": rows}


def build_report(raw_run):
    run_dir = resolve_run_dir(raw_run)
    summary_path = run_dir / "summary.json"
    if not summary_path.exists():
        build_summary(str(run_dir))
    summary = read_json(summary_path)
    run = read_json(run_dir / "run.json")
    results_by_trial = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    trials = summary.get("trials", [])
    candidates = run.get("candidates", [])
    return {
        **summary,
        "candidates": candidates,
        "comparisons": build_comparisons(candidates, trials),
        "needs_attention": [
            {"trial_id": row.get("trial_id"), "kind": row.get("verdict"), "detail": row.get("error") or row.get("verdict")}
            for row in trials
            if row.get("verdict") in {"failed", "inconclusive", "ungraded"}
        ],
        "totals": {
            "trials": summary.get("total_trials", 0),
            "passed": (summary.get("final_verdict_totals") or {}).get("passed", 0),
            "failed": (summary.get("final_verdict_totals") or {}).get("failed", 0),
            "inconclusive": (summary.get("final_verdict_totals") or {}).get("inconclusive", 0),
            "ungraded": (summary.get("final_verdict_totals") or {}).get("ungraded", 0),
            "gate_failed": 0,
        },
        "results_by_trial": results_by_trial,
    }


def trial_behavior_state(trial):
    verdict = trial.get("verdict")
    if verdict == "passed":
        return "pass"
    if verdict == "failed":
        return "fail"
    return "unknown"


def aggregate_case_candidate_state(trials):
    states = [trial_behavior_state(trial) for trial in trials]
    if not states or "unknown" in states or ("pass" in states and "fail" in states):
        return "unknown"
    return states[0]


def build_comparisons(candidates, trials):
    baseline_ids = {row.get("candidate") for row in candidates if row.get("source_kind") == "none"}
    payload_ids = [row.get("candidate") for row in candidates if row.get("source_kind") != "none"]
    if not baseline_ids or not payload_ids:
        return []
    baseline_id = sorted(baseline_ids)[0]
    by_case_candidate = {}
    for trial in trials:
        by_case_candidate.setdefault((trial["case_id"], trial["candidate"]), []).append(trial)
    rows = []
    for case_id in sorted({trial["case_id"] for trial in trials}):
        baseline_state = aggregate_case_candidate_state(by_case_candidate.get((case_id, baseline_id), []))
        for candidate_id in sorted(payload_ids):
            candidate_state = aggregate_case_candidate_state(by_case_candidate.get((case_id, candidate_id), []))
            rows.append(
                {
                    "case_id": case_id,
                    "baseline": baseline_id,
                    "candidate": candidate_id,
                    "baseline_state": baseline_state,
                    "candidate_state": candidate_state,
                }
            )
    return rows


def md_cell(value, limit=96):
    text = " ".join(str(value if value is not None else "-").split()).replace("|", "\\|") or "-"
    return text if len(text) <= limit else text[: limit - 3] + "..."


def md_table(headers, rows):
    lines = ["| " + " | ".join(headers) + " |", "|" + "|".join(" --- " for _ in headers) + "|"]
    lines.extend("| " + " | ".join(row) + " |" for row in rows)
    return lines


def render_markdown(summary):
    lines = [
        f"# Eval Summary: {summary['run_id']}",
        "",
        f"- Run dir: `{summary['run_dir']}`",
        f"- Created: {summary.get('created_at') or 'unknown'}",
        f"- Grading mode: `{summary.get('grading_mode') or 'unknown'}`",
        f"- Trials: {summary.get('total_trials', 0)}",
        "",
        "## Verdict Totals",
        "",
    ]
    verdicts = summary.get("final_verdict_totals") or {}
    lines += md_table(["Verdict", "Count"], [[md_cell(key), md_cell(value)] for key, value in sorted(verdicts.items())])
    lines += ["", "## Runtime Status", ""]
    lines += md_table(["Runtime status", "Count"], [[md_cell(key), md_cell(value)] for key, value in sorted((summary.get("runtime_status_totals") or {}).items())])
    lines += ["", "## Grade Status", ""]
    lines += md_table(["Grade status", "Count"], [[md_cell(key), md_cell(value)] for key, value in sorted((summary.get("grade_status_totals") or {}).items())])
    lines += ["", "## Trials", ""]
    lines += md_table(
        ["Trial", "Case", "Candidate", "Runtime", "Grades", "Verdict"],
        [
            [
                md_cell(row.get("trial_id")),
                md_cell(row.get("case_id")),
                md_cell(row.get("candidate")),
                md_cell(row.get("runtime_status")),
                md_cell(", ".join(row.get("grade_statuses") or []) or "-"),
                md_cell(row.get("verdict")),
            ]
            for row in summary.get("trials", [])
        ],
    )
    return "\n".join(lines) + "\n"
