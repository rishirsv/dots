# Doctor Workflow

Use this reference after the top-level Skill Doctor workflow has selected
**Doctor** mode. Doctor mode diagnoses a specific reported failure and proposes
the smallest useful source change. It is a read/propose workflow. Source edits
require explicit approval for a concrete change; feedback, diagnosis, review,
or brainstorming is not approval.

## Tracks

Announce which track you are taking before doing the work:

- **Guidance-first proposal**: inspect the report, current skill guidance,
  linked references, and existing evidence; localize the likely source and
  propose a patch. This is the default when the user-observed failure is already
  concrete.
- **Reproduction/trial**: recreate or test the issue from first principles with
  one narrow run when the user asks for it, the evidence is ambiguous, trigger
  behavior must be observed, or the proposed edit would be risky without a live
  check.

## Intake Checklist

Before diagnosing or proposing anything, identify:

- skill name and folder
- current description and trigger contract
- core job
- linked references, scripts, assets, and metadata
- visible fixture/demo/copy-export surfaces that ship with the skill
- `judge-review.md` and other `.<skill-name>/` evidence available
- the user's requested scope
- whether prior Codex session evidence is needed or available
- whether a specific source edit has been explicitly approved

Do not let a broad improvement request become an unbounded rewrite.

## Evidence

Prefer concrete evidence over intuition. Valid improvement evidence includes:

- file/link review failures or warnings
- a completed `judge-review.md` with a concrete finding heading
- explicitly captured validation output
- a subagent's review findings, as evidence support
- saved artifacts tied to a user-observed failure
- rendered Codex session transcripts tied to a reported failure
- a concrete user-observed failure
- a user-observed prose or architecture failure, such as a skill reading like a
  schema, route report, escalation ladder, or state machine instead of guidance
  for the work

When proposing a change, record the diagnosis basis explicitly:

| Evidence field | What to capture |
|---|---|
| Expected behavior | What the skill should have done. |
| Actual behavior | What happened instead. |
| Trigger input | The user prompt, failure scenario, or session reference. |
| Files inspected | Skill payload and references that were actually read. |
| Validation output | Current validation command and result when available. |
| Alternate causes rejected | Plausible causes inspected and ruled out. |
| Confidence | High, medium, or low, with low for user-report-only proposals. |
| Falsifier | What evidence would prove the diagnosis wrong. |

Generated review worksheets that still contain *Agent review required*
placeholders are not edit evidence. Complete the review first, or cite a
different concrete source. If evidence is missing, ask the user to provide
concrete feedback, run available validation checks, inspect saved failure
evidence, or authorize a manual review path.

For read-only Review-mode requests that ask for static review evidence, return
the Judge review in chat. Save `judge-review.md` only when artifact writes are
allowed. For mechanical-language or prose-cleanup complaints, use the Clean or
Doctor diagnosis path and skip the scorecard unless the user asks for one. For
later edit requests, cite the chat finding or saved `judge-review.md` finding
heading before changing the portable payload.

For subagent review, the subagent is evidence support only. The parent owns
diagnosis, candidate proposals, approved source edits, validation, and the
recommendation.

## Codex Session Evidence

When the reported failure happened in a prior Codex thread, or the user points
to a thread id/title as evidence, read
[thread-skill-improvement.md](../../../references/thread-skill-improvement.md).
Use the Meta-Skill session commands to locate and render the relevant transcript:

```sh
<meta-skill-root>/scripts/metaskill sessions list --limit 25 --archived all --query "<terms>"
<meta-skill-root>/scripts/metaskill sessions show <thread-id> --max-chars 12000
```

When the request is to evaluate a thread and improve an existing skill, also
read
[thread-skill-improvement.md](../../../references/thread-skill-improvement.md)
and build the read-only handoff:

```sh
<meta-skill-root>/scripts/metaskill sessions extract <thread-id> --target <skill-dir>
```

Use targeted session evidence for diagnosis, not broad pattern mining. Prefer
`sessions list` and `sessions show` for a single reported failure. Do not scan
unrelated sessions unless the user asks for repeated-pattern analysis.

Session evidence must cite concrete thread ids, timestamps, cwd values, and
rollout paths when possible. Separate transcript facts from inference. Do not
copy raw prompts, thread ids, local paths, model/provider names, or transient
errors into runtime guidance unless they are direct runtime dependencies.
The extractor output is not edit approval; it only packages evidence for the
Doctor proposal or an Evaluator handoff.

## Diagnosis Method

1. Capture the report: what the user expected vs what actually happened.
2. Reconstruct the triggering input or scenario. If the failure happened in a
   prior Codex session, locate and render the relevant transcript before
   diagnosing.
3. Inspect the current skill text and linked references. If using the
   reproduction/trial track, run exactly one narrow check and confirm it matches
   the reported failure.
4. Localize the cause: description, body, reference, structure, workflow branch,
   output contract, script contract, or missing gate.
5. If the failure is about leaked vocabulary, meta text, provenance, examples,
   visible fixture copy, or maintainer/developer guidance in the runtime
   payload, run the Payload Hygiene Sweep and Runtime vs Maintainer Placement
   Audit in
   [payload-hygiene.md](../../../references/payload-hygiene.md) before choosing
   a fix. Build the
   scan terms from the user's complaint and inspected evidence; include section
   headings in linked runtime references, visible HTML text, labels,
   alt/copy/button strings, and export payloads, not only Markdown prose.
   If the failure is about mechanical language or over-architecture, inspect the
   opening contract, workflow names, output guidance, examples, and linked
   runtime references for visible machinery. Look for rungs, levels, ladders,
   modes, state fields, route reports, promotion gates, and schema-shaped
   language that could make the future agent perform the skill's structure
   instead of the user's task.
   For any reported skill-design failure, apply the static failure-mode sweep in
   [judge-rubric.md](../../../references/judge-rubric.md). Localize the fix to
   the smallest description, workflow, branch, reference pointer, completion
   criterion, or pruning change.
6. Run the Proposal Loop below.
7. Propose the smallest fix with target files, intended behavior, validation,
   and residual risk. Stop there unless a specific source edit has already been
   explicitly approved.

Avoid vague diagnoses like "make it clearer." Name the phrase, section,
workflow branch, or evidence row causing the risk.

## Proposal Loop

1. Name the observed fail state in plain language.
2. Classify the failure: activation, trigger load, structure,
   branching/context pointer, runtime clarity, output contract, resource,
   steering, legwork-driven split, pruning, runtime contamination, maintainer
   leakage, evidence, cross-skill boundary, user control, or validation gap.
3. Separate a recurring failure pattern from a one-off edge case.
4. Find the smallest likely source: description, boundary, example, workflow
   branch, output contract, reference pointer, script contract, or missing gate.
5. Produce two or three candidate edits that fix the behavior while preserving
   the approved trigger and runtime surface.
   For mechanical-language failures, one candidate should usually be a positive
   prose rewrite: name the natural behavior the skill should cause, then move or
   delete the visible machinery that competes with it.
6. Run a generalization check on each candidate: convert the incident evidence
   into the reusable failure class, keep one-off names and values in the
   evidence section only, and remove any source wording that would make the
   skill solve only the reported example.
7. Scan each candidate for source provenance, stale references, and negative-only
   rules. Prefer replacing misleading or over-emphasized guidance with the
   positive behavior the skill should perform. Do not add negative rules that
   reference removed, absent, or de-emphasized concepts unless that concept is the
   concrete recurring failure; when a negative guard is needed, pair it with the
   desired behavior.
8. For cleanup or contamination failures, check that the candidate removes the
   reusable failure class everywhere it can surface, not just the exact phrase
   reported by the user. Include renamed files/titles, visible fixture text,
   copyable payloads, examples, and validator/lint coverage when the target
   skill owns such a validator.
9. Recommend one smallest strong fix and say why.
10. Add a broad rule only when the agent would likely repeat the mistake without
   it.
11. Record changed behavior, evidence, rejected tempting edits, and residual risk
   in a supporting doc when durable notes are needed.

Prefer replacing a misleading sentence over adding a prohibition. Preserve
unrelated behavior.

For prose and architecture complaints, keep the response itself out of the trap.
Use the proposal template only as a private checklist when it would make the
chat feel like an incident report. The user should see the diagnosis, the
intended behavior, the concrete patch scope, and the validation plan in clear
prose.

## Trial Run

For one-off Doctor improvements, read
[skill-trial-runs.md](../../../references/skill-trial-runs.md). Use a Codex
worktree child thread when the candidate edit should be tested without mutating
the parent checkout. The child may make or inspect the candidate in its
worktree and return the structured trial result; the parent decides whether to
ask the user to approve the source edit, refresh review/verify evidence after
an approved edit, or escalate to `skill-evaluator`.

This route is not a full evaluation suite. Use it for one realistic prompt or
review pass that would make the edit decision clearer.

Do not create, fork, or message a trial child unless the user asked for testing,
iteration, a child thread, or a worktree-backed trial. When a trial would help
but was not requested, stay guidance-first, name the trial as optional evidence,
and ask before spawning child/worktree execution.

For triggering failures, reproduce with a natural prompt in a clean child
thread. For behavior failures, force invocation with the failing input so the
run isolates the skill's behavior after it has already fired.

## Proposal Output

```md
## Current Understanding
<what the user wants improved and what must be preserved>

## Diagnosis
Observed fail state: <specific bad behavior>
Chosen track: <guidance-first proposal | reproduction/trial>
Likely source: <description, workflow branch, output contract, reference, script, or missing gate>
Evidence: <file path, run ID, eval ID, trace, user feedback, or exact section>

## Evidence Basis
Expected behavior: <what should have happened>
Actual behavior: <what happened instead>
Trigger input: <prompt, scenario, or session reference>
Files inspected: <paths>
Validation output: <command/result or not run>
Alternate causes rejected: <brief list>
Confidence: <high | medium | low>
Falsifier: <evidence that would change the diagnosis>

## Candidate Edits
1. <edit option and tradeoff>
2. <edit option and tradeoff>
3. <optional edit option and tradeoff>

Recommended edit: <one option>
Validation to run: <file review, test, or review refresh>
Residual risk: <what remains uncertain>
```

## Approval-Gated Edits

Doctor does not patch payloads, generated packages, synced config targets, or
installed copies by default. It edits source only when the user explicitly
approves a concrete proposal or directly requests a specific edit.

Before patching, briefly restate the approved write scope and name the
source-of-truth files that will change. Re-run the generalization check against
the concrete patch: incident names, exact values, and one-off evidence belong in
diagnosis or review output, not portable runtime guidance, unless they are direct
runtime dependencies. Never edit a generated copy that a build would overwrite.
If the source-vs-generated boundary is unclear, inspect repo instructions,
package manifests, build scripts, or generated-package markers before patching.

If the requested write scope is broader than the proposal, stay in Doctor mode
and diagnose the expanded scope before editing. Do not treat broad agreement,
feedback, or a diagnosis request as permission to patch source.
