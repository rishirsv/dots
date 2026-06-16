# Skill Shape

Read this before committing to a new skill, especially when the user has an
idea, source material, a repeated frustration, or a thread they want to turn into
reusable agent behavior.

## What A Skill Is

A skill is a portable behavior pack for a recurring task. It is more than a
Markdown prompt: it can include instructions, scripts, references, assets,
examples, data, and runtime metadata that a future agent can discover and use
only when the task calls for it.

Think of a skill as an onboarding guide plus reusable workbench for a capable
agent. It should give the agent judgment, context, tools, and failure boundaries
that are not already obvious from the user request or base model capability.

Skills are best when they change behavior at the moment of work:

- help the agent recognize the right recurring job
- provide non-obvious domain or workflow judgment
- bundle repeatable scripts, templates, schemas, examples, or assets
- define what good output looks like and how to verify it
- prevent common wrong turns, unsupported claims, unsafe actions, or wasted work

## Skill-Shaped Test

Treat an idea as skill-shaped when most of these are true:

| Signal | What it means |
|---|---|
| Recurs | Similar requests will happen again across users, files, projects, or time. |
| Specialized | The task needs domain, product, tool, business, style, or workflow knowledge the base agent may not infer. |
| Operational | The skill can tell the agent what to do, inspect, create, verify, or avoid during execution. |
| Resource-backed | Scripts, references, assets, examples, schemas, config, or data would reduce repeated work or errors. |
| Triggerable | Real user phrasing can identify when to use it without the user naming the skill. |
| Bounded | Nearby tasks can be excluded with a clear `not for` boundary. |
| Verifiable enough | Success can be checked by tests, artifact inspection, source tie-out, human review criteria, or a positive-null review scope. |
| Portable | The guidance belongs in a reusable runtime payload, not only a local note, memory, one-off plan, or repo policy. |

One strong signal is not enough. A script with no judgment may be a utility; a
preference with no workflow may be memory or project instructions; a broad topic
with no trigger boundary may be docs.

## Not Skill-Shaped

Prefer another artifact when:

- One answer or artifact is enough: answer directly or create the artifact.
- The behavior is general agent competence: do not package common sense.
- The rule is local and durable only in one repo: use `AGENTS.md` or project docs.
- The need is a personal preference or stable fact: use memory or user settings.
- The work is purely mechanical and enforceable: write a validator, linter, test,
  or script instead of instructions.
- The request is a full product, app, managed agent system, or workflow platform:
  create an app, project plan, or system document, not one skill.
- The material is primarily source evidence, research notes, or measurement output: keep
  it in `.meta-skill/`, project docs, or a benchmark folder.
- The trigger would steal too much from adjacent skills and cannot be narrowed.

## Capture Intent

Before designing the payload, recover the smallest reusable job:

1. What should the agent be able to do later?
2. What would a real user say that should trigger it?
3. What should not trigger it, even if keywords overlap?
4. What inputs does it need, and what output shape should it produce?
5. What would the agent otherwise rediscover, rewrite, or get wrong?
6. What scripts, references, examples, assets, or config would make future runs
   safer, faster, or more consistent?
7. What success checks are objective, and what needs human judgment?

Ask only for answers that cannot be inferred from the conversation or files. If
the existing context answers these, state the inferred shape and build.

## Realistic Trigger Examples

Use realistic prompts when testing whether something is skill-shaped. A prompt
that is too short, abstract, or explicit proves little.

Weak:

```text
Extract text from PDF.
```

Better:

```text
My boss sent three supplier invoice PDFs in Downloads. Can you pull the line
items into one CSV with invoice number, date, SKU, quantity, unit price, and any
pages you could not parse?
```

Good positives include messy wording, file names, informal language, omitted
skill names, and adjacent concepts where this skill should still win. Good
negatives are near misses, not irrelevant tasks.

## Resource Fit

Choose resources by asking what a future agent should not have to reinvent:

- Use `references/` for conditional knowledge: APIs, schemas, policies, gotchas,
  examples, decision tables, or detailed workflow variants.
- Use `scripts/` for deterministic operations that are fragile, repetitive, or
  easier to test as code.
- Use `assets/` for reusable output materials: templates, boilerplate, icons,
  sample workbooks, schemas, or approved visual files.
- Use `examples/` when examples are runtime calibration material the future agent
  should inspect.
- Use `resources/` or another named folder when the domain has a clearer runtime
  artifact category.

Do not add folders because a template offers them. Add them because the skill's
job requires them.

## Improvement Loop

Skills get better through observed use. Capture gotchas from failures, remove
instructions that do not pull their weight, and turn repeated helper code into
scripts. When the user asks for measurement, compare realistic with-skill
behavior against no-skill or prior-skill baselines when that would answer
whether the skill actually improves future work.
