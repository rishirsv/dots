# Session Capture

Use when a Codex interview, design session, debugging session, or implementation session contains knowledge that should survive beyond the conversation.

The useful input is the observed trajectory, not only the initial prompt: user intent, agent routing, commands, file reads, mistakes, corrections, validation, final output shape, and durable preferences.

## Capture

Extract only durable material:

- reader/audience and job to be done
- decisions made and rationale that changes future work
- accepted commands and deterministic success signals
- files, modules, APIs, configs, generated specs, and ownership boundaries
- stable constraints, invariants, and forbidden couplings
- public API behavior, side effects, errors, and compatibility notes
- operational procedures, rollback, and escalation paths
- user corrections that prevent repeat mistakes
- validation results and commands run
- unresolved uncertainty that affects future work

## Omit

Do not preserve by default:

- greetings, apologies, and transcript chatter
- agent self-commentary and internal planning narration
- abandoned exploration unless it becomes a failure shield
- temporary logs and one-off debugging output
- failed commands after the final fix is known, unless they reveal a durable failure mode
- stale proposals, speculative options, or planning docs that do not belong in durable repo documentation

## Route To Durable Owner

| Session evidence | Durable owner |
|---|---|
| Setup, onboarding, common commands, repo map | `README.md` |
| Every-session agent/contributor rule, edit boundary, validation loop | `AGENTS.md` |
| Boundary, dependency rule, invariant, core flow, architecture decision | `ARCHITECTURE.md` |
| Design tokens, visual identity, component rules, accessibility constraints | `DESIGN.md` |
| Product problem, desired outcome, user job, scope, acceptance criteria | PRD |
| Long-standing feature behavior, domain ownership, runtime flow, or canonical source of truth | canonical feature/domain doc |
| Complex implementation handoff that must be self-contained and living | ExecPlan |
| Normative system contract, lifecycle, state machine, interface requirements | project spec |
| Repeatable operator procedure | runbook |
| Interface contract, payload, auth, errors, side effects | API docs |
| Breaking change, deprecation, adoption sequence | migration notes |
| Package-local purpose, exported API, invariants, examples | module-level docs |

## Evidence Conversion

| Session evidence | Documentation posture |
|---|---|
| Verified by command/source | Declarative statement with command/path when useful. |
| User correction accepted as durable | Rule, warning, or convention in the owner doc. |
| Design rationale accepted | Short rationale near the constraint or token. |
| One-off preference | Omit unless user asks to persist it. |
| Inferred behavior | Label as inferred or omit. |
| Conflicting evidence | Capture in `Known Gaps` or final handoff, not as fact. |

## Session Capture Workflow

1. Identify the durable reader and owner doc.
2. List durable facts, decisions, commands, and corrections from the session.
3. Classify each item into a document type or `omit`.
4. Verify against repo source where possible.
5. Write the smallest owner-doc update that preserves the decision or procedure.
6. Add validation and uncertainty.
7. Report what was captured, what was omitted, and what remains unverified.

## Provenance

- Do not paste long transcript excerpts into durable docs by default.
- Use light provenance only when useful: `Verified by <command>`, `Decision recorded from Codex session on <date>`, or `Source: <path>`.
- In the final handoff, name the session inputs used and any material omissions.
