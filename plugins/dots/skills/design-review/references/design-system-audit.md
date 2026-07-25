# Design-System Audit

Trace one product surface through its governing design sources and report only
proven conformance defects. Source can establish system drift; rendered or user
evidence is still required for experiential claims.

## Select And Trace

Honor the user's scope. For a broad repository, select one deployable
application and one coherent surface family representing a primary task.

Start from the surface's route or composition and trace imports, props,
resolved configuration, token aliases, CSS inheritance, generated artifacts,
primitives, variants, and shared components. Repository proximity, similar
names, or repeated values do not prove a runtime connection.

Exclude previews, configurators, legacy systems, enterprise variants, and other
applications unless the traced path consumes them.

## Reconstruct The Local System

Inspect current repository guidance, `DESIGN.md` or equivalent, tokens, themes,
component APIs, and surface-local design documentation. A source governs the
audit only when evidence shows it is current and applies to this surface.
Drafts, migrations, proposals, and task lists describe future intent unless
explicitly accepted.

Record:

```markdown
## Design Language
- Audited surface:
- Governing sources:
- Runtime owners and consumers:
- Binding decisions:
- Explicit exceptions:
```

Write `None documented` for exceptions unless a cited source names one.
Absence of formal design documentation is not a finding; use proven local
owners and conventions.

## Generate Candidates

Inspect only dimensions connected to the traced surface and governing contract:

- flow shape, terminology, hierarchy, and disclosure;
- typography roles and tokens;
- color roles, themes, and contrast;
- spacing, sizing, layout, and responsiveness;
- primitives, variants, states, forms, icons, and assets;
- explicit accessibility or motion rules.

Load detailed doctrine only when the contract makes that dimension material:

- [spacing.md](../../design/references/spacing.md)
- [typography.md](../../design/references/typography.md)
- [color.md](../../design/references/color.md)
- [interaction-design.md](../../design/references/interaction-design.md)
- [motion-audit.md](motion-audit.md)

Classify a candidate as:

- **missing owner:** a reusable rule belongs in the system but has no owner;
- **one-off implementation:** an existing owner should be used;
- **contract mismatch:** the implementation contradicts a binding decision;
- **documented exception:** intentional and not a finding.

Search hits, repetition, omissions, arbitrary values, and implementation
differences create candidates, not findings.

## Prove Each Finding

Keep a candidate only when all three proofs exist:

1. **Contract:** cite a binding decision for this property and scope, or a
   direct contradiction in presentation or copy within the same task.
2. **Runtime:** prove the cited owner, value, or behavior reaches the audited
   surface.
3. **Correction:** state one change required by the evidence, naming the
   existing token, primitive, variant, component, or governing rule when one
   exists.

Reject the candidate when the evidence supports several corrections, the
intended rule is ambiguous, the proposal invents product intent, or the primary
problem is functional behavior rather than design-system conformance.

Source can prove token, type, color, spacing, copy, component, variant,
responsive-presentation, and explicit contract violations. Hierarchy,
discoverability, usability, perceived coherence, and motion feel require
rendered or user evidence.

Exclude accessibility semantics, broken routes, data wiring, actions,
performance, architecture, and general code quality unless the user requested
that scope or a binding design contract governs it.

## Falsify And Report

Re-open every cited source and implementation. Delete a candidate when:

- the cited rule does not govern this property or surface;
- counterevidence makes the difference valid;
- the implementation was misread;
- the correction remains ambiguous;
- another finding already describes the root cause.

Report:

1. the reconstructed design language;
2. findings that survived contract, runtime, correction, and falsification;
3. the first improvement to make;
4. claims that still require rendered evidence.

Return a positive-null result when no candidate survives. Finish only when each
finding names the governing owner, traced consumer, exact correction, and
falsifier checked.
