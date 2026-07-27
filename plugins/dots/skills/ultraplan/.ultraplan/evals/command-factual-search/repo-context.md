# Verified repository snapshot

- `Features/Home/HomeSearchModel.swift:HomeSearchModel` owns the async global
  Command pipeline and keeps static commands separate from ranked search rows.
- `Features/Home/GlobalSearchQueryParser.swift:GlobalSearchQueryParser` already
  owns quoted phrases, scopes, and calendar expressions.
- `Data/Search/DatabaseGlobalSearchRepository.swift` indexes completed
  workouts, training notes, exercises, and plans.
- `Data/Journal/DatabaseJournalReadRepository.swift` owns canonical-unit
  conversion, temporal aggregation, Apple Health cache staleness, observed-day
  counts, and duplicate projection suppression.
- `Data/Health/healthkit_query_anchors` stores per-asset interval coverage tied
  to an authorization epoch. A cached row does not prove complete interval
  coverage.
- The platform cannot reliably distinguish denied Health read access from an
  interval with no observations.
- Command may answer `latest`, `total`, `count`, and `dailyAverage` for one
  resolved subject over exact calendar intervals. Totals and averages require
  complete coverage.
- Confidently recognized questions with equally matched subjects should offer
  at most three provider-owned clarifications. Input not confidently recognized
  as a question may remain ordinary Find.
- `Navigation/AppRouter.swift:AppRouter` owns app routing.
  `JournalNavigationHost` owns its durable calendar place locally and may
  consume a one-shot exact-place request.
- `AppIntents/ResumeWorkoutIntent.swift` and
  `Runtime/AppRuntimeCoordinator.swift` already read and revalidate the exact
  active-workout ID before opening the player.
- A stale Resume selection must keep Command open, remove the invalid row, and
  never fall through to Start Workout.
- The installed SDK exposes a beta system `searchInApp` App Intent schema.
  Recheck the final SDK before implementing that slice; do not add a
  compatibility shim.
- VoiceOver must expose an informational answer summary and a separate evidence
  action. A build does not prove this runtime ordering.
