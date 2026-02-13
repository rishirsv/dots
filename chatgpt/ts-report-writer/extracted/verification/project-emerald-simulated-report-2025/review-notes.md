# Verification Notes: project-emerald-simulated-report-2025

- Source file: `Project Emerald - Simulated Report 2025.pdf`
- Reviewer: `codex-autopilot`
- Review status: `pass`
- Review date: `2026-02-13`

## Checklist

- [x] Reviewed full montage PNGs against extracted markdown
- [x] Confirmed body text is captured appropriately
- [x] Confirmed table text is excluded
- [x] Confirmed image-derived text is excluded
- [x] Confirmed legal/footer/navigation noise is excluded
- [x] Completed source-to-extraction coverage map
- [x] Ran `scripts/qa_provenance.py` and reviewed results
- [x] Ran `scripts/qa_gates.py` and confirmed all gates passed

## Notes

- Source-text references reviewed:
  - `source-text/pdf/page-073.txt`, `page-079.txt`, and `page-083.txt` reconciled to retained EBITDA/capex narrative lines in `# Executive Summary`; visual confirmation completed against `montage-09.png` and `montage-10.png`.
  - `source-text/pdf/page-089.txt`, `page-090.txt`, and `page-091.txt` reconciled to retained compensation/commission lines; visual confirmation completed against `montage-10.png` and `montage-11.png`.
  - `source-text/pdf/page-092.txt` and `page-094.txt` reconciled to retained labor-rate and broker-commission notes; visual confirmation completed against `montage-11.png`.
- Source-text mismatch count: `0`.
- OCR evidence reviewed: OCR was not used (`OCR_USED=false`), no OCR-backed lines rendered.
- Provenance QA result: `pass` (`extracted/verification/project-emerald-simulated-report-2025/qa/provenance.json`).
- Gate QA result: `pass` (`extracted/verification/project-emerald-simulated-report-2025/qa/gates.json`).
- Final decision: `pass`.
