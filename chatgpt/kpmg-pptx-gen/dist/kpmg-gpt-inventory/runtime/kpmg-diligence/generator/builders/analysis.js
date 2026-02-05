import { addAnalysisNarrowTable } from './table.js';

export function addAnalysis(pptx, slideSpec = {}) {
  // Currently, the spec's first analysis implementation target is analysisNarrowTable.
  // We keep this as a thin wrapper so additional analysis variants can be added without
  // changing the generator dispatcher.
  return addAnalysisNarrowTable(pptx, slideSpec);
}

