#!/usr/bin/env node
import assert from 'node:assert/strict';

import { buildRenderContext } from '../generator/runtime/render-context.js';
import { loadTemplatePackage } from '../generator/runtime/template-package.js';

const templatePackage = loadTemplatePackage('kpmg-diligence');
const ctx = buildRenderContext(templatePackage);

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

  const contract = ctx.layoutContract.get(type);
  assert.equal(
    contract.schemaVersion,
    ctx.layoutContract.schemaVersion,
    `layout contract schema version mismatch for ${type}`,
  );

  for (const key of entry.requiredGeometry || []) {
    const value = contract?.boxes?.[key];
    const valid =
      (Array.isArray(value) && value.length > 0 && value.every((box) => Number.isFinite(box?.x) && Number.isFinite(box?.y) && Number.isFinite(box?.w) && Number.isFinite(box?.h))) ||
      (value && Number.isFinite(value?.x) && Number.isFinite(value?.y) && Number.isFinite(value?.w) && Number.isFinite(value?.h));
    assert.ok(valid, `required geometry key "${key}" missing/invalid for slide type ${type}`);
  }
}

console.log('Slide registry + pagination policy contract checks passed.');
