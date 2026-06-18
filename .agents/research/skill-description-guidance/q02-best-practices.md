# Skill Description Guidance Research

## Question

What are current best practices for agent skill frontmatter descriptions, especially for explicit-only skills versus model-discoverable skills, and should explicit-only skills avoid `Use when ...; not for ...` descriptions?

## Scope

This pass prioritized current official/public sources, especially OpenAI/Codex skill documentation, then compared those sources with local guidance in `plugins/meta-skill/skills/skill-writer/references/design.md`. The stop condition was enough evidence to recommend description guidance for explicit-only skills.

Plan subquestions:

1. What does Codex currently load from skills before activation, and how does that make `description` matter?
2. What do the public Agent Skills specification and creator guidance require or recommend for `description`?
3. What runtime controls exist for explicit-only/manual invocation?
4. What does local Meta-Skill guidance currently say about model-discoverable versus explicit-only skills?
5. Do official/public sources support avoiding `Use when ...; not for ...` for explicit-only skills?

## Answer

Explicit-only skills should not categorically avoid `Use when ...; not for ...` descriptions. The better rule is conditional:

- For model-discoverable skills, use a concise routing description, usually in the `Use when <intent + task object + context>; not for <nearest adjacent boundary>` shape. Front-load the strongest trigger words, include realistic user phrasing, name the task object, and include a `not for` boundary when there is real over-trigger risk.
- For explicit-only skills, keep the required `SKILL.md` description concise and human-facing. A `Use when ...` sentence is still useful when the description appears in selectors, docs, routers, validation, or future runtimes. A `not for ...` clause is optional: include it only when a human or router needs the adjacent boundary; omit it when the skill is unambiguous and manual invocation already provides the boundary.
- Do not tune explicit-only descriptions as aggressively as model-discoverable descriptions. Use `agents/openai.yaml` with `policy.allow_implicit_invocation: false` in Codex when the skill should not auto-trigger. In Claude Code, the comparable control is `disable-model-invocation: true`; implementation names differ, but the design distinction is the same.
- Avoid workflow-step descriptions for both classes. A description like `Use when writing skills: first interview the user, then draft SKILL.md...` risks the agent treating the description as the procedure instead of loading and following the body.
- If many explicit-only skills become hard to remember, create or update a model-discoverable router skill that tells the human when to invoke each explicit skill. Do not make every niche/manual skill model-discoverable just to compensate for discoverability.

## Key Evidence

### Facts

- OpenAI Codex says skills use progressive disclosure: Codex initially has each skill's name, description, and path, and loads full `SKILL.md` only after selecting a skill. It also caps the initial skill list and may shorten descriptions first, so descriptions need concise front-loaded triggers. Source: OpenAI Codex Agent Skills docs, accessed 2026-06-18, https://developers.openai.com/codex/skills.
- OpenAI Codex supports explicit-only behavior through `agents/openai.yaml`: `policy.allow_implicit_invocation: false` means Codex will not implicitly invoke the skill from the user prompt, while explicit `$skill` invocation still works. Source: OpenAI Codex Agent Skills docs, accessed 2026-06-18, https://developers.openai.com/codex/skills.
- OpenAI Codex best practices say to keep each skill focused, write imperative steps with explicit inputs/outputs, and test prompts against the skill description for trigger behavior. Source: OpenAI Codex Agent Skills docs, accessed 2026-06-18, https://developers.openai.com/codex/skills.
- The open Agent Skills specification requires `description`, limits it to 1024 characters, and says it should describe both what the skill does and when to use it, with specific keywords that help agents identify relevant tasks. Source: Agent Skills specification, accessed 2026-06-18, https://agentskills.io/specification.
- The Agent Skills description-optimization guide states that the `description` carries the burden of triggering; recommends `Use this skill when...`, user intent over implementation, concise scope, and evals with realistic should-trigger and should-not-trigger prompts. Source: Optimizing skill descriptions, accessed 2026-06-18, https://agentskills.io/skill-creation/optimizing-descriptions.
- Claude Code distinguishes reference/guideline skills from task skills and says task content is often something users should invoke directly. It offers `disable-model-invocation: true` to prevent automatic loading, and notes that this removes the skill from Claude's context entirely. Source: Claude Code skills docs, accessed 2026-06-18, https://code.claude.com/docs/en/skills.
- Local Meta-Skill guidance says the frontmatter description is the primary routing surface; model-discoverable descriptions spend context every turn; explicit-only invocation is appropriate when the user should be the index because the skill is niche, personal, sensitive, rarely used, or too broad to trigger safely. It also says Codex explicit-only skills should set `policy.allow_implicit_invocation: false` and keep the required `SKILL.md` description concise and human-facing. Source: `plugins/meta-skill/skills/skill-writer/references/design.md:290-411`.

### Inferences

- The `Use when ...; not for ...` pattern is best understood as a routing-contract pattern, not as a mandatory grammar. It is strongly justified for model-discoverable skills because the model must decide whether to load the body from only the metadata.
- For explicit-only skills, the routing burden shifts from model context to human memory or a router skill. That weakens the need for an optimized `not for` clause, but does not make the pattern harmful by itself.
- The local guidance is broadly aligned with official/public sources. Its extra recommendation to use `not for ...` is a local operational refinement for avoiding adjacent-skill collisions; the public docs support the underlying idea by recommending boundaries, negative trigger tests, and specificity, even when they do not require that exact phrase.

### Recommendation

Use this repo rule:

```yaml
# Model-discoverable
description: Use when <real user intent + task object + context>; not for <closest adjacent boundary>.
```

```yaml
# Explicit-only
description: <Concise human-facing purpose and manual invocation context>. [Optional: not for <boundary> when confusion is likely.]
```

For explicit-only Codex skills, also include:

```yaml
policy:
  allow_implicit_invocation: false
```

Keep `not for ...` on explicit-only skills when the distinction helps a human choose correctly, helps a router skill, or prevents future accidental promotion to model-discoverable. Drop it when it is redundant or makes the description feel like a keyword-stuffed trigger.

## Commands/Searches Run

- `rg -n "meta-skill|skill description|frontmatter|explicit-only|Use when|model-discoverable|skill-writer" /Users/rishi/.codex/memories/MEMORY.md`
- `sed -n '1,220p' /Users/rishi/Code/dots/plugins/meta-skill/skills/meta-skill/SKILL.md`
- `sed -n '1,260p' /Users/rishi/Code/dots/plugins/meta-skill/skills/skill-writer/SKILL.md`
- `sed -n '1,260p' /Users/rishi/Code/dots/plugins/meta-skill/skills/skill-writer/references/design.md`
- `rg -n "Frontmatter|description|explicit|discover|trigger|Use when|not for|model" plugins/meta-skill/skills/skill-writer/references/design.md`
- `rg -n "frontmatter|description|Use when|not for|discover|explicit" plugins/meta-skill -g 'SKILL.md' -g '*.md'`
- `nl -ba plugins/meta-skill/skills/skill-writer/references/design.md | sed -n '286,418p'`
- `nl -ba plugins/meta-skill/skills/skill-writer/references/cookbook.md | sed -n '70,112p'`
- `nl -ba plugins/meta-skill/skills/skill-writer/references/openai_yaml.md | sed -n '1,60p'`
- Web search: `site:platform.openai.com/docs Codex skills SKILL.md frontmatter description Use when not for explicit invocation`
- Web search: `site:developers.openai.com Codex skills SKILL.md description allow_implicit_invocation`
- Web search: `site:help.openai.com Codex skills SKILL.md description frontmatter`
- Web search: `Anthropic skills description frontmatter Use when skill best practices`
- Web search: `site:docs.anthropic.com skills description frontmatter SKILL.md`

## Sources Consulted

1. OpenAI Developers, "Agent Skills - Codex," accessed 2026-06-18: https://developers.openai.com/codex/skills
2. Agent Skills, "Specification," accessed 2026-06-18: https://agentskills.io/specification
3. Agent Skills, "Optimizing skill descriptions," accessed 2026-06-18: https://agentskills.io/skill-creation/optimizing-descriptions
4. Anthropic Claude Code Docs, "Extend Claude with skills," accessed 2026-06-18: https://code.claude.com/docs/en/skills
5. Local repo guidance: `plugins/meta-skill/skills/skill-writer/references/design.md`, especially lines 290-411.
6. Local supporting repo guidance: `plugins/meta-skill/skills/skill-writer/references/cookbook.md:70-100` and `plugins/meta-skill/skills/skill-writer/references/openai_yaml.md:47-49`.

## Sources Not Consulted

- Third-party blog posts, Reddit discussions, LinkedIn posts, and YouTube explainers were not used because official/open-standard sources were sufficient.
- The OpenAI `openai/skills` catalog was opened only as a second-order lead from the Codex docs and not used for the recommendation because the docs/specs provide stronger normative guidance than example catalog entries.
- Local generated/vendor plugin packages and installed caches were not inspected, per repo boundaries.

## Contradictions Or Caveats

- Field names differ by runtime. Codex uses `agents/openai.yaml` with `policy.allow_implicit_invocation: false`; Claude Code uses `disable-model-invocation: true` in `SKILL.md` frontmatter. These are analogous design controls, not portable syntax.
- The open Agent Skills specification does not define explicit-only invocation policy. Explicit-only behavior is runtime-specific.
- Public description guidance strongly recommends clear when-to-use text and trigger testing, but it does not require the exact `Use when ...; not for ...` grammar. That grammar is a local convention aligned with the public guidance.
- OpenAI Codex docs say descriptions may be shortened when many skills are installed, which increases the value of front-loading. If `allow_implicit_invocation: false` removes an explicit-only skill from default model context, the same context-budget pressure may not apply to that skill, but the description can still appear in selectors, validation, or router documentation.

## Confidence

High for the main recommendation. The strongest evidence comes from OpenAI's Codex docs, the Agent Skills open specification, and local Meta-Skill guidance, all of which agree that descriptions are routing metadata and should be concise, scoped, and tested. Confidence is medium on cross-runtime portability because explicit-only controls are product-specific.

## Gaps

- I did not run live trigger evals; this was guidance research only.
- I did not inspect every installed skill's actual description style in this repo.
- I did not find an OpenAI page that explicitly says whether explicit-only `SKILL.md` descriptions are excluded from all selector/router surfaces; the docs only state Codex will not implicitly invoke them from the prompt when `allow_implicit_invocation` is false.

## Durability Recommendation

Durable skill-authoring guidance should preserve the current local distinction:

- model-discoverable descriptions carry model-routing load and should use the full trigger-boundary pattern;
- explicit-only descriptions carry human/router-selection load and should stay concise, human-facing, and optionally bounded;
- explicit-only policy belongs in runtime metadata (`agents/openai.yaml` for Codex), not by weakening or obscuring the `SKILL.md` description.

If this becomes repo policy, add a short explicit-only subsection near `Invocation And Granularity` in `plugins/meta-skill/skills/skill-writer/references/design.md` rather than duplicating it across cookbook snippets.
