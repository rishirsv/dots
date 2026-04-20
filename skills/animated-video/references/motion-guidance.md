# Motion Guidance

This reference preserves the detailed extracted guidance behind the `animated-video` skill.

## Starter Surface

Begin with `copy_starter_component` using `kind: "animations.jsx"`.

The starter provides:

- `<Stage width height duration>` with scaling and playback controls
- `<Sprite start end>` to gate children by timeline range
- `useTime()` and `useSprite()`
- `Easing`
- `interpolate()` and `animate()`
- `TextSprite`, `ImageSprite`, and `RectSprite`

Read the starter after copying it and build on top of those primitives before reaching for a different library.

## Narrative First

Before building visuals:

- identify the story arc
- identify the message or tension
- identify the key subjects or characters
- align on that story when the brief is ambiguous

The goal is not a pile of effects. The goal is visual storytelling.

## Scene Principles

- Use establishing shots before tight focus shots when that helps orientation.
- Keep most scenes inside a believable setting such as a UI, phone, desktop, room, or visual environment.
- Prefer one clear shot idea per scene.
- In short pieces, scenes can be one shot or a short sequence of related shots.

Good shot ideas include:

- slow zoom to a focal area
- rapid tension cut between two states
- following a cursor or moving object
- staged buildup around one key element

## Motion Principles

- Keep something moving unless a still hold is deliberate.
- Apply animation principles such as anticipation, easing, follow-through, and exaggeration where useful.
- Avoid dead frames.
- Even still images should gently move, reveal, pan, zoom, or participate in a build sequence.

When text or imagery appears, leave enough time for it to register before replacing it.

## Cursor Walkthrough Rule

When showing pointer motion in a product walkthrough:

- zoom toward the pointer target
- follow it with a damped camera move
- use refs to locate the real target positions

Do not eyeball coordinates when the DOM can provide the truth.

## Review Heuristics

- Make sure scenes read as scenes, not as disconnected effects.
- Check that motion supports the story.
- Keep the root `data-screen-label` updated with the current timestamp each second so later comments can refer to precise moments.
