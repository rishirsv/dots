"""Named-root routing must never expose siblings or cross a root boundary."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

from files import MAX_BYTES, MountedWorkspace, Workspace, revision
from test_files import add, update
from test_protocol import Wire


class MountedTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.base = Path(temp.name)
        self.roots = {name: self.base / name for name in ("Code", "Desktop")}
        for root in self.roots.values():
            root.mkdir()
            (root / "note.txt").write_text("original\n")
        (self.base / "private.txt").write_text("private\n")
        self.state = self.base / "state"
        self.workspace = MountedWorkspace(self.roots, self.state)
        self.addCleanup(self.workspace.close)

    def test_list_read_search_and_patch_keep_prefixes(self):
        page = self.workspace.list_files(limit=1)
        self.assertEqual(page, {"entries": [{"path": "Code", "kind": "directory"}], "next_offset": 1})
        self.assertEqual(self.workspace.list_files(offset=1)["entries"][0]["path"], "Desktop")
        for name, root in self.roots.items():
            path = name + "/note.txt"
            self.assertEqual(self.workspace.list_files(name)["entries"][0]["path"], path)
            original = self.workspace.read_file(path)
            self.assertEqual(original["path"], path)
            self.assertEqual(self.workspace.search_files("original", name)["matches"][0]["path"], path)
            result = self.workspace.apply_patch(update(path, "@@", "-original", "+updated"), original["revision"])
            self.assertEqual(result["path"], path)
            self.assertEqual((root / "note.txt").read_text(), "updated\n")
            with self.assertRaises(ValueError):
                self.workspace.apply_patch(update(path, "@@", "-updated", "+stale"), original["revision"])
            self.workspace.apply_patch(add(name + "/new.txt", "new"), "absent")
            self.assertEqual((root / "new.txt").read_text(), "new\n")
        with self.assertRaises(ValueError):
            self.workspace.search_files("original")

    def test_unauthorized_paths_and_symlinks_cannot_read_or_write(self):
        (self.roots["Code"] / "escape").symlink_to(self.base, target_is_directory=True)
        for path in ("private.txt", "Other/private.txt", "Code/../private.txt", "/Code/note.txt",
                     "Code/escape/private.txt", "Code/.hidden", "Desktop/secrets/key.txt", "Code"):
            with self.subTest(path=path):
                with self.assertRaises((ValueError, OSError)):
                    self.workspace.read_file(path)
                with self.assertRaises((ValueError, OSError)):
                    self.workspace.apply_patch(add(path, "bad"), "absent")
        self.assertEqual((self.base / "private.txt").read_text(), "private\n")

    def test_bad_mount_names_and_recovery_inside_another_root_fail(self):
        for name in ("", ".", "../Code", "Code/nested", "secrets"):
            with self.assertRaises(ValueError):
                MountedWorkspace({name: self.roots["Code"]}, self.state)
        with self.assertRaises(ValueError):
            MountedWorkspace(self.roots, self.roots["Desktop"] / "recovery")
        with self.assertRaises(ValueError):
            MountedWorkspace({}, self.state)

    def test_actual_stdio_named_roots(self):
        wire = Wire(None, self.state, mounts=self.roots)
        self.addCleanup(wire.close)
        def call(name, **args):
            return wire.send("tools/call", {"name": name, "arguments": args})["result"]
        self.assertEqual(len(call("list_files")["structuredContent"]["entries"]), 2)
        for name in self.roots:
            path = name + "/note.txt"
            result = call("read_file", path=path)["structuredContent"]
            changed = call("apply_patch", input=update(path, "@@", "-original", "+wire"), expected_revision=result["revision"])
            self.assertFalse(changed.get("isError", False), changed)
            self.assertEqual(call("read_file", path=path)["structuredContent"]["revision"], revision(b"wire\n"))
        self.assertTrue(call("read_file", path="Other/private.txt")["isError"])

    def test_patch_body_is_not_rewritten_and_multi_file_is_rejected(self):
        self.workspace.apply_patch(add("Code/body.txt", "Code/body.txt", "Desktop/note.txt"), "absent")
        content = self.workspace.read_file("Code/body.txt")
        self.assertEqual(content["content"], "Code/body.txt\nDesktop/note.txt\n")
        invalid = update("Code/body.txt", "@@", "-Code/body.txt", "+changed", "*** Add File: Desktop/new.txt", "+bad")
        with self.assertRaises(ValueError):
            self.workspace.apply_patch(invalid, content["revision"])
        self.assertEqual(self.workspace.read_file("Code/body.txt"), content)
        with self.assertRaises(ValueError):
            self.workspace.apply_patch(add("Code/large.txt", "x" * MAX_BYTES), "absent")

    def test_constructor_closes_descriptors_on_failure(self):
        actual_open = os.open
        opened = []
        def fail_lock(path, *args, **kwargs):
            if str(path).startswith("lock-"):
                raise OSError("injected lock failure")
            fd = actual_open(path, *args, **kwargs)
            opened.append(fd)
            return fd
        with patch('files.os.open', side_effect=fail_lock), self.assertRaises(OSError):
            Workspace(str(self.roots['Code']), str(self.state))
        self.assertEqual(len(opened), 2)
        for fd in opened:
            with self.assertRaises(OSError):
                os.fstat(fd)

    def test_cli_mount_scope_does_not_inherit_environment_root(self):
        with patch.dict(os.environ, {"DOTS_TUNNEL_ROOT": str(self.base)}):
            wire = Wire(None, self.state, mounts=self.roots)
            try:
                result = wire.send('tools/call', {"name": "list_files", "arguments": {}})['result']['structuredContent']
                self.assertEqual([e['path'] for e in result['entries']], ['Code', 'Desktop'])
            finally:
                wire.close()
        command = [sys.executable, str(Path(__file__).with_name('server.py')), '--state', str(self.state)]
        for scope in (['--root', str(self.base), '--mount', 'Code=' + str(self.roots['Code'])],
                      ['--mount', 'Code=' + str(self.roots['Code']), '--mount', 'Code=' + str(self.roots['Desktop'])]):
            result = subprocess.run(command + scope, capture_output=True, timeout=10)
            self.assertNotEqual(result.returncode, 0)
