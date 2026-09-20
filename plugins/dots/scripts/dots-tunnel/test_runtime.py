"""Lifecycle decisions without account traffic or real process termination."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

from runtime import manage


class LifecycleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ("bin/tunnel-client", "profiles/dots-tunnel.yaml", "secrets/tunnel-runtime.key"):
            path = self.root / name
            path.parent.mkdir(exist_ok=True)
            path.touch()
        self.saved = {"target_kind": "command", "target_value": 'python server.py --root "test project"',
                      "tunnel_id": "test-tunnel", "profile_dir": str(self.root / "profiles"),
                      "profile_name": "dots-tunnel"}
        self.calls = []

    def runner(self, replies):
        def run(args, **kwargs):
            self.calls.append(args)
            return subprocess.CompletedProcess(args, 0, json.dumps(replies.pop(0)), "")
        return run

    def test_ready_is_reused_without_connect(self):
        self.assertTrue(manage("start", self.root, self.runner([
            {"ready": True, "process_running": True}]))["ready"])
        self.assertEqual(len(self.calls), 1)

    def test_stopped_uses_saved_scope_and_verifies(self):
        result = manage("start", self.root, self.runner([
            {"process": self.saved}, {}, {"ready": True, "process_running": True}]))
        self.assertTrue(result["ready"])
        connect = self.calls[1]
        self.assertEqual(connect[connect.index("--mcp-command") + 1], self.saved["target_value"])
        self.assertEqual(connect[connect.index("--tunnel-id") + 1], "test-tunnel")
        self.assertTrue(connect[connect.index("--runtime-api-key") + 1].startswith("file:"))
        self.assertEqual(self.calls[2][2], "status")

    def test_unhealthy_running_process_is_not_restarted(self):
        with self.assertRaisesRegex(RuntimeError, "leaving it untouched"):
            manage("start", self.root, self.runner([{"process_running": True}]))
        self.assertEqual(len(self.calls), 1)

    def test_missing_setup_does_not_create_connection(self):
        with self.assertRaisesRegex(RuntimeError, "setup is missing"):
            manage("start", self.root, self.runner([{}]))
        self.assertEqual(len(self.calls), 1)

    def test_stop_verifies_process_exit(self):
        self.assertFalse(manage("stop", self.root, self.runner([
            {"ready": True, "process_running": True}, {}, {"runtime_state": "stopped"}]))["running"])
        self.assertEqual([call[2] for call in self.calls], ["status", "stop", "status"])

    def test_client_failure_does_not_leak_diagnostics_or_retry(self):
        def fail(args, **kwargs):
            self.calls.append(args)
            return subprocess.CompletedProcess(args, 1, "sensitive output", "sensitive diagnostic")
        with self.assertRaisesRegex(RuntimeError, "No automatic retry") as error:
            manage("start", self.root, fail)
        self.assertNotIn("sensitive", str(error.exception))
        self.assertEqual(len(self.calls), 1)
