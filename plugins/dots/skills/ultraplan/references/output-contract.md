# Plan Output Contract

Read this before synthesis and before reviewing a created or upgraded plan.

## Delivery Default

Save the full plan using the repo's plan convention. If none exists, use its
active planning area and ask only when the destination blocks progress. In chat,
give the artifact path, core approach, open decisions or proof limits, and next
gate—not the full plan or research mechanics.

## Write For The Executor

Write an outcome-focused job handoff for a capable repo agent. It must stand
without the planning conversation, but may rely on the executor to inspect
source, load repo instructions, follow canonical docs, and run owned commands.

Preserve only what that inspection cannot safely reconstruct: why the work
matters, observable outcome, scope and approval boundaries, non-obvious
invariants, owners, reusable anchors, dependencies, success criteria, evidence,
and real human or external gates. State each fact once and reference canonical
context.

Start with execution, not an audit trail. Omit research and source inventories,
subagent reports, rejected options, repeated test matrices, generic repo
conventions, internal reasoning, and routine actions the executor can derive.
Use complete sentences and plain domain terms. Trim repetition and optional
background before required facts.

## Default Shape

```md
# <Clear Title>

## Outcome and boundaries
- Why: <what this enables for the user or system>
- Outcome: <observable behavior or system state>
- In scope / out of scope: <only boundaries that prevent scope drift>
- Authority and locked constraints: <approval boundary and approved decisions
  that shape implementation>

## Implementation slices
1. <vertical slice with one independently meaningful result>
   - Anchors: <repo-relative paths, symbols, existing owners, or reusable work>
   - Change: <behavior and contract to implement>
   - Verify: <focused proof that can reject a bad implementation>
2. <next dependent slice>
   - Anchors / Change / Verify

## Cross-cutting decisions
- <only contracts or invariants that constrain more than one slice>

## Final verification and gates
- Success criteria: <observable conditions that make the outcome complete>
- Integrated proof: <evidence for end-to-end behavior, build, runtime, device,
  or review>
- Gate: <unresolved human or external prerequisite, recommended default, owner,
  and implementation impact>
```

Omit `Cross-cutting decisions` when every constraint fits beside one slice.
Omit the gate when none remains. Put current state, targets, interfaces,
migrations, rollout, and visual decisions beside the slice they change; promote
only genuinely shared constraints. Use exact data shapes only for approved
contracts. Cite repo-relative paths and symbols for load-bearing claims, and
commands only when repo guidance does not already own them. For non-code work,
use domain anchors and proof.

After approval, assume the executor continues through safe, in-scope local work
and verification. Name only gates requiring a human decision, external write,
destructive action, purchase, or material scope expansion.

## Split Independent Work

Split independently approvable and verifiable work into one compact dependency
index plus one executable plan per slice. Keep shared constraints in the index;
do not copy them. Keep one plan when a transaction, migration, release, or user
journey must land and be verified atomically.

## Upgrading An Existing Plan

Return the complete upgraded document in the input's format.

- Preserve unchanged working sections; rewrite only what confirmed findings or a
  chosen simplification require.
- Turn false premises into preconditions, reuse existing owners, narrow or defer
  unsupported abstractions and refactors, and isolate risky version, SDK,
  schema, or dependency changes behind a gate.
- Remove duplicated current state, evidence, test lists, and decisions even when
  the input used separate headings for them. Preserve acceptance criteria and
  source-backed constraints, not verbosity.
- Keep refuted findings and losing alternatives out of the executable plan.
- Markdown: preserve heading style and document spine.
- HTML: preserve the outer scaffold, style, and script blocks; change plan
  content, not the visual system; keep one `<main>` and valid closing tags.

Summarize material revisions in chat. Write a sibling changelog only when the
user asks for one or the repo requires a durable audit trail. When required,
keep it to the verdict, confirmed plan changes, deliberately excluded findings,
and unresolved human decisions; do not restate the upgraded plan.

## Structural Checks

Before handoff, check the artifact for its format:

- Markdown: logical headings, closed fences, readable tables, executable spine.
- HTML: exactly one `<main>` when the input had one, valid closing `</body>` and
  `</html>` tags, expected section ids present or deliberately changed, no
  duplicate major ids introduced.
- Any format: the artifact is complete, not a fragment, unless the user asked for
  a fragment. Each paragraph must change a decision, boundary, sequence, anchor,
  or proof. It states the outcome, authority boundary, success criteria, and
  required evidence without exposing or scripting internal reasoning. For an
  upgrade, diff against the base and inspect for accidental rewrites, dropped
  acceptance criteria, stale premises, duplicated facts, or new complexity not
  justified by confirmed findings.
