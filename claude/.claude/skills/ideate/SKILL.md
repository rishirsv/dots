---
name: ideate
description: Create a feature specification through repo-aware conversation. Use only when the user explicitly invokes `ideate`/`$ideate` or explicitly asks to use the ideate skill for brainstorming, shaping a feature, or writing a spec. Do not auto-activate for general brainstorming, planning, or spec-writing requests.
---

# Ideate

Turn a rough idea into a decision-complete feature spec through collaborative, evidence-first dialogue.

Stay in ideation mode:

- Do not implement code.
- Do not modify product code.
- You may read the repository and create or update documentation.

## Core behavior

- Start with repository context, not generic brainstorming. Read the most relevant docs, existing specs, plans, and adjacent code before asking questions.
- If a question can be answered by exploring the codebase, explore the codebase instead.
- Interview the user relentlessly until the design is decision-complete and both sides share the same understanding.
- Walk the design tree in dependency order, resolving one branch at a time instead of jumping between unrelated decisions.
- For every unresolved decision you ask about, provide a recommended answer or default.
- Prefer the smallest sensible scope. Push non-essential ideas out of the first version.

## Workflow

### 1. Establish context and target document

- Read the current project guidance first, such as `AGENTS.md`, `README.md`, relevant docs, and any existing spec or plan related to the request.
- Inspect nearby code and existing product behavior before proposing flows or requirements.
- If a relevant spec already exists, update it instead of creating a duplicate.
- Resolve:
  - `feature_name`
  - `feature_slug`
  - `spec_path`
- Default to `docs/product-specs/<feature-slug>-spec.md` when the repo uses that convention. If the repo uses a different spec location, follow the local convention instead.
- Only ask the user to confirm the path or slug when there is real ambiguity or risk.

### 2. Run a dependency-ordered interview

Treat ideation like a structured interview, not a free-form brainstorm.

- Start with the highest-leverage unknowns first.
- Ask only what is still unknown after repo exploration.
- Ask one focused question or a small batch of tightly related questions at a time.
- Prefer multiple-choice, yes/no, or constrained options when possible.
- Explain why a question matters when the dependency is not obvious.
- Recommend a default answer for each question based on repo evidence, product sense, and simplicity.
- After each answer, restate the decision and carry its implications forward before asking the next branch.

Walk down the design tree in roughly this order:

1. Problem and user
2. Trigger and entry point
3. Core user flow
4. State, data, and system behavior
5. Constraints and non-goals
6. Edge cases, failure modes, and permissions
7. Success criteria, rollout, and verification signals

Keep going until you can describe the solution without guessing.

### 3. Summarize before drafting

Before writing the spec, provide a concise summary of:

- what is being built
- who it is for and why it matters
- the core flow
- key constraints and non-goals
- any remaining open questions

If important ambiguity remains, keep interviewing. Do not draft a spec that depends on hidden guesses.

### 4. Write or update the spec

Create or update the spec at `spec_path`.

Keep the document concise, concrete, and implementation-aware without turning it into an implementation plan.

Mandatory sections:

- `TL;DR`
- `Scope`
- `What We Are Building`
- `Requirements`
- `Acceptance Criteria`

Optional sections:

- `User Stories`
- `How It Works`
- `Context`
- `Assumptions`
- `Open Questions`
- `Risk And Failure Analysis`
- `Rollout And Rollback`
- `Verification`

Include optional sections only when they materially improve clarity or match repo conventions.

### 5. Ground the spec in evidence

- Tie decisions back to repo evidence when possible.
- Reference existing files, patterns, constraints, and adjacent behavior when they affect the spec.
- If something could not be verified in the codebase, say so explicitly instead of implying certainty.

### 6. Finish cleanly

After saving the spec:

- share the path that was created or updated
- give a short recap of the final shape of the feature
- call out any open questions that still need a decision

## Questioning guidance

Use these prompts as a mental checklist, not as canned text:

- What user problem are we solving?
- Who is the primary user?
- What triggers this flow?
- What must happen, in order, for the feature to feel complete?
- What existing product behavior or code patterns constrain the design?
- What is explicitly out of scope for the first version?
- What could fail, confuse users, or require permissions?
- How will we know the feature works?

## Failure shields

- Do not ask broad questions that the repository can answer.
- Do not dump a long questionnaire up front.
- Do not write a spec before the critical branches of the design tree are resolved.
- Do not drift into implementation or coding.
- Do not preserve every user idea by default; simplify and narrow scope where appropriate.
