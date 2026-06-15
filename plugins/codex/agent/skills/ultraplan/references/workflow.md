# Ultraplan Workflow

Read this for the exact phase topology, role prompts, schemas, and state
machine. Keep the roles read-only until synthesis writes the plan artifacts.

## State Machine

```text
IDLE
  -> SCOPE_CONFIRM
SCOPE_CONFIRM
  -> GROUND
  -> SINGLE_PASS when the user declines heavy depth
GROUND
  -> MAP
MAP
  -> CRITIQUE
CRITIQUE
  -> VERIFY, pipelined per finding
VERIFY
  -> DESIGN after confirmed findings are collected
DESIGN
  -> JUDGE
JUDGE
  -> SYNTHESIZE
SYNTHESIZE
  -> POST_VALIDATE
POST_VALIDATE
  -> HANDOFF
HANDOFF
  -> APPLY only after explicit user approval
  -> DONE when the user keeps the artifacts separate
  -> DESIGN when the user rejects the plan with new constraints
```

User approvals happen before the heavy pass and after synthesis. Internal
phases do not pause for approval unless a product, privacy, destructive, or
irreversible decision cannot be answered from source.

## Topology

```text
Map
  -> Critique: six lenses in parallel
  -> Verify: one independent verifier per finding, pipelined
  -> Design: three alternatives in parallel
  -> Judge
  -> Synthesize: upgraded plan author + changelog author
```

The Critique -> Verify transition is a pipeline: verify findings as soon as a
lens returns. Design is a barrier: it needs the full confirmed set.

## Seed Grounding

Before subagents, run a small read-only grounding pass:

- read repo instructions and the plan
- search for artifacts the plan asserts are done, moved, required, or absent
- check current toolchain/dependency/version claims when they matter
- capture commands and paths, not impressions

Pass seeds as:

```text
Seed observations (VERIFY against the repo with rg/Read/git; do NOT trust blindly):
<facts with commands or paths>
```

## Roles

### Mapper

Mission: faithful structured map plus first-pass grounding.

Input: plan path, repo root, seed observations.

Prompt core:

```text
You are mapping a plan/spec/design document before an ultra-planning critique.
Read it in full: <PLAN>
Repo root: <REPO> (use rg, Read, git ls-files, git log to ground claims).

<SEED>

Produce a faithful structured map as plain text:
1. The step/PR structure (each step id, title, one-line scope).
2. Every load-bearing ASSUMPTION the plan states or relies on (quote it).
3. Every concrete repo claim the plan makes (types, files, versions, commands) and whether it matches the committed repo (verify each).
4. The biggest internal contradictions between sections.
Be specific with section/step ids and file paths. This map seeds the downstream critics.
```

### Critics

Mission: one lens, strongest 3-5 grounded findings.

Prompt core:

```text
You are an adversarial plan critic. Lens: <LENS_TITLE>.
Read the plan: <PLAN>. Repo root: <REPO> (ground every claim with rg/Read/git).

<SEED>

MAP of the plan (from a prior pass):
<MAP>

Find real, specific problems through the lens of "<LENS_TITLE>".
Focus: <LENS_FOCUS>

Rules:
- Ground each finding in the COMMITTED repo. Put exact file paths / symbols / commands in evidence. If you could not verify, say "unverified-needs-check" and lower severity.
- Be concrete: name the section/step and give a concrete proposedChange.
- Quality over quantity: return your strongest 3-5 findings, not filler. Do not invent problems.
- "blocking" = the plan cannot correctly start or will produce wrong work as written.
```

Default lenses:

| Key | Title | Focus |
|---|---|---|
| `premise` | Premise integrity | False or stale assumptions vs the committed repo. Flag anything asserted as done, landed, or already present without ownership, plus unreleased or unjustified version/dependency bumps. |
| `sequencing` | Sequencing & dependencies | Step order, prerequisites, missing owners for assumed preconditions, dependency on out-of-scope work, and blast radius of each move. |
| `reuse` | Reuse before build | Work that already exists. For every "implement X", search for a working owner and recommend reuse or surfacing instead. |
| `ownership` | Ownership & boundaries | One canonical owner, target/module edges, transitive references, dependency cycles, and lower layers staying free of upper-layer types. |
| `testability` | Testability & proof | Whether each step is provable in the current environment, has producer and consumer, and names runnable verification commands. |
| `risk` | Risk & failure modes | Concrete failure modes with evidence: shipping, CI, schema/version, environment mismatch, silent breakage, or irreversible actions. |

### Verifiers

Mission: independently try to refute one finding.

Critical bias: default `real=false` unless the evidence clearly holds.

Prompt core:

```text
You are an adversarial verifier. Try to REFUTE this finding against the committed codebase. Default to real=false unless the evidence clearly holds.
Repo root: <REPO>. Plan: <PLAN>. Lens: <LENS_TITLE>.

FINDING:
- id: <ID>
- title: <TITLE>
- claimed severity: <SEVERITY>
- problem: <PROBLEM>
- critic evidence: <EVIDENCE>
- proposed change: <PROPOSED_CHANGE>

Verify by actually running rg / reading files / git. For any version/date/release claim, reason explicitly about whether it is true TODAY and whether the plan truly depends on it.
Return: real (does the problem genuinely hold?), confidence, the evidence you gathered, and a refinedChange (sharper fix, or why no change is needed).
```

### Designers

Run three alternatives after verification:

- `minimal-correct`: smallest change to the existing structure that fixes every
  confirmed blocking/high finding; add a step only when a precondition truly
  needs a separate owner.
- `risk-first`: re-sequence to retire the biggest risks first; default
  dependency/version posture to what is provable today.
- `reuse-maximal`: restructure around existing implementation; shrink or
  collapse steps whose work is already built.

Prompt core:

```text
Propose a re-scoped version of the plan. Angle: <ANGLE_KEY> - <ANGLE_DESC>
Plan: <PLAN>. Repo root: <REPO>.

<SEED>

CONFIRMED findings to resolve (refuted ones excluded):
<CONFIRMED_BRIEF>

Return a concrete step sequence (each: step id, title, scope, rationale), an explicit version/SDK/dependency posture justified by what is provable TODAY, tradeoffs, and which finding ids you resolve. Stay faithful to the plan's philosophy and constraints.
```

### Judge

Prompt core:

```text
You are judging <N> alternative re-scopings of the plan.
Confirmed findings each design must address:
<CONFIRMED_BRIEF>

DESIGNS:
<DESIGNS>

Score each 0-10 on: premise correctness, how many confirmed findings it resolves, faithfulness to the plan's philosophy, and buildability today. Pick a winner and list the best grafts to fold in from the runners-up.
```

### Plan Author

Prompt core:

```text
You are producing the UPGRADED plan. Read the current plan: <PLAN>.
Detect the input format from its contents and PRESERVE it exactly. If HTML, keep style/script and the scaffold. If Markdown, keep headings. Return the COMPLETE upgraded document in the same format.

Apply the WINNING re-scoping and the confirmed findings. Preserve every section the findings do not require changing. Where the plan says to "implement" something that already exists, change it to reuse/surface the existing owner. Make any version/SDK posture match the judged recommendation consistently throughout.

WINNING DESIGN (<WINNER>):
<WINNING_SUMMARY>
GRAFTS to fold in: <GRAFTS>

CONFIRMED findings to resolve (refuted findings MUST NOT drive changes):
<CONFIRMED_BRIEF>

Return ONLY the upgraded document content. No markdown fences around the whole thing, no commentary.
```

### Changelog Author

Prompt core:

```text
Write a precise markdown changelog titled "Ultra pass: base -> upgraded plan".
Sections:
1. "Verdict" - 2-3 sentences on the plan's overall health after the pass.
2. "Confirmed changes applied" - grouped by lens: each = the problem, the confirming evidence, the change made.
3. "Refuted / not changed" - findings raised but refuted by verification, with why.
4. "Chosen re-scoping" - the winning design, why it won, and the grafts folded in.
5. "Open decisions for the human" - anything the pass could not settle.

Return raw markdown only.
```

## Schemas

Use these exact structured shapes when the runtime can enforce schemas. If it
cannot, ask agents to return JSON matching these shapes and validate manually.

```json
{
  "FINDINGS_SCHEMA": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "lens": { "type": "string" },
      "findings": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": { "type": "string" },
            "title": { "type": "string" },
            "severity": { "type": "string", "enum": ["blocking", "high", "medium", "low"] },
            "problem": { "type": "string" },
            "evidence": { "type": "string" },
            "proposedChange": { "type": "string" }
          },
          "required": ["id", "title", "severity", "problem", "evidence", "proposedChange"]
        }
      }
    },
    "required": ["lens", "findings"]
  },
  "VERDICT_SCHEMA": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "findingId": { "type": "string" },
      "real": { "type": "boolean" },
      "confidence": { "type": "string", "enum": ["high", "medium", "low"] },
      "evidence": { "type": "string" },
      "refinedChange": { "type": "string" }
    },
    "required": ["findingId", "real", "confidence", "evidence", "refinedChange"]
  },
  "DESIGN_SCHEMA": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "name": { "type": "string" },
      "summary": { "type": "string" },
      "stepSequence": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "step": { "type": "string" },
            "title": { "type": "string" },
            "scope": { "type": "string" },
            "rationale": { "type": "string" }
          },
          "required": ["step", "title", "scope", "rationale"]
        }
      },
      "versionPosture": { "type": "string" },
      "tradeoffs": { "type": "string" },
      "addresses": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["name", "summary", "stepSequence", "versionPosture", "tradeoffs", "addresses"]
  },
  "JUDGE_SCHEMA": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "rankings": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "name": { "type": "string" },
            "score": { "type": "number" },
            "why": { "type": "string" }
          },
          "required": ["name", "score", "why"]
        }
      },
      "winner": { "type": "string" },
      "grafts": { "type": "array", "items": { "type": "string" } },
      "rationale": { "type": "string" }
    },
    "required": ["rankings", "winner", "grafts", "rationale"]
  }
}
```
