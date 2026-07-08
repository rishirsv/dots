#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
parser.add_argument("--events")
parser.add_argument("--expected")
parser.add_argument("--json", action="store_true")
args = parser.parse_args()

response = Path(args.output).read_text()
lower = response.lower()
image_embeds = re.findall(r"!\[[^\]]*\]\([^)]+\)", response)
has_image_syntax = bool(image_embeds) or ("![" in response and "](" in response)

checks = [
    {
        "name": "requires-actual-image-embeds",
        "passed": has_image_syntax,
        "evidence": f"found {len(image_embeds)} Markdown image embeds",
    },
    {
        "name": "rejects-text-only-screen-list",
        "passed": "text-only" in lower
        and ("not enough" in lower or "does not satisfy" in lower or "insufficient" in lower),
        "evidence": "looked for explicit text-only list rejection",
    },
    {
        "name": "verifies-live-pr-body",
        "passed": "re-query" in lower
        or "re-check the live pr body" in lower
        or "verify the live pr body" in lower
        or "verify the live draft pr body" in lower
        or "gh pr view" in lower,
        "evidence": "looked for live PR body verification before close-out",
    },
]

passed = sum(1 for check in checks if check["passed"])
print(json.dumps({
    "passed": passed,
    "total": len(checks),
    "checks": checks,
    "rationale": f"{passed}/{len(checks)} visual PR checks passed",
}))
