#!/usr/bin/env python3
"""Merge portable Tinycast workflows while preserving machine-local settings."""
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
HELPER_ROOT = HOME / '.local/share/dots/tinycast'

def defaults():
    return plistlib.loads(subprocess.check_output(['defaults', 'export', 'com.tinycast.app', '-']))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--status', action='store_true')
    args = parser.parse_args()
    config = json.loads((ROOT / 'configs/tinycast/workflows.json').read_text())
    portable = json.loads((ROOT / 'configs/tinycast/shortcuts.json').read_text())
    live = defaults()
    actions = json.loads(QUICK.read_text()) if QUICK.exists() else []
    wanted = dict(portable['defaults'])
    for key, value in wanted.items():
        if not key.startswith('hotkey.'): continue
        combo = json.loads(value)['combo']['_0']
        for name, current in live.items():
            if not name.startswith('hotkey.') or name == key or not isinstance(current, str): continue
            try: existing = json.loads(current)['combo']['_0']
            except (ValueError, KeyError, TypeError): continue
            if existing == combo: raise RuntimeError('Shortcut conflict: ' + name)
    for binding in config['bindings'].values():
        key = 'hotkey.quickAction.' + binding['id'].lower()
        wanted[key] = json.dumps({'combo': {'_0': {'carbonModifiers': 6912, 'carbonKeyCode': binding['carbonKeyCode']}}}, separators=(',', ':'))
        for name, value in live.items():
            if name.startswith('hotkey.') and name != key and isinstance(value, str):
                try: combo = json.loads(value)['combo']['_0']
                except (ValueError, KeyError, TypeError): continue
                if combo == json.loads(wanted[key])['combo']['_0']:
                    raise RuntimeError('Shortcut conflict: ' + name)
    for binding in config.get('customBindings', {}).values():
        key = 'hotkey.customCommand.' + binding['id'].lower()
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
    if history_key in live and json.loads(live[history_key]) != json.loads(history_value):
        raise RuntimeError('History must already use Option+V; preserve the local binding')
    karabiner = json.loads(KARABINER.read_text()) if KARABINER.exists() else {'profiles': [{'name': 'Default', 'selected': True}]}
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
    owned_rules = portable['karabinerRules'] + [rule]
    owned_descriptions = {r['description'] for r in owned_rules}
    owned_keys = {m['from']['key_code'] for r in owned_rules for m in r['manipulators']}
    for existing in rules:
        if existing.get('description') in owned_descriptions: continue
        if any(m.get('from', {}).get('key_code') in owned_keys for m in existing.get('manipulators', [])):
            raise RuntimeError('Existing Karabiner rule requires review: ' + existing.get('description', 'unnamed'))
    new_rules = [r for r in rules if r.get('description') not in owned_descriptions] + owned_rules
    app_bound = list(live.get('boundAppBundleIDs', []))
    for bundle in portable['boundAppBundleIDs']:
        if bundle not in app_bound: app_bound.append(bundle)
    changed = actions != merged or rules != new_rules or live.get('boundQuickActionIDs') != bound
    changed |= any(live.get(k) != v for k, v in wanted.items())
    changed |= live.get('quickActionsEnabled') is not True
    changed |= live.get('boundAppBundleIDs') != app_bound
    changed |= not KARABINER.exists()
    custom = config.get('customCommands', [])
    live_custom = json.loads(live.get('customCommands', b'[]'))
    custom_ids = {command['id'].lower() for command in custom}
    for command in custom:
        if any(existing['id'].lower() not in custom_ids and existing['name'] == command['name'] for existing in live_custom):
            raise RuntimeError('Custom command name conflict: ' + command['name'])
    merged_custom = [command for command in live_custom if command['id'].lower() not in custom_ids] + custom
    custom_bound = list(live.get('boundCustomCommandIDs', []))
    for binding in config.get('customBindings', {}).values():
        if binding['id'].lower() not in [value.lower() for value in custom_bound]: custom_bound.append(binding['id'].lower())
    if custom:
        changed |= merged_custom != live_custom or live.get('customCommandsEnabled') is not True
        changed |= live.get('boundCustomCommandIDs') != custom_bound
        marker = HELPER_ROOT / 'ocr-source.swift'
        source = ROOT / 'configs/tinycast/helpers/ocr.swift'
        changed |= not (HELPER_ROOT / 'tinycast-ocr').exists() or not marker.exists() or marker.read_bytes() != source.read_bytes()

    if args.status:
        print('Tinycast workflows: ' + ('drift' if changed else 'current'))
        return int(changed)
    if not args.apply:
        print('Would merge the portable Tinycast workflows' if changed else 'Tinycast workflows already current')
        return 0
    if not changed:
        print('Tinycast workflows already current'); return 0
    if custom:
        HELPER_ROOT.mkdir(parents=True, exist_ok=True)
        subprocess.run(['/usr/bin/swiftc', '-module-cache-path', str(HELPER_ROOT / 'swift-module-cache'),
                        str(source), '-o', str(HELPER_ROOT / 'tinycast-ocr.new')], check=True)
        (HELPER_ROOT / 'tinycast-ocr.new').replace(HELPER_ROOT / 'tinycast-ocr')
        shutil.copy2(source, HELPER_ROOT / 'ocr-source.swift')
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
        kind = '-bool' if isinstance(value, bool) else '-string'
        encoded = str(value).lower() if isinstance(value, bool) else value
        subprocess.run(['defaults', 'write', 'com.tinycast.app', key, kind, encoded], check=True)
    subprocess.run(['defaults', 'write', 'com.tinycast.app', 'boundAppBundleIDs', '-array', *app_bound], check=True)
    subprocess.run(['defaults', 'write', 'com.tinycast.app', 'boundQuickActionIDs', '-array', *bound], check=True)
    subprocess.run(['defaults', 'write', 'com.tinycast.app', 'quickActionsEnabled', '-bool', 'true'], check=True)
    if custom:
        subprocess.run(['defaults', 'write', 'com.tinycast.app', 'customCommands', '-data', json.dumps(merged_custom).encode().hex()], check=True)
        subprocess.run(['defaults', 'write', 'com.tinycast.app', 'boundCustomCommandIDs', '-array', *custom_bound], check=True)
        subprocess.run(['defaults', 'write', 'com.tinycast.app', 'customCommandsEnabled', '-bool', 'true'], check=True)
    profile['complex_modifications']['rules'] = new_rules
    KARABINER.parent.mkdir(parents=True, exist_ok=True)
    KARABINER.write_text(json.dumps(karabiner, indent=2) + '\n')
    if running: subprocess.run(['open', '-a', 'Tinycast'], check=True)
    print('Applied portable Tinycast workflows; backup: ' + str(backup))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
