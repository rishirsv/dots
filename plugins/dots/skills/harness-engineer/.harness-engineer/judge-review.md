# judge-review.md

## Overall Judge Review Score: 93 / 100

- Discovery: 92% (11 / 12)
- Implementation: 87% (13 / 15)
- Validation: 100% (16 / 16)
- Payload hygiene: pass
- Source edits: none

## Scope Inspected

- `plugins/dots/skills/harness-engineer/SKILL.md`
- `references/assessment-lenses.md`
- `references/control-matrix.md`
- `references/task-state.md`
- `references/codex-thread-evidence.md`
- `assets/assessment-template.md`
- `assets/task-state-template.md`
- `agents/openai.yaml`
- `scripts/check_harness_links.py`
- `scripts/harness_snapshot.py`
- Comparison reference: `plugins/dots/skills/self-improve/SKILL.md`

## Verdict

The skill remains concise, routable, and operationally useful. The new Codex
thread evidence guidance borrows the right evidence-ordering and triage
mechanics from `self-improve` while mostly preserving the harness boundary: it
repeatedly limits use to repo-scoped controls and routes personal/global/skill
lessons back to `self-improve`.

The main improvement needed is not conceptual scope; it is execution safety.
`codex-thread-evidence.md` now depends on sibling `self-improve` commands and
local Codex state, but it does not say what to do if that skill/script is
unavailable or commands drift, and it leaves validation selection a bit
scattered across the top-level skill, control matrix, and scripts section.

## Discovery

Strong description: the trigger names a concrete recurring job, "repo-scoped
controls," and gives realistic examples such as `AGENTS.md maps`, command maps,
setup scripts, validation checks, CI/test hooks, and source/generated routing
(`SKILL.md:3`). It also has explicit exclusions for ordinary feature work, broad
docs cleanup, PR publication, global memory mining, and skill authoring
(`SKILL.md:3`). The only weakness is that the frontmatter trigger leans on
house terms like "repo-scoped controls"; the body and agent prompt recover this
with natural phrases such as "agent-ready," "reduce handholding," and
"future-agent usability" (`SKILL.md:54-55`, `agents/openai.yaml:7`).

| Dimension | Reasoning | Score |
|---|---|---:|
| Specificity | Names the exact object: repo controls that help agents "understand, run, validate, resume, and safely finish work" (`SKILL.md:3`). | 3 / 3 |
| Completeness | Says when to use it and when not to use it in frontmatter, then reinforces `self-improve` boundaries in the body (`SKILL.md:12-18`, `SKILL.md:145-147`). | 3 / 3 |
| Trigger Term Quality | Strong examples, but "repo-scoped controls" is more internal than user language; the body adds natural triggers like "is this repo agent-ready?" (`SKILL.md:54-55`). | 2 / 3 |
| Distinctiveness / Conflict Risk | Distinct from `self-improve`, skill authoring, docs cleanup, and ordinary implementation (`SKILL.md:16-18`, `control-matrix.md:28`). | 3 / 3 |

Total: 11 / 12.

## Implementation

Strong runtime shape: three modes (`assess`, `prepare`, `control`) have concrete
steps and outputs, and references are loaded only when needed (`SKILL.md:20-34`,
`SKILL.md:50-128`). The references/templates/scripts are coherent: assessment
lenses cover repo maps, runtime legibility, feedback loops, boundaries, handoff,
and entropy (`assessment-lenses.md:6-81`); the control matrix cleanly chooses
prose vs mechanical surfaces (`control-matrix.md:5-76`); task state defines a
resumable ledger (`task-state.md:6-82`); templates mirror those contracts. Main
weakness: thread-evidence guidance imports `self-improve` commands without an
availability/drift fallback, and validation guidance is present but distributed.

| Dimension | Reasoning | Score |
|---|---|---:|
| Conciseness | Top-level `SKILL.md` is 162 lines and uses references for detail; no broad tutorial bloat. | 3 / 3 |
| Actionability | Modes give ordered steps and output contracts; scripts provide concrete commands for snapshot and link checking (`SKILL.md:40-48`, `SKILL.md:59-128`). | 3 / 3 |
| Workflow Clarity | Main path is clear, but `codex-thread-evidence.md` says to run from `plugins/dots/skills/self-improve/` and lists sibling commands without saying what to do if unavailable (`codex-thread-evidence.md:25-45`). | 2 / 3 |
| Progressive Disclosure | Good reference split: broad assessment, control placement, task state, thread evidence, and templates are all opt-in (`SKILL.md:20-34`). | 3 / 3 |
| Directive Quality | Mostly directive and plain. The thread-evidence reference correctly says "Do not use it for broad personal learning" and routes to `self-improve` (`codex-thread-evidence.md:3-6`), but "Avoid `dream` and `skill-audit` here unless..." leaves a slightly porous boundary (`codex-thread-evidence.md:43-45`). | 2 / 3 |

Total: 13 / 15.

## Payload Hygiene

Payload hygiene: pass.

Scanned terms/classes with `rg -n --hidden -S`: `self-improve`,
`state_5.sqlite`, `session_index`, `rollout_path`, `memories`, `memory`,
`dream`, `skill-audit`, `Codex`, provider/model names, raw URLs, TODO/FIXME,
`/Users/rishi`, `thread`, `rollout`, `workbench`, and `AGENTS.md`.

Allowed hits:

- `self-improve` is an explicit boundary/runtime dependency, not contamination
  (`SKILL.md:16-18`, `control-matrix.md:28`, `codex-thread-evidence.md:43-45`).
- `~/.codex/state_5.sqlite`, `rollout_path`, and memory paths are needed because
  this reference is specifically about Codex thread evidence
  (`codex-thread-evidence.md:10-23`).
- `AGENTS.md`, CI, hooks, scripts, and docs are the core harness-control surfaces
  (`SKILL.md:104-119`, `control-matrix.md:16-29`).
- No raw private transcript text, thread IDs, rollout IDs, source URLs, one-off
  report paths, TODO/FIXME markers, or unrelated provider names were found in the
  shipped skill payload.

Finding: none blocking. The exact `self-improve` command list is acceptable as a
runtime dependency, but should get an availability guard.

## Validation Notes

| Check | Result | Notes |
|---|---|---|
| `plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/harness-engineer --json` | Pass | 16 / 16, validation 100%. |
| `python3 scripts/check_harness_links.py --root plugins/dots/skills/harness-engineer` | Pass | Checked 7 Markdown files; no missing local links. |
| `python3 -m py_compile .../check_harness_links.py .../harness_snapshot.py` | Pass | No syntax errors. |
| `python3 scripts/harness_snapshot.py --root plugins/dots/skills/harness-engineer --json` | Pass | Emitted structured snapshot and discovered helper scripts. |

Validation guidance is sufficient for normal use, but could be stronger for
control edits by adding a compact validation-selection table. Current guidance
is split across `SKILL.md:40-48`, `SKILL.md:118-119`, `SKILL.md:151-162`,
`control-matrix.md:24-26`, and `task-state.md:43-52`.

## Prioritized Findings

1. P1: Add an availability/fallback rule for borrowed `self-improve` evidence
   commands.

Rule: Runtime guidance should be executable and should not make agents infer
missing dependency behavior.

Evidence: `codex-thread-evidence.md` says to run from
`plugins/dots/skills/self-improve/` and lists `self_improve.py` commands
(`codex-thread-evidence.md:25-37`), but gives no fallback if that sibling skill
or script is absent.

Recommended source change: In `references/codex-thread-evidence.md`, add a short
"Availability" paragraph before Commands:

> If `self-improve` or `scripts/self_improve.py` is unavailable, do not recreate
> broad session mining in this skill. Use the current conversation and repo
> files only, mark prior-thread evidence unavailable, and route the user to
> `self-improve` when broad session evidence is required.

2. P2: Tighten the broad-mode boundary around `dream` and `skill-audit`.

Rule: Preserve trigger meaning and avoid overlap with adjacent broad
self-improvement workflows.

Evidence: The reference says "Avoid `dream` and `skill-audit` here unless the
user explicitly asks for broad self-improvement" (`codex-thread-evidence.md:43-45`).
That is close, but it still implies the harness skill might run broad
self-improvement modes.

Recommended source change: Replace that paragraph with:

> Do not run `dream` or `skill-audit` from this skill. If the user asks for broad
> self-improvement, stop and route to `self-improve`; return to
> `harness-engineer` only for a selected repo-scoped control.

3. P2: Consolidate validation guidance for common harness-control edits.

Rule: Validation guidance should tell the agent which check proves the control
works.

Evidence: The skill says to run the "cheapest reliable deterministic validation"
(`SKILL.md:118`) and report validation evidence (`SKILL.md:162`); script
guidance covers Markdown link checks (`SKILL.md:44-46`); `task-state.md` defines
verification maps (`task-state.md:43-52`). These are good, but agents still have
to assemble the validation matrix themselves.

Recommended source change: Add a short table to `control-matrix.md` after the
Placement Table:

- `AGENTS.md` / Markdown docs / plans -> run `check_harness_links.py` on touched
  files.
- Setup or command-map changes -> run the documented command or mark it
  candidate with reason.
- Helper scripts -> run `py_compile` plus the script's narrowest sample command.
- Tests/hooks/CI controls -> run the targeted test/lint/build check, and state
  any CI-only gap.
- Generated/source boundary controls -> run the generator/check command or
  report the missing mechanical guard.

4. P3: Keep the top-level skill concise; do not move the thread-evidence detail
   into `SKILL.md`.

Rule: Progressive disclosure is working and should be preserved.

Evidence: `SKILL.md` keeps the front door short and routes optional details
through references (`SKILL.md:20-34`). The templates and references are cleanly
separated (`assessment-template.md:1-43`, `task-state-template.md:1-61`).

Recommended source change: None to the top-level structure. Apply the above
edits in references only.

## Concrete Recommended Source Changes

1. Edit `plugins/dots/skills/harness-engineer/references/codex-thread-evidence.md`
   to add the availability/fallback paragraph before `## Commands`.
2. Edit the `dream` / `skill-audit` paragraph in the same file to hard-route
   broad self-improvement to `self-improve`.
3. Edit `plugins/dots/skills/harness-engineer/references/control-matrix.md` to
   add a compact validation-selection table.
4. After approval and edits, run:
   - `plugins/meta-skill/scripts/metaskill validate plugins/dots/skills/harness-engineer --json`
   - `python3 plugins/dots/skills/harness-engineer/scripts/check_harness_links.py --root plugins/dots/skills/harness-engineer`
   - `python3 -m py_compile plugins/dots/skills/harness-engineer/scripts/check_harness_links.py plugins/dots/skills/harness-engineer/scripts/harness_snapshot.py`
