#!/usr/bin/env python3
"""
Insurance Data Generator for M&A Data Room Simulator.

Generates insurance-related artifacts:
- Policy schedule (active policies, carriers, premiums)
- Loss runs (claims history)
- Broker summary (coverage recommendations)

Usage:
    python generate_insurance.py --output-dir /path/to/output
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


def generate_policy_schedule(deal_state: dict) -> pd.DataFrame:
    """Generate insurance policy schedule."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    revenue = deal_state["financials_seed"]["annual_revenue"]
    headcount = deal_state["financials_seed"]["headcount"]

    # Insurance carriers (realistic names)
    carriers = [
        "Chubb Group", "AIG", "Zurich Insurance", "Hartford", "Travelers",
        "Liberty Mutual", "State Farm", "Allstate", "Nationwide", "NCCI",
        "XL Capital", "Munich Re", "Berkley", "Intact Financial", "CNA Financial"
    ]

    # Universal policies for all industries
    universal_policies = [
        ("General Liability", 1000000, 5000, 2500),
        ("Property", 500000, 5000, 3000),
        ("Directors & Officers", 2000000, 10000, 4500),
        ("EPLI", 1000000, 5000, 2800),
        ("Cyber", 500000, 5000, 3500),
        ("Workers Compensation", 0, 0, None),  # Premium varies
        ("Commercial Auto", 250000, 5000, 2000),
        ("Umbrella", 5000000, 0, 5000),
    ]

    # Industry-specific policies
    industry_specific = {
        "healthcare_provider": [
            ("Professional Liability (Malpractice)", 2000000, 10000, 8000),
            ("Patient Safety", 500000, 2500, 2000),
        ],
        "manufacturing": [
            ("Product Liability", 2000000, 10000, 5000),
            ("Environmental", 500000, 5000, 3500),
        ],
        "construction": [
            ("Builders Risk", 1000000, 5000, 4000),
            ("Surety Bonds", 0, 0, None),
        ],
        "logistics": [
            ("Cargo", 500000, 5000, 3000),
            ("Inland Marine", 250000, 2500, 1500),
        ],
        "retail": [
            ("Liquor Liability", 500000, 2500, 1500),
        ],
    }

    policies = universal_policies.copy()
    if industry in industry_specific:
        policies.extend(industry_specific[industry])

    policy_data = []
    total_premium = 0

    for policy_type, limit, deductible, base_premium in policies:
        carrier = fake.random.choice(carriers)

        # Generate policy number
        policy_num = f"{fake.random.randint(1000000, 9999999)}"

        # Dates
        effective = datetime(2024, fake.random.randint(1, 12), fake.random.randint(1, 28))
        expiration = effective + timedelta(days=365)

        # Premium varies by company size
        if base_premium is None:
            # Workers comp: $15-25 per $100 of payroll
            payroll = revenue * 0.35  # Rough estimate
            premium = (payroll / 100) * fake.random.uniform(15, 25)
        else:
            size_factor = max(0.5, min(2.5, headcount / 100))
            premium = base_premium * size_factor * fake.random.uniform(0.8, 1.3)

        premium = round_currency(premium)
        total_premium += premium

        policy_data.append({
            "policy_type": policy_type,
            "carrier_name": carrier,
            "policy_number": policy_num,
            "effective_date": effective.strftime("%Y-%m-%d"),
            "expiration_date": expiration.strftime("%Y-%m-%d"),
            "coverage_limit": limit if limit > 0 else "N/A",
            "deductible": deductible if deductible > 0 else "N/A",
            "annual_premium": premium,
            "broker": f"{fake.name()} Insurance" if fake.boolean() else fake.company(),
        })

    return pd.DataFrame(policy_data)


def generate_loss_runs(deal_state: dict) -> pd.DataFrame:
    """Generate claims history."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    regulatory_burden = deal_state["metadata"].get("regulatory_burden", "light")

    # Adjust claim frequency by industry
    claim_counts = {
        "healthcare_provider": (8, 15),
        "construction": (10, 18),
        "manufacturing": (5, 12),
        "logistics": (6, 14),
        "retail": (4, 10),
        "other": (3, 8),
    }

    industry_key = industry if industry in claim_counts else "other"
    min_claims, max_claims = claim_counts[industry_key]

    # Heavy regulatory burden = more incidents
    if regulatory_burden == "heavy":
        num_claims = fake.random.randint(max(min_claims, max_claims - 3), max_claims)
    else:
        num_claims = fake.random.randint(min_claims, max_claims - 2)

    claims_data = []
    start_date = datetime.now() - timedelta(days=3*365)

    for i in range(num_claims):
        claim_id = f"CLM-{datetime.now().year}-{i+1:04d}"
        claim_date = start_date + timedelta(days=fake.random.randint(0, 3*365))

        # Policy types for claims
        claim_policy_types = {
            "healthcare_provider": ["Professional Liability", "General Liability", "Patient Safety"],
            "construction": ["General Liability", "Builders Risk", "Workers Compensation"],
            "manufacturing": ["Product Liability", "General Liability", "Workers Compensation"],
            "logistics": ["Cargo", "General Liability", "Commercial Auto"],
            "retail": ["General Liability", "Workers Compensation", "Liquor Liability"],
        }

        policy_type = fake.random.choice(claim_policy_types.get(industry, ["General Liability"]))

        # Description varies
        descriptions = {
            "healthcare_provider": [
                "Patient alleges treatment error",
                "Slip and fall in clinic",
                "Worker injury",
                "Data breach notification",
            ],
            "construction": [
                "Worker injury on site",
                "Property damage claim",
                "Slip and fall",
                "Equipment damage",
            ],
            "manufacturing": [
                "Product defect claim",
                "Worker injury",
                "Environmental release",
                "Property damage",
            ],
            "logistics": [
                "Cargo loss",
                "Vehicle accident",
                "Worker injury",
                "Shipment damage",
            ],
            "retail": [
                "Slip and fall",
                "Worker injury",
                "Alleged discrimination",
                "Property theft",
            ],
        }

        description = fake.random.choice(descriptions.get(industry, ["General claim"]))

        # Status - mostly closed, few open
        if i < num_claims - 2:
            status = "closed"
        elif i < num_claims - 1:
            status = "open"
        else:
            status = fake.random.choice(["closed", "open"])

        # Amounts
        incurred = fake.random.uniform(5000, 250000)
        if status == "closed":
            paid = incurred * fake.random.uniform(0.5, 1.0)
            reserved = 0
        else:
            paid = incurred * fake.random.uniform(0.1, 0.4)
            reserved = incurred - paid

        claims_data.append({
            "claim_id": claim_id,
            "claim_date": claim_date.strftime("%Y-%m-%d"),
            "policy_type": policy_type,
            "description": description,
            "status": status,
            "incurred_amount": round_currency(incurred),
            "paid_amount": round_currency(paid),
            "reserved_amount": round_currency(reserved),
        })

    return pd.DataFrame(claims_data)


def generate_broker_summary(policy_df: pd.DataFrame) -> pd.DataFrame:
    """Generate broker coverage and renewal summary."""
    fake = Faker()

    broker_data = []

    for _, policy in policy_df.iterrows():
        # Renewal status - mostly confirmed, some pending, few marketing
        renewal_status = fake.random.choice(
            ["confirmed", "confirmed", "confirmed", "pending", "marketing"]
        )

        broker_rec = ""
        if renewal_status == "marketing":
            broker_rec = f"Competitive bid: {fake.random.choice(['+5%', '-8%', '+2%'])} vs. current"
        elif renewal_status == "pending":
            broker_rec = "Awaiting underwriting decision"
        else:
            broker_rec = "Renewal proceeding as scheduled"

        broker_data.append({
            "coverage_line": policy["policy_type"],
            "carrier": policy["carrier_name"],
            "premium": policy["annual_premium"],
            "limit": policy["coverage_limit"],
            "deductible": policy["deductible"],
            "expiration": policy["expiration_date"],
            "renewal_status": renewal_status,
            "broker_recommendation": broker_rec,
        })

    return pd.DataFrame(broker_data)


def main():
    parser = argparse.ArgumentParser(
        description="Generate insurance data for M&A data room simulation"
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
    print(f"Generating insurance data for {company_name}...")

    # Create section directory
    section_dir = output_dir / "11.0-insurance"
    section_dir.mkdir(parents=True, exist_ok=True)

    # Generate all artifacts
    print("  Generating policy schedule...")
    policies_df = generate_policy_schedule(deal_state)

    print("  Generating loss runs...")
    claims_df = generate_loss_runs(deal_state)

    print("  Generating broker summary...")
    broker_df = generate_broker_summary(policies_df)

    # Save to Excel
    save_to_excel(policies_df, "policy_schedule.xlsx", section_dir, "Policies")
    save_to_excel(claims_df, "loss_runs.xlsx", section_dir, "Claims")
    save_to_excel(broker_df, "broker_summary.xlsx", section_dir, "Broker Summary")

    # Print summary
    print(f"\n✓ Insurance data generated successfully!")
    print(f"  Output directory: {section_dir}")
    print(f"\n  Files created:")
    print(f"    - policy_schedule.xlsx ({len(policies_df)} policies)")
    print(f"    - loss_runs.xlsx ({len(claims_df)} claims)")
    print(f"    - broker_summary.xlsx ({len(broker_df)} lines)")


if __name__ == "__main__":
    main()
