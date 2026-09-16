# Implementation decisions

| Decision | Reason and exact limitation |
|---|---|
| Portal naming throughout runtime, skills, manifests and CLI | Requested by owner. No claim of public name availability. |
| Independent implementation, not a full Commander fork | Actual attachment contains only public manifests/docs. No proprietary backend or undisclosed source is invented. |
| Node 22.16.0 and built-in SQLite | Available/exercised toolchain. WAL/FULL and transactional migrations implement local acceptance. SQLite API is experimental in this exact Node build. Target-Mac/runtime-security qualification remains required. |
| Strict project-owned input-schema subset | Keeps one input-validation/schema-generation source without requiring a live package download for the local core. Zod is used at the SDK adapter boundary. Many output contracts need stronger exact shapes. |
| Native C descriptor-relative filesystem | Node path-string prechecks alone are not race-resistant mutation primitives. Linux native tests pass; Mac filesystem variants still need testing. No arbitrary external-editor transaction guarantee. |
| Python separate document worker and pypdfium2 renderer | Provides first-class preserving transforms and real PDF page images with explicit staging. Production OS containment is separate from direct fixture tests. No runtime downloads or macro execution. |
| No executor fallback | Missing exact-binary sandbox probes must disable commands. A shell shortcut would violate the requested local boundary. |
| QuickJS host process plus bounded JSON bridge | Source is never evaluated by V8; each child is broker-authorized. The unavailable dependency prevents a runtime pass claim. |
| Known not-started work terminates on restart | Simpler truthful recovery than automatically resuming queued actions. Records `INTERRUPTED_BEFORE_DISPATCH`; this is a recorded departure from automatic-resume requirements. |
| Recursive tree operations require manifest hashes and absence | New destinations only, bounded recursion, source recheck and per-file recovery receipts. Partial multi-file effects are not rolled back or called atomic. |
| No unsigned auto-updater or guessed legacy migration | Safer to refuse unimplemented release/cutover paths than perform broad unverified edits. They remain mandatory work, not silently excluded scope. |
| No fabricated dependency lock, host trace or soak evidence | Network, Mac, provider and host limits are explicit. A short component stress run is not a 72-hour system soak. |
