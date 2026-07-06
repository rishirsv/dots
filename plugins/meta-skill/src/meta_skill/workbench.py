"""Workbench initialization, status, and case scaffolding."""

from collections import Counter
from pathlib import Path

from .errors import CliError
from .ids import require_id
from .io import read_json, write_json
from .linting import lint_suite
from .manifest import DEFAULT_EVALS, case_dir, load_manifest, suite_path, workbench_from_suite
from .workbench_paths import skill_name_for_target, workbench_path


AGENTS_TEMPLATE = """# Workbench Guidance

This hidden folder is the private workbench for `{skill_name}`. It stores durable
skill-development knowledge and authored evaluation inputs; it is not the
runtime skill payload.

## Source Boundary

- Runtime behavior belongs in `SKILL.md` and shipped references, scripts,
  assets, examples, or templates.
- Workbench material supports skill improvement, evaluation, and packaging, but
  should not be copied into runtime files unless it is reusable, trigger-relevant,
  and safe to ship.
- Keep raw transcripts, client facts, hidden grader answers, rejected drafts, and
  source-specific notes out of runtime files.

## Folder Conventions

- Put durable specs, roadmap files, decisions, review context, and research in
  `docs/`; use `docs/research/` only when the research volume needs nesting.
- Put authored eval suites in `evals.json` and materialized task content in
  `cases/`.
- Put recurring eval presets in `presets/` only when creating a real
  preset.
- Do not create empty folders. Create a folder only when writing its first real
  file.

## Generated State

- `runs/`, `workspaces/`, `worktrees/`, `dist/`, and `calibrations/` are generated
  output. Treat them as replaceable evidence or build artifacts.
- `task.md` is visible agent input. Keep hidden expectations, validators, judge
  guidance, and answer keys outside the visible task.

## Skill-Specific Updates

- Add user-approved invariants and update guidance here when they apply only to
  this skill or workbench.
- Prefer precise "do this / do not do this" guidance over broad process notes.
- If guidance becomes generally reusable across skills, promote it to the
  Meta-Skill source docs instead of duplicating it here.
"""


def init_workbench(target, dry_run=False):
    workbench = workbench_path(target)
    agents_path = workbench / "AGENTS.md"
    changes = []
    if not workbench.exists():
        changes.append({"action": "mkdir", "path": str(workbench)})
        if not dry_run:
            workbench.mkdir(parents=True, exist_ok=True)
    if not agents_path.exists():
        changes.append({"action": "write", "path": str(agents_path)})
        if not dry_run:
            agents_path.parent.mkdir(parents=True, exist_ok=True)
            agents_path.write_text(AGENTS_TEMPLATE.format(skill_name=skill_name_for_target(target)))
    return {"ok": True, "target": str(target), "workbench": str(workbench), "changes": changes}


def scaffold_evals(target, dry_run=False):
    """Scaffold a starter evals.json for the target's workbench if none exists."""
    workbench = workbench_path(target)
    evals_path = workbench / "evals.json"
    changes = []
    if not evals_path.exists():
        changes.append({"action": "write", "path": str(evals_path)})
        if not dry_run:
            manifest = dict(DEFAULT_EVALS)
            manifest["schema_version"] = 1
            manifest["skill_name"] = skill_name_for_target(target)
            evals_path.parent.mkdir(parents=True, exist_ok=True)
            write_json(evals_path, manifest)
    return {"ok": True, "evals": str(evals_path), "changes": changes}


def init_target(target, dry_run=False):
    """Full golden-path init: workbench guidance plus a starter eval suite."""
    workbench_result = init_workbench(target, dry_run)
    evals_result = scaffold_evals(target, dry_run)
    changes = list(workbench_result["changes"]) + list(evals_result["changes"])
    return {
        "ok": True,
        "target": str(target),
        "workbench": workbench_result["workbench"],
        "evals": evals_result["evals"],
        "changes": changes,
    }


def status_snapshot(target=None):
    """Summarize workbench, suite, presets, and run history at a glance."""
    target = Path(target or ".").expanduser().resolve()
    workbench = workbench_path(target)
    suite = workbench / "evals.json"
    suite_exists = suite.exists()
    result = {
        "ok": True,
        "target": str(target),
        "workbench": {"path": str(workbench), "exists": workbench.exists()},
        "suite": {"path": str(suite), "exists": suite_exists},
        "presets": [],
        "runs": {"count": 0, "latest": None},
    }
    if not suite_exists:
        return result

    manifest = load_manifest(suite)
    cases = manifest.get("cases", [])
    case_types = Counter(case.get("type") or "unspecified" for case in cases)
    lint_result = lint_suite(str(suite))
    result["suite"].update(
        {
            "case_count": len(cases),
            "case_types": dict(sorted(case_types.items())),
            "lint_warning_count": len(lint_result["warnings"]),
        }
    )

    presets_dir = workbench / "presets"
    preset_ids = []
    if presets_dir.is_dir():
        for path in sorted(presets_dir.glob("*.json")):
            try:
                preset_ids.append(read_json(path).get("id") or path.stem)
            except CliError:
                preset_ids.append(path.stem)
    result["presets"] = preset_ids

    from .report import list_runs

    runs = list_runs(str(suite))["runs"]
    result["runs"]["count"] = len(runs)
    if runs:
        latest = runs[-1]
        result["runs"]["latest"] = {
            "run_id": latest.get("run_id"),
            "created_at": latest.get("created_at"),
            "final_verdict_totals": latest.get("final_verdict_totals"),
        }
    return result


CASE_TASK_TEMPLATE = "TODO: author the visible task for this case.\n"


def new_case(case_id, raw_suite=None):
    """Scaffold task.md for a new case and hand back a manifest snippet if needed."""
    case_id = require_id("case id", case_id)
    suite = suite_path(raw_suite)
    workbench = workbench_from_suite(suite)
    root = case_dir(workbench, case_id)
    changes = []
    if not root.exists():
        changes.append({"action": "mkdir", "path": str(root)})
        root.mkdir(parents=True, exist_ok=True)
    task_path = root / "task.md"
    if not task_path.exists():
        changes.append({"action": "write", "path": str(task_path)})
        task_path.write_text(CASE_TASK_TEMPLATE)
    else:
        changes.append({"action": "skip", "path": str(task_path)})

    existing_ids = set()
    if suite.exists():
        manifest = load_manifest(suite)
        existing_ids = {case.get("id") for case in manifest.get("cases", [])}

    result = {
        "ok": True,
        "case_id": case_id,
        "suite": str(suite),
        "task_path": str(task_path),
        "changes": changes,
        "manifest_updated": False,
    }
    if case_id not in existing_ids:
        result["manifest_snippet"] = {
            "id": case_id,
            "type": "capability",
            "task": {"path": "task.md"},
            "expectations": [],
        }
    return result
