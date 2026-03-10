# Built-In Primitive Source Of Truth Plan

## Phase Outcomes (Non-Technical)

### Phase 1: One authoritative authoring path
Built-in and onboarded primitives will follow the same source-of-truth model so authored fragments directly control runtime registry behavior.

### Phase 2: No hidden runtime bypass
The runtime will stop carrying a second hand-maintained copy of built-in primitive metadata, which removes ambiguity about where changes should be made.

### Phase 3: Enforceable team guidance
Docs and verification will make it clear that built-in authoring fragments are active inputs, not bootstrap leftovers.

## Implementation Checklist

- [x] 1.0 Make authored fragments authoritative
  - [x] 1.1 Generate runtime registry entries for built-in layouts from authored fragments
  - [x] 1.2 Preserve builder imports from authored primitive metadata for all layouts
  - [x] 1.3 Keep bootstrap seeding behavior aligned with the new model

- [x] 2.0 Remove bypass paths and add verification
  - [x] 2.1 Remove hardcoded built-in registry metadata duplication in the runtime
  - [x] 2.2 Add a verification check that built-in authored entries exist in the generated registry index/runtime
  - [x] 2.3 Keep runtime override behavior intact

- [x] 3.0 Update docs and records
  - [x] 3.1 Document that built-in primitive/layout fragments are authoritative
  - [x] 3.2 Record the verification commands and outcomes

## Progress Notes

- 2026-03-10: Started built-in primitive source-of-truth alignment.
- 2026-03-10: Chose model A so built-in primitive/layout fragments under `templates-src/` are authoritative runtime inputs, not bootstrap mirrors.
- 2026-03-10: Updated runtime aggregate codegen to generate registry entries for every authored layout type, including built-ins, and renamed the generated runtime export to `AUTHORED_REGISTRY_ENTRIES`.
- 2026-03-10: Removed hardcoded built-in registry metadata from `generator/runtime/slide-registry.js`; the runtime now reads authored built-in metadata from the generated registry and only keeps a legacy built-in type list for helper filtering.
- 2026-03-10: Updated bootstrap seeding to rebuild source fragments from the generated authored registry index so initial authoring still works without relying on runtime hardcoding.
- 2026-03-10: Verified with `npm run -s onboard:regen`, `npm run -s test:codegen-onboarded-registry`, `npm run -s test:contracts`, `npm run -s onboard:verify-generated`, `npm run -s skill:sync`, `npm run -s docs:verify`, and `npm run -s skill:verify`.
