# Company Overview

## {{company.name}}

---

## Our Story

{{story.founding_narrative}}

For {{story.years_in_business}} years, we have been dedicated to serving our customers with excellence in {{company.vertical}}.

---

## Mission & Vision

**Mission:** [To be generated based on industry and vertical]

**Vision:** [To be generated based on company story]

---

## Key Milestones

{% for milestone in story.milestones %}
### {{milestone.year}}: {{milestone.title}}
{{milestone.description}}

{% endfor %}

---

## Market Position

{{story.market_position}}

---

## Our Values

- **Excellence:** Commitment to quality in everything we do
- **Integrity:** Honest and transparent business practices
- **Innovation:** Continuously improving our offerings
- **Customer Focus:** Putting our customers first
- **Teamwork:** Collaborative approach to problem-solving

---

## Leadership Team

{% for exec in management %}
### {{exec.name}}
**{{exec.title}}**

{{exec.background}}

{{exec.years_at_company}} years with {{company.name}}.

{% endfor %}

---

## By the Numbers

| Metric | Value |
|--------|-------|
| Founded | {{company.founded}} |
| Employees | {{financials.headcount}} |
| Annual Revenue | ${{financials.annual_revenue | format_number}} |
| Headquarters | {{company.headquarters.city}}, {{company.headquarters.state}} |

---

## Locations

**Corporate Headquarters**
{{company.headquarters.address}}
{{company.headquarters.city}}, {{company.headquarters.state}} {{company.headquarters.zip_code}}

---

*This template should be populated with data from company_seed.json*
