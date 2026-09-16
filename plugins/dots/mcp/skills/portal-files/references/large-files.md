# Large Files

Use zero-based byte ranges for binary content and oversized lines. `files.stage_start`, `files.stage_chunk` and `files.stage_commit` support large guarded writes. Chunk offsets and SHA-256 hashes must match; never retry with a new key to bypass an uncertain acknowledgement.
