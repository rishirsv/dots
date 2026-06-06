# Context Format

Use a context or glossary doc only when the session resolves durable project-specific language.

## Shape

```md
# <Context Name>

<One or two sentences describing what this context covers.>

## Language

**<Canonical Term>**
<One or two sentences defining what it is.>
_Avoid_: <rejected synonym>, <rejected synonym>
```

## Rules

- Define what the thing is, not how it is implemented.
- Include only project-specific language, not generic programming concepts.
- Prefer one canonical term and list rejected synonyms under `_Avoid_`.
- Keep definitions tight.
- Group terms only when natural clusters emerge.
- If a repo already has its own glossary, context, concepts, or domain-doc format, use that instead of this format.
