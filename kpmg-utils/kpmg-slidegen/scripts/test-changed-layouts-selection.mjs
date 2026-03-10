import assert from 'node:assert/strict';

import {
  categorizeChangedFiles,
  describeSelection,
  resolveDiffRefs,
  selectChangedLayoutLanes,
} from './test-changed-layouts.mjs';

{
  const refs = resolveDiffRefs({
    args: {},
    env: {},
  });
  assert.equal(refs, null, 'Local no-arg use should not require explicit base/head refs.');
}

{
  const refs = resolveDiffRefs({
    args: {
      baseRef: 'origin/main',
      headRef: 'HEAD',
    },
    env: {},
  });
  assert.deepEqual(
    refs,
    {
      baseRef: 'origin/main',
      headRef: 'HEAD',
      source: 'cli',
    },
    'Explicit CLI base/head refs should drive CI-safe diff selection.',
  );
}

{
  const emptyCategories = categorizeChangedFiles([]);
  const lanes = selectChangedLayoutLanes(emptyCategories);
  assert.deepEqual(
    lanes.map((lane) => lane.script),
    [
      'scripts/codegen/generate-runtime-aggregates.mjs',
      'scripts/validate-authoring-fragments.mjs',
    ],
    'No changed layouts or primitives should keep the lane on the minimal verification surface.',
  );
}

{
  const primitiveCategories = categorizeChangedFiles([
    'templates-src/kpmg-diligence/primitives/businessOverview.json',
  ]);
  const lanes = selectChangedLayoutLanes(primitiveCategories);
  assert.deepEqual(
    lanes.map((lane) => lane.script),
    [
      'scripts/codegen/generate-runtime-aggregates.mjs',
      'scripts/validate-authoring-fragments.mjs',
      'scripts/test-contracts.mjs',
      'scripts/test-primitive-stress.mjs',
    ],
    'Changed primitive fragments should fan out to contracts and primitive stress checks.',
  );
}

{
  const runtimeFanout = categorizeChangedFiles([
    'generator/runtime/slide-registry.js',
  ]);
  const lanes = selectChangedLayoutLanes(runtimeFanout);
  assert.deepEqual(
    lanes.map((lane) => lane.script),
    [
      'scripts/codegen/generate-runtime-aggregates.mjs',
      'scripts/validate-authoring-fragments.mjs',
      'scripts/test-contracts.mjs',
      'scripts/test-primitive-stress.mjs',
      'scripts/test-fixtures.mjs',
    ],
    'Generator/runtime fanout should expand to the broader changed-surface test set.',
  );
}

{
  const summary = describeSelection(
    {
      strategy: 'local-working-tree',
      reason: 'Using local working tree changes because no refs were passed.',
      changed: categorizeChangedFiles([
        'templates-src/kpmg-diligence/layouts/businessOverview.json',
      ]),
    },
    selectChangedLayoutLanes(
      categorizeChangedFiles([
        'templates-src/kpmg-diligence/layouts/businessOverview.json',
      ]),
    ),
  );
  assert.match(summary, /strategy: local-working-tree/);
  assert.match(summary, /changed layout fragments \(1\): templates-src\/kpmg-diligence\/layouts\/businessOverview\.json/);
}

console.log('Changed layout detection selection tests passed.');
