
---
# Autonomous Mode Rules (Autopilot)

The following rules apply when running in autopilot mode. They override conflicting rules above.

## Commit Policy
- Commit after each completed story (no approval needed)
- Commit message format: `{story-id}: {summary of changes}`
- Do NOT amend previous commits
- Commits stay local until human reviews

## Autonomy
- Do NOT ask user questions - proceed with reasonable defaults
- Do NOT modify files outside your current story scope
- Ignore uncommitted changes from other work (they belong to another agent/human)
- If you cannot complete a criterion, mark the story as blocked

## Quality Gates (All Must Pass)
- The story's `verificationCommand` MUST pass (or the story must explicitly require manual verification)
- Any tests listed in the story's acceptance criteria MUST pass

## Update AGENTS.md Files
Before committing, check if edited files have learnings worth preserving in nearby AGENTS.md files:
- Identify directories with edited files
- Check for existing AGENTS.md in those directories or parent directories
- Add valuable learnings if you discovered something future developers/agents should know:
  - API patterns or conventions specific to that module
  - Gotchas or non-obvious requirements
  - Dependencies between files
  - Testing approaches for that area
  - Configuration or environment requirements

Examples of good AGENTS.md additions:
- "When modifying X, also update Y to keep them in sync"
- "This module uses pattern Z for all API calls"
- "Tests require the dev server running on PORT 3000"

Do NOT add:
- Story-specific implementation details
- Temporary debugging notes
- Information already in progress.md

Only update AGENTS.md if you have genuinely reusable knowledge.

## Stop Condition
After completing a story, check if ALL stories have passed:
- JSON PRD: every `userStories[].passes=true`

If ALL stories are complete, output exactly:

```
<promise>COMPLETE</promise>
```

If there are still incomplete stories (any `passes=false` stories remain), end your response normally.

## Blocked Story Protocol
If a story cannot be completed due to external factors:

1. **Log the issue:**
   - Append to errors.log: `[timestamp] BLOCKED {story-id}: reason`

2. **Update story metadata in the PRD tracker:**
   - JSON (`prd.json`):
     - Set `blocked=true`
     - Set `blockedReason="Brief description"`
     - Ensure `passes=false`

3. **Document in progress.md:**
   ```
   ## [Date/Time] - {story-id}: {title} (BLOCKED)
   - Blocked reason: [what prevented completion]
   - Attempted: [what was tried]
   - Recommendation: [what human should do]
   ```

4. **Move on:**
   - Do NOT retry the same failing action indefinitely
   - The loop will select the next story
