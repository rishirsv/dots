# Module-Level Docs

Use language-native doc systems first. Add Markdown only when a directory boundary, package workflow, or local concept needs human context.

## Use Module Docs When

- a directory/package has a stable responsibility that is not obvious from filenames
- public/exported APIs need usage context
- the module has invariants, side effects, ordering constraints, or failure modes
- there are local workflows such as codegen, tests, fixtures, migrations, or data contracts
- future agents need boundaries before editing

## Prefer Code-Near Docs

| Language/ecosystem | Prefer |
|---|---|
| Python | module/class/function docstrings; local README only for workflows/boundaries |
| Go | package comments and exported declaration comments |
| Rust | crate/module/item docs with examples where appropriate |
| TypeScript | typed comments for exported APIs; README for package-level workflows |
| JavaScript | comments where generated API docs or type hints rely on them |

## Local Module README Shape

Use only when the directory boundary needs human orientation.

- Purpose and ownership
- When to edit this module
- Public/exported API or entry points
- Key files and responsibilities
- Invariants and forbidden couplings
- Local commands/tests/codegen
- Examples
- Failure modes and debugging signals
- Links to generated docs or API references

## Writing Rules

- Keep module READMEs short; 30-120 lines is usually enough.
- Do not repeat obvious filenames.
- Document public contracts and non-obvious internals, not every private helper.
- Include local validation commands.
- Link upward to architecture docs for cross-module boundaries.
- Delete stale local docs when source structure changes.
