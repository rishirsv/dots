---
name: writing-review
description: "Use for Drafts review work: critiquing draft versions, producing findings, rubric scorecards, adversarial reviews, and fix plans tied to writing state. Versioned reviews are durable; pasted-text or versionless reviews are non-durable advice unless a draft version is created or selected. Not for general brainstorming, style setup, drafting from scratch, or silent durable review without a target version."
---

# Writing Review

Review writing against its brief, contract, rules, channel, sources, and quality
bar. Durable reviews must target a specific `draft_version`; versionless or
pasted-text reviews are allowed only as non-durable advice until the user
creates or selects a version. Use this skill after `drafts` routes critique,
scorecard, adversarial review, or fix-planning work here, or when the user
explicitly invokes `writing-review`.

Read [review-versioning.md](../../references/review-versioning.md) before
reviewing. Read [state-model.md](../../references/state-model.md) to resolve
the reviewed `draft_version`, especially its State Authority section. Read
[provenance.md](../../references/provenance.md) before reporting review
evidence.

## Review Contract

Before reviewing, identify:

- Target `draft`.
- Exact `draft_version`.
- Relevant `writing_brief`.
- Relevant `document_contract`.
- Channel recipe or intended destination.
- Applicable AGENTS.md guidance and explicit instructions.
- Selected style ID and style guide.
- Draft-level source pack.
- Requested review mode and rubric, if any.

If the target version is unavailable, ask for it when durable review matters.
When the user wants immediate critique of provided text, label the result as
non-durable advice and offer to create or select a `draft_version` before any
review-to-revision handoff.

## Review Modes

- `quality_review`: find the highest-impact issues against the brief and
  contract.
- `adversarial_review`: pressure-test claims, structure, reader value, source
  use, and hidden assumptions.
- `rule_review`: check writing rules and deterministic constraints.
- `style_review`: check whether style usage is appropriate and supported by
  evidence.
- `scorecard`: score named criteria inside the `review_pass`.
- `fix_plan`: turn findings into ordered revision instructions for `writer`.

## Style Review

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
- Why it matters for the brief, contract, reader, rule, source, or channel.
- Recommended fix.

Do not bury findings behind a long summary. Lead with the issues that would
change the next revision.

## Review-To-Revision Handoff

When the user asks to apply fixes:

1. Keep the `review_pass` tied to the reviewed version.
2. Select the findings to apply.
3. Hand the fix plan to `writer`.
4. Create or describe a new `draft_version`.
5. Link the new version back to the review.

## Output

Return:

- Reviewed draft and version, or `non-durable advice` when no version was
  available.
- Review mode and rubric.
- Findings ordered by severity.
- Scorecard when requested, stored or reported as part of the review pass.
- Fix plan or next revision target.
- Provenance gaps that limit confidence.
