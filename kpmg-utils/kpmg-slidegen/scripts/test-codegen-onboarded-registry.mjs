import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import {
  buildOnboardedIndex,
  buildOnboardedModule,
  buildRegistryEntries,
  resolveRuntimeImportPath,
  validateRegistryEntries,
} from './codegen/generate-runtime-aggregates.mjs';

function makePrimitive({
  id,
  version = 1,
  builderModule,
  builderExport,
  master = 'KPMG_WHITE',
  requiredGeometry = ['titleBox'],
}) {
  return {
    id,
    version,
    builderModule,
    builderExport,
    geometryKinds: {
      titleBox: 'box',
    },
    requiredGeometry,
    optionalGeometry: [],
    optionalDefaults: {},
    paginationPolicyKey: 'none.v1',
    master,
    validationHooks: [],
    excludeFromLogicalPaging: false,
  };
}

function makeLayout(type, primitive) {
  return {
    type,
    primitive,
    description: `${type} layout`,
    templateLayout: type,
    geometry: {
      titleBox: { x: 1, y: 1, w: 4, h: 1 },
    },
    slots: {},
  };
}

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

function assertValidModuleSyntax(source) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-slidegen-registry-'));
  const tempFile = path.join(tempDir, 'onboarded-registry.generated.js');
  try {
    fs.writeFileSync(tempFile, source);
    const result = spawnSync(process.execPath, ['--check', tempFile], {
      encoding: 'utf8',
    });
    assert.equal(
      result.status,
      0,
      `Generated onboarded registry module should have valid syntax.\n${result.stderr || result.stdout || ''}`.trim(),
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

{
  const sharedPrimitive = makePrimitive({
    id: 'sharedPrimitive',
    builderModule: 'generator/builders/primitives/shared-builder.js',
    builderExport: 'buildSharedPrimitive',
  });
  const entries = buildRegistryEntries(
    [
      makeLayout('reuseAlpha', 'sharedPrimitive@1'),
      makeLayout('reuseBeta', 'sharedPrimitive@1'),
    ],
    {
      'sharedPrimitive@1': sharedPrimitive,
    },
  );
  const index = buildOnboardedIndex(entries);
  const moduleSource = buildOnboardedModule(entries);

  assert.equal(index.schemaVersion, 4, 'Onboarded registry index schema version should reflect authoritative authored built-in coverage.');
  assert.deepEqual(
    entries.map((entry) => ({
      type: entry.type,
      builderModule: entry.builderModule,
      builderExport: entry.builderExport,
    })),
    [
      {
        type: 'reuseAlpha',
        builderModule: 'generator/builders/primitives/shared-builder.js',
        builderExport: 'buildSharedPrimitive',
      },
      {
        type: 'reuseBeta',
        builderModule: 'generator/builders/primitives/shared-builder.js',
        builderExport: 'buildSharedPrimitive',
      },
    ],
    'Registry entries should preserve the primitive builder module and export for each layout.',
  );
  assert.equal(
    countMatches(moduleSource, /import \{ buildSharedPrimitive \} from '\.\.\/builders\/primitives\/shared-builder\.js';/g),
    1,
    'Shared primitive builder imports should be deduplicated by builder module and export.',
  );
}

{
  const builtinEntries = buildRegistryEntries(
    [
      makeLayout('businessOverview', 'businessOverview@1'),
    ],
    {
      'businessOverview@1': makePrimitive({
        id: 'businessOverview',
        builderModule: 'generator/builders/business-overview.js',
        builderExport: 'addBusinessOverview',
      }),
    },
  );
  validateRegistryEntries(
    [makeLayout('businessOverview', 'businessOverview@1')],
    builtinEntries,
  );
  assert.equal(
    builtinEntries[0].type,
    'businessOverview',
    'Built-in layout types should now be generated from authored fragments instead of being skipped.',
  );
}

{
  const entries = buildRegistryEntries(
    [
      makeLayout('multiExportAlpha', 'primitiveAlpha@1'),
      makeLayout('multiExportBeta', 'primitiveBeta@1'),
    ],
    {
      'primitiveAlpha@1': makePrimitive({
        id: 'primitiveAlpha',
        builderModule: 'generator/builders/primitives/composite-builder.js',
        builderExport: 'buildCompositeAlpha',
      }),
      'primitiveBeta@1': makePrimitive({
        id: 'primitiveBeta',
        builderModule: 'generator/builders/primitives/composite-builder.js',
        builderExport: 'buildCompositeBeta',
      }),
    },
  );
  const moduleSource = buildOnboardedModule(entries);

  assert.match(
    moduleSource,
    /import \{ buildCompositeAlpha \} from '\.\.\/builders\/primitives\/composite-builder\.js';/,
    'The generated module should import the first export from the shared module path.',
  );
  assert.match(
    moduleSource,
    /import \{ buildCompositeBeta \} from '\.\.\/builders\/primitives\/composite-builder\.js';/,
    'The generated module should preserve distinct exports from the same primitive module.',
  );
}

{
  const legacyEntries = buildRegistryEntries(
    [
      makeLayout('legacyOnboardedCard', 'legacyOnboardedCard@1'),
    ],
    {
      'legacyOnboardedCard@1': makePrimitive({
        id: 'legacyOnboardedCard',
        builderModule: 'generator/builders/onboarded/legacy-onboarded-card.js',
        builderExport: 'buildLegacyOnboardedCard',
      }),
    },
  );
  const moduleSource = buildOnboardedModule(legacyEntries);

  assert.equal(
    resolveRuntimeImportPath('generator/builders/onboarded/legacy-onboarded-card.js'),
    '../builders/onboarded/legacy-onboarded-card.js',
    'Legacy onboarded builders should resolve relative to generator/runtime without path rewriting.',
  );
  assert.match(
    moduleSource,
    /import \{ buildLegacyOnboardedCard \} from '\.\.\/builders\/onboarded\/legacy-onboarded-card\.js';/,
    'The generated module should keep legacy onboarded builder module paths intact.',
  );
}

{
  const aliasEntries = buildRegistryEntries(
    [
      makeLayout('aliasAlpha', 'aliasAlpha@1'),
      makeLayout('aliasBeta', 'aliasBeta@1'),
    ],
    {
      'aliasAlpha@1': makePrimitive({
        id: 'aliasAlpha',
        builderModule: 'generator/builders/primitives/shared-one.js',
        builderExport: 'buildShared',
      }),
      'aliasBeta@1': makePrimitive({
        id: 'aliasBeta',
        builderModule: 'generator/builders/primitives/shared-two.js',
        builderExport: 'buildShared',
      }),
    },
  );
  const moduleSource = buildOnboardedModule(aliasEntries);

  assert.match(
    moduleSource,
    /import \{ buildShared \} from '\.\.\/builders\/primitives\/shared-one\.js';/,
    'The first binding should use the original export name when it is unique.',
  );
  assert.match(
    moduleSource,
    /import \{ buildShared as buildShared__shared_two \} from '\.\.\/builders\/primitives\/shared-two\.js';/,
    'Colliding local binding names should be aliased safely.',
  );
  assert.match(
    moduleSource,
    /export const AUTHORED_REGISTRY_ENTRIES = Object\.freeze\(\{/,
    'The generated runtime module should expose authored registry entries explicitly.',
  );
  assertValidModuleSyntax(moduleSource);
}

console.log('Onboarded registry codegen tests passed.');
