---
name: fdd-researcher
description: Prepare financial due diligence kickoff briefs by combining CIM/VDD/financial statement review with industry module guidance and web research. Use when users ask for FDD pre-engagement research, deal onboarding briefs, QoE hypothesis setting, industry benchmarking, diligence playbooks, or prioritized data request lists.
---

# FDD Researcher

## Overview

Produce an FDD kickoff brief for deal teams by combining uploaded deal documents with targeted industry and company web research. Ground conclusions in sources, surface diligence risks early, and generate a practical data request list.

## Workflow

1. Run intake confirmation.
- Infer and confirm target, industry, geography, and as-of date.
- Pause until the user confirms all fields.
2. Propose a research plan and wait for approval.
- Draft output sections and 3-6 research tracks.
- Wait for a clear "go" before browsing.
3. Load core references and deal materials.
- Load `references/report-structure.md`.
- Load `references/industry-index.md` and then the selected industry module.
- Extract FDD-critical facts from CIM/VDD/financial statements and mark missing items.
4. Execute web research to close fact gaps.
- Use source priority: filings/regulatory sources, target website, industry publications, business press.
- Search any unclear concept, KPI, accounting term, or benchmark.
5. Write the final brief using the required structure.
- Include: Company Overview, Industry Context, Financial Summary, Key Findings, Diligence Playbook, Data Requests, Sources.
- Include Accounting Policies when industry or target facts make it material.
6. Enforce output constraints.
- Start directly with the brief header and sections.
- Exclude intake notes, planning text, and process narration.
- Attribute each claim to documents, citations, or "Not disclosed."
- Never invent facts.

## Industry Module Selection

Use `references/industry-index.md` to map signals to a module:
- `references/saas.md`
- `references/banking-lending.md`
- `references/insurance.md`
- `references/transportation-logistics.md`
- `references/real-estate-construction.md`
- `references/business-services.md`
- `references/healthcare-services.md`
- `references/retail-consumer.md`
- `references/industrial-manufacturing.md`
- `references/asset-management.md`

If no module fits perfectly, use the closest module and supplement with generic KPIs: growth, margins, concentration, working capital, and capex intensity.

## Quality Gate

Before finalizing, verify:
- All required sections are present.
- Industry Context is benchmarked and detailed.
- Financial Summary includes multi-period analysis when available.
- Key Findings include diligence implications.
- Data Requests are prioritized and specific.
- All assertions are sourced or explicitly marked as unknown.

## References

- `references/fdd-researcher.md` for the master process and writing rules.
- `references/report-structure.md` for section-level composition standards.
- `references/industry-index.md` for module selection.
- Industry modules in `references/*.md` for KPI definitions, value driver trees, red flags, and data requests.
