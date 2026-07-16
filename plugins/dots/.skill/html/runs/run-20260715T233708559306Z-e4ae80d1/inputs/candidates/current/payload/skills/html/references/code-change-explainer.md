# Code-change explainer

Read this when the user wants a persistent HTML explanation of a completed
coding task or diff. Inspect the diff and the relevant code, tests, and
documentation needed to understand the change. The page teaches the change; it
does not issue a review verdict or modify the code.

Compose in the narrative order that best teaches the change: outcome, relevant
background, core idea, grouped walkthrough, representative flow, and
verification. Omit any section the change does not need. Show the system as it
works now while preserving the meaningful before/after contrast that explains
why the change matters.

Use `flow-diagram` for a representative execution or data path and
`comparison-grid` or `diff-block` only when a compact before/after view is
clearer than prose. Keep code excerpts small and tied to the concept they
demonstrate; link to exact files or symbols when available. De-emphasize
mechanical file changes, but finish with compact coverage when the source
accounts for them.

Do not invent intent, alternatives, risks, or verification claims that the
source does not support. Apply the general artifact verification before
handoff.
