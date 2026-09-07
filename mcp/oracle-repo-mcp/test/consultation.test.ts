import { test, expect } from 'vitest';
import { Consultation, Events, conversationUrl } from '../src/consultation.js';
import { ReceiptLedger } from '../src/instance.js';
import { jsonReply } from '../src/mcp.js';

test('observations fence turns/tabs/epochs, promote URLs and expire completion evidence', () => {
  const tracker = new Consultation();
  const begin = tracker.begin({browser_id:'iab',tab_id:'1',conversation_url:'https://chatgpt.com/c/WEB:abc'},1);
  const now = Date.now();
  const observation = {turn_id:begin.turn_id,browser_id:'iab',tab_id:'1',response_state:'thinking',observed_at:now};
  tracker.observe(observation,1,now);
  expect(() => tracker.observe({...observation,tab_id:'2',observed_at:now+1},1,now+1)).toThrowError(expect.objectContaining({code:'STALE_CONSULTATION'}));
  expect(() => tracker.observe({...observation,observed_at:now+1},2,now+1)).toThrowError(expect.objectContaining({code:'STALE_CONSULTATION'}));
  expect(() => tracker.observe(observation,1,now)).toThrowError(expect.objectContaining({code:'STALE_OBSERVATION'}));
  const url='https://chatgpt.com/c/00000000-0000-4000-8000-000000000001';
  expect(tracker.observe({...observation,conversation_url:url,response_state:'finished',observed_at:now+1},1,now+1)).toMatchObject({response_state:'finished',url_kind:'canonical'});
  expect(tracker.status(now+61_000)).toMatchObject({response_state:'unknown',last_observed_state:'finished',fresh:false});
  expect(() => tracker.observe({...observation,conversation_url:'https://chatgpt.com/c/00000000-0000-4000-8000-000000000002',observed_at:now+2},1,now+2)).toThrowError(expect.objectContaining({code:'CONVERSATION_CHANGED'}));
  tracker.begin({browser_id:'iab',tab_id:'1'},1);
  expect(() => tracker.observe({...observation,observed_at:now+3},1,now+3)).toThrowError(expect.objectContaining({code:'STALE_CONSULTATION'}));
});

test('conversation URL validation excludes other origins and non-conversation paths', () => {
  for (const url of ['not-url','https://example.com/c/id','https://chatgpt.com/settings/c/id','https://chatgpt.com/c/id#settings','https://chatgpt.com/c/id?x=y']) expect(()=>conversationUrl(url)).toThrow();
});

test('events wake promptly, bound retention and flag expired cursors', async () => {
  const events = new Events();
  const pending=events.wait(0,5000);
  events.publish('ready');
  expect(await pending).toMatchObject({cursor:1,events:[{type:'ready'}],cursor_expired:false});
  for(let i=0;i<150;i++)events.publish('tool_finished');
  const page=await events.wait(1,0);
  expect(page.events).toHaveLength(128); expect(page.cursor_expired).toBe(true);
  await expect(events.wait(9999,0)).rejects.toMatchObject({code:'INVALID_CURSOR'});
  const abort=new AbortController();const cancelled=events.wait(events.cursor,5000,abort.signal);abort.abort();await cancelled;
});

test('receipt pages expose lifecycle without arguments, hashes or payloads',async()=>{
  const ledger=new ReceiptLedger();let release!:()=>void;
  const pending=ledger.run('exec_command','first',{cmd:'secret'},async()=>{await new Promise<void>(resolve=>release=resolve);return jsonReply({output:'private'});});
  await Promise.resolve();
  expect(ledger.list()).toMatchObject({entries:[{request_id:'first',state:'in_flight'}]});
  release();await pending;
  await ledger.run('exec_command','second\0part',{},async()=>jsonReply({}));
  expect(ledger.list(1,1)).toMatchObject({entries:[{request_id:'second\0part'}]});
  expect(ledger.list(0,1)).toMatchObject({next_offset:1,entries:[{state:'retained',outcome:'success'}]});
  ledger.acknowledge([{tool:'exec_command',request_id:'first'}]);
  expect(ledger.list(0,1)).toMatchObject({entries:[{state:'retired',acknowledged_at:expect.any(Number)}]});
  expect(JSON.stringify(ledger.list())).not.toMatch(/secret|private|digest|output/);
});
