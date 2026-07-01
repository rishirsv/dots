"""Workbench initialization and case materialization."""

from .errors import CliError
from .manifest import case_dir, case_task_info, load_manifest, suite_path, workbench_from_suite
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


def materialize_cases(raw_suite, force=False):
    suite = suite_path(raw_suite)
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
        if task["source"] == "prompt":
            changes.append({"action": "skip", "path": str(root / "task.md"), "reason": "inline prompt stays in evals.json until run snapshot"})
            continue
        task_path = root / task["path"]
        if force or not task_path.exists():
            text = "TODO: author the visible task for this case.\n"
            changes.append({"action": "write" if not task_path.exists() else "overwrite", "path": str(task_path)})
            task_path.parent.mkdir(parents=True, exist_ok=True)
            task_path.write_text(text)
        else:
            changes.append({"action": "skip", "path": str(task_path)})
        for fixture in case.get("fixtures", []):
            (root / fixture).parent.mkdir(parents=True, exist_ok=True)
    return {"ok": True, "suite": str(suite), "changes": changes}
