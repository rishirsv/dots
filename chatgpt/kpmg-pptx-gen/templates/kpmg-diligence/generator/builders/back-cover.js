import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLORS, FONTS } from '../tokens.js';
import { normalizeImageSource } from '../helpers/media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_ASSETS_DIR = path.join(__dirname, '..', '..', 'assets');
const DEFAULT_ASSETS = {
  gradientBackCover: path.join(TEMPLATE_ASSETS_DIR, 'gradient_back_cover_300dpi.png'),
};

function addImageSmart(slide, asset, opts) {
  slide.addImage({ ...normalizeImageSource(asset), ...opts });
}

export function addBackCover(pptx, { disclaimer, url, assets, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};

  // Prefer masters for the back-cover full-bleed gradient.
  if (!masterName) {
    const gradient = assets?.gradientBackCover ?? DEFAULT_ASSETS.gradientBackCover;
    addImageSmart(slide, gradient, { x: 0, y: 0, w: 13.333, h: 7.5, altText: 'Decorative gradient' });
  }

  const defaultDisclaimer =
    'The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. ' +
    'Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received ' +
    'or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough ' +
    'examination of the particular situation.';

  slide.addText(disclaimer || defaultDisclaimer, {
    ...(g.disclaimer || { x: 1.0, y: 3.6, w: 11.2, h: 2.4 }),
    fontFace: FONTS.body,
    fontSize: 9,
    color: COLORS.white,
    valign: 'top',
    wrap: true,
  });

  slide.addText(url || 'kpmg.com', {
    ...(g.url || { x: 1.0, y: 6.3, w: 4.0, h: 0.3 }),
    fontFace: FONTS.body,
    fontSize: 9,
    color: COLORS.white,
    bold: true,
    hyperlink: { url: 'https://kpmg.com' },
  });

  return slide;
}
