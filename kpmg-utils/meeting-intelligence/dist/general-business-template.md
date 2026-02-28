# General Business Meeting Templates

Select the **relevant template blocks** based on what the meeting contents (status update, decision, 1:1, sprint planning, brainstorming). Templates below are included verbatim in Markdown blocks; use only the blocks/sections needed. Follow the guidance for each template to use the sections correctly.

## When to use each template

- **Status Update**: recurring check-ins; progress vs plan; surfacing blockers/risks and near-term priorities.
- **Decision Meeting**: the goal is to evaluate options and make (or tee up) a decision with a clear owner and follow-ups.
- **1:1**: manager/report check-ins focused on priorities, feedback, and growth topics.
- **Sprint Planning**: planning an agile sprint (capacity, committed scope, dependencies).
- **Brainstorming**: generating ideas, exploring approaches, and converging on next steps.

If a meeting spans multiple types, pull only the relevant blocks/sections across templates to reflect what actually happened (do not output two full templates).

---

## Status Update Meeting Template

When to use:
- Weekly/biweekly project check-ins, steering updates, or workstream reviews.
- You need to show progress vs plan, upcoming work, and the top blockers/risks.

How to use the sections (include only what was actually discussed):
- **Executive Summary**: Set 🟢/🟡/🔴 and add a one-line rationale tied to scope/timeline/quality; if not stated, write `Not explicitly stated`.
- **Progress Since Last Meeting**: Separate **Completed** vs **In Progress**; call out slips, de-scopes, and material changes in plan.
- **Metrics**: Use only if metrics/targets were discussed; if a key metric is referenced without a value/target, keep `TBD` and add a follow-up in **Action Items**.
- **Upcoming Work**: Capture near-term commitments (next 2 weeks) vs next milestone(s) (next month); distinguish committed vs tentative if speakers do.
- **Blockers & Risks**: State the blocker/risk and impact; include the current mitigation/action and owner if mentioned.
- **Discussion Topics**: Use for topics that needed input/alignment (not a catch-all recap).
- **Decisions Needed**: List decisions explicitly requested; if a decision was made, capture the outcome and mirror any resulting work in **Action Items**.
- **Action Items**: Every action has an owner and due date (use `TBD` if not stated).
- **Next Meeting**: Capture date/focus if mentioned; otherwise `TBD`.

```markdown
# [Project Name] Status Update

## Meeting Details
**Date**: [Date and time]
**Attendees**: [List]
**Project**: [Project Page]

## Executive Summary

**Status**: 🟢 On Track / 🟡 At Risk / 🔴 Behind

**Progress**: [Percentage] complete
**Timeline**: [Status vs original plan]

## Progress Since Last Meeting

### Completed
- [Accomplishment with specifics]
- [Accomplishment with specifics]

### In Progress
- [Work item and status]
- [Work item and status]

## Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| [Metric] | [Value] | [Value] | [Icon] |
| [Metric] | [Value] | [Value] | [Icon] |

## Upcoming Work

**Next 2 Weeks**:
- [Planned work]
- [Planned work]

**Next Month**:
- [Milestone or major work]

## Blockers & Risks

### Active Blockers
- **[Blocker]**: [Description and impact]
  - Action: [What's being done]

### Risks
- **[Risk]**: [Description]
  - Mitigation: [Strategy]

## Discussion Topics

1. [Topic requiring input]
2. [Topic for alignment]

## Decisions Needed

- [Decision] or None

## Action Items

- [ ] [Action] - @[Owner] - Due: [Date]

## Next Meeting

**Date**: [Date]
**Focus**: [What next meeting will cover]
```

Incremental guidance:
- Keep the “Active Blockers” and “Risks” lists to the **1–3** most important items each when possible.
- Ensure every action item has an owner and due date (`TBD` if not stated).

---

## Decision Meeting Template

When to use:
- The meeting is primarily about making a decision (or narrowing options) with an explicit owner and timeline.
- You need to capture options, trade-offs, criteria, and the selected path.

How to use the sections (include only what was actually discussed):
- **Pre-Read Summary**: Keep it short (2–3 sentences); only include links/background that were referenced or clearly relevant.
- **Decision Required**: Write the decision question verbatim where possible; capture decision owner and deadline/timeline if stated.
- **Options Analysis**: Include only the options actually discussed; keep pros/cons decision-driving (not exhaustive); capture any quantitative estimates (cost, effort, KPI impact) exactly as stated.
- **Decision Framework**: List criteria explicitly used by the group; if criteria weren’t stated, leave placeholders rather than inventing.
- **Recommendation**: If someone recommends an option, attribute it and capture the stated rationale.
- **Decision**: If decided, fill Selected Option/Rationale/Owner/Timeline; if deferred, state “Deferred” and add the next step as an **Action Item**.
- **Action Items**: Ensure every follow-up has an owner and due date (`TBD` if not stated).
- **Follow-up**: Capture next review date and success metrics if mentioned; otherwise leave placeholders.

```markdown
# [Decision Topic]

## Meeting Details
**Date & Time**: [Date and time]
**Duration**: [Length]
**Attendees**: [List of attendees with roles]
**Location**: [Physical location or video link]
**Facilitator**: [Name]

## Pre-Read Summary

### Background
[2-3 sentences providing context from related project pages]

**Related Pages**:
- [Project Overview]
- [Previous Discussion]

### Current Situation
[What brings us to this decision point]

## Decision Required

**Question**: [Clear statement of decision needed]

**Timeline**: [When decision needs to be made]

**Impact**: [Who/what is affected by this decision]

## Options Analysis

### Option A: [Name]
**Description**: [What this option entails]

**Pros**:
- [Advantage]
- [Advantage]

**Cons**:
- [Disadvantage]
- [Disadvantage]

**Cost/Effort**: [Estimate]
**Risk**: [Risk assessment]

### Option B: [Name]
[Repeat structure]

### Option C: Do Nothing
**Description**: What happens if we don't decide
**Implications**: [Consequences]

## Recommendation

[If there is a recommended option, state it with rationale]

## Discussion Topics

1. [Topic to discuss]
2. [Clarification needed on]
3. [Trade-offs to consider]

## Decision Framework

**Criteria for evaluation**:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

## Decision

[To be filled during meeting]

**Selected Option**: [Option chosen]
**Rationale**: [Why]
**Owner**: [Who will implement]
**Timeline**: [When]

## Action Items

- [ ] [Action] - @[Owner] - Due: [Date]
- [ ] [Action] - @[Owner] - Due: [Date]

## Follow-up

**Next review**: [Date]
**Success metrics**: [How we'll know this worked]
```

Incremental guidance:
- When multiple options exist, keep pros/cons concise and focus on decision-driving trade-offs.
- Mirror the chosen option into “Decision” and ensure execution ownership is explicit.

---

## 1:1 Meeting Template

When to use:
- A manager/report 1:1 or similar coaching/feedback conversation.
- The goal is to capture agenda items, key discussion points, and follow-ups with owners.

How to use the sections (include only what was actually discussed):
- **Agenda**: Capture both parties’ topics; reorder if the meeting followed a different sequence.
- **Discussion Notes**: Group by topic; keep bullets conclusion-first and use direct attribution where helpful.
- **Career Development**: Include only if discussed; capture the development goal, agreed next steps, and any timelines.
- **Feedback**: Keep it concrete and behavior-based; include examples that were stated (avoid vague praise/critique).
- **Action Items**: Separate manager vs report ownership when possible; add due dates (`TBD` if not stated).
- **Next Meeting**: Carry forward any explicit topics or cadence decisions.

```markdown
# 1:1: [Manager] & [Report]

## Meeting Details
**Date**: [Date]
**Last meeting**: [Previous 1:1]

## Agenda

### [Report]'s Topics
1. [Topic to discuss]
2. [Question or concern]

### [Manager]'s Topics
1. [Topic to cover]
2. [Feedback or update]

## Discussion Notes

### [Topic 1]
[Discussion points]

**Action items**:
- [ ] [Action] - @[Owner]

### [Topic 2]
[Discussion points]

## Career Development

**Current focus**: [Development goal]
**Progress**: [Update on progress]

## Feedback

**What's going well**:
- [Positive feedback]

**Areas for growth**:
- [Developmental feedback]

## Action Items

- [ ] [Action] - @[Report] - Due: [Date]
- [ ] [Action] - @[Manager] - Due: [Date]

## Next Meeting

**Date**: [Date]
**Topics to cover**:
- [Carry-over topic]
- [Upcoming topic]
```

Incremental guidance:
- Keep feedback concrete and behavior-based; include specific examples when stated.
- Ensure action items are assigned to manager vs report explicitly.

---

## Sprint Planning Template

When to use:
- Planning the next sprint (capacity, priorities, committed work, dependencies).
- The meeting includes points/capacity, backlog selection, or sprint goal-setting.

How to use the sections (include only what was actually discussed):
- **Sprint Goal**: One clear statement of what “done” means for the sprint.
- **Capacity**: Fill availability and points if discussed; if not, leave `TBD` and add a follow-up in **Next Steps** or as an **Action Item**.
- **Backlog Review / Sprint Backlog**: Capture committed items, owners, points, and any explicit “stretch” conditions or scope cuts.
- **Dependencies & Risks**: List the key dependencies and the risk they introduce; tie each to an action/owner where mentioned.
- **Definition of Done**: Keep as the team’s checklist; if the team referenced a different DoD, reflect that in the notes.
- **Next Steps**: Capture start-of-sprint actions and key dates (standups, sprint review) if mentioned.

```markdown
# Sprint [#] Planning

## Meeting Details
**Date**: [Date]
**Team**: [Team name]
**Sprint Duration**: [Dates]

## Sprint Goal

[Clear statement of what this sprint aims to accomplish]

## Capacity

| Team Member | Availability | Capacity (points) |
|-------------|--------------|-------------------|
| [Name] | [%] | [#] |
| **Total** | | [#] |

## Backlog Review

### High Priority Items

[From product backlog, linked from task database]

- [Task 1] - [Points]
- [Task 2] - [Points]

## Sprint Backlog

### Committed Items

- [x] [Task] - [Points] - @[Owner]
- [ ] [Task] - [Points] - @[Owner]

**Total committed**: [Points]

### Stretch Goals

- [ ] [Task] - [Points]

## Dependencies & Risks

**Dependencies**:
- [Dependency]

**Risks**:
- [Risk]

## Definition of Done

- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA approved

## Next Steps

- Team begins sprint work
- Daily standups at [Time]
- Sprint review on [Date]
```

Incremental guidance:
- Capture any explicit scope cuts or “stretch” conditions stated on the call.
- If points/capacity are not discussed, leave placeholders and add an open item to confirm.

---

## Brainstorming Meeting Template

When to use:
- Early-stage idea generation or approach exploration.
- The group is trying to produce options and decide on next steps or experiments.

How to use the sections (include only what was actually discussed):
- **Objective / Success looks like**: Make these explicit; they should match what the group was trying to produce (ideas, options, a direction, experiments).
- **Background & Context**: Include only if the meeting referenced prior work or research; keep it concise.
- **Constraints**: Capture constraints and non-goals stated by speakers (time, budget, tech, process, scope).
- **Ideas Generated / Themes**: Capture ideas without over-editing; group into themes/patterns only when the meeting did.
- **Evaluation**: Use only if the group evaluated/stack-ranked; capture the criteria and the outcome.
- **Next Steps**: Convert convergence into concrete actions with owners and timing (`TBD` if not stated).
- **Follow-up**: Capture the next meeting date or decision point if mentioned.

```markdown
# [Topic] Brainstorming

## Meeting Details
**Date**: [Date]
**Facilitator**: [Name]
**Note-taker**: [Name]
**Attendees**: [List]

## Objective

[Clear statement of what we're brainstorming]

**Success looks like**: [How we'll know brainstorming was successful]

## Background & Context

[Context from research - 2-3 paragraphs]

**Related Pages**:
- [Context Page 1]
- [Context Page 2]

## Constraints

- [Constraint]
- [Constraint]
- [Constraint]

## Seed Ideas

[Starting ideas from research to spark discussion]:

1. **[Idea]**: [Brief description]
2. **[Idea]**: [Brief description]

## Ground Rules

- No criticism during ideation
- Build on others' ideas
- Quantity over quality initially
- Wild ideas welcome

## Brainstorming Notes

### Ideas Generated

[To be filled during meeting]

1. [Idea with brief description]
2. [Idea with brief description]

### Themes/Patterns

[Groupings that emerge]

## Evaluation

[If time permits, evaluate top ideas]

### Top Ideas

| Idea | Feasibility | Impact | Effort | Score |
|------|-------------|---------|--------|-------|
| [Idea] | [H/M/L] | [H/M/L] | [H/M/L] | [#] |

## Next Steps

- [ ] [Action to explore idea]
- [ ] [Action to prototype]
- [ ] [Action to research]

## Follow-up

**Next meeting**: [Date to reconvene]
```

