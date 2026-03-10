import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { REPO_ROOT, resolveRepoPath } from './support.mjs';

const LOCAL_DEFAULT_BRANCH_REF = 'refs/remotes/origin/HEAD';
const LAYOUT_FRAGMENT_PREFIX = 'templates-src/kpmg-diligence/layouts/';
const PRIMITIVE_FRAGMENT_PREFIX = 'templates-src/kpmg-diligence/primitives/';
const LAYOUT_PACKAGE_META_PATH = 'templates-src/kpmg-diligence/layout-package.meta.json';

function usage() {
  return [
    'Usage: node scripts/test-changed-layouts.mjs [--base-ref <ref> --head-ref <ref>]',
    '',
    'Examples:',
    '  Local no-arg fallback:',
    '    npm run test:changed-layouts',
    '  CI explicit base/head refs:',
    '    npm run test:changed-layouts -- --base-ref "$BASE_SHA" --head-ref "$HEAD_SHA"',
    '  CI env refs:',
    '    SLIDEGEN_DIFF_BASE_REF="$BASE_SHA" SLIDEGEN_DIFF_HEAD_REF="$HEAD_SHA" npm run test:changed-layouts',
  ].join('\n');
}

function parseArgs(argv) {
  const args = {
    baseRef: null,
    headRef: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (token === '--base-ref') {
      args.baseRef = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (token === '--head-ref') {
      args.headRef = argv[index + 1] || null;
      index += 1;
    }
  }

  return args;
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  if (!allowFailure && result.status !== 0) {
    const stderr = String(result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} failed.${stderr ? `\n${stderr}` : ''}`);
  }
  return result;
}

function gitOutputLines(args, options = {}) {
  const result = git(args, options);
  if (result.status !== 0) return [];
  return String(result.stdout || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function gitRefExists(ref) {
  return git(['rev-parse', '--verify', `${ref}^{commit}`], { allowFailure: true }).status === 0;
}

function parsePorcelainPath(line) {
  const payload = String(line || '').slice(3).trim();
  if (!payload) return null;
  if (!payload.includes(' -> ')) return payload;
  const [, nextPath] = payload.split(' -> ');
  return nextPath || payload;
}

export function resolveDiffRefs({ args = {}, env = process.env } = {}) {
  const cliBaseRef = args.baseRef ? String(args.baseRef).trim() : null;
  const cliHeadRef = args.headRef ? String(args.headRef).trim() : null;
  const envBaseRef = uniqueSorted([
    env.SLIDEGEN_DIFF_BASE_REF,
    env.BASE_REF,
    env.GITHUB_BASE_SHA,
  ])[0] || null;
  const envHeadRef = uniqueSorted([
    env.SLIDEGEN_DIFF_HEAD_REF,
    env.HEAD_REF,
    env.GITHUB_HEAD_SHA,
  ])[0] || null;

  const baseRef = cliBaseRef || envBaseRef;
  const headRef = cliHeadRef || envHeadRef;
  if ((baseRef && !headRef) || (!baseRef && headRef)) {
    throw new Error('Expected both base and head refs. Pass `--base-ref` and `--head-ref`, or set both `SLIDEGEN_DIFF_BASE_REF` and `SLIDEGEN_DIFF_HEAD_REF`.');
  }
  if (!baseRef || !headRef) return null;
  return {
    baseRef,
    headRef,
    source: cliBaseRef || cliHeadRef ? 'cli' : 'env',
  };
}

export function categorizeChangedFiles(files = []) {
  const normalizedFiles = uniqueSorted(files);
  const layoutFragments = normalizedFiles.filter(
    (file) =>
      file.startsWith(LAYOUT_FRAGMENT_PREFIX)
      && file.endsWith('.json')
      && !file.endsWith('.schema.json'),
  );
  const primitiveFragments = normalizedFiles.filter(
    (file) =>
      file.startsWith(PRIMITIVE_FRAGMENT_PREFIX)
      && file.endsWith('.json')
      && !file.endsWith('.schema.json'),
  );
  const fanoutFiles = normalizedFiles.filter((file) => {
    if (layoutFragments.includes(file) || primitiveFragments.includes(file)) return false;
    if (file === LAYOUT_PACKAGE_META_PATH) return true;
    if (file.startsWith('generator/')) return true;
    if (file.startsWith('scripts/codegen/')) return true;
    if (file === 'scripts/validate-authoring-fragments.mjs') return true;
    if (file.startsWith('templates/kpmg-diligence/package/')) return true;
    if (file.startsWith('templates-src/kpmg-diligence/') && file.endsWith('.schema.json')) return true;
    return false;
  });
  return {
    files: normalizedFiles,
    layoutFragments,
    primitiveFragments,
    fanoutFiles,
  };
}

export function selectChangedLayoutLanes(categories) {
  const lanes = [
    {
      script: 'scripts/codegen/generate-runtime-aggregates.mjs',
      args: ['--check'],
      reason: 'Always verify generated runtime aggregates are current.',
    },
    {
      script: 'scripts/validate-authoring-fragments.mjs',
      args: [],
      reason: 'Always validate authored layout and primitive fragments.',
    },
  ];

  if (categories.layoutFragments.length > 0 || categories.primitiveFragments.length > 0 || categories.fanoutFiles.length > 0) {
    lanes.push({
      script: 'scripts/test-contracts.mjs',
      args: [],
      reason: categories.fanoutFiles.length > 0
        ? 'Generator/runtime or authoring infrastructure changed.'
        : 'Layout or primitive authoring fragments changed.',
    });
  }

  if (categories.primitiveFragments.length > 0 || categories.fanoutFiles.length > 0) {
    lanes.push({
      script: 'scripts/test-primitive-stress.mjs',
      args: [],
      reason: categories.primitiveFragments.length > 0
        ? 'Primitive fragment changes can affect multiple layouts.'
        : 'Generator/runtime fanout can affect primitive reuse and rendering behavior.',
    });
  }

  if (categories.fanoutFiles.length > 0) {
    lanes.push({
      script: 'scripts/test-fixtures.mjs',
      args: [],
      reason: 'Generator/runtime fanout touched broader fixture governance and package behavior.',
    });
  }

  return lanes;
}

export function describeSelection(selection, lanes) {
  const lines = [
    'Changed layout detection summary:',
    `- strategy: ${selection.strategy}`,
    `- reason: ${selection.reason}`,
    `- changed files (${selection.changed.files.length}): ${selection.changed.files.length > 0 ? selection.changed.files.join(', ') : 'none'}`,
    `- changed layout fragments (${selection.changed.layoutFragments.length}): ${selection.changed.layoutFragments.length > 0 ? selection.changed.layoutFragments.join(', ') : 'none'}`,
    `- changed primitive fragments (${selection.changed.primitiveFragments.length}): ${selection.changed.primitiveFragments.length > 0 ? selection.changed.primitiveFragments.join(', ') : 'none'}`,
    `- fanout files (${selection.changed.fanoutFiles.length}): ${selection.changed.fanoutFiles.length > 0 ? selection.changed.fanoutFiles.join(', ') : 'none'}`,
    '- selected test surface:',
    ...lanes.map((lane) => `  - ${lane.script}${lane.args.length > 0 ? ` ${lane.args.join(' ')}` : ''}: ${lane.reason}`),
  ];

  if (selection.baseRef && selection.headRef) {
    lines.splice(3, 0, `- base ref: ${selection.baseRef}`);
    lines.splice(4, 0, `- head ref: ${selection.headRef}`);
    if (selection.mergeBaseRef) {
      lines.splice(5, 0, `- merge base: ${selection.mergeBaseRef}`);
    }
  }

  return lines.join('\n');
}

function resolveDefaultRemoteHeadRef() {
  const result = git(['symbolic-ref', LOCAL_DEFAULT_BRANCH_REF], { allowFailure: true });
  if (result.status !== 0) return null;
  return String(result.stdout || '').trim() || null;
}

function readExplicitDiff(selection) {
  const { baseRef, headRef } = selection;
  if (!gitRefExists(baseRef)) {
    throw new Error(`Base ref is unavailable locally: ${baseRef}. Fetch the base commit or pass a fetched ref.`);
  }
  if (!gitRefExists(headRef)) {
    throw new Error(`Head ref is unavailable locally: ${headRef}. Fetch the head commit or pass a fetched ref.`);
  }
  const mergeBaseRef = String(git(['merge-base', baseRef, headRef]).stdout || '').trim();
  const effectiveBaseRef = mergeBaseRef || baseRef;
  return {
    strategy: 'explicit-base-head',
    reason: `Using ${selection.source === 'cli' ? 'CLI' : 'environment'} base/head refs to diff the authored surface.`,
    baseRef,
    headRef,
    mergeBaseRef: mergeBaseRef || null,
    files: gitOutputLines(['diff', '--name-only', effectiveBaseRef, headRef]),
  };
}

function readLocalFallbackDiff() {
  const workingTreeFiles = uniqueSorted(
    gitOutputLines(['status', '--porcelain', '--untracked-files=all']).map((line) => parsePorcelainPath(line)),
  );
  const defaultRemoteHeadRef = resolveDefaultRemoteHeadRef();
  let branchDeltaFiles = [];
  let mergeBaseRef = null;
  if (defaultRemoteHeadRef && gitRefExists(defaultRemoteHeadRef)) {
    mergeBaseRef = String(git(['merge-base', 'HEAD', defaultRemoteHeadRef]).stdout || '').trim() || null;
    if (mergeBaseRef && mergeBaseRef !== String(git(['rev-parse', 'HEAD']).stdout || '').trim()) {
      branchDeltaFiles = gitOutputLines(['diff', '--name-only', mergeBaseRef, 'HEAD']);
    }
  }

  const files = uniqueSorted([...workingTreeFiles, ...branchDeltaFiles]);
  if (workingTreeFiles.length > 0 && branchDeltaFiles.length > 0) {
    return {
      strategy: 'local-working-tree-plus-branch-delta',
      reason: `Using local working tree changes plus committed branch delta against ${defaultRemoteHeadRef}.`,
      baseRef: mergeBaseRef,
      headRef: 'HEAD',
      mergeBaseRef,
      files,
    };
  }
  if (workingTreeFiles.length > 0) {
    return {
      strategy: 'local-working-tree',
      reason: 'Using local staged, unstaged, and untracked changes because no explicit base/head refs were provided.',
      files,
    };
  }
  if (branchDeltaFiles.length > 0) {
    return {
      strategy: 'local-branch-delta',
      reason: `Working tree is clean; using committed branch delta against ${defaultRemoteHeadRef}.`,
      baseRef: mergeBaseRef,
      headRef: 'HEAD',
      mergeBaseRef,
      files,
    };
  }
  return {
    strategy: 'local-no-changes',
    reason: 'No explicit base/head refs were provided and no relevant local or branch changes were detected.',
    files: [],
  };
}

function resolveChangedSelection(args, env) {
  const explicitRefs = resolveDiffRefs({ args, env });
  const rawSelection = explicitRefs ? readExplicitDiff(explicitRefs) : readLocalFallbackDiff();
  return {
    ...rawSelection,
    changed: categorizeChangedFiles(rawSelection.files),
  };
}

function runNode(script, args = []) {
  const result = spawnSync(process.execPath, [resolveRepoPath(script), ...args], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: '1',
    },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(usage());
    return;
  }

  const selection = resolveChangedSelection(args, env);
  const lanes = selectChangedLayoutLanes(selection.changed);
  console.log(describeSelection(selection, lanes));
  lanes.forEach((lane) => runNode(lane.script, lane.args));
  console.log('Changed layout lane passed.');
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
