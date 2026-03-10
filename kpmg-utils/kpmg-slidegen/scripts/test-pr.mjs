import { runNodeScripts } from './support.mjs';

const lanes = [
  'scripts/docs-verify.mjs',
  'scripts/validate-authoring-fragments.mjs',
  'scripts/test-authoring-schema-validation.mjs',
  'scripts/test-onboarding-classification.mjs',
  'scripts/test-changed-layouts-selection.mjs',
  'scripts/test-skill-bundle-determinism.mjs',
  'scripts/codegen/generate-runtime-aggregates.mjs',
  'scripts/test-codegen-onboarded-registry.mjs',
  'scripts/test-codegen-source-reproducibility.mjs',
  'scripts/test-contracts.mjs',
  'scripts/test-changed-layouts.mjs',
  'scripts/test-primitive-stress.mjs',
  'scripts/test-fixtures.mjs',
  'scripts/test-structure.mjs',
  'scripts/test-render.mjs',
  'scripts/test-dist.mjs',
];

runNodeScripts(lanes, [
  [],
  [],
  [],
  [],
  ['--check'],
]);

console.log('PR lane passed.');
