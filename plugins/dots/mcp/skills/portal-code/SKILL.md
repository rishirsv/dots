---
name: portal-code
description: Compose dependent operations, filtering and bounded batches using Portal’s isolated QuickJS runtime and typed broker capabilities.
version: 0.1.0
capabilities: ["files.read", "files.replace"]
---

# portal-code

Use code mode when multiple dependent tool operations benefit from loops, filtering or a compact returned summary. For a single read or edit, use the direct tool instead. Discover and describe the selected capabilities first; their schemas define the names and argument shapes. Load only references needed for the current program.

Submit plain JavaScript as an async function body. The guest namespace is `portal`. It contains only the requested capability functions. Workspace, account, grant and writer identity are injected by the broker, not selected by guest code. No Node globals, require, module loader, raw fetch, sockets, environment or credentials are exposed. Do not ask code mode to install packages or run nested code programs.

Choose `run_code_read` for inspection. It rejects all mutating, spawning, process-control and network capabilities even when those names are requested. For authorized mutation, use `run_code` with the current writer epoch and a stable parent idempotency key. Every side-effecting bridge call needs a stable `stepKey`. The broker derives each child identity from the parent operation and that key.

Use meaningful step keys such as `replace-title` and `run-swift-tests`, not array positions whose meaning can change between attempts. Reusing a step key with different arguments is a conflict. Parallel reads are bounded; writes remain coordinated by the broker. A command can continue after the JavaScript program returns and retain the mutation gate for its own lifetime.

Return compact evidence rather than entire repositories. Console capture, guest memory, source size, bridge calls and wall time are bounded. Larger returned values become artifacts. An infinite loop or excessive allocation terminates the program; it does not confer more authority or change the workspace.

A repeated parent key returns its existing operation and never automatically replays the program. After partial failure, inspect completed child receipts and live jobs. Successful earlier writes are not rolled back automatically. Cancellation revokes new bridge admission, requests descendant cancellation and records what remains uncertain. Continue only with an explicit new program informed by existing effects.

Report program completion separately from command or user-task completion. Preserve the distinction between a returned job, a completed test run and a qualified release.

Read the relevant reference below only when that topic applies.
- [runtime.md](references/runtime.md)
- [typed-api.md](references/typed-api.md)
- [partial-failure.md](references/partial-failure.md)
