import { computeDynamicStraplineBox, sanitizeText } from './text.js';
import { resolveCalloutLayout } from './callouts.js';
import {
  clampToMasterFooter,
  computeStrapShift,
  footerSafeTopForMaster,
  resolveLayoutMetrics,
  shiftBox,
} from './layout.js';
import { requireGeometryBox } from '../runtime/geometry-contract.js';

export const ONE_COLUMN_LAYOUT_DEFAULTS = Object.freeze({
  sourceLayout: {
    topOffset: 0.03,
    minHeight: 0.2,
    maxHeight: 0.44,
  },
  typography: {
    straplineFontSize: 10,
    sourceFontSize: 6,
  },
});

export function computeOneColumnLayoutGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  source,
  callouts = [],
  straplineFontSize,
  sourceFontSize,
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const typography = ONE_COLUMN_LAYOUT_DEFAULTS.typography;
  const resolvedStraplineSize = Number.isFinite(straplineFontSize)
    ? Number(straplineFontSize)
    : typography.straplineFontSize;
  const resolvedSourceSize = Number.isFinite(sourceFontSize)
    ? Number(sourceFontSize)
    : typography.sourceFontSize;
  const strapText = strapline;
  const sourceText = sanitizeText(source);

  const titleGeo = requireGeometryBox(g.titleBox, { slideType: 'oneColumnText', key: 'titleBox' });
  const strapBase = requireGeometryBox(g.straplineBox, { slideType: 'oneColumnText', key: 'straplineBox' });
  const bodyBase = requireGeometryBox(g.bodyBox, { slideType: 'oneColumnText', key: 'bodyBox' });
  const sourceBase = requireGeometryBox(g.sourceBox, { slideType: 'oneColumnText', key: 'sourceBox' });

  const strapGeo = strapText
    ? computeDynamicStraplineBox({
        strapline: strapText,
        titleGeo,
        strapBase,
        defaultStrapGeo: strapBase,
        fontSize: resolvedStraplineSize,
      })
    : null;

  const shift = computeStrapShift(strapGeo, bodyBase.y, layoutMetrics.strapGap);
  const bodyGeo = shiftBox(bodyBase, shift);
  const sourcePad = sourceText
    ? Math.max(0, bodyGeo.y + bodyGeo.h - sourceBase.y + ONE_COLUMN_LAYOUT_DEFAULTS.sourceLayout.topOffset)
    : 0;
  const safeBodyGeoBase = clampToMasterFooter(bodyGeo, masterName, sourcePad, footerSafeTopByMaster);
  const calloutLayout = resolveCalloutLayout({
    slideType: 'oneColumnText',
    callouts,
    textBox: safeBodyGeoBase,
    preferredBoxes: g.calloutBoxes,
  });
  const safeBodyGeo = calloutLayout.adjustedTextBox || safeBodyGeoBase;

  let sourceGeo = null;
  if (sourceText) {
    const safeTop = footerSafeTopForMaster(masterName, footerSafeTopByMaster);
    if (Number.isFinite(safeTop) && sourceBase.y + sourceBase.h > safeTop + 1e-6) {
      throw new Error(`geometry.oneColumnText.sourceBox overlaps footer-safe zone for master "${masterName}"`);
    }
    sourceGeo = sourceBase;
  }

  return {
    geometry: g,
    strapText,
    sourceText,
    strapGeo,
    bodyGeo,
    safeBodyGeo,
    callouts: calloutLayout.callouts,
    calloutBoxes: calloutLayout.calloutBoxes,
    sourceGeo,
    sourceFontSize: resolvedSourceSize,
  };
}
