# Motion Standards

Use repository and platform conventions first. Treat these values as review
defaults; require evidence before calling a deliberate, measured exception a
defect.

## Purpose And Frequency

Motion must explain feedback, state, relationship, hierarchy, or one earned
focal moment.

| Frequency | Review default |
| --- | --- |
| Repeated or keyboard-driven | Do not delay the action; retain immediate state feedback |
| Routine navigation or hover | Keep short and remove repeated spectacle |
| Occasional overlay or state change | Use a standard transition |
| Rare or focal moment | Allow authored motion when the product and brief support it |

Decoration without a job is motion debt. Frequency lowers the acceptable
duration and expressive weight.

## Timing And Easing

| Duration | Typical use |
| --- | --- |
| `100–150ms` | Immediate press or state feedback |
| `150–300ms` | Routine transition, tooltip, menu, or selection |
| `300–500ms` | Layout, drawer, modal, or view transition |
| `500–800ms` | Deliberate focal entrance that does not delay use |

Exit faster than entrance. Use natural deceleration for arrivals, `ease-in-out`
for movement already on screen, and linear timing only for constant-rate motion
such as progress or a marquee. A longer transition needs distance,
consequence, or authored purpose that remains clear during repeated use.

Do not use bounce or elastic curves by reflex. Reserve visible overshoot for a
playful system or momentum-driven interaction.

## Origin, Continuity, And Interruption

- Enter and exit along paths that preserve spatial meaning.
- Anchor popovers and menus to their trigger; center modal motion only when the
  viewport is the true origin.
- Avoid `scale(0)` for ordinary entrances because it erases material continuity;
  use a bounded scale plus opacity when scaling is appropriate.
- Use transitions for retargetable state changes and a spring or equivalent
  current-value mechanism for gesture-driven motion.
- Do not lock input while routine UI animates.
- Preserve the presented value and velocity when an interaction reverses or is
  grabbed mid-flight.

Sibling stagger is valid when a list appears as a list. Cap total delay and
never block interaction while it plays.

## Material And Performance

Transform and opacity are reliable foundations, not the entire palette. Choose
material for meaning:

- transforms, shared elements, FLIP, or view transitions for continuity;
- bounded blur, light, shadow, or backdrop for focus and depth;
- masks, clips, crop, or occlusion for reveal and composition;
- color, gradient, texture, distortion, or shaders for a supported visual world;
- the smallest visible change for state and feedback.

Avoid casually animating layout-driving properties. Use transforms, FLIP, or
grid techniques when they express the same result. Bound blur, filters,
shadows, canvas, and shaders to isolated regions. Apply `will-change` only
during known motion.

Choose CSS, WAAPI, native APIs, or the repository's motion library by required
interruption, sequencing, dynamic values, and existing convention. Keep content
visible when scripts fail. Measure the target viewport or device; no property or
API is automatically fast.

## Gestures

- Track direct manipulation continuously and respect the grab offset.
- Capture the pointer or use the platform's equivalent once dragging begins.
- Use velocity and projected direction when a flick should affect the resting
  target.
- Add progressive resistance beyond natural boundaries.
- Keep a visible alternative for undiscoverable gestures.
- Verify gestures on representative hardware when input physics or haptics
  affect the result.

## Accessibility

Reduced motion keeps useful feedback while replacing vestibular movement,
parallax, large slides, and unnecessary loops with a gentler or static
equivalent. Stop nonessential loops when hidden or offscreen. Gate hover motion
to devices that truly hover.

Verify that motion does not block focus, reading, navigation, or task
completion, and that state change remains understandable without movement.

## Acceptance

Motion passes when:

- every animation has a purpose or authored role;
- routine actions feel immediate;
- origin and continuity explain the relationship;
- repeated and gesture-driven motion can be interrupted where needed;
- expensive effects remain smooth on the target device;
- reduced motion preserves meaning;
- removing the motion would lose feedback, relationship, or intentional
  character rather than decoration.
