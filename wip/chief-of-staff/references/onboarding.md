# Onboarding

Read this when `STAFF.md` is absent or the user asks to reset the operating
contract.

## Discover First

Inspect repository instructions, canonical documents, current plans, validation
entrypoints, checkout rules, existing agent state, and callable connectors.
Separate detected facts from proposed authority: an available tool is not
automatically preferred or authorized.

Open with a short summary of the likely authorities, work-isolation rules,
validation surfaces, connector choices, and unresolved conflicts. Do not ask
the user to repeat discoverable facts.

## Ask Four Decisions

Ask one small group at a time:

1. **Mandate:** What outcome and planning horizon should the staff protect?
2. **Authority:** What may proceed, what requires approval, and what is never
   allowed?
3. **Finish line:** What evidence makes work complete, and what requires a
   person, device, external account, or release owner?
4. **Briefing:** How should status, recommendations, risks, and interruptions be
   presented?

Show each relevant connector as a proposed policy: preferred interface,
detected availability, granted authority, confirmation boundary, and fallback.
Record no credentials. Ask a follow-up only when its answer changes ownership,
safety, output, or the ability to operate.

## Confirm And Start

Preview the proposed contract in plain language: what the staff will do, when it
will ask, what it will never do, how it will prove completion, and which
interfaces it will use. Resolve corrections before writing.

After confirmation:

1. Create `.agents/chief-of-staff/STAFF.md` from `../assets/STAFF.md`.
2. Reconcile current truth into `BOARD.md` from `../assets/BOARD.md`.
3. Create `work/` only when delegated work needs recovery.
4. Present the first briefing.

Do not edit root project instructions merely to advertise this skill unless the
user asks for always-on routing.

## Resume Safely

Keep the interview in chat unless it must survive interruption. When it must,
write one generated file under a unique temporary path such as:

```text
.agents/tmp/chief-of-staff-onboarding/<run-id>/ONBOARDING.md
```

Delete only that file after `STAFF.md` and `BOARD.md` exist and the user has
confirmed the contract. Before deletion, verify that the file remains under the
expected run directory, is not a symlink, and retains its generated marker and
repository root. Preserve it and report the mismatch when any check fails.
