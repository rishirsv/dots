import json
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "scripts" / "sync-codex-desktop-permissions.py"


class CodexDesktopPermissionSyncTests(unittest.TestCase):
    def run_helper(self, operation, source, state, *extra):
        return subprocess.run(
            [
                "python3",
                str(HELPER),
                operation,
                "--source",
                str(source),
                "--state",
                str(state),
                *extra,
            ],
            text=True,
            capture_output=True,
        )

    def write_source(self, root, profile="Dots"):
        source = root / "config.toml"
        source.write_text('default_permissions = "{}"\n'.format(profile))
        return source

    def write_state(self, root, selection):
        state = root / ".codex-global-state.json"
        state.write_text(
            json.dumps(
                {
                    "unrelated": {"keep": True},
                    "electron-persisted-atom-state": {
                        "permission-selection-by-host-id:local": selection,
                    },
                }
            )
        )
        state.chmod(0o600)
        return state

    def test_fresh_machine_needs_no_runtime_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root)
            state = root / "missing.json"
            result = self.run_helper("apply", source, state)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("No Codex Desktop permission state", result.stdout)
            self.assertFalse(state.exists())

    def test_apply_aligns_selection_to_named_profile_and_backs_up(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root)
            state = self.write_state(
                root, {"kind": "agent-mode", "agentMode": "read-only"}
            )
            original = state.read_text()
            result = self.run_helper("apply", source, state)
            self.assertEqual(result.returncode, 0, result.stderr)
            parsed = json.loads(state.read_text())
            atoms = parsed["electron-persisted-atom-state"]
            self.assertEqual(
                atoms["permission-selection-by-host-id:local"],
                {"kind": "profile", "profileId": "Dots"},
            )
            self.assertEqual(parsed["unrelated"], {"keep": True})
            self.assertEqual(stat.S_IMODE(state.stat().st_mode), 0o600)
            backups = list(root.glob(".codex-global-state.json.bak.*"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), original)

    def test_apply_refuses_while_desktop_can_overwrite_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root)
            state = self.write_state(
                root, {"kind": "agent-mode", "agentMode": "read-only"}
            )
            before = state.read_bytes()
            result = self.run_helper(
                "apply", source, state, "--desktop-running"
            )
            self.assertEqual(result.returncode, 2)
            self.assertIn("quit ChatGPT and rerun", result.stderr)
            self.assertEqual(state.read_bytes(), before)

    def test_status_reports_any_different_selection_as_drift(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root)
            state = self.write_state(
                root, {"kind": "agent-mode", "agentMode": "read-only"}
            )
            drift = self.run_helper("status", source, state)
            self.assertEqual(drift.returncode, 1)
            self.write_state(
                root, {"kind": "profile", "profileId": "Dots"}
            )
            current = self.run_helper("status", source, state)
            self.assertEqual(current.returncode, 0, current.stdout)

    def test_apply_still_supports_documented_builtin_profile(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root, ":danger-full-access")
            state = self.write_state(
                root, {"kind": "agent-mode", "agentMode": "read-only"}
            )
            result = self.run_helper("apply", source, state)
            self.assertEqual(result.returncode, 0, result.stderr)
            atoms = json.loads(state.read_text())["electron-persisted-atom-state"]
            self.assertEqual(
                atoms["permission-selection-by-host-id:local"],
                {"kind": "agent-mode", "agentMode": "full-access"},
            )

    def test_dry_run_reports_alignment_without_writing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_source(root)
            state = self.write_state(
                root, {"kind": "agent-mode", "agentMode": "read-only"}
            )
            before = state.read_bytes()
            result = self.run_helper("apply", source, state, "--dry-run")
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("Would align", result.stdout)
            self.assertEqual(state.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
