#!/usr/bin/env python3
"""
Deal State Generator for M&A Data Room Simulator.

Generates a comprehensive deal_state.json that serves as the single source of truth
for all downstream generators. Replaces generate_company.py.

Usage:
    python3 scripts/generate_deal_state.py \\
      --profile profiles/saas.json \\
      --size mid \\
      --realism-mode realistic \\
      --start-period 2021-01 \\
      --end-period 2025-12 \\
      --output-dir output/
"""

import argparse
import json
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path

try:
    from faker import Faker
except ImportError:
    print("Error: faker package required. Install with: pip install faker")
    exit(1)

# Initialize Faker
fake = Faker()

# Constants
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent

SIZES = ["small", "mid", "large"]
REALISM_MODES = ["clean", "realistic", "messy"]

# US Cities for variety in site generation
US_CITIES_BY_STATE = {
    "California": ["San Francisco", "Los Angeles", "San Diego", "San Jose", "Sacramento", "Oakland"],
    "Texas": ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth"],
    "New York": ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"],
    "Florida": ["Miami", "Tampa", "Orlando", "Jacksonville", "Ft. Lauderdale"],
    "Colorado": ["Denver", "Boulder", "Colorado Springs", "Fort Collins"],
    "Georgia": ["Atlanta", "Savannah", "Augusta", "Athens"],
    "Massachusetts": ["Boston", "Cambridge", "Worcester", "Springfield"],
    "Washington": ["Seattle", "Bellevue", "Tacoma", "Spokane"],
    "Illinois": ["Chicago", "Cook County", "Naperville", "Aurora"],
    "North Carolina": ["Charlotte", "Raleigh", "Durham", "Greensboro"],
    "Virginia": ["Arlington", "Richmond", "Virginia Beach", "Roanoke"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
}

INDUSTRY_VERTICALS = {
    "saas": [
        "HR Technology", "Marketing Automation", "Sales Enablement", "Customer Success",
        "Project Management", "Business Intelligence", "FinTech", "EdTech", "HealthTech",
        "Supply Chain", "Compliance", "Cybersecurity", "DevOps", "E-commerce Platform"
    ],
    "construction": [
        "Commercial Construction", "Residential Construction", "Industrial Construction",
        "Infrastructure", "Renovation", "Specialty Trade", "Heavy Civil", "Design-Build"
    ],
    "manufacturing": [
        "Industrial Equipment", "Consumer Products", "Food & Beverage", "Medical Devices",
        "Automotive Parts", "Electronics", "Packaging", "Plastics", "Metal Fabrication"
    ],
    "professional_services": [
        "Management Consulting", "IT Consulting", "Accounting", "Legal Services",
        "Marketing Agency", "Engineering Services", "Architecture", "HR Consulting"
    ],
    "retail": [
        "Apparel", "Home Goods", "Sporting Goods", "Electronics", "Beauty & Cosmetics",
        "Outdoor & Recreation", "Pet Supplies", "Health & Wellness", "Specialty Food"
    ],
    "dental": [
        "General Dentistry", "Multi-Site Dental Practices", "Family Dentistry",
        "Cosmetic Dentistry", "Orthodontics", "Oral Surgery", "Pediatric Dentistry"
    ],
}

ENTITY_TYPES = ["LLC", "C-Corp", "S-Corp", "LP"]
SITE_TYPES = ["HQ", "office", "plant", "warehouse", "store", "clinic"]
CUSTOMER_INDUSTRIES = [
    "Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education",
    "Government", "Media", "Energy", "Transportation", "Insurance", "Hospitality"
]

EVENT_TYPES = [
    "customer_win", "customer_loss", "acquisition", "litigation", "restructuring",
    "insurance_claim", "regulatory_action", "new_product", "site_opening",
    "site_closure", "management_change"
]


def load_profile(profile_path: str) -> dict:
    """Load industry profile from JSON file."""
    path = Path(profile_path)
    if not path.exists():
        raise FileNotFoundError(f"Profile not found: {path}")
    with open(path) as f:
        return json.load(f)


def generate_ein() -> str:
    """Generate a fake but correctly formatted EIN."""
    return f"{random.randint(10, 99)}-{random.randint(1000000, 9999999)}"


def generate_company_name(industry: str) -> str:
    """Generate a realistic company name."""
    strategies = [
        lambda: f"{fake.last_name()} {random.choice(['Labs', 'Solutions', 'Systems', 'Group'])}",
        lambda: f"{fake.word().capitalize()} {fake.word().capitalize()}",
        lambda: f"{fake.first_name()} {random.choice(['Tech', 'Works', 'Partners'])}",
    ]
    return random.choice(strategies)()


def generate_metadata(
    profile_path: str, size: str, realism_mode: str, start_period: str,
    end_period: str, seed: int = None
) -> dict:
    """Generate metadata section."""
    return {
        "run_id": str(uuid.uuid4()),
        "generated_at": datetime.now().isoformat(),
        "profile_path": profile_path,
        "profile_version": "1.0",
        "size": size,
        "realism_mode": realism_mode,
        "start_period": start_period,
        "end_period": end_period,
        "seed": seed,
    }


def generate_company_section(
    industry: str, profile: dict, company_name: str = None
) -> dict:
    """Generate company section."""
    name = company_name or generate_company_name(industry)
    vertical = random.choice(INDUSTRY_VERTICALS.get(industry, []))

    # Founding year based on size (will be adjusted by caller if needed)
    current_year = datetime.now().year
    founded_year = current_year - random.randint(5, 15)

    state = random.choice(list(US_CITIES_BY_STATE.keys()))
    city = random.choice(US_CITIES_BY_STATE[state])

    return {
        "name": name,
        "legal_name": f"{name}, Inc.",
        "dba_names": [f"{name} {suffix}" for suffix in random.sample(
            ["Solutions", "Group", "Services"], k=random.randint(0, 1)
        )] if random.random() < 0.3 else [],
        "entity_type": random.choice(ENTITY_TYPES),
        "state_of_formation": state,
        "ein": generate_ein(),
        "industry": industry,
        "subvertical": vertical,
        "industry_display": profile.get("display_name", industry),
        "headquarters": {
            "address": fake.street_address(),
            "city": city,
            "state": state,
            "zip_code": fake.zipcode(),
        },
        "founded": founded_year,
        "fiscal_year_end": random.choice([3, 6, 12]),  # Month (3=March, etc.)
        "website": f"www.{name.lower().replace(' ', '')[:20]}.com",
    }


def generate_entities(size: str) -> list:
    """Generate legal entities."""
    entity_counts = {"small": 1, "mid": random.randint(2, 4), "large": random.randint(3, 8)}
    count = entity_counts[size]

    entities = []
    entity_types = ["parent", "subsidiary", "branch"]

    for i in range(count):
        entities.append({
            "entity_id": f"E{i+1:04d}",
            "name": f"{fake.company()} {random.choice(['Inc.', 'LLC', 'Corp'])}",
            "type": random.choice(ENTITY_TYPES),
            "jurisdiction": random.choice(list(US_CITIES_BY_STATE.keys())),
            "status": "active" if i == 0 or random.random() < 0.8 else "inactive",
            "relationship": entity_types[0] if i == 0 else random.choice(entity_types[1:]),
        })

    return entities


def generate_sites(profile: dict, size: str) -> list:
    """Generate physical locations."""
    size_counts = {"small": random.randint(1, 2), "mid": random.randint(2, 5), "large": random.randint(4, 12)}
    count = size_counts[size]

    sites = []
    states = list(US_CITIES_BY_STATE.keys())

    for i in range(count):
        state = random.choice(states)
        city = random.choice(US_CITIES_BY_STATE[state])
        is_hq = i == 0
        site_type = "HQ" if is_hq else random.choice(SITE_TYPES[1:])
        sqft = random.randint(2000, 50000) if is_hq else random.randint(1000, 25000)
        owned_or_leased = random.choice(["owned", "leased"])

        # Generate lease dates and rent for leased sites
        if owned_or_leased == "leased":
            lease_start = datetime.now() - timedelta(days=random.randint(365, 2555))
            lease_end = lease_start + timedelta(days=random.randint(1095, 3650))
            # Generate monthly rent based on sqft (~$2-4 per sqft per month)
            monthly_rent = round(sqft * random.uniform(2.0, 4.0), 2)
            lease_start_str = lease_start.strftime("%Y-%m-%d")
            lease_end_str = lease_end.strftime("%Y-%m-%d")
        else:
            lease_start_str = None
            lease_end_str = None
            monthly_rent = None

        sites.append({
            "site_id": f"S{i+1:04d}",
            "name": f"{city} {site_type}" if not is_hq else "Headquarters",
            "address": fake.street_address(),
            "city": city,
            "state": state,
            "zip": fake.zipcode(),
            "type": site_type,
            "sqft": sqft,
            "owned_or_leased": owned_or_leased,
            "lease_start": lease_start_str,
            "lease_end": lease_end_str,
            "monthly_rent": monthly_rent,
        })

    return sites


def generate_management(industry: str, size: str) -> list:
    """Generate management team."""
    size_counts = {"small": random.randint(5, 7), "mid": random.randint(8, 10), "large": random.randint(10, 12)}
    target_count = size_counts[size]

    # Base roles: always CEO and CFO
    roles = [
        {"title": "Chief Executive Officer", "department": "Executive"},
        {"title": "Chief Financial Officer", "department": "Finance"},
    ]

    # Add other common roles
    all_roles = [
        {"title": "Chief Operating Officer", "department": "Operations"},
        {"title": "Chief Technology Officer", "department": "Engineering"},
        {"title": "Chief Revenue Officer", "department": "Sales"},
        {"title": "VP of Sales", "department": "Sales"},
        {"title": "VP of Operations", "department": "Operations"},
        {"title": "VP of Engineering", "department": "Engineering"},
        {"title": "VP of Marketing", "department": "Marketing"},
        {"title": "VP of Customer Success", "department": "Customer Success"},
        {"title": "General Counsel", "department": "Legal"},
        {"title": "VP of HR", "department": "People"},
    ]

    # Add random roles up to target count
    if len(roles) < target_count:
        additional = random.sample(all_roles, min(target_count - len(roles), len(all_roles)))
        roles.extend(additional)

    management = []
    for i, role in enumerate(roles[:target_count]):
        hire_date = datetime.now() - timedelta(days=random.randint(365, 3650))
        tenure_years = (datetime.now() - hire_date).days / 365.25

        management.append({
            "person_id": f"P{i+1:04d}",
            "name": fake.name(),
            "title": role["title"],
            "department": role["department"],
            "hire_date": hire_date.strftime("%Y-%m-%d"),
            "tenure_years": round(tenure_years, 1),
            "background": f"Former {random.choice(['VP', 'Director', 'Manager'])} at {fake.company()}",
            "compensation_base": round(random.uniform(150000, 500000), 0),
            "compensation_bonus_target": round(random.uniform(20000, 200000), 0),
            "equity_pct": round(random.uniform(0.1, 5.0), 2) if i < 2 else round(random.uniform(0.01, 1.0), 2),
        })

    return management


def generate_ownership() -> dict:
    """Generate ownership structure."""
    structures = ["founder-owned", "pe-backed", "family", "partnership"]
    structure = random.choice(structures)

    if structure == "founder-owned":
        shareholders = [
            {"name": fake.name(), "pct": random.uniform(40, 100), "type": "individual"},
            {"name": fake.name(), "pct": random.uniform(0, 30), "type": "individual"},
        ]
    elif structure == "pe-backed":
        shareholders = [
            {"name": f"{fake.company()} Fund", "pct": random.uniform(40, 70), "type": "fund"},
            {"name": fake.name(), "pct": random.uniform(10, 40), "type": "individual"},
        ]
    else:
        shareholders = [
            {"name": fake.name(), "pct": random.uniform(25, 50), "type": "individual"}
            for _ in range(random.randint(2, 4))
        ]

    # Normalize percentages
    total = sum(s["pct"] for s in shareholders)
    for s in shareholders:
        s["pct"] = round(s["pct"] / total * 100, 2)

    return {
        "structure": structure,
        "shareholders": shareholders,
        "total_shares_outstanding": random.randint(1000000, 10000000),
        "option_pool_pct": round(random.uniform(5, 20), 2),
        "debt_to_equity_ratio": round(random.uniform(0.2, 2.0), 2),
    }


def generate_financials_seed(profile: dict, size: str) -> dict:
    """Generate target financial metrics."""
    bounds = profile.get("size_model", profile.get("bounds", {}))[size]

    revenue = random.randint(bounds["revenue_min"], bounds["revenue_max"])
    revenue = round(revenue / 100000) * 100000

    kpis = profile.get("kpis", {})
    gross_margin = kpis.get("gross_margin", {})
    gm_min = gross_margin.get("min", 0.30)
    gm_max = gross_margin.get("max", 0.70)

    growth_rate = round(random.uniform(0.05, 0.40), 3)

    headcount = random.randint(bounds["headcount_min"], bounds["headcount_max"])

    return {
        "annual_revenue": revenue,
        "growth_rate": growth_rate,
        "gross_margin": round(random.uniform(gm_min, gm_max), 3),
        "ebitda_margin": round(random.uniform(0.10, 0.35), 3),
        "headcount": headcount,
        "revenue_per_employee": round(revenue / headcount, 0),
    }


def generate_customers_seed(profile: dict, size: str, annual_revenue: float) -> list:
    """Generate seeded customers."""
    bounds = profile.get("size_model", profile.get("bounds", {}))[size]
    customer_range = bounds.get("customer_count_min", 10), bounds.get("customer_count_max", 500)
    count = random.randint(*customer_range)

    # Generate fewer customers to seed (top 10-50)
    seeded_count = min(random.randint(10, 50), count // 2)

    customers = []
    remaining_revenue = annual_revenue * 0.95  # Top customers = 95% of revenue

    for i in range(seeded_count):
        # Pareto distribution: top customer gets 8-25%, then decreasing
        if i == 0:
            pct = random.uniform(0.08, 0.25)
        elif i < 10:
            pct = random.uniform(0.02, 0.08)
        else:
            pct = random.uniform(0.001, 0.02)

        contract_revenue = annual_revenue * pct
        remaining_revenue -= contract_revenue

        contract_start = datetime.now() - timedelta(days=random.randint(90, 1825))
        contract_end = contract_start + timedelta(days=random.randint(365, 2190))

        customers.append({
            "customer_id": f"C{i+1:05d}",
            "name": fake.company(),
            "industry": random.choice(CUSTOMER_INDUSTRIES),
            "annual_contract_value": round(contract_revenue, 0),
            "contract_start": contract_start.strftime("%Y-%m-%d"),
            "contract_end": contract_end.strftime("%Y-%m-%d"),
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
        })

    return customers


def generate_vendors_seed(annual_revenue: float) -> list:
    """Generate seeded vendors."""
    count = random.randint(5, 20)

    categories = [
        "Software/SaaS", "Consulting", "Hosting/Infrastructure", "Equipment",
        "Raw Materials", "Logistics", "Outsourced Services", "Professional Services"
    ]

    vendors = []
    total_spend = annual_revenue * random.uniform(0.30, 0.50)  # COGS/opex

    for i in range(count):
        # Pareto-ish distribution
        if i == 0:
            spend_pct = random.uniform(0.15, 0.30)
        elif i < 5:
            spend_pct = random.uniform(0.05, 0.15)
        else:
            spend_pct = random.uniform(0.01, 0.05)

        spend = total_spend * spend_pct
        total_spend -= spend

        vendors.append({
            "vendor_id": f"V{i+1:04d}",
            "name": fake.company(),
            "category": random.choice(categories),
            "annual_spend": round(spend, 0),
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
        })

    return vendors


def generate_employees_seed(profile: dict, headcount: int) -> dict:
    """Generate employee seeding info."""
    departments = profile.get("departments", [])

    if not departments:
        # Fallback
        departments = [
            {"name": "Engineering", "typical_pct": 0.35},
            {"name": "Sales", "typical_pct": 0.25},
            {"name": "Operations", "typical_pct": 0.20},
            {"name": "G&A", "typical_pct": 0.20},
        ]

    dept_list = []
    for dept in departments:
        dept_headcount = max(1, int(headcount * dept["typical_pct"]))
        dept_list.append({
            "name": dept["name"],
            "headcount": dept_headcount,
            "avg_salary": round(random.uniform(60000, 150000), 0),
        })

    return {
        "total_headcount": headcount,
        "departments": dept_list,
    }


def generate_events_timeline(
    start_period: str, end_period: str, size: str, realism_mode: str, annual_revenue: float
) -> list:
    """Generate events timeline."""
    events = []

    # Parse periods
    start_date = datetime.strptime(start_period, "%Y-%m")
    end_date = datetime.strptime(end_period, "%Y-%m")

    current = start_date
    event_id = 0

    # Event density based on size and mode
    events_per_month = {
        "small": {"clean": 1, "realistic": 2, "messy": 3},
        "mid": {"clean": 2, "realistic": 3, "messy": 4},
        "large": {"clean": 3, "realistic": 4, "messy": 5},
    }
    target_per_month = events_per_month.get(size, {}).get(realism_mode, 2)

    while current <= end_date:
        # Random number of events this month
        num_events = random.randint(max(0, target_per_month - 1), target_per_month + 1)

        for _ in range(num_events):
            if random.random() < 0.6:  # 60% customer wins
                event_type = "customer_win"
                impact = round(annual_revenue * random.uniform(0.005, 0.05), 0)
                desc = f"New customer: {fake.company()}"
            elif realism_mode != "clean" and random.random() < 0.3:  # 30% losses in realistic/messy
                event_type = "customer_loss"
                impact = -round(annual_revenue * random.uniform(0.002, 0.02), 0)
                desc = f"Lost customer: {fake.company()}"
            else:
                event_type = random.choice(EVENT_TYPES)
                impact = round(random.uniform(-annual_revenue * 0.05, annual_revenue * 0.03), 0)
                desc = f"{event_type}: {fake.company()}"

            event_id += 1
            day = random.randint(1, 28)

            events.append({
                "event_id": f"EV{event_id:05d}",
                "date": f"{current.year}-{current.month:02d}-{day:02d}",
                "type": event_type,
                "description": desc,
                "financial_impact": impact,
                "one_time": event_type not in ["customer_win", "customer_loss"],
                "recurring_annual": 0 if event_type in ["customer_win", "customer_loss"] else None,
            })

        # Move to next month
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)

    return events


def generate_document_triggers(profile: dict, realism_mode: str) -> dict:
    """Generate document triggers from profile."""
    docs = profile.get("documents", {})

    triggers = {}
    for category, doc_list in docs.items():
        triggers[category] = {doc: True for doc in doc_list}

    return triggers



def generate_deal_state(
    profile_path: str,
    size: str,
    realism_mode: str,
    start_period: str,
    end_period: str,
    company_name: str = None,
    seed: int = None,
) -> dict:
    """Generate complete deal state."""

    # Set random seed
    if seed:
        random.seed(seed)
        Faker.seed(seed)

    # Load profile
    profile = load_profile(profile_path)
    industry = profile["industry"]

    # Generate sections
    company = generate_company_section(industry, profile, company_name)
    financials_seed = generate_financials_seed(profile, size)

    deal_state = {
        "metadata": generate_metadata(profile_path, size, realism_mode, start_period, end_period, seed),
        "company": company,
        "entities": generate_entities(size),
        "sites": generate_sites(profile, size),
        "management": generate_management(industry, size),
        "ownership": generate_ownership(),
        "financials_seed": financials_seed,
        "customers_seed": generate_customers_seed(profile, size, financials_seed["annual_revenue"]),
        "vendors_seed": generate_vendors_seed(financials_seed["annual_revenue"]),
        "employees_seed": generate_employees_seed(profile, financials_seed["headcount"]),
        "events_timeline": generate_events_timeline(
            start_period, end_period, size, realism_mode, financials_seed["annual_revenue"]
        ),
        "document_triggers": generate_document_triggers(profile, realism_mode),
    }

    return deal_state


def main():
    parser = argparse.ArgumentParser(
        description="Generate comprehensive deal state for M&A data room simulation"
    )
    parser.add_argument(
        "--profile",
        required=True,
        help="Path to profile JSON file (e.g., profiles/saas.json)"
    )
    parser.add_argument(
        "--size",
        required=True,
        choices=SIZES,
        help="Company size (small: $5-20M, mid: $20-100M, large: $100-500M)"
    )
    parser.add_argument(
        "--realism-mode",
        default="realistic",
        choices=REALISM_MODES,
        help="Realism mode (default: realistic)"
    )
    parser.add_argument(
        "--start-period",
        required=True,
        help="Start period in YYYY-MM format"
    )
    parser.add_argument(
        "--end-period",
        required=True,
        help="End period in YYYY-MM format"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Output directory"
    )
    parser.add_argument(
        "--name",
        help="Custom company name (optional)"
    )
    parser.add_argument(
        "--seed",
        type=int,
        help="Random seed for reproducibility"
    )

    args = parser.parse_args()

    # Ensure output directory exists
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "deal_state.json"

    # Generate deal state
    print(f"Generating {args.size} deal state ({args.realism_mode} mode)...")
    print(f"Period: {args.start_period} to {args.end_period}")

    deal_state = generate_deal_state(
        profile_path=args.profile,
        size=args.size,
        realism_mode=args.realism_mode,
        start_period=args.start_period,
        end_period=args.end_period,
        company_name=args.name,
        seed=args.seed,
    )

    # Write to file
    with open(output_path, "w") as f:
        json.dump(deal_state, f, indent=2)

    # Print summary
    company = deal_state["company"]
    financials = deal_state["financials_seed"]

    print(f"\nGenerated deal state for: {company['name']}")
    print(f"  Industry: {company['industry_display']}")
    print(f"  Subvertical: {company['subvertical']}")
    print(f"  Size: {args.size}")
    print(f"  Founded: {company['founded']}")
    print(f"  Revenue: ${financials['annual_revenue']:,.0f}")
    print(f"  Growth Rate: {financials['growth_rate']:.1%}")
    print(f"  Headcount: {financials['headcount']}")
    print(f"  Entities: {len(deal_state['entities'])}")
    print(f"  Sites: {len(deal_state['sites'])}")
    print(f"  Management: {len(deal_state['management'])}")
    print(f"  Seeded Customers: {len(deal_state['customers_seed'])}")
    print(f"  Events: {len(deal_state['events_timeline'])}")
    print(f"  Output: {output_path}")


if __name__ == "__main__":
    main()
