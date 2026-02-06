// cover.js
//
// Cover slide prototype for the KPMG Diligence Reporting template.
//
// Intended for PptxGenJS 4.0.1 (this environment has 4.0.0; the API used here is compatible).

import PptxGenJS from 'pptxgenjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLORS, FONTS } from '../tokens.js';
import { getImageDimensions, normalizeImageSource } from '../helpers/media.js';
import { sanitizeText } from '../helpers/text.js';

// Resolve local paths when running as an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────

export const TOKENS = {
  colors: {
    accent1: COLORS.primary,
    white: COLORS.white,
  },
  fonts: {
    title: FONTS.heading,
    subtitle: FONTS.body,
  },
  geometry: {
    // inches
    logo: { x: 1.0919, y: 0.406, w: 1.0, h: 0.4 },
    title: { x: 1.0919, y: 1.5927, w: 4.044, h: 3.7486 },
    subtitle: { x: 1.0919, y: 5.4745, w: 4.044, h: 0.8858 },
    photoBox: { x: 5.3762, y: 1.592, w: 6.8715, h: 4.7743 }
  },
  textStyles: {
    coverTitle: {
      fontFace: FONTS.heading,
      fontSize: 40,
      bold: true,
      color: 'FFFFFF',
      align: 'left',
      valign: 'top',
      margin: 0,
      fit: 'none'
    },
    coverSubtitle: {
      fontFace: FONTS.body,
      fontSize: 14,
      color: 'FFFFFF',
      align: 'left',
      valign: 'bottom',
      margin: 0,
      fit: 'none'
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSETS (use placeholder base64 or file paths)
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATE_ASSETS_DIR = path.join(__dirname, '..', '..', 'templates', 'kpmg-diligence', 'assets');

export const ASSETS = {
  logoWhite: path.join(TEMPLATE_ASSETS_DIR, 'kpmg-logo-white.png'),
  coverPhoto: path.join(TEMPLATE_ASSETS_DIR, 'cover-photo.jpeg')
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// Shared helpers keep image handling consistent across builders.

/**
 * Compute the *scaled image size* (in inches) required to cover a given box.
 * This mirrors the crop-to-cover logic used by PowerPoint.
 */
function calcCoverFitWH(boxW, boxH, imgWpx, imgHpx) {
  const imgRatio = imgHpx / imgWpx;
  const boxRatio = boxH / boxW;

  if (boxRatio > imgRatio) {
    // Box is taller than image => scale by height, crop left/right
    return { w: boxH / imgRatio, h: boxH };
  }

  // Box is wider than image => scale by width, crop top/bottom
  return { w: boxW, h: boxW * imgRatio };
}

function addImageSmart(slide, asset, opts) {
  slide.addImage({ ...normalizeImageSource(asset), ...opts });
}

// ─────────────────────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add the Cover slide.
 *
 * `title` may be:
 * - string
 * - rich text array (runs), supported by PptxGenJS: [{ text, options }, ...]
 */
export function addCover(pptx, { title, subtitle, assets, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();

  const logoWhite = assets?.logoWhite ?? ASSETS.logoWhite;
  const coverPhoto = assets?.coverPhoto ?? ASSETS.coverPhoto;
  const g = geometry || TOKENS.geometry;

  // Solid blue background (prefer master when provided)
  if (!masterName) slide.background = { color: TOKENS.colors.accent1 };

  // White KPMG logo (top-left)
  addImageSmart(slide, logoWhite, {
    ...(g.logo || TOKENS.geometry.logo),
    altText: 'KPMG logo',
  });

  // Title text box (left)
  slide.addText(sanitizeText(title ?? ''), {
    ...(g.title || TOKENS.geometry.title),
    ...TOKENS.textStyles.coverTitle,
    valign: 'top'
  });

  // Subtitle text box (below title)
  slide.addText(sanitizeText(subtitle ?? ''), {
    ...(g.subtitle || TOKENS.geometry.subtitle),
    ...TOKENS.textStyles.coverSubtitle,
    valign: 'top'
  });

  // Cover photo (right) — crop-to-cover
  const box = g.photoBox || g.photo || TOKENS.geometry.photoBox;
  const { width: imgWpx, height: imgHpx } = getImageDimensions(coverPhoto);
  const full = calcCoverFitWH(box.w, box.h, imgWpx, imgHpx);

  addImageSmart(slide, coverPhoto, {
    x: box.x,
    y: box.y,

    // IMPORTANT:
    // PptxGenJS computes `cover` cropping from the aspect ratio of the *image object*.
    // So: set (w,h) to the scaled image size that preserves the image aspect ratio,
    // and set sizing.(w,h) to the target box to cover.
    w: full.w,
    h: full.h,
    sizing: { type: 'cover', w: box.w, h: box.h },
    altText: 'Cover photograph',
  });

  return slide;
}

// ─────────────────────────────────────────────────────────────────────────────
// Test harness
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'KPMG_WIDE', width: 13.333, height: 7.5 });
  pptx.layout = 'KPMG_WIDE';

  addCover(pptx, {
    title: 'Project Alpha',
    subtitle: 'Quality of Earnings Analysis\nPrepared for Client Name'
  });

  const outPath = path.join(__dirname, '..', '..', 'references', 'pptx', 'cover-test.pptx');
  await pptx.writeFile(outPath);
  console.log(`Generated: ${outPath}`);
}

if (process.argv[1] === __filename) {
  main();
}
