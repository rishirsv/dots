import { FONTS, COLORS, TYPE_SIZES, TEXT_BOX } from '../tokens.js';
import { toBodyRuns } from '../helpers/bullets.js';
import { addTitle } from '../helpers/title.js';
import { clampBoxToBottom, isValidColumnGeometry } from '../helpers/geometry.js';
import { calcTextBoxHeight, sanitizeText } from '../helpers/text.js';
import { recordFallback } from '../runtime/diagnostics.js';
import { FOOTER_SAFE_TOP } from '../helpers/footer.js';
import fs from 'node:fs';
import { normalizeImageSource } from '../helpers/media.js';
import { svgToDataUri } from '../helpers/svg.js';

export const TOKENS = {
  geometry: {
    title: { x: 1.0919, y: 0.4722, w: 11.1596, h: 0.5833 },
    strapline: { x: 1.0919, y: 1.2899, w: 11.1596, h: 0.5276 },
    left: { x: 1.0919, y: 1.2899, w: 5.7, h: 5.9101 },
    right: { x: 7.0415, y: 1.2899, w: 5.2, h: 5.9101 },
  },
  textStyles: {
    title: {
      fontFace: FONTS.heading,
      fontSize: TYPE_SIZES.slideTitle,
      color: COLORS.kpmgBlue,
      bold: true,
      align: 'left',
      valign: 'top',
    },
    body: {
      fontFace: FONTS.body,
      fontSize: TYPE_SIZES.body,
      color: COLORS.black,
      align: 'left',
      valign: 'top',
      paraSpaceAfter: 6,
    },
  },
};

function addIconChip(pptx, slide, iconPath, geo) {
  if (!iconPath) return;

  const rawSize = Math.min(Number(geo?.w ?? 0.62), Number(geo?.h ?? 0.62));
  const size = Number.isFinite(rawSize) ? Math.min(1.0, Math.max(0.2, rawSize)) : 0.62;
  const chipX = geo.x + geo.w - size;
  const chipY = geo.y;

  const resolvedIcon =
    typeof iconPath === 'string' && iconPath.toLowerCase().endsWith('.svg') && fs.existsSync(iconPath)
      ? svgToDataUri(fs.readFileSync(iconPath, 'utf8'))
      : iconPath;

  const pad = Math.max(0.02, size * 0.06);
  slide.addImage({
    ...normalizeImageSource(resolvedIcon),
    x: chipX + pad,
    y: chipY + pad,
    w: size - pad * 2,
    h: size - pad * 2,
    sizing: { type: 'contain', w: size - pad * 2, h: size - pad * 2 },
    altText: 'GPT icon',
  });
}

function addScreenshotPlaceholder(pptx, slide, placeholder, rightGeo, { topGap = null, style = null } = {}) {
  if (!placeholder) return false;
  const caption = placeholder.caption || '';
  const note = placeholder.note || 'Recommended screenshot: final output view (not the prompt).';

  const size = 0.62;
  const effectiveTopGap = topGap === null ? size + 0.16 : topGap;
  const frameX = rightGeo.x;
  const frameY = rightGeo.y + effectiveTopGap;
  const frameW = rightGeo.w;
  const frameH = Math.max(1.5, rightGeo.h - effectiveTopGap);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: frameX,
    y: frameY,
    w: frameW,
    h: frameH,
    fill: { color: 'FFFFFF' },
    line: { color: 'D9D9D9', width: 1 },
    rectRadius: 0.08,
  });

  slide.addText('Example (screenshot)', {
    x: frameX + 0.2,
    y: frameY + 0.15,
    w: frameW - 0.4,
    h: 0.25,
    fontFace: FONTS.heading,
    fontSize: style?.placeholderLabelFontSize ?? 11,
    color: COLORS.kpmgBlue,
    bold: true,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  slide.addText('Screenshot placeholder (to be added).', {
    x: frameX + 0.25,
    y: frameY + 0.95,
    w: frameW - 0.5,
    h: Math.max(0.6, frameH - 1.8),
    fontFace: FONTS.body,
    fontSize: style?.placeholderBodyFontSize ?? 9,
    color: '666666',
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'mid',
    align: 'center',
  });

  slide.addText(sanitizeText(caption), {
    x: frameX + 0.2,
    y: frameY + frameH - 0.75,
    w: frameW - 0.4,
    h: 0.35,
    fontFace: FONTS.body,
    fontSize: style?.placeholderCaptionFontSize ?? 8,
    color: COLORS.black,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  slide.addText(sanitizeText(note), {
    x: frameX + 0.2,
    y: frameY + frameH - 0.38,
    w: frameW - 0.4,
    h: 0.25,
    fontFace: FONTS.body,
    fontSize: style?.placeholderNoteFontSize ?? 7,
    color: '666666',
    italic: true,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  return true;
}

export function addTwoColumnTextWithStrapline(
  pptx,
  { title, strapline, leftBody, rightBody, bodyStyle, geometry, masterName, icon, iconPlacement, screenshotPlaceholder, style } = {},
) {
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();
  const candidate = geometry || TOKENS.geometry;
  const useExtracted = isValidColumnGeometry([candidate.left, candidate.right], 2);
  const g = useExtracted ? candidate : TOKENS.geometry;
  if (!useExtracted && geometry) {
    recordFallback('twoColumnTextWithStrapline', 'invalid_extracted_columns', {
      left: candidate.left,
      right: candidate.right,
    });
  }

  const titleGeo = g.title || TOKENS.geometry.title;
  const iconMode = iconPlacement || 'rightColumn';
  const iconInTitle = icon && (iconMode === 'titleLeft' || iconMode === 'titleRight');
  const strapText = strapline;
  const effectiveBodyStyle = bodyStyle || 'bullets';
  const requestedIconSize = style?.iconSize === undefined ? null : Number(style.iconSize);
  const iconSize = Number.isFinite(requestedIconSize)
    ? Math.min(0.75, Math.max(0.4, requestedIconSize))
    : 0.52;
  const iconPad = 0.16;

  const adjustedTitleGeo = iconInTitle
    ? {
        ...titleGeo,
        x: iconMode === 'titleLeft' ? titleGeo.x + iconSize + iconPad : titleGeo.x,
        w: iconMode === 'titleRight' ? titleGeo.w - (iconSize + iconPad) : titleGeo.w - (iconSize + iconPad),
      }
    : titleGeo;

  if (iconInTitle && iconMode === 'titleLeft') {
    addIconChip(pptx, slide, icon, { x: titleGeo.x, y: titleGeo.y + 0.06, w: iconSize, h: iconSize });
  }
  if (iconInTitle && iconMode === 'titleRight') {
    addIconChip(pptx, slide, icon, { x: titleGeo.x + titleGeo.w - iconSize, y: titleGeo.y + 0.06, w: iconSize, h: iconSize });
  }

  let strapBox = null;
  addTitle(slide, title, adjustedTitleGeo);
  if (strapText) {
    const strapBase = g.strapline || TOKENS.geometry.strapline || {
      x: titleGeo.x,
      y: TOKENS.geometry.title.y + TOKENS.geometry.title.h + 0.05,
      w: titleGeo.w,
      h: calcTextBoxHeight(TYPE_SIZES.strapline, 1),
    };
    const strapWidth = strapBase.w || titleGeo.w;
    const estimatedCharsPerLine = Math.max(30, Math.floor(strapWidth * 12));
    const estimatedLines = Math.max(1, Math.ceil(sanitizeText(strapText).length / estimatedCharsPerLine));
    const dynamicHeight = calcTextBoxHeight(TYPE_SIZES.strapline, Math.min(8, estimatedLines), 1.1, 0.12);
    strapBox = {
      ...strapBase,
      x: strapBase.x ?? titleGeo.x,
      y: strapBase.y ?? TOKENS.geometry.strapline.y,
      w: strapWidth,
      h: Math.max(strapBase.h || TOKENS.geometry.strapline.h, dynamicHeight),
    };
    slide.addText(sanitizeText(strapText), {
      ...strapBox,
      fontFace: FONTS.body,
      fontSize: style?.straplineFontSize ?? TYPE_SIZES.strapline,
      color: COLORS.kpmgPurple,
      italic: true,
      bold: true,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  const leftBase = g.left || TOKENS.geometry.left;
  const rightBase = g.right || TOKENS.geometry.right;
  const shift = strapText && strapBox
    ? Math.max(0, (strapBox.y + strapBox.h + 0.06) - Math.min(leftBase.y, rightBase.y))
    : 0;
  const leftGeo = shift ? { ...leftBase, y: leftBase.y + shift, h: leftBase.h - shift } : leftBase;
  const rightGeo = shift ? { ...rightBase, y: rightBase.y + shift, h: rightBase.h - shift } : rightBase;
  const footerSafeTop = masterName === 'KPMG_WHITE' ? FOOTER_SAFE_TOP : null;
  const safeLeftGeo = footerSafeTop ? clampBoxToBottom(leftGeo, footerSafeTop) : leftGeo;
  const safeRightGeo = footerSafeTop ? clampBoxToBottom(rightGeo, footerSafeTop) : rightGeo;

  const bodyTextStyle = { ...TOKENS.textStyles.body, fontSize: style?.bodyFontSize ?? TOKENS.textStyles.body.fontSize };
  slide.addText(toBodyRuns(leftBody, effectiveBodyStyle), {
    ...safeLeftGeo,
    ...bodyTextStyle,
    wrap: TEXT_BOX.wrap,
    margin: TEXT_BOX.marginPt,
    valign: 'top',
  });

  // Optional enhancements (used by the TS Custom GPTs portfolio deck):
  // - `icon`: add an icon chip at the top-right of the right column
  // - `screenshotPlaceholder`: render a framed screenshot placeholder in the right column
  const iconInRightColumn = Boolean(icon) && !iconInTitle;
  if (iconInRightColumn) addIconChip(pptx, slide, icon, safeRightGeo);
  const placeholderTopGap = iconInRightColumn ? null : 0.05;
  const hasPlaceholder = addScreenshotPlaceholder(pptx, slide, screenshotPlaceholder, safeRightGeo, {
    topGap: placeholderTopGap,
    style,
  });
  if (!hasPlaceholder) {
    slide.addText(toBodyRuns(rightBody, effectiveBodyStyle), {
      ...safeRightGeo,
      ...bodyTextStyle,
      wrap: TEXT_BOX.wrap,
      margin: TEXT_BOX.marginPt,
      valign: 'top',
    });
  }

  return slide;
}
