# Identity maintenance

Maintainer guidance for changing the HTML renderer's shared identity.

- Edit tokens in `DESIGN.md` front-matter, then run
  `node scripts/generate-theme.mjs`; use `--check` to verify freshness.
- Never hand-edit `assets/theme.css`.
- A new theme is a sibling `DESIGN.md` variant that emits the same token names
  to its own theme file.
- Component CSS consumes emitted tokens. Add a token to `DESIGN.md`, regenerate,
  and only then use it in the catalog.
- `x-dark`, `x-alpha-steps`, and `x-motion` are generator-owned extensions. If
  the upstream design schema gains equivalent axes, migrate and remove the
  extension prefix.
