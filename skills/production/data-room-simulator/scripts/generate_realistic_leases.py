#!/usr/bin/env python3
"""
Generate executed-style commercial lease PDFs for simulated data rooms.

Usage:
  python3 scripts/generate_realistic_leases.py --output-dir output/runs/<run-id> --company-name "Oakridge Dental Clinic, PLLC"
"""

import argparse
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas


def draw_wrapped(c: canvas.Canvas, text: str, x: int, y: int, max_width: int, font_name="Times-Roman", font_size=10, line_height=13):
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


def render_lease(pdf_path: Path, lease: dict):
    c = canvas.Canvas(str(pdf_path), pagesize=LETTER)
    width, height = LETTER

    pages = [
        (
            "GROUND AND AIR SPACE PARCEL LEASE AGREEMENT",
            [
                f"This GROUND AND AIR SPACE PARCEL LEASE AGREEMENT (this \"Lease\") is made and entered into as of {lease['effective_date']} (the \"Effective Date\") by and between {lease['landlord']}, a legal entity under applicable law (\"Landlord\") and {lease['tenant']} (\"Tenant\").",
                "In consideration of the mutual covenants and promises set forth herein, Tenant agrees to lease, and Landlord agrees to lease, the real property and air space described in this instrument on the terms and conditions stated below.",
                f"The designated Premises are more particularly described in Exhibit A and are known as {lease['premises']}. Landlord covenants that it has authority to enter this Lease and convey the interests herein.",
                f"The Lease Term begins on {lease['term_start']} (the \"Commencement Date\") and, unless terminated earlier under Section 16, expires on {lease['term_end']} (the \"Expiration Date\").",
                "Unless otherwise defined, words used in this Lease have the meanings set forth in this opening section and all sections that follow. Time is of the essence in all monetary and non-monetary performance obligations.",
                "This Lease is entered into by way of an executed commercial transaction between sophisticated parties and includes all exhibits and addenda attached, each of which is deemed incorporated and binding.",
            ],
        ),
        (
            "SECTION 1. DEFINITIONS; INTERPRETATION",
            [
                "\"Additional Rent\" means all sums and amounts payable by Tenant other than Base Rent, including operating expenses, taxes, betterments, insurance recoverables, utility reimbursements, late charges, and costs or fees incurred for collection or enforcement.",
                "\"Base Rent\" means the fixed annual rental amounts allocated to monthly installments listed in Addendum A.",
                "\"Base Rentable Premises\" means the floor, rooms, and associated appurtenant improvements within the Premises exclusively described in Exhibit A.",
                "\"Event of Default\" means any default described in Section 11 that is not cured in accordance with the cure periods and cure cure mechanisms described in Section 15.",
                "\"Lease Year\" means each successive twelve (12) month period beginning on the first day of the first Lease Year and each anniversary thereof.",
                "\"Notice\" means a written notice satisfying Section 14, delivered under the Notice and Service provisions and effective upon deemed delivery.",
                "\"Permitted Use\" means the operation of dental, allied medical, and related patient-care administrative activity conducted in compliance with all permits and laws.",
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
                "All patient files, software systems, and business records introduced on-site remain Tenant property and shall be handled in accordance with applicable privacy and record-retention obligations.",
            ],
        ),
        (
            "SECTION 3. TERM; COMMENCEMENT; RENEWAL",
            [
                f"The initial term shall be for the period set forth above, and no extension or renewal shall occur except by separate written agreement signed by both parties prior to expiration.",
                "Tenant shall have no implied right to renew by occupancy, tolerance, extension through holdover rent, or prior silence from Landlord.",
                "If the Premises are not substantially complete and free from material defects at lease commencement, Tenant may notify Landlord in writing and cure notices and abatement rights, as applicable, will follow the delay cure procedure in Section 20.",
                "Occupancy may begin on the Commencement Date only when Tenant has delivered all required occupancy approvals and insurance certificates referenced in the exhibits.",
                "If the Effective Date is not the same as commencement, prorations shall be computed on a thirty-day month convention and a true-up shall occur on first Rent payment.",
                "Any extension that is silent as to rent, escalation, and taxes is deemed invalid unless memorialized in a signed amendment with all exhibits updated.",
            ],
        ),
        (
            "SECTION 4. BASE RENT AND RENTAL STEP-UPS",
            [
                f"Initial Base Rent shall be {lease['base_rent']} per month for Lease Year 1 and remains payable in equal monthly installments in advance on the first day of each month.",
                f"Beginning each Lease Year anniversary, Base Rent is adjusted to the next amount stated in Addendum A and shall be non-refundable unless expressly stated otherwise.",
                f"The escalation rate shown in Addendum A is {lease['annual_escalation']}% per annum, compounded where schedule is fixed and rounded to the nearest cent.",
                "Base Rent shall be deemed fully earned and received for each month as if paid timely; acceptance of late payments shall not waive Landlord's rights or modify the payment terms.",
                "If Tenant requests a payment date change for the month, the request must be acknowledged by Landlord in writing before the due date and cannot delay a default determination.",
                "No payment shall be made without remittance details showing period covered, month of payment, and unique invoice reference.",
            ],
        ),
        (
            "SECTION 5. ADDITIONAL RENT, OPERATING COSTS, CAM, TAXES",
            [
                "Additional Rent includes, without limitation, real estate taxes, personal property tax on leased furniture and equipment where attributable, water/sewer charges, waste removal, common utilities, and recoverable insurance, fire and casualty coverage premiums.",
                "Where the property is within a building with common facilities, Tenant shall pay Tenant's proportionate share in accordance with an annual allocation factor set forth in Section 5(B).",
                "Landlord shall provide itemized statements for Additional Rent charges not less than annually and Tenant may inspect supporting vouchers, invoices, and tax statements at Landlord's office within normal business hours.",
                "Tenant's right to audit is one audit per calendar year by a CPA or qualified independent accounting professional with reasonable notice, and challenged amounts are payable under protest without suspension of undisputed amounts.",
                "A CAM, utility, or insurance reconciliation not submitted within one hundred twenty (120) days of year-end does not defeat Tenant's right to payment but may be adjusted by statement of material variance.",
                "Any overcharge above three percent (3%) for the audited period is not final until corrected and may be credited, rebated, or recovered through escrow holdback procedures in Addendum C.",
            ],
        ),
        (
            "SECTION 6. TAXES; INSURANCE; COMPLIANCE",
            [
                "Tenant shall maintain commercial general liability, workers' compensation, malpractice and professional liability, and property coverage for Tenant-owned fixtures in amounts established in Addendum D.",
                "Policies shall name Landlord and Landlord's lender, where applicable, as additional insureds with thirty (30) days' notice of cancellation and shall not be cancelled except for non-payment of premium.",
                "Tenant shall deliver updated certificates of insurance within ten (10) business days of renewal events or upon any material policy change.",
                "Tenant shall comply with all statutes and regulations affecting operation, including ADA, environmental regulations, and any health authority directives.",
                "Tenant shall be solely responsible for legal citations and permits for patient services and shall indemnify Landlord from any sanction attributable to non-compliance by Tenant operations.",
                "Tenant must promptly provide Landlord copies of all notices, inspections, and citations related to premises use; copies may be marked confidential but not confidential to the extent needed to preserve legal rights.",
            ],
        ),
        (
            "SECTION 7. MAINTENANCE; REPAIRS; REPAIRS LIABILITY",
            [
                "Tenant shall keep the interior of the Premises in good order, safe condition, and repair, including doors, locks, finishes, signage, and all mechanical/electrical features serving Tenant's operations.",
                "Landlord shall be responsible for exterior envelope, structure, HVAC mains, and roof, except where Tenant-caused damage exists and is not remediated through insurance, in which case Tenant bears repair responsibility.",
                "Tenant must not remove or impair building systems without prior written authorization and shall be responsible for restoration to pre-existing conditions upon termination, ordinary wear excluded.",
                "Tenant will keep all airspace-mounted or suspended installations properly secured and ensure vibration, drilling, and load standards are approved in advance by structural plans.",
                "Tenant shall ensure all waste, sharps disposal, biohazard handling, and medical waste practices comply with environmental rules and third-party transporter licensing requirements.",
                "Any contractor used by Tenant shall be directly liable to Tenant for workmanship, and Tenant remains responsible for all acts and omissions of contractors while on the Premises.",
            ],
        ),
        (
            "SECTION 8. ALTERATIONS, LIENS, ASSIGNMENT, SUBLETTING",
            [
                "Tenant shall not construct, modify, alter, or renovate the Premises beyond trivial decorative changes without Landlord's prior written consent, which shall not be unreasonably withheld, delayed, or conditioned.",
                "All alterations become Tenant's responsibility to permit and execute to code and remain on the Premises unless Landlord requires restoration in writing at termination.",
                "Tenant shall not create liens on the Premises and will remove all liens within five (5) business days of notice by posting bond or payment as required by statute.",
                "Tenant shall not assign, transfer, or sublease all or part of the Premises without prior written consent, except where a Qualifying Affiliate is expressly approved with credit support meeting Landlord standards.",
                "Any permitted sublease shall include a clause that Tenant remains primarily liable under this Lease and that the subtenant's obligations are co-extensive to its scope of occupancy.",
                "Assignments to lending creditors or financing affiliates are not transfers unless expressly identified in writing and approved under Section 12 and any lender-specific rights in Exhibit F.",
            ],
        ),
        (
            "SECTION 9. DEFAULT; REMEDIES; CURE PROCEDURES",
            [
                "A monetary Event of Default occurs if Rent, Additional Rent, or taxes are unpaid for five (5) days after delivery of Notice of Nonpayment.",
                "A non-monetary Event of Default occurs upon breach of legal compliance, operation standards, assignment restrictions, or insurance obligations not cured within thirty (30) days after Notice, except where cure requires regulatory action.",
                "For non-monetary defaults requiring actions by third parties, Tenant may be afforded a good-faith additional cure window if it demonstrates substantial diligence and written cure plan.",
                "Upon Event of Default, Landlord may recover late charges, costs, reasonable attorney's fees, and all costs of repossession, including collection fees and legal process expenditures.",
                "Upon termination, unpaid Rent and Additional Rent remain immediately due, and Landlord may offset sums against deposits, security obligations, and any accounts receivable due to Tenant.",
                "Tenant waives any claim that remedies are cumulative only where a remedy requires surrender of existing legal reliefs expressly preserved by statute or this Lease.",
            ],
        ),
        (
            "SECTION 10. NOTICES; ESTOPPEL; LANDLORD LENDER RIGHTS; EXECUTION",
            [
                "All notices, consents, and instruments must be in writing and sent by certified mail, recognized courier, overnight service, or acknowledged email as set forth in Addendum C.",
                "Notice periods commence when delivered, deposited in ordinary course, or deemed delivered based on the delivery method selected in the addendum.",
                "Tenant shall execute estoppel certificates within ten (10) business days of request by Landlord, prospective purchaser, lender, or successor-in-interest.",
                "Any estoppel certificate must truthfully confirm Rent status, compliance status, defaults, and any offsets claimed; deliberate misstatement is a material default.",
                "This Lease is subject to and supplemented by the attached addenda: Addendum A (Base Rent step-up schedule), Addendum B (legal description and use rights), Addendum C (notices and lender attornment terms), Addendum D (insurance requirements).",
                "Governing law is that of the state where the Premises are located; venue is exclusive in the courts having jurisdiction there, except where statutory authority requires otherwise.",
                "Attorneys' fees, costs, and necessary collection expenses are recoverable by the prevailing party to the extent permitted by law.",
                "LANDLORD: ______________________________   Date: ______________",
                "TENANT:   ______________________________   Date: ______________",
            ],
        ),
    ]

    for page_no, (title, paragraphs) in enumerate(pages, start=1):
        c.setFont("Times-Bold", 13)
        c.drawString(50, height - 50, title)
        c.setFont("Times-Roman", 10)
        c.drawString(50, height - 70, f"Property: {lease['premises']}")
        c.drawString(50, height - 84, f"Landlord: {lease['landlord']}")
        c.drawString(50, height - 98, f"Tenant: {lease['tenant']}")

        y = height - 126
        for paragraph in paragraphs:
            y = draw_wrapped(c, paragraph, 50, y, int(width - 100))
            y -= 8

        c.setFont("Times-Italic", 9)
        c.drawRightString(width - 50, 30, f"Page {page_no} of {len(pages)}")
        c.showPage()

    c.save()


def main():
    parser = argparse.ArgumentParser(description="Generate realistic lease PDFs for data room output directories.")
    parser.add_argument("--output-dir", required=True, help="Target data room output directory")
    parser.add_argument("--company-name", default="Dental Clinic Holdings, LLC", help="Tenant legal name")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    lease_dir = output_dir / "lease_documents"
    lease_dir.mkdir(parents=True, exist_ok=True)

    leases = [
        {
            "file_name": "Lease-001-Main-Clinic-Premises.pdf",
            "effective_date": "January 1, 2023",
            "term_start": "January 1, 2023",
            "term_end": "December 31, 2032",
            "premises": "1208 Lakeview Blvd, Suite 200, Austin, TX",
            "landlord": "Riverbend Medical Properties LLC",
            "tenant": args.company_name,
            "base_rent": "$28,500.00",
            "annual_escalation": "3.0",
            "stepups": [
                "Lease Year 1: $28,500.00 per month",
                "Lease Year 2: $29,355.00 per month",
                "Lease Year 3: $30,235.65 per month",
                "Lease Year 4: $31,142.72 per month",
                "Lease Year 5: $32,076.99 per month",
                "Lease Year 6: $33,039.30 per month",
                "Lease Year 7: $34,030.48 per month",
                "Lease Year 8: $35,051.39 per month",
                "Lease Year 9: $36,102.93 per month",
                "Lease Year 10: $37,186.02 per month",
            ],
        },
        {
            "file_name": "Lease-002-Sterilization-Lab-Annex.pdf",
            "effective_date": "July 1, 2023",
            "term_start": "July 1, 2023",
            "term_end": "June 30, 2030",
            "premises": "1212 Lakeview Blvd, Suite 110, Austin, TX",
            "landlord": "Riverbend Medical Properties LLC",
            "tenant": args.company_name,
            "base_rent": "$9,850.00",
            "annual_escalation": "3.0",
            "stepups": [
                "Lease Year 1: $9,850.00 per month",
                "Lease Year 2: $10,145.50 per month",
                "Lease Year 3: $10,449.87 per month",
                "Lease Year 4: $10,763.37 per month",
                "Lease Year 5: $11,086.27 per month",
                "Lease Year 6: $11,418.86 per month",
                "Lease Year 7: $11,761.42 per month",
            ],
        },
        {
            "file_name": "Lease-003-Administrative-Office.pdf",
            "effective_date": "March 1, 2024",
            "term_start": "March 1, 2024",
            "term_end": "February 28, 2029",
            "premises": "508 Congress Ave, Floor 4, Austin, TX",
            "landlord": "Congress Professional Plaza LP",
            "tenant": args.company_name,
            "base_rent": "$6,900.00",
            "annual_escalation": "2.75",
            "stepups": [
                "Lease Year 1: $6,900.00 per month",
                "Lease Year 2: $7,089.75 per month",
                "Lease Year 3: $7,284.72 per month",
                "Lease Year 4: $7,485.05 per month",
                "Lease Year 5: $7,690.89 per month",
            ],
        },
    ]

    for lease in leases:
        render_lease(lease_dir / lease["file_name"], lease)

    print(f"Generated {len(leases)} lease PDFs in {lease_dir}")


if __name__ == "__main__":
    main()
