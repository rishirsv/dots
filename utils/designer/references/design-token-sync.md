# Design token sync

Use this to keep `.design/theme.md` accurate before iterative UI design.

## Goal

Capture the project's current design system exactly as implemented.

## Required extraction scope

Extract and include full raw values from:
- CSS variable definitions (`:root`, theme selectors, data-theme blocks)
- Global stylesheets (`globals.css`, `index.css`, app-level styles)
- Theme/config files (for example `tailwind.config.*`)
- Theme provider/token source files

Capture at minimum:
- Color tokens and semantic roles
- Typography (families, sizes, weights, line heights)
- Spacing scale
- Radius and border tokens
- Shadow/elevation tokens
- Breakpoints/layout tokens
- Motion tokens (durations/easing) if defined

## Output rule

In `.design/theme.md`:
- Include source file paths.
- Include full relevant file contents in code blocks.
- Avoid inferred values when raw values are available.
- Add a short "last synced from source" note.

## Refresh rule

Refresh `.design/theme.md` whenever:
- theme files change
- new design iteration starts on a different area
- visual mismatches suggest token drift
