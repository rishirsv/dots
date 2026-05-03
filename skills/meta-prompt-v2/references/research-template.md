# Research Template

Use when the prompt must cause external research, source comparison, citations, current information checks, or uncertainty handling.

Target prompt length: 180-350 words.

## Guidance

- State the research objective, audience, geography/jurisdiction, and as-of date or time window.
- Define what needs citation support and what may be treated as background.
- Add a retrieval budget so the downstream assistant knows when to stop searching.
- Require uncertainty handling when sources conflict or evidence is missing.
- Use inline numeric citations and a final `References` section unless the user asks for another style.
- Do not ask for exhaustive searching unless the user explicitly needs exhaustive coverage.

## Pattern

```markdown
# Role and Objective
[Research role, question, audience, and decision this supports.]

# Scope
- As-of date / time window: [date or range]
- Geography / sector / source limits: [scope]

# Research Instructions
- [Core questions to answer]
- [Evidence quality expectations and citation requirements]
- [Missing-evidence and conflicting-source behavior]
- [Retrieval budget / stopping rule]

# Output Format
- [Headings, tables, columns, and length]
- Use inline numeric citations for important factual claims.
- Include a final References section with source title, publisher, date, and link.
```
