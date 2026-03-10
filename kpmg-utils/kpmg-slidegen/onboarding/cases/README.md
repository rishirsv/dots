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

`candidate.primitive.json` and `candidate.builder.js` are only used when the case is creating a new primitive.

Primitive-first lifecycle:

1. `onboard:extract`
2. `onboard:classify`
3. `onboard:scaffold`
4. `onboard:render`
5. `onboard:compare`
6. `onboard:promote`
