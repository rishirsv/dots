#!/usr/bin/env node
import assert from 'node:assert/strict';

import { buildRenderContext } from '../generator/runtime/render-context.js';
import { renderDeck } from '../generator/runtime/render-deck.js';
import { resolveSlideGeometry } from '../generator/runtime/layout-contract.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const templatePackage = loadTemplatePackage('kpmg-diligence');
const ctx = buildRenderContext(templatePackage);

assert.equal(ctx.theme.tokens, templatePackage.tokens, 'theme.tokens should reference raw template tokens');
assert.ok(ctx.theme.colors.primary, 'theme semantic colors should be present');
assert.equal(ctx.slideRegistry.schemaVersion, '1.0.0', 'slide registry schema version should be exposed');
assert.equal(ctx.paginationPolicy.schemaVersion, '1.0.0', 'pagination policy schema version should be exposed');
assert.ok(ctx.slideRegistry.get('oneColumnText'), 'slide registry should include oneColumnText');
assert.ok(ctx.paginationPolicy.get('text.oneColumn.v1'), 'pagination policy should include one-column policy');
assert.equal(ctx.theme.type.dividerNumber, 48, 'theme.type.dividerNumber should expose divider scale');
assert.equal(ctx.theme.type.dividerTitle, 24, 'theme.type.dividerTitle should expose divider scale');
assert.ok(
  ctx.layoutContract.get('contents')?.boxes?.topRow,
  'layout contract should expose named geometry boxes',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChart2ColsText')?.boxes?.textBox,
  'analysisWideChart2ColsText geometry should normalize to canonical textBox',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChart2ColsText')?.boxes?.title,
  'analysisWideChart2ColsText geometry should include canonical title box',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChart2ColsText')?.boxes?.chartBox,
  'analysisWideChart2ColsText geometry should normalize to canonical chartBox',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChartTableText')?.boxes?.textBox,
  'analysisWideChartTableText geometry should normalize to canonical textBox',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChartTableText')?.boxes?.title,
  'analysisWideChartTableText geometry should include canonical title box',
);
assert.ok(
  ctx.layoutContract.get('analysisWideChartTableText')?.boxes?.chartBox,
  'analysisWideChartTableText geometry should normalize to canonical chartBox',
);

assert.throws(
  () =>
    resolveSlideGeometry(
      {
        get: () => ({ boxes: {}, templateLayout: 'broken-layout' }),
      },
      'analysisWideChart2ColsText',
    ),
  /missing layout contract geometry/i,
  'resolveSlideGeometry should fail fast when canonical geometry is absent',
);

const deckSpec = {
  metadata: {
    allowSparse: true,
    footer: {
      year: 2026,
      legalEntityName: 'KPMG LLP',
      jurisdiction: 'Ontario',
      legalStructure: 'limited liability partnership',
    },
  },
  slides: [
    { type: 'cover', title: 'Theme Refactor', subtitle: 'Regression check' },
    {
      type: 'backCover',
      url: 'example.com',
    },
  ],
};

const { pptx } = renderDeck(deckSpec, templatePackage, { allowSparse: true });
const backCover = pptx._slides[pptx._slides.length - 1];
const textObjects = (backCover?._slideObjects || []).filter((item) => item?._type === 'text');
const renderedText = textObjects
  .flatMap((obj) => Array.isArray(obj?.text) ? obj.text : [])
  .map((run) => String(run?.text || '').trim())
  .filter(Boolean);

assert.ok(
  renderedText.some((text) => text.includes('Firstname Lastname')),
  'back cover should render fallback contacts when contacts are omitted',
);

const urlRun = textObjects
  .flatMap((obj) => Array.isArray(obj?.text) ? obj.text : [])
  .find((run) => String(run?.text || '').trim() === 'example.com');

assert.ok(urlRun, 'back cover URL text should be rendered');
assert.equal(
  urlRun?.options?.hyperlink?.url,
  'https://example.com',
  'back cover hyperlink should come from deck spec URL',
);

const dividerDeckSpec = {
  metadata: deckSpec.metadata,
  slides: [
    { type: 'divider', sectionNumber: '01', sectionTitle: 'Divider Typography Check' },
  ],
};
const { pptx: dividerPptx } = renderDeck(dividerDeckSpec, templatePackage, { allowSparse: true });
const dividerObjects = dividerPptx._slides[0]?._slideObjects || [];
const dividerTexts = dividerObjects.filter((item) => item?._type === 'text');
assert.ok(dividerTexts.length >= 2, 'divider slide should render number and title text objects');
assert.equal(
  dividerTexts[0]?.options?.fontSize,
  ctx.theme.type.dividerNumber,
  'divider number should use theme.type.dividerNumber',
);
assert.equal(
  dividerTexts[1]?.options?.fontSize,
  ctx.theme.type.dividerTitle,
  'divider title should use theme.type.dividerTitle',
);

console.log('Render-context refactor regression passed.');
