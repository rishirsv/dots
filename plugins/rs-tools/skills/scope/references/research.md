# Research

Research is a support layer inside Scope, not a user-facing lane.

Use enough local project or web research to make framing honest. Do not turn Scope into a full sourced-brief workflow.

## Local Project Research

Use local project research by default for project, product, or implementation topics.

Start with:

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- TODOs
- product specs
- project specs
- exec plans
- context docs
- adjacent source files or examples

Keep research proportional. Go deeper for Ideate or Discuss when the topic is broad, architectural, or high-stakes.

## Web Research

Use web research when outside or current facts materially affect the answer:

- current platform guidance
- API or framework behavior
- market or competitor patterns
- examples outside the local project
- legal, medical, financial, compliance, or safety-sensitive claims
- user explicitly asks to search, verify, or look up something

Skip web research when the user only needs local thinking, when local project context is enough, or when the user says not to research.

Keep sourced findings separate from assumptions and inference.

## Research Skill Boundary

Scope should not become a full research-brief workflow.

Hand off to a separate Research skill only when the task itself is research:

- sourced briefs
- current best-practice reviews
- primary-source comparisons
- broad external evidence gathering
- recommendations that need citations and source-quality judgment

## Sub-Agents

Use sub-agents only when parallel context gathering or independent idea generation materially improves the result.

Useful cases:

- broad Ideate runs
- large local project scans
- high-stakes Discuss work
- local project context and web context can be gathered in parallel
- multiple independent source angles are needed

Avoid sub-agents for:

- quick local checks the main agent can do directly
- narrow local project checks
- facts the main agent can verify in one or two reads
- decisions that depend mainly on user intent rather than evidence

Research sub-agent output should be raw material:

- sources
- findings
- confidence
- contradictions
- risks

The main agent owns synthesis, ranking, and recommendation.
