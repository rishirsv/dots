# Maintain Evaluation Guidance in the Hidden Companion

Keep reusable evaluator knowledge in `skills/.<skill-name>/AGENTS.md`, beside
`evals/`, `runs/`, and `worktrees/`. Use the conventional uppercase filename.
This is a nested instruction file for maintaining evaluations, not a new skill,
candidate instruction, wiki, or second copy of project documentation.

## Read and scope the instructions

The evaluation coordinator explicitly reads this file before creating tasks,
preparing environments, grading, or comparing results. Do not assume the host
automatically loads it when working from a different directory. Respect parent
repository instructions; nested guidance does not override them.

Never copy this file into the candidate environment. In particular, a working
copy under `.<skill-name>/worktrees/` can inherit this ancestor AGENTS.md. Check
instruction discovery as well as file access. Use an externally isolated trial
root when the host cannot exclude evaluator instructions and hidden material.
A dot folder, Git ignore rule, or request not to read a file is not isolation.

## Record only reusable, supported knowledge

Start with a small AGENTS.md when real findings justify it. Useful content:

- approved sources, dependency setup, readiness and reset commands;
- relationships realistic fixtures must preserve and meaningful task families;
- independent evidence locations and known verification mistakes;
- accepted general criteria, coverage gaps, and rejected weak task designs;
- links to reusable helpers and the task/run evidence supporting each lesson.

For each lesson, explain when it applies, the actionable guidance, its evidence,
and known limits. Keep exact requests, focal records, expected answers, and
task-specific rubrics in the task's `evals/` area. Keep comments, labels, judge
predictions, and iteration decisions with their runs. Link rather than copy.
Secrets and private client data do not belong in instructions.

Do not create another skill, mandatory taxonomy, or placeholder directories.
Reuse helpers under `evals/` when several tasks need them. Link to existing
project documentation instead of duplicating it. If several skills share a
method, reference its established owner without exposing grading knowledge to
the evaluated agents.

## Update from evidence

During task construction and audit, propose the smallest useful addition or
correction. Show the existing guidance and proposed changes together, separating
reusable lessons from exact task truth. Treat changes as accepted only after
human review. Show their source and how another task would benefit. Confirm new
human policy judgments; do not turn one preference or one trace into a universal
rule. An agent-authored proposal is not human-approved merely because it was saved.

Use later, materially different tasks to check whether guidance reduces
rediscovery, improves fixtures, or prevents a verifier defect. Narrow or remove
rules contradicted by evidence. Do not accumulate a separate instruction for
every failed example. Preserve the lesson from rejected improvements too.

Design-only and review-only requests do not require creating this file. When
updating existing guidance, preserve unrelated user instructions and report
what changed. This skill describes where future evaluation knowledge belongs;
it does not authorize moving private evaluation data between repositories.

Scale to parallel task construction only after later materially different tasks
have exercised the shared guidance and its construction and verification methods.
If autonomous updates were requested, make the smallest supported change and
label it unreviewed rather than implying human acceptance.
