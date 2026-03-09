import { addTitle } from '../helpers/title.js';
import { sanitizeText } from '../helpers/text.js';
import {
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveStraplineTextStyle,
  resolveTextBoxOptions,
  resolveTheme,
} from '../helpers/theme.js';
import {
  clampToMasterFooter,
  computeStrapShift,
  resolveLayoutMetrics,
  normalizeBodyStyle,
} from '../helpers/layout.js';
import { addBodyBlock, addStraplineBlock } from '../helpers/slide-components.js';

function resolveTextStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  return {
    strapline: resolveStraplineTextStyle(resolvedTheme),
    heading: resolveHeadingTextStyle(resolvedTheme),
    body: resolveBodyTextStyle(resolvedTheme),
  };
}

export function addTitleStrapline4TextBoxes(
  pptx,
  slideSpec = {},
  ctx = {},
) {
  const { title, strapline, columns, bodyStyle } = slideSpec;
  const { geometry, masterName, footerSafeTopByMaster, theme } = ctx;
  const layoutMetrics = resolveLayoutMetrics(theme);
  const textStyles = resolveTextStyles(theme);
  const textBox = resolveTextBoxOptions(theme);
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const strapText = strapline;
  const effectiveBodyStyle = normalizeBodyStyle(bodyStyle);
  const g = geometry || {};
  if (!g.titleBox || !g.straplineBox || !Array.isArray(g.columnBoxes) || g.columnBoxes.length < 4) {
    throw new Error('Missing required geometry for slide type "titleStrapline4TextBoxes" (titleBox/straplineBox/columnBoxes)');
  }

  addTitle(slide, title, g.titleBox, { theme });
  let straplineBox = null;
  if (strapText && g.straplineBox) {
    straplineBox = g.straplineBox;
    addStraplineBlock(slide, sanitizeText(strapText), straplineBox, { theme, style: textStyles.strapline });
  }

  const cols = Array.isArray(columns) ? columns : [];
  const firstColumnY = g.columnBoxes[0].y;
  const yShift = computeStrapShift(straplineBox, firstColumnY, layoutMetrics.strapGap);

  for (let i = 0; i < 4; i++) {
    const col = cols[i] || {};
    const base = g.columnBoxes[i];
    const geo = { ...base, y: base.y + yShift, h: base.h - yShift };
    const safeGeo = clampToMasterFooter(geo, masterName, 0, footerSafeTopByMaster);
    if (col.heading) {
      slide.addText(String(col.heading), { x: safeGeo.x, y: safeGeo.y, w: safeGeo.w, h: 0.3, ...textStyles.heading, ...textBox });
      addBodyBlock(slide, col.body, {
        x: safeGeo.x,
        y: safeGeo.y + 0.35,
        w: safeGeo.w,
        h: Math.max(0, safeGeo.h - 0.35),
      }, {
        theme,
        bodyStyle: effectiveBodyStyle,
        style: textStyles.body,
      });
    } else {
      addBodyBlock(slide, col.body, {
        x: safeGeo.x,
        y: safeGeo.y,
        w: safeGeo.w,
        h: safeGeo.h,
      }, {
        theme,
        bodyStyle: effectiveBodyStyle,
        style: textStyles.body,
      });
    }
  }

  return slide;
}
