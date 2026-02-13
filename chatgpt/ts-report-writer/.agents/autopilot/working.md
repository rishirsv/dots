# Working Notes

- Story: 9.0: Extract and fully clean Project Ed_buy side_FDD (IGH - Education).pptx
- Last attempt: Ran strict single-file pipeline extraction and strict `scripts/extract_source_text.py` export for `reports/Project Ed_buy side_FDD (IGH - Education).pptx`.
- Result: Blocked. Source file is `CDFV2 Encrypted`; source-text extraction fails with `File is not a zip file`, preventing cleanup and fail-closed QA completion.
- Next approach: Wait for unlocked source replacement (unencrypted `.pptx` or `.pdf`), then rerun extraction + full cleanup + QA gates.
- Gotchas: `pipeline run` can finish while manifest marks report `blocked`; always confirm with `file <report>` and explicit `extract_source_text.py` output.
