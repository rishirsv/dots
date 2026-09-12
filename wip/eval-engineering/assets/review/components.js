// Presentational building blocks. Real runs and synthetic fixtures use the same props.
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children.flat(Infinity)) if (child !== null && child !== undefined) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  return node;
}

const paths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6', back: 'M19 12H5m6-6-6 6 6 6',
  chevron: 'm9 5 7 7-7 7', close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6', note: 'M5 4h14v13l-5 4H5V4Zm9 17v-5h5M8 8h8M8 12h5',
  file: 'M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h6',
  split: 'M3 4h18v16H3V4Zm9 0v16', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm7 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
  copy: 'M8 8h12v13H8V8ZM4 16H2V2h12v2', menu: 'M4 6h16M4 12h16M4 18h16',
  plus: 'M12 5v14M5 12h14', search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 1 1 16 0',
};
export function icon(name, size = 16) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [k,v] of Object.entries({viewBox:'0 0 24 24',width:size,height:size,fill:'none',stroke:'currentColor','stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'})) svg.setAttribute(k,v);
  const path = document.createElementNS(svg.namespaceURI,'path'); path.setAttribute('d',paths[name] || paths.file); svg.append(path); return svg;
}
export function button(text, action, options = {}) {
  return el('button', {type:'button', class:options.class || 'button', onclick:action, ...options.attrs}, options.icon ? icon(options.icon) : null, text);
}
export function badge(text, kind = '') { return el('span',{class:'badge '+kind},text); }

// Every rendered text fragment retains its UTF-16 offset in the unchanged source.
// This subset intentionally omits raw HTML, images, executable links and tables.
function inline(text, offset) {
  const result = document.createDocumentFragment();
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;
  let cursor = 0;
  function fragment(value, start, tag = 'span') { return el(tag,{'data-source-start':start},value); }
  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) result.append(fragment(text.slice(cursor,match.index),offset+cursor));
    const code = match[0].startsWith('`'), trim = code ? 1 : 2;
    result.append(fragment(match[0].slice(trim,-trim),offset+match.index+trim,code?'code':'strong'));
    cursor = match.index+match[0].length;
  }
  if (cursor < text.length) result.append(fragment(text.slice(cursor),offset+cursor));
  return result;
}
export function markdown(source, raw = false) {
  const root = el('div',{class:raw?'prose raw-source':'prose'});
  if (raw) { root.append(el('pre',{},el('span',{'data-source-start':0},source))); return root; }
  const lines = source.match(/[^\n]*\n|[^\n]+$/g) || [];
  let at = 0, i = 0;
  while (i < lines.length) {
    const line = lines[i], trimmed = line.trimEnd();
    if (!trimmed) { at += line.length; i++; continue; }
    if (/^```/.test(trimmed)) {
      at += line.length; i++; let code = '', start = at;
      while(i < lines.length && !/^```/.test(lines[i])) { code+=lines[i];at+=lines[i].length;i++; }
      root.append(el('pre',{class:'code-block'},el('code',{'data-source-start':start},code)));
      if(i < lines.length) { at+=lines[i].length;i++; } continue;
    }
    const heading = /^(#{1,6})\s+/.exec(trimmed), list = /^(?:[-*+] |\d+\. )/.exec(trimmed);
    if (heading) {
      root.append(el('h'+Math.min(heading[1].length+2,6),{},inline(trimmed.slice(heading[0].length),at+heading[0].length)));
      at+=line.length;i++;continue;
    }
    if (list) {
      const listNode=el(/^\d/.test(trimmed)?'ol':'ul');
      while(i<lines.length) { const m=/^(?:[-*+] |\d+\. )/.exec(lines[i]);if(!m)break;listNode.append(el('li',{},inline(lines[i].trimEnd().slice(m[0].length),at+m[0].length)));at+=lines[i].length;i++; }
      root.append(listNode);continue;
    }
    let paragraph='', start=at;
    while(i<lines.length && lines[i].trim() && !/^(?:#{1,6}\s|```|[-*+] |\d+\. )/.test(lines[i])) { paragraph+=lines[i];at+=lines[i].length;i++; }
    root.append(el('p',{},inline(paragraph.trimEnd(),start)));
  }
  return root;
}

export function TaskList({tasks, activeId, decisions, onSelect}) {
  return el('div',{class:'task-list'},tasks.map((task,index)=>{
    const done=decisions[task.id]?.completed;
    return el('button',{type:'button',class:'task-item'+(activeId===task.id?' active':''),
      'aria-current':activeId===task.id?'true':null,onclick:()=>onSelect(task.id)},
      el('span',{class:'task-index'+(done?' done':'')},done?icon('check',14):String(index+1).padStart(2,'0')),
      el('span',{class:'task-copy'},el('span',{class:'task-title'},task.title),el('span',{class:'task-meta'},done?'Reviewed':task.outputs.length===2?'Compare two outputs':'Single output')),
      activeId===task.id?icon('chevron',14):null);
  }));
}

export function RequestStrip({request, context, onOpen}) {
  return el('section',{class:'request-strip','aria-label':'Task request'},
    el('div',{class:'request-label'},icon('file',15),'REQUEST'),
    el('p',{class:'request-excerpt'},request),
    button('View task',onOpen,{class:'button quiet compact',icon:'chevron'}),
    el('span',{class:'context-count'},context.length?`${context.length} context ${context.length===1?'file':'files'}`:'No context files'));
}

export function OutputPane({output, raw, comments, onNote, onRaw, onSelection}) {
  const content=markdown(output.text,raw);
  const pane=el('article',{class:'output-pane','data-output-id':output.id},
    el('header',{class:'output-header'},el('div',{class:'output-name'},el('span',{class:'output-letter'},output.label),el('span',{},output.identity||`Output ${output.label}`),el('span',{class:'word-count'},`${output.words} words`)),
      el('div',{class:'output-tools'},raw?el('a',{class:'button quiet compact',href:'output/'+output.id,download:'Output-'+output.label+'.md'},'Download'):null,button(raw?'Formatted':'Source',onRaw,{class:'button quiet compact','attrs':{'aria-pressed':raw?'true':'false'}}),button(comments?`Notes ${comments}`:'Add note',onNote,{class:'button quiet compact',icon:'note'}))),
    el('div',{class:'output-content',id:'content-'+output.id,tabindex:0},content));
  function capture() {
    const selection=window.getSelection();if(!selection?.rangeCount||selection.isCollapsed)return;
    const range=selection.getRangeAt(0);
    if(!content.contains(range.startContainer)||!content.contains(range.endContainer))return;
    function position(node,offset) {
      const anchor=(node.nodeType===Node.TEXT_NODE?node.parentElement:node).closest('[data-source-start]');
      if(!anchor)return null;
      const r=document.createRange();r.selectNodeContents(anchor);r.setEnd(node,offset);
      return Number(anchor.dataset.sourceStart)+r.toString().length;
    }
    const start=position(range.startContainer,range.startOffset),end=position(range.endContainer,range.endOffset);
    if(start===null||end===null||start>=end)return;
    onSelection({output_id:output.id,label:output.label,scope:'selected_text',start,end,quote:output.text.slice(start,end)});
  }
  content.addEventListener('mouseup',capture);content.addEventListener('keyup',capture);
  return pane;
}

export function dialog(title, content, footer, className='', canClose=()=>true) {
  const d=el('dialog',{class:'dialog '+className,'aria-label':title});
  const close=button('',()=>{if(canClose())d.close();},{class:'button icon-button quiet',icon:'close',attrs:{'aria-label':'Close dialog'}});
  d.append(el('header',{class:'dialog-header'},el('h2',{},title),close),el('div',{class:'dialog-body'},content));
  if(footer)d.append(el('footer',{class:'dialog-footer'},footer));
  d.addEventListener('click',event=>{if(event.target===d&&canClose()){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}});
  d.addEventListener('cancel',event=>{if(!canClose())event.preventDefault();});
  d.addEventListener('close',()=>d.remove());document.body.append(d);d.showModal();return d;
}
