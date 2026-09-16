# Installation and local ownership

## State and authority

Default Mac state: `~/Library/Application Support/Portal`; Linux fixture state: `~/.local/share/portal`. Set `PORTAL_STATE` before starting a disposable installation to keep it separate from any real state. Owner-only runtime socket paths are derived from the state path under the system temporary directory, with directory mode 0700 and socket/secret mode 0600.

The agent acquires a native OS lock before journal ownership and stale-socket removal. Local MCP clients connect to `tools.sock` with a frontend secret. The separate `admin.sock` supports owner-only grants, configuration, approvals and lifecycle actions. The remote front door cannot call those admin methods. An actor/workspace handle is not a trustworthy per-chat identity; same-owner chats intentionally sharing a handle share its authority.

## Build and install

Follow the connected bootstrap in README, preserve a reviewed lock, build native helpers on the target machine, and run the automated tests. `portal install` copies a version/content-addressed runtime into the per-user state directory and switches its `current` symlink. The launcher pins the Node executable used at installation. Keep that Node installation available.

`--start-at-login` writes `~/Library/LaunchAgents/local.portal.agent.plist`. To load it during the current login after inspecting it:

```sh
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/local.portal.agent.plist"
portal status
```

Starting manually and bootstrapping simultaneously is unnecessary; the second daemon must fail its ownership lock. Installation/launchd behavior is implemented but untested on a physical Mac in this build.

## Root grants

A workspace has one explicit granted root. Create distinct workspaces for unrelated roots. File operations cannot add a root by naming an absolute path.

```sh
portal grant add --root /absolute/disposable/root --alias fixture --access write
portal grant list
portal grant revoke GRANT_ID_OR_ALIAS
```

Default grant families exclude terminal and process inventory. For actual commands, explicitly choose needed families:

```sh
portal grant add --root /absolute/disposable/root --alias build-fixture --access write \
  --families files,search,terminal,jobs,code,skills,instructions,artifacts \
  --max-job-ms 1800000
```

`--network enabled` is an owner-controlled Boolean grant, not host/domain filtering for shell commands. Network fetch additionally requires the `network` family. Apple toolchain read roots can be passed through `--toolchain-roots` as a comma-separated list; these are explicit additional execution reads, not permission to sign or publish. A production-quality predefined Apple profile has not been qualified. `.git` administrative writes are denied by the direct filesystem layer; corresponding command protection needs target-binary proof.

Closing or changing grants while a writer is active is refused. Revoke a grant to block new admissions and request cancellation of its jobs. Never change a source SHA merely to suppress a conflict.

## Executor qualification

```sh
portal executor qualify --binary /absolute/native/codex
```

This uses the exact binary's version and generated TypeScript/JSON schemas, then real argv/cwd/read/write/network/stdin/PTY/resize/output/cancellation probes. It writes a local qualification report tied to executable hash, OS and architecture. Inspect `qualified` and every probe. A qualification result is not a terminal capability claim when any probe is false. Executable changes require requalification. Only the execution/inspection RPC allowlist exists; no inference request is made. The worker preserves the owner's HOME for managed Codex configuration, while minimizing environment variables and using explicit sandbox roots and job scratch. Child HOME/cache behavior therefore needs actual toolchain testing, not an isolation assumption.

## Documents and local skills

```sh
PYTHON=/absolute/python3 scripts/bootstrap-parser.sh /absolute/new/portal-parser-venv
portal configure python --path /absolute/new/portal-parser-venv/bin/python3
portal skills add-root /absolute/approved/skills --alias my-skills
portal skills list
portal skills refresh
```

A skill root is separately authorized owner configuration. It does not grant execution authority. Public static imports expose only the five immutable built-ins; runtime discovery can expose approved local bundles. Scripts are inert on load. Source snapshots are retained, but full active-task pin accounting/eviction is still an implementation gap.

## Stop, recover, upgrade and uninstall

`portal restart` drains frontend admission and attempts worker reattachment; `portal stop` requests cancellation and stops access. `portal emergency-stop` also revokes local authority. Read their results for unconfirmed jobs; a dead socket is not proof a subprocess stopped.

`portal backup --output /private/new-backup.sqlite` uses SQLite's backup API. Copy an encrypted backup offline before an upgrade. Migrations check checksums, back up before changes, and reject an unsupported database schema. Signed update verification and a tested one-command rollback are not supplied; do not describe reinstalling source as a signed updater.

`portal uninstall` preserves records and artifacts by default. `--delete-data` explicitly removes Portal state, not the user's granted files. It is not a guarantee of credential cleanup at every external provider; revoke the device/obsolete host registration first while credentials still exist. Mac upgrade, uninstall, Keychain and launchd behavior require the handbook's physical checks.
