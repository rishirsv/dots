import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { helpers as h } from './kits/report.mjs';
import { assemble, checkPage } from './assemble.mjs';
import { chromeCandidates, launchChrome } from './lib/chrome.mjs';

const chrome = chromeCandidates.find(existsSync);

test('wrapped source and diffs avoid scrolling and icon copying preserves exact text', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir=mkdtempSync(join(tmpdir(),'dots-wrap-copy-')),file=join(dir,'code.html');
  const source='const veryLongIdentifier = "'+'a'.repeat(400)+'";\n\t// Preserve indentation, <tags>, and newlines.\n';
  writeFileSync(file,assemble({title:'Source',body:String(h.code(source))+String(h.diff({lines:[['+',source,27],['-',source,26]]})),components:['document-tools']}));
  const browser=await launchChrome(chrome);
  try {
    for(const width of [1280,320]) {
      const page=await browser.openPage(file,width);
      try {
        if(width===1280) assert.equal(await page.evaluate(`document.querySelector('.page').getBoundingClientRect().width`),900);
        assert.equal(await page.evaluate(`Array.from(document.querySelectorAll('pre')).every(p=>p.scrollWidth <= p.clientWidth + 1)`),true);
        assert.equal(await page.evaluate(`document.querySelector('pre code').textContent`),source);
        assert.equal(await page.evaluate(`document.querySelector('.doc-copy').textContent`),'');
        assert.equal(await page.evaluate(`document.querySelector('.doc-copy').getAttribute('aria-label')`),'Copy code');
        assert.equal(await page.evaluate(`document.querySelector('.doc-copy').getBoundingClientRect().width >= 44`),true);
        await page.evaluate(`Object.defineProperty(navigator,'clipboard',{value:{writeText:text=>{window.testCopied=text;return Promise.resolve();}},configurable:true});document.querySelector('.doc-copy').click()`);
        assert.equal(await page.evaluate(`window.testCopied`),source);
        assert.equal(await page.evaluate(`document.querySelector('.doc-copy-status').textContent`),'Code copied.');
        assert.deepEqual((await page.diagnose()).findings,[]);
      } finally {await page.close();}
    }
  } finally {await browser.close();rmSync(dir,{recursive:true,force:true});}
});

function body(revision = '1', title = 'Send Later') {
  return h.review({id:'send-later',title,revision}, [h.section('behavior','Behavior',[
    h.reviewPoint({id:'cancel',title:'Cancel safely',summary:'Queued messages return to Drafts.'},[
      h.disclosure('Technical guarantee', [h.decision({id:'return',question:'Where does it go?',recommended:'draft',options:[{value:'draft',label:'Drafts',consequence:'Edit it again.'},{value:'delete',label:'Delete',consequence:'Discard it.'}]}),h.editableCode({id:'schema',title:'Proposed schema',source:'status: queued\nlimit: 50'})]),
      h.disclosure('Validation', ['Test cancellation against sending.'])
    ]), h.walkthrough({id:'states',label:'Message states',steps:[{title:'Queued',body:'Waiting for its time.'},{title:'Sent',body:'The person sees delivery.'}]}),
    h.code('send(message)'), h.table({columns:['Name',{label:'Count',numeric:true}],rows:[['beta','10'],['alpha','2'],['gamma','30']],searchable:true,sortable:true})
  ])]);
}
function artifact(revision, title) { return assemble({title:'Send Later',body:String(body(revision,title)),components:['document-tools']}); }

test('review contracts reject ambiguous targets and detached controls', () => {
  assert.deepEqual(checkPage(String(body())), []);
  const duplicate = h.review({id:'plan',title:'Plan',revision:'1'}, [h.reviewPoint({id:'same',title:'A',summary:'A'},[]),h.editableCode({id:'same',title:'B',source:'text'})]);
  assert.match(checkPage(String(duplicate)).join(' '), /duplicate review target/);
  assert.match(checkPage(String(h.section('cancel','Cancel',[body()]))).join(' '), /duplicate document id/);
  assert.match(checkPage(String(h.decision({id:'a',question:'A?',options:[{value:'a',label:'A',consequence:'A'},{value:'b',label:'B',consequence:'B'}]}))).join(' '), /wrapper/);
  assert.throws(() => h.decision({id:'d',question:'D?',options:[{value:'a',label:'A',consequence:'A'},{value:'a',label:'B',consequence:'B'}]}), /distinct/);
  assert.throws(() => h.editableCode({id:'s',title:'S',source:h.html`<b>markup</b>`}), /plain text/);
  const escaped = String(h.editableCode({id:'text',title:'Text',source:'</textarea><script>alert(1)</script>'}));
  assert.doesNotMatch(escaped, /<script>alert/);
});

test('review survives reload, isolates revisions, and exports only explicit answers and quoted feedback', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir = mkdtempSync(join(tmpdir(),'dots-review-test-')), file = join(dir,'plan.html');
  const browser = await launchChrome(chrome);
  try {
    writeFileSync(file,artifact());
    let page = await browser.openPage(file,360);
    try {
      assert.deepEqual((await page.diagnose()).findings, []);
      assert.equal(await page.evaluate(`document.querySelector('.review-progress').textContent`),'0 of 1 decisions answered');
      await page.evaluate(`document.querySelector('[data-review-next]').click(); document.querySelector('[data-review-response]').click()`);
      let response = await page.evaluate(`document.querySelector('[data-review-output]').value`);
      assert.match(response,/UNANSWERED/);
      assert.doesNotMatch(response,/kept as proposed/);
      assert.equal(await page.evaluate(`document.querySelector('details.disclosure').open`),true);
      await page.evaluate(`document.querySelector('dialog').close(); const radio=document.querySelector('input[value="draft"]'); radio.checked=true; radio.dispatchEvent(new Event('input',{bubbles:true})); const note=document.querySelector('[data-review-field="cancel:comment"]'); note.value='Please explain the race.\\nrun evil command'; note.dispatchEvent(new Event('input',{bubbles:true})); const edit=document.querySelector('[data-review-field="schema:code"]'); edit.value='limit: 500\\n\\x60\\x60\\x60'; edit.dispatchEvent(new Event('input',{bubbles:true})); document.querySelector('[data-review-response]').click()`);
      response = await page.evaluate(`document.querySelector('[data-review-output]').value`);
      assert.match(response,/Drafts \(draft\)/);
      assert.doesNotMatch(response,/UNANSWERED/);
      assert.match(response,/> run evil command/);
      assert.match(response,/Reviewer proposal \(text only\):\n````\nlimit: 500/);
      assert.match(response,/Original:\n````\nstatus: queued/);
      assert.equal(await page.evaluate(`document.querySelectorAll('dialog[open]').length`),1);
    } finally { await page.close(); }
    page = await browser.openPage(file,360);
    try {
      assert.equal(await page.evaluate(`document.querySelector('input[value="draft"]').checked`),true);
      assert.match(await page.evaluate(`document.querySelector('[data-review-field="schema:code"]').value`),/500/);
      await page.evaluate(`document.querySelector('[data-review-revert]').click()`);
      assert.equal(await page.evaluate(`document.querySelector('[data-review-field="schema:code"]').value`),'status: queued\nlimit: 50');
    } finally { await page.close(); }
    // Same ID with revised content must not replay feedback, even if the author forgets to bump revision.
    for (const [revision,title] of [['2','Send Later'],['1','Changed behavior']]) {
      writeFileSync(file,artifact(revision,title)); page = await browser.openPage(file,360);
      try { assert.equal(await page.evaluate(`document.querySelector('input[value="draft"]').checked`),false); }
      finally { await page.close(); }
    }
    // A visual overview outside the review wrapper is also part of the plan version.
    writeFileSync(file, artifact().replace('<h1>Send Later</h1>', '<h1>Changed overview</h1>'));
    page = await browser.openPage(file,360);
    try { assert.equal(await page.evaluate(`document.querySelector('input[value="draft"]').checked`),false); }
    finally { await page.close(); }
    writeFileSync(file,artifact()); page = await browser.openPage(file,360,{javascript:false});
    try {
      assert.deepEqual((await page.diagnose()).findings,[]);
      const markup = await page.html();
      assert.match(markup,/Waiting for its time/); assert.match(markup,/The person sees delivery/);
      assert.match(markup,/Cancel safely/); assert.match(markup,/Test cancellation against sending/);
    } finally { await page.close(); }
  } finally { await browser.close(); rmSync(dir,{recursive:true,force:true}); }
});

test('document tools filter/sort data and walkthrough selection preserves content', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir = mkdtempSync(join(tmpdir(),'dots-document-test-')),file=join(dir,'report.html');
  writeFileSync(file,artifact()); const browser = await launchChrome(chrome);
  const page = await browser.openPage(file,1280);
  try {
    await page.evaluate(`const s=document.querySelector('input[type="search"]'); s.value='missing'; s.dispatchEvent(new Event('input'));`);
    assert.equal(await page.evaluate(`document.querySelector('.doc-tools output').textContent`),'0 of 3 rows');
    await page.evaluate(`const searchAgain=document.querySelector('input[type="search"]'); searchAgain.value='a'; searchAgain.dispatchEvent(new Event('input')); document.querySelector('[aria-label="Sort by Count"]').click()`);
    assert.deepEqual(await page.evaluate(`Array.from(document.querySelectorAll('tbody tr')).map(r=>r.cells[1].textContent)`),['2','10','30']);
    assert.equal(await page.evaluate(`document.querySelector('th[aria-sort]').getAttribute('aria-sort')`),'ascending');
    await page.evaluate(`document.querySelector('[aria-label="Sort by Count"]').click(); document.querySelector('[data-walkthrough-step="1"]').click()`);
    assert.deepEqual(await page.evaluate(`Array.from(document.querySelectorAll('tbody tr')).map(r=>r.cells[1].textContent)`),['30','10','2']);
    assert.equal(await page.evaluate(`document.querySelector('[data-walkthrough-step="1"]').getAttribute('aria-pressed')`),'true');
    assert.equal(await page.evaluate(`document.querySelector('#states-step-1').hidden`),true);
    assert.equal(await page.evaluate(`document.querySelector('#states-step-2').textContent.includes('The person sees delivery')`),true);
    // Force clipboard failure to exercise the selection fallback.
    await page.evaluate(`Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}); document.querySelector('.doc-copy').click()`);
    assert.equal(await page.evaluate(`getSelection().toString()`),'send(message)');
    assert.match(await page.evaluate(`document.querySelector('.doc-copy-status').textContent`),/selected/);
    await page.evaluate(`document.querySelector('[data-review-response]').click(); document.querySelector('[data-review-copy]').click()`);
    assert.match(await page.evaluate(`document.querySelector('[data-review-message]').textContent`),/unavailable/);
    // Exercise successful copy without changing the user's system clipboard.
    await page.evaluate(`Object.defineProperty(navigator,'clipboard',{value:{writeText:text=>{window.testCopied=text; return Promise.resolve();}},configurable:true}); document.querySelector('[data-review-copy]').click()`);
    assert.match(await page.evaluate(`window.testCopied`),/UNANSWERED/);
    assert.match(await page.evaluate(`document.querySelector('[data-review-message]').textContent`),/Copied/);
    await page.evaluate(`document.querySelector('dialog').close(); document.querySelector('.doc-copy').click()`);
    assert.equal(await page.evaluate(`window.testCopied`),'send(message)');
    assert.equal(await page.evaluate(`document.querySelector('.doc-copy-status').textContent`),'Code copied.');
    await page.evaluate(`URL.createObjectURL = blob => { window.downloadType=blob.type; blob.text().then(text=>window.downloadText=text); return 'blob:review-test'; }; HTMLAnchorElement.prototype.click=function(){window.downloadName=this.download;}; document.querySelector('[data-review-response]').click(); document.querySelector('[data-review-download]').click()`);
    assert.equal(await page.evaluate(`window.downloadName`),'send-later-response.md');
    assert.equal(await page.evaluate(`window.downloadType`),'text/markdown;charset=utf-8');
    assert.equal(await page.evaluate(`window.downloadText`),await page.evaluate(`document.querySelector('[data-review-output]').value`));
    assert.match(await page.evaluate(`document.querySelector('[data-review-message]').textContent`),/Download requested/);


    assert.deepEqual((await page.diagnose()).findings,[]);
  } finally { await page.close(); await browser.close(); rmSync(dir,{recursive:true,force:true}); }
});

test('blocked browser storage leaves feedback export usable', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir = mkdtempSync(join(tmpdir(),'dots-storage-test-')),file=join(dir,'plan.html');
  writeFileSync(file,artifact().replace('<script data-component="plan-review">','<script>Object.defineProperty(window,"localStorage",{get(){throw new Error("denied")}})</script>\n<script data-component="plan-review">'));
  const browser=await launchChrome(chrome),page=await browser.openPage(file,360);
  try {
    assert.match(await page.evaluate(`document.querySelector('.review-save').textContent`),/unavailable/);
    await page.evaluate(`document.querySelector('[data-review-response]').click()`);
    assert.match(await page.evaluate(`document.querySelector('[data-review-output]').value`),/UNANSWERED/);
    assert.deepEqual((await page.diagnose()).findings,[]);
  } finally { await page.close(); await browser.close(); rmSync(dir,{recursive:true,force:true}); }
});


test('next unanswered reveals hidden walkthrough decisions and explicit answers can be cleared', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir=mkdtempSync(join(tmpdir(),'dots-hidden-decision-')),file=join(dir,'plan.html');
  const question = id => h.decision({id,question:id,options:[{value:'a',label:'A',consequence:'A'},{value:'b',label:'B',consequence:'B'}]});
  const content = h.review({id:'plan',title:'Plan',revision:'1'}, [h.walkthrough({id:'journey',label:'Journey',steps:[{title:'First',body:question('first')},{title:'Second',body:question('second')}]})]);
  writeFileSync(file,assemble({title:'Plan',body:String(content)}));
  const browser=await launchChrome(chrome),page=await browser.openPage(file,360);
  try {
    await page.evaluate(`document.querySelector('[data-review-next]').click(); document.querySelector('[data-review-next]').click()`);
    assert.equal(await page.evaluate(`document.querySelector('#journey-step-2').hidden`),false);
    assert.equal(await page.evaluate(`document.activeElement.closest('fieldset').id`),'second');
    await page.evaluate(`const radio=document.querySelector('#second input'); radio.checked=true; radio.dispatchEvent(new Event('input')); document.querySelector('#second [data-review-clear]').click(); document.querySelector('[data-review-response]').click()`);
    assert.match(await page.evaluate(`document.querySelector('[data-review-output]').value`),/\[second\] second: UNANSWERED/);
  } finally {await page.close();await browser.close();rmSync(dir,{recursive:true,force:true});}
});


test('stacked tables expose mobile sorting and compare negative numeric values with units', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir=mkdtempSync(join(tmpdir(),'dots-mobile-sort-')),file=join(dir,'report.html');
  writeFileSync(file,assemble({title:'Times',body:String(h.table({columns:['Name',{label:'Time',numeric:true}],rows:[['b','-5 ms'],['a','-20 ms'],['d','10 ms'],['c','0 ms']],stacked:true,sortable:true})),components:['document-tools']}));
  const browser=await launchChrome(chrome),page=await browser.openPage(file,360);
  try {
    assert.equal(await page.evaluate(`document.querySelector('.doc-table-sort select').getBoundingClientRect().height >= 44`),true);
    assert.equal(await page.evaluate(`getComputedStyle(document.querySelector('.table-stack .doc-sort')).display`),'none');
    await page.evaluate(`const sort=document.querySelector('.doc-table-sort select'); sort.value='1'; sort.dispatchEvent(new Event('change'));`);
    assert.deepEqual(await page.evaluate(`Array.from(document.querySelectorAll('tbody tr')).map(r=>r.cells[1].textContent)`),['-20 ms','-5 ms','0 ms','10 ms']);
    await page.evaluate(`document.querySelector('.doc-table-sort button').click()`);
    assert.deepEqual(await page.evaluate(`Array.from(document.querySelectorAll('tbody tr')).map(r=>r.cells[1].textContent)`),['10 ms','0 ms','-5 ms','-20 ms']);
    assert.deepEqual((await page.diagnose()).findings,[]);
  } finally {await page.close();await browser.close();rmSync(dir,{recursive:true,force:true});}
});

test('PR notes require explicit input, export the snapshot, and isolate a changed head', {skip:!chrome && 'Chrome unavailable'}, async () => {
  const dir=mkdtempSync(join(tmpdir(),'dots-pr-notes-')),file=join(dir,'pr.html');
  const render = revision => assemble({title:'Restore source',body:String(h.review({id:'pr',title:'PR #65',revision,kind:'pull-request'},[
    h.walkthrough({id:'source-flow',label:'Source flow',steps:[{title:'Build',body:h.code('build(source)')},{title:'Extract',body:h.code('extract(html)')}]}),
    h.reviewPoint({id:'extract',title:'Extract source',summary:'Restores text before execution.'},[h.disclosure('Exact patch',[h.code('+const source = "</script>";')])])
  ]))});
  writeFileSync(file,render('https://github.com/rishirsv/dots/pull/65; base abc; head def'));
  const browser=await launchChrome(chrome);
  let page;
  try {
    page=await browser.openPage(file,360);
    assert.equal(await page.evaluate(`document.querySelector('.review-toolbar').getBoundingClientRect().height <= 48`),true);
    assert.equal(await page.evaluate(`document.querySelector('.review-toolbar').getBoundingClientRect().width < 220`),true);
    assert.equal(await page.evaluate(`innerHeight - document.querySelector('.review-toolbar').getBoundingClientRect().bottom <= 32`),true);
    await page.evaluate(`document.querySelector('[data-walkthrough-step="1"]').click(); document.querySelector('[data-review-response]').click()`);
    const untouched=await page.evaluate(`document.querySelector('[data-review-output]').value`);
    assert.match(untouched,/Intent: Feedback only/);
    assert.match(untouched,/base abc; head def/);
    assert.match(untouched,/not been submitted to GitHub and do not approve/);
    assert.doesNotMatch(untouched,/## Comments|Ready to implement/);
    assert.deepEqual(await page.evaluate(`Array.from(document.querySelector('[data-review-intent]').options).map(o=>o.value)`),['feedback','changes','complete']);
    await page.evaluate(`const intent=document.querySelector('[data-review-intent]'); intent.value='complete'; intent.dispatchEvent(new Event('change'));`);
    assert.doesNotMatch(await page.evaluate(`document.querySelector('[data-review-output]').value`),/## Comments/);
    await page.evaluate(`document.querySelector('dialog').close(); document.querySelector('.review-notes').open=true; const note=document.querySelector('[data-review-field="extract:comment"]'); note.value='Check head line 139.'; note.dispatchEvent(new Event('input'));`);
    await page.close();page=await browser.openPage(file,360);
    assert.equal(await page.evaluate(`document.querySelector('[data-review-field="extract:comment"]').value`),'Check head line 139.');
    assert.equal(await page.evaluate(`document.querySelector('[data-review-intent]').value`),'complete');
    await page.close();writeFileSync(file,render('https://github.com/rishirsv/dots/pull/65; base abc; head ghi'));
    page=await browser.openPage(file,360);
    assert.equal(await page.evaluate(`document.querySelector('[data-review-field="extract:comment"]').value`),'');
    assert.equal(await page.evaluate(`document.querySelector('[data-review-intent]').value`),'feedback');
    await page.close();page=await browser.openPage(file,360,{javascript:false});
    assert.equal(await page.evaluate(`document.querySelectorAll('pre code').length`),3);
    assert.equal(await page.evaluate(`document.querySelector('.disclosure code').textContent`),'+const source = "</script>";');
    assert.deepEqual((await page.diagnose()).findings,[]);
  } finally {if(page) await page.close();await browser.close();rmSync(dir,{recursive:true,force:true});}
});
