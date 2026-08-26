# Generate synthetic cases

Use synthetic data only when real evidence is unavailable or leaves a named
coverage gap. A generated example is a hypothesis until a qualified human
accepts its realism.

1. State the failure hypothesis and dimensions that vary around it.
2. Generate a small, diverse set of dimension combinations and ask the user to
   reject impossible or irrelevant combinations.
3. Create structured truth—identifiers, relationships, permissions, dates, and
   constraints—deterministically with a stable seed.
4. Generate natural-language fields separately so style variation cannot alter
   the underlying facts.
5. Validate factual consistency, fit, distinctness, privacy, label leakage, and
   prompt-injection risk.
6. Materialize only accepted data and record generator identity, seed, source
   dimensions, and hashes.

Prefer broad coverage of the named dimensions over arbitrary wording diversity.
Do not infer production prevalence from synthetic frequencies. Route accepted
cases through [Case design](case-design.md) before adding them to a suite.
