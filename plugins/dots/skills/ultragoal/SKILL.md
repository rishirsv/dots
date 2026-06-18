---
name: ultragoal
description: "Use when the user asks to design, critique, set, start, activate, run, or manage a durable Codex goal for a persistent or long-running objective with verifiers, durable state, approval gates, completion proof, or parent/child goal decomposition; not for ordinary one-turn tasks, casual planning, or goals with no observable verifier."
---

# Ultragoal

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

Recommend Goal mode only when most are true:

- Progress needs repeated attempts, waiting, recovery, or long feedback cycles.
- Success can be measured by a test, benchmark, workflow, artifact inspection,
  screenshot, readback, or other external signal.
- Codex can respond to the next failure without another preference decision.
- Completion evidence is stronger than Codex saying "done."

Prefer an ordinary task or plan when the work is one-shot, taste-dependent,
blocked on repeated human choices, lacks a credible verifier, or risks
unbounded external action.

### 4. Define The Loop

Specify:

- **Outcome:** one ambitious, observable result.
- **Baseline:** current state, exact failure, or starting metric.
- **Primary verifier:** the strongest independent check of success on the
  surface where the outcome actually matters.
- **Supporting checks:** regression, quality, safety, or durability checks.
- **Iteration loop:** inspect, change one meaningful thing, run verifier, record
  evidence, choose next action.
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

### 5. Verify On The Real Surface

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

### 6. Keep State Durable

Keep the active goal objective short and put durable operating state under the
current workspace or project root:

- `.codex/<request>/goal.md`: stable finish line, baseline, constraints,
  non-goals, primary verifier, completion proof, blocker criteria, and link to
  the companion plan.
- `.codex/<request>/plan.md`: living route, ordered phases, implementation
  checklists, phase-level testing criteria, evidence, status, and next action.

Derive `<request>` once as a short kebab-case slug. Reuse that directory when
resuming or steering the same goal.

Structure each phase in `plan.md` like this:

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
and resulting plan changes without erasing useful evidence.

### 7. Delegate Carefully

When subagents are authorized, the parent keeps scope, integration, conflict
resolution, and final completion. Delegate only separable lanes: environment
discovery, source research, alternative approaches, or independent
verification.

For each lane, name objective, non-goals, ownership boundary, verifier, stop
condition, and returned evidence. Use child goals only when the user explicitly
asked for goal-backed subagents.

### 8. Activate Last

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
update the durable state files and then call `create_goal`. This call is the
final action of activation; do not call it early, and do not merely say a goal
should be set.

Use a compact objective:

```text
Complete and verify the objective in <workspace>/.codex/<request>/goal.md by
executing and maintaining <workspace>/.codex/<request>/plan.md. Read and
maintain both files throughout the work.
```

After `create_goal`, report the exact active objective and continue from the
created goal.

## Goal Packet

Return:

1. **Fit:** use Goal mode or a better alternative, with one-sentence rationale.
2. **Grounding:** current state, assumptions, and evidence gaps.
3. **Goal brief:** outcome, baseline, constraints, non-goals, verifier,
   verification surface and capabilities, loop, review pressure, blocker
   standard, and completion proof.
4. **Durable artifacts:** request slug, absolute paths, and proposed contents
   for `.codex/<request>/goal.md` and `.codex/<request>/plan.md`; write them
   before activation, but only when activation or durable artifacts were
   requested.
5. **Delegation map:** parent ownership and child lanes, only when useful and
   authorized.
6. **Exact objective:** concise text suitable for goal activation.
7. **Activation state:** `drafted`, `active`, or `not recommended`.

If activated, include the exact active objective. If not, say no goal was
created.

## Active Goal Discipline

When operating an active goal:

- inspect the active goal plus `.codex/<request>/goal.md` and
  `.codex/<request>/plan.md` when resuming;
- update `plan.md` after user steering or material new evidence before
  continuing;
- update `goal.md` when outcome, constraints, verifier, completion proof, or
  blocker criteria change;
- keep phase statuses, checklists, evidence, and next action current;
- continue while a safe, relevant next step remains;
- run the primary verifier on the declared surface after material changes;
- mark phases complete only after implementation and verification exit criteria
  pass;
- mark the goal complete only when the objective and completion proof are both
  satisfied, every required plan phase is complete, and no required work
  remains;
- mark blocked only when the same true external blocking condition persists and
  meaningful progress is impossible.

## Final Check

Before handoff or activation, confirm:

- the goal has an observable finish line;
- the primary verifier can fail;
- approval gates are explicit;
- durable state is written or intentionally left as a draft packet;
- `create_goal` was called only after grounding and red-team review;
- completion will be proven with external evidence, not a claim.
