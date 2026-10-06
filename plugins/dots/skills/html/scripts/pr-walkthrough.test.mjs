import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {chromeCandidates,launchChrome} from './lib/chrome.mjs';

const data = JSON.parse(readFileSync(new URL('../assets/outcomes/pr-walkthrough.json',import.meta.url),'utf8'));

test('PR excerpts retain exact text and line anchors from the unfiltered patch', () => {
  for (const excerpt of Object.values(data.excerpts)) {
    const lines=new Map();let base=0,head=0;
    for (const line of data.patches[excerpt.file].split('\n')) {
      const hunk=line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if(hunk) {base=Number(hunk[1]);head=Number(hunk[2]);continue;}
      if(line.startsWith(' ')) {lines.set(excerpt.side==='base'?base:head,line.slice(1));base++;head++;}
      else if(line.startsWith('-')) {if(excerpt.side==='base')lines.set(base,line.slice(1));base++;}
      else if(line.startsWith('+')) {if(excerpt.side==='head')lines.set(head,line.slice(1));head++;}
    }
    assert.equal(excerpt.source.split('\n').length,excerpt.end-excerpt.start+1);
    assert.equal(Array.from({length:excerpt.end-excerpt.start+1},(_,i)=>{
      assert.ok(lines.has(excerpt.start+i),`${excerpt.file}:${excerpt.start+i} missing from patch`);
      return lines.get(excerpt.start+i);
    }).join('\n'),excerpt.source);
  }
});

test('expanded PR evidence remains contained at desktop and narrow widths', {skip:!chromeCandidates.some(existsSync)&&'Chrome unavailable'}, async () => {
  const browser=await launchChrome(chromeCandidates.find(existsSync));
  try {
    for (const width of [1280,320]) {
      const page=await browser.openPage(new URL('../assets/outcomes/pr-walkthrough.html',import.meta.url).pathname,width);
      try {
        await page.evaluate(`document.querySelectorAll('details.disclosure').forEach(d=>d.open=true);`);
        assert.deepEqual((await page.diagnose()).findings,[]);
        assert.equal(await page.evaluate(`Array.from(document.querySelectorAll('pre')).every(p=>p.scrollWidth <= p.clientWidth + 1)`),true);
        assert.equal(await page.evaluate(`document.querySelectorAll('.disclosure .disclosure').length`),0);
        assert.equal(await page.evaluate(`document.querySelectorAll('#coverage tbody tr').length`),data.files.length);
      } finally {await page.close();}
    }
  } finally {await browser.close();}
});
