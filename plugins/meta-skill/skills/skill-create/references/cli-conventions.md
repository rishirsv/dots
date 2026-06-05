# Meta Skill CLI Guide

Read this when using the shared `meta-skill` CLI from create, eval, or improve
lanes. Treat this as the current command contract. Do not invent commands or
flags beyond the supported surface here.

## Mental Model

The CLI has one portable skill root and one optional project workbench:

```text
<skill-dir>/
  SKILL.md
  agents/          optional runtime metadata
  references/      optional runtime guidance
  scripts/         optional runtime code
  assets/          optional runtime materials
  <other runtime files or folders>
  .meta-skill/     optional authoring and evidence workbench
```

The project root is the current portable payload. `references/`, `scripts/`,
and `assets/` are the first-class runtime support folders that create/lint know
how to copy and link-check. Other non-excluded runtime files or folders can ship
when intentional. `.meta-skill/` is workbench state and never packages.

Each command has one side-effect class:

| Class | Commands | Meaning |
|---|---|---|
| Transform | `create`, `project init`, `package` | Write files the user authorized |
| Projection | `lint` | Inspect current state without mutating run evidence |
| Producer | `run` | Record new eval evidence under `.meta-skill/runs/` |

Prefer the source project path. Installed skill copies are runtime state, not
canonical source.

## Golden Paths

Create a portable-only skill when the user wants a reusable runtime payload but
does not need evals, tests, comparison, team reuse, or release discipline:

```bash
meta-skill create <skill-dir> --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
meta-skill lint <skill-dir>
```

Create a maintained skill project when the user asks for evals, tests, team
reuse, production readiness, release discipline, or an enterprise-quality
plugin:

```bash
meta-skill create <skill-dir> --project --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
meta-skill lint <skill-dir>
meta-skill run <skill-dir>
```

Add the workbench to an existing portable skill without moving the payload:

```bash
meta-skill project init <skill-dir>
meta-skill lint <skill-dir>
```

Package only after the user has approved packaging:

```bash
meta-skill package <skill-dir> --out <artifact.zip>
meta-skill package <skill-dir> --out-dir <artifact-dir>
```

## Command Surface

Use only these top-level commands:

```bash
meta-skill create [skill-dir] [--project] --slug <slug> --title <title> --description <text> --job <text>
meta-skill project init <skill-dir>
meta-skill lint <project-or-skill> [--json]
meta-skill run <project> [--case <id>] [--type <R|F|G>] [--topic <topic>] [--label "..."] [--turn-timeout-ms <ms>] [--trace-buffer-events <count>] [--no-skill] [--no-lint]
meta-skill package <project> [--out <zip>] [--out-dir <dir>]
```

Advanced `create` flags supported by the implementation:

```bash
meta-skill create <skill-dir> --runtime-reference <file>
meta-skill create <skill-dir> --runtime-script <file>
meta-skill create <skill-dir> --runtime-asset <file>
meta-skill create <skill-dir> --force ...
```

Use the runtime copy flags only for reusable files that belong in the portable
payload. `--force` may replace scaffold-owned files in an existing skill root;
use it only when the user has clearly authorized replacement.

## Create

Use `create` after the Skill Specification is settled.

`create` writes `SKILL.md` and `agents/openai.yaml`. With `--project`, it also
creates `.meta-skill/spec.md`, `.meta-skill/cases/`, `.meta-skill/runs/`, and
`.meta-skill/tests/unit/`.

The generated scaffold is a starting point, not the final authored skill. After
creation, edit the portable payload from the Skill Specification, link every
runtime reference/script/asset from `SKILL.md`, and run `lint`.

## Project Init

Use `project init` when an existing portable skill now needs maintained-project
discipline.

It requires a root with `SKILL.md` and adds `.meta-skill/` in place. It does not
nest, move, or copy the portable payload.

Next step: add or refine `.meta-skill/spec.md`, manually author cases under
`.meta-skill/cases/<ID-slug>/`, then run `lint`.

## Lint

Use `lint` after create, after edits, before runs, and before packaging.

`lint` checks:

- `SKILL.md` frontmatter, trigger wording, `not for` boundary, and body.
- `agents/openai.yaml` metadata when present.
- Runtime references, scripts, and assets are directly linked from `SKILL.md`.
- `.meta-skill/spec.md`, case folders, case frontmatter, fixtures, and unit
  test IDs when project mode exists.
- Executable unit tests under `.meta-skill/tests/unit/`.

`lint --json` is the machine-readable form. Human-readable lint output may end
with `OK: no failures (...)` even when advisory warnings remain.

## Run

Use `run` only for project skills with manually authored cases.

Case folders live at `.meta-skill/cases/<ID-slug>/`, where the ID starts with:

- `R`: regression behavior the skill should preserve.
- `F`: failure mode, ambiguity, or hard multi-turn behavior.
- `G`: gate behavior such as approval, safe stop, or safe default.

Select cases with `--case <id-or-folder>`, `--type <R|F|G>`, or
`--topic <topic>`. Use `--label` to make the run folder easier to recognize.

By default, `run` evaluates the current working payload. It snapshots that
payload into the run folder before execution. Use `--no-skill` for no-skill
control evidence. A run evaluates one source only; do not mix candidate and
baseline evidence in the same run.

Use `--turn-timeout-ms` only when a real case needs a longer or shorter turn
timeout. Use `--trace-buffer-events` when trace extraction needs a larger
in-memory event window. `rpc.jsonl` remains the durable raw trace.

Use `--no-lint` only when the user accepts that post-run lint checks are being
skipped. Pre-run structural failures still block execution.

## Evidence

Run evidence is saved under:

```text
.meta-skill/runs/<run-id>/
  payload/                 working-payload runs only
  cases/<case-folder>/
    case.md                frozen case definition
    rpc.jsonl              raw App Server trace
    turn-evidence.json     normalized turn evidence
    final.md               final assistant answer
```

Inspect `final.md` for the answer, `turn-evidence.json` for normalized commands,
tool calls, approvals, unknown methods, and token usage, and `rpc.jsonl` for the
raw audit trail.

Completed execution is evidence, not proof of quality. Treat behavior as proven
only when the relevant deterministic tests, human review, or other accepted
checks support that claim.

Working-payload runs force-attach the skill on the first turn, so they measure
mounted-skill behavior. They do not prove true trigger routing or writable
file-output behavior.

If App Server token metrics are unavailable, `turn-evidence.json` records null
numeric token fields plus `unavailable_reason`. Do not hide or backfill missing
token usage.

## Package

Use `package` only after explicit human approval.

`package` runs `lint`, then exports the current portable payload. It excludes
`.meta-skill/`, dependency folders, build/cache folders, editor/OS junk, and
package artifacts. It writes package metadata next to the artifact.

Packaging does not mean the skill is ready for enterprise rollout. Before
treating a package as shareable, confirm:

- `lint` has no failures.
- Runtime references, scripts, and assets are linked from `SKILL.md`; any other
  packaged runtime files are intentional.
- Runtime scripts have deterministic tests or a recorded reason they do not.
- Maintained skills have representative `R`, `F`, and `G` evidence.
- Run evidence has been inspected, not merely created.
- Human approval covers packaging and any install, publish, sync, promotion, or
  external write that follows.

## Output And Exit Codes

- `0`: success, including success with advisory warnings.
- `1`: invalid project state, failed deterministic check, package validation
  failure, recorded run error, or unavailable runner.
- `2`: usage error, unknown command, bad flag, bad flag value, or missing flag
  value.

Human-readable results print to stdout. Errors print to stderr. Use `--json`
only where the command supports it.

## Human Gates

Commands may prepare scaffolds, evidence, and package artifacts, but the human
gate remains explicit. Require user approval before packaging, installing,
publishing, syncing, source edits, external writes, or promoting a candidate as
accepted.

Evidence-backed edits belong to the improve lane. Name the evidence first, edit
the working portable payload only after the user has asked for edit mode, then
rerun `lint` and relevant `run` cases.
