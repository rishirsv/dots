# Docs Maintenance Workflows

## 1. Update existing canonical docs

Use this path when the correct owner doc already exists.

1. Inspect the relevant code and current docs.
2. Update the owner doc.
3. Update direct cross-links and indexes.
4. Verify paths and references.
5. Add or update a `WORK-TRACKER.md` entry if the work surfaced a follow-up gap.

## 2. Consolidate overlapping docs

Use this path when two docs cover the same concern.

1. Decide which doc should be canonical.
2. Merge only the useful content.
3. Update inbound references to point to the canonical doc.
4. Delete the superseded doc once the graph is updated.

## 3. Replace documentation architecture

Use this path when changing the repo-wide docs model.

1. Update the root operating guidance.
2. Update the docs index.
3. Create the new canonical file or structure.
4. Move or rewrite content into the new canonical location.
5. Update references across the repo.
6. Remove the retired paths.
7. Verify that no active guidance still points to the old structure.

## Explorer subagents for discovery

If fast explorer subagents are available and the task is broad enough to benefit from parallel read-only discovery:

1. use one explorer for the docs graph, stale references, and overlapping owner docs
2. use one explorer for the relevant code surface, behavior ownership, and doc drift
3. keep scopes disjoint
4. do not use explorers for writing or final editorial judgment

## 4. Audit docs for agent readiness

Use this path when the task is discovery or cleanup.

Audit for:

- missing canonical ownership
- stale or absolute environment-specific paths
- broken markdown links
- duplicated instructions
- tracker entries with no next step
- docs that no longer match the code

## 5. Write new durable docs

Use this path only when a new durable doc is actually needed.

1. Confirm no canonical owner doc already covers the concern.
2. Choose the canonical location.
3. Keep the new doc purpose-specific and link it from the right index.
4. Avoid creating new top-level buckets without a strong reason.
