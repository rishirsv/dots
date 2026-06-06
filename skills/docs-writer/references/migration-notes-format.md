# Migration Notes Format

Use the project's compatibility semantics and release vocabulary. When the repo has no local convention, write migration notes as practical upgrade instructions rather than changelog narration.

## Use Migration Notes When

- users must change code, configuration, data, infrastructure, or workflows
- a public API, config, CLI, schema, dependency, or runtime behavior changed incompatibly
- deprecations have a removal window or replacement path
- upgrade safety depends on pre-checks, sequencing, or rollback

## Minimum Shape

1. **Audience:** who must migrate.
2. **Version scope:** from/to versions, release, date, or compatibility window.
3. **Impact summary:** what breaks or changes.
4. **Pre-checks:** how to know whether the migration applies.
5. **Breaking changes:** exact removed/changed behavior.
6. **Replacement map:** old path/API/config/command to new one.
7. **Steps:** ordered migration actions.
8. **Rollback:** only if verified or supported.
9. **Validation:** commands, tests, metrics, or expected behavior.
10. **Known gaps:** unsupported cases, uncertainty, or manual follow-up.

## Replacement Map Pattern

| Old | New | Required action | Validation |
|---|---|---|---|
| `<old API/config/path>` | `<new API/config/path>` | <change to make> | `<command>` / expected signal |

## Writing Rules

- Separate changelog summary from migration steps.
- State whether the change is breaking, backward-compatible, or deprecation-only.
- Do not promise rollback unless verified.
- Prefer concrete version numbers and dates over relative language.
- Include pre-checks before destructive or broad changes.
- Use `Known Gaps` for uncertain paths rather than hiding uncertainty.

## Avoid

- raw commit lists
- generic release marketing
- migration instructions without validation
- unsupported claims that versioning rules apply if the project does not declare a public API or versioning policy
