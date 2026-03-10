import fs from 'node:fs';
import path from 'node:path';

import { loadTemplatePackage } from '../../generator/runtime/template-package.js';
import {
  buildLegacyCandidateBuilderSource,
  buildLegacyCandidateDeckSpecScaffold,
  buildIntakeRecord,
  buildLegacyCandidateLayoutScaffold,
  buildSourceRecord,
  captureReferenceSlide,
  ensureLayoutPaths,
  extractOnboardingEvidence,
  normalizeLayoutId,
  parseArgMap,
  writeJson,
  writeText,
} from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/init-layout.mjs --source-pptx <file.pptx> --slide <n> --layout-id <camelCaseId> [--family <existingType>] [--extract-seed] [--force]\nLegacy helper: case-based onboarding should use extract/classify/scaffold instead.',
  );
}

const args = parseArgMap(process.argv.slice(2));
const sourcePptxPath = args.get('source-pptx');
const slideNumber = Number(args.get('slide'));
const layoutId = normalizeLayoutId(args.get('layout-id'));
const family = args.get('family') ? String(args.get('family')) : null;
const extractSeed = Boolean(args.get('extract-seed'));
const force = Boolean(args.get('force'));

if (!sourcePptxPath || !Number.isInteger(slideNumber) || slideNumber < 1 || !layoutId) {
  usage();
}
if (!fs.existsSync(sourcePptxPath)) {
  throw new Error(`Missing source PPTX: ${sourcePptxPath}`);
}

const paths = ensureLayoutPaths(layoutId);
if (!force) {
  for (const filePath of [
    paths.intakePath,
    paths.sourcePath,
    paths.extractRawPath,
    paths.extractNormalizedPath,
    paths.fingerprintPath,
    paths.candidateLayoutPath,
    paths.candidateBuilderPath,
    paths.candidateDeckSpecPath,
  ]) {
    if (fs.existsSync(filePath)) {
      throw new Error(`Refusing to overwrite existing onboarding file without --force: ${filePath}`);
    }
  }
}

const templatePackage = loadTemplatePackage('kpmg-diligence');
const candidateLayout = buildLegacyCandidateLayoutScaffold({
  templatePackage,
  family,
  layoutId,
});
const candidateDeckSpec = buildLegacyCandidateDeckSpecScaffold({
  family,
  layoutId,
});
const candidateBuilderSource = buildLegacyCandidateBuilderSource({
  family,
  layoutId,
});

captureReferenceSlide({
  pptxPath: sourcePptxPath,
  slideNumber,
  referencePngPath: paths.referencePngPath,
});

extractOnboardingEvidence({
  pptxPath: sourcePptxPath,
  slideNumber,
  rawPath: paths.extractRawPath,
  normalizedPath: paths.extractNormalizedPath,
  fingerprintPath: paths.fingerprintPath,
  seedPath: paths.seedPath,
});

writeJson(
  paths.intakePath,
  buildIntakeRecord({
    layoutId,
    sourcePptxPath,
    sourceSlideNumber: slideNumber,
    family,
  }),
);
writeJson(
  paths.sourcePath,
  buildSourceRecord({
    layoutId,
    sourcePptxPath,
    sourceSlideNumber: slideNumber,
    family,
    status: family ? 'draft' : 'awaiting_family',
    extractSeed,
    intakePath: path.relative(paths.layoutRoot, paths.intakePath).split(path.sep).join('/'),
    referencePngPath: path.relative(paths.outputRoot, paths.referencePngPath).split(path.sep).join('/'),
    extractRawPath: path.relative(paths.layoutRoot, paths.extractRawPath).split(path.sep).join('/'),
    extractNormalizedPath: path
      .relative(paths.layoutRoot, paths.extractNormalizedPath)
      .split(path.sep)
      .join('/'),
    fingerprintPath: path.relative(paths.layoutRoot, paths.fingerprintPath).split(path.sep).join('/'),
  }),
);
writeJson(paths.candidateLayoutPath, candidateLayout);
writeJson(paths.candidateDeckSpecPath, candidateDeckSpec);
writeText(paths.candidateBuilderPath, candidateBuilderSource);

console.log(`Initialized onboarding workspace: ${paths.layoutRoot}`);
console.log(`Reference PNG: ${paths.referencePngPath}`);
console.log(`Intake record: ${paths.intakePath}`);
console.log(`Raw extract: ${paths.extractRawPath}`);
console.log(`Normalized extract: ${paths.extractNormalizedPath}`);
console.log(`Fingerprint: ${paths.fingerprintPath}`);
console.log(`Geometry seed compatibility file: ${paths.seedPath}`);
