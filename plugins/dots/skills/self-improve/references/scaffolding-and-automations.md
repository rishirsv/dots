# Scaffolding & Automations

How to turn a `scaffold` scan into concrete recommendations: CI/CD verification
steps, which skills fit a repo, and which Codex automations to wire up.

```bash
python3 scripts/self_improve.py scaffold --path .
```

## The division of labor

The script only **detects presence/absence** of scaffolding (AGENTS.md, CI,
tests, linters, the language stack). It does **not** decide the recommendation —
it emits a research handoff. The agent runs a bounded follow-on pass (the
`research` skill with subagents is a good fit) to choose specifics and verify
them against the repo and current docs. Never ship a recommendation from the
scan alone.

The scan is a top-level snapshot: it checks the repo root, so a monorepo may have
tests or CI in a subpackage the scan reports as "missing." Confirm before
claiming a gap.

## Recommending CI/CD verification steps

Map the detected stack to a verification gate. The goal is a deterministic check
that runs on every change, so quality is enforced, not remembered.

| Stack | Typical verification gate |
|---|---|
| Python | `ruff`/lint, `mypy`/type-check, `pytest` |
| Node | lint (eslint), type-check (tsc), unit tests, build |
| Rust | `cargo fmt --check`, `cargo clippy`, `cargo test` |
| Go | `go vet`, `golangci-lint`, `go test ./...` |

Recommendations, in priority order:

1. If there is **no test command**, that gap outranks everything — propose the
   smallest runnable test target first.
2. If tests exist but there is **no CI**, propose wiring the existing commands
   into a CI job so they run on every PR.
3. If there is **no linter/formatter**, propose one — it moves mechanical rules
   out of `AGENTS.md` prose and into an enforced check.
4. Record the resulting commands in `AGENTS.md` under Commands and Done-checks
   (see `references/agents-md.md`), so agents run the same gate locally.

## Which skills fit the repo

Compare the detected stack to the installed skills (`inventory` lists the skill
roots). Recommend a skill only when the repo's work clearly matches its trigger
`description` — do not blanket-install. A missing-but-clearly-needed capability
is a `New Skills` proposal, not an install.

## Codex automations catalog

Codex can run recurring background tasks. Recommend the lightest one that fits;
prefer invoking a skill (`$skill-name`) inside the automation so the action stays
maintainable and shareable.

- **Standalone automation** — independent recurring run on a schedule
  (predefined daily/weekly, custom cron, or minute intervals). Results land in
  the Triage inbox, or auto-archive when empty. Good for a **weekly
  self-improve sweep**: run `deep`, propose updates, drop them in Triage.
- **Thread automation** — a heartbeat attached to the current thread that
  preserves conversation context. Good for a persistent watch on one effort.
- **Execution mode** — run in the local project directory, or in a **dedicated
  background git worktree** to isolate changes. Prefer a worktree for anything
  that might edit files.
- **Safety** — automations respect the configured sandbox (`read-only`,
  `workspace-write`, `danger-full-access`) and approval policy
  (`untrusted`/`on-request`/`never`). A self-improve automation should default to
  read-only and **propose**, not auto-apply.

Caveat to state honestly: automations today largely depend on the **local Codex
app being on**; fully cloud-resident triggers ("runs when your computer is off")
are partly forward-looking. Verify current behavior before promising continuity.

## CI/CD integration with Codex

- **`openai/codex-action@v1`** (GitHub Actions) — installs the CLI and runs
  `codex exec`. Use it for PR self-review, quality gates before merge, or
  repeatable release/migration tasks. Convention: store prompts under
  `.github/codex/prompts/`. Inputs include `prompt`/`prompt-file`, `sandbox`,
  `read-only`, `model`, `effort`, and a `safety-strategy`.
- **`@codex review`** — comment on a PR (or enable auto-review) to get a standard
  GitHub review. It follows the repo `AGENTS.md` **`## Review guidelines`**
  section and prioritizes high-severity issues — so improving those guidelines is
  the lever that improves the reviews.
- **`@codex` cloud tasks** — e.g. "@codex fix the CI failures" launches a task
  using the PR as context.

Official docs name **GitHub Actions** specifically; GitLab CI, Azure DevOps, and
Jenkins are achievable via the CLI in headless mode but are community patterns,
not officially documented. Say so when recommending them.

## Verify before recommending

Codex features and config keys shift across releases. Before promising a specific
automation type, config key, model id, or CI input, confirm it against the live
Codex docs and changelog. Detected-stack gaps should be confirmed against the
actual repo (subpackages, non-standard layouts) rather than trusted blindly.

## In the deep pass

`deep --path <repo>` runs the scaffolding scan as one section, so a full sweep
combines repo gaps with session proposals and skill-usage review in a single
report.
