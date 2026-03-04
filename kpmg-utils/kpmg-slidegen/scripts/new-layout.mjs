#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const out = { type: '', paginationPolicyKey: 'none.v1', withPagination: false };
  for (let idx = 0; idx < argv.length; idx += 1) {
    const arg = argv[idx];
    if (arg === '--type' && argv[idx + 1]) {
      out.type = String(argv[idx + 1]).trim();
      idx += 1;
      continue;
    }
    if (arg.startsWith('--type=')) {
      out.type = arg.slice('--type='.length).trim();
      continue;
    }
    if (arg === '--policy' && argv[idx + 1]) {
      out.paginationPolicyKey = String(argv[idx + 1]).trim();
      idx += 1;
      continue;
    }
    if (arg.startsWith('--policy=')) {
      out.paginationPolicyKey = arg.slice('--policy='.length).trim();
      continue;
    }
    if (arg === '--with-pagination') {
      out.withPagination = true;
      continue;
    }
  }
  if (!out.type) {
    throw new Error('Missing required --type (example: --type analysisWideSomething)');
  }
  return out;
}

function toKebabCase(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toPascalCase(value) {
  return String(value || '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileOnce(filePath, content) {
  ensureDir(path.dirname(filePath));
  try {
    fs.writeFileSync(filePath, content, { flag: 'wx' });
    return true;
  } catch (error) {
    if (error?.code === 'EEXIST') return false;
    throw error;
  }
}

function createBuilderStub({ type, pascalName }) {
  return `import { addTitle } from '../helpers/title.js';
import { resolveTheme } from '../helpers/theme.js';

export function add${pascalName}(pptx, slideSpec = {}, ctx = {}) {
  const { masterName, geometry, theme } = ctx;
  const resolvedTheme = resolveTheme(theme);
  const slide = masterName ? pptx.addSlide({ masterName }) : pptx.addSlide();

  addTitle(slide, slideSpec.title || '${type}', geometry?.title, { theme: resolvedTheme });

  // TODO(${type}): implement deterministic rendering using only geometry boxes + theme tokens.
  return slide;
}
`;
}

function createDeckFixture({ type }) {
  return `${JSON.stringify(
    {
      metadata: {
        title: `${type} onboarding fixture`,
        allowSparse: true,
        footer: {
          year: 2026,
          legalEntityName: 'KPMG LLP',
          jurisdiction: 'Ontario',
          legalStructure: 'limited liability partnership',
        },
      },
      slides: [
        {
          type,
          title: `${type} fixture title`,
        },
      ],
    },
    null,
    2,
  )}
`;
}

function createVisualTestStub({ type, fixturePath }) {
  return `#!/usr/bin/env node
import path from 'node:path';

console.log('Visual test scaffold for ${type}');
console.log('1. Point to a real regression fixture: ${fixturePath}');
console.log('2. Render with generator/index.js using --qa-out');
console.log('3. Compare reference vs candidate PNGs using test:visual:reference-parity');
`;
}

function createChecklistDoc({ type, policyKey, withPagination, paths }) {
  const paginationLine = withPagination
    ? `- [ ] Add pagination policy entry in \`templates/kpmg-diligence/package/pagination-policy.json\` using key \`${policyKey}\`.`
    : '- [ ] Confirm slide should use `none.v1` pagination policy.';

  return `# New Layout Scaffold: ${type}

## Files Created
- [ ] Builder stub: \`${paths.builder}\`
- [ ] Fixture deckSpec: \`${paths.fixture}\`
- [ ] Visual test scaffold: \`${paths.visualTest}\`

## Required Manual Wiring
- [ ] Add schema slot definition in \`docs/DECKSPEC-SLOTS-SCHEMA.json\` (or skill schema source).
- [ ] Add template slot + geometry contract in \`templates/kpmg-diligence/package/layouts.json\`.
- [ ] Add slide registry entry in \`generator/runtime/slide-registry.js\`.
${paginationLine}
- [ ] Add builder mapping in \`generator/runtime/render-deck.js\` if introducing a new builder id.

## Required Validation
- [ ] Run \`npm run -s test:contracts\`
- [ ] Run \`npm run -s test:contracts:registry\`
- [ ] Run layout-specific pagination/validation tests
- [ ] Run visual parity against reference slide PNGs and capture outputs under \`/Users/rishi/Desktop/slides-tests/${toKebabCase(
    type,
  )}\`
`;
}

function main() {
  const { type, paginationPolicyKey, withPagination } = parseArgs();
  const kebab = toKebabCase(type);
  const pascal = toPascalCase(type);

  const builderPath = path.join('generator', 'builders', `${kebab}.js`);
  const fixturePath = path.join('decks', `layout-onboarding-${kebab}.deckSpec.json`);
  const visualTestPath = path.join('scripts', `test-${kebab}-visual-regression.mjs`);
  const checklistPath = path.join('docs', 'workflows', 'scaffolds', `${kebab}.md`);

  const created = [];
  if (writeFileOnce(builderPath, createBuilderStub({ type, pascalName: pascal }))) created.push(builderPath);
  if (writeFileOnce(fixturePath, createDeckFixture({ type }))) created.push(fixturePath);
  if (writeFileOnce(visualTestPath, createVisualTestStub({ type, fixturePath }))) created.push(visualTestPath);
  if (
    writeFileOnce(
      checklistPath,
      createChecklistDoc({
        type,
        policyKey: paginationPolicyKey,
        withPagination,
        paths: {
          builder: builderPath,
          fixture: fixturePath,
          visualTest: visualTestPath,
        },
      }),
    )
  ) {
    created.push(checklistPath);
  }

  if (created.length === 0) {
    console.log('No files created (all scaffold files already exist).');
  } else {
    console.log('Created scaffold files:');
    for (const file of created) console.log(`- ${file}`);
  }

  console.log('\nNext steps:');
  console.log(`1. Wire \`${type}\` into generator/runtime/slide-registry.js.`);
  console.log('2. Add canonical geometry and slots in template layouts.json.');
  console.log('3. Implement builder and run contract + visual parity tests.');
}

main();
