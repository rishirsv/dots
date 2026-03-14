#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
import sys


REQUIRED_TOP_LEVEL = {
    "task",
    "codex_exec",
    "inputs",
    "cases",
    "target_skill",
    "optimization",
    "grading",
    "ui",
    "evaluation",
    "outputs",
}
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
REQUIRED_TARGET_SKILL = {"root_path", "tracked_files", "baseline_version", "candidate_root", "active_candidate"}
REQUIRED_OPTIMIZATION = {
    "enabled",
    "max_rounds",
    "naming_scheme",
    "mutation_scope",
    "review_batch_size",
    "review_batch_case_ids",
    "holdout_case_ids",
    "holdout_tags",
    "target_holdout_pass_count",
    "promotion_mode",
    "optimizer_model",
    "optimizer_sandbox",
}
REQUIRED_GRADING = {"deterministic_enabled", "human_review_required", "judge_mode", "label_store", "combined_strategy"}
REQUIRED_UI = {"enabled", "storage_backend", "port", "launch_command"}
REQUIRED_CASE_FIELDS = {"id", "prompt", "input_text", "source_files", "tags", "split", "notes", "expected"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate a codex exec eval project.")
    parser.add_argument("--project-dir", required=True, help="Path to the generated eval project")
    return parser.parse_args()


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def check_required_fields(section_name: str, payload: dict, required: set[str]) -> None:
    missing = required - set(payload.keys())
    if missing:
        fail(f"Missing {section_name} fields: {', '.join(sorted(missing))}")


def validate_config(project_dir: Path) -> dict:
    config_path = project_dir / "codex-eval.json"
    if not config_path.exists():
        fail(f"Missing config: {config_path}")
    config = load_json(config_path)
    missing_sections = REQUIRED_TOP_LEVEL - set(config.keys())
    if missing_sections:
        fail(f"Missing top-level config sections: {', '.join(sorted(missing_sections))}")
    check_required_fields("codex_exec", config["codex_exec"], REQUIRED_CODEX_EXEC)
    check_required_fields("target_skill", config["target_skill"], REQUIRED_TARGET_SKILL)
    check_required_fields("optimization", config["optimization"], REQUIRED_OPTIMIZATION)
    check_required_fields("grading", config["grading"], REQUIRED_GRADING)
    check_required_fields("ui", config["ui"], REQUIRED_UI)
    return config


def validate_cases(project_dir: Path) -> list[dict]:
    cases_path = project_dir / "cases.json"
    if not cases_path.exists():
        fail(f"Missing cases file: {cases_path}")
    data = load_json(cases_path)
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
    return cases


def validate_case_splits(cases: list[dict], config: dict) -> None:
    train_count = sum(1 for case in cases if case.get("split", "train") == "train")
    holdout_count = sum(1 for case in cases if case.get("split") == "holdout")
    review_ids = config["optimization"].get("review_batch_case_ids", [])
    holdout_ids = config["optimization"].get("holdout_case_ids", [])
    review_batch_size = config["optimization"]["review_batch_size"]
    holdout_target = config["optimization"]["target_holdout_pass_count"]

    effective_review_count = len(review_ids) if review_ids else min(review_batch_size, train_count)
    effective_holdout_count = len(holdout_ids) if holdout_ids else holdout_count

    if effective_review_count == 0:
        fail("The project needs at least one training case or explicit review_batch_case_ids.")
    if effective_holdout_count == 0:
        fail("The project needs at least one holdout case or explicit holdout_case_ids.")
    if holdout_target > effective_holdout_count:
        fail(
            "target_holdout_pass_count exceeds the available holdout cases. "
            "Add more holdout cases or lower the promotion target."
        )


def validate_csv(project_dir: Path) -> None:
    csv_path = project_dir / "cases.csv"
    if not csv_path.exists():
        return
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"id", "prompt", "input_text", "split"}
        if not reader.fieldnames:
            fail("cases.csv must have headers")
        missing = required - set(reader.fieldnames)
        if missing:
            fail(f"cases.csv is missing headers: {', '.join(sorted(missing))}")


def validate_candidate_layout(project_dir: Path, config: dict) -> None:
    candidates_root = project_dir / config["target_skill"]["candidate_root"]
    index_path = candidates_root / "index.json"
    if not index_path.exists():
        fail(f"Missing candidate index: {index_path}")
    index = load_json(index_path)
    active = index.get("active_candidate")
    if not active:
        fail("Candidate index is missing active_candidate")
    active_relative = next(
        (candidate["path"] for candidate in index.get("candidates", []) if candidate.get("version") == active),
        "",
    )
    if not active_relative:
        fail(f"Active candidate is not listed in the candidate index: {active}")
    active_path = project_dir / active_relative
    if not active_path.exists():
        fail(f"Active candidate path does not exist: {active_path}")


def validate_review_layout(project_dir: Path, config: dict) -> None:
    label_store = project_dir / config["grading"]["label_store"]
    if not label_store.exists():
        fail(f"Missing label store: {label_store}")
    ui_paths = [
        project_dir / "review_server.py",
        project_dir / "review-ui" / "index.html",
        project_dir / "review-ui" / "app.js",
        project_dir / "review-ui" / "styles.css",
    ]
    for path in ui_paths:
        if not path.exists():
            fail(f"Missing review UI path: {path}")


def validate_layout(project_dir: Path) -> None:
    required_paths = [
        project_dir / "README.md",
        project_dir / "run_eval.py",
        project_dir / "optimize_skill.py",
        project_dir / "promote_candidate.py",
        project_dir / "prompts" / "task-prompt.md",
        project_dir / "prompts" / "improvement-prompt.md",
        project_dir / "outputs" / "raw",
        project_dir / "outputs" / "reports",
        project_dir / "promotion" / "staged",
    ]
    for path in required_paths:
        if not path.exists():
            fail(f"Missing scaffold path: {path}")


def main() -> int:
    args = parse_args()
    project_dir = Path(args.project_dir).resolve()
    validate_layout(project_dir)
    config = validate_config(project_dir)
    cases = validate_cases(project_dir)
    validate_csv(project_dir)
    validate_candidate_layout(project_dir, config)
    validate_review_layout(project_dir, config)
    validate_case_splits(cases, config)
    print("codex exec self-improving eval project is valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
