# Subagent Lanes

Shared guidance for skills that delegate work to subagents. Multi-agent
execution is a first-class mode in this plugin: use it whenever independent
lanes would finish faster or check each other better than one thread, and skip
it when one direct pass answers the question.

## Lanes

Match the lane to the job; use the closest role the harness provides.

- **Researcher**: bounded codebase, docs, web, or option research. One
  reportable slice per agent.
- **Explorer**: narrow codebase discovery — find files, trace symbols, map a
  subsystem. Cheaper than a researcher; returns locations, not judgments.
- **Adversarial reviewer**: pressure-test a plan, claim, finding, or diff.
  Prompt it to refute, not to agree.
- **Worker**: scoped implementation with a disjoint write scope. Never give two
  workers overlapping files.
- **Skill work**: for diagnosis or edits to an existing skill, spawn a
  general worker dynamically with instructions to load the Meta-Skill
  skill-doctor workflow; there is no standing skill-doctor agent.

## Fan-Out Rules

- Fan out only when lanes are genuinely independent: distinct questions,
  distinct source boundaries, or distinct lenses on the same evidence.
- Launch independent lanes in one batch so they run concurrently.
- Give every lane: the specific question or task, the source or write
  boundary, the evidence bar, the output shape, and a stop condition.
- An agent that finds the prompt too broad should return "scope too broad"
  with a proposed split instead of wandering.

## Verification Lanes

For findings that will drive edits or decisions, add an independent check
before acting: a fresh adversarial reviewer per finding (or per finding
cluster) with instructions to refute. Do not let the finder verify its own
finding.

## Collection

- The parent owns synthesis. Collect lane reports at meaningful barriers, not
  one-by-one narration.
- Treat lane output as evidence, not as the deliverable; restate what matters
  in the parent's own report.
- When a lane's report must survive the session, save it to the repository's
  scratch convention (`.agents/outputs/` here) before synthesizing.
