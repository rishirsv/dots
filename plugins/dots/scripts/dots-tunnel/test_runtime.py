"""Lifecycle decisions without account traffic or real process termination."""
import json
from pathlib import Path
import shlex
import subprocess
import tempfile
import sys
import unittest

from runtime import manage, preflight

TOOLS = {"jsonrpc": "2.0", "id": 2, "result": {"tools": [{"name": "read_file"}]}}


class LifecycleTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ("bin/tunnel-client", "secrets/tunnel-runtime.key"):
            path = self.root / name
            path.parent.mkdir(exist_ok=True)
            path.touch()
        self.config = {"tunnel_id": "test-tunnel", "python": "/venv/python",
                       "mounts": {"Code": "/test code"}, "state": "/state", "exec": False}
        (self.root / "config.json").write_text(json.dumps(self.config))
        self.server = self.root / "plugin/scripts/dots-tunnel/server.py"
        self.calls = []

    def runner(self, replies, preflight=TOOLS, preflight_code=0):
        def run(args, **kwargs):
            self.calls.append(args)
            if args[0] == "/venv/python":
                return subprocess.CompletedProcess(args, preflight_code, json.dumps(preflight) + "\n",
                                                   "can't open file server.py")
            return subprocess.CompletedProcess(args, 0, json.dumps(replies.pop(0)), "")
        return run

    def start(self, replies, **kwargs):
        return manage("start", self.root, self.runner(replies, **kwargs), server=self.server, wait=0)

    def test_ready_is_reused_without_connect(self):
        self.assertTrue(self.start([{"ready": True, "process_running": True}])["ready"])
        self.assertEqual(len(self.calls), 1)

    def test_connect_is_built_from_config_and_current_server(self):
        self.assertTrue(self.start([{}, {}, {"ready": True, "process_running": True}])["ready"])
        preflight, connect = self.calls[1], self.calls[2]
        expected = ["/venv/python", str(self.server), "--mount", "Code=/test code", "--state", "/state"]
        self.assertEqual(preflight, expected)
        self.assertEqual(shlex.split(connect[connect.index("--mcp-command") + 1]), expected)
        self.assertEqual(connect[connect.index("--tunnel-id") + 1], "test-tunnel")
        self.assertEqual(connect[connect.index("--runtime-api-key") + 1],
                         "file:" + str(self.root / "secrets/tunnel-runtime.key"))

    def test_broken_server_is_reported_before_connecting(self):
        with self.assertRaisesRegex(RuntimeError, "exit 2.*can't open file"):
            self.start([{}], preflight={}, preflight_code=2)
        self.assertNotIn("connect", [call[2] for call in self.calls if len(call) > 2])

    def test_exec_config_requires_command_tools(self):
        self.config["exec"] = True
        (self.root / "config.json").write_text(json.dumps(self.config))
        with self.assertRaisesRegex(RuntimeError, "command tools"):
            self.start([{}])

    def test_server_exit_after_connect_is_named(self):
        log = self.root / "tunnel.log"
        log.write_text(json.dumps({"time": "2999-01-01T00:00:00", "msg": "stdio MCP command exited",
                                   "error": "exit status 2"}) + "\n")
        stopped = {"process_running": False, "process": {"log_path": str(log)}}
        with self.assertRaisesRegex(RuntimeError, "server exited: exit status 2"):
            self.start([{}, {}, stopped, stopped])

    def test_unhealthy_running_process_is_not_restarted(self):
        with self.assertRaisesRegex(RuntimeError, "leaving it untouched"):
            self.start([{"process_running": True}])
        self.assertEqual(len(self.calls), 1)

    def test_missing_config_does_not_create_connection(self):
        (self.root / "config.json").unlink()
        with self.assertRaisesRegex(RuntimeError, "setup is missing"):
            self.start([{}])
        self.assertEqual(len(self.calls), 1)

    def test_relative_mount_is_rejected(self):
        self.config["mounts"] = {"Code": "Code"}
        (self.root / "config.json").write_text(json.dumps(self.config))
        with self.assertRaisesRegex(RuntimeError, "absolute"):
            self.start([{}])

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

    def test_supervisor_start_respects_pause_under_lifecycle_lock(self):
        (self.root/'paused').touch()
        result = manage('start', self.root, self.runner([{}]), respect_pause=True)
        self.assertFalse(result['running'])
        self.assertEqual(len(self.calls), 1)
        self.assertTrue((self.root/'paused').exists())


class LivePreflightTests(unittest.TestCase):
    def test_stdio_handshake_keeps_input_open_until_catalog_reply(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)/'project'
            root.mkdir()
            server = Path(__file__).with_name('server.py')
            for _ in range(5):
                preflight([sys.executable, str(server), '--mount', 'P='+str(root), '--state', str(Path(temp)/'state')], False)


if __name__ == "__main__":
    unittest.main()
