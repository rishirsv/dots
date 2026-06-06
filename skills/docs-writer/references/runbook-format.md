# Runbook Format

A runbook is a documented process for achieving a specific operational outcome. It should let an adequately skilled operator complete a known procedure with less risk.

## Use A Runbook When

- the procedure is repeated or likely to recur
- the task has operational risk, ordering constraints, or required permissions
- the correct action depends on triggers, thresholds, or environment
- rollback, validation, or escalation matters

## Minimum Shape

1. **Purpose:** specific outcome, not broad background.
2. **Trigger:** when to use it.
3. **Impact:** user/system risk and blast radius.
4. **Prerequisites:** permissions, tools, environment, maintenance window, inputs.
5. **Safety checks:** conditions that must be true before starting.
6. **Procedure:** ordered steps with commands and expected signals.
7. **Rollback:** steps to restore prior safe state.
8. **Validation:** how to know the outcome is achieved.
9. **Escalation:** who/where/when to escalate.

## Writing Rules

- Use numbered steps for required order.
- Pair each command with an expected signal.
- Put destructive steps behind explicit preconditions.
- Include rollback before or near destructive actions.
- Avoid incident narrative unless it changes the procedure.
- Mark unverified commands clearly.

## Avoid

- platform-specific cloud assumptions without repo evidence
- generic incident-response theory
- vague steps such as `check the logs` without path, command, query, or success signal
- screenshots as the only source of instructions
- undocumented manual steps that cannot be repeated
