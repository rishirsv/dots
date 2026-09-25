import test from 'node:test';
import assert from 'node:assert/strict';
import { layeredGraph, sequenceLayout, timelineLayout, textWidth } from './lib/layout.mjs';
import { helpers, resetFigureIds } from './kits/report.mjs';
import { chart } from './chart.mjs';
import { readFileSync } from 'node:fs';
import { checkGalleries } from './catalog.mjs';

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

test('flow layout follows edges, separates branch labels, and fits a long chain', () => {
  const reversed = layeredGraph(['verify', 'build'], [['build', 'verify']]);
  assert.ok(reversed.nodes.find((node) => node.label === 'build').x < reversed.nodes.find((node) => node.label === 'verify').x);
  const branched = layeredGraph(['build', 'pass', 'fail'], [['build', 'pass', 'yes'], ['build', 'fail', 'no']]);
  assert.equal(new Set(branched.edges.map((edge) => edge.labelY)).size, 2);
  const chain = layeredGraph(['a', 'b', 'c', 'd'], [['a', 'b'], ['b', 'c'], ['c', 'd']]);
  assert.equal(chain.orientation, 'vertical');
  assert.ok(chain.width <= 672);
  const last = Math.max(...chain.nodes.map((node) => node.y + node.height));
  assert.ok(chain.height - last < 30, 'forward edges do not reserve return lanes');
  const loop = layeredGraph(['a', 'b'], [['a', 'b'], ['b', 'a']]);
  assert.ok(loop.height > Math.max(...loop.nodes.map((node) => node.y + node.height)) + 20);
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

test('long sequences and timelines switch to vertical layouts within the width budget', () => {
  const actors = ['client', 'API', 'store', 'queue'];
  const events = [{ from: 'client', to: 'API', label: 'request' }, { from: 'API', to: 'queue', label: 'enqueue' }];
  const sequence = sequenceLayout(actors, events);
  assert.equal(sequence.orientation, 'vertical');
  assert.ok(sequence.width <= 672);
  assert.match(String(helpers.sequence({ actors, events, summary: 'Request then enqueue.' })), /request/);
  const moments = Array.from({ length: 5 }, (_, index) => ({ title: `step ${index}`, date: `T${index}` }));
  const timeline = timelineLayout(moments);
  assert.equal(timeline.orientation, 'vertical');
  assert.ok(timeline.width <= 672);
  assert.match(String(helpers.timeline({ events: moments, summary: 'Five events.' })), /step 4/);
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
  assert.deepEqual(checkGalleries(), []);
});
