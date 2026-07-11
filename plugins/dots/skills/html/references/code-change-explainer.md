# Code-change explainer

Read this when `explain` has already formed a post-coding or diff explanation
and the user wants a persistent HTML artifact. The page teaches the change; it
does not review the code or redo the investigation.

Compose in the narrative order supplied: outcome, relevant background, core
idea, grouped walkthrough, representative flow, and verification. Omit any
section the formed material does not need. Show the system as it works now,
while preserving the meaningful before/after contrast that explains why the
change matters.

Use `flow-diagram` for a representative execution or data path and
`comparison-grid` or `diff-block` only when a compact before/after view is
clearer than prose. Keep code excerpts small and tied to the concept they
demonstrate; link to exact files or symbols when available. De-emphasize
mechanical file changes, but finish with compact coverage when the source
accounts for them.

Do not add intent, alternatives, risks, or verification claims absent from the
formed explanation. Apply the general artifact verification before handoff.
