import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, symlink, link, mkdir, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Repository, type RepositoryRunner } from '../src/repo.js';
import { parsePatch } from '../src/vendor/patch/index.js';

const execFile = promisify(execFileCallback);
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

class TestRunner implements RepositoryRunner {
  async runFile(file: string, args: readonly string[], options?: { cwd?: string; timeoutMs?: number; maxBytes?: number }) {
    try {
      const result = await execFile(file, [...args], { cwd: options?.cwd, timeout: options?.timeoutMs, maxBuffer: options?.maxBytes, encoding: 'utf8' });
      return { stdout: result.stdout, stderr: result.stderr, exitCode: 0, truncated: false };
    } catch (error) {
      const value = error as Error & { stdout?: string; stderr?: string; code?: number };
      return { stdout: value.stdout ?? '', stderr: value.stderr ?? value.message, exitCode: typeof value.code === 'number' ? value.code : 1, truncated: false };
    }
  }
}

describe('Repository patches', () => {
  let root: string;
  let repo: Repository;

  beforeEach(async () => {
    root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'oracle-patch-')));
    await execFile('git', ['init', '-q'], { cwd: root });
    await writeFile(path.join(root, 'one.txt'), 'alpha\n');
    await writeFile(path.join(root, 'two.txt'), 'beta\n');
    repo = new Repository(root, new TestRunner());
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('refuses stale multi-file patches before any write', async () => {
    const patch = '*** Begin Patch\n*** Update File: one.txt\n@@\n-alpha\n+changed\n*** Update File: two.txt\n@@\n-beta\n+changed\n*** End Patch';
    await expect(repo.patch({ patch, expected: {
      'one.txt': { kind: 'file', sha256: hash('alpha\n') },
      'two.txt': { kind: 'file', sha256: hash('stale\n') }
    } })).rejects.toMatchObject({ code: 'stale_file' });
    expect(await readFile(path.join(root, 'one.txt'), 'utf8')).toBe('alpha\n');
  });

  it('requires and verifies an existing move destination', async () => {
    const patch = '*** Begin Patch\n*** Update File: one.txt\n*** Move to: two.txt\n@@\n-alpha\n+moved\n*** End Patch';
    await expect(repo.patch({ patch, expected: {
      'one.txt': { kind: 'file', sha256: hash('alpha\n') }
    } })).rejects.toMatchObject({ code: 'expected_state_required' });
    const result = await repo.patch({ patch, expected: {
      'one.txt': { kind: 'file', sha256: hash('alpha\n') },
      'two.txt': { kind: 'file', sha256: hash('beta\n') }
    } });
    expect(result.exit_code).toBe(0);
    expect(await readFile(path.join(root, 'two.txt'), 'utf8')).toBe('moved\n');
    await expect(readFile(path.join(root, 'one.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('parses Unicode content at EOF and applies it exactly', async () => {
    await writeFile(path.join(root, 'one.txt'), 'start\ncafé 🦊\n');
    const patch = '*** Begin Patch\n*** Update File: one.txt\n@@\n-start\n+début\n café 🦊\n*** End of File\n*** End Patch';
    expect(parsePatch(patch).hunks).toHaveLength(1);
    const result = await repo.patch({ patch, expected: {
      'one.txt': { kind: 'file', sha256: hash('start\ncafé 🦊\n') }
    } });
    expect(result.exit_code).toBe(0);
    expect(await readFile(path.join(root, 'one.txt'), 'utf8')).toBe('début\ncafé 🦊\n');
  });

  it.each(['symlink', 'hardlink'])('rejects a move onto a %s alias before any write', async kind => {
    const alias = path.join(root,'alias.txt');
    if(kind === 'symlink') await symlink('one.txt',alias);
    else await link(path.join(root,'one.txt'),alias);
    await expect(repo.patch({
      patch:'*** Begin Patch\n*** Update File: one.txt\n*** Move to: alias.txt\n@@\n-alpha\n+lost\n*** End Patch',
      expected:{'one.txt':{kind:'file',sha256:hash('alpha\n')},'alias.txt':{kind:'file',sha256:hash('alpha\n')}}
    })).rejects.toMatchObject({code:'invalid_patch'});
    expect(await readFile(path.join(root,'one.txt'),'utf8')).toBe('alpha\n');
    expect(await readFile(alias,'utf8')).toBe('alpha\n');
  });

  it('rejects aliased absent targets through symlinked directories', async () => {
    await mkdir(path.join(root,'dir'));
    await symlink('dir',path.join(root,'alias-dir'));
    await expect(repo.patch({
      patch:'*** Begin Patch\n*** Add File: dir/new.txt\n+first\n*** Add File: alias-dir/new.txt\n+second\n*** End Patch',
      expected:{'dir/new.txt':{kind:'absent'},'alias-dir/new.txt':{kind:'absent'}}
    })).rejects.toMatchObject({code:'invalid_patch'});
    await expect(readFile(path.join(root,'dir/new.txt'))).rejects.toMatchObject({code:'ENOENT'});
  });

  it('requires absence for adds rather than silently overwriting', async () => {
    const patch = '*** Begin Patch\n*** Add File: one.txt\n+replacement\n*** End Patch';
    await expect(repo.patch({ patch, expected: { 'one.txt': { kind: 'absent' } } })).rejects.toMatchObject({ code: 'stale_file' });
    expect(await readFile(path.join(root, 'one.txt'), 'utf8')).toBe('alpha\n');
  });

  it('serializes preflight and writes across concurrent patch calls', async () => {
    const expected = { 'one.txt': { kind: 'file' as const, sha256: hash('alpha\n') } };
    const first = repo.patch({
      patch: '*** Begin Patch\n*** Update File: one.txt\n@@\n-alpha\n+first\n*** End Patch',
      expected
    });
    const second = repo.patch({
      patch: '*** Begin Patch\n*** Update File: one.txt\n@@\n-alpha\n+second\n*** End Patch',
      expected
    });
    const results = await Promise.allSettled([first, second]);
    expect(results[0]).toMatchObject({ status: 'fulfilled', value: { exit_code: 0 } });
    expect(results[1]).toMatchObject({ status: 'rejected', reason: { code: 'stale_file' } });
    expect(await readFile(path.join(root, 'one.txt'), 'utf8')).toBe('first\n');
  });
});
