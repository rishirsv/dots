from __future__ import annotations

import os
from pathlib import Path
import shutil
import stat
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "scripts" / "sync-codex-config.py"
SYNC = ROOT / "scripts" / "sync-configs.sh"

PORTABLE = """\
approval_policy = "never"
sandbox_mode = "danger-full-access"
model = "gpt-6-astra"

[features]
context_management = true

[desktop]
defaultTerminalLocation = "right"
"""

LIVE = """\
approval_policy = "on-request"
default_permissions = "workspace-write"
approvals_reviewer = "user"
service_tier = "priority"

[permissions.workspace]
description = "Machine-local permission profile"

[features]
context_management = false
chronicle = true

[desktop]
defaultTerminalLocation = "left"
dock-icon-preference = "app-default"

[projects."/tmp/work"]
trust_level = "trusted"

[mcp_servers.local]
command = "/machine/server"
"""


class CodexConfigHelperTests(unittest.TestCase):
    def setUp(self) -> None:
        self.assertIsNotNone(shutil.which("uv"), "uv is required for config tests")

    def run_helper(self, operation, source, target, *extra):
        return subprocess.run(
            [
                "uv",
                "run",
                "--quiet",
                "--script",
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

    def test_apply_overlays_managed_keys_and_preserves_unmanaged_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            target.write_text(LIVE)
            os.chmod(target, 0o644)

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            live = target.read_text()
            self.assertIn('approval_policy = "never"', live)
            self.assertIn('sandbox_mode = "danger-full-access"', live)
            self.assertNotIn("default_permissions", live)
            self.assertNotIn("[permissions.workspace]", live)
            self.assertNotIn("approvals_reviewer", live)
            self.assertIn('service_tier = "priority"', live)
            self.assertIn("chronicle = true", live)
            self.assertIn('dock-icon-preference = "app-default"', live)
            self.assertIn('[projects."/tmp/work"]', live)
            self.assertIn("[mcp_servers.local]", live)
            self.assertEqual(stat.S_IMODE(target.stat().st_mode), 0o600)
            backups = list(root.glob("config.toml.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), LIVE)

            status = self.run_helper("status", source, target)
            self.assertEqual(status.returncode, 0, status.stdout + status.stderr)

    def test_status_ignores_formatting_and_table_order(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(
                'model = "gpt-6-astra"\n\n'
                '[features]\ncontext_management = true\n\n'
                '[desktop]\ndefaultTerminalLocation = "right"\n'
            )
            target.write_text(
                'model="gpt-6-astra"\n\n'
                '[desktop]\ndefaultTerminalLocation="right"\n\n'
                '[features]\ncontext_management=true\n'
            )
            os.chmod(target, 0o600)
            before = target.read_bytes()

            result = self.run_helper("status", source, target)

            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertEqual(target.read_bytes(), before)

    def test_removing_source_key_relinquishes_ownership(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('model = "gpt-6-astra"\n')
            target.write_text('model = "gpt-6-astra"\nservice_tier = "priority"\n')
            os.chmod(target, 0o600)

            source.write_text("")
            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('model = "gpt-6-astra"', target.read_text())
            self.assertEqual(list(root.glob("config.toml.bak.*")), [])

    def test_apply_migrates_symlink_and_backs_up_resolved_contents(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            legacy = root / "legacy.toml"
            target = root / "config.toml"
            source.write_text(PORTABLE)
            legacy.write_text(LIVE)
            target.symlink_to(legacy)

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(target.is_file())
            self.assertFalse(target.is_symlink())
            backups = list(root.glob("config.toml.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), LIVE)
            self.assertIn("[mcp_servers.local]", target.read_text())

    def test_apply_removes_legacy_markers_when_rewriting(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('model = "gpt-6-astra"\n')
            target.write_text(
                "# >>> Dots portable Codex config >>>\n"
                'model = "old"\n'
                "# <<< Dots portable Codex config <<<\n"
                'service_tier = "priority"\n'
            )

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn("Dots portable Codex config", target.read_text())
            self.assertIn('service_tier = "priority"', target.read_text())

    def test_permission_profile_replaces_legacy_sandbox_selector(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(
                'approval_policy = "never"\n'
                'default_permissions = "dots"\n'
                '\n[permissions.dots]\n'
                'description = "Power user config."\n'
                '\n[permissions.dots.filesystem]\n'
                '":root" = "write"\n'
                '\n[permissions.dots.network]\n'
                'enabled = true\n'
                'allow_local_binding = true\n'
                'dangerously_allow_all_unix_sockets = true\n'
            )
            target.write_text(
                'approval_policy = "on-request"\n'
                'sandbox_mode = "danger-full-access"\n'
            )

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 0, result.stderr)
            live = target.read_text()
            self.assertIn('default_permissions = "dots"', live)
            self.assertNotIn("sandbox_mode", live)
            self.assertIn("[permissions.dots.filesystem]", live)

    def test_source_rejects_conflicting_permissions_and_local_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text(
                'default_permissions = "Dots"\n'
                'sandbox_mode = "danger-full-access"\n'
                '\n[projects."/local"]\ntrust_level = "trusted"\n'
            )

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 2)
            self.assertIn("cannot combine", result.stderr)
            self.assertFalse(target.exists())

    def test_source_rejects_machine_local_tables(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('[projects."/local"]\ntrust_level = "trusted"\n')

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 2)
            self.assertIn("machine-local settings", result.stderr)
            self.assertFalse(target.exists())

    def test_table_source_rejects_live_scalar_collision(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('[desktop]\ndefaultTerminalLocation = "right"\n')
            target.write_text('desktop = "legacy"\n')

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 2)
            self.assertIn("conflicts with a scalar", result.stderr)
            self.assertEqual(target.read_text(), 'desktop = "legacy"\n')

    def test_invalid_merged_schema_does_not_write_or_back_up(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.toml"
            target = root / "config.toml"
            source.write_text('model = "gpt-6-astra"\n')
            target.write_text(
                '[projects."/tmp/work"]\n'
                'trust_level = "trusted"\n'
                'unknown_project_setting = true\n'
            )
            before = target.read_bytes()

            result = self.run_helper("apply", source, target)

            self.assertEqual(result.returncode, 2)
            self.assertIn("strict schema validation failed", result.stderr)
            self.assertEqual(target.read_bytes(), before)
            self.assertEqual(list(root.glob("config.toml.bak.*")), [])


class SyncConfigsIntegrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.assertIsNotNone(shutil.which("uv"), "uv is required for config tests")

    def test_codex_apply_and_status_copy_owned_files_without_app_repairs(self):
        script = SYNC.read_text()
        self.assertNotIn("sync-codex-computer-use.py", script)
        self.assertNotIn("sync-tinycast-config.py", script)
        self.assertNotIn("repair-wispr-logitech-shortcut.sh", script)

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
            self.assertEqual(stat.S_IMODE(config.stat().st_mode), 0o600)
            self.assertIn('model = "gpt-6-astra"', config.read_text())
            self.assertEqual(
                (home / ".codex" / "AGENTS.md").read_bytes(),
                (ROOT / "configs" / "agents" / "AGENTS.md").read_bytes(),
            )
            self.assertEqual(
                (home / ".codex" / "keybindings.json").read_bytes(),
                (ROOT / "configs" / "codex" / "keybindings.json").read_bytes(),
            )
            self.assertTrue((home / ".codex" / "agents" / "worker.toml").is_file())

            status = subprocess.run(
                ["zsh", str(SYNC), "--status", "--codex"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )
            self.assertEqual(status.returncode, 0, status.stdout + status.stderr)

    def test_claude_apply_and_status_copy_owned_files(self):
        with tempfile.TemporaryDirectory() as home_directory:
            environment = os.environ.copy()
            environment["HOME"] = home_directory

            apply_result = subprocess.run(
                ["zsh", str(SYNC), "--claude"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )
            self.assertEqual(apply_result.returncode, 0, apply_result.stderr)

            home = Path(home_directory)
            self.assertEqual(
                (home / ".claude" / "CLAUDE.md").read_bytes(),
                (ROOT / "configs" / "agents" / "AGENTS.md").read_bytes(),
            )
            self.assertEqual(
                (home / ".claude" / "keybindings.json").read_bytes(),
                (ROOT / "configs" / "claude" / "keybindings.json").read_bytes(),
            )

            status = subprocess.run(
                ["zsh", str(SYNC), "--status", "--claude"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )
            self.assertEqual(status.returncode, 0, status.stdout)

    def test_ghostty_copies_config(self):
        with tempfile.TemporaryDirectory() as home_directory:
            environment = os.environ.copy()
            environment["HOME"] = home_directory
            target = Path(home_directory) / ".config" / "ghostty" / "config.ghostty"
            old_source = Path(home_directory) / "old-ghostty-config"
            target.parent.mkdir(parents=True)
            old_source.write_text("# old\n")
            target.symlink_to(old_source)

            result = subprocess.run(
                ["zsh", str(SYNC), "--ghostty"],
                cwd=ROOT,
                env=environment,
                text=True,
                capture_output=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertFalse(target.is_symlink())
            self.assertEqual(
                target.read_bytes(),
                (ROOT / "configs" / "ghostty" / "config.ghostty").read_bytes(),
            )


if __name__ == "__main__":
    unittest.main()
