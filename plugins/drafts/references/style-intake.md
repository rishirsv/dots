# Style Intake

Use this reference before accepting samples or generating a style guide.

## Storage

User styles live in:

```text
${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/<style-id>/
  style.md
  references/
```

Do not edit installed plugin cache files. Do not store reusable user styles in a
workspace by default. A workspace-local `.drafts/styles/<style-id>/style.md`
override is allowed only when the user explicitly asks for a project-specific
style.

The shipped `default` style is the read-only fallback asset at
`assets/styles/default/style.md`. If the user customizes `default`, create or
update
`${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/default/style.md`.

## Intake Stages

1. Resolve the target style ID. If the user did not name a style and the target
   is ambiguous, ask which style to update.
2. Preserve useful raw source only when it is safe and relevant.
3. Extract useful authored text.
4. Clean boilerplate, navigation, comments, ads, cookie text, and unrelated UI.
5. Save the cleaned sample as a `style_reference` under the style's
   `references/` folder.
6. Run quality checks.
7. Record only observable style patterns that will change drafting or review.
8. Update sections in `style.md` in place, preserving user edits where possible.
9. Record warnings in the style guide body.

Style intake creates or updates:

```text
.../styles/<style-id>/style.md
.../styles/<style-id>/references/<sample-id>.md
```

Do not create a style lifecycle state machine. A style exists when its
`style.md` exists.

## Style Guide Template

Use this template for `style.md`:

```markdown
---
schema: drafts/v1
kind: style
id: <style-id>
title: <Style Name>
---

# <Style Name>

## Use When

Use this style when the draft or section frontmatter says `style: <style-id>`.

## Voice Rules

- ...

## Structure

- ...

## Cadence

- ...

## Vocabulary

Prefer:

- ...

Avoid:

- ...

## Evidence

- `references/001-sample.md`

## Warnings

- ...
```

Use this template for each reference:

```markdown
---
schema: drafts/v1
kind: style_reference
id: ref_001
title: <Sample Title>
style: <style-id>
---

# <Sample Title>

## Cleaned Text

...

## Notes

- Source quality:
- Channel:
- Warnings:
```

## Quality Checks

Check:

- Word count.
- Duplicate or near-duplicate content.
- Boilerplate and source noise.
- Author consistency.
- Mixed-author contamination.
- Topic narrowness.
- Distinctiveness.
- Permission or privacy concerns when relevant.

Do not mark styles as proposed or ready. Keep confidence, freshness, sample
quality, and warnings visible in the guide body.

## Observable Style Patterns

Measure only what helps the agent write or review better. Prefer simple,
explainable observations:

- Sentence and paragraph cadence.
- Repeated opener patterns.
- Punctuation habits.
- Channel layout habits.
- Recurring rhetorical moves.
- Terms, transitions, or structures to avoid.

## Topic And Genre Leakage

Watch for style guides that learn topic instead of voice. Separate:

- Stable voice features.
- Domain vocabulary.
- Channel conventions.
- One-off topic terms.
- Publication or brand requirements.

When samples come mostly from one topic, channel, or source type, lower
confidence and warn that the profile may be learning topical vocabulary instead
of voice.

Do not compare a short social post directly against a long essay without
channel context.

## Style Guide Content

A style guide should include:

- Summary.
- Voice rules.
- Structure tendencies.
- Vocabulary and rhythm notes.
- Avoidances.
- Example evidence.
- Observable style patterns.
- Confidence notes.
- Freshness notes.
- Warnings.

## Runtime Handoff

When handing style context to `writer`, include:

- Selected style ID or Auto Style decision.
- Selected concrete style ID.
- Relevant examples for the requested channel or task.
- Confidence.
- Warnings.
- Whether the style should influence voice only, structure, vocabulary, or
  content selection.

If no style is pinned in frontmatter, Auto Style chooses a concrete style ID
from user-global styles plus the shipped `default` style, writes that style ID
to new draft or section frontmatter when durable state is being created, and
reports the choice. Changing an existing `style` value requires user
confirmation.
