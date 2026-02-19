#!/usr/bin/env python3
"""
Operations Data Generator for M&A Data Room Simulator.

Generates industry-specific revenue and operational data:
- SaaS: customer master, subscription register, MRR analysis
- Construction: project master, WIP schedule, contract register
- Manufacturing: product master, inventory ledger, BOM
- Professional Services: client master, engagement register, timesheets
- Retail: product catalog, sales transactions, inventory
- Dental: provider production, utilization, patient flow, insurance AR

CRITICAL: Sum of generated revenue must exactly match P&L revenue.

Usage:
    python generate_operations.py [--seed-file path/to/company_seed.json]
"""

import argparse
import json
import random
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
PROFILES_DIR = PROJECT_DIR / "profiles"
OUTPUT_DIR = PROJECT_DIR / "output"


def load_seed(seed_path: Path) -> dict:
    """Load company seed from JSON file."""
    with open(seed_path) as f:
        return json.load(f)


def load_profile(industry: str) -> dict:
    """Load industry profile from JSON file."""
    profile_path = PROFILES_DIR / f"{industry}.json"
    with open(profile_path) as f:
        return json.load(f)


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def load_trial_balance(output_dir: Path) -> pd.DataFrame:
    """Load trial balance to get actual revenue numbers."""
    tb_path = output_dir / "trial_balance.xlsx"
    if not tb_path.exists():
        raise FileNotFoundError("Trial balance not found. Run generate_financials.py first.")
    return pd.read_excel(tb_path)


def save_to_excel(df: pd.DataFrame, filename: str, output_dir: Path, sheet_name: str = "Data"):
    """Save DataFrame to Excel."""
    path = output_dir / filename
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    return path


def split_amount_exact(total: float, parts: int) -> List[float]:
    """Split amount into rounded values that sum exactly to total."""
    if parts <= 1:
        return [round_currency(total)]
    raw = np.random.dirichlet(np.ones(parts)) * total
    rounded = [round_currency(x) for x in raw]
    delta = round_currency(total - sum(rounded))
    rounded[-1] = round_currency(rounded[-1] + delta)
    return rounded


# ============================================================================
# SaaS Industry Generator
# ============================================================================

def generate_saas(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate SaaS-specific operations data."""

    customer_count = seed.get("operations", {}).get("customer_count", 100)

    # Get monthly revenues from trial balance
    monthly_revenues = tb[["period", "total_revenue"]].copy()
    monthly_revenues["year"] = tb["period"].str[:4].astype(int)
    monthly_revenues["month"] = tb["period"].str[5:7].astype(int)

    # Generate customer master
    customers = []
    for i in range(customer_count):
        signup_period_idx = random.randint(0, len(tb) - 1)
        signup_date = tb.iloc[signup_period_idx]["period"] + "-15"

        # Some customers churn
        is_churned = random.random() < 0.15
        if is_churned:
            churn_idx = min(signup_period_idx + random.randint(6, 24), len(tb) - 1)
            churn_date = tb.iloc[churn_idx]["period"] + "-15"
        else:
            churn_date = None

        customers.append({
            "customer_id": f"CUST-{i+1:05d}",
            "company_name": fake.company(),
            "contact_name": fake.name(),
            "email": fake.email(),
            "phone": fake.phone_number(),
            "signup_date": signup_date,
            "status": "churned" if is_churned else "active",
            "churn_date": churn_date,
            "plan": random.choice(["starter", "professional", "enterprise"]),
            "billing_cycle": random.choice(["monthly", "annual"]),
            "industry": random.choice(["Technology", "Healthcare", "Finance", "Retail", "Manufacturing"]),
        })

    customer_df = pd.DataFrame(customers)

    # Generate subscription register with MRR that ties to revenue
    subscriptions = []
    plans = {
        "starter": {"min_mrr": 50, "max_mrr": 200},
        "professional": {"min_mrr": 200, "max_mrr": 1000},
        "enterprise": {"min_mrr": 1000, "max_mrr": 10000},
    }

    # Assign base MRR to each customer
    for cust in customers:
        plan_range = plans[cust["plan"]]
        base_mrr = random.uniform(plan_range["min_mrr"], plan_range["max_mrr"])
        subscriptions.append({
            "customer_id": cust["customer_id"],
            "plan": cust["plan"],
            "base_mrr": round_currency(base_mrr),
            "start_date": cust["signup_date"],
            "end_date": cust["churn_date"],
            "status": cust["status"],
        })

    subscription_df = pd.DataFrame(subscriptions)

    # Generate monthly MRR that ties to actual P&L revenue
    mrr_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Get active customers for this period
        period_date = datetime.strptime(period + "-01", "%Y-%m-%d")
        active_subs = subscription_df[
            (pd.to_datetime(subscription_df["start_date"]) <= period_date) &
            ((subscription_df["end_date"].isna()) |
             (pd.to_datetime(subscription_df["end_date"]) >= period_date))
        ]

        # Scale MRR to match target revenue
        if len(active_subs) > 0:
            total_base_mrr = active_subs["base_mrr"].sum()
            scale_factor = target_revenue / total_base_mrr if total_base_mrr > 0 else 1
        else:
            scale_factor = 1
            total_base_mrr = target_revenue

        mrr_data.append({
            "period": period,
            "active_customers": len(active_subs),
            "total_mrr": round_currency(target_revenue),
            "arr": round_currency(target_revenue * 12),
            "average_mrr": round_currency(target_revenue / len(active_subs)) if len(active_subs) > 0 else 0,
            "new_mrr": round_currency(target_revenue * random.uniform(0.03, 0.08)),
            "churned_mrr": round_currency(target_revenue * random.uniform(0.01, 0.04)),
            "expansion_mrr": round_currency(target_revenue * random.uniform(0.01, 0.03)),
        })

    mrr_df = pd.DataFrame(mrr_data)

    # Generate invoice register
    invoices = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Generate ~10-30 invoices per month that sum to target
        num_invoices = random.randint(10, 30)
        amounts = split_amount_exact(target_revenue, num_invoices)

        for i, amount in enumerate(amounts):
            cust = random.choice(customers)
            inv_date = f"{period}-{random.randint(1, 28):02d}"
            invoices.append({
                "invoice_id": f"INV-{period.replace('-', '')}-{i+1:04d}",
                "customer_id": cust["customer_id"],
                "customer_name": cust["company_name"],
                "invoice_date": inv_date,
                "due_date": (datetime.strptime(inv_date, "%Y-%m-%d") + timedelta(days=30)).strftime("%Y-%m-%d"),
                "amount": round_currency(amount),
                "status": random.choice(["paid", "paid", "paid", "outstanding"]),
                "description": f"Subscription - {period}",
            })

    invoice_df = pd.DataFrame(invoices)

    # Product/plan master
    products = [
        {"plan_id": "PLAN-001", "name": "Starter", "monthly_price": 99, "annual_price": 990, "features": "Basic features"},
        {"plan_id": "PLAN-002", "name": "Professional", "monthly_price": 299, "annual_price": 2990, "features": "Advanced features"},
        {"plan_id": "PLAN-003", "name": "Enterprise", "monthly_price": 999, "annual_price": 9990, "features": "Full platform"},
    ]
    product_df = pd.DataFrame(products)

    return {
        "customer_master.xlsx": customer_df,
        "subscription_register.xlsx": subscription_df,
        "mrr_analysis.xlsx": mrr_df,
        "invoice_register.xlsx": invoice_df,
        "product_plan_master.xlsx": product_df,
    }


# ============================================================================
# Construction Industry Generator
# ============================================================================

def generate_construction(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate construction-specific operations data."""

    project_count = seed.get("operations", {}).get("project_count", 20)

    # Generate project master
    projects = []
    for i in range(project_count):
        start_idx = random.randint(0, max(0, len(tb) - 12))
        duration = random.randint(6, 24)  # 6-24 month projects
        end_idx = min(start_idx + duration, len(tb) - 1)

        contract_value = random.uniform(100000, 5000000)
        completion_pct = random.uniform(0.3, 1.0) if end_idx < len(tb) - 1 else random.uniform(0.2, 0.95)

        projects.append({
            "project_id": f"PRJ-{i+1:04d}",
            "project_name": f"{fake.company()} - {random.choice(['Office', 'Warehouse', 'Retail', 'Industrial', 'Residential'])} {random.choice(['Renovation', 'New Construction', 'Expansion', 'Retrofit'])}",
            "client_name": fake.company(),
            "contract_value": round_currency(contract_value),
            "start_date": tb.iloc[start_idx]["period"] + "-01",
            "estimated_end_date": tb.iloc[end_idx]["period"] + "-28",
            "percent_complete": round(completion_pct * 100, 1),
            "status": "completed" if completion_pct >= 1.0 else "in_progress",
            "project_manager": fake.name(),
            "contract_type": random.choice(["fixed_price", "cost_plus", "time_materials"]),
        })

    project_df = pd.DataFrame(projects)

    # Generate WIP schedule that ties to P&L revenue
    wip_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Distribute revenue across active projects
        costs_incurred = target_revenue * random.uniform(0.78, 0.85)
        billings = target_revenue * random.uniform(0.90, 1.10)

        if costs_incurred > billings:
            wip_asset = costs_incurred - billings
            wip_liability = 0
        else:
            wip_asset = 0
            wip_liability = billings - costs_incurred

        wip_data.append({
            "period": period,
            "revenue_recognized": round_currency(target_revenue),
            "costs_incurred": round_currency(costs_incurred),
            "gross_profit": round_currency(target_revenue - costs_incurred),
            "billings": round_currency(billings),
            "costs_in_excess_of_billings": round_currency(wip_asset),
            "billings_in_excess_of_costs": round_currency(wip_liability),
        })

    wip_df = pd.DataFrame(wip_data)

    # Contract register
    contracts = []
    for p in projects:
        contracts.append({
            "contract_id": f"CON-{p['project_id'][4:]}",
            "project_id": p["project_id"],
            "client_name": p["client_name"],
            "original_value": p["contract_value"],
            "change_orders": round_currency(p["contract_value"] * random.uniform(0, 0.15)),
            "current_value": round_currency(p["contract_value"] * (1 + random.uniform(0, 0.15))),
            "retention_pct": random.choice([5, 10]),
            "contract_date": p["start_date"],
        })

    contract_df = pd.DataFrame(contracts)

    # Subcontractor register
    subcontractors = []
    for i in range(project_count * 3):
        proj = random.choice(projects)
        subcontractors.append({
            "subcontractor_id": f"SUB-{i+1:04d}",
            "company_name": f"{fake.last_name()} {random.choice(['Electric', 'Plumbing', 'HVAC', 'Concrete', 'Steel', 'Framing', 'Drywall', 'Painting'])}",
            "project_id": proj["project_id"],
            "trade": random.choice(["Electrical", "Plumbing", "HVAC", "Concrete", "Structural", "Finishes"]),
            "contract_value": round_currency(proj["contract_value"] * random.uniform(0.05, 0.20)),
            "status": "active",
        })

    subcontractor_df = pd.DataFrame(subcontractors)

    return {
        "project_master.xlsx": project_df,
        "wip_schedule.xlsx": wip_df,
        "contract_register.xlsx": contract_df,
        "subcontractor_register.xlsx": subcontractor_df,
    }


# ============================================================================
# Manufacturing Industry Generator
# ============================================================================

def generate_manufacturing(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate manufacturing-specific operations data."""

    product_count = seed.get("operations", {}).get("product_count", 50)
    customer_count = seed.get("operations", {}).get("customer_count", 100)

    # Generate product master
    products = []
    categories = ["Widgets", "Components", "Assemblies", "Parts", "Equipment"]
    for i in range(product_count):
        unit_cost = random.uniform(10, 500)
        products.append({
            "product_id": f"SKU-{i+1:05d}",
            "product_name": f"{fake.word().capitalize()} {random.choice(categories)} {random.choice(['A', 'B', 'C', 'Pro', 'Plus'])}",
            "category": random.choice(categories),
            "unit_cost": round_currency(unit_cost),
            "unit_price": round_currency(unit_cost * random.uniform(1.3, 2.0)),
            "status": "active",
            "lead_time_days": random.randint(5, 30),
        })

    product_df = pd.DataFrame(products)

    # Generate customer master
    customers = []
    for i in range(customer_count):
        customers.append({
            "customer_id": f"CUST-{i+1:05d}",
            "company_name": fake.company(),
            "contact_name": fake.name(),
            "email": fake.email(),
            "address": fake.address().replace('\n', ', '),
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
            "credit_limit": random.randint(10000, 500000),
        })

    customer_df = pd.DataFrame(customers)

    # Generate invoice register that ties to revenue
    invoices = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Generate invoices that sum to target
        num_invoices = random.randint(20, 50)
        amounts = split_amount_exact(target_revenue, num_invoices)

        for i, amount in enumerate(amounts):
            cust = random.choice(customers)
            prod = random.choice(products)
            qty = max(1, int(amount / prod["unit_price"]))

            invoices.append({
                "invoice_id": f"INV-{period.replace('-', '')}-{i+1:04d}",
                "customer_id": cust["customer_id"],
                "customer_name": cust["company_name"],
                "invoice_date": f"{period}-{random.randint(1, 28):02d}",
                "product_id": prod["product_id"],
                "quantity": qty,
                "unit_price": prod["unit_price"],
                "amount": round_currency(amount),
                "status": random.choice(["paid", "paid", "outstanding"]),
            })

    invoice_df = pd.DataFrame(invoices)

    # Generate inventory ledger
    inventory_data = []
    for prod in products:
        for _, row in tb.iterrows():
            period = row["period"]
            on_hand = random.randint(50, 500)
            inventory_data.append({
                "period": period,
                "product_id": prod["product_id"],
                "product_name": prod["product_name"],
                "quantity_on_hand": on_hand,
                "unit_cost": prod["unit_cost"],
                "total_value": round_currency(on_hand * prod["unit_cost"]),
            })

    inventory_df = pd.DataFrame(inventory_data)

    # Bill of materials (simplified)
    bom_data = []
    for prod in products[:20]:  # Just top 20 products
        num_components = random.randint(3, 8)
        for j in range(num_components):
            bom_data.append({
                "parent_product_id": prod["product_id"],
                "component_id": f"COMP-{random.randint(1, 1000):05d}",
                "component_name": f"{fake.word().capitalize()} Component",
                "quantity_required": random.randint(1, 10),
                "unit_cost": round_currency(prod["unit_cost"] / num_components * random.uniform(0.5, 1.5)),
            })

    bom_df = pd.DataFrame(bom_data)

    return {
        "product_master.xlsx": product_df,
        "customer_master.xlsx": customer_df,
        "invoice_register.xlsx": invoice_df,
        "inventory_ledger.xlsx": inventory_df,
        "bill_of_materials.xlsx": bom_df,
    }


# ============================================================================
# Professional Services Industry Generator
# ============================================================================

def generate_services(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate professional services-specific operations data."""

    client_count = seed.get("operations", {}).get("client_count", 75)
    headcount = seed["financials"]["headcount"]

    # Generate client master
    clients = []
    for i in range(client_count):
        clients.append({
            "client_id": f"CLI-{i+1:04d}",
            "client_name": fake.company(),
            "contact_name": fake.name(),
            "email": fake.email(),
            "industry": random.choice(["Technology", "Healthcare", "Finance", "Manufacturing", "Retail"]),
            "engagement_type": random.choice(["retainer", "project", "advisory"]),
            "status": "active" if random.random() > 0.1 else "inactive",
        })

    client_df = pd.DataFrame(clients)

    # Generate staff with billing rates
    staff_levels = profile.get("staff_levels", [
        {"level": "Partner", "rate_multiplier": 3.0},
        {"level": "Director", "rate_multiplier": 2.0},
        {"level": "Manager", "rate_multiplier": 1.5},
        {"level": "Senior", "rate_multiplier": 1.2},
        {"level": "Associate", "rate_multiplier": 1.0},
    ])

    base_rate = 150  # Base hourly rate
    staff = []
    for i in range(headcount):
        level = random.choices(
            [s["level"] for s in staff_levels],
            weights=[0.05, 0.10, 0.20, 0.30, 0.35]
        )[0]
        level_info = next(s for s in staff_levels if s["level"] == level)
        staff.append({
            "staff_id": f"EMP-{i+1:04d}",
            "name": fake.name(),
            "level": level,
            "billing_rate": round_currency(base_rate * level_info["rate_multiplier"]),
            "department": random.choice(["Consulting", "Advisory", "Implementation"]),
        })

    staff_df = pd.DataFrame(staff)

    # Generate engagement register
    engagements = []
    for i in range(client_count * 2):
        client = random.choice(clients)
        start_idx = random.randint(0, max(0, len(tb) - 6))
        duration = random.randint(1, 12)
        budget = random.uniform(50000, 500000)

        engagements.append({
            "engagement_id": f"ENG-{i+1:04d}",
            "client_id": client["client_id"],
            "client_name": client["client_name"],
            "project_name": f"{random.choice(['Strategic', 'Digital', 'Process', 'Technology', 'Change'])} {random.choice(['Transformation', 'Assessment', 'Implementation', 'Advisory'])}",
            "start_date": tb.iloc[start_idx]["period"] + "-01",
            "end_date": tb.iloc[min(start_idx + duration, len(tb) - 1)]["period"] + "-28",
            "budget": round_currency(budget),
            "status": random.choice(["active", "completed", "completed"]),
            "partner": random.choice([s["name"] for s in staff if s["level"] == "Partner"]) if any(s["level"] == "Partner" for s in staff) else fake.name(),
        })

    engagement_df = pd.DataFrame(engagements)

    # Generate timesheet data that ties to revenue
    timesheet_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Distribute revenue across staff hours
        avg_rate = sum(s["billing_rate"] for s in staff) / len(staff)
        total_hours_needed = target_revenue / avg_rate

        # Generate timesheet entries
        hours_allocated = 0
        for emp in staff:
            available_hours = 160 * random.uniform(0.5, 0.9)  # 50-90% utilization
            billable_hours = min(available_hours, (total_hours_needed - hours_allocated) / len(staff) * 2)
            billable_hours = max(0, billable_hours)

            if billable_hours > 0:
                eng = random.choice(engagements)
                timesheet_data.append({
                    "period": period,
                    "staff_id": emp["staff_id"],
                    "staff_name": emp["name"],
                    "engagement_id": eng["engagement_id"],
                    "client_name": eng["client_name"],
                    "billable_hours": round(billable_hours, 1),
                    "billing_rate": emp["billing_rate"],
                    "billed_amount": round_currency(billable_hours * emp["billing_rate"]),
                })
                hours_allocated += billable_hours

    timesheet_df = pd.DataFrame(timesheet_data)

    # WIP schedule
    wip_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        unbilled = target_revenue * random.uniform(0.15, 0.30)
        wip_data.append({
            "period": period,
            "billed_revenue": round_currency(target_revenue),
            "unbilled_wip": round_currency(unbilled),
            "total_revenue": round_currency(target_revenue),
        })

    wip_df = pd.DataFrame(wip_data)

    return {
        "client_master.xlsx": client_df,
        "staff_master.xlsx": staff_df,
        "engagement_register.xlsx": engagement_df,
        "timesheet_data.xlsx": timesheet_df,
        "wip_schedule.xlsx": wip_df,
    }


# ============================================================================
# Dental Industry Generator
# ============================================================================

def generate_dental(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate dental-specific operations data aligned to diligence workflows."""

    ops = seed.get("operations", {})
    practice_count = ops.get("practice_count", max(1, seed["financials"]["headcount"] // 30))
    provider_count = ops.get("provider_count", max(2, seed["financials"]["headcount"] // 8))
    patient_count = ops.get("patient_count", practice_count * 5000)

    # Keep practice management system diversity to mimic the report variability seen in diligence.
    pms_systems = [
        "Dentrix",
        "Open Dental",
        "Dentrix Ascend",
        "CareStack",
        "Curve Dental",
        "Practice-Web",
    ]

    practice_rows = []
    for i in range(practice_count):
        practice_rows.append({
            "practice_id": f"PRC-{i+1:03d}",
            "practice_name": f"{fake.last_name()} Dental {random.choice(['Care', 'Group', 'Center', 'Associates'])}",
            "city": seed["company"]["headquarters"]["city"],
            "state": seed["company"]["headquarters"]["state"],
            "operatories": random.randint(6, 18),
            "active_providers": max(1, provider_count // practice_count + random.randint(-1, 1)),
            "active_hygienists": max(1, seed["financials"]["headcount"] // max(8, practice_count * 8)),
            "pms_system": random.choice(pms_systems),
            "google_rating": round(random.uniform(3.9, 4.9), 1),
            "patient_count_estimate": max(1000, patient_count // practice_count + random.randint(-500, 500)),
        })
    practice_df = pd.DataFrame(practice_rows)

    provider_rows = []
    for i in range(provider_count):
        practice = random.choice(practice_rows)
        provider_type = random.choices(
            ["dentist", "specialist", "hygienist"],
            weights=[0.62, 0.08, 0.30],
        )[0]
        monthly_hours = random.uniform(90, 170) if provider_type != "hygienist" else random.uniform(95, 150)
        provider_rows.append({
            "provider_id": f"PROV-{i+1:04d}",
            "practice_id": practice["practice_id"],
            "provider_name": fake.name(),
            "provider_type": provider_type,
            "employment_type": random.choice(["employee", "associate", "contract"]),
            "monthly_clinical_hours": round(monthly_hours, 1),
            "compensation_model": random.choice(["salary", "production_percentage", "hybrid"]),
            "start_date": f"{random.randint(2015, 2025)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "status": "active" if random.random() > 0.06 else "inactive",
        })
    provider_df = pd.DataFrame(provider_rows)

    prod_rows = []
    util_rows = []
    patient_rows = []
    benchmark_rows = []

    utilization_target = profile.get("kpis", {}).get("schedule_utilization", {}).get("typical", 0.85)
    hygiene_target = profile.get("kpis", {}).get("hygiene_production_per_hour", {}).get("typical", 165)

    active_patients = patient_count
    hygiene_provider_count = max(1, len(provider_df[provider_df["provider_type"] == "hygienist"]))

    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        doctor_revenue = target_revenue * random.uniform(0.54, 0.64)
        hygiene_revenue = target_revenue * random.uniform(0.24, 0.33)
        specialty_other = max(0, target_revenue - doctor_revenue - hygiene_revenue)

        total_production = target_revenue * random.uniform(1.02, 1.10)
        collection_rate = min(0.99, target_revenue / total_production)

        # Scale hygiene hours off revenue so productivity stays in realistic bands as portfolio size changes.
        target_hygiene_pph = random.uniform(
            profile.get("kpis", {}).get("hygiene_production_per_hour", {}).get("min", 130),
            profile.get("kpis", {}).get("hygiene_production_per_hour", {}).get("max", 220),
        )
        hygiene_hours = hygiene_revenue / max(1, target_hygiene_pph)
        hygiene_pph = hygiene_revenue / hygiene_hours if hygiene_hours else 0

        prod_rows.append({
            "period": period,
            "doctor_production": round_currency(doctor_revenue),
            "hygiene_production": round_currency(hygiene_revenue),
            "specialty_other_production": round_currency(specialty_other),
            "total_production": round_currency(total_production),
            "total_collections": round_currency(target_revenue),
            "collection_rate": round(collection_rate, 4),
            "hygiene_hours": round(hygiene_hours, 1),
            "hygiene_production_per_hour": round_currency(hygiene_pph),
        })

        available_hours = practice_count * random.randint(220, 320)
        booked_hours = available_hours * random.uniform(max(0.70, utilization_target - 0.08), min(0.97, utilization_target + 0.07))
        utilization = booked_hours / available_hours if available_hours else 0

        recall_due = max(200, int(active_patients * random.uniform(0.04, 0.09)))
        recall_completed = int(recall_due * random.uniform(0.58, 0.82))
        no_show_rate = random.uniform(0.04, 0.12)

        util_rows.append({
            "period": period,
            "available_clinical_hours": round(available_hours, 1),
            "booked_clinical_hours": round(booked_hours, 1),
            "utilization_pct": round(utilization * 100, 2),
            "recall_due": recall_due,
            "recall_completed": recall_completed,
            "recall_completion_pct": round((recall_completed / recall_due) * 100 if recall_due else 0, 2),
            "no_show_rate_pct": round(no_show_rate * 100, 2),
        })

        new_patients = random.randint(max(30, practice_count * 20), max(180, practice_count * 60))
        reactivated = random.randint(max(5, practice_count * 3), max(80, practice_count * 22))
        attrition = random.randint(max(25, practice_count * 12), max(170, practice_count * 55))
        active_patients = max(1000, active_patients + new_patients + reactivated - attrition)

        patient_rows.append({
            "period": period,
            "new_patients": new_patients,
            "reactivated_patients": reactivated,
            "patient_attrition": attrition,
            "ending_active_patients": active_patients,
            "monthly_patient_growth_pct": round(((new_patients + reactivated - attrition) / max(1, active_patients)) * 100, 2),
        })

        benchmark_rows.append({
            "period": period,
            "hygiene_production_per_hour_actual": round_currency(hygiene_pph),
            "hygiene_production_per_hour_target": hygiene_target,
            "hygiene_gap_to_target": round_currency(hygiene_target - hygiene_pph),
            "utilization_actual_pct": round(utilization * 100, 2),
            "utilization_target_pct": round(utilization_target * 100, 2),
            "utilization_gap_pct": round(utilization_target * 100 - utilization * 100, 2),
        })

    production_df = pd.DataFrame(prod_rows)
    utilization_df = pd.DataFrame(util_rows)
    patient_flow_df = pd.DataFrame(patient_rows)
    benchmark_df = pd.DataFrame(benchmark_rows)

    last_ar = tb.iloc[-1]["acct_1100"]
    bucket_mix = {
        "Current": random.uniform(0.45, 0.60),
        "1-30 Days": random.uniform(0.18, 0.26),
        "31-60 Days": random.uniform(0.10, 0.16),
        "61-90 Days": random.uniform(0.06, 0.11),
        "Over 90 Days": 0,
    }
    known = sum(v for k, v in bucket_mix.items() if k != "Over 90 Days")
    bucket_mix["Over 90 Days"] = max(0.03, 1 - known)
    scale = sum(bucket_mix.values())
    bucket_mix = {k: v / scale for k, v in bucket_mix.items()}

    insurance_share = random.uniform(0.62, 0.80)
    patient_share = 1 - insurance_share

    ar_rows = []
    for bucket, pct in bucket_mix.items():
        total_amount = last_ar * pct
        insurance_amount = total_amount * insurance_share
        patient_amount = total_amount * patient_share
        ar_rows.append({
            "bucket": bucket,
            "insurance_amount": round_currency(insurance_amount),
            "patient_amount": round_currency(patient_amount),
            "total_amount": round_currency(total_amount),
            "percentage": round(pct * 100, 2),
        })
    ar_rows.append({
        "bucket": "Total",
        "insurance_amount": round_currency(sum(r["insurance_amount"] for r in ar_rows)),
        "patient_amount": round_currency(sum(r["patient_amount"] for r in ar_rows)),
        "total_amount": round_currency(last_ar),
        "percentage": 100.0,
    })
    insurance_ar_df = pd.DataFrame(ar_rows)

    return {
        "practice_master.xlsx": practice_df,
        "provider_roster.xlsx": provider_df,
        "provider_production_monthly.xlsx": production_df,
        "appointment_utilization_monthly.xlsx": utilization_df,
        "patient_flow_monthly.xlsx": patient_flow_df,
        "insurance_ar_aging.xlsx": insurance_ar_df,
        "benchmark_overlay_monthly.xlsx": benchmark_df,
    }


# ============================================================================
# Retail Industry Generator
# ============================================================================

def generate_retail(seed: dict, profile: dict, tb: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate retail-specific operations data."""

    sku_count = seed.get("operations", {}).get("sku_count", 500)
    store_count = seed.get("operations", {}).get("store_count", 5)

    # Generate product catalog
    categories = ["Apparel", "Accessories", "Footwear", "Home", "Electronics", "Beauty"]
    products = []
    for i in range(sku_count):
        cost = random.uniform(5, 200)
        products.append({
            "sku": f"SKU-{i+1:06d}",
            "product_name": f"{fake.word().capitalize()} {random.choice(['Basic', 'Premium', 'Classic', 'Modern', 'Luxe'])}",
            "category": random.choice(categories),
            "subcategory": f"{random.choice(['Men', 'Women', 'Kids', 'Unisex'])}",
            "unit_cost": round_currency(cost),
            "retail_price": round_currency(cost * random.uniform(2.0, 3.5)),
            "status": "active",
        })

    product_df = pd.DataFrame(products)

    # Generate store master
    stores = []
    for i in range(store_count):
        stores.append({
            "store_id": f"STR-{i+1:03d}",
            "store_name": f"Store #{i+1} - {fake.city()}",
            "address": fake.address().replace('\n', ', '),
            "sqft": random.randint(2000, 15000),
            "opened_date": f"{random.randint(2015, 2023)}-{random.randint(1,12):02d}-01",
            "manager": fake.name(),
        })

    store_df = pd.DataFrame(stores)

    # Generate sales transactions that tie to revenue
    transactions = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Generate transactions
        num_transactions = random.randint(500, 2000)
        amounts = split_amount_exact(target_revenue, num_transactions)

        for i, amount in enumerate(amounts):
            store = random.choice(stores)
            prod = random.choice(products)
            qty = max(1, int(amount / prod["retail_price"]))

            transactions.append({
                "transaction_id": f"TXN-{period.replace('-', '')}-{i+1:06d}",
                "transaction_date": f"{period}-{random.randint(1, 28):02d}",
                "store_id": store["store_id"],
                "sku": prod["sku"],
                "quantity": qty,
                "unit_price": prod["retail_price"],
                "amount": round_currency(amount),
                "payment_method": random.choice(["credit", "debit", "cash", "gift_card"]),
            })

    transaction_df = pd.DataFrame(transactions)

    # Daily sales summary
    daily_sales = transaction_df.groupby(["transaction_date", "store_id"]).agg({
        "amount": "sum",
        "quantity": "sum",
        "transaction_id": "count"
    }).reset_index()
    daily_sales.columns = ["date", "store_id", "sales_amount", "units_sold", "transaction_count"]

    # Inventory ledger (summary by period)
    inventory_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        for store in stores:
            inventory_value = random.uniform(50000, 200000)
            inventory_data.append({
                "period": period,
                "store_id": store["store_id"],
                "inventory_units": random.randint(1000, 5000),
                "inventory_value": round_currency(inventory_value),
                "shrink_pct": round(random.uniform(0.5, 2.5), 2),
            })

    inventory_df = pd.DataFrame(inventory_data)

    # Supplier master
    suppliers = []
    for i in range(30):
        suppliers.append({
            "supplier_id": f"SUP-{i+1:03d}",
            "supplier_name": fake.company(),
            "contact": fake.name(),
            "email": fake.email(),
            "lead_time_days": random.randint(14, 60),
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
            "categories": random.sample(categories, random.randint(1, 3)),
        })

    supplier_df = pd.DataFrame(suppliers)

    return {
        "product_catalog.xlsx": product_df,
        "store_master.xlsx": store_df,
        "sales_transactions.xlsx": transaction_df,
        "daily_sales_summary.xlsx": daily_sales,
        "inventory_ledger.xlsx": inventory_df,
        "supplier_master.xlsx": supplier_df,
    }


# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Generate operations data for M&A data room simulation"
    )
    parser.add_argument(
        "--seed-file",
        help="Path to company seed JSON file (default: <output-dir>/company_seed.json)"
    )
    parser.add_argument(
        "--output-dir",
        default=str(OUTPUT_DIR),
        help="Directory for generated outputs (default: output/)"
    )

    args = parser.parse_args()

    # Load seed
    output_dir = Path(args.output_dir)
    seed_path = Path(args.seed_file) if args.seed_file else (output_dir / "company_seed.json")
    if not seed_path.exists():
        print(f"Error: Seed file not found: {seed_path}")
        exit(1)

    seed = load_seed(seed_path)
    industry = seed["metadata"]["industry"]
    profile = load_profile(industry)

    print(f"Generating operations data for {seed['company']['name']} ({profile['display_name']})...")

    # Load trial balance for revenue targets
    tb = load_trial_balance(output_dir)

    # Industry dispatch
    generators = {
        "saas": generate_saas,
        "construction": generate_construction,
        "manufacturing": generate_manufacturing,
        "professional_services": generate_services,
        "retail": generate_retail,
        "dental": generate_dental,
    }

    if industry not in generators:
        print(f"Error: Unknown industry: {industry}")
        exit(1)

    # Generate data
    print(f"  Generating {industry} documents...")
    outputs = generators[industry](seed, profile, tb)

    # Save outputs
    output_dir.mkdir(parents=True, exist_ok=True)

    for filename, df in outputs.items():
        path = save_to_excel(df, filename, output_dir)
        print(f"    ✓ {filename} ({len(df)} rows)")

    # Validate revenue tie
    print("\n  Validating revenue tie...")
    total_pl_revenue = tb["total_revenue"].sum()

    if industry == "saas":
        ops_revenue = outputs["mrr_analysis.xlsx"]["total_mrr"].sum()
    elif industry == "construction":
        ops_revenue = outputs["wip_schedule.xlsx"]["revenue_recognized"].sum()
    elif industry == "manufacturing":
        ops_revenue = outputs["invoice_register.xlsx"]["amount"].sum()
    elif industry == "professional_services":
        ops_revenue = outputs["wip_schedule.xlsx"]["billed_revenue"].sum()
    elif industry == "retail":
        ops_revenue = outputs["sales_transactions.xlsx"]["amount"].sum()
    elif industry == "dental":
        ops_revenue = outputs["provider_production_monthly.xlsx"]["total_collections"].sum()

    variance = abs(total_pl_revenue - ops_revenue) / total_pl_revenue * 100

    if variance < 0.1:
        print(f"    ✓ Revenue ties within 0.1% (P&L: ${total_pl_revenue:,.0f}, Ops: ${ops_revenue:,.0f})")
    else:
        print(f"    ⚠ Revenue variance: {variance:.1f}% (P&L: ${total_pl_revenue:,.0f}, Ops: ${ops_revenue:,.0f})")

    print(f"\n✓ Operations data generated successfully!")


if __name__ == "__main__":
    main()
