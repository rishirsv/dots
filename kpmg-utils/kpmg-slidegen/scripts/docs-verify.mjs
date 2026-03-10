import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { REPO_ROOT } from './support.mjs';

const DOCS = [
  path.join(REPO_ROOT, 'docs', 'architecture', 'layout-authoring.md'),
  path.join(REPO_ROOT, 'docs', 'onboarding', 'onboard-layout.md'),
];

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
const scripts = packageJson.scripts || {};

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function verifyCommands(raw, filePath) {
  const npmRunRegex = /npm run ([a-z0-9:-]+)/g;
  for (const match of raw.matchAll(npmRunRegex)) {
    const command = match[1];
    assert.ok(scripts[command], `Missing npm script referenced in ${path.relative(REPO_ROOT, filePath)}: ${command}`);
  }

  const nodeScriptRegex = /node (scripts\/[^\s\\`]+\.mjs|generator\/[^\s\\`]+\.js)/g;
  for (const match of raw.matchAll(nodeScriptRegex)) {
    const relPath = match[1];
    const absPath = path.join(REPO_ROOT, relPath);
    assert.equal(fs.existsSync(absPath), true, `Missing node script referenced in ${path.relative(REPO_ROOT, filePath)}: ${relPath}`);
  }
}

function verifyPaths(raw, filePath) {
  const pathRegex = /`((?:docs|scripts|templates-src|templates|generator|onboarding|outputs|skills|presets|references)\/[^`]+)`/g;
  for (const match of raw.matchAll(pathRegex)) {
    const relPath = match[1].replace(/\/\*.*$/, '');
    if (relPath.includes('<') || relPath.includes('>')) continue;
    const absPath = path.join(REPO_ROOT, relPath);
    assert.equal(fs.existsSync(absPath), true, `Missing path referenced in ${path.relative(REPO_ROOT, filePath)}: ${relPath}`);
  }
}

function verifyNoStaleExamples(raw, filePath) {
  const banned = [
    'init-layout.mjs',
    '--family businessOverview',
    'onboarding/layouts/<layout-id>/',
    'source.json',
    'seed/geometry.seed.json',
  ];
  for (const token of banned) {
    assert.equal(
      raw.includes(token),
      false,
      `Stale onboarding example in ${path.relative(REPO_ROOT, filePath)}: ${token}`,
    );
  }
}

for (const docPath of DOCS) {
  assert.equal(fs.existsSync(docPath), true, `Missing authoritative doc: ${path.relative(REPO_ROOT, docPath)}`);
  const raw = read(docPath);
  verifyCommands(raw, docPath);
  verifyPaths(raw, docPath);
  verifyNoStaleExamples(raw, docPath);
}

console.log('Docs verification passed.');
