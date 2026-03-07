# References Index

Use this as the router for `kpmg-slides` references.

| File | Read when you need |
|---|---|
| `slide-contract.md` | The source of truth for supported slide types, required/optional slots, runtime-managed fields, and continuation behavior while writing or fixing `deckSpec`. |
| `layout-policy.md` | A deterministic decision tree for mapping intent and evidence shape to the right slide type. |
| `writing-standards.md` | Consulting-grade title, strapline, and bullet-writing standards, including executive-summary behavior and anti-patterns. |
| `charting-playbook.md` | Rules for chart vs table vs narrative decisions, chart type selection, density limits, and chart data quality. |
| `quality_assurance.md` | Validate -> fix -> repeat workflow, stop rules, pagination/recompute checks, visual QA, and storyline QA before delivery. |
| `deckspec.schema.json` | JSON-schema style structure reference for tooling, including advisory metadata and runtime-managed slot annotations. |

Suggested read order for most tasks:
1. `slide-contract.md`
2. `deckspec.schema.json` (for exact shape checks)
3. `layout-policy.md`
4. `writing-standards.md` and `charting-playbook.md` (as needed)
5. `quality_assurance.md`
