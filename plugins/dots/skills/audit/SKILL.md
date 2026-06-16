---
name: audit
description: "Audit or critique a product flow, journey, workflow, funnel, onboarding path, checkout path, settings path, screen, or multi-step product experience from newly captured screenshots and evidence. Use when the user asks to audit, critique, review, inspect, assess, or evaluate a product experience."
---

# Audit

Use this skill when the user wants to audit or critique a product flow, journey, funnel, onboarding path, checkout path, settings path, screen, or other product experience.

The output is not a loose opinion. The output is:

- Screenshots of the flow saved to a local audit folder
- A numbered step list
- UX and design findings tied to steps or screenshots
- Accessibility risks tied to steps or screenshots
- Clear limits on what could not be checked from screenshots alone

## Grounding

Use saved product URLs, screenshots, reference images, codebase paths,
Storybook, tokens, design systems, brand assets, component refs, browser
preferences, and share targets as grounding material when relevant.

Do not inspect every saved reference. Inspect only what the current task needs.

## Route

Before auditing:

1. Identify the product or surface.
2. Identify the flow or task.
3. Identify the local audit folder.
4. Choose the capture tool.
5. Capture the flow.
6. Save, inspect, and annotate each screenshot.

Destination rules:

- If the user names a local folder, use that folder.
- If the destination is missing, create a local audit folder under the project
  or artifact workspace.

Capture rules:

- Use the Codex in-app Browser first.
- If Browser cannot access, control, or screenshot the target, use the installed
  Chrome skill.
- If Browser and Chrome cannot complete the capture, ask for another approved validation surface.
- If none of those can capture valid screenshots or control the flow, stop and report the blocker.

Browser capture order:

1. Load the Browser skill before browser work.
2. Connect to the browser and use the current tab when it already shows the target.
3. Do not reload or navigate away unless the audit needs a fresh start.
4. Observe the visible state before acting.
5. Before each click, type, or key press, use the latest DOM snapshot to target one clear control.
6. After each action, take the cheapest fresh check that proves what changed: DOM for structure, screenshot for visual state.
7. Save and inspect the accepted screenshot before using it as audit evidence.

Evidence rules:

- Use only evidence captured in the current audit run.
- Do not use memory, prior chats, old traces, cached screenshots, or prior generated artifacts as audit evidence unless the user explicitly provides them.
- Do not audit until the product, flow, destination, and capture tool are known.
- Do not claim full accessibility compliance from screenshots alone.

## Capture And Audit The Flow

You are an expert design, UX, and accessibility auditor. For each step in the flow, capture what the user sees, observe how the screen behaves, inspect the screenshot, and write audit notes before moving on.

Follow [references/design-audit-framework.md](references/design-audit-framework.md) when deciding what to inspect and how to describe strengths, UX issues, accessibility risks, limits, and recommendations.

Screenshot source rule:

- Use the screenshot you actually saw.
- Save that exact screenshot to the local audit folder.
- Open or inspect the saved file before accepting it.
- If the saved file shows the wrong window, wrong state, blank page, crop, or loading screen, reject it and capture again.
- Do not replace a Browser, Chrome, or Computer Use screenshot with an OS screenshot unless you first prove the saved file shows the same window and state.

For every step:

1. Move to the next step in the requested flow.
2. Wait until the screen is loaded and visually stable.
3. Check for loading spinners, blank areas, login walls, error pages, blocked states, cookie dialogs, and half-rendered content.
4. Capture the screenshot.
5. Inspect the screenshot before accepting it.
6. Reject the screenshot if it is blank, loading, cropped, blocked, or showing the wrong state.
7. Observe behavior that matters for the audit, such as navigation, focus, loading, validation, error handling, empty states, motion, and whether the next action is clear.
8. Write notes for that step.
9. In the notes, report strengths, UX issues, accessibility risks, and any limits that made the step difficult to audit.
10. Save accepted screenshots with numbered names, such as `01-start.png`, `02-form-filled.png`, and `03-confirmation.png`.
11. Inspect the saved screenshot file before upload or handoff.
12. Add notes for that step to the local audit notes immediately.

If the destination is a local folder:

- Save screenshots in that folder.
- Save the notes in a file that can be shared at the end.

Acceptance checks:

- Every important step in the requested flow has a valid screenshot or a named blocker.
- Screenshots are saved in order.
- Screenshots are saved as they are captured.
- Notes are written as screenshots are accepted.
- Every note points to the screenshot or step it describes.
- Notes explain strengths, UX issues, accessibility risks, and evidence limits when those apply.
- Accessibility risks say what can be seen from screenshots and what still needs testing.
- The final screenshot set and notes are enough to support the requested audit.

Blockers:

- The flow cannot be completed.
- A required step cannot be screenshotted.
- The source changes in a way that makes the flow unclear.
- Screenshots cannot be saved.
- Notes cannot be written.
- The requested claim would require evidence that screenshots cannot provide.

## Final Response

After the flow is captured and notes are written, list every step in the final response.

The final step list MUST include:

- step number
- short description of the step
- general health of that step

Also include where the full output was saved.

Keep the language direct. Do not use broad design jargon when a plain phrase works.
