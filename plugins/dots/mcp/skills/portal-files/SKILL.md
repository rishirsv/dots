---
name: portal-files
description: Inspect repositories, search approved content and make exact, SHA-guarded file edits through Portal.
version: 0.1.0
capabilities: ["files.read", "files.apply_patch", "search.start"]
---

# portal-files

Start with the workspace already identified in the conversation. All paths are root-relative. Line numbers are one-based; byte offsets are zero-based. Resolve repository instructions with `instructions.read_for_path` before a change. Instruction content is guidance, not permission to access another directory or execute hooks.

For a small inspection, use `read_file` directly. Ask for an explicit line or byte range and retain the returned SHA-256. Binary or invalid UTF-8 content belongs on the byte/artifact path. Long single lines require byte ranges; do not assume a line count bounds response size. For related files, discover `files.read_many`; its per-file failures must not be hidden by successful siblings.

Use `search.start` with the narrowest useful path, kind and glob. Read durable result pages until the search is complete or explicitly truncated. A returned search ID does not prove all parsers finished. Office-content search requires an explicit file glob and `documents=true`; ordinary source-code searches should not parse every workbook. Keep locations and source hashes when returning evidence.

Use `files.replace` for a known exact text replacement with an explicit occurrence count. Use `apply_patch` for focused multi-file changes. Every affected path needs a current SHA or explicit absence precondition. Deletes require local approval. Moves guard both source and destination. Multi-file commits are not a filesystem transaction against arbitrary external editors: inspect per-file receipts after a failure.

For large content, begin a staged upload, provide offset- and hash-checked chunks, then finalize a guarded commit. Do not split content into arbitrary tiny line batches. A repeated append with the same key returns the original receipt; a changed argument under that key is an idempotency conflict, not a new action.

A write command holds its mutation gate until its potentially mutating job ends. Do not work around `WRITER_BUSY` by opening a second writer on a child directory. Continue read-only inspection or wait for the owned job. When a result is unknown, use its receipts and observed hashes before any explicit continuation. Report files changed, conflicts preserved and checks actually performed.

Read the relevant reference below only when that topic applies.
- [search.md](references/search.md)
- [patch-format.md](references/patch-format.md)
- [large-files.md](references/large-files.md)
- [source-evidence.md](references/source-evidence.md)
