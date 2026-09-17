# Patch Format

Patches use `*** Begin Patch`, per-file `*** Add File:`, `*** Update File:`, or `*** Delete File:` headers, then `*** End Patch`. Every path needs an expected hash; adds require null. Update hunks must match exactly once. Destructive deletion requires approval of the complete patch before the first file changes.
