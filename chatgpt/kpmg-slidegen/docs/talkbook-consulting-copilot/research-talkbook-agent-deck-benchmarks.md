# Research: Sales-Agent Deck Patterns + Gamma Reverse Engineering for Talkbook

## Research Questions

- Which prompt-to-deck controls in Gamma most directly improve writing depth and information density?
- How do sales-enablement deck systems structure “agent behavior” (context intake, template choice, personalization, quality checks)?
- Which benchmark patterns should be copied into Talkbook skill guidance versus runtime code?
- Where does current Talkbook lose depth today (skill instructions, compile pipeline, renderer limits, or all three)?
- What is the smallest high-impact path to move Talkbook output closer to NVIDIA/Project-North writing density?

## Summary

The gap is real and structural: Talkbook now has archetype-first instructions, but generation still compresses content too aggressively and does not enforce minimum evidence depth. Gamma exposes explicit controls for depth and segmentation (`textOptions.amount`, `textMode`, `numCards`, `cardSplit`) and pairs that with template-first generation. Sales-agent deck systems (Marq and Seismic) consistently anchor generation in CRM context, approved templates, and post-generation review loops. For Talkbook, the best near-term approach is a hybrid: keep archetype guidance in the skill, add a structured “authoring payload” contract before compile, and define measurable density floors per archetype.

## Key Points / Options

- **Option A: Skill-only verbosity guidance (quick patch)**: Add stricter writing rules in `SKILL.md` and archetype docs only. Fast and low-risk, but output will still vary because compile/runtime are not depth-aware.
- **Option B: Skill + authoring contract (recommended)**: Keep advisory writing rules, but require structured section payloads (claims, evidence objects, implication blocks, source anchors) before `compile_deck_json.py`. This aligns with Gamma-style “content-first then render” behavior.
- **Option C: Full adaptive controller**: Add depth scoring + automatic rewrite loops until rubric threshold is met. Highest quality ceiling, but more complexity and higher implementation cost.

## Comparison

| Approach | Speed to Ship | Quality Gain | Risk | Fit for V1 |
|---|---:|---:|---:|---|
| A) Skill-only | High | Medium-low | Low | Temporary only |
| B) Skill + authoring contract | Medium | High | Medium | **Best balance** |
| C) Full adaptive controller | Low | Very high | High | Better for V2 |

Recommended: **Option B now**, then evolve toward Option C once depth metrics stabilize.

## Detailed Analysis

### 1) Reverse-engineering Gamma (what matters)

From Gamma developer docs and help guides, the practical controls are:

- `textOptions.amount` (`brief`, `medium`, `detailed`, `extensive`) to set expected content depth.
- `textMode` (`generate`, `condense`, `preserve`) to decide whether AI expands, compresses, or keeps user content shape.
- `numCards` to constrain/target slide count explicitly.
- Card splitting controls (`cardSplit`, `inputTextBreaks` with `---`) to preserve authored structure.
- Template-first creation endpoint (`create from template`) to separate structure from narrative generation.

Design implication for Talkbook: depth quality improves when the system receives a rich, segmented content payload before layout rendering, not just free-form bullets.

### 2) Sales-agent deck patterns (cross-vendor)

Common patterns across sales-focused systems:

- CRM-native invocation from opportunity/deal records.
- Template recommendation based on stage/use case.
- Smart field mapping from CRM to deck placeholders.
- AI-generated narrative sections from call/meeting context.
- Human-in-the-loop review before sharing.
- Post-send analytics for effectiveness feedback.

Design implication for Talkbook: the “agent skill” should capture context variables up front (audience, decision, constraints, evidence set, period definitions) before writing slide text.

### 3) Current Talkbook bottlenecks (repo-grounded)

- `dist/kpmg-talkbook-consulting-copilot/SKILL.md` enforces archetype-first workflow, but does not define numeric depth floors per archetype.
- `dist/kpmg-talkbook-consulting-copilot/references/writing-archetypes.md` defines structure well, but not a hard minimum evidence payload schema.
- `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md` has tight `density_limits` (`max_bullets_total`, `max_chars_per_bullet`) that can over-compress complex content.
- `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py` normalizes and truncates text by those limits, which can remove nuance.
- `dist/kpmg-talkbook-consulting-copilot/runtime/generator/index.js` flags overflow risk but does not enforce minimum text/evidence density.
- Existing tests validate file contracts and workflow language, but do not enforce minimum analytical depth per slide.

### 4) Quantified local gap snapshot (Feb 6, 2026)

Observed from local JSON artifacts:

- NVIDIA sample (`samples/v1-nvidia-v2.json`): ~40 slides, ~1414 chars/slide avg.
- Talkbook v2 strategy sample: ~457 chars/slide avg.
- Talkbook v2 finance sample: ~362 chars/slide avg.

Interpretation: Talkbook is currently producing ~25-32% of the NVIDIA sample’s per-slide text density.

### 5) Additional findings from live `agent-browser` inspection (Feb 6, 2026)

- Gamma `Generate API parameters explained` explicitly documents behavior coupling:
  - `textMode=generate|condense|preserve`
  - `textOptions.amount=brief|medium|detailed|extensive`
  - `cardSplit=auto|inputTextBreaks`, where `inputTextBreaks` uses `---` delimiters and ignores `numCards`.
- Gamma `Generate a gamma` reference confirms format expansion beyond presentations (`document`, `webpage`, `social`) and card limits by plan (Pro up to 60 cards, Ultra up to 75 cards).
- Gamma `Create from Template API parameters explained` shows template remix behavior:
  - required `gammaId` + `prompt`
  - template-constrained generation with optional theme/folder/export/sharing overrides
  - token budget shared with template context, reducing effective prompt budget versus plain generation.
- Marq HubSpot and Salesforce help docs show a repeatable sales-agent pattern:
  - context capture from CRM/opportunity + call recordings
  - template suggestion and one-click generation
  - smart field data binding
  - engagement/performance tracking back into CRM.
- Seismic buyer-engagement page confirms a similar pattern language:
  - AI-based personalization
  - digital sales rooms
  - meeting/engagement intelligence and content recommendations.

## Recommendations

1. Add a **Depth Contract** to writing archetypes (required minimums): headline claim count, evidence object count, interpretation count, source anchors.
2. Add a **Pre-compile Authoring Payload** format in skill guidance: `claim`, `evidence`, `implication`, `decision`, `source` blocks per slide section.
3. Use the **skill-creator structure** explicitly for all guidance assets: purpose, triggers, workflow, examples, constraints, failure modes, and checklist mapping.
4. Add archetype-specific density targets (for example: strategy synthesis >= 6 claim lines with 4 numeric anchors; finance walkthrough >= 1 dense table + 4 interpretation bullets).
5. Add a rubric gate at build-time as **advisory fail** (non-blocking): score dimensions such as quantification depth, evidence relevance, and decision usefulness.
6. Add benchmark replay tests comparing generated outputs against target density bands from approved exemplars.
7. Keep visual template independence explicit: parity target is writing quality and information density, not pixel-level style imitation.

## Open Questions For Logged-In Gamma Reverse Engineering

The remaining unknowns are inside the authenticated product experience and are not fully observable from public docs.

1. Which hidden normalization step rewrites prompt text before generation in the web app flow?
2. Does Gamma apply internal per-card text budgets after `textOptions.amount` selection, and can we infer the heuristic?
3. How does in-app “Create from Template” map prompt segments to specific template sections/cards?
4. What additional non-public request fields are sent by the web app (if any) beyond public API docs?
5. In iterative edits (inside Gamma), what operations are used most often: rewrite, condense, expand, re-layout, or split/merge?

### Proposed capture plan (requires your login)

1. Open Gamma web app and create one deck from a short prompt and one from dense structured input.
2. Capture network requests in DevTools for both generate and template-remix paths.
3. Compare request payloads and response metadata against public API fields.
4. Record observable transformation rules (prompt segmentation, depth setting behavior, card splitting behavior).
5. Add a “Gamma inference table” to this brief with only reproducible findings.

## Implementation Outline

1. Extend `writing-archetypes.md` with a required “Depth Contract” field per archetype.
2. Extend `writing-checklist.md` with minimum numeric thresholds by archetype family.
3. Add `references/authoring-payload-contract.md` describing a structured content object for each slide section.
4. Update `SKILL.md` and `agents/openai.yaml` to require payload completion before `upsert_section.py`.
5. Add contract tests to validate depth fields exist and workflow text references the payload contract.
6. Add evaluation script/tests that compute per-slide density and evidence coverage and report deltas against benchmark targets.
7. Run two benchmark scenarios (strategy + finance), record scores, and iterate thresholds.

## Risks & Considerations

- Over-optimizing for text volume can harm readability: depth thresholds must include clarity constraints.
- Domain drift risk: generic strategy archetypes and finance archetypes need separate minimums.
- Source quality risk: deeper text without strong source traceability increases hallucination risk.
- Operational risk: if thresholds are too strict too early, users may bypass the workflow.

## Codebase Patterns

### Skill Structure Map

| File | Role in the skill | Why it matters for depth |
|---|---|---|
| `dist/kpmg-talkbook-consulting-copilot/SKILL.md` | Primary behavioral contract and workflow | Where mandatory archetype/depth steps must be explicit |
| `dist/kpmg-talkbook-consulting-copilot/agents/openai.yaml` | Default assistant prompt wiring | Must reinforce the same depth contract as `SKILL.md` |
| `dist/kpmg-talkbook-consulting-copilot/references/writing-archetypes.md` | Archetype templates and writing doctrine | Best place for per-archetype minimum evidence requirements |
| `dist/kpmg-talkbook-consulting-copilot/references/writing-checklist.md` | Pre-finalization QA and rubric | Natural place for measurable pass/fail depth thresholds |
| `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md` | Layout intents and density limits | Current caps can suppress verbose analytical writing |
| `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py` | Content-to-slot synthesis and truncation | Key leverage point for preserving structured evidence payloads |
| `dist/kpmg-talkbook-consulting-copilot/runtime/generator/index.js` | Slot rendering, overlap checks, overflow warnings | Can validate overflow but currently not minimum information density |

- Skill contract and user workflow: `dist/kpmg-talkbook-consulting-copilot/SKILL.md`
- Agent default instruction surface: `dist/kpmg-talkbook-consulting-copilot/agents/openai.yaml`
- Writing doctrine: `dist/kpmg-talkbook-consulting-copilot/references/writing-archetypes.md`
- Pre-finalization checks: `dist/kpmg-talkbook-consulting-copilot/references/writing-checklist.md`
- Density and mapping policy: `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md`
- Content synthesis path: `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py`
- Render-time behavior: `dist/kpmg-talkbook-consulting-copilot/runtime/generator/index.js`
- Existing contract tests: `tests/test_talkbook_writing_guide_contract.py`, `tests/test_talkbook_skill_instruction_contract.py`, `tests/test_talkbook_slot_quality_rules.py`

## Sources

- [Gamma Docs: Understand the API options](https://developers.gamma.app/docs/understand-the-api-options)
- [Gamma Docs: Generate API parameters explained](https://developers.gamma.app/docs/generate-api-parameters-explained)
- [Gamma API Reference: Generate a gamma](https://developers.gamma.app/reference/generate-a-gamma)
- [Gamma Docs: Create from Template API parameters explained](https://developers.gamma.app/docs/create-from-template-parameters-explained)
- [Gamma Docs: Introduction to Gamma's API offerings](https://developers.gamma.app/docs/getting-started)
- [Gamma Docs: Access and Pricing](https://developers.gamma.app/docs/get-access)
- [Gamma Changelog](https://developers.gamma.app/changelog)
- [Marq Help: HubSpot AI-Powered Sales Decks](https://help.marq.com/hubspot-ai-powered-sales-decks-with-marq)
- [Marq Help: Salesforce CRM Integration Overview](https://help.marq.com/salesforce-crm-integration-with-marq-overview)
- [Marq Platform: CRM Integrations](https://www.marq.com/pages/platform/crm-integrations/)
- [Seismic Platform: Buyer & Customer Engagement](https://www.seismic.com/platform/buyer-customer-engagement/)
