Create a compact, utilitarian, self-contained HTML release brief from the facts below. Save exactly one finished .html artifact in the requested artifact directory and return a concise link to it.

Title: CSV export hardening release brief
Audience: the engineer running today's release.
Facts:
- Change: escape spreadsheet-formula prefixes in user-supplied cells and preserve UTF-8 output.
- Verification: 27 focused tests pass; fixtures cover =, +, -, and @ prefixes; a 100,000-row export completes in 1.8 seconds on the recorded local benchmark.
- Rollout: build, run focused tests, export the four malicious fixtures, inspect the first and last rows, deploy.
- Remaining risk: the timing is a local benchmark, not a production SLO.
- Exact config line: EXPORT_FORMULA_ESCAPE=enabled
- Decision: ship today and monitor export errors for one release cycle.

Use no more than four main sections. Keep the exact config line easy to copy, make the five-step rollout readable at 360px, and do not add a table of contents, theme toggle, decorative figure gallery, or unsupported metrics.
