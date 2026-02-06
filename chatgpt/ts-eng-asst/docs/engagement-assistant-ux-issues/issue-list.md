# TS Engagement Assistant — UX / Conversation Flow Issues

## Sources reviewed

- `~/Downloads/ChatGPT-Buy-side EL Generation.md` (Exported 2/3/2026 12:49:15)
- `~/Downloads/ChatGPT-Buy-side EL Request.md` (Exported 2/3/2026 14:41:39)

## Summary (what improved vs what still failed)

### Improvements observed in the latest run (2/3/2026 14:41)
- The assistant asked a small set of **Deal setup** questions first and only showed Canvas after the user confirmed the deal type (better “discussion first” UX).
- The assistant used an **Updated fields** list to make changes auditable.
- The assistant asked for buy-side fees as **separate low/high numeric amounts** (not “$000s”) and enforced `CHOICE_SEC_STATUS` as a controlled choice.

### Still failing / regressed (blocking UX)
- Canvas updates failed with “pattern-matching error”, causing a loop where the assistant “knew” the values but refused generation because the Canvas still showed old values.
- Scope checklist rendering/editing was brittle (“scope section contains only `-`”).
- The assistant violated constraints by claiming it “added final polish” and by drafting a full letter-like document in chat (not just filling placeholders).
- Generator execution attempts were inconsistent (wrong import path / wrong calling convention), producing “Analysis errored”.

---

## Open issues (priority order) — with drivers and precise remediations

### O1) Generator execution is inconsistent (wrong import/module name; noisy retries)
- **Observed:** In the latest run, generation started with `from el_generate import generate_el` and errored. Other attempts used positional args vs flags inconsistently.
- **Driver (non-technical):** Code Interpreter execution is brittle when the assistant improvises the call path. Small differences in filename/module name or arg shape cause hard failures and “undefined” output.
- **Remediation (precise fix):**
  1. In `chatgpt/TS-SoW/dist/ts-engagement-assistant.md`, specify a single canonical invocation pattern (subprocess call to `el-generate.py`), and forbid module imports unless the module is guaranteed to exist.
  2. Ensure `chatgpt/TS-SoW/dist/el-generate.py` accepts both flags and positional back-compat (to tolerate agent variance).
- **Acceptance:** One attempt succeeds; errors (if any) are explained once in plain language with one corrective next step (no multi-attempt spam).

### O2) Canvas edit failures cause a hard loop (assistant “knows” values but can’t apply them)
- **Observed:** The assistant repeatedly reports `Failed to edit Engagement Letter — Project Atlas` when trying to update specific rows (SEC status, fee rows), then refuses generation because the Canvas still contains the old values.
- **Driver (non-technical):** The assistant is trying to “surgically edit” individual lines in the Canvas. If the Canvas text doesn’t match exactly, the system rejects the edit, and the conversation gets stuck even though the user already provided the missing information.
- **Remediation (precise fix):**
  1. In `chatgpt/TS-SoW/dist/ts-engagement-assistant.md`, add a hard rule: **never do partial line edits**; always **re-render the full Canvas from scratch** after each user reply (3 tables + scope checklist).
  2. Add a fallback rule: if a Canvas update fails, the assistant must **stop trying to patch** and instead (a) re-render the full Canvas, or (b) proceed to generation using the extracted variables if the user already provided the required values.
- **Acceptance:** In the “Atlas” scenario, after the user supplies SEC status + fee low/high, the next assistant turn shows the updated values in Canvas without manual user copy/paste, and `generate` proceeds.

### O3) Generation is incorrectly gated on “what the Canvas currently displays”
- **Observed:** The assistant said values were “locked in my working variables” but still refused generation because the Canvas still showed the old/invalid values.
- **Driver (non-technical):** The system treats the Canvas text as the only source of truth. When Canvas editing fails, the user gets blocked even though they provided correct answers.
- **Remediation (precise fix):**
  - In `chatgpt/TS-SoW/dist/ts-engagement-assistant.md`, change the gate language so the assistant validates against **the latest extracted values** (working variables) and only uses Canvas for user review.
  - If Canvas cannot be updated, generation should proceed using the latest extracted values and the assistant should include a short warning: “Canvas view may be stale; download and review the .docx for final confirmation.”
- **Acceptance:** If the user has provided `CHOICE_SEC_STATUS` and fee low/high in chat, `generate` should not be blocked solely due to a Canvas edit failure.

### O4) The assistant violates “no legal text modification” by drafting letter content in chat
- **Observed:** The assistant produced a full multi-section “Engagement Letter — Project Atlas” writeup in chat and claimed “final polish” / “light grammar checks”.
- **Driver (non-technical):** The assistant is trying to be helpful by drafting a readable document, but this conflicts with the product promise: legal language must only come from approved templates.
- **Remediation (precise fix):**
  - In `chatgpt/TS-SoW/dist/ts-engagement-assistant.md`, add a strict rule: **never write engagement letter prose** in chat; only show (a) the 3-table Canvas, (b) the scope checklist, and (c) the final generated `.docx`.
  - Explicitly forbid any claim of “polish”, “grammar edits”, “rewriting”, “improvements”.
- **Acceptance:** The assistant never outputs letter-like sections/headings; generation output is only the downloadable `.docx`.

### O5) Scope checklist is treated as “required for generation” and fails open as a single `-`
- **Observed:** The assistant claimed scope checklist is “required for generation”; later it says the scope section contains only `-` and blocks generation.
- **Driver (non-technical):** Scope is being handled as a special Canvas edit region; when the edit fails, the assistant leaves a placeholder dash and then blocks the user.
- **Remediation (precise fix):**
  1. Update `chatgpt/TS-SoW/dist/ts-engagement-assistant.md` so the scope checklist is **optional** (if the user never edits it, include the default full scope; only use `scope_selection.excluded_top_level_ids` when the user unchecks items).
  2. Add a hard rendering rule: never output a “stub” like `-` for scope; either render the full checklist or omit the entire scope UI and default to “include all”.
- **Acceptance:** With no scope edits, `generate` should still succeed and the inserted scope should include all default items for the selected industry.

### O6) Industry mapping is surprising (e.g., “consumer retail” silently becomes “supermarket”)
- **Observed:** In the earlier run, “consumer retail” became “Supermarket (closest match…)” late in the flow; users only notice after many turns.
- **Driver (non-technical):** The system only supports a small set of industries; it picks a “closest” one without asking, which can change scope.
- **Remediation (precise fix):**
  - Add a confirmation step when the user provides a non-exact industry label:
    1) “You said X. Closest supported options are A/B/C; I recommend A. Confirm?”
    2) Only after confirmation, set `INDUSTRY` and render scope.
  - Optionally add an explicit alias: support `retail` / `consumer retail` as a first-class choice that maps to the same scope module as `supermarket` until a dedicated retail scope is added.
- **Acceptance:** User always explicitly confirms the chosen industry key before the scope checklist appears.

### O7) Multi-party entity roles are not locked early, causing rework later
- **Observed:** When multiple entities were mentioned (Brookfield + Scout), the assistant had to stop and ask “what is Brookfield’s role?”, after already populating fields.
- **Driver (non-technical):** The assistant begins filling client/target fields before clarifying which entity is which role.
- **Remediation (precise fix):**
  - Add a “role map” question as soon as multiple entities are detected: Client / Target / Sponsor / Third-party recipient.
  - Only populate Client vs Target placeholders after role confirmation.
- **Acceptance:** No mid-flow reclassification that forces the assistant to rewrite large sections of the Canvas.

### O8) Input normalization is missing (duplicate lines, “Cancel/Send” artifacts)
- **Observed:** A user message included duplicated text and UI artifacts; the assistant continued without sanitizing.
- **Driver (non-technical):** Copy/paste from UI can introduce repeated chunks; the assistant can extract conflicting values.
- **Remediation (precise fix):**
  - Add a normalization rule in `chatgpt/TS-SoW/dist/ts-engagement-assistant.md`: dedupe repeated lines and ignore common UI tokens (`Cancel`, `Send`) before extracting values.
  - If conflicting values are detected, ask a single clarification question.
- **Acceptance:** Duplicate/pasted messages do not cause duplicated field entries or re-asking.

---

## Schema simplification opportunities (add to backlog)

This is based on the current schema as of 2/3/2026:
- ~`69` total variables; ~`36` marked `required`.
- ~`21` of the required keys are already being silently derived/defaulted in `el-generate.py`, which means they still create UX/schema complexity without providing real user value.

### S1) Required schema fields that are already derived/defaulted (unnecessary gating + maintenance)
- **Observed:** Many fields are still marked `required` in the schema even though the generator can infer them (or we’ve decided they should be defaults).
- **Driver (non-technical):** The system is forcing the user to “fill out paperwork” the product can reliably fill itself. This increases friction and creates more places for the assistant to ask the wrong question or gate on a non-critical detail.
- **Remediation (precise fix):**
  - Remove these keys from the schema (or mark them non-required + “derived/hidden” if you want to keep them documented):
    - Client variants: `CLIENT_LEGAL_NAME_FULL`, `CLIENT_LEGAL_NAME_ACCEPTANCE`, `CLIENT_NAME_SHORT`, `CLIENT_COUNTRY_2`
    - Admin/signature: `SIGNING_PARTNER_NAME_2`, `PROJECT_NAME_HEADER`, `BILLING_ENTITY_NAME`
    - Date defaults: `LETTER_DATE`, `DATE_COMMENCE`, `DATE_DRAFT_DELIVERY`, `FAL_DATE`, `FAL_LETTER_DATE`, `RELEASE_DATE`
    - Target variants: `TARGET_DESCRIPTION`, `TARGET_DESCRIPTION_DETAIL`
  - Ensure the prompt never asks for these and the generator always derives/sets them.
- **Acceptance:** Required schema keys are limited to truly user-provided details; users are never asked for “variants” or default-able fields.

### S2) Appendix / release “variant” fields should be derived or bracketed (not asked)
- **Observed:** We carry multiple near-duplicate keys (e.g., appendix/release variants) that exist only to satisfy specific template wording.
- **Driver (non-technical):** It forces the assistant to manage extra fields the user doesn’t understand or care about.
- **Remediation (precise fix):**
  - Derive `*_2/*_3` variants in the generator from the primary field, or replace the variants in the template with bracketed text for the user to edit.
- **Acceptance:** No appendix/release variant fields appear in schema or Canvas; generated output still reads correctly.

### S3) Fee model is inconsistent across buyside vs sellside (`FEE_FDD_LOW/HIGH` vs `FEE_FDD_RANGE`)
- **Observed:** Buyside collects low/high numeric amounts; sellside uses a single range field.
- **Driver (non-technical):** The same concept is captured in two incompatible shapes, which causes extra prompting logic and user confusion.
- **Remediation (precise fix):**
  - Standardize on low/high full dollars across both templates; drop `FEE_FDD_RANGE` and format ranges in the template (or generator) consistently.
- **Acceptance:** One fee capture model across templates; no “range parsing” or duplicate logic.

### S4) “Human-edit me” disclosures are still schema-driven (better as bracketed template text)
- **Observed:** Fields like `CONFIDENTIALITY_PROCEDURES`, `EXISTING_SERVICES_DESCRIPTION`, `INDEMNITY_EXCLUSION`, `CLOSING_SENTIMENT` are effectively placeholders for humans to tailor.
- **Driver (non-technical):** The assistant ends up asking legal/engagement-specific questions that teams often won’t answer upfront and would rather edit later in Word.
- **Remediation (precise fix):**
  - Replace these placeholders in templates with bracketed guidance/inserts and remove the schema keys (similar to how we moved other guidance into square brackets).
- **Acceptance:** Users aren’t forced into detailed disclosure drafting during intake; the output `.docx` clearly indicates what a human must edit.

### S5) “Helper wording” choice placeholders could be bracketed to reduce branching
- **Observed:** The schema contains helper wording keys (e.g., `CLIENT_OR_TARGET`, `CLIENT_AND_TARGET`, `CHOICE_CLIENT_OR_TARGET_POSSESSIVE*`) that exist to choose between phrases.
- **Driver (non-technical):** Adds branching and more “micro-fields” that are hard to get right conversationally.
- **Remediation (precise fix):**
  - Prefer bracketed alternatives in the output (the unmodified-template style) unless the phrasing must be machine-consistent.
- **Acceptance:** Fewer micro-choices; users can resolve minor wording directly in Word.

### Recommended next: S1 (schema required/derived mismatch) — most important to work on

**Why this is the highest leverage**
- It directly reduces strictness/gating loops, because many “required” fields are not truly required from the user.
- It makes every other improvement easier: fewer keys to ask about, fewer Canvas rows, fewer template variants to support.

**Failure path (driver)**
1. Schema marks many fields `required`.
2. The assistant feels compelled to ask for them or gate on them (even if a default/derivation is intended).
3. Users respond with “TBD/N/A” or skip them, and the flow loops or becomes frustrating.

**Best solution (cleanest + consistent with our current decisions)**
1) **Minimize schema to user-provided essentials only**
   - Remove derived/defaulted keys from schema (list above).
2) **Treat templates as the source of “reasonable defaults”**
   - If a value is truly a default, bake it into the `.docx` directly (or leave it as bracketed human text).
3) **Generator remains the safety net**
   - Keep derivations for variants that still exist in templates so generation never leaves `{{...}}` behind.
4) **Prompt stays simple**
   - Interview only for the reduced essential set; never mention removed keys.

**Acceptance criteria**
- The assistant never asks for removed derived/default fields.
- User can reach `generate` without being forced to provide “variant” fields.
- Generated output contains no `{{...}}` tokens and retains bracketed guidance where intended.

**Implementation sketch (one-pass)**
1. Audit templates: extract all `{{TOKENS}}` from buyside/sellside `.docx`.
2. Decide per token: **ask** (stays in schema) vs **derive/default** (remove from schema) vs **human bracket** (remove token from template).
3. Update `el-placeholder-schema.json`: remove the derived/default set; keep only user-meaningful fields as `required`.
4. Update `ts-engagement-assistant.md`: delete any references/questions for removed keys; keep interview groups stable.
5. Update `el-generate.py`: ensure any remaining variant tokens still get filled; validate “no `{{...}}` remain”.
6. Validate: minimal buyside + sellside runs succeed with fewer required inputs.

## Industry Coverage Expansion (Top 15 by Revenue)

### Current supported industries (schema options)
Currently supported `INDUSTRY` keys (from `chatgpt/TS-SoW/dist/el-placeholder-schema.json`):
- `construction`, `eyecare`, `healthcare`, `hvac`, `manufacturing`, `prof_services`, `real_estate`, `service`, `supermarket`, `tech`, `transportation`, `retail`, `banking`, `insurance`, `telecomm`, `aerospace`, `building`, `generic`

### “Top 15 by revenue” industries identified (from “Revenue by Industry” workbook)
Top 15 (as labeled in the workbook):
- Retail
- Priv Equity
- Asset Mgmt
- Technology
- Ind Mfctg
- Health
- Misc
- Holding
- Pensions
- Transport
- Banking
- Insurance
- Building
- Telecomm
- Aerospace

### Missing from current support (to add)
Industries from the top 15 that are **not** currently supported as explicit `INDUSTRY` options:
- None (all Top-15 *operating industries* are now supported as explicit `INDUSTRY` options).

Notes:
- “Technology” is covered by `tech`.
- “Ind Mfctg” is covered by `manufacturing`.
- “Health” is covered by `healthcare`.
- “Transport” is covered by `transportation`.
- `retail` is now a first-class `INDUSTRY` option; any non-exact industry input should be confirmed explicitly (no silent “closest match” mapping).
- “Priv Equity”, “Asset Mgmt”, “Misc”, “Holding”, “Pensions” are revenue-segment categories and are intentionally not modeled as `INDUSTRY` (which is the target operating industry).

### Work required to add missing industries
- Add new `INDUSTRY` keys to `el-placeholder-schema.json` (with user-friendly labels and any aliases).
- Add corresponding modules/sections to `scope-library.json` for each new industry key (or define an approved mapping to an existing industry module where the scope is sufficiently similar).
- Add “unsupported industry” handling in the interview flow so free-text industries are resolved via an explicit confirmation step (no silent mapping).

---

## Fixed issues (verified)

### F1) Canvas not shown on first turn (discussion-first)
- **Previously:** Canvas was presented immediately.
- **Now observed:** Latest run asked Deal setup first, then showed Canvas after confirmation.
- **Keep:** This is the right UX pattern. Continue to enforce “no Canvas on the first assistant turn unless a document is uploaded”.

### F2) Buy-side fee capture is no longer “$000s”
- **Previously:** The flow pushed users to enter `80` / `90` and mentally translate to “80,000”.
- **Now observed:** Latest run asked explicitly for `90000` / `120000`.
- **Keep:** Fees should be full dollars; display and store consistently.

### F3) Update feedback (“Updated fields” list)
- **Previously:** “Made X edits…” gave no visibility into what changed.
- **Now observed:** Latest run enumerated the updated fields.
- **Keep:** Always include a short “Updated fields” list (max ~8 lines) after a user reply.

### F4) “Should not be in Canvas” fields are no longer asked up-front
- **Previously:** The flow asked for client short name, EL signatory, target description/detail, billing entity, management contact, and duplicated project header fields.
- **Now observed:** Latest run’s user prompts focused on user-relevant fields and deferred/derived the rest (no explicit asks for client short name or management contact in the visible flow).
- **Keep:** Maintain a strict “hidden + derived” list so these fields never become gateable UX items.

### F5) Dates that should default are not asked during the interview
- **Previously:** The assistant asked for draft delivery / factual accuracy letter / release dates and refused “TBD”.
- **Now observed:** Latest run used `Commencement = Immediately` and did not ask for the other dates during the interview.
- **Keep:** Treat these as silent defaults unless a user explicitly overrides.
