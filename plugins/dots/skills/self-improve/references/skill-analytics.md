# Skill-Usage Analytics

Use `skill-usage` once to build the frozen read list for a named skill review.

```bash
python3 scripts/self_improve.py skill-usage --skill dots:pr --days 30 --limit 100
```

The exact skill filter is applied after the bounded corpus is scanned. Do not
use a session-title or prompt query to find invocations; it omits sessions where
the skill ran without appearing in searchable metadata.

## Signals

- **Mentions** count known `$skill` tokens in ordinary user or assistant prose.
  Prompt drafts and quoted transcripts belong here.
- **Invoked** counts deduplicated parent-session clusters with host-structured
  evidence: a Codex `<skill><name>…</name>` injection, an exact structured
  `skill` argument, or an exact skill tool name or namespace.
- **Friction candidates** are invoked clusters with a tool-error marker or user
  frustration cue somewhere in the thread.

Injected skill bodies contribute only their exact `<name>` value. Their embedded
instructions do not create mentions or friction signals. Duplicate transport
copies, delegated children, and exact retries collapse before invocation counts.
Structured invocations remain visible when the named skill is no longer
installed or came from a project checkout; the ledger labels them
`historical/local` instead of discarding them.

These signals are discovery aids, not telemetry. Description-based or otherwise
silent invocations may be absent. Friction is correlation until the transcript
shows that the skill caused or failed to prevent it.

The output's cohort cutoff and representative IDs define the audit read set.
Use every listed representative, including invocations without friction cues,
rather than rerunning a moving top-N query after new audit threads have been
created.

## Review

For the named skill, read every invoked cluster in scope—not only the friction
candidates. For each cluster:

1. Establish the request, whether the skill actually ran, and the outcome.
2. Decide whether any friction was caused by the skill, by its trigger, or by
   unrelated work in the thread.
3. Compare successful runs to failures and state the repeatable happy path.
4. Treat one cluster as an incident, not a rule. Pass the generalization gate in
   [thread-evidence.md](thread-evidence.md) before proposing a skill change.

Prioritize repeated causal friction across invocation clusters. A heavily used
skill with clean representative runs may need no change.
