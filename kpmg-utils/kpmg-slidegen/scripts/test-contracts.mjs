import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { buildRenderContext } from '../generator/runtime/render-context.js';
import {
  normalizeExtractedGeometry,
  validateCanonicalGeometry,
} from '../generator/runtime/geometry-contract.js';
import { getSlideRegistry } from '../generator/runtime/slide-registry.js';
import { cloneTemplatePackage, loadTemplatePackage } from '../generator/runtime/template-package.js';
import { readSourceLayoutPackageMeta, readSourceLayouts } from './codegen/lib.mjs';
import { REPO_ROOT } from './support.mjs';

const templatePackage = loadTemplatePackage('kpmg-diligence');
const ctx = buildRenderContext({ templatePackage });
const onboardedRegistryIndex = readJson('generator/runtime/onboarded-registry.index.json');
const expectedBuilderCtxKeys = [
  'assets',
  'diagnostics',
  'footerSafeTopByMaster',
  'geometry',
  'masterName',
  'options',
  'template',
  'theme',
];

/**
 * Read JSON from the repo root.
 * @param {string} relPath
 * @returns {any}
 */
function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8'));
}

/**
 * Return sorted unique values.
 * @param {string[]} values
 * @returns {string[]}
 */
function sortedUnique(values) {
  return Array.from(new Set(values)).sort();
}

/**
 * Find items present in expected but missing from actual.
 * @param {string[]} expected
 * @param {string[]} actual
 * @returns {string[]}
 */
function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

/**
 * Determine whether a geometry box is fully defined.
 * @param {any} value
 * @returns {boolean}
 */
function isFiniteBox(value) {
  return Boolean(
    value &&
      Number.isFinite(value.x) &&
      Number.isFinite(value.y) &&
      Number.isFinite(value.w) &&
      Number.isFinite(value.h),
  );
}

/**
 * Determine whether a geometry payload contains at least one finite box.
 * @param {any} value
 * @returns {boolean}
 */
function hasFiniteBox(value) {
  if (isFiniteBox(value)) return true;
  if (Array.isArray(value)) return value.some((item) => hasFiniteBox(item));
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some((item) => hasFiniteBox(item));
}

/**
 * Determine whether a required geometry slot is valid.
 * @param {any} value
 * @returns {boolean}
 */
function hasRequiredGeometryValue(value) {
  if (Array.isArray(value)) return value.length > 0 && value.every((box) => isFiniteBox(box));
  return isFiniteBox(value);
}

const schema = readJson('references/deckspec.schema.json');
const templateTypes = sortedUnique(Object.keys(templatePackage?.layouts?.types || {}));
const schemaTypes = sortedUnique(
  Object.entries(schema?.$defs || {})
    .filter(([defName]) => defName !== 'slide')
    .map(([, def]) => def?.properties?.type?.const)
    .filter(Boolean),
);
const registryTypes = ctx.slideRegistry.list().slice().sort();
const sourceLayoutTypes = sortedUnique(readSourceLayouts().map((layout) => layout.type));
const authoredRegistryTypes = sortedUnique((onboardedRegistryIndex.entries || []).map((entry) => entry.type));
const authoredLayoutPackageMeta = readSourceLayoutPackageMeta();
const generatedLayoutsPackageMeta = Object.fromEntries(
  Object.entries(templatePackage.layouts || {}).filter(([key]) => key !== 'types' && key !== 'generatedFileHeader'),
);

assert.deepEqual(diff(templateTypes, schemaTypes), [], 'Every template type must appear in the docs schema.');
assert.deepEqual(diff(schemaTypes, templateTypes), [], 'Schema must not document unknown slide types.');
assert.deepEqual(registryTypes, templateTypes, 'Slide registry must cover every template type exactly once.');
assert.deepEqual(
  generatedLayoutsPackageMeta,
  authoredLayoutPackageMeta,
  'Generated layout package metadata must come directly from authored layout package metadata.',
);
assert.deepEqual(
  authoredRegistryTypes,
  sourceLayoutTypes,
  'Generated authored registry index must cover every source layout type, including built-ins.',
);
assert.equal(onboardedRegistryIndex.schemaVersion, 4, 'Onboarded registry index schema version should reflect authoritative authored built-in entries.');
assert.ok(templatePackage?.layouts?.masters?.variants, 'Template package must expose master variants.');
assert.ok(templatePackage?.tokens?.dimensions, 'Template package must expose slide dimensions.');

for (const entry of onboardedRegistryIndex.entries || []) {
  assert.ok(entry.type, 'Onboarded registry entries must declare a type.');
  assert.ok(entry.builderModule, `Onboarded registry entry missing builderModule for ${entry.type}`);
  assert.ok(entry.builderExport, `Onboarded registry entry missing builderExport for ${entry.type}`);
  assert.equal(
    fs.existsSync(path.join(REPO_ROOT, entry.builderModule)),
    true,
    `Onboarded builder module missing for ${entry.type}`,
  );
}

for (const type of registryTypes) {
  const entry = ctx.slideRegistry.get(type);
  assert.ok(entry, `Registry entry missing for ${type}`);
  assert.equal(typeof entry.builder, 'function', `Builder missing for ${type}`);
  assert.ok(entry.builderId, `builderId missing for ${type}`);
  assert.equal(typeof entry.master, 'string', `master missing for ${type}`);
  assert.ok(entry.paginationPolicyKey, `paginationPolicyKey missing for ${type}`);
  assert.ok(entry.geometryKinds, `geometryKinds missing for ${type}`);

  const policy = ctx.paginationPolicy.get(entry.paginationPolicyKey);
  assert.ok(policy, `Pagination policy missing for ${type}`);
  assert.match(policy.key, /^.+\.v\d+$/, `Pagination policy key should be versioned for ${type}`);

  const contract = ctx.templateContracts.get(type);
  assert.ok(contract, `Template contract missing for ${type}`);
  assert.equal(
    contract.schemaVersion,
    ctx.templateContracts.schemaVersion,
    `Contract schema version mismatch for ${type}`,
  );

  for (const key of entry.geometryContract.requiredKeys || []) {
    const value = contract?.boxes?.[key];
    assert.ok(hasRequiredGeometryValue(value), `Required geometry key "${key}" missing for ${type}`);
  }

  const resolved = ctx.contracts.resolveForSlide({ type }, type);
  assert.ok(hasFiniteBox(resolved?.geometry), `Resolved geometry should be finite for ${type}`);
  assert.equal(typeof resolved.masterName, 'string', `Resolved masterName should be present for ${type}`);

  const builderCtx = ctx.buildBuilderCtx({
    slideSpec: { type },
    registryType: type,
    options: { ...ctx.options, footerValues: {} },
  });
  assert.deepEqual(
    Object.keys(builderCtx).sort(),
    expectedBuilderCtxKeys,
    `Builder context keys mismatch for ${type}`,
  );
}

const oneColumnEntry = ctx.slideRegistry.get('oneColumnText');
assert.equal(
  oneColumnEntry.geometryContract.geometryKinds.titleBox,
  'box',
  'Legacy built-in title geometry should derive the box kind.',
);
assert.equal(
  oneColumnEntry.geometryContract.geometryKinds.calloutBoxes,
  'boxArray',
  'Legacy built-in array geometry should derive the boxArray kind.',
);

const oneColumnLayout = templatePackage.layouts.types.oneColumnText;
const normalizedOneColumnGeometry = normalizeExtractedGeometry(oneColumnLayout.geometry, {
  type: 'oneColumnText',
  geometryKinds: oneColumnEntry.geometryContract.geometryKinds,
});
const validatedOneColumnGeometry = validateCanonicalGeometry(normalizedOneColumnGeometry, {
  slideW: ctx.templateContracts.dims.w,
  slideH: ctx.templateContracts.dims.h,
  requiredKeys: oneColumnEntry.geometryContract.requiredKeys,
  optionalDefaults: oneColumnEntry.geometryContract.optionalDefaults,
  geometryKinds: oneColumnEntry.geometryContract.geometryKinds,
  type: 'oneColumnText',
  masterName: oneColumnEntry.master,
  footerSafeTop: ctx.templateContracts.footerSafeTopByMaster[oneColumnEntry.master] ?? null,
});
assert.ok(
  hasFiniteBox(validatedOneColumnGeometry.titleBox),
  'Legacy built-in geometry should still validate with derived geometry kinds.',
);

const customBackCoverType = 'customBackCoverContractSmoke';
const semanticFrameworkType = 'semanticFrameworkContractSmoke';
const builtinBackCoverEntry = getSlideRegistry().get('backCover');
const customTemplatePackage = cloneTemplatePackage(templatePackage, {
  layouts: {
    types: {
      [customBackCoverType]: JSON.parse(
        JSON.stringify(templatePackage.layouts.types.backCover),
      ),
      [semanticFrameworkType]: {
        templateLayout: 'KPMG_WHITE',
        slots: {},
        geometry: {
          titleBox: { x: 0.5, y: 0.5, w: 3.5, h: 0.7 },
          framework: {
            columns: [
              {
                header: { x: 0.7, y: 1.5, w: 2.4, h: 0.6 },
                stages: [
                  { x: 0.7, y: 2.3, w: 2.4, h: 0.8 },
                  { x: 0.7, y: 3.2, w: 2.4, h: 0.8 },
                ],
              },
            ],
          },
          version: 2,
          family: 'framework',
          metadata: {
            variant: 'semantic',
          },
        },
      },
    },
  },
});
const customCtx = buildRenderContext({
  templatePackage: customTemplatePackage,
  options: {
    slideRegistryOverrides: {
      [customBackCoverType]: {
        ...builtinBackCoverEntry,
        builderId: customBackCoverType,
      },
      [semanticFrameworkType]: {
        builderId: semanticFrameworkType,
        builder: builtinBackCoverEntry.builder,
        master: 'KPMG_WHITE',
        requiredGeometry: ['titleBox', 'framework', 'version', 'family', 'metadata'],
        geometryKinds: {
          titleBox: 'box',
          framework: 'boxTree',
          version: 'number',
          family: 'string',
          metadata: 'object',
        },
        primitiveMetadata: {
          id: 'framework',
          version: 1,
          geometryKinds: {
            titleBox: 'box',
            framework: 'boxTree',
          },
        },
        paginationPolicyKey: 'none.v1',
        validationHooks: [],
        excludeFromLogicalPaging: false,
      },
    },
  },
});
const customBackCoverBuilderCtx = customCtx.buildBuilderCtx({
  slideSpec: { type: customBackCoverType },
  registryType: customBackCoverType,
  options: { ...customCtx.options, footerValues: {} },
});
assert.ok(
  customBackCoverBuilderCtx.assets?.closingLogoWhite,
  'Custom backCover override types should inherit required back-cover assets.',
);
assert.ok(
  customBackCoverBuilderCtx.assets?.closingSocialLinkedin,
  'Custom backCover override types should inherit social icon assets.',
);

const semanticRegistry = customCtx.slideRegistry.get(semanticFrameworkType);
assert.equal(
  semanticRegistry.geometryContract.geometryKinds.framework,
  'boxTree',
  'Registry should resolve geometryKinds from primitive metadata.',
);

const semanticGeometryKinds = semanticRegistry.geometryContract.geometryKinds;
const semanticGeometry = normalizeExtractedGeometry(
  customTemplatePackage.layouts.types[semanticFrameworkType].geometry,
  {
    type: semanticFrameworkType,
    geometryKinds: semanticGeometryKinds,
  },
);
const validatedSemanticGeometry = validateCanonicalGeometry(semanticGeometry, {
  slideW: customCtx.templateContracts.dims.w,
  slideH: customCtx.templateContracts.dims.h,
  requiredKeys: semanticRegistry.geometryContract.requiredKeys,
  geometryKinds: semanticGeometryKinds,
  type: semanticFrameworkType,
  masterName: semanticRegistry.master,
});
assert.equal(validatedSemanticGeometry.version, 2, 'Semantic number geometry should validate.');
assert.equal(validatedSemanticGeometry.family, 'framework', 'Semantic string geometry should validate.');
assert.equal(validatedSemanticGeometry.metadata.variant, 'semantic', 'Semantic object geometry should validate.');

assert.throws(
  () =>
    normalizeExtractedGeometry(
      {
        titleBox: { x: 0.5, y: 0.5, w: 3.5, h: 0.7 },
        rogueBox: { x: 0.5, y: 1.5, w: 2.0, h: 0.6 },
      },
      {
        type: semanticFrameworkType,
        geometryKinds: semanticGeometryKinds,
      },
    ),
  /unknown key\(s\): rogueBox/,
  'Unknown geometry keys should remain fatal.',
);

assert.throws(
  () =>
    validateCanonicalGeometry(
      {
        titleBox: { x: 0.5, y: 0.5, w: 3.5, h: 0.7 },
        framework: {
          columns: [
            {
              header: { x: 0.7, y: 1.5, w: 2.4, h: 0.6 },
              stages: ['bad'],
            },
          ],
        },
        version: 2,
        family: 'framework',
        metadata: { variant: 'semantic' },
      },
      {
        slideW: customCtx.templateContracts.dims.w,
        slideH: customCtx.templateContracts.dims.h,
        requiredKeys: semanticRegistry.geometryContract.requiredKeys,
        geometryKinds: semanticGeometryKinds,
        type: semanticFrameworkType,
        masterName: semanticRegistry.master,
      },
    ),
  /expected box tree/,
  'Malformed boxTree payloads should fail validation.',
);

console.log('Contract lane passed.');
