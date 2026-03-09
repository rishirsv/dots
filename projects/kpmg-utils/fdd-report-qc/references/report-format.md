# FDD Report QC Format

## Report Template

```markdown
# FDD Report QC: [Report Name]

## Overall Verdict
- Release recommendation: [Ready with minor edits / Needs revision before release / Do not release]
- Total issues: X
- Critical: X
- Important: X
- Minor: X

## Scope Reviewed
- Artifact: [Full report / section / exhibit]
- Covered sections: [list]
- Basis reviewed: [Markdown report, excerpt, converted DOCX, helper output]

## Critical Issues

1. **[Issue title]**
   - Issue type: [Factual mismatch / Unsupported conclusion / Inconsistent metric or period / Missing coverage / Formatting-document control]
   - Section: [section name]
   - Why it matters: [impact on report quality or release confidence]
   - What to reconcile: [specific correction or check needed]
   - Blocks client release: [Yes/No]

## Important Issues

1. **[Issue title]**
   - Issue type: [category]
   - Section: [section name]
   - Why it matters: [reason]
   - What to reconcile: [next action]
   - Blocks client release: [Yes/No]

## Minor Issues

1. **[Issue title]**
   - Issue type: [category]
   - Section: [section name]
   - Why it matters: [reason]
   - What to reconcile: [next action]
   - Blocks client release: [No]

## Missing Coverage

1. **[Expected section or analysis]**
   - Gap: [what is missing]
   - Why it matters: [why the omission weakens the report]
   - Action: [add analysis, narrow claim, or mark as out of scope]

## Review Checklist
- [ ] Repeated headline figures tie across sections and exhibits
- [ ] Conclusions are supported by cited or stated evidence
- [ ] Terminology is defined and used consistently
- [ ] Period labels and units are consistent throughout
- [ ] Required caveats, limitations, and disclaimers are present
- [ ] No stale placeholders, draft notes, or unresolved comments remain
```

## Issue Severity Classification

**Critical** (must fix before client delivery):
- Headline number mismatches across sections or exhibits
- Unsupported core diligence conclusions
- Material period or metric-definition conflicts
- Missing support that changes a deal conclusion
- Release-blocking document-control issues such as unresolved placeholders or contradictory text

**Important** (should fix):
- Missing but non-blocking section coverage
- Terminology inconsistency
- Weakly supported commentary that should be narrowed
- Missing labels, footnotes, or source indicators

**Minor** (polish items):
- Formatting inconsistencies
- Date or unit style variations that do not change meaning
- Minor heading, exhibit label, or punctuation issues

## Readiness Verdict Guidance

- **Ready with minor edits**: Only minor issues remain and no conclusion or headline figure is at risk.
- **Needs revision before release**: Important issues remain or multiple minor issues together reduce confidence in the report.
- **Do not release**: Any critical issue remains unresolved.
