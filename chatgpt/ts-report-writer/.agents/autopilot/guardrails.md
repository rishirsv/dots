# Guardrails

Signs are patterns learned from past failures. Read before each iteration.

## How to Add a Sign

When you encounter a recurring failure:
1. Add a new Sign section below
2. Document the trigger, instruction, and when it was learned
3. Log the failure in errors.log

---

<!-- Signs will be added below by the agent -->

### Sign: Full-Report Cleanup Required for PPTX

- **Trigger**: Extracted markdown from PPTX includes engagement-letter/legal/cover/navigation fragments in canonical sections.
- **Instruction**: Perform one full-report cleanup pass across every canonical section before QA; do not run pass/fail gating after partial section-only cleanup.
- **Added after**: Iteration 1 - Garrison extraction produced heavy boilerplate leakage from auto-mapping.

### Sign: Encrypted Office Source Blocks Strict Extraction

- **Trigger**: `extract_source_text.py` on a `.pptx` fails with `File is not a zip file`, and `file <report>` returns `CDFV2 Encrypted`.
- **Instruction**: Treat the story as blocked immediately, log blocker details, and request a decryptable/unlocked source export instead of retrying cleanup/QA steps.
- **Added after**: Iteration 2 - story 2.0 source could not be parsed because the report is encrypted.

### Sign: Cleanup Quality Gate Requires Fragment Pruning

- **Trigger**: `scripts/qa_gates.py` fails `cleanup_quality` with `cleanup_quality_fragment` issues after provenance already passes.
- **Instruction**: Perform a full-report cleanup pass to remove trailing sentence fragments/navigation bullets, regenerate render-trace + selected-lines + section mapping artifacts together, then rerun provenance and gates.
- **Added after**: Iteration 5 - project-cinema-report passed provenance but initially failed fail-closed cleanup quality.

