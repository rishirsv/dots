#!/usr/bin/env python3
"""
Generate parameterized lease PDFs for M&A Data Room Simulator.

Generates one lease PDF per LEASED site in deal_state.sites.
Parameterized for company info, location, and industry-appropriate permitted use.

Usage:
    python3 scripts/generate_leases.py --output-dir <output_dir>
"""

import argparse
import json
import random
from datetime import datetime
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from faker import Faker

fake = Faker()
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent


def load_deal_state(output_dir: Path) -> dict:
    """Load deal_state from JSON file."""
    deal_state_path = output_dir / "deal_state.json"
    if not deal_state_path.exists():
        raise FileNotFoundError(f"Deal state not found: {deal_state_path}")
    with open(deal_state_path) as f:
        return json.load(f)


def round_currency(value: float) -> float:
    """Round to 2 decimal places."""
    return float(Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


def get_permitted_use(industry: str) -> str:
    """Get industry-appropriate permitted use clause."""
    industry_uses = {
        "saas": "technology and office operations",
        "construction": "general commercial office for construction management",
        "manufacturing": "light manufacturing and warehouse operations",
        "dental": "dental and allied medical practice",
        "professional_services": "general office and professional services",
        "retail": "retail sales and customer-facing operations",
    }
    return industry_uses.get(industry, "general commercial office")


def draw_wrapped(c: canvas.Canvas, text: str, x: int, y: int, max_width: int, font_name="Times-Roman", font_size=10, line_height=13):
    """Draw wrapped text on canvas."""
    c.setFont(font_name, font_size)
    words = text.split()
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if c.stringWidth(candidate, font_name, font_size) <= max_width:
            line = candidate
        else:
            c.drawString(x, y, line)
            y -= line_height
            line = word
    if line:
        c.drawString(x, y, line)
        y -= line_height
    return y


def generate_landlord_name() -> str:
    """Generate realistic LLC/LP property company names."""
    strategies = [
        lambda: f"{fake.last_name()} {random.choice(['Properties', 'Realty', 'Management'])} LLC",
        lambda: f"{fake.word().capitalize()} {random.choice(['Property', 'Real Estate'])} {random.choice(['LP', 'LLC'])}",
        lambda: f"{fake.first_name()} {fake.last_name()} {random.choice(['Properties', 'Partners'])} LP",
    ]
    return random.choice(strategies)()


def render_lease(pdf_path: Path, lease: dict):
    """Render lease PDF with all sections."""
    c = canvas.Canvas(str(pdf_path), pagesize=LETTER)
    width, height = LETTER

    pages = [
        (
            "COMMERCIAL LEASE AGREEMENT",
            [
                f"This COMMERCIAL LEASE AGREEMENT (this \"Lease\") is made and entered into as of {lease['effective_date']} (the \"Effective Date\") by and between {lease['landlord']}, a legal entity under applicable law (\"Landlord\") and {lease['tenant']} (\"Tenant\").",
                "In consideration of the mutual covenants and promises set forth herein, Tenant agrees to lease, and Landlord agrees to lease, the real property described in this instrument on the terms and conditions stated below.",
                f"The designated Premises are more particularly described in Exhibit A and are located at {lease['premises']}. Landlord covenants that it has authority to enter this Lease and convey the interests herein.",
                f"The Lease Term begins on {lease['term_start']} (the \"Commencement Date\") and, unless terminated earlier under applicable Section, expires on {lease['term_end']} (the \"Expiration Date\").",
                "Unless otherwise defined, words used in this Lease have the meanings set forth in this opening section and all sections that follow. Time is of the essence in all monetary and non-monetary performance obligations.",
                "This Lease is entered into by way of an executed commercial transaction between sophisticated parties and includes all exhibits and addenda attached, each of which is deemed incorporated and binding.",
            ],
        ),
        (
            "SECTION 1. DEFINITIONS AND INTERPRETATION",
            [
                "\"Additional Rent\" means all sums and amounts payable by Tenant other than Base Rent, including operating expenses, taxes, betterments, insurance recoverables, utility reimbursements, late charges, and costs or fees incurred for collection or enforcement.",
                "\"Base Rent\" means the fixed annual rental amounts allocated to monthly installments listed in Addendum A.",
                "\"Base Rentable Premises\" means the floor, rooms, and associated appurtenant improvements within the Premises exclusively described in Exhibit A.",
                "\"Event of Default\" means any default described in Section 11 that is not cured in accordance with the cure periods and cure mechanisms described in Section 15.",
                "\"Lease Year\" means each successive twelve (12) month period beginning on the first day of the first Lease Year and each anniversary thereof.",
                "\"Notice\" means a written notice satisfying Section 14, delivered under the Notice and Service provisions and effective upon deemed delivery.",
                "\"Permitted Use\" means the operation of " + lease["permitted_use"] + " conducted in compliance with all permits and laws.",
                "\"Rent\" means the aggregate of Base Rent and Additional Rent.",
                "The phrase \"includes\" is intended to be non-exclusive and the phrase \"including\" has the same meaning unless otherwise specified in context.",
                "Headings are for convenience only and shall not control interpretation; whenever there is a conflict between a heading and operative provisions, the operative text controls.",
            ],
        ),
        (
            "SECTION 2. DEMISED PROPERTY AND USE",
            [
                "Landlord leases and demises to Tenant the Premises, together with access rights, utilities access, loading access, and necessary use rights, subject to all terms and conditions herein.",
                "Tenant accepts possession of the Premises on the Commencement Date and may use the Premises only for the Permitted Use or such additional uses as Landlord may expressly approve in writing.",
                "Tenant shall not use the Premises in a manner that creates a nuisance, violates law, materially increases risk to the building, or requires structural modification without written consent.",
                "No encroachment, additional easement use, or change of use to unrelated retail, industrial, or storage-only purposes is permitted without prior Landlord approval.",
                "Tenant shall keep all access pathways, corridors, and storage areas in a safe condition and immediately correct unsafe conditions attributable to Tenant operations.",
                "All business records, data, and materials introduced on-site remain Tenant property and shall be handled in accordance with applicable compliance and record-retention obligations.",
            ],
        ),
        (
            "SECTION 3. TERM AND COMMENCEMENT",
            [
                f"The initial term shall be for the period set forth above ({lease['lease_years']} years), and no extension or renewal shall occur except by separate written agreement signed by both parties prior to expiration.",
                "Tenant shall have no implied right to renew by occupancy, tolerance, extension through holdover rent, or prior silence from Landlord.",
                "If the Premises are not substantially complete and free from material defects at lease commencement, Tenant may notify Landlord in writing and cure procedures will follow the delay procedure in Section 20.",
                "Occupancy may begin on the Commencement Date only when Tenant has delivered all required occupancy approvals and insurance certificates referenced in the exhibits.",
                "If the Effective Date is not the same as commencement, prorations shall be computed on a thirty-day month convention and a true-up shall occur on first Rent payment.",
                "Any extension that is silent as to rent, escalation, and taxes is deemed invalid unless memorialized in a signed amendment with all exhibits updated.",
            ],
        ),
        (
            "SECTION 4. BASE RENT AND RENTAL ESCALATION",
            [
                f"Initial Base Rent shall be {lease['base_rent_formatted']} per month for Lease Year 1 and remains payable in equal monthly installments in advance on the first day of each month.",
                f"Beginning each Lease Year anniversary, Base Rent is adjusted by {lease['annual_escalation']}% per annum, compounded annually and rounded to the nearest cent.",
                "Base Rent shall be deemed fully earned and received for each month as if paid timely; acceptance of late payments shall not waive Landlord's rights or modify the payment terms.",
                "If Tenant requests a payment date change for the month, the request must be acknowledged by Landlord in writing before the due date and cannot delay a default determination.",
                "No payment shall be made without remittance details showing period covered, month of payment, and unique invoice reference.",
                "Rent escalation is fixed as set forth in this Lease and shall not be adjusted further except as expressly stated in a signed amendment.",
            ],
        ),
        (
            "SECTION 5. ADDITIONAL RENT AND OPERATING COSTS",
            [
                "Additional Rent includes, without limitation, real estate taxes, personal property tax on leased furniture and equipment where attributable, water/sewer charges, waste removal, common utilities, and recoverable insurance and casualty coverage premiums.",
                "Where the property is within a building with common facilities, Tenant shall pay Tenant's proportionate share in accordance with an annual allocation factor set forth in Section 5(B).",
                "Landlord shall provide itemized statements for Additional Rent charges not less than annually and Tenant may inspect supporting vouchers, invoices, and tax statements at Landlord's office within normal business hours.",
                "Tenant's right to audit is one audit per calendar year by a CPA or qualified independent accounting professional with reasonable notice, and challenged amounts are payable under protest without suspension of undisputed amounts.",
                "A CAM, utility, or insurance reconciliation not submitted within one hundred twenty (120) days of year-end does not defeat Tenant's right to payment but may be adjusted by statement of material variance.",
                "Any overcharge above three percent (3%) for the audited period is not final until corrected and may be credited, rebated, or recovered through escrow holdback procedures.",
            ],
        ),
        (
            "SECTION 6. INSURANCE AND COMPLIANCE",
            [
                "Tenant shall maintain commercial general liability, workers' compensation, and property coverage for Tenant-owned fixtures in amounts established in Addendum D.",
                "Policies shall name Landlord and Landlord's lender, where applicable, as additional insureds with thirty (30) days' notice of cancellation and shall not be cancelled except for non-payment of premium.",
                "Tenant shall deliver updated certificates of insurance within ten (10) business days of renewal events or upon any material policy change.",
                "Tenant shall comply with all statutes and regulations affecting operation, including ADA, environmental regulations, and any authority directives.",
                "Tenant shall be solely responsible for legal compliance and permits for its operations and shall indemnify Landlord from any sanction attributable to non-compliance by Tenant.",
                "Tenant must promptly provide Landlord copies of all notices, inspections, and citations related to premises use; such documents may be marked confidential but not to the extent needed to preserve Landlord's legal rights.",
            ],
        ),
        (
            "SECTION 7. MAINTENANCE AND REPAIRS",
            [
                "Tenant shall keep the interior of the Premises in good order, safe condition, and repair, including doors, locks, finishes, signage, and all mechanical/electrical features serving Tenant's operations.",
                "Landlord shall be responsible for exterior envelope, structure, HVAC mains, and roof, except where Tenant-caused damage exists and is not remediated through insurance, in which case Tenant bears repair responsibility.",
                "Tenant must not remove or impair building systems without prior written authorization and shall be responsible for restoration to pre-existing conditions upon termination, ordinary wear excluded.",
                "Tenant will keep all mounted or suspended installations properly secured and ensure vibration, drilling, and load standards are approved in advance by structural engineer.",
                "Tenant shall ensure all waste handling, disposal practices comply with environmental rules and applicable regulations.",
                "Any contractor used by Tenant shall be directly liable to Tenant for workmanship, and Tenant remains responsible for all acts and omissions of contractors while on the Premises.",
            ],
        ),
        (
            "SECTION 8. ALTERATIONS AND ASSIGNMENT",
            [
                "Tenant shall not construct, modify, alter, or renovate the Premises beyond trivial decorative changes without Landlord's prior written consent, which shall not be unreasonably withheld, delayed, or conditioned.",
                "All alterations become Tenant's responsibility to permit and execute to code and remain on the Premises unless Landlord requires restoration in writing at termination.",
                "Tenant shall not create liens on the Premises and will remove all liens within five (5) business days of notice by posting bond or payment as required by statute.",
                "Tenant shall not assign, transfer, or sublease all or part of the Premises without prior written consent, except where a Qualifying Affiliate is expressly approved with credit support meeting Landlord standards.",
                "Any permitted sublease shall include a clause that Tenant remains primarily liable under this Lease and that the subtenant's obligations are co-extensive to its scope of occupancy.",
                "Assignments to financing affiliates are not transfers unless expressly identified in writing and approved under applicable provisions.",
            ],
        ),
        (
            "SECTION 9. DEFAULT AND REMEDIES",
            [
                "A monetary Event of Default occurs if Rent, Additional Rent, or taxes are unpaid for five (5) days after delivery of Notice of Nonpayment.",
                "A non-monetary Event of Default occurs upon breach of legal compliance, operation standards, assignment restrictions, or insurance obligations not cured within thirty (30) days after Notice.",
                "For non-monetary defaults requiring actions by third parties, Tenant may be afforded a good-faith additional cure window if it demonstrates substantial diligence and written cure plan.",
                "Upon Event of Default, Landlord may recover late charges, costs, reasonable attorney's fees, and all costs of repossession, including collection fees and legal process expenditures.",
                "Upon termination, unpaid Rent and Additional Rent remain immediately due, and Landlord may offset sums against deposits, security obligations, and any accounts receivable due to Tenant.",
                "Tenant waives any claim that remedies are cumulative only where a remedy requires surrender of existing legal reliefs expressly preserved by statute or this Lease.",
            ],
        ),
        (
            "SECTION 10. NOTICES AND LEGAL PROVISIONS",
            [
                "All notices, consents, and instruments must be in writing and sent by certified mail, recognized courier, overnight service, or acknowledged email as set forth in Addendum C.",
                "Notice periods commence when delivered, deposited in ordinary course, or deemed delivered based on the delivery method selected in the addendum.",
                "Tenant shall execute estoppel certificates within ten (10) business days of request by Landlord, prospective purchaser, lender, or successor-in-interest.",
                "Any estoppel certificate must truthfully confirm Rent status, compliance status, defaults, and any offsets claimed; deliberate misstatement is a material default.",
                "This Lease is subject to and supplemented by the attached addenda: Addendum A (Base Rent schedule), Addendum B (legal description), Addendum C (notices), Addendum D (insurance requirements).",
                "Governing law is that of the state where the Premises are located; venue is exclusive in the courts having jurisdiction there, except where statutory authority requires otherwise.",
                "",
                f"LANDLORD: {lease['landlord']:<25} Date: ______________",
                "",
                f"TENANT: {lease['tenant']:<25} Date: ______________",
            ],
        ),
    ]

    for page_no, (title, paragraphs) in enumerate(pages, start=1):
        c.setFont("Times-Bold", 13)
        c.drawString(50, height - 50, title)
        c.setFont("Times-Roman", 10)
        c.drawString(50, height - 70, f"Premises: {lease['premises']}")
        c.drawString(50, height - 84, f"Landlord: {lease['landlord']}")
        c.drawString(50, height - 98, f"Tenant: {lease['tenant']}")

        y = height - 126
        for paragraph in paragraphs:
            if paragraph.strip():
                y = draw_wrapped(c, paragraph, 50, y, int(width - 100))
                y -= 8

        c.setFont("Times-Italic", 9)
        c.drawRightString(width - 50, 30, f"Page {page_no} of {len(pages)}")
        c.showPage()

    c.save()


def slug(text: str) -> str:
    """Convert text to slug format."""
    return text.lower().replace(" ", "-").replace(",", "").replace(".", "")


def main():
    parser = argparse.ArgumentParser(
        description="Generate parameterized lease PDFs from deal_state.json"
    )
    parser.add_argument("--output-dir", required=True, help="Target data room output directory")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)

    # Load deal state
    deal_state = load_deal_state(output_dir)
    company_name = deal_state["company"]["legal_name"]
    industry = deal_state["company"]["industry"]
    permitted_use = get_permitted_use(industry)

    # Create lease output directory
    lease_dir = output_dir / "8.0-legal" / "lease_documents"
    lease_dir.mkdir(parents=True, exist_ok=True)

    # Filter for leased sites
    leased_sites = [s for s in deal_state.get("sites", []) if s.get("owned_or_leased") == "leased"]

    if not leased_sites:
        print(f"No leased sites found. Skipping lease generation.")
        return

    print(f"Generating {len(leased_sites)} lease PDFs...")

    for idx, site in enumerate(leased_sites, start=1):
        site_name = site.get("name", f"Site {idx}")
        address = f"{site.get('address', '')}, {site.get('city', '')}, {site.get('state', '')}"

        # Parse lease dates (handle None values)
        lease_start_str = site.get("lease_start") or "2020-01-01"
        lease_end_str = site.get("lease_end") or "2030-01-01"
        lease_start = datetime.strptime(str(lease_start_str), "%Y-%m-%d")
        lease_end = datetime.strptime(str(lease_end_str), "%Y-%m-%d")
        lease_years = round((lease_end - lease_start).days / 365.25)

        # Calculate escalation rate
        annual_escalation = round(random.uniform(2.5, 3.5), 2)

        # Get monthly rent or generate based on sqft
        monthly_rent = site.get("monthly_rent") or round(site.get("sqft", 5000) * 2.5, 2)

        lease = {
            "file_name": f"Lease-{idx:03d}-{slug(site_name)}.pdf",
            "effective_date": lease_start.strftime("%B %d, %Y"),
            "term_start": lease_start.strftime("%B %d, %Y"),
            "term_end": lease_end.strftime("%B %d, %Y"),
            "premises": address,
            "landlord": generate_landlord_name(),
            "tenant": company_name,
            "base_rent": round_currency(monthly_rent),
            "base_rent_formatted": f"${monthly_rent:,.2f}",
            "annual_escalation": annual_escalation,
            "lease_years": lease_years,
            "permitted_use": permitted_use,
        }

        pdf_path = lease_dir / lease["file_name"]
        render_lease(pdf_path, lease)
        print(f"  Generated: {lease['file_name']}")

    print(f"\nGenerated {len(leased_sites)} lease PDFs in {lease_dir}")


if __name__ == "__main__":
    main()
