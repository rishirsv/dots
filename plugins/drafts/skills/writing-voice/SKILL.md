---
name: writing-voice
description: "Use for Drafts style work: creating personal or brand writing styles, reading samples, cleaning references, writing voice guides, checking guide limits, and explaining style use. Not for drafting content, standalone review, generic tone advice, or hidden style selection."
---

# Writing Voice

Build and maintain reusable personal, aspirational, and brand writing styles as
inspectable evidence, not as uninspectable style inference. Optimize for
accurate style extraction: a reusable style guide should be traceable to
accepted samples, official guidance when applicable, corrections, and tests.
Use this skill after `drafts` routes writing
style, sample, or voice work here, or when the user explicitly invokes
`writing-voice` for style guide setup or sample handling.

Read [style-guide.md](references/style-guide.md), starting with its Fast Path,
before accepting samples, generating a guide, describing evidence strength,
extracting repeated choices, testing a guide, or explaining style limits. Use
[style.md](templates/style.md) as the guide template and
[email-style.md](examples/email-style.md) and
[brand-style.md](examples/brand-style.md) as fully baked examples. Read
[state.md](../../references/state.md) before moving, syncing, exporting,
importing, or backing up a style library, and before mentioning style storage,
lookup, automatic style selection, or state changes.

## Building A Style

1. Create or select a user-global `style`.
2. Classify incoming material as style reference, workspace sample, Knowledge,
   draft context, or session-only context.
3. Decide the style kind: personal, aspirational, brand, or hybrid.
4. Classify each source as personal evidence, correction evidence,
   aspirational example, brand voice guidance, editorial convention,
   terminology or entity rule, channel context, Knowledge, or noise. Do not
   treat admired writing as proof of the user's current voice.
5. For brand guides, separate voice principles, message architecture, editorial
   mechanics, terminology, and claims rules before writing the guide.
6. For user-authored samples, extract authorship, channel, audience,
   relationship, thread context, intent, and cleaned text before deciding what
   guide the material can support.
7. For brand material, extract scope, locale, audience, source authority,
   voice principles, editorial conventions, terminology, entity rules, and
   claims rules before deciding what guide the material can support.
8. Describe evidence strength in plain language. Official brand guidance can be
   authoritative within its stated scope, but reviewed correction history still
   requires actual use and review.
9. If evidence is thin, interview one question at a time and ask the user to
   react to short alternatives for tone, structure, sentence rhythm, openings,
   anti-patterns, and examples.
10. For large or multi-context corpora, map the source set in working context.
   Prefer one guide per channel family, with relationship and task differences
   expressed as modes. Split only when the modes contradict each other.
11. Ingest accepted style samples as self-contained reference records under that
   style's `references/` directory for reusable styles.
12. Preserve evidence notes inside the relevant reference record. Do not create
   generic auxiliary files, evidence audits, extraction ledgers, source maps, or
   parallel maintenance summaries.
13. Run quality checks for length, duplication, boilerplate, author consistency,
   source noise, distinctiveness, channel coverage, relationship coverage, and
   contamination.
14. Extract repeated choices across voice tensions, message architecture,
   structure, sentence-level preferences, punctuation semantics, editorial
   conventions, language and terms, claims behavior, signature moves,
   anti-patterns, examples, and revision checks.
15. Generate or update `style.md` from accepted references and scoped user
    corrections.
16. Keep `style.md` as a standalone, fully encapsulated style manual: voice and
   tone, message architecture, structure, sentence-level preferences, editorial
   conventions where they matter, language and claims rules where they matter,
   signature moves, anti-patterns and fixes, targeted examples, miss/fix
   examples, modes, revision checklist, and limits. Do not require the guide to
   be read with notes, samples, source history, or extraction evidence. This is
   the default guide shape, not a schema: omit, merge, or add sections when the
   evidence and channel make that the clearer style manual.
17. Test the guide when feasible. Record caveats, holdout results, or correction
   history in the relevant reference record or current session context,
   unless the finding changes writing behavior and should be promoted into
   `style.md`.
18. Update the style library registry when persistent style state exists.
19. Surface warnings when a guide is weak, noisy, duplicated, too
   small, mixed-author, or only inferred through automatic selection.

## Moving Style Guides Between Machines

Use `DRAFTS_STYLE_HOME` as the narrow sync override for reusable styles when the
user wants the same style library across machines. Do not recommend syncing all
of `CODEX_HOME` for style guides.

Default to syncing `style.md`, `style-library.json`, and selected
`references/`. Do not move unrelated sample corpora or maintenance material as
part of ordinary guide sync.

For import or sync conflicts, keep both style versions unless the user chooses
an overwrite. Do not merge style guides automatically.

## Observable Patterns

Use measurements as supporting evidence, not as a new style object or scoring
system. The goal is to make the style guide less impressionistic.

Record only patterns that will change drafting or review:

- Voice tensions and boundaries.
- Sentence and paragraph cadence.
- Punctuation density.
- Punctuation semantics: what commas, periods, colons, semicolons, dashes,
  parentheses, questions, quotes, slashes, and exclamation marks do in the
  target style.
- Repeated opener patterns.
- Pronoun, function-word, hedge, qualifier, and connector habits.
- Sentence shape, fragments, parallelism, word order, and abstraction level.
- Channel layout habits.
- Brand voice principles and message architecture.
- Editorial conventions, terminology, entity references, and claims strength.
- Audience and relationship shifts.
- Recurring rhetorical moves.
- Terms, transitions, blacklist patterns, or structures to avoid.

If samples are all from one topic, channel, or source type, warn that topic or
format may be leaking into the guide.

If samples contain separable contexts such as close friend chat, client email,
peer collaboration, or coaching a junior teammate, first try to model the
difference as a mode inside the channel guide. Propose a separate guide only
when a mode would make the shared guide confusing. If a cluster is thin, say so
instead of inventing a confident mode.

## Choosing A Style

Automatic style selection chooses a concrete style ID. It never writes an
`auto` placeholder as the style value.

For a new draft or section with no pinned style, choose from user-global styles
plus the shipped `default` style. Pick the guide that best matches the content,
channel, audience, relationship, and user request. If no user guide is a clear
fit, use `style: default`.

Workspace-local styles are considered only when the user explicitly asks to use
or consider project-specific style overrides. Changing an existing style value
requires user confirmation.

Keep the selected style, one-line reason, and useful alternatives available for
handoff. Mention them only when they affect trust or future edits.

## What Makes A Guide Useful

A useful style guide should contain:

- A compact voice thesis and plain-language note on what supports the guide.
- The style kind: personal, aspirational, brand, or hybrid.
- Voice and tone tensions: how the writing earns trust, shows warmth, handles
  uncertainty, and carries authority.
- Voice principles for brand or institutional guides, with the behavior that
  makes each principle visible.
- Message architecture: the repeatable reasoning or argument pattern behind the
  prose.
- Structure: openings, paragraph movement, argument order, lists, signoffs,
  endings, and when structure helps.
- Sentence-level preferences: cadence, punctuation, pronouns, function words,
  abstraction level, transitions, and opener patterns when supported.
- Punctuation semantics: how specific marks shape cadence, emphasis, trust,
  qualification, and reader effort.
- Editorial conventions that visibly affect mimicry, such as spelling, casing,
  numbers, punctuation, abbreviations, bullets, or headings.
- Language, terminology, entity, and claims rules that affect what the writer
  may say and how strongly they may say it.
- Signature moves for the channel, such as requests, follow-ups,
  recommendations, critiques, updates, repairs, contrasts, or escalations.
- Anti-patterns with fixes.
- Modes for audience, relationship, or task differences inside the channel.
- Targeted examples grounded in accepted references, using miss/fix or
  prefer/avoid only when contrast teaches a recurring risk.
- A revision checklist that downstream drafting and review can reuse.
- Guardrails: what not to imitate, invent, overfit, or carry across contexts.
- Notes or limits only when they change how the guide should be used.

If the guide is based on insufficient evidence, say so instead of hiding it. If
the evidence appears mixed-author or noisy, ask before generating a reusable
guide or keep the result as session-only guidance.

Do not frame a style guide by contrast to an outside writer, publication, house
style, sample set, or underlying source. Convert any necessary caveat into a
positive drafting rule. For example: "Use current-task context as content, not
voice."

Inline examples make the guide usable at drafting time. Prefer representative
examples grounded in accepted references. Use synthetic examples only after the
evidence has been established, and label them as synthetic when that distinction
matters.

Do not default every section to a contrast pair. Use the lightest example format
that teaches the move: example/why, prefer/avoid, pattern/fix, miss/fix, or
before/after. Direct side-by-side contrasts are for rare cases where the
distinction would otherwise stay fuzzy.

Write the guide as a compact but complete voice manual, not a filled form.
Prefer outcome-first guidance: define the writing effect, the observable move,
and the example that teaches it. Avoid process instructions unless the process
changes the final writing.

## What The User Sees

Lead with the useful style result: the new guide, the changed section, or the
decision about whether the evidence is strong enough to become a reusable
style.

After that, add only the notes the user needs to trust or use the guide:

- Which samples were accepted, rejected, or warned on.
- Observable patterns that will change drafting.
- Limits, caveats, contamination warnings, or mixed-author risks.
- Registry, sync, export, or import changes when those actually happened.
- The short handoff `compose` needs to use the guide well.

Do not turn style work into a category dump. Evidence and caveats matter here,
but they should read like practical guidance for future writing.
