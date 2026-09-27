# Deck reference library: gallery, design tags, and reusable skills

Turn the saved Deck.gallery collection into a local visual reference library, then use selected examples to teach reusable presentation design workflows. This plan covers the next tasks 2–4; implementation has not started.

## Starting point

- The capture inventory contains 220 decks and 12,153 slide screenshots, with per-deck manifests and source URLs. Image decoding, file counts, and ordering were verified.
- Local collection: `/Users/rishi/Documents/Codex/2026-09-26/i-w/outputs/full-capture`.
- Drive backup destination: [Deck.gallery capture backup](https://drive.google.com/drive/folders/1bhT8R1odr3ETTMi1VRiZdqEtygOeGe1b). Backup archives and their checksum index are stored separately from this repository.
- These are browser captures, not editable slides or original design assets. Preserve their existing JPEG/PNG formats.
- Emma Philips contains 20 slides with source labels 1–11 and 13–21. Preserve both collection order and source slide number.
- The subscription renewal is canceled. The library must work without access to the source site.

## 2. Browse and search the local collection

Build a small local web gallery from the existing manifests. Keep captures outside Git and locate them through a configurable collection root; do not bake the original machine path into the implementation.

- Generate a lightweight index with deck slug, title, source URL, slide count, and ordered slide records. Assign each slide a stable ID using its deck slug and manifest position; retain its source number separately.
- Generate disposable thumbnails in a separate cache without altering originals. Load thumbnails on demand rather than loading all 12,153 full-size images.
- Provide a deck grid, title search, slide grid, full-size viewer, keyboard navigation, and links back to the source attribution.
- Search existing deck and slide titles. Do not add OCR, PDFs, authentication, cloud hosting, or remote dependencies to this phase.
- Start with three representative decks, including Emma's numbering gap, then index the complete collection.

Acceptance: all 220 decks and 12,153 slides are reachable; searches and navigation work offline through a local server; the numbering gap does not hide a slide; missing files produce a useful message. Check keyboard navigation and image loading in Chrome. Measure full-collection startup and browsing responsiveness before adding more infrastructure.

## 3. Tag and curate design patterns

Add a separate, versioned annotation file keyed by stable deck/slide IDs. Keep human-reviewed annotations separate from source metadata and any proposed machine-generated labels.

- Begin with a small vocabulary: slide purpose (cover, section divider, claim, evidence, comparison, timeline, closing), layout (columns, grid, full-bleed image, large type), and design features (typography, color, charts, brand system, storytelling).
- Curate 20 representative decks first. Record tags, a brief explanation of why an example is useful, and exact source slide IDs. Allow multiple tags and an unreviewed state.
- Add tag filters and saved selections to the gallery. Export/import annotations as JSON so they remain portable.
- Identify duplicate and near-duplicate decks as related references; preserve the captured inventory rather than deleting images automatically.
- Review whether visual similarity search would help after the curated workflow is useful. It is optional follow-up, not a dependency.

Acceptance: annotations survive index rebuilds; every reference resolves to a real capture; users can find examples by purpose and visual pattern; proposed labels are visibly distinguishable from reviewed ones. No OCR is required.

## 4. Turn selected patterns into reusable skills

Create a small set of task-oriented skills from reviewed examples, rather than one skill per deck. Candidate tasks are structuring a pitch narrative, choosing a slide layout, and applying a coherent presentation design system.

- Select a few strong examples and counterexamples for each task. Explain the transferable principle, when to use it, and its limits.
- Link references through stable slide IDs and collection-relative paths. Keep the 1.55 GB capture collection out of skill packages and Git.
- Draft experimental skills under `wip/`, following the repo's skill creation and validation rules. Use focused reference files for examples so the main instructions stay short.
- Include a workflow for finding relevant references, choosing a pattern, adapting it to new content, and checking the result. Avoid treating captured logos, fonts, and imagery as editable assets or licensed templates.
- Evaluate each skill on new content not used in its examples: does it select suitable references, explain its choices, and produce an original, readable result? Compare against the same task without the skill.
- Promote only validated skills to an appropriate plugin, with the required version bump, deterministic validation, and plugin sync at that later implementation stage.

Acceptance: each skill has a clear trigger and output, references resolve after restoring the collection elsewhere, and held-out examples demonstrate useful behavior. Installing a skill does not copy or publicly publish the capture library.

## Execution order and completion

1. Implement and validate the local gallery on a representative subset, then the complete collection.
2. Add portable annotations and curate the initial 20 decks.
3. Draft and evaluate the first task-oriented skill before expanding the set.

Keep each phase useful on its own. Preserve originals throughout; indexes, thumbnails, and experimental annotations can be rebuilt or rolled back independently. This planning commit does not implement the gallery, tagging, or skills.
