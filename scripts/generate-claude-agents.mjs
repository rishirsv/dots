#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const agentsDir = join(root, "plugins", "dots", "agents");
const args = process.argv.slice(2);
const check = args[0] === "--check";

if (args.length > 1 || (args.length === 1 && !check)) {
  console.error("Usage: scripts/generate-claude-agents.mjs [--check]");
  process.exit(2);
}

function stringField(source, name) {
  const match = source.match(new RegExp(`^${name} = (.+)$`, "m"));
  if (!match) throw new Error(`missing ${name}`);
  return JSON.parse(match[1]);
}

function renderAgent(source) {
  const name = stringField(source, "name");
  const description = stringField(source, "description");
  const effort = stringField(source, "model_reasoning_effort");
  const readOnly = source.includes('sandbox_mode = "read-only"');
  const prompt = source.match(/developer_instructions = """\n([\s\S]*?)\n"""/);
  if (!prompt) throw new Error("missing developer_instructions");

  const skills = [...source.matchAll(/^path = "\.\.\/skills\/([^/]+)\/SKILL\.md"$/gm)]
    .map((match) => `dots:${match[1]}`);
  const frontmatter = [
    "---",
    `name: ${name}`,
    `description: ${JSON.stringify(description)}`,
    "model: inherit",
    `effort: ${effort}`,
    `disallowedTools: ${readOnly ? "Write, Edit, Agent" : "Agent"}`,
  ];
  if (skills.length) {
    frontmatter.push("skills:", ...skills.map((skill) => `  - ${skill}`));
  }
  return `${frontmatter.join("\n")}\n---\n\n${prompt[1].trim()}\n`;
}

const stale = [];
const sources = readdirSync(agentsDir).filter((name) => name.endsWith(".toml")).sort();
for (const filename of sources) {
  const sourcePath = join(agentsDir, filename);
  const outputPath = sourcePath.replace(/\.toml$/, ".md");
  const rendered = renderAgent(readFileSync(sourcePath, "utf8"));
  if (check) {
    try {
      if (readFileSync(outputPath, "utf8") !== rendered) stale.push(outputPath);
    } catch {
      stale.push(outputPath);
    }
  } else {
    writeFileSync(outputPath, rendered);
  }
}

if (stale.length) {
  const files = stale.map((path) => `- ${path}`).join("\n");
  console.error(`Claude agent definitions are stale:\n${files}`);
  process.exit(1);
}

console.log(check ? "Claude agent definitions are current" : "Generated Claude agent definitions");
