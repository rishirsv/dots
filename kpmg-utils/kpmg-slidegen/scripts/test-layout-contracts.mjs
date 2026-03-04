import fs from 'node:fs';
import path from 'node:path';
import { getSlideRegistry } from '../generator/runtime/slide-registry.js';

function readJson(relPath) {
  const absPath = path.join(process.cwd(), relPath);
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function sortedUnique(values) {
  return Array.from(new Set(values)).sort();
}

function diff(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((item) => !actualSet.has(item));
}

function extractTemplateTypes() {
  const layouts = readJson('templates/kpmg-diligence/package/layouts.json');
  return sortedUnique(Object.keys(layouts.types || {}));
}

function extractSchemaTypes() {
  const schemaPathCandidates = [
    'docs/DECKSPEC-SLOTS-SCHEMA.json',
    'skills/kpmg-slides/references/deckspec.schema.json',
  ];
  const schemaPath = schemaPathCandidates.find((candidate) =>
    fs.existsSync(path.join(process.cwd(), candidate)),
  );
  if (!schemaPath) {
    throw new Error(
      `Unable to locate schema file. Checked: ${schemaPathCandidates.join(', ')}`,
    );
  }
  const schema = readJson(schemaPath);
  const defs = schema.$defs || {};
  const types = [];
  for (const [defName, def] of Object.entries(defs)) {
    if (defName === 'slide') continue;
    const typeConst = def?.properties?.type?.const;
    if (typeof typeConst === 'string' && typeConst.length > 0) {
      types.push(typeConst);
    }
  }
  return sortedUnique(types);
}

function extractRuntimeTypes() {
  const registry = getSlideRegistry();
  return sortedUnique(registry.list());
}

function printMismatch(header, items) {
  if (!items.length) return;
  console.error(`\n${header} (${items.length})`);
  for (const item of items) console.error(`- ${item}`);
}

const templateTypes = extractTemplateTypes();
const schemaTypes = extractSchemaTypes();
const runtimeTypes = extractRuntimeTypes();

const missingInSchema = diff(templateTypes, schemaTypes);
const extraInSchema = diff(schemaTypes, templateTypes);
const missingInRuntime = diff(templateTypes, runtimeTypes);
const extraInRuntime = diff(runtimeTypes, templateTypes);

if (missingInSchema.length || extraInSchema.length || missingInRuntime.length || extraInRuntime.length) {
  console.error('Layout contract mismatch detected.');
  printMismatch('Template types missing in docs schema', missingInSchema);
  printMismatch('Docs schema types not in template', extraInSchema);
  printMismatch('Template types missing in runtime dispatch', missingInRuntime);
  printMismatch('Runtime dispatch types not in template', extraInRuntime);
  process.exit(1);
}

console.log('Layout contract check passed.');
console.log(`Types (${templateTypes.length}): ${templateTypes.join(', ')}`);
