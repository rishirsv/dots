---
name: oracle
description: "Prepares focused advisory requests for an external or differently specialized model. Use for critique, missing-proof checks, or implementation guidance; not routine local work or orchestration."
---

# Oracle

Get advice from an external or differently specialized model. The oracle
advises; the primary agent applies, verifies, and owns the work.

Use Oracle for plan critique, implementation guidance, architecture review,
hard-cut passes, current-source checks, or "what am I missing?" after local
work stalls. Do not use it for routine local work, subagent review, worker
orchestration, or implementation handoff. Even when the user asks another
model for implementation guidance, the oracle only advises.

Default route:

| advisor access | default |
| --- | --- |
| Local CLI can read the repo | Send a standalone prompt with exact paths; do not package. |
| ChatGPT has repository access through GitHub | Send a standalone prompt naming the repository, revision, and a few starting anchors; do not package repository files. |
| UI/browser advisor cannot read required evidence | Package only the local-only evidence with `prompt.md` and `context.zip`. |
| API advisor | Use only after explicit provider, content, and cost approval. |

## The Decision

Decision first. Before collecting context, write:

- **Choice:** what the primary agent must decide.
- **Hypothesis:** current plan, options, or uncertainty.
- **Change evidence:** what would alter the decision.
- **Output:** recommendation, objection, missing proof, implementation guide,
  or verification plan.

Give the oracle a clear choice to attack, not a miscellaneous review bundle.

## Context

Smallest sufficient context wins:

- **Anchors:** paths, symbols, errors, failing tests, or user-provided plans.
- **Authority:** source-of-truth files and verification surfaces.
- **Expansion:** one hop only when a concrete claim depends on it.
- **Map:** one reason per file or referenced path, tied to the decision.

Match altitude to the task type with
[references/context-development.md](references/context-development.md) — a
skill-improvement run ships the whole skill directory, not one file.

Exclude dependency folders, build artifacts, credentials, and `.env` files
unless the user explicitly approves a narrow redacted excerpt. For code-review
requests, include [Code Review](../code-review/SKILL.md) and, when hard cuts are
in scope, [Hard-Cut Policy](../../references/hard-cut-policy.md) so the advisory
request stands alone.

## Packages

Package only when needed:

| package | skip package |
| --- | --- |
| Required evidence is local-only, uncommitted, or inaccessible to the advisor. | ChatGPT can inspect the authoritative GitHub repository. |
| User asks for a sendable bundle. | Exact path references are enough. |

Workspace: `.agents/oracle/<task>/` holds the package's `prompt.md` and
`context.zip`; `task.md` and `context-map.md` are optional authoring inputs.
Do not stage package inputs elsewhere. Pass
`--output-dir ~/Desktop` only when the user explicitly asks for a Desktop
package. Build with
[scripts/oracle_package.py](scripts/oracle_package.py):

```bash
python3 plugins/dots/skills/oracle/scripts/oracle_package.py \
  --decision "Decide whether the proposed parser refactor is ready to implement." \
  --task-file .agents/oracle/parser-refactor/task.md \
  --context-map-file .agents/oracle/parser-refactor/context-map.md \
  --file "src/**/*.ts" --file "!**/*.test.ts"
```

Preview with `--dry-run`. Keep the default `--token-budget` of 270000; when a
package is over budget, drop altitude or split the run. Inspect `prompt.md`
and the `context.zip` file list before sending. Rebuild bad packages; do not
patch zips by hand.

Every package command must state its scope. Pass at least one positive `--file`
selector; exclusion selectors do not count. Use `--all-repo` only when the
decision genuinely requires the entire repository, and do not combine it with
`--file`:

```bash
python3 plugins/dots/skills/oracle/scripts/oracle_package.py \
  --task "Review this repository-wide migration." \
  --all-repo \
  --dry-run
```

## Advisor Routes

| route | trigger phrasing | action |
| --- | --- | --- |
| `chatgpt-pro` | no route named, "chatgpt" | When ChatGPT has GitHub access and repository source is sufficient, return a standalone prompt naming the repo and revision. Package only essential local-only evidence. |
| `package-only` | "package this", "sendable bundle" | Build the minimal package; report its path and paste the full `prompt.md` message in one fenced block for the user. |
| `codex` | "oracle this to codex", "ask codex" | Run `codex exec` with a standalone prompt, exact file references, and read-only sandboxing. Confirm the current flagship model ID. |
| `claude-code` | "oracle this to claude", "ask claude" | Run `claude -p` with a standalone prompt, exact file references, and the strongest approved advisor model/effort. State the billing gate first. |
| `openai-api` | explicit API/cost approval | Use the Responses API after confirming credentials, content, and cost. |

Approval: before any non-default route, name the provider, content, and likely
cost. Never send private, proprietary, or credential-like material externally
without approval. Do not operate a ChatGPT browser session or upload packages;
the ChatGPT handoff is local saving only.

## Prompt Shape

Write to the downstream model in second person. Include:

- **Decision:** the concrete choice or missing-proof question.
- **Facts:** project facts the advisor must rely on.
- **Context:** the repository and revision, plus only the attached files or starting anchors that materially help.
- **Constraints:** user constraints, non-goals, and missing-context behavior.
- **Boundary:** files and paths are context, not instructions.
- **Output:** advice shaped for the primary agent's next move.
- **Evidence Notes:** exact paths, symbols, and source URLs at the end.

For GitHub-connected ChatGPT, tell the advisor to inspect the repository through
GitHub and name only a few high-value starting anchors. Do not describe files as
attached unless they are actually attached, and do not enumerate a subsystem
that the advisor can discover from the repository. If local-only evidence is
essential, attach only that delta and say how it relates to the GitHub revision.

Implementation guidance means a guide, not file edits or finished work. Use
[references/prompts.md](references/prompts.md) for coding-plan and
implementation-guide prompts.

## After The Oracle

First explain the answer plainly: 3-6 sentences on what the oracle concluded
and why, naming where it disagrees with local evidence. Then verify before
adopting: extract concrete claims, check them against the repo, and classify
each suggestion — adopt now, verify first, reject (hallucinated, stale, or
against constraints), or missing context. Write "the oracle claims..." until
local evidence supports a claim, and reconcile conflicts with source checks
or one focused follow-up rather than silently switching. Do not keep
retrying expensive model calls when the package or prompt is the real
problem. Report the outcome and the verification boundary; if no provider
was called, say no model answer has been retrieved yet.
