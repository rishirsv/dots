import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = '/Users/rishi/Code/ai-tools/kpmg-utils/kpmg-slidegen';
const DESKTOP_ROOT = '/Users/rishi/Desktop/kpmg-slidegen-verbosity-density-matrix';
const REPO_OUTPUT_ROOT = path.join(REPO_ROOT, 'presets', 'authoring', 'review-matrix');

const TEXT_AMOUNTS = [
  { id: 'sm', presetId: 'minimal', label: 'Minimal' },
  { id: 'md', presetId: 'concise', label: 'Concise' },
  { id: 'lg', presetId: 'detailed', label: 'Detailed' },
  { id: 'xl', presetId: 'extensive', label: 'Extensive' },
];

const COUNT_TARGETS = Object.freeze({
  sm: {
    oneColumnItems: 4,
    twoColumnItems: 2,
    chartItems: 4,
    chartTableItems: 4,
    chartTableRows: 4,
    narrowInsights: 2,
    narrowRows: 4,
    bridgePhases: 1,
    bridgeSteps: 5,
    bridgePhaseItems: 2,
    overviewItems: 2,
    boxItems: 3,
  },
  md: {
    oneColumnItems: 5,
    twoColumnItems: 3,
    chartItems: 4,
    chartTableItems: 4,
    chartTableRows: 4,
    narrowInsights: 3,
    narrowRows: 6,
    bridgePhases: 2,
    bridgeSteps: 8,
    bridgePhaseItems: 2,
    overviewItems: 3,
    boxItems: 3,
  },
  lg: {
    oneColumnItems: 6,
    twoColumnItems: 4,
    chartItems: 5,
    chartTableItems: 5,
    chartTableRows: 6,
    narrowInsights: 4,
    narrowRows: 8,
    bridgePhases: 3,
    bridgeSteps: 10,
    bridgePhaseItems: 2,
    overviewItems: 4,
    boxItems: 4,
  },
  xl: {
    oneColumnItems: 7,
    twoColumnItems: 5,
    chartItems: 6,
    chartTableItems: 5,
    chartTableRows: 8,
    narrowInsights: 4,
    narrowRows: 10,
    bridgePhases: 3,
    bridgeSteps: 12,
    bridgePhaseItems: 3,
    overviewItems: 6,
    boxItems: 4,
  },
});

const PHASE_HEADINGS = ['Growth drivers', 'Execution risks', 'Forward view'];
const WORKSTREAMS = ['Commercial', 'Operations', 'Technology', 'Governance'];

function textAmountDescriptor(textAmount) {
  switch (textAmount) {
    case 'sm':
      return 'Keep points short and decision-led.';
    case 'md':
      return 'Add a concrete proof point to each section.';
    case 'lg':
      return 'Use fuller evidence and implication in each point.';
    case 'xl':
      return 'Carry report-style detail while preserving slide readability.';
    default:
      return '';
  }
}

function payload(theme, index, textAmount) {
  const base = `${theme} point ${index + 1} anchors the storyline around measurable operating performance`;
  if (textAmount === 'sm') {
    return `${base}.`;
  }
  if (textAmount === 'md') {
    return `${base}, supported by a recent management fact pattern.`;
  }
  if (textAmount === 'lg') {
    return `${base}, supported by a recent management fact pattern and linked to a clear owner-led response.`;
  }
  return `${base}, supported by recent management evidence, linked to decision impact, and framed with the next action leadership should prioritize.`;
}

function buildBullets(theme, count, textAmount) {
  return Array.from({ length: count }, (_, index) => payload(theme, index, textAmount));
}

function buildRows(prefix, count, textAmount) {
  return Array.from({ length: count }, (_, index) => {
    const metric = `${prefix} metric ${index + 1}`;
    const current = `${68 + index * 3}%`;
    const target = `${72 + index * 3}%`;
    const gap = '4%';
    const readThrough =
      textAmount === 'sm'
        ? 'Target remains achievable.'
        : textAmount === 'md'
          ? 'Target remains achievable with focused execution.'
          : textAmount === 'lg'
            ? 'Target remains achievable if management keeps current governance cadence in place.'
            : 'Target remains achievable if management sustains governance discipline, resolves dependencies early, and protects accountability in weekly operating reviews.';
    return [metric, current, target, gap, readThrough];
  });
}

function buildBridgeSteps(count) {
  const labels = [
    'Volume growth',
    'Pricing discipline',
    'Customer retention',
    'Mix improvement',
    'Support efficiency',
    'Control remediation',
    'Automation',
    'Vendor savings',
    'Headcount ramp',
    'Implementation drag',
    'Timing variance',
    'Recovery actions',
  ];
  const deltas = [18, 10, 8, 7, 6, -4, 5, 4, -3, -5, -2, 6];
  return Array.from({ length: count }, (_, index) => ({
    label: labels[index],
    delta: deltas[index],
  }));
}

function sumBridgeDeltas(steps) {
  return steps.reduce((total, step) => total + Number(step?.delta || 0), 0);
}

function buildAnalysisColumns(phaseCount, bodyCount, textAmount) {
  return Array.from({ length: phaseCount }, (_, index) => ({
    heading: PHASE_HEADINGS[index],
    body: buildBullets(PHASE_HEADINGS[index], bodyCount, textAmount),
  }));
}

function buildColumns(itemCount, textAmount) {
  return WORKSTREAMS.map((heading, index) => ({
    heading,
    body: buildBullets(`${heading} workstream`, itemCount, textAmount).map((text, itemIndex) =>
      itemIndex === 0 && index === 0 ? text.replace('point 1', 'priority 1') : text,
    ),
  }));
}

function buildContentsSections(presetId, textAmount) {
  return [
    {
      number: '01',
      title: 'Settings summary',
      items: [`${presetId} preset using ${textAmount.toUpperCase()}`],
    },
    {
      number: '02',
      title: 'Narrative samples',
      items: ['One-column and two-column slides'],
    },
    {
      number: '03',
      title: 'Analytical samples',
      items: ['Chart, table, and bridge layouts'],
    },
    {
      number: '04',
      title: 'Structure samples',
      items: ['Overview and four-box layouts'],
    },
  ];
}

function buildDeck({ presetId, label, textAmount, id }) {
  const resolvedTextAmount = textAmount || id;
  const counts = COUNT_TARGETS[resolvedTextAmount];
  const deckLabel = `${label} (${resolvedTextAmount.toUpperCase()})`;
  const guidance = textAmountDescriptor(resolvedTextAmount);
  const bridgeStartValue = 122;
  const bridgeSteps = buildBridgeSteps(counts.bridgeSteps);
  const bridgeEndValue = bridgeStartValue + sumBridgeDeltas(bridgeSteps);

  return {
    metadata: {
      title: `Verbosity Review ${deckLabel}`,
      author: 'KPMG LLP',
      company: 'KPMG LLP',
      subject: `Review sample for ${deckLabel}`,
      allowSparse: false,
      textAmount: resolvedTextAmount,
      slideCountPolicy: 'auto',
      styleIntent: 'diligence',
      footer: {
        year: 2026,
        legalEntityName: 'KPMG LLP',
        jurisdiction: 'Ontario',
        legalStructure: 'limited liability partnership',
        documentClassification: 'KPMG Confidential',
        officeContactText: 'kpmg.com/ca',
      },
    },
    slides: [
      {
        type: 'cover',
        title: `${deckLabel} sample deck`,
        subtitle: `Review deck showing the ${resolvedTextAmount.toUpperCase()} text budget under the new default density guardrail.`,
      },
      {
        type: 'contents',
        title: 'Contents',
        sections: buildContentsSections(presetId, resolvedTextAmount),
      },
      {
        type: 'dividerDark',
        sectionNumber: '01',
        sectionTitle: 'Settings summary',
      },
      {
        type: 'oneColumnText',
        title: 'How to review this sample',
        strapline: `${label} text budget. ${guidance}`,
        bodyStyle: 'bullets',
        body: [
          { text: 'What changes', subheader: true },
          ...buildBullets('Review focus', counts.oneColumnItems - 1, resolvedTextAmount),
        ],
        source: 'Source: generated review matrix sample.',
      },
      {
        type: 'dividerLight',
        sectionNumber: '02',
        sectionTitle: 'Narrative samples',
      },
      {
        type: 'twoColumnText',
        title: 'Current vs target operating model',
        strapline: 'Two-column example calibrated to the selected text amount.',
        bodyStyle: 'bullets',
        leftBody: buildBullets('Current state', counts.twoColumnItems, resolvedTextAmount),
        rightBody: buildBullets('Target state', counts.twoColumnItems, resolvedTextAmount),
      },
      {
        type: 'analysisWideChart2ColsText',
        title: 'Revenue and margin trend',
        strapline: 'Chart slide showing how narrative depth changes while the data stays constant.',
        bodyStyle: 'bullets',
        body: buildBullets('Revenue trend', counts.chartItems, resolvedTextAmount),
        chart: {
          type: 'bar',
          data: [
            {
              name: 'Revenue ($M)',
              labels: ['2023', '2024', '2025'],
              values: [74, 88, 109],
            },
            {
              name: 'Gross margin (%)',
              labels: ['2023', '2024', '2025'],
              values: [69, 71, 73],
            },
          ],
          opts: {
            showValue: true,
            showLegend: true,
            valAxisTitle: '$M / %',
          },
          source: 'Source: generated review matrix metrics.',
        },
      },
      {
        type: 'analysisWideChartTableText',
        title: 'Packaging and performance view',
        strapline: 'Chart plus table example for combined evidence layouts.',
        heading: 'Plan mix and current run-rate',
        bodyStyle: 'bullets',
        body: buildBullets('Packaging view', counts.chartTableItems, resolvedTextAmount),
        chart: {
          type: 'bar',
          data: [
            {
              name: 'Customers',
              labels: ['Starter', 'Growth', 'Enterprise'],
              values: [118, 86, 42],
            },
            {
              name: 'MRR ($000)',
              labels: ['Starter', 'Growth', 'Enterprise'],
              values: [76, 214, 468],
            },
          ],
          opts: {
            showValue: true,
            showLegend: true,
            valAxisTitle: 'Count / $000',
          },
          source: 'Source: generated review matrix metrics.',
        },
        table: {
          headers: ['Plan', 'Customers', 'MRR', 'Read-through'],
          rows: buildRows('Plan', counts.chartTableRows, resolvedTextAmount).map(([metric, current, target, , readThrough], index) => [
            metric.replace('metric', ['Starter', 'Growth', 'Enterprise', 'Expansion', 'Renewal', 'Upsell', 'Pipeline', 'Services'][index] || `Line ${index + 1}`),
            `${50 + index * 7}`,
            `$${80 + index * 35}k`,
            readThrough,
          ]),
        },
        noteSource: 'Source: generated review matrix metrics.',
      },
      {
        type: 'analysisNarrowTable',
        title: 'Metric gap assessment',
        strapline: 'Table-led example with insight bullets tuned to the selected text amount.',
        table: {
          headers: ['Metric', 'Current', 'Target', 'Gap', 'Read-through'],
          rows: buildRows('Operational', counts.narrowRows, resolvedTextAmount),
        },
        insights: buildBullets('Metric implication', counts.narrowInsights, resolvedTextAmount),
        notes: 'Source: generated review matrix metrics.',
      },
      {
        type: 'analysisBridge',
        title: 'Adjusted EBITDA bridge',
        strapline: 'Bridge example using the same numeric story across the review set.',
        bodyStyle: 'paragraphs',
        bridge: {
          startLabel: 'FY23 EBITDA',
          endLabel: 'FY25 EBITDA',
          startValue: bridgeStartValue,
          endValue: bridgeEndValue,
          unitPrefix: '$',
          unitSuffix: 'm',
          decimals: 0,
          tolerance: 0.5,
          steps: bridgeSteps,
        },
        analysisColumns: buildAnalysisColumns(counts.bridgePhases, counts.bridgePhaseItems, resolvedTextAmount),
        source: 'Source: generated review matrix metrics.',
        note: guidance,
      },
      {
        type: 'businessOverview',
        title: 'Business overview and trend',
        leftHeading: 'Legal and ownership structure',
        rightHeading: 'Operating and performance summary',
        bodyStyle: 'paragraphs',
        structure: {
          topTier: [
            { label: 'Investor A', pct: '45%' },
            { label: 'Investor B', pct: '35%' },
            { label: 'Founder', pct: '20%' },
          ],
          midTier: [{ label: 'HoldCo', pct: '100%' }],
          bottomTier: [
            { label: 'OpCo North', pct: '100%' },
            { label: 'OpCo Central', pct: '100%' },
            { label: 'Shared Services', pct: '100%' },
          ],
          links: [
            { fromTier: 'top', fromIndex: 0, toTier: 'mid', toIndex: 0 },
            { fromTier: 'top', fromIndex: 1, toTier: 'mid', toIndex: 0 },
            { fromTier: 'top', fromIndex: 2, toTier: 'mid', toIndex: 0 },
            { fromTier: 'mid', fromIndex: 0, toTier: 'bottom', toIndex: 0 },
            { fromTier: 'mid', fromIndex: 0, toTier: 'bottom', toIndex: 1 },
            { fromTier: 'mid', fromIndex: 0, toTier: 'bottom', toIndex: 2 },
          ],
          perimeter: {
            enabled: true,
            label: 'Transaction perimeter',
            subLabel: 'Entities under diligence scope',
          },
        },
        overviewBody: buildBullets('Overview summary', counts.overviewItems, resolvedTextAmount),
        chart: {
          type: 'area',
          data: [
            {
              name: 'Revenue trend',
              labels: ['FY21', 'FY22', 'FY23', 'FY24', 'FY25'],
              values: [96, 108, 121, 142, 164],
            },
          ],
          source: 'Source: generated review matrix metrics.',
        },
        source: 'Source: generated review matrix metrics.',
        note: guidance,
      },
      {
        type: 'titleStrapline4TextBoxes',
        title: 'Program workstreams and ownership',
        strapline: 'Four-box example showing how short-form workstreams scale by text amount.',
        bodyStyle: 'paragraphs',
        columns: buildColumns(counts.boxItems, resolvedTextAmount),
      },
      {
        type: 'backCover',
      },
    ],
  };
}

function buildManifest(entries) {
  const lines = [
    '# Verbosity Review Set',
    '',
    'This bundle contains one rendered deck for each supported `textAmount` value after the density-profile refactor.',
    '',
    'Simple reading guide:',
    '- `textAmount` changes how much content each slide is expected to carry.',
    '- Layout density enforcement is now internal and uses the new default denser baseline.',
    '',
    'Included review decks:',
  ];

  entries.forEach((entry) => {
    lines.push(`- ${entry.id}: ${entry.label} (${entry.textAmount.toUpperCase()})`);
  });

  lines.push('', 'Folder contents per preset:', '- `deckspec.json`', '- `qa.json`', '- rendered `.pptx` deck');
  return `${lines.join('\n')}\n`;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function emptyDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await ensureDir(dirPath);
}

async function main() {
  await emptyDir(REPO_OUTPUT_ROOT);
  await emptyDir(DESKTOP_ROOT);

  const manifestEntries = [];

  for (const entry of TEXT_AMOUNTS) {
    const deckSpec = buildDeck(entry);
    const repoPath = path.join(REPO_OUTPUT_ROOT, `${entry.presetId}.deckSpec.json`);
    await fs.writeFile(repoPath, `${JSON.stringify(deckSpec, null, 2)}\n`);

    const desktopDir = path.join(DESKTOP_ROOT, entry.presetId);
    await ensureDir(desktopDir);
    await fs.writeFile(path.join(desktopDir, 'deckspec.json'), `${JSON.stringify(deckSpec, null, 2)}\n`);

    manifestEntries.push({
      id: entry.presetId,
      label: entry.label,
      textAmount: entry.id,
    });
  }

  await fs.writeFile(path.join(DESKTOP_ROOT, 'README.md'), buildManifest(manifestEntries));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
