# Agent Skill Review

This document reviews external skill patterns against the Agent plugin and records the current inventory, accepted additions, and recommended future additions.

## Current Decision State

Accepted for the plugin now:

- `$commit` - keep.
- `$yeet` - keep.
- `$docs-writer` - use verbatim from the supplied `docs-writer.zip`; this replaces `$repo-docs`.
- `$sharpen` - use as the renamed docs-grounded pressure-test skill.

Accepted but still undefined:

- `$compound` - add later once the orchestration shape is settled.

Moved out of the plugin:

- `$agent-browser`, `$doc-coauthoring`, `$explain`, `$idea`, `$improve-plan`, `$interface-craft`, `$oracle`, `$prd`, and `$prototype` were moved to `/Users/rishi/Desktop/agent-killed-skills-2026-06-05-232059/`.

Pending decision:

- `$debug` - recommended over `$diagnose`, and still present for now.

Everything else below is review material, not an install decision.

## Current Agent Plugin Inventory

As of this review, the source skills under `skills/` are:

| Skill | Current Read |
|---|---|
| `$clarify` | Narrow requirement clarification. Still present, with killed-skill handoff references removed. |
| `$code-quality` | Useful for cleanup/refactor/hard-cut work, but not currently accepted into the slim roster. Still present for now. |
| `$commit` | Keep. It is operational, high-frequency, and has a crisp boundary. |
| `$debug` | Prefer this over `$diagnose`; the name implies the full reproduce/instrument/fix/verify loop. |
| `$docs-writer` | Keep. Durable repo docs skill, replacing `$repo-docs`. |
| `$gh-review` | Useful but overlaps with ordinary review mode and may be outside the slim roster. Still present for now. |
| `$handoff` | Useful continuation artifact. Previously present; treat as pending unless explicitly kept in the slim roster. |
| `$harness-engineering` | Specialized. Keep only if harness/eval work stays central. Still present for now. |
| `$sharpen` | Keep. Replaces `grill-with-docs` naming and behavior in a more Agent-native form. |
| `$transcribe` | Specialized media workflow; outside current slim roster. Still present for now. |
| `$yeet` | Keep. End-to-end publish flow with clear operational value. |

## Naming And Workflow Boundaries

### Sharpen

`$sharpen` is the best rename for `grill-with-docs`.

It should mean: pressure-test a direction against durable docs and source reality until terms, boundaries, contradictions, and next artifact are crisp.

It differs from ideation because it narrows. It differs from clarification because it challenges. It differs from docs writing because it decides what is true before capture.

### Debug vs Diagnose

Use `$debug`.

`diagnose` sounds like a read-only root-cause report. `$debug` correctly implies the whole engineering loop: reproduce, inspect, instrument, fix, verify, clean up. If a read-only diagnosis is needed, make that a mode inside `$debug`, not a separate top-level skill.

### Ideate vs Brainstorm vs Sharpen

| Workflow | Primary Question | Shape | Recommended Agent Role |
|---|---|---|---|
| Ideate | What are the strongest possible ideas? | Divergent generation, ranking, selection | Future `$ideate` only if you want multi-agent idea generation. |
| Brainstorm | What exactly should one chosen idea mean? | Collaborative requirements shaping | Could become part of `$compound`, not a standalone skill yet. |
| Sharpen | Does this direction survive contact with docs, code, terms, and edge cases? | Convergent pressure test | Keep as `$sharpen`. |
| Docs Writer | Where should the settled truth live? | Durable repo documentation | Keep as `$docs-writer`. |

## Compound Engineering: Ideate And Brainstorm

### `ce-ideate`

What it does: generates many grounded improvement ideas, critiques them, and writes a ranked ideation artifact. It can operate on a repo topic, external software topic, or non-software topic, and can use multiple subagents for codebase scan, learnings, web research, issue intelligence, and idea generation.

How it works: it gates vague subjects, classifies the ideation mode, dispatches grounding and ideation agents, dedupes and critiques outputs, and keeps only the strongest survivors.

Review: excellent pattern for the future `$compound` skill, but too heavy as a default Agent skill. The useful part to borrow is the "generate many, reject explicitly, explain survivors" mechanism. Do not import the whole multi-agent machinery until `$compound` has a clear cost and artifact contract.

### `ce-brainstorm`

What it does: turns a vague or ambitious feature idea into a right-sized requirements document. It asks one question at a time, pressure-tests product assumptions, explores approaches, and writes a durable requirements artifact.

How it works: it scans repo context, checks rigor gaps, asks focused questions, explores 2-3 approaches, and writes a requirements doc in markdown or HTML depending on config.

Review: closer to `$sharpen` plus `$prd` than to visual brainstorming. Strong thinking-partner posture. The useful part to borrow is scope assessment plus product-pressure lenses. The output contract is heavier than you need unless `$compound` becomes the umbrella for requirements and planning.

## Product Design Plugin Review

Source: `/Users/rishi/Code/kpmg/reference/openai-curated-remote-plugins/product-design`.

### `index`

What it does: routes Product Design requests to the correct focused skill.

How it works: acts as a plugin router for user context, get-context, research, ideate, prototype, URL/image-to-code, audit, design QA, and share.

Review: useful only if building a Product Design-style plugin. For Agent, `$compound` may need an index/router, but the slim plugin does not.

### `user-context`

What it does: stores reusable product/design context such as URLs, Figma files, screenshots, tokens, brand assets, Storybook links, and preferred share targets.

How it works: persists a plugin-scoped `user-context.md` plus optional assets and uses a preflight script to load saved references without inspecting everything.

Review: good pattern. For Agent, this is more useful as a general plugin-context/memory design than as a copied skill. Do not add now.

### `get-context`

What it does: creates a mandatory design brief before ideation or prototyping.

How it works: asks only for product goal, visual source/style, and interactivity level, then plays back a pithy brief before proceeding.

Review: strong. Borrow the gate for visual/prototype work. As a standalone Agent skill it overlaps with `$clarify` and `$sharpen`; better as a future mode in a dedicated product-design or prototype workflow.

### `ideate`

What it does: generates image-based visual alternatives after the design brief is confirmed.

How it works: gathers visual context, attaches screenshots/Figma/reference assets to ImageGen, generates exactly three independent options, names them, and waits for user selection.

Review: very useful if Agent keeps visual design/prototype workflows. It is not the same as `$idea` or Compound `ce-ideate`; this one is specifically visual and ImageGen-led. Suggested addition only if you want a `$visual-ideate` skill.

### `prototype`

What it does: routes coded prototype requests from URL, image, Figma, existing code, or an idea.

How it works: enforces "no visual target, no build"; starts with get-context, routes to ideate when needed, then image-to-code or URL-to-code.

Review: excellent guardrail. Agent already has `$prototype`; borrow the "visual target required before build" rule rather than adding this wholesale.

### `image-to-code`

What it does: turns a selected image/mock/ImageGen output into a faithful responsive frontend.

How it works: catalogs visual assets, generates missing raster assets, finds matching fonts/icons, builds interactions, runs the local app, captures screenshots, and gates handoff on design QA.

Review: powerful but too product-design-specific for the slim Agent plugin. Keep as inspiration for a future visual build or QA lane rather than adding now.

### `url-to-code`

What it does: clones a live URL as a runnable frontend-only local app.

How it works: checks permission/terms, captures desktop/mobile/source DOM/assets/interactions, builds from captured evidence, then runs design QA.

Review: useful but high-risk and high-ceremony. Do not add now. The evidence-first capture discipline is worth borrowing for browser-based recreation tasks.

### `design-qa`

What it does: compares a prototype implementation against a source visual target before handoff.

How it works: captures source and rendered implementation, compares typography/layout/color/assets/copy/states/responsiveness/accessibility, writes `design-qa.md`, and blocks handoff until P0-P2 issues are gone.

Review: strongest Product Design skill to borrow. Suggested addition: preserve its QA gate as a future UI QA lane; do not add as a separate top-level skill unless product-design builds become frequent.

### `audit`

What it does: audits a product flow or screen sequence using current screenshots as evidence.

How it works: captures the flow, saves screenshots, optionally places them in Figma, and writes UX/design/accessibility findings tied to exact steps.

Review: strong evidence posture. Borrow as a screenshot-led audit lane if UI/product review returns. Standalone `$audit` is probably too generic for the slim roster.

### `research`

What it does: runs fast UX research on current user pain for a named digital product.

How it works: searches public and optional internal sources, clusters evidence into UX problems, ranks by severity/frequency/confidence/leverage, and produces a product story.

Review: useful, but this is not a core Agent developer skill unless you frequently ask Codex for product research. Candidate future skill: `$product-research`.

### `share`

What it does: deploys a runnable prototype to a selected sharing target.

How it works: confirms prototype directory and deployment target, uses the available deployment tool, and returns a working URL.

Review: operationally useful only when paired with a prototype hosting connector. Do not add as a standalone Agent skill now.

## Suggested Additions

Add now:

- `$sharpen` - done.
- `$docs-writer` - done; hard-cuts `$repo-docs`.

Recommended next:

- `$compound` - umbrella for multi-agent orchestration. Start small: route large work into research, sharpen, implementation, review, docs, and handoff. Avoid importing all Compound Engineering machinery until the artifact contract is clear.
- `$debug` - keep/use instead of `$diagnose` if bug work remains in scope.

Potential later additions:

- `$orient` - future name for a zoom-out/orientation lane, if that workflow returns.
- `$visual-ideate` - Product Design-style three-option ImageGen workflow, only if visual product design becomes common.
- `$design-qa` or a future UI QA lane - screenshot-led source-vs-implementation comparison.
- `$product-research` - current public/internal UX pain research for named products.

Do not add now:

- Product Design `image-to-code`, `url-to-code`, `share`, or router/index as standalone skills.
- Compound `ce-ideate` or `ce-brainstorm` wholesale.
- A separate `$diagnose` skill.
