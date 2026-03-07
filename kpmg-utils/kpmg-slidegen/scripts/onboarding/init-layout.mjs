import fs from 'node:fs';
import path from 'node:path';

import { loadTemplatePackage } from '../../generator/runtime/template-package.js';
import {
  buildCandidateBuilderSource,
  buildCandidateDeckSpecScaffold,
  buildCandidateLayoutScaffold,
  buildSourceRecord,
  captureReferenceSlide,
  ensureLayoutPaths,
  extractGeometrySeed,
  normalizeLayoutId,
  parseArgMap,
  writeJson,
  writeText,
} from './lib.mjs';

function usage() {
  throw new Error(
    'Usage: node scripts/onboarding/init-layout.mjs --source-pptx <file.pptx> --slide <n> --layout-id <camelCaseId> [--family <existingType>] [--extract-seed] [--force]',
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
    paths.sourcePath,
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
const candidateLayout = buildCandidateLayoutScaffold({
  templatePackage,
  family,
  layoutId,
});
const candidateDeckSpec = buildCandidateDeckSpecScaffold({
  family,
  layoutId,
});
const candidateBuilderSource = buildCandidateBuilderSource({
  family,
  layoutId,
});

captureReferenceSlide({
  pptxPath: sourcePptxPath,
  slideNumber,
  referencePngPath: paths.referencePngPath,
});

if (extractSeed) {
  extractGeometrySeed({
    pptxPath: sourcePptxPath,
    slideNumber,
    seedPath: paths.seedPath,
  });
}

writeJson(
  paths.sourcePath,
  buildSourceRecord({
    layoutId,
    sourcePptxPath,
    sourceSlideNumber: slideNumber,
    family,
    status: family ? 'draft' : 'awaiting_family',
    extractSeed,
    referencePngPath: path.relative(paths.outputRoot, paths.referencePngPath).split(path.sep).join('/'),
  }),
);
writeJson(paths.candidateLayoutPath, candidateLayout);
writeJson(paths.candidateDeckSpecPath, candidateDeckSpec);
writeText(paths.candidateBuilderPath, candidateBuilderSource);

console.log(`Initialized onboarding workspace: ${paths.layoutRoot}`);
console.log(`Reference PNG: ${paths.referencePngPath}`);
if (extractSeed) {
  console.log(`Geometry seed: ${paths.seedPath}`);
}
