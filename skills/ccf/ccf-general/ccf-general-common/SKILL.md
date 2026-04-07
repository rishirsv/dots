---
name: ccf-general-common
description: Shared repository-wide engineering guidance. Use alongside repo design or implementation skills when Codex needs monorepo structure, architecture boundaries, flavor-aware shared-library reuse rules, dependency constraints, and license guardrails without duplicating them in role-specific skills.
---

# CCF General Common

## Purpose

Help Codex keep repository-wide CCF work consistent by:

- centralizing the shared monorepo and architecture rules used by both design and implementation work
- defining the frontend, backend, dependency, and licensing constraints that apply across the repository
- separating shared repository guidance from role-specific design and implementation workflows

## When to use this skill:

- The task is in this monorepo and needs repository-specific structure, boundary, or dependency rules.
- A designer or implementor skill needs the shared CCF constraints before proceeding.

### Do NOT use this skill if:

- The task is outside this repository.
- The work is generic and does not depend on repository-specific rules.
- A narrower skill fully covers the task and no CCF-wide rule is relevant.

## Inputs

- The task scope and affected packages or files.
- Existing repository structure and local conventions in the area being changed.
- Any requested exceptions around placement, dependencies, or architecture.

## Output Format

This skill does not define a standalone deliverable. It supplies the shared repository constraints that the `ccf-general-designer` and `ccf-general-implementor` skills should apply.

## Workflow

### 1. Resolve active development flavor

1. Read `requirements/development-flavor.md` when present.
2. Parse the line `Active flavor: <value>`.
3. Allowed values are:
   - `CCF Developer`
   - `Builder`
4. If the file is missing, malformed, or has any other value, default to `CCF Developer`.
5. Apply flavor-specific rules before making any placement, dependency, or shared-library decision:
   - In either flavor, when code connects to an external service and an official vendor SDK is available, use that SDK.
   - `CCF Developer`
     - treat `requirements/CCF-Architecture-Guidelines.md` as a required architecture input
     - prefer the existing `@ccf_ca/*` external-service wrappers when the capability matches
     - deployment-owned external resources and runtime configuration may be modeled as prerequisites
   - `Builder`
     - optimize for code that Codex can generate, run, and test locally where practical
     - treat `requirements/CCF-Architecture-Guidelines.md` as preferred guidance, not a hard-stop contract
     - treat external-service wrappers under `lib/` as optional and ignore them unless the touched code already depends on them or the user explicitly asks to use them
     - prefer project-local implementations and locally runnable dependencies over deployment-owned Azure services when that still satisfies the task
     - when an LLM provider is needed and the task does not already force one, prefer the official OpenAI platform / ChatGPT ecosystem rather than Azure OpenAI-specific wrappers
     - record any material flavor-driven deviation in the normal feature, task, or implementation artifacts instead of silently assuming strict CCF compliance

### 2. Inspect repository context

1. Read the in-scope application, service, or library structure before proposing new placement.
2. Preserve existing architecture and naming patterns unless the user explicitly requests restructuring.
3. Determine where the generated work belongs in the repository, before making design or implementation decisions.

### 3. Enforce monorepo structure

1. Keep the root limited to:
   - `application/`
   - `lib/`
   - `docs/`
   - `tests/`
   - `requirements/`
   - `features/`
   - `.codex`
   - `change_requests`
2. Place:
   - backend services under `application/api/[service-name]/`
   - frontend apps under `application/web/[app-name]/`
   - shared libraries under `lib/[library-name]/`
   - requirements and technical guidance under `requirements/`
   - feature backlog under `features/`
   - general project documentation under `docs/`
   - change request files under `change_requests/`
   - canonical persistence schema documentation under `docs/db-model.md`
   - canonical deployment resource and seed planning under `docs/deploy_plan.md`, including structured placeholders for required deployment-owned seed values that are still pending. In this repository, the `Seed` section also owns deployment-time runtime configuration such as environment variables and App Configuration keys consumed through `@ccf_ca/system` or `@ccf_ca/app-config`.
3. Do not create new top-level folders without explicit user approval.
4. Do not leave loose Docker or infrastructure files at the repo root.

### 4. Preserve architecture boundaries

1. Keep frontend code in `application/web/`, backend logic in `application/api/`, and framework-agnostic reuse in `lib/`.
2. Apply SOLID principles and keep responsibilities separated across UI, business logic, data access, and configuration.
3. Do not use websockets or webhooks between backend and frontend in this repository.
4. Keep deployment-time provisioning and seeding concerns out of runtime request paths and shared-library data-access code. When the chosen implementation actually depends on deployment-owned resources or configuration, document that in `docs/deploy_plan.md` and handle it through deployment tooling or operator steps. In `Builder` mode, prefer a locally runnable substitute before declaring a deployment prerequisite.
5. Treat any newly introduced deployment-owned runtime configuration dependency as deployment seed, not as an implementation-only detail. This includes new or changed calls to `getEnvVariable(...)`, `getEnvVariableOrThrow(...)`, `getValue(...)`, `getValueOrThrow(...)`, `getVersionValue(...)`, and `getVersionValueOrThrow(...)`.
6. Treat transitive shared-library runtime prerequisites as deployment-owned configuration only when the active flavor and chosen implementation still rely on those shared-library code paths for successful startup or request execution.
7. Do not assume that any configuration supported by a reused library is present in runtime.
8. Classify each runtime configuration record in `docs/deploy_plan.md` as:
   - `Mandatory`: the active code path fails without the value and no code default exists
   - `Optional`: the active code path provides a concrete default value at lookup time
9. When a task introduces, changes, or depends on one of those runtime configuration dependencies in the chosen runtime path, update the `Seed` section of `docs/deploy_plan.md` with:
   - source type: `Env var`, `App Config key`, or `App Config key pattern`
   - exact name
   - classification: `Mandatory` or `Optional`
   - default value when the code provides one, otherwise `None`
   - purpose in plain language
   - why the active code path needs it
   - expected format, units, or allowed values when relevant
   - who supplies it
   - consumed-by path or owning runtime flow
   - branch or version override semantics when `getVersionValue*` is used
10. When a chosen runtime path also depends on non-key operational prerequisites derived from configuration usage, document those prerequisites in `docs/deploy_plan.md` as well. Examples: credential aliases, Azure resource/account names, endpoint templates, or deployment-name conventions.

### 5. Apply shared backend and frontend conventions

1. Reuse the provided shared libraries when they fit the active flavor and the actual runtime path before introducing app-local helpers or wrappers.
2. The project always starts with the following list of the shared libraries and their intended use:
   | Library | Purpose and Usage Guidelines |
   |---------|----------------------------|
   | `@ccf_ca/app-config`| runtime/system config from App Configuration: use to access configuration settings that can be change in the running system without restart and or re-deploying. Must not have any secrets|
   |`@ccf_ca/system` | process configuration: use to configure process configuration specific for the environment |
   | `@ccf_ca/async_storage` | async request context: use to keep request-scoped context. Should be used sparingly and only when necessary to pass context across async calls, such as for logging correlation or cross-cutting concerns. Should not be used as a general state management solution.|
   | `@ccf_ca/azure-credential`| Azure credential management: use to acquire azure identity in runtime. Works in cloud (by using Managed Identity) or locally (by using Azure CLI identity which must be installed separately).|
   | `@ccf_ca/blob-storage`|Azure Blob storage access: use to interact with Azure Blob Storage. Use when data should be stored for long-term persistence or shared across resources. |
   | `@ccf_ca/cognitive-search` | Azure Cognitive Search client and utilities: use to interact with Azure Cognitive Search service. Use when you need a capability to run full text search or similarity searched (embeddings)|
   | `@ccf_ca/cosmos-db`| Cosmos DB client/container access: use to interact with Azure Cosmos DB.|
   | `@ccf_ca/jwt_auth`| Back-End authentication middleware: use to handle JWT authentication.Use whenever new service need to be bootstrapped|
   | `@ccf_ca/keyvault`| Azure Key Vault access: use to interact with Azure Key Vault for secrets management. this is teh only approved way to read secrets.|
   | `@ccf_ca/log` | logging: use to log application events and errors. The only approved way to log events and errors.|
   | `@ccf_ca/openai`| A wrapper around Azure OpenAI API: use to interact with Azure OpenAI service.|
   | `@ccf_ca/sharepoint`| SharePoint client and utilities: use to interact with SharePoint sites and lists.|
   | `@ccf_ca/shared-types`|shared API/domain contracts: use to define and share types between Front-End and Back-End services. Should not be used to share types between unrelated services or libraries.|

   In `Builder` mode, treat the following as optional external-service wrappers that may be ignored unless the touched code already depends on them or the user explicitly asks to use them: `@ccf_ca/app-config`, `@ccf_ca/azure-credential`, `@ccf_ca/blob-storage`, `@ccf_ca/cognitive-search`, `@ccf_ca/cosmos-db`, `@ccf_ca/jwt_auth`, `@ccf_ca/keyvault`, `@ccf_ca/openai`, and `@ccf_ca/sharepoint`.

   In both flavors, `@ccf_ca/shared-types`, `@ccf_ca/system`, `@ccf_ca/log`, and `@ccf_ca/async_storage` remain generally reusable local libraries when they fit the task.

   **Important!** The libraries listed above under the `@ccf_ca/*` namespace are scaffold libraries. For all of them except `@ccf_ca/shared-types`, they are intended to be reused across multiple repositories and must not be customized for this project's business requirements. Before changing one of those libraries, classify the change:
   - `Project-specific`: derived from this repository's business requirements, domain model, feature workflow, prompt content, validation rules, or other behavior that only this project needs. Never add these changes to scaffold libraries other than `@ccf_ca/shared-types`. Put them in the owning service or app under `application/api/` or `application/web/`, or in a dedicated project-specific library under `lib/` when multiple packages in this repository need to share them.
   - `Generic scaffold enhancement`: exposes more reusable capability of the wrapped platform or service without embedding this project's business rules. These changes may be made to an existing scaffold library only when the user explicitly asks for that library change or explicitly approves it.

   `@ccf_ca/shared-types` is the one exception. Its purpose in the table above is correct: it is the approved location for project-specific shared API/domain contracts that must be reused between Front-End and Back-End services in this repository. Treat those contract additions or updates as normal project work. Do not use `@ccf_ca/shared-types` for unrelated services, cross-library utility types, or non-contract helpers.

   If a scaffold-library enhancement that requires explicit approval is approved, record it in `docs/scaffold_changes.md`. Do not use `@ccf_ca/*` libraries as a convenience location for project-only helpers, abstractions, or domain behavior outside the `@ccf_ca/shared-types` exception described above.

3. In order to create a project-specific library, to be reused across services within the project, add a new library under the `lib` folder. Each library under the `lib` folder should be a well-encapsulated package with a clear single responsibility. Use this path when reuse is needed inside this repository but the behavior is still project-specific. Do not place project-specific business logic into the existing `@ccf_ca/*` scaffold libraries, except for shared API/domain contracts that belong in `@ccf_ca/shared-types`. In `Builder` mode, prefer this path over extending an external-service wrapper when the local/project-specific solution is what makes the task runnable and testable. Add the new library to the `lib/scripts/buildAll.sh`

   **Important!** Any library changes under `lib/` requires running the following under that library folder:
   - run `npm i` to make sure dependencies are installed and lockfile is updated
   - run `npm run build` to make sure the library builds successfully and is available for import without errors.

4. New APIs must:
   - live under a `methods` folder
   - be registered in `methods/index.ts`
   - use the repository's stream or non-stream route method interfaces
5. In `CCF Developer` mode, route authentication must go through the existing `JWTAuth` middleware integration. In `Builder` mode, prefer existing local auth patterns when present, but do not force JWT/AAD-specific wiring when a simpler locally runnable approach is needed for the selected task.
6. Frontend implementation details such as primitive selection, styling approach, and local component reuse must follow the relevant frontend common skill and nearby app patterns.
7. Add a new project-specific library under `lib/` only when the capability is stable, cross-service within this repository, and not already covered. Treat a new or changed `@ccf_ca/*` scaffold library as an exceptional cross-repository concern that requires explicit user approval, except for normal project contract updates in `@ccf_ca/shared-types`.

### 6. Apply dependency and licensing rules

1. Add dependencies only when necessary and place them in the correct workspace package.
2. Only use approved licenses:
   - MIT
   - BSD variants
   - ISC
   - DWTFYW
   - Apache-2.0, MPL-2.0, and Artistic License only when the library code itself is not modified
3. Reject GPL, LGPL, AGPL, and other unapproved copyleft licenses.
4. Keep build output directories named `build`, not `dist`.

## Guardrails

- Do not create new top-level structure or dependencies casually.
- Do not violate the repository's frontend, backend, and shared-library boundaries.
- Do not proceed with unapproved license exceptions.
- Do not connect to an external service through raw REST helpers or unofficial SDKs when an official vendor SDK is available, unless no official SDK exists.
- Do not hide deployable resource creation, resource-configuration changes, or required seed data inside runtime code paths; those requirements belong in `docs/deploy_plan.md`.
- Do not leave required seed structure only in helper templates or implementation notes; `docs/deploy_plan.md` remains the canonical operator-facing source of truth.
- Do not treat new or reused environment variables or App Configuration keys as "already implied" by code or by shared-library README files. If the chosen runtime path now depends on them, add or update the corresponding `Seed` entries in `docs/deploy_plan.md`.
- Do not mark a configuration item as `Optional` merely because the library supports it; it is `Optional` only when the exact active code path provides a default.
- Shared-library compliance:
  - Classify every proposed library change before deciding placement.
  - `@ccf_ca/shared-types` is the approved location for project-specific shared API/domain contracts used between Front-End and Back-End services in this repository.
  - Do not add other project-specific behavior to the provided `@ccf_ca/*` scaffold libraries.
  - Only generic cross-repository enhancements may be added to scaffold libraries outside `@ccf_ca/shared-types`, and only when the user explicitly approves that change.
  - Record every approved scaffold-library enhancement that required explicit approval in `docs/scaffold_changes.md`.
  - no new app-local helper duplicates an existing `lib/` capability
  - reuse the appropriate existing library when it is suitable for the active flavor and chosen runtime path unless the user explicitly approves an exception.
  - Before introducing any new helper in `application/`, Codex must answer:
    1. Is this responsibility already provided by a package under `lib/` that is suitable for the active flavor and chosen runtime path?
    2. If yes, reuse it.
    3. If no, is the missing capability a shared API/domain contract, other project-specific behavior, or a generic scaffold enhancement?
    4. If it is a shared API/domain contract reused between Front-End and Back-End services in this repository, place it in `@ccf_ca/shared-types`.
    5. If it is other project-specific behavior, place it in the owning `application/` package or a dedicated project-specific library under `lib/`.
    6. If it is a generic scaffold enhancement, require explicit user approval before changing a `@ccf_ca/*` scaffold library.
