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
lower = response.lower()

source_terms = [
    "019ef7e3",
    "/users/rishi/code/dots/.agents/research/spiral-notes.md",
    "spiral",
    "matt pocock",
    "studio",
    "mirror mode",
    "draft lab",
    "system message",
]
keep_verbs = ["keep", "retain", "preserve", "include", "copy"]
bad_keep_patterns = [
    f"{verb} {term}"
    for verb in keep_verbs
    for term in source_terms
]
cleanup_words = ["move", "remove", "exclude", "out of", "do not include"]
source_classes = ["source", "provenance", "thread", "local path", "rejected", "system", "research"]

checks = [
    {
        "name": "preserves reusable draft behavior",
        "passed": "draft" in lower and "rewrite" in lower,
        "evidence": "looked for draft and rewrite behavior in response.md",
    },
    {
        "name": "identifies payload hygiene or clean mode",
        "passed": "payload hygiene" in lower or "clean" in lower,
        "evidence": "looked for payload hygiene or Clean cleanup framing",
    },
    {
        "name": "does not keep source residue in runtime",
        "passed": not any(pattern in lower for pattern in bad_keep_patterns),
        "evidence": "checked for instructions to keep source-specific product, person, path, thread, prompt-role, or rejected-name terms",
    },
    {
        "name": "removes source residue",
        "passed": any(word in lower for word in cleanup_words) and any(item in lower for item in source_classes),
        "evidence": "looked for cleanup language applied to source/provenance classes",
    },
    {
        "name": "separates runtime from non-runtime material",
        "passed": ("runtime" in lower and ("move" in lower or "remove" in lower or "out of" in lower)),
        "evidence": "looked for runtime placement cleanup language",
    },
    {
        "name": "calls for semantic hygiene validation",
        "passed": ("validate" in lower or "validation" in lower) and ("hygiene" in lower or "placement" in lower or "semantic" in lower),
        "evidence": "looked for validation beyond structural lint",
    },
]

passed = sum(1 for check in checks if check["passed"])
print(json.dumps({
    "passed": passed,
    "total": len(checks),
    "checks": checks,
    "rationale": f"{passed}/{len(checks)} payload hygiene checks passed",
}))
