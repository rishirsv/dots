Create a reviewer-facing, self-contained HTML walkthrough from the facts below. Save exactly one finished .html artifact in the requested artifact directory and return a concise link to it.

Title: Replace startup-wide health permissions with feature-owned authorization without changing Steady's canonical data ownership
Status: ready for review
Audience: a senior engineer deciding whether the change is safe to merge.

Facts:
- Before: app startup asked for every available HealthKit scope.
- After: Initial Connect requests only baseline readiness data; Workout Player requests workout routes when the user opens route-aware playback; Recovery asks for sleep stages only when its trend screen is opened.
- Steady's SQLite store remains canonical; HealthKit is an import source, not a second source of truth.
- Five-step review path: inspect current ownership, route each scope to its visible feature, preserve the canonical store boundary, run focused authorization tests, verify the narrow UI states.
- Evidence: 14 authorization tests pass; the baseline startup request falls from 9 scopes to 3; no schema or migration changes; route and sleep requests remain user-initiated.
- Risks: a feature can forget to request its scope; a denied scope must remain recoverable; tests currently cover three owning features.
- Recommendation: approve after confirming the denied-sleep recovery state in the simulator.

Make the review path fully readable on a 360px viewport, make the risk comparison readable without page-level horizontal scrolling, and keep confirmed facts distinct from the one remaining simulator check.
