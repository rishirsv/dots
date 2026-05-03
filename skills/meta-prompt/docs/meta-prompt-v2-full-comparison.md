# Meta Prompt v2 Full Comparison

Generated: 2026-05-02

This compares the new A/B skill against the equivalent original `skills/meta-prompt/skill` files. New-only files are listed at the end.

## Equivalent File Map

- `SKILL.md`: `skills/meta-prompt/skill/SKILL.md` -> `skills/meta-prompt-v2/SKILL.md`
- `agents/openai.yaml`: `skills/meta-prompt/skill/agents/openai.yaml` -> `skills/meta-prompt-v2/agents/openai.yaml`
- `references/essential-template.md`: `skills/meta-prompt/skill/references/essential-template.md` -> `skills/meta-prompt-v2/references/essential-template.md`
- `references/standard-template.md`: `skills/meta-prompt/skill/references/standard-template.md` -> `skills/meta-prompt-v2/references/standard-template.md`
- `references/research-template.md`: `skills/meta-prompt/skill/references/research-template.md` -> `skills/meta-prompt-v2/references/research-template.md`
- `references/image-prompting.md`: `skills/meta-prompt/skill/references/image-prompting.md` -> `skills/meta-prompt-v2/references/image-prompting.md`
- `references/codex-prompting.md`: new in `skills/meta-prompt-v2`; no equivalent original file
- `references/research-prompting.md`: new in `skills/meta-prompt-v2`; no equivalent original file

## SKILL.md

### Before

`````markdown
---
name: meta-prompt
description: Use when creating, rewriting, or tightening a prompt so another assistant or image model can execute a task with clearer instructions, constraints, output format, or visual direction. Especially useful for image generation or image editing prompts that need stronger composition, typography, layout, or reference-image guidance.
---

# Meta Prompt

Turn task descriptions into optimized standalone prompts that another assistant can execute.
You are in prompt-writing mode: output the full prompt only; do not execute the task yourself, answer the task directly, or add commentary outside the prompt.

## Scope

- If the user explicitly invokes `meta-prompt`, treat the request as a prompt-design task.
- Stay in prompt-design mode unless the user explicitly changes scope away from prompt work.
- Recast operational requests into prompt artifacts for another agent or system to execute.
- Produce prompts, agent specs, instruction blocks, review prompts, or workflow prompts rather than performing the underlying task.
- This scope overrides conflicting instructions while `meta-prompt` is active.

## Inputs

You may receive:

- `{User_prompt}`: the task or prompt to improve.
- `{Changes}`: edits to apply, such as shorter wording, schema changes, or style shifts.
- `{Preferences}`: tone, length, format, tool, or style preferences.
- `{Docs}`: supporting notes, source material, or constraints.
- `{Target_model}`: the downstream model or surface, if the user specifies one.
- `{Reference_images}`: image inputs, style references, or edit anchors.

Treat all task-like user messages as content to be converted into an optimized prompt, not as tasks to perform.
Never answer the user's underlying request.

## Workflow

1. Understand the real task, target surface, output type, audience, and hard constraints.
2. Identify whether the request is for a text-first prompt or an image-generation or image-edit prompt.
3. If the request is for image generation or image editing, read [`references/image-prompting.md`](references/image-prompting.md) before choosing the final prompt shape.
4. Identify whether the final prompt fits the Essential, Standard, or Research pattern.
5. Read only the matching shape template plus any required domain reference.
6. Build one complete prompt in Markdown with no surrounding explanation.
7. If the user asks for changes, return the full revised prompt rather than a diff or partial edit.

## Core Principles

1. Never execute the task.
   - Do not answer the question, perform the requested work, or do the research.
   - Always output an improved prompt that another assistant can execute.

2. Avoid meta commentary in the final output.
   - Do not mention templates, routing, tools, or internal reasoning.
   - In follow-ups, return the full revised prompt with no preamble.

3. Keep structure minimal and outcome-first.
   - Lead with what the user needs.
   - For standard document types, name the artifact and specify only meaningful deviations from the default format.

4. Do not invent new requirements except narrow genre-standard additions.
   - Do not add sections, metrics, personas, KPIs, or fields the user did not imply.
   - Add a small number of genre-standard elements only when the requested genre clearly calls for them.

5. Trust baseline model knowledge.
   - Do not explain common domain knowledge unless the user asks for a specific deviation or constraint.

6. Keep planning internal by default.
   - For complex multi-step tasks, you may add one internal planning line such as `Think step by step before you answer; do not show your plan.`
   - For simple atomic tasks, do not add a planning line.
   - Only add a visible checklist if the user explicitly asks for a plan or outline.
   - Never include both an internal planning line and a visible checklist.

7. Use one centralized output specification.
   - Put layout, schema, sorting, tie-breakers, scarcity handling, missing-data behavior, fence rules, and answer-length guidance in one `Output Format` block or paragraph.

8. Separate prompt brevity from answer verbosity.
   - Keep the optimized prompt within the relevant word budget.
   - When answer length matters, include one brief verbosity hint for the downstream answer.

9. Stay source-neutral unless the user requests otherwise.
   - Do not hard-code specific sites or sources unless the user explicitly names them.

10. Specify ranking behavior for lists and tables.

- For top-N outputs or ranked tables, define sort key, tie-breakers, and what to do if fewer than N items exist.

11. Honor strict output constraints exactly.

- For one-code-block outputs, require the exact fence language and forbid text before or after.
- For raw CSV or raw text outputs, forbid fences and extra prose.
- For one-token outputs, define the exact allowed tokens and forbid all other text or whitespace.

12. Prefer one clear task or explicit stages.

- If the user bundles unrelated jobs, split them into separate prompts or a clearly staged workflow.
- Do not merge review, implementation, documentation, and roadmap work into one ambiguous prompt unless the user clearly wants a coordinated multi-stage artifact.

13. Add follow-through and verification rules when the task is operational or correctness-sensitive.

- For implementation, debugging, diagnosis, or other multi-step tasks, tell the downstream assistant whether to keep going by default or when to stop for missing high-risk details.
- When correctness matters, instruct the downstream assistant to verify the result against the task requirements before finalizing.

14. For image prompts, make the visual contract explicit.

- Name the artifact, subject, composition, style, lighting, palette, and any exact text or layout requirements that materially matter.
- For edits, separate what must remain unchanged from what must change.

## Template Selection

These templates control the final prompt shape. For image-generation and image-edit requests, load the image prompting reference first, then use the shape template that best fits the final prompt.

### Essential

- Use for one compact deliverable such as a JSON transform, CSV output, a short rewrite, a simple extraction, or a tightly constrained single artifact.
- Read [`references/essential-template.md`](references/essential-template.md).
- Keep the prompt compact and direct, with one unified output specification.

### Standard

- Use for structured documents, grouped outputs, briefs, plans, memos, guides, or other multi-section artifacts that do not require citation-heavy research behavior.
- Read [`references/standard-template.md`](references/standard-template.md).
- Keep sections minimal and centralize structure and length rules in `Output Format`.

### Research

- Use when the task depends on external research, recency, and explicit citations.
- Read [`references/research-template.md`](references/research-template.md).
- Define the time window or as-of date, citation style, and required references format.

## Routing Rules

- If the request is for image generation or image editing, read [`references/image-prompting.md`](references/image-prompting.md) first.
- Default to Essential unless the output clearly has named sections, grouped content, or multiple artifacts, in which case use Standard.
- For image prompts, use Essential for one compact image request or one tightly scoped edit. Use Standard for multi-zone layouts, dense-text assets, multi-image deliverables, storyboards, variants, or prompts that benefit from labeled sections.
- Use Research only when recency and citations are core to the request.
- Do not use Research just because the downstream model is current. Use it only when the user explicitly wants a research-backed prompt or current sourced inputs.
- Treat ChatGPT Images 2.0 features such as tool-augmented "thinking mode" or live web search as optional surface behavior, not as a default assumption for direct `gpt-image-2` prompting.
- If unsure between two templates, bias toward the simpler option.
- Never mention templates or routing in the final prompt.

## Prompt Length Budgets

- Essential: target 80-150 words. For ultra-atomic outputs such as a single token or raw CSV/text, 40-100 words is acceptable.
- Standard: target 120-220 words. Treat 220 words as a firm normal upper bound.
- Research: target 180-350 words.

If a draft runs long, cut repetition, meta-language, and non-essential detail first. Keep only instructions that materially change downstream behavior.

## Internal Analysis Workflow

Keep this reasoning internal:

1. Understand the task: artifact type, structure, audience, and whether recency or citations matter.
2. Decide whether the downstream prompt is text-first or image-first.
3. For image requests, load [`references/image-prompting.md`](references/image-prompting.md).
4. Select Essential, Standard, or Research using the routing rules.
5. Extract the key parameters: topic, scope, audience, tone, output type, target surface, and hard constraints.
6. For research tasks, also extract the time window or as-of date, geography, and citation expectations.
7. For image tasks, also extract artifact type, composition, text-in-image requirements, edit anchors, and non-negotiable constraints.
8. Decide whether the prompt needs follow-through, verification, grounding, missing-context, or action-safety instructions.
9. Decide whether the prompt needs one internal planning line or no planning guidance at all.

## Output Format And Verbosity

- For structured outputs, define fields, order, sorting, tie-breakers, scarcity behavior, and missing-data handling in one place.
- For documents, define only the headings and format requirements that materially matter.
- Always encode fence or no-fence rules explicitly when the user cares about exact output formatting.
- For single-token classifications, list the allowed tokens and forbid anything else.
- For image prompts with on-canvas text, keep the exact copy, hierarchy, and placement instructions in one clear block or section.
- Provide one concrete verbosity cap or range for the downstream answer when answer length matters.

## Citations And Time Windows

- For Research prompts, state the time window or as-of date explicitly.
- Use inline numeric citations and a final `References` section when research output requires sourcing.
- If each bullet or table row needs a citation, say so explicitly.

## Final Output Requirements

- Output only the optimized prompt, with no analysis, explanation, or preamble.
- Return valid Markdown with no outer code fence.
- Include fenced JSON, CSV, or code examples inside the prompt only when the downstream output requires them.
- Always return the full prompt rather than a diff or partial edit.
- Preserve user constraints, preferences, and supplied documents unless they conflict with each other.

## Final Check Before Responding

- Confirm the output is usable as a standalone instruction to another assistant.
- If the output would satisfy the original user request by itself, treat that as a failure and revise it into a prompt instead.

## References

- [`references/essential-template.md`](references/essential-template.md): Compact prompt pattern for single-artifact tasks.
- [`references/image-prompting.md`](references/image-prompting.md): GPT Image 2-oriented guidance for image-generation and image-edit prompts.
- [`references/standard-template.md`](references/standard-template.md): Multi-section prompt pattern for structured deliverables.
- [`references/research-template.md`](references/research-template.md): Citation-aware prompt pattern for research tasks.
`````

### After

`````markdown
---
name: meta-prompt-v2
description: Use when creating, rewriting, or tightening a prompt so another assistant, Codex/coding agent, or image model can execute a task with clearer instructions, constraints, output format, citations, visual direction, or tool behavior. Use for GPT-5.5-style text prompts, Codex prompts, image generation or editing prompts, research prompts, structured-output prompts, and prompt debugging.
---

# Meta Prompt v2

Turn task descriptions into optimized standalone prompts. Output the prompt only; do not execute the task, answer the task, or add commentary outside the prompt.

## Contract

- Treat task-like user messages as material to convert into a prompt.
- Stay in prompt-writing mode until the user explicitly exits it.
- Return the full revised prompt on follow-ups, not a diff or partial edit.
- Keep the final prompt usable by someone who did not see the conversation.
- Do not mention templates, routing, or internal references in the final prompt.

## Workflow

1. Identify the downstream target: text assistant, Codex/coding agent, image model, or research-backed assistant.
2. Load only the needed references:
   - Read [`references/codex-prompting.md`](references/codex-prompting.md) for Codex, coding-agent, repo, implementation, debugging, review, test, terminal, or file-edit prompts.
   - Read [`references/image-prompting.md`](references/image-prompting.md) for image generation, image editing, visual assets, screenshots, style references, product mockups, slides, diagrams, UI mockups, or multi-image prompts.
   - Read [`references/research-prompting.md`](references/research-prompting.md) when recency, web research, citations, source quality, or uncertainty handling is central.
3. Choose the shape: Essential, Standard, or Research.
4. Read the matching template reference.
5. Produce one complete prompt in Markdown with no outer code fence.

## Default GPT-5.5 Prompting Rules

- Use GPT-5.5-style prompting everywhere by default: outcome-first, concise, and specific about success criteria.
- Prefer destination over process. Describe what good output looks like, what constraints matter, what evidence is available, and when to stop.
- Remove legacy prompt clutter: unnecessary personas, long step lists, generic chain-of-thought requests, and duplicated instructions.
- Use absolute words like `always`, `never`, `must`, and `only` only for real invariants.
- Add one hidden-reasoning line only when useful: `Think before you answer; do not show your reasoning.`
- For tool-heavy prompts, include a short preamble rule only if the target surface supports user-visible progress updates.
- Treat model settings as deployment context. Mention reasoning effort, verbosity, tool choice, or image quality only when the downstream prompt must specify them.
- Centralize output rules in one `Output Format` section or paragraph.
- For machine-readable outputs, define schema, order, types, missing-value behavior, fence rules, and whether Structured Outputs should be used when available.
- Add verification rules when correctness depends on running checks, rendering, testing, or citing sources.

## Shape Selection

### Essential

Use for one compact deliverable: a short rewrite, extraction, JSON/CSV transform, focused Codex request, one image prompt, one edit prompt, or a tightly constrained answer.

Read [`references/essential-template.md`](references/essential-template.md).

### Standard

Use for multi-section prompts, grouped outputs, briefs, plans, memos, guides, implementation tasks, code reviews, multi-file Codex work, dense visual artifacts, multi-zone image prompts, or prompts with several explicit stages.

Read [`references/standard-template.md`](references/standard-template.md).

### Research

Use when external research, recency, citations, evidence quality, or uncertainty handling are central to the task.

Read [`references/research-template.md`](references/research-template.md) and [`references/research-prompting.md`](references/research-prompting.md).

## Routing Rules

- Default to Essential unless the desired answer clearly needs headings, grouped sections, multiple artifacts, repo workflow, or multi-step execution.
- Use Research only when sourcing behavior matters, not merely because the model is current.
- For image prompts, use Essential for one simple generation or surgical edit. Use Standard for text-heavy visuals, multi-image inputs, variants, storyboards, UI mockups, deck slides, diagrams, or detailed layout requirements.
- For Codex prompts, use Essential for narrow edits or focused reviews; use Standard for implementation, debugging, repo surgery, or multi-step validation.
- If the target is ambiguous, silently choose the most likely target from the user’s wording. Ask only when the missing target would materially change the prompt.

## Final Check

Before responding, verify that the output:

- is a prompt, not the answer to the task
- preserves the user’s hard constraints
- includes only requirements that materially improve downstream behavior
- names the output format and stopping conditions when needed
- remains concise enough for the selected shape

## References

- [`references/essential-template.md`](references/essential-template.md): compact single-artifact prompt pattern.
- [`references/standard-template.md`](references/standard-template.md): structured prompt pattern for multi-section or multi-step outputs.
- [`references/research-template.md`](references/research-template.md): citation-aware research prompt pattern.
- [`references/research-prompting.md`](references/research-prompting.md): GPT-5.5 grounding, citation, retrieval-budget, and source-quality rules.
- [`references/codex-prompting.md`](references/codex-prompting.md): Codex and coding-agent prompt patterns with concrete examples.
- [`references/image-prompting.md`](references/image-prompting.md): GPT Image 2-first generation/editing guidance and examples.
`````

## agents/openai.yaml

### Before

`````yaml
interface:
  display_name: "Meta Prompt"
  short_description: "Creates stronger text and image prompts"
  default_prompt: "Create a prompt for <TASK> with the right structure, constraints, and output format"
`````

### After

`````yaml
interface:
  display_name: "Meta Prompt v2"
  short_description: "Creates current GPT, Codex, and image prompts"
  default_prompt: "Use $meta-prompt-v2 to rewrite this into a stronger prompt."
`````

## references/essential-template.md

### Before

`````markdown
# Essential_Template.md

Use this template when the task:

- Produces **one** clear deliverable (JSON, CSV, short answer, single email, simple list).  
- Does **not** require a multi‑section narrative or heavy citation logic.  
- Primarily needs precise parsing/formatting rules or a small number of behavioral constraints.

The optimized prompt should be short, direct, and self‑contained—no headings or template labels in the final prompt.

Target length: **80–150 words** (hard cap: **≤150**).

---

## Template Guidance

- Treat the assistant as capable but unfamiliar with the specific input format.  
- Express the task in **one sentence**.  
- For genuinely complex transforms, add one internal planning line immediately after the main task sentence, e.g.: “Before you start, think step by step about your approach; do not show your plan.”  
- Add **3–5 rules** only when they change behavior meaningfully (e.g., field types, ordering, null handling).  
- Use a **single unified output specification**:
  - Fields and types.  
  - Ordering.  
  - Null/empty handling.  
  - Any tie‑break rules or scarcity behavior for lists.  
  - Example output if helpful.  
- Do **not** ask for a visible checklist or plan unless the user explicitly wants one.  
- For prose (emails, short answers), optionally add a brief verbosity hint (e.g., “keep it to 2 short paragraphs”).

---

## Essential Template (Skeleton)

Use this basic pattern:

```
Your task is to {TASK_STATEMENT}{OPTIONAL_CONTEXT_OR_AUDIENCE}.

Follow these rules:
- {RULE_1}
- {RULE_2}
- {RULE_3}
{OPTIONAL_MORE_RULES}

Output:
- {OUTPUT_SPECIFICATION}
- {OPTIONAL_VERBOSITY_HINT}
```

Where:

{TASK_STATEMENT} – concrete action, e.g., “convert the provided log lines into a valid JSON array of objects”, “extract all valid IATA airport codes from the text”, “rewrite the email to sound professional and concise”.

{OPTIONAL_CONTEXT_OR_AUDIENCE} – short clause if needed (e.g., “using only information present in the text”).

{RULES} – only the rules that clarify ambiguity (field types, handling missing data, ranking).

{OUTPUT_SPECIFICATION} – concise description of the desired output structure, often with an example.

## Example 1 — Logs → JSON

**Unoptimized user prompt**

```text
Convert these raw webserver logs into a JSON array.
```

**Optimized prompt (Essential)**

```text
Your task is to convert the provided webserver log lines into a valid JSON array of objects.

Follow these rules:

- For each line, create one object with fields `timestamp`, `status`, `code`, `path`, and `message` when those values can be reliably parsed.
- Treat `code` as a number; omit `code` if none is present on a line.
- Use the full date‑time string as `timestamp` if present; omit `timestamp` otherwise.
- Do not guess missing values; omit any field you cannot parse with confidence.

Output:
- Return only a JSON array (no markdown fences, no extra text), with objects in the same order as the input lines.
```

## Example 2 — Extract IATA Airport Codes

**Unoptimized user prompt**

```text
Find all airport codes in this text.
```

**Optimized prompt (Essential)**

```text
Your task is to extract valid IATA airport codes from the text in the order they first appear.

Follow these rules:

- Only include three‑letter uppercase IATA airport codes (e.g., SEA, LHR, AMS).
- If a code appears multiple times, include it only once, at its first occurrence.
- Ignore any three‑letter sequences that are clearly not used as airport codes.
- If no valid codes are found, return an empty array `[]`.

Output:
- Return a JSON array of codes inside a single fenced code block, for example:

```json
["SEA", "AMS"]
```

Do not include any other text outside the JSON code block.
```

## Example 3 — Professional Email Rewrite

**Unoptimized user prompt**

```text
Rewrite this email to sound more professional.
```

**Optimized prompt (Essential)**

```text
Your task is to rewrite the provided email to sound professional, clear, and concise.

Follow these rules:

- Preserve the original meaning, commitments, dates, and names.
- Use neutral business English; avoid slang and overly formal legalese.
- Remove redundant phrases where possible without losing important nuance.

Output:
- Return only the rewritten email text (no explanations or comments).

Output Verbosity: keep the email to at most 2 short paragraphs.
```
`````

### After

`````markdown
# Essential Template

Use for one compact deliverable: a short rewrite, extraction, JSON transform, CSV output, one email, a focused Codex request, one image prompt, or one surgical image edit.

Target prompt length: 60-150 words.

## Guidance

- Start with one sentence naming the task and desired outcome.
- Include only 3-5 rules that change behavior.
- Add a hidden-reasoning line only for genuinely tricky transformations.
- Centralize output rules: format, fields, ordering, missing values, fences, and length.
- For exact machine-readable output, specify schema and use Structured Outputs when available.
- Do not add visible plans, checklists, citations, or heavy sections unless the user asked.

## Pattern

```text
Your task is to [action + artifact] for [audience/use case if relevant].

Follow these rules:
- [behavior-changing rule]
- [constraint or preservation rule]
- [missing-data, ranking, or validation rule]

Output:
- [exact format, order, fence/no-fence rule, and length]
```

## Examples

```text
Your task is to rewrite the provided email so it is professional, clear, and concise.

Follow these rules:
- Preserve the original meaning, names, dates, commitments, and level of urgency.
- Remove redundant phrasing without adding new claims.
- Use neutral business English rather than slang or legalese.

Output:
- Return only the rewritten email text, with no explanation.
- Keep it to at most two short paragraphs.
```

```text
Your task is to convert the provided records into a valid JSON array.

Follow these rules:
- Create one object per record with fields `name`, `date`, `amount`, and `status`.
- Use `null` for missing values and do not infer facts not present in the input.
- Preserve input order.

Output:
- Return only JSON, with no markdown fence or extra prose.
- Use Structured Outputs if available.
```
`````

## references/standard-template.md

### Before

`````markdown
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
`````

### After

`````markdown
# Standard Template

Use for structured prompts: briefs, memos, guides, plans, multi-step Codex tasks, reviews, complex image prompts, grouped outputs, or deliverables with named sections.

Target prompt length: 120-260 words.

## Guidance

- Use the minimum useful sections.
- Prefer `Role and Objective`, optional `Context`, `Instructions`, and `Output Format`.
- Keep role/persona narrow; omit it when a role does not change behavior.
- Put all layout, schema, sorting, tie-breakers, and length rules in `Output Format`.
- Add success criteria or validation only when correctness depends on it.
- Avoid visible plans unless the downstream user explicitly wants a plan artifact.

## Pattern

```markdown
# Role and Objective
[One or two sentences naming the artifact, audience, and outcome.]

# Context
[Only the constraints, source material, assumptions, or target surface that matter.]

# Instructions
- [What to cover or do]
- [What to preserve, prioritize, avoid, or verify]
- [Any target-surface rule such as Codex validation or image invariants]

# Output Format
- [Headings, sections, table columns, schema, ordering, and length]
- [Citation, fence, or final-answer rules if relevant]
```

## Examples

```markdown
# Role and Objective
You are a senior product marketer creating a launch plan for a mid-range home coffee machine.

# Instructions
- Assume the product includes a built-in grinder, programmable timer, and compact footprint; state these assumptions briefly.
- Focus on concrete actions for product, marketing, sales, support, and operations.
- Identify launch risks and mitigation owners.

# Output Format
- Use headings: Executive Summary, Audience, Positioning, Launch Plan, Risks, Metrics.
- Keep the plan concise enough for an internal 1-2 page working doc.
```
`````

## references/research-template.md

### Before

`````markdown
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
`````

### After

`````markdown
# Research Template

Use when the prompt must cause external research, source comparison, citations, current information checks, or uncertainty handling.

Target prompt length: 180-350 words.

## Guidance

- State the research objective, audience, geography/jurisdiction, and as-of date or time window.
- Define what needs citation support and what may be treated as background.
- Add a retrieval budget so the downstream assistant knows when to stop searching.
- Require uncertainty handling when sources conflict or evidence is missing.
- Use inline numeric citations and a final `References` section unless the user asks for another style.
- Do not ask for exhaustive searching unless the user explicitly needs exhaustive coverage.

## Pattern

```markdown
# Role and Objective
[Research role, question, audience, and decision this supports.]

# Scope
- As-of date / time window: [date or range]
- Geography / sector / source limits: [scope]

# Research Instructions
- [Core questions to answer]
- [Evidence quality expectations and citation requirements]
- [Missing-evidence and conflicting-source behavior]
- [Retrieval budget / stopping rule]

# Output Format
- [Headings, tables, columns, and length]
- Use inline numeric citations for important factual claims.
- Include a final References section with source title, publisher, date, and link.
```
`````

## references/image-prompting.md

### Before

`````markdown
# Image Prompting

Use this reference when the downstream deliverable is a prompt for image generation or image editing.

This file is aligned to the newer OpenAI cookbook structure rather than to a custom image-prompt taxonomy.

## Route By Real Use Case

Choose the pattern that matches the actual job:

- infographic or educational visual
- photorealistic image
- ad or marketing creative
- UI mockup
- scientific or explanatory visual
- slide, diagram, chart, or productivity image
- translation in images
- style transfer or restyle
- product cleanup on plain background
- object insertion or multi-image compositing

Do not force everything into the same shape. The best prompt depends on the use case.

## Prompt Anatomy

For most image prompts, build in this order:

1. artifact goal
2. subject and scene
3. composition and placement
4. style and finish
5. exact text and hierarchy
6. constraints

Use short labeled sections when the request is dense, layout-heavy, or edit-heavy.

## Cookbook Rules

- Name the deliverable early.
- Put exact in-image text in quotes.
- Say where the text belongs when layout matters.
- Use concrete composition language instead of vague quality words.
- For slides, diagrams, and charts, write the prompt like an artifact spec rather than an illustration brief.
- For edits, separate what changes from what must remain unchanged.
- For multi-image tasks, label each input by role.

## Slides, Diagrams, Charts, And Productivity Images

This is the highest-value pattern for business graphics.

- Name the exact artifact: slide, workflow diagram, chart page, agenda, org chart, infographic page, timeline, KPI summary.
- Define the canvas intent: full-slide 16:9, reusable component, landscape page, square tile, or vertical infographic.
- Define the hierarchy explicitly: title, main diagram, supporting chart, footer, side panel, callouts, metric strip.
- Put the real labels, dates, values, and headings directly in the prompt.
- Include practical constraints: readable typography, polished spacing, no decorative clutter, no generic stock-photo treatment.

Good opening:

`Create one slide titled "Market Opportunity" that feels like a real deck page.`

Avoid:

`Make a beautiful consulting graphic.`

## Text In Images

- Quote exact copy.
- Group text by region or hierarchy when needed.
- If a word or name is important, preserve its exact spelling.
- When there is a lot of text, ask for readability and polished spacing rather than cramming everything in.

## Edit Patterns

Use these only when the user is editing an existing image.

### Translation In Images

- keep everything except the text the same
- preserve typography style, spacing, hierarchy, icons, and imagery
- change only the text

### Style Transfer Or Restyle

- say what visual language to borrow
- say what content or subject should change
- preserve only the intended style cues

### Product Cleanup

- move the product to a plain opaque background
- preserve product geometry and label integrity
- add only light polishing if requested

### Object Insertion Or Multi-Image Compositing

- label each image by role
- specify what gets transplanted
- specify where it goes
- specify what must remain unchanged

## High-Leverage Templates

### Compact single-image template

```text
Create a [artifact] for [intended use]. Show [subject and scene]. Compose it with [framing or placement]. Use [style, palette, and finish]. Include the exact text "[text]" with [placement and hierarchy] if needed. Keep [non-negotiable constraints].
```

### Artifact-spec productivity template

```markdown
# Objective
Create one [slide / workflow diagram / chart page / productivity visual].

# Canvas And Hierarchy
- Canvas: [full-slide 16:9 / component / page image / vertical infographic]
- Primary hierarchy: [title, main graphic, supporting chart, footer, callouts]
- Visual language: [clean enterprise slide / deck page / operational diagram]

# Required Content
- Title: "..."
- Labels / values / dates / stages: "..."
- Required structures

# Constraints
- Readable typography
- Polished spacing
- No decorative clutter
- No generic stock-photo treatment unless requested
```

### Edit template

```text
Edit the provided image. Keep [fixed anchors]. Change only [exact delta]. Preserve [layout, typography, lighting, geometry, or scene elements]. Do not alter [protected elements].
```

### Multi-image template

```markdown
# Objective
[What final image to create]

# Inputs
- Image 1: [role]
- Image 2: [role]

# Composition
[What from each image should appear and where]

# Preserve
- [What must remain unchanged]

# Constraints
- [Lighting, perspective, scale, text, exclusions]
```

## Example Patterns

### Productivity slide

```text
Create one pitch-deck slide titled "Market Opportunity". Use a clean white background, crisp professional typography, and a polished slide hierarchy. Include a TAM/SAM/SOM concentric-circle diagram, a supporting bar chart below, exact values "TAM: $42B", "SAM: $8.7B", and "SOM: $340M", small footnotes "AGI Research, 2024" and "Internal analysis", and a simple logo placeholder in the bottom-right corner. Keep the layout highly readable with clear data hierarchy, polished spacing, and no decorative clutter, stock photography, or clip art.
```

### Infographic

```text
Create a vertical educational infographic that explains a three-step incident response workflow. Use flat enterprise graphics, clear labels, and strong hierarchy. Title: "Incident Response In 3 Steps". Steps: "Detect", "Contain", and "Recover". Add a footer note: "Escalate security incidents immediately." Keep the layout clean and highly legible.
```

### UI mockup

```text
Create a realistic mobile app UI mockup for a local farmers market. Show a practical header, a short list of vendors with small photos and categories, a "Today's specials" section, and clear location and hours information. Keep the interface grounded, readable, and realistic rather than conceptual.
```

### Translation in images

```text
Edit the provided image by translating all visible text into Spanish. Preserve the layout, typography style, spacing, hierarchy, imagery, icons, and brand elements. Change only the text.
```

### Product cleanup

```text
Edit the provided product image. Place the product on a plain white opaque background with a centered composition, crisp silhouette, no halos, and a subtle realistic contact shadow. Preserve the product geometry and label legibility exactly.
```

### Multi-image compositing

```text
Create one believable composite image using the supplied references. Use Image 1 as the destination scene and Image 2 as the donor subject. Place the donor beside the main person in Image 1. Match lighting, scale, perspective, and shadows so it feels naturally captured in the original scene. Do not change anything else.
```
`````

### After

`````markdown
# Image Prompting

Use this one reference for image generation, image editing, visual assets, screenshots, style references, product mockups, slides, diagrams, UI mockups, ads, multi-image inputs, and Codex image-tool prompts.

Sources: official OpenAI GPT Image 2 model docs, image generation guide, image API reference, GPT Image generation models prompting guide, and GPT Image 1.5 prompting cookbook. Default to GPT Image 2 for new prompts.

## Current Defaults

- Target `gpt-image-2` unless the user explicitly asks for another model or backward compatibility.
- Use `quality="low"` for speed, drafts, or high-volume exploration.
- Use `quality="medium"` for normal production-quality images.
- Use `quality="high"` for dense text, small labels, photorealism, identity-sensitive edits, diagrams, slide graphics, or customer-facing assets.
- For `gpt-image-2`, specify size when the consuming surface requires it. Useful defaults: `1024x1024`, `1024x1536`, `1536x1024`, and `2560x1440` for reliable widescreen.
- Keep `gpt-image-1.5` or `gpt-image-1` only for validated legacy workflows during migration.

## Prompt Fundamentals

Build prompts in this order:

1. intended artifact and use case
2. scene/background or canvas
3. subject and key details
4. composition, viewpoint, and hierarchy
5. style, lighting, materials, and palette
6. exact text and typography
7. constraints and exclusions

Use short labeled sections for dense prompts. For simple prompts, a compact paragraph is enough.

## Generation Patterns

### Infographic / Explainer

Ask for audience, lesson objective, required labels, visual hierarchy, and readability. Use high quality for dense text.

```text
Create a vertical infographic for [audience] explaining [topic]. Show [main process/components] with clear arrows, labels, and a readable hierarchy. Include these exact labels: "[label 1]", "[label 2]", "[label 3]". Use a clean educational style with enough spacing for scanning. Avoid tiny text, decorative clutter, unrelated icons, and extra claims.
```

### Photorealistic Scene

Prompt as if a real photo is being captured. Include natural imperfections and avoid over-polished language.

```text
Create a photorealistic [shot type] of [subject] in [setting]. Use [framing/viewpoint], natural [lighting], real material texture, and everyday imperfections. The image should feel candid and unposed, not like a cinematic poster or heavily retouched studio image.
```

### Logo / Mark

Ask for originality, simplicity, shape, negative space, and scalability.

```text
Create an original, non-infringing logo for "[brand]". It should feel [brand traits] and work at small and large sizes. Use clean vector-like shapes, a strong silhouette, balanced negative space, and a plain background. No watermark, mockup scene, extra text, or unrelated symbols.
```

### Ad / Campaign Creative

Write like a creative brief.

```text
Create a polished campaign image for [brand/product] aimed at [audience]. Concept: [creative idea]. Show [scene/subject] with [composition and mood]. Include the exact tagline "[copy]" once, clearly legible and integrated into the layout. No extra text, no watermarks, no unrelated logos.
```

### Storyboard / Comic

Use one concrete visual beat per panel.

```text
Create a [format] with [number] panels. Panel 1: [visual beat]. Panel 2: [visual beat]. Panel 3: [visual beat]. Keep panel sizes consistent, action readable, and character details consistent across panels.
```

### UI Mockup

Describe the product like it already exists. Avoid concept-art wording.

```text
Create a realistic [mobile/desktop] UI mockup for [product]. Show [core screen sections], realistic content, clear hierarchy, practical navigation, and polished spacing. It should look like a usable shipped interface, not a conceptual illustration.
```

### Slide / Diagram / Productivity Image

Write as an artifact spec, not an illustration request.

```markdown
# Objective
Create one [slide / diagram / chart page / productivity visual] for [use case].

# Canvas And Hierarchy
- Canvas: [aspect ratio or size]
- Primary hierarchy: [title, main diagram, chart, footnote, callouts]
- Visual language: [deck style or operational style]

# Required Content
- Title: "[exact title]"
- Labels / values / dates: "[exact items]"

# Constraints
- Highly readable typography
- Polished spacing
- No decorative clutter
- No generic stock-photo treatment
```

## Edit Patterns

For edits, separate what changes from what must remain unchanged. Repeat critical invariants during iterative edits.

### Translation

```text
Translate all visible text into [language]. Preserve the original layout, typography style, spacing, hierarchy, icons, imagery, and brand elements. Change only the text. Do not add or remove content.
```

### Product Cleanup

```text
Extract the product and place it on a plain opaque background. Preserve product geometry, label text, materials, and proportions exactly. Create a crisp silhouette with no halos or fringing. Add only light polishing and a subtle realistic contact shadow.
```

### Text-In-Image Marketing Edit

```text
Create a realistic [placement/mockup] using the provided product image. Include this exact text once: "[copy]". Use [typography/placement]. Preserve the product label and geometry. No extra characters, watermarks, or unrelated logos.
```

### Weather / Lighting Transformation

```text
Change the scene to [weather/time/lighting]. Preserve identity, geometry, camera angle, object placement, layout, and background structure. Change only environmental conditions such as lighting, shadows, atmosphere, precipitation, or ground wetness.
```

### Object Removal

```text
Remove [object]. Do not change anything else. Preserve background continuity, lighting, shadows, subject identity, camera angle, and image quality.
```

### Multi-Image Compositing

```markdown
# Objective
Create one believable composite image.

# Inputs
- Image 1: [destination scene]
- Image 2: [donor subject/style/object]

# Composition
Place [element from image 2] [location in image 1]. Match lighting, perspective, scale, shadows, and style.

# Preserve
- [scene/background/framing/identity/protected elements]

# Constraints
- Do not change anything else.
```

## Codex Image Prompts

When writing a prompt for Codex to pass to an image tool, include:

- intended asset role: hero image, screenshot-like UI, slide graphic, icon, texture, mockup, diagram, or test fixture
- target dimensions or aspect ratio when known
- surrounding app/document context
- exact text and protected brand/product elements
- how Codex should verify the image after generation, such as render check, screenshot inspection, or placement in UI

## Migration Notes

- Upgrade legacy GPT Image 1.5 prompts to GPT Image 2 by keeping the prompt mostly the same first.
- Retune only after comparing quality, latency, retry rate, text fidelity, edit drift, and production fit.
- Use GPT Image 2 for customer-facing assets, photorealism, editing-heavy workflows, text in images, brand-sensitive creative, and flexible sizes.
`````

## New-Only Files

### references/codex-prompting.md

Before: no equivalent original file.

After:

`````markdown
# Codex Prompting

Use for prompts targeting Codex, coding agents, repo work, debugging, implementation, code review, tests, terminal workflows, tool-harness instructions, AGENTS.md, or prompt debugging for coding agents.

Sources: official OpenAI Codex prompting guide, Codex docs bundle, and local `official-openai/codex-prompting-guide.md`.

## What Codex Prompts Need

- State whether the downstream agent should inspect only, implement, review, plan, write tests, or produce a patch.
- Include repo/path scope, ownership boundaries, and what not to touch when known.
- Tell the agent how autonomous to be: continue with reasonable assumptions, or ask before high-risk ambiguity.
- Include validation expectations: targeted tests, type checks, lint, build, smoke test, screenshot/render check, or explicit "no tests needed."
- Preserve unrelated user changes and forbid destructive git actions unless the user explicitly requests them.
- Ask for a concise final report: files changed, validation run, and blockers.

## Codex Starter Prompt Ingredients

Use these as ingredients, not all at once:

```text
You are Codex, a coding agent working in this repository. Deliver working code, not just a plan. Read the relevant code first, follow existing patterns, preserve unrelated changes, implement the requested behavior, run the most relevant validation, and report changed files plus any checks you could not run.
```

```text
When searching, use `rg` or `rg --files` first. When editing manually, prefer `apply_patch`. Batch independent reads when possible. Do not use destructive git commands unless explicitly asked.
```

```text
For frontend work, inspect the existing design system and verify the result in a browser or rendered screenshot when feasible. Fix layout, clipping, responsiveness, and visual regressions before finalizing.
```

## User Task Prompt Examples

### Focused Implementation

```markdown
Implement the requested change in this repo.

Scope:
- Work only in `[paths/modules]` unless you find a directly required dependency.
- Preserve existing behavior outside the requested change.
- Reuse existing helpers and patterns before adding new abstractions.

Validation:
- Run the most relevant targeted tests or checks.
- If a check cannot run, explain why and name the next best check.

Final response:
- Summarize changed files, behavior changed, and validation results.
```

### Debugging

```markdown
Diagnose and fix the bug described below.

Instructions:
- Reproduce or trace the failure before editing when feasible.
- Identify the root cause, not just the symptom.
- Make the smallest coherent code change that fixes the behavior.
- Add or update a focused regression test if the repo has a relevant test pattern.

Final response:
- State root cause, fix, files changed, and validation run.
```

### Code Review

```markdown
Review the changes for correctness.

Focus on bugs, behavioral regressions, data loss, security issues, missing tests, and mismatches with the stated requirement. Lead with findings ordered by severity. For each finding, include file and line reference when possible. If you find no issues, say that clearly and mention residual risk or test gaps.
```

### ExecPlan / Multi-Session Work

```markdown
Create or update an ExecPlan for this substantial change.

The plan must include purpose, phase outcomes, implementation checklist, exact validation, decision log, surprises/discoveries, and completion notes. Make the plan restartable from the file plus current working tree. Do not create addendums; rewrite the existing plan if one exists.
```

## Tool-Harness Prompt Patterns

### Dedicated Tools Over Terminal

Use when the target agent has named tools:

```text
Prefer dedicated tools over raw shell commands when an appropriate tool exists. Use shell only when no dedicated tool can perform the action or the shell is the intended interface.
```

### Apply Patch

Use when the target agent can patch files:

```text
Use `apply_patch` for manual file edits. Keep patches scoped and coherent. Do not use patches for generated files, formatter output, or large mechanical rewrites where a command is safer.
```

### Shell Command

Good shell tool descriptions include:

- command as a single string, not an argv array, when the harness behaves like a terminal
- required or strongly recommended `workdir`
- timeout controls for long commands
- explicit approval/escalation fields only if the harness supports them

### Parallel Reads

Use when the target supports parallel tools:

```text
Before reading files, decide which independent files or searches are needed. Batch independent reads/searches in one parallel tool call. Only make sequential calls when the next read depends on the previous result.
```

### Tool Result Truncation

For harness authors, preserve beginning and end of long outputs and mark middle truncation clearly. Keep search results visually distinct from semantic search or memory results so the model does not confuse tool types.

## AGENTS.md / Instruction Injection

When generating Codex repo instructions:

- Put durable repo rules in `AGENTS.md`.
- Keep global instructions separate from repo-local instructions.
- Later/deeper directory instructions override earlier/root instructions.
- Include only rules the agent should follow repeatedly.
- Avoid turning one-off task details into permanent repo rules.

## Preambles, Phase, And Personality

- For modern Codex surfaces that support preambles, ask for short human updates before tool-heavy work and at real milestones.
- Avoid log-style updates. Prefer paired-work phrasing that says what is being learned and what happens next.
- For API harnesses that preserve assistant message phases, keep commentary/preamble and final-answer metadata intact.
- Add personality only when it changes the user experience. Use pragmatic style for speed; friendly style for onboarding, ambiguity, or higher-stakes collaboration.

## Codex Metaprompting

Use this when improving a Codex prompt after a bad run:

```text
Review the previous run and propose targeted instruction changes that would produce the same or better quality faster next time. Focus on reducing slow starts, excessive status logging, repeated tool loops, and unclear stopping rules. Generalize the changes so they apply beyond this one task.
```
`````

### references/research-prompting.md

Before: no equivalent original file.

After:

`````markdown
# Research Prompting

Use with the Research template or any prompt where citations, recency, grounding, or web/document retrieval are central.

## GPT-5.5 Research Defaults

- Define the target outcome, success criteria, source requirements, and stop rules.
- Use current information checks when facts may have changed.
- Avoid unsupported factual claims. If evidence is thin, state what is known, what is uncertain, and what would resolve the uncertainty.
- Add citation rules only for claims that need support.
- Distinguish source-backed facts from creative wording in drafts, slides, messaging, or narrative outputs.

## Retrieval Budget Pattern

Use this when search/tool behavior matters:

```text
Start with one broad search using short, discriminative keywords. Search again only if the top results do not answer the core question, a required fact is missing, sources conflict, the user asked for exhaustive coverage, or a specific document/URL must be read. Stop when you can answer the core request with enough citable evidence.
```

## Citation Pattern

```text
Use inline numeric citations for important factual claims. Include a final References section mapping each number to source title, publisher, publication/update date when available, and link.
```

## Missing Evidence

For factual work, specify one of these behaviors:

- ask for the smallest missing input
- answer with labeled assumptions
- mark fields as `unknown`
- omit unsupported rows
- provide a confidence or evidence-quality note

## Useful Source Rules

- Prefer primary sources for laws, technical docs, APIs, pricing, and model behavior.
- Prefer recent sources for market, product, policy, and company facts.
- For comparisons, require consistent dates and definitions before ranking.
- For financial, legal, medical, or safety-sensitive claims, require direct source support and caveats.
`````

