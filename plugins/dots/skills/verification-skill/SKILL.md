---
name: verification-skill
description: "Use only when the user selects `$verification-skill` to create, audit, update, or repair a project-local verification skill that drives and observes the real app; not for ordinary one-off testing or product repair."
---

# Verification Skill

Create, audit, or update the project-local skill that teaches a future agent
how to exercise the real product surface and prove behavior. Ground every
instruction in the current repository and a live run. A verification skill
that has not been executed successfully is a draft.

## Choose the route

- **Create** when the user asks to create a verification or control skill.
- **Audit** when the user asks to audit or assess an existing verification
  skill or feature map. Audit does not edit product source or the target skill,
  but it still performs the live drives needed to assess them.
- **Update** when the user asks to maintain, update, refresh, or repair an
  existing verification skill or feature map.
- When the user invokes this skill without naming a route, create if no target
  exists and audit the sole target when one exists. Ask which target only when
  several plausible verification skills exist.

Use the repository's established project-local skill location and naming
conventions. If none exist, choose a portable project-local Agent Skills
location allowed by repository instructions and name the skill
`verify-<app>`. Do not hard-code one host's private skill directory into a
portable workflow.

Read [verification contract](references/verification-contract.md) before
creating, auditing, or updating the target. Read
[surface strategies](references/surface-strategies.md) only for the product
surfaces present in the repository.

## Establish the real surface

Inspect the repository before asking the user. Determine:

- what users actually touch: web UI, CLI or TUI, desktop or mobile app, API,
  library, or several coordinated surfaces;
- the repository's authoritative local launch command and observable ready
  signal;
- the strongest existing way to drive the product programmatically;
- the visible state and side effects that constitute proof; and
- whether runs can use isolated ports, profiles, accounts, devices, and data.

Prefer an existing supported harness over a new wrapper. Ask only for facts the
repository and environment cannot reveal. If the product cannot currently
build, launch, or reach a known-good state, report the baseline failure and stop
unless the user separately authorized product repair. Do not encode broken
steps as the verification contract.

## Create

1. Write the project-local verification skill against the contract. Use exact
   commands, ready signals, stable handles, ownership checks, evidence paths,
   and teardown procedures from this repository. Leave no placeholders.
2. Seed the smallest useful feature map with the highest-value flows current
   source, routes, commands, menus, or product documentation can demonstrate.
   For each selected flow, record every meaningful user entry point; do not
   treat one convenient path as proof of the others. Report important uncovered
   flows for a later expansion rather than implying the initial map is complete.
3. Run the generated instructions end to end: launch, doctor, drive one mapped
   feature through a real user path, capture the action and resulting state,
   verify its material side effects, and clean up.
4. After cleanup, confirm the evidence still exists at the promised location
   and nothing the run started remains alive. Correct the skill or harness and
   repeat the failed portion until the proof succeeds or a concrete blocker is
   established.

Creation is complete only when the generated skill and feature map contain no
placeholders and one mapped feature has surviving end-to-end proof.

## Audit or update

Keep product source read-only. Audit keeps the target verification skill
read-only. Update may edit only that skill's own directory: its instructions,
feature map, and owned harness helpers.

1. **Reconcile the index.** Compare the feature-map index with its feature
   files. Identify missing, duplicate, dead, or unindexed entries. Correct them
   only in Update.
2. **Trace every feature from source.** For each recipe, locate the current user
   entry points, runtime path, stable drive handles, prerequisites, and
   observable outcome. Flag likely documentation or harness drift with source
   citations. Sweep recent user-facing churn for demonstrable features missing
   from the map.
3. **Plan the live pass.** Merge compatible recipes into as few known-good app
   states as practical. Use one owned long-lived instance for a stateful UI or
   service when safe; use a fresh isolated session for each short-lived CLI or
   TUI drive.
4. **Drive every mapped feature.** Run Doctor before the first drive and after
   any surprising failure or state. Capture evidence before cleanup, verify it
   at its actual path, and remove run-owned processes and scratch state after
   their usefulness ends. Never drive an instance whose identity and ownership
   have not been confirmed.
5. **Triage observed differences.** In Audit, report inaccurate feature
   descriptions and broken helpers without editing them. In Update, fix them
   inside the skill and re-run every changed recipe. Report broken product
   behavior as a product regression; do not make the map agree by documenting
   the regression as intended behavior.

Finish Audit or Update with exactly one outcome:

- **clean:** every mapped feature received source and live coverage; no skill
  correction remains;
- **drift:** Audit found a concrete skill or harness correction to make;
- **changed:** Update completed every correction with source support and a
  successful live re-drive;
- **blocked:** coverage or safe correction could not finish, with the exact
  prerequisite, route attempted, and surviving evidence.

Do not create a branch, commit, pull request, or schedule unless the user asks.
Use `$pr` when the user wants proven source changes published.

## Report

Name the route, target skill, product surfaces, features covered, evidence
locations, cleanup result, and final outcome. For Create, identify the feature
used for the end-to-end proof. For Audit or Update, separate skill drift,
harness drift, product regressions, and unreachable features.
