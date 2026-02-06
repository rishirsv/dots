import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import template from '../templates/kpmg-diligence/template.js';

/**
 * Build a minimal slot value for a layout slot.
 * @param {object} def
 * @returns {any}
 */
function buildSlotValue(def) {
  if (def.pattern && def.pattern.includes('\\d{2}')) {
    return '01';
  }
  switch (def.kind) {
    case 'text':
      return 'Sample text';
    case 'textArray':
      return ['Sample bullet'];
    case 'table':
      return { headers: ['Metric', 'FY1'], rows: [['Revenue', '1']] };
    case 'chart':
      return {
        type: 'bar',
        data: [{ name: 'Series', labels: ['A'], values: [1] }],
      };
    case 'image':
      return template.ASSETS?.coverPhoto || template.ASSETS?.gradientDivider || '';
    default:
      return 'Sample';
  }
}

/**
 * Build a slide spec for a layout type using required slots.
 * @param {string} type
 * @param {object} layout
 * @returns {object}
 */
function buildSlideSpec(type, layout) {
  const slots = layout?.slots || {};
  const slide = { type };
  for (const [name, def] of Object.entries(slots)) {
    if (def.required) {
      slide[name] = buildSlotValue(def);
    }
  }
  return slide;
}

async function main() {
  const layouts = template.LAYOUTS || {};
  const slides = [];
  for (const [type, layout] of Object.entries(layouts)) {
    const slideSpec = buildSlideSpec(type, layout);
    const validation = template.validateSlideContent(type, slideSpec);
    assert.ok(validation.valid, `Validation failed for ${type}: ${validation.errors?.join(', ')}`);
    slides.push(slideSpec);
  }

  const deckSpec = { slides };
  const pptx = template.generateDeck(deckSpec);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-gen-smoke-'));
  const outPath = path.join(tmpDir, 'smoke.pptx');
  await pptx.writeFile({ fileName: outPath, compression: true });
  assert.ok(fs.existsSync(outPath), 'Smoke deck output not found');

  console.log(`Smoke test generated: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
