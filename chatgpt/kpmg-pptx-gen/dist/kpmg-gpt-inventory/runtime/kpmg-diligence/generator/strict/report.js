import fs from 'node:fs';
import path from 'node:path';

function writeJson(outPath, data) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
}

function safeInt(n) {
  return Number.isFinite(n) ? Number(n) : null;
}

export function writeInspectionArtifacts({
  inspectDir,
  deckSpec,
  outPptxPath,
  strictSummary,
  overlapReport,
  boundsReport,
}) {
  fs.mkdirSync(inspectDir, { recursive: true });

  const strictSummaryPath = path.join(inspectDir, 'strict-summary.json');
  writeJson(strictSummaryPath, strictSummary || {});

  const overlapPath = overlapReport ? path.join(inspectDir, 'overlap-report.json') : null;
  const boundsPath = boundsReport ? path.join(inspectDir, 'bounds-report.json') : null;

  const severeOverlaps = safeInt(overlapReport?.summary?.severeCount) ?? safeInt(strictSummary?.overlaps?.severeCount);
  const warningOverlaps = safeInt(overlapReport?.summary?.warningCount) ?? safeInt(strictSummary?.overlaps?.warningCount);
  const outOfBounds = safeInt(boundsReport?.summary?.outOfBoundsCount) ?? safeInt(strictSummary?.bounds?.outOfBoundsCount);

  const title = deckSpec?.metadata?.title || deckSpec?.title || '';

  const md = [];
  md.push('# Deck inspection report');
  md.push('');
  if (title) md.push(`- Title: ${title}`);
  md.push(`- PPTX: \`${outPptxPath}\``);
  md.push(`- Inspect dir: \`${inspectDir}\``);
  md.push(`- Strict summary: \`${strictSummaryPath}\``);
  if (overlapPath) md.push(`- Overlap report: \`${overlapPath}\``);
  if (boundsPath) md.push(`- Bounds report: \`${boundsPath}\``);
  md.push('');

  md.push('## Summary');
  md.push(`- Validation: \`${strictSummary?.valid ? 'PASS' : 'FAIL'}\``);
  if (severeOverlaps !== null) md.push(`- Severe overlaps: \`${severeOverlaps}\``);
  if (warningOverlaps !== null) md.push(`- Warning overlaps: \`${warningOverlaps}\``);
  if (outOfBounds !== null) md.push(`- Out-of-bounds elements: \`${outOfBounds}\``);
  md.push(`- Warnings: \`${(strictSummary?.warnings || []).length}\``);
  md.push(`- Missing required fields: \`${(strictSummary?.missingSlots || []).length}\``);
  md.push(`- Layout fallbacks: \`${(strictSummary?.fallbacks || []).length}\``);
  md.push('');

  if (strictSummary?.validationErrors?.length) {
    md.push('## Validation errors');
    for (const e of strictSummary.validationErrors) md.push(`- ${e}`);
    md.push('');
  }

  if (strictSummary?.warnings?.length) {
    md.push('## Warnings');
    for (const w of strictSummary.warnings) md.push(`- ${w}`);
    md.push('');
  }

  if (strictSummary?.missingSlots?.length) {
    md.push('## Missing required fields');
    for (const m of strictSummary.missingSlots) md.push(`- ${JSON.stringify(m)}`);
    md.push('');
  }

  if (strictSummary?.fallbacks?.length) {
    md.push('## Layout fallbacks');
    for (const f of strictSummary.fallbacks) md.push(`- ${JSON.stringify(f)}`);
    md.push('');
  }

  fs.writeFileSync(path.join(inspectDir, 'inspection_report.md'), md.join('\n') + '\n');
}

