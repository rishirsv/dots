import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SyncPluginsTests(unittest.TestCase):
    def test_claude_sync_preserves_disabled_plugins_without_loading_them(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            calls = root / "calls"
            for name in ("git", "node"):
                command = root / name
                command.write_text("#!/bin/sh\nexit 0\n")
                command.chmod(0o755)
            installed = [{"id": name + "@dots", "enabled": False, "version": json.loads(
                (ROOT / "plugins" / name / ".claude-plugin" / "plugin.json").read_text()
            )["version"]} for name in ("dots", "drafts")]
            claude = root / "claude"
            claude.write_text(
                "#!/usr/bin/env python3\nimport json,sys\n"
                f"with open({str(calls)!r}, 'a') as out: out.write(' '.join(sys.argv[1:]) + '\\n')\n"
                "if sys.argv[1:4] == ['plugin', 'marketplace', 'list']: print(json.dumps([{'name': 'dots', 'source': 'github', 'repo': 'rishirsv/dots'}]))\n"
                f"if sys.argv[1:3] == ['plugin', 'list']: print({json.dumps(installed)!r})\n"
                "if sys.argv[1:3] == ['plugin', 'details']: raise SystemExit('disabled plugins cannot be loaded')\n"
            )
            claude.chmod(0o755)
            result = subprocess.run(
                ["zsh", str(ROOT / "scripts" / "sync-plugins.sh"), "--claude"],
                env={**os.environ, "PATH": f"{root}:{os.environ['PATH']}"},
                text=True, capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertNotIn("plugin details", calls.read_text())
            self.assertNotIn("plugin enable", calls.read_text())

    def test_codex_sync_replaces_stale_agent_profiles_and_keeps_backup(self):
        self.run_codex_sync()

    def test_codex_sync_cloud_choice_survives_later_sync(self):
        self.run_codex_sync(mode="cloud")

    def test_codex_sync_keeps_local_packages_if_cloud_skills_are_unavailable(self):
        self.run_codex_sync(mode="cloud", cloud_missing=True)

    def test_codex_sync_rejects_enabled_cloud_duplicate(self):
        self.run_codex_sync(cloud_enabled=True)

    def test_codex_sync_rejects_duplicate_skills_from_actual_loader(self):
        self.run_codex_sync(mode="cloud", duplicate_skills=True)

    def test_codex_cloud_choice_does_not_change_second_profiles_local_choice(self):
        self.run_codex_sync(mode="cloud", second_profile=True)

    def run_codex_sync(self, *, mode="local", cloud_enabled=False, cloud_missing=False, duplicate_skills=False, second_profile=False):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "scripts").mkdir()
            shutil.copy2(ROOT / "scripts" / "sync-plugins.sh", root / "scripts")
            for name in ("sync-codex-config.py", "codex-plugin-source.sh", "verify-codex-skills.py"):
                shutil.copy2(ROOT / "scripts" / name, root / "scripts")
            config_source = root / "configs" / "codex"
            config_source.mkdir(parents=True)
            for name in ("plugin-exclusions.toml", "plugins-cloud.toml"):
                shutil.copy2(ROOT / "configs" / "codex" / name, config_source)

            plugin = root / "plugins" / "dots"
            agents = plugin / "agents"
            agents.mkdir(parents=True)
            (agents / "advisor.toml").write_text('name = "advisor"\n')
            (agents / "advisor.md").write_text("---\nname: advisor\n---\n")
            for product in ("codex", "claude"):
                manifest = plugin / f".{product}-plugin" / "plugin.json"
                manifest.parent.mkdir()
                manifest.write_text(json.dumps({"name": "dots", "version": "1.0.0"}))

            for catalog in (
                root / ".agents" / "plugins" / "marketplace.json",
                root / ".claude-plugin" / "marketplace.json",
            ):
                catalog.parent.mkdir(parents=True)
                catalog.write_text(json.dumps({"plugins": [{"name": "dots", "source": "plugins/dots"}]}))

            home = root / "home"
            installed_agents = home / ".codex" / "agents"
            installed_agents.mkdir(parents=True)
            (installed_agents / "planner.toml").write_text('name = "planner"\n')
            live_config = home / ".codex" / "config.toml"
            live_config.write_text(
                'model = "keep-my-model"\n'
                '[plugins."dev-6aaf4ad66f108191b548c1a6a1012373@created-by-me-remote"]\n'
                'enabled = true\n'
                '[plugins."unrelated@remote"]\nenabled = true\n'
                '[plugins."dots@dots"]\nenabled = true\n'
            )
            if second_profile:
                secondary = home / ".codex-personal"
                secondary.mkdir()
                (secondary / "dots-plugin-source").write_text("local\n")
                (secondary / "config.toml").write_text('model = "second-account-model"\n')

            bin_dir = root / "bin"
            bin_dir.mkdir()
            git = bin_dir / "git"
            git.write_text("#!/bin/sh\nexit 0\n")
            git.chmod(0o755)
            codex = bin_dir / "codex"
            calls = root / "codex-calls"
            codex.write_text(
                "#!/usr/bin/env python3\n"
                "import json, os, sys\n"
                "from pathlib import Path\n"
                "home = Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex')))\n"
                f"calls = Path({str(calls)!r}) if home.name != '.codex-personal' else home / 'codex-calls'\n"
                "with calls.open('a') as out: out.write(' '.join(sys.argv[1:]) + '\\n')\n"
                "marker = home / 'dots-plugin-source'\n"
                "cloud = marker.exists() and marker.read_text().strip() == 'cloud'\n"
                "local = [{'pluginId': name + '@dots', 'version': '1.0.0', 'enabled': not cloud} for name in ('dots', 'drafts')]\n"
                f"extra = [{{'pluginId': 'dev-6aaf4ad66f108191b548c1a6a1012373@created-by-me-remote', 'version': '1.0.3', 'enabled': True}}] if {cloud_enabled!r} else []\n"
                "if sys.argv[1:3] == ['plugin', 'list']: print(json.dumps({'installed': local + extra}))\n"
                "if sys.argv[1:] == ['app-server']:\n"
                "    ids = ['dev-6aaf4ad66f108191b548c1a6a1012373@created-by-me-remote', 'drafts@created-by-me-remote'] if cloud else ['dots@dots', 'drafts@dots']\n"
                f"    skills = [] if cloud and {cloud_missing!r} else [{{'pluginId': pid, 'name': ('architect' if i == 0 else 'scribe'), 'path': '/skills/' + str(i), 'enabled': True}} for i, pid in enumerate(ids)]\n"
                f"    if {duplicate_skills!r}: skills.append({{'pluginId': 'dots@dots', 'name': 'dots:architect', 'path': '/duplicate/architect', 'enabled': True}})\n"
                "    for line in sys.stdin:\n"
                "        request = json.loads(line)\n"
                "        result = {'data': [{'skills': skills}]} if request['method'] == 'skills/list' else {}\n"
                "        print(json.dumps({'method': 'notification'}) + '\\n' + json.dumps({'id': request['id'], 'result': result}), flush=True)\n"
            )
            codex.chmod(0o755)

            env = os.environ.copy()
            env["HOME"] = str(home)
            env.pop("CODEX_HOME", None)
            env["PATH"] = f"{bin_dir}:{env['PATH']}"
            result = subprocess.run(
                ["zsh", str(root / "scripts" / "sync-plugins.sh"), "--codex", "--source", mode],
                text=True,
                capture_output=True,
                env=env,
            )

            if cloud_enabled or cloud_missing or duplicate_skills:
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("selected plugin has no enabled skills" if cloud_missing else "duplicate copy is still enabled", result.stderr)
                if duplicate_skills:
                    self.assertIn("architect: loaded 2 copies", result.stderr)
                if cloud_missing:
                    self.assertNotIn("plugin remove dots@dots", calls.read_text())
                self.assertNotIn("plugin remove dev-", calls.read_text())
                return
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            if second_profile:
                self.assertEqual((secondary / "dots-plugin-source").read_text(), "local\n")
                self.assertIn('model = "second-account-model"', (secondary / "config.toml").read_text())
                self.assertIn('[plugins."dots@dots"]\nenabled = true', (secondary / "config.toml").read_text())
                self.assertIn("plugin add dots@dots", (secondary / "codex-calls").read_text())
            merged = live_config.read_text()
            self.assertIn('model = "keep-my-model"', merged)
            self.assertIn('[plugins."unrelated@remote"]\nenabled = true', merged)
            self.assertIn(f'[plugins."dots@dots"]\nenabled = {str(mode == "local").lower()}', merged)
            for plugin_id in (
                "dev-6aaf4ad66f108191b548c1a6a1012373@created-by-me-remote",
                "drafts@created-by-me-remote",
            ):
                self.assertIn(f'[plugins."{plugin_id}"]\nenabled = {str(mode == "cloud").lower()}', merged)
            if mode == "cloud":
                self.assertNotIn("plugin marketplace add", calls.read_text())
                self.assertNotIn("plugin add dots@dots", calls.read_text())
                self.assertIn("plugin remove dots@dots", calls.read_text())
                repeat = subprocess.run(
                    ["zsh", str(root / "scripts" / "sync-plugins.sh"), "--codex"],
                    text=True, capture_output=True, env=env,
                )
                self.assertEqual(repeat.returncode, 0, repeat.stderr)
                self.assertNotIn("plugin add dots@dots", calls.read_text())
                self.assertEqual((home / ".codex" / "dots-plugin-source").read_text(), "cloud\n")
            else:
                self.assertIn("plugin add dots@dots", calls.read_text())
            self.assertEqual(
                sorted(path.name for path in installed_agents.iterdir()),
                ["advisor.md", "advisor.toml"],
            )
            backups = list((home / ".codex").glob("agents.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertTrue((backups[0] / "planner.toml").is_file())


if __name__ == "__main__":
    unittest.main()
