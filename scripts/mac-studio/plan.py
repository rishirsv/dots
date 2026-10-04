#!/usr/bin/env python3
"""Print one approved-stage checklist. This script has no apply mode."""
import argparse
from common import emit

STAGES = {
 'tailscale': ['Approve standalone app install or relaunch on each named Mac; preserve existing account.',
               'Owner signs into existing tailnet and verifies admin identity/MFA, device approval and expiry.',
               'Approve extension/VPN permission, login availability, and each access-policy edit separately.',
               'Allow only intended Air-to-Studio private SSH/Screen Sharing traffic; no Funnel, exit node or subnet route by default.'],
 'remote-login': ['Approve Remote Login for the named development user only.',
                  'Approve Allow full disk access for remote users separately if required.',
                  'Owner installs only the reviewed public SSH key; compare host fingerprint through a trusted local channel.'],
 'screen-sharing': ['Approve Screen Sharing for the named user only; review conflicting Remote Management.',
                    'Approve private firewall/tailnet rules separately; no router forwarding.',
                    'Test High Performance with one virtual display before headless operation.'],
 'codex-config': ['Review configs/codex/config.toml: approval_policy=never and sandbox_mode=danger-full-access are broad permissions.',
                  'After tools/auth are ready, preview: scripts/sync-configs.sh --dry-run --all',
                  'Approve portable config propagation; then scripts/sync-configs.sh --codex --codex-personal',
                  'Approve plugin/cache propagation separately; scripts/sync-plugins.sh --codex',
                  'Verify: scripts/sync-configs.sh --status --codex --codex-personal'],
 'computer-use': ['Approve each concrete helper/app Accessibility, Screen Recording, Automation and FDA grant separately.',
                  'Approve app access in Codex for the task apps, including Xcode, Simulator, terminal and browser.',
                  'Preview optional undocumented override: python3 scripts/sync-codex-computer-use.py apply --dry-run',
                  'Only after separate approval: python3 scripts/sync-codex-computer-use.py apply',
                  'Approve Locked Use separately in installed app Settings > Computer Use; verify exact supported host behavior.'],
 'rollback': ['Keep local display/keyboard access and a known-working route until reversal completes.',
              'Revoke only added Codex/T3 client sessions and Locked Use through supported settings.',
              'Restore only the exact changed config files from timestamped backups; inspect current files first.',
              'Restore prior per-domain ComputerUseAllowForbiddenTargets values, or delete only keys that were absent.',
              'Restore prior Screen Sharing/Remote Login user lists and FDA switch; revoke only new privacy grants.',
              'Restore reviewed tailnet policy; remove only newly enrolled device/access grants.',
              'Quit/relaunch/remove only the approved Tailscale variant; keep physical recovery available.',
              'Reverse only approved power/login/service changes using the recorded baseline; never disable SIP/FileVault.'],
}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('stage', choices=STAGES)
    p.add_argument('--dry-run', action='store_true', help='all stages always print only')
    a = p.parse_args()
    emit({'stage': a.stage, 'mode': 'plan-only', 'steps': STAGES[a.stage]})


if __name__ == '__main__':
    main()
