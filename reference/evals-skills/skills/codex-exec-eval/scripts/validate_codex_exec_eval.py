#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
import sys


REQUIRED_TOP_LEVEL = {"task", "codex_exec", "inputs", "cases", "evaluation", "outputs"}
REQUIRED_CODEX_EXEC = {
    "model",
    "sandbox",
    "full_auto",
    "ephemeral",
    "skip_git_repo_check",
    "json_output",
    "output_schema",
    "add_dirs",
}
REQUIRED_CASE_FIELDS = {"id", "prompt", "input_text", "source_files", "tags", "notes", "expected"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate a codex exec eval project.")
    parser.add_argument("--project-dir", required=True, help="Path to the generated eval project")
    return parser.parse_args()


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_config(project_dir: Path) -> None:
    config_path = project_dir / "codex-eval.json"
    if not config_path.exists():
        fail(f"Missing config: {config_path}")
    config = load_json(config_path)

    missing_sections = REQUIRED_TOP_LEVEL - set(config.keys())
    if missing_sections:
        fail(f"Missing top-level config sections: {', '.join(sorted(missing_sections))}")

    missing_cx = REQUIRED_CODEX_EXEC - set(config["codex_exec"].keys())
    if missing_cx:
        fail(f"Missing codex_exec fields: {', '.join(sorted(missing_cx))}")


def validate_cases(project_dir: Path) -> None:
    cases_path = project_dir / "cases.json"
    if not cases_path.exists():
        fail(f"Missing cases file: {cases_path}")
    data = json.loads(cases_path.read_text(encoding="utf-8"))
    cases = data if isinstance(data, list) else data.get("cases")
    if not isinstance(cases, list):
        fail("cases.json must contain an array or an object with a 'cases' array")

    for index, case in enumerate(cases):
        if not isinstance(case, dict):
            fail(f"Case {index} is not an object")
        missing_fields = REQUIRED_CASE_FIELDS - set(case.keys())
        if missing_fields:
            fail(f"Case {index} is missing fields: {', '.join(sorted(missing_fields))}")
        if not isinstance(case["expected"], dict):
            fail(f"Case {index} expected must be an object")


def validate_csv(project_dir: Path) -> None:
    csv_path = project_dir / "cases.csv"
    if not csv_path.exists():
        return
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"id", "prompt", "input_text"}
        if not reader.fieldnames:
            fail("cases.csv must have headers")
        missing = required - set(reader.fieldnames)
        if missing:
            fail(f"cases.csv is missing headers: {', '.join(sorted(missing))}")


def validate_layout(project_dir: Path) -> None:
    required_paths = [
        project_dir / "README.md",
        project_dir / "run_eval.py",
        project_dir / "prompts" / "task-prompt.md",
        project_dir / "outputs" / "raw",
        project_dir / "outputs" / "reports",
    ]
    for path in required_paths:
        if not path.exists():
            fail(f"Missing scaffold path: {path}")


def main() -> int:
    args = parse_args()
    project_dir = Path(args.project_dir).resolve()
    validate_layout(project_dir)
    validate_config(project_dir)
    validate_cases(project_dir)
    validate_csv(project_dir)
    print("codex exec eval project is valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
