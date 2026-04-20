# Frontend Skill Refresh Plan

## Goal

Remove the iOS, Expo, and native-mobile guidance from `frontend-skill`, then fold in the strongest general design rules from the referenced taste-skill so the result stays sharper, more varied, and more disciplined.

## Phase 1: Remove the mobile-specific contract

Outcome: the skill no longer advertises iOS or Expo behavior as part of its default scope.

- [x] 1.1 Remove iOS and Expo language from the `frontend-skill` description and priority order
- [x] 1.2 Delete the iOS/Expo addendum from the main skill body
- [x] 1.3 Update failure checks and litmus checks so they no longer reference iOS-native decisions

## Phase 2: Remove dead reference material

Outcome: there is one canonical frontend skill with no dormant iOS reference tree attached to it.

- [x] 2.1 Delete `skills/frontend-skill/references/ios/`
- [x] 2.2 Delete the mirrored `configs/claude/.claude/skills/frontend-skill/references/ios/`
- [x] 2.3 Keep non-iOS references, including interface-writing guidance, intact

## Phase 3: Align metadata and mirrors

Outcome: the repo skill, tracked Claude mirror, and installed local mirrors all present the same cleaned scope.

- [x] 3.1 Update `agents/openai.yaml` to remove iOS/Expo prompting
- [x] 3.2 Sync the cleaned skill into `/Users/rishi/.codex/skills/frontend-skill`
- [x] 3.3 Sync the cleaned skill into `/Users/rishi/.claude/skills/frontend-skill`

## Phase 4: Add stronger composition rules

Outcome: the frontend skill keeps the useful anti-slop guardrails from the taste-skill source without importing its stack-specific or overly rigid parts.

- [x] 4.1 Add layout-rhythm guidance that explicitly breaks repetitive left-right section loops
- [x] 4.2 Add typography, token-consistency, and overflow rules that strengthen review standards
- [x] 4.3 Keep the additions concise and compatible with the existing frontend-skill voice

## Phase 5: Validate and close out

Outcome: no lingering iOS or Expo guidance remains in the frontend skill footprint.

- [x] 5.1 Search the repo and local mirrors for leftover iOS/Expo references in `frontend-skill`
- [x] 5.2 Review diffs to confirm interface-writing improvements remain intact
- [x] 5.3 Move this plan to `docs/exec-plans/completed/` after implementation
