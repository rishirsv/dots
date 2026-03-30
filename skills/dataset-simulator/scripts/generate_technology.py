#!/usr/bin/env python3
"""
Technology Data Generator for M&A Data Room Simulator.

Generates technology-related artifacts:
- Systems inventory (applications and infrastructure)
- IP register (trademarks, patents, domains)
- Software licenses (vendor agreements)

Usage:
    python generate_technology.py --output-dir /path/to/output
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


def generate_systems_inventory(deal_state: dict) -> pd.DataFrame:
    """Generate systems and applications inventory."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    headcount = deal_state["financials_seed"]["headcount"]
    revenue = deal_state["financials_seed"]["annual_revenue"]

    # Core systems for all companies
    core_systems = [
        ("Email & Collaboration", "Communication", "Microsoft", "cloud", 1, 50),
        ("Accounting System", "Accounting", "QuickBooks", "cloud", 5, 200),
        ("General Ledger", "Accounting", "NetSuite", "cloud", 3, 500),
    ]

    # Industry-specific systems
    industry_systems = {
        "healthcare_provider": [
            ("Practice Management", "Practice_Management", "Dentrix", "cloud", 20, 2500),
            ("Patient Records", "Practice_Management", "Eaglesoft", "cloud", 15, 1500),
            ("Scheduling", "Practice_Management", "Curve Dental", "cloud", 10, 800),
            ("Billing & Insurance", "Accounting", "Claim Connect", "cloud", 5, 400),
        ],
        "manufacturing": [
            ("ERP System", "ERP", "SAP", "on_premise", 30, 15000),
            ("PLM", "Development", "Windchill", "on_premise", 10, 3000),
            ("Production Scheduling", "ERP", "Shopfloor Connect", "cloud", 20, 2000),
            ("Quality Management", "ERP", "MasterControl", "cloud", 8, 1200),
        ],
        "construction": [
            ("Project Management", "ERP", "Procore", "cloud", 25, 3500),
            ("Estimating", "ERP", "BuildCalcs", "cloud", 8, 1000),
            ("Field Management", "ERP", "Fieldwire", "cloud", 30, 4000),
        ],
        "logistics": [
            ("TMS", "ERP", "J.B. Hunt 360", "cloud", 20, 2000),
            ("WMS", "ERP", "Manhattan", "on_premise", 40, 8000),
            ("Tracking", "ERP", "FourKites", "cloud", 15, 1500),
        ],
        "retail": [
            ("POS System", "E-commerce", "Square", "cloud", 50, 2000),
            ("Inventory", "ERP", "NetSuite", "cloud", 10, 1500),
            ("E-commerce", "E-commerce", "Shopify", "cloud", 5, 800),
        ],
    }

    # Common business systems
    common_systems = [
        ("CRM", "CRM", "Salesforce", "cloud", 20),
        ("Marketing Automation", "CRM", "HubSpot", "cloud", 3),
        ("Business Intelligence", "BI", "Tableau", "cloud", 5),
        ("HR Management", "HCM", "Workday", "cloud", headcount),
        ("Learning Management", "HCM", "TalentLMS", "cloud", headcount),
        ("Data Security", "Security", "Okta", "cloud", 2),
        ("Backup & Disaster Recovery", "Security", "Veeam", "on_premise", 2),
        ("Network Firewall", "Security", "Palo Alto", "on_premise", 1),
        ("Development Tools", "Development", "GitHub", "cloud", 15),
        ("Project Management", "Development", "Jira", "cloud", 10),
    ]

    # Build inventory
    systems = core_systems.copy()

    # Add industry-specific
    if industry in industry_systems:
        systems.extend(industry_systems[industry])

    # Add common systems (filtered by size)
    if headcount > 5:
        systems.extend(common_systems)

    system_data = []
    for system in systems:
        if len(system) == 6:
            name, category, vendor, deployment, users, cost = system
        else:
            name, category, vendor, deployment, users = system
            cost = fake.random.randint(500, 5000)

        expiration = (datetime.now() + timedelta(days=fake.random.randint(30, 730)))

        criticality = "high" if name in ["Email", "Accounting", "ERP"] else fake.random.choice(
            ["high", "high", "medium", "low"]
        )

        notes = ""
        if fake.boolean():
            notes = f"Renewal {fake.random.choice(['due Q1', 'due Q2', 'due Q3', 'due Q4'])} 2025"

        system_data.append({
            "system_name": name,
            "category": category,
            "vendor": vendor,
            "deployment": deployment,
            "users": users,
            "annual_cost": round_currency(cost),
            "contract_expiration": expiration.strftime("%Y-%m-%d"),
            "criticality": criticality,
            "notes": notes,
        })

    return pd.DataFrame(system_data)


def generate_ip_register(deal_state: dict) -> pd.DataFrame:
    """Generate IP register (trademarks, patents, domains, etc)."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    company_name = deal_state["company"]["name"]

    ip_data = []

    # Always include main trademark
    ip_data.append({
        "ip_type": "trademark",
        "registration_name": company_name,
        "registration_number": f"TM-{fake.random.randint(1000000, 9999999)}",
        "jurisdiction": "US",
        "filing_date": (datetime.now() - timedelta(days=fake.random.randint(365, 3650))).strftime("%Y-%m-%d"),
        "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(365, 5475))).strftime("%Y-%m-%d"),
        "status": "active",
        "owner_entity": company_name,
        "notes": "Primary trademark",
    })

    # Add variant trademarks
    variants = [f"{company_name} Pro", f"{company_name} Plus", f"{company_name} Labs"]
    for variant in fake.random.sample(variants, min(2, len(variants))):
        ip_data.append({
            "ip_type": "trademark",
            "registration_name": variant,
            "registration_number": f"TM-{fake.random.randint(1000000, 9999999)}",
            "jurisdiction": "US",
            "filing_date": (datetime.now() - timedelta(days=fake.random.randint(180, 1800))).strftime("%Y-%m-%d"),
            "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(365, 3650))).strftime("%Y-%m-%d"),
            "status": "active",
            "owner_entity": company_name,
            "notes": "Trademark variant",
        })

    # Domains
    domains = [
        company_name.lower().replace(" ", "") + ".com",
        company_name.lower().replace(" ", "") + ".io",
        "app." + company_name.lower().replace(" ", "") + ".com",
    ]
    for domain in domains:
        ip_data.append({
            "ip_type": "domain",
            "registration_name": domain,
            "registration_number": f"DOMAIN-{fake.random.randint(1000, 9999)}",
            "jurisdiction": "Registrar: VeriSign",
            "filing_date": (datetime.now() - timedelta(days=fake.random.randint(365, 5475))).strftime("%Y-%m-%d"),
            "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(30, 1095))).strftime("%Y-%m-%d"),
            "status": "active",
            "owner_entity": company_name,
            "notes": f"Registered with {fake.random.choice(['GoDaddy', 'Namecheap', 'Route53'])}",
        })

    # Patents (more for tech/manufacturing)
    if industry in ["manufacturing", "healthcare_provider"]:
        num_patents = fake.random.randint(1, 3)
        for i in range(num_patents):
            issue_date = datetime.now() - timedelta(days=fake.random.randint(180, 3650))
            expiration = issue_date + timedelta(days=365*20)  # 20-year patent

            ip_data.append({
                "ip_type": "patent",
                "registration_name": f"Patent - {fake.word().title()} Technology",
                "registration_number": f"US-{fake.random.randint(10000000, 99999999)}",
                "jurisdiction": "US",
                "filing_date": (issue_date - timedelta(days=365*2)).strftime("%Y-%m-%d"),
                "expiration_date": expiration.strftime("%Y-%m-%d"),
                "status": "active",
                "owner_entity": company_name,
                "notes": f"Tech in {fake.word()} industry",
            })

    # Copyrights
    for i in range(fake.random.randint(1, 2)):
        ip_data.append({
            "ip_type": "copyright",
            "registration_name": f"Software/Content {i+1}",
            "registration_number": f"CR-{fake.random.randint(1000000, 9999999)}",
            "jurisdiction": "US",
            "filing_date": (datetime.now() - timedelta(days=fake.random.randint(180, 1800))).strftime("%Y-%m-%d"),
            "expiration_date": (datetime.now() + timedelta(days=365*50)).strftime("%Y-%m-%d"),
            "status": "active",
            "owner_entity": company_name,
            "notes": "Automatic copyright upon creation",
        })

    return pd.DataFrame(ip_data)


def generate_software_licenses(deal_state: dict, systems_df: pd.DataFrame) -> pd.DataFrame:
    """Generate software license agreements."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    revenue = deal_state["financials_seed"]["annual_revenue"]
    headcount = deal_state["financials_seed"]["headcount"]

    license_data = []

    # Add licenses for systems in inventory
    for _, system in systems_df.iterrows():
        vendor = system["vendor"]
        cost = system["annual_cost"]
        expiration = datetime.strptime(system["contract_expiration"], "%Y-%m-%d")

        # Determine license type
        if system["deployment"] == "cloud":
            license_type = "SaaS"
        elif system["users"] > 100:
            license_type = "enterprise"
        elif system["users"] > 10:
            license_type = "per_seat"
        else:
            license_type = "per_seat"

        contract_start = expiration - timedelta(days=365)
        auto_renew = fake.boolean()

        license_data.append({
            "software_name": system["system_name"],
            "vendor": vendor,
            "license_type": license_type,
            "seats_or_units": system["users"],
            "annual_cost": cost,
            "contract_start": contract_start.strftime("%Y-%m-%d"),
            "contract_end": expiration.strftime("%Y-%m-%d"),
            "auto_renew": "Yes" if auto_renew else "No",
            "notes": "Standard terms" if fake.boolean() else f"Custom deal - {fake.random.randint(-20, 15)}% discount",
        })

    # Add additional open-source and free tools
    open_source_tools = [
        ("Linux", "Linux Foundation", "open_source", 50, 0),
        ("Apache Web Server", "Apache Foundation", "open_source", 10, 0),
        ("MySQL", "Oracle", "open_source", 20, 0),
        ("PostgreSQL", "PostgreSQL Global", "open_source", 15, 0),
    ]

    for tool_name, tool_vendor, lic_type, units, cost in open_source_tools:
        if fake.boolean():
            license_data.append({
                "software_name": tool_name,
                "vendor": tool_vendor,
                "license_type": lic_type,
                "seats_or_units": units,
                "annual_cost": 0,
                "contract_start": "N/A",
                "contract_end": "N/A",
                "auto_renew": "N/A",
                "notes": "Open source - no license cost",
            })

    # Scale total software spend to 1-3% of revenue
    df = pd.DataFrame(license_data)
    total_software = df[df["annual_cost"] > 0]["annual_cost"].sum()
    target_software = revenue * fake.random.uniform(0.01, 0.03)

    if total_software > 0:
        scale = target_software / total_software
        for i, row in enumerate(df.iterrows()):
            if row[1]["annual_cost"] > 0:
                df.at[i, "annual_cost"] = round_currency(row[1]["annual_cost"] * scale)

    return df


def main():
    parser = argparse.ArgumentParser(
        description="Generate technology data for M&A data room simulation"
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
    print(f"Generating technology data for {company_name}...")

    # Create section directory
    section_dir = output_dir / "7.0-technology"
    section_dir.mkdir(parents=True, exist_ok=True)

    # Generate all artifacts
    print("  Generating systems inventory...")
    systems_df = generate_systems_inventory(deal_state)

    print("  Generating IP register...")
    ip_df = generate_ip_register(deal_state)

    print("  Generating software licenses...")
    licenses_df = generate_software_licenses(deal_state, systems_df)

    # Save to Excel
    save_to_excel(systems_df, "systems_inventory.xlsx", section_dir, "Systems")
    save_to_excel(ip_df, "ip_register.xlsx", section_dir, "IP")
    save_to_excel(licenses_df, "software_licenses.xlsx", section_dir, "Licenses")

    # Print summary
    print(f"\n✓ Technology data generated successfully!")
    print(f"  Output directory: {section_dir}")
    print(f"\n  Files created:")
    print(f"    - systems_inventory.xlsx ({len(systems_df)} systems)")
    print(f"    - ip_register.xlsx ({len(ip_df)} IP assets)")
    print(f"    - software_licenses.xlsx ({len(licenses_df)} licenses)")


if __name__ == "__main__":
    main()
