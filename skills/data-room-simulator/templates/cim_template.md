# Confidential Information Memorandum

**{{company.name}}**

*{{company.industry_display}}*

---

**Prepared by:** {{company.name}} Management Team
**Date:** {{generated_date}}

---

## CONFIDENTIALITY NOTICE

This Confidential Information Memorandum ("CIM") has been prepared by {{company.name}} ("Company") for the exclusive use of prospective acquirers in connection with their evaluation of a potential acquisition of the Company. The information contained herein is confidential and proprietary.

---

## 1. EXECUTIVE SUMMARY

### Investment Highlights

{{company.name}} is a leading {{company.vertical}} company headquartered in {{company.headquarters.city}}, {{company.headquarters.state}}. Founded in {{company.founded}}, the Company has built a strong reputation for [value proposition].

**Key Investment Highlights:**

- **Market Position:** {{story.market_position}}
- **Revenue Scale:** ${{financials.annual_revenue | format_number}} in annual revenue
- **Profitability:** {{financials.gross_margin | format_percent}} gross margin
- **Team:** {{financials.headcount}} employees led by experienced management

### Transaction Overview

{{story.why_selling}}

---

## 2. COMPANY OVERVIEW

### History & Background

{{story.founding_narrative}}

### Key Milestones

{% for milestone in story.milestones %}
- **{{milestone.year}}:** {{milestone.title}} — {{milestone.description}}
{% endfor %}

### Headquarters

{{company.headquarters.address}}
{{company.headquarters.city}}, {{company.headquarters.state}} {{company.headquarters.zip_code}}

---

## 3. PRODUCTS & SERVICES

### Overview

[Describe core products/services based on industry]

{% if industry == "saas" %}
The Company offers a cloud-based {{company.vertical}} platform with multiple pricing tiers designed to serve customers from small businesses to enterprise organizations.
{% elif industry == "construction" %}
The Company specializes in {{company.vertical}}, delivering projects across commercial, industrial, and infrastructure sectors.
{% elif industry == "manufacturing" %}
The Company manufactures a diversified portfolio of {{company.vertical}} products serving multiple end markets.
{% elif industry == "professional_services" %}
The Company provides {{company.vertical}} services to mid-market and enterprise clients across multiple industries.
{% elif industry == "retail" %}
The Company operates {{operations.store_count}} retail locations specializing in {{company.vertical}}.
{% endif %}

---

## 4. MARKET OPPORTUNITY

### Industry Overview

[Describe the market size and trends for {{company.vertical}}]

### Competitive Landscape

The Company competes on the basis of:
- Quality of products/services
- Customer relationships
- Technical expertise
- Reputation and track record

### Growth Drivers

- Market expansion
- New product/service offerings
- Geographic expansion
- Operational improvements

---

## 5. FINANCIAL SUMMARY

### Historical Performance

| Metric | Year -2 | Year -1 | Current Year |
|--------|---------|---------|--------------|
| Revenue | $X.XM | $X.XM | ${{financials.annual_revenue | format_millions}}M |
| Gross Profit | $X.XM | $X.XM | TBD |
| Gross Margin | XX% | XX% | {{financials.gross_margin | format_percent}} |
| EBITDA | $X.XM | $X.XM | TBD |

### Revenue Composition

[Break down revenue by product/service line, customer segment, or geography]

### Profitability

The Company has demonstrated consistent profitability with:
- Gross margins of {{financials.gross_margin | format_percent}}
- [Operating margin data]
- [EBITDA margin data]

---

## 6. MANAGEMENT TEAM

### Leadership

{% for exec in management %}
**{{exec.name}}** — *{{exec.title}}*
{{exec.background}}. {{exec.years_at_company}} years with the Company.

{% endfor %}

### Organizational Structure

The Company is organized into the following functional areas:
- [Department breakdown from profile]

---

## 7. CUSTOMERS

### Customer Overview

{% if industry == "saas" %}
The Company serves approximately {{operations.customer_count}} customers across multiple industries.
{% elif industry == "construction" %}
The Company maintains relationships with leading developers, general contractors, and property owners.
{% elif industry == "manufacturing" %}
The Company serves approximately {{operations.customer_count}} customers including distributors, OEMs, and end users.
{% elif industry == "professional_services" %}
The Company maintains approximately {{operations.client_count}} active client relationships.
{% elif industry == "retail" %}
The Company serves consumers through {{operations.store_count}} retail locations.
{% endif %}

### Customer Concentration

[Top 10 customer concentration data]

### Customer Retention

[Retention/churn metrics]

---

## 8. OPERATIONS

### Facilities

- Headquarters: {{company.headquarters.city}}, {{company.headquarters.state}}
- [Additional locations if applicable]

### Employees

The Company employs {{financials.headcount}} people across the following functions:
- [Department headcount breakdown]

### Technology & Systems

[Key systems and technology infrastructure]

---

## 9. TRANSACTION CONSIDERATIONS

### Transaction Rationale

{{story.why_selling}}

### Due Diligence Materials

A comprehensive data room has been prepared including:
- Historical financial statements (3-5 years)
- Trial balance and supporting schedules
- Customer/project detail
- Employee census and payroll data
- Contracts and agreements

### Process & Timeline

[Outline next steps]

---

## APPENDIX

### Data Room Index

- Financial Statements
- Supporting Schedules
- Customer/Operations Data
- HR Data
- Legal Documents

---

*This CIM template should be populated with data from company_seed.json and financial outputs.*
