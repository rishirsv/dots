# Prompt Guidance

Use this reference when the advisor request needs careful prompt shaping, such as
plan critique, architecture review, implementation strategy, current-source
checks, or adversarial review.

## Start From The Decision

Write the prompt around the choice the primary agent needs to make next. Make
the current hypothesis, alternatives, and change-your-mind evidence clear when
they matter. Avoid a broad review request when a sharper decision would produce
better counsel.

For a plan review, the useful material is usually:

- what should be decided before implementation
- what the current plan assumes
- what evidence would change the recommendation
- which files or docs anchor the plan
- which local checks the primary agent can run before adopting advice

For a current-source or research advisor prompt, add:

- the source quality bar
- how recent the evidence needs to be
- what to do when sources disagree
- when to stop looking and return a bounded answer

For a simplification or hard-cut pass, add:

- what old shape should be removed
- what compatibility work is intentionally out of scope
- what would count as old architecture in disguise
- the smallest safer version of the change

## Choose Structure For The Task

Let the request decide the shape. A short paragraph plus bullets is often better
than formal sections. Markdown headings help when the advisor needs to scan a
larger decision, compare alternatives, or return a patchable plan. XML-like
blocks are useful only when boundaries would otherwise blur, such as separating
a seed plan from critique rules or source excerpts from instructions.

Use names that fit the actual work, or use no headers when prose is clearer.

## Include The Useful Ingredients

Most strong advisor prompts include some subset of:

- advisory stance and grounding expectation
- the concrete decision or missing-proof question
- the exact critique, plan, or answer needed
- a reasoned map of attached files, excerpts, logs, or sources
- constraints and non-goals that change the answer
- missing-context behavior
- desired level of detail
- local checks the primary agent can run before trusting the answer

Only include an ingredient when it changes the likely answer.

## Context Map

Explain why each attached item matters. Prefer role-like reasons over mechanical
glob matches:

- target artifact to critique
- source of truth for architecture or behavior
- validation surface
- product, privacy, compatibility, or scope constraint
- risk context such as callers, migrations, dirty changes, or old behavior

For large bundles, mark the few files the advisor should read first. Supporting
files can be there for evidence without being first-pass reading.

## Output Request

Ask for the answer shape the primary agent can use immediately. Depending on the
task, that may be a recommendation, strongest objections, specific plan edits,
missing decisions, safer simplification, verification checklist, or a concise
go/no-go. Do not ask for proof; ask for advice grounded enough that the primary
agent can verify it locally.

Keep the main prose readable: mention symbols, filenames, or short artifact
names in the body, and put exact paths, line ranges, and source URLs in a final
`Sources` or `Evidence Notes` section. Do not use inline `path:line` citations
inside paragraphs unless the task explicitly asks for line-level annotation.

## Incomplete Context

Tell the advisor what to do when the package is incomplete. Usually the best
behavior is to name the smallest missing context that would change the answer,
while still giving a bounded recommendation when the available evidence is
enough.
