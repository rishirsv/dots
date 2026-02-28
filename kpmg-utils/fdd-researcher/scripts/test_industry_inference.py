"""
Test Industry Inference Accuracy

This script tests the industry inference logic by checking that
document fixtures contain the expected trigger keywords.
"""

import re
from pathlib import Path
from typing import Dict, List, Set

# Industry trigger keywords from system prompt
INDUSTRY_SIGNALS = {
    "Technology / SaaS": {
        "ARR", "MRR", "NRR", "GRR", "churn", "seats", "logos", "subscription",
        "per-seat", "SaaS", "cloud", "recurring", "cohort", "CAC", "LTV",
        "payback", "bookings", "billings", "RPO", "deferred revenue"
    },
    "Banking & Lending": {
        "NIM", "NII", "deposits", "loan portfolio", "NCOs", "originations",
        "yield", "cost of funds", "CECL", "ACL", "delinquency", "charge-offs",
        "warehouse", "securitization"
    },
    "Insurance": {
        "combined ratio", "loss ratio", "expense ratio", "premium", "claims",
        "reserves", "underwriting", "reinsurance", "loss development", "IBNR",
        "policyholder"
    },
    "Transportation & Logistics": {
        "loads", "lanes", "OR", "operating ratio", "freight", "warehouse",
        "fleet", "miles", "RPM", "deadhead", "brokerage", "TMS", "WMS",
        "capacity", "shipper"
    },
    "Real Estate & Construction": {
        "NOI", "occupancy", "rent roll", "cap rate", "WIP", "POC",
        "overbillings", "underbillings", "retention", "backlog", "bonding",
        "GC", "subcontractor"
    },
    "Business Services": {
        "utilization", "bill rate", "headcount", "project hours", "billable",
        "consultants", "engagements", "backlog", "realization", "leverage ratio"
    },
    "Healthcare Services": {
        "visits", "encounters", "wRVUs", "payor mix", "NPSR", "reimbursement",
        "denials", "collections", "Medicare", "Medicaid", "managed care",
        "credentialing", "census"
    },
    "Retail / Consumer": {
        "same-store sales", "comps", "SSS", "AOV", "basket", "turns",
        "inventory", "SKUs", "traffic", "conversion", "unit economics",
        "store count", "e-commerce"
    },
    "Industrial Manufacturing": {
        "OEE", "throughput", "BOM", "backlog", "book-to-bill", "yield",
        "scrap", "capacity utilization", "COGS", "direct labor", "make vs buy",
        "lead time"
    },
    "Asset Management": {
        "AUM", "net flows", "fee rate", "carry", "management fee",
        "performance fee", "incentive fee", "fund", "LP", "GP", "vintage",
        "committed capital", "dry powder"
    },
}

# Expected industry for each fixture
FIXTURE_EXPECTED = {
    "saas-cim-excerpt.md": "Technology / SaaS",
    "healthcare-vdd-excerpt.md": "Healthcare Services",
    "retail-teaser.md": "Retail / Consumer",
    "lending-cim-excerpt.md": "Banking & Lending",
}


def find_signals(text: str, signals: Set[str]) -> Set[str]:
    """Find which signals appear in the text (case-insensitive)."""
    text_lower = text.lower()
    found = set()
    for signal in signals:
        if signal.lower() in text_lower:
            found.add(signal)
    return found


def infer_industry(text: str) -> Dict[str, int]:
    """
    Infer industry from document text.
    Returns dict of industry -> signal count.
    """
    scores = {}
    for industry, signals in INDUSTRY_SIGNALS.items():
        found = find_signals(text, signals)
        scores[industry] = len(found)
    return scores


def test_fixture(fixture_path: Path) -> bool:
    """Test a single fixture file."""
    expected = FIXTURE_EXPECTED.get(fixture_path.name)
    if not expected:
        print(f"  SKIP: {fixture_path.name} (no expected industry)")
        return True

    text = fixture_path.read_text()
    scores = infer_industry(text)

    # Get top industry
    top_industry = max(scores, key=scores.get)
    top_score = scores[top_industry]

    # Get signals found
    found_signals = find_signals(text, INDUSTRY_SIGNALS[expected])

    if top_industry == expected:
        print(f"  PASS: {fixture_path.name}")
        print(f"        Expected: {expected} ({top_score} signals)")
        print(f"        Signals: {', '.join(sorted(found_signals)[:5])}...")
        return True
    else:
        print(f"  FAIL: {fixture_path.name}")
        print(f"        Expected: {expected} ({scores[expected]} signals)")
        print(f"        Got: {top_industry} ({top_score} signals)")
        return False


def main():
    print("=" * 60)
    print("Industry Inference Test")
    print("=" * 60)

    fixtures_dir = Path(__file__).parent.parent / "fixtures"
    if not fixtures_dir.exists():
        print(f"Fixtures directory not found: {fixtures_dir}")
        return

    fixtures = list(fixtures_dir.glob("*.md"))
    if not fixtures:
        print("No fixture files found")
        return

    print(f"\nTesting {len(fixtures)} fixtures...\n")

    passed = 0
    failed = 0

    for fixture in sorted(fixtures):
        if test_fixture(fixture):
            passed += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)


if __name__ == "__main__":
    main()
