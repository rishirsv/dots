---
name: ultra-goal
description: "Designs and runs durable Codex goals for long-running objectives that need persistence, recovery, verifiers, approval gates, and completion proof. Explicit-only skill invoked via ultra-goal or a request to set, start, activate, or manage a goal; not for one-off tasks or ordinary planning, which belong to ultra-plan."
---

# Ultra-Goal

Design and run durable Codex goals for objectives that need persistence,
recovery, iteration, and proof. A good goal has an observable finish line, a
verifier that can fail, and enough durable state for Codex to recover after
interruptions.

Do not activate a goal from vague planning language. Activate only when the user
explicitly asks to start, set, activate, create, or run a goal. Never set a
token budget unless the user explicitly requests one.

## Modes

- **Design:** research and return a goal packet. Do not call `create_goal`.
- **Critique:** inspect an existing goal or draft and tighten it.
- **Activate:** design and critique the goal, then call `create_goal` as the
  final activation step.
- **Goal tree:** only when the user explicitly authorizes goal-backed
  subagents. Give each child one bounded objective and verifier.

When the user explicitly invokes this skill for a concrete work objective and
asks Codex to build, complete, run, pursue, or "do it", treat the request as
Activate by default. Stay in Design only when the user asks to draft, discuss,
or critique a goal without starting it.

## Workflow

### 1. Ground The Outcome

Find the intended result, audience, destination, constraints, and why
persistence helps. Inspect named files, repos, threads, artifacts, and live
systems before drafting.

Ask only when the missing answer changes the finish line, grants consequential
approval, or chooses between incompatible goals. Otherwise state the assumption
and continue.

### 2. Research Enough

Gather the smallest useful evidence set:

1. Read the canonical local source and applicable instructions.
2. Inspect the current baseline, existing attempts, tests, benchmarks,
   reproductions, or acceptance criteria.
3. Inventory the capabilities needed to exercise the real outcome, including
   terminal access, Browser, authenticated Chrome, Computer Use, local apps,
   devices, accounts, permissions, and test environments.
4. Refresh volatile facts from primary or live sources when they determine the
   goal.
5. Stop when the finish line and verification path are supported. Do not turn
   goal design into open-ended research.

Separate observed facts, user requirements, and inferred choices.

### 3. Check Goal Fit

Recommend a durable goal only when most are true:

- Progress needs repeated attempts, waiting, recovery, or long feedback cycles.
- Success can be measured by a test, benchmark, workflow, artifact inspection,
  screenshot, readback, or other external signal.
- Codex can respond to the next failure without another preference decision.
- Completion evidence is stronger than Codex saying "done."

Prefer an ordinary task or plan when the work is one-shot, taste-dependent,
blocked on repeated human choices, lacks a credible verifier, or risks
unbounded external action.

### 4. Apply The Quality Bar

Before activation, the goal must be strong enough to survive compaction,
recovery, and future continuation. The objective and durable state must answer:

- **Done state:** what concrete thing will be true when the goal is complete.
- **Evidence:** what command, artifact, screenshot, workflow, metric, or
  readback proves completion.
- **Threshold:** what binary or quantitative bar separates success from partial
  progress.
- **Scope bounds:** what files, systems, surfaces, behaviors, or decisions are
  in and out.
- **Stop condition:** when Codex should stop and ask instead of continuing.
- **Current goal state:** `get_goal` has been checked so Codex does not create a
  duplicate or conflicting goal.

Reject or rewrite goals like "make progress," "improve X," "keep
investigating," or "work on Y" unless they are sharpened into a verifiable end
state.

### 5. Define The Loop

For loop-shaped goals, read [loop-goals](references/loop-goals.md) and record
the selected loop pattern, iteration policy, wake-up gate, and stop conditions
in `progress.md`.

Specify:

- **Outcome:** one ambitious, observable result.
- **Baseline:** current state, exact failure, or starting metric.
- **Primary verifier:** the strongest independent check of success on the
  surface where the outcome actually matters.
- **Supporting checks:** regression, quality, safety, or durability checks.
- **Iteration loop:** inspect, change one meaningful thing, run verifier, record
  evidence, choose next action.
- **Wake-up gate:** deterministic signal, schedule, queue, event, or user
  steering that justifies another pass when waiting is part of the loop.
- **Cost posture:** attempt limit, tiered delegation, or wrap-up rule when the
  loop is spending time or tokens without new evidence.
- **Anti-cheating rules:** do not weaken tests, narrow scope, hide failures,
  swap in mocks, or change benchmarks without approval.
- **Approval gates:** irreversible, public, shared, or costly actions need
  separate user approval.
- **Blocker standard:** external blocker plus smallest next action; difficulty
  or uncertainty is not enough.
- **Completion proof:** exact commands, outputs, paths, screenshots, or
  readbacks required before `update_goal(status="complete")`.

The primary verifier must reliably distinguish success from failure and return
enough evidence to choose the next repair. Prefer the strongest feasible
verifier closest to the user's actual experience.

### 6. Verify On The Real Surface

Require Browser, authenticated Chrome, or Computer Use verification when success
depends on rendered UI, browser or app state, authentication, permissions,
native dialogs, files, clipboard, keyboard or pointer input, window focus,
notifications, media, accessibility, installation, restart behavior, OS
integration, or a multi-app workflow.

For real-surface verification, name:

- exact surface, build, URL, account type, machine or device, and starting
  state;
- reproducible workflow with observable pass and fail criteria;
- evidence to capture, such as screenshots, video, console or network output,
  logs, resulting files, or final state readback;
- clean-state, reload or restart, failure-recovery, and important negative-path
  checks proportional to risk;
- required capability and fallback owner if Codex cannot access the surface.

If the real-surface verifier is unavailable, do not silently replace it with a
weaker check. Name the gap and either choose a user-approved equivalent or
define a blocked handoff with the exact manual test and evidence required.

### 7. Keep State Durable

Keep the active goal objective short and put durable operating state under the
current workspace or project root:

- `.agents/goals/<request>/goal.md`: stable finish line, baseline, constraints,
  non-goals, primary verifier, completion proof, and blocker criteria.
- `.agents/goals/<request>/progress.md`: living route, ordered phases, implementation
  checklists, phase-level testing criteria, evidence, status, and next action.

Keep the split simple: `goal.md` is the stable contract; `progress.md` is the
mutable execution log. Do not duplicate content between them.

Codex goal state is thread-scoped. These files are recovery aids for that goal,
not global memory or project instructions.

Derive `<request>` once as a short kebab-case slug. Reuse that directory when
resuming or steering the same goal.

Structure each phase in `progress.md` like this:

```text
## Phase N: Observable milestone
Status: pending | in progress | blocked | complete

Implementation
- [ ] Concrete change or investigation

Verification
- [ ] Exact test, browser/computer-use workflow, or artifact inspection
- [ ] Observable pass criteria and required evidence

Exit criteria
- [ ] Conditions that must be true before the next phase starts
```

Keep at most one phase `in progress`. Check off work only after it is done, and
check off verification only after the declared test passes. Record failed checks
and resulting progress changes without erasing useful evidence.

Examples:

- Weak: "Improve performance." Stronger: reduce p95 below a named threshold on a
  named benchmark while keeping correctness tests green.
- Weak: "Write docs for this feature." Stronger: produce the docs page, build it
  locally, and verify referenced commands against current behavior.
- Research: produce an evidence-backed report that separates confirmed findings,
  approximate support, blocked claims, and remaining uncertainty.

### 8. Delegate Carefully

When subagents are authorized, the parent keeps scope, integration, conflict
resolution, and final completion. Delegate only separable lanes: environment
discovery, source research, alternative approaches, or independent
verification.

For each lane, name objective, non-goals, ownership boundary, verifier, stop
condition, and returned evidence. Use child goals only when the user explicitly
asked for goal-backed subagents.

### 9. Activate Last

Before activation, red-team the draft:

- Can success be faked by weakening the verifier?
- Could the words be satisfied while missing the user's real outcome?
- Are approval gates explicit?
- Does the loop say what to do after a failed attempt or wait?
- Is completion observable outside the running agent?
- If the outcome is interactive, does the goal exercise the correct surface?
- Are all required verification capabilities available, or does the goal name
  the exact blocked handoff instead of weakening the verifier?

If activation was requested, or the default activation rule applies, write or
update the durable state files, call `get_goal`, and then call `create_goal`
only when no active goal already covers the same objective. If an active goal
matches the user's intent, continue from that goal instead of creating a
duplicate. If an active goal conflicts with the new request, ask whether to
finish the current goal, mark it complete if already done, or start separate
goal-backed work. `create_goal` is the final action of activation; do not call it
early, and do not merely say a goal should be set.

Use a compact objective:

```text
Complete and verify the objective in <workspace>/.agents/goals/<request>/goal.md by
executing and maintaining <workspace>/.agents/goals/<request>/progress.md. Read and
maintain both files throughout the work.
```

After `create_goal`, report the exact active objective and continue from the
created goal.

## Goal Packet

Return:

1. **Fit:** durable goal recommended or better alternative, with one-sentence rationale.
2. **Grounding:** current state, assumptions, and evidence gaps.
3. **Goal brief:** outcome, baseline, constraints, non-goals, verifier,
   verification surface and capabilities, loop, review pressure, blocker
   standard, and completion proof.
4. **Durable artifacts:** request slug, absolute paths, and proposed contents
   for `.agents/goals/<request>/goal.md` and
   `.agents/goals/<request>/progress.md`. In Design, leave them as proposed
   contents unless durable artifacts were requested; in Activate, write or
   update them before calling `create_goal`.
5. **Delegation map:** parent ownership and child lanes, only when useful and
   authorized.
6. **Exact objective:** concise text suitable for goal activation.
7. **Activation state:** `drafted`, `active`, or `not recommended`.

If activated, include the exact active objective. If not, say no goal was
created.

## Active Goal Discipline

When operating an active goal:

- inspect the active goal plus `.agents/goals/<request>/goal.md` and
  `.agents/goals/<request>/progress.md` when resuming;
- update `progress.md` after user steering or material new evidence before
  continuing;
- update `goal.md` when outcome, constraints, verifier, completion proof, or
  blocker criteria change;
- keep phase statuses, checklists, evidence, and next action current;
- continue while a safe, relevant next step remains;
- run the primary verifier on the declared surface after material changes;
- mark phases complete only after implementation and verification exit criteria
  pass;
- before completion, audit each requirement against concrete evidence in
  `progress.md`;
- treat budget limits as wrap-up or blocker states, not completion;
- mark the goal complete only when the objective and completion proof are both
  satisfied, every required progress phase is complete, and no required work
  remains;
- mark blocked only when the same true external blocking condition persists and
  meaningful progress is impossible.

## Final Check

Before handoff, and before or after activation as applicable, confirm:

- the goal has an observable finish line;
- the primary verifier can fail;
- approval gates are explicit;
- durable state is written or intentionally left as a draft packet;
- if activated, `create_goal` was called only after grounding and red-team
  review;
- completion will be proven with external evidence, not a claim.
