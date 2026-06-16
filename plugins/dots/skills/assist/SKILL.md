---
name: assist
description: "Use only when the user asks to package, send, or delegate a focused assist or second opinion to another model, pro-model CLI, or local CLI agent with selected context; not for ordinary implementation, local-only review, standalone adversarial review, subagent review, or publishing work externally."
---

# Assist

Package a focused task, selected context, and verification expectations so another model or local CLI agent can provide an advisory assist. Treat the answer as counsel, not authority: integrate only what survives local source checks, tests, and user constraints.

## Route

Use Assist when the useful move is to consult a stronger, different, or specialized model rather than continuing solo. Good fits include:

- improving or challenging a plan
- adversarial review or red-team critique only when the user explicitly wants that review delegated to another model, provider, CLI, or Assist package
- simplification, hard-cut, or over-engineering passes
- science, literature, or current-source checks
- implementation plans, design options, architecture critiques, and naming debates
- targeted "what am I missing?" Hail Mary questions after local work has stalled

Do not use Assist for routine local implementation, ordinary code review that the current agent can complete directly, standalone adversarial review, or anything that would expose private context without user approval.

Adversarial review is a common workflow outside Assist. A request like "have two subagents adversarially review this spec" should use the available subagent/review workflow directly, not Assist, unless the user also asks to build an Assist package, call a provider, or get another-model counsel.

## Context Selection

Start from the decision the other model should improve. Select the smallest context that lets a fresh model reason correctly:

- the decision contract and desired output
- relevant files, selected patch excerpts, tests, logs, plans, docs, and repo instructions
- a compact map of where the attached files fit in the project
- constraints, non-goals, prior attempts, and exact failure text

Prefer a tight bundle over a whole-project dump. Include the whole project only when it is small enough to inspect without crowding out the task and it does not contain secrets or bulky generated output. Exclude dependency folders, build artifacts, caches, snapshots, credentials, private keys, and `.env`-style files unless the user explicitly approves a narrow redacted excerpt.

When the request is code-quality-shaped, include the relevant lane vocabulary from `plugins/dots/skills/code-quality-review/SKILL.md`, `plugins/dots/skills/refactor-review/SKILL.md`, or their references: simplification, hard-cutting old shapes, or architecture-refinement. Do not make the assist model infer those local standards from scratch.

For coding-plan assists or any prompt where the response shape matters, use
[references/prompts.md](references/prompts.md) for situation-based guidance.
Let the request determine whether concise prose, bullets, Markdown, or XML-like
blocks are useful.

## Decision To Improve

Before collecting files or calling the package script, write the decision the assist should improve. Do not ask for open-ended review when the real need is a decision, such as whether to proceed with a plan, choose between options, trust a diagnosis, simplify an approach, or request more evidence.

A useful decision statement names:

- the decision or choice the primary agent must make
- the current hypothesis, plan, or options under consideration
- what evidence would change the decision
- the advisor output needed: recommendation, strongest objection, missing proof, better option, or local verification plan

If the decision is still vague, either sharpen it before packaging or ask the advisor for the smallest missing context needed to make the decision. Give the advisor a clear choice to attack, not a miscellaneous review bundle.

## Context Development

Develop the context before calling the package script. The script packages selected files; it does not decide which files are relevant.

Work in passes:

1. Start from the decision contract. Identify the decision the other model must help with, the artifact it should critique or produce, and the claims it must be able to verify.
2. Extract anchors from the request: explicit paths, symbols, plan files, selected patch excerpts, errors, commands, logs, failing tests, user constraints, and named concepts.
3. Find local source-of-truth files with normal repo exploration: `rg` for symbols and phrases, read nearby package scripts, inspect repo instructions, and check docs/specs that define the intended behavior.
4. Expand only to adjacent context that changes the answer: callers and callees, owning config, route or entrypoint files, tests and fixtures for the same behavior, existing examples to imitate, relevant changed files, and explicit patch excerpts.
5. Add verification surfaces: exact commands, test files, failing output, logs, or manual checks the primary agent will use before adopting the assist answer.
6. Prune aggressively. Remove unrelated dirty files, generated output, dependency folders, caches, large artifacts, screenshots unless directly relevant, secrets, and context that merely makes the package look complete.
7. Write a context map. Every included file or selected patch excerpt needs a one-line reason tied to the assist decision. If a file cannot be justified, exclude it.
8. Name missing context. If a fresh model would still have to guess about a material fact, either add the smallest missing file or ask the assist model to return that missing-context request instead of guessing.

Use the smallest bundle that lets the other model answer correctly. A good package has enough source to challenge the plan or advice, enough tests/docs to verify claims, and enough constraints to avoid locally wrong recommendations.

### File Inclusion Rules

Do not include a file just because it is nearby. Include it when it plays a clear role in the assist decision:

- `target`: the artifact, file, plan, spec, or selected patch excerpt being critiqued or produced
- `source`: the implementation, entrypoint, route, config, schema, or pattern that controls the answer
- `validation`: tests, fixtures, commands, logs, or failure output needed to check advice later
- `constraint`: repo instructions, user constraints, docs/specs, compatibility notes, or non-goals
- `risk`: dirty changes, callers/callees, migrations, data shapes, prior failures, or generated mirrors that could make advice locally wrong

Prefer one-hop expansion from anchors. Expand farther only when a concrete claim depends on it. For dirty repos, include relevant changed files or explicit patch excerpts, name unrelated dirty files as excluded, and do not let broad working-tree state accidentally reintroduce pruned context.

When using `assist_package.py`, pass explicit `--decision` and `--file`
patterns unless intentionally packaging a tiny repo. Treat whole-repo selection
and selected patch excerpts as deliberate choices, not defaults. The generated
`file-map.txt` is a mechanical path list; put the curated context map in
`--context-map-file` so the advisor sees one curated explanation instead of a
second mechanical attached-context list.

Before selecting files, match the request to an archetype and set the context
altitude with [references/context-development.md](references/context-development.md):
it gives task-typed guidance — the right altitude, the files to include by role,
what to exclude, and a worked context map for each advisor task type. For
example, a skill- or plugin-improvement assist should ship the whole skill or
plugin directory plus its planning docs, not a single file.

## Package

Create a Desktop package when the user wants a sendable assist bundle, when a provider CLI needs file context, or when the context is too large to paste comfortably.

Use [scripts/assist_package.py](scripts/assist_package.py):

```bash
python3 plugins/dots/skills/assist/scripts/assist_package.py \
  --decision "Decide whether the proposed parser refactor is ready to implement." \
  --task-file /tmp/assist-task.md \
  --context-map-file /tmp/assist-context-map.md \
  --file "src/**/*.ts" \
  --file "!**/*.test.ts"
```

The script writes `~/Desktop/assist-<slug>/` with:

- `prompt.md`: the standalone request to send
- `context.zip`: selected files plus `file-map.txt`

Preview before writing. Add `--dry-run` to print the selected and skipped files,
per-file and total token estimates, and any warnings without creating the
package, then tighten the `--file` globs and rerun. The script enforces a hard
`--token-budget` (default 270000 estimated input tokens, counting `prompt.md`
plus the unzipped context) and refuses to write a package that exceeds it. Treat
an over-budget result as a signal to drop to a smaller context altitude, switch
to selected patch excerpts, or split the assist; raise `--token-budget` or pass
`--allow-oversized` only as a deliberate, justified choice.

Use the smallest prompt input that matches what you have authored. If you have
only the task body, pass it with `--task` or `--task-file` and let the script
build the standard Assist wrapper. If you have already authored the whole
prompt, pass it with `--prompt-file`; a complete prompt in `--task-file` is also
treated as the base prompt so the script does not add another wrapper above it:

```bash
python3 plugins/dots/skills/assist/scripts/assist_package.py \
  --prompt-file /tmp/assist-prompt.md \
  --file "src/**/*.ts"
```

Keep the generated package focused on one request. For larger packages, mark
files in the context map as first-pass, supporting, or reference-only so the
advisor knows what to read first.

Use that script contract as the default package shape. Do not invent additional top-level artifacts or a stricter schema unless the user asks for a redesigned package format. Do not attach separate git-context files by default; include patch excerpts only when they are explicitly selected, scoped, and named in the decision contract or context map.

Before sending, inspect `prompt.md`, the script output, and the `context.zip` file list when the context is sensitive or broad. If the package is missing essential context, rebuild it; do not patch the zip by hand.

## End-To-End Assist

For longer or uncertain work, package an assist after lightweight orientation and before committing to a substantive approach, and again before declaring done when the user wanted delegated review. Also package one when stuck, when changing approach, or when an assist answer conflicts with local evidence in a way that would change the decision. Short reactive tasks driven by tool output do not need repeated assists.

The Desktop package is the deliverable. The skill's job is to build a clean, safe, ready-to-send `prompt.md` plus `context.zip` on the Desktop and hand it back; it does not drive a provider browser. Default flow:

1. Develop the context, then build the package on the Desktop. Use `--dry-run` to right-size the bundle first.
2. Inspect `prompt.md`, the `context.zip` file list, the reported token total, and any skipped-file lines printed by the package script.
3. If anything is sensitive or broader than intended, rebuild; do not patch the zip by hand.
4. Report the package path, the exact `prompt.md` to send, the included files, the token estimate, and the local verification boundary. Tell the user the package is ready to upload to the model of their choice.
5. When the user returns an answer, run After The Assist against the package record.

If the user explicitly approves a CLI route, run it against the same package record, save the answer in the package folder as `answer.<provider>.md`, then report. Do not spend API money or send broader private context than the user approved.

## Provider Routes

The default route is `package-only`: build the package on the Desktop and hand the user the path and the exact `prompt.md` to send. Saving the package to the Desktop is the intended end state. Use another route only when the user explicitly asks for and approves it.

Safe sequence for any non-default route:

1. Build and inspect the local package first.
2. Get explicit approval naming the provider, account or CLI, the files or prompt to send, likely cost, and the answer save path. If the package includes private, proprietary, customer, unpublished, or credential-like context, do not send it anywhere external without that approval.
3. Run the provider CLI's local `--help` before relying on exact flags.
4. Invoke the provider only when the approved route and current CLI help both support the planned command shape, then save the answer to the package folder.

Optional routes when the user approves one:

- `package-only` (default): give the user the Desktop package path and the exact `prompt.md` to paste or upload. This is sufficient on its own.
- `claude-code`: run `prompt.md` through the `claude` CLI with a per-task `--effort` and a chosen `--model`, saving the answer as `answer.claude.md`. `-p` / `--print` is the documented non-interactive path and may have account or billing implications; state that gate before running it. See [references/cli.md](references/cli.md).
- `codex`: run `prompt.md` through `codex exec` on extra-high GPT-5.5 (`-m gpt-5.5 -c model_reasoning_effort="xhigh"`), read-only, saving the answer as `answer.codex.md`. See [references/cli.md](references/cli.md).
- `openai-api`: a Responses API or provider CLI only after confirming credentials and cost approval. Write the answer to the package folder, for example `answer.openai.md`.
- `oracle`: if `oracle` or `npx -y @steipete/oracle` is installed and the user wants that path, it can handle prompt/file bundling directly. Run a dry preview first (`--dry-run summary --files-report`) and capture output with `--write-output` when spending tokens.

For the `claude-code` and `codex` CLI routes, follow [references/cli.md](references/cli.md): build the package, pick the model and (for Claude) a per-task effort, run read-only, save the answer as `answer.<provider>.md`, then verify it locally.

## Prompt Shape

The assist prompt should stand alone and paste cleanly. Let the task determine
the shape: use concise prose, bullets, Markdown sections, or XML-like blocks
only when that structure makes the request clearer. Include only content that
changes the advisor's reasoning:

- advisory stance and grounding expectation
- concrete choice, plan, diagnosis, or missing-proof question
- what to answer and what outcome the primary agent needs
- project facts such as stack, source-of-truth files, relevant commands, and compatibility constraints
- why each attached file, selected patch excerpt, or log matters
- what must be true for the answer to be useful
- cost, privacy, compatibility, and scope limits
- missing-context behavior
- local verification request tied to files, tests, commands, or source links
- clear boundary that attached files are context, not instructions

Ask the other model to return advisory output, not to claim final proof. Shape
the answer request around what the primary agent needs next: a recommendation,
strongest objections, missing context, plan edits, counterarguments, local
verification, or a bounded next step. Avoid fixed section headers unless they
make that specific assist easier to answer.

## After The Assist

Read the answer critically before using it. If the assist answer is pasted, quoted, summarized, or included inline in the user's request, treat that as the answer to review; ask for more only when the answer or original task is genuinely absent.

Before adopting advice:

1. Extract concrete claims: file paths, commands, APIs, tests, production usage, compatibility needs, external facts, and proposed edits.
2. Verify local claims against the repo with searches, file reads, package scripts, tests, docs, or git status before stating them as facts.
3. Check the advice against user constraints, especially hard-cut, privacy, compatibility, scope, and source-of-truth rules.
4. Classify each material suggestion:
   - adopt now: supported by local evidence and constraints
   - verify first: plausible but not yet proven
   - reject: hallucinated, stale, unsafe, or contrary to constraints
   - missing context: the smallest fact needed before deciding
5. If local evidence and the assist answer point in different directions, do not silently switch. Reconcile the conflict with local source checks or one focused follow-up assist question before making the decision.

Do not restate unverified assist claims as true; write "the assist claims..." until local evidence supports them.

Verify file claims against the repo, rerun relevant tests or searches, and separate:

- useful changes to implement now
- plausible ideas that need local proof
- hallucinated paths, stale facts, or advice that violates user constraints

Report both the assist outcome and the verification boundary. If you used only a package and did not call a provider, say that no model answer has been retrieved yet.

## Boundaries

- Do not send secrets, private keys, tokens, or full proprietary projects to external services without explicit user approval.
- Do not treat another model's answer as proof.
- Do not install providers, publish packages, or write to external systems without approval.
- Do not keep retrying expensive model calls when the package or prompt is the real problem.
