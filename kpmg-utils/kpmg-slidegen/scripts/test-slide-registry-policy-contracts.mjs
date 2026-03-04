#!/usr/bin/env node
import assert from 'node:assert/strict';

import { buildRenderContext } from '../generator/runtime/render-context.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const templatePackage = loadTemplatePackage('kpmg-diligence');
const ctx = buildRenderContext({ templatePackage });
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

function hasFiniteBox(value) {
  if (!value || typeof value !== 'object') return false;
  if (
    Number.isFinite(value.x) &&
    Number.isFinite(value.y) &&
    Number.isFinite(value.w) &&
    Number.isFinite(value.h)
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.some((item) => hasFiniteBox(item));
  return Object.values(value).some((item) => hasFiniteBox(item));
}

function isFiniteBox(value) {
  return Boolean(
    value &&
      Number.isFinite(value.x) &&
      Number.isFinite(value.y) &&
      Number.isFinite(value.w) &&
      Number.isFinite(value.h),
  );
}

function hasRequiredGeometryValue(value) {
  if (Array.isArray(value)) return value.length > 0 && value.every((box) => isFiniteBox(box));
  return isFiniteBox(value);
}

const templateTypes = Object.keys(templatePackage?.layouts?.types || {}).sort();
const registryTypes = ctx.slideRegistry.list().slice().sort();
assert.deepEqual(
  registryTypes,
  templateTypes,
  'slide registry must be the authoritative 1:1 map of template slide types',
);

for (const type of registryTypes) {
  const entry = ctx.slideRegistry.get(type);
  assert.ok(entry, `registry entry missing for ${type}`);
  assert.ok(entry.builderId, `builderId missing for ${type}`);
  assert.ok(entry.masterVariant, `masterVariant missing for ${type}`);
  assert.ok(entry.paginationPolicyKey, `paginationPolicyKey missing for ${type}`);
  const policy = ctx.paginationPolicy.get(entry.paginationPolicyKey);
  assert.ok(policy, `pagination policy not found for ${type} (${entry.paginationPolicyKey})`);
  assert.match(policy.key, /^.+\.v\d+$/, `pagination policy key should be versioned: ${policy.key}`);

  const contract = ctx.templateContracts.get(type);
  assert.equal(
    contract.schemaVersion,
    ctx.templateContracts.schemaVersion,
    `layout contract schema version mismatch for ${type}`,
  );

  for (const key of entry.geometryContract.requiredKeys || []) {
    const value = contract?.boxes?.[key];
    assert.ok(hasRequiredGeometryValue(value), `required geometry key "${key}" missing/invalid for slide type ${type}`);
  }

  const resolved = ctx.contracts.resolveForSlide({ type }, type);
  assert.ok(hasFiniteBox(resolved?.geometry), `contracts resolver should provide geometry for ${type}`);
  assert.equal(typeof resolved.masterName, 'string', `contracts resolver should provide masterName for ${type}`);
  const builderCtx = ctx.buildBuilderCtx({
    slideSpec: { type },
    registryType: type,
    options: { ...ctx.options, footerValues: {} },
  });
  assert.deepEqual(
    Object.keys(builderCtx).sort(),
    expectedBuilderCtxKeys,
    `builder ctx keys mismatch for ${type}`,
  );
}

console.log('Slide registry + pagination policy contract checks passed.');
