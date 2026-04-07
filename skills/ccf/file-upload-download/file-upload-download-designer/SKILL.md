---
name: file-upload-download-designer
description: Design frontend file upload and download pipelines for React TypeScript apps. Use when asked to specify uploader UX, validation rules, orchestration/state flows, presigned upload flows, download filename handling, and error/display contracts without writing implementation code.
---

# File Upload & Download Design

## Purpose

Help Codex complete file upload/download pipeline design work end-to-end by:

- Producing an implementation-ready `## File Upload/Download Design (for file-upload-download-implementor)` block specifying how to handle file selection, validation, upload orchestration, server handoffs (e.g., presigned URLs), progress, retries, and download handling
- relying on `../file-upload-download-common/SKILL.md` for shared file upload/download pipeline rules instead of repeating them here

## When to use this skill:

- The user wants to design UX/flow for uploads or downloads (single/multi-file) without code changes.
- Task touches file validation rules
- Task requires controlling download filename/content-disposition handling or client-side download UX.

## When NOT to use

- The user wants code changes rather than a design artifact
- Purely visual-only changes with no upload/download logic.

## Inputs

- Task name.
- Task description, possibly including
  - File constraints: allowed MIME types, extensions, max size per-file, max total size, max file count.
  - Expected UX states/flows and accessibility constraints (aria, keyboard).
  - API endpoints and upload integration
  - Expected post-upload behavior (refresh, revalidation, notification).
  - Security & compliance needs (virus scanning, encryption, retention).
  - Known existing utilities (file validation helpers, upload service, auth fetcher, toast/error utilities).
- Nearby component patterns when available.
- Target app and component/page surface.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## File Upload/Download Design (for file-upload-download-implementor)`

The design block must include only:

- **Task Goal**
- **Component Inventory**
- **Component Specs (per component)**

- **Validation Matrix** — explicit table of rules and messages
- **API Integration Sequence** — step-by-step call sequence for single file and multi-file cases
- **State Definition** — ASCII/state-diagram or step list for upload and download
- **Progress & UX Contract** — data exposed to UI and visual behavior
- **Download Naming & Handling** — algorithm to derive filename and handling steps
- \***\*Error Handling Contract** — mapping of server error codes → UI messages and telemetry

## Workflow / Steps

1. Inspect existing uploader and download components, validation utils, and service layer.
2. Identify ownership for each responsibility (component hook vs service vs redux/saga).
3. Produce a Validation Matrix (type × size × count × client message).
4. Draft a state definition for upload and download flows (idle → selecting → validating → uploading → processing → success/error → retry).
5. Design progress reporting (per-file and aggregate) and UX surface (progress bars, percent, estimated time).
6. Design error mapping: server errors → UI messages and retry affordances.
7. Design download behavior: filename derivation, content-disposition handling, fallback naming, streaming vs blob approach.

## Guardrails & Rules

- Keep frontend pre-validation (type, extension, size) — do not delegate validation completely to backend.
- Preserve existing state/action contracts and service patterns; prefer integrating with existing upload service.
- Prefer presigned upload for large artifacts and to avoid streaming credentials.
- Do not invent backend APIs; list unknowns if endpoints are unspecified.
- Always include cancellation and retry UX for long uploads.
- Do not hide error messages; surface sensible user-facing messages and provide retry where safe.

## Quality Checks

- Design contains explicit owner for each responsibility (hook vs service vs redux/saga).
- Upload orchestration steps are deterministic and include retries and cancellation.
- Validation messages are explicit and localized (i18n key suggestions optional).
- Download naming covers edge cases (same-names, missing content-disposition, unsafe chars).
