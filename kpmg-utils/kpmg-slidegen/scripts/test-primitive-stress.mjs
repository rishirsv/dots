import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  readSourceLayouts,
  readSourcePrimitives,
  primitiveVersionRef,
  BUILTIN_BUILDER_MAP,
} from './codegen/lib.mjs';
import { generateFixture, loadFixture } from './harness/lib.mjs';

const RENDER_STRESS_FIXTURE_ID = 'stress-primitive-render-matrix';
const HIGH_PRIORITY_RENDER_STRESS = [
  {
    type: 'contents',
    surfaces: ['long title', 'repeated cards'],
    verify(slide) {
      assert.ok(slide.title.length >= 30, 'Contents stress slide should use a long title.');
      assert.ok(Array.isArray(slide.sections) && slide.sections.length >= 12, 'Contents stress slide should include repeated section cards.');
    },
  },
  {
    type: 'dividerLight',
    surfaces: ['long title'],
    verify(slide) {
      assert.ok(slide.sectionTitle.length >= 60, 'Divider light stress slide should use a long section title.');
    },
  },
  {
    type: 'oneColumnText',
    surfaces: ['long title', 'long strapline', 'dense body text', 'missing optional content'],
    verify(slide) {
      assert.ok(slide.title.length >= 40, 'One-column stress slide should use a long title.');
      assert.ok(slide.strapline.length >= 80, 'One-column stress slide should use a long strapline.');
      assert.ok(Array.isArray(slide.body) && slide.body.length >= 7, 'One-column stress slide should include dense body text.');
      assert.equal(slide.source, undefined, 'One-column stress slide should omit optional source content.');
      assert.equal(slide.callouts, undefined, 'One-column stress slide should omit optional callouts.');
    },
  },
  {
    type: 'twoColumnText',
    surfaces: ['long title', 'dense body text', 'missing optional content'],
    verify(slide) {
      assert.ok(slide.title.length >= 40, 'Two-column stress slide should use a long title.');
      assert.ok(Array.isArray(slide.leftBody) && slide.leftBody.length >= 4, 'Two-column stress slide should include dense left-column text.');
      assert.ok(Array.isArray(slide.rightBody) && slide.rightBody.length >= 4, 'Two-column stress slide should include dense right-column text.');
      assert.equal(slide.strapline, undefined, 'Two-column stress slide should omit optional strapline content.');
    },
  },
  {
    type: 'titleStrapline4TextBoxes',
    surfaces: ['repeated cards', 'missing optional content'],
    verify(slide) {
      assert.ok(Array.isArray(slide.columns) && slide.columns.length === 4, 'Four-box stress slide should include four repeated columns.');
      assert.ok(slide.columns.every((column) => Array.isArray(column.body) && column.body.length >= 3), 'Each four-box stress column should carry dense body text.');
      assert.equal(slide.strapline, undefined, 'Four-box stress slide should omit optional strapline content.');
    },
  },
  {
    type: 'analysisWideChart2ColsText',
    surfaces: ['long title', 'long strapline', 'dense body text', 'missing optional content'],
    verify(slide) {
      assert.ok(slide.title.length >= 40, 'Wide chart two-column stress slide should use a long title.');
      assert.ok(slide.strapline.length >= 80, 'Wide chart two-column stress slide should use a long strapline.');
      assert.ok(Array.isArray(slide.body) && slide.body.length >= 7, 'Wide chart two-column stress slide should include dense body text.');
      assert.equal(slide.callouts, undefined, 'Wide chart two-column stress slide should omit optional callouts.');
    },
  },
  {
    type: 'analysisWideChartTableText',
    surfaces: ['dense body text', 'repeated rows', 'missing optional content'],
    verify(slide) {
      assert.ok(Array.isArray(slide.body) && slide.body.length >= 8, 'Wide chart table stress slide should include dense body text.');
      assert.ok(Array.isArray(slide.table?.rows) && slide.table.rows.length >= 7, 'Wide chart table stress slide should include repeated table rows.');
      assert.equal(slide.callouts, undefined, 'Wide chart table stress slide should omit optional callouts.');
      assert.equal(slide.noteSource, undefined, 'Wide chart table stress slide should omit optional noteSource.');
    },
  },
  {
    type: 'analysisNarrowTable',
    surfaces: ['repeated rows', 'missing optional content'],
    verify(slide) {
      assert.ok(Array.isArray(slide.table?.rows) && slide.table.rows.length >= 6, 'Narrow table stress slide should include repeated rows.');
      assert.ok(Array.isArray(slide.insights) && slide.insights.length >= 3, 'Narrow table stress slide should include multiple insight bullets.');
      assert.equal(slide.notes, undefined, 'Narrow table stress slide should omit optional notes.');
      assert.equal(slide.insightTitle, undefined, 'Narrow table stress slide should omit optional insightTitle.');
    },
  },
  {
    type: 'analysisBridge',
    surfaces: ['long title', 'long strapline', 'repeated cards', 'missing optional content'],
    verify(slide) {
      assert.ok(slide.title.length >= 55, 'Analysis bridge stress slide should use a long title.');
      assert.ok(slide.strapline.length >= 80, 'Analysis bridge stress slide should use a long strapline.');
      assert.ok(Array.isArray(slide.analysisColumns) && slide.analysisColumns.length === 3, 'Analysis bridge stress slide should include repeated analysis columns.');
      assert.ok(Array.isArray(slide.bridge?.steps) && slide.bridge.steps.length >= 12, 'Analysis bridge stress slide should include a dense bridge.');
      assert.equal(slide.note, undefined, 'Analysis bridge stress slide should omit optional note content.');
    },
  },
  {
    type: 'businessOverview',
    surfaces: ['long title', 'dense body text', 'repeated cards', 'missing optional content'],
    verify(slide) {
      assert.ok(slide.title.length >= 40, 'Business overview stress slide should use a long title.');
      assert.ok(Array.isArray(slide.overviewBody) && slide.overviewBody.length >= 5, 'Business overview stress slide should include dense narrative text.');
      assert.ok(Array.isArray(slide.structure?.bottomTier) && slide.structure.bottomTier.length >= 4, 'Business overview stress slide should include repeated structure nodes.');
      assert.equal(slide.note, undefined, 'Business overview stress slide should omit optional note content.');
    },
  },
];

function runStructuralValidation() {
  const layouts = readSourceLayouts();
  const primitives = readSourcePrimitives();
  const layoutRefs = new Map();

  for (const layout of layouts) {
    const ref = layout.primitive;
    if (!layoutRefs.has(ref)) layoutRefs.set(ref, []);
    layoutRefs.get(ref).push(layout.type);
  }

  assert.ok(primitives.length > 0, 'Primitive source set must not be empty.');

  for (const primitive of primitives) {
    const ref = primitiveVersionRef(primitive);
    const attachedLayouts = layoutRefs.get(ref) || [];
    assert.ok(attachedLayouts.length > 0, `Primitive must be referenced by at least one layout: ${ref}`);
    assert.equal(typeof primitive.builderModule, 'string', `Primitive builderModule missing for ${ref}`);
    assert.equal(typeof primitive.builderExport, 'string', `Primitive builderExport missing for ${ref}`);
    assert.ok(Object.keys(primitive.geometryKinds || {}).length > 0, `Primitive geometryKinds missing for ${ref}`);
    for (const key of primitive.requiredGeometry || []) {
      assert.ok(primitive.geometryKinds[key], `Primitive required geometry key "${key}" missing kind for ${ref}`);
    }
    for (const layoutType of attachedLayouts) {
      const layout = layouts.find((entry) => entry.type === layoutType);
      assert.equal(layout.primitive, ref, `Layout primitive mismatch for ${layoutType}`);
      for (const geometryKey of primitive.requiredGeometry || []) {
        assert.notEqual(layout.geometry?.[geometryKey], undefined, `Layout ${layoutType} is missing required geometry "${geometryKey}"`);
      }
    }
    if (BUILTIN_BUILDER_MAP[primitive.id]) {
      assert.equal(
        primitive.builderModule,
        BUILTIN_BUILDER_MAP[primitive.id].builderModule,
        `Built-in primitive builderModule drift for ${ref}`,
      );
    }
  }

  console.log(`Primitive structural validation passed (${primitives.length} primitives, ${layouts.length} layouts).`);
}

function getCheck(qa, checkId) {
  const check = qa?.checks?.find((entry) => entry.id === checkId);
  assert.ok(check, `QA report should include ${checkId} check.`);
  return check;
}

function verifyRenderStressFixtureShape(deckSpec) {
  const slideTypes = new Set((deckSpec?.slides || []).map((slide) => slide.type));
  assert.equal(deckSpec?.metadata?.textAmount, 'xl', 'Primitive stress fixture should declare xl text amount.');

  for (const entry of HIGH_PRIORITY_RENDER_STRESS) {
    assert.ok(slideTypes.has(entry.type), `Primitive render stress fixture is missing slide type ${entry.type}.`);
    const slide = deckSpec.slides.find((candidate) => candidate.type === entry.type);
    entry.verify(slide);
  }
}

async function runRenderStressValidation() {
  const { entry, deckSpec } = loadFixture(RENDER_STRESS_FIXTURE_ID);
  assert.equal(entry.class, 'stress', 'Primitive render stress fixture should be classified as stress.');
  assert.deepEqual(
    [...entry.families].sort(),
    HIGH_PRIORITY_RENDER_STRESS.map((item) => item.type).sort(),
    'Primitive render stress fixture families should match the documented high-priority primitive set.',
  );

  verifyRenderStressFixtureShape(deckSpec);

  const renderRun = await generateFixture(RENDER_STRESS_FIXTURE_ID, {
    enforceOverlap: true,
  });
  const qa = renderRun.qa;

  assert.equal(fs.existsSync(renderRun.outPath), true, 'Primitive render stress fixture should create a deck file.');
  assert.equal(fs.existsSync(renderRun.qaPath), true, 'Primitive render stress fixture should create qa.json.');
  assert.equal(qa?.schemaVersion, 1, 'Primitive render stress QA should expose schemaVersion.');
  assert.equal(qa?.run?.inputSlideCount, HIGH_PRIORITY_RENDER_STRESS.length, 'Primitive render stress QA should record all input slides.');
  assert.ok(qa?.run?.outputSlideCount >= qa.run.inputSlideCount, 'Primitive render stress output slide count should be >= input slide count.');
  assert.equal(qa?.outcome?.blockingIssueCount, 0, 'Primitive render stress fixture should not produce blocking issues.');

  const contractsCheck = getCheck(qa, 'contracts');
  const validationCheck = getCheck(qa, 'validation');
  const paginationCheck = getCheck(qa, 'pagination');
  const overlapCheck = getCheck(qa, 'overlap');

  assert.notEqual(contractsCheck.status, 'fail', 'Primitive render stress contracts check should not fail.');
  assert.notEqual(validationCheck.status, 'fail', 'Primitive render stress validation check should not fail.');
  assert.notEqual(paginationCheck.status, 'fail', 'Primitive render stress pagination check should not fail.');
  assert.notEqual(overlapCheck.status, 'fail', 'Primitive render stress overlap check should not fail.');

  const renderedSlideTypes = new Set((deckSpec.slides || []).map((slide) => slide.type));
  for (const entryPlan of HIGH_PRIORITY_RENDER_STRESS) {
    assert.ok(renderedSlideTypes.has(entryPlan.type), `Primitive render stress deck should include ${entryPlan.type}.`);
  }

  console.log(
    `Primitive render stress validation passed (${HIGH_PRIORITY_RENDER_STRESS.length} high-priority primitives, fixture ${RENDER_STRESS_FIXTURE_ID}, output slides ${qa.run.outputSlideCount}).`,
  );
  console.log(
    `Primitive render stress plan: ${HIGH_PRIORITY_RENDER_STRESS.map((entryPlan) => `${entryPlan.type} [${entryPlan.surfaces.join(', ')}]`).join('; ')}`,
  );
}

runStructuralValidation();
await runRenderStressValidation();

console.log('Primitive stress lane passed.');
