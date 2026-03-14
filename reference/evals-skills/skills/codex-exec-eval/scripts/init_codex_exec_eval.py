#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


SCAFFOLD_FILES = {
    "codex-eval.json.tmpl": "codex-eval.json",
    "cases.json.tmpl": "cases.json",
    "README.md.tmpl": "README.md",
    "report-template.md.tmpl": "outputs/reports/summary.md",
    "run_eval.py.tmpl": "run_eval.py",
    "setup-summary.md.tmpl": "setup-summary.md",
    "task-prompt.md.tmpl": "prompts/task-prompt.md",
    "gitignore.tmpl": ".gitignore",
}


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
    return parser.parse_args()


def scaffold_root() -> Path:
    return Path(__file__).resolve().parents[1] / "assets" / "scaffold"


def replacements(args: argparse.Namespace) -> dict[str, str]:
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
    }


def render_template(source: Path, destination: Path, replacements_map: dict[str, str]) -> None:
    text = source.read_text(encoding="utf-8")
    for token, value in replacements_map.items():
        text = text.replace(token, value)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(text, encoding="utf-8")


def main() -> int:
    args = parse_args()
    target_dir = Path(args.target_dir).resolve()
    target_dir.mkdir(parents=True, exist_ok=True)

    repl = replacements(args)
    root = scaffold_root()

    for source_name, destination_name in SCAFFOLD_FILES.items():
        render_template(root / source_name, target_dir / destination_name, repl)

    if not args.no_csv:
        render_template(root / "cases.csv.tmpl", target_dir / "cases.csv", repl)

    (target_dir / "outputs" / "raw").mkdir(parents=True, exist_ok=True)
    (target_dir / "outputs" / "reports").mkdir(parents=True, exist_ok=True)

    run_eval = target_dir / "run_eval.py"
    run_eval.chmod(0o755)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
