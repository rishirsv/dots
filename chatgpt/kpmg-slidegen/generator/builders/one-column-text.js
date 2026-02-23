import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { toBodyRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { calcTextBoxHeight, sanitizeText } from '../helpers/text.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';
import { clampBoxToBottom } from '../helpers/geometry.js';

const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.4722, w: 11.1596, h: 0.5833 },
    strapline: { x: 1.0919, y: 1.2899, w: 11.1596, h: 0.5276 },
    body: { x: 1.0919, y: 1.2899, w: 11.1596, h: 5.9101 },
    source: { x: 1.0919, y: 6.62, w: 11.1596, h: 0.2 },
  },
  textStyles: {
    strapline: { fontFace: FONTS.body, fontSize: TYPE_SIZES.strapline, color: COLORS.kpmgPurple, italic: true, bold: true },
    body: { fontFace: FONTS.body, fontSize: TYPE_SIZES.body, color: COLORS.black, paraSpaceAfter: 6 },
    source: { fontFace: FONTS.body, fontSize: TYPE_SIZES.source, color: COLORS.kpmgBlue, italic: true, paraSpaceAfter: 0 },
  },
};

export function addOneColumnText(pptx, { title, strapline, body, source, bodyStyle, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || TOKENS.geometry;
  let strapGeo = null;
  const strapText = strapline;
  const sourceText = sanitizeText(source);
  const effectiveBodyStyle = bodyStyle || 'bullets';

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapText) {
    const titleGeo = g.title || TOKENS.geometry.title;
    const strapBase = g.strapline || TOKENS.geometry.strapline;
    const strapWidth = strapBase.w || titleGeo.w || TOKENS.geometry.strapline.w;
    const estimatedCharsPerLine = Math.max(30, Math.floor(strapWidth * 12));
    const estimatedLines = Math.max(1, Math.ceil(sanitizeText(strapText).length / estimatedCharsPerLine));
    const dynamicHeight = calcTextBoxHeight(TYPE_SIZES.strapline, Math.min(8, estimatedLines), 1.1, 0.12);
    strapGeo = {
      ...strapBase,
      x: strapBase.x ?? titleGeo.x,
      y: strapBase.y ?? TOKENS.geometry.strapline.y,
      w: strapWidth,
      h: Math.max(strapBase.h || TOKENS.geometry.strapline.h, dynamicHeight),
    };
    slide.addText(sanitizeText(strapText), {
      ...strapGeo,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const bodyBase = g.body || TOKENS.geometry.body;
  const shift = strapText && strapGeo ? Math.max(0, (strapGeo.y + strapGeo.h + 0.06) - bodyBase.y) : 0;
  const bodyGeo = shift ? { ...bodyBase, y: bodyBase.y + shift, h: bodyBase.h - shift } : bodyBase;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const sourcePad = sourceText ? 0.26 : 0;
  const safeBodyGeo = footerSafeTop ? clampBoxToBottom(bodyGeo, footerSafeTop - sourcePad) : bodyGeo;
  slide.addText(toBodyRuns(body, effectiveBodyStyle), {
    ...safeBodyGeo,
    ...TOKENS.textStyles.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });
  if (sourceText) {
    const sourceGeo =
      g.source ||
      (footerSafeTop
        ? { ...TOKENS.geometry.source, x: safeBodyGeo.x, w: safeBodyGeo.w, y: footerSafeTop - 0.2 }
        : { ...TOKENS.geometry.source, x: safeBodyGeo.x, w: safeBodyGeo.w, y: safeBodyGeo.y + safeBodyGeo.h + 0.03 });
    slide.addText(sourceText, {
      ...sourceGeo,
      ...TOKENS.textStyles.source,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  return slide;
}
