# Evaluation artifacts

Use this reference for local file layout, schemas, approval, stale evidence,
blind-review files, suite updates, and receipts.

## Keep development state beside the target

Use a repository's established private convention. In Dots repositories, use:

```text
<skill-dir>/.<skill-name>/
├── evals/<suite-id>/
│   ├── eval.md
│   ├── cases.json
│   ├── fixtures/
│   └── graders/
├── runs/<suite-id>/<run-id>/
│   ├── suite.json
│   ├── run.json
│   ├── summary.json
│   └── evidence/
└── worktrees/<opaque-id>/
```

Authored suites are development material, not portable runtime. Generated runs,
worktrees, temporary files, and packages remain local or ignored.

## Keep states distinct

- suite: Draft, Approved, or Superseded;
- trial: Completed, Invalid, Cancelled, or Not Run;
- outcome: Pass, Fail, Mixed, Inconclusive, or Not Run; and
- freshness: Current, Partly Stale, or Stale.

`eval.md` is the plan the user reviews. `cases.json` is its machine-readable
definition. Each run contains a frozen `suite.json`, dependency
hashes, configuration, assessments, and evidence. The optional
`evaluation.json` is an immutable user-facing receipt.

## Separate approval from freshness

Compute `approved_scope_sha256` from the approved goal, cases, criteria,
visibility rules, permissions, cost and run policy, and allowed configuration
slots. Exclude approval timestamps and versioned target, fixture, grader, and
runtime hashes. Write approval fields only after explicit user approval.

Target, fixture, grader, and host-instruction hashes determine evidence
freshness. A changed dependency invalidates only cases that reference its stable
ID. Missing dependency mapping or a broad runner change makes the whole result
stale. Reapproval is required only when the goal, cases, scoring boundary,
permissions, cost boundary, visibility, or allowed configuration slots change.

## Contain local paths

Resolve target files and configuration skill paths beneath a trusted workspace
root. In Git repositories, `validate_eval.py` discovers that root. Elsewhere,
pass `--workspace-root <trusted-root>` explicitly. Resolve fixtures and graders
beneath the suite root, and run evidence beneath the run root. In every class,
reject absolute paths, `..` traversal, and symlinks that escape its root.
Worker-visible directories must not contain hidden fixtures, graders, suite
definitions, blind maps, or other run results.

## Use the typed contracts

Copy [cases.json](../assets/cases.json) for a suite and
[run.json](../assets/run.json) when materializing an immutable run. Target files, fixtures,
configurations, graders, cases, and dependencies have stable IDs and content
hashes where applicable. `depends_on` references those IDs.

Each trial keeps status, failure classification, outcome, artifacts, and
criterion-level `assessments` separate. An assessment records criterion and
grader IDs, grader hash, prediction, optional human label, split, evidence
references, raw result, and invalidity reason. An invalid or cancelled trial has
no skill outcome.

Copy [review-data.json](../assets/review-data.json) for a review envelope. It uses
discriminated block objects:

- text: `text`, `format`;
- code: `text`, optional `language`, `diff`;
- table: typed `columns` and `rows`;
- image: contained `path`, `alt`, optional `caption`;
- trace: ordered role/content events and optional group IDs; and
- file: contained `path`, `media_type`, and `label`.

It also has a stable review ID and may contain annotations, suggestions,
taxonomy, coverage, and blind pairs. Blind pairs contain only opaque labels and
item references; identity mappings never enter the review envelope. The
generator hashes the prepared envelope, including hashes of referenced files,
and gives every block canonical text plus a content hash. `feedback.json`
records the review ID and envelope hash plus stable item IDs, mode, decision,
note, optional block index and canonical-text range with its content hash,
suggestion decisions, review status, and timestamp.

Keep `blind-map.json` coordinator-only. Preserve `blind-decision.json` before
reading it, then write a separate `unblinded-analysis.json`.

## Preserve receipts

Use [evaluation.json](../assets/evaluation.json) only when the user requests a
machine-readable receipt. Recheck referenced review and target hashes before
using it. Never mutate a receipt to record a later run; write a new receipt
and reference immutable suite and run snapshots.
