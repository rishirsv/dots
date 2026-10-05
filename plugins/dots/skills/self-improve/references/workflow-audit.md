# Workflow and Harness Audit

Read this when the user asks about workflow friction, slow testing, a better
route through the work, agent-experienced friction, or harness engineering.
Inspect only the aspects selected by the prompt.

## Compare the cost of the actual path

Evaluate the full cost of reaching the result: steps taken, rework caused, and
human attention consumed. Compare the observed route with what a capable agent
using the same available tools reasonably needed. Do not punish exploration
that was necessary to resolve real uncertainty.

Inspect the relevant aspects:

- **Rework:** edits, reads, builds, or explanations repeated because an earlier
  decision was wrong or an available check arrived too late.
- **Information gathering:** broad or repeated searches when a smaller lookup
  could have settled the question.
- **Routine overhead:** manual or roundabout work that an existing command,
  skill, script, or agent tool should perform.
- **Sequencing and batching:** independent work serialized, dependent work
  started too early, or validation delayed until repeated work increased.
- **Flailing:** an unchanged failing approach retried instead of inspecting the
  source, error, documentation, or live state that could identify the next
  action.
- **Verification timing:** checks run too broadly, too often, too late, or
  without a relationship to the behavior they claim to prove.

Name the largest source of unnecessary work. Give a rough count and identify the
likely cause that can be fixed. A failed attempt is not waste merely because
hindsight exists; explain what information made the better route available at
the time.

## Testing and validation cost

Use paired tool timing from `stats` when the host records call identifiers and
timestamps. Inspect the underlying transcript before assigning cause.

Account for:

- total and longest observed validation calls;
- repeated equivalent commands and what changed between them;
- failure-to-edit-to-retest cycles;
- broad suites run where a focused check could have answered the immediate
  question;
- focused checks repeated after no relevant change;
- checks delayed until after a completion claim; and
- independent checks that the transcript establishes could have run together.

Do not infer CPU cost from session span, blame the test suite for idle time, or
claim exact duration when calls cannot be paired. Report missing timestamps,
ambiguous outputs, background commands, and other timing gaps as coverage
limits.

## Actual path versus better path

Reconstruct the shortest defensible route, not an imaginary route that assumes
the answer in advance:

1. Preserve the necessary discoveries and decisions.
2. Remove retries, premature edits, duplicated context gathering, and checks
   whose result did not change the next decision.
3. Reorder steps when earlier evidence would have prevented repeated work later.
4. Name what the better route would save and what uncertainty it would retain.

Also ask what did not happen but should have, what second-order effect was
missed, and whether the local success depended on a lucky test path.

## Agent-experienced friction

When information gathering caused friction, distinguish navigation from
information access:

- **Navigation:** how easy was it for the agent to find the right files? Are
  there hidden dependencies between files? Would a navigation pointer make it
  easier? Use when the session took a long time to find a piece of information.
- **Information access:** look for opportunities to increase the agent's access
  to information. Teeing dev server logs, readonly access to third-party
  services. Use when a crucial piece of information was not available to the
  agent.

Add a focused pointer when the information exists but is hard to find. Propose
logs, diagnostics, or read access when the environment does not expose it.
Apply the parent skill's edit authorization before changing access or tooling.

Separate two claim types:

- **Direct:** the agent explicitly identified a limitation, conflict, failed
  tool, missing capability, or frustrating condition in the conversation.
- **Inferred:** the trace shows repeated retries, permission blocks,
  contradictory instructions, unavailable context, or recovery work that
  plausibly created friction.

Do not invent an emotional state. For inferred friction, name the observable
behavior and the alternative explanations that remain.

## Harness engineering

Keep one root cause per finding. Classify it as Tooling, Permissions,
Environment, Documentation, Reliability, UX, Model behavior, or Workflow.
Write about systems and observable behavior rather than people.

Use this shape:

```md
### <category>: <root cause>
- Observation: <what happened>
- Impact: <time, rework, uncertainty, or degraded outcome>
- Evidence: <traceable events; omit when no support exists>
- Suggestion: <smallest improvement that addresses the cause>
- Workaround: <omit when none was demonstrated>
```

Propose a shared instruction only when a missing, wrong, or underspecified rule
would have prevented the failure and a capable agent could still fail with the
current contract. Otherwise route the fix to code, tooling, documentation,
configuration, or a check. A positive result may contain friction without a
durable proposal.

## Finding contract

For every retained finding, account for the trigger, expected behavior, actual
behavior, cost, cause, better path, closest owner, evidence strength, and a
result that would show the diagnosis is wrong. Omit fields from the rendered
answer when they would only repeat another line, but do not omit them from the
analysis.
