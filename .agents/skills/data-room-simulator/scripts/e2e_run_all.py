#!/usr/bin/env python3
"""
Run all E2E cases and produce aggregate summary.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent


def run_cmd(cmd):
    subprocess.run(cmd, check=True)


def main():
    parser = argparse.ArgumentParser(description="Run all E2E data room cases")
    parser.add_argument("--cases-dir", default=str(PROJECT_DIR / "e2e" / "cases"), help="Directory containing case JSON files")
    parser.add_argument("--output-root", default=str(PROJECT_DIR / "output" / "e2e"), help="E2E output root")
    args = parser.parse_args()

    cases_dir = Path(args.cases_dir)
    case_files = sorted(cases_dir.glob("*.json"))
    if not case_files:
        print(f"No cases found in {cases_dir}")
        sys.exit(1)

    summaries = []
    for case in case_files:
        print(f"\n=== Running {case.name} ===")
        run_cmd([
            sys.executable,
            str(SCRIPT_DIR / "e2e_run_case.py"),
            "--case", str(case),
            "--output-root", str(Path(args.output_root)),
        ])
        with open(case) as f:
            case_data = json.load(f)
        summary_path = Path(args.output_root) / case_data["case_id"] / "run-summary.json"
        if summary_path.exists():
            with open(summary_path) as f:
                summaries.append(json.load(f))

    aggregate = {
        "total_cases": len(summaries),
        "passed": sum(1 for s in summaries if s.get("status") == "pass"),
        "failed": sum(1 for s in summaries if s.get("status") != "pass"),
        "cases": summaries,
    }

    output_root = Path(args.output_root)
    output_root.mkdir(parents=True, exist_ok=True)
    aggregate_path = output_root / "aggregate-summary.json"
    with open(aggregate_path, "w") as f:
        json.dump(aggregate, f, indent=2)

    print("\nE2E run complete")
    print(f"  Total cases: {aggregate['total_cases']}")
    print(f"  Passed: {aggregate['passed']}")
    print(f"  Failed: {aggregate['failed']}")
    print(f"  Aggregate summary: {aggregate_path}")


if __name__ == "__main__":
    main()
