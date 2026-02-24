import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'kpmg-slides');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'assets', 'bundle-manifest.json');

const DIRECTORY_SYNC_MAP = [
  {
    source: path.join(REPO_ROOT, 'generator'),
    target: path.join(SKILL_ROOT, 'assets', 'slidegen', 'generator'),
  },
  {
    source: path.join(REPO_ROOT, 'templates', 'kpmg-diligence'),
    target: path.join(SKILL_ROOT, 'assets', 'slidegen', 'templates', 'kpmg-diligence'),
  },
];

const FILE_SYNC_MAP = [
  {
    source: path.join(REPO_ROOT, 'docs', 'SKILL-SLIDE-CONTRACT.md'),
    target: path.join(SKILL_ROOT, 'references', 'slide-contract.md'),
  },
  {
    source: path.join(REPO_ROOT, 'docs', 'SKILL-WRITING-GUIDE.md'),
    target: path.join(SKILL_ROOT, 'references', 'writing-guide.md'),
  },
  {
    source: path.join(REPO_ROOT, 'docs', 'SKILL-QA-RULES.md'),
    target: path.join(SKILL_ROOT, 'references', 'qa-rules.md'),
  },
  {
    source: path.join(REPO_ROOT, 'docs', 'SKILL-DECKSPEC-STARTER-GUIDE.md'),
    target: path.join(SKILL_ROOT, 'references', 'starter-template-guide.md'),
  },
  {
    source: path.join(REPO_ROOT, 'docs', 'SKILL-OUTPUT-EXAMPLES.md'),
    target: path.join(SKILL_ROOT, 'references', 'output-examples.md'),
  },
  {
    source: path.join(REPO_ROOT, 'decks', 'deckspec-starter-template.deckSpec.json'),
    target: path.join(SKILL_ROOT, 'assets', 'templates', 'deckspec-starter.json'),
  },
];

const STALE_PATHS = [
  path.join(SKILL_ROOT, 'assets', 'fixtures'),
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
        stack.push(full);
        continue;
      }
      if (!entry.isFile()) continue;
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

function writeManifest(entries) {
  ensureDir(path.dirname(MANIFEST_PATH));
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    entries,
  };
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

function main() {
  const dirPairs = DIRECTORY_SYNC_MAP.flatMap(({ source, target }) => syncDirectory(source, target));
  const filePairs = syncFiles(FILE_SYNC_MAP);
  pruneManagedFileTargets(FILE_SYNC_MAP);
  removeStalePaths(STALE_PATHS);
  removeMacMetadata(SKILL_ROOT);
  const entries = buildManifestEntries([...dirPairs, ...filePairs]);
  writeManifest(entries);
  console.log(`Skill bundle sync complete: ${relativeToRepo(SKILL_ROOT)}`);
  console.log(`Manifest: ${relativeToRepo(MANIFEST_PATH)} (${entries.length} entries)`);
}

main();
