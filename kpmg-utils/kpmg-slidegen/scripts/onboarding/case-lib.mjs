import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import { loadTemplatePackage, cloneTemplatePackage } from '../../generator/runtime/template-package.js';
import {
  BUILTIN_TYPE_SET,
  primitiveVersionRef,
  readSourceLayouts,
  readSourcePrimitives,
} from '../codegen/lib.mjs';
import {
  REPO_ROOT,
  DEFAULT_PREVIEW_HEIGHT,
  DEFAULT_PREVIEW_WIDTH,
  buildCandidateBuilderSource,
  buildCandidatePostprocessOptions,
  buildStarterSlideFromFamily,
  captureReferenceSlide,
  compareCandidateImages,
  ensureDir,
  extractOnboardingEvidence,
  getBlockingChecks,
  loadDraftBuilder,
  normalizePng,
  readJson,
  toPascalCase,
  writeJson,
  writeText,
} from './lib.mjs';

export const ONBOARDING_CASE_ROOT =
  process.env.ONBOARDING_CASE_ROOT || path.join(REPO_ROOT, 'onboarding', 'cases');
export const ONBOARDING_OUTPUT_ROOT =
  process.env.ONBOARDING_OUTPUT_ROOT || path.join(REPO_ROOT, 'outputs', 'onboarding');

function primitivesByRef() {
  const primitives = readSourcePrimitives();
  return Object.fromEntries(primitives.map((primitive) => [primitiveVersionRef(primitive), primitive]));
}

function layoutsByType() {
  return Object.fromEntries(readSourceLayouts().map((layout) => [layout.type, layout]));
}

export function normalizeCaseId(raw) {
  const value = String(raw || '').trim();
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    throw new Error('Expected --case-id to be kebab-case and start with a lowercase letter.');
  }
  return value;
}

export function normalizeLayoutId(raw) {
  const value = String(raw || '').trim();
  if (!/^[a-z][a-zA-Z0-9]+$/.test(value)) {
    throw new Error('Expected --layout-id to be camelCase and start with a lowercase letter.');
  }
  return value;
}

export function getCasePaths(caseId) {
  const normalized = normalizeCaseId(caseId);
  const caseRoot = path.join(ONBOARDING_CASE_ROOT, normalized);
  const outputRoot = path.join(ONBOARDING_OUTPUT_ROOT, normalized);
  return {
    caseId: normalized,
    caseRoot,
    intakePath: path.join(caseRoot, 'intake.json'),
    extractRawPath: path.join(caseRoot, 'extract.raw.json'),
    extractNormalizedPath: path.join(caseRoot, 'extract.normalized.json'),
    fingerprintPath: path.join(caseRoot, 'fingerprint.json'),
    classifyPath: path.join(caseRoot, 'classify.json'),
    candidateLayoutPath: path.join(caseRoot, 'candidate.layout.json'),
    candidateDeckSpecPath: path.join(caseRoot, 'candidate.deckSpec.json'),
    candidatePrimitivePath: path.join(caseRoot, 'candidate.primitive.json'),
    candidateBuilderPath: path.join(caseRoot, 'candidate.builder.js'),
    reviewPath: path.join(caseRoot, 'review.md'),
    outputRoot,
    candidateDir: path.join(outputRoot, 'candidate'),
    candidateDeckPath: path.join(outputRoot, 'candidate', 'deck.pptx'),
    candidateQaPath: path.join(outputRoot, 'candidate', 'qa.json'),
    candidatePreviewDir: path.join(outputRoot, 'candidate', 'preview'),
    candidatePreviewPngPath: path.join(outputRoot, 'candidate', 'preview', 'slide-1.png'),
    candidateMontagePath: path.join(outputRoot, 'candidate', 'montage.png'),
    compareDir: path.join(outputRoot, 'compare'),
    referencePngPath: path.join(outputRoot, 'compare', 'reference.png'),
    candidatePngPath: path.join(outputRoot, 'compare', 'candidate.png'),
    diffPngPath: path.join(outputRoot, 'compare', 'diff.png'),
    diffJsonPath: path.join(outputRoot, 'compare', 'diff.json'),
    scorecardPath: path.join(outputRoot, 'compare', 'scorecard.json'),
  };
}

export function ensureCasePaths(caseId) {
  const paths = getCasePaths(caseId);
  [
    paths.caseRoot,
    paths.candidateDir,
    paths.candidatePreviewDir,
    paths.compareDir,
  ].forEach(ensureDir);
  return paths;
}

export function buildCaseRecord({
  caseId,
  layoutId,
  sourcePptxPath,
  sourceSlideNumber,
}) {
  return {
    schemaVersion: 1,
    caseId,
    templateName: 'kpmg-diligence',
    layoutId,
    source: {
      pptxPath: sourcePptxPath,
      slideNumber: Number(sourceSlideNumber),
    },
    primitiveRef: null,
    builderMode: null,
    status: 'extracted',
    artifacts: {
      intake: 'intake.json',
      extractRaw: 'extract.raw.json',
      extractNormalized: 'extract.normalized.json',
      fingerprint: 'fingerprint.json',
      classify: 'classify.json',
      candidateLayout: 'candidate.layout.json',
      candidateDeckSpec: 'candidate.deckSpec.json',
      candidatePrimitive: 'candidate.primitive.json',
      candidateBuilder: 'candidate.builder.js',
      review: 'review.md',
    },
    renderArtifacts: {
      referencePngPath: 'compare/reference.png',
      candidateQaPath: null,
      candidatePngPath: null,
      diffJsonPath: null,
      scorecardPath: null,
    },
    approval: {
      approved: false,
      approvedBy: null,
      approvedAt: null,
      notes: null,
    },
  };
}

export function loadCaseRecord(caseId) {
  const paths = getCasePaths(caseId);
  if (!fs.existsSync(paths.intakePath)) {
    throw new Error(`Missing onboarding case intake: ${paths.intakePath}`);
  }
  return readJson(paths.intakePath);
}

export function writeCaseRecord(caseId, record) {
  const paths = getCasePaths(caseId);
  writeJson(paths.intakePath, record);
}

export function resolvePrimitive(ref) {
  const primitive = primitivesByRef()[String(ref || '').trim()];
  if (!primitive) {
    throw new Error(`Unknown primitive reference: ${ref}`);
  }
  return primitive;
}

export function readClassification(caseId) {
  const paths = getCasePaths(caseId);
  if (!fs.existsSync(paths.classifyPath)) {
    throw new Error(`Missing classification file: ${paths.classifyPath}`);
  }
  return readJson(paths.classifyPath);
}

function baseSlideForPrimitive(primitiveId, layoutId) {
  try {
    return buildStarterSlideFromFamily(primitiveId, layoutId);
  } catch {
    return {
      type: layoutId,
      title: `Draft ${layoutId}`,
      body: ['Replace this placeholder with candidate content.'],
      bodyStyle: 'bullets',
    };
  }
}

export function buildCandidateLayoutFromPrimitive({
  layoutId,
  primitive,
}) {
  const layoutSource = layoutsByType()[primitive.id];
  if (layoutSource) {
    return {
      ...JSON.parse(JSON.stringify(layoutSource)),
      type: layoutId,
      primitive: primitiveVersionRef(primitive),
      description: `Draft layout ${layoutId} using ${primitive.id}`,
      templateLayout: `Draft ${layoutId}`,
    };
  }
  return {
    type: layoutId,
    primitive: primitiveVersionRef(primitive),
    description: `Draft layout ${layoutId} using ${primitive.id}`,
    templateLayout: `Draft ${layoutId}`,
    geometry: {},
    slots: {},
    densityTarget: {
      mode: 'balanced',
      minScore: 0.72,
    },
  };
}

export function buildDeckSpecFromPrimitive({
  layoutId,
  primitive,
}) {
  const starterSlide = baseSlideForPrimitive(primitive.id, layoutId);
  return {
    metadata: {
      title: `Draft ${layoutId}`,
      textAmount: 'lg',
      allowSparse: true,
    },
    slides: [starterSlide],
  };
}

export async function loadBuilderFromPrimitiveOrCase({
  caseId,
  layoutId,
  primitive,
}) {
  const paths = getCasePaths(caseId);
  if (fs.existsSync(paths.candidateBuilderPath)) {
    return loadDraftBuilder(paths.candidateBuilderPath, layoutId);
  }
  const moduleUrl = pathToFileURL(path.join(REPO_ROOT, primitive.builderModule)).href;
  const mod = await import(`${moduleUrl}?t=${Date.now()}`);
  const builder = mod[primitive.builderExport] || mod.default || null;
  if (typeof builder !== 'function') {
    throw new Error(`Primitive builder export not found: ${primitive.builderModule}#${primitive.builderExport}`);
  }
  return builder;
}

export function buildDraftRegistryEntryFromPrimitive({
  layoutId,
  primitive,
  builder,
  candidateLayout,
}) {
  const geometryKinds = { ...(primitive.geometryKinds || {}) };
  return {
    builderId: layoutId,
    builder,
    master: candidateLayout?.masterOverride || primitive.master,
    requiredGeometry: [...(primitive.requiredGeometry || [])],
    optionalGeometry: [...(primitive.optionalGeometry || [])],
    optionalDefaults: { ...(primitive.optionalDefaults || {}) },
    geometryKinds,
    primitiveMetadata: {
      id: primitive.id,
      version: primitive.version,
      geometryKinds,
    },
    paginationPolicyKey: primitive.paginationPolicyKey,
    validationHooks: [...(primitive.validationHooks || [])],
    excludeFromLogicalPaging: Boolean(primitive.excludeFromLogicalPaging),
    geometryContract: {
      requiredKeys: [...(primitive.requiredGeometry || [])],
      optionalKeys: [...(primitive.optionalGeometry || [])],
      optionalDefaults: { ...(primitive.optionalDefaults || {}) },
      geometryKinds,
    },
  };
}

export async function extractCase({
  caseId,
  layoutId,
  sourcePptxPath,
  slideNumber,
  force = false,
}) {
  const paths = ensureCasePaths(caseId);
  if (!force) {
    for (const filePath of [
      paths.intakePath,
      paths.extractRawPath,
      paths.extractNormalizedPath,
      paths.fingerprintPath,
      paths.referencePngPath,
    ]) {
      if (fs.existsSync(filePath)) {
        throw new Error(`Refusing to overwrite existing case file without --force: ${filePath}`);
      }
    }
  }

  captureReferenceSlide({
    pptxPath: sourcePptxPath,
    slideNumber,
    referencePngPath: paths.referencePngPath,
    width: DEFAULT_PREVIEW_WIDTH,
    height: DEFAULT_PREVIEW_HEIGHT,
  });

  extractOnboardingEvidence({
    pptxPath: sourcePptxPath,
    slideNumber,
    rawPath: paths.extractRawPath,
    normalizedPath: paths.extractNormalizedPath,
    fingerprintPath: paths.fingerprintPath,
    seedPath: null,
  });

  const record = buildCaseRecord({
    caseId: normalizeCaseId(caseId),
    layoutId: normalizeLayoutId(layoutId),
    sourcePptxPath,
    sourceSlideNumber: slideNumber,
  });
  writeCaseRecord(caseId, record);
  if (!fs.existsSync(paths.reviewPath)) {
    writeText(paths.reviewPath, '# Review\n\nPending classification.\n');
  }
  return { paths, record };
}

export function classifyCase({ caseId }) {
  const record = loadCaseRecord(caseId);
  const paths = getCasePaths(caseId);
  const fingerprint = readJson(paths.fingerprintPath);
  const primitives = readSourcePrimitives();
  const scores = primitives.map((primitive) => {
    let score = 0;
    if ((fingerprint.likelyPrimitiveCandidates || []).includes(primitive.id)) score += 5;
    if (fingerprint.connectorCount > 0 && primitive.geometryKinds?.framework === 'boxTree') score += 2;
    if (fingerprint.repeatedCardCount >= 3 && primitive.geometryKinds?.analysisBoxes === 'boxArray') score += 1;
    if (fingerprint.hasTitleBand && primitive.requiredGeometry?.includes('titleBox')) score += 1;
    return {
      primitiveRef: primitiveVersionRef(primitive),
      primitiveId: primitive.id,
      score,
      reasons: [
        ...(fingerprint.likelyPrimitiveCandidates || []).includes(primitive.id) ? ['fingerprint-likely-match'] : [],
        fingerprint.hasTitleBand && primitive.requiredGeometry?.includes('titleBox') ? ['title-band-match'] : [],
      ],
    };
  }).sort((left, right) => right.score - left.score || left.primitiveId.localeCompare(right.primitiveId));

  const classification = {
    schemaVersion: 1,
    caseId: record.caseId,
    recommendedPrimitiveRef: scores[0]?.primitiveRef || null,
    candidates: scores.slice(0, 5),
  };
  writeJson(paths.classifyPath, classification);
  writeCaseRecord(caseId, {
    ...record,
    primitiveRef: classification.recommendedPrimitiveRef,
    status: 'classified',
  });
  return classification;
}

export function scaffoldCase({
  caseId,
  primitiveRef = null,
  newPrimitiveId = null,
  builderFromFamily = null,
}) {
  const record = loadCaseRecord(caseId);
  const paths = getCasePaths(caseId);
  const selectedPrimitiveRef = primitiveRef || record.primitiveRef || readClassification(caseId).recommendedPrimitiveRef;

  let builderMode = 'existing-primitive';
  let primitive = resolvePrimitive(selectedPrimitiveRef);
  let candidatePrimitive = null;
  const basePrimitive = primitive;

  if (newPrimitiveId) {
    builderMode = 'new-primitive';
    candidatePrimitive = {
      ...JSON.parse(JSON.stringify(basePrimitive)),
      id: newPrimitiveId,
      version: 1,
      slotSchemaRef: newPrimitiveId,
      builderModule: `generator/builders/primitives/${newPrimitiveId}.js`,
      builderExport: `build${toPascalCase(newPrimitiveId)}`,
    };
    primitive = candidatePrimitive;
  }

  const candidateLayout = buildCandidateLayoutFromPrimitive({
    layoutId: record.layoutId,
    primitive,
  });
  const candidateDeckSpec = buildDeckSpecFromPrimitive({
    layoutId: record.layoutId,
    primitive,
  });
  writeJson(paths.candidateLayoutPath, candidateLayout);
  writeJson(paths.candidateDeckSpecPath, candidateDeckSpec);

  if (candidatePrimitive) {
    writeJson(paths.candidatePrimitivePath, candidatePrimitive);
    const family = builderFromFamily || primitive.id;
    writeText(
      paths.candidateBuilderPath,
      buildCandidateBuilderSource({
        family: builderFromFamily || basePrimitive.id,
        layoutId: newPrimitiveId,
      }),
    );
  } else {
    if (fs.existsSync(paths.candidatePrimitivePath)) fs.rmSync(paths.candidatePrimitivePath);
    if (fs.existsSync(paths.candidateBuilderPath)) fs.rmSync(paths.candidateBuilderPath);
  }

  writeCaseRecord(caseId, {
    ...record,
    primitiveRef: primitiveVersionRef(primitive),
    builderMode,
    status: 'scaffolded',
  });
  return { primitiveRef: primitiveVersionRef(primitive), builderMode };
}

export async function renderCase({
  caseId,
  withMontage = false,
}) {
  const { generateToFile } = await import('../../generator/index.js');
  const record = loadCaseRecord(caseId);
  if (!record.primitiveRef) {
    throw new Error('Case is missing a selected primitive. Run onboard:classify or onboard:scaffold first.');
  }
  const paths = ensureCasePaths(caseId);
  const primitive = fs.existsSync(paths.candidatePrimitivePath)
    ? readJson(paths.candidatePrimitivePath)
    : resolvePrimitive(record.primitiveRef);
  const candidateLayout = readJson(paths.candidateLayoutPath);
  const candidateDeckSpec = readJson(paths.candidateDeckSpecPath);
  const builder = await loadBuilderFromPrimitiveOrCase({
    caseId,
    layoutId: record.layoutId,
    primitive,
  });
  const templatePackage = loadTemplatePackage('kpmg-diligence');
  const draftTemplatePackage = cloneTemplatePackage(templatePackage, {
    layouts: {
      types: {
        [record.layoutId]: {
          ...JSON.parse(JSON.stringify(candidateLayout)),
          primitive: undefined,
          type: undefined,
        },
      },
    },
  });
  delete draftTemplatePackage.layouts.types[record.layoutId].primitive;
  delete draftTemplatePackage.layouts.types[record.layoutId].type;

  const registryEntry = buildDraftRegistryEntryFromPrimitive({
    layoutId: record.layoutId,
    primitive,
    builder,
    candidateLayout,
  });
  const result = await generateToFile(candidateDeckSpec, paths.candidateDeckPath, {
    templatePackage: draftTemplatePackage,
    slideRegistryOverrides: {
      [record.layoutId]: registryEntry,
    },
    qaPath: paths.candidateQaPath,
    runRoot: paths.candidateDir,
    allowSparse: Boolean(candidateDeckSpec?.metadata?.allowSparse),
    enforceOverlap: true,
    strict: true,
    postprocess: buildCandidatePostprocessOptions(paths, withMontage),
  });
  const qa = readJson(paths.candidateQaPath);
  const blockingChecks = getBlockingChecks(qa);
  writeCaseRecord(caseId, {
    ...record,
    status: 'rendered',
    renderArtifacts: {
      ...(record.renderArtifacts || {}),
      candidateQaPath: 'candidate/qa.json',
    },
  });
  if (blockingChecks.length > 0) {
    throw new Error(
      `Candidate render has blocking checks: ${blockingChecks.map((check) => `${check.id}:${check.status}`).join(', ')}`,
    );
  }
  return {
    ...result,
    qa,
    paths,
    record,
  };
}

export function compareCase({ caseId }) {
  const record = loadCaseRecord(caseId);
  const paths = getCasePaths(caseId);
  if (!fs.existsSync(paths.referencePngPath)) {
    throw new Error(`Missing reference PNG: ${paths.referencePngPath}`);
  }
  if (!fs.existsSync(paths.candidatePreviewPngPath)) {
    throw new Error(`Missing candidate preview PNG: ${paths.candidatePreviewPngPath}`);
  }
  normalizePng({
    inputPath: paths.candidatePreviewPngPath,
    outputPath: paths.candidatePngPath,
  });
  const compared = compareCandidateImages({
    referencePngPath: paths.referencePngPath,
    candidatePngPath: paths.candidatePngPath,
    diffPngPath: paths.diffPngPath,
    diffJsonPath: paths.diffJsonPath,
    scorecardPath: paths.scorecardPath,
  });
  writeCaseRecord(caseId, {
    ...record,
    status: 'compared',
    renderArtifacts: {
      ...(record.renderArtifacts || {}),
      candidatePngPath: 'compare/candidate.png',
      diffJsonPath: 'compare/diff.json',
      scorecardPath: 'compare/scorecard.json',
    },
  });
  return compared;
}

export function promoteCase({
  caseId,
  approvedBy,
  approvalNotes = null,
}) {
  const record = loadCaseRecord(caseId);
  const paths = getCasePaths(caseId);
  const qa = readJson(paths.candidateQaPath);
  const blockingChecks = getBlockingChecks(qa);
  if (blockingChecks.length > 0) {
    throw new Error(`Cannot promote because candidate QA has blocking checks: ${blockingChecks.map((check) => `${check.id}:${check.status}`).join(', ')}`);
  }
  const scorecard = readJson(paths.scorecardPath);
  if (!scorecard?.pass) {
    throw new Error('Cannot promote because compare scorecard did not pass.');
  }

  const candidateLayout = readJson(paths.candidateLayoutPath);
  const layoutFragment = JSON.parse(JSON.stringify(candidateLayout));
  delete layoutFragment.type;
  const templateSrcLayoutPath = path.join(REPO_ROOT, 'templates-src', 'kpmg-diligence', 'layouts', `${record.layoutId}.json`);
  writeJson(templateSrcLayoutPath, {
    ...layoutFragment,
    type: record.layoutId,
    primitive: record.primitiveRef,
  });

  if (record.builderMode === 'new-primitive') {
    if (!fs.existsSync(paths.candidatePrimitivePath) || !fs.existsSync(paths.candidateBuilderPath)) {
      throw new Error('New primitive promotion requires candidate.primitive.json and candidate.builder.js');
    }
    const primitive = readJson(paths.candidatePrimitivePath);
    const builderTargetPath = path.join(REPO_ROOT, primitive.builderModule);
    const builderSource = fs.readFileSync(paths.candidateBuilderPath, 'utf8')
      .replaceAll(`file://${REPO_ROOT.split(path.sep).join('/')}/generator/`, '../../')
      .replace(/\.\.\/\.\.\/\.\.\/generator\//g, '../../');
    writeJson(path.join(REPO_ROOT, 'templates-src', 'kpmg-diligence', 'primitives', `${primitive.id}.json`), primitive);
    writeText(builderTargetPath, builderSource);
  }

  const regen = spawnSync(process.execPath, [path.join(REPO_ROOT, 'scripts', 'codegen', 'generate-runtime-aggregates.mjs')], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  if (regen.status !== 0) {
    throw new Error('Failed to regenerate runtime aggregates during promotion.');
  }

  writeCaseRecord(caseId, {
    ...record,
    status: 'promoted',
    approval: {
      approved: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
      notes: approvalNotes,
    },
  });
}

export function changedRelevantFiles() {
  const result = spawnSync('git', ['diff', '--name-only', 'HEAD'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) return [];
  return String(result.stdout || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
