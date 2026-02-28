---
name: kpmg-brand-reporting
description: Applies KPMG brand colors, typography and financial reporting conventions to automatically generated slides, reports and other client-facing artifacts.
license: Complete terms in LICENSE.txt
---

# KPMG Brand & Reporting Skill

## Overview

Use this skill whenever output should look and read like a KPMG Financial Due Diligence (FDD) deliverable. It encodes KPMG's visual identity (colors, typography, chart style) and reporting conventions (headings, numbers, tables, notes, sources, page layouts and straplines) so that generated content can be pasted into PowerPoint, Word or Excel and quickly formatted on-brand.

## Brand Guidelines

### Colors

Anchor all visuals in **KPMG Blue** and the approved secondary palette. Use accent colors primarily in charts, infographics and small emphasis elements, not in large text blocks.

- **KPMG Blue** (primary): `#00338D`
- **Medium Blue**: `#005EB8`
- **Light Blue**: `#0091DA`
- **Violet**: `#483698`
- **Purple**: `#470A68`
- **Light Purple**: `#6D2077`
- **Green**: `#00A3A1`

Usage rules:

- Body text is **black** on a white background.
- Main headings are KPMG Blue; use white text when placed on a solid KPMG Blue / gradient bar.
- Accent colors are reserved for charts, infographics, icons and small call-out elements.
- When creating gradients or split backgrounds, combine two KPMG brand colors with a clear 40/60 split.

### Typography

KPMG uses three primary typefaces:

- **KPMG Font** – used for headlines in global brand materials.
- **Univers** – used for subheads and body copy in design-led materials.
- **Arial** – used for PowerPoint, Word, e-comms and most client deliverables.

For generated deliverables (slides, Word and Excel):

- Use **Arial** as the default font.
- **Main heading**: Arial 10pt bold, KPMG Blue.
- **Sub-heading**: Arial 10pt bold italic, KPMG Blue.
- **Sub-sub-heading**: Arial 10pt italic, KPMG Blue.
- **Body text**: Arial 10pt, black (do not go below 9pt; use more pages instead).
- **Graph titles**: Arial 10pt bold, KPMG Blue.
- **Graph labels / axes / legends**: Arial 8pt, black.
- **Notes and sources**: Arial 6pt, KPMG Blue.

When describing formatting in natural language, always specify:

- Font (Arial), size (pt), style (regular / bold / italic), color (KPMG Blue / black / white).
- Alignment (left-aligned by default; middle-centred for call-out boxes / balls).

---

## Core Reporting & Formatting Rules

These rules apply to the narrative, tables and numbers in FDD-style reports.

### Body Text & Paragraphs

- Left aligned, single line spacing.
- 6pt paragraph spacing after (can reduce to 2pt if there is too much text; never reduce font below 9pt).
- Avoid dense blocks; use additional pages or sub-headings instead of shrinking font.

### Bullets & Lists

- Main bullets: normal bullet (Unicode 2022), black.
- Sub-bullets: hyphen (Unicode 002D), black; first word in lower case unless a proper noun.
- Keep bullet text concise and value-focused; one key idea per bullet.

### Notes & Sources

Used for tables, graphs and charts:

- **Notes** (e.g. (a), (b)):
  - Arial 6pt, KPMG Blue, left aligned, above the source line.
  - Single spacing, 2pt before, full stop at end.
  - In tables, note markers appear as superscript (~30%) to the left of the figure or on the right of the row label.
- **Sources** (e.g. (1), (2)):
  - Arial 6pt, KPMG Blue, left aligned, below the notes.
  - Separate multiple sources with semi-colons, or number them (1), (2), etc.
  - Full stop at end.

### Numbers, Currency & Percentages

- Numbers **1–9** in text: write in **words**.
- Numbers **10+** in text: write as **numerals**.
- Be consistent across the document in decimal places and units (e.g. €m vs €'000).
- In body text:
  - Use formats like **€0.1 million / €0.1m** and **€100 thousand / €100k**.
  - No space between currency sign and amount (e.g. €1.0 million, not € 1.0 million).
- In tables:
  - Use column headings such as **€m** or **€'000**.
  - Do not use plural formats like €Ms, €'000's, €'m.
  - Treat zero in tables as a dash (**–**), but axes on charts should use **0**, not a hyphen.
- Percentages in tables should be in **italics** (not in body text).

### Punctuation & Terminology

- Use full stops at the end of sentences; one space after any full stop, colon, semi-colon or comma.
- Use double quotation marks **only for actual quotes**.
- Use single inverted commas when first defining an acronym, e.g. *capital expenditure (‘capex’)*.
- Be consistent with terminology and reporting periods; maintain a glossary and follow it.
- Use **Appendix** (capital A) when referencing appendices.
- No spaces around slashes (e.g. *before/after* not *before / after*).
- Use **n/a**, never **N/A** or **n.a.**.

---

## Page Layouts & Reporting Examples

Use the KPMG FDD page layouts as mental templates when generating new pages. Each analysis page should have:

1. A **clear heading** describing the topic.
2. A **strapline** summarising the key message.
3. A **structured body** combining tables/charts with concise commentary.
4. **Hyperlinks / references** to detailed analysis, where relevant.

Below are the main layout archetypes and how to describe them for generation.

### 1. Executive Summary / Divider Pages

**Use for:** Section dividers and top-level navigation.

Structure:

- Divider slide with:
  - Section number (e.g. *01 Executive summary*).
  - List of sub-sections with page numbers.
  - Hyperlinks to each section where available.
- Strapline capturing the overarching message for the section.
- Optional navigational links to Excel databook, Power BI dashboard or appendices (depending on local risk requirements).

When generating:

- Provide a concise **section title** and 3–7 bullet headlines.
- Ensure each bullet is written as a **finding + implication** (see headlines formats below).

### 2. Summary Financials (Versions 1–3)

**Use for:** High-level QoE, NWC and net debt overview.

**Version 1 – Tabular + chart grid**

- Grid of tables/charts showing:
  - Quality of earnings bridge.
  - NWC profile and seasonality.
  - Net debt and leverage metrics.
  - Other key financial KPIs as relevant.
- Each tile should have:
  - Clear title.
  - Compact chart or table.
  - Very short caption where needed.

**Version 2 – Financials + benchmarking**

- Similar to Version 1, but include:
  - Area for benchmarking charts or other broader visuals (e.g. peer margin comparison).
  - Narrow commentary panel to highlight key messages.

**Version 3 – Infographic style**

- More visual summary page with:
  - Large headline KPIs (e.g. revenue, EBITDA, EBITDA margin, FCF conversion).
  - Iconography or simplified charts.
  - Clear references to detailed pages (e.g. QoE, NWC, cash flow).

When generating:

- Always include:
  - Time horizon (historical years and LTM).
  - Units (e.g. €m).
  - Summary text linking back to deal value (e.g. *“Adj. EBITDA of €X.Xm underpins purchase price; normalisation mainly driven by non-recurring costs of €Y.Ym.”*).

### 3. Headlines Pages (Value & Non-value Creation)

**Use for:** Top findings and value impact overview.

**Non–value creation version:**

- Table with one row per topic:
  - Topic name (e.g. *Revenue growth & churn*).
  - Short description of issue / observation.
  - Qualitative impact (e.g. arrow, icon, tick/cross).
  - Reference to detailed pages.

**Value creation version:**

- As above, but add:
  - Column for **value impact** (e.g. adj. EBITDA, working capital optimisation).
  - Column for **upside potential** (e.g. €Xm uplift).
  - Links to more detailed value creation analysis.

When generating:

- For each topic, write:
  - **Issue summary** – what is happening?
  - **Implication** – what does it mean for the deal / valuation?
  - **KPMG view** – concise perspective and direction.
  - **Reference** – cross-reference to supporting analysis pages.

### 4. Key Findings Pages

Use a single topic per page for major issues; multi-topic layouts for minor findings.

**Single-topic key finding (value creation lens):**

- Title stating topic and area (e.g. *Key findings – Net working capital*).
- Strapline with 1–2 sentence summary of risk and value view.
- One or more charts/tables (e.g. monthly NWC, ageing, seasonality).
- Text box with:
  - **What we observed**
  - **KPMG view / recommendations**
  - **Implication for valuation / SPA**
  - **Upside potential / next steps**

**Multi-topic key findings (2–6 per page):**

- Each finding is a tile with:
  - Short heading.
  - 1–2 sentence summary.
  - KPMG view / recommendation.
  - Implication line.
- Used for:
  - Minor financial topics.
  - Operational or commercial observations that do not drive a standalone page.

### 5. Supporting Analysis Pages

**Standard layouts:**

1. **Chart + wide text box**
2. **Chart + two-column text**
3. **50/50 chart and text**
4. **Wide chart + text box**
5. **Wide chart on top, text/secondary chart below**

Common rules:

- Strapline at top summarising the key take-away.
- Left side often used for table or chart; right side for commentary.
- Commentary should:
  - Reference concrete numbers shown in the chart/table.
  - Explicitly link to deal value, risk and/or upside.
  - Include cross-references to other sections where relevant (e.g. links between QoE and NWC).

When generating:

- Always specify:
  - Chart type (e.g. stacked column, line chart, waterfall).
  - X-axis (e.g. months, financial years).
  - Y-axis units and scaling.
  - Any colour coding (KPMG Blue for primary series, secondary palette for comparatives).

### 6. Benchmarking & ABB (Analytical Building Blocks)

**Benchmarking pages:**

- Extra-wide chart comparing target to peers (margins, growth, KPIs).
- Text box summarising:
  - Positioning vs peer set.
  - Drivers of over/under-performance.
  - Implications for valuation and business plan.

**ABB analysis pages:**

- Summarise analytical building blocks used for value creation work:
  - Key assumptions.
  - Base vs stretch case definitions.
  - Risk and complexity ratings (with definitions).
- Clearly signpost:
  - How ABB outputs link to valuation.
  - Which findings are critical for SPA / completion accounts vs post-deal value creation.

---

## Charts & Infographics

When generating visual descriptions:

- Use KPMG palette only (see colors section).
- Use simple, readable chart types; avoid 3D or overly complex visuals.
- Ensure:
  - Titles are left aligned, Arial 10pt bold, KPMG Blue.
  - Legends at bottom where possible, Arial 8pt black.
  - Axes clearly labelled, numbers formatted with appropriate units (e.g. €m).
- For infographics:
  - Combine icons, short labels and headline metrics.
  - Use white text on dark KPMG Blue / gradient blocks where needed.

---

## Implementation Notes (for Automation / python-pptx)

When this skill is used to generate content intended for automated slide/report creation:

- Map KPMG colors to RGB/HEX as specified in the Colors section.
- Use Arial for all text fields created via code.
- Apply:
  - 10pt Arial for headings and graph titles.
  - 10pt Arial for body text (9pt minimum where space constrained).
  - 8pt Arial for chart labels and legends.
  - 6pt Arial for notes and sources.
- Layout elements should:
  - Respect KPMG margins and grid where possible.
  - Place notes above sources; both below the chart/table.
  - Maintain clear reading order: heading → strapline → visual → commentary → notes/sources.

---

## How to Use This Skill

When a user asks for KPMG-style content:

1. **Apply these visual and formatting rules** to any narrative, table, chart description or page layout.
2. **Propose the most suitable page layout archetype** (e.g. summary financials v1, headlines, key findings, supporting analysis) and structure the content accordingly.
3. **Write straplines and commentary** that explicitly link observations to implications for valuation, risk and upside.
4. **Signal units and number formats** so that the output can be pasted into PowerPoint/Excel with minimal rework.
