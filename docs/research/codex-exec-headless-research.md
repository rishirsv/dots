# Research: `codex exec` as a Headless Agent Runtime

## Research Questions

- What is the core mental model behind the `codex exec` article?
- How does `codex exec` handle input, output, permissions, and lifecycle?
- Which parts of the article are directly supported by local CLI help or first-party OpenAI guidance?
- What stable concepts should someone keep in mind when building around `codex exec`?

## Summary

The article’s central idea is simple: `codex exec` is the non-interactive, scriptable form of Codex. Instead of opening an interactive TUI and collaborating turn by turn, you hand the agent a complete task up front, let it run, and then consume the result as a subprocess outcome. That makes `codex exec` suitable for CI, cron jobs, pipelines, and service wrappers.

The durable concept is that `codex exec` is not just "Codex in a shell." It is a small runtime contract with four important axes: how the prompt gets in, what comes out, what the agent is allowed to do, and whether the session is ephemeral or resumable. Once you see those axes clearly, the flags in the article stop looking like a long CLI list and start looking like a composable operating model.

The best way to think about `codex exec` is as a one-shot agent function with explicit policy. Input can come from arguments, stdin, files, or images. Output can be plain final text or JSONL events. Permissions are governed by sandbox mode and convenience flags. Sessions can either be discarded (`--ephemeral`) or resumed later (`codex exec resume`). This is the conceptual frame that matters more than any single flag.

## Recommendations

1. Model `codex exec` as a subprocess boundary, not as a conversational interface. Design around stdin, stdout, stderr, exit codes, and timeouts.
2. Treat output mode and sandbox mode as the two primary configuration dimensions. Those two choices define most wrapper behavior.
3. Use structured outputs for automation-heavy tasks. Combine `--output-schema` with `-o` when you want dependable machine-readable results.

## Key Points / Options

### 1. `codex exec` is the headless form of Codex

Local CLI help describes `codex exec` as "Run Codex non-interactively." The article says the same thing in more practical terms: use it for headless, scriptable workflows. This means the run is fundamentally one-shot. You do not stream new human input back into the same process while it is working.

That one decision explains much of the command’s shape. It accepts an initial prompt, optionally reads from stdin when no prompt is provided, can attach images, and then exits when the run is done. This makes it easy to embed into shell pipelines and CI systems because its lifecycle is bounded and predictable.

### 2. Input is front-loaded

The article walks through the supported prompt-ingestion patterns: direct argument, stdin pipe, stdin redirect, here-doc, and image attachments. Local help confirms that if no prompt is passed, stdin is used instead. The key concept is that all meaningful context is assembled before or at process start.

That gives `codex exec` a clean programming model: prepare the task, invoke the agent once, collect the result. If you need another turn, that is a new invocation or an explicit resume flow, not an open interactive loop.

### 3. Output has two layers: result and telemetry

The article’s most useful framing is that stdout and stderr have different jobs. In ordinary mode, `codex exec` streams progress to stderr and reserves stdout for the final agent message. With `--json`, stdout becomes a JSONL event stream. With `-o`, you can additionally write the last agent message to a file.

This separation is what makes the command wrapper-friendly. Human operators can watch progress without corrupting the machine-readable result channel. Downstream programs can safely capture stdout or a file while operational logs remain visible elsewhere.

### 4. The real state machine is output mode x permission mode

The article presents `codex exec` as two orthogonal dimensions: output format and permission level. That abstraction is strong and matches the CLI help well enough to be a good design model.

On the output side, the main choice is plain final message versus JSONL events. On the permission side, the main choice is sandbox level: `read-only`, `workspace-write`, or `danger-full-access`. Convenience flags then package common combinations. `--full-auto` gives low-friction sandboxed execution, while `--dangerously-bypass-approvals-and-sandbox` is the maximal-risk shortcut.

### 5. Sessions are optional state, not the default mental model

`codex exec` can be stateless or stateful. `--ephemeral` avoids saving session files. `codex exec resume` can continue a recorded session, and `--last` makes that easier for the most recent one. The article treats this as an extension, not the core interaction model.

That distinction matters because many wrappers do not need persistent conversational state. If your use case is "read repo, run task, emit result," ephemeral runs are simpler and easier to reason about. Resume flows are more valuable when the agent is part of a longer-running work thread.

### 6. Structured output turns the agent into a pipeline component

The article correctly emphasizes `--output-schema`. With a schema, the final message is constrained to a predictable structure, which is far more robust than scraping prose. OpenAI’s Structured Outputs guidance reinforces that strict schemas should enumerate required fields and set `additionalProperties: false` on objects.

This is the practical hinge between "agent as assistant" and "agent as service primitive." If a downstream tool can trust the output shape, `codex exec` becomes much easier to compose into extraction jobs, report generation, code-review summaries, and workflow automation.

## Sourced Facts

- Local `codex exec --help` says it is the non-interactive command and supports stdin input, images, `--json`, `--output-schema`, `-o`, sandbox selection, `--ephemeral`, and `--skip-git-repo-check`.
- Local `codex exec resume --help` shows that sessions can be resumed by ID or via `--last`.
- Local `codex exec review --help` shows a dedicated review subcommand for uncommitted changes, branch diffs, or a specific commit.
- The fetched X article states that `codex exec` streams progress to stderr and emits the final message to stdout in normal mode.
- OpenAI’s Structured Outputs docs require explicit `required` fields and `additionalProperties: false` for strict object schemas.
- The local installed Codex version during this research was `codex-cli 0.114.0`.

## Inference

The stable concept is not "memorize these flags." The stable concept is "treat `codex exec` like a controlled agent runtime." A good wrapper around it should expose four concerns clearly: prompt assembly, output capture, sandbox policy, and session policy.

In practice, that means `codex exec` is best understood as a batch agent primitive. It is strong when the task can be fully described at launch time and when you want predictable separation between execution logs and final results. It is weaker for full-duplex interactive protocols because that is not what the command is designed to be.

## Risks & Considerations

- **Unsafe permission shortcuts**: The article discusses aggressive bypass flags. Those are useful only in truly isolated environments and should not be treated as casual defaults.
- **Overfitting to observed behavior**: Some article claims are empirical observations against `codex-cli 0.114.0`. They are useful, but wrappers should still validate behavior against local help and current docs over time.
- **Schema complexity**: Structured outputs improve reliability, but overly complex schemas can become brittle. Keep schemas tight and operationally necessary.

## Codebase Patterns

- The repo README says `docs/` is the place for lightweight repo documentation, so this research note lives under `docs/research/`.
- There was no pre-existing local note focused on `codex exec`, so this document is a new reference rather than an edit of an older brief.

## Implementation Outline

1. Define a wrapper interface around prompt source, output mode, sandbox mode, schema, and session policy.
2. Normalize process execution so stdout, stderr, file output, exit status, and timeout behavior are handled consistently.
3. Start with plain final-output and structured-output modes before adding resume or review flows.
4. Make dangerous permission modes explicit opt-ins tied to isolated environments.

## Sources

- [alex fazio on X: "headless maxxing"](https://x.com/alxfazio/status/2032556496781779302)
- [OpenAI Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs)
- [Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- Local CLI help captured from `codex exec --help`
- Local CLI help captured from `codex exec resume --help`
- Local CLI help captured from `codex exec review --help`
