## Assumptions (so you can judge the review)

- I’m treating the extracted files under `context/dist/` as the full “current” prompt/KB for the assistant. (`context/dist/` listed in `MANIFEST.md`.) (`MANIFEST.md:L9-L20`)
- If a file is referenced but not present in `context/dist/`, I’m treating it as **missing** (not “implicitly covered”). (See routing table references vs manifest file list.) (`context/dist/system-prompt.md:L69-L80`, `MANIFEST.md:L9-L20`)
- “Reliable” means: evidence-first, no fabricated citations, and predictable structure/output (as stated in the Reliability pillar and Output Contract). (`context/dist/system-prompt.md:L11-L29`, `context/dist/output-contract.md:L7-L35`)

---

# Architecture Assessment

- **Completeness: 3/5**
  Strong coverage for **completion accounts definitions + purchase price mechanics** via the two existing playbooks (`01-definitions.md`, `02-purchase-price.md`) plus `term-map.yml`, `global-tests.md`, and a structured deliverable contract. (`MANIFEST.md:L13-L19`, `context/dist/01-definitions.md:L16-L31`, `context/dist/02-purchase-price.md:L16-L30`)
  But the **declared scope** includes true-up dispute mechanics, earnouts, reps & warranties, redlines, and roleplay, and the routing table points to playbooks `03–08` that are not included—this is a real functional gap. (`context/dist/system-prompt.md:L35-L43`, `context/dist/system-prompt.md:L69-L80`, `MANIFEST.md:L9-L20`)

- **Consistency: 2/5**
  There are multiple cross-file mismatches that will predictably cause an LLM to skip steps or apply the wrong rule:
  - `global-tests.md` says **run every test on every analysis**, and it defines **10 tests**, but `output-contract.md`’s Global Test Results section enumerates only **7 tests**, and `02-purchase-price.md` tells the model to run only a subset (“relevant”) of tests. (`context/dist/global-tests.md:L1-L4`, `context/dist/global-tests.md:L206-L296`, `context/dist/output-contract.md:L155-L168`, `context/dist/02-purchase-price.md:L150-L160`)
  - Benchmarks imply “SPA definitions + **illustrative schedules**” at top hierarchy priority, while the rest of the system treats “illustrative only” schedules as a **problem**. (`context/dist/benchmarks.md:L127-L135`, `context/dist/global-tests.md:L178-L203`, `context/dist/output-contract.md:L79-L82`, `context/dist/term-map.yml:L505-L510`)

- **Usability: 4/5**
  The playbooks are very followable: clear two-pass sequencing, explicit artifacts (one-bucket map, issue register), and “Not found” + confidence labelling are repeated across documents. (`context/dist/system-prompt.md:L51-L66`, `context/dist/output-contract.md:L11-L35`, `context/dist/01-definitions.md:L18-L31`)
  Biggest usability ambiguity: “normalize to canonical terms” vs “preserve defined terms exactly” isn’t fully operationalized for analysis outputs (it’s clear for edits, but not for analysis labeling). (`context/dist/system-prompt.md:L55-L59`, `context/dist/system-prompt.md:L152-L162`)

- **Robustness: 3/5**
  You have the right “anti-hallucination primitives” (evidence-first, “Not found,” confidence labels, test suite, and structured deliverable). (`context/dist/system-prompt.md:L11-L29`, `context/dist/output-contract.md:L9-L17`, `context/dist/global-tests.md:L299-L317`)
  But several structural inconsistencies (tests list, missing playbooks, schedule hierarchy contradiction) create **systematic** failure modes that will recur even with a good model. (`context/dist/system-prompt.md:L69-L80`, `context/dist/output-contract.md:L155-L168`, `context/dist/02-purchase-price.md:L150-L160`, `context/dist/benchmarks.md:L127-L135`)

---

# Critical Issues

1. **Declared capabilities exceed the shipped playbooks (high hallucination risk)**
   The system prompt claims support for true-up disputes, earnouts, reps/warranties, redlines, and roleplay, and routes users to playbooks `03–08`, but only `01` and `02` exist in the manifest. This sets the model up to “follow” non-existent guidance and improvise.
   - Evidence: Scope includes these tasks (`context/dist/system-prompt.md:L35-L43`) and routing table points to `03–08` (`context/dist/system-prompt.md:L69-L80`), but the manifest lists only `01` and `02` playbooks. (`MANIFEST.md:L9-L20`)

2. **Global test framework is inconsistent across files (tests will be skipped)**
   - `global-tests.md` requires **every test on every analysis**. (`context/dist/global-tests.md:L1-L4`)
   - `output-contract.md` only lists 7 tests in the “Global Test Results” section. (`context/dist/output-contract.md:L155-L168`)
   - `02-purchase-price.md` explicitly runs only “tests relevant to purchase price mechanics” (4 items). (`context/dist/02-purchase-price.md:L150-L160`)
     Net effect: an LLM can “comply” with one file while violating another, and you will miss exactly the kind of overlap/routing issues tests 8–10 are designed to catch. (`context/dist/global-tests.md:L206-L296`)

3. **Schedule binding / hierarchy contradiction can invert conclusions**
   - Benchmarks put “illustrative schedules” at top hierarchy priority. (`context/dist/benchmarks.md:L127-L135`)
   - The rest of the system treats “illustrative only” schedules as non-protective / a fail condition (schedule completeness test; example issue register entry; term-map warning language). (`context/dist/global-tests.md:L178-L203`, `context/dist/output-contract.md:L79-L82`, `context/dist/term-map.yml:L375-L384`, `context/dist/term-map.yml:L505-L510`)
     This contradiction can cause the model to downplay a genuinely high-risk drafting defect.

4. **Citation format implies page numbers, but ingestion/citation anchoring is unspecified**
   The standard citation format is `[§X.Y, p.Z]`. (`context/dist/system-prompt.md:L96-L105`, `context/dist/output-contract.md:L195-L211`)
   Without an explicit rule for when page numbers aren’t available (e.g., pasted text / HTML / docx), models commonly fabricate page references to look compliant. That’s directly at odds with the “no invented references” reliability pillar. (`context/dist/system-prompt.md:L23-L29`)

5. **`term-map.yml` routing vocabulary includes non-bucket routings (ambiguity in “one-bucket” discipline)**
   Examples like `working_capital_or_indemnity`, `excluded_or_haircut`, and `reduces_cash` are useful human notes, but they’re not one of the explicit buckets used in the One-Bucket Map template (Cash/Debt/WC/TxExp/Tax). (`context/dist/term-map.yml:L172-L176`, `context/dist/term-map.yml:L242-L246`, `context/dist/term-map.yml:L248-L258`, `context/dist/output-contract.md:L134-L152`)
   This increases the chance the model will “route” something without cleanly landing it in exactly one bucket.

---

# Improvement Recommendations

(Ordered by “biggest reliability lift per unit effort,” and each item points to the file(s) to change.)

1. **Unify the Global Tests contract across all files**
   - Update `output-contract.md` Section 6 to list **all 10 tests** (or require explicit “N/A” rows), so it matches `global-tests.md`. (`context/dist/output-contract.md:L155-L168`, `context/dist/global-tests.md:L1-L4`, `context/dist/global-tests.md:L206-L296`)
   - Update `02-purchase-price.md` Step 5 to either:
     - run all tests, or
     - include a fixed table of all tests with “Pass/Fail/N/A + why N/A,” preserving the invariant “reported every time.” (Currently it says “Run tests relevant…” and only lists 4.) (`context/dist/02-purchase-price.md:L150-L160`)

2. **Fix the schedule hierarchy contradiction**
   - Change `benchmarks.md` hierarchy line “SPA definitions + illustrative schedules” to something aligned with the rest of the system (e.g., “SPA definitions + **binding** schedules/templates”). (`context/dist/benchmarks.md:L127-L135`)
   - Keep the “illustrative only” language as a warning/issue trigger, consistent with schedule completeness and the example issue register row. (`context/dist/global-tests.md:L178-L203`, `context/dist/output-contract.md:L79-L82`)

3. **Resolve the routing-table vs available-playbooks mismatch (prevent guaranteed hallucination)**
   - Either add the missing playbooks (`03–08`) or explicitly mark them as “not implemented” and remove them from the routing table/scope until they exist. (`context/dist/system-prompt.md:L35-L43`, `context/dist/system-prompt.md:L69-L80`, `MANIFEST.md:L9-L20`)
   - This is a high ROI reliability fix: it stops the system from advertising capabilities it cannot execute.

4. **Generalize Section 4 of the Output Contract so it works for both playbooks**
   - `output-contract.md` currently frames Section 4 as “Definition Tables” with an explicit definition component breakdown. (`context/dist/output-contract.md:L98-L132`)
   - But `02-purchase-price.md` needs “Price Bridge Table” + “Funds Flow Summary” as first-class artifacts. (`context/dist/02-purchase-price.md:L213-L223`)
     Recommendation: rename Section 4 to **“Supporting Tables (per playbook)”** and include sub-templates: “Definition Breakdown,” “Price Bridge,” “Funds Flow,” “Escrow Summary.” This aligns with the system prompt’s “Supporting Tables — definition breakdowns, price bridge, etc.” (`context/dist/system-prompt.md:L86-L95`)

5. **Make self-analysis checklists consistent and enforceable**
   - `01-definitions.md` requires yes/no **with citations** (excellent). (`context/dist/01-definitions.md:L183-L210`)
   - `02-purchase-price.md` says “answer each question” but doesn’t require yes/no or citations. (`context/dist/02-purchase-price.md:L163-L192`)
     Recommendation: adopt the `01` pattern for `02` (Yes/No + citation). This is one of the strongest anti-hallucination levers you have.

6. **Clarify “normalize to canonical terms” vs “preserve defined terms” in analysis outputs**
   - You already mandate canonical normalization in Pass 1. (`context/dist/system-prompt.md:L55-L59`, `context/dist/output-contract.md:L22-L27`)
   - You also emphasize preserving defined terms exactly (especially for edits). (`context/dist/system-prompt.md:L152-L162`, `context/dist/output-contract.md:L182-L188`)
     Recommendation: add an explicit rule such as:
     “In tables/issues, label with canonical name + the contract-defined term in parentheses (e.g., **Indebtedness** (‘Closing Debt’)). Quotes always use the exact defined term.”
     This reduces drift and prevents the model from “choosing” which convention to follow.

7. **Extend `term-map.yml` to cover purchase price mechanics (and future playbooks)**
   Today, the term map is robust for the core financial definitions (Cash, Indebtedness, Working Capital, Transaction Expenses, Accounting Principles, Taxes, Net Debt). (`context/dist/term-map.yml:L60-L613`)
   To support `02` and the promised scope in `system-prompt.md`, add canonical entries/components for:
   - Escrows (indemnity escrow, PPA escrow, special escrow), holdbacks, paying agent mechanics (covered in `02` but not in term-map) (`context/dist/02-purchase-price.md:L110-L140`)
   - Earnout mechanics (metrics, acceleration, set-off) (promised in scope/routing) (`context/dist/system-prompt.md:L35-L43`, `context/dist/system-prompt.md:L69-L80`)
   - Survival/caps/baskets linkage to “Purchase Price” vs “Total Consideration” (explicitly flagged as a common issue in `02`). (`context/dist/02-purchase-price.md:L330-L347`)

8. **Add a “citation anchoring policy” to avoid fabricated page references**
   Because you require `[§X.Y, p.Z]` formatting, you should explicitly define what to do when p.Z cannot be known (e.g., “omit page; cite section or quote header; never invent page numbers”). (`context/dist/system-prompt.md:L96-L105`, `context/dist/output-contract.md:L195-L211`, `context/dist/system-prompt.md:L23-L29`)

---

# Missing Components

These are “needs” implied by your own system scope/claims, but not present in the provided files.

1. **Playbooks 03–08 (or removal of their promises)**
   The routing table explicitly references: `03-wc-net-debt.md`, `04-earnouts.md`, `05-reps-warranties.md`, `06-commercial-terms.md`, `07-redline.md`, `08-roleplay.md`. (`context/dist/system-prompt.md:L69-L80`)
   None of these are included in the manifest list. (`MANIFEST.md:L9-L20`)

2. **Vocabulary + tests for non-definition SPA topics**
   `term-map.yml` is focused on pricing structures and a handful of definition families. (`context/dist/term-map.yml:L5-L613`)
   If you truly support reps/warranties, earnouts, and redlines (as stated), you’ll need canonical vocab + validation tests for those domains too. (`context/dist/system-prompt.md:L35-L43`)

3. **Global tests that cover purchase-price “funds flow integrity”**
   `02` includes critical checks like “escrow release vs survival alignment” and dispute process questions, but these are not codified as global tests. (`context/dist/02-purchase-price.md:L141-L147`, `context/dist/02-purchase-price.md:L183-L187`, `context/dist/global-tests.md:L1-L4`)

4. **A defined policy for partial-document inputs**
   The system emphasizes “Not found” as meaningful, but there’s no explicit rule distinguishing “not found in provided excerpt” vs “not found in SPA.” (Reliability pillar requires explicit gaps, but scope/UX flow doesn’t define partial-input semantics.) (`context/dist/system-prompt.md:L23-L29`, `context/dist/system-prompt.md:L177-L183`)

---

# Verdict

The architecture is **directionally sound** for what’s actually implemented today: completion accounts definitions + purchase price mechanics. The two-pass discipline, “Not found,” confidence labels, and the global test concept are exactly the right primitives for LLM reliability. (`context/dist/system-prompt.md:L11-L29`, `context/dist/system-prompt.md:L51-L66`, `context/dist/01-definitions.md:L18-L31`, `context/dist/output-contract.md:L18-L35`)

That said, I **would not fully trust analysis from this system as-is** in a production setting until you fix the **cross-file inconsistencies** (global tests mismatch, schedule hierarchy contradiction), and either **ship or de-scope** the missing playbooks that the system prompt advertises. Those issues aren’t edge cases—they’re repeatable failure generators. (`context/dist/global-tests.md:L1-L4`, `context/dist/output-contract.md:L155-L168`, `context/dist/02-purchase-price.md:L150-L160`, `context/dist/benchmarks.md:L127-L135`, `context/dist/system-prompt.md:L69-L80`, `MANIFEST.md:L9-L20`)
