# Tunnel upgrade on akira

Scope: one folder-management command, repository/branch discovery, tunnel_manage diagnostics and recovery, login startup, and broader protected file operations. Preserve the Mac's existing Tunnel and Codex sessions. No device-approval or OAuth redesign in this execution scope.

## 2026-10-09 — Discovery and isolation

- Confirmed akira is reachable through SSH alias studio-dev; macOS user reesh, with an active GUI login session.
- Confirmed Dots main is clean at 5854576611f554ea974d55bee37d08be6c0b2bff and matches origin/main.
- Created isolated worktree /Users/reesh/Code/dots-tunnel-upgrade on codex/tunnel-upgrade-akira. Main checkout remains untouched.
- Confirmed uv and Codex CLI are installed under ~/.local/bin; Codex version 0.162.0-alpha.17.2.
- No existing dots-tunnel deployment or credentials were found on akira. A host-specific upstream connection is needed to avoid competing with the Mac's active tunnel.
- Started read-only design criticism before implementation, as required by the Architect skill.

Implementation and test entries will be appended as work completes. This log distinguishes local protocol E2E from an actual ChatGPT/Pro connector run.

## Implementation — first pass

- Implemented one `runtime.py folders` command for list/preview/add/remove/discovery and atomic config apply with revisions. Remote changes remain under locally approved parents.
- Added `tunnel_manage` status, doctor, repository/branch discovery, folders, executor repair, and retained operation-result reads. Native reader failure is now unhealthy even when its process remains alive. Repair never replays commands.
- Added protected `manage_files` mkdir/write/move/delete/restore. Full-text writes retain exact CRLF and missing-final-newline content. Moves do not overwrite and reject cross-filesystem destinations. Recovery integrity and stale revisions remain checked.
- Changed overlapping mounts to use one shared mutation lock; mount reload serializes file operations.
- Added per-host macOS login supervision and a durable paused marker for an explicit stop.
- First remote unit/native/protocol suite started. Host-specific endpoint creation is pending: the existing local admin profile references an unset OPENAI_ADMIN_KEY. User authorized creating a key; account UI is being inspected.

### First test findings

- 48 tests ran: 44 passed, three expected inventory/descriptor assertion changes, one real cleanup failure.
- Native Codex can leave startup child processes writing its private config cache as the executor exits. The fix will own a private process group and terminate only that group before cleanup; no user Codex process will be touched.
- The account is signed into API Platform, but the ChatGPT Admin Portal reports Access required. Checking the organization Tunnel page for the supported creation path.

## Deployment preparation

- Created independent endpoint `dots-tunnel-akira` (`tunnel_6ac99192051c8191a38bdfadfc81577e`) in the existing organization/workspace after action-time confirmation. Created a distinct non-expiring runtime credential with Tunnels Read and Use only; transferred it privately to akira, never into Git or the worklog.
- Deployed reviewed source/skill outside writable mounts under `~/.local/share/dots-tunnel/releases/20261009/plugins/dots`. Private virtualenv, credentials, and state are outside approved project roots.
- Configured Code, T3Worktrees, and CodexWorktrees as mounts and approved parents. Created the missing Codex worktree parent. Claude worktrees inside Code are discovered through Git worktree metadata.
- Added one local `~/.local/bin/dots-tunnel` entrypoint; akira uses its own alias and endpoint. The Mac endpoint remains untouched.
- Existing 48-test suite passed after fixes. Added actual stdio MCP E2E including protected file lifecycle, hot reload, native fault injection, no command replay, retained results, failed repair, and malicious fsmonitor/out-of-scope discovery checks.

### Validation and environment isolation

- All 52 Tunnel unit/native/protocol/upgrade tests passed on akira (7.154 seconds). Skill Creator quick validation passed using an ephemeral PyYAML environment, without changing the production virtualenv.
- Initial full Dots gate failed in an unrelated Claude-sync test: akira zsh startup prepended the real Claude binary ahead of the test stub. A shell probe confirmed normal startup ignored the stub, while an empty ZDOTDIR used it. Retrying the gate with isolated ZDOTDIR and CLAUDE_CONFIG_DIR; no unrelated source changes.
- Handled the first-install case where `runtimes status` reports an unknown alias, allowing the locally configured independent endpoint to connect after exact-server preflight.

## Live service validation and startup fix

- Running akira endpoint is healthy/ready with correct org/workspace associations. Installed the RunAtLoad/KeepAlive LaunchAgent and confirmed loaded state.
- Injected failure into only akira tunnel-client: a ready connection with a new PID recovered in one second. Explicit stop stayed paused for seven seconds under supervision.
- The subsequent start exposed an intermittent preflight EOF race: the SDK could cancel queued messages when stdin closed, yielding no catalog with exit zero. Replaced EOF-fed preflight with an interactive handshake that keeps stdin open through tools/list.
- Restored readiness. Restarting only the login supervisor preserved the healthy tunnel-client PID. Actual logout/login was not performed because it would terminate other akira sessions.
- Full Dots integration gate passed with isolated ZDOTDIR and CLAUDE_CONFIG_DIR: 86 HTML tests, 51 repository tests, 30 Dots tests, package/marketplace/loader checks.
- Created separate ChatGPT connection Tunnel Akira. Its new tools appeared in this ongoing Codex chat without a restart, preserving the Mac connector. Live connector E2E begins next.

## Actual live connector E2E — same ongoing conversation

- Activated Tunnel Akira (`asdk_app_6ac992ecc4388191b23b720191538449`) separately from the original Mac Tunnel. All 11 tools appeared in this ongoing chat; no task restart. `get_workflow` and `doctor` identify akira.local. `worktrees` found the correct Dots/main checkout.
- Through the live connector: previewed/applied a temporary E2E mount, read an unknown canary, patched it, rejected a stale revision, created nested directories, wrote a project dotfile containing CRLF/no final newline, moved/deleted/restored it, and read back exact content.
- Native execution through the connector returned LIVE_BEFORE. A second command wrote one x and remained running. Fault injection killed only this deployment's native app-server child.
- `tunnel_manage doctor` reported unhealthy; `repair` returned ready and zero replayed commands. Prior completed output remained readable; interrupted output reported uncertain. A new command returned LIVE_AFTER.
- A second protected canary edit/read succeeded after repair in this same conversation. Independently verified remote bytes and counter x (not xx), plus unchanged MCP PID 9949. Removed the temporary alias through live folder management.
- This establishes live connector operation and same-conversation repair here. A separate GPT-6 Pro Web-model run was not invoked; no limited Pro turn was spent. Disposable fixture retained under ~/Code/TunnelE2E-20261009 for audit.

## Final checks

- Final Tunnel suite: 55 tests passed (including repeated real preflight handshakes, legacy-config authority isolation, and pause checked under the lifecycle lock).
- Reviewed legacy configuration: remote add cannot treat its own proposed mounts as approved parents. New local parent authority requires --approve-parent in the same folders command.
- Confirmed akira already has system sleep disabled on AC power (sleep 0). No power settings changed.
- Deployed final source byte-for-byte; exact installed server handshake/catalog preflight passed. Restarted only the login supervisor to pick up its pause-race correction, leaving the ready upstream runtime running.
- Original Mac endpoint remains running/ready at tunnel_6aaf1d4cea788191be388e6c96a647b9. No Mac repository or runtime source changes.

## Outcome

All five execution areas are implemented and deployed on akira. Tunnel Akira is connected in the existing ChatGPT account and remains ready under login supervision. Use `@Tunnel Akira` for remote work and `dots-tunnel folders` locally on akira for combined folder operations. Source is isolated on `codex/tunnel-upgrade-akira`; main, the original Mac endpoint, and local user sessions remain unchanged.

Evidence: 55 passing Tunnel tests; passing isolated full Dots gate; exact installed-source/preflight verification; live connector file and native execution E2E with same-conversation executor recovery; independent byte/PID/no-replay checks; supervisor failure/restart/pause checks. Actual logout/login and a separate GPT-6 Pro Web turn were not performed.

## Main merge and akira propagation — 2026-10-09

- Owner authorized merging to main, propagation on akira, and refreshing connections while preserving the Mac Tunnel and local sessions.
- Fetched origin: main remains clean at 5854576; upgrade branch contains the reviewed 0d5f755 commit. Akira doctor is ready with zero active operations. Original Mac connection is ready; recorded its unchanged runtime identity/session for comparison.
- Prepared Dots 0.2.249 in all three manifests so akira plugin installations can distinguish this release. Release validation runs before merge and push.
- Release checks passed: full Dots gate (86 HTML, 51 repository, 30 Dots tests and package/loader checks), all 55 Tunnel tests, and git diff --check.
