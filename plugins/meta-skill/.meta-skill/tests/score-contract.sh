#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const files = [
  "src/review.ts",
  "skills/improve-skill/SKILL.md",
  "skills/improve-skill/references/review-criteria.md",
  "skills/meta-skill/SKILL.md",
  "references/cli-conventions.md"
];
const errors = [];
for (const rel of files) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  const allowedOnlyAsBan = rel.endsWith("review-criteria.md");
  if (!allowedOnlyAsBan && /Judge Score|Total Score/.test(text)) {
    errors.push(`${rel}: deprecated Judge Score or Total Score surface found`);
  }
  if (/\.meta-skill\/reviews\//.test(text)) {
    errors.push(`${rel}: deprecated .meta-skill/reviews/ surface found`);
  }
}
const reviewTs = fs.readFileSync(path.join(root, "src/review.ts"), "utf8");
if (/judgeRows|judgeScore|Total Score:|Judge Score:/.test(reviewTs)) {
  errors.push("src/review.ts appears to compute or render deprecated judge/total scores");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("score-contract ok");
NODE
