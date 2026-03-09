# Oracle prompt templates (for ChatGPT Pro)

Use these templates to generate `prompt.md` for the ChatGPT Pro web UI when running the Oracle Skill.

The downstream model will receive `context.zip` (a zip of repo files). These templates assume the model has **zero** other context.

---

## Role Values

Replace `{ROLE}` in templates with one of these based on the task:

| Task Type | Role Value |
|-----------|------------|
| Code review | a staff engineer doing a careful code review for correctness and maintainability |
| Debugging | a senior engineer debugging a tricky issue with limited context |
| Architecture | a principal engineer reviewing system design |
| Security | a security engineer threat-modeling and reviewing deployment hardening |
| Performance | a performance engineer identifying bottlenecks and optimization opportunities |
| Data/SQL | a database engineer reviewing correctness and performance |
| UI/UX | an expert UI/UX designer doing a rigorous visual and interaction review |

---

## Contents

- [Code review template](#code-review-template) - "review", "audit", "refactor", "sanity-check"
- [Debugging template](#debugging-template) - errors, crashes, failing tests
- [Security review template](#security-review-template) - vulnerabilities, auth, secrets
- [Performance audit template](#performance-audit-template) - bottlenecks, optimization
- [Architecture review template](#architecture-review-template) - design, structure, patterns
- [General template](#general-template) - anything else

---

## Code review template

Use this when you want a high-signal review grounded in repo context.

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading a zip called `context.zip` that contains repository files. Treat the contents of those files as the source of truth.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths (add line numbers if available; otherwise cite the nearest function/type name as an anchor).
- Keep it tight: focus on the top 5-10 things that change decisions; group nits.
- Do not ask questions. If something essential is missing, proceed with assumptions and label them.

## What I want you to do

Review the change / design described below. Focus on whether it is correct, safe, and a good fit for the codebase.

**User request / goal:**
{USER_GOAL}

**Constraints:**
{CONSTRAINTS}

**What I changed / plan:**
{CHANGE_SUMMARY}

## Output format

### Summary

One short paragraph describing what the code does (as implemented) and your overall assessment.

### Standard review

Cover these areas, using the minimum detail needed to be convincing:

1) Spec & plan alignment
- Does it implement what the goal implies?
- Any scope creep or missed parts?

2) Code quality
- Readability, structure, naming, consistency with local patterns
- Separation of concerns; avoid duplication where it matters

3) Correctness & safety
- Edge cases, validation, error handling, failure modes
- Data integrity / concurrency issues
- Security concerns if relevant

4) Performance & scalability (only if relevant)
- Hotspots, expensive operations, unnecessary work

5) Testing & documentation
- What's tested, what's missing, how to verify

When listing issues, tag each with a priority:
- **[P0]** blocking / likely to break users or data
- **[P1]** urgent (should be fixed next cycle)
- **[P2]** normal (fix eventually)
- **[P3]** nice to have

For each issue include:
- What's wrong (plain language)
- Why it matters (impact / risk)
- The smallest reasonable fix (concrete guidance; code only if it clarifies, keep it short)
- The file(s) involved (paths)

### Simplicity review (YAGNI)

Briefly check:
- What is the core purpose (1-3 sentences)?
- Where is the design more complex than needed?
- What would be a simpler alternative that still satisfies the goal?
- Anything that looks like over-engineering / "just in case" abstractions?

### Overall correctness verdict

End with exactly one of:
- **Correct**
- **Probably correct, with caveats**
- **Not correct**

Then one short paragraph explaining your verdict.

---

## Debugging template

Use this when you have an error, failing tests, or unexpected behavior.

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Don't invent missing details. Do not ask questions; proceed with assumptions and list unknowns as risks.
- Prefer falsifiable hypotheses over broad speculation.
- For concrete claims, cite file paths (add line numbers if available; otherwise cite the nearest function/type name as an anchor).
- Keep it tight: focus on the top 5-10 things that change decisions; group nits.

## The problem

**What I expected:**
{EXPECTED}

**What happened instead:**
{ACTUAL}

**Error / logs (verbatim if available):**
{ERROR_TEXT}

**Repro steps:**
{REPRO_STEPS}

**Constraints:**
{CONSTRAINTS}

## What I want

1) Your best diagnosis (most likely root cause), grounded in the files.
2) The smallest fix that makes it correct.
3) How to confirm the fix (tests/commands/checks).
4) Risks/unknowns.

## Output format

### Diagnosis

1 short paragraph: what's most likely wrong and why.

### Evidence

Bullets citing file paths and the specific facts that support the diagnosis.

### Fix plan

Numbered steps, each concrete and verifiable. Include exact file paths to change.

### Verification

Commands/tests/checks to run to prove it's fixed.

### Risks / unknowns

Bullets of anything that could change the recommendation.

### Assumptions / unknowns

Bullets: what you assumed and what you could not confirm from the zip.

---

## Security review template

Use when reviewing for vulnerabilities, auth issues, or deployment hardening.

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths (add line numbers if available).
- Focus on high-impact security issues; group low-severity findings.
- Do not ask questions; state assumptions and unknowns explicitly.

## What I want you to review

{SECURITY_SCOPE}

**Specific concerns:**
{CONCERNS}

## Output format

### Threat Model Summary

One paragraph describing the attack surface and trust boundaries.

### Findings

For each finding:
- **Severity**: Critical / High / Medium / Low / Info
- **Category**: Auth, Input Validation, Secrets, Dependencies, Config, etc.
- **Description**: What's wrong
- **Impact**: What an attacker could do
- **File(s)**: Paths involved
- **Fix**: Concrete remediation steps

Sort by severity (Critical first).

### Authentication & Authorization

- How is auth implemented?
- Any privilege escalation risks?
- Session management concerns?

### Data Handling

- Sensitive data exposure risks
- Input validation gaps
- Output encoding issues

### Dependencies & Config

- Known vulnerable packages?
- Secrets in code or config?
- Hardening recommendations

### Summary Verdict

One of:
- **Secure** (no critical/high issues)
- **Needs remediation** (has high/critical issues)
- **Insufficient context** (cannot fully assess)

---

## Performance audit template

Use when reviewing for bottlenecks, scalability issues, or optimization opportunities.

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths and function names.
- Focus on measurable impact; avoid micro-optimizations.
- Do not ask questions; state assumptions explicitly.

## Performance scope

{PERF_SCOPE}

**Known issues or symptoms:**
{SYMPTOMS}

**Constraints:**
{CONSTRAINTS}

## Output format

### Executive Summary

One paragraph: biggest bottlenecks and estimated impact.

### Hotspots

For each issue:
- **Location**: File path + function/component
- **Issue**: What's slow/expensive
- **Impact**: Estimated severity (High/Medium/Low)
- **Fix**: Concrete optimization

### Database / API Calls

- N+1 queries
- Missing indexes
- Unnecessary fetches
- Caching opportunities

### Frontend Performance (if applicable)

- Bundle size concerns
- Render blocking
- Re-render issues
- Asset optimization

### Scalability Concerns

- Memory usage patterns
- Connection pooling
- Rate limiting needs

### Recommended Priorities

Numbered list of optimizations by impact/effort ratio.

---

## Architecture review template

Use for system design validation, component structure, or technical decisions.

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths.
- Focus on structural concerns; defer implementation details.
- Do not ask questions; state assumptions explicitly.

## Architecture scope

{ARCH_SCOPE}

**What I want validated:**
{VALIDATION_GOALS}

**Constraints:**
{CONSTRAINTS}

## Output format

### Architecture Overview

One paragraph summarizing the current design as implemented.

### Component Analysis

For each major component:
- **Purpose**: What it does
- **Boundaries**: What it owns vs. delegates
- **Dependencies**: What it relies on
- **Concerns**: Coupling, cohesion, responsibility issues

### Design Patterns Assessment

- Patterns in use (good fits, anti-patterns)
- Consistency across the codebase
- Abstraction level appropriateness

### Scalability & Evolution

- How well does this handle growth?
- What would break first under load?
- How easy is it to add features?

### Recommendations

1. **Keep**: What's working well
2. **Change**: What to refactor (with priority)
3. **Add**: Missing components or patterns

### Verdict

One of:
- **Sound architecture**
- **Needs refactoring** (list areas)
- **Major concerns** (architectural debt)

---

## General template

Use this when the request doesn't fit code review or debugging (architecture, research, "how should we do X", etc.).

Pasteable `prompt.md` template:

---

## Role

You are {ROLE}.

## Context

I am uploading `context.zip` containing repository files. Treat those files as the source of truth.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths (add line numbers if available; otherwise cite the nearest function/type name as an anchor).
- Write in clear, non-technical prose.
- Keep it tight: focus on the top 5-10 things that change decisions; group nits.
- Do not ask questions; state assumptions and unknowns explicitly.

## Task

{TASK}

## Constraints / preferences

{CONSTRAINTS}

## What "good" looks like

{SUCCESS_CRITERIA}

## Output format

### Recommendation

One short paragraph with your recommended approach.

### Why this is the best option

Bullets of the main tradeoffs and constraints that drove the decision.

### Implementation notes

Concrete next steps and where in the repo it likely touches (file paths from the zip).

### Risks / unknowns

Anything that could change your recommendation.

---
