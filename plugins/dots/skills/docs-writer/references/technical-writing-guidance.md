# Technical writing guidance

Read this when drafting or revising reader-facing documentation. It defines the
technical writing rules this skill should apply at runtime.

## Core moves

- Identify the audience before writing. Name what the reader already knows,
  what they are trying to do, and what decision or task the doc must support.
- State the document's purpose early. A reader should know within the first
  screen whether the doc is a concept, task, reference, decision, or release
  note.
- Prefer short sentences and focused paragraphs. One paragraph should develop
  one idea.
- Put the key noun near the key verb. Avoid long noun stacks, vague subjects,
  and sentence openings that delay the action.
- Use active voice by default: "Run the sync script" instead of "The sync script
  should be run."
- Choose concrete verbs over vague verbs: "create", "copy", "validate",
  "restart", "publish", "query".
- Define unfamiliar terms at first use. If the term is not needed, replace it
  with ordinary language.
- Use lists and tables when they make comparisons, inputs, or repeated steps
  easier to scan. Do not use a table just to make sparse prose look organized.

## Headings

- Use descriptive headings that tell the reader what the section is for.
- Keep heading levels nested logically. Do not skip from `##` to `####`.
- Prefer task or artifact names over abstract labels. "Run validation" is more
  useful than "Additional considerations".
- Avoid repeating the document title as the first section heading.

## Procedures

- Start with prerequisites only when they change whether the procedure can
  succeed.
- Use numbered steps for ordered actions. Use bullets for unordered facts,
  choices, or checks.
- Put one action in each step. Add result or verification text after the action
  when the reader needs to know what success looks like.
- Include expected output only when it helps the reader recognize success or
  diagnose failure.
- Avoid hidden dependencies. If a command assumes a directory, branch, config,
  env var, or service account, state it before the command.

## Examples and code

- Make examples realistic and minimal. A small correct example beats a broad
  example with unsupported details.
- Explain what a code sample demonstrates before or after the sample.
- Keep placeholders visually obvious and define them near the sample.
- Verify commands against the repo or source when possible. If a command was
  not run, do not imply that it was tested.
- Prefer fenced code blocks with language tags. Use inline code for filenames,
  commands, flags, functions, fields, and literal values.

## Style defaults

- Use second person sparingly and directly when instructing a reader. "Run" is
  usually better than "You should run".
- Avoid hype, apologies, filler, and self-referential setup. Cut openings such
  as "Let's dive in," "In this comprehensive guide," "It is important to note
  that," "We'll explore," "I'll walk you through," and "This document aims to."
  Start with the subject, task, decision, or constraint instead.
- Avoid excessive claims such as "simple", "easy", "just", "obviously", or
  "seamless" unless the source proves the claim and the word helps the reader.
- Use inclusive language. Avoid idioms, colloquialisms, culture-specific
  examples, seasonal references, and humor that may be hard to translate.
- Use US English unless repo or product style requires another variant.
- Prefer simple verbs. Avoid phrasal verbs when a single precise verb works.
- Put conditions before instructions when the condition changes what the reader
  should do.
- Avoid directional language such as "above", "below", "left", or "right" when
  referring to locations in a document or UI.
- Prefer present tense and timeless phrasing for durable docs. Use dated
  phrasing only when the date is part of the fact.

## Editing pass

For a rewrite, preserve the document's technical contract first:

1. Identify claims, caveats, examples, commands, and links that must remain
   accurate.
2. Reorganize around the reader's task or concept.
3. Cut repetition, unsupported claims, and meta-commentary.
4. Tighten sentences and headings.
5. Re-check that no required technical detail was dropped.

## Rewrite examples

Use examples like these to turn vague cleanup advice into concrete edits:

| Avoid | Use Instead |
|---|---|
| "Let's dive into how the sync process works." | "The sync process copies config sources into local tool directories." |
| "In this comprehensive guide, we'll explore the release workflow." | "This runbook describes the release workflow." |
| "It is important to note that the cache is generated." | "The cache is generated." |
| "You can simply run the validation command." | "Run the validation command." |
| "This document aims to help contributors understand routing." | "This document explains routing for contributors." |
