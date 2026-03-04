import { addTitle } from '../helpers/title.js';
import {
  THEME_COMPONENT_KEYS,
  resolveBodyTextStyle,
  resolveHeadingTextStyle,
  resolveTextBoxOptions,
  resolveTheme,
} from '../helpers/theme.js';

function resolveTextStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const componentTokens = resolvedTheme.components?.[THEME_COMPONENT_KEYS.contents] || {};
  const fontSizes = componentTokens.fontSizes || {};
  return {
    sectionNo: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontSize: Number(fontSizes.sectionNo || resolvedTheme.typeSizes.title),
      margin: 0,
      valign: 'top',
    },
    sectionTitle: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontSize: Number(fontSizes.sectionTitle || resolvedTheme.typeSizes.body),
      margin: 0,
      valign: 'top',
    },
    pageRange: {
      ...resolveHeadingTextStyle(resolvedTheme, { colorKey: 'kpmgBlue' }),
      fontSize: Number(fontSizes.pageRange || resolvedTheme.typeSizes.source),
      margin: 0,
      valign: 'top',
    },
    item: {
      ...resolveBodyTextStyle(resolvedTheme, { paraSpaceAfter: 0 }),
      margin: 0,
      valign: 'top',
    },
  };
}

function resolveSectionMetrics(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const lines = resolvedTheme.lines || {};
  const components = resolvedTheme.components || {};
  const contentTokens = components[THEME_COMPONENT_KEYS.contents] || {};
  return {
    sectionNumberHeight: Number(contentTokens.sectionNumberHeight || 0.52),
    sectionTitleOffsetY: Number(contentTokens.sectionTitleOffsetY || 0.57),
    pageRangeOffsetY: Number(contentTokens.pageRangeOffsetY || 0.83),
    bodyOffsetWithPageRangeY: Number(contentTokens.bodyOffsetWithPageRangeY || 1.12),
    bodyOffsetWithoutPageRangeY: Number(contentTokens.bodyOffsetWithoutPageRangeY || 0.9),
    dividerPt: Number(lines.sectionDividerPt || 1.5),
  };
}

function addSectionBlock(pptx, slide, section, geo, { metrics, textStyles, sectionBlue, textBox } = {}) {
  if (!section || !geo) return;
  const sectionNumberHeight = Number(metrics?.sectionNumberHeight || 0.52);
  const sectionTitleOffsetY = Number(metrics?.sectionTitleOffsetY || 0.57);
  const pageRangeOffsetY = Number(metrics?.pageRangeOffsetY || 0.83);
  const bodyOffsetWithPageRangeY = Number(metrics?.bodyOffsetWithPageRangeY || 1.12);
  const bodyOffsetWithoutPageRangeY = Number(metrics?.bodyOffsetWithoutPageRangeY || 0.9);
  const dividerPt = Number(metrics?.dividerPt || 1.5);
  const title = section.title || '';
  const pageRange = section.pageRange || '';
  const items = Array.isArray(section.items) ? section.items : [];

  slide.addText(section.number || '', {
    x: geo.x,
    y: geo.y,
    w: geo.w,
    h: sectionNumberHeight,
    ...textStyles.sectionNo,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: geo.x,
    y: geo.y + sectionNumberHeight,
    w: Math.min(0.55, geo.w * 0.35),
    h: 0,
    line: { color: sectionBlue, pt: dividerPt },
  });
  slide.addText(title, {
    x: geo.x,
    y: geo.y + sectionTitleOffsetY,
    w: geo.w,
    h: 0.23,
    ...textStyles.sectionTitle,
  });
  if (pageRange) {
    slide.addText(pageRange, {
      x: geo.x,
      y: geo.y + pageRangeOffsetY,
      w: geo.w,
      h: 0.2,
      ...textStyles.pageRange,
    });
  }
  const bodyY = pageRange ? geo.y + bodyOffsetWithPageRangeY : geo.y + bodyOffsetWithoutPageRangeY;
  slide.addText(items.join('\n'), {
    x: geo.x,
    y: bodyY,
    w: geo.w,
    h: Math.max(0.4, geo.h - (bodyY - geo.y)),
    ...textStyles.item,
    ...textBox,
    breakLine: true,
  });
}

function chunkFive(arr) {
  const a = Array.isArray(arr) ? arr : [];
  return [a.slice(0, 5), a.slice(5, 10)];
}

function sectionBox(col, rowGeo, { theme } = {}) {
  const components = theme?.components || {};
  const contentsSlideTokens = components[THEME_COMPONENT_KEYS.contentsSlide] || {};
  const gap = Number(contentsSlideTokens.sectionGap || theme?.spacing?.sectionGap || 0.18);
  const colW = (rowGeo.w - gap * 4) / 5;
  return { x: rowGeo.x + (colW + gap) * col, y: rowGeo.y, w: colW, h: rowGeo.h };
}

export function addContentsSlide(pptx, slideSpec = {}, ctx = {}) {
  const { title, sections } = slideSpec;
  const { geometry, masterName, theme } = ctx;
  const resolvedTheme = resolveTheme(theme);
  const textStyles = resolveTextStyles(resolvedTheme);
  const textBox = resolveTextBoxOptions(resolvedTheme);
  const metrics = resolveSectionMetrics(resolvedTheme);
  const sectionBlue = resolvedTheme.colors.kpmgBlue;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const g = geometry || {};
  if (!g.titleBox || !g.topRowBox || !g.bottomRowBox) {
    throw new Error('Missing required geometry for slide type "contents" (titleBox/topRowBox/bottomRowBox)');
  }
  addTitle(slide, title || 'Contents', g.titleBox, { theme });

  const [top, bottom] = chunkFive(sections);
  top.forEach((section, idx) =>
    addSectionBlock(
      pptx,
      slide,
      section,
      sectionBox(idx, g.topRowBox, { theme }),
      { metrics, textStyles, sectionBlue, textBox },
    ),
  );
  bottom.forEach((section, idx) =>
    addSectionBlock(
      pptx,
      slide,
      section,
      sectionBox(idx, g.bottomRowBox, { theme }),
      { metrics, textStyles, sectionBlue, textBox },
    ),
  );

  return slide;
}
