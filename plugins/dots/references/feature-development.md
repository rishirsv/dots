# Feature Development

Use this playbook to plan or make a material software change. It owns features,
bug fixes, refactors, measured performance work, and behavior-changing
configuration. Keep one compact working record in the active task with the
outcome, non-goals, settled decisions, responsible code, chosen direction,
current route, and proof status.

## Choose the lightest path

Use direct implementation for localized work with a clear owner and focused
proof. Do not create a plan, invoke Architect, or require a fresh reviewer by
default.

Use this playbook when behavior, sequencing, ownership, or proof is materially
nontrivial. Read [Simplicity-First Development](simplicity-first-development.md)
for the feature frame, architecture admission gate, plan gate,
stop-and-report rule, and final subtraction pass.

## Choose the route

- **Feature:** define the user moment and accepted behavior, then identify the
  existing owner of the nearest durable rule. Add behavior there while it
  remains cohesive. Introduce a new owner only when the architecture admission
  gate passes.
- **Bug fix:** reproduce the reported symptom on the matching surface before
  changing code. Form competing hypotheses, run checks that distinguish them,
  and confirm the surviving mechanism. The original reproduction must pass
  after the fix.
- **Refactor:** record the behavior that must remain stable, name the target
  ownership or structure, migrate every caller, and remove the replaced path in
  the same change unless the repository requires a staged rollout.
- **Performance:** freeze a representative input and baseline, locate the
  measured cause with a trace or profile, and compare the same measurement
  after each candidate change. Keep demonstrated wins and remove experiments
  that did not improve the target without violating its guardrails.

If no route fits, use the common spine and state the task-specific evidence
that will distinguish success from motion. Do not add a permanent playbook for
one unusual task.

## Follow the common spine

1. **Discover.** Read the request and repository instructions. Identify the
   intended result, what must stay true, and what would prove completion.
2. **Explore.** Trace the current path, owners, state, side effects, analogous
   patterns, tests, and real verification surface. Verify facts that determine
   ownership, interfaces, constraints, sequencing, or proof. Leave ordinary
   local discovery to implementation. Use read-only investigators only when
   distinct evidence lanes make the work faster or broader.
3. **Settle decisions.** Answer repository-owned questions from source. Before
   asking the user about a choice that running or viewing something could
   settle, apply `$prototype`. Ask the user only for product choices,
   preferences, authority, or information a focused probe cannot establish.
4. **Choose the design.** Select the smallest coherent approach that fits the
   existing system. Apply `$architect` only when the shared architecture
   admission gate passes. Architect first produces an existing-owner candidate
   that adds no new boundary, then returns here for implementation, proof,
   review, and completion.
   Apply `$design` when visible product UI needs its full workflow, then return
   here.
5. **Gate a material plan.** Run one fresh read-only GAPS-and-EXCESS review.
   Inventory every new type, file, table, protocol, route, setting, cache, and
   long-lived state; name the current problem, existing owner considered, and
   code deleted. Do not proceed through a material unresolved finding. Skip
   this gate when no plan is warranted.
6. **Implement.** Build the complete authorized change in checkable units.
   Verify each meaningful unit before depending on it. A bounded unit with
   settled behavior, source anchors, and an executable check may go to a
   cheaper worker; the coordinator retains design decisions, integration,
   review, and final proof. Reopen step 4 when repeated implementation friction
   shows that the selected boundary or data shape is wrong.
7. **Prove it.** Run focused repository checks and exercise the real product
   path when one exists. A build or unit test does not by itself prove an
   integration or visible behavior. Bugs use the original reproduction;
   refactors compare the pinned behavior; performance work repeats the frozen
   measurement.
8. **Simplify, review, and finish.** After the behavior works, inspect the full
   diff only for state that can be derived, one-caller wrappers, abstractions
   without a current second responsibility, tests that mirror implementation,
   compatibility without a boundary, source-restating docs, and obsolete
   paths. Preserve the accepted behavior. Apply risk-proportional
   `$code-quality-review`, repair retained in-scope findings, rerun affected
   checks once, and summarize the result, proof, intentional exclusions, and
   remaining risk.

## Stop at a planning handoff when requested

When the user asks only for a plan, stop after step 5. Do not edit product
source. Return the smallest execution handoff that another capable agent can
use without guessing the outcome, ownership, sequencing, or proof. Include:

- the selected outcome and explicit exclusions;
- confirmed current behavior and responsible code;
- the chosen direction and its load-bearing decisions;
- vertical execution units only when the work spans meaningful dependencies or
  fresh contexts;
- the source anchors each unit should inspect, not a directory inventory;
- the behavior or scenario that proves each unit; and
- rollback, safe landing, unresolved blockers, and weak assumptions when they
  materially affect execution.

If a request asks for an HTML plan, finish the decisions here and pass the
verified material and reading order to `$html`. HTML changes the review surface,
not the planning method. Do not make a durable artifact for a localized change
whose handoff fits clearly in chat.

`$code-quality-review` owns review scope, subagent strategy, findings, repairs,
and final independent review. Do not recreate that procedure here.

The playbook is complete when the requested behavior works through its real
path, proof supports the result, review is complete at the selected depth, and
every material gap is stated honestly.

For planning-only work, it is complete when the execution handoff is grounded
in current source, every load-bearing decision is settled or named as a
blocker, and its proof is specific enough to distinguish success from a green
proxy.
