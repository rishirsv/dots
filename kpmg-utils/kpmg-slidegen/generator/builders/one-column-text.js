import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { toBodyRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { normalizeBodyStyle } from '../helpers/layout.js';
import { sanitizeText } from '../helpers/text.js';
import { renderCallouts } from '../helpers/callouts.js';
import {
  computeOneColumnLayoutGeometry,
  ONE_COLUMN_LAYOUT_DEFAULTS,
} from '../helpers/one-column-layout.js';

const TOKENS = {
  geometry: ONE_COLUMN_LAYOUT_DEFAULTS.geometry,
  textStyles: {
    strapline: { fontFace: FONTS.body, fontSize: TYPE_SIZES.strapline, color: COLORS.kpmgPurple, italic: true, bold: true },
    body: { fontFace: FONTS.body, fontSize: TYPE_SIZES.body, color: COLORS.black, paraSpaceAfter: 6 },
    source: { fontFace: FONTS.body, fontSize: TYPE_SIZES.source, color: COLORS.kpmgBlue, italic: true, paraSpaceAfter: 0 },
  },
};

export function addOneColumnText(pptx, { title, strapline, body, source, callouts, bodyStyle, geometry, masterName } = {}) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const {
    geometry: g,
    strapText,
    sourceText,
    strapGeo,
    safeBodyGeo,
    calloutBoxes,
    callouts: resolvedCallouts,
    sourceGeo,
  } = computeOneColumnLayoutGeometry({
    geometry,
    masterName,
    strapline,
    source,
    callouts,
    straplineFontSize: TYPE_SIZES.strapline,
    sourceFontSize: TYPE_SIZES.source,
  });
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);

  addTitle(slide, title, g.title || TOKENS.geometry.title);
  if (strapText) {
    slide.addText(sanitizeText(strapText), {
      ...strapGeo,
      ...TOKENS.textStyles.strapline,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }
  slide.addText(toBodyRuns(body, effectiveBodyStyle), {
    ...safeBodyGeo,
    ...TOKENS.textStyles.body,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });
  renderCallouts(pptx, slide, {
    callouts: resolvedCallouts,
    boxes: calloutBoxes,
    slideType: 'oneColumnText',
    textBox: safeBodyGeo,
  });
  if (sourceText) {
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
