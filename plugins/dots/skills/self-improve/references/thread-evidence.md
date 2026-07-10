# Thread Evidence

Use this common method after selecting the platform-specific session source.
The helper narrows the read set; the agent verifies the evidence and decides
whether it supports a durable change.

## Evidence packet

Capture only fields that change the proposal decision:

| Field | What to capture |
|---|---|
| Trigger | What the user asked for |
| Expected | What the workflow or skill should have caused |
| Actual | What happened |
| Correction | Direct user correction, accepted recovery, or repeated preference |
| Governing files | Instructions, skills, docs, scripts, configs, or checks that shaped the result |
| File activity | Files read, searched, edited, written, or merely mentioned |
| Outcome | Validation result and whether the user accepted it |
| Support | Deduplicated thread clusters and cross-repo spread |
| Contradictions | Evidence that points toward a different rule |
| Falsifier | What would show the diagnosis is wrong |

Thread ids, timestamps, and transcript paths establish provenance. Do not copy
them into portable skill or instruction text unless the runtime task requires
them.

## File references

Rank file evidence by how it was observed:

1. **Structured:** a Read, Edit, Write, search, notebook, or equivalent tool
   supplied the path in a dedicated argument. Treat this as high confidence.
2. **Command:** a shell command included a plausible path. Treat it as a lead;
   commands can contain generated, quoted, or non-file tokens.
3. **Mention:** user or assistant prose named a path. Treat it as context, not
   proof that the file was opened or changed.

Resolve relative paths against the thread working directory, retain the
original spelling, deduplicate canonical paths, and report whether the path
still exists. Never infer that a file was edited merely because it appeared in
a diff, command output, or message.

Include subagent files and transcripts under the parent thread. They are
supporting evidence, not independent user support.

## Triage

Prioritize threads containing:

- direct corrections or stable preferences;
- repeated retries followed by an accepted workflow;
- failed validation or tool friction tied to a named procedure;
- instruction, skill, plugin, memory, documentation, or harness decisions;
- files that recur across several related threads;
- recent work in the current repository.

Do not treat generic negative words, incidental error output, a skill name in a
diff, or a path mention as proof of failure. Separate organic use from threads
developing the skill itself.

## Proposal destinations

Choose one primary destination:

- existing skill;
- new skill;
- project instructions;
- personal instructions;
- memory note;
- repository documentation;
- script or harness;
- validation check;
- conflict resolution or deletion.

Prefer the cheapest durable home. Mechanical requirements belong in checks;
judgment that must load every session belongs in instructions; long procedures
belong in skills or docs; generated facts and preferences belong in memory.

## Privacy

Local transcripts may contain source files, command output, pasted text,
credentials, and private user content. Read the minimum needed, return concise
evidence summaries, and never include raw secrets or private contents in a
proposal. File paths are evidence only when the user needs them to evaluate the
change.
