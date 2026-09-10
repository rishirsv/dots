import { createHash, randomBytes } from 'node:crypto';
import {
  lstat,
  mkdir,
  opendir,
  readFile,
  realpath,
  stat,
  unlink,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { ToolError } from './errors.js';
import { deriveNewContentsFromChunks, parsePatch, PatchParseError, type Hunk } from './vendor/patch/index.js';

export interface RepositoryRunner {
  runFile(
    file: string,
    args: readonly string[],
    options?: { cwd?: string; timeoutMs?: number; maxBytes?: number }
  ): Promise<{ stdout: string; stderr: string; exitCode: number; truncated: boolean }>;
}

const DEFAULT_BYTES = 1024 * 1024;
const MAX_RESULT_BYTES = 4 * 1024 * 1024;
const MAX_SOURCE_BYTES = 64 * 1024 * 1024;
const MAX_COMMIT_BYTES = 16 * 1024 * 1024;
const MAX_PATCH_BYTES = 4 * 1024 * 1024;
const MAX_PATCH_FILE_BYTES = 16 * 1024 * 1024;
const MAX_IMAGE_INPUT_BYTES = 20 * 1024 * 1024;
// Base64 expands bytes by 4/3 and the complete MCP response has a 3 MiB wire limit.
const MAX_IMAGE_OUTPUT_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40_000_000;
const MAX_DIRECTORY_ENTRIES = 2_000;
const MAX_SEARCH_SNAPSHOTS = 8;
const MAX_SEARCH_SNAPSHOT_BYTES = 16 * 1024 * 1024;
const SEARCH_SNAPSHOT_TTL_MS = 10 * 60 * 1000;

type GitResult = Awaited<ReturnType<RepositoryRunner['runFile']>>;
type ExpectedState = { kind: 'absent' } | { kind: 'file'; sha256: string };
type FileState = { kind: 'absent' } | { kind: 'file'; content: string; sha256: string };
type SearchSnapshot = {
  id: string;
  key: string;
  matches: Array<Record<string, unknown>>;
  incomplete: boolean;
  observed_at: string;
  expires: number;
  bytes: number;
};

function observedAt(): string {
  return new Date().toISOString();
}

function byteLimit(value: number | undefined, fallback = DEFAULT_BYTES): number {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new ToolError('invalid_input', 'max_bytes must be a positive integer');
  }
  return Math.min(value, MAX_RESULT_BYTES);
}

function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

function errCode(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null
    ? (error as NodeJS.ErrnoException).code
    : undefined;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isCredentialPath(relativePath: string): boolean {
  const pieces = relativePath.split('/');
  const basename = pieces.at(-1)?.toLowerCase() ?? '';
  if (pieces.some((piece) => piece.toLowerCase() === '.git')) return true;
  if (basename === '.env' || basename.startsWith('.env.')) {
    return !/\.(?:example|sample|template|dist)$/.test(basename);
  }
  if (basename === 'id_rsa' || basename === 'id_ed25519') return true;
  return basename.endsWith('.pem') || basename.endsWith('.key');
}

function normalizePath(input: string): string {
  if (typeof input !== 'string' || input.length === 0 || input.includes('\0')) {
    throw new ToolError('invalid_path', 'path must be a non-empty repository-relative path');
  }
  if (/[\r\n]/.test(input) || path.isAbsolute(input)) {
    throw new ToolError('invalid_path', `path is not a safe repository-relative path: ${input}`);
  }
  const normalized = path.posix.normalize(input.replaceAll('\\', '/'));
  if (normalized === '..' || normalized.startsWith('../')) {
    throw new ToolError('invalid_path', `path escapes the repository: ${input}`);
  }
  if (isCredentialPath(normalized)) {
    throw new ToolError('path_denied', `access to conventional credential path is denied: ${normalized}`);
  }
  return normalized;
}

function safeRevision(input: string, field: string): string {
  if (
    input.length === 0 ||
    input.startsWith('-') ||
    input.includes(':') ||
    /[\0-\x20\\]/.test(input) ||
    !/^[A-Za-z0-9][A-Za-z0-9._/~^{}-]*$/.test(input)
  ) {
    throw new ToolError('invalid_revision', `${field} is not a safe Git revision`);
  }
  return input;
}

function gitFailure(action: string, result: GitResult): ToolError {
  const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.exitCode}`;
  return new ToolError('git_error', `${action} failed: ${detail}`);
}

function lineRange(input: { start_line?: number; end_line?: number }): {
  start: number;
  end: number | undefined;
} {
  const start = input.start_line ?? 1;
  const end = input.end_line;
  if (!Number.isSafeInteger(start) || start < 1) {
    throw new ToolError('invalid_input', 'start_line must be a positive integer');
  }
  if (end !== undefined && (!Number.isSafeInteger(end) || end < start)) {
    throw new ToolError('invalid_input', 'end_line must be an integer at least start_line');
  }
  return { start, end };
}

function numberedText(text: string, start: number, end: number | undefined, budget: number): Record<string, unknown> {
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  const last = Math.min(end ?? lines.length, lines.length);
  const emitted: string[] = [];
  let used = 0;
  let next = start;
  let requiredLineBytes: number | undefined;
  for (; next <= last; next++) {
    const line = `${next}: ${lines[next - 1]}`;
    const bytes = Buffer.byteLength(JSON.stringify(line)) + (emitted.length ? 2 : 0);
    if (used + bytes > budget) { requiredLineBytes = bytes + 512; break; }
    emitted.push(line); used += bytes;
  }
  return {
    text: emitted.join('\n'), start_line: start, end_line: start + emitted.length - 1,
    total_lines: lines.length, next_line: next <= last ? next : null,
    truncated: next <= last || start > 1 || last < lines.length,
    ...(next <= last && emitted.length === 0 ? { oversized_line: true, required_max_bytes: requiredLineBytes } : {})
  };
}

function globRegex(glob: string): RegExp {
  let source = '^';
  for (let index = 0; index < glob.length; index += 1) {
    const char = glob[index] as string;
    if (char === '*') {
      if (glob[index + 1] === '*') {
        source += '.*';
        index += 1;
      } else {
        source += '[^/]*';
      }
    } else if (char === '?') {
      source += '[^/]';
    } else {
      source += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`${source}$`);
}


function boundedSnippet(value: string): { snippet: string; snippet_truncated: boolean } {
  const bytes = Buffer.from(value);
  if (bytes.byteLength <= 2_000) return { snippet: value, snippet_truncated: false };
  return { snippet: bytes.subarray(0, 2_000).toString('utf8'), snippet_truncated: true };
}

export class Repository {
  private patchTail: Promise<void> = Promise.resolve();
  private rgPath: Promise<string | null> | undefined;
  private searchSnapshots = new Map<string, SearchSnapshot>();
  private searchSnapshotBytes = 0;

  constructor(readonly root: string, private readonly runner: RepositoryRunner) {}

  private async git(args: readonly string[], maxBytes = DEFAULT_BYTES): Promise<GitResult> {
    return await this.runner.runFile(
      'git',
      ['--literal-pathspecs', '-c', 'diff.external=', '-c', 'core.attributesFile=/dev/null', ...args],
      { cwd: this.root, timeoutMs: 30_000, maxBytes }
    );
  }

  private async resolvePath(relativePath: string, allowMissing = false): Promise<{
    relative: string;
    absolute: string;
    canonical: string;
  }> {
    const relative = normalizePath(relativePath);
    const absolute = path.resolve(this.root, relative);
    const rootPrefix = `${this.root}${path.sep}`;
    if (absolute !== this.root && !absolute.startsWith(rootPrefix)) {
      throw new ToolError('invalid_path', `path escapes the repository: ${relativePath}`);
    }
    let canonical = absolute;
    try {
      canonical = await realpath(absolute);
      if (canonical !== this.root && !canonical.startsWith(rootPrefix)) {
        throw new ToolError('invalid_path', `path resolves outside the repository: ${relative}`);
      }
    } catch (error) {
      if (!allowMissing || errCode(error) !== 'ENOENT') throw error;
      try {
        const link = await lstat(absolute);
        if (link.isSymbolicLink()) {
          throw new ToolError('invalid_path', `path is a dangling symbolic link: ${relative}`);
        }
      } catch (linkError) {
        if (errCode(linkError) !== 'ENOENT') throw linkError;
      }
      let parent = path.dirname(absolute);
      while (true) {
        try {
          const canonicalParent = await realpath(parent);
          if (canonicalParent !== this.root && !canonicalParent.startsWith(rootPrefix)) {
            throw new ToolError('invalid_path', `path resolves outside the repository: ${relative}`);
          }
          canonical = path.join(canonicalParent, path.relative(parent, absolute));
          break;
        } catch (parentError) {
          if (errCode(parentError) !== 'ENOENT' || parent === this.root) throw parentError;
          parent = path.dirname(parent);
        }
      }
    }
    if (isCredentialPath(path.relative(this.root, canonical).split(path.sep).join('/'))) {
      throw new ToolError('path_denied', `resolved path is excluded: ${relative}`);
    }
    return { relative, absolute, canonical };
  }

  private async head(): Promise<string | null> {
    const result = await this.git(['rev-parse', '--verify', 'HEAD^{commit}'], 256);
    if (result.exitCode !== 0) {
      // An initialized repository may have a symbolic HEAD whose branch has no commit yet.
      // Verify that state explicitly so unrelated Git failures still reach the caller.
      const symbolic = await this.git(['symbolic-ref', '--quiet', 'HEAD'], 4096);
      const inside = await this.git(['rev-parse', '--is-inside-work-tree'], 128);
      if (
        symbolic.exitCode === 0 && !symbolic.truncated && symbolic.stdout.trim().startsWith('refs/heads/') &&
        inside.exitCode === 0 && !inside.truncated && inside.stdout.trim() === 'true'
      ) {
        return null;
      }
      throw gitFailure('read HEAD', result);
    }
    if (result.truncated) throw gitFailure('read HEAD', result);
    return result.stdout.trim();
  }

  private async resolveCommit(commit: string): Promise<string> {
    const revision = safeRevision(commit, 'commit');
    const result = await this.git(['rev-parse', '--verify', `${revision}^{commit}`], 256);
    if (result.exitCode !== 0 || result.truncated) throw gitFailure('resolve commit', result);
    const oid = result.stdout.trim();
    if (!/^[0-9a-f]{40,64}$/.test(oid)) throw new ToolError('git_error', 'Git returned an invalid commit ID');
    return oid;
  }

  async status(): Promise<Record<string, unknown>> {
    const [head, branchResult, statusResult] = await Promise.all([
      this.head(),
      this.git(['symbolic-ref', '--quiet', '--short', 'HEAD'], 4096),
      this.git(['status', '--porcelain=v1', '-z', '--untracked-files=all'], MAX_RESULT_BYTES)
    ]);
    if (statusResult.exitCode !== 0) throw gitFailure('read status', statusResult);
    if (statusResult.truncated) throw new ToolError('output_limit', 'repository status exceeds the safe output limit');
    const staged: Array<Record<string, string>> = [];
    const unstaged: Array<Record<string, string>> = [];
    const untracked: string[] = [];
    const records = statusResult.stdout.split('\0');
    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      if (!record || record.length < 4) continue;
      const code = record.slice(0, 2);
      const candidate = record.slice(3);
      let displayPath = candidate;
      if (code[0] === 'R' || code[0] === 'C' || code[1] === 'R' || code[1] === 'C') {
        const original = records[index + 1];
        index += 1;
        if (original && !isCredentialPath(original)) displayPath = `${original} -> ${candidate}`;
      }
      if (isCredentialPath(candidate)) continue;
      if (code === '??') untracked.push(candidate);
      else {
        if (code[0] !== ' ' && code[0] !== '?') staged.push({ path: displayPath, status: code[0] as string });
        if (code[1] !== ' ' && code[1] !== '?') unstaged.push({ path: displayPath, status: code[1] as string });
      }
    }
    return {
      root: this.root,
      head,
      branch: branchResult.exitCode === 0 ? branchResult.stdout.trim() : null,
      staged,
      unstaged,
      untracked,
      truncated: false,
      observed_at: observedAt()
    };
  }

  async read(input: {
    paths: Array<string | { path: string; start_line?: number; end_line?: number }>;
    start_line?: number;
    end_line?: number;
    commit?: string;
    max_bytes?: number;
  }): Promise<Record<string, unknown>> {
    if (!Array.isArray(input.paths) || input.paths.length === 0 || input.paths.length > 100) {
      throw new ToolError('invalid_input', 'paths must contain between 1 and 100 paths');
    }
    const limit = byteLimit(input.max_bytes);
    const defaultRange = lineRange(input);
    const commit = input.commit === undefined ? null : await this.resolveCommit(input.commit);
    const results: Array<Record<string, unknown>> = [];
    let used = 0;
    let truncated = false;

    for (const requested of input.paths) {
      if (used >= limit) {
        truncated = true;
        break;
      }
      if (typeof requested !== 'string' && (typeof requested !== 'object' || requested === null)) {
        throw new ToolError('invalid_input', 'each path must be a string or an object with a path');
      }
      const requestedPath = typeof requested === 'string' ? requested : requested.path;
      const range = typeof requested === 'string'
        ? defaultRange
        : lineRange({
            start_line: requested.start_line ?? defaultRange.start,
            end_line: requested.end_line ?? defaultRange.end
          });
      const resolved = await this.resolvePath(requestedPath, true);
      const remaining = limit - used;
      const item = commit === null
        ? await this.readLive(resolved.relative, resolved.absolute, range.start, range.end, remaining)
        : await this.readCommit(commit, resolved.relative, range.start, range.end, remaining);
      const encodedBytes = Buffer.byteLength(JSON.stringify(item));
      if (encodedBytes > remaining && results.length > 0) {
        truncated = true;
        break;
      }
      results.push(item);
      used += encodedBytes;
      truncated ||= item.truncated === true;
    }
    return {
      files: results,
      commit,
      truncated,
      next_path_index: results.length < input.paths.length ? results.length : null,
      observed_at: observedAt()
    };
  }

  private async readLive(
    relative: string,
    absolute: string,
    start: number,
    end: number | undefined,
    remaining: number
  ): Promise<Record<string, unknown>> {
    let metadata;
    try {
      metadata = await stat(absolute);
    } catch (error) {
      if (errCode(error) === 'ENOENT') throw new ToolError('not_found', `path does not exist: ${relative}`);
      throw error;
    }
    if (metadata.isDirectory()) return await this.readDirectory(relative, absolute, remaining);
    if (!metadata.isFile()) throw new ToolError('invalid_path', `path is not a regular file: ${relative}`);
    if (metadata.size > MAX_SOURCE_BYTES) throw new ToolError('file_too_large', `file exceeds ${MAX_SOURCE_BYTES} bytes: ${relative}`);
    const data = await readFile(absolute);
    if (data.includes(0)) throw new ToolError('binary_file', `file is binary; use view_image when appropriate: ${relative}`);
    const content = data.toString('utf8');
    const selected = numberedText(content, start, end, Math.max(0, remaining - 512));
    return {
      path: relative,
      kind: 'file',
      ...selected,
      sha256: sha256(data),
      size_bytes: data.byteLength,
      observed_at: observedAt()
    };
  }

  private async readDirectory(relative: string, absolute: string, remaining: number): Promise<Record<string, unknown>> {
    const entries: Array<{ name: string; kind: string }> = [];
    let bytes = 0;
    let truncated = false;
    const directory = await opendir(absolute);
    for await (const entry of directory) {
      const child = relative === '.' ? entry.name : `${relative}/${entry.name}`;
      if (isCredentialPath(child)) continue;
      const item = {
        name: entry.name,
        kind: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : entry.isSymbolicLink() ? 'symlink' : 'other'
      };
      const size = Buffer.byteLength(JSON.stringify(item));
      if (entries.length >= MAX_DIRECTORY_ENTRIES || bytes + size > Math.max(0, remaining - 256)) {
        truncated = true;
        break;
      }
      entries.push(item);
      bytes += size;
    }
    entries.sort((left, right) => left.name.localeCompare(right.name));
    return { path: relative, kind: 'directory', entries, truncated, observed_at: observedAt() };
  }

  private async readCommit(
    commit: string,
    relative: string,
    start: number,
    end: number | undefined,
    remaining: number
  ): Promise<Record<string, unknown>> {
    const object = relative === '.' ? commit : `${commit}:${relative}`;
    const typeResult = await this.git(['cat-file', '-t', object], 128);
    if (typeResult.exitCode !== 0) throw new ToolError('not_found', `path does not exist at commit: ${relative}`);
    const type = typeResult.stdout.trim();
    if (type === 'tree') {
      const listing = await this.git(['ls-tree', '-z', object], Math.min(remaining, MAX_RESULT_BYTES));
      if (listing.exitCode !== 0) throw gitFailure('list committed directory', listing);
      const entries: Array<Record<string, string>> = [];
      for (const record of listing.stdout.split('\0')) {
        if (!record) continue;
        const tab = record.indexOf('\t');
        const prefix = record.slice(0, tab).split(' ');
        const name = record.slice(tab + 1);
        const child = relative === '.' ? name : `${relative}/${name}`;
        if (!isCredentialPath(child)) entries.push({ name, kind: prefix[1] === 'tree' ? 'directory' : 'file' });
      }
      return { path: relative, kind: 'directory', entries, truncated: listing.truncated, commit };
    }
    if (type !== 'blob') throw new ToolError('invalid_path', `committed path is not a file: ${relative}`);
    const contentResult = await this.git(['show', '--no-ext-diff', '--no-textconv', object], MAX_COMMIT_BYTES);
    if (contentResult.exitCode !== 0) throw gitFailure('read committed file', contentResult);
    if (contentResult.truncated) throw new ToolError('file_too_large', `committed file exceeds ${MAX_COMMIT_BYTES} bytes: ${relative}`);
    if (contentResult.stdout.includes('\0')) throw new ToolError('binary_file', `committed file is binary: ${relative}`);
    const selected = numberedText(contentResult.stdout, start, end, Math.max(0, remaining - 512));
    return {
      path: relative,
      kind: 'file',
      ...selected,
      sha256: sha256(contentResult.stdout),
      size_bytes: Buffer.byteLength(contentResult.stdout),
      commit
    };
  }

  private async searchFiles(pathFilter?: string, glob?: string): Promise<string[]> {
    const result = await this.git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'], MAX_RESULT_BYTES);
    if (result.exitCode !== 0) throw gitFailure('list searchable files', result);
    if (result.truncated) throw new ToolError('output_limit', 'searchable file list exceeds the safe limit');
    const prefix = pathFilter === undefined ? null : normalizePath(pathFilter).replace(/\/$/, '');
    const matcher = glob === undefined ? null : globRegex(glob);
    return result.stdout
      .split('\0')
      .filter((file) => file !== '' && !/[\r\n\0]/.test(file) && !isCredentialPath(file))
      .filter((file) => prefix === null || file === prefix || file.startsWith(`${prefix}/`))
      .filter((file) => matcher === null || matcher.test(file));
  }

  private getRg(): Promise<string | null> {
    this.rgPath ??= this.runner
      .runFile('/usr/bin/which', ['rg'], { cwd: this.root, timeoutMs: 5_000, maxBytes: 4096 })
      .then((result) => result.exitCode === 0 && !result.truncated ? result.stdout.trim() || null : null)
      .catch(() => null);
    return this.rgPath;
  }

  async search(input: {
    query: string;
    path?: string;
    glob?: string;
    regex?: boolean;
    case_sensitive?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<Record<string, unknown>> {
    if (typeof input.query !== 'string' || input.query.length === 0 || Buffer.byteLength(input.query) > 16_384) {
      throw new ToolError('invalid_input', 'query must be between 1 and 16384 bytes');
    }
    const limit = input.limit ?? 100;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500) {
      throw new ToolError('invalid_input', 'limit must be an integer between 1 and 500');
    }
    const key = JSON.stringify([input.query, input.path ?? null, input.glob ?? null, !!input.regex, !!input.case_sensitive]);
    if (input.cursor !== undefined) {
      let cursor: { id?: string; offset?: number } = {};
      try { cursor = JSON.parse(Buffer.from(input.cursor, 'base64url').toString('utf8')); } catch { /* rejected below */ }
      this.pruneSearchSnapshots();
      if (typeof cursor.id !== 'string') {
        throw new ToolError('invalid_cursor', 'Search cursor is malformed; repeat the search without a cursor.');
      }
      const snapshot = this.searchSnapshots.get(cursor.id);
      if (!snapshot) {
        throw new ToolError('invalid_cursor', 'Search cursor expired or was evicted; repeat the search without a cursor.');
      }
      if (snapshot.key !== key) {
        throw new ToolError('invalid_cursor', 'Search cursor belongs to another query; repeat the search without a cursor.');
      }
      if (!Number.isSafeInteger(cursor.offset) || cursor.offset! < 0 || cursor.offset! >= snapshot.matches.length) {
        throw new ToolError('invalid_cursor', 'Search cursor offset is invalid; repeat the search without a cursor.');
      }
      return this.searchPage(snapshot, cursor.offset!, limit);
    }
    let expression: RegExp;
    try {
      expression = new RegExp(input.regex ? input.query : input.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), input.case_sensitive ? '' : 'i');
    } catch (error) {
      throw new ToolError('invalid_regex', `invalid regular expression: ${message(error)}`);
    }
    const files = await this.searchFiles(input.path, input.glob);
    for (let offset = 0; offset < files.length; offset += 200) {
      await Promise.all(files.slice(offset, offset + 200).map(async (file) => { await this.resolvePath(file); }));
    }
    const allMatches: Array<Record<string, unknown>> = [];
    const rg = await this.getRg();
    let incomplete = false;

    if (rg !== null) {
      for (let offset = 0; offset < files.length; offset += 200) {
        if (allMatches.length >= 10_000) { incomplete = true; break; }
        const batch = files.slice(offset, offset + 200);
        if (batch.length === 0) continue;
        const args = [
          '--json', '--no-messages', '--color', 'never', '--line-number',
          ...(input.regex ? [] : ['--fixed-strings']),
          ...(input.case_sensitive ? ['--case-sensitive'] : ['--ignore-case']),
          '--regexp', input.query, '--', ...batch
        ];
        const result = await this.runner.runFile(rg, args, { cwd: this.root, timeoutMs: 20_000, maxBytes: MAX_RESULT_BYTES });
        if (result.exitCode !== 0 && result.exitCode !== 1) {
          throw new ToolError('search_failed', `Search backend failed (exit ${result.exitCode}): ${result.stderr.trim() || 'retry or narrow the query'}`);
        }
        incomplete ||= result.truncated;
        for (const line of result.stdout.split('\n')) {
          if (!line) continue;
          try {
            const event = JSON.parse(line) as { type?: string; data?: { path?: { text?: string }; line_number?: number; lines?: { text?: string } } };
            if (event.type === 'match' && event.data?.path?.text && event.data.lines?.text !== undefined) {
              allMatches.push({
                path: event.data.path.text,
                line: event.data.line_number,
                ...boundedSnippet(event.data.lines.text.replace(/[\r\n]+$/, ''))
              });
            }
          } catch {
            incomplete = true;
          }
        }
      }
    } else {
      let scannedBytes = 0;
      for (const file of files) {
        if (scannedBytes >= 32 * 1024 * 1024 || allMatches.length > 10_000) {
          incomplete = true;
          break;
        }
        const resolved = await this.resolvePath(file);
        const metadata = await stat(resolved.absolute);
        if (!metadata.isFile() || metadata.size > 2 * 1024 * 1024) {
          incomplete ||= metadata.size > 2 * 1024 * 1024;
          continue;
        }
        const content = await readFile(resolved.absolute, 'utf8');
        scannedBytes += Buffer.byteLength(content);
        for (const [index, line] of content.split('\n').entries()) {
          expression.lastIndex = 0;
          if (expression.test(line)) allMatches.push({ path: file, line: index + 1, ...boundedSnippet(line) });
        }
      }
    }
    for (const file of files) {
      expression.lastIndex = 0;
      if (expression.test(file)) allMatches.push({ path: file, line: null, snippet: file, match_kind: 'path' });
    }
    let bytes = 0;
    let count = 0;
    for (const match of allMatches) {
      bytes += Buffer.byteLength(JSON.stringify(match));
      if (bytes > MAX_RESULT_BYTES || count >= 10_000) { incomplete = true; break; }
      count++;
    }
    const matches = allMatches.slice(0, count);
    const snapshot: SearchSnapshot = {
      id: randomBytes(12).toString('hex'), key, matches, incomplete,
      observed_at: observedAt(), expires: Date.now() + SEARCH_SNAPSHOT_TTL_MS,
      bytes: Buffer.byteLength(JSON.stringify(matches))
    };
    this.retainSearchSnapshot(snapshot);
    return this.searchPage(snapshot, 0, limit);
  }

  private pruneSearchSnapshots(now = Date.now()): void {
    for (const [id, snapshot] of this.searchSnapshots) {
      if (snapshot.expires <= now) {
        this.searchSnapshots.delete(id);
        this.searchSnapshotBytes -= snapshot.bytes;
      }
    }
  }

  private retainSearchSnapshot(snapshot: SearchSnapshot): void {
    this.pruneSearchSnapshots();
    this.searchSnapshots.set(snapshot.id, snapshot);
    this.searchSnapshotBytes += snapshot.bytes;
    while (this.searchSnapshots.size > MAX_SEARCH_SNAPSHOTS || this.searchSnapshotBytes > MAX_SEARCH_SNAPSHOT_BYTES) {
      const oldest = this.searchSnapshots.entries().next().value as [string, SearchSnapshot] | undefined;
      if (!oldest) break;
      this.searchSnapshots.delete(oldest[0]);
      this.searchSnapshotBytes -= oldest[1].bytes;
    }
  }

  clearSearchSnapshots(): void {
    this.searchSnapshots.clear();
    this.searchSnapshotBytes = 0;
  }

  private searchPage(snapshot: SearchSnapshot, offset: number, limit: number): Record<string, unknown> {
    const matches = snapshot.matches.slice(offset, offset + limit);
    const hasMore = offset + matches.length < snapshot.matches.length;
    return {
      matches, truncated: hasMore || snapshot.incomplete, incomplete: snapshot.incomplete,
      next_cursor: hasMore ? Buffer.from(JSON.stringify({ id: snapshot.id, offset: offset + matches.length })).toString('base64url') : null,
      observed_at: snapshot.observed_at,
      ...(snapshot.incomplete ? { detail: 'Scan limit reached or output was truncated; narrow the search to inspect remaining files.' } : {})
    };
  }

  private async diffArgs(mode: 'staged' | 'unstaged' | 'commits', base?: string, head?: string): Promise<string[]> {
    if (mode === 'staged') return ['diff', '--cached'];
    if (mode === 'unstaged') return ['diff'];
    if (base === undefined || head === undefined) {
      throw new ToolError('invalid_input', 'commit diffs require base and head');
    }
    const [baseCommit, headCommit] = await Promise.all([
      this.resolveCommit(safeRevision(base, 'base')),
      this.resolveCommit(safeRevision(head, 'head'))
    ]);
    return ['diff', baseCommit, headCommit];
  }

  private parseChangedFiles(output: string): Array<Record<string, string>> {
    const records = output.split('\0');
    const files: Array<Record<string, string>> = [];
    for (let index = 0; index < records.length;) {
      const status = records[index++];
      if (!status) continue;
      const first = records[index++] ?? '';
      if (status.startsWith('R') || status.startsWith('C')) {
        const second = records[index++] ?? '';
        if (!isCredentialPath(first) && !isCredentialPath(second)) files.push({ status, old_path: first, path: second });
      } else if (!isCredentialPath(first)) {
        files.push({ status, path: first });
      }
    }
    return files;
  }

  async diff(input: {
    mode: 'staged' | 'unstaged' | 'commits';
    base?: string;
    head?: string;
    paths?: string[];
    max_bytes?: number;
  }): Promise<Record<string, unknown>> {
    const maxBytes = byteLimit(input.max_bytes);
    const requested = input.paths?.map((item) => normalizePath(item));
    const baseArgs = await this.diffArgs(input.mode, input.base, input.head);
    const nameResult = await this.git([...baseArgs, '--name-status', '-z', ...(requested ? ['--', ...requested] : [])], MAX_RESULT_BYTES);
    if (nameResult.exitCode !== 0) throw gitFailure('list changed files', nameResult);
    if (nameResult.truncated) throw new ToolError('output_limit', 'changed-file list exceeds the safe limit');
    const changedFiles = this.parseChangedFiles(nameResult.stdout);
    const safePaths = changedFiles.flatMap((item) => [item.old_path, item.path]).filter((item): item is string => item !== undefined);
    let text = '';
    let truncated = false;
    if (safePaths.length > 0) {
      const result = await this.git([...baseArgs, '--no-ext-diff', '--no-textconv', '--unified=3', '--', ...safePaths], maxBytes);
      if (result.exitCode !== 0) throw gitFailure('read diff', result);
      text = result.stdout;
      truncated = result.truncated;
    }
    let untracked: string[] = [];
    if (input.mode === 'unstaged') {
      const list = await this.git(['ls-files', '-z', '--others', '--exclude-standard', ...(requested ? ['--', ...requested] : [])], maxBytes);
      if (list.exitCode !== 0) throw gitFailure('list untracked files', list);
      untracked = list.stdout.split('\0').filter((item) => item !== '' && !isCredentialPath(item));
      truncated ||= list.truncated;
    }
    return { mode: input.mode, text, changed_files: changedFiles, untracked, truncated, observed_at: observedAt() };
  }

  async history(input: { path?: string; limit?: number; skip?: number }): Promise<Record<string, unknown>> {
    const limit = input.limit ?? 20;
    const skip = input.skip ?? 0;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 200 || !Number.isSafeInteger(skip) || skip < 0) {
      throw new ToolError('invalid_input', 'history limit must be 1..200 and skip must be non-negative');
    }
    const relative = input.path === undefined ? null : normalizePath(input.path);
    const result = await this.git([
      'log', `--max-count=${limit}`, `--skip=${skip}`, '--format=%H%x00%aI%x00%s%x00',
      ...(relative === null ? [] : ['--', relative])
    ], MAX_RESULT_BYTES);
    if (result.exitCode !== 0) throw gitFailure('read history', result);
    const fields = result.stdout.split('\0');
    const commits: Array<Record<string, string>> = [];
    for (let index = 0; index + 2 < fields.length; index += 3) {
      const oid = fields[index]?.trim();
      if (!oid) continue;
      commits.push({ commit: oid, authored_at: fields[index + 1] ?? '', subject: (fields[index + 2] ?? '').replace(/^\n/, '') });
    }
    return { commits, skip, limit, truncated: result.truncated, observed_at: observedAt() };
  }

  async image(input: { path: string; detail?: 'high' | 'original' }): Promise<{
    data: string;
    mimeType: string;
    detail: 'high' | 'original';
  }> {
    let imagePath = input.path;
    if (path.isAbsolute(imagePath)) {
      const relative = path.relative(this.root, imagePath);
      if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new ToolError('invalid_path', 'absolute image path must name a file inside the repository');
      }
      imagePath = relative.split(path.sep).join('/');
    }
    const resolved = await this.resolvePath(imagePath);
    const metadata = await stat(resolved.absolute);
    if (!metadata.isFile() || metadata.size > MAX_IMAGE_INPUT_BYTES) {
      throw new ToolError('image_too_large', `image input must be a file no larger than ${MAX_IMAGE_INPUT_BYTES} bytes`);
    }
    const source = sharp(resolved.absolute, { animated: true, limitInputPixels: MAX_IMAGE_PIXELS });
    const info = await source.metadata();
    const allowed = new Set(['png', 'jpeg', 'webp', 'gif']);
    if (!info.format || !allowed.has(info.format)) throw new ToolError('invalid_image', 'supported image formats are PNG, JPEG, WebP, and GIF');
    const detail = input.detail ?? 'high';
    const pipeline = detail === 'high' ? source.resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true }) : source;
    const output = await pipeline.toBuffer();
    if (output.byteLength > MAX_IMAGE_OUTPUT_BYTES) throw new ToolError('image_too_large', `decoded image output exceeds ${MAX_IMAGE_OUTPUT_BYTES} bytes`);
    const mimeType = info.format === 'jpeg' ? 'image/jpeg' : `image/${info.format}`;
    return { data: output.toString('base64'), mimeType, detail };
  }

  patch(input: { patch: string; expected: Record<string, ExpectedState> }): Promise<{
    text: string;
    exit_code: number;
    changes: unknown[];
    exact: boolean;
  }> {
    const work = this.patchTail.then(async () => await this.applyPatch(input));
    this.patchTail = work.then(() => undefined, () => undefined);
    return work;
  }

  private async fileState(relative: string, absolute: string): Promise<FileState> {
    try {
      const metadata = await stat(absolute);
      if (!metadata.isFile()) throw new ToolError('invalid_path', `patch target is not a regular file: ${relative}`);
      if (metadata.size > MAX_PATCH_FILE_BYTES) throw new ToolError('file_too_large', `patch target exceeds ${MAX_PATCH_FILE_BYTES} bytes: ${relative}`);
      const content = await readFile(absolute, 'utf8');
      return { kind: 'file', content, sha256: sha256(content) };
    } catch (error) {
      if (errCode(error) === 'ENOENT') return { kind: 'absent' };
      throw error;
    }
  }

  private async applyPatch(input: { patch: string; expected: Record<string, ExpectedState> }): Promise<{
    text: string;
    exit_code: number;
    changes: unknown[];
    exact: boolean;
  }> {
    if (typeof input.patch !== 'string' || Buffer.byteLength(input.patch) > MAX_PATCH_BYTES) {
      throw new ToolError('invalid_input', `patch must be a string no larger than ${MAX_PATCH_BYTES} bytes`);
    }
    let hunks: Hunk[];
    try {
      hunks = parsePatch(input.patch).hunks;
    } catch (error) {
      if (error instanceof PatchParseError) {
        const text = error.kind === 'invalid_patch'
          ? `Invalid patch: ${error.detail}\n`
          : `Invalid patch hunk on line ${error.lineNumber}: ${error.detail}\n`;
        return { text, exit_code: 1, changes: [], exact: true };
      }
      return { text: `${message(error)}\n`, exit_code: 1, changes: [], exact: true };
    }
    if (hunks.length === 0) {
      return { text: 'No files were modified.\n', exit_code: 1, changes: [], exact: true };
    }
    const targets = new Map<string, { relative: string; absolute: string; canonical: string }>();
    for (const hunk of hunks) {
      const source = await this.resolvePath(hunk.path, true);
      targets.set(source.relative, source);
      if (hunk.kind === 'update_file' && hunk.movePath !== null) {
        const destination = await this.resolvePath(hunk.movePath, true);
        if (destination.relative === source.relative) throw new ToolError('invalid_patch', 'move source and destination are the same path');
        targets.set(destination.relative, destination);
      }
    }
    const identities = new Map<string, string>();
    for (const target of targets.values()) {
      const keys = [`path:${target.canonical}`];
      try {
        const metadata = await stat(target.absolute);
        keys.push(`inode:${metadata.dev}:${metadata.ino}`);
      } catch (error) { if (errCode(error) !== 'ENOENT') throw error; }
      for (const key of keys) {
        const alias = identities.get(key);
        if (alias !== undefined && alias !== target.relative) {
          throw new ToolError('invalid_patch', `patch targets alias the same file: ${alias}, ${target.relative}`);
        }
        identities.set(key, target.relative);
      }
    }
    const expected = new Map<string, ExpectedState>();
    for (const [rawPath, state] of Object.entries(input.expected)) {
      const resolved = await this.resolvePath(rawPath, true);
      if (expected.has(resolved.relative)) throw new ToolError('invalid_input', `duplicate expected path: ${resolved.relative}`);
      expected.set(resolved.relative, state);
    }
    const missing = [...targets.keys()].filter((target) => !expected.has(target));
    const extra = [...expected.keys()].filter((target) => !targets.has(target));
    if (missing.length > 0 || extra.length > 0) {
      throw new ToolError('expected_state_required', 'expected must describe every and only patch target', { missing, extra });
    }
    const initial = new Map<string, FileState>();
    for (const [relative, target] of targets) {
      const actual = await this.fileState(relative, target.absolute);
      initial.set(relative, actual);
      const wanted = expected.get(relative) as ExpectedState;
      const equal = wanted.kind === actual.kind && (wanted.kind === 'absent' || (actual.kind === 'file' && wanted.sha256 === actual.sha256));
      if (!equal) {
        throw new ToolError('stale_file', `patch target changed since it was read: ${relative}`, {
          expected: wanted,
          actual: actual.kind === 'absent' ? actual : { kind: 'file', sha256: actual.sha256 }
        });
      }
    }

    const simulated = new Map(initial);
    const prepared: Array<{ hunk: Hunk; content?: string }> = [];
    try {
      for (const hunk of hunks) {
        const source = normalizePath(hunk.path);
        const before = simulated.get(source) as FileState;
        if (hunk.kind === 'add_file') {
          simulated.set(source, { kind: 'file', content: hunk.contents, sha256: sha256(hunk.contents) });
          prepared.push({ hunk, content: hunk.contents });
        } else if (hunk.kind === 'delete_file') {
          if (before.kind === 'absent') throw new Error(`Failed to read ${source}: file does not exist`);
          simulated.set(source, { kind: 'absent' });
          prepared.push({ hunk });
        } else {
          if (before.kind === 'absent') throw new Error(`Failed to read file to update ${source}: file does not exist`);
          const derived = await deriveNewContentsFromChunks(source, hunk.chunks, 'normalize_to_lf', before.content);
          const state: FileState = { kind: 'file', content: derived.newContents, sha256: sha256(derived.newContents) };
          if (hunk.movePath === null) simulated.set(source, state);
          else {
            simulated.set(source, { kind: 'absent' });
            simulated.set(normalizePath(hunk.movePath), state);
          }
          prepared.push({ hunk, content: derived.newContents });
        }
      }
    } catch (error) {
      return { text: `${message(error)}\n`, exit_code: 1, changes: [], exact: true };
    }

    const changes: Array<Record<string, unknown>> = [];
    const added: string[] = [];
    const modified: string[] = [];
    const deleted: string[] = [];
    let exact = true;
    try {
      for (const item of prepared) {
        const hunk = item.hunk;
        const source = targets.get(normalizePath(hunk.path)) as { relative: string; absolute: string };
        if (hunk.kind === 'add_file') {
          await mkdir(path.dirname(source.absolute), { recursive: true });
          try {
            await writeFile(source.absolute, item.content as string, 'utf8');
          } catch (error) {
            exact = false;
            throw error;
          }
          added.push(source.relative);
          changes.push({ kind: 'add', path: source.relative, sha256: sha256(item.content as string) });
        } else if (hunk.kind === 'delete_file') {
          await unlink(source.absolute);
          deleted.push(source.relative);
          changes.push({ kind: 'delete', path: source.relative });
        } else if (hunk.movePath !== null) {
          const destination = targets.get(normalizePath(hunk.movePath)) as { relative: string; absolute: string };
          await mkdir(path.dirname(destination.absolute), { recursive: true });
          try {
            await writeFile(destination.absolute, item.content as string, 'utf8');
          } catch (error) {
            exact = false;
            throw error;
          }
          changes.push({ kind: 'add', path: destination.relative, sha256: sha256(item.content as string) });
          await unlink(source.absolute);
          changes[changes.length - 1] = { kind: 'update', path: source.relative, move_path: destination.relative, sha256: sha256(item.content as string) };
          modified.push(destination.relative);
        } else {
          try {
            await writeFile(source.absolute, item.content as string, 'utf8');
          } catch (error) {
            exact = false;
            throw error;
          }
          modified.push(source.relative);
          changes.push({ kind: 'update', path: source.relative, sha256: sha256(item.content as string) });
        }
      }
    } catch (error) {
      return { text: `${message(error)}\n`, exit_code: 1, changes, exact };
    }
    const summary = ['Success. Updated the following files:', ...added.map((item) => `A ${item}`), ...modified.map((item) => `M ${item}`), ...deleted.map((item) => `D ${item}`), ''].join('\n');
    return { text: summary, exit_code: 0, changes, exact };
  }
}
