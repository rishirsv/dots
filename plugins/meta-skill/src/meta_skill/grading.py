"""Grade frozen run inputs and append rows to each trial."""

import concurrent.futures
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

from .codex_exec import judge_output
from .eval_stats import calibration_metrics
from .errors import CliError
from .ids import run_id, utc_now
from .io import append_jsonl, read_json, read_jsonl, resolve_run_dir
from .staging import safe_case_file
from .runtime import DEFAULT_EVAL_MODEL, DEFAULT_EVAL_REASONING_EFFORT
from .verdicts import GRADE_STATUSES, latest_grade_rows, normalize_grade_status

GRADE_LABELS = {"pass", "partial", "fail", "unknown"}


def trial_path(run_dir, trial_id):
    return Path(run_dir) / "trials" / trial_id


def grade_key(row):
    grader = row.get("grader") or {}
    return (row.get("trial_id"), row.get("metric"), grader.get("kind"), grader.get("id"))


def is_recorded_human_grade(row):
    return (row.get("grader") or {}).get("kind") == "human" and not str(
        row.get("rationale") or ""
    ).startswith("Human grader declared;")


def grader_descriptor(grader, *, kind, default_id):
    grader = grader or {}
    descriptor = {"kind": kind, "id": grader.get("id") or default_id}
    descriptor["metric"] = grader.get("metric") or descriptor["id"]
    if "advisory" in grader:
        descriptor["advisory"] = bool(grader["advisory"])
    if "uses_transcript" in grader:
        descriptor["uses_transcript"] = bool(grader["uses_transcript"])
    if "uses_state" in grader:
        descriptor["uses_state"] = bool(grader["uses_state"])
    if grader.get("model"):
        descriptor["model"] = grader["model"]
    if grader.get("reasoning_effort"):
        descriptor["reasoning_effort"] = grader["reasoning_effort"]
    if grader.get("implicit"):
        descriptor["implicit"] = True
    return descriptor


def _grade_row(
    run_dir,
    run,
    state,
    *,
    generation_id,
    grader,
    grade_status,
    score=None,
    checks=None,
    rationale="",
    evidence_refs=None,
    detail=None,
    judge_context=None,
):
    descriptor = grader or {"kind": "none", "id": "meta-skill", "metric": "grade_status"}
    root = Path(run_dir).resolve()
    evidence = []
    for item in evidence_refs or []:
        if not item:
            continue
        path = Path(item)
        try:
            evidence.append(path.resolve().relative_to(root).as_posix())
        except ValueError:
            evidence.append(str(item))
    row = {
        "run_id": run["run_id"],
        "eval_id": state.get("eval_id"),
        "candidate": state.get("candidate"),
        "trial_id": state["trial_id"],
        "grade_generation_id": generation_id,
        "grader": descriptor,
        "metric": descriptor.get("metric") or descriptor.get("id"),
        "grade_status": normalize_grade_status(grade_status),
        "score": score,
        "rationale": rationale,
        "checks": checks or [],
        "evidence_refs": evidence,
        "timestamp": utc_now(),
    }
    if detail is not None:
        row["detail"] = detail
    if judge_context is not None:
        row["judge_context"] = judge_context
    return row


def validator_command(
    path,
    response_path,
    expected_path,
    events_path,
    *,
    artifacts_path=None,
    before_state_path=None,
    after_state_path=None,
):
    if path.suffix.lower() == ".py":
        command = [sys.executable, str(path)]
    elif path.suffix.lower() == ".sh":
        command = ["sh", str(path)]
    elif os.access(path, os.X_OK):
        command = [str(path)]
    else:
        raise CliError(f"unsupported validator file: {path}", 2)
    command.extend(["--output", str(response_path), "--events", str(events_path), "--json"])
    if expected_path:
        command.extend(["--expected", str(expected_path)])
    if artifacts_path:
        command.extend(["--artifacts", str(artifacts_path)])
    if before_state_path:
        command.extend(["--before-state", str(before_state_path)])
    if after_state_path:
        command.extend(["--after-state", str(after_state_path)])
    return command


def normalize_graders(case):
    explicit = case.get("graders") or []
    normalized = []
    for index, grader in enumerate(explicit, 1):
        if not isinstance(grader, dict) or grader.get("kind") not in {"code", "model", "human"}:
            raise CliError(f"invalid grader for eval {case.get('id')}", 2)
        item = dict(grader)
        item["id"] = item.get("id") or f"{item['kind']}-{index}"
        item["metric"] = item.get("metric") or item["id"]
        normalized.append(item)
    if not normalized and (case.get("expectations") or case.get("expected_output")):
        normalized.append(
            {
                "kind": "model",
                "id": "expectations",
                "metric": "expectations",
                "advisory": True,
                "implicit": True,
            }
        )
    return normalized


def grader_path(root, grader, label):
    raw = grader.get("path")
    if not raw:
        return None
    path = safe_case_file(root, raw, label)
    if not path.exists():
        raise CliError(f"{label} missing: {path}", 2)
    return path


def _read(path, limit=None):
    if not path or not Path(path).exists():
        return None
    text = Path(path).read_text()
    return text[:limit] if limit else text


def _rubric_annotation(annotation, *, eval_id=None):
    if not isinstance(annotation, dict) or annotation.get("judge_use") != "rubric":
        return None
    row = dict(annotation)
    if eval_id and not row.get("eval_id"):
        row["eval_id"] = eval_id
    if not row.get("annotation_id"):
        payload = json.dumps(row, sort_keys=True, separators=(",", ":"))
        row["annotation_id"] = f"frozen-{hashlib.sha256(payload.encode()).hexdigest()[:24]}"
    return row


def _dedupe_annotations(rows):
    deduped = {}
    for row in rows:
        if isinstance(row, dict) and row.get("annotation_id"):
            deduped[row["annotation_id"]] = row
    return list(deduped.values())


def _code_grade(run, state, root, grader, generation_id):
    validator = grader_path(root, grader, "validator")
    if validator is None:
        raise CliError(f"code grader {grader['id']} missing path", 2)
    response = trial_path(root.parent.parent.parent, state["trial_id"]) / "response.md"
    events = response.parent / "events.jsonl"
    artifacts = response.parent / "artifacts"
    before_state = response.parent / "before-state.json"
    after_state = response.parent / "after-state.json"
    expected = root / "expected.md"
    expected = expected if expected.exists() else None
    if grader.get("uses_state") and not (before_state.is_file() and after_state.is_file()):
        return _grade_row(
            root.parent.parent.parent,
            run,
            state,
            generation_id=generation_id,
            grader=grader_descriptor(grader, kind="code", default_id=validator.name),
            grade_status="unknown",
            rationale="State-aware grader is missing before or after state evidence.",
            evidence_refs=[response, events, validator],
        )
    proc = subprocess.run(
        validator_command(
            validator,
            response,
            expected,
            events,
            artifacts_path=artifacts,
            before_state_path=before_state if grader.get("uses_state") and before_state.is_file() else None,
            after_state_path=after_state if grader.get("uses_state") and after_state.is_file() else None,
        ),
        capture_output=True,
        text=True,
        cwd=root,
    )
    try:
        data = json.loads(proc.stdout) if proc.returncode == 0 else {}
    except json.JSONDecodeError:
        data = {}
    passed = int(data.get("passed", 0))
    total = int(data.get("total", 0))
    label = "pass" if proc.returncode == 0 and total and passed == total else "fail"
    rationale = data.get("rationale") or (proc.stderr or proc.stdout or f"{passed}/{total} checks passed").strip()
    return _grade_row(
        root.parent.parent.parent,
        run,
        state,
        generation_id=generation_id,
        grader=grader_descriptor(grader, kind="code", default_id=validator.name),
        grade_status=label,
        score=passed / total if total else None,
        checks=data.get("checks") or [],
        rationale=rationale,
        evidence_refs=[response, events, validator],
    )


def _model_grade(
    run_dir,
    run,
    state,
    root,
    grader,
    generation_id,
    model,
    reasoning_effort,
    annotations,
):
    trial = trial_path(run_dir, state["trial_id"])
    response = trial / "response.md"
    events = trial / "events.jsonl"
    expected = root / "expected.md"
    artifacts_dir = trial / "artifacts"
    artifact_paths = (
        sorted(path for path in artifacts_dir.rglob("*") if path.is_file())
        if artifacts_dir.exists()
        else []
    )
    judge_path = grader_path(root, grader, "judge") if grader.get("path") else None
    if not judge_path and not grader.get("implicit"):
        raise CliError(f"model grader {grader['id']} missing case-local judge path", 2)
    trusted = not grader.get("advisory")
    if trusted:
        calibration = grader.get("calibration")
        if not isinstance(calibration, dict):
            raise CliError(f"model grader {grader['id']} missing held-out calibration", 2)
        if not grader.get("model") or not grader.get("reasoning_effort"):
            raise CliError(f"model grader {grader['id']} missing calibrated executor settings", 2)
        actual_digest = hashlib.sha256(judge_path.read_bytes()).hexdigest()
        if actual_digest != calibration.get("judge_sha256"):
            raise CliError(f"model grader {grader['id']} judge digest no longer matches calibration", 2)
    applicable = [
        row
        for row in annotations
        if not trusted
        and (
            row.get("judge_use") == "rubric"
            or (row.get("judge_use") == "evidence" and row.get("trial_id") == state["trial_id"])
        )
    ]
    context_payload = json.dumps(applicable, sort_keys=True, separators=(",", ":"))
    context_digest = hashlib.sha256(context_payload.encode()).hexdigest()
    context_lines = []
    for row in applicable:
        scope = "rubric calibration" if row["judge_use"] == "rubric" else "evidence for this outcome"
        target = row.get("artifact_path") or row.get("artifact") or "response"
        context_lines.append(f"- [{row['annotation_id']}] {scope}; {target}: {row.get('note') or ''}")
    guidance = judge_path.read_text() if judge_path else "Grade the output against every expectation."
    if context_lines:
        guidance += (
            "\n\nHUMAN-APPROVED JUDGE CONTEXT\n"
            "Use rubric annotations as calibration and evidence annotations only for this outcome. "
            "Do not infer rules from any annotation not listed here.\n"
            + "\n".join(context_lines)
        )
    detail = judge_output(
        judge_guidance=guidance,
        task_text=(root / "task.md").read_text(),
        output_text=_read(response) or "",
        expectations=state.get("expectations") or [],
        expected_text=_read(expected),
        events_text=_read(events, 12000) if grader.get("uses_transcript") else None,
        cwd=run_dir,
        event_path=trial / f"judge-{generation_id}.jsonl",
        model=grader.get("model") or model,
        reasoning_effort=grader.get("reasoning_effort") or reasoning_effort,
        artifact_paths=artifact_paths,
    )
    if trusted and detail["label"] == "partial":
        detail = {
            **detail,
            "label": "unknown",
            "rationale": (
                "Trusted model graders are binary; the judge returned partial. "
                "Treat this trial as inconclusive and correct or recalibrate the judge."
            ),
            "grader_error": True,
        }
    return _grade_row(
        run_dir,
        run,
        state,
        generation_id=generation_id,
        grader=grader_descriptor(grader, kind="model", default_id="expectations"),
        grade_status=detail["label"],
        score=detail.get("score"),
        checks=detail.get("checks") or [],
        rationale=detail.get("rationale") or "",
        evidence_refs=[response, *artifact_paths, judge_path, trial / f"judge-{generation_id}.jsonl"],
        detail={
            **{key: value for key, value in detail.items() if key != "eval_feedback"},
            **(
                {"calibration": calibration_metrics(grader["calibration"])}
                if trusted and grader.get("calibration")
                else {}
            ),
        },
        judge_context={
            "annotation_ids": [row["annotation_id"] for row in applicable],
            "digest": context_digest,
        },
    )


def _pending_human(run_dir, run, state, grader, generation_id):
    trial = trial_path(run_dir, state["trial_id"])
    return _grade_row(
        run_dir,
        run,
        state,
        generation_id=generation_id,
        grader=grader_descriptor(grader, kind="human", default_id="human-review"),
        grade_status="unknown",
        rationale="Human grader declared; record a grade after blind review.",
        evidence_refs=[trial / "response.md", trial / "events.jsonl"],
    )


def _grade_trial(run_dir, run, state, case, generation_id, model, reasoning_effort, annotations):
    trial = trial_path(run_dir, state["trial_id"])
    existing = latest_grade_rows(read_jsonl(trial / "grades.jsonl"))
    existing_keys = {grade_key(row) for row in existing}
    status = state.get("status")
    if status not in {"completed", "failed", "timed_out", "skipped"}:
        return []
    if status != "completed":
        return [
            _grade_row(
                run_dir,
                run,
                state,
                generation_id=generation_id,
                grader={"kind": "runtime", "id": "runtime-status", "metric": "runtime"},
                grade_status="fail",
                rationale=f"Runtime did not complete: {status}",
                evidence_refs=[trial / "state.json"],
            )
        ]
    root = run_dir / "inputs" / "cases" / state["eval_id"]
    state = {**state, "expectations": case.get("expectations") or []}
    case_rubrics = [
        row
        for annotation in case.get("annotations") or []
        if (row := _rubric_annotation(annotation, eval_id=state.get("eval_id"))) is not None
    ]
    annotations = _dedupe_annotations([*annotations, *case_rubrics])
    rows = []
    for grader in normalize_graders(case):
        if grader["kind"] == "code":
            rows.append(_code_grade(run, state, root, grader, generation_id))
        elif grader["kind"] == "model":
            rows.append(
                _model_grade(
                    run_dir,
                    run,
                    state,
                    root,
                    grader,
                    generation_id,
                    model,
                    reasoning_effort,
                    annotations,
                )
            )
        else:
            descriptor = grader_descriptor(grader, kind="human", default_id="human-review")
            key = (state["trial_id"], descriptor["metric"], descriptor["kind"], descriptor["id"])
            if key not in existing_keys:
                rows.append(_pending_human(run_dir, run, state, grader, generation_id))
    if not rows and not normalize_graders(case):
        rows.append(
            _grade_row(
                run_dir,
                run,
                state,
                generation_id=generation_id,
                grader={"kind": "none", "id": "meta-skill", "metric": "grade_status"},
                grade_status="ungraded",
                rationale="No runnable grader exists.",
                evidence_refs=[trial / "response.md"],
            )
        )
    return rows


def grade_run(raw_run, *, rebuild_report=True, parallel=1, model=None, reasoning_effort=None):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    suite = read_json(run_dir / "inputs" / "suite.json")
    cases = {case["id"]: case for case in suite.get("evals", [])}
    states = [read_json(path) for path in sorted((run_dir / "trials").glob("*/state.json"))]
    generation_id = f"grade-{run_id()}"
    judge_executor = run.get("judge_executor") or {}
    judge_model = model or judge_executor.get("requested_model") or run.get("model") or DEFAULT_EVAL_MODEL
    judge_reasoning_effort = (
        reasoning_effort
        or judge_executor.get("requested_reasoning")
        or run.get("reasoning_effort")
        or DEFAULT_EVAL_REASONING_EFFORT
    )
    from .report import judge_annotation_context

    annotations = judge_annotation_context(str(run_dir))
    annotations = _dedupe_annotations(annotations)

    def grade(state):
        rows = _grade_trial(
            run_dir,
            run,
            state,
            cases.get(state.get("eval_id"), {}),
            generation_id,
            judge_model,
            judge_reasoning_effort,
            annotations,
        )
        for row in rows:
            append_jsonl(trial_path(run_dir, state["trial_id"]) / "grades.jsonl", row)
        return len(rows)

    if int(parallel or 1) <= 1:
        count = sum(grade(state) for state in states)
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=int(parallel)) as executor:
            count = sum(executor.map(grade, states))
    report_path = None
    if rebuild_report:
        from .report import build_report, write_report

        report_path = write_report(build_report(str(run_dir)))
    return {
        "ok": True,
        "run_id": run["run_id"],
        "grade_generation_id": generation_id,
        "grades": count,
        "report_path": str(report_path) if report_path else None,
    }


def _declared_human(case, grader_id=None, metric=None):
    humans = [grader for grader in normalize_graders(case) if grader["kind"] == "human"]
    if not humans:
        raise CliError(f"eval {case.get('id')} does not declare a human grader", 2)
    if grader_id:
        humans = [grader for grader in humans if grader["id"] == grader_id]
    if metric:
        humans = [grader for grader in humans if grader["metric"] == metric]
    if len(humans) != 1:
        raise CliError("select exactly one declared human grader with --grader/--metric", 2)
    return humans[0]


def record_human_grade(raw_run, *, trial_id, label, rationale, score=None, grader_id=None, metric=None):
    if label not in GRADE_LABELS:
        raise CliError(f"human grade label must be one of {', '.join(sorted(GRADE_LABELS))}", 2)
    if not str(rationale).strip():
        raise CliError("--rationale is required when recording a human grade", 2)
    if score is not None and not 0 <= score <= 1:
        raise CliError("human grade score must be between 0 and 1", 2)
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    trial = trial_path(run_dir, trial_id)
    state = read_json(trial / "state.json")
    suite = read_json(run_dir / "inputs" / "suite.json")
    case = next((item for item in suite.get("evals", []) if item.get("id") == state.get("eval_id")), None)
    if case is None:
        raise CliError(f"frozen eval not found for trial: {trial_id}", 2)
    grader = _declared_human(case, grader_id, metric)
    generation_id = f"grade-{run_id()}"
    row = _grade_row(
        run_dir,
        run,
        state,
        generation_id=generation_id,
        grader=grader_descriptor(grader, kind="human", default_id="human-review"),
        grade_status=label,
        score=score,
        rationale=rationale,
        evidence_refs=[trial / "response.md", trial / "events.jsonl"],
    )
    append_jsonl(trial / "grades.jsonl", row)
    from .report import build_report, write_report

    report_path = write_report(build_report(str(run_dir)))
    return {"ok": True, "run_id": run["run_id"], "trial_id": trial_id, "grade": row, "report_path": str(report_path)}
