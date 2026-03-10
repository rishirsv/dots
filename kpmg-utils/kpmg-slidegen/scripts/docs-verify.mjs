import fs from 'node:fs';
import path from 'node:path';

import { REPO_ROOT } from './support.mjs';

const README_PATH = path.join(REPO_ROOT, 'README.md');
const AGENTS_PATH = path.join(REPO_ROOT, 'AGENTS.md');
const LAYOUT_AUTHORING_PATH = path.join(REPO_ROOT, 'docs', 'architecture', 'layout-authoring.md');
const ONBOARD_LAYOUT_PATH = path.join(REPO_ROOT, 'docs', 'onboarding', 'onboard-layout.md');

const DOCS = [
  README_PATH,
  AGENTS_PATH,
  LAYOUT_AUTHORING_PATH,
  ONBOARD_LAYOUT_PATH,
];

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
const scripts = packageJson.scripts || {};

const COMMAND_PRESENCE_RULES = [
  {
    filePath: README_PATH,
    command: 'test:onboarding',
    reason: 'README should expose the repo onboarding smoke lane.',
    fix: 'Add `npm run test:onboarding` to the root workflow section.',
  },
  {
    filePath: README_PATH,
    command: 'onboard:run',
    reason: 'README should point operators at the onboarding entrypoint.',
    fix: 'Document `npm run onboard:run` in the onboarding workflow summary.',
  },
  {
    filePath: LAYOUT_AUTHORING_PATH,
    command: 'schema:validate:authoring',
    reason: 'Layout authoring doc should show the schema validation gate.',
    fix: 'Reference `npm run schema:validate:authoring` in the authoring verification section.',
  },
  {
    filePath: LAYOUT_AUTHORING_PATH,
    command: 'onboard:regen',
    reason: 'Layout authoring doc should show how runtime aggregates are regenerated.',
    fix: 'Reference `npm run onboard:regen` in the generated file section.',
  },
  {
    filePath: LAYOUT_AUTHORING_PATH,
    command: 'onboard:verify-generated',
    reason: 'Layout authoring doc should show how generated outputs are verified.',
    fix: 'Reference `npm run onboard:verify-generated` in the drift-control section.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:extract',
    reason: 'Onboarding doc should include the extract step.',
    fix: 'Document `npm run onboard:extract` in the case lifecycle commands.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:classify',
    reason: 'Onboarding doc should include the classify step.',
    fix: 'Document `npm run onboard:classify` in the case lifecycle commands.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:scaffold',
    reason: 'Onboarding doc should include the scaffold step.',
    fix: 'Document `npm run onboard:scaffold` in the case lifecycle commands.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:render',
    reason: 'Onboarding doc should include the render step.',
    fix: 'Document `npm run onboard:render` in the case lifecycle commands.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:compare',
    reason: 'Onboarding doc should include the compare step.',
    fix: 'Document `npm run onboard:compare` in the case lifecycle commands.',
  },
  {
    filePath: ONBOARD_LAYOUT_PATH,
    command: 'onboard:promote',
    reason: 'Onboarding doc should include the promote step.',
    fix: 'Document `npm run onboard:promote` in the case lifecycle commands.',
  },
];

const PATH_PRESENCE_RULES = [
  {
    filePath: README_PATH,
    token: 'onboarding/cases/',
    reason: 'README should point contributors at the case-based onboarding workspace.',
    fix: 'Replace legacy onboarding workspace references with `onboarding/cases/<case-id>/`.',
  },
  {
    filePath: AGENTS_PATH,
    token: 'onboarding/cases/',
    reason: 'AGENTS should describe the case-based onboarding workflow.',
    fix: 'Replace legacy onboarding workspace references with `onboarding/cases/<case-id>/`.',
  },
];

const BANNED_TOKENS = [
  {
    token: 'init-layout.mjs',
    fix: 'Use the repo onboarding commands under `scripts/onboarding/` instead.',
  },
  {
    token: '--family businessOverview',
    fix: 'Use primitive-first flags such as `--primitive-ref` or `--base-primitive-ref`.',
  },
  {
    token: 'onboarding/layouts/<layout-id>/',
    fix: 'Use the case workspace path `onboarding/cases/<case-id>/`.',
  },
  {
    token: 'onboarding/layouts/',
    fix: 'Use the case workspace path `onboarding/cases/` unless the doc is explicitly about a legacy migration path.',
  },
  {
    token: 'source.json',
    fix: 'Reference the case lifecycle artifacts like `intake.json`, `extract.raw.json`, and `candidate.layout.json` instead.',
  },
  {
    token: 'seed/geometry.seed.json',
    fix: 'Remove the legacy seed-workspace reference and document the current case artifacts instead.',
  },
];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function rel(filePath) {
  return path.relative(REPO_ROOT, filePath);
}

function makeFinding(filePath, staleReference, recommendedFix) {
  return {
    file: rel(filePath),
    staleReference,
    recommendedFix,
  };
}

function collectCommandFindings(raw, filePath) {
  const findings = [];

  const npmRunRegex = /npm run ([a-z0-9:-]+)/g;
  for (const match of raw.matchAll(npmRunRegex)) {
    const command = match[1];
    if (!scripts[command]) {
      findings.push(
        makeFinding(
          filePath,
          `npm run ${command}`,
          `Update the doc to an existing npm script, or add "${command}" to package.json.`,
        ),
      );
    }
  }

  const backtickCommandRegex = /`([a-z][a-z0-9]*(?::[a-z0-9-]+)+)`/g;
  for (const match of raw.matchAll(backtickCommandRegex)) {
    const command = match[1];
    if (raw.includes(`npm run ${command}`)) continue;
    if (!scripts[command]) {
      findings.push(
        makeFinding(
          filePath,
          command,
          `Update the doc to an existing npm script, or add "${command}" to package.json.`,
        ),
      );
    }
  }

  const nodeScriptRegex = /node (scripts\/[^\s\\`]+\.mjs|generator\/[^\s\\`]+\.js)/g;
  for (const match of raw.matchAll(nodeScriptRegex)) {
    const relPath = match[1];
    const absPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      findings.push(
        makeFinding(
          filePath,
          relPath,
          `Fix the node command to point at an existing script under ${path.dirname(relPath)}/.`,
        ),
      );
    }
  }

  return findings;
}

function collectPathFindings(raw, filePath) {
  const findings = [];
  const pathRegex = /`((?:docs|scripts|templates-src|templates|generator|onboarding|outputs|skills|presets|references)\/[^`]+)`/g;
  for (const match of raw.matchAll(pathRegex)) {
    const rawPath = match[1];
    const relPath = rawPath.replace(/\/\*.*$/, '');
    if (relPath.includes('<') || relPath.includes('>')) continue;
    const absPath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      findings.push(
        makeFinding(
          filePath,
          rawPath,
          `Update the doc to an existing repo path, or create ${relPath} if the reference is meant to be authoritative.`,
        ),
      );
    }
  }
  return findings;
}

function collectStaleTokenFindings(raw, filePath) {
  return BANNED_TOKENS
    .filter(({ token }) => raw.includes(token))
    .map(({ token, fix }) => makeFinding(filePath, token, fix));
}

function collectWorkflowRuleFindings(rawByFile) {
  const findings = [];
  for (const rule of COMMAND_PRESENCE_RULES) {
    const raw = rawByFile.get(rule.filePath) || '';
    if (!raw.includes(rule.command)) {
      findings.push(makeFinding(rule.filePath, rule.reason, rule.fix));
    }
  }
  for (const rule of PATH_PRESENCE_RULES) {
    const raw = rawByFile.get(rule.filePath) || '';
    if (!raw.includes(rule.token)) {
      findings.push(makeFinding(rule.filePath, rule.reason, rule.fix));
    }
  }
  return findings;
}

function formatFindings(findings) {
  const uniqueFindings = Array.from(
    new Map(
      findings.map((finding) => [
        `${finding.file}::${finding.staleReference}::${finding.recommendedFix}`,
        finding,
      ]),
    ).values(),
  );
  return uniqueFindings
    .map(
      (finding) =>
        `- file: ${finding.file}\n  stale reference: ${finding.staleReference}\n  recommended fix: ${finding.recommendedFix}`,
    )
    .join('\n');
}

const rawByFile = new Map();
const findings = [];

for (const docPath of DOCS) {
  if (!fs.existsSync(docPath)) {
    findings.push(
      makeFinding(
        docPath,
        'missing authoritative doc',
        'Restore the doc path or update scripts/docs-verify.mjs if the authoritative surface changed.',
      ),
    );
    continue;
  }

  const raw = read(docPath);
  rawByFile.set(docPath, raw);
  findings.push(...collectCommandFindings(raw, docPath));
  findings.push(...collectPathFindings(raw, docPath));
  findings.push(...collectStaleTokenFindings(raw, docPath));
}

findings.push(...collectWorkflowRuleFindings(rawByFile));

if (findings.length > 0) {
  console.error(`Docs verification failed:\n${formatFindings(findings)}`);
  process.exit(1);
}

console.log('Docs verification passed.');
