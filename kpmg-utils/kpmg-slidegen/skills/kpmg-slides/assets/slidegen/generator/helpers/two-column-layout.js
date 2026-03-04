import { computeDynamicStraplineBox } from './text.js';
import { clampToMasterFooter, computeStrapShift, resolveLayoutMetrics, shiftBox } from './layout.js';
import { requireGeometryBox } from '../runtime/geometry-contract.js';

export const TWO_COLUMN_LAYOUT_DEFAULTS = Object.freeze({
  typography: {
    straplineFontSize: 10,
  },
});

export function computeTwoColumnLayoutGeometry({
  geometry,
  masterName = 'KPMG_WHITE',
  footerSafeTopByMaster = null,
  theme = null,
  strapline,
  straplineFontSize,
} = {}) {
  const g = geometry || {};
  const layoutMetrics = resolveLayoutMetrics(theme);
  const resolvedStraplineSize = Number.isFinite(straplineFontSize)
    ? Number(straplineFontSize)
    : TWO_COLUMN_LAYOUT_DEFAULTS.typography.straplineFontSize;
  const titleGeo = requireGeometryBox(g.titleBox, { slideType: 'twoColumnText', key: 'titleBox' });
  const strapText = strapline;
  const strapBase = requireGeometryBox(g.straplineBox, { slideType: 'twoColumnText', key: 'straplineBox' });
  const leftBase = requireGeometryBox(g.leftBox, { slideType: 'twoColumnText', key: 'leftBox' });
  const rightBase = requireGeometryBox(g.rightBox, { slideType: 'twoColumnText', key: 'rightBox' });

  const strapBox = strapText
    ? computeDynamicStraplineBox({
        strapline: strapText,
        titleGeo,
        strapBase,
        defaultStrapGeo: strapBase,
        fontSize: resolvedStraplineSize,
      })
    : null;
  const shift = computeStrapShift(strapBox, Math.min(leftBase.y, rightBase.y), layoutMetrics.strapGap);
  const leftGeo = shiftBox(leftBase, shift);
  const rightGeo = shiftBox(rightBase, shift);
  const safeLeftGeo = clampToMasterFooter(leftGeo, masterName, 0, footerSafeTopByMaster);
  const safeRightGeo = clampToMasterFooter(rightGeo, masterName, 0, footerSafeTopByMaster);

  return {
    geometry: g,
    strapText,
    strapBox,
    leftGeo,
    rightGeo,
    safeLeftGeo,
    safeRightGeo,
  };
}
