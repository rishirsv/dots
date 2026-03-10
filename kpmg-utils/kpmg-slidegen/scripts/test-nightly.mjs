import { runNodeScripts } from './support.mjs';

const lanes = [
  'scripts/validate-authoring-fragments.mjs',
  'scripts/test-authoring-schema-validation.mjs',
  'scripts/test-onboarding-classification.mjs',
  'scripts/test-changed-layouts-selection.mjs',
  'scripts/test-skill-bundle-determinism.mjs',
  'scripts/test-codegen-source-reproducibility.mjs',
  'scripts/test-contracts.mjs',
  'scripts/test-fixtures.mjs',
  'scripts/test-structure.mjs',
  'scripts/test-render.mjs',
  'scripts/test-visual.mjs',
  'scripts/test-dist.mjs',
];

runNodeScripts(lanes);

console.log('Nightly lane passed.');
