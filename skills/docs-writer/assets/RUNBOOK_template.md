# Runbook: <Procedure Name>

## Purpose

<Specific operational outcome this runbook achieves.>

## Trigger

Use this runbook when:

- <condition, alert, request, or threshold>

Do not use it when:

- <nearby case that needs a different process>

## Impact

- User/system impact: <impact>
- Blast radius: <scope>
- Risk level: <low/medium/high>

## Prerequisites

- Permissions: <roles/access>
- Tools: <CLI, dashboard, scripts>
- Environment: <prod/stage/local>
- Required inputs: <IDs, dates, versions>

## Safety Checks

- [ ] <condition that must be true before starting>
- [ ] <backup, maintenance window, or approval if required>

## Procedure

1. <Step>

   ```sh
   <command>
   ```

   Expected signal: <output/log/status>

2. <Step>

   Expected signal: <output/log/status>

## Rollback

Use rollback when <condition>.

1. <Rollback step>
2. Verify rollback:

   ```sh
   <command>
   ```

   Expected signal: <result>

## Validation

| Check | Command/source | Expected signal |
|---|---|---|
| <check> | `<command>` | <result> |

## Escalation

Escalate when:

- <condition or time threshold>

Escalate to:

- <team/person/channel>
