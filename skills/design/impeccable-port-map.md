# Impeccable To RS Tools Design Port Map

Date: 2026-05-02

## Goal

Create a new RS Tools `design` skill inspired by Impeccable, without making Impeccable itself the runtime surface.

Porting stance:

- Lift Impeccable implementation language directly when the concept is portable and matches RS Tools.
- Adapt only where Impeccable assumes its own project model, command names, scripts, or web-only runtime.
- Keep the new skill stack-agnostic: SwiftUI, React, web, native, and future app surfaces.
- Prefer Steady and Capital Next repo truth over Impeccable-specific context files.

## Source Model

Impeccable's public docs describe one skill with 23 commands grouped as:

- Create: `/impeccable`, `craft`, `shape`
- Evaluate: `audit`, `critique`
- Refine: `animate`, `bolder`, `colorize`, `delight`, `layout`, `overdrive`, `quieter`, `typeset`
- Simplify: `adapt`, `clarify`, `distill`
- Harden: `harden`, `onboard`, `optimize`, `polish`
- System: `document`, `extract`, `live`, `teach`

Their core claim is precision through specific design disciplines. RS Tools should keep the discipline, not necessarily the command sprawl.

## RS Tools Design Skill Shape

Working name: `design`

Default lanes:

1. `shape`: understand the surface before changing it.
2. `build`: create or redesign a UI surface.
3. `critique`: judge the design and UX without editing by default.
4. `audit`: inspect technical UI quality and score concrete risks.
5. `polish`: make a functionally complete surface better.
6. `harden`: stress-test states, overflow, accessibility, responsive behavior, and real-world data.
7. `context`: create or refresh design context only when explicitly requested.
8. `mockup`: route to generated visual studies only when the user wants image options.

Possible sub-lenses inside those lanes:

- `typeset`
- `layout`
- `clarify`
- `adapt`
- `distill`
- `bolder`
- `quieter`
- `colorize`
- `animate`
- `delight`
- `optimize`
- `onboard`
- `extract`

These should not all become top-level commands at first.

## Command Port Table

| Impeccable capability | What it does | RS Tools decision | Why |
|---|---|---|---|
| `/impeccable` | Freeform design intelligence with shared design laws | Port with changes into `design` core | Strong central taste layer, but remove hard `PRODUCT.md` gate and Impeccable command naming. |
| `teach` | Creates strategic `PRODUCT.md`, offers `DESIGN.md` | Adapt into `context` lane | Useful discovery flow, but RS Tools should prefer existing repo artifacts and not require `PRODUCT.md`. |
| `document` | Generates spec-compliant `DESIGN.md` | Adapt strongly into `context` lane | Directly valuable for Steady/Capital Next when explicitly requested. Must respect existing `docs/DESIGN.md` conventions. |
| `shape` | Discovery interview and design brief before code | Port concept, integrate with `$scope` | Strong idea, but we already have Scope. Design should do design-specific shape, not duplicate all clarify/ideate behavior. |
| `craft` | Shape then build, with visual iteration | Adapt into `build` lane | Useful full-flow pattern, but RS Tools should not force 5-10 questions or block on separate confirmation for every build. |
| `audit` | Technical quality checks: a11y, performance, theming, responsive, anti-patterns | Port mostly directly into `audit` lane | High value. Make stack-agnostic and combine with design-audit's concise scorecard shape. |
| `critique` | UX/design review with heuristic scoring, cognitive load, persona checks, automated detection | Port with runtime changes | Very useful. Remove mandatory subagent isolation unless user authorizes delegation. Keep cognitive load and heuristic scoring. |
| `polish` | Final quality pass across visual alignment, type, interaction, motion, copy | Port directly into `polish` lane | Best fit for Steady and Capital Next. Keep "polish is last step" rule. |
| `harden` | Production readiness: edge cases, i18n, error states, overflow | Port directly into `harden` lane | Very high value for Steady. Make native/platform equivalents explicit. |
| `adapt` | Adapt an existing design across devices/contexts | Port into `harden` or `polish` lens | Useful, but not worth a top-level lane at first. |
| `clarify` | Improve UX copy, labels, errors, tooltips | Port as `copy` or `clarify` lens | Strong reference. Do not conflict with `$scope clarify`; call it UI copy clarity. |
| `distill` | Ruthless subtraction and simplification | Port as `distill` lens under `polish` | Useful for overloaded product surfaces. |
| `typeset` | Typography diagnosis and improvement | Port as dedicated reference/lens | Very high leverage. Keep product-vs-brand type distinction. |
| `layout` | Fix spacing, rhythm, hierarchy, composition | Port as dedicated reference/lens | High value. Should be one of the main reference files. |
| `colorize` | Strategic color, OKLCH, role-based color | Port selectively | Useful, but avoid web/CSS-only assumptions. |
| `animate` | Purposeful motion and micro-interactions | Port selectively | Good principles. Need platform-native variants for SwiftUI and web. |
| `bolder` | Make safe/generic designs more distinctive | Port as a refinement lens | Useful for brand/landing work; use carefully for product UI. |
| `quieter` | Reduce overstimulation without killing intent | Port as a refinement lens | Very useful for Steady; product UI often needs this. |
| `delight` | Add memorable details without breaking function | Port lightly | Useful but dangerous if overused. Keep as late-stage lens only. |
| `onboard` | First-run flows, empty states, activation | Port as product UX lens | Good for Steady empty states and Capital Next onboarding. |
| `optimize` | UI performance diagnosis and fixes | Adapt only | Web metrics like LCP/INP/CLS are not universal. Keep the principle, translate by platform. |
| `overdrive` | Ambitious visual effects: shaders, physics, cinematic transitions | Reference only | Rarely appropriate for Steady. Keep as optional inspiration for brand/hero surfaces. |
| `extract` | Pull reusable tokens/components into design system | Adapt later | Valuable, but belongs after design skill core is stable. |
| `live` | Browser element picker, 3 variants, write-back | Do not port initially | Powerful but tool/script-heavy and web-specific. Keep Impeccable copy as reference. |
| `pin` / `unpin` | Create shortcut skills for commands | Drop | Not aligned with RS Tools plugin architecture. |

## What To Directly Port

Direct port means preserve most of the implementation language and only replace:

- command names
- path assumptions
- `PRODUCT.md` hard requirements
- web-only details where a stack-agnostic equivalent is needed

Best direct ports:

1. `polish`
2. `harden`
3. `typeset`
4. `layout`
5. `distill`
6. `clarify` as UX copy clarity
7. `audit` structure, with output shape tightened
8. `critique` structure, with subagent requirements softened

## What To Adapt

Adapt these because the concept is strong but Impeccable's implementation assumes its own world:

- `/impeccable` core design laws
- `teach`
- `document`
- `shape`
- `craft`
- `adapt`
- `colorize`
- `animate`
- `bolder`
- `quieter`
- `onboard`
- `optimize`
- `extract`

## What To Drop Or Leave As Reference

- `pin` / `unpin`: writes skill shortcuts into harness directories.
- `live`: excellent but too tool-heavy and web-specific for the first RS Tools `design` skill.
- `overdrive`: keep as inspiration only; not a normal product UI path.

## Key RS Tools Differences

### 1. Context Discovery

Impeccable requires `PRODUCT.md` and treats `DESIGN.md` as optional but strongly recommended.

RS Tools should resolve context in this order:

1. user-provided request and attached references
2. repo instructions such as `AGENTS.md`
3. `docs/DESIGN.md` or local design docs
4. product specs, contexts, plans, review docs, route docs
5. existing UI code, tokens, components, screenshots
6. optional `PRODUCT.md` / `DESIGN.md` if a repo has them

If design context is missing, the skill should ask whether to create/refresh context. It should not block ordinary design work unless the task is too under-specified to proceed.

### 2. Product Bias

Steady and Capital Next are primarily product surfaces. Defaults should be:

- trust over spectacle
- clarity over drama
- native/platform feel over novelty
- resilient states over ornamental polish
- dense but readable hierarchy
- accessibility and long-content handling as first-class design concerns

Brand/landing work remains supported, but it is not the default taste center.

### 3. Stack Agnosticism

Impeccable often speaks web/CSS. RS Tools should phrase guidance in platform concepts first, then examples:

- typography hierarchy, not only CSS font-size
- responsive/adaptive layout, not only media queries
- reduced motion, not only `prefers-reduced-motion`
- focus/keyboard/touch equivalents by platform
- performance perception and runtime smoothness, not only LCP/INP/CLS

### 4. Explicit Invocation

`design` should be explicit-only:

```yaml
policy:
  allow_implicit_invocation: false
```

This skill is too broad to run implicitly.

### 5. Fewer Public Lanes

The public surface should not expose all 23 Impeccable commands. The internal references can preserve their implementation details, but the user-facing router should stay compact.

Recommended public lanes:

- `shape`
- `build`
- `critique`
- `audit`
- `polish`
- `harden`
- `context`
- `mockup`

## Proposed Skill Tree

```text
design/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── core-design-laws.md
    ├── product-vs-brand.md
    ├── shape.md
    ├── build.md
    ├── critique.md
    ├── audit.md
    ├── polish.md
    ├── harden.md
    ├── context.md
    ├── mockups.md
    ├── typeset.md
    ├── layout.md
    ├── copy-clarity.md
    ├── motion.md
    └── design-system.md
```

## First Implementation Recommendation

Create the first version of `design` with only:

- `SKILL.md`
- `agents/openai.yaml`
- `references/core-design-laws.md`
- `references/product-vs-brand.md`
- `references/critique.md`
- `references/audit.md`
- `references/polish.md`
- `references/harden.md`
- `references/context.md`

Then add specialized references only when the base skill feels too compressed.

## Open Questions

1. Should `design` create/refresh `docs/DESIGN.md`, or should that remain a separate explicit skill?
2. Should `mockup` live inside `design`, or should `interface-mockups` stay separate because it depends on image generation?
3. Should the first version include `build`, or should it focus on critique/polish/harden first?
4. Should Steady-specific design defaults live in this generic skill, or only in Steady repo docs?
