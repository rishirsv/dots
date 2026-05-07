#!/usr/bin/env python3
"""Build the Autoresearch run-review site for the ``autoresearch`` skill.

This uses the portable generator and shell that ship inside this skill bundle.
Output lands under ``tests/plugin-eval/site/`` only when the caller points it
there explicitly.

Usage:
    python skills/autoresearch/scripts/build_run_review.py [--out <dir>]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

THIS = Path(__file__).resolve()
REPO_ROOT = THIS.parents[3]
SCRIPT_DIR = THIS.parent
sys.path.insert(0, str(SCRIPT_DIR))

from run_review_generator import build_site  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, default=REPO_ROOT / "tests" / "plugin-eval" / "site",
                    help="Output directory for the generated site.")
    ap.add_argument("--benchmark-run", type=Path,
                    help="Optional explicit benchmark-run.json path for this skill.")
    ap.add_argument("--observed-usage", type=Path,
                    help="Optional explicit observed-usage.jsonl path for this skill.")
    ap.add_argument("--combined", action="store_true",
                    help="Also include skill-autoresearch runs in the same site.")
    args = ap.parse_args()

    skills = ["autoresearch"]
    if args.combined:
        skills.append("skill-autoresearch")

    source_specs = {}
    if args.benchmark_run or args.observed_usage:
        source_specs["autoresearch"] = {
            "benchmark_json": str(args.benchmark_run) if args.benchmark_run else None,
            "usage_log": str(args.observed_usage) if args.observed_usage else None,
        }

    build_site(skills, out_dir=args.out, repo_root=REPO_ROOT, source_specs=source_specs)


if __name__ == "__main__":
    main()
