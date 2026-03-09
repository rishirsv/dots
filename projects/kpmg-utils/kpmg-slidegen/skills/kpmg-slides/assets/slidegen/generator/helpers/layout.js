import { clampBoxToBottom } from './geometry.js';
import { resolveTheme } from './theme.js';

function requireFiniteMetric(name, value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  throw new Error(`Missing required layout metric "${name}"`);
}

export function resolveLayoutMetrics(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  return {
    strapGap: requireFiniteMetric('spacing.strapGap', resolvedTheme?.spacing?.strapGap),
    sourceTopOffset: requireFiniteMetric('spacing.sourceTopOffset', resolvedTheme?.spacing?.sourceTopOffset),
    sourceBottomGap: requireFiniteMetric('spacing.sourceBottomGap', resolvedTheme?.spacing?.sourceBottomGap),
  };
}

export function normalizeBodyStyle(bodyStyle) {
  const normalized = String(bodyStyle || '').trim().toLowerCase();
  return normalized === 'paragraph' || normalized === 'paragraphs' ? 'paragraphs' : 'bullets';
}

export function computeStrapShift(strapBox, contentTop, gap) {
  if (!strapBox || !Number.isFinite(contentTop)) return 0;
  const resolvedGap = requireFiniteMetric('spacing.strapGap', gap);
  return Math.max(0, (strapBox.y + strapBox.h + resolvedGap) - contentTop);
}

export function shiftBox(box, shift = 0) {
  if (!box || !shift) return box;
  return { ...box, y: box.y + shift, h: box.h - shift };
}

function lookupSafeTop(masterName, footerSafeTopByMaster) {
  if (!footerSafeTopByMaster || typeof footerSafeTopByMaster !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(footerSafeTopByMaster, masterName)) return null;
  const value = footerSafeTopByMaster[masterName];
  return Number.isFinite(value) ? value : null;
}

export function footerSafeTopForMaster(masterName, footerSafeTopByMaster = null) {
  const configured = lookupSafeTop(masterName, footerSafeTopByMaster);
  return Number.isFinite(configured) ? configured : null;
}

export function clampToMasterFooter(box, masterName, pad = 0, footerSafeTopByMaster = null) {
  const safeTop = footerSafeTopForMaster(masterName, footerSafeTopByMaster);
  if (!safeTop) return box;
  return clampBoxToBottom(box, safeTop - pad);
}

function normalizeSourceText(sourceText) {
  return String(sourceText ?? '').replace(/\s+/g, ' ').trim();
}

export function estimateSourceTextHeight(
  sourceText,
  boxW,
  {
    fontSize = 8,
    minHeight = 0.2,
    maxHeight = 0.44,
    lineHeightMultiplier = 1.15,
    paddingInches = 0.02,
  } = {},
) {
  const text = normalizeSourceText(sourceText);
  if (!text) return 0;

  const width = Math.max(0.5, Number(boxW || 0.5));
  const size = Math.max(6, Number(fontSize || 8));
  const charsPerLine = Math.max(20, Math.floor(width * 12.5 * (10 / size)));
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  const lineHeightIn = ((size * lineHeightMultiplier) / 72);
  const estimated = lines * lineHeightIn + paddingInches;
  return Math.max(minHeight, Math.min(maxHeight, estimated));
}

export function sourceFootprintBelow(upperBox, sourceText, options = {}) {
  if (!upperBox) return 0;
  const text = normalizeSourceText(sourceText);
  if (!text) return 0;
  const topOffset = requireFiniteMetric('spacing.sourceTopOffset', options.topOffset);
  const sourceHeight = estimateSourceTextHeight(text, upperBox.w, options);
  return topOffset + sourceHeight;
}

export function buildSourceBox(upperBox, sourceText, options = {}) {
  if (!upperBox) return null;
  const text = normalizeSourceText(sourceText);
  if (!text) return null;
  const topOffset = requireFiniteMetric('spacing.sourceTopOffset', options.topOffset);
  const sourceHeight = estimateSourceTextHeight(text, upperBox.w, options);
  return {
    x: upperBox.x,
    y: upperBox.y + upperBox.h + topOffset,
    w: upperBox.w,
    h: sourceHeight,
  };
}

export function reserveSourceGutterBetweenBoxes({
  upperBox,
  lowerBox,
  sourceText,
  sourceOptions = {},
  bottomGap,
  minUpperHeight = 1.05,
  minLowerHeight = 0.85,
} = {}) {
  if (!upperBox || !lowerBox) {
    return { upperBox, lowerBox, adjusted: false };
  }

  const footprint = sourceFootprintBelow(upperBox, sourceText, sourceOptions);
  if (footprint <= 0) {
    return { upperBox, lowerBox, adjusted: false };
  }

  const safeBottomGap = requireFiniteMetric('spacing.sourceBottomGap', bottomGap);
  const requiredTop = upperBox.y + upperBox.h + footprint + Math.max(0, safeBottomGap);
  const overlap = Math.max(0, requiredTop - lowerBox.y);
  if (overlap <= 0) {
    return { upperBox, lowerBox, adjusted: false };
  }

  let upper = { ...upperBox };
  let lower = { ...lowerBox };
  let remaining = overlap;

  const maxLowerShift = Math.max(0, lower.h - minLowerHeight);
  const lowerShift = Math.min(remaining, maxLowerShift);
  if (lowerShift > 0) {
    lower.y += lowerShift;
    lower.h -= lowerShift;
    remaining -= lowerShift;
  }

  const maxUpperShrink = Math.max(0, upper.h - minUpperHeight);
  const upperShrink = Math.min(remaining, maxUpperShrink);
  if (upperShrink > 0) {
    upper.h -= upperShrink;
    remaining -= upperShrink;
  }

  if (remaining > 0) {
    lower.y += remaining;
    lower.h = Math.max(0.4, lower.h - remaining);
  }

  return { upperBox: upper, lowerBox: lower, adjusted: true };
}
