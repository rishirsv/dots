# Migration Notes: <Change Name>

## Audience

<Who must migrate and who can ignore this.>

## Version Scope

- From: `<version/date>`
- To: `<version/date>`
- Compatibility window: <window or unknown>

## Impact Summary

<One paragraph describing what changes and why it matters.>

## Pre-Checks

Run these before changing anything:

```sh
<command>
```

Expected signal:

- <how to know this migration applies>

## Breaking Changes

| Old behavior | New behavior | Required action |
|---|---|---|
| <old> | <new> | <action> |

## Replacement Map

| Old | New | Validation |
|---|---|---|
| `<old API/config/path>` | `<new API/config/path>` | `<command>` |

## Migration Steps

1. <Step>

   ```sh
   <command>
   ```

   Expected signal: <result>

2. <Step>

## Rollback

Rollback is <supported/not supported/unverified>.

1. <Rollback step, if supported>
2. Validate rollback with `<command>`.

## Validation

| Check | Command | Expected signal |
|---|---|---|
| <check> | `<command>` | <result> |

## Known Gaps

- <unsupported case, uncertainty, or manual follow-up>
