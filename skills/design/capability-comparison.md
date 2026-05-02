# Design Skill Capability Comparison

Date: 2026-05-02

## Short Answer

Impeccable more or less replaces OpenAI's `frontend-skill` if the question is pure capability breadth for frontend design. It contains the same core ambition, building high-quality interfaces that avoid generic AI output, and then adds a larger command system for critique, audit, hardening, typography, motion, color, context capture, and design-system documentation.

But it does not replace the shape we probably want for RS Tools.

For RS Tools, the best direction is not "install Impeccable wholesale." The better direction is a smaller explicit `design` skill that is repo-context-first, uses Codex's frontend guidance as the baseline, borrows Impeccable's best lenses, and borrows design-audit's concise scoring shape.

## Sources Reviewed

- OpenAI `frontend-skill`: https://github.com/openai/skills/blob/main/skills/.curated/frontend-skill/SKILL.md
- Impeccable: https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md
- Impeccable local study clone: `/tmp/rs-tools-design-refs/impeccable`
- Codex design-audit skill: https://github.com/Kappaemme-git/codex-design-audit-skill/tree/main/design-audit
- Local design candidates:
  - `references/candidates/design/frontend-skill`
  - `references/candidates/design/polish-design`
  - `references/candidates/design/design-init`
  - `references/candidates/design/interface-mockups`
  - `references/candidates/design/create-design-system`
- Anthropic design plugin references:
  - `references/anthropic/knowledge-work-plugins/design`

## Capability Matrix

Legend:

- `Strong`: first-class capability
- `Partial`: useful but not the main workflow
- `Weak`: mentioned or implied only
- `No`: not meaningfully covered

| Capability | OpenAI frontend-skill | Impeccable | design-audit | Local frontend-skill | polish-design | design-init | interface-mockups | create-design-system | Anthropic design refs |
|---|---|---|---|---|---|---|---|---|---|
| Build visually strong UI | Strong | Strong | No | Strong | Partial | No | No | No | Partial |
| Repo design context first | Partial | Partial | Partial | Strong | Strong | Strong | Strong | Partial | Partial |
| Product UI / app surfaces | Strong | Strong | Strong | Strong | Strong | Partial | Strong | Partial | Partial |
| Landing / brand pages | Strong | Strong | Strong | Strong | Strong | Partial | Strong | Partial | Partial |
| Design critique | Partial | Strong | Strong | Partial | Strong | No | Partial | Partial | Strong |
| Technical UI audit | Weak | Strong | Strong | Weak | Partial | No | Partial | No | Partial |
| Polish implementation loop | Partial | Strong | No | Partial | Strong | No | No | No | Weak |
| Reference matching | Weak | Partial | Partial | Weak | Strong | No | Strong | Partial | Partial |
| UI hardening / edge cases | Partial | Strong | Partial | Partial | Strong | No | Partial | No | Partial |
| Typography system | Partial | Strong | Partial | Strong | Partial | Partial | Partial | Partial | Partial |
| Motion / interaction feel | Strong | Strong | Partial | Strong | Partial | Partial | Partial | No | Partial |
| Anti-pattern library | Strong | Strong | Partial | Strong | Strong | No | Partial | No | Weak |
| Accessibility review | Partial | Strong | Strong | Partial | Strong | No | Partial | Partial | Strong |
| Responsive review | Partial | Strong | Strong | Partial | Strong | No | Partial | Partial | Partial |
| Performance perception | Partial | Strong | Strong | Partial | Partial | No | Weak | No | Weak |
| UX copy / microcopy | Partial | Strong | Partial | Strong | Partial | No | Partial | Partial | Strong |
| Design context bootstrap | Weak | Strong | No | Partial | No | Strong | Partial | Strong | Partial |
| DESIGN.md generation | No | Strong | No | No | No | Strong | No | Partial | No |
| Product/brand register | Weak | Strong | Partial | Partial | Partial | No | Partial | Partial | Partial |
| Image/mockup exploration | No | Strong | No | No | Partial | No | Strong | Partial | Partial |
| Design system package creation | No | Partial | No | No | No | Partial | Partial | Strong | Strong |
| Concise scorecard output | No | Partial | Strong | No | Partial | No | Partial | No | Partial |
| Re-audit / score deltas | No | Partial | Strong | No | Partial | No | No | No | No |
| Portable RS Tools fit | Strong | Weak | Strong | Strong | Strong | Strong | Strong | Partial | Partial |
| Trigger simplicity | Strong | Weak | Strong | Strong | Partial | Strong | Strong | Partial | Partial |

## What Impeccable Replaces

Impeccable can replace the OpenAI frontend-skill as a broader frontend design brain. It includes:

- the same basic visual craft concern: hierarchy, restraint, layout, color, typography, motion, and avoiding generic AI UI
- stronger anti-pattern language
- stronger product vs brand distinction
- stronger typography and color guidance
- explicit critique and audit commands
- hardening, responsive, accessibility, i18n, and performance passes
- persistent design context via `PRODUCT.md` and `DESIGN.md`
- many focused commands for steering design iteration

If we only wanted "one powerful external frontend design skill," Impeccable is the stronger package.

## What Impeccable Does Not Replace

Impeccable does not replace the RS Tools design workflow we want because it makes different trade-offs:

- It has a large command surface. That is powerful, but it is not the lean skill style we have been building.
- It requires `PRODUCT.md` as a hard preflight gate. Useful for brand systems, but too rigid for many repo-local Codex tasks.
- It is web/frontend-first. Your design work also includes native app surfaces, product specs, screenshots, generated mockups, and repo-specific design docs.
- It assumes its own context model. RS Tools should prefer the repo's existing design truth first, especially `docs/DESIGN.md`, app docs, platform conventions, and local UI primitives.
- It can become a design operating system. RS Tools probably needs a design assistant: explicit, bounded, repo-aware, and easy to invoke.

## Option-by-Option Notes

### OpenAI `frontend-skill`

Best for:

- building visually strong UI directly
- simple trigger surface
- landing pages, apps, prototypes, and product UI
- broad design guidance without command sprawl

Weakness:

- less explicit about audit, hardening, typography, and design context capture
- not enough durable artifact behavior for `docs/DESIGN.md`

Use it as the baseline design-writing voice.

### Impeccable

Best for:

- design vocabulary
- anti-patterns
- product vs brand register
- critique/audit/harden/typeset specialized passes
- context capture with `PRODUCT.md` and `DESIGN.md`
- ambitious visual iteration

Weakness:

- too many commands to import directly
- too much preflight ceremony for our default workflow
- not naturally RS Tools-shaped

Use it as the main reference library.

### `design-audit`

Best for:

- concise formal audits
- scorecards
- preset-based evaluation
- before/after re-audits
- top issues and recommended fixes

Weakness:

- evaluates more than it designs
- not a build or polish workflow
- scoring can become performative if used too often

Use it for the audit mode and scorecard reference.

### Local `frontend-skill`

Best for:

- repo-context-first design implementation
- `docs/DESIGN.md` priority
- product UI copy and visual hierarchy
- apps, dashboards, landing pages, motion, imagery

Weakness:

- still more build-oriented than critique-oriented
- does not own formal audit or design context generation

Use it as the local backbone.

### Local `polish-design`

Best for:

- iterative screenshot/code polish
- critique-first mode
- hardening-first mode
- reference matching
- evaluator-led loops when explicitly requested

Weakness:

- overlaps with future `design`
- artifact routing is very specific
- more workflow-heavy than a general design skill should be

Mine it for implementation loops and pass routing.

### Local `design-init`

Best for:

- explicit `docs/DESIGN.md` creation or refresh
- extracting component, layout, route, and token context

Weakness:

- narrow and artifact-only
- should not trigger during normal design work

Fold the idea into `design` as an explicit context-refresh lane, or keep it as a separate explicit-only helper if it becomes complex.

### Local `interface-mockups`

Best for:

- generated UI mockups
- mobile/web/component/state-matrix visual studies
- prompt-shaped design exploration

Weakness:

- image output is exploratory, not implementation truth
- depends on imagegen availability

Keep separate or make it a referenced lane. It should not be the core design skill.

### Local `create-design-system`

Best for:

- packaging reusable brand/design-system workspaces
- asset copying
- UI kits
- shareable design-system artifacts

Weakness:

- too artifact-heavy for routine UI design
- not a normal coding/design pass

Keep separate as a later, explicit workflow.

### Anthropic Design Plugin References

Best for:

- design critique
- design handoff
- design-system thinking
- accessibility and UX copy reference patterns

Weakness:

- broader plugin reference, not a direct RS Tools active skill
- connector/plugin structure is not the shape we need right now

Use as inspiration only.

## Recommended RS Tools Shape

Create one explicit-only `design` skill first.

Purpose:

> Improve, critique, or shape user interfaces by reading repo design context first, selecting the right design pass, and applying a small set of high-value design lenses.

Suggested pass types:

1. `build`: create or redesign a UI surface.
2. `polish`: improve an existing surface with screenshot/code iteration.
3. `audit`: produce a concise scorecard and top fixes.
4. `harden`: test states, overflow, accessibility, responsive behavior, and edge cases.
5. `context`: create or refresh `docs/DESIGN.md` only when explicitly requested.
6. `mockup`: route to generated visual studies when the user wants images/options.

Suggested tree:

```text
design/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── references/
    ├── visual-principles.md
    ├── audit-rubric.md
    ├── hardening.md
    ├── typography.md
    ├── design-context.md
    └── mockups.md
```

## Recommendation

Do not make `frontend-skill`, `polish-design`, `design-init`, `interface-mockups`, and Impeccable all active skills.

Instead:

1. Build `design` as the single active RS Tools design skill.
2. Make it explicit-only.
3. Keep `docs/DESIGN.md` as the primary repo design source.
4. Use Impeccable as the main reference pack, not the runtime surface.
5. Borrow `design-audit` for concise audits and re-audits.
6. Keep `interface-mockups` separate only if image-generation mockups become frequent enough to deserve their own explicit skill.

The practical answer is: Impeccable replaces OpenAI frontend-skill as a capability superset, but RS Tools should not replace its design workflow with Impeccable. RS Tools should distill Impeccable into a smaller, repo-native `design` skill.
