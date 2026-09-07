#!/usr/bin/env node
import {promisify} from 'node:util';
import {execFile} from 'node:child_process';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const run=promisify(execFile);
const packageRoot=fileURLToPath(new URL('../',import.meta.url));
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'oracle-cli-'));
const env={...process.env,ORACLE_REPO_MCP_HOME:path.join(temp,'home'),CODEX_THREAD_ID:'cli-fixture-task'};
const cli=async(...args)=>JSON.parse((await run(process.execPath,[path.join(packageRoot,'dist','cli.js'),...args],{env,timeout:85000})).stdout);
let instance;
try{
  const repo=path.join(temp,'repo'),other=path.join(temp,'other');
  await run('git',['init','-q',repo]);await run('git',['init','-q',other]);
  const starts=await Promise.all([cli('start','--repo',repo,'--local-only'),cli('start','--repo',repo,'--local-only')]);
  instance=starts.find(result=>result.ownership==='started');
  assert.ok(instance);assert.equal(starts.filter(result=>result.ownership==='resumed').length,1);
  assert.equal(starts[0].instance_id,starts[1].instance_id);assert.equal(starts[0].phase,'ready');
  assert.equal((await cli('start','--repo',repo,'--local-only')).ownership,'resumed');
  await assert.rejects(cli('start','--repo',other,'--local-only'),error=>error.stderr.includes('BUSY'));
  await assert.rejects(cli('start','--repo',repo,'--local-only','--task-id','another-task'),error=>error.stderr.includes('TASK_BUSY'));
  const paused=await cli('pause','--instance-id',instance.instance_id,'--access-epoch','1');
  assert.equal(paused.control,'codex');
  assert.equal((await cli('start','--repo',repo,'--local-only')).control,'codex');
  const resumed=await cli('resume','--instance-id',instance.instance_id,'--access-epoch','1');
  assert.equal(resumed.instance_id,instance.instance_id);assert.equal(resumed.access_epoch,2);assert.equal(resumed.control,'oracle');
  await assert.rejects(cli('pause','--instance-id',instance.instance_id,'--access-epoch','1'),error=>error.stderr.includes('STALE_ACCESS'));
  await cli('remember','--instance-id',instance.instance_id,'--conversation-url','https://chatgpt.com/c/test-conversation');
  assert.equal((await cli('status')).conversation_url,'https://chatgpt.com/c/test-conversation');
  const owned=['--instance-id',instance.instance_id];
  const begin=await cli('begin',...owned,'--access-epoch','2','--browser-id','iab','--tab-id','fixture','--conversation-url','https://chatgpt.com/c/WEB:fixture');
  const observing=['observe',...owned,'--access-epoch','2','--browser-id','iab','--tab-id','fixture','--turn-id',begin.consultation.turn_id];
  const waiting=cli('wait',...owned,'--after',String(begin.cursor),'--timeout-ms','5000');
  const canonical='https://chatgpt.com/c/00000000-0000-4000-8000-000000000001';
  const observed=await cli(...observing,'--response-state','finished','--observed-at',String(Date.now()),'--conversation-url',canonical);
  assert.equal(observed.conversation_url,canonical);assert.equal(observed.consultation.response_state,'finished');
  const wake=await waiting;assert.ok(wake.events.some(event=>event.type==='consultation_observed'));
  assert.equal((await cli('receipts',...owned)).receipt_details.total,0);
  await cli('pause',...owned,'--access-epoch','2');
  const nextEpoch=await cli('resume',...owned,'--access-epoch','2');
  assert.equal(nextEpoch.access_epoch,3);
  assert.equal(nextEpoch.consultation.response_state,'unknown');
  assert.equal(nextEpoch.consultation.last_observed_state,'finished');
  await assert.rejects(cli('wait',...owned,'--task-id','other','--timeout-ms','0'),error=>JSON.parse(error.stdout).error.code==='TASK_BUSY');
  await assert.rejects(cli(...observing,'--response-state','finished','--observed-at','1'),error=>JSON.parse(error.stdout).error.code==='STALE_ACCESS');
  await assert.rejects(cli('stop','--instance-id',instance.instance_id,'--task-id','another-task'),error=>error.stderr.includes('TASK_BUSY'));

  await assert.rejects(cli('stop','--instance-id','run_'+'0'.repeat(32)),error=>error.stderr.includes('STALE_INSTANCE'));
  assert.equal((await cli('status')).instance_id,instance.instance_id);
  assert.equal((await cli('stop','--instance-id',instance.instance_id)).phase,'stopped');
  instance=undefined;
  const stoppedStatus=await cli('status');
  assert.equal(stoppedStatus.phase,'stopped');
  assert.equal(stoppedStatus.lifecycle_command,path.join(env.ORACLE_REPO_MCP_HOME,'bin','oracle-repo'));
  // No tunnel configuration in the temporary home: startup must still retain
  // its own cleanup receipt on stdout rather than abandon ownership on failure.
  await assert.rejects(cli('start','--repo',repo),error=>{
    const receipt=JSON.parse(error.stdout);
    assert.equal(receipt.ownership,'started');
    assert.ok(receipt.instance_id);
    return true;
  });
  assert.equal((await cli('status')).phase,'stopped');
  const crashed=await cli('start','--repo',repo,'--local-only');
  // Kill only this test's freshly owned server, with no commands launched.
  process.kill(crashed.pid,'SIGKILL');
  let crashStatus;
  for(let attempt=0;attempt<40;attempt++){
    await new Promise(resolve=>setTimeout(resolve,50));
    crashStatus=await cli('status');
    if(crashStatus.phase==='unclean')break;
  }
  assert.equal(crashStatus.phase,'unclean');
  instance=await cli('start','--repo',repo,'--local-only');
  assert.equal(instance.unclean_previous_exit.instance_id,crashed.instance_id);
  assert.equal((await cli('stop','--instance-id',instance.instance_id)).phase,'stopped');
  instance=undefined;
  console.log('CLI verification passed: concurrent start, readiness, task ownership, warm pause/resume, epoch fencing, conversation recovery, BUSY, stale stop, cleanup, hard-exit detection/restart.');
}finally{
  if(instance)await cli('stop','--instance-id',instance.instance_id).catch(()=>{});
  await fs.rm(temp,{recursive:true,force:true});
}
