import { test, expect } from 'vitest';
import { DiagnosticReader } from '../src/diagnostics.js';
import { CommandPool } from '../src/commands.js';

test('runner diagnostics survive split chunks, ignore malformed lines and remain bounded',()=>{
  const reader=new DiagnosticReader();
  reader.push(Buffer.from('ORACLE_DIAG'));
  reader.push(Buffer.from('NOSTIC {"code":"TEST_SELECTOR_NOT_ENUMERATED","message":"Choose an enumerated test","selectors":["Suite/test(_:)"]}\n'));
  expect(reader.entries).toMatchObject([{source:'command_output',code:'TEST_SELECTOR_NOT_ENUMERATED',selectors:['Suite/test(_:)']}]);
  reader.push(Buffer.from('ORACLE_DIAGNOSTIC bad json\nORACLE_DIAGNOSTIC '+JSON.stringify({code:'bad code',message:'ignore'})+'\n'));
  expect(reader.entries).toHaveLength(1);
  reader.push(Buffer.from('x'.repeat(9000)));
  reader.push(Buffer.from('ORACLE_DIAGNOSTIC {"code":"FALSE","message":"skip"}\n'));
  expect(reader.entries).toHaveLength(1);
  for(let i=0;i<20;i++)reader.push(Buffer.from('ORACLE_DIAGNOSTIC {"code":"BOUNDED","message":"reported"}\n'));
  expect(reader.entries).toHaveLength(8);
});

test('managed command returns structured failure independent of transcript cap',async()=>{
  const pool=new CommandPool(process.cwd());
  try {
    const output=await pool.exec({cmd:`printf '%s\n' 'ORACLE_DIAGNOSTIC {"code":"TEST_SELECTOR_NOT_ENUMERATED","message":"Choose an enumerated test"}'; exit 1`,login:false,max_output_tokens:1});
    expect(output.diagnostics).toMatchObject([{code:'TEST_SELECTOR_NOT_ENUMERATED'}]);
    if(output.session_id) {
      const final=await pool.writeStdin({session_id:output.session_id,chars:'',yield_time_ms:1000});
      expect(final.exit_code).toBe(1); expect(final.diagnostics).toMatchObject([{code:'TEST_SELECTOR_NOT_ENUMERATED'}]);
    } else expect(output.exit_code).toBe(1);
  } finally {await pool.close();}
});
