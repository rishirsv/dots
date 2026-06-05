import { promises as fs } from "node:fs";
import type { CaseCriteria, CaseFixture, CaseMetadata } from "./models.ts";

export interface SkillFrontmatter {
  name?: string;
  description?: string;
}

export interface AgentManifestMetadata {
  name?: string;
  description?: string;
  hasInterface: boolean;
}

interface YamlLine {
  indent: number;
  text: string;
}

export class MetadataError extends Error {
  exitCode = 1;
}

// Local YAML subset: nested maps, block lists, inline map list items,
// quoted/unquoted scalars, booleans, null, numbers, [] and {}.
export async function parseSkillFrontmatter(skillMd: string): Promise<SkillFrontmatter> {
  const parsed = parseOptionalFrontmatter(await fs.readFile(skillMd, "utf8"), skillMd);
  if (!parsed) return {};
  return decodeSkillFrontmatter(parsed.frontmatter, skillMd);
}

export function parseCaseFrontmatter(text: string, filePath: string): { metadata: CaseMetadata; criteria: CaseCriteria; body: string } {
  const parsed = parseRequiredFrontmatter(text, filePath, "case.md must start with YAML frontmatter");
  const frontmatter = parsed.frontmatter;
  const criteria = decodeObject(frontmatter, "criteria", filePath);
  return {
    body: parsed.body,
    metadata: {
      title: decodeString(frontmatter, "title", filePath, { defaultValue: "" }) ?? "",
      topics: decodeStringArray(frontmatter, "topics", filePath, { defaultValue: [] }),
      capability: decodeString(frontmatter, "capability", filePath, { optional: true }),
      fixtures: decodeFixtures(frontmatter, filePath),
      metadata: decodeObject(frontmatter, "metadata", filePath, { defaultValue: {} })
    },
    criteria: {
      what_it_tests: decodeString(criteria, "what_it_tests", filePath, { optional: true }),
      expected_behavior: decodeString(criteria, "expected_behavior", filePath, { defaultValue: "" }) ?? "",
      assertions: decodeStringArray(criteria, "assertions", filePath, { defaultValue: [] }),
      tests: decodeStringArray(criteria, "tests", filePath, { defaultValue: [] })
    }
  };
}

export async function parseAgentManifestMetadata(manifestPath: string): Promise<AgentManifestMetadata> {
  const text = await fs.readFile(manifestPath, "utf8");
  const frontmatter = parseYamlObject(text, manifestPath);
  return {
    name: decodeString(frontmatter, "name", manifestPath, { optional: true }),
    description: decodeString(frontmatter, "description", manifestPath, { optional: true }),
    hasInterface: Object.hasOwn(frontmatter, "interface")
  };
}

function decodeSkillFrontmatter(frontmatter: Record<string, unknown>, filePath: string): SkillFrontmatter {
  return {
    name: decodeString(frontmatter, "name", filePath, { optional: true }),
    description: decodeString(frontmatter, "description", filePath, { optional: true })
  };
}

function parseOptionalFrontmatter(text: string, filePath: string): { frontmatter: Record<string, unknown>; body: string } | null {
  if (!text.startsWith("---\n")) return null;
  return parseFrontmatter(text, filePath);
}

function parseRequiredFrontmatter(text: string, filePath: string, missingMessage: string): { frontmatter: Record<string, unknown>; body: string } {
  if (!text.startsWith("---\n")) throw new MetadataError(`${filePath}: ${missingMessage}`);
  return parseFrontmatter(text, filePath);
}

function parseFrontmatter(text: string, filePath: string): { frontmatter: Record<string, unknown>; body: string } {
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) throw new MetadataError(`${filePath}: frontmatter is not closed`);
  return {
    frontmatter: parseYamlObject(text.slice(4, end), filePath),
    body: text.slice(end + 5)
  };
}

function parseYamlObject(source: string, filePath: string): Record<string, unknown> {
  const lines = source
    .split(/\r?\n/)
    .map((raw) => ({ indent: raw.match(/^ */)?.[0].length || 0, text: raw.trim() }))
    .filter((line) => line.text && !line.text.startsWith("#"));
  const [value] = parseYamlNode(lines, 0, 0, filePath);
  return asObject(value, filePath, "frontmatter");
}

function parseYamlNode(lines: YamlLine[], index: number, indent: number, filePath: string): [unknown, number] {
  if (index >= lines.length || lines[index].indent < indent) return [{}, index];
  if (lines[index].indent === indent && lines[index].text.startsWith("- ")) return parseYamlArray(lines, index, indent, filePath);
  return parseYamlMap(lines, index, indent, filePath);
}

function parseYamlMap(lines: YamlLine[], index: number, indent: number, filePath: string): [Record<string, unknown>, number] {
  const out: Record<string, unknown> = {};
  while (index < lines.length) {
    const line = lines[index];
    if (line.indent < indent || line.text.startsWith("- ")) break;
    if (line.indent > indent) throw new MetadataError(`${filePath}: invalid frontmatter indentation near ${line.text}`);
    const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line.text);
    if (!match) throw new MetadataError(`${filePath}: invalid frontmatter line: ${line.text}`);
    const key = match[1];
    const rest = match[2] || "";
    if (rest) {
      out[key] = parseYamlScalar(rest);
      index += 1;
    } else {
      const nextIndent = lines[index + 1]?.indent;
      if (nextIndent === undefined || nextIndent <= indent) {
        out[key] = null;
        index += 1;
      } else {
        const parsed = parseYamlNode(lines, index + 1, nextIndent, filePath);
        out[key] = parsed[0];
        index = parsed[1];
      }
    }
  }
  return [out, index];
}

function parseYamlArray(lines: YamlLine[], index: number, indent: number, filePath: string): [unknown[], number] {
  const out: unknown[] = [];
  while (index < lines.length) {
    const line = lines[index];
    if (line.indent < indent || !line.text.startsWith("- ")) break;
    if (line.indent > indent) throw new MetadataError(`${filePath}: invalid list indentation near ${line.text}`);
    const rest = line.text.slice(2).trim();
    if (!rest) {
      const parsed = parseYamlNode(lines, index + 1, lines[index + 1]?.indent ?? indent + 2, filePath);
      out.push(parsed[0]);
      index = parsed[1];
      continue;
    }
    const inlineMap = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(rest);
    if (inlineMap) {
      const item: Record<string, unknown> = { [inlineMap[1]]: inlineMap[2] ? parseYamlScalar(inlineMap[2]) : null };
      index += 1;
      while (index < lines.length && lines[index].indent > indent) {
        const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(lines[index].text);
        if (!match) throw new MetadataError(`${filePath}: invalid frontmatter line: ${lines[index].text}`);
        if (match[2]) {
          item[match[1]] = parseYamlScalar(match[2]);
          index += 1;
        } else {
          const parsed = parseYamlNode(lines, index + 1, lines[index + 1]?.indent ?? lines[index].indent + 2, filePath);
          item[match[1]] = parsed[0];
          index = parsed[1];
        }
      }
      out.push(item);
    } else {
      out.push(parseYamlScalar(rest));
      index += 1;
    }
  }
  return [out, index];
}

function parseYamlScalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "[]") return [];
  if (trimmed === "{}") return {};
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function decodeString(
  source: Record<string, unknown>,
  key: string,
  filePath: string,
  options: { optional?: true; defaultValue?: string } = {}
): string | undefined {
  const value = source[key];
  if (value === undefined) return options.optional ? undefined : options.defaultValue;
  if (typeof value !== "string") throw new MetadataError(`${filePath}: frontmatter field '${key}' must be a string`);
  return value;
}

function decodeStringArray(source: Record<string, unknown>, key: string, filePath: string, options: { defaultValue: string[] }): string[] {
  const value = source[key];
  if (value === undefined) return options.defaultValue;
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new MetadataError(`${filePath}: frontmatter field '${key}' must be a list of strings`);
  }
  return value;
}

function decodeObject(
  source: Record<string, unknown>,
  key: string,
  filePath: string,
  options: { defaultValue?: Record<string, unknown> } = {}
): Record<string, unknown> {
  const value = source[key];
  if (value === undefined) return options.defaultValue || {};
  return asObject(value, filePath, `frontmatter field '${key}'`);
}

function decodeFixtures(source: Record<string, unknown>, filePath: string): CaseFixture[] {
  const value = source.fixtures;
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new MetadataError(`${filePath}: frontmatter field 'fixtures' must be a list of fixture objects`);
  return value.map((item, index) => {
    const fixture = asObject(item, filePath, `frontmatter field 'fixtures[${index}]'`);
    const fixturePath = decodeString(fixture, "path", filePath, { optional: true });
    if (!fixturePath) throw new MetadataError(`${filePath}: frontmatter field 'fixtures[${index}].path' must be a string`);
    const description = decodeString(fixture, "description", filePath, { optional: true });
    return { path: fixturePath, ...(description ? { description } : {}) };
  });
}

function asObject(value: unknown, filePath: string, label: string): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  throw new MetadataError(`${filePath}: ${label} must be an object`);
}
