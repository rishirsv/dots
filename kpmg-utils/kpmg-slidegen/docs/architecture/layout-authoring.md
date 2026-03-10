# Layout Authoring

This document is the source of truth for how layout authoring works in the repo.

## Core Model

### Primitive

A primitive is the reusable rendering unit.

Primitive source files live in:
- `templates-src/kpmg-diligence/primitives/<primitive-id>.json`

A primitive defines:
- builder module and export
- geometry kinds
- required and optional geometry keys
- optional defaults
- pagination policy
- master
- validation hooks

Use a new primitive only when the rendering behavior is materially new. Do not create a new primitive just to place the same structure at different coordinates.

### Layout Instance

A layout instance is the user-facing slide type.

Layout source files live in:
- `templates-src/kpmg-diligence/layouts/<layout-id>.json`

A layout instance defines:
- `type`
- `primitive`
- `description`
- `templateLayout`
- concrete geometry
- slots
- density target

Use a new layout instance when the structure is already covered by an existing primitive and only geometry, slot tuning, or presentation contract differ.

## Manual Vs Generated Files

Manual authoring files:
- `templates-src/kpmg-diligence/layouts/*.json`
- `templates-src/kpmg-diligence/primitives/*.json`
- `templates-src/kpmg-diligence/layout-package.meta.json`
- `generator/builders/primitives/*.js`
- `onboarding/cases/<case-id>/*`

Generated runtime files:
- `templates/kpmg-diligence/package/layouts.json`
- `generator/runtime/onboarded-registry.index.json`
- `generator/runtime/onboarded-registry.generated.js`

Built-in and onboarded layouts now share the same model:
- `templates-src/kpmg-diligence/layouts/` and `templates-src/kpmg-diligence/primitives/` are authoritative for all runtime registry metadata
- `templates-src/kpmg-diligence/layout-package.meta.json` is the authoritative source for package-level layout metadata such as masters, density rules, and detected layout metadata
- the historical generated files `generator/runtime/onboarded-registry.index.json` and `generator/runtime/onboarded-registry.generated.js` now contain the full authored runtime registry, including built-ins
- if a built-in primitive or layout changes, edit the source fragment and regenerate; do not patch `generator/runtime/slide-registry.js`
- runtime aggregate codegen must not read generated files as inputs; `templates/kpmg-diligence/package/layouts.json` is output-only

Relative path resolution rule for onboarded registry codegen:
- keep `builderModule` repo-relative in primitive authoring, for example `generator/builders/one-column-text.js`
- generate the runtime import specifier relative to `generator/runtime/onboarded-registry.generated.js`
- dedupe generated imports by `builderModule` plus `builderExport`; do not collapse module paths to basenames

Never hand-edit generated runtime files. Regenerate them with:

```bash
npm run onboard:regen
```

Verify they are current with:

```bash
npm run onboard:verify-generated
```

Validate primitive and layout authoring fragments with:

```bash
npm run schema:validate:authoring
```

## Onboarding Relationship

Onboarding cases are the only supported path for adding or promoting layouts.

The case workflow is documented in:
- `docs/onboarding/onboard-layout.md`

Promotion writes source fragments first, then regenerates runtime aggregates. Promotion does not directly edit runtime package files.

## Skill Bundle Boundary

The portable skill bundle must stay generated and runtime-only.

Allowed bundle inputs:
- `generator/`
- `templates/kpmg-diligence/`
- `presets/authoring/`
- portable skill-native files under `skills/kpmg-slides/`

Disallowed bundle inputs:
- `templates-src/`
- `onboarding/`
- `outputs/onboarding/`
- repo-only draft prompts, case artifacts, or review notes

Use:

```bash
npm run skill:sync
npm run skill:verify
```

## Promotion Gates

A layout may be promoted only when all of the following are true:
- the onboarding case has extraction, classification, scaffold, render, and compare artifacts
- candidate QA has no blocking checks
- `compare/scorecard.json` has `pass: true`
- source fragments are written into `templates-src/`
- `npm run onboard:regen` succeeds
- `npm run onboard:verify-generated` succeeds

## Drift Controls

Before opening a PR for layout work, run:

```bash
npm run docs:verify
npm run schema:validate:authoring
npm run test:changed-layouts
npm run onboard:regen
npm run onboard:verify-generated
npm run test:primitive-stress
```

Changed-layout detection modes:
- local no-arg use: `npm run test:changed-layouts`
- CI explicit refs: `npm run test:changed-layouts -- --base-ref <base-sha> --head-ref <head-sha>`
