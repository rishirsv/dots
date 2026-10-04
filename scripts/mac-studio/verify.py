#!/usr/bin/env python3
"""Plan verification; --read-only queries local state; --peer adds private probes."""
import argparse
import ipaddress
import json
from pathlib import Path
import re
import shutil
from common import collect, emit


def private_peer(value):
    try:
        address = ipaddress.ip_address(value)
        if address in ipaddress.ip_network('100.64.0.0/10') or address in ipaddress.ip_network('fd7a:115c:a1e0::/48'):
            return value
    except ValueError:
        if re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9.-]*\.ts\.net', value) and '..' not in value:
            return value
    raise argparse.ArgumentTypeError('use a verified tailnet IP or full *.ts.net name')


def tailscale_binary():
    app = Path('/Applications/Tailscale.app/Contents/MacOS/Tailscale')
    return str(app) if app.exists() else (shutil.which('tailscale') or 'tailscale')


def summarize_status(rows):
    for row in rows:
        if row['check'] == 'tailscale_status' and row['state'] == 'observed':
            try:
                status = json.loads(row.pop('output'))
                row['output'] = {'BackendState': status.get('BackendState'),
                                 'Online': status.get('Self', {}).get('Online')}
            except (ValueError, TypeError, AttributeError):
                row.update(state='unknown', output='Cannot parse Tailscale status.')
    return rows


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--read-only', action='store_true')
    p.add_argument('--dry-run', action='store_true')
    p.add_argument('--peer', type=private_peer)
    a = p.parse_args()
    if a.read_only and a.dry_run:
        p.error('choose --read-only or --dry-run')
    ts = tailscale_binary()
    commands = [('tailscale_status', [ts, 'status', '--json']),
                ('computer_use_override', ['python3', str(Path(__file__).resolve().parents[1] / 'sync-codex-computer-use.py'), 'status'])]
    if a.peer:
        commands += [('network_path', [ts, 'ping', '--c=5', '--timeout=3s', a.peer])]
    emit(summarize_status(collect(commands, a.read_only)))
    print('Manual checks required: Remote Login users/FDA, Screen Sharing users, privacy grants, Locked Use, desktop pairing, firewall scope, reboot recovery.')


if __name__ == '__main__':
    main()
