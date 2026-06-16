# Capture Patterns

Read this when an alignment session produces a doc brief, approved doc update, term, context note, PRD/spec input, decision record candidate, or unresolved decision that should be recorded.

## Glossary Or Context Note

Use for settled shared language. Keep it implementation-light unless the existing context file explicitly includes implementation notes.

```md
## <Term>

Definition: <canonical meaning in this domain>.

Use when: <boundary or scenario where this term applies>.

Do not use for: <nearest overloaded or rejected meaning>.

Notes:
- <source of truth, caveat, or related term>
```

If the repo has a different glossary format, follow it instead. Preserve existing headings and ordering.

## Decision Note

Use when the decision matters but does not justify a formal decision record.

```md
## <Decision or Topic>

Decision: <settled outcome>.

Why: <one to three sentences explaining the trade-off or constraint>.

Implications:
- <what future work should do differently>
- <what remains out of scope>
```

## PRD Or Requirements Input

Use for product-facing decisions. Follow the repo's existing PRD or requirements format when one exists.

```md
## <Feature or Product Area>

Problem: <user/customer problem being solved>.

Users: <who is affected>.

Goals:
- <outcome or behavior that should become true>

Non-goals:
- <explicitly excluded behavior>

Requirements:
- <observable product requirement>

Success criteria:
- <how the team will know it worked>

Open questions:
- <question, recommended default, and what it blocks>
```

## Spec Or Design Input

Use for system-facing decisions. Follow the repo's existing spec or design-doc format when one exists.

```md
## <System or Capability>

Scope: <what this spec covers>.

Current behavior: <what code/docs show today>.

Proposed behavior: <settled behavior or recommended default>.

Interfaces and data:
- <API, schema, state, event, or dependency>

Constraints:
- <compatibility, migration, performance, security, or operational constraint>

Verification:
- <test, check, acceptance case, or evidence needed>

Open questions:
- <question, recommended default, and what it blocks>
```

## Decision Record Candidate

Offer a decision record only when the choice is hard to reverse, surprising without context, and based on a real trade-off. Use the repo's existing decision-record format if it has one; do not force the label ADR.

```md
# <Short Decision Title>

Status: Proposed

Date: YYYY-MM-DD

## Context

<Problem, constraints, and why the decision was needed.>

## Decision

<The chosen path.>

## Alternatives Considered

- <Alternative>: <why not>
- <Alternative>: <why not>

## Consequences

- <Positive or intended consequence>
- <Trade-off, cost, or follow-up>
```

Use `Accepted` only when the user or repo convention clearly treats the decision as final. Otherwise use `Proposed` and call out what remains unresolved.

## Unresolved Term Or Decision

Do not bury ambiguity. Keep unresolved language visible and action-oriented:

```md
## Unresolved: <Term or Decision>

Current working meaning: <best provisional definition>.

Open question: <the question that would settle it>.

Recommended default: <the recommended answer if the team needs to proceed>.

Blocked decisions: <what should wait until this is resolved>.
```

## Capture Checklist

Before editing docs:

- Tie the note to a settled user answer, existing code/docs evidence, or a clearly labeled provisional default.
- Use canonical terms consistently.
- Separate facts from recommendations.
- Keep implementation details out of pure glossary/context entries.
- Link or mention affected code/docs only when the destination normally carries evidence.
- Report the exact path changed and any follow-up sync or validation the repo requires.
