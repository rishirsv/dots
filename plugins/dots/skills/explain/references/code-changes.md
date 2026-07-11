# Explaining code changes

Read this when the user asks to explain a diff, walk through completed work, or
make sense of code that was just changed. Produce a teaching narrative, not a
file-by-file diff recap.

## Investigate

Establish the change scope from the user's target, the conversation, or the
most recent coherent batch of work. Read the diff and the resulting files,
then follow nearby callers, types, state owners, boundaries, and tests far
enough to explain both the prior system and the new behavior. Treat recorded
rationale as evidence; do not invent intent from code shape.

## Explain

Order the explanation for understanding:

1. **Outcome.** What behavior or capability is different, in plain language.
2. **Relevant background.** Only the prior-system context needed to understand
   why the change exists.
3. **Core idea.** The conceptual move that makes the implementation coherent.
   Use one concrete example or toy input when it shortens the explanation.
4. **Walkthrough.** Group significant changes by responsibility and dependency,
   not path order. Connect each group to the core idea and link exact files or
   symbols when useful.
5. **Representative flow.** Trace one real input, request, event, or state
   transition through the changed behavior when the mechanism is otherwise
   hard to see.
6. **Evidence.** Say how important behavior was verified and what remains
   unverified. Mention alternatives or tradeoffs only when the source supports
   a genuinely different approach.

Account for all changed files, but de-emphasize generated, formatting-only,
lockfile, and mechanical changes unless they affect behavior or risk. Use a
before/after visual only when it replaces prose. Stop when the reader can
explain how the resulting system works and what meaningful change produced it.

For a shareable HTML explanation, hand this formed narrative to `html` and have
it follow its code-change explainer reference. Rendering must not reopen the
analysis or add rationale.
