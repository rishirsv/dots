# references/reference.md

## Form Submission Rules

### 1) Prefer existing Redux-saga flows for API calls

- If an API call is necessary, **use an existing Redux-saga flow if one already covers the endpoint/use-case**.
- Only **create a new Redux-saga flow** (actions/reducer state/selectors/saga worker + watcher) when:
  - no existing flow matches the submission behavior, or
  - existing flow cannot be safely extended without breaking other consumers.

**Implications**

- Components should dispatch a submit/request action and select status/error/result from the store.
- Side effects (API calls, retries, cancellation, toasts if centralized, cache refresh triggers) should live in sagas when that is the established app pattern.

### 2) API calls must use existing fetch utilities

- Any API call made by sagas must go through the repo’s **existing defined fetch utilities** (e.g., shared `fetch` utils in the utils folder `application/web/<appName>/src/utils/` folder..).
- Do **not** introduce ad-hoc `fetch(...)` usage or new HTTP wrappers unless explicitly requested and justified by existing conventions.
- Ensure consistent behavior with existing utilities:
  - base URL handling
  - auth headers / token injection
  - error normalization (status parsing, response shape)
  - request cancellation support if available (AbortController, saga cancellation, etc.)

### 3) New saga flow checklist (only when necessary)

When creating a new submission flow, keep it consistent with existing patterns:

- **Actions**
  - `submitRequested(payload)`
  - `submitSucceeded(result)`
  - `submitFailed(error)`
- **State**
  - `isSubmitting`
  - `error`
  - `result` or `lastSubmitted` (as locally appropriate)
- **Selectors**
  - `selectIsSubmitting`
  - `selectSubmitError`
  - `selectSubmitResult`
- **Saga**
  - watcher pattern consistent with local conventions (`takeLatest` for submit is common)
  - worker calls API via existing fetch utility
  - cancellation + retry behavior aligned with local patterns
