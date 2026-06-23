# Review And Versioning

Use this reference before producing Drafts review output.

## Version Target

A durable review must target a specific `draft_version`. If no version is
available, label the result as non-durable advice and ask whether to create or
select a version.

## Review Inputs

Load or identify:

- `draft`.
- `draft_version`.
- `writing_brief`.
- `document_contract`.
- `channel_recipe`.
- `writing_rules`.
- `style_provenance`.
- `source_pack` or `knowledge_item`.
- Requested review mode.

## Findings

Each finding should have:

- Severity.
- Location.
- Evidence.
- Issue.
- Why it matters.
- Recommended fix.

Order findings by impact on the next revision.

## Scorecards

When scoring, name:

- Rubric.
- Criteria.
- Scores.
- Rationale.
- Evidence.
- Confidence.
- Version reviewed.

Do not average vague impressions into a score without criterion-level
rationale.

## Voice Match Checks

For style or voice review, use the style guide's evidence and observable
patterns:

- Paragraph cadence.
- Punctuation habits.
- Repeated openers.
- Avoided terms.
- Channel format constraints.
- Sample sufficiency.

Also check naturalness, intent fit, publishability, close-copying risk, and
whether the draft sounds guided by the style rather than pasted from samples.

## Applying Fixes

Review-to-revision handoff should preserve lineage:

```text
draft_version reviewed
-> review_pass
-> selected findings
-> writer fix plan
-> new draft_version
```

Do not overwrite the reviewed version.
