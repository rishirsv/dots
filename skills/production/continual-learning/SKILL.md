---
name: continual-learning
description: "Incrementally extract recurring user corrections and durable workspace facts from Codex chat changes, then propose AGENTS.md bullet updates for user approval. Use when the user asks to mine previous chats, maintain AGENTS.md memory, or build a self-learning preference loop."
---

# Continual Learning

Keep `AGENTS.md` current using chat transcript deltas instead of full rescans.

## Inputs

- Codex chat roots:
  - `~/.codex/sessions/`
  - `~/.codex/archived_sessions/`
- Existing memory file: `AGENTS.md`
- Incremental index: `.codex/hooks/state/continual-learning-index.json`
- Canonical docs for conflict checks (when present):
  - `AGENTS.md`
  - `docs/DESIGN.md`
  - `docs/FRONTEND.md`
  - `docs/PLANS.md`
  - `docs/PRODUCT_SENSE.md`

## Workflow

1. Read existing `AGENTS.md` first.
2. Load incremental index if present.
3. Discover Codex chat transcript files and process only:
   - new files not in index, or
   - files whose mtime is newer than indexed mtime.
4. Extract only high-signal, reusable information:
   - recurring user corrections/preferences
   - durable workspace facts
5. Run a docs conflict check on each candidate bullet:
   - skip candidates already covered by canonical docs
   - skip candidates that contradict canonical docs
   - when a candidate partially overlaps a canonical rule, convert it to an `Update` proposal with rationale
6. Build a proposed merge with existing bullets in `AGENTS.md`:
   - update matching bullets in place
   - add only net-new bullets
   - deduplicate semantically similar bullets
7. Present proposed changes to the user and wait for explicit approval:
   - show exact bullets under `Add`, `Update`, and `Remove`
   - include a one-line rationale per proposed bullet
   - do not edit `AGENTS.md` yet
8. If and only if the user approves, apply the approved bullet changes to `AGENTS.md`.
9. Run memory aging and pruning checks:
   - if a learned bullet has no supporting evidence for 45 days, propose it in `Remove`
   - if a candidate has never been approved and remains stale for 90 days, prune it from index memory metadata
   - never auto-remove approved `AGENTS.md` bullets without user approval
10. Write back the incremental index:
   - store latest mtimes for processed files
   - remove entries for files that no longer exist
   - if changes are not approved, keep existing transcript index entries unchanged
   - always retain aging metadata needed for future stale/removal proposals

## Approval Gate (Required)

- Default behavior is suggestion-only.
- Never modify `AGENTS.md` without explicit user approval in the current thread.
- If approval is missing or ambiguous, ask for confirmation and stop before writing.
- Keep suggestions concise and in plain bullet form aligned to the output contract.

## Proposal Format (Required)

- Use exactly three sections in this order:
  - `### Add`
  - `### Update`
  - `### Remove`
- Under each section, use bullets with this shape:
  - `- <proposed bullet text> — <one-line rationale>`
- If a section has no items, write `- None`.
- Keep rationales factual and brief. No metadata tags.

## AGENTS.md Output Contract

- Keep only these sections:
  - `## Learned User Preferences`
  - `## Learned Workspace Facts`
- Use plain bullet points only.
- Do not write evidence/confidence tags.
- Do not write process instructions, rationale, or metadata blocks.

## Inclusion Bar

Keep an item only if all are true:

- actionable in future sessions
- stable across sessions
- repeated in multiple transcripts, or explicitly stated as a broad rule
- non-sensitive

## Exclusions

Never store:

- secrets, tokens, credentials, private personal data
- one-off task instructions
- transient details (branch names, commit hashes, temporary errors)

## Memory Aging Rules

- Track per-candidate memory metadata in the incremental index:
  - `firstSeenAt`
  - `lastSeenAt`
  - `seenCount`
  - `lastProposedAt`
  - `lastApprovedAt` (nullable)
- Stale thresholds:
  - 45 days without supporting evidence: propose removal from `AGENTS.md`.
  - 90 days stale and never approved: remove candidate metadata from index.
- Approval remains mandatory before any `AGENTS.md` deletion.

## Incremental Index Format

```json
{
  "version": 1,
  "transcripts": {
    "/abs/path/to/file.jsonl": {
      "mtimeMs": 1730000000000,
      "lastProcessedAt": "2026-02-18T12:00:00.000Z"
    }
  },
  "memory": {
    "normalized-bullet-key": {
      "firstSeenAt": "2026-02-01T09:00:00.000Z",
      "lastSeenAt": "2026-02-18T12:00:00.000Z",
      "seenCount": 3,
      "lastProposedAt": "2026-02-18T12:01:00.000Z",
      "lastApprovedAt": null
    }
  }
}
```
