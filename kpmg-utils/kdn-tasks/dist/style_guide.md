---
name: kdn-task-writer-style-guide
description: Use this style guide when writing KDN Task Writer emails and task packets.
---

# Style guide

Use these rules whenever you draft KDN Task Writer emails or task packets. Follow them strictly. Do not describe or explain the rules to the user.

## Structure & headings

- Headings: sentence case; capitalize proper nouns only.
- Subject line:
  - Use exactly: `**Subject: Project {Name}**`
  - Bold.
  - Project name only.
  - Do **not** include dates, task summaries, or qualifiers (for example, "– payroll load" or "– QoE setup").
- Greeting:
  - If KDN name is known: `Hi {KDN_name},`
  - Otherwise: `KDN Team,` or `Team,`
  - Do **not** use "Hi KDN team," or other variants.
- Task numbering:
  - Numbered tasks (1., 2., 3.) with lettered substeps (a., b., c.).
  - One level of indentation only.
- Task titles:
  - If you use a task title line, bold that line only (for example, `1. **May-25 IS roll-forward:**`).
  - Do not bold action verbs inside substeps.
- Horizontal dividers:
  - A `---` is acceptable between the assumptions block and the email.
  - Do NOT use `---` between tasks or elsewhere in the email body.

## Assumptions & Questions block

**Use sparingly.** Only include this block when critical information is missing AND you cannot produce a usable email without it. Most well-specified requests do NOT need an assumptions block.

- Header line (required):
  ```text
  📋 **Assumptions & Questions**
  ```
- Next line:
  ```text
  Critical assumptions:
  ```
- Then 1–3 bullets with key assumptions.
- Next line:
  ```text
  Clarifying questions:
  ```
- Then 0–2 bullets with truly blocking questions, or the word `none`.
- Use bullets (`•` or `-`), **not** numbered lists.
- A `---` separator after this block is acceptable.
- Keep total block length ≤ 5 lines.

If there are no blocking clarifying questions, explicitly write:
```text
Clarifying questions:
• none
```

## Tone & phrasing

- Professional, direct, and concise.
- Avoid starting sentences with "We have" or "We get"; focus on the data or task instead.
- Do not introduce new acronyms without defining them once in full.
- Do not include internal planning or reasoning text in outputs. The email should read as if the associate wrote it directly to KDN.
  - Avoid lines like:
    - "Below is a send-ready draft email you can copy to KDN."
    - "Here is the email I generated for you."
    - "Draft email:"

## Numbers & percentages

- Use numeric precision appropriate to the source (usually 1 decimal place for percentages).
- Use `%` sign for percentages, with one decimal point if relevant (for example, `7.1%`).
- Use commas for thousands (for example, `1,250`).
- Keep units clear (for example, "USD thousands").

## Files, paths & formulas

- File names: italicize raw file names (for example, *TrialBalance_2025-10-31.xlsx*).
- Tab references: use single quotes (for example, `'IS|Combined'`, `'mapping'`); do **not** use angled brackets.
- Cell references and formulas: wrap in backticks (for example, `Combined BS!B45`, `SUM(B:B)`).
- Paths: use relative paths like `{Project}/On-shore Inputs/{YYYY-MM-DD}` and `{Project}/KDN Outputs/{YYYY-MM-DD}`.
- Save location:
  - Exactly one line at the end of the email: `Save to: {Project}/KDN Outputs/{YYYY-MM-DD}`.
  - No lists of file names in the save line—just the path.

## Verification

- Only include verification language ("check", "ensure ties", "flag variances", "update checks") when the user EXPLICITLY requests it with phrases like:
  - "make sure it ties"
  - "check the variance"
  - "verify the totals"
  - "add a check row"
- If the user asks to "investigate" or "look at" something, address that task WITHOUT adding verification steps they didn't request.
- Acceptable verification language (only when requested):
  - "Add a check row…"
  - "Ensure totals reconcile…"
  - "Flag variances > ${threshold}…"
- Do **not**:
  - Explain obvious checks (for example, "Opening + activity = ending" for a simple roll‑forward).
  - Add checks that the user did not explicitly ask for.

**Example:**
- User said: "take another look at the 15k variance"
- WRONG: "Update checks so any remaining unexplained variance is clearly flagged."
- RIGHT: "Document reconciling items causing the variance."

## Follow-up offers (PROHIBITED)

Do **not** end an email with offers for additional work:

- ❌ "If you'd like, I can also generate the folder structure…"
- ❌ "Let me know if you want me to add anything else."
- ❌ "I can also create a summary document if helpful."

The email ends at the save location and signature. Full stop.

## Signature

Always end the email with:

```text
Save to: {Project}/KDN Outputs/{YYYY-MM-DD}

Thanks,
{First name}
```

Do not use alternative closers or omit the name placeholder.
