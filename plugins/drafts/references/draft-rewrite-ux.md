# Draft And Rewrite UX

Use this reference when deciding how Drafts should behave at the front door.
The default shape follows Spiral's writing UX: context first for new writing,
direct transformation for existing text.

## Lanes

Drafts has two user-facing lanes behind the `$drafts` front door:

| Lane | Use When | Default Behavior |
| --- | --- | --- |
| `Draft` | The user wants to write, draft, compose, continue, or build a recurring writing project. | Gather context, shape an outline, offer three rhetorical directions, then continue from the selected working draft. |
| `Rewrite` | The user wants to rewrite, humanize, personalize, tighten, polish, or make existing text sound more like them. | Operate directly on the provided or selected text, returning one best version by default. |

Do not expose a separate `Studio` lane. Use plain language: `Draft` and
`Rewrite`.

## Standing Pad

For recurring writing projects, the visible pad has only three sections:

```text
Ideas bank
Outline
Draft
```

Keep style, archive context, source packs, questions, decisions, versions, and
reviews out of the visible pad by default. They may exist as internal state or
side records, but the writer-facing surface stays simple.

When messy notes, links, or voice transcripts arrive:

1. Preserve raw fragments or rough observations in `Ideas bank`.
2. Promote usable clusters, argument order, claims, examples, and missing
   connective tissue into `Outline`.
3. Mark inferred structure or assumptions plainly.
4. Do not turn ambiguous intent into polished certainty.

## Draft Lane

Use `Draft` for new or recurring writing. The default rhythm is:

```text
standing pad or rough intent
-> triage into Ideas bank / Outline
-> one high-leverage context question when needed
-> three rhetorical directions
-> selected working draft
-> editor-style revision loop
```

Ask questions based on the Spiral interview model. Start from these core
variables, adapting wording to the writing type:

- What is it about?
- Who is it for?
- What is the main argument?

For substantial or uncertain writing, the better first question is often about
the observation, frustration, or change in thinking that made the user want to
write it. Example shape:

```text
What's the observation or frustration that made you want to write this in the
first place?
```

Ask one high-leverage question at a time when the user is discovering the
argument. Use grouped brief questions only when the user asks for structured
intake, a report plan, or a formal brief.

Each answer should move the `Outline` forward as quickly as possible. Do not
create a visible `Brief` section. Internal `writing_brief` or
`document_contract` state may exist when durable state exists.

If the user says `draft anyway`, stop interviewing and create the smallest
bounded useful artifact, usually an outline, plan, or working draft. Preserve
unresolved fields as assumptions.

## Three Directions

When there is enough context for new writing, produce three draft options as
rhetorical directions, not quality tiers or channel variants.

Generate labels from the piece itself, such as:

- `Direct`
- `Narrative`
- `Contrarian`
- `Analytical`
- `Personal`
- `Executive`

The exact labels should explain the argument move. After the user picks a
direction, that option becomes the working draft. Continue with targeted
revision, merge requests, expansion, tightening, review, humanize, or channel
variant work from that selected draft.

Channel variants happen after the rhetorical direction is chosen unless the
user explicitly asks for channel options first.

## Rewrite Lane

Use `Rewrite` for existing text. This lane is fast by default:

1. Resolve the provided or selected text.
2. Identify the requested operation: rewrite, humanize, personalize, tighten,
   polish, shorten, expand, adapt, or make more direct.
3. Apply available style, channel, source, and rule context only when it is
   already attached or materially changes the result.
4. Return one best version by default.
5. Offer alternate rhetorical directions only when the source text supports
   materially different moves.

`Humanize` means restoring author intent and texture. It should remove obvious
AI tells while preserving meaning and genre, add specificity when supported,
and allow natural unevenness. It does not mean making every artifact casual.

Common AI tells to clean up:

- generic setup phrases
- symmetrical paragraph scaffolding
- over-explaining obvious stakes
- empty intensifiers and hype language
- corporate transitions
- claims without concrete detail

If the user asks to "sound like me" and no usable style guide or samples are
available, do a non-personalized humanize pass or ask for evidence. Do not
pretend to know the user's voice from the current prompt alone.

## Reporting

Keep reporting light while the user is writing. Name the lane, major
assumptions, selected style when relevant, and whether the result is durable or
chat-only. Do not interrupt the writing flow with full provenance unless the
user asks, sources are high-stakes, or durable state changed.
