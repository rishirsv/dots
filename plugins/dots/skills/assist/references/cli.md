# Running The Assist Through a Provider CLI

Use this when the user explicitly approves a CLI route and wants another model to
produce the assist answer locally, instead of (or in addition to) the Desktop
package. The Desktop package stays the deliverable and the durable record; a CLI
route just runs the same `prompt.md` through a different model and saves the
answer back into the package folder.

Two baseline routes are documented here: **Claude** via the `claude` CLI and
**Codex** via `codex exec`. Both are advisory: read-only, no external writes, and
their answers go through the SKILL's *After The Assist* verification before
adoption.

## Before You Run

1. Build the package on the Desktop and inspect `prompt.md`, the `context.zip`
   file list, and the token total (`--dry-run` first if you have not).
2. Confirm approval for the route — the user named the provider, and the package
   contains nothing they did not approve for it.
3. Run the CLI's local `--help` before relying on exact flags; CLI versions
   drift and rename flags.
4. Pass `prompt.md` as the prompt text. Give the model file context only when the
   assist needs it and the CLI supports it (point it at the package folder or the
   repo); otherwise the prompt's context map is enough.
5. Save the answer in the package folder as `answer.<provider>.md`.

## Claude (`claude` CLI)

Non-interactive runs use `-p` / `--print`. `-p` is the documented
non-interactive path and may carry account or billing implications — state that
gate before running it.

```bash
claude -p "$(cat ~/Desktop/<package>/prompt.md)" \
  --model opus \
  --effort high \
  --add-dir ~/Desktop/<package> \
  > ~/Desktop/<package>/answer.claude.md
```

**Model** — `--model` takes an alias (`opus`, `sonnet`, `haiku`, `fable`) that
resolves to the latest model in that family, or a full ID (`claude-opus-4-8`,
`claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-fable-5`). Default to `opus` for
advisory work; use `fable` only when the user asks for the most capable model,
`sonnet`/`haiku` when they want a faster, cheaper opinion.

**Effort is dynamic — choose it per assist.** `--effort` accepts
`low | medium | high | xhigh | max`. There is no fixed default for Assist: pick
the level that matches the task in front of you each time you run the CLI, and
state which level you chose and why.

| Assist task | `--effort` |
|---|---|
| Latency-sensitive or trivial sanity check | `low` |
| Quick second opinion, low-stakes | `medium` |
| Most plan, code, and architecture reviews | `high` |
| Hard reasoning, adversarial critique, subtle correctness | `xhigh` |
| Correctness-critical where cost does not matter | `max` |

**Output** — `--output-format text` (the default) writes the answer as plain
prose, which is what you want saved to `answer.claude.md`. Use `json` only when
downstream tooling needs the structured result object — the file then holds a
JSON envelope, not prose. `--add-dir` grants read access to the package folder or
repo when the model needs the attached files; `--bare` skips hooks and plugins
for a clean advisory run.

## Codex (`codex exec`)

Run Codex assists on extra-high GPT-5.5: model `gpt-5.5` with reasoning effort
`xhigh` (extra-high). Keep it read-only so the run stays advisory.

```bash
codex exec \
  --sandbox read-only \
  --ephemeral \
  --skip-git-repo-check \
  -m gpt-5.5 \
  -c model_reasoning_effort="xhigh" \
  --output-last-message ~/Desktop/<package>/answer.codex.md \
  "$(cat ~/Desktop/<package>/prompt.md)"
```

**Model and effort** — `-m gpt-5.5` selects the model; `-c model_reasoning_effort="xhigh"`
sets extra-high (`xhigh`) reasoning. `model_reasoning_effort` accepts
`minimal | low | medium | high | xhigh`; use `xhigh` for assist runs. The same
pair can live in a `--profile` config file if you prefer not to pass them each
run.

**Context and output** — `--sandbox read-only` blocks writes; `--ephemeral` skips
persisting a session; `--skip-git-repo-check` allows running outside a repo. Set
the working root with `-C <dir>` to give Codex the package or repo as context.
Avoid `--add-dir` for advisory runs: `codex exec` treats it as a *writable*
directory alongside the workspace, not a read-only context flag, so `-C` is the
right way to supply context (and `--sandbox read-only` still blocks writes
either way). `--output-last-message <file>` saves the final answer to
`answer.codex.md`; `--json` emits the full event stream if you need it.

## After The Run

Treat the CLI answer exactly like any other assist answer: save it as
`answer.<provider>.md`, then run the SKILL's *After The Assist* verification —
extract concrete claims, check them against the repo, and classify each as adopt
/ verify-first / reject / missing-context. The CLI produced counsel, not proof.
Report the package path, the route and model used, the chosen effort, the answer
path, and the verification boundary.
