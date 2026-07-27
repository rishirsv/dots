# Verified repository snapshot

- `Features/Settings/SettingsRootScreen.swift` currently mixes appearance,
  units, equipment, workout behavior, notifications, Live Activity, data, and
  support links.
- App-wide Settings should contain durable choices and truthful external-state
  summaries. Task-specific choices remain in Command, Measurements, Plans,
  Exercise Library, or Progress. Authorization and delivery policy remain in
  Apple Settings or Health.
- Reorganize the root into Workout, Units & Equipment, Alerts & Live Activity,
  Apple Health, Appearance & Feedback, Data & Privacy, and Help & About.
- `Data/Settings/SettingsSnapshot.swift` and `user_settings` own durable global
  preferences. Add auto-advance exercises defaulting on, Log RIR defaulting on,
  rest adjustment with exact values 15/30/60 seconds, and personal widget
  details defaulting off.
- Preserve existing Lock Screen-detail values during migration; fresh and reset
  values default off. Settings writes stage, persist, apply, and roll back on
  failure.
- Settings sync through the existing private-cloud settings payload. Preferred
  measurement fields are device-local because their Health Log definitions do
  not sync, but encrypted backup preserves them.
- `Widgets/WidgetSnapshotPublisher.swift` currently writes personal values to
  the App Group. When personal details are off, author generic snapshots before
  encoding; keep platform privacy redaction as a separate layer.
- `Platform/HealthContextRepository.swift` needs one atomic
  `clearImportedData()` operation. It removes imported Health samples, anchors,
  derived summaries, and derived search rows while preserving Health Log,
  workouts, projection receipts, export links, and integration state.
- Before clearing imported Health data, stop observers, cancel and await queued
  observer tails and historical backfill, and advance a generation checked
  before every writer commits. After the transaction, rebuild retained search
  truth, refresh readers, publish external surfaces, and deliberately resume
  observers when appropriate.
- Command capture favorites are one to six stable action IDs edited in Command,
  not app-icon quick actions. Measurements owns exactly three ordered field IDs
  with accessible non-drag reorder actions.
- Plan rest is optional on each exercise occurrence and resolves before the
  existing muscle-group and global defaults. Materialize it into a workout.
- Exercise Library query state and Progress period selection persist only for
  the current scene. They are not Settings or synced preferences.
- Selective deletion commits first, then one runtime owner reconciles Settings,
  notifications, active workout, Home, Journal, Progress, quick actions, and
  widgets. Widget publication failure cannot reverse committed deletion.
- Automatic private-cloud sync remains fixed policy. Do not add a pause toggle
  without separate retention, tombstone, account-switch, and multi-device
  semantics.
- Haptics, alternate icons, notification delivery, Live Activity system state,
  Health permission/clearing, and locked widgets require physical-device proof.
  Builds, simulator journeys, and external-system evidence remain separate.
