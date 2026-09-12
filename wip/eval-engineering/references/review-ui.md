# Build the Review Workspace

Use this for a local text-review surface. [Human review](review.md) owns what
feedback means, attribution, and how to turn it into agreed criteria. This
reference owns the view choices and reusable implementation. It does not
authorize new model trials, skill changes under test, or publication.

## Start with the artifact, not an empty form

Use a compact task rail, a short request strip, and a generous output-reading
area. Keep full inputs one click away in a side panel; opening context should
not push the output down the page. Put notes behind an explicit action or a
text selection. Keep review status and the next-task action visible.

Choose the view from real data:

| Available material | View | Primary action |
| --- | --- | --- |
| One output for a task | Single review | Add notes if useful, then mark reviewed |
| Two outputs for the same task and inputs | Side-by-side comparison | Prefer A, prefer B, tie, or neither, with a reason |
| Two long outputs or a narrow viewport | Focus view with A/B switching, or stacked panes | Read each output at a comfortable width, preserving the same labels |
| Long request or source context | Task details panel | Switch between the exact request and named input files |
| Whole-output or selected-text observation | Notes panel | Save an attributed note; edit or resume a draft |
| Completed or partially completed review | Review summary | See what remains; reveal identities only after blind judgments are complete |
| Missing or invalid artifact | Unavailable-output state | Resolve the run; do not infer a quality loss from missing evidence |

Three or more candidates need a deliberate pair-selection design. Do not squeeze
them into this two-pane layout or compare unrelated task IDs. Keep one shared
request/context region above the pair instead of duplicating inputs in each
pane. A/B is a per-task assignment, not a stable candidate name across tasks.

## Assemble from the copyable kit

The [review assets](../assets/review/index.html) are a starting implementation,
not a requirement to run a framework or install packages:

- `index.html`: document shell, loading state, skip link, status announcements.
- `styles.css`: shared tokens, rail, reading area, panes, panels, responsive rules.
- `components.js`: inert source-mapped Markdown and stateless view primitives.
- `app.js`: navigation, per-output drafts, notes, decisions, summary and reveal.
- `server.py`: local file access, private assignments and atomic feedback saves.
- `mock-manifest.json`: labeled synthetic fixtures using the same components.

Copy the kit into the project's private evaluation area. Generate a private
manifest from audited run artifacts, then launch the copied server. On a
macOS/Linux host with Python 3, for example:

```sh
python3 server.py --manifest /absolute/path/review-manifest.json --state /absolute/path/review-state
```

The server prints a loopback URL and records it in `server.json` under the state
directory. Open that URL in the user's preferred browser. No build step, model
API call, external font request, or network hosting is involved. The server
holds an exclusive lock: reuse the existing URL or stop that process before
starting a second server against the same state directory. This starter is
POSIX-specific because its lock uses `fcntl`; do not claim native Windows
support without replacing and checking that locking mechanism.

Restarts reuse the recorded port so browser drafts keep the same origin. If
that port is occupied, resolve the conflict rather than silently switching it.
An explicit `--port` override changes the origin; saved feedback remains on
disk, but browser-only drafts remain at the old origin.

Keep one implementation owner. Either copy/adapt this kit for the artifact or
extend an established review app; do not keep a second unmaintained viewer in
parallel. Original run evidence is not a template and must remain unchanged.

## The manifest is the view contract

The agent writes data, not a bespoke page for every task. The server validates
the manifest, reads and freezes output bytes, and creates the public view data.
Titles may be shortened for the rail; requests, source context and outputs stay
exact. Do not put review hints into the output itself.

```json
{
  "title": "Prompt quality",
  "subtitle": "Baseline comparison",
  "blind": true,
  "preview": false,
  "reviewer": "Local reviewer",
  "disclosure": "Two matched runs on the same task suite.",
  "tasks": [{
    "id": "task-01",
    "title": "Plan a small feature",
    "request": "The exact task request",
    "context": [{"name": "context.md", "text": "The exact source text"}],
    "questions": ["An agreed or optional review consideration"],
    "outputs": [
      {"path": "../run-a/task-01/output.md", "sha256": "actual SHA-256", "identity": "Candidate one", "run_id": "run-a", "trial_id": "task-01"},
      {"path": "../run-b/task-01/output.md", "sha256": "actual SHA-256", "identity": "Candidate two", "run_id": "run-b", "trial_id": "task-01"}
    ]
  }]
}
```

Use one `outputs` entry for single review. Output paths resolve against the
manifest directory; record actual content hashes, not the example placeholders.
For mocks only, set `preview: true` and use `text` instead of `path`/`sha256`.
Exactly one of `path` or `text` is allowed. Optional `status: "unavailable"`
renders a missing-artifact state and blocks completion. An ungradeable run
should not be represented by fabricated successful text.

The starter supports text artifacts. For workbooks, documents, images or other
binary outputs, add a native original-file link/preview and an artifact-location
comment field appropriate to that format. Do not decode a workbook as text or
build an embedded Excel editor. Keep original-file identity behind the blind
mapping where necessary.

## Component contracts and composition

Components receive data and callbacks; they do not read evaluation folders or
know candidate identities. This makes fixtures and real runs interchangeable.

| Component | Inputs | Behavior and composition |
| --- | --- | --- |
| `TaskList` | tasks, active ID, decisions, selection callback | Numbered rows with reviewed state; selected row stays distinct without depending on color alone |
| `RequestStrip` | exact request, context list, open callback | Compact visual excerpt; full request remains in the task panel |
| `OutputPane` | public output, raw flag, note count, callbacks | Equal header and body treatment for A/B; source toggle; unchanged text download; selection callback |
| `markdown` | unchanged text, raw flag | Safe headings, paragraphs, lists, emphasis, inline/fenced code; each fragment retains its original source offset |
| `dialog` | title, body, footer, variant, close guard | Native modal focus behavior; task and note variants attach to the right edge; cannot close during a protected save |
| `button`, `badge`, `icon` | label, event, variant | Shared controls and states; icons are decorative and controls carry text/accessible labels |

The controller composes the task panel, note composer/list, decision bar and
summary from these primitives. Keep draft/selection ownership in the controller
and assignment/persistence ownership on the server; do not duplicate those
rules in every component.

### Single review

Use one full-width pane with a centered 60–75-character reading measure. Show
the original response as readable text, not a summary. The footer has notes,
review status, previous task, and “Mark reviewed & next.” Marking reviewed is
explicitly not an acceptance grade. Notes are optional.

### Side-by-side comparison

Use equal-width panes with identical typography, chrome, spacing and controls.
Each has its own scroll position; do not assume unequal responses align by
paragraph number. Keep one shared request strip. Place the preference choices
and a short reason field below the pair, followed by “Save & next.” Require a
saved choice and nonblank reason to complete a paired task. Tie and neither are
first-class options, not empty states.

At laptop height, avoid a tall task masthead and a permanent full comment form:
they can leave only two paragraphs visible per pane. Keep the choice and reason
in one row where width permits. Treat insufficient reading height as a layout
defect, not as a reason to shrink the output font.

### Focus and narrow layouts

Focus switches between A and B at full reading width without changing their
assignment. Preserve notes and choice when switching. At tablet widths the
side-by-side view may stack the same labeled panes; on phones use natural page
scroll and a horizontally scrollable task list. Keep access to context, notes,
summary and the next-task action. Do not hide the only way to complete or resume
review in a desktop-only sidebar.

### Task details

The task panel contains the full request and one named tab/button per context
file. Keep these exact and source-labeled. Put review questions below the
request, not above the output or inside a permanent checklist. Omit them when
there are none. Escape/backdrop close returns the reviewer to the same artifact.

### Notes and selected text

Open notes from an output or a text selection. Show the target label and exact
quote for passage notes. Store each draft separately by its note ID and output;
starting a B note must not overwrite an unfinished A note. Show saved notes and
explicit resume actions for drafts. An untouched saved-note editor does not
create a draft. Preserve drafts through navigation, failed saves and restart by
keying them with the persisted opaque workspace ID, not the changing URL token.

The renderer retains UTF-16 source offsets on text fragments. A selection maps
its endpoints back to the unchanged source, and the server verifies the quote
at those offsets. Cross-block quotes may include original Markdown markers.
If extending Markdown support, preserve this source map or use source view for
annotation; DOM text offsets alone are not original-artifact offsets. Never
render generated HTML or execute scripts. Unsupported Markdown stays inert.

### Summary and reveal

The summary shows reviewed/unreviewed status and saved preferences, not invented
scores. Reveal is a deliberate, server-checked transition after all required
decisions are complete. Explain that reveal ends blind review. Preserve a blind
snapshot; later comments or edits are unblinded events, not replacements for
the pre-reveal evidence. A known-candidate pilot uses `blind: false` from the start.

## Blinding and persistence invariants

- Randomize assignments once per task and persist them. Use task-scoped opaque
  output IDs; do not expose candidate/run IDs, paths, content hashes, filenames
  or identity metadata in the pre-reveal payload, downloads, HTML or errors.
- Apply [review blinding](review.md#prepare-a-minimal-review-surface) to
  self-identifying content; show limitations in the manifest's disclosure rather
  than rewriting task truth.
- Bind server-side feedback to task, output, original path/hash, run/trial,
  reviewer, timestamp and blind state. Pair decisions identify both revisions.
  Keep the private manifest and state out of static routes and candidate access.
- Use revision-checked mutations instead of accepting replacement of the whole
  feedback object. Retried operations are idempotent; conflicting operation IDs
  fail. A stale tab reloads the latest state and keeps its draft for an explicit
  retry. Atomic file writes do not by themselves prevent lost updates.
- Changed artifacts start a new review revision/state directory to preserve
  [annotation attribution](review.md#bind-every-comment-to-its-evidence).
  Keep output bytes frozen for a response, and do not tell the
  user a save failed after it was committed.
- Bind only to loopback, use a per-launch URL token and same-origin POST checks,
  serve an explicit static allowlist, and keep generated text inert. Local
  access is not an authenticated multi-user service; do not expose this server
  on a network interface or use it as hosted review infrastructure.

`review-state.json` is directly agent-readable. It contains assignments,
comments, decisions, revisions, change events and any blind snapshot. The
public payload is a restricted projection, not that file. Preserve existing
user feedback when upgrading a review; historical artifacts are not disposable
fixtures. Reading feedback later does not authorize applying its suggestions.

## Mock quickly, verify the real view

Launch `mock-manifest.json` with a separate state directory. It exercises paired
outputs, focused reading, short/long content and unavailable output without new
inference. The preview label stays conspicuous and its feedback remains separate.
For an isolated component, import it from `components.js`, pass a fixture, and
use local callbacks; no server is needed for a non-persistent visual mock.

Change tokens or primitives once, then inspect every affected view with the same
fixture shapes. Prefer direct code iteration for this work-focused interface.
Use Image Gen only when visual alternatives would resolve an actual direction
choice; generated mocks are not functional proof.

Before delivery, exercise the real single/pair path and inspect desktop, laptop
height, and narrow layouts. Check request/context access, formatted/source text,
selection round-tripping (including emphasis, duplicate words and Unicode),
notes save/edit/reload, independent drafts, completion/next task, all preference
choices, unavailable output, stale-save conflicts and reveal gating. Inspect
browser data for identity leakage. Check keyboard focus and readable contrast;
do not claim full accessibility compliance from screenshots. Keep synthetic
verification comments out of human feedback and state any remaining proof gap.
