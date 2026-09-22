"""Exercise the real Codex sandbox and process protocol without model requests."""
import asyncio
import os
from pathlib import Path
import shutil
import tempfile
import unittest
import anyio

from execution import Execution


@unittest.skipUnless(shutil.which("codex"), "Codex CLI required for native execution validation")
class ExecutionTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="dots-native-test-")
        self.root = Path(self.temp.name, "project")
        self.root.mkdir()
        self.executor = Execution([self.root])

    async def asyncTearDown(self):
        await self.executor.close()
        self.temp.cleanup()

    async def run_command(self, cmd, **kwargs):
        return await self.executor.exec_command(cmd, workdir=str(self.root), login=False, **kwargs)

    async def test_completion_exit_and_bounded_output(self):
        result = await self.run_command("printf NATIVE_OK; exit 7")
        self.assertEqual(result["exit_code"], 7)
        self.assertEqual(result["output"], "NATIVE_OK")
        result = await self.run_command("yes output | head -c 100000", max_output_tokens=10)
        self.assertIn("truncated", result["output"])
        self.assertLess(len(result["output"]), 150)

    async def test_interactive_poll_and_termination(self):
        result = await self.run_command("read answer; printf 'GOT:%s' \"$answer\"", tty=True, yield_time_ms=250)
        session = result["session_id"]
        result = await self.executor.write_stdin(session, "hello\n", yield_time_ms=1000)
        self.assertEqual(result["exit_code"], 0)
        self.assertIn("GOT:hello", result["output"])
        with self.assertRaises(ValueError):
            await self.executor.write_stdin(session)
        result = await self.run_command("sleep 30 & echo $!; wait", shell="/bin/sh", yield_time_ms=250)
        pid = int(result["output"].strip())
        stopped = await self.executor.terminate_command(result["session_id"])
        self.assertIn("exit_code", stopped)
        for _ in range(20):
            try:
                os.kill(pid, 0)
            except ProcessLookupError:
                break
            await asyncio.sleep(.05)
        else:
            self.fail("Native cancellation left descendant alive")

    async def test_actual_filesystem_and_network_boundary(self):
        outside = Path(self.temp.name, "outside.txt")
        outside.write_text("OUTSIDE_CANARY")
        (self.root / "escape").symlink_to(outside)
        (self.root / ".env.test").write_text("SECRET_CANARY")
        allowed = await self.run_command("printf allowed > allowed.txt; cat allowed.txt")
        self.assertEqual(allowed["output"], "allowed")
        for cmd in [f"cat '{outside}'", "cat escape", "cat .env.test", f"printf changed > '{outside}'"]:
            result = await self.run_command(cmd)
            self.assertNotEqual(result["exit_code"], 0, result)
            self.assertNotIn("CANARY", result["output"])
        self.assertEqual(outside.read_text(), "OUTSIDE_CANARY")
        accepted = []
        async def connection(reader, writer):
            accepted.append(True)
            writer.close()
        listener = await asyncio.start_server(connection, "127.0.0.1", 0)
        try:
            port = listener.sockets[0].getsockname()[1]
            result = await self.run_command(f"/usr/bin/curl --max-time 1 http://127.0.0.1:{port}")
            self.assertNotEqual(result["exit_code"], 0)
            self.assertFalse(accepted)
        finally:
            listener.close()
            await listener.wait_closed()

    async def test_scope_escalation_and_cross_instance_handles(self):
        with self.assertRaises(ValueError):
            await self.executor.exec_command("true", workdir="/")
        with self.assertRaises(ValueError):
            await self.run_command("true", sandbox_permissions="require_escalated")
        result = await self.run_command("sleep 30", yield_time_ms=250)
        other = Execution([self.root])
        with self.assertRaises(ValueError):
            await other.write_stdin(result["session_id"])
        await self.executor.terminate_command(result["session_id"])

    async def test_shutdown_and_concurrent_collection(self):
        result = await self.run_command("sleep .4; printf ONCE", yield_time_ms=250)
        session = result["session_id"]
        results = await asyncio.gather(self.executor.write_stdin(session),
                                       self.executor.write_stdin(session), return_exceptions=True)
        self.assertEqual(sum(isinstance(item, ValueError) for item in results), 1)
        self.assertEqual([item["output"] for item in results if isinstance(item, dict)], ["ONCE"])
        result = await self.run_command("sleep 30 & echo $!; wait", shell="/bin/sh", yield_time_ms=250)
        pid = int(result["output"].strip())
        await self.executor.close()
        with self.assertRaises(ProcessLookupError):
            os.kill(pid, 0)

    async def test_input_is_not_blocked_by_a_pending_poll(self):
        running = await self.run_command("read answer; printf DONE", tty=True, yield_time_ms=250)
        session = running["session_id"]
        poll = asyncio.create_task(self.executor.write_stdin(session, yield_time_ms=300000))
        await asyncio.sleep(.01)
        # The collector owns output. Sending input must still reach the process.
        try:
            await asyncio.wait_for(self.executor.write_stdin(session, "yes\n"), 2)
        except ValueError:
            pass  # The concurrent poll consumed the completed handle.
        result = await asyncio.wait_for(poll, 2)
        self.assertEqual(result["exit_code"], 0)
        self.assertIn("DONE", result["output"])

    async def test_mcp_style_cancel_does_not_retain_an_unreturned_handle(self):
        await self.executor.start()
        with anyio.move_on_after(.1) as cancel:
            await self.run_command("sleep 30", yield_time_ms=30000)
        self.assertTrue(cancel.cancel_called)
        self.assertEqual(self.executor.sessions, {})


if __name__ == "__main__":
    unittest.main()
