# Build provenance — html skill

Created 2026-07-06 from the scout session captured in
`.agents/outputs/html-skill-scout-brief.md` (decisions, rejected branches,
evidence) with the visual identity seeded from
`.agents/outputs/html-skill-identity-seed.html` (prototype E of a 5-round
prototype exploration; A-D rejected — see brief).

Key sources distilled into runtime:

- Thariq/Anthropic html-effectiveness gallery (20 exemplars) — "one identity,
  many forms" thesis; prompt-box, sources-footer, best-for patterns.
- google-labs-code/design.md alpha spec — DESIGN.md front-matter schema;
  `x-*` keys are our extensions (dark, alpha ladder, motion).
- shadcn/ui registry architecture — two-tier index + self-describing items,
  open-code copy-paste consumption, semantic token naming.
- wip/dataviz — chart methodology distilled into references/charts.md.
- wip/html-artifact — predecessor; its recipes and theme.css were explicitly
  NOT carried over (user: "heavy — the recipes are not working").

Replaces `wip/html-artifact` and `wip/dataviz`; those stay in place until
Rishi retires them.

Riskiest assumption (untested at build time): a weaker non-Claude agent
composing from the catalog hits the fidelity bar. Dogfood before trusting:
give Codex or similar only SKILL.md + theme.css + registry + atlas and ask
for a status report.

Maintenance invariants:

- DESIGN.md front-matter is canonical; theme.css is generated
  (`node scripts/generate-theme.mjs`, `--check` in CI/verify).
- Component CSS consumes tokens only; new tokens go through DESIGN.md.
- Anti-slop rules (no accent stripes, ≤1 chip, no eyebrows, single
  background) are user taste decisions, not defaults to relax.
