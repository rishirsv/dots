# Mac Studio remote development runbook

Use the Studio as the compute and GUI host; use the Air as its control surface.
Start with the full standalone Tailscale app, ordinary macOS SSH over the tailnet,
and Apple's High Performance Screen Sharing. Keep SIP and FileVault enabled.
Use the supported Codex desktop-host connection for tasks needing Studio apps.
Keep source, Xcode, simulators, caches and job outputs on the Studio's local SSD.

**Status: setup in progress, 8 October 2026.** The Macs are named `air`
and `akira`. Tailscale, key-based SSH, Codex desktop pairing, and remote desktop
rendering are working. Tinycast's portable shortcut profile is applied; Codex,
Ghostty, and VS Code keybinding files match the Air. Development tools and T3
Nightly are installed. Studio sleep is disabled and startup whenever power is
reconnected is enabled. FileVault and SIP remain enabled.

Ghostty terminal input, Tinycast launcher/app commands and clipboard-history
search passed. Tinycast local Apple Intelligence inference passed earlier, but
a later bounded attempt produced no completed answer.
T3 Nightly on akira uses Performance background activity. Startup cleanup keeps
ChatGPT, Tailscale and Tinycast in the Studio's Open at Login list. T3's GUI
login agents were removed from both Macs, and automatic thread resumption is
off on akira. Its Dock pins are ChatGPT, Chrome and Ghostty; recent apps are off
and minimized windows use their app icons. The Air retains ChatGPT, Tinycast
and Wispr Flow as ordinary login apps, with Tailscale background startup; its
older T3 service's future startup is disabled.

The owner restarted and unlocked akira; SSH, Tailscale and ChatGPT/Codex are
available after login. Key-based SSH, scoped config status, matching shortcut
files, Xcode/Simulator CLI, a synthetic Swift program and Git remote access
passed acceptance checks. GitHub CLI is authenticated persistently on akira
using an owner-only credential file (mode `0600`) on the FileVault-encrypted
disk, after explicit owner approval. Fresh SSH API access, private Git reads
and a dry-run push passed. The Git credential helper uses GitHub CLI. Tinycast's
native Caps Lock Hyper mapping is active with Shift included and no action on
tap; optional Karabiner history/Escape behavior remains unavailable.
Screen Sharing accepts saved credentials and renders
the remote lock screen; automated remote unlock, High Performance mode and
physical global shortcuts remain unverified. macOS remains 27.0; no update was installed. Karabiner
driver approval remains blocked by a reproducible macOS Login Items crash, and
Tinycast selected-text actions remain unverified. Physical headless operation,
wired/WAN performance, and unattended reboot recovery still need verification.
Local execution reports and rollback details are retained outside Git under
each Mac's `Documents/Codex/remote-setup/`. The approval gates below describe the
original authoring workflow; later explicit user instructions authorize the
current setup, with any tool-required action-time confirmations handled during
execution. No simulator capacity or unattended reboot recovery is certified.

## Before beginning

The owner must be present with a keyboard/display, working admin credentials,
a backup, and a way to recover locally. Do not run this setup as root. Never add
blanket passwordless sudo, disable SIP/FileVault, copy privacy databases, or
place credentials, pairing links, auth keys or recovery material in Git.

Reported Studio “32/36 GB M5 Pro” and Air “24 GB M4” are **unverified**. Inventory
actual hardware on both Macs at setup; the workflow does not depend on those
labels. Wired Ethernet on the Studio is required for the initial performance
baseline; verify link speed and the actual switch/router path. Keep vents clear,
check sustained-load heat in the proposed placement, and retain physical access.

From the reviewed checkout on each target Mac:

```sh
python3 scripts/mac-studio/preflight.py --dry-run
# Owner executes on the intended Mac; save locally outside Git if desired:
python3 scripts/mac-studio/preflight.py --read-only
```

The read-only inventory reports model/chip/memory, OS, disk, power settings,
SIP/FileVault and Xcode. Missing queries mean **unknown**, not a passing check.
Record SSD capacity in System Settings and installed app versions manually;
record Ethernet adapter/interface and negotiated speed in Network settings.
Do not include hardware serial numbers in shared evidence.

## What was verified about Theo's public project

The official public project located is [T3 Code](https://github.com/pingdotgg/t3code),
under `pingdotgg`, linked to `t3.codes`. Its README describes a control surface
for local agent harnesses. Public repo inventories for `t3dotgg`, `t3-oss` and
`pingdotgg` did not establish a separate official project named **T3 Fleets**.
Do not substitute the unrelated `t3tools` organization or construction-fleet
products. The exact “Fleets” name/implementation remains an attribution gap;
request the original official link before claiming faithful reproduction.

Implementation examined at revision
`77823bd102ae50430d4acda9a553e5743d2aa5ba`:

- [Remote access docs](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/docs/user/remote-access.md): environments can use private-network pairing, SSH or T3 Connect; pairing grants persistent client access and must be revocable.
- [Desktop SSH owner](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/apps/desktop/src/ssh/DesktopSshEnvironment.ts) delegates discovery, connection and disconnection to the [SSH tunnel module](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/packages/ssh/src/tunnel.ts).
- [Load balancing hook](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/apps/web/src/hooks/useLoadBalancedEnvironment.ts) requests host resources and passes weights/results to the environment chooser. This supports adapting host preferences; it does not prove simulator scheduling or a safe job limit.
- [Tailscale integration](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/packages/tailscale/src/tailscale.ts) creates a background HTTPS Serve mapping to a local backend and removes a selected port mapping. Such a mapping is persistent access and has its own gate.
- [Background service docs](https://github.com/pingdotgg/t3code/blob/77823bd102ae50430d4acda9a553e5743d2aa5ba/docs/user/background-service.md) identify a macOS user LaunchAgent. Login-service operation does not provide FileVault preboot networking.

Adaptation: keep a compute host, explicit client authorization, separate shell
and GUI access, and measured resource limits. Prefer Studio for new development
jobs and keep Air manually selected for local work. Codex host choice remains
explicit; do not imply T3 auto balance is a Codex feature. T3 is optional here:
no T3 install, daemon, relay, pairing or Serve mapping is required or performed.
An optional T3 trial requires its own install/auth/pairing/service approvals and
an independently reviewed release. Do not pipe a downloaded installer into a shell.

## Five screen-sharing/headless options

These are suitability judgments from official docs, not measured rankings or
latency guarantees. Compare on the actual Air/Studio and WAN before buying.

| Option | Useful qualities | Headless and operational tradeoff | Decision |
| --- | --- | --- | --- |
| [Apple High Performance Screen Sharing](https://support.apple.com/en-mk/guide/remote-desktop/apdf8e09f5a9/mac) | Apple silicon, 30/60 fps, high-quality color, built-in Mac client | Virtual displays; one High Performance session per Mac; both Macs need macOS 14+ | **First choice** for this Mac-to-Mac workflow |
| [Jump Desktop Fluid](https://jumpdesktop.com/) | Proprietary high-performance protocol and cross-platform clients | Additional host agent, account, permissions and licensing; verify headless display/reconnect on target | Trial if Apple's mode is unavailable or unsatisfactory |
| [Screens](https://edovia.com/en/screens/) | Native Apple clients, SSH tunneling and display selection | Uses remote desktop/VNC workflow; verify physical/dummy display behavior; do not assume Apple's High Performance protocol | Convenient alternate client, not a proven performance upgrade |
| [Sunshine + Moonlight](https://docs.lizardbyte.dev/projects/sunshine/latest/md_docs_2getting__started.html) | Streaming-oriented open-source stack | macOS host support is experimental; capture/display setup and extra service maintenance | Experimental benchmark candidate |
| [RustDesk](https://rustdesk.com/docs/en/client/mac/) | Cross-platform and self-hostable infrastructure | Accessibility/recording/input grants; relay/server/display lifecycle adds work | Choose only if cross-platform/self-hosting needs justify it |

Apple recommends wired networking, 75 Mbps for one 4K display, and UDP
5900–5902 between the Macs. Begin with one lower-resolution virtual display;
private policy may also need TCP 5900 for ordinary Screen Sharing. A successful
TCP connection alone does not verify High Performance UDP traffic. Tailnet
reachability is necessary but performance is still conditional on WAN latency
and available bandwidth. Never forward these ports on the public router.
[Apple requirements](https://support.apple.com/en-mk/guide/remote-desktop/apdf8e09f5a9/mac)

Choose High Performance in the [Screen Sharing connection](https://support.apple.com/guide/mac-help/share-the-screen-of-another-mac-mh14066/mac).
Test physical display disconnection, virtual resolution, screenshots, simulator
rendering and reconnect. A dummy HDMI adapter is a fallback only after an
actual failure; do not install an unreviewed virtual-display driver. Disconnecting
the viewer can change display state, so separately test background Computer Use.

## Execution gates and setup sequence

For every gate, record the named Mac, exact action, prior state, owner approval,
verification and rollback locally outside Git. Broad account-admin status does
not authorize every network or macOS privacy action. Ask for each concrete
change when executing; authoring this runbook is not consent to execute it.

| Gate | Concrete approval | Verification | Reverse only new changes |
| --- | --- | --- | --- |
| A | Install/update or relaunch one named Tailscale app | App/variant/version visible | Restore prior app/launch state; do not disrupt sole access route |
| B | Login to existing account, VPN/system extension, device enrollment | Owner verifies existing tailnet and approved devices | Remove only new grants/device; preserve account |
| C | Exact tailnet/firewall policy edits | Intended Air can reach Studio; unrelated device cannot | Restore prior reviewed rule set |
| D | Remote Login user list and separately SSH FDA switch/key | Key-auth shell and approved disk scope | Restore user list/FDA/key additions |
| E | Screen Sharing user list/service | Remote GUI and High Performance mode | Restore list/service baseline |
| F | Each helper/app privacy grant and app access decision | Screenshot, click/type and required files | Revoke only added grants |
| G | Locked Use authorization plug-in | Trusted task while screen locked | Disable through supported installed-app setting |
| H | Portable Codex config and separately plugin propagation | Scoped config status, plugin inventory | Restore exact backup files and prior plugin state |
| I | Sleep/login/background/Serve changes, each separately | Availability in intended states | Restore recorded values/mappings/services |
| J | Controlled logout/reboot or benchmark workload | Owner present; acceptance evidence retained | Recover locally; stop only owned jobs |

### 1. Tailscale installation or relaunch

Preview `python3 scripts/mac-studio/plan.py tailscale`. Inspect existing variant
before Gate A; prefer the full **standalone app**. Do not install standalone and
App Store variants together or silently replace a working variant. Variant
migration includes a reboot and must be scheduled with recovery access.
[Tailscale variants](https://tailscale.com/docs/concepts/macos-variants)

If the app is already installed, the owner may approve quit/reopen on the
specific machine with active work paused; relaunch is not logout, reset or
reauthentication. Gate B covers login with the **existing** account, not creation
of a new tailnet. The owner confirms tailnet/admin identity and MFA in the
admin console, reviews device approval/key expiry and approves only intended
machines. Never record tokens or recovery codes. Admin console access and the
local macOS administrator role are separate.

Gate C should scope ordinary SSH TCP 22, Screen Sharing TCP 5900 and needed
High Performance UDP 5900–5902 to the approved source/destination. Tailscale
policy does not by itself prevent LAN access to macOS services: review local
firewall/LAN exposure separately. No subnet router, exit node, Funnel, public
listener or router forwarding is part of this setup. Preserve other tailnet
users/rules; use the admin console's validation before saving a reviewed edit.

### 2. Ordinary macOS Remote Login and full disk access

Preview `python3 scripts/mac-studio/plan.py remote-login`. At Gate D, owner opens
System Settings > General > Sharing > Remote Login and selects **Only these
users** for the development account. The requested full-disk option is separate:
review and approve “Allow full disk access for remote users” when this broad
scope is needed. Verify the option and a benign read in the approved location;
SSH success alone does not prove FDA. [Apple Remote Login](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)

Use an existing reviewed public key or generate a new passphrase-protected
client key with separate approval. Install only its public part in the target
account, preserve existing authorized keys, and keep private material outside
Git. Compare the Studio's SSH host fingerprint via a trusted local channel;
never use `StrictHostKeyChecking=no`. Review existing SSH config before adding
one concrete alias on the Air (owner-approved local config change):

```sshconfig
Host studio-dev
    HostName REPLACE_WITH_VERIFIED_STUDIO_TAILNET_NAME.ts.net
    User REPLACE_WITH_STUDIO_DEVELOPMENT_USER
    IdentityFile ~/.ssh/REPLACE_WITH_EXISTING_KEY
    IdentitiesOnly yes
    ForwardAgent no
```

Verify `ssh studio-dev` and the remote login-shell PATH for `codex`. This uses
macOS SSH over Tailscale; it does not require enabling Tailscale SSH.

### 3. Screen Sharing, Codex host and Computer Use

Preview `python3 scripts/mac-studio/plan.py screen-sharing`. Gate E enables
Screen Sharing for the intended user only. Review existing Remote Management
before changing it; do not run `kickstart` to silently grant universal access.
Connect from Air using the verified tailnet host and test the chosen mode.

Gate F: on Studio, install/authenticate the chosen Codex app/CLI only after
specific approval, then pair its supported desktop host with Air using the
intended account/workspace. Remote files/shell access does not certify GUI
access. Verify the actual target host and tool inventory from a benign task.
Keep the app running and check its supported prevent-sleep behavior.
[OpenAI remote connections](https://learn.chatgpt.com/docs/remote-connections)

Grant required Accessibility and Screen Recording to the actual installed
Computer Use helper through System Settings; review Automation, Input Monitoring
and FDA separately for the named apps/helpers when required. Configure approved
app access for Xcode, Simulator, browser and terminal. Do not use “all apps” as a
substitute for verifying permission scope. Full Computer Use is a set of grants
and working tools, not an administrator account or one supported universal switch.

The repo's optional forbidden-target override is undocumented and can break
across app updates. Preview and separately approve it only after confirming
the installed helper supports it:

```sh
python3 scripts/sync-codex-computer-use.py apply --dry-run
# After approval of this exact override:
python3 scripts/sync-codex-computer-use.py apply
```

Record prior values for `ComputerUseAllowForbiddenTargets` in
`com.openai.sky.CUAService`, `com.openai.sky.CUAService.cli`, and global (`-g`); do not export
whole preference domains into Git. Do not mistake this override for a macOS
privacy grant or Locked Use setting. [Existing onboarding](INSTALL.md)

Gate G: the user-requested “Codex Locked Use” must be verified in the installed
host's Settings > Computer Use. Current official docs describe macOS Locked Use
as an explicit authorization plug-in for trusted active tasks; they describe
ChatGPT behavior, so verify the precise Codex build exposes the same feature.
If missing, leave pending rather than invent a config key or authorization DB
patch. Test one benign task after screen lock and verify relock/local-input
behavior with owner present. It cannot serve as general remote unlock or
FileVault preboot recovery, nor approve OS security prompts.
[OpenAI Computer Use](https://learn.chatgpt.com/docs/computer-use)

### 4. Propagate existing repo-owned Codex configuration

Preview `python3 scripts/mac-studio/plan.py codex-config`. Use the existing
[config sync](scripts/sync-configs.sh) and [merge helper](scripts/sync-codex-config.py),
which preserve machine-local application state and create timestamped backups.
The tracked config currently sets `approval_policy = "never"` and
`sandbox_mode = "danger-full-access"`: Gate H must explicitly acknowledge these
broad portable permissions. They do not authorize the separate network/security
operations in this runbook; execution must still stop at each action gate.

On the Studio's reviewed checkout after prerequisites are ready:

```sh
scripts/sync-configs.sh --dry-run --all
# Inspect results; approve only the selected targets, then:
scripts/sync-configs.sh --codex --codex-personal
# Separate plugin/cache propagation approval:
scripts/sync-plugins.sh --codex
scripts/sync-configs.sh --status --codex --codex-personal
codex plugin list
```

Do not apply `--all` merely because it was previewed. Include the second profile
only if wanted; inspect changes to an absent profile before approving creation.
The authoritative repo source may change between review and setup: rerun the
preview then. Keep local `dots@dots`/`drafts@dots` copies as instructed by
[AGENTS.md](AGENTS.md); preserve cloud installations and unrelated dirty files.
Never copy auth/session data, Keychain values, private keys, signing material,
privacy databases or live local MCP/project settings from the Air. Provision
required credentials through owner-approved secure flows. [Mac onboarding](INSTALL.md)

## Verification and operational acceptance

Run these only on the intended Mac after setup. They do not change settings:

```sh
python3 scripts/mac-studio/verify.py --dry-run
python3 scripts/mac-studio/verify.py --read-only
# On the Air, use the Studio's verified private IP or full tailnet DNS name:
python3 scripts/mac-studio/verify.py --read-only --peer STUDIO_NAME.TAILNET.ts.net
```

The script reports Tailscale local online state with peer/account inventory
removed, the override status, and optional bounded ping. Private network probes
can send traffic; the operator supplies the reviewed peer. Raw local evidence
may contain paths/addresses and belongs outside Git. Five ping results do not
establish a bandwidth or latency guarantee. Inspect settled **direct** versus
**DERP relay** in ping output; initial relay negotiation can be normal. Repeat
on a different network. [Tailscale connection types](https://tailscale.com/docs/reference/connection-types)

Manual acceptance requires: correct remote hardware identity; successful SSH;
restricted access lists; requested FDA verified; working GUI/screenshot/input;
app access scopes; Locked Use test if supported; active desktop-host pairing;
headless disconnect/reconnect; and denial from an unapproved device. Pending
manual checks must remain pending. A read-only script exit is not an access audit.

### Measure simulator concurrency

At Gate J, use the same project commit, scheme, runtime and fixtures on each
trial. Separate cold/warm runs and run three trials per condition: local single
job, SSH single job, single job with Screen Sharing, then two jobs and four only
if two is healthy. Increase beyond four only from measurements, not RAM labels.
Use one worktree, simulator allocation, DerivedData and result bundle per job.
One agent owns each interactive device; apply a global aggregate cap across
threads. Never erase or shut down another task's simulator.

Record wall time, completed jobs/minute, failures/retries, memory pressure,
swap growth, free disk, CPU, sustained heat, stream resolution, direct/relay
path and Air responsiveness/battery. Set an explicit reserve before each trial
(e.g. 20% free disk as an initial local policy, not an Apple requirement).
Stop escalation on warnings/critical pressure, sustained swap growth, test
flakiness, declining throughput or unusable GUI. Select the smallest stable
concurrency giving worthwhile throughput after repeated trials. Keep physical
device checks for hardware/performance claims. Verify installed `xcodebuild -help`
for parallel worker flags; worker count alone does not cap independent builds.
[Apple command-line testing](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)

Save a CSV outside Git, with the following exact header, then summarize it:

```csv
mode,jobs,completed,seconds,failures,pressure,responsive
local-warm,1,1,120,0,normal,yes
```

```sh
python3 scripts/mac-studio/benchmark.py /path/to/private/trials.csv
```

The analyzer marks unhealthy rows and computes throughput only. It never runs
Xcode or selects a production cap automatically. Example numbers are synthetic.

## Reboot recovery and rollback

Screen locked, user logged out, asleep, FileVault locked and power/network down
are different states. The standalone Tailscale GUI app does not run before
login; switching to daemon mode would still not establish FileVault preboot
reachability. Keep FileVault on. [Tailscale variant limitations](https://tailscale.com/docs/concepts/macos-variants)

Apple's SSH/FileVault manual documents password-based volume unlock over SSH
beginning with macOS 26. Normal data-volume SSH config/keys are unavailable in
that state; services briefly disconnect after unlock. Verify target OS/hardware
and LAN reachability with the owner before relying on it. The owner performs
credential entry. This does not prove that the Studio's tailnet IP is reachable
at preboot. [Apple SSH/FileVault manual](https://github.com/apple-oss-distributions/OpenSSH/blob/main/apple_ssh_and_filevault.7)

Before unattended use, approve and test lock, viewer reconnect, logout,
controlled reboot and network restoration. Keep a trusted on-site person or a
separately powered, reviewed recovery path. A tailnet-to-LAN gateway/subnet
route would need its own design and approval; it is not enabled here. Never
power-cycle during an update. Defer unattended major upgrades until recovery
works. A UPS can reduce outages but cannot unlock FileVault.

Preview `python3 scripts/mac-studio/plan.py rollback`. Retain a working access
route while revoking newly added client sessions/Locked Use, restoring exact
config backups and prior preference key values, and reversing only recorded
sharing/privacy/tailnet/power changes. Prefer supported settings UIs; do not use
blanket `tccutil reset`, reset the whole tailnet, delete unrelated keys or remove
other tasks' services. T3 pairing/session revocation and optional background
service removal are separate; remove only a mapping/service this setup created.
No rollback command in this bundle mutates the system automatically.

## Authoring evidence and remaining work

The prior Library draft `MAC_STUDIO_RUNBOOK_DRAFT.md` was materialized into the
task workspace, verified at 14,923 bytes, and retained its Library identity and
version metadata. This canonical file reconciles it with actual repo interfaces;
it is a new repository deliverable, not an overwrite of that Library draft.
Public Apple, Tailscale, OpenAI and T3 implementation sources were reviewed.
Static/synthetic checks cover plan-only behavior, command construction, unknown
results, private peer validation, status redaction and benchmark handling.

Still required at execution: exact hardware/app inventory, confirmation of the
original “Fleets” link, each action gate, installed Locked Use compatibility,
existing-tailnet admin/device verification, actual GUI/SSH/FDA tests, headless
and reboot recovery, and representative workload measurements. No host setup,
relaunch, installation, login, grant, service, simulator benchmark, commit or
push has occurred during authoring.
