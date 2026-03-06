/**
 * Shared geometry helpers for bridge analysis slides.
 */

export const BRIDGE_PHASE_MIN = 1;
export const BRIDGE_PHASE_MAX = 4;

export const BRIDGE_DEFAULT_ANALYSIS_BOXES = Object.freeze([
  Object.freeze({ x: 1.0989, y: 4.8637, w: 3.8176, h: 1.5817 }),
  Object.freeze({ x: 5.0543, y: 4.8665, w: 4.0557, h: 1.5817 }),
  Object.freeze({ x: 9.2549, y: 4.8637, w: 2.9860, h: 1.5817 }),
]);

export function clampBridgePhaseCount(value) {
  const numeric = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : BRIDGE_DEFAULT_ANALYSIS_BOXES.length;
  return Math.max(BRIDGE_PHASE_MIN, Math.min(BRIDGE_PHASE_MAX, numeric));
}

/**
 * Resolve analysis boxes for a requested phase count.
 *
 * - If provided boxes exactly match requested count, use them.
 * - If requested count differs, synthesize evenly distributed boxes
 *   across the seed span to keep layout readable.
 *
 * @param {Array<{x:number,y:number,w:number,h:number}> | undefined} analysisBoxes
 * @param {number} phaseCount
 * @returns {Array<{x:number,y:number,w:number,h:number}>}
 */
export function resolveBridgeAnalysisBoxes(analysisBoxes, phaseCount) {
  const requested = clampBridgePhaseCount(phaseCount);
  if (!Array.isArray(analysisBoxes) || analysisBoxes.length === 0) {
    throw new Error('Missing required geometry.analysisBoxes for analysisBridge');
  }

  const sanitized = analysisBoxes.map((box, idx) => {
    if (!box || typeof box !== 'object') {
      throw new Error(`Invalid analysisBoxes[${idx}] geometry for analysisBridge`);
    }
    const x = Number(box.x);
    const y = Number(box.y);
    const w = Number(box.w);
    const h = Number(box.h);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      throw new Error(`Invalid analysisBoxes[${idx}] geometry for analysisBridge`);
    }
    return { x, y, w: Math.max(0.4, w), h: Math.max(0.4, h) };
  });

  if (sanitized.length === requested) return sanitized;

  const seed = sanitized;
  const left = Math.min(...seed.map((box) => box.x));
  const right = Math.max(...seed.map((box) => box.x + box.w));
  const span = Math.max(2.4, right - left);
  const baseY = seed[0].y;
  const baseH = seed[0].h;

  if (requested === 1) {
    return [{ x: left, y: baseY, w: span, h: baseH }];
  }

  const maxGap = Math.max(0, (span - requested * 0.7) / (requested - 1));
  const gap = Math.min(0.14, maxGap);
  const width = (span - gap * (requested - 1)) / requested;

  return Array.from({ length: requested }, (_, idx) => ({
    x: left + idx * (width + gap),
    y: baseY,
    w: width,
    h: baseH,
  }));
}
