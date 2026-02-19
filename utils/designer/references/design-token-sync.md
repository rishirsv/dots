# Design token sync

Use this to keep the `Theme and Token Context` section in `docs/DESIGN.md` accurate before iterative UI design.

## Goal

Capture the project's current design system as implemented, with high signal and low context bloat.

## Required extraction scope

Extract concrete token values and the minimum supporting snippets from:
- CSS variable definitions (`:root`, theme selectors, data-theme blocks)
- Global stylesheets (`globals.css`, `index.css`, app-level styles)
- Theme/config files (for example `tailwind.config.*`)
- Theme provider/token source files

Capture at minimum:
- color tokens and semantic roles
- typography (families, sizes, weights, line heights)
- spacing scale
- radius and border tokens
- shadow/elevation tokens
- breakpoints/layout tokens
- motion tokens (durations/easing) if defined

## Output rule

In `docs/DESIGN.md` under `Theme and Token Context`:
- include source file paths per token section or subsection
- include resolved token values and semantic mapping
- avoid inferred values when raw values are available
- avoid full file dumps by default
- include token tables and focused snippets where helpful

## Excerpts rule

When a token or behavior is ambiguous, include targeted excerpts only:
- 8-30 lines per snippet
- include source path + line anchor

Do not paste entire files unless the user explicitly asks for full dumps.

## Refresh rule

Refresh the `Theme and Token Context` section in `docs/DESIGN.md` when explicitly requested and:
- theme files changed in the area being worked on
- a new design iteration starts on a different area
- visual mismatches suggest token drift
