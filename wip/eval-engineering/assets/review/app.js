import {el, icon, button, badge, TaskList, RequestStrip, OutputPane, dialog, markdown} from './components.js';

let data, activeId, view='compare', focused='A', raw=new Set(), busy=false, selected=null;
let taskDialog, noteDialog, toastTimer;
const root=document.querySelector('#app');
const task=()=>data.tasks.find(t=>t.id===activeId);
const draftKey=id=>`eval-review:${data.workspace_id}:${id}`;
function readDraft(id){try{return JSON.parse(localStorage.getItem(draftKey(id))||'{}')}catch{return {}}}
function writeDraft(id,value){try{localStorage.setItem(draftKey(id),JSON.stringify(value))}catch{notify('Browser draft storage is unavailable. Save before leaving.',true)}}
function draft(patch){const old=readDraft(activeId);writeDraft(activeId,{...old,...patch});}
function notify(message,error=false){const box=document.querySelector('#toast');box.replaceChildren(icon(error?'note':'check'),el('span',{},message));box.hidden=false;box.classList.toggle('error',error);clearTimeout(toastTimer);toastTimer=setTimeout(()=>{box.hidden=true},error?10000:3500);}

async function send(action, pendingHolder={}) {
  if(busy)return false;
  busy=true;document.body.classList.add('saving');
  const body=pendingHolder.body||{...action,operation_id:crypto.randomUUID(),revision:data.feedback.revision};
  pendingHolder.body=body;
  try{
    const response=await fetch('action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const result=await response.json();
    if(!response.ok){
      if(response.status===409){const current=await fetch('data');if(current.ok)data=await current.json();pendingHolder.body=null;}
      throw Error(result.error||'Could not save');
    }
    data=result;pendingHolder.body=null;return true;
  }catch(error){notify(error.message+' Your draft is retained.',true);return false;}
  finally{busy=false;document.body.classList.remove('saving');}
}

function selectTask(id){if(busy)return;activeId=id;selected=null;focused='A';sessionStorage.setItem('eval-active:'+data.workspace_id,id);render();}
function nextTask(){const i=data.tasks.findIndex(t=>t.id===activeId);if(i<data.tasks.length-1)selectTask(data.tasks[i+1].id);else showSummary();}
function previousTask(){const i=data.tasks.findIndex(t=>t.id===activeId);if(i>0)selectTask(data.tasks[i-1].id);}
function notesFor(id){return data.feedback.comments.filter(c=>c.task_id===id);}

function showTask(){
  const t=task();let tab='request';
  const content=el('div'),tabs=el('div',{class:'detail-tabs','aria-label':'Task information'});
  function draw(){tabs.replaceChildren();const items=[{id:'request',title:'Request'},...t.context.map((c,i)=>({id:'context-'+i,title:c.name}))];for(const item of items)tabs.append(button(item.title,()=>{tab=item.id;draw()},{class:'button detail-tab'+(tab===item.id?' selected':''),attrs:{'aria-pressed':tab===item.id?'true':'false'}}));content.replaceChildren();if(tab==='request'){content.append(el('p',{class:'eyebrow'},'EXACT REQUEST'),el('div',{class:'source-text'},t.request));if(t.questions.length)content.append(el('h3',{class:'detail-heading'},'Review considerations'),el('ul',{class:'considerations'},t.questions.map(q=>el('li',{},q))));}else{const c=t.context[Number(tab.split('-')[1])];content.append(el('p',{class:'eyebrow'},'SOURCE CONTEXT'),el('h3',{},c.name),el('div',{class:'source-text'},c.text));}}
  draw();taskDialog=dialog('Task details',el('div',{},el('p',{class:'dialog-subtitle'},t.title),tabs,content),null,'task-dialog');
}

function showNotes(outputId=task().outputs[0].id, edit=null, anchor=null, resume=null){
  const t=task(),drafts=readDraft(t.id).notes||{};
  const initial=resume|| (edit?{...(drafts[edit.id]||edit)}:anchor?{...anchor,id:crypto.randomUUID(),comment:''}:{id:crypto.randomUUID(),output_id:outputId,scope:'whole_output',comment:''});
  if(!t.outputs.some(o=>o.id===initial.output_id)){notify('The draft belongs to an older output revision.',true);return;}
  const note={...initial},pending={};let saved=false,dirty=!!resume||!!(edit&&drafts[edit.id]);
  function retain(){if(!dirty||saved)return;const current=readDraft(t.id),notes={...(current.notes||{})};if(note.comment?.trim())notes[note.id]=note;else delete notes[note.id];writeDraft(t.id,{...current,notes});}
  const composer=el('div',{class:'note-composer'}),notes=el('div',{class:'saved-notes'});
  const output=t.outputs.find(o=>o.id===note.output_id);
  const text=el('textarea',{id:'note-text',rows:5,placeholder:'What works, what is missing, or what should change?'});text.value=note.comment||'';
  const saveState=el('span',{class:'draft-status',role:'status'},dirty?'Unsaved draft':'');
  const heading=el('div',{class:'note-target'},badge('Output '+output.label),el('span',{},note.scope==='selected_text'?'Selected passage':'Whole output'));
  const save=button(edit?'Save changes':'Save note',async()=>{
    if(!text.value.trim()){saveState.textContent='Write a note before saving.';text.focus();return;}
    note.comment=text.value;save.disabled=true;text.disabled=true;save.textContent='Saving…';
    const ok=await send({action:'comment',...note},pending);
    save.disabled=false;text.disabled=false;save.textContent=edit?'Save changes':'Save note';
    if(ok){saved=true;const d=readDraft(t.id);if(d.notes)delete d.notes[note.id];writeDraft(t.id,d);noteDialog.close();selected=null;render();notify('Note saved locally');}
    else saveState.textContent='Not saved · retry when ready';
  },{class:'button primary'});
  text.addEventListener('input',()=>{note.comment=text.value;dirty=true;retain();saveState.textContent=text.value?'Unsaved draft':'Draft empty';pending.body=null;});
  text.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key==='Enter'){event.preventDefault();save.click();}});
  composer.append(heading);
  if(note.quote)composer.append(el('blockquote',{class:'selected-quote'},note.quote));
  composer.append(el('label',{for:'note-text'},edit?'Edit note':'Add a note'),text,el('div',{class:'composer-actions'},saveState,save));
  const entries=notesFor(t.id);
  const otherDrafts=Object.values(drafts).filter(n=>n.id!==note.id);
  if(otherDrafts.length)notes.append(el('h3',{},`Unsaved drafts · ${otherDrafts.length}`),...otherDrafts.map(n=>el('div',{class:'draft-row'},el('div',{},el('span',{class:'quiet-copy'},'Output '+t.outputs.find(o=>o.id===n.output_id)?.label),el('p',{},n.comment)),button('Resume',()=>{noteDialog.close();showNotes(n.output_id,null,null,n);},{class:'button compact'}))));
  notes.append(el('h3',{},`Saved notes${entries.length?' · '+entries.length:''}`));
  if(!entries.length)notes.append(el('p',{class:'empty-copy'},'No notes yet. A note is optional; marking a task reviewed does not mean you accept the output.'));
  for(const c of entries)notes.append(el('article',{class:'saved-note'},el('div',{class:'saved-note-header'},badge('Output '+c.label),el('span',{},c.scope==='selected_text'?'Passage':'Whole output'),button('Edit',()=>{if(busy)return;noteDialog.close();showNotes(c.output_id,c)},{class:'button quiet compact'})),c.quote?el('blockquote',{},c.quote):null,el('p',{},c.comment)));
  noteDialog=dialog('Review notes',el('div',{},composer,notes),el('span',{class:'quiet-copy'},'Saved locally · '+(data.blind?'Identities hidden':data.revealed?'Identities revealed':'Known candidate')),'notes-dialog',()=>!busy);
  noteDialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  noteDialog.addEventListener('close',retain);
  text.focus();
}

function about(){dialog('About this review',el('div',{},el('p',{class:'source-text'},data.disclosure||'Review the original outputs against their shared task. Completion records review status, not acceptance.'),el('div',{class:'info-line'},icon('shield'),'Feedback stays in this local workspace.'),el('p',{class:'quiet-copy'},data.preview?'Synthetic preview. These examples are not model runs; feedback is stored separately.':'No automated subjective scores are shown. Original outputs are unchanged.')));}

function showSummary(){
  const count=data.tasks.filter(t=>data.feedback.decisions[t.id]?.completed).length;
  const body=el('div',{},el('p',{class:'summary-lead'},`${count} of ${data.tasks.length} tasks reviewed`),el('p',{class:'quiet-copy'},'Review status does not imply acceptance. Notes and preferences remain attached to their original outputs.'),
    el('div',{class:'summary-list'},data.tasks.map(t=>{const d=data.feedback.decisions[t.id];return el('div',{class:'summary-row'},el('span',{},t.title),el('span',{class:'summary-value'},d?.completed?(d.choice?({A:'Prefer A',B:'Prefer B',tie:'Tie',neither:'Neither'}[d.choice]):'Reviewed'):'Not reviewed'));})));
  const all=count===data.tasks.length;
  let modal;
  const footer=el('div',{class:'summary-actions'},button('Continue review',()=>modal.close(),{class:'button'}));
  if(data.blind_available&&!data.revealed){const reveal=button('Reveal identities',()=>{
    modal.close();let confirm;
    const pending={};const yes=button('Reveal identities',async()=>{yes.disabled=true;if(await send({action:'reveal'},pending)){confirm.close();render();notify('Identities revealed. Blind judgments preserved.');}else yes.disabled=false;},{class:'button primary'});
    confirm=dialog('Reveal candidate identities?',el('div',{},el('p',{class:'source-text'},'This ends blind review for this workspace. Your existing judgments will be preserved as a blind snapshot. Later changes will be recorded as unblinded.')),el('div',{class:'toolbar'},button('Keep hidden',()=>confirm.close(),{class:'button'}),yes));
  },{class:'button primary'});reveal.disabled=!all;footer.append(reveal);if(!all)body.append(el('p',{class:'quiet-copy'},'Finish every task before revealing candidate identities.'));}
  modal=dialog('Review summary',body,footer);
}

function decisionFooter(t){
  const paired=t.outputs.length===2,decision=data.feedback.decisions[t.id],d=readDraft(t.id);
  let choice=d.choice!==undefined?d.choice:decision?.choice||null;
  let reason=d.reason!==undefined?d.reason:decision?.reason||'';
  const pending={};const notes=notesFor(t.id).length;
  const footer=el('footer',{class:'review-footer'+(paired?' paired':'')});
  if(paired){
    const choices=el('div',{class:'preference-options','aria-label':'Preferred output'});
    for(const [value,label] of [['A','Prefer A'],['B','Prefer B'],['tie','Tie'],['neither','Neither']]){
      const b=button(label,()=>{choice=value;draft({choice,reason});choices.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));pending.body=null;},{class:'button preference'+(choice===value?' chosen':''),attrs:{'aria-pressed':choice===value?'true':'false'}});choices.append(b);
    }
    const reasonInput=el('textarea',{id:'preference-reason',class:'reason-input',rows:1,placeholder:'What makes the difference?'});reasonInput.value=reason;
    reasonInput.oninput=()=>{reason=reasonInput.value;draft({choice,reason});pending.body=null;};
    footer.append(el('div',{class:'preference-row'},el('span',{class:'footer-label'},'Your preference'),choices),el('div',{class:'reason-row'},el('label',{for:'preference-reason'},'Reason'),reasonInput));
  }
  const at=data.tasks.findIndex(x=>x.id===t.id),last=at===data.tasks.length-1;
  const save=button(decision?.completed&&!paired?(last?'Review summary':'Next task'):last?'Finish review':'Save & next',async()=>{
    if(busy)return;
    if(!paired&&decision?.completed){nextTask();return;}
    if(paired&&(!choice||!reason.trim())){notify('Choose an output, tie, or neither, then add a reason.',true);document.querySelector('#preference-reason').focus();return;}
    save.disabled=true;
    if(await send({action:'decision',task_id:t.id,choice:paired?choice:null,reason:paired?reason:'',completed:true},pending)){
      const current=readDraft(t.id);delete current.choice;delete current.reason;writeDraft(t.id,current);notify('Review saved locally');nextTask();if(last)render();
    }else save.disabled=false;
  },{class:'button primary',icon:'arrow'});
  if(!paired&&!decision?.completed)save.replaceChildren(document.createTextNode(last?'Mark reviewed & finish':'Mark reviewed & next'),icon('arrow'));
  if(t.outputs.some(o=>o.status!=='complete')){save.disabled=true;save.title='An output is unavailable. Resolve the run before completing this comparison.';}
  const prev=button('Previous',previousTask,{class:'button quiet',icon:'back'});prev.disabled=at===0;
  const reopen=decision?.completed?button('Reopen',async()=>{if(await send({action:'decision',task_id:t.id,choice:decision.choice,reason:decision.reason,completed:false})){render();notify('Task reopened');}},{class:'button quiet compact'}):null;
  footer.append(el('div',{class:'footer-actions'},el('div',{class:'toolbar'},button(notes?`${notes} ${notes===1?'note':'notes'}`:'Add note',()=>showNotes(),{class:'button quiet',icon:'note'}),el('span',{class:'review-state'},decision?.completed?'Reviewed':'Not reviewed'),reopen),el('div',{class:'toolbar'},prev,save)));
  return footer;
}

function render(){
  const t=task(),paired=t.outputs.length===2,total=data.tasks.length,at=data.tasks.findIndex(x=>x.id===activeId);
  const completed=data.tasks.filter(x=>data.feedback.decisions[x.id]?.completed).length;
  document.title=data.title+' · Review';root.replaceChildren();
  const sidebar=el('aside',{class:'sidebar'},el('div',{class:'workspace-brand'},el('span',{class:'brand-mark'},icon('split',17)),el('span',{},'Review workspace')),
    el('div',{class:'suite-info'},el('h1',{},data.title),el('p',{},data.subtitle)),
    el('div',{class:'rail-label'},'TASKS',el('span',{},String(total))),
    el('nav',{'aria-label':'Tasks'},TaskList({tasks:data.tasks,activeId,decisions:data.feedback.decisions,onSelect:selectTask})),
    el('div',{class:'sidebar-bottom'},button('Review summary',showSummary,{class:'button quiet full',icon:'check'}),button('About this review',about,{class:'button quiet full',icon:'shield'}),el('span',{class:'local-status'},el('span',{class:'status-dot'}),'Local workspace')));
  const progress=el('div',{class:'progress-track','aria-hidden':'true'},el('span'));
  progress.firstChild.style.width=(completed/total*100)+'%';
  const topbar=el('header',{class:'topbar'},el('div',{class:'breadcrumb'},el('span',{},'Evaluation'),icon('chevron',13),el('span',{},data.preview?'Component preview':'Output review')),
    el('div',{class:'topbar-right'},data.preview?badge('Synthetic preview','preview'):null,button(data.blind?'Blind review':data.revealed?'Identities revealed':'Single-candidate review',about,{class:'button quiet compact review-mode',attrs:{'aria-label':'About this review: '+(data.blind?'blind':data.revealed?'identities revealed':'single candidate')}}),button(`${completed} / ${total} reviewed`,showSummary,{class:'button quiet compact progress-copy',attrs:{'aria-label':`Review summary: ${completed} of ${total} reviewed`}}),progress));
  const switches=paired?el('div',{class:'view-switch','aria-label':'Output layout'},button('Side by side',()=>{view='compare';render()},{class:'button compact'+(view==='compare'?' selected':''),icon:'split',attrs:{'aria-pressed':view==='compare'?'true':'false'}}),button('Focus',()=>{view='focus';render()},{class:'button compact'+(view==='focus'?' selected':''),attrs:{'aria-pressed':view==='focus'?'true':'false'}})):null;
  const heading=el('div',{class:'task-heading'},el('div',{class:'task-heading-title'},el('span',{class:'heading-number'},String(at+1).padStart(2,'0')),el('h2',{},t.title)),switches);
  const workspace=el('main',{class:'workspace'},heading,RequestStrip({request:t.request,context:t.context,onOpen:showTask}));
  if(data.preview)workspace.append(el('div',{class:'preview-banner'},icon('eye',15),'Illustrative fixtures only — not evaluation results.'));
  if(paired&&view==='focus')workspace.append(el('div',{class:'focus-tabs'},t.outputs.map(o=>button('Output '+o.label,()=>{focused=o.label;render()},{class:'button compact'+(focused===o.label?' selected':''),attrs:{'aria-pressed':focused===o.label?'true':'false'}}))));
  const area=el('section',{class:'outputs '+(paired&&view==='compare'?'comparison':'single'),id:'output-region','aria-label':'Generated outputs'});
  const shown=paired&&view==='focus'?t.outputs.filter(o=>o.label===focused):t.outputs;
  for(const o of shown){
    if(o.status!=='complete')area.append(el('article',{class:'output-pane unavailable'},el('header',{class:'output-header'},badge('Output '+o.label),el('span',{},'Unavailable')),el('div',{class:'unavailable-body'},icon('file',28),el('h3',{},'No output to review'),el('p',{},'This run did not produce a complete artifact. Resolve it before comparing quality.'))));
    else area.append(OutputPane({output:o,raw:raw.has(o.id),comments:notesFor(t.id).filter(c=>c.output_id===o.id).length,
      onNote:()=>showNotes(o.id),onRaw:()=>{raw.has(o.id)?raw.delete(o.id):raw.add(o.id);render();},
      onSelection:anchor=>{selected=anchor;const existing=document.querySelector('.selection-action');existing?.remove();const action=button('Comment on selection',()=>{action.remove();showNotes(anchor.output_id,null,anchor)},{class:'button selection-action',icon:'note'});workspace.append(action);}}));
  }
  workspace.append(area,decisionFooter(t));
  root.append(sidebar,el('div',{class:'main-shell'},topbar,workspace));
}

async function load(){try{const response=await fetch('data');const result=await response.json();if(!response.ok)throw Error(result.error);data=result;const remembered=sessionStorage.getItem('eval-active:'+data.workspace_id);activeId=data.tasks.some(t=>t.id===remembered)?remembered:data.tasks[0].id;render();}catch(error){root.replaceChildren(el('main',{class:'boot-state'},el('h1',{},'Review unavailable'),el('p',{},error.message),button('Try again',load,{class:'button primary'})));}}
document.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]')||event.target.closest('input,textarea,select')||event.metaKey||event.ctrlKey||event.altKey)return;if(event.key==='j'){event.preventDefault();nextTask();}if(event.key==='k'){event.preventDefault();previousTask();}});
load();
