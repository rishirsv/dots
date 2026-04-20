"""Adapter for the ``autoresearch`` skill (task-oriented runs).

Surfaces the task contract, verification contract, config, final output artifact,
and session notes. Also infers whether the run was effectively fast vs deep mode.
"""

from __future__ import annotations

import json
import os
import shutil
from pathlib import Path

SKILL_NAME = "autoresearch"


def _rel_to_run_page(site_dir: Path, run_key: str, copied: Path) -> str:
    run_page = site_dir / "runs" / run_key
    return os.path.relpath(copied, run_page).replace(os.sep, "/")


def _copy_workspace_file(src_path: Path, site_dir: Path, run_key: str, scen_id: str, name: str):
    dest = site_dir / "artifacts" / run_key / scen_id / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        shutil.copyfile(src_path, dest)
        return dest
    except (FileNotFoundError, OSError):
        return None


def _read_text(path: Path, limit: int = 120_000) -> str | None:
    try:
        with path.open("rb") as fh:
            raw = fh.read(limit + 1)
        text = raw.decode("utf-8", errors="replace")
        if len(raw) > limit:
            text = text[:limit] + "\n\n… (truncated)"
        return text
    except FileNotFoundError:
        return None
    except OSError:
        return None


def _primary_output_path(scenario, workspace_path: Path) -> Path | None:
    """Pick the primary output artifact — first changed file outside .autoresearch."""
    for ch in scenario.get("workspaceChanges") or []:
        p = ch.get("path") or ""
        if p.startswith(".autoresearch/"):
            continue
        candidate = workspace_path / p
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def _looks_like_fast(scenario) -> bool:
    """Heuristic for fast-mode outcome: single iteration, no matrix/ledger."""
    changes = scenario.get("workspaceChanges") or []
    paths = {c.get("path") for c in changes}
    has_matrix = any(p and p.endswith("/matrix.json") for p in paths)
    has_results = any(p and p.endswith("/results.jsonl") for p in paths)
    return not has_matrix and not has_results


def prepare_run(run_data, site_dir: Path, run_key: str):
    return {}


def collect_scenario_artifacts(scenario, site_dir: Path, run_key: str, run_data, adapter_ctx):
    workspace_path = Path(scenario.get("workspacePath") or "")
    scen_id = scenario.get("id") or "scenario"
    artifacts = []
    panels = []

    if not workspace_path.exists():
        return artifacts, panels

    ar_dir = workspace_path / ".autoresearch"

    # 1. Primary output artifact (e.g. out/runbook.md) — first-class.
    primary = _primary_output_path(scenario, workspace_path)
    if primary:
        dest = _copy_workspace_file(primary, site_dir, run_key, scen_id, "output-" + primary.name)
        if dest:
            content = _read_text(dest)
            artifacts.append({
                "displayName": str(primary.relative_to(workspace_path)),
                "role": "output",
                "kind": "markdown" if primary.suffix.lower() == ".md" else "text",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(primary),
                "content": content or "",
            })

    # 2. session.md
    sess = ar_dir / "session.md"
    if sess.exists():
        dest = _copy_workspace_file(sess, site_dir, run_key, scen_id, "session.md")
        if dest:
            artifacts.append({
                "displayName": ".autoresearch/session.md",
                "role": "session",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(sess),
                "content": _read_text(dest) or "",
            })

    # 3. verify.md (verification contract)
    verify = ar_dir / "verify.md"
    if verify.exists():
        dest = _copy_workspace_file(verify, site_dir, run_key, scen_id, "verify.md")
        if dest:
            artifacts.append({
                "displayName": ".autoresearch/verify.md",
                "role": "verification contract",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(verify),
                "content": _read_text(dest) or "",
            })

    # 4. config.json
    config = ar_dir / "config.json"
    if config.exists():
        dest = _copy_workspace_file(config, site_dir, run_key, scen_id, "config.json")
        if dest:
            artifacts.append({
                "displayName": ".autoresearch/config.json",
                "role": "config",
                "kind": "json",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(config),
                "content": _read_text(dest) or "",
            })

    # 5. final message (already copied by build.py; expose as an artifact for completeness)
    if scenario.get("finalMessagePreview"):
        artifacts.append({
            "displayName": "Final message",
            "role": "final message",
            "kind": "markdown",
            "href": None,
            "sourcePath": scenario.get("finalMessagePath"),
            "content": scenario.get("finalMessagePreview") or "",
        })

    # Skill-specific KV panel: mode guess + task contract summary.
    cfg_obj = {}
    if config.exists():
        try:
            cfg_obj = json.loads(config.read_text(encoding="utf-8"))
        except Exception:
            cfg_obj = {}

    mode_guess = "fast" if _looks_like_fast(scenario) else "deep"
    kv_items = [
        {"k": "Mode (inferred)", "v": mode_guess},
        {"k": "Output artifact", "v": (str(primary.relative_to(workspace_path)) if primary else "—")},
        {"k": "Max iterations", "v": str(cfg_obj.get("max_iterations", "—"))},
        {"k": "Target kind", "v": cfg_obj.get("target_kind") or "—"},
    ]
    panels.append({
        "title": "Task contract",
        "kind": "kv",
        "items": kv_items,
    })

    return artifacts, panels


def derive_run_fields(run_data, scenarios_out, adapter_ctx):
    n = len(scenarios_out)
    passed = sum(1 for s in scenarios_out if s.get("status") == "completed")
    failed = n - passed
    # Task-language summary.
    task_target = (run_data.get("target") or {}).get("name") or SKILL_NAME
    if failed == 0:
        summary = f"{passed}/{n} task scenarios completed with a passing verifier."
    else:
        summary = f"{passed}/{n} completed, {failed} failed verification."
    lede = (
        f"The {task_target} skill was asked to produce a concrete artifact under an explicit contract. "
        + summary
    )
    return {
        "title": f"{task_target} · task run",
        "outcomeSummary": summary,
        "outcomeLede": lede,
        "adapterData": {
            "kind": "task",
        },
    }
