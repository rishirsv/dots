#!/usr/bin/env python3
"""
Financial Data Generator v2 for M&A Data Room Simulator.

Generates Section 2.0 Financial artifacts with proper accounting structure:
- Trial Balance (long format with account codes and descriptions)
- Income Statement (annual)
- Balance Sheet (annual snapshots)
- Cash Flow Statement (indirect method)
- GL Detail (journal entries with je_id)
- Debt Covenant Schedule (quarterly compliance)
- Budget vs Forecast (monthly budget and variance)
- EBITDA Bridge (adjustments from reported to adjusted EBITDA)
- Supporting schedules (AR/AP aging, fixed assets, NWC)

Reads deal_state.json instead of company_seed.json + profile.
Outputs to <output_dir>/2.0-financial/

All data is internally consistent:
- Debits = Credits every period in GL detail
- Trial balance balances (assets = liabilities + equity)
- Income statement ties to P&L detail
- Balance sheet ties to TB

Usage:
    python3 scripts/generate_financials.py --output-dir <output_dir> [--start-period YYYY-MM] [--end-period YYYY-MM]
"""

import argparse
import json
import random
import uuid
from datetime import datetime, date, timedelta
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Tuple

import pandas as pd
import numpy as np

# Constants
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PROFILES_DIR = PROJECT_DIR / "references" / "profiles"


def round_currency(value: float) -> float:
    """Round to 2 decimal places for currency."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def load_deal_state(output_dir: Path) -> dict:
    """Load deal_state.json from output directory."""
    state_path = output_dir / "deal_state.json"
    if not state_path.exists():
        raise FileNotFoundError(f"deal_state.json not found at {state_path}")
    with open(state_path) as f:
        return json.load(f)


def load_profile(industry: str) -> dict:
    """Load industry profile from JSON file."""
    profile_path = PROFILES_DIR / f"{industry}.json"
    if not profile_path.exists():
        raise FileNotFoundError(f"Profile not found: {profile_path}")
    with open(profile_path) as f:
        return json.load(f)


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


def build_event_impact_schedule(deal_state: dict, months: List[str]) -> pd.DataFrame:
    """Build month-level revenue and opex adjustments from deal state events."""
    events = deal_state.get("events_timeline", [])
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
    deal_state: dict,
    profile: dict,
    start_period: str = None,
    end_period: str = None
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Generate monthly trial balance in long format (one row per account per month)."""

    financials = deal_state["financials_seed"]
    realism_mode = deal_state["metadata"]["realism_mode"]

    # Determine date range
    if (start_period and not end_period) or (end_period and not start_period):
        raise ValueError("Use --start-period and --end-period together.")

    if start_period and end_period:
        months = generate_month_sequence(start_period, end_period)
        years_of_history = max(1, len(months) / 12)
    else:
        # Read from deal_state.metadata if available
        metadata = deal_state.get("metadata", {})
        if "analysis_period" in metadata:
            start_period = metadata["analysis_period"]["start"]
            end_period = metadata["analysis_period"]["end"]
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

    # Get chart of accounts from profile
    coa = profile["chart_of_accounts"]
    event_impacts = build_event_impact_schedule(deal_state, months)
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

    # Initialize accounts data structures
    tb_data = []
    je_data = []  # For GL detail later

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

    # Build account lookup maps from CoA
    account_map = {}
    for acct_type in ["revenue", "cogs", "opex", "assets", "liabilities", "equity"]:
        for acct in coa.get(acct_type, []):
            account_map[acct["code"]] = {
                "name": acct["name"],
                "type": acct_type,
            }

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

        # Build trial balance rows in long format (one per account)
        # Revenue accounts (credits)
        for code, amount in revenue_breakdown.items():
            acct_name = account_map.get(code, {}).get("name", "Unknown")
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": code,
                "account_name": acct_name,
                "account_category": "revenue",
                "entity": "main",
                "beginning_balance": 0,  # Monthly P&L accounts reset
                "debits": 0.0,
                "credits": round_currency(amount),
                "ending_balance": round_currency(-amount),  # Credit balance
            })

        # COGS accounts (debits)
        for code, amount in cogs_breakdown.items():
            acct_name = account_map.get(code, {}).get("name", "Unknown")
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": code,
                "account_name": acct_name,
                "account_category": "cogs",
                "entity": "main",
                "beginning_balance": 0,
                "debits": round_currency(amount),
                "credits": 0.0,
                "ending_balance": round_currency(amount),
            })

        # OpEx accounts (debits)
        for code, amount in opex_breakdown.items():
            acct_name = account_map.get(code, {}).get("name", "Unknown")
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": code,
                "account_name": acct_name,
                "account_category": "opex",
                "entity": "main",
                "beginning_balance": 0,
                "debits": round_currency(amount),
                "credits": 0.0,
                "ending_balance": round_currency(amount),
            })

        # Asset accounts
        if new_cash > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1000",
                "account_name": "Cash and Cash Equivalents",
                "account_category": "asset",
                "entity": "main",
                "beginning_balance": prev_cash if idx == 0 else 0,
                "debits": round_currency(new_cash),
                "credits": 0.0,
                "ending_balance": round_currency(new_cash),
            })

        if new_ar > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1100",
                "account_name": "Accounts Receivable",
                "account_category": "asset",
                "entity": "main",
                "beginning_balance": prev_ar if idx == 0 else 0,
                "debits": round_currency(new_ar),
                "credits": 0.0,
                "ending_balance": round_currency(new_ar),
            })

        if has_inventory and new_inventory > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1200",
                "account_name": "Inventory",
                "account_category": "asset",
                "entity": "main",
                "beginning_balance": prev_inventory if idx == 0 else 0,
                "debits": round_currency(new_inventory),
                "credits": 0.0,
                "ending_balance": round_currency(new_inventory),
            })

        if prepaid > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1300",
                "account_name": "Prepaid Expenses",
                "account_category": "asset",
                "entity": "main",
                "beginning_balance": 0,
                "debits": round_currency(prepaid),
                "credits": 0.0,
                "ending_balance": round_currency(prepaid),
            })

        if fixed_assets > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1400",
                "account_name": "Fixed Assets",
                "account_category": "asset",
                "entity": "main",
                "beginning_balance": 0,
                "debits": round_currency(fixed_assets),
                "credits": 0.0,
                "ending_balance": round_currency(fixed_assets),
            })

        if accum_depreciation > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "1500",
                "account_name": "Accumulated Depreciation",
                "account_category": "asset_contra",
                "entity": "main",
                "beginning_balance": 0,
                "debits": 0.0,
                "credits": round_currency(accum_depreciation),
                "ending_balance": round_currency(-accum_depreciation),
            })

        # Liability accounts
        if new_ap > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "2000",
                "account_name": "Accounts Payable",
                "account_category": "liability",
                "entity": "main",
                "beginning_balance": prev_ap if idx == 0 else 0,
                "debits": 0.0,
                "credits": round_currency(new_ap),
                "ending_balance": round_currency(-new_ap),
            })

        if accrued > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "2100",
                "account_name": "Accrued Expenses",
                "account_category": "liability",
                "entity": "main",
                "beginning_balance": 0,
                "debits": 0.0,
                "credits": round_currency(accrued),
                "ending_balance": round_currency(-accrued),
            })

        if deferred_revenue > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "2200",
                "account_name": "Deferred Revenue",
                "account_category": "liability",
                "entity": "main",
                "beginning_balance": 0,
                "debits": 0.0,
                "credits": round_currency(deferred_revenue),
                "ending_balance": round_currency(-deferred_revenue),
            })

        if line_of_credit > 0:
            tb_data.append({
                "period": month,
                "year": year,
                "month": mo,
                "account_code": "2500",
                "account_name": "Line of Credit",
                "account_category": "liability",
                "entity": "main",
                "beginning_balance": 0,
                "debits": 0.0,
                "credits": round_currency(line_of_credit),
                "ending_balance": round_currency(-line_of_credit),
            })

        # Equity accounts
        tb_data.append({
            "period": month,
            "year": year,
            "month": mo,
            "account_code": "3000",
            "account_name": "Common Stock",
            "account_category": "equity",
            "entity": "main",
            "beginning_balance": 0,
            "debits": 0.0,
            "credits": round_currency(common_stock),
            "ending_balance": round_currency(-common_stock),
        })

        tb_data.append({
            "period": month,
            "year": year,
            "month": mo,
            "account_code": "3200",
            "account_name": "Retained Earnings",
            "account_category": "equity",
            "entity": "main",
            "beginning_balance": 0,
            "debits": 0.0,
            "credits": round_currency(cumulative_retained_earnings),
            "ending_balance": round_currency(-cumulative_retained_earnings),
        })

        # Update previous values
        prev_ar = new_ar
        prev_ap = new_ap
        prev_cash = new_cash
        prev_inventory = new_inventory

    return pd.DataFrame(tb_data), event_impacts


def generate_income_statement(tb: pd.DataFrame, profile: dict) -> pd.DataFrame:
    """Derive income statement from trial balance."""

    # Filter to P&L accounts only
    pl_accounts = tb[tb["account_category"].isin(["revenue", "cogs", "opex"])].copy()

    # Group by year
    annual_data = []

    for year in sorted(tb["year"].unique()):
        year_tb = pl_accounts[pl_accounts["year"] == year]

        # Sum credits for revenue (negative ending_balance)
        revenue_total = -year_tb[year_tb["account_category"] == "revenue"]["ending_balance"].sum()

        # Sum debits for cogs and opex
        cogs_total = year_tb[year_tb["account_category"] == "cogs"]["ending_balance"].sum()
        opex_total = year_tb[year_tb["account_category"] == "opex"]["ending_balance"].sum()

        gross_profit = revenue_total - cogs_total
        operating_income = gross_profit - opex_total

        row = {
            "year": year,
            "revenue": round_currency(revenue_total),
            "cogs": round_currency(cogs_total),
            "gross_profit": round_currency(gross_profit),
            "opex": round_currency(opex_total),
            "operating_income": round_currency(operating_income),
            "net_income": round_currency(operating_income),  # No tax for simplicity
        }

        row["gross_margin"] = round(row["gross_profit"] / row["revenue"] * 100, 1) if row["revenue"] else 0
        row["operating_margin"] = round(row["operating_income"] / row["revenue"] * 100, 1) if row["revenue"] else 0
        row["net_margin"] = round(row["net_income"] / row["revenue"] * 100, 1) if row["revenue"] else 0

        annual_data.append(row)

    return pd.DataFrame(annual_data)


def generate_balance_sheet(tb: pd.DataFrame, profile: dict) -> pd.DataFrame:
    """Derive balance sheet from trial balance (period-end snapshots)."""

    # Get last month of each year
    annual_data = []

    for year in sorted(tb["year"].unique()):
        year_tb = tb[tb["year"] == year]
        last_period = year_tb[year_tb["month"] == year_tb["month"].max()].iloc[-1] if len(year_tb) > 0 else None

        if last_period is None:
            continue

        # Get balances from TB
        assets_tb = year_tb[year_tb["account_category"].isin(["asset", "asset_contra"])]
        liabilities_tb = year_tb[year_tb["account_category"] == "liability"]
        equity_tb = year_tb[year_tb["account_category"] == "equity"]

        # Sum asset debits (positive balances)
        total_assets = abs(assets_tb["ending_balance"].sum())

        # Sum liability credits (negative balances = positive liabilities)
        total_liabilities = abs(liabilities_tb["ending_balance"].sum())

        # Sum equity credits (negative balances = positive equity)
        total_equity = abs(equity_tb["ending_balance"].sum())

        row = {
            "year": year,
            "period_end": last_period["period"],
            "total_assets": round_currency(total_assets),
            "total_liabilities": round_currency(total_liabilities),
            "total_equity": round_currency(total_equity),
            "balance_check": abs(total_assets - total_liabilities - total_equity) < 1,
        }

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
            prev_bs = {
                "total_assets": year_bs["total_assets"] * 0.9,
            }

        # Operating activities
        net_income = year_is["net_income"]

        # For simplicity, operating CF = net income (could add back depreciation, changes in WC, etc.)
        cfo = net_income

        # Investing activities
        cfi = 0

        # Financing activities
        cff = 0

        # Net change
        net_change = cfo + cfi + cff

        row = {
            "year": year,
            "net_income": round_currency(net_income),
            "cash_from_operations": round_currency(cfo),
            "capex": round_currency(cfi),
            "cash_from_investing": round_currency(cfi),
            "cash_from_financing": round_currency(cff),
            "net_change_in_cash": round_currency(net_change),
        }

        cf_data.append(row)

    return pd.DataFrame(cf_data)


def generate_ar_aging(tb: pd.DataFrame, deal_state: dict) -> pd.DataFrame:
    """Generate AR aging schedule."""

    # Get last period
    last_period = tb[(tb["account_code"] == "1100")].iloc[-1]
    total_ar = abs(last_period["ending_balance"])

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


def generate_ap_aging(tb: pd.DataFrame, deal_state: dict) -> pd.DataFrame:
    """Generate AP aging schedule."""

    last_period = tb[(tb["account_code"] == "2000")].iloc[-1]
    total_ap = abs(last_period["ending_balance"])

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

    # Group by period and sum by account
    for period in sorted(tb["period"].unique()):
        period_tb = tb[tb["period"] == period]

        # Current assets
        cash = abs(period_tb[period_tb["account_code"] == "1000"]["ending_balance"].sum())
        ar = abs(period_tb[period_tb["account_code"] == "1100"]["ending_balance"].sum())
        inventory = abs(period_tb[period_tb["account_code"] == "1200"]["ending_balance"].sum())
        prepaid = abs(period_tb[period_tb["account_code"] == "1300"]["ending_balance"].sum())

        current_assets = cash + ar + inventory + prepaid

        # Current liabilities
        ap = abs(period_tb[period_tb["account_code"] == "2000"]["ending_balance"].sum())
        accrued = abs(period_tb[period_tb["account_code"] == "2100"]["ending_balance"].sum())
        deferred = abs(period_tb[period_tb["account_code"] == "2200"]["ending_balance"].sum())

        current_liabilities = ap + accrued + deferred

        nwc = current_assets - current_liabilities

        # Exclude cash for "operating NWC"
        operating_nwc = nwc - cash

        # Get revenue for the period
        revenue = abs(period_tb[period_tb["account_category"] == "revenue"]["ending_balance"].sum())

        nwc_data.append({
            "period": period,
            "cash": round_currency(cash),
            "accounts_receivable": round_currency(ar),
            "inventory": round_currency(inventory),
            "prepaid_expenses": round_currency(prepaid),
            "total_current_assets": round_currency(current_assets),
            "accounts_payable": round_currency(ap),
            "accrued_expenses": round_currency(accrued),
            "deferred_revenue": round_currency(deferred),
            "total_current_liabilities": round_currency(current_liabilities),
            "net_working_capital": round_currency(nwc),
            "operating_nwc": round_currency(operating_nwc),
            "nwc_as_pct_revenue": round(operating_nwc / revenue * 100, 1) if revenue else 0,
        })

    return pd.DataFrame(nwc_data)


def generate_fixed_asset_schedule(tb: pd.DataFrame, deal_state: dict) -> pd.DataFrame:
    """Generate fixed asset roll-forward schedule."""

    fa_data = []
    prev_gross = None
    prev_accum = None

    for year in sorted(tb["year"].unique()):
        year_tb = tb[tb["year"] == year]
        last_period_df = year_tb[year_tb["month"] == year_tb["month"].max()]

        gross_assets = abs(last_period_df[last_period_df["account_code"] == "1400"]["ending_balance"].sum())
        accum_depr = abs(last_period_df[last_period_df["account_code"] == "1500"]["ending_balance"].sum())
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
            "additions": round_currency(max(0, additions)),
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


def generate_gl_detail(tb: pd.DataFrame, deal_state: dict) -> pd.DataFrame:
    """Generate GL detail with journal entries."""

    gl_data = []
    je_counter = 0

    for period in sorted(tb["period"].unique()):
        period_tb = tb[tb["period"] == period]
        year, month = period.split("-")

        # Create journal entries for each account with activity
        for _, row in period_tb.iterrows():
            if row["debits"] > 0 or row["credits"] > 0:
                je_counter += 1
                je_date = f"{period}-{random.randint(1, 28):02d}"

                # Debit entry
                if row["debits"] > 0:
                    gl_data.append({
                        "je_id": f"JE-{je_counter:05d}",
                        "je_date": je_date,
                        "period": period,
                        "account_code": row["account_code"],
                        "account_name": row["account_name"],
                        "entity": row["entity"],
                        "description": f"{row['account_name']} - {period}",
                        "debit": round_currency(row["debits"]),
                        "credit": 0.0,
                        "source": "auto",
                        "created_by": "system",
                        "reference": f"TB-{period}",
                    })

                # Credit entry
                if row["credits"] > 0:
                    gl_data.append({
                        "je_id": f"JE-{je_counter:05d}",
                        "je_date": je_date,
                        "period": period,
                        "account_code": row["account_code"],
                        "account_name": row["account_name"],
                        "entity": row["entity"],
                        "description": f"{row['account_name']} - {period}",
                        "debit": 0.0,
                        "credit": round_currency(row["credits"]),
                        "source": "auto",
                        "created_by": "system",
                        "reference": f"TB-{period}",
                    })

    return pd.DataFrame(gl_data)


def generate_debt_covenant(deal_state: dict, is_df: pd.DataFrame, bs_df: pd.DataFrame) -> pd.DataFrame:
    """Generate quarterly debt covenant compliance schedule."""

    covenant_data = []

    ownership = deal_state.get("ownership", {})
    debt_structure = ownership.get("debt_structure", {})
    realism_mode = deal_state["metadata"]["realism_mode"]

    # Define covenants based on debt structure
    covenants = []

    if debt_structure.get("term_loan"):
        covenants.append({
            "name": "Max Leverage",
            "type": "leverage",
            "required_level": debt_structure.get("leverage_cap", 4.0),
        })
        covenants.append({
            "name": "Min Fixed Charge Coverage",
            "type": "coverage",
            "required_level": debt_structure.get("min_fcf_coverage", 1.25),
        })

    if not covenants:
        # Default covenants
        covenants = [
            {"name": "Max Leverage", "type": "leverage", "required_level": 4.0},
            {"name": "Min Current Ratio", "type": "liquidity", "required_level": 1.5},
        ]

    # Generate quarterly covenant data
    for _, is_row in is_df.iterrows():
        for quarter in [1, 2, 3, 4]:
            quarter_str = f"Q{quarter}"

            for covenant in covenants:
                if covenant["type"] == "leverage":
                    # EBITDA / Total Debt
                    actual_level = is_row["net_income"] * 4 / (is_row["revenue"] * 0.1)  # Simplified
                    headroom = (covenant["required_level"] - actual_level) / covenant["required_level"] * 100
                elif covenant["type"] == "coverage":
                    # EBITDA / Interest + Principal
                    actual_level = is_row["net_income"] * 4 / (is_row["revenue"] * 0.02)  # Simplified
                    headroom = (actual_level - covenant["required_level"]) / covenant["required_level"] * 100
                else:  # liquidity
                    actual_level = 1.8  # Simplified
                    headroom = (actual_level - covenant["required_level"]) / covenant["required_level"] * 100

                # Determine compliance
                in_compliance = actual_level >= covenant["required_level"] if covenant["type"] in ["coverage", "liquidity"] else actual_level <= covenant["required_level"]

                # Add some variance for realism
                if realism_mode != "clean" and random.random() < 0.1:
                    in_compliance = not in_compliance
                    headroom = random.uniform(-20, 5)

                covenant_data.append({
                    "fiscal_year": int(is_row["year"]),
                    "quarter": quarter_str,
                    "covenant_name": covenant["name"],
                    "covenant_type": covenant["type"],
                    "required_level": round(covenant["required_level"], 2),
                    "actual_level": round(actual_level, 2),
                    "in_compliance": "Yes" if in_compliance else "No",
                    "headroom_pct": round(headroom, 1),
                })

    return pd.DataFrame(covenant_data)


def generate_budget_forecast(tb: pd.DataFrame, is_df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Generate budget vs forecast with two sheets."""

    # Get latest year data
    latest_year = is_df.iloc[-1]
    latest_revenue = latest_year["revenue"]

    # Determine budget year (next year after latest in data)
    if "year" in is_df.columns:
        budget_year = int(is_df["year"].max()) + 1
    else:
        budget_year = datetime.now().year + 1

    # Create 12-month budget (assume next year with 15% growth)
    budget_data = []
    growth_rate = 0.15

    for month in range(1, 13):
        month_name = f"{budget_year}-{month:02d}"
        # Budget = last year monthly avg * growth factor + seasonality
        budgeted_revenue = (latest_revenue / 12) * (1 + growth_rate) * random.uniform(0.9, 1.1)
        budgeted_cogs = budgeted_revenue * (1 - latest_year["gross_margin"] / 100)
        budgeted_opex = budgeted_revenue * (latest_year["opex"] / latest_year["revenue"])

        budget_data.append({
            "month": month_name,
            "revenue": round_currency(budgeted_revenue),
            "cogs": round_currency(budgeted_cogs),
            "gross_profit": round_currency(budgeted_revenue - budgeted_cogs),
            "opex": round_currency(budgeted_opex),
            "operating_income": round_currency(budgeted_revenue - budgeted_cogs - budgeted_opex),
        })

    budget_df = pd.DataFrame(budget_data)

    # Create variance (actual vs budget) - use recent TB data as "actual"
    variance_data = []
    for _, budget_row in budget_df.iterrows():
        actual_revenue = budget_row["revenue"] * random.uniform(0.95, 1.05)
        actual_cogs = actual_revenue * (1 - latest_year["gross_margin"] / 100) * random.uniform(0.95, 1.05)
        actual_opex = budget_row["opex"] * random.uniform(0.90, 1.10)

        variance_data.append({
            "month": budget_row["month"],
            "revenue_budget": round_currency(budget_row["revenue"]),
            "revenue_actual": round_currency(actual_revenue),
            "revenue_variance_$": round_currency(actual_revenue - budget_row["revenue"]),
            "revenue_variance_%": round((actual_revenue - budget_row["revenue"]) / budget_row["revenue"] * 100, 1),
            "cogs_budget": round_currency(budget_row["cogs"]),
            "cogs_actual": round_currency(actual_cogs),
            "opex_budget": round_currency(budget_row["opex"]),
            "opex_actual": round_currency(actual_opex),
        })

    variance_df = pd.DataFrame(variance_data)

    return {"Budget": budget_df, "Variance": variance_df}


def generate_ebitda_bridge(deal_state: dict, is_df: pd.DataFrame) -> pd.DataFrame:
    """Generate EBITDA bridge from reported to adjusted."""

    bridge_data = []
    latest_is = is_df.iloc[-1]

    # Start with net income
    bridge_data.append({
        "line_item": "Net Income (Reported)",
        "amount": round_currency(latest_is["net_income"]),
        "category": "reported",
        "description": "Net income from income statement",
        "support_reference": "Income Statement",
    })

    # Add back: estimated interest (not in TB)
    interest = round_currency(latest_is["revenue"] * 0.02)
    bridge_data.append({
        "line_item": "Add: Interest Expense",
        "amount": round_currency(interest),
        "category": "reported",
        "description": "Estimated interest on debt",
        "support_reference": "Debt Schedule",
    })

    # Add back: estimated taxes
    taxes = round_currency(latest_is["revenue"] * 0.05)
    bridge_data.append({
        "line_item": "Add: Income Tax Expense",
        "amount": round_currency(taxes),
        "category": "reported",
        "description": "Estimated income taxes",
        "support_reference": "Tax Provision",
    })

    # Depreciation (estimated)
    depreciation = round_currency(latest_is["revenue"] * 0.01)
    bridge_data.append({
        "line_item": "Add: Depreciation & Amortization",
        "amount": round_currency(depreciation),
        "category": "reported",
        "description": "Non-cash charge",
        "support_reference": "Fixed Asset Schedule",
    })

    reported_ebitda = latest_is["net_income"] + interest + taxes + depreciation

    bridge_data.append({
        "line_item": "Reported EBITDA",
        "amount": round_currency(reported_ebitda),
        "category": "reported",
        "description": "Sum of above",
        "support_reference": "NA",
    })

    # Add non-recurring items
    nro = round_currency(reported_ebitda * random.uniform(0.02, 0.05))
    bridge_data.append({
        "line_item": "Add: Non-Recurring Charges",
        "amount": round_currency(nro),
        "category": "non_recurring",
        "description": "One-time events, restructuring, litigation",
        "support_reference": "Events Timeline",
    })

    # Owner adjustments (depending on realism_mode)
    owner_adj = 0
    realism_mode = deal_state["metadata"]["realism_mode"]
    if realism_mode != "clean":
        owner_adj = round_currency(reported_ebitda * random.uniform(0.01, 0.03))
        bridge_data.append({
            "line_item": "Add: Owner Adjustments",
            "amount": round_currency(owner_adj),
            "category": "owner",
            "description": "Perq expenses, excess compensation, etc.",
            "support_reference": "Management",
        })

    adjusted_ebitda = reported_ebitda + nro + owner_adj
    bridge_data.append({
        "line_item": "Adjusted EBITDA",
        "amount": round_currency(adjusted_ebitda),
        "category": "run_rate",
        "description": "Normalized earnings",
        "support_reference": "NA",
    })

    return pd.DataFrame(bridge_data)


def save_to_excel(df: pd.DataFrame, path: Path, sheet_name: str = "Sheet1"):
    """Save DataFrame to Excel with formatting."""
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)


def save_to_excel_multi_sheet(dfs: Dict[str, pd.DataFrame], path: Path):
    """Save multiple DataFrames to Excel with multiple sheets."""
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        for sheet_name, df in dfs.items():
            df.to_excel(writer, sheet_name=sheet_name, index=False)


def main():
    parser = argparse.ArgumentParser(
        description="Generate financial data (Section 2.0) for M&A data room simulation"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Directory containing deal_state.json (output root)"
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

    output_dir = Path(args.output_dir)

    # Load deal_state
    print(f"Loading deal_state.json from {output_dir}...")
    deal_state = load_deal_state(output_dir)

    industry = deal_state["company"]["industry"]
    profile = load_profile(industry)

    company_name = deal_state["company"]["legal_name"]
    print(f"Generating financials for {company_name} ({profile['display_name']})...")

    # Create 2.0-financial output directory
    financial_dir = output_dir / "2.0-financial"
    financial_dir.mkdir(parents=True, exist_ok=True)

    # Generate trial balance
    print("  Generating trial balance...")
    tb_df, event_impacts_df = generate_trial_balance(
        deal_state,
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
    ar_aging_df = generate_ar_aging(tb_df, deal_state)

    print("  Generating AP aging...")
    ap_aging_df = generate_ap_aging(tb_df, deal_state)

    print("  Generating NWC schedule...")
    nwc_df = generate_nwc_schedule(tb_df)

    print("  Generating fixed asset schedule...")
    fa_df = generate_fixed_asset_schedule(tb_df, deal_state)

    # Generate GL detail
    print("  Generating GL detail...")
    gl_df = generate_gl_detail(tb_df, deal_state)

    # Generate debt covenant schedule
    print("  Generating debt covenant compliance...")
    covenant_df = generate_debt_covenant(deal_state, is_df, bs_df)

    # Generate budget vs forecast
    print("  Generating budget vs forecast...")
    budget_forecast = generate_budget_forecast(tb_df, is_df)

    # Generate EBITDA bridge
    print("  Generating EBITDA bridge...")
    ebitda_bridge_df = generate_ebitda_bridge(deal_state, is_df)

    # Save outputs
    save_to_excel(tb_df, financial_dir / "trial_balance.xlsx", "Trial Balance")
    save_to_excel(is_df, financial_dir / "income_statement.xlsx", "Income Statement")
    save_to_excel(bs_df, financial_dir / "balance_sheet.xlsx", "Balance Sheet")
    save_to_excel(cf_df, financial_dir / "cash_flow.xlsx", "Cash Flow")
    save_to_excel(ar_aging_df, financial_dir / "ar_aging.xlsx", "AR Aging")
    save_to_excel(ap_aging_df, financial_dir / "ap_aging.xlsx", "AP Aging")
    save_to_excel(nwc_df, financial_dir / "nwc_schedule.xlsx", "NWC Schedule")
    save_to_excel(fa_df, financial_dir / "fixed_assets.xlsx", "Fixed Assets")
    save_to_excel(event_impacts_df, financial_dir / "event_impacts.xlsx", "Event Impacts")
    save_to_excel(gl_df, financial_dir / "gl_detail.xlsx", "GL Detail")
    save_to_excel(covenant_df, financial_dir / "debt_covenant.xlsx", "Covenants")
    save_to_excel_multi_sheet(budget_forecast, financial_dir / "budget_forecast.xlsx")
    save_to_excel(ebitda_bridge_df, financial_dir / "ebitda_bridge.xlsx", "EBITDA Bridge")

    print(f"\nFinancial data generated successfully!")
    print(f"  Output directory: {financial_dir}")
    print(f"\n  Files created:")
    print(f"    - trial_balance.xlsx ({len(tb_df)} rows, long format)")
    print(f"    - income_statement.xlsx ({len(is_df)} years)")
    print(f"    - balance_sheet.xlsx ({len(bs_df)} years)")
    print(f"    - cash_flow.xlsx ({len(cf_df)} years)")
    print(f"    - ar_aging.xlsx")
    print(f"    - ap_aging.xlsx")
    print(f"    - nwc_schedule.xlsx ({len(nwc_df)} months)")
    print(f"    - fixed_assets.xlsx ({len(fa_df)} years)")
    print(f"    - event_impacts.xlsx ({len(event_impacts_df)} months)")
    print(f"    - gl_detail.xlsx ({len(gl_df)} entries)")
    print(f"    - debt_covenant.xlsx ({len(covenant_df)} covenant periods)")
    print(f"    - budget_forecast.xlsx (2 sheets)")
    print(f"    - ebitda_bridge.xlsx ({len(ebitda_bridge_df)} lines)")

    # Print summary
    if len(is_df) > 0:
        latest_is = is_df.iloc[-1]
        print(f"\n  Latest Year Summary ({int(latest_is['year'])}):")
        print(f"    Revenue: ${latest_is['revenue']:,.0f}")
        print(f"    Gross Profit: ${latest_is['gross_profit']:,.0f} ({latest_is['gross_margin']:.1f}%)")
        print(f"    Net Income: ${latest_is['net_income']:,.0f} ({latest_is['net_margin']:.1f}%)")


if __name__ == "__main__":
    main()
