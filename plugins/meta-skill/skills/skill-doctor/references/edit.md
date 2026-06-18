# Doctor Candidate And Source Updates

Read this as part of the Doctor workflow when translating skill
evidence into the smallest useful proposal. Source updates are handled only in
Apply after the user asks for a specific source change.

Workbench paths below are shorthand for the target project root's
`<project>/.<skill-name>/` dir (e.g. `judge-review.md` = that dir's
`judge-review.md`). The
project root already names the skill and contains the portable skill payload at
`<project>/skill/`, so do not add another skill-name namespace. Review *lenses*
live in [rubric.md](rubric.md#review-lanes); the scoring rubric is
[rubric.md](rubric.md).

## Route Selection

| User asks for | Default route |
|---|---|
| "improve this skill", "review this skill", "diagnose this fail state", "what would you change", "is this good" | Clarify and Doctor |
| "apply proposal 1", "make that exact change", "update SKILL.md with the proposed routing change" | Apply |
| "run evals", "use this trace", "use a subagent", "iterate", "autonomously improve" | Evidence loop |
| "test one prompt", "try the candidate in another thread", "use a worktree", "trial this improvement" | Skill trial run |
| Ambiguous improvement request | Clarify and Doctor |

Clarify and Doctor is the default. **Do not silently rewrite the target
skill payload, generated plugin packages, docs, or source files just because the
user gave feedback or asked what should change.** Human feedback is *evidence*;
it is not source-edit permission. Tentative or mixed wording such as "could
implement," "maybe update," "I think we should," or "implement and propose" is
still a proposal request. Apply only when the user clearly asks for a specific
source change.

Writing review notes, proposals, failure notes, scorecards, and other
supporting docs is allowed and expected during diagnosis/review — they are
evidence artifacts, not payload edits.

## First Read

Before diagnosing or proposing anything in the Doctor workflow, identify:

- skill name and folder
- current description and trigger contract
- core job
- linked references, scripts, assets, and metadata
- `judge-review.md` and other `.<skill-name>/` evidence available
- the user's requested scope
- whether the current turn is propose-only or Apply

Do not let a broad improvement request become an unbounded rewrite.

## Evidence Sources

Valid improvement evidence:

- file/link review failures or warnings
- a completed `judge-review.md` with a concrete finding heading
- explicitly captured deterministic test or validation output
- a subagent's review findings (as evidence support)
- saved artifacts tied to a user-observed failure
- a concrete user-observed failure

Generated review worksheets that still contain *Agent review required*
placeholders are **not** edit evidence — complete the review first, or cite a
different concrete source. If evidence is missing, ask the user to provide
concrete feedback, run available deterministic tests, inspect saved failure
evidence, or authorize a manual review path.

For read-only review requests, complete `judge-review.md` as a Quality page using
[rubric.md](rubric.md) when artifact writes are allowed. Treat broad "do not
edit files" instructions as forbidding *payload, package, docs, and source*
edits, not supporting-doc writes — unless the user explicitly forbids artifact
writes too. If zero writes are required, say the full review artifact cannot be
produced under that constraint, then do a manual read-only review or ask whether
to write supporting docs. The completed report is the evidence artifact; for
later edit requests, cite `judge-review.md` and the finding heading before
changing the portable payload.

For subagent review, the subagent is evidence support only. The parent owns
diagnosis, candidate proposals, Apply, validation, and the recommendation.

## Skill Trial Run

For one-off prompt-doctor improvements, read
[skill-trial-runs.md](../../../references/skill-trial-runs.md). Use a Codex
worktree child thread when the candidate edit should be tested without mutating
the parent checkout. The child may apply or inspect the candidate in its
worktree and return the structured trial result; the parent decides whether to
ask the user to apply the source edit, refresh review/verify evidence after
Apply, or escalate to `skill-evaluator`.

This route is not a full evaluation suite. Use it for one realistic prompt or
review pass that would make the edit decision clearer.

## Prompt Doctor Loop

1. Name the observed fail state in plain language.
2. Classify: activation, runtime clarity, output contract, resource, runtime
   contamination, evidence, cross-skill boundary, user control, or validation
   gap.
3. Separate a recurring failure pattern from a one-off edge eval.
4. Find the smallest likely source: description, boundary, example, workflow
   branch, output contract, reference pointer, script contract, or missing gate.
5. Produce two or three candidate edits that fix the behavior while preserving
   the approved trigger and runtime surface.
6. Scan each candidate diff for source provenance, stale references, and
   negative-only rules. Prefer replacing misleading or over-emphasized guidance
   with the positive behavior the skill should perform. Do not add negative
   rules that reference removed, absent, or de-emphasized concepts unless that
   concept is the concrete recurring failure; when a negative guard is needed,
   pair it with the desired behavior.
7. Recommend one — the smallest strong fix — and say why.
8. Stop with a standard clarify-style question unless the top-level workflow has
   entered Apply.
9. Add a broad rule only when the agent would likely repeat the mistake without it.
10. Record changed behavior, evidence, rejected tempting edits, and residual
   risk in a supporting doc when durable notes are needed.

Prefer replacing a misleading sentence over adding a prohibition. Preserve
unrelated behavior.

## Diagnosis Shape

```md
## Current Understanding
<what the user wants improved and what must be preserved>

## Diagnosis
Observed fail state: <specific bad behavior>
Likely source: <description, workflow branch, output contract, reference, script, or missing gate>
Evidence: <file path, run ID, eval ID, trace, user feedback, or exact section>

## Candidate Edits
1. <edit option and tradeoff>
2. <edit option and tradeoff>
3. <optional edit option and tradeoff>

Recommended edit: <one option>
Validation to run: <file review, test, or review refresh>
```

Avoid vague diagnoses like "make it clearer." Name the phrase, section, workflow
branch, or evidence row causing the risk.

## Surgical Update Rules

- Edit the skill's **source-of-truth**, never a generated copy a build would
  overwrite. In *this* repo: source under `plugins/dots/skills/<name>/` or
  `plugins/meta-skill/skills/<name>/`; never hand-edit generated packages under
  `dist/**`. Other projects: find the equivalent source-vs-build split first.
- Preserve name and folder unless rename is in scope.
- Preserve the intended trigger meaning.
- Preserve output contract, tone, and runtime surface unless they are the problem.
- For Apply, briefly restate the requested change and files in scope before
  patching.
- For direct, specific edit requests, still state the diagnosis briefly before
  patching. If the request is broad or exploratory, propose first.
- Keep unrelated resources unchanged.
- Prefer smaller changes when two edits protect behavior equally well.
- Reject edits that restate existing guidance or trade one ambiguity for another.
- A `description` change alters triggering/routing — surface it explicitly.
