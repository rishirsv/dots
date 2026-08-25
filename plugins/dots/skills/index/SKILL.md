---
name: index
description: "Routes Dots plugin requests to the right focused skill, shared playbook, or reference. Use when Dots is named or tagged, a development request spans several phases, or the user asks how to use Dots."
---

# Dots Index

Dots is an opinionated set of workflows for understanding, changing, reviewing,
and shipping software. Treat this index as the plugin-level instructions: keep
routing and shared playbooks here, and let each focused skill own its method.

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

- Use the Feature Dev playbook below for a feature, bug fix, refactor,
  or other material software change.
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

### Feature Dev

Use this playbook for building or materially changing software, including new
features, bug fixes, refactors, and behavior-changing configuration. Keep one
compact working record in the active task with the outcome, non-goals, settled
decisions, responsible code, chosen direction, and proof status.

1. **Discover.** Read the request and repository instructions. Identify the
   intended result, what must stay true, and what would prove completion.
2. **Explore.** Trace the current path, owners, state, side effects, analogous
   patterns, tests, and real verification surface. Use read-only investigators
   only when distinct evidence lanes make the work faster or broader.
3. **Settle decisions.** Answer repository-owned questions from source. Ask the
   user only for product choices, preferences, authority, or information that a
   focused probe cannot establish.
4. **Choose the design.** Select the smallest coherent approach that fits the
   existing system. Use focused skills such as `$design`, `$plan`, or
   `$orchestrate` when their full method is needed, then return here.
5. **Implement.** Build the complete authorized change in checkable units.
   Verify each meaningful unit before depending on it.
6. **Prove it.** Run focused repository checks and exercise the real product
   path when one exists. A build or unit test does not by itself prove an
   integration or visible behavior.
7. **Review and finish.** Apply `$review-change`, repair retained in-scope
   findings, rerun affected checks, inspect the final diff, and summarize the
   result, proof, intentional exclusions, and remaining risk.

Scale review to the change:

- **Low:** one localized, reversible change with a narrow proof surface and no
  material security, data, migration, permission, concurrency, or public-contract
  risk. One reviewer applies all core lenses.
- **Default:** normal multi-file product work or a change whose blast radius is
  not obviously narrow. Independent Correctness, Simplicity, and Systems lanes
  inspect the complete change.
- **Deep:** security-sensitive, data-changing, migration-heavy, cross-system,
  concurrency-sensitive, difficult-to-reverse, or otherwise high-blast-radius
  work. Add relevant specialists, independent verification, and a gap sweep.
- **Challenge:** use only when the user explicitly asks for adversarial review.

The playbook is complete when the requested behavior works through its real
path, proof supports the result, review is complete at the selected depth, and
every material gap is stated honestly.

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
