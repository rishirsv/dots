"""Eval planning and execution with per-trial state."""

import concurrent.futures
import hashlib
import json
import os
import shutil
import sys
import tempfile
import threading
import uuid
from datetime import datetime
from pathlib import Path

from .candidates import candidate_source, cleanup_candidate_source, resolve_candidate, snapshot_candidate
from .codex_exec import (
    codex_readiness,
    executor_provenance,
    run_task,
    terminate_active_processes,
)
from .errors import CliError
from .ids import run_id, utc_now
from .io import read_json, read_jsonl, resolve_run_dir, write_json
from .manifest import (
    load_manifest,
    project_from_suite,
    runs_from_suite,
    select_candidates,
    select_cases,
    skill_id_from_suite,
    split_csv_or_repeat,
    suite_path,
    workbench_from_suite,
    worktrees_from_suite,
)
from .run_inputs import freeze_run_inputs, validate_grading_inputs
from .runtime import DEFAULT_EVAL_MODEL, DEFAULT_EVAL_REASONING_EFFORT, resolve_parallelism
from .staging import capture_artifacts, capture_state_snapshot, relocate_workspace_links, stage_workspace
from .suite_checks import check_suite
from .workbench_paths import evals_path, runs_path, skill_dir_for_target, skill_id_for_target, skill_name_for_target, state_root, worktrees_path


TERMINAL_STATUSES = {"completed", "failed", "timed_out", "skipped", "cancelled"}
REASONING_EFFORTS = {"none", "minimal", "low", "medium", "high", "xhigh"}
RUN_PHASES_BY_STATUS = {
    "planned": {"planning"},
    "running": {"executing", "grading", "finalizing"},
    "completed": {"finished"},
    "cancelled": {"stopped"},
    "failed": {"stopped"},
}
_RUN_STATE_LOCK = threading.Lock()


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


def run_state_path(run_dir):
    return Path(run_dir) / "state.json"


def _trial_status_counts(run_dir):
    counts = {}
    for path in sorted((Path(run_dir) / "trials").glob("*/state.json")):
        status = read_json(path).get("status", "unknown")
        counts[status] = counts.get(status, 0) + 1
    return counts


def update_run_state(run_dir, *, status=None, phase=None, stop_reason=None, **extra):
    """Atomically write the parent-owned lifecycle projection for a run."""
    with _RUN_STATE_LOCK:
        return _update_run_state(
            run_dir,
            status=status,
            phase=phase,
            stop_reason=stop_reason,
            **extra,
        )


def _update_run_state(run_dir, *, status=None, phase=None, stop_reason=None, **extra):
    path = run_state_path(run_dir)
    current = read_json(path) if path.is_file() else {}
    run_path = Path(run_dir) / "run.json"
    run = read_json(run_path) if run_path.is_file() else {}
    counts = _trial_status_counts(run_dir)
    now = utc_now()
    next_status = status or current.get("status") or "planned"
    next_phase = phase or current.get("phase") or "planning"
    if next_status not in RUN_PHASES_BY_STATUS or next_phase not in RUN_PHASES_BY_STATUS[next_status]:
        raise CliError(f"invalid run lifecycle state: {next_status}/{next_phase}", 2)
    row = {
        **current,
        "schema_version": 1,
        "run_id": run.get("run_id") or Path(run_dir).name,
        "status": next_status,
        "phase": next_phase,
        "planned_trials": len(run.get("trials") or []) or sum(counts.values()),
        "terminal_trials": sum(counts.get(item, 0) for item in TERMINAL_STATUSES),
        "trial_status_totals": counts,
        "updated_at": now,
        **extra,
    }
    if next_status == "running" and not row.get("started_at"):
        row["started_at"] = now
    if next_status in {"completed", "cancelled", "failed"}:
        row["completed_at"] = now
    if stop_reason is not None:
        row["stop_reason"] = str(stop_reason)
    write_json(path, row)
    return row


def _duration(result, current, completed_at):
    reported = result.get("duration_ms")
    if isinstance(reported, (int, float)) and reported > 0:
        return int(reported), "worker"
    started_at = current.get("started_at") or current.get("prepared_at")
    if not started_at:
        return None, None
    try:
        elapsed = datetime.fromisoformat(completed_at) - datetime.fromisoformat(started_at)
    except (TypeError, ValueError):
        return None, None
    milliseconds = round(elapsed.total_seconds() * 1000)
    return (milliseconds, "prepared_to_submit") if milliseconds > 0 else (None, None)


def cancel_unresolved_trials(run_dir, reason):
    now = utc_now()
    for path in sorted((Path(run_dir) / "trials").glob("*/state.json")):
        state = read_json(path)
        if state.get("status") in TERMINAL_STATUSES:
            continue
        state.pop("workspace_path", None)
        write_json(
            path,
            {
                **state,
                "status": "cancelled",
                "completed_at": now,
                "error": str(reason),
            },
        )


def _state(row, run_dir, status, **extra):
    return {
        "run_id": Path(run_dir).name,
        "trial_id": row["trial_id"],
        "eval_id": row["eval"]["id"],
        "candidate": row["candidate"]["candidate"],
        "repetition": row["repetition"],
        "status": status,
        **extra,
    }


def _contained(path, root, label):
    path = Path(path).expanduser().resolve()
    root = Path(root).expanduser().resolve()
    if not path.is_relative_to(root):
        raise CliError(f"{label} must stay inside the worker workspace", 2)
    return path


def _packet(row, staged):
    workspace = Path(staged["workspace"]).resolve()
    attempt_id = uuid.uuid4().hex
    packet = {
        "trial_id": row["trial_id"],
        "attempt_id": attempt_id,
        "workspace_path": str(workspace),
        "task_path": str(workspace / "task.md"),
        "fixture_root": str(workspace / "fixtures"),
        "result_path": str(workspace / "result.json"),
        "artifact_root": str(workspace / "artifacts"),
        "variant": staged.get("variant"),
        "model": staged.get("model"),
        "prompt": staged.get("prompt"),
        "prompt_text": staged.get("prompt_text"),
        "tools": staged.get("tools") or [],
        "plugins": staged.get("plugins") or [],
        "retrieval": staged.get("retrieval"),
    }
    if staged.get("payload_path"):
        packet["skill_path"] = staged["payload_path"]
    write_json(workspace / "worker.json", packet)
    return packet


def _result_digest(result, workspace):
    digest = hashlib.sha256(json.dumps(result, sort_keys=True, separators=(",", ":")).encode())
    artifact_root = Path(workspace) / "artifacts"
    for rel_path in sorted(result.get("artifacts") or []):
        path = _contained(artifact_root / rel_path, artifact_root, "artifact path")
        if not path.is_file() or path.is_symlink():
            raise CliError(f"declared artifact missing or unsafe: {rel_path}", 2)
        digest.update(str(rel_path).encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def _artifact_list(result):
    artifacts = result.get("artifacts")
    if not isinstance(artifacts, list) or any(not isinstance(path, str) or not path for path in artifacts):
        raise CliError("worker result artifacts must be a list of relative paths", 2)
    if len(set(artifacts)) != len(artifacts):
        raise CliError("worker result artifacts must not contain duplicates", 2)
    return artifacts


def _submitted_executor(run, result):
    """Keep executor identity parent-owned; accept only Codex observations."""
    planned = dict(run.get("task_executor") or {})
    reported = result.get("executor") or {}
    if planned.get("kind") != "codex_exec" or reported.get("kind") != "codex_exec":
        return planned
    for key in ("requested_model", "requested_reasoning"):
        if reported.get(key) != planned.get(key):
            return planned
    observed = reported.get("observed_model")
    runtime_version = reported.get("runtime_version")
    if isinstance(observed, str) and observed:
        planned["observed_model"] = observed
        planned["provenance"] = "observed"
    if isinstance(runtime_version, str) and runtime_version:
        planned["runtime_version"] = runtime_version
    return planned


def submit_trial(raw_run, trial_id, attempt_id, raw_result):
    """Import a workspace-local worker result into the durable run tree."""
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    planned = next((row for row in run.get("trials", []) if row.get("trial_id") == trial_id), None)
    if not planned:
        raise CliError(f"trial not found in run: {trial_id}", 2)
    current = read_json(state_path(run_dir, trial_id))
    workspace = Path(
        current.get("workspace_path")
        or state_root(run["project"]) / "tmp" / run_dir.name / "trials" / trial_id
    ).resolve()
    result_path = _contained(raw_result, workspace, "worker result")
    if result_path != workspace / "result.json":
        raise CliError("worker result must use the packet result path", 2)
    result = read_json(result_path)
    if result.get("trial_id") != trial_id or result.get("attempt_id") != attempt_id:
        raise CliError("worker result does not match the trial attempt", 2)
    if attempt_id != current.get("attempt_id"):
        raise CliError("worker result attempt is stale", 2)
    status = result.get("status")
    if status not in {"completed", "failed", "timed_out"}:
        raise CliError("worker result status must be completed, failed, or timed_out", 2)
    artifacts = _artifact_list(result)
    digest = _result_digest(result, workspace)
    if current.get("status") in TERMINAL_STATUSES:
        if current.get("result_digest") == digest:
            return current
        raise CliError("trial already has a different terminal result", 2)
    if current.get("status") not in {"queued", "running"}:
        raise CliError(f"trial cannot accept a result while {current.get('status')}", 2)

    root = trial_dir(run_dir, trial_id)
    frozen_suite = read_json(run_dir / "inputs" / "suite.json")
    frozen_case = next(
        (case for case in frozen_suite.get("evals") or [] if case.get("id") == planned.get("eval_id")),
        None,
    )
    if frozen_case is None:
        raise CliError(f"frozen eval not found for trial: {trial_id}", 2)
    frozen_case = {
        **frozen_case,
        "case_root": str(run_dir / "inputs" / "scenarios" / planned["eval_id"]),
    }
    after_state = capture_state_snapshot(frozen_case, workspace, root / "after-state.json", "after")
    import_root = Path(tempfile.mkdtemp(prefix=".submission-", dir=root))
    try:
        response_path = import_root / "response.md"
        response_path.write_text(str(result.get("response") or ""))
        produced = capture_artifacts(workspace, import_root, artifacts)
        events_path = result.get("events_path")
        if events_path:
            source_events = _contained(events_path, workspace, "worker events")
            if source_events.is_file() and not source_events.is_symlink():
                shutil.copy2(source_events, import_root / "events.jsonl")
        if not (import_root / "events.jsonl").exists():
            (import_root / "events.jsonl").touch()
        relocate_workspace_links(response_path, workspace)
        for name in ("response.md", "events.jsonl"):
            os.replace(import_root / name, root / name)
        destination_artifacts = root / "artifacts"
        if destination_artifacts.exists():
            shutil.rmtree(destination_artifacts)
        if (import_root / "artifacts").exists():
            os.replace(import_root / "artifacts", destination_artifacts)
        else:
            destination_artifacts.mkdir()
    finally:
        shutil.rmtree(import_root, ignore_errors=True)

    now = utc_now()
    duration_ms, duration_source = _duration(result, current, now)
    final = {
        **{key: value for key, value in current.items() if key != "workspace_path"},
        "status": status,
        "completed_at": now,
        "duration_ms": duration_ms,
        "duration_source": duration_source,
        "usage": result.get("usage"),
        "produced_artifacts": produced,
        "error": result.get("error"),
        "task_executor": _submitted_executor(run, result),
        "result_digest": digest,
        "state_evidence": {
            **(current.get("state_evidence") or {}),
            **({"after": after_state} if after_state else {}),
        },
    }
    write_json(state_path(run_dir, trial_id), final)
    update_run_state(run_dir, status="running", phase="executing")
    return final


def unresolved_trials(raw_run):
    run_dir = resolve_run_dir(raw_run)
    rows = []
    for path in sorted((run_dir / "trials").glob("*/state.json")):
        state = read_json(path)
        if state.get("status") in TERMINAL_STATUSES:
            continue
        workspace = Path(state["workspace_path"])
        packet_path = workspace / "worker.json"
        rows.append({"state": state, "packet": read_json(packet_path) if packet_path.is_file() else None})
    return {"ok": True, "run_id": run_dir.name, "run_dir": str(run_dir), "unresolved": rows}


def retry_trial(raw_run, trial_id):
    """Issue a fresh attempt token for an explicitly selected unresolved trial."""
    run_dir = resolve_run_dir(raw_run)
    current = read_json(state_path(run_dir, trial_id))
    if current.get("status") not in {"queued", "running"}:
        raise CliError("only a queued or running trial can be retried", 2)
    if (current.get("state_evidence") or {}).get("before"):
        raise CliError("stateful trials require a new run instead of an in-place retry", 2)
    workspace = Path(current["workspace_path"])
    packet = read_json(workspace / "worker.json")
    packet["attempt_id"] = uuid.uuid4().hex
    write_json(workspace / "worker.json", packet)
    result_path = Path(packet["result_path"])
    if result_path.exists():
        result_path.unlink()
    for name in ("response.md", "events.jsonl"):
        path = workspace / name
        if path.exists():
            path.unlink()
    artifact_root = workspace / "artifacts"
    if artifact_root.exists():
        shutil.rmtree(artifact_root)
    artifact_root.mkdir()
    state = {
        **current,
        "status": "queued",
        "attempt_id": packet["attempt_id"],
        "prepared_at": utc_now(),
    }
    state.pop("started_at", None)
    write_json(state_path(run_dir, trial_id), state)
    return {"ok": True, "run_id": run_dir.name, "packet": packet}


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
            "format": manifest.get("format", "custom"),
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


def _reuse_completed_trials(run_dir, runs_root, resume_run_id, run_model, plan):
    """Copy exact completed trial evidence from an interrupted earlier run."""
    if not resume_run_id:
        return set()
    if Path(str(resume_run_id)).name != str(resume_run_id):
        raise CliError("resume run id must be a run name, not a path", 2)
    source_dir = Path(runs_root) / str(resume_run_id)
    source_run_path = source_dir / "run.json"
    if not source_run_path.is_file():
        raise CliError(f"resume run not found: {resume_run_id}", 2)
    source = read_json(source_run_path)
    if source.get("model") != run_model.get("model"):
        raise CliError("resume run model differs from the new run", 2)
    source_executor = source.get("task_executor") or {}
    current_executor = run_model.get("task_executor") or {}
    reproducible = {"requested", "observed"}
    if source_executor.get("provenance") not in reproducible or current_executor.get("provenance") not in reproducible:
        return set()
    executor_identity = (
        "kind", "requested_model", "requested_reasoning", "observed_model",
        "provenance", "runtime_version", "isolation",
    )
    if any(source_executor.get(key) != current_executor.get(key) for key in executor_identity):
        return set()
    source_cases = {row["eval_id"]: row.get("case_digest") for row in source.get("eval_digests") or []}
    current_cases = {row["eval_id"]: row.get("case_digest") for row in run_model.get("eval_digests") or []}
    source_candidates = {row["candidate"]: row.get("payload_digest") for row in source.get("candidates") or []}
    current_candidates = {row["candidate"]: row.get("payload_digest") for row in run_model.get("candidates") or []}
    reused = set()
    for row in plan:
        trial_id = row["trial_id"]
        eval_id = row["eval"]["id"]
        candidate_id = row["candidate"]["candidate"]
        if source_cases.get(eval_id) != current_cases.get(eval_id):
            continue
        if source_candidates.get(candidate_id) != current_candidates.get(candidate_id):
            continue
        source_trial = source_dir / "trials" / trial_id
        source_state_path = source_trial / "state.json"
        if not source_state_path.is_file():
            continue
        source_state = read_json(source_state_path)
        if source_state.get("status") != "completed":
            continue
        if not (source_trial / "response.md").is_file():
            continue
        if source_executor.get("kind") == "codex_exec":
            events_path = source_trial / "events.jsonl"
            if not events_path.is_file() or not any(
                event.get("type") == "turn.completed"
                for event in read_jsonl(events_path)
            ):
                continue
        if row["eval"].get("outcome", "response") == "artifact":
            produced = source_state.get("produced_artifacts") or []
            if not produced:
                continue
            artifact_root = (source_trial / "artifacts").resolve()
            if any(
                not (artifact_root / artifact).resolve().is_relative_to(artifact_root)
                or not (artifact_root / artifact).is_file()
                for artifact in produced
            ):
                continue
        source_trial_executor = source_state.get("task_executor") or {}
        if any(source_trial_executor.get(key) != current_executor.get(key) for key in executor_identity):
            continue
        destination = trial_dir(run_dir, trial_id)
        shutil.rmtree(destination)
        shutil.copytree(source_trial, destination)
        state = read_json(destination / "state.json")
        state["run_id"] = Path(run_dir).name
        state["reused_from"] = {"run_id": str(resume_run_id), "trial_id": trial_id}
        write_json(destination / "state.json", state)
        reused.add(trial_id)
    return reused


def prepare_eval(args, context=None, run_id_value=None, *, task_executor_kind="native_subagent"):
    context = context or eval_context(args)
    manifest = context["manifest"]
    suite = context["suite"]
    workbench = context["workbench"]
    project = context["project"]
    skill_id = context.get("skill_id") or skill_id_for_target(project)
    runs_root = Path(context.get("runs_root") or runs_path(project))
    worktrees_root = Path(context.get("worktrees_root") or worktrees_path(project))
    adhoc = bool(context.get("adhoc"))
    defaults = manifest.get("defaults") or {}
    model = getattr(args, "model", None) or defaults.get("model") or DEFAULT_EVAL_MODEL
    reasoning_effort = (
        getattr(args, "reasoning_effort", None)
        or defaults.get("reasoning_effort")
        or DEFAULT_EVAL_REASONING_EFFORT
    )
    if reasoning_effort not in REASONING_EFFORTS:
        raise CliError(
            f"reasoning effort must be one of {', '.join(sorted(REASONING_EFFORTS))}",
            2,
        )
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
        getattr(args, "variants", None),
        include_baseline=include_baseline,
        baseline_id=baseline_candidate,
    )
    if task_executor_kind == "codex_exec":
        unsupported_providers = [
            row.get("candidate") for row in candidate_defs
            if isinstance(row.get("model"), dict)
            and row["model"].get("provider") not in {None, "openai", "codex"}
        ]
        if unsupported_providers:
            raise CliError(
                "Codex Exec cannot run variants with unsupported model providers: "
                + ", ".join(unsupported_providers),
                2,
            )
        unsupported = [
            row.get("candidate") for row in candidate_defs
            if row.get("tools") or row.get("plugins") or row.get("retrieval")
        ]
        if unsupported:
            raise CliError(
                "Codex Exec cannot yet provision tools, plugins, or retrieval declared by variants: "
                + ", ".join(unsupported),
                2,
            )
    if task_executor_kind != "codex_exec" and len(candidate_defs) > 1:
        raise CliError(
            "native subagents cannot guarantee isolated variant comparisons; "
            "use eval run or select one variant with --no-baseline",
            2,
        )
    grading_enabled = not bool(getattr(args, "no_grade", False)) and (
        not adhoc or any(case.get("expectations") or case.get("graders") or case.get("expected_output") for case in cases)
    )
    validate_grading_inputs(
        cases,
        grading_enabled=grading_enabled,
        allow_advisory_only=adhoc,
    )
    if grading_enabled and not adhoc:
        checks = check_suite(manifest, suite)
        if not checks["ok"]:
            failed = ", ".join(
                f"{row['case_id']}/{row['grader']}/{row['check']}"
                for row in checks["checks"]
                if not row["ok"]
            )
            raise CliError(f"suite grader checks failed: {failed}", 2)
    evaluation_mode = manifest.get("evaluation_mode", "diagnostic")
    benchmark_split = getattr(args, "split", None)
    if evaluation_mode == "benchmark":
        if not benchmark_split:
            raise CliError("benchmark runs must select exactly one declared split with --split", 2)
    repetitions = {case["id"]: repetition_count(case, args, defaults) for case in cases}
    if evaluation_mode in {"readiness", "benchmark"}:
        if len(cases) < 20:
            raise CliError(f"{evaluation_mode} runs need at least 20 selected cases", 2)
    planned_trial_count = sum(int(count) for count in repetitions.values()) * len(candidate_defs)
    if any(int(count) > 1 for count in repetitions.values()):
        approved_trial_count = getattr(args, "approve_trial_count", None)
        if approved_trial_count != planned_trial_count:
            raise CliError(
                "repetitions expand this evaluation to "
                f"{planned_trial_count} trials across {len(cases)} cases and "
                f"{len(candidate_defs)} candidates; re-run with "
                f"--approve-trial-count {planned_trial_count} only after the user approves this exact plan",
                2,
            )
    rid = run_id_value or run_id()
    run_dir = runs_root / rid
    run_dir.mkdir(parents=True, exist_ok=False)
    workspace_root = state_root(project) / "tmp" / rid / "trials"
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
        frozen_suite = freeze_run_inputs(
            manifest,
            suite,
            run_dir,
            cases,
            candidate_defs,
            grading_enabled=grading_enabled,
            allow_advisory_only=adhoc,
        )
        frozen_cases = {
            case["id"]: {**case, "case_root": str(run_dir / "inputs" / "scenarios" / case["id"])}
            for case in frozen_suite["evals"]
        }
        plan = plan_trials(cases, candidates, lambda case: repetition_count(case, args, defaults))
        timeout_seconds = int(getattr(args, "timeout", None) or defaults.get("timeout_seconds") or 600)
        requested_parallel = getattr(args, "parallel", None)
        resolved_parallel = resolve_parallelism(requested_parallel, planned_trial_count)
        run_model = {
            "schema_version": 2,
            "run_id": rid,
            "created_at": utc_now(),
            "adhoc": adhoc,
            "objective": getattr(args, "objective", None) or manifest.get("objective"),
            "evaluation_mode": evaluation_mode,
            "repetition_policy": defaults.get("repetition_policy", "all_trials"),
            "validity_review": manifest.get("validity_review"),
            "coverage_requirements": list(manifest.get("coverage_requirements") or []),
            "benchmark": manifest.get("benchmark"),
            "benchmark_split": benchmark_split if evaluation_mode == "benchmark" else None,
            "holdout_evaluation": bool(
                evaluation_mode == "benchmark"
                and benchmark_split == (manifest.get("benchmark") or {}).get("held_out_split")
            ),
            "skill_id": skill_id,
            "skill_name": skill_name_for_target(project),
            "suite": str(suite),
            "project": str(project),
            "runner": {
                "kind": "runner_neutral",
                "grading": grading_enabled,
                "parallel": resolved_parallel,
                "parallel_mode": "auto" if requested_parallel is None else "explicit",
                "timeout_seconds": timeout_seconds,
                "regression_gate": bool(getattr(args, "gate", False)),
            },
            "task_executor": executor_provenance(
                task_executor_kind,
                model if task_executor_kind == "codex_exec" else getattr(args, "model", None),
                reasoning_effort if task_executor_kind == "codex_exec" else getattr(args, "reasoning_effort", None),
                provenance="requested" if task_executor_kind == "codex_exec" else "inherited",
            ),
            "judge_executor": executor_provenance(
                "codex_exec",
                model,
                reasoning_effort,
                provenance="requested",
            ) if grading_enabled else None,
            "model": model,
            "reasoning_effort": reasoning_effort,
            "baseline_variant": baseline_candidate or next(
                (
                    candidate["candidate"]
                    for candidate in candidate_defs
                    if (candidate.get("source") or {}).get("kind") == "none"
                ),
                None,
            ),
            "resume_run_id": getattr(args, "resume_run_id", None),
            "suite_digest": frozen_suite["suite_digest"],
            "eval_digests": [
                {"eval_id": case["id"], "case_digest": case["case_digest"]}
                for case in frozen_suite["evals"]
            ],
            "eval_ids": [case["id"] for case in cases],
            "variants": [candidate_source(candidate) for candidate in candidates],
            "candidates": [candidate_source(candidate) for candidate in candidates],
            "repetitions": repetitions,
            "approved_trial_count": (
                planned_trial_count
                if any(int(count) > 1 for count in repetitions.values())
                else None
            ),
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
        for row in plan:
            root = trial_dir(run_dir, row["trial_id"])
            root.mkdir(parents=True, exist_ok=True)
            write_json(state_path(run_dir, row["trial_id"]), _state(row, run_dir, "queued"))
        reused_trial_ids = _reuse_completed_trials(
            run_dir, runs_root, getattr(args, "resume_run_id", None), run_model, plan
        )
        run_model["reused_trials"] = len(reused_trial_ids)
        write_json(run_dir / "run.json", run_model)
        update_run_state(run_dir, status="planned", phase="planning")
        packets = []
        for row in plan:
            if row["trial_id"] in reused_trial_ids:
                continue
            frozen_case = dict(frozen_cases[row["eval"]["id"]])
            staged = stage_workspace(workspace_root, row["trial_id"], frozen_case, row["candidate"])
            before_state = capture_state_snapshot(
                frozen_case,
                staged["workspace"],
                trial_dir(run_dir, row["trial_id"]) / "before-state.json",
                "before",
            )
            packet = _packet(row, staged)
            state = read_json(state_path(run_dir, row["trial_id"]))
            write_json(
                state_path(run_dir, row["trial_id"]),
                {
                    **state,
                    "attempt_id": packet["attempt_id"],
                    "workspace_path": packet["workspace_path"],
                    "prepared_at": utc_now(),
                    "state_evidence": {"before": before_state} if before_state else {},
                },
            )
            packets.append(packet)
        update_run_state(run_dir, status="planned", phase="planning")
    except Exception as exc:
        shutil.rmtree(workspace_root, ignore_errors=True)
        if not (run_dir / "run.json").exists():
            write_json(
                run_dir / "run.json",
                {
                    "schema_version": 2,
                    "run_id": rid,
                    "created_at": utc_now(),
                    "adhoc": adhoc,
                    "skill_id": skill_id,
                    "suite": str(suite),
                    "project": str(project),
                    "planning_error": str(exc),
                    "task_executor": executor_provenance(
                        task_executor_kind,
                        model if task_executor_kind == "codex_exec" else getattr(args, "model", None),
                        reasoning_effort
                        if task_executor_kind == "codex_exec"
                        else getattr(args, "reasoning_effort", None),
                        provenance="requested" if task_executor_kind == "codex_exec" else "inherited",
                    ),
                    "judge_executor": executor_provenance(
                        "codex_exec", model, reasoning_effort, provenance="requested"
                    ) if grading_enabled else None,
                    "trials": [],
                },
            )
        update_run_state(
            run_dir,
            status="failed",
            phase="stopped",
            stop_reason=str(exc),
            stop_phase="planning",
        )
        raise

    return {
        "ok": True,
        "run_id": rid,
        "run_dir": str(run_dir),
        "adhoc": adhoc,
        "trials": len(plan),
        "reused_trials": len(reused_trial_ids),
        "dispatch_parallelism": (
            min(run_model["runner"]["parallel"], len(packets)) if packets else 0
        ),
        "packets": packets,
    }


def finalize_eval(raw_run, *, grade=None, parallel=None, model=None, reasoning_effort=None):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    states = [read_json(path) for path in sorted((run_dir / "trials").glob("*/state.json"))]
    unresolved = [state["trial_id"] for state in states if state.get("status") not in TERMINAL_STATUSES]
    if unresolved:
        raise CliError(f"run still has unresolved trials: {', '.join(unresolved)}", 2)
    grading_enabled = run.get("runner", {}).get("grading", False) if grade is None else bool(grade)
    active_phase = "grading" if grading_enabled else "finalizing"
    try:
        if grading_enabled:
            update_run_state(run_dir, status="running", phase="grading")
            from .grading import grade_run

            grade_run(
                str(run_dir),
                rebuild_report=False,
                parallel=parallel or run.get("runner", {}).get("parallel", 1),
                model=model or run.get("model"),
                reasoning_effort=reasoning_effort or run.get("reasoning_effort"),
            )
        active_phase = "finalizing"
        update_run_state(run_dir, status="running", phase=active_phase)
        try:
            from .html_preview import generate_html_previews

            generate_html_previews(run_dir)
        except Exception:
            # Preview generation is an optional review aid, never run evidence.
            pass
        from .report import build_report, write_report

        report = build_report(str(run_dir))
        execution_ok = bool(report.get("execution_ok"))
        gate_enabled = bool((run.get("runner") or {}).get("regression_gate"))
        gate_passed = bool(report.get("regression_gate_passed"))
        ok = execution_ok and (gate_passed if gate_enabled else True)
        update_run_state(
            run_dir,
            status="completed",
            phase="finished",
            execution_ok=execution_ok,
            evaluation_passed=bool(report.get("evaluation_passed")),
            regression_gate_passed=gate_passed,
        )
        report = build_report(str(run_dir))
        report_path = write_report(report)
        project = Path(run["project"])
        shutil.rmtree(state_root(project) / "tmp" / run_dir.name, ignore_errors=True)
        return {
            "ok": ok,
            "execution_ok": execution_ok,
            "evaluation_passed": bool(report.get("evaluation_passed")),
            "regression_gate_enabled": gate_enabled,
            "regression_gate_passed": gate_passed,
            "run_id": run.get("run_id") or run_dir.name,
            "run_dir": str(run_dir),
            "adhoc": bool(run.get("adhoc")),
            "trials": len(run.get("trials", [])),
            "reused_trials": int(run.get("reused_trials") or 0),
            "totals": report.get("totals"),
            "report_path": str(report_path),
        }
    except KeyboardInterrupt:
        terminate_active_processes()
        cancel_unresolved_trials(run_dir, "interrupted during finalization")
        update_run_state(
            run_dir,
            status="cancelled",
            phase="stopped",
            stop_reason="interrupted by user",
            stop_phase=active_phase,
        )
        raise
    except Exception as exc:
        terminate_active_processes()
        cancel_unresolved_trials(run_dir, f"finalization failed: {exc}")
        update_run_state(
            run_dir,
            status="failed",
            phase="stopped",
            stop_reason=str(exc),
            stop_phase=active_phase,
        )
        raise


def run_eval(args, context=None, run_id_value=None):
    ready, readiness_message, _detail = codex_readiness()
    if not ready:
        raise CliError(readiness_message, 2)
    prepared = prepare_eval(
        args,
        context=context,
        run_id_value=run_id_value,
        task_executor_kind="codex_exec",
    )
    run_dir = Path(prepared["run_dir"])
    run = read_json(run_dir / "run.json")
    packets = prepared["packets"]
    total = len(packets)
    parallel = run["runner"]["parallel"]
    progress_lock = threading.Lock()
    completed = 0
    update_run_state(run_dir, status="running", phase="executing")

    def execute(_position, packet):
        nonlocal completed
        with progress_lock:
            print(f"[start] {packet['trial_id']}", file=sys.stderr)
        state = read_json(state_path(run_dir, packet["trial_id"]))
        write_json(state_path(run_dir, packet["trial_id"]), {**state, "status": "running", "started_at": utc_now()})
        try:
            result = run_task(
                packet,
                model=((packet.get("model") or {}).get("name") if isinstance(packet.get("model"), dict) else packet.get("model")) or run.get("model"),
                reasoning_effort=((packet.get("model") or {}).get("reasoning_effort") if isinstance(packet.get("model"), dict) else None) or run.get("reasoning_effort"),
                timeout_seconds=run["runner"]["timeout_seconds"],
            )
        except Exception as exc:
            result = {
                "trial_id": packet["trial_id"],
                "attempt_id": packet["attempt_id"],
                "status": "failed",
                "response": "",
                "artifacts": [],
                "duration_ms": 0,
                "error": str(exc),
                "executor": run.get("task_executor"),
            }
            write_json(packet["result_path"], result)
        submitted = submit_trial(run_dir, packet["trial_id"], packet["attempt_id"], packet["result_path"])
        update_run_state(run_dir, status="running", phase="executing")
        duration_ms = submitted.get("duration_ms")
        elapsed = f"{round(duration_ms / 1000, 1)}s" if duration_ms else "duration unknown"
        with progress_lock:
            completed += 1
            print(
                f"[{completed}/{total} complete] {packet['trial_id']} "
                f"{submitted['status']} ({elapsed})",
                file=sys.stderr,
            )
        return submitted

    try:
        if parallel == 1:
            for position, packet in enumerate(packets, 1):
                execute(position, packet)
        else:
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=parallel)
            futures = []
            try:
                futures = [
                    executor.submit(execute, position, packet)
                    for position, packet in enumerate(packets, 1)
                ]
                for future in concurrent.futures.as_completed(futures):
                    future.result()
            except BaseException:
                terminate_active_processes()
                for future in futures:
                    future.cancel()
                executor.shutdown(wait=True, cancel_futures=True)
                raise
            else:
                executor.shutdown(wait=True)
    except KeyboardInterrupt:
        terminate_active_processes()
        cancel_unresolved_trials(run_dir, "interrupted by user")
        update_run_state(
            run_dir,
            status="cancelled",
            phase="stopped",
            stop_reason="interrupted by user",
            stop_phase="executing",
        )
        shutil.rmtree(state_root(Path(run["project"])) / "tmp" / run_dir.name, ignore_errors=True)
        raise
    except Exception as exc:
        terminate_active_processes()
        cancel_unresolved_trials(run_dir, f"execution failed: {exc}")
        update_run_state(
            run_dir,
            status="failed",
            phase="stopped",
            stop_reason=str(exc),
            stop_phase="executing",
        )
        shutil.rmtree(state_root(Path(run["project"])) / "tmp" / run_dir.name, ignore_errors=True)
        raise
    return finalize_eval(run_dir)


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
        "lifecycle": (
            read_json(run_state_path(run_dir))
            if run_state_path(run_dir).is_file()
            else None
        ),
    }
