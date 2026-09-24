/** Deterministic geometry for report diagrams. Coordinates are in CSS pixels. */
const WIDTH = Object.freeze({ sans: 0.54, mono: 0.62 });
export function textWidth(text, size = 13, font = 'sans') {
  const unit = WIDTH[font] ?? WIDTH.sans;
  return [...String(text)].reduce((sum, char) => sum + (/[MW@#%]/.test(char) ? 1.35 : /[il.,:;| ]/.test(char) ? .55 : 1) * unit * size, 0);
}

export function layeredGraph(nodes, edges) {
  const entries = nodes.map((node, index) => typeof node === 'string' ? { id: node, label: node, index } : { ...node, id: String(node.id ?? node.label), label: String(node.label ?? node.id), index });
  if (entries.length > 12) throw new Error('layout: more than 12 nodes; use a table');
  const byId = new Map(entries.map((node) => [node.id, node]));
  if (byId.size !== entries.length) throw new Error('layout: node ids must be unique');
  const links = edges.map((edge) => Array.isArray(edge) ? { from: String(edge[0]), to: String(edge[1]), label: edge[2] == null ? '' : String(edge[2]) } : { ...edge, from: String(edge.from), to: String(edge.to), label: String(edge.label ?? '') });
  for (const edge of links) if (!byId.has(edge.from) || !byId.has(edge.to)) throw new Error('layout: edge references an unknown node');
  const layers = new Map(entries.map((node) => [node.id, 0]));
  // Forward edges establish longest-path layers. A back edge in a state machine
  // stays a routed return edge rather than causing unbounded growth.
  for (let pass = 0; pass < entries.length; pass++) {
    let moved = false;
    for (const edge of links) {
      if (byId.get(edge.from).index >= byId.get(edge.to).index) continue;
      const next = layers.get(edge.from) + 1;
      if (next > layers.get(edge.to)) { layers.set(edge.to, next); moved = true; }
    }
    if (!moved) break;
  }
  const buckets = [];
  for (const node of entries) (buckets[layers.get(node.id)] ??= []).push(node);
  for (let layer = 1; layer < buckets.length; layer++) {
    buckets[layer].sort((a, b) => {
      const bary = (node) => {
        const parents = links.filter((edge) => edge.to === node.id).map((edge) => buckets[layer - 1].findIndex((item) => item.id === edge.from)).filter((index) => index >= 0);
        return parents.length ? parents.reduce((sum, index) => sum + index, 0) / parents.length : node.index;
      };
      return bary(a) - bary(b) || a.index - b.index;
    });
  }
  const boxWidth = Math.max(120, ...entries.map((node) => Math.ceil(textWidth(node.label, 13, 'mono') + 32)));
  const gapX = Math.max(90, ...links.map((edge) => Math.ceil(textWidth(edge.label, 13) + 36)));
  const boxHeight = 48, gapY = 46, pad = 24;
  const maxRows = Math.max(...buckets.map((bucket) => bucket.length));
  const placed = buckets.flatMap((bucket, layer) => bucket.map((node, row) => ({ ...node, x: pad + layer * (boxWidth + gapX), y: pad + row * (boxHeight + gapY) + (maxRows - bucket.length) * (boxHeight + gapY) / 2, width: boxWidth, height: boxHeight, layer })));
  const positions = new Map(placed.map((node) => [node.id, node]));
  const routed = links.map((edge, index) => {
    const from = positions.get(edge.from), to = positions.get(edge.to);
    if (from.layer < to.layer) {
      const x0 = from.x + boxWidth, x1 = to.x;
      const y0 = from.y + boxHeight / 2, y1 = to.y + boxHeight / 2;
      const mid = (x0 + x1) / 2;
      return { ...edge, path: `M${x0},${y0} H${mid} V${y1} H${x1 - 6}`, labelX: mid, labelY: Math.min(y0, y1) - 8 };
    }
    const y0 = from.y + boxHeight, y1 = to.y + boxHeight;
    const lane = pad + maxRows * (boxHeight + gapY) + index * 20;
    return { ...edge, path: `M${from.x + boxWidth / 2},${y0} V${lane} H${to.x + boxWidth / 2} V${y1 + 6}`, labelX: (from.x + to.x + boxWidth) / 2, labelY: lane - 8 };
  });
  return { nodes: placed, edges: routed, width: pad * 2 + buckets.length * boxWidth + Math.max(0, buckets.length - 1) * gapX, height: pad * 2 + maxRows * (boxHeight + gapY) + links.length * 20 };
}

export function sequenceLayout(actors, events) {
  if (actors.length > 12) throw new Error('layout: more than 12 actors; use a table');
  const labels = actors.map(String);
  const width = Math.max(120, ...labels.map((label) => textWidth(label, 13) + 32));
  const gap = Math.max(110, ...events.map((event) => textWidth(event.label ?? '', 13) + 42));
  return { actors: labels.map((label, index) => ({ label, x: 24 + index * (width + gap) + width / 2 })), events: events.map((event, index) => ({ ...event, y: 96 + index * 64 })), width: 48 + labels.length * width + Math.max(0, labels.length - 1) * gap, height: 130 + events.length * 64 };
}

export function timelineLayout(events) {
  if (events.length > 12) throw new Error('layout: more than 12 events; use a table');
  const gap = Math.max(150, ...events.map((event) => textWidth(event.title ?? event.label ?? '', 13) + 40));
  return { events: events.map((event, index) => ({ ...event, x: 40 + index * gap })), width: 80 + Math.max(0, events.length - 1) * gap, height: 180 };
}
