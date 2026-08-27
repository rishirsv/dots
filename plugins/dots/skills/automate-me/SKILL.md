---
name: automate-me
description: "Use only when the user selects `$automate-me` to create or update a personal mode skill from repeated preferences and corrections in their own sessions; not for shared workflow improvement or task-specific skills."
---

# Automate Me

Create or update one personal `-mode` skill that captures how the user wants
agents to work. Mine evidence first, let the user choose which patterns are
really theirs, and keep the mode smaller than the history that produced it.

## Find the target and evidence boundary

Look for an existing personal mode in the skill locations supported by the
active environment and repository. Update it by default when the user asks to
refresh their mode. Create a new one when none exists or the user explicitly
wants a fresh mode.

Use only the current task, named tasks, or the user's sessions from the current
host and workspace. Do not scan unrelated projects, accounts, or another
person's sessions. For recent-history mining, read the evidence rules and host
instructions owned by `$self-improve`:

- [Thread evidence](../self-improve/references/thread-evidence.md)
- [Codex sessions](../self-improve/references/codex-sessions.md) or
  [Claude sessions](../self-improve/references/claude-sessions.md)

Start with the last 30 days and at most 100 sessions. For an update, prioritize
evidence since the mode last changed, then inspect older examples only when
needed to decide whether a rule remains stable.

## Recover preferences, not accidents

Read the underlying conversations and tool calls. Look for repeated or explicit
preferences about:

- response form and explanation depth;
- autonomy and when to ask;
- investigation, planning, and use of prototypes;
- delegation and model-to-task choices;
- code and prose discipline;
- proof, review, commits, pull requests, and monitoring; and
- recurring corrections to agent behavior.

Treat an explicit user correction as strong evidence. Treat a pattern repeated
across independent tasks as a candidate default. Do not promote one agent's
behavior, one unexplained incident, or a preference contradicted elsewhere.
Keep private examples, transcript identifiers, and project-specific facts out
of the portable mode.

## Let the user select the rules

Present a compact candidate set. For each candidate, state the proposed rule,
the recurring behavior it would change, and the strength of its support. Ask
the user to accept, edit, reject, or add rules before writing the mode. Do not
infer identity from frequency alone.

Group accepted rules only where the user has something non-default to say.
Useful groups may include autonomy, understanding, delegation, implementation,
verification, review, process, and communication. Sparse is correct when few
preferences earned promotion.

## Author and validate the mode

Use `$skill-standards` and the environment's default Skill Creator to create or
update the mode. Preserve accepted existing rules that new evidence does not
contradict. Reference other skills or project instructions instead of copying
their contents.

Keep the personal mode explicit-only unless the user asks for it to apply
automatically. Validate the changed skill with the active environment's skill
validator and inspect the final source with the user. Do not commit, publish,
install, or open a pull request unless the user asks.

Use `$self-improve` instead when the evidence supports a shared workflow fix.
Use `$skill-standards` directly when the user already knows the task-specific
skill they want and no preference mining is needed.
