# Style Guide Creation

Use this reference before `writing-voice` generates, updates, tests, or explains
a reusable writing style guide.

This is the `writing-voice` guide for style creation. It covers source quality,
evidence strength, repeated-choice extraction, standalone guide shape, testing,
corrections, and reference handling. Do not split stylometric evidence into a
separate reference; stylometry is the evidence method inside style-guide
creation and review.

## What A Style Guide Is

A style guide is a durable, readable voice manual. It should help `compose`
produce better prose, help `writing-review` check voice fit, and help the user
inspect what Drafts has learned about the target writing style.

The guide body should be generous where generosity changes output: voice
tensions, structure, sentence-level preferences, signature moves, audience
modes, examples, anti-patterns, and a revision checklist. It should not read
like a schema export, scoring table, or settings form.

The core principle is simple: style is a set of repeated choices that change
output. Capture the choices that a future draft can actually use, then test
whether they improve the writing without turning the result into parody.

Optimize for accuracy. A reusable style guide should preserve enough accepted
references, examples drawn from those references, official guidance when
available, and correction history to verify the claims it makes about a user's
voice or a brand style. Storage and sharing policy belongs to the surrounding
workspace or explicit user instruction, not to the style skill itself.

Style guides must be standalone, fully encapsulated voice manuals. A future
writer should be able to use `style.md` without opening reference records,
source samples, extraction evidence, or the documents that originally inspired
the guide. Put source text, source caveats, rejected evidence, sample
inventories, and comparison details in reference records, not in separate audit
files or ledgers. A style guide should not treat references as content sources;
it should describe voice choices only.

## Fast Path

Use the smallest part of this reference that fits the current job:

- Creating or updating a guide: use Source Quality, Style Kind, How Much To
  Trust The Guide, Guide Initiation, Mapping A Larger Corpus, Writing The Style
  Guide, and Example Density And Formats.
- Accepting samples: use Source Quality, Keep The Surfaces Separate, and Style
  Reference Records.
- Checking or refreshing a guide: use Guide Test, Corrections, and Accuracy
  Limits.
- Writing the final `style.md`: use `../templates/style.md` as the shape and
  `../examples/email-style.md` plus `../examples/brand-style.md` as fully baked
  examples.

Keep three surfaces distinct:

- `style.md`: the standalone voice manual used while writing.
- `style-library.json`: the minimal lookup record used to find styles.
- `references/`: accepted reference records for samples, corrections, caveats,
  and stylometric evidence. Do not create generic auxiliary files, aggregate
  maintenance files, evidence audits, extraction ledgers, or parallel source
  summaries.

## Keep The Surfaces Separate

Keep these concepts separate:

- Style reference: sample or correction attached to one named style.
- Workspace sample: workspace-level voice or context evidence that can inform
  style selection but is not a named style reference.
- Style guide: `style.md`, generated or updated from selected references and
  user corrections.
- Style evidence: observed repeated choices that support a guide, captured in
  the relevant reference record or promoted into the guide when a pattern
  directly changes drafting.
- Writing rules: durable wording policies, not voice evidence.
- Knowledge and draft context: factual or source context, not style evidence.

If the user provides text or files and does not say where they belong, ask only
when the choice changes persistence or writing behavior. Never silently save
workspace samples as style references or style references as Knowledge.

## Where Guides Live

User styles live in:

```text
<style-library-root>/<style-id>/
  style.md
  references/
```

`<style-library-root>` is `DRAFTS_STYLE_HOME` when set, otherwise
`${CODEX_HOME:-~/.codex}/skill-state/drafts/styles/`.

Do not edit installed plugin cache files. Do not store reusable user styles in a
workspace by default. A workspace-local `.drafts/styles/<style-id>/style.md`
override is allowed only when the user explicitly asks for a project-specific
style.

The shipped `default` style is the read-only general style at `styles/default.md`.
If the user customizes `default`, create or update
`<style-library-root>/default/style.md`.

When a persistent user style library exists, create or update
`style-library.json` in the style library root so the user can inspect, back up,
sync, import, and export styles without reading every `style.md` file.

## Building Or Updating A Guide

1. Resolve the target style ID and the target channel or channel family.
2. Decide the style kind: personal, aspirational, brand, or hybrid.
3. Classify the material as personal evidence, correction evidence,
   aspirational examples, brand voice guidance, editorial conventions,
   terminology or entity rules, channel context, Knowledge, or noise.
4. Describe evidence strength in plain language.
5. If there is no reusable voice basis for a personal or aspirational guide,
   ask for evidence or keep the result as session-only guidance.
6. Prefer one guide per channel family. Put relationship, audience, and task
   differences inside that guide as modes.
7. Create a separate guide only when a channel or audience has a materially
   different voice that would make the shared guide confusing.
8. Confirm durable guide work when no user style library exists. For chat-only
   style reads, do not create or update durable style files.
9. Load existing `style.md`, accepted reference records, and user corrections.
10. For user-authored samples, extract authorship, channel, audience,
    relationship, thread context, intent, and cleaned text before deciding what
    guide the material can support.
11. For brand or institutional material, separate voice principles, message
    architecture, editorial conventions, terminology, entity rules, and claims
    rules before deciding what the guide can support.
12. For large or mixed corpora, map the source set in working context before
    generating prose. Preserve durable evidence only inside accepted reference
    records.
13. Check sample quality before guide generation.
14. Extract repeated choices using the stylometric pattern families: voice
    tensions and principles, message architecture, structure, sentence shape,
    function words and pronouns, punctuation semantics, casing, abstraction
    level, openers and transitions, language and terms, claims behavior,
    signature moves, anti-patterns, and channel layout.
15. Generate or update the guide only from accepted references, official style
    guidance within its scope, and scoped corrections.
16. Run a guide test when feasible.
17. Write `style.md` as a standalone style manual, not a field form, evidence
    report, or comparison to the source material.
18. Update `style-library.json` only with lookup fields.
19. After the guide or update, briefly say what changed, what evidence was used,
    and what should not be over-trusted.

## Source Quality

Before using a sample, decide whether it is actually useful voice evidence.
For reusable style guides, record detailed sample notes in accepted
reference records by default. Do not put source notes in the style guide unless
the caveat changes drafting behavior.

Classify each source:

- `personal_evidence`: user-authored outgoing writing.
- `correction_evidence`: user correction, preference, or rejection of output.
- `aspirational_example`: writing the user admires but did not write.
- `brand_voice`: official or accepted organizational tone, voice, or brand
  guidance.
- `editorial_convention`: house style rules for spelling, casing, punctuation,
  numbers, dates, abbreviations, headings, bullets, or similar mechanics.
- `terminology_rule`: required, restricted, or entity-specific wording.
- `channel_context`: format conventions that explain the destination.
- `knowledge`: factual source material, not style evidence.
- `noise`: quoted text, signatures, legal footers, UI text, summaries, or mixed
  authorship.

Only `personal_evidence` and scoped `correction_evidence` can prove personal
voice. Aspirational examples can shape the target, but the guide must label
them as aspiration.

Official or accepted brand guidance can prove an institutional style within its
stated scope. It does not prove a user's personal voice. In hybrid guides, keep
the user's cadence and judgment separate from house rules, terminology, and
claims limits.

Check:

- Whether the text is user-authored outgoing writing.
- Whether the source is personal evidence, correction evidence, aspirational
  example, brand voice, editorial convention, terminology rule, channel
  context, Knowledge, or noise.
- Channel and genre.
- Audience and relationship.
- Intent and sensitivity.
- For official guidance, the scope, locale, audience, source authority, and
  date when those details affect writing behavior.
- Cleaned word count.
- Duplicate or near-duplicate risk.
- Boilerplate, quoted text, signatures, footers, navigation, or UI noise.
- Topic vocabulary that should not be copied unless relevant.
- Channel conventions that should not be mistaken for stable voice.
- Required terms, restricted terms, entity naming rules, and claims that require
  support.
- Close-copying risk when examples would be too near the source.

Reject, quarantine, or downweight samples that are too short, duplicate,
mixed-author, mostly boilerplate, mostly topical, generated by someone else, or
not representative of the user's own writing.

Use only user-authored outgoing text as primary voice evidence. Incoming
messages, quoted text, signatures, legal footers, news articles, and source
documents may explain context, but they are not voice evidence for the user's
style guide unless the user explicitly says they wrote them.

Aspirational examples are useful only as target direction. Label them as
aspirational and do not treat them as proof that the user already writes that
way.

For structured corpora such as message databases, email archives, Slack exports,
or CRM/email archives, use an extractor that preserves authorship, recipient,
thread, timestamp, and channel. Do not flatten the container into one raw text
blob.

## Style Kind

Assign the style kind before describing evidence strength:

- `personal`: the guide describes the user's own writing.
- `aspirational`: the guide describes a target style the user chose but did not
  author.
- `brand`: the guide describes an organizational or house style.
- `hybrid`: the guide combines a user's voice with brand, channel, or house
  rules.

For brand guides, treat accepted brand guidelines, editorial style guides,
terminology lists, and approved examples as primary sources for that
organization's style. Separate the layers:

- Voice principles: how the prose should sound.
- Message architecture: how the prose turns information into a point of view.
- Editorial conventions: surface rules such as spelling, punctuation, casing,
  numbers, abbreviations, bullets, and headings.
- Language and terms: required wording, restricted wording, entity names, and
  claims that need support.
- Channel patterns: how the style changes across articles, web copy, emails,
  reports, social posts, or other formats.

Do not collapse these into one tone paragraph. A brand can sound right and still
miss the house style if it uses the wrong terms, capitalization, numbers, or
claim strength.

## How Much To Trust The Guide

Describe support in plain language. Do not assign levels, scores, maturity
states, or lifecycle labels. The user should read a natural sentence such as
"supported by a few accepted samples," "supported by repeated patterns across
client emails," "supported by official brand guidance and approved examples,"
or "refined through repeated corrections."

If there are no user-authored samples, trusted corrections, official guidance,
or clear aspirational examples, do not create a reusable personal guide. Keep
the result as session-only tone guidance, ask for samples, or ask the user to
react to short alternatives.

When support is thin but direct, the guide can still be useful. Keep the claims
modest: name the channel, the narrow support, the voice and tone tensions,
structure, sentence-level preferences, signature moves, anti-patterns, a small
set of examples, and the most important limits. Do not claim close personal
mimicry from a small sample set.

When repeated patterns are visible, make the guide richer. Add named structural
templates or arcs, a pattern inventory in the relevant reference records or in
the guide when it changes drafting, stronger examples across high-use modes,
and blacklists with the reason and preferred fix. Multi-mode guides need at
least one concrete example for each high-use mode; if a mode lacks evidence,
mark it as thin or leave it out.

When the guide has been used and corrected, let those corrections shape the
guide. Track recurring misses in the relevant reference records, update the
style-review checklist, note drift when recent corrections conflict with older
samples, and refresh channel modes when repeated corrections show a real
difference.

For brand guides, accepted brand guidelines, editorial guides, terminology
lists, and approved examples can be authoritative within their stated scope.
That authority does not replace tested use: if the guide has not been used and
corrected, say that it is based on official guidance and still needs review in
real drafting tasks.

## Guide Initiation

When starting a style guide:

1. Ask for the intended channel or channel family.
2. Ask whether the target is personal, aspirational, brand, or hybrid.
3. Ask for samples, corrections, aspirational examples, official brand
   guidance, editorial conventions, terminology, or claims rules as appropriate.
4. If the target is brand or hybrid, identify which source layer is present:
   voice principles, message architecture, editorial mechanics, terms/entity
   rules, claims rules, channel examples, or approved examples.
5. If evidence is thin, interview one question at a time and ask the user to
   react to short alternatives instead of making them fill a form.
6. Describe evidence strength in one plain-language sentence.
7. Map the source set for mixed or large evidence.
8. Extract repeated choices that will change drafting.
9. Draft the guide at the appropriate depth.
10. Run a guide test when feasible.
11. Record limits, rejected evidence, and sample caveats in reference records
   unless they change how the style guide should be used.

Useful interview questions are concrete:

- Which opening sounds more like you, and why?
- Where does this example become too polished?
- Which sentence feels over-explained?
- Which transition would you never use?
- What kind of ending feels dead to you?
- When do you want warmth, and when does warmth become filler?
- What do you want the reader to feel trusted to figure out?

## Mapping A Larger Corpus

Large corpora must be mapped before guide generation. Do not collapse all of a
person's writing into one global voice when the evidence contains separable
relationships, channels, or pressure.

Build candidate modes or guides from:

- Channel: iMessage, email, Slack, long-form blog, newsletter, LinkedIn, X,
  sales email, client memo, internal memo, review note, or support reply.
- Audience and relationship: close friends, family, client, prospect,
  executive, manager, peer, junior teammate, public reader, community, or
  anonymous audience.
- Intent: joke, reassure, ask, sell, teach, critique, escalate, apologize,
  summarize, announce, persuade, update, or request a decision.
- Register: casual, intimate, polished, executive, instructional, editorial,
  social-native, terse, expansive, or ceremonial.
- Context: low-friction coordination, client work with real risk, public
  argument, internal decision, coaching, repair, or escalation.

Prefer a single channel guide with modes when the voice is recognizably the
same. Split only when the modes start contradicting each other. For example,
email can usually hold client, peer, delegation, and document-comment modes in
one guide; iMessage may still need separate guides if intimate, friend, and
work chat evidence behaves very differently.

Before creating durable guides from a large source set, show the proposed
channel guides, modes, evidence strength, and clusters that are too thin to use.

## Standalone Style Guide Contract

Write every `style.md` so it can travel alone. It should contain the
voice instructions, examples, modes, anti-patterns, and revision checks needed
to draft or review in that style without reading any extraction notes or source
files.

Use the style guide to say:

- What the style is for.
- How it earns trust.
- For brand guides, which voice principles, editorial conventions, terms, and
  claims rules change drafting.
- What structure, cadence, examples, vocabulary, and rhetorical moves to use.
- What to avoid and what to do instead.
- How to keep current-task context from becoming a voice rule when that boundary
  matters.
- How much to trust the guide when support is thin.

Do not use the style guide to say:

- Which author, publication, sample set, or source document it resembles.
- That the style is "not like" another writer, house style, or publication.
- Which references were accepted, rejected, cleaned, held out, or downweighted.
- Which phrases came from the samples.
- Which extraction steps, corpus counts, hashes, sync paths, or maintenance
  decisions produced the guide.
- That topical vocabulary from the source is part of the voice unless the topic
  is the current topic.

If a caveat is necessary for writing behavior, phrase it as a direct rule:
"Use current-task context as content, not voice." Do not narrate source
history, evidence handling, or comparisons inside `style.md`: "The samples came
from..." or "This is not like..."

## Writing The Style Guide

Write `style.md` as a useful voice manual. It can be detailed, but the detail
must be prose and examples that improve writing.

Use `../templates/style.md` as the reusable shape for `style.md`. Use
`../examples/email-style.md` as a fully baked example of a multi-mode email
guide, and `../examples/brand-style.md` as a fully baked example of a brand
guide. Scale detail to the available support and the risk of getting the style
wrong:

1. Minimal metadata: `style_id` and `channel`.
2. Title.
3. Use boundary and a plain-language support note for user, aspirational,
   brand, or hybrid guides; for the non-personal default style, say only that it
   is not a personal voice guide.
4. Style kind when it changes how the guide should be trusted or combined with
   other guidance.
5. Voice principles or voice and tone: tensions and boundaries, not just
   adjectives.
6. Message architecture when the evidence shows a repeatable reasoning pattern.
7. Structure: openings, argument order, examples, transitions, and endings.
8. Sentence-level preferences: sentence shape, paragraph cadence, punctuation,
   pronouns, function words, abstraction level, and transition habits when
   evidence supports them.
9. Punctuation and style semantics when specific marks affect cadence,
   emphasis, trust, or meaning.
10. Editorial conventions when house mechanics affect mimicry.
11. Language, terms, entity rules, and claims rules when they affect what the
    draft may say or how strongly it may say it.
12. Signature moves: recurring rhetorical moves that produce the target effect.
13. Anti-patterns and fixes: what to avoid and what to do instead.
14. Example set: short representative examples grounded in accepted references
    and tied to the highest-leverage patterns.
15. Misses or contrasts only where they teach a recurring failure; use
    miss/fix, prefer/avoid, pattern/fix, or before/after instead of defaulting
    to repeated contrast pairs.
16. Modes: audience, relationship, or task variants inside the channel.
17. Revision checklist.
18. Notes or limits only when they change how the guide should be used.

Do not include control grids, generated bookkeeping, counts, or routing fields in
the guide body. Keep lookup keys, sync roots, aliases, and reference-record
evidence outside `style.md` unless a piece of information directly helps the
writing.

Do not mention underlying references, admired writers, publications, extraction
notes, or source documents in the style guide. If current-task context risks
being mistaken for voice, keep the boundary positive: current-task context
supplies content; the guide supplies voice.

## Example Density And Formats

Use examples to teach repeatable choices, not to pad every section. A style
guide should usually contain a small number of examples chosen for the patterns
most likely to change output.

Choose the example format by job:

- `Example / Why it works`: for a positive move worth copying in spirit.
- `Prefer / Avoid`: for sentence-level choices, vocabulary, transitions, and
  structure.
- `Pattern / Fix`: for anti-patterns and blacklists.
- `Miss / Why it fails / Fix`: for a recurring failure the model is likely to
  repeat.
- `Before / After`: for a concrete rewrite pattern grounded in accepted
  references or corrections.
- Direct contrast pairs: only when side-by-side comparison teaches one
  repeatable distinction better than prose would.

Scale examples to the support and risk:

- Thin but direct support: one to three examples, mostly positive, plus one
  high-risk miss if needed.
- Repeated support: targeted examples across the strongest patterns, high-use
  modes, punctuation or mechanics rules, and highest-risk misses.
- Reviewed correction history: keep the guide examples compact and practical,
  but preserve larger example banks, holdout notes, and correction history in
  `references/`.

Do not require every signature move to include an example. Do require concrete
examples for high-use modes in multi-mode guides; if evidence is too thin, mark
the mode as thin or do not include it as durable guidance.

## Guide Metadata

Guide metadata should stay tiny:

```markdown
---
style_id: <style-id>
channel: <channel-family>
---
```

Do not add lifecycle fields. Do not add model settings, technical bookkeeping,
counts, aliases, or sync details to guide metadata.

## Style Reference Records

Use this shape for each accepted reference or correction for a reusable style.
Store it as a Markdown file under `references/<yyyymmdd>-<short-title>.md`.
These records are the durable evidence layer; do not create separate evidence
audits, extraction ledgers, source maps, or maintenance summaries.

```markdown
---
style_id: <style-id>
evidence: personal | correction | aspirational | brand_voice | editorial_convention | terminology_rule
channel: <channel-family>
---

# <Sample Title>

## Cleaned Text

...

## Evidence Notes

- How this supports the guide:
- Style kind:
- Source quality:
- Source scope or authority:
- Audience:
- Relationship:
- Intent:
- Mode:
- Topic:
- Cleaning performed:
- Word count:
- Reusable voice evidence:
- Stylometric patterns:
- Voice principles:
- Message architecture:
- Editorial conventions:
- Terms, entity, or claims rules:
- Representative examples to promote:
- Misses or fixes taught by this sample:
- Channel conventions:
- Topic vocabulary to ignore:
- Warnings:
```

## Repeated-Choice Patterns

Record only patterns that will change drafting or review:

- Sentence and paragraph cadence.
- Punctuation habits.
- Punctuation semantics and the meaning of specific marks.
- Repeated opener patterns.
- Pronouns, function words, hedges, qualifiers, and connective words.
- Sentence shape, word order, fragments, coordination, and parallelism.
- Capitalization, casing, and line-break habits.
- Abstraction level and concrete noun/verb preference.
- Section and paragraph shape.
- Channel layout habits.
- Brand voice principles and how they show up in prose.
- Message architecture or argument flow.
- Editorial mechanics that affect the visible style.
- Recurring rhetorical moves.
- Hedging, compression, transitions, and claim qualification.
- Terms, phrases, transitions, entity references, claim strengths, or
  structures to prefer or avoid.

For each important pattern, name the evidence behind it and the drafting
effect. Avoid style adjectives unless the guide also names the observable
behavior that creates that effect.

## Guide Test

When feasible, test the guide before normal reuse:

- Hold out at least one accepted reference or user correction when enough
  evidence exists.
- Draft a short test passage using the guide.
- Check whether the test passage matches observable patterns without copying
  sample phrases too closely.
- Check whether channel conventions, topic vocabulary, and source claims leaked
  into the voice guide.
- For brand or hybrid guides, check voice fit, editorial mechanics, terminology,
  entity references, and claims strength separately.
- Check whether the style guide mentions outside writers, publications,
  source documents, accepted/rejected references, or comparison language instead
  of standing alone as a voice manual.
- Check whether the revision checklist catches the guide's highest-risk misses.
- Record the result in the relevant reference record, or in `style.md` only when
  it changes how the guide should be used.

If testing is not feasible, say why in one short handoff sentence.

## Corrections

When the user corrects a style output, treat the correction as evidence:

- If the correction applies broadly, update `style.md`.
- If it applies only to a channel or artifact type, record that scope.
- If it contradicts earlier evidence, preserve both in the relevant reference
  records until more samples resolve the conflict.
- If it is a one-off preference for the current draft, keep it in draft or
  session instructions instead of the reusable style.
- If the same miss recurs, add it to a correction-style reference record and
  update the relevant anti-pattern, signature move, or revision checklist.

Do not silently convert every correction into a global style rule.

For guides with repeated use or recurring misses, keep corrections in the
relevant correction-style reference record:

```markdown
## Corrections

- Date:
  Context:
  Miss:
  User correction:
  Pattern family:
  Guide change:
  Applies to:
```

Promote a correction into `style.md` only when it is reusable. If it applies to
one artifact, keep it in draft or session context.

## Helping Compose Use The Style

When handing style context to `compose`, include:

- Selected style ID, or the decision to use `default`.
- One-line reason the guide fits the task.
- Support note and any limit that should affect trust.
- Relevant mode or examples for the requested channel or audience.
- Warnings that should affect generation.
- Whether the guide should influence voice, structure, vocabulary, or content
  selection.

If no style is pinned in saved metadata, choose a concrete style ID from
user-global style guides plus the shipped `default` style when possible, write
that selected ID when durable metadata is created, and mention the choice
only when it affects trust or future edits. If no user guide is a clear fit,
choose `default` instead of claiming a hidden style ID.

## Accuracy Limits

A strong style guide should be traceable to accepted references, user
corrections, or tested outputs. Do not promote an attractive pattern into
`style.md` unless it is supported by the reference set or the user explicitly
chooses it as aspirational.

Do not let source topics masquerade as voice. Topic vocabulary belongs in the
current task unless repeated references show it is a stable stylistic choice.
