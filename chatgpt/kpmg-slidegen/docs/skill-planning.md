---
owner: kpmg-slidegen maintainers
status: superseded
last-reviewed: 2026-02-23
review-cycle-days: 14
source-of-truth: docs/skill-planning.md
verification-state: planning-wip
---

# SlideGen Skill Planning (WIP)

Superseded by `docs/skill-rebuild/plan-skill-rebuild.md` for implementation and current direction.

Purpose:

- Define the best UX for invoking SlideGen as a skill inside live conversations.
- Support both "mid-discussion compile now" and "start-from-zero planning" workflows.
- Keep the experience consistent across ChatGPT, Codex, and Claude.

## North Star UX

The assistant can be invoked at any point in a conversation and can:

1. Understand current context (notes, decisions, numbers, claims).
2. Map context to slide intents and layout slots.
3. Produce `deckSpec`.
4. Run generator + QA.
5. Return `.pptx` with concise QA summary and editable follow-ups.

## Core UX Modes

## Mode A: Compile From Existing Context (default mid-thread)

When to use:

- User has already developed content in the current thread (for example QoE adjustments from meeting notes).

Behavior:

1. Harvest context from conversation + explicitly attached files.
2. Extract claims, numbers, sources, and required caveats.
3. Map to layouts and slots.
4. Generate deck artifacts.
5. Present "inferred vs explicit" summary.

Best for:

- Fast conversion from analysis to client-ready draft.

## Mode B: Guided Planning Mode (default at thread start with little context)

When to use:

- Invocation happens at the beginning and meaningful source context is missing.

Behavior:

1. Clarify scope, audience, objective, and decision needed.
2. Propose outline (sections + slide intents).
3. Co-author content iteratively with user.
4. Compile and generate when user confirms.

Best for:

- Building a deck from scratch without prior notes in thread.

## Mode C: Surgical Revision Mode (post-generation)

When to use:

- User wants targeted edits after seeing draft output.

Behavior:

1. Accept concise edit instructions by slide/section.
2. Recompile only affected slide specs when possible.
3. Regenerate and return updated `.pptx`.

Best for:

- Fast polish loops.

## Mode Selection Policy

Auto selection:

1. If user explicitly requests planning/discovery -> Mode B.
2. If thread has substantial structured content -> Mode A.
3. If user references existing generated deck and asks edits -> Mode C.

Confidence fallback:

- If mode confidence is low, assistant asks one concise disambiguation question with 2-3 options.

## Canonical Interaction Flows

## Flow 1: Mid-thread compile

User: "Create quality of earnings slides from this discussion."

Assistant skill:

1. Summarizes extracted findings and assumptions.
2. Shows planned slide map (short).
3. Runs generation.
4. Returns `.pptx`, QA summary, and next-step commands.

## Flow 2: Start-of-thread planning

User: "Help me build a QoE deck."

Assistant skill:

1. Runs scoped Q&A (objective, audience, timeline, evidence available).
2. Builds outline and asks for approval.
3. Drafts content slide-by-slide with user.
4. Generates when approved.

## Flow 3: Revision loop

User: "Slide 4 is too dense and slide 7 should be chart-first."

Assistant skill:

1. Confirms requested deltas.
2. Applies only relevant layout/content edits.
3. Regenerates and returns updated file.

## Output Contract

Each run should return:

1. `.pptx` path
2. `deckSpec` path
3. QA summary:
   - pass/fail
   - blocking issues count
   - advisory issues count
4. "Assumptions made" section
5. Quick follow-up actions (for edits)

## Quality Gates (always-on)

Before returning output:

1. Schema/slot validity
2. Required slot completeness
3. Title max-char compliance
4. Chart/table integrity checks
5. QA pass check (blocking issues = 0 target)

## On-Demand Validation (not always-on)

Optional commands only when user asks:

1. Contract drift tests
2. Visual montage diagnostics
3. Stress sample generation

## Multi-Platform Deployment Pattern

Shared core:

- One "SlideGen orchestration engine" behavior and policy.

Platform adapters:

1. ChatGPT wrapper: natural invocation and artifact handoff.
2. Codex wrapper: repo-local execution and file paths.
3. Claude wrapper: context ingestion + external tool execution bridge.

Rule:

- Platform wrappers should not fork core authoring policy.

## Alternative UX Options and Tradeoffs

## Option 1: Always compile immediately

Pros:

- Fastest time-to-output.

Cons:

- Weak when context is thin; more hallucinated assumptions.

## Option 2: Always force planning first

Pros:

- Better content quality control.

Cons:

- Slower and frustrating for users who already did analysis.

## Option 3: Hybrid adaptive mode (recommended)

Pros:

- Best balance of speed and quality.

Cons:

- Requires strong mode-selection policy and clear summaries.

## Recommended Default

Use adaptive hybrid:

1. Mid-thread with rich context -> compile now.
2. Early-thread with sparse context -> guided planning.
3. Post-output edit requests -> surgical revision.

## Minimal Skill Command Vocabulary

User-facing intents:

1. `create deck`
2. `plan deck`
3. `revise deck`
4. `regenerate with changes`
5. `show assumptions`
6. `run deep validation` (explicit only)

## State Model (for implementation)

Suggested states:

1. `intake`
2. `mode-selection`
3. `outline`
4. `slot-compilation`
5. `generation`
6. `qa-check`
7. `revision-loop`
8. `done`

## Risks to Design Around

1. Over-assumption from sparse context.
2. Mismatch between inferred narrative and user intent.
3. Latency creep if planning is overlong.
4. Drift between docs and runtime behavior.

Mitigations:

1. Explicit assumptions block.
2. Compact pre-generation confirmation.
3. Strict defaults + optional deep checks.
4. Contract drift test in CI/on-demand.

## Anthropic learnings

Direct learnings from Anthropic's `pptx` skill (with snippets):

1. Workflow discipline is explicit and role-based.
   > "When edit slides in an existing PowerPoint presentation, you need to work with the raw Office Open XML (OOXML) format."
   > "When you need to create a presentation that follows an existing template's design, you'll need to duplicate and re-arrange template slides..."
2. Visual QA is mandatory in the authoring loop.
   > "**Visual validation**: Generate thumbnails and inspect for layout issues"
   > "Repeat until all slides are visually correct"
3. Template rewriting is deterministic, not heuristic.
   > "The script handles duplicating repeated slides, deleting unused slides, and reordering automatically"
   > "**AUTOMATIC CLEARING**: ALL text shapes from the inventory will be cleared unless you provide \"paragraphs\" for them"
4. Validation failures are aggregated and actionable.
   > "// Throw all errors at once if any exist"
   > "`Multiple validation errors found:`"
5. Shape inventory is standardized for reproducible replacement.
   > "**Shapes**: Ordered by visual position (top-to-bottom, left-to-right) as \"shape-0\", \"shape-1\", etc."
6. They enforce practical rendering constraints up front.
   > "**NEVER use manual bullet symbols (•, -, *, etc.)** - Use `<ul>` or `<ol>` lists instead"
   > "**CRITICAL: Never use CSS gradients** ... **ALWAYS create gradient/icon PNGs FIRST**"
7. They detect quality regressions, not just syntax issues.
   > "if overflow_errors or warnings:"
   > "\"Text overflow worsened:\""
8. Their low-level OOXML path is protected by validation gates.
   > "**CRITICAL**: Validate immediately after each edit and fix any validation errors before proceeding"
   > "`if not validate_document(output_file): output_file.unlink()`"

How we should adapt this for SlideGen:

1. Adopt their validation posture: aggregated errors, overflow/overlap checks, and always-on thumbnail QA.
2. Keep their deterministic template pipeline mindset: explicit slot/shape mapping, strict replacement validation, no silent carryover text.
3. Keep deep stress checks on-demand (for speed), but preserve core QA gates on every run.
4. Treat OOXML editing as an expert-only escape hatch, not the primary authoring path.
5. Do not import their generic "creative palette" guidance as default behavior; our default is KPMG-template-constrained, brand-consistent output.
6. Convert these into explicit SlideGen skill invariants so assistants can author high-quality deck specs without reading builder code.

## Open Questions

1. Should compile mode require an explicit "go" before writing files?
2. How much of conversation history should be harvested by default?
3. Should revision mode support partial slide regeneration only?
4. What is the preferred naming/path policy for generated decks across platforms?

## Next Steps

1. Convert this into a v1 skill spec (`inputs`, `outputs`, `mode policy`, `gates`).
2. Define benchmark scenarios:
   - mid-thread QoE compile
   - zero-context planning
   - revision loop
3. Add run-level telemetry fields for quality and speed.
4. Pilot in ChatGPT first, then mirror behavior in Codex/Claude wrappers.

## Proposed Skill Bundle Structure (`/kpmg-slidegen/skill`)

Minimal target:

- One small bundle that can run now.
- No platform-specific wrappers yet.
- No extra docs unless required to execute.

```text
skill/
  SKILL.md
  manifest.json
  prompt.md
  deckspec.schema.json
  slots.schema.json
```

MVP responsibilities:

1. `SKILL.md`: how to invoke and what outputs are returned.
2. `manifest.json`: version + entry metadata.
3. `prompt.md`: single prompt covering mode selection + generation behavior.
4. `deckspec.schema.json`: generation contract.
5. `slots.schema.json`: slot contract.

MVP conventions:

1. Forward-only implementation (no legacy support).
2. Keep schema files copied into `skill/` for portability.
3. Add complexity only when it solves a real observed gap.

## Future additions (only if needed)

1. Split prompts by mode (`compile`, `planning`, `revision`) after real usage feedback.
2. Add `examples/` when we need canonical few-shot patterns.
3. Add `validation/` docs when QA policy stabilizes.
4. Add `scripts/` wrappers only if runtime orchestration becomes repetitive.
5. Add platform adapters (`chatgpt.md`, `codex.md`, `claude.md`) only when behavior diverges.
6. Add `fixtures/` and regression samples when we see recurring output failures.
