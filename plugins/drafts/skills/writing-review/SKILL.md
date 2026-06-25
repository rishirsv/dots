---
name: writing-review
description: "Use for Drafts review work: critiquing draft versions, producing findings, rubric scorecards, adversarial reads, and fix plans. Reviews tied to a draft version are durable; pasted-text reviews are advice unless a version is created or selected. Not for general brainstorming, style setup, drafting from scratch, or silent durable review without a target version."
---

# Writing Review

Review writing against its context, plan, rules, channel, sources, and quality
bar. Durable reviews must target a specific `draft_version`; versionless or
pasted-text reviews are allowed only as non-durable advice until the user
creates or selects a version. Use this skill after `drafts` routes critique,
scorecard, adversarial review, or fix-planning work here, or when the user
explicitly invokes `writing-review`.

Read [review-versioning.md](../../references/review-versioning.md) before
reviewing. Read [state-model.md](../../references/state-model.md) to resolve
the reviewed `draft_version`, especially its Where Saved Work Lives section.
Read
[provenance.md](../../references/provenance.md) before mentioning review
lineage, source limits, or saved state.

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
- Requested review mode and rubric, if any.

If the target version is unavailable, ask for it when durable review matters.
When the user wants immediate critique of provided text, label the result as
non-durable advice and offer to create or select a `draft_version` before any
review-to-revision handoff.

## Ways To Review

- `quality_review`: find the highest-impact issues against the context, plan,
  and reader need.
- `adversarial_review`: pressure-test claims, structure, reader value, source
  use, and hidden assumptions.
- `rule_review`: check writing rules and deterministic constraints.
- `style_review`: check whether style usage is appropriate and supported by
  evidence.
- `scorecard`: score named criteria inside the `review_pass`.
- `fix_plan`: turn findings into ordered revision instructions for `compose`.

## Voice Fit

When reviewing voice match, compare the draft against the style guide's
evidence and observable patterns. Check sample sufficiency, obvious style
misses, repeated openers, avoided terms, channel fit, close-copying risk, and
whether the draft still says what the user intended. Do not turn a style review
into a scoring exercise unless the user asks for a scorecard.

## Findings

Each finding should include:

- Severity.
- Location or section.
- Evidence from the draft.
- Why it matters for the context, plan, reader, rule, source, or channel.
- Recommended fix.

Do not bury findings behind a long summary. Lead with the issues that would
change the next revision.

## Turning Review Into Revision

When the user asks to apply fixes:

1. Keep the `review_pass` tied to the reviewed version.
2. Select the findings to apply.
3. Hand the fix plan to `compose`.
4. Create or describe a new `draft_version`.
5. Link the new version back to the review.

## What The User Sees

Lead with the findings that would change the next revision. Keep the review
useful before it is procedural.

For ordinary review, return:

- Findings ordered by severity or impact.
- The fix plan or next revision target.
- A scorecard only when requested.

Mention the reviewed version, non-durable advice status, rubric, or provenance
gaps only when they affect trust, version safety, or the user's next action. Do
not make every review start with review metadata.
