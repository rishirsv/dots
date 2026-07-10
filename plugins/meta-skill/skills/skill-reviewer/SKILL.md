---
name: skill-reviewer
description: "Use when reviewing, auditing, critiquing, or diagnosing an agent skill, plugin, or reported skill failure without changing source or running new trials. Produces evidence-backed findings and proposals; not for requested edits or running evaluations."
---

# Skill Reviewer

Review agent skills and skill systems without changing them. Diagnose what the
current text, resources, evidence, and surrounding contracts are likely to
cause; return findings and concrete proposals. This lane is strictly read-only:
do not edit source, create workbench state, save review artifacts, or apply a
recommended change.

Use `skill-author` when the user asks to implement a source change. Use
`skill-evaluator` when the decision needs fresh task runs, candidate
comparisons, grading, or run history.

## Gather Evidence

Read the complete shipped payload, not only `SKILL.md`. Include directly linked
references, scripts, assets, metadata, documented contracts, and relevant
tests. Read repository instructions before judging local conventions.

Use available evidence in this order:

1. The exact runtime text and resources a future agent receives.
2. Reported failures or prior usage traces supplied by the user.
3. Existing evaluation runs and reports.
4. Read-only validation and usage-history checks when they materially change
   the diagnosis.

Separate observation from inference and name unavailable evidence. Static text
review can identify routing risk but cannot prove natural discovery or outcome
improvement. Hand those claims to `skill-evaluator`.

For a broad skill review or plugin audit, cover every Discovery and
Implementation dimension and run the read-only structural Validation phase in
[judge-rubric.md](../../references/judge-rubric.md), then run the payload-hygiene
and maintainer-placement sweeps in
[payload-hygiene.md](../../references/payload-hygiene.md). Numeric scoring is
optional unless the user asks for a scored review. Report structural validation
as mechanical evidence, not proof of behavior. For a narrow reported failure,
use only the checks that can explain that failure.

For a clarity or routing complaint, give a fresh reader only the shipped
payload and representative request. Do not give it the complaint, suspected
defect, intended fix, or prior conclusion. Treat its answer as static
comprehension evidence, not proof that a platform would naturally activate the
skill or that outcomes improve.

Read [review-method.md](references/review-method.md) for the defect taxonomy,
plugin-wide checks, and deeper evidence collection. Check discoverable frontmatter against
[description-standard.md](../../references/description-standard.md).

## Diagnose The Smallest Cause

First reconstruct the contract: the skill's job, trigger boundary, inputs,
default path, output, finish condition, and approval boundaries. Then check:

- whether the description and opening claim the same bounded job
- whether instructions are actionable, consistent, and proportionate to risk
- whether conditional detail is behind a precise read-when link
- whether runtime resources are reachable and actually needed
- whether docs, tests, metadata, and neighboring skills agree with the payload
- whether a reported failure comes from the skill, evaluator, harness, task,
  environment, or unsupported assumption

After the linear read, always run a separate contradiction scan across every
surface defining the same behavior. Include the body, linked references,
metadata, and relevant tests or sibling skills that claim the same job. Search
for rules with the same subject but different strength, condition, owner, or
terminology; do not rely on per-file consistency to reveal cross-surface
conflicts.

When reported behavior appears older than source, compare the source payload
with the effective installed payload read-only before attributing the failure.
Never patch an installed cache; report drift as the cause and hand source-owned
release or sync work to the appropriate workflow.

Name the precise cause. “Too long,” “unclear,” and “needs cleanup” are not
diagnoses until tied to the sentence, missing contract, collision, or behavior
they affect. Prefer deletion, consolidation, or a direct rewrite over another
layer of process.

For a plugin or skill collection, also check routing collisions, duplicated
policy, dangling references, dead specialists, and complexity that has no
observed user benefit.

## Report

Lead with the overall judgment. Then list findings in descending user impact.
For each finding include:

- a concise defect name
- specific file and behavior evidence
- likely user impact and confidence
- the exact proposed source change
- the verification that would distinguish a real fix from a plausible rewrite

Include a positive-null result when no material issue is supported. Finish with
the smallest recommended change set, evidence not available, and any decision
that belongs to the user. Do not ask for edit approval from this lane; hand an
implementation-ready proposal to `skill-author` when mutation is wanted.
