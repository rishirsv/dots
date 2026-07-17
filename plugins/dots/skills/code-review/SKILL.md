---
name: code-review
description: "Reviews and fixes changed code after coding tasks for correctness, reuse, quality, and efficiency; reviews plans and writes repo/subsystem audit documents without implementation. Use for code review or audit; not for blank-slate planning, architecture-primary scans, PR publication, or external review comments."
---

# Code Review

## Default Posture

Choose one route from the user's target and the current task:

- **Post-coding or current-diff review**: review all changed files, fix every
  confirmed in-scope issue, simplify the implementation, validate the edits,
  and return the completed result.
- **Explicit report-only review or plan/spec review**: analyze and report.
  Never modify source or silently rewrite the artifact.
- **Audit**: inspect the explicit repo or subsystem target, always write the
  audit document, and never action its findings.

Changed-code review always combines **Correctness Review** with the three
Simplify lanes:
* **Agent 1: Code Reuse Review**
* **Agent 2: Code Quality Review**
* **Agent 3: Efficiency Review**

Always aim to simplify changed code while preserving intended behavior. Apply
code judo: seek a more direct design that removes incidental complexity instead
of rearranging it. Look for whole branches, helpers, modes, conditionals, or
layers that can disappear. Keep the work bounded to the captured change;
Architecture Review owns broad structural candidate discovery and new seam
design.

## 1. Capture Scope

Read applicable repository instructions and review guidance before judging the
change.

Use [Audit Mode](references/audit-mode.md) when the user asks to audit a repo,
subsystem, package, branch, or category beyond a changed-code scope. Audit Mode
is always document-only.

When the user supplies an existing plan, spec, or roadmap, review that artifact
instead of a git diff. Flag speculative future-proofing, redundant phases, and
compatibility ladders without a named boundary. Read
[hard-cut-policy.md](../../references/hard-cut-policy.md) when the artifact
changes schemas, contracts, persisted state, routing, configuration, migrations,
or compatibility paths. Blank-slate planning belongs to the planning workflow.

For changed code, choose exactly one target:

- **Named PR**: the PR's diff is the only review scope — local working-tree
  changes are out of scope. Read PR metadata for intent and surrounding code
  from the matching checkout or PR branch.
- **Named branch, base, commit, range, or paths**: pin the fixed point first.
  Confirm that the ref resolves, then review only the explicit scope. For a
  branch, compare from its merge base with the named or configured base.
- **Current local changes**: inspect `git status --short --untracked-files=all`,
  the staged diff, and the unstaged diff. Include untracked source files.

Naming paths only narrows the captured scope. Post-coding and current
local-change reviews still use the review-and-fix default when paths are named.
Standalone PR, branch, commit, range, or historical path reviews are report-only
unless the user requests fixes and the writable scope is clear.

If a post-coding review has no git changes, review the most recently modified
files that the user mentioned or that were edited earlier in the task. For any
other empty scope, state that it is empty; do not silently substitute an
upstream diff, `main`, or the latest commit.

Review every changed file. Read the entire file, not just diff hunks, when
correctness, reuse, ownership, or structural quality depends on surrounding
context. Read other repository code to establish behavior or find an existing
owner, but do not turn unchanged code into a cleanup target unless a changed
line requires the supporting edit.

## 2. Run Correctness Review And The Three Simplify Lanes

Read [review-checklists.md](references/review-checklists.md) for every
changed-code review. It contains the full Correctness Review and three Simplify
lane checklists. Run every lane; do not replace them with a generic cleanup
pass.

For Direct review, the parent performs Correctness Review and all three Simplify
lanes directly. For Deep review, launch the three Simplify lanes concurrently
when subagents are available and pass each lane the complete diff, changed-file
list, applicable repository guidance, allowed surrounding paths, and user focus.
The parent performs Correctness Review while they run. If subagents are
unavailable, the parent applies all three lane checklists directly; no lane may
be skipped.

Use review depth only to scale Correctness Review and candidate verification:

- **Direct**: the parent performs one focused Correctness Review for ordinary
  diffs and narrow plan reviews.
- **Deep**: add independent correctness or risk-specific finders plus fresh
  verification for broad diffs, high-risk behavior, repeated misses, or an
  explicit exhaustive request. Schemas, persisted state, cross-process
  contracts, auth, billing, security, concurrency, and migrations usually
  justify Deep.

When the user explicitly requests independent reviewers and multi-agent tools
are unavailable, state that independence cannot be provided and offer a direct
Deep pass instead. A clean review may return no findings; depth never creates a
finding quota.

Use only the checklist's conditional angles that match the scope. If the user
supplied a focus area, weight it heavily, but still report or fix any other
material issue you can defend.

In a diff review, reject pre-existing issues, intentional behavior changes,
nitpicks without concrete cost, and problems on unchanged code unless the diff
introduced or exposed the failure. Treat deterministic lint, type, formatting,
and build failures as validation results rather than review findings unless
they reveal a deeper defect.

### Finding Bar

Report only material findings. Prefer one strong finding over several weak
ones.

A correctness or adversarial candidate must answer:

1. What can go wrong?
2. Why is this code path vulnerable?
3. What is the likely impact?
4. What concrete change would reduce the risk?

For plan review, substitute the cited decision, step, or contract for
`code path`.

A cleanup candidate must identify the exact duplication, quality problem, or
inefficiency; its concrete maintenance or runtime cost; and the smallest
behavior-preserving correction.

State material inference explicitly; reject unsupported concerns.

## 3. Verify Candidates

Finders return candidates only, never edits or file dumps, and return
`no findings` when clean. Use a fresh verifier for every high-impact or
uncertain candidate in Deep review. The verifier challenges the cited context
and returns `supported`, `refuted`, or `unresolved`.

Verify for recall, not just precision. Treat a candidate as `supported` or
`unresolved` by default; reach `refuted` only when the code itself makes it
constructible. A realistic runtime state is not grounds to refute: concurrency
races, nil/undefined on a rare-but-reachable path (error handler, cold cache,
missing optional field), falsy-zero treated as missing, an off-by-one on a
boundary the code does not exclude, retries or partial failures, or a
regex/allowlist that lost an anchor all stay in scope. Refute only when the
code proves it wrong: factually inaccurate (quote the actual line), provably
impossible (cite the type, constant, or invariant), already handled in this
change (cite the guard), or pure style with no observable effect.

The parent checks the cited source, merges duplicates, and classifies every
candidate:

- **Confirmed**: evidence establishes a reachable failure or concrete
  maintenance/runtime cost. In the post-coding route, this must be fixed.
- **Needs verification**: a missing runtime, configuration, data-shape, or
  product fact prevents confirmation. State the exact check that would resolve
  it.
- **Rejected**: pre-existing, intentional, impossible, already handled,
  duplicated, tool-only, stylistic without observable cost, false positive, or
  not worth addressing.

Do not present Rejected candidates as findings. In the post-coding route, note
skipped false positives or not-worth-addressing candidates briefly and move on.

## 4. Action The Route

### Post-Coding Or Current-Diff Review

Before behavior-adjacent fixes:

1. Name the behavior that must remain true.
2. Identify the narrowest tests or commands that prove it, and run a baseline
   when the cleanup could alter behavior.
3. Add the narrowest characterization test first when critical behavior is
   untested, or move the candidate to `Needs verification`.

Aggregate all lane results and fix every Confirmed issue directly. Apply the
smallest change that resolves the mechanism and passes the checklist's cleanup
acceptance bar. Keep edits in the parent unless isolated, disjoint write scopes
are available.

Use a hard cut only when the canonical contract is established and the old path
is confirmed obsolete. Otherwise classify the compatibility path as
`Needs verification`. Once eligible, follow
[hard-cut-policy.md](../../references/hard-cut-policy.md).

### Report-Only Or Plan Review

Return Confirmed findings and `Needs verification`; do not edit. Do not turn a
plan review into plan creation or implementation.

### Audit

Follow [Audit Mode](references/audit-mode.md). Write its document and stop.
Audit findings are never implemented during the audit run.

## 5. Validate

After post-coding fixes, run the narrowest relevant tests, typecheck, lint, or
build. Inspect the resulting diff for unintended changes and rerun the lane
whose finding caused each material edit.

For report-only work, run checks when they materially confirm a high-risk
candidate or establish review status. Audit Mode allows only read-only,
side-effect-free checks.

## Output

For post-coding review, report:

- `Fixed`: correctness issues and simplifications applied
- `Skipped`: false positives or changes not worth making, with brief reasons
- `Needs verification`: exact unresolved checks
- `Validation`: commands and results
- `Residual risk`: only what remains material

If no fixes were needed, confirm that Correctness Review and all three Simplify
lanes were clean.

For report-only diff or plan review, order Confirmed findings by severity: P0
blocker, P1 high, P2 medium, P3 low. Use:

```markdown
### [P1] One-sentence issue — <location>

- **Evidence and mechanism:** what the change does and why it fails or creates
  concrete maintenance/runtime cost.
- **Failure scenario or cost:** the reachable failure or observable cost.
- **Smallest safe fix:** the direct correction.
```

Use `path/file.ext:123` for repository artifacts. For a pasted plan, spec, or
roadmap, use its section, step, or decision label. List `Needs verification`
separately. If clean, state the reviewed scope and say
`no findings confirmed`.

Audit Mode owns its document format and chat handoff.

Post inline or pull-request comments only when the user explicitly asks. An open
pull request is review context, not authorization to write externally. Do not
hand off to PR publication, CI repair, or existing review-comment workflows.
