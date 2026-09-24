import test from 'node:test';
import assert from 'node:assert/strict';
import { layeredGraph, sequenceLayout, timelineLayout, textWidth } from './lib/layout.mjs';
import { helpers, resetFigureIds } from './kits/report.mjs';
import { chart } from './chart.mjs';
import { readFileSync } from 'node:fs';
import { renderDiagramGallery } from './diagram-examples.mjs';

const ids = (markup) => [...String(markup).matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

test('flow layout is deterministic and routes nodes in ordered layers', () => {
  const nodes = ['build', 'verify', 'publish'];
  const edges = [['build', 'verify'], ['verify', 'publish']];
  const first = layeredGraph(nodes, edges);
  assert.deepEqual(first, layeredGraph(nodes, edges));
  assert.ok(first.nodes[0].x < first.nodes[1].x && first.nodes[1].x < first.nodes[2].x);
  assert.ok(textWidth('publish', 13) < first.nodes[2].width);
  assert.throws(() => layeredGraph(Array.from({ length: 13 }, (_, i) => String(i)), []), /use a table/);
});

test('three computed flow figures have unique marker ids and text summaries', () => {
  resetFigureIds();
  const markup = [1, 2, 3].map(() => helpers.flow({ nodes: ['build', 'ship'], edges: [['build', 'ship']], summary: 'Build leads to shipment.' })).join('');
  const markers = ids(markup);
  assert.equal(markers.length, 3);
  assert.equal(new Set(markers).size, 3);
  assert.equal((markup.match(/aria-hidden="true"/g) ?? []).length, 3);
  assert.throws(() => helpers.flow({ nodes: ['a'], edges: [] }), /summary/);
});

test('state helper supports labeled transitions and limits emphasis', () => {
  const markup = String(helpers.state({ nodes: ['draft', 'live'], edges: [['draft', 'live', 'ship']], emphasis: 'live', summary: 'A draft ships to live.' }));
  assert.match(markup, />ship<\/text>/);
  assert.match(markup, /is-emphasized/);
  assert.throws(() => helpers.state({ nodes: ['a', 'b', 'c'], edges: [], emphasis: ['a', 'b', 'c'], summary: 'Three states.' }), /at most two/);
});

test('sequence and timeline positions are deterministic', () => {
  const actors = ['client', 'API'];
  const events = [{ from: 'client', to: 'API', label: 'request' }];
  assert.deepEqual(sequenceLayout(actors, events), sequenceLayout(actors, events));
  assert.deepEqual(timelineLayout([{ title: 'detect' }, { title: 'repair' }]), timelineLayout([{ title: 'detect' }, { title: 'repair' }]));
  assert.match(String(helpers.sequence({ actors, events, summary: 'The client requests.' })), /request/);
  assert.match(String(helpers.timeline({ events: [{ title: 'detect', date: '09:10' }], summary: 'Detection began at 09:10.' })), /09:10/);
});

test('line and stacked charts render named, sourced forms', () => {
  const line = String(helpers.line([['W1', 1], ['W2', 3]], { title: 'Trend', source: 'fixture' }));
  const stacked = String(helpers.stacked([['A', 2, 3]], { title: 'Composition', series: ['Done', 'Open'], source: 'fixture' }));
  assert.match(line, /data-component="line-chart"/);
  assert.match(stacked, /data-component="stacked-chart"/);
  assert.match(line, /data-source="fixture"/);
  assert.match(stacked, /data-source="fixture"/);
  assert.equal(chart('line', { title: 'Trend', data: [['W1', 1], ['W2', 3]] }), chart('line', { title: 'Trend', data: [['W1', 1], ['W2', 3]] }));
});

test('committed diagram examples match their helper source', () => {
  for (const [file, atlas] of [['../assets/diagrams.html', false], ['../assets/atlas.html', true]]) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    assert.equal(renderDiagramGallery(source, { atlas }), source);
  }
});
