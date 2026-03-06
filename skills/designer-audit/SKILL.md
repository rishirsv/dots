---
name: designer-audit
description: "Audit and critique frontend interfaces from both a systematic quality and design-effectiveness perspective. Use when Codex needs to review a UI, produce findings, score or prioritize problems, diagnose accessibility, responsive, theming, or performance issues, detect generic AI design tells, or explain why a design is or is not working. This skill reports problems; it does not implement fixes."
---

Conduct a holistic interface review that combines systematic audit coverage with high-level design critique. Think like a design director and a quality auditor at the same time.

Use `designer-frontend` as the reference point for design principles and anti-patterns. This skill does not redesign the interface directly. It diagnoses, prioritizes, and explains.

## Priority Rule

Before following any other workflow in this skill:
- check for `docs/DESIGN.md` in the project root
- if it exists, read it first and treat it as the primary record of the repo’s intended design conventions
- evaluate the interface against those conventions before judging it as inconsistent or proposing change

If `docs/DESIGN.md` does not exist, do not create or refresh it silently. Use `design-init` only when the user explicitly asks for design-context setup or refresh.

## Use This Skill For

- Reviewing an existing interface and producing findings
- Writing a critique, audit, scorecard, or prioritized issue list
- Explaining why a design feels weak, generic, confusing, or broken
- Deciding whether the next step is redesign or finishing work

## Do Not Use This Skill For

- Implementing the fixes during the review
- Acting as the primary interface creation skill
- Acting as the final ship pass after priorities are already known

## Review Goals

Evaluate two things at once:

1. **Is the interface technically and operationally sound?**
2. **Does the interface work as a designed experience relative to the product’s existing design conventions?**

Every review should cover both:
- **Systematic quality**: accessibility, performance, theming, responsiveness, and implementation risks
- **Design effectiveness**: hierarchy, composition, information architecture, emotional tone, copy quality, and overall distinctiveness

## Core Review Dimensions

### 1. Anti-Patterns Verdict

Start here. Check whether the work shows the common fingerprints of generic AI output:
- AI color palette
- Gradient text used as fake impact
- Default dark mode with glowing accents
- Decorative glassmorphism
- Hero metrics template
- Identical card grids
- Generic fonts
- Nested cards
- Weak hierarchy

Ask the blunt question: if someone saw this and heard “AI made this,” would they instantly believe it?

### 2. Visual Hierarchy

Check whether the interface guides the eye correctly:
- Is the most important thing obvious in 2 seconds?
- Is there a clear primary action?
- Are size, color, position, and contrast communicating importance?
- Are multiple elements competing for the same visual weight?

### 3. Information Architecture

Check whether the interface is understandable:
- Is the structure intuitive for a new user?
- Is related content grouped logically?
- Are there too many choices at once?
- Is navigation predictable?

### 4. Composition, Rhythm, and Balance

Check layout quality:
- Does the layout feel intentional or accidental?
- Is whitespace used on purpose?
- Is there rhythm in spacing and repetition?
- Does asymmetry feel designed rather than sloppy?

### 5. Emotional Resonance and Brand Fit

Check whether the interface feels right:
- What emotion does it evoke?
- Is that emotion intentional?
- Does it match the product and target user?
- Does it feel trustworthy, premium, playful, calm, bold, or whatever it should feel like?

### 6. Discoverability and Affordance

Check whether users know what to do:
- Are interactive elements obviously interactive?
- Would a new user understand the next action without help?
- Are hover, focus, and active states doing useful work?
- Are important features hidden?

### 7. Typography, Color, and Copy

Check communication quality:
- Does type hierarchy signal what to read first, second, and third?
- Is body copy comfortable to read?
- Is color used to communicate rather than decorate?
- Are labels, instructions, errors, and buttons clear and human?

### 8. States and Edge Cases

Check whether the experience still works outside the happy path:
- Empty states
- Loading states
- Error states
- Success states
- Long text
- Missing data
- Small screens
- Text scaling

### 9. Accessibility, Responsiveness, and Theming

Run systematic quality checks:
- Contrast issues
- Missing labels or semantics
- Keyboard and focus problems
- Touch targets below 44x44px
- Hard-coded widths and overflow
- Hard-coded colors or broken theme behavior

### 10. Performance Signals

Check for meaningful performance risks:
- Layout thrashing
- Expensive animations
- Large or unoptimized images
- Obvious bundle bloat
- Unnecessary re-renders
- Layout shifts

## Report Format

Always structure the review as a prioritized report.

### Anti-Patterns Verdict
Pass or fail. Be blunt and cite the exact tells.

### Overall Impression
One short paragraph with the gut-level read and the single biggest opportunity.

### What’s Working
List 2-5 concrete strengths worth preserving.

### Priority Findings
List the most important problems first.

For each finding, include:
- **What**: the problem
- **Where**: file, screen, or component
- **Why it matters**: user or business impact
- **Severity**: Critical, High, Medium, or Low
- **Fix direction**: what should change
- **Suggested skill**: usually `designer-frontend` for redesign or `designer-polish` for implementation cleanup

### Patterns and Systemic Issues
Call out recurring problems, not just isolated ones.

### Minor Observations
Keep smaller issues brief so they do not drown out the important work.

### Recommended Next Steps
Prioritize into:
1. Immediate blockers
2. Near-term fixes
3. Follow-up improvements

Choose the recommended handoff clearly:
- Use `designer-frontend` when the core design direction or structure needs rework.
- Use `designer-polish` when the design direction is sound but implementation quality needs tightening.
- Preserve the existing design language by default unless the user explicitly asks for a departure.

## Rules

- Do not fix the issues in this skill. Report them.
- Do not soften criticism until it becomes vague.
- Do explain impact clearly so findings are actionable.
- Do celebrate strong work where it exists.
- Do prioritize ruthlessly. If everything is important, nothing is.

## Boundaries

- Use this skill for reviews, audits, critiques, and prioritized findings.
- Use `designer-frontend` to create or redesign the solution.
- Use `designer-polish` to implement the finishing pass once the problems are understood.
