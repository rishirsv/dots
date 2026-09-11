# Motion Review

Choose one motion scope, gather the evidence it requires, and judge purpose,
timing, physicality, interruption, performance, accessibility, and cohesion.
Read [standards.md](standards.md) before judging.

## Choose The Scope

| Scope | Evidence | Result |
| --- | --- | --- |
| `interaction` | Live UI or recording | Evidenced findings; verdict for a requested gate |
| `diff` | Changed animation and interaction code | Implementation findings with playback checks for feel |
| `codebase` | In-scope motion source and conventions | Prioritized findings by leverage |

Read [ios-motion.md](../../design/references/ios-motion.md) only for native
motion, direct manipulation, springs, momentum, rubber-banding, or haptics.
Read [animation-vocabulary.md](../../design/references/animation-vocabulary.md)
only when precise terminology changes the finding.

## Map The Motion

Inspect:

- framework, platform, libraries, and component system;
- motion tokens, easing curves, durations, springs, keyframes, transitions, and
  gesture handlers that govern the scope;
- frequency: repeated, routine, occasional, or focal;
- product character and repository conventions;
- target device, input method, and performance constraints.

Useful source searches include `transition`, `animation`, `@keyframes`,
`motion.`, `animate=`, `useSpring`, `ease-in`, `transition: all`, `scale(0)`,
`prefers-reduced-motion`, and `transform-origin`. Search results are candidates;
verify every cited implementation.

## Review An Interaction

Inspect the behavior dynamically. Exercise only applicable cases:

- entry and exit;
- rapid repetition and reversal;
- pointer, keyboard, and touch initiation;
- interruption during motion;
- gesture boundaries and release;
- reduced motion;
- representative viewport or device.

Use slow motion or frame-by-frame inspection when timing, origin, or coordinated
properties cannot be judged at normal speed. A still image can support
composition but cannot establish timing, easing, interruption, velocity,
haptics, dropped frames, or feel.

Use the parent's acceptance rules for a requested motion gate. Required dynamic
states need playback evidence; still images cannot establish those claims.

## Review A Diff

Re-read every cited change. Source can establish property choice, timing
values, broad transitions, keyframes, missing reduced-motion handling, and
likely interruption risks. Label feel and runtime performance `Needs testing`
until played.

Use the parent's finding format with `file:line` and a named playback check for
feel-dependent claims. For a requested gate, state whether it covers source
conformance or runtime experience; source alone cannot pass the latter.

## Audit A Codebase

Map the requested product area before judging. Verify each candidate at its
`file:line`, then order findings by leverage: user impact divided by correction
cost.

List at most four missed opportunities after corrective findings. A missed
opportunity must point to a real seam—jarring state change, lost continuity, or
earned focal moment—not a motion wishlist.

If plans were requested, make each plan self-contained with exact paths,
current excerpts, repository conventions, target behavior, ordered steps,
scope limits, mechanical checks, and a dynamic feel check. Plans do not
authorize implementation.

## Prefer The Smallest Correction

1. Remove motion without purpose or repeated choreography that delays action.
2. Preserve immediate feedback while reducing excessive duration, distance, or
   animated material.
3. Correct easing, origin, and continuity.
4. Make repeated and gesture-driven behavior interruptible.
5. Bound expensive effects and choose the appropriate runtime mechanism.
6. Add authored polish only after feedback and state changes are clear.
7. Preserve meaning under reduced motion.

When motion is already right, return a positive-null result. Finish only when
the verdict follows the available evidence and every dynamic uncertainty names
the exact playback needed.
