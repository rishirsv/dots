#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const entry = path.join(__dirname, "..", "app", "main.js");

if (!fs.existsSync(entry)) {
  console.error(`error: Meta Skill CLI runtime is missing: ${entry}`);
  process.exit(1);
}

require(entry);
