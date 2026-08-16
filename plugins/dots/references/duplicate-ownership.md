# Duplicate Ownership

Read this when the same rule, contract, default, validation, transformation, or
state appears to have more than one owner.

## Classify Before Changing

Define the audit target by feature, contract, package, or file set.

- **Duplicate policy:** the same business or product rule is owned in more than
  one layer.
- **Local duplication:** nearby code repeats one stable operation.
- **Boundary adapter:** one owner translates vendor, wire, persisted, or
  untrusted data at a real seam.
- **Domain constraint:** security, path, runtime math, or presentation logic is
  correctly local to its domain.

Search for behavior, not matching words: duplicated validation and defaults,
runtime repair of trusted state, persisted and runtime shapes joined by glue,
query or cache code re-owning policy, differently named helpers with the same
semantics, thin wrappers hiding a second path, and copied serializers or hash
inputs.

## Choose The Owner

For each real duplicate, name:

1. severity and classification;
2. the exact rule and why this is duplication rather than a valid boundary;
3. every current owner;
4. the single winning owner;
5. the paths to delete; and
6. any boundary adapter that genuinely remains.

Prefer the owner that gives callers a small interface, concentrates behavior
and verification in one place, and matches the repository's architecture.
Apply the deletion test: if removing a module makes complexity vanish, it was a
pass-through; if the complexity spreads back across callers, the module was
earning its keep. Keep translation at a real external, persisted, or untrusted
boundary even when only one adapter exists.

Tests should exercise the winning interface. Do not retain tests for a losing
owner or add a mediator, fallback, shim, or dual path between competing owners.

If the canonical owner cannot be established from the requested scope, report
the competing evidence and route the broader decision to Architecture Review.
