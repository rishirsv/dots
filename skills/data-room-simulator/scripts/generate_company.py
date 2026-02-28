#!/usr/bin/env python3
"""
Company Seed Generator for M&A Data Room Simulator.

Generates the foundational company data that drives all other generation:
- Company profile (name, industry, founding year, location)
- Brand identity (colors for document styling)
- Management team
- Company story and milestones
- Events timeline (customer wins/losses, one-time events)

Usage:
    python generate_company.py --industry saas --size mid --realism-mode realistic
"""

import argparse
import json
import random
import os
from datetime import datetime, timedelta
from pathlib import Path

try:
    from faker import Faker
except ImportError:
    print("Error: faker package required. Install with: pip install faker")
    exit(1)

# Initialize Faker
fake = Faker()
Faker.seed(None)  # Use random seed for variety

# Constants
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PROFILES_DIR = PROJECT_DIR / "profiles"
OUTPUT_DIR = PROJECT_DIR / "output"

INDUSTRIES = ["saas", "construction", "manufacturing", "professional_services", "retail", "dental"]
SIZES = ["small", "mid", "large"]
REALISM_MODES = ["clean", "realistic", "messy"]

# Brand color palettes by industry
BRAND_PALETTES = {
    "saas": [
        {"primary": "#2563EB", "secondary": "#3B82F6", "accent": "#60A5FA"},  # Blue
        {"primary": "#7C3AED", "secondary": "#8B5CF6", "accent": "#A78BFA"},  # Purple
        {"primary": "#0891B2", "secondary": "#06B6D4", "accent": "#22D3EE"},  # Cyan
    ],
    "construction": [
        {"primary": "#EA580C", "secondary": "#F97316", "accent": "#FB923C"},  # Orange
        {"primary": "#CA8A04", "secondary": "#EAB308", "accent": "#FACC15"},  # Yellow
        {"primary": "#65A30D", "secondary": "#84CC16", "accent": "#A3E635"},  # Lime
    ],
    "manufacturing": [
        {"primary": "#DC2626", "secondary": "#EF4444", "accent": "#F87171"},  # Red
        {"primary": "#4338CA", "secondary": "#6366F1", "accent": "#818CF8"},  # Indigo
        {"primary": "#0F766E", "secondary": "#14B8A6", "accent": "#2DD4BF"},  # Teal
    ],
    "professional_services": [
        {"primary": "#1E40AF", "secondary": "#3B82F6", "accent": "#60A5FA"},  # Blue
        {"primary": "#0F172A", "secondary": "#334155", "accent": "#64748B"},  # Slate
        {"primary": "#166534", "secondary": "#22C55E", "accent": "#4ADE80"},  # Green
    ],
    "retail": [
        {"primary": "#BE185D", "secondary": "#EC4899", "accent": "#F472B6"},  # Pink
        {"primary": "#7C2D12", "secondary": "#EA580C", "accent": "#FB923C"},  # Orange
        {"primary": "#4C1D95", "secondary": "#8B5CF6", "accent": "#A78BFA"},  # Purple
    ],
    "dental": [
        {"primary": "#0F766E", "secondary": "#14B8A6", "accent": "#5EEAD4"},  # Teal
        {"primary": "#1D4ED8", "secondary": "#3B82F6", "accent": "#93C5FD"},  # Blue
        {"primary": "#15803D", "secondary": "#22C55E", "accent": "#86EFAC"},  # Green
    ],
}

FONT_FAMILIES = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
]

# Industry-specific company name suffixes/patterns
INDUSTRY_NAME_PATTERNS = {
    "saas": ["Labs", "HQ", "Cloud", "Systems", "Software", "Tech", "IO", "Platform"],
    "construction": ["Construction", "Builders", "Contracting", "Development", "Group", "& Sons"],
    "manufacturing": ["Manufacturing", "Industries", "Products", "Corp", "Works", "Fabrication"],
    "professional_services": ["Consulting", "Advisors", "Partners", "Group", "Associates", "& Co"],
    "retail": ["Retail", "Stores", "Shop", "Boutique", "Market", "Trading"],
    "dental": ["Dental Group", "Dental Partners", "Dental Associates", "Dental Care", "Smile Centers"],
}

# Industry-specific verticals
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

# US States with business-friendly reputation
US_STATES = [
    ("California", ["San Francisco", "Los Angeles", "San Diego", "San Jose"]),
    ("Texas", ["Austin", "Dallas", "Houston", "San Antonio"]),
    ("New York", ["New York City", "Buffalo", "Rochester"]),
    ("Florida", ["Miami", "Tampa", "Orlando", "Jacksonville"]),
    ("Colorado", ["Denver", "Boulder", "Colorado Springs"]),
    ("Georgia", ["Atlanta", "Savannah"]),
    ("Massachusetts", ["Boston", "Cambridge"]),
    ("Washington", ["Seattle", "Bellevue"]),
    ("Illinois", ["Chicago"]),
    ("North Carolina", ["Charlotte", "Raleigh", "Durham"]),
]


def load_profile(industry: str) -> dict:
    """Load industry profile from JSON file."""
    profile_path = PROFILES_DIR / f"{industry}.json"
    if not profile_path.exists():
        raise FileNotFoundError(f"Profile not found: {profile_path}")
    with open(profile_path) as f:
        return json.load(f)


def generate_company_name(industry: str) -> str:
    """Generate a realistic company name for the industry."""
    patterns = INDUSTRY_NAME_PATTERNS[industry]

    # Various name generation strategies
    strategies = [
        # Founder-style name
        lambda: f"{fake.last_name()} {random.choice(patterns)}",
        # Two-word creative name
        lambda: f"{fake.word().capitalize()}{fake.word().capitalize()} {random.choice(patterns)}",
        # Single word + suffix
        lambda: f"{fake.word().capitalize()} {random.choice(patterns)}",
        # Initials style
        lambda: f"{fake.last_name()[0]}{fake.last_name()[0]}{fake.last_name()[0]} {random.choice(patterns)}",
    ]

    return random.choice(strategies)()


def generate_brand_identity(industry: str) -> dict:
    """Generate brand identity with colors and fonts."""
    palette = random.choice(BRAND_PALETTES[industry])
    return {
        "primary_color": palette["primary"],
        "secondary_color": palette["secondary"],
        "accent_color": palette["accent"],
        "font_family": random.choice(FONT_FAMILIES),
        "font_family_mono": "JetBrains Mono",
    }


def generate_location() -> dict:
    """Generate company headquarters location."""
    state, cities = random.choice(US_STATES)
    city = random.choice(cities)
    return {
        "city": city,
        "state": state,
        "country": "United States",
        "address": fake.street_address(),
        "zip_code": fake.zipcode(),
    }


def generate_management_team(industry: str, size: str) -> list:
    """Generate management team with names and bios."""
    # Base team
    team = [
        {
            "title": "Chief Executive Officer",
            "short_title": "CEO",
            "name": fake.name(),
            "years_at_company": random.randint(5, 15),
            "background": f"Former {random.choice(['VP', 'Director', 'Partner'])} at {fake.company()}",
        },
        {
            "title": "Chief Financial Officer",
            "short_title": "CFO",
            "name": fake.name(),
            "years_at_company": random.randint(3, 10),
            "background": f"Former {random.choice(['Controller', 'Finance Director', 'CFO'])} at {fake.company()}",
        },
    ]

    # Add COO for mid and large
    if size in ["mid", "large"]:
        team.append({
            "title": "Chief Operating Officer",
            "short_title": "COO",
            "name": fake.name(),
            "years_at_company": random.randint(3, 8),
            "background": f"Former {random.choice(['Operations Director', 'VP Operations', 'GM'])} at {fake.company()}",
        })

    # Add VP Sales
    team.append({
        "title": "VP of Sales",
        "short_title": "VP Sales",
        "name": fake.name(),
        "years_at_company": random.randint(2, 6),
        "background": f"Former {random.choice(['Sales Director', 'Regional VP', 'Enterprise AE'])} at {fake.company()}",
    })

    # Industry-specific roles
    if industry == "saas":
        team.append({
            "title": "VP of Engineering",
            "short_title": "VP Eng",
            "name": fake.name(),
            "years_at_company": random.randint(3, 8),
            "background": f"Former {random.choice(['Engineering Director', 'Staff Engineer', 'CTO'])} at {fake.company()}",
        })
    elif industry == "manufacturing":
        team.append({
            "title": "VP of Operations",
            "short_title": "VP Ops",
            "name": fake.name(),
            "years_at_company": random.randint(4, 10),
            "background": f"Former {random.choice(['Plant Manager', 'Operations Director'])} at {fake.company()}",
        })
    elif industry == "construction":
        team.append({
            "title": "VP of Project Management",
            "short_title": "VP PM",
            "name": fake.name(),
            "years_at_company": random.randint(5, 12),
            "background": f"Former {random.choice(['Project Director', 'Senior PM'])} at {fake.company()}",
        })
    elif industry == "dental":
        team.append({
            "title": "Chief Clinical Officer",
            "short_title": "CCO",
            "name": fake.name(),
            "years_at_company": random.randint(4, 12),
            "background": f"Former {random.choice(['Clinical Director', 'Regional Dental Director'])} at {fake.company()}",
        })

    return team


def generate_company_story(industry: str, founding_year: int, vertical: str) -> dict:
    """Generate company founding story and narrative."""
    current_year = datetime.now().year
    years_in_business = current_year - founding_year

    # Generate founding narrative
    founder_first = fake.first_name()
    founder_last = fake.last_name()

    founding_narratives = [
        f"{founder_first} {founder_last} founded the company in {founding_year} after identifying a gap in the {vertical.lower()} market.",
        f"Started in {founding_year} by {founder_first} {founder_last}, the company began as a small operation focused on {vertical.lower()}.",
        f"The company was established in {founding_year} when {founder_first} {founder_last} left {fake.company()} to pursue a vision for better {vertical.lower()} solutions.",
    ]

    # Generate milestones
    milestones = []
    milestone_year = founding_year + random.randint(1, 3)

    milestone_types = [
        ("First major contract", f"Landed first enterprise customer: {fake.company()}"),
        ("Product launch", f"Launched flagship product/service offering"),
        ("Geographic expansion", f"Expanded operations to {random.choice(['West Coast', 'East Coast', 'Midwest', 'Southeast'])}"),
        ("Key hire", f"Brought on experienced leadership team from industry"),
        ("Revenue milestone", f"Achieved ${random.randint(1,10)}M in annual revenue"),
        ("Acquisition", f"Acquired complementary business {fake.company()}"),
        ("Award", f"Recognized as top {vertical.lower()} provider in region"),
    ]

    selected_milestones = random.sample(milestone_types, min(4, len(milestone_types)))

    for title, description in selected_milestones:
        if milestone_year < current_year:
            milestones.append({
                "year": milestone_year,
                "title": title,
                "description": description,
            })
        milestone_year += random.randint(1, 3)

    # Market position
    market_positions = [
        f"Leading regional provider in the {vertical.lower()} space",
        f"Established player with strong reputation in {vertical.lower()}",
        f"Growing mid-market company specializing in {vertical.lower()}",
        f"Niche provider with deep expertise in {vertical.lower()}",
    ]

    # Why selling
    why_selling_options = [
        "Founders approaching retirement age and seeking succession solution",
        "Seeking growth capital and strategic partner to accelerate expansion",
        "Private equity sponsor pursuing exit after successful value creation",
        "Ownership seeking liquidity while company has strong momentum",
        "Strategic review identified M&A as optimal path for next growth phase",
    ]

    return {
        "founding_narrative": random.choice(founding_narratives),
        "founder_name": f"{founder_first} {founder_last}",
        "milestones": milestones,
        "market_position": random.choice(market_positions),
        "why_selling": random.choice(why_selling_options),
        "years_in_business": years_in_business,
    }


def generate_events_timeline(
    industry: str,
    size: str,
    founding_year: int,
    realism_mode: str,
    annual_revenue: float
) -> list:
    """Generate events timeline with customer wins/losses, one-time events."""
    events = []
    current_year = datetime.now().year

    # Generate events for last 3-5 years
    years_to_generate = min(5, current_year - founding_year)

    for year in range(current_year - years_to_generate, current_year + 1):
        # Customer wins (2-5 per year depending on size)
        num_wins = random.randint(2, 5) if size == "small" else random.randint(4, 10)
        for _ in range(num_wins):
            month = random.randint(1, 12)
            revenue_impact = annual_revenue * random.uniform(0.01, 0.05)
            events.append({
                "date": f"{year}-{month:02d}-{random.randint(1,28):02d}",
                "type": "customer_win",
                "description": f"New customer: {fake.company()}",
                "revenue_impact": round(revenue_impact, 0),
                "recurring": True if industry == "saas" else random.choice([True, False]),
            })

        # Customer losses (realistic/messy modes)
        if realism_mode in ["realistic", "messy"]:
            num_losses = random.randint(0, 2)
            for _ in range(num_losses):
                month = random.randint(1, 12)
                revenue_impact = annual_revenue * random.uniform(0.005, 0.02)
                events.append({
                    "date": f"{year}-{month:02d}-{random.randint(1,28):02d}",
                    "type": "customer_loss",
                    "description": f"Lost customer: {fake.company()}",
                    "revenue_impact": round(-revenue_impact, 0),
                    "reason": random.choice([
                        "Competitive displacement",
                        "Customer budget cuts",
                        "Customer M&A",
                        "Service issues",
                        "Price sensitivity",
                    ]),
                })

        # One-time events
        if random.random() < 0.3:  # 30% chance per year
            event_types = [
                ("product_launch", "New product/service launch", annual_revenue * 0.02),
                ("expansion", "Office/facility expansion", -annual_revenue * 0.01),
                ("equipment", "Major equipment purchase", -annual_revenue * 0.015),
            ]

            if realism_mode in ["realistic", "messy"]:
                event_types.extend([
                    ("legal", "Legal settlement", -annual_revenue * random.uniform(0.005, 0.02)),
                    ("restructuring", "Restructuring costs", -annual_revenue * random.uniform(0.01, 0.03)),
                    ("insurance", "Insurance claim recovery", annual_revenue * random.uniform(0.005, 0.01)),
                ])

            event_type, desc, impact = random.choice(event_types)
            month = random.randint(1, 12)
            events.append({
                "date": f"{year}-{month:02d}-{random.randint(1,28):02d}",
                "type": event_type,
                "description": desc,
                "financial_impact": round(impact, 0),
                "one_time": True,
            })

    # Sort by date
    events.sort(key=lambda x: x["date"])
    return events


def calculate_financials(size: str, profile: dict) -> dict:
    """Calculate high-level financial metrics based on size."""
    bounds = profile["bounds"][size]

    # Generate revenue within bounds
    revenue = random.randint(bounds["revenue_min"], bounds["revenue_max"])

    # Round to nearest 100K for cleaner numbers
    revenue = round(revenue / 100000) * 100000

    # Get typical margins from profile
    kpis = profile.get("kpis", {})
    gross_margin_range = kpis.get("gross_margin", {"min": 0.30, "max": 0.50, "typical": 0.40})
    gross_margin = random.uniform(gross_margin_range["min"], gross_margin_range["max"])

    # Calculate headcount
    headcount = random.randint(bounds["headcount_min"], bounds["headcount_max"])

    # Revenue per employee
    revenue_per_employee = revenue / headcount

    return {
        "annual_revenue": revenue,
        "gross_margin": round(gross_margin, 3),
        "headcount": headcount,
        "revenue_per_employee": round(revenue_per_employee, 0),
        "fiscal_year_end": random.choice(["December 31", "March 31", "June 30"]),
        "years_of_history": random.choice([3, 4, 5]),
    }


def generate_company_seed(
    industry: str,
    size: str,
    realism_mode: str,
    company_name: str = None
) -> dict:
    """Generate complete company seed data."""

    # Load industry profile
    profile = load_profile(industry)

    # Generate basic info
    name = company_name or generate_company_name(industry)
    vertical = random.choice(INDUSTRY_VERTICALS[industry])

    # Founding year (3-25 years old depending on size)
    current_year = datetime.now().year
    if size == "small":
        founding_year = current_year - random.randint(3, 12)
    elif size == "mid":
        founding_year = current_year - random.randint(8, 20)
    else:
        founding_year = current_year - random.randint(12, 30)

    # Calculate financials
    financials = calculate_financials(size, profile)

    # Build the seed
    seed = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "generator_version": "1.0.0",
            "industry": industry,
            "size": size,
            "realism_mode": realism_mode,
        },
        "company": {
            "name": name,
            "legal_name": f"{name}, Inc." if not name.endswith(("Inc.", "LLC", "Corp")) else name,
            "industry": industry,
            "industry_display": profile["display_name"],
            "vertical": vertical,
            "founded": founding_year,
            "headquarters": generate_location(),
            "website": f"www.{name.lower().replace(' ', '').replace('&', 'and')[:20]}.com",
        },
        "brand": generate_brand_identity(industry),
        "management": generate_management_team(industry, size),
        "story": generate_company_story(industry, founding_year, vertical),
        "financials": financials,
        "events": generate_events_timeline(
            industry, size, founding_year, realism_mode, financials["annual_revenue"]
        ),
        "profile_reference": f"profiles/{industry}.json",
    }

    # Add industry-specific counts
    if "customer_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["customer_count"] = random.randint(
            profile["bounds"][size]["customer_count_min"],
            profile["bounds"][size]["customer_count_max"]
        )
    if "project_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["project_count"] = random.randint(
            profile["bounds"][size]["project_count_min"],
            profile["bounds"][size]["project_count_max"]
        )
    if "product_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["product_count"] = random.randint(
            profile["bounds"][size]["product_count_min"],
            profile["bounds"][size]["product_count_max"]
        )
    if "client_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["client_count"] = random.randint(
            profile["bounds"][size]["client_count_min"],
            profile["bounds"][size]["client_count_max"]
        )
    if "store_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["store_count"] = random.randint(
            profile["bounds"][size]["store_count_min"],
            profile["bounds"][size]["store_count_max"]
        )
    if "sku_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["sku_count"] = random.randint(
            profile["bounds"][size]["sku_count_min"],
            profile["bounds"][size]["sku_count_max"]
        )
    if "practice_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["practice_count"] = random.randint(
            profile["bounds"][size]["practice_count_min"],
            profile["bounds"][size]["practice_count_max"]
        )
    if "provider_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["provider_count"] = random.randint(
            profile["bounds"][size]["provider_count_min"],
            profile["bounds"][size]["provider_count_max"]
        )
    if "patient_count_min" in profile["bounds"][size]:
        seed.setdefault("operations", {})["patient_count"] = random.randint(
            profile["bounds"][size]["patient_count_min"],
            profile["bounds"][size]["patient_count_max"]
        )

    return seed


def main():
    parser = argparse.ArgumentParser(
        description="Generate company seed for M&A data room simulation"
    )
    parser.add_argument(
        "--industry",
        required=True,
        choices=INDUSTRIES,
        help="Industry type"
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
        "--name",
        help="Custom company name (optional)"
    )
    parser.add_argument(
        "--output",
        help="Output file path (overrides --output-dir)"
    )
    parser.add_argument(
        "--output-dir",
        default=str(OUTPUT_DIR),
        help="Directory for generated outputs (default: output/)"
    )
    parser.add_argument(
        "--seed",
        type=int,
        help="Random seed for reproducibility"
    )

    args = parser.parse_args()

    # Set random seed if provided
    if args.seed:
        random.seed(args.seed)
        Faker.seed(args.seed)

    # Resolve output path
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = Path(args.output_dir) / "company_seed.json"

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Generate seed
    print(f"Generating {args.size} {args.industry} company ({args.realism_mode} mode)...")
    seed = generate_company_seed(
        industry=args.industry,
        size=args.size,
        realism_mode=args.realism_mode,
        company_name=args.name
    )

    # Add reproducibility metadata
    if args.seed is not None:
        seed["metadata"]["random_seed"] = args.seed
    seed["metadata"]["output_dir"] = str(output_path.parent)

    with open(output_path, "w") as f:
        json.dump(seed, f, indent=2)

    print(f"✓ Generated: {seed['company']['name']}")
    print(f"  Industry: {seed['company']['industry_display']}")
    print(f"  Vertical: {seed['company']['vertical']}")
    print(f"  Revenue: ${seed['financials']['annual_revenue']:,.0f}")
    print(f"  Headcount: {seed['financials']['headcount']}")
    print(f"  Founded: {seed['company']['founded']}")
    print(f"  Output: {output_path}")


if __name__ == "__main__":
    main()
