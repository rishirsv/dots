#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["tomlkit==0.13.3"]
# ///
"""Verify the selected Dots/Drafts source through Codex's actual skill loader."""

import argparse
import json
import os
from pathlib import Path
import selectors
import subprocess
import time

import tomlkit


def loaded_skills(cwd):
    process = subprocess.Popen(
        ["codex", "app-server"], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL, text=True,
    )
    selector = selectors.DefaultSelector()
    selector.register(process.stdout, selectors.EVENT_READ)
    pending = b""

    def request(request_id, method, params):
        nonlocal pending
        process.stdin.write(json.dumps({"id": request_id, "method": method, "params": params}) + "\n")
        process.stdin.flush()
        deadline = time.monotonic() + 30
        while time.monotonic() < deadline:
            if b"\n" not in pending:
                if not selector.select(max(0, deadline - time.monotonic())):
                    break
                chunk = os.read(process.stdout.fileno(), 65536)
                if not chunk:
                    raise RuntimeError("Codex exited before returning its skill inventory")
                pending += chunk
                continue
            line, pending = pending.split(b"\n", 1)
            response = json.loads(line)
            if response.get("id") == request_id:
                if "error" in response:
                    raise RuntimeError(str(response["error"]))
                return response["result"]
        raise RuntimeError("Codex skill inventory timed out")

    try:
        request(1, "initialize", {
            "clientInfo": {"name": "dots_skill_verification", "version": "1.0"},
            "capabilities": {"experimentalApi": True},
        })
        result = request(2, "skills/list", {"cwds": [str(cwd)], "forceReload": True})
        return [skill for entry in result["data"] for skill in entry["skills"]]
    finally:
        selector.close()
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
        process.stdin.close()
        process.stdout.close()


def verify(skills, policy):
    enabled = [skill for skill in skills if skill["enabled"] and skill.get("pluginId") in policy]
    present = {skill["pluginId"] for skill in enabled}
    errors = []
    for plugin_id, settings in policy.items():
        if settings["enabled"] and plugin_id not in present:
            errors.append(f"{plugin_id}: selected plugin has no enabled skills")
        elif not settings["enabled"] and plugin_id in present:
            errors.append(f"{plugin_id}: duplicate copy is still enabled")
    names = {}
    for skill in enabled:
        name = skill["name"].split(":")[-1]
        names.setdefault(name, []).append(skill["path"])
    for name, paths in names.items():
        if len(paths) > 1:
            errors.append(f"{name}: loaded {len(paths)} copies")
    return errors, len(enabled)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--policy", type=Path, required=True)
    parser.add_argument("--cwd", type=Path, required=True)
    args = parser.parse_args()
    policy = tomlkit.parse(args.policy.read_text()).unwrap()["plugins"]
    errors, count = verify(loaded_skills(args.cwd), policy)
    if errors:
        raise SystemExit("Codex skill verification failed:\n  " + "\n  ".join(errors))
    print(f"Codex loaded {count} Dots/Drafts skills from the selected source, with zero duplicates")


if __name__ == "__main__":
    main()
