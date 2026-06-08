#!/usr/bin/env python3
"""Deterministic authoring anti-pattern checks for a skill's SKILL.md.

A Verify-tests task (aggregated by run.py) covering the *mechanical* anti-patterns
from the authoring standard — the ones that belong in validation code rather than
human judgment. Judgment anti-patterns (wisdom-vs-directive, jargon section names,
contradictions) stay in the Judge Review's scored dimensions (see
../references/rubric.md), not here.

Usage:
    python3 lint_authoring.py <path-to-SKILL.md | skill-dir> [--json]

Emits the same {checks, passed, total} contract as validate_skill.py so run.py
can aggregate it. Heuristic checks flag as Warning (advisory) to avoid
hard-failing on a borderline call. Pure stdlib.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

DESC_SOFT_LIMIT = 500
DESC_HARD_LIMIT = 1024
HARD_COMMAND_LIMIT = 3  # ALL-CAPS directive tokens before it reads as shouting

PASS, WARN, FAIL = "Pass", "Warning", "Fail"

PERSON_WORDS = ["I", "me", "my", "we", "our", "us", "you", "your", "yours"]
HARD_TOKENS = ["MUST", "ALWAYS", "NEVER", "SHALL", "DO NOT", "DON'T"]


def resolve(target):
    return os.path.join(target, "SKILL.md") if os.path.isdir(target) else target


def split_frontmatter(text):
    if not text.startswith("---"):
        return "", text
    lines = text.splitlines()
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1:])
    return "", text


def get_description(fm):
    m = re.search(r"(?m)^description:\s*(.+)$", fm)
    return m.group(1).strip().strip("'\"") if m else ""


def find_local_links(md_text):
    links = []
    for m in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", md_text):
        tgt = m.group(1).strip()
        if tgt.startswith(("http://", "https://", "#", "mailto:")):
            continue
        tgt = tgt.split("#", 1)[0]
        if tgt:
            links.append(tgt)
    return links


def check(results, name, status, message):
    results.append({"check": name, "result": status, "message": message})


def validate(skill_md):
    results = []
    skill_dir = os.path.dirname(os.path.abspath(skill_md))
    with open(skill_md, "r", encoding="utf-8") as fh:
        text = fh.read()
    fm, body = split_frontmatter(text)
    desc = get_description(fm)

    # description_length
    n = len(desc)
    if not desc:
        check(results, "description_length", FAIL, "description missing")
    elif n > DESC_HARD_LIMIT:
        check(results, "description_length", FAIL, f"description is {n} chars (> {DESC_HARD_LIMIT})")
    elif n > DESC_SOFT_LIMIT:
        check(results, "description_length", WARN,
              f"description is {n} chars (aim under {DESC_SOFT_LIMIT})")
    else:
        check(results, "description_length", PASS, f"description is {n} chars (<= {DESC_SOFT_LIMIT})")

    # description_third_person
    found = sorted({w for w in PERSON_WORDS if re.search(rf"(?i)\b{re.escape(w)}\b", desc)})
    if found:
        check(results, "description_third_person", WARN,
              f"description uses first/second person: {', '.join(found)}")
    else:
        check(results, "description_third_person", PASS, "description stays third person")

    # description_no_workflow_steps
    low = desc.lower()
    stepy = (("first" in low and "then" in low)
             or re.search(r"\bthen\b.*\bthen\b", low)
             or re.search(r"(?m)^\s*\d+\.", desc)
             or re.search(r":\s*(first\b|step 1|1\.)", low))
    if stepy:
        check(results, "description_no_workflow_steps", WARN,
              "description reads like a workflow (first/then/numbered) — say when to use it, not the steps")
    else:
        check(results, "description_no_workflow_steps", PASS, "description is not a workflow list")

    # hard_command_density
    count = sum(len(re.findall(rf"\b{re.escape(tok)}\b", body)) for tok in HARD_TOKENS)
    if count > HARD_COMMAND_LIMIT:
        check(results, "hard_command_density", WARN,
              f"{count} hard-command tokens (MUST/ALWAYS/NEVER…) — prefer reasons or decision rules")
    else:
        check(results, "hard_command_density", PASS,
              f"{count} hard-command tokens (<= {HARD_COMMAND_LIMIT})")

    # dead_references
    md_files = [skill_md]
    refs_dir = os.path.join(skill_dir, "references")
    if os.path.isdir(refs_dir):
        md_files += [os.path.join(refs_dir, f) for f in sorted(os.listdir(refs_dir)) if f.endswith(".md")]
    missing = []
    for mf in md_files:
        try:
            with open(mf, "r", encoding="utf-8") as fh:
                mt = fh.read()
        except OSError:
            continue
        base = os.path.dirname(mf)
        for tgt in find_local_links(mt):
            if not os.path.exists(os.path.join(base, tgt)):
                missing.append(f"{os.path.basename(mf)} → {tgt}")
    if missing:
        shown = "; ".join(missing[:5]) + ("…" if len(missing) > 5 else "")
        check(results, "dead_references", FAIL, f"broken local links: {shown}")
    else:
        check(results, "dead_references", PASS, "all local links resolve")

    total = len(results)
    passed = sum(1 for r in results if r["result"] == PASS)
    percent = round(100 * passed / total) if total else 0
    return {"skill_md": skill_md, "checks": results,
            "passed": passed, "total": total, "authoring_percent": percent}


def main(argv=None):
    ap = argparse.ArgumentParser(description="Lint a skill's SKILL.md for mechanical authoring anti-patterns.")
    ap.add_argument("target", help="Path to SKILL.md or a skill directory")
    ap.add_argument("--json", action="store_true", help="Emit JSON instead of a table")
    args = ap.parse_args(argv)

    path = resolve(args.target)
    if not os.path.isfile(path):
        print(f"error: SKILL.md not found at {path}", file=sys.stderr)
        return 2

    report = validate(path)
    if args.json:
        print(json.dumps(report, indent=2))
        return 0

    width = max(len(r["check"]) for r in report["checks"])
    print(f"Authoring lint — {path}\n")
    for r in report["checks"]:
        print(f"  {r['result']:<7} {r['check']:<{width}}  {r['message']}")
    print(f"\nAuthoring: {report['passed']}/{report['total']} passed ({report['authoring_percent']}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
