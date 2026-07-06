# Diagnosis Depth

Detail for the Evidence and Diagnose steps in SKILL.md. Read this when a
diagnosis needs usage history, a reported-failure reconstruction, or a
candidate-edit loop — not for quick text reviews.

## Usage Evidence (Codex)

Query the thread index read-only. Copy the sqlite files (with `-wal`/`-shm`)
to a scratch directory first if WAL-locked.

```bash
sqlite3 <copy-of ~/.codex/state_5.sqlite> \
  "SELECT COUNT(*), MAX(updated_at) FROM threads
   WHERE title LIKE '%<token>%' OR first_user_message LIKE '%<token>%'
      OR preview LIKE '%<token>%';"
```

- Search every name the skill has had and every idiom variant (hyphenated,
  spaced, concatenated), not just the current name.
- Separate organic use from dev-on-the-skill threads: a thread whose `cwd`
  is the plugin repo is development, not usage.
- Treat counts as floors — implicit-trigger skills undercount badly.

For a failure that happened in a specific prior thread, use the
`sessions list`/`show`/`extract` workflow in
[thread-skill-improvement.md](../../../references/thread-skill-improvement.md).
Targeted evidence only: do not scan unrelated sessions unless the user asks
for pattern mining. Cite thread ids and timestamps; separate transcript fact
from inference; never copy raw prompts, thread ids, paths, or provider names
into runtime guidance.

## Reported-Failure Reconstruction

1. Capture expected vs actual.
2. Reconstruct the triggering input; render the transcript when the failure
   happened in a prior session.
3. Localize the cause to the smallest surface: description, body section,
   reference, workflow branch, output contract, script contract, or missing
   gate. For contamination or leaked-vocabulary complaints, run the sweeps in
   [payload-hygiene.md](../../../references/payload-hygiene.md) across the
   full shipped payload, including headings, labels, and copyable text.
4. Never diagnose "make it clearer" — name the phrase, section, or evidence
   row causing the risk.

## Candidate-Edit Loop

- Produce two or three candidate edits that fix the behavior while
  preserving the trigger contract. For mechanical-language complaints, one
  candidate should be a positive prose rewrite: name the natural behavior
  the skill should cause, then delete the machinery competing with it.
- Generalize: convert incident evidence into the reusable failure class;
  keep one-off names in the evidence section only.
- Prefer replacing a misleading sentence over adding a prohibition; when a
  negative guard is genuinely needed, pair it with the desired behavior.
- Recommend one smallest strong fix and say why the others lost.

## Trial Runs

For candidate testing, follow
[skill-trial-runs.md](../../../references/skill-trial-runs.md): one
realistic prompt in a clean child worktree, not a suite. Trigger failures
reproduce with a natural prompt; behavior failures force invocation with the
failing input. Do not spawn trial children unless the user asked for testing
or approves it when offered. Trial results are evidence for a proposal, not
edit approval.
