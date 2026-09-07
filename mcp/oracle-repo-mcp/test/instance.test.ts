import http from 'node:http';
import { test, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { ReceiptLedger, runInstance, controlRequest, waitForExistingReady } from '../src/instance.js';
import { jsonReply } from '../src/mcp.js';

test('receipt joins in-flight retries, preserves results, refuses conflicting IDs and overflow',async()=>{
  const ledger=new ReceiptLedger(1);let executions=0;
  const effect=async()=>{executions++;await new Promise(r=>setTimeout(r,10));return jsonReply({executions});};
  const first=ledger.run('exec','same',{a:1,b:2},effect);
  const retry=ledger.run('exec','same',{b:2,a:1},effect);
  expect(retry).toBe(first);await first;
  expect((await ledger.run('exec','same',{a:1,b:2},effect)).structuredContent).toEqual({executions:1});
  expect(()=>ledger.run('exec','same',{a:3},effect)).toThrowError(expect.objectContaining({code:'REQUEST_ID_CONFLICT'}));
  expect(()=>ledger.run('exec','new',{},effect)).toThrowError(expect.objectContaining({code:'RECEIPT_LIMIT'}));
  expect(executions).toBe(1);
});

test('complete live-checkout MCP read, patch, retry, stale scope, shell, and cleanup',async()=>{
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'oracle-instance-'));
  const root=path.join(temp,'repo');await fs.mkdir(root);
  execFileSync('git',['init','-q',root]);
  await fs.writeFile(path.join(root,'hello.txt'),'old\n');
  const instance=await runInstance({root,taskId:'test-task',home:path.join(temp,'home'),localOnly:true,port:47694});
  const client=new Client({name:'oracle-integration',version:'1'});
  try{
    await client.connect(new StreamableHTTPClientTransport(new URL(instance.localUrl!)));
    const names=(await client.listTools()).tools.map(t=>t.name);
    expect(names).toEqual(expect.arrayContaining(['exec_command','write_stdin','apply_patch','view_image','repo_read']));
    const scope={instance_id:instance.status().instance_id,access_epoch:instance.status().access_epoch};
    const discovered=await client.callTool({name:'repo_status',arguments:scope});
    expect(discovered.isError).not.toBe(true);
    expect((discovered.structuredContent as Record<string,any>).repository.head).toBeNull();
    const read=await client.callTool({name:'repo_read',arguments:{...scope,paths:['hello.txt']}});
    expect(JSON.stringify(read)).toContain('old');
    const search=await client.callTool({name:'repo_search',arguments:{...scope,query:'old'}});
    expect(search.isError).not.toBe(true);expect(JSON.stringify(search)).toContain('hello.txt');
    execFileSync('git',['-C',root,'add','hello.txt']);
    execFileSync('git',['-C',root,'-c','user.name=Fixture','-c','user.email=fixture@example.test','commit','-qm','fixture']);
    const committed=await client.callTool({name:'repo_read',arguments:{...scope,paths:['hello.txt'],commit:'HEAD'}});
    expect(committed.isError).not.toBe(true);expect(JSON.stringify(committed)).toContain('old');
    const stale=await client.callTool({name:'exec_command',arguments:{access_epoch:scope.access_epoch,instance_id:'run_'+'0'.repeat(32),request_id:'stale',cmd:'touch should-not-exist'}});
    expect(stale.isError).toBe(true);expect(JSON.stringify(stale)).toContain('STALE_INSTANCE');
    const {createHash}=await import('node:crypto');
    const hash=createHash('sha256').update('old\n').digest('hex');
    const patch={...scope,request_id:'edit-1',patch:'*** Begin Patch\n*** Update File: hello.txt\n@@\n-old\n+new\n*** End Patch',expected:{'hello.txt':{kind:'file',sha256:hash}}};
    const changed=await client.callTool({name:'apply_patch',arguments:patch});
    expect(changed.isError).not.toBe(true);expect(await fs.readFile(path.join(root,'hello.txt'),'utf8')).toBe('new\n');
    expect(await client.callTool({name:'apply_patch',arguments:patch})).toEqual(changed);
    const conflict=await client.callTool({name:'apply_patch',arguments:{...patch,request_id:'edit-2'}});
    expect(conflict.isError).toBe(true);
    const shell={...scope,request_id:'shell-1',cmd:'printf one >> counter.txt; cat hello.txt',login:false};
    const executed=await client.callTool({name:'exec_command',arguments:shell});
    expect(JSON.stringify(executed)).toContain('new');
    expect(await client.callTool({name:'exec_command',arguments:shell})).toEqual(executed);
    expect(await fs.readFile(path.join(root,'counter.txt'),'utf8')).toBe('one');
    const receiptPage=await client.callTool({name:'repo_receipts',arguments:{...scope,limit:1}});
    expect(receiptPage.structuredContent).toMatchObject({entries:[{tool:'apply_patch',request_id:'edit-1',state:'retained'}],next_offset:1});
    expect(JSON.stringify(receiptPage)).not.toContain('printf one');
    const pending=await client.callTool({name:'exec_command',arguments:{...scope,request_id:'long',cmd:'sleep 30',yield_time_ms:250,login:false}});
    expect((pending.structuredContent as Record<string,unknown>).session_id).toBeTypeOf('number');
    await expect(runInstance({root,taskId:'test-task',home:path.join(temp,'other'),localOnly:true,port:47694})).rejects.toThrow(/singleton/);
  }finally{await instance.close();await client.close();await fs.rm(temp,{recursive:true,force:true});}
  expect(instance.status().phase).toBe('stopped');for(const command of instance.status().commands as {pid:number;state:string}[]){expect(command.state).not.toBe('running');expect(()=>process.kill(command.pid,0)).toThrow();}
},20000);


test('existing readiness never adopts a replacement instance or connection mode',async()=>{
  const initial={instance_id:'first',root:'/repo',local_only:true,phase:'starting'};
  await expect(waitForExistingReady(initial,'/repo',true,async()=>({...initial,instance_id:'replacement',root:'/other',phase:'ready'}))).rejects.toMatchObject({code:'STALE_INSTANCE'});
  await expect(waitForExistingReady(initial,'/repo',true,async()=>({...initial,local_only:false,phase:'ready'}))).rejects.toMatchObject({code:'BUSY'});
  await expect(waitForExistingReady(initial,'/repo',true,async()=>null)).rejects.toMatchObject({code:'NOT_READY'});
});

test('control rereads metadata across publication and refuses replacement stop ownership',async()=>{
  const home=await fs.mkdtemp(path.join(os.tmpdir(),'oracle-publication-'));
  const file=path.join(home,'instance.json');
  const old={instance_id:'old',root:'/repo',port:47693,token:'old-token',clean_exit:true};
  const current={...old,instance_id:'new',token:'new-token',clean_exit:false};
  await fs.writeFile(file,JSON.stringify(old));
  let attempts=0;
  const server=http.createServer((req,res)=>{
    attempts++;
    if(req.headers.authorization!=='Bearer new-token') {
      void fs.writeFile(file,JSON.stringify(current)).then(()=>res.writeHead(403).end());return;
    }
    res.setHeader('content-type','application/json');res.end(JSON.stringify({instance_id:'new',root:'/repo',phase:'ready'}));
  });
  await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(47693,'127.0.0.1',resolve);});
  try {
    expect(await controlRequest('status',{home})).toMatchObject({instance_id:'new',phase:'ready'});
    expect(attempts).toBe(2);
    await expect(controlRequest('stop',{home,expectedInstance:'old'})).rejects.toMatchObject({code:'STALE_INSTANCE'});
    expect(attempts).toBe(2);
  } finally { await new Promise<void>(resolve=>server.close(()=>resolve()));await fs.rm(home,{recursive:true,force:true}); }
});


test('receipt acknowledgement frees payloads but retired IDs never execute again, even across epochs',async()=>{
  const ledger=new ReceiptLedger(1,4*1024*1024,2);
  let effects=0;
  const effect=async()=>jsonReply({effects:++effects});
  const first=await ledger.run('exec_command','one',{cmd:'effect',access_epoch:1},effect);
  expect(await ledger.run('exec_command','one',{cmd:'effect',access_epoch:2},effect)).toEqual(first);
  expect(ledger.acknowledge([{tool:'exec_command',request_id:'one'}])).toMatchObject({retired:1});
  expect(ledger.acknowledge([{tool:'exec_command',request_id:'one'}])).toMatchObject({retired:0});
  expect(()=>ledger.run('exec_command','one',{cmd:'effect',access_epoch:2},effect)).toThrowError(expect.objectContaining({code:'RECEIPT_RETIRED'}));
  await ledger.run('exec_command','two',{},effect);
  ledger.acknowledge([{tool:'exec_command',request_id:'two'}]);
  expect(()=>ledger.run('exec_command','three',{},effect)).toThrowError(expect.objectContaining({code:'RECEIPT_LIMIT'}));
  expect(effects).toBe(2);
  expect(ledger.status()).toMatchObject({payload_bytes:0,retained:0,retired:2,remaining_ids:0});
});

test('acknowledgement cannot retire an in-flight effect or block reserved cancellation capacity',async()=>{
  const ledger=new ReceiptLedger(1);
  let release!:()=>void;
  const first=ledger.run('exec_command','slow',{},async()=>{await new Promise<void>(resolve=>{release=resolve;});return jsonReply({done:true});});
  await Promise.resolve();
  expect(()=>ledger.acknowledge([{tool:'exec_command',request_id:'slow'}])).toThrowError(expect.objectContaining({code:'RECEIPT_IN_FLIGHT'}));
  await expect(ledger.run('cancel_command','cancel',{},async()=>jsonReply({cancelled:true}),true)).resolves.toMatchObject({structuredContent:{cancelled:true}});
  release();await first;
  expect(ledger.acknowledge([{tool:'exec_command',request_id:'slow'}])).toMatchObject({retired:1});
});

test('warm task handoffs drain work, fence delayed calls, retain results, and invalidate old file snapshots',async()=>{
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'oracle-warm-'));
  const root=path.join(temp,'repo');const home=path.join(temp,'home');await fs.mkdir(root);
  execFileSync('git',['init','-q',root]);
  await fs.writeFile(path.join(root,'marker.txt'),'before\nsecond\n');
  const instance=await runInstance({root,taskId:'owning-task',home,localOnly:true,port:47694});
  const client=new Client({name:'warm-handoff',version:'1'});
  const disk=JSON.parse(await fs.readFile(path.join(home,'instance.json'),'utf8'));
  const control=async(action:string,epoch=1,task='owning-task')=>{
    const response=await fetch(`http://127.0.0.1:47694/${action}/${instance.status().instance_id}`,{method:'POST',headers:{authorization:`Bearer ${disk.token}`,'x-oracle-task-id':task,'x-oracle-access-epoch':String(epoch)}});
    return {status:response.status,value:await response.json() as any};
  };
  let scope={instance_id:instance.status().instance_id,access_epoch:1};
  const call=(name:string,args:Record<string,unknown>={})=>client.callTool({name,arguments:{...scope,...args}});
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(instance.localUrl!)));
    const remembered = await fetch(`http://127.0.0.1:47694/remember/${scope.instance_id}`, {method:'POST', headers:{authorization:`Bearer ${disk.token}`,'x-oracle-task-id':'owning-task','x-oracle-conversation':'https://chatgpt.com/c/private-conversation'}});
    expect(await remembered.json()).toMatchObject({task_id:'owning-task',conversation_url:'https://chatgpt.com/c/private-conversation'});
    const remoteStatus = (await call('repo_status')).structuredContent;
    expect(remoteStatus).not.toHaveProperty('task_id');
    expect(remoteStatus).not.toHaveProperty('conversation_url');
    const action={request_id:'once',cmd:'printf x >> count.txt; cat marker.txt',login:false};
    const saved=await call('exec_command',action);
    expect(saved.isError).not.toBe(true);
    const search=await call('repo_search',{query:'e',limit:1});
    const cursor=(search.structuredContent as any).next_cursor;
    expect(cursor).toBeTypeOf('string');
    const batch=await call('repo_read',{paths:[{path:'marker.txt',start_line:2,end_line:2}]});
    expect((batch.structuredContent as any).files[0].text).toBe('2: second');
    const searches=await call('repo_search',{queries:[{query:'before'},{query:'second'}]});
    expect((searches.structuredContent as any).results.map((entry:any)=>entry.matches.length)).toEqual([1,1]);
    const command=await call('exec_command',{request_id:'background',cmd:'printf started; sleep 1; printf tail; printf finished > finished.txt',login:false,yield_time_ms:250});
    const session=(command.structuredContent as any).session_id;
    expect(session).toBeTypeOf('number');
    expect((await control('pause',1,'another-task')).value.code).toBe('TASK_BUSY');
    const paused=await control('pause');
    expect(paused.value.control).toBe('pausing');
    expect(instance.status().blockers).toMatchObject({quiescent:false});
    expect((await call('exec_command',{request_id:'blocked',cmd:'touch forbidden.txt',login:false})).structuredContent).toMatchObject({code:'ACCESS_PAUSED'});
    expect((await control('resume')).value.code).toBe('NOT_QUIESCENT');
    const deadline=Date.now()+5000;
    while(instance.status().control!=='codex'&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,20));
    expect(instance.status().control).toBe('codex');
    expect(await fs.readFile(path.join(root,'finished.txt'),'utf8')).toBe('finished');
    expect((await call('repo_read',{paths:['marker.txt']})).structuredContent).toMatchObject({code:'ACCESS_PAUSED'});
    expect((await call('repo_status')).structuredContent).not.toHaveProperty('repository');
    await fs.writeFile(path.join(root,'marker.txt'),'after\n');
    const resumed=await control('resume');
    expect(resumed.value).toMatchObject({instance_id:scope.instance_id,access_epoch:2,control:'oracle'});
    expect((await call('exec_command',{request_id:'old-epoch',cmd:'touch forbidden.txt',login:false})).structuredContent).toMatchObject({code:'STALE_ACCESS'});
    scope={...scope,access_epoch:2};
    expect(await call('exec_command',action)).toEqual(saved);
    expect(await fs.readFile(path.join(root,'count.txt'),'utf8')).toBe('x');
    const tail=await call('write_stdin',{request_id:'collect-tail',session_id:session});
    expect((tail.structuredContent as any).output).toBe('tail');
    expect((await call('repo_search',{query:'e',limit:1,cursor})).isError).toBe(true);
    expect((await call('repo_read',{paths:['marker.txt']})).structuredContent).toMatchObject({files:[expect.objectContaining({text:'1: after'})]});
    await call('repo_acknowledge',{requests:[{tool:'exec_command',request_id:'once'}]});
    expect((await call('exec_command',action)).structuredContent).toMatchObject({code:'RECEIPT_RETIRED'});
    await expect(fs.access(path.join(root,'forbidden.txt'))).rejects.toMatchObject({code:'ENOENT'});
  } finally {await instance.close();await client.close();await fs.rm(temp,{recursive:true,force:true});}
},15000);

test('pause admits only drain operations and a long poll cannot delay quiescence after cancellation',async()=>{
  const temp=await fs.mkdtemp(path.join(os.tmpdir(),'oracle-drain-'));
  const root=path.join(temp,'repo');const home=path.join(temp,'home');await fs.mkdir(root);execFileSync('git',['init','-q',root]);
  const instance=await runInstance({root,taskId:'drain-task',home,localOnly:true,port:47694});
  const client=new Client({name:'drain-handoff',version:'1'});
  const disk=JSON.parse(await fs.readFile(path.join(home,'instance.json'),'utf8'));
  const scope={instance_id:instance.status().instance_id,access_epoch:1};
  const call=(name:string,args:Record<string,unknown>)=>client.callTool({name,arguments:{...scope,...args}});
  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(instance.localUrl!)));
    const running=await call('exec_command',{request_id:'long',cmd:'sleep 30',login:false,yield_time_ms:250});
    const session=(running.structuredContent as any).session_id;
    await fetch(`http://127.0.0.1:47694/pause/${scope.instance_id}`,{method:'POST',headers:{authorization:`Bearer ${disk.token}`,'x-oracle-task-id':'drain-task','x-oracle-access-epoch':'1'}});
    expect((await call('write_stdin',{request_id:'forbidden-input',session_id:session,chars:'anything'})).structuredContent).toMatchObject({code:'ACCESS_PAUSED'});
    const poll=call('write_stdin',{request_id:'drain-poll',session_id:session,yield_time_ms:300000});
    await new Promise(resolve=>setTimeout(resolve,30));
    const began=performance.now();
    const cancelled=await call('cancel_command',{request_id:'cancel',session_id:session});
    expect(cancelled.isError).not.toBe(true);await poll;
    while(instance.status().control!=='codex'&&performance.now()-began<2000)await new Promise(resolve=>setTimeout(resolve,10));
    expect(instance.status().control).toBe('codex');expect(performance.now()-began).toBeLessThan(2000);
  } finally {await instance.close();await client.close();await fs.rm(temp,{recursive:true,force:true});}
},10000);
