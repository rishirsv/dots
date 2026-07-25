# Experience Audit

Judge a multi-step journey, workflow, product area, or supplied set of states
against one user goal. Report step health, cross-step findings, and the smallest
ship-now repair set.

## Choose The Audit

- **UX:** task entry, information architecture, flow, hierarchy, trust, copy,
  state coverage, consistency, responsiveness, and product quality.
- **Accessibility:** perceivable content, semantics, keyboard and focus, target
  size, labels, errors, motion, reflow, and assistive-technology risks.
- **Combined:** both when requested, when the experience is high-stakes, or when
  a material accessibility risk appears during a UX audit.

Before capture, state the product, flow or product area, user goal, smallest
useful outcome, relevant user role, audit mode, and evidence limits. For static
artifacts, mark unknown context and stay within visible evidence.

## Inspect The Experience

Use these lenses as coverage prompts, not report headings:

- task entry, discoverability, orientation, and exit;
- information architecture, sequence, and unnecessary friction;
- hierarchy, grouping, readability, and action priority;
- trust, consequences, reassurance, and recovery;
- default, loading, empty, validation, error, success, permission, stale, and
  interrupted states where reachable;
- labels, instructions, calls to action, and terminology;
- consistency across steps, devices, and returning states;
- responsive behavior, continuity, performance feel, and system quality;
- product fit, visual unity, and subject specificity.

Add only the conditional lens that fits:

| Product | Additional evidence |
| --- | --- |
| Dense data | Definitions, units, dates, filters, sorting, baselines, axes, scales, outliers, partial data, and comparison paths. |
| AI or agent | Identity, scope, plan, progress, data/tool use, approval, cancel, undo, retry, failure recovery, human control, and accountability. |
| Generated or prompt-led | Brief fidelity, spatial and color accuracy, text rendering, tone, single product idea, template risk, and fabricated content. |
| High-stakes action | Preview, consequence, consent, destructive safeguards, recovery, and proof of completion. |

Judge structure before style: task flow, orientation, hierarchy, grouping,
spacing, contrast, readability, feedback, and state clarity precede decoration
or polish.

## Walk The Path

For each important step or supplied state:

1. Reach the state without crossing an unapproved side-effect boundary.
2. Wait for a live screen to become stable; reject loading, blank, blocked, or
   incorrect captures.
3. Inspect or capture the evidence.
4. Exercise navigation, focus, validation, recovery, state change, and motion
   only when they affect the user goal.
5. Record `good`, `mixed`, `poor`, or `blocked`, what the user sees, the effect
   on the task, one strength to preserve, and the strongest risk or next check.

After the step pass, identify only cross-step patterns that materially affect
the experience: hierarchy and density; interaction and feedback; typography
and content; color and material; responsiveness; accessibility; product fit and
system consistency.

## Handle Accessibility Evidence

Use:

- `Confirmed` when the inspected evidence establishes the claim;
- `Likely` when a visible issue remains unmeasured;
- `Needs testing` when keyboard, screen reader, semantics, focus order, reduced
  motion, zoom, analytics, or user behavior is required.

For a suspected `P0` or `P1`, perform the strongest available keyboard, DOM,
accessibility-tree, source, contrast, reflow, or interaction probe. If it cannot
run, state the missing probe and lower confidence. Do not claim WCAG compliance
from screenshots.

## Decide Completion

Return a blocked audit when the core flow cannot be completed, an important
step cannot be inspected, the source changes during review, a required saved
artifact cannot be produced, or the requested claim needs unavailable evidence.

Otherwise finish when:

- every important step has current evidence or a named limit;
- every `P0` and `P1` has the strongest available verification;
- findings use the parent anatomy and confidence rules;
- cross-step themes are supported by more than one step; and
- recommendations separate core-task repairs from optional polish.

## Report

Use one compact structure and omit empty sections:

```markdown
# Experience Audit

## Verdict And Scope
- Mode, user goal, flow, and evidence limits
- Design constitution score over evidenced principles

## Top Findings
- Findings in descending severity

## Step Health
1. Step — good | mixed | poor | blocked: concise evidence-grounded read

## System Themes
- Supported cross-step patterns

## Strong Decisions To Preserve
- Non-obvious strengths that changes should retain

## Ship-Now Fixes
- Ordered repairs tied to the core task or major risk

## Later Polish
- Non-blocking refinements

## Verification Gaps
- Missing interaction, accessibility, source, analytics, or user evidence
```

Lead the reader-facing report with the verdict and top findings, not tool logs,
provenance, or a screenshot inventory.
