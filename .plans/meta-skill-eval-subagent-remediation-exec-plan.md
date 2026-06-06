# Meta Skill Eval And Subagent Remediation Exec Plan

## Goal

Make Meta Skill's eval and subagent loop trustworthy enough to use for rapid
skill iteration.

The target state:

- solver-visible tasks read like real user or maintainer requests
- harness metadata, criteria, expected answers, and benchmark framing stay out
  of solver contexts
- subagents remain isolated and their outputs become durable evidence
- plugin-level Meta Skill evals are either truly executable or clearly marked
  as scenario definitions until a plugin-bundle runner exists
- review evals receive the evidence they ask the agent to preserve
- the invalid `$research` eval evidence is deleted/invalidated and recreated
  only after the `$research` skill is actually available to the runtime that
  evaluates it

## Current Ground Truth

- `plugins/meta-skill/.meta-skill/evals/` contains plugin-level scenario evals.
- `plugins/meta-skill/.meta-skill/eval-guidance.md` already says these evals
  span multiple lane skills and are not yet executable through the single-root
  runner.
- `skills/research/` currently contains only:
  - `skills/research/SKILL.md`
  - `skills/research/agents/openai.yaml`
- Prior `$research` eval runs are invalid evidence because the agent did not
  actually have `$research` available in the skill cache/runtime. It performed
  offhand research instead of exercising the skill.
- If any `$research` `.meta-skill/` workbench, eval folders, run folders,
  generated plugin copies, or cached invalid artifacts reappear, delete them
  before creating new evals.

## Non-Goals

- Do not build a public registry.
- Do not add side-by-side uplift scoring until the existing one-source run
  evidence is honest and readable.
- Do not make subagents autonomous editors over shared files.
- Do not preserve compatibility for old `case.md`, `eval.md`, `criteria.md`,
  `R/F/G`, or `tests/unit` shapes.

## Phase 0: Evidence Quarantine And Tree Audit

Purpose: prevent bad evidence from being reused.

Actions:

1. Search for invalid `$research` workbench and run evidence:
   - `find skills/research -maxdepth 5 -type f`
   - `find plugins/codex/agent/skills/research plugins/claude/agent/skills/research -maxdepth 5 -type f`
   - `rg -n "research-runtime-contract|001-first-pass|004-explicit-boundary-task|local-only repo-inspection|research eval" skills plugins .plans`
2. Delete only invalid `$research` authoring/evidence artifacts:
   - `skills/research/.meta-skill/`
   - generated package copies for `research` if they were produced from the invalid run
   - any saved run evidence that claims `$research` was evaluated before the skill was available
3. Keep the portable `$research` source payload unless the user explicitly asks
   to redesign it:
   - `skills/research/SKILL.md`
   - `skills/research/agents/openai.yaml`
4. Add a short note to the final implementation report: "Previous `$research`
   eval evidence is invalid because `$research` was unavailable to the agent
   runtime; it was not used as improvement evidence."

Acceptance:

- No `$research` `.meta-skill/evals`, `.meta-skill/runs`, `.meta-skill/review.md`,
  or generated plugin copies remain unless freshly recreated after Phase 7.
- `git status --short --untracked-files=all` shows only the intended portable
  `$research` source files or a clean tree.

## Phase 1: Remove Harness Language From Solver Contexts

Purpose: the agent being measured should not know it is inside a test harness.

Actions:

1. Change `plugins/meta-skill/src/app-server/runner.ts` so `baseInstructions`
   and `developerInstructions` no longer say:
   - "eval"
   - "test"
   - "benchmark"
   - "no skill is mounted for this eval"
2. Replace with neutral runtime framing:
   - mounted payload: "Use the provided skill guidance to answer the user's request."
   - no-skill control: "Answer the user's request directly using the provided files."
   - shared: "Do not modify files. Return the final answer you would give the user."
3. Add/adjust runner tests to assert solver-visible instructions exclude banned
   harness terms.
4. Hard-cut `Capability:` and `Topics:` out of eval definitions.
   - delete those fields entirely instead of moving them elsewhere
   - keep `task.md` to title, problem description, output specification, task,
     and optional follow-up turns
   - update parser, generator, docs, tests, and existing eval files together

Acceptance:

- Unit tests fail if runner-visible instructions include harness framing.
- Existing eval tasks no longer expose parser-only metadata to the solver if the
  hard cut is adopted.

## Phase 2: Make Review Evals Fixture-Backed

Purpose: stop asking agents to preserve evidence they cannot see.

Actions:

1. Pick one canonical review eval surface:
   - preferred: keep plugin-level `complete-quality-review`
   - remove or narrow the duplicate improve-skill-local review eval unless it
     tests a genuinely different skill-local behavior
2. Add solver-visible fixtures for review tasks because these tasks require
   generated review evidence. Fixtures are not mandatory for every eval type;
   they should be facilitated by Evaluate Skill or provided by the user only
   when the task depends on local files, source packets, screenshots, or
   generated evidence. Research and knowledge-work evals often need no local
   fixture.
   Example review fixtures:
   - `fixtures/review.md`
   - `fixtures/eval-scenarios.md`
   - selected `fixtures/criteria/*.json` when the review should mirror dimensions
   - optional `fixtures/lint-output.txt`
3. Update `criteria.json.fixtures` to list those files.
4. Update `task.md` to tell the maintainer-style story without saying the agent
   is in an eval.
5. Strengthen criteria so Validation is judged only from fixture evidence:
   - deterministic validation rows must be preserved exactly
   - missing evidence must be reported as missing
   - invented lint output, run IDs, evidence files, or scores fail the eval

Acceptance:

- The review eval can be sampled by a subagent that sees only task plus fixtures.
- The expected answer can complete the review without inventing evidence.
- Deterministic tests cover "review eval references review.md but fixture is missing."

## Phase 3: Persist Subagent Eval Evidence

Purpose: make subagent sampling auditable instead of session-only.

Actions:

1. Define a lightweight evidence folder for manual/subagent samples under a run:

   ```text
   .meta-skill/runs/<run-id>/
     subagents/
       <eval-or-sample-id>/
         prompt.md
         visible-files.txt
         response.md
         parent-grade.md
         metadata.json
   ```

2. `metadata.json` should include:
   - pattern name from `references/subagent-patterns.md`
   - read-only vs write scope
   - target files supplied
   - hidden criteria path retained by parent, if any
   - source session/thread id when available
   - parent decision: pass, partial, fail, or review-only
3. Add docs to `references/subagent-patterns.md`, `evaluate-skill`, and
   `eval-guidance.md`.
4. Add deterministic tests for evidence shape. This can start as a documented
   manual shape test before a CLI writer exists.

Acceptance:

- A five-subagent eval round can be reconstructed from files without reading
  Codex session JSONL.
- Final reports cite saved sample evidence paths instead of only session lines.

## Phase 4: Fix Run Outcome Semantics

Purpose: make run outputs honest when a case errors.

Actions:

1. Change `plugins/meta-skill/src/eval/run.ts` result shape from a flat
   `evals: string[]` to per-eval outcomes:

   ```ts
   {
     folder: string;
     status: "completed" | "errored";
     error?: string;
     evidencePath: string;
   }
   ```

2. Keep CLI output deterministic and ordered by eval folder.
3. Update tests for:
   - one successful eval
   - one errored eval
   - mixed success/error
   - lint failures after execution
4. Update `evaluate-skill` reporting guidance to say:
   - selected evals
   - attempted evals
   - completed evals
   - errored evals
   - saved evidence paths

Acceptance:

- A failed eval can no longer appear merely as "completed" in the result.
- Final reports naturally say what ran and what failed.

## Phase 5: Harden Deterministic Test Execution

Purpose: keep user-authored deterministic tests inside a clearer execution boundary.

Actions:

1. Change deterministic test discovery to store:
   - absolute executable path
   - display command
   - argv array if arguments are ever supported
2. Replace shell-string `execAsync(test.command)` with `execFile` or `spawn`.
3. Skip execution when test discovery has structural failures such as:
   - nested folders
   - invalid test IDs
   - duplicate test IDs
4. Add tests for paths with spaces and invalid IDs.

Acceptance:

- Deterministic tests no longer execute through a shell command string.
- Invalid test structure blocks execution instead of mixing structure failures
  with runtime output.

## Phase 6: Make Skill Availability A Precondition For Evals

Purpose: prevent the `$research` failure class from recurring.

Actions:

1. Add an eval preflight that records how the skill will be made available:
   - forced payload mount from the working skill root
   - installed plugin/cache invocation
   - no-skill control
2. Before running an eval that claims to test a skill, verify one of:
   - working payload was mounted from the target root
   - the named skill is present in the active skill/plugin cache
3. Store the availability check in run evidence:

   ```json
   {
     "skillAvailability": {
       "mode": "working_payload",
       "skillRoot": "payload",
       "skillName": "research",
       "verified": true
     }
   }
   ```

4. Update Evaluate Skill docs:
   - installed-cache absence invalidates cache-invocation evals
   - use working-payload mounting for uninstalled local skill drafts
   - rerun evals after `scripts/sync-plugins.sh` only when the goal is installed
     plugin behavior
5. Add a regression test using a fake missing skill name.

Acceptance:

- The runner refuses or clearly marks any run where the target skill was not
  available through the selected mode.
- A future `$research` eval cannot silently become a no-skill/offhand run.

## Phase 7: Redo `$research` Evals From Scratch

Purpose: replace invalid evidence with real skill behavior evidence.

Preconditions:

- Phase 0 completed.
- Phase 6 availability preflight exists.
- `skills/research` has passed `meta-skill lint`.
- Decide target mode:
  - draft skill behavior: run via working-payload mount from `skills/research`
  - installed Agent plugin behavior: run `scripts/sync-plugins.sh`, confirm
    `$research` is present in the installed/cache plugin surface, then run

Actions:

1. Recreate `.meta-skill/` for `skills/research` only after preconditions pass.
2. Author `.meta-skill/eval-scenarios.md` from observed failures and intended
   boundaries, not from the invalid prior run.
3. Author 3-5 fresh evals:
   - explicit current/external research request
   - deep research request with source-quality pressure
   - local-only repo inspection request that should be rejected or rerouted
   - stale/current information recency check
   - contradiction/source-disagreement handling
4. Add fixtures where needed.
5. Run working-payload evals and inspect evidence.
6. Use `improve-skill` only for evidence-backed edits.
7. If installed plugin behavior matters, sync the plugin and rerun a smaller
   installed-cache confirmation set.

Acceptance:

- New `$research` run evidence records verified skill availability.
- No claim relies on the invalid previous research evals.
- Any failing boundary eval is recorded as failure evidence, not papered over.

## Phase 8: Plugin-Level Eval Runner Decision

Purpose: resolve the mismatch between plugin-level Meta Skill evals and the
single-skill runner.

Decision options:

1. Keep plugin-level evals as manual scenario definitions for now.
   - Rename docs to "scenario definitions" where needed.
   - Do not call them executable proof.
2. Add a plugin-bundle runner mode.
   - Mount multiple lane skills.
   - Record active lane and selected skill availability.
   - Keep criteria hidden.
3. Split plugin-level evals into lane-local skill projects.
   - Each lane gets executable evals under its own `.meta-skill/`.
   - Router evals remain manual or get a special runner.

Recommended path:

- Short term: option 1 plus clear docs.
- Medium term: option 2 if Meta Skill plugin self-eval remains important.

Acceptance:

- No doc or report implies plugin-level self-evals are executable through the
  current single-root runner unless that support exists.

## Phase 9: Clean Public Metadata And Packaging Boundaries

Purpose: finish the user-facing refactor.

Actions:

1. Update `plugins/meta-skill/.codex-plugin/plugin.json`:
   - use `create-skill`, `evaluate-skill`, `improve-skill`
   - remove "App Server-backed" from the public description
   - describe user-facing jobs and evidence outcomes
2. Extend routing-surface checks to plugin manifest interface text.
3. Decide shared reference packaging:
   - plugin-scoped lanes may link `../../references/*` without warnings, or
   - package/export copies shared references into lane-local payloads
4. Update lint warning behavior to match the decision.

Acceptance:

- Skill metadata, OpenAI metadata, and plugin metadata all use current lane
  names and user-facing language.
- Lint warnings reflect real risks, not accepted architecture.

## Phase 10: Parallel/Subagent Safety Before First-Class Parallelism

Purpose: use subagents aggressively without corrupting work.

Actions:

1. Add parent orchestration rules to `references/subagent-patterns.md`:
   - reserve file scopes before spawning subagents
   - never spawn two editors for the same file
   - write scopes must be disjoint
   - parent merges and validates
   - generated evidence folders are owned by one worker
2. Add a "do not duplicate target" checklist to subagent reporting.
3. Before parallel App Server eval execution, refactor runner state:
   - one runner/client/trace recorder per active worker
   - stable case indexes
   - ordered reporting independent of completion order
4. Keep App Server worker-pool parallelism separate from Codex child-thread
   subagent sampling.

Acceptance:

- Parallel subagent sessions cannot produce the `$research` contradictory-output
  failure without violating documented preflight.
- App Server parallelism has its own design and tests before exposure.

## Validation Plan

Run after implementation:

```bash
node plugins/meta-skill/scripts/meta-skill.js lint plugins/meta-skill/skills/create-skill
node plugins/meta-skill/scripts/meta-skill.js lint plugins/meta-skill/skills/evaluate-skill
node plugins/meta-skill/scripts/meta-skill.js lint plugins/meta-skill/skills/improve-skill
node plugins/meta-skill/scripts/meta-skill.js lint plugins/meta-skill/skills/meta-skill
for test in plugins/meta-skill/.meta-skill/tests/*.sh; do "$test"; done
npm --prefix plugins/meta-skill test
npm --prefix plugins/meta-skill run typecheck
git diff --check -- plugins/meta-skill skills/research .plans
```

When `skills/`, `.codex/agents/`, `plugins/codex/agent/assets/`, or
`AGENTS.md` changes, also run:

```bash
scripts/sync-plugins.sh
```

For `$research` specifically:

```bash
node plugins/meta-skill/scripts/meta-skill.js lint skills/research
node plugins/meta-skill/scripts/meta-skill.js run skills/research
```

Only run installed-plugin/cache behavior checks after `scripts/sync-plugins.sh`
and after confirming `$research` is available in the intended runtime surface.

## Issue Mapping

| Prior issue | Covered by |
|---|---|
| Review evals require missing evidence | Phase 2 |
| Runner says it is executing an eval | Phase 1 |
| Same target delegated twice with contradictory outcomes | Phases 0, 7, 10 |
| Plugin self-evals are not executable as one plugin suite | Phase 8 |
| Subagent evidence lives only in session text | Phase 3 |
| Solver-visible metadata in `task.md` | Phase 1 |
| Eval generation is draft-quality | Phases 2, 7 |
| Run results blur attempted vs successful | Phase 4 |
| Command truth is easy to overclaim | Removed from this plan per current direction |
| Plugin metadata is stale | Phase 9 |
| Shared reference packaging unresolved | Phase 9 |
| Deterministic tests execute through shell strings | Phase 5 |
| Runner is not parallel-ready | Phase 10 |
| Evals test planning more than execution | Phases 2, 7, 8 |
| Duplicate review eval surfaces drift | Phase 2 |
| `$grill`/skill-flow git and durable-capture risk | Phase 10 and follow-up skill-specific review |
| `$research` invalid evals from unavailable skill | Phases 0, 6, 7 |
