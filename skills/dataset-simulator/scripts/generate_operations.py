#!/usr/bin/env python3
"""
Operations Data Generator for M&A Data Room Simulator (Overlay-Driven).

Generates industry-specific operational data based on document_triggers from deal_state.json:
- Universal: site_master, supplier_master, kpi_dashboard (always generated)
- SaaS (needs_mrr_analysis): customer master, subscription register, MRR analysis
- Construction (needs_wip_schedule): project master, WIP schedule, contract register
- Manufacturing (needs_inventory_ledger): product master, inventory ledger, BOM
- Professional Services (needs_timesheet_data): client master, engagement register, timesheets
- Retail (needs_store_master): product catalog, store master, sales transactions, inventory
- Dental (needs_provider_production): provider production, utilization, patient flow, insurance AR
- Fleet (needs_fleet_master): fleet master, route economics
- Lending (needs_loan_tape): loan tape, delinquency roll

CRITICAL: Sum of generated revenue must exactly match P&L revenue.

Usage:
    python generate_operations.py --output-dir <output_dir>
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
PROFILES_DIR = PROJECT_DIR / "references" / "profiles"


def load_deal_state(deal_state_path: Path) -> dict:
    """Load deal state from JSON file."""
    with open(deal_state_path) as f:
        return json.load(f)


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def load_trial_balance(output_dir: Path) -> pd.DataFrame:
    """Load trial balance from financial outputs."""
    tb_path = output_dir / "2.0-financial" / "trial_balance.xlsx"
    if not tb_path.exists():
        raise FileNotFoundError(f"Trial balance not found: {tb_path}")

    tb = pd.read_excel(tb_path)
    # Aggregate by period if multiple rows per period
    if 'period' in tb.columns and 'amount' in tb.columns:
        tb = tb.groupby('period')['amount'].sum().reset_index()
        tb.columns = ['period', 'total_revenue']
    elif 'period' not in tb.columns:
        raise ValueError("Trial balance must have 'period' column")

    return tb


def save_to_excel(df: pd.DataFrame, filename: str, output_dir: Path, sheet_name: str = "Data"):
    """Save DataFrame to Excel."""
    output_dir.mkdir(parents=True, exist_ok=True)
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
# Universal Generators (Always Generated)
# ============================================================================

def generate_site_master(deal_state: dict, output_dir: Path) -> None:
    """Generate site master from deal_state.sites."""
    sites_data = deal_state.get("sites", [])

    if not sites_data:
        # Generate default sites if not in deal_state
        sites_data = [
            {
                "site_id": "SITE-001",
                "site_name": f"{deal_state['company']['name']} HQ",
                "address": deal_state.get("company", {}).get("address", "123 Main St"),
                "city": "New York",
                "state": "NY",
                "type": "headquarters",
                "sqft": 50000,
                "employees": deal_state.get("financials", {}).get("headcount", 100),
                "status": "operational",
                "primary_function": "corporate office",
            }
        ]

    site_df = pd.DataFrame(sites_data)
    save_to_excel(site_df, "site_master.xlsx", output_dir)


def generate_supplier_master(deal_state: dict, output_dir: Path) -> None:
    """Generate supplier master from deal_state.vendors_seed."""
    vendors_data = deal_state.get("vendors_seed", [])

    if not vendors_data:
        # Generate default vendors if not in deal_state
        vendors_data = []
        for i in range(5):
            vendors_data.append({
                "vendor_id": f"VEND-{i+1:03d}",
                "vendor_name": fake.company(),
                "category": random.choice(["Supplies", "Services", "Materials", "Equipment"]),
                "annual_spend": round_currency(random.uniform(10000, 500000)),
                "pct_of_total": round_currency(100 / 5),
                "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
                "primary_contact": fake.name(),
                "contract_status": "active",
            })

    vendor_df = pd.DataFrame(vendors_data)
    save_to_excel(vendor_df, "supplier_master.xlsx", output_dir)


def generate_kpi_dashboard(deal_state: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate KPI dashboard with monthly trends."""
    kpis = deal_state.get("profile", {}).get("kpis", [])

    kpi_data = []

    # Generate monthly KPIs for each defined KPI
    for kpi_def in kpis:
        kpi_name = kpi_def.get("name", "KPI")
        min_val = kpi_def.get("min", 50)
        max_val = kpi_def.get("max", 150)
        target = kpi_def.get("target", (min_val + max_val) / 2)
        unit = kpi_def.get("unit", "%")

        # Generate realistic trending values
        values = np.linspace(min_val, max_val, len(tb))
        values = values + np.random.normal(0, (max_val - min_val) * 0.05, len(values))
        values = np.clip(values, min_val, max_val)

        for idx, row in tb.iterrows():
            period = row["period"]
            value = round(values[idx], 2)
            variance = round(((value - target) / target * 100) if target > 0 else 0, 1)

            kpi_data.append({
                "period": period,
                "kpi_name": kpi_name,
                "value": value,
                "unit": unit,
                "target": target,
                "variance_pct": variance,
            })

    if kpi_data:
        kpi_df = pd.DataFrame(kpi_data)
        save_to_excel(kpi_df, "kpi_dashboard.xlsx", output_dir)


# ============================================================================
# SaaS Generator → generate_subscription_ops
# ============================================================================

def generate_subscription_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate SaaS subscription operations data."""

    customer_count = deal_state.get("operations", {}).get("customer_count", 100)

    # Generate customer master
    customers = []
    for i in range(customer_count):
        signup_period_idx = random.randint(0, len(tb) - 1)
        signup_date = tb.iloc[signup_period_idx]["period"] + "-15"

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

    # Generate subscription register
    subscriptions = []
    plans = {
        "starter": {"min_mrr": 50, "max_mrr": 200},
        "professional": {"min_mrr": 200, "max_mrr": 1000},
        "enterprise": {"min_mrr": 1000, "max_mrr": 10000},
    }

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

    # Generate MRR analysis tied to P&L
    mrr_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        period_date = datetime.strptime(period + "-01", "%Y-%m-%d")
        active_subs = subscription_df[
            (pd.to_datetime(subscription_df["start_date"]) <= period_date) &
            ((subscription_df["end_date"].isna()) |
             (pd.to_datetime(subscription_df["end_date"]) >= period_date))
        ]

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

    # Product plan master
    products = [
        {"plan_id": "PLAN-001", "name": "Starter", "monthly_price": 99, "annual_price": 990, "features": "Basic features"},
        {"plan_id": "PLAN-002", "name": "Professional", "monthly_price": 299, "annual_price": 2990, "features": "Advanced features"},
        {"plan_id": "PLAN-003", "name": "Enterprise", "monthly_price": 999, "annual_price": 9990, "features": "Full platform"},
    ]
    product_df = pd.DataFrame(products)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(customer_df, "customer_master.xlsx", ops_dir)
    save_to_excel(subscription_df, "subscription_register.xlsx", ops_dir)
    save_to_excel(mrr_df, "mrr_analysis.xlsx", ops_dir)
    save_to_excel(invoice_df, "invoice_register.xlsx", ops_dir)
    save_to_excel(product_df, "product_plan_master.xlsx", ops_dir)


# ============================================================================
# Construction Generator → generate_project_ops
# ============================================================================

def generate_project_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate construction/project operations data."""

    project_count = deal_state.get("operations", {}).get("project_count", 20)

    # Generate project master
    projects = []
    for i in range(project_count):
        start_idx = random.randint(0, max(0, len(tb) - 12))
        duration = random.randint(6, 24)
        end_idx = min(start_idx + duration, len(tb) - 1)

        contract_value = random.uniform(100000, 5000000)
        completion_pct = random.uniform(0.3, 1.0) if end_idx < len(tb) - 1 else random.uniform(0.2, 0.95)

        projects.append({
            "project_id": f"PRJ-{i+1:04d}",
            "project_name": f"{fake.company()} - {random.choice(['Office', 'Warehouse', 'Retail', 'Industrial'])} {random.choice(['Renovation', 'New Construction', 'Expansion'])}",
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

    # Generate WIP schedule
    wip_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

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
            "change_orders": round_currency(p["contract_value"] * random.uniform(-0.05, 0.10)),
            "current_value": p["contract_value"],
            "billings_to_date": round_currency(p["contract_value"] * random.uniform(0.3, 0.95)),
            "collections_to_date": round_currency(p["contract_value"] * random.uniform(0.2, 0.9)),
        })

    contract_df = pd.DataFrame(contracts)

    # Subcontractor register
    subcontractors = []
    for i in range(random.randint(5, 15)):
        subcontractors.append({
            "subcontractor_id": f"SUB-{i+1:03d}",
            "subcontractor_name": fake.company(),
            "trade": random.choice(["Electrical", "HVAC", "Plumbing", "Structural", "Concrete", "Carpentry"]),
            "license_number": f"{random.randint(100000, 999999)}",
            "contact_person": fake.name(),
            "phone": fake.phone_number(),
        })

    subcontractor_df = pd.DataFrame(subcontractors)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(project_df, "project_master.xlsx", ops_dir)
    save_to_excel(wip_df, "wip_schedule.xlsx", ops_dir)
    save_to_excel(contract_df, "contract_register.xlsx", ops_dir)
    save_to_excel(subcontractor_df, "subcontractor_register.xlsx", ops_dir)


# ============================================================================
# Manufacturing Generator → generate_product_ops
# ============================================================================

def generate_product_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate manufacturing operations data."""

    product_count = deal_state.get("operations", {}).get("product_count", 50)
    customer_count = deal_state.get("operations", {}).get("customer_count", 100)

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

    # Generate invoice register
    invoices = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

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

    # Bill of materials
    bom_data = []
    for prod in products[:20]:
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

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(product_df, "product_master.xlsx", ops_dir)
    save_to_excel(customer_df, "customer_master.xlsx", ops_dir)
    save_to_excel(invoice_df, "invoice_register.xlsx", ops_dir)
    save_to_excel(inventory_df, "inventory_ledger.xlsx", ops_dir)
    save_to_excel(bom_df, "bill_of_materials.xlsx", ops_dir)


# ============================================================================
# Professional Services Generator → generate_services_ops
# ============================================================================

def generate_services_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate professional services operations data."""

    client_count = deal_state.get("operations", {}).get("client_count", 75)
    headcount = deal_state.get("financials_seed", {}).get("headcount", 50)

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

    # Generate staff
    staff_levels = profile.get("staff_levels", [
        {"level": "Partner", "rate_multiplier": 3.0},
        {"level": "Director", "rate_multiplier": 2.0},
        {"level": "Manager", "rate_multiplier": 1.5},
        {"level": "Senior", "rate_multiplier": 1.2},
        {"level": "Associate", "rate_multiplier": 1.0},
    ])

    base_rate = 150
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
            "hourly_rate": round_currency(base_rate * level_info["rate_multiplier"]),
            "billing_rate": round_currency(base_rate * level_info["rate_multiplier"] * 1.8),
            "status": "active" if random.random() > 0.05 else "inactive",
        })

    staff_df = pd.DataFrame(staff)

    # Generate engagement register
    engagements = []
    for i in range(random.randint(15, 30)):
        start_idx = random.randint(0, max(0, len(tb) - 12))
        duration = random.randint(3, 12)
        end_idx = min(start_idx + duration, len(tb) - 1)

        budget = random.uniform(50000, 500000)
        billings = budget * random.uniform(0.7, 1.1)

        engagements.append({
            "engagement_id": f"ENG-{i+1:04d}",
            "client_id": f"CLI-{random.randint(1, client_count):04d}",
            "engagement_type": random.choice(["project", "retainer", "advisory"]),
            "start_date": tb.iloc[start_idx]["period"] + "-01",
            "end_date": tb.iloc[end_idx]["period"] + "-28",
            "budget": round_currency(budget),
            "billings_to_date": round_currency(billings),
            "margin": round(((billings - budget) / budget * 100) if budget > 0 else 0, 1),
        })

    engagement_df = pd.DataFrame(engagements)

    # Generate timesheet data
    timesheet_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        num_entries = random.randint(200, 500)
        amounts = split_amount_exact(target_revenue, num_entries)

        for i, amount in enumerate(amounts):
            emp = random.choice(staff)
            hours = amount / emp["billing_rate"]

            timesheet_data.append({
                "timesheet_id": f"TS-{period.replace('-', '')}-{i+1:05d}",
                "staff_id": emp["staff_id"],
                "staff_name": emp["name"],
                "period": period,
                "hours_billable": round(hours, 1),
                "billing_rate": emp["billing_rate"],
                "billable_amount": round_currency(amount),
                "client_id": f"CLI-{random.randint(1, client_count):04d}",
            })

    timesheet_df = pd.DataFrame(timesheet_data)

    # WIP schedule
    wip_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        costs_incurred = target_revenue * random.uniform(0.55, 0.70)
        billings = target_revenue * random.uniform(0.90, 1.10)

        if costs_incurred > billings:
            wip_asset = costs_incurred - billings
            wip_liability = 0
        else:
            wip_asset = 0
            wip_liability = billings - costs_incurred

        wip_data.append({
            "period": period,
            "billed_revenue": round_currency(target_revenue),
            "costs_incurred": round_currency(costs_incurred),
            "gross_profit": round_currency(target_revenue - costs_incurred),
            "unbilled_revenue": round_currency(wip_asset),
            "deferred_revenue": round_currency(wip_liability),
        })

    wip_df = pd.DataFrame(wip_data)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(client_df, "client_master.xlsx", ops_dir)
    save_to_excel(staff_df, "staff_master.xlsx", ops_dir)
    save_to_excel(engagement_df, "engagement_register.xlsx", ops_dir)
    save_to_excel(timesheet_df, "timesheet_data.xlsx", ops_dir)
    save_to_excel(wip_df, "wip_schedule.xlsx", ops_dir)


# ============================================================================
# Retail Generator → generate_retail_ops
# ============================================================================

def generate_retail_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate retail operations data."""

    sku_count = deal_state.get("operations", {}).get("sku_count", 500)
    store_count = deal_state.get("operations", {}).get("store_count", 5)

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

    # Generate sales transactions
    transactions = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        num_transactions = random.randint(500, 2000)
        amounts = split_amount_exact(target_revenue, num_transactions)

        for i, amount in enumerate(amounts):
            store = random.choice(stores)
            prod = random.choice(products)
            qty = max(1, int(amount / prod["retail_price"]))

            trans_date = f"{period}-{random.randint(1, 28):02d}"
            transactions.append({
                "transaction_id": f"TXN-{period.replace('-', '')}-{i+1:06d}",
                "transaction_date": trans_date,
                "store_id": store["store_id"],
                "store_name": store["store_name"],
                "sku": prod["sku"],
                "product_name": prod["product_name"],
                "quantity": qty,
                "unit_price": prod["retail_price"],
                "amount": round_currency(amount),
                "discount_pct": round(random.uniform(0, 0.20) * 100, 1),
                "payment_method": random.choice(["cash", "card", "check"]),
            })

    transaction_df = pd.DataFrame(transactions)

    # Daily sales summary
    daily_sales = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # ~25 days of sales per month
        num_days = random.randint(20, 25)
        daily_amounts = split_amount_exact(target_revenue, num_days)

        period_dt = datetime.strptime(period + "-01", "%Y-%m-%d")
        days_in_month = (period_dt.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)

        for d in range(1, days_in_month.day + 1):
            if len(daily_sales) < len(daily_amounts):
                date_str = f"{period}-{d:02d}"
                daily_sales.append({
                    "date": date_str,
                    "total_sales": daily_amounts[len(daily_sales)] if len(daily_sales) < len(daily_amounts) else 0,
                    "transaction_count": random.randint(20, 100),
                    "average_transaction": round_currency(daily_amounts[len(daily_sales)] / random.randint(20, 100)) if len(daily_sales) < len(daily_amounts) else 0,
                })

    daily_sales_df = pd.DataFrame(daily_sales)

    # Inventory ledger
    inventory_data = []
    for prod in products:
        for _, row in tb.iterrows():
            period = row["period"]
            on_hand = random.randint(10, 100)
            inventory_data.append({
                "period": period,
                "sku": prod["sku"],
                "product_name": prod["product_name"],
                "quantity_on_hand": on_hand,
                "unit_cost": prod["unit_cost"],
                "total_value": round_currency(on_hand * prod["unit_cost"]),
            })

    inventory_df = pd.DataFrame(inventory_data)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(product_df, "product_catalog.xlsx", ops_dir)
    save_to_excel(store_df, "store_master.xlsx", ops_dir)
    save_to_excel(transaction_df, "sales_transactions.xlsx", ops_dir)
    save_to_excel(daily_sales_df, "daily_sales.xlsx", ops_dir)
    save_to_excel(inventory_df, "inventory_ledger.xlsx", ops_dir)


# ============================================================================
# Dental Provider Generator → generate_provider_ops
# ============================================================================

def generate_provider_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate dental provider operations data."""

    provider_count = deal_state.get("operations", {}).get("provider_count", 15)

    # Generate practice master
    practices = []
    for i in range(1):  # Typically one practice
        practices.append({
            "practice_id": f"PRAC-{i+1:03d}",
            "practice_name": seed.get("company", {}).get("name", "Dental Practice"),
            "address": seed.get("company", {}).get("address", "123 Main St"),
            "phone": fake.phone_number(),
            "established_year": random.randint(2000, 2020),
            "num_operatories": random.randint(4, 12),
            "hours_per_week": random.randint(30, 50),
        })

    practice_df = pd.DataFrame(practices)

    # Generate provider roster
    providers = []
    for i in range(provider_count):
        specialties = ["General Dentistry", "Orthodontics", "Periodontics", "Pediatric Dentistry", "Oral Surgery", "Endodontics"]
        providers.append({
            "provider_id": f"PROV-{i+1:03d}",
            "provider_name": fake.name(),
            "license_number": f"DDS-{random.randint(100000, 999999)}",
            "specialty": random.choice(specialties),
            "part_time": random.random() < 0.3,
            "hire_date": f"{random.randint(2010, 2023)}-{random.randint(1,12):02d}-01",
        })

    provider_df = pd.DataFrame(providers)

    # Generate patient flow
    patient_flow = []
    for _, row in tb.iterrows():
        period = row["period"]
        new_patients = random.randint(20, 80)
        recall_appointments = random.randint(100, 300)
        cancellations = random.randint(10, 40)

        patient_flow.append({
            "period": period,
            "new_patients": new_patients,
            "recall_appointments": recall_appointments,
            "recall_attended": int(recall_appointments * random.uniform(0.70, 0.85)),
            "cancellations": cancellations,
            "no_shows": random.randint(5, 20),
        })

    patient_flow_df = pd.DataFrame(patient_flow)

    # Generate production (revenue by provider)
    production = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        # Distribute across providers
        num_providers_active = random.randint(int(provider_count * 0.7), provider_count)
        amounts = split_amount_exact(target_revenue, num_providers_active)

        for i, amount in enumerate(amounts):
            provider = providers[i % len(providers)]
            production.append({
                "period": period,
                "provider_id": provider["provider_id"],
                "provider_name": provider["provider_name"],
                "production": round_currency(amount),
                "collections": round_currency(amount * random.uniform(0.85, 1.0)),
                "average_daily_production": round_currency(amount / 20),
            })

    production_df = pd.DataFrame(production)

    # Generate utilization
    utilization = []
    for _, row in tb.iterrows():
        period = row["period"]

        for provider in providers:
            utilization.append({
                "period": period,
                "provider_id": provider["provider_id"],
                "provider_name": provider["provider_name"],
                "scheduled_hours": random.randint(80, 200),
                "actual_hours": random.randint(60, 200),
                "utilization_pct": round(random.uniform(0.65, 0.95) * 100, 1),
            })

    utilization_df = pd.DataFrame(utilization)

    # Insurance AR
    insurance_ar = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        ar = target_revenue * random.uniform(0.20, 0.35)
        aging = {
            "current": ar * random.uniform(0.50, 0.70),
            "30_days": ar * random.uniform(0.15, 0.30),
            "60_days": ar * random.uniform(0.05, 0.20),
            "90_plus": ar * random.uniform(0.02, 0.10),
        }

        insurance_ar.append({
            "period": period,
            "total_insurance_ar": round_currency(ar),
            "current": round_currency(aging["current"]),
            "ar_30_days": round_currency(aging["30_days"]),
            "ar_60_days": round_currency(aging["60_days"]),
            "ar_90_plus": round_currency(aging["90_plus"]),
        })

    insurance_ar_df = pd.DataFrame(insurance_ar)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(practice_df, "practice_master.xlsx", ops_dir)
    save_to_excel(provider_df, "provider_roster.xlsx", ops_dir)
    save_to_excel(production_df, "provider_production_monthly.xlsx", ops_dir)
    save_to_excel(utilization_df, "provider_utilization.xlsx", ops_dir)
    save_to_excel(patient_flow_df, "patient_flow.xlsx", ops_dir)
    save_to_excel(insurance_ar_df, "insurance_ar_aging.xlsx", ops_dir)


# ============================================================================
# Fleet Stub Generator → generate_fleet_ops
# ============================================================================

def generate_fleet_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate fleet operations data (stub implementation)."""

    fleet_size = deal_state.get("operations", {}).get("fleet_size", 50)

    # Fleet master
    fleet = []
    for i in range(fleet_size):
        fleet.append({
            "vehicle_id": f"VEH-{i+1:05d}",
            "vin": fake.bothify(text="???##?##?#?##?##?##"),
            "vehicle_type": random.choice(["Truck", "Van", "Car", "Tractor", "Trailer"]),
            "year": random.randint(2015, 2023),
            "make": random.choice(["Ford", "Chevy", "GMC", "Volvo", "Peterbilt"]),
            "purchase_price": round_currency(random.uniform(20000, 150000)),
            "current_mileage": random.randint(10000, 500000),
            "status": random.choice(["active", "maintenance", "retired"]),
            "assigned_driver": fake.name() if random.random() > 0.2 else None,
        })

    fleet_df = pd.DataFrame(fleet)

    # Route economics
    route_data = []
    for _, row in tb.iterrows():
        period = row["period"]
        target_revenue = row["total_revenue"]

        num_routes = random.randint(20, 50)
        amounts = split_amount_exact(target_revenue, num_routes)

        for i, amount in enumerate(amounts):
            fuel_cost = amount * random.uniform(0.15, 0.25)
            maintenance = amount * random.uniform(0.05, 0.10)

            route_data.append({
                "period": period,
                "route_id": f"ROUTE-{i+1:04d}",
                "revenue": round_currency(amount),
                "fuel_cost": round_currency(fuel_cost),
                "maintenance_cost": round_currency(maintenance),
                "driver_cost": round_currency(amount * random.uniform(0.20, 0.30)),
                "net_margin": round_currency(amount - fuel_cost - maintenance - (amount * random.uniform(0.20, 0.30))),
            })

    route_df = pd.DataFrame(route_data)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(fleet_df, "fleet_master.xlsx", ops_dir)
    save_to_excel(route_df, "route_economics.xlsx", ops_dir)


# ============================================================================
# Lending Stub Generator → generate_lending_ops
# ============================================================================

def generate_lending_ops(deal_state: dict, profile: dict, tb: pd.DataFrame, output_dir: Path) -> None:
    """Generate lending operations data (stub implementation)."""

    loan_count = deal_state.get("operations", {}).get("loan_count", 200)

    # Loan tape
    loans = []
    for i in range(loan_count):
        origination_date = f"{random.randint(2018, 2023)}-{random.randint(1,12):02d}-01"
        original_balance = random.uniform(10000, 500000)
        current_balance = original_balance * random.uniform(0.3, 1.0)

        loans.append({
            "loan_id": f"LN-{i+1:06d}",
            "borrower_name": fake.company(),
            "loan_type": random.choice(["Term Loan", "Line of Credit", "Equipment Loan", "Real Estate Loan"]),
            "origination_date": origination_date,
            "original_balance": round_currency(original_balance),
            "current_balance": round_currency(current_balance),
            "interest_rate": round(random.uniform(0.03, 0.10) * 100, 2),
            "term_months": random.choice([12, 24, 36, 60, 84]),
            "status": random.choice(["performing", "30_days_past", "60_days_past", "charged_off"]),
            "credit_score": random.randint(550, 800),
        })

    loan_df = pd.DataFrame(loans)

    # Delinquency roll
    delinquency = []
    for _, row in tb.iterrows():
        period = row["period"]

        total_loans = len(loans)
        current = int(total_loans * random.uniform(0.85, 0.95))
        days_30 = int(total_loans * random.uniform(0.02, 0.05))
        days_60 = int(total_loans * random.uniform(0.01, 0.03))
        days_90 = int(total_loans * random.uniform(0.01, 0.05))
        charged_off = total_loans - current - days_30 - days_60 - days_90

        delinquency.append({
            "period": period,
            "current": current,
            "30_days_past_due": days_30,
            "60_days_past_due": days_60,
            "90_days_past_due": days_90,
            "charged_off": max(0, charged_off),
            "total_loans": total_loans,
            "delinquency_rate_pct": round(((days_30 + days_60 + days_90) / total_loans * 100) if total_loans > 0 else 0, 2),
        })

    delinquency_df = pd.DataFrame(delinquency)

    # Save outputs
    ops_dir = output_dir / "5.0-operations"
    save_to_excel(loan_df, "loan_tape.xlsx", ops_dir)
    save_to_excel(delinquency_df, "delinquency_roll.xlsx", ops_dir)


# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="Generate overlay-driven operations data from deal_state.json"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Directory containing deal_state.json and financial outputs"
    )

    args = parser.parse_args()
    output_dir = Path(args.output_dir)

    # Load deal state
    deal_state_path = output_dir / "deal_state.json"
    if not deal_state_path.exists():
        print(f"Error: deal_state.json not found: {deal_state_path}")
        exit(1)

    deal_state = load_deal_state(deal_state_path)

    print(f"Generating overlay-driven operations data for {deal_state['company']['name']}...")

    # Load trial balance for revenue targets
    tb = load_trial_balance(output_dir)

    # Create operations output directory
    ops_dir = output_dir / "5.0-operations"
    ops_dir.mkdir(parents=True, exist_ok=True)

    # Get document triggers
    triggers = deal_state.get("document_triggers", {})

    # Load profile from disk
    industry = deal_state["company"]["industry"]
    profile_path = Path(__file__).parent.parent / "references" / "profiles" / f"{industry}.json"
    if profile_path.exists():
        import json
        with open(profile_path) as f:
            profile = json.load(f)
    else:
        profile = {}

    print("\n  Generating universal files...")

    # Always generate universal operations files
    generate_site_master(deal_state, output_dir)
    print("    ✓ site_master.xlsx")

    generate_supplier_master(deal_state, output_dir)
    print("    ✓ supplier_master.xlsx")

    generate_kpi_dashboard(deal_state, tb, output_dir)
    print("    ✓ kpi_dashboard.xlsx")

    print("\n  Generating overlay-driven files based on triggers...")

    # Overlay-driven generation
    if triggers.get("needs_mrr_analysis"):
        print("    Generating subscription operations...")
        generate_subscription_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Customer master, subscription register, MRR analysis, invoices, product plan master")

    if triggers.get("needs_wip_schedule"):
        print("    Generating project operations...")
        generate_project_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Project master, WIP schedule, contract register, subcontractor register")

    if triggers.get("needs_inventory_ledger"):
        print("    Generating product operations...")
        generate_product_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Product master, customer master, invoices, inventory ledger, BOM")

    if triggers.get("needs_timesheet_data"):
        print("    Generating professional services operations...")
        generate_services_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Client master, staff master, engagement register, timesheets, WIP schedule")

    if triggers.get("needs_provider_production"):
        print("    Generating dental provider operations...")
        generate_provider_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Practice master, provider roster, production, utilization, patient flow, insurance AR")

    if triggers.get("needs_store_master"):
        print("    Generating retail operations...")
        generate_retail_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Product catalog, store master, sales transactions, daily sales, inventory ledger")

    if triggers.get("needs_fleet_master"):
        print("    Generating fleet operations...")
        generate_fleet_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Fleet master, route economics")

    if triggers.get("needs_loan_tape"):
        print("    Generating lending operations...")
        generate_lending_ops(deal_state, profile, tb, output_dir)
        print("    ✓ Loan tape, delinquency roll")

    print(f"\n✓ Operations data generated successfully in {ops_dir}")


if __name__ == "__main__":
    main()
