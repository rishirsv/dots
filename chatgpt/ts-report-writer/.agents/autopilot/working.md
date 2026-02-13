# Working Notes

- Story: 5.0: Extract and fully clean Project Cinema Report.pdf
- Last attempt: Ran single-report strict extraction and strict source-text generation, then rebuilt Cinema markdown/mapping/render artifacts from exact source-backed lines with full cleanup filters and completed review notes.
- Result: Success; provenance and all fail-closed gates passed, and review marked `pass`.
- Next approach: Move to the next incomplete story and repeat isolated single-report extraction with full cleanup before QA.
- Gotchas: Provenance pass alone is insufficient; `cleanup_quality` in `qa_gates.py` can still fail on short trailing fragments, so fragment filtering is required before final gate run.
