# API Task Output Template

Use this structure exactly for the final artifact.

# Task `<task_id>` `<task_title>`

- Task type: `API / API method` | `API / API Service`
- Intent:
- Dependencies: `None` | `<task ids>`
- Reuse opportunities:
  - `<repo path>` - how it should be reused or extended

## API definition and business logic

- Streamability: `Non-streaming` | `Streaming`
- Route classification: `new endpoint` | `existing contract change` | `existing behavior change`
- Contract continuity:
  - `new endpoint`
  - `contract changed`
  - `external contract unchanged`
- API definitions:
  - Endpoint:
  - Route ownership:
  - Shared request type:
  - Shared response type:
  - Streamed behavior:
- Business logic sequence:
  1. normalize and validate inputs
  2. call dependencies such as shared libraries, repositories, or external integrations
  3. apply decision points and branching rules
  4. construct and return the response or streamed output
- Decision points:
  - rule or branch
- Error handling:
  - log the original caught error with traceable request context
  - log errors without PII but with enough traceable context for production troubleshooting
  - status or failure mode
  - UI error envelope:
    ```ts
    {
      errorList: [
        {
          id: randomUUID(),
          created: Date.now(),
          type: "error",
          delta: "Human-readable error message",
          code: "featureSpecificCode",
          errType: "validate" | "db" | "general",
        },
      ],
    }
    ```
  - Functional perspective error codes:
    - `code`:
    - `errType`: `validate`
    - trigger: payload-validation or business-rule failure
  - Application error codes:
    - `code`:
    - `errType`: `general`
    - trigger: internal server or orchestration failure that is not domain-specific or DB-specific
  - DB error codes:
    - `code`:
    - `errType`: `db`
    - trigger: DB-specific failure the UI must distinguish directly, including concurrent write conflicts
- Logging and telemetry:
  - event or trace requirement

## Additional notes

- Auth and permissions:
- Compatibility and versioning:
- Performance or payload considerations:
- Config or environment impact:
- Assumptions:
- Open questions:

Rules:

- Omit irrelevant bullets under `## Additional notes` instead of printing placeholder text.
- For non-streaming APIs, populate `Shared request type` and `Shared response type`, and omit `Streamed behavior`.
- For streaming APIs, populate `Shared request type` and `Streamed behavior`, and omit `Shared response type`.
- Keep `Business logic sequence` as ordered implementation steps derived from the feature flows and acceptance criteria.
- If the task scope still implies multiple endpoints, stop and split the task instead of combining them here.
- Inspect current shared-types and API registration files before finalizing names, contracts, and reuse paths.
- Always define UI-facing error codes for cases where the happy path is not met.
- Use `errType: validate` for payload-validation and functional validation failures.
- Use `errType: db` with `code: conflictWriting` for concurrent DB write conflicts.
- Use `errType: general` with `code: general` for internal server errors.
- Choose feature-specific `code` values for functional and payload validation failures.
- For `existing behavior change`, set `Contract continuity` to `external contract unchanged`.
