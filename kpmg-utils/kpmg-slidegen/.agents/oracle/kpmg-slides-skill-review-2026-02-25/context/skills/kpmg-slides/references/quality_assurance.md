# Quality Assurance

Use this as the single QA policy for kpmg-slides.

## Table of Contents
- Objective
- QA Workflow (Validate -> Fix -> Repeat)
- Phase 1: Engine QA (Generator + qa.json)
- Phase 2: Deterministic Fix Recipes
- Stopping Rules (Mandatory)
- Storyline QA Gate (Mandatory Before Delivery)
- Visual QA
- Converting to Images
- Delivery Requirements

## Objective

Deliver decks that are both technically valid and client-ready.

Pass criteria:
- Generator/contract QA has no blocking issues.
- Visual QA has no unresolved layout/readability defects.
- Storyline QA passes the quality bar.

## QA Workflow (Validate -> Fix -> Repeat)

Follow this sequence every time:

1. Generate deck artifacts with engine QA output.
2. Read `qa.json` and classify blocking vs non-blocking findings.
3. Apply deterministic fixes by issue class.
4. Regenerate and re-check.
5. Run visual QA on rendered slide images.
6. Run storyline QA before delivery.

## Phase 1: Engine QA (Generator + qa.json)

Run from `kpmg-slides/`.

Preferred command:

```bash
scripts/run_kpmg_slides.sh --in <deckspec-path>.json --out-dir <out-dir>
```

Expected artifacts:
- `<out-dir>/deck.pptx`
- `<out-dir>/qa.json`
- `<out-dir>/preview/` (slide images)
- `<out-dir>/montage.png`

Classify `qa.json` findings:
- Blocking: `errors`, missing required slots, unknown types, hard validation failures.
- High-priority non-blocking: severe overflow/overlap risk, repeated density failures, major visual risk.
- Advisory: minor warnings that do not prevent delivery.

## Phase 2: Deterministic Fix Recipes

Apply fixes by failure class:
- Missing or invalid required slots:
  - Fill required slot content first.
  - Remove unsupported slots for that slide type.
- Density and sparsity issues:
  - Add evidence-rich bullets or supporting facts.
  - Split overloaded slides rather than overstuffing.
- Overflow and pagination issues:
  - Reduce bullet length, rebalance columns, split long tables/slides intentionally.
- Contract mismatches:
  - Enforce valid `bodyStyle`, section number format, chart/table structure.

## Stopping Rules (Mandatory)

Cycle cap is 3 unless the user explicitly asks to continue.

- Cycle 1: Fix obvious blocking issues and highest-impact QA defects.
- Cycle 2: Fix remaining blocking issues and major readability/story issues.
- Cycle 3: Final attempt.

After cycle 3:
- If blocking issues remain, escalate with an unresolved-issues list.
- If only non-blocking issues remain, deliver with explicit residual risk notes.
- Continue beyond 3 only if user explicitly requests continued iteration.

## Storyline QA Gate (Mandatory Before Delivery)

Automated QA is necessary but not sufficient. Run this check before final delivery:

1. Executive scan test: titles + straplines alone communicate the story.
2. One-slide-one-message: each slide proves one claim.
3. Evidence sufficiency: each claim has data, sourced facts, or a clear logic chain.
4. Cross-slide consistency: units, periods, and key numbers match everywhere.
5. Sourcing coverage: every externally derived number has a source line.

## Visual QA

**⚠️ USE SUBAGENTS** — even for 2-3 slides. You've been staring at the code and will see what you expect, not what's there. Subagents have fresh eyes.

Convert slides to images (see Converting to Images), then use this prompt:

```text
Visually inspect these slides. Assume there are issues - find them.

Look for:
- Overlapping elements (text through shapes, lines through words, stacked elements)
- Text overflow or cut off at edges/box boundaries
- Decorative lines positioned for single-line text but title wrapped to two lines
- Source citations or footers colliding with content above
- Elements too close (< 0.3" gaps) or cards/sections nearly touching
- Uneven gaps (large empty area in one place, cramped in another)
- Insufficient margin from slide edges (< 0.5")
- Columns or similar elements not aligned consistently
- Low-contrast text (for example, light gray text on cream background)
- Low-contrast icons (for example, dark icons on dark backgrounds without contrast circle)
- Text boxes too narrow causing excessive wrapping
- Leftover placeholder content

For each slide, list issues or areas of concern, even if minor.

Read and analyze these images:
1. /path/to/slide-01.jpg (Expected: [brief description])
2. /path/to/slide-02.jpg (Expected: [brief description])

Report ALL issues found, including minor ones.
```

### Verification Loop

1. Generate slides -> convert to images -> inspect.
2. List issues found (if none, inspect again more critically).
3. Fix issues.
4. Re-verify affected slides. One fix often introduces another issue.
5. Repeat until a full pass reveals no new issues.

Do not declare success until at least one fix-and-verify cycle has completed.

## Converting to Images

Engine-native path (preferred):
- `run_kpmg_slides.sh` already generates preview images in `<out-dir>/preview/`.

Manual conversion path:

```bash
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

This creates `slide-01.jpg`, `slide-02.jpg`, and so on.

Re-render a specific slide after fixes:

```bash
pdftoppm -jpeg -r 150 -f N -l N output.pdf slide-fixed
```

## Delivery Requirements

Before delivery, provide:
- QA status (`pass`, `pass_with_warnings`, or `blocked`).
- Blocking vs non-blocking summary.
- Residual risks and recommended next actions.
- Paths to updated `deckSpec`, `.pptx`, `qa.json`, and preview images.
