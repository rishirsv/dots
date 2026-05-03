# AGENTS.md

## Scope

These instructions apply only within `skills/meta-prompt/`.

## Portable Root

- Portable skill source of truth: `skill/`
- Build upload-ready artifacts from this portable root only.

## Dist Rule

When the user asks for a `dist`, `zip`, `package`, `distributable`, or upload-ready artifact:

1. Ensure `dist/` exists.
2. Remove everything currently in `dist/`.
3. Build exactly one ZIP at `dist/meta-prompt.zip`.
4. Build the ZIP from `skill/` only.
5. Keep the archive root flat as `meta-prompt/`.
6. Include only portable skill contents:
   - `SKILL.md`
   - `agents/`
   - `references/` if present
   - `assets/` if present
   - `scripts/` if present
7. Exclude repo-local materials such as `docs/`, `tests/`, `dist/`, wrappers above the portable root, and repo metadata.

## Validation

After building:

1. `dist/` exists.
2. `dist/` contains exactly one file: `dist/meta-prompt.zip`.
3. The archive root is `meta-prompt/`.
4. The ZIP contains only the portable skill payload.

## Editing Notes

- Keep `SKILL.md` and `agents/openai.yaml` aligned when trigger scope or packaging changes.
