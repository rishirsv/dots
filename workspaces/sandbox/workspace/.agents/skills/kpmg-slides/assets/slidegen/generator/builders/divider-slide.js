import path from 'node:path';
import { addImageSmart } from '../helpers/media.js';
import { sanitizeText } from '../helpers/text.js';
import {
  resolveTextBoxOptions,
  resolveTheme,
  resolveTokenTextStyle,
} from '../helpers/theme.js';
import { resolveTemplateAssetsDir } from '../runtime/template-roots.js';

export const TOKENS = {
  geometry: {
    gradient: { x: 1.0919466, y: 1.0674245, w: 7.7228631, h: 5.3645833 },
    number: { x: 1.25, y: 1.2, w: 2.6, h: 1.2 },
    title: { x: 1.25, y: 2.6, w: 7.0, h: 2.0 },
  },
};

function resolveTextStyles(theme = null) {
  const resolvedTheme = resolveTheme(theme);
  const dividerNumberSize = Number(resolvedTheme?.type?.dividerNumber);
  const dividerTitleSize = Number(resolvedTheme?.type?.dividerTitle);
  if (!Number.isFinite(dividerNumberSize) || !Number.isFinite(dividerTitleSize)) {
    throw new Error('Missing required theme.type divider scale (dividerNumber/dividerTitle)');
  }
  const sectionNumber = resolveTokenTextStyle(resolvedTheme, 'sectionNumber', {
    fontFace: resolvedTheme.fonts.heading,
    fontSize: dividerNumberSize,
    color: resolvedTheme.colors.white,
    bold: true,
  });
  return {
    sectionNumber: {
      ...sectionNumber,
      align: 'left',
      valign: 'top',
    },
    sectionTitle: {
      fontFace: resolvedTheme.fonts.heading,
      fontSize: dividerTitleSize,
      color: resolvedTheme.colors.white,
      bold: true,
      align: 'left',
      valign: 'top',
    },
  };
}

const TEMPLATE_ASSETS_DIR = resolveTemplateAssetsDir('kpmg-diligence');
const DEFAULT_ASSETS = {
  gradientDivider: path.join(TEMPLATE_ASSETS_DIR, 'gradient_divider_window_300dpi.png'),
};

export function addDivider(
  pptx,
  slideSpec = {},
  ctx = {},
) {
  const { sectionNumber, sectionTitle, type } = slideSpec;
  const { assets, geometry, masterName, theme } = ctx;
  const resolvedTheme = resolveTheme(theme);
  const resolvedStyles = resolveTextStyles(resolvedTheme);
  const textBox = resolveTextBoxOptions(theme);
  const dividerLightTextColor = resolvedTheme.colors.primary || resolvedTheme.colors.kpmgBlue;
  const variantTextStyles =
    type === 'dividerLight'
      ? { sectionNumber: { color: dividerLightTextColor }, sectionTitle: { color: dividerLightTextColor } }
      : null;
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();

  const gradientDivider = assets?.gradientDivider ?? DEFAULT_ASSETS.gradientDivider;
  const g = geometry || {};
  if (!g.numberBox || !g.titleBox) {
    throw new Error('Missing required geometry for slide type "divider" (numberBox/titleBox)');
  }

  // Prefer masters for the divider gradient window.
  if (!masterName) {
    if (!g.gradientBox) {
      throw new Error('Missing required geometry "gradientBox" for divider slide without master');
    }
    addImageSmart(slide, gradientDivider, {
      ...g.gradientBox,
      altText: 'Decorative gradient',
    });
  }

  slide.addText(sectionNumber ?? '', {
    ...g.numberBox,
    ...resolvedStyles.sectionNumber,
    ...(variantTextStyles?.sectionNumber || {}),
    ...textBox,
  });

  // Strip embedded newlines from section titles to prevent awkward mid-phrase wrapping.
  // JSON specs often include \n in titles from the migrator; let the text box reflow naturally.
  const cleanTitle = sanitizeText(sectionTitle ?? '');
  slide.addText(cleanTitle, {
    ...g.titleBox,
    ...resolvedStyles.sectionTitle,
    ...(variantTextStyles?.sectionTitle || {}),
    wrap: true,
    margin: textBox.margin,
  });

  return slide;
}
