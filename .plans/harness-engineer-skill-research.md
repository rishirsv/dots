# Harness Engineer Skill Research

Planning-only research for a future Agent plugin skill or skill stack. No skill
payload files have been implemented.

## Sources

- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) (2026-02-11).
- Anthropic, [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
- Cursor, [Expanding our long-running agents research preview](https://cursor.com/blog/long-running-agents) (2026-02-12).
- Martin Fowler, [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) (2026-04-02).
- Google Developers Blog, [Conductor: Introducing context-driven development for Gemini CLI](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/) (2025-12-17).
- [AGENTS.md standard](https://agents.md/) and OpenAI Codex [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md).
- Every, [Compound Engineering](https://every.to/guides/compound-engineering), EveryInc [compound-engineering-plugin](https://github.com/everyinc/compound-engineering-plugin), and Will Larson, [Learning from Every's Compound Engineering](https://lethain.com/everyinc-compound-engineering/).
- Local repo references: `AGENTS.md`, `README.md`, `meta-skill/skills/meta-skill/SKILL.md`, `meta-skill/skills/skill-writer/SKILL.md`, and `meta-skill/skills/skill-writer/references/{skill-shape.md,design.md,source-distillation.md}`.

## Extracted Principles

Harness engineering is a control-system problem, not just prompt polishing.
OpenAI frames the human job as designing environments, scaffolding, and feedback
loops that make agent work reliable. The practical primitives are repo-legible
knowledge, standard tools agents can run directly, worktree-local application
instances, browser and observability access, review loops, and continuously
encoded rules that prevent drift.

AGENTS.md should be a map, not the whole manual. OpenAI's article argues that a
large instruction blob becomes stale and hard to verify, while a short entry
point plus structured repo docs supports progressive disclosure. The AGENTS.md
standard and Codex docs reinforce this as the predictable cross-agent instruction
surface, with layered discovery and local overrides.

Anthropic's long-running agent harness points to concrete scaffolding files:
feature lists, progress notes, git history review, an init script, and basic
end-to-end checks before new work starts. The recurring failure modes are
premature victory, undocumented progress, unknown app startup, and shallow
testing. The harness response is to make state and verification explicit.

Cursor's long-running agents add the approval and follow-through lesson:
autonomous work should propose a plan and wait before execution; larger tasks
need plan tracking plus independent checking agents so the big picture does not
evaporate mid-run. The scale of generated code creates a downstream need for new
safety and deployment controls.

Fowler gives the clearest taxonomy: harnesses combine feedforward guides and
feedback sensors, each computational or inferential. `AGENTS.md`, skills, setup
scripts, structural tests, review agents, linters, browser checks, and CI are
all harness controls. The steering loop is to improve the controls whenever a
failure repeats.

Google Conductor is relevant because it moves task context out of ephemeral chat
and into persistent Markdown artifacts: project context, specs, plans, status,
and checkpoints. The useful lesson is not to copy Conductor's exact command set;
it is to make long-running work resumable, reviewable, and file-backed.

Compound engineering is the same feedback-loop idea in productized form. The
canonical source is Every/Kieran Klaassen; the exact phrase Rishi used about
mistakes being codified for future agents is clearer in community summaries than
as a canonical quote. The concept is still unambiguous: after work and review,
extract reusable lessons into durable surfaces so later agents do not relearn
the same constraints.

## Skill-Shape Implications

This is skill-shaped because future agents repeatedly need to bootstrap harness
state before implementation, and the best behavior is not obvious from a normal
coding request. A skill can change runtime behavior by forcing the agent to map
commands, checks, repo constraints, progress state, acceptance criteria, and
browser/dev-server validation before touching feature code.

The runtime skill should not be a research essay. Source citations and long
discussion belong in planning docs or private authoring notes. Runtime guidance
should contain the operating model, routing rules, templates, scripts, and
validation gates.

The strongest primary skill is `harness-engineer`, with an early mode called
`harness-init`. The name `harness-engineer` is broad enough to include both
initial scaffolding and later harness improvement, while `harness-init` is a
good concrete worker/mode for bootstrapping a repo or task track.

Avoid a large router plus many workers at first. The Agent plugin is currently
small (`commit`, `publish-pr`, `yeet`), and Meta-Skill already owns skill
lifecycle routing. Start with one operational skill that has explicit modes:

- `init`: create or refresh a command map, verification map, progress ledger,
  setup/init script recommendation, and task acceptance criteria.
- `audit`: inspect an existing harness for stale docs, missing verification,
  weak progress state, or controls that should become scripts/tests/hooks.
- `codify`: route a repeated failure or review lesson to the right durable
  surface: `AGENTS.md`, README/docs, skill guidance, script/test/hook, memory,
  or no action.

Split into separate skills only after use shows that these modes trigger
independently often enough to justify routing separation. A premature stack of
`harness-init`, `harness-audit`, and `mistake-codifier` would add activation
complexity before the boundaries are proven.

## Recommended Boundary

Recommend one Agent plugin skill now: `harness-engineer`.

Job: help an agent build, audit, or improve the repo/task harness that makes
long-running coding work reliable before or alongside implementation.

Not for: ordinary implementation, local-only git commits, PR publication, skill
authoring, broad docs polishing, or one-off command lookup.

Default output should be a concise harness plan or harness diff proposal, not
immediate source edits unless the user explicitly asks. For this repo, plan
artifacts go under `.plans/`; future runtime guidance should respect the same
planning-only gate when invoked for research or setup.

## `agents-md-maintainer`

Recommendation: make `agents-md-maintainer` a separate small skill, adjacent to
the harness stack, once Rishi wants implementation.

It should not be buried inside `harness-engineer`, because maintaining
instruction surfaces has its own risk profile: over-codifying one-off mistakes,
creating stale or conflicting rules, bloating the entry point, and forgetting
repo-specific sync hooks. It should not be treated as ordinary docs work either,
because the strategic question is not prose quality; it is where an agent-facing
control belongs.

The skill should own routing and maintenance of agent instruction surfaces:

- Decide whether a lesson belongs in `AGENTS.md`, nested `AGENTS.md`,
  `global_instructions.md`, README/docs, a skill, a script/test/hook, memory, or
  nowhere.
- Keep `AGENTS.md` short and map-like when a deeper source of truth exists.
- Prefer mechanical enforcement for rules that can be checked.
- Detect conflicts, stale commands, and overbroad instructions.
- In this repo, run `scripts/sync-local-agents.sh` after changing
  `global_instructions.md`, `.codex/agents/`, or hooks.

`harness-engineer` should call out to this capability in codify mode, but should
not own all AGENTS.md editing itself.

## Proposed Runtime Shape

Trigger examples:

- "Before you implement this, set up the harness so future agents can resume."
- "Audit this repo for missing agent scaffolding, verification commands, and
  progress state."
- "We keep making this mistake; codify the lesson somewhere durable."
- "Create a task harness with commands, acceptance criteria, and browser checks."

Should not trigger:

- "Run the tests."
- "Commit this."
- "Open a PR."
- "Write a new skill."
- "Clean up this README."

Inputs:

- User goal or failure pattern.
- Current repo instructions and README.
- Existing command/test/build/dev-server scripts.
- Relevant docs, task plan, progress ledger, git history, CI config, browser
  tooling, and local validation affordances.

Outputs:

- Harness plan or audit with:
  - command map
  - verification map
  - setup/init script recommendation
  - progress/state ledger recommendation
  - acceptance criteria
  - browser/dev-server and observability checks when applicable
  - repo instruction/doc updates to propose
  - mechanical controls to add when prose is too weak
  - open human decisions

Runtime references/assets:

- `references/control-taxonomy.md`: Fowler-style feedforward/feedback and
  computational/inferential routing, rewritten as operational rules.
- `references/long-running-state.md`: feature list, progress ledger, git log,
  init script, and resume patterns.
- `references/codify-lessons.md`: decision tree for AGENTS.md vs docs vs skills
  vs tests/hooks/scripts vs memory.
- `assets/harness-plan-template.md`: compact artifact template.
- `assets/progress-ledger-template.md`: resumable state template.

Scripts, if implemented later:

- `scripts/discover-commands.sh`: summarize package scripts, Make targets, task
  runners, CI workflows, and likely dev-server commands.
- `scripts/check-harness-links.sh`: verify referenced docs/scripts exist.
- `scripts/harness-audit.sh`: non-destructive static audit for common missing
  surfaces (`AGENTS.md`, README command docs, CI, package scripts, test dirs,
  known browser tooling).

Validation harness:

- Fixture repos or snapshots:
  - no AGENTS.md, unclear commands
  - existing short AGENTS.md plus README scripts
  - frontend app needing browser/dev-server checks
  - stale command in docs
  - repeated failure that should become test/hook rather than prose
- Expected output checks:
  - identifies real commands without inventing commands
  - distinguishes setup, test, build, lint, browser, and CI checks
  - keeps source edits gated when user requested planning only
  - routes codification to the correct durable surface
  - asks only for decisions that change runtime behavior

Skill-vs-subagent rationale:

- A skill is the right default because this is a recurring behavior pattern that
  should activate inside normal coding threads before implementation starts.
- Subagents are useful as optional workers during audit or research, but the
  routing, artifact contract, and safety gates belong in a skill.
- `harness-engineer` should be able to spawn or request specialized review,
  browser, docs, or command-discovery workers only when the environment provides
  them and the work can run in parallel.

## Preference Questions Before Implementation

1. Should the first implemented artifact be one `harness-engineer` skill with
   `init`, `audit`, and `codify` modes, or should `harness-init` be the first
   narrow skill and `harness-engineer` remain a later router?
2. Should `agents-md-maintainer` be implemented in the same batch as the harness
   skill, or kept as a follow-up after the harness skill proves its codify mode?
3. Should runtime scripts be included in the first version, or should v1 be
   template/reference-only with scripts added after observing real runs?
4. Should harness artifacts default to `.plans/` in this repo only, while the
   portable skill recommends repo-local plan/progress locations based on local
   conventions?
