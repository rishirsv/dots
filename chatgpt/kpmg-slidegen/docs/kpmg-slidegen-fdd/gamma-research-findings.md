# Gamma Research Findings (Work-In-Progress)

Date: 2026-02-11
Project: /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen
Researcher: Codex browser instrumentation via `agent-browser --cdp 9222`

## Purpose
- Investigate how Gamma transforms structured and unstructured FDD-style prompts into slide/card outputs.
- Capture UI behavior plus network/agent internals (tool calls, render calls, telemetry) to inform KPMG Slidegen FDD custom GPT design.
- Preserve findings incrementally to avoid context-loss during long sessions.

## What Was Instrumented
- UI automation via `agent-browser` on logged-in Gamma workspace.
- In-page instrumentation of `fetch` + `XMLHttpRequest` to capture request URL + body payloads.
- Focused parsing of:
  - `https://ai.api.gamma.app/ai/agent/message/v5?agentName=Buddy`
  - `https://ai.api.gamma.app/ai/v2/render-generation`
  - `https://api.gamma.app/ai/v2/track-span`
  - `https://api.gamma.app/graphql`

## Core Architecture Observed
1. Orchestrator + tool loop
- Gamma sends a high-level request to `ai/agent/message/v5`.
- Returned plan invokes explicit tool operations (observed: `createCard`, `editCardById`).
- Tool execution and final assistant output are tracked via `api.gamma.app/ai/v2/track-span`.

2. Rendering abstraction layer
- Tool input is further translated into `ai/v2/render-generation` payloads with `promptKey` values.
- Observed prompt keys:
  - `GenerateCardWithLayout`
  - `EditCardWithLayout`

3. Model/tool governance
- Payloads include `availableTools`, `blockFlags`, `maxSteps`, `context` (docId), and theme/image options.
- This confirms a constrained-agent pattern (LLM planning + deterministic tool contract), not freeform direct editing.

4. Credit/usage hooks
- GraphQL mutations observed for credit accounting:
  - `deductCreditsV2`
  - `getCredits`
- Credit indicator in UI remained visible at `73%` during this session.

## Endpoint Frequency (Clean Run 2)
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-run2-structured.json`

- `api.gamma.app/graphql`: 15
- `api.gamma.app/ai/v2/track-span`: 10
- `ai.api.gamma.app/ai/agent/message/v5`: 9
- `ai.api.gamma.app/ai/v2/render-generation`: 7
- `multiplayer.api.gamma.app/.../verify/...`: 8

Interpretation:
- Gamma behavior is dominated by repeated orchestration + rendering + telemetry cycles, with GraphQL used for account/state/credits.

## Scenario Matrix (Completed, High Signal)

### Scenario 1: Business overview from structured fake inputs
Prompt:
- "Create one business overview card ... founded 2012 ... 8 sites ... 420 employees ... revenue 86.4m, EBITDA 14.2m ..."

Observed:
- Status: `complete`
- Tool: `createCard` (success)
- Output card id: `fluctg6lkrqtci8`
- Layout selected: `image-layout="right"` with generated accent image.

Transformation quality:
- Good:
  - Preserved headline financial metrics (revenue/EBITDA values).
  - Produced executive-style title and strapline.
- Risk:
  - Hallucinated/altered facts despite explicit input:
    - founding changed to 1998 (input was 2012)
    - geography/headcount drifted (15 states/28 facilities/500+ employees vs provided values)

Implication for our GPT:
- Hard constraint enforcement is required for numeric/entity fields; freeform generation drifts.
- For FDD, data-bound sections should be template-filled, not creatively paraphrased.

### Scenario 2: Payroll appendix with explicit metrics + table placeholder
Prompt:
- Payroll metrics + instruction for exactly 4 bullets + explicit `[TABLE IMAGE PLACEHOLDER]`.

Observed:
- Status: `complete`
- Tool: `createCard` (success)
- Output card id: `023go5n2p46xgyf`
- Layout selected: blank/simple list.

Transformation quality:
- Good:
  - Placeholder preserved exactly.
  - Card title and appendix intent preserved.
- Risk:
  - Numerical specificity dropped from bullets (generic bullet labels, no values embedded in list body).

Implication for our GPT:
- If appendix cards require strict data restatement, we must enforce "value-carry-forward" rules and validation checks.

### Scenario 3: Multi-card mini-section (business + QoE + payroll appendix)
Prompt:
- 3-card section with placeholders and concise FDD tone.

Observed:
- Status: `complete`
- Tool calls: 3x `createCard` in one interaction
- Output card ids:
  - `rmmvqii9ik9sr33` (Business Overview Snapshot)
  - `lil2p6qqr4lnxoy` (QoE Adjustment Highlights)
  - `p0diy8slrenwgmg` (Payroll Appendix)

Transformation quality:
- Good:
  - Successfully decomposed single prompt into multiple card creations.
  - Inserted expected placeholder semantics in QoE card content.
- Risks:
  - Chose its own layout primitives (`smart-layout variant="solidBoxes"`, `bigBullets`), not user-specified enterprise template geometry.
  - For payroll card, introduced generated image artifact where user intent suggested a concrete table placeholder workflow.

Implication for our GPT:
- Multi-slide decomposition is feasible and valuable.
- Layout selection must be constrained by approved FDD template mapping policy, not open-ended stylistic choice.

### Scenario 4: Messy payroll notes -> cleaned appendix card
Prompt:
- Unstructured monthly payroll notes + overtime/retention/temp labor + explicit table placeholder.

Observed:
- Status: `complete`
- Tool: `createCard` (success)
- Output card id: `l32n1zianubu8ga`

Transformation quality:
- Good:
  - Strong summarization/compression from messy input.
  - Placeholder preserved exactly.
- Risk:
  - Converted to generic bullets; no deeper analytical framing or quantitative commentary unless explicitly forced.

Implication for our GPT:
- Unstructured-to-structured summarization works.
- Need explicit analysis rubric modules (e.g., payroll variance, normalization logic) to avoid genericization.

## Earlier Stress Pass (High Throughput, Lower Fidelity)
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-run-structured.json`

- A fast 8-scenario batch produced many `interaction_status: stopped` events when prompts were submitted too quickly.
- Even with stopped interactions, some `createCard` tool calls still returned success HTML.
- This demonstrates the importance of serial gating/wait conditions in automated experimentation.

## Concrete Internals Relevant to Our Design

1. Tool contract style is explicit and deterministic
- Example tool inputs include fields like:
  - `createPosition`, `createPositionCardId`, `textMode`, `textAmount`, `language`, `input`
- We should mirror this in Slidegen with explicit layout + slot contracts.

2. Render layer separates intent from layout realization
- `render-generation` carries:
  - `promptKey`
  - normalized variables (input HTML/request/theme/format/block flags)
- For Slidegen FDD, this maps well to:
  - Intent layer
  - Deterministic mapper
  - Template compiler

3. Observed failure mode: fact drift
- Business overview output drifted from provided facts.
- For due diligence, this is unacceptable without a data-locking mechanism.

4. Observed failure mode: placeholder semantics can mutate into generated visuals
- In multi-card flow, payroll appendix received an AI image block rather than strict table placeholder-first behavior.

## Design Guidance for KPMG Slidegen FDD GPT

1. Recommended architecture
- External contract: `layout.<slug> + slots`
- Internal compiler: deterministic mapping into current legacy builder shape
- Enforcement layer:
  - numeric/entity preservation checks
  - required placeholder policy (`chart/table/image`)
  - prohibited stylistic substitutions

2. Workflow recommendation
- Session-first orchestration with optional one-shot mode.
- Explicit phases:
  - ingest inputs
  - classify intent
  - pick layout by policy table
  - fill slots
  - validate (required fields, max density, data fidelity)
  - generate deck

3. QA gates inspired by this research
- `data_fidelity_gate`: provided numbers/entities must match output (or be flagged with reason).
- `placeholder_gate`: requested placeholders must exist verbatim in mapped slots.
- `layout_policy_gate`: only approved FDD layouts allowed per intent class.
- `strict_geometry_gate`: existing overlap/out-of-bounds checks.

## Files Saved During This Research
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-run-structured.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/gamma-run2-structured.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-1-business-overview.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-2-payroll-appendix.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-3-multi-card.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-4-messy-appendix.json`

## Next Suggested Research Batch (if we continue)
- Attachment upload flow (real file attach path) + how attachments appear in `input.attachments`.
- Forced layout control prompts (can we reliably force a specific layout family?).
- Long-form section generation (business overview narrative + appendix) with strict factual constraints.
- Adversarial prompts for data drift (conflicting numbers) and measure which source Gamma prioritizes.

## Long-Form Deep Dive (Additional Batch)

### L0: Built-in "Make longer" behavior (implicit verbosity control)
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l0-and-l1.json`

Observed interaction:
- Input: `Edit this card. Make this longer - about 2x the current length`
- Tool: `editCardById`
- Render prompt key: `EditCardWithLayout`

Interpretation:
- Gamma has an effective verbosity pathway through quick-edit semantics ("make longer"), even when no explicit standalone "verbosity slider" is visible.

### L1: Long-form single-card business overview (fact-locked prompt)
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l0-and-l1.json`

Observed:
- Status: `complete`
- Tool: `createCard`
- Card id: `t2zj5x8lpmbgtk0`
- Generated 8 long bullets (each ~2 sentences).
- Preserved provided factual values correctly (2012, 8 sites, 420 employees, 86.4m revenue, 14.2m EBITDA).

Interpretation:
- Strong prompt constraints can materially reduce drift.
- Long-form behavior is achievable via prompting without custom UI controls.

### L2: Long-form payroll appendix with strict numeric carry-forward
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l2-long-payroll.json`

Observed:
- Status: `complete`
- Tool: `createCard`
- Card id: `gu3rwb1dd5f1m8g`
- 6 bullets created; key values preserved verbatim (32.1m, 4.7m, 14.6%, 3.2m, 0.6m, Q3).
- Placeholder token preserved exactly.

Interpretation:
- Long-form appendix output can preserve numbers when explicitly instructed.
- Good candidate for an FDD appendix writer module if guarded by value-validation.

### L3: Long-form 3-card section generation
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l3-long-multicard.json`

Observed:
- Status: `complete`
- Tool calls: 3x `createCard`
- Card ids:
  - `de2y7ysec7i3nha`
  - `0hgj31jaldy0zt9`
  - `gk2uf6hviu1rbnt`
- Critical signal: all tool inputs used `textAmount: "xl"` (not `md`).

Interpretation:
- Long-form prompting appears to influence an internal verbosity setting (`textAmount` escalation).
- Multi-card decomposition in long-form mode is robust.

Caveat:
- Payroll appendix card still introduced an AI-generated image despite placeholder-first intent in some runs.

## Attachment Flow Findings (Important)

### L4: CSV attachment attempt
Source: `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l4-attachment-flow.json`

Observed:
- `input.attachments` remained empty.
- Model response: "I don't see an attached CSV file..."

Likely reason:
- Gamma file input accepts `image/*,application/pdf` (observed in DOM), so CSV is not a valid attachment for this flow.

### L4B/L4C: Image attachment path
Sources:
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l4b-image-attachment.json`
- `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/scenario-l4c-image-attachment-success.json`

Observed:
- When uploading via hidden `input.gamma-FileInput-input >> nth=0`, UI shows `1 file attached`.
- `input.attachments` is populated with file metadata + CDN URL in interaction payload.
- However, run ended with `interaction_status: error`.

Error captured in telemetry:
- `AI_APICallError: Invalid 'input[96].content[3].image_url'. Expected a base64-encoded data URL ... got invalid base64-encoded value.`

Interpretation:
- Attachment plumbing exists and is observable in payloads.
- Current path may be brittle/buggy for certain downstream model adapters (URL vs base64 image expectations).
- For our design, attachment normalization must be explicit and validated before model invocation.

## Updated Design Implications

1. Verbosity control strategy
- Practical controls to include in our GPT:
  - `concise`, `standard`, `long-form`
- Map these directly to generation knobs (e.g., `textAmount` equivalent) and slot-density rules.

2. Fact-locking strategy
- Long-form quality is good only when facts are strongly constrained.
- Add hard checks: all numeric/entity inputs must survive transformation unchanged unless explicitly transformed with rationale.

3. Attachment strategy
- Do not assume arbitrary file types for V1.
- Start with:
  - image/PDF input support with robust extraction
  - normalized internal representation before prompting
- Add strict error handling and fallback when attachment parsing fails.

4. Layout strictness
- Gamma defaults to generic layout primitives and may introduce unwanted visuals.
- Our FDD GPT must route to approved layout map first, then fill placeholders deterministically.

## Sufficiency Check (Current State)

I now consider research **sufficient for a solid V1 system design** for KPMG Slidegen FDD, specifically:
- Orchestration shape (agent -> tools -> renderer)
- Long-form behavior and verbosity effects
- Multi-card decomposition behavior
- Placeholder reliability patterns and failure modes
- Attachment contract constraints and error cases

Optional high-value follow-up (nice-to-have, not blocker):
- 1-2 controlled attachment tests with PDF inputs (not just image) to validate ingestion strategy before implementation.
