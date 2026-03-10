import assert from 'node:assert/strict';
import fs from 'node:fs';

import { MANIFEST_PATH, syncSkillBundle } from './sync-skill-bundle.mjs';

function readManifestText() {
  return fs.readFileSync(MANIFEST_PATH, 'utf8');
}

function readManifestJson() {
  return JSON.parse(readManifestText());
}

syncSkillBundle();
const firstManifestText = readManifestText();
const firstManifest = readManifestJson();

assert.equal(firstManifest.schemaVersion, 1, 'Skill bundle manifest should keep the stable schema version.');
assert.ok(Array.isArray(firstManifest.entries) && firstManifest.entries.length > 0, 'Skill bundle manifest should contain synced entries.');
assert.ok(!Object.hasOwn(firstManifest, 'generatedAt'), 'Skill bundle manifest should not include nondeterministic generatedAt timestamps.');

syncSkillBundle();
const secondManifestText = readManifestText();

assert.equal(
  secondManifestText,
  firstManifestText,
  'Running skill bundle sync twice with identical inputs should produce identical manifest output.',
);

console.log('Skill bundle determinism test passed.');
