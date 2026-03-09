/**
 * Helpers for business overview structure diagrams.
 */

const ALLOWED_TIERS = new Set(['top', 'mid', 'bottom']);

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeTierName(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw === 'top') return 'top';
  if (raw === 'mid') return 'mid';
  if (raw === 'bottom') return 'bottom';
  return '';
}

function normalizePct(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    const scaled = Math.abs(value) <= 1 ? value * 100 : value;
    const rounded = Math.abs(scaled % 1) < 0.001 ? scaled.toFixed(0) : scaled.toFixed(1);
    return `${rounded}%`;
  }
  const text = String(value).trim();
  if (!text) return '';
  if (text.endsWith('%')) return text;
  return text;
}

function normalizeNode(item, tier, idx, errors) {
  if (typeof item === 'string') {
    const label = item.trim();
    if (!label) {
      errors.push(`${tier}Tier[${idx}] label must be non-empty`);
      return null;
    }
    return { label, pct: '' };
  }

  if (!isPlainObject(item)) {
    errors.push(`${tier}Tier[${idx}] must be a string or object`);
    return null;
  }

  const label = String(item.label ?? '').trim();
  if (!label) {
    errors.push(`${tier}Tier[${idx}] is missing label`);
    return null;
  }

  const pct = normalizePct(item.pct);
  return { label, pct };
}

function normalizeTier(rawTier, tier, { required = false, min = 0, max = 99 } = {}, errors = []) {
  const source = Array.isArray(rawTier) ? rawTier : [];
  if (required && source.length === 0) {
    errors.push(`${tier}Tier must be a non-empty array`);
    return [];
  }

  const nodes = source
    .map((item, idx) => normalizeNode(item, tier, idx, errors))
    .filter(Boolean);

  if (nodes.length < min) {
    errors.push(`${tier}Tier requires at least ${min} node(s)`);
  }
  if (nodes.length > max) {
    errors.push(`${tier}Tier supports at most ${max} node(s)`);
  }
  return nodes;
}

function autoLinks(fromTier, toTier, fromCount, toCount) {
  const links = [];
  if (fromCount <= 0 || toCount <= 0) return links;

  for (let i = 0; i < fromCount; i += 1) {
    const targetIndex = toCount === 1 ? 0 : Math.round((i * (toCount - 1)) / Math.max(1, fromCount - 1));
    links.push({ fromTier, fromIndex: i, toTier, toIndex: targetIndex, label: '' });
  }
  return links;
}

function normalizeLinks(rawLinks, counts, errors) {
  if (!Array.isArray(rawLinks) || rawLinks.length === 0) {
    const topToMid = counts.mid > 0 ? autoLinks('top', 'mid', counts.top, counts.mid) : [];
    const midToBottom = counts.mid > 0
      ? autoLinks('mid', 'bottom', counts.mid, counts.bottom)
      : autoLinks('top', 'bottom', counts.top, counts.bottom);
    return [...topToMid, ...midToBottom];
  }

  const out = [];
  rawLinks.forEach((item, idx) => {
    if (!isPlainObject(item)) {
      errors.push(`links[${idx}] must be an object`);
      return;
    }

    const fromTier = normalizeTierName(item.fromTier);
    const toTier = normalizeTierName(item.toTier);
    if (!ALLOWED_TIERS.has(fromTier)) {
      errors.push(`links[${idx}] fromTier must be one of top|mid|bottom`);
      return;
    }
    if (!ALLOWED_TIERS.has(toTier)) {
      errors.push(`links[${idx}] toTier must be one of top|mid|bottom`);
      return;
    }
    if (fromTier === toTier) {
      errors.push(`links[${idx}] must connect different tiers`);
      return;
    }

    const fromIndex = Number.isFinite(Number(item.fromIndex)) ? Math.floor(Number(item.fromIndex)) : -1;
    const toIndex = Number.isFinite(Number(item.toIndex)) ? Math.floor(Number(item.toIndex)) : -1;

    const fromMax = counts[fromTier];
    const toMax = counts[toTier];
    if (fromIndex < 0 || fromIndex >= fromMax) {
      errors.push(`links[${idx}] fromIndex is out of range for ${fromTier}Tier`);
      return;
    }
    if (toIndex < 0 || toIndex >= toMax) {
      errors.push(`links[${idx}] toIndex is out of range for ${toTier}Tier`);
      return;
    }

    out.push({
      fromTier,
      fromIndex,
      toTier,
      toIndex,
      label: String(item.label || '').trim(),
    });
  });

  return out;
}

function normalizePerimeter(raw) {
  const perimeter = isPlainObject(raw) ? raw : {};
  const enabled = perimeter.enabled !== false;
  return {
    enabled,
    label: String(perimeter.label || 'Transaction perimeter').trim() || 'Transaction perimeter',
    subLabel: String(perimeter.subLabel || 'Entities under FDD scope of work').trim() || 'Entities under FDD scope of work',
  };
}

function structureParts(structure = {}) {
  const top = Array.isArray(structure.topTier) ? structure.topTier : [];
  const mid = Array.isArray(structure.midTier) ? structure.midTier : [];
  const bottom = Array.isArray(structure.bottomTier) ? structure.bottomTier : [];
  const links = Array.isArray(structure.links) ? structure.links : [];
  return {
    top,
    mid,
    bottom,
    links,
    perimeter: isPlainObject(structure.perimeter) ? structure.perimeter : {},
  };
}

export function countBusinessStructureItems(structure = {}) {
  const { top, mid, bottom, links } = structureParts(structure);
  return top.length + mid.length + bottom.length + links.length;
}

export function countBusinessStructureCharacters(structure = {}) {
  const { top, mid, bottom, links, perimeter } = structureParts(structure);
  const nodeText = [...top, ...mid, ...bottom]
    .map((node) => `${String(node?.label || '').trim()} ${String(node?.pct || '').trim()}`.trim())
    .join(' ');
  const linkText = links.map((link) => String(link?.label || '').trim()).join(' ');
  const perimText = `${String(perimeter?.label || '').trim()} ${String(perimeter?.subLabel || '').trim()}`.trim();
  return `${nodeText} ${linkText} ${perimText}`.trim().length;
}

/**
 * Validate and normalize business structure diagram input.
 */
export function validateBusinessStructureSpec(structure) {
  const errors = [];
  const warnings = [];

  if (!isPlainObject(structure)) {
    return { errors: ['must be an object'], warnings, normalized: null };
  }

  const topTier = normalizeTier(structure.topTier, 'top', { required: true, min: 2, max: 6 }, errors);
  const midTier = normalizeTier(structure.midTier, 'mid', { required: false, min: 0, max: 4 }, errors);
  const bottomTier = normalizeTier(structure.bottomTier, 'bottom', { required: true, min: 1, max: 5 }, errors);

  if (topTier.length > 0 && bottomTier.length > 0 && topTier.length + midTier.length + bottomTier.length > 12) {
    warnings.push('structure has more than 12 nodes; labels may become unreadable');
  }

  const counts = {
    top: topTier.length,
    mid: midTier.length,
    bottom: bottomTier.length,
  };

  const links = normalizeLinks(structure.links, counts, errors);
  const perimeter = normalizePerimeter(structure.perimeter);

  if (errors.length > 0) {
    return { errors, warnings, normalized: null };
  }

  return {
    errors,
    warnings,
    normalized: {
      topTier,
      midTier,
      bottomTier,
      links,
      perimeter,
    },
  };
}
