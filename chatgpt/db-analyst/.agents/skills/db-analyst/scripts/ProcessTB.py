#!/usr/bin/env python3
"""Run end-to-end Process-TB pipeline."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def _run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def _resolve_scale(units: str, scale_arg: float | None, allow_actual: bool) -> float:
    if scale_arg is not None:
        scale = float(scale_arg)
    elif units == "$'000":
        scale = 0.001
    elif units == "$mm":
        scale = 0.000001
    else:
        scale = 1.0

    if (units == "$" or scale >= 1.0) and not allow_actual:
        raise SystemExit(
            "Actual-value output is blocked by default. Use thousands/millions or pass --allow-actual explicitly."
        )
    return scale


def main() -> int:
    parser = argparse.ArgumentParser(description="Process TB input into mapped IS/BS outputs and workbook.")
    parser.add_argument("--tb", required=True, help="Source TB file (.csv/.xlsx).")
    parser.add_argument("--mapping", required=True, help="COA mapping CSV path.")
    parser.add_argument("--out-tb", required=True, help="Canonical normalized TB CSV output path.")
    parser.add_argument("--out-mapped", required=True, help="Mapped TB CSV output path.")
    parser.add_argument("--out-is", required=True, help="IS trend CSV output path.")
    parser.add_argument("--out-bs", required=True, help="BS trend CSV output path.")
    parser.add_argument("--qc-report", required=True, help="QC report JSON output path.")
    parser.add_argument("--out-workbook", help="Optional final workbook output path.")
    parser.add_argument("--template", help="Template workbook path for --out-workbook builds.")
    parser.add_argument("--scope", choices=["fs-only", "full"], default="fs-only")
    parser.add_argument("--sheet", help="Optional sheet name when TB input is XLSX.")
    parser.add_argument("--entity", default="Entity 1", help="Default entity for missing source entity.")
    parser.add_argument(
        "--include-derived",
        action="store_true",
        help="Include derived total/variance columns from wide TB input.",
    )
    parser.add_argument(
        "--scale",
        type=float,
        default=None,
        help="Optional explicit scale override. If omitted, scale is derived from --units.",
    )
    parser.add_argument(
        "--units",
        choices=["$'000", "$mm", "$"],
        default="$'000",
        help="Units label for workbook output. '$' is actual values and requires --allow-actual.",
    )
    parser.add_argument(
        "--allow-actual",
        action="store_true",
        help="Required to allow actual-value output (scale >= 1).",
    )
    args = parser.parse_args()

    scale = _resolve_scale(args.units, args.scale, args.allow_actual)

    root = Path(__file__).resolve().parent
    py = sys.executable

    ingest_cmd = [
        py,
        str(root / "ingest_tb.py"),
        "--input",
        args.tb,
        "--output",
        args.out_tb,
        "--entity",
        args.entity,
        "--scale",
        str(scale),
    ]
    if args.sheet:
        ingest_cmd.extend(["--sheet", args.sheet])
    if args.include_derived:
        ingest_cmd.append("--include-derived")
    _run(ingest_cmd)

    _run(
        [
            py,
            str(root / "apply_coa_mapping.py"),
            "--tb",
            args.out_tb,
            "--mapping",
            args.mapping,
            "--output",
            args.out_mapped,
        ]
    )

    _run(
        [
            py,
            str(root / "build_is_trend.py"),
            "--input",
            args.out_mapped,
            "--statement",
            "IS",
            "--output",
            args.out_is,
        ]
    )
    _run(
        [
            py,
            str(root / "build_is_trend.py"),
            "--input",
            args.out_mapped,
            "--statement",
            "BS",
            "--output",
            args.out_bs,
        ]
    )

    qc_cmd = [
        py,
        str(root / "run_qc_checks.py"),
        "--tb",
        args.out_tb,
        "--mapped",
        args.out_mapped,
        "--is-trend",
        args.out_is,
        "--bs-trend",
        args.out_bs,
        "--report",
        args.qc_report,
    ]
    _run(qc_cmd)

    if args.out_workbook:
        template = args.template or str((root.parent / "assets" / "databook-template-v2.xlsx").resolve())
        build_cmd = [
            py,
            str(root / "build_fs_workbook.py"),
            "--template",
            template,
            "--tb",
            args.out_tb,
            "--mapped",
            args.out_mapped,
            "--is-trend",
            args.out_is,
            "--bs-trend",
            args.out_bs,
            "--qc-report",
            args.qc_report,
            "--output",
            args.out_workbook,
            "--scope",
            args.scope,
            "--source-label",
            Path(args.tb).name,
            "--units",
            args.units,
            "--scale",
            str(scale),
        ]
        _run(build_cmd)
        qc_with_wb = list(qc_cmd)
        qc_with_wb.extend(["--workbook", args.out_workbook])
        if args.scope == "fs-only":
            qc_with_wb.extend(
                [
                    "--expected-sheets",
                    "Control | Setup,Data | TB,Map | COA to Lines,Combined | IS,Combined | BS,Control | QC",
                ]
            )
        _run(qc_with_wb)

    print(f"Wrote normalized TB: {args.out_tb}")
    print(f"Wrote mapped TB: {args.out_mapped}")
    print(f"Wrote IS trend: {args.out_is}")
    print(f"Wrote BS trend: {args.out_bs}")
    print(f"Wrote QC report: {args.qc_report}")
    if args.out_workbook:
        print(f"Wrote workbook: {args.out_workbook}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
