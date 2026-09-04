---
name: index
description: "Route broad or multi-stage Dots work to the smallest applicable skill, shared reference, or Feature Development workflow. Use when Dots is invoked directly, when planning or implementing a material code change, or when several Dots workflows may apply. Focused requests use their owning skill."
---

# Dots Index

Route the request to the smallest Dots workflow that owns it. The index chooses
and loads owners; it does not repeat or replace their instructions.

## Route only

- When one focused skill clearly matches, load it and follow it directly.
- When several skills apply, choose one primary owner and add only the
  supporting skills needed for distinct parts of the work.
- Read each selected skill or reference before acting on it. Preserve its
  authorization, output, validation, and completion rules.
- Do not turn the skill map into a checklist. Skip routes that do not change
  the work.

## Develop software

For a material feature, bug fix, refactor, measured performance change,
behavior-changing configuration, or implementation plan, read and follow
[Feature Development](../../references/feature-development.md) as the primary
workflow. It routes into focused skills as its phases require.

Use `$architect` before implementation when a consequential new or changed
boundary needs its caller experience, types, ownership, state model, or module
shape settled. Use `$design` for visible product UI and `$prototype` for a
choice best settled by observation. Let Feature Development decide whether a
`$code-quality-review` is warranted before completion and whether its retained
in-scope findings are repaired under existing authorization.

## Choose the focused owner

| Request | Owner |
| --- | --- |
| Forward architecture for a new or changed boundary | `$architect` |
| Structural audit or refactor candidates in existing code | `$architecture-review` |
| Completed code change before merge | `$code-quality-review` |
| Create or improve visible product UI | `$design` |
| Independent UI critique or ship assessment | `$design-review` |
| Resolve one uncertain choice through a throwaway build | `$prototype` |
| Explain how code or a subsystem works | `$how` |
| Investigate why code or a decision exists | `$why` |
| Write or revise durable repository documentation | `$docs-writer` |
| Create a self-contained HTML artifact | `$html` |
| Coordinate useful parallel or delegated work | `$orchestrate` |
| Publish finished work as a pull request | `$pr` |
| Keep a pull request moving | `$babysit-pr` |
| Prepare work for another agent, task, or phase | `$handoff` |
| Create, update, or review a Dots skill | `$skill-standards` |

The user-controlled modes `$clarify`, `$scout`, `$explain`, `$oracle`,
`$recall`, and `$self-improve` remain explicit. Load them only when the user
selects that mode. Their descriptions define the exact boundary.

## Load shared references by need

- Read [Feature Development](../../references/feature-development.md) for the
  material software-change routes named above.
- Read [Hard-Cut Policy](../../references/hard-cut-policy.md) when replacing a
  schema, contract, persisted shape, route, configuration, value set, or
  architecture, unless the selected skill already loads it.
- Read [Duplicate Ownership](../../references/duplicate-ownership.md) when a
  change creates or removes copied policy, competing sources of truth, or
  normalization in several layers, unless the selected skill already loads it.
- Route technical writing, visual explanation, visual proof, session history,
  writing style, and skill practices through their owning focused skills rather
  than loading those references independently.

## Finish

The selected owner finishes the work and produces the result. The index is done
when the request has one clear primary owner, every supporting route has a
distinct job, and the owners' completion conditions have been applied.
