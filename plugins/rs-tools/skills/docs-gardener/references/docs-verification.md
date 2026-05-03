# Docs Verification

## Minimum verification after docs changes

- confirm edited file paths still exist
- confirm markdown links and anchors still resolve where practical
- confirm docs indexes reference the correct canonical paths
- confirm no active policy docs still point to retired file paths
- confirm `WORK-TRACKER.md` entries have a clear next step

## Strong verification for architecture changes

For repo-wide doc replacements or consolidations:

- run a repo-wide search for retired paths
- inspect the main indexes and operating docs manually
- confirm no duplicate registries remain
- confirm moved content still has an obvious discovery path

## Tooling suggestions

The first lightweight docs-health checks to add are:

- broken markdown link validation, such as `remark-validate-links`
- stale path/reference search with `rg`

Optional later check:

- prose/style linting with `Vale`

## Done definition

Docs work is done when:

1. the canonical doc is correct
2. the surrounding doc graph is coherent
3. stale references are removed
4. verification has been run or explicitly noted as pending
