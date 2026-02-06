import fs from 'node:fs';
import path from 'node:path';

import template from '../templates/kpmg-diligence/template.js';

export function validateDeckSpec(deckSpec) {
  const errors = [];
  const warnings = [];

  if (!deckSpec || typeof deckSpec !== 'object') {
    return { valid: false, errors: ['Deck spec must be an object'], warnings: [] };
  }

  if (!Array.isArray(deckSpec.slides)) {
    return { valid: false, errors: ['Deck spec missing `slides` array'], warnings: [] };
  }

  deckSpec.slides.forEach((slideSpec, idx) => {
    if (!slideSpec || typeof slideSpec !== 'object') {
      errors.push(`slides[${idx}] must be an object`);
      return;
    }
    if (!slideSpec.type || typeof slideSpec.type !== 'string') {
      errors.push(`slides[${idx}] missing string 'type'`);
      return;
    }
    const v = template.validateSlideContent(slideSpec.type, slideSpec);
    if (!v.valid) {
      for (const e of v.errors) errors.push(`slides[${idx}]: ${e}`);
    }
    for (const w of v.warnings || []) warnings.push(`slides[${idx}]: ${w}`);
  });

  return { valid: errors.length === 0, errors, warnings };
}

export function readJson(filePath) {
  const s = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(s);
}

export async function main(argv = process.argv.slice(2)) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      args.set(a.slice(2), argv[i + 1]);
      i++;
    }
  }

  const inPath = args.get('in');
  if (!inPath) {
    console.error('Usage: node generator/validate.js --in <deck.json>');
    process.exit(2);
  }

  const deckSpec = readJson(inPath);
  const result = validateDeckSpec(deckSpec);

  if (!result.valid) {
    for (const e of result.errors) console.error(e);
    process.exit(1);
  }

  for (const w of result.warnings) console.warn(w);
  console.log('OK');
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}

