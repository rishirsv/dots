import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import template from '../templates/kpmg-diligence/template.js';
import { validateDeckSpec } from './validate.js';
import { checkDeckOverlaps, writeOverlapReport } from './strict/overlap.js';
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
  const v = validateDeckSpec(deckSpec);
  if (!v.valid) {
    throw new Error(v.errors.join('\n'));
  }
  const useDiagnostics = Boolean(options.strict);
  if (useDiagnostics) {
    startDiagnostics();
    const missing = collectMissingSlots(deckSpec);
    for (const m of missing) {
      recordMissingSlot(m.slideIndex, m.slideType, m.slot);
    }
  }

  if (v.warnings?.length) {
    for (const w of v.warnings) {
      console.warn(w);
      recordWarning(w);
    }
  }

  const pptx = template.generateDeck(deckSpec);

  let overlapReport = null;
  if (options.strict && options.strictDir) {
    overlapReport = checkDeckOverlaps(pptx);
    recordOverlapSummary(overlapReport.summary);
    writeOverlapReport(overlapReport, path.join(options.strictDir, 'overlap-report.json'));
  }

  // Ensure output directory exists before writing the PPTX.
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await pptx.writeFile({ fileName: outPath, compression: true });

  let overflowStatus = { status: 0 };
  if (options.strict && options.strictDir) {
    const overflowDir = path.join(options.strictDir, 'overflow');
    overflowStatus = runStrictOverflow(outPath, overflowDir);
  }

  let strictSummary = null;
  if (useDiagnostics) {
    const report = stopDiagnostics();
    strictSummary = {
      overlaps: overlapReport?.summary || null,
      overflow: overflowStatus,
      warnings: report?.warnings || [],
      missingSlots: report?.missingSlots || [],
      fallbacks: report?.fallbacks || [],
    };
    if (options.strictDir) {
      fs.mkdirSync(options.strictDir, { recursive: true });
      fs.writeFileSync(
        path.join(options.strictDir, 'strict-summary.json'),
        JSON.stringify(strictSummary, null, 2),
      );
    }
  }

  const strictFailed =
    options.strict && ((overlapReport?.summary?.severeCount || 0) > 0 || overflowStatus.status !== 0);
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
    console.error('Usage: node generator/index.js --in <deck.json> --out <out.pptx> [--strict]');
    process.exit(2);
  }

  const deckSpec = readJson(inPath);
  const strict = Boolean(args.get('strict'));
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const strictDir = strict ? path.join('outputs', 'strict', runId) : null;
  const result = await generateToFile(deckSpec, outPath, { strict, strictDir });
  if (strict && result.strictFailed) {
    process.exit(1);
  }
  console.log(`Generated: ${outPath}`);
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
