# HTML Artifact Big Product Bets Ultraplan

## Outcome

- `html-artifact` becomes the reusable static HTML artifact substrate for rich
  generated documents: explainers, plans, code reviews, research reports,
  design QA, UX audits, Image Gen concept packets, decision briefs, migration
  plans, release-readiness packets, eval reports, and postmortems.
- The library expands through documented recipes, primitives, atlas specimens,
  fixture cases, and validation gates, while preserving the current
  self-contained single-file output contract.
- Artifact validation becomes harder to fake: structure is checked by the local
  validator, and rendered behavior is checked with Codex in-app Browser first
  and Chrome extension fallback second.

## Approach

- Extend the existing recipe/primitive/anatomy system instead of adding a new
  renderer, JSON IR, React app, Tailwind/shadcn runtime, or general test
  platform.
- Keep adjacent ownership clean:
  - `visual-design` owns building/polishing real UI and Image Gen concepting.
  - `design-qa` owns source-vs-render fidelity review.
  - `ux-audit` owns existing-flow screenshot capture and audit notes.
  - `html-artifact` owns the saved static document format for those outputs.
- Build in slices: contract cleanup, recipe expansion, primitive expansion,
  atlas/fixture updates, validation hardening, then package-level validation.

## Current State

- Source plugin files live under `plugins/dots/skills/html-artifact/`.
- Current recipes live in `plugins/dots/skills/html-artifact/references/recipes.md`.
- Current primitives live in `plugins/dots/skills/html-artifact/references/primitives.md`.
- The visible reference page is
  `plugins/dots/skills/html-artifact/assets/primitive-atlas.html`.
- Hidden eval and fixture support already exists under
  `plugins/dots/skills/html-artifact/.html-artifact/`.
- `validate-artifacts.mjs` currently proves structural checks and passed the
  existing fixture pack at `48/48` during research.
- Browser-render proof is required by `browser-checks.md`, but the current
  local validator does not automate or record Codex Browser/Chrome inspection.

## Target Standard

- Every recipe has:
  - `data-artifact` value
  - required source inputs
  - required top-level sections
  - required primitives
  - optional primitives
  - omitted-content guidance
  - browser QA focus
  - final handoff shape
- Every primitive has:
  - semantic root/base
  - required slots
  - optional slots
  - supported variants and states
  - mobile/overflow behavior
  - common failure to avoid
- Every artifact remains readable with JS disabled.
- Motion is small, purposeful, and optional; animated artifacts honor
  `prefers-reduced-motion`.
- Screenshots use real images or captures, meaningful `alt` decisions,
  captions where useful, explicit dimensions, and lazy loading below the fold.
- Long documents use structural chunking first; `content-visibility: auto` may
  be used only for heavy below-the-fold sections and must be browser-checked.
- Browser validation uses Codex in-app Browser first, then Chrome extension
  fallback with the fallback reason recorded. Do not add Playwright.

## Steps

1. Repair and clarify the core contract.
   - Change: Update `SKILL.md`, `authoring.md`, and `browser-checks.md` so the
     expanded product direction is explicit: `html-artifact` is the saved
     static-document layer, not app UI or a renderer.
   - Change: Clarify the current non-goal wording so hidden skill-owned evals
     and validators are allowed, while a general eval platform or runtime
     renderer remains out of scope.
   - Change: Add the hard browser-tool rule: Codex in-app Browser first, Chrome
     extension fallback second, no Playwright.
   - Verify: Re-read the changed files directly and confirm no source text asks
     future agents to use Playwright, a framework runtime, or generated `dist/`
     contents.

2. Expand the recipe layer.
   - Change: Add recipes in `references/recipes.md`:
     `ux-audit-report`, `design-qa-detailed`, `comparison-workbench`,
     `imagegen-concept-packet`, `design-handoff-spec`, `architecture-map`,
     `migration-plan`, `release-readiness`, `eval-report`,
     `decision-brief`, and `postmortem`.
   - Change: Keep the existing five recipes intact unless a new detailed recipe
     makes one section clearer.
   - Change: For `design-qa-detailed`, encode source/render/revised-mockup
     comparison, focused regions, fidelity coverage, QA metadata,
     implementation checklist, evidence limits, and pass/blocked/evidence-limited
     states.
   - Change: For `ux-audit-report`, encode ordered step screenshots,
     per-step health, UX/design findings, accessibility risks, evidence limits,
     and recommendations.
   - Verify: Check every new recipe names source inputs, required primitives,
     omitted content, and browser QA focus.

3. Expand the primitive catalog in families.
   - Change: Add planning/document primitives:
     `scope-boundary`, `acceptance-gate`, `verification-matrix`,
     `decision-log`, `owner-matrix`, `dependency-map`, `handoff-packet`,
     `state-grid`, and `constraint-ledger`.
   - Change: Add QA/comparison primitives:
     `screenshot-triptych`, `focused-compare`, `annotation-pin`,
     `fidelity-coverage`, `qa-metadata`, `evidence-limits`,
     `mismatch-ledger`, `revision-strip`, and `token-delta`.
   - Change: Add Image Gen/design handoff primitives:
     `concept-gallery`, `source-manifest`, `asset-inventory`,
     `allowed-copy-list`, `imagegen-prompt-card`, and
     `design-system-extract`.
   - Change: Add motion/performance primitives:
     `motion-proof`, `viewport-matrix`, `performance-budget`, and
     `render-proof`.
   - Verify: For every primitive, confirm the anatomy contract is complete and
     no primitive exposes slot names as reader text outside the atlas.

4. Add motion, screenshot, and large-document rules.
   - Change: Update `authoring.md` and `DESIGN.md` with motion tokens and
     rules: duration/easing scale, purposeful transitions only, no continuous
     decorative motion, and mandatory reduced-motion behavior when animation is
     present.
   - Change: Add image/screenshot rules: semantic `figure`/`figcaption`,
     useful `alt` decisions, explicit dimensions, internal containment, lazy
     loading below the fold, and size-budget awareness for self-contained files.
   - Change: Add large-document rules: section chunking first, native
     `details` where disclosure helps, selective `content-visibility: auto`
     only for heavy below-the-fold sections after browser verification.
   - Verify: Confirm `DESIGN.md` remains a token/style source and does not turn
     into visible reader chrome.

5. Update the primitive atlas as the canonical visual reference.
   - Change: Extend `assets/primitive-atlas.html` to render every new primitive
     once, grouped by job: shell/navigation, explanation, planning, review,
     research, design QA, UX audit, Image Gen handoff, motion/performance, and
     validation states.
   - Change: Include state examples for pass, blocked, evidence-limited,
     high/medium/low severity, selected/recommended, reduced-motion, and
     copied/exported.
   - Change: Keep atlas-only anatomy labels visible, but keep reader-artifact
     examples free of primitive/slot machinery.
   - Verify: Open the atlas through Codex in-app Browser at desktop, 375px, and
     320px. If Codex Browser cannot inspect the file, use Chrome extension and
     record the reason.

6. Expand fixture generation and structural validation.
   - Change: Update
     `.html-artifact/scripts/generate-review-artifacts.mjs` to generate fixture
     HTML for all recipes, including screenshot-heavy QA, UX audit,
     Image Gen concept packet, decision brief, migration plan, and eval report.
   - Change: Update `.html-artifact/scripts/validate-artifacts.mjs` with the
     new recipe required-primitives map, required slot checks for new
     primitives, stricter contamination scans, reduced-motion hooks, image
     dimension/lazy-loading checks where screenshots appear, and explicit
     `320px`/viewport-safety markers.
   - Change: Keep the validator dependency-light and source-level; do not add
     browser automation libraries.
   - Verify: Run the fixture generator, then run
     `node plugins/dots/skills/html-artifact/.html-artifact/scripts/validate-artifacts.mjs <fixture-html-dir>`
     and require all checks to pass.

7. Add Codex Browser / Chrome rendered QA procedure.
   - Change: Update `browser-checks.md` with a concrete manual/tool-assisted
     rendered proof procedure:
     1. Open artifact in Codex in-app Browser.
     2. Check desktop first viewport and full scroll.
     3. Check typical phone width around 375px.
     4. Check 320px reflow and no page-level horizontal overflow.
     5. Check high-zoom/reflow where the browser surface supports it.
     6. Check interactions: native disclosure, tabs/filters, copy/export,
        annotation focus, before/after/triptych controls.
     7. Check reduced motion when `motion-proof` or animations are present.
     8. Check screenshot loading, dimensions, captions, and containment.
     9. Use Chrome extension only if Codex Browser is unavailable or blocked,
        and record the fallback reason.
   - Verify: Perform this rendered check on the atlas and at least one fixture
     from each new recipe family.

8. Expand the eval seeds.
   - Change: Update `.html-artifact/evals.json` with cases for:
     - detailed design QA with source/render/revised-mockup triptych
     - iOS app design QA with screenshots and focused regions
     - UX audit report with step screenshots and accessibility limits
     - Image Gen concept packet with asset inventory and prompts
     - migration plan with gates/owners/rollback
     - release-readiness packet
     - eval report with scorecards and evidence
     - postmortem with timeline, impact, root cause, and actions
   - Change: Keep each eval tied to `validate-artifacts.mjs` structural gates.
   - Verify: Run the validator against generated fixture outputs and run
     `plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/html-artifact --json`.

9. Cross-skill alignment pass.
   - Change: Update only the minimal adjacent skill references needed so
     `design-qa`, `ux-audit`, `visual-design`, and `explain` know when to hand
     off to `html-artifact` for a saved rich document.
   - Change: Do not move design QA capture rules, UX audit capture rules, or
     Image Gen concepting rules into `html-artifact`; link to the owning skill
     instead.
   - Verify: Re-read `product-design`, `visual-design`, `design-qa`,
     `ux-audit`, `explain`, and `html-artifact` to confirm no route now has
     duplicate ownership.

10. Final repo validation and packaging readiness.
    - Change: Do not edit generated `dist/` directly. After source changes
      pass, run `scripts/package-plugins.sh` only if packaging is part of the
      approved implementation scope.
    - Verify automated:
      - `plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/html-artifact --json`
      - `node plugins/dots/skills/html-artifact/.html-artifact/scripts/generate-review-artifacts.mjs`
      - `node plugins/dots/skills/html-artifact/.html-artifact/scripts/validate-artifacts.mjs plugins/dots/skills/html-artifact/.html-artifact/runs/manual-html-review/html`
      - `scripts/verify.sh`
    - Verify manual:
      - Codex Browser rendered check of atlas.
      - Codex Browser rendered check of representative expanded fixtures.
      - Chrome extension fallback only if Codex Browser is blocked, with reason.

## Validation

- Automated:
  - Meta-Skill validation for `plugins/dots/skills/html-artifact`.
  - Fixture generation.
  - Structural artifact validation through `validate-artifacts.mjs`.
  - Baseline `scripts/verify.sh`.
- Manual / rendered:
  - Codex in-app Browser desktop check.
  - Codex in-app Browser 375px check.
  - Codex in-app Browser 320px reflow check.
  - Reduced-motion check for animated fixtures.
  - Screenshot/image containment and loading check.
  - Chrome extension fallback only when Codex Browser cannot complete the check.

## Assumptions / Deferrals

- This plan intentionally avoids Playwright and any new browser-automation
  dependency.
- This plan does not create a renderer, JSON IR, React app, theme-pack system,
  editor, or general eval platform.
- This plan does not replace `design-qa.md`; it adds an optional richer HTML
  packet surface for cases where a shareable visual artifact is worth it.
- This plan does not change generated `dist/` directly.
- Contrast token measurement can be implemented as either a validator addition
  or a separate tiny script; choose the smaller path during implementation.
- Large self-contained screenshot payload budgets should be calibrated from
  generated fixture size after the first fixture update.

## Research Inputs

- `.agents/research/html-artifact-big-product-bets/summary.md`
- `.agents/research/html-artifact-big-product-bets/q01-codebase.md`
- `.agents/research/html-artifact-big-product-bets/q02-product-surface.md`
- `.agents/research/html-artifact-big-product-bets/q03-validation-performance.md`
