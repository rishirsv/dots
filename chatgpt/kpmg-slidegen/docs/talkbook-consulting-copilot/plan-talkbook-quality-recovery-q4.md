# Plan: Talkbook Quality Recovery (Q4)

## Summary

This plan re-architects Talkbook so outputs match consulting-grade quality standards for:

1. Visual coherence (no generic, repetitive slides)
2. Information density (evidence-rich, decision-useful content)
3. Contract fidelity (compiled slots are actually rendered)
4. Predictable quality (CI gates catch regressions)
5. Recursive quality improvement (iterate until benchmark standards are met)

The current system works functionally but fails qualitatively because layout selection, slot rendering, and strict autofix policies are misaligned.

## Why This Plan Exists

Current failure patterns are structural:

- Layout selection overweights inferred shape and collapses to one layout.
- The runtime renderer does not draw some compiled slots (notably table+insights behavior).
- Strict-mode autofixes trim content to pass checks instead of preserving information.
- Tests mostly verify contracts/docs, not output quality outcomes.

## Recommended Direction

Use a **robust architecture shift**:

- Move to a layout-registry renderer with explicit slot coverage per layout.
- Make layout selection intent-first with diversity safeguards.
- Replace truncation-centric strict fixes with reflow/spillover and citation routing.
- Add benchmark-based quality gates (Project North/NVIDIA-informed, plus additional exemplars) in CI.
- Add a recursive quality-ratchet loop that compares generated outputs against Project North, Gamma research findings, and other benchmark exemplars (etc.) until gates pass.

## Scope

### In Scope

- Talkbook skill flow, compile pipeline, runtime renderer, and quality gates.
- Session compatibility and migration behavior.
- Benchmark harness and output-quality tests.

### Out of Scope

- Full visual cloning of Project North template internals.
- Rewriting the entire platform outside Talkbook-specific paths.

## Architecture Changes (Decision-Complete)

1. `compile_deck_json.py` becomes intent-first and diversity-aware in layout selection.
2. `runtime/generator/index.js` moves from heuristic branching to a layout registry.
3. Strict-mode autofix in `build_deck.py` prioritizes reflow/continuation over truncation.
4. Citation handling follows `notes_appendix` by default and avoids footer overload.
5. CI enforces density, slot coverage, evidence coverage, and layout diversity gates.
6. Final output pass uses recursive improve-and-retest rounds with hard stop criteria and a consulting-value threshold ("$100k deck bar").

## Phased Implementation

### Phase 1: Quality Gates and Baseline Harness
What this achieves (non-technical): We stop shipping decks that look “acceptable” to the system but bad to humans.

- Add benchmark harness script for:
  - visible chars/slide (excluding citations),
  - layout diversity ratio,
  - evidence coverage ratio,
  - slot coverage ratio.
- Add tests that fail on current known failure modes.

Deliverables:

- `dist/kpmg-talkbook-consulting-copilot/scripts/benchmark_quality.py`
- `tests/test_talkbook_render_slot_coverage.py`
- `tests/test_talkbook_layout_diversity.py`
- `tests/test_talkbook_density_gate.py`

Exit criteria:

- Existing “bad” run fails at least one new gate.
- Benchmark report can be generated deterministically from saved sessions.

### Phase 2: Compile Selection Re-architecture (Intent-First)
What this achieves (non-technical): Slides choose the right structure for meaning, not just whichever shape happened to parse first.

- Refactor `_choose_layout()` in `compile_deck_json.py`:
  - forced layout override
  - hard structural-intent routing (cover/agenda/divider/closing)
  - intent match as primary filter
  - shape as tie-breaker
  - density-fit scoring
  - diversity penalty (anti-collapse)
- Support `mixed` evidence shape (table+chart) without defaulting to table.
- Add compile diagnostics for:
  - dominant layout overuse
  - ignored evidence object types
  - outline-to-layout drift.

Deliverables:

- Updated `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py`
- Tests in:
  - `tests/test_talkbook_payload_contract.py`
  - `tests/test_talkbook_copilot_lifecycle.py`
  - new `tests/test_talkbook_layout_diversity.py`

Exit criteria:

- Multi-section scenario (>=8 slides) uses at least 4 distinct layouts.
- Cover/agenda/roadmap/recommendation sections map to corresponding families.

### Phase 3: Renderer Contract Alignment (Layout Registry)
What this achieves (non-technical): No more “content exists in JSON but disappears on slides.”

- Introduce `layout_registry.js`:
  - explicit renderer per `layout.<slug>`
  - explicit accepted slot names
  - explicit slot aliases for backward compatibility.
- Update `runtime/generator/index.js` to dispatch by exact slug.
- Ensure table+insights layouts render insights and table simultaneously.

Deliverables:

- `dist/kpmg-talkbook-consulting-copilot/runtime/generator/layout_registry.js` (new)
- refactored `dist/kpmg-talkbook-consulting-copilot/runtime/generator/index.js`

Exit criteria:

- Slot coverage test passes for all required slots in mapped layouts.
- No compiled required slot is silently dropped in manifest output.

### Phase 4: Density Preservation and Citation Routing
What this achieves (non-technical): Content stays rich instead of being chopped to fit.

- Replace hard char slicing with:
  - word-boundary truncation + ellipsis for unavoidable clipping,
  - continuation slide spillover for oversized analytical sections.
- Route citations to notes/appendix for `notes_appendix` mode.
- Deduplicate sources and avoid payload/source double-insertion.

Deliverables:

- updates to:
  - `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py`
  - `dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py`

Exit criteria:

- Strict build no longer passes by removing core analytical bullets.
- Source traceability remains intact with low footer overload.

### Phase 5: Strict Autofix Policy Redesign
What this achieves (non-technical): “Fixing the slide” improves readability without deleting key facts.

- Autofix order:
  1. reduce font size within safe bounds
  2. adjust line spacing/margins
  3. split content into continuation slide
  4. only then trim low-priority non-analytical text
- Add severity classes so citation overflow is treated differently from body overflow.

Deliverables:

- enhanced autofix logic in `dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py`
- tests for overflow policy behavior.

Exit criteria:

- No truncation of high-priority analytical content in benchmark runs.
- Fewer manual edits required after strict pass.

### Phase 6: End-to-End Benchmark and CI Integration
What this achieves (non-technical): Quality stays high over time, not just one successful run.

- Add CI job:
  - generate benchmark sessions,
  - compile/build with strict mode,
  - run quality gates,
  - fail on threshold breach.
- Benchmark pack includes:
  - current Talkbook reference scenario,
  - NVIDIA sample alignment scenario,
  - Project North-inspired density/style scenario.

Deliverables:

- CI command wiring in repo test pipeline
- benchmark fixtures and baseline reports in `docs/talkbook-consulting-copilot/`.

Exit criteria:

- CI reliably fails for layout-collapse, slot-drop, or density regressions.

### Phase 7: Recursive Quality Ratchet (Final Pass)
What this achieves (non-technical): The deck is repeatedly improved until it actually meets consulting-quality standards, not just technical checks.

- Add a post-build recursive loop:
  1. Build candidate deck and render PNG/PDF artifacts
  2. Run visual + density + writing-quality scoring against benchmark pack
  3. Generate structured fix actions (layout swap, reflow, split slide, strengthen evidence, tighten message line, improve interpretation)
  4. Apply fixes
  5. Rebuild and re-score
  6. Repeat until pass or max rounds reached
- Benchmarks used in this loop:
  - Project North benchmark pack (existing)
  - Gamma-derived writing/depth controls from research findings
  - Additional benchmark exemplar packs (etc.) as first-class fixtures
- Add strict visual/text gates:
  - no overlap/out-of-bounds
  - minimum visible text density (excluding source footer)
  - no clipped/mid-word truncation patterns in rendered text
  - minimum evidence-to-claim ratio
  - minimum layout diversity
  - minimum interpretation/decision-usefulness score
- Add consulting-value rubric gate:
  - Composite quality score >= threshold representing "$100k deck standard"
  - Required pass in all critical dimensions (message quality, analytical depth, evidence credibility, executive decision usefulness, visual polish)

Deliverables:

- `dist/kpmg-talkbook-consulting-copilot/scripts/quality/recursive_improve.py`
- `dist/kpmg-talkbook-consulting-copilot/scripts/quality/score_visual_density.py`
- `dist/kpmg-talkbook-consulting-copilot/scripts/quality/score_writing_quality.py`
- `dist/kpmg-talkbook-consulting-copilot/references/quality-benchmarks/project-north/*.json`
- `dist/kpmg-talkbook-consulting-copilot/references/quality-benchmarks/gamma-research/*.json`
- `dist/kpmg-talkbook-consulting-copilot/references/quality-benchmarks/exemplars/*.json`
- `tests/test_talkbook_recursive_quality_gate.py`
- `tests/test_talkbook_visual_density_gate.py`
- `tests/test_talkbook_consulting_value_rubric.py`

Exit criteria:

- Recursive loop converges within configured max rounds on benchmark scenarios.
- Final candidate satisfies all hard gates and the consulting-value threshold.
- Loop emits full audit trail (per-round scores, actions applied, deltas).

## Task List

- [ ] 1.0 Build quality benchmark harness
  - [ ] 1.1 Implement `benchmark_quality.py`
  - [ ] 1.2 Add fixture definitions for 3 benchmark scenarios
  - [ ] 1.3 Validation: benchmark script outputs deterministic JSON report
- [ ] 2.0 Add quality gate tests
  - [ ] 2.1 Add slot coverage test
  - [ ] 2.2 Add layout diversity test
  - [ ] 2.3 Add density/evidence gate test
  - [ ] 2.4 Validation: tests fail on current bad baseline
- [ ] 3.0 Refactor compile layout selection
  - [ ] 3.1 Implement intent-first selector pipeline
  - [ ] 3.2 Add mixed-evidence handling
  - [ ] 3.3 Add dominant-layout warning/fail threshold
  - [ ] 3.4 Validation: 10-slide scenario no longer collapses to one layout
- [ ] 4.0 Implement runtime layout registry
  - [ ] 4.1 Create per-layout renderer map
  - [ ] 4.2 Add slot alias compatibility layer
  - [ ] 4.3 Validate table+insights and chart+text layout fidelity
  - [ ] 4.4 Validation: slot coverage passes
- [ ] 5.0 Rework density handling + citations
  - [ ] 5.1 Replace hard slicing with reflow-first behavior
  - [ ] 5.2 Route citations by `citation_mode`
  - [ ] 5.3 Dedupe payload/section source emission
  - [ ] 5.4 Validation: no analytical truncation in strict round
- [ ] 6.0 Redesign strict autofix policy
  - [ ] 6.1 Add priority-aware overflow handling
  - [ ] 6.2 Add continuation-slide generation
  - [ ] 6.3 Validation: strict passes without deleting critical insights
- [ ] 7.0 CI integration and rollout
  - [ ] 7.1 Add benchmark + quality gates to CI
  - [ ] 7.2 Add migration notes in docs
  - [ ] 7.3 Validation: green CI on baseline, red CI on induced regressions
- [ ] 8.0 Implement recursive quality ratchet
  - [ ] 8.1 Build per-round visual+density+writing scorer
  - [ ] 8.2 Add Project North, Gamma, and additional exemplar benchmark fixtures (etc.)
  - [ ] 8.3 Implement fix-action generator and apply loop
  - [ ] 8.4 Add hard stop criteria and max-round policy
  - [ ] 8.5 Validation: benchmark runs converge and pass consulting-value threshold

## Acceptance Criteria

1. A 10-slide detailed run uses >= 4 unique layouts and no single layout > 60%.
2. All required non-empty compiled slots are rendered (or explicitly aliased) with manifest proof.
3. `depth_warning_total` is 0 for detailed-mode benchmark runs.
4. Strict mode does not trim analytical body content as a primary fix.
5. Source traceability remains intact without footer overload.
6. CI gates enforce density, evidence, layout diversity, and slot coverage.
7. Recursive final pass is enabled and required for release candidates.
8. Release-candidate decks meet consulting-value threshold ("$100k deck bar") with traceable per-round scoring.

## Migration and Compatibility

- Keep V1/V2 sessions readable via existing migration in `common.py`.
- Add renderer/compiler version metadata in session settings for controlled rollouts.
- Maintain backward compatibility for legacy slot names through alias map in the renderer.

## Risks and Mitigations

- Risk: Layout registry refactor introduces render regressions.
  - Mitigation: snapshot manifest comparisons per layout before/after.
- Risk: Reflow/continuation increases slide count unexpectedly.
  - Mitigation: enforce max expansion policy and report expansion reasons.
- Risk: Quality gates become brittle.
  - Mitigation: calibrate thresholds using 3 benchmark families and track drift.
- Risk: Recursive loop increases runtime and may stall on hard cases.
  - Mitigation: enforce max rounds, deterministic fallback actions, and explicit fail-fast diagnostics.
- Risk: Additional benchmark exemplar assets may be incomplete initially.
  - Mitigation: ship with Project North + Gamma gates first, then progressively add exemplar packs as required gates once fixtures are complete.

## Recommended Implementation Order

1. Phase 1 (gates first)
2. Phase 2 (compile selector)
3. Phase 3 (renderer registry)
4. Phase 4 and 5 (density/citations and strict autofix redesign)
5. Phase 6 (CI hardening)
6. Phase 7 (recursive quality ratchet and value-gate enforcement)

This order ensures we measure quality regressions before changing core architecture and can prove each upgrade improves outputs.
