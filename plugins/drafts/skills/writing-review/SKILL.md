---
name: writing-review
description: "Use for Drafts review work: critiquing drafts, pressure-testing arguments, checking voice or rules, scoring against a rubric when asked, and deciding what to revise first. Reviews tied to a draft version are saved; pasted-text reviews are one-off advice unless a version is created or selected. Not for general brainstorming, style setup, drafting from scratch, or silent saved review without a target version."
---

# Writing Review

Review writing against its context, plan, rules, channel, sources, and quality
bar. Saved reviews must target a specific `draft_version`; versionless or
pasted-text reviews are one-off advice until the user creates or selects a
version. Use this skill after `drafts` sends critique, pressure-testing,
voice checks, rubric scoring, or revision-priority work here, or when the user
explicitly invokes `writing-review`.

Read [state.md](../../references/state.md) before reviewing, especially its
saved-review, version, and user-facing state note guidance.
Read [style-guide.md](../../references/style-guide.md), starting with its Fast
Path for `writing-review`, before voice-fit reviews, especially when the review
checks personalization, anti-patterns, repeated-choice patterns, or evidence
limits.

## Before Reviewing

Before reviewing, identify:

- Target `draft`.
- Exact `draft_version`.
- Relevant context, if available.
- Relevant plan, if available.
- Channel recipe or intended destination.
- Applicable AGENTS.md guidance and explicit instructions.
- Selected style ID and style guide.
- Draft-level source material.
- The kind of review the user asked for, and any rubric.

If the target version is unavailable, ask for it when saved review matters.
When the user wants immediate critique of provided text, label the result as
one-off advice and offer to create or select a `draft_version` before applying
the critique as a saved revision.

## Kinds Of Review

Choose the shape that matches the user's language:

- General critique: find the issues that would most improve the next draft.
- Pressure test: challenge claims, structure, reader value, source use, and
  hidden assumptions.
- Rules check: check the writing against AGENTS.md guidance, explicit
  instructions, and deterministic constraints.
- Voice check: decide whether the style choice is appropriate and supported by
  evidence.
- Rubric review: score named criteria when the user asks for scoring.
- Revision priorities: turn the review into a short, ordered list of what to
  change next.

## Voice Fit

When reviewing voice match, compare the draft against the style guide's
evidence and observable patterns. Check sample sufficiency, obvious style
misses, repeated openers, avoided terms, channel fit, close-copying risk, and
whether the draft still says what the user intended. Do not turn a style review
into scoring unless the user asks for a scored rubric.

For repeatable voice review, use the same pattern families used to build the
guide:

- Evidence level and whether it supports the claimed personalization.
- Voice tensions and boundaries.
- Structure, opening, movement, and ending.
- Sentence-level preferences: cadence, punctuation, pronouns, function words,
  hedges, qualifiers, transitions, abstraction level, and repeated openers.
- Signature moves and whether they are useful rather than ornamental.
- Anti-patterns and blacklist fixes.
- Examples, misses, and fixes as principles, not phrases to copy.
- Channel recipe conflicts or overrides.
- Whether the draft still preserves source truth and user intent.

If a miss recurs, recommend a correction-ledger entry or style-guide update
instead of treating it as a one-off edit.

## Issues

Each issue should include:

- Severity.
- Location or section.
- Evidence from the draft.
- Why it matters for the context, plan, reader, rule, source, or channel.
- Recommended fix.

Do not bury the critique behind a long summary. Lead with the issues that would
change the next draft.

## Turning Review Into Revision

When the user asks to apply fixes:

1. Keep the saved review tied to the reviewed version.
2. Choose the issues to fix.
3. Hand the revision priorities to `compose`.
4. Create or describe a new `draft_version`.
5. Link the new version back to the review.

## What The User Sees

Lead with the issues that would change the next draft. Keep the review useful
before it is procedural.

For ordinary review, return:

- Issues ordered by severity or impact.
- The next revision target.
- Scores only when the user asks for scoring.

Mention the reviewed version, one-off advice status, rubric, or missing state
only when they affect trust, version safety, or the user's next action. Do not
make every review start with review details.
