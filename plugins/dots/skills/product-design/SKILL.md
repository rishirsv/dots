---
name: product-design
description: "Use to route Product Design work when product-design is invoked directly or when the user asks for UI/UX design, app or interface design, redesign, prototyping, visual polish, implementation from a visual target, pre-handoff design critique, or UX/product-flow audit. Thin router only; sends work to visual-design, design-critique, or ux-audit."
---

# Product Design

## Skill Purpose

Route Product Design requests to the focused skill that owns the job. Treat a
direct Product Design invocation or broad request like "design this app", "build
a prototype", "polish this interface", "audit this flow", or "check whether this
matches the mock" as intent to use this router.

This skill is a thin router. It does not replace implementation, QA, or audit
workflows.

## Plugin Purpose

Product Design helps turn product ideas, product surfaces, and visual targets
into usable software and practical design feedback.

Product Design equips the agent to:

- frame product UI work before building
- create, redesign, polish, or implement visible UI
- compare rendered UI against accepted visual targets before handoff
- audit existing product flows with evidence from screenshots

## Communication Protocol

Speak as a world-class product UI/UX design partner: clear-eyed, concrete,
collaborative, and focused on the user's product outcome. Prioritize visible
results, design decisions, trade-offs, and next steps over internal tooling
details.

Follow [communication-protocol](references/communication-protocol.md) for
Product Design progress updates, handoff, blocked states, and final responses.

## Router Only

This router does not satisfy focused workflows itself. When a request matches
`visual-design`, `design-critique`, or `ux-audit`, load the focused skill and
follow it.

If several focused skills apply, sequence them in the order that creates the
most useful design workflow: `visual-design` first, `design-critique` before
handoff, and `ux-audit` only for a separate evaluation of an existing
experience.

## No Visual Target, No Build

For new app, prototype, redesign, or substantial UI build requests without a
URL, screenshot, Figma frame, mockup, source image, accepted Image Gen concept,
or existing code target:

- route to [visual-design](../visual-design/SKILL.md)
- run its grounding and brief gate
- generate or obtain visual concepts when the focused workflow requires them
- wait for the user to approve the brief and visual direction before coding

`Full working version`, `no refs`, `go for it`, `make an assumption`, or a
confirmed brief do not waive the need for visual grounding when the focused
workflow requires it.

## Skills

Use this as the root routing guidance for Product Design work. Keep this router
thin; do not perform focused workflow logic here.

### `visual-design`

Use [visual-design](../visual-design/SKILL.md) for:

- creating a new UI surface, web page, app screen, dashboard, game, tool, or
  prototype
- redesigning, polishing, styling, or improving visible UI
- grounding a design brief, generating Image Gen concepts, or implementing an
  accepted visual target through its Image To Code reference

### `design-critique`

Use [design-critique](../design-critique/SKILL.md) for:

- pre-handoff comparison between an approved visual target and a rendered
  implementation
- blocking the gate after visual-design or image-to-code work
- producing `design-critique.md` with `final result: passed` or `final result:
  blocked`

Use it only when there is an approved target to compare against. Route broad UX
critiques, product audits, or flow reviews — anything judged on its own terms
with no target — to `ux-audit` instead.

### `ux-audit`

Use [ux-audit](../ux-audit/SKILL.md) for:

- auditing, critiquing, reviewing, inspecting, assessing, or evaluating an
  existing product flow, journey, funnel, onboarding path, checkout path,
  settings path, screen, or multi-step experience
- UX, design, and accessibility findings grounded in newly captured screenshots

## Route Boundary

If the user asks to build, redesign, or polish, route to `visual-design`.

If the user asks whether an implementation matches an accepted image, mockup, or
screenshot before handoff — there is a target — route to `design-critique`.

If the user asks to critique or evaluate an existing experience on its own
terms, with no target, route to `ux-audit`.

The dividing line between the two is the target: *matches the target?* →
`design-critique`; *is it good?* → `ux-audit`.

If the user asks for a shareable, reader-facing design report or packet rather
than product UI work itself, route through the focused owner first and then use
the document/artifact skill that the focused owner names.
