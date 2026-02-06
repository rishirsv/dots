# Industry Coverage Matrix (FDD scope)

This project treats `INDUSTRY` as the **target operating industry** that drives SoW scope insertion.

## Current supported `INDUSTRY` keys (before Top-15 expansion)

From `dist/scope-library.json` (industry modules present):

- `construction`
- `eyecare`
- `healthcare`
- `hvac`
- `manufacturing`
- `prof_services`
- `real_estate`
- `service`
- `supermarket`
- `tech`
- `transportation`

## Added Top-15 operating industries (this expansion)

New `INDUSTRY` keys:

- `retail`
- `banking`
- `insurance`
- `telecomm`
- `aerospace`
- `building` (construction/contracting-oriented)

Fallback-only key:

- `generic` (common skeleton only; no industry module)

## Notes / caveats

- The original library was synthesized from real samples for 11 industries; the new industries are initial coverage and should be reviewed/curated.
- For `generic`, the generator inserts the common skeleton only.

