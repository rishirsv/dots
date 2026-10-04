#!/usr/bin/env python3
"""Plan inventory by default; --read-only executes bounded local queries."""
import argparse
import platform
from common import collect, emit

COMMANDS = [
    ('macOS', ['/usr/bin/sw_vers']),
    ('model', ['/usr/sbin/sysctl', '-n', 'hw.model']),
    ('chip', ['/usr/sbin/sysctl', '-n', 'machdep.cpu.brand_string']),
    ('memory_bytes', ['/usr/sbin/sysctl', '-n', 'hw.memsize']),
    ('cpu_count', ['/usr/sbin/sysctl', '-n', 'hw.ncpu']),
    ('free_disk', ['/bin/df', '-h', '/']),
    ('SIP', ['/usr/bin/csrutil', 'status']),
    ('FileVault', ['/usr/bin/fdesetup', 'status']),
    ('power_settings', ['/usr/bin/pmset', '-g', 'custom']),
    ('Xcode', ['/usr/bin/xcodebuild', '-version']),
    ('developer_directory', ['/usr/bin/xcode-select', '-p']),
]


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--read-only', action='store_true')
    p.add_argument('--dry-run', action='store_true')
    a = p.parse_args()
    if a.read_only and a.dry_run:
        p.error('choose --read-only or --dry-run')
    if a.read_only and platform.system() != 'Darwin':
        p.error('inventory must run on the target Mac')
    emit(collect(COMMANDS, a.read_only))


if __name__ == '__main__':
    main()
