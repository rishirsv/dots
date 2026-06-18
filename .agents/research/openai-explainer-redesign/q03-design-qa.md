# Q03 Design QA

## Question

Is the OpenAI-inspired v2 explainer visually and functionally superior for
issue-trace/debugging `unpack` use, and is it ready to inform a skill change?

## Inputs

- Design target: `.agents/research/openai-explainer-redesign/design.md`
- Old screenshot: `.agents/research/openai-explainer-redesign/screenshots/old-explainer-chrome.png`
- V2 screenshot: `.agents/research/openai-explainer-redesign/screenshots/v2-explainer-chrome.png`
- V2 artifact: `.agents/artifacts/star-tracker-hot-pixel-explainer-openai-v2.html`

## Findings

- [P2] Static top-chrome buttons created false affordances.
  Evidence: the initial v2 top chrome rendered `Evidence`, `Compare`, and
  `Copy next move`, but these controls were not all wired. This conflicted with
  the product-workbench target, where visible controls should be functional.
  Fix made: `Evidence` now anchors to `#evidence`, `Pressure` anchors to
  `#pressure`, and `Copy next move` uses `data-copy=".carry p"`.

- [P2] The prototype is an override layer, not yet a clean reusable skill
  template.
  Evidence: v2 is implemented as a CSS override on top of the current editorial
  starter kit. The rendered screenshot is strong, but source adoption should
  extract a clean neutral template rather than stacking product tokens over
  ivory/editorial tokens.
  Fix status: not fixed in the scratch artifact; this belongs in the execution
  plan before durable skill changes.

- [P3] Mobile evidence was incomplete in the first QA pass.
  Evidence: the first 390px capture showed the app bar action clipped at the
  right edge.
  Fix made: mobile now hides the app action group under 640px; grid children
  get `min-width: 0` so the diagram scrolls internally instead of stretching
  the inspector; mobile headline and lead line measures were tightened after
  screenshot review.

## Old Vs New

V2 is visually superior for debugging and issue-trace use. The old design reads
as a polished editorial article: warm paper, serif headline, decorative clay
emphasis, and a trace that begins mostly below the first viewport. That is
beautiful, but it delays the investigation.

V2 better matches the target user story. It puts the answer, confidence,
material, next move, navigation, and the first trace in the initial desktop
view. It also makes the explainer feel more like a product workbench: sans
typography, white surfaces, compact controls, thin dividers, neutral palette,
semantic green/rust, and an evidence inspector beside the trace.

## Required Fidelity Surfaces

- Fonts and typography: v2 matches the target direction with a sans stack,
  heavier product-style headline, compact labels, and no serif display type.
- Spacing and layout rhythm: v2 is denser and more tool-like; first viewport
  comprehension improves. The reusable source template should cleanly encode
  this spacing rather than overriding the old system.
- Colors and tokens: v2 follows neutral white/gray/near-black with restrained
  green/rust semantics. It avoids the old clay/ivory dominance.
- Image/diagram quality: the SVG remains code-native and appropriate for an
  explainer diagram. The trace appears earlier and is paired with an inspector.
- Copy/content: the answer, inspected material, confidence, and next move are
  clearer and more action-oriented in v2.

## Verdict

Direction passed. Prototype is suitable as evidence for changing the skill
direction, but the durable skill change should not copy this override artifact
as-is.

Final result: passed

## Final Validation Evidence

- Final desktop screenshot:
  `.agents/research/openai-explainer-redesign/screenshots/v2-explainer-final-chrome.png`
- Final mobile screenshot:
  `.agents/research/openai-explainer-redesign/screenshots/v2-mobile-final7.png`
- Desktop Chrome check: no console warnings/errors and no page-level horizontal
  scroll.
- Top chrome check: `Evidence` and `Pressure` are anchors; `Copy next move`
  triggers the copy primitive.
