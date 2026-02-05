import fs from 'node:fs';
import path from 'node:path';

import template from '../template.js';
import { validateDeckSpec } from './validate.js';
import { checkDeckOverlaps, writeOverlapReport } from './strict/overlap.js';
import { checkDeckBounds, writeBoundsReport } from './strict/bounds.js';
import { writeInspectionArtifacts } from './strict/report.js';
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

function collectMissingSlots(deckSpec) {
  const missing = [];
  const slides = Array.isArray(deckSpec?.slides) ? deckSpec.slides : [];
  slides.forEach((slideSpec, idx) => {
    const layout = template.LAYOUTS?.[slideSpec.type];
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

function inferSlideDims() {
  const dims = template?.TOKENS?.dimensions;
  const w = typeof dims?.w === 'number' ? dims.w : 13.333;
  const h = typeof dims?.h === 'number' ? dims.h : 7.5;
  return { w, h };
}

export async function generateToFile(deckSpec, outPath, options = {}) {
  const strict = options.strict !== undefined ? Boolean(options.strict) : true;
  const inspectDir = path.join(path.dirname(outPath), 'inspect');
  const dims = inferSlideDims();

  const v = validateDeckSpec(deckSpec);
  const useDiagnostics = strict;
  if (useDiagnostics) {
    startDiagnostics();
    const missing = collectMissingSlots(deckSpec);
    for (const m of missing) {
      recordMissingSlot(m.slideIndex, m.slideType, m.slot);
    }
  }

  if (!v.valid) {
    if (strict) {
      const report = useDiagnostics ? stopDiagnostics() : null;
      const strictSummary = {
        valid: false,
        validationErrors: v.errors,
        overlaps: null,
        bounds: null,
        warnings: report?.warnings || [],
        missingSlots: report?.missingSlots || [],
        fallbacks: report?.fallbacks || [],
      };
      writeInspectionArtifacts({
        inspectDir,
        deckSpec,
        outPptxPath: outPath,
        strictSummary,
        overlapReport: null,
        boundsReport: null,
      });
    } else if (useDiagnostics) {
      stopDiagnostics();
    }
    throw new Error(v.errors.join('\n'));
  }

  if (v.warnings?.length) {
    for (const w of v.warnings) {
      console.warn(w);
      recordWarning(w);
    }
  }

  const pptx = template.generateDeck(deckSpec);

  let overlapReport = null;
  if (strict) {
    overlapReport = checkDeckOverlaps(pptx);
    recordOverlapSummary(overlapReport.summary);
  }

  let boundsReport = null;
  if (strict) {
    boundsReport = checkDeckBounds(pptx, dims);
  }

  // Ensure output directory exists before writing the PPTX.
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await pptx.writeFile({ fileName: outPath, compression: true });

  let strictSummary = null;
  if (useDiagnostics) {
    const report = stopDiagnostics();
    strictSummary = {
      valid: true,
      validationErrors: [],
      overlaps: overlapReport?.summary || null,
      bounds: boundsReport?.summary || null,
      warnings: report?.warnings || [],
      missingSlots: report?.missingSlots || [],
      fallbacks: report?.fallbacks || [],
    };
  }

  if (strict) {
    fs.mkdirSync(inspectDir, { recursive: true });
    if (overlapReport) writeOverlapReport(overlapReport, path.join(inspectDir, 'overlap-report.json'));
    if (boundsReport) writeBoundsReport(boundsReport, path.join(inspectDir, 'bounds-report.json'));
    writeInspectionArtifacts({
      inspectDir,
      deckSpec,
      outPptxPath: outPath,
      strictSummary,
      overlapReport,
      boundsReport,
    });
  }

  const strictFailed =
    strict &&
    ((overlapReport?.summary?.severeCount || 0) > 0 ||
      (boundsReport?.summary?.outOfBoundsCount || 0) > 0 ||
      !(strictSummary?.valid ?? true));
  return { strictFailed, strictSummary };
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
  if (!inPath || !outPath) {
    console.error('Usage: node generator/index.js --in <deck.json> --out <out.pptx> [--no-strict]');
    process.exit(2);
  }

  const deckSpec = readJson(inPath);
  const strict = !Boolean(args.get('no-strict'));
  const result = await generateToFile(deckSpec, outPath, { strict });
  if (strict && result.strictFailed) {
    process.exit(1);
  }
  console.log(`Generated: ${outPath}`);
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
