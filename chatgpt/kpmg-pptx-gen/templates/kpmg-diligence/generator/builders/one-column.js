import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX, STRAPLINE_SHIFT } from '../tokens.js';
import { toBulletRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { calcTextBoxHeight, sanitizeText } from '../helpers/text.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';
import { clampBoxToBottom } from '../helpers/geometry.js';

const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.6, w: 11.1596, h: 0.6 },
    strapline: { x: 1.0919, y: 1.2, w: 11.1596, h: 0.35 },
    body: { x: 1.0919, y: 1.6, w: 11.1596, h: 5.6 },
  },
  textStyles: {
    strapline: { fontFace: FONTS.body, fontSize: TYPE_SIZES.strapline, color: COLORS.kpmgPurple, italic: true, bold: true },
    body: { fontFace: FONTS.body, fontSize: TYPE_SIZES.body, color: COLORS.black, paraSpaceAfter: 6 },
  },
};

export function addOneColumnText(pptx, { title, strapline, body, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || TOKENS.geometry;

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapline) {
    const titleGeo = g.title || TOKENS.geometry.title;
    const strapGeo = g.strapline || {
      x: titleGeo.x,
      y: titleGeo.y + titleGeo.h + 0.05,
      w: titleGeo.w,
      h: calcTextBoxHeight(TYPE_SIZES.strapline, 1),
    };
    slide.addText(sanitizeText(strapline), {
      ...strapGeo,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const hasMeasuredStrapline = Boolean(g.strapline);
  const shift = strapline && !hasMeasuredStrapline ? STRAPLINE_SHIFT : 0;
  const bodyBase = g.body || TOKENS.geometry.body;
  const bodyGeo = shift ? { ...bodyBase, y: bodyBase.y + shift, h: bodyBase.h - shift } : bodyBase;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const safeBodyGeo = footerSafeTop ? clampBoxToBottom(bodyGeo, footerSafeTop) : bodyGeo;
  slide.addText(toBulletRuns(body), {
    ...safeBodyGeo,
    ...TOKENS.textStyles.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  return slide;
}
