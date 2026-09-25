"""Filesystem acceptance tests for dots-tunnel's bounded file surface."""

import importlib.util
import os
from pathlib import Path
import tempfile
import threading
import unittest


SPEC = importlib.util.spec_from_file_location("dots-tunnel_files", Path(__file__).with_name("files.py"))
files = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(files)


def add(path, *lines):
    return "\n".join(["*** Begin Patch", f"*** Add File: {path}",
                      *(f"+{line}" for line in lines), "*** End Patch"])


def update(path, *body):
    return "\n".join(["*** Begin Patch", f"*** Update File: {path}",
                      *body, "*** End Patch"])


class WorkspaceFilesTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        base = Path(self.temp.name)
        self.root = base / "project"
        self.state = base / "state"
        self.root.mkdir()
        self.workspace = files.Workspace(str(self.root), str(self.state))
        self.addCleanup(self.workspace.close)

    def put(self, path, data):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return target

    def rev(self, path):
        return self.workspace.read_file(path)["revision"]

    def assert_rejected_unchanged(self, patch, expected, path):
        before = (self.root / path).read_bytes()
        with self.assertRaises((ValueError, OSError, UnicodeError)):
            self.workspace.apply_patch(patch, expected)
        self.assertEqual((self.root / path).read_bytes(), before)

    def test_add_then_update_exact_hunk_and_read_revision(self):
        created = self.workspace.apply_patch(add("note.txt", "alpha", "beta"), "absent")
        self.assertEqual((self.root / "note.txt").read_bytes(), b"alpha\nbeta\n")
        self.assertEqual(created["previous_revision"], "absent")
        self.assertIsNone(created["recovery_copy"])
        changed = self.workspace.apply_patch(
            update("note.txt", "@@", " alpha", "-beta", "+gamma"), created["revision"])
        self.assertEqual((self.root / "note.txt").read_bytes(), b"alpha\ngamma\n")
        self.assertEqual(self.rev("note.txt"), changed["revision"])

    def test_multiple_hunks_preserve_intervening_lines(self):
        self.put("note.txt", b"a\nb\nc\nd\ne\n")
        result = self.workspace.apply_patch(update("note.txt", "@@", "-a", "+A",
                                                   "@@", "-e", "+E"), self.rev("note.txt"))
        self.assertEqual((self.root / "note.txt").read_bytes(), b"A\nb\nc\nd\nE\n")
        self.assertEqual(result["bytes"], 10)

    def test_ambiguous_or_missing_context_cannot_write(self):
        self.put("note.txt", b"same\nother\nsame\n")
        rev = self.rev("note.txt")
        self.assert_rejected_unchanged(update("note.txt", "@@", "-same", "+new"), rev, "note.txt")
        self.assert_rejected_unchanged(update("note.txt", "@@", "-missing", "+new"), rev, "note.txt")

    def test_stale_revision_and_repeated_write_do_not_overwrite(self):
        target = self.put("note.txt", b"old\n")
        original_rev = self.rev("note.txt")
        patch = update("note.txt", "@@", "-old", "+new")
        self.workspace.apply_patch(patch, original_rev)
        self.assert_rejected_unchanged(patch, original_rev, "note.txt")
        target.write_bytes(b"external\n")
        self.assert_rejected_unchanged(update("note.txt", "@@", "-new", "+again"),
                                       files.revision(b"new\n"), "note.txt")

    def test_duplicate_creation_cannot_clobber(self):
        self.workspace.apply_patch(add("note.txt", "first"), "absent")
        self.assert_rejected_unchanged(add("note.txt", "second"), "absent", "note.txt")
        self.assert_rejected_unchanged(add("note.txt", "second"), self.rev("note.txt"), "note.txt")

    def test_unsupported_multifile_delete_rename_and_eof_are_atomic(self):
        self.put("note.txt", b"old\n")
        rev = self.rev("note.txt")
        for directive in ("*** Add File: extra.txt", "*** Delete File: note.txt",
                          "*** Move to: moved.txt", "*** End of File"):
            with self.subTest(directive=directive):
                patch = update("note.txt", "@@", "-old", "+new", directive)
                self.assert_rejected_unchanged(patch, rev, "note.txt")
                self.assertFalse((self.root / "extra.txt").exists())
                self.assertFalse((self.root / "moved.txt").exists())
        self.assert_rejected_unchanged(
            "*** Begin Patch\n*** Delete File: note.txt\n*** End Patch", rev, "note.txt")

    def test_symlink_file_and_ancestor_cannot_escape(self):
        outside = Path(self.temp.name) / "outside.txt"
        outside.write_bytes(b"private\n")
        (self.root / "link.txt").symlink_to(outside)
        (self.root / "alias").symlink_to(outside.parent, target_is_directory=True)
        for path in ("link.txt", "alias/outside.txt"):
            with self.subTest(path=path):
                with self.assertRaises((ValueError, OSError)):
                    self.workspace.read_file(path)
                with self.assertRaises((ValueError, OSError)):
                    self.workspace.apply_patch(update(path, "@@", "-private", "+leak"),
                                               files.revision(b"private\n"))
        self.assertEqual(outside.read_bytes(), b"private\n")

    def test_hardlink_cannot_read_or_write(self):
        outside = Path(self.temp.name) / "outside.txt"
        outside.write_bytes(b"private\n")
        os.link(outside, self.root / "linked.txt")
        with self.assertRaises(ValueError):
            self.workspace.read_file("linked.txt")
        with self.assertRaises(ValueError):
            self.workspace.apply_patch(update("linked.txt", "@@", "-private", "+leak"),
                                       files.revision(b"private\n"))
        self.assertEqual(outside.read_bytes(), b"private\n")

    def test_relative_and_protected_paths_are_rejected(self):
        self.put("safe.txt", b"safe\n")
        for path in ("../safe.txt", "/safe.txt", "./safe.txt", ".secret",
                     "dir/.secret", "credentials.json", "id_rsa", "safe.db"):
            with self.subTest(path=path):
                with self.assertRaises(ValueError):
                    self.workspace.read_file(path)
                with self.assertRaises(ValueError):
                    self.workspace.apply_patch(add(path, "bad"), "absent")
        self.assertEqual((self.root / "safe.txt").read_bytes(), b"safe\n")

    def test_agents_directory_is_accessible_without_exposing_other_hidden_paths(self):
        self.put(".agents/AGENTS.md", b"agent guidance\n")
        self.put(".agents/.env", b"private\n")
        self.put(".hidden/note.txt", b"private\n")
        self.assertIn({"path": ".agents", "kind": "directory"}, self.workspace.list_files()["entries"])
        self.assertEqual(self.workspace.read_file(".agents/AGENTS.md")["content"], "agent guidance\n")
        self.assertEqual(self.workspace.search_files("agent guidance", ".agents")["matches"][0]["path"],
                         ".agents/AGENTS.md")
        self.assertEqual([entry["path"] for entry in self.workspace.list_files(".agents")["entries"]],
                         [".agents/AGENTS.md"])
        for path in (".agents/.env", ".hidden/note.txt", ".agents/secret.key"):
            with self.subTest(path=path), self.assertRaises(ValueError):
                self.workspace.read_file(path)

    def test_batched_reads_keep_results_and_errors_independent(self):
        self.put("one.txt", b"one\n")
        self.put(".agents/two.md", b"two\n")
        result = self.workspace.read_files(["one.txt", ".secret", ".agents/two.md"])["results"]
        self.assertEqual([item["path"] for item in result], ["one.txt", ".secret", ".agents/two.md"])
        self.assertEqual(result[0]["revision"], files.revision(b"one\n"))
        self.assertIn("error", result[1])
        self.assertEqual(result[2]["content"], "two\n")
        for paths in ([], ["one.txt"] * 9):
            with self.assertRaises(ValueError):
                self.workspace.read_files(paths)

    def test_binary_non_utf8_and_oversize_files_rejected(self):
        for name, data in (("nul.txt", b"a\x00b"), ("bad.txt", b"\xff"),
                           ("large.txt", b"x" * (files.MAX_BYTES + 1))):
            self.put(name, data)
            with self.subTest(name=name):
                with self.assertRaises((ValueError, UnicodeError)):
                    self.workspace.read_file(name)
                with self.assertRaises((ValueError, UnicodeError)):
                    self.workspace.apply_patch(update(name, "@@", "-x", "+y"),
                                               files.revision(data))
                self.assertEqual((self.root / name).read_bytes(), data)
        with self.assertRaises(ValueError):
            self.workspace.apply_patch(add("new.txt", "x" * files.MAX_BYTES), "absent")
        self.assertFalse((self.root / "new.txt").exists())

    def test_recovery_copy_contains_original_and_is_reused(self):
        original = b"one\n"
        self.put("note.txt", original)
        first = self.workspace.apply_patch(update("note.txt", "@@", "-one", "+two"),
                                           self.rev("note.txt"))
        self.assertEqual((self.state / first["recovery_copy"]).read_bytes(), original)
        self.assertEqual(first["recovery_copy"], "original-" + files.revision(original))
        self.workspace.apply_patch(update("note.txt", "@@", "-two", "+one"), self.rev("note.txt"))
        third = self.workspace.apply_patch(update("note.txt", "@@", "-one", "+three"),
                                           self.rev("note.txt"))
        self.assertEqual(third["recovery_copy"], first["recovery_copy"])
        self.assertEqual((self.state / first["recovery_copy"]).read_bytes(), original)

    def test_list_pagination_filters_unsafe_entries_and_bounds(self):
        for name in ("b.txt", "a.txt", "c.txt", ".hidden", "secret.key"):
            self.put(name, b"value\n")
        (self.root / "alias.txt").symlink_to(self.root / "a.txt")
        first = self.workspace.list_files(limit=2)
        self.assertEqual([e["path"] for e in first["entries"]], ["a.txt", "b.txt"])
        self.assertEqual(first["next_offset"], 2)
        self.assertEqual([e["path"] for e in self.workspace.list_files(offset=2)["entries"]],
                         ["c.txt"])
        for kwargs in ({"offset": -1}, {"offset": 5001}, {"limit": 0}, {"limit": 201}):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                self.workspace.list_files(**kwargs)

    def test_read_pagination_and_text_bounds(self):
        self.put("note.txt", b"one\ntwo\nthree\n")
        first = self.workspace.read_file("note.txt", limit=2)
        self.assertEqual(first["content"], "one\ntwo\n")
        self.assertEqual(first["next_line"], 3)
        self.assertEqual(self.workspace.read_file("note.txt", start_line=3)["content"], "three\n")
        for kwargs in ({"start_line": 0}, {"limit": 0}, {"limit": 201}):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                self.workspace.read_file("note.txt", **kwargs)
        self.put("long.txt", b"x" * (files.MAX_TEXT + 1) + b"\n")
        with self.assertRaises(ValueError):
            self.workspace.read_file("long.txt")

    def test_search_results_and_bounds(self):
        self.put("a.txt", b"needle one\nnone\nneedle two\n")
        self.put("b.txt", b"needle three\n")
        result = self.workspace.search_files("needle", limit=2)
        self.assertEqual(len(result["matches"]), 2)
        self.assertTrue(result["truncated"])
        self.assertTrue(all("needle" in match["text"] for match in result["matches"]))
        for query, limit in (("", 1), ("x" * 201, 1), ("x", 0), ("x", 101)):
            with self.subTest(query=query[:10], limit=limit), self.assertRaises(ValueError):
                self.workspace.search_files(query, limit=limit)

    def test_search_refuses_to_scan_a_directory_beyond_one_page(self):
        for number in range(201):
            self.put(f"item-{number:03}.txt", b"needle\n")
        result = self.workspace.search_files("needle")
        self.assertEqual(result["matches"], [])
        self.assertTrue(result["truncated"])
        self.assertEqual(result["reason"], "Narrow the directory")

    def test_concurrent_workspaces_share_write_serialization(self):
        self.put("note.txt", b"old\n")
        second = files.Workspace(str(self.root), str(self.state))
        self.addCleanup(second.close)
        rev = self.rev("note.txt")
        barrier = threading.Barrier(3)
        outcomes = []
        guard = threading.Lock()

        def writer(workspace, replacement):
            barrier.wait()
            try:
                outcome = workspace.apply_patch(
                    update("note.txt", "@@", "-old", f"+{replacement}"), rev)
            except ValueError as error:
                outcome = error
            with guard:
                outcomes.append(outcome)

        threads = [threading.Thread(target=writer, args=(workspace, value))
                   for workspace, value in ((self.workspace, "first"), (second, "second"))]
        for thread in threads:
            thread.start()
        barrier.wait()
        for thread in threads:
            thread.join(timeout=5)
            self.assertFalse(thread.is_alive(), "Concurrent writer did not finish")
        self.assertEqual(sum(isinstance(outcome, dict) for outcome in outcomes), 1)
        self.assertEqual(sum(isinstance(outcome, ValueError) for outcome in outcomes), 1)
        self.assertIn((self.root / "note.txt").read_bytes(), (b"first\n", b"second\n"))
        self.assertTrue(any("Revision conflict" in str(outcome) for outcome in outcomes
                            if isinstance(outcome, ValueError)))


if __name__ == "__main__":
    unittest.main()
