---
name: animated-video
description: Create timeline-based animated videos or motion-design pieces as HTML artifacts. Use when the user wants a short animated explainer, product walkthrough, motion concept, or cinematic UI sequence with playback controls, reusable scenes, and deliberate motion storytelling.
---

# Animated Video

Create motion pieces as authored HTML scenes with a real timeline, not as static mockups with a little animation sprinkled on top.

## Start Here

- Identify the story arc before building anything.
- Clarify the message, tension, characters, or product journey when the narrative is ambiguous.
- Break the piece into scenes and shots before writing code.

## Build Contract

- Start by calling `copy_starter_component` with `kind: "animations.jsx"`.
- Use the starter timeline system first: `Stage`, `Sprite`, `useTime()`, `useSprite()`, `Easing`, `interpolate()`, and `animate()`.
- Compose scenes from reusable JSX components instead of one giant timeline file.
- Fall back to other animation libraries only when the starter genuinely cannot support the needed behavior.

## Scene Design

- Give each scene a clear shot idea: establishing view, focus move, reveal, tension cut, or close-up.
- Keep scenes grounded in a context such as a phone, browser, room, device, or environment rather than floating everything in empty space.
- Use titles or captions only when they help orientation. Prefer showing over telling.
- Hold long enough for text and imagery to register before moving on.

## Motion Rules

- Keep something in motion unless a still beat is a deliberate dramatic choice.
- Use anticipation, easing, follow-through, exaggeration, and camera motion where they improve clarity.
- Prefer subtle pans, zooms, drift, build-ins, and shot changes over static frames.
- Treat static images as needing motion too: crop, pan, zoom, reveal, or layer animation around them.

## Cursor And Walkthroughs

- When a cursor or pointer appears, zoom toward the area of action and follow it like a product-demo camera move.
- Use refs to measure target positions so the cursor points at the real on-screen elements.
- Avoid guessed coordinates for walkthrough motion when the DOM can tell you the truth.

## Review Pass

- Check that the timeline is readable as scenes, not just effects.
- Make sure the root `data-screen-label` updates with the current timestamp each second so later comments can point to exact moments.
- Rework any section where motion feels ornamental instead of explanatory.

## Detailed Guidance

Read [references/motion-guidance.md](references/motion-guidance.md) for the extracted detailed starter capabilities, shot guidance, motion heuristics, and cursor-tracking rules.
