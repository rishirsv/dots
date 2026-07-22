# Description Standard

Use this checklist for skill `name` and `description` frontmatter. Descriptions
are the only text the router sees for every skill on every turn, so they carry
the whole discovery contract.

## Hard rules

- Use neutral active voice without first or second person. Both `Reviews
  changed code…` and `Use when reviewing changed code…` are valid; `I can
  help…`, `Use me to…`, and `Use when you need…` are not.
- State both what the skill does and when to use it. Include the words a
  user would actually type (trigger phrases), drawn from real usage when
  history is available.
- Put the complete discovery boundary in the description. The body loads only
  after selection, so it cannot rescue a missing trigger. Cover implicit user
  intent as well as explicit skill names without turning the description into
  a keyword list.
- Front-load a leading word users already associate with the job. Prefer one
  compact domain concept per distinct trigger branch over synonymous trigger
  lists; listings truncate and routers weight early tokens.
- Use one compact contract: `Use when …; not for …`. Name the closest real
  sibling or category in the boundary; omit speculative exclusions that do not
  help a router choose between live skills.
- Name: lowercase letters/numbers/hyphens, ≤64 chars, no reserved words
  ("anthropic", "claude"), no vague nouns (`helper`, `utils`, `tools`).
  Prefer short verbs or noun phrases users actually type.
- Description ≤1024 chars by spec; target ≤45 words in this repo. No XML
  tags.

## Quality tests

- **Routing test**: could a router pick this skill over its nearest sibling
  from the descriptions alone? If two descriptions both plausibly claim a
  request, both need boundary clauses.
- **Idiom test**: do the trigger tokens match how the user actually invokes
  it (check session history — e.g. "ultraplan", not just "ultra-plan")?
- **Vagueness test**: "Helps with documents", "Processes data" and any
  description that names a category instead of an action fails.
- **Invocation-mode legibility**: explicit-only skills say so and name the
  invocation tokens; auto skills lead with "Use when…" conditions.

## Invocation budget

Choose invocation mode before polishing the description. Autonomous discovery
removes the need for the user to remember the skill, but increases trigger
competition and, on hosts that expose discovery metadata each turn, context
load. Explicit-only invocation spends user memory and gates use on deliberate
selection. Prefer autonomous discovery when ordinary intent or another skill
must reach the skill; prefer explicit-only invocation when human judgment
should gate it. Apply the target host's mechanism. Claim a context saving only
when that host guarantees explicit-only metadata is absent from model context.

When static review cannot settle a routing change, use
[description-improvement.md](description-improvement.md) for a user-reviewed,
rewrite-blinded discovery evaluation. Do not treat attached-skill outcome tests
as evidence that the platform will naturally select the skill.

## Anti-patterns

- Adjective padding ("thorough", "careful", "powerful") — no-op words.
- Listing every synonym of one trigger — one strong token per branch.
- Burying the trigger phrases after 20 words of job narration.
- First-person voice, workflow steps, or implementation detail in the
  description.
