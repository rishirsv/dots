# Standard_Template.md

Use this template when the task:

- Requires a **structured or multi‑section output** (plan, brief, memo, guide, syllabus, DD report).  
- May involve light web research or tool use, but does **not** hinge on detailed citation handling.  
- Needs some headings or sections, but not a full research protocol.

Target length for the optimized prompt: **120–220 words** (hard cap: **≤220**).

---

## Template Guidance

- Use the minimum number of sections needed, typically:
  - `Role and Objective`  
  - (Optional) `Context`  
  - `Instructions`  
  - `Output Format`  
- For complex tasks, optionally add a single internal planning line right after the Role and Objective section, e.g.: “Think step by step before you answer; do not show your plan.” Do not ask for a visible checklist unless the user explicitly requests a plan or outline.  
- For well‑known document types (launch plan, syllabus, job description, promotion memo), rely on the document type itself to drive structure:
  - Do not over‑specify standard headings unless the user wants something specific.  
  - Only specify key sections or ordering if the user has particular expectations.
- Keep **Role** minimal and omit it altogether for straightforward business writing unless a special persona matters (e.g., “You are a senior product manager…”).
- Merge context into the objective when it can be expressed in a single sentence.  
- Centralize all layout and length details in the **Output Format** section, including a brief length/verbosity hint.  
- Do not require visible checklists or internal plans by default; only add visible checklists if the user explicitly requests a plan/outline.

---

## Standard Template (Skeleton)

```markdown
# Role and Objective
{One or two sentences describing what the assistant should produce and, if relevant, the role it should take and the intended audience.}

# Context
{Optional. Brief bullets or a short paragraph summarizing key inputs, constraints, or assumptions. Omit if not needed.}

# Instructions
- {Instruction 1 about what to cover or analyze.}
- {Instruction 2 about emphasis or prioritization.}
- {Instruction 3 for tone or style, if relevant.}

# Output Format
- {Specify overall structure: headings or sections needed, if any.}
- {If structured data is required, define the schema (fields, types, ordering).}
- {If lists/tables are required, define sort order, tie‑breakers, and what to do if fewer than N items exist.}
- {Simple length/verbosity hint, e.g., “at most 2 short paragraphs” or “aim for a concise 1–2 page memo.”}

---

## Example 1 — Launch Plan for a Coffee Machine

**Unoptimized user prompt**

```text
Create a launch plan for a new consumer coffee machine.
```

**Optimized prompt (Standard)**

```markdown
# Role and Objective
You are a product marketing and go‑to‑market strategist. Create a practical launch plan for a new consumer coffee machine aimed at home users.

# Instructions
- Assume a mid‑range machine with a few differentiating features (e.g., built‑in grinder, programmable timer); state your assumptions briefly.
- Focus on concrete actions for core teams (product, marketing, sales, support, operations) rather than generic theory.
- Highlight timing, channels, and ownership at a level useful for an internal project doc.

# Output Format
- Use the following headings: Executive Summary, Product & Audience Overview, Go‑to‑Market Plan, Risks & Mitigations, Metrics & Success Criteria.
- Under each heading, use a short paragraph and a few bullets as needed.
- Aim for a concise 1–2 page internal launch plan.
```

## Example 2 — Technical Due Diligence Report

**Unoptimized user prompt**

```text
I need a comprehensive technical due diligence report on "TechCorp" based on their architecture docs. Evaluate scalability, security posture (specifically ISO 27001 gaps), and code maintainability. Outline risks, remediation steps, and a final go/no-go recommendation. Highlight technical debt in the legacy backend. Aim for three pages.
```

**Optimized prompt (Standard)**

```markdown
# Role and Objective
You are a senior engineering leader performing technical due diligence on “TechCorp” for an acquisition team. Using the provided architecture documentation, produce a comprehensive technical due diligence report.

# Context
- Inputs: TechCorp’s architecture diagrams, service descriptions, and recent incident summaries.
- Audience: non‑deep technical deal team and investment committee.

# Instructions
- Assess scalability and resilience of the current architecture, calling out key bottlenecks and assumptions.
- Evaluate security posture with explicit attention to ISO 27001‑relevant controls and gaps.
- Analyze codebase and system design for maintainability, with particular focus on technical debt in the legacy backend.
- Identify key risks and propose realistic remediation options, including rough effort/complexity.
- Conclude with a clear go/no-go recommendation for the acquisition, grounded in your findings.

# Output Format
- Use headings: Executive Summary, Architecture & Scalability, Security Posture (ISO 27001), Code Maintainability & Technical Debt, Key Risks & Remediation, Go/No-Go Recommendation.
- Under Executive Summary, provide a short paragraph plus a few bullets summarizing the most important points.
- Under other headings, use short paragraphs and bullets as needed.
- Output Verbosity: aim for a concise 3 page equivalent.
```

## Example 3 — Org-Wide AI Adoption Playbook

**Unoptimized user prompt**

```text
Create a plan for rolling out AI tools across my company, including risks and training.
```

**Optimized prompt (Standard)**

```markdown
# Role and Objective
You are a cross‑functional transformation leader creating an internal playbook for rolling out AI tooling across a mid‑size knowledge‑work company.

# Context
- Company size: ~800 employees across product, engineering, sales, marketing, and customer support.
- Goal: improve productivity and decision‑making while maintaining security, compliance, and employee trust.

# Instructions
- Map the rollout in phases (pilot, expansion, stabilization), with key activities and owners per phase.
- Address policy, security, and compliance considerations at a practical level.
- Define change management tactics (communications, training, champions, feedback loops).
- Call out key risks and failure modes with mitigations.

# Output Format
- Use headings: Executive Summary, Current State & Objectives, Rollout Phases, Change Management Plan, Risks & Mitigations, Metrics & Review Cadence.
- Under each heading, provide short paragraphs plus bullets where helpful.
- Output Verbosity: aim for a concise 2–3 page internal playbook.
```
