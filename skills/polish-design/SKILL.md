---
name: polish-design
description: "Review and polish frontend interfaces in one unified loop. Combines concise design audit with hands-on fixes. Use when the interface needs a quality pass that both identifies and resolves issues, or when the user asks for iterative polish such as `polish-design 3x`."
---

# Polish Design

Audit and fix a frontend interface in one pass. This skill replaces separate audit-then-polish workflows with a single tight loop: see the problem, name it, fix it.

Use `frontend-skill` as the design principles foundation. Every judgment call defers to those principles and to `docs/DESIGN.md` if it exists in the repo.

## Priority Rule

- Check for `docs/DESIGN.md` in the project root; if it exists, read it first and treat it as the primary design context.
- Do not create or refresh `docs/DESIGN.md` silently.

## Iteration Model

Default: **1 iteration** that fixes all issues found.
If many issues exist, split into 1-3 fixes per iteration.
User can request multiple iterations (e.g., `polish-design 5x`).

Each iteration:

1. Review the current design in code
2. Take a screenshot
3. Review the screenshot
4. Audit — output concise bullets to chat (see format below)
5. Implement fixes
6. Take a new screenshot to confirm

## Audit Format

Output a flat bullet list in chat. No files, no artifacts, no lengthy reports.

Organize bullets under these 5 categories:

### 1. Anti-Patterns & First Impression
Does it look AI-generated? Gradient text, glow accents, glassmorphism, identical card grids, hero metric strips, nested cards, generic fonts, weak hierarchy. Pass or fail, cite tells.

### 2. Hierarchy, Composition & IA
Eye guidance, primary action clarity, whitespace rhythm, spacing intentionality, grouping logic, navigation predictability. Is the most important thing obvious in 2 seconds?

### 3. Typography, Color & Copy
Type hierarchy readability, color communicating vs decorating, labels/errors/buttons clear and human, copy concise and purposeful, 2 typefaces max, 1 accent color.

### 4. States, Edge Cases & Resilience
Empty/loading/error/success states, long text, missing data, small screens, text scaling, touch targets, keyboard/focus, theme behavior.

### 5. Performance
Layout thrash, expensive animations, large images, bundle bloat, unnecessary re-renders, layout shift.

For each bullet: state the problem, where it is, severity (Critical/High/Medium/Low), and fix direction in one line.

Example:
```
**Anti-Patterns** FAIL
- Gradient text on hero headline; replace with solid color — High
- Identical 3-card grid below fold; vary layout or use list — Medium

**Hierarchy**
- No clear primary CTA above fold; add single prominent button — Critical

**States**
- No empty state for dashboard cards; add placeholder — High
```

## Capture Routing

### Web
1. `agent-browser` skill — HIGHEST priority if available
2. Chrome DevTools MCP or other available browser MCP
3. If nothing available, ask user before installing anything

### Expo iOS
- Expo simulator capture commands
- Do not route through `agent-browser` unless the content is web

### Native iOS
- Xcode simulator capture
- Do not route through `agent-browser`

If capture requires new tooling setup, stop and ask.

## Guardrails

- Always reference `frontend-skill` principles when judging design quality.
- Audit output goes to chat only. No report files, no screenshot storage unless user asks.
- Do not drift into feature work or refactors.
- Do not introduce new bugs while polishing.
- Do not install capture tools without asking.
- Do not over-polish minor details while systemic problems remain.
- Preserve the repo's existing design language unless user explicitly asks for departure.
- In multi-iteration mode, pick 1-3 high-impact fixes per pass. Do not try to fix everything at once.
