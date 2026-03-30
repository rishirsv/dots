#!/usr/bin/env python3
"""
Tax Data Generator for M&A Data Room Simulator.

Generates tax-related artifacts:
- Tax provision (years, rates, expenses)
- Depreciation schedule (assets, methods)
- Nexus summary (states with tax presence)

Usage:
    python generate_tax.py --output-dir /path/to/output
"""

import argparse
import json
from datetime import datetime, timedelta
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List

import pandas as pd
from faker import Faker

# Initialize
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent

# State tax rates (simplified)
STATE_TAX_RATES = {
    "CA": 0.0585, "NY": 0.065, "TX": 0.0, "FL": 0.0, "IL": 0.0495,
    "PA": 0.0325, "OH": 0.026, "GA": 0.055, "NC": 0.045, "MI": 0.06,
    "NJ": 0.065, "VA": 0.0575, "WA": 0.0, "MA": 0.05, "CO": 0.0464,
    "AZ": 0.049, "MN": 0.0985, "MO": 0.055, "MD": 0.0855, "WI": 0.068,
}


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def load_deal_state(output_dir: Path) -> dict:
    """Load deal_state.json from output directory."""
    deal_state_path = output_dir / "deal_state.json"
    if not deal_state_path.exists():
        raise FileNotFoundError(f"deal_state.json not found in {output_dir}")
    with open(deal_state_path) as f:
        return json.load(f)


def save_to_excel(df: pd.DataFrame, filename: str, output_dir: Path, sheet_name: str = "Data"):
    """Save DataFrame to Excel."""
    path = output_dir / filename
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    return path


def generate_tax_provision(deal_state: dict) -> pd.DataFrame:
    """Generate tax provision for 3 recent fiscal years."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    # Extract from financials_seed
    fs = deal_state["financials_seed"]
    annual_revenue = fs.get("annual_revenue", 0)
    ebitda_margin = fs.get("ebitda_margin", 0.2)
    hq_state = deal_state["company"]["headquarters"]["state"]

    # Generate years to analyze (last 3 years)
    current_year = datetime.now().year
    years = [current_year - 2, current_year - 1, current_year]

    tax_data = []
    for year in years:
        # Derive EBITDA from annual_revenue
        ebitda = annual_revenue * ebitda_margin
        revenue = annual_revenue

        # Pretax income ~ EBITDA * (1 - interest burden)
        interest_burden = 0.15 + (0.1 if ebitda < revenue * 0.2 else 0)
        pretax_income = ebitda * (1 - interest_burden)

        # Federal rate 21%
        federal_rate = 0.21

        # State rate varies by state
        state_rate = STATE_TAX_RATES.get(hq_state, 0.05)

        # Effective rate includes NOL carryforwards and credits
        nol_utilized = max(0, pretax_income * 0.05)  # 5% usage
        credits = revenue * 0.002  # Research, etc.

        deduction_rate = (nol_utilized + credits) / pretax_income if pretax_income > 0 else 0
        effective_rate = federal_rate + state_rate - min(deduction_rate, 0.08)
        effective_rate = max(0.15, effective_rate)  # Minimum tax

        current_tax = pretax_income * effective_rate * 0.75  # Current portion
        deferred_tax = pretax_income * effective_rate * 0.25  # Deferred portion
        total_tax = current_tax + deferred_tax

        tax_data.append({
            "fiscal_year": year,
            "pretax_income": round_currency(pretax_income),
            "federal_rate": round_currency(federal_rate),
            "state_rate": round_currency(state_rate),
            "effective_rate": round_currency(effective_rate),
            "current_tax_expense": round_currency(current_tax),
            "deferred_tax_expense": round_currency(deferred_tax),
            "total_tax_expense": round_currency(total_tax),
            "nol_utilized": round_currency(nol_utilized),
            "credits_utilized": round_currency(credits),
        })

    return pd.DataFrame(tax_data)


def generate_depreciation_schedule(deal_state: dict) -> pd.DataFrame:
    """Generate depreciation schedule for PP&E."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    ppe_from_balance_sheet = deal_state["financials_seed"].get("ppe_total", 100000)

    # Asset categories with useful lives and allocation percentages
    asset_categories = [
        ("Furniture & Fixtures", 0.10, 7, "straight_line"),
        ("Equipment", 0.20, 5, "MACRS"),
        ("Leasehold Improvements", 0.25, 15, "straight_line"),
        ("Vehicles", 0.12, 5, "MACRS"),
        ("IT Equipment", 0.18, 3, "MACRS"),
        ("Machinery", 0.10, 10, "straight_line"),
        ("Computers & Software", 0.05, 3, "MACRS"),
    ]

    depreciation_data = []
    total_original_cost = 0

    for category, pct, useful_life, method in asset_categories:
        original_cost = ppe_from_balance_sheet * pct
        total_original_cost += original_cost

        # Accumulated depreciation varies by method
        if method == "MACRS":
            acc_depr_pct = 0.5 + fake.random.uniform(0.1, 0.2)
        else:
            acc_depr_pct = 0.4 + fake.random.uniform(0.05, 0.15)

        accumulated = original_cost * min(acc_depr_pct, 0.9)
        net_book_value = original_cost - accumulated
        annual_depreciation = original_cost / useful_life if useful_life > 0 else 0

        depreciation_data.append({
            "asset_category": category,
            "original_cost": round_currency(original_cost),
            "accumulated_depreciation": round_currency(accumulated),
            "net_book_value": round_currency(net_book_value),
            "annual_depreciation": round_currency(annual_depreciation),
            "method": method,
            "useful_life_years": useful_life,
        })

    return pd.DataFrame(depreciation_data)


def generate_nexus_summary(deal_state: dict) -> pd.DataFrame:
    """Generate state tax nexus summary."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    hq_state = deal_state["company"]["headquarters"]["state"]
    hq_city = deal_state["company"]["headquarters"]["city"]
    company_size = deal_state["financials_seed"]["headcount"]
    revenue = deal_state["financials_seed"]["annual_revenue"]

    # Start with HQ state
    nexus_states = [hq_state]

    # Add states where company has sites
    if "sites" in deal_state and deal_state["sites"]:
        for site in deal_state["sites"]:
            state = site.get("state")
            if state and state not in nexus_states:
                nexus_states.append(state)

    # Add 1-3 additional states for revenue nexus based on size
    if company_size > 100:
        num_additional = min(3, fake.random.randint(1, 3))
        all_states = list(STATE_TAX_RATES.keys())
        for _ in range(num_additional):
            extra_state = fake.random.choice(all_states)
            if extra_state not in nexus_states:
                nexus_states.append(extra_state)

    nexus_data = []
    for state in nexus_states:
        is_hq = state == hq_state

        # HQ always has full nexus
        income_nexus = True
        sales_nexus = True
        payroll_nexus = True

        # Other states vary
        if not is_hq:
            sales_nexus = fake.boolean()
            payroll_nexus = fake.boolean()

        # Employee count varies by state
        if is_hq:
            state_employees = company_size
        else:
            state_employees = max(1, int(company_size * fake.random.uniform(0.05, 0.25)))

        # Revenue from state
        if is_hq:
            state_revenue = revenue * 0.6  # HQ drives majority
        else:
            state_revenue = revenue * fake.random.uniform(0.05, 0.20)

        apportionment_pct = (state_revenue / revenue * 100) if revenue > 0 else 0

        nexus_data.append({
            "state": state,
            "has_income_tax_nexus": "Yes" if income_nexus else "No",
            "has_sales_tax_nexus": "Yes" if sales_nexus else "No",
            "has_payroll_tax": "Yes" if payroll_nexus else "No",
            "employee_count": state_employees,
            "revenue_from_state": round_currency(state_revenue),
            "apportionment_pct": round_currency(apportionment_pct),
        })

    return pd.DataFrame(nexus_data)


def main():
    parser = argparse.ArgumentParser(
        description="Generate tax data for M&A data room simulation"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Directory containing deal_state.json and target output directory"
    )

    args = parser.parse_args()
    output_dir = Path(args.output_dir)

    # Load deal state
    try:
        deal_state = load_deal_state(output_dir)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        exit(1)

    company_name = deal_state["company"]["name"]
    print(f"Generating tax data for {company_name}...")

    # Create section directory
    section_dir = output_dir / "3.0-tax"
    section_dir.mkdir(parents=True, exist_ok=True)

    # Generate all artifacts
    print("  Generating tax provision...")
    tax_prov_df = generate_tax_provision(deal_state)

    print("  Generating depreciation schedule...")
    depr_df = generate_depreciation_schedule(deal_state)

    print("  Generating nexus summary...")
    nexus_df = generate_nexus_summary(deal_state)

    # Save to Excel
    save_to_excel(tax_prov_df, "tax_provision.xlsx", section_dir, "Tax Provision")
    save_to_excel(depr_df, "depreciation_schedule.xlsx", section_dir, "Depreciation")
    save_to_excel(nexus_df, "nexus_summary.xlsx", section_dir, "Nexus")

    # Print summary
    print(f"\n✓ Tax data generated successfully!")
    print(f"  Output directory: {section_dir}")
    print(f"\n  Files created:")
    print(f"    - tax_provision.xlsx ({len(tax_prov_df)} years)")
    print(f"    - depreciation_schedule.xlsx ({len(depr_df)} asset categories)")
    print(f"    - nexus_summary.xlsx ({len(nexus_df)} states)")


if __name__ == "__main__":
    main()
