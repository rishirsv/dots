#!/usr/bin/env python3
"""
Commercial Data Generator for M&A Data Room Simulator.

Generates Section 4.0 Commercial artifacts:
- customer_master.xlsx: Customer roster with contact and financial details
- customer_concentration.xlsx: Customer concentration analysis (Pareto)
- contract_register.xlsx: Contract terms and status
- pipeline.xlsx: Sales pipeline and opportunities
- pricing_summary.xlsx: Pricing structure and units
- marketing_spend.xlsx: Marketing spend by channel

Reads deal_state.json and writes to <output_dir>/4.0-commercial/

Usage:
    python3 scripts/generate_commercial.py --output-dir <output_dir>
"""

import argparse
import json
from datetime import datetime, timedelta
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List

import pandas as pd
import numpy as np
from faker import Faker

# Initialize
fake = Faker()
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def load_deal_state(output_dir: Path) -> dict:
    """Load deal_state.json from output directory."""
    state_path = output_dir / "deal_state.json"
    if not state_path.exists():
        raise FileNotFoundError(f"deal_state.json not found at {state_path}")
    with open(state_path) as f:
        return json.load(f)


def split_amount_exact(total: float, parts: int) -> List[float]:
    """Split amount into rounded values that sum exactly to total."""
    if parts <= 1:
        return [round_currency(total)]
    raw = np.random.dirichlet(np.ones(parts)) * total
    rounded = [round_currency(x) for x in raw]
    delta = round_currency(total - sum(rounded))
    rounded[-1] = round_currency(rounded[-1] + delta)
    return rounded


def save_to_excel(df: pd.DataFrame, filename: str, output_dir: Path, sheet_name: str = "Data"):
    """Save DataFrame to Excel."""
    path = output_dir / filename
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    return path


def generate_customer_master(deal_state: dict) -> pd.DataFrame:
    """Generate customer master with Faker-enriched details."""
    customers_seed = deal_state["customers_seed"]
    annual_revenue = deal_state["financials_seed"]["annual_revenue"]

    customers = []
    revenues = split_amount_exact(annual_revenue, len(customers_seed))

    for i, (seed, annual_rev) in enumerate(zip(customers_seed, revenues)):
        customer_id = seed["customer_id"]

        # Determine contract status based on dates
        contract_start = datetime.strptime(seed["contract_start"], "%Y-%m-%d")
        contract_end = datetime.strptime(seed["contract_end"], "%Y-%m-%d")
        today = datetime.now()

        if contract_end < today:
            status = "expired"
        elif contract_end < today + timedelta(days=90):
            status = "pending_renewal"
        else:
            status = "active"

        customers.append({
            "customer_id": customer_id,
            "customer_name": seed["name"],
            "industry": seed["industry"],
            "city": fake.city(),
            "state": fake.state_abbr(),
            "first_transaction_date": seed["contract_start"],
            "annual_revenue": round_currency(annual_rev),
            "pct_of_total": round(annual_rev / annual_revenue * 100, 2),
            "payment_terms": seed["payment_terms"],
            "contract_status": status,
            "primary_contact": fake.name(),
            "account_manager": fake.name(),
        })

    return pd.DataFrame(customers)


def generate_customer_concentration(deal_state: dict, customer_master: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate customer concentration analysis by customer and summary."""
    annual_revenue = deal_state["financials_seed"]["annual_revenue"]

    # Simulate 3-year data
    by_customer = []
    for _, row in customer_master.iterrows():
        # Year 3 (most recent) is highest, Y2 and Y1 lower
        y3_revenue = row["annual_revenue"]
        y2_revenue = round_currency(y3_revenue * np.random.uniform(0.7, 1.0))
        y1_revenue = round_currency(y2_revenue * np.random.uniform(0.6, 0.95))

        by_customer.append({
            "customer_id": row["customer_id"],
            "customer_name": row["customer_name"],
            "Y1_revenue": y1_revenue,
            "Y2_revenue": y2_revenue,
            "Y3_revenue": y3_revenue,
            "Y3_pct": round(y3_revenue / annual_revenue * 100, 2),
        })

    # Sort descending by Y3 revenue
    by_customer_df = pd.DataFrame(by_customer).sort_values("Y3_revenue", ascending=False)
    by_customer_df["cumulative_pct"] = by_customer_df["Y3_pct"].cumsum()

    # Generate summary metrics
    summary = []
    y3_total = by_customer_df["Y3_revenue"].sum()

    for top_n in [1, 5, 10, 20]:
        if top_n <= len(by_customer_df):
            top_customers = by_customer_df.head(top_n)
            rev = top_customers["Y3_revenue"].sum()
            pct = round(rev / y3_total * 100, 2) if y3_total > 0 else 0
            summary.append({
                "metric": f"Top {top_n}",
                "count": len(top_customers),
                "revenue": round_currency(rev),
                "pct_of_total": pct,
            })

    # Add "Other"
    other_count = max(0, len(by_customer_df) - 20)
    if other_count > 0:
        other_rev = by_customer_df.iloc[20:]["Y3_revenue"].sum()
        summary.append({
            "metric": "Other",
            "count": other_count,
            "revenue": round_currency(other_rev),
            "pct_of_total": round(100 - sum(s["pct_of_total"] for s in summary), 2),
        })

    summary_df = pd.DataFrame(summary)

    return {
        "By Customer": by_customer_df,
        "Summary": summary_df,
    }


def generate_contract_register(deal_state: dict) -> pd.DataFrame:
    """Generate contract register with types matching operating model."""
    customers_seed = deal_state["customers_seed"]

    # Determine contract types based on revenue model if available
    profile = deal_state.get("metadata", {}).get("profile_path", "")
    if "saas" in profile.lower():
        contract_types = ["MSA", "subscription", "SOW"]
    elif "services" in profile.lower():
        contract_types = ["MSA", "SOW", "purchase_order"]
    else:
        contract_types = ["MSA", "SOW", "subscription", "purchase_order"]

    contracts = []
    for i, seed in enumerate(customers_seed):
        contract_start = datetime.strptime(seed["contract_start"], "%Y-%m-%d")
        contract_end = datetime.strptime(seed["contract_end"], "%Y-%m-%d")

        # Determine status
        today = datetime.now()
        if contract_end < today:
            status = "expired"
        elif contract_end < today + timedelta(days=90):
            status = "pending"
        else:
            status = "active"

        contracts.append({
            "contract_id": f"CTR-{i+1:05d}",
            "customer_id": seed["customer_id"],
            "customer_name": seed["name"],
            "contract_type": np.random.choice(contract_types),
            "effective_date": seed["contract_start"],
            "expiration_date": seed["contract_end"],
            "auto_renew": "yes" if np.random.random() < 0.6 else "no",
            "annual_value": round_currency(seed["annual_contract_value"]),
            "payment_terms": seed["payment_terms"],
            "status": status,
            "termination_notice_days": np.random.choice([30, 60, 90]),
            "key_terms_summary": f"Standard {np.random.choice(contract_types)} terms. {fake.sentence(nb_words=5)}",
        })

    return pd.DataFrame(contracts)


def generate_pipeline(deal_state: dict) -> pd.DataFrame:
    """Generate sales pipeline with realistic stage distribution."""
    annual_revenue = deal_state["financials_seed"]["annual_revenue"]
    company_size = deal_state["metadata"]["size"]

    # Size -> pipeline item count
    pipeline_counts = {"small": 10, "mid": 20, "large": 30}
    count = np.random.randint(
        pipeline_counts[company_size] - 5,
        pipeline_counts[company_size] + 5
    )

    # Stage distribution: 60% early, 20% mid, 20% late
    stages = (
        ["lead"] * int(count * 0.35) +
        ["qualified"] * int(count * 0.25) +
        ["proposal"] * int(count * 0.15) +
        ["negotiation"] * int(count * 0.10) +
        ["closed_won"] * int(count * 0.10) +
        ["closed_lost"] * max(0, count - int(count * 0.95))
    )
    np.random.shuffle(stages)

    # Win probability by stage
    stage_probs = {
        "lead": 0.05,
        "qualified": 0.15,
        "proposal": 0.35,
        "negotiation": 0.65,
        "closed_won": 1.0,
        "closed_lost": 0.0,
    }

    pipeline = []
    total_weighted = 0

    for i, stage in enumerate(stages):
        expected_revenue = np.random.uniform(50000, 500000)
        probability = stage_probs[stage]

        # Won deals closer to recent dates
        if stage == "closed_won":
            days_back = np.random.randint(1, 60)
        else:
            days_back = np.random.randint(0, 180)

        expected_close = (datetime.now() + timedelta(days=np.random.randint(15, 120))).strftime("%Y-%m-%d")

        pipeline.append({
            "opportunity_id": f"OPP-{i+1:05d}",
            "prospect_name": fake.company(),
            "stage": stage,
            "expected_revenue": round_currency(expected_revenue),
            "probability": round(probability * 100, 0),
            "expected_close_date": expected_close,
            "source": np.random.choice(["referral", "inbound", "outbound", "partner"]),
            "assigned_to": fake.name(),
            "notes": fake.sentence(nb_words=8),
        })

        total_weighted += expected_revenue * probability

    # Scale to target: 30-60% of annual revenue
    target_weighted = annual_revenue * np.random.uniform(0.30, 0.60)
    scale_factor = target_weighted / total_weighted if total_weighted > 0 else 1

    pipeline_df = pd.DataFrame(pipeline)
    pipeline_df["expected_revenue"] = pipeline_df["expected_revenue"].apply(
        lambda x: round_currency(x * scale_factor)
    )

    return pipeline_df


def generate_pricing_summary(deal_state: dict) -> pd.DataFrame:
    """Generate pricing structure."""
    annual_revenue = deal_state["financials_seed"]["annual_revenue"]
    profile_path = deal_state.get("metadata", {}).get("profile_path", "")

    # Determine units based on revenue model
    if "saas" in profile_path.lower():
        units = ["per_user", "per_month", "per_month"]
    elif "services" in profile_path.lower():
        units = ["per_hour", "per_project"]
    else:
        units = ["per_unit", "per_user", "per_month"]

    # Generate 5-15 line items
    line_count = np.random.randint(5, 15)
    revenues = split_amount_exact(annual_revenue, line_count)

    pricing = []
    for i, revenue in enumerate(revenues):
        unit = np.random.choice(units)
        list_price = np.random.uniform(100, 10000)
        discount_pct = np.random.randint(5, 35)
        effective_price = list_price * (1 - discount_pct / 100)

        pricing.append({
            "product_or_service": f"Product/Service {i+1}",
            "list_price": round_currency(list_price),
            "unit": unit,
            "typical_discount_pct": discount_pct,
            "volume_tier_1_threshold": np.random.randint(10, 100),
            "volume_tier_1_price": round_currency(effective_price),
            "effective_date": (datetime.now() - timedelta(days=np.random.randint(0, 365))).strftime("%Y-%m-%d"),
        })

    return pd.DataFrame(pricing)


def generate_marketing_spend(deal_state: dict) -> pd.DataFrame:
    """Generate marketing spend by channel."""
    annual_revenue = deal_state["financials_seed"]["annual_revenue"]
    industry = deal_state["company"]["industry"]

    # Spend percentage varies by industry
    industry_spend = {
        "saas": np.random.uniform(0.06, 0.08),
        "construction": np.random.uniform(0.02, 0.04),
        "manufacturing": np.random.uniform(0.02, 0.04),
        "professional_services": np.random.uniform(0.04, 0.08),
        "retail": np.random.uniform(0.05, 0.08),
        "dental": np.random.uniform(0.03, 0.06),
    }

    total_marketing_spend = annual_revenue * industry_spend.get(industry, 0.05)

    # 4-6 channels
    all_channels = ["digital", "events", "content", "referral", "direct_sales", "partnerships"]
    channels = np.random.choice(
        all_channels,
        min(np.random.randint(4, 7), len(all_channels)),
        replace=False
    )

    spends = split_amount_exact(total_marketing_spend, len(channels))

    marketing = []
    for channel, spend in zip(channels, spends):
        leads = np.random.randint(10, 200)
        cost_per_lead = round_currency(spend / leads) if leads > 0 else 0
        conversion_rate = np.random.uniform(0.02, 0.15)

        marketing.append({
            "channel": channel,
            "annual_spend": round_currency(spend),
            "pct_of_revenue": round(spend / annual_revenue * 100, 2),
            "leads_generated": leads,
            "cost_per_lead": cost_per_lead,
            "conversion_rate": round(conversion_rate * 100, 1),
        })

    return pd.DataFrame(marketing)


def main():
    parser = argparse.ArgumentParser(
        description="Generate commercial data artifacts (Section 4.0)"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Output directory (must contain deal_state.json)"
    )

    args = parser.parse_args()
    output_dir = Path(args.output_dir)

    # Load deal state
    print("Loading deal_state.json...")
    deal_state = load_deal_state(output_dir)

    # Create 4.0-commercial directory
    commercial_dir = output_dir / "4.0-commercial"
    commercial_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {commercial_dir}")

    # Generate customer master
    print("Generating customer_master.xlsx...")
    customer_master = generate_customer_master(deal_state)
    save_to_excel(customer_master, "customer_master.xlsx", commercial_dir)

    # Generate customer concentration
    print("Generating customer_concentration.xlsx...")
    conc_sheets = generate_customer_concentration(deal_state, customer_master)
    conc_path = commercial_dir / "customer_concentration.xlsx"
    with pd.ExcelWriter(conc_path, engine='openpyxl') as writer:
        for sheet_name, df in conc_sheets.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)

    # Generate contract register
    print("Generating contract_register.xlsx...")
    contract_register = generate_contract_register(deal_state)
    save_to_excel(contract_register, "contract_register.xlsx", commercial_dir)

    # Generate pipeline
    print("Generating pipeline.xlsx...")
    pipeline = generate_pipeline(deal_state)
    save_to_excel(pipeline, "pipeline.xlsx", commercial_dir)

    # Generate pricing summary
    print("Generating pricing_summary.xlsx...")
    pricing = generate_pricing_summary(deal_state)
    save_to_excel(pricing, "pricing_summary.xlsx", commercial_dir)

    # Generate marketing spend
    print("Generating marketing_spend.xlsx...")
    marketing = generate_marketing_spend(deal_state)
    save_to_excel(marketing, "marketing_spend.xlsx", commercial_dir)

    # Summary
    company = deal_state["company"]
    print(f"\nSuccessfully generated Section 4.0 Commercial artifacts for {company['name']}")
    print(f"  Customers: {len(customer_master)}")
    print(f"  Contracts: {len(contract_register)}")
    print(f"  Pipeline opportunities: {len(pipeline)}")
    print(f"  Pricing line items: {len(pricing)}")
    print(f"  Marketing channels: {len(marketing)}")
    print(f"  Output: {commercial_dir}")


if __name__ == "__main__":
    main()
