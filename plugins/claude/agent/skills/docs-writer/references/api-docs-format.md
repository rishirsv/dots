# API Docs Format

Use the interface's source of truth before writing Markdown. Human docs should add context, examples, failure modes, and migration notes that generated reference cannot provide.

## Source Standards

Prefer generated specs, schema files, language-native comments, tests, or the implementation itself. Human docs should add context rather than duplicate generated reference.

## API Type Decision

| Interface | Prefer | Human docs add |
|---|---|---|
| Public HTTP/REST API | generated HTTP contract plus generated reference | auth flows, examples, workflows, common errors, versioning |
| Event/message API | generated event/message contract | topic/channel semantics, ordering, retries, idempotency, dead-letter behavior |
| JSON payload/config | schema file | examples, defaults, compatibility, validation commands |
| SDK/library public API | Language-native doc comments and generated docs | package overview, recipes, migration notes |
| Internal module API | Code-near docs or module README | invariants, side effects, failure modes, examples |

## Minimum Human API Doc Shape

- Audience and use case
- Source of truth path: spec/schema/code/generated docs
- Authentication/authorization, if applicable
- Endpoint/function/channel/resource summary
- Inputs: path/query/body/headers/params/events/options
- Outputs: status codes/return values/events/side effects
- Error model and common failure modes
- Idempotency, ordering, retries, rate limits, pagination, or consistency notes where relevant
- Versioning and compatibility
- Small working examples
- Validation command or generated-doc build command

## Writing Rules

- Do not duplicate generated reference tables unless the generated source is absent or unreadable.
- Keep examples copy-pasteable and minimal.
- Name side effects explicitly.
- Include request and response examples together.
- For errors, include code, condition, and caller action.
- State compatibility and deprecation behavior only with source evidence.
- For private/internal APIs, prefer code-near docs over broad standalone reference.
