# Impeccable vs Existing Design Skills

Date: 2026-04-07

## Installation note

I installed the Codex-facing `impeccable` bundle into `skills/impeccable/` as a local subfolder. The literal `npx skills add pbakaus/impeccable` command resolved the repo but stopped at an interactive multi-skill picker, so the actual repo-local install was completed by copying the Codex skill bundle into this repo.

## Executive take

Your current pair is tighter and better aligned to how you work:

- `frontend-skill` is the stronger core build skill.
- `polish-design` is the stronger polish workflow skill.

`impeccable` is still useful, but mostly as a source of modular sub-skills and reference material, not as a replacement for your current system.

My recommendation: do not replace your skills with `impeccable`, and do not broadly merge it wholesale. Cherry-pick a few ideas and possibly a few narrowly scoped sub-skills.

## What your skills already do better

### 1. Better workflow fit for Codex

Your `frontend-skill` starts from repo context and existing design language, with an explicit priority order through `docs/DESIGN.md` and local conventions ([skills/frontend-skill/SKILL.md](/Users/rishi/Code/ai-tools/skills/frontend-skill/SKILL.md#L12)). That is a better match for production iteration than `impeccable`'s stricter "get human design context first" gate ([skills/impeccable/frontend-design/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/frontend-design/SKILL.md#L9)).

This matters because `impeccable` is optimized for avoiding generic output from blank-slate prompting. Your skill is optimized for improving real repos without stalling.

### 2. Stronger operational polish loop

`polish-design` has a clearer implementation loop, explicit evaluator mode, screenshot routing, artifact storage, and stop/pivot logic ([skills/polish-design/SKILL.md](/Users/rishi/Code/ai-tools/skills/polish-design/SKILL.md#L39), [skills/polish-design/SKILL.md](/Users/rishi/Code/ai-tools/skills/polish-design/SKILL.md#L62), [skills/polish-design/SKILL.md](/Users/rishi/Code/ai-tools/skills/polish-design/SKILL.md#L101)). `impeccable`'s `polish` is strong as a checklist, but it is not a comparable orchestration workflow ([skills/impeccable/polish/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/polish/SKILL.md)).

### 3. Better handling of app UI and native surfaces

Your `frontend-skill` has meaningful guidance for dashboards, utility-copy, and Expo/iOS-native work ([skills/frontend-skill/SKILL.md](/Users/rishi/Code/ai-tools/skills/frontend-skill/SKILL.md#L75), [skills/frontend-skill/SKILL.md](/Users/rishi/Code/ai-tools/skills/frontend-skill/SKILL.md#L127), [skills/frontend-skill/SKILL.md](/Users/rishi/Code/ai-tools/skills/frontend-skill/SKILL.md#L168)). `impeccable` is much more web-general and brand/aesthetic-first.

## Where `impeccable` is stronger

### 1. Modular design skill system

This is the biggest gap. You currently have a strong base skill and a strong polish skill, but `impeccable` provides targeted sub-skills like `audit`, `critique`, `typeset`, and `harden` for recurring classes of work ([skills/impeccable/audit/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/audit/SKILL.md), [skills/impeccable/critique/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/critique/SKILL.md), [skills/impeccable/typeset/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/typeset/SKILL.md), [skills/impeccable/harden/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/harden/SKILL.md)).

That modularity makes it easier to steer a pass toward one goal instead of overloading one general-purpose skill.

### 2. Richer design-context capture

`teach-impeccable` is a real asset. It explores the repo, asks only what remains unclear, and persists a reusable design context to `.impeccable.md` ([skills/impeccable/teach-impeccable/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/teach-impeccable/SKILL.md#L8), [skills/impeccable/teach-impeccable/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/teach-impeccable/SKILL.md#L46)).

You currently prefer `docs/DESIGN.md`, which is good, but you do not have a dedicated "bootstrap the design context" skill.

### 3. More explicit evaluative frameworks

`impeccable/critique` is much more explicit about cognitive load, emotional journey, persona red flags, and heuristic scoring ([skills/impeccable/critique/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/critique/SKILL.md#L33), [skills/impeccable/critique/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/critique/SKILL.md#L91), [skills/impeccable/critique/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/critique/SKILL.md#L130)).

Your `polish-design` rubric is good, but it is more compact and more aesthetics-focused than UX-review-focused.

### 4. More explicit resilience and production-hardening guidance

Your skills mention states and resilience, but `impeccable/harden` goes much deeper on overflow, i18n, RTL, input extremes, API failures, and real-world edge cases ([skills/impeccable/harden/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/harden/SKILL.md#L13), [skills/impeccable/harden/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/harden/SKILL.md#L91), [skills/impeccable/harden/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/harden/SKILL.md#L145)).

### 5. Better specialized typography guidance

Your `frontend-skill` has sound typography constraints, but `impeccable/typeset` gives a more complete typography-improvement playbook with clearer diagnostics and systematic remediation ([skills/impeccable/typeset/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/typeset/SKILL.md#L13), [skills/impeccable/typeset/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/typeset/SKILL.md#L43)).

## Gaps in your skills worth addressing

### Gap 1. No dedicated design-context bootstrap skill

You should adopt this idea. Not the exact `impeccable` requirement gate, but a lighter Codex-friendly version:

- check `docs/DESIGN.md`
- check existing repo styles/tokens
- if still unclear, ask 2-4 focused design questions
- optionally persist a compact context file

### Gap 2. No dedicated UX critique skill

You have polish and evaluator scoring, but not a standalone critique workflow. A `critique-design` skill could cover:

- hierarchy and IA review
- cognitive load
- persona walkthroughs
- emotional journey
- prioritized UX findings without immediately editing

### Gap 3. No dedicated technical UI audit skill

`impeccable/audit` separates technical quality checks from design critique. That separation is useful and worth adopting. It would complement `polish-design` nicely.

### Gap 4. No dedicated hardening skill for interface resilience

This is probably the highest-value missing skill after critique/audit. The hardening surface area is broad enough that it deserves its own skill rather than staying implied inside polish guidance.

### Gap 5. No dedicated typography skill

This is optional, but useful. Typography is high leverage and easy to under-specify in a broad frontend skill.

## What I would adopt or merge

Adopt directly:

- The idea of a persistent design-context bootstrap skill from `teach-impeccable`.
- A separate UX critique skill.
- A separate technical frontend audit skill.
- A separate resilience/hardening skill.

Adopt selectively:

- Parts of `typeset` for typography diagnosis and remediation.
- Parts of `critique` for heuristic scoring and persona red flags.
- Parts of `audit` for explicit accessibility/performance/theming/responsive checklists.

Do not adopt directly:

- The hard requirement that design work must stop until user-supplied context exists ([skills/impeccable/frontend-design/SKILL.md](/Users/rishi/Code/ai-tools/skills/impeccable/frontend-design/SKILL.md#L11)). That is too rigid for your repo-oriented Codex workflow.
- The full command sprawl as-is. Twenty-one sub-skills is powerful, but it also increases discoverability and maintenance burden.

## Should you use `impeccable`?

Yes, but as a reference pack and selective source material, not as your default design system.

Best use:

- keep `frontend-skill` as your main build skill
- keep `polish-design` as your main polish workflow
- borrow from `impeccable` when you need focused passes like critique, audit, typography, or hardening

If you want one next step, I would build these 3 first:

1. `design-context` or `teach-design`
2. `critique-design`
3. `harden-ui`

Those would close most of the meaningful gap without importing the whole `impeccable` system.
