#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.argv[2];
const skillsRoot = path.join(root, "skills");
const internalTerms = [
  /app server/i,
  /json-rpc/i,
  /\brpc\b/i,
  /trace buffer/i,
  /plugin cache/i,
  /runtime internals/i,
  /managed thread/i,
  /mounted-skill/i
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function frontmatterDescription(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!match) return "";
  const line = match[1].split(/\r?\n/).find((item) => /^description:\s*/.test(item));
  return line ? line.replace(/^description:\s*/, "").replace(/^['"]|['"]$/g, "") : "";
}

function yamlScalar(text, key) {
  const pattern = new RegExp(`^\\s*${key}:\\s*(.+)$`, "m");
  const match = pattern.exec(text);
  return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : "";
}

const errors = [];
for (const skillName of fs.readdirSync(skillsRoot).sort()) {
  const skillDir = path.join(skillsRoot, skillName);
  if (!fs.statSync(skillDir).isDirectory()) continue;
  const skillPath = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillPath)) continue;
  const description = frontmatterDescription(read(skillPath));
  const manifestPath = path.join(skillDir, "agents", "openai.yaml");
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${skillName}: missing agents/openai.yaml with interface.default_prompt`);
    continue;
  }
  const manifest = read(manifestPath);
  const shortDescription = yamlScalar(manifest, "short_description");
  const defaultPrompt = yamlScalar(manifest, "default_prompt");
  if (!defaultPrompt) errors.push(`${skillName}: agents/openai.yaml missing interface.default_prompt`);
  if (defaultPrompt && !defaultPrompt.includes(`$${skillName}`)) {
    errors.push(`${skillName}: default_prompt must mention $${skillName}`);
  }
  for (const [surface, value] of [
    ["frontmatter description", description],
    ["openai short_description", shortDescription],
    ["openai default_prompt", defaultPrompt]
  ]) {
    for (const term of internalTerms) {
      if (term.test(value)) errors.push(`${skillName}: ${surface} exposes internal term ${term}: ${value}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("routing-surface-language ok");
NODE
