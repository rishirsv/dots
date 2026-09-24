/** Render the computed examples in both human diagram galleries. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { helpers, resetFigureIds } from './kits/report.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const examples = {
  flowchart: () => helpers.flow({ nodes: ['input', 'valid?', 'accept', 'repair'], edges: [['input', 'valid?'], ['valid?', 'accept', 'yes'], ['valid?', 'repair', 'no']], emphasis: 'valid?', summary: 'Input is accepted when valid; otherwise it enters a repair path.' }),
  'state-machine': () => helpers.state({ nodes: ['draft', 'verified', 'live'], edges: [['draft', 'verified', 'check'], ['verified', 'live', 'ship']], emphasis: 'verified', summary: 'A draft becomes verified after its check and moves live through publication.' }),
  timeline: () => helpers.timeline({ events: [{ title: 'detect', date: '09:10' }, { title: 'contain', date: '09:18' }, { title: 'repair', date: '09:31' }, { title: 'close', date: '09:42' }], summary: 'Detection led to containment, repair, and closure.' }),
  sequence: () => helpers.sequence({ actors: ['client', 'API', 'store'], events: [{ from: 'client', to: 'API', label: 'request' }, { from: 'API', to: 'store', label: 'read' }, { from: 'store', to: 'API', label: 'result' }, { from: 'API', to: 'client', label: 'response' }], summary: 'The client calls the API, which reads the store and returns the result.' }),
  'line-chart': () => helpers.line([['W1', 100], ['W2', 120], ['W3', 115], ['W4', 148], ['W5', 166], ['W6', 183], ['W7', 174]], { title: 'Seven-week trend', source: 'illustrative' }),
  'stacked-chart': () => helpers.stacked([['Search', 5, 2], ['Checkout', 3, 4], ['Auth', 6, 1]], { title: 'Completed and pending work', series: ['Done', 'Pending'], source: 'illustrative' }),
};
const descriptions = {
  'line-chart': 'The measure rises overall, with a third-week reversal and a final-week pullback.',
  'stacked-chart': 'The total is seven items in each area, with different completed shares.',
};

function styleFrom(name) {
  const source = readFileSync(join(root, 'registry', `${name}.html`), 'utf8');
  return source.match(/<style>[\s\S]*?<\/style>/)?.[0] ?? '';
}

export function renderDiagramGallery(source, { atlas = false } = {}) {
  resetFigureIds();
  const generated = Object.fromEntries(Object.entries(examples).map(([name, render]) => [name, String(render())]));
  const prefix = atlas ? 'diagram-template-' : '';
  if (!source.includes(`<figure id="${prefix}stacked-chart"`)) {
    const lineAt = source.indexOf(`<figure id="${prefix}line-chart"`);
    if (lineAt < 0) throw new Error('line chart example is missing');
    const afterLine = source.indexOf('</figure>', lineAt) + '</figure>'.length;
    source = source.slice(0, afterLine) + `\n\n    <figure id="${prefix}stacked-chart" class="diagram-card" data-diagram="stacked-chart"><h2>Stacked chart</h2><p class="diagram-use">Compare the composition of totals across categories.</p></figure>` + source.slice(afterLine);
  }
  for (const [name, markup] of Object.entries(generated)) {
    const id = `${prefix}${name}`;
    const start = source.indexOf(`<figure id="${id}"`);
    if (start < 0) throw new Error(`missing gallery figure ${id}`);
    const end = source.indexOf('</figure>', start) + '</figure>'.length;
    const figure = source.slice(start, end);
    const head = figure.slice(0, figure.indexOf('</p>') + 4);
    const summary = descriptions[name] ? `<figcaption class="diagram-summary">${descriptions[name]}</figcaption>` : '';
    source = source.slice(0, start) + `${head}\n      <!-- GENERATED from report helpers by diagram-examples.mjs -->\n      ${markup}${summary ? `\n      ${summary}` : ''}\n    </figure>` + source.slice(end);
  }
  source = source.replace('<text class="diagram-value" x="98" y="94">100%</text>', '<text class="diagram-value" x="98" y="94">core 52%</text>');
  source = source.replace('These 18 templates', 'These 19 templates');
  source = source.replace('Eighteen reusable templates', 'Nineteen reusable templates');
  const galleryAt = source.indexOf('<div class="diagram-grid">');
  const styleEnd = source.lastIndexOf('</style>', galleryAt) + '</style>'.length;
  if (styleEnd < '</style>'.length) throw new Error('gallery style block is missing');
  const styles = [
    ...(source.includes('.flow-diagram-wrap {') ? [] : [styleFrom('flow-diagram')]),
    ...(source.includes('.chart-card {') ? [] : [styleFrom('bar-chart')]),
    ...(source.includes('.chart-scroll {') ? [] : [styleFrom('line-chart')]),
    ...(source.includes('.stacked-row {') ? [] : [styleFrom('stacked-chart')]),
  ];
  if (!source.includes('.diagram-card .chart-card{')) styles.push('<style>.diagram-card .chart-card{border:0;padding:0;margin:0}.diagram-card .flow-diagram-wrap{margin:0}.diagram-card:is([data-diagram="flowchart"],[data-diagram="state-machine"],[data-diagram="sequence"],[data-diagram="timeline"],[data-diagram="line-chart"]){grid-column:1/-1}</style>');
  if (styles.length) source = source.slice(0, styleEnd) + '\n' + styles.join('\n') + source.slice(styleEnd);
  source = source.replace(/<style>\.diagram-card \.chart-card\{border:0;padding:0;margin:0\}\.diagram-card \.flow-diagram-wrap\{margin:0\}<\/style>/, '<style>.diagram-card .chart-card{border:0;padding:0;margin:0}.diagram-card .flow-diagram-wrap{margin:0}.diagram-card:is([data-diagram="flowchart"],[data-diagram="state-machine"],[data-diagram="sequence"],[data-diagram="timeline"],[data-diagram="line-chart"]){grid-column:1/-1}</style>');
  return source;
}

export function writeDiagramGalleries() {
  for (const [name, atlas] of [['diagrams.html', false], ['atlas.html', true]]) {
    const file = join(root, name);
    writeFileSync(file, renderDiagramGallery(readFileSync(file, 'utf8'), { atlas }));
  }
}
