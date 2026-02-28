---
owner: "<team-or-role-or-unassigned>"
security-owner: "<team-or-role-or-unassigned>"
status: active
last-reviewed: YYYY-MM-DD
review-cycle-days: 90
source-of-truth: "docs/SECURITY.md"
verification-state: unverified
---

# SECURITY.md

## Purpose
Defines security boundaries, controls, and response expectations.

## Threat Model Summary
- Assets: <sensitive assets>
- Trust boundaries: <boundaries>
- Top threats: <list>
- Mitigations: <list>

## Data Classification
- Classification scheme: <link-or-summary>
- Sensitive data handling rules: <rules>

## Baseline Controls
- least privilege
- input/output validation
- secret handling and redaction
- dependency update policy

## Supply Chain Checks (Optional)
- lockfile policy
- provenance or signature checks
- review gates for dependency updates

## Detection And Response
- Detection methods: <scanner/CI/checklist>
- Response path: <incident + rotation + escalation>
