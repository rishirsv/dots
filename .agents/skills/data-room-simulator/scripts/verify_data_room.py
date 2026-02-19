#!/usr/bin/env python3
"""
Data Room Verification Script for M&A Data Room Simulator.

Validates all cross-document consistency:
- Universal checks (TB balance, BS equation, payroll tie, AR/AP aging)
- Industry-specific checks (MRR, WIP, inventory, etc.)
- QoE issue detection (for Realistic/Messy modes)

Usage:
    python verify_data_room.py [--seed-file path/to/company_seed.json]
"""

import argparse
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd

# Constants
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PROFILES_DIR = PROJECT_DIR / "profiles"
OUTPUT_DIR = PROJECT_DIR / "output"
RUNTIME_OUTPUT_DIR = OUTPUT_DIR


def load_seed(seed_path: Path) -> dict:
    """Load company seed from JSON file."""
    with open(seed_path) as f:
        return json.load(f)


def load_profile(industry: str) -> dict:
    """Load industry profile from JSON file."""
    profile_path = PROFILES_DIR / f"{industry}.json"
    with open(profile_path) as f:
        return json.load(f)


def load_excel(filename: str) -> pd.DataFrame:
    """Load Excel file from output directory."""
    path = RUNTIME_OUTPUT_DIR / filename
    if not path.exists():
        return None
    return pd.read_excel(path)


def identify_compensation_accounts(profile: dict) -> List[str]:
    """Identify likely payroll-related account codes."""
    keywords = ["salary", "payroll", "compensation", "staff", "labor", "wage", "hygiene", "provider"]
    coa = profile.get("chart_of_accounts", {})
    codes = []
    for section in ["cogs", "opex"]:
        for acct in coa.get(section, []):
            name = acct.get("name", "").lower()
            if any(k in name for k in keywords):
                code = acct.get("code")
                if code:
                    codes.append(code)
    return codes


def file_sha256(path: Path) -> str:
    """Compute SHA256 hash for file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def file_descriptions() -> Dict[str, str]:
    """Known file descriptions for index output."""
    return {
        "company_seed.json": "Core company profile and generation metadata.",
        "trial_balance.xlsx": "Monthly trial balance used as the primary tie-out ledger.",
        "income_statement.xlsx": "Annual income statement derived from trial balance.",
        "balance_sheet.xlsx": "Annual balance sheet snapshots with equation checks.",
        "cash_flow.xlsx": "Annual cash flow statement using indirect method.",
        "ar_aging.xlsx": "Accounts receivable aging schedule.",
        "ap_aging.xlsx": "Accounts payable aging schedule.",
        "nwc_schedule.xlsx": "Monthly net working capital schedule.",
        "fixed_assets.xlsx": "Fixed asset roll-forward schedule.",
        "event_impacts.xlsx": "Monthly event-driven revenue and opex adjustments.",
        "employee_census.xlsx": "Employee-level census with department/title/salary.",
        "payroll_register.xlsx": "Monthly payroll entries by employee.",
        "department_summary.xlsx": "Headcount and salary roll-up by department.",
        "salary_bands.xlsx": "Salary distribution by compensation band.",
        "tenure_analysis.xlsx": "Workforce tenure distribution.",
        "verification_report.json": "Verification checks and QoE issues summary.",
        "cim.md": "Rendered CIM narrative.",
        "company_overview.md": "Rendered company overview narrative.",
        "accounting_policies.md": "Rendered accounting policies narrative.",
        "ebitda_bridge.md": "Rendered EBITDA bridge narrative.",
    }


def write_manifest_and_index(seed: dict, report: dict):
    """Write manifest.json and INDEX.md for the current output directory."""
    descriptions = file_descriptions()
    files = []
    all_files = sorted([
        p for p in RUNTIME_OUTPUT_DIR.rglob("*")
        if p.is_file() and p.name not in {"manifest.json", "INDEX.md"}
    ])

    period_start = None
    period_end = None
    period_count = None
    tb_path = RUNTIME_OUTPUT_DIR / "trial_balance.xlsx"
    if tb_path.exists():
        tb = pd.read_excel(tb_path)
        if len(tb) > 0 and "period" in tb.columns:
            period_start = str(tb.iloc[0]["period"])
            period_end = str(tb.iloc[-1]["period"])
            period_count = int(len(tb))

    for p in all_files:
        entry = {
            "file_name": p.name,
            "relative_path": str(p.relative_to(RUNTIME_OUTPUT_DIR)),
            "size_bytes": p.stat().st_size,
            "sha256": file_sha256(p),
            "description": descriptions.get(p.name, "Generated artifact."),
        }
        if p.suffix.lower() in {".xlsx", ".csv"}:
            try:
                if p.suffix.lower() == ".xlsx":
                    row_count = len(pd.read_excel(p))
                else:
                    row_count = len(pd.read_csv(p))
                entry["rows"] = int(row_count)
            except Exception:
                pass
        files.append(entry)

    manifest = {
        "generated_at": datetime.now().isoformat(),
        "run_id": RUNTIME_OUTPUT_DIR.name,
        "output_dir": str(RUNTIME_OUTPUT_DIR),
        "company": seed["company"]["name"],
        "industry": seed["metadata"]["industry"],
        "realism_mode": seed["metadata"]["realism_mode"],
        "verification_status": report["status"],
        "verification_failed_checks": report["summary"]["failed"],
        "period_start": period_start,
        "period_end": period_end,
        "period_count": period_count,
        "files": files,
    }
    with open(RUNTIME_OUTPUT_DIR / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)

    lines = [
        f"# {seed['company']['name']} Data Room Index",
        "",
        "## Overview",
        f"- Industry: `{seed['metadata']['industry']}`",
        f"- Realism mode: `{seed['metadata']['realism_mode']}`",
        f"- Verification status: `{report['status']}`",
        f"- Failed checks: `{report['summary']['failed']}`",
    ]
    if period_start and period_end and period_count is not None:
        lines.append(f"- Period coverage: `{period_start}` to `{period_end}` (`{period_count}` months)")
    lines.extend(["", "## Files"])
    for entry in files:
        row_text = f" ({entry['rows']} rows)" if "rows" in entry else ""
        display_name = entry["relative_path"]
        lines.append(f"- `{display_name}`: {entry['description']}{row_text}")
    lines.append("")

    with open(RUNTIME_OUTPUT_DIR / "INDEX.md", "w") as f:
        f.write("\n".join(lines))


class Check:
    """Represents a single verification check."""

    def __init__(self, name: str, description: str, passed: bool, details: str = ""):
        self.name = name
        self.description = description
        self.passed = passed
        self.details = details

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "passed": bool(self.passed),  # Ensure native Python bool
            "details": self.details,
        }


def run_universal_checks(seed: dict) -> List[Check]:
    """Run checks that apply to all industries."""

    checks = []

    # Load files
    tb = load_excel("trial_balance.xlsx")
    is_df = load_excel("income_statement.xlsx")
    bs = load_excel("balance_sheet.xlsx")
    cf = load_excel("cash_flow.xlsx")
    ar_aging = load_excel("ar_aging.xlsx")
    ap_aging = load_excel("ap_aging.xlsx")
    employees = load_excel("employee_census.xlsx")
    payroll = load_excel("payroll_register.xlsx")

    # Check 1: Trial Balance Exists
    if tb is None:
        checks.append(Check(
            "trial_balance_exists",
            "Trial balance file exists",
            False,
            "trial_balance.xlsx not found"
        ))
        return checks

    checks.append(Check(
        "trial_balance_exists",
        "Trial balance file exists",
        True,
        f"{len(tb)} periods"
    ))

    # Check 1b: Monthly accounting identity in TB snapshots.
    if {"total_assets", "total_liabilities", "total_equity"}.issubset(tb.columns):
        max_diff = 0
        for _, row in tb.iterrows():
            period_diff = abs(float(row["total_assets"]) - float(row["total_liabilities"]) - float(row["total_equity"]))
            max_diff = max(max_diff, period_diff)
        checks.append(Check(
            "trial_balance_balances",
            "Monthly accounting identity in trial balance snapshots (A = L + E)",
            max_diff < 1.0,
            f"Max absolute period imbalance: ${max_diff:,.2f}"
        ))

    # Check 2: Balance Sheet Equation (A = L + E)
    if bs is not None:
        for _, row in bs.iterrows():
            year = row["year"]
            assets = row["total_assets"]
            liabilities = row["total_liabilities"]
            equity = row["total_equity"]
            diff = abs(assets - liabilities - equity)

            if diff > 1:
                checks.append(Check(
                    f"bs_equation_{year}",
                    f"Balance sheet equation (A = L + E) for {year}",
                    False,
                    f"Assets: ${assets:,.0f}, L+E: ${liabilities + equity:,.0f}, Diff: ${diff:,.0f}"
                ))
            else:
                checks.append(Check(
                    f"bs_equation_{year}",
                    f"Balance sheet equation (A = L + E) for {year}",
                    True,
                    f"Assets = ${assets:,.0f}"
                ))

    # Check 3: Income Statement Revenue Consistency
    if is_df is not None and tb is not None:
        for _, row in is_df.iterrows():
            year = row["year"]
            is_revenue = row["revenue"]

            tb_year = tb[tb["year"] == year]
            tb_revenue = tb_year["total_revenue"].sum()

            diff_pct = abs(is_revenue - tb_revenue) / is_revenue * 100 if is_revenue > 0 else 0

            checks.append(Check(
                f"revenue_consistency_{year}",
                f"Revenue consistency between IS and TB for {year}",
                diff_pct < 0.1,
                f"IS: ${is_revenue:,.0f}, TB: ${tb_revenue:,.0f}"
            ))

    # Check 4: AR Aging Ties to Balance Sheet
    if ar_aging is not None and bs is not None:
        ar_aging_total = ar_aging[ar_aging["bucket"] == "Total"]["amount"].iloc[0]
        bs_ar = bs.iloc[-1]["accounts_receivable"]

        diff_pct = abs(ar_aging_total - bs_ar) / bs_ar * 100 if bs_ar > 0 else 0

        checks.append(Check(
            "ar_aging_tie",
            "AR aging total ties to balance sheet AR",
            diff_pct < 1,
            f"Aging: ${ar_aging_total:,.0f}, BS: ${bs_ar:,.0f}"
        ))

    # Check 5: AP Aging Ties to Balance Sheet
    if ap_aging is not None and bs is not None:
        ap_aging_total = ap_aging[ap_aging["bucket"] == "Total"]["amount"].iloc[0]
        bs_ap = bs.iloc[-1]["accounts_payable"]

        diff_pct = abs(ap_aging_total - bs_ap) / bs_ap * 100 if bs_ap > 0 else 0

        checks.append(Check(
            "ap_aging_tie",
            "AP aging total ties to balance sheet AP",
            diff_pct < 1,
            f"Aging: ${ap_aging_total:,.0f}, BS: ${bs_ap:,.0f}"
        ))

    # Check 6: Headcount Tie
    if employees is not None:
        target_headcount = seed["financials"]["headcount"]
        actual_headcount = len(employees)

        checks.append(Check(
            "headcount_tie",
            "Employee headcount matches company seed",
            abs(target_headcount - actual_headcount) <= 3,
            f"Target: {target_headcount}, Actual: {actual_headcount}"
        ))

    # Check 7: Cash flow ending cash ties to balance sheet cash
    if cf is not None and bs is not None:
        all_pass = True
        details = []
        for _, row in cf.iterrows():
            year = row["year"]
            cf_cash = float(row["ending_cash"])
            bs_row = bs[bs["year"] == year]
            if len(bs_row) == 0:
                continue
            bs_cash = float(bs_row.iloc[0]["cash"])
            diff = abs(cf_cash - bs_cash)
            if diff > 1:
                all_pass = False
            details.append(f"{int(year)} diff=${diff:,.2f}")
        checks.append(Check(
            "cash_flow_ending_cash_tie",
            "Cash flow ending cash ties to balance sheet cash",
            all_pass,
            "; ".join(details[:5])
        ))

    # Check 8: Net income ties to change in retained earnings
    if is_df is not None and bs is not None and len(bs) > 1:
        all_pass = True
        details = []
        years = sorted(bs["year"].unique())
        for idx in range(1, len(years)):
            year = years[idx]
            prev_year = years[idx - 1]
            re_now = float(bs[bs["year"] == year].iloc[0]["retained_earnings"])
            re_prev = float(bs[bs["year"] == prev_year].iloc[0]["retained_earnings"])
            ni = float(is_df[is_df["year"] == year].iloc[0]["net_income"])
            diff = abs((re_now - re_prev) - ni)
            if diff > 1:
                all_pass = False
            details.append(f"{int(year)} diff=${diff:,.2f}")
        checks.append(Check(
            "net_income_retained_earnings_tie",
            "Income statement net income ties to change in retained earnings",
            all_pass,
            "; ".join(details[:5])
        ))

    # Check 9: Payroll ties to payroll-linked financial accounts
    if payroll is not None:
        profile = load_profile(seed["metadata"]["industry"])
        compensation_codes = identify_compensation_accounts(profile)
        target_total = 0.0
        for code in compensation_codes:
            col = f"acct_{code}"
            if col in tb.columns:
                target_total += float(tb[col].sum())
        payroll_total = float(payroll["total_cost"].sum()) if "total_cost" in payroll.columns else 0.0
        if target_total > 0:
            diff_pct = abs(payroll_total - target_total) / target_total * 100
            checks.append(Check(
                "payroll_financial_tie",
                "Payroll totals tie to payroll-linked financial accounts",
                diff_pct < 5.0,
                f"Payroll: ${payroll_total:,.0f}, Financial: ${target_total:,.0f}, Diff: {diff_pct:.2f}%"
            ))

    # Check 10: Rendered narratives have no unresolved template tokens
    for narrative in ["cim.md", "company_overview.md", "accounting_policies.md", "ebitda_bridge.md"]:
        path = RUNTIME_OUTPUT_DIR / narrative
        if path.exists():
            content = path.read_text(encoding="utf-8")
            unresolved = ("{{" in content) or ("{%" in content)
            checks.append(Check(
                f"narrative_tokens_{narrative}",
                f"{narrative} has no unresolved template tokens",
                not unresolved,
                "Unresolved template syntax found" if unresolved else "No unresolved template syntax"
            ))

    return checks


def run_saas_checks(seed: dict, profile: dict) -> List[Check]:
    """Run SaaS-specific checks."""

    checks = []

    mrr = load_excel("mrr_analysis.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if mrr is None or tb is None:
        return checks

    # Check: MRR ties to revenue
    for _, mrr_row in mrr.iterrows():
        period = mrr_row["period"]
        mrr_revenue = mrr_row["total_mrr"]

        tb_row = tb[tb["period"] == period]
        if len(tb_row) > 0:
            tb_revenue = tb_row.iloc[0]["total_revenue"]
            diff_pct = abs(mrr_revenue - tb_revenue) / tb_revenue * 100 if tb_revenue > 0 else 0

            # Just check a few periods
            if period.endswith("-12"):  # December
                checks.append(Check(
                    f"mrr_revenue_tie_{period}",
                    f"MRR ties to P&L revenue for {period}",
                    diff_pct < 0.1,
                    f"MRR: ${mrr_revenue:,.0f}, P&L: ${tb_revenue:,.0f}"
                ))

    # Check: ARR calculation
    latest_mrr = mrr.iloc[-1]["total_mrr"]
    latest_arr = mrr.iloc[-1]["arr"]
    expected_arr = latest_mrr * 12

    checks.append(Check(
        "arr_calculation",
        "ARR = MRR × 12",
        abs(latest_arr - expected_arr) < 1,
        f"MRR: ${latest_mrr:,.0f}, ARR: ${latest_arr:,.0f}"
    ))

    return checks


def run_construction_checks(seed: dict, profile: dict) -> List[Check]:
    """Run construction-specific checks."""

    checks = []

    wip = load_excel("wip_schedule.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if wip is None or tb is None:
        return checks

    # Check: WIP revenue ties to P&L
    total_wip_revenue = wip["revenue_recognized"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_wip_revenue - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "wip_revenue_tie",
        "WIP revenue recognized ties to P&L",
        diff_pct < 0.1,
        f"WIP: ${total_wip_revenue:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_manufacturing_checks(seed: dict, profile: dict) -> List[Check]:
    """Run manufacturing-specific checks."""

    checks = []

    invoices = load_excel("invoice_register.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if invoices is None or tb is None:
        return checks

    # Check: Invoice totals tie to revenue
    total_invoices = invoices["amount"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_invoices - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "invoice_revenue_tie",
        "Invoice totals tie to P&L revenue",
        diff_pct < 0.1,
        f"Invoices: ${total_invoices:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_services_checks(seed: dict, profile: dict) -> List[Check]:
    """Run professional services-specific checks."""

    checks = []

    wip = load_excel("wip_schedule.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if wip is None or tb is None:
        return checks

    # Check: Billed revenue ties to P&L
    total_billed = wip["billed_revenue"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_billed - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "billed_revenue_tie",
        "Billed revenue ties to P&L",
        diff_pct < 0.1,
        f"Billed: ${total_billed:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_dental_checks(seed: dict, profile: dict) -> List[Check]:
    """Run dental-specific checks."""

    checks = []

    production = load_excel("provider_production_monthly.xlsx")
    insurance_ar = load_excel("insurance_ar_aging.xlsx")
    utilization = load_excel("appointment_utilization_monthly.xlsx")
    tb = load_excel("trial_balance.xlsx")
    bs = load_excel("balance_sheet.xlsx")

    if production is not None and tb is not None:
        total_collections = production["total_collections"].sum()
        total_tb_revenue = tb["total_revenue"].sum()
        diff_pct = abs(total_collections - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

        checks.append(Check(
            "dental_collections_revenue_tie",
            "Dental total collections tie to P&L revenue",
            diff_pct < 0.1,
            f"Collections: ${total_collections:,.0f}, P&L: ${total_tb_revenue:,.0f}"
        ))

        hygiene_pph_kpi = profile.get("kpis", {}).get("hygiene_production_per_hour", {})
        kpi_min = hygiene_pph_kpi.get("min", 100)
        kpi_max = hygiene_pph_kpi.get("max", 250)
        avg_hygiene_pph = production["hygiene_production_per_hour"].mean()

        checks.append(Check(
            "dental_hygiene_pph_range",
            "Average hygiene production per hour is within configured range",
            kpi_min <= avg_hygiene_pph <= kpi_max,
            f"Avg: ${avg_hygiene_pph:,.1f}, Expected: ${kpi_min:,.0f}-${kpi_max:,.0f}"
        ))

    if utilization is not None:
        utilization_kpi = profile.get("kpis", {}).get("schedule_utilization", {})
        util_min = utilization_kpi.get("min", 0.70) * 100
        util_max = utilization_kpi.get("max", 0.97) * 100
        avg_util = utilization["utilization_pct"].mean()

        checks.append(Check(
            "dental_utilization_range",
            "Average schedule utilization is within configured range",
            util_min <= avg_util <= util_max,
            f"Avg: {avg_util:.1f}%, Expected: {util_min:.1f}% - {util_max:.1f}%"
        ))

    if insurance_ar is not None and bs is not None:
        total_row = insurance_ar[insurance_ar["bucket"] == "Total"]
        if len(total_row) > 0:
            aging_total = total_row.iloc[0]["total_amount"]
            bs_ar = bs.iloc[-1]["accounts_receivable"]
            diff_pct = abs(aging_total - bs_ar) / bs_ar * 100 if bs_ar > 0 else 0

            checks.append(Check(
                "dental_insurance_ar_tie",
                "Insurance AR aging total ties to balance sheet AR",
                diff_pct < 0.1,
                f"Aging: ${aging_total:,.0f}, BS: ${bs_ar:,.0f}"
            ))

    return checks


def run_retail_checks(seed: dict, profile: dict) -> List[Check]:
    """Run retail-specific checks."""

    checks = []

    transactions = load_excel("sales_transactions.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if transactions is None or tb is None:
        return checks

    # Check: Transaction totals tie to revenue
    total_transactions = transactions["amount"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_transactions - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "transaction_revenue_tie",
        "Sales transaction totals tie to P&L revenue",
        diff_pct < 0.1,
        f"Transactions: ${total_transactions:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_qoe_checks(seed: dict, profile: dict) -> List[dict]:
    """Detect QoE issues (for Realistic/Messy modes)."""

    issues = []
    realism_mode = seed["metadata"]["realism_mode"]

    if realism_mode == "clean":
        return issues

    # Check events for one-time items
    events = seed.get("events", [])
    for event in events:
        if event.get("one_time"):
            issues.append({
                "type": "one_time_event",
                "date": event["date"],
                "description": event["description"],
                "impact": event.get("financial_impact", 0),
                "category": event["type"],
            })

    # Check for customer losses
    customer_losses = [e for e in events if e.get("type") == "customer_loss"]
    if customer_losses:
        issues.append({
            "type": "customer_churn",
            "description": f"{len(customer_losses)} customer losses identified",
            "total_impact": sum(e.get("revenue_impact", 0) for e in customer_losses),
            "category": "revenue_risk",
        })

    # Industry-specific QoE flags from profile
    qoe_adjustments = profile.get("qoe_adjustments", {})

    if realism_mode in ["realistic", "messy"]:
        for adj in qoe_adjustments.get("common", []):
            issues.append({
                "type": "potential_adjustment",
                "description": adj,
                "category": "qoe_common",
            })

        for adj in qoe_adjustments.get("owner_addbacks", []):
            issues.append({
                "type": "owner_addback",
                "description": adj,
                "category": "qoe_addback",
            })

    return issues


def main():
    parser = argparse.ArgumentParser(
        description="Verify data room consistency"
    )
    parser.add_argument(
        "--seed-file",
        help="Path to company seed JSON file (default: <output-dir>/company_seed.json)"
    )
    parser.add_argument(
        "--output",
        default="verification_report.json",
        help="Output file for verification report"
    )
    parser.add_argument(
        "--output-dir",
        default=str(OUTPUT_DIR),
        help="Directory for generated outputs (default: output/)"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat messy-mode QoE issues as run-failing"
    )

    args = parser.parse_args()

    # Load seed
    global RUNTIME_OUTPUT_DIR
    RUNTIME_OUTPUT_DIR = Path(args.output_dir)

    seed_path = Path(args.seed_file) if args.seed_file else (RUNTIME_OUTPUT_DIR / "company_seed.json")
    if not seed_path.exists():
        print(f"Error: Seed file not found: {seed_path}")
        exit(1)

    seed = load_seed(seed_path)
    industry = seed["metadata"]["industry"]
    profile = load_profile(industry)

    print(f"Verifying data room for {seed['company']['name']}...")
    print(f"  Industry: {profile['display_name']}")
    print(f"  Realism Mode: {seed['metadata']['realism_mode']}")
    print()

    # Run checks
    all_checks = []

    print("Running universal checks...")
    all_checks.extend(run_universal_checks(seed))

    print(f"Running {industry} industry checks...")
    industry_checks = {
        "saas": run_saas_checks,
        "construction": run_construction_checks,
        "manufacturing": run_manufacturing_checks,
        "professional_services": run_services_checks,
        "dental": run_dental_checks,
        "retail": run_retail_checks,
    }

    if industry in industry_checks:
        all_checks.extend(industry_checks[industry](seed, profile))

    # Run QoE checks
    print("Checking for QoE issues...")
    qoe_issues = run_qoe_checks(seed, profile)

    # Build report
    passed_checks = [c for c in all_checks if c.passed]
    failed_checks = [c for c in all_checks if not c.passed]

    messy_strict_failure = args.strict and seed["metadata"]["realism_mode"] == "messy" and len(qoe_issues) > 0
    status = "pass" if (len(failed_checks) == 0 and not messy_strict_failure) else "fail"

    report = {
        "generated_at": datetime.now().isoformat(),
        "company": seed["company"]["name"],
        "industry": industry,
        "realism_mode": seed["metadata"]["realism_mode"],
        "status": status,
        "summary": {
            "total_checks": len(all_checks),
            "passed": len(passed_checks),
            "failed": len(failed_checks),
            "qoe_issues": len(qoe_issues),
            "strict_mode": bool(args.strict),
            "messy_strict_failure": bool(messy_strict_failure),
        },
        "checks": [c.to_dict() for c in all_checks],
        "qoe_issues": qoe_issues,
        "issues": qoe_issues,
        "output_dir": str(RUNTIME_OUTPUT_DIR),
        "rule_coverage": {
            "universal_checks": True,
            "industry_specific_checks": True,
            "qoe_checks": True,
        },
    }

    # Save report
    output_path = Path(args.output)
    if not output_path.is_absolute():
        output_path = RUNTIME_OUTPUT_DIR / output_path
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)

    write_manifest_and_index(seed, report)

    # Print results
    print()
    print("=" * 60)
    print("VERIFICATION RESULTS")
    print("=" * 60)
    print()

    print(f"  Total Checks: {len(all_checks)}")
    print(f"  Passed: {len(passed_checks)}")
    print(f"  Failed: {len(failed_checks)}")
    print()

    if failed_checks:
        print("FAILED CHECKS:")
        for check in failed_checks:
            print(f"  ✗ {check.name}: {check.description}")
            print(f"    {check.details}")
        print()

    if qoe_issues:
        print(f"QoE ISSUES DETECTED ({len(qoe_issues)}):")
        for issue in qoe_issues[:10]:  # Show first 10
            print(f"  ⚠ {issue['type']}: {issue['description']}")
        if len(qoe_issues) > 10:
            print(f"  ... and {len(qoe_issues) - 10} more")
        print()

    if report["status"] == "pass":
        print("✓ All checks PASSED")
    else:
        print("✗ Some checks FAILED")

    print()
    print(f"Full report saved to: {output_path}")


if __name__ == "__main__":
    main()
