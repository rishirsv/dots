#!/usr/bin/env python3
"""
Render narrative markdown outputs from templates using deal_state.json.

Usage:
    python3 scripts/render_narratives.py --output-dir <output_dir>
"""

import argparse
import json
from datetime import datetime
from pathlib import Path

try:
    from jinja2 import Environment, FileSystemLoader
except ImportError:
    print("Error: jinja2 package required. Install with: pip install jinja2")
    exit(1)


SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
TEMPLATES_DIR = PROJECT_DIR / "references" / "templates"


def format_number(value):
    try:
        return f"{float(value):,.0f}"
    except Exception:
        return str(value)


def format_percent(value):
    try:
        v = float(value)
        if v <= 1:
            v *= 100
        return f"{v:.1f}%"
    except Exception:
        return str(value)


def format_millions(value):
    try:
        return f"{float(value) / 1_000_000:.1f}"
    except Exception:
        return str(value)


def load_deal_state(output_dir: Path):
    deal_state_path = output_dir / "deal_state.json"
    if not deal_state_path.exists():
        print(f"Error: deal_state.json not found in {output_dir}")
        exit(1)
    with open(deal_state_path) as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="Render narrative documents from templates")
    parser.add_argument("--output-dir", required=True, help="Run output directory containing deal_state.json")
    parser.add_argument("--generated-date", help="Optional generated date string for templates")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    deal_state = load_deal_state(output_dir)

    # Output sections for narrative documents
    process_dir = output_dir / "12.0-process"
    financial_dir = output_dir / "2.0-financial"
    corporate_dir = output_dir / "1.0-corporate"
    process_dir.mkdir(parents=True, exist_ok=True)
    financial_dir.mkdir(parents=True, exist_ok=True)
    corporate_dir.mkdir(parents=True, exist_ok=True)

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["format_number"] = format_number
    env.filters["format_percent"] = format_percent
    env.filters["format_millions"] = format_millions

    generated_date = args.generated_date or datetime.now().strftime("%Y-%m-%d")

    # Build context from deal_state
    company = deal_state.get("company", {})
    financials = deal_state.get("financials_seed", {})
    management = deal_state.get("management", [])
    events = deal_state.get("events_timeline", [])
    customers = deal_state.get("customers_seed", [])
    sites = deal_state.get("sites", [])

    context = {
        "company": company,
        "story": company.get("story", {}),
        "financials": financials,
        "management": management,
        "events": events,
        "customers": customers,
        "sites": sites,
        "operations": {
            "customer_count": len(customers),
            "site_count": len(sites),
            "store_count": sum(1 for s in sites if s.get("type") in ("store", "clinic", "practice")),
            "client_count": len(customers),
        },
        "industry": company.get("industry", ""),
        "generated_date": generated_date,
        "fiscal_year_end": company.get("fiscal_year_end", "December 31"),
    }

    # Render map: template → (output_filename, output_section_dir)
    render_map = {
        "cim_template.md": ("cim.md", process_dir),
        "company_overview.md": ("company_overview.md", corporate_dir),
        "accounting_policy.md": ("accounting_policies.md", financial_dir),
        "ebitda_bridge.md": ("ebitda_bridge.md", financial_dir),
    }

    company_name = company.get("name", "Unknown Company")
    print(f"Rendering narratives for {company_name}...")

    rendered_count = 0
    for template_name, (output_name, section_dir) in render_map.items():
        try:
            template = env.get_template(template_name)
            rendered = template.render(**context)
            out_path = section_dir / output_name
            out_path.write_text(rendered, encoding="utf-8")
            print(f"  {output_name} -> {section_dir.name}/")
            rendered_count += 1
        except Exception as e:
            print(f"  WARNING: Failed to render {template_name}: {e}")

    print(f"\nNarrative rendering complete: {rendered_count} documents")
    print(f"  Output: {output_dir}")


if __name__ == "__main__":
    main()
