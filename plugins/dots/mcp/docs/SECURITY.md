# Actual security boundary and outstanding risks

The owner trusts the installed agent, native helper, runtime and configured toolchain. The relay/client is authorized only within local grants; a compromised authorized client can still misuse that delegated authority. Repository files, documents, terminal output and skills are data, not policy. No loaded instruction can broaden a grant or approve its own action.

## Implemented boundaries

- Owner-only IPC separates configuration/approval methods from remote front-door tools. An OS lock owns the SQLite device installation.
- Every broker invocation validates strict bounded input, authenticated account/device/workspace, grant revision/expiry, capability family and relevant OAuth scope. Write epochs and overlapping-root leases coordinate writes. A command holds its domain gate for its lifetime.
- Native filesystem access uses directory descriptors and no-follow opens. Root identities are pinned; traversal, root mutations, protected state/credential overlaps, symlinks and special-file reads are rejected. File changes use explicit hash/absence preconditions, flushed stages and journaled receipts. External editors are not participants in a global filesystem transaction.
- Terminal's only execution backend is a hash-qualified Codex app-server. No unrestricted RPC fallback, shell-argument joining, `turn/start`, review/model selection, arbitrary thread RPC, or hidden inference client exists.
- Model code runs in QuickJS/WASM, not Node eval or node:vm. The bridge selects explicit methods, bounds calls/data/concurrency, strips context control from guest arguments and checks every child in the broker. A read-mode parent injects read-only child authority independently of the guest.
- Document sources are staged into private worker directories. Parsers reject archive traversal, duplicate ZIP parts, expansion abuse, entities and unsupported edits. Linux Landlock/seccomp and macOS sandbox-exec wrapper source is provided; actual containment qualification is separate from fixture transformation tests.
- Public HTTPS fetch pins resolved public addresses at each redirect, denies private/mixed targets and credentials, requests identity encoding, and caps total elapsed time and bytes. Private-network profiles are not implemented.
- OAuth uses a configured issuer/JWKS/audience and validates tokens per request. Pairing device keys are transport-scoped, and relay SQL queries are account-bound.

## What must not be claimed

The native helper was compiled/tested on Linux, not macOS case-sensitive/normalization variants. Main-process synchronous filesystem work still lacks fully killable per-operation slow-volume isolation. macOS parser hard memory/process ceilings and credential/service-read boundaries are not fully qualified. A present sandbox binary is not itself a containment test.

The exact Codex sandbox protocol is intentionally unqualified in the distributed compatibility record. Its full generated schemas and real negative probes must establish what a selected binary enforces. Environment restrictions alone never sandbox arbitrary commands. Apple toolchain cache/signing/Simulator behavior is not certified.

No perfect secret-output redaction is promised. Legitimate command output may contain secrets; content files and backups must remain access-controlled. The hosted operator can read data entrusted to relay storage; TLS is not end-to-end content encryption. No telemetry exporter or automatic external diagnostics upload is present.

Unrelated-process signalling, signed updater/rollback, all credential-rotation/recovery paths, complete periodic retention/backpressure, complete skill pin accounting, and every fault-injection boundary remain open as detailed in OPEN-GAPS.md. Release is fail-closed at those gates rather than certified by passing local fixture tests.
