# Repo Backend Conventions

Use these repo facts as the baseline for design decisions.

## Source Of Truth Files

Inspect these files before proposing new contracts or reuse paths:

- `lib/shared-types/src/api.types.ts`
- `lib/shared-types/src/index.ts`
- `application/api/api1/src/types/api.types.ts`
- `application/api/api1/src/methods/index.ts`
- `application/api/api1/src/expressMiddleware/index.ts`
- `application/api/api1/src/index.ts`
- `lib/JWTAuth/src/index.ts`
- `lib/log/src/index.ts`

## Shared Type Pattern

- Inspect `lib/shared-types/src/api.types.ts` for generic API base contracts.
- Inspect `lib/shared-types/src/index.ts` and any existing business-domain-specific files under `lib/shared-types/src/` for domain contract organization and exports.
- Reuse existing base schemas, error contracts, and matching schema fragments when the semantics align.

## Route Interface Pattern

- Non-streaming routes conceptually follow:
  - `getPath(): string`
  - `schema(): z.ZodType<API.BaseReq>`
  - `process(props): Promise<API.BaseRes>`
  - optional `getReqMaxSize()`
- Streaming routes conceptually follow:
  - `getPath(): string`
  - `schema(): z.ZodType<API.BaseReq>`
  - `process(props, res: Response): Promise<void>`
  - optional `getReqMaxSize()`

## Registration Pattern

- Non-streaming routes are grouped separately from streaming routes.
- Both route categories are registered centrally.
- Routes are exposed as `POST` endpoints.
- Health and readiness endpoints are separate `GET` handlers and are not part of the feature design flow.

## Verified Repo Defaults

- Incoming request bodies are validated with Zod before business logic runs.
- Invalid payloads are treated as schema failures by shared middleware.
- JWT auth is applied to API routes.
- Route handlers run behind shared middleware for async context, logging, auth, and error handling.
- Requests run inside async context with trace propagation, and API responses set the `xMSP-TRACE-ID` header.
- Structured logging is available through `logInfo` and `logError`.
- Global compression is enabled at the application level.
- Default cache behavior is `Cache-control: no-store`.
- Some routes may declare a larger request size through `getReqMaxSize()`.
