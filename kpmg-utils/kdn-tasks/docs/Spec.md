# Feature Specification: KDN Task Writer

**Feature Branch**: `feat/kdn-task-writer-spec`  
**Created**: Initial draft

## Background
KDN supports financial due diligence work overnight. Associates provide initiation emails and nightly tasking, while KDN returns deliverables for morning review. Instructions today vary in structure, causing ambiguity. This feature standardizes how a user dictates tasks and how the system produces clear, execution‑ready instructions and a send‑ready email, leveraging uploaded attachments.

## Problem
Unstructured instructions create rework and delays. Users need a consistent way to convert free‑form dictation and files into precise task packets organized by workstream, with explicit inputs, outputs, checks, and file locations. The system must also set project defaults via the initiation email and reference daily input/output folders for handoffs.

## Objectives / Goals
- Produce a send‑ready initiation email including project defaults (Deal Preferences) and links to the input and output folders.
- Generate per‑workstream task packets with inputs, steps, checks, deliverables, naming, and save locations.
- Ingest and use user‑uploaded attachments (Excel/Word/PDF/CSV/TXT, images, and email files) and use them to add context to the task packets.
- Ask compact clarifying questions only when required information is missing or the user is unclear about the task. Need to act like a KDN associate and anticipate any potential questions of the task and clarify with the user so the KDN associate can complete the task (i.e. all requirements are present and clear and self-contained)
- Outline where the KDN associate may need to make assumptions in completing the 
- Avoid internal rationale or speculative content; instructions only.

## User Scenarios & Testing

### User Story 1 — Initiation (Priority: P1)
As an associate, I provide core deal details and upload key files; the system returns a send‑ready initiation email with a “Deal Preferences” section and links to the KDN input and output folders, plus initial task packets.

Acceptance Scenarios:
1. Given core details and attachments, when I request initiation, then the system outputs an email body and initial task packets referencing the specified folders.
2. Given missing details, when I request initiation, then the system returns a short list of questions and draft sections filled where possible.

### User Story 2 — Nightly Tasks (Priority: P1)
As an associate, I dictate nightly tasks and upload new files; the system produces updated task packets and directs KDN to a new daily folder under inputs/outputs for that night’s work.

Acceptance Scenarios:
1. Given a list of tasks and files, when I run the tool, then each workstream has a packet with inputs, steps, checks, and save locations under the correct daily folder.
2. Given conflicting file references, the system normalizes references or asks to confirm.

### User Story 3 — Attachment Use (Priority: P2)
As an associate, I upload spreadsheets and documents; the system reads them and incorporates relevant ranges/tabs into inputs and checks.

Acceptance Scenarios:
1. Given an Excel file, when processed, then referenced tabs and ranges appear in the packet.
2. Given a PDF support file, then the packet cites the document and the extracted elements it relies on.

### Edge Cases
- Missing or ambiguous folder links for inputs/outputs
- Attachments with inconsistent naming/versions
- Duplicate workstream names
- Large or password‑protected files
- Tasks that reference unavailable files

## Requirements (mandatory)
- Accept user free‑form instructions plus multiple attachments (xlsx, xlsm, csv, docx, pdf, txt, png, jpg, eml, msg).
- Generate two outputs per session:
  - Send‑ready email including: project summary, Deal Preferences (defaults for the deal), links to input and output folders, and workstream bullets.
  - Per‑workstream task packets that include: Objective, Inputs (files, tabs, ranges, links), Steps (numbered, concrete), Acceptance Checks, Deliverables, Naming & Save Location, Edge Cases & Decision Rules, Questions (only if required information is missing).
- Folder conventions:
  - Inputs folder name: `On-shore Inputs`
  - Outputs folder name: `KDN Outputs`
  - Users create a new daily subfolder under each with the exact naming `YYYY-MM-DD` (note: maintain this ISO format for sorting consistency).
  - Instructions must reference the specific daily folders for that night’s work.
- Knowledge base: include templates for initiation email, nightly task packets, a writing/style guide for numbers and bullets, and a detailed instruction prompt. Derive style from the sample instructions file in the KDN folder; ensure outputs only reference KDN.
- Implementation target: “cloud skill / custom GPT” that can read user‑uploaded files and apply the templates reliably.
- No internal planning or chain‑of‑thought in outputs; instructions only.

## Architecture (high level)
- Input: user prompt + attachments
- Processing: extract project defaults from initiation; parse attachments (tab names, ranges, control totals); apply templates
- Output: 1) email body; 2) task packets per workstream
- Storage/Refs: paths/links for inputs/outputs and daily folders are treated as parameters and echoed in outputs

## Alternatives & Trade‑offs
- Custom GPT only: simplest setup; relies on built‑in file reading. Recommended.
- Claude cloud skill: filesystem‑anchored SKILL.md with templates. Good for local workflows.
- Hybrid (“cloud skill / custom GPT”): consistent templates shared across assistants; added maintenance overhead.

## Success Metrics
- Packets accepted with <5% rework due to ambiguity in the first month
- Setup time for initiation kept under a few minutes

## Dependencies
- Availability of project folder links for inputs and outputs
- Access to uploaded files (no password protection)

## Risks
- Attachment parsing variability (merged cells, PDFs)
- Folder link inconsistencies across projects

## Support Plan
- Provide example prompts and sample outputs
- Include a quick reference for folder setup and naming
- Add a lightweight validator to flag missing inputs/links before sending

## References
- Spec authoring guidance: `tools/spec.md`
- Research summary: `tools/kdn-task-writer/docs/research-spec_kdn_task_writer.md`
- Similar skill structure: `tools/kdn-task-writer/examples/internal-comms/SKILL.md`
- Example formats: files in `tools/kdn-task-writer/examples/internal-comms/examples`
