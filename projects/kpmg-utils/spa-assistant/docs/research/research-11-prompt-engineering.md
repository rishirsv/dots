#### Prompt Structure Recommendations

Here are prompt patterns that reliably produce _consistent, high-quality_ SPA analysis (especially when the SPA is long, heavily defined, and cross-referenced). The big idea: **separate “what the document says” from “what it means,” and force the model to show its work with evidence IDs.** ✅

---

##### 1) “Evidence-first, then analysis” (the most reliable structure)

This is my default for SPAs because it controls both quality _and_ hallucination.

**Prompt skeleton (single call):**

- **Role & scope**: “You are an SPA analyst. Use only the provided document excerpts. No external knowledge.”
- **Task**: “Answer these analysis questions…”
- **Hard constraints**:
  - “Every non-trivial claim must cite at least one excerpt ID.”
  - “If not found, say `Not found in provided text`.”
  - “Do not infer missing numbers/dates.”

- **Output contract** (two-stage inside one output):
  1. **Evidence Table** (quotes + where found)
  2. **Analysis** (built only from Evidence Table)

**Why it works:** you’re making the model “commit” to the actual text before it starts synthesizing. This is the same philosophy behind attribution / citation benchmarks that explicitly evaluate citation quality (ALCE). ([arXiv][1])

---

##### 2) “Extract → Normalize → Interpret” (three-layer prompting)

SPAs are definition-heavy. A model will look smart but slip on defined terms unless you normalize first.

**Structure:**

1. **Extract**: pull raw clause text, section refs, defined terms, and key numbers/dates.
2. **Normalize**: map to a canonical schema (e.g., “purchase price mechanism = locked box / completion accounts / hybrid”).
3. **Interpret**: risk/implications, diligence questions, negotiation levers.

This mirrors how retrieval-augmented systems reduce “parametric memory guessing” by leaning on explicit text. ([arXiv][2])

---

##### 3) “Rubric-based analysis” (forces completeness and comparability)

If you need consistency across many SPAs, give the model a scoring rubric so outputs are comparable.

Example rubric areas (tailor to your SPA playbook):

- Purchase price adjustment clarity (0–3)
- Leakage protections / covenants (0–3)
- Indemnity cap/basket/survival clarity (0–3)
- Closing conditions breadth (0–3)
- Termination + break fees / reverse termination (0–3)

**Prompt trick:** require _both_ a score and a cited justification.

---

##### 4) “Section-targeted prompts” (when documents are huge)

Instead of asking “analyze the SPA,” ask:

- “Analyze purchase price mechanism and adjustments”
- “Analyze indemnities and limitations”
- “Analyze closing conditions and termination”

This reduces context dilution and improves retrieval precision.

---

##### 5) “Controlled language” instructions (simple but effective)

Tell the model exactly how to speak:

- Use **short bullets**.
- No legalese filler.
- Every bullet ends with citations like `[E12][E19]`.
- If unsure: output `Ambiguous` + cite the conflicting text.

This boosts readability and reduces the tendency to embellish.

---

##### 6) Prefer “structured + narrative” dual-output

For SPA assistants that feed downstream workflows, I recommend:

- **JSON (machine)** for extracted terms
- **Narrative (human)** for interpretation

This avoids forcing the entire response into a rigid schema (which often harms nuance), while keeping critical data consistent.

---

#### Citation Accuracy Techniques

Accurate citations are _not_ just a prompt problem. It’s a **pipeline + prompt contract + verifier** problem.

---

##### 1) Give the model citeable units with stable IDs

Chunk the SPA into excerpts like:

- `E17`: page 23, “Section 2.4 Purchase Price Adjustment…”
- include heading + section number + page info in the chunk text

**Do not** give the model a blob of text and expect clean citations.

---

##### 2) Require **quotes** in the evidence step (even short ones)

A strong technique from “fine-grained citation” work is: make the model anchor to a _specific span_ first, then generate. ([ACL Anthology][3])

**Evidence row format (recommended):**

- `claim_type`: (definition / obligation / exception / threshold / timeline)
- `quote`: 10–40 words copied from excerpt
- `excerpt_id`: E17
- `why_relevant`: 1 sentence

Then the analysis can cite E17 without drifting.

---

##### 3) Constrain citations to the provided excerpt IDs only

In the prompt:
“Valid citations are only: `E1…E32`. Do not invent citations.”

You’d be surprised how much this reduces fabricated references.

---

##### 4) Add a “citation coverage” rule

For example:

- “Every risk bullet must cite ≥2 excerpts OR cite 1 excerpt + mark as `Inference`.”
- “Any numeric value must cite the excerpt containing the number.”

This aligns with how citation benchmarks think about “supportiveness” and “completeness” of citations. ([arXiv][1])

---

##### 5) Post-process: automatically verify citations

This is huge in practice:

- For each citation `E17`, confirm the excerpt ID exists.
- If the model included a quote, string-match (or fuzzy match) it back to `E17`.
- If the quote isn’t found → fail the output or re-ask with “Your quote did not match. Try again using exact text.”

This is how you turn “best effort” prompting into a **reliable system**.

---

##### 6) Use “retrieve-then-read” rather than “read-then-cite”

If you’re using RAG, do retrieval first, then answer from retrieved passages. That’s the standard retrieval-augmented generation pattern. ([arXiv][2])
When models generate first and then try to add citations, they often attach citations that are only loosely related.

A strong alternative is **post-hoc retrieval + revision** (generate → retrieve → revise for attribution), like RARR-style workflows. ([ACL Anthology][4])

---

##### 7) Measure citation quality (don’t guess)

If this matters operationally, adopt automatic metrics / eval sets inspired by ALCE and attribution QA work. ([arXiv][1])
Even a small internal benchmark set of 20 SPAs with “gold” clause locations will pay off.

---

#### Hallucination Prevention

Hallucination in document analysis usually comes from three places:

1. missing evidence in context,
2. overconfident inference,
3. the model “helpfully” filling gaps.

You fix it by combining **grounding + abstention + verification**.

---

##### 1) Ground the model in retrieved text (RAG)

Retrieval-augmented generation explicitly reduces reliance on “whatever the model remembers” by conditioning generation on retrieved passages. ([arXiv][2])

For SPAs, that means: always retrieve the _exact_ clause text relevant to the question (plus definitions it depends on).

---

##### 2) Force abstention with explicit states

Add these required labels per finding:

- `Supported` (directly stated)
- `Inference` (reasonable conclusion from stated text)
- `Not found` (absent from provided excerpts)
- `Ambiguous` (conflicting language)

Then require citations for Supported/Inference/Ambiguous.

This prevents the model from “rounding off” uncertainty.

---

##### 3) Split extraction vs synthesis (different prompts, often different temperatures)

- **Extraction prompt**: temperature ~0, strict schema, no interpretation.
- **Synthesis prompt**: slightly higher temperature, but must cite extracted evidence IDs.

This dramatically reduces invented numbers, dates, thresholds, and exceptions.

---

##### 4) Add a verification pass (model deliberation)

Chain-of-Verification (CoVe) style workflows reduce hallucinations by: draft → generate verification questions → answer them independently → revise final. ([arXiv][5])

For SPAs, verification questions look like:

- “Where is the cap defined?”
- “Is the basket tipping or deductible?”
- “Is there a survival period for fundamental reps?”
- “Is there an explicit ‘no leakage’ covenant?”

---

##### 5) Use sampling-based inconsistency checks for “risky” outputs

SelfCheckGPT shows you can flag potential hallucinations by sampling multiple responses and checking consistency. ([arXiv][6])
In practice: if the model gives a high-impact answer (e.g., “no cap”), run 3–5 resamples and see if it contradicts itself → if yes, force re-retrieval / re-check.

---

##### 6) Treat “definitions” as first-class evidence

SPAs routinely define “Indebtedness,” “Cash,” “Leakage,” “Permitted Leakage,” etc. If the model doesn’t have the definition in context, it will improvise.

So: **retrieve and pin definitions** before analyzing any dependent clause.

---

##### 7) Add hard numeric sanity checks

Post-process outputs:

- If it outputs a percentage / amount / time period → confirm that exact token exists in cited excerpt.
- If not → reject or mark “unsupported.”

This is boring engineering, but it’s where reliability comes from 🙂.

---

#### Structure vs Flexibility Balance

You want consistency for downstream workflows, but SPAs vary a lot. The best compromise is:

✅ **Fixed top-level structure + flexible substructure**

---

##### Recommended pattern: “Core schema + optional findings”

**Core schema (always present):**

- Parties, target, purchase price mechanism
- Closing mechanics
- Indemnities (cap/basket/survival)
- Escrow/holdback
- Covenants + leakage (if relevant)
- Termination / conditions precedent
- Dispute resolution / governing law

**Flexible additions (only if present):**

- Earn-out mechanics
- Locked box protections
- Material adverse change (MAC)
- Regulatory approvals
- Working capital peg details

---

##### Practical rule of thumb

- If it’s something you’ll **compare across deals** → make it structured and mandatory.
- If it’s something you’ll **read for nuance** → allow narrative, but enforce citations.

---

##### “Schema with escape hatches”

In your JSON, allow:

- `other_key_terms: []`
- `other_risks: []`
- `notes: ""`

This preserves consistency without losing nuance.

---

#### Chaining Analyses

The highest-performing SPA assistants are almost never “one prompt.” They’re **pipelines** where each stage produces a clean artifact the next stage can trust.

A practical chaining blueprint:

---

##### Chain A: Document understanding → clause extraction → deal summary

1. **Document map**
   Extract headings, section numbers, schedules, definition section location.

2. **Definitions dictionary**
   Key defined terms + citations (this becomes shared memory).

3. **Clause extraction modules** (parallelizable)
   - Purchase price mechanism module
   - Closing conditions module
   - Reps & warranties module
   - Indemnities module
     Each outputs structured JSON + evidence list.

4. **Cross-reference resolver**
   If clause says “as defined in Section X,” retrieve X and attach.

5. **Synthesis**
   Produce executive summary + issues list + diligence questions, strictly citing extracted evidence.

This style is consistent with “reason + act” paradigms where the model interleaves reasoning with tool actions (retrieve, look up, etc.), improving trustworthiness. ([arXiv][7])

---

##### Chain B: Generate → verify → revise (for high-stakes outputs)

When the answer matters (e.g., “Is there any cap on fundamental reps?”):

1. draft answer
2. create verification checklist (questions)
3. re-retrieve targeted clauses
4. final answer with stronger citations

That’s CoVe in a production-friendly shape. ([arXiv][5])

---

##### Key chaining principle: pass “state,” not prose

Each stage should pass a **state object** like:

- extracted terms (normalized)
- clause IDs + evidence excerpt IDs
- open questions / ambiguities

Avoid passing only narrative summaries, because summaries drop edge cases.

---

#### Few-Shot & Quality Techniques

Few-shot helps most when it demonstrates:

- **what “good citations” look like**
- **how to abstain**
- **how to separate extraction vs inference**

Chain-of-thought prompting research shows exemplars can improve multi-step reasoning. ([arXiv][8])
And self-consistency (sampling multiple reasoning paths and picking the most consistent) can improve reliability when reasoning is complex. ([arXiv][9])

---

##### 1) Few-shot example: evidence-first extraction (mini)

**Input excerpts**

- `E12`: “The Purchase Price shall be adjusted… based on Closing Working Capital…”
- `E13`: “Closing Working Capital means… excluding Cash and Indebtedness…”

**Desired output snippet**

- Evidence table:
  - Claim: “There is a working capital adjustment mechanism”
  - Quote: “…Purchase Price shall be adjusted… Closing Working Capital…”
  - Cite: `[E12]`

- Analysis:
  - “Mechanism is completion accounts / closing WC style; ‘Cash’ excluded via definition → watch for double counting.” `[E12][E13]`

This teaches: cite the mechanism _and_ the definition.

---

##### 2) Few-shot example: abstention (super important)

Show the model what to do when something is missing:

**Bad behavior to prevent:** guessing a cap/basket.
**Good pattern:**

- “Cap: `Not found in provided excerpts`.” (no speculation)
- “Ambiguity: Cap may be in Disclosure Letter / Schedule; request those docs.” `[E#]` (if the doc references them)

---

##### 3) Few-shot “edge cases” that SPAs love

Include 2–3 short exemplars for:

- tipping vs deductible basket
- separate caps for fundamental reps / tax / fraud carve-out
- “sole and exclusive remedy” clauses
- sandbagging / anti-sandbagging
- locked box + leakage definitions

These are exactly where hallucinations cause real pain.

---

##### 4) Use “negative examples” sparingly but strategically

One negative example can be powerful:

- show an answer that cites the wrong clause
- show the corrected behavior (“citation must directly support the claim”)

This aligns with how citation evaluation focuses on supportiveness, not just “a citation exists.” ([arXiv][1])

---

##### 5) Add automated quality gates (non-negotiable in production)

Even with perfect prompting, add gates:

- schema validation (JSON parse must succeed)
- citation IDs must exist
- quoted spans must match excerpt text
- “Not found” allowed and not treated as failure

If you want an external inspiration for automated checking of source relevance/supportiveness, there are agent-style evaluation pipelines in the literature (e.g., SourceCheckup). ([Nature][10])

---

##### 6) “Best-of-N” for synthesis steps

For high-level deal summaries:

- generate 3 candidates (same evidence set)
- select the one with best citation coverage / least unsupported claims
  This is essentially applying self-consistency ideas to summarization. ([arXiv][9])

---

If you want, paste a **single SPA section** (e.g., purchase price adjustment + definitions), and I’ll show you a concrete prompt template + an example output in the exact structure you’re aiming for (evidence table → analysis → diligence questions), with citation rules baked in. 🙂

[1]: https://arxiv.org/abs/2305.14627?utm_source=chatgpt.com "Enabling Large Language Models to Generate Text with Citations"
[2]: https://arxiv.org/abs/2005.11401?utm_source=chatgpt.com "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
[3]: https://aclanthology.org/2024.findings-acl.838.pdf?utm_source=chatgpt.com "Learning Fine-Grained Grounded Citations for Attributed ..."
[4]: https://aclanthology.org/2023.acl-long.910.pdf?utm_source=chatgpt.com "RARR: Researching and Revising What Language Models ..."
[5]: https://arxiv.org/abs/2309.11495?utm_source=chatgpt.com "Chain-of-Verification Reduces Hallucination in Large Language Models"
[6]: https://arxiv.org/abs/2303.08896?utm_source=chatgpt.com "SelfCheckGPT: Zero-Resource Black-Box Hallucination Detection for Generative Large Language Models"
[7]: https://arxiv.org/abs/2210.03629?utm_source=chatgpt.com "ReAct: Synergizing Reasoning and Acting in Language Models"
[8]: https://arxiv.org/abs/2201.11903?utm_source=chatgpt.com "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"
[9]: https://arxiv.org/abs/2203.11171?utm_source=chatgpt.com "Self-Consistency Improves Chain of Thought Reasoning in Language Models"
[10]: https://www.nature.com/articles/s41467-025-58551-6?utm_source=chatgpt.com "An automated framework for assessing how well LLMs cite ..."
