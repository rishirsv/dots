#!/usr/bin/env python3
"""
Run end-to-end data room generation in one command.

Usage:
    python3 scripts/run_data_room.py --industry dental --size mid --realism-mode realistic
"""

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DEFAULT_RUN_ROOT = PROJECT_DIR / "output" / "runs"


def run_cmd(cmd):
    print(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def default_run_id(industry: str, size: str, realism_mode: str) -> str:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return f"{stamp}-{industry}-{size}-{realism_mode}"


def main():
    parser = argparse.ArgumentParser(description="Run full data room generation workflow")
    parser.add_argument("--industry", required=True, help="Industry profile")
    parser.add_argument("--size", required=True, choices=["small", "mid", "large"], help="Company size")
    parser.add_argument("--realism-mode", required=True, choices=["clean", "realistic", "messy"], help="Realism mode")
    parser.add_argument("--name", help="Optional company name")
    parser.add_argument("--seed", type=int, help="Random seed for reproducibility")
    parser.add_argument("--start-period", help="Optional start period YYYY-MM")
    parser.add_argument("--end-period", help="Optional end period YYYY-MM")
    parser.add_argument("--run-id", help="Optional custom run id")
    parser.add_argument("--output-root", default=str(DEFAULT_RUN_ROOT), help="Root directory for run outputs")
    parser.add_argument("--strict", action="store_true", help="Enable strict verification behavior")
    args = parser.parse_args()

    if (args.start_period and not args.end_period) or (args.end_period and not args.start_period):
        print("Error: Use --start-period and --end-period together.")
        sys.exit(1)

    run_id = args.run_id or default_run_id(args.industry, args.size, args.realism_mode)
    output_dir = Path(args.output_root) / run_id
    output_dir.mkdir(parents=True, exist_ok=True)

    py = sys.executable
    print(f"Running data room generation: {run_id}")
    print(f"Output directory: {output_dir}")

    company_cmd = [
        py, str(SCRIPT_DIR / "generate_company.py"),
        "--industry", args.industry,
        "--size", args.size,
        "--realism-mode", args.realism_mode,
        "--output-dir", str(output_dir),
    ]
    if args.name:
        company_cmd.extend(["--name", args.name])
    if args.seed is not None:
        company_cmd.extend(["--seed", str(args.seed)])
    run_cmd(company_cmd)

    financials_cmd = [
        py, str(SCRIPT_DIR / "generate_financials.py"),
        "--output-dir", str(output_dir),
    ]
    if args.start_period and args.end_period:
        financials_cmd.extend(["--start-period", args.start_period, "--end-period", args.end_period])
    run_cmd(financials_cmd)

    run_cmd([py, str(SCRIPT_DIR / "generate_operations.py"), "--output-dir", str(output_dir)])
    run_cmd([py, str(SCRIPT_DIR / "generate_hr_data.py"), "--output-dir", str(output_dir)])
    run_cmd([py, str(SCRIPT_DIR / "render_narratives.py"), "--output-dir", str(output_dir)])

    verify_cmd = [
        py, str(SCRIPT_DIR / "verify_data_room.py"),
        "--output-dir", str(output_dir),
        "--output", "verification_report.json",
    ]
    if args.strict:
        verify_cmd.append("--strict")
    run_cmd(verify_cmd)

    report_path = output_dir / "verification_report.json"
    status = "unknown"
    failed = "unknown"
    qoe_issues = "unknown"
    if report_path.exists():
        with open(report_path) as f:
            report = json.load(f)
        status = report.get("status", "unknown")
        failed = report.get("summary", {}).get("failed", "unknown")
        qoe_issues = report.get("summary", {}).get("qoe_issues", "unknown")

    print("\nRun complete")
    print(f"  Run ID: {run_id}")
    print(f"  Status: {status}")
    print(f"  Failed checks: {failed}")
    print(f"  QoE issues: {qoe_issues}")
    print(f"  Artifacts: {output_dir}")


if __name__ == "__main__":
    main()
