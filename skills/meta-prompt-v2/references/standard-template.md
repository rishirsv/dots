# Standard Template

Use for structured prompts: briefs, memos, guides, plans, multi-step Codex tasks, reviews, complex image prompts, grouped outputs, or deliverables with named sections.

Target prompt length: 120-260 words.

## Guidance

- Use the minimum useful sections.
- Prefer `Role and Objective`, optional `Context`, `Instructions`, and `Output Format`.
- Keep role/persona narrow; omit it when a role does not change behavior.
- Put all layout, schema, sorting, tie-breakers, and length rules in `Output Format`.
- Add success criteria or validation only when correctness depends on it.
- Avoid visible plans unless the downstream user explicitly wants a plan artifact.

## Pattern

```markdown
# Role and Objective
[One or two sentences naming the artifact, audience, and outcome.]

# Context
[Only the constraints, source material, assumptions, or target surface that matter.]

# Instructions
- [What to cover or do]
- [What to preserve, prioritize, avoid, or verify]
- [Any target-surface rule such as Codex validation or image invariants]

# Output Format
- [Headings, sections, table columns, schema, ordering, and length]
- [Citation, fence, or final-answer rules if relevant]
```

## Examples

```markdown
# Role and Objective
You are a senior product marketer creating a launch plan for a mid-range home coffee machine.

# Instructions
- Assume the product includes a built-in grinder, programmable timer, and compact footprint; state these assumptions briefly.
- Focus on concrete actions for product, marketing, sales, support, and operations.
- Identify launch risks and mitigation owners.

# Output Format
- Use headings: Executive Summary, Audience, Positioning, Launch Plan, Risks, Metrics.
- Keep the plan concise enough for an internal 1-2 page working doc.
```
