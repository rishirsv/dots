#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const scenarios = fs.readFileSync(path.join(root, ".meta-skill/eval-scenarios.md"), "utf8");
const required = [
  "Create Skill",
  "Evaluate Skill",
  "Improve Skill",
  "Route broad Meta Skill request across lanes",
  "skills/create-skill/SKILL.md",
  "skills/evaluate-skill/SKILL.md",
  "skills/improve-skill/SKILL.md",
  "skills/meta-skill/SKILL.md"
];
const missing = required.filter((needle) => !scenarios.includes(needle));
if (missing.length) {
  console.error(`Missing lane-scope coverage: ${missing.join(", ")}`);
  process.exit(1);
}
const evalRoot = path.join(root, ".meta-skill/evals");
const folders = fs.readdirSync(evalRoot).filter((name) => fs.statSync(path.join(evalRoot, name)).isDirectory());
if (folders.length < 5) {
  console.error(`Expected at least 5 plugin self-evals, found ${folders.length}`);
  process.exit(1);
}
console.log(`lane-scope ok: ${folders.length} evals cover create/evaluate/improve/router`);
NODE
