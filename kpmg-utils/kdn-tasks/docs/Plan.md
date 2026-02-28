```md
# Plan: Base Functions for KDN Task Writer

## Purpose & Outcomes
The base functions initiative standardizes how the assistant ingests KGS-style overnight tasking and outputs KDN-ready instructions. After completing this work, an associate can dictate notes plus upload supporting files and immediately receive (a) a send-ready email with Deal Preferences and folder links, and (b) per-workstream task packets that mirror the rigor seen in KGS threads (inputs, steps, tie-outs, QC guidance). This plan explains every edit needed so a new contributor can implement, validate, and extend the functionality without prior repo knowledge.

## Inputs & Acceptance Criteria
- **Spec**: `/gpts/kdn-task-writer/docs/specs/spec-base-functions.md`
- **Knowledge sources**: KGS Threads (`KGS Thread *.md`), bullet extracts (`kgs_thread_*_bullets.txt`), consolidated task summary (`kgs_task_comprehensive.md`), templates (`email_template.md`, `style_guide.md`).
- **Acceptance**:
  1. Assistant can produce initiation or nightly emails that include Deal Preferences, On-shore Inputs/KDN Outputs links, and nightly `YYYY-MM-DD` subfolders.
  2. Generated task packets include Objective, Inputs (with file/tab/range), Steps, Acceptance Checks, Deliverables, Save Paths, Edge Cases, and Questions (only when info missing).
  3. Attachment references from Excel/PDF/etc. are surfaced in outputs.
  4. System evaluates instructions before sending, confirming clarity and tie-outs (evaluation log captured).
  5. Repository reorganized so KGS reference material lives under `docs/kgs-reference/` (threads, bullet summaries, consolidated doc) for easy onboarding.

## Assumptions / Needs Confirmation
- Attachment parsing relies on platform-provided file reader; no custom parser needed.
- No authentication/secret management required beyond referencing provided folder links.
- Evaluation results can be stored alongside generation context (e.g., appended to the output or logged internally). If a persistent log is required, clarify storage format/location.

## Context and Orientation
**Language**: Markdown templates + prompt engineering (platform-specific, no executable runtime).  
**Key Files**:
- `/gpts/kdn-task-writer/kdn_system_prompt.md` — current skill definition.
- `/gpts/kdn-task-writer/email_template.md` — email body template.
- `/gpts/kdn-task-writer/style_guide.md` — tone/formatting rules.
- `/gpts/kdn-task-writer/docs/specs/spec-base-functions.md` — authoritative requirements.
- `/gpts/kdn-task-writer/docs/examples/KGS Thread *.md` — raw reference emails.
- `/gpts/kdn-task-writer/docs/examples/kgs_thread_*_bullets.txt` — extracted task bullets.
- `/gpts/kdn-task-writer/docs/examples/kgs_task_comprehensive.md` — consolidated catalog of KGS workflows.

## High-Level Plan of Work
1. **Documentation & Repository Hygiene** — create `docs/kgs-reference/` and move KGS threads, bullet files, and consolidated summary there; update references.
2. **Template & Knowledge Enhancements** — weave lessons from KGS tasks into reusable instruction blocks and guardrails inside `kdn_system_prompt.md`.
3. **Attachment & Source Referencing** — implement routines that cite file/tab/range info extracted from uploads.
4. **Instruction Evaluation Layer** — embed the mandatory self-QA step before outputs ship.
5. **Roadmap & Validation Assets** — add plan for ongoing improvements plus tests/examples.

## Milestones & Tasks
### Phase 1: Repository Reorganization & Context Surfacing
- [ ] 1.0 Create `docs/kgs-reference/threads/`, `docs/kgs-reference/bullets/`, and `docs/kgs-reference/summaries/`.
  - [ ] 1.1 Move each `KGS Thread X.md` into `docs/kgs-reference/threads/` and update any paths cited in the repo.
  - [ ] 1.2 Move `kgs_thread_*_bullets.txt` into `docs/kgs-reference/bullets/`.
  - [ ] 1.3 Relocate `kgs_task_comprehensive.md` (and future comprehensive docs) into `docs/kgs-reference/summaries/`.
  - [ ] 1.4 Update `kdn_system_prompt.md` (and any other files) to point to the new locations so contributors know where to find references.
- [ ] 1.5 Document folder structure inside a short README (`docs/kgs-reference/README.md`) describing how to use the threads, bullet files, and summary during prompt writing.

### Phase 2: Template & Task Packet Enhancements
- [ ] 2.0 Enhance `email_template.md` to explicitly include Deal Preferences, On-shore Inputs/KDN Outputs, and nightly folder placeholders per spec.
  - [ ] 2.1 Add instructions for referencing `YYYY-MM-DD` subfolders in both email and task packets.
- [ ] 2.2 Update `kdn_system_prompt.md` Role/Process sections to require internally drafting the checklist, selecting initiation vs nightly template, and using the style guide.
- [ ] 2.3 Create a “task block library” section (either within `kdn_system_prompt.md` or a new helper file) capturing repeatable structures for:
  - roll-forward IS/BS
  - adjustment database builds
  - payroll/census pivots
  - KPI builds
  - WC aging & recon tasks
  - vendor/GL schedule construction.
- [ ] 2.4 Define metadata schema so each task packet includes Objective, Inputs, Steps, Checks, Deliverables, Save Path, Edge cases, and Questions (if needed); encode this in `kdn_system_prompt.md` instructions.

### Phase 3: Attachment & Source Referencing Logic
- [ ] 3.0 Implement guidance (within `kdn_system_prompt.md`) on parsing uploaded files:
  - [ ] 3.1 Excel: capture file name, tab, key range/control total.
  - [ ] 3.2 PDF/Doc: cite section/page references where data used.
  - [ ] 3.3 Images/Emails: summarize relevant content succinctly.
- [ ] 3.4 Add guardrails ensuring each task references both the source artifact and the acceptance check (tie to Combined BS, net debt, etc.).
- [ ] 3.5 Document how to handle ambiguous or missing file references (ask concise questions, normalize naming).

### Phase 4: Evaluation Layer & QA Routines
- [ ] 4.0 Design an evaluation checklist (clarity, data availability, tie-outs, unanswered questions) and embed it as a mandatory “Evaluation” step inside `kdn_system_prompt.md`.
  - [ ] 4.1 Ensure outputs reflect evaluation results (e.g., “Evaluation: ✅ coverage confirmed”).
- [ ] 4.2 Provide guidance on raising blocking issues back to the user when evaluation fails.
- [ ] 4.3 Add sample evaluation log entries in `examples/` for both initiation and nightly scenarios.

### Phase 5: Roadmap, Validation & Examples
- [ ] 5.0 Update or create an examples folder entry showing a full initiation flow and nightly flow referencing the new templates and evaluation step.
- [ ] 5.1 Document a roadmap aligning future improvements (e.g., automated snippet insertion, source reference validators) with recurring KGS patterns; place in `docs/kgs-reference/roadmap.md`.
- [ ] 5.2 Define manual validation steps (see below) and capture them in `docs/VALIDATION.md` for reuse.

## Concrete Steps / Commands
1. Create reference directories and move files (run from repo root):
     mkdir -p gpts/kdn-task-writer/docs/kgs-reference/{threads,bullets,summaries}
     mv gpts/kdn-task-writer/KGS\ Thread*.md gpts/kdn-task-writer/docs/kgs-reference/threads/
     mv gpts/kdn-task-writer/kgs_thread_*_bullets.txt gpts/kdn-task-writer/docs/kgs-reference/bullets/
     mv gpts/kdn-task-writer/kgs_task_comprehensive.md gpts/kdn-task-writer/docs/kgs-reference/summaries/
2. Edit templates and skill file:
     $EDITOR gpts/kdn-task-writer/email_template.md
     $EDITOR gpts/kdn-task-writer/kdn_system_prompt.md
3. Add new README/roadmap/validation files as described.
4. Run repo formatting or linting if applicable (currently Markdown-only — no build step).

## Validation & Acceptance Tests
- **Initiation scenario**: Craft a sample prompt with deal details + attachments; confirm output email includes Deal Preferences, correct folder links, initial task packets referencing block library, and evaluation summary.
- **Nightly scenario**: Use a prompt that references multiple workstreams (roll-forward, payroll, KPI); ensure each packet cites the right inputs, steps, tie-outs, and save paths.
- **Attachment citation**: Upload a sample Excel file and check that generated packet references file name and tab; repeat with PDF.
- **Evaluation failure**: Provide ambiguous instructions (missing folder links) and verify assistant asks clarifying questions instead of sending incomplete packets.

## Idempotence & Recovery Guidance
- File moves can be rerun safely; use `git status` to verify results.
- Template updates are standard Markdown edits; revert via `git checkout -- <file>` if needed.
- Evaluation checklist is declarative—editing the instructions is safe/repeatable.

## Artifacts & Evidence (to capture during execution)
- Updated folder tree under `docs/kgs-reference/`.
- Diffs for `email_template.md`, `kdn_system_prompt.md`, README, roadmap, validation doc.
- Sample outputs stored in `examples/` demonstrating initiation/nightly workflows.

## Interfaces & Dependencies
- `kdn_system_prompt.md` must expose:
    - Role & Process instructions covering initiation vs nightly detection.
    - Checklist requirement, template usage, attachment parsing, evaluation step.
- `email_template.md` / task packet schema must include placeholders for Inputs/Outputs folder links, daily subfolder, and evaluation note.
- Reference docs live under `docs/kgs-reference/` for quick onboarding.

## Surprises & Discoveries
Track any nuances discovered (e.g., attachment parsing limits) here during implementation; update the plan accordingly.

## Decision Log
- Decision: Use `docs/kgs-reference/` to centralize KGS source material.  
  Rationale: Simplifies onboarding and keeps knowledge synchronized with templates.

## Outcomes & Retrospective
Populate after implementation to document what shipped, remaining gaps, and lessons learned relative to the spec goals.
```
