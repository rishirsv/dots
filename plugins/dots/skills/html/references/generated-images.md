# Generated images in HTML artifacts

Read this when an original raster image would materially improve a page. This
is the HTML integration contract; the `imagegen` skill owns generation mode,
prompting, editing, transparency, save paths, and image-level validation.

## Decide whether an image earns its place

Use `imagegen` for a purposeful photo, illustration, texture, product mockup,
or other raster visual that helps the reader understand or feel the subject.
Keep charts, process diagrams, exact UI evidence, code, and text-heavy visuals
in HTML, CSS, SVG, or supplied screenshots where their content stays exact and
inspectable. Never generate imagery to fill an empty layout slot or decorate a
page whose story is already clear.

Before generating, write a short visual brief:

- the reader question or idea the image serves;
- its role and placement: focal `wide-figure` or supporting
  `evidence-gallery` item;
- the required aspect ratio, crop, focal point, and useful negative space;
- the subject, medium, mood, and only the constraints the source supports;
- `no text, no logos, no watermark` unless exact in-image text is essential.

## Generate, select, and persist

1. Load and follow the current `imagegen` skill. Use its built-in path by
   default and preserve its confirmation boundary for CLI or native
   transparency fallbacks.
2. Generate for the intended placement rather than creating a generic image
   first and trying to crop it into the page later.
3. Inspect the result for subject accuracy, composition, unwanted text or
   marks, and consistency with the artifact's calm, restrained identity.
   Iterate with one targeted change when needed.
4. Copy the selected final into the workspace beside the body fragment or in a
   workspace-owned artifact-assets directory. A project-bound image must not
   remain only in the generator's default output location.
5. Resize or optimize near the largest rendered size before embedding. Prefer
   one decisive image over several large variants; do not embed a 4K source
   when the page renders it near 1040px.

Generated imagery is illustrative, not evidence of a factual claim. Use a
caption to identify an illustration when a reader could reasonably mistake it
for observed evidence. Never invent a screenshot, chart, person, product state,
or research result and present it as sourced material.

## Embed through the assembler

Reference the workspace copy from the body fragment with
`data-embed-src`. The path is relative to the body file; the assembler replaces
it with a data URI and removes the local path from the final page.

```html
<figure data-component="wide-figure" class="wide-figure">
  <img
    data-embed-src="./artifact-assets/focal.webp"
    alt="A field researcher organizing interview notes at a quiet desk"
    decoding="async"
    loading="lazy">
  <figcaption>The illustration establishes the research setting; the findings below come from the cited interviews.</figcaption>
</figure>
```

Use `loading="eager"` for an image visible in the first viewport and
`loading="lazy"` below it. Meaningful images need concise alt text describing
what is visibly present; captions explain why the reader should notice it.
Decorative images should normally be omitted, not shipped with empty alt text.

The normal assembly command embeds the asset automatically:

```bash
node scripts/assemble.mjs \
  --title "Research brief" \
  --components wide-figure \
  --body /path/to/body.html \
  --out /path/to/research-brief.html
```

## Verify the integrated result

- The final HTML contains a `data:image/...` source, no `data-embed-src`, no
  local path, and no external image request.
- The crop, focal point, caption, and alt text still make sense at 1280, 768,
  360, and 320px in light and dark modes.
- The image does not contain invented evidence, broken text, logos, watermarks,
  or unintended generator artifacts.
- Its decoded dimensions and encoded size are proportionate to the rendered
  role; the first useful content is not delayed by a decorative asset.
- The page remains complete with JavaScript disabled and honors reduced motion.
