# Explain a code change

1. Set the scope from the user's request, the conversation, or one related batch
   of changes.
2. Read the diff and the changed files. Trace only callers, data owners,
   boundaries, or tests that show the cause and result.
3. State the new result first. Then state the prior behavior and the core change
   that produced the new result.
4. Group changes by their job and dependency. Do not list files in path order.
5. When a sequence causes the result, trace one real input, event, or state change.
6. State the evidence for the new behavior. State what you did not verify.

Account for each changed file. If generated files, format-only changes, or lock
files do not change behavior or risk, combine them.

If the source records a reason, state that the source gives the reason. Mark all
other statements about intent as inferences.
