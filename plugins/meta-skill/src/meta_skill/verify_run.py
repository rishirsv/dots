"""Recheck a completed run's input snapshot against its recorded digests."""

import hashlib
from pathlib import Path

from .io import read_json, read_jsonl, resolve_run_dir

SNAPSHOT_EXCLUDES = {".DS_Store", ".git", "__pycache__", "snapshot.json"}


def _file_digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def _tree_digest(root, excludes=()):
    root = Path(root)
    h = hashlib.sha256()
    for item in sorted(root.rglob("*")):
        if not item.is_file() or set(item.relative_to(root).parts) & set(excludes):
            continue
        h.update(item.relative_to(root).as_posix().encode("utf-8"))
        h.update(b"\0")
        h.update(item.read_bytes())
        h.update(b"\0")
    return h.hexdigest()


def verify_run(raw_run):
    run_dir = resolve_run_dir(raw_run)
    run = read_json(run_dir / "run.json")
    suite = read_json(run_dir / "inputs" / "suite.json")
    checks = []

    def add(name, ok, detail):
        checks.append({"name": name, "ok": bool(ok), "detail": detail})

    add(
        "suite_digest_recorded",
        run.get("suite_digest") == suite.get("suite_digest"),
        "run.json and inputs/suite.json agree on suite_digest",
    )

    for case in suite.get("cases", []):
        case_id = case.get("id")
        case_root = run_dir / "inputs" / "cases" / case_id
        task_path = case_root / "task.md"
        if not task_path.is_file():
            add(f"task:{case_id}", False, f"missing {task_path}")
            continue
        add(
            f"task:{case_id}",
            _file_digest(task_path) == case.get("task_digest"),
            "frozen task.md matches recorded task_digest",
        )
        for support in case.get("support_files", []):
            support_path = case_root / support["path"]
            if not support_path.exists():
                add(f"support:{case_id}:{support['path']}", False, f"missing {support_path}")
                continue
            digest = _tree_digest(support_path) if support_path.is_dir() else _file_digest(support_path)
            add(
                f"support:{case_id}:{support['path']}",
                digest == support.get("digest"),
                "frozen support file matches recorded digest",
            )

    candidates_root = run_dir / "inputs" / "candidates"
    for candidate in run.get("candidates", []):
        candidate_id = candidate.get("candidate")
        recorded = candidate.get("payload_digest")
        snapshot_root = candidates_root / candidate_id
        if recorded is None:
            add(f"candidate:{candidate_id}", True, "no payload (baseline candidate)")
            continue
        if not snapshot_root.is_dir():
            add(f"candidate:{candidate_id}", False, f"missing snapshot {snapshot_root}")
            continue
        add(
            f"candidate:{candidate_id}",
            _tree_digest(snapshot_root, SNAPSHOT_EXCLUDES) == recorded,
            "candidate snapshot matches recorded payload_digest",
        )

    planned = len(run.get("trials", []))
    results = read_jsonl(run_dir / "results.jsonl")
    add("results_count", len(results) <= planned, f"{len(results)} results for {planned} planned trials")
    summary_path = run_dir / "summary.json"
    if summary_path.exists():
        summary = read_json(summary_path)
        totals = summary.get("final_verdict_totals") or {}
        add(
            "summary_totals",
            summary.get("total_trials") == planned and sum(totals.values()) == planned,
            "summary trial and verdict totals cover every planned trial",
        )
    else:
        add("summary_totals", False, "summary.json missing")

    ok = all(check["ok"] for check in checks)
    return {"ok": ok, "run_id": run.get("run_id") or run_dir.name, "run_dir": str(run_dir), "checks": checks}
