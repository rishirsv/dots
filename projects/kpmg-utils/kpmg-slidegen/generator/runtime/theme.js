const DEFAULT_DIMENSIONS = Object.freeze({ w: 13.333, h: 7.5 });

/**
 * Convert centimeters to points (72 points per inch, 2.54 cm per inch).
 * @param {number} cm
 * @returns {number}
 */
function cmToPt(cm) {
  return (Number(cm) / 2.54) * 72;
}

const DEFAULT_THEME_SPEC = Object.freeze({
  fonts: {
    heading: 'Arial',
    body: 'Arial',
    fallback: 'Arial',
  },
  colors: {
    primary: '1E49E2',
    kpmgBlue: '00338D',
    kpmgDarkBlue: '00338D',
    kpmgCyan: '00B8F5',
    kpmgPurple: '7213EA',
    pink: 'FD349C',
    darkNavy: '0C233C',
    white: 'FFFFFF',
    black: '000000',
    lightGrey: 'E5E5E5',
    orange: 'FF6D00',
    link: '00B8F5',
    bg: 'FFFFFF',
    neutral100: 'F3F4F6',
    neutral300: 'D9D9D9',
    neutral: {
      200: 'E5E7EB',
      300: 'D9D9D9',
    },
    tableHeader: '1E49E2',
    priority: {
      high: '1E49E2',
      medium: '666666',
      low: '666666',
    },
    chart: {
      background: 'FFFFFF',
    },
  },
  type: {
    title: 32,
    strapline: 10,
    body: 10,
    source: 6,
    dividerNumber: 48,
    dividerTitle: 24,
  },
  spacing: {
    xs: 0.06,
    sm: 0.1,
    md: 0.18,
    lg: 0.28,
    sectionGap: 0.18,
    strapGap: 0.06,
    sourceTopOffset: 0.05,
    sourceBottomGap: 0.06,
  },
  lines: {
    dividerPt: 1.5,
    gridPt: 0.75,
    sectionDividerPt: 1.5,
  },
  table: {
    rowHeightCap: 0.9,
  },
  chart: {
    palette: ['00338D', '1E49E2', '00B8F5', '7213EA', 'FD349C', '0C233C', '00A651', '005EB8', 'FF6D00'],
    fontSizes: {
      legend: 7,
      label: 8,
      axis: 7,
      dataLabel: 7,
    },
  },
  textBox: {
    wrap: true,
    marginPt: [cmToPt(0.13), cmToPt(0.25), cmToPt(0.13), cmToPt(0.2)],
  },
  components: {
    bullets: {
      indentPt: cmToPt(0.63),
      paraSpaceBeforePt: 0,
      paraSpaceAfterPt: 6,
      lineSpacingPt: 12,
      prdHeaderGapBeforePt: 14,
    },
    text: {
      paraSpaceAfter: {
        body: 6,
        source: 0,
      },
      margin: {
        none: 0,
      },
    },
    cover: {
      titleFontSize: 40,
      subtitleFontSize: 14,
    },
    contents: {
      fontSizes: {
        sectionNo: 34,
        sectionTitle: 12,
        pageRange: 10,
      },
      sectionNumberHeight: 0.52,
      sectionTitleOffsetY: 0.57,
      pageRangeOffsetY: 0.83,
      bodyOffsetWithPageRangeY: 1.12,
      bodyOffsetWithoutPageRangeY: 0.9,
    },
    contentsSlide: {
      sectionGap: 0.18,
    },
    table: {
      rowHeightCap: 0.9,
    },
    analysisNarrowTable: {
      fullTableWidth: 11.1596,
      tableChrome: {
        titleBarHeight: 0.24,
        separatorHeight: 0.02,
      },
      fontSizes: {
        tableHeading: 9,
      },
      lines: {
        titleBarPt: 0,
        separatorPt: 1.2,
        borderOuterPt: 0.6,
        borderRowPt: 0.5,
        borderColPt: 0.35,
        headerSeparatorPt: 1,
      },
      marginPt: {
        heading: [2, 4, 2, 4],
        cell: [1, 4, 1, 4],
      },
    },
    analysisWideChart: {
      annotation: {
        titleSize: 7.5,
        textSize: 7.5,
        borderPt: 0.8,
        marginPt: [2, 3, 2, 3],
        titleParaSpaceAfter: 1,
      },
      headingBand: {
        linePt: 1,
      },
      chart: {
        dataBorderPt: 0.5,
      },
    },
    analysisBridge: {
      typography: {
        bridgeValue: 6.5,
        bridgeLabel: 6,
        phaseBadge: 8,
        analysisBadge: 7,
        analysisBodyDelta: -1,
        error: 9,
      },
      colors: {
        connector: 'A7A9AC',
        baseline: 'C8CDD3',
      },
      lines: {
        baselinePt: 0.6,
        barEdgePt: 0.2,
        connectorPt: 0.5,
        phaseBracketPt: 1,
        phaseBadgePt: 0.5,
        analysisBoxPt: 1,
        analysisBadgePt: 0.5,
        strapBandPt: 0.5,
      },
    },
    businessOverview: {
      lines: {
        perimeterPt: 1,
        nodeEdgePt: 0.6,
        connectorPt: 0.8,
      },
    },
    callouts: {
      linePt: 1,
      headingSize: 8,
      bodySize: 7.5,
      connectorPt: 0.9,
      marginPt: [3, 4, 3, 4],
      text: {
        paraSpaceAfter: 2,
        lineSpacing: 9,
      },
    },
    backCover: {
      defaultWebsiteText: 'www.kpmg.com',
      icon: {
        xStart: 1.09,
        xGap: 0.43,
        y: 5.9,
        w: 0.36,
        h: 0.36,
      },
      contacts: {
        xStart: 1.24,
        xGap: 2.55,
        y: 3.03,
        columnWidth: 2.55,
      },
      legal: {
        line2: {
          x: 1.09,
          y: 6.92,
          w: 10.5,
          h: 0.2,
        },
        classification: {
          x: 1.09,
          y: 7.36,
          w: 3.5,
          h: 0.1,
        },
      },
      fontSizes: {
        heading: 30,
        contactName: 13,
        contactDetails: 11,
        disclaimer: 9,
        legalBody: 8,
        classification: 8,
      },
    },
  },
});

export const THEME_SCHEMA_VERSION = '1.0.0';

/**
 * Return the first non-empty string from candidate values.
 * @param {...unknown} values
 * @returns {string}
 */
function firstNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return '';
}

/**
 * Return the first finite number from candidate values.
 * @param {...unknown} values
 * @returns {number|null}
 */
function firstFiniteNumber(...values) {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
}

/**
 * Resolve canonical type scale from type + typeSizes inputs.
 * @param {object} type
 * @param {object} typeSizes
 * @param {object} fallback
 * @returns {{title:number,strapline:number,body:number,source:number,dividerNumber:number,dividerTitle:number}}
 */
function resolveTypeScale(type = {}, typeSizes = {}, fallback = DEFAULT_THEME_SPEC.type) {
  return {
    ...fallback,
    ...type,
    title: firstFiniteNumber(type.title, typeSizes.slideTitle, typeSizes.title, fallback.title) ?? fallback.title,
    strapline: firstFiniteNumber(type.strapline, typeSizes.strapline, fallback.strapline) ?? fallback.strapline,
    body: firstFiniteNumber(type.body, typeSizes.body, fallback.body) ?? fallback.body,
    source: firstFiniteNumber(type.source, typeSizes.source, fallback.source) ?? fallback.source,
    dividerNumber: firstFiniteNumber(type.dividerNumber, fallback.dividerNumber) ?? fallback.dividerNumber,
    dividerTitle: firstFiniteNumber(type.dividerTitle, fallback.dividerTitle) ?? fallback.dividerTitle,
  };
}

/**
 * Map canonical type scale to legacy typeSizes keys consumed by builders.
 * @param {object} type
 * @returns {{slideTitle:number,strapline:number,body:number,source:number}}
 */
function buildTypeSizes(type = {}) {
  return {
    slideTitle: type.title,
    strapline: type.strapline,
    body: type.body,
    source: type.source,
  };
}

/**
 * Deep-merge plain object values; non-objects are overwritten.
 * @param  {...unknown} objs
 * @returns {object}
 */
function mergeObjects(...objs) {
  const out = {};
  for (const obj of objs) {
    if (!obj || typeof obj !== 'object') continue;
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        out[key] = mergeObjects(out[key], value);
      } else {
        out[key] = value;
      }
    }
  }
  return out;
}

/**
 * Recursively freeze object/array values.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.freeze(value);
  }
  for (const item of Object.values(value)) deepFreeze(item);
  return Object.freeze(value);
}

/**
 * Return true when the input already matches the resolved runtime theme shape.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isResolvedTheme(value) {
  return Boolean(value && typeof value === 'object' && value.__resolvedTheme === true);
}

/**
 * Assert the runtime theme contains required keys used by rendering code.
 * @param {object} theme
 * @returns {void}
 */
export function assertThemeContract(theme) {
  const missing = [];
  const requireString = (path, value) => {
    if (typeof value !== 'string' || value.trim().length === 0) missing.push(path);
  };
  const requireFinite = (path, value) => {
    if (!Number.isFinite(Number(value))) missing.push(path);
  };

  requireString('fonts.heading', theme?.fonts?.heading);
  requireString('fonts.body', theme?.fonts?.body);
  requireString('fonts.fallback', theme?.fonts?.fallback);
  requireString('colors.primary', theme?.colors?.primary);
  requireString('colors.kpmgBlue', theme?.colors?.kpmgBlue);
  requireString('colors.white', theme?.colors?.white);
  requireString('colors.black', theme?.colors?.black);
  requireString('colors.link', theme?.colors?.link);
  requireFinite('type.title', theme?.type?.title);
  requireFinite('type.strapline', theme?.type?.strapline);
  requireFinite('type.body', theme?.type?.body);
  requireFinite('type.source', theme?.type?.source);
  requireFinite('type.dividerNumber', theme?.type?.dividerNumber);
  requireFinite('type.dividerTitle', theme?.type?.dividerTitle);
  requireFinite('typeSizes.slideTitle', theme?.typeSizes?.slideTitle);
  requireFinite('typeSizes.strapline', theme?.typeSizes?.strapline);
  requireFinite('typeSizes.body', theme?.typeSizes?.body);
  requireFinite('typeSizes.source', theme?.typeSizes?.source);
  requireFinite('spacing.strapGap', theme?.spacing?.strapGap);
  requireFinite('spacing.sourceTopOffset', theme?.spacing?.sourceTopOffset);
  requireFinite('spacing.sourceBottomGap', theme?.spacing?.sourceBottomGap);
  requireFinite('lines.sectionDividerPt', theme?.lines?.sectionDividerPt);
  requireFinite('table.rowHeightCap', theme?.table?.rowHeightCap);
  requireFinite('dimensions.w', theme?.dimensions?.w);
  requireFinite('dimensions.h', theme?.dimensions?.h);

  const textBoxMargin = theme?.textBox?.marginPt;
  if (!Array.isArray(textBoxMargin) || textBoxMargin.length !== 4 || textBoxMargin.some((v) => !Number.isFinite(Number(v)))) {
    missing.push('textBox.marginPt[4]');
  }
  const bulletIndent = Number(theme?.components?.bullets?.indentPt);
  if (!Number.isFinite(bulletIndent)) missing.push('components.bullets.indentPt');

  if (missing.length > 0) {
    throw new Error(`Invalid runtime theme contract: ${missing.join(', ')}`);
  }
}

/**
 * Build a semantic color map from template token scheme + defaults.
 * @param {object} tokens
 * @param {object} overrides
 * @returns {object}
 */
function buildColorMap(tokens = {}, overrides = {}) {
  const scheme = tokens?.colors?.scheme || {};
  const semantic = tokens?.colors?.semantic || {};
  const explicit = overrides?.colors || {};
  const defaults = DEFAULT_THEME_SPEC.colors;

  const primary = firstNonEmptyString(explicit.primary, semantic.primary, scheme.accent1, defaults.primary);
  const kpmgBlue = firstNonEmptyString(explicit.kpmgBlue, semantic.kpmgBlue, scheme.accent2, defaults.kpmgBlue);
  const white = firstNonEmptyString(explicit.white, semantic.bgLight, scheme.lt1, defaults.white);
  const black = firstNonEmptyString(explicit.black, semantic.textDark, scheme.dk1, defaults.black);
  const lightGrey = firstNonEmptyString(explicit.lightGrey, semantic.bgAlt, scheme.lt2, defaults.lightGrey);

  return {
    ...defaults,
    ...explicit,
    primary,
    kpmgBlue,
    kpmgDarkBlue: firstNonEmptyString(explicit.kpmgDarkBlue, scheme.accent2, primary, defaults.kpmgDarkBlue),
    kpmgCyan: firstNonEmptyString(explicit.kpmgCyan, semantic.kpmgCyan, scheme.accent4, defaults.kpmgCyan),
    kpmgPurple: firstNonEmptyString(explicit.kpmgPurple, semantic.kpmgPurple, scheme.accent5, defaults.kpmgPurple),
    pink: firstNonEmptyString(explicit.pink, scheme.accent6, defaults.pink),
    darkNavy: firstNonEmptyString(explicit.darkNavy, scheme.accent3, defaults.darkNavy),
    white,
    black,
    lightGrey,
    bg: firstNonEmptyString(explicit.bg, semantic.bgLight, scheme.lt1, defaults.bg),
    link: firstNonEmptyString(explicit.link, scheme.hlink, primary, defaults.link),
    neutral100: firstNonEmptyString(explicit.neutral100, scheme.lt2, defaults.neutral100),
    neutral300: firstNonEmptyString(explicit.neutral300, defaults.neutral300),
    neutral: {
      200: firstNonEmptyString(explicit?.neutral?.[200], defaults.neutral[200]),
      300: firstNonEmptyString(explicit?.neutral?.[300], defaults.neutral[300]),
    },
    tableHeader: firstNonEmptyString(explicit.tableHeader, primary, defaults.tableHeader),
    priority: {
      high: firstNonEmptyString(explicit?.priority?.high, primary, defaults.priority.high),
      medium: firstNonEmptyString(explicit?.priority?.medium, defaults.priority.medium),
      low: firstNonEmptyString(explicit?.priority?.low, defaults.priority.low),
    },
    chart: {
      background: firstNonEmptyString(explicit?.chart?.background, white, defaults.chart.background),
    },
  };
}

/**
 * Normalize and resolve runtime theme from tokens + semantic overrides.
 * @param {object} templatePackage
 * @param {{ deckSpec?: object, options?: object }} [args]
 * @returns {object}
 */
export function buildTheme(templatePackage = {}, { deckSpec, options } = {}) {
  const tokens = templatePackage?.tokens || {};
  const metadataOverrides = deckSpec?.metadata?.themeOverrides || {};
  const optionOverrides = options?.themeOverrides || {};
  const semanticOverrides = mergeObjects(metadataOverrides, optionOverrides);
  const fonts = tokens?.fonts || {};
  const colorMap = buildColorMap(tokens, semanticOverrides);
  const typeDefaults = DEFAULT_THEME_SPEC.type;
  const typeOverrides = semanticOverrides?.type || {};
  const typeSizesOverrides = semanticOverrides?.typeSizes || {};
  const resolvedType = resolveTypeScale(typeOverrides, typeSizesOverrides, typeDefaults);

  const resolved = {
    __resolvedTheme: true,
    schemaVersion: THEME_SCHEMA_VERSION,
    tokens,
    rawTokens: tokens,
    textStyles: tokens?.textStyles || {},
    dimensions: tokens?.dimensions || DEFAULT_DIMENSIONS,
    fonts: {
      heading: firstNonEmptyString(semanticOverrides?.fonts?.heading, fonts.heading, DEFAULT_THEME_SPEC.fonts.heading),
      body: firstNonEmptyString(semanticOverrides?.fonts?.body, fonts.body, DEFAULT_THEME_SPEC.fonts.body),
      fallback: firstNonEmptyString(
        semanticOverrides?.fonts?.fallback,
        semanticOverrides?.fonts?.body,
        fonts.fallback,
        fonts.body,
        DEFAULT_THEME_SPEC.fonts.fallback,
      ),
    },
    colors: colorMap,
    type: resolvedType,
    typeSizes: buildTypeSizes(resolvedType),
    spacing: mergeObjects(DEFAULT_THEME_SPEC.spacing, semanticOverrides?.spacing),
    lines: mergeObjects(DEFAULT_THEME_SPEC.lines, semanticOverrides?.lines),
    table: {
      rowHeightCap:
        firstFiniteNumber(semanticOverrides?.table?.rowHeightCap, DEFAULT_THEME_SPEC.table.rowHeightCap) ??
        DEFAULT_THEME_SPEC.table.rowHeightCap,
    },
    chart: {
      palette: Array.isArray(semanticOverrides?.chart?.palette) && semanticOverrides.chart.palette.length
        ? [...semanticOverrides.chart.palette]
        : [...DEFAULT_THEME_SPEC.chart.palette],
      fontSizes: mergeObjects(DEFAULT_THEME_SPEC.chart.fontSizes, semanticOverrides?.chart?.fontSizes),
    },
    textBox: {
      wrap:
        typeof semanticOverrides?.textBox?.wrap === 'boolean'
          ? semanticOverrides.textBox.wrap
          : DEFAULT_THEME_SPEC.textBox.wrap,
      marginPt: Array.isArray(semanticOverrides?.textBox?.marginPt)
        ? [...semanticOverrides.textBox.marginPt]
        : [...DEFAULT_THEME_SPEC.textBox.marginPt],
    },
    components: mergeObjects(DEFAULT_THEME_SPEC.components, semanticOverrides?.components),
  };

  assertThemeContract(resolved);
  return deepFreeze(resolved);
}

/**
 * Resolve a theme input into a valid runtime theme object.
 * @param {object|null} theme
 * @returns {object}
 */
export function resolveTheme(theme = null) {
  if (isResolvedTheme(theme)) return theme;
  if (!theme || typeof theme !== 'object') {
    return buildTheme({}, {});
  }

  const base = buildTheme({ tokens: theme.tokens || {} }, {});
  const merged = mergeObjects(base, theme);
  const canonicalType = resolveTypeScale(merged?.type || {}, merged?.typeSizes || {}, base.type);
  const resolved = {
    ...merged,
    type: canonicalType,
    typeSizes: buildTypeSizes(canonicalType),
    __resolvedTheme: true,
    schemaVersion: THEME_SCHEMA_VERSION,
  };
  assertThemeContract(resolved);
  return deepFreeze(resolved);
}
