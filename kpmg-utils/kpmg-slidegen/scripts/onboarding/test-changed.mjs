import { changedRelevantFiles } from './case-lib.mjs';
import { runNodeScripts } from '../support.mjs';

const changed = changedRelevantFiles();
const lanes = ['scripts/codegen/generate-runtime-aggregates.mjs'];

const touchesOnboarding = changed.some((file) => file.startsWith('scripts/onboarding/') || file.startsWith('onboarding/cases/'));
const touchesAuthoring = changed.some((file) => file.startsWith('templates-src/') || file.startsWith('scripts/codegen/'));

if (touchesAuthoring) {
  lanes.push('scripts/test-contracts.mjs');
}
if (touchesOnboarding) {
  lanes.push('scripts/test-onboarding.mjs');
}
if (!touchesAuthoring && !touchesOnboarding) {
  lanes.push('scripts/test-contracts.mjs');
}

runNodeScripts(lanes, [
  ['--check'],
]);

console.log('Changed onboarding lane passed.');
