import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { REPO_ROOT, resolveRepoPath } from './support.mjs';

const SKILL_ROOT = resolveRepoPath('skills', 'kpmg-slides');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'assets', 'bundle-manifest.json');
export { MANIFEST_PATH, SKILL_ROOT };

const DIRECTORY_SYNC_MAP = [
  {
    source: path.join(REPO_ROOT, 'generator'),
    target: path.join(SKILL_ROOT, 'assets', 'slidegen', 'generator'),
  },
  {
    source: path.join(REPO_ROOT, 'templates', 'kpmg-diligence'),
    target: path.join(SKILL_ROOT, 'assets', 'slidegen', 'templates', 'kpmg-diligence'),
  },
  {
    source: path.join(REPO_ROOT, 'presets', 'authoring'),
    target: path.join(SKILL_ROOT, 'assets', 'templates', 'presets'),
  },
];

const FILE_SYNC_MAP = [
  {
    source: path.join(REPO_ROOT, 'presets', 'authoring', 'detailed.deckSpec.json'),
    target: path.join(SKILL_ROOT, 'assets', 'templates', 'deckspec-starter.json'),
    required: true,
  },
];

const NATIVE_FILE_MANIFEST_PATHS = [
  path.join(SKILL_ROOT, 'SKILL.md'),
  path.join(SKILL_ROOT, 'agents', 'openai.yaml'),
  path.join(SKILL_ROOT, 'assets', 'kpmg-slides-small.png'),
  path.join(SKILL_ROOT, 'assets', 'kpmg-slides.png'),
  path.join(SKILL_ROOT, 'package-lock.json'),
  path.join(SKILL_ROOT, 'package.json'),
  path.join(SKILL_ROOT, 'requirements.txt'),
  path.join(SKILL_ROOT, 'scripts', 'run_kpmg_slides.sh'),
];

const NATIVE_DIRECTORY_MANIFEST_PATHS = [
  path.join(SKILL_ROOT, 'references'),
];

const STALE_PATHS = [
  path.join(SKILL_ROOT, 'assets', 'fixtures'),
  path.join(SKILL_ROOT, 'assets', 'slidegen', 'generator', 'postprocess', 'slides-runtime', '__pycache__'),
];

function relativeToRepo(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
}

function sha256(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listFilesRecursively(rootDir, { includeDotfiles = false } = {}) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (!includeDotfiles && entry.name === '.DS_Store') continue;
      if (entry.isDirectory()) {
        if (entry.name === '__pycache__') continue;
        stack.push(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name.endsWith('.pyc')) continue;
      out.push(full);
    }
  }
  return out.sort();
}

function copyFile(source, target) {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function syncDirectory(sourceRoot, targetRoot) {
  ensureDir(targetRoot);
  const sourceFiles = listFilesRecursively(sourceRoot);
  const expectedTargets = new Set();
  const synced = [];

  for (const source of sourceFiles) {
    const rel = path.relative(sourceRoot, source);
    const target = path.join(targetRoot, rel);
    copyFile(source, target);
    expectedTargets.add(path.resolve(target));
    synced.push({ source, target });
  }

  for (const existing of listFilesRecursively(targetRoot, { includeDotfiles: true })) {
    const absExisting = path.resolve(existing);
    if (!expectedTargets.has(absExisting)) fs.rmSync(absExisting);
  }

  return synced;
}

function syncFiles(fileMap) {
  return fileMap.map(({ source, target }) => {
    copyFile(source, target);
    return { source, target };
  });
}

function collectManifestOnlyPairs(paths) {
  const pairs = [];
  for (const manifestPath of paths) {
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Missing required bundle-native path: ${relativeToRepo(manifestPath)}`);
    }
    const stat = fs.statSync(manifestPath);
    if (stat.isDirectory()) {
      const files = listFilesRecursively(manifestPath, { includeDotfiles: true });
      for (const filePath of files) {
        pairs.push({ source: filePath, target: filePath });
      }
      continue;
    }
    if (stat.isFile()) {
      pairs.push({ source: manifestPath, target: manifestPath });
      continue;
    }
    throw new Error(`Unsupported bundle-native manifest path: ${relativeToRepo(manifestPath)}`);
  }
  return pairs;
}

function resolveFileSyncMap(fileMap) {
  const resolved = [];
  for (const mapping of fileMap) {
    const { source, required = true } = mapping;
    if (fs.existsSync(source)) {
      resolved.push(mapping);
      continue;
    }
    if (required) {
      throw new Error(`Missing required sync source: ${relativeToRepo(source)}`);
    }
    console.warn(`Skipping optional sync source (not found): ${relativeToRepo(source)}`);
  }
  return resolved;
}

function pruneManagedFileTargets(fileMap) {
  const byDir = new Map();
  for (const { target } of fileMap) {
    const dir = path.dirname(target);
    if (!byDir.has(dir)) byDir.set(dir, new Set());
    byDir.get(dir).add(path.resolve(target));
  }
  for (const [dir, expected] of byDir.entries()) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (entry.name === '.DS_Store') continue;
      const filePath = path.resolve(path.join(dir, entry.name));
      if (!expected.has(filePath)) fs.rmSync(filePath);
    }
  }
}

function buildManifestEntries(pairs) {
  return pairs
    .map(({ source, target }) => {
      const stat = fs.statSync(target);
      return {
        source: relativeToRepo(source),
        target: relativeToRepo(target),
        size: stat.size,
        sha256: sha256(target),
      };
    })
    .sort((a, b) => a.target.localeCompare(b.target));
}

export function buildManifestDocument(entries) {
  return {
    schemaVersion: 1,
    entries,
  };
}

function writeManifest(entries) {
  ensureDir(path.dirname(MANIFEST_PATH));
  const manifest = buildManifestDocument(entries);
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

function removeStalePaths(paths) {
  for (const stalePath of paths) {
    if (fs.existsSync(stalePath)) {
      fs.rmSync(stalePath, { recursive: true, force: true });
    }
  }
}

function removeMacMetadata(rootDir) {
  for (const filePath of listFilesRecursively(rootDir, { includeDotfiles: true })) {
    if (path.basename(filePath) === '.DS_Store') fs.rmSync(filePath, { force: true });
  }
}

export function syncSkillBundle() {
  const resolvedFileSyncMap = resolveFileSyncMap(FILE_SYNC_MAP);
  const dirPairs = DIRECTORY_SYNC_MAP.flatMap(({ source, target }) => syncDirectory(source, target));
  const filePairs = syncFiles(resolvedFileSyncMap);
  const nativePairs = collectManifestOnlyPairs([
    ...NATIVE_FILE_MANIFEST_PATHS,
    ...NATIVE_DIRECTORY_MANIFEST_PATHS,
  ]);
  pruneManagedFileTargets(resolvedFileSyncMap);
  removeStalePaths(STALE_PATHS);
  removeMacMetadata(SKILL_ROOT);
  const entries = buildManifestEntries([...dirPairs, ...filePairs, ...nativePairs]);
  writeManifest(entries);
  return {
    entries,
    manifestPath: MANIFEST_PATH,
    skillRoot: SKILL_ROOT,
  };
}

function main() {
  const { entries, manifestPath } = syncSkillBundle();
  console.log(`Skill bundle sync complete: ${relativeToRepo(SKILL_ROOT)}`);
  console.log(`Manifest: ${relativeToRepo(manifestPath)} (${entries.length} entries)`);
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main();
}
