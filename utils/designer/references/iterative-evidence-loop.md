# Iterative evidence loop

Use this when the request is iterative design or UI polish.

## Loop

1. Capture before state.
2. Diagnose quickly and choose exactly 3 high-impact improvements.
3. Implement only those 3 improvements.
4. Capture after state with matching framing.
5. Summarize improvements and list next candidates (do not implement candidates yet).

## Capture tooling

- Web UI: use Agent Browser for navigation, state checks, and screenshots.
- React Native/Expo iOS UI: use iOS Simulator screenshots with iPhone 17 Pro framing.

## Scope guardrails

- Preserve existing functionality.
- Avoid unrelated refactors or feature work.
- Keep changes focused on hierarchy, spacing, typography, states, accessibility, and motion.

## Evidence naming

Store evidence under:
- `./.agents/ui-iterations/<feature>/iter-XX-web-before.png`
- `./.agents/ui-iterations/<feature>/iter-XX-web-after.png`
- `./.agents/ui-iterations/<feature>/iter-XX-expo-before.png`
- `./.agents/ui-iterations/<feature>/iter-XX-expo-after.png`
- `./.agents/ui-iterations/<feature>/iter-XX-report.md`
