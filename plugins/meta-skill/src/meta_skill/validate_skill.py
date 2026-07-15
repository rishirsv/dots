#!/usr/bin/env python3
"""Deterministic structural validation for an agent skill's SKILL.md.

A deterministic structural task used by `<meta-skill-root>/scripts/metaskill validate`. These checks
need no judge, so the LLM scores only Discovery and Implementation while
structure is verified deterministically here.

This is a scorer, not a gate: exit code is 0 unless the file cannot be read.
Read the printed report (or --json) for per-check results and the pass-rate.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

import yaml

LINE_LIMIT = 500
KNOWN_KEYS = {
    "name",
    "description",
    "compatibility",
    "allowed-tools",
    "metadata",
    "license",
    "disable-model-invocation",
}

PASS, WARN, FAIL = "Pass", "Warning", "Fail"


def resolve_skill_md(target: str) -> str:
    return os.path.join(target, "SKILL.md") if os.path.isdir(target) else target


def split_frontmatter(text: str):
    """Return (frontmatter_text, body_text). frontmatter_text is None when the
    file has no leading `---` block."""
    if not text.startswith("---"):
        return None, text
    lines = text.splitlines()
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1:])
    return None, text


def parse_frontmatter(fm: str):
    """Parse frontmatter and return ``(mapping, syntax_valid)``."""
    try:
        data = yaml.safe_load(fm)
    except yaml.YAMLError:
        return {}, False
    return (data, True) if isinstance(data, dict) else ({}, False)


def check(results, name, status, message):
    results.append({"check": name, "result": status, "message": message})


def validate(skill_md_path: str):
    results = []
    with open(skill_md_path, "r", encoding="utf-8") as fh:
        text = fh.read()

    line_count = len(text.splitlines())
    fm_text, body = split_frontmatter(text)

    # frontmatter_valid
    fm, parsed = ({}, False)
    if fm_text is None:
        check(results, "frontmatter_valid", FAIL, "No `---` frontmatter block found")
    else:
        fm, parsed = parse_frontmatter(fm_text)
        if parsed and fm:
            check(results, "frontmatter_valid", PASS, "Frontmatter syntax is valid")
        else:
            check(results, "frontmatter_valid", FAIL, "Frontmatter present but unparseable")

    # name_field
    name = fm.get("name")
    if isinstance(name, str) and name.strip():
        value = name.strip()
        ok = len(value) <= 64 and bool(re.fullmatch(r"[a-z0-9][a-z0-9-]*", value))
        check(results, "name_field", PASS if ok else FAIL,
              f"'name' field is valid: '{name.strip()}'" if ok
              else f"'name' must be kebab-case and at most 64 characters: '{value}'")
    else:
        check(results, "name_field", FAIL, "'name' field missing or empty")

    # description_field
    desc = fm.get("description")
    if isinstance(desc, str) and desc.strip():
        check(results, "description_field", PASS,
              f"'description' field is valid ({len(desc.strip())} chars)")
    else:
        check(results, "description_field", FAIL, "'description' field missing or empty")

    # frontmatter_unknown_keys
    unknown = [k for k in fm.keys() if k not in KNOWN_KEYS]
    if unknown:
        check(results, "frontmatter_unknown_keys", WARN,
              "Unknown frontmatter key(s) found; consider removing or moving to "
              f"metadata: {', '.join(map(str, unknown))}")
    else:
        check(results, "frontmatter_unknown_keys", PASS, "No unknown frontmatter keys")

    for field in ("compatibility", "license"):
        if field not in fm:
            continue
        value = fm[field]
        ok = isinstance(value, str) and bool(value.strip())
        check(results, f"{field}_field", PASS if ok else FAIL,
              f"'{field}' is a non-empty string" if ok
              else f"'{field}' must be a non-empty string when present")

    if "allowed-tools" in fm:
        value = fm["allowed-tools"]
        ok = ((isinstance(value, str) and bool(value.strip()))
              or (isinstance(value, list) and bool(value)
                  and all(isinstance(item, str) and item.strip() for item in value)))
        check(results, "allowed_tools_field", PASS if ok else FAIL,
              "'allowed-tools' contains tool names" if ok
              else "'allowed-tools' must be a non-empty string or list of non-empty strings")

    if "metadata" in fm:
        ok = isinstance(fm["metadata"], dict)
        check(results, "metadata_field", PASS if ok else FAIL,
              "'metadata' is a mapping" if ok
              else "'metadata' must be a mapping when present")

    if "disable-model-invocation" in fm:
        ok = isinstance(fm["disable-model-invocation"], bool)
        check(results, "disable_model_invocation_field", PASS if ok else FAIL,
              "'disable-model-invocation' is boolean" if ok
              else "'disable-model-invocation' must be boolean when present")

    # skill_md_line_count
    check(results, "skill_md_line_count",
          PASS if line_count <= LINE_LIMIT else FAIL,
          f"SKILL.md line count is {line_count} (<= {LINE_LIMIT})"
          if line_count <= LINE_LIMIT
          else f"SKILL.md line count is {line_count} (> {LINE_LIMIT})")

    # body_present
    check(results, "body_present",
          PASS if body.strip() else FAIL,
          "SKILL.md body is present" if body.strip() else "SKILL.md body is empty")

    total = len(results)
    passed = sum(1 for r in results if r["result"] == PASS)
    percent = round(100 * passed / total) if total else 0
    return {
        "skill_md": skill_md_path,
        "checks": results,
        "passed": passed,
        "total": total,
        "validation_percent": percent,
    }


def main(argv=None):
    ap = argparse.ArgumentParser(description="Internal validator. Agent-facing usage: <meta-skill-root>/scripts/metaskill validate <skill-dir>.")
    ap.add_argument("target", help="Path to SKILL.md or a skill directory")
    ap.add_argument("--json", action="store_true", help="Emit JSON instead of a table")
    args = ap.parse_args(argv)

    path = resolve_skill_md(args.target)
    if not os.path.isfile(path):
        print(f"error: SKILL.md not found at {path}", file=sys.stderr)
        return 2

    report = validate(path)
    if args.json:
        print(json.dumps(report, indent=2))
        return 0

    width = max(len(r["check"]) for r in report["checks"])
    print(f"Validation — {path}\n")
    for r in report["checks"]:
        print(f"  {r['result']:<7} {r['check']:<{width}}  {r['message']}")
    print(f"\nValidation: {report['passed']}/{report['total']} passed "
          f"({report['validation_percent']}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
