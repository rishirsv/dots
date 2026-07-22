"""Evaluation suite initialization and repository-state status."""

from collections import Counter
from pathlib import Path

from .linting import lint_suite
from .manifest import load_manifest
from .workbench_paths import evals_path, state_root


def init_workbench(target, dry_run=False):
    state = state_root(target)
    changes = []
    if not state.exists():
        changes.append({"action": "mkdir", "path": str(state)})
        if not dry_run:
            state.mkdir(parents=True, exist_ok=True)
    return {"ok": True, "target": str(target), "state": str(state), "changes": changes}


def scaffold_evals(target, dry_run=False):
    suite = evals_path(target)
    changes = []
    if not suite.exists():
        changes.append({"action": "mkdir", "path": str(suite)})
        if not dry_run:
            suite.mkdir(parents=True, exist_ok=True)
    return {"ok": True, "evals": str(suite), "changes": changes}


def init_target(target, dry_run=False, with_evals=False):
    workbench_result = init_workbench(target, dry_run)
    changes = list(workbench_result["changes"])
    suite = None
    if with_evals:
        evals_result = scaffold_evals(target, dry_run)
        suite = evals_result["evals"]
        changes.extend(evals_result["changes"])
    return {
        "ok": True,
        "target": str(target),
        "state": workbench_result["state"],
        "evals": suite,
        "changes": changes,
    }


def status_snapshot(target=None):
    target = Path(target or ".").expanduser().resolve()
    state = state_root(target)
    suite = evals_path(target)
    result = {
        "ok": True,
        "target": str(target),
        "state": {"path": str(state), "exists": state.exists()},
        "suite": {"path": str(suite), "exists": suite.exists()},
        "runs": {"count": 0, "latest": None},
    }
    if not suite.exists():
        return result
    if suite.is_dir() and not any(path.is_dir() and not path.name.startswith(".") for path in suite.iterdir()):
        result["suite"].update({"eval_count": 0, "eval_types": {}, "lint_warning_count": 0})
        return result
    manifest = load_manifest(suite)
    cases = manifest.get("evals", [])
    lint_result = lint_suite(str(suite))
    result["suite"].update(
        {
            "eval_count": len(cases),
            "eval_types": dict(sorted(Counter(case.get("type") or "unspecified" for case in cases).items())),
            "lint_warning_count": len(lint_result["warnings"]),
        }
    )
    from .report import list_runs

    runs = list_runs(str(suite))["runs"]
    result["runs"]["count"] = len(runs)
    if runs:
        result["runs"]["latest"] = runs[0]
    return result
