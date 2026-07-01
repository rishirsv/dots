"""Eval grading helpers."""

import json
import os
import subprocess
import sys
from pathlib import Path

from .app_server.judge import judge_output
from .errors import CliError
from .ids import run_id, utc_now
from .io import append_jsonl, append_jsonl_many, read_json, read_jsonl, resolve_run_dir
from .staging import safe_case_file
from .summary import build_summary, summary_exit_code
from .verdicts import latest_grade_rows, normalize_grade_status, require_grade_status, require_runtime_status, verdict_contribution

GRADE_LABELS = {"pass", "partial", "fail", "unknown"}


def validator_command(path, output_path, expected_path, events_path):
    suffix = path.suffix.lower()
    if suffix == ".py":
        cmd = [sys.executable, str(path)]
    elif suffix == ".sh":
        cmd = ["sh", str(path)]
    elif os.access(path, os.X_OK):
        cmd = [str(path)]
    else:
        raise CliError(f"unsupported validator file: {path}", 2)
    cmd.extend(["--output", str(output_path), "--events", str(events_path), "--json"])
    if expected_path:
        cmd.extend(["--expected", str(expected_path)])
    return cmd


def result_response_path(result):
    return result.get("response_path")


def grade_key(row):
    grader = row.get("grader") or {}
    return (
        row.get("trial_id"),
        row.get("metric"),
        grader.get("kind"),
        grader.get("id"),
    )


def declared_human_grade_key(result, grader):
    grader_id = grader.get("id") or "human-review"
    metric = grader.get("metric") or grader_id
    return (result.get("trial_id"), metric, "human", grader_id)


def _grade_row(run, result, *, generation_id, grader, metric, grade_status, score=None, checks=None, rationale="", evidence_refs=None, gate=False, detail=None):
    status = normalize_grade_status(grade_status)
    row = {
        "run_id": run["run_id"],
        "case_id": result["case_id"],
        "candidate": result["candidate"],
        "trial_id": result["trial_id"],
        "grade_generation_id": generation_id,
        "grader_id": (grader or {}).get("id"),
        "grader": grader or {"kind": "none", "id": "meta-skill"},
        "grade_status": status,
        "verdict_contribution": verdict_contribution(status),
        "metric": metric,
        "score": None,
        "rationale": rationale,
        "checks": checks or [],
        "evidence_refs": evidence_refs or [result_response_path(result)],
        "gate": bool(gate),
        "timestamp": utc_now(),
    }
    if score is not None:
        row["score"] = score
    if detail is not None:
        row["detail"] = detail
    return row


def ungraded_grade(run, result, generation_id, rationale=None):
    return _grade_row(
        run,
        result,
        generation_id=generation_id,
        grader={"kind": "none", "id": "meta-skill"},
        metric="grade_status",
        grade_status="ungraded",
        rationale=rationale or "No runnable grader exists.",
        evidence_refs=[result_response_path(result)],
    )


def run_validator(validator, result, expected, root):
    proc = subprocess.run(
        validator_command(validator, result_response_path(result), expected, result["events_path"]),
        capture_output=True,
        text=True,
        cwd=root,
    )
    if proc.returncode:
        return 0, 1, [], "fail", (proc.stderr or proc.stdout).strip()
    try:
        data = json.loads(proc.stdout)
        passed = int(data.get("passed", 0))
        total = int(data.get("total", 0))
        checks = data.get("checks", [])
        label = "pass" if total and passed == total else "fail"
        rationale = data.get("rationale") or f"{passed}/{total} validator checks passed"
        return passed, total, checks, label, rationale
    except Exception as exc:
        return 0, 1, [], "fail", f"validator emitted invalid JSON: {exc}"


def code_validator_grade(run, result, validator, expected, root, generation_id, grader=None):
    grader = grader or {}
    passed, total, checks, label, rationale = run_validator(validator, result, expected, root)
    return _grade_row(
        run,
        result,
        generation_id=generation_id,
        grader={"kind": "code", "id": grader.get("id") or validator.name},
        metric=grader.get("metric") or "validator",
        grade_status=label,
        score=passed / total if total else None,
        rationale=rationale,
        checks=checks,
        gate=bool(grader.get("gate") or grader.get("required")),
        evidence_refs=[result_response_path(result), result.get("events_path")],
    )


def read_if_exists(path, limit=20000):
    if path and Path(path).exists():
        return Path(path).read_text()[:limit]
    return None


def generated_expectation_judge_guidance(expectations):
    return (
        "Grade the agent output against the listed expectations. "
        "Each expectation should pass only when specific evidence shows genuine task completion. "
        "Treat unverifiable expectations as unknown."
    )


def model_judge_grade(run_dir, run, result, root, generation_id, judge_path=None, model=None, grader=None, expectations=None, expected=None, case=None):
    grader = grader or {}
    expectations = expectations or []
    task_path = root / "task.md"
    response_path = result_response_path(result)
    output_text = Path(response_path).read_text() if response_path and Path(response_path).exists() else ""
    event_path = run_dir / "trials" / result["trial_id"] / f"judge-{generation_id}.jsonl"
    events_text = read_if_exists(result.get("events_path"), limit=12000)
    judge_guidance = judge_path.read_text() if judge_path and judge_path.exists() else generated_expectation_judge_guidance(expectations)
    expected_text = read_if_exists(expected)
    detail = judge_output(
        judge_guidance=judge_guidance,
        task_text=task_path.read_text() if task_path.exists() else "",
        output_text=output_text,
        expectations=expectations,
        expected_text=expected_text,
        events_text=events_text,
        cwd=run_dir,
        event_path=event_path,
        model=model,
    )
    row = _grade_row(
        run,
        result,
        generation_id=generation_id,
        grader={"kind": "model", "id": grader.get("id") or ("judge" if judge_path else "expectations")},
        metric=grader.get("metric") or ("judge" if judge_path else "expectations"),
        grade_status=detail["label"],
        score=detail["score"],
        rationale=detail["rationale"],
        checks=detail["checks"],
        gate=bool(grader.get("gate") or grader.get("required")),
        evidence_refs=[item for item in [response_path, str(judge_path) if judge_path else None, str(event_path)] if item],
        detail=detail,
    )
    row["eval_feedback"] = detail.get("eval_feedback", [])
    return row


def pending_human_grade(run, result, generation_id, grader):
    return _grade_row(
        run,
        result,
        generation_id=generation_id,
        grader={"kind": "human", "id": grader.get("id") or "human-review"},
        metric=grader.get("metric") or grader.get("id") or "human-review",
        grade_status="unknown",
        rationale="Human grader declared; record a human grade after reviewing the response, task, judge guidance, and transcript evidence.",
        gate=bool(grader.get("gate") or grader.get("required")),
        evidence_refs=[item for item in [result_response_path(result), result.get("events_path"), result.get("evidence_path")] if item],
    )


def normalize_graders(case, root):
    explicit = case.get("graders") or []
    graders = []
    if explicit:
        for index, grader in enumerate(explicit, 1):
            if not isinstance(grader, dict):
                raise CliError(f"grader entry must be an object for case {case.get('id')}", 2)
            kind = grader.get("kind")
            if kind not in {"code", "model", "human"}:
                raise CliError(f"unsupported grader kind for case {case.get('id')}: {kind}", 2)
            item = dict(grader)
            item["id"] = item.get("id") or f"{kind}-{index}"
            graders.append(item)
        return graders

    judge = root / "judge.md"
    if judge.exists():
        graders.append({"kind": "model", "id": "judge", "metric": "judge", "path": "judge.md"})
    elif case.get("expectations"):
        graders.append({"kind": "model", "id": "expectations", "metric": "expectations"})
    for validator in sorted(root.glob("validate.*")):
        graders.append({"kind": "code", "id": validator.name, "metric": "validator", "path": validator.name})
    return graders


def grader_path(root, grader, label):
    raw = grader.get("path")
    if not raw:
        return None
    path = safe_case_file(root, raw, label)
    if not path.exists():
        raise CliError(f"{label} missing: {path}", 2)
    return path


def grade_run(raw_run, *, rebuild_summary=True):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    frozen_suite = read_json(run_dir / "eval-spec" / "suite.json")
    cases_by_id = {case.get("id"): case for case in frozen_suite.get("cases", [])}
    rows = []
    all_existing_grades = read_jsonl(run_dir / "grades.jsonl")
    for row in all_existing_grades:
        require_grade_status(row)
    existing_grades = latest_grade_rows(all_existing_grades)
    existing_human_keys = {
        grade_key(row)
        for row in existing_grades
        if (row.get("grader") or {}).get("kind") == "human"
    }
    generation_id = f"grade-{run_id()}"
    for result in read_jsonl(run_dir / "results.jsonl"):
        runtime_status = require_runtime_status(result)
        if runtime_status != "completed":
            rows.append(
                _grade_row(
                    run,
                    result,
                    generation_id=generation_id,
                    grader={"kind": "runtime", "id": "runtime-status"},
                    metric="runtime",
                    grade_status="fail",
                    rationale=f"Runtime did not complete: {runtime_status}",
                    evidence_refs=[result.get("evidence_path")],
                )
            )
            continue
        root = run_dir / "eval-spec" / "cases" / result["case_id"]
        case = cases_by_id.get(result["case_id"], {})
        graders = normalize_graders(case, root)
        expected = next(iter(sorted(root.glob("expected.*"))), None)
        runnable = False
        for grader in graders:
            if grader.get("kind") == "code":
                validator = grader_path(root, grader, "validator")
                if validator is None:
                    raise CliError(f"code grader {grader.get('id')} missing path for case {case.get('id')}", 2)
                rows.append(code_validator_grade(run, result, validator, expected, root, generation_id, grader))
                runnable = True
            elif grader.get("kind") == "model":
                judge_path = grader_path(root, grader, "judge") if grader.get("path") else next((path for path in (root / "judge.md",) if path.exists()), None)
                rows.append(
                    model_judge_grade(
                        run_dir,
                        run,
                        result,
                        root,
                        generation_id,
                        judge_path,
                        grader=grader,
                        expectations=case.get("expectations") or [],
                        expected=expected,
                        case=case,
                    )
                )
                runnable = True
            elif grader.get("kind") == "human":
                key = declared_human_grade_key(result, grader)
                if key not in existing_human_keys:
                    rows.append(pending_human_grade(run, result, generation_id, grader))
                    existing_human_keys.add(key)
                runnable = True
                continue
        if not runnable:
            rows.append(ungraded_grade(run, result, generation_id, "No runnable code, model, or human grader exists."))
    grades_path = run_dir / "grades.jsonl"
    append_jsonl_many(grades_path, rows)
    summary = build_summary(str(run_dir)) if rebuild_summary else None
    ok = True if summary is None else summary_exit_code(summary) == 0
    return {"ok": ok, "run_id": run["run_id"], "grade_generation_id": generation_id, "grades": len(rows), "grades_path": str(grades_path), "summary_path": str(run_dir / "summary.json")}


def record_human_grade(raw_run, *, trial_id, grader_id, metric, label, score=None, rationale="", reviewer=None):
    if label not in GRADE_LABELS:
        raise CliError(f"human grade label must be one of {', '.join(sorted(GRADE_LABELS))}", 2)
    if not rationale.strip():
        raise CliError("--rationale is required when recording a human grade", 2)
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    results = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    result = results.get(trial_id)
    if result is None:
        planned = {row.get("trial_id"): row for row in run.get("trials", [])}
        result = planned.get(trial_id)
    if result is None:
        raise CliError(f"trial not found in run: {trial_id}", 2)
    if score is not None and not (0 <= score <= 1):
        raise CliError("human grade score must be between 0 and 1", 2)
    generation_id = f"grade-{run_id()}"
    declared = None
    frozen_path = run_dir / "eval-spec" / "suite.json"
    if frozen_path.exists():
        frozen_suite = read_json(frozen_path)
        case = next((item for item in frozen_suite.get("cases", []) if item.get("id") == result.get("case_id")), {})
        for grader in case.get("graders") or []:
            if grader.get("kind") == "human" and (grader.get("id") == grader_id or grader.get("metric") == metric):
                declared = {"gate": bool(grader.get("gate") or grader.get("required"))}
                break
    row = _grade_row(
        run,
        result,
        generation_id=generation_id,
        grader={"kind": "human", "id": grader_id},
        metric=metric or grader_id,
        grade_status=label,
        score=score,
        rationale=rationale,
        gate=bool((declared or {}).get("gate")),
        evidence_refs=[item for item in [result_response_path(result), result.get("events_path"), result.get("evidence_path")] if item],
    )
    if reviewer:
        row["reviewer"] = reviewer
    grades_path = run_dir / "grades.jsonl"
    append_jsonl(grades_path, row)
    summary = build_summary(str(run_dir))
    return {
        "ok": summary_exit_code(summary) == 0,
        "run_id": row["run_id"],
        "trial_id": trial_id,
        "grade_generation_id": generation_id,
        "grade": row,
        "grades_path": str(grades_path),
        "summary_path": str(run_dir / "summary.json"),
    }


def human_review_packet(raw_run, trial_id=None):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    results = {row.get("trial_id"): row for row in read_jsonl(run_dir / "results.jsonl")}
    grades_by_trial = {}
    for grade in read_jsonl(run_dir / "grades.jsonl"):
        require_grade_status(grade)
        grades_by_trial.setdefault(grade.get("trial_id"), []).append(grade)
    planned = list(run.get("trials", []))
    planned_ids = {trial.get("trial_id") for trial in planned}
    planned.extend(row for tid, row in sorted(results.items()) if tid not in planned_ids)
    trials = []
    for planned_trial in planned:
        tid = planned_trial.get("trial_id")
        if trial_id and tid != trial_id:
            continue
        result = {**planned_trial, **{key: value for key, value in (results.get(tid) or {}).items() if value is not None}}
        grades = grades_by_trial.get(tid, [])
        needs_human = any((row.get("grader") or {}).get("kind") == "human" and row.get("grade_status") == "unknown" for row in grades)
        if trial_id or needs_human:
            trials.append(
                {
                    "trial_id": tid,
                    "case_id": result.get("case_id"),
                    "candidate": result.get("candidate"),
                    "response_path": result_response_path(result),
                    "events_path": result.get("events_path"),
                    "evidence_path": result.get("evidence_path"),
                    "human_grades": [row for row in grades if (row.get("grader") or {}).get("kind") == "human"],
                    "guidance": [
                        "Read the visible task, response, and any judge guidance or expected output before grading.",
                        "Use pass, partial, fail, or unknown.",
                        "Ground the rationale in specific response or transcript evidence.",
                    ],
                }
            )
    if trial_id and not trials:
        raise CliError(f"trial not found in run: {trial_id}", 2)
    return {"ok": True, "run_id": run.get("run_id") or run_dir.name, "run_dir": str(run_dir), "trials": trials}
