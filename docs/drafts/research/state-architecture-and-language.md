# State Architecture And Ubiquitous Language

Research and Scout synthesis captured July 22, 2026. This document proposes
state shapes and vocabulary; it is not an implementation plan.

## Core Separation

Do not collapse the writing system into one "voice model." It owns four
different kinds of state with different authority and evaluation:

| State | Meaning | Authority | Evaluation |
|---|---|---|---|
| Rules | Explicit prescriptions about what output should or should not do | Normative | Rule compliance and force |
| Stylometry | Measured patterns in what the user has written | Descriptive and probabilistic | Similarity or distance with uncertainty |
| Current intent | What the user wants for this output or revision | Task-local and normally temporary | Task satisfaction |
| Workflow | Ordered activities that read or change the other states | Procedural | Whether activities and approval gates were followed |

A frequent historical behavior does not become a rule. A rule may deliberately
contradict the historical profile because the user is changing how they write.

Example: the corpus may contain many em dashes, so the historical em-dash rate
remains a stylometric observation. If the user says "Stop using em dashes," an
active rule governs future generation without rewriting the historical record.

## Recommended State Planes

### 1. Rules plane

Human-readable, prescriptive instructions with explicit scope, force, status,
authority, examples, exceptions, and revision metadata. Rules are written down,
quickly editable by people and agents, and loaded by workflows.

### 2. Stylometry plane

Versioned descriptive observations derived from a selected corpus. Stylometry
contains distributions, sample sufficiency, uncertainty, extractor versions,
and evidence references. It represents a global baseline plus context-specific
profiles.

### 3. Working-document plane

Checkpointed state for one artifact: brief, audience, current intent, claims,
sources, outline, decisions, unresolved questions, draft lineage, review
findings, and next activity.

### 4. Evidence and learning plane

Immutable writing samples, edit pairs, preference signals, extraction outputs,
rule proposals, approvals, rejections, promotions, retirements, and profile
rebuilds. This plane explains why durable state exists and lets the system
reconsider earlier inferences without losing history.

Conversation history is input evidence, not the voice profile itself.

## Ubiquitous Language

Use one term for each concept throughout the skill, schemas, workflows,
documentation, tests, and user interface.

- **Voice** — The reader-perceived sense of the author behind the writing. It is
  the user-facing outcome, not a stored data type.
- **Writing sample** — Text attributable to the user, recorded with context and
  provenance.
- **Corpus** — A selected collection of writing samples used for analysis.
- **Context** — A recurring writing situation described by channel, genre,
  audience, relationship, purpose, project, and document stage.
- **Register** — A context-dependent expression of the same underlying voice,
  such as report, email, Teams, or iMessage.
- **Stylometric feature** — A defined measurable property such as sentence
  length, punctuation rate, function-word frequency, or paragraph length.
- **Stylometric observation** — A feature value measured from one sample or
  corpus slice.
- **Stylometric profile** — A versioned aggregation of observations for one
  user under a defined scope.
- **Global baseline** — The cross-context portion of a stylometric profile.
- **Context profile** — Observations specific to a named context. A difference
  from the global baseline is variation, not conflict.
- **Rule** — A human-readable normative directive governing output.
- **Rule pack** — A collection of rules sharing ownership or scope.
- **Candidate rule** — A proposed rule that is not yet authoritative.
- **Active rule** — A rule currently governing matching outputs.
- **Override** — A deliberate, narrower replacement or suppression of an active
  rule that preserves the original rule and its history.
- **Conflict** — Two active rules with overlapping applicability and
  incompatible directives.
- **Variation** — A descriptive difference between stylometric observations.
- **Evidence** — A writing sample, edit pair, explicit instruction, or external
  guide supporting an observation or candidate rule.
- **Edit pair** — A presented draft and the user's resulting revision retained
  together.
- **Preference signal** — Evidence that one output was preferred in one
  context. It is not itself a rule.
- **Learning event** — New evidence that may update a profile or propose a rule.
- **Promotion** — The workflow action that changes a candidate rule into an
  active rule.
- **Current intent** — Output-specific content, purpose, and constraints that do
  not automatically become durable state.
- **Working document** — The evolving artifact plus its brief, versions,
  outline, unresolved decisions, and current intent.
- **Checkpoint** — An immutable revision of working-document state with a
  parent, activity, author, and timestamp.
- **Workflow** — A named sequence such as intake, interview, draft, critique,
  developmental edit, voice edit, line edit, adjudication, or final check.
- **Provenance** — Who or what produced a state item, from which source, through
  which activity, and when.
- **Scope** — Where an item applies: user, context, project, artifact, or
  session.
- **Precedence** — The deterministic order used when applicable rules conflict.
- **Rule compliance** — Whether output satisfies applicable active rules.
- **Voice match** — How closely output resembles the applicable stylometric
  profile.
- **Content preservation** — Whether rewriting retained the intended meaning.
- **Naturalness** — Whether output reads as fluent, coherent writing.

Voice match, content preservation, naturalness, and rule compliance must remain
separate evaluation dimensions.

## Rule Schema

### Recommended canonical shape: one rule per file

One authoritative, human-readable file per rule is easy to add, edit, review,
diff, and move between scopes. YAML supplies consistent machine fields while
Markdown supplies rationale and examples.

```md
---
schema_version: 1
id: contractions-in-teams
title: Use contractions in internal Teams messages
action: require
force: should
scope:
  channel: teams
  audience: internal
status: active
authority: user
source_kind: explicit-user-instruction
created_at: 2026-07-22T00:00:00Z
updated_at: 2026-07-22T00:00:00Z
supersedes: []
---

Use contractions in internal Teams messages.

## Why

This keeps short internal messages conversational.

## Exceptions

Do not force a contraction when it changes emphasis or meaning.

## Preferred

I'll send it this afternoon.

## Avoid

I will send it this afternoon.
```

Field semantics:

- `force` expresses normative strength: `must`, `should`, or `may`.
- `authority` records who can establish or override the rule.
- `status` is `candidate`, `active`, `superseded`, or `retired`.
- `scope` selects applicability; it is not a storage path alone.
- `source_kind` distinguishes explicit instruction, confirmed revision,
  repeated evidence, external style guide, and project requirement.
- Confidence does not belong on active rules. A governing rule has force and
  authority; confidence belongs on observations or candidate inferences.

### Rule packs

Rule files are organized into packs such as `personal-global`,
`internal-messaging`, `client-report`, or `artifact-<id>`. Packs may inherit
broader packs, but the system must always show the effective rule set and its
inheritance chain.

Recommended deterministic precedence:

`current intent → artifact rule → project rule → context rule → global rule`

Within the same scope, explicit override wins, then authority, then recency.
Semantic similarity may retrieve supporting evidence; it must never decide
which rule governs.

## Stylometry Schema

### Interpretable observation

```yaml
schema_version: 1
feature: sentence_length_words
family: lexical
scope:
  user: current
  context: teams-internal
summary:
  median: 11
  p25: 7
  p75: 17
sample_count: 86
token_count: 5240
period:
  from: 2025-10-01
  to: 2026-07-22
extractor:
  name: sentence-tokenizer
  version: 2
reliability:
  stability: medium
  confidence_interval: [10.2, 11.8]
evidence:
  - sample-set:teams-2026-07
```

Stylometry should prefer distributions over single averages, retain corpus and
extractor identity, and expose sample sufficiency and uncertainty.

### Profile composition

The recommended product hypothesis is a global baseline plus context profiles:

```yaml
schema_version: 1
profile: user-voice-v7
global:
  observations: []
contexts:
  teams-internal:
    evidence: []
    observations: []
    deltas_from_global: []
  client-report:
    evidence: []
    observations: []
    deltas_from_global: []
```

This represents the same person across different contexts without averaging
away genuine register differences. Whether every context can be represented as
a delta from one baseline remains an empirical question.

Exemplars and latent embeddings may support generation or evaluation, but they
must not become the authoritative rule store. Topic, recipient, templates,
collaborators, and accepted AI text can leak into latent representations.

## Learning Lifecycle

1. Record evidence with author, context, origin, and timestamp.
2. Measurement creates or updates stylometric observations.
3. An edit may create a preference signal.
4. Repeated context-consistent signals may propose a candidate rule.
5. An authorized workflow promotes, rejects, or narrows the candidate.
6. Later decisions explicitly supersede or retire an active rule.
7. Corpus changes produce a new stylometric-profile version rather than
   overwriting the earlier profile.

Current intent can override a durable preference for one artifact, but it does
not silently mutate durable state. One edit can contain factual, structural,
and stylistic changes; the edit pair alone does not establish which difference
should become a rule.

## Workflow Relationship

Rules are part of workflows in three ways:

1. **Selection:** a workflow resolves the applicable rule packs and current
   intent before generating or editing.
2. **Execution:** workflow activities follow active rules and consult the
   applicable stylometric profile.
3. **Learning:** adjudication and finalization activities may record evidence,
   propose candidate rules, or promote explicitly approved rules.

The workflow owns when state is read or changed. Rules govern output; they do
not define process order. Stylometry informs voice match; it does not authorize
behavior.

Recommended workflow families:

- Short-message draft
- Email draft
- Long-form develop
- Voice edit
- Developmental edit
- Line edit
- Critic panel
- Final check
- Learn from revision
- Profile and rule maintenance

## Architecture Options

### A. Layered filesystem companion — recommended

A personal profile root contains one-rule-per-file Markdown, stylometry data,
context profiles, and an append-only learning ledger. Project or artifact roots
hold working-document state and checkpoints. One skill invocation is the state
writer; external documents and connectors remain authoritative for their own
content.

```text
personal/
  profile.yaml
  rules/
    global/
      <rule-id>.md
    contexts/
      <context-id>/
        <rule-id>.md
  stylometry/
    global.yaml
    contexts/
      <context-id>.yaml
  evidence/
    samples.jsonl
    edit-pairs.jsonl
    learning-events.jsonl
  profiles/
    history/

artifacts/
  <artifact-id>/
    brief.md
    state.yaml
    outline.md
    decisions.jsonl
    checkpoints/
```

Why it wins: it balances cross-context identity, report continuity, messaging,
auditability, privacy, portability, and direct human editing. It combines
file-backed working state with traits from Self Improve and native skills.

What it loses: it needs deterministic scope resolution and simple
single-writer or locking discipline. Personal and artifact state must be joined
correctly on every workflow.

### B. Event-sourced voice ledger

Every ingestion, edit, proposal, approval, retirement, context assignment, and
document revision is immutable. Rules and profiles are materialized views.

Why it wins: maximum provenance, reversible learning, extractor upgrades, and
recovery.

What it loses: poor direct editing without tooling, migration and compaction
complexity, and excessive machinery for ordinary messages.

### C. Document-centric dossiers

Each report, email thread, or messaging context owns its corpus, rules, profile,
and revision history. A small global profile supplies defaults.

Why it wins: strong long-form continuity and local editorial intent.

What it loses: fragmented personal identity, duplicated rules, and weak
learning across channels.

### D. SQLite or synchronized profile service

Normalized users, contexts, rules, evidence, documents, revisions, permissions,
and connectors live in a database or service.

Why it wins: querying, concurrency, multi-device synchronization, and connector
integration.

What it loses: human editability, local transparency, portability, and product
focus before the writing model has been validated.

## Recommendation

**Decision confirmed by the user on July 22, 2026:** choose Option A with
one-rule-per-file records organized into layered rule packs.

**Decisions confirmed by the user on July 24, 2026:**

- Learning records authorized evidence and may update descriptive stylometry or
  propose candidate rules automatically, but only explicit promotion makes a
  rule active.
- Contexts use structured dimensions plus reusable named profiles. Dimensions
  include channel, genre, audience, relationship, purpose, project, and
  document stage.

**Default decisions confirmed by the user on July 25, 2026:**

- Stylometry is a soft generation signal and an independent voice-match
  evaluation surface. It never overrides current intent or active rules.
- Editing uses artifact-specific workflows. Messages use quick variants, email
  uses lightweight drafting and revision, and long-form work uses negotiated
  structure, checkpoints, section drafting, and review passes. Accepted
  revisions become edit-pair evidence.
- The product ships as a dedicated plugin rather than another skill inside the
  general Dots plugin. The dedicated plugin owns its root writing skill,
  supporting scripts, schemas, and state namespace; connector-backed ingestion,
  synchronization, and delivery remain future seams rather than initial scope.

Preserve an append-only evidence and learning ledger so the
system can evolve toward Option B if provenance becomes more consequential.
Keep the storage interface narrow enough that a synchronized service could
replace the filesystem later without changing ubiquitous language or workflow
semantics.

Use flat one-rule-per-file records organized into layered rule packs. Require an
effective-rule view so inheritance and overrides never become invisible.

Use a global stylometric baseline plus context profiles as the initial product
hypothesis, and validate whether some contexts require independent profiles.

## Research Basis

Local precedents:

- `plugins/dots/skills/self-improve/` for evidence, proposals, approval, and
  closest-scope rules.
- `plugins/dots/skills/pr/` and Excel live control for keeping external systems
  authoritative.

External precedents:

- [OpenAI Agents SDK sessions](https://openai.github.io/openai-agents-python/sessions/)
- [OpenAI Agents SDK agent memory](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph stores](https://docs.langchain.com/oss/python/langgraph/stores)
- [LangGraph time travel](https://docs.langchain.com/oss/python/langgraph/use-time-travel)
- [Claude Code memory](https://code.claude.com/docs/en/memory)
- [Semantic Kernel agent memory](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-memory)
- [Stylometry survey, Stamatatos 2009](https://doi.org/10.1002/asi.21001)
- [Authorial style and topic, Sundararajan and Woodard 2018](https://aclanthology.org/C18-1238/)
- [Latent authorship representations, Wang et al. 2023](https://aclanthology.org/2023.tacl-1.80/)
- [Composition-mode variation, Wang, Riddell, and Juola 2021](https://aclanthology.org/2021.eacl-main.97.pdf)
- [Learning from implicit edits, Tucker et al. 2024](https://www.cs.cornell.edu/people/tj/publications/tucker_etal_24a.pdf)
- [Text style transfer evaluation, Mir et al. 2019](https://aclanthology.org/N19-1049/)
- [RFC 2119 requirement language](https://www.rfc-editor.org/info/rfc2119/)
- [Vale writing styles](https://vale.sh/docs/styles)
- [EditorConfig specification](https://spec.editorconfig.org/)
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)
