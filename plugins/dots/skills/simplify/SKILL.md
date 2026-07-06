---
name: simplify
description: "Alias that routes cleanup work to ultra-review: 'simplify this diff' runs standard rigor with a reuse/simplification/efficiency focus in fix mode; 'simplify this plan' uses ultra-review's plan target with hard-cut default. On platforms with a built-in simplify command, use that for quick diff cleanup instead."
---

# Simplify

Kept for muscle memory; all review logic lives in
[../ultra-review/SKILL.md](../ultra-review/SKILL.md).

- "Simplify this diff" -> ultra-review, `standard` rigor, fix mode, focused on
  reuse, simplification, and efficiency findings.
- "Simplify this plan" -> ultra-review's plan/spec/roadmap target (its
  Phase 1), defaulting to hard-cut simplification.

If the current platform has a built-in `/simplify` command, prefer it for
quick diff cleanup. Use this skill for plan cleanup, or when ultra-review's
fuller rigor and fix workflow is what the user wants.
