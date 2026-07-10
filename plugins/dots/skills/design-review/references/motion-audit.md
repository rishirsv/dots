# Motion Audit

Read this whenever motion or gesture behavior is part of the surface under
review. Inspect the live interaction or a recording; a still screenshot cannot
establish timing, easing, interruption, velocity continuity, gesture response,
haptic synchronization, or dropped frames. Use
[iOS Motion Doctrine](../../design/references/ios-motion.md) for physical
interaction behavior and
[Animation Vocabulary](../../design/references/animation-vocabulary.md) for
precise finding language.

Apply platform-specific implementation clauses only where that platform and
mechanism are actually in scope. Repository conventions and native platform
APIs come first; use the iOS doctrine for direct manipulation and physical
gesture behavior, and use the CSS/JavaScript clauses in `standards.md` only for
web implementations. The animation vocabulary names behavior but does not set
policy. Keep findings inside the existing `design-review` severity, evidence,
recommendation, acceptance-check, and pass/block contract.

Within [standards.md](standards.md), use the element-specific duration table as
the concrete allowance: sub-300ms is the default for routine UI, while longer
modal or drawer motion needs interaction evidence and justification.

## The Ten Motion Standards

Measure each in-scope animation against these defaults. Record a finding only
when current dynamic evidence or inspected implementation supports the claim;
otherwise mark it `Needs testing`. A more specific repository, platform, or
interaction-mechanism rule overrides a general default below.

1. **Justified motion.** Every animation must answer "why does this animate?" — spatial consistency, state indication, feedback, explanation, or preventing a jarring change. "It looks cool" on a frequently-seen element is a block.

2. **Frequency-appropriate.** Match motion to how often it's seen. Keyboard-initiated and 100+/day actions get **no** animation. Tens/day gets reduced motion. Occasional gets standard. Rare/first-time can have delight.

3. **Responsive easing.** Entering/exiting elements use `ease-out` or a strong custom curve. `ease-in` on UI is a block — it delays the moment the user watches most. Built-in CSS easings are too weak; expect custom cubic-beziers.

4. **Sub-300ms UI.** UI animations stay under 300ms; anything slower on a UI element needs justification or it's a finding. Per-element budgets live in [standards.md](standards.md).

5. **Origin & physical correctness.** Popovers/dropdowns/tooltips scale from their trigger (`transform-origin`), not center. Never animate from `scale(0)` — start from `scale(0.9–0.97)` + opacity (Modals are exempt — they stay centered.)

6. **Interruptibility.** Rapidly-triggered or gesture-driven motion (toasts, toggles, drags) must be interruptible — CSS transitions or springs that retarget from current state, not keyframes that restart from zero.

7. **GPU-only properties.** Animate `transform` and `opacity` only. Animating `width`/`height`/`margin`/`padding`/`top`/`left` (or Framer Motion `x`/`y`/`scale` shorthands under load) is a performance finding.

8. **Accessibility.** `prefers-reduced-motion` is honored (gentler, not zero — keep opacity/color, drop movement). Hover animations are gated behind `@media (hover: hover) and (pointer: fine)`.

9. **Asymmetric enter/exit.** Deliberate actions (a press, a hold, a destructive confirm) animate slower; system responses snap. Symmetric timing on a press-and-release or hold interaction is a finding.

10. **Cohesion.** Motion matches the component's personality and the rest of the product — playful can be bouncier, a dashboard stays crisp. Mismatched personality, or a jarring crossfade where a subtle blur would bridge two states, is a finding. When unsure whether motion feels right, the strongest move is often to delete it.

## Remedial Preference Hierarchy

When proposing fixes, prefer earlier moves over later ones:

1. **Delete the animation** (high-frequency / no purpose / keyboard-triggered).
2. **Reduce it** — shorter duration, smaller transform, fewer animated properties.
3. **Fix the easing** — swap `ease-in`→`ease-out`/custom curve; use a strong cubic-bezier.
4. **Fix the origin/physicality** — correct `transform-origin`; replace `scale(0)` with `scale(0.95)`+opacity.
5. **Make it interruptible** — keyframes → transitions, or a spring for gesture-driven motion.
6. **Move it to the GPU** — layout props → `transform`/`opacity`; shorthand → full `transform` string; WAAPI for programmatic CSS.
7. **Asymmetric timing** — slow the deliberate phase, snap the response.
8. **Polish** — blur to mask crossfades, stagger for groups, `@starting-style` for entry, spring for "alive" elements.
9. **Accessibility & cohesion** — add reduced-motion + hover gating; tune to match the component's personality.

This hierarchy orders motion simplification, not release priority.
Accessibility findings remain gating at their assessed severity and must not be
deferred behind polish. In the web reference, later documented techniques such
as `clip-path`, blur, or carefully measured layout animation are explicit
exceptions to the general transform/opacity preference; assess their observed
cost rather than flagging the property name alone.
