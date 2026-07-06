# Scout — Simulation Round 2 (2026-07-06, v4 redesign → v5)

The owner redirected the design after round 1: no state/ledger apparatus
during conversation; scout absorbs (and will eventually replace) ideate;
full before/during/after-implementation lifecycle per the map-vs-territory
article's diagram; subagents do all external work so the campaign fits one
context window; handoffs never name specific skills. New sources folded in:
the kpmg product-brainstorming skill (thinking-partner posture, anti-pattern
naming), ce-brainstorm (think-time grounding scout, ubiquitous vocabulary
mapping, one-question-per-turn with blocking options), ce-ideate (generate
many → critique all → explain survivors), and the kpmg prototype skill
(never build from a brief alone; N distinct options → reaction → selection).

## Round 2 scoreboard (v4)

All three scenarios: full PASS on every criterion, zero user-frustration
events. Removing the ledger cost nothing — the scaled-capture rule wrote one
brief exactly when work had to travel (S3 session break), and Ana still
cold-started from it. Instruction-credited wins: think-time recon (S1, S2),
taste-signature pivot (S1, S2), "flag anything structurally unusual" catching
the partner-API landmine (S3), blindspot pass changing scope (S1).

## Doctor review (v4): 73%

Clean validation and hygiene. P1s: handoff section named skills (violating
the owner's no-naming decision); implementation-notes vs "only file scout
writes" contradiction; openai.yaml overclaimed "do not write files." P2s:
"build" overloaded three ways; no Decision Snapshot template; learnings had
no destination; quiz merge-gate unenforceable as written.

## v5 changes

1. Handoffs no longer name skills — recommend the next mode, user routes it.
2. Implementation notes live in conversation, appended to the travel brief
   when one exists; the brief stays the only file scout owns.
3. openai.yaml: "do not ship product code" + conditional travel brief.
4. "Build" disambiguated: prototype variations are disposable reaction
   material; "do not write product code" in the opening; gate keeps "build."
5. Ported ideate's fenced Decision Snapshot table and grounding-lane
   dispatch template.
6. Learnings destination named: chat recap, append to brief, flag
   instruction/memory candidates.
7. Quiz gate reframed advisory ("recommend holding the merge").
8. Sim frictions: taste tie-breaker restored ("one vague answer is the
   signature"); spine reserved for real forks, low-stakes questions get one
   plain line; recon-harvest + next question counts as one turn.
9. Fresh sessions check `.agents/outputs/` for a prior brief; parallel
   collaborators get disjoint scopes inside the brief.

v5 validates 16/16 (100%).

## v6 owner adjustments (final pass, 2026-07-06)

Generalized beyond feature development to all knowledge work (design,
architecture, code, documents) — description, opening, During/After wording;
"product code" → "the final work"; "the conversation is the deliverable."
Image generation added as a first-class Prototype tool ("a generated image
of a screen, layout, or concept is often the fastest reactable artifact").
Quiz cut from After Implementation by owner decision — Explainer and
Learnings remain. Validates 16/16.

## Open before promotion

- During Implementation and After Implementation (explainer/learnings)
  phases have no simulation or real-run coverage yet.
- Description overlap with ideate is intentional (scout replaces it) but the
  two will coexist in the index during transition — decide the deprecation
  sequence (ideate description pointing to scout, or immediate removal).
- Icon asset paths in agents/openai.yaml resolve only after promotion into
  plugins/dots/skills/ (they point at ../../assets/).
- Eval suite (.scout/evals.json) not yet authored — round 1+2 scenarios are
  ready-made seeds; ideate's 6 eval pins should be ported where they still
  apply (spine-with-reasoning, vague-agreement gate, plain-language build
  confirmation, no-files-while-ideating → no-product-code-while-scouting).
- One real (non-simulated) scouting session before leaving wip/.
