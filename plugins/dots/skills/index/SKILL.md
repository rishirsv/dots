---
name: index
description: "Routes Dots requests to the right focused skill, Feature Dev playbook, or shared reference. Use when Dots is named, the user asks how to use it, or a software request spans multiple Dots workflows."
---

# Dots Index

Dots is an opinionated set of workflows for understanding, changing, reviewing,
and shipping software. Treat this index as the plugin-level instructions: keep
routing and playbook entry points here, and let focused skills and references
own their methods.

## Skill routing

Choose the skill from the outcome the user wants. Use one primary owner at a
time. When a request has distinct outcomes, sequence the skills and carry the
settled decisions and evidence across the handoff.

### Shape the work

- `$clarify` resolves the few missing requirements that would change the work.
- `$scout` helps the user shape or challenge a fuzzy idea before planning.
- `$plan` inspects the repository and produces an implementation-ready plan.

### Understand and explain

- `$explain` gives a quick plain-language or ELI5 answer.
- `$how` traces how code, a subsystem, a diff, or a pull request works.
- `$why` investigates historical evidence and design rationale.
- `$teach` combines how and why into a paced explanation of a body of work.

When the user requests an HTML explanation, plan, review, or walkthrough, use
the skill that owns the content first, then use `$html` to render the prepared
material. Use `$html` as the primary skill only when the job itself is to create
or edit a standalone HTML page, fragment, or throwaway product mock.

### Build and document

- `$design` owns visible product UI from direction through implementation and
  visual proof.
- `$docs-writer` owns durable repository documentation.
- `$html` owns browser-openable HTML and static product mocks.
- `$verification-skill` creates or maintains a project-local skill that drives
  the real product and captures proof.

### Review and advise

- `$review-change` reviews a completed diff and scales its depth to the change.
- `$architecture-review` finds structural refactor and ownership candidates.
- `$design-review` independently audits an existing product surface or flow.
- `$oracle` asks another model for focused advice when the user selects it.

### Develop skills

- `$skill-standards` creates, updates, or statically reviews skill source.
- `$skill-evaluator` runs behavioral trials of a skill with fresh workers.

### Continue, coordinate, and ship

- `$recall` reconstructs recent working context from task history.
- `$handoff` writes a continuation brief for another task or phase.
- `$self-improve` mines repeated workflow friction for durable improvements.
- `$orchestrate` coordinates a small team when parallel work adds real value.
- `$pr` commits, pushes, and opens or updates a review-ready pull request.
- `$babysit-pr` monitors a pull request and handles checks and review feedback.

For a routing question, name the selected skill or playbook and explain its
boundary in one sentence. For a catalog question, show only the groups relevant
to the user's work unless they ask for the full index.

## Playbooks

- **Feature Dev:** for a feature, bug fix, refactor, or other material software
  change, read and follow [Feature Development](../../references/feature-development.md).

## References

Read shared references only when their condition applies:

- [Writing style](../../references/writing-style.md) for reader-facing prose.
- [Visual proof](../../references/visual-proof.md) when appearance, interaction,
  or rendered output is part of the claim.
- [Hard-cut policy](../../references/hard-cut-policy.md) when replacing a
  schema, contract, route, configuration, value set, or architecture.
- [Duplicate ownership](../../references/duplicate-ownership.md) when the same
  rule or state appears to have more than one owner.
- [Skill practices](../../references/skill-practices.md) when creating,
  updating, reviewing, or evaluating agent skills.
