"""Workbench initialization and case materialization."""

from .errors import CliError
from .io import write_json
from .manifest import DEFAULT_EVALS, case_dir, case_task_info, load_manifest, suite_path, workbench_from_suite
from .workbench_paths import skill_name_for_target, workbench_path


def init_workbench(target, dry_run=False):
    workbench = workbench_path(target)
    paths = [workbench, workbench / "cases", workbench / "runs"]
    evals_path = workbench / "evals.json"
    changes = []
    for path in paths:
        if not path.exists():
            changes.append({"action": "mkdir", "path": str(path)})
            if not dry_run:
                path.mkdir(parents=True, exist_ok=True)
    manifest = dict(DEFAULT_EVALS)
    manifest["skill_name"] = skill_name_for_target(target)
    if not (target / "SKILL.md").exists():
        manifest["target"] = {"type": "skill", "ref": "skill/SKILL.md"}
    if not evals_path.exists():
        changes.append({"action": "write", "path": str(evals_path)})
        if not dry_run:
            write_json(evals_path, manifest)
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
        task_path = root / task["path"]
        if force or not task_path.exists():
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
    return {"ok": True, "suite": str(suite), "changes": changes}
