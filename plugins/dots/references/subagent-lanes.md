# Subagent Lanes

Shared guidance for skills that delegate work to subagents. Use subagents when
independent reads, checks, or write scopes would materially improve the work;
keep the task in the parent thread when one direct pass is enough.

## Lanes

Use the closest role the harness provides, or describe the job plainly:

- **Research**: gather bounded evidence from code, docs, web, or options.
- **Explore**: map files, symbols, flows, or ownership without making a final
  judgment.
- **Review**: challenge a plan, finding, diff, or recommendation.
- **Work**: implement a scoped change in a disjoint write area.

## Guidance

- Give each lane a specific question, source or write boundary, evidence bar,
  output shape, and stop condition.
- Launch independent lanes together when concurrency helps.
- Keep overlapping write scopes in the parent thread unless the worktree or
  harness gives real isolation.
- If a lane finds the task too broad, it should return a proposed split instead
  of wandering.

## Synthesis

The parent owns the final answer and treats subagent output as evidence, not as
the deliverable. Save lane reports only when they need to survive the session,
using the repository's scratch convention.
