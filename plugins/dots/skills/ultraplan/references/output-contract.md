# Plan Output Contract

Read this before synthesis and before reviewing a created or upgraded plan.

## Delivery Default

Save the full plan as a durable artifact using the repo's plans convention.
Inspect repo instructions, planning docs, and existing plan locations before
choosing the path; if none is discoverable, use the repo's active planning area,
otherwise say so and ask only if the destination is genuinely blocking.

The chat reply is a concise summary, not the full plan: artifact path, core
approach, important context checked, open decisions or proof limits, and the next
gate. Keep planning depth, agent counts, and critique mechanics out of chat
unless they change what the user does next.

## Plan Shape

Start with the executable plan, not an audit trail. The implementing agent
should reach the outcome, approach, and first step immediately. Do not add a
masthead or run-log by default. For non-code work, keep the same shape but use
domain terms instead of files and commands.

```md
# <Clear Title>

## Outcome
- <what is true when this is done>

## Approach
- <chosen path and key sequencing dependency>

## Steps
1. <first concrete slice>
   - Change: <what to change>
   - Verify: <how to prove this slice>
2. <next slice>
   - Change / Verify

## Validation
- Automated: <commands/checks>
- Manual: <screens, workflows, review, or proof limits>

## Assumptions / Deferrals
- <defaults chosen, or tempting work intentionally deferred>
```

Add a section only when it prevents a concrete implementation mistake:

| Add | When |
| --- | --- |
| `Current State` | Implementation would otherwise start from a false premise or stale repo state. Keep it to facts that change the plan. |
| `Context Checked` | The plan depends on repo docs, feature-building guidance, screenshots, external docs, or subagent research. |
| `Target Standard` | The task changes a design-system rule, architecture contract, naming vocabulary, policy, or reusable primitive. |
| `Contracts` | Data, API, state, routing, persistence, sync, or platform contracts must exist before implementation. |
| `Visual Target` | Current screens, mockups, Image Gen concepts, or visual comparison shape implementation. |
| `Scope` | Adjacent work is tempting enough that excluding it changes implementation behavior. |
| `Read Gates` | Specific repo instructions, skills, docs, or references must be loaded before implementation. |
| `Owners` | Ownership is cross-module, non-obvious, or needed to prevent duplicate work. |

Put public API, interface, type, migration, compatibility, or rollout notes
inside the relevant step unless they cut across the whole plan. Cite paths,
symbols, and commands for load-bearing claims; prefer symbols over line numbers
because lines drift. Include only detail that helps the implementer execute or
verify the work; omit transcripts, chain-of-thought, and rejected alternatives.
When a human decision remains unresolved, name it with the recommended default,
decision owner, and implementation impact instead of silently settling it or
blocking the rest of the plan.

## Upgrading An Existing Plan

Return the complete upgraded document in the input's format.

- Preserve unchanged working sections; rewrite only what confirmed findings or a
  chosen simplification require. Do not rewrite for style alone.
- Convert false premises into owned precondition steps; convert "build X" into
  "reuse existing X" when an owner exists; narrow or defer abstractions, shims,
  and broad refactors that do not serve the current goal; isolate risky version,
  SDK, schema, or dependency changes into their own gate.
- Replace naive moves across layers with wrap, adapter, or projection designs
  when transitive references would otherwise create cycles.
- Keep refuted findings and losing alternatives out of the plan body — they go in
  the changelog.
- Markdown: preserve heading style and document spine; keep tables and fences
  readable in plain Markdown.
- HTML: preserve the outer scaffold, style, and script blocks; change plan
  content, not the visual system; keep one `<main>` and valid closing tags.

## Structural Checks

Before handoff, check the artifact for its format:

- Markdown: logical heading order, closed code fences, tables render as plain
  Markdown, required sections present.
- HTML: exactly one `<main>` when the input had one, valid closing `</body>` and
  `</html>` tags, expected section ids present or deliberately changed, no
  duplicate major ids introduced.
- Any format: the artifact is complete, not a fragment, unless the user asked for
  a fragment. For an upgrade, diff against the preserved base and inspect for
  accidental rewrites, dropped acceptance criteria, stale false premises, or new
  complexity not justified by confirmed findings.

## Changelog

For an upgraded plan, write a sibling Markdown changelog:

1. `Verdict` — two or three sentences on the plan's health after the pass.
2. `Confirmed changes applied` — grouped by lens: problem, evidence, change.
3. `Refuted / not changed` — findings deliberately excluded, and why.
4. `Chosen simplification` — only when the plan needed meaningful narrowing or a
   different implementation path.
5. `Open decisions for the human` — product, privacy, release, or ownership calls
   the repo could not settle.

The changelog is where the reader sees rejected claims and losing designs; the
upgraded plan itself stays executable and focused.
