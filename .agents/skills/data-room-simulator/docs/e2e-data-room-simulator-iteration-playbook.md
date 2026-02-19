# E2E Iteration Playbook

## Loop

1. Pick a case from `e2e/cases/`.
2. Run one case:
- `python3 scripts/e2e_run_case.py --case e2e/cases/<case>.json`
3. Review `run-summary.json`, `verification_report.json`, `INDEX.md`.
4. Log issues and hypotheses in `docs/reviews/`.
5. Implement targeted fix.
6. Re-run same case.
7. Run full set:
- `python3 scripts/e2e_run_all.py`
8. Confirm aggregate summary has no regressions.

## What to Record in Review Notes

- Problem observed
- Root-cause hypothesis
- Change made
- Post-change result
- Any follow-up action
