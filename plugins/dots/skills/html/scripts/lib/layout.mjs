/** Deterministic geometry for report diagrams. Coordinates are in CSS pixels. */
import { rules } from './contracts.mjs';
const WIDTH = Object.freeze({ sans: 0.54, mono: 0.62 });
export function textWidth(text, size = 13, font = 'sans') {
  const unit = WIDTH[font] ?? WIDTH.sans;
  return [...String(text)].reduce((sum, char) => sum + (/[MW@#%]/.test(char) ? 1.35 : /[il.,:;| ]/.test(char) ? .55 : 1) * unit * size, 0);
}

export function layeredGraph(nodes, edges, budget = 672) {
  const entries = nodes.map((node, index) => typeof node === 'string' ? { id: node, label: node, index } : { ...node, id: String(node.id ?? node.label), label: String(node.label ?? node.id), index });
  if (!entries.length) throw new Error('layout: nodes are required');
  if (entries.length > 12) throw new Error(`layout: ${rules.flow.nodes}`);
  const byId = new Map(entries.map((node) => [node.id, node]));
  if (byId.size !== entries.length) throw new Error('layout: node ids must be unique');
  const links = edges.map((edge) => Array.isArray(edge) ? { from: String(edge[0]), to: String(edge[1]), label: edge[2] == null ? '' : String(edge[2]) } : { ...edge, from: String(edge.from), to: String(edge.to), label: String(edge.label ?? '') });
  for (const edge of links) if (!byId.has(edge.from) || !byId.has(edge.to)) throw new Error('layout: edge references an unknown node');

  // Ignore only edges that close a cycle. The remaining DAG determines layers,
  // regardless of the order in which the caller listed nodes.
  const outgoing = new Map(entries.map((node) => [node.id, links.filter((edge) => edge.from === node.id)]));
  const active = new Set(), visited = new Set(), forward = new Set();
  const visit = (id) => {
    active.add(id);
    for (const edge of outgoing.get(id)) {
      if (active.has(edge.to)) continue;
      forward.add(edge);
      if (!visited.has(edge.to)) visit(edge.to);
    }
    active.delete(id);
    visited.add(id);
  };
  const incoming = new Set(links.map((edge) => edge.to));
  for (const node of entries.filter((item) => !incoming.has(item.id))) if (!visited.has(node.id)) visit(node.id);
  for (const node of entries) if (!visited.has(node.id)) visit(node.id);

  const indegree = new Map(entries.map((node) => [node.id, 0]));
  for (const edge of forward) indegree.set(edge.to, indegree.get(edge.to) + 1);
  const queue = entries.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const layers = new Map(entries.map((node) => [node.id, 0]));
  while (queue.length) {
    const id = queue.shift();
    for (const edge of outgoing.get(id).filter((item) => forward.has(item))) {
      layers.set(edge.to, Math.max(layers.get(edge.to), layers.get(id) + 1));
      indegree.set(edge.to, indegree.get(edge.to) - 1);
      if (indegree.get(edge.to) === 0) queue.push(edge.to);
    }
  }
  const buckets = [];
  for (const node of entries) (buckets[layers.get(node.id)] ??= []).push(node);
  const boxWidth = Math.max(120, ...entries.map((node) => Math.ceil(textWidth(node.label, 13, 'mono') + 32)));
  const gapX = Math.max(90, ...links.map((edge) => Math.ceil(textWidth(edge.label, 13) + 36)));
  const boxHeight = 48, gapY = 46, pad = 24;
  const horizontalWidth = pad * 2 + buckets.length * boxWidth + Math.max(0, buckets.length - 1) * gapX;
  const orientation = horizontalWidth <= budget ? 'horizontal' : 'vertical';
  let placed, width, bottom;
  if (orientation === 'horizontal') {
    const maxRows = Math.max(...buckets.map((bucket) => bucket.length));
    placed = buckets.flatMap((bucket, layer) => bucket.map((node, row) => ({ ...node,
      x: pad + layer * (boxWidth + gapX),
      y: pad + row * (boxHeight + gapY) + (maxRows - bucket.length) * (boxHeight + gapY) / 2,
      width: boxWidth, height: boxHeight, layer })));
    width = horizontalWidth;
    bottom = Math.max(...placed.map((node) => node.y + boxHeight));
  } else {
    if (boxWidth + pad * 2 > budget) throw new Error('layout: node label exceeds the diagram width budget');
    let y = pad;
    placed = buckets.flatMap((bucket, layer) => {
      const items = bucket.map((node, index) => ({ ...node,
        x: pad,
        y: y + index * (boxHeight + gapY),
        width: boxWidth, height: boxHeight, layer }));
      y += bucket.length * (boxHeight + gapY) + 52;
      return items;
    });
    width = Math.max(...placed.map((node) => node.x + boxWidth)) + pad;
    bottom = Math.max(...placed.map((node) => node.y + boxHeight));
    const fittedWidth = Math.max(272, width);
    const shift = (fittedWidth - width) / 2;
    placed = placed.map((node) => ({ ...node, x: node.x + shift }));
    width = fittedWidth;
  }
  const positions = new Map(placed.map((node) => [node.id, node]));
  const crossesNode = (points, from, to) => placed.some((node) => node !== from && node !== to && points.slice(1).some((point, index) => {
    const prior = points[index];
    if (prior.x === point.x) return prior.x > node.x && prior.x < node.x + node.width && Math.min(prior.y, point.y) < node.y + node.height && Math.max(prior.y, point.y) > node.y;
    return prior.y > node.y && prior.y < node.y + node.height && Math.min(prior.x, point.x) < node.x + node.width && Math.max(prior.x, point.x) > node.x;
  }));
  let laneCount = 0;
  const routed = links.map((edge) => {
    const from = positions.get(edge.from), to = positions.get(edge.to);
    if (forward.has(edge) && to.layer === from.layer + 1) {
      if (orientation === 'horizontal') {
        const x0 = from.x + boxWidth, x1 = to.x;
        const y0 = from.y + boxHeight / 2, y1 = to.y + boxHeight / 2;
        const mid = (x0 + x1) / 2;
        return { ...edge, path: `M${x0},${y0} H${mid} V${y1} H${x1 - 6}`, labelX: mid, labelY: (y0 + y1) / 2 - 8 };
      }
      const x0 = from.x + boxWidth / 2, x1 = to.x + boxWidth / 2;
      const y0 = from.y + boxHeight, y1 = to.y;
      const mid = (y0 + y1) / 2;
      if (!crossesNode([{ x: x0, y: y0 }, { x: x0, y: mid }, { x: x1, y: mid }, { x: x1, y: y1 - 6 }], from, to))
        return { ...edge, path: `M${x0},${y0} V${mid} H${x1} V${y1 - 6}`, labelX: (x0 + x1) / 2, labelY: mid - 8 };
    }
    const lane = ++laneCount;
    if (orientation === 'horizontal') {
      const y = bottom + lane * 24;
      const rightward = to.layer > from.layer;
      const sourceX = from.x + (rightward ? boxWidth : 0);
      const targetX = to.x + (rightward ? 0 : boxWidth);
      const sourceLane = sourceX + (rightward ? 12 : -12);
      const targetLane = targetX + (rightward ? -12 : 12);
      const sourceY = from.y + boxHeight / 2, targetY = to.y + boxHeight / 2;
      return { ...edge, path: `M${sourceX},${sourceY} H${sourceLane} V${y} H${targetLane} V${targetY} H${targetX + (rightward ? -6 : 6)}`, labelX: (sourceLane + targetLane) / 2, labelY: y - 8 };
    }
    const x = width - pad + lane * 18;
    return { ...edge, path: `M${from.x + boxWidth},${from.y + boxHeight / 2} H${x} V${to.y + boxHeight / 2} H${to.x + boxWidth + 6}`, labelX: x - 20, labelY: (from.y + to.y + boxHeight) / 2 - 8 };
  });
  const height = bottom + pad + (orientation === 'horizontal' ? laneCount * 24 : 0);
  if (orientation === 'vertical' && laneCount) width += laneCount * 18;
  if (width > budget) throw new Error('layout: edge routing exceeds the diagram width budget');
  return { nodes: placed, edges: routed, width, height, orientation };
}
export function sequenceLayout(actors, events, budget = 672) {
  if (actors.length > 12) throw new Error(`layout: ${rules.sequence.actors}`);
  const labels = actors.map(String);
  const width = Math.max(120, ...labels.map((label) => textWidth(label, 13) + 32));
  const gap = Math.max(110, ...events.map((event) => textWidth(event.label ?? '', 13) + 42));
  const horizontalWidth = 48 + labels.length * width + Math.max(0, labels.length - 1) * gap;
  if (horizontalWidth <= budget) return { actors: labels.map((label, index) => ({ label, x: 24 + index * (width + gap) + width / 2 })), events: events.map((event, index) => ({ ...event, y: 96 + index * 64 })), width: horizontalWidth, height: 130 + events.length * 64, orientation: 'horizontal' };
  const actorWidth = Math.max(...labels.map((label) => textWidth(label, 13))) + 20;
  const messageWidth = Math.max(80, ...events.map((event) => textWidth(event.label ?? '', 13) + 28));
  const verticalWidth = Math.max(272, 48 + actorWidth * 2 + messageWidth);
  if (verticalWidth > budget) throw new Error('layout: sequence labels exceed the diagram width budget');
  return { actors: labels.map((label) => ({ label })), events: events.map((event, index) => ({ ...event, y: 70 + index * 78 })), width: verticalWidth, height: 120 + (events.length - 1) * 78, orientation: 'vertical', left: 24 + actorWidth / 2, right: verticalWidth - 24 - actorWidth / 2, actorWidth };
}

export function timelineLayout(events, budget = 672) {
  if (events.length > 12) throw new Error(`layout: ${rules.timeline.count}`);
  const widths = events.map((event) => Math.max(textWidth(event.title ?? event.label ?? '', 13, 'mono'), textWidth(event.date ?? '', 13)));
  const centers = [];
  widths.forEach((width, index) => centers.push(index === 0 ? 24 + width / 2 : centers[index - 1] + Math.max(150, widths[index - 1] / 2 + width / 2 + 24)));
  const horizontalWidth = Math.ceil(centers.at(-1) + widths.at(-1) / 2 + 24);
  if (horizontalWidth <= budget) return { events: events.map((event, index) => ({ ...event, x: centers[index] })), width: horizontalWidth, height: 180, orientation: 'horizontal' };
  const labelWidth = Math.max(...widths);
  const verticalWidth = Math.max(272, Math.ceil(labelWidth + 120));
  if (verticalWidth > budget) throw new Error('layout: timeline label exceeds the diagram width budget');
  return { events: events.map((event, index) => ({ ...event, x: 40, y: 60 + index * 76 })), width: verticalWidth, height: 110 + (events.length - 1) * 76, orientation: 'vertical' };
}
