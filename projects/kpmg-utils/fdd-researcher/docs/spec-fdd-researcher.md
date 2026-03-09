---
id: fdd-researcher
title: "FDD Researcher (Pre-Data-Room Kickoff Brief)"
doc: spec
---

# Feature: FDD Researcher — Pre-data-room kickoff brief for FDD teams

## TL;DR
- **Problem:** At deal kickoff (pre–data room), associates have limited materials (e.g., CIM/VDD report, a few memos, maybe financials) and often lack industry context, causing slow ramp, missed early red flags, and weak first‑pass data requests / mgmt interview prep.
- **Solution:**
  - A **prompt-first Custom GPT** that mirrors ChatGPT “Deep Research” style:
    1) quick file pass
    2) collect a fixed set of required setup fields via **clarifying questions** (keep asking until complete)
    3) present a **concise setup summary + the brief outline/template + a Research Question Path**
    4) user says **“go”** → execute web research (cited) and finalize the kickoff brief
  - Start from a standard kickoff template, then **tune it to the chosen industry** so generalist associates get the right “units that matter” (e.g., healthcare census, construction WIP/backlog, SaaS ARR/NRR).

## What We're Building

A standalone **ChatGPT Custom GPT** (“FDD Researcher”) optimized for the first 24–72 hours of a Financial Due Diligence engagement **before the data room opens**.

Inputs:
- User-provided kickoff materials (SIM/VDD report, prior diligence, teasers, limited financial statements, etc.).
- User-entered setup fields (research target; optional preferences).

Primary output: a single **Kickoff Brief** template that can be delivered in two phases:
1) **Kickoff Brief — Plan/Preview**: doc-grounded extraction + unknowns/red flags + clarifying questions + **outline/template preview + Research Question Path** (no browsing).
2) **Kickoff Brief — Final**: same template, updated with **Web Findings** (cited) and an updated diligence playbook.

The Kickoff Brief must clearly label which claims are:
- **Document-grounded** (from user files; no external citations)
- **Web-derived** (external; cited)

Non-goals (v1):
- Replacing the full FDD model / QoE workbook.
- Full data-room analytics (this is a kickoff accelerator, not the full engagement engine).

## User Stories

### User Story 1 — Kickoff brief from sparse inputs
- As an **FDD associate**, I want to upload the initial deal materials and receive a structured kickoff brief so I can start the deal with confidence.

### User Story 2 — Industry context for generalists
- As a **generalist associate**, I want the brief to tell me the unit economics, KPIs, and “how this industry works” so I don’t miss basic diligence angles.

### User Story 3 — Better first data request + mgmt interview prep
- As an **FDD team**, I want the assistant to convert unknowns and red flags into prioritized data requests and mgmt interview questions so we can move fast on day 1.

### User Story 4 — Traceability and defensibility
- As a **manager/reviewer**, I want every company-specific factual claim to be traceable to a provided file, and every external claim to be traceable to web citations, so the output is reviewable and usable.

### User Story 5 — Value Driver Diagram generation
- As an **FDD associate**, I want the tool to automatically generate a value driver tree diagram in PowerPoint format so I can use it immediately in proposals, client discussions, and reports without manual diagram creation.

## Requirements

### Input + setup
- [ ] Accept multiple uploaded files (PDF/DOCX/PPTX/XLSX/CSV and text).
- [ ] Start by enumerating files and building a **Doc Registry**: a short table listing each uploaded document and what it is (doc type, period covered, what it contains, and where key facts live).
- [ ] Collect a fixed set of **required setup fields** via clarifying questions (keep asking until complete).
- [ ] Ask clarifying questions in small batches (2–4 at a time) and keep them targeted to filling missing required fields (not “nice to have”).

#### Required setup fields (must be known before “go”)
- [ ] Research target: company legal name (and ticker / website if known)
- [ ] Industry: required; infer from docs when possible; if confidence is low, ask a clarifying question; include the inferred industry in the setup summary so the user can edit before “go”
- [ ] Geography: where the company primarily operates
- [ ] As-of date / time window: “as of” date for the brief (and preferred lookback window, e.g., 18–24 months)

#### Optional user inputs (preferences)
- [ ] Additional topics to include (additive only; defaults come from the template/industry module)

### Output structure (must be rigid + scan-friendly)
- [ ] Produce a single combined **Kickoff Brief** with consistent headings across Turn 1 and Turn 2:
  - **Doc Registry**
  - **Document Extraction (doc-grounded)**
  - **Unknowns / Red Flags**
  - **Research Question Path (plan for web research)**
  - **Web Findings (cited; Turn 2)**
  - **Diligence Playbook**
  - **Data Requests (P1/P2) + Mgmt Questions**
- [ ] Document Extraction must be grounded in provided files only; unknown facts must be written as `Unknown` (never invented).
- [ ] Include an **Evidence Log** for provided docs (doc → metric/claim → page/section/table anchor when available).
- [ ] Include a **References** section for web sources; use numeric citations at end-of-paragraph (no citations inside tables).
- [ ] Optional: support `Export JSON` to output a structured context object for power users (default off).

### Doc Registry (recommended)
- [ ] Include a lightweight **Doc Registry** near the top of the output to make the input set auditable and reduce missed-context errors.
- [ ] Keep it short: one row per file, with only the fields needed to orient the user and power the Evidence Log:
  - filename
  - doc type (e.g., SIM, VDD report, CIM, financial statements, memo)
  - period(s) covered / as-of date (if available)
  - “what to pull” (2–4 keywords, e.g., revenue bridge, customer concentration, KPI table, accounting policies)

### Web research behavior (hybrid search)
- [ ] Default interaction: **Plan → user confirms (“go”) → execute**.
  - Plan/Preview:
    - keep asking clarifying questions (in small batches) **until required setup fields are complete**
    - then present a **very concise setup summary** (bullets) containing only the required setup fields (plus any high-impact assumptions), and explicitly invite edits
    - then present:
      - the brief outline + template preview (what sections will exist and what will be filled from docs vs web)
      - a **Research Question Path** + proposed search plan (6–12 queries grouped by objective)
  - Final: after user says “go”, run web research and merge findings back into the Kickoff Brief.
- [ ] Prioritize authoritative sources: filings/regulators/standards first; then reputable industry research; avoid low-quality blogs.
- [ ] When sources conflict, state the conflict and pick the more authoritative/recent (or mark unresolved with confidence).

### Industry templates (“modules”)
- [ ] Define a single **core Kickoff Brief template** (industry-agnostic), plus **industry modules** that *modify/extend* specific sections:
  - KPI definitions and “units that matter”
  - Benchmark ranges (cited)
  - Common revenue recognition / accounting topics
  - Working-capital mechanics
  - Common red flags + “first 10 questions”
- [ ] Industry is never “unclear” in execution:
  - The assistant should attempt to infer industry from docs first (business description, customer type, revenue model).
  - If confidence is low: ask a clarifying question to resolve it, then proceed with a single inferred industry choice.
  - Always show the inferred industry in the setup summary; user can correct it there before “go”.
  - Do not accept “go” until industry has a concrete value in the setup summary.

### Quality gates
- [ ] Clearly label assumptions and confidence.
- [ ] Keep the output "associate-usable": bullet-first, dense, tables where helpful, minimal fluff.

### Value Driver Diagram (PowerPoint Export)
- [ ] Generate a **Value Driver Tree** diagram in PowerPoint (.pptx) format based on the identified industry and extracted business model.
- [ ] The diagram should include three separate slides/trees:
  1. **EBITDA Value Driver Tree** — Revenue decomposition (volume × price, gross-to-net bridge, mix effects) and cost structure (COGS breakdown, OpEx by category)
  2. **Working Capital Value Driver Tree** — Receivables (DSO drivers), Inventory (DIO drivers, if applicable), Payables (DPO drivers), and other WC items
  3. **Capex Value Driver Tree** — Growth capex, Maintenance capex, Technology/Digital capex
- [ ] Each tree node should show:
  - The driver name
  - Whether it's a key value driver (highlighted)
  - Value creation opportunity indicators (where applicable)
- [ ] The diagram should be formatted consistently using a hierarchical tree layout (parent → children branching)
- [ ] Include a legend identifying: key drivers, risk focus areas, and value creation opportunities
- [ ] Support two output modes:
  - **Industry-generic template:** A starter template based on the industry module (before doc extraction)
  - **Deal-specific populated:** Filled with actual metrics/drivers extracted from deal documents (after Document extraction)
- [ ] The PowerPoint should be immediately usable in:
  - Proposals (showing sector understanding)
  - Client discussions (scoping conversations)
  - Reports (diligence findings presentation)
- [ ] Use Python (python-pptx or similar) to generate the PowerPoint file programmatically

#### Value Driver Tree Structure (per industry module)
Each industry module should define:
- [ ] **Revenue driver hierarchy:** How revenue decomposes for this industry (e.g., Retail: # stores × revenue per store → transactions × avg ticket)
- [ ] **Cost driver hierarchy:** Major cost categories and their sub-drivers (e.g., store costs vs. corporate costs vs. manufacturing)
- [ ] **Working capital specifics:** Which WC components matter most and their drivers
- [ ] **Capex categories:** Growth vs. maintenance split relevant to the industry
- [ ] **Key driver indicators:** Which 3-5 drivers are most critical for this industry
- [ ] **Value creation levers:** Standard value creation opportunities to highlight on the tree

## How It Works

1) **Intake**
   - Enumerate uploaded files → Doc Registry.
   - Extract baseline context (company, sector guess, geo, FY end, accounting basis, periods).

2) **Doc-grounded extraction (Document Extraction)**
   - Populate a structured context pack (schema TBD; `chatgpt/fdd-researcher/context-schema.json` is a reference, not a hard contract).
   - Generate Unknowns + Red Flags, each tied to a Data Request or Mgmt Question.
   - Produce an Evidence Log for all extracted numbers/claims.
   - Draft a **Research Question Path**: 3–6 research tracks, prioritized, mapping back to Unknowns/Red Flags.

3) **Plan/Preview step (Deep Research style)**
   - Ask clarifying questions until the **required setup fields** are filled (especially industry + target).
   - Present:
     - a concise **setup summary** (bullets) and a clear “edit protocol” (e.g., “Reply with corrections or say ‘go’”)
     - the **Kickoff Brief outline + template preview**
     - the **Research Question Path** (tracks + proposed queries/sources)
   - Wait for user confirmation: **“go”** (or edits, then “go”).

4) **Web-enrichment (after “go”)**
   - Select the confirmed industry module.
   - Build a short search plan from the unknowns + the industry module’s “must-know” areas.
   - Run web research to add benchmarks, norms, and industry mechanics; cite sources.

5) **Assemble the Kickoff Brief**
   - Executive Summary (what matters, why it matters, immediate actions).
   - Business model + revenue durability by stream.
   - Margin drivers + unit economics.
   - Working capital mechanics + key sensitivities.
   - Accounting policy watch-outs.
   - Diligence playbook: what to request, what to test, what to ask in mgmt interview.

6) **Generate Value Driver Diagram (PowerPoint)**
   - After "go" (or on explicit user request), generate a downloadable .pptx file containing:
     - EBITDA value driver tree (revenue + cost decomposition)
     - Working capital value driver tree
     - Capex value driver tree
   - Populate with industry-specific structure from the selected module.
   - If deal documents provided sufficient detail, populate key metrics/values.
   - Highlight key drivers, risk areas, and value creation opportunities.
   - Offer as downloadable file for immediate use in proposals/reports.

## Acceptance Criteria

- Given 2–6 kickoff documents, when the user asks for an “FDD Kickoff Brief”, then the assistant (a) does a file pass, (b) asks clarifying questions until required setup fields are filled, and (c) produces an outline/template preview + Research Question Path (no browsing).
- Given the user says “go”, when proceeding, then the assistant produces a **Final** kickoff brief that adds web findings with citations and updates the playbook/requests accordingly.
- Given missing company-specific facts in the provided files, when generating the File Pass, then the assistant writes `Unknown` and converts each missing item into a Data Request or Mgmt Question.
- Given any company-specific numeric claim in the Document Extraction, when reviewing the output, then the Evidence Log contains a pointer to the supporting file and location (best-available anchor).
- Given web-enriched benchmark claims, when reviewing the Research Brief, then each paragraph with external facts includes a numeric citation at the end (and no citations appear inside tables).
- Given the documents do not support a confident industry inference, when preparing to proceed to "go", then the assistant asks a clarifying question to resolve the industry and does not browse until industry is confirmed.
- Given a confirmed industry module and user request for a value driver diagram, when generating the PowerPoint, then the assistant produces a .pptx file with three slides (EBITDA tree, Working Capital tree, Capex tree) using the industry-specific driver hierarchy from the module.
- Given deal documents with extractable metrics, when generating a deal-specific value driver diagram, then the assistant populates the tree nodes with actual values where available and marks unknown drivers clearly.

## Context

- Related files:
  - `chatgpt/fdd-researcher/context-schema.json` (reference schema; subject to change)
  - `chatgpt/fdd-researcher/day-zero-research.md` (example prompt content; not a hard requirement)
  - `chatgpt/fdd-researcher/deep-research-template.md` (example downstream research template; not a hard requirement)
  - `chatgpt/fdd-researcher/qa-tests.md` (example acceptance checks; can be revised)
  - `chatgpt/fdd-researcher/examples/` (example fixtures; illustrative only)
- Constraints:
  - Runs as a prompt-first Custom GPT inside ChatGPT (no custom backend in v1).
  - Must be useful with sparse, pre–data room inputs.
  - Must separate document-grounded claims from web-derived claims.
- References:
  - Spec template: `tools/spec.md`

## Open Questions (to finalize v1)

- What are the mandatory headings inside the Kickoff Brief (and which can be optional/conditional by industry)?
- What is the target length for Turn 1 and Turn 2 outputs (e.g., 2–3 pages vs 6–10 pages)?
- Which industries should be the first modules (v1), and what "units that matter" are non-negotiable for each?
- Should Value Driver Diagram generation be automatic (always included after "go") or on-demand (user must request it)?
- What PowerPoint template/branding should be used for Value Driver Diagrams?

## Resolved Questions

- **Which industries should be prioritized for v1 modules?** Based on revenue analysis:
  1. Retail (Consumer & Retail)
  2. Technology/SaaS (TMT)
  3. Healthcare (IGH)
  4. Industrial Manufacturing (IM)
  5. Banking (FS)
  6. Insurance (FS)
  7. Asset Management (PC)
  8. Private Equity Portfolio Companies (PC)
  9. Transportation/Logistics (IGH)
  10. Real Estate/Building (RE)

Got it. I’ve updated the plan to include flexible brief structures with modular headings and guidance, allowing users to choose between a short company brief or a full FDD brief.


## 1) Move from “strict templates” to a Heading Library + Heading Sets

The cleanest way to support *both* “very short company brief” and “full kickoff brief” without building a dozen rigid templates is to treat every section as a reusable **Heading Card** (a modular block), then ship a few curated **Heading Sets** (presets) that assemble those cards.

### What other briefs would be useful (beyond the Kickoff Brief)?

Below are brief types that FDD teams commonly want in the first 24–72 hours, each mapped to a Heading Set. These are all compatible with your “Plan → say go → web research” flow.

| Heading Set (Preset)                 | What it’s for                                                                                             | Typical output | Browsing needed?          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------------: | ------------------------- |
| **Company Snapshot**                 | 10–15 minutes to orient a new associate who just joined the deal.                                         |    ~0.5–1 page | Optional (often “no”)     |
| **Company Brief**                    | A clean, copy/paste company overview for internal kickoff decks or IC primers.                            |     ~1–2 pages | Usually “yes” for context |
| **FDD Kickoff Brief (Standard)**     | Default pre–data-room deliverable: facts from docs + unknowns → first data request + mgmt interview prep. |     ~3–5 pages | Yes (after “go”)          |
| **Full FDD Hypothesis Brief**        | A bigger “workplan memo” when you want a more complete diligence roadmap before the room opens.           |    ~6–10 pages | Yes (after “go”)          |
| **Data Request Pack**                | A tight, prioritized request list you can drop into a client email or request tracker.                    |     ~1–2 pages | Optional                  |
| **Management Interview Guide**       | A question bank aligned to revenue, margins, WC, accounting, and industry-specific risks.                 |     ~1–2 pages | Optional                  |
| **Industry + KPI Primer**            | For generalists: “how this industry works” and the “units that matter.”                                   |     ~2–3 pages | Yes (after “go”)          |
| **Competitors + Pricing Benchmarks** | When partners ask “who are comps + what do they charge.”                                                  |     ~2–3 pages | Yes (after “go”)          |
| **Accounting / Policy Watchlist**    | When the risk is primarily accounting policy, revenue recognition, capitalization, reserves, etc.         |     ~1–2 pages | Yes (after "go")          |
| **Value Driver Diagram (PPTX)**      | Auto-generated PowerPoint with EBITDA, Working Capital, and Capex value driver trees for proposals/reports. |       3 slides | No (uses industry module) |

### How headings become modular without creating chaos

**Design rule:** every Heading Card uses the same internal structure so it stays consistent even when users customize.

**Recommended card structure (works across all industries):**

* **Purpose (1 line):** what question the section answers for FDD.
* **[DOC] What we know:** only document-grounded facts, each with a doc anchor.
* **Unknowns → [ASK]:** explicitly list what’s missing and convert into data requests or mgmt questions.
* **[WEB] What we’ll add after “go”:** benchmarks/context that must be cited (blank in Plan/Preview).

This keeps the “doc vs web separation” unambiguous while still letting the user add/remove cards.

---

## 2) The best Kickoff Brief template (Standard Heading Set)

### What belongs **outside** the brief vs **inside** the brief

**Outside the brief (Operator Layer):**

* Clarifying questions (until setup is complete).
* A concise **Setup Summary** that the user can edit.
* The **Outline/Heading Set preview** (so the user can add/remove headings before “go”).
* The **Research Question Path** preview *as a plan* (then the same content appears inside the brief under “Research Question Path”).

**Inside the brief (Deliverable Layer — copy/paste ready):**

* Everything from **Doc Registry** onward, using consistent headings in both phases.
* Doc-grounded facts, Unknowns/Red Flags, requests/questions, and (after “go”) web findings + citations.

### The Kickoff Brief headings (with doc vs web rules)

This structure stays rigid, but internally it’s modular because “Document Extraction” is composed of heading cards.

| Section                                       | What goes in it                                                                                                 | Must be doc-grounded                                                   | Can be web-derived (after “go”)                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **0. Brief Parameters**                       | Target, as-of date, geo, industry module, lookback window, and any explicit assumptions.                        | The parameter values themselves (from user + docs).                    | None (unless you’re citing an external classification, which is rare).                                        |
| **1. Doc Registry**                           | One row per uploaded doc: type, period, where key facts are likely to live.                                     | Yes, always.                                                           | No.                                                                                                           |
| **2. Document Extraction (Doc-grounded)**           | The company-specific kickoff facts you can support from the docs; no browsing.                                  | Yes, always; use `Unknown` when missing.                               | No. (If you want industry norms, keep them for Web Findings.)                                                 |
| **3. Unknowns / Red Flags**                   | Gaps + risks surfaced from docs, each tied to a request/question and priority.                                  | The “why we think this is a gap/risk” must come from docs.             | You *may* add web-found risks (e.g., litigation/regulatory actions) **only after go**, clearly labeled [WEB]. |
| **4. Research Question Path**                 | 3–6 research tracks that map Unknowns/Red Flags → what you’ll research and why.                                 | The mapping to unknowns and deal context is doc-grounded.              | The actual answers are web-derived later; here it’s just the plan.                                            |
| **5. Web Findings (cited; after “go”)**       | Industry mechanics, benchmarks, competitors, pricing norms, regulatory/accounting context, recent developments. | No (this is the web section).                                          | Yes, always; citations required.                                                                              |
| **6. Diligence Playbook**                     | A practical “what to test next” plan: workstreams, hypotheses, pitfalls, priorities.                            | Company-specific hypotheses should reference doc facts already stated. | You can incorporate industry norms from Web Findings, but don’t introduce uncited facts.                      |
| **7. Data Requests (P1/P2) + Mgmt Questions** | A prioritized list with period, granularity, format, and “why.”                                                 | Derived from Unknowns/Red Flags and doc gaps.                          | You can add “industry-standard request additions” after go, labeled as such, but keep them clearly non-doc.   |
| **8. Evidence Log (docs only)**               | Claim/metric → doc → best-available anchor.                                                                     | Yes, always.                                                           | No.                                                                                                           |
| **9. Web References**                         | A numbered reference list used by citations in Web Findings (and any [WEB] bullets elsewhere).                  | No.                                                                    | Yes (source list only).                                                                                       |

### What “Document Extraction” contains (as modular cards)

Inside **Document Extraction**, keep the cards small and consistent. Recommended minimum set:

1. **Company Snapshot (Doc-grounded)**

* What the company does, who it sells to, where, and how it charges—only if supported by docs.

2. **Business Model & Revenue Streams (Doc-grounded)**

* Streams, pricing model, volume drivers, contract terms, and revenue recognition notes *as stated in docs*.

3. **Financial Snapshot (Doc-grounded)**

* Revenue, gross margin, EBITDA/EBIT, growth, seasonality, and any stated adjustments (or mark Unknown).

4. **Margin Stack & Cost Drivers (Doc-grounded)**

* What drives gross margin and operating margin in *this company* per docs; don’t benchmark yet.

5. **Cash Conversion & Working Capital (Doc-grounded)**

* DSO/DPO/DIO, deferred revenue/prepaids, settlement dynamics, inventory, retention/WIP—whatever applies per docs.

6. **Accounting & Reporting Notes (Doc-grounded)**

* Reporting basis, rev rec, capitalization, reserves, unusual policies, carve-out/TSA notes if present.

7. **Constructed vs Stated P&L (Doc-grounded; conditional)**

* Only include if you have enough detail; otherwise include a stub with “Unknown” + request.

---

## 3) Industry module approach

### How to infer (and *cite evidence for*) industry from docs

Use a simple, explainable rubric that produces:

* **A selected module**
* **A confidence level**
* **The 2–5 strongest doc anchors that justify the selection**

**Evidence types to look for (and cite to file + page/section):**

* **Business description language:** “subscription,” “merchant acquiring,” “take rate,” “WIP,” “backlog,” “utilization,” etc.
* **KPI vocabulary:** ARR/NRR (SaaS), TPV/take-rate/chargebacks (payments), GMV/buyer frequency (marketplace), backlog/WIP/retention (contracting/industrial services).
* **Revenue model descriptors:** seat-based pricing, bps pricing, marketplace commission, percent-of-completion.
* **Customer/transaction context:** “merchants,” “sellers/buyers,” “install base,” “projects,” “service calls,” “job tickets.”

**How to present it in the Plan/Preview:**

* “Industry Module (inferred): **Payments Aggregator** — *High confidence*.”
* Then list 2–4 doc-grounded anchors: “CIM p.12 mentions TPV and take rate,” “VDD KPI table includes chargeback rate,” etc.

If confidence is not high, the assistant should ask the user to choose from 2–3 modules, showing the evidence that led to each candidate.

### Minimal set of modules to ship first

Based on your fixtures (SMB SaaS, payments, marketplaces, industrials, field services) and what’s most common in mid-market diligence, I’d ship these first:

| Module                                          | Why it’s a good v1 module                                                               | “Unit that matters” (what generalists need fast)                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **SMB SaaS**                                    | Very common, KPI-heavy, and easy to misread without domain context.                     | ARR/MRR, logos, seats, churn/NRR, CAC/payback.                           |
| **Payments / Fintech (Aggregator/PayFac/ISO)**  | Working capital and risk profile are unique; KPIs are non-intuitive for generalists.    | TPV, take rate (bps), active merchants, chargebacks/fraud, reserves.     |
| **Marketplaces**                                | Economics look great until you understand take rate, ads, and fulfillment exposure.     | GMV, take rate, buyer/seller retention, contribution margin, ads attach. |
| **Industrials / Contracted Services**           | Revenue recognition, backlog, utilization, and customer concentration drive everything. | Backlog, utilization, WIP/retention, book-to-bill, labor mix.            |
| **Field Services / Trades / Construction-lite** | Pre–data-room docs are often thin and generalists miss WIP/backlog and labor dynamics.  | Jobs, technician hours, utilization, backlog, attach services, AR aging. |

You can add “Distribution/Wholesale” and “Healthcare provider” next, but the five above cover a lot of deal flow and align with your current examples.

### How modules modify/extend the base template (what changes vs stays fixed)

**Stays fixed across all modules:**

* Top-level brief headings (Doc Registry → Document Extraction → Unknowns → Research Path → Web Findings → Playbook → Requests → Evidence → References).
* The labeling rules ([DOC] vs [WEB]) and the “no browsing until go” gate.
* The Evidence Log and citation behavior.

**Changes by module (plugs into specific sections):**

* **Document Extraction → KPI checklist + “units that matter” prompts:** the module tells the assistant what KPIs to look for in the docs and how to name them consistently.
* **Unknowns/Red Flags → default risk starters:** module supplies common red flags + the “first 10 questions” so gaps are translated into action quickly.
* **Research Question Path → track templates:** module provides 3–6 default research tracks and suggested source types.
* **Web Findings → benchmark categories:** module specifies which benchmarks to pull (e.g., NRR ranges vs take-rate ranges vs backlog conversion).

**Practical implementation detail:** keep modules mostly **non-quantitative** in the Knowledge Base (definitions, checklists, risk patterns), and force any *numerical benchmark claims* to be populated only in Web Findings with citations after “go.”

---

## 4) Required setup fields + exact clarifying question set

### Required setup fields (stop gate for “go”)

These are the minimum to start web research and produce a defensible brief.

| Field                            | Required? | Notes / validation                                                     |
| -------------------------------- | --------: | ---------------------------------------------------------------------- |
| **Target company legal name**    |       Yes | If unclear, ask for website/ticker/aliases.                            |
| **Industry module**              |       Yes | Must be one module value; no “unclear” allowed.                        |
| **Primary operating geography**  |       Yes | Country/region where revenue is primarily generated.                   |
| **As-of date + lookback window** |       Yes | As-of in YYYY-MM-DD; lookback default 24 months unless user overrides. |

(Everything else is optional and should not block “go” in v1.)

### Clarifying question script (wording + ordering + stop condition)

**Batch size rule:** 2–4 questions at a time, and only ask what’s missing/low confidence.

**Question Set (in order):**

1. **Target confirmation**

> “What’s the research target’s **legal name** (and any alias/website/ticker if known)? If this is a carve-out or subsidiary, which entity are we diligencing?”

2. **Industry confirmation (show your inference if you have one)**

> “Based on the uploaded docs, I currently infer the industry module as **{Module}** (evidence: {Doc anchors}). Should I lock that in, or should I use one of these instead: **{Alt A} / {Alt B}**?”

3. **Geography**

> “Where does the company primarily **operate / generate revenue** (e.g., US, North America, UK/EU, APAC)? If split, give the rough split or the main region.”

4. **As-of date + lookback**

> “What date should this brief be **‘as of’** (YYYY-MM-DD)? And what lookback window should I use for trends (default **24 months**)?”

**Stop condition (non-negotiable):**

* Stop asking setup questions when all four required fields have explicit values, then immediately output:

  * Setup Summary (concise, editable)
  * The exact outline (Heading Set + section list)
  * Research Question Path (tracks + why + sources)
  * The Plan/Preview Kickoff Brief with doc-grounded content and placeholders for Web Findings
    …and end with: “Reply with edits or say **go**.”

### A simple “edit protocol” that works well in chat

Teach users a single pattern that reliably updates state:

* “Edit protocol: reply with `Field: Value` lines (e.g., `Industry: Payments Aggregator`, `As-of: 2025-01-15`) or say `go`.”

This avoids long back-and-forth and keeps the “setup summary” as the single source of truth.

---

## 5) Custom GPT architecture under the 8k system-prompt limit

### What goes where

**System Prompt (keep it short, rigid, enforce the gates):**

* Role, workflow, “no browsing until go,” doc/web labeling, evidence + citations rules, and the output contract.

**Knowledge Files (where you put all the content that would blow the prompt budget):**

* The Heading Library (definitions + writing guidance).
* The base Kickoff Brief template(s).
* Industry modules (checklists, red flags, default research tracks).
* The setup field definitions + question script.

**Runtime Instructions (what the assistant produces each run):**

* Setup Summary + Outline preview.
* Research Question Path generated from the actual docs and unknowns.
* The brief itself.

### Draft system prompt (fits under 8,000 characters)

You can paste this into the Custom GPT system instructions (it’s ~4.3k characters):

```text
You are **FDD Researcher**, a ChatGPT Custom GPT that produces a pre–data-room kickoff brief for Financial Due Diligence (FDD) teams.

Core job: turn sparse kickoff documents (SIM/CIM/VDD report/teaser/limited financials) into a **scan-friendly Kickoff Brief** that (1) extracts doc-grounded facts, (2) turns gaps into prioritized data requests + management questions, and (3) after user approval (“go”) adds web-researched industry context with citations.

HARD RULES
- **No web browsing until the user explicitly says “go”.** In the Plan/Preview phase you may only use uploaded documents + user-provided answers.
- **Never invent company-specific facts.** If not supported by the uploaded docs or the user, write **Unknown**.
- **Separate sources clearly:**
  - Mark doc-grounded bullets with **[DOC]** and include a doc anchor (filename + page/section if available).
  - Mark web-derived bullets with **[WEB]** and include end-of-bullet numeric citations.
  - Do not mix [DOC] and [WEB] claims in the same bullet.
- **Citations:** numeric citations at end of the bullet/paragraph; **no citations inside tables** (put citations in a sentence immediately after the table).
- Prefer bullets/tables over prose. Define jargon on first use. Show units + dates for numbers.

WORKFLOW (2-PHASE)
Phase 1 — Plan/Preview (NO BROWSING)
1) Intake & Doc Registry: list uploaded files and create a Doc Registry (filename, doc type, period/as-of, “what to pull” keywords).
2) Document extraction: extract only what the docs support (business model, revenue streams, financial snapshot, KPIs, margin drivers, working capital mechanics, accounting notes). Tag each claim [DOC] with an anchor.
3) Industry inference: infer the most likely industry module from doc evidence (business description, revenue model, KPI vocabulary). If confidence < high, ask the user to choose from 2–3 candidates.
4) Clarifying questions: ask 2–4 questions at a time ONLY to fill REQUIRED SETUP FIELDS:
   - Target company legal name (and website/ticker if known)
   - Confirmed industry module
   - Primary operating geography
   - As-of date + preferred lookback window
   Keep asking until all required fields are explicitly filled.
5) Setup Summary + Outline + Research Question Path: once required fields are filled, show:
   - a concise Setup Summary (the 4 required fields + any explicit assumptions)
   - the exact brief outline (based on the chosen Heading Set)
   - a Research Question Path (3–6 tracks) mapping Unknowns/Red Flags → what you will research and why
   End by asking for corrections or the single word: go.

Phase 2 — Final (BROWSING ALLOWED AFTER “go”)
6) Run web research to answer the Research Question Path and collect: benchmark ranges, industry mechanics, competitors, pricing norms, regulatory/accounting context, and recent developments relevant to diligence. Prefer primary/authoritative sources.
7) Produce the final Kickoff Brief using the same headings, filling Web Findings with [WEB] bullets and citations, and updating the Diligence Playbook + Data Requests/Mgmt Questions.

HEADING SETS, TEMPLATES & MODULES
- Default Heading Set: FDD Kickoff Brief (Standard). If the user asks for a shorter/longer deliverable, switch to the closest Heading Set from the Knowledge files (e.g., Company Snapshot / Company Brief / Full FDD Brief) and show the outline in the Plan/Preview so the user can edit headings before “go”.
- Use the Kickoff Brief Template and Heading Library from the Knowledge files.
- Apply the selected Industry Module to: KPI checklist/definitions, typical margin & WC drivers, common red flags, and default data requests/mgmt questions.

OPTIONAL PYTHON (if available)
- Use Python when you have structured data (XLSX/CSV tables) to compute simple KPIs (TTM, YoY, margins, DSO/DPO/DIO, churn if cohort tables exist) and to format clean tables.
- If parsing fails, fall back to manual extraction from the docs and mark items Unknown, then convert gaps into Data Requests.
- Use Python (python-pptx) to generate Value Driver Diagram PowerPoint files when requested.

OUTPUT CONTRACT
- In Plan/Preview and Final, output one document with consistent top-level headings:
  Doc Registry → Document Extraction (doc-grounded) → Unknowns/Red Flags → Research Question Path → Web Findings (after go) → Diligence Playbook → Data Requests + Mgmt Questions → Evidence Log (docs) → Web References.
```

### Supporting knowledge files (recommended set)

Below are “upload-ready” drafts you can use as Knowledge files. You can split them or keep them combined; the main goal is that the system prompt stays short and the knowledge carries the structure.

#### Knowledge file 1: `heading-library.md`

```markdown
# Heading Library (FDD Researcher)

## How to use
- A "Heading Set" is a curated list of Heading Cards.
- Users can customize by adding/removing Heading Cards before "go".
- Every Heading Card should include:
  - [DOC] facts with anchors
  - Unknowns → [ASK] requests/questions
  - [WEB] placeholders for after "go" (benchmarks/context)

## Heading Sets (Presets)
### Company Snapshot
- Brief Parameters
- Doc Registry (short)
- Company Snapshot
- Key Unknowns + Next Steps
- Evidence Log (minimal)

### Company Brief
- Brief Parameters
- Doc Registry (short)
- Company Snapshot
- Business Model & Revenue Streams
- Financial Snapshot (if available)
- Key Risks / Unknowns
- Web Findings (short, cited)
- References

### FDD Kickoff Brief (Standard)
- Brief Parameters
- Doc Registry
- Document Extraction (cards below)
- Unknowns / Red Flags
- Research Question Path
- Web Findings (cited)
- Diligence Playbook
- Data Requests (P1/P2) + Mgmt Questions
- Evidence Log (docs)
- Web References

### Full FDD Hypothesis Brief
- Everything in Standard, plus:
- QoE Hypotheses & Normalizations (hypothesis-only if data missing)
- Net Working Capital Hypotheses (drivers + requests)
- Debt-like Items / Off-BS Watchlist
- Forecast / Budget Credibility (if any forward view exists)
- Systems / Data Readiness (what we need to receive in the room)

## Heading Cards (definitions + writing guidance)

### Company Snapshot
Purpose: orient the team in <60 seconds.
Format: 8–12 bullets. Each bullet is either [DOC] fact with anchor or an Unknown stated as Unknown.
Include: what they sell, to whom, where, pricing model, scale, recent growth, margin shape, cash conversion shape, top risks.

### Business Model & Revenue Streams
Purpose: explain how money is made and where durability risk lives.
[DOC] include: streams, pricing model, volume drivers, contract terms, stated rev rec.
Unknowns: what would change the revenue story (renewals/cohorts, concentration, usage, pipeline).

### Financial Snapshot
Purpose: capture the simplest “shape” of the P&L with what you have.
[DOC] include: revenue/margins/EBITDA where supported; label stated vs constructed; show periods and units.
Unknowns: missing periods, definition mismatches, adjustments, one-offs.

### Margin Stack & Drivers
Purpose: identify what actually moves GM and operating margin.
[DOC] include: cost buckets, variable vs fixed, seasonality, known inflation/price pass-through.
Unknowns: unit costs, hosting/logistics, labor mix, utilization, comp plans.

### Cash Conversion & Working Capital
Purpose: identify WC sensitivities and cash timing.
[DOC] include: DSO/DPO/DIO, deferred revenue/prepaids, settlement mechanics, inventory, retention/WIP if applicable.
Unknowns: aging, seasonality, reserves, factoring, supplier finance.

### Accounting & Reporting Notes
Purpose: highlight policy areas that could distort comparability or QoE.
[DOC] include: revenue recognition, capitalization, reserves, leases, consolidation, carve-out/TSA notes.
Unknowns: policy elections, estimates, audit status, restatements.

### Unknowns / Red Flags
Purpose: convert gaps into action quickly.
Format: a table with columns: Item, Why it matters, Evidence (doc anchor or [WEB] citation), Tag (Data Request / Mgmt Q), Priority (P1/P2).

### Research Question Path
Purpose: show what you will research and why before browsing.
Format: 3–6 tracks; each track must map to one or more Unknowns/Red Flags.

### Web Findings (cited)
Purpose: add industry mechanics + benchmark ranges + competitor context.
Format: bullets by topic; citations at end of bullets; no citations in tables.

### Diligence Playbook
Purpose: turn facts + context into a workplan.
Format: workstreams with “what to test”, “how to test”, and “what could break”.

### Data Requests + Mgmt Questions
Purpose: produce actionable next steps.
Format: separate P1/P2. Each request includes period, granularity, format, and why.
```

#### Knowledge file 2: `kickoff-brief-template.md`

```markdown
# {{TARGET}} — {{HEADING_SET}} (Pre–Data Room)
As-of: {{AS_OF}} | Lookback: {{LOOKBACK}} | Geo: {{GEO}} | Industry Module: {{INDUSTRY}}

## Doc Registry [DOC]
| File | Type | Period/As-of | What to pull / where |
|---|---|---|---|
|  |  |  |  |

## Document Extraction (Doc-grounded) [DOC]
### Company Snapshot
- [DOC] ...
- [DOC] ...
- Unknown: ...

### Business Model & Revenue Streams
- [DOC] ...
- Unknown: ...

### Financial Snapshot
- [DOC] ...
- Unknown: ...

### Margin Stack & Drivers
- [DOC] ...
- Unknown: ...

### Cash Conversion & Working Capital
- [DOC] ...
- Unknown: ...

### Accounting & Reporting Notes
- [DOC] ...
- Unknown: ...

## Unknowns / Red Flags
| Item | Why it matters | Evidence | Tag | Priority |
|---|---|---|---|---|

## Research Question Path (Plan; no browsing yet)
Track 1 — {{NAME}}
- Objective:
- Why it matters (tie to Unknowns/Red Flags):
- Outputs needed:
- Proposed sources:

## Web Findings (after “go”) [WEB]
### Industry mechanics & “units that matter”
- [WEB] ... [1]

### Benchmarks (growth, margins, churn/retention, WC) 
- [WEB] ... [2]

### Competitors / comparables & pricing norms
- [WEB] ... [3]

### Regulatory / accounting context
- [WEB] ... [4]

## Diligence Playbook
- Workstream:
  - What to test:
  - How to test / data needed:
  - Common pitfalls:

## Data Requests (P1/P2) + Mgmt Questions
### P1 Data Requests
- [ASK] ...
### P2 Data Requests
- [ASK] ...
### Management Questions
- [ASK] ...

## Evidence Log (Docs only) [DOC]
| Claim / metric | Value | Source file | Anchor (page/section/table) |
|---|---|---|---|

## Web References [WEB]
[1] ...
[2] ...
```

#### Knowledge file 3: `industry-modules-v1.md` (skeletons)

```markdown
# Industry Modules (v1)

## Module: SMB SaaS
Triggers: ARR, MRR, NRR/GRR, churn, seats, usage-based pricing, cohorts.
Units that matter: ARR/MRR, logos, seats/logo, churn + NRR, CAC/payback, gross margin.
KPI checklist (definitions only): ARR, MRR, GRR/NRR, logo churn, net dollar retention, CAC, payback, LTV (if used), expansion vs new, deferred revenue, billings.
Common red flags: NRR propped by price, heavy discounts, reseller dependence, churn masked by downsell, capitalization of S&M, implementation backlog.
Default P1 requests: cohort ARR/GRR/NRR (24m), bookings vs billings bridge, top customers + ARR, discounting rules + approvals, pipeline and win rates, hosting costs by usage.
Web tracks: benchmark NRR/churn/margins by sub-vertical; pricing norms; comps; typical contract terms; rev rec nuances.

## Module: Payments / Fintech (Aggregator/PayFac/ISO)
Triggers: TPV, take rate (bps), merchants, chargebacks, reserves, interchange, scheme fees, settlement.
Units that matter: TPV, take rate, net revenue, active merchants, loss/chargeback rates, reserve levels, attach SaaS.
KPI checklist: TPV, take rate, net revenue retention (if used), merchant churn, chargebacks bps, fraud loss bps, reserve %, authorization rates, mix (CP/CNP).
Common red flags: reserve underfunding, concentration by sponsor bank/processor, scheme fee escalators, high-risk merchant exposure.
Default P1 requests: TPV and take rate by merchant/vertical (24m), chargebacks and reserves (monthly), top merchant concentration, processor/sponsor contracts, pricing schedules.
Web tracks: scheme fee trends; typical take-rate ranges by segment; regulatory constraints; comps.

## Module: Marketplaces
Triggers: GMV, take rate, sellers/buyers, orders, ads attach, fulfillment/logistics.
Units that matter: GMV, take rate, buyer frequency, seller retention, contribution margin, ads margin.
KPI checklist: GMV, orders, AOV, take rate, buyer repeat rate, seller churn, CAC per buyer, contribution margin, ad ARPU.
Common red flags: take rate pressure, counterfeit/compliance, fulfillment cost creep, growth driven by incentives, mix shift to 1P.
Default P1 requests: GMV/orders by cohort (24m), take rate by category, buyer/seller retention, promo spend, fulfillment economics.
Web tracks: take-rate benchmarks, marketplace unit economics norms, key competitors, regulatory issues.

## Module: Industrials / Contracted Services
Triggers: backlog, utilization, WIP, retention, change orders, percent-of-completion, book-to-bill.
Units that matter: backlog months, utilization, WIP conversion, gross margin by project, re-bid win rate.
KPI checklist: backlog, book-to-bill, utilization, gross margin by job, change order %, retention %, AR aging, over/under billings.
Common red flags: unbilled AR/WIP quality, aggressive rev rec, underpriced contracts, labor availability, customer concentration.
Default P1 requests: backlog/WIP rollforward, job margin reports, utilization, change orders, retention schedule, AR aging.
Web tracks: labor cost trends, typical margins by niche, rev rec norms, demand cyclicality.

## Module: Field Services / Trades / Construction-lite
Triggers: dispatch, work orders, service calls, technicians, jobs, maintenance contracts.
Units that matter: jobs, technician hours, utilization, attach maintenance, AR aging, backlog.
KPI checklist: jobs completed, average ticket, utilization, first-time fix rate (if tracked), service contract renewal, gross margin per job.
Common red flags: utilization volatility, reliance on subcontractors, warranty callbacks, slow-paying customers, weak scheduling systems.
Default P1 requests: job-level profitability, utilization by tech, backlog, AR aging, warranty/returns, customer concentration.
Web tracks: typical margins/DSO by subtrade, labor market trends, competitor landscape.
```

---

## 6) Should you use Python (Code Interpreter)?

Yes—enable it—but be strict about *when* it’s worth it.

### Use Python for these exact jobs

* **Parsing structured financials (XLSX/CSV):** pull revenue, COGS, Opex, EBITDA, and compute TTM / YoY deltas consistently when the doc tables are clean.
* **Computing standard KPIs:** GM%, EBITDA%, growth rates, DSO/DPO/DIO (if AR/AP/Inventory + revenue/COGS exist), and simple bridges (e.g., revenue vs billings vs deferred revenue) when inputs exist.
* **Building a clean Evidence Log:** maintain a small dataframe of extracted metrics with doc names and the best anchor you can capture from the extraction (even if it’s “CIM – Financial Highlights slide”).
* **Sanity checks:** reconcile totals, detect mismatched periods/currencies, and flag obvious inconsistencies (e.g., margins >100%, negative AR days).

### Fallback plan when parsing fails (and it will, often)

* If Python can’t reliably parse a PDF table or the workbook is messy, the assistant should still proceed by extracting what it can manually and marking the rest **Unknown** rather than forcing computation.
* If a table is critical, the assistant should ask the user to paste the table into chat or export it to CSV, but it should *not* block the Plan/Preview from being produced.

---

## 7) Design decisions that require external research (and how to do it)

These are the areas where “internal knowledge files” aren’t enough, because you want defensible, cited numbers.

### Research questions to answer per module (examples)

* **Benchmarks:** “What are credible benchmark ranges for gross margin / EBITDA margin / NRR / churn / take rate / DSO in {sub-vertical}?”
* **Pricing norms:** “What are typical price points / contract terms / implementation fees in {category}?”
* **Working capital mechanics:** “What drives cash conversion and common WC traps in {industry}?”
* **Accounting and regulatory:** “What are the top recurring accounting policy pitfalls and regulatory constraints for {industry}?”

### Recommended source types (ranked)

* **Primary:** regulator publications, audited filings, accounting standards references, major public-company investor materials.
* **High-quality secondary:** rating agency research, reputable consulting/accounting firm publications, industry associations.
* **Market data providers:** only if accessible and properly attributable; otherwise treat as directional and triangulate.

A practical v1 rule: for every benchmark range you publish, aim for **2 sources** and prefer recency (last 24 months) unless it’s a stable accounting/regulatory point.

---

## 8) What to take from `research_lead_agent.md`, and what to avoid copying

### Take (the useful ideas)

* **The “breakdown → plan → execute → synthesize” discipline** is worth keeping, because it prevents the model from jumping to conclusions before it knows what it’s solving.
* **Source-quality prioritization and conflict handling** is valuable, especially the idea of explicitly noting discrepancies and choosing the most authoritative/recent source.
* **The emphasis on explicit output format contracts** is aligned with your need for rigid, scan-friendly briefs and predictable sections.

### Avoid copying (it will hurt your Custom GPT)

* It’s built around **subagent delegation and internal tools**, which you don’t have in a Custom GPT, so copying those parts adds complexity without capability.
* It includes instructions that conflict with your product needs (e.g., *“do not include citations”* and other generic research constraints), which undermines your “web-derived claims must be cited” requirement.
* It’s optimized for very long “research reports,” not an FDD kickoff artifact; keeping it would push you toward verbosity and away from the “associate-usable” density you want.

---

## One design choice I’d make now (based on your goal)

If you want generalists to get “units that matter” fast *without* polluting doc-grounded content, make the industry module contribute **two things before go**:

1. A **KPI checklist / glossary** (definitions only, no benchmark numbers), and
2. A **“What to look for in the docs” scanner** that tells the assistant which tables/phrases to hunt for.

Then reserve all **numerical benchmarks** for **Web Findings after “go”** with citations.

That keeps defensibility clean while still giving associates a meaningful head start.

If you want, I can also give you a compact “Industry Inference Scoring Table” (keywords → candidate modules → confidence) that you can paste directly into a knowledge file, so inference becomes more consistent run-to-run.
