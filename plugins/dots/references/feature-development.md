# Feature Development

Use this playbook to plan or make a material software change. It owns features,
bug fixes, refactors, measured performance work, and behavior-changing
configuration. Keep one compact working record in the active task with the
outcome, non-goals, settled decisions, responsible code, chosen direction,
current route, and proof status.

## Choose the route

- **Feature:** add or change behavior. Name the data or state shape that owns
  the behavior before distributing logic across callers.
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
   existing system. Apply `$architect` when a consequential new or changed
   boundary needs its caller experience, public contract, data or state shape,
   responsible module, or verification seam settled before implementation.
   Use Architect for the design phases only, then return here for implementation,
   proof, review, and completion.
   Apply `$design` when visible product UI needs its full workflow, then return
   here.
5. **Implement.** Build the complete authorized change in checkable units.
   Verify each meaningful unit before depending on it. A bounded unit with
   settled behavior, source anchors, and an executable check may go to a
   cheaper worker; the coordinator retains design decisions, integration,
   review, and final proof. Reopen step 4 when repeated implementation friction
   shows that the selected boundary or data shape is wrong.
6. **Prove it.** Run focused repository checks and exercise the real product
   path when one exists. A build or unit test does not by itself prove an
   integration or visible behavior. Bugs use the original reproduction;
   refactors compare the pinned behavior; performance work repeats the frozen
   measurement.
7. **Review and finish.** Apply `$code-quality-review` and report its result. If
   the user explicitly asked to address review findings, repair the complete
   retained set sequentially, rerun affected checks, and inspect the final diff.
   Summarize the result, proof, intentional exclusions, and remaining risk.

## Stop at a planning handoff when requested

When the user asks only for a plan, stop after step 4. Do not edit product
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

`$code-quality-review` owns review scope, subagent strategy, findings, and the
optional repair path. Do not recreate that procedure here.

The playbook is complete when the requested behavior works through its real
path, proof supports the result, review is complete at the selected depth, and
every material gap is stated honestly.

For planning-only work, it is complete when the execution handoff is grounded
in current source, every load-bearing decision is settled or named as a
blocker, and its proof is specific enough to distinguish success from a green
proxy.
