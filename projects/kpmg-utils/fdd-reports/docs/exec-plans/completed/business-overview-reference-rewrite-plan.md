# Business Overview Reference Rewrite Plan

## Summary

Rewrite `skill/kpmg-fdd/references/business-overview.md` from a slot-oriented section contract into a narrative-component reference aligned to the business overview corpus and compatible with later transformation into slide content.

## Phase outcomes

### Phase 1: Lock the contract shape

This phase gives the reference a clear heading structure and separates business-overview-specific guidance from global writing rules.

### Phase 2: Rewrite the authoring logic

This phase teaches the author how to think through the section analytically instead of filling pseudo-slots.

### Phase 3: Add composition guidance

This phase shows how to assemble narrative components into valid section shapes for different business archetypes.

### Phase 4: Add examples and validate against the corpus

This phase makes the contract teachable and checks that the rewrite reflects real diligence writing patterns.

## Implementation checklist

- [x] 1.0 Confirm the rewrite is scoped to `skill/kpmg-fdd/references/business-overview.md` only
- [x] 1.1 Replace the current heading model with the new 13-section structure
- [x] 1.2 Move required-versus-optional guidance into `Section architecture`
- [x] 1.3 Remove slot-first framing from the document structure
- [x] 1.4 Preserve references to `references/global-writing-conventions.md` for universal rules
- [x] 2.0 Rewrite `Core principles`
- [x] 2.1 Replace the current workflow with the seven-step analytical workflow
- [x] 2.2 Define mandatory and optional blocks with trigger-based usage rules
- [x] 2.3 Define the full narrative-component catalog
- [x] 2.4 Add the inverse rule for optional blocks: include only when analytically relevant
- [x] 3.0 Add three assembly patterns
- [x] 3.1 Add section-specific writing guidance that does not duplicate global rules
- [x] 3.2 Add a rewritten mistakes section aligned to the new model
- [x] 3.3 Add rewritten preflight and split policies
- [x] 4.0 Add one micro-example per narrative component
- [x] 4.1 Add one simple full example
- [x] 4.2 Add one complex full example
- [x] 4.3 Validate the rewrite against representative corpus archetypes
- [x] 4.4 Confirm no example relies on extraction artifacts or slide jargon

## Notes

- This implementation rewrites only `skill/kpmg-fdd/references/business-overview.md`.
- `references/global-writing-conventions.md` remains unchanged.
- `references/section-contract-standard.md` remains unchanged in this pass.
- Validation completed by reviewing the rewritten contract against the business overview corpus, checking for residual slot-era headings or terms, and confirming the new examples avoid extraction artifacts.
- Follow-up refinements removed per-component placeholder repetition, inlined each component example under its component definition, replaced the preflight and split sections with a single verification section, and deferred a future `Common mistakes` section to `TODOS.md` pending testing feedback.
