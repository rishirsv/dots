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
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "scripts").mkdir()
            shutil.copy2(ROOT / "scripts" / "sync-plugins.sh", root / "scripts")

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

            bin_dir = root / "bin"
            bin_dir.mkdir()
            git = bin_dir / "git"
            git.write_text("#!/bin/sh\nexit 0\n")
            git.chmod(0o755)
            codex = bin_dir / "codex"
            codex.write_text(
                "#!/bin/sh\n"
                "if [ \"$1 $2\" = \"plugin list\" ]; then\n"
                "  printf '%s\\n' '{\"installed\":[{\"pluginId\":\"dots@dots\",\"version\":\"1.0.0\"}]}'\n"
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
            self.assertEqual(
                sorted(path.name for path in installed_agents.iterdir()),
                ["advisor.md", "advisor.toml"],
            )
            backups = list((home / ".codex").glob("agents.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertTrue((backups[0] / "planner.toml").is_file())


if __name__ == "__main__":
    unittest.main()
