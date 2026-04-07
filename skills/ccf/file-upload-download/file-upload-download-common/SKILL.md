---
name: file-upload-download-common
description: Shared rules and conventions for file upload and download pipelines. Use as the baseline referenced by designer and implementor skills to ensure consistent validation, UX, security, and orchestration patterns.
---

# File Upload & Download Common

## Purpose

Centralize repository conventions and safe patterns for file input UX, validation, upload orchestration, progress, retry, and client-side download handling so designers and implementors share a single truth.

## When to use

- Any design or implementation that touches file selection, upload, or download behavior.
- When validating proposed upload orchestration against repo standards.

## Inputs

- Repo-wide upload utilities and services (names/locations).
- Existing validation helpers, toast/error utilities, auth/fetch wrappers.
- Team policies for large files, scanning, and retention (if any).

## Conventions & Patterns

### 1) Validation

- Always validate client-side for:
  - MIME type and extension (whitelist)
  - Max per-file size
  - Max total size and max file count
- Use a `ValidationResult` type: `{ ok: boolean; code?: string; messageKey?: string; details?: any }`
- Map server-side validation errors into the same message keys.

### 2) UX & Accessibility

- Use an accessible dropzone with keyboard-focusable controls and clear aria-live status updates for upload progress and errors.
- Provide both drag-and-drop and file-pick affordances.
- Display per-file progress and an aggregate progress indicator for multi-file uploads.
- Expose review/cancel/retry actions for each file.
- Provide file previews for image/pdf when allowed; disable previews for disallowed or sensitive types.

### 3) Progress & Metrics

- Only report bytesUploaded and totalBytes at file level and aggregate percent when asked.
- Emit telemetry events (with redux actions) for start, success, failure, cancel, and retry counts.
- Avoid over-frequent UI updates; throttle progress updates to ~200ms.

### 4) Error Handling

- Normalize server errors
- Provide explicit recovery steps for each code (retry, reauth, contact support).
- Surface transient network errors separately from validation/server rejection.

### 5) Download Handling

- Prefer server-provided `Content-Disposition` filename when available.
- Fallback naming: `timestamp`
- Sanitize filenames to remove unsafe characters and limit length.
- For large downloads, stream to blob and use `URL.createObjectURL` with anchor download; revoke object URL after use.
- Ensure correct MIME type is used when creating blobs.

## Guardrails

- Do not auto-retry server 4xx without user action.
- Do not introduce new network libraries without approval.
- Do not store large files in Redux or other global stores; keep binary data in blobs/local caches.
- Do not generate filenames with user input un-sanitized.

## Integration Notes for Designer & Implementor

- Designer should state which of the above conventions are relevant or must be diverged from (and why).
- Implementor must follow these conventions and call out any missing backend capabilities (resumable tokens, presigned URL expiry details) as unknowns needing backend changes.
