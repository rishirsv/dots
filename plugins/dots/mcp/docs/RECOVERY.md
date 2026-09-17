# Recovery and retained outcomes

## First action after a lost response

Keep the original workspace, operation ID and idempotency key. Call `get_operation` with **either** the operation ID **or** workspace ID plus the original key. Do not submit both forms. A different payload under the same key is an idempotency conflict, not another attempt. Reusing a completed key returns the stored result.

## What the exercised crash tests establish

| Boundary | Actual fixture result | Operator action |
|---|---|---|
| Before acceptance commit | No durable operation/effect | Retry the same key. |
| After acceptance, before dispatch intent | `INTERRUPTED_BEFORE_DISPATCH`, known not-started in this implementation | Inspect the original result; explicit new request is allowed after acknowledging no effect. Automatic resume is not implemented. |
| After dispatch intent, before conclusive file evidence | `OUTCOME_UNKNOWN` | Inspect receipts and current bytes. Do not blindly replay. |
| After one staged file rename | Matching after-hash reconciles the committed file state | Return recovered receipt; do not write again. This is not a proof of universal exactly-once execution. |
| After result commit | Original persisted result | Return the same operation. |
| Destination externally changed after a crash | Unknown/conflict; external bytes retained | Resolve the concurrent edit explicitly. |

The suite uses actual OS SIGKILL at those file/broker boundaries. It does not prove Codex process spawn recovery, live relay acknowledgement recovery, disk-full behavior, Mac reboot or physical descendant teardown. Those have separate procedures.

## Commands and output

A command worker owns its Codex app-server connection. Agent/frontend restart should reattach using a private worker socket, boot identity and handshake rather than reuse a connection-scoped process ID on a new executor. That source path is not exercised without a qualified Codex binary. Worker control loss keeps uncertainty and must not authorize writer takeover. Hard job deadlines and supervision leases are separate from the response-yield timeout.

Output cursors are absolute per-job byte positions. Two readers can request the same cursor independently. Eviction reports missing ranges and retains monotonic offsets. The 1 GiB spool fixture verifies those component properties; it is not a cancellation or real shell-execution result.

## Workspaces and revocation

`close_workspace` defaults to refusing active jobs. Drain/cancel returns progress until closure; only its workspace is affected. Local grant/device revocation blocks new admission and requests owned cancellation. Cancellation intent is not confirmed process death. Never override a live/unknown writer merely because its lease timer elapsed. The current implementation does not provide a full owner-driven writer-transfer/recovery utility.

`get_operation` can retrieve account-bound receipts after normal closure. Job output/artifact access after a closed or expired workspace is still restricted by the current context checks; that retained-result access gap is not a data-erasure claim. Recover needed result data before closing until the gap is resolved.

## Backup and retention

Back up SQLite with the CLI rather than copying an active WAL database file casually. Keep data encrypted and owner-only. A backup can contain source/document excerpts and command output. Do not prune an unacknowledged result outbox to make health look green. Expired payload tombstones prevent key reuse from triggering new execution; tests cover this logic. Periodic cleanup and every disk-exhaustion crash window still need completion and qualification.
