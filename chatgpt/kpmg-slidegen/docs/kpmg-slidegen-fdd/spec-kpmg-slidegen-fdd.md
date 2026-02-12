# Feature: KPMG Slidegen FDD

## TL;DR
- **Problem:** Current AI slide workflows are flexible but unreliable for financial due diligence because they can drift on facts, layout, and placeholders.
- **Solution:** Build a Custom GPT-powered FDD slide orchestration layer that maps inputs to approved KPMG layouts, compiles deterministic generator payloads, and enforces strict validation gates.
- **V1 outcome:** Reliable single-slide generation (plus limited multi-card section mode), factual fidelity, deterministic layout mapping, and generator-ready outputs with traceability.

## Scope
- **In:**
  - Session-first Custom GPT workflow for KPMG FDD slide generation, with optional one-shot entry.
  - External slide contract: `type: "layout.<slug>"` + `slots`.
  - Deterministic compiler from `layout.<slug> + slots` to current legacy generator payload shape.
  - FDD-intent mapping for initial modules:
    - business overview
    - QoE adjustment highlights
    - payroll appendix
    - customer concentration
    - working capital review
    - revenue bridge
    - key diligence risks
  - Placeholder-aware generation (`[CHART PLACEHOLDER]`, `[TABLE IMAGE PLACEHOLDER]`, `[IMAGE PLACEHOLDER]`).
  - Data-fidelity, layout-policy, and strict geometry validation gates.
  - Output bundle: slide JSON, PPTX, mapping rationale, validation summary.
- **Out:**
  - Full report autopilot across every diligence chapter.
  - Domain-complete writing intelligence for all report sections.
  - Arbitrary attachment formats in V1 (start with text + image/PDF ingestion path only).
  - Replacing the existing generator runtime/builders.

## What We're Building

We are building a new distribution and workflow layer for `kpmg-slidegen` that behaves like a constrained orchestration GPT instead of a freeform slide writer. The system accepts mixed upstream inputs (manual prompt, chained GPT output, and selected attachments), classifies the business intent, picks an approved FDD layout, and fills slots with policy-checked content.

The core design is hybrid: the GPT-facing contract is clean and extensible (`layout.<slug> + slots`), while the internal execution remains compatible with the existing generator by compiling into the current legacy builder payload. This allows rapid shipping without risky runtime replacement, while setting a stable interface for future modules.

For users, the main difference is reliability and auditability: they receive generated slides/decks with explicit mapping rationale and hard validation signals rather than opaque, stylistic output that may drift from source facts.

## Architecture Options

### Option A (Recommended): Session-first planner + deterministic compiler
- **Shape:** External contract is `layout.<slug> + slots`; internal compiler maps to legacy builder payload.
- **Advantages:**
  - Best balance of speed and reliability.
  - Preserves current generator investments and template compatibility.
  - Clean external API for future writers/layouts without runtime rewrite.
- **Tradeoffs:**
  - Requires adapter layer maintenance while legacy runtime exists.
  - Two-layer debugging (contract + compiled payload).

### Option B: One-shot direct legacy payload generation
- **Shape:** GPT writes legacy builder payload directly in one call.
- **Advantages:**
  - Fastest to prototype.
  - Minimal new orchestration code in early stage.
- **Tradeoffs:**
  - Fragile and harder to govern at scale.
  - Tight coupling to internal shape; poor extensibility.
  - Higher risk of malformed payloads and policy drift.

### Option C: Policy DSL + planner/executor microservices
- **Shape:** Introduce a policy DSL (intent/layout/content constraints) plus separate planner and executor services.
- **Advantages:**
  - Strongest long-term governance and scalability.
  - Easy to add new content domains with declarative rules.
  - Better observability and versioned policy rollouts.
- **Tradeoffs:**
  - Highest initial build cost and complexity.
  - Slower time-to-value for V1.

### Why Option A wins for V1
- It matches observed Gamma-style strengths (LLM planning + constrained tool contract) while avoiding Gamma's weak points (fact drift, unconstrained layout shifts).
- It delivers immediate production value in FDD without replacing core generator internals.

## Illustrative Contract Examples

### External contract (new): `layout.<slug> + slots`
```json
{
  "request_id": "req_20260212_001",
  "verbosity": "standard",
  "slides": [
    {
      "type": "layout.fdd_chart_left_content_right",
      "intent": "qoe_adjustment_highlights",
      "title": "QoE Adjustment Highlights",
      "slots": {
        "left.chart_placeholder": "[CHART PLACEHOLDER]",
        "left.table_placeholder": "[TABLE IMAGE PLACEHOLDER]",
        "right.header": "Normalization themes and earnings impact",
        "right.bullets": [
          "Management add-back for one-time implementation costs of $1.4m (FY24) is supported by invoices and not expected to recur.",
          "Temporary labor overrun of $0.8m in Q3 was linked to a single distribution-center transition and normalized in Q4.",
          "Warranty reserve release of $0.5m is non-cash and excluded from run-rate EBITDA."
        ]
      },
      "constraints": {
        "must_preserve_tokens": [
          "[CHART PLACEHOLDER]",
          "[TABLE IMAGE PLACEHOLDER]"
        ],
        "fact_lock": true
      }
    }
  ]
}
```

### Compiled payload (legacy-compatible builder shape)
```json
{
  "deck": {
    "template": "kpmg-diligence",
    "strict": true
  },
  "slides": [
    {
      "builder": "twoColumnChartTableContent",
      "title": "QoE Adjustment Highlights",
      "left": {
        "chart": "[CHART PLACEHOLDER]",
        "tableImage": "[TABLE IMAGE PLACEHOLDER]"
      },
      "right": {
        "header": "Normalization themes and earnings impact",
        "bullets": [
          "Management add-back for one-time implementation costs of $1.4m (FY24) is supported by invoices and not expected to recur.",
          "Temporary labor overrun of $0.8m in Q3 was linked to a single distribution-center transition and normalized in Q4.",
          "Warranty reserve release of $0.5m is non-cash and excluded from run-rate EBITDA."
        ]
      },
      "meta": {
        "layout_slug": "layout.fdd_chart_left_content_right",
        "intent": "qoe_adjustment_highlights",
        "source_request_id": "req_20260212_001"
      }
    }
  ]
}
```

## User Stories

### User Story 1: Single-slide generation (primary V1)
- As a TS associate, I want to submit diligence notes or structured metrics and get one compliant slide so that I can build sections quickly without manual reformatting.

### User Story 2: Appendix generation with placeholders
- As a TS associate, I want appendix slides to preserve explicit placeholders for analyst-owned tables/charts so that I can paste final visuals from Excel.

### User Story 3: Mini-section generation
- As a manager, I want to request a small 2-3 slide section from one prompt so that I can draft report segments faster while keeping consistent layout policy.

### User Story 4: Traceable output
- As a reviewer, I want to see mapping rationale and validation summaries so that I can trust slide structure and factual integrity before client delivery.

## Requirements

- [ ] R1. Implement a new FDD distribution workflow under `dist/` for Custom GPT orchestration.
- [ ] R2. Accept session-based interactions with optional one-shot generation.
- [ ] R3. Define and enforce external contract: `slides[].type = "layout.<slug>"`, `slides[].slots = {...}`.
- [ ] R4. Implement deterministic adapter/compiler from `layout.<slug> + slots` into current generator input shape.
- [ ] R5. Support V1 intent-to-layout mapping table for initial FDD modules listed in scope.
- [ ] R6. Enforce layout-policy gate: only approved layouts can be selected for each intent.
- [ ] R7. Enforce data-fidelity gate: provided numeric/entity facts must not drift without explicit rationale.
- [ ] R8. Enforce placeholder gate: requested placeholder tokens must be preserved in output slots/content.
- [ ] R9. Support verbosity modes (`concise`, `standard`, `long_form`) that map to deterministic output-density rules.
- [ ] R10. Include baseline writing quality standards (executive FDD tone, concise logic, no fluff), with extensible section-specific writing modules.
- [ ] R11. Support image/PDF evidence ingestion in V1 with explicit error handling for unsupported/broken attachment transforms.
- [ ] R12. Run existing generator validation + strict geometry checks before final output acceptance.
- [ ] R13. Return output bundle containing:
  - [ ] R13.1 Generated slide/deck JSON
  - [ ] R13.2 PPTX path/artifact
  - [ ] R13.3 Mapping rationale per slide
  - [ ] R13.4 Validation summary (fidelity, placeholders, strict checks)
- [ ] R14. Preserve existing diligence template guardrails (`templates/kpmg-diligence/**` handling and freeze expectations).
- [ ] R15. Log structured run artifacts for reproducibility and debugging.

## How It Works

The runtime follows a constrained pipeline:
1. **Ingest:** parse user input, chained GPT text, and supported attachments.
2. **Normalize:** convert evidence into structured facts/claims.
3. **Intent classify:** map to FDD business intent class.
4. **Layout resolve:** select approved `layout.<slug>` by deterministic policy.
5. **Slot fill:** generate slot content using selected verbosity mode and writing rules.
6. **Compile:** convert layout+slots to legacy generator payload.
7. **Validate:** run fidelity, placeholder, layout policy, and strict geometry checks.
8. **Emit:** write output artifacts and rationale summary.

The architecture intentionally separates planning from rendering. The GPT layer is used for controlled content and intent decisions, while execution and compliance checks are deterministic. This reflects the key research insight: unconstrained generation is useful for speed but unsafe for due diligence without hard policy gates.

Gamma-like systems appear to use this same broad pattern: a planning model call, then explicit tool calls (`createCard`, `editCardById`), then a rendering step (`GenerateCardWithLayout` / `EditCardWithLayout`), with telemetry around each step. Our design adopts the strengths of that model (modular orchestration) while adding tighter FDD policy locks.

## Acceptance Criteria

- Given a valid single-slide business overview prompt with explicit metrics, when generation runs, then exactly one approved FDD layout is selected and all provided metrics are preserved in output.
- Given a payroll appendix prompt with required table placeholder token, when generation runs, then the exact placeholder token appears in output and placeholder gate passes.
- Given a request for QoE slide with chart placeholder, when generation runs, then chart placeholder is present and layout maps to an approved QoE-compatible layout.
- Given a 3-card mini-section request in V1 scope, when generation runs, then the system emits three mapped slides with per-slide rationale and no policy violations.
- Given unsupported attachment types, when user submits them, then the workflow returns a clear, actionable validation error without silent fallback.
- Given supported evidence input (text/image/PDF path), when generation runs successfully, then output bundle includes JSON, PPTX, rationale, and validation summary.
- Given provided numeric facts conflict with generated text, when data-fidelity gate runs, then generation fails or flags the mismatch explicitly.
- Given a selected layout not allowed by policy mapping, when layout-policy gate runs, then output is rejected.
- Given strict QA severe overlaps or out-of-bounds > 0, when strict checks run, then output is marked failed and not considered delivery-ready.
- Given `long_form` verbosity mode, when slot content is generated, then content density increases deterministically (not random style drift).
- Given existing diligence freeze guardrails, when shared runtime/extractor behavior is touched, then regression/freeze checks remain intact.

## Context

- Related code:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/index.js`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/generator/validate.js`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/templates/kpmg-diligence/template.js`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/dist/`
- Related research:
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-research-findings.md`
  - `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-run3-structured.json`
- Constraints:
  - Diligence template behavior is guarded/frozen unless explicitly approved.
  - Output policy should avoid committing large generated artifacts by default.

## Open Questions

- Final distribution folder/name convention under `dist/` (proposed: `dist/kpmg-slidegen-fdd`).
- V1 multi-card cap (proposed: max 3 cards per request).
- Exact V1 attachment behavior for PDF parsing (include now or defer behind feature flag).
- Whether to promote Option C (policy DSL) in V2 once V1 reaches stable adoption.
