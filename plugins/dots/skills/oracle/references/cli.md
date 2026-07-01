# Running The Oracle Through a Provider CLI

Use this when the user explicitly approves a CLI route and wants another model to
produce the oracle answer locally. A CLI route does not need a saved
`.agents/oracle/<task>` package: pass the prompt directly to the agent and give
it the approved repo files or directories as context. Build a package first only
when the user wants a sendable bundle, the context is too large or scattered to
reference directly, the CLI requires package-like input, or a durable package is
preferred for the specific task.

Two baseline routes are documented here: **Claude** via the `claude` CLI and
**Codex** via `codex exec`. Both are advisory: read-only, no external writes, and
their answers go through the SKILL's *After The Oracle* verification before
adoption.

## Before You Run

1. Author a standalone prompt in the working context. Include the decision,
   expected answer shape, local verification boundary, and direct file
   references the model should inspect.
2. Confirm approval for the route — the user named the provider, and the prompt
   plus file references contain nothing they did not approve for it.
3. Run the CLI's local `--help` before relying on exact flags; CLI versions
   drift and rename flags.
4. Pass the prompt text directly. Give the model file context only when the
   oracle needs it and the CLI supports it; point it at the approved repo root,
   subdirectory, or explicit files.
5. Save the answer only when the task needs a local record; otherwise report the
   answer and verification boundary directly.

If you intentionally build a `.agents/oracle/<task>` package first, inspect
`prompt.md`, the `context.zip` file list, and the token total before running the
CLI. Then run the CLI against that package record and save the answer next to
it.

## Claude (`claude` CLI)

Non-interactive runs use `-p` / `--print`. `-p` is the documented
non-interactive path and may carry account or billing implications — state that
gate before running it.

```bash
claude -p "$(cat <<'PROMPT'
<standalone oracle prompt with direct file references>
PROMPT
)" \
  --model opus \
  --effort high \
  --add-dir /path/to/repo-or-approved-context \
  > /tmp/answer.claude.md
```

**Model** — `--model` takes a stable alias (`opus`, `sonnet`, `haiku`, `fable`)
that resolves to the latest model in that family; prefer an alias over a full
model ID so the run does not depend on a version-pinned name. If a full ID is
needed, confirm the exact current one at run time via the CLI's `--help` or
model list rather than trusting any ID written here. Default to `opus` for
advisory work; use `fable` only when the user asks for the most capable model,
`sonnet`/`haiku` when they want a faster, cheaper opinion.

**Effort is dynamic — choose it per oracle run.** `--effort` accepts
`low | medium | high | xhigh | max`. There is no fixed default for Oracle: pick
the level that matches the task in front of you each time you run the CLI, and
state which level you chose and why.

| Oracle task | `--effort` |
|---|---|
| Latency-sensitive or trivial sanity check | `low` |
| Quick second opinion, low-stakes | `medium` |
| Most plan, code, and architecture reviews | `high` |
| Hard reasoning, adversarial critique, subtle correctness | `xhigh` |
| Correctness-critical where cost does not matter | `max` |

**Output** — `--output-format text` (the default) writes the answer as plain
prose, which is what you want saved to `answer.claude.md`. Use `json` only when
downstream tooling needs the structured result object — the file then holds a
JSON envelope, not prose. `--add-dir` grants read access to the approved repo
folder, subdirectory, or package folder when the model needs files; `--bare`
skips hooks and plugins for a clean advisory run.

## Codex (`codex exec`)

Run Codex oracle runs on the provider's current flagship model (confirm the
exact ID at run time) with reasoning effort `xhigh` (extra-high). Keep it
read-only so the run stays advisory.

```bash
codex exec \
  --sandbox read-only \
  --ephemeral \
  --skip-git-repo-check \
  -C /path/to/repo-or-approved-context \
  -m <current-flagship-model-id> \
  -c model_reasoning_effort="xhigh" \
  --output-last-message /tmp/answer.codex.md \
  "$(cat <<'PROMPT'
<standalone oracle prompt with direct file references>
PROMPT
)"
```

**Model and effort** — `-m <model-id>` selects the model; confirm the exact
current flagship model ID via `codex exec --help` or provider docs rather than
trusting any ID written here. `-c model_reasoning_effort="xhigh"`
sets extra-high (`xhigh`) reasoning. `model_reasoning_effort` accepts
`minimal | low | medium | high | xhigh`; use `xhigh` for oracle runs. The same
pair can live in a `--profile` config file if you prefer not to pass them each
run.

**Context and output** — `--sandbox read-only` blocks writes; `--ephemeral` skips
persisting a session; `--skip-git-repo-check` allows running outside a repo. Set
the working root with `-C <dir>` to give Codex the approved repo, subdirectory,
or package folder as context. Avoid `--add-dir` for advisory runs: `codex exec`
treats it as a *writable* directory alongside the workspace, not a read-only
context flag, so `-C` is the right way to supply context (and `--sandbox
read-only` still blocks writes either way). `--output-last-message <file>` saves
the final answer when a local record is useful; `--json` emits the full event
stream if you need it.

## After The Run

Treat the CLI answer exactly like any other oracle answer: save it as
`answer.<provider>.md` when useful, then run the SKILL's *After The Oracle*
verification — extract concrete claims, check them against the repo, and
classify each as adopt / verify-first / reject / missing-context. The CLI
produced counsel, not proof. Report the route and model used, the chosen effort,
the file references provided, the answer path if saved, and the verification
boundary.
