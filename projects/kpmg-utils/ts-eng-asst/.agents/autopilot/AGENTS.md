# TS-SoW Project Conventions

## Project Context

This project builds a custom GPT for KPMG Transaction Services that generates Statements of Work and Engagement Letters. The current autopilot run is mining 22 real-world SOW documents across 11 industries to build a structured FDD scope library.

## Mining Agent Rules

- Read the extracted JSON files from `dist/el-samples-text/{industry}/` — these contain paragraph text with formatting metadata (style, bold, indent_level, font_size_pt)
- Use the formatting metadata to distinguish headings (bold, indent 0) from bullets (indent 1+) from body text
- Copy bullet text verbatim from the source — do not rewrite or summarize
- Only extract Financial Due Diligence content — skip tax DD, IT DD, HR DD sections but note they exist
- Write output to `docs/mining/{industry_slug}.json`
- If a file is a PDF with minimal text (1 line), note it as "insufficient content" and move on
- If a file is an engagement letter rather than a SOW, note this and extract whatever scope content exists

## File Naming

- Files: `kebab-case`
- JSON keys: `snake_case`

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

3. **Document in progress.md**

4. **Move on** - Do NOT retry the same failing action indefinitely
