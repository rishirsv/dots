# A Readable Storyboard

For a sequence with meaningful stages, keep a short description near its timing
configuration. For example:

```text
Trigger: user opens the result preview.
1. Preview surface appears from its trigger.
2. Result becomes visible as the surface settles.
3. Supporting details enter together; primary actions are already usable.
Interruption: closing cancels pending entrances and returns toward the trigger.
Reduced motion: show the complete preview immediately.
```

Name values by their role, such as `surfaceEnter`, `detailsDelay`, and
`travelDistance`. Keep a single owner for sequencing and cancellation; derive
presentation from current state rather than accumulating independent flags.
Use a live tuning control only when comparing values would resolve a real choice.
