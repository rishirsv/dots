import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateToFile } from '../generator/index.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const fixturePath = path.join(process.cwd(), 'decks', 'validation-failing-example.deckSpec.json');
const fixtureDeck = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-validation-failure-'));
const outPath = path.join(tmpDir, 'deck.pptx');
const qaPath = path.join(tmpDir, 'qa.json');
const templatePackage = loadTemplatePackage('kpmg-diligence');

let thrown = null;
try {
  await generateToFile(fixtureDeck, outPath, {
    templatePackage,
    qaPath,
    strict: false,
    enforceOverlap: false,
  });
} catch (error) {
  thrown = error;
}

assert.ok(thrown instanceof Error, 'Expected generation to fail for invalid fixture');
assert.equal(fs.existsSync(qaPath), true, 'Expected QA report to be written on validation failure');

const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
assert.equal(qa?.valid, false, 'Expected invalid QA report');
assert.equal(qa?.outputSlideCount, 0, 'Expected no rendered slides for validation failure');
assert.equal(qa?.summary?.status, 'fail', 'Expected failure summary status');
assert.ok(Number(qa?.summary?.blockingIssues || 0) > 0, 'Expected blocking issues in failure summary');
assert.ok(Array.isArray(qa?.errors) && qa.errors.length > 0, 'Expected validation errors');
assert.ok(
  qa.errors.some((item) => String(item).includes("sectionNumber doesn't match pattern")),
  'Expected divider sectionNumber pattern validation error',
);
assert.ok(
  qa.errors.some((item) => String(item).includes('Missing required: body')),
  'Expected missing required body slot error',
);
assert.ok(
  Array.isArray(qa?.missingSlots) && qa.missingSlots.some((item) => item?.slideType === 'oneColumnText' && item?.slot === 'body'),
  'Expected missingSlots entry for oneColumnText.body',
);

console.log('Validation failure regression test passed.');
console.log(`Fixture: ${fixturePath}`);
console.log(`QA: ${qaPath}`);
