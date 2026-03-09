# Custom Prompt Guide

When no template fits, create a custom prompt following Oracle principles.

## Core Rules

1. **Optimize for correctness per token** - Be concise but complete
2. **Ground all claims in context** - Cite file paths
3. **No questions** - State assumptions, list unknowns
4. **Falsifiable hypotheses** - Avoid broad speculation
5. **Clear verdict** - End with actionable conclusion

## Prompt Skeleton

```markdown
### Role

You are [expertise] [doing task type] [with constraint].

### Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from files
- For concrete claims, cite file paths
- Do not ask questions; state assumptions

### Task

[1-2 sentences: what you need]

**Specific focus:**
[Bullets of key concerns]

**Constraints:**
[Any limitations or preferences]

### Output format

#### [Primary Analysis Section]

[What to include, how to structure]

#### [Evidence/Details Section]

[Supporting information format]

#### Verdict / Recommendation

[Clear conclusion format]
```

## Good vs. Bad Examples

### Role

**Good:** "a database engineer reviewing a complex migration for data integrity risks"

**Bad:** "an expert" (too vague)

**Good:** "a senior frontend engineer optimizing React render performance"

**Bad:** "someone who knows React" (lacks specificity)

### Task

**Good:** "Review the auth middleware for RBAC bypass vulnerabilities. Focus on the permission check in `authMiddleware.ts`."

**Bad:** "Review the code" (too broad)

**Good:** "Diagnose why the dashboard takes 5+ seconds to load on initial render. The waterfall shows multiple sequential API calls."

**Bad:** "Make it faster" (no specifics)

### Output sections

**Good:** "For each vulnerability: Severity, File, Description, Fix"

**Bad:** "List issues" (no structure)

**Good:** "Numbered steps with exact file paths and line numbers to change"

**Bad:** "What to do next" (vague)

## When to Use Custom Prompts

Use a custom prompt when:
- Task spans multiple domains (e.g., both security + performance)
- You need a specialized output format not in templates
- The task is highly specific to your domain/codebase
- You're doing research with specific validation criteria

Stick with templates when:
- The task clearly fits an existing category
- You want consistent, predictable output format
- You're unsure what structure would work best
