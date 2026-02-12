# AGENTS: KPMG Slidegen FDD Resume Instructions

This file is the authoritative handoff protocol for `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd` work.

## Goal
Build and calibrate `dist/kpmg-slidegen-fdd` so it can map FDD inputs to compliant layouts, compile to the legacy generator shape, and produce high-quality outputs benchmarked against Project North.

## Mandatory Read Order (Do Not Skip)
1. Read `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/spec-kpmg-slidegen-fdd.md`
2. Read `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/progress.md`
3. Execute only the next unchecked action from the phase tracker.

## Mandatory Write Protocol
Update `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd/progress.md`:
1. At the end of each phase.
2. Before any pause, handoff, or potential context compaction.
3. With exact file paths changed.
4. With exact commands run.
5. With the next 3 concrete actions.

## No-Loss Handoff Checklist
Always include the following in the latest progress entry:
1. Current phase and subphase.
2. Locked decisions and defaults.
3. Open blockers/risks.
4. Next command to run.

## Locked Decisions
1. Checkpoint files are in `/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen/docs/kpmg-slidegen-fdd`.
2. Canonical log is `progress.md`.
3. Baseline quality corpus is Project North (all 80 slides).
4. Dist strategy is a full runtime snapshot under `dist/kpmg-slidegen-fdd`.
5. Template scope for V1 is `kpmg-diligence` only.

## Working Rules
1. Keep edits scoped to `kpmg-slidegen`.
2. Do not modify `templates/kpmg-diligence/**` in root unless explicitly approved.
3. Implement runtime changes inside `dist/kpmg-slidegen-fdd/runtime/**`.
4. Favor deterministic rules and explicit validation over heuristic freeform behavior.
