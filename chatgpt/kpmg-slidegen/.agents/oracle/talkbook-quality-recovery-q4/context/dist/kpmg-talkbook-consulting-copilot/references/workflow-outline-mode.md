# Talkbook V2 Workflow Contract

This document defines the canonical stage model for Talkbook V2.

## Workflow Modes

- `outline_confirm`: default. Requires explicit outline approval before drafting.
- `one_shot`: bypass flow. Automatically records assumptions and auto-approves outline artifacts.

## Stage Model

- `intake`: session created, intent gathering in progress.
- `outline_draft`: outline is being drafted or revised.
- `outline_review`: outline saved and awaiting confirmation.
- `outline_approved`: outline approved, drafting unlocked.
- `drafting`: section authoring and iterative revision.
- `compiled`: compile completed for current draft state.

## Outline Approval Contract

`workflow.outline_approval` fields:

- `status`: `pending | approved`
- `timestamp`: ISO-8601 timestamp or `null`
- `rationale`: free-text approval rationale
- `approval_source`: `user_confirmed | auto_assumed | null`

## Mode Rules

### outline_confirm

- Drafting commands must fail before approval.
- `approve_outline.py` is the normal unlock step.
- `materialize_outline.py` requires approval unless explicitly overridden.

### one_shot

- Outline artifact is still required for traceability.
- Assumptions must be stored in `outline.assumptions`.
- Approval is auto-assumed (`approval_source=auto_assumed`).

## Stage Transition Guide

- `start_session.py` -> `intake` (or `drafting` for one_shot bypass).
- `upsert_outline.py` -> `outline_review` for outline_confirm sessions.
- `approve_outline.py` -> `outline_approved`.
- `materialize_outline.py` -> `drafting`.
- `upsert_section.py` keeps/sets `drafting`.
- `compile_deck_json.py` sets `compiled`.

## Auditability Requirements

- Both modes must preserve `outline.sections` artifacts.
- `actions[]` must record outline upsert, approval, and materialization events.
- Compile reports must include workflow metadata and outline adherence diagnostics.
