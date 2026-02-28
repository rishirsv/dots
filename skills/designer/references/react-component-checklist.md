# React component conversion checklist

Use this checklist after converting HTML references to React components.

## Structure
- [ ] Component boundaries are modular and readable.
- [ ] No unnecessary monolithic TSX output.
- [ ] Repeated static content is extracted to a data module when useful.

## Types and contracts
- [ ] Props interface exists and uses `Readonly<...>` where appropriate.
- [ ] Placeholder names (like `StitchComponent`) are fully replaced.
- [ ] Component API is minimal and intentional.

## Styling and tokens
- [ ] Styling follows project token conventions from `docs/DESIGN.md`.
- [ ] No hardcoded hex colors in class strings unless explicitly required.
- [ ] Responsive behavior is preserved from source HTML intent.

## Accessibility and semantics
- [ ] Semantic elements are preserved or improved.
- [ ] Interactive controls have labels/names and keyboard affordances.
- [ ] Focus visibility and state feedback are maintained.

## Validation and parity
- [ ] `scripts/validate-react-component.js` passes.
- [ ] Visual parity check is complete (spacing, type scale, hierarchy).
- [ ] Deviations are documented with rationale.
