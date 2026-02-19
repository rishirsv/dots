#!/usr/bin/env python3
"""
Financial Data Generator for M&A Data Room Simulator.

Generates trial balance and financial statements that tie together perfectly:
- Monthly trial balance (3-5 years of history)
- Income statement
- Balance sheet
- Cash flow statement (indirect method)
- Supporting schedules (AR aging, AP aging, fixed assets, debt, NWC)

All data is internally consistent:
- Debits = Credits every period
- Assets = Liabilities + Equity
- Revenue detail ties to P&L

Usage:
    python generate_financials.py [--seed-file path/to/company_seed.json]
"""

import argparse
import json
import random
from datetime import datetime, date
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Tuple

import pandas as pd
import numpy as np

# Constants
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
    """Round to 2 decimal places for currency."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def generate_monthly_seasonality(profile: dict, num_months: int, start_year: int) -> List[float]:
    """Generate seasonality multipliers for each month."""
    patterns = profile.get("seasonality_patterns", {})

    # Check for monthly pattern first
    if "monthly" in patterns:
        monthly = patterns["monthly"]
        months_order = ["jan", "feb", "mar", "apr", "may", "jun",
                       "jul", "aug", "sep", "oct", "nov", "dec"]
        base_pattern = [monthly.get(m, 1/12) for m in months_order]
    else:
        # Use quarterly pattern
        q1 = patterns.get("q1", 0.25)
        q2 = patterns.get("q2", 0.25)
        q3 = patterns.get("q3", 0.25)
        q4 = patterns.get("q4", 0.25)

        # Distribute quarters evenly across months
        base_pattern = [
            q1/3, q1/3, q1/3,  # Jan, Feb, Mar
            q2/3, q2/3, q2/3,  # Apr, May, Jun
            q3/3, q3/3, q3/3,  # Jul, Aug, Sep
            q4/3, q4/3, q4/3,  # Oct, Nov, Dec
        ]

    # Repeat for all months
    multipliers = []
    for i in range(num_months):
        month_idx = i % 12
        # Add some random variation (+/- 5%)
        variation = random.uniform(0.95, 1.05)
        multipliers.append(base_pattern[month_idx] * variation)

    # Normalize so they sum to num_months / 12 (average of 1 per month)
    total = sum(multipliers)
    target = num_months / 12
    multipliers = [m * (target / total) * 12 for m in multipliers]

    return multipliers


def generate_growth_curve(
    num_months: int,
    start_revenue: float,
    end_revenue: float,
    volatility: float = 0.02
) -> List[float]:
    """Generate revenue growth curve with some randomness."""
    # Calculate monthly growth rate
    total_growth = end_revenue / start_revenue
    monthly_growth = total_growth ** (1 / num_months)

    revenues = []
    current = start_revenue / 12  # Monthly revenue

    for i in range(num_months):
        # Add some volatility
        noise = random.gauss(0, volatility)
        current *= (monthly_growth + noise)
        current = max(current, start_revenue / 12 * 0.5)  # Floor at 50% of starting
        revenues.append(current)

    return revenues


def generate_month_sequence(start_period: str, end_period: str) -> List[str]:
    """Generate an inclusive YYYY-MM period sequence."""
    start_date = datetime.strptime(start_period, "%Y-%m")
    end_date = datetime.strptime(end_period, "%Y-%m")

    if start_date > end_date:
        raise ValueError("--start-period must be on or before --end-period")

    periods = []
    current_year = start_date.year
    current_month = start_date.month
    while current_year < end_date.year or (current_year == end_date.year and current_month <= end_date.month):
        periods.append(f"{current_year}-{current_month:02d}")
        current_month += 1
        if current_month > 12:
            current_month = 1
            current_year += 1

    return periods


def build_event_impact_schedule(seed: dict, months: List[str]) -> pd.DataFrame:
    """Build month-level revenue and opex adjustments from seed events."""
    events = seed.get("events", [])
    month_set = set(months)

    grouped = {}
    for period in months:
        grouped[period] = {
            "one_time_revenue_annualized": 0.0,
            "recurring_revenue_start_annualized": 0.0,
            "financial_impact": 0.0,
            "event_count": 0,
        }

    for event in events:
        event_date = event.get("date")
        if not event_date or len(event_date) < 7:
            continue
        period = event_date[:7]
        if period not in month_set:
            continue

        grouped[period]["event_count"] += 1

        revenue_impact = float(event.get("revenue_impact", 0) or 0)
        if revenue_impact != 0:
            if event.get("recurring"):
                grouped[period]["recurring_revenue_start_annualized"] += revenue_impact
            else:
                grouped[period]["one_time_revenue_annualized"] += revenue_impact

        grouped[period]["financial_impact"] += float(event.get("financial_impact", 0) or 0)

    rows = []
    running_recurring_monthly = 0.0
    for period in months:
        row = grouped[period]
        running_recurring_monthly += row["recurring_revenue_start_annualized"] / 12.0
        one_time_monthly = row["one_time_revenue_annualized"] / 12.0
        revenue_adjustment = one_time_monthly + running_recurring_monthly

        # Negative financial impact means expense; positive means benefit.
        opex_adjustment = -row["financial_impact"]

        rows.append({
            "period": period,
            "one_time_revenue_monthly": round_currency(one_time_monthly),
            "running_recurring_revenue_monthly": round_currency(running_recurring_monthly),
            "revenue_adjustment": round_currency(revenue_adjustment),
            "financial_impact": round_currency(row["financial_impact"]),
            "opex_adjustment": round_currency(opex_adjustment),
            "event_count": row["event_count"],
        })

    return pd.DataFrame(rows)


def generate_trial_balance(
    seed: dict,
    profile: dict,
    start_period: str = None,
    end_period: str = None
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Generate monthly trial balance."""

    financials = seed["financials"]
    realism_mode = seed["metadata"]["realism_mode"]

    # Determine date range
    if (start_period and not end_period) or (end_period and not start_period):
        raise ValueError("Use --start-period and --end-period together.")

    if start_period and end_period:
        months = generate_month_sequence(start_period, end_period)
        years_of_history = max(1, len(months) / 12)
    else:
        years_of_history = financials.get("years_of_history", 3)
        current_year = datetime.now().year
        start_year = current_year - years_of_history

        months = []
        for year in range(start_year, current_year + 1):
            for month in range(1, 13):
                if year == current_year and month > datetime.now().month:
                    break
                months.append(f"{year}-{month:02d}")

    num_months = len(months)
    start_year = int(months[0].split("-")[0])

    # Get chart of accounts
    coa = profile["chart_of_accounts"]
    event_impacts = build_event_impact_schedule(seed, months)
    event_impact_map = {
        row["period"]: row for _, row in event_impacts.iterrows()
    }

    # Calculate target revenues
    end_revenue = financials["annual_revenue"]
    # Assume 10-20% annual growth
    annual_growth = random.uniform(0.10, 0.20)
    start_revenue = end_revenue / ((1 + annual_growth) ** years_of_history)

    # Generate base revenue curve
    monthly_revenues = generate_growth_curve(num_months, start_revenue, end_revenue)

    # Apply seasonality
    seasonality = generate_monthly_seasonality(profile, num_months, start_year)
    monthly_revenues = [r * s for r, s in zip(monthly_revenues, seasonality)]

    # Initialize trial balance data
    tb_data = []

    # Track cumulative balance sheet items
    cumulative_retained_earnings = 0
    prev_ar = start_revenue / 12 * 0.15  # ~45 days DSO
    prev_ap = start_revenue / 12 * 0.08  # ~24 days DPO
    prev_inventory = 0
    prev_cash = start_revenue * 0.10  # 10% of revenue as starting cash

    gross_margin = financials["gross_margin"]

    # Industry-specific inventory
    has_inventory = profile["industry"] in ["manufacturing", "retail"]
    if has_inventory:
        prev_inventory = start_revenue * 0.15  # ~2 months of COGS

    for idx, month in enumerate(months):
        year, mo = map(int, month.split("-"))
        month_revenue = monthly_revenues[idx]

        event_row = event_impact_map.get(month, {})
        revenue_adjustment = float(event_row.get("revenue_adjustment", 0))
        opex_adjustment = float(event_row.get("opex_adjustment", 0))
        month_revenue = max(month_revenue + revenue_adjustment, (start_revenue / 12) * 0.2)

        # Calculate P&L items
        revenue_breakdown = {}
        total_revenue = 0
        for rev_acct in coa["revenue"]:
            acct_revenue = month_revenue * rev_acct["typical_pct"]
            revenue_breakdown[rev_acct["code"]] = round_currency(acct_revenue)
            total_revenue += acct_revenue

        # COGS
        cogs_breakdown = {}
        total_cogs = 0
        for cogs_acct in coa["cogs"]:
            acct_cogs = month_revenue * (1 - gross_margin) * (cogs_acct["typical_pct"] / sum(c["typical_pct"] for c in coa["cogs"]))
            cogs_breakdown[cogs_acct["code"]] = round_currency(acct_cogs)
            total_cogs += acct_cogs

        # OpEx
        opex_breakdown = {}
        total_opex = 0
        for opex_acct in coa["opex"]:
            acct_opex = month_revenue * opex_acct["typical_pct"]
            opex_breakdown[opex_acct["code"]] = round_currency(acct_opex)
            total_opex += acct_opex

        # Apply event opex impacts by reallocating account-level postings so TB remains balanced.
        if opex_breakdown and opex_adjustment != 0:
            base_total_opex = sum(opex_breakdown.values())
            adjusted = {}
            if base_total_opex > 0:
                for code, amount in opex_breakdown.items():
                    share = amount / base_total_opex
                    adjusted[code] = max(0.0, amount + (opex_adjustment * share))
            else:
                first_code = next(iter(opex_breakdown))
                for code, amount in opex_breakdown.items():
                    adjusted[code] = amount
                adjusted[first_code] = max(0.0, adjusted[first_code] + opex_adjustment)

            # Round and force exact total tie after rounding.
            rounded_adjusted = {code: round_currency(value) for code, value in adjusted.items()}
            target_total = round_currency(sum(adjusted.values()))
            rounded_total = round_currency(sum(rounded_adjusted.values()))
            rounding_delta = round_currency(target_total - rounded_total)
            if abs(rounding_delta) > 0:
                first_code = next(iter(rounded_adjusted))
                rounded_adjusted[first_code] = round_currency(rounded_adjusted[first_code] + rounding_delta)

            opex_breakdown = rounded_adjusted
            total_opex = sum(opex_breakdown.values())

        # Calculate net income
        gross_profit = total_revenue - total_cogs
        net_income = gross_profit - total_opex

        # Balance sheet items
        # AR: ~45 days DSO on average
        dso = random.uniform(40, 50)
        new_ar = month_revenue * (dso / 30)
        ar_collections = prev_ar + month_revenue - new_ar

        # AP: ~30 days DPO on average
        dpo = random.uniform(25, 35)
        new_ap = (total_cogs + total_opex * 0.3) * (dpo / 30)
        ap_payments = prev_ap + (total_cogs + total_opex * 0.3) - new_ap

        # Inventory (if applicable)
        inventory_change = 0
        if has_inventory:
            # Inventory turns ~6x/year = 2 months of COGS
            target_inventory = (total_cogs * 12) / 6
            inventory_change = (target_inventory - prev_inventory) * random.uniform(0.1, 0.3)
            new_inventory = prev_inventory + inventory_change
        else:
            new_inventory = 0

        # Fixed assets (relatively stable, slight growth)
        fixed_assets = start_revenue * 0.15 * (1 + idx * 0.002)
        depreciation_expense = fixed_assets * 0.3 / num_months  # Monthly depreciation
        accum_depreciation = fixed_assets * 0.3 * ((idx + 1) / num_months)

        # Prepaid expenses
        prepaid = month_revenue * 0.02

        # Accrued expenses
        accrued = month_revenue * 0.03

        # Deferred revenue (for SaaS)
        if profile["industry"] == "saas":
            deferred_revenue = month_revenue * random.uniform(0.8, 1.5)
        else:
            deferred_revenue = month_revenue * 0.05

        # Equity - common stock is static
        common_stock = start_revenue * 0.05

        # Update cumulative retained earnings FIRST (this is what makes the balance sheet balance!)
        # Retained earnings = cumulative sum of all net income since founding
        cumulative_retained_earnings += net_income

        # Calculate total equity
        total_equity = common_stock + cumulative_retained_earnings

        # Calculate total liabilities (before any financing adjustment)
        base_liabilities = new_ap + accrued + deferred_revenue

        # Calculate non-cash assets
        non_cash_assets = new_ar + new_inventory + prepaid + fixed_assets - accum_depreciation

        # BALANCE SHEET IDENTITY: Assets = Liabilities + Equity
        # Therefore: Cash = (Liabilities + Equity) - Non-cash Assets
        required_cash = base_liabilities + total_equity - non_cash_assets

        # If required cash is negative, we need debt financing to maintain positive cash
        if required_cash < month_revenue * 0.02:  # Minimum cash = 2% of monthly revenue
            min_cash = month_revenue * 0.02
            line_of_credit = min_cash - required_cash
            new_cash = min_cash
            total_liabilities = base_liabilities + line_of_credit
        else:
            line_of_credit = 0
            new_cash = required_cash
            total_liabilities = base_liabilities

        # Verify the balance sheet balances
        total_assets = new_cash + non_cash_assets
        # At this point: total_assets == total_liabilities + total_equity (by construction)

        # Build trial balance row
        row = {
            "period": month,
            "year": year,
            "month": mo,
        }

        # Add revenue accounts (credits are negative in TB convention for this tool)
        for code, amount in revenue_breakdown.items():
            row[f"acct_{code}"] = -amount  # Credit balance

        # Add COGS accounts (debits are positive)
        for code, amount in cogs_breakdown.items():
            row[f"acct_{code}"] = amount  # Debit balance

        # Add OpEx accounts
        for code, amount in opex_breakdown.items():
            row[f"acct_{code}"] = amount  # Debit balance

        # Add asset accounts
        row["acct_1000"] = round_currency(new_cash)  # Cash
        row["acct_1100"] = round_currency(new_ar)  # AR
        if has_inventory:
            row["acct_1200"] = round_currency(new_inventory)  # Inventory
        row["acct_prepaid"] = round_currency(prepaid)
        row["acct_fixed_assets"] = round_currency(fixed_assets)
        row["acct_accum_depr"] = round_currency(-accum_depreciation)  # Contra asset

        # Add liability accounts (credits are negative)
        row["acct_2000"] = round_currency(-new_ap)  # AP
        row["acct_accrued"] = round_currency(-accrued)  # Accrued
        row["acct_deferred"] = round_currency(-deferred_revenue)  # Deferred revenue
        if line_of_credit > 0:
            row["acct_2500"] = round_currency(-line_of_credit)  # Line of credit

        # Add equity accounts
        row["acct_3000"] = round_currency(-common_stock)  # Common stock (static)
        row["acct_3200"] = round_currency(-cumulative_retained_earnings)  # Retained earnings

        # Calculate totals for validation
        debits = sum(v for v in row.values() if isinstance(v, (int, float)) and v > 0)
        credits = sum(v for v in row.values() if isinstance(v, (int, float)) and v < 0)

        # Add summary columns
        row["total_revenue"] = round_currency(total_revenue)
        row["total_cogs"] = round_currency(total_cogs)
        row["gross_profit"] = round_currency(gross_profit)
        row["total_opex"] = round_currency(total_opex)
        row["net_income"] = round_currency(net_income)
        row["event_revenue_adjustment"] = round_currency(revenue_adjustment)
        row["event_opex_adjustment"] = round_currency(opex_adjustment)
        row["total_assets"] = round_currency(new_cash + new_ar + new_inventory + prepaid + fixed_assets - accum_depreciation)
        row["total_liabilities"] = round_currency(new_ap + accrued + deferred_revenue + line_of_credit)
        row["total_equity"] = round_currency(common_stock + cumulative_retained_earnings)

        tb_data.append(row)

        # Update previous values
        prev_ar = new_ar
        prev_ap = new_ap
        prev_cash = new_cash
        prev_inventory = new_inventory

    return pd.DataFrame(tb_data), event_impacts


def generate_income_statement(tb: pd.DataFrame, profile: dict) -> pd.DataFrame:
    """Derive income statement from trial balance."""

    # Group by year
    annual_data = []

    for year in tb["year"].unique():
        year_tb = tb[tb["year"] == year]

        row = {
            "year": year,
            "revenue": year_tb["total_revenue"].sum(),
            "cogs": year_tb["total_cogs"].sum(),
            "gross_profit": year_tb["gross_profit"].sum(),
            "opex": year_tb["total_opex"].sum(),
            "operating_income": year_tb["gross_profit"].sum() - year_tb["total_opex"].sum(),
            "net_income": year_tb["net_income"].sum(),
        }

        row["gross_margin"] = row["gross_profit"] / row["revenue"] if row["revenue"] else 0
        row["operating_margin"] = row["operating_income"] / row["revenue"] if row["revenue"] else 0
        row["net_margin"] = row["net_income"] / row["revenue"] if row["revenue"] else 0

        annual_data.append(row)

    return pd.DataFrame(annual_data)


def generate_balance_sheet(tb: pd.DataFrame, profile: dict) -> pd.DataFrame:
    """Derive balance sheet from trial balance (period-end snapshots)."""

    # Get last month of each year
    annual_data = []

    for year in tb["year"].unique():
        year_tb = tb[tb["year"] == year]
        last_month = year_tb.iloc[-1]

        # Get line of credit if exists
        line_of_credit = -last_month.get("acct_2500", 0)  # Convert from credit to positive

        row = {
            "year": year,
            "period_end": last_month["period"],
            "cash": last_month["acct_1000"],
            "accounts_receivable": last_month["acct_1100"],
            "inventory": last_month.get("acct_1200", 0),
            "prepaid_expenses": last_month["acct_prepaid"],
            "total_current_assets": (
                last_month["acct_1000"] +
                last_month["acct_1100"] +
                last_month.get("acct_1200", 0) +
                last_month["acct_prepaid"]
            ),
            "fixed_assets": last_month["acct_fixed_assets"],
            "accumulated_depreciation": -last_month["acct_accum_depr"],  # Show as positive
            "net_fixed_assets": last_month["acct_fixed_assets"] + last_month["acct_accum_depr"],
            "total_assets": last_month["total_assets"],
            "accounts_payable": -last_month["acct_2000"],  # Show as positive
            "accrued_expenses": -last_month["acct_accrued"],
            "deferred_revenue": -last_month["acct_deferred"],
            "line_of_credit": line_of_credit,
            "total_current_liabilities": (
                -last_month["acct_2000"] -
                last_month["acct_accrued"] -
                last_month["acct_deferred"] +
                line_of_credit
            ),
            "total_liabilities": last_month["total_liabilities"],
            "common_stock": -last_month["acct_3000"],
            "retained_earnings": -last_month["acct_3200"],
            "total_equity": last_month["total_equity"],
        }

        # Validate A = L + E
        row["balance_check"] = abs(row["total_assets"] - row["total_liabilities"] - row["total_equity"]) < 1

        annual_data.append(row)

    return pd.DataFrame(annual_data)


def generate_cash_flow(tb: pd.DataFrame, is_df: pd.DataFrame, bs_df: pd.DataFrame) -> pd.DataFrame:
    """Generate cash flow statement using indirect method."""

    cf_data = []

    years = sorted(tb["year"].unique())

    for i, year in enumerate(years):
        year_is = is_df[is_df["year"] == year].iloc[0]
        year_bs = bs_df[bs_df["year"] == year].iloc[0]

        if i > 0:
            prev_bs = bs_df[bs_df["year"] == years[i-1]].iloc[0]
        else:
            # Use first month for prior period proxy
            prev_bs = {
                "accounts_receivable": 0,
                "inventory": 0,
                "prepaid_expenses": 0,
                "accounts_payable": 0,
                "accrued_expenses": 0,
                "deferred_revenue": 0,
                "net_fixed_assets": year_bs["net_fixed_assets"] * 0.9,
                "cash": 0,
            }

        # Operating activities
        net_income = year_is["net_income"]
        depreciation = year_bs["accumulated_depreciation"] - prev_bs.get("accumulated_depreciation", 0)

        ar_change = -(year_bs["accounts_receivable"] - prev_bs.get("accounts_receivable", 0))
        inventory_change = -(year_bs["inventory"] - prev_bs.get("inventory", 0))
        prepaid_change = -(year_bs["prepaid_expenses"] - prev_bs.get("prepaid_expenses", 0))
        ap_change = year_bs["accounts_payable"] - prev_bs.get("accounts_payable", 0)
        accrued_change = year_bs["accrued_expenses"] - prev_bs.get("accrued_expenses", 0)
        deferred_change = year_bs["deferred_revenue"] - prev_bs.get("deferred_revenue", 0)

        cfo = (net_income + depreciation + ar_change + inventory_change +
               prepaid_change + ap_change + accrued_change + deferred_change)

        # Investing activities
        capex = -(year_bs["net_fixed_assets"] - prev_bs.get("net_fixed_assets", 0) + depreciation)
        cfi = capex

        # Financing activities (minimal for now)
        cff = 0

        # Net change
        net_change = cfo + cfi + cff

        row = {
            "year": year,
            "net_income": round_currency(net_income),
            "depreciation": round_currency(depreciation),
            "ar_change": round_currency(ar_change),
            "inventory_change": round_currency(inventory_change),
            "prepaid_change": round_currency(prepaid_change),
            "ap_change": round_currency(ap_change),
            "accrued_change": round_currency(accrued_change),
            "deferred_change": round_currency(deferred_change),
            "cash_from_operations": round_currency(cfo),
            "capex": round_currency(capex),
            "cash_from_investing": round_currency(cfi),
            "cash_from_financing": round_currency(cff),
            "net_change_in_cash": round_currency(net_change),
            "ending_cash": round_currency(year_bs["cash"]),
        }

        cf_data.append(row)

    return pd.DataFrame(cf_data)


def generate_ar_aging(tb: pd.DataFrame, seed: dict) -> pd.DataFrame:
    """Generate AR aging schedule."""

    # Get last period
    last_period = tb.iloc[-1]
    total_ar = last_period["acct_1100"]

    # Typical aging buckets
    buckets = {
        "current": random.uniform(0.65, 0.75),
        "1_30_days": random.uniform(0.15, 0.20),
        "31_60_days": random.uniform(0.05, 0.10),
        "61_90_days": random.uniform(0.02, 0.05),
        "over_90_days": 0,  # Will be remainder
    }

    # Normalize
    total_pct = sum(buckets.values())
    for k in buckets:
        if k != "over_90_days":
            buckets[k] = buckets[k] / total_pct
    buckets["over_90_days"] = 1 - sum(v for k, v in buckets.items() if k != "over_90_days")

    aging_data = []
    for bucket, pct in buckets.items():
        aging_data.append({
            "bucket": bucket.replace("_", " ").title(),
            "amount": round_currency(total_ar * pct),
            "percentage": round(pct * 100, 1),
        })

    aging_data.append({
        "bucket": "Total",
        "amount": round_currency(total_ar),
        "percentage": 100.0,
    })

    return pd.DataFrame(aging_data)


def generate_ap_aging(tb: pd.DataFrame, seed: dict) -> pd.DataFrame:
    """Generate AP aging schedule."""

    last_period = tb.iloc[-1]
    total_ap = -last_period["acct_2000"]  # Convert from credit balance

    buckets = {
        "current": random.uniform(0.70, 0.80),
        "1_30_days": random.uniform(0.12, 0.18),
        "31_60_days": random.uniform(0.03, 0.08),
        "61_90_days": random.uniform(0.01, 0.03),
        "over_90_days": 0,
    }

    total_pct = sum(buckets.values())
    for k in buckets:
        if k != "over_90_days":
            buckets[k] = buckets[k] / total_pct
    buckets["over_90_days"] = 1 - sum(v for k, v in buckets.items() if k != "over_90_days")

    aging_data = []
    for bucket, pct in buckets.items():
        aging_data.append({
            "bucket": bucket.replace("_", " ").title(),
            "amount": round_currency(total_ap * pct),
            "percentage": round(pct * 100, 1),
        })

    aging_data.append({
        "bucket": "Total",
        "amount": round_currency(total_ap),
        "percentage": 100.0,
    })

    return pd.DataFrame(aging_data)


def generate_nwc_schedule(tb: pd.DataFrame) -> pd.DataFrame:
    """Generate net working capital schedule."""

    nwc_data = []

    for _, row in tb.iterrows():
        current_assets = (
            row["acct_1000"] +  # Cash
            row["acct_1100"] +  # AR
            row.get("acct_1200", 0) +  # Inventory
            row["acct_prepaid"]  # Prepaid
        )

        current_liabilities = (
            -row["acct_2000"] +  # AP
            -row["acct_accrued"] +  # Accrued
            -row["acct_deferred"]  # Deferred
        )

        nwc = current_assets - current_liabilities

        # Exclude cash for "operating NWC"
        operating_nwc = nwc - row["acct_1000"]

        nwc_data.append({
            "period": row["period"],
            "cash": round_currency(row["acct_1000"]),
            "accounts_receivable": round_currency(row["acct_1100"]),
            "inventory": round_currency(row.get("acct_1200", 0)),
            "prepaid_expenses": round_currency(row["acct_prepaid"]),
            "total_current_assets": round_currency(current_assets),
            "accounts_payable": round_currency(-row["acct_2000"]),
            "accrued_expenses": round_currency(-row["acct_accrued"]),
            "deferred_revenue": round_currency(-row["acct_deferred"]),
            "total_current_liabilities": round_currency(current_liabilities),
            "net_working_capital": round_currency(nwc),
            "operating_nwc": round_currency(operating_nwc),
            "nwc_as_pct_revenue": round(operating_nwc / row["total_revenue"] * 100, 1) if row["total_revenue"] else 0,
        })

    return pd.DataFrame(nwc_data)


def generate_fixed_asset_schedule(tb: pd.DataFrame, seed: dict) -> pd.DataFrame:
    """Generate fixed asset roll-forward schedule."""

    fa_data = []
    prev_gross = None
    prev_accum = None

    for year in tb["year"].unique():
        year_tb = tb[tb["year"] == year]
        year_end = year_tb.iloc[-1]

        gross_assets = year_end["acct_fixed_assets"]
        accum_depr = -year_end["acct_accum_depr"]
        net_assets = gross_assets - accum_depr

        if prev_gross is not None:
            additions = gross_assets - prev_gross
            depr_expense = accum_depr - prev_accum
        else:
            additions = gross_assets * 0.1  # Estimate
            depr_expense = accum_depr

        fa_data.append({
            "year": year,
            "beginning_gross": round_currency(prev_gross or gross_assets - additions),
            "additions": round_currency(additions),
            "disposals": 0,
            "ending_gross": round_currency(gross_assets),
            "beginning_accum_depr": round_currency(prev_accum or 0),
            "depreciation_expense": round_currency(depr_expense),
            "ending_accum_depr": round_currency(accum_depr),
            "net_fixed_assets": round_currency(net_assets),
        })

        prev_gross = gross_assets
        prev_accum = accum_depr

    return pd.DataFrame(fa_data)


def save_to_excel(df: pd.DataFrame, path: Path, sheet_name: str = "Sheet1"):
    """Save DataFrame to Excel with formatting."""
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)


def main():
    parser = argparse.ArgumentParser(
        description="Generate financial data for M&A data room simulation"
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
    parser.add_argument(
        "--start-period",
        help="Optional start period in YYYY-MM format (must be used with --end-period)"
    )
    parser.add_argument(
        "--end-period",
        help="Optional end period in YYYY-MM format (must be used with --start-period)"
    )

    args = parser.parse_args()

    # Load seed and profile
    output_dir = Path(args.output_dir)
    seed_path = Path(args.seed_file) if args.seed_file else (output_dir / "company_seed.json")
    if not seed_path.exists():
        print(f"Error: Seed file not found: {seed_path}")
        print("Run generate_company.py first to create the company seed.")
        exit(1)

    print(f"Loading company seed from {seed_path}...")
    seed = load_seed(seed_path)

    industry = seed["metadata"]["industry"]
    profile = load_profile(industry)

    company_name = seed["company"]["name"]
    print(f"Generating financials for {company_name} ({profile['display_name']})...")

    # Generate trial balance
    print("  Generating trial balance...")
    tb_df, event_impacts_df = generate_trial_balance(
        seed,
        profile,
        start_period=args.start_period,
        end_period=args.end_period,
    )

    # Generate financial statements
    print("  Generating income statement...")
    is_df = generate_income_statement(tb_df, profile)

    print("  Generating balance sheet...")
    bs_df = generate_balance_sheet(tb_df, profile)

    print("  Generating cash flow statement...")
    cf_df = generate_cash_flow(tb_df, is_df, bs_df)

    # Generate supporting schedules
    print("  Generating AR aging...")
    ar_aging_df = generate_ar_aging(tb_df, seed)

    print("  Generating AP aging...")
    ap_aging_df = generate_ap_aging(tb_df, seed)

    print("  Generating NWC schedule...")
    nwc_df = generate_nwc_schedule(tb_df)

    print("  Generating fixed asset schedule...")
    fa_df = generate_fixed_asset_schedule(tb_df, seed)

    # Save outputs
    output_dir.mkdir(parents=True, exist_ok=True)

    save_to_excel(tb_df, output_dir / "trial_balance.xlsx", "Trial Balance")
    save_to_excel(is_df, output_dir / "income_statement.xlsx", "Income Statement")
    save_to_excel(bs_df, output_dir / "balance_sheet.xlsx", "Balance Sheet")
    save_to_excel(cf_df, output_dir / "cash_flow.xlsx", "Cash Flow")
    save_to_excel(ar_aging_df, output_dir / "ar_aging.xlsx", "AR Aging")
    save_to_excel(ap_aging_df, output_dir / "ap_aging.xlsx", "AP Aging")
    save_to_excel(nwc_df, output_dir / "nwc_schedule.xlsx", "NWC Schedule")
    save_to_excel(fa_df, output_dir / "fixed_assets.xlsx", "Fixed Assets")
    save_to_excel(event_impacts_df, output_dir / "event_impacts.xlsx", "Event Impacts")

    print(f"\n✓ Financial data generated successfully!")
    print(f"  Output directory: {output_dir}")
    print(f"\n  Files created:")
    print(f"    - trial_balance.xlsx ({len(tb_df)} months)")
    print(f"    - income_statement.xlsx ({len(is_df)} years)")
    print(f"    - balance_sheet.xlsx ({len(bs_df)} years)")
    print(f"    - cash_flow.xlsx ({len(cf_df)} years)")
    print(f"    - ar_aging.xlsx")
    print(f"    - ap_aging.xlsx")
    print(f"    - nwc_schedule.xlsx")
    print(f"    - fixed_assets.xlsx")
    print(f"    - event_impacts.xlsx")

    # Print summary
    latest_is = is_df.iloc[-1]
    print(f"\n  Latest Year Summary ({int(latest_is['year'])}):")
    print(f"    Revenue: ${latest_is['revenue']:,.0f}")
    print(f"    Gross Profit: ${latest_is['gross_profit']:,.0f} ({latest_is['gross_margin']*100:.1f}%)")
    print(f"    Net Income: ${latest_is['net_income']:,.0f} ({latest_is['net_margin']*100:.1f}%)")


if __name__ == "__main__":
    main()
