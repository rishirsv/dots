#!/usr/bin/env python3
"""Run every deterministic task in this folder and report a combined pass-rate.

This is the **Verify-tests runner**. Verify (and the Judge Review, to fill the
deterministic third of the Overall Quality Score) calls:

    python3 scripts/run.py <path-to-SKILL.md | skill-dir> [--json]

A "deterministic task" is any `*.py` in this folder except `run.py` and files
starting with `_`. A task must accept the same arguments and, with `--json`,
print a JSON object containing integer `passed` and `total`. `validate_skill.py`
is one such task; add more by dropping in another conforming script.

Verify-tests % = total passed / total checks across all tasks. It is one of the
three thirds of the Overall Quality Score (see ../references/rubric.md). Exit
code is 0 unless no tasks were found.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def discover_tasks():
    return [
        os.path.join(HERE, fn)
        for fn in sorted(os.listdir(HERE))
        if fn.endswith(".py") and fn != "run.py" and not fn.startswith("_")
    ]


def run_task(task_path, target):
    name = os.path.splitext(os.path.basename(task_path))[0]
    proc = subprocess.run(
        [sys.executable, task_path, target, "--json"],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        return {"task": name, "passed": 0, "total": 0,
                "error": (proc.stderr or proc.stdout).strip()}
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return {"task": name, "passed": 0, "total": 0,
                "error": "task did not emit valid JSON with --json"}
    return {"task": name,
            "passed": int(data.get("passed", 0)),
            "total": int(data.get("total", 0))}


def main(argv=None):
    ap = argparse.ArgumentParser(description="Run deterministic Verify tests for a skill.")
    ap.add_argument("target", help="Path to SKILL.md or a skill directory")
    ap.add_argument("--json", action="store_true", help="Emit JSON instead of a table")
    args = ap.parse_args(argv)

    tasks = discover_tasks()
    if not tasks:
        print("error: no deterministic tasks found in scripts/", file=sys.stderr)
        return 2

    results = [run_task(t, args.target) for t in tasks]
    passed = sum(r["passed"] for r in results)
    total = sum(r["total"] for r in results)
    percent = round(100 * passed / total) if total else 0
    report = {"target": args.target, "tasks": results,
              "passed": passed, "total": total, "verify_tests_percent": percent}

    if args.json:
        print(json.dumps(report, indent=2))
        return 0

    print(f"Verify tests — {args.target}\n")
    for r in results:
        line = f"  {r['task']:<20} {r['passed']}/{r['total']}"
        if r.get("error"):
            line += f"  ERROR: {r['error']}"
        print(line)
    print(f"\nVerify tests: {passed}/{total} passed ({percent}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
