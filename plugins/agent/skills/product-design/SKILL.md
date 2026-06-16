---
name: product-design
description: "Use as an explicit router for product design work when the user wants one entry point for creating or polishing UI, implementing a selected visual target, running pre-handoff design QA, or auditing an existing product flow; routes to visual-design, design-qa, or audit rather than duplicating their workflows."
---

# Product Design

Route product design work to the focused skill that owns the job. This skill is
a thin router; it does not replace the implementation, QA, or audit workflows.

## Routes

Use [visual-design](../visual-design/SKILL.md) for:

- creating a new UI surface, web page, app screen, dashboard, game, tool, or
  prototype
- redesigning, polishing, styling, or improving visible UI
- grounding a design brief, generating Image Gen concepts, or implementing an
  accepted visual target through its Image To Code reference

Use [design-qa](../design-qa/SKILL.md) for:

- pre-handoff comparison between a source visual target and a rendered
  implementation
- blocking QA after visual-design or image-to-code work
- producing `design-qa.md` with `final result: passed` or `final result:
  blocked`

Use [audit](../audit/SKILL.md) for:

- auditing, critiquing, reviewing, inspecting, assessing, or evaluating an
  existing product flow, journey, funnel, onboarding path, checkout path,
  settings path, screen, or multi-step experience
- UX, design, and accessibility findings grounded in newly captured screenshots

## Boundary

If the user asks to build, redesign, or polish, route to `visual-design`.

If the user asks whether an implementation matches an accepted image, mockup, or
screenshot before handoff, route to `design-qa`.

If the user asks to critique or evaluate an existing experience, route to
`audit`.

When several apply, sequence them in the product design lifecycle:
`visual-design` first, `design-qa` before handoff, and `audit` only for a
separate evaluation of an existing experience.
