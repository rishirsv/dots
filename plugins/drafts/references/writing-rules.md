# Writing Rules

Use this reference when writing rules affect a Drafts output.

## Source Of Truth

Drafts v1 does not maintain a separate Drafts rule database. Writing rules come
from:

- Applicable `AGENTS.md` files.
- The user's explicit instructions in the current session.
- Draft, section, channel, and style constraints when they are part of the
  current artifact or selected style.

Rule sources are always considered. Apply non-conflicting rules, resolve
conflicts explicitly, and do not put rule sources in artifact frontmatter.

## Rule Layers

Apply rules in this order:

```text
AGENTS.md guidance
-> user instructions
-> style guidance
-> channel recipe
-> document_contract constraints
-> session or draft-specific instructions
```

Later layers can specialize earlier layers, but conflicts must be surfaced.

## Enforcement Types

Classify each rule:

- `generative`: The model should try to follow the rule.
- `deterministic`: A validator can check the rule after generation.
- `hybrid`: The model should try, then a validator should verify.

Do not promise deterministic enforcement for a generative-only rule.

## Conflict Handling

When rules conflict:

1. Name the conflict.
2. Prefer the user's latest explicit instruction when it does not violate a
   higher-priority policy or approval gate.
3. Preserve AGENTS.md guidance unless the user asks to change reusable writing
   guidance.
4. Record the assumption or ask when the choice changes the artifact.

## update_writing_rules

Use `update_writing_rules` when the user provides reusable writing guidance
that should apply beyond the current draft or session.

Flow:

1. Decide whether the guidance is reusable or only applies to the current
   artifact.
2. If reusable, propose a concise AGENTS.md addition or edit.
3. Explain where it should go and why.
4. Edit AGENTS.md only after explicit user approval.
5. Report the changed guidance and how it will affect future Drafts work.

Do not silently update AGENTS.md. Do not create a parallel Drafts rules surface.

## Validation

For deterministic or hybrid rules:

- Check banned phrases, required labels, formatting constraints, length caps,
  and required sections when feasible.
- Report any rule that could not be checked.
- Fix in-scope failures before handing off.

For generative cleanup:

- Say the rule was applied as a writing pass, not mechanically guaranteed.
- Use a follow-up validator when the user needs certainty.
