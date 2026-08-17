import importlib.util
from io import StringIO
from pathlib import Path
import tempfile
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
HELPER = ROOT / "scripts" / "sync-codex-computer-use.py"
SPEC = importlib.util.spec_from_file_location("sync_codex_computer_use", HELPER)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class CodexComputerUseSyncTests(unittest.TestCase):
    def test_helper_capability_check(self):
        with tempfile.TemporaryDirectory() as directory:
            helper = Path(directory) / "helper"
            helper.write_bytes(b"prefix" + MODULE.KEY.encode() + b"suffix")
            self.assertTrue(MODULE.helper_supports_setting(helper))
            helper.write_bytes(b"unrelated")
            self.assertFalse(MODULE.helper_supports_setting(helper))
            helper.unlink()
            self.assertIsNone(MODULE.helper_supports_setting(helper))

    @mock.patch.object(MODULE, "write_setting")
    @mock.patch.object(MODULE, "read_setting", return_value=None)
    @mock.patch.object(MODULE, "helper_supports_setting", return_value=True)
    def test_apply_writes_both_service_domains(self, _supports, _read, write):
        output = StringIO()
        with mock.patch("sys.stdout", output):
            result = MODULE.run("apply", False)
        self.assertEqual(result, 0)
        self.assertEqual(
            [call.args[0] for call in write.call_args_list],
            list(MODULE.DOMAINS),
        )
        self.assertIn("Enabled", output.getvalue())

    @mock.patch.object(MODULE, "write_setting")
    @mock.patch.object(MODULE, "read_setting", return_value=False)
    @mock.patch.object(MODULE, "helper_supports_setting", return_value=True)
    def test_dry_run_does_not_write(self, _supports, _read, write):
        result = MODULE.run("apply", True)
        self.assertEqual(result, 0)
        write.assert_not_called()

    @mock.patch.object(MODULE, "read_setting", return_value=True)
    @mock.patch.object(MODULE, "helper_supports_setting", return_value=True)
    def test_status_is_current_when_both_domains_are_true(self, _supports, _read):
        self.assertEqual(MODULE.run("status", False), 0)

    @mock.patch.object(MODULE, "read_setting", return_value=False)
    @mock.patch.object(MODULE, "helper_supports_setting", return_value=True)
    def test_status_reports_drift(self, _supports, _read):
        self.assertEqual(MODULE.run("status", False), 1)

    @mock.patch.object(MODULE, "helper_supports_setting", return_value=False)
    def test_removed_setting_fails_closed(self, _supports):
        with self.assertRaisesRegex(MODULE.SyncError, "no longer exposes"):
            MODULE.run("apply", False)


if __name__ == "__main__":
    unittest.main()
