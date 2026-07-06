# Diagnosis Depth

Detail for the Evidence and Diagnose steps in SKILL.md. Read this when a
diagnosis needs usage history, reported-failure reconstruction, or a concrete
proposal set — not for quick text reviews.

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

## Diagnosis Packet

Before proposing updates, capture only the fields that change the decision:

| Field | What to capture |
|---|---|
| Expected behavior | What the skill should have caused. |
| Actual behavior | What happened, or what the text would likely cause. |
| Trigger input | The user prompt, failure scenario, review request, or thread evidence. |
| Files inspected | The full shipped payload and references actually read. |
| Validation output | Current validation command and result, when relevant. |
| Likely source | The smallest source surface: description, body section, reference, workflow branch, output contract, script contract, or missing gate. |
| Alternate causes rejected | Plausible causes checked and ruled out. |
| Confidence | High, medium, or low; use low when the proposal rests only on user report or static inference. |
| Falsifier | Evidence that would prove the diagnosis wrong. |

For failures in a prior session, render the relevant transcript before
diagnosing. For contamination or leaked-vocabulary complaints, run the sweeps
in [payload-hygiene.md](../../../references/payload-hygiene.md) across the full
shipped payload, including headings, labels, and copyable text.

Never diagnose "make it clearer." Name the phrase, section, or evidence row
causing the risk.

## Proposed Updates

Return two or three concrete updates unless there is only one safe fix. Each
update should include:

- exact source scope
- intended behavior change
- benefits
- trade-offs or residual risk
- validation to run

For mechanical-language complaints, include at least one positive prose rewrite:
name the natural behavior the skill should cause, then delete the machinery
competing with it.

Before recommending, run these checks:

- **Generalization** — convert incident evidence into the reusable failure
  class; keep one-off names in the evidence section only.
- **Trigger preservation** — preserve the existing trigger contract unless the
  trigger is the defect; call out any description change because it affects
  routing.
- **Source hygiene** — scan candidates for source provenance, stale references,
  and negative-only rules. Prefer replacing a misleading sentence over adding a
  prohibition; when a negative guard is needed, pair it with the desired
  behavior.

Recommend the smallest strong update and say why the alternatives lost.

## Trial Runs

For candidate testing, follow
[skill-trial-runs.md](../../../references/skill-trial-runs.md): one
realistic prompt in a clean child worktree, not a suite. Trigger failures
reproduce with a natural prompt; behavior failures force invocation with the
failing input. Do not spawn trial children unless the user asked for testing
or approves it when offered. Trial results are evidence for a proposal, not
edit approval.
