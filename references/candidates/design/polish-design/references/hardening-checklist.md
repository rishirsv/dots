# Hardening checklist

Use this file when `polish-design` is asked to harden a UI, make it production-ready, or when resilience issues are material.

## Operating stance

- Prioritize breakage over beauty.
- Test the interface against real-world variance, not ideal demo data.
- Prefer systematic fixes over one-off patches.

## Check these areas

1. States
2. Overflow and long content
3. Responsive behavior
4. Inputs and validation
5. Async and network failure
6. Permissions and read-only modes
7. Dense data and unusual shapes
8. Internationalization sensitivity

## Minimum hardening sweep

Validate:

- loading, empty, error, and success states
- long titles, labels, names, and descriptions
- very short and missing values
- small mobile widths and large text scaling
- touch targets and keyboard access
- retry and recovery paths for async failures
- disabled and permission-restricted states
- wrapping and truncation inside flex and grid layouts

## Escalate when present

Treat these as high priority:

- content overlaps, spills, or disappears
- missing state handling for important flows
- actions that fail silently
- forms without useful validation feedback
- layouts that break on mobile or zoom
- fixed-width controls that assume English-only copy
- UI that becomes unusable with long or missing data

## Fix direction guidance

- prefer flexible layout over brittle fixed dimensions
- use logical wrapping, truncation, and min-width rules where needed
- add explicit recovery and retry affordances
- preserve user input through error states when possible
- make state changes obvious and reversible where appropriate
- ensure resilience fixes do not introduce visual clutter
