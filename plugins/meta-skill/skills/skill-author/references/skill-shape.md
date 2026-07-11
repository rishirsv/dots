# Skill Shape

Read this when an idea may be better served by something other than a skill.

## The Skill Test

A skill is a good fit when all of these are true:

- the job recurs across more than one task
- the user can describe when it should activate in ordinary language
- specialized judgment, procedure, or resources would change the agent's next
  action
- the work has a recognizable result and finish condition
- the guidance can travel without private project history

If the value is only a reminder, a one-time answer, or generic advice the base
agent already follows, do not create a skill.

## Choose The Smallest Better Artifact

| Need | Better home |
|---|---|
| One project's durable conventions | Project instructions or documentation |
| A fact or preference to remember | Memory or local configuration |
| A repeatable deterministic transformation | Script or validator |
| A reader-facing specification or decision | Durable document |
| Live data, authentication, or external actions | App, connector, or service |
| Several agents coordinating persistent state | Managed agent system |
| Specialized judgment that should travel between tasks | Skill |

A skill may call a script, read a reference, or use an app. Keep judgment in
prose, exact computation in code, stable facts in references, and live
operations in the system that owns them.

## Boundary Check

Before authoring, finish these sentences naturally:

- This skill helps when ...
- It should not take over when ...
- A successful run leaves the user with ...

If the first sentence names several unrelated jobs, narrow or split the idea.
If the second can only be expressed with internal taxonomy, the trigger is not
ready. If the third is vague, settle the output contract before writing steps.
