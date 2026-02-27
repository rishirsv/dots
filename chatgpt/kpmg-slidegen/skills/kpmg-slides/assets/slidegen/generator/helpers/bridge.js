/**
 * Bridge data helpers shared by validation and rendering.
 */

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeStepKind(kind) {
  const normalized = String(kind || 'delta').trim().toLowerCase();
  return normalized === 'subtotal' ? 'subtotal' : 'delta';
}

/**
 * Validate and normalize bridge data.
 *
 * @param {unknown} bridge
 * @param {{ defaultTolerance?: number }} [options]
 * @returns {{
 *   errors: string[],
 *   warnings: string[],
 *   normalized: null | {
 *     startLabel: string,
 *     endLabel: string,
 *     startValue: number,
 *     endValue: number,
 *     tolerance: number,
 *     decimals: number,
 *     unitPrefix: string,
 *     unitSuffix: string,
 *     steps: Array<{ label: string, kind: 'delta'|'subtotal', delta: number, value: number }>,
 *     expectedEnd: number,
 *     difference: number
 *   }
 * }}
 */
export function validateBridgeSpec(bridge, { defaultTolerance = 0.01 } = {}) {
  const errors = [];
  const warnings = [];
  if (!isPlainObject(bridge)) {
    return { errors: ['must be an object'], warnings, normalized: null };
  }

  const startValue = toNumber(bridge.startValue);
  const endValue = toNumber(bridge.endValue);
  if (startValue === null) errors.push('startValue must be a finite number');
  if (endValue === null) errors.push('endValue must be a finite number');

  const rawSteps = Array.isArray(bridge.steps) ? bridge.steps : null;
  if (!rawSteps || rawSteps.length === 0) {
    errors.push('steps must be a non-empty array');
  }

  let tolerance = toNumber(bridge.tolerance);
  if (tolerance === null || tolerance < 0) tolerance = defaultTolerance;
  const decimals = Math.max(0, Math.min(4, Number.isFinite(Number(bridge.decimals)) ? Math.floor(Number(bridge.decimals)) : 0));
  let unitPrefix = String(bridge.unitPrefix || '').trim();
  let unitSuffix = String(bridge.unitSuffix || '').trim();
  if (!unitPrefix && !unitSuffix && String(bridge.unit || '').trim()) {
    const rawUnit = String(bridge.unit).trim();
    if (rawUnit.startsWith('$')) {
      // Treat currency-like unit as a prefix by default.
      // Example: "$" or "$m".
      unitPrefix = '$';
      if (rawUnit === '$') {
        unitSuffix = '';
      } else {
        unitSuffix = rawUnit.slice(1).trim() ? ` ${rawUnit.slice(1).trim()}` : '';
      }
    } else {
      unitSuffix = ` ${rawUnit}`;
    }
  }

  const normalizedSteps = [];
  if (rawSteps && startValue !== null) {
    let running = startValue;
    rawSteps.forEach((rawStep, idx) => {
      if (!isPlainObject(rawStep)) {
        errors.push(`steps[${idx}] must be an object`);
        return;
      }
      const label = String(rawStep.label || rawStep.name || '').trim();
      if (!label) {
        errors.push(`steps[${idx}] is missing label`);
        return;
      }
      const kind = normalizeStepKind(rawStep.kind);

      if (kind === 'subtotal') {
        const subtotalValue = toNumber(rawStep.value);
        if (subtotalValue === null) {
          errors.push(`steps[${idx}] subtotal requires numeric value`);
          return;
        }
        const delta = subtotalValue - running;
        running = subtotalValue;
        normalizedSteps.push({ label, kind, delta, value: subtotalValue });
        return;
      }

      const delta = toNumber(rawStep.delta);
      if (delta === null) {
        errors.push(`steps[${idx}] delta requires numeric delta`);
        return;
      }
      running += delta;
      normalizedSteps.push({ label, kind, delta, value: running });
    });
  }

  if (errors.length > 0 || startValue === null || endValue === null) {
    return { errors, warnings, normalized: null };
  }

  const expectedEnd = normalizedSteps.length
    ? normalizedSteps[normalizedSteps.length - 1].value
    : startValue;
  const difference = expectedEnd - endValue;
  if (Math.abs(difference) > tolerance) {
    errors.push(
      `bridge does not reconcile within tolerance (${expectedEnd} vs ${endValue}, diff ${difference.toFixed(2)}, tolerance ${tolerance})`,
    );
  }
  if (normalizedSteps.length > 24) {
    warnings.push('bridge has more than 24 steps; labels may become unreadable');
  }

  return {
    errors,
    warnings,
    normalized: {
      startLabel: String(bridge.startLabel || 'Start').trim() || 'Start',
      endLabel: String(bridge.endLabel || 'End').trim() || 'End',
      startValue,
      endValue,
      tolerance,
      decimals,
      unitPrefix,
      unitSuffix,
      steps: normalizedSteps,
      expectedEnd,
      difference,
    },
  };
}

/**
 * Build ordered bars (start, steps, end) from a normalized bridge.
 *
 * @param {{
 *   startLabel: string,
 *   endLabel: string,
 *   startValue: number,
 *   endValue: number,
 *   steps: Array<{ label: string, kind: 'delta'|'subtotal', delta: number, value: number }>
 * }} bridge
 * @returns {Array<{type:'total'|'delta'|'subtotal',label:string,start:number,end:number,delta:number}>}
 */
export function buildBridgeBars(bridge) {
  const bars = [
    {
      type: 'total',
      label: bridge.startLabel || 'Start',
      start: 0,
      end: Number(bridge.startValue || 0),
      delta: Number(bridge.startValue || 0),
    },
  ];

  let previous = Number(bridge.startValue || 0);
  for (const step of bridge.steps || []) {
    if (step.kind === 'subtotal') {
      bars.push({
        type: 'subtotal',
        label: step.label,
        start: 0,
        end: step.value,
        delta: step.delta,
      });
      previous = step.value;
      continue;
    }

    const next = previous + step.delta;
    bars.push({
      type: 'delta',
      label: step.label,
      start: previous,
      end: next,
      delta: step.delta,
    });
    previous = next;
  }

  bars.push({
    type: 'total',
    label: bridge.endLabel || 'End',
    start: 0,
    end: Number(bridge.endValue || 0),
    delta: Number(bridge.endValue || 0) - previous,
  });
  return bars;
}

/**
 * Format bridge values for labels.
 *
 * @param {number} value
 * @param {{
 *   decimals?: number,
 *   unitPrefix?: string,
 *   unitSuffix?: string,
 *   useParensForNegatives?: boolean,
 *   showPlus?: boolean
 * }} [options]
 * @returns {string}
 */
export function formatBridgeValue(
  value,
  { decimals = 0, unitPrefix = '', unitSuffix = '', useParensForNegatives = true, showPlus = false } = {},
) {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 0;
  const abs = Math.abs(numeric).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const base = `${unitPrefix}${abs}${unitSuffix}`;
  if (numeric < 0) {
    return useParensForNegatives ? `(${base})` : `-${base}`;
  }
  if (showPlus && numeric > 0) return `+${base}`;
  return base;
}
