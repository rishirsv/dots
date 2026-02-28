# SPA Analysis: Gold-Standard Example

## Role
You are a partner-level M&A financial advisor who has reviewed hundreds of SPAs. You specialize in financial due diligence and can identify every nuance in purchase price mechanics and financial definitions.

## Context
I am uploading `context.zip` containing:
- A Stock Purchase Agreement (BWAY Corporation / Central Can Company, 2009)
- The specification for an SPA analysis tool I'm building

Your task is to analyze this SPA and produce **gold-standard output** that I can use as a reference for my tool.

Rules:
- Start by reading `context/MANIFEST.md`
- Use only what you can support from the actual document
- For every finding, cite the specific section/clause
- Do not ask questions; state assumptions and proceed

## Task

Analyze the BWAY Corporation SPA's **Key Financial Definitions** and produce exemplary output.

### Definitions to Analyze

For each of these 5 definitions, extract and analyze:

1. **Indebtedness** (Section 1.1)
2. **Cash and Cash Equivalents** (if defined, or note absence)
3. **Working Capital** (if defined, or note absence)
4. **Company Transaction Expenses** (Section 1.1)
5. **Accounting Principles** (how calculations are governed)

### What I Need for Each Definition

For each definition found:

| Field | What to Extract |
|-------|-----------------|
| **Summary** | Plain-English explanation of what's included/excluded |
| **Bias Rating** | Highly Buyer-Favorable / Buyer-Favorable / Neutral / Seller-Favorable / Highly Seller-Favorable |
| **Key Observations** | Notable inclusions, exclusions, or unusual language |
| **Double-Count Risks** | Items that might overlap with other definitions |
| **Gap Risks** | Items that might fall through the cracks |
| **Market Comparison** | How this compares to typical SPAs |
| **Source** | Exact section/page reference |

### Output Format

Produce your analysis in this table format:

```
| Definition | Summary | Bias | Key Observations |
|------------|---------|------|------------------|
| Indebtedness | [2-3 sentence summary] | [Rating with emoji] | [Bullet points] |
| ... | ... | ... | ... |
```

Then provide a **detailed breakdown** for each definition with the full analysis fields.

### Bias Rating Scale

Use these ratings (emoji + label):

| Rating | When to Use |
|--------|-------------|
| 🔴 Highly Buyer-Favorable | Significantly advantages buyer beyond market norms |
| 🟠 Buyer-Favorable | Leans toward buyer interests |
| 🟢 Neutral | Balanced or market standard |
| 🟠 Seller-Favorable | Leans toward seller interests |
| 🔴 Highly Seller-Favorable | Significantly advantages seller beyond market norms |

### Additional Analysis Requested

After the definitions analysis, please also provide:

1. **Overall Assessment**: How buyer-friendly or seller-friendly is this SPA's financial framework overall?

2. **Notable Patterns**: What's unusual about this SPA compared to typical deals?

3. **What's Missing**: What standard definitions or protections are absent?

4. **If You Were Advising the Buyer**: What 3 things would you flag as concerns?

5. **If You Were Advising the Seller**: What 3 things would you flag as wins?

## Why This Matters

I'm building a Custom GPT that will analyze SPAs. Your output will serve as the gold standard that I use to:
- Define what "excellent" analysis looks like
- Calibrate bias ratings
- Understand what observations matter most
- Structure the output format

Please make this analysis as thorough and useful as possible. This is a real SPA, so you can be specific about the actual language and provisions you find.
