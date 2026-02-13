# Working Notes

- Story: 6.0: Extract and fully clean Project Coffee_buy side_FDD (Consumer & Retail - F&B).pptx
- Last attempt: Ran isolated strict pipeline extraction and strict `scripts/extract_source_text.py` export for the Coffee F&B report; also attempted LibreOffice PDF conversion fallback.
- Result: Blocked. Source is unreadable/encrypted (`File is not a zip file` from extractor; `source file could not be loaded` from soffice).
- Next approach: Move to the next incomplete story; this story requires an unlocked/decryptable source file before retrying.
- Gotchas: This failure mode matches prior encrypted Office blockers and cannot be fixed with cleanup/QA steps.
