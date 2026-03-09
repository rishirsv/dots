## Observed model response (verbatim)

No — I did **not** look at a **term map `.yml`**.

For this run I only used the SPA `.docx` text itself and the extraction rules, so there was **no external “authoritative list” of expected terms** to validate against. If a term map YAML exists (even a simple list of “must-catch” terms like Indebtedness, Cash, Leakage, etc.), I can use it in two ways:

1. **Pre-check:** treat the YAML as the expected universe of terms and ensure each appears in the extracted output (flagging misses immediately).
2. **Post-check:** scan the Definitions section for quoted terms and compare against the YAML (to catch formatting quirks like `"Indebtedness" of any Person means…`).

If you upload the term map `.yml` (or paste it), I’ll wire it into the validation step so this class of miss gets flagged automatically even if the drafting style changes.

## Concrete formatting example (excerpt; derived from local `.docx` in `reference/`)

From `reference/1376-6710-5562-v1-Project Thunderstruck - Share Purchase Agreement - Draft to LCL.docx`:

- `para 329`: `“Indebtedness” of any Person means, without duplication:`
- `para 330`: `all obligations of such Person for borrowed money or with respect to deposits or advances of any kind;`
- `para 331`: `all obligations of such Person evidenced by bonds, debentures, notes or similar instruments;`

Observation: the definitional trigger (`means`) is present, but it is separated from the quoted term by an intervening phrase (`of any Person`) and the definition body continues as subsequent paragraphs/bullets after a colon.
