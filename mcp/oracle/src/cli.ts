#!/usr/bin/env node
import path from 'node:path';
import { writeSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { canonicalRepository, controlRequest, runInstance, waitForExistingReady, type InstanceState, taskIdentity, conversationUrl, type ControlAction } from './instance.js';
import { APP_HOME, configure, privateDirectory, readConfig, keychain } from './settings.js';
import { ToolError } from './errors.js';

const args=process.argv.slice(2);
const command=args.shift() ?? 'help';
const flag=(name:string)=>args.includes(name);
const option=(name:string)=>{const index=args.indexOf(name);return index<0?undefined:args[index+1];};
let emitted = false;
const emit=(value:unknown)=>{
  const receipt = value && typeof value === 'object' && 'phase' in value ? {lifecycle_command:path.join(APP_HOME,'bin','oracle-repo'),...value} : value;
  writeSync(1, `${JSON.stringify(receipt)}\n`); emitted = true;
};
const progress=(stage:string)=>writeSync(2, `${JSON.stringify({event:'startup',stage,at:Date.now()})}\n`);
async function hiddenKey():Promise<string> {
  if(!process.stdin.isTTY) {
    let value='';for await(const chunk of process.stdin){value+=String(chunk);if(value.length>4096)throw new ToolError('INVALID_KEY','Credential is too large.');}return value.trim();
  }
  process.stderr.write('Tunnel runtime key (hidden): ');
  process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
  return new Promise((resolve,reject)=>{
    let value='';
    const finish=()=>{process.stdin.setRawMode(false);process.stdin.pause();process.stdin.removeListener('data',read);process.stderr.write('\n');};
    const read=(chunk:string)=>{
      for(const char of chunk){
        if(char==='\u0003'){finish();reject(new ToolError('CANCELLED','Configuration cancelled.'));return;}
        if(char==='\r'||char==='\n'){finish();resolve(value);return;}
        if(char==='\u007f'){value=value.slice(0,-1);continue;}
        if(char>=' '&&value.length<4096)value+=char;
      }
    };
    process.stdin.on('data',read);
  });
}
async function main() {
  if (command==='help'||command==='--help') {
    console.log([
      'oracle-repo-mcp start --repo PATH --task-id TASK [--local-only]',
      'oracle-repo-mcp serve --repo PATH --task-id TASK [--local-only]',
      'oracle-repo status [--task-id TASK]',
      'oracle-repo begin --instance-id ID --access-epoch E --browser-id B --tab-id T [--conversation-url URL]',
      'oracle-repo observe --instance-id ID --access-epoch E --turn-id TURN --browser-id B --tab-id T --response-state STATE --observed-at UNIX_MS [--conversation-url URL]',
      'oracle-repo wait --instance-id ID --after CURSOR [--timeout-ms 55000]',
      'oracle-repo receipts --instance-id ID [--offset 0] [--limit 50]',
      'oracle-repo-mcp pause --instance-id ID --task-id TASK --access-epoch E',
      'oracle-repo-mcp resume --instance-id ID --task-id TASK --access-epoch E',
      'oracle-repo-mcp remember --instance-id ID --task-id TASK --conversation-url URL',
      'oracle-repo-mcp stop --instance-id ID --task-id TASK',
      'oracle-repo-mcp configure --tunnel-id ID [--tunnel-binary PATH]',
      'oracle-repo-mcp doctor',
      'Task ID defaults to CODEX_THREAD_ID. start reuses the owning task instance without resuming paused access.'
    ].join('\n')); return;
  }
  if (process.platform!=='darwin') throw new ToolError('UNSUPPORTED_PLATFORM','This personal adapter supports macOS only.');
  if (command==='status') { emit(await controlRequest('status',{taskId:option('--task-id')})??{phase:'stopped'}); return; }
  if (['stop','pause','resume','remember','begin','observe','wait','receipts'].includes(command)) {
    const id=option('--instance-id');
    if(!id) throw new ToolError('INSTANCE_REQUIRED',"Use the exact instance ID from this task's receipt.");
    const taskId=taskIdentity(option('--task-id')??process.env.CODEX_THREAD_ID);
    const epoch=option('--access-epoch')===undefined?undefined:Number(option('--access-epoch'));
    if ((['pause','resume','begin','observe'].includes(command)) && (!Number.isSafeInteger(epoch)||epoch!<1)) throw new ToolError('EPOCH_REQUIRED','Use --access-epoch from the current handoff receipt.');
    const url=command==='remember'?conversationUrl(option('--conversation-url')??''):undefined;
    const body = command === 'begin' || command === 'observe' ? {
      browser_id: option('--browser-id'), tab_id: option('--tab-id'), conversation_url: option('--conversation-url'),
      ...(command === 'observe' ? { turn_id: option('--turn-id'), response_state: option('--response-state'), observed_at: Number(option('--observed-at')) } : {})
    } : undefined;
    const began=performance.now();
    const result=await controlRequest(command as ControlAction,{expectedInstance:id,taskId,accessEpoch:epoch,conversationUrl:url,body,after:option('--after') === undefined ? undefined : Number(option('--after')),timeoutMs:command==='wait'?Number(option('--timeout-ms')??55000):undefined,offset:option('--offset')===undefined?undefined:Number(option('--offset')),limit:option('--limit')===undefined?undefined:Number(option('--limit'))});
    if (!result) { emit({instance_id:id,phase:'stopped'}); return; }
    if (result.phase==='unclean') { emit(result); return; }
    if (['resume','remember','begin','observe','wait','receipts'].includes(command)) { emit({...result,control_wait_ms:Math.round(performance.now()-began)}); return; }
    const deadline=Date.now()+(command==='stop'?15000:5000);
    while(Date.now()<deadline) {
      const state=await controlRequest('status',{taskId});
      if (!state) { emit({instance_id:id,phase:'stopped'}); return; }
      if(state.instance_id!==id) throw new ToolError('STALE_INSTANCE','The instance changed during the control operation; inspect state before continuing.');
      if(state.phase==='unclean') { emit(state); return; }
      if(command==='pause' && state.control==='codex') { emit({...state,control_wait_ms:Math.round(performance.now()-began)}); return; }
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    const state=await controlRequest('status',{taskId});
    emit({...state,detail:command==='pause'?'Pause is still draining; do not edit until control is codex. Inspect blockers or explicitly cancel the commands.':'Shutdown is still draining; the singleton remains held.'}); return;
  }
  if(command==='configure') {
    const id=option('--tunnel-id'); if(!id) throw new ToolError('TUNNEL_REQUIRED','Provide --tunnel-id from OpenAI Platform.');
    await configure({tunnelId:id,tunnelBinary:option('--tunnel-binary')??path.join(APP_HOME,'bin','tunnel-client'),keychainAccount:'tunnel-runtime'},await hiddenKey());
    emit({configured:true,credential_storage:'macOS Keychain'}); return;
  }
  if(command==='doctor') {
    const config=await readConfig(); await fs.access(config.tunnelBinary,fs.constants.X_OK); await keychain('get',config.keychainAccount);
    emit({configuration:'ready',tunnel_id:config.tunnelId,instance:await controlRequest('status')??{phase:'stopped'}}); return;
  }
  if(command!=='start'&&command!=='serve') throw new ToolError('INVALID_COMMAND','Run --help for supported commands.');
  const root=await canonicalRepository(option('--repo')??process.cwd());
  const taskId=taskIdentity(option('--task-id')??process.env.CODEX_THREAD_ID);
  const localOnly=flag('--local-only');
  if(command==='start') {
    progress('starting');
    const began=performance.now();
    let existing=await controlRequest('status');
    const unclean=existing?.phase==='unclean'?existing:undefined;
    if(unclean) existing=null;
    if(existing) {
      const current=await waitForExistingReady(existing,root,localOnly,()=>controlRequest('status'),taskId);
      progress('ready');
      emit({...current,ownership:'resumed',ready_wait_ms:Math.round(performance.now()-began)}); return;
    }
    await privateDirectory(APP_HOME);
    const log=await fs.open(path.join(APP_HOME,'server.log'),'a',0o600);
    const child=spawn(process.execPath,[fileURLToPath(import.meta.url),'serve','--repo',root,'--task-id',taskId,...(localOnly?['--local-only']:[])],{detached:true,stdio:['ignore',log.fd,log.fd,'ipc']});
    let owned: InstanceState|undefined;
    let lastStage = 'starting';
    let resolveOwner!:()=>void;
    const ownerMessage=new Promise<void>(resolve=>{resolveOwner=resolve;});
    child.on('message',(value:InstanceState)=>{if(value.pid===child.pid&&value.root===root&&value.task_id===taskId){owned=value;if(value.startup_stage && value.startup_stage!==lastStage){lastStage=value.startup_stage;progress(lastStage);}resolveOwner();}});
    child.once('exit',()=>resolveOwner());
    const spawned=new Promise<void>((resolve,reject)=>{child.once('spawn',resolve);child.once('error',reject);});
    try { await spawned; } finally { await log.close(); }
    child.unref();
    const deadline=Date.now()+75000;
    let pinned: string|undefined;
    try {
      while(Date.now()<deadline) {
        const current=await controlRequest('status');
        if(current?.phase==='unclean') { await new Promise(resolve=>setTimeout(resolve,200)); continue; }
        if(current) {
          pinned??=String(current.instance_id);
          if(current.instance_id!==pinned||(owned&&current.instance_id!==owned.instance_id)) throw new ToolError('STALE_INSTANCE','The instance changed during startup; do not adopt it.');
          if(current.root!==root||current.local_only!==localOnly) throw new ToolError('BUSY','A concurrent start owns another repository or connection mode.');
          if(current.task_id!==taskId) throw new ToolError('TASK_BUSY','A concurrent start belongs to another task.');
          if(current.phase==='ready') {
            if(current.pid===child.pid) await ownerMessage;
            emit({...current,ownership:owned?.instance_id===current.instance_id?'started':'resumed',ready_wait_ms:Math.round(performance.now()-began),...(unclean?{unclean_previous_exit:unclean}:{})}); return;
          }
        }
        if((child.exitCode!==null||child.signalCode!==null)&&!current&&Date.now()>deadline-73000) throw new ToolError('START_FAILED','Server exited before readiness. Inspect the private server.log.');
        await new Promise(resolve=>setTimeout(resolve,200));
      }
      throw new ToolError('START_TIMEOUT','Readiness timed out. Inspect status; do not assume cleanup.');
    } catch(error) {
      if(owned) emit({...owned,ownership:'started',detail:'Startup did not complete. Retain this receipt for exact-task, exact-instance cleanup.'});
      throw error;
    } finally { if(child.connected) child.disconnect(); }
  }
  const shutdown=new AbortController();
  const stop=()=>shutdown.abort();
  process.once('SIGINT',stop); process.once('SIGTERM',stop);
  const publish=(state:InstanceState)=>{if(process.connected)process.send?.(state);};
  const instance=await runInstance({root,taskId,localOnly,signal:shutdown.signal,onStarted:publish,onReady:publish});
  emit({...instance.status(),...(instance.localUrl?{local_url:instance.localUrl}:{})});
  await instance.done;
}

main().catch(error=>{
  const data=error instanceof ToolError?{code:error.code,message:error.message}:{code:'FAILED',message:'Operation failed. Check the repository path, configuration, and local installation.'};
  if (!emitted) emit({ok:false,error:data});
  writeSync(2, `${JSON.stringify(data)}\n`);process.exitCode=1;
});
