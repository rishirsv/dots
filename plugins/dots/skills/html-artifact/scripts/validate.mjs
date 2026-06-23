#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  extractCssBlocks,
  extractMarkedRegion,
  extractThemeCssFromHtml,
  listFiles,
  readText,
  readThemeCss,
  skillRoot,
  themePath,
} from "./theme-regions.mjs";

// Development-only guardrail for this payload. This script
// runs from repo verification to keep theme.css, reference sheet examples, and docs from
// drifting; it is not bundled into generated reader artifacts.
const failures = [];

function fail(message) {
  failures.push(message);
}

function rel(filePath) {
  return path.relative(skillRoot, filePath);
}

function stripSvg(text) {
  return text.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function visibleReferenceText(html) {
  return decodeHtmlEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
      .replace(/<code[\s\S]*?<\/code>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ").trim();
}

function templatePayloadText(html) {
  return [...html.matchAll(/<template\b[^>]*>([\s\S]*?)<\/template>/gi)]
    .map((match) => decodeHtmlEntities(match[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function checkReferenceCopy(referenceText) {
  const forbidden = [
    ["old reference name", new RegExp(["Primitive", "Atlas"].join("\\s+"), "i")],
    ["skill label", new RegExp(`\\b${["html-artifact", "skill"].join("\\s+")}\\b|\\bskill\\b`, "i")],
    ["agent label", /\bagent\b/i],
    ["goal wording", /\bgoals?\b/i],
    ["runtime label", /\bruntime\b/i],
    ["primitive label", /\bprimitives?\b/i],
    ["data attribute label", /\bdata-(?:artifact|primitive|slot|variant|state)\b/i],
    ["source path prose", /references\//i],
    ["handoff actor leak", new RegExp(`\\b${["next", "agent"].join("\\s+")}\\b`, "i")],
    ["style-source leak", /\bruntime styles\b/i],
    ["template wording", /\btemplate machinery\b/i],
    ["negative-scope wording", new RegExp("\\bnon-" + "goals?\\b", "i")],
    ["prompt-role wording", new RegExp("\\b(system\\s+" + "developer|developer\\s+meta|meta\\s+text)\\b", "i")],
  ];

  const visibleText = visibleReferenceText(referenceText);
  const payloadText = templatePayloadText(referenceText);
  for (const [label, pattern] of forbidden) {
    if (pattern.test(visibleText)) {
      fail(`html-artifact-reference.html visible text contains ${label}.`);
    }
    if (pattern.test(payloadText)) {
      fail(`html-artifact-reference.html copy/export payload contains ${label}.`);
    }
  }
}

function hexMatches(text) {
  return [...text.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)];
}

function declarationMap(block) {
  const map = new Map();
  for (const match of block.matchAll(/--([A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(match[1], match[2].trim());
  }
  return map;
}

function mapsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (b.get(key) !== value) return false;
  }
  return true;
}

function luminance(hex) {
  const raw = hex.replace("#", "");
  const parts = raw.length === 3
    ? raw.split("").map((c) => c + c)
    : [raw.slice(0, 2), raw.slice(2, 4), raw.slice(4, 6)];
  const rgb = parts.map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  if (!match) {
    throw new Error(`Missing token block for ${selector}`);
  }
  return match[1];
}

function extractDataPrimitiveIds(text) {
  return new Set(
    [...text.matchAll(/data-primitive=(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9-]+))/g)]
      .map((match) => match[1] || match[2] || match[3])
      .filter(Boolean),
  );
}

function extractDataBaseIds(text) {
  return new Set(
    [...text.matchAll(/data-base=(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9-]+))/g)]
      .map((match) => match[1] || match[2] || match[3])
      .filter(Boolean),
  );
}

function extractDataCompositeIds(text) {
  return new Set(
    [...text.matchAll(/data-composite=(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9-]+))/g)]
      .map((match) => match[1] || match[2] || match[3])
      .filter(Boolean),
  );
}

function extractThemeRegions(themeCss) {
  return new Set(
    [...themeCss.matchAll(/\/\* html-artifact:region:([A-Za-z0-9-]+):start \*\//g)]
      .map((match) => match[1]),
  );
}

function extractMarkdownSections(text) {
  return new Set(
    [...text.matchAll(/^## ([A-Za-z0-9-]+)$/gm)]
      .map((match) => match[1]),
  );
}

function extractArchetypeSections(text) {
  return new Set(
    [...text.matchAll(/^## Archetype: ([a-z][a-z0-9-]+)$/gm)]
      .map((match) => match[1]),
  );
}

function parsePrimitiveRegistry(text) {
  const rows = [];
  let inRegistry = false;
  for (const line of text.split("\n")) {
    if (line.trim() === "## Primitive Registry") {
      inRegistry = true;
      continue;
    }
    if (inRegistry && /^## /.test(line)) break;
    if (!inRegistry || !line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line) || /\|\s*Primitive\s*\|/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 6) {
      fail(`primitives.md registry row has ${cells.length} cells, expected 6: ${line}`);
      continue;
    }
    const primitiveMatch = cells[0].match(/^`([^`]+)`$/);
    if (!primitiveMatch) {
      fail(`primitives.md registry primitive must be a single backticked id: ${cells[0]}`);
      continue;
    }
    rows.push({
      id: primitiveMatch[1],
      archetype: cells[1],
      slots: [...cells[2].matchAll(/`([^`]+)`/g)].map((match) => match[1]),
      variants: extractRegistryTokens(cells[3], "variants?"),
      states: extractRegistryTokens(cells[3], "states?").filter((state) => state !== "data-theme"),
      cssOwner: cells[4].replace(/^`|`$/g, ""),
      recipes: cells[5],
    });
  }
  return rows;
}

function extractRegistryTokens(text, labelPattern) {
  const tokens = [];
  for (const match of text.matchAll(new RegExp(`${labelPattern} ([^;]+)`, "g"))) {
    for (const token of match[1].matchAll(/`([^`]+)`/g)) {
      tokens.push(token[1]);
    }
  }
  return tokens;
}

function extractBacktickedIds(text) {
  return new Set([...text.matchAll(/`([a-z][a-z0-9-]+)`/g)].map((match) => match[1]));
}

function markdownSection(text, heading) {
  const marker = `## ${heading}\n`;
  const start = text.indexOf(marker);
  if (start === -1) return "";
  const bodyStart = start + marker.length;
  const next = text.indexOf("\n## ", bodyStart);
  return text.slice(bodyStart, next === -1 ? text.length : next);
}

function parseMarkdownTableRows(sectionText) {
  const rows = [];
  for (const line of sectionText.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function parseSingleBacktickedCell(cell) {
  const match = cell.match(/^`([a-z][a-z0-9-]+)`$/);
  return match ? match[1] : "";
}

function parseBaseRegistry(compositionText) {
  const rows = parseMarkdownTableRows(markdownSection(compositionText, "Visual Base Registry"));
  const bases = new Set();
  for (const cells of rows.slice(1)) {
    const id = parseSingleBacktickedCell(cells[0] || "");
    if (!id) {
      fail(`composition.md Visual Base Registry base must be a single backticked id: ${cells[0] || ""}`);
      continue;
    }
    if (bases.has(id)) fail(`composition.md repeats base ${id}.`);
    bases.add(id);
  }
  return bases;
}

function parseRecipeBaseDefaults(compositionText) {
  const rows = parseMarkdownTableRows(markdownSection(compositionText, "Recipe Base Defaults"));
  return rows.slice(1).map((cells) => ({
    recipe: parseSingleBacktickedCell(cells[0] || ""),
    base: parseSingleBacktickedCell(cells[1] || ""),
    raw: cells.join(" | "),
  }));
}

function parseAliasRows(compositionText) {
  const rows = parseMarkdownTableRows(markdownSection(compositionText, "Document Alias Map"));
  return rows.slice(1).map((cells) => ({
    wording: cells[0] || "",
    recipe: parseSingleBacktickedCell(cells[1] || ""),
    base: parseSingleBacktickedCell(cells[2] || ""),
    raw: cells.join(" | "),
  }));
}

function recipeBlock(text, recipe) {
  const heading = `## ${recipe}\n`;
  const start = text.indexOf(heading);
  if (start === -1) return "";
  const bodyStart = start + heading.length;
  const next = text.indexOf("\n## ", bodyStart);
  return text.slice(bodyStart, next === -1 ? text.length : next);
}

function referenceSpecimenText(referenceHtml, primitive) {
  const parts = referenceHtml.split(/(?=<div class="specimen">)/g);
  const named = parts.find((part) => part.includes(`<span class="pname">${primitive}</span>`));
  if (named) return named;

  const bodyHtml = referenceHtml
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  const primitivePattern = new RegExp(`data-primitive=(?:"${primitive}"|'${primitive}'|${primitive})`);
  const match = bodyHtml.match(primitivePattern);
  if (!match) return "";
  return bodyHtml.slice(Math.max(0, match.index - 200), Math.min(bodyHtml.length, match.index + 2200));
}

function checkReferenceAnatomy({ referenceText, registry }) {
  for (const row of registry.values()) {
    const specimen = referenceSpecimenText(referenceText, row.id);
    if (!specimen) {
      fail(`html-artifact-reference.html has no inspectable specimen for registered primitive ${row.id}.`);
      continue;
    }
    for (const slot of row.slots) {
      if (!new RegExp(`data-slot=(?:"${slot}"|'${slot}'|${slot})`).test(specimen)) {
        fail(`html-artifact-reference.html specimen ${row.id} is missing required slot ${slot}.`);
      }
    }
    if (row.variants.length && !row.variants.some((variant) => specimen.includes(`data-variant="${variant}"`) || specimen.includes(`variant: ${variant}`) || specimen.includes(`>${variant}<`))) {
      fail(`html-artifact-reference.html specimen ${row.id} does not show any documented variant.`);
    }
    if (row.states.length && !row.states.some((state) => specimen.includes(`data-state="${state}"`) || specimen.includes(`state: ${state}`) || specimen.includes(`>${state}<`))) {
      fail(`html-artifact-reference.html specimen ${row.id} does not show any documented state.`);
    }
  }
}

function checkReferenceCompositeSpecimens(referenceText) {
  const expected = [
    "executive-brief",
    "diligence-report",
    "integration-plan",
    "product-spec",
    "code-review",
    "design-qa",
    "design-system-reference",
    "architecture-map",
    "system-card-eval-report",
    "bounded-workbench",
  ];
  const seen = extractDataCompositeIds(referenceText);
  for (const id of expected) {
    if (!seen.has(id)) {
      fail(`html-artifact-reference.html is missing composite specimen ${id}.`);
    }
  }
}

function checkInlineChartBackingData(referenceText) {
  for (const match of referenceText.matchAll(/<figure\b[^>]*data-primitive="inline-chart"[\s\S]*?<\/figure>/g)) {
    const specimen = match[0];
    if (!/data-slot="chart"/.test(specimen)) {
      fail("html-artifact-reference.html inline-chart specimen is missing data-slot=\"chart\".");
    }
    if (!/data-slot="data-table"[\s\S]*?<table\b/.test(specimen)) {
      fail("html-artifact-reference.html inline-chart specimen must include a visible data-table with table values.");
    }
  }
}

function checkWorkbenchFallback(referenceText) {
  const workbenchBoard = referenceSpecimenText(referenceText, "workbench-board");
  if (!/data-slot="column"/.test(workbenchBoard) || !/data-slot="card"/.test(workbenchBoard)) {
    fail("html-artifact-reference.html workbench-board specimen must include visible columns and cards for JS-disabled reading.");
  }
  if (!/data-slot="export"[\s\S]*data-primitive="copy-export"/.test(workbenchBoard)) {
    fail("html-artifact-reference.html workbench-board specimen must include a copy-export control.");
  }

  const promptPreview = referenceSpecimenText(referenceText, "prompt-preview");
  for (const slot of ["prompt", "variable", "case", "preview", "copy"]) {
    if (!new RegExp(`data-slot="${slot}"`).test(promptPreview)) {
      fail(`html-artifact-reference.html prompt-preview specimen is missing visible slot ${slot}.`);
    }
  }

  const bounded = referenceText.match(/data-composite="bounded-workbench"[\s\S]*?<\/article>/);
  if (!bounded || !/data-slot="column"/.test(bounded[0]) || !/data-slot="card"/.test(bounded[0])) {
    fail("html-artifact-reference.html bounded-workbench composite must keep board content visible without JS.");
  }
}

function checkRegistryClosure({ themeCss }) {
  const primitivesPath = path.join(skillRoot, "references/primitives.md");
  const recipesPath = path.join(skillRoot, "references/recipes.md");
  const compositionPath = path.join(skillRoot, "references/composition.md");
  const referencePath = path.join(skillRoot, "assets/html-artifact-reference.html");

  const primitivesText = readText(primitivesPath);
  const recipesText = readText(recipesPath);
  const compositionText = readText(compositionPath);
  const referenceText = readText(referencePath);
  checkReferenceCopy(referenceText);

  const registryRows = parsePrimitiveRegistry(primitivesText);
  const registry = new Map();
  const archetypeSections = extractArchetypeSections(primitivesText);
  for (const row of registryRows) {
    if (registry.has(row.id)) fail(`primitives.md registry repeats primitive ${row.id}.`);
    registry.set(row.id, row);
    if (!row.archetype) fail(`primitives.md registry ${row.id} is missing an archetype.`);
    if (!archetypeSections.has(row.archetype)) {
      fail(`primitives.md registry ${row.id} uses unknown archetype ${row.archetype}.`);
    }
    if (!row.slots.length) fail(`primitives.md registry ${row.id} has no required slots.`);
    if (!row.cssOwner) fail(`primitives.md registry ${row.id} is missing a CSS owner.`);
  }
  if (!registry.size) fail("primitives.md must contain a non-empty Primitive Registry table.");

  const themeRegions = extractThemeRegions(themeCss);
  for (const row of registry.values()) {
    if (row.cssOwner !== "none" && !themeRegions.has(row.cssOwner)) {
      fail(`primitives.md registry ${row.id} uses unknown CSS owner ${row.cssOwner}.`);
    }
  }

  const recipeSections = extractMarkdownSections(recipesText);
  const baseIds = parseBaseRegistry(compositionText);
  if (!baseIds.size) fail("composition.md must contain a non-empty Visual Base Registry table.");

  const recipeChooser = markdownSection(compositionText, "Recipe Chooser");
  const compositionIds = new Set(
    recipeChooser
      ? [...recipeChooser.matchAll(/\|\s*[^|\n]+\|\s*`([a-z][a-z0-9-]+)`\s*\|/g)]
        .map((match) => match[1])
      : [],
  );
  if (!recipeChooser) fail("composition.md must contain a Recipe Chooser section.");
  for (const recipe of compositionIds) {
    if (!recipeSections.has(recipe)) {
      fail(`composition.md references recipe ${recipe}, but recipes.md has no matching section.`);
    }
  }
  for (const recipe of recipeSections) {
    if (!compositionIds.has(recipe)) {
      fail(`recipes.md section ${recipe} is missing from composition.md Recipe Chooser.`);
    }
    const block = recipeBlock(recipesText, recipe);
    for (const label of ["Use for:", "Source gates:", "Default skeleton:", "Add only when evidenced:", "Avoid:"]) {
      if (!block.includes(label)) {
      fail(`recipes.md section ${recipe} is missing required card label "${label}".`);
      }
    }
  }

  const defaultRows = parseRecipeBaseDefaults(compositionText);
  if (!defaultRows.length) fail("composition.md must contain Recipe Base Defaults.");
  const defaultRecipes = new Set();
  for (const row of defaultRows) {
    if (!row.recipe || !row.base) {
      fail(`composition.md Recipe Base Defaults row must use backticked recipe and base ids: ${row.raw}`);
      continue;
    }
    if (!recipeSections.has(row.recipe)) {
      fail(`composition.md Recipe Base Defaults maps unknown recipe ${row.recipe}.`);
    }
    if (!baseIds.has(row.base)) {
      fail(`composition.md Recipe Base Defaults maps ${row.recipe} to unknown base ${row.base}.`);
    }
    if (defaultRecipes.has(row.recipe)) fail(`composition.md repeats Recipe Base Defaults for ${row.recipe}.`);
    defaultRecipes.add(row.recipe);
  }
  for (const recipe of recipeSections) {
    if (!defaultRecipes.has(recipe)) {
      fail(`recipes.md section ${recipe} is missing from composition.md Recipe Base Defaults.`);
    }
  }
  for (const recipe of compositionIds) {
    if (!defaultRecipes.has(recipe)) {
      fail(`composition.md Recipe Chooser recipe ${recipe} has no default base.`);
    }
  }

  const aliasRows = parseAliasRows(compositionText);
  if (!aliasRows.length) fail("composition.md must contain Document Alias Map rows.");
  for (const row of aliasRows) {
    if (!row.wording) fail(`composition.md Document Alias Map row is missing document wording: ${row.raw}`);
    if (!row.recipe || !row.base) {
      fail(`composition.md Document Alias Map row must use backticked recipe and base ids: ${row.raw}`);
      continue;
    }
    if (!recipeSections.has(row.recipe)) {
      fail(`composition.md Document Alias Map maps unknown recipe ${row.recipe}.`);
    }
    if (!baseIds.has(row.base)) {
      fail(`composition.md Document Alias Map maps ${row.wording} to unknown base ${row.base}.`);
    }
  }

  const compositionRefs = extractBacktickedIds(compositionText);
  const allowedCompositionRefs = new Set([
    ...registry.keys(),
    ...recipeSections,
    ...archetypeSections,
    ...baseIds,
    "data-artifact",
    "data-base",
  ]);
  for (const ref of compositionRefs) {
    if (!allowedCompositionRefs.has(ref)) {
      fail(`composition.md references unknown recipe, base, archetype, or primitive ${ref}.`);
    }
  }

  const recipeRefs = extractBacktickedIds(recipesText);
  const allowedRecipeRefs = new Set([...registry.keys(), ...recipeSections]);
  for (const ref of recipeRefs) {
    if (!allowedRecipeRefs.has(ref)) {
      fail(`recipes.md references unknown primitive or recipe ${ref}.`);
    }
  }

  const docsPrimitiveIds = new Set(
    [...primitivesText.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]),
  );
  for (const id of docsPrimitiveIds) {
    if (!registry.has(id)) fail(`primitives.md table row ${id} was not parsed into the registry.`);
  }

  const referenceIds = extractDataPrimitiveIds(referenceText);
  const referenceBases = extractDataBaseIds(referenceText);
  const themeIds = extractDataPrimitiveIds(themeCss);
  for (const id of referenceIds) {
    if (!registry.has(id)) fail(`html-artifact-reference.html uses unregistered primitive ${id}.`);
  }
  for (const id of referenceBases) {
    if (!baseIds.has(id)) fail(`html-artifact-reference.html uses unregistered base ${id}.`);
  }
  for (const id of themeIds) {
    if (!registry.has(id)) fail(`theme.css styles unregistered primitive ${id}.`);
  }
  for (const id of registry.keys()) {
    if (!referenceIds.has(id)) fail(`html-artifact-reference.html is missing a specimen for registered primitive ${id}.`);
  }
  checkReferenceAnatomy({ referenceText, registry });
  checkReferenceCompositeSpecimens(referenceText);
  checkInlineChartBackingData(referenceText);
  checkWorkbenchFallback(referenceText);
}

function checkThemeCss(themeCss) {
  // Manual dark mode and OS dark mode must stay token-identical so users do not
  // see different palettes depending on how dark mode was activated.
  const mediaMatch = themeCss.match(/@media \(prefers-color-scheme: dark\) \{ :root:not\(\[data-theme="light"\]\) \{ ([^}]+) \} \}/);
  const manualMatch = themeCss.match(/:root\[data-theme="dark"\] \{ ([^}]+) \}/);
  if (!mediaMatch || !manualMatch) {
    fail("theme.css must contain both OS dark and manual dark token blocks.");
  } else if (!mapsEqual(declarationMap(mediaMatch[1]), declarationMap(manualMatch[1]))) {
    fail("theme.css dark media-query tokens differ from :root[data-theme=\"dark\"] tokens.");
  }

  const allowedHexSpans = [];
  const addRegexSpan = (regex) => {
    const match = themeCss.match(regex);
    if (match) allowedHexSpans.push([match.index, match.index + match[0].length]);
  };
  // Raw hex belongs only in canonical token declarations. Component rules must
  // consume variables so visual changes have one editable source.
  addRegexSpan(/:root\s*\{[^}]+\}/);
  addRegexSpan(/@media \(prefers-color-scheme: dark\) \{ :root:not\(\[data-theme="light"\]\) \{ [^}]+ \} \}/);
  addRegexSpan(/:root\[data-theme="dark"\] \{ [^}]+ \}/);
  for (const match of hexMatches(themeCss)) {
    const ok = allowedHexSpans.some(([start, end]) => match.index >= start && match.index < end);
    if (!ok) fail(`theme.css has raw hex outside token declarations: ${match[0]}`);
  }

  if (!/\[data-primitive="code-panel"\]\[data-variant="dark"\] \[data-slot="code"\] \{ background: var\(--code-surface\); \}/.test(themeCss)) {
    fail("theme.css dark code-panel background must use --code-surface.");
  }
  if (!/\[data-slot="hunk"\] \{ background: var\(--code-surface\);/.test(themeCss)) {
    fail("theme.css diff hunk background must use --code-surface.");
  }
  if (/background(?:-color)?:\s*var\(--text/.test(themeCss)) {
    fail("theme.css keys a background off a text variable.");
  }
  if (!/@media print \{ \[data-primitive="theme-toggle"\] \{ display: none; \} \}/.test(themeCss)) {
    fail("theme.css must hide theme-toggle in print.");
  }

  const rootMap = declarationMap(tokenBlock(themeCss, ":root"));
  const darkMap = manualMatch ? declarationMap(manualMatch[1]) : new Map();
  // The contrast list is intentionally focused on tokens that are most likely
  // to regress during polish: page text plus status foreground/background pairs
  // in both themes.
  const pairs = [
    ["light text/bg", rootMap.get("text"), rootMap.get("bg")],
    ["light body/bg", rootMap.get("text-body"), rootMap.get("bg")],
    ["light danger status", rootMap.get("danger-strong"), rootMap.get("danger-soft")],
    ["light success status", rootMap.get("success-strong"), rootMap.get("success-soft")],
    ["light warning status", rootMap.get("warning-strong"), rootMap.get("warning-soft")],
    ["light info status", rootMap.get("info-strong"), rootMap.get("info-soft")],
    ["light pending status", rootMap.get("pending-strong"), rootMap.get("pending-soft")],
    ["dark text/bg", darkMap.get("text"), darkMap.get("bg")],
    ["dark body/bg", darkMap.get("text-body"), darkMap.get("bg")],
    ["dark danger status", darkMap.get("danger-strong"), darkMap.get("danger-soft")],
    ["dark success status", darkMap.get("success-strong"), darkMap.get("success-soft")],
    ["dark warning status", darkMap.get("warning-strong"), darkMap.get("warning-soft")],
    ["dark info status", darkMap.get("info-strong"), darkMap.get("info-soft")],
    ["dark pending status", darkMap.get("pending-strong"), darkMap.get("pending-soft")],
  ];
  for (const [name, fg, bg] of pairs) {
    if (!fg || !bg || !/^#[0-9A-Fa-f]{6}$/.test(fg) || !/^#[0-9A-Fa-f]{6}$/.test(bg)) {
      fail(`Cannot check contrast for ${name}; missing 6-digit color token.`);
      continue;
    }
    if (contrast(fg, bg) < 4.5) {
      fail(`${name} contrast is below AA: ${contrast(fg, bg).toFixed(2)}`);
    }
  }
}

function checkHtmlFile(filePath, themeCss) {
  const html = readText(filePath);
  const file = rel(filePath);
  let embeddedTheme;
  try {
    embeddedTheme = extractThemeCssFromHtml(html);
  } catch (error) {
    fail(`${file}: ${error.message}`);
    return;
  }
  if (embeddedTheme.trimEnd() !== themeCss.trimEnd()) {
    fail(`${file}: embedded theme.css region differs from assets/theme.css.`);
  }

  // The reference sheet is standalone HTML, so it must carry one real toggle example, but
  // generated artifacts should not grow multiple competing theme controls.
  const themeToggleButtons = [...html.matchAll(/<button\b[^>]*data-primitive="theme-toggle"[^>]*>/g)];
  if (themeToggleButtons.length !== 1) {
    fail(`${file}: expected exactly one theme-toggle button, found ${themeToggleButtons.length}.`);
  }

  const withoutTheme = html.replace(
    /\/\* html-artifact:theme\.css:start \*\/[\s\S]*?\/\* html-artifact:theme\.css:end \*\//,
    "",
  );
  const cssBlocks = extractCssBlocks(withoutTheme).join("\n");
  if (/:root\s*\{/.test(cssBlocks)) {
    fail(`${file}: local CSS must not redefine :root tokens.`);
  }
  // Local reference sheet chrome can frame specimens, but primitive styling remains owned
  // by theme.css. The shell schematic is the one documented exception because
  // it labels regions of the artifact shell rather than restyling a primitive.
  for (const match of cssBlocks.matchAll(/\[data-primitive=(?:"([^"]+)"|'([^']+)'|([^\]\s]+))/g)) {
    const primitive = match[1] || match[2] || match[3];
    if (!(file === "assets/html-artifact-reference.html" && primitive === "artifact-shell")) {
      fail(`${file}: local CSS targets canonical primitive ${primitive}.`);
    }
  }

  const rawSurface = stripSvg(withoutTheme);
  for (const match of hexMatches(rawSurface)) {
    fail(`${file}: raw hex outside theme block or inline SVG demo art: ${match[0]}`);
  }
}

function checkMarkdownAndYaml() {
  // Shipped docs should explain the contract without becoming a second token
  // source. Hex values and stale DESIGN.md references are therefore failures.
  for (const filePath of listFiles(skillRoot, (file) => /\.(md|ya?ml)$/.test(file))) {
    const file = rel(filePath);
    const text = readText(filePath);
    if (/DESIGN\.md|references\/DESIGN/.test(text)) {
      fail(`${file}: stale DESIGN.md reference.`);
    }
    for (const match of hexMatches(text)) {
      fail(`${file}: raw hex value in shipped docs: ${match[0]}`);
    }
  }
}

function main() {
  const themeCss = readThemeCss();
  if (!fs.existsSync(themePath)) {
    fail("Missing assets/theme.css.");
  }
  checkThemeCss(themeCss);
  checkRegistryClosure({ themeCss });
  for (const htmlFile of listFiles(path.join(skillRoot, "assets"), (file) => file.endsWith(".html"))) {
    checkHtmlFile(htmlFile, themeCss);
  }
  checkMarkdownAndYaml();

  if (failures.length) {
    console.error("html-artifact validation failed:");
    for (const message of failures) console.error(`- ${message}`);
    process.exit(1);
  }
  console.log("html-artifact validation passed");
}

main();
