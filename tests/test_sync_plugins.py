import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class SyncPluginsTests(unittest.TestCase):
    def test_codex_sync_replaces_stale_agent_profiles_and_keeps_backup(self):
        self.run_codex_sync(disabled=False)

    def test_codex_sync_preserves_disabled_local_plugin(self):
        self.run_codex_sync(disabled=True)

    def run_codex_sync(self, *, disabled):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "scripts").mkdir()
            shutil.copy2(ROOT / "scripts" / "sync-plugins.sh", root / "scripts")
            shutil.copy2(ROOT / "scripts" / "sync-codex-config.py", root / "scripts")
            config_source = root / "configs" / "codex"
            config_source.mkdir(parents=True)
            shutil.copy2(ROOT / "configs" / "codex" / "plugin-exclusions.toml", config_source)

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
                f'[plugins."dots@dots"]\nenabled = {str(not disabled).lower()}\n'
            )

            bin_dir = root / "bin"
            bin_dir.mkdir()
            git = bin_dir / "git"
            git.write_text("#!/bin/sh\nexit 0\n")
            git.chmod(0o755)
            codex = bin_dir / "codex"
            installed = {"installed": [{
                "pluginId": "dots@dots",
                "version": "0.9.0" if disabled else "1.0.0",
                "enabled": not disabled,
            }]}
            calls = root / "codex-calls"
            codex.write_text(
                "#!/bin/sh\n"
                f"printf '%s\\n' \"$*\" >> '{calls}'\n"
                "if [ \"$1 $2\" = \"plugin list\" ]; then\n"
                f"  printf '%s\\n' '{json.dumps(installed)}'\n"
                "fi\n"
            )
            codex.chmod(0o755)

            env = os.environ.copy()
            env["HOME"] = str(home)
            env.pop("CODEX_HOME", None)
            env["PATH"] = f"{bin_dir}:{env['PATH']}"
            result = subprocess.run(
                ["zsh", str(root / "scripts" / "sync-plugins.sh"), "--codex"],
                text=True,
                capture_output=True,
                env=env,
            )

            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            merged = live_config.read_text()
            self.assertIn('model = "keep-my-model"', merged)
            self.assertIn('[plugins."unrelated@remote"]\nenabled = true', merged)
            self.assertIn(f'[plugins."dots@dots"]\nenabled = {str(not disabled).lower()}', merged)
            for plugin_id in (
                "dev-6aaf4ad66f108191b548c1a6a1012373@created-by-me-remote",
                "drafts@created-by-me-remote",
            ):
                self.assertIn(f'[plugins."{plugin_id}"]\nenabled = false', merged)
            if disabled:
                self.assertNotIn("plugin add dots@dots", calls.read_text())
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
