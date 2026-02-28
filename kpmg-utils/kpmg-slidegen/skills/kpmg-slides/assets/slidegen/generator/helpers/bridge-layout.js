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

function toFinite(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function clampBridgePhaseCount(value) {
  const numeric = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : BRIDGE_DEFAULT_ANALYSIS_BOXES.length;
  return Math.max(BRIDGE_PHASE_MIN, Math.min(BRIDGE_PHASE_MAX, numeric));
}

function sanitizeBox(raw, fallback) {
  return {
    x: toFinite(raw?.x, fallback.x),
    y: toFinite(raw?.y, fallback.y),
    w: Math.max(0.4, toFinite(raw?.w, fallback.w)),
    h: Math.max(0.4, toFinite(raw?.h, fallback.h)),
  };
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
  const raw = Array.isArray(analysisBoxes) ? analysisBoxes : [];
  const fallback = BRIDGE_DEFAULT_ANALYSIS_BOXES;

  const sanitized = raw
    .map((box, idx) => sanitizeBox(box, fallback[idx] || fallback[fallback.length - 1]))
    .filter((box) => box.w > 0 && box.h > 0);

  if (sanitized.length === requested) {
    return sanitized;
  }

  if (requested === BRIDGE_DEFAULT_ANALYSIS_BOXES.length && sanitized.length === 0) {
    return BRIDGE_DEFAULT_ANALYSIS_BOXES.map((box) => ({ ...box }));
  }

  const seed = sanitized.length > 0 ? sanitized : BRIDGE_DEFAULT_ANALYSIS_BOXES;
  const left = Math.min(...seed.map((box) => box.x));
  const right = Math.max(...seed.map((box) => box.x + box.w));
  const span = Math.max(2.4, right - left);
  const baseY = seed[0]?.y ?? BRIDGE_DEFAULT_ANALYSIS_BOXES[0].y;
  const baseH = seed[0]?.h ?? BRIDGE_DEFAULT_ANALYSIS_BOXES[0].h;

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
