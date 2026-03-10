# Authoring Schema Runtime Geometry Alignment Plan

## Phase Outcomes (Non-Technical)

### Phase 1: One geometry language
Authoring files and runtime validation use the same geometry kind names so contributors do not have to guess which shapes are actually supported.

### Phase 2: Real authoring validation
Primitive and layout fragments fail fast with clear file-specific errors before codegen or runtime use, which makes authoring mistakes easier to catch locally and in CI.

### Phase 3: Regression confidence
Automated tests prove semantic object geometry, numeric and string geometry fields, unsupported kinds, and missing required geometry keys behave the same way the runtime contract expects.

## Implementation Checklist

- [x] 1.0 Align authoring schemas to runtime geometry kinds
  - [x] 1.1 Review runtime-supported geometry kinds and value shapes
  - [x] 1.2 Update `primitive.schema.json` to match runtime-supported kind names
  - [x] 1.3 Update `layout-instance.schema.json` to allow box, boxArray, boxTree, number, string, and object payloads
  - [x] 1.4 Validation for 1.0 (current authored fragments still validate)

- [x] 2.0 Add authoring fragment schema validation
  - [x] 2.1 Validate all primitive fragments against `primitive.schema.json`
  - [x] 2.2 Validate all layout fragments against `layout-instance.schema.json`
  - [x] 2.3 Enforce required geometry keys from each primitive on matching layout fragments
  - [x] 2.4 Fail with clear file path and reason

- [x] 3.0 Wire validation into repo workflows
  - [x] 3.1 Add a real npm script for authoring schema validation
  - [x] 3.2 Add the validation lane to CI and local PR coverage

- [x] 4.0 Add regression coverage
  - [x] 4.1 Valid semantic object geometry
  - [x] 4.2 Valid numeric and string geometry fields
  - [x] 4.3 Invalid unsupported geometry kinds
  - [x] 4.4 Missing required geometry fields

## Progress Notes

- 2026-03-10: Started runtime-aligned authoring schema update and validator implementation.
- 2026-03-10: Updated the primitive and layout authoring schemas to use the runtime-supported geometry kind set and geometry value shapes.
- 2026-03-10: Added `scripts/validate-authoring-fragments.mjs` using Ajv plus runtime geometry checks for primitive/layout linkage and required geometry enforcement.
- 2026-03-10: Wired `schema:validate:authoring` into package scripts, local lanes, CI, nightly coverage, and the layout authoring doc.
- 2026-03-10: Added regression coverage in `scripts/test-authoring-schema-validation.mjs` for semantic objects, number/string geometry, unsupported kinds, and missing required geometry.
- 2026-03-10: Verification passed with `npm run -s schema:validate:authoring`, `npm run -s test:authoring-schema-validation`, `npm run -s skill:sync`, `npm ci --prefix skills/kpmg-slides`, and `npm run -s test:pr`.
