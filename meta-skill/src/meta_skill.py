#!/usr/bin/env python3
"""Meta Skill CLI.

One agent-facing command surface for skill validation, packaging, eval
materialization, App Server-backed trial runs, progress, and grading.
"""
from __future__ import annotations

import argparse
import dataclasses
import enum
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import lint_authoring
import validate_skill

PASS = "Pass"
FAIL = "Fail"
WARN = "Warning"
DEFAULT_EXCLUDES = {".DS_Store", ".git", ".meta-skill", "__pycache__", "dist"}
DEFAULT_EVALS = {
    "schema_version": 1,
    "target": {"type": "skill", "ref": "SKILL.md"},
    "defaults": {
        "runner": "codex_app_server",
        "repetitions": 1,
        "grader": ["validate"],
    },
    "candidates": [
        {
            "candidate": "current",
            "display": "Current",
            "source": {"kind": "current_worktree", "ref": "."},
        }
    ],
    "cases": [],
}


class CliError(Exception):
    def __init__(self, message, code=1, detail=None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.detail = detail


def utc_now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_id():
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    return f"run-{stamp}-{uuid.uuid4().hex[:8]}"


def slug(value):
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", str(value).lower())).strip("-")


def require_id(kind, value):
    if not isinstance(value, str) or value != slug(value) or not re.fullmatch(r"[a-z0-9][a-z0-9-]*", value):
        raise CliError(f"{kind} must be a lowercase slug: {value!r}", 2)
    return value


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def append_jsonl(path, row):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(row, sort_keys=True) + "\n")


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


def read_json(path):
    try:
        return json.loads(path.read_text())
    except FileNotFoundError:
        raise CliError(f"file not found: {path}", 2)
    except json.JSONDecodeError as exc:
        raise CliError(f"invalid JSON in {path}: {exc}", 2)


def read_jsonl(path):
    if not path.exists():
        return []
    rows = []
    for line_no, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError as exc:
            raise CliError(f"invalid JSONL in {path}:{line_no}: {exc}", 2)
    return rows


def emit(data, as_json):
    if as_json:
        print(json.dumps(data, indent=2, sort_keys=True))
    else:
        if isinstance(data, str):
            print(data)
        else:
            print(json.dumps(data, indent=2, sort_keys=True))


def fail(message, as_json=False, code=1, detail=None):
    if as_json:
        print(json.dumps({"ok": False, "error": message, "detail": detail}, indent=2, sort_keys=True))
    else:
        print(f"error: {message}", file=sys.stderr)
    return code


def suite_path(raw):
    path = Path(raw or ".meta-skill/evals.json").expanduser()
    if path.is_dir():
        path = path / ".meta-skill" / "evals.json"
    return path.resolve()


def workbench_from_suite(path):
    return path.parent


def project_from_suite(path):
    if path.parent.name == ".meta-skill":
        return path.parent.parent
    return path.parent


def case_dir(workbench, case_id):
    return workbench / "cases" / require_id("case id", case_id)


def parse_frontmatter(skill_md):
    text = skill_md.read_text()
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    raw = parts[1]
    try:
        import yaml

        parsed = yaml.safe_load(raw)
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        out = {}
        for line in raw.splitlines():
            if ":" not in line or line[:1].isspace():
                continue
            key, value = line.split(":", 1)
            out[key.strip()] = value.strip().strip("\"'")
        return out


def resolve_skill_md(target):
    path = Path(target).expanduser().resolve()
    return path / "SKILL.md" if path.is_dir() else path


def resolve_target_payload(project, manifest, candidate_cwd):
    target = manifest.get("target") or {}
    ref = target.get("ref") or "SKILL.md"
    path = (candidate_cwd / ref).resolve()
    if path.is_file():
        return path.parent
    if path.is_dir():
        return path
    fallback = (project / ref).resolve()
    if fallback.is_file():
        return fallback.parent
    if fallback.is_dir():
        return fallback
    raise CliError(f"target payload not found for ref {ref!r}", 2)


def payload_digest(path):
    root = Path(path).resolve()
    files = []
    if root.is_file():
        files = [root]
        base = root.parent
    else:
        base = root
        for file_path in root.rglob("*"):
            if not file_path.is_file():
                continue
            parts = set(file_path.relative_to(root).parts)
            if parts & DEFAULT_EXCLUDES:
                continue
            files.append(file_path)
    h = hashlib.sha256()
    for file_path in sorted(files):
        rel = file_path.relative_to(base).as_posix()
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(file_path.read_bytes())
        h.update(b"\0")
    return h.hexdigest()


def git(project, args, check=False):
    proc = subprocess.run(["git", *args], cwd=project, capture_output=True, text=True)
    if check and proc.returncode:
        raise CliError((proc.stderr or proc.stdout or "git command failed").strip(), 2)
    return proc


def git_ref(project, ref="HEAD"):
    proc = git(project, ["rev-parse", ref])
    return proc.stdout.strip() if proc.returncode == 0 else None


def current_branch(project):
    proc = git(project, ["branch", "--show-current"])
    return proc.stdout.strip() if proc.returncode == 0 else None


def resolve_candidate(project, workbench, run_id_value, manifest, candidate):
    source = candidate.get("source") or {}
    kind = source.get("kind", "current_worktree")
    ref = source.get("ref", ".")
    candidate_id = candidate.get("candidate")
    if kind == "current_worktree" or ref == ".":
        cwd = project
        commit = git_ref(project, "HEAD")
        branch = current_branch(project)
        worktree = None
    else:
        commit = git_ref(project, ref)
        if not commit:
            raise CliError(f"candidate {candidate_id} ref not found: {ref}", 2)
        worktree = workbench / "worktrees" / run_id_value / candidate_id
        worktree.parent.mkdir(parents=True, exist_ok=True)
        if not worktree.exists():
            git(project, ["worktree", "add", "--detach", str(worktree), commit], check=True)
        cwd = worktree
        branch = ref if kind == "branch" else None
    payload = resolve_target_payload(project, manifest, cwd)
    return {
        "candidate": candidate_id,
        "display": candidate.get("display") or candidate_id,
        "source_kind": kind,
        "source_ref": ref,
        "branch": branch,
        "commit": commit,
        "worktree": str(worktree) if worktree else None,
        "cwd": str(cwd),
        "payload_path": str(payload),
        "payload_digest": payload_digest(payload),
    }


def normalize_usage(usage):
    return to_jsonable(usage) if usage is not None else None


def to_jsonable(value):
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, enum.Enum):
        return value.value
    if hasattr(value, "model_dump"):
        return value.model_dump(by_alias=True, exclude_none=True, mode="json")
    if dataclasses.is_dataclass(value):
        return {k: to_jsonable(v) for k, v in dataclasses.asdict(value).items()}
    if isinstance(value, dict):
        return {str(k): to_jsonable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [to_jsonable(v) for v in value]
    return str(value)


def final_response_from_result(result):
    value = getattr(result, "final_response", None)
    return value if isinstance(value, str) else ""


def command_doctor(args):
    checks = []
    optional_capabilities = []

    def add(name, ok, message, detail=None):
        checks.append({"name": name, "ok": bool(ok), "message": message, "detail": detail})

    def add_optional(name, ok, message, detail=None):
        optional_capabilities.append({"name": name, "ok": bool(ok), "message": message, "detail": detail})

    add(
        "python_version",
        sys.version_info >= (3, 10),
        f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
    )
    add("cli_source", Path(__file__).exists(), str(Path(__file__).resolve()))
    validator_paths = [Path(__file__).with_name(name) for name in ("validate_skill.py", "lint_authoring.py")]
    add("validators_canonical", all(path.exists() for path in validator_paths), "root src validators")
    add(
        "legacy_worker_scripts_absent",
        not (Path(__file__).parents[1] / "skills" / "skill-doctor" / "scripts").exists()
        and not (Path(__file__).parents[1] / "skills" / "skill-writer" / "scripts").exists(),
        "worker-local script surfaces are removed",
    )
    try:
        import openai_codex

        add("openai_codex_sdk", True, getattr(openai_codex, "__version__", "unknown"))
    except Exception as exc:
        add("openai_codex_sdk", False, str(exc))
    try:
        from openai_codex import ApprovalMode, Codex, CodexConfig, Sandbox, SkillInput, TextInput
        from openai_codex.generated.v2_all import ItemCompletedNotification, TurnCompletedNotification

        app_server_symbols = [
            ApprovalMode,
            Codex,
            CodexConfig,
            ItemCompletedNotification,
            Sandbox,
            SkillInput,
            TextInput,
            TurnCompletedNotification,
        ]
        add("codex_app_server_sdk", all(app_server_symbols), "required App Server SDK symbols available")
    except Exception as exc:
        add("codex_app_server_sdk", False, "required App Server SDK symbols unavailable", str(exc))
    codex_path = shutil.which("codex")
    if codex_path:
        version = subprocess.run(["codex", "--version"], capture_output=True, text=True)
        exec_help = subprocess.run(["codex", "exec", "--help"], capture_output=True, text=True)
        add_optional(
            "codex_exec",
            version.returncode == 0 and exec_help.returncode == 0,
            codex_path,
            {"version": (version.stdout or version.stderr).strip(), "exec_help": exec_help.returncode == 0},
        )
    else:
        add_optional("codex_exec", False, "codex not on PATH")
    ok = all(item["ok"] for item in checks)
    result = {"ok": ok, "checks": checks, "optional_capabilities": optional_capabilities}
    emit(result, args.json)
    return 0 if ok else 1


def command_workbench_init(args):
    target = Path(args.target or ".").expanduser().resolve()
    workbench = target / ".meta-skill"
    paths = [workbench, workbench / "cases", workbench / "runs", workbench / "tests"]
    evals_path = workbench / "evals.json"
    changes = []
    for path in paths:
        if not path.exists():
            changes.append({"action": "mkdir", "path": str(path)})
            if not args.dry_run:
                path.mkdir(parents=True, exist_ok=True)
    manifest = dict(DEFAULT_EVALS)
    if not (target / "SKILL.md").exists():
        manifest["target"] = {"type": "skill", "ref": "skill/SKILL.md"}
    if not evals_path.exists():
        changes.append({"action": "write", "path": str(evals_path)})
        if not args.dry_run:
            write_json(evals_path, manifest)
    result = {"ok": True, "target": str(target), "workbench": str(workbench), "changes": changes}
    emit(result, args.json)
    return 0


def load_manifest(path):
    data = read_json(path)
    if not isinstance(data, dict):
        raise CliError("eval suite must be a JSON object", 2)
    if data.get("schema_version") != 1:
        raise CliError("only evals.json schema_version 1 is supported", 2)
    if not isinstance(data.get("cases", []), list):
        raise CliError("evals.json cases must be a list", 2)
    if not isinstance(data.get("candidates", []), list) or not data.get("candidates"):
        raise CliError("evals.json candidates must be a non-empty list", 2)
    seen_case_ids = set()
    for case in data.get("cases", []):
        if not isinstance(case, dict):
            raise CliError("evals.json cases must be objects", 2)
        case_id = require_id("case id", case.get("id"))
        if case_id in seen_case_ids:
            raise CliError(f"duplicate case id: {case_id}", 2)
        seen_case_ids.add(case_id)
    seen_candidate_ids = set()
    for candidate in data.get("candidates", []):
        if not isinstance(candidate, dict):
            raise CliError("evals.json candidates must be objects", 2)
        candidate_id = require_id("candidate", candidate.get("candidate"))
        if candidate_id in seen_candidate_ids:
            raise CliError(f"duplicate candidate: {candidate_id}", 2)
        seen_candidate_ids.add(candidate_id)
    return data


def case_task_info(case):
    task = case.get("task") or {}
    if isinstance(task, str):
        return {"path": task, "seed": ""}
    return {"path": task.get("path") or "task.md", "seed": task.get("seed") or ""}


def command_eval_materialize(args):
    suite = suite_path(args.suite)
    manifest = load_manifest(suite)
    workbench = workbench_from_suite(suite)
    changes = []
    for case in manifest.get("cases", []):
        case_id = case.get("id")
        if not case_id:
            raise CliError("case missing id", 2)
        root = case_dir(workbench, case_id)
        if not root.exists():
            changes.append({"action": "mkdir", "path": str(root)})
            root.mkdir(parents=True, exist_ok=True)
        task = case_task_info(case)
        task_path = root / task["path"]
        if args.force or not task_path.exists():
            text = task["seed"] or "TODO: author the visible task for this case.\n"
            if not text.endswith("\n"):
                text += "\n"
            changes.append({"action": "write" if not task_path.exists() else "overwrite", "path": str(task_path)})
            task_path.parent.mkdir(parents=True, exist_ok=True)
            task_path.write_text(text)
        else:
            changes.append({"action": "skip", "path": str(task_path)})
        for fixture in case.get("fixtures", []):
            (root / fixture).parent.mkdir(parents=True, exist_ok=True)
    emit({"ok": True, "suite": str(suite), "changes": changes}, args.json)
    return 0


def select_cases(manifest, split):
    cases = manifest.get("cases", [])
    if split:
        cases = [case for case in cases if case.get("split") == split]
    return cases


def select_candidates(manifest, raw):
    candidates = manifest.get("candidates", [])
    if raw:
        wanted = {item.strip() for item in raw.split(",") if item.strip()}
        candidates = [candidate for candidate in candidates if candidate.get("candidate") in wanted]
    if not candidates:
        raise CliError("no candidates selected", 2)
    for candidate in candidates:
        if not candidate.get("candidate"):
            raise CliError("candidate missing candidate field", 2)
    return candidates


def trial_prompt(task_text):
    return task_text.strip() + "\n"


def safe_case_file(case_root, rel_path, label):
    rel = Path(rel_path)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"{label} path must stay inside the case folder: {rel_path}", 2)
    return case_root / rel


def copy_payload(src, dest):
    src = Path(src)
    if dest.exists():
        shutil.rmtree(dest)

    def ignore(_dir, names):
        return [name for name in names if name in DEFAULT_EXCLUDES]

    if src.is_file():
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest / src.name)
    else:
        shutil.copytree(src, dest, ignore=ignore)


def stage_solver_workspace(workbench, run_dir, trial_id, case, task_text, candidate):
    case_root = case_dir(workbench, case["id"])
    workspace = workbench / "solver-workspaces" / run_dir.name / trial_id
    if workspace.exists():
        shutil.rmtree(workspace)
    workspace.mkdir(parents=True)

    task_path = workspace / "task.md"
    task_path.write_text(task_text if task_text.endswith("\n") else task_text + "\n")

    fixtures_root = workspace / "fixtures"
    for fixture in case.get("fixtures", []):
        source = safe_case_file(case_root, fixture, "fixture")
        if not source.exists():
            raise CliError(f"fixture missing: {source}", 2)
        target = fixtures_root / Path(fixture)
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)

    staged_payload = workspace / "skill"
    copy_payload(candidate["payload_path"], staged_payload)
    staged_candidate = dict(candidate)
    staged_candidate["cwd"] = str(workspace)
    staged_candidate["payload_path"] = str(staged_payload)
    staged_candidate["solver_workspace"] = str(workspace)
    staged_candidate["staged_payload_digest"] = payload_digest(staged_payload)
    return staged_candidate


def skill_input_name(payload):
    skill_md = Path(payload) / "SKILL.md"
    if skill_md.exists():
        frontmatter = parse_frontmatter(skill_md)
        name = frontmatter.get("name")
        if isinstance(name, str) and name.strip():
            return name.strip()
    return Path(payload).name


def app_server_run(trial, prompt, candidate_info, event_path, output_path, model=None):
    try:
        from openai_codex import ApprovalMode, Codex, CodexConfig, Sandbox, SkillInput, TextInput
        from openai_codex.generated.v2_all import (
            AgentMessageThreadItem,
            ItemCompletedNotification,
            MessagePhase,
            ThreadTokenUsageUpdatedNotification,
            TurnCompletedNotification,
        )
    except Exception as exc:
        raise CliError(f"openai-codex SDK unavailable: {exc}", 2)

    config = CodexConfig(cwd=candidate_info["cwd"], client_name="meta_skill_cli", client_title="Meta Skill CLI")
    with Codex(config=config) as codex:
        thread = codex.thread_start(
            approval_mode=ApprovalMode.deny_all,
            cwd=candidate_info["cwd"],
            sandbox=Sandbox.workspace_write,
            ephemeral=True,
            model=model,
        )
        inputs = [
            SkillInput(name=skill_input_name(candidate_info["payload_path"]), path=candidate_info["payload_path"]),
            TextInput(text=prompt),
        ]
        turn = thread.turn(inputs, cwd=candidate_info["cwd"], sandbox=Sandbox.workspace_write, model=model)
        completed = None
        usage = None
        final_response = None
        unknown_phase_response = None
        event_count = 0
        event_path.parent.mkdir(parents=True, exist_ok=True)
        with event_path.open("w", encoding="utf-8") as fh:
            for event in turn.stream():
                event_count += 1
                fh.write(json.dumps({"method": event.method, "payload": to_jsonable(event.payload)}, sort_keys=True) + "\n")
                payload = event.payload
                if isinstance(payload, ItemCompletedNotification) and payload.turn_id == turn.id:
                    item = payload.item.root if hasattr(payload.item, "root") else payload.item
                    if isinstance(item, AgentMessageThreadItem) and isinstance(item.text, str):
                        if item.phase == MessagePhase.final_answer:
                            final_response = item.text
                        elif item.phase is None and unknown_phase_response is None:
                            unknown_phase_response = item.text
                elif isinstance(payload, ThreadTokenUsageUpdatedNotification) and payload.turn_id == turn.id:
                    usage = payload.token_usage
                elif isinstance(payload, TurnCompletedNotification) and payload.turn.id == turn.id:
                    completed = payload.turn
        if completed is None:
            raise RuntimeError("turn completed event not received")
        status = getattr(completed.status, "value", completed.status)
        if status == "failed":
            error = getattr(completed, "error", None)
            message = getattr(error, "message", None)
            raise RuntimeError(message or "turn failed")
        final = final_response if final_response is not None else unknown_phase_response or ""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(final)
        return {
            "status": str(status),
            "thread_id": thread.id,
            "turn_id": turn.id,
            "duration_ms": completed.duration_ms,
            "usage": normalize_usage(usage),
            "events": event_count,
            "final_response_chars": len(final),
        }


def exec_run(trial, prompt, candidate_info, event_path, output_path, model=None):
    cmd = [
        "codex",
        "exec",
        "--json",
        "--cd",
        candidate_info["cwd"],
        "--sandbox",
        "workspace-write",
        "--skip-git-repo-check",
        "--output-last-message",
        str(output_path),
    ]
    if model:
        cmd.extend(["--model", model])
    cmd.append("-")
    event_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(cmd, input=prompt, capture_output=True, text=True)
    event_path.write_text(proc.stdout)
    if proc.returncode and not output_path.exists():
        output_path.write_text("")
    return {
        "status": "completed" if proc.returncode == 0 else "failed",
        "returncode": proc.returncode,
        "stderr": proc.stderr[-2000:] if proc.returncode and proc.stderr else "",
        "final_response_chars": len(output_path.read_text()) if output_path.exists() else 0,
    }


def command_eval_run(args):
    suite = suite_path(args.suite)
    manifest = load_manifest(suite)
    workbench = workbench_from_suite(suite)
    project = project_from_suite(suite)
    cases = select_cases(manifest, args.split)
    if not cases:
        raise CliError("no cases selected", 2)
    candidates = select_candidates(manifest, args.candidates)
    defaults = manifest.get("defaults") or {}
    runner = args.runner
    if runner == "auto":
        runner = defaults.get("runner") or "codex_app_server"
    if runner not in {"codex_app_server", "codex_exec"}:
        raise CliError(f"unknown runner: {runner}", 2)
    task_texts = {}
    for case in cases:
        task_path = safe_case_file(case_dir(workbench, case["id"]), case_task_info(case)["path"], "task")
        if not task_path.exists():
            raise CliError(f"task.md missing; run eval materialize first: {task_path}", 2)
        task_texts[case["id"]] = task_path.read_text()
        for fixture in case.get("fixtures", []):
            fixture_path = safe_case_file(case_dir(workbench, case["id"]), fixture, "fixture")
            if not fixture_path.exists():
                raise CliError(f"fixture missing: {fixture_path}", 2)
    rid = run_id()
    run_dir = workbench / "runs" / rid
    run_dir.mkdir(parents=True, exist_ok=False)
    candidate_infos = [
        resolve_candidate(project, workbench, rid, manifest, candidate) for candidate in candidates
    ]
    plan = []
    for case in cases:
        reps = args.repetitions or case.get("repetitions") or defaults.get("repetitions") or 1
        for candidate in candidate_infos:
            for index in range(1, int(reps) + 1):
                trial_id = f"{case['id']}.{candidate['candidate']}.t{index}"
                plan.append({"case": case, "candidate": candidate, "index": index, "trial_id": trial_id})
    write_json(
        run_dir / "run.json",
        {
            "run_id": rid,
            "suite": str(suite),
            "project": str(project),
            "runner": runner,
            "created_at": utc_now(),
            "candidates": candidate_infos,
            "trials": [
                {
                    "trial_id": row["trial_id"],
                    "case_id": row["case"]["id"],
                    "candidate": row["candidate"]["candidate"],
                    "trial_index": row["index"],
                }
                for row in plan
            ],
        },
    )
    for row in plan:
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": row["trial_id"], "status": "queued"})
    for row in plan:
        trial_id = row["trial_id"]
        case = row["case"]
        candidate = row["candidate"]
        output_path = run_dir / "candidates" / candidate["candidate"] / trial_id / "final.md"
        event_path = run_dir / "events" / f"{trial_id}.jsonl"
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": trial_id, "status": "running"})
        started = time.time()
        try:
            staged_candidate = stage_solver_workspace(
                workbench,
                run_dir,
                trial_id,
                case,
                task_texts[case["id"]],
                candidate,
            )
            if runner == "codex_app_server":
                detail = app_server_run(row, trial_prompt(task_texts[case["id"]]), staged_candidate, event_path, output_path, args.model)
            elif runner == "codex_exec":
                detail = exec_run(row, trial_prompt(task_texts[case["id"]]), staged_candidate, event_path, output_path, args.model)
            detail["solver_workspace"] = staged_candidate["solver_workspace"]
            detail["staged_payload_digest"] = staged_candidate["staged_payload_digest"]
            status = "passed" if detail.get("status") in {"completed", "succeeded"} else "failed"
            error = None if status == "passed" else detail.get("status", "runner failed")
        except Exception as exc:
            status = "failed"
            error = str(exc)
            detail = {}
            output_path.parent.mkdir(parents=True, exist_ok=True)
            if not output_path.exists():
                output_path.write_text("")
        completed = time.time()
        result = {
            "run_id": rid,
            "trial_id": trial_id,
            "case_id": case["id"],
            "candidate": candidate["candidate"],
            "trial_index": row["index"],
            "runner": runner,
            "status": status,
            "error": error,
            "started_at": datetime.fromtimestamp(started, timezone.utc).isoformat(),
            "completed_at": datetime.fromtimestamp(completed, timezone.utc).isoformat(),
            "duration_ms": int((completed - started) * 1000),
            "output_path": str(output_path),
            "event_path": str(event_path),
            "detail": detail,
        }
        append_jsonl(run_dir / "results.jsonl", result)
        append_jsonl(run_dir / "progress.jsonl", {"time": utc_now(), "trial_id": trial_id, "status": status})
    results = read_jsonl(run_dir / "results.jsonl")
    failures = [row for row in results if row.get("status") != "passed"]
    emit(
        {
            "ok": not failures,
            "run_id": rid,
            "run_dir": str(run_dir),
            "runner": runner,
            "trials": len(plan),
            "passed": len(results) - len(failures),
            "failed": len(failures),
        },
        args.json,
    )
    return 0 if not failures else 1


def command_eval_progress(args):
    run_dir = Path(args.run).expanduser().resolve()
    if run_dir.name != "runs" and (run_dir / "run.json").exists():
        pass
    elif not (run_dir / "run.json").exists():
        candidate = Path(".meta-skill/runs") / args.run
        if candidate.exists():
            run_dir = candidate.resolve()
    def snapshot():
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
        }
    if args.watch:
        seen = None
        while True:
            snap = snapshot()
            if snap != seen:
                emit(snap, args.json)
                seen = snap
            terminal = snap["progress"].get("passed", 0) + snap["progress"].get("failed", 0)
            if terminal >= snap["trials"]:
                break
            time.sleep(2)
        return 0
    emit(snapshot(), args.json)
    return 0


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


def command_eval_grade(args):
    run_dir = Path(args.run).expanduser().resolve()
    if not (run_dir / "run.json").exists():
        candidate = (Path(".meta-skill/runs") / args.run).resolve()
        if candidate.exists():
            run_dir = candidate
    run = read_json(run_dir / "run.json")
    suite = Path(run["suite"]).resolve()
    workbench = workbench_from_suite(suite)
    rows = []
    for result in read_jsonl(run_dir / "results.jsonl"):
        root = case_dir(workbench, result["case_id"])
        validators = sorted(root.glob("validate.*"))
        expected = next(iter(sorted(root.glob("expected.*"))), None)
        if not validators:
            rows.append({
                "run_id": run["run_id"],
                "case_id": result["case_id"],
                "candidate": result["candidate"],
                "trial_id": result["trial_id"],
                "grader": {"kind": "none", "id": "meta-skill"},
                "metric": "grade_status",
                "score": None,
                "label": "ungraded",
                "rationale": "No validate.* file exists; use rubric.md for judge or human grading.",
                "evidence_refs": [result["output_path"]],
            })
            continue
        for validator in validators:
            proc = subprocess.run(
                validator_command(validator, result["output_path"], expected, result["event_path"]),
                capture_output=True,
                text=True,
                cwd=root,
            )
            if proc.returncode:
                passed, total, checks, label, rationale = 0, 1, [], "fail", (proc.stderr or proc.stdout).strip()
            else:
                try:
                    data = json.loads(proc.stdout)
                    passed = int(data.get("passed", 0))
                    total = int(data.get("total", 0))
                    checks = data.get("checks", [])
                    label = "pass" if total and passed == total else "fail"
                    rationale = data.get("rationale") or f"{passed}/{total} validator checks passed"
                except Exception as exc:
                    passed, total, checks, label, rationale = 0, 1, [], "fail", f"validator emitted invalid JSON: {exc}"
            rows.append({
                "run_id": run["run_id"],
                "case_id": result["case_id"],
                "candidate": result["candidate"],
                "trial_id": result["trial_id"],
                "grader": {"kind": "code", "id": validator.name},
                "metric": "validator",
                "score": passed / total if total else None,
                "label": label,
                "rationale": rationale,
                "checks": checks,
                "evidence_refs": [result["output_path"], result["event_path"]],
            })
    grades_path = run_dir / "grades.jsonl"
    def key(row):
        grader = row.get("grader") or {}
        return (
            row.get("trial_id"),
            row.get("metric"),
            grader.get("kind"),
            grader.get("id"),
        )
    new_keys = {key(row) for row in rows}
    preserved = [row for row in read_jsonl(grades_path) if key(row) not in new_keys]
    write_jsonl(grades_path, [*preserved, *rows])
    emit({"ok": True, "run_id": run["run_id"], "grades": len(rows), "grades_path": str(grades_path)}, args.json)
    return 0


def validate_report(skill_dir):
    target = resolve_skill_md(skill_dir)
    if not target.exists():
        raise CliError(f"SKILL.md not found: {target}", 2)
    reports = [
        {"task": "validate_skill", **validate_skill.validate(str(target))},
        {"task": "lint_authoring", **lint_authoring.validate(str(target))},
    ]
    passed = sum(item.get("passed", 0) for item in reports)
    total = sum(item.get("total", 0) for item in reports)
    failures = [
        check
        for report in reports
        for check in report.get("checks", [])
        if check.get("result") == FAIL
    ]
    return {
        "ok": not failures,
        "target": str(target),
        "tasks": reports,
        "passed": passed,
        "total": total,
        "validation_percent": round(100 * passed / total) if total else 0,
    }


def command_validate(args):
    result = validate_report(args.skill_dir)
    emit(result, args.json)
    return 0 if result["ok"] else 1


def command_package(args):
    result = validate_report(args.skill_dir)
    if not result["ok"]:
        emit(result, args.json)
        return 1
    skill_dir = Path(args.skill_dir).expanduser().resolve()
    frontmatter = parse_frontmatter(skill_dir / "SKILL.md")
    name = frontmatter.get("name") or skill_dir.name
    out_dir = Path(args.out_dir).expanduser().resolve() if args.out_dir else skill_dir / ".meta-skill" / "dist"
    out_dir.mkdir(parents=True, exist_ok=True)
    artifact = out_dir / f"{name}.zip"
    with zipfile.ZipFile(artifact, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(skill_dir.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(skill_dir)
            if set(rel.parts) & DEFAULT_EXCLUDES:
                continue
            zf.write(path, rel.as_posix())
    metadata = {
        "slug": name,
        "source": str(skill_dir),
        "artifact": str(artifact),
        "created_at": utc_now(),
        "excluded": sorted(DEFAULT_EXCLUDES),
    }
    write_json(out_dir / f"{name}.package.json", metadata)
    emit({"ok": True, "artifact": str(artifact), "metadata": str(out_dir / f"{name}.package.json")}, args.json)
    return 0


def build_parser():
    parser = argparse.ArgumentParser(prog="meta-skill", description="Meta Skill workbench CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    doctor = sub.add_parser("doctor", help="Check Python, validator, and App Server SDK readiness")
    doctor.add_argument("--json", action="store_true")
    doctor.set_defaults(func=command_doctor)

    workbench = sub.add_parser("workbench", help="Workbench commands")
    workbench_sub = workbench.add_subparsers(dest="workbench_command", required=True)
    init = workbench_sub.add_parser("init", help="Create .meta-skill workbench folders and evals.json")
    init.add_argument("--target", default=".")
    init.add_argument("--dry-run", action="store_true")
    init.add_argument("--json", action="store_true")
    init.set_defaults(func=command_workbench_init)

    eval_parser = sub.add_parser("eval", help="Evaluation commands")
    eval_sub = eval_parser.add_subparsers(dest="eval_command", required=True)
    materialize = eval_sub.add_parser("materialize", help="Materialize cases from evals.json")
    materialize.add_argument("--suite", default=".meta-skill/evals.json")
    materialize.add_argument("--force", action="store_true")
    materialize.add_argument("--json", action="store_true")
    materialize.set_defaults(func=command_eval_materialize)

    run = eval_sub.add_parser("run", help="Run selected eval trials")
    run.add_argument("--suite", default=".meta-skill/evals.json")
    run.add_argument("--runner", choices=["auto", "codex_app_server", "codex_exec"], default="auto")
    run.add_argument("--candidates")
    run.add_argument("--split")
    run.add_argument("--repetitions", type=int)
    run.add_argument("--model")
    run.add_argument("--json", action="store_true")
    run.set_defaults(func=command_eval_run)

    progress = eval_sub.add_parser("progress", help="Read compact run progress")
    progress.add_argument("--run", required=True)
    progress.add_argument("--watch", action="store_true")
    progress.add_argument("--json", action="store_true")
    progress.set_defaults(func=command_eval_progress)

    grade = eval_sub.add_parser("grade", help="Grade completed eval outputs")
    grade.add_argument("--run", required=True)
    grade.add_argument("--json", action="store_true")
    grade.set_defaults(func=command_eval_grade)

    validate = sub.add_parser("validate", help="Validate a skill payload")
    validate.add_argument("skill_dir")
    validate.add_argument("--json", action="store_true")
    validate.set_defaults(func=command_validate)

    package = sub.add_parser("package", help="Package a skill payload")
    package.add_argument("skill_dir")
    package.add_argument("--out-dir")
    package.add_argument("--json", action="store_true")
    package.set_defaults(func=command_package)
    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return args.func(args)
    except CliError as exc:
        return fail(exc.message, getattr(args, "json", False), exc.code, exc.detail)
    except KeyboardInterrupt:
        return fail("interrupted", getattr(args, "json", False), 130)


if __name__ == "__main__":
    raise SystemExit(main())
