import {
  buildTheme as buildRuntimeTheme,
  resolveTheme as resolveRuntimeTheme,
  isResolvedTheme as isResolvedRuntimeTheme,
} from '../runtime/theme.js';

/**
 * Re-export runtime theme construction for compatibility with helper imports.
 * @param {object} templatePackage
 * @param {{ deckSpec?: object, options?: object }} [args]
 * @returns {object}
 */
export function buildTheme(templatePackage = {}, args = {}) {
  return buildRuntimeTheme(templatePackage, args);
}

/**
 * Resolve unknown theme input into the runtime theme shape.
 * @param {object|null} theme
 * @returns {object}
 */
export function resolveTheme(theme = null) {
  return resolveRuntimeTheme(theme);
}

/**
 * Check whether the input has already been resolved as runtime theme.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isResolvedTheme(value) {
  return isResolvedRuntimeTheme(value);
}

/**
 * Coerce a value to a finite number with a deterministic fallback.
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
export function toFiniteNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function firstFiniteNumber(...values) {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

function normalizeTextStyle(value = {}) {
  const normalized = {};
  if (typeof value?.fontFace === 'string' && value.fontFace.trim()) normalized.fontFace = value.fontFace.trim();
  const fontSize = firstFiniteNumber(value?.fontSize);
  if (fontSize !== null) normalized.fontSize = fontSize;
  if (typeof value?.color === 'string' && value.color.trim()) normalized.color = value.color.trim();
  if (typeof value?.bold === 'boolean') normalized.bold = value.bold;
  if (typeof value?.italic === 'boolean') normalized.italic = value.italic;
  const paraSpaceAfter = Number(value?.paraSpaceAfter);
  if (Number.isFinite(paraSpaceAfter)) normalized.paraSpaceAfter = paraSpaceAfter;
  return normalized;
}

/**
 * Resolve a text style from token textStyles with a fallback style object.
 * @param {object} resolvedTheme
 * @param {string} tokenKey
 * @param {object} fallback
 * @returns {object}
 */
export function resolveTokenTextStyle(resolvedTheme, tokenKey, fallback = {}) {
  const tokenStyle = resolvedTheme?.textStyles?.[tokenKey];
  return {
    ...fallback,
    ...normalizeTextStyle(tokenStyle),
  };
}

function resolveThemeColor(theme, colorKey, fallback) {
  const color = theme?.colors?.[colorKey];
  if (typeof color === 'string' && color.trim()) return color.trim();
  return fallback;
}

/**
 * Resolve standard text box options from theme defaults plus overrides.
 * @param {object|null} theme
 * @param {object} [overrides]
 * @returns {object}
 */
export function resolveTextBoxOptions(theme = null, overrides = {}) {
  const resolvedTheme = resolveTheme(theme);
  const base = {
    wrap: resolvedTheme.textBox.wrap,
    margin: resolvedTheme.textBox.marginPt,
  };
  return { ...base, ...overrides };
}

/**
 * Resolve shared text primitive values consumed by multiple builders.
 * @param {object|null} theme
 * @returns {{ marginNone: number, bodyParaSpaceAfter: number, sourceParaSpaceAfter: number }}
 */
export function resolveTextThemePrimitives(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  return {
    marginNone: toFiniteNumber(resolvedTheme?.components?.text?.margin?.none, 0),
    bodyParaSpaceAfter: toFiniteNumber(resolvedTheme?.components?.text?.paraSpaceAfter?.body, 6),
    sourceParaSpaceAfter: toFiniteNumber(resolvedTheme?.components?.text?.paraSpaceAfter?.source, 0),
  };
}

function resolveDefaultParaSpacing(theme = null, key = 'body') {
  const resolvedTheme = resolveTheme(theme);
  const value = resolvedTheme?.components?.text?.paraSpaceAfter?.[key];
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  return null;
}

/**
 * Resolve strapline text style from semantic theme values.
 * @param {object|null} theme
 * @param {{ colorKey?: string, color?: string|null, italic?: boolean, bold?: boolean, paraSpaceAfter?: number|null, tokenKey?: string|null }} [args]
 * @returns {object}
 */
export function resolveStraplineTextStyle(
  theme,
  {
    colorKey = 'kpmgPurple',
    color = null,
    italic = true,
    bold = true,
    paraSpaceAfter = null,
    tokenKey = null,
  } = {},
) {
  const resolvedTheme = resolveTheme(theme);
  const fallback = {
    fontFace: resolvedTheme.fonts.body,
    fontSize: resolvedTheme.typeSizes.strapline,
    color: color || resolveThemeColor(resolvedTheme, colorKey, resolvedTheme.colors.kpmgPurple),
    italic,
    bold,
  };
  const tokenStyle = tokenKey ? resolveTokenTextStyle(resolvedTheme, tokenKey, fallback) : fallback;
  if (Number.isFinite(paraSpaceAfter)) tokenStyle.paraSpaceAfter = paraSpaceAfter;
  return tokenStyle;
}

/**
 * Resolve body text style from semantic theme values.
 * @param {object|null} theme
 * @param {{ paraSpaceAfter?: number|null, tokenKey?: string|null }} [args]
 * @returns {object}
 */
export function resolveBodyTextStyle(
  theme,
  { paraSpaceAfter = null, tokenKey = null } = {},
) {
  const resolvedTheme = resolveTheme(theme);
  const defaultParaSpaceAfter = resolveDefaultParaSpacing(resolvedTheme, 'body');
  const fallback = {
    fontFace: resolvedTheme.fonts.body,
    fontSize: resolvedTheme.typeSizes.body,
    color: resolvedTheme.colors.black,
    paraSpaceAfter: Number.isFinite(paraSpaceAfter) ? paraSpaceAfter : defaultParaSpaceAfter,
  };
  return tokenKey ? resolveTokenTextStyle(resolvedTheme, tokenKey, fallback) : fallback;
}

/**
 * Resolve source/footnote text style from semantic theme values.
 * @param {object|null} theme
 * @param {{ paraSpaceAfter?: number|null, tokenKey?: string|null }} [args]
 * @returns {object}
 */
export function resolveSourceTextStyle(
  theme,
  { paraSpaceAfter = null, tokenKey = null } = {},
) {
  const resolvedTheme = resolveTheme(theme);
  const defaultParaSpaceAfter = resolveDefaultParaSpacing(resolvedTheme, 'source');
  const fallback = {
    fontFace: resolvedTheme.fonts.body,
    fontSize: resolvedTheme.typeSizes.source,
    color: resolvedTheme.colors.kpmgBlue,
    italic: true,
    paraSpaceAfter: Number.isFinite(paraSpaceAfter) ? paraSpaceAfter : defaultParaSpaceAfter,
  };
  return tokenKey ? resolveTokenTextStyle(resolvedTheme, tokenKey, fallback) : fallback;
}

/**
 * Resolve heading text style from semantic theme values.
 * @param {object|null} theme
 * @param {{ colorKey?: string, color?: string|null, bold?: boolean, tokenKey?: string|null }} [args]
 * @returns {object}
 */
export function resolveHeadingTextStyle(
  theme,
  { colorKey = 'kpmgBlue', color = null, bold = true, tokenKey = null } = {},
) {
  const resolvedTheme = resolveTheme(theme);
  const fallback = {
    fontFace: resolvedTheme.fonts.body,
    fontSize: resolvedTheme.typeSizes.body,
    color: color || resolveThemeColor(resolvedTheme, colorKey, resolvedTheme.colors.kpmgBlue),
    bold,
  };
  return tokenKey ? resolveTokenTextStyle(resolvedTheme, tokenKey, fallback) : fallback;
}

export const THEME_COMPONENT_KEYS = Object.freeze({
  contents: 'contents',
  contentsSlide: 'contentsSlide',
  analysisNarrowTable: 'analysisNarrowTable',
  analysisBridge: 'analysisBridge',
  analysisWideChart: 'analysisWideChart',
  businessOverview: 'businessOverview',
  backCover: 'backCover',
  callouts: 'callouts',
});
