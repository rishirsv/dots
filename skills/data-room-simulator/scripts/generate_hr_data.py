#!/usr/bin/env python3
"""
HR Data Generator for M&A Data Room Simulator.

Generates employee and payroll data:
- Employee census (names, titles, departments, hire dates, salaries)
- Payroll register by period
- Department headcount breakdown
- Salary band summary
- Tenure analysis

CRITICAL: Headcount ties to company_seed, salary totals tie to P&L.

Usage:
    python generate_hr_data.py [--seed-file path/to/company_seed.json]
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


def load_trial_balance(output_dir: Path) -> pd.DataFrame:
    """Load trial balance to get salary expense targets."""
    tb_path = output_dir / "trial_balance.xlsx"
    if not tb_path.exists():
        raise FileNotFoundError("Trial balance not found. Run generate_financials.py first.")
    return pd.read_excel(tb_path)


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def save_to_excel(df: pd.DataFrame, filename: str, output_dir: Path, sheet_name: str = "Data"):
    """Save DataFrame to Excel."""
    path = output_dir / filename
    with pd.ExcelWriter(path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    return path


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


# Title templates by department
TITLES_BY_DEPT = {
    "Engineering": [
        ("Software Engineer", 80000, 150000),
        ("Senior Software Engineer", 120000, 180000),
        ("Staff Engineer", 160000, 220000),
        ("Engineering Manager", 150000, 200000),
        ("VP of Engineering", 200000, 300000),
    ],
    "Sales": [
        ("Sales Development Rep", 50000, 70000),
        ("Account Executive", 70000, 120000),
        ("Senior Account Executive", 100000, 160000),
        ("Sales Manager", 120000, 180000),
        ("VP of Sales", 180000, 280000),
    ],
    "Customer Success": [
        ("Customer Success Rep", 45000, 65000),
        ("Customer Success Manager", 65000, 95000),
        ("Senior CSM", 85000, 120000),
        ("Director of CS", 120000, 160000),
    ],
    "Marketing": [
        ("Marketing Coordinator", 45000, 65000),
        ("Marketing Manager", 70000, 100000),
        ("Senior Marketing Manager", 90000, 130000),
        ("Director of Marketing", 120000, 160000),
        ("VP of Marketing", 160000, 240000),
    ],
    "G&A": [
        ("Office Administrator", 40000, 55000),
        ("HR Coordinator", 50000, 70000),
        ("HR Manager", 75000, 110000),
        ("Accountant", 55000, 80000),
        ("Senior Accountant", 75000, 100000),
        ("Controller", 120000, 160000),
        ("CFO", 180000, 300000),
    ],
    "Product": [
        ("Product Manager", 100000, 150000),
        ("Senior Product Manager", 130000, 180000),
        ("Director of Product", 160000, 220000),
        ("VP of Product", 200000, 280000),
    ],
    "Operations": [
        ("Operations Coordinator", 40000, 55000),
        ("Operations Manager", 60000, 90000),
        ("Director of Operations", 100000, 150000),
        ("COO", 180000, 280000),
    ],
    "Professional Staff": [
        ("Associate", 55000, 75000),
        ("Senior Associate", 70000, 95000),
        ("Manager", 85000, 120000),
        ("Senior Manager", 110000, 150000),
        ("Director", 140000, 190000),
        ("Partner", 200000, 400000),
    ],
    "Project Management": [
        ("Project Coordinator", 45000, 60000),
        ("Project Manager", 65000, 95000),
        ("Senior PM", 90000, 130000),
        ("Director of PM", 120000, 160000),
    ],
    "Field Operations": [
        ("Laborer", 35000, 50000),
        ("Skilled Tradesperson", 50000, 80000),
        ("Foreman", 65000, 90000),
        ("Superintendent", 80000, 120000),
    ],
    "Production": [
        ("Production Worker", 35000, 50000),
        ("Machine Operator", 40000, 60000),
        ("Production Supervisor", 55000, 80000),
        ("Production Manager", 75000, 110000),
    ],
    "Warehouse & Shipping": [
        ("Warehouse Associate", 32000, 45000),
        ("Shipping Coordinator", 40000, 55000),
        ("Warehouse Manager", 55000, 80000),
    ],
    "Store Operations": [
        ("Sales Associate", 28000, 38000),
        ("Shift Supervisor", 35000, 48000),
        ("Assistant Store Manager", 45000, 60000),
        ("Store Manager", 55000, 80000),
        ("District Manager", 80000, 120000),
    ],
    "Buying & Merchandising": [
        ("Buyer", 55000, 85000),
        ("Senior Buyer", 75000, 110000),
        ("Merchandising Manager", 85000, 120000),
    ],
    "Clinical Providers": [
        ("Associate Dentist", 140000, 260000),
        ("Senior Dentist", 200000, 340000),
        ("Clinical Director", 260000, 420000),
    ],
    "Hygiene": [
        ("Dental Hygienist", 70000, 110000),
        ("Senior Dental Hygienist", 90000, 130000),
        ("Lead Hygienist", 105000, 145000),
    ],
    "Clinical Support": [
        ("Dental Assistant", 42000, 65000),
        ("Lead Dental Assistant", 56000, 76000),
        ("Sterilization Technician", 38000, 52000),
    ],
    "Front Desk": [
        ("Patient Coordinator", 38000, 58000),
        ("Treatment Coordinator", 48000, 76000),
        ("Front Office Manager", 65000, 95000),
    ],
    "Revenue Cycle": [
        ("Insurance Coordinator", 45000, 70000),
        ("Billing Specialist", 50000, 78000),
        ("Revenue Cycle Manager", 85000, 125000),
    ],
    "Administration": [
        ("Practice Administrator", 80000, 130000),
        ("Regional Operations Manager", 110000, 170000),
        ("Director of Operations", 145000, 220000),
    ],
}


def generate_employees(seed: dict, profile: dict, tb: pd.DataFrame) -> pd.DataFrame:
    """Generate employee census."""

    headcount = seed["financials"]["headcount"]
    departments = profile.get("departments", [])
    founding_year = seed["company"]["founded"]
    current_year = datetime.now().year

    # Anchor salary to compensation accounts in the trial balance when available.
    compensation_codes = identify_compensation_accounts(profile)
    latest_year = int(tb["year"].max())
    latest_year_tb = tb[tb["year"] == latest_year]
    target_annual_salary = 0.0
    for code in compensation_codes:
        col = f"acct_{code}"
        if col in latest_year_tb.columns:
            target_annual_salary += float(latest_year_tb[col].sum())

    if target_annual_salary <= 0:
        annual_revenue = seed["financials"]["annual_revenue"]
        target_annual_salary = annual_revenue * random.uniform(0.35, 0.50)

    # First pass: calculate department counts (ensure total = target headcount)
    employees = []
    dept_counts = {}

    # Calculate initial counts using floor
    total_assigned = 0
    for dept_info in departments:
        dept_name = dept_info["name"]
        dept_pct = dept_info["typical_pct"]
        dept_count = max(1, int(headcount * dept_pct))
        dept_counts[dept_name] = dept_count
        total_assigned += dept_count

    # Distribute any remaining headcount to departments
    remaining = headcount - total_assigned
    dept_names = list(dept_counts.keys())
    while remaining > 0:
        # Add to departments proportionally
        for dept_name in dept_names:
            if remaining <= 0:
                break
            dept_counts[dept_name] += 1
            remaining -= 1

    # If we overshot (shouldn't happen often), remove from largest depts
    while remaining < 0:
        largest_dept = max(dept_counts, key=dept_counts.get)
        if dept_counts[largest_dept] > 1:
            dept_counts[largest_dept] -= 1
            remaining += 1
        else:
            break

    for dept_info in departments:
        dept_name = dept_info["name"]
        dept_count = dept_counts[dept_name]

        # Get title templates for department
        if dept_name in TITLES_BY_DEPT:
            titles = TITLES_BY_DEPT[dept_name]
        else:
            # Default titles
            titles = [
                ("Associate", 45000, 65000),
                ("Specialist", 55000, 80000),
                ("Manager", 75000, 110000),
                ("Director", 110000, 160000),
            ]

        for i in range(dept_count):
            # Pick a title (weighted toward junior roles)
            weights = [max(0.1, 1 - j*0.2) for j in range(len(titles))]
            title_info = random.choices(titles, weights=weights)[0]
            title, min_sal, max_sal = title_info

            # Generate salary (will be adjusted later to hit target)
            base_salary = random.uniform(min_sal, max_sal)

            # Hire date - longer tenure for senior roles
            if "VP" in title or "Director" in title or "Partner" in title:
                min_tenure = 3
                max_tenure = min(15, current_year - founding_year)
            elif "Senior" in title or "Manager" in title:
                min_tenure = 2
                max_tenure = min(10, current_year - founding_year)
            else:
                min_tenure = 0
                max_tenure = min(5, current_year - founding_year)

            tenure_years = random.uniform(min_tenure, max(min_tenure + 0.5, max_tenure))
            hire_date = datetime(current_year, 1, 1) - timedelta(days=int(tenure_years * 365))
            hire_date = hire_date.replace(day=random.randint(1, 28))

            employees.append({
                "employee_id": f"EMP-{len(employees)+1:04d}",
                "name": fake.name(),
                "email": fake.email(),
                "department": dept_name,
                "title": title,
                "base_salary": round_currency(base_salary),
                "hire_date": hire_date.strftime("%Y-%m-%d"),
                "status": "active",
                "manager_id": None,  # Will fill in later
                "location": seed["company"]["headquarters"]["city"],
            })

    # Adjust salaries to hit target
    total_salary = sum(e["base_salary"] for e in employees)
    scale_factor = target_annual_salary / total_salary if total_salary > 0 else 1

    for emp in employees:
        emp["base_salary"] = round_currency(emp["base_salary"] * scale_factor)

    # Add tenure years
    for emp in employees:
        hire_date = datetime.strptime(emp["hire_date"], "%Y-%m-%d")
        tenure = (datetime.now() - hire_date).days / 365
        emp["tenure_years"] = round(tenure, 1)

    # Assign managers (simplified - just pick senior person in same dept)
    dept_seniors = {}
    for emp in employees:
        dept = emp["department"]
        if dept not in dept_seniors or emp["base_salary"] > dept_seniors[dept]["base_salary"]:
            dept_seniors[dept] = emp

    for emp in employees:
        if emp["employee_id"] != dept_seniors.get(emp["department"], {}).get("employee_id"):
            senior = dept_seniors.get(emp["department"])
            if senior:
                emp["manager_id"] = senior["employee_id"]

    return pd.DataFrame(employees)


def generate_payroll_register(employees: pd.DataFrame, tb: pd.DataFrame, profile: dict) -> pd.DataFrame:
    """Generate payroll register by period."""

    payroll_data = []
    compensation_codes = identify_compensation_accounts(profile)

    for _, period_row in tb.iterrows():
        period = period_row["period"]
        period_date = datetime.strptime(period + "-01", "%Y-%m-%d")

        # Get active employees for this period
        active_emps = employees[
            pd.to_datetime(employees["hire_date"]) <= period_date
        ]

        period_entries = []
        for _, emp in active_emps.iterrows():
            monthly_salary = emp["base_salary"] / 12

            # Add some benefits (typically 20-30% of salary)
            benefits_pct = random.uniform(0.20, 0.30)
            benefits = monthly_salary * benefits_pct

            # Taxes (employer portion ~7.65% FICA + unemployment)
            taxes = monthly_salary * 0.08

            period_entries.append({
                "period": period,
                "employee_id": emp["employee_id"],
                "employee_name": emp["name"],
                "department": emp["department"],
                "gross_pay": round_currency(monthly_salary),
                "benefits": round_currency(benefits),
                "employer_taxes": round_currency(taxes),
                "total_cost": round_currency(monthly_salary + benefits + taxes),
            })

        target_period_cost = 0.0
        for code in compensation_codes:
            col = f"acct_{code}"
            if col in tb.columns:
                target_period_cost += float(period_row.get(col, 0))

        # Scale payroll to tie to financial payroll-linked accounts.
        if target_period_cost > 0 and period_entries:
            current_total = sum(e["total_cost"] for e in period_entries)
            if current_total > 0:
                scale = target_period_cost / current_total
                for entry in period_entries:
                    entry["gross_pay"] = round_currency(entry["gross_pay"] * scale)
                    entry["benefits"] = round_currency(entry["benefits"] * scale)
                    entry["employer_taxes"] = round_currency(entry["employer_taxes"] * scale)
                    entry["total_cost"] = round_currency(entry["gross_pay"] + entry["benefits"] + entry["employer_taxes"])
                delta = round_currency(target_period_cost - sum(e["total_cost"] for e in period_entries))
                period_entries[-1]["gross_pay"] = round_currency(period_entries[-1]["gross_pay"] + delta)
                period_entries[-1]["total_cost"] = round_currency(period_entries[-1]["gross_pay"] + period_entries[-1]["benefits"] + period_entries[-1]["employer_taxes"])

        payroll_data.extend(period_entries)

    return pd.DataFrame(payroll_data)


def generate_department_summary(employees: pd.DataFrame) -> pd.DataFrame:
    """Generate department headcount and salary breakdown."""

    summary = employees.groupby("department").agg({
        "employee_id": "count",
        "base_salary": ["sum", "mean", "min", "max"],
    }).reset_index()

    summary.columns = [
        "department", "headcount",
        "total_salary", "avg_salary", "min_salary", "max_salary"
    ]

    # Add percentage
    total_headcount = summary["headcount"].sum()
    summary["pct_of_total"] = (summary["headcount"] / total_headcount * 100).round(1)

    # Sort by headcount
    summary = summary.sort_values("headcount", ascending=False)

    return summary


def generate_salary_bands(employees: pd.DataFrame) -> pd.DataFrame:
    """Generate salary band summary."""

    bands = [
        (0, 50000, "Under $50K"),
        (50000, 75000, "$50K - $75K"),
        (75000, 100000, "$75K - $100K"),
        (100000, 150000, "$100K - $150K"),
        (150000, 200000, "$150K - $200K"),
        (200000, float('inf'), "$200K+"),
    ]

    band_data = []
    for min_sal, max_sal, label in bands:
        in_band = employees[
            (employees["base_salary"] >= min_sal) &
            (employees["base_salary"] < max_sal)
        ]

        band_data.append({
            "salary_band": label,
            "headcount": len(in_band),
            "total_salary": round_currency(in_band["base_salary"].sum()),
            "avg_salary": round_currency(in_band["base_salary"].mean()) if len(in_band) > 0 else 0,
            "pct_of_total": round(len(in_band) / len(employees) * 100, 1),
        })

    return pd.DataFrame(band_data)


def generate_tenure_analysis(employees: pd.DataFrame) -> pd.DataFrame:
    """Generate tenure distribution analysis."""

    bands = [
        (0, 1, "< 1 year"),
        (1, 2, "1-2 years"),
        (2, 3, "2-3 years"),
        (3, 5, "3-5 years"),
        (5, 10, "5-10 years"),
        (10, float('inf'), "10+ years"),
    ]

    tenure_data = []
    for min_tenure, max_tenure, label in bands:
        in_band = employees[
            (employees["tenure_years"] >= min_tenure) &
            (employees["tenure_years"] < max_tenure)
        ]

        tenure_data.append({
            "tenure_band": label,
            "headcount": len(in_band),
            "avg_salary": round_currency(in_band["base_salary"].mean()) if len(in_band) > 0 else 0,
            "pct_of_total": round(len(in_band) / len(employees) * 100, 1),
        })

    return pd.DataFrame(tenure_data)


def main():
    parser = argparse.ArgumentParser(
        description="Generate HR data for M&A data room simulation"
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

    print(f"Generating HR data for {seed['company']['name']}...")

    # Load trial balance
    tb = load_trial_balance(output_dir)

    # Generate employee census
    print("  Generating employee census...")
    employees_df = generate_employees(seed, profile, tb)

    # Generate payroll register
    print("  Generating payroll register...")
    payroll_df = generate_payroll_register(employees_df, tb, profile)

    # Generate department summary
    print("  Generating department summary...")
    dept_summary_df = generate_department_summary(employees_df)

    # Generate salary bands
    print("  Generating salary bands...")
    salary_bands_df = generate_salary_bands(employees_df)

    # Generate tenure analysis
    print("  Generating tenure analysis...")
    tenure_df = generate_tenure_analysis(employees_df)

    # Save outputs
    output_dir.mkdir(parents=True, exist_ok=True)

    save_to_excel(employees_df, "employee_census.xlsx", output_dir, "Employees")
    save_to_excel(payroll_df, "payroll_register.xlsx", output_dir, "Payroll")
    save_to_excel(dept_summary_df, "department_summary.xlsx", output_dir, "Departments")
    save_to_excel(salary_bands_df, "salary_bands.xlsx", output_dir, "Salary Bands")
    save_to_excel(tenure_df, "tenure_analysis.xlsx", output_dir, "Tenure")

    # Print summary
    print(f"\n✓ HR data generated successfully!")
    print(f"  Output directory: {output_dir}")
    print(f"\n  Files created:")
    print(f"    - employee_census.xlsx ({len(employees_df)} employees)")
    print(f"    - payroll_register.xlsx ({len(payroll_df)} entries)")
    print(f"    - department_summary.xlsx ({len(dept_summary_df)} departments)")
    print(f"    - salary_bands.xlsx")
    print(f"    - tenure_analysis.xlsx")

    # Validate headcount
    target_headcount = seed["financials"]["headcount"]
    actual_headcount = len(employees_df)

    print(f"\n  Validation:")
    print(f"    Target headcount: {target_headcount}")
    print(f"    Actual headcount: {actual_headcount}")

    if abs(target_headcount - actual_headcount) <= 2:
        print(f"    ✓ Headcount within tolerance")
    else:
        print(f"    ⚠ Headcount variance: {actual_headcount - target_headcount}")

    # Total compensation
    total_annual_salary = employees_df["base_salary"].sum()
    print(f"\n  Compensation Summary:")
    print(f"    Total annual salaries: ${total_annual_salary:,.0f}")
    print(f"    Average salary: ${total_annual_salary/len(employees_df):,.0f}")


if __name__ == "__main__":
    main()
