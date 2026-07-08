#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
parser.add_argument("--events", required=True)
parser.add_argument("--expected")
parser.add_argument("--json", action="store_true")
args = parser.parse_args()

response = Path(args.output).read_text()
events = Path(args.events).read_text()
combined = f"{response}\n{events}".lower()
lower_response = response.lower()
has_status_check = "git status -sb" in lower_response or "git status --short --branch" in lower_response
has_diff_stat = "git diff --stat" in lower_response
has_draft_pr = "draft pr" in lower_response or "draft pull request" in lower_response or "gh pr create --draft" in lower_response

checks = [
    {
        "name": "loads-pr-skill",
        "passed": '"type": "skill"' in events.lower() and '"name": "pr"' in events.lower(),
        "evidence": "looked for a staged pr skill item in transcript events",
    },
    {
        "name": "uses-pr-workflow",
        "passed": has_status_check and has_diff_stat and has_draft_pr,
        "evidence": "looked for scope confirmation, diff inspection, and draft PR language",
    },
]

passed = sum(1 for check in checks if check["passed"])
print(json.dumps({
    "passed": passed,
    "total": len(checks),
    "checks": checks,
    "rationale": f"{passed}/{len(checks)} activation checks passed",
}))
