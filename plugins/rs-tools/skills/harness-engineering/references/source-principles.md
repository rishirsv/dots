# Harness Engineering Principles

This reference is self-contained. Use it as the conceptual model for a harness-engineering assessment.

## Core Narrative

Harness engineering is the discipline of designing a repository, development loop, and operating environment so agents can do reliable engineering work with minimal synchronous human supervision. The main work shifts from manually writing code to specifying intent, exposing context, building feedback loops, and encoding constraints that let agents execute.

The motivating extreme case is a product built under a strict constraint: humans did not hand-write code. Agents wrote application logic, tests, CI, docs, release tooling, observability, internal tools, review comments, and repo-management scripts. That constraint exposed the real bottleneck. The limiting resource was not code generation or token volume; it was human attention. When agents could not progress, the useful question was not "how do we prompt harder?" It was "what is missing from the harness that would let the agent succeed next time?"

Harness engineering treats every agent failure as a diagnostic signal. If the agent makes an architectural mistake, the architecture may not be legible or enforceable. If it misses a reliability concern, the non-functional requirement may live only in a human's head. If it cannot verify a UI fix, the runtime may not be observable to the agent. If it produces noisy or inconsistent code, the repo may lack constraints, examples, tests, or cleanup loops that narrow the acceptable solution space.

## The Scarce Resource Is Human Attention

Agents can run many tasks in parallel, iterate for hours, inspect files, call tools, and generate large amounts of code. Humans cannot review every token, watch every terminal, or manually QA every path. The harness should therefore reduce synchronous human attention by giving agents:

- Fast, deterministic ways to validate their own work.
- Agent-readable maps of the codebase and product domain.
- Tools that expose runtime state as text, structured data, screenshots, traces, logs, metrics, videos, or artifacts.
- Review loops that agents can consume and respond to.
- Clear escalation points for true judgment calls.
- Durable context that survives across runs.

The right human role is steering: choosing priorities, defining acceptance criteria, reviewing high-level outcomes, approving releases where needed, and encoding new judgment back into the repo. The wrong role is constant shoulder-surfing, copy/pasting context, hand-running hidden checks, or manually translating inaccessible tool output.

## From Copilot To Teammate

A weak agent setup treats the model as a code-completion tool. A strong harness treats the agent like a teammate with a workstation, map, task brief, test rig, review process, and access to relevant organizational knowledge.

The teammate framing changes what the repo must provide:

- A teammate needs onboarding. Agents need `AGENTS.md`, architecture docs, domain context, command maps, and examples.
- A teammate needs tools. Agents need CLIs, scripts, local boot paths, inspection tools, and automation surfaces.
- A teammate needs feedback. Agents need tests, lints, logs, metrics, screenshots, review comments, and acceptance criteria.
- A teammate needs boundaries. Agents need enforced dependency rules, data-shape validation, source-of-truth docs, and explicit ownership.
- A teammate needs culture. Agents need product principles, naming taste, user expectations, tone, humor where relevant, and what "good" means for the team.

## Agent Legibility

Agent legibility means important project truth is visible, searchable, executable, and interpretable by agents during a run. Information that exists only in chat, meetings, external documents, tribal memory, or inaccessible dashboards is effectively absent from the agent's working world.

Assess whether the repo makes these things legible:

- Product goals, user journeys, customers, pilot users, roadmap, and non-goals.
- Architecture boundaries, dependency direction, layering, ownership, and generated-vs-source files.
- Runtime state: UI behavior, API responses, logs, metrics, traces, dashboards, alerts, screenshots, videos, and data fixtures.
- Quality expectations: reliability, performance, accessibility, security, privacy, data continuity, migration safety, release readiness, and supportability.
- Workflow state: active plans, completed plans, tech debt, review comments, CI failures, release state, and stale docs.
- Organization context: team members, stakeholders, compliance requirements, internal names, business definitions, and cultural norms that affect implementation choices.

Agent legibility does not mean dumping everything into one file. It means creating a navigable system where the agent can start small and progressively discover the right deeper source of truth.

## Progressive Disclosure

A large instruction blob is usually a bad harness. It consumes context, blurs priority, rots quickly, and is hard to verify. Use a short entry point as a table of contents, then link to deeper artifacts.

Good progressive-disclosure shape:

- `AGENTS.md`: short map of how to work in the repo.
- `ARCHITECTURE.md`: current domain map, boundaries, package relationships, and allowed dependency directions.
- `docs/product/` or equivalent: product specs, core beliefs, user journeys, and domain language.
- `docs/exec-plans/`: active and completed implementation plans for complex work.
- `docs/generated/`: generated references such as schema docs, API maps, route maps, or command indexes.
- `docs/references/`: stable external or framework references that agents should load only when needed.
- `docs/quality/` or tracker files: quality/readiness status, tech debt, verification gaps, and known recurring issues.

The assessment should check whether the repo has this kind of discoverable knowledge system, whether it is current, and whether future agents are pointed to the right files at the right time.

## Non-Functional Requirements Must Be Encoded

Agents often violate requirements that humans consider obvious because those requirements are not encoded anywhere the agent can use. Harness engineering turns tacit taste into durable guidance or enforcement.

Examples of non-functional requirements to encode:

- Network calls need timeouts.
- Data shapes must be validated at boundaries.
- Logs must be structured and include correlation IDs.
- Generated files must not be hand-edited.
- UI changes need screenshots or videos.
- Migrations require rollback or compatibility proof.
- Accessibility paths must be tested.
- Tests must avoid sleeps or nondeterministic timing.
- Errors must include remediation guidance.
- Release branches require human-approved smoke evidence.

Encoding can happen at multiple strengths:

- Documentation: good for nuanced judgment and onboarding.
- Examples: good for style, patterns, and expected shape.
- Templates: good for repeated plans, reports, specs, and PR descriptions.
- Tests: good for behavior and regression boundaries.
- Lints/static checks: good for structural invariants.
- Runtime assertions: good for impossible states or boundary contracts.
- CI gates: good for repository-wide enforcement.
- Review agents: good for applying judgment consistently.
- Recurring cleanup agents: good for drift and quality ratchets.

Prefer the weakest mechanism that reliably shapes agent behavior. Promote repeated mistakes from docs to tests, lints, or scripts when prose is not enough.

## Mechanical Enforcement

Documentation alone does not keep agent-generated systems coherent. A strong harness enforces important boundaries mechanically while leaving local implementation freedom.

Common enforcement targets:

- Dependency direction between layers.
- Domain ownership and allowed cross-domain imports.
- Data parsing at ingress and egress.
- Schema/type naming conventions.
- Structured logging and telemetry requirements.
- File size or complexity thresholds.
- Platform-specific reliability rules.
- Test placement and fixture usage.
- No direct access to forbidden APIs or storage.
- Generated artifact boundaries.

Good enforcement includes remediation. Error messages should tell an agent what rule failed, why it matters, and what file or command explains the expected fix. A linter that says "bad import" is weaker than one that says "UI cannot import repository internals; route through the service interface described in ARCHITECTURE.md."

## Runtime Legibility

Agents cannot validate behavior they cannot observe. A harness-engineered repo exposes runtime state in ways agents can inspect and correlate.

Look for:

- One-command local boot or clearly documented setup.
- Isolated environments per branch, worktree, task, or test run when possible.
- Seeded data and fixtures for important user journeys.
- UI inspection through browser automation, simulator tools, accessibility trees, screenshots, videos, or DOM snapshots.
- API inspection through contract tests, request fixtures, and structured responses.
- Logs, metrics, and traces queryable from local or ephemeral stacks.
- Dashboards and alert definitions stored as code.
- Scripts that reproduce bugs and capture before/after proof.

The principle is not a specific observability stack. The principle is that an agent should be able to answer: what happened, where did it happen, why did it happen, and did my change fix it?

## Fast Inner Loops

Agent productivity depends heavily on loop speed. A slow build, slow test suite, or noisy validation command wastes tokens and human attention. A harness should maintain fast feedback loops and treat regressions in loop speed as harness failures.

Assess:

- Can the agent run a focused check in seconds or under a small fixed target?
- Is there a clear difference between fast local checks and slow comprehensive checks?
- Can expensive commands run in the background while the agent continues useful work?
- Does the repo have command wrappers that hide passing noise and surface actionable failures?
- Are build graphs decomposed so focused changes do not require whole-world validation?
- Are flakes tracked and repaired rather than normalized?

A fast loop is a ratchet. If the loop gets slower, the team should stop and improve the harness rather than accepting a permanently worse agent environment.

## Agent-Friendly Tooling

Agents are strongest with stable, text-first, token-efficient tools. GUIs can be useful when exposed through automation or screenshots, but CLIs and structured output are often easier for agents to use.

Good agent-facing tools:

- Have discoverable help text.
- Return concise, structured output.
- Separate passing noise from failing details.
- Support focused scopes, such as one package, one test, one route, or one workflow.
- Avoid interactive prompts unless explicitly requested.
- Produce artifacts agents can attach to reports or PRs.
- Encode safe defaults and refuse destructive behavior unless explicitly confirmed.

If a standard tool is too noisy, wrap it. For example, a test runner wrapper can print only failing suites and the command needed to rerun them, while still preserving full logs in an artifact.

## Review Loops

Harness engineering moves review from synchronous human inspection toward agent-consumable feedback loops. Humans may still review, especially at release boundaries or for hard judgment calls, but the default loop should let agents get feedback, respond, and converge.

Good review loops:

- Code authoring agent opens or prepares a PR.
- Review agents inspect targeted dimensions such as correctness, architecture, tests, security, UX, or docs.
- Reviewers assign severity and distinguish blockers from backlog-worthy comments.
- The authoring agent may accept, defer, or push back with rationale.
- Feedback that reveals missing rules becomes docs, tests, lints, or future tracker work.
- Humans see a compressed summary: what changed, what evidence exists, what risks remain, and what requires judgment.

Avoid review loops where agents blindly obey every comment. That can cause thrash, scope explosion, and non-convergent agent-to-agent behavior. The harness should explicitly allow deferral and disagreement when the evidence supports it.

## Evidence Compression

The agent should compress its trajectory into evidence humans can review quickly. Humans should not have to inspect every terminal command or reread every changed file to decide whether a result is trustworthy.

Useful evidence artifacts:

- Before/after screenshots or videos.
- Focused validation logs.
- Reproduction scripts.
- Failing-then-passing test output.
- Trace/log/metric excerpts tied to the changed path.
- PR summaries organized by user outcome, implementation, validation, and residual risk.
- Assessment reports with representative file paths and commands.

Trust grows when agents provide evidence at the level humans actually need: outcome, proof, and remaining risk.

## Disposable Code And Rework

When agents can cheaply regenerate work, code becomes less precious. This changes the review posture. If a PR is structurally wrong, it may be cheaper to discard and restart with better instructions than to nurse the branch through layers of patches.

Harness implications:

- Preserve task intent, acceptance criteria, and lessons learned separately from the branch.
- Keep worktrees or task environments cheap to create and destroy.
- Capture why a rejected attempt failed before retrying.
- Feed failures back into prompts, docs, tests, or constraints.
- Prefer small reviewable PRs when possible, but accept that parallel throughput can create merge conflicts agents should resolve.

Disposable code does not mean careless engineering. It means the durable asset is the harness: specs, feedback loops, constraints, and evidence.

## Garbage Collection

Agent-generated repos can accumulate drift because agents copy existing local patterns, including bad ones. Harness engineering needs continuous garbage collection.

Good garbage-collection loops:

- Recurring doc-gardening agents find stale docs and open fixes.
- Quality trackers identify weak domains or layers.
- Technical debt files are updated with evidence and closed when fixed.
- Cleanup agents search for duplicated helpers, guessed data access, or obsolete compatibility paths.
- Review comments are promoted into durable rules when repeated.
- Architectural drift is caught by structural checks.

Continuous small cleanup is better than occasional large "AI slop" cleanup. The goal is to stop bad patterns before they become training data for future repo-local agent behavior.

## Work Orchestration And Multi-Agent Systems

As throughput increases, humans should stop manually managing every terminal pane and task. A stronger harness introduces orchestration:

- Tasks have clear states: queued, in progress, needs review, needs rework, blocked, complete.
- Each task owns an isolated branch, worktree, environment, or workspace when possible.
- Agents can be spawned, supervised, stopped, retried, and reworked.
- Failed attempts are summarized and fed into the next attempt.
- Humans approve or reject at the level of outcome and risk.
- Dashboards expose task state, agent trajectory, permissions, and evidence.

The orchestration technology is stack-specific. The reusable concept is a managed work system where agents can run in parallel and humans only intervene where judgment or authorization is actually needed.

## Blueprint And Ghost-Library Thinking

A mature harness can describe systems at a high enough fidelity that an agent can reassemble them in another environment. This is the "blueprint" idea: specify intent, components, contracts, workflows, IDs, success criteria, and review loops strongly enough that the implementation can be regenerated or adapted.

Use this lens in assessments:

- Are critical systems described by behavior and contracts, or only by incidental code?
- Could an agent rebuild the important shape from repo-local specs?
- Are implementation choices separated from invariants?
- Are stack-specific tools described as replaceable roles?
- Can another repo adapt the same harness pattern with different project-native tools?

Blueprints should be opinionated enough to work, but not so rigid that they require one vendor, one tracker, one language, or one observability stack.

## Skills As Harness Components

Skills are compact procedural packages that teach agents how to do recurring work. A skill is useful when repeated tasks require context, sequencing, examples, or bundled resources that a general model should not rediscover every time.

Good skill boundaries:

- One clear job.
- Strong trigger description.
- Lean main instructions.
- References loaded only when needed.
- Scripts for fragile deterministic operations.
- Examples that show stack-specific execution without making the skill stack-bound.
- Clear stopping conditions and output shape.

Skills should not become giant manuals. If a rule belongs to the target repo, put it in the repo. If a reusable workflow belongs across repos, put it in a skill. If a deterministic operation is repeatedly rewritten, move it into a script.

## Plans As Harness Components

Plans are not just human project-management artifacts. For agents, a good plan is a restartable control surface.

Use plans when work is broad, risky, multi-session, or changes architecture. A good plan includes:

- Purpose and user-visible outcome.
- Current state and evidence.
- Phase outcomes in plain language.
- Implementation checklist.
- Exact validation commands and success criteria.
- Decision log.
- Surprises and discoveries.
- Completion notes.

Do not generate a plan automatically during an assessment unless the user asks. The assessment should identify possible plans and explain why each would be useful. The chosen plan should be minimal, self-contained, and aligned with the repo's own planning convention.

## Enterprise And Governance Context

Harness engineering is not only about coding. The same principles apply to agents operating across a business. Enterprise-ready harnesses expose security, compliance, authorization, audit, and domain context to both agents and supervisors.

Assess whether the project needs:

- Permission boundaries and revocation paths.
- Identity and audit trails for agent actions.
- Data-access controls and exfiltration safeguards.
- Connectors to company-native tools.
- Agent trajectory inspection for security and skill improvement.
- Business definitions and data ontology that agents can query.
- Stakeholder-specific dashboards for engineering, security, compliance, and operations.

The more economically valuable the agent's work, the more the harness must support observability, governance, and accountability.

## What Humans Still Do

Even with a strong harness, humans remain important. They should focus on:

- Choosing goals and priorities.
- Defining product taste and user value.
- Making hard calls in new or ambiguous domains.
- Approving releases or irreversible changes.
- Designing better harnesses after failures.
- Resolving deep architecture choices where the right interface shape is unclear.

Agents can often handle established, bounded, or well-scaffolded work. Humans add the most leverage on hard-new problems, deep refactors with uncertain boundaries, product judgment, and safety-sensitive decisions.

## Assessment Heuristics

When evaluating a repo, ask:

- Where is human attention still required because the repo is illegible to agents?
- Which failures repeat because requirements are not encoded?
- Which validation steps are manual, slow, noisy, or inaccessible?
- Which architecture rules exist only as prose?
- Which docs are current enough to trust, and which are attractive nuisances?
- Which commands should be wrapped for agent-friendly output?
- Which runtime signals should be exposed to agents?
- Which review comments should become durable rules?
- Which cleanup loops would prevent drift from compounding?
- Which downstream artifact would unlock the most agent leverage next?

The best assessment output is not a generic maturity grade. It is a repo-specific map of opportunities: what exists now, what the target harness state should be, what evidence supports the gap, and what artifact or implementation grain should come next.
