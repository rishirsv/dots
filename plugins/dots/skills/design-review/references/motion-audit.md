# Motion Audit

Use this reference for live or recorded motion review, animation-focused diff
review, and source-wide motion audits. The substantive bar and target values
live in [standards.md](standards.md). Use
[iOS Motion Doctrine](../../design/references/ios-motion.md) for physical
interaction behavior and
[Animation Vocabulary](../../design/references/animation-vocabulary.md) for
precise finding language.

Apply platform-specific implementation clauses only where that platform and
mechanism are actually in scope. Repository conventions and native platform
APIs come first. Source code can prove implementation facts; timing, easing,
interruption, velocity continuity, gesture response, haptic synchronization,
dropped frames, and feel require dynamic interaction evidence.

## Recon

Map the motion surface before judging it:

- **Stack**: framework, motion libraries (Framer Motion / Motion, React Spring,
  GSAP, plain CSS, WAAPI), and component libraries (Radix, Base UI, shadcn/ui).
- **Where motion lives**: global CSS/tokens (`--ease-*`, `--duration-*`),
  Tailwind config, keyframe definitions, `transition`/`animate` props, and
  gesture handlers.
- **Conventions**: existing easing tokens, duration scales, and spring configs.
  Recommendations must extend these, not invent parallel ones.
- **Personality**: whether the product is playful, expressive, calm, or a crisp
  dashboard. Cohesion findings depend on it.
- **Frequency map**: which animated elements are hit 100+ times/day (command
  palette, keyboard shortcuts, list hover), occasionally (modals, toasts), or
  rarely (onboarding). This drives severity.

Useful sweeps include `transition`, `animation`, `@keyframes`, `motion.`,
`animate={`, `useSpring`, `ease-in`, `transition: all`, `scale(0)`,
`prefers-reduced-motion`, and `transform-origin`.

For an interaction review, recon only the component and states in scope. For a
diff review, recon the changed files and the conventions they must follow. For
a codebase audit, map the whole requested product area before reporting.

## Audit Categories

Audit against these eight categories from [standards.md](standards.md):

1. Purpose and frequency
2. Easing and duration
3. Physicality and origin
4. Interruptibility
5. Performance
6. Accessibility
7. Cohesion and tokens
8. Missed opportunities

Within `standards.md`, use the element-specific duration table as the concrete
allowance: sub-300ms is the default for routine UI, while longer modal or drawer
motion needs interaction evidence and justification.

## Interaction Review

Inspect the live interaction or a recording. Exercise rapid repeats, reversal,
pointer and keyboard initiation, reduced-motion behavior, boundary conditions,
and representative device input when relevant. Use slow motion or frame-by-frame
inspection when timing or coordinated properties are difficult to judge.

Report findings through the parent skill's severity, evidence, impact,
recommendation, acceptance-check, and pass/block contract. A still screenshot
can support composition or origin findings but cannot pass a motion review.

## Diff Review

Review animation and motion code against a high craft bar. Motion that runs but
feels sluggish, lands from the wrong origin, fires too often, cannot be
interrupted, or drops frames is a regression, not a pass.

Re-read the cited code for every finding. Reject anything that is by design,
misattributed, duplicated, or exempt. Never present a finding you have not
confirmed at its `file:line`.

Return one findings table:

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; `all` animates unintended properties off-GPU |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing appears from nothing; `scale(0)` looks like it came from nowhere |

Then group remaining commentary by impact: feel-breaking regressions, missed
simplifications, performance, interruptibility and timing, physicality and
cohesion, then accessibility. Close with an explicit decision:

- **Block**: a feel-breaking regression or blocking implementation defect
  remains.
- **Approve**: no feel-breaking regression remains, obvious excess motion has
  been removed, timing and easing fit the interaction, interruptibility is
  handled where needed, and reduced motion is respected.

When feel cannot be judged from code alone, label it `Needs testing` and name
the exact playback check rather than guessing.

## Codebase Audit

After recon, survey all in-scope animation and motion code against the eight
categories. For anything beyond a small repository, divide independent read-only
scans by category or product area when subagents are available. Each scan must
return findings only with `file:line` evidence; the parent reviewer verifies
every cited finding before presenting it.

Present vetted findings as one table, ordered by leverage (impact divided by
effort):

| # | Severity | Category | Location | Finding | Fix summary |
| --- | --- | --- | --- | --- | --- |

After the table, list at most four missed opportunities separately. These are
places that do not animate but should: a jarring state change, an unexplained
spatial transition, or a rare delight moment. They are additive rather than
corrective and must be grounded in an actual UX seam, not a wishlist.

If the user asks only for an audit, stop after the prioritized findings and
smallest recommended change set. If they ask for implementation plans, write
one self-contained plan per selected finding with:

- the exact file paths and current-code excerpts
- exact target values from [standards.md](standards.md), never approximations
- repository conventions and one exemplar to follow
- ordered implementation steps
- hard scope boundaries
- mechanical verification
- a concrete feel check using slow motion, frame-by-frame inspection, reduced
  motion, and a real device for gestures when relevant
- an observable definition of done

Plans are review output, not authorization to modify product source. A short
list of high-confidence, high-leverage changes beats a long padded one.

## Remedial Preference

Prefer these moves in order when proposing fixes:

1. Delete motion that has no purpose or runs on high-frequency or
   keyboard-initiated actions.
2. Reduce its duration, distance, or animated properties.
3. Fix the easing.
4. Fix origin and physicality.
5. Make it interruptible.
6. Move it to GPU-friendly properties or the appropriate mechanism.
7. Use asymmetric timing where the deliberate phase and system response differ.
8. Add polish such as blur or stagger only after the interaction is correct.
9. Ensure reduced-motion behavior and cohesion with the product.

This hierarchy orders simplification, not release priority. Accessibility
findings remain gating at their assessed severity. Documented exceptions such
as `clip-path`, blur, or carefully measured layout animation should be judged
by observed cost rather than the property name alone.
