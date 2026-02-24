# KPMG Plugin Repurpose Audit

**Date:** February 24, 2026  
**Scope audited:** `knowledge-work-plugins-main` + `financial-services-plugins-main`  
**Coverage:** 144 skills across 26 plugin families (including partner-built packs)

## 1) Portfolio-level verdict (audit of all imported plugin families)

### Recommended for KPMG-branded internal release (high fit)
- `financial-services/private-equity`
- `financial-services/financial-analysis`
- `financial-services/investment-banking`
- `financial-services/partner-built/spglobal`
- `knowledge-work/data`
- `knowledge-work/enterprise-search`
- `knowledge-work/legal`
- `knowledge-work/operations`
- `knowledge-work/finance`
- `knowledge-work/cowork-plugin-management` (as the internal customization engine)

### Keep as secondary/adjacent modules (medium fit)
- `financial-services/equity-research`
- `financial-services/partner-built/lseg`
- `knowledge-work/productivity`
- `knowledge-work/product-management`
- `knowledge-work/engineering`
- `knowledge-work/customer-support`
- `knowledge-work/partner-built/slack`
- `knowledge-work/partner-built/brand-voice`

### Deprioritize for Deal Advisory / TS launch (low fit)
- `financial-services/wealth-management`
- `knowledge-work/sales`
- `knowledge-work/marketing`
- `knowledge-work/human-resources`
- `knowledge-work/design`
- `knowledge-work/bio-research`
- `knowledge-work/partner-built/apollo`
- `knowledge-work/partner-built/common-room`

---

## 2) Priority shortlist to repurpose under KPMG brand

## Wave 1: Core due diligence and deal execution

### A) `private-equity/dd-checklist`
- **How it currently works:** Scopes deal context (sector, deal type, complexity), then generates multi-workstream DD checklists with status states and red-flag tracking.
- **What it provides:** A structured diligence tracker with financial/commercial/legal/operational/HR/IT/ESG workstreams.
- **Value to KPMG DA/TS:** Standardizes kickoff and reduces missed-request risk across concurrent engagements.
- **KPMG customization for internal release:**
  - Map to KPMG TS request-list taxonomy (QoE, NWC, debt/debt-like, tax, carve-out, one-offs).
  - Add mandatory sign-off gates by manager/director/partner.
  - Add industry modules (software ARR quality, healthcare reimbursement, industrial capex/maintenance).

### B) `private-equity/dd-meeting-prep`
- **How it currently works:** Creates meeting-specific question packs (management, expert, customer calls), plus benchmark prompts and red-flag probes.
- **What it provides:** One-page prep briefs with objectives, must-ask questions, follow-up asks.
- **Value to KPMG DA/TS:** Improves management interview quality and issue surfacing speed.
- **KPMG customization for internal release:**
  - Build KPMG question banks by workstream and sector.
  - Add linkage to diligence hypotheses and prior data-room findings.
  - Add “evidence request after call” templates for TS teams.

### C) `private-equity/deal-screening`
- **How it currently works:** Extracts facts from CIM/teaser materials and applies pass/fail criteria with bull/bear case and key questions.
- **What it provides:** A one-page screening memo.
- **Value to KPMG DA/TS:** Faster intake triage and clearer go/no-go framing for staffing and timeline risk.
- **KPMG customization for internal release:**
  - Add KPMG intake fields: independence/conflicts, timeline pressure, expected scope complexity, data quality risk.
  - Add “TS readiness score” and escalation triggers.

### D) `investment-banking/datapack-builder`
- **How it currently works:** Ingests CIMs, filings, and connected data sources; normalizes to standardized multi-tab Excel packs with traceability expectations.
- **What it provides:** IC-ready data packs and normalized financial baselines.
- **Value to KPMG DA/TS:** Speeds data-room-to-analysis conversion and reduces manual reformatting effort.
- **KPMG customization for internal release:**
  - Replace default 8-tab structure with KPMG TS workbook standard.
  - Add dedicated tabs for QoE adjustments, NWC peg, debt-like items, and EBITDA bridge.
  - Enforce citation-at-cell level for auditability.

### E) `financial-analysis/check-model`
- **How it currently works:** Performs structural/integrity/logic checks on Excel models (hardcodes, formula drift, balance checks, circular refs) and outputs issue logs.
- **What it provides:** Severity-ranked model QA reports.
- **Value to KPMG DA/TS:** Lowers model risk before client-facing output.
- **KPMG customization for internal release:**
  - Add TS-specific checks: QoE bridge tie-outs, NWC roll-forward consistency, debt schedule cross-footing.
  - Add required reviewer attestations and release criteria.

### F) `private-equity/ic-memo`
- **How it currently works:** Assembles a structured memo from diligence findings, financial analysis, deal terms, returns, and risks.
- **What it provides:** Decision-ready narrative with tables and recommendation section.
- **Value to KPMG DA/TS:** Converts analytical outputs into clear partner/client decision artifacts.
- **KPMG customization for internal release:**
  - Retemplate for KPMG deliverables: findings memo, SPA adjustment memo, steering committee update.
  - Add standard KPMG disclaimers and review checkpoints.

### G) `private-equity/portfolio-monitoring`
- **How it currently works:** Ingests periodic financial packs, compares vs budget/prior, flags RAG status, summarizes trends.
- **What it provides:** Board-ready KPI/variance summaries.
- **Value to KPMG DA/TS:** Useful for post-deal monitoring and value-creation tracking support engagements.
- **KPMG customization for internal release:**
  - Add covenant monitoring and 13-week cash triggers.
  - Add integration KPI templates for post-close TSA/separation tracking.

### H) `private-equity/unit-economics`
- **How it currently works:** Analyzes ARR cohorts, retention, LTV/CAC, margin waterfall, and benchmark thresholds.
- **What it provides:** Revenue quality analysis workbook and risk flags.
- **Value to KPMG DA/TS:** High impact for software/recurring revenue diligence.
- **KPMG customization for internal release:**
  - Align metrics with KPMG revenue-quality framework.
  - Add customer-level anomaly checks and concentration heatmaps.

### I) `private-equity/returns-analysis`
- **How it currently works:** Builds IRR/MOIC base case, sensitivities, and bull/base/bear scenarios.
- **What it provides:** Returns bridge and sensitivity exhibits.
- **Value to KPMG DA/TS:** Connects diligence findings to valuation and downside protection discussions.
- **KPMG customization for internal release:**
  - Inject QoE/NWC/debt-like adjustment scenarios from TS findings.
  - Add downside case presets by sector and leverage profile.

### J) `investment-banking/deal-tracker`
- **How it currently works:** Tracks deal stages, milestones, action items, weekly review summaries.
- **What it provides:** Engagement process-control layer.
- **Value to KPMG DA/TS:** Better multi-deal execution discipline and fewer deadline misses.
- **KPMG customization for internal release:**
  - Map milestones to KPMG TS phase gates and review points.
  - Add PBC request aging and owner accountability views.

### K) `financial-analysis/comps-analysis`
- **How it currently works:** Builds institutional comps with operating stats, valuation multiples, and statistical benchmark rows.
- **What it provides:** Structured comps workbook.
- **Value to KPMG DA/TS:** Provides external valuation context to challenge assumptions.
- **KPMG customization for internal release:**
  - Predefine approved peer sets and metric packs by subsector.
  - Add audit trail standards and source reliability tags.

### L) `financial-analysis/3-statements`
- **How it currently works:** Completes integrated 3-statement templates while preserving formulas and validating linkages.
- **What it provides:** Completed IS/BS/CF model structures with checks.
- **Value to KPMG DA/TS:** Faster base model setup for deep-dive analyses.
- **KPMG customization for internal release:**
  - Embed KPMG model shell and formatting conventions.
  - Add mandatory tie-outs for working capital, cash, and debt movements.

## Wave 2: Cross-functional accelerators for diligence quality

### M) `partner-built/spglobal/tear-sheet`
- **How it currently works:** Pulls company data via S&P/Kensho MCP and generates structured one-page/two-page company profiles.
- **What it provides:** Fast target-company snapshots.
- **Value to KPMG DA/TS:** Speeds pre-kickoff contexting and market framing.
- **KPMG customization for internal release:**
  - Apply KPMG visual identity, template structure, and approved disclaimers.
  - Include “diligence implications” section by default.

### N) `enterprise-search/search-strategy` + `enterprise-search/knowledge-synthesis`
- **How it currently works:** Decomposes user questions into source-specific searches and then deduplicates/synthesizes results with source attribution/confidence.
- **What it provides:** Cross-tool retrieval + evidence-based synthesis.
- **Value to KPMG DA/TS:** Faster retrieval of precedent analyses, internal guidance, and engagement artifacts.
- **KPMG customization for internal release:**
  - Connect to KPMG M365/Teams/SharePoint and engagement repositories.
  - Add permission-aware, client-confidentiality-safe source filtering and privilege handling.

### O) `data/data-validation`
- **How it currently works:** Applies pre-delivery QA checklist across data quality, joins, denominator logic, reasonableness, and reproducibility.
- **What it provides:** Structured analysis QA gate.
- **Value to KPMG DA/TS:** Reduces risk of factual error in client deliverables.
- **KPMG customization for internal release:**
  - Add TS-specific tie-out checklist (source docs, sample tests, reviewer initials, issue log).
  - Add required “known limitations” statement blocks.

### P) `data/sql-queries`
- **How it currently works:** Provides dialect-specific SQL best practices and performance guidance.
- **What it provides:** Faster, cleaner extraction queries.
- **Value to KPMG DA/TS:** Speeds extraction from client ERP/data warehouse exports.
- **KPMG customization for internal release:**
  - Build reusable query library for SAP/Oracle/NetSuite/Workday-style schemas.
  - Add standardized QoE and working-capital extraction packs.

### Q) `legal/contract-review`
- **How it currently works:** Reviews contract clauses against a playbook, flags deviations, and suggests redlines with severity.
- **What it provides:** Clause risk assessment and negotiation priorities.
- **Value to KPMG DA/TS:** Strengthens legal DD and supports risk translation to financial impacts.
- **KPMG customization for internal release:**
  - Add KPMG legal-DD clause taxonomy and risk-impact mapping.
  - Add jurisdiction-specific fallback language sets.

### R) `legal/legal-risk-assessment`
- **How it currently works:** Uses severity x likelihood matrix, risk score bands, and escalation guidance.
- **What it provides:** Standardized legal risk register and memo format.
- **Value to KPMG DA/TS:** Consistent issue rating across teams and deals.
- **KPMG customization for internal release:**
  - Map risk levels to KPMG red/amber/green deliverable language.
  - Add estimated valuation/cash impact ranges per risk class.

### S) `operations/compliance-tracking`
- **How it currently works:** Tracks controls, evidence, gaps, and audit readiness across frameworks.
- **What it provides:** Compliance status and remediation planning.
- **Value to KPMG DA/TS:** Useful for diligence in regulated sectors and control-heavy targets.
- **KPMG customization for internal release:**
  - Add sector-specific regulatory modules (financial services, healthcare, payments, etc.).
  - Tie controls to DD request lists and evidence trackers.

### T) `finance/variance-analysis`
- **How it currently works:** Decomposes variances (price/volume/mix and other frameworks), builds waterfall narratives and materiality-driven commentary.
- **What it provides:** Driver-level performance explanations.
- **Value to KPMG DA/TS:** Supports QoE and management challenge sessions.
- **KPMG customization for internal release:**
  - Add standard QoE bridge templates and adjustment categories.
  - Add “management question prompts” linked to each variance driver.

---

## 3) Suggested internal release sequence

1. **Release 1 (first 6-8 weeks):** A-F + O  
   - Target outcome: standardized DD kickoff, model QA, data-pack creation, and memo outputs.
2. **Release 2 (next 6-8 weeks):** G-L + N  
   - Target outcome: end-to-end diligence execution and process control.
3. **Release 3 (next 6-8 weeks):** M + P + Q + R + S + T  
   - Target outcome: ecosystem integration, legal/compliance rigor, and broader analytical scale.

---

## 4) Practical customization principles for KPMG branding

- **Methodology first:** Replace generic playbooks with KPMG TS methodology, review gates, and output standards.
- **Risk + auditability:** Require source attribution, reviewer checkpoints, and confidence flags in every client-facing output.
- **Template discipline:** Standardize output formats (Excel/Word/PPT) to KPMG visual and content standards.
- **Connector governance:** Enforce client-segregated data access, permission boundaries, and confidentiality controls.
- **Change control:** Version every customized skill and log change rationale for quality/compliance review.
