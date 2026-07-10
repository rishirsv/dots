# Context Development Archetypes

First-class guidance for choosing what to put in an Oracle package. The package
script selects and zips the files you name; it does not decide which files are
relevant or at what *altitude* to include them. Pick the archetype that matches
the oracle task, set the altitude, then tune.

Two rules apply to every archetype:

- **Every file keeps a role.** `target`, `source`, `validation`, `constraint`,
  or `risk` (see the SKILL's Context section). A file with no role is noise.
- **Right altitude beats more files.** Use the smallest context at which a fresh
  model can reason correctly. Too little forces guessing; too much buries the
  decision and burns the token budget.

## Choosing Altitude

Match the breadth of context to the breadth of the decision, not to what is
nearby.

| Decision shape | Altitude to ship |
|---|---|
| One function, one bug, one line | The symbol + its direct callers/callees, the failing test, the exact error |
| One feature or module change | The module's files + its tests + the config/schema it depends on |
| A self-contained artifact judged against its own contract | The **whole** artifact and its planning docs (a skill, a plugin, a spec + its design notes) |
| A cross-cutting or architectural decision | A map of the subsystem + representative files per layer, not every file |
| An external-fact or research question | The question + local assumptions + claims to verify; local code only as background |

When unsure, start one altitude **smaller** and use `--dry-run` to preview the
manifest and token total before committing. Raise altitude only when a concrete
claim the oracle must make depends on context you left out.

## Archetypes

Each archetype lists when to use it, the altitude, what to include by role, what
to exclude, and a worked context map you can adapt for `--context-map-file`.

### Skill Or Plugin Improvement

**When:** the oracle task is to improve, review, or diagnose an agent skill or
plugin (for example, using the assistant's own skill to better itself).

**Altitude:** the **entire** skill or plugin directory plus its planning docs. A
skill's correctness is judged against its own contract and house authoring
standards, not against a single file, so ship the whole unit: `SKILL.md`, every
reference, every script, the tests, and assets — plus the design/plan documents
that explain why it is shaped this way and the authoring standard it must meet.

**Include by role:**

- `target`: the `SKILL.md` being improved.
- `source`: the linked references, scripts, and assets the runtime guidance
  depends on; advice must stay consistent with them.
- `validation`: the skill's own tests/fixtures and the validator output — proposed
  changes must keep these green.
- `constraint`: the design/plan docs (intent, non-goals) and the house authoring
  standard (e.g. the skill-writer/skill-doctor rubric) the skill must satisfy.
- `risk`: a sample of how the skill is invoked or routed, so trigger/description
  changes are checked against real selection.

**Exclude:** unrelated sibling skills and installed plugin/cache copies.

**Worked context map:**

```
- plugins/dots/skills/oracle/SKILL.md (target): the skill contract being improved.
- plugins/dots/skills/oracle/references/*.md (source): runtime depth the SKILL links to; advice must stay consistent.
- plugins/dots/skills/oracle/scripts/oracle_package.py (source): the deterministic helper the guidance describes.
- .plans/<skill>-design.md (constraint): why the skill is shaped this way and its non-goals.
- plugins/meta-skill/skills/skill-writer/SKILL.md (constraint): house authoring standard the skill must satisfy.
- excluded: installed plugin/cache copies — duplicated runtime output, not source.
```

### Plan Or Spec Improvement

**When:** improve or pressure-test a plan or spec before implementation.

**Altitude:** the seed plan plus the implementation surface it touches.

**Include by role:** the seed plan/spec (`target`); the files it would change and
the source-of-truth docs/config that govern them (`source`); nearby tests or
fixtures and the commands that would verify the final plan (`validation`); repo
instructions and non-goals (`constraint`); relevant changed files or selected
patch excerpts (`risk`). Exclude broad docs, generated mirrors, and unrelated
dirty files unless the plan explicitly depends on them.

### Adversarial Review / Red-Team

**When:** the user wants another model to attack a change and find what breaks.

**Altitude:** the changed surface plus one hop.

**Include by role:** the changed files or patch excerpts (`target`); one-hop
callers/callees and the data shapes they pass (`source`); tests and reproduction
steps (`validation`); invariants, security/compat constraints (`constraint`);
prior failures, logs, and the dirty-state boundary (`risk`). Include enough
source to challenge the change; do not package the whole feature area because a
bug *might* live nearby.

### Implementation Design / Architecture Choice

**When:** choose between implementation approaches or new structure.

**Altitude:** the entrypoints plus the patterns the new code must fit.

**Include by role:** the decision statement and any options sketch (`target`);
entrypoints, existing local patterns to imitate, config/schema (`source`); tests
or fixtures that pin current behavior (`validation`); constraints, non-goals,
migration/compatibility boundaries (`constraint`); examples to imitate or avoid
(`risk`). Include examples only when they are patterns, not decoration.

### Bug Diagnosis / "What Am I Missing"

**When:** local work has stalled and you want a fresh model to find the cause.

**Altitude:** the failing code path, tight.

**Include by role:** the suspect code path (`target`); the functions it calls and
the inputs it receives (`source`); the failing test and the **exact** error text
or logs (`validation`); environment/version constraints (`constraint`); the
recent diff or recent changes around the failure (`risk`). The exact failure
output is the highest-value item — never paraphrase it.

### Research / Current-Source Check

**When:** the answer depends on external or current facts, not the repo.

**Altitude:** the question, not the codebase.

**Include by role:** the precise question and local assumptions (`target`); the
specific claims to verify and the freshness/source-quality bar (`constraint`);
local docs only as background (`source`). Ask the oracle to separate
external/current-source claims from local repo claims, and to name when to stop
looking and return a bounded answer.

### Post-Oracle Adoption Review

**When:** an oracle answer is back and you must decide what to adopt.

**Altitude:** the answer plus what proves or disproves it.

**Include by role:** the returned answer and the original task (`target`); the
named repo claims to check (`source`); the local files, tests, or commands that
verify those claims (`validation`); the user constraints the advice must respect
(`constraint`); missing context the answer assumed (`risk`). Treat the answer as
hypotheses until local evidence supports them.

If a chosen altitude pushes a package over the SKILL's `--token-budget`, that is
the signal to drop to a smaller altitude, switch to selected patch excerpts, or
split the oracle run — see the SKILL's Package section for the budget and
`--dry-run` preview.

## Deterministic Helper Boundaries

Packaging helpers may expand globs, preview selected and skipped files, estimate
size and token totals, enforce the token budget, report sensitive-looking skips,
and show dirty-state facts. The current helper accepts an authored context map
but does not prove that the map is complete or semantically accurate. Helpers
must not claim to discover relevance, infer source authority, auto-prune by
meaning, or decide that context is sufficient. Altitude and relevance are your
judgment; the script only executes and measures the selection.
