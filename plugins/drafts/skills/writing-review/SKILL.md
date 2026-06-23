---
name: writing-review
description: "Use for Drafts review work: critiquing a specific draft version, producing findings, rubric scorecards, adversarial reviews, and fix plans tied to versioned writing state. Not for general brainstorming, style setup, drafting from scratch, or review that cannot identify the target draft."
---

# Writing Review

Review a specific draft version against its brief, contract, rules, channel,
sources, and quality bar. Use this skill after `drafts` routes critique,
scorecard, adversarial review, or fix-planning work here.

Read [review-versioning.md](../../references/review-versioning.md) before
reviewing. Read [state-model.md](../../references/state-model.md) to resolve
the reviewed `draft_version`. Read [provenance.md](../../references/provenance.md)
before reporting review evidence.

## Review Contract

Before reviewing, identify:

- Target `draft`.
- Exact `draft_version`.
- Relevant `writing_brief`.
- Relevant `document_contract`.
- Channel recipe or intended destination.
- Active writing rules.
- Style provenance.
- Source pack or knowledge items.
- Requested review mode and rubric, if any.

If the target version is unavailable, ask for it or label the review as
non-durable advice.

## Review Modes

- `quality_review`: find the highest-impact issues against the brief and
  contract.
- `adversarial_review`: pressure-test claims, structure, reader value, source
  use, and hidden assumptions.
- `rule_review`: check writing rules and deterministic constraints.
- `style_review`: check whether style usage is appropriate and supported by
  evidence.
- `rubric_scorecard`: score named criteria and explain each score.
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

- Reviewed draft and version.
- Review mode and rubric.
- Findings ordered by severity.
- Scorecard when requested.
- Fix plan or next revision target.
- Provenance gaps that limit confidence.
