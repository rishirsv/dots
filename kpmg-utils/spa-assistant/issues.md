# Dist Review Issues and Surgical Fixes

This file now includes the full issue set from the review.

Note on previous Issue 4:
- Per your confirmation, dependency availability is not a blocker in your environment.
- The pre-flight capability check is still retained below as an optimization.

## Issue 1 (P1): Top-level routing locks the assistant into definitions flow

### Evidence
- `dist/spa-assistant.md:11`
- `dist/spa-assistant.md:13`
- `dist/spa-assistant.md:17`
- `dist/spa-assistant.md:19`

### Why this matters
The current top-level flow always executes definitions extraction and definitions analysis first. Requests for deal terms, earnouts, redline comparison, or negotiation can be incorrectly routed, delayed, or answered through the wrong playbook.

### Surgical fix
**File:** `dist/spa-assistant.md`  
**Change:** Replace current Phase 1/Phase 2-only routing with explicit intent routing.

**Current block (lines 11-19):**
```md
### Phase 1 - Definitions Extraction

Follow the algorithm in `extract-definitions.md`. Save definitions to `/mnt/data/definitions.jsonl`.

After extraction, treat `/mnt/data/definitions.jsonl` as the single source of truth for definitions. Use it for all definition analysis and follow‑on questions. Do not re-open the source document for definitions unless the artifact is missing, unreadable, or clearly incomplete. Verify it is complete and compute `term_count` and `bytes`.

### Phase 2 - Definitions Analysis

After extracting definitions in Phase 1, read `definition-analysis.md`. Follow the playbook’s output contract exactly. Required sections and tables must be present. Keep responses inside the requested scope.
```

**Replace with:**
```md
### Request Routing (Mandatory)

Route first, then run only the required playbook:
- Definitions / price mechanics / funds flow / true-up requests: run `extract-definitions.md` then `definition-analysis.md`.
- Reps, warranties, indemnity, survival, caps, baskets, closeability: run `deal-terms.md`.
- Earnout, redline comparison, negotiation prep: run `special-mechanics.md`.
- If intent is ambiguous, ask one routing question before analysis.

When definitions are required, use `/mnt/data/definitions.jsonl` as source of truth after extraction.
```

## Issue 2 (P1): Missing benchmark reference path in special mechanics

### Evidence
- `dist/special-mechanics.md:218`
- `dist/special-mechanics.md:277`
- `../docs/knowledge/market-benchmarks.md` is currently missing from this repo state and not in `dist/`.

### Why this matters
Negotiation and roleplay output asks for numeric market anchors but references a file path that is not packaged in `dist`. This creates inconsistent behavior and a higher chance of unsupported benchmark claims.

### Surgical fix
**Option A (preferred): package-local reference**

1. Add benchmark file to distribution bundle:
   - `dist/market-benchmarks.md`
2. Update both references in `dist/special-mechanics.md`:

```md
- Pull standard arguments from `deal-terms.md` and numeric anchors from `market-benchmarks.md`
...
- Use `market-benchmarks.md` for numeric negotiation anchors.
```

**Option B (if you do not want to ship benchmarks)**
- Keep file reference removed and add explicit fallback:

```md
- If benchmark source is unavailable, state "No benchmark source loaded" and do not provide numeric market anchors.
```

## Issue 3 (P1): Reused `definitions.jsonl` can leak across uploaded documents

### Evidence
- `dist/spa-assistant.md:15`
- `dist/definition-analysis.md:10`
- `dist/extract-definitions.md:21`
- `dist/extract-definitions.md:23`

### Why this matters
The flow requires reuse of `/mnt/data/definitions.jsonl` but does not enforce document identity before reuse. In multi-document sessions, stale definitions can be reused for the wrong SPA.

### Surgical fix
**File 1:** `dist/extract-definitions.md`  
**Add under Output artifact section:**
```md
Also write `/mnt/data/definitions.meta.json` with:
- `source_file`
- `source_sha256`
- `source_bytes`
- `term_count`
```

**File 2:** `dist/spa-assistant.md`  
**Add under artifact reuse rule:**
```md
Before reusing `/mnt/data/definitions.jsonl`, verify `/mnt/data/definitions.meta.json` matches the current source document fingerprint (`source_sha256` and `source_bytes`). If mismatch, regenerate definitions.
```

**File 3:** `dist/definition-analysis.md`  
**Tighten requirement line:**
```md
Do not produce Definition Analysis unless `/mnt/data/definitions.jsonl` exists and `/mnt/data/definitions.meta.json` matches this exact document.
```

## Issue 4 (P2): Citation integrity rule is incomplete (anti-fabrication gap)

### Evidence
- `dist/spa-assistant.md:23`
- `dist/deal-terms.md:11`
- `dist/special-mechanics.md:10`
- `dist/definition-analysis.md:163`

### Why this matters
The prompts require citations but do not explicitly ban invented citations or define fallback when page numbers are unavailable. This creates pressure to fabricate cites in weakly-structured inputs.

### Surgical fix
**File:** `dist/spa-assistant.md`  
**Add a short rule block under Tone/Style or Tools:**
```md
## Citation Integrity

- Never invent citations.
- If location metadata is unavailable, use available locator only (e.g., section heading/paragraph) and state `location detail unavailable`.
- If the evidence is not present, state `Not found in provided material`.
```

## Issue 5 (P3): Prompt duplication increases token usage and drift risk

### Evidence
- `dist/deal-terms.md:11`
- `dist/special-mechanics.md:10`
- `dist/definition-analysis.md:12`
- Repeated template scaffolding across large playbooks.

### Why this matters
Large repeated instructions consume context budget and increase formatting drift. This can reduce consistency and responsiveness in long sessions.

### Surgical fix
**Minimal pass (no structural rewrite):**
1. Create `dist/output-contract.md` with shared response rules:
   - citation policy
   - "Next steps" menu rule
   - issue ranking format
2. Replace repeated requirement paragraphs in each playbook with one line:
```md
Follow `output-contract.md` for response structure and citation behavior.
```

## Issue 6 (P3): Non-functional image in `dist` consumes upload budget

### Evidence
- `dist/spa-assistant-logo.png` is ~533KB and not referenced by runtime instructions.

### Why this matters
For Custom GPT knowledge uploads, non-reasoning assets can consume file slots/space and add no analysis value.

### Surgical fix
1. Remove `dist/spa-assistant-logo.png` from upload bundle.
2. If branding is still needed, keep it outside GPT knowledge artifacts.

## Optimization (Requested): Pre-flight capability check for extractor

This is retained as an optimization (not a blocker in your environment).

### Surgical fix
**File:** `dist/extract-definitions.md`  
**Replace lines 34-37 with:**

```md
- Identify the source type: `.docx` or `.pdf`.
- Confirm extraction capability first (import check):
  - `.pdf`: try `import fitz`
  - `.docx`: try `import docx`
- If import fails, attempt package install once.
- If install still fails, ask for Definitions page range or pasted excerpt and continue with partial-input extraction.
```

## Recommended execution order

1. Fix Issue 1 (routing) and Issue 3 (artifact identity guard).
2. Fix Issue 2 (benchmark path packaging).
3. Add Citation Integrity block (Issue 4).
4. Apply pre-flight optimization.
5. Apply low-priority cleanup (Issues 5-6).
