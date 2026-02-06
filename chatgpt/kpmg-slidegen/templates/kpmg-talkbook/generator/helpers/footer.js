/**
 * generator/helpers/footer.js — Shared footer elements
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgToDataUri } from './svg.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_PATH = path.join(__dirname, '..', '..', 'templates', 'kpmg-diligence', 'assets', 'kpmg-logo.svg');
export const FOOTER_LOGO_BOX = { x: 1.097, y: 6.854, w: 0.53, h: 0.213 };
export const FOOTER_SAFE_TOP = FOOTER_LOGO_BOX.y - 0.1;
let cachedLogo = null;

function getLogoData() {
  if (cachedLogo) return cachedLogo;
  const svg = fs.readFileSync(LOGO_PATH, 'utf8');
  cachedLogo = svgToDataUri(svg);
  return cachedLogo;
}

/**
 * Add a KPMG logo footer element to a slide.
 * @param {object} slide
 * @param {object} [opts]
 */
export function addFooterLogo(slide, opts = {}) {
  const { x = FOOTER_LOGO_BOX.x, y = FOOTER_LOGO_BOX.y, w = FOOTER_LOGO_BOX.w, h = FOOTER_LOGO_BOX.h } = opts;
  slide.addImage({ data: getLogoData(), x, y, w, h, altText: 'KPMG logo' });
}
