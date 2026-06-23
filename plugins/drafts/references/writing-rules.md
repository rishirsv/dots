# Writing Rules

Use this reference when writing rules affect a Drafts output.

## Rule Layers

Apply rules in this order:

```text
global rules
-> workspace rules
-> style rules
-> channel rules
-> document_contract rules
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
3. Preserve durable rules unless the user asks to change them.
4. Record the assumption or ask when the choice changes the artifact.

## Validation

For deterministic or hybrid rules:

- Check banned phrases, required labels, formatting constraints, length caps,
  and required sections when feasible.
- Report any rule that could not be checked.
- Fix in-scope failures before handing off.

For generative cleanup:

- Say the rule was applied as a writing pass, not mechanically guaranteed.
- Use a follow-up validator when the user needs certainty.
