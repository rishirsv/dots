#!/usr/bin/env node
import assert from 'node:assert/strict';

import { buildRenderContext } from '../generator/runtime/render-context.js';
import { renderDeck } from '../generator/runtime/render-deck.js';
import { resolveSlideGeometry } from '../generator/runtime/template-contracts.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const templatePackage = loadTemplatePackage('kpmg-diligence');
const ctx = buildRenderContext({ templatePackage });

function cloneTemplatePackage(source) {
  return {
    ...source,
    tokens: JSON.parse(JSON.stringify(source.tokens)),
    layouts: JSON.parse(JSON.stringify(source.layouts)),
    paginationPolicy: JSON.parse(JSON.stringify(source.paginationPolicy)),
    assetsManifest: JSON.parse(JSON.stringify(source.assetsManifest)),
    resolveAssetPath: source.resolveAssetPath,
  };
}

assert.equal(ctx.template, templatePackage, 'render context should expose template package');
assert.equal(ctx.theme.tokens, templatePackage.tokens, 'theme.tokens should reference raw template tokens');
assert.ok(ctx.theme.colors.primary, 'theme semantic colors should be present');
assert.equal(ctx.slideRegistry.schemaVersion, '2.0.0', 'slide registry schema version should be exposed');
assert.equal(ctx.paginationPolicy.schemaVersion, '1.0.0', 'pagination policy schema version should be exposed');
assert.ok(ctx.slideRegistry.get('oneColumnText'), 'slide registry should include oneColumnText');
assert.ok(ctx.paginationPolicy.get('text.oneColumn.v1'), 'pagination policy should include one-column policy');
assert.equal(ctx.theme.type.dividerNumber, 48, 'theme.type.dividerNumber should expose divider scale');
assert.equal(ctx.theme.type.dividerTitle, 24, 'theme.type.dividerTitle should expose divider scale');
assert.ok(
  ctx.templateContracts.get('contents')?.boxes?.topRowBox,
  'layout contract should expose named geometry boxes',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChart2ColsText')?.boxes?.bodyBox,
  'analysisWideChart2ColsText geometry should expose canonical bodyBox',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChart2ColsText')?.boxes?.titleBox,
  'analysisWideChart2ColsText geometry should include canonical titleBox',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChart2ColsText')?.boxes?.chartBox,
  'analysisWideChart2ColsText geometry should expose canonical chartBox',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChartTableText')?.boxes?.bodyBox,
  'analysisWideChartTableText geometry should expose canonical bodyBox',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChartTableText')?.boxes?.titleBox,
  'analysisWideChartTableText geometry should include canonical titleBox',
);
assert.ok(
  ctx.templateContracts.get('analysisWideChartTableText')?.boxes?.chartBox,
  'analysisWideChartTableText geometry should expose canonical chartBox',
);
assert.equal(typeof ctx.buildBuilderCtx, 'function', 'render context should expose buildBuilderCtx');
assert.equal(typeof ctx.contracts?.resolveForSlide, 'function', 'render context should expose contracts resolver');
assert.ok(
  (ctx.contracts?.reservedSlideKeys || []).includes('masterName'),
  'render context should expose reserved builder ctx keys',
);
const coverResolved = ctx.contracts.resolveForSlide({ type: 'cover' }, 'cover');
assert.ok(coverResolved.geometry?.titleBox, 'contracts resolver should provide cover geometry');
assert.ok(coverResolved.assets?.logoWhite, 'contracts resolver should provide cover assets');
const coverBuilderCtx = ctx.buildBuilderCtx({
  slideSpec: { type: 'cover' },
  registryType: 'cover',
  options: { ...ctx.options, footerValues: {} },
});
assert.equal(coverBuilderCtx.template, templatePackage, 'builder ctx should expose template');
assert.ok(coverBuilderCtx.footerSafeTopByMaster, 'builder ctx should expose footer safe top map');
assert.equal(coverBuilderCtx.masterName, coverResolved.masterName, 'builder ctx should preserve resolved master');

const legacyGeometryTemplate = cloneTemplatePackage(templatePackage);
legacyGeometryTemplate.layouts.types.cover.geometry = {
  title: { x: 1, y: 1, w: 2, h: 1 },
  logo: { x: 1, y: 0.4, w: 1, h: 0.4 },
  photo: { x: 5, y: 1.6, w: 6.8, h: 4.7 },
};
assert.throws(
  () => buildRenderContext({ templatePackage: legacyGeometryTemplate }),
  /unknown key\(s\):/i,
  'startup should fail on legacy/non-canonical geometry keys',
);

const outOfBoundsTemplate = cloneTemplatePackage(templatePackage);
outOfBoundsTemplate.layouts.types.cover.geometry.titleBox = {
  ...outOfBoundsTemplate.layouts.types.cover.geometry.titleBox,
  x: 12.4,
  w: 1.5,
};
assert.throws(
  () => buildRenderContext({ templatePackage: outOfBoundsTemplate }),
  /box exceeds slide width/i,
  'startup should fail on out-of-bounds geometry',
);

const footerOverlapTemplate = cloneTemplatePackage(templatePackage);
footerOverlapTemplate.layouts.types.oneColumnText.geometry.bodyBox = {
  ...footerOverlapTemplate.layouts.types.oneColumnText.geometry.bodyBox,
  h: 6.0,
};
assert.throws(
  () => buildRenderContext({ templatePackage: footerOverlapTemplate }),
  /overlaps footer-safe zone/i,
  'startup should fail when geometry overlaps footer safe zone',
);

assert.throws(
  () =>
    resolveSlideGeometry(
      {
        get: () => ({ boxes: {}, templateLayout: 'broken-layout' }),
      },
      'analysisWideChart2ColsText',
    ),
  /missing template contracts resolver/i,
  'resolveSlideGeometry should fail fast when the template-contract resolver is absent',
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

const reservedCollisionDeckSpec = {
  metadata: deckSpec.metadata,
  slides: [
    {
      type: 'cover',
      title: 'Reserved Collision Check',
      subtitle: 'Strict mode should reject runtime keys',
      masterName: 'KPMG_WHITE',
    },
  ],
};
assert.throws(
  () => renderDeck(reservedCollisionDeckSpec, templatePackage, { allowSparse: true, strict: true }),
  /runtime-reserved key\(s\): masterName/i,
  'strict mode should fail when slide input includes runtime-reserved builder ctx keys',
);

console.log('Render-context refactor regression passed.');
