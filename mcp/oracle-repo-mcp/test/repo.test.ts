import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, realpath, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToolError } from '../src/errors.js';
import { Repository, type RepositoryRunner } from '../src/repo.js';

const execFile = promisify(execFileCallback);

class TestRunner implements RepositoryRunner {
  async runFile(file: string, args: readonly string[], options?: { cwd?: string; timeoutMs?: number; maxBytes?: number }) {
    try {
      const result = await execFile(file, [...args], {
        cwd: options?.cwd,
        timeout: options?.timeoutMs,
        maxBuffer: options?.maxBytes ?? 1024 * 1024,
        encoding: 'utf8'
      });
      return { stdout: result.stdout, stderr: result.stderr, exitCode: 0, truncated: false };
    } catch (error) {
      const value = error as Error & { stdout?: string; stderr?: string; code?: number };
      return { stdout: value.stdout ?? '', stderr: value.stderr ?? value.message, exitCode: typeof value.code === 'number' ? value.code : 1, truncated: false };
    }
  }
}

async function git(root: string, ...args: string[]): Promise<void> {
  await execFile('git', args, { cwd: root });
}

describe('Repository reads and Git inspection', () => {
  let root: string;
  let repo: Repository;

  beforeEach(async () => {
    root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'oracle-repo-')));
    await git(root, 'init', '-q');
    await git(root, 'config', 'user.name', 'Test');
    await git(root, 'config', 'user.email', 'test@example.com');
    await writeFile(path.join(root, 'alpha.txt'), 'one\ntwo\nthree\n');
    await writeFile(path.join(root, 'delete.txt'), 'remove me\n');
    await writeFile(path.join(root, '.gitignore'), 'ignored/\n');
    await git(root, 'add', 'alpha.txt', 'delete.txt', '.gitignore');
    await git(root, 'commit', '-qm', 'initial');
    repo = new Repository(root, new TestRunner());
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(root, { recursive: true, force: true });
  });

  it('batches numbered reads with full-file identities that change with content', async () => {
    const first = await repo.read({ paths: ['alpha.txt', '.'], start_line: 2, end_line: 2 });
    const files = first.files as Array<Record<string, unknown>>;
    expect(files[0]).toMatchObject({ path: 'alpha.txt', text: '2: two', size_bytes: 14 });
    expect(files[1]).toMatchObject({ path: '.', kind: 'directory' });
    const oldHash = files[0]?.sha256;
    await writeFile(path.join(root, 'alpha.txt'), 'one\nchanged\nthree\n');
    const second = await repo.read({ paths: ['alpha.txt'] });
    expect((second.files as Array<Record<string, unknown>>)[0]?.sha256).not.toBe(oldHash);
  });

  it('applies per-file line ranges to live and committed reads', async () => {
    await writeFile(path.join(root, 'beta.txt'), 'first\nsecond\nthird\nfourth\n');
    await git(root, 'add', 'beta.txt');
    await git(root, 'commit', '-qm', 'add beta');
    const paths = [
      'alpha.txt',
      { path: 'beta.txt', start_line: 2, end_line: 3 }
    ];

    for (const commit of [undefined, 'HEAD']) {
      const result = await repo.read({ paths, start_line: 1, end_line: 1, commit });
      expect(result.files).toEqual([
        expect.objectContaining({ path: 'alpha.txt', text: '1: one', start_line: 1, end_line: 1 }),
        expect.objectContaining({ path: 'beta.txt', text: '2: second\n3: third', start_line: 2, end_line: 3 })
      ]);
    }

    await expect(repo.read({ paths: [{ path: 'alpha.txt', start_line: 3, end_line: 2 }] }))
      .rejects.toMatchObject({ code: 'invalid_input' });
  });

  it('keeps staged, unstaged, deleted, and untracked state distinct', async () => {
    await writeFile(path.join(root, 'alpha.txt'), 'staged\n');
    await git(root, 'add', 'alpha.txt');
    await writeFile(path.join(root, 'alpha.txt'), 'unstaged\n');
    await writeFile(path.join(root, 'new.txt'), 'new\n');
    await unlink(path.join(root, 'delete.txt'));
    const status = await repo.status();
    expect(status.staged).toEqual(expect.arrayContaining([expect.objectContaining({ path: 'alpha.txt' })]));
    expect(status.unstaged).toEqual(expect.arrayContaining([expect.objectContaining({ path: 'alpha.txt' })]));
    expect(status.unstaged).toEqual(expect.arrayContaining([expect.objectContaining({ path: 'delete.txt', status: 'D' })]));
    expect(status.untracked).toContain('new.txt');
    expect((await repo.diff({ mode: 'staged' })).text).toContain('+staged');
    const unstaged = await repo.diff({ mode: 'unstaged' });
    expect(unstaged.text).toContain('+unstaged');
    expect(unstaged.untracked).toContain('new.txt');
  });

  it('reports an unborn repository without hiding ordinary Git failures', async () => {
    const empty = await realpath(await mkdtemp(path.join(os.tmpdir(), 'oracle-unborn-')));
    try {
      await git(empty, 'init', '-q');
      const status = await new Repository(empty, new TestRunner()).status();
      expect(status).toMatchObject({ head: null, staged: [], unstaged: [], untracked: [] });
    } finally {
      await rm(empty, { recursive: true, force: true });
    }
  });

  it('searches untracked content and reads immutable commits and history', async () => {
    const head = (await repo.status()).head as string;
    await writeFile(path.join(root, 'alpha.txt'), 'working tree only\n');
    await writeFile(path.join(root, 'new.txt'), 'find this needle\n');
    const search = await repo.search({ query: 'needle' });
    expect(search.matches).toEqual(expect.arrayContaining([expect.objectContaining({ path: 'new.txt', line: 1 })]));
    const committed = await repo.read({ paths: ['alpha.txt'], commit: head });
    expect((committed.files as Array<Record<string, unknown>>)[0]?.text).toContain('1: one');
    expect((await repo.history({ limit: 1 })).commits).toEqual([
      expect.objectContaining({ commit: head, subject: 'initial' })
    ]);
  });

  it('blocks credential paths and symlinks escaping the repository', async () => {
    await writeFile(path.join(root, '.env'), 'SECRET=yes\n');
    await expect(repo.read({ paths: ['.env'] })).rejects.toBeInstanceOf(ToolError);
    await symlink('/etc/hosts', path.join(root, 'escape'));
    await expect(repo.read({ paths: ['escape'] })).rejects.toMatchObject({ code: 'invalid_path' });
    await writeFile(path.join(root, '.env.example'), 'SAFE=placeholder\n');
    await expect(repo.read({ paths: ['.env.example'] })).resolves.toBeTruthy();
  });

  it('blocks aliases to excluded and outside-root content in reads and search', async () => {
    await writeFile(path.join(root,'.env'),'DUMMY_ONLY=yes\n');
    await symlink('.env',path.join(root,'alias.txt'));
    await expect(repo.read({paths:['alias.txt']})).rejects.toMatchObject({code:'path_denied'});
    await expect(repo.search({query:'DUMMY_ONLY',path:'alias.txt'})).rejects.toMatchObject({code:'path_denied'});
    const outside=path.join(path.dirname(root),`${path.basename(root)}-outside.txt`);
    try {
      await writeFile(outside,'OUTSIDE_DUMMY_ONLY\n');
      await symlink(outside,path.join(root,'escape.txt'));
      await expect(repo.search({query:'OUTSIDE_DUMMY_ONLY',path:'escape.txt'})).rejects.toMatchObject({code:'invalid_path'});
    } finally { await rm(outside,{force:true}); }
  });

  it('returns complete lines and a usable continuation for live and committed reads', async () => {
    const content=Array.from({length:50},(_,i)=>`line ${i} `+'é'.repeat(30)).join('\n')+'\n';
    await writeFile(path.join(root,'lines.txt'),content);
    await git(root,'add','lines.txt'); await git(root,'commit','-qm','lines');
    for(const commit of [undefined,'HEAD']) {
      let start=1; const chunks:string[]=[];
      do {
        const result=await repo.read({paths:['lines.txt'],start_line:start,max_bytes:1024,commit});
        const item=(result.files as any[])[0];
        chunks.push(item.text);
        expect(item.end_line).toBe(start+item.text.split('\n').length-1);
        expect(item.text).not.toContain('�');
        start=item.next_line;
      } while(start !== null);
      expect(chunks.join('\n')).toBe(content.trimEnd().split('\n').map((line,i)=>`${i+1}: ${line}`).join('\n'));
    }
  });

  it('reports unsupported ripgrep regex instead of a complete empty search', async () => {
    const runner=new TestRunner();
    const available=await runner.runFile('/usr/bin/which',['rg']);
    if(available.exitCode!==0) return;
    await expect(repo.search({query:'(?=one)',regex:true})).rejects.toMatchObject({code:'search_failed'});
  });

  it('keeps independent search cursors alive without rescanning or mixing queries', async () => {
    let calls=0;
    const actual=new TestRunner();
    repo=new Repository(root,{runFile:async (...args)=>{calls++;return actual.runFile(...args);}});
    const first=await repo.search({query:'e',limit:1});
    expect(first.next_cursor).toBeTypeOf('string');
    await repo.search({query:'one',limit:1});
    const callsAfterBothQueries=calls;
    await writeFile(path.join(root,'alpha.txt'),'different content\n');
    const second=await repo.search({query:'e',limit:1,cursor:first.next_cursor as string});
    expect(calls).toBe(callsAfterBothQueries);
    expect(second.observed_at).toBe(first.observed_at);
    await expect(repo.search({query:'other',cursor:first.next_cursor as string})).rejects.toMatchObject({code:'invalid_cursor'});
  });

  it('expires search cursors after ten minutes and evicts the oldest retained snapshot', async () => {
    let now=1_000_000;
    vi.spyOn(Date,'now').mockImplementation(()=>now);

    const cursors:string[]=[];
    for(let index=0;index<9;index++) {
      const result=await repo.search({query:index === 0 ? 'e' : '.',regex:index !== 0,case_sensitive:index % 2 === 0,limit:1});
      expect(result.next_cursor).toBeTypeOf('string');
      cursors.push(result.next_cursor as string);
    }
    await expect(repo.search({query:'e',limit:1,cursor:cursors[0]}))
      .rejects.toMatchObject({code:'invalid_cursor',message:expect.stringContaining('evicted')});
    await expect(repo.search({query:'.',regex:true,case_sensitive:true,limit:1,cursor:cursors[8]})).resolves.toBeTruthy();

    repo.clearSearchSnapshots();
    await expect(repo.search({query:'.',regex:true,case_sensitive:true,limit:1,cursor:cursors[8]}))
      .rejects.toMatchObject({code:'invalid_cursor',message:expect.stringContaining('evicted')});
    const expiring=await repo.search({query:'e',limit:1});
    now += 10 * 60 * 1000;
    await expect(repo.search({query:'e',limit:1,cursor:expiring.next_cursor as string}))
      .rejects.toMatchObject({code:'invalid_cursor',message:expect.stringContaining('expired')});
  });

  it('evicts search snapshots at the shared byte budget before the count limit', async () => {
    vi.spyOn(Date,'now').mockReturnValue(1_000_000);
    const snippet='x'.repeat(1_900);
    const searchOutput=Array.from({length:1_800},(_,index)=>JSON.stringify({
      type:'match',
      data:{path:{text:'alpha.txt'},line_number:index+1,lines:{text:`${snippet}\n`}}
    })).join('\n');
    const runner:RepositoryRunner={runFile:async(file)=>{
      if(file==='git')return {stdout:'alpha.txt\0',stderr:'',exitCode:0,truncated:false};
      if(file==='/usr/bin/which')return {stdout:'/mock/rg',stderr:'',exitCode:0,truncated:false};
      return {stdout:searchOutput,stderr:'',exitCode:0,truncated:false};
    }};
    repo=new Repository(root,runner);

    const cursors:string[]=[];
    for(let index=0;index<5;index++) {
      const result=await repo.search({query:`query-${index}`,limit:1});
      cursors.push(result.next_cursor as string);
    }

    await expect(repo.search({query:'query-0',limit:1,cursor:cursors[0]}))
      .rejects.toMatchObject({code:'invalid_cursor',message:expect.stringContaining('evicted')});
    await expect(repo.search({query:'query-4',limit:1,cursor:cursors[4]})).resolves.toBeTruthy();
  });

  it('marks skipped batches incomplete when the match ceiling is reached', async () => {
    const names=Array.from({length:201},(_,i)=>`many-${i}.txt`);
    await Promise.all(names.map(name=>writeFile(path.join(root,name),'x\n')));
    const runner:RepositoryRunner={runFile:async(file,args)=>{
      if(file==='git')return {stdout:names.join('\0')+'\0',stderr:'',exitCode:0,truncated:false};
      if(file==='/usr/bin/which')return {stdout:'/mock/rg',stderr:'',exitCode:0,truncated:false};
      return {stdout:Array.from({length:10001},(_,i)=>JSON.stringify({type:'match',data:{path:{text:names[0]},line_number:i+1,lines:{text:'x\n'}}})).join('\n'),stderr:'',exitCode:0,truncated:false};
    }};
    const result=await new Repository(root,runner).search({query:'x'});
    expect(result.incomplete).toBe(true);
    expect(result.truncated).toBe(true);
  });

  it('bounds reads and returns native image bytes', async () => {
    await writeFile(path.join(root, 'large.txt'), 'x'.repeat(20_000));
    const result = await repo.read({ paths: ['large.txt'], max_bytes: 1024 });
    expect(result.truncated).toBe(true);
    await sharp({ create: { width: 10, height: 10, channels: 4, background: '#ff0000' } }).png().toFile(path.join(root, 'pixel.png'));
    const image = await repo.image({ path: 'pixel.png' });
    expect(image).toMatchObject({ mimeType: 'image/png', detail: 'high' });
    expect(Buffer.from(image.data, 'base64').subarray(0, 4)).toEqual(Buffer.from([137, 80, 78, 71]));
    await expect(repo.image({ path: path.join(root, 'pixel.png'), detail: 'original' })).resolves.toMatchObject({
      mimeType: 'image/png', detail: 'original'
    });
    await expect(repo.image({ path: '/etc/hosts' })).rejects.toMatchObject({ code: 'invalid_path' });
  });
});
