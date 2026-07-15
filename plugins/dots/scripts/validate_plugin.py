#!/usr/bin/env python3
"""Deterministic authoring checks for the source-owned Dots skill bundle."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
DESCRIPTION_WORD_LIMIT = 45
DEFAULT_PROMPT_CHAR_LIMIT = 400
FORBIDDEN = {
    "prompt-wrapper residue": re.compile(r"</content>"),
    "stale review name": re.compile(r"\bUltraReview\b"),
    "generated-emphasis phrase": re.compile(r"\bI repeat\b", re.IGNORECASE),
    "all-caps critical directive": re.compile(r"\bCRITICAL\b"),
    "internal source-footer guidance": re.compile(r"files read, sessions, tools", re.IGNORECASE),
}


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def quoted_field(text: str, field: str) -> str | None:
    match = re.search(rf"^\s*{re.escape(field)}:\s*(['\"])(.*?)\1\s*$", text, re.MULTILINE)
    return match.group(2) if match else None


def validate_skill(skill_dir: Path, errors: list[str]) -> None:
    skill_file = skill_dir / "SKILL.md"
    agent_file = skill_dir / "agents" / "openai.yaml"
    text = skill_file.read_text(encoding="utf-8")
    description = quoted_field(text, "description")
    if description is None:
        fail(errors, f"{skill_file}: missing quoted frontmatter description")
    elif len(description.split()) > DESCRIPTION_WORD_LIMIT:
        fail(
            errors,
            f"{skill_file}: description is {len(description.split())} words; limit is {DESCRIPTION_WORD_LIMIT}",
        )

    if not agent_file.exists():
        fail(errors, f"{agent_file}: missing agent metadata")
        return
    agent_text = agent_file.read_text(encoding="utf-8")
    prompt = quoted_field(agent_text, "default_prompt")
    if prompt is None:
        fail(errors, f"{agent_file}: missing quoted default_prompt")
    elif len(prompt) > DEFAULT_PROMPT_CHAR_LIMIT:
        fail(
            errors,
            f"{agent_file}: default_prompt is {len(prompt)} characters; limit is {DEFAULT_PROMPT_CHAR_LIMIT}",
        )
    if not re.search(r"^\s*allow_implicit_invocation:\s*(true|false)\s*$", agent_text, re.MULTILINE):
        fail(errors, f"{agent_file}: missing boolean allow_implicit_invocation policy")


def validate_eval(path: Path, errors: list[str]) -> None:
    try:
        suite = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, f"{path}: invalid JSON: {exc}")
        return
    if "cases" in suite:
        fail(errors, f"{path}: legacy 'cases' key; use schema_version 2 with evals")
    if suite.get("schema_version") != 2:
        fail(errors, f"{path}: schema_version must be 2")
    if suite.get("target") != {"type": "skill", "ref": "SKILL.md"}:
        fail(errors, f"{path}: target must reference SKILL.md")
    evals = suite.get("evals")
    if not isinstance(evals, list) or not evals:
        fail(errors, f"{path}: evals must be a non-empty list")
        return
    for index, case in enumerate(evals):
        for field in ("prompt", "expected_output"):
            if not isinstance(case.get(field), str) or not case[field].strip():
                fail(errors, f"{path}: eval {index} must define non-empty {field}")
        expectations = case.get("expectations")
        if not isinstance(expectations, list) or not expectations or not all(
            isinstance(expectation, str) and expectation.strip() for expectation in expectations
        ):
            fail(errors, f"{path}: eval {index} must define non-empty expectations")


def main() -> int:
    errors: list[str] = []
    skill_dirs = sorted(path.parent for path in SKILLS.glob("*/SKILL.md"))
    if not skill_dirs:
        fail(errors, f"{SKILLS}: no source skills found")
    for skill_dir in skill_dirs:
        validate_skill(skill_dir, errors)

    runtime_suffixes = {".md", ".html", ".yaml", ".yml"}
    for path in sorted(SKILLS.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in runtime_suffixes:
            continue
        text = path.read_text(encoding="utf-8")
        for label, pattern in FORBIDDEN.items():
            if pattern.search(text):
                fail(errors, f"{path}: {label}")

    for path in sorted((ROOT / ".skill").rglob("evals/evals.json")):
        validate_eval(path, errors)

    if errors:
        print("Dots validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Dots validation passed: {len(skill_dirs)} skills")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
