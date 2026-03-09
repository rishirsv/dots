import path from 'node:path';

import PptxGenJS from 'pptxgenjs';

import { addAnalysisNarrowTable } from '../../generator/builders/analysis-narrow-table.js';

const outPath = process.argv[2] || path.join(process.cwd(), 'outputs', 'dev-analysis-narrow-sample.pptx');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'KPMG_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'KPMG_WIDE';

addAnalysisNarrowTable(pptx, {
  title: 'Analysis Narrow Sample',
  strapline: 'Sample narrow-table render used for quick visual checks',
  table: {
    headers: ['Metric', 'FY2024', 'FY2025', 'FY2026E'],
    rows: [
      ['Revenue', '$120M', '$145M', '$162M'],
      ['EBITDA', '$21M', '$28M', '$33M'],
      ['Gross Margin', '41.0%', '43.2%', '44.1%'],
      ['Net Working Capital Days', '62', '58', '55']
    ]
  }
});

await pptx.writeFile({ fileName: outPath });
console.log(`Generated: ${outPath}`);
