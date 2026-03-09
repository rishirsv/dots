# Skill DeckSpec Guidance Sync Plan

## Summary
Refresh `skills/kpmg-slides` documentation so deckSpec author guidance matches the current registry/pagination/layout-contract architecture before skill sync.

## Phase Outcomes

### Phase 1: Canonical Guidance Baseline
Writers and maintainers share one consistent vocabulary for runtime-managed vs author-managed deckSpec behavior.

### Phase 2: Contract Guidance Alignment
Core contract docs describe continuation/recompute behavior accurately and remove stale behavior implications.

### Phase 3: Schema + Starter Alignment
Schema and starter template reinforce the same guidance and avoid suggesting non-enforced controls.

### Phase 4: QA and Layout Decision Alignment
QA and layout-policy references explicitly cover policy-driven pagination outcomes and practical checks.

### Phase 5: Validation and Sync Readiness
Skill docs validate, skill bundle sync/verify runs, and plan is ready to move to completed.

## Implementation Checklist

- [x] 1.0 Baseline and terminology lock
  - [x] 1.1 Review current skill docs for stale pagination/split guidance.
  - [x] 1.2 Lock canonical terms: `dropFields`, `recomputeFields`, `runtime-managed`.

- [x] 2.0 Core contract docs refresh
  - [x] 2.1 Update `skills/kpmg-slides/references/slide-contract.md` with behavioral notes.
  - [x] 2.2 Remove stale `readability_first` runtime implication.
  - [x] 2.3 Clarify `contents.sections[].pageRange` ownership.

- [x] 3.0 Entry docs, schema, and starter alignment
  - [x] 3.1 Keep `skills/kpmg-slides/SKILL.md` concise and route to references.
  - [x] 3.2 Update `skills/kpmg-slides/references/INDEX.md` read order.
  - [x] 3.3 Update `skills/kpmg-slides/references/deckspec.schema.json` descriptions for advisory/runtime-managed semantics.
  - [x] 3.4 Update `skills/kpmg-slides/assets/templates/deckspec-starter.json` where examples could imply stale behavior.

- [x] 4.0 QA and layout guidance alignment
  - [x] 4.1 Update `skills/kpmg-slides/references/quality_assurance.md` for pagination decision checks.
  - [x] 4.2 Update `skills/kpmg-slides/references/layout-policy.md` with pagination side-effect notes.

- [x] 5.0 Validate and sync
  - [x] 5.1 Run skill validation.
  - [x] 5.2 Run `npm run skill:sync`.
  - [x] 5.3 Run `npm run skill:verify`.
  - [x] 5.4 Move plan file to `docs/exec-plans/completed/` when complete.
