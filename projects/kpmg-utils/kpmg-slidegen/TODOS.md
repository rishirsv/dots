---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-03-06
review-cycle-days: 14
source-of-truth: TODOS.md
verification-state: verified-with-open-gaps
---

# TODOs

## Status Snapshot (2026-03-06)

- Verified directly this review: the public repo surface is centered on `npm run qa`, the `test:*` harness lanes that still exist in `package.json`, `skill:*` bundle maintenance commands, and targeted local audit scripts such as `node scripts/test-hardcoded-layout-values.mjs`.
- Canonical geometry/fail-fast contract work is landed, but fallback-style geometry access still exists and the hardcoded-layout guard is not yet wired into `npm run qa`.
- Expected-failure validation coverage is still incomplete because there is no maintained invalid-fixture regression lane on the current public script surface.
- Skill mode policy and prompt templates are still incomplete, and any future new-builder workflow remains intentionally deferred until layout onboarding is supported again.
- `Next`, `Parked By Decision`, and `CI And Release` remain mostly open; several items have partial groundwork, but no additional items in those sections are fully complete yet.

## Completed Baseline

- [x] Add a tiny smoke script to run one sample generation and assert both output files exist.
- [x] Add a documented `deckSpec` schema reference (required and optional slide fields).
- [x] Add one regression script covering postprocess QA shape for success/failure/unavailable flows.
- [x] Add one comprehensive visual validation script that checks individual PNG slides and montage output.
- [x] Add a comprehensive lorem deck to stress-test supported layouts.
- [x] Scaffold `skills/kpmg-slides` with skill instructions, references, and canonical run script.
- [x] Add model-facing deck authoring docs (`docs/DECKSPEC-SCHEMA.md`, `docs/DECKSPEC-SLOTS-SCHEMA.json`, `docs/DECK-AUTHORING-PLAYBOOK.md`).
- [ ] Generalize input/output directories

## Priority Now

- [ ] Refactor audit follow-up (2026-03-04): finish removing hardcoded/fallback geometry paths so builders/pagination consume canonical `ctx.geometry` only. Status 2026-03-06: the canonical contract landed, but `node scripts/test-hardcoded-layout-values.mjs` still reports 16 `geometry || {}` violations.
- [ ] Add `scripts/test-hardcoded-layout-values.mjs` to `package.json` and include it in `npm run qa` as a blocking check. Status 2026-03-06: the script exists and fails usefully, but `npm run qa` still skips it.
- [ ] Remove fallback geometry constants and paths in hot spots: `generator/helpers/one-column-layout.js`, `generator/helpers/two-column-layout.js`, `generator/runtime/paginate.js`, `generator/builders/cover-slide.js`, `generator/builders/contents-slide.js`, `generator/builders/divider-slide.js`, `generator/builders/title-strapline-4-boxes.js`, `generator/builders/analysis-bridge.js`, `generator/builders/business-overview.js`, `generator/builders/analysis-narrow-table.js`. Status 2026-03-06: some files now use strict geometry resolvers, but the listed hotspots still include fallback-style entry points.
- [ ] Add a maintained invalid-fixture regression path so expected-failure validation behavior is covered again. Status 2026-03-06: the repo no longer exposes a public `test:validation:failure` lane, so the replacement needs both a fixture and a supported command path.
- [ ] Make `npm run qa` enforce full gating (at minimum: contracts, registry contracts, smoke, hardcoded geometry drift, strict AST drift, golden QA). Status 2026-03-06: `qa` currently runs contracts, registry contracts, smoke, theme strict drift, and grep drift only.
- [ ] Decide and document strict drift policy: either keep `test:drift:ast:strict` as blocking and pay down findings, or scope/tune the rule set to intentional exclusions. Status 2026-03-06: `npm run test:drift:ast:strict` still fails on numeric literals in `generator/runtime/theme.js`.
- [ ] Preserve and enforce fail-fast posture for geometry/policy/slot contracts while removing silent fallback paths. Status 2026-03-06: fail-fast contract checks are in place, but the silent/fallback geometry paths are not fully gone yet.
- [x] Keep targeted regression coverage green for pagination behaviors (one-column merge, nested bullets, contents continuation, table metadata persistence, split QA reporting). Status 2026-03-06: the targeted scripts pass individually, though there is still no aggregate `test:pagination:all` gate.

- [x] Add one golden QA fixture for regression checks on report shape.
- [ ] Reintroduce invalid-fixture coverage only as part of a supported public harness lane. Status 2026-03-06: legacy failing deckSpecs still exist, but there is no maintained public command for this coverage area.
- [x] Create `scripts/sync-skill-bundle.mjs` to sync generator/runtime/templates/docs into `skills/kpmg-slides/assets` and `skills/kpmg-slides/references`.
- [x] Add `npm` commands for skill sync and drift checks (`skill:sync`, `skill:verify`).
- [x] Add a skill-only smoke test that runs from `skills/kpmg-slides` using only synced skill files and writes deterministic artifacts.
- [x] Add a no-absolute-path check for `skills/kpmg-slides` (fail if `/Users/`, `/code/`, or repo-external paths are referenced).
- [x] Add a sync guard that fails if synced skill bundle files drift from source without re-running sync.
- [x] Trim skill distributable fixtures to essentials (`skill-smoke`) and make sync prune stale managed files.
- [x] Vendor local slides postprocess runtime into repo and bundle it into skill sync output.
- [ ] Expand `skills/kpmg-slides/SKILL.md` with explicit mode policy: compile-from-context, guided-planning, and surgical-revision.
- [ ] Add copy-paste prompt templates for each skill mode in `skills/kpmg-slides/references/`.
- [ ] Add a documented “new builder from scratch” workflow only after layout authoring is intentionally reintroduced as a supported repo capability.

## Next

Status 2026-03-06: no items in this section are fully complete. Existing scenario decks, QA guidance, charting docs, repair suggestions, and input-prep helpers provide partial groundwork for several items, but none of the requested deliverables are finished yet.

- [ ] Add a benchmark scenario fixture for `mid-thread compile` with dense prior context.
- [ ] Add a benchmark scenario fixture for `zero-context planning` that starts from user Q&A.
- [ ] Add a benchmark scenario fixture for `revision loop` with targeted slide edits.
- [ ] Add an output-quality rubric for skill runs (slot correctness, narrative quality, visual density, source coverage).
- [ ] Add a chart `opts` catalog with approved presets by chart type for model-safe authoring.
- [ ] Add a golden deckspec example library (one polished reference per supported slide type with rationale).
- [ ] Add a QA interpretation guide mapping common errors/warnings to concrete fix actions.
- [ ] Add a brief release checklist for template package changes.
- [ ] Add direct source-to-deck compilation flows that turn SEC/data-room/markdown inputs into canonical `deckSpec` before render.
- [ ] Add first-class skill authoring modes for `zero-context planning`, `mid-thread compile`, and `surgical revision` with explicit prompts and acceptance criteria.
- [ ] Add a QA auto-repair loop that converts `qa.json` findings into targeted `deckSpec` edits and slide rewrite suggestions.
- [ ] Expand the slide vocabulary with higher-value consulting layouts and safer chart grammars (timelines, KPI dashboards, appendix/reference slides, org/perimeter variants, heatmaps, approved chart presets).
- [ ] Add source traceability features such as per-slide evidence manifests and optional evidence appendix generation from authored sources.

## Parked By Decision

Status 2026-03-06: realistic long-form scenario decks and outputs exist, but the curated real-world golden library described below has not been assembled.

- [ ] Add a real-world golden deck library (20-25 page polished examples) and run on-demand visual QA against those fixtures once the local slides runtime is embedded.

## CI And Release

Status 2026-03-06: the relevant commands exist locally, but there is still no repo CI wiring or release gate enforcing them.

- [ ] Add CI wiring for `npm run smoke` and `npm run test:postprocess`.
- [ ] Add optional CI profile for visual validation in environments where slides Python deps are installed.
- [ ] Add a release gate that requires `skill:verify` success before publishing/updating the skill bundle.

## Deep Review Notes

Historical audit context only. Several findings below have since been partially or fully addressed; use `Status Snapshot` and `Priority Now` above for the current live status.

1. Executive Summary (5-8 bullets).

- **Critical content-correctness bug:** one‑column bullet pagination can **duplicate or re‑emit bullets** due to a normalization/slicing mismatch (likely to ship incorrect decks silently).
- **High-risk table handling:** table splitting **drops table metadata** (e.g., `title/heading`) and table validation **does not enforce** column-count consistency, which can lead to **render crashes or malformed tables**.
- **Contents slide silently truncates** to **10 sections max** while both runtime validation and the JSON schema allow more—creating **silent data loss** on larger agendas.
- **Strict QA signals can be misleading:** overlap checks rely on **PptxGenJS internals** and don’t account for common sizing modes (e.g., `cover`), and “strict overflow” returns success even when overflow checks error/skip.
- **Token/theme fragmentation:** there are **multiple sources of truth** (template tokens, generator tokens, per-builder hardcodes), making visual consistency and global restyling fragile and error-prone.
- **Postprocess pipeline documentation is incomplete**: montage rasterization requires external tools (e.g., Inkscape/ImageMagick/Ghostscript), but the skill docs don’t list them.
- **Assumptions:** findings are from static review of the bundle as provided; where behavior depends on PptxGenJS rendering semantics (e.g., negative line dimensions), I’ve called that out explicitly.

---

2. Findings Table: Severity | Category | Issue | Evidence (file:line) | Impact | Recommended Fix.

| Severity     | Category                          | Issue                                                                                                                                                                                                                                                             | Evidence (file:line)                                                                                                                                                                                                                                                                                                            | Impact                                                                                                                                                                                                                         | Recommended Fix                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Pagination / Functional bug       | **One-column bullet pagination can duplicate/skip items**: `chunkBullets()` normalizes (merges) items, but `paginateOneColumnBullets()` slices the _original_ list by `chunk.length`, so merged pairs are not fully consumed.                                     | `assets/slidegen/generator/runtime/paginate.js:108-110,223-236`                                                                                                                                                                                                                                                                 | Silent content corruption (duplicate bullets / repeated lines) across continuation slides; high likelihood with “heading + long body” bullet patterns.                                                                         | Pre-normalize the bullet list **once** and paginate that normalized list (or return a `(chunk, consumedCount)` mapping). Concretely: move normalization out of `chunkBullets` or add a `preNormalized` flag; in `paginateOneColumnBullets`, advance by **consumed raw count**, not `chunk.length`. Add unit tests for the merge case (`Heading`, `long body…`). |
| **High**     | Pagination / Data integrity       | **Table splitting drops metadata**: when paginating tables, the new slide’s `table` object is rebuilt with only `{headers, rows}`, losing `title`, `heading`, `keyTakeawayTitle`, and any future config fields.                                                   | `assets/slidegen/generator/runtime/paginate.js:430-435`                                                                                                                                                                                                                                                                         | Continuation slides can lose headings/labels; downstream builders that depend on `table.title/heading` render inconsistent outputs. Future extensibility is fragile (new table fields will be silently dropped on pagination). | When splitting, clone the **entire table object** and replace only `.rows` (and possibly `.headers` if needed): `s.table = { ...table, rows: table.rows.slice(...) }`. Add regression test with `table.title` and verify it persists on all pages.                                                                                                              |
| **High**     | Validation / Rendering stability  | **Table shape constraints not validated** (headers length, ragged row widths). Runtime validation only checks arrays exist, not that row widths match headers or that headers are non-empty. Builder maps `r.map(...)`, producing ragged rows if input is ragged. | `assets/slidegen/generator/runtime/render-deck.js:100-108,367-378`; `assets/slidegen/generator/builders/analysis-narrow-table.js:337-343`; schema hint `references/deckspec.schema.json:203-249`                                                                                                                                | Can crash `addTable` or render malformed tables; “x-kpmg-rowWidthEqualsHeaders” is effectively unenforced, so LLM-produced specs are likely to violate it.                                                                     | Enforce: `headers.length >= 1`, `rows.length >= 1`, and `rows.every(r => Array.isArray(r) && r.length === headers.length)`. Fail fast with a clear error pointing to slide index + slot. Consider auto-padding/truncation only in non-strict mode, with warnings.                                                                                               |
| **High**     | Functional / Data loss            | **Contents slide truncates to 10 sections** (2 rows × 5) with no warning, while schema/validation allow more.                                                                                                                                                     | Truncation logic `assets/slidegen/generator/builders/contents-slide.js:95-98`; validation only checks “non-empty array” `assets/slidegen/generator/runtime/render-deck.js:104-107,348-365`; schema lacks maxItems `references/deckspec.schema.json:687-693`                                                                     | Silent omission of agenda sections and page ranges for decks with >10 sections—very likely in larger reports.                                                                                                                  | Either: (a) enforce `maxItems: 10` in schema + runtime validation, **or** (b) implement automatic pagination for contents (multiple contents slides) and update slot definitions to allow it. At minimum, emit a warning and truncate deterministically.                                                                                                        |
| **High**     | QA reliability / Brittleness      | **Overlap checker depends on PptxGenJS internals** (`pptx._slides`, `slide._slideObjects`) and its bounds logic only adjusts for `sizing.type === 'crop'`, not `cover/contain`. Cover slide explicitly uses `cover` sizing with `w/h` bigger than the crop box.   | Internals use `assets/slidegen/generator/strict/overlap.js:167-176`; sizing handling `assets/slidegen/generator/strict/overlap.js:42-68`; cover image uses `assets/slidegen/generator/builders/cover-slide.js:299-306`                                                                                                          | False positives/negatives in overlap QA; “strict” overlap can break on PptxGen upgrades; “cover” images will appear larger than visible crop, spiking overlap errors.                                                          | Short term: treat **any** `sizing` as “visible box” bounds (use `sizing.w/h` and `x/y` as box), not raw `w/h`. Handle `cover/contain/crop`. Medium term: replace internal-object overlap checks with a render-based approach (e.g., rasterize and detect pixel overlap/bleed) or isolate PptxGen internals behind an adapter with version pinning and tests.    |
| **High**     | Theming / Consistency             | **Token source-of-truth is fragmented**: generator tokens claim “single source of truth” but template tokens and per-builder hardcodes conflict; render sets theme fonts from template tokens while builders use generator fonts.                                 | Generator tokens claim `assets/slidegen/generator/tokens.js:1-10`; generator sizes `assets/slidegen/generator/tokens.js:45-51`; template fonts/sizes `assets/slidegen/templates/kpmg-diligence/package/tokens.json:46-50,74-79`; render theme uses template tokens `assets/slidegen/generator/runtime/render-deck.js:1258-1260` | Inconsistent typography and spacing; hard to make global visual changes; increases risk of overflows and drift across slide types.                                                                                             | Define **one** `Theme` object constructed from template tokens + explicit overrides, and pass it into builders (instead of importing disparate token modules). Make templates the base; generator tokens become overrides/semantic mappings. Add a CI check to forbid raw hex/fontSize literals in builders (except in a whitelist).                            |
| **High**     | Deliverable safety                | **Back-cover defaults can leak placeholder contacts/URLs** if caller forgets to provide them; hyperlink is also hardcoded.                                                                                                                                        | Defaults `assets/slidegen/generator/builders/back-cover-slide.js:8-15,42-53`; hardcoded hyperlink `assets/slidegen/generator/builders/back-cover-slide.js:179-186`                                                                                                                                                              | Risk of shipping decks with incorrect staff/contact details or wrong outbound links—high reputational risk.                                                                                                                    | Remove defaults (or gate them behind an explicit `demoMode`). Make `contacts` and `url` required in schema for `backCover` unless `metadata.demoMode=true`. Use `url` for hyperlink target, not a constant.                                                                                                                                                     |
| **Medium**   | Functional correctness            | **Cover title claims rich-text support but coerces to string** (`String(value)`), which will produce `"[object Object]"` and lose formatting if an array of runs is passed.                                                                                       | Comment promises rich text `assets/slidegen/generator/builders/cover-slide.js:246-250`; coercion `assets/slidegen/generator/builders/cover-slide.js:90-97`; usage `assets/slidegen/generator/builders/cover-slide.js:271-276`                                                                                                   | Incorrect titles or unreadable output when upstream supplies rich-text runs (likely when generated from other slides/components).                                                                                              | Either (a) formally restrict cover title to string in schema + validation, **or** (b) implement rich-text-aware fitting (measure text from runs, preserve runs in `addText`). Update comment to match actual behavior.                                                                                                                                          |
| **Medium**   | Edge case / Logic                 | **Auto contents page ranges can collide for duplicate section titles** because the key is `normalizeSectionKey(title)` and stored in a single map.                                                                                                                | `assets/slidegen/generator/runtime/render-deck.js:1059-1061,1080-1100`                                                                                                                                                                                                                                                          | Two different sections with the same title (e.g., repeated “Appendix”) can receive merged/incorrect ranges.                                                                                                                    | Key by `(sectionNumber, normalizedTitle)` or prefer `sectionNumber` when present; only fall back to title mapping if number missing. Consider emitting a warning on duplicate normalized titles in contents sections.                                                                                                                                           |
| **Medium**   | Rendering robustness (assumption) | **Bridge connector lines may use negative `h`** (`currStartY - prevEndY`) which may not render consistently if PptxGen expects non-negative extents for line shapes.                                                                                              | `assets/slidegen/generator/builders/analysis-bridge.js:186-192`                                                                                                                                                                                                                                                                 | Potential misrendered connectors for bridges where the next bar starts above the previous end. (Assumption: depends on PptxGen’s handling of negative dimensions.)                                                             | Normalize line geometry: set `y = min(prevEndY, currStartY)` and `h = abs(currStartY - prevEndY)` (and likewise for `w`), or use a line API that specifies start/end points if available. Add a visual regression test for up/down bridges.                                                                                                                     |
| **Medium**   | QA semantics                      | **“Strict overflow” returns success when overflow checks error/skip** (status=0), so `--strict` is not actually strict about overflow verification.                                                                                                               | `assets/slidegen/generator/app/strict-overflow.js:20-41`                                                                                                                                                                                                                                                                        | Pipelines can report “strict OK” even when the overflow check didn’t run (missing deps, python failure, etc.), giving false confidence.                                                                                        | In strict mode: treat `error`/`skipped` as non-zero **unless explicitly configured** (e.g., `--strict=warn`). Surface the underlying `reason` and stderr in the QA report for actionability.                                                                                                                                                                    |
| **Medium**   | Security / Robustness             | `detectAvailability` shells out with unescaped `python` value in `bash -lc "command -v ${python}"`.                                                                                                                                                               | `assets/slidegen/generator/postprocess/slides-adapter.js:57-68`                                                                                                                                                                                                                                                                 | Low-probability injection vector and brittle behavior with python paths containing spaces/special chars.                                                                                                                       | Avoid shell: use `spawnSync(python, ['-c','import sys; print(sys.executable)'])` or `spawnSync('command', ['-v', python], { shell: false })` equivalents.                                                                                                                                                                                                       |
| **Medium**   | Docs / Ops                        | Skill docs list LibreOffice/Poppler but montage path requires additional binaries (Inkscape/ImageMagick/Ghostscript).                                                                                                                                             | Docs `SKILL.md:12-18`; montage deps `assets/slidegen/generator/postprocess/slides-runtime/ensure_raster_image.py:8-17`                                                                                                                                                                                                          | Postprocess montage/preview can fail in environments that satisfy documented deps but lack raster tools; failures may look “mysterious.”                                                                                       | Update SKILL.md dependency section to include required raster tools (and versions if needed). Enhance availability detection to explicitly check `inkscape`, `magick/convert`, `gs` and report missing tools in QA output.                                                                                                                                      |
| **Medium**   | Error handling                    | JSON parsing is unguarded; malformed deckspec will throw a raw exception early.                                                                                                                                                                                   | `assets/slidegen/generator/index.js:23-25`                                                                                                                                                                                                                                                                                      | Poor DX; QA report may not be written; failure mode is a stack trace rather than a user-facing error.                                                                                                                          | Wrap `readJson` in try/catch and return a structured error (include path, a snippet of JSON parse error). Always write a QA report entry when possible.                                                                                                                                                                                                         |
| **Medium**   | Architecture / Testability        | `render-deck.js` mixes validation, content normalization, footer computation, master definition, and rendering in one module, increasing coupling and making targeted tests harder.                                                                               | Validation/slot logic `assets/slidegen/generator/runtime/render-deck.js:100-420`; master creation `assets/slidegen/generator/runtime/render-deck.js:1040-1057`; rendering orchestration `assets/slidegen/generator/runtime/render-deck.js:1238-1268`                                                                            | Slower onboarding and higher regression risk; adding slide types increases file complexity; hard to unit-test portions in isolation.                                                                                           | Split into modules: `validate/`, `theme/`, `masters/`, `render/`, `pagination/`. Export pure functions with deterministic inputs for unit testing.                                                                                                                                                                                                              |
| **Low**      | Validation                        | 4-column geometry validator allows `minDistinct=3` even though 4 columns are expected.                                                                                                                                                                            | `assets/slidegen/generator/builders/title-strapline-4-boxes.js:31-36`                                                                                                                                                                                                                                                           | Invalid geometry may pass validation and then misplace boxes.                                                                                                                                                                  | Require 4 distinct x positions (`minDistinct=4`) and validate numeric `x/y/w/h` for each column box.                                                                                                                                                                                                                                                            |
| **Low**      | Performance / Configurability     | Slide rasterization uses a hardcoded `thread_count=8`.                                                                                                                                                                                                            | `assets/slidegen/generator/postprocess/slides-runtime/render_slides.py:172-177`                                                                                                                                                                                                                                                 | Over/under-utilization depending on host; can increase contention.                                                                                                                                                             | Make it configurable via CLI arg/env; default to `os.cpu_count()` with a sensible cap.                                                                                                                                                                                                                                                                          |

---

3. Consistency Audit Table: Hardcoded Value | Location (file:line) | Central Source to Use/Create | Migration Note.

| Hardcoded Value                                                        | Location (file:line)                                                                          | Central Source to Use/Create                                                     | Migration Note                                                                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `gap = 0.18` (section column spacing)                                  | `assets/slidegen/generator/builders/contents-slide.js:101-103`                                | Create `SPACING.sectionGap` (or derive from template token spacing)              | Replace magic numbers with semantic spacing tokens so section density can be tuned globally.                                  |
| Section number box height `0.52`, offsets `+0.57`, `+0.83`, etc.       | `assets/slidegen/generator/builders/contents-slide.js:52-88`                                  | Create `CONTENTS_TOKENS` (heights/offsets) or encode in template geometry        | These offsets should come from extracted geometry or a single contents component to prevent drift.                            |
| Line width `pt: 1.5`                                                   | `assets/slidegen/generator/builders/contents-slide.js:64`                                     | `LINES.sectionDividerPt`                                                         | Standardize stroke widths across layouts; helps visual consistency.                                                           |
| `FULL_TABLE_W = 11.1596`                                               | `assets/slidegen/generator/builders/analysis-narrow-table.js:38`                              | `GEOMETRY.contentWidth` (derive from template layout width minus margins)        | Avoid repeating “magic widths” across table/chart components; compute from slide dimensions + margins.                        |
| `TABLE_CHROME.headerFill = '1E49E2'`                                   | `assets/slidegen/generator/builders/analysis-narrow-table.js:41`                              | `COLORS.primary` (or a semantic `COLORS.tableHeader`)                            | Replace raw hex with semantic palette; enables recoloring via theme.                                                          |
| `GRID_GREY = 'D9D9D9'`, `LIGHT_LINE = 'E5E7EB'`                        | `assets/slidegen/generator/builders/analysis-narrow-table.js:17-18`                           | `COLORS.neutral.300 / neutral.200` (create neutral scale)                        | Introduce a neutral scale token set rather than per-component greys.                                                          |
| Priority colors `'1E49E2'`, `'666666'`                                 | `assets/slidegen/generator/builders/analysis-narrow-table.js:362-364`                         | `COLORS.priority.{high,medium,low}`                                              | Encapsulate these in a semantic sub-palette for consistent meaning across decks.                                              |
| Chart fill `'FFFFFF'`                                                  | `assets/slidegen/generator/builders/analysis-wide-chart-text.js:201-202`                      | `COLORS.white` (or `COLORS.bg`)                                                  | Use token instead of raw hex; also reduces inconsistency with template background colors.                                     |
| Legend font sizes `7`, label font sizes `8`                            | `assets/slidegen/generator/builders/analysis-wide-chart-text.js:183-190`                      | `CHART_TOKENS.fontSizes.{legend,label}`                                          | Consolidate chart typography so all chart layouts use the same scale.                                                         |
| Footer chrome geometry (`FOOTER_LOGO_Y=6.854`, `FOOTER_SAFE_TOP=7.03`) | `assets/slidegen/generator/helpers/footer.js:5-8`                                             | Derive from `templatePackage.layouts.masters.footerChrome`                       | Avoid hardcoded footer boundaries; use master geometry so changes to PPT master propagate automatically.                      |
| Default master background `'FFFFFF'`                                   | `assets/slidegen/generator/runtime/render-deck.js:1053`                                       | `variantConfig.backgroundColor` (required) or `templatePackage.tokens.colors.bg` | Prefer explicit template/master configuration; make backgroundColor required for variants to prevent hidden defaults.         |
| Slide dimension fallback `{ w: 13.333, h: 7.5 }`                       | `assets/slidegen/generator/runtime/render-deck.js:1247`                                       | `templatePackage.tokens.dimensions` (make required)                              | If dimensions are truly invariant, make them required in template package; if not, pass dims everywhere to avoid assumptions. |
| Hardcoded hyperlink `https://kpmg.com`                                 | `assets/slidegen/generator/builders/back-cover-slide.js:179-186`                              | Use `url` field from deck spec and validate it                                   | Make hyperlink target a validated input, not a constant; supports per-engagement microsites.                                  |
| Default placeholder contacts                                           | `assets/slidegen/generator/builders/back-cover-slide.js:8-15`                                 | Require `metadata.contacts` or `backCover.contacts` in schema                    | Remove or gate behind `demoMode`; prevents accidental leakage into deliverables.                                              |
| Fonts diverge: `'KPMG-Bold'` vs template `'Arial'`                     | `assets/slidegen/generator/tokens.js:7-10`; `assets/slidegen/templates/.../tokens.json:46-50` | Single `Theme.fonts` mapping built from template + overrides                     | Decide where font truth lives; then enforce via linting or runtime checks.                                                    |

---

4. Scalability Assessment for +15 New Generators: current bottlenecks, target architecture, and expected benefits.

**Current bottlenecks**

- **Per-slide builders remain semi-ad hoc**: each builder defines its own mini token set, geometry fallbacks, and layout math. This encourages copy/paste and drift.
- **Validation is not “shape-safe” enough** for LLM-produced JSON (tables in particular): adding more generators will increase the surface area for malformed content.
- **Pagination is heuristic and partially slide-type-specific**; it’s easy to introduce subtle content corruption (as seen in one-column bullets) when adding more “auto-splittable” layouts.
- **QA signals are inconsistent**: overlap detection relies on internal structures and incomplete sizing handling; overflow strictness can pass without checks.
- **Theme fragmentation** makes global restyling risky: adding 15 layouts will multiply hardcoded values and inconsistencies unless the token approach is unified.

**Target architecture (low-risk extension path)**

- A **SlideType Registry** (single place) that binds: `type -> { builder, slotSchema, paginationStrategy, defaults, qaHooks }`.
- A **Theme object** created once from template package tokens + semantic overrides, passed to every builder via `context`.
- A **Component layer**: `TitleBlock`, `StraplineBlock`, `BodyBullets`, `TableBlock`, `ChartBlock`, `FooterChrome`, `Callouts`—with shared styling and metrics.
- **Shape-safe validation** for complex slots (tables/charts/bridge/businessStructure) enforced before render, aligned with schema hints like `x-kpmg-rowWidthEqualsHeaders`.

**Expected benefits**

- Adding 15 new generators becomes mostly **configuration + composition**, not bespoke geometry math.
- Lower regression rate: shared components and validations reduce divergent behavior.
- Faster QA triage: consistent failure modes, fewer false-positive overlap/overflow signals.
- Easier theming: one token pipeline enables global changes (fonts, colors, spacing) without touching every builder.

---

5. Architecture Recommendations: concrete structural changes to improve reliability and long-term maintainability.

6. **Fix the one-column pagination pipeline**
   - Refactor `chunkBullets`/`paginateOneColumnBullets` to avoid “normalized vs raw” index mismatches.
   - Add small unit tests around: heading+long-body merge, nested bullet children, and cross-page boundary behavior.

7. **Introduce “shape-safe” validators for complex slot kinds**
   - Implement validators for `table`, `chart`, `bridge`, `businessStructure` that enforce dimensional invariants (e.g., table row width == headers length).
   - Surface errors as: `slideIndex`, `slideType`, `slot`, and a concise reason; keep an option to auto-repair only in non-strict mode.

8. **Create a single Theme module**
   - Build `Theme` from `templatePackage.tokens` + semantic overrides (e.g., brand palette, type scale).
   - Deprecate direct imports of `tokens.js` inside builders; instead consume `context.theme`.
   - Add a lint-like check (even a simple grep in CI) to flag raw hex strings / raw font sizes in builders.

9. **Componentize repeated slide elements**
   - Extract `addImageSmart` into `helpers/media` and standardize image sizing/bounds metadata.
   - Consolidate: title rendering, strapline rendering, body bullets, footnotes, table and chart blocks into shared components with consistent spacing.

10. **Make QA checks trustworthy**
    - Overlap: adjust bounds for any `sizing` (cover/contain/crop). Consider moving away from PptxGen internals where possible.
    - Strict overflow: decide policy—if strict, fail on “couldn’t check”; otherwise, clearly label results as “best-effort”.

11. **Split the render orchestration module**
    - Break `runtime/render-deck.js` into modules: `validation.js`, `masters.js`, `pagination.js`, `render.js`, `footer.js`.
    - This will directly improve testability and reduce coupling when adding new slide types.

12. **Make deliverable-risk slides explicit**
    - For `backCover`, remove defaults or require `demoMode` to use placeholder contacts.
    - Validate URLs and email formats early.

---

6. Repeatable Extension Pattern: step-by-step pattern for adding a new generator/layout consistently.

7. **Define the slide type in the template package**
   - Add layout entry (geometry + slots + master variant) under `templates/.../package/layouts.json`.
   - Ensure the master variant references the same footer behavior as existing patterns.

8. **Extend the deckspec schema**
   - Add a schema entry for the new slide type under `references/deckspec.schema.json`.
   - For complex data, include explicit invariants (e.g., for tables: row width equals headers length).

9. **Implement a builder using shared components**
   - Create `builders/<new-type>.js`.
   - Use `context.geometry` and `context.theme` for styling (no raw hex/font sizes).
   - Compose shared components (TitleBlock, BodyBullets/TableBlock/ChartBlock).

10. **Register the new type in the slide registry**
    - Add the mapping in `runtime/render-deck.js` builder dispatch (ideally after you refactor into a registry module).
    - Ensure master assignment is explicit and validated.

11. **Add pagination strategy (if needed)**
    - If the slide can overflow, implement `paginate<NewType>` in `runtime/paginate.js` (or a dedicated module).
    - Add test cases for boundary conditions and verify metadata preservation.

12. **Add validation hooks**
    - Add slot-level validation in the validator module (table width checks, etc).
    - If the slide supports auto-repair, define it explicitly and log warnings.

13. **Add QA expectations**
    - Include overlap/overflow checks and ensure the slide’s sizing modes are supported.
    - Add a fixture deckspec example for this slide in references/examples (or a test folder once introduced).

14. **Document the layout contract**
    - Update `references/slide-contract.md` with intended usage patterns, max lengths, and common failure modes.

---

7. Prioritized Action Plan: Quick Wins (1 week), Near-Term (2-4 weeks), Longer-Term.

**Quick Wins (1 week)**

- Fix **one-column pagination** normalization/slicing mismatch (`paginate.js`).
- Fix **table pagination metadata loss** (`paginateTableRows` preserves table object).
- Add **table invariants validation** (headers non-empty; all rows length == headers length; align with schema hint).
- Add **contents max sections handling**: either validate `<=10` or warn + generate additional contents slides.
- Make `--strict` overflow behavior explicit: fail on “skipped/error” (or add a mode flag).
- Remove/gate **back-cover defaults** behind `demoMode` and use provided URL for hyperlink.

**Near-Term (2-4 weeks)**

- Build a **Theme** object and start migrating builders away from hardcoded values and `tokens.js` direct imports.
- Create shared components for repeated patterns (title/strapline/body/table/chart/footer).
- Improve overlap bounds for `sizing` (`cover/contain/crop`) and add a small set of regression fixtures.
- Update SKILL.md with a complete dependency list and improve postprocess availability diagnostics.
- Refactor `render-deck.js` into cohesive modules; add unit tests for validators and pagination.

**Longer-Term**

- Introduce a formal **slide registry/plugin architecture** to make adding new types low-risk.
- Add visual regression testing (render-to-images + montage diffs) in CI for a baseline set of decks.
- Move to TypeScript (or JSDoc types + runtime schema validation) to reduce shape errors at build time.
- Consider replacing internal-object overlap detection with a render-based QA approach for long-term stability.

---

8. Risks if Unaddressed: top 5.

9. **Silent content corruption** (duplicate/missing bullets from pagination) leading to incorrect client deliverables.

10. **Render failures or malformed tables** from ragged table inputs—likely with LLM-generated specs.

11. **Agenda/contents data loss** when >10 sections appear (silent truncation).

12. **False confidence from “strict” QA** (overlap/overflow checks can be inaccurate or skipped but still pass).

13. **Theme drift and scaling pain**: adding 15 new layouts will amplify inconsistency and increase maintenance cost without a single theme + component foundation.
