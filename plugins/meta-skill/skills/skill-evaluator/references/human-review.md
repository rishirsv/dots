# Human Review

Read this when a run needs taste, domain expertise, adjudication of ambiguous
evidence, or a human check on an important model judgment.

Use the evaluation workbench to inspect responses, artifacts, grades, and to
record annotations. Use `metaskill eval record` to submit a declared absolute
human grade. Review high-priority, regressed, unknown, disagreed, and surprising
cases before routine passes. Add a small deterministic sample of apparent
passes when the decision warrants it, and report reviewed coverage.

Use absolute review when a declared human grader must decide whether one trial
meets a requirement. Keep the model label hidden until the reviewer records an
independent judgment; reveal it afterward as an agreement or disagreement, not
as a score of the reviewer.

For each selected absolute trial:

1. Read the visible task and outcome.
2. Read expected output, judge guidance, validator evidence, and transcript
   excerpts only when they affect the decision.
3. Record `pass`, `partial`, `fail`, or `unknown` against the suite's declared
   human grader and metric.
4. Give a short rationale tied to exact outcome or transcript evidence.
5. Add a plain evidence note when the result needs explanation or follow-up.

Human grades are revisable. Preserve their history and regenerate the derived
report after revision. When a human and model disagree, inspect the task,
criteria, allowed evidence, and judge guidance; do not hide the disagreement or
invent a confidence label.

## Control Annotation Use

Each response or artifact annotation has one explicit `judge_use` value:

- `exclude` keeps the note human-only and is the default, including when the
  field is absent in an older run
- `rubric` teaches the judge how to interpret a visible requirement across the
  selected evidence without adding a hidden requirement
- `evidence` points the judge to a relevant fact in this result without
  changing the rubric

Use `rubric` only for a reviewed interpretation that should guide later model
judgment. Use `evidence` only when the note identifies observable support in
the response or artifact. Keep one-off reactions, candidate identity,
preferences, proposed skill edits, and unreviewed diagnoses excluded.

Regrading may use only annotations explicitly marked `rubric` or `evidence`.
The resulting model-grade row records their annotation IDs and a digest of the
assembled judge context. Changing an annotation's judge use does not rewrite an
old grade; run grading again to append a new judgment. Notes from another run
are never inherited automatically; promote accepted guidance into the authored
case or grader before starting a new run.

Use a deterministic validator instead when exact checks can decide fairly. Use
`unknown` when evidence is insufficient or contradictory. One reviewer is
normally enough for a small local suite; do not turn routine evaluation into a
multi-reviewer study unless the user's decision requires it.
