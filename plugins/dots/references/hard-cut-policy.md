# Replace an obsolete design completely

When a change establishes one current schema, contract, stored format, route,
configuration, feature-flag state, value set, or architecture, replace the old
form completely. This is a hard cut. Keep one authoritative implementation.
Retain support for the old form only when an external compatibility requirement
requires it.

Treat previous shapes as internal drafts unless they are already persisted user
data, on-disk state that must load, a cross-system wire format, a documented
public contract, or actively used outside the refactor boundary. Existing old
code is not evidence that compatibility is required.

## Replace the old form

1. Identify the target schema, format, or implementation.
2. Trace every producer and consumer.
3. Update live code, fixtures, test data, builders, snapshots, documentation,
   migrations, generated files, previews, presentation modifiers, helper names,
   comments, and enforcement to use only that target.
4. Delete legacy branches, fallbacks, shims, adapters, coercions, aliases,
   translation helpers, and dual-shape support.
5. Delete migrations, backfills, restore translation, and resync paths whose
   only purpose is recognizing or preserving the retired shape.
6. Do not add, and delete existing, guards or tests whose only purpose is
   recognizing or rejecting the retired shape.
7. Keep validation only for malformed input in the current contract.
8. Search the entire declared scope for every retired name and path before
   calling the cut complete.

Replace obsolete behavior and delete its implementation. For an adapter or
compatibility module, check what happens if it is removed: if removing it makes only obsolete behavior
disappear, delete it. If its complexity reappears at a real external boundary,
isolate it there.

## Exception

Make an exception only for persisted external or user data, on-disk state that
must still load, a cross-system wire format, or a real public contract. Name the
exact file, function, dependency, and reason. Keep compatibility handling at that
point. Do not duplicate it elsewhere.

## Completion

A hard cut is complete only when producers, consumers, tests, fixtures, docs,
generated artifacts, and enforcement use the current form. No runtime logic may remain solely to handle a retired
form, except at a documented compatibility boundary.
