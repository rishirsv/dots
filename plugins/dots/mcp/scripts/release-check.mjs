import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const manifestPath = path.join(root, 'manifests/SHA256SUMS.json');
const before = fs.readFileSync(manifestPath, 'utf8');
const generation = spawnSync(
  process.execPath,
  [path.join(root, 'dist/scripts/generate.js')],
  { cwd: root, stdio: 'inherit' },
);

if (generation.status !== 0) process.exit(generation.status ?? 1);

if (before !== fs.readFileSync(manifestPath, 'utf8')) {
  console.error('Generated metadata changed. Review and commit the updated manifests.');
  process.exitCode = 1;
}

const digest = (value) => createHash('sha256').update(value).digest('hex');
const checks = JSON.parse(before);
for (const [file, expected] of Object.entries(checks)) {
  const actual = digest(fs.readFileSync(path.join(root, 'manifests', file)));
  if (actual !== expected) {
    console.error(`Manifest digest mismatch: ${file}`);
    process.exitCode = 1;
  }
}

if (!fs.existsSync(path.join(root, 'package-lock.json'))) {
  console.error('Missing package-lock.json.');
  process.exitCode = 1;
}
