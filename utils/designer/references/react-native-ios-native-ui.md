# React Native iOS (Expo) guide

Load this file whenever building or redesigning an iOS app using React Native/Expo.

## Required baseline
- Preserve native iOS feel over web-like styling.
- Prefer platform-native controls and navigation patterns.
- Keep touch targets comfortable and feedback immediate.
- Keep motion subtle, purposeful, and performance-safe.

## Core iOS checklist
- Keep typography hierarchy clear and comfortable.
- Keep list/row density readable and tap-friendly.
- Prefer native controls when available (for example Switch, segmented controls, date/time pickers).
- Prefer native navigation patterns (stack headers, tabs, sheets/modals) over web-like custom shells.
- Use subtle haptics and clear pressed/selected states for confidence.
- Keep visual effects (blur/material/shadow) subtle and system-aligned.
- Verify dynamic type and accessibility labels on icon-only actions.

## Implementation defaults for iOS RN work
- Prefer Expo Router native patterns (stack, sheet, native tabs) over custom web-like abstractions.
- Prefer Reanimated for transitions and state animations.
- Prefer native iOS controls before custom-styled substitutes.
- Respect safe areas and scroll behavior in route roots.
- Add haptics intentionally for confirmation moments.
- Keep state styling complete: default, pressed, focus-visible (where relevant), disabled, loading, success/error.

## Quick quality pass (iOS RN)
- Verify typography hierarchy and row density on iPhone viewport.
- Verify tap targets feel comfortable without precision.
- Verify pressed/selected states are obvious.
- Verify motion remains subtle and reduced where appropriate.
- Verify voice and state clarity for icon-only or ambiguous actions.
