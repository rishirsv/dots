"""
Template Schema for DD Template Letter Drafter

This file defines the available templates and their required variables.
Used by the custom GPT to:
1. Display the template menu
2. Collect required variables from the user
3. Validate all fields are provided before generation
"""

TEMPLATES = {
    "buyside_client_release": {
        "filename": "Buyside Client Release Letter_EN_23-May-2025.docx",
        "display_name": "Buyside Client Release Letter",
        "description": "Authorizes release of information to buyer's advisors",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Exact legal name of client}}", "label": "Client legal name", "example": "Acme Corporation"},
            {"key": "{{Address line 1}}", "label": "Address line 1", "example": "123 Main Street"},
            {"key": "{{Address line 2}}", "label": "City, Province, Postal Code", "example": "Toronto, ON M5V 1A1"},
            {"key": "{{Country}}", "label": "Country", "example": "Canada"},
            {"key": "{{Client contact name}}", "label": "Client contact name", "example": "John Smith"},
            {"key": "{{Client contact name and title}}", "label": "Contact name and title", "example": "John Smith, CFO"},
            {"key": "{{Name of partner}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{acquisition of/investment in}}", "label": "Transaction type (acquisition of / investment in)", "example": "acquisition of"},
            {"key": "{{describe the company/division/carve-out business}}", "label": "Target description", "example": "Widget Manufacturing Inc."},
            {"key": "{{exact legal name of the third party}}", "label": "Third party name", "example": "ABC Advisors LLP"},
            {"key": "{{XYZ}}", "label": "Project code name", "example": "Atlas"},
        ]
    },
    "buyside_third_party_access": {
        "filename": "Buyside Third Party Access Letter_EN_23-May-2025.docx",
        "display_name": "Buyside Third Party Access Letter",
        "description": "Grants third-party access during buy-side due diligence",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Full legal name of Recipient}}", "label": "Recipient legal name", "example": "XYZ Capital Partners"},
            {"key": "{{Address line 1}}", "label": "Address line 1", "example": "456 Bay Street"},
            {"key": "{{Address line 2}}", "label": "Address line 2", "example": "Suite 100"},
            {"key": "{{Address line 3}}", "label": "City, Province, Postal Code", "example": "Toronto, ON M5H 2Y4"},
            {"key": "{{full legal name of client}}", "label": "Client legal name", "example": "Acme Corporation"},
            {"key": "{{Name of partner}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{Authorized signatory of third party recipient}}", "label": "Recipient signatory name and title", "example": "Robert Johnson, Managing Director"},
            {"key": "{{acquisition of/investment in}}", "label": "Transaction type (acquisition of / investment in)", "example": "acquisition of"},
            {"key": "{{describe the company/division/carve-out business}}", "label": "Target description", "example": "Widget Manufacturing Inc."},
            {"key": "{{exact legal name of the third party}}", "label": "Third party name", "example": "ABC Advisors LLP"},
            {"key": "{{XYZ}}", "label": "Project code name", "example": "Atlas"},
        ]
    },
    "sellside_factual_accuracy": {
        "filename": "Sellside Factual Accuracy Letter_EN_28-Oct-2024.docx",
        "display_name": "Sellside Factual Accuracy Letter",
        "description": "Client certification of accuracy of provided diligence information",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Address}}", "label": "Client address", "example": "123 Main Street, Toronto, ON M5V 1A1"},
            {"key": "{{Partner name}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{describe the subject of the sell-side diligence work}}", "label": "Subject of diligence work", "example": "the sale of Widget Manufacturing Inc."},
            {"key": "{{Other engagement specific representations made during the engagement;}}", "label": "Additional representations (optional, leave blank if none)", "example": ""},
            {"key": "{{TO BE PRINTED ON CLIENT'S LETTERHEAD}}", "label": "INSTRUCTION - DELETE THIS TEXT", "example": ""},
        ]
    }
}


def get_template_menu() -> str:
    """Generate numbered menu of available templates."""
    lines = ["Available templates:\n"]
    for i, (key, template) in enumerate(TEMPLATES.items(), 1):
        lines.append(f"{i}. {template['display_name']}")
        lines.append(f"   - {template['description']}\n")
    return "\n".join(lines)


def get_template_by_number(num: int) -> dict | None:
    """Get template by menu number (1-indexed)."""
    templates_list = list(TEMPLATES.values())
    if 1 <= num <= len(templates_list):
        return templates_list[num - 1]
    return None


def get_required_fields(template_key: str) -> list[dict]:
    """Get list of required variables for a template."""
    template = TEMPLATES.get(template_key)
    if template:
        return template["variables"]
    return []
