# Typography

Typography carries information, hierarchy, and voice. Improve it inside the
established visual world; do not replace the identity unless the work is an
explicit redesign under [grounding.md](grounding.md).

## Fit The Surface

- **Expressive, marketing, and portfolio surfaces:** display type may carry the
  voice. Use decisive contrast and responsive scale when the composition
  benefits.
- **Product and reading surfaces:** stability, scanability, and measure come
  first. One well-tuned family and a fixed role scale are often right.
- **Native surfaces:** follow the platform and repository conventions, including
  user scaling and accessibility behavior.

Preserve confirmed families and improve their use. Introducing or replacing a
family changes identity when its voice becomes one of the surface's defining
materials; treat that as redesign, not polish.

## Assess Before Editing

Inspect representative screens and computed styles. Record concrete source or
rendered evidence for each question:

- **Authority and fit:** Which faces, weights, and roles are established? Do
  they fit this product and visual world, or are they unexamined defaults? Is
  every family necessary?
- **Hierarchy:** Can display, heading, body, label, metadata, and data roles be
  distinguished at a glance? Are adjacent sizes or weights too similar to carry
  different jobs?
- **Scale and consistency:** Is there a deliberate role scale, or a collection
  of arbitrary values? Do repeated roles remain identical across screens and
  states?
- **Reading:** Does prose stay within a comfortable measure? Are line height,
  paragraph rhythm, contrast, and tracking tuned to the actual face, width,
  language, and surface?
- **Stress:** What happens with long headings, localization expansion, browser
  zoom, Dynamic Type, narrow containers, missing weights, and font fallback?
- **Delivery:** Are only used assets loaded? Do fallback metrics, loading
  strategy, and variable-font settings avoid invisible text and disruptive
  reflow?

A mechanically consistent scale is a floor, not proof of good typography.

## Set The System

Before editing, state:

- the roles the interface needs;
- the intended contrast between adjacent roles;
- the reading measure and density;
- which existing faces and weights are authoritative;
- performance, localization, and accessibility constraints.

Use the fewest roles and families that make the hierarchy unmistakable. Combine
size, weight, space, width, case, and tone deliberately instead of asking size
alone to do every job. Name tokens by purpose rather than their current numeric
value.

Audit content typography separately from UI chrome. Buttons, tabs, inputs,
toolbars, sidebars, table cells, captions, status bars, command palettes, and
compact navigation have different density and truncation pressures from prose.

## Apply

- Keep ordinary web body copy at `1rem` / `16px` or larger unless a dense role,
  platform convention, or user setting justifies otherwise.
- Keep prose in a comfortable `45–75ch` measure. Wider lines generally need more
  leading, but tune line height to the face, width, language, and contrast
  rather than a universal ratio.
- For light text on dark surfaces, test whether the face needs slightly more
  line height, tracking, or weight to retain its perceived clarity.
- Keep repeated roles consistent across surfaces and states.
- Use tabular numerals, numeric alignment, code features, or label features when
  their content benefits.
- Load only the font assets and weights the product uses. Provide
  metric-compatible fallbacks, keep text visible during loading, and avoid
  disruptive layout shifts.
- Let expressive display type respond to available space when it strengthens the
  composition. Keep dense product and reading surfaces spatially predictable.
- Preserve browser zoom, user font settings, Dynamic Type, and platform text
  scaling. Do not lock line boxes or containers so scaling clips content.
- Use paragraph spacing or first-line indentation as the primary paragraph
  rhythm; combining both usually double-marks the boundary.

Do not make type decorative at the expense of comprehension or introduce a
second family without a role it alone can perform. Do not reject an established
family merely because it is common; repository authority and product fit matter
more than novelty.

## Verify

- Primary, secondary, body, and metadata roles are recognizable without reading
  the copy.
- Long text remains comfortable at all relevant widths and languages.
- Navigation, controls, tables, and data retain hierarchy under dense content.
- Typography belongs to this product and its established visual world.
- Loading creates neither invisible text nor disruptive reflow.
- Zoom, text scaling, focus, contrast, fallback, and reduced viewport paths
  remain usable.

Answer each applicable item with rendered or source evidence. Test actual copy,
long strings, localized expansion, fallback fonts, and the largest supported
text setting; do not substitute a bare “yes” for verification.
