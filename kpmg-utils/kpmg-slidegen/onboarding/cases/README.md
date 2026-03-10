# Onboarding Cases

Each case folder will eventually follow this shape:

```text
onboarding/cases/<case-id>/
  intake.json
  extract.raw.json
  extract.normalized.json
  fingerprint.json
  classify.json
  candidate.layout.json
  candidate.deckSpec.json
  candidate.primitive.json
  candidate.builder.js
  review.md
```

`classify.json` follows `onboarding/cases/classification.schema.json` and fails closed:
- `recommendedPrimitiveRef` is `null` when the best score is zero, below threshold, or ambiguously tied
- `requiresManualSelection` tells the operator whether an explicit primitive choice is required before scaffold
- `rankedAlternatives` preserves the sorted candidates for review

`candidate.primitive.json` and `candidate.builder.js` are only used when the case is creating a new primitive.

Scaffold choices:

1. Existing primitive reuse: `--primitive-ref <primitive@version>`
2. Extend an existing primitive: `--new-primitive-id <id> --base-primitive-ref <primitive@version>`
3. New primitive from the classified closest match: `--new-primitive-id <id>`

Primitive-first lifecycle:

1. `onboard:extract`
2. `onboard:classify`
3. `onboard:scaffold`
4. `onboard:render`
5. `onboard:compare`
6. `onboard:promote`
