/**
 * generator/helpers/bullets.js — Native PptxGenJS bullet API
 *
 * Returns TextProps[] for bullet lists with per-run styling.
 */

import { resolveTheme, toFiniteNumber } from './theme.js';

const DASH_BULLET_DEPTH = 2;
const MAX_BULLET_DEPTH = 3;

function safeText(value) {
  return String(value ?? '');
}

function toInlineStyle(item = {}) {
  return {
    ...(item.bold !== undefined ? { bold: item.bold } : {}),
    ...(item.italic !== undefined ? { italic: item.italic } : {}),
    ...(item.color !== undefined ? { color: item.color } : {}),
  };
}

function parseBoldLabel(text) {
  const t = safeText(text).trim();
  const m = t.match(/^([^:]{1,60}):\s+(.+)$/);
  if (!m) return null;
  const label = m[1].trim();
  const rest = m[2].trim();
  if (!label || !rest) return null;
  // Keep this conservative so we do not bold long sentences.
  if (label.length > 40) return null;
  return { label, rest };
}

export function isHeaderLine(text) {
  const t = safeText(text).trim();
  if (!t) return false;
  if (t.endsWith(':')) return true;
  const dashSplit = t.split(/[—–]/);
  if (dashSplit.length !== 2) return false;
  const left = dashSplit[0].trim();
  const right = dashSplit[1].trim();
  if (!left || !right) return false;
  if (t.length > 70) return false;
  if (/[.:;]/.test(t)) return false;
  return true;
}

function clampDepth(depth = 0) {
  const n = Number.isFinite(depth) ? depth : 0;
  return Math.max(0, Math.min(MAX_BULLET_DEPTH, Math.floor(n)));
}

function resolveBulletTokens(resolvedTheme) {
  const configured = resolvedTheme?.components?.bullets || {};
  return {
    indentPt: toFiniteNumber(configured.indentPt, 18),
    paraSpaceBeforePt: toFiniteNumber(configured.paraSpaceBeforePt, 0),
    paraSpaceAfterPt: toFiniteNumber(configured.paraSpaceAfterPt, 6),
    lineSpacingPt: toFiniteNumber(configured.lineSpacingPt, 12),
    prdHeaderGapBeforePt: toFiniteNumber(configured.prdHeaderGapBeforePt, 14),
  };
}

function buildBulletOptions(depth, bulletTokens) {
  const bullet = { indent: bulletTokens.indentPt };
  if (depth === DASH_BULLET_DEPTH) {
    // Hyphen-minus for deeper nesting level to mirror KPMG reference styling.
    bullet.characterCode = '002D';
  }
  return bullet;
}

function bulletParaRuns(text, { depth = 0, baseStyle = {}, bulletTokens } = {}) {
  const parsed = parseBoldLabel(text);
  const indentLevel = clampDepth(depth);
  const paraOpts = {
    bullet: buildBulletOptions(indentLevel, bulletTokens),
    ...(indentLevel ? { indentLevel } : {}),
    paraSpaceBefore: bulletTokens.paraSpaceBeforePt,
    paraSpaceAfter: bulletTokens.paraSpaceAfterPt,
    lineSpacing: bulletTokens.lineSpacingPt,
    ...baseStyle,
  };

  if (parsed) {
    return [
      { text: `${parsed.label}:`, options: { ...paraOpts, bold: true } },
      { text: ` ${parsed.rest}`, options: { ...baseStyle, breakLine: true } },
    ];
  }

  return [{ text: safeText(text), options: { ...paraOpts, breakLine: true } }];
}

function headerRuns(text, { gapBefore = false, color, bulletTokens } = {}) {
  const clean = safeText(text).trim();
  if (!clean) return [];
  return [
    {
      text: clean,
      options: {
        bold: true,
        color,
        ...(gapBefore ? { paraSpaceBefore: bulletTokens.prdHeaderGapBeforePt } : { paraSpaceBefore: bulletTokens.paraSpaceBeforePt }),
        paraSpaceAfter: bulletTokens.paraSpaceAfterPt,
        breakLine: true,
      },
    },
  ];
}

function isTextObject(item) {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item) && item.text !== undefined);
}

export function toBulletRuns(lines, { theme = null, headingColor = null } = {}) {
  if (!lines) return '';
  if (typeof lines === 'string') return lines;
  if (!Array.isArray(lines)) return String(lines ?? '');
  const resolvedTheme = resolveTheme(theme);
  const bulletTokens = resolveBulletTokens(resolvedTheme);
  const resolvedHeadingColor =
    typeof headingColor === 'string' && headingColor.trim()
      ? headingColor.trim()
      : resolvedTheme.colors.kpmgBlue;

  const runs = [];
  let prdHeaderCount = 0;

  function emit(item, { depth = 0, topLevel = false } = {}) {
    if (Array.isArray(item)) return;

    if (isTextObject(item)) {
      if (item.header || item.subheader) {
        runs.push(...headerRuns(item.text, { color: resolvedHeadingColor, bulletTokens }));
        return;
      }

      runs.push(...bulletParaRuns(item.text, { depth, baseStyle: toInlineStyle(item), bulletTokens }));
      if (Array.isArray(item.children)) {
        item.children.forEach((child) => emit(child, { depth: depth + 1, topLevel: false }));
      }
      return;
    }

    if (topLevel && isHeaderLine(item)) {
      const clean = safeText(item).trim();
      const isPrdHeader = ['Problem:', 'How we solve it:', 'Outcome / ROI:'].includes(clean);
      const gapBefore = isPrdHeader && prdHeaderCount > 0;
      if (isPrdHeader) prdHeaderCount += 1;
      runs.push(...headerRuns(clean, { gapBefore, color: resolvedHeadingColor, bulletTokens }));
      return;
    }

    runs.push(...bulletParaRuns(item, { depth, bulletTokens }));
  }

  lines.forEach((item) => emit(item, { depth: 0, topLevel: true }));
  return runs;
}

export function toParagraphRuns(lines, { theme = null, headingColor = null } = {}) {
  if (!lines) return '';
  if (typeof lines === 'string') return lines;
  if (!Array.isArray(lines)) return String(lines ?? '');
  const resolvedTheme = resolveTheme(theme);
  const bulletTokens = resolveBulletTokens(resolvedTheme);
  const resolvedHeadingColor =
    typeof headingColor === 'string' && headingColor.trim()
      ? headingColor.trim()
      : resolvedTheme.colors.kpmgBlue;

  const runs = [];
  const addParagraph = (text, style = {}) => {
    runs.push({
      text: safeText(text),
      options: {
        paraSpaceBefore: bulletTokens.paraSpaceBeforePt,
        paraSpaceAfter: bulletTokens.paraSpaceAfterPt,
        lineSpacing: bulletTokens.lineSpacingPt,
        breakLine: true,
        ...style,
      },
    });
  };

  function emit(item) {
    if (Array.isArray(item)) return;

    if (isTextObject(item)) {
      const style = item.header || item.subheader ? { bold: true, color: resolvedHeadingColor } : toInlineStyle(item);
      addParagraph(item.text, style);
      if (Array.isArray(item.children) && !(item.header || item.subheader)) {
        item.children.forEach((child) => emit(child));
      }
      return;
    }

    addParagraph(item);
  }

  lines.forEach((item) => emit(item));
  return runs;
}

export function toBodyRuns(lines, bodyStyle = 'bullets', options = {}) {
  return String(bodyStyle || '').toLowerCase() === 'paragraphs'
    ? toParagraphRuns(lines, options)
    : toBulletRuns(lines, options);
}
