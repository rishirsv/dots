import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

function readJson(relPath) {
  const abs = path.join(ROOT, relPath);
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function asSortedSet(values) {
  return [...new Set(values)].sort();
}

function diffSets(left, right) {
  const l = new Set(left);
  const r = new Set(right);
  return {
    onlyLeft: [...l].filter((v) => !r.has(v)).sort(),
    onlyRight: [...r].filter((v) => !l.has(v)).sort(),
  };
}

function getLayoutTypeNames(layoutsPkg) {
  return asSortedSet(Object.keys(layoutsPkg?.types || {}));
}

function getLayoutRequiredSlotsByType(layoutsPkg) {
  const out = {};
  for (const [type, layout] of Object.entries(layoutsPkg?.types || {})) {
    const req = Object.entries(layout?.slots || {})
      .filter(([, slotDef]) => Boolean(slotDef?.required))
      .map(([slotName]) => slotName);
    out[type] = asSortedSet(req);
  }
  return out;
}

function getLayoutMinItemsByType(layoutsPkg) {
  const out = {};
  for (const [type, layout] of Object.entries(layoutsPkg?.types || {})) {
    const mins = {};
    for (const [slotName, slotDef] of Object.entries(layout?.slots || {})) {
      if (Number.isFinite(slotDef?.minItems)) mins[slotName] = slotDef.minItems;
    }
    out[type] = mins;
  }
  return out;
}

function getDeckPlanTypeEnum(deckPlanSchema) {
  return asSortedSet(
    deckPlanSchema?.properties?.slides?.items?.properties?.type?.enum || [],
  );
}

function resolveSchemaRef(defs, maybeSchema) {
  if (!maybeSchema || typeof maybeSchema !== 'object') return null;
  if (!maybeSchema.$ref) return maybeSchema;
  const ref = String(maybeSchema.$ref);
  const parts = ref.split('/');
  const defName = parts[parts.length - 1];
  return defs?.[defName] || null;
}

function extractTypeNames(typeDef) {
  if (!typeDef || typeof typeDef !== 'object') return [];
  if (typeof typeDef.const === 'string') return [typeDef.const];
  if (Array.isArray(typeDef.enum)) return typeDef.enum.filter((v) => typeof v === 'string');
  return [];
}

function getDeckSpecTypeEnum(deckSpecSchema) {
  return asSortedSet(
    deckSpecSchema?.$defs?.slideBase?.properties?.type?.enum || [],
  );
}

function getDeckSpecRequiredSlotsByType(deckSpecSchema) {
  const defs = deckSpecSchema?.$defs || {};
  const out = {};

  for (const [defName, def] of Object.entries(defs)) {
    if (!defName.startsWith('slide')) continue;
    if (!Array.isArray(def?.allOf) || def.allOf.length < 2) continue;
    const typed = def.allOf[1];
    const typeNames = extractTypeNames(typed?.properties?.type);
    if (!typeNames.length) continue;
    const required = asSortedSet(
      (typed?.required || []).filter((name) => name !== 'type'),
    );
    for (const typeName of typeNames) {
      out[typeName] = asSortedSet([...(out[typeName] || []), ...required]);
    }
  }
  return out;
}

function getDeckSpecMinItemsByType(deckSpecSchema) {
  const defs = deckSpecSchema?.$defs || {};
  const out = {};

  for (const [defName, def] of Object.entries(defs)) {
    if (!defName.startsWith('slide')) continue;
    if (!Array.isArray(def?.allOf) || def.allOf.length < 2) continue;
    const typed = def.allOf[1];
    const typeNames = extractTypeNames(typed?.properties?.type);
    if (!typeNames.length) continue;
    const minBySlot = {};
    for (const [slotName, slotSchema] of Object.entries(typed?.properties || {})) {
      if (slotName === 'type') continue;
      const resolved = resolveSchemaRef(defs, slotSchema);
      if (Number.isFinite(resolved?.minItems)) {
        minBySlot[slotName] = resolved.minItems;
      }
    }
    for (const typeName of typeNames) {
      out[typeName] = { ...(out[typeName] || {}), ...minBySlot };
    }
  }
  return out;
}

function run() {
  const layoutsPkg = readJson('templates/kpmg-diligence/package/layouts.json');
  const deckPlanSchema = readJson('schemas/deckPlan.schema.json');
  const deckSpecSchema = readJson('schemas/deckSpec.schema.json');

  const errors = [];

  const layoutTypes = getLayoutTypeNames(layoutsPkg);
  const deckPlanTypes = getDeckPlanTypeEnum(deckPlanSchema);
  const deckSpecTypes = getDeckSpecTypeEnum(deckSpecSchema);

  const planVsLayout = diffSets(layoutTypes, deckPlanTypes);
  if (planVsLayout.onlyLeft.length || planVsLayout.onlyRight.length) {
    errors.push(
      `DeckPlan type enum drift. Missing in deckPlan: [${planVsLayout.onlyLeft.join(', ')}], extra in deckPlan: [${planVsLayout.onlyRight.join(', ')}]`,
    );
  }

  const specVsLayout = diffSets(layoutTypes, deckSpecTypes);
  if (specVsLayout.onlyLeft.length || specVsLayout.onlyRight.length) {
    errors.push(
      `DeckSpec type enum drift. Missing in deckSpec: [${specVsLayout.onlyLeft.join(', ')}], extra in deckSpec: [${specVsLayout.onlyRight.join(', ')}]`,
    );
  }

  const layoutRequired = getLayoutRequiredSlotsByType(layoutsPkg);
  const specRequired = getDeckSpecRequiredSlotsByType(deckSpecSchema);
  for (const typeName of layoutTypes) {
    const l = layoutRequired[typeName] || [];
    const s = specRequired[typeName] || [];
    const d = diffSets(l, s);
    if (d.onlyLeft.length || d.onlyRight.length) {
      errors.push(
        `Required slot drift for "${typeName}". Missing in deckSpec: [${d.onlyLeft.join(', ')}], extra in deckSpec: [${d.onlyRight.join(', ')}]`,
      );
    }
  }

  const layoutMinItems = getLayoutMinItemsByType(layoutsPkg);
  const specMinItems = getDeckSpecMinItemsByType(deckSpecSchema);
  for (const typeName of layoutTypes) {
    const layoutSlots = layoutMinItems[typeName] || {};
    const schemaSlots = specMinItems[typeName] || {};
    for (const [slotName, minItems] of Object.entries(layoutSlots)) {
      if (!Number.isFinite(minItems)) continue;
      if (!Number.isFinite(schemaSlots[slotName])) continue;
      if (schemaSlots[slotName] !== minItems) {
        errors.push(
          `minItems drift for "${typeName}.${slotName}". layouts=${minItems}, deckSpec=${schemaSlots[slotName]}`,
        );
      }
    }
  }

  if (errors.length) {
    console.error('Slot/schema contract drift detected:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('OK: deckPlan/deckSpec contracts are in sync with template layouts.');
}

run();
