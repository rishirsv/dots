"""Build a self-contained local review page from the trial drafts and eval.json."""

import html
import json
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
THEME = (REPO / "plugins/dots/skills/html/assets/theme.css").read_text()
data = json.loads((HERE / "eval.json").read_text())
data["source"] = (HERE.parents[1] / "examples" / "agency-passage.md").read_text().split("\n\n", 2)[2]
for item in data["drafts"]:
    item["text"] = (HERE / "drafts" / item["file"]).read_text().strip()
    item["words"] = len(item["text"].split())

payload = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
title = html.escape(data["title"])


def safe(value):
    return html.escape(str(value), quote=True).replace("&#x27;", "&#39;")


def score_badge(value):
    level = "low" if value <= 2 else "mid" if value == 3 else "high"
    return f'<span class="score {level}" aria-label="{value} out of 5">{value}</span>'


head = "".join(f'<th title="{safe(d["description"])}">{safe(d["short"])}</th>' for d in data["dimensions"])
rows = []
for item in data["drafts"]:
    values = [item["scores"][d["id"]] for d in data["dimensions"]]
    cells = "".join(f"<td>{score_badge(value)}</td>" for value in values)
    rows.append(f'<tr><td>{safe(item["domain"])}</td>{cells}<td><strong>{sum(values) / len(values):.1f}</strong></td></tr>')
overview_table = f'<table><thead><tr><th>Subject</th>{head}<th>Average</th></tr></thead><tbody>{"".join(rows)}</tbody></table>'
overview_cards = "".join(
    f'<article class="card"><span class="label">{safe(item["domain"])}</span><h3>{safe(item["title"])}</h3>'
    f'<p><strong>Closest match</strong><br>{safe(item["strength"])}</p>'
    f'<p><strong>Possible drift</strong><br>{safe(item["drift"])}</p></article>'
    for item in data["drafts"]
)


def paragraphs(value):
    parts = []
    for paragraph in value.strip().split("\n\n"):
        if paragraph.startswith("# "):
            parts.append(f"<h4>{safe(paragraph[2:])}</h4>")
        else:
            parts.append(f"<p>{safe(paragraph)}</p>")
    return "".join(parts)


def paper(item, notes=True):
    result = (f'<article class="paper"><span class="label">{safe(item["domain"])} · {item["words"]} words</span>'
              f'<h3>{safe(item["title"])}</h3><div class="draft-text">{paragraphs(item["text"])}</div>')
    if notes:
        result += (f'<div class="note"><strong>Closest match:</strong> {safe(item["strength"])}</div>'
                   f'<div class="note"><strong>Possible drift:</strong> {safe(item["drift"])}</div>')
    return result + "</article>"


select_options = "".join(f'<option value="{safe(item["id"])}">{safe(item["domain"])} — {safe(item["title"])}</option>' for item in data["drafts"])
right_options = select_options.replace('<option value="bakery">', '<option value="bakery" selected>')
static_pair = paper(data["drafts"][0], False) + paper(data["drafts"][1], False)
static_read = paper(data["drafts"][0])
static_rubric = "".join(f'<div><span class="label">0{i} / {safe(d["short"])}</span><p>{safe(d["description"])}</p></div>' for i, d in enumerate(data["dimensions"], 1))
static_hypotheses = "".join(f"<p>{safe(item)}</p>" for item in data["hypotheses"])
static_feedback = "".join(
    f'<div class="feedback-card"><h3>{safe(item["domain"])}</h3>'
    f'<label for="rating-{safe(item["id"])}">Sounds like me</label><select id="rating-{safe(item["id"])}" data-field="rating" data-id="{safe(item["id"])}"><option value="">Choose a rating</option>'
    + "".join(f'<option value="{n}">{n} / 5</option>' for n in range(1, 6))
    + f'</select><label for="keep-{safe(item["id"])}">Keep this sentence or move</label><textarea id="keep-{safe(item["id"])}" data-field="keep" data-id="{safe(item["id"])}"></textarea>'
    f'<label for="change-{safe(item["id"])}">Change this sentence or move</label><textarea id="change-{safe(item["id"])}" data-field="change" data-id="{safe(item["id"])}"></textarea></div>'
    for item in data["drafts"]
)

page = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>__THEME__</style>
<style>
  body { max-width: 1440px; margin: auto; padding: 0 clamp(18px, 4vw, 56px) 80px; }
  header { padding: 44px 0 22px; border-bottom: 1px solid var(--a20); }
  .eyebrow { font: 600 12px var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--text-muted); }
  h1 { font-size: clamp(2rem, 5vw, 4rem); line-height: 1.05; letter-spacing: -.04em; margin: 10px 0 16px; }
  .lede { max-width: 760px; font-size: 1.08rem; line-height: 1.6; margin: 0; }
  .meta { margin-top: 18px; color: var(--text-muted); font-size: .88rem; }
  .tabs { display:flex; flex-wrap:wrap; gap: 8px; margin: 25px 0; border-bottom: 1px solid var(--a20); padding-bottom: 11px; }
  button, select, textarea, input { font: inherit; }
  button, select { border: 1px solid var(--a20); border-radius: 6px; background: var(--background); color: var(--foreground); padding: 9px 12px; cursor: pointer; }
  button:hover, select:hover { border-color: var(--foreground); }
  button:focus-visible, select:focus-visible, textarea:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .tabs button[aria-selected="true"] { background: var(--foreground); color: var(--background); }
  [hidden] { display: none !important; }
  .view h2 { font-size: 1.65rem; margin: 0 0 10px; }
  .intro { color: var(--text-muted); max-width: 780px; margin: 0 0 24px; }
  .table-wrap { overflow-x: auto; border: 1px solid var(--a20); border-radius: 6px; }
  table { border-collapse: collapse; width: 100%; min-width: 760px; }
  th, td { padding: 13px 11px; border-bottom: 1px solid var(--a12); text-align: left; vertical-align: top; }
  th { font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; background: var(--a4); }
  tr:last-child td { border-bottom: 0; }
  td:first-child { font-weight: 650; }
  .score { display: inline-flex; width: 2.1rem; height: 2.1rem; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid var(--a40); font-weight: 700; }
  .score.low { border-color: var(--danger-line); color: var(--danger-ink); background: var(--danger-bg); }
  .score.mid { border-color: var(--warning-line); color: var(--warning-ink); background: var(--warning-bg); }
  .score.high { border-color: var(--accent); color: var(--accent-deep); background: var(--a4); }
  .cards { display:grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 14px; }
  .card, .paper { border: 1px solid var(--a20); border-radius: 6px; padding: 21px; background: var(--background); }
  .card h3, .paper h3 { margin: 0 0 8px; font-size: 1.15rem; }
  .card p { margin: 9px 0; }
  .label { display: block; font: 600 11px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
  .muted { color: var(--text-muted); }
  .controls { display:flex; flex-wrap: wrap; gap: 12px; align-items: end; margin: 0 0 18px; }
  .controls label { display:grid; gap: 5px; font-size: .84rem; font-weight: 600; }
  .pair { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items:start; }
  .draft-text { max-width: 690px; line-height: 1.72; font-size: 1rem; }
  .draft-text p { margin: 0 0 1.12em; }
  .draft-text h4 { margin: 0 0 1em; }
  .note { border-left: 3px solid var(--accent); padding-left: 12px; margin: 14px 0; }
  .rubric { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
  .rubric div { border-top: 2px solid var(--foreground); padding-top: 10px; }
  .feedback-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }
  .feedback-card { border: 1px solid var(--a20); padding: 18px; border-radius: 6px; }
  .feedback-card h3 { margin-top: 0; }
  .feedback-card label { display:block; margin: 12px 0 5px; font-weight: 600; font-size: .9rem; }
  textarea { width: 100%; min-height: 95px; padding: 10px; border: 1px solid var(--a40); border-radius: 6px; background: var(--background); color: var(--foreground); }
  .actions { display:flex; flex-wrap:wrap; gap: 10px; align-items:center; margin-top: 18px; }
  .fine { font-size: .82rem; color: var(--text-muted); }
  footer { border-top: 1px solid var(--a20); margin-top: 60px; padding-top: 16px; font-size: .82rem; color: var(--text-muted); }
  @media (max-width: 760px) { .pair { grid-template-columns: 1fr; } header { padding-top: 25px; } }
</style>
</head>
<body>
<header>
  <div class="eyebrow">Drafts / voice calibration / September 2026</div>
  <h1>Five drafts, one provisional voice</h1>
  <p class="lede">A side-by-side trial of a writing guide inferred from one passage. Compare the prose, inspect the editorial notes, and mark what actually sounds like you.</p>
  <div class="meta">Five Luna drafts · five exploratory subjects · one shared voice guide · all feedback stays in this browser until you export it</div>
</header>
<nav class="tabs" aria-label="Viewer sections">
  <button type="button" data-view="overview" aria-selected="true">Overview</button>
  <button type="button" data-view="compare" aria-selected="false">Compare two</button>
  <button type="button" data-view="read" aria-selected="false">Read drafts</button>
  <button type="button" data-view="method" aria-selected="false">Rubric & profile</button>
  <button type="button" data-view="feedback" aria-selected="false">Your feedback</button>
</nav>
<main>
  <section id="overview" class="view"><h2>Where the profile worked</h2><p class="intro">Scores are provisional editorial judgments on a five-point scale. Read the drafts before deciding which choices feel like yours.</p><div id="matrix" class="table-wrap">__OVERVIEW_TABLE__</div><div id="summary" class="cards" style="margin-top:18px">__OVERVIEW_CARDS__</div></section>
  <section id="compare" class="view" hidden><h2>Compare two drafts</h2><p class="intro">Pick any two topics. The full drafts remain visible at the same time for a direct voice comparison.</p><div class="controls"><label>Left draft<select id="left-select">__SELECT_OPTIONS__</select></label><label>Right draft<select id="right-select">__RIGHT_OPTIONS__</select></label></div><div id="pair" class="pair">__PAIR__</div></section>
  <section id="read" class="view" hidden><h2>Read one draft</h2><p class="intro">Use the notes after each piece to find a specific sentence or move to keep or change.</p><div class="controls"><label>Draft<select id="read-select">__SELECT_OPTIONS__</select></label></div><div id="reading">__READ__</div></section>
  <section id="method" class="view" hidden><h2>What this trial tests</h2><p class="intro">The guide is drawn from one supplied sample. Its topic and emotional register may not transfer to every kind of writing.</p><div id="rubric" class="rubric">__RUBRIC__</div><h3>Profile hypotheses</h3><div id="hypotheses" class="paper">__HYPOTHESES__</div><h3>Source passage</h3><details><summary>Read the passage used to build the guide</summary><div id="source" class="paper draft-text">__SOURCE__</div></details></section>
  <section id="feedback" class="view" hidden><h2>Tell Drafts what fits</h2><p class="intro">Rate how much each draft sounds like you, then name a sentence to keep or change. These ratings are separate from the editorial scores.</p><div id="feedback-cards" class="feedback-grid">__FEEDBACK__</div><div class="feedback-card" style="margin-top:14px"><label for="overall">What should change in the voice guide?</label><textarea id="overall" placeholder="For example: more urgency, less advice, fewer careful qualifiers..."></textarea></div><div class="actions"><button type="button" id="download">Download feedback JSON</button><button type="button" id="copy">Copy feedback</button><span id="save-status" class="fine" role="status"></span></div></section>
</main>
<footer>Local, self-contained review page. The source guides, drafts, rubric, and builder live beside this file in the writing home.</footer>
<script>const DATA = __PAYLOAD__;</script>
<script>
const $ = (s) => document.querySelector(s);
const dims = DATA.dimensions;
const drafts = DATA.drafts;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function paragraphs(s) { return s.trim().split(/\n\s*\n/).map(p => p.startsWith('# ') ? `<h4>${esc(p.slice(2))}</h4>` : `<p>${esc(p)}</p>`).join(''); }
function score(n) { return `<span class="score ${n <= 2 ? 'low' : n == 3 ? 'mid' : 'high'}" aria-label="${n} out of 5">${n}</span>`; }
function paper(d, notes=true) { return `<article class="paper"><span class="label">${esc(d.domain)} · ${d.words} words</span><h3>${esc(d.title)}</h3><div class="draft-text">${paragraphs(d.text)}</div>${notes ? `<div class="note"><strong>Closest match:</strong> ${esc(d.strength)}</div><div class="note"><strong>Possible drift:</strong> ${esc(d.drift)}</div>` : ''}</article>`; }
function renderOverview() {
  $('#matrix').innerHTML = `<table><thead><tr><th>Subject</th>${dims.map(d=>`<th title="${esc(d.description)}">${esc(d.short)}</th>`).join('')}<th>Average</th></tr></thead><tbody>${drafts.map(d=>{const vals=dims.map(x=>d.scores[x.id]); const avg=(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1); return `<tr><td>${esc(d.domain)}</td>${vals.map(score).map(x=>`<td>${x}</td>`).join('')}<td><strong>${avg}</strong></td></tr>`}).join('')}</tbody></table>`;
  $('#summary').innerHTML = drafts.map(d=>`<article class="card"><span class="label">${esc(d.domain)}</span><h3>${esc(d.title)}</h3><p><strong>Closest match</strong><br>${esc(d.strength)}</p><p><strong>Possible drift</strong><br>${esc(d.drift)}</p></article>`).join('');
}
function fillSelect(el) { el.innerHTML=drafts.map(d=>`<option value="${esc(d.id)}">${esc(d.domain)} — ${esc(d.title)}</option>`).join(''); }
function selected(id) { return drafts.find(d=>d.id===id) || drafts[0]; }
function renderPair() { $('#pair').innerHTML=paper(selected($('#left-select').value),false)+paper(selected($('#right-select').value),false); }
function renderRead() { $('#reading').innerHTML=paper(selected($('#read-select').value)); }
function renderMethod() { $('#rubric').innerHTML=dims.map((d,i)=>`<div><span class="label">0${i+1} / ${esc(d.short)}</span><p>${esc(d.description)}</p></div>`).join(''); $('#hypotheses').innerHTML=DATA.hypotheses.map(x=>`<p>${esc(x)}</p>`).join(''); $('#source').innerHTML=paragraphs(DATA.source); }
let feedback = {};
try { feedback=JSON.parse(localStorage.getItem('drafts-voice-trial-2026-09-25') || '{}'); } catch (_) {}
function renderFeedback() { $('#feedback-cards').innerHTML=drafts.map(d=>`<div class="feedback-card"><h3>${esc(d.domain)}</h3><label for="rating-${esc(d.id)}">Sounds like me</label><select id="rating-${esc(d.id)}" data-field="rating" data-id="${esc(d.id)}"><option value="">Choose a rating</option>${[1,2,3,4,5].map(n=>`<option value="${n}">${n} / 5</option>`).join('')}</select><label for="keep-${esc(d.id)}">Keep this sentence or move</label><textarea id="keep-${esc(d.id)}" data-field="keep" data-id="${esc(d.id)}"></textarea><label for="change-${esc(d.id)}">Change this sentence or move</label><textarea id="change-${esc(d.id)}" data-field="change" data-id="${esc(d.id)}"></textarea></div>`).join(''); document.querySelectorAll('[data-field]').forEach(el=>{el.value=feedback[el.dataset.id]?.[el.dataset.field] || '';}); $('#overall').value=feedback.overall || ''; }
function collect() { const out={schemaVersion:1,trial:'voice-trial-2026-09-25',drafts:{},overall:$('#overall').value}; drafts.forEach(d=>out.drafts[d.id]={rating:$(`#rating-${d.id}`).value,keep:$(`#keep-${d.id}`).value,change:$(`#change-${d.id}`).value}); return out; }
function save() { feedback={overall:$('#overall').value}; drafts.forEach(d=>feedback[d.id]={rating:$(`#rating-${d.id}`).value,keep:$(`#keep-${d.id}`).value,change:$(`#change-${d.id}`).value}); try {localStorage.setItem('drafts-voice-trial-2026-09-25',JSON.stringify(feedback)); $('#save-status').textContent='Saved in this browser';} catch (_) {$('#save-status').textContent='Browser storage unavailable; download feedback to keep it';} }
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));document.querySelectorAll('.view').forEach(x=>x.hidden=x.id!==b.dataset.view); }));
fillSelect($('#left-select')); fillSelect($('#right-select')); fillSelect($('#read-select'));
$('#right-select').selectedIndex=1; $('#left-select').addEventListener('change',renderPair); $('#right-select').addEventListener('change',renderPair); $('#read-select').addEventListener('change',renderRead);
$('#feedback').addEventListener('input',save); $('#feedback').addEventListener('change',save);
$('#download').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(collect(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='drafts-voice-feedback.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
$('#copy').addEventListener('click',async()=>{try {await navigator.clipboard.writeText(JSON.stringify(collect(),null,2));$('#save-status').textContent='Feedback copied';} catch (_) {$('#save-status').textContent='Clipboard unavailable; use Download feedback JSON';}});
renderOverview(); renderPair(); renderRead(); renderMethod(); renderFeedback();
</script>
</body></html>"""

page = (page.replace("__TITLE__", title).replace("__THEME__", THEME)
        .replace("__OVERVIEW_TABLE__", overview_table)
        .replace("__OVERVIEW_CARDS__", overview_cards)
        .replace("__SELECT_OPTIONS__", select_options)
        .replace("__RIGHT_OPTIONS__", right_options)
        .replace("__PAIR__", static_pair)
        .replace("__READ__", static_read)
        .replace("__RUBRIC__", static_rubric)
        .replace("__HYPOTHESES__", static_hypotheses)
        .replace("__SOURCE__", paragraphs(data["source"]))
        .replace("__FEEDBACK__", static_feedback)
        .replace("__PAYLOAD__", payload))
(HERE / "viewer.html").write_text(page)
print(HERE / "viewer.html")
