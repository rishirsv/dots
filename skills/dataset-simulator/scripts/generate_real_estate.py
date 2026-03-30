#!/usr/bin/env python3
"""
Real Estate Data Generator for M&A Data Room Simulator.

Generates real estate artifacts:
- Site list (all locations)
- Rent roll (lease terms and costs)
- Facilities capex (improvements and maintenance)

Usage:
    python generate_real_estate.py --output-dir /path/to/output
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


def generate_site_list(deal_state: dict) -> pd.DataFrame:
    """Generate site list from deal_state.sites."""
    sites = deal_state.get("sites", [])

    site_data = []
    for i, site in enumerate(sites):
        site_id = site.get("id", f"SITE-{i+1:03d}")
        site_name = site.get("name", f"Site {i+1}")
        address = site.get("address", "")
        city = site.get("city", "")
        state = site.get("state", "")
        zip_code = site.get("zip", "")
        site_type = site.get("site_type", "office")
        sqft = site.get("sqft", 0)
        owned_or_leased = site.get("owned_or_leased", "leased")

        # Lease dates
        if owned_or_leased == "leased":
            lease_start = site.get("lease_start_date", "2022-01-01")
            lease_end = site.get("lease_end_date", "2027-12-31")
        else:
            lease_start = ""
            lease_end = ""

        # Monthly/annual rent
        if owned_or_leased == "leased":
            monthly_rent = site.get("monthly_rent") or 0
            annual_rent = monthly_rent * 12
        else:
            monthly_rent = 0
            annual_rent = 0

        status = site.get("status", "active")

        site_data.append({
            "site_id": site_id,
            "site_name": site_name,
            "address": address,
            "city": city,
            "state": state,
            "zip": zip_code,
            "site_type": site_type,
            "sqft": sqft,
            "owned_or_leased": owned_or_leased,
            "lease_start": lease_start,
            "lease_end": lease_end,
            "monthly_rent": round_currency(monthly_rent),
            "annual_rent": round_currency(annual_rent),
            "status": status,
        })

    return pd.DataFrame(site_data)


def generate_rent_roll(deal_state: dict, site_df: pd.DataFrame) -> pd.DataFrame:
    """Generate rent roll with lease details."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    # Filter to leased sites only
    leased_sites = site_df[site_df["owned_or_leased"] == "leased"]

    rent_roll_data = []

    for _, site in leased_sites.iterrows():
        site_id = site["site_id"]
        site_name = site["site_name"]
        monthly_rent = site["monthly_rent"]

        # Landlord name
        landlord = f"{fake.name()} {fake.random.choice(['LLC', 'LP', 'Corp'])}"

        # Lease dates
        lease_start = datetime.strptime(site["lease_start"], "%Y-%m-%d")
        lease_end = datetime.strptime(site["lease_end"], "%Y-%m-%d")
        term_years = int((lease_end - lease_start).days / 365)

        # Base rent and escalation
        base_rent = monthly_rent
        annual_escalation = round_currency(fake.random.uniform(0.02, 0.04))
        current_year = datetime.now().year
        years_elapsed = current_year - lease_start.year
        current_monthly_rent = base_rent * ((1 + annual_escalation) ** years_elapsed)

        current_monthly_rent = round_currency(current_monthly_rent)
        annual_rent = round_currency(current_monthly_rent * 12)

        # CAM charges for NNN (triple net)
        lease_type = fake.random.choice(["NNN", "gross", "modified_gross"])
        if lease_type == "NNN":
            cam_monthly = round_currency(current_monthly_rent * fake.random.uniform(0.10, 0.20))
        else:
            cam_monthly = 0

        total_monthly = current_monthly_rent + cam_monthly

        # Renewal option
        renewal_option = fake.random.choice(
            ["2 x 5 years", "1 x 5 years", "1 x 3 years", "None"]
        )

        rent_roll_data.append({
            "site_id": site_id,
            "site_name": site_name,
            "landlord_name": landlord,
            "lease_start": site["lease_start"],
            "lease_end": site["lease_end"],
            "term_years": term_years,
            "base_rent_monthly": round_currency(base_rent),
            "annual_escalation_pct": annual_escalation,
            "current_monthly_rent": current_monthly_rent,
            "annual_rent": annual_rent,
            "cam_monthly": cam_monthly,
            "total_monthly_occupancy_cost": round_currency(total_monthly),
            "lease_type": lease_type,
            "renewal_option": renewal_option,
        })

    return pd.DataFrame(rent_roll_data)


def generate_facilities_capex(deal_state: dict, site_df: pd.DataFrame) -> pd.DataFrame:
    """Generate facilities capex history."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    capex_from_financials = deal_state["financials_seed"].get("capex_annual", 0)

    capex_data = []
    sites = site_df[site_df["status"] == "active"]

    capex_categories = [
        "leasehold_improvement",
        "equipment",
        "renovation",
        "maintenance",
        "furniture",
    ]

    start_date = datetime.now() - timedelta(days=3*365)

    for _, site in sites.iterrows():
        site_id = site["site_id"]
        site_name = site["site_name"]
        sqft = site["sqft"]

        # 3-8 capex items per site
        num_items = fake.random.randint(3, 8)

        for i in range(num_items):
            capex_item = fake.random.choice([
                "HVAC upgrade",
                "Flooring replacement",
                "Painting & refresh",
                "Security system upgrade",
                "IT infrastructure",
                "Kitchen/break room",
                "Roof repair",
                "Door/window upgrade",
                "Lighting upgrade",
                "Parking lot seal",
            ])

            amount = fake.random.uniform(10000, 150000)
            category = fake.random.choice(capex_categories)
            useful_life = fake.random.choice([5, 7, 10, 15, 20])
            status = fake.random.choice(["completed", "completed", "completed", "in_progress"])

            # Date within 3 years
            days_ago = fake.random.randint(0, 3*365)
            capex_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")

            capex_data.append({
                "site_id": site_id,
                "site_name": site_name,
                "capex_item": capex_item,
                "amount": round_currency(amount),
                "date": capex_date,
                "category": category,
                "useful_life": useful_life,
                "status": status,
            })

    # Scale amounts to roughly match capex from financials
    if capex_from_financials > 0:
        total_capex = sum(row["amount"] for _, row in pd.DataFrame(capex_data).iterrows())
        if total_capex > 0:
            scale = (capex_from_financials * 3) / total_capex  # 3 years
            for row in capex_data:
                row["amount"] = round_currency(row["amount"] * scale)

    return pd.DataFrame(capex_data)


def main():
    parser = argparse.ArgumentParser(
        description="Generate real estate data for M&A data room simulation"
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
    print(f"Generating real estate data for {company_name}...")

    # Create section directory
    section_dir = output_dir / "10.0-real-estate"
    section_dir.mkdir(parents=True, exist_ok=True)

    # Generate all artifacts
    print("  Generating site list...")
    site_df = generate_site_list(deal_state)

    print("  Generating rent roll...")
    rent_roll_df = generate_rent_roll(deal_state, site_df)

    print("  Generating facilities capex...")
    capex_df = generate_facilities_capex(deal_state, site_df)

    # Save to Excel
    save_to_excel(site_df, "site_list.xlsx", section_dir, "Sites")
    save_to_excel(rent_roll_df, "rent_roll.xlsx", section_dir, "Rent Roll")
    save_to_excel(capex_df, "facilities_capex.xlsx", section_dir, "CapEx")

    # Print summary
    print(f"\n✓ Real estate data generated successfully!")
    print(f"  Output directory: {section_dir}")
    print(f"\n  Files created:")
    print(f"    - site_list.xlsx ({len(site_df)} sites)")
    print(f"    - rent_roll.xlsx ({len(rent_roll_df)} leases)")
    print(f"    - facilities_capex.xlsx ({len(capex_df)} capex items)")


if __name__ == "__main__":
    main()
