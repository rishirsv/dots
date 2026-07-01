"""Sequential eval planning, execution, and progress snapshots."""

import time
from datetime import datetime, timezone

from .app_server.policy import APP_SERVER_APPROVAL_POLICY, APP_SERVER_SANDBOX
from .app_server.trial import app_server_run
from .artifacts import candidate_source, thread_evidence, trial_record
from .candidates import resolve_candidate, snapshot_candidate
from .errors import CliError
from .ids import run_id, utc_now
from .io import append_jsonl, read_json, read_jsonl, resolve_run_dir, write_json
from .manifest import (
    filter_cases,
    load_manifest,
    project_from_suite,
    select_candidates,
    select_cases,
    split_csv_or_repeat,
    suite_path,
    trial_prompt,
    workbench_from_suite,
)
from .run_inputs import freeze_run_inputs, validate_grading_inputs
from .staging import stage_workspace
from .summary import build_summary, summary_exit_code
from .verdicts import normalize_runtime_status


def plan_trials(cases, candidates, repetitions):
    plan = []
    for case in cases:
        reps = repetitions(case)
        for candidate in candidates:
            for index in range(1, int(reps) + 1):
                trial_id = f"{case['id']}.{candidate['candidate']}.t{index}"
                plan.append({"case": case, "candidate": candidate, "index": index, "trial_id": trial_id})
    return plan


def repetition_count(case, args, defaults):
    reps_by_type = getattr(args, "repetitions_by_type", None) or {}
    preset_default = getattr(args, "preset_default_repetitions", None)
    return (
        args.repetitions
        or reps_by_type.get(case.get("type") or "unspecified")
        or case.get("repetitions")
        or preset_default
        or defaults.get("repetitions")
        or 1
    )


def trial_paths(trial_id, run_dir):
    trial_dir = run_dir / "trials" / trial_id
    return {
        "trial": trial_dir,
        "workspace": trial_dir / "workspace",
        "event": trial_dir / "events.jsonl",
        "evidence": trial_dir / "evidence.json",
        "response": trial_dir / "response.md",
    }


def queued_record(row, run_dir):
    trial_id = row["trial_id"]
    paths = trial_paths(trial_id, run_dir)
    return {
        "trial_id": trial_id,
        "case_id": row["case"]["id"],
        "candidate": row["candidate"]["candidate"],
        "repetition": row["index"],
        "planned_status": "skipped" if row.get("skip") else "queued",
        "cwd": str(paths["workspace"]),
        "thread_persistence": "persistent",
        "sandbox": APP_SERVER_SANDBOX,
        "runtime_approval_policy": APP_SERVER_APPROVAL_POLICY,
        "events_path": str(paths["event"]),
        "evidence_path": str(paths["evidence"]),
        "response_path": str(paths["response"]),
    }


def run_trial(row, run_dir, frozen_cases, model):
    trial_id = row["trial_id"]
    case = row["case"]
    candidate = row["candidate"]
    frozen_case = dict(frozen_cases[case["id"]])
    paths = trial_paths(trial_id, run_dir)
    output_path = paths["response"]
    event_path = paths["event"]
    evidence_path = paths["evidence"]
    started = time.time()
    detail = {}
    error = None
    try:
        staged_candidate = stage_workspace(run_dir, trial_id, frozen_case, candidate)
        prompt = trial_prompt(frozen_case["task_text"])
        detail = app_server_run(row, prompt, staged_candidate, event_path, output_path, model)
        detail["workspace"] = staged_candidate["workspace"]
        detail["staged_payload_digest"] = staged_candidate["staged_payload_digest"]
        runtime_status = normalize_runtime_status(detail.get("status"))
        if runtime_status != "completed":
            error = detail.get("status", "runner failed")
    except TimeoutError as exc:
        runtime_status = "timed_out"
        error = str(exc)
    except Exception as exc:
        runtime_status = "failed"
        error = str(exc)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if not output_path.exists():
        output_path.write_text("")
    completed = time.time()
    final_response = output_path.read_text() if output_path.exists() else ""
    persistence = detail.get("thread_persistence") or "persistent"
    evidence = thread_evidence(
        trial_id=trial_id,
        thread_id=detail.get("thread_id"),
        turn_id=detail.get("turn_id"),
        thread_persistence=persistence,
        response_text=final_response or None,
        final_source="turn_result" if final_response else "none",
        items_count=detail.get("events", 0) or 0,
        usage=detail.get("usage"),
        status=runtime_status,
        sdk_version=detail.get("sdk_version"),
        runtime_version=detail.get("runtime_version"),
    )
    write_json(evidence_path, evidence)
    record = trial_record(
        trial_id=trial_id,
        case_id=case["id"],
        candidate=candidate["candidate"],
        repetition=row["index"],
        status=runtime_status,
        thread_id=detail.get("thread_id"),
        turn_id=detail.get("turn_id"),
        thread_persistence=persistence,
        cwd=detail.get("workspace") or str(paths["workspace"]),
        sandbox=detail.get("sandbox") or APP_SERVER_SANDBOX,
        runtime_approval_policy=detail.get("runtime_approval_policy") or APP_SERVER_APPROVAL_POLICY,
        sdk_version=detail.get("sdk_version"),
        runtime_version=detail.get("runtime_version"),
        events_path=str(event_path),
        evidence_path=str(evidence_path),
        response_path=str(output_path),
        usage=detail.get("usage"),
        error=error,
    )
    started_at = datetime.fromtimestamp(started, timezone.utc).isoformat()
    completed_at = datetime.fromtimestamp(completed, timezone.utc).isoformat()
    return {
        "run_id": run_dir.name,
        **record,
        "timing": {
            "started_at": started_at,
            "completed_at": completed_at,
            "duration_ms": int((completed - started) * 1000),
        },
    }


def selected_case_args(args):
    return split_csv_or_repeat(getattr(args, "case", None))


def selected_type_args(args):
    return split_csv_or_repeat(getattr(args, "type", None))


def run_eval(args):
    suite = suite_path(args.suite)
    manifest = load_manifest(suite)
    workbench = workbench_from_suite(suite)
    project = project_from_suite(suite)
    defaults = manifest.get("defaults") or {}
    cases = select_cases(manifest, args.split)
    cases = filter_cases(cases, case_ids=selected_case_args(args), case_types=selected_type_args(args))
    if not cases:
        raise CliError("no cases selected", 2)
    selected_candidate_defs = select_candidates(manifest, args.candidates)
    grading_enabled = not getattr(args, "no_grade", False)
    validate_grading_inputs(cases, grading_enabled=grading_enabled)
    rid = run_id()
    run_dir = workbench / "runs" / rid
    run_dir.mkdir(parents=True, exist_ok=False)
    candidate_infos = [
        snapshot_candidate(run_dir, resolve_candidate(project, workbench, rid, manifest, candidate))
        for candidate in selected_candidate_defs
    ]
    frozen_suite = freeze_run_inputs(
        manifest,
        suite,
        workbench,
        run_dir,
        cases,
        selected_candidate_defs,
        grading_enabled=grading_enabled,
    )
    frozen_cases = {}
    for case in frozen_suite["cases"]:
        frozen_case = dict(case)
        frozen_case["case_root"] = str(run_dir / "inputs" / "cases" / case["id"])
        frozen_cases[case["id"]] = frozen_case
    plan = plan_trials(cases, candidate_infos, lambda case: repetition_count(case, args, defaults))
    preset = getattr(args, "preset", None) or {}
    runner_config = {
        "runner": "codex_app_server",
        "sandbox": APP_SERVER_SANDBOX,
        "runtime_approval_policy": APP_SERVER_APPROVAL_POLICY,
        "grading_mode": "expectations" if grading_enabled else "none",
    }
    model_config = {"model": args.model}
    run_model = {
        "run_id": rid,
        "created_at": utc_now(),
        "suite": str(suite),
        "project": str(project),
        "runner_config": runner_config,
        "model_config": model_config,
        "selected_cases": [case["id"] for case in cases],
        "selected_candidates": [candidate["candidate"] for candidate in selected_candidate_defs],
        "repetitions": {case["id"]: repetition_count(case, args, defaults) for case in cases},
        "suite_digest": frozen_suite["suite_digest"],
        "inputs_path": str(run_dir / "inputs" / "suite.json"),
        "candidate_snapshot_paths": {
            candidate["candidate"]: candidate.get("snapshot_json_path") for candidate in candidate_infos
        },
        **({"preset_id": preset.get("id"), "preset_path": preset.get("path")} if preset else {}),
        "candidates": [candidate_source(candidate) for candidate in candidate_infos],
        "trials": [queued_record(row, run_dir) for row in plan],
    }
    write_json(run_dir / "run.json", run_model)
    append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "run_id": rid, "status": "created"})
    for row in plan:
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": row["trial_id"], "status": "queued"})
    for row in plan:
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": row["trial_id"], "status": "running"})
        result = run_trial(row, run_dir, frozen_cases, args.model)
        append_jsonl(run_dir / "results.jsonl", result)
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": row["trial_id"], "status": result["runtime_status"]})
    grade_result = None
    if grading_enabled:
        from .grading import grade_run

        grade_result = grade_run(str(run_dir), rebuild_summary=False)
    summary = build_summary(str(run_dir))
    exit_code = summary_exit_code(summary, runtime_only=not grading_enabled)
    return {
        "ok": exit_code == 0,
        "run_id": rid,
        "run_dir": str(run_dir),
        "runner_config": runner_config,
        "model_config": model_config,
        "selected_cases": run_model["selected_cases"],
        "selected_candidates": run_model["selected_candidates"],
        "trials": len(plan),
        "grading": grade_result or {"ok": True, "mode": "none"},
        "summary": summary,
    }


def progress_snapshot(raw_run):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    progress = read_jsonl(run_dir / "progress.jsonl")
    results = read_jsonl(run_dir / "results.jsonl")
    grades = read_jsonl(run_dir / "grades.jsonl")
    latest = {}
    for row in progress:
        trial_id = row.get("trial_id")
        if trial_id:
            latest[trial_id] = row.get("status", "unknown")
    counts = {}
    for status in latest.values():
        counts[status] = counts.get(status, 0) + 1
    return {
        "ok": True,
        "run_id": run.get("run_id"),
        "run_dir": str(run_dir),
        "progress": counts,
        "results": len(results),
        "grades": len(grades),
        "trials": len(run.get("trials", [])),
        "summary_path": str(run_dir / "summary.json") if (run_dir / "summary.json").exists() else None,
    }


def terminal_count(snapshot):
    progress = snapshot["progress"]
    return sum(progress.get(status, 0) for status in ("completed", "failed", "timed_out", "skipped"))
