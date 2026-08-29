# Technical writing guidance

Use this for technical artifacts that readers need to review, follow, or act
on. Do not combine it with `writing-style.md`; each artifact uses one writing
reference.

Write for a tired engineer who needs to understand the text on the first read.
Make the reader's next action or understanding obvious. Apply these defaults
only when repository or user-named guidance does not decide the point.

## Lead with the job

- State the purpose in the first screen.
- Put the conclusion or task before background.
- Write headings that describe the reader's task, artifact, or takeaway.
- Give each paragraph one idea and each procedure step one action.
- Put the key noun near the key verb. Prefer active voice and concrete verbs.
- Define necessary unfamiliar terms at first use; remove unnecessary jargon.
- Use lists or tables only when they make repeated information easier to scan.

## Write procedures

- State prerequisites and hidden dependencies before the affected action.
- Use numbers only when order matters.
- Include expected output when it proves success or diagnoses failure.
- Put a condition before an instruction when it changes the action.

## Examples and code

- Use the smallest realistic example that proves the point.
- Define obvious placeholders near the sample.
- Verify commands when possible; never imply an unrun command was tested.
- Use fenced code blocks with language tags and inline code for literals.

## Keep prose direct

- Start with the subject, task, decision, or constraint. Cut filler,
  self-reference, generic reassurance, and repeated conclusions.
- Prefer direct imperatives such as "Run" over "You should run."
- Remove unsupported ease or quality claims such as "simple," "obvious," and
  "seamless."
- Use present tense and timeless phrasing unless the date is part of the fact.
- Avoid idioms, culture-specific examples, and directional references when a
  label or heading is clearer.
- Use US English unless the repository or product specifies another variant.

## Remove ambiguity

- Call one thing by one name throughout the document. Use the codebase's real
  symbol, file, flag, command, or domain term instead of rotating synonyms.
- Make every `it`, `this`, and `which` point to one obvious noun. Repeat the
  noun when the reference could point to a clause or more than one thing.
- Put `only` and `not` next to the word they modify. State what `and` or `or`
  joins when readers could group the terms in more than one way.
- Break up dense noun clusters. Replace a phrase such as “plugin marketplace
  cache sync command” with a clause that names what the command syncs.
- Keep verbs and articles when removing them would create a second reading.
- Prefer globally recognizable, literal language. Remove idioms, colloquial
  expressions, and culture-specific metaphors that a non-native reader or an
  agent would need to interpret.

## Keep the rhythm human

Mix sentence lengths deliberately. Use a short sentence to land a point. Keep
a longer sentence when it carries one coherent idea with its condition or
consequence. Do not turn every sentence into the same clipped pattern while
trying to be concise.

For example, revise this:

> Configuration of the plugin marketplace cache sync command is performed by
> `sync-plugins.sh`. It should only be run after merging. This updates it.

To this:

> After merging a plugin change, run `scripts/sync-plugins.sh --all`. The
> script updates every installed plugin cache from the marketplace source.

The revision replaces a dense noun cluster with a concrete action, moves the
condition before the command, turns the vague `only` sentence into an explicit
precondition, and replaces an ambiguous `it` with the exact object.

## Editing pass

1. Identify claims, caveats, examples, commands, and links that must remain
   accurate.
2. Reorganize around the reader's task or concept.
3. Cut repetition, unsupported claims, and meta-commentary.
4. Tighten sentences and headings.
5. Check names, pronouns, modifiers, conjunctions, noun clusters, idioms, and
   sentence rhythm for ambiguity or mechanical prose.
6. Re-check that no required technical detail was dropped.
