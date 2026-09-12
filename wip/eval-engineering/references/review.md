# Human Review and Annotations

Collect observations, grades, or preferences and translate them into criteria
the user recognizes. Review actual deliverables, not only the agent's summary.

## Choose the review mode

- **Discovery:** ask what works, fails, or is missing. Do not force a grade.
- **Grading:** apply agreed criteria. Prefer pass/fail for clear requirements,
  with “cannot assess” when evidence is insufficient. Use an anchored scale only
  when its distinctions support a real decision.
- **Comparison:** ask which output is better for this task and why. Allow A, B,
  tie, or neither; preference does not prove either output is acceptable.

Reuse existing criteria when the user wants to grade immediately. Human-only
review is a complete workflow; an automated judge is optional.

## Prepare a minimal review surface

Use the current conversation's annotations and file links when they preserve
attribution. If a local review page is available or requested, keep it to task
navigation, the request and necessary inputs, anonymous output text or A/B
outputs, original-file links, comments, and relevant grading controls. No embedded
Excel viewer, artifact editor, hosting, or automatic upload.

Display generated text as inert text, not executable HTML or scripts. Link
non-text files to unchanged originals. A workbook comment can cite `Revenue!D18`;
a document comment can cite its page or section. A preview does not establish
formula correctness.

Hide candidate/model identities and automated subjective grades during independent
review. Randomize A/B order per task and retain the private mapping. Keep the task
input and necessary source evidence visible; hide which candidate produced an
output, not information needed to judge it. Offer traces separately for diagnosis
since they may reveal identity. Mark identity-revealing reviews as unblinded.

For a local text-review workspace, read [Review UI](review-ui.md). It describes
the single-output, paired, focused-reading, context, annotation, and summary
views, and supplies a small copyable component kit in `assets/review/`.
Generate the view from actual task and run data; use the labeled mock manifest
only to develop or demonstrate layouts. Do not turn a one-candidate run into a
comparison by duplicating or inventing outputs.

Use conversation annotations instead when the task does not need a separate
workspace. If the host cannot persist feedback, state the limitation. Do not
claim a page or save mechanism exists until it has been provided and checked.

## Bind every comment to its evidence

Store feedback under the companion `runs/<run-id>/`, alongside the private output
mapping. Use a directly readable JSON or Markdown record, not a database or a
second evaluation suite. Each item needs:

- a stable feedback ID and task ID;
- run/trial ID and anonymous output label, resolved through the private mapping;
- original artifact path and content hash or immutable output revision;
- scope: whole output, selected text, or artifact location;
- exact quote and offsets or context to distinguish repeated text, or the user's
  sheet/cell, page, or section for a non-text artifact;
- the user's exact comment and any explicit grade, preference, and reason;
- criterion/version when grading, and whether review was blinded.

A pairwise vote identifies both output revisions, not just the winning side.
Keep the user's words separate from the agent's interpretation. Never retarget
an annotation silently when an output changes; keep the original and ask whether
the observation applies to the revision. “B, paragraph 2” must resolve to the
task, B's run mapping, file revision, and quoted passage—not only that label.
Clarify ambiguous targets before proposing an edit.

## Save, resume, and respond

Tell the user how to comment, what is saved, and how to mark review complete.
Persist feedback and read the saved record back to confirm attribution. A local
page must distinguish unsaved input from persisted feedback and preserve an
unfinished review across navigation. An empty comment is not acceptance; closing
a page does not mean review is complete.

On resume, use the saved mapping and revisions. Summarize substantive feedback
with links to affected artifacts and locations. Address annotations individually;
do not collapse contradictory comments into a generic score. Keep rejected
suggestions and unresolved questions visible.

## Translate “better” into a standard

Ask what drove a choice only when its reason is missing. Otherwise propose the
criterion directly: “B preserves your constraints without inventing new work”
could mean “Preserve explicit constraints without adding unsupported scope.”

Ask whether it is a general requirement or task-specific preference. Confirm
the observable pass boundary and accepted alternatives before making a grader.
Do not silently convert relative preference into binary acceptance. Tie proposed
criteria to the feedback supporting them.

If the user wants automation, follow [Verifier design](verifier-design.md).
Keep human labels separate from judge predictions and inspect disagreements
against original evidence. Agreement with examples used to write the judge is
not independent calibration.

For comparison or revised criteria, follow [Comparison](comparison.md).
Recommend the next action with evidence; feedback alone does not authorize
editing skills, adopting candidates, or publishing changes.
