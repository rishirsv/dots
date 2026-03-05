# Section contract standard

Use this pattern for all current and future section contracts.

## Required headings (in this order)

1. `Table of contents`
2. `Core Principles`
3. `Writing guidance`
4. `Layout`
5. `Available slot shapes`
6. `Render skeleton`
7. `Common mistakes (and fixes)`
8. `Structural preflight rules (must pass)`
9. `Split policy rules`
10. `Full example`

## Authoring rules

- Keep cross-section rules in `global-writing-conventions.md`.
- Put writing guidance before shapes.
- Treat slot shapes as available tools, not mandatory sequence.
- Use one adaptive layout with complexity-based scaling rules.
- Define `Block slot map` inside `Layout` so slot combinations are explicit per block.
- Add short adaptation examples when helpful.
- Include at least one complete example at the target standard length.
- Keep all prose inside `Render skeleton` and `Full example` in active voice with complete sentences.
- Do not include line references or research citations in final contract text.

## Slot shape pattern

Each slot definition should include:
- purpose
- recommended use cases
- target length
- placeholder behavior
- whether a source note is recommended

## Layout pattern

For the `Layout` section, define:
- target length range
- required section blocks
- scaling rules (when to keep concise vs expand)
- block slot map (suggested slot combinations per block)

## Contract quality bar

A strong contract should let a model generate compliant output with minimal ambiguity.
If a rule can be interpreted two ways, rewrite it to be deterministic.
