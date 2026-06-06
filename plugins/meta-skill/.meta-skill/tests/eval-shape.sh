#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const evalRoot = path.join(root, ".meta-skill/evals");
const phases = new Set(["Quality", "Implementation", "Validation"]);
const folders = fs.readdirSync(evalRoot).filter((name) => fs.statSync(path.join(evalRoot, name)).isDirectory());
const errors = [];
for (const folder of folders) {
  const dir = path.join(evalRoot, folder);
  const taskPath = path.join(dir, "task.md");
  const criteriaPath = path.join(dir, "criteria.json");
  if (!fs.existsSync(taskPath)) errors.push(`${folder}: missing task.md`);
  if (!fs.existsSync(criteriaPath)) errors.push(`${folder}: missing criteria.json`);
  if (!fs.existsSync(taskPath) || !fs.existsSync(criteriaPath)) continue;
  const task = fs.readFileSync(taskPath, "utf8");
  for (const section of ["# ", "## Problem Description", "## Output Specification", "## Task"]) {
    if (!task.includes(section)) errors.push(`${folder}: task.md missing ${section}`);
  }
  if (/^Capability:\s*.+$/m.test(task) || /^Topics:\s*.+$/m.test(task)) {
    errors.push(`${folder}: task.md must not include Capability: or Topics: metadata`);
  }
  if (/should pass|0\s*\/\s*3|1\s*\/\s*3|2\s*\/\s*3|3\s*\/\s*3/i.test(task.split("## Task")[1] || "")) {
    errors.push(`${folder}: task text appears to expose evaluator criteria`);
  }
  let criteria;
  try {
    criteria = JSON.parse(fs.readFileSync(criteriaPath, "utf8"));
  } catch (error) {
    errors.push(`${folder}: invalid criteria.json ${error.message}`);
    continue;
  }
  if (!Array.isArray(criteria.criteria) || criteria.criteria.length < 3) {
    errors.push(`${folder}: criteria array must contain at least 3 entries`);
    continue;
  }
  const declaredFixtures = new Set((criteria.fixtures || []).map((fixture) => fixture && fixture.path).filter(Boolean));
  if (/\.meta-skill\/review\.md/.test(task) || /\.meta-skill\/review\.md/.test(JSON.stringify(criteria.criteria))) {
    errors.push(`${folder}: review evidence must be provided as a declared fixture, not referenced from .meta-skill/review.md`);
  }
  for (const match of `${task}\n${JSON.stringify(criteria.criteria)}`.matchAll(/fixtures\/[A-Za-z0-9._/-]+/g)) {
    if (!declaredFixtures.has(match[0])) errors.push(`${folder}: references undeclared fixture ${match[0]}`);
  }
  if (criteria.metadata && ("capability" in criteria.metadata || "topics" in criteria.metadata)) {
    errors.push(`${folder}: criteria.json metadata must not include capability or topics`);
  }
  const present = new Set();
  for (const [index, row] of criteria.criteria.entries()) {
    for (const key of ["criterion", "phase", "dimension", "question", "evidence"]) {
      if (typeof row[key] !== "string" || !row[key].trim()) errors.push(`${folder}: criteria[${index}] missing ${key}`);
    }
    if (!phases.has(row.phase)) errors.push(`${folder}: criteria[${index}] invalid phase ${row.phase}`);
    present.add(row.phase);
  }
  for (const phase of phases) {
    if (!present.has(phase)) errors.push(`${folder}: missing ${phase} criterion`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`eval-shape ok: ${folders.length} eval folders validated`);
NODE
