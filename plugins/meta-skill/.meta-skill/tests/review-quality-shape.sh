#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const reviewTs = fs.readFileSync(path.join(root, "src/review.ts"), "utf8");
const criteria = fs.readFileSync(path.join(root, "skills/improve-skill/references/review-criteria.md"), "utf8");
const improve = fs.readFileSync(path.join(root, "skills/improve-skill/SKILL.md"), "utf8");
const requiredReview = [
  "Quality Score: Agent review required",
  "Validation Score:",
  "### Discovery",
  "### Implementation",
  "### Validation",
  "Overall assessments should be 2-4 substantive sentences",
  "Each dimension should cite concrete evidence"
];
const errors = [];
for (const needle of requiredReview) {
  if (!reviewTs.includes(needle)) errors.push(`src/review.ts missing ${needle}`);
}
for (const needle of ["Reasoning Standard", "Score Calibration", "Do not add `Judge Score`, `Total Score`"]) {
  if (!criteria.includes(needle)) errors.push(`review-criteria.md missing ${needle}`);
}
if (!improve.includes("complete `.meta-skill/review.md` as an agent-authored Quality page")) {
  errors.push("improve-skill/SKILL.md does not require completing the Quality page");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("review-quality-shape ok");
NODE
