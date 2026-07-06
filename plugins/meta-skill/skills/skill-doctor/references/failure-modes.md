# Skill Failure Modes

The shared defect taxonomy for diagnosing skills. Name findings with these
terms and propose the specific remedy, never just the smell.

## Text defects (visible in the skill's words)

- **No-op line** — a sentence the model already obeys by default ("don't
  hide uncertainty", "be thorough", personality padding). Test each sentence
  in isolation; delete whole sentences. Remedy: delete.
- **Sprawl** — body grown past what the job needs (house target: earn every
  paragraph; hard ceiling 500 lines). Remedy: push depth to one-level-deep
  references; keep judgment in the body.
- **Duplication / sediment** — the same rule stated twice (often with
  drifted strength), or layers of old guidance never removed. Literal models
  pay a reconciliation tax on every conflict. Remedy: one home per rule.
- **War story** — a lesson written as one bug's play-by-play instead of the
  transferable principle. Remedy: extract the principle, drop the story.
- **Implementation index** — pointing at today's file/line/constant instead
  of durable judgment; decays silently. Also: time-sensitive content and
  date-conditional language. Remedy: rewrite as a durable rule.
- **Magic-phrase gate** — behavior unlocked only by an exact user phrase or
  token grammar. These fail silently; usage history shows users never say
  the incantation. Remedy: keep the gate, accept plain-language equivalents.
- **Unconditional ceremony** — a mandate that fires on every invocation
  regardless of task size ("always emit a preamble", "every turn"). Remedy:
  gate it by task size or mode; state the small path first.
- **Terminology drift** — one concept, several names across body and
  references. Remedy: one term everywhere.

## Behavior defects (visible when the skill runs)

- **Premature completion** — declares done before the contract is met.
- **Embargo** — withholds an early finding to honor step choreography.
- **Lucky pass** — validation passed only because the world volunteered a
  critical input; the skill didn't cause the success.
- **Stage compression** — several steps' worth of work landing in one
  message, or narrating a later step as done without opening it. This is
  the real test for whether a skill needs splitting — not conceptual tidiness.
- **Form-filling** — performing the skill's structure without visible
  thinking (correct format, empty content).

## System defects (visible across a plugin)

- **Routing collision** — two descriptions (or a description and a platform
  built-in) both plausibly claim one request, with no mutual boundary.
- **Dangling ownership** — "route X to Y" where Y doesn't exist, or a
  deletion that silently orphaned a job.
- **Investment inversion** — rigor, length, and evals concentrated on
  low-usage skills while high-usage skills carry the ceremony and no evals.
- **Lane over-decomposition** — ≥3 skills sharing one lifecycle noun,
  quadrupling boilerplate and routing surface. Benchmark: one skill with
  modes (compare the curated-plugin shape).
- **Cache/source drift** — the installed skill differs from source, so
  recent edits have never actually run.
