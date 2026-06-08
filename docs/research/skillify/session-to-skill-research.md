# Skillify Research: Session-To-Skill Patterns

Date: 2026-06-02

## Working Concept

Skillify is a proposed Skill Create reference or adjacent workflow that reads one or more Codex/agent sessions, identifies repeated workflow patterns, and turns them into a reusable Agent Skill. The useful input is not just a prompt; it is the observed trajectory: user intent, agent routing, commands, file reads, mistakes, corrections, validation, final output shape, and durable preferences.

## Early Source Findings

### Cursor: Conversation-Derived Rules And Memories

Cursor has the closest public analogue found so far. Cursor documents memories as automatically generated rules based on chat conversations, scoped to a project, with approval before background-generated memories are saved. Cursor also documents `/Generate Cursor Rules`, which generates reusable project rules directly from a conversation where decisions were made about agent behavior.

Implication for Skillify:

- The strongest borrowed pattern is "mine a real conversation, propose reusable guidance, require human approval before saving."
- Cursor turns sessions into rules; Skillify should turn sessions into skills only when the extracted behavior is a repeatable workflow, not a simple preference.
- Skillify should distinguish "memory/rule-worthy" facts from "skill-worthy" procedures.

Sources:

- https://docs.cursor.com/en/context/memories
- https://docs.cursor.com/context/rules

### Microsoft / VS Code: Prompt Files, Agents, And Skills

VS Code Copilot distinguishes prompt files, custom agents, and agent skills. Prompt files are lightweight slash-command style prompts for common tasks; custom agents are persistent personas with tools/restrictions/handoffs; agent skills are portable multi-file capabilities with scripts and resources.

Additional research found no official Microsoft/GitHub "Skillify" flow by that name. Adjacent patterns include VS Code creating custom instructions from workspace patterns (`/init` or `/create-instructions`) and GitHub Copilot CLI Chronicle-style improvement from local session history into `.github/copilot-instructions.md`. Those are instruction-generation workflows, not skill-generation workflows.

Implication for Skillify:

- Session-derived output should be routed by artifact weight:
  - repeated lightweight task -> prompt file or prompt pattern
  - persistent persona/tool policy -> agent/orchestrator instructions
  - portable multi-file capability -> skill
- Skillify should not over-produce skills from every useful session insight.

Sources:

- https://code.visualstudio.com/docs/copilot/customization/prompt-files
- https://code.visualstudio.com/docs/copilot/customization/agent-skills
- https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/copilot-cli/chronicle

### Anthropic: Skill Creator

Anthropic has an official `skill-creator` skill for creating Agent Skills, and public docs/repos emphasize skill folders with `SKILL.md` frontmatter plus optional scripts/resources. Initial search did not find an official Anthropic "session-to-skill" or "Skillify" workflow by name.

Additional research suggests Anthropic's official workflow is eval-driven rather than session-mining driven: interview, draft `SKILL.md`, create/evaluate prompts, compare baseline vs with-skill performance, grade, analyze, compare, and optimize descriptions. It does not appear to mine arbitrary prior agent sessions as its primary input.

Implication for Skillify:

- Skillify can use Anthropic-style skill creation as the destination format, but the differentiated behavior is session mining and pattern extraction before ordinary skill authoring.
- Skillify should preserve Skill Create's current boundary discipline: create a skill only when recurring workflow guidance changes future agent behavior.

Sources:

- https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md
- https://github.com/anthropics/skills

### Research Literature: Self-Evolving Skills

MUSE-Autoskill proposes a skill lifecycle with creation, memory, management, evaluation, and refinement. It emphasizes creating skills on demand, storing/reusing them across tasks, and evaluating with unit tests and runtime feedback.

Trace2Skill is the closest formal precedent found for session/trace-to-skill creation. It analyzes execution traces, extracts local lessons, and consolidates them into reusable transferable skill directories. SkillOpt adds a useful improvement constraint: bounded text edits should be accepted only when validation improves, which fits evidence-first skill improvement work.

Implication for Skillify:

- Skillify should not stop at synthesis. It should produce or recommend eval scenarios from the source sessions.
- Session-derived skills should carry provenance: which sessions, which observed failures, which validations, and which recurring patterns motivated the skill.

Source:

- https://arxiv.org/abs/2605.27366
- https://github.com/Qwen-Applications/Trace2Skill
- https://arxiv.org/abs/2603.25158
- https://arxiv.org/abs/2605.23904

### Existing "Skillify" Uses

The name "Skillify" appears in broader web projects, but not in the session-to-skill sense. Examples found include URL-to-`Skill.md` conversion and package/codebase-to-skill generation.

Implication for Skillify:

- If this repo uses the name, define it explicitly as session-to-skill distillation.
- Avoid ambiguity with URL-to-skill or package-documentation skill generators.

Sources:

- https://www.getskillify.dev/
- https://agentmagic.com/skills/skillify

### Garry Tan: Thin Harness, Fat Skills

Garry Tan's "Thin Harness, Fat Skills" essay is directly relevant prior art even if it is not a vendor product named Skillify. The core architecture says the harness should stay thin while reusable markdown skills encode judgment, process, and domain knowledge. The essay explicitly separates latent judgment from deterministic tooling, and treats skill files like method calls: the skill supplies HOW, while invocation parameters supply the task specifics.

Most relevant to Skillify, the essay describes a self-learning loop: after an event, an `/improve` skill reads surveys, diarizes mediocre responses, extracts patterns, and proposes/writes new rules back into the matching skills. It also states a recurring-work rule for OpenClaw-style agents: if a task will happen again, do it manually first on 3 to 10 items, show the output, then codify it into a skill file if approved; if it should run automatically, put it on a cron.

Implication for Skillify:

- This is the strongest conceptual support for "session-to-skill distillation" found so far.
- Skillify should include a manual-first evidence gate: observe or perform the workflow on a small set, get approval, then codify.
- The output should distinguish latent skill guidance from deterministic scripts/tools.
- The improvement loop should write or propose changes to the matching skill only from concrete feedback/evidence.
- "If I have to ask twice, the system failed" is a useful product principle for when to consider Skillify.

Sources:

- https://github.com/garrytan/gbrain/blob/master/docs/ethos/THIN_HARNESS_FAT_SKILLS.md
- https://fatskills.homes/

### Garry Tan Skill Ecosystem

Public skill directories list Garry Tan-associated/gstack skills such as review, ship, investigate, QA, design review, canary, guard, and Codex wrapper skills. These are useful as examples of a "fat skills" ecosystem: small named workflows with clear activation boundaries and operational roles.

Implication for Skillify:

- Skillify should not only generate isolated skills; it should notice when a workflow wants a named skill family or resolver/orchestration layer.
- The useful pattern is a skill portfolio where each skill owns a recurring operational lane, not one giant manual.

Source:

- https://officialskills.sh/garrytan/skills

## Proposed Skillify Shape

Skillify should read one or more sessions and extract:

- Trigger candidates: user phrases and task objects that should activate the skill.
- Non-trigger boundaries: nearby tasks that appeared but should not route to the skill.
- Workflow spine: repeated phases, commands, tools, and decision points.
- Failure shields: mistakes, user corrections, validation gaps, or repeated confusion.
- Output contract: final answer/report/artifact shape that worked.
- Resource candidates: scripts, templates, examples, or references worth preserving.
- Eval candidates: scenario prompts from actual session turns, including success criteria.
- Classification: whether each extracted lesson belongs as a skill, prompt, rule/memory, repo doc, or no durable artifact.
- Provenance: which sessions, turns, commands, corrections, and validations support each extracted rule.

Suggested default output:

```text
Skillify Brief
- Candidate skill name
- Trigger contract
- Nearest non-trigger boundary
- Workflow pattern
- Evidence from sessions
- Proposed SKILL.md sections
- References/scripts/assets to create
- Eval scenarios to seed
- Questions before creation
```

## Open Questions

- Whether Skillify should live as a `skill-create` reference file or as its own skill/lane.
- How Codex session paths should be supplied: explicit JSONL paths, thread IDs, selected memory rollout summaries, or current conversation only.
- Whether Skillify should parse raw Codex session JSONL directly, or rely on a summarized transcript artifact first.
- How much evidence is required before converting a session pattern into runtime instructions.
- Whether Skillify should produce eval scenarios by default from the same sessions that motivated the skill.
