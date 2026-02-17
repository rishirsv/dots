---
name: security
description: Security baseline template for docs/SECURITY.md.
---

# SECURITY.md

## Purpose
Lean security and misuse-resistance baseline.

## Baseline Controls
- Least privilege for capabilities and tools.
- Validate and sanitize inputs before persistence and critical decisions.
- Avoid leaking sensitive data in logs, errors, and docs.
- Keep dependencies and runtime surfaces up to date.

## Agent/Tooling Safety
- Treat tool access as scoped capability, not default trust.
- Use explicit checks before high-impact actions.
- Preserve traceability for critical decisions.

## Security Review Checklist
- Threat-model touched surfaces.
- Verify input/output boundaries.
- Verify sensitive data handling in logs/errors.
- Track security issues in `ISSUES.md`.
