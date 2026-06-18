# Meta-Skill PRs 8, 14, 15 Ultraplan

Mode: Lean Ultraplan. The seed rows came from the interactive roadmap report.
Parent synthesis re-checked the current evaluator, grading, calibration,
runner, candidate, report, CLI, architecture, and skill-evaluator docs before
writing this plan.

Stop condition: this is planning only. Do not implement from this pass without
an explicit follow-up approval.

## Implementation Brief

These three PRs are related, but they should not be bundled. PR 8 improves the
quality signal for subjective comparisons. PR 14 makes existing and new signals
inspectable by a human. PR 15 adds optimization discipline only after the
evaluation substrate can protect against overfitting.

General constraints:

- Edit source under `plugins/meta-skill/` only unless a later PR explicitly
  touches another plugin source.
- Do not edit installed plugin caches, generated packages, or local synced
  config targets.
- Keep evaluator artifacts in `.meta-skill/` workbench output. Do not create a
  second run store for comparisons, reports, or optimization.
- Preserve the existing Markdown report behavior. HTML reporting must be an
  additive format.
- Keep PR 15 non-autonomous by default. Candidate edits are still made by a
  human or a later explicit skill-doctor flow; the optimizer lane records,
  checks, and gates attempts.

## Verified Re-scope Summary

| PR | Final scope | Size |
|---:|---|---|
| 8 | Add blinded pairwise grading artifacts and summaries beside existing absolute grades | Medium-large |
| 14 | Add an HTML format to the existing report pipeline, with review-oriented sections | Medium |
| 15 | Add a dependency-gated manual optimizer ledger and commands over existing runs/candidates | Large, gated |

Dependency order:

1. PR 8 can land after normal grading and report fixtures exist.
2. PR 14 can land before or after PR 8, but it should display pairwise rows when
   present.
3. PR 15 should not land as a real optimization lane until split discipline,
   hidden reference/gate checks, promotion gates, and review visibility exist.
   Treat PRs 5, 6, 8, 12, and 14 as practical prerequisites unless the scope is
   deliberately narrowed to ledger-only groundwork.

## PR 8: Blind Comparison

Re-scope: add a blinded pairwise comparison path alongside existing grade rows.
Do not replace absolute grades, the current compare command, or calibration
artifacts.

User story:

As a reviewer, I can compare two candidate outputs without knowing which output
belongs to which candidate, then see the unblinded result only after the
decision is recorded.

File targets:

- `plugins/meta-skill/src/meta_skill/grading.py`
- `plugins/meta-skill/src/meta_skill/calibration.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/src/meta_skill/cli.py`
- `plugins/meta-skill/src/meta_skill/manifest.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/SKILL.md`
- `plugins/meta-skill/skills/skill-evaluator/references/eval-types.md`
- `plugins/meta-skill/skills/skill-evaluator/references/calibration.md`
- `plugins/meta-skill/tests/test_eval_pairwise.py`

Command and manifest shape:

Use the existing grader model and add a comparison mode rather than a new grader
kind.

```json
{
  "graders": [
    {
      "id": "pairwise-usefulness",
      "kind": "model",
      "mode": "pairwise",
      "metric": "usefulness",
      "prompt": "Prefer the response that better satisfies the task without adding unsupported claims."
    }
  ]
}
```

`mode` defaults to `absolute` for existing `model`, `code`, and `human`
graders. Only `model` and `human` need to support `pairwise` in this PR unless
the implementation discovers a clean reason to support code-based pairwise
checks.

Artifact contract:

Write pairwise decisions to a comparison-specific JSONL artifact, for example
`pairwise_grades.jsonl`, rather than forcing cross-trial comparisons into the
single-trial grade row shape.

Minimum row shape:

```json
{
  "run_id": "20260615T000000Z",
  "comparison_id": "activation-near-miss.current.branch-x.1",
  "case_id": "activation-near-miss",
  "metric": "usefulness",
  "grader_id": "pairwise-usefulness",
  "blind_labels": {
    "A": "trial-uuid-1",
    "B": "trial-uuid-2"
  },
  "candidate_labels": {
    "A": "current",
    "B": "branch-x"
  },
  "winner": "A",
  "unblinded_winner": "current",
  "tie": false,
  "rationale": "...",
  "created_at": "..."
}
```

The judge prompt should see only the task, the evaluation criterion, and
responses labeled `A` and `B`. It must not see candidate names, branch names, or
trial IDs before the decision is produced. The stored artifact may include the
mapping so reports can unblind after the decision.

Randomization:

- Randomize A/B order for each case, candidate pair, metric, and repetition.
- Use a deterministic seed derived from stable run data so rerendering reports
  does not change historical comparisons.
- Store the A/B mapping in the artifact, not in the prompt text.
- Include tie and unable-to-decide states. Do not coerce all outputs into a
  winner.

Implementation steps:

1. Extend grader normalization to accept optional `mode`.
2. Add a helper that groups comparable trials by `case_id`, split, repetition,
   and candidate pair.
3. Build blinded comparison packets from existing result/evidence artifacts.
4. Add model pairwise judging with strict output parsing for `A`, `B`, `tie`,
   or `unknown`.
5. Add human pairwise review packets using the same blinded A/B payload.
6. Persist pairwise rows to a dedicated artifact and include them in report
   model construction.
7. Update `eval grade` so pairwise graders run after needed trial outputs
   exist and skip cleanly when fewer than two comparable candidates are present.
8. Add report summaries:
   candidate win/loss/tie counts, per-case comparisons, and missing-comparison
   warnings.
9. Update calibration docs to explain that pairwise mode is a bias-control
   option, not a replacement for calibration.

Scope out:

- No automatic candidate editing.
- No tournament, Elo, or ranking engine.
- No web UI.
- No replacement of absolute grade metrics.
- No unblinded candidate names in judge prompts.

Tests:

- Existing absolute graders still normalize and run without `mode`.
- Pairwise graders are rejected when required fields are malformed.
- A/B assignment is deterministic for the same run inputs and changes across
  different comparison keys.
- The model-judge prompt excludes candidate labels and trial IDs.
- Pairwise artifact rows preserve enough mapping to unblind in reports.
- Missing or single-candidate runs produce an explicit skip, not a crash.
- Human pairwise packets hide candidate identity before the recorded decision.
- Markdown report includes pairwise summary when pairwise artifacts exist.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_pairwise.py
python3 plugins/meta-skill/tests/test_assist_package.py
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-evaluator --json
scripts/verify.sh
```

Acceptance:

- A suite can define a `mode: pairwise` grader without breaking existing
  graders.
- Pairwise decisions are blind at judging time and unblindable at reporting
  time.
- Reports can explain which candidate won, lost, tied, or lacked enough data.
- Calibration guidance names order/position bias and explains how randomized
  A/B comparison mitigates but does not eliminate it.

## PR 14: Review Report

Re-scope: add an HTML rendering mode to the existing report pipeline. Do not
create a separate review app, server, or metric engine.

User story:

As a human reviewer, I can open one HTML file and inspect tasks, candidate
outputs, grades, pairwise comparisons, trace pointers, and human-review status
without stitching together JSONL files by hand.

File targets:

- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/src/meta_skill/cli.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/SKILL.md`
- `plugins/meta-skill/skills/skill-evaluator/references/human-grading.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- `plugins/meta-skill/tests/test_eval_html_report.py`

Command shape:

Prefer extending the existing report command:

```sh
plugins/meta-skill/scripts/metaskill eval report \
  --run .meta-skill/runs/<run-id> \
  --format html \
  --out .meta-skill/reports/<run-id>.html
```

Keep the current Markdown behavior as the default. `--format markdown` should
produce the same output users already get.

Report sections:

- Run overview: suite, run ID, candidate IDs, split, counts, status, and
  attention summary.
- Coverage: cases by type, split, source, risk, tags, owner, and missing
  metadata where available.
- Candidate comparison: current impact rows, pass/fail deltas, score deltas,
  and needs-attention markers.
- Pairwise results: blinded decision summaries and unblinded candidate winners
  when PR 8 artifacts exist.
- Case review table: one row per case/candidate with grade labels, human status,
  trace/evidence pointers, and concise output snippets.
- Detail drawer or anchored section per case with full task text, selected
  outputs, rationales, and links to local evidence paths.
- Human queue: pending human grades, completed human grades, and calibration
  mismatches when present.
- Gate summary: hidden reference checks, split gates, and promotion blockers
  when earlier PR artifacts exist.

Implementation steps:

1. Keep `build_report` as the single source of report data.
2. Add `render_html(report)` or a small `html_report.py` helper if `report.py`
   becomes hard to read.
3. Use only stdlib escaping and inline CSS. Avoid external JS, CDN assets, or a
   local server requirement.
4. Add `--format markdown|html|json` only if JSON is already cheap from the
   report model; otherwise limit this PR to `markdown|html`.
5. Add `--out` for HTML and keep stdout support for Markdown.
6. Preserve stable anchors for cases and trials so trace links remain useful.
7. Truncate long outputs in tables but expose full text in detail sections.
8. Render absent optional artifacts as clear empty states, not exceptions.
9. Add docs that position the report as inspection output, not a grading source
   of truth.

Scope out:

- No browser automation requirement in the implementation PR unless visual
  styling is changed enough to warrant screenshot validation.
- No persistent review decisions in the HTML itself.
- No live filtering server.
- No charting library.
- No change to run, grade, compare, or calibration artifact ownership.

Tests:

- HTML escapes task, output, rationale, and path text.
- Existing Markdown output remains unchanged for a synthetic fixture.
- HTML report includes overview, case review, human status, trace pointers, and
  empty states.
- Pairwise, reference, split, and calibration sections render only when input
  artifacts exist.
- Long snippets are bounded in table cells.
- `--format html --out <path>` writes the file and refuses ambiguous output
  combinations cleanly.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_html_report.py
python3 plugins/meta-skill/tests/test_assist_package.py
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-evaluator --json
scripts/verify.sh
```

Acceptance:

- Reviewers can open one HTML artifact and understand the run without reading
  JSONL files first.
- Markdown report users see no behavior regression.
- Optional future artifacts appear when present and degrade gracefully when
  absent.
- The report is static, portable, and safe to open from disk.

## PR 15: Optimizer Lane

Re-scope: add a bounded manual optimization lane that records candidate attempts
and enforces held-out validation gates. Do not build a fully autonomous skill
rewriter in this PR.

User story:

As an optimizer, I can propose or receive a candidate edit, evaluate it against
train and validation splits, compare it with the baseline, and accept it only
when validation improves and required gates hold.

Start gate:

Do not start full PR 15 until these capabilities exist or the PR is explicitly
narrowed:

- PR 5 hidden reference or oracle checks.
- PR 6 auditable train, validation, held-out, and regression split behavior.
- PR 8 blind pairwise comparison for subjective candidate comparisons.
- PR 12 promotion gate or equivalent no-regression decision gate.
- PR 14 review report for human inspection.

If those are not landed, split PR 15 into a smaller `15a` that introduces only
the ledger schema and docs without optimization commands.

File targets:

- `plugins/meta-skill/src/meta_skill/optimization.py`
- `plugins/meta-skill/src/meta_skill/cli.py`
- `plugins/meta-skill/src/meta_skill/candidates.py`
- `plugins/meta-skill/src/meta_skill/report.py`
- `plugins/meta-skill/references/cli.md`
- `plugins/meta-skill/skills/skill-evaluator/SKILL.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- `plugins/meta-skill/skills/skill-evaluator/references/validations.md`
- `plugins/meta-skill/.meta-skill/docs/ARCHITECTURE.md`
- `plugins/meta-skill/tests/test_eval_optimize.py`

Command shape:

Start with explicit, auditable commands:

```sh
plugins/meta-skill/scripts/metaskill eval optimize init \
  --suite .meta-skill/evals.json \
  --baseline current \
  --budget 5 \
  --train-split train \
  --validation-split validation \
  --gate-split heldout

plugins/meta-skill/scripts/metaskill eval optimize record \
  --ledger .meta-skill/optimization/<id>/ledger.jsonl \
  --attempt attempt-001 \
  --candidate branch:skill-edit-attempt-001 \
  --train-run .meta-skill/runs/<train-run> \
  --validation-run .meta-skill/runs/<validation-run> \
  --decision reject \
  --reason "Validation regression on activation-boundary cases."
```

Optional, only if the implementation remains small:

```sh
plugins/meta-skill/scripts/metaskill eval optimize status \
  --ledger .meta-skill/optimization/<id>/ledger.jsonl
```

Avoid a command that edits skill files. The first optimizer lane can tell the
user what evidence supports accept/reject; it should not rewrite the skill.

Ledger contract:

```json
{
  "optimization_id": "20260615T000000Z-skill-evaluator",
  "suite": ".meta-skill/evals.json",
  "baseline_candidate": "current",
  "budget": 5,
  "attempt": "attempt-001",
  "candidate": {
    "kind": "branch",
    "ref": "skill-edit-attempt-001"
  },
  "runs": {
    "train": ".meta-skill/runs/train-run",
    "validation": ".meta-skill/runs/validation-run",
    "heldout": ".meta-skill/runs/heldout-run"
  },
  "metrics": {
    "train_delta": 0.18,
    "validation_delta": 0.04,
    "gate_failures": 0,
    "pairwise_wins": 7,
    "pairwise_losses": 2
  },
  "decision": "accept",
  "reason": "...",
  "created_at": "..."
}
```

Implementation steps:

1. Add an optimization session object that records suite, baseline, budget,
   split policy, and required gates.
2. Add ledger append/read helpers with schema validation and stable JSONL
   output.
3. Reuse existing candidate source resolution for branches and git refs. Do not
   invent a separate candidate checkout mechanism.
4. Reuse `eval run`, `eval grade`, `eval compare`, and `eval report` outputs as
   evidence. The optimizer lane should reference runs, not duplicate them.
5. Refuse accept decisions unless validation improves or meets configured
   threshold, required gates hold, and held-out checks are present when
   required.
6. Refuse additional attempts when the budget is exhausted.
7. Add status output that shows attempt count, best accepted candidate,
   rejected attempts, open missing evidence, and next required action.
8. Update docs to distinguish SkillOpt-inspired optimization discipline from a
   SkillOpt clone. The system remains manually supervised until a future PR
   explicitly adds candidate generation.
9. Update architecture docs to place optimization above evaluator artifacts,
   not inside runner or grader ownership.

Scope out:

- No autonomous rewrite loop.
- No LLM-generated patches unless a future PR explicitly adds a bounded
  skill-doctor integration.
- No automatic promotion to installed plugin caches.
- No hidden mutation of source files.
- No acceptance based only on train split improvement.
- No acceptance when validation improves but gates fail.

Tests:

- `optimize init` creates a ledger with budget, baseline, split policy, and
  required gates.
- `record` appends valid attempts and rejects malformed candidate/run refs.
- Accept decisions fail without validation evidence.
- Accept decisions fail when required gates fail.
- Accept decisions fail after budget exhaustion.
- Status identifies best accepted candidate and rejected attempts.
- Ledger reads remain stable when optional pairwise or HTML report artifacts are
  missing.
- No command edits source skill files.

Validation:

```sh
PYTHONPATH=plugins/meta-skill/src python3 plugins/meta-skill/tests/test_eval_optimize.py
python3 plugins/meta-skill/tests/test_assist_package.py
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-evaluator --json
scripts/verify.sh
```

Acceptance:

- Optimization attempts are auditable from inception through accept/reject.
- The lane uses existing runs, candidates, comparisons, gates, and reports.
- Held-out validation gates block overfitted edits.
- The first implementation is useful for supervised optimization without
  claiming autonomous skill optimization.

## Verification Matrix

| Risk | Covered by | Gate |
|---|---|---|
| Pairwise judges see candidate identity | PR 8 prompt tests and artifact checks | Required |
| Existing absolute grading regresses | PR 8 backward-compat tests | Required |
| HTML report becomes a second source of truth | PR 14 docs and report-model reuse | Required |
| HTML output is unsafe or unreadable | PR 14 escaping and bounded-snippet tests | Required |
| Optimizer overfits train split | PR 15 validation and held-out gates | Required |
| Optimizer edits source unexpectedly | PR 15 command-scope tests | Required |
| Later artifacts are absent | PR 14 and PR 15 empty-state tests | Required |

## Open Decisions

- PR 8: whether pairwise human decisions should share the same
  `pairwise_grades.jsonl` artifact as model decisions or use a separate
  `human_pairwise.jsonl` file.
- PR 8: whether custom comparison groups beyond two candidates are deferred or
  represented as pairwise expansion only.
- PR 14: whether HTML should be invoked as `eval report --format html` or a
  separate `eval review` alias. The plan recommends extending `eval report`.
- PR 14: whether to include tiny inline JavaScript for collapsible details.
  The plan recommends no JavaScript unless static details become too bulky.
- PR 15: exact validation threshold for an accept decision.
- PR 15: whether the first optimizer PR should be split into `15a` ledger-only
  if prerequisites are not landed.
- PR 15: whether future semi-automatic candidate generation belongs in
  skill-evaluator or should route through skill-doctor.
