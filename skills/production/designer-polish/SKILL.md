---
name: designer-polish
description: "Refine nearly complete frontend interfaces so they are ready to ship. Use when Codex needs a final quality pass covering visual polish, interaction completeness, performance tuning, resilience, edge cases, and production hardening, or when the user asks for iterative polish loops such as `design polish 5x`. This skill improves and finishes existing work after the design direction is already set; it is not the primary ideation or formal audit skill."
---

# Designer Polish

Perform the final implementation pass that turns good UI into ship-ready UI. This skill combines detail polish, resilience hardening, and performance optimization into one finishing workflow.

Use this only when the interface is already mostly complete. Do not spend time polishing something that still needs core product or layout decisions. If the user wants a review instead of changes, use `designer-audit`.

## Priority Rule

Before following any other workflow in this skill:

- check for `docs/DESIGN.md` in the project root
- if it exists, read it first and treat it as the highest-priority design context
- preserve the existing design conventions, tokens, spacing, component patterns, and interaction language unless the user explicitly asks for a redesign or a deliberate departure

If `docs/DESIGN.md` does not exist, do not create or refresh it silently. Use `design-init` only when the user explicitly asks for design-context setup or refresh.

## Use This Skill For

- Final detail cleanup before shipping
- Completing missing interaction states and edge-case handling
- Hardening the UI against real data and failure modes
- Fixing meaningful performance issues in an almost-finished interface
- Running an iterative capture, evaluate, and polish loop with requests like `design polish 5x`

## Do Not Use This Skill For

- Initial design ideation or broad redesign
- Report-only reviews without implementation
- Large product-direction changes that should be solved earlier

## Iterative Mode

Treat iterative wording such as `design polish 5x`, `designer-polish 5x`, `iterate polish`, `repeat polish`, or `run a polish loop` as iterative mode.

Behavior:

- no iterative wording: run the normal single-pass polish workflow
- iterative wording without an explicit count: run 3 iterations
- iterative wording with `Nx`: run exactly `N` iterations

In iterative mode, each pass should:

1. capture before-state evidence
2. evaluate the current state
3. choose 1-3 high-impact improvements only
4. implement only those improvements for that iteration
5. capture after-state evidence with matching framing
6. write a short iteration report with what changed and the next best candidates

Do not implement the “next candidates” until the next iteration actually starts.
If evidence capture fails mid-loop, stop the loop and report which iteration failed and why.

## Capture Routing

Choose screenshot and capture tooling based on project type first.

### Web or Frontend

- first check whether the `agent-browser` skill is available in the current environment; if it is, prefer it for navigation, state checks, and screenshots
- if `agent-browser` is not available, check for already-available browser or devtools-style MCP or tooling
- if no already-available method exists, stop and ask the user before introducing a new capture method

### Expo iOS

- prefer existing Expo or Xcode simulator capture routes that are already available in the environment
- do not route Expo iOS screenshot capture through `agent-browser` unless the task is clearly web content inside that project
- if capture would require a new setup path, ask the user before introducing it

### Native iOS or Swift

- use Xcode simulator or another already-available iOS simulator route
- do not route native iOS screenshot capture through `agent-browser`
- if the only viable route would require new setup, ask the user first

## Evidence Contract

Store artifacts under:

- `./.agents/screenshots/<feature>/iter-XX-web-before.png`
- `./.agents/screenshots/<feature>/iter-XX-web-after.png`
- `./.agents/screenshots/<feature>/iter-XX-expo-before.png`
- `./.agents/screenshots/<feature>/iter-XX-expo-after.png`
- `./.agents/screenshots/<feature>/iter-XX-ios-before.png`
- `./.agents/screenshots/<feature>/iter-XX-ios-after.png`
- `./.agents/screenshots/<feature>/iter-XX-report.md`

Derive `<feature>` from the page, route, screen, or user-named feature when it is clear. Otherwise use a short kebab-case slug for the primary target being polished.

Keep before and after framing consistent within the same iteration.

## Finishing Workflow

Work in this order so effort goes to the highest-value issues first.

### 1. Assess Readiness

Understand the current state:

- Is the feature functionally complete?
- What quality bar matters here: MVP, strong default, flagship?
- What is the likely ship window?
- Are there known issues that should remain explicit rather than silently “fixed”?
- What existing design conventions from `docs/DESIGN.md` must be preserved?
- Is this a single-pass request or an iterative loop request?
- What project type is being polished: web/frontend, Expo iOS, or native iOS?

### 1A. Run The Evidence Loop When Iterative Mode Is Active

For iterative requests, follow this loop for each pass:

1. Detect the project type and choose the capture route using the routing rules above.
2. Capture before-state evidence.
3. Run the evaluation pass for that iteration.
4. Pick only 1-3 high-impact improvements.
5. Implement only those chosen improvements.
6. Capture after-state evidence with matching framing.
7. Write the iteration report and list the next candidates without implementing them yet.

Evaluation depth should alternate:

- iteration 1: fuller audit-style baseline using `designer-audit` standards
- middle iterations: quick high-impact evaluation to keep momentum
- final iteration: fuller closing evaluation to confirm what remains

The fuller passes should borrow the standards of `designer-audit`, but do not need to dump a full exhaustive audit report every iteration.

### 2. Fix Visual and Interaction Polish

Refine the details that make the product feel intentional:

- Alignment and spacing
- Typography consistency
- Contrast and token usage
- Hover, focus, active, disabled, loading, error, and success states
- Transition quality and easing
- Copy consistency
- Icon alignment and image behavior
- Form labeling and validation behavior
- Empty, loading, and error states
- Responsive consistency across breakpoints

Check for:

- Random spacing values
- Elements that feel optically off
- Missing states on interactive controls
- Weak focus indicators
- Janky or decorative motion
- Layout shift
- Visible console issues or dead code

### 3. Harden Against Real-World Inputs

Make the feature resilient to reality, not just ideal mock data.

Test and improve:

- Very long text
- Empty or missing data
- Large numbers
- Special characters, emoji, RTL text, and translated strings
- Slow or failed network requests
- Validation and permission errors
- Concurrent actions and double submits
- Large datasets
- Different device widths and text scaling

Prefer flexible layouts and logical sizing over fixed-width assumptions. Use appropriate truncation, wrapping, clamping, overflow control, and graceful degradation.

### 4. Optimize Meaningful Performance Bottlenecks

Measure first, then optimize what actually matters.

Focus on:

- Large or badly sized images
- Unnecessary JavaScript and dead dependencies
- Render thrash and unnecessary re-renders
- Animations that move layout properties instead of `transform` or `opacity`
- Layout shift and slow initial load
- Heavy off-screen content that should be lazy loaded or virtualized

Prefer:

- Smaller bundles
- Better image sizing and formats
- Code splitting where it meaningfully helps
- Smooth 60fps interactions
- Stable layouts with reserved media space

Do not waste time on micro-optimizations while obvious bottlenecks remain.

## Success Bar

Before calling the work done, confirm:

- Visual alignment is clean at supported breakpoints
- Spacing and color usage are consistent
- Type hierarchy is clear and consistent
- All important interaction states exist
- Empty, loading, success, and error states are useful
- Long text and missing data do not break the layout
- Touch targets are usable
- Keyboard and focus behavior still work
- Theme behavior still works
- Performance improved or stayed stable
- There is no obvious layout shift or animation jank
- The code is cleaner, not messier

## Guardrails

- Do not act like the primary design ideation skill. Use `designer-frontend` for new design direction.
- Do not turn this into a report-only review. Use `designer-audit` when the user wants findings rather than fixes.
- Do not over-polish low-value details while leaving systemic problems untouched.
- Do not introduce new bugs while improving finish quality.
- Do not drift away from the repo’s established design language unless the user explicitly asks for that change.
- Do not introduce or install a new screenshot path without user confirmation.
- Do not let an iteration turn into unrelated feature work or refactors.
- Do not implement more than 1-3 chosen improvements in a single iteration.

## Output Expectations

When using this skill:

- Make concrete improvements, not vague suggestions.
- Explain the highest-value fixes briefly.
- Validate with the strongest available checks for the project.
- Preserve the existing design direction unless the user explicitly asks for a redesign.
- In iterative mode, save before and after evidence plus a short per-iteration report.
