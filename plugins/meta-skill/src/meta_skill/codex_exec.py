"""Thin, ephemeral Codex CLI adapters for eval tasks and model judging."""

from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import time
from pathlib import Path

from .errors import CliError


SANDBOX = "workspace-write"
GRADE_LABELS = {"pass", "partial", "fail", "unknown"}
CHECK_LABELS = {"pass", "fail", "unknown"}


def codex_binary():
    return shutil.which("codex")


def codex_version(binary=None):
    binary = binary or codex_binary()
    if not binary:
        return None
    try:
        proc = subprocess.run([binary, "--version"], capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return (proc.stdout or proc.stderr).strip() if proc.returncode == 0 else None


def codex_readiness():
    binary = codex_binary()
    if not binary:
        return False, "codex not found on PATH", {}
    try:
        proc = subprocess.run([binary, "login", "status"], capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired) as exc:
        return False, str(exc), {"codex_binary": binary}
    detail = {
        "codex_binary": binary,
        "runtime_version": codex_version(binary),
        "auth": (proc.stdout or proc.stderr or "").strip(),
    }
    return proc.returncode == 0, detail["auth"] or "Codex login status unavailable", detail


def executor_provenance(kind, model, reasoning_effort, *, observed_model=None, provenance="requested"):
    return {
        "kind": kind,
        "requested_model": model,
        "requested_reasoning": reasoning_effort,
        "observed_model": observed_model,
        "provenance": provenance,
        "runtime_version": codex_version() if kind == "codex_exec" else None,
    }


def _command(binary, cwd, model, reasoning_effort, output_path, *, schema_path=None, sandbox=SANDBOX):
    command = [
        binary,
        "exec",
        "--ephemeral",
        "--json",
        "--cd",
        str(cwd),
        "--sandbox",
        sandbox,
        "--output-last-message",
        str(output_path),
    ]
    if model:
        command.extend(["--model", model])
    if reasoning_effort:
        command.extend(["-c", f'model_reasoning_effort="{reasoning_effort}"'])
    if schema_path:
        command.extend(["--output-schema", str(schema_path)])
    command.append("-")
    return command


def _usage_from_events(events):
    for event in reversed(events):
        usage = event.get("usage") or (event.get("turn") or {}).get("usage")
        if not isinstance(usage, dict):
            continue
        return {
            "input_tokens": int(usage.get("input_tokens") or usage.get("inputTokens") or 0),
            "cached_input_tokens": int(usage.get("cached_input_tokens") or usage.get("cachedInputTokens") or 0),
            "output_tokens": int(usage.get("output_tokens") or usage.get("outputTokens") or 0),
            "total_tokens": int(usage.get("total_tokens") or usage.get("totalTokens") or 0),
        }
    return None


def _observed_model(events):
    for event in reversed(events):
        model = event.get("model") or (event.get("turn") or {}).get("model")
        if isinstance(model, str) and model:
            return model
    return None


def _run(
    prompt, cwd, output_path, event_path, model, reasoning_effort, timeout_seconds,
    *, schema_path=None, sandbox=SANDBOX,
):
    binary = codex_binary()
    if not binary:
        raise CliError("codex not found on PATH", 2)
    command = _command(
        binary, cwd, model, reasoning_effort, output_path,
        schema_path=schema_path, sandbox=sandbox,
    )
    event_path.parent.mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    try:
        proc = subprocess.run(
            command,
            input=prompt,
            capture_output=True,
            text=True,
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as exc:
        raw = exc.stdout or ""
        if isinstance(raw, bytes):
            raw = raw.decode(errors="replace")
        event_path.write_text(raw)
        return {
            "status": "timed_out",
            "duration_ms": int((time.monotonic() - started) * 1000),
            "error": f"trial exceeded {timeout_seconds}s deadline",
            "events": len(raw.splitlines()),
        }
    event_path.write_text(proc.stdout or "")
    events = []
    for line in (proc.stdout or "").splitlines():
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(row, dict):
            events.append(row)
    detail = {
        "status": "completed" if proc.returncode == 0 else "failed",
        "duration_ms": int((time.monotonic() - started) * 1000),
        "error": None if proc.returncode == 0 else (proc.stderr or "codex exec failed").strip(),
        "events": len(events),
        "usage": _usage_from_events(events),
        "observed_model": _observed_model(events),
        "runtime_version": codex_version(binary),
    }
    return detail


def run_task(packet, *, model, reasoning_effort, timeout_seconds):
    workspace = Path(packet["workspace_path"]).resolve()
    task_path = Path(packet["task_path"]).resolve()
    result_path = Path(packet["result_path"]).resolve()
    artifact_root = Path(packet["artifact_root"]).resolve()
    fixture_root = Path(packet["fixture_root"]).resolve()
    for path in (task_path, result_path, artifact_root, fixture_root):
        if not path.is_relative_to(workspace):
            raise CliError("worker packet path escapes its workspace", 2)
    skill_path = packet.get("skill_path")
    if skill_path and not Path(skill_path).resolve().is_relative_to(workspace):
        raise CliError("worker packet skill path escapes its workspace", 2)
    instructions = [
        task_path.read_text(),
        "",
        "Work only inside the provided workspace.",
        f"Place every produced file under {artifact_root}.",
        "In your final response, describe the completed work and link to produced files using paths relative to the workspace.",
    ]
    if skill_path:
        instructions.extend(["", f"Use the skill instructions at {Path(skill_path) / 'SKILL.md'} for this task."])
    response_path = workspace / "response.md"
    event_path = workspace / "events.jsonl"
    detail = _run(
        "\n".join(instructions),
        workspace,
        response_path,
        event_path,
        model,
        reasoning_effort,
        timeout_seconds,
    )
    response = response_path.read_text() if response_path.is_file() else ""
    artifacts = [
        path.relative_to(artifact_root).as_posix()
        for path in sorted(artifact_root.rglob("*"))
        if path.is_file()
    ]
    executor = executor_provenance(
        "codex_exec",
        model,
        reasoning_effort,
        observed_model=detail.get("observed_model"),
        provenance="observed" if detail.get("observed_model") else "requested",
    )
    executor["runtime_version"] = detail.get("runtime_version")
    result = {
        "trial_id": packet["trial_id"],
        "attempt_id": packet["attempt_id"],
        "status": detail["status"],
        "response": response,
        "artifacts": artifacts,
        "duration_ms": detail["duration_ms"],
        "error": detail.get("error"),
        "events_path": str(event_path),
        "usage": detail.get("usage"),
        "executor": executor,
    }
    result_path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    return result


def _number_or_none(value):
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return min(1.0, max(0.0, float(value)))
    return None


def _normalize_checks(raw):
    if not isinstance(raw, list):
        return []
    checks = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        label = item.get("label") if item.get("label") in CHECK_LABELS else "unknown"
        check = {
            "name": str(item.get("name") or "criterion"),
            "label": label,
            "level": item.get("level"),
            "evidence": str(item.get("evidence") or ""),
        }
        if item.get("note"):
            check["note"] = str(item["note"])
        checks.append(check)
    return checks


def _normalize_detail(parsed, raw):
    if not isinstance(parsed, dict):
        return {
            "score": None,
            "label": "unknown",
            "rationale": f"model grader returned no usable JSON: {raw[:500]}",
            "checks": [],
            "eval_feedback": [],
            "grader_error": True,
        }
    label = parsed.get("label")
    grader_error = label not in GRADE_LABELS
    feedback = parsed.get("eval_feedback") if isinstance(parsed.get("eval_feedback"), list) else []
    detail = {
        "score": _number_or_none(parsed.get("score")),
        "label": label if not grader_error else "unknown",
        "rationale": str(parsed.get("rationale") or ""),
        "checks": _normalize_checks(parsed.get("checks")),
        "eval_feedback": [str(item) for item in feedback if str(item).strip()],
    }
    if grader_error:
        detail["grader_error"] = True
    return detail


GRADE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["label", "score", "rationale", "checks", "eval_feedback"],
    "properties": {
        "label": {"type": "string", "enum": sorted(GRADE_LABELS)},
        "score": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "rationale": {"type": "string"},
        "checks": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["name", "label", "level", "evidence", "note"],
                "properties": {
                    "name": {"type": "string"},
                    "label": {"type": "string", "enum": sorted(CHECK_LABELS)},
                    "level": {"type": ["integer", "null"]},
                    "evidence": {"type": "string"},
                    "note": {"type": ["string", "null"]},
                },
            },
        },
        "eval_feedback": {"type": "array", "items": {"type": "string"}},
    },
}


def judge_output(
    *, judge_guidance, task_text, output_text, cwd, event_path, expectations=None,
    expected_text=None, events_text=None, artifact_paths=None, model=None, reasoning_effort=None,
):
    expectations = expectations or []
    cwd = Path(cwd).resolve()
    artifacts = []
    for raw_path in artifact_paths or []:
        path = Path(raw_path)
        path = path.resolve() if path.is_absolute() else (cwd / path).resolve()
        if not path.is_file() or not path.is_relative_to(cwd):
            raise CliError(f"judge artifact must be a file inside the run: {raw_path}", 2)
        artifacts.append(path.relative_to(cwd).as_posix())
    artifact_block = ""
    if artifacts:
        artifact_block = (
            "\n\nPRODUCED ARTIFACT PATHS:\n"
            + "\n".join(f"- {path}" for path in artifacts)
            + "\nInspect these files directly before grading. Treat the files, not their filenames, as outcome evidence."
        )
    prompt = (
        "Grade one agent task outcome. Return only the requested JSON. The burden of proof is on a pass. "
        "Use transcript evidence only for process criteria or missing outcome evidence.\n\n"
        f"JUDGE GUIDANCE:\n{judge_guidance}\n\nTASK SHOWN TO AGENT:\n{task_text}\n\n"
        f"AGENT OUTCOME:\n{output_text}\n\nEXPECTATIONS:\n"
        + "\n".join(f"- {item}" for item in expectations)
        + (f"\n\nHIDDEN EXPECTED OR REFERENCE OUTPUT:\n{expected_text}" if expected_text else "")
        + (f"\n\nTRIAL TRANSCRIPT / EVENTS:\n{events_text}" if events_text else "")
        + artifact_block
    )
    event_path = Path(event_path)
    with tempfile.TemporaryDirectory(prefix="metaskill-judge-") as tmp:
        schema_path = Path(tmp) / "schema.json"
        output_path = Path(tmp) / "output.json"
        schema_path.write_text(json.dumps(GRADE_SCHEMA))
        detail = _run(
            prompt, cwd, output_path, event_path, model, reasoning_effort, 600,
            schema_path=schema_path, sandbox="read-only",
        )
        raw = output_path.read_text() if output_path.is_file() else ""
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = None
    normalized = _normalize_detail(parsed, raw)
    if detail["status"] != "completed":
        normalized.update({"label": "unknown", "score": None, "grader_error": True})
        normalized["rationale"] = detail.get("error") or normalized["rationale"]
    return {
        **normalized,
        "thread_id": None,
        "turn_id": None,
        "thread_persistence": "ephemeral",
        "usage": detail.get("usage"),
        "events": detail.get("events", 0),
        "sdk_version": None,
        "runtime_version": detail.get("runtime_version"),
        "sandbox": SANDBOX,
        "runtime_approval_policy": "never",
        "raw_response": raw,
        "executor": executor_provenance(
            "codex_exec",
            model,
            reasoning_effort,
            observed_model=detail.get("observed_model"),
            provenance="observed" if detail.get("observed_model") else "requested",
        ),
    }
