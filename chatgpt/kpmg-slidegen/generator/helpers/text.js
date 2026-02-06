/**
 * generator/helpers/text.js — Shared text utilities
 */

/**
 * Estimate a text box height in inches.
 * @param {number} fontSize
 * @param {number} [lines=1]
 * @param {number} [leading=1.15]
 * @param {number} [padding=0.3]
 * @returns {number}
 */
export function calcTextBoxHeight(fontSize, lines = 1, leading = 1.15, padding = 0.3) {
  const lineHeightIn = (fontSize / 72) * leading;
  return lines * lineHeightIn + padding;
}

/**
 * Create a safe outer shadow definition for PptxGenJS.
 * @param {string} [color='000000']
 * @param {number} [opacity=0.25]
 * @param {number} [angle=45]
 * @param {number} [blur=3]
 * @param {number} [offset=2]
 * @returns {object}
 */
export function safeOuterShadow(
  color = '000000',
  opacity = 0.25,
  angle = 45,
  blur = 3,
  offset = 2,
) {
  return {
    type: 'outer',
    color,
    opacity,
    angle,
    blur,
    offset,
  };
}

/**
 * Normalize text to reduce layout surprises.
 * @param {unknown} value
 * @param {object} [options]
 * @param {boolean} [options.preserveNewlines=false]
 * @returns {string}
 */
export function sanitizeText(value, options = {}) {
  const { preserveNewlines = false } = options;
  const raw = String(value ?? '');
  const normalized = preserveNewlines
    ? raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    : raw.replace(/[\r\n]+/g, ' ');
  return normalized.replace(/\s+/g, ' ').trim();
}
