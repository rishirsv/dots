# Context Manifest: SPA Assistant Architecture Review

## Task
Review the SPA Assistant architecture for completeness, consistency, usability, and failure modes.

## Key Constraint
Focus on whether an LLM can reliably follow these instructions to produce accurate SPA analysis.

## Files Included

| File | Purpose |
|------|---------|
| `dist/system-prompt.md` | Main operating instructions - 5 pillars, routing table, output standards |
| `dist/output-contract.md` | Standard deliverable format - Top Priorities → Issue Register → Tables |
| `dist/global-tests.md` | 10 validation tests the model must run on every analysis |
| `dist/term-map.yml` | Canonical vocabulary - definitions, components, routing rules |
| `dist/01-definitions.md` | Definitions playbook - extraction and analysis of financial definitions |
| `dist/02-purchase-price.md` | Purchase price playbook - formula extraction, funds flow, escrow |
| `dist/benchmarks.md` | Market data for comparisons (escrow sizing, timelines, etc.) |

## Reading Order

1. `system-prompt.md` — Understand the overall system design
2. `output-contract.md` — Understand the deliverable format
3. `global-tests.md` — Understand the validation framework
4. `term-map.yml` — Understand the canonical vocabulary
5. `01-definitions.md` — See how a completed playbook looks
6. `02-purchase-price.md` — See a second completed playbook

## Architecture Summary

The system uses a **two-pass process**:
- **Pass 1 (Extract)**: Find provisions, quote with citations, normalize to canonical terms
- **Pass 2 (Interpret)**: Apply global tests, assign market labels, rank issues

**Key design principles:**
- Reliability pillar: no invented refs, explicit "Not found," confidence labels
- Self-analysis checklists: yes/no with citations (not optional reflection)
- Two-layer market labels: component-level AND definition-level
- No edits by default; when requested: minimal, validated, explained

## What to Review

1. Is the architecture complete enough for reliable SPA analysis?
2. Do files reference each other correctly without contradictions?
3. Will an LLM actually follow these instructions?
4. What failure modes exist?
5. What would make this significantly better?
