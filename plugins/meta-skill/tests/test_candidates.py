"""Tests for candidate source and snapshot handling."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.candidates import resolve_candidate, snapshot_candidate  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402


def write_skill(path: Path, name="demo", body="Skill body.") -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text(
        f"""---
name: {name}
description: "Use for candidate tests."
---

# {name}

{body}
"""
    )


class CandidateTests(unittest.TestCase):
    def test_local_path_candidate_snapshot_is_run_local(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            candidate_root = Path(tmp) / "candidate"
            write_skill(project)
            write_skill(candidate_root, body="Candidate body.")
            run_dir = project / ".demo" / "runs" / "run-001"
            manifest = {"target": {"type": "skill", "ref": "SKILL.md"}}
            candidate = {"candidate": "local", "source": {"kind": "local_path", "path": str(candidate_root)}}

            resolved = resolve_candidate(project, project / ".demo", "run-001", manifest, candidate)
            snapshotted = snapshot_candidate(run_dir, resolved)

            self.assertEqual(snapshotted["payload_path"], str(run_dir / "inputs" / "candidates" / "local"))
            self.assertIn("Candidate body.", Path(snapshotted["payload_path"], "SKILL.md").read_text())
            snapshot_json = json.loads((Path(snapshotted["snapshot_json_path"])).read_text())
            self.assertNotIn("payload_path", snapshot_json)
            self.assertNotIn("snapshot_path", snapshot_json)

    def test_symlink_escape_is_rejected_for_candidate_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            candidate_root = Path(tmp) / "candidate"
            write_skill(project)
            write_skill(candidate_root)
            (candidate_root / "escape").symlink_to(Path(tmp).parent)
            manifest = {"target": {"type": "skill", "ref": "SKILL.md"}}
            candidate = {"candidate": "local", "source": {"kind": "local_path", "path": str(candidate_root)}}

            with self.assertRaises(CliError) as ctx:
                resolve_candidate(project, project / ".demo", "run-001", manifest, candidate)

            self.assertIn("symlink escapes candidate root", ctx.exception.message)

    def test_target_ref_symlink_escape_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            candidate_root = Path(tmp) / "candidate"
            outside = Path(tmp) / "outside"
            write_skill(project)
            write_skill(candidate_root)
            write_skill(outside, body="Outside skill.")
            (candidate_root / "SKILL.md").unlink()
            (candidate_root / "SKILL.md").symlink_to(outside / "SKILL.md")
            manifest = {"target": {"type": "skill", "ref": "SKILL.md"}}
            candidate = {"candidate": "local", "source": {"kind": "local_path", "path": str(candidate_root)}}

            with self.assertRaises(CliError) as ctx:
                resolve_candidate(project, project / ".demo", "run-001", manifest, candidate)

            self.assertIn("target ref must not traverse a symlink", ctx.exception.message)


if __name__ == "__main__":
    unittest.main()
