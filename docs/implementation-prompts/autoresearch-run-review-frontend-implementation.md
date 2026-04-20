# Implementation Prompt: Autoresearch Run Review Frontend

Build the first implementation of a portable run-review frontend for both:

- `/Users/rishi/Code/ai-tools/skills/autoresearch`
- `/Users/rishi/Code/ai-tools/skills/skill-autoresearch`

Read this spec first:

- [/Users/rishi/Code/ai-tools/docs/project-specs/autoresearch-run-review-frontend.md](/Users/rishi/Code/ai-tools/docs/project-specs/autoresearch-run-review-frontend.md)

## Objective

Implement one shared static HTML/CSS/JS frontend shell for reviewing autoresearch benchmark runs and preserved `.autoresearch` artifacts.

The frontend must support both skills through separate data adapters, but it should feel like one coherent product.

The main focus is data wiring and intuitive review flow, not decorative polish.

## Hard Constraints

- Do not use Vite, Next, React, Vue, Svelte, or any framework.
- Do not require a bundler.
- Do not require remote CDNs.
- The generated site must be portable and open locally.
- Do not rely on `fetch()` against local `file://` JSON.
- Do not make the frontend depend on `/tmp` workspace paths remaining alive.
- Do not leave generated benchmark artifacts inside the skill roots.
- Keep the frontend shell shared; do not fork into two unrelated UIs.

## Implementation Shape

Implement these pieces:

### 1. Shared frontend shell

Create the shared static site shell inside each portable skill bundle so the implementation ships with the skill itself.

It should contain:

- shared HTML templates
- shared CSS
- shared JS rendering logic

### 2. Per-skill generators/adapters

Add one generator per skill, likely under each skill’s `scripts/` folder:

- `skills/autoresearch/scripts/build_run_review.py`
- `skills/skill-autoresearch/scripts/build_run_review.py`

The generator responsibilities are:

- read benchmark metadata from `tests/plugin-eval/<skill>/latest/benchmark-run.json`
- read observed usage from `tests/plugin-eval/<skill>/latest/observed-usage.jsonl`
- read archived run logs from `tests/plugin-eval/<skill>/runs/<run-id>/...`
- read preserved workspace artifacts using `benchmark-run.json -> scenarios[].workspacePath`
- copy the important artifacts into the generated site
- emit portable page data files and pages

### 3. Shared output site

Generate a combined site under something like:

- `/Users/rishi/Code/ai-tools/tests/plugin-eval/site/`

This site should contain:

- one combined index page for all runs from both skills
- one detail page per run
- copied local artifacts for preview and raw open actions

## Data Contract

Implement a common normalized run model with:

- site manifest
- run records
- scenario records
- artifact records

The shell should render only normalized data.

The skill-specific adapters should be the only place that knows:

- how to detect the primary output artifact
- how to extract `.autoresearch` artifacts
- how to parse matrix or iteration ledgers
- how to order the artifact panels for each skill

## Required Pages

### Combined index page

Must include:

- filter by skill
- filter by status
- sortable run list
- run cards or rows showing:
  - skill
  - run id
  - created time
  - completed vs failed scenarios
  - average tokens
  - duration summary
  - quick outcome summary

### Run detail page

Must include these sections in this order:

1. Run header
2. Outcome snapshot
3. Scenario strip
4. Selected scenario story
5. Artifacts
6. Diffs and file changes
7. Logs

The detail page must feel linear and dossier-like, not like a dashboard.

## Skill-Specific Requirements

### `autoresearch`

The adapter must surface:

- task goal
- verification contract
- final output artifact
- session notes
- config
- final message
- fast vs deep mode guess

The output artifact preview should be first-class.

### `skill-autoresearch`

The adapter must surface:

- target `SKILL.md`
- original vs best diff
- `session.md`
- `matrix.json`
- `baseline.md`
- `final.md`
- `results.jsonl`
- iteration ledger derived from `results.jsonl`

The `SKILL.md` diff must be first-class.

## Log And Timeline Requirements

Parse `codex.stdout.jsonl` into a simple event timeline.

At minimum, extract and render:

- agent messages
- command executions
- file changes
- turn completion

Do not dump raw JSON as the primary experience.

The raw JSONL log should still be available in the raw logs section.

## Artifact Handling Requirements

This is critical:

- copy artifact content into the generated site
- preserve original source path in metadata
- render previews from copied site-local content

Do not leave the detail pages pointing at ephemeral preserved workspace files.

## Portability Requirements

To avoid `file://` issues:

- use generated `data/*.js` files that assign to `window.__RUN_REVIEW_*__`
- or inline page data directly into HTML

Do not build a system that only works behind a dev server.

## Styling Direction

Use a restrained, premium, technical-editorial look:

- calm background
- strong typography
- clean hierarchy
- sparse accent color
- clear pass / fail / partial states

Avoid:

- dashboard-card mosaics
- purple-on-white defaults
- generic admin templates
- decorative gradients everywhere

The page should feel closer to:

- GitHub Actions summary discipline
- LangSmith trace drilldown
- a calm lab notebook

than to a BI dashboard.

## Accessibility And Responsive

Ship with:

- keyboard navigation for run list and scenario strip
- visible focus states
- mobile-friendly stacked layout
- readable code and markdown previews
- color not being the only pass/fail signal

## Suggested File Output

You can choose exact names, but the output should roughly look like:

```text
tests/plugin-eval/site/
├── index.html
├── assets/
│   ├── styles.css
│   ├── app.js
│   └── ui.js
├── data/
│   ├── index.js
│   └── runs/
├── runs/
│   └── <run-id>/index.html
└── artifacts/
    └── <run-id>/<scenario-id>/...
```

## Validation

Before you stop:

1. Generate the site for both skills from the current repo artifacts.
2. Verify the skill roots remain clean of generated frontend output.
3. Verify the detail page loads without a bundler.
4. Verify copied artifact previews work even if the original preserved workspace disappears later.
5. Verify the combined index can show both skills together.

## Deliverable

Implement the frontend and stop when:

- the combined site exists
- both skill adapters work
- the page structure matches the spec
- the generated site is portable
- the critical run review flow is intuitive

Do not stop at mockups or only a plan. Implement the actual static site and generators.
