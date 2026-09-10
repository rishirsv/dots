/** OpenAI tunnel lifecycle, adapted from Chat On Steroids (MIT; NOTICE.md). */
import { spawn, type ChildProcess } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { readClientStatus, readPollHealth, POLL_FRESH_MS } from './tunnel-health.js';
import { ToolError } from './errors.js';
import { privateDirectory, type Config } from './settings.js';

export type TunnelStatus = { state: 'connecting' | 'ready' | 'offline' | 'stopped'; last_poll_at: number | null; detail: string };
export interface TunnelHandle { status(): TunnelStatus; close(): Promise<void>; }
export async function startTunnel(options: {
  config: Config; key: string; localUrl: string; probeHeaders: Record<string,string>; home: string;
  onStatus?: (status: TunnelStatus) => void; startupTimeoutMs?: number; signal?: AbortSignal;
}): Promise<TunnelHandle> {
  const aborted = () => new ToolError('ABORTED', 'Tunnel startup was cancelled.');
  if (options.signal?.aborted) throw aborted();
  const tempRoot = path.join(options.home, 'tmp');
  await privateDirectory(tempRoot);
  if (options.signal?.aborted) throw aborted();
  const dir = await fs.mkdtemp(path.join(tempRoot, 'tunnel-'));
  const healthFile = path.join(dir, 'health.url');
  let child: ChildProcess | undefined;
  let closed = false;
  let status: TunnelStatus = {state:'connecting', last_poll_at:null, detail:'Starting tunnel client'};
  let timer: NodeJS.Timeout | undefined;
  let healthBase: string | undefined;
  let launching = false;
  const launches = new Set<Promise<void>>();
  let closePromise: Promise<void> | undefined;
  let retry = 0;
  const set = (next: TunnelStatus) => { status = next; options.onStatus?.({...next}); };
  const schedule = (delay: number, action: () => Promise<void>) => {
    if (closed) return;
    timer = setTimeout(() => { void action().catch(() => {
      if (!closed) {set({state:'offline',last_poll_at:status.last_poll_at,detail:'Tunnel unavailable'}); schedule(5000, inspect);}
    }); }, delay);
    timer.unref();
  };
  const inspect = async (): Promise<void> => {
    if (closed) return;
    const current = child;
    if (!current) {await launch(); return;}
    if (!healthBase) {
      try {
        const value = (await fs.readFile(healthFile,'utf8')).trim();
        const parsed = new URL(value);
        if (parsed.protocol === 'http:' && parsed.hostname === '127.0.0.1' && parsed.port) healthBase = parsed.origin;
      } catch { /* health file is not published yet */ }
    }
    if (healthBase) {
      try {
        const [ready, health, remote] = await Promise.all([
          fetch(`${healthBase}/readyz`, {signal:AbortSignal.timeout(3000)}), readPollHealth(healthBase), readClientStatus(healthBase),
        ]);
        if (closed || child !== current) return;
        const recent = health?.lastSuccessMs !== null && health?.lastSuccessMs !== undefined && Date.now()-health.lastSuccessMs < POLL_FRESH_MS;
        if (ready.ok && recent && remote?.probe === 'ok' && !remote.metadataError) {
          retry=0; set({state:'ready',last_poll_at:health!.lastSuccessMs,detail:'Tunnel is polling OpenAI'});
        } else {
          set({state:status.state === 'connecting' ? 'connecting':'offline',last_poll_at:health?.lastSuccessMs ?? null,detail:'Waiting for a successful OpenAI tunnel poll'});
        }
      } catch {
        if (!closed && child === current) set({state:'offline',last_poll_at:status.last_poll_at,detail:'Tunnel health unavailable'});
      }
    }
    schedule(status.state === 'ready' ? 15_000 : 1000, inspect);
  };
  const launch = (): Promise<void> => {
    if (closed || child || launching) return Promise.resolve();
    // Reserve before the first await so close() can see and drain every launch,
    // including a reconnect currently removing the previous health file.
    launching = true;
    const operation = (async () => {
      await fs.rm(healthFile,{force:true});
      if (closed || child) return;
      healthBase=undefined;
      const env={...process.env};
      for(const key of Object.keys(env)) if (/^(OPENAI_API_KEY|CONTROL_PLANE_API_KEY|MCP_SERVER_URL|MCP_DISCOVERY_EXTRA_HEADERS|ORACLE_REPO_MCP_.*KEY)$/i.test(key)) delete env[key];
      env.CONTROL_PLANE_API_KEY=options.key;
      env.MCP_SERVER_URL=`url=${options.localUrl},channel=main`;
      env.MCP_DISCOVERY_EXTRA_HEADERS=Object.entries(options.probeHeaders).map(([k,v])=>`${k}: ${v}`).join(', ');
      const proc=spawn(options.config.tunnelBinary,[
        'run','--control-plane.tunnel-id',options.config.tunnelId,
        '--health.listen-addr','127.0.0.1:0','--health.url-file',healthFile,
        '--log.format','json','--log.level','warn',
      ],{env,detached:true,stdio:['ignore','pipe','pipe']});
      child=proc;
      // Raw tunnel logs may include endpoint/credential diagnostics; never forward them.
      proc.stdout?.resume(); proc.stderr?.resume();
      proc.on('error',()=> {if(!closed) set({state:'offline',last_poll_at:null,detail:'Tunnel executable could not start'});});
      proc.once('close',()=>{
        if(child !== proc) return;
        child=undefined;
        if(closed) return;
        if(timer) clearTimeout(timer);
        set({state:'offline',last_poll_at:status.last_poll_at,detail:'Tunnel stopped; reconnecting'});
        schedule(Math.min(30_000,1000*2**retry++),launch);
      });
      schedule(200,inspect);
    })();
    launches.add(operation);
    void operation.finally(() => {
      launches.delete(operation);
      launching=false;
    }).catch(() => {});
    return operation;
  };
  let removeAbortListener = () => {};
  const close = (): Promise<void> => {
    if(closePromise) return closePromise;
    closed=true;
    if(timer) clearTimeout(timer);
    removeAbortListener();
    closePromise=(async () => {
      await Promise.allSettled([...launches]);
      const proc=child;
      if(proc && proc.exitCode===null && proc.signalCode===null && proc.pid) {
        const done=new Promise<void>(resolve=>proc.once('close',()=>resolve()));
        try {process.kill(-proc.pid,'SIGTERM');} catch {proc.kill('SIGTERM');}
        const killTimer=setTimeout(()=>{try {process.kill(-proc.pid!,'SIGKILL');} catch {proc.kill('SIGKILL');}},2000);
        await done; clearTimeout(killTimer);
      }
      await fs.rm(dir,{recursive:true,force:true});
      set({state:'stopped',last_poll_at:status.last_poll_at,detail:'Tunnel stopped'});
    })();
    return closePromise;
  };
  try {
    await launch();
    if(options.signal?.aborted) throw aborted();
    const deadline=Date.now()+(options.startupTimeoutMs ?? 60_000);
    const startupAbort = new Promise<void>((resolve) => {
      if (!options.signal) return;
      const listener = () => resolve();
      options.signal.addEventListener('abort', listener, {once:true});
      removeAbortListener = () => options.signal?.removeEventListener('abort', listener);
    });
    while(status.state !== 'ready' && Date.now()<deadline) {
      await Promise.race([new Promise(resolve=>setTimeout(resolve,100)), startupAbort]);
      if(options.signal?.aborted) throw aborted();
    }
    if(status.state !== 'ready') throw new ToolError('TUNNEL_NOT_READY','The tunnel did not establish an OpenAI poll. Check the tunnel ID, runtime-key Read/Use permissions, and workspace association.');
    removeAbortListener();
    return {status:()=>({...status}),close};
  } catch(error) {await close(); throw error;}
}
