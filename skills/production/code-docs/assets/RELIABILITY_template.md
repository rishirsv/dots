---
owner: "<team-or-role-or-unassigned>"
status: active
last-reviewed: YYYY-MM-DD
review-cycle-days: 90
source-of-truth: "docs/RELIABILITY.md"
verification-state: unverified
critical-paths: []
---

# RELIABILITY.md

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
