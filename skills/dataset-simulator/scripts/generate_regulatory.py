#!/usr/bin/env python3
"""
Regulatory Data Generator for M&A Data Room Simulator.

Generates regulatory and compliance artifacts:
- License register (business, professional, industry licenses)
- Training log (compliance and safety training)
- Incident log (safety, compliance, security incidents)

Usage:
    python generate_regulatory.py --output-dir /path/to/output
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


def generate_license_register(deal_state: dict) -> pd.DataFrame:
    """Generate business and professional license register."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    hq_state = deal_state["company"]["headquarters"]["state"]
    company_name = deal_state["company"]["name"]
    labor_model = deal_state.get("profile", {}).get("labor_model", "standard")
    num_providers = deal_state["financials_seed"].get("headcount", 0)

    license_data = []

    # Universal licenses for all companies
    # State business license
    license_data.append({
        "license_type": "State Business License",
        "issuing_authority": f"{hq_state} Secretary of State",
        "license_number": f"BL-{fake.random.randint(1000000, 9999999)}",
        "entity_name": company_name,
        "state": hq_state,
        "issue_date": (datetime.now() - timedelta(days=fake.random.randint(365, 3650))).strftime("%Y-%m-%d"),
        "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(365, 730))).strftime("%Y-%m-%d"),
        "status": "active",
        "conditions": "Standard terms",
        "renewal_frequency": "Annual",
    })

    # Local business permit
    license_data.append({
        "license_type": "Local Business Permit",
        "issuing_authority": f"{deal_state['company']['headquarters']['city']} Business License",
        "license_number": f"LP-{fake.random.randint(100000, 999999)}",
        "entity_name": company_name,
        "state": hq_state,
        "issue_date": (datetime.now() - timedelta(days=fake.random.randint(180, 3650))).strftime("%Y-%m-%d"),
        "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(30, 365))).strftime("%Y-%m-%d"),
        "status": "active",
        "conditions": "Compliant with local ordinances",
        "renewal_frequency": "Annual",
    })

    # Industry-specific licenses
    industry_licenses = {
        "healthcare_provider": [
            ("Dental License", "State Dental Board", f"DEN-{fake.random.randint(100000, 999999)}", "Professional"),
            ("DEA Registration", "DEA", f"DEA-{fake.random.randint(1000000, 9999999)}", "Federal"),
            ("Controlled Substances License", "State Board of Pharmacy", f"CS-{fake.random.randint(100000, 999999)}", "Professional"),
            ("Health Facility License", "State Health Department", f"HF-{fake.random.randint(1000000, 9999999)}", "Facility"),
        ],
        "construction": [
            ("Construction License", "State Licensing Board", f"CONST-{fake.random.randint(1000000, 9999999)}", "Contractor"),
            ("Bonding License", "Surety Board", f"BOND-{fake.random.randint(100000, 999999)}", "Financial"),
            ("OSHA Registration", "OSHA", f"OSHA-{fake.random.randint(100000, 999999)}", "Safety"),
        ],
        "manufacturing": [
            ("Manufacturing License", "State Industrial Board", f"MFG-{fake.random.randint(1000000, 9999999)}", "Industrial"),
            ("Environmental Permit", "EPA", f"ENV-{fake.random.randint(100000, 999999)}", "Environmental"),
            ("OSHA Registration", "OSHA", f"OSHA-{fake.random.randint(100000, 999999)}", "Safety"),
        ],
        "logistics": [
            ("Motor Carrier License", "FMCSA", f"MC-{fake.random.randint(1000000, 9999999)}", "Federal"),
            ("Hazmat License", "DOT", f"HM-{fake.random.randint(100000, 999999)}", "Federal"),
        ],
        "retail": [
            ("Retail License", "State Sales License", f"RETAIL-{fake.random.randint(1000000, 9999999)}", "Sales"),
            ("Liquor License", "State Alcoholic Beverage Commission", f"LIQ-{fake.random.randint(100000, 999999)}", "Alcohol"),
        ],
    }

    if industry in industry_licenses:
        for lic_type, authority, lic_num, lic_category in industry_licenses[industry]:
            license_data.append({
                "license_type": lic_type,
                "issuing_authority": authority,
                "license_number": lic_num,
                "entity_name": company_name,
                "state": hq_state,
                "issue_date": (datetime.now() - timedelta(days=fake.random.randint(180, 1825))).strftime("%Y-%m-%d"),
                "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(90, 730))).strftime("%Y-%m-%d"),
                "status": "active",
                "conditions": "Standard conditions",
                "renewal_frequency": "Annual" if fake.boolean() else "Biennial",
            })

    # Provider-specific licenses for licensed_provider labor model
    if labor_model == "licensed_provider":
        num_licenses = min(int(num_providers * 0.8), 15)
        for i in range(num_licenses):
            license_data.append({
                "license_type": "Professional License",
                "issuing_authority": f"{hq_state} Professional Board",
                "license_number": f"PROF-{fake.random.randint(1000000, 9999999)}",
                "entity_name": f"Provider {i+1}",
                "state": hq_state,
                "issue_date": (datetime.now() - timedelta(days=fake.random.randint(730, 3650))).strftime("%Y-%m-%d"),
                "expiration_date": (datetime.now() + timedelta(days=fake.random.randint(90, 730))).strftime("%Y-%m-%d"),
                "status": "active" if fake.boolean(chance_of_getting_true=95) else "pending_renewal",
                "conditions": "Malpractice insurance required",
                "renewal_frequency": "Annual",
            })

    return pd.DataFrame(license_data)


def generate_training_log(deal_state: dict) -> pd.DataFrame:
    """Generate compliance and safety training log."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    regulatory_burden = deal_state["metadata"].get("regulatory_burden", "light")
    headcount = deal_state["financials_seed"]["headcount"]

    training_data = []

    # Universal trainings
    universal_trainings = [
        ("Anti-Harassment Training", "compliance", "annual", "online", "Company Policy"),
        ("Data Security & Privacy", "compliance", "annual", "online", "Company Policy"),
        ("Code of Conduct", "compliance", "annual", "online", "Company Policy"),
        ("General Safety", "safety", "annual", "classroom", "OSHA"),
    ]

    # Industry-specific trainings
    industry_trainings = {
        "healthcare_provider": [
            ("HIPAA Compliance", "compliance", "annual", "online", "HIPAA"),
            ("Infection Control", "compliance", "quarterly", "classroom", "State Health Dept"),
            ("Patient Privacy", "compliance", "annual", "online", "HIPAA"),
            ("Sterilization & Infection Prevention", "safety", "annual", "classroom", "OSHA"),
        ],
        "construction": [
            ("OSHA Site Safety", "safety", "quarterly", "classroom", "OSHA"),
            ("Fall Protection", "safety", "annual", "classroom", "OSHA"),
            ("Hazard Communication", "safety", "annual", "online", "OSHA"),
            ("Equipment Operation", "safety", "annual", "on_the_job", "Company Policy"),
        ],
        "manufacturing": [
            ("OSHA Machine Safety", "safety", "annual", "classroom", "OSHA"),
            ("Chemical Handling", "safety", "annual", "classroom", "OSHA"),
            ("Emergency Response", "safety", "annual", "classroom", "Company Policy"),
        ],
        "retail": [
            ("Customer Service", "technical", "annual", "online", "Company Policy"),
            ("POS System Training", "technical", "quarterly", "on_the_job", "Company Policy"),
        ],
    }

    # Combine trainings
    all_trainings = universal_trainings.copy()
    if industry in industry_trainings:
        all_trainings.extend(industry_trainings[industry])

    # Add more trainings for heavy regulatory burden
    if regulatory_burden == "heavy":
        all_trainings.extend([
            ("Regulatory Updates", "compliance", "quarterly", "online", "Industry Assoc"),
            ("Quality Control", "technical", "quarterly", "classroom", "Company Policy"),
        ])

    # Generate records for each training
    for training_name, category, frequency, delivery, req_by in all_trainings:
        training_id = f"TRN-{fake.random.randint(1000000, 9999999)}"

        # Calculate last completed and next due based on frequency
        if frequency == "annual":
            last_completed = datetime.now() - timedelta(days=fake.random.randint(30, 365))
            next_due = last_completed + timedelta(days=365)
        elif frequency == "quarterly":
            last_completed = datetime.now() - timedelta(days=fake.random.randint(30, 90))
            next_due = last_completed + timedelta(days=90)
        else:  # one_time
            last_completed = datetime.now() - timedelta(days=fake.random.randint(180, 1095))
            next_due = datetime.now() + timedelta(days=365)

        # Completion rate
        completion_rate = fake.random.randint(80, 100)

        training_data.append({
            "training_id": training_id,
            "training_name": training_name,
            "category": category,
            "frequency": frequency,
            "last_completed_date": last_completed.strftime("%Y-%m-%d"),
            "next_due_date": next_due.strftime("%Y-%m-%d"),
            "completion_rate_pct": completion_rate,
            "delivery_method": delivery,
            "required_by": req_by,
        })

    return pd.DataFrame(training_data)


def generate_incident_log(deal_state: dict) -> pd.DataFrame:
    """Generate safety, compliance, and security incident log."""
    fake = Faker()
    Faker.seed(deal_state["metadata"]["seed"])

    industry = deal_state["company"]["industry"]
    regulatory_burden = deal_state["metadata"].get("regulatory_burden", "light")

    # Determine incident count by regulatory burden
    incident_counts = {
        "light": (3, 8),
        "moderate": (5, 12),
        "heavy": (8, 20),
    }

    min_inc, max_inc = incident_counts.get(regulatory_burden, (3, 8))
    num_incidents = fake.random.randint(min_inc, max_inc)

    incident_data = []
    start_date = datetime.now() - timedelta(days=3*365)

    # Industry-specific incident types
    incident_types = {
        "healthcare_provider": [
            ("Patient injury", "safety"),
            ("Infection control breach", "compliance"),
            ("HIPAA violation", "compliance"),
            ("Equipment failure", "safety"),
            ("Drug handling error", "compliance"),
        ],
        "construction": [
            ("Worker injury", "safety"),
            ("Fall incident", "safety"),
            ("Equipment accident", "safety"),
            ("Safety violation", "compliance"),
            ("Environmental spill", "safety"),
        ],
        "manufacturing": [
            ("Machine injury", "safety"),
            ("Chemical exposure", "safety"),
            ("Environmental violation", "compliance"),
            ("Quality defect", "quality"),
            ("Worker injury", "safety"),
        ],
        "retail": [
            ("Customer slip and fall", "safety"),
            ("Worker injury", "safety"),
            ("Theft incident", "security"),
            ("Data breach", "security"),
        ],
        "logistics": [
            ("Cargo loss", "quality"),
            ("Vehicle accident", "safety"),
            ("Safety violation", "compliance"),
            ("Damage claim", "quality"),
        ],
    }

    default_incidents = [
        ("Safety violation", "safety"),
        ("Customer complaint", "quality"),
        ("Data security incident", "security"),
    ]

    incident_templates = incident_types.get(industry, default_incidents)

    for i in range(num_incidents):
        incident_id = f"INC-{datetime.now().year}-{i+1:04d}"
        incident_date = start_date + timedelta(days=fake.random.randint(0, 3*365))

        desc_template, category = fake.random.choice(incident_templates)
        description = f"{desc_template} - {fake.sentence(nb_words=6)}"

        # Mostly minor, few critical
        if i < num_incidents - 1 and regulatory_burden == "heavy":
            severity = fake.random.choice(["minor", "minor", "major", "critical"])
        else:
            severity = fake.random.choice(["minor", "minor", "major"])

        # Status - most closed, few open if critical
        if severity == "critical" and fake.boolean():
            status = "investigating"
        elif i > num_incidents - 3:
            status = fake.random.choice(["open", "investigating", "closed"])
        else:
            status = "closed"

        # Root cause and corrective action
        root_cause = fake.sentence(nb_words=8)
        corrective_action = fake.sentence(nb_words=10)

        # Days to resolve
        if status == "closed":
            days_to_resolve = fake.random.randint(1, 90)
        else:
            days_to_resolve = 0

        incident_data.append({
            "incident_id": incident_id,
            "incident_date": incident_date.strftime("%Y-%m-%d"),
            "category": category,
            "description": description,
            "severity": severity,
            "status": status,
            "root_cause": root_cause,
            "corrective_action": corrective_action,
            "days_to_resolve": days_to_resolve,
        })

    return pd.DataFrame(incident_data)


def main():
    parser = argparse.ArgumentParser(
        description="Generate regulatory data for M&A data room simulation"
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
    print(f"Generating regulatory data for {company_name}...")

    # Create section directory
    section_dir = output_dir / "9.0-regulatory"
    section_dir.mkdir(parents=True, exist_ok=True)

    # Generate all artifacts
    print("  Generating license register...")
    licenses_df = generate_license_register(deal_state)

    print("  Generating training log...")
    training_df = generate_training_log(deal_state)

    print("  Generating incident log...")
    incidents_df = generate_incident_log(deal_state)

    # Save to Excel
    save_to_excel(licenses_df, "license_register.xlsx", section_dir, "Licenses")
    save_to_excel(training_df, "training_log.xlsx", section_dir, "Training")
    save_to_excel(incidents_df, "incident_log.xlsx", section_dir, "Incidents")

    # Print summary
    print(f"\n✓ Regulatory data generated successfully!")
    print(f"  Output directory: {section_dir}")
    print(f"\n  Files created:")
    print(f"    - license_register.xlsx ({len(licenses_df)} licenses)")
    print(f"    - training_log.xlsx ({len(training_df)} trainings)")
    print(f"    - incident_log.xlsx ({len(incidents_df)} incidents)")


if __name__ == "__main__":
    main()
