---
description: Capture fast UI screenshots to .agents/screenshots/<task>
argument-hint: "<task/feature>: <what to capture (plain English)>"
---

Use the $agent-browser skill to capture UI screenshots quickly and consistently.

You will receive ONE free-form instruction string: `$ARGUMENTS`.

Parse `$ARGUMENTS` like this:
- If it contains a `:` delimiter, treat the text before the first `:` as `TASK` and the rest as `REQUEST`.
  - Example: `workout-editor: home, workout detail, edit flow (light+dark)`
- If there is no `:`, ask ONE question: “What should the folder name be under `.agents/screenshots/`?” Then treat the entire `$ARGUMENTS` as `REQUEST`.

Requirements:
- Save all outputs under `.agents/screenshots/TASK/` (create it if missing).
- Do NOT capture “all screens” unless `REQUEST` clearly asks for all screens. Otherwise, capture only what’s asked.
- Prefer the fastest workflow: run against web (`bun run web`) and drive navigation with agent-browser.
- After each navigation, wait for the UI to settle (network idle) before shooting.

Execution:
1) Ensure the app is running on web. If it isn’t, start it with `bun run web` and wait until it loads.
2) `mkdir -p ".agents/screenshots/TASK"`.
3) `agent-browser open http://localhost:8081 --headed`
4) Set a consistent device + theme:
   - Default viewport: 390x844
   - If `REQUEST` says tablet or names a device, emulate that.
   - If `REQUEST` says dark/light/both, match it; otherwise default to light.
5) Navigate to each requested screen/flow using `agent-browser snapshot -i` + ref-based clicks.
6) Save screenshots as `.agents/screenshots/TASK/<nn>_<screen-slug>_<theme>.png`.
7) Write `.agents/screenshots/TASK/index.md` with:
   - The exact request string
   - The list of screenshots produced (filenames)
   - Anything blocked/missing and why

Be pragmatic:
- If login/setup is required and you can’t proceed, stop and ask for the minimum missing info (credentials, seed data path, or which flow to skip).
