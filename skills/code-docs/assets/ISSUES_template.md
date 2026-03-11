# ISSUES.md

## Metadata
- Owner: <team-or-role-or-unassigned>
- Status: active
- Last reviewed: YYYY-MM-DD
- Review cycle days: 14
- Source of truth: `docs/ISSUES.md`
- Verification state: unverified

## Purpose
Single issue registry with machine-checkable lifecycle metadata.

## Severity Scale
- `P0`: critical production blocker, data loss, or security-critical.
- `P1`: major user-facing breakage or release-gating regression.
- `P2`: meaningful defect with workaround.
- `P3`: minor defect or polish.

## Lifecycle States
| State | Meaning | Required Next Action |
|---|---|---|
| `open` | Newly accepted issue | assign owner + link next step |
| `triaged` | Validated and prioritized | link plan/spec/PR |
| `in-progress` | Active work ongoing | update status and evidence |
| `blocked` | Cannot proceed | list unblock condition |
| `resolved` | Fix merged or accepted risk | add verification evidence |
| `closed` | Fully complete | link final artifact |

## Triage Workflow
1. Intake
2. Validate evidence and reproduction
3. Assign owner and severity
4. Link execution path (plan/spec/PR)
5. Close with verification evidence or accepted risk

## Linking Policy
- Every `P0`/`P1` issue must link to an exec plan or PR within `<N>` days, or be marked `accepted risk` with rationale.

## Registry Rules
- Sort by severity, then recency.
- Each entry must have exactly one next action.
- Use `assets/issue-block_template.md` for all entries.

## Open Issues
<!-- Append issue blocks below this line -->
