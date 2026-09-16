# Open mandatory work and qualification

This list is part of the delivery, not an agreed reduction of the specification. The build must not be labelled implementation-complete or remote-release-qualified while these remain unresolved. The full renamed contract is BUILD-SPEC.md.

## Implementation still incomplete

1. **Transport supervision:** private stdio exists, but Portal does not own/supervise the actual Secure MCP Tunnel client or implement its readiness/recovery adapter. Private-tunnel configuration is stored only. The hosted device connection code is separate and implemented.
2. **Processes and Apple profile:** unrelated-process signal is explicitly unavailable; exact native process identity and safe signalling were not implemented. Keep-awake remains disabled, and there is no fully qualified predefined Apple-development/cache/service profile or signing/publication support.
3. **Filesystem responsiveness and worktree semantics:** direct native reads/writes are synchronous in the agent; genuinely blocking cloud/network-volume operations lack a separately killable file-worker boundary. Full shared Git-administrative-domain discovery and owner writer-transfer/quiescence recovery are incomplete. Direct `.git` writes remain denied.
4. **Public contracts:** input schemas are strict and generated; many output schemas still admit generic objects rather than fully typed exact per-method shapes. Full old-client fixtures, complete per-operation output conformance and supported host metadata publication need work. `tsconfig.sdk.json` must be run with actual dependency types; ambient declarations used offline are not that test.
5. **Durability and admission completion:** file/broker crash boundaries are exercised, but accepted-not-started operations terminate explicitly rather than automatically resume admission. Every spawn/control/relay acknowledgement crash window, global transport/worker quotas and disk-full evidence protection are not exhaustively implemented/proven. Some large snapshots/artifacts still allocate complete bounded inputs in memory.
6. **Retained access and cleanup:** normal closed/expired-workspace checks currently restrict job-output/artifact retrieval, even though operation receipts remain retrievable. Complete local scheduled retention, skill/task pin reference accounting, artifact/staging cleanup and all protected-outbox quota cases are incomplete.
7. **Device credential lifecycle:** relay generation-CAS rotation/status endpoints exist; the complete durable local two-phase rotation/acknowledgement utility is not supplied. Linking denial UX, polling rate-limit dimensions and interrupted-pairing cleanup need completion. Polling secret continuity is not persisted across CLI restart.
8. **Updates and legacy cutover:** per-user installation retains content-addressed runtimes and migrations back up, but signed update verification, complete rollback testing and automatic compatible-worker upgrade orchestration are incomplete. `migrate advisor` is an inventory-only dry-run; `--apply` explicitly refuses. There is no claimed archived-task import or authorized legacy removal.
9. **Parser and search hardening:** fixture Office/PDF/image transformations are real; physical-Mac parser containment and hard resource ceilings are not certified. Search implements bounded literal/regex/name/glob behavior and basic `.gitignore`, not a complete ripgrep-equivalent ignore engine. Exhaustive concurrent document-search fault ordering, slow-parser memory tests and all locale/format edge fixtures remain open.
10. **Operations UI and diagnostics:** a minimal owner dashboard and credential-free metadata diagnostics exist, but a full scoped approval-request UI, exhaustive health/metrics taxonomy and archive-form diagnostics export are not complete. No signed public release, approved host app or registered package exists.

## Environment-blocked checks

- Install the declared npm dependencies, resolve/review a transitive package lock, and run real third-party SDK type/runtime tests. Package networking was unavailable here.
- Select an actual supported native Codex binary, generate its exact schemas and run every sandbox/command/PTY/descendant negative probe on Apple Silicon. No executable was supplied or available.
- Run document operations through the real sandboxed broker on a physical Mac. Direct fixture transformations do not establish that route. The Linux container denied the required Landlock syscall, so the production parser route remained disabled here.
- Start PostgreSQL/relay and run E06 with real SDK/JOSE/WebSocket dependencies. Exercise Auth0 and two actual paired Macs separately. Neither Docker nor PostgreSQL was available here.
- Perform real ChatGPT import/mention/tools/image/artifact/multi-chat tests, private tunnel tests, Wi-Fi/sleep/wake/privacy/cloud-placeholder/launchd/Keychain checks, measured recovery latency and the full 72-hour mixed transport soak. No simulated passes are substituted.

## Format limitations, not silent conversions

Legacy XLS reads and macro-enabled edits are explicitly unavailable; XLSM read is fixture-covered without running macros. DOCX editing intentionally rejects unsupported multi-run complex replacements. PDF creation is text/paragraph oriented, not a browser-quality Markdown/CSS layout engine. Existing PDF sources are preserved through separate-output transformations. Some directory operations are bounded to 1,000 entries, 24 levels, 32 MiB per file and 100 MiB total; requesting more fails rather than expanding unboundedly.
