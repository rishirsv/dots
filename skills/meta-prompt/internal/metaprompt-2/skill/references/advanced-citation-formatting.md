# Advanced Citation Formatting

Use this reference when the downstream prompt needs machine-readable citations, citable units, source IDs, line ranges, parser-ready citation markers, retrieved tool context citations, injected-context citations, or citation post-processing.

This reference is grounded in OpenAI's official Citation Formatting guide, saved locally at `../../sources/official-openai/citation-formatting-guide.md`.

Do not use this for ordinary research briefs unless the user asks for advanced citation control. For normal source-backed prose, use simple inline numeric citations and a final `References` section from `research-template.md`.

## Core Model

A reliable citation system needs five parts:

1. Define what can be cited.
2. Present source material clearly.
3. Specify the exact citation marker format.
4. Tell the downstream model when and how to cite.
5. Parse or validate citations before rendering them to the user.

## Choose Citable Units

Pick the citable unit before writing citation rules:

- Document-level: easy, but imprecise.
- Block or chunk-level: best default for most systems; balances accuracy and usability.
- Line range: most precise, but harder for the model and more formatting-sensitive.

A citable unit should be stable, inspectable, and the right size: large enough to make sense, small enough to verify a claim.

## Represent Citable Material

Require each source to have:

- Stable source ID, such as `turn0file1`, `block5`, or `url2`.
- Readable text.
- Optional metadata, such as title, URL, timestamp, document name, or update date.
- Optional locator, such as `L8-L13`, paragraph number, or block ID.

Keep source IDs separate from locators where possible. The source ID identifies the citable unit; the locator narrows the rendered evidence span.

## Recommended Marker Format

Use OpenAI-style marker placeholders in generated prompts:

```text
{CITATION_START}cite{CITATION_DELIMITER}<source_id>{CITATION_STOP}
{CITATION_START}cite{CITATION_DELIMITER}<source_id>{CITATION_DELIMITER}<locator>{CITATION_STOP}
```

Recommended codepoints when the target system can use raw markers:

- `CITATION_START`: U+E200
- `CITATION_DELIMITER`: U+E202
- `CITATION_STOP`: U+E201
- Citation family: `cite`

Use a locator only when the target system has reliable locators and the prompt explicitly asks for them. If not, omit the locator.

## Placement Rules

Include these rules when strict citation rendering matters:

- Place citations after the supported sentence or paragraph, after punctuation.
- Use inline citations inside long paragraphs only when different clauses rely on different sources.
- Do not group all citations at the end of the answer.
- Do not put citation markers inside Markdown bold, italics, inline code, tables if parsing is fragile, or fenced code blocks.
- Do not place citation markers alone on a line.
- Do not write raw source IDs in normal prose unless they are inside citation markers.
- Cite only sources that directly support the claim.
- Never invent source IDs, line ranges, block IDs, or locators.
- If sources disagree, cite the conflicting sources and describe the disagreement accurately.

## Retrieved Tool Context Pattern

Use this when a retrieval tool returns citable material.

Prompt ingredients:

- Name the retrieval tool or source provider.
- Define how source IDs appear in tool output.
- Define whether line locators are required.
- Define single-source and multi-source citation shapes.
- Forbid citing uncited or unmarked tool results.

Compact instruction block:

```markdown
## Citations
Results are returned by `{tool_name}`. Each result is a citable source with a stable reference ID such as `turn0file0`.

Cite any source-supported claim using:
`{CITATION_START}cite{CITATION_DELIMITER}<source_id>{CITATION_STOP}`

If line ranges are available and required, cite precise spans using:
`{CITATION_START}cite{CITATION_DELIMITER}<source_id>{CITATION_DELIMITER}Lx-Ly{CITATION_STOP}`

Citations to multiple supporting sources must be emitted as separate citation markers, one per source. Cite only retrieved sources that directly support the cited text. Never invent source IDs, line ranges, or locators.
```

## Injected Context Pattern

Use this when source text is prepared before the model call and placed directly in the prompt.

Wrap citable material with stable IDs:

```xml
<BLOCK id="block1">
Source text here.
</BLOCK>
```

Prompt the model to cite only those IDs:

```markdown
## Citations
Supporting context is provided directly in the prompt as citable units. Each citable unit is identified by the `id` attribute in tags such as `<BLOCK id="block5">...</BLOCK>`.

Cite a single source as:
`{CITATION_START}cite{CITATION_DELIMITER}<block_id>{CITATION_STOP}`

Citations to multiple supporting blocks must be emitted as separate citation markers, one per block. Cite only blocks that appear in the provided context. Never invent block IDs or cite outside knowledge.
```

## When To Keep It Simpler

Do not add advanced markers when the user only needs a readable memo, report, or brief with citations. In those cases, use numeric inline citations and a final `References` section.

Advanced citation prompts are worth the extra structure when:

- an application will parse and render citations automatically
- citations need to map to retrieved chunks or source IDs
- line-level or block-level verification matters
- source text is injected into the prompt as citable units
- the model must cite tool outputs rather than open web URLs
