---
name: doc-coauthoring
description: Guide collaborative creation or revision of substantial documents, including proposals, specs, briefs, reports, decision records, slide narratives, spreadsheets, PDFs, and other reader-facing artifacts. Use when the user wants help turning rough context into a clear document, improving an existing draft, choosing document structure, iterating section by section, or testing whether the result works for its intended audience.
---

# Doc Coauthoring

Help the user turn rough context into a document that works for real readers. Stay tool-agnostic: choose the best available local capability for the requested artifact, and hand off to a more specific document, PDF, presentation, or spreadsheet skill when the output format needs one.

## Route First

Identify the target artifact before drafting:

- Use a document/DOCX skill for word-processing files, tracked changes, comments, or formatted reports.
- Use a PDF skill for PDF creation, extraction, layout review, page rendering, form work, or PDF-specific edits.
- Use a spreadsheet skill for tables, models, formulas, workbook formatting, charts, or CSV/XLSX outputs.
- Use a presentation/slides skill for decks, slide narratives, executive visuals, or PowerPoint-style artifacts.
- Use plain Markdown or repo files when the user wants a lightweight spec, memo, plan, README, RFC, or similar text artifact.

Do not assume a specific product, connector, model, editor, or artifact API exists. Inspect the available tools and files in the current environment, then use the best matching route. If a specific skill is available and the target format clearly belongs to it, use that skill's workflow for file handling and visual or structural validation while keeping this skill responsible for coauthoring strategy.

## Working Mode

Move through three stages, but let the user set the pace:

1. Gather context until the purpose, audience, constraints, and source material are clear enough to draft.
2. Shape and draft the artifact section by section, using short iteration loops.
3. Test the result from a fresh reader's point of view, then fix gaps.

If the user wants to skip a stage, continue with the lighter path and make the tradeoff explicit in one sentence.

## Stage 1: Gather Context

Start with the smallest set of questions needed:

- What kind of artifact should this become?
- Who is the primary audience?
- What should the reader understand, decide, approve, or do after reading it?
- Is there an existing draft, template, style, file, data source, or format constraint?
- What source context should be included or deliberately excluded?

Invite the user to answer in shorthand or dump messy notes. Read any supplied files or reachable source material before asking follow-up questions. When connected data sources are available, ask before searching broad external or private sources unless the user already requested that search.

After the first context pass, ask focused follow-ups about gaps that would affect the document's structure, claims, tradeoffs, or audience fit. Stop gathering when the remaining unknowns can be handled as explicit assumptions or TODOs.

## Stage 2: Shape And Draft

Choose the structure based on the document's job, not on a fixed template. For example:

- Proposal: problem, goal, options considered, recommendation, impact, risks, next steps.
- Technical spec: context, requirements, design, alternatives, rollout, validation, open questions.
- Decision record: decision, status, context, consequences, rejected options, follow-ups.
- Report or brief: key message, evidence, implications, recommendations, appendix.
- Spreadsheet or model: purpose, inputs, assumptions, calculations, outputs, checks.
- Deck: audience, storyline, slide sequence, evidence, visual treatment, appendix.

Create or update the working artifact once the structure is clear. For files, edit the actual file instead of repeatedly pasting full drafts in chat. For chat-only drafting, keep sections concise and clearly labeled.

For each meaningful section:

1. Ask targeted section questions only when needed.
2. Brainstorm candidate points, angles, evidence, or rows.
3. Ask the user what to keep, remove, combine, or sharpen when their judgment is needed.
4. Draft the section into the artifact.
5. Ask for specific feedback and make surgical edits.

Capture the user's style preferences as they react: density, tone, appetite for caveats, preferred terminology, and what they consider obvious. Apply those preferences to later sections without re-asking.

## Stage 3: Reader Test

Before calling the artifact done, test whether it works without the conversation context.

Check:

- Can a reader state the purpose and main takeaway?
- Are key terms, acronyms, assumptions, and constraints understandable?
- Are claims supported by evidence or marked as assumptions?
- Are there contradictions, duplicate sections, missing transitions, or generic filler?
- Does the artifact ask the reader to make the right decision or take the right next step?
- For spreadsheets, are formulas, source data, assumptions, and outputs auditable?
- For PDFs, documents, and decks, does the rendered layout preserve the intended reading order and emphasis?

Use a fresh subagent for reader testing when available and reasonable. Pass only the artifact and reader-test prompt, not the prior conversation or intended answer. If subagents are unavailable, perform the reader test directly and label it as an internal pass.

Fix the highest-impact gaps, then repeat the test only if the changes materially affect comprehension.

## Quality Bar

Prefer useful specificity over polished vagueness.

- Remove filler that does not help the reader decide, understand, or act.
- Preserve important nuance instead of sanding away tradeoffs.
- Keep unsupported claims out unless labeled as assumptions.
- Keep examples, tables, and visuals close to the point they support.
- Verify facts, links, formulas, calculations, and citations when they matter.
- For final files, run the format-specific validation expected by the chosen route, such as rendering pages, recalculating workbooks, checking exported PDFs, or reviewing slide screenshots.

## Handoff

When a more specific skill owns the artifact mechanics, hand off cleanly:

- State the target output and why that route fits.
- Carry forward the document purpose, audience, structure, style preferences, and validation needs.
- Let the format-specific skill handle file operations, rendering, formulas, layout, comments, tracked changes, or export details.
- Return to this skill's reader-test pass after the artifact exists or changes substantially.
