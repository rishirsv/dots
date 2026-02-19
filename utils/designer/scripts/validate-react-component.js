#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/validate-react-component.js <component-path>');
  process.exit(2);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(2);
}

const source = fs.readFileSync(filePath, 'utf8');
const filename = path.basename(filePath);

const failures = [];

if (!/interface\s+\w+Props\b/.test(source)) {
  failures.push('Missing Props interface declaration (expected `interface <Name>Props`).');
}

if (/\bStitchComponent\b/.test(source)) {
  failures.push('Found unresolved template placeholder `StitchComponent`.');
}

const hexInClassName = /className\s*=\s*("[^"]*#[0-9A-Fa-f]{3,8}[^"]*"|'[^']*#[0-9A-Fa-f]{3,8}[^']*'|\{`[^`]*#[0-9A-Fa-f]{3,8}[^`]*`\})/;
if (hexInClassName.test(source)) {
  failures.push('Found hardcoded hex color in className. Prefer project tokens/semantic classes.');
}

const styleHex = /style\s*=\s*\{\{[\s\S]*?#[0-9A-Fa-f]{3,8}[\s\S]*?\}\}/;
if (styleHex.test(source)) {
  failures.push('Found hardcoded hex color in style object. Prefer project tokens where possible.');
}

if (failures.length > 0) {
  console.error(`Validation failed for ${filename}:`);
  failures.forEach((f, i) => console.error(`${i + 1}. ${f}`));
  process.exit(1);
}

console.log(`Validation passed for ${filename}.`);
