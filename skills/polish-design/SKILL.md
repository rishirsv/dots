---
name: polish-design
description: "Review and polish frontend interfaces with a fast default loop or an explicit evaluator-led multi-pass loop. Also supports critique-first review and resilience-focused hardening within the same skill. Use when the interface needs a quality pass that diagnoses and improves design, especially when the user asks for polish, critique, hardening, iterative refinement such as `polish-design 3x`, subagents, or a dedicated design evaluator."
---

# Polish Design

Polish frontend interfaces with a tight implementation loop by default, and switch to a stricter evaluator-led loop only when the user explicitly asks for subagents, a dedicated evaluator, or multi-pass critique.

Use `frontend-skill` as the design principles foundation. Every judgment call defers first to `docs/DESIGN.md` if it exists in the repo, then to `frontend-skill`, then to the evaluator rubric in `references/design-evaluation.md`, the critique rubric in `references/design-critique.md`, and the resilience checks in `references/hardening-checklist.md`.

## Priority Rule

- Check for `docs/DESIGN.md` in the project root. If it exists, read it first and treat it as the primary design context.
- Do not create or refresh `docs/DESIGN.md` silently.
- For evaluator-led runs, read `references/design-evaluation.md` before producing any score or recommendation.
- For critique-first requests, read `references/design-critique.md` before producing findings.
- For hardening-focused requests or when resilience issues appear material, read `references/hardening-checklist.md` before recommending or making changes.

## Mode Selection

Default to the single-agent polish loop unless the user explicitly requests one of these:

- critique, review, assess, or diagnose before editing
- harden, productionize, handle edge cases, or make the UI more resilient
- use subagents
- use the `design_evaluator` agent
- run multiple evaluator-led passes
- compare passes, persist artifacts, or decide whether to refine, pivot, or stop

Mode routing:

- `default polish`: audit and improve in one pass
- `critique-first`: findings first, edits second only if requested or clearly implied
- `hardening-first`: prioritize resilience, states, overflow, and edge cases over visual flourish
- `evaluator-led`: use the dedicated multi-pass scoring loop

Examples that should trigger the evaluator-led path:

- `Use polish-design with subagents`
- `Run polish-design 3x with design_evaluator`
- `Use a design evaluator before each pass`
- `Use design_evaluator and pass the screenshot folder`

Examples that should stay in the default path:

- `Polish this page`
- `Give this dashboard one design pass`

Examples that should trigger `critique-first`:

- `Critique this settings flow before changing anything`
- `Review this screen and tell me what's wrong`
- `Assess the UX before we polish it`

Examples that should trigger `hardening-first`:

- `Polish this form, but focus on edge cases`
- `Harden this dashboard before release`
- `Make this UI production-ready`

## Default Loop

Use this path for most requests.

1. Review the current design in code.
2. Capture the current interface. If the capture is saved to disk, save it under `.agents/polish-design/<run-id>/screens/`.
3. Audit the screenshot and code together.
4. Output concise findings in chat.
5. Implement 1-3 high-impact fixes.
6. Re-capture and confirm the result. If the capture is saved to disk, save it under `.agents/polish-design/<run-id>/screens/`.

When issues are obvious, include critique and hardening lenses in the same pass rather than treating polish as purely visual.

### Default Audit Categories

Organize concise findings under these categories:

1. Anti-Patterns & First Impression
2. Hierarchy, Composition & IA
3. Typography, Color & Copy
4. States, Edge Cases & Resilience
5. Motion & Performance

For each bullet: state the problem, where it is, severity (`Critical`, `High`, `Medium`, `Low`), and the fix direction in one line.

## Critique-First Loop

Use this path when the user asks for review, critique, or diagnosis before implementation.

1. Review the current design in code and capture the interface when possible.
2. Read `references/design-critique.md`.
3. Output findings first, with no code changes yet.
4. Prioritize the top 3-5 issues by user impact and leverage.
5. If the user asked only for critique, stop after findings and next-step recommendations.
6. If edits are requested or clearly implied, fix only the highest-leverage issues and then re-check.

### Critique Output

Structure findings under:

1. Anti-Patterns Verdict
2. Overall Impression
3. What's Working
4. Priority Issues
5. Persona or Flow Red Flags
6. Recommended Next Move

Keep critique concrete. Name the problem, why it matters, and the fix direction. Do not drift into vague design commentary.

## Hardening-First Loop

Use this path when resilience is the priority, or when the main blockers are not aesthetic but operational.

1. Review the current design in code and capture the interface when possible.
2. Read `references/hardening-checklist.md`.
3. Identify the highest-risk resilience failures before cosmetic issues.
4. Focus fixes on states, overflow, responsive failure, long content, input extremes, async behavior, permissions, and i18n-sensitive layout.
5. Re-check the affected flows after implementation.

### Hardening Priorities

Default priority order:

1. broken or missing states
2. text overflow and layout breakage
3. touch target and responsive issues
4. async, retry, and permission flows
5. i18n, RTL, and data-shape resilience

Do not spend the pass on visual flourish if resilience blockers remain.

## Evaluator-Led Loop

Use this path only when the user explicitly asks for the heavier workflow.

The two roles are:

- `polisher`: owns design/code changes
- `evaluator`: judges the current state, scores it, and recommends the next move

The evaluator should be the dedicated `design_evaluator` custom agent when available. The evaluator is read-only and must never take implementation ownership.

### Evaluator-Led Steps

1. Write a short polish contract and save it to `.agents/polish-design/<run-id>/brief.md`.
2. Capture the current interface and save any screen files under `.agents/polish-design/<run-id>/screens/`.
3. Ask the evaluator to score the interface using `references/design-evaluation.md`, and pass the run screenshot folder path.
4. Summarize the evaluator result in chat very concisely.
5. Implement only the highest-leverage fixes for that pass.
6. Re-capture the interface and save any screen files under `.agents/polish-design/<run-id>/screens/`.
7. Ask the evaluator to score the new state and recommend `refine`, `pivot`, or `stop`, again passing the same run screenshot folder path.
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
- In critique-first mode, findings come before edits.
- In hardening-first mode, resilience blockers outrank purely visual polish.

## Artifact Routing

For evaluator-led runs, store compact artifacts under `.agents/polish-design/<run-id>/`.

Use this file set:

- `brief.md`
- `pass-01-eval.md`
- `pass-01-plan.md`
- `pass-02-eval.md`
- `summary.md`

Store screen captures only under:

- `.agents/polish-design/<run-id>/screens/`

Do not save screens under `docs/`, `docs/polish`, or any other documentation path.

Use a simple sequence-friendly naming structure inside `screens/`:

- `00-current.png` when there is only one baseline capture
- `01-before-pass-01.png`
- `02-after-pass-01.png`
- `03-before-pass-02.png`
- `04-after-pass-02.png`

The caller should pass the `screens/` folder path to the evaluator. Exact screenshot paths are optional.

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

If a capture tool saves files, route them to `.agents/polish-design/<run-id>/screens/`.

### Expo iOS

- Use Expo simulator capture commands
- Do not route through `agent-browser` unless the content itself is web
- Save any captured screens under `.agents/polish-design/<run-id>/screens/`.

### Native iOS

- Use Xcode simulator capture
- Do not route through `agent-browser`
- Save any captured screens under `.agents/polish-design/<run-id>/screens/`.

## Guardrails

- Always reference `frontend-skill` principles when judging design quality.
- The evaluator output must be skeptical, concise, and actionable.
- Use critique and hardening references only when they materially fit the task; do not load every reference by default.
- Do not drift into feature work or refactors unless a design blocker cannot be solved without them.
- Do not install capture tools without asking.
- Do not over-polish minor details while systemic problems remain.
- Do not confuse critique with implementation. If the user asked for review only, stop after findings.
- Do not confuse hardening with feature expansion. Add resilience, not scope.
- Preserve the repo's design language unless the user explicitly asks for departure.
- In evaluator-led mode, do not spawn subagents unless the user explicitly asked for them.
- The evaluator must never edit files.
- When invoking the evaluator, always pass the screenshot folder for the current run.
