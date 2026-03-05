import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const TARGETS = [
  'generator/builders',
  'generator/helpers',
  'generator/runtime/paginate.js',
];

const FILE_FILTER = (filePath) => filePath.endsWith('.js');

const CHECKS = [
  {
    id: 'default_geometry_constant',
    regex: /\bconst\s+DEFAULT_GEOMETRY\s*=/g,
    message: 'Local DEFAULT_GEOMETRY constant found.',
  },
  {
    id: 'layout_defaults_geometry',
    regex: /\b[A-Z_]+_LAYOUT_DEFAULTS\.geometry\b/g,
    message: 'Fallback to *_LAYOUT_DEFAULTS.geometry found.',
  },
  {
    id: 'tokens_geometry_reference',
    regex: /\bTOKENS\.geometry\b/g,
    message: 'Fallback/reference to TOKENS.geometry found.',
  },
  {
    id: 'geometry_or_fallback',
    regex: /\bgeometry\s*\|\|/g,
    message: '`geometry || ...` fallback found.',
  },
  {
    id: 'record_fallback_path',
    regex: /\brecordFallback\s*\(/g,
    message: 'recordFallback() path found.',
  },
  {
    id: 'paginator_fallback_box',
    regex: /\bfallback(Box|Left|Right)\b[\s\S]{0,120}\{/g,
    message: 'Paginator fallback box geometry path found.',
  },
];

function listJsFiles(target) {
  const abs = path.join(REPO_ROOT, target);
  if (!fs.existsSync(abs)) return [];

  const stat = fs.statSync(abs);
  if (stat.isFile()) return FILE_FILTER(abs) ? [abs] : [];

  const out = [];
  const stack = [abs];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && FILE_FILTER(full)) {
        out.push(full);
      }
    }
  }
  return out;
}

function buildLineStarts(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === '\n') starts.push(i + 1);
  }
  return starts;
}

function lineForIndex(lineStarts, index) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (lineStarts[mid] <= index) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi + 1;
}

function rel(absPath) {
  return path.relative(REPO_ROOT, absPath);
}

function findViolations(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const lineStarts = buildLineStarts(source);
  const violations = [];

  for (const check of CHECKS) {
    check.regex.lastIndex = 0;
    let match = check.regex.exec(source);
    while (match) {
      violations.push({
        file: rel(filePath),
        line: lineForIndex(lineStarts, match.index),
        rule: check.id,
        message: check.message,
        snippet: String(match[0]).replace(/\s+/g, ' ').trim().slice(0, 100),
      });
      match = check.regex.exec(source);
    }
  }

  return violations;
}

const files = TARGETS.flatMap((target) => listJsFiles(target)).sort();
const violations = files.flatMap((filePath) => findViolations(filePath));

if (violations.length > 0) {
  console.error('Hardcoded layout/fallback geometry checks failed.');
  console.error(`Detected ${violations.length} violation(s) across ${files.length} file(s).`);
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} [${v.rule}] ${v.message} Match: ${v.snippet}`);
  }
  process.exit(1);
}

console.log('Hardcoded layout/fallback geometry checks passed.');
