# SPA Assistant Architecture Review

## Role
You are a principal engineer reviewing system design, with expertise in building LLM-powered analysis tools and knowledge systems.

## Context
I am uploading `context.zip` containing a knowledge base for an AI assistant that analyzes Share Purchase Agreements (SPAs) — legal contracts for M&A transactions.

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from files
- For concrete claims, cite file paths
- Do not ask questions; state assumptions

## Background

We built an SPA analysis assistant with:

1. **Infrastructure layer:**
   - `output-contract.md` — Standard deliverable format (Top Priorities → Issue Register → Tables)
   - `global-tests.md` — 10 validation tests the model must run on every analysis
   - `term-map.yml` — Canonical vocabulary with definitions, components, routing rules

2. **Playbooks:**
   - `01-definitions.md` — Extract and analyze financial definitions (Cash, Debt, WC, etc.)
   - `02-purchase-price.md` — Extract price formula, funds flow, escrow terms
   - `system-prompt.md` — Operating instructions with 5 pillars including Reliability

3. **Design principles:**
   - Two-pass process: Extract → Normalize → Interpret (never mix)
   - Self-analysis checklists with yes/no + citations (not optional reflection)
   - Two-layer market labels: component-level AND definition-level
   - Reliability pillar: no invented refs, explicit "Not found," confidence labels
   - No edits by default; when requested: minimal, validated, explained

## Task

Review this architecture for:

1. **Completeness**: Does the system have everything needed for reliable SPA analysis? What's missing?

2. **Consistency**: Do the files reference each other correctly? Are there contradictions?

3. **Usability**: Will an LLM be able to follow these instructions reliably? Are there ambiguities?

4. **Failure modes**: What could go wrong? Where might the model hallucinate, skip steps, or produce low-quality output?

5. **Improvement opportunities**: What would make this 2x better?

## Specific Questions

1. Is the `term-map.yml` component inventory complete enough? Are there common SPA components we missed?

2. Are the 10 global tests in `global-tests.md` the right tests? Are any missing?

3. Does the output contract in `output-contract.md` produce useful deliverables? Is the structure optimal?

4. Are the self-analysis checklists in the playbooks rigorous enough to prevent errors?

5. Is the two-pass process (Extract → Interpret) clearly enough specified that the model will actually follow it?

## Output Format

### Architecture Assessment
Rate each dimension (1-5) with brief justification:
- Completeness: X/5
- Consistency: X/5
- Usability: X/5
- Robustness: X/5

### Critical Issues
[Issues that would cause incorrect analysis or user harm]

### Improvement Recommendations
[Prioritized list with specific file/section references]

### Missing Components
[Anything the system needs but doesn't have]

### Verdict
[Overall assessment: Is this architecture sound? Would you trust analysis from this system?]
