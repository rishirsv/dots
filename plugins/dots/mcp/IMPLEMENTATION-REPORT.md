# Portal — Implementation report

Version: 0.1.0 • private engineering handoff • specification baseline September 14, 2026

## Outcome

**A substantial source implementation and tested local core are delivered. The complete requested end-to-end product is not finished.** Implementation-complete: **no**. Remote-release-qualified: **no**. Production-deployed: **no**. Connected and accepted in the intended ChatGPT conversation: **not tested**.

The renamed acceptance contract is `docs/BUILD-SPEC.md`. The authoritative remaining mandatory work is `docs/OPEN-GAPS.md`; it is not an agreed reduction of the user's request. `docs/PARITY.md` classifies every registry entry and its precise evidence. Unsupported dependencies and scope are rejected, not substituted with an unrestricted shell, hidden model or simulated transport.

## What is built

The source contains one shared operation broker; 17 stable front-door tools; 57 capability catalogue entries; strict bounded input schemas; generated metadata and focused declarations; five Portal skills and 22 hashed public resources; owner-only local IPC; SQLite WAL/FULL migrations; grants, overlapping writer coordination, idempotent acceptance, file journals, approvals, task reports, durable search and output cursors.

The native descriptor-relative filesystem helper supports guarded file operations and bounded recursive manifests/copy/move/remove. Guarded writes are staged and flushed, and recover from the tested crash boundaries. Recursive and multi-file edits are not falsely called atomic transactions.

Additional real source modules implement isolated QuickJS code workers, exact-version-gated Codex command workers, document/image workers, a PostgreSQL relay with OAuth resource-server validation, device WebSockets/outboxes/connection fencing, pairing, owner OIDC pages, deployment templates and Mac helper/installer source. These runtime paths require further dependency installation, debugging and qualification; source presence is not proof that they currently work end to end.

## Actual validation

| Check | Recorded result | Boundary |
|---|---|---|
| Native helper + project TypeScript | Build exit 0 | Linux x64 / Node 22.16.0 / TS 5.8.3. Offline ambient declarations are not real external SDK type validation. |
| Node tests | 59 passed; 1 skipped; 0 failed | The PostgreSQL relay exercise is skipped without its isolated database environment. |
| Python document/image fixtures | 15 passed | Actual DOCX/XLSX/PDF/image transforms and negative archives. Direct parser process only; not the OS-contained broker/host route. |
| Core stress | 10,000 invocations, including 2,500 duplicate submissions | 8.88-second local broker workload, not a 72-hour or remote reliability test. |
| Output stress | 1 GiB produced; 4 MiB retained with explicit omitted offsets | Actual bounded spool, not an actual Codex command or cancellation proof. |
| Physical Mac, Xcode, sleep/wake, Keychain | Not exercised | No Mac in the execution environment. |
| PostgreSQL / real Auth0 / real ChatGPT | Not exercised | No installed services/SDKs/credentials or host connection. |

Node logs: `evidence/node-tests.tap`. Document logs: `evidence/document-tests.log`. Machine-readable environment, short stress samples and gate status: `evidence/`. No skipped test is counted as a pass.

The core stress baseline/peak RSS were 40,255,488 / 145,883,136 bytes, sampled 100 times. The spool stress baseline/peak RSS were 41,934,848 / 70,410,240 bytes, sampled 32 times. These short observations do not prove a stable long-term memory trend. The spool retained offsets 1,069,547,520 through 1,073,741,824 after 1,073,741,824 bytes were generated.

## Confirmed local recovery behavior

The crash suite actually kills a disposable process before acceptance, after acceptance, after mutation intent, after a file rename and after result commit. Uncertain side effects are not replayed. A known never-dispatched accepted operation currently becomes `INTERRUPTED_BEFORE_DISPATCH` rather than automatically resuming; this is a recorded contract departure. Single-file post-rename recovery uses before/after evidence. External byte changes during reconciliation remain unknown. I25 restarts a real local daemon and retains its original write receipt.

These tests do not prove every arbitrary process-spawn window, surviving Codex worker reattachment, database-outage relay delivery, remote acknowledgement or machine reboot. Unknown mutating workers retain the writer gate; lease expiry is not evidence of quiescence. Closed workspace operation receipts remain readable, but complete retained-output/artifact access after closure still needs work.

## Known unfinished work

Important internal gaps include the Portal-owned private tunnel supervisor; exact-identity unrelated-process signalling; complete Apple-development/keep-awake profile; killable slow-filesystem workers; shared Git administrative-domain and writer-transfer semantics; exact output schemas and real third-party type conformance; full quotas/retention/closed-context access; local two-phase credential rotation; signed updates/rollback; legacy import/apply migration; and the complete owner approval/diagnostics/health surface. See OPEN-GAPS.md for precise boundaries.

Separate environment blockers include a native compatible Codex binary, dependency installation and reviewed transitive lock, real QuickJS/MCP/JOSE/WS/PG execution, physical-Mac parser containment, two actual Macs, actual host import/presentation, real Auth0 and the required 72-hour mixed soak. Solving credentials alone does not resolve the unfinished implementation.

## Packaging and supply chain

The repository contains source, native helper source, fixtures, tests, generated manifests, deployment files and this report. Generated JavaScript, `node_modules`, prebuilt native executables, Python environments, font files and user credentials are not committed. Exact top-level dependencies and a complete `package-lock.json` are checked in. A clean install, SDK typecheck and dependency resolution check passed with Node 22.16.0; the per-user installer copies the locally built runtime and locked dependencies into its content-addressed release. CI and Docker require the lockfile.

`UPSTREAM.md` records actual uploaded-file digests. The supplied Commander archive contains public manifests/docs, not the local server or proprietary relay. No Commander source/asset was copied and no Commander production infrastructure is used. The new source is private and unlicensed for public distribution; dependency notices remain attached to their respective packages when installed.

## Architecture that matches the source

```text
MCP stdio client -> thin frontend -> owner-only Unix tool socket
                                                |
HTTPS MCP -> OAuth/PG relay -> device WebSocket -> OperationBroker
                                                |
                     SQLite grants/epochs/receipts/tasks/output
                                                |
        rooted FS | bounded search | document worker | code worker
                                                     |
                          broker callbacks -> Codex job-owning worker
```

CLI grants/configuration use a separate owner administrative socket. Remote calls cannot change local policy. Code mode cannot choose account/workspace/root; each callback revalidates current policy. Running mutating command jobs hold their conflict gate. The relay is not an execution or inference service.

## No-inference evidence

There is no OpenAI model-inference client or model-selection flow in the runtime. U14 enforces the narrow execution/discovery RPC allowlist and rejects `turn/start`, `review/start`, thread execution and raw unsandboxed process spawn. This establishes source/policy behavior, not a live permitted-RPC transcript: no Codex binary was available. The physical qualification procedure must capture that real trace before release.

## Operating instructions and handoff

Start with `README.md`, then `docs/INSTALLATION.md`. Use only disposable fixtures until the security/runtime gates pass. `docs/TEST-PROCEDURES.md` and its Word edition provide exact suite commands, expected results, manual Mac/host/relay procedures, evidence fields and a sign-off record. Deployment, Auth0, private tunnel, recovery, threat boundaries and decisions are separate runbooks.

The provided `check:release` command is intentionally red for this engineering handoff. Do not suppress it, edit compatibility files to invent a successful probe, or call this an end-to-end accepted release on the strength of the local tests.
