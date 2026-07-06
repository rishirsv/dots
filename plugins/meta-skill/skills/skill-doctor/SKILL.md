---
name: skill-doctor
description: "Reviews, diagnoses, and improves existing agent skills — or a whole plugin's skill system — using the skill's text, usage history, and eval evidence. Use for review this skill, a skill keeps failing, tighten this skill, or audit these skills. Not for authoring new skills (skill-writer) or building eval suites (skill-evaluator)."
---

# Skill Doctor

Make an existing skill better, with evidence. One flow, whatever the entry
point: gather evidence, diagnose in named terms, propose the smallest fix,
edit only after approval, verify. A scored review is an output format the
user can ask for, not the default deliverable.

For the plugin-level CLI surface, read [cli.md](../../references/cli.md); do
not invent doctor-specific commands.

## Evidence

Use whichever of the three sources exist; say which ones you used.

1. **The text** — SKILL.md, frontmatter, references, scripts: the exact words
   a future agent reads. Read the full shipped payload, not a summary.
2. **Usage history** — when the platform exposes it (Codex:
   `~/.codex/state_5.sqlite` `threads`; see
   [references/diagnosis.md](references/diagnosis.md) for queries). Count
   organic invocations separately from dev-on-the-skill threads, and search
   idiom variants and old names, not just the current name. Zero organic use
   is a first-class finding; so is an invocation idiom the description
   doesn't carry.
3. **Eval evidence** — existing suites and their last results; run the
   relevant evals when the diagnosis needs behavioral proof.

For clarity and trigger complaints, add a **fresh-read test**: hand the
skill text to a fresh subagent with the artifact only — never your own
conclusion or the user's complaint — and ask what it would do for a given
request. Starving the reader of your hypothesis prevents agreement bias.

## Diagnose

Name every finding with the taxonomy in
[references/failure-modes.md](references/failure-modes.md) and check
frontmatter against the
[description standard](../../references/description-standard.md). Always run
two checks that catch what per-line reading misses:

- **Contradiction scan** — the same rule stated twice with different
  strength or wording, in the body, across body and references, or across
  sibling skills claiming one job. Literal models pay for every conflict.
- **Calibration** — compare the skill against one strong local exemplar of
  the same kind (in this repo: `debug` and `explain` for judgment-teaching
  altitude) and say where it sits, so "too long" and "too thin" mean the
  same thing across reviews.

Propose the remedy, not the smell: name the exact edit — the sentence to
delete, the rule's one surviving home, the reference to extract — not "this
is bloated". Rank findings by user impact, weighted by usage evidence: a
defect in a daily skill outranks a worse defect in a dormant one.

## Plugin Scope

When asked to review a plugin or several skills together, diagnose the
system, not just each file:

- **Routing collisions** — description pairs (including platform built-ins)
  that both plausibly claim one request without mutual boundaries.
- **Duplicated policy** — near-identical guidance in ≥2 skills; propose one
  shared reference and links.
- **Dangling ownership** — every "route X to Y" must resolve; check what a
  recent deletion or rename orphaned.
- **Investment inversion** — compare line counts and eval coverage against
  usage; recommend moving rigor to where the usage is.
- **Lane decomposition** — ≥3 skills sharing one lifecycle: evaluate the
  one-skill-with-modes shape before recommending edits to each.

## Output

Findings ranked by impact. Each: defect name (taxonomy term), evidence
(quote, count, or eval result), and the exact proposed edit. State what
evidence was not available. Produce the scored Judge review
([judge-rubric.md](../../references/judge-rubric.md), with the payload
sweeps in [payload-hygiene.md](../../references/payload-hygiene.md)) only
when the user asks for scores.

Write saved artifacts only when the user allows them; resolve the workbench
path with `<meta-skill-root>/scripts/metaskill init <skill-dir> --dry-run
--json` first.

## Edit

Edit source only when the user approves a concrete proposal or directly
requests a specific change ("apply proposal 1", "make that routing change").
Feedback, diagnosis, or brainstorming is not approval. Restate the approved
change and files, edit exactly that scope, and edit the source skill — never
a generated package copy. A description change alters routing; call that out
when proposing it. For candidate testing before approval, use the trial-run
workflow in [skill-trial-runs.md](../../references/skill-trial-runs.md) in a
child worktree; trial edits are evidence, not promotion.

## Verify

After an approved edit: run
`<meta-skill-root>/scripts/metaskill validate <skill-dir> --json`, re-run
the originally failing case or the relevant evals, and scan the payload for
regressions the edit could have introduced (broken links, orphaned terms,
contradiction with an untouched section). Report what the verification can
and cannot prove. Escalate to `skill-evaluator` when the decision needs
multi-scenario measurement rather than a single reproduced case.
