---
name: dataset-simulator
description: >
  Generates diverse, realistic synthetic datasets for evaluating AI pipelines,
  training analysts, or stress-testing tools. Specializes in M&A data rooms
  (complete VDR packages with cross-document consistency) but handles any
  domain where structured synthetic data is needed. Use when the user asks to
  generate synthetic data, create test datasets, simulate a data room, build
  eval inputs, or produce realistic sample data for any domain. Do not use
  when analyzing real data, when 100+ representative real traces already exist
  (use stratified sampling instead), or when collecting production logs.
---

# Dataset Simulator

Generate diverse, realistic synthetic datasets. Primary specialization: complete M&A data rooms with cross-document financial consistency. General capability: dimension-based synthetic data for any domain.

## Reference Files

| File | When to read |
|---|---|
| [references/profile-schema.md](references/profile-schema.md) | M&A data room mode. Defines the v2 profile schema, document triggers, and how to generate profiles for new industries. |
| [references/taxonomy.md](references/taxonomy.md) | M&A data room mode. The 12-domain data room taxonomy. |
| [references/irl-template.md](references/irl-template.md) | M&A data room verification. The completeness checklist. |
| [references/industry-framework.md](references/industry-framework.md) | M&A data room mode, new industry. Axes of variation and document trigger rules. |
| [references/realism-guide.md](references/realism-guide.md) | M&A data room mode. Per-document realism markers. |
| [references/consistency-rules.md](references/consistency-rules.md) | M&A data room verification. Cross-document tie rules with tolerances. |

## Mode Selection

Determine the generation mode from the user's request:

**M&A Data Room** — user mentions data room, due diligence, VDR, QoE, M&A documents, or financial simulation for a fictitious company. Use the full data room pipeline (Phases DR-1 through DR-8 below).

**General Synthetic Dataset** — user needs eval data, test inputs, training samples, or structured synthetic data for any non-data-room domain. Use the dimension-based pipeline (Phases SD-1 through SD-6 below).

If unclear, ask the user which mode fits their need.

---

## General Synthetic Dataset Pipeline

Use this for any domain: LLM eval inputs, API test data, customer service scenarios, product catalogs, user profiles, medical records structure, legal case summaries, or any structured dataset.

### SD-1 — Define dimensions

Dimensions are axes of variation targeting where the downstream system is likely to fail. Identify failure-prone areas first, then choose dimensions that cover them.

Define 3-5 dimensions:
```
Dimension 1: [Name] — [What it captures]
  Values: [value_a, value_b, value_c, ...]

Dimension 2: [Name] — [What it captures]
  Values: [value_a, value_b, value_c, ...]

Dimension 3: [Name] — [What it captures]
  Values: [value_a, value_b, value_c, ...]
```

Start with 3 dimensions. Add more only if initial outputs reveal failure patterns along new axes.

Dimensions must target anticipated failures, not arbitrary variation. Ask the user about known failure-prone areas, review existing feedback, or form hypotheses.

### SD-2 — Draft tuples with the user

A tuple is one combination of dimension values defining a specific data point. Present 20 draft tuples and iterate until the user confirms they reflect realistic scenarios. The user's domain knowledge is essential — they know which combinations actually occur and which are unrealistic.

```
(Dimension1: value_a, Dimension2: value_x, Dimension3: value_m)
(Dimension1: value_b, Dimension2: value_y, Dimension3: value_n)
...
```

### SD-3 — Generate additional tuples

Generate 30-80 more tuples using the confirmed tuples as calibration. Vary across all dimensions. Avoid duplicates. Target total: 50-100 tuples for dataset saturation.

### SD-4 — Convert tuples to realistic artifacts

For each tuple, generate the actual data artifact. The artifact type depends on the domain:
- **Text inputs**: natural language queries, prompts, messages, documents
- **Structured data**: JSON records, CSV rows, database entries
- **Documents**: contracts, reports, filings, policies
- **Composite**: multi-file packages combining several artifact types

Generate each artifact in a separate step from tuple creation. Single-step generation (tuples + artifacts together) produces repetitive output.

For each artifact, the tuple's dimension values constrain the content but do not appear literally — the artifact should read as natural, not as a filled template.

### SD-5 — Filter for quality

Review generated artifacts. Discard and regenerate when:
- Content doesn't match the tuple's intent
- Artifacts are too similar to each other
- Phrasing, structure, or values are unrealistic for the domain
- The artifact would not stress-test the target system

For large sets: use an LLM to rate realism on a 1-5 scale, discard below 3, regenerate replacements.

### SD-6 — Deliver

Write the dataset to the output directory:
```
<output_dir>/
├── data/              — generated artifacts (one file per tuple or batched)
├── dimensions.json    — dimension definitions and values
├── tuples.json        — all tuples with IDs
└── manifest.json      — file hashes and metadata
```

Target: ~100 high-quality, diverse artifacts. This is a rough heuristic for reaching saturation (where new items stop revealing new failure categories).

---

## M&A Data Room Pipeline

Use this for generating complete, section-numbered M&A data rooms. Output is indistinguishable from a real middle-market VDR at the junior-analyst level.

### DR-1 — Gather requirements

Ask for:
- **Industry and subvertical**: any industry. Pre-built profiles exist for saas, construction, manufacturing, professional_services, retail, dental. For any other industry, generate a profile on-the-fly.
- **Company size**: `small` ($5-20M), `mid` ($20-100M), `large` ($100-500M)
- **Realism mode**: `clean` (no issues), `realistic` (QoE adjustments and typical findings), `messy` (intentional errors, red flags, and missing items)
- **Period**: fiscal years to cover. Default: 3 calendar years ending December of the prior year.
- **Company name** (optional): if not provided, generate one.

Confirm parameters with the user before proceeding.

### DR-2 — Resolve or generate profile

If the industry matches a pre-built profile in `references/profiles/`, load it.

If no pre-built profile exists:
1. Read `references/profile-schema.md` for the schema.
2. Read `references/industry-framework.md` for the axes of variation and document trigger rules.
3. Generate a complete profile JSON matching the v2 schema. Use the pre-built profiles as calibration.
4. Write it to `references/profiles/<industry>.json`.
5. Validate it parses correctly.

### DR-3 — Generate deal state

```bash
python3 scripts/generate_deal_state.py \
  --profile references/profiles/<industry>.json \
  --size <size> --realism-mode <mode> \
  --start-period <YYYY-MM> --end-period <YYYY-MM> \
  --output-dir <output_dir> [--name <company_name>]
```

Creates `deal_state.json` — the single source of truth for all downstream generation.

### DR-4 — Generate quantitative artifacts

Run each generator. Every script reads `deal_state.json` and writes to section-numbered output folders.

```bash
# Universal generators
python3 scripts/generate_corporate.py --output-dir <output_dir>
python3 scripts/generate_financials.py --output-dir <output_dir>
python3 scripts/generate_commercial.py --output-dir <output_dir>
python3 scripts/generate_hr_data.py --output-dir <output_dir>
python3 scripts/generate_tax.py --output-dir <output_dir>
python3 scripts/generate_insurance.py --output-dir <output_dir>
python3 scripts/generate_real_estate.py --output-dir <output_dir>
python3 scripts/generate_technology.py --output-dir <output_dir>
python3 scripts/generate_regulatory.py --output-dir <output_dir>

# Overlay-driven (based on document_triggers in deal_state.json)
python3 scripts/generate_operations.py --output-dir <output_dir>
```

Or use the orchestrator for end-to-end generation:
```bash
python3 scripts/run_data_room.py \
  --profile references/profiles/<industry>.json \
  --size <size> --realism-mode <mode> \
  --start-period <YYYY-MM> --end-period <YYYY-MM>
```

### DR-5 — Generate qualitative artifacts

For each narrative, legal, and compliance document:
1. Read `references/realism-guide.md` for the document type.
2. Extract the fact pack from `deal_state.json`.
3. Generate the document matching realism markers. No placeholder text.
4. Write to the correct section-numbered folder.

For lease PDFs:
```bash
python3 scripts/generate_leases.py --output-dir <output_dir>
```

### DR-6 — Verify, fix, re-verify

```bash
python3 scripts/verify_data_room.py --output-dir <output_dir>
```

6-layer verification: completeness, placeholder, identity/date, accounting/subledger, realism-range, narrative/legal. If verification fails, fix the responsible generator, re-verify. Max 3 cycles.

### DR-7 — Deliver

Complete when `verification_report.json` shows `status: pass` on all 6 layers and all IRL sections have corresponding artifacts.

## Sampling Real Data

When real data is available, don't sample randomly. Use stratified sampling:
1. Identify high-variance dimensions in existing data.
2. Assign labels — manually for small sets, K-means on embeddings for large sets.
3. Sample from each group to ensure coverage, not just common cases.
4. Use synthetic data to fill gaps in underrepresented groups.

## Gotchas

- Component ordering: always regenerate operations and HR after regenerating financials — stale subledgers pass verification but produce inconsistent cross-document ties.
- Narrative consistency: every name, number, date, site, and executive in narrative documents must come from deal_state.json. Do not invent facts outside the deal state.
- Verification tolerances: payroll uses 5%, aging 1%, revenue 0.1%. A "pass" at 4.8% payroll drift is tolerance-acceptable but may indicate a real problem.
- Overlay completeness: document triggers in the profile determine which overlay files are generated. If a trigger is missing, the files will not be generated and verification will not flag their absence.
- On-the-fly profiles: validate KPI ranges and COA percentages against publicly available benchmarks. Implausible ranges produce implausible data rooms.
- Dimension selection: dimensions that don't target failure-prone regions waste test budget. Always tie dimensions to anticipated failures or known coverage gaps.
- Single-step generation: generating tuples and artifacts in one prompt produces less diverse results than the two-step separation.

## Anti-Patterns

- Generating narrative content without reading the deal state first
- Hardcoding industry-specific logic in scripts — use document triggers from the profile
- Generating a data room without verifying — verification catches 90% of realism failures
- Treating the pre-built profiles as the only supported industries
- Unstructured generation — prompting "give me test data" without dimension/tuple structure produces generic, repetitive, happy-path examples
- Synthetic data when no one can judge realism — if no domain expert can validate, use real data instead
- Synthetic data for complex domain-specific content (legal filings, medical records) where LLMs miss structural nuance — use the script pipeline for structural fidelity, agent for prose only
- Skipping user review of dimensions/tuples — the user's domain knowledge is essential for judging which combinations are realistic
