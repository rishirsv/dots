#!/usr/bin/env python3
"""
Run a single E2E case definition.

Usage:
    python3 scripts/e2e_run_case.py --case e2e/cases/dental-realistic-36m.json
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent


def run_cmd(cmd):
    print(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def main():
    parser = argparse.ArgumentParser(description="Run one E2E data room case")
    parser.add_argument("--case", required=True, help="Path to case JSON")
    parser.add_argument("--output-root", default=str(PROJECT_DIR / "output" / "e2e"), help="E2E output root")
    args = parser.parse_args()

    case_path = Path(args.case)
    if not case_path.exists():
        print(f"Error: Case file not found: {case_path}")
        sys.exit(1)

    with open(case_path) as f:
        case = json.load(f)

    required = ["case_id", "industry", "size", "realism_mode"]
    missing = [k for k in required if k not in case]
    if missing:
        print(f"Error: Missing required case fields: {', '.join(missing)}")
        sys.exit(1)

    cmd = [
        sys.executable,
        str(SCRIPT_DIR / "run_data_room.py"),
        "--industry", case["industry"],
        "--size", case["size"],
        "--realism-mode", case["realism_mode"],
        "--run-id", case["case_id"],
        "--output-root", str(Path(args.output_root)),
    ]

    if "seed" in case and case["seed"] is not None:
        cmd.extend(["--seed", str(case["seed"])])
    if case.get("name"):
        cmd.extend(["--name", case["name"]])
    if case.get("start_period") and case.get("end_period"):
        cmd.extend(["--start-period", case["start_period"], "--end-period", case["end_period"]])
    if case.get("strict"):
        cmd.append("--strict")

    run_cmd(cmd)

    run_dir = Path(args.output_root) / case["case_id"]
    report_path = run_dir / "verification_report.json"
    summary_path = run_dir / "run-summary.json"
    if report_path.exists():
        with open(report_path) as f:
            report = json.load(f)
        summary = {
            "case_id": case["case_id"],
            "industry": case["industry"],
            "size": case["size"],
            "realism_mode": case["realism_mode"],
            "status": report.get("status"),
            "failed_checks": report.get("summary", {}).get("failed"),
            "qoe_issues": report.get("summary", {}).get("qoe_issues"),
            "output_dir": str(run_dir),
        }
        with open(summary_path, "w") as f:
            json.dump(summary, f, indent=2)
        print(f"✓ Summary written: {summary_path}")


if __name__ == "__main__":
    main()
