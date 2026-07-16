# Hard-Cut Policy

Read this for architecture reviews and refactors. Architecture Review treats
hard-cut as the default posture. Other workflows establish that a hard cut is
eligible before applying this cleanup policy.

## Eligibility

Apply a hard cut to changes that alter schemas, contracts, persisted state,
routing, configuration, feature flags, enum/value sets, or architecture unless
there is concrete evidence of a real external compatibility boundary.

Treat previous shapes as internal draft shapes unless they are already:

- persisted external or user data
- on-disk or database state that must still load
- a wire format used across process or service boundaries
- a documented or publicly supported contract
- actively depended on outside the refactor boundary

Mere existence of old code is not proof of a compatibility obligation.

## Canonical Path

Once the hard cut is eligible, keep one canonical codepath and remove old-shape
handling. Do not preserve, translate, or specifically reject a shape merely
because it once existed.

- Do not add fallback behavior, compatibility branches, shims, adapters,
  coercions, aliases, or dual-shape support.
- Do not add fail-fast guards or tests whose purpose is to detect or reject old
  shapes.
- Update producers, consumers, fixtures, tests, docs, migrations, generated
  files, previews, helper names, and comments to use only the canonical shape.
- Remove dead code, dead conditionals, obsolete comments, and translation
  helpers related to old shapes.
- Keep validation only for the current canonical contract. It may reject
  malformed current-shape input, but must not branch on legacy discriminators,
  old field names, aliases, old enum members, or draft formats.
- Keep one owner for the canonical contract.
- Search for retired names across code, tests, docs, fixtures, generated project
  files, and specs before calling the cleanup complete.

When choosing between backward compatibility and simplification inside an
eligible hard cut, choose simplification.

## Exception Rule

Make an exception only when removing the old shape would break persisted
external or user data, on-disk or database state, a cross-boundary wire format,
or a real public contract.

When such a boundary exists:

- name the exact file and function
- describe the concrete persisted or public dependency
- limit compatibility to that boundary
- do not invent new compatibility layers elsewhere
