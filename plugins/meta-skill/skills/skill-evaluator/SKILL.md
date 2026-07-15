---
name: skill-evaluator
description: "Use when asked to run, grade, browse, or report agent-skill evaluations: ad hoc evals, suites, candidate comparisons, run history, or the evaluation workbench. Creates and manages evaluation artifacts and runs; not for source review, diagnosis from existing evidence, or edits."
---

# Skill Evaluator

Run realistic tasks to measure how an agent skill behaves. Create and use eval
cases, compare skill versions, grade results, preserve run history, and present
the evidence in reports and the review workbench. Do not review or edit the
target skill's source or generate candidate changes.

Use `skill-reviewer` for static diagnosis and `skill-author` for source
mutation. Evaluation failures may produce a precise handoff to either skill,
but they do not authorize source edits.

## Start With Cases And Versions

State what the evidence should establish, then choose the smallest set of real
tasks and skill versions that can answer it. One case can provide an early
signal; saved cases and repeated runs provide stronger evidence.

Read [suite-design.md](references/suite-design.md) when authoring or changing
tasks or graders; it owns case quality, baseline choice, grader selection, and
failure classification. Read [human-review.md](references/human-review.md) when a
run needs human judgment. Use
[eval-vocabulary.md](../../references/eval-vocabulary.md) for canonical terms,
[run-layout.md](../../references/run-layout.md) for artifact authority, and
[cli.md](../../references/cli.md) for exact commands.

Ask only for a missing choice that would change the task, versions, criteria,
grader, or human-review standard.

Read
[description-improvement.md](../../references/description-improvement.md) when
the claim concerns natural discovery or improving frontmatter routing. The
attached-skill workflow does not test natural discovery; use a platform-native
discovery surface or report that the required adapter is unavailable.

## Author Fair Evidence

Keep the visible task stable while candidates vary. Use the no-skill baseline
by default so the report can show what the skill changed; omit it only when the
comparison cannot answer the decision, and record why.

The target skill's companion `.skill/` workspace owns the schema-version-2
authored suite at `evals/evals.json` and its candidates. Keep simple tasks
inline as top-level `evals[]` rows using `id`,
`prompt`, `expected_output`, and `expectations`. Use `cases/<id>/` only when a
task needs external fixtures, expected output, hidden judge guidance, or a
deterministic validator. Follow the schema and placement rules in the shared
references rather than inventing parallel metadata.

The agent may see the task, declared fixtures, and selected candidate payload.
It must not see expectations, expected outputs, validators, model-judge
guidance, or human labels. Keep the task's user-visible requirements honest:
hidden graders may evaluate them, not secretly introduce them.

For a skill candidate, the trial worker receives a staged copy of the frozen
candidate payload and an explicit instruction to use it. The no-skill worker
does not receive a skill path. This comparison measures behavior with and
without an attached skill; it does not prove that a platform would naturally
discover the skill. State this coverage limit whenever the requested claim
concerns discovery or routing.

## Grade And Review

Use the most exact fair grader:

- deterministic checks for files, schemas, exact state, tests, and observable
  process constraints
- model judgment for semantic quality with multiple valid outcomes
- human judgment for taste, domain expertise, ambiguous evidence, and important
  accept/reject decisions

Prefer binary checks. Use `unknown` when evidence cannot support a fair label.
Inspect failed, surprising, and disagreed trials before changing a task or
grader. Keep grader failures separate from target-skill failures.

The workbench is the human review interface. Use `Cases` to inspect realistic
tasks and observable criteria, and `Runs` to compare immutable skill versions.
Open a case to review outputs, artifacts, criterion evidence, and plain human
feedback side by side. The workbench reads saved runs and records review; it
does not launch, rerun, or regrade work. Ask for those actions in this Codex
task. Start with one trial per case, then rerun selected cases or add
repetitions when variance, disagreement, or a consequential claim needs more
evidence.

Use the structured finding category to identify the first supported cause and
link it to the exact response or artifact. After the user approves the expected
behavior, promote a reviewed failure into a regression case from the same case
view. Do not turn an observation into a durable requirement without that
approval.

Treat feedback as evidence for the next agent turn. Diagnose whether it points
to the case, grader, harness, environment, or target skill; do not ask the user
to classify the note. Hand source changes to `skill-author`, then rerun the
affected cases. This skill never proposes or edits candidate source itself.

Human annotations are excluded from model judgment unless the reviewer
explicitly marks them for `rubric` or `evidence` use. Read
[human-review.md](references/human-review.md) for this distinction. Pairwise
preferences never become absolute judge context automatically.

Keep outcomes and produced artifacts primary during review. Open transcripts
for failure diagnosis or grader audits. Show the selected baseline, task model,
judge model, execution path, local storage path, and known external model
boundary before launch. Localhost storage does not mean model inputs remain
local. Use the CLI as the scripted interface for deterministic lifecycle
operations and unattended execution.

## Run And Report

For an interactive request, keep orchestration in the current Codex task:

1. Validate the suite and run `eval prepare` to freeze the selected cases,
   candidates, graders, and one worker packet per trial.
2. Dispatch one native subagent per packet in bounded waves. Pair the with-skill
   and no-skill workers for a case as closely as capacity allows. With four
   collaboration slots, run at most three workers beside the orchestrator.
3. Prompt each worker as though the user had asked it to perform the task. Give
   it only the visible task, declared fixtures, dedicated workspace, result
   location, and staged skill path when applicable. Do not mention the
   evaluation, comparison, hidden criteria, annotations, or durable run
   directory. Follow [cli.md](../../references/cli.md) for the canonical worker
   result object and lifecycle commands.
4. Run `eval submit` as each worker finishes. Preserve completed evidence when
   another worker fails or the task is interrupted; use `eval unresolved` and
   `eval retry` for recovery.
5. After every trial is terminal, run `eval finalize`. It invokes the configured
   judge, writes the report, and removes temporary trial workspaces.
6. Inspect the report and produced artifacts, then open the review workbench in
   the Codex In-App Browser when human inspection or feedback is useful.

Native subagents isolate context, not the filesystem. Their dedicated staged
workspaces are the normal boundary for trusted local evaluation; they are not a
security sandbox. Use the unattended Codex Exec lane when the task needs a
pinned worker model, repeatable non-interactive execution, or a stronger
workspace-write boundary. Real detached Git worktrees are reserved for
materializing branch or Git-ref candidates and repo-mutating trials; ordinary
trial directories are temporary workspaces.

For unattended or scripted evaluation, use `eval run`. It dispatches task
workers with ephemeral `codex exec`, then uses the same submission, frozen
evidence, grading, and reporting contracts as the interactive path. It must not
create persistent user-visible Codex tasks. See [cli.md](../../references/cli.md)
for exact commands and model overrides.

Treat a run as frozen evidence. Changing the suite, candidate, grader, or skill
payload requires a new run. Use [run-layout.md](../../references/run-layout.md)
for the canonical storage, recovery, reuse, and regrading rules.

Lead the report with the run objective and cases-by-versions comparison. For
each failure, show the failed expectation or check and its evidence.
Also report human/model disagreements, ungraded or unknown outcomes, run or
grader errors, provenance, and coverage limits. Classify the first upstream
cause before handing off a defect.

Keep pairwise review coverage separate from declared absolute human graders; a
sampled A/B annotation does not silently become a trial grade.

Close with suite or run location, what ran and what was skipped, headline
candidate changes, failed checks, disagreements, failure classification, and
what the evidence cannot establish. A green run proves only the measured
scope.
