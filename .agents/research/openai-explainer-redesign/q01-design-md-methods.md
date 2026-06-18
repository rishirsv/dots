# DESIGN.md Methods From Websites

## Question

Find a skill, instruction set, or repeatable method for creating a `DESIGN.md` / `design.md` from any website, with emphasis on what sections it should include and how an agent should extract tokens from a site.

## Scope

- Source class: current web sources and public GitHub/tool docs only.
- Source budget: 5-7 sources, favoring primary repos/docs and recent public tooling.
- Stop condition: enough evidence to propose a practical `DESIGN.md` structure for parent synthesis.
- Date researched: 2026-06-18.

## Answer

There is a practical repeatable method, but it is still an emerging convention rather than a mature standard. The strongest current pattern is:

1. Use the Google Labs `design.md` draft format as the document structure.
2. Render the target site with a real browser, preferably through Playwright/Chromium or an extraction CLI that uses it.
3. Extract observed design primitives from computed DOM styles and CSS sources.
4. Normalize values into machine-readable tokens, ideally compatible with DTCG/Style Dictionary conventions.
5. Write exact observed values into YAML front matter and reserve Markdown body sections for human-readable intent, usage, and guardrails.
6. Attach confidence and coverage notes, and omit sections or values that were not observed.

### Practical `DESIGN.md` structure

Use this structure for parent synthesis:

```markdown
---
version: alpha
name: <brand-or-site-name>
description: <brief observed product/design identity>
source:
  url: <primary-url>
  capturedAt: <ISO date/time>
  pages:
    - <url>
  viewports:
    - desktop
    - mobile
  confidence: <high|medium|low>
colors:
  primary: "#..."
  secondary: "#..."
typography:
  body-md:
    fontFamily: <family>
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
spacing:
  xs: 4px
  sm: 8px
rounded:
  sm: 4px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
---

# <Brand or Product> Design

## Overview

Observed brand personality, density, audience, visual hierarchy, source coverage, and confidence caveats.

## Colors

Semantic palette roles, usage rules, contrast notes, and when not to use accent colors.

## Typography

Font families, type scale, role names, weights, line heights, letter spacing, and usage guidance.

## Layout

Spacing rhythm, grid/container behavior, breakpoints, page density, and responsive behavior.

## Elevation & Depth

Observed shadows, tonal layering, borders, blur, translucency, or explicit flat-design alternatives.

## Shapes

Radius scale, pill/square usage, border widths, and shape language.

## Components

Observed atoms and common variants: buttons, links, inputs, cards, nav, badges/chips, lists, tooltips, modals, and visible states.

## Do's and Don'ts

Concrete guardrails grounded in observed evidence.
```

Keep `source`, `pages`, `viewports`, and `confidence` as extraction metadata. They are useful for agents, but they are an extension beyond the core Google draft schema, so a stricter consumer may ignore or reject them. If strict compatibility matters, fold those notes into `## Overview` instead.

### Agent extraction method

Facts from sources support this extraction workflow:

1. Confirm the site is public and permitted to fetch. Prefer owned or authorized properties.
2. Pick representative URLs. At minimum, capture the homepage. For a fuller system, crawl navigation/header/footer links or sitemap URLs and merge results.
3. Render in a real browser. Capture desktop and mobile viewports, and explicitly request dark mode if needed.
4. Wait for hydration/stabilization before sampling DOM styles.
5. Sample visible, repeated, and semantically important elements: logo/header, hero, primary actions, secondary actions, body text, cards/surfaces, forms, nav, footer, and common content blocks.
6. Read computed styles and matched CSS rules. Extract:
   - colors: text, background, border, gradients, CSS variables, semantic usage contexts
   - typography: rendered font family, platform font usage, font size, weight, line height, letter spacing
   - spacing: margins, padding, gaps, container widths, layout rhythm
   - shape: border radius, border width, border style
   - elevation: box shadows, layered backgrounds, blur/translucency where visible
   - motion: transition durations, easing curves, hover/focus deltas
   - components: buttons, inputs, links, cards, badges, nav, state variants
   - breakpoints: media queries and observed responsive differences
7. Rank candidate tokens by frequency, semantic context, CSS custom property names, recurrence across pages, and viewport stability.
8. Normalize tokens into stable names. Use core `DESIGN.md` token groups for `colors`, `typography`, `spacing`, `rounded`, and `components`. Use DTCG-compatible JSON as a sidecar or internal intermediate when richer types such as `shadow`, `transition`, `border`, or `gradient` need precise typing.
9. Do not invent tokens or component rules. If a value is missing, either omit it or mark it as a low-confidence inference.
10. Write the Markdown prose after reviewing the normalized values, so the prose describes observed patterns rather than guessed brand strategy.

### Facts

- The Google Labs `design.md` draft defines `DESIGN.md` as a self-contained plain-text design system with optional YAML front matter for machine-readable tokens and Markdown body sections for human-readable rationale and guidance.
- The draft section order is: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.
- The draft front matter schema includes `version`, `name`, optional `description`, `colors`, `typography`, `rounded`, `spacing`, and `components`.
- Dembrandt has a current `--design-md` command that generates a `DESIGN.md` for AI agents from a website. Its README says the export follows the Google draft with YAML design tokens in front matter plus ordered Markdown guidance sections.
- Dembrandt extracts more than the current Google core schema: colors, typography, spacing, borders, shadows, motion, components, breakpoints, icons/frameworks, and optional WCAG contrast data. It also supports `--crawl`, `--sitemap`, `--mobile`, `--dark-mode`, `--dtcg`, and `--design-md`.
- `extract-design-system` is a public agent skill and CLI for extracting starter tokens from a public website. It outputs raw, normalized, JSON token, and CSS custom property artifacts, and explicitly warns that a single page is not proof of a whole design system.
- The 2025.10 Design Tokens Community Group format specifies typed JSON tokens with `$value`, optional/inherited `$type`, `$description`, and composite token types including border, transition, shadow, gradient, and typography.
- Style Dictionary v4 can consume either legacy Style Dictionary token syntax or DTCG syntax, but its docs say to pick one format because the two cannot be mixed inside one Style Dictionary instance.
- Chrome DevTools Protocol exposes `CSS.getComputedStyleForNode`, `CSS.getMatchedStylesForNode`, stylesheet text, background colors, platform font usage, media queries, pseudo-state forcing, and rule usage tracking, which are enough primitives to implement extraction manually.

### Inferences and recommendations

- The most interoperable `DESIGN.md` should keep exact values in front matter and use prose only for interpretation and guardrails. This follows the Google draft's "tokens are values, prose is context" split.
- For richer extraction, maintain a DTCG-compatible internal or sidecar token file and project only the most agent-useful subset into `DESIGN.md`.
- Multi-page extraction should be preferred over one-page extraction when the target site has pricing, docs, app, marketing, or account flows with different component vocabularies.
- A good agent-generated `DESIGN.md` should include confidence and coverage notes, because both Dembrandt and `extract-design-system` document limitations around dynamic sites, partial pages, JavaScript-heavy content, and DOM visibility.
- The agent should score tokens rather than merely list values. Repeated values across pages, named CSS variables, primary interactive elements, and logo/header contexts are stronger evidence than incidental one-off styles.
- Avoid using extracted third-party brand tokens to recreate a trademarked identity unless the user owns the property or has permission. Dembrandt's intended-use note explicitly frames analysis around public CSS/computed styles for documentation, learning, and permitted analysis.

## Key Evidence

- Google Labs `design.md` spec: `DESIGN.md` contains optional YAML front matter plus Markdown body; front matter holds machine-readable design tokens; prose gives rationale and application context; the section order is Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. Source: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
- Dembrandt README: provides `--design-md`, says it generates a `DESIGN.md` for AI agents, follows Google's draft format, stores exact observed values in YAML front matter when available, and omits unsupported sections rather than inventing defaults. Source: https://github.com/dembrandt/dembrandt
- Dembrandt README: documents a browser-based extraction process using computed styles, DOM structure, CSS variables, context/usage confidence, multi-page crawl/sitemap support, mobile/dark flags, DTCG export, WCAG extraction, and limitations. Source: https://github.com/dembrandt/dembrandt
- `extract-design-system` README and skill: documents a repeatable agent workflow for public websites, expected outputs (`raw.json`, `normalized.json`, `tokens.json`, `tokens.css`), extracted categories, and safety boundaries against overclaiming completeness or modifying app code without confirmation. Source: https://github.com/arvindrk/extract-design-system and https://raw.githubusercontent.com/arvindrk/extract-design-system/main/skills/extract-design-system/SKILL.md
- DTCG 2025.10 format: defines design tokens as platform-agnostic design decisions and specifies `$value`, `$type`, references, groups, and rich token/composite types. Source: https://www.designtokens.org/TR/2025.10/format/
- Style Dictionary docs: describe nested design token objects, DTCG compatibility, token paths, metadata, references, and transformation use. Source: https://styledictionary.com/info/tokens/
- Chrome DevTools Protocol CSS domain: exposes the concrete browser APIs needed to collect computed styles, matched CSS rules, background colors, platform fonts, stylesheet text, media queries, pseudo states, and rule usage. Source: https://chromedevtools.github.io/devtools-protocol/tot/CSS/

## Searches Run

- `DESIGN.md website design tokens extraction GitHub agent workflow`
- `design tokens community group format specification colors typography spacing tokens`
- `Style Dictionary design tokens documentation token structure transform`
- `Chrome DevTools Protocol CSS getComputedStyleForNode getMatchedStylesForNode`
- `google-labs-code design.md GitHub DESIGN.md spec`
- `DESIGN.md open spec google labs design.md GitHub YAML front matter canonical sections`
- `Dembrandt any website to design tokens GitHub README sections logo colors typography borders`
- `extract-design-system Claude Codex skill design tokens public website README`

## Commands Run

- `mkdir -p .agents/research/openai-explainer-redesign && test -d .agents/research/openai-explainer-redesign && pwd`

## Sources Consulted

1. Google Labs `design.md` spec: https://github.com/google-labs-code/design.md/blob/main/docs/spec.md
2. Dembrandt README: https://github.com/dembrandt/dembrandt
3. `extract-design-system` README: https://github.com/arvindrk/extract-design-system
4. `extract-design-system` skill: https://raw.githubusercontent.com/arvindrk/extract-design-system/main/skills/extract-design-system/SKILL.md
5. Design Tokens Community Group format 2025.10: https://www.designtokens.org/TR/2025.10/format/
6. Style Dictionary token docs: https://styledictionary.com/info/tokens/
7. Chrome DevTools Protocol CSS domain: https://chromedevtools.github.io/devtools-protocol/tot/CSS/

## Sources Not Consulted

- Tokens Studio/Figma docs: omitted due source budget and because DTCG/Style Dictionary covered the token interchange layer.
- Tailwind theme docs: omitted because Style Dictionary and DTCG better answer the token normalization question.
- MDN CSS property docs: omitted because CDP and extraction tool docs were more directly relevant to automated site extraction.
- Blog posts and non-primary summaries: omitted by scope preference for public repos/docs and primary tooling.
- Stitch hosted spec page: opened but not used as evidence because the GitHub source spec was directly accessible and more inspectable.

## Contradictions

- `DESIGN.md` and DTCG use different serializations. The Google draft uses YAML front matter with direct keys such as `colors.primary`; DTCG uses JSON with `$value`, `$type`, `$description`, groups, references, and composite token structures.
- The Google draft's core front matter schema is smaller than what current extractors observe. Dembrandt says it can place shadows in front matter, while the Google draft schema shown in the consulted spec lists `colors`, `typography`, `rounded`, `spacing`, and `components` but not a first-class `shadows` key.
- Extraction depth varies by tool. `extract-design-system` presents a single-page starter-token workflow, while Dembrandt documents crawl/sitemap merging and cross-page confidence boosting.
- Chrome DevTools Protocol `tot` docs are tip-of-tree and may include experimental methods. Stable automation should prefer stable CDP methods or Playwright abstractions where possible.

## Confidence

High that a practical workflow can be built from these sources. Medium that the exact `DESIGN.md` schema will remain stable, because the Google draft labels current version as `alpha`, Dembrandt references a draft format, and component/front-matter extension behavior is still evolving.

## Gaps

- Need a real generated `DESIGN.md` sample from Dembrandt for the exact shape of its `shadows`, `motion`, and metadata extensions.
- Need validation behavior from the Google `design.md` tooling, if any, for unknown front matter keys such as `source`, `confidence`, `shadows`, or `motion`.
- Need empirical tests on the target OpenAI explainer pages to decide whether one-page extraction is enough or whether docs/pricing/product pages must be crawled.
- Need permission/usage decision if applying this to third-party sites rather than user-owned properties.

## Durability Recommendation

For a reusable agent workflow, store the method as a small repo-local instruction or checklist that:

- uses the Google `design.md` section order as the default;
- requires provenance, page coverage, viewport coverage, and confidence notes;
- uses DTCG-compatible token normalization internally;
- forbids invented tokens and unsupported component claims;
- recommends multi-page browser extraction before authoring the final prose;
- treats `DESIGN.md` as a human/agent guide, not the authoritative full token database.
