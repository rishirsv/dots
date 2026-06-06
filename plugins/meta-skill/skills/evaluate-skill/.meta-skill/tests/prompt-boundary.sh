#!/usr/bin/env bash
set -euo pipefail

root="${META_SKILL_PROJECT_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"

node - "$root" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const skillPath = path.join(root, "SKILL.md");
const authoringPath = path.join(root, "references", "eval-authoring.md");

const skill = fs.readFileSync(skillPath, "utf8");
const authoring = fs.readFileSync(authoringPath, "utf8");

const requiredGuidance = [
  {
    file: "SKILL.md",
    text: "Solver prompts should read like normal user requests."
  },
  {
    file: "SKILL.md",
    text: "They must not tell the solver it is running a test, benchmark, grader pass, or self-eval case."
  },
  {
    file: "references/eval-authoring.md",
    text: "The subagent should feel like it is answering a real maintainer or end user, not participating in a test harness."
  },
  {
    file: "references/eval-authoring.md",
    text: "Do not tell the solver it is running a test, benchmark, grader pass, or self-eval case."
  }
];

for (const requirement of requiredGuidance) {
  const source = requirement.file === "SKILL.md" ? skill : authoring;
  if (!source.includes(requirement.text)) {
    console.error(`${requirement.file} is missing prompt-boundary guidance: ${requirement.text}`);
    process.exit(1);
  }
}

function fencedBlocks(markdown, file) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let current = null;
  let preceding = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fence = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      if (!current) {
        current = {
          file,
          lang: fence[1],
          startLine: i + 1,
          context: preceding.slice(-8).join("\n"),
          body: []
        };
      } else {
        current.endLine = i + 1;
        blocks.push(current);
        current = null;
      }
      preceding.push(line);
      continue;
    }

    if (current) {
      current.body.push(line);
    } else {
      preceding.push(line);
    }
  }

  return blocks;
}

const solverVisibleBlocks = fencedBlocks(authoring, "references/eval-authoring.md").filter((block) => {
  if (block.lang !== "md") return false;
  const body = block.body.join("\n");
  const context = block.context;
  return /## Task\b/.test(body) || /subagent task/i.test(context) || /task\.md/i.test(context);
});

const bannedPatterns = [
  /\brunning\s+(?:a\s+|the\s+)?tests?\b/i,
  /\b(?:this|the|a)\s+tests?\b/i,
  /\btest\s+(?:case|harness|run|pass|prompt|scenario)\b/i,
  /\bbenchmark(?:s|ing)?\b/i,
  /\bgrader(?:\s+pass)?\b/i,
  /\bself[- ]eval(?:uation)?(?:\s+case)?\b/i
];

const leaks = [];
for (const block of solverVisibleBlocks) {
  const body = block.body.join("\n");
  for (const pattern of bannedPatterns) {
    if (pattern.test(body)) {
      leaks.push(`${block.file}:${block.startLine}-${block.endLine} matches ${pattern}`);
    }
  }
}

if (leaks.length) {
  console.error("Solver-visible examples contain harness framing:");
  for (const leak of leaks) console.error(`- ${leak}`);
  process.exit(1);
}

console.log("prompt-boundary ok");
NODE
