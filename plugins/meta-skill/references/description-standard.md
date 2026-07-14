# Description Standard

The checklist for skill `name` and `description` frontmatter, distilled from
Anthropic's Agent Skills authoring guidance. Descriptions are the only text
the router sees for every skill on every turn — they carry the whole
discovery contract.

## Hard rules

- Use neutral active voice without first or second person. Both `Reviews
  changed code…` and `Use when reviewing changed code…` are valid; `I can
  help…`, `Use me to…`, and `Use when you need…` are not.
- State both what the skill does and when to use it. Include the words a
  user would actually type (trigger phrases), drawn from real usage when
  history is available.
- Front-load the key use case: listings truncate, and routers weight early
  tokens. The first clause should carry the strongest trigger.
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
