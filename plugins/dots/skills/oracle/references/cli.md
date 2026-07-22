# Running The Oracle Through a Provider CLI

Default: no package. A CLI advisor can read the same local filesystem, so pass
a standalone prompt, name the approved repo root or subdirectory, and list the
exact files or directories to inspect.

Package first only when:

- the user wants a sendable bundle
- context is too large or scattered for direct references
- the CLI requires package-like input
- a durable package record matters

Two baseline routes are documented here: **Claude** via the `claude` CLI and
**Codex** via `codex exec`. Both are advisory: read-only, no external writes, and
their answers go through the SKILL's *After The Oracle* verification before
adoption.

## Before You Run

1. **Prompt:** decision, expected answer shape, verification boundary, exact
   file references, and first-pass read order.
2. **Approval:** provider named; prompt and file references contain only
   approved content.
3. **Flags:** run local `--help`; CLI flags drift.
4. **Context:** point at the approved repo root, subdirectory, package folder,
   or explicit files.
5. **Record:** save the answer only when a local record is useful.

Implementation guide: request approach, file-by-file steps, risks,
constraints, and validation. Do not ask the advisor to edit files or complete
the implementation.

Package record: when using `.agents/oracle/<task>`, inspect `prompt.md`,
`context.zip`, and token total before running the CLI. Save the answer next to
the package.

## Claude (`claude` CLI)

Non-interactive runs use `-p` / `--print`. `-p` is the documented
non-interactive path and may carry account or billing implications — state that
gate before running it.

```bash
claude -p "$(cat <<'PROMPT'
<standalone oracle prompt with direct file references>
PROMPT
)" \
  --model <advisor-model> \
  --effort high \
  --add-dir /path/to/repo-or-approved-context \
  > /tmp/answer.claude.md
```

**Model** — prefer stable aliases (`opus`, `sonnet`, `haiku`, `fable`) over
version-pinned IDs. Confirm full IDs at run time via `--help` or model list.
Default to the strongest approved advisor model for implementation planning,
architecture, design, and hard correctness. Use a faster or cheaper model only
when the user asks for that trade-off or the task is a lightweight sanity check.

**Effort is dynamic — choose it per oracle run.** `--effort` accepts
`low | medium | high | xhigh | max`. There is no fixed default for Oracle: pick
the level that matches the task in front of you each time you run the CLI, and
state which level you chose and why.

| Oracle task | `--effort` |
|---|---|
| Latency-sensitive or trivial sanity check | `low` |
| Quick second opinion, low-stakes | `medium` |
| Most plan, code, design, and architecture reviews | `high` |
| Hard reasoning, adversarial critique, subtle correctness | `xhigh` |
| Correctness-critical where cost does not matter | `max` |

**Output** — keep plain text for `answer.claude.md`. Use `json` only when
downstream tooling needs the structured result object. `--add-dir` grants read
access to the approved repo, subdirectory, or package folder. `--bare` skips
hooks and plugins for a clean advisory run.

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

**Context** — `-C <dir>` gives Codex the approved repo, subdirectory, or package
folder. Avoid `--add-dir` for advisory runs because `codex exec` treats it as a
writable directory alongside the workspace; use `-C` plus `--sandbox read-only`.

**Output** — `--output-last-message <file>` saves the final answer when a local
record is useful. `--json` emits the full event stream when needed.

## After The Run

Treat the CLI answer as counsel, not proof:

- **Save:** `answer.<provider>.md` only when useful.
- **Verify:** extract claims, check repo evidence, and classify each as adopt,
  verify-first, reject, or missing-context.
- **Report:** route, model, effort, file references, answer path if saved, and
  verification boundary.
