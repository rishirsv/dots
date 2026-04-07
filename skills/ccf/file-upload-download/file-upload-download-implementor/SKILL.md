---
name: file-upload-download-implementor
description: Implement frontend file upload and download pipelines in React TypeScript apps, including dropzone UX, validation, upload orchestration, and download naming/handling. Use when changing document upload/download behavior.
---

# File Upload Download Pipelines

## Purpose

Provide repeatable, safe patterns for file input UX and backend-integrated upload/download orchestration.

## When to use this skill:

- Updating uploader UX and file validation.
- Implementing multi-step upload flows (for example pre-signed URL patterns).
- Orchestrating upload -> process -> save -> refresh sequences.
- Implementing frontend download flows with proper filename handling.

## Inputs

- File type/size/count constraints.
- API endpoints for upload/process/save/download.
- Required UX states (idle, uploading, success, error, retry).
- Expected post-upload refresh behavior.

## Workflow

1. Inspect current uploader component and validation utilities.
2. Map upload orchestration state transitions in service/state layer.
3. Define download response handling and filename derivation.
4. Define user-facing error mapping and inline/banner presentation.
5. Produce exact file-level integration steps.

## Output Format

Return an Upload/Download Plan with:

- Validation matrix.
- State machine for upload and download flows.
- API orchestration sequence.
- Error handling contract.
- File-by-file implementation plan.

## Guardrails

- Do not move validation solely to backend; keep frontend pre-validation.
- Keep large file/network timeout behavior explicit.
- Preserve existing state/action contracts for upload state.
- Avoid direct component-side API chains when service patterns already exist.

## When not to use

- Non-file API fetching tasks.
