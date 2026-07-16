"""Absolute and pairwise human-review queues."""

import hashlib
from pathlib import Path

from ..errors import CliError
from ..grading import is_recorded_human_grade
from ..ids import utc_now
from ..io import append_jsonl, read_json, read_jsonl
from ..report import build_report, write_report


PAIRWISE_LABELS = {"a", "b", "tie", "neither", "unknown"}
PAIRWISE_REASONS = {
    "correctness",
    "completeness",
    "clarity",
    "evidence",
    "instruction-following",
    "safety",
    "style",
    "other",
}


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


def _pair_id(run_id, eval_id, repetition, baseline, candidate):
    raw = f"{run_id}\0{eval_id}\0{repetition}\0{baseline}\0{candidate}".encode()
    return "comparison-" + hashlib.sha256(raw).hexdigest()[:16]


def _latest_pairwise_reviews(run_dir):
    latest = {}
    for row in read_jsonl(Path(run_dir) / "pairwise-reviews.jsonl"):
        if row.get("comparison_id"):
            latest[row["comparison_id"]] = row
    return latest


def _pair_models(run_dir):
    report = build_report(str(run_dir))
    candidates = [row.get("candidate") for row in report.get("candidates") or [] if row.get("candidate")]
    if len(candidates) < 2:
        return report, []
    baseline = report.get("baseline_candidate") or candidates[0]
    others = [candidate for candidate in candidates if candidate != baseline]
    by_key = {
        (trial.get("eval_id"), trial.get("candidate"), trial.get("repetition")): trial
        for trial in report.get("trials") or []
    }
    delta = {
        (row.get("eval_id"), row.get("candidate")): row.get("delta")
        for row in report.get("comparisons") or []
    }
    reviews = _latest_pairwise_reviews(run_dir)
    rows = []
    eval_repetitions = sorted(
        {(trial.get("eval_id"), trial.get("repetition")) for trial in report.get("trials") or []}
    )
    for eval_id, repetition in eval_repetitions:
        baseline_trial = by_key.get((eval_id, baseline, repetition))
        if baseline_trial is None:
            continue
        for candidate in others:
            candidate_trial = by_key.get((eval_id, candidate, repetition))
            if candidate_trial is None:
                continue
            comparison_id = _pair_id(report["run_id"], eval_id, repetition, baseline, candidate)
            flip = int(hashlib.sha256(comparison_id.encode()).hexdigest(), 16) % 2 == 1
            a, b = (candidate_trial, baseline_trial) if flip else (baseline_trial, candidate_trial)
            reasons = []
            if baseline_trial.get("priority") == "high" or candidate_trial.get("priority") == "high":
                reasons.append("high-priority")
            if delta.get((eval_id, candidate)) in {"case_regression", "observed_regression"}:
                reasons.append("regression")
            if baseline_trial.get("disagreements") or candidate_trial.get("disagreements"):
                reasons.append("grader-disagreement")
            if baseline_trial.get("verdict") not in {"passed", "failed"} or candidate_trial.get("verdict") not in {"passed", "failed"}:
                reasons.append("unknown-outcome")
            rows.append(
                {
                    "comparison_id": comparison_id,
                    "eval_id": eval_id,
                    "repetition": repetition,
                    "baseline": baseline,
                    "candidate": candidate,
                    "a": a,
                    "b": b,
                    "priority": candidate_trial.get("priority") or baseline_trial.get("priority") or "medium",
                    "selection_reasons": reasons,
                    "review": reviews.get(comparison_id),
                }
            )
    return report, rows


def build_pairwise_queue(run_dir):
    report, pairs = _pair_models(run_dir)
    requested = report.get("human_review_sample")
    sample_size = 1 if requested is None else max(0, int(requested))
    routine = sorted(
        [pair for pair in pairs if not pair["selection_reasons"]],
        key=lambda pair: hashlib.sha256(pair["comparison_id"].encode()).hexdigest(),
    )
    sampled = {pair["comparison_id"] for pair in routine[:sample_size]}
    queue = []
    for pair in pairs:
        selected = bool(pair["selection_reasons"]) or pair["comparison_id"] in sampled
        reasons = list(pair["selection_reasons"])
        if pair["comparison_id"] in sampled:
            reasons.append("random-pass-sample")
        queue.append(
            {
                "comparison_id": pair["comparison_id"],
                "eval_id": pair["eval_id"],
                "repetition": pair["repetition"],
                "priority": pair["priority"],
                "selected": selected,
                "selection_reasons": reasons,
                "reviewed": pair["review"] is not None,
            }
        )
    selected_rows = [row for row in queue if row["selected"]]
    return {
        "ok": True,
        "run_id": report["run_id"],
        "queue": sorted(
            selected_rows,
            key=lambda row: (
                row["reviewed"],
                {"high": 0, "medium": 1, "low": 2}.get(row["priority"], 1),
                row["eval_id"],
                row["repetition"],
            ),
        ),
        "coverage": {
            "eligible": len(queue),
            "selected": len(selected_rows),
            "reviewed": sum(row["reviewed"] for row in selected_rows),
            "unreviewed": sum(not row["reviewed"] for row in selected_rows),
            "sampling_rule": "high priority, regressions, grader disagreements, unknown outcomes, plus a deterministic pass sample",
        },
    }


def _text(path):
    return Path(path).read_text(errors="replace") if Path(path).is_file() else None


def _artifact_files(path):
    root = Path(path)
    return [item.relative_to(root).as_posix() for item in sorted(root.rglob("*")) if item.is_file()]


def build_pairwise_packet(run_dir, comparison_id):
    report, pairs = _pair_models(run_dir)
    pair = next((row for row in pairs if row["comparison_id"] == comparison_id), None)
    if pair is None:
        raise CliError(f"comparison not found: {comparison_id}", 2)
    case_root = Path(run_dir) / "inputs" / "cases" / pair["eval_id"]
    packet = {
        "run_id": report["run_id"],
        "comparison_id": comparison_id,
        "eval_id": pair["eval_id"],
        "repetition": pair["repetition"],
        "task": _text(case_root / "task.md"),
        "expected": _text(case_root / "expected.md"),
        "a": {
            "response": _text(pair["a"]["response_path"]),
            "artifacts": _artifact_files(pair["a"]["artifacts_path"]),
        },
        "b": {
            "response": _text(pair["b"]["response_path"]),
            "artifacts": _artifact_files(pair["b"]["artifacts_path"]),
        },
        "reviewed": pair["review"] is not None,
        "review": pair["review"],
    }
    if pair["review"] is not None:
        packet["reveal"] = {
            "a": {"candidate": pair["a"]["candidate"], "trial_id": pair["a"]["trial_id"]},
            "b": {"candidate": pair["b"]["candidate"], "trial_id": pair["b"]["trial_id"]},
        }
    return packet


def pairwise_artifact_path(run_dir, comparison_id, side, relative):
    _report, pairs = _pair_models(run_dir)
    pair = next((row for row in pairs if row["comparison_id"] == comparison_id), None)
    if pair is None or side not in {"a", "b"}:
        raise CliError("comparison artifact not found", 2)
    root = Path(pair[side]["artifacts_path"]).resolve()
    path = (root / Path(relative)).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise CliError("comparison artifact not found", 2)
    return path


def record_pairwise_review(run_dir, comparison_id, preferred, reason, rationale=""):
    if preferred not in PAIRWISE_LABELS:
        raise CliError(f"pairwise preference must be one of {', '.join(sorted(PAIRWISE_LABELS))}", 2)
    if reason not in PAIRWISE_REASONS:
        raise CliError(f"pairwise reason must be one of {', '.join(sorted(PAIRWISE_REASONS))}", 2)
    report, pairs = _pair_models(run_dir)
    pair = next((row for row in pairs if row["comparison_id"] == comparison_id), None)
    if pair is None:
        raise CliError(f"comparison not found: {comparison_id}", 2)
    row = {
        "comparison_id": comparison_id,
        "eval_id": pair["eval_id"],
        "repetition": pair["repetition"],
        "preferred": preferred,
        "reason": reason,
        "rationale": str(rationale or "").strip(),
        "a": {"candidate": pair["a"]["candidate"], "trial_id": pair["a"]["trial_id"]},
        "b": {"candidate": pair["b"]["candidate"], "trial_id": pair["b"]["trial_id"]},
        "timestamp": utc_now(),
    }
    append_jsonl(Path(run_dir) / "pairwise-reviews.jsonl", row)
    write_report(build_report(str(run_dir)))
    return {"ok": True, "run_id": report["run_id"], "review": row}
