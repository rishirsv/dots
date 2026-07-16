"""Canonical filesystem read model and Markdown report export."""

from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path

from .errors import CliError
from .grading import is_recorded_human_grade, normalize_graders
from .io import read_json, read_jsonl, resolve_run_dir
from .manifest import load_manifest, runs_from_suite, suite_path
from .verdicts import latest_grade_rows, verdict_for_trial


def _safe_json(path, default):
    try:
        return read_json(path) if Path(path).exists() else default
    except CliError:
        return default


def _normalized_annotation(annotation, trial_id, index):
    row = dict(annotation)
    if not row.get("annotation_id"):
        payload = json.dumps(
            {"trial_id": trial_id, "index": index, "annotation": row},
            sort_keys=True,
            separators=(",", ":"),
        )
        row["annotation_id"] = f"legacy-{hashlib.sha256(payload.encode()).hexdigest()[:24]}"
    row["judge_use"] = row.get("judge_use") or "exclude"
    return row


def _normalized_review(review, trial_id):
    if not isinstance(review, dict):
        return review
    return {
        **review,
        "annotations": [
            _normalized_annotation(annotation, trial_id, index)
            for index, annotation in enumerate(review.get("annotations") or [])
            if isinstance(annotation, dict)
        ],
    }


def _executor_model(run, key):
    executor = run.get(key)
    if key == "judge_executor" and executor is None:
        return None
    if not isinstance(executor, dict) or not executor.get("kind") or not executor.get("provenance"):
        raise CliError(f"run is missing canonical {key} provenance", 2)
    return dict(executor)


def _failed_checks(grades):
    failed = []
    for grade in grades:
        for check in grade.get("checks") or []:
            if isinstance(check, dict) and check.get("label") in {"fail", "unknown"}:
                failed.append(
                    {
                        "grader": (grade.get("grader") or {}).get("id"),
                        "metric": grade.get("metric"),
                        "name": check.get("name"),
                        "label": check.get("label"),
                        "evidence": check.get("evidence") or check.get("note") or "",
                    }
                )
    return failed


def _trial_model(run_dir, planned, grading_enabled):
    trial_id = planned["trial_id"]
    root = run_dir / "trials" / trial_id
    state = _safe_json(
        root / "state.json",
        {
            "trial_id": trial_id,
            "eval_id": planned.get("eval_id"),
            "candidate": planned.get("candidate"),
            "repetition": planned.get("repetition"),
            "status": "no_result",
        },
    )
    grades = latest_grade_rows(read_jsonl(root / "grades.jsonl"))
    review = _normalized_review(_safe_json(root / "review.json", None), trial_id)
    verdict = verdict_for_trial(state, grades, grading_enabled=grading_enabled)
    failed_checks = _failed_checks(grades)
    model_by_metric = {
        row.get("metric"): row for row in grades if (row.get("grader") or {}).get("kind") == "model"
    }
    disagreements = []
    for human in [
        row for row in grades if is_recorded_human_grade(row)
    ]:
        model = model_by_metric.get(human.get("metric"))
        if model and model.get("grade_status") != human.get("grade_status"):
            disagreements.append(
                {
                    "metric": human.get("metric"),
                    "model": model.get("grade_status"),
                    "human": human.get("grade_status"),
                }
            )
    return {
        "trial_id": trial_id,
        "eval_id": state.get("eval_id") or planned.get("eval_id"),
        "candidate": state.get("candidate") or planned.get("candidate"),
        "repetition": state.get("repetition") or planned.get("repetition"),
        "status": state.get("status", "no_result"),
        "verdict": verdict,
        "duration_ms": state.get("duration_ms"),
        "usage": state.get("usage"),
        "error": state.get("error"),
        "produced_artifacts": list(state.get("produced_artifacts") or []),
        "response_path": str(root / "response.md"),
        "events_path": str(root / "events.jsonl"),
        "artifacts_path": str(root / "artifacts"),
        "state_path": str(root / "state.json"),
        "grades_path": str(root / "grades.jsonl"),
        "grades": grades,
        "review": review,
        "failed_checks": failed_checks,
        "disagreements": disagreements,
    }


def _human_review_pending(case, grades):
    declared = {
        (grader["id"], grader["metric"])
        for grader in normalize_graders(case)
        if grader["kind"] == "human"
    }
    recorded = {
        ((row.get("grader") or {}).get("id"), row.get("metric"))
        for row in grades
        if is_recorded_human_grade(row)
    }
    return bool(declared - recorded)


def _grading_complete(trials, cases, grading_enabled):
    if not grading_enabled:
        return True
    for trial in trials:
        if trial.get("status") == "completed":
            required = sum(
                grader["kind"] != "human"
                for grader in normalize_graders(cases.get(trial.get("eval_id"), {}))
            )
            if required and len(trial.get("grades") or []) < required:
                return False
        elif trial.get("status") in {"failed", "timed_out", "skipped"}:
            if not trial.get("grades"):
                return False
    return True


def _blind_pending_trial(trial, case, grading_enabled):
    if not _human_review_pending(case, trial.get("grades") or []):
        return trial
    visible_grades = [
        row for row in trial.get("grades") or []
        if (row.get("grader") or {}).get("kind") != "model"
    ]
    return {
        **trial,
        "verdict": verdict_for_trial(
            {"status": trial.get("status")}, visible_grades, grading_enabled=grading_enabled
        ),
        "grades": visible_grades,
        "failed_checks": _failed_checks(visible_grades),
        "disagreements": [],
    }


def _behavior(trials):
    verdicts = {trial.get("verdict") for trial in trials}
    if verdicts == {"passed"}:
        return "pass"
    if verdicts == {"failed"}:
        return "fail"
    return "unknown"


def _comparisons(candidates, trials, baseline_candidate=None):
    candidate_ids = [candidate.get("candidate") for candidate in candidates if candidate.get("candidate")]
    baseline = baseline_candidate or next(
        (candidate.get("candidate") for candidate in candidates if candidate.get("source_kind") == "none"),
        None,
    )
    payload_ids = [candidate for candidate in candidate_ids if candidate != baseline]
    if not baseline or not payload_ids:
        return []
    by_pair = defaultdict(list)
    for trial in trials:
        by_pair[(trial.get("eval_id"), trial.get("candidate"))].append(trial)
    rows = []
    eval_ids = sorted({trial.get("eval_id") for trial in trials if trial.get("eval_id")})
    for eval_id in eval_ids:
        baseline_state = _behavior(by_pair[(eval_id, baseline)])
        for candidate in payload_ids:
            candidate_state = _behavior(by_pair[(eval_id, candidate)])
            if baseline_state == "fail" and candidate_state == "pass":
                delta = "improved"
            elif baseline_state == "pass" and candidate_state == "fail":
                delta = "regressed"
            elif baseline_state == candidate_state == "pass":
                delta = "no_uplift_demonstrated"
            else:
                delta = "inconclusive"
            rows.append(
                {
                    "eval_id": eval_id,
                    "baseline": baseline,
                    "candidate": candidate,
                    "baseline_state": baseline_state,
                    "candidate_state": candidate_state,
                    "delta": delta,
                }
            )
    return rows


def _case_versions(cases, candidates, trials):
    by_case_version = defaultdict(list)
    for trial in trials:
        by_case_version[(trial.get("eval_id"), trial.get("candidate"))].append(trial)
    rows = []
    eval_ids = list(cases)
    eval_ids.extend(
        sorted({trial.get("eval_id") for trial in trials if trial.get("eval_id") not in cases})
    )
    for eval_id in eval_ids:
        case = cases.get(eval_id) or {}
        versions = []
        for candidate in candidates:
            candidate_id = candidate.get("candidate")
            cells = by_case_version[(eval_id, candidate_id)]
            if not cells:
                continue
            versions.append(
                {
                    "candidate": candidate_id,
                    "display": candidate.get("display") or candidate_id,
                    "verdict": {
                        "pass": "passed",
                        "fail": "failed",
                        "unknown": "inconclusive",
                    }[_behavior(cells)],
                    "trials": [
                        {
                            "trial_id": trial.get("trial_id"),
                            "repetition": trial.get("repetition"),
                            "verdict": trial.get("verdict"),
                            "failed_checks": trial.get("failed_checks") or [],
                            "annotations": ((trial.get("review") or {}).get("annotations") or []),
                        }
                        for trial in cells
                    ],
                }
            )
        rows.append(
            {
                "eval_id": eval_id,
                "prompt": case.get("prompt"),
                "expectations": case.get("expectations") or [],
                "versions": versions,
            }
        )
    return rows


def _token_usage(trials):
    totals = Counter()
    trials_with_usage = 0
    for trial in trials:
        usage = trial.get("usage") or {}
        if usage:
            trials_with_usage += 1
        for key in ("input_tokens", "cached_input_tokens", "output_tokens", "total_tokens"):
            totals[key] += int(usage.get(key) or 0)
        for grade in trial.get("grades") or []:
            detail_usage = (grade.get("detail") or {}).get("usage") or {}
            for key in ("input_tokens", "cached_input_tokens", "output_tokens", "total_tokens"):
                totals[f"judge_{key}"] += int(detail_usage.get(key) or 0)
    return {**totals, "trials_with_usage": trials_with_usage}


def _candidate_summaries(candidates, trials, baseline_candidate):
    by_candidate = defaultdict(list)
    for trial in trials:
        by_candidate[trial.get("candidate")].append(trial)
    rows = []
    for candidate in candidates:
        candidate_id = candidate.get("candidate")
        candidate_trials = by_candidate[candidate_id]
        verdicts = Counter(trial.get("verdict") for trial in candidate_trials)
        scored = verdicts.get("passed", 0) + verdicts.get("failed", 0)
        pass_rate = verdicts.get("passed", 0) / scored if scored else None
        durations = [int(trial.get("duration_ms")) for trial in candidate_trials if trial.get("duration_ms") is not None]
        tokens = [
            int((trial.get("usage") or {}).get("total_tokens"))
            for trial in candidate_trials
            if (trial.get("usage") or {}).get("total_tokens") is not None
        ]
        rows.append(
            {
                "candidate": candidate_id,
                "display": candidate.get("display") or candidate_id,
                "baseline": candidate_id == baseline_candidate,
                "trials": len(candidate_trials),
                "passed": verdicts.get("passed", 0),
                "failed": verdicts.get("failed", 0),
                "inconclusive": verdicts.get("inconclusive", 0),
                "ungraded": verdicts.get("ungraded", 0),
                "scored": scored,
                "pass_rate": pass_rate,
                "mean_duration_ms": sum(durations) / len(durations) if durations else None,
                "mean_total_tokens": sum(tokens) / len(tokens) if tokens else None,
            }
        )
    baseline = next((row for row in rows if row["baseline"]), None)
    baseline_rate = baseline.get("pass_rate") if baseline else None
    for row in rows:
        rate = row.get("pass_rate")
        row["pass_rate_delta"] = (
            rate - baseline_rate if rate is not None and baseline_rate is not None else None
        )
        row["improvement_multiplier"] = (
            rate / baseline_rate
            if rate is not None and baseline_rate is not None and baseline_rate > 0
            else None
        )
    return rows


def _pairwise_reviews(run_dir):
    latest = {}
    for row in read_jsonl(Path(run_dir) / "pairwise-reviews.jsonl"):
        if row.get("comparison_id"):
            latest[row["comparison_id"]] = row
    return list(latest.values())


def build_report(raw_run, *, blind_pending_human=False):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    if run.get("schema_version") != 2:
        raise CliError("only run schema_version 2 is supported", 2)
    grading_enabled = bool((run.get("runner") or {}).get("grading"))
    suite = _safe_json(run_dir / "inputs" / "suite.json", {"evals": []})
    cases = {case.get("id"): case for case in suite.get("evals") or []}
    trials = []
    for planned in run.get("trials", []):
        trial = _trial_model(run_dir, planned, grading_enabled)
        case = cases.get(trial.get("eval_id"), {})
        trials.append({**trial, "eval_type": case.get("type"), "priority": case.get("priority") or "medium"})
    runtime_terminal = all(
        trial["status"] in {"completed", "failed", "timed_out", "skipped"}
        for trial in trials
    )
    grading_complete = _grading_complete(trials, cases, grading_enabled)
    if blind_pending_human:
        trials = [
            _blind_pending_trial(trial, cases.get(trial.get("eval_id"), {}), grading_enabled)
            for trial in trials
        ]
    comparisons = _comparisons(
        run.get("candidates") or [], trials, baseline_candidate=run.get("baseline_candidate")
    )
    runtime_totals = dict(Counter(trial["status"] for trial in trials))
    verdict_totals = dict(Counter(trial["verdict"] for trial in trials))
    delta_totals = dict(Counter(row["delta"] for row in comparisons))
    reviewed = sum(
        1
        for trial in trials
        if trial.get("review") or any(is_recorded_human_grade(row) for row in trial.get("grades") or [])
    )
    disagreement_count = sum(len(trial.get("disagreements") or []) for trial in trials)
    pairwise_reviews = _pairwise_reviews(run_dir)
    annotation_totals = Counter(
        annotation.get("tag")
        for trial in trials
        for annotation in ((trial.get("review") or {}).get("annotations") or [])
        if annotation.get("tag")
    )
    attention = [
        {
            "trial_id": trial["trial_id"],
            "kind": trial["verdict"],
            "detail": trial.get("error") or (trial.get("failed_checks") or [{}])[0].get("evidence") or trial["verdict"],
        }
        for trial in trials
        if trial["verdict"] in {"failed", "inconclusive", "ungraded"}
    ]
    coverage_limits = []
    if not run.get("baseline_candidate") and not any(
        candidate.get("source_kind") == "none" for candidate in run.get("candidates") or []
    ):
        coverage_limits.append("No baseline candidate was run; candidate delta cannot be calculated.")
    if not grading_enabled:
        coverage_limits.append("Grading was disabled; completed trials remain ungraded.")
    candidate_summaries = _candidate_summaries(
        run.get("candidates") or [], trials, run.get("baseline_candidate")
    )
    report = {
        "schema_version": 2,
        "run_id": run.get("run_id") or run_dir.name,
        "run_dir": str(run_dir),
        "created_at": run.get("created_at"),
        "adhoc": bool(run.get("adhoc")),
        "objective": run.get("objective"),
        "skill_id": run.get("skill_id"),
        "skill_name": run.get("skill_name") or Path(str(run.get("skill_id") or "skill")).name,
        "suite": run.get("suite"),
        "project": run.get("project"),
        "model": run.get("model"),
        "reasoning_effort": run.get("reasoning_effort"),
        "task_executor": _executor_model(run, "task_executor"),
        "judge_executor": _executor_model(run, "judge_executor"),
        "runner": run.get("runner") or {},
        "baseline_candidate": run.get("baseline_candidate"),
        "source_run_id": run.get("source_run_id"),
        "human_review_sample": run.get("human_review_sample"),
        "suite_digest": run.get("suite_digest"),
        "eval_digests": run.get("eval_digests") or [],
        "planning_error": run.get("planning_error"),
        "candidates": run.get("candidates") or [],
        "cases": _case_versions(cases, run.get("candidates") or [], trials),
        "trials": trials,
        "comparisons": comparisons,
        "candidate_summaries": candidate_summaries,
        "delta_totals": delta_totals,
        "runtime_status_totals": runtime_totals,
        "verdict_totals": verdict_totals,
        "totals": {
            "trials": len(trials),
            **{key: verdict_totals.get(key, 0) for key in ("passed", "failed", "inconclusive", "ungraded", "skipped")},
        },
        "review": {"reviewed": reviewed, "total": len(trials), "disagreements": disagreement_count},
        "pairwise_review": {
            "reviewed": len(pairwise_reviews),
            "reviews": pairwise_reviews,
            "requested_sample": run.get("human_review_sample"),
        },
        "annotation_totals": dict(annotation_totals),
        "token_usage": _token_usage(trials),
        "duration_ms": sum(int(trial.get("duration_ms") or 0) for trial in trials),
        "needs_attention": attention,
        "coverage_limits": coverage_limits,
        "runtime_terminal": runtime_terminal,
        "grading_complete": grading_complete,
        "terminal": runtime_terminal and grading_complete,
    }
    report["ok"] = not report["planning_error"] and not any(
        trial["verdict"] in {"failed", "inconclusive"} for trial in trials
    )
    return report


def list_runs(raw_suite, *, blind_pending_human=False, runs_root=None):
    runs_root = Path(runs_root) if runs_root is not None else runs_from_suite(suite_path(raw_suite))
    rows = []
    for run_dir in sorted(runs_root.glob("*"), reverse=True) if runs_root.is_dir() else []:
        if not (run_dir / "run.json").exists():
            continue
        try:
            report = build_report(str(run_dir), blind_pending_human=blind_pending_human)
            rows.append(
                {
                    "run_id": report["run_id"],
                    "created_at": report.get("created_at"),
                    "objective": report.get("objective"),
                    "baseline_candidate": report.get("baseline_candidate"),
                    "model": report.get("model"),
                    "reasoning_effort": report.get("reasoning_effort"),
                    "task_executor": report.get("task_executor"),
                    "judge_executor": report.get("judge_executor"),
                    "candidates": [row.get("candidate") for row in report.get("candidates") or []],
                    "totals": report["totals"],
                    "runtime_status_totals": report["runtime_status_totals"],
                    "verdict_totals": report["verdict_totals"],
                    "delta_totals": report["delta_totals"],
                    "review": report["review"],
                    "pairwise_review": report["pairwise_review"],
                    "duration_ms": report.get("duration_ms"),
                    "terminal": report["terminal"],
                    "run_dir": str(run_dir),
                }
            )
        except CliError as exc:
            rows.append({"run_id": run_dir.name, "error": exc.message, "run_dir": str(run_dir)})
    return {"ok": True, "runs_dir": str(runs_root), "runs": rows}


def judge_annotation_context(raw_run):
    """Return only reviewer annotations explicitly approved for judge context."""
    report = build_report(raw_run)
    rows = []
    for trial in report.get("trials") or []:
        for annotation in ((trial.get("review") or {}).get("annotations") or []):
            if annotation.get("judge_use") not in {"rubric", "evidence"}:
                continue
            rows.append(
                {
                    "annotation_id": annotation["annotation_id"],
                    "judge_use": annotation["judge_use"],
                    "trial_id": trial.get("trial_id"),
                    "eval_id": trial.get("eval_id"),
                    "candidate": trial.get("candidate"),
                    "artifact": annotation.get("artifact"),
                    "artifact_path": annotation.get("artifact_path"),
                    "tag": annotation.get("tag"),
                    "note": annotation.get("note"),
                }
            )
    return rows


def build_suite_report(raw_suite, *, blind_pending_human=True, runs_root=None):
    suite = suite_path(raw_suite)
    manifest = load_manifest(suite)
    runs = list_runs(
        str(suite), blind_pending_human=blind_pending_human, runs_root=runs_root
    )["runs"]
    latest = None
    if runs:
        latest = build_report(runs[0]["run_dir"], blind_pending_human=blind_pending_human)
    trials_by_eval = defaultdict(list)
    annotations_by_eval = defaultdict(list)
    for trial in (latest or {}).get("trials") or []:
        trials_by_eval[trial.get("eval_id")].append(trial)
        annotations_by_eval[trial.get("eval_id")].extend(
            (trial.get("review") or {}).get("annotations") or []
        )
    cases = []
    for case in manifest.get("evals") or []:
        outcomes = {
            trial.get("candidate"): trial.get("verdict")
            for trial in trials_by_eval.get(case.get("id"), [])
        }
        prompt = case.get("prompt")
        prompt_preview = prompt if isinstance(prompt, str) else "task.md"
        cases.append(
            {
                "id": case.get("id"),
                "type": case.get("type") or "unspecified",
                "priority": case.get("priority") or "medium",
                "prompt_preview": " ".join(str(prompt_preview).split())[:180],
                "expectations": len(case.get("expectations") or []),
                "graders": [
                    {
                        "id": grader.get("id"),
                        "kind": grader.get("kind"),
                        "metric": grader.get("metric") or grader.get("id"),
                    }
                    for grader in case.get("graders") or []
                ],
                "latest_outcomes": outcomes,
                "annotations": annotations_by_eval.get(case.get("id"), []),
            }
        )
    return {
        "ok": True,
        "suite": str(suite),
        "objective": manifest.get("objective"),
        "defaults": manifest.get("defaults") or {},
        "candidates": manifest.get("candidates") or [],
        "cases": cases,
        "latest_run": runs[0] if runs else None,
    }


def _cell(value, limit=120):
    text = " ".join(str(value if value is not None else "-").split()).replace("|", "\\|") or "-"
    return text if len(text) <= limit else text[: limit - 3] + "..."


def _table(headers, rows):
    return [
        "| " + " | ".join(headers) + " |",
        "|" + "|".join(" --- " for _ in headers) + "|",
        *("| " + " | ".join(_cell(value) for value in row) + " |" for row in rows),
    ]


def _executor_label(executor):
    executor = executor or {}
    model = executor.get("observed_model") or executor.get("requested_model")
    return " · ".join(
        str(value)
        for value in (
            executor.get("kind"),
            model,
            executor.get("requested_reasoning"),
            executor.get("provenance"),
        )
        if value
    ) or "unknown"


def _percent(value):
    return "-" if value is None else f"{value * 100:.1f}%"


def _average(value, suffix=""):
    return "-" if value is None else f"{value:.0f}{suffix}"


def _effect(row):
    if row.get("baseline"):
        return "baseline"
    delta = row.get("pass_rate_delta")
    if delta is None:
        return "-"
    multiplier = row.get("improvement_multiplier")
    multiplier_text = "not calculable from 0% baseline" if multiplier is None else f"{multiplier:.2f}x"
    return f"{delta * 100:+.1f} pp · {multiplier_text}"


def _criterion_rows(report):
    rows = []
    for trial in report.get("trials") or []:
        for grade in trial.get("grades") or []:
            checks = grade.get("checks") or []
            if checks:
                rows.extend(
                    [
                        trial.get("eval_id"),
                        trial.get("candidate"),
                        check.get("name") or grade.get("metric"),
                        check.get("label") or grade.get("grade_status"),
                        check.get("evidence") or check.get("note") or grade.get("rationale") or "",
                    ]
                    for check in checks
                )
            else:
                rows.append(
                    [
                        trial.get("eval_id"),
                        trial.get("candidate"),
                        grade.get("metric"),
                        grade.get("grade_status"),
                        grade.get("rationale") or "",
                    ]
                )
    return rows


def render_markdown(report):
    delta = report.get("delta_totals") or {}
    totals = report.get("totals") or {}
    lines = [f"# Skill evaluation: {report.get('skill_id') or report['run_id']}", "", "## Summary", ""]
    if report.get("objective"):
        lines += [f"**Question:** {report['objective']}", ""]
    lines += [
        f"**Version delta:** {delta.get('improved', 0)} improved, {delta.get('regressed', 0)} regressed, "
        f"{delta.get('no_uplift_demonstrated', 0)} no uplift demonstrated, "
        f"{delta.get('inconclusive', 0)} inconclusive.",
        "",
        f"{totals.get('passed', 0)} passed · {totals.get('failed', 0)} failed · "
        f"{totals.get('inconclusive', 0)} inconclusive · {totals.get('ungraded', 0)} ungraded",
        "",
    ]
    summaries = report.get("candidate_summaries") or []
    if summaries:
        lines += _table(
            ["Version", "Passed / scored", "Pass rate", "Effect vs baseline", "Mean time", "Mean tokens"],
            [
                [
                    row.get("display"),
                    f"{row.get('passed', 0)} / {row.get('scored', 0)}",
                    _percent(row.get("pass_rate")),
                    _effect(row),
                    _average(row.get("mean_duration_ms"), " ms"),
                    _average(row.get("mean_total_tokens")),
                ]
                for row in summaries
            ],
        )
    lines += [
        "",
        "Pass rate excludes inconclusive and ungraded trials. The per-case comparison below is the primary evidence of skill effect.",
        "",
        "## Scenario results",
        "",
    ]
    comparisons = report.get("comparisons") or []
    if comparisons:
        lines += _table(
            ["Case", "Version", "Baseline", "Version outcome", "Delta"],
            [
                [row["eval_id"], row["candidate"], row["baseline_state"], row["candidate_state"], row["delta"]]
                for row in comparisons
            ],
        )
    else:
        lines.append("No candidate comparison is available.")
    lines += ["", "## Trial results", ""]
    lines += _table(
        ["Trial", "Runtime", "Verdict", "Duration"],
        [
            [trial["trial_id"], trial["status"], trial["verdict"], f"{trial.get('duration_ms') or 0} ms"]
            for trial in report.get("trials") or []
        ],
    )
    criterion_rows = _criterion_rows(report)
    if criterion_rows:
        lines += ["", "## Criteria evidence", ""]
        lines += _table(["Case", "Version", "Criterion", "Result", "Evidence"], criterion_rows)
    unresolved = [
        trial
        for trial in report.get("trials") or []
        if trial.get("error")
        or (
            trial.get("verdict") in {"failed", "inconclusive"}
            and not trial.get("failed_checks")
        )
    ]
    if unresolved:
        lines += ["", "## Execution issues", ""]
        lines += _table(
            ["Trial", "Issue"],
            [
                [
                    trial.get("trial_id"),
                    trial.get("error") or "No criterion evidence explains this outcome.",
                ]
                for trial in unresolved
            ],
        )
    lines += [
        "",
        "## Run details",
        "",
        f"- Run: `{report['run_id']}`",
        f"- Baseline version: {report.get('baseline_candidate') or 'none'}",
        f"- Versions: {', '.join(row.get('candidate') or '' for row in report.get('candidates') or []) or 'none'}",
        f"- Task executor: {_executor_label(report.get('task_executor'))}",
        f"- Judge executor: {_executor_label(report.get('judge_executor'))}",
        f"- Total duration: {report.get('duration_ms') or 0} ms",
        "",
    ]
    review = report.get("review") or {}
    pairwise = report.get("pairwise_review") or {}
    if review.get("reviewed") or review.get("disagreements") or pairwise.get("reviewed") or report.get("annotation_totals"):
        lines += [
            "## Feedback",
            "",
            f"{review.get('reviewed', 0)}/{review.get('total', 0)} trials reviewed; "
            f"{review.get('disagreements', 0)} model/human disagreements.",
            "",
            f"{pairwise.get('reviewed', 0)} pairwise comparisons reviewed.",
        ]
    if report.get("annotation_totals"):
        lines += ["", "Annotations: " + ", ".join(
            f"{key}={value}" for key, value in sorted(report["annotation_totals"].items())
        ) + "."]
        for trial in report.get("trials") or []:
            for annotation in ((trial.get("review") or {}).get("annotations") or []):
                lines.append(f"- `{trial['trial_id']}`: {annotation.get('note')}")
    if report.get("coverage_limits"):
        lines += ["", "## Coverage limits", ""]
        lines.extend(f"- {item}" for item in report["coverage_limits"])
    return "\n".join(lines).rstrip() + "\n"


def write_report(report, path=None):
    output = (
        Path(path)
        if path
        else Path(report["run_dir"]) / f"{report['skill_name']}-evaluation.md"
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render_markdown(report))
    return output
