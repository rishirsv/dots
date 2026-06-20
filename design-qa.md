# Design QA: Explain v2 Redesign

status: passed

## Surfaces reviewed

- Reader fixture: `http://127.0.0.1:8787/explain-v2-kpmg-fixture.html`
- All-hands atlas: `http://127.0.0.1:8787/explain-v2-all-hands-fixture.html`
- Concept boards:
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/reader-concept-vs-render.png`
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/atlas-concept-vs-render.png`
- Final screenshots:
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/reader-final-desktop-top.png`
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/reader-final-desktop-proof.png`
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/reader-final-mobile-top.png`
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/atlas-final-desktop-top.png`
  - `/Users/rishi/Code/dots/.agents/audits/explain-v2-redesign/atlas-final-desktop-evidence.png`

## Final judgment

The reader fixture is now an article-like explainer instead of a component
inventory. It opens with answer, lead, and one inline provenance sentence, then
moves directly into the full-width model. The short-page TOC, sticky section
rail, appbar, metadata grids, generic footer, slash labels, and duplicate proof
surfaces were removed.

The atlas is now the explicit inventory surface. It can label primitives by job,
show every component family, and carry the heavier reference layout without
polluting real reader explainers.

## Adversarial checks

- Internal/system text: passed for the reader. Browser checks found no visible
  `fixture`, `template`, `generator`, token-source, slash-label, metadata-grid,
  or footer language.
- Redundant information: passed. The reader no longer repeats the same section
  set as top TOC plus side nav, and proof is one code panel plus rows rather
  than inspector plus list plus table.
- Layout containment: passed at desktop and mobile. Page `scrollWidth` equals
  viewport width, and no visible content bleeds beyond the viewport.
- Vertical reading: passed. Objects now stack in a single reading column, with
  side-by-side layout reserved for the proof comparison where it earns its keep.
- Design distinctiveness: passed. The system uses restrained editorial scale,
  source-anchored rows, and full-width diagrams rather than cards with accent
  bars or dashboard decoration.
- Atlas completeness: passed. The all-hands fixture shows reader shell,
  evidence, reasoning, data, interaction, and recommendation primitives.

## Intentional deviations from image concepts

- No KPMG logo or simulated firm letterhead: the KPMG variant uses sourced color
  tokens only. The explainer should not impersonate brand assets.
- Less chrome than the atlas concept: the reader fixture is deliberately sparse;
  the atlas carries the component inventory.
- Atlas labels are allowed because it is a reference surface. Reader pages
  should not show class names or design-system labels.
