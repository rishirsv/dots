# Managing AGENTS.md

The reference for proposing and editing `AGENTS.md` files. Use it whenever a
self-improve proposal targets `Project AGENTS.md` or `Global AGENTS.md`, or when
the user asks how to structure, write, or clean up an agent instruction file.

`AGENTS.md` is the durable, checked-in guidance an agent loads every relevant
session. It is one of three layers; keep them distinct:

| Layer | What it is | Where |
|---|---|---|
| Sessions | Raw replayable transcripts (evidence) | `~/.codex/sessions/**` |
| Memories | Generated durable patterns (supporting context) | `~/.codex/memories/` |
| **AGENTS.md** | **Mandatory, human-owned, checked-in rules** | repo + `~/.codex/AGENTS.md` |

Mine sessions and memories for evidence; the durable output of that mining is
usually a rule in the closest `AGENTS.md`.

## How Codex loads AGENTS.md (constrains what you write)

These mechanics are why "closest scope" and "lean files" matter — write to fit
them, do not fight them.

- **Discovery per directory:** `AGENTS.override.md` wins, then `AGENTS.md`, then
  configured fallbacks. Other filenames are ignored for instruction discovery.
- **Scope and merge:** global `~/.codex/AGENTS.md` is read first, then the
  project from the git root down to the working directory. Files **concatenate
  root → leaf, and closer directories override** farther ones. Discovery stops
  at the cwd; it does not scan into child directories.
- **Hard size cap:** ~32 KiB per file by default; accumulation stops at the cap,
  so anything past it is silently dropped. Empty files are skipped.
- **Review hook:** a `## Review guidelines` section steers Codex code-review
  behavior (e.g. `@codex review`). Put review expectations there.

Implications: keep each file small, put a rule in the **closest** file whose
scope matches it, and never let a global file carry repo-specific detail.

## What belongs in AGENTS.md — and what does not

Choose the cheapest durable home. AGENTS.md is for judgment and orientation that
must load every session; push everything else to a stronger surface.

| Signal | Best home | Why |
|---|---|---|
| Repo layout, build/test/run commands, conventions, review expectations, done-checks | **AGENTS.md** | Loads every session; short and stable |
| A rule a linter, formatter, type-checker, or test can enforce | **Check, not prose** | Deterministic beats remembered |
| A long procedure or playbook | **Doc or skill** | AGENTS.md should point, not contain |
| A personal default that holds across all repos | **Global `~/.codex/AGENTS.md`** | Scope matches |
| A repo-specific rule | **Project AGENTS.md (closest scope)** | Loads only where relevant |
| A generated, evolving preference | **Memory** | Not human-owned canon |

Rule of thumb: **mechanical → a check; judgment → prose in AGENTS.md, with its
why and its degree of freedom.** A linter can count two static options and
suggest radio buttons; only product context can name the right object — that
part stays prose.

## Write observable decisions, not adjectives

The single most important rule. An agent cannot act on a vibe.

- ❌ `Buttons should be clear and polished.`
- ✅ `Destructive actions use a Verb + Noun label (e.g. "Delete project").`
- ❌ `Handle errors gracefully.`
- ✅ `On a failed write, preserve the user's input and show a recoverable error; never clear the form.`

If a rule cannot be checked by reading the result, rewrite it until it can.

## Anatomy of a good rule

For anything beyond a one-line command or convention, give the agent enough to
apply judgment and to know when *not* to:

```
### rule/<stable-id>
Scope:      when this applies / where it loads
Rule:       the observable decision (imperative)
Why:        the reason it exists (so the agent can reason about edge cases)
Exceptions: when to deviate, and the degree of freedom
Source:     evidence — thread id, PR, or accepted decision
Bad / Good: one short counter-example and one correct example
```

Short, settled rules don't need the full block — a single observable line is
fine. Use the block when the rule carries judgment or is easy to misapply.

## Structure of a healthy AGENTS.md

Keep it skimmable and ordered most-load-bearing first:

1. **Orientation** — what the project is, in one or two lines.
2. **Commands** — exact build, test, run, lint commands with their paths.
3. **Conventions** — naming, structure, and code-style decisions that aren't
   already enforced by a linter.
4. **Review guidelines** — what a reviewer (human or `@codex review`) must check.
5. **Constraints** — hard "do not" rules, with their why.
6. **Done checks** — the verification signals that mean a change is complete.
7. **Coverage gaps** — areas with no standard yet, so the agent knows where it
   has no authority and should ask rather than guess.

Not every file needs all seven. A leaf-directory `AGENTS.md` may be three lines.

## Decision-authority order

When guidance conflicts, resolve deterministically. A sound default order:

1. The user's explicit goal in the current task.
2. Verified product/user evidence.
3. Repository-canonical guidance: `AGENTS.md` and named component/library APIs.
4. Accepted, recorded decisions.
5. Adjacent shipped patterns in the repo.
6. General heuristics.

Treat **shipped code as evidence, not automatic law** — existing code can carry
a flaw, so "match the existing pattern" never overrides correctness.

## Editing discipline

- Add a rule only after **repeated** mistakes, repeated review feedback, or
  context the user keeps re-explaining — not after a single incident. Never
  promote one example into a universal rule by itself.
- Put the rule in the **closest** `AGENTS.md` whose scope matches it. Reserve the
  global file for personal defaults that hold across repos.
- **Replace or delete** stale or conflicting text instead of appending another
  patch. A file that only grows stops being read.
- Move long procedures to a doc or skill; move enforceable rules to a check.
- Include exact commands, paths, and the verification signal whenever possible.
- Respect the 32 KiB cap — if a file is near it, tighten or relocate before
  adding.

## Treat rules as product changes

A rule is a change to agent behavior; govern it like one.

- **Verify before writing:** confirm the evidence in the cited threads, and
  confirm the current file content, before proposing an edit.
- **Test the trigger separately from the guidance.** Loading the file and
  following a rule are different failures — a rule that never loads looks
  identical to a rule that is ignored. If guidance is being skipped, first check
  it is actually in scope and under the size cap.
- **Record scope, rationale, evidence, exceptions, and a bad/good example** for
  non-trivial rules.
- **Remove rules that stop helping.** Prune on the same evidence bar you add on.

## Self-Improve handoff

This skill proposes AGENTS.md changes; it does not silently apply them. Each
proposal names the target file (closest scope), the observable rule, its
evidence, and its strength. Apply only the approved subset, then re-read the
edited file to confirm it still parses and stays under the size cap.
