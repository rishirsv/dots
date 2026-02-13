# Working Notes

- Story: 11.0: Extract and fully clean Project Emerald - Simulated Report 2025.pdf
- Last attempt: Ran strict single-file extraction + strict source-text export, rebuilt output from exact source-text-backed lines, regenerated selected-lines/render-trace/section-map/section-accounting together, completed review checklist, and reran provenance + gates.
- Result: PASS. Verification command passed and review status set to `pass` with page-level montage evidence.
- Next approach: Move to the next remaining PRD story and repeat strict extraction -> full cleanup -> artifact sync -> provenance + gates.
- Gotchas: If selected lines are pruned/reassigned, `section_candidate` in `selected-lines.jsonl` must match final render sections or `section_completeness` will fail.
