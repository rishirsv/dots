import { recordFallback, recordWarning } from './diagnostics.js';

const CANONICAL_GEOMETRY_SCHEMA_VERSION = '1.0.0';
const DETECTED_LAYOUT_ONE_COLUMN_TEXT_KEY = 'One column text';

function cloneValue(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (Array.isArray(item)) {
      out[key] = item.map((entry) => cloneValue(entry));
      continue;
    }
    out[key] = cloneValue(item);
  }
  return out;
}

function isBox(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Number.isFinite(value.x) &&
      Number.isFinite(value.y) &&
      Number.isFinite(value.w) &&
      Number.isFinite(value.h),
  );
}

function normalizeBox(box) {
  if (!isBox(box)) return null;
  return {
    x: Number(box.x),
    y: Number(box.y),
    w: Number(box.w),
    h: Number(box.h),
  };
}

function pickBottomRowPair(bodyBoxes = []) {
  const boxes = (Array.isArray(bodyBoxes) ? bodyBoxes : []).map(normalizeBox).filter(Boolean);
  if (boxes.length < 2) return { left: null, right: null };

  const byY = [...boxes].sort((a, b) => b.y - a.y || a.x - b.x);
  const targetY = byY[0].y;
  const sameRow = byY.filter((box) => Math.abs(box.y - targetY) <= 0.12);
  const row = (sameRow.length >= 2 ? sameRow : byY.slice(0, 2)).sort((a, b) => a.x - b.x);
  return { left: row[0] || null, right: row[1] || null };
}

function inferSharedGeometry(typeLayouts = {}) {
  const candidates = Object.values(typeLayouts)
    .map((layout) => normalizeBox(layout?.geometry?.title))
    .filter(Boolean);
  if (candidates.length === 0) return { title: null };

  // Prefer "top title" boxes that sit in the page header band.
  const topBand = candidates.filter((box) => box.y >= 0 && box.y <= 1.2);
  const pool = topBand.length > 0 ? topBand : candidates;

  const keyCounts = new Map();
  for (const box of pool) {
    const key = `${box.x}|${box.y}|${box.w}|${box.h}`;
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  }
  const preferredKey = [...keyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const preferred =
    pool.find((box) => `${box.x}|${box.y}|${box.w}|${box.h}` === preferredKey) ||
    [...pool].sort((a, b) => a.y - b.y || a.x - b.x)[0] ||
    null;
  return { title: preferred };
}

function normalizeAnalysisWide2ColsGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  const { left: inferredLeft, right: inferredRight } = pickBottomRowPair(raw.bodyBoxes);
  const sharedTitle = normalizeBox(sharedGeometry?.title);

  let title = normalizeBox(raw.title);
  if (!title && sharedTitle) {
    title = sharedTitle;
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  let textBox = normalizeBox(raw.textBox);
  if (!textBox && normalizeBox(raw.leftText)) {
    textBox = normalizeBox(raw.leftText);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'leftText', to: 'textBox' } });
  } else if (!textBox && normalizeBox(raw.body)) {
    textBox = normalizeBox(raw.body);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'body', to: 'textBox' } });
  } else if (!textBox && inferredLeft) {
    textBox = inferredLeft;
    events.push({ reason: 'mapped_body_boxes', details: { to: 'textBox' } });
  }

  let chartBox = normalizeBox(raw.chartBox);
  if (!chartBox && normalizeBox(raw.rightChart)) {
    chartBox = normalizeBox(raw.rightChart);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'rightChart', to: 'chartBox' } });
  } else if (!chartBox && inferredRight) {
    chartBox = inferredRight;
    events.push({ reason: 'mapped_body_boxes', details: { to: 'chartBox' } });
  } else if (!chartBox && normalizeBox(raw.chart)) {
    chartBox = normalizeBox(raw.chart);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'chart', to: 'chartBox' } });
  }

  const straplineBox =
    normalizeBox(raw.straplineBox) ||
    normalizeBox(raw.strapline) ||
    normalizeBox(raw.bodyBoxes?.[0]) ||
    null;
  if (!normalizeBox(raw.straplineBox) && straplineBox) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'strapline/bodyBoxes[0]', to: 'straplineBox' } });
  }

  return {
    geometry: {
      ...raw,
      title,
      strapline: straplineBox || raw.strapline || null,
      textBox,
      chartBox,
      straplineBox,
      leftText: textBox || raw.leftText || null,
      rightChart: chartBox || raw.rightChart || null,
    },
    events,
  };
}

function normalizeAnalysisWideChartTableGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  const sharedTitle = normalizeBox(sharedGeometry?.title);

  let title = normalizeBox(raw.title);
  if (!title && sharedTitle) {
    title = sharedTitle;
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  let textBox = normalizeBox(raw.textBox);
  if (!textBox && normalizeBox(raw.body)) {
    textBox = normalizeBox(raw.body);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'body', to: 'textBox' } });
  } else if (!textBox && normalizeBox(raw.rightBody)) {
    textBox = normalizeBox(raw.rightBody);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'rightBody', to: 'textBox' } });
  } else if (!textBox && normalizeBox(raw.bodyBoxes?.[2])) {
    textBox = normalizeBox(raw.bodyBoxes?.[2]);
    events.push({ reason: 'mapped_body_boxes', details: { to: 'textBox' } });
  }

  let chartBox = normalizeBox(raw.chartBox);
  if (!chartBox && normalizeBox(raw.chart)) {
    chartBox = normalizeBox(raw.chart);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'chart', to: 'chartBox' } });
  } else if (!chartBox && normalizeBox(raw.bottomChart)) {
    chartBox = normalizeBox(raw.bottomChart);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'bottomChart', to: 'chartBox' } });
  }

  let tableBox = normalizeBox(raw.tableBox);
  if (!tableBox && normalizeBox(raw.table)) {
    tableBox = normalizeBox(raw.table);
    events.push({ reason: 'mapped_legacy_key', details: { from: 'table', to: 'tableBox' } });
  }

  const headingBox =
    normalizeBox(raw.headingBox) ||
    normalizeBox(raw.heading) ||
    normalizeBox(raw.bodyBoxes?.[1]) ||
    null;
  if (!normalizeBox(raw.headingBox) && headingBox) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'heading/bodyBoxes[1]', to: 'headingBox' } });
  }

  const straplineBox =
    normalizeBox(raw.straplineBox) ||
    normalizeBox(raw.strapline) ||
    normalizeBox(raw.bodyBoxes?.[0]) ||
    null;
  if (!normalizeBox(raw.straplineBox) && straplineBox) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'strapline/bodyBoxes[0]', to: 'straplineBox' } });
  }

  return {
    geometry: {
      ...raw,
      title,
      strapline: straplineBox || raw.strapline || null,
      textBox,
      chartBox,
      tableBox,
      headingBox,
      straplineBox,
      body: textBox || raw.body || null,
      chart: chartBox || raw.chart || null,
      table: tableBox || raw.table || null,
      heading: headingBox || raw.heading || null,
    },
    events,
  };
}

function normalizeTwoColumnGeometry(rawGeometry = {}) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  const left = normalizeBox(raw.left) || normalizeBox(raw.leftBody) || normalizeBox(raw.bodyBoxes?.[0]) || null;
  const right = normalizeBox(raw.right) || normalizeBox(raw.rightBody) || normalizeBox(raw.bodyBoxes?.[1]) || null;

  if (!normalizeBox(raw.left) && left) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'leftBody/bodyBoxes[0]', to: 'left' } });
  }
  if (!normalizeBox(raw.right) && right) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'rightBody/bodyBoxes[1]', to: 'right' } });
  }

  return {
    geometry: {
      ...raw,
      left,
      right,
      leftBody: left || raw.leftBody || null,
      rightBody: right || raw.rightBody || null,
    },
    events,
  };
}

function normalizeOneColumnGeometry(rawGeometry = {}, sharedGeometry = null, detectedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const detected = cloneValue(detectedGeometry) || {};
  const events = [];
  const body =
    normalizeBox(raw.body) ||
    normalizeBox(raw.topText) ||
    normalizeBox(raw.leftText) ||
    normalizeBox(raw.bodyBoxes?.[0]) ||
    normalizeBox(detected.body) ||
    normalizeBox(detected.bodyBoxes?.[0]) ||
    null;
  if (!normalizeBox(raw.body) && body) {
    const from = normalizeBox(detected.body) || normalizeBox(detected.bodyBoxes?.[0])
      ? 'detectedLayoutGeometry'
      : 'topText/leftText/bodyBoxes[0]';
    events.push({ reason: 'mapped_legacy_key', details: { from, to: 'body' } });
  }
  let title = normalizeBox(raw.title) || normalizeBox(detected.title) || null;
  if (!title && normalizeBox(sharedGeometry?.title)) {
    title = normalizeBox(sharedGeometry?.title);
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  return {
    geometry: {
      ...raw,
      title,
      body,
    },
    events,
  };
}

function normalizeContentsGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  const topRow = normalizeBox(raw.topRow) || normalizeBox(raw.bodyBoxes?.[0]) || null;
  const bottomRow = normalizeBox(raw.bottomRow) || normalizeBox(raw.bodyBoxes?.[1]) || null;
  let title = normalizeBox(raw.title);
  if (!title && normalizeBox(sharedGeometry?.title)) {
    title = normalizeBox(sharedGeometry?.title);
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }
  if (!normalizeBox(raw.topRow) && topRow) {
    events.push({ reason: 'mapped_body_boxes', details: { to: 'topRow' } });
  }
  if (!normalizeBox(raw.bottomRow) && bottomRow) {
    events.push({ reason: 'mapped_body_boxes', details: { to: 'bottomRow' } });
  }
  return {
    geometry: {
      ...raw,
      title,
      topRow,
      bottomRow,
    },
    events,
  };
}

function normalizeCoverGeometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  let title = normalizeBox(raw.title);
  if (!title && normalizeBox(sharedGeometry?.title)) {
    title = normalizeBox(sharedGeometry?.title);
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }
  const photo = normalizeBox(raw.photo) || normalizeBox(raw.picture) || normalizeBox(raw.window) || null;
  if (!normalizeBox(raw.photo) && photo) {
    events.push({ reason: 'mapped_legacy_key', details: { from: 'picture/window', to: 'photo' } });
  }
  return {
    geometry: {
      ...raw,
      title,
      photo,
      picture: photo || raw.picture || null,
      window: normalizeBox(raw.window) || photo || null,
    },
    events,
  };
}

function normalizeTitleStrapline4Geometry(rawGeometry = {}, sharedGeometry = null) {
  const raw = cloneValue(rawGeometry) || {};
  const events = [];
  let title = normalizeBox(raw.title);
  if (!title && normalizeBox(sharedGeometry?.title)) {
    title = normalizeBox(sharedGeometry?.title);
    events.push({ reason: 'mapped_shared_geometry', details: { from: 'shared.title', to: 'title' } });
  }

  let columns = Array.isArray(raw.columns) ? raw.columns.map(normalizeBox).filter(Boolean) : [];
  if (columns.length === 0 && Array.isArray(raw.bodyBoxes)) {
    const boxes = raw.bodyBoxes.map(normalizeBox).filter(Boolean);
    columns = boxes
      .filter((box) => box.h > 1.0)
      .sort((a, b) => a.x - b.x)
      .slice(0, 4);
    if (columns.length > 0) {
      events.push({ reason: 'mapped_body_boxes', details: { to: 'columns' } });
    }
  }

  return {
    geometry: {
      ...raw,
      title,
      columns,
    },
    events,
  };
}

function normalizeGeometryByType(slideType, rawGeometry = null, options = {}) {
  const raw = cloneValue(rawGeometry) || {};
  const sharedGeometry = options?.sharedGeometry || null;

  if (slideType === 'analysisWideChart2ColsText') {
    return normalizeAnalysisWide2ColsGeometry(raw, sharedGeometry);
  }
  if (slideType === 'analysisWideChartTableText') {
    return normalizeAnalysisWideChartTableGeometry(raw, sharedGeometry);
  }
  if (slideType === 'twoColumnText') {
    return normalizeTwoColumnGeometry(raw);
  }
  if (slideType === 'oneColumnText') {
    const detectedLayouts = options?.detectedLayoutGeometry || {};
    const detectedOneColumn = detectedLayouts?.[DETECTED_LAYOUT_ONE_COLUMN_TEXT_KEY] || null;
    return normalizeOneColumnGeometry(raw, sharedGeometry, detectedOneColumn);
  }
  if (slideType === 'contents') {
    return normalizeContentsGeometry(raw, sharedGeometry);
  }
  if (slideType === 'cover') {
    return normalizeCoverGeometry(raw, sharedGeometry);
  }
  if (slideType === 'titleStrapline4TextBoxes') {
    return normalizeTitleStrapline4Geometry(raw, sharedGeometry);
  }
  return { geometry: raw, events: [] };
}

function notifyAdapterEvents(slideType, templateLayout, events = []) {
  if (!Array.isArray(events) || events.length === 0) return;
  for (const event of events) {
    recordFallback(slideType, `geometry_adapter:${event.reason}`, {
      templateLayout,
      ...(event?.details || {}),
    });
  }
}

function describeBounds(dimensions = {}) {
  const width = Number(dimensions?.w);
  const height = Number(dimensions?.h);
  return {
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
  };
}

function isWithinSlideBounds(box, dimensions = {}) {
  const { width, height } = describeBounds(dimensions);
  if (width === null || height === null) return true;
  const epsilon = 0.02;
  if (box.x < -epsilon || box.y < -epsilon) return false;
  if (box.x + box.w > width + epsilon) return false;
  if (box.y + box.h > height + epsilon) return false;
  return true;
}

function validateBoxTree(value, slideType, templateLayout, path, dimensions) {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => validateBoxTree(item, slideType, templateLayout, `${path}[${idx}]`, dimensions));
    return;
  }
  if (!value || typeof value !== 'object') return;

  if (isBox(value)) {
    const box = normalizeBox(value);
    if (box.w <= 0 || box.h <= 0) {
      throw new Error(
        `Layout geometry for "${slideType}" (${templateLayout || 'unknown-layout'}) has non-positive size at ${path} (w=${box.w}, h=${box.h})`,
      );
    }
    if (!isWithinSlideBounds(box, dimensions)) {
      throw new Error(
        `Layout geometry for "${slideType}" (${templateLayout || 'unknown-layout'}) has out-of-bounds box at ${path}`,
      );
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    validateBoxTree(child, slideType, templateLayout, `${path}.${key}`, dimensions);
  }
}

function hasRequiredGeometryValue(geometry = {}, key) {
  const value = geometry?.[key];
  if (Array.isArray(value)) return value.length > 0 && value.every((entry) => isBox(entry));
  return isBox(value);
}

function requiredGeometryKeys(slideType, slideRegistry = null) {
  return slideRegistry?.get?.(slideType)?.requiredGeometry || [];
}

function assertRequiredGeometry(slideType, templateLayout, geometry = {}, slideRegistry = null) {
  const requiredKeys = requiredGeometryKeys(slideType, slideRegistry);
  if (!Array.isArray(requiredKeys) || requiredKeys.length === 0) return;

  const missing = requiredKeys.filter((key) => !hasRequiredGeometryValue(geometry, key));
  if (missing.length === 0) return;

  recordFallback(slideType, 'geometry_adapter:missing_required_keys', {
    templateLayout,
    missing,
    available: Object.keys(geometry || {}),
  });
  const message =
    `Layout geometry for "${slideType}" (${templateLayout || 'unknown-layout'}) is missing required keys: ${missing.join(', ')}`;
  recordWarning(message);
  throw new Error(message);
}

export function normalizeGeometry(slideType, rawGeometry = null, options = {}) {
  return normalizeGeometryByType(slideType, rawGeometry, options);
}

export function buildLayoutContract(templatePackage = {}, options = {}) {
  const typeLayouts = templatePackage?.layouts?.types || {};
  const detectedLayoutGeometry = templatePackage?.layouts?.detectedLayoutGeometry || {};
  const dimensions = options?.dimensions || templatePackage?.tokens?.dimensions || null;
  const slideRegistry = options?.slideRegistry || null;
  const sharedGeometry = inferSharedGeometry(typeLayouts);
  const byType = {};

  for (const [slideType, layout] of Object.entries(typeLayouts)) {
    const { geometry, events } = normalizeGeometryByType(slideType, layout?.geometry || {}, {
      sharedGeometry,
      detectedLayoutGeometry,
    });
    notifyAdapterEvents(slideType, layout?.templateLayout || null, events);
    validateBoxTree(geometry, slideType, layout?.templateLayout || null, '$', dimensions);
    assertRequiredGeometry(slideType, layout?.templateLayout || null, geometry, slideRegistry);

    byType[slideType] = {
      schemaVersion: CANONICAL_GEOMETRY_SCHEMA_VERSION,
      boxes: geometry,
      templateLayout: layout?.templateLayout || null,
    };
  }

  return {
    schemaVersion: CANONICAL_GEOMETRY_SCHEMA_VERSION,
    byType,
    get(slideType) {
      return byType[slideType] || {
        schemaVersion: CANONICAL_GEOMETRY_SCHEMA_VERSION,
        boxes: {},
        templateLayout: null,
      };
    },
  };
}

export function resolveSlideGeometry(layoutContract, slideType) {
  const contract = layoutContract?.get?.(slideType);
  const boxes = contract?.boxes || {};
  if (!boxes || Object.keys(boxes).length === 0) {
    throw new Error(`Missing layout contract geometry for slide type "${slideType}"`);
  }
  return boxes;
}

export { CANONICAL_GEOMETRY_SCHEMA_VERSION };
