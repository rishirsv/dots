# Portal

Test procedures and acceptance record • Engineering build 0.1.0

Use this handbook to reproduce the recorded local tests and qualify the unfinished runtime, Mac and ChatGPT paths. It is an execution runbook, not a release certificate.

## Delivery status

| Area | Recorded status |
| --- | --- |
| Project build and native helper | Passed on Linux x64 |
| Node tests | 54 passed · 6 skipped · 0 failed |
| Document and image fixtures | 15 passed; direct transformation route |
| Core stress / output stress | 10,000 operations / 1 GiB generated |
| Full end-to-end implementation | Incomplete; see OPEN-GAPS.md |
| Mac / Codex / relay / host release | Not qualified or deployed |

The six skipped Node scenarios require unavailable third-party runtimes and services. A direct document fixture pass does not prove parser containment or that an image reached ChatGPT. A short stress run does not qualify the specified 72-hour mixed soak.

## How to record a result

Use PASS only when the stated expectation is observed and evidence is retained. Use FAIL for an implemented path that violates it, BLOCKED for a missing prerequisite or unfinished feature, and NOT RUN for an unattempted test. Never convert a skip, stub, screenshot of source, or absent service into PASS.

Owner / tester: ____________________   Run ID: ____________________
Build digest: ____________________   Date / timezone: ____________________
Machine / OS: ____________________   Review approver: ____________________

## Companion records

IMPLEMENTATION-REPORT.md describes built versus tested work. docs/PARITY.md maps all 57 capability entries. docs/OPEN-GAPS.md lists mandatory unfinished implementation. evidence/ holds actual logs and stress samples. docs/BUILD-SPEC.md retains the full renamed contract.

# 01  Establish a disposable environment

Setup and supply-chain gates

## SET-01 — Verify the handoff

**Procedure.** Extract the archive to a new directory. Read the implementation report and OPEN-GAPS.md. Verify the SHA-256 inventory before editing files. Record Node, TypeScript, Python, OS and architecture. Use generated fixtures, never a production repository for fault tests.

**Expected.** Archive inventory matches; no credentials, runtime state, dependencies or prebuilt native binary are assumed.

**Evidence.** Archive digest, inventory verification, evidence/environment.json and tester environment record.

```sh
cd portal-mcp
node scripts/verify-contents.mjs
node --version
npm --version
python3 --version
```

## SET-02 — Install and qualify dependencies

**Procedure.** On a network-enabled machine, resolve the exact declared packages with lifecycle scripts disabled. Review the resulting transitive lock and dependency licenses/security reports. Preserve the reviewed lock. Build with a C compiler and matching Node headers; then check actual external SDK types.

**Expected.** Build succeeds and the real SDK type check passes. A failure remains an implementation issue; ambient offline declarations are not a substitute.

**Evidence.** Install/build/type-check logs and reviewed package-lock.json digest.

```sh
npm install --ignore-scripts
npm run build
npx tsc -p tsconfig.sdk.json
npm run generate
node scripts/dependency-check.mjs
```

After preserving the reviewed lock, clean repeats use npm ci --ignore-scripts. CI and the relay Dockerfile intentionally refuse an absent lock. Do not silently upgrade runtime versions; re-run compatibility probes when versions change.

## SET-03 — Prepare document dependencies

**Procedure.** Run scripts/bootstrap-parser.sh explicitly as owner into a new virtual environment; inspect its arguments first. Configure Portal with that environment’s absolute Python executable. Do not install converters from a tool call.

**Expected.** Pinned packages import; production document availability still requires real OS containment.

**Evidence.** Venv package versions, configuration receipt and containment result from DOC-04.

# 02  Run the automated baseline

Separate successful tests from dependency-blocked scenarios

```sh
npm run build
npm test
python3 tests/python/document_fidelity.py
npm run generate
node scripts/release-check.mjs
```

| Suite | Evidence IDs / expectation |
| --- | --- |
| Unit tests | U01-U20: 20 passes in supplied environment |
| Local integration | I01-I28: 28 passes in supplied environment |
| Crash recovery | C01 at five boundaries; C02 external-change case: 6 passes |
| External runtime integration | E01-E06: 6 skips in supplied environment, not passes |
| Direct document / image fixtures | D01-D15: 15 passes |
| Metadata regeneration | 17 tools, 57 entries, 5 skills, 22 resources; stable hashes |

## AUTO-01 — Repeat the recorded suite

**Procedure.** Capture stdout, stderr, command, timestamps and exit code. Confirm the detailed TAP count, not only npm’s exit code. Repeat once from clean disposable state. Inspect each skipped reason.

**Expected.** No assertion failures; repeat results match their prerequisites. With missing dependencies, expect 54 passes and 6 explicit skips, not 60 successful tests.

**Evidence.** node-tests.tap and document-tests.log. The package evidence is historical; keep new run logs separately.

## AUTO-02 — Exercise the previously blocked tests

**Procedure.** Install JOSE, QuickJS, MCP SDK and related dependencies. Run npm test again. E06 additionally needs the isolated PostgreSQL setup on page 12. Debug actual failures; do not remove assertions or turn them into skips.

**Expected.** E01-E06 all execute and pass before their associated runtime paths can be qualified. No unexpected skips remain.

**Evidence.** Full TAP plus external dependency versions and database configuration with secrets removed.

## AUTO-03 — Check the release barrier

**Procedure.** Run npm run check:release. Inspect every listed blocker. The current engineering build should be rejected, even though core tests pass.

**Expected.** Current build exits nonzero with releaseQualified false. A future pass needs completed mandatory scope and genuine qualification evidence.

**Evidence.** Release-gate output, build-status.json and the signed review record.

# 03  Agent, grants and workspace ownership

Manual local checks through the same broker

```sh
export PORTAL_STATE="$(mktemp -d /tmp/portal-state.XXXXXX)"
ROOT="$(mktemp -d /tmp/portal-root.XXXXXX)"
cp -R fixtures/repositories/basic/. "$ROOT/"
node bin/portal.mjs start
node bin/portal.mjs grant add --root "$ROOT" \
  --alias fixture --access write
node bin/portal.mjs status
```

Keep PORTAL_STATE in the same shell for subsequent local commands. “portal call” below means node bin/portal.mjs call from the checkout, or the installed portal command. Replace device/workspace/epoch/hash/revision placeholders with actual returned values; they are not real access tickets.

## AG-01 — Open and inspect a workspace

**Procedure.** Call open_workspace with the deviceId returned by status, rootAlias fixture, access write and a unique stable idempotencyKey. Record workspaceId and writerEpoch. Read hello.txt. Repeat the identical open request with the same key.

**Expected.** Only the explicitly granted root is accessible; the repeated request returns the original operation/workspace rather than stealing a second writer.

**Evidence.** Open/read results, effective policy and operation IDs; I01/I10/I25 automate related invariants.

```sh
portal call open_workspace --json \
  '{"deviceId":"DEVICE","rootAlias":"fixture",
    "access":"write","idempotencyKey":"open-manual-001"}'
portal call read_file --json \
  '{"workspaceId":"WORKSPACE","path":"hello.txt",
    "startLine":1,"maxLines":20}'
```

## AG-02 — Check singleton and concurrent ownership

**Procedure.** Start the agent again. Open concurrent read workspaces and attempt a second write workspace for an overlapping parent/child root. Close only an idle workspace; leave another readable.

**Expected.** Second start reaches the existing daemon. Readers coexist. Overlapping writers receive WRITER_BUSY, not silent takeover. One workspace closure does not stop the agent.

**Evidence.** Process/socket identity, both readers’ results and denied-writer/closure receipts.

Revoke the fixture grant locally after the manual run. Do not revoke a live owner grant to perform this test. Full shared Git administrative-domain coordination and writer transfer remain open work.

# 04  Files, patches and recursive changes

Guarded writes and truthful partial outcomes

## FS-01 — Read evidence and reject stale writes

**Procedure.** Read CRLF, Unicode, empty and binary fixtures using explicit line or byte ranges. Record SHA values. Use describe for files.replace; change one exact occurrence with the source SHA, writerEpoch and a stable key. Repeat exactly; then reuse that key with different text and separately submit a stale SHA.

**Expected.** Bytes and conventions are truthful. Identical retry preserves the original receipt; changed arguments give IDEMPOTENCY_CONFLICT; stale hash leaves bytes unchanged.

**Evidence.** Before/after SHA, both receipts and file-byte comparison. Automated I01-I04 and I08.

Optional methods use invoke with the exact capabilityId and revision from describe. Pass validated domain fields in arguments; put workspaceId, writerEpoch and idempotencyKey at the outer level. A reference revision from another build must not be guessed.

```sh
portal call describe --json \
  '{"workspaceId":"WORKSPACE",
    "capabilityIds":["files.replace","files.manifest"]}'
```

## FS-02 — Apply and recover a focused patch

**Procedure.** On a fresh file, call apply_patch with an expectedSha256 map and Codex-style patch text. New destinations must map to null. Include add/update/move cases, then a colliding move and a stale source. Retry a successful patch using the exact same key.

**Expected.** Successful files have individual receipts. Conflicts preserve bytes. A multi-file failure identifies partial commits; no all-or-nothing claim is made. Delete operations require the matching local approval.

**Evidence.** I07 output and per-file hashes; use the five C01 crash cases for actual kill-boundary coverage.

## FS-03 — Copy, move and remove a bounded tree

**Procedure.** Create nested files plus an empty directory. Obtain files.manifest. Copy with recursive true, its SHA as expectedSourceSha256 and null expectedDestinationSha256. Change the source and retry using its old manifest. For removal request approval, approve only the exact fixture action locally, and submit an explicit new continuation.

**Expected.** Tree contents/empty directories are preserved. Changed tree, overlap, symlink and destination collision fail safely. Approved removal leaves protected per-file recovery receipts.

**Evidence.** I26-I28, manifest digest, output tree comparison, approval ID and recovery hashes.

Bounds are explicit: up to 1,000 tree entries, 24 levels, 32 MiB per file and 100 MiB per tree. Test larger requests as rejections, not silent truncations. Cross-root moves and full staged-upload fault coverage need separate acceptance.

# 05  Permission and crash boundaries

Negative checks are part of acceptance

## SEC-01 — Attempt path and policy escape

**Procedure.** Through direct calls and code callbacks, try ../ traversal, an absolute path, NUL, a symlink to an outside fixture, a symlinked parent, a hardlink, a FIFO and an agent-state location. Use only synthetic non-secret target files. Request an unauthorized capability or stale revision.

**Expected.** No outside bytes are read or modified. Errors distinguish denied scope, unknown capability, unavailable runtime and stale contract. No control-field or prototype-key injection succeeds.

**Evidence.** U01-U09, I06/I11/I15 and explicit unchanged outside-fixture digest.

## SEC-02 — Fence stale and revoked authority

**Procedure.** Use a stale writer epoch; then revoke the test grant locally and retry a read and queued mutation. Exercise a live mutating-job gate using I13. Attempt cross-workspace cancellation only on fixture jobs.

**Expected.** No new work is admitted after revocation. A live or unknown writer cannot be replaced solely because its lease timed out. One workspace cannot cancel another’s jobs.

**Evidence.** I02/I10-I14; record precise operation and denial codes. Actual process tests also require JOB-01.

```sh
node --test dist/tests/chaos/*.test.js
node --test dist/tests/integration/agent.test.js
```

The named suites create and clean up their own disposable fixtures. Use npm test for the full canonical baseline. Preserve separate evidence for an agent frontend restart and for actual job-owning worker survival.

## REC-01 — Reproduce durable crash recovery

**Procedure.** Run the provided chaos suite against its disposable children. It sends real SIGKILL before acceptance and after acceptance, intent, rename and result. In C02, change the destination before recovery. Inspect restored receipts and original keys.

**Expected.** No duplicate side effect. Known pre-dispatch interruption is explicit. Ambiguous outcomes remain unknown and are not replayed. Committed single-file output is recovered from matching evidence.

**Evidence.** C01/C02 TAP, restored journal and before/after hashes. Do not run arbitrary kill commands against user processes.

## REC-02 — Restart the agent frontend

**Procedure.** Run I25 or start a fixture daemon, make one guarded write, restart it, then query by the original operation ID/key. Start the frontend twice.

**Expected.** One daemon owns the journal, and the original receipt survives. This alone does not prove a running Codex child survives restart.

**Evidence.** I25 and JOB-02 for the separate actual-command recovery check.

# 06  Discovery and skills

Static import is separate from live local guidance

## SK-01 — Check compact discovery

**Procedure.** Call discover with kind capabilities and query search, then describe only search.start and search.read. Verify bounded output, permissions, availability and revisions. Invoke an exact revision; then deliberately use a different revision.

**Expected.** Catalogue metadata is discoverable without loading every schema or document parser. Stale contracts give CAPABILITY_CHANGED. Discovery itself never expands permissions.

**Evidence.** Generated manifests, responses and U06/I15 evidence.

```sh
portal call discover --json \
  '{"workspaceId":"WORKSPACE","kind":"skills",
    "query":"files"}'
portal call load_skill --json \
  '{"workspaceId":"WORKSPACE",
    "skillId":"builtin:portal-files"}'
```

## SK-02 — Verify the five public bundles

**Procedure.** Run npm run generate twice and compare manifests/SHA256SUMS.json. Hash each resource’s exact bytes and compare digest entries. Through the actual SDK, call skills/list, skills/get and resources/read. Add a private local skill and confirm it never appears in static import results.

**Expected.** Exactly five built-ins and 22 resources; consistent frontmatter and byte hashes. Private content stays private. SDK import checks remain blocked until E05 executes.

**Evidence.** I22, U10, E05, regenerated manifests and resource-byte comparisons.

## SK-03 — Load live local guidance and one reference

**Procedure.** Create a synthetic skill with a harmless script asset and a reference. Add only its root with portal skills add-root PATH --alias manual; refresh. Discover its namespaced ID, load its body and one reference, then alter it and request the old expectedHash. Try a reference traversal.

**Expected.** Provenance and content are exact; old hash gives SKILL_CHANGED. No script executes and traversal is denied. Local duplicates cannot shadow built-ins.

**Evidence.** I23 plus before/after hashes and proof the script’s marker file does not exist.

## SK-04 — Search and read repository instructions

**Procedure.** Use literal and regex search on fixture files; compare ignore/hidden behavior, bounded locations and continuation. Read instructions.read_for_path at different depths.

**Expected.** Results have exact source locations and independent durable pages. Instruction content is inert and ordered by path specificity.

**Evidence.** I19-I24. Full ripgrep ignore parity and task-pinned snapshot retention remain open.

# 07  DOCX and spreadsheet fidelity

Test preservation, not only visual plausibility

```sh
python3 tests/python/document_fidelity.py --generate \
  fixtures/documents
python3 tests/python/document_fidelity.py
```

D01-D15 invoke actual Python transformations directly. To qualify the product route, repeat the relevant operations through invoke in a document-enabled workspace after DOC-04 containment passes. Use only copied synthetic fixtures and separately named outputs.

## DOC-01 — Inspect and edit a rich DOCX

**Procedure.** Inspect rich.docx for paragraphs, table cells and stable locators. Read the selected element; edit one supported text or table-cell locator with expected source hash and expectedOutputSha256 null. Write edited.docx, never overwrite the source. Unzip input/output in the test harness and hash every untouched ZIP member. Try a replacement spanning unsupported split runs.

**Expected.** Edited content is correct; unrelated media, headers, footers, relationships and styles retain exact bytes. Source is unchanged. Unsupported complex edits reject rather than flatten.

**Evidence.** D01-D04, element locator, before/after ZIP-member manifest, changed-element receipt and a visual review in Word.

## DOC-02 — Preserve workbook semantics

**Procedure.** Inspect rich.xlsx and read an A1 range including a formula and its cached value. Write one value and one formula to a separate output. Compare untouched sheets/styles/relationships. Reopen it in a spreadsheet application without treating the writer as a calculation engine.

**Expected.** Formula and cached value are distinguished. No fabricated recalculation result appears. Untouched parts retain bytes. Stale source or destination hashes reject safely.

**Evidence.** D05-D07/D09, cell/type/formula records, ZIP-member comparisons and source/output digests.

## DOC-03 — Reject unsafe or unestablished formats

**Procedure.** Read the inert XLSM fixture without executing its payload. Request an XLSM edit and a legacy XLS read; then try corrupt, duplicate-part, traversal, expanded-size-bomb and external-entity archives.

**Expected.** Macro editing and legacy support remain unavailable; no silent conversion or VBA loss. Malformed/hostile inputs fail with bounded diagnostics and no outside writes or network fetch.

**Evidence.** D08/D14/D15, rejection results, unchanged source hashes and worker cleanup observations.

Known limits: current DOCX edits intentionally reject unsupported multi-run changes; legacy.xls is an unsupported-format marker, not a tested BIFF workbook. Do not label these cases full format parity.

# 08  PDF, images and parser containment

An image result must contain actual image bytes

## DOC-04 — Qualify the parser boundary

**Procedure.** On Apple Silicon, configure the pinned parser environment and invoke a supported document operation through Portal. Use an outside sentinel file, a local-only test listener and deliberately slow/large synthetic input to test read, network, process, memory and timeout boundaries. Inspect parser staging and cleanup after cancellation.

**Expected.** Only staged authorized inputs are available; no outside sentinel, remote template, macro or network resource is accessed. Deadlines terminate the work, not only the waiting promise.

**Evidence.** OS/version/profile, negative probe results and process teardown. BLOCKED in supplied Linux environment: Landlock was denied. Mac hardening remains unfinished qualification.

## DOC-05 — Extract, render and transform PDF pages

**Procedure.** Inspect rich.pdf, read a bounded one-based page range, then render page 1. Reorder selected pages or merge declared source snapshots into a separate output. Inspect extracted text order and actual page images. Try encrypted.pdf and a stale source hash.

**Expected.** Correct page counts/text/order and real PNG bytes. The original stays byte-identical. Encrypted/unsupported inputs reject clearly. No automatic OCR or hidden browser/network fetch.

**Evidence.** D10-D12; source/output SHA, rendered image and page-order comparison.

## IMG-01 — Inspect and display supported images

**Procedure.** Inspect PNG/JPEG/WebP/GIF fixtures. Request a deterministic crop and bounded resize twice. Compare dimensions, MIME, source hash and rendition digest. For GIF, check that first-frame handling is explicit. Repeat through view_image in an actual MCP client.

**Expected.** Original bytes are preserved; rendition bounds are enforced. MCP response includes image content, not merely a local path or base64 prose.

**Evidence.** D13 plus actual SDK/host image result. Fixture transformation alone cannot pass host display.

## ART-01 — Retrieve an authorized artifact

**Procedure.** Retrieve the generated document artifact in bounded pages using two independent cursors. Retry the same cursor and attempt a different account/workspace. Attempt retrieval after workspace closure and payload expiry.

**Expected.** Same retained range is repeatable; unauthorized access is rejected. Expiry preserves the known outcome. Closed-workspace artifact/output access is a known implementation gap and must be recorded BLOCKED or FAIL, not ignored.

**Evidence.** Artifact digest, byte reconstruction and authorization/retention results.

The relay does not create a downloadable ChatGPT attachment merely by returning a Mac path. HOST-03 must establish the actual supported presentation separately.

# 09  Codex commands and durable jobs

Requires the exact native binary and a real sandbox

```sh
portal executor qualify --binary /absolute/native/codex
PORTAL_CODEX_BINARY=/absolute/native/codex npm run test:mac
```

## JOB-01 — Qualify the executor before commands

**Procedure.** Record binary hash/version, generated JSON/TS schema hash and allowed RPC trace. Run argv/cwd, restricted read/write, disabled network, stdin/EOF, PTY/resize and descendant teardown probes. Repeat with an incompatible or changed binary.

**Expected.** All probes pass before terminal is enabled. Missing restricted-root support gives EXECUTOR_UPGRADE_REQUIRED. No danger-full-access, raw process/spawn, thread/shellCommand or inference fallback.

**Evidence.** compatibility evidence, real negative probes and permitted RPC trace. U14-U17 alone are only policy tests.

## JOB-02 — Run, poll and recover a real command

**Procedure.** With an explicit terminal-enabled grant, submit argv ["/bin/sh","-c","printf started; sleep 5; exit 7"], cwd ".", tty false, timeoutMs 30000 and yieldMs 100. Retain job/operation IDs. Read output from two cursors; restart the agent while a longer fixture command is running and retrieve its result.

**Expected.** Admission returns a durable job before completion. Exit 7 is a command result, not a transport failure. Readers do not consume each other’s offsets. Restart reattaches without rerunning the command.

**Evidence.** Actual output/exit state, worker boot/start identity, original key and sentinel side-effect count.

## JOB-03 — Exercise genuine PTY interaction

**Procedure.** Start a fixture program that checks isatty and terminal size with tty true, rows 24, cols 80. Send input and EOF via write_stdin. Resize through terminal.resize using its discovered schema. Cancel a separate long-running fixture and inspect all owned descendants.

**Expected.** Actual TTY and changed dimensions are observed. Pipe stdout/stderr and PTY merged output are represented truthfully. Cancellation distinguishes requested from confirmed termination.

**Evidence.** Interactive transcript, dimension output, EOF/exit result and full descendant teardown record.

Test keep-awake and the complete Apple-development profile only after their unfinished implementation is addressed. No signing, uploads or publishing credentials are authorized by this runbook. A successful build here must not imply an arbitrary Mac shell has been safely contained.

# 10  Sandboxed code composition

Run the actual QuickJS worker, not a fixture substitute

## CODE-01 — Compose read-only operations

**Procedure.** After E02 executes, submit run_code_read with capabilityIds ["files.read"] and the async body below. Try process, require, raw fetch, dynamic import, undeclared methods and an explicit files.write capability in read mode.

**Expected.** Authorized read succeeds; host globals and unauthorized/mutating capabilities are absent or denied by the broker. Requested capabilities cannot expand a grant.

**Evidence.** E02/E03, actual guest results and rejected callback traces; U20 alone is an injected-handler policy test.

```js
const file = await portal.files.read({
  path: "hello.txt", startLine: 1, maxLines: 20
});
return { text: file.text, sha256: file.sha256 };
```

## CODE-02 — Preserve partial effects and stable step keys

**Procedure.** Run mutation code with explicit parent key, writer epoch and files.read/files.replace capabilities. Read a fixture, perform one replacement with stepKey "first-edit", then throw deliberately. Query the parent and children. Submit the identical parent again. Reuse the same step key with different arguments in another explicit test.

**Expected.** First edit remains accounted for; response indicates partial effects and retained child receipts. Identical parent does not rerun. Changed step arguments produce an idempotency conflict.

**Evidence.** E04 plus child operation IDs, source hashes and exact before/after physical-write count.

## CODE-03 — Enforce limits and cancellation

**Procedure.** Run infinite-loop, allocation-flood, recursion, malformed syntax, cyclic-result and many-promise fixtures in a disposable workspace. Cancel during an in-flight callback; test parallel reads and serialized short mutations.

**Expected.** Heap/stack/wall/bridge limits are bounded; failed workers are cleaned up. Cancellation revokes further bridge admission and reports live children. A normal returned program does not pretend a started command finished.

**Evidence.** Runtime resource samples, timeout/limit codes, disposed worker/handle checks and child lifecycle receipts.

Default limits include 64 KiB source, 32 MiB guest heap, 60 seconds wall time, 100 bridge calls, four concurrent reads, 16 KiB console and 64 KiB inline result. Actual interpreter tests were skipped in the supplied environment. Exhaustive failure/cancellation cases remain required; do not substitute node:vm or unrestricted Node evaluation.

# 11  Owned relay and account isolation

Real PostgreSQL, OAuth, WebSockets and MCP must all execute

```sh
docker compose -f deploy/compose.test.yml up -d --wait
PORTAL_RELAY_TEST=1 \
TEST_DATABASE_URL=\
'postgresql://portal_test:portal-fixture-password@127.0.0.1:55432/portal_test' \
npm run test:relay
```

The fixture password belongs only to this disposable loopback database. E06 uses two account/device application instances, not two physical Macs. It creates and drops its own unique PostgreSQL schema. Do not point it at production. The loopback test issuer refuses production startup.

## REL-01 — Pair and route two isolated accounts

**Procedure.** Run E01 and E06 without skips. Pair each fixture device through the hashed-secret/code/fingerprint flow; read its identity file over actual Streamable HTTP MCP. Attempt cross-account status, operation lookup and device routing. Try wrong issuer/audience/signature/expiry/scope tokens.

**Expected.** Authorized round trips work. Cross-account routing and invalid tokens fail before device execution. Device keys do not authorize owner/MCP APIs. Repeated pairing status never duplicates devices.

**Evidence.** E01/E06 TAP, redacted request/route trace, database row ownership and actual device results.

## REL-02 — Recover dispatch and revoke authority

**Procedure.** Run a stable-key write, restart the relay and recover its cached receipt with the Mac offline. Drop/duplicate notifications, replace the connection epoch and test a database outage. Revoke a fixture device and then reconnect it with its old key.

**Expected.** No duplicate write. Cached data is labelled stale, not live. Old epochs and revoked credentials are rejected. Database failure never means execute anyway. Unstarted expired dispatches do not execute hours later.

**Evidence.** Local/relay IDs, outbox/ack evidence, one physical effect, offline cache provenance and revocation timing.

## REL-03 — Qualify a real provider and owner UI

**Procedure.** Use docs/AUTH0.md with owner-controlled credentials, HTTPS and exact host-provided callbacks. Exercise authorization-code PKCE, secure owner cookie, exact-origin CSRF checks, pairing approval and irreversible revocation on two actual Macs.

**Expected.** Provider flow, scopes and account/device binding work without exposing tokens to tools or logs. Reject arbitrary return URLs and test-only issuer configuration in production.

**Evidence.** Tenant/config revision, sanitized browser/HTTP trace and two actual Mac bindings. This was not exercised in the supplied build.

# 12  Physical Mac lifecycle

Manual checks that Linux fixtures cannot replace

## MAC-01 — Install, restart and retain data

**Procedure.** On Apple Silicon, record macOS, Node, native helper, Codex and Xcode versions. Use the per-user installer in a clean test account. Inspect the LaunchAgent plist, explicitly start/bootstrap it, then log out/in. Make a fixture write, restart, export a backup and test default uninstall.

**Expected.** One per-user agent, protected state/socket permissions and no root requirement. Receipts survive restart. Default uninstall preserves results and unrelated user content.

**Evidence.** Installation/log-in traces, permissions, journal integrity and backup/recovery digest. Plist creation alone is not launchd acceptance.

## MAC-02 — Separate sleep and network recovery

**Procedure.** Start a qualified long fixture command; disconnect Wi-Fi, restore it, then perform real sleep/wake. Repeat agent/frontend/tunnel loss separately from worker loss. After each event, inspect connection epoch, acknowledged heartbeat, job identity, output and one new read.

**Expected.** Transport loss does not falsely mark a potentially running job failed or complete. Healthy surviving workers are reconciled without replay. Worker loss is interrupted/unknown as supported by evidence. New admission revalidates grants/deadlines on wake.

**Evidence.** Wall/monotonic timing, sleep/wake record, reconnect latency, journal transitions and command sentinel count.

## MAC-03 — Exercise privacy and slow files

**Procedure.** Use an intentionally privacy-denied fixture location and a controlled cloud-placeholder or slow mount. Cancel operations and check agent responsiveness while the file worker is blocked. Never grant Full Disk Access merely to make a negative test pass.

**Expected.** Actionable denial/timeout and responsive control plane. Current synchronous direct-filesystem handling lacks a fully killable slow-I/O boundary; record that known gap until fixed.

**Evidence.** Latency samples, denied paths with sensitive names redacted and cleanup state.

## MAC-04 — Prove Swift and Xcode scope

**Procedure.** Run a disposable Swift package test and an unsigned simulator build on a synthetic project using explicit toolchain/cache/service grants. Verify source roots outside the grant remain inaccessible. Inspect descendant teardown after cancellation.

**Expected.** Build/test output is real and retained, with no signing, publishing or credential access. Added Apple permissions are displayed rather than silently widening the grant.

**Evidence.** Exact argv, grant additions, build logs, sandbox negatives and process-tree record. Full predefined Apple profile remains unfinished.

Physical sleep, denied privacy access, cloud placeholders, actual PTY, reboot identity and Keychain behavior require this machine record. They cannot be inferred from Linux state-machine tests or an open WebSocket.

# 13  Actual ChatGPT acceptance

Capture tool/result traces from the intended account and model

## HOST-01 — Connect, inspect and edit

**Procedure.** Attach the owner-provisioned Portal app or private tunnel on the target account. Discover the explicit device/workspace. Read a fixture, create a new file, apply a hash-guarded patch and verify its bytes. Load a local specialist skill plus one reference; invoke an optional capability without rescanning native tools.

**Expected.** The actual conversation receives correct content, provenance and receipts. No advisory session, second model or hidden finish ceremony is required.

**Evidence.** Redacted host tool-call/result trace for spec scenarios 1, 2, 5 and 6. Publication/host availability is not presumed.

## HOST-02 — Continue jobs and composed work

**Procedure.** Start a command that outlives the first response; retrieve output later. Exercise actual PTY input/resize. Run read-only code mode and a mutation program. Drop a response, recover the original key and verify that the edit was not repeated.

**Expected.** Correct durable IDs and terminal states are visible in the host; results remain retrievable. Read-only code cannot mutate and partial effects remain explicit.

**Evidence.** Host trace plus device evidence for scenarios 3, 4, 7 and 8.

## HOST-03 — Inspect and retrieve documents

**Procedure.** Inspect and edit a rich DOCX/XLSX/PDF fixture through Portal. Request a real image rendering and retrieve the resulting file using the host’s supported resource/artifact presentation. Open the returned file and compare its digest.

**Expected.** Actual image content is visible and actual file bytes are accessible. A local Mac path or a successful server-side save is not a host pass.

**Evidence.** Host screenshot, tool content type, accessible artifact and reconstructed digest for scenario 9.

## HOST-04 — Separate chats and devices

**Procedure.** Use two chats and two explicitly selected paired Macs. Read the same output cursor in both chats, attempt an overlapping second writer, close one workspace and verify the other still works. Reconnect after sleep/network loss; revoke one fixture device.

**Expected.** No shared mutable read cursor, global current-device routing or silent writer takeover. Closure is scoped; revoked access fails. Do not claim cryptographic chat identity where MCP supplies none.

**Evidence.** Two host traces and device/epoch mappings for scenarios 10-14.

## HOST-05 — Confirm no hidden inference

**Procedure.** Capture the actual permitted Codex RPC trace during the preceding scenarios. Inspect outbound destinations and supplied runtime dependencies without logging tokens or content unnecessarily.

**Expected.** No turn/start, review/start, model selection, inference API request or hidden conversation automation originates from Portal.

**Evidence.** Sanitized live trace for scenario 15; U14 source/policy tests are supporting evidence, not a live trace.

# 14  Stress, release gates and sign-off

Keep narrow stress results separate from full reliability claims

```sh
node dist/tests/soak/run.js --operations 10000 \
  --output evidence/soak-core-new.json
node dist/tests/soak/spool-stress.js
```

## SOAK-01 — Reproduce short component stress

**Procedure.** Run the provided core workload and spool stress. Compare operation counts, duplicate IDs, baseline/peak/time-series RSS, retained bytes and exact omitted offsets. Confirm two readers can retrieve the same retained page.

**Expected.** 10,000 core invocations preserve 2,500 stable-key duplicates. The spool handles 1 GiB and reports the evicted range within its configured 4 MiB tail. No claim about command cancellation or long-term stability follows.

**Evidence.** JSON samples, TAP support and command/exit record. Supplied evidence contains the recorded successful runs.

## SOAK-02 — Qualify the full release workload

**Procedure.** After the unfinished runtime paths are fixed, run a 72-hour mixed file/document/code/command/relay workload on the target Mac. Include at least 10,000 operations, 100 transport interruptions and repeated physical sleep/wake. Sample memory, handles, processes, queues and disk throughout.

**Expected.** No continuing unbounded growth after warm-up; every accepted effect has active/terminal/unknown evidence; controlled recovery p95 and local responsiveness meet the spec. The current core-only soak script does not implement this complete mixed harness.

**Evidence.** Full 72-hour time series, interruption schedule, crash/unknown reconciliation and measured percentile methodology.

## Release approval

| Gate | Result / evidence reference |
| --- | --- |
| Mandatory implementation gaps closed | ____________________________ |
| Real external SDK / Codex / parser qualification | ____________________________ |
| Two-account relay and real-provider acceptance | ____________________________ |
| Physical Mac and actual host scenarios | ____________________________ |
| 72-hour mixed soak and retention / upgrade checks | ____________________________ |
| No unresolved critical security or durability failure | ____________________________ |

Overall result:  PASS / FAIL / BLOCKED / NOT RUN
Critical defect IDs: ______________________________________________
Tester / date: ____________________  Reviewer / date: ____________________

For each defect record: case ID; expected versus observed; exact build and environment; operation/job IDs; minimal fixture reproduction; sanitized evidence; owner; disposition; and retest result. Keep approval secrets, OAuth tokens and user content out of support artifacts by default.

