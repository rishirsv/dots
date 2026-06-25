# Style Guide

Use this reference before generating, updating, testing, or reporting a reusable
writing style guide.

This is the canonical reference for Drafts style work. It covers evidence
classes, evidence levels, repeated-choice extraction, runtime guide shape,
testing, corrections, review handoff, and privacy limits. Do not split
stylometric evidence into a separate runtime reference; stylometry is the
evidence method inside style-guide creation and review.

## What A Style Guide Is

A style guide is a durable, readable voice manual. It should help `compose`
produce better prose, help `writing-review` check voice fit, and help the user
inspect what the system thinks their writing style is.

The guide body should be generous where generosity changes output: voice
tensions, structure, sentence-level preferences, signature moves, audience
modes, examples, anti-patterns, and a revision checklist. It should not read
like a schema export, scoring table, or settings form.

The core principle is simple: style is a set of repeated choices that change
output. Capture the choices that a future draft can actually use, then test
whether they improve the writing without turning the result into parody.

Runtime style guides must be standalone, fully encapsulated voice manuals. A
future writer should be able to use `style.md` without opening reference records,
source samples, extraction evidence, or the documents that originally inspired
the guide. Put provenance, source caveats, rejected evidence, sample
inventories, and comparison details in `style_reference` records or other
explicitly defined non-runtime evidence, not in the runtime guide. A runtime
guide should not treat style references as content sources; it should describe
voice choices only.

## Fast Path

Use the smallest part of this reference that fits the current job:

- `writing-voice`: use Evidence Classes, Evidence Levels, Guide Initiation,
  Mapping A Larger Corpus, Standalone Runtime Guide Contract, Writing The
  Style Guide, Example Density And Formats, Guide Test, and Corrections.
- `compose`: use the selected guide's evidence level, use boundary, relevant
  modes, targeted examples, anti-patterns, and revision checklist before
  drafting or rewriting.
- `writing-review`: use Evidence Levels, Repeated-Choice Patterns,
  Anti-Patterns And Fixes, Example Density And Formats, Guide Test, and
  Corrections to judge whether the draft matches the selected guide.
- `state` or sync work: use Where Guides Live, Keep The Surfaces Separate, Tiny
  Frontmatter, and Privacy And Limits.

Keep three surfaces distinct:

- `style.md`: the runtime voice manual the model reads while writing.
- `style-library.json`: the minimal lookup record used to find styles.
- `references/`: optional accepted `style_reference` records for preserved
  samples, corrections, caveats, and stylometric evidence. Do not create generic
  auxiliary files or aggregate maintenance files unless the product model
  explicitly defines them.

## Keep The Surfaces Separate

Keep these concepts separate:

- `style_reference`: sample or correction attached to one named style.
- `workspace_sample`: workspace-level voice/context evidence that can inform
  style selection but is not a named style reference.
- `style_guide`: `style.md`, generated or updated from selected references and
  user corrections.
- `stylometric_evidence`: observed repeated choices that support a guide,
  captured in the relevant `style_reference` record or promoted into the guide
  when a pattern directly changes drafting.
- `writing_rules`: durable wording policies, not voice evidence.
- `knowledge` and draft context: factual/source context, not style evidence.

If the user provides text or files and does not say where they belong, ask only
when the choice changes persistence or runtime behavior. Never silently save
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

The shipped `default` style is the read-only fallback at `styles/default.md`. If
the user customizes `default`, create or update
`<style-library-root>/default/style.md`.

When a persistent user style library exists, create or update
`style-library.json` in the style library root so the user can inspect, back up,
sync, import, and export styles without reading every `style.md` file.

## Building Or Updating A Guide

1. Resolve the target style ID and the target channel or channel family.
2. Classify the material as personal evidence, correction evidence,
   aspirational examples, channel context, Knowledge, or noise.
3. Assign a style evidence level: Level 0, Level 1, Level 2, or Level 3.
4. If the level is 0, do not create a reusable personal guide. Ask for evidence
   or keep the result as session-only guidance.
5. Prefer one guide per channel family. Put relationship, audience, and task
   differences inside that guide as modes.
6. Create a separate guide only when a channel or audience has a materially
   different voice that would make the shared guide confusing.
7. Confirm durable guide work when no user style library exists. For chat-only
   style reads, do not create or update durable style files.
8. Load existing `style.md`, accepted reference records, and user corrections.
9. Extract authorship, channel, audience, relationship, thread context, intent,
   and cleaned user-authored text before deciding what guide the material can
   support.
10. For large or mixed corpora, build a corpus map in working context before
    generating prose. Preserve it only inside accepted reference records or
    another explicitly defined evidence surface.
11. Check sample quality before guide generation.
12. Extract repeated choices using the stylometric pattern families: voice
    tensions, structure, sentence shape, function words and pronouns,
    punctuation and casing, abstraction level, openers and transitions,
    signature moves, anti-patterns, and channel layout.
13. Generate or update the guide only from accepted references and scoped
    corrections.
14. Run a guide test when feasible.
15. Write `style.md` as a standalone voice manual, not a field form, evidence
    report, or comparison to the source material.
16. Update `style-library.json` only with lookup fields.
17. After the guide or update, briefly say what changed, what evidence was used,
    and what should not be over-trusted.

## Evidence Classes

Before using a sample, decide whether it is actually useful voice evidence.
Record detailed sample notes in the accepted `style_reference` record when the
user wants durable evidence preserved. Do not put them in the runtime style guide
unless the caveat changes drafting behavior.

Classify each source:

- `personal_evidence`: user-authored outgoing writing.
- `correction_evidence`: user correction, preference, or rejection of output.
- `aspirational_example`: writing the user admires but did not write.
- `channel_context`: format conventions that explain the destination.
- `knowledge`: factual source material, not style evidence.
- `noise`: quoted text, signatures, legal footers, UI text, summaries, or mixed
  authorship.

Only `personal_evidence` and scoped `correction_evidence` can prove personal
voice. Aspirational examples can shape the target, but the guide must label
them as aspiration.

Check:

- Whether the text is user-authored outgoing writing.
- Whether the source is personal evidence, correction evidence, aspirational
  example, channel context, Knowledge, or noise.
- Channel and genre.
- Audience and relationship.
- Intent and stakes.
- Cleaned word count.
- Duplicate or near-duplicate risk.
- Boilerplate, quoted text, signatures, footers, navigation, or UI noise.
- Topic vocabulary that should not be copied unless relevant.
- Channel conventions that should not be mistaken for stable voice.
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

## Evidence Levels

Assign one evidence level before generating or updating a durable guide. The
level controls how much confidence the guide can claim and which sections are
required.

Evidence levels apply to personal or aspirational style guides. The shipped
`default` style is a special non-personal style category, not Level 0, Level 1,
Level 2, or Level 3. It should say `Source: shipped fallback` and should not
claim personal evidence.

### Level 0: No Usable Style Evidence

Use when there are no user-authored samples, no trusted corrections, and no
clear aspirational examples.

Allowed output:

- Non-personalized humanize.
- Session-only tone notes.
- A request for samples or example reactions.

Do not create a reusable personal style guide at this level.

### Level 1: Starter Guide

Use when evidence is thin but usable: a few user-authored samples, a short
current draft plus corrections, or aspirational examples the user explicitly
marks as a target rather than proof of their current voice.

Required guide sections:

- Use boundary and evidence level.
- Voice and tone tensions.
- Structure.
- Sentence-level preferences.
- Signature moves.
- Anti-patterns or blacklist.
- A few targeted examples.
- Miss or contrast examples only for high-risk recurring failures.
- Revision checklist.
- Limits and what not to over-trust.

Keep claims modest. Say when a guide is based on aspiration, a narrow channel,
or a small sample set.

### Level 2: Working Guide

Use when there are enough user-authored samples or corrections to see repeated
patterns across a channel family.

Add:

- Corpus map with channel, audience, relationship, intent, register, and stakes,
  kept in working context or relevant reference records unless the product model
  explicitly defines an aggregate evidence artifact.
- Named structural templates or arcs.
- Pattern inventory captured in relevant reference records or promoted into
  `style.md` as drafting rules.
- Stronger example set using varied formats such as example/why, prefer/avoid,
  pattern/fix, or miss/fix.
- Blacklist entries with pattern, why it fails, and preferred fix.
- Holdout test when enough samples exist, recorded in the relevant reference
  record or working context unless it changes how the guide should be used.

This is the default target for high-quality reusable writing style.

### Level 3: Compound System

Use when a guide has repeated use, corrections, and review history across
meaningfully different tasks or channels.

Add:

- Correction ledger that tracks recurring misses and guide changes.
- Style-review checklist reused by `writing-review`.
- Drift notes when recent corrections conflict with older samples.
- Channel-specific modes that share one stable voice where possible.
- Periodic guide refresh from accepted corrections.

Do not create a Level 3 guide from raw volume alone. It needs evidence of use,
review, and correction.

## Guide Initiation

When starting a style guide:

1. Ask for the intended channel or channel family.
2. Ask for samples, corrections, or aspirational examples.
3. If evidence is thin, interview one question at a time and ask the user to
   react to short alternatives instead of making them fill a form.
4. Assign an evidence level.
5. Build a corpus map for mixed or large evidence.
6. Extract repeated choices that will change drafting.
7. Draft the guide at the appropriate level.
8. Run a guide test when feasible.
9. Record limits, rejected evidence, and sample caveats in reference records
   or current working context unless they change how the runtime guide should be
   used.

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
relationships, channels, or stakes.

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
- Stakes: low-friction coordination, high-stakes client work, public argument,
  internal decision, coaching, repair, or escalation.

Prefer a single channel guide with modes when the voice is recognizably the
same. Split only when the modes start contradicting each other. For example,
email can usually hold client, peer, delegation, and document-comment modes in
one guide; iMessage may still need separate guides if intimate, friend, and
work chat evidence behaves very differently.

Before creating durable guides from a corpus map, show the proposed channel
guides, modes, evidence strength, and clusters that are too thin to use.

## Standalone Runtime Guide Contract

Write every runtime `style.md` so it can travel alone. It should contain the
voice instructions, examples, modes, anti-patterns, and revision checks needed
to draft or review in that style without reading any extraction notes or source
files.

Use the runtime guide to say:

- What the style is for.
- How it earns trust.
- What structure, cadence, examples, vocabulary, and rhetorical moves to use.
- What to avoid and what to do instead.
- How to keep current-task context from becoming a voice rule when that boundary
  matters.
- How much to trust the guide when the evidence is thin.

Do not use the runtime guide to say:

- Which author, publication, sample set, or source document it resembles.
- That the style is "not like" another writer, house style, or publication.
- Which references were accepted, rejected, cleaned, held out, or downweighted.
- Which phrases came from the samples.
- Which extraction steps, corpus counts, hashes, sync paths, or maintenance
  decisions produced the guide.
- That topical vocabulary from the source is part of the voice unless the topic
  is the current topic.

If a caveat is necessary for writing behavior, phrase it as a direct rule:
"Use current-task context as content, not voice." Do not frame it as provenance
or comparison: "The samples came from..." or "This is not like..."

## Writing The Style Guide

Write `style.md` as a useful voice manual. It can be detailed, but the detail
must be prose and examples that improve writing.

Use this spine for most guides. Scale detail by evidence level:

1. Minimal frontmatter: `style_id` and `channel`.
2. Title.
3. Use boundary and evidence level for user or aspirational guides; use
   `Source: shipped fallback` for the non-personal default style.
4. Voice and tone: tensions and boundaries, not just adjectives.
5. Structure: openings, argument order, examples, transitions, and endings.
6. Sentence-level preferences: sentence shape, paragraph cadence, punctuation,
   pronouns, function words, abstraction level, and transition habits when
   evidence supports them.
7. Signature moves: recurring rhetorical moves that produce the target effect.
8. Anti-patterns and fixes: what to avoid and what to do instead.
9. Example set: short invented or redacted examples tied to the highest-leverage
   patterns.
10. Misses or contrasts only where they teach a recurring failure; use
    miss/fix, prefer/avoid, pattern/fix, or before/after instead of defaulting
    to repeated contrast pairs.
11. Modes: audience, relationship, or task variants inside the channel.
12. Revision checklist.
13. Notes or limits only when they change how the guide should be used.

Do not include model-control grids, generated timestamps, hashes, counts, or
machine routing fields in the guide body. Keep lookup keys, sync roots, alias
metadata, and reference-record evidence outside `style.md` unless a piece of
information directly helps the model write.

Do not mention underlying references, admired writers, publications, extraction
notes, or source documents in the runtime guide. If current-task context risks
being mistaken for voice, keep the boundary positive: current-task context
supplies content; the guide supplies voice.

## Example Density And Formats

Use examples to teach repeatable choices, not to pad every section. A runtime
guide should usually contain a small number of examples chosen for the patterns
most likely to change output.

Choose the example format by job:

- `Example / Why it works`: for a positive move worth copying in spirit.
- `Prefer / Avoid`: for sentence-level choices, vocabulary, transitions, and
  structure.
- `Pattern / Fix`: for anti-patterns and blacklists.
- `Miss / Why it fails / Fix`: for a recurring failure the model is likely to
  repeat.
- `Before / After`: for a concrete rewrite pattern, using invented or redacted
  text unless the user asked to use real source material.
- Direct contrast pairs: only when side-by-side comparison teaches one
  repeatable distinction better than prose would.

Scale examples by evidence level:

- Level 1: one to three examples, mostly positive, plus one high-risk miss if
  needed.
- Level 2: three to six targeted examples across the strongest patterns and
  highest-risk misses.
- Level 3: keep runtime examples compact; move large banks, holdout notes, and
  correction history to reference records or another explicitly defined
  non-runtime evidence surface.

Do not require every mode or signature move to include an example. If the prose
instruction is already clear, leave it alone.

## Tiny Frontmatter

Runtime guide frontmatter should stay tiny:

```markdown
---
style_id: <style-id>
channel: <channel-family>
---
```

Do not add lifecycle fields. Do not add model settings, source hashes,
generated timestamps, counts, aliases, or sync details to guide frontmatter.

## Guide Template

Use this template for `style.md`:

```markdown
---
style_id: <style-id>
channel: <channel-family>
---

# <Style Name>

Use this guide for <channel and jobs>. Evidence level: Level <1, 2, or 3>
(<starter, working, or compound>). The through-line is <one sentence naming the
stable writing effect>.

For the shipped non-personal fallback style, use:

Use this style when no user guide is a better fit. Source: shipped fallback.
This is not a personal voice guide.

## Voice And Tone

<Name the tensions and boundaries: plainspoken but not sloppy, rigorous but not
academic, warm but not sentimental, concise but not clipped, or whatever the
evidence supports. Explain how the writing earns trust.>

## Structure

<Explain openings, paragraph movement, argument order, examples, sections,
transitions, endings, and when structure helps or hurts.>

## Sentence-Level Preferences

<Explain sentence shape, paragraph cadence, punctuation, pronouns, function
words, abstraction level, transitions, and repeated opener patterns that change
the output.>

## Signature Moves

<Name reusable moves, such as diagnosis, example-to-principle,
friction-to-fix, objection handling, repair, escalation, or ending with a
reusable principle.>

## Anti-Patterns And Fixes

- Pattern: <bad habit>
  Fix: <what to do instead>

## Examples

Example: "<short invented or redacted example>"
Why it works: <observable reason>

Prefer: "<sentence, structure, transition, or move to use>"
Avoid: "<nearby miss to avoid>"

## Misses And Fixes

Miss: "<short counterexample>"
Why it fails: <observable reason>
Fix: "<better version>"

## Modes

### <Audience Or Task Mode>

<Explain what changes and what stays stable.>

Example: "<short example only if it teaches the mode>"
Watch for: <mode-specific miss or overuse pattern>

### <Second Mode>

...

## Revision Checklist

- <Concrete check tied to this guide.>

## Notes And Limits

- Do not invent facts, commitments, approvals, availability, or source claims.
- Do not preserve typos, source noise, or rushed-message artifacts as style.
- Use current-task context as content, not voice.
- Do not copy topic vocabulary as voice unless the topic is relevant.
- Do not imitate one-off habits that conflict with the stable voice.
```

## Fully Worked Style Guide Example

Use this as a shape example, not as a default voice.

```markdown
---
style_id: founder-operator-blog
channel: long-form
---

# Founder Operator Blog

Use this guide for practical founder/operator essays, newsletters, and public
posts. Evidence level: Level 2 (working). The through-line is hard-won
usefulness: lead with the claim, prove it with a concrete operating detail,
then name the principle.

## Voice And Tone

Write like an operator who learned the lesson the annoying way and is now
saving the reader a week. The voice is direct, specific, and slightly dry. It
trusts the reader and avoids motivational padding.

Warmth comes from accurate diagnosis, not reassurance. The prose can be blunt
about a failure because the next sentence usually gives the reader a cleaner
way to act.

Use `I` for firsthand lessons, `you` for the reader's decision, and `we` only
for shared traps. Keep claims proportional to the available facts.

## Structure

Open with the claim or the surprising operating failure. Do not start with a
generic trend summary.

Strong paragraphs often move claim -> concrete scene -> principle. Let short
verdicts land after longer explanation.

## Sentence-Level Preferences

Prefer clean, direct sentences over overly balanced ones. Use short verdicts
after longer setup. Let one concrete noun carry more weight than a cluster of
abstract terms.

Example: "The dashboard was not wrong because the data was bad. It was wrong
because every team had a different definition of active."

Avoid: "Dashboards can be challenging when teams are not aligned on metrics."

## Signature Moves

Diagnosis: name the visible failure, then the hidden cause.

Recommendation: state the boring fix plainly. The fix can be simple without
being easy.

Reader objection: name the objection before answering it. Do not pretend the
tradeoff is smaller than it is.

Principle: end with a sentence the reader can reuse without turning it into a
bumper sticker.

## Anti-Patterns And Fixes

- Pattern: generic trend setup.
  Fix: start with the operating failure or concrete scene.
- Pattern: motivational founder theater.
  Fix: keep the lesson practical and proportional.
- Pattern: startup vocabulary as decoration.
  Fix: use the concrete system, team, metric, or handoff instead.

## Examples

Example: "The launch failed because nobody owned the handoff."
Why it works: it names the visible problem and the hidden operating cause.

## Misses And Fixes

Miss: "Cross-functional collaboration is essential for startup success."
Why it fails: it swaps the real failure for a generic category.
Fix: "The handoff did not need another meeting. It needed an owner."

## Modes

### Blog Or Newsletter

Allow fuller setup and a developed example. Keep section openings claim-first.

### LinkedIn

Compress the example and end with a low-friction question or practical
takeaway. Do not turn the post into a numbered life lesson unless the requested
format needs that shape.

## Revision Checklist

- Does the opening name a concrete failure, claim, or scene?
- Does each abstraction earn its place with an example?
- Are the fixes plain without pretending they are easy?
- Does the ending preserve a useful principle rather than a slogan?

## Notes And Limits

- Do not add false personal anecdotes.
- Do not use startup vocabulary as style.
- Avoid generic consulting verbs such as leverage, optimize, enable, unlock.
- Avoid motivational founder theater unless explicitly requested.
```

## Style Reference Records

Use this shape for each accepted reference or correction when the user wants the
source evidence preserved. Store it as a Markdown file under
`references/<yyyymmdd>-<short-title>.md`:

```markdown
---
schema: drafts/v1
kind: style_reference
style_id: <style-id>
evidence_class: personal_evidence | correction_evidence | aspirational_example
channel: <channel-family>
accepted: true
created_at: <yyyy-mm-dd>
---

# <Sample Title>

## Cleaned Text

...

## Evidence Notes

- Evidence level impact:
- Source quality:
- Audience:
- Topic:
- Cleaning performed:
- Word count:
- Reusable voice evidence:
- Stylometric patterns:
- Channel conventions:
- Topic vocabulary to ignore:
- Warnings:
```

## Repeated-Choice Patterns

Record only patterns that will change drafting or review:

- Sentence and paragraph cadence.
- Punctuation habits.
- Repeated opener patterns.
- Pronouns, function words, hedges, qualifiers, and connective words.
- Sentence shape, word order, fragments, coordination, and parallelism.
- Capitalization, casing, and line-break habits.
- Abstraction level and concrete noun/verb preference.
- Section and paragraph shape.
- Channel layout habits.
- Recurring rhetorical moves.
- Hedging, compression, transitions, and claim qualification.
- Terms, phrases, transitions, or structures to prefer or avoid.

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
- Check whether the runtime guide mentions outside writers, publications,
  source documents, accepted/rejected references, or comparison language instead
  of standing alone as a voice manual.
- Check whether the revision checklist catches the guide's highest-risk misses.
- Record the result in the relevant reference record, or in a short
  `## Notes And Limits` section only when it changes use of the guide.

If testing is not feasible, say why in one short handoff sentence.

## Corrections

When the user corrects a style output, treat the correction as evidence:

- If the correction applies broadly, update `style.md`.
- If it applies only to a channel or artifact type, record that scope.
- If it contradicts earlier evidence, preserve both outside the runtime guide
  until more samples resolve the conflict.
- If it is a one-off preference for the current draft, keep it in draft or
  session instructions instead of the reusable style.
- If the same miss recurs, add it to a correction ledger and update the
  relevant anti-pattern, signature move, or revision checklist.

Do not silently convert every correction into a global style rule.

For Level 2 and Level 3 guides, keep repeated corrections in the relevant
correction-style reference record:

```markdown
## Correction Ledger

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
- Evidence level and any limit that should affect trust.
- Relevant mode or examples for the requested channel or audience.
- Warnings that should affect generation.
- Whether the guide should influence voice, structure, vocabulary, or content
  selection.

If no style is pinned in frontmatter, choose a concrete style ID from
user-global style guides plus the shipped `default` style when possible, write
that selected ID when durable frontmatter is created, and mention the choice
only when it affects trust or future edits. If no user guide is a clear fit,
choose `default` instead of claiming a hidden style ID.

## Privacy And Limits

A strong style guide can reveal private habits, relationships, professional
context, and communication patterns. Do not sync references or sample corpora
unless the user explicitly asks. Do not include sensitive sample text in
examples when an invented or redacted example can teach the same move.
