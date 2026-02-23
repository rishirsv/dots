import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { checkDeckOverlaps } from './strict/overlap.js';
import { validateDeckSpecWithTemplate, renderDeck } from './runtime/render-deck.js';
import { loadTemplatePackage } from './runtime/template-package.js';
import {
  recordMissingSlot,
  recordOverlapSummary,
  recordWarning,
  startDiagnostics,
  stopDiagnostics,
} from './runtime/diagnostics.js';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isMissingSlotValue(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

function collectMissingSlots(deckSpec, templatePackage) {
  const missing = [];
  const slides = Array.isArray(deckSpec?.slides) ? deckSpec.slides : [];
  slides.forEach((slideSpec, idx) => {
    const layout = templatePackage?.layouts?.types?.[slideSpec.type];
    const slots = layout?.slots || {};
    for (const [slotName, slotDef] of Object.entries(slots)) {
      if (!slotDef?.required) continue;
      if (isMissingSlotValue(slideSpec[slotName])) {
        missing.push({ slideIndex: idx, slideType: slideSpec.type, slot: slotName });
      }
    }
  });
  return missing;
}

function getQaPath(outPath, overridePath) {
  if (overridePath) return overridePath;
  if (/\.pptx$/i.test(outPath)) return outPath.replace(/\.pptx$/i, '.qa.json');
  return `${outPath}.qa.json`;
}

function writeQaReport(qaPath, qaReport) {
  fs.mkdirSync(path.dirname(qaPath), { recursive: true });
  fs.writeFileSync(qaPath, JSON.stringify(qaReport, null, 2));
}

function dedupeList(items = [], keyFn = (v) => JSON.stringify(v)) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function buildOverflowRepairSuggestions(overflowEvents = []) {
  return overflowEvents
    .filter((event) => Number(event?.splitInto || 0) > 1)
    .map((event) => ({
      slideType: event.slideType,
      slot: null,
      hook: 'splitSlide',
      severity: 'info',
      issueCode: 'auto_split',
      suggestedRemedy: `Slide was auto-split into ${event.splitInto} pages; keep as split or tighten bullet text.`,
    }));
}

function buildOverflowRisks(overflowEvents = []) {
  return overflowEvents
    .filter((event) => Number(event?.splitInto || 0) > 1)
    .map((event) => ({
      slideIndex: event?.slideIndex,
      slideType: event?.slideType,
      mode: event?.mode || 'unknown',
      splitInto: Number(event?.splitInto || 0),
      severity: Number(event?.splitInto || 0) >= 3 ? 'warning' : 'info',
      reason: 'auto_split',
      suggestedRemedy: `Slide was auto-split into ${event?.splitInto} pages; keep split or tighten content.`,
    }));
}

function buildDensitySummary(findings = []) {
  const summary = { ok: 0, thin: 0, sparse: 0 };
  for (const finding of findings) {
    if (finding?.status === 'OK') summary.ok += 1;
    else if (finding?.status === 'thin but acceptable') summary.thin += 1;
    else if (finding?.status === 'too sparse, should be repaired or flagged') summary.sparse += 1;
  }
  return summary;
}

function buildOverlapFindings(overlapReport) {
  if (!overlapReport || !Array.isArray(overlapReport.slides)) return [];
  const findings = [];
  overlapReport.slides.forEach((slideReport, idx) => {
    const overlaps = Array.isArray(slideReport?.overlaps) ? slideReport.overlaps : [];
    if (!overlaps.length) return;
    const severe = overlaps.filter((item) => item?.severity === 'severe');
    const warning = overlaps.filter((item) => item?.severity !== 'severe');
    findings.push({
      slideNumber: idx + 1,
      severeCount: severe.length,
      warningCount: warning.length,
      examples: overlaps.slice(0, 3).map((item) => ({
        severity: item?.severity || 'warning',
        elementPair: `${item?.a?.type || 'unknown'} vs ${item?.b?.type || 'unknown'}`,
        suggestion: item?.suggestion || '',
      })),
    });
  });
  return findings;
}

function buildQaSummary(qaReport, { strictRequested = false } = {}) {
  const counts = {
    errors: Array.isArray(qaReport?.errors) ? qaReport.errors.length : 0,
    warnings: Array.isArray(qaReport?.warnings) ? qaReport.warnings.length : 0,
    missingSlots: Array.isArray(qaReport?.missingSlots) ? qaReport.missingSlots.length : 0,
    sparseSlides: Array.isArray(qaReport?.sparseSlides) ? qaReport.sparseSlides.length : 0,
    thinSlides: Array.isArray(qaReport?.thinSlides) ? qaReport.thinSlides.length : 0,
    slotIssues: Array.isArray(qaReport?.slotIssues) ? qaReport.slotIssues.length : 0,
    overflowEvents: Array.isArray(qaReport?.overflowEvents) ? qaReport.overflowEvents.length : 0,
    overlapSevere: Number(qaReport?.overlapSummary?.severeCount || 0),
    overlapWarnings: Number(qaReport?.overlapSummary?.warningCount || 0),
    repairSuggestions: Array.isArray(qaReport?.repairSuggestions)
      ? qaReport.repairSuggestions.length
      : 0,
  };
  const strictOverflowStatus = Number(qaReport?.strictOverflow?.status ?? 0);
  const strictFailed = strictRequested && (counts.overlapSevere > 0 || strictOverflowStatus !== 0);
  const blockingIssues = counts.errors + counts.missingSlots + counts.overlapSevere;
  return {
    status: qaReport?.valid && blockingIssues === 0 ? 'pass' : 'fail',
    inputSlides: Number(qaReport?.inputSlideCount || 0),
    renderedSlides: Number(qaReport?.outputSlideCount || 0),
    blockingIssues,
    advisoryIssues:
      counts.warnings +
      counts.sparseSlides +
      counts.thinSlides +
      counts.slotIssues +
      counts.overflowEvents,
    counts,
    strict: {
      requested: strictRequested,
      failed: strictFailed,
      overflowStatus: strictRequested ? strictOverflowStatus : null,
      overflowSkipped: Boolean(qaReport?.strictOverflow?.skipped),
    },
  };
}

function runStrictOverflow(pptxPath, outDir) {
  const scriptPath = path.resolve('qa', 'strict_overflow.py');
  const result = spawnSync('python3', [scriptPath, pptxPath, '--out', outDir], { encoding: 'utf8' });
  const status = result.status ?? 1;
  if (status === 0) return { status: 0 };

  const combined = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (/No module named ['"]numpy['"]/.test(combined)) {
    const msg = 'Strict overflow check skipped: optional dependency `numpy` is not installed.';
    console.warn(msg);
    recordWarning(msg);
    return { status: 0, skipped: true, reason: 'missing_numpy' };
  }

  // Show error details for unexpected failures.
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return { status };
}

export async function generateToFile(deckSpec, outPath, options = {}) {
  const templatePackage =
    options.templatePackage || loadTemplatePackage(options.template || 'kpmg-diligence');
  const qaPath = getQaPath(outPath, options.qaPath);
  startDiagnostics();
  const v = validateDeckSpecWithTemplate(deckSpec, templatePackage, {
    allowSparse: options.allowSparse,
  });

  if (v.warnings?.length) {
    for (const w of v.warnings) {
      console.warn(w);
      recordWarning(w);
    }
  }
  for (const m of v?.qa?.missingSlots || collectMissingSlots(deckSpec, templatePackage)) {
    recordMissingSlot(m.slideIndex, m.slideType, m.slot);
  }

  if (!v.valid) {
    const diag = stopDiagnostics() || {};
    const baseRepair = v?.qa?.repairSuggestions || [];
    const qaReport = {
      generatedAt: new Date().toISOString(),
      template: templatePackage.templateName,
      valid: false,
      errors: v.errors || [],
      warnings: dedupeList(v.warnings || [], (item) => String(item)),
      densityFindings: v?.qa?.densityFindings || [],
      densitySummary: buildDensitySummary(v?.qa?.densityFindings || []),
      missingSlots: v?.qa?.missingSlots || [],
      thinSlides: v?.qa?.thinSlides || [],
      sparseSlides: v?.qa?.sparseSlides || [],
      slotIssues: v?.qa?.slotIssues || [],
      slotMetrics: v?.qa?.slotMetrics || [],
      repairSuggestions: dedupeList(baseRepair, (item) =>
        `${item?.slideIndex ?? ''}|${item?.slideType ?? ''}|${item?.slot ?? ''}|${item?.hook ?? ''}|${item?.suggestedRemedy ?? ''}`,
      ),
      pagination: [],
      overflowRisks: [],
      masterApplied: [],
      paginationDecisions: [],
      overflowEvents: [],
      fallbacks: diag?.fallbacks || [],
      overlapSummary: null,
      strictOverflow: null,
      inputSlideCount: Array.isArray(deckSpec?.slides) ? deckSpec.slides.length : 0,
      outputSlideCount: 0,
      outputPptx: outPath,
    };
    qaReport.summary = buildQaSummary(qaReport, { strictRequested: Boolean(options.strict) });
    writeQaReport(qaPath, qaReport);
    throw new Error(v.errors.join('\n'));
  }

  const { pptx, qa: renderQa } = renderDeck(deckSpec, templatePackage, {
    allowSparse: options.allowSparse,
  });

  let overlapReport = null;
  if (options.enforceOverlap !== false) {
    overlapReport = checkDeckOverlaps(pptx);
    recordOverlapSummary(overlapReport.summary);
  }

  // Ensure output directory exists before writing the PPTX.
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await pptx.writeFile({ fileName: outPath, compression: true });

  let overflowStatus = { status: 0 };
  if (options.strict && options.strictDir) {
    const overflowDir = path.join(options.strictDir, 'overflow');
    overflowStatus = runStrictOverflow(outPath, overflowDir);
  }

  const report = stopDiagnostics() || {};
  const densityFindings = renderQa?.densityFindings || v?.qa?.densityFindings || [];
  const overflowRepairSuggestions = buildOverflowRepairSuggestions(renderQa?.overflowEvents || []);
  const overflowRisks = renderQa?.overflowRisks || buildOverflowRisks(renderQa?.overflowEvents || []);
  const baseRepairSuggestions = renderQa?.repairSuggestions || v?.qa?.repairSuggestions || [];
  const pagination = renderQa?.pagination || renderQa?.paginationDecisions || [];
  const qaReport = {
    generatedAt: new Date().toISOString(),
    template: templatePackage.templateName,
    valid: true,
    errors: [],
    warnings: dedupeList([...(v.warnings || []), ...(report?.warnings || [])], (item) => String(item)),
    densityFindings,
    densitySummary: buildDensitySummary(densityFindings),
    missingSlots: v?.qa?.missingSlots || [],
    thinSlides: v?.qa?.thinSlides || [],
    sparseSlides: v?.qa?.sparseSlides || [],
    slotIssues: v?.qa?.slotIssues || [],
    slotMetrics: renderQa?.slotMetrics || v?.qa?.slotMetrics || [],
    repairSuggestions: dedupeList(
      [...baseRepairSuggestions, ...overflowRepairSuggestions],
      (item) =>
        `${item?.slideIndex ?? ''}|${item?.slideType ?? ''}|${item?.slot ?? ''}|${item?.hook ?? ''}|${item?.suggestedRemedy ?? ''}`,
    ),
    pagination,
    overflowRisks,
    masterApplied: renderQa?.masterApplied || [],
    paginationDecisions: renderQa?.paginationDecisions || [],
    overflowEvents: renderQa?.overflowEvents || [],
    fallbacks: report?.fallbacks || [],
    overlapSummary: overlapReport?.summary || null,
    overlapFindings: buildOverlapFindings(overlapReport),
    strictOverflow: overflowStatus,
    inputSlideCount: Array.isArray(deckSpec?.slides) ? deckSpec.slides.length : 0,
    outputSlideCount: Array.isArray(pptx?._slides) ? pptx._slides.length : 0,
    outputPptx: outPath,
  };
  qaReport.summary = buildQaSummary(qaReport, { strictRequested: Boolean(options.strict) });
  writeQaReport(qaPath, qaReport);

  const strictFailed = qaReport.summary.strict.failed;
  return { strictFailed, strictSummary: qaReport, qaPath };
}

export async function main(argv = process.argv.slice(2)) {
  const args = new Map();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i++;
    } else {
      args.set(key, true);
    }
  }

  const inPath = args.get('in');
  const outPath = args.get('out');
  const qaOutPath = args.get('qa-out');
  const templateName = args.get('template') || 'kpmg-diligence';
  const allowSparse = Boolean(args.get('allow-sparse'));
  if (!inPath || !outPath) {
    console.error(
      'Usage: node generator/index.js --in <deck.json> --out <out.pptx> [--qa-out <out.qa.json>] [--allow-sparse] [--strict] [--skip-overlap] [--template <name>]',
    );
    process.exit(2);
  }

  const deckSpec = readJson(inPath);
  const templatePackage = loadTemplatePackage(templateName);
  const strict = Boolean(args.get('strict'));
  const skipOverlap = Boolean(args.get('skip-overlap'));
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const strictDir = strict ? path.join('outputs', 'strict', runId) : null;
  const result = await generateToFile(deckSpec, outPath, {
    strict,
    enforceOverlap: !skipOverlap,
    strictDir,
    template: templateName,
    templatePackage,
    qaPath: qaOutPath,
    allowSparse,
  });
  if (strict && result.strictFailed) {
    process.exit(1);
  }
  console.log(`Generated: ${outPath}`);
  console.log(`QA report: ${result.qaPath || getQaPath(outPath, qaOutPath)}`);
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
