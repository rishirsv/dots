# Skill-Usage Analytics

Use `skill-usage` once to select a fixed list of sessions to read for a named
skill review.

```bash
python3 scripts/self_improve.py skill-usage --skill dots:publish-pr --days 30 --limit 100
```

The exact skill filter is applied after the selected set of sessions is scanned.
Do not use a session-title or prompt query to find invocations; it omits
sessions where the skill ran without appearing in searchable metadata.

## Signals

- **Mentions** count known `$skill` tokens in ordinary user or assistant prose.
  Prompt drafts and quoted transcripts belong here.
- **Invoked** counts deduplicated parent-session clusters with host-structured
  evidence: a Codex `<skill><name>…</name>` injection, an exact structured
  `skill` argument, or an exact skill tool name or namespace.
- **Friction candidates** are invoked clusters with a tool-error marker or user
  frustration cue somewhere in the thread.

Injected skill bodies contribute only their exact `<name>` value. Their embedded
instructions do not create mentions or friction signals. Before counting
invocations, the helper combines duplicate copies, delegated children, and exact
retries. Structured invocations remain visible when the named skill is no longer
installed or came from a project checkout; the ledger labels them
`historical/local` instead of discarding them.

These signals are discovery aids, not telemetry. Description-based or otherwise
silent invocations may be absent. Friction is correlation until the transcript
shows that the skill caused or failed to prevent it.

The output's cutoff time and representative session IDs define which sessions to
read. Use every listed representative, including invocations without friction
cues, rather than rerunning a query for the top results whose contents can
change after new audit threads have been created.

## Review

For the named skill, read every invoked cluster in scope—not only the friction
candidates. For each cluster:

1. Establish the request, whether the skill actually ran, and the outcome.
2. Decide whether any friction was caused by the skill, by its trigger, or by
   unrelated work in the thread.
3. Compare successful runs to failures and state the repeatable happy path.
4. Require repeated clusters when generalizing beyond the task. One cluster can
   still support a narrow correction or an exact behavior the user requests.
   Pass broader changes through the generalization gate in
   [thread-evidence.md](thread-evidence.md).

Prioritize repeated problems caused by the skill across invocation clusters. A
heavily used skill with clean representative runs may need no change.
