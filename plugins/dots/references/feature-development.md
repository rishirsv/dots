# Feature Development

Use this playbook only when the user explicitly selects Dots, `$index`, or
Dots Feature Development for software planning or implementation. An ordinary
feature, bug-fix, refactor, or planning request does not select this workflow;
handle it directly with any applicable focused skills.

Once selected, use this playbook for features, bug fixes, refactors, measured
performance work, and configuration changes that affect behavior. Keep one compact working record in the active task with the
outcome, non-goals, settled decisions, responsible code, chosen direction,
current route, and proof status.

## Choose the route

- **Feature:** add or change behavior. Define the data or state and the
  component responsible for it before distributing logic across callers.
- **Bug fix:** reproduce the reported symptom where it occurs before
  changing code. Form competing hypotheses, run checks that distinguish them,
  and confirm the cause supported by those checks. The original reproduction must pass
  after the fix.
- **Refactor:** record the behavior that must remain stable, name the target
  ownership or structure, migrate every caller, and remove the replaced path in
  the same change unless the repository requires a staged rollout.
- **Performance:** freeze a representative input and baseline, locate the
  measured cause with a trace or profile, and compare the same measurement
  after each candidate change. Keep measured improvements that preserve the required behavior. Remove
  experiments that do not improve the target or violate those requirements.

If no route fits, use the common workflow below. State what evidence will
show that the requested task succeeded. Do not add a permanent playbook for
one unusual task.

## Follow the common workflow

1. **Discover.** Read the request and repository instructions. Identify the
   intended result, what must stay true, and what would prove completion.
2. **Explore.** Trace the current path, owners, state, side effects, analogous
   patterns, tests, and the place where behavior can be verified. Verify facts that determine
   ownership, interfaces, constraints, sequencing, or proof. Leave ordinary
   local discovery to implementation. Use read-only investigators only when
   separate investigations would make the work faster or cover more relevant evidence.
3. **Settle decisions.** Answer repository-owned questions from source. Use a
   focused probe when observation can resolve a consequential uncertainty;
   apply `$prototype` when an isolated experiment is needed. Make reasonable
   assumptions for routine choices within the requested scope. Ask the user
   for product choices, preferences, authority, or information that would
   materially change the result, and continue work independent of the answer.
4. **Choose the design.** Select the smallest coherent approach that fits the
   existing system. Apply `$architect` when a consequential new or changed
   boundary needs its caller experience, public contract, data or state shape,
   responsible module, or place to test behavior settled before implementation.
   Use Architect for the design phases only, then return here for implementation,
   proof, review, and completion.
   Apply `$ui-design` when visible product UI needs design guidance, then return
   here.
5. **Implement.** Build the complete authorized change in checkable units.
   Verify each meaningful unit before depending on it. A unit with a clear scope,
   defined behavior, source locations, and an executable check may go to a
   cheaper worker; the coordinator retains design decisions, integration,
   review, and final proof. Return to step 4 when repeated implementation problems show that the
   selected module boundary or data shape is wrong.
6. **Prove it.** Run focused repository checks and exercise the real product
   path when one exists. A build or unit test does not by itself prove an
   integration or visible behavior. Bugs use the original reproduction;
   refactors compare behavior with the recorded baseline; performance work
   repeats the same measurement on the fixed input.
7. **Review and finish.** Inspect the final diff against the requested outcome.
   Apply `$change-review` when the user requests a review, repository
   policy requires it, or consequential behavior needs independent challenge.
   Give the reviewer the task's diff and intended behavior. During implementation,
   repair supported defects caused by the change within the authorized scope.
   Rerun affected checks and finish the requested work.
   Follow `$change-review` for its review and repair mode; preserve an
   explicit review-only request. Report the result, evidence, and important
   remaining gaps. Apply
   [Evidence in claims](technical-writing-guidance.md#evidence-in-claims)
   when writing the completion report.

## Stop at a planning handoff when requested

When the user asks only for a plan, stop after step 4. Do not edit product
source. Return a brief that another capable agent can use without guessing the
outcome, responsible code, order of work, or verification. Include:

- the selected outcome and explicit exclusions;
- confirmed current behavior and responsible code;
- the chosen approach and the decisions it depends on;
- units of work that each deliver verifiable behavior, when dependencies or
  separate agent contexts require the work to be divided;
- the source locations each unit should inspect;
- the behavior or scenario that proves each unit; and
- rollback instructions, conditions for a safe release, unresolved blockers,
  and weak assumptions when they affect implementation.

If the user requests an HTML plan, finish the planning decisions here, then
apply `$html` to the verified material and reading order. Start the HTML plan
with a visual explanation of its sequence, dependencies, or decisions. Keep
the full steps and verification details after that explanation. Do not make a durable artifact for a localized change
whose handoff fits clearly in chat.

`$change-review` owns review scope, subagent strategy, findings, and the
optional repair path. Do not recreate that procedure here.

The playbook is complete when the requested behavior works through its real
path, proof supports the result, the final diff has been inspected and any
required review is complete, and
every material gap is stated honestly.

For planning-only work, it is complete when the execution handoff is grounded
in current source, every decision needed for implementation is settled or listed as a blocker,
and the verification checks the requested behavior rather than an unrelated
passing result.
