#!/usr/bin/env python3
"""
Orchestrate end-to-end data room generation with dependency tracking.

Usage:
    python3 scripts/run_data_room.py \\
      --profile path/to/profile.json \\
      --size small|mid|large \\
      --realism-mode clean|realistic|messy \\
      --start-period 2020-01 \\
      --end-period 2024-12 \\
      [--name "Company Name"] \\
      [--seed 42] \\
      [--output-root output/runs] \\
      [--strict]
"""

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DEFAULT_OUTPUT_ROOT = Path.cwd() / "data-room-output" / "runs"

# 12 section directories that must be created
SECTIONS = [
    "1.0-corporate",
    "2.0-financial",
    "3.0-tax",
    "4.0-commercial",
    "5.0-operations",
    "6.0-hr",
    "7.0-technology",
    "8.0-legal",
    "9.0-regulatory",
    "10.0-real-estate",
    "11.0-insurance",
    "12.0-process",
]


def generate_run_id(profile_path: str, size: str, realism_mode: str) -> str:
    """Generate run ID: YYYYMMDD-HHMMSS-{industry}-{size}-{mode}"""
    with open(profile_path) as f:
        profile = json.load(f)
    industry = profile.get("industry", "unknown")

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return f"{stamp}-{industry}-{size}-{realism_mode}"


def run_script(script_name: str, output_dir: Path, profile: str = None,
               extra_args: dict = None, phase_name: str = None):
    """Run a generation script with standard arguments."""
    cmd = [sys.executable, str(SCRIPT_DIR / script_name), "--output-dir", str(output_dir)]

    if profile:
        cmd.extend(["--profile", profile])

    if extra_args:
        for key, value in extra_args.items():
            if value is not None:
                cmd.extend([f"--{key}", str(value)])

    phase_label = f"[{phase_name}] " if phase_name else ""
    print(f"{phase_label}Running: {' '.join(cmd)}")

    try:
        subprocess.run(cmd, check=True)
        print(f"{phase_label}✓ {script_name} completed\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{phase_label}✗ {script_name} failed: {e}\n")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Orchestrate full data room generation workflow"
    )
    parser.add_argument("--profile", required=True, help="Path to profile.json")
    parser.add_argument(
        "--size", required=True, choices=["small", "mid", "large"],
        help="Company size"
    )
    parser.add_argument(
        "--realism-mode", required=True,
        choices=["clean", "realistic", "messy"],
        help="Realism mode"
    )
    parser.add_argument(
        "--start-period", required=True, help="Start period (YYYY-MM)"
    )
    parser.add_argument(
        "--end-period", required=True, help="End period (YYYY-MM)"
    )
    parser.add_argument("--name", help="Optional company name")
    parser.add_argument("--seed", type=int, help="Random seed for reproducibility")
    parser.add_argument(
        "--output-root", default=str(DEFAULT_OUTPUT_ROOT),
        help="Root directory for run outputs"
    )
    parser.add_argument(
        "--strict", action="store_true",
        help="Enable strict verification"
    )

    args = parser.parse_args()

    # Validate profile exists
    profile_path = Path(args.profile)
    if not profile_path.exists():
        print(f"Error: Profile not found: {profile_path}")
        sys.exit(1)

    # Generate run ID and create output directory
    run_id = generate_run_id(str(profile_path), args.size, args.realism_mode)
    output_dir = Path(args.output_root) / run_id
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create all section subdirectories
    for section in SECTIONS:
        (output_dir / section).mkdir(exist_ok=True)

    print(f"Data Room Generation: {run_id}")
    print(f"Output directory: {output_dir}\n")

    # Track failures
    failed_scripts = []

    # Phase 1: Generate deal state
    print("=" * 60)
    print("PHASE 1: Deal State Generation")
    print("=" * 60)
    success = run_script(
        "generate_deal_state.py",
        output_dir,
        profile=str(profile_path),
        extra_args={
            "size": args.size,
            "realism-mode": args.realism_mode,
            "start-period": args.start_period,
            "end-period": args.end_period,
            "name": args.name,
            "seed": args.seed,
        },
        phase_name="Phase 1"
    )
    if not success:
        failed_scripts.append("generate_deal_state.py")

    # Phase 2: Parallel-safe generation (reads deal_state.json)
    print("=" * 60)
    print("PHASE 2: Parallel-Safe Generation")
    print("=" * 60)
    phase2_scripts = [
        "generate_corporate.py",
        "generate_financials.py",
        "generate_tax.py",
        "generate_insurance.py",
        "generate_real_estate.py",
        "generate_technology.py",
        "generate_regulatory.py",
    ]
    for script in phase2_scripts:
        success = run_script(script, output_dir, phase_name="Phase 2")
        if not success:
            failed_scripts.append(script)

    # Phase 3: Depends on financials
    print("=" * 60)
    print("PHASE 3: Commercial & Operations & HR")
    print("=" * 60)
    phase3_scripts = [
        "generate_commercial.py",
        "generate_operations.py",
        "generate_hr_data.py",
    ]
    for script in phase3_scripts:
        success = run_script(script, output_dir, phase_name="Phase 3")
        if not success:
            failed_scripts.append(script)

    # Phase 4: Leases
    print("=" * 60)
    print("PHASE 4: Leases")
    print("=" * 60)
    success = run_script("generate_leases.py", output_dir, phase_name="Phase 4")
    if not success:
        failed_scripts.append("generate_leases.py")

    # Phase 5: Verification (always runs)
    print("=" * 60)
    print("PHASE 5: Verification")
    print("=" * 60)

    cmd = [sys.executable, str(SCRIPT_DIR / "verify_data_room.py"), "--output-dir", str(output_dir)]
    if args.strict:
        cmd.append("--strict")

    phase_label = "[Phase 6] "
    print(f"{phase_label}Running: {' '.join(cmd)}")

    try:
        subprocess.run(cmd, check=True)
        print(f"{phase_label}✓ verify_data_room.py completed\n")
        success = True
    except subprocess.CalledProcessError as e:
        print(f"{phase_label}✗ verify_data_room.py failed: {e}\n")
        success = False

    # Print summary
    print("=" * 60)
    print("FINAL SUMMARY")
    print("=" * 60)

    report_path = output_dir / "verification_report.json"
    status = "unknown"
    failed_checks = "unknown"
    file_counts = {}

    if report_path.exists():
        with open(report_path) as f:
            report = json.load(f)
        status = report.get("status", "unknown")
        failed_checks = report.get("summary", {}).get("failed", 0)
        file_counts = report.get("file_counts", {})

    print(f"Run ID: {run_id}")
    print(f"Status: {status}")
    print(f"Failed checks: {failed_checks}")

    if file_counts:
        print("\nFile counts by section:")
        for section in SECTIONS:
            count = file_counts.get(section, 0)
            print(f"  {section}: {count}")

    if failed_scripts:
        print(f"\nFailed scripts: {', '.join(failed_scripts)}")

    print(f"\nArtifacts: {output_dir}")


if __name__ == "__main__":
    main()
