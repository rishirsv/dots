# OpenAI Visual Style Research For Technical Explainer

## Question

Identify current public OpenAI visual style and product-surface cues useful for deriving an OpenAI-inspired `design.md` for a technical explainer.

## Scope

- Official OpenAI brand/design pages.
- OpenAI developer UI guidelines.
- Current public OpenAI/ChatGPT product surfaces where accessible without private accounts or credentials.
- Official or OpenAI-owned public source artifacts that expose design tokens or component behavior.
- Access date: 2026-06-18.

## Answer

Use an OpenAI-inspired direction, not an OpenAI clone. The strongest current cues are: quiet neutral surfaces, system typography, sparse hierarchy, conversational entry points, compact structured cards, high legibility, subtle semantic accents, and restrained motion. A technical explainer should feel like a focused ChatGPT/developer-doc surface: mostly white/off-white or dark neutral, one clear column with optional structured side panels, small semantic badges, precise code/table treatments, and minimal decoration.

Facts:

- OpenAI's public brand page defines OpenAI Sans as the brand typeface and warns against altering/cropping/unapproved wordmark variations. It also says marks and design elements remain OpenAI property and must follow brand guidelines.
- Apps SDK UI guidelines say ChatGPT app surfaces should use system colors for text/icons/dividers, allow partner brand accents only in controlled places, avoid custom gradients/patterns that break ChatGPT's minimal look, inherit system fonts, use system grid spacing, keep padding consistent, and respect system corner rounds.
- Apps SDK UX principles favor focused conversational experiences, atomic extracted actions, structured results, concise responses, and avoiding ornamental components that do not advance the task.
- The public Apps SDK UI source uses a neutral gray ladder, alpha overlays, semantic accents, a 4px spacing base, system sans/mono stacks, 0em tracking, 400/500/600/700 font weights, 2-24px radius tokens plus full pills, 22-48px control heights, and 150ms basic transitions.
- The public ChatGPT overview surface emphasizes prompt-like example chips, a short hero claim, primary CTA, and feature sections that show real conversation/UI examples rather than decorative abstractions.

Inferences for `design.md`:

- Palette: build on neutral surfaces first: `#ffffff`, `#f9f9f9`, `#f3f3f3`, `#ededed`, `#0d0d0d`, `#181818`, plus alpha borders/hover states. Use blue for info/focus, green for success, orange for warning, red for danger, purple only for discovery/newness. Avoid large tinted backgrounds except for small badges, callouts, or chart highlights.
- Typography: use a system font stack instead of trying to copy OpenAI Sans. Suggested stack: `ui-sans-serif, -apple-system, system-ui, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif`; mono stack for code. Use semibold headings, normal body, medium buttons. Avoid negative letter spacing; the UI kit sets tracking to `0em`.
- Surfaces: use one calm primary surface with subtle secondary/elevated panels. Cards should be lightweight, single-purpose, and embedded in the reading flow. Do not build a dashboard-heavy explainer if the technical story can be communicated as narrative plus structured summaries.
- Spacing: use a 4px grid. Good defaults: 16-24px section padding in compact surfaces, 32-48px between major explainer blocks, 8-12px gaps inside small controls, and a content max width near 760-840px for prose/code. The UI kit's chat max width is 800px.
- Components: prefer buttons with fixed heights, focus rings, consistent icon sizes, status badges, segmented controls/tabs for mode switches, input/composer-like controls only where the explainer is interactive, neutral code blocks, and small cards for examples or tool calls.
- Motion: keep motion functional and brief: opacity/transform transitions around 150ms, no ornamental parallax or long hero animations. Use motion to show state changes, expansion, or streaming/progress.
- Imagery: official public product pages use actual UI/conversation imagery and soft colorful feature imagery. For a technical explainer, use real interface/code/data examples before abstract art.
- What not to copy: do not use OpenAI logos, the Blossom, the OpenAI wordmark, proprietary brand lockups, exact page layouts, or custom OpenAI Sans assets unless permission/brand access explicitly allows it. Do not redefine system text/background colors with brand gradients, and do not mimic ChatGPT chrome closely enough to imply affiliation.

## Key Evidence

1. Brand and typography

- `https://openai.com/brand/` identifies the page as "Design Guidelines" and says the OpenAI name, logo, ChatGPT, GPT, and other trademarks are OpenAI property. It describes the wordmark as crafted with OpenAI Sans and fixed in balance/proportions, with rules not to stretch, alter, crop, mask, or use unapproved variations. It describes OpenAI Sans as geometric, functional, rounded, approachable, and available in Light, Regular, Medium, Semibold, and Bold. It also says permission to use marks is limited and marks must follow the brand guidelines.

2. ChatGPT-native UI guidance

- `https://developers.openai.com/apps-sdk/concepts/ui-guidelines` says apps appear in lightweight cards, carousels, fullscreen views, and other display modes integrated into ChatGPT. It recommends the Apps SDK UI design system for experiences consistent with ChatGPT and says it provides Tailwind foundations, CSS variable tokens, and accessible components.
- The same page's visual design section says system palettes maintain platform consistency; partner accents can appear through logos/icons/inline imagery but should not override backgrounds or text colors. It explicitly recommends system colors for text/icons/dividers, avoiding custom gradients or patterns that break ChatGPT's minimal look, inheriting system fonts, limiting font-size variation, using system grid spacing, keeping padding consistent, respecting corner rounds, and maintaining clear hierarchy.

3. UX constraints

- `https://developers.openai.com/apps-sdk/concepts/ux-principles` says a great ChatGPT app should provide conversational leverage, native fit, and composability. It recommends extracting atomic actions instead of porting a full site, designing for conversational entry, using UI selectively to clarify actions/capture inputs/present structured results, skipping ornamental components, and optimizing for conversation rather than navigation.

4. Public product-surface cues

- `https://chatgpt.com/overview/` (reached from `https://openai.com/chatgpt/overview/`) uses a short ChatGPT hero, primary "Start now" CTA, a secondary model link, many prompt-like example chips, and feature sections illustrated with conversation/UI screenshots or product imagery. This supports prompt chips, compact examples, and real product-context imagery as reusable cues.
- `https://openai.com/` showed current dated card grids for news, stories, research, and business content, with image-led cards and plain metadata such as category/date. On 2026-06-18, visible examples included May/June 2026 content.

5. Apps SDK UI source tokens

- `https://github.com/openai/apps-sdk-ui/blob/main/src/styles/variables-primitive.css` exposes neutral gray primitives from white/light grays through near-black, alpha transparency steps, and semantic color families such as green, red, pink, orange, yellow, blue, and purple.
- `https://github.com/openai/apps-sdk-ui/blob/main/src/styles/variables-semantic.css` exposes system font stacks, font weights, radius tokens, 4px base spacing, text/primary/secondary/info/warning/danger/success/discovery semantic colors, border levels, heading/body scales, control sizes, transition duration, and surface aliases.
- `https://github.com/openai/apps-sdk-ui/blob/main/src/styles/variables-components.css` exposes component-level cues: badge sizes/radii, button gaps/font weight, input gaps and outline/soft styles, link radius/color, chat max width 800px, chat/thread/composer gutters, composer radius, user message background, menu radius/gutters, segmented controls, dialogs, modals, and popovers.
- `https://github.com/openai/apps-sdk-ui/blob/main/src/components/Button/Button.module.css` shows buttons as fixed-height controls with gutters, inherited radius tokens, focus-visible rings, icon autosizing, optical alignment, size variants from 22px to 48px high, and basic opacity/color/background/transform transitions.
- `https://github.com/openai/apps-sdk-ui/blob/main/src/components/Transition/Animate.module.css` shows transitions based on opacity, transform, and filter, including enter/exit handling and interrupted transition behavior.

## Searches Run

- `site:openai.com brand OpenAI brand guidelines design typography color`
- `site:openai.com OpenAI design brand page`
- `site:developers.openai.com OpenAI Apps SDK design guidelines UI components`
- `site:developers.openai.com OpenAI developer docs design guidelines Apps SDK`
- `site:openai.github.io/apps-sdk-ui OpenAI Apps SDK UI design tokens`
- `openai apps-sdk-ui css variables tokens`
- `site:openai.com/brand OpenAI brand`
- `site:openai.com/chatgpt OpenAI ChatGPT product page`
- `site:openai.com OpenAI homepage news research ChatGPT Sora API`
- `site:developers.openai.com/apps-sdk/concepts ui guidelines ChatGPT apps`
- `site:developers.openai.com/apps-sdk build your ChatGPT UI widget border max height`

## Commands Run

- `sed -n '1,220p' /Users/rishi/.codex/skills/.system/openai-docs/SKILL.md`
- `pwd`
- `rg --files -g 'AGENTS.md' -g 'README.md' -g 'INSTALL.md' | sed -n '1,40p'`
- `node -e "import('playwright').then(()=>console.log('playwright:yes')).catch(e=>console.log('playwright:no'))"`
- `find . -name AGENTS.md -print`
- `ls -ld .agents .agents/research .agents/research/openai-explainer-redesign 2>/dev/null || true`
- `curl -sL 'https://api.github.com/repos/openai/apps-sdk-ui/contents/src/styles?ref=main'`
- `curl -sL 'https://api.github.com/repos/openai/apps-sdk-ui/git/trees/main?recursive=1' | rg 'src/styles|token|theme|css'`
- `curl -sL 'https://api.github.com/repos/openai/apps-sdk-ui/releases/latest' | sed -n '1,120p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-primitive.css | nl -ba | sed -n '1,180p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css | nl -ba | sed -n '1,220p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-components.css | nl -ba | sed -n '1,180p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/components/Button/Button.module.css | nl -ba | sed -n '1,220p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css | nl -ba | sed -n '300,460p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css | nl -ba | sed -n '520,700p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/base.css | nl -ba | sed -n '1,180p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/components/Transition/Animate.module.css | nl -ba | sed -n '1,180p'`
- `curl -sL https://raw.githubusercontent.com/openai/apps-sdk-ui/main/src/styles/variables-semantic.css | nl -ba | rg -C 3 'transition|ease|duration|control-size|control-radius'`

## Sources Consulted

1. `https://openai.com/brand/` - official brand/design guidelines; accessed 2026-06-18.
2. `https://developers.openai.com/apps-sdk/concepts/ui-guidelines` - official Apps SDK UI guidelines; HTTP `last-modified` observed as 2026-06-18 04:32:21 GMT.
3. `https://developers.openai.com/apps-sdk/concepts/ux-principles` - official Apps SDK UX principles; accessed 2026-06-18.
4. `https://developers.openai.com/apps-sdk/build/chatgpt-ui` - official ChatGPT UI implementation guide; accessed 2026-06-18.
5. `https://chatgpt.com/overview/` via `https://openai.com/chatgpt/overview/` - public ChatGPT overview/product surface; accessed 2026-06-18.
6. `https://openai.com/` - public OpenAI homepage/product/news surface; accessed 2026-06-18.
7. `https://github.com/openai/apps-sdk-ui` and raw files under `src/styles` and `src/components` - OpenAI-owned public UI kit source; latest GitHub release observed as `v0.2.2`, published 2026-05-05.

## Sources Not Consulted

- Private ChatGPT account surfaces, logged-in chats, settings, and internal product UI.
- Figma component library linked from the Apps SDK UI guidelines.
- `brand.openai.com` full design guidelines beyond the public `openai.com/brand/` page.
- Screenshots of current pages. `playwright` was not available in the local Node environment, and no browser/credentialed surface was used.
- Non-official design commentary, third-party screenshots, community posts, or speculative brand analyses.

## Contradictions Or Caveats

- Brand typography and ChatGPT app typography point in different directions: OpenAI Sans is the brand typeface, but ChatGPT UI guidance tells app developers to inherit platform-native system fonts and not use custom fonts. For a technical explainer, the safer public guidance is system fonts unless explicit brand permission exists.
- Public OpenAI marketing pages sometimes use soft colorful imagery or gradients, while ChatGPT app UI guidance explicitly warns against custom gradients/patterns that break the minimal look. For an explainer, use color in imagery or small accents, not as structural UI backgrounds.
- Apps SDK UI tokens are strong evidence for ChatGPT-adjacent component styling, but they are source code for a developer kit rather than a complete statement of OpenAI.com web design.
- Direct screenshot evidence was not captured. Product-surface observations are from retrieved page text, image alt text, and official source/code rather than visual inspection of rendered pixels.

## Confidence

Medium-high for palette, typography, spacing, components, and what not to copy, because those are supported by official brand guidance, official Apps SDK UI guidance, and public source tokens. Medium for current public product-surface layout/motion cues, because screenshots were not captured and rendered CSS was not inspected.

## Gaps Or Next Checks

- Capture fresh screenshots of `openai.com`, `chatgpt.com/overview`, `developers.openai.com`, and `openai.github.io/apps-sdk-ui` in a browser-enabled environment.
- Inspect computed CSS for public OpenAI marketing pages if exact web palette/type scale is needed.
- Review the Figma component library if access is available and permissible.
- Check whether the target `design.md` should be "OpenAI-inspired" broadly or specifically "ChatGPT app/native" inspired; the latter should hew more closely to Apps SDK UI guidance.

## Durability Recommendation

Use this report as generated evidence under `.agents/`, not as durable design guidance. Derive a short durable `design.md` separately with stable principles and copied-free tokens, and cite this research internally rather than embedding long evidence sections in the design document.
