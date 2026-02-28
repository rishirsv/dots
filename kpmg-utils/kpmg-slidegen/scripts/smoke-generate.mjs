import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

import { generateToFile } from '../generator/index.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

/**
 * Build a tiny valid deck for smoke generation checks.
 * @returns {object}
 */
function makeSmokeDeck() {
  return {
    metadata: {
      title: 'Smoke Deck',
      author: 'Smoke Test',
      company: 'KPMG LLP',
      subject: 'Smoke',
      allowSparse: true,
      footer: {
        year: 2026,
        legalEntityName: 'KPMG LLP',
        jurisdiction: 'Ontario',
        legalStructure: 'limited liability partnership',
        documentClassification: 'KPMG Confidential',
      },
    },
    slides: [
      {
        type: 'cover',
        title: 'Smoke Test',
        subtitle: 'Generator pipeline validation',
      },
      {
        type: 'divider',
        sectionNumber: '01',
        sectionTitle: 'Start',
      },
      {
        type: 'oneColumnText',
        title: 'Body',
        strapline: 'Simple smoke slide',
        body: ['Line 1', 'Line 2', 'Line 3'],
      },
      {
        type: 'backCover',
      },
    ],
  };
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slidegen-smoke-'));
const outPath = path.join(tmpDir, 'deck.pptx');
const qaPath = path.join(tmpDir, 'qa.json');
const templatePackage = loadTemplatePackage('kpmg-diligence');

await generateToFile(makeSmokeDeck(), outPath, {
  templatePackage,
  qaPath,
  allowSparse: true,
  enforceOverlap: false,
  strict: false,
});

assert.equal(fs.existsSync(outPath), true, 'Expected deck.pptx to be created');
assert.equal(fs.existsSync(qaPath), true, 'Expected qa.json to be created');

const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
assert.equal(qa?.valid, true, 'Expected smoke QA to be valid');

console.log('Smoke generation passed.');
console.log(`Output: ${outPath}`);
console.log(`QA: ${qaPath}`);
