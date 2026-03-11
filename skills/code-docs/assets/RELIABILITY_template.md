# RELIABILITY.md

## Metadata
- Owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 90
- Source of truth: `docs/RELIABILITY.md`
- Verification state: unverified
- Critical paths: []

## Purpose
Defines reliability targets, failure handling, and verification loops.

## Service Tiering
| Surface | Tier | Target Reliability |
|---|---|---|
| `<surface>` | <tier> | <target> |

## SLI/SLO Summary
| SLI | Definition | SLO |
|---|---|---|
| `<sli>` | <definition> | <target> |

## Top Failure Modes (5)
- <failure mode>
- <failure mode>

## Monitoring And Alerts (5)
- <monitor/alert>
- <monitor/alert>

## Validation Split
- CI checks: <what is validated pre-merge>
- Production observation: <what is monitored post-deploy>

## Incident Update Trigger
After impactful incidents, update this doc with:
- new failure mode
- missing monitor or policy gap
- concrete preventive action
