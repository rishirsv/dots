---
name: polish-design
description: "Review and polish frontend interfaces with a fast default loop or an explicit evaluator-led multi-pass loop. Use when the interface needs a quality pass that both diagnoses design issues and improves them, especially when the user asks for iterative polish such as `polish-design 3x`, asks to use subagents, or wants a dedicated design evaluator."
---

# Polish Design

Polish frontend interfaces with a tight implementation loop by default, and switch to a stricter evaluator-led loop only when the user explicitly asks for subagents, a dedicated evaluator, or multi-pass critique.

Use `frontend-skill` as the design principles foundation. Every judgment call defers first to `docs/DESIGN.md` if it exists in the repo, then to `frontend-skill`, then to the evaluator rubric in `references/design-evaluation.md`.

## Priority Rule

- Check for `docs/DESIGN.md` in the project root. If it exists, read it first and treat it as the primary design context.
- Do not create or refresh `docs/DESIGN.md` silently.
- For evaluator-led runs, read `references/design-evaluation.md` before producing any score or recommendation.

## Mode Selection

Default to the single-agent loop unless the user explicitly requests one of these:

- use subagents
- use the `design_evaluator` agent
- run multiple evaluator-led passes
- compare passes, persist artifacts, or decide whether to refine, pivot, or stop

Examples that should trigger the evaluator-led path:

- `Use polish-design with subagents`
- `Run polish-design 3x with design_evaluator`
- `Use a design evaluator before each pass`

Examples that should stay in the default path:

- `Polish this page`
- `Give this dashboard one design pass`

## Default Loop

Use this path for most requests.

1. Review the current design in code.
2. Capture the current interface.
3. Audit the screenshot and code together.
4. Output concise findings in chat.
5. Implement 1-3 high-impact fixes.
6. Re-capture and confirm the result.

### Default Audit Categories

Organize concise findings under these categories:

1. Anti-Patterns & First Impression
2. Hierarchy, Composition & IA
3. Typography, Color & Copy
4. States, Edge Cases & Resilience
5. Motion & Performance

For each bullet: state the problem, where it is, severity (`Critical`, `High`, `Medium`, `Low`), and the fix direction in one line.

## Evaluator-Led Loop

Use this path only when the user explicitly asks for the heavier workflow.

The two roles are:

- `polisher`: owns design/code changes
- `evaluator`: judges the current state, scores it, and recommends the next move

The evaluator should be the dedicated `design_evaluator` custom agent when available. The evaluator is read-only and must never take implementation ownership.

### Evaluator-Led Steps

1. Write a short polish contract and save it to `.agents/polish-design/<run-id>/brief.md`.
2. Capture the current interface.
3. Ask the evaluator to score the interface using `references/design-evaluation.md`.
4. Summarize the evaluator result in chat very concisely.
5. Implement only the highest-leverage fixes for that pass.
6. Re-capture the interface.
7. Ask the evaluator to score the new state and recommend `refine`, `pivot`, or `stop`.
8. Save the pass artifacts and post a concise in-chat summary.

### Polish Contract

Include only:

- target surface
- intended feel or visual thesis
- primary user action
- constraints that must not regress
- goal for this pass

### Pass Scope

- In evaluator-led mode, fix only 1-3 high-impact issues per pass.
- If the same blocker persists for two passes, do not keep polishing blindly. Re-evaluate the direction.
- When the evaluator recommends `pivot`, change the design direction before more incremental polish.
- When the evaluator recommends `stop`, do not chase cosmetic nits.

## Artifact Routing

For evaluator-led runs, store compact artifacts under `.agents/polish-design/<run-id>/`.

Use this file set:

- `brief.md`
- `pass-01-eval.md`
- `pass-01-plan.md`
- `pass-02-eval.md`
- `summary.md`

Artifacts must stay operational and compact. They are not reports.

Each pass artifact should track:

- scores
- top blockers
- changes attempted
- unresolved issues
- evaluator recommendation

## Chat Summary Format

Every evaluator-led pass must be summarized in chat in 3-5 short lines.

Use this shape:

```text
Pass 2/3 | Score 64 -> 71 | Recommendation: refine
Fixed: simplified hero hierarchy and removed card clutter
Top blocker: weak visual anchor in first viewport
Next move: strengthen imagery and CTA contrast
```

## Capture Routing

### Web

1. `agent-browser` skill if available
2. Chrome DevTools MCP or another available browser MCP
3. If nothing is available and new setup is required, stop and ask before installing anything

### Expo iOS

- Use Expo simulator capture commands
- Do not route through `agent-browser` unless the content itself is web

### Native iOS

- Use Xcode simulator capture
- Do not route through `agent-browser`

## Guardrails

- Always reference `frontend-skill` principles when judging design quality.
- The evaluator output must be skeptical, concise, and actionable.
- Do not drift into feature work or refactors unless a design blocker cannot be solved without them.
- Do not install capture tools without asking.
- Do not over-polish minor details while systemic problems remain.
- Preserve the repo's design language unless the user explicitly asks for departure.
- In evaluator-led mode, do not spawn subagents unless the user explicitly asked for them.
- The evaluator must never edit files.
