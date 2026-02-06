## Role

You are a staff engineer doing a careful code review for correctness and maintainability, with strong editorial rigor for producing executive-ready documentation.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index.
- Use only what you can support from files in the zip; do not invent facts.
- For concrete claims, cite file paths (and line anchors where possible).
- Keep legal and scope meaning intact while improving clarity and structure.
- If anything is unclear before finalizing, add a **Clarifications Needed** section first and pause recommendations that depend on those answers.

## Task

Please clean and improve the current issues report and underlying scope assessment into a polished, coherent, professional final document.

Primary source text to improve:
- `context/docs/issues.md`

Authoritative source data to audit against:
- `context/dist/scope-library.json`
- `context/dist/scope-review-buckets.json`
- `context/dist/el-placeholder-schema.json`
- `context/dist/el-generate.py`
- `context/docs/mining/audit-mapping.md`
- `context/docs/mining/audit-verification-results.md`

You must perform a deep audit across the relevant industries and determine, for each scope area/item, whether it is:
1. Core default scope (should remain default)
2. Legitimate but uncommon (should be optional / non-default)
3. Deal-specific artifact (should be excluded from default library)
4. Taxonomy duplicate/variant (should be normalized/merged)

## Constraints / preferences

- End state must be a coherent, error-free, professionally formatted document with clear meaning.
- Preserve substantive technical findings; improve structure, clarity, and precision.
- Do not hand-wave. Provide detailed audit documentation so we can review differences thoroughly.
- Explicitly address section-key drift and variants (e.g., `audit_work_paper`, `audit_work_papers`, `audit_working_papers`) and similar families.
- Evaluate whether each flagged item truly belongs in reusable industry scope vs. being deal-specific.
- Where uncertain, mark `Needs Clarification` and explain exactly what evidence is missing.

## What "good" looks like

- A polished final issues document suitable for executive and working-team review.
- A transparent audit trail that makes every major change/finding reviewable.
- Clear, testable rationale for keeping, demoting, merging, or excluding scope items.

## Required output format

### 1) Answer
1-3 sentences summarizing your overall recommendation and confidence.

### 2) Clarifications Needed (if any)
List only truly blocking ambiguities. If none, state `None`.

### 3) Polished Final Document
Provide a full rewritten version of `issues.md` that is:
- logically structured,
- free of wording errors,
- concise but comprehensive,
- consistent in severity language and implications.

### 4) Detailed Audit Log (required)
Provide a table with one row per significant item or key family.
Minimum columns:
- `Type` (`Redundancy`, `Taxonomy`, `Artifact`, `Alias Coverage`, `Default Scope Volume`, `Text Quality`, etc.)
- `Industry`
- `Section Key / Item ID`
- `Current State`
- `Recommended State` (`Keep Default`, `Optional`, `Exclude`, `Merge/Normalize`, `Needs Clarification`)
- `Rationale`
- `Evidence` (file path references)
- `Impact if unchanged`

### 5) Difference Documentation (required)
Provide a reviewable change log between original and polished content:
- `Section changed`
- `What changed`
- `Why changed`
- `Risk/benefit`

### 6) Recommended Next Steps
Concrete, sequenced actions for implementation and validation.

### 7) Risks / Unknowns
What could change your recommendations.
