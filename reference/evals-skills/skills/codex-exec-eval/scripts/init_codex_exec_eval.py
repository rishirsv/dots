#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
import shutil


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scaffold a codex exec eval project.")
    parser.add_argument("--target-dir", required=True, help="Directory to create or update")
    parser.add_argument("--task-name", required=True, help="Short task name")
    parser.add_argument("--task-description", required=True, help="Plain-language task description")
    parser.add_argument(
        "--input-mode",
        required=True,
        choices=["prompt_only", "file_transform", "prompt_plus_files"],
        help="Primary case input mode",
    )
    parser.add_argument(
        "--case-source",
        required=True,
        choices=["existing_json", "existing_csv", "manual", "synthetic"],
        help="How cases will be sourced",
    )
    parser.add_argument("--success-definition", default="A successful run satisfies the deterministic checks for the case.")
    parser.add_argument("--model", default="gpt-5.4")
    parser.add_argument(
        "--sandbox",
        default="workspace-write",
        choices=["read-only", "workspace-write", "danger-full-access"],
    )
    parser.add_argument("--full-auto", action="store_true", help="Enable --full-auto in the scaffold config")
    parser.add_argument("--no-ephemeral", action="store_true", help="Disable --ephemeral in the scaffold config")
    parser.add_argument("--skip-git-repo-check", action="store_true")
    parser.add_argument("--no-json-output", action="store_true")
    parser.add_argument(
        "--evaluation-mode",
        default="deterministic",
        choices=["deterministic", "judge_optional"],
    )
    parser.add_argument("--no-csv", action="store_true", help="Do not create cases.csv")
    parser.add_argument("--target-skill-root", default="", help="Root folder of the skill package being improved")
    parser.add_argument("--tracked-file", action="append", default=[], help="Relative file inside the skill package to track")
    parser.add_argument("--review-batch-size", type=int, default=3, help="How many training cases require human review each round")
    parser.add_argument("--holdout-target-pass-count", type=int, default=10, help="Required holdout pass count before promotion")
    parser.add_argument("--max-rounds", type=int, default=4, help="Maximum number of candidate revisions to create")
    parser.add_argument("--ui-port", type=int, default=8765, help="Local port for the review UI")
    parser.add_argument("--optimizer-model", default="", help="Model used to draft the next candidate revision")
    parser.add_argument(
        "--optimizer-sandbox",
        default="workspace-write",
        choices=["read-only", "workspace-write", "danger-full-access"],
        help="Sandbox used while drafting new candidate revisions",
    )
    return parser.parse_args()


def scaffold_root() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "scaffold"


def detect_tracked_files(skill_root: Path) -> list[str]:
    files = []
    for path in sorted(skill_root.rglob("*")):
        if path.is_file():
            files.append(path.relative_to(skill_root).as_posix())
    return files


def replacements(args: argparse.Namespace, tracked_files: list[str], target_skill_root: Path | None) -> dict[str, str]:
    target_skill_text = target_skill_root.as_posix() if target_skill_root else ""
    optimizer_model = args.optimizer_model or args.model
    mutation_scope = tracked_files or ["SKILL.md", "references/**", "scripts/**", "assets/**"]
    return {
        "__TASK_NAME__": args.task_name,
        "__TASK_DESCRIPTION__": args.task_description,
        "__INPUT_MODE__": args.input_mode,
        "__CASE_SOURCE__": args.case_source,
        "__SUCCESS_DEFINITION__": args.success_definition,
        "__MODEL__": args.model,
        "__SANDBOX__": args.sandbox,
        "__FULL_AUTO__": "true" if args.full_auto else "false",
        "__EPHEMERAL__": "false" if args.no_ephemeral else "true",
        "__SKIP_GIT_REPO_CHECK__": "true" if args.skip_git_repo_check else "false",
        "__JSON_OUTPUT__": "false" if args.no_json_output else "true",
        "__EVALUATION_MODE__": args.evaluation_mode,
        "__TARGET_SKILL_ROOT__": target_skill_text,
        "__TRACKED_FILES_JSON__": json.dumps(tracked_files, indent=2),
        "__MUTATION_SCOPE_JSON__": json.dumps(mutation_scope, indent=2),
        "__REVIEW_BATCH_SIZE__": str(args.review_batch_size),
        "__HOLDOUT_TARGET__": str(args.holdout_target_pass_count),
        "__MAX_ROUNDS__": str(args.max_rounds),
        "__OPTIMIZER_MODEL__": optimizer_model,
        "__OPTIMIZER_SANDBOX__": args.optimizer_sandbox,
        "__UI_PORT__": str(args.ui_port),
        "__JUDGE_MODE__": "optional" if args.evaluation_mode == "judge_optional" else "off",
    }


def render_template(source: Path, destination: Path, replacements_map: dict[str, str]) -> None:
    text = source.read_text(encoding="utf-8")
    for token, value in replacements_map.items():
        text = text.replace(token, value)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(text, encoding="utf-8")


def copy_scaffold(root: Path, target_dir: Path, replacements_map: dict[str, str], include_csv: bool) -> None:
    for source in root.rglob("*"):
        if source.is_dir():
            continue
        relative = source.relative_to(root)
        if not include_csv and relative.as_posix() == "cases.csv.tmpl":
            continue
        if source.suffix == ".tmpl":
            destination_name = relative.as_posix()[: -len(".tmpl")]
            render_template(source, target_dir / destination_name, replacements_map)
        else:
            destination = target_dir / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)


def ensure_placeholder_skill(candidate_root: Path) -> None:
    candidate_root.mkdir(parents=True, exist_ok=True)
    placeholder = candidate_root / "README.md"
    if not placeholder.exists():
        placeholder.write_text(
            "# Candidate Skill Placeholder\n\nCopy the target skill package here or rerun init with --target-skill-root.\n",
            encoding="utf-8",
        )


def bootstrap_candidates(target_dir: Path, target_skill_root: Path | None, tracked_files: list[str]) -> None:
    candidates_root = target_dir / "candidates"
    baseline_root = candidates_root / "V1" / "skill"
    if target_skill_root and target_skill_root.exists():
        baseline_root.parent.mkdir(parents=True, exist_ok=True)
        if baseline_root.exists():
            shutil.rmtree(baseline_root)
        shutil.copytree(target_skill_root, baseline_root)
    else:
        ensure_placeholder_skill(baseline_root)

    index = {
        "baseline_version": "V1",
        "active_candidate": "V1",
        "candidates": [
            {
                "version": "V1",
                "parent": None,
                "source": "imported" if target_skill_root else "placeholder",
                "path": "candidates/V1/skill",
                "tracked_files": tracked_files,
            }
        ],
    }
    index_path = candidates_root / "index.json"
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(json.dumps(index, indent=2), encoding="utf-8")


def bootstrap_review_storage(target_dir: Path) -> None:
    review_root = target_dir / "review"
    review_root.mkdir(parents=True, exist_ok=True)
    (review_root / "grades.json").write_text(json.dumps({"labels": []}, indent=2), encoding="utf-8")
    (review_root / "review_state.json").write_text(json.dumps({"last_candidate": "V1"}, indent=2), encoding="utf-8")


def main() -> int:
    args = parse_args()
    target_dir = Path(args.target_dir).resolve()
    target_dir.mkdir(parents=True, exist_ok=True)

    target_skill_root = Path(args.target_skill_root).resolve() if args.target_skill_root else None
    tracked_files = args.tracked_file or (detect_tracked_files(target_skill_root) if target_skill_root and target_skill_root.exists() else [])

    repl = replacements(args, tracked_files, target_skill_root)
    root = scaffold_root()
    copy_scaffold(root, target_dir, repl, include_csv=not args.no_csv)

    (target_dir / "outputs" / "raw").mkdir(parents=True, exist_ok=True)
    (target_dir / "outputs" / "reports").mkdir(parents=True, exist_ok=True)
    (target_dir / "promotion" / "staged").mkdir(parents=True, exist_ok=True)

    bootstrap_candidates(target_dir, target_skill_root, tracked_files)
    bootstrap_review_storage(target_dir)

    for script_name in ["run_eval.py", "optimize_skill.py", "promote_candidate.py", "review_server.py"]:
        script_path = target_dir / script_name
        if script_path.exists():
            script_path.chmod(0o755)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
