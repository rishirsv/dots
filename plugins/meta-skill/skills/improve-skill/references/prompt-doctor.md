# Prompt Doctor

Read this when translating skill evidence into the smallest useful improvement.

## Mode Selection

| User asks for | Default mode |
|---|---|
| "review", "audit", "what would you change", "is this good" | Review-only findings |
| "update", "rewrite", "patch", "fix", "apply your changes" | Surgical edit |
| "redesign", "replace", "start over" | Redesign while preserving explicit constraints |
| Ambiguous | Review-only unless local context clearly authorizes edits |

If in review-only mode, do not silently rewrite files.

## First Read

Before changing anything, identify:

- skill name and folder
- current description and trigger contract
- core job
- linked references, scripts, assets, and metadata
- `.meta-skill/review.md` and other `.meta-skill/` evidence available
- user's requested scope

Do not let a broad review request become an unbounded rewrite.

## Evidence Sources

Valid improvement evidence includes:

- `meta-skill lint` failures or warnings
- completed `.meta-skill/review.md` with a concrete finding heading
- `.meta-skill/runs/<run-id>/evals/<eval-folder>/response.md`
- `.meta-skill/runs/<run-id>/evals/<eval-folder>/transcript.json`
- `.meta-skill/runs/<run-id>/evals/<eval-folder>/rpc.jsonl`
- frozen eval `task.md` and `criteria.json` from the run folder
- explicitly captured deterministic test or validation command output
- saved artifacts tied to the run, eval, or user-observed failure
- concrete user-observed failure

Generated review worksheets that still contain `Agent review required` placeholders are not edit evidence. Complete the review first, or cite a different concrete evidence source.

If evidence is missing, ask the user to run `meta-skill lint` or `meta-skill run`, or to authorize a manual review path.

For read-only review requests, run `meta-skill review <skill-dir>` first, then complete `.meta-skill/review.md` as a Quality page using [review-criteria.md](review-criteria.md). The completed report is the evidence artifact. For later edit requests, cite `.meta-skill/review.md` and the finding heading before changing the portable payload.

## Review Lanes

Use only lanes relevant to the request:

- Activation: trigger clarity, realistic phrasing, near misses, non-trigger boundary.
- Runtime clarity: default path, output contract, stop/ask points, final checks.
- Resources: linked references/scripts/assets, dependency clarity, source leakage, stale files.
- Controls: user files as data, approval gates, external writes, package/publish gates.
- Eval evidence: `.meta-skill/evals/`, executable tests under `.meta-skill/tests/`, transcript quality, token usage visibility.
- Review score: `.meta-skill/review.md` Quality Score, Discovery, Implementation, Validation, and combined findings.

## Prompt Doctor Loop

1. Name the observed fail state in plain language.
2. Separate recurring failure pattern from one-off edge eval.
3. Find the smallest likely source: description, boundary, example, workflow branch, output contract, reference pointer, script contract, or missing gate.
4. Propose no more than four candidate edits.
5. Apply only the smallest useful change that removes the ambiguity or wrong encouragement.
6. Add a broad rule only when the agent would likely repeat the mistake without it.
7. Record changed behavior, evidence, rejected tempting edits, and residual risk in `.meta-skill/spec.md` when durable notes are needed.

Prefer replacing a misleading sentence over adding a prohibition. Preserve unrelated behavior.

## Finding Shape

```markdown
### Finding: <specific issue>

Evidence: <file path, run ID, eval ID, or exact section>
Impact: <why future skill behavior suffers>
Fix: <smallest strong edit>
```

Avoid vague findings like "make it clearer." Name the phrase, section, or evidence row causing the risk.

## Surgical Update Rules

- Preserve name and folder unless rename is in scope.
- Preserve user-approved trigger meaning.
- Preserve output contract, tone, and runtime surface unless they are the problem.
- Keep unrelated resources unchanged.
- Delete stale or unreferenced files only when clearly superseded or unsafe.
- Prefer smaller changes when two edits protect behavior equally well.
- Reject edits that restate existing guidance or trade one ambiguity for another.
- Update `.meta-skill/spec.md` when behavior changes.
- Keep candidate edits inside the portable payload: `SKILL.md`, `agents/`, `references/`, `scripts/`, `assets/`.

## Output Contracts

For review-only mode, report findings ordered by severity, exact suggested replacements, validation commands, and risks intentionally left unresolved.

For edit mode, report files changed, behavior preserved, behavior changed, validation run and result, and residual risk.
