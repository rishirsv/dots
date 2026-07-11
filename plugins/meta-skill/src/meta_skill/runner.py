"""Eval planning and execution with per-trial state."""

import concurrent.futures
import shutil
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path

from .app_server.policy import APP_SERVER_APPROVAL_POLICY, APP_SERVER_SANDBOX
from .app_server.trial import app_server_run
from .candidates import candidate_source, cleanup_candidate_source, resolve_candidate, snapshot_candidate
from .errors import CliError
from .ids import run_id, utc_now
from .io import read_json, resolve_run_dir, write_json
from .manifest import (
    load_manifest,
    project_from_suite,
    runs_from_suite,
    select_candidates,
    select_cases,
    skill_id_from_suite,
    split_csv_or_repeat,
    suite_path,
    trial_prompt,
    workbench_from_suite,
    worktrees_from_suite,
)
from .run_inputs import freeze_run_inputs, validate_grading_inputs
from .runtime import configure_codex_runtime, default_codex_model
from .staging import capture_artifacts, cleanup_workspace, stage_workspace
from .workbench_paths import evals_path, runs_path, skill_dir_for_target, skill_id_for_target, state_root, worktrees_path


TERMINAL_STATUSES = {"completed", "failed", "timed_out", "skipped"}


def plan_trials(cases, candidates, repetitions):
    return [
        {
            "eval": case,
            "candidate": candidate,
            "repetition": index,
            "trial_id": f"{case['id']}.{candidate['candidate']}.t{index}",
        }
        for case in cases
        for candidate in candidates
        for index in range(1, int(repetitions(case)) + 1)
    ]


def repetition_count(case, args, defaults):
    by_type = getattr(args, "repetitions_by_type", None) or {}
    return (
        getattr(args, "repetitions", None)
        or by_type.get(case.get("type") or "unspecified")
        or case.get("repetitions")
        or defaults.get("repetitions")
        or 1
    )


def trial_dir(run_dir, trial_id):
    return Path(run_dir) / "trials" / trial_id


def state_path(run_dir, trial_id):
    return trial_dir(run_dir, trial_id) / "state.json"


def _state(row, run_dir, status, **extra):
    root = trial_dir(run_dir, row["trial_id"])
    return {
        "run_id": Path(run_dir).name,
        "trial_id": row["trial_id"],
        "eval_id": row["eval"]["id"],
        "candidate": row["candidate"]["candidate"],
        "repetition": row["repetition"],
        "status": status,
        "events_path": str(root / "events.jsonl"),
        "response_path": str(root / "response.md"),
        "artifacts_path": str(root / "artifacts"),
        **extra,
    }


def _run_with_deadline(row, prompt, candidate, event_path, response_path, model, timeout_seconds):
    completed = threading.Event()
    outcome = {}

    def call_upstream():
        try:
            outcome["detail"] = app_server_run(row, prompt, candidate, event_path, response_path, model)
        except Exception as exc:
            outcome["error"] = str(exc)
        finally:
            completed.set()

    # Upstream is synchronous and has no cancel primitive. A daemon thread lets
    # the CLI honor its deadline; the timed-out trial discards any late return.
    threading.Thread(target=call_upstream, daemon=True).start()
    if not completed.wait(timeout_seconds):
        return {}, f"trial exceeded {timeout_seconds}s deadline", True, completed
    if outcome.get("error"):
        return {}, outcome["error"], False, None
    return outcome.get("detail") or {}, None, False, None


def run_trial(row, run_dir, worktree_run_root, frozen_cases, model, timeout_seconds):
    trial_id = row["trial_id"]
    root = trial_dir(run_dir, trial_id)
    root.mkdir(parents=True, exist_ok=True)
    (root / "artifacts").mkdir(exist_ok=True)
    (root / "events.jsonl").touch()
    started = time.time()
    started_at = datetime.fromtimestamp(started, timezone.utc).isoformat()
    write_json(state_path(run_dir, trial_id), _state(row, run_dir, "running", started_at=started_at))
    frozen_case = dict(frozen_cases[row["eval"]["id"]])
    workspace = None
    detail = {}
    error = None
    timed_out = False
    timed_out_completion = None
    try:
        staged = stage_workspace(worktree_run_root, trial_id, frozen_case, row["candidate"])
        workspace = staged["workspace"]
        upstream_events = Path(workspace) / ".metaskill-events.jsonl"
        upstream_response = Path(workspace) / ".metaskill-response.md"
        detail, error, timed_out, timed_out_completion = _run_with_deadline(
            row,
            trial_prompt((Path(frozen_case["case_root"]) / "task.md").read_text()),
            staged,
            upstream_events,
            upstream_response,
            model,
            timeout_seconds,
        )
        if upstream_events.exists():
            shutil.copy2(upstream_events, root / "events.jsonl")
        if upstream_response.exists():
            shutil.copy2(upstream_response, root / "response.md")
        status = "timed_out" if timed_out else detail.get("status", "failed")
        status = status if status in TERMINAL_STATUSES else ("completed" if status == "completed" else "failed")
        if status != "completed" and not error:
            error = detail.get("status") or "runner failed"
        if timed_out:
            produced = []
        else:
            produced = capture_artifacts(workspace, root)
    except Exception as exc:
        status = "failed"
        error = str(exc)
        produced = []
    completed = time.time()
    response_path = root / "response.md"
    if not response_path.exists():
        response_path.write_text("")
    final = _state(
        row,
        run_dir,
        status,
        started_at=started_at,
        completed_at=datetime.fromtimestamp(completed, timezone.utc).isoformat(),
        duration_ms=int((completed - started) * 1000),
        thread_id=detail.get("thread_id"),
        turn_id=detail.get("turn_id"),
        usage=detail.get("usage"),
        produced_artifacts=produced,
        error=error,
    )
    write_json(state_path(run_dir, trial_id), final)
    if workspace and timed_out_completion is not None:
        def cleanup_after_upstream_return():
            timed_out_completion.wait()
            cleanup_workspace(workspace, worktree_run_root)

        threading.Thread(target=cleanup_after_upstream_return, daemon=True).start()
    elif workspace:
        cleanup_workspace(workspace, worktree_run_root)
    return final


def selected_eval_args(args):
    return split_csv_or_repeat(getattr(args, "case", None))


def selected_type_args(args):
    return split_csv_or_repeat(getattr(args, "type", None))


def adhoc_context(args):
    task = getattr(args, "task", None)
    if not task or not str(task).strip():
        raise CliError("--adhoc requires --task with a non-empty prompt", 2)
    skill_dir = skill_dir_for_target(getattr(args, "skill", None) or Path.cwd())
    if not (skill_dir / "SKILL.md").is_file():
        raise CliError(f"adhoc run needs a SKILL.md in {skill_dir}", 2)
    state = state_root(skill_dir)
    state.mkdir(parents=True, exist_ok=True)
    suite = evals_path(skill_dir)
    return {
        "manifest": {
            "schema_version": 2,
            "skill_name": skill_dir.name,
            "target": {"type": "skill", "ref": "SKILL.md"},
            "defaults": {"repetitions": 1, "timeout_seconds": 600},
            "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
            "evals": [{
                "id": "adhoc-1",
                "type": getattr(args, "adhoc_type", None) or "capability",
                "priority": getattr(args, "priority", None),
                "prompt": str(task),
                "expected_output": getattr(args, "expected_output", None),
                "expectations": list(getattr(args, "expectations", None) or []),
                "graders": list(getattr(args, "graders", None) or []),
            }],
        },
        "suite": suite,
        "workbench": state,
        "project": skill_dir,
        "skill_id": skill_id_for_target(skill_dir),
        "runs_root": runs_path(skill_dir),
        "worktrees_root": worktrees_path(skill_dir),
        "adhoc": True,
    }


def eval_context(args):
    if getattr(args, "adhoc", False):
        return adhoc_context(args)
    suite = suite_path(args.suite)
    return {
        "manifest": load_manifest(suite),
        "suite": suite,
        "workbench": workbench_from_suite(suite),
        "project": project_from_suite(suite),
        "skill_id": skill_id_from_suite(suite),
        "runs_root": runs_from_suite(suite),
        "worktrees_root": worktrees_from_suite(suite),
        "adhoc": False,
    }


def run_eval(args, context=None, run_id_value=None):
    codex_binary = configure_codex_runtime()
    context = context or eval_context(args)
    manifest = context["manifest"]
    suite = context["suite"]
    workbench = context["workbench"]
    project = context["project"]
    skill_id = context.get("skill_id") or skill_id_for_target(project)
    runs_root = Path(context.get("runs_root") or runs_path(project))
    worktrees_root = Path(context.get("worktrees_root") or worktrees_path(project))
    adhoc = bool(context.get("adhoc"))
    model = getattr(args, "model", None) or default_codex_model(project)
    defaults = manifest.get("defaults") or {}
    cases = select_cases(
        manifest,
        getattr(args, "split", None),
        case_ids=selected_eval_args(args),
        case_types=selected_type_args(args),
    )
    if not cases:
        raise CliError("no evals selected", 2)
    include_baseline = not bool(getattr(args, "no_baseline", False))
    baseline_candidate = getattr(args, "baseline", None)
    candidate_defs = select_candidates(
        manifest,
        getattr(args, "candidates", None),
        include_baseline=include_baseline,
        baseline_id=baseline_candidate,
    )
    grading_enabled = not bool(getattr(args, "no_grade", False)) and (
        not adhoc or any(case.get("expectations") or case.get("graders") or case.get("expected_output") for case in cases)
    )
    validate_grading_inputs(cases, grading_enabled=grading_enabled)
    rid = run_id_value or run_id()
    run_dir = runs_root / rid
    run_dir.mkdir(parents=True, exist_ok=False)
    try:
        candidates = []
        for candidate in candidate_defs:
            resolved = resolve_candidate(
                project,
                worktrees_root,
                rid,
                manifest,
                candidate,
                skill_id_value=skill_id,
            )
            try:
                candidates.append(snapshot_candidate(run_dir, resolved))
            finally:
                cleanup_candidate_source(project, resolved)
        frozen_suite = freeze_run_inputs(manifest, suite, run_dir, cases, candidate_defs, grading_enabled=grading_enabled)
        frozen_cases = {
            case["id"]: {**case, "case_root": str(run_dir / "inputs" / "cases" / case["id"])}
            for case in frozen_suite["evals"]
        }
        plan = plan_trials(cases, candidates, lambda case: repetition_count(case, args, defaults))
        timeout_seconds = int(getattr(args, "timeout", None) or defaults.get("timeout_seconds") or 600)
        run_model = {
            "schema_version": 2,
            "run_id": rid,
            "created_at": utc_now(),
            "adhoc": adhoc,
            "objective": getattr(args, "objective", None) or manifest.get("objective"),
            "skill_id": skill_id,
            "suite": str(suite),
            "project": str(project),
            "runner": {
                "kind": "codex_app_server",
                "sandbox": APP_SERVER_SANDBOX,
                "approval_policy": APP_SERVER_APPROVAL_POLICY,
                "grading": grading_enabled,
                "parallel": max(1, int(getattr(args, "parallel", 1) or 1)),
                "timeout_seconds": timeout_seconds,
                "codex_binary": codex_binary,
            },
            "model": model,
            "baseline_candidate": baseline_candidate or next(
                (
                    candidate["candidate"]
                    for candidate in candidate_defs
                    if (candidate.get("source") or {}).get("kind") == "none"
                ),
                None,
            ),
            "source_run_id": getattr(args, "source_run_id", None),
            "human_review_sample": getattr(args, "human_review_sample", None),
            "suite_digest": frozen_suite["suite_digest"],
            "eval_digests": [
                {"eval_id": case["id"], "case_digest": case["case_digest"]}
                for case in frozen_suite["evals"]
            ],
            "eval_ids": [case["id"] for case in cases],
            "candidates": [candidate_source(candidate) for candidate in candidates],
            "repetitions": {case["id"]: repetition_count(case, args, defaults) for case in cases},
            "trials": [
                {
                    "trial_id": row["trial_id"],
                    "eval_id": row["eval"]["id"],
                    "candidate": row["candidate"]["candidate"],
                    "repetition": row["repetition"],
                }
                for row in plan
            ],
        }
        write_json(run_dir / "run.json", run_model)
        for row in plan:
            root = trial_dir(run_dir, row["trial_id"])
            root.mkdir(parents=True, exist_ok=True)
            write_json(state_path(run_dir, row["trial_id"]), _state(row, run_dir, "queued"))
    except Exception as exc:
        if not (run_dir / "run.json").exists():
            write_json(
                run_dir / "run.json",
                {"schema_version": 2, "run_id": rid, "created_at": utc_now(), "suite": str(suite), "planning_error": str(exc), "trials": []},
            )
        raise

    total = len(plan)
    parallel = run_model["runner"]["parallel"]
    lock = threading.Lock()

    def execute(position, row):
        with lock:
            print(f"[{position}/{total}] {row['trial_id']} running", file=sys.stderr)
        result = run_trial(row, run_dir, worktrees_root / rid, frozen_cases, model, timeout_seconds)
        with lock:
            seconds = round((result.get("duration_ms") or 0) / 1000, 1)
            print(f"[{position}/{total}] {row['trial_id']} {result['status']} ({seconds}s)", file=sys.stderr)
        return result

    if parallel == 1:
        for position, row in enumerate(plan, 1):
            execute(position, row)
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=parallel) as executor:
            futures = [executor.submit(execute, position, row) for position, row in enumerate(plan, 1)]
            for future in concurrent.futures.as_completed(futures):
                future.result()

    if grading_enabled:
        from .grading import grade_run

        grade_run(str(run_dir), rebuild_report=False, parallel=parallel, model=model)
    from .report import build_report, write_report

    report = build_report(str(run_dir))
    report_path = write_report(report)
    ok = not any(item.get("verdict") in {"failed", "inconclusive"} for item in report.get("trials", []))
    return {
        "ok": ok,
        "run_id": rid,
        "run_dir": str(run_dir),
        "adhoc": adhoc,
        "trials": len(plan),
        "totals": report.get("totals"),
        "report_path": str(report_path),
    }


def run_snapshot(raw_run):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    states = [read_json(path) for path in sorted((run_dir / "trials").glob("*/state.json"))]
    counts = {}
    for state in states:
        counts[state.get("status", "unknown")] = counts.get(state.get("status", "unknown"), 0) + 1
    return {
        "ok": True,
        "run_id": run.get("run_id") or run_dir.name,
        "run_dir": str(run_dir),
        "statuses": counts,
        "trials": len(run.get("trials", [])),
        "terminal": sum(counts.get(status, 0) for status in TERMINAL_STATUSES),
    }
