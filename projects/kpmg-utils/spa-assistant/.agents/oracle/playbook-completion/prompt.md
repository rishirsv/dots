# SPA Assistant: Complete Remaining Playbooks

## Role
You are a senior M&A lawyer and technical writer creating knowledge base content for an AI assistant that analyzes Share Purchase Agreements.

## Context
I am uploading `context.zip` containing:
- The infrastructure layer (output-contract.md, global-tests.md, term-map.yml)
- Completed playbooks (01-definitions.md, 02-purchase-price.md, system-prompt.md)
- Existing playbooks that need rewriting (03-08)
- Reference materials from real SPA analyses

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from files
- For concrete claims, cite file paths
- Do not ask questions; state assumptions

## Background

We've built a two-pass analysis system where playbooks guide the model through:
1. **Extract**: Find provisions, quote with citations, normalize to canonical terms
2. **Interpret**: Apply global tests, assign market labels, rank issues, generate output

Each playbook must:
- Follow the structure in `output-contract.md`
- Reference `term-map.yml` for detection keywords and components
- Include self-analysis checklists (yes/no with citations)
- Have an edit protocol (no edits by default)
- End with 5 follow-on prompts

## Task

Rewrite the following playbooks to match the architecture of `01-definitions.md` and `02-purchase-price.md`:

### 1. Playbook 03: Closing Statement & True-Up Process (`03-wc-net-debt.md`)

Should cover:
- Closing statement structure (estimated vs final)
- True-up timeline extraction (buyer prep, seller review, dispute, IA resolution)
- Accounting principles hierarchy analysis
- Independent accountant provisions (scope, standard, cost allocation)
- Dispute resolution mechanics
- Relevant global tests: cut-off consistency, hierarchy stated, no-reclass protection, schedule completeness

Key self-analysis questions:
- Are all timeline stages extracted with specific day counts?
- Is the hierarchy clear (SPA → schedules → past practice → GAAP)?
- Is the IA limited to disputed items only?
- What happens if a deadline is missed (deemed acceptance)?

### 2. Playbook 04: Earnouts (`04-earnouts.md`)

Should cover:
- Metric extraction (revenue, EBITDA, milestones, etc.)
- Measurement period and timing
- Operating covenants / Seller protections
- Acceleration triggers
- Set-off rights against earnout
- Cap and floor mechanics
- Dispute resolution for earnout calculations

Key self-analysis questions:
- Is the metric clearly defined and calculable?
- Are there adequate seller protections against buyer manipulation?
- Can buyer set-off indemnity claims against earnout?
- What triggers acceleration (change of control, breach)?

### 3. Playbook 05: Reps & Warranties (`05-reps-warranties.md`)

Should cover:
- Rep inventory (fundamental vs general vs operational)
- Survival periods by category
- Qualification analysis (materiality, knowledge, Material Adverse Effect)
- Materiality scrape mechanics
- Bring-down standard (in all material respects vs MAC)
- Sandbagging provisions
- Disclosure schedule analysis

Key self-analysis questions:
- Which reps are fundamental (longer survival, outside cap)?
- Is there a materiality scrape for indemnity purposes?
- What's the bring-down standard?
- Is sandbagging addressed (pro or anti)?

### 4. Playbook 06: Commercial Terms Summary (`06-commercial-terms.md`)

Should cover:
- Executive summary generation (IC-ready)
- Key commercial terms extraction
- Conditions to closing
- Termination rights and fees
- Material covenants (pre-close conduct)
- Risk allocation overview

Format should enable quick partner/IC briefing.

### 5. Playbook 07: Redline Comparison (`07-redline.md`)

Should cover:
- Version comparison methodology
- Change categorization (economic vs legal vs housekeeping)
- Prioritized change list
- What changed and why it matters

### 6. Playbook 08: Negotiation Roleplay (`08-roleplay.md`)

Should cover:
- Position analysis (what does each side want?)
- Counter-argument generation
- Fallback positions
- Trade identification (give X, get Y)
- Market data support for positions

## Output Format

For each playbook, provide the complete rewritten content in the same format as `01-definitions.md`:

```markdown
# Playbook XX: [Title]

## Purpose
[One paragraph]

## When to Use
[Bullet list of triggers]

---

## Process Overview
[Two-pass structure]

---

## Step 1: [First Step]
[Content]

...

## Self-Analysis Checklist
[Required yes/no questions]

---

## Observation Writing Guide
[Quality guidance]

---

## Edit Protocol
[Standard protocol]

---

## Follow-on Prompts
[5 prompts]
```

## Quality Criteria

Each playbook should:
1. Be self-contained (reader doesn't need other files to understand)
2. Reference shared infrastructure (term-map.yml, global-tests.md, output-contract.md)
3. Include detection keywords for relevant provisions
4. Have rigorous self-analysis checklists
5. Include observation writing examples (poor vs good)
6. Follow the edit protocol (no edits by default)

## Deliverable

Provide complete markdown content for all 6 playbooks, ready to save as files.
