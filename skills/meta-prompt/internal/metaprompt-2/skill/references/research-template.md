# Research_Template.md

Use this template when the task:

- Depends on **external research and recency**.  
- Requires **citations** and explicit references to sources.  
- Benefits from comparing sources, handling uncertainty, or describing regulatory/market landscapes.

Target length for the optimized prompt: **180–350 words** (hard cap: **≤350**).

---

## Template Guidance

- Start by clearly stating the research objective and audience.  
- Constrain the scope via:
  - Time window or “as‑of” date.  
  - Geography or jurisdiction.  
  - Domain/sector.  
- Keep methodology instructions minimal: modern models know how to prioritize credible sources and cross‑check; only specify task‑specific nuances.  
- Standardize citations:
  - Inline numeric citations [1], [2], … for important factual claims.  
  - Final `References` section mapping numbers to sources (title, publisher, date, link).  
- For parser-ready citations, source IDs, line ranges, citable blocks, or injected/retrieved context workflows, read [`advanced-citation-formatting.md`](advanced-citation-formatting.md) instead of relying on this simple numeric pattern.
- Do **not** include explicit `Plan`, `Agentic Guidance`, or `Validation` sections unless the user asks.  
- If you need reasoning guidance, use at most one short line: “Think step by step before you answer; do not show your plan.”  
- Use Output Format to define headings, citation style, and a clear length/verbosity hint.

---

## Research Template (Skeleton)

```markdown
# Role and Objective
{One or two sentences defining the research role, the main question, and the audience.}

# Context
{Optional. Brief bullets to define scope, such as geography, time window/as‑of date, sector, and any key frameworks (e.g., EU AI Act, ISO standards).}

# Research Instructions
- {Instruction 1: what to research and what outcomes matter.}
- {Instruction 2: key dimensions (e.g., compliance obligations, TAM/SAM/SOM, competitive landscape) that are clearly implied by the user.}
- {Instruction 3: high‑level expectations on evidence quality and recency.}
- {Optional: one line for internal reasoning if needed, e.g., “Think step by step before you answer; do not show your plan.”}

# Output Format
- {Define main headings tailored to the task (e.g., Executive Summary, Key Findings, Analysis, Risks/Limitations, Strategic Implications).}
- {Specify any tables or structured sections, including columns and sort order, if applicable.}
- Use inline numeric citations [1], [2], … for important factual statements and figures.
- Include a final **References** section mapping each citation number to its source (title, publisher, date, and link if available).
- {Simple length/verbosity hint, e.g., “aim for a concise 2–3 page brief, focused on decision‑useful insights.”}

---

## Example 1 — EU AI Act Compliance Brief

**Unoptimized user prompt**

```text
Provide an up-to-date legal brief on the current compliance requirements for AI in the EU, focused on the AI Act, with citations.
```

**Optimized prompt (Research)**

```markdown
# Role and Objective
You are a legal research assistant. Provide an up‑to‑date legal brief on current compliance requirements for AI in the EU, with a primary focus on the EU AI Act, including relevant citations, for an in‑house legal and compliance audience.

# Context
- Scope: focus on the AI Act as currently adopted and any key implementing or interpretive guidance.
- Geography: European Union.
- Time window: prioritize sources from the last 2–3 years and clearly state if older sources are used for background.

# Research Instructions
- Identify and summarize major compliance obligations for AI providers, deployers, and users under the AI Act.
- Highlight requirements for high‑risk AI systems and any notable prohibited practices.
- Summarize enforcement mechanisms, supervisory authorities, and penalty regimes.
- Where helpful, briefly distinguish the AI Act’s obligations from those under adjacent frameworks (e.g., GDPR) without drifting into a full GDPR analysis.
- Think step by step before you answer; do not show your plan.

# Output Format
- Use headings: Overview, Scope & Definitions, Stakeholder Obligations, High‑Risk AI Requirements, Enforcement & Penalties, Practical Implications.
- Under each heading, provide succinct paragraphs and bullets as needed.
- Use inline numeric citations [1], [2], … for important legal provisions and factual statements.
- Include a final References section with one entry per citation (title, issuing body, date, link where available).
- Output Verbosity: aim for a concise brief equivalent to ~2–3 pages of content.
```

## Example 2 — Generative AI for Legal Tech Investment Memo

**Unoptimized user prompt**

```text
I need a deep-dive market analysis on the emerging "Generative AI for Legal Tech" sector in North America and Europe. I need TAM, CAGR projections for 2025–2030, key regulatory headwinds (EU AI Act, US Copyright Office rulings), and a competitive landscape of the top 10 startups vs incumbents. Specifically look for recent funding rounds (Series B+) in the last 12 months. Investment memo style, rigorous citation required for all financial figures.
```

**Optimized prompt (Research)**

```markdown
# Role and Objective
You are an investment research analyst preparing a deep‑dive market analysis on the “Generative AI for Legal Tech” sector in North America and Europe. Your task is to produce a concise, decision‑ready investment memo.

# Context
- Geography: North America and Europe.
- Sector: generative AI applications in legal workflows and products (e.g., contract review, legal research, drafting, e‑discovery).
- Time window: emphasize developments and funding from roughly the last 12–24 months, including Series B+ rounds in the last 12 months.

# Research Instructions
- Define what counts as “Generative AI for Legal Tech” for the purposes of this memo.
- Estimate total addressable market (TAM) and, where feasible, discuss relevant SAM/SOM segments for key product categories, using ranges and clearly labeled assumptions.
- Summarize compound annual growth rate (CAGR) projections or directional growth expectations for 2025–2030 from credible sources.
- Identify key regulatory headwinds and tailwinds (e.g., EU AI Act, US Copyright Office guidance) and explain how they affect adoption, risk, and valuations.
- Map the competitive landscape across representative startups and incumbents, highlighting at least several notable Series B+ rounds in the last 12 months where data is available.
- Ensure all important financial figures and regulatory claims are supported by citations.

# Output Format
- Use headings: Executive Summary, Market Definition & Size (TAM/SAM/SOM), Growth Outlook (2025–2030), Regulatory Headwinds & Tailwinds, Competitive Landscape (Startups vs Incumbents), Key Risks & Open Questions, Preliminary View.
- Under Executive Summary, provide a short paragraph plus 3–5 bullets with key conclusions.
- Where helpful, use small tables to compare segments or representative companies (columns might include name, segment, role, and notable funding/position).
- Use inline numeric citations [1], [2], … for all important figures and regulatory statements, and include a final References section listing sources (title, publisher, date, link).
- Aim for a concise memo equivalent to ~2–3 pages of content.
```
