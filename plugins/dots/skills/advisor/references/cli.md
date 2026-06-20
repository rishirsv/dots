# Running The Advisor Through a Provider CLI

Use this when the user explicitly approves a CLI route and wants another model to
produce the advisor answer locally. A CLI route does not need a saved
`.agents/advisor/<task>` package: pass the prompt directly to the agent and give
it the approved repo files or directories as context. Build a package first only
when the user wants a sendable bundle, the context is too large or scattered to
reference directly, the CLI requires package-like input, or a durable package is
preferred for the specific task.

Two baseline routes are documented here: **Claude** via the `claude` CLI and
**Codex** via `codex exec`. Both are advisory: read-only, no external writes, and
their answers go through the SKILL's *After The Advisor* verification before
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
   advisor needs it and the CLI supports it; point it at the approved repo root,
   subdirectory, or explicit files.
5. Save the answer only when the task needs a local record; otherwise report the
   answer and verification boundary directly.

If you intentionally build a `.agents/advisor/<task>` package first, inspect
`prompt.md`, the `context.zip` file list, and the token total before running the
CLI. Then run the CLI against that package record and save the answer next to
it.

## Claude (`claude` CLI)

Non-interactive runs use `-p` / `--print`. `-p` is the documented
non-interactive path and may carry account or billing implications — state that
gate before running it.

```bash
claude -p "$(cat <<'PROMPT'
<standalone advisor prompt with direct file references>
PROMPT
)" \
  --model opus \
  --effort high \
  --add-dir /path/to/repo-or-approved-context \
  > /tmp/answer.claude.md
```

**Model** — `--model` takes an alias (`opus`, `sonnet`, `haiku`, `fable`) that
resolves to the latest model in that family, or a full ID (`claude-opus-4-8`,
`claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-fable-5`). Default to `opus` for
advisory work; use `fable` only when the user asks for the most capable model,
`sonnet`/`haiku` when they want a faster, cheaper opinion.

**Effort is dynamic — choose it per advisor run.** `--effort` accepts
`low | medium | high | xhigh | max`. There is no fixed default for Advisor: pick
the level that matches the task in front of you each time you run the CLI, and
state which level you chose and why.

| Advisor task | `--effort` |
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

Run Codex advisor runs on extra-high GPT-5.5: model `gpt-5.5` with reasoning effort
`xhigh` (extra-high). Keep it read-only so the run stays advisory.

```bash
codex exec \
  --sandbox read-only \
  --ephemeral \
  --skip-git-repo-check \
  -C /path/to/repo-or-approved-context \
  -m gpt-5.5 \
  -c model_reasoning_effort="xhigh" \
  --output-last-message /tmp/answer.codex.md \
  "$(cat <<'PROMPT'
<standalone advisor prompt with direct file references>
PROMPT
)"
```

**Model and effort** — `-m gpt-5.5` selects the model; `-c model_reasoning_effort="xhigh"`
sets extra-high (`xhigh`) reasoning. `model_reasoning_effort` accepts
`minimal | low | medium | high | xhigh`; use `xhigh` for advisor runs. The same
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

Treat the CLI answer exactly like any other advisor answer: save it as
`answer.<provider>.md` when useful, then run the SKILL's *After The Advisor*
verification — extract concrete claims, check them against the repo, and
classify each as adopt / verify-first / reject / missing-context. The CLI
produced counsel, not proof. Report the route and model used, the chosen effort,
the file references provided, the answer path if saved, and the verification
boundary.
