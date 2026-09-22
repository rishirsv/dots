"""Actual stdio protocol tests, no account or browser traffic."""
import hashlib
import json
import os
from pathlib import Path
import select
import shutil
import subprocess
import sys
import tempfile
import time
import unittest

from server import SKILL_PATH, SKILL_URI


class Wire:
    def __init__(self, root, state, mounts=None, execution=False):
        scope = ([arg for name, path in mounts.items() for arg in ("--mount", f"{name}={path}")]
                 if mounts else ["--root", str(root)])
        self.process = subprocess.Popen(
            [sys.executable, str(Path(__file__).with_name("server.py")), *scope, "--state", str(state),
             *(["--exec"] if execution else [])],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)
        self.sequence = 0

    def send(self, method, params=None, modern=True):
        self.sequence += 1
        params = dict(params or {})
        if modern:
            params["_meta"] = {"io.modelcontextprotocol/protocolVersion": "2026-07-28",
                               "io.modelcontextprotocol/clientCapabilities": {"extensions": {"io.modelcontextprotocol/skills": {}}}}
        self.process.stdin.write(json.dumps({"jsonrpc": "2.0", "id": self.sequence, "method": method, "params": params}) + "\n")
        self.process.stdin.flush()
        end = time.monotonic() + 10
        while time.monotonic() < end:
            ready, _, _ = select.select([self.process.stdout], [], [], max(0, end - time.monotonic()))
            if not ready:
                break
            line = self.process.stdout.readline()
            if not line:
                raise AssertionError("Server exited: " + self.process.stderr.read())
            value = json.loads(line)
            if value.get("id") == self.sequence:
                return value
        raise AssertionError("MCP request timed out")

    def close(self):
        self.process.stdin.close()
        try:
            self.process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.process.terminate()
            self.process.wait(timeout=5)
        self.process.stdout.close()
        self.process.stderr.close()


class ProtocolTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "project"
        self.root.mkdir()
        self.state = Path(self.temp.name) / "state"
        self.wire = Wire(self.root, self.state)

    def tearDown(self):
        self.wire.close()
        self.temp.cleanup()

    def tool(self, name, args):
        result = self.wire.send("tools/call", {"name": name, "arguments": args})
        self.assertNotIn("error", result, result)
        return result["result"]

    def test_modern_discovery_skill_integrity_and_no_handshake(self):
        discovered = self.wire.send("server/discover")["result"]
        self.assertIn("2026-07-28", discovered["supportedVersions"])
        self.assertIn("io.modelcontextprotocol/skills", discovered["capabilities"]["extensions"])
        result = self.wire.send("skills/list")["result"]
        self.assertEqual(result["resultType"], "complete")
        self.assertEqual(result["cacheScope"], "public")
        entry = result["skills"][0]
        self.assertEqual(self.wire.send("skills/get", {"uri": SKILL_URI})["result"]["skill"], entry)
        for resource in entry["resources"]:
            data = self.wire.send("resources/read", {"uri": resource["uri"]})["result"]["contents"][0]["text"].encode()
            self.assertEqual(len(data), resource["size"])
            self.assertEqual("sha256:" + hashlib.sha256(data).hexdigest(), resource["digest"])
        self.assertEqual(self.wire.send("skills/get", {"uri": "skill://other/SKILL.md"})["error"]["code"], -32602)
        tools = self.wire.send("tools/list")["result"]
        self.assertEqual([t["name"] for t in tools["tools"]], ["apply_patch", "list_files", "read_file", "search_files", "get_workflow"])
        workflow = self.tool("get_workflow", {})["structuredContent"]
        self.assertFalse(workflow["execution_enabled"])
        self.assertEqual(workflow["skill"], SKILL_PATH.read_text())
        self.assertGreater(tools["ttlMs"], 0)
        self.assertFalse(tools["tools"][0]["annotations"]["readOnlyHint"])
        self.assertLess(len(json.dumps(tools)), 6000)

    def test_two_turn_file_workflow_and_restart(self):
        (self.root / "canary.txt").write_text("unknown-" + os.urandom(8).hex() + "\n")
        first = self.tool("read_file", {"path": "canary.txt"})["structuredContent"]
        patch = "*** Begin Patch\n*** Update File: canary.txt\n@@\n-" + first["content"].rstrip("\n") + "\n+first-edit\n*** End Patch"
        updated = self.tool("apply_patch", {"input": patch, "expected_revision": first["revision"]})
        self.assertFalse(updated.get("isError", False), updated)
        self.assertEqual((self.root / "canary.txt").read_text(), "first-edit\n")
        denied = self.tool("apply_patch", {"input": patch, "expected_revision": first["revision"]})
        self.assertTrue(denied["isError"])
        self.wire.close()
        self.wire = Wire(self.root, self.state)
        second = self.tool("read_file", {"path": "canary.txt"})["structuredContent"]
        patch2 = "*** Begin Patch\n*** Update File: canary.txt\n@@\n-first-edit\n+second-edit\n*** End Patch"
        self.assertFalse(self.tool("apply_patch", {"input": patch2, "expected_revision": second["revision"]}).get("isError", False))
        self.assertEqual((self.root / "canary.txt").read_text(), "second-edit\n")
        self.assertTrue(self.tool("read_file", {"path": "../outside"})["isError"])

    def test_legacy_tunnel_compatibility(self):
        init = self.wire.send("initialize", {"protocolVersion": "2025-11-25", "capabilities": {},
                                             "clientInfo": {"name": "dots-tunnel-legacy-test", "version": "1"}}, modern=False)
        self.assertEqual(init["result"]["protocolVersion"], "2025-11-25")
        self.wire.process.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n')
        self.wire.process.stdin.flush()
        tools = self.wire.send("tools/list", modern=False)
        self.assertEqual(len(tools["result"]["tools"]), 5)

    @unittest.skipUnless(shutil.which("codex"), "Native Codex required")
    def test_native_tools_over_stateless_mcp(self):
        self.wire.close()
        self.wire = Wire(self.root, self.state, execution=True)
        tools = self.wire.send("tools/list")["result"]["tools"]
        schemas = {tool["name"]: tool["inputSchema"] for tool in tools}
        self.assertEqual(set(schemas["exec_command"]["properties"]), {
            "cmd", "workdir", "shell", "login", "tty", "yield_time_ms", "max_output_tokens",
            "sandbox_permissions", "justification", "prefix_rule"})
        self.assertTrue(self.tool("get_workflow", {})["structuredContent"]["execution_enabled"])
        result = self.tool("exec_command", {"cmd": "printf MCP_NATIVE", "workdir": str(self.root), "login": False})
        self.assertFalse(result.get("isError", False), result)
        self.assertEqual(result["structuredContent"]["exit_code"], 0)
        self.assertEqual(result["structuredContent"]["output"], "MCP_NATIVE")
        running = self.tool("exec_command", {"cmd": "sleep 30", "workdir": str(self.root), "yield_time_ms": 250})
        session = running["structuredContent"]["session_id"]
        self.assertIn("exit_code", self.tool("terminate_command", {"session_id": session})["structuredContent"])
        denied = self.tool("exec_command", {"cmd": "true", "sandbox_permissions": "require_escalated"})
        self.assertTrue(denied["isError"])


if __name__ == "__main__":
    unittest.main()
