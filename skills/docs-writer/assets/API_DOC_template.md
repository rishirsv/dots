# API: <Name>

## Purpose

<What this API lets consumers do and who uses it.>

## Source Of Truth

- Spec/schema/code path: `<path>`
- Generated docs: `<path>`
- Version: `<version>`

## Authentication

<Required auth, scopes, roles, or none.>

## Contract Summary

| Operation/resource | Method/channel/function | Purpose |
|---|---|---|
| `<name>` | `<method>` | <purpose> |

## Request/Input

```json
{
  "field": "value"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `field` | `string` | yes | <constraints/defaults> |

## Response/Output

```json
{
  "field": "value"
}
```

## Errors And Caller Action

| Code/error | Cause | Caller action |
|---|---|---|
| `<code>` | <condition> | <action> |

## Side Effects And Guarantees

- Idempotency: <yes/no/unknown>
- Ordering: <guarantee or none>
- Retries: <safe/unsafe/conditions>
- Rate limits: <limit or source>

## Examples

```sh
<curl or CLI command>
```

Expected signal:

- <status/output>

## Versioning And Compatibility

<Compatibility policy, deprecations, or migration link.>

## Validation

```sh
<command to validate spec, schema, generated docs, or examples>
```
