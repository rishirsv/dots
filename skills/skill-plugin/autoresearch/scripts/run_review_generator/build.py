"""Build the Autoresearch Run Review static site.

Reads benchmark artifacts for one or more skills, normalizes them into a common
run model, copies the important files into a portable output directory, and
renders the shared shell templates.

The generator code and shell live inside the skill bundle so the review frontend
ships with the skill. Generated output still belongs in the target project or a
caller-chosen output directory, not in the shared skill installation.
"""

from __future__ import annotations

import datetime as _dt
import json
import os
import re
import shutil
from pathlib import Path

from . import adapters as _adapters

SKILL_DIR = Path(__file__).resolve().parents[2]
SHELL_DIR = SKILL_DIR / "assets" / "run-review-shell"
REPO_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_OUT_DIR = REPO_ROOT / "tests" / "plugin-eval" / "site"

MAX_PREVIEW_BYTES = 120_000
MAX_VERIFIER_PREVIEW = 8_000
MAX_AGENT_TEXT = 4_000


# ---------- helpers ----------

def _read_text(path: Path, limit: int = MAX_PREVIEW_BYTES) -> str | None:
    try:
        with path.open("rb") as fh:
            raw = fh.read(limit + 1)
        text = raw.decode("utf-8", errors="replace")
        if len(raw) > limit:
            text = text[:limit] + "\n\n… (truncated for display)"
        return text
    except FileNotFoundError:
        return None
    except OSError:
        return None


def _read_jsonl(path: Path, max_lines: int = 20000):
    if not path.exists():
        return []
    out = []
    with path.open("r", encoding="utf-8", errors="replace") as fh:
        for i, line in enumerate(fh):
            if i >= max_lines:
                break
            line = line.strip()
            if not line:
                continue
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return out


def _safe_filename(s: str) -> str:
    s = re.sub(r"[^A-Za-z0-9._-]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-") or "file"


def _copy_file(src: Path, dest: Path) -> bool:
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dest)
        return True
    except (FileNotFoundError, OSError):
        return False


def _relpath(target: Path, start: Path) -> str:
    return os.path.relpath(target, start).replace(os.sep, "/")


def _kind_for(path: str) -> str:
    p = path.lower()
    if p.endswith(".md"):
        return "markdown"
    if p.endswith(".json"):
        return "json"
    if p.endswith(".jsonl") or p.endswith(".log"):
        return "text"
    if p.endswith(".diff") or p.endswith(".patch"):
        return "diff"
    return "text"


# ---------- event timeline parsing ----------

def _build_timeline(raw_log_path: Path, workspace_path: str | None):
    events = []
    if not raw_log_path.exists():
        return events
    raw = _read_jsonl(raw_log_path)
    workspace_prefix = None
    if workspace_path:
        workspace_prefix = workspace_path.rstrip("/") + "/"

    seen_cmd_done = set()
    for rec in raw:
        t = rec.get("type")
        if t == "turn.completed":
            events.append({"type": "turn", "text": "turn completed"})
            continue
        item = rec.get("item") or {}
        itype = item.get("type")
        iid = item.get("id")
        if itype == "agent_message":
            text = item.get("text") or ""
            if len(text) > MAX_AGENT_TEXT:
                text = text[:MAX_AGENT_TEXT] + "\n\n… (truncated)"
            events.append({"type": "agent", "text": text})
        elif itype == "command_execution":
            if item.get("status") != "completed" and item.get("status") != "failed":
                continue
            key = (iid, item.get("status"))
            if key in seen_cmd_done:
                continue
            seen_cmd_done.add(key)
            events.append({
                "type": "cmd",
                "command": item.get("command") or "",
                "exitCode": item.get("exit_code"),
                "status": item.get("status"),
            })
        elif itype == "file_change":
            paths = []
            for ch in item.get("changes", []):
                p = ch.get("path") or ""
                kind = ch.get("kind") or ""
                if workspace_prefix and p.startswith(workspace_prefix):
                    p = p[len(workspace_prefix):]
                # also strip /private prefix sometimes added by macOS
                p = re.sub(r"^/private", "", p)
                paths.append(("[" + kind + "] " if kind else "") + p)
            events.append({"type": "file", "paths": paths})
        elif itype == "error":
            msg = item.get("message") or ""
            if "Ignoring malformed agent role definition" in msg:
                # Not useful noise for reviewers.
                continue
            events.append({"type": "error", "text": msg})
    return events


# ---------- artifact pipeline ----------

def _resolve_run_log(declared: str | None, repo_root: Path, skill_name: str, run_id: str, scen_folder_guess: str | None, filename: str) -> Path | None:
    """Resolve a raw log path, falling back to the tests/plugin-eval archive."""
    if declared and Path(declared).exists():
        return Path(declared)
    if not declared:
        return None
    # Fallback: tests/plugin-eval/<skill>/runs/<run-id>/<scen-folder>/<filename>
    name = Path(declared).name
    scen_dir = Path(declared).parent.name
    candidate = repo_root / "tests" / "plugin-eval" / skill_name / "runs" / run_id / scen_dir / name
    if candidate.exists():
        return candidate
    return None


def _copy_scenario_sources(scenario, site_dir: Path, run_key: str, *, repo_root: Path, skill_name: str, run_id: str):
    """Copy raw run logs, verifier logs, final message into artifacts dir.

    Returns dict with hrefs relative to the run detail page.
    """
    scen_id = scenario.get("id") or "scenario"
    out_rel = f"artifacts/{run_key}/{scen_id}"
    out_dir = site_dir / out_rel
    out_dir.mkdir(parents=True, exist_ok=True)

    run_page_dir = site_dir / "runs" / run_key

    refs = {}

    # Raw event log (with fallback to tests/plugin-eval archive)
    raw = _resolve_run_log(
        scenario.get("rawEventLogPath"), repo_root, skill_name, run_id, None, "codex.stdout.jsonl",
    )
    if raw:
        dest = out_dir / "codex.stdout.jsonl"
        _copy_file(raw, dest)
        refs["rawLogHref"] = _relpath(dest, run_page_dir)
        refs["rawLogResolved"] = raw

    stderr = _resolve_run_log(scenario.get("stderrLogPath"), repo_root, skill_name, run_id, None, "codex.stderr.log")
    if stderr:
        dest = out_dir / "codex.stderr.log"
        _copy_file(stderr, dest)
        refs["stderrHref"] = _relpath(dest, run_page_dir)

    final_msg = _resolve_run_log(scenario.get("finalMessagePath"), repo_root, skill_name, run_id, None, "final-message.txt")
    if final_msg:
        dest = out_dir / "final-message.txt"
        _copy_file(final_msg, dest)
        refs["finalMessageHref"] = _relpath(dest, run_page_dir)

    # Verifier logs
    verifier_refs = []
    for i, v in enumerate(scenario.get("verifierResults") or []):
        stdout_path = _resolve_run_log(v.get("stdoutPath"), repo_root, skill_name, run_id, None, "")
        stderr_path = _resolve_run_log(v.get("stderrPath"), repo_root, skill_name, run_id, None, "")
        entry = {}
        if stdout_path:
            dest = out_dir / f"verifier-{i+1}.stdout.log"
            _copy_file(stdout_path, dest)
            entry["stdoutHref"] = _relpath(dest, run_page_dir)
            entry["stdoutPreview"] = _read_text(dest, MAX_VERIFIER_PREVIEW)
        if stderr_path:
            dest = out_dir / f"verifier-{i+1}.stderr.log"
            _copy_file(stderr_path, dest)
            entry["stderrHref"] = _relpath(dest, run_page_dir)
            entry["stderrPreview"] = _read_text(dest, MAX_VERIFIER_PREVIEW)
        verifier_refs.append(entry)

    refs["verifiers"] = verifier_refs
    refs["artifactDir"] = out_dir
    refs["artifactRel"] = out_rel
    return refs


def _finalize_verifiers(scenario, verifier_refs):
    out = []
    src = scenario.get("verifierResults") or []
    for i, v in enumerate(src):
        entry = dict(v)
        if i < len(verifier_refs):
            entry.update(verifier_refs[i])
        out.append(entry)
    return out


# ---------- main build for one skill/run ----------

def _load_skill_run(skill_name: str, repo_root: Path, source_spec: dict | None = None):
    """Load benchmark data for a given skill.

    By default this reads the repo-local ``tests/plugin-eval/<skill>/latest/``
    layout. Callers can override that with explicit ``benchmark_json`` and
    ``usage_log`` paths so the generator remains portable outside this repo.
    """
    source_spec = source_spec or {}
    latest_dir = repo_root / "tests" / "plugin-eval" / skill_name / "latest"
    bench_path = Path(source_spec.get("benchmark_json") or (latest_dir / "benchmark-run.json"))
    if not bench_path.exists():
        raise FileNotFoundError(f"No benchmark-run.json at {bench_path}")
    with bench_path.open("r", encoding="utf-8") as fh:
        data = json.load(fh)
    data["__benchmark_json_path__"] = str(bench_path)
    usage_path = Path(source_spec.get("usage_log") or (latest_dir / "observed-usage.jsonl"))
    data["__usage_log_path__"] = str(usage_path)
    return data


def _run_key(skill_name: str, run_id: str) -> str:
    return f"{skill_name}--{_safe_filename(run_id)}"


def _run_id_from_rundir(run_directory: str | None, created_at: str | None) -> str:
    if run_directory:
        return Path(run_directory).name
    if created_at:
        return created_at.replace(":", "-").replace(".", "-")
    return "run"


def _build_one_run(skill_name: str, data: dict, site_dir: Path):
    adapter = _adapters.get(skill_name)
    run_id = _run_id_from_rundir(data.get("runDirectory"), data.get("createdAt"))
    run_key = _run_key(skill_name, run_id)

    # Copy raw benchmark JSON and usage log into the site as-is so links work.
    top_artifact_dir = site_dir / "artifacts" / run_key
    top_artifact_dir.mkdir(parents=True, exist_ok=True)

    bench_src = Path(data["__benchmark_json_path__"])
    bench_dest = top_artifact_dir / "benchmark-run.json"
    _copy_file(bench_src, bench_dest)
    usage_src = Path(data["__usage_log_path__"])
    usage_dest = top_artifact_dir / "observed-usage.jsonl"
    if usage_src.exists():
        _copy_file(usage_src, usage_dest)

    run_page_dir = site_dir / "runs" / run_key
    run_page_dir.mkdir(parents=True, exist_ok=True)

    scenarios_out = []
    adapter_ctx = adapter.prepare_run(data, site_dir, run_key)

    repo_root = Path(data.get("__repo_root__") or REPO_ROOT)
    for scenario in data.get("scenarios") or []:
        refs = _copy_scenario_sources(
            scenario, site_dir, run_key,
            repo_root=repo_root, skill_name=skill_name, run_id=run_id,
        )
        raw_log_path = refs.get("rawLogResolved") or Path(scenario.get("rawEventLogPath") or "")
        timeline = _build_timeline(
            Path(raw_log_path),
            scenario.get("workspacePath"),
        )

        # Adapter collects artifacts and panels from the preserved workspace.
        artifacts, panels = adapter.collect_scenario_artifacts(
            scenario=scenario,
            site_dir=site_dir,
            run_key=run_key,
            run_data=data,
            adapter_ctx=adapter_ctx,
        )

        verifier_finalized = _finalize_verifiers(scenario, refs.get("verifiers") or [])

        vpass = all(v.get("status") == "passed" for v in verifier_finalized) if verifier_finalized else False
        status = scenario.get("status") or "completed"
        scenario_out = {
            "id": scenario.get("id"),
            "title": scenario.get("title") or scenario.get("id"),
            "purpose": scenario.get("purpose") or "",
            "status": status if vpass else ("failed" if verifier_finalized else status),
            "durationMs": scenario.get("durationMs") or 0,
            "prompt": scenario.get("prompt") or "",
            "successChecklist": scenario.get("successChecklist") or [],
            "finalMessagePreview": scenario.get("finalMessagePreview") or "",
            "usage": scenario.get("usage") or {},
            "telemetry": {
                "eventCount": (scenario.get("telemetry") or {}).get("eventCount"),
            },
            "verifierResults": [
                {
                    "command": v.get("command"),
                    "status": v.get("status"),
                    "exitCode": v.get("exitCode"),
                    "durationMs": v.get("durationMs"),
                    "stdoutHref": v.get("stdoutHref"),
                    "stderrHref": v.get("stderrHref"),
                    "stdoutPreview": v.get("stdoutPreview"),
                    "stderrPreview": v.get("stderrPreview"),
                }
                for v in verifier_finalized
            ],
            "workspaceChanges": scenario.get("workspaceChanges") or [],
            "rawLog": {"href": refs.get("rawLogHref")},
            "stderrLog": {"href": refs.get("stderrHref")},
            "finalMessage": {"href": refs.get("finalMessageHref")},
            "artifacts": artifacts,
            "adapterPanels": panels,
            "eventTimeline": timeline,
        }
        scenarios_out.append(scenario_out)

    # Run-level derived fields from adapter.
    run_derived = adapter.derive_run_fields(
        run_data=data,
        scenarios_out=scenarios_out,
        adapter_ctx=adapter_ctx,
    )

    summary = data.get("summary") or {}
    run_out = {
        "runId": run_id,
        "runKey": run_key,
        "skill": skill_name,
        "title": run_derived.get("title") or (skill_name + " · " + run_id),
        "createdAt": data.get("createdAt"),
        "model": (data.get("config") or {}).get("model"),
        "outcome": _overall_status(scenarios_out),
        "outcomeSummary": run_derived.get("outcomeSummary") or "",
        "outcomeLede": run_derived.get("outcomeLede") or "",
        "scenarioCount": summary.get("scenarioCount") or len(scenarios_out),
        "completedScenarios": summary.get("completedScenarios") or 0,
        "failedScenarios": summary.get("failedScenarios") or 0,
        "avgTotalTokens": summary.get("averageTotalTokens") or 0,
        "avgInputTokens": summary.get("averageInputTokens") or 0,
        "avgOutputTokens": summary.get("averageOutputTokens") or 0,
        "generatedFileCount": summary.get("generatedFileCount") or 0,
        "verifierPassCount": summary.get("verifierPassCount") or 0,
        "verifierFailCount": summary.get("verifierFailCount") or 0,
        "totalDurationMs": sum((s.get("durationMs") or 0) for s in scenarios_out),
        "benchmarkJsonHref": _relpath(bench_dest, run_page_dir),
        "usageLogHref": _relpath(usage_dest, run_page_dir) if usage_src.exists() else None,
        "scenarios": scenarios_out,
        "adapterData": run_derived.get("adapterData") or {},
    }
    return run_out


def _overall_status(scenarios_out) -> str:
    if not scenarios_out:
        return "unknown"
    fail = 0
    for s in scenarios_out:
        if s.get("status") == "failed":
            fail += 1
        if not all(v.get("status") == "passed" for v in s.get("verifierResults") or [{"status": "passed"}]):
            fail += 0  # already counted via status adjustment
    if fail == 0:
        return "completed"
    if fail == len(scenarios_out):
        return "failed"
    return "partial"


# ---------- templates & write ----------

def _render_template(path: Path, mapping: dict) -> str:
    tmpl = path.read_text(encoding="utf-8")
    for k, v in mapping.items():
        tmpl = tmpl.replace("{{" + k + "}}", str(v))
    return tmpl


def _copy_shell_assets(site_dir: Path):
    assets_src = SHELL_DIR / "assets"
    assets_dst = site_dir / "assets"
    assets_dst.mkdir(parents=True, exist_ok=True)
    for f in assets_src.iterdir():
        if f.is_file():
            shutil.copyfile(f, assets_dst / f.name)


def _write_data_file(path: Path, global_name: str, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    js = f"window.{global_name} = {body};\n"
    path.write_text(js, encoding="utf-8")


def build_site(
    skills,
    out_dir: Path | None = None,
    repo_root: Path | None = None,
    source_specs: dict[str, dict] | None = None,
):
    """Entry point used by per-skill scripts and the combined builder."""
    out_dir = Path(out_dir) if out_dir else DEFAULT_OUT_DIR
    repo_root = Path(repo_root) if repo_root else REPO_ROOT
    source_specs = source_specs or {}
    out_dir.mkdir(parents=True, exist_ok=True)

    _copy_shell_assets(out_dir)

    generated_at = _dt.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    runs_index = []
    for skill_name in skills:
        try:
            data = _load_skill_run(skill_name, repo_root, source_specs.get(skill_name))
        except FileNotFoundError as exc:
            print(f"[skip] {skill_name}: {exc}")
            continue
        data["__repo_root__"] = str(repo_root)
        run_out = _build_one_run(skill_name, data, out_dir)

        # Write per-run data file.
        data_path = out_dir / "data" / "runs" / f"{run_out['runKey']}.js"
        _write_data_file(data_path, "__RUN_REVIEW_RUN__", run_out)

        # Render run detail page.
        run_html = _render_template(SHELL_DIR / "run.html.tmpl", {
            "RUN_TITLE": run_out.get("title") or run_out.get("runId"),
            "RUN_ID": run_out.get("runId"),
            "RUN_KEY": run_out.get("runKey"),
            "GENERATED_AT": generated_at,
        })
        run_page = out_dir / "runs" / run_out["runKey"] / "index.html"
        run_page.parent.mkdir(parents=True, exist_ok=True)
        run_page.write_text(run_html, encoding="utf-8")

        # Index entry (slim).
        runs_index.append({
            "runId": run_out["runId"],
            "runKey": run_out["runKey"],
            "skill": run_out["skill"],
            "title": run_out.get("title"),
            "createdAt": run_out.get("createdAt"),
            "outcome": run_out.get("outcome"),
            "outcomeSummary": run_out.get("outcomeSummary"),
            "scenarioCount": run_out.get("scenarioCount"),
            "completedScenarios": run_out.get("completedScenarios"),
            "failedScenarios": run_out.get("failedScenarios"),
            "avgTotalTokens": run_out.get("avgTotalTokens"),
            "totalDurationMs": run_out.get("totalDurationMs"),
            "detailPage": f"runs/{run_out['runKey']}/index.html",
        })

    # Write combined index data + html.
    index_payload = {
        "generatedAt": generated_at,
        "skills": sorted({r["skill"] for r in runs_index}),
        "runs": runs_index,
    }
    _write_data_file(out_dir / "data" / "index.js", "__RUN_REVIEW_INDEX__", index_payload)

    index_html = _render_template(SHELL_DIR / "index.html.tmpl", {
        "GENERATED_AT": generated_at,
        "RUN_COUNT": len(runs_index),
        "SKILL_COUNT": len({r["skill"] for r in runs_index}),
    })
    (out_dir / "index.html").write_text(index_html, encoding="utf-8")

    print(f"[ok] generated site at {out_dir} ({len(runs_index)} runs, {len(index_payload['skills'])} skills)")
    return out_dir


def build_site_for_skill(
    skill_name: str,
    out_dir: Path | None = None,
    repo_root: Path | None = None,
    source_spec: dict | None = None,
):
    """Single-skill convenience wrapper; merges with an existing site if present.

    The index will only list the provided skill, so this is mainly for per-skill
    development. Use :func:`build_site` with multiple skills for the combined
    deliverable.
    """
    return build_site(
        [skill_name],
        out_dir=out_dir,
        repo_root=repo_root,
        source_specs={skill_name: source_spec or {}},
    )
