# Scout — Simulation Round 1 (2026-07-06)

Nine simulated conversations (3 scenarios x scout/ideate/wayfinder) plus one
adversarial skill-doctor static review, all against scout v2 (the first
best-practices draft). Full transcripts lived in the session scratchpad;
this file records the scoreboard and what changed in v3.

## Scenarios

1. **Notifications** — mixed unknown types: channel preference (Interview),
   codebase state (Recon), digest-layout taste (Prototype), email
   deliverability/compliance (Blindspot). Small-to-medium effort.
2. **"Make it feel calmer"** — taste-dominant dashboard redesign; verbal
   interviewing fails by design; one high-value Interview question (CEO on
   phone) hidden underneath.
3. **REST→tRPC migration** — too big for one session; forgotten partner-API
   landmine; session break + cold-start collaborator (Ana); auth question
   genuinely unanswerable until a pilot lands (fog).

## Scoreboard (v2)

| | S1 notifications | S2 taste | S3 migration |
|---|---|---|---|
| **scout** | all 4 unknowns resolved; 1 mild frustration (taste detour); ceremony ~1 turn | all PASS, 0 frustration; triage preempted the trap | all PASS except collaborators (improvised); pacing rule had to be ignored |
| **ideate** | all resolved; 1 frustration (taste detour); compliance save was agent talent, not skill text | recovered via Diverge but only after frustration event | landmine caught via Grounding; state survival hung on a last-second save consent |
| **wayfinder** | all resolved; 3 frustration events, ceremony FAIL (one-ticket rule on a small effort) | all resolved; 2 skill-induced momentum stops | best-in-class durability/parallelism; landmine catch was luck (no mandated recon at charting) |

Cross-cutting: every skill eventually resolves taste via concrete options,
but only a triage rule prevents the wasted verbal probe. Durable state wins
scenario 3; conversation-first wins scenarios 1-2; scout's scale-adaptive
ledger covered both.

## Skill-doctor review (v2): 76% overall

16/16 validation, clean payload hygiene. Key findings: [P1] one-item-per-
session throttle contradicts one-move-per-turn cadence; [P1] no cross-session
re-entry point for the big-mode map; [P2] Interview-vs-Converge boundary
undefined; [P2] cute headings; [P2] missing fenced templates for Converge and
the build gate; [P3] fog causal claim, duplicated file-write exception,
"foggy" jargon in description.

## v3 changes

1. Taste/look/feel/content defaults to `Prototype`; one vague verbal answer
   is confirmation, not a reason to probe (S1 detour, both skills).
2. Recon pre-check: name the evidence the source should contain before
   dispatching (S2 wasted dispatch); "flag anything structurally unusual" in
   the output shape (it caught the S3 landmine).
3. Removed the per-session item cap; replaced with update-after-each-settled-
   item durability plus a natural stopping condition (S3 + doctor P1).
4. Cross-session re-entry: reopen the map file first when work resumes
   (doctor P1).
5. Parallel collaborators: disjoint scopes, claims noted in the map (S3).
6. Converge-vs-Interview rule + fenced Converge template; fenced build-gate
   block matching ideate's (doctor P2).
7. Plain headings (Destination, Ledger, Triage, Moves, Closing); ledger
   scaffold no longer front-loaded on turn 1; fog graduation reworded; file-
   write exception single-sourced; description de-jargoned (doctor P2/P3).

## Open items

- Family-level split documented, not resolved: scout's Interview is
  one-question-at-a-time (grill heritage, live discovery); clarify batches
  (upfront gate). Intentional; do not "fix" one to match the other.
- Before promotion: reverse handoffs (clarify/ultraplan/ideate → scout),
  eval suite (.scout/evals.json), behavior of two independent sessions
  against the same map slug, real (non-simulated) scouting session.
## v3 confirmation rerun (scenario 1)

All six criteria PASS, zero frustration events (v2: one event, criterion 4
PARTIAL). The Prototype-by-default triage rule preempted the taste trap; the
compliance unknown was correctly held in fog (T2) and graduated to a
blindspot pass (T4). Residual friction, observed and deliberately NOT fixed
(one variable at a time; both match designed family behavior):

- Converge table is slightly heavy for an opening exchange — the text already
  scopes it to "several viable directions"; watch in real usage.
- The build gate restated scope after "just build it" against a just-accepted
  closing ledger — one turn of process, consistent with ideate's designed
  gate and its eval pins; watch whether real usage finds it redundant.
