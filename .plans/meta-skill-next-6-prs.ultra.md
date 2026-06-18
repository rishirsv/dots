# Meta-Skill Next 6 PRs Ultraplan

Mode: Focused Ultraplan. Six subagents each received `dots:ultraplan` and one
PR. Parent synthesis re-checked the main CLI, manifest, report, lint, runner,
grading, workbench, staging, architecture, and evaluator docs before writing.

Stop condition: this is planning only. Do not implement from this pass without
an explicit follow-up approval.

## Implementation Brief

Keep the first six PRs small and sequential. PR 1 should clear stale source and
generated-package language before code plans cite architecture docs. PRs 2, 5,
and 6 build the evaluation substrate. PRs 3 and 4 improve authoring and curation
without creating new runner or optimizer layers.

General constraints:

- Edit source under `plugins/meta-skill/` and `plugins/dots/` only when the PR
  explicitly touches those sources.
- Do not edit installed plugin caches, generated packages, or local synced
  config targets.
- Keep `.meta-skill/evals.json` as the suite metadata owner and `task.md` as
  visible task text only.
- Prefer additive JSON fields and warning-level lint checks over hard schema
  breaks unless the PR states otherwise.
- Use focused stdlib tests under `plugins/meta-skill/tests/` or extend
  `plugins/meta-skill/src/characterize_meta_skill.py` when the change crosses
  manifest, runner, grading, and reporting behavior.

## Verified Re-scope Summary

| PR | Final scope | Size |
|---:|---|---|
| 1 | Docs-only architecture source/generated boundary cleanup | Small prompt |
| 2 | Finish and propagate case metadata already partly present | Medium |
| 3 | Add `eval curate` as a scaffold over existing workbench primitives | Medium |
| 4 | Harden `eval lint` trigger-balance aliases and tests | Small |
| 5 | Grade hidden reference solutions as oracle checks, separate from trials | Medium-large |
| 6 | Make existing `split` and `--split` auditable in lint/run/report | Medium |

## PR 1: Architecture Hygiene

Implementation prompt:

Update only `plugins/meta-skill/.meta-skill/docs/ARCHITECTURE.md` so future
agents can trust the source/generated boundary.

Scope in:

- Replace repo-root source path claims like `meta-skill/skills/`,
  `meta-skill/src/`, and `meta-skill/.meta-skill/docs/` with
  `plugins/meta-skill/...` where the text refers to this repo source tree.
- Replace generated package copy paths `plugins/codex/meta-skill/` and
  `plugins/claude/meta-skill/` with the ignored `dist/` package outputs used by
  `scripts/package-plugins.sh`.
- Fix stale table-of-contents phrasing such as `Sync And Generated Packages` if
  it no longer matches the current section title.
- Reword package/install language so source, ignored generated packages, and
  machine-local install/cache outputs are distinct.
- Do not assert that generated Meta-Skill packages include `src/` unless the
  package script and plugin manifest prove that copied surface.

Scope out:

- No code changes.
- No edits to `scripts/package-plugins.sh`, `plugins/meta-skill/plugin.json`,
  `.gitignore`, caches, installed plugins, or `dist/`.
- No package generation as part of this PR unless a later implementation
  discovers a docs-only check requires it.

Validation:

```sh
rg -n 'plugins/codex/meta-skill|plugins/claude/meta-skill|Sync And Generated Packages|sync work|Install or refresh local plugins|When editing anything under `meta-skill/`|python3 meta-skill/|validate meta-skill/' plugins/meta-skill/.meta-skill/docs/ARCHITECTURE.md
rg -n 'meta-skill/(skills|references|src|\.meta-skill)' plugins/meta-skill/.meta-skill/docs/ARCHITECTURE.md
scripts/verify.sh
```

Acceptance:

- `ARCHITECTURE.md` consistently names `plugins/meta-skill/` as source.
- Generated packages are described as ignored `dist/` outputs, not source.
- Local install/cache refresh is not presented as source work.
- Package-copy claims match current `scripts/package-plugins.sh` and
  `plugins/meta-skill/plugin.json`, or avoid overclaiming.

## PR 2: Case Metadata

Re-scope: finish and propagate case metadata. The roadmap says to add `type`
and `split`, but those already exist in normalization and selection. The missing
work is preserving and surfacing `source`, `risk`, `tags`, and `owner`, then
snapshotting all case metadata into run/report artifacts.

File targets:

- `plugins/meta-skill/src/meta_skill/manifest.py`
- `plugins/meta-skill/src/meta_skill/artifacts.py`
- `plugins/meta-skill/src/meta_skill/runner.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/src/meta_skill/linting.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/references/evaluations.md`
- `plugins/meta-skill/.meta-skill/docs/ARCHITECTURE.md`
- `plugins/meta-skill/tests/test_eval_metadata.py`

Contract:

```json
{
  "id": "activation-near-miss",
  "type": "negative_control",
  "source": "user-report-2026-06-15",
  "risk": "high",
  "tags": ["triggering", "boundary"],
  "owner": "skill-evaluator",
  "split": "gate",
  "prompt": "..."
}
```

Implementation steps:

1. Add `CASE_METADATA_FIELDS` and `case_metadata(case)` in `manifest.py`.
2. Preserve `source`, `risk`, `tags`, and `owner` in
   `normalize_prompt_manifest`; keep existing `type` and `split`.
3. Validate shapes in `load_manifest`:
   `source`, `risk`, `owner`, `type`, and `split` are optional non-empty
   strings; `tags` is an optional list of non-empty strings.
4. Keep `risk` a soft convention in this PR. Recommend `low`, `medium`, and
   `high` in docs and lint stats, but do not hard-fail custom values.
5. Snapshot metadata into queued trial records in `runner.py` through
   `artifacts.trial_record` so reports describe what actually ran even if the
   suite file changes later.
6. Carry `case_metadata` through `report.py` trial objects, impact rows, and
   compare rows. Render a compact `Task Coverage` Markdown table rather than
   widening every trial table.
7. Add lint stats for `splits`, `task_sources`, `task_risks`, `task_tags`, and
   `task_owners`. Do not warn on missing source, owner, risk, or tags by
   default.
8. Update docs with the metadata contract and clarify that task `source` means
   task provenance, not candidate source.

Tests:

- Prompt-manifest normalization preserves all metadata fields.
- Direct `cases[]` manifests preserve the same fields.
- Invalid `tags` and scalar field shapes fail cleanly.
- `select_cases(..., split)` remains backward compatible.
- Synthetic run/report fixtures include metadata without re-reading a mutated
  manifest.
- Old run rows containing only `case_id` still report without crashing.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_metadata.py
python3 plugins/meta-skill/tests/test_assist_package.py
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-evaluator --json
scripts/verify.sh
```

Acceptance:

- All six metadata fields survive prompt manifests, suite manifests, run
  records, JSON reports, Markdown reports, and comparisons where relevant.
- Existing unsplit and metadata-free suites still work.
- Lint reports metadata distributions without turning metadata into hard
  authoring bureaucracy.

## PR 3: Case Curation

Re-scope: add a small `eval curate` workflow that scaffolds runnable eval tasks
from real signals into the existing workbench model. Do not create a new
evaluator, runner, staging layer, grader, or metadata store.

Command shape:

```sh
plugins/meta-skill/scripts/metaskill eval curate \
  --suite .meta-skill/evals.json \
  --id <case-id> \
  --type failure|regression|capability|trigger|negative_control|gate \
  --task "visible task text" \
  --expectation "hidden grading expectation" \
  [--source <path|->] \
  [--from-run <run-dir> --trial <trial-id>] \
  [--judge-file <path>] \
  [--expected-file <path>] \
  [--validator <path>] \
  [--human-metric <name>] \
  [--force] [--dry-run] [--json]
```

File targets:

- Add `plugins/meta-skill/src/meta_skill/curation.py`.
- Update `plugins/meta-skill/src/meta_skill/cli.py`.
- Update `plugins/meta-skill/references/cli.md`.
- Update `plugins/meta-skill/skills/skill-evaluator/SKILL.md`.
- Update `plugins/meta-skill/skills/skill-evaluator/references/evaluations.md`.
- Add `plugins/meta-skill/tests/test_eval_curate.py`.

Workflow boundaries:

- `task.md` receives only visible user-facing task bytes.
- Hidden criteria go to `evals.json`, `judge.md`, `expected.*`, `validate.*`,
  or human grader declarations.
- `--source -` or `--source <path>` must be explicit. Do not silently copy raw
  transcripts into visible task text.
- `--from-run --trial` may read run/result/evidence paths to scaffold a case,
  but must not create grades, comparisons, reports, candidate fixes, or edited
  skill payloads.
- Require at least one grading path: `--expectation`, `--judge-file`,
  `--expected-file`, `--validator`, or `--human-metric`, unless the PR
  deliberately adds an explicit `--allow-ungraded` flag.

Implementation steps:

1. Implement curation helpers that load or initialize the suite, validate the
   case id with existing slug rules, and append or replace a case entry.
2. Write or preview `.meta-skill/cases/<case-id>/task.md` with visible task
   text only.
3. Copy hidden judge, expected, validator, or human-grader material into the
   case folder or manifest fields using existing safe case path rules.
4. Support `--dry-run` by returning the planned manifest and file changes
   without writing.
5. Return lint warnings in JSON after a successful curate operation so the
   author immediately sees missing balance or grader issues.
6. Document that curation creates runnable eval material only; it does not
   prove behavior.

Tests:

- Creates a new suite case and case folder.
- Writes visible and hidden material to separate places.
- Supports dry-run without writes.
- Refuses duplicate case IDs unless `--force`.
- Refuses path traversal.
- Supports stdin source without leaking it into `task.md`.
- Can scaffold from a fake run directory/trial result.
- Surfaces `lint_suite` warnings in JSON.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_curate.py
python3 plugins/meta-skill/tests/test_assist_package.py
scripts/verify.sh
```

Acceptance:

- A user can turn a bug, transcript, manual check, or pasted example into a
  runnable case without hand-editing every workbench file.
- The command preserves hidden-boundary rules.
- Existing `eval lint`, `eval materialize`, `eval run`, `eval grade`,
  `eval human`, and `eval report` remain the downstream lifecycle.

## PR 4: Trigger Balance

Implementation prompt:

Improve `plugins/meta-skill/src/meta_skill/linting.py` so `metaskill eval lint`
recognizes paired positive and negative trigger prompts, including
`should_trigger` / `should-trigger` and `should_not_trigger` /
`should-not-trigger` aliases. Keep this as eval-manifest linting, not
`metaskill validate` payload validation.

Scope in:

- Add `normalize_case_type(value)` and `trigger_balance_kind(case_type)` helpers
  in `linting.py`.
- Positive aliases: `trigger`, `implicit_trigger`, `activation`,
  `should_trigger`.
- Negative aliases: `negative_control`, `boundary`, `near_miss`,
  `should_not_trigger`.
- Keep warnings advisory, not blocking.
- Add a symmetric warning when a suite has only negative or boundary tasks and
  no positive trigger task.
- Add `plugins/meta-skill/tests/test_eval_linting.py` with focused stdlib
  tests.
- Wire the new deterministic test into `scripts/verify.sh`, either explicitly
  or through a small `test_*.py` loop under `plugins/meta-skill/tests`.

Scope out:

- Do not change `validate_skill.py`.
- Do not require finalized `SKILL.md` payloads to contain trigger examples.
- Do not introduce new runner behavior.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_linting.py
python3 -m py_compile plugins/meta-skill/src/meta_skill/linting.py
plugins/meta-skill/scripts/metaskill eval lint --suite <temp-evals.json> --json
scripts/verify.sh
```

Acceptance:

- One-sided positive trigger suites warn.
- One-sided negative or boundary suites warn.
- Paired should-trigger / should-not-trigger suites do not warn.
- Existing `trigger` plus `near_miss` behavior remains valid.
- Non-trigger quality suites do not receive trigger-balance warnings.

## PR 5: Reference Solution

Re-scope: add hidden reference-solution proof to the evaluator harness. Do not
create a new eval taxonomy or make reference solutions into real candidates.
References should prove graders and tasks can pass a known-good answer.

Contract:

```json
{
  "reference_solutions": [
    { "id": "canonical", "path": "expected.md" }
  ]
}
```

Also accept singular `reference_solution` as a convenience and normalize it to
the list.

File targets:

- `plugins/meta-skill/src/meta_skill/manifest.py`
- `plugins/meta-skill/src/meta_skill/grading.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/src/meta_skill/staging.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/references/evaluations.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- Characterization tests or focused test files under `plugins/meta-skill/tests/`

Implementation steps:

1. Validate `reference_solutions[]` in `manifest.py`: slug ids, non-empty
   case-relative paths, no absolute paths, no `..`.
2. Keep reference files hidden. Use existing `safe_case_file()` and do not
   stage reference files into agent workspaces.
3. Extend `eval grade`, not `eval run`. Real candidates still run through
   `runner.py`; references are known-good outputs graded after candidate
   results exist.
4. For each reference solution, copy the hidden reference output into a
   run-local proof path such as
   `references/<case-id>/<reference-id>/response.md`.
5. Grade the reference output through the same code/model grader path used for
   real trials.
6. Write separate `reference_results.jsonl` and `reference_grades.jsonl` so
   reference checks do not pollute candidate trial totals.
7. Extend `report.py` with `reference_checks[]`: `case_id`, `reference_id`,
   `state`, grader summaries, failed gates, and run-relative paths.
8. Add `needs_attention` items such as `reference_failed`,
   `reference_unknown`, or `missing_reference_result`.
9. Preserve current impact categories. Add an optional diagnosis field such as
   `task_or_grader_broken` when all candidates fail and the reference fails,
   and `candidates_failed_known_solvable_task` when all candidates fail but the
   reference passes.

Tests:

- Manifest accepts singular and list forms.
- Manifest rejects invalid ids, absolute paths, and path traversal.
- Reference files are not staged into workspaces.
- Failing candidate plus passing reference writes reference grade files and
  reports reference `pass`.
- Broken-grader fixture makes the reference fail and emits
  `reference_failed`.
- Reports preserve existing impact categories while adding diagnosis.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/src/characterize_meta_skill.py
python3 plugins/meta-skill/tests/test_assist_package.py
scripts/verify.sh
```

Acceptance:

- A case can declare at least one hidden reference solution.
- `eval grade` proves automated graders can pass that reference without running
  an agent.
- `eval report --json` and Markdown surface reference pass/fail/unknown.
- A 0 percent candidate pass-rate task with a failing reference is diagnosed as
  task, grader, or harness suspect.
- Existing candidate/trial terminology and impact categories remain backward
  compatible.

## PR 6: Splits

Re-scope: split discipline is observability and guardrails around the existing
`split` field and `eval run --split`, not a new split engine or optimizer.

Minimal contract:

- Keep split metadata in `.meta-skill/evals.json` / normalized `cases[]`.
- Support optional case-level `split`.
- Canonical roles: `train`, `validation`, `test`. Custom roles may remain
  warning-level unless the implementation discovers a strong reason to hard
  fail.
- Existing unsplit suites continue to work.
- When any case uses a split, lint should warn on cases without one.

Semantics:

- `train`: allowed for iterative prompt and skill edits.
- `validation`: allowed for candidate selection and grader calibration.
- `test`: held-out final evidence. Do not tune against it during repeated
  optimization.

File targets:

- `plugins/meta-skill/src/meta_skill/manifest.py`
- `plugins/meta-skill/src/meta_skill/linting.py`
- `plugins/meta-skill/src/meta_skill/runner.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- `plugins/meta-skill/skills/skill-evaluator/references/eval-types.md`

Implementation steps:

1. Validate `split` as an optional non-empty string in `manifest.py`; keep hard
   validation minimal.
2. Add split stats and warnings in `linting.py`: distribution, mixed
   split/unsplit suites, no held-out `test` split when a suite looks intended
   for repeated optimization, and tiny test split as advisory.
3. Preserve current `eval run --split <name>` equality filtering.
4. Record selection metadata in `run.json`, for example:
   `selection: {"split": args.split, "candidates": args.candidates,
   "repetitions_override": args.repetitions}`.
5. Add `split` to queued trial records and result rows so reports do not need
   to infer from the mutable manifest.
6. Add split to JSON trial objects, totals by split, and Markdown methodology
   or selection output.
7. Update docs to distinguish ordinary unsplit local loops from repeated
   optimization, which needs held-out tasks.

Tests:

- Prompt-manifest normalization preserves split.
- Lint reports split stats and mixed split/unsplit warnings.
- `eval run --split validation` plans only validation cases and records the
  selected split metadata.
- Report JSON and Markdown expose split and totals by split.
- Existing unsplit suites still work.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/src/characterize_meta_skill.py
python3 plugins/meta-skill/tests/test_assist_package.py
scripts/verify.sh
```

Acceptance:

- `eval lint --json` reports split distribution and warnings.
- `eval run --split validation --json` runs only matching cases and records the
  selected split in run artifacts.
- `eval report --json` and Markdown expose split methodology and per-trial
  split.
- Docs explain when split discipline is required.
- No optimizer state, experiment history, or autonomous edit loop ships in this
  PR.

## Verification Matrix

| PR | Minimum validation |
|---:|---|
| 1 | Targeted `rg` checks over `ARCHITECTURE.md`, then `scripts/verify.sh` |
| 2 | `test_eval_metadata.py`, evaluator skill validation, `scripts/verify.sh` |
| 3 | `test_eval_curate.py`, `test_assist_package.py`, `scripts/verify.sh` |
| 4 | `test_eval_linting.py`, `py_compile linting.py`, `scripts/verify.sh` |
| 5 | Characterization or focused grading/report tests, `scripts/verify.sh` |
| 6 | Characterization or focused split/report tests, `scripts/verify.sh` |

## Open Decisions

- PR 2: keep `risk` as a soft convention or make it a strict enum. Recommended:
  soft convention in PR 2.
- PR 3: whether to include `--allow-ungraded`. Recommended: defer unless a real
  curation case needs it.
- PR 5: exact JSON names for reference proof files and diagnosis fields.
  Recommended: `reference_solutions[]`, `reference_results.jsonl`,
  `reference_grades.jsonl`, and optional `diagnosis`.
- PR 6: whether custom split names are allowed. Recommended: allow them with
  warnings, while documenting `train`, `validation`, and `test` as canonical.
