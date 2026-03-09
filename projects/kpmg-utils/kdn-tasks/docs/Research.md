# Research — Best Practices Summary for KDN Task Writer

This document synthesizes external best practices per tools/best-practices-researcher.md. Findings inform our templates and guidance.

## Conventions
- Use folder names `On-shore Inputs` and `KDN Outputs` with a nightly subfolder named `YYYY-MM-DD` for sorting consistency.
- Generate two outputs: a plain-text email and an Outlook-safe HTML email body.

## Instruction Design
- Prefer single‑responsibility tasks with explicit inputs/outputs; number steps with imperative verbs; avoid hidden reasoning.
- Include acceptance checks (control totals, tie‑outs) and keep layout consistent.
- Normalize file references (paths, tab names, ranges) and call them out explicitly.

## Attachment Handling (Custom GPT context)
- Support user uploads and optional knowledge files; keep each file focused for retrieval quality.
- Extract tab names and ranges from spreadsheets when provided; cite page/range for PDFs.

## Handoff Workflow
- Keep two links: `On-shore Inputs` and `KDN Outputs`.
- Create nightly subfolders named `YYYY-MM-DD`; reference them explicitly in each task packet.
- Echo save locations and expected filenames in each task packet.

## Templates & Knowledge Base
- Include: initiation email with Deal Preferences; nightly task packet per workstream; writing/style guide (numbers, bullets, consistent section order); detailed instruction prompt.
- Mirror internal‑comms skill structure for discoverability and reuse.

## Guardrails
- No internal planning/chain‑of‑thought; instructions only.
- Ask concise questions only when required info is missing.
- Do not invent files/paths; request confirmation when uncertain.
- Support common attachment types including spreadsheets, documents, images, and email files (eml/msg).

## Outlook Formatting Best Practices
- Provide two variants in outputs: Plain‑text and HTML.
- HTML should be “Outlook‑safe”:
  - Use simple structure (<p>, <ul>, <li>, <table>), inline styles, and standard fonts (e.g., Arial, Calibri).
  - Avoid complex CSS, margins, and external styles; prefer cellpadding, cellspacing, and simple inline `style` attributes.
  - Keep lists flat (max 2 levels). Use <br> or separate <p> for spacing.
  - Keep tables simple, no merged cells when possible.
- Delivery options:
  - Copy the plain‑text block directly into Outlook.
  - For HTML: save the block as `.html`, then in Outlook: New Email → Insert → Attach File → dropdown on Insert → “Insert as Text” to render the HTML body.

### Minimal Outlook‑safe HTML skeleton
```html
<!doctype html>
<html>
  <body style="font-family: Calibri, Arial, sans-serif; font-size: 12pt; color: #000;">
    <p>Hi KDN Team,</p>
    <p>Please see tonight’s tasks below.</p>
    <ul>
      <li>Workstream: TB Mapping — due tomorrow</li>
      <li>Inputs folder: …/On-shore Inputs/2025-11-06</li>
      <li>Outputs folder: …/KDN Outputs/2025-11-06</li>
    </ul>
    <p>Thank you.</p>
  </body>
  </html>
```

## ChatGPT Markdown vs HTML
- ChatGPT commonly formats responses as Markdown in the UI, but copy/paste behavior can differ by app (web vs desktop) and may yield rich text instead of strict Markdown. Treat Markdown as a drafting convenience only.
- For reliability in Outlook, prefer generating the final email body directly as HTML (no code fences) plus a plain‑text version.

### Reliable conversion path (if Markdown is produced first)
- Preferred: ask the assistant to regenerate the same content as “Outlook‑safe HTML” with inline styles, and output the HTML with no surrounding backticks.
- Fallback (offline, optional): use a Markdown→HTML tool in your environment, then inline styles (e.g., premailer/juice) and re‑check with an Outlook preview. This repo does not ship code; keep this as a team workflow note.

### Agent instructions for dependable HTML
- Provide both variants: `Plain‑text` and `HTML` sections.
- For the HTML section:
  - Output raw HTML only (no ``` fences).
  - Use <p>, <ul>, <li>, simple <table>; inline styles only.
  - Keep indentation simple; avoid nested tables where possible.
  - Do not include external images/scripts; link with full URLs.
  - Place copy cues: `---HTML START---` and `---HTML END---` on their own lines to aid selection.

## Do we need Python?
- Not required for baseline usage (custom GPT generates emails and task packets; you paste into Outlook).
- Optional if you later want automation (out of current scope):
  - Create/send emails via Microsoft Graph API.
  - Pre‑create daily folder structures.
  - Validate spreadsheets or convert formats (e.g., xlsx → csv) for KDN.

## Source Citations
- ISO 8601 overview confirming `YYYY-MM-DD` as standard format. [See: Wikipedia ISO 8601]
- OpenAI Help Center: custom GPT knowledge base and file limits, including per‑file size and token guidance. [See: Help Center “Upload and manage files”, “Is there a limit to the size of the knowledge file?”]
- Atlassian async collaboration guidance and handoff patterns. [See: Atlassian Team Playbook; Async collaboration topics]
- GitLab async/remote handbook practices emphasizing documentation and conventions. [See: GitLab Handbook]
- FAST Standard for spreadsheet modelling and ICAEW modelling principles/code. [See: fast-standard.org; ICAEW resources]
