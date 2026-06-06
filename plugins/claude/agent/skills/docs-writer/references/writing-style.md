# Writing Style

Use these stylometric rules at runtime. They are constraints for new prose, not a reason to rewrite untouched sections.

## Voice And Posture

- Use active voice by default.
- Use imperatives for procedures: `Run`, `Set`, `Verify`, `Rollback`.
- Use second person sparingly and only when it helps the reader act.
- Use neutral third person for system behavior: `The sync script rebuilds...`.
- Avoid unsupported reassurance: `simply`, `just`, `obviously`, `safe`, `guaranteed`, `easy`.

## Density

- Put the fast path before rationale.
- Use one idea per paragraph.
- Prefer tables for repeated path/command/status patterns.
- Prefer bullets for scan paths and prose for rationale.
- Keep new paragraphs to 1-4 sentences.

## Sentence Shape

- Aim for 12-22 words in new explanatory prose.
- Split sentences over about 28 words unless matching local style.
- Use short imperative steps in procedures.
- Avoid nested clauses when a table or second sentence is clearer.

## Heading Shape

- Preserve existing heading depth and casing.
- Use practical noun headings: `Quickstart`, `Configuration`, `Rollback`, `Validation`, `Known Gaps`.
- Do not use clever headings.
- Avoid duplicate sibling headings.
- Do not create an H1 if the file already has one.

## Evidence Posture

| Evidence state | How to write |
|---|---|
| Verified in source or command | Write declaratively and include command/path when useful. |
| Supported by generated spec/schema | Link or name the generated source of truth. |
| User-stated in session | Write only if durable and in scope; preserve as decision or convention. |
| Inferred | Label as inferred, or omit if not necessary. |
| Unverified but material | Mark `Unverified` or leave as an open question. |
| Conflicting | Do not choose silently. Record conflict in handoff or `Known Gaps`. |

## Examples

- Include the smallest runnable example that proves behavior.
- Pair commands with expected success signals.
- Prefer real paths and env var names over placeholders.
- Avoid synthetic examples when source examples exist.
- For destructive or state-changing commands, include preconditions and rollback.

## Document-Specific Tone

| Doc type | Tone |
|---|---|
| `README.md` | welcoming, fast path first, practical |
| `AGENTS.md` | terse, imperative, rule-shaped |
| `ARCHITECTURE.md` | stable, explanatory, boundary-focused |
| `DESIGN.md` | concrete sensory language plus token precision |
| Runbook | operator-safe, sequential, rollback-aware |
| API docs | reference-like, explicit about contracts and failure modes |
| Migration notes | caution-first, version-specific, validation-heavy |
| Module docs | local, minimal, code-near |

## Drift Control

- When adding a section, scan nearby headings for stale duplicates.
- Delete placeholders before handoff.
- Remove or update commands that no longer match code.
- Do not leave two docs explaining the same owner concern differently.
