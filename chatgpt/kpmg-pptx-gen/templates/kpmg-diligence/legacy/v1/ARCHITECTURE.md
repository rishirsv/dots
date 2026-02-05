# KPMG PptxGenJS Template Layer — Architecture & Reference

## What This Project Does

This project encodes the KPMG `generic_template.pptx` design system (colors, fonts, layouts, gradients, logos) into a single JavaScript library (`kpmg-deck.js`) that programmatically generates brand-compliant PowerPoint decks using PptxGenJS.

The target use case is ChatGPT Code Interpreter: upload `kpmg-deck.js` as a single file and the LLM can produce branded KPMG decks without needing the original `.pptx` template.

---

## How We Built It

### Step 1: Template Analysis

The KPMG `generic_template.pptx` was reverse-engineered using `python-pptx` scripts (in the Lingo project). The `.pptx` file is a ZIP archive containing XML files. We extracted:

- **Theme colors** from `ppt/theme/theme1.xml` — the `<a:clrScheme>` node defines 10 scheme colors plus 18 custom KPMG brand colors in `<a:custClrLst>`
- **Font definitions** — major font: "KPMG Bold" (proprietary), minor font: "Arial" (brand fallback)
- **Slide dimensions** — 10.0" x 7.5" (custom 4:3 layout, not standard 13.33" widescreen)
- **Layout geometry** — every placeholder's position and size in EMU (English Metric Units), converted to inches by dividing by 914400
- **Background types** — which layouts use solid fills vs. gradient fills vs. inherited-from-master
- **Decorative elements** — gradient rectangles, logo images, banner shapes, social icon groups

The key analysis scripts were:
- `lingo/tools/analyze_template.py` — extracts shape positions, types, text content per slide
- `lingo/tools/extract_template_poc.py` — generates `tokens.json` with colors, fonts, and all placeholder geometry

### Step 2: Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Positioning | Direct `x,y,w,h` | PptxGenJS placeholders are unreliable for custom layouts |
| Gradients | Pre-rendered PNG images | PptxGenJS has no gradient fill API (open issue since 2017) |
| Font | Arial throughout | KPMG Bold is proprietary; Arial is the brand-approved fallback |
| Module format | CommonJS (`require`) | Matches existing codebase and ChatGPT Code Interpreter environment |
| Packaging | Single file with embedded base64 | No separate image uploads needed for ChatGPT |
| Chart support | Type string → PptxGenJS enum mapping | Pass-through for unknown options; sensible KPMG-colored defaults |

### Step 3: Asset Generation

Since PptxGenJS cannot render gradients, we pre-render them as PNG images using `sharp` (an SVG-to-PNG rasterizer):

1. Construct inline SVG strings with `<linearGradient>` definitions
2. Feed SVG buffers through `sharp().png().toBuffer()`
3. Base64-encode the resulting PNGs
4. Store in `output/assets.json` for the main library to lazy-load

Three gradients are generated:
- **Cover gradient** (997×701 px) — `#1E49E2` → `#7213EA` top-to-bottom, placed at `(0.819", 1.325")`
- **Section gradient** (930×701 px) — same colors, slightly narrower
- **Closing gradient** (1440×1080 px) — `#7213EA` → `#1E49E2` diagonal, full-slide background

Two logo placeholders are also generated (simplified "KPMG" text rendered via SVG). Real deployments should replace these with actual extracted logo PNGs from the template.

### Step 4: Library Construction

`kpmg-deck.js` was built in five sections:

1. **TOKENS** — all color codes, font name, text sizes, spacing
2. **ASSETS** — lazy-loading system that reads `output/assets.json` at runtime
3. **LAYOUTS** — geometry constants for all 9 slide types (positions in inches)
4. **KPMGDeck class** — constructor, 5 master definitions, 9 public slide methods, 6 private helpers
5. **EXPORTS** — `module.exports = KPMGDeck` with static `TOKENS` and `LAYOUTS` attached

### Step 5: Verification

`demo.js` generates a 10-slide deck exercising every slide type, producing `output/kpmg-demo-deck.pptx` (~350 KB).

---

## File Structure

```
kpmg-pptx-gen/
├── package.json              # Dependencies: pptxgenjs + sharp
├── kpmg-deck.js              # Main library (858 lines, ~25 KB)
├── demo.js                   # 10-slide sample deck (263 lines)
├── scripts/
│   └── extract-assets.js     # One-time gradient/logo PNG generator
└── output/
    ├── assets.json            # Base64 PNGs consumed by kpmg-deck.js
    ├── assets-snippet.js      # Copy-paste JS version (convenience only)
    └── kpmg-demo-deck.pptx    # Generated demo deck
```

---

## Dependencies

### pptxgenjs (v3.12.0)

**What it does:** Pure-JavaScript library for creating PowerPoint (.pptx) files. It constructs the XML inside the PPTX ZIP archive programmatically.

**Key APIs we use:**

| Method | Purpose |
|--------|---------|
| `new PptxGenJS()` | Create a presentation instance |
| `.defineLayout({ name, width, height })` | Register custom slide dimensions |
| `.defineSlideMaster({ title, background, objects })` | Define reusable slide templates with backgrounds and fixed objects |
| `.addSlide({ masterName })` | Add a slide inheriting from a master |
| `slide.addText(content, options)` | Add text box at position with styling |
| `slide.addImage({ data, x, y, w, h })` | Add base64-encoded image |
| `slide.addShape(ShapeType, options)` | Add geometric shape (rectangles, etc.) |
| `slide.addChart(ChartType, data, options)` | Add chart (bar, line, pie, etc.) |
| `.writeFile({ fileName })` | Write .pptx to filesystem |
| `.write({ outputType: 'nodebuffer' })` | Get .pptx as Node Buffer |

**Key PptxGenJS concepts:**
- `ChartType` enum — `bar`, `bar3D`, `line`, `pie`, `doughnut`, `area`, `scatter`, `radar`
- `ShapeType` enum — `rect`, `ellipse`, etc.
- Text content can be a string or an array of `{ text, options }` objects for mixed formatting
- Bullets are controlled via `options.bullet` with Unicode code points
- `indentLevel` controls bullet nesting (0 = top level, 1 = sub-bullet)
- Background can be `{ color: 'RRGGBB' }` or `{ data: 'data:image/png;base64,...' }`
- Slide master `objects` array supports `{ image: {...} }`, `{ rect: {...} }`, `{ text: {...} }`

**Transitive dependencies:**
- `jszip` (v3.10.1) — creates the ZIP container that PPTX files are
- `image-size` (v1.2.1) — detects image dimensions for automatic sizing
- `pako` (v1.0.11) — zlib compression inside jszip

### sharp (v0.33.5)

**What it does:** High-performance image processing library built on libvips (a C library). We use it solely as an SVG-to-PNG rasterizer in `extract-assets.js`.

**Key APIs we use:**

| Method | Purpose |
|--------|---------|
| `sharp(Buffer.from(svgString))` | Create instance from SVG buffer |
| `.png()` | Set output format to PNG |
| `.toBuffer()` | Export processed image as Node Buffer |
| `.flatten({ background })` | Flatten alpha channel (used for logo transparency) |

**Important notes:**
- Sharp includes **native binaries** (~63 MB on disk with platform-specific `.node` files)
- Requires **Node.js >= 18.17.0** (not enforced in package.json)
- Only used at **asset-generation time** — `kpmg-deck.js` itself never imports sharp
- Could be moved to `devDependencies` since `output/assets.json` can be pre-generated and committed

**Transitive dependencies:**
- `@img/sharp-darwin-arm64` (platform-specific native binding)
- `@img/sharp-libvips-darwin-arm64` (the libvips C library)
- `color` / `color-convert` / `color-string` — color space utilities
- `detect-libc` — detects system C library for correct binary selection
- `semver` — version comparison for binary compatibility checks

---

## Design Tokens

### Theme Scheme Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `dk1` | `000000` | Body text |
| `dk2` | `00338D` | KPMG Blue (primary brand color) |
| `lt2` | `E5E5E5` | Light gray backgrounds |
| `accent1` | `1E49E2` | Bright blue (gradients, banner fills) |
| `accent2` | `00338D` | KPMG Blue (duplicate for accent slot) |
| `accent3` | `0C233C` | Dark navy |
| `accent4` | `00B8F5` | Light blue accent |
| `accent5` | `7213EA` | Purple (gradients) |
| `accent6` | `FD349C` | Hot pink |

### Brand Colors

| Name | Hex |
|------|-----|
| KPMG Blue | `00338D` |
| Medium Blue | `005EB8` |
| Light Blue | `0091DA` |
| Violet | `483698` |
| Purple | `470A68` |
| Light Purple | `6D2077` |
| Green | `00A3A1` |

### Typography

- **Font:** Arial (KPMG Bold is proprietary; Arial is the brand-approved fallback)
- **Title:** 18pt, KPMG Blue, bold
- **Cover/section title:** 40pt, white, bold
- **Body:** 15pt, black
- **Small/footnotes:** 10pt
- **Notes:** 6pt
- **Paragraph spacing:** 6pt after
- **Bullets:** Unicode `U+2022` (bullet), sub-bullets: `U+2013` (en-dash)

---

## Slide Masters

| Master | Background | Fixed Objects | Used By |
|--------|-----------|---------------|---------|
| `KPMG_COVER` | Solid `00338D` | — | Cover slide |
| `KPMG_SECTION` | Solid `00338D` | — | Section dividers |
| `KPMG_WHITE` | Solid `FFFFFF` | Blue logo in footer | OneCol, TwoCol, TextChart, ColChart, 3ColChart |
| `KPMG_BANNER` | Solid `FFFFFF` | Blue rect banner `(0, 0, 10, 2.902)` | Process 4-column |
| `KPMG_CLOSING` | Gradient PNG image | White logo | Closing slide |

Cover and section slides add their gradient rectangles and logos dynamically in the `addCover()`/`addSection()` methods rather than in the master, because PptxGenJS master objects don't support conditional rendering.

---

## Layout Geometry (all values in inches)

### Cover
| Element | x | y | w | h |
|---------|---|---|---|---|
| Gradient rect | 0.819 | 1.325 | 6.921 | 4.865 |
| Logo | 0.819 | 0.472 | 0.860 | 0.346 |
| Title | 1.089 | 1.656 | 6.378 | 3.150 |
| Subtitle | 1.089 | 5.034 | 6.378 | 0.886 |

### Section Divider
| Element | x | y | w | h |
|---------|---|---|---|---|
| Gradient rect | 0.816 | 1.325 | 6.455 | 4.866 |
| Number | 1.075 | 1.699 | 0.981 | 0.790 |
| Title | 1.075 | 2.739 | 5.023 | 1.776 |
| Subtitle | 1.075 | 4.884 | 5.023 | 0.886 |

### Content Slides (white background)

**One Column:** Title `(0.823, 0.472, 8.354, 0.567)`, Body `(0.823, 1.323, 8.354, 5.024)`

**Two Column:** Title same, Left `(0.823, 1.323, 4.075, 5.024)`, Right `(5.102, 1.323, 4.075, 5.024)`

**Text + Chart:** Title same, Text `(0.823, 1.323, 4.075, 5.024)`, Chart `(5.102, 1.323, 4.075, 5.024)`

**One Column Chart:** Title same, Body `(0.823, 1.323, 8.354, 2.402)`, Chart `(0.823, 3.945, 8.354, 2.402)`

**Three Column Chart:** Title same, 3 text boxes at y=1.323 (w=2.614 each, spaced at x=0.823/3.693/6.563), 3 charts at y=3.945 (same x positions)

### Process 4-Column
| Element | x | y | w | h |
|---------|---|---|---|---|
| Banner | 0 | 0 | 10 | 2.902 |
| Title | 0.823 | 0.472 | 8.354 | 0.567 |
| Subtitle | 0.823 | 1.325 | 8.363 | 0.567 |
| Columns (×4) | 0.823/2.955/5.088/7.221 | 2.101 | 1.965 | 4.246 |

### Closing
| Element | x | y | w | h |
|---------|---|---|---|---|
| Logo | 0.819 | 0.472 | 0.860 | 0.346 |
| Disclaimer | 0.819 | 3.996 | 6.841 | 2.016 |
| URL | 0.820 | 6.181 | 3.026 | 0.168 |

---

## Public API Quick Reference

```js
const KPMGDeck = require('./kpmg-deck');
const deck = new KPMGDeck({ title, author, company, subject });

// Slide methods — each returns the PptxGenJS slide object
deck.addCover({ title, subtitle, date })
deck.addSection({ number, title, subtitle })
deck.addOneColumn({ title, body })
deck.addTwoColumn({ title, left, right })
deck.addTextWithChart({ title, body, chart })
deck.addOneColumnChart({ title, body, chart })
deck.addThreeColumnChart({ title, columns: [{ text, chart }] })
deck.addProcess({ title, subtitle, columns: [{ heading, body }] })
deck.addClosing({ disclaimer, url })

// Output
await deck.write('output.pptx')     // write to file
const buf = await deck.toBuffer()   // get as Buffer

// Static access
KPMGDeck.TOKENS   // color/font/size constants
KPMGDeck.LAYOUTS  // geometry constants
deck.pptx         // underlying PptxGenJS instance
```

### Content Formats

Body/text parameters accept:

```js
// Plain string
'This is a paragraph'

// Array of strings → bullet points
['First bullet', 'Second bullet', 'Third bullet']

// Rich text object
{ text: 'Bold heading', bold: true, color: '00338D' }

// Mixed array with sub-bullets
[
  'Top-level bullet',
  { text: 'Bold item', bold: true },
  ['Sub-bullet 1', 'Sub-bullet 2'],   // nested array = indented sub-bullets
]
```

### Chart Format

```js
{
  type: 'bar',  // 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'radar'
  data: [
    { name: 'Series 1', labels: ['A', 'B', 'C'], values: [10, 20, 30] },
  ],
  opts: {
    barDir: 'col',        // PptxGenJS chart options passed through
    showValue: true,
    barGrouping: 'stacked',
  },
}
```

Default chart colors follow the KPMG palette: KPMG Blue → Bright Blue → Light Blue → Purple → Pink → Green → Medium Blue.

---

## Potential Improvements

### High Priority

1. **Replace placeholder logos with real KPMG logos.** The current logos are SVG-rendered "KPMG" text in Arial. The actual logos (`image1.png` and `image3.png`) exist inside `generic_template.pptx` and could be extracted as base64 via `extract-assets.js` using `adm-zip` or similar.

2. **Move `sharp` to `devDependencies`.** Sharp is 63 MB of native binaries and is only needed to run `extract-assets.js` once. The generated `output/assets.json` can be committed, making sharp unnecessary at install time. For the ChatGPT single-file use case, the base64 assets would be inlined directly into `kpmg-deck.js`.

3. **Add `.gitignore`.** Should ignore `node_modules/`, `output/kpmg-demo-deck.pptx`, and `.DS_Store`. The `output/assets.json` should probably be tracked since it's a build artifact that the library depends on.

4. **Inline assets for ChatGPT deployment.** For the single-file use case, `assets.json` should be inlined directly into `kpmg-deck.js` (replacing the lazy-loading `_loadAssets()` function with a static `ASSETS` constant). The `output/assets-snippet.js` file was generated for exactly this purpose.

### Medium Priority

5. **Add the full 18 custom KPMG colors to TOKENS.** The library currently includes 7 brand colors. The template defines 18 custom colors (adding darkGreen, lightGreen, yellow, orange, red, pink, darkBrown, lightBrown, olive, beige, lightPink). These are useful for chart series coloring.

6. **Extract actual logos from the template.** Write an extraction step in `extract-assets.js` that uses `adm-zip` to read `ppt/media/image1.png` (blue logo, 566×228 px) and `ppt/media/image3.png` (white logo, 566×228 px) directly from the `.pptx` file, converting them to base64.

7. **Add footer "Confidential" text.** The LAYOUTS define a `footer.confidential` zone at `(1.586, 6.921)` but no slide method renders text there. Adding an optional `confidential: true` flag to the constructor would enable this.

8. **Support `addTable()`.** PptxGenJS supports tables, and KPMG FDD reports use them heavily (QoE bridges, NWC summaries, financial tables). A `deck.addOneColumnTable()` or general-purpose table method would be valuable.

9. **Enforce Node version.** Add `"engines": { "node": ">=18.17.0" }` to `package.json`. Sharp 0.33.x requires this minimum.

### Low Priority

10. **Add `bubble` and `bubble3D` chart types.** The chart type map currently handles 8 types; PptxGenJS also supports bubble charts.

11. **Remove redundant `_loadAssets()` call.** The constructor calls `_loadAssets()` at line 225 (discarding the return value) then calls it again inside `_defineMasters()`. The first call is unnecessary.

12. **Optimize closing gradient size.** The closing gradient PNG is 1440×1080 px (~63 KB encoded), much larger than the other gradients. Since PptxGenJS stretches images to fit, a smaller image (e.g., 200×150 px) would produce an identical visual result at ~2 KB.

13. **Add slide notes.** PptxGenJS supports `slide.addNotes('text')` for speaker notes. This could be useful for LLM-generated decks where the AI explains its reasoning in the notes.

14. **Add tests.** Verify that each slide method produces a valid slide, that TOKENS/LAYOUTS are correctly structured, and that the output PPTX is a valid ZIP file with expected XML contents.
