---
name: kdn-task-writer-document-analysis
description: Instructions for Document Analysis Mode - reviewing documents and recommending KDN tasks.
---

# Document Analysis Mode

Use this mode when the user provides a document (data file, spreadsheet, report) and explicitly asks you to review it and suggest tasks for KDN.

## Trigger Phrases

Activate this mode when the user says:
- "review and suggest tasks"
- "what can KDN do with this"
- "analyze this file/data"
- "recommend tasks based on this"
- "go through this data first"
- "what tasks should we build from this"

**Important:** Only use this mode when explicitly triggered. Do not proactively suggest tasks when the user just shares a file without asking for recommendations.

## Output Format

Produce a **two-phase output**:

### Phase 1: Recommended Tasks Block

```text
📊 **Recommended Tasks** (based on document review)
• {Task recommendation 1} – {brief rationale tied to document}
• {Task recommendation 2} – {brief rationale tied to document}
• {Task recommendation 3} – {brief rationale tied to document}
```

### Phase 2: Draft Email

After the recommendations block, include a `---` separator and then the standard KDN email incorporating your recommendations.

## Full Example

User uploads a customer sales file and says: "Go through this and suggest what KDN can build."

```text
📊 **Recommended Tasks** (based on document review)
• Revenue by customer analysis – file contains monthly revenue by customer name
• Top-10 customer concentration – can calculate % of total revenue by customer
• Revenue trend by product line – monthly columns show product-level breakouts
• Customer churn analysis – file includes customer start dates and status flags

---

**Subject: Project {Name}**

Team,

Tonight: Build customer revenue analytics from the sales data.

📁 {YYYY-MM-DD}

1. Customer revenue analysis:
   a. Build revenue by customer schedule from *{sales file}*
   b. Add top-10 customer concentration with % of total
   c. Calculate YoY growth by customer

2. Product line revenue trends:
   a. Summarize monthly revenue by product line
   b. Add TTM column

Save to: {Project}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}
```

## Grounding Rules

**Only recommend what you actually see in the document:**
- Reference specific columns, fields, or data points you observed
- Use rationale like "file contains X" or "data includes Y"
- Do not assume data exists if you haven't seen it

**Map recommendations to standard FDD patterns:**
- Revenue/customer analytics → KPI and revenue patterns
- Aging data → AR/AP aging patterns
- GL/account data → mapping and roll-forward patterns
- Employee/payroll data → census and payroll patterns
- Vendor data → GL/vendor schedule patterns

**Stay conservative:**
- Recommend obvious, high-value analyses only
- 2–4 recommendations maximum
- If uncertain whether data supports a task, don't recommend it

**Rationale format:**
- Keep rationales brief (5–10 words)
- Tie directly to document content
- Examples:
  - "file includes customer-level monthly totals"
  - "aging buckets present in columns F–I"
  - "employee role and department fields available"

## What NOT to Do

- Do not recommend tasks for data you haven't seen
- Do not speculate about what other files might contain
- Do not exceed 4 recommendations
- Do not skip the draft email—always include both phases
- Do not use this mode unless explicitly triggered
