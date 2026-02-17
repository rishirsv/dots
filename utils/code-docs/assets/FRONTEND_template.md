---
name: frontend
description: Frontend contracts template for docs/FRONTEND.md.
---

# FRONTEND.md

## Purpose
Frontend implementation contracts for React Native + Expo Router.

## Core Stack Contracts
- Expo Router typed routes are enabled.
- Root stack owns top-level pushed flows.
- Use a single owner surface per interaction set.

## Navigation Contracts
- Canonical workout open path: `/workout`.
- Canonical workout history detail path: `/progress/history/[id]`.
- Use centralized safe-navigation helpers for cross-stack opens.
- Do not globally intercept native back behavior.

## Styling Contracts
- Use `className` for static styling.
- Use `style` for dynamic/measured/animated values.

## Insets and Bottom Chrome
- Keep one source of truth for bottom insets.
- Avoid duplicate inset ownership across tabs/accessories.

## Interactive Verification
For new or changed controls, verify:
- primary action,
- long-press/context behavior,
- secondary actions,
- safe-area edge geometry,
- keyboard overlap/cutoff.

## Related Docs
- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/DESIGN.md`
