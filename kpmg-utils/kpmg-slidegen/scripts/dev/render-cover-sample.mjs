import path from 'node:path';

import PptxGenJS from 'pptxgenjs';

import { addCover } from '../../generator/builders/cover-slide.js';

const outPath = process.argv[2] || path.join(process.cwd(), 'outputs', 'dev-cover-sample.pptx');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'KPMG_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'KPMG_WIDE';

addCover(pptx, {
  title: 'Project Atlas',
  subtitle: 'Sample cover render for layout checks',
});

await pptx.writeFile({ fileName: outPath });
console.log(`Generated: ${outPath}`);
