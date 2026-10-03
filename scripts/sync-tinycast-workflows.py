#!/usr/bin/env python3
"""Merge portable Tinycast text actions and a Karabiner History alias."""
import argparse
import json
import pathlib
import plistlib
import shutil
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]
HOME = pathlib.Path.home()
SUPPORT = HOME / 'Library/Application Support/com.tinycast.app'
QUICK = SUPPORT / 'quick-actions.json'
PREFS = HOME / 'Library/Preferences/com.tinycast.app.plist'
KARABINER = HOME / '.config/karabiner/karabiner.json'
DESCRIPTION = 'Dots: Hyper+H opens Tinycast clipboard history (Option+V)'

def defaults():
    return plistlib.loads(subprocess.check_output(['defaults', 'export', 'com.tinycast.app', '-']))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--status', action='store_true')
    args = parser.parse_args()
    config = json.loads((ROOT / 'configs/tinycast/workflows.json').read_text())
    live = defaults()
    actions = json.loads(QUICK.read_text()) if QUICK.exists() else []
    wanted = {}
    for binding in config['bindings'].values():
        key = 'hotkey.quickAction.' + binding['id'].lower()
        wanted[key] = json.dumps({'combo': {'_0': {'carbonModifiers': 6912, 'carbonKeyCode': binding['carbonKeyCode']}}}, separators=(',', ':'))
        for name, value in live.items():
            if name.startswith('hotkey.') and name != key and isinstance(value, str):
                try: combo = json.loads(value)['combo']['_0']
                except (ValueError, KeyError, TypeError): continue
                if combo == json.loads(wanted[key])['combo']['_0']:
                    raise RuntimeError('Shortcut conflict: ' + name)
    for name, value in live.items():
        if name.startswith('hotkey.') and isinstance(value, str):
            try: combo = json.loads(value)['combo']['_0']
            except (ValueError, KeyError, TypeError): continue
            if combo == {'carbonModifiers': 6912, 'carbonKeyCode': 4}:
                raise RuntimeError('Hyper+H conflict: ' + name)
    # Tinycast has one shortcut per command. Keep Option+V and alias Hyper+H.
    history_key = 'hotkey.command:clipboard-history'
    history_value = json.dumps({'combo': {'_0': {'carbonModifiers': 2048, 'carbonKeyCode': 9}}}, separators=(',', ':'))
    if json.loads(live.get(history_key, '{}')) != json.loads(history_value):
        raise RuntimeError('History must already use Option+V; preserve the local binding')
    karabiner = json.loads(KARABINER.read_text())
    profile = next(p for p in karabiner['profiles'] if p.get('selected'))
    rules = profile.setdefault('complex_modifications', {}).setdefault('rules', [])
    rule = {'description': DESCRIPTION, 'manipulators': [{'type': 'basic', 'from': {'key_code': 'h', 'modifiers': {'mandatory': ['command', 'control', 'option', 'shift']}}, 'to': [{'key_code': 'v', 'modifiers': ['left_option']}]}]}
    for existing in rules:
        if existing.get('description') == DESCRIPTION: continue
        for manipulator in existing.get('manipulators', []):
            source = manipulator.get('from', {})
            if source.get('key_code') == 'h':
                raise RuntimeError('Existing Karabiner H rule requires review')
    ids = {a['id'].lower() for a in config['quickActions']}
    merged = [a for a in actions if a['id'].lower() not in ids]
    # Preserve an existing Prompt verbatim rather than overwriting local instructions.
    for action in config['quickActions']:
        existing = next((a for a in actions if a['id'].lower() == action['id'].lower()), None)
        merged.append(existing if action['name'] == 'Prompt' and existing else action)
    bound = list(live.get('boundQuickActionIDs', []))
    for value in config['bindings'].values():
        if value['id'].lower() not in [x.lower() for x in bound]: bound.append(value['id'].lower())
    new_rules = [r for r in rules if r.get('description') != DESCRIPTION] + [rule]
    changed = actions != merged or rules != new_rules or live.get('boundQuickActionIDs') != bound
    changed |= any(live.get(k) != v for k, v in wanted.items())
    if args.status:
        print('Tinycast workflows: ' + ('drift' if changed else 'current'))
        return int(changed)
    if not args.apply:
        print('Would merge P/I/E actions and Hyper+H alias' if changed else 'Tinycast workflows already current')
        return 0
    if not changed:
        print('Tinycast workflows already current'); return 0
    running = subprocess.run(['pgrep', '-x', 'Tinycast'], capture_output=True).returncode == 0
    if running:
        subprocess.run(['pkill', '-TERM', '-x', 'Tinycast'], check=True)
        for _ in range(40):
            if subprocess.run(['pgrep', '-x', 'Tinycast'], capture_output=True).returncode: break
            time.sleep(.1)
        else: raise RuntimeError('Tinycast did not exit; no configuration was written')
    backup = SUPPORT / 'backups' / ('dots-workflows-' + time.strftime('%Y%m%d%H%M%S'))
    backup.mkdir(parents=True)
    for file in [QUICK, PREFS, KARABINER]:
        if file.exists(): shutil.copy2(file, backup / file.name)
    QUICK.parent.mkdir(parents=True, exist_ok=True)
    QUICK.write_text(json.dumps(merged, indent=2) + '\n')
    for key, value in wanted.items():
        subprocess.run(['defaults', 'write', 'com.tinycast.app', key, '-string', value], check=True)
    subprocess.run(['defaults', 'write', 'com.tinycast.app', 'boundQuickActionIDs', '-array', *bound], check=True)
    profile['complex_modifications']['rules'] = new_rules
    KARABINER.write_text(json.dumps(karabiner, indent=2) + '\n')
    if running: subprocess.run(['open', '-a', 'Tinycast'], check=True)
    print('Applied P/I/E and Hyper+H; backup: ' + str(backup))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
