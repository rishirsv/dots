import importlib.util
import os
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "scripts" / "sync-codex-config.py"
SYNC = ROOT / "scripts" / "sync-configs.sh"

SPEC = importlib.util.spec_from_file_location("sync_codex_config", HELPER)
assert SPEC and SPEC.loader
SYNC_CODEX_CONFIG = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SYNC_CODEX_CONFIG)


PORTABLE = """\
service_tier = "default"
model = "portable-model"

[features]
apps = true

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"

[desktop]
defaultTerminalLocation = "right"
"""

LEGACY = """\
approval_policy = "never"
sandbox_mode = "danger-full-access"
service_tier = "old"
notify = [
  "/machine/notifier",
  "turn-ended",
]

[features]
apps = false

[features.multi_agent_v2]
tool_namespace = "old"

[apps._default]
open_world_enabled = true

[projects."/tmp/work"]
trust_level = "trusted"

[marketplaces.local]
source = "/tmp/local"

[mcp_servers.node_repl]
command = "/machine/node"

[mcp_servers.openaiDeveloperDocs]
url = "https://old.invalid"

[desktop]
defaultTerminalLocation = "left"

[tui.model_availability_nux]
"model" = 1

[hooks.state."local-hook"]
trusted_hash = "sha256:local"

[shell_environment_policy.set]
MACHINE_PATH = "/machine/path"
"""


class CodexConfigHelperTests(unittest.TestCase):
    def run_helper(self, operation, source, target, *extra):
        return subprocess.run(
            [
                "python3",
                str(HELPER),
                operation,
                "--source",
                str(source),
                "--target",
                str(target),
                *extra,
            ],
            text=True,
            capture_output=True,
        )

    def test_apply_preserves_only_local_ownership_and_replaces_portable_block(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            target.write_text(LEGACY)
            os.chmod(target, 0o644)

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            live = target.read_text()
            self.assertEqual(
                SYNC_CODEX_CONFIG.extract_marker(live),
                SYNC_CODEX_CONFIG.canonical_portable(PORTABLE),
            )
            self.assertIn('approval_policy = "never"', live)
            self.assertIn('[apps._default]', live)
            self.assertIn('[projects."/tmp/work"]', live)
            self.assertIn("[marketplaces.local]", live)
            self.assertIn("[mcp_servers.node_repl]", live)
            self.assertIn("[tui.model_availability_nux]", live)
            self.assertIn('[hooks.state."local-hook"]', live)
            self.assertIn("[shell_environment_policy.set]", live)
            self.assertNotIn("[features.multi_agent_v2]", live)
            self.assertNotIn("https://old.invalid", live)
            self.assertEqual(live.count("[desktop]"), 1)
            self.assertEqual(live.count("[mcp_servers.openaiDeveloperDocs]"), 1)
            self.assertEqual(stat.S_IMODE(target.stat().st_mode), 0o600)
            backups = list(root.glob("config.toml.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), LEGACY)

            status_result = self.run_helper("status", source, target)
            self.assertEqual(status_result.returncode, 0, status_result.stdout)

    def test_apply_migrates_symlink_and_backs_up_resolved_contents(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            legacy = root / "legacy.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            legacy.write_text(LEGACY)
            target.symlink_to(legacy)

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(target.is_file())
            self.assertFalse(target.is_symlink())
            backups = list(root.glob("config.toml.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertFalse(backups[0].is_symlink())
            self.assertEqual(backups[0].read_text(), LEGACY)
            legacy.write_text("# changed after migration\n")
            self.assertEqual(backups[0].read_text(), LEGACY)
            self.assertIn("[mcp_servers.node_repl]", target.read_text())

    def test_capture_writes_only_marker_content_to_source(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            target.write_text(
                'approval_policy = "never"\n\n'
                + SYNC_CODEX_CONFIG.BEGIN_MARKER
                + "\nmodel = \"captured\"\n"
                + SYNC_CODEX_CONFIG.END_MARKER
                + '\n\n[projects."/local"]\ntrust_level = "trusted"\n'
            )

            result = self.run_helper("capture", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(source.read_text(), 'model = "captured"\n')
            self.assertNotIn("approval_policy", source.read_text())
            self.assertNotIn("projects", source.read_text())

    def test_status_reports_portable_drift_without_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            target.write_text(
                SYNC_CODEX_CONFIG.BEGIN_MARKER
                + "\nmodel = \"different\"\n"
                + SYNC_CODEX_CONFIG.END_MARKER
                + "\n"
            )
            before = target.read_bytes()

            result = self.run_helper("status", source, target)

            self.assertEqual(result.returncode, 1)
            self.assertIn("portable block differs", result.stdout)
            self.assertEqual(target.read_bytes(), before)

    def test_portable_source_rejects_machine_local_sections(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('[projects."/local"]\ntrust_level = "trusted"\n')

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 2)
            self.assertIn("machine-local settings", result.stderr)
            self.assertFalse(target.exists())


class SyncConfigsIntegrationTests(unittest.TestCase):
    def test_codex_apply_and_status_keep_owned_files_as_symlinks(self):
        with tempfile.TemporaryDirectory() as home_directory:
            environment = os.environ.copy()
            environment["HOME"] = home_directory

            apply_result = subprocess.run(
                ["zsh", str(SYNC), "--codex"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )
            self.assertEqual(apply_result.returncode, 0, apply_result.stderr)

            home = Path(home_directory)
            config = home / ".codex" / "config.toml"
            self.assertTrue(config.is_file())
            self.assertFalse(config.is_symlink())
            self.assertEqual(stat.S_IMODE(config.stat().st_mode), 0o600)
            agents = home / ".codex" / "AGENTS.md"
            self.assertTrue(agents.is_symlink())
            self.assertEqual(
                agents.resolve(),
                ROOT / "configs" / "agents" / "AGENTS.md",
            )
            self.assertTrue((home / ".codex" / "keybindings.json").is_symlink())
            self.assertTrue((home / ".codex" / "agents").is_symlink())

            status_result = subprocess.run(
                ["zsh", str(SYNC), "--status", "--codex"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )
            self.assertEqual(status_result.returncode, 0, status_result.stdout)

    def test_warp_preview_copies_settings(self):
        with tempfile.TemporaryDirectory() as home_directory:
            environment = os.environ.copy()
            environment["HOME"] = home_directory
            target = Path(home_directory) / ".warp-preview" / "settings.toml"
            old_source = Path(home_directory) / "old-warp-settings.toml"
            target.parent.mkdir(parents=True)
            old_source.write_text("# old\n")
            target.symlink_to(old_source)

            result = subprocess.run(
                ["zsh", str(SYNC), "--warp-preview"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse(target.is_symlink())
            self.assertEqual(
                target.read_bytes(),
                (ROOT / "configs" / "warp-preview" / "settings.toml").read_bytes(),
            )


if __name__ == "__main__":
    unittest.main()
