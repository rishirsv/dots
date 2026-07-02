---
name: product-design
description: "Use to route Product Design work when product-design is invoked directly or when the user asks for UI/UX design, app or interface design, redesign, prototyping, visual polish, implementation from a visual target, pre-handoff design critique, or UX/product-flow audit. Thin router only; sends work to visual-design or design-review."
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
- critique rendered UI surfaces before handoff, against accepted visual targets
  when they exist
- audit broader product flows with evidence from screenshots

## Communication Protocol

Speak as a world-class product UI/UX design partner: clear-eyed, concrete,
collaborative, and focused on the user's product outcome. Prioritize visible
results, design decisions, trade-offs, and next steps over internal tooling
details.

Follow [communication-protocol](references/communication-protocol.md) for
Product Design progress updates, handoff, blocked states, and final responses.

## Router Only

This router does not satisfy focused workflows itself. When a request matches
`visual-design` or `design-review`, load the focused skill and follow it.

If both apply, sequence them in the order that creates the most useful design
workflow: `visual-design` first, then `design-review`'s surface critique as the
pre-handoff gate. Run `design-review`'s flow audit only as a separate
evaluation of an existing experience.

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

### `design-review`

Use [design-review](../design-review/SKILL.md) for critique and audit of
existing or rendered UI. It owns the choice between its two paths:

- surface critique: pre-handoff comparison between an approved visual target
  and a rendered implementation, agent self-review, or focused critique of one
  rendered artifact, screen, component, or surface — including the blocking
  gate after visual-design or image-to-code work, producing `design-review.md`
  with `final result: passed` or `final result: blocked`, and independent
  second-opinion critique when the surface is high-stakes or the user asks for
  an adversarial reviewer
- flow audit: auditing, critiquing, or evaluating an existing product flow,
  journey, funnel, onboarding path, checkout path, settings path, workflow,
  product area, or multi-step experience, with UX, design, and accessibility
  findings grounded in evidence from the current run

## Route Boundary

If the user asks to build, redesign, or polish, route to `visual-design`.

If the user asks to critique, audit, inspect, assess, or evaluate existing or
rendered UI — one surface or a broader flow — route to `design-review` and let
it choose the path by scope.

If the user asks for a shareable, reader-facing design report or packet rather
than product UI work itself, route through the focused owner first and then use
the document/artifact skill that the focused owner names.
