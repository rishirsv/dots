#!/usr/bin/env python3
"""
Render narrative markdown outputs from templates.

Usage:
    python3 scripts/render_narratives.py [--seed-file path/to/company_seed.json] [--output-dir output/]
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
TEMPLATES_DIR = PROJECT_DIR / "templates"
OUTPUT_DIR = PROJECT_DIR / "output"


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


def load_seed(seed_path: Path):
    with open(seed_path) as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(description="Render narrative documents from templates")
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
        "--generated-date",
        help="Optional generated date string for templates"
    )
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    seed_path = Path(args.seed_file) if args.seed_file else (output_dir / "company_seed.json")
    if not seed_path.exists():
        print(f"Error: Seed file not found: {seed_path}")
        exit(1)

    seed = load_seed(seed_path)
    output_dir.mkdir(parents=True, exist_ok=True)

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    env.filters["format_number"] = format_number
    env.filters["format_percent"] = format_percent
    env.filters["format_millions"] = format_millions

    generated_date = args.generated_date or datetime.now().strftime("%Y-%m-%d")
    context = {
        "company": seed.get("company", {}),
        "story": seed.get("story", {}),
        "financials": seed.get("financials", {}),
        "management": seed.get("management", []),
        "events": seed.get("events", []),
        "operations": seed.get("operations", {}),
        "industry": seed.get("metadata", {}).get("industry", ""),
        "generated_date": generated_date,
        "fiscal_year_end": seed.get("financials", {}).get("fiscal_year_end", "December 31"),
    }

    render_map = {
        "cim_template.md": "cim.md",
        "company_overview.md": "company_overview.md",
        "accounting_policy.md": "accounting_policies.md",
        "ebitda_bridge.md": "ebitda_bridge.md",
    }

    print(f"Rendering narratives for {seed['company']['name']}...")
    for template_name, output_name in render_map.items():
        template = env.get_template(template_name)
        rendered = template.render(**context)
        out_path = output_dir / output_name
        out_path.write_text(rendered, encoding="utf-8")
        print(f"  ✓ {output_name}")

    print(f"\n✓ Narrative rendering complete")
    print(f"  Output directory: {output_dir}")


if __name__ == "__main__":
    main()
