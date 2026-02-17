---
name: solution
description: Capture a solved problem as a searchable solution doc.
---

# Solution: <clear-title>

## Problem Signature
- Surface: <where this appears>
- Trigger: <when it appears>
- Severity: <P0|P1|P2|P3>
- Affected paths:
  - `<path>`
  - `<path>`

## Search Keywords
- `<error message>`
- `<feature area>`
- `<component/module>`
- `<symptom phrase>`

## Summary
<1-3 sentences: what broke and what fixed it.>

## Symptoms
- ...

## Root Cause
- ...

## Fix Applied
- ...

## Why This Works
- ...

## Guardrails
- How to detect regression:
  - `<check>`
- What not to do:
  - `<anti-pattern>`

## Prevention Checklist
- [ ] Add/adjust automated check to catch this class of issue.
- [ ] Add/adjust contract test or verification script coverage.
- [ ] Update relevant policy docs so future changes follow the safe pattern.
- [ ] Verify no neighboring surfaces still use the broken pattern.

## Verification
```bash
<commands to confirm the fix>
```

<What you should see.>

## Rollback (optional)
- <How to undo safely if needed.>

## References
- `path/to/file.ts:123`
- `path/to/file.ts:456`
- PR/commit (optional): ...
- External link (optional): ...
