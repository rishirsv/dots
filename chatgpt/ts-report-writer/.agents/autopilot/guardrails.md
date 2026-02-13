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

### Sign: Pipeline Block + Empty Source-Text Folder Indicates Encrypted PPTX

- **Trigger**: Single-report `pipeline run` marks status `blocked` with `File is not a zip file`, and `source-text/pptx/` is created but empty.
- **Instruction**: Do not attempt manual cleanup, QA gates, or additional conversion retries; immediately follow blocked-story protocol and request an unlocked source.
- **Added after**: Iteration 6 - story 6.0 failed with the same encrypted-container pattern after strict pipeline and source-text attempts.

### Sign: Cleanup Quality Gate Requires Fragment Pruning

- **Trigger**: `scripts/qa_gates.py` fails `cleanup_quality` with `cleanup_quality_fragment` issues after provenance already passes.
- **Instruction**: Perform a full-report cleanup pass to remove trailing sentence fragments/navigation bullets, regenerate render-trace + selected-lines + section mapping artifacts together, then rerun provenance and gates.
- **Added after**: Iteration 5 - project-cinema-report passed provenance but initially failed fail-closed cleanup quality.

### Sign: Provenance Pass Can Still Hide Wrong Section Placement

- **Trigger**: Extracted markdown lines are verbatim but section semantics are wrong when compared to montage flow (for example, subsection text placed as executive summary).
- **Instruction**: Run manual montage reconciliation before pass, record page IDs in review-notes, and remap lines by nearest canonical section without rewriting text.
- **Added after**: Cinema cleanup follow-up where markdown quality looked clean but section alignment vs PNG was still incorrect.

### Sign: Single-Report Rerun Can Regress Cleaned Output

- **Trigger**: Re-running strict pipeline for a report that was already manually cleaned causes large fragment-heavy markdown/regressions in provenance and cleanup gates.
- **Instruction**: Preserve or restore the last QA-passing artifact set before continuing; if rerun is required for compliance, immediately rerun provenance + gates and keep the cleaned version unless you also complete a full cleanup pass again.
- **Added after**: Iteration 8 - cinema single-file rerun overwrote cleaned markdown and required restoration before final pass.

### Sign: Template Header Changes Must Re-Align Render Trace

- **Trigger**: QA gates fail `markdown_trace_sync` after inserting/rewriting markdown header sections (for example required source evidence or coverage map), even though extracted bullets are source-backed.
- **Instruction**: Recalculate `render-trace.json` `markdown_line_number` values against the final markdown text after header/table edits, then rerun provenance + gates.
- **Added after**: Iteration 11 - story 10.0 initially failed trace sync because template metadata insertion shifted bullet line numbers.

### Sign: Selected-Line Section Candidates Must Match Render Sections

- **Trigger**: `qa_gates.py` fails `section_completeness` with many `section_line_missing` and mirrored `section_line_unexpected` issues after cleanup pruning.
- **Instruction**: When pruning/reassigning strict lines, update `selected-lines.jsonl` `section_candidate` values to match final rendered section placement and regenerate `section-accounting.json` + `section-map.json` + `render-trace.json` together.
- **Added after**: Iteration 12 - story 11.0 initially passed provenance/cleanup but failed section completeness due stale section candidates.
