"""Adapter for the ``skill-autoresearch`` skill (skill improvement runs).

Surfaces the live rewritten SKILL.md, the original→best diff, baseline.md,
final.md, matrix.json, session.md, and parses results.jsonl into an iteration
ledger plus calibration/holdout matrix.
"""

from __future__ import annotations

import difflib
import json
import os
import shutil
from pathlib import Path

SKILL_NAME = "skill-autoresearch"


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


def _read_text(path: Path, limit: int = 160_000) -> str | None:
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


def _find_target_skill_root(scenario, workspace_path: Path) -> Path | None:
    """Locate the skill dir that holds the rewritten SKILL.md.

    Strategy: find a path in workspaceChanges that ends in SKILL.md and is NOT
    inside .autoresearch/working/. Its parent directory is the target skill root.
    """
    for ch in scenario.get("workspaceChanges") or []:
        p = ch.get("path") or ""
        if p.endswith("/SKILL.md") and "/.autoresearch/" not in p and not p.startswith(".autoresearch/"):
            candidate = workspace_path / p
            if candidate.exists():
                return candidate.parent
    return None


def _read_results_jsonl(path: Path):
    out = []
    if not path.exists():
        return out
    with path.open("r", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                out.append(_normalize_result(json.loads(line)))
            except json.JSONDecodeError:
                continue
    return out


def _normalize_outcome(raw):
    """Coerce heterogeneous outcome shapes to {"passed": int, "failed": int}.

    Seen shapes across runs:
      - {"passed": 5, "failed": 0}
      - {"cal-1": "pass", "cal-2": "fail", ...}
      - {"passed": true/false, "details": {...}}   (boolean aggregate)
      - {"passed": true/false, "failed": ["fm-1", ...]}
      - "pass" / "fail" / "FAIL all calibration checks" / "not run"
    """
    if raw is None:
        return {"passed": 0, "failed": 0}
    if isinstance(raw, str):
        s = raw.lower()
        if "not run" in s:
            return {"passed": 0, "failed": 0}
        if s.startswith("pass") or "pass all" in s or "all pass" in s:
            return {"passed": 1, "failed": 0}
        if s.startswith("fail") or "fail all" in s:
            return {"passed": 0, "failed": 1}
        return {"passed": 0, "failed": 0}
    if isinstance(raw, dict):
        # Numeric shape.
        if isinstance(raw.get("passed"), (int, float)) and not isinstance(raw.get("passed"), bool):
            return {
                "passed": int(raw.get("passed") or 0),
                "failed": int(raw.get("failed") or 0),
            }
        # Boolean aggregate with details.
        if isinstance(raw.get("passed"), bool):
            passed_bool = raw.get("passed")
            fails = raw.get("failed")
            if isinstance(fails, list):
                return {"passed": 1 if passed_bool and not fails else 0,
                        "failed": len(fails)}
            details = raw.get("details")
            if isinstance(details, dict):
                p = sum(1 for v in details.values() if _is_pass_marker(v))
                f = sum(1 for v in details.values() if _is_fail_marker(v))
                return {"passed": p, "failed": f}
            return {"passed": 1 if passed_bool else 0, "failed": 0 if passed_bool else 1}
        # Dict of scenario_id -> "pass"/"fail" etc.
        p = sum(1 for v in raw.values() if _is_pass_marker(v))
        f = sum(1 for v in raw.values() if _is_fail_marker(v))
        return {"passed": p, "failed": f}
    return {"passed": 0, "failed": 0}


def _is_pass_marker(v):
    if v is True:
        return True
    if isinstance(v, str) and v.strip().lower().startswith("pass"):
        return True
    if isinstance(v, dict) and v.get("passed") is True:
        return True
    return False


def _is_fail_marker(v):
    if v is False:
        return True
    if isinstance(v, str) and v.strip().lower().startswith("fail"):
        return True
    if isinstance(v, dict) and v.get("passed") is False:
        return True
    return False


def _normalize_result(rec: dict) -> dict:
    return {
        "iteration": rec.get("iteration") or rec.get("iteration_id") or "?",
        "hypothesis": rec.get("hypothesis") or "",
        "files_changed": rec.get("files_changed") or [],
        "calibration_outcome": _normalize_outcome(
            rec.get("calibration_outcome") or rec.get("calibration")
        ),
        "holdout_outcome": _normalize_outcome(
            rec.get("holdout_outcome") or rec.get("holdout")
        ),
        "decision": rec.get("decision") or "",
        "lesson_learned": rec.get("lesson_learned") or rec.get("lesson") or "",
    }


def prepare_run(run_data, site_dir: Path, run_key: str):
    return {}


def _build_matrix_panel(matrix_obj: dict, results: list[dict]):
    """Build a compact calibration/holdout grid from matrix.json + results.jsonl.

    Rows are scenarios (calibration + holdout). Cols are failure modes the
    scenario actually checks. Cell = pass/fail/— based on the final kept
    iteration's outcome (we use the last non-baseline entry if present).
    """
    if not matrix_obj:
        return None
    failure_modes = matrix_obj.get("failure_modes") or []
    if not failure_modes:
        return None
    scenarios_blob = matrix_obj.get("scenarios") or {}
    rows = []

    # Use the last "keep" iteration if any.
    final_iter = None
    for r in results:
        if r.get("decision") == "keep":
            final_iter = r
    if not final_iter:
        final_iter = results[-1] if results else None

    # We don't have per-scenario per-check pass/fail in results.jsonl, only
    # aggregate passed/failed counts. Render aggregate at the bottom instead.
    for group_name, group in [("calibration", scenarios_blob.get("calibration") or []),
                              ("holdout", scenarios_blob.get("holdout") or [])]:
        for scen in group:
            label = scen.get("id") + "  " + group_name
            values = []
            scen_checks = set(scen.get("checks") or [])
            for fm in failure_modes:
                fm_id = fm.get("id")
                if fm_id not in scen_checks:
                    values.append("")
                    continue
                # Without per-check results, map aggregate outcome onto "probable pass"
                # only when the group outcome fully passed.
                outcome = (final_iter or {}).get(group_name + "_outcome") or {"passed": 0, "failed": 0}
                passed = outcome.get("passed") or 0
                failed = outcome.get("failed") or 0
                if failed == 0 and passed > 0:
                    values.append("pass")
                elif passed == 0 and failed > 0:
                    values.append("fail")
                else:
                    values.append("")
            rows.append({"label": label, "values": values})

    cols = [fm.get("name") or fm.get("id") or "?" for fm in failure_modes]
    return {
        "title": "Calibration × Holdout matrix",
        "kind": "matrix",
        "rows": rows,
        "cols": cols,
    }


def _build_ledger_panel(results: list[dict]):
    if not results:
        return None
    rows = []
    for r in results:
        rows.append({
            "iteration": r.get("iteration") or "?",
            "hypothesis": r.get("hypothesis") or "",
            "calibration": r.get("calibration_outcome") or {},
            "holdout": r.get("holdout_outcome") or {},
            "decision": r.get("decision") or "",
        })
    return {
        "title": "Iteration ledger",
        "kind": "ledger",
        "rows": rows,
    }


def _build_diff_panel(ar_dir: Path, site_dir: Path, run_key: str, scen_id: str):
    orig = ar_dir / "working" / "SKILL.original.md"
    best = ar_dir / "working" / "SKILL.best.md"
    if not orig.exists() or not best.exists():
        return None, None, None
    orig_text = orig.read_text(encoding="utf-8", errors="replace")
    best_text = best.read_text(encoding="utf-8", errors="replace")
    diff_lines = list(difflib.unified_diff(
        orig_text.splitlines(keepends=False),
        best_text.splitlines(keepends=False),
        fromfile="SKILL.original.md",
        tofile="SKILL.best.md",
        lineterm="",
    ))
    diff_text = "\n".join(diff_lines)

    # Copy originals and diff into site.
    orig_dest = _copy_workspace_file(orig, site_dir, run_key, scen_id, "SKILL.original.md")
    best_dest = _copy_workspace_file(best, site_dir, run_key, scen_id, "SKILL.best.md")

    diff_dest = site_dir / "artifacts" / run_key / scen_id / "SKILL.diff.patch"
    diff_dest.parent.mkdir(parents=True, exist_ok=True)
    diff_dest.write_text(diff_text + ("\n" if diff_text else ""), encoding="utf-8")

    panel = {
        "title": "SKILL.md — original → best",
        "kind": "diff",
        "content": diff_text,
        "path": "SKILL.original.md → SKILL.best.md",
    }
    return panel, orig_dest, best_dest


def collect_scenario_artifacts(scenario, site_dir: Path, run_key: str, run_data, adapter_ctx):
    workspace_path = Path(scenario.get("workspacePath") or "")
    scen_id = scenario.get("id") or "scenario"
    artifacts = []
    panels = []

    if not workspace_path.exists():
        return artifacts, panels

    target_skill_root = _find_target_skill_root(scenario, workspace_path)
    if not target_skill_root:
        return artifacts, panels

    live_skill = target_skill_root / "SKILL.md"
    ar_dir = target_skill_root / ".autoresearch"

    # 1. Live rewritten SKILL.md (first-class).
    if live_skill.exists():
        dest = _copy_workspace_file(live_skill, site_dir, run_key, scen_id, "SKILL.live.md")
        if dest:
            artifacts.append({
                "displayName": "Live SKILL.md (rewritten in place)",
                "role": "rewritten target",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(live_skill),
                "content": _read_text(dest) or "",
            })

    # 2. Original vs best diff (first-class).
    diff_panel, orig_dest, best_dest = _build_diff_panel(ar_dir, site_dir, run_key, scen_id)
    if diff_panel:
        artifacts.append({
            "displayName": "SKILL.md · original → best diff",
            "role": "target diff",
            "kind": "diff",
            "href": _rel_to_run_page(site_dir, run_key,
                                     site_dir / "artifacts" / run_key / scen_id / "SKILL.diff.patch"),
            "sourcePath": str(ar_dir / "working"),
            "content": diff_panel["content"],
        })

    # 3. final.md
    final_report = ar_dir / "reports" / "final.md"
    if final_report.exists():
        dest = _copy_workspace_file(final_report, site_dir, run_key, scen_id, "final.md")
        if dest:
            artifacts.append({
                "displayName": "reports/final.md",
                "role": "final report",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(final_report),
                "content": _read_text(dest) or "",
            })

    # 4. baseline.md
    baseline = ar_dir / "reports" / "baseline.md"
    if baseline.exists():
        dest = _copy_workspace_file(baseline, site_dir, run_key, scen_id, "baseline.md")
        if dest:
            artifacts.append({
                "displayName": "reports/baseline.md",
                "role": "baseline report",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(baseline),
                "content": _read_text(dest) or "",
            })

    # 5. matrix.json
    matrix_path = ar_dir / "evals" / "matrix.json"
    matrix_obj = None
    if matrix_path.exists():
        dest = _copy_workspace_file(matrix_path, site_dir, run_key, scen_id, "matrix.json")
        if dest:
            content = _read_text(dest) or ""
            try:
                matrix_obj = json.loads(content)
            except Exception:
                matrix_obj = None
            artifacts.append({
                "displayName": "evals/matrix.json",
                "role": "matrix",
                "kind": "json",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(matrix_path),
                "content": content,
            })

    # 6. results.jsonl → ledger
    results_path = ar_dir / "results.jsonl"
    results = _read_results_jsonl(results_path) if results_path.exists() else []
    if results_path.exists():
        dest = _copy_workspace_file(results_path, site_dir, run_key, scen_id, "results.jsonl")
        if dest:
            artifacts.append({
                "displayName": ".autoresearch/results.jsonl",
                "role": "iteration log",
                "kind": "text",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(results_path),
                "content": _read_text(dest) or "",
            })

    # 7. session.md
    session = ar_dir / "session.md"
    if session.exists():
        dest = _copy_workspace_file(session, site_dir, run_key, scen_id, "session.md")
        if dest:
            artifacts.append({
                "displayName": ".autoresearch/session.md",
                "role": "session",
                "kind": "markdown",
                "href": _rel_to_run_page(site_dir, run_key, dest),
                "sourcePath": str(session),
                "content": _read_text(dest) or "",
            })

    # Panels: matrix, ledger, diff (diff separately in case user wants dedicated panel).
    matrix_panel = _build_matrix_panel(matrix_obj, results)
    ledger_panel = _build_ledger_panel(results)

    panels_list = []
    panels_list.append({
        "title": "Skill improvement contract",
        "kind": "kv",
        "items": [
            {"k": "Target skill path", "v": str(target_skill_root.relative_to(workspace_path))},
            {"k": "Iterations", "v": str(len(results))},
            {"k": "Kept rewrite?", "v": ("yes" if any(r.get("decision") == "keep" for r in results) else "no")},
            {"k": "Final calibration",
             "v": _fmt_outcome((results[-1] if results else {}).get("calibration_outcome") or {})},
            {"k": "Final holdout",
             "v": _fmt_outcome((results[-1] if results else {}).get("holdout_outcome") or {})},
        ],
    })
    if ledger_panel:
        panels_list.append(ledger_panel)
    if matrix_panel:
        panels_list.append(matrix_panel)
    if diff_panel:
        panels_list.append(diff_panel)

    return artifacts, panels_list


def _fmt_outcome(o: dict) -> str:
    p = o.get("passed") or 0
    f = o.get("failed") or 0
    if p + f == 0:
        return "—"
    return f"{p}/{p+f} passed"


def derive_run_fields(run_data, scenarios_out, adapter_ctx):
    n = len(scenarios_out)
    passed = sum(1 for s in scenarios_out if s.get("status") == "completed")
    failed = n - passed
    if failed == 0:
        summary = f"{passed}/{n} skill rewrites passed both calibration and holdout."
    else:
        summary = f"{passed}/{n} completed, {failed} fell short (scope, structure, or holdout failure)."
    lede = (
        "A skill improvement loop: the agent was asked to rewrite a weak target SKILL.md "
        f"through the autoresearch eval loop. {summary}"
    )
    return {
        "title": "skill-autoresearch · rewrite run",
        "outcomeSummary": summary,
        "outcomeLede": lede,
        "adapterData": {"kind": "skill-improvement"},
    }
