/** Diagram gallery content comes from the registry and report helper examples. */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { helpers, meta, resetFigureIds } from './kits/report.mjs';

const registry = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'registry');
const figures = JSON.parse(readFileSync(join(registry, 'diagram-examples.json'), 'utf8'));

export const diagramCount = figures.length;

function renderExpression(expression) {
  const names = Object.keys(helpers);
  const value = new Function(...names, `return (${expression});`)(...names.map((key) => helpers[key]));
  return Array.isArray(value) ? value.map(String).join('') : String(value.body ?? value);
}

export const helperExample = (name) => renderExpression(meta[name].example);

export function diagramFigures({ atlas = false } = {}) {
  resetFigureIds();
  return `<div class="diagram-grid">\n${figures.map((figure) => {
    const id = atlas ? `diagram-template-${figure.id}` : figure.id;
    const markup = figure.example ? renderExpression(figure.example) : figure.helper ? helperExample(figure.helper) : figure.markup;
    return `    <figure id="${id}" class="diagram-card" data-diagram="${figure.id}"><h2>${figure.title}</h2><p class="diagram-use">${figure.use}</p>\n      ${markup}\n    </figure>`;
  }).join('\n\n')}\n  </div>`;
}

export function diagramStyles({ components = true } = {}) {
  const gallery = readFileSync(join(registry, 'diagram-gallery.css'), 'utf8').replace(/[ \t]+$/gm, '');
  const names = ['flow-diagram', 'bar-chart', 'line-chart', 'stacked-chart'];
  const styles = components ? names.map((name) => readFileSync(join(registry, `${name}.html`), 'utf8').match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').join('\n') : '';
  return `<style>${gallery}\n${styles}\n.diagram-card .chart-card{border:0;padding:0;margin:0}.diagram-card .flow-diagram-wrap{margin:0}.diagram-card:is([data-diagram="flowchart"],[data-diagram="state-machine"],[data-diagram="sequence"],[data-diagram="timeline"],[data-diagram="line-chart"]){grid-column:1/-1}</style>`;
}
