"""Build the self-contained v1/v2 Drafts comparison viewer."""

import html
import json
import re
from pathlib import Path


HERE = Path(__file__).resolve().parent
HOME = HERE.parents[1]
REPO = HERE.parents[2]
V1 = HERE.parent / "voice-trial-2026-09-25"
THEME = (REPO / "plugins/dots/skills/html/assets/theme.css").read_text()
prompts = json.loads((HERE / "prompts.json").read_text())
analysis = json.loads((HERE / "analysis.json").read_text())
baseline = json.loads((V1 / "eval.json").read_text())
base_by_id = {item["id"]: item for item in baseline["drafts"]}


def esc(value):
    return html.escape(str(value), quote=True).replace("&#x27;", "&#39;")


def prose(value):
    value = value.strip()
    if value.startswith("# "):
        value = value.split("\n", 1)[1].lstrip()
    return "".join(f"<p>{esc(part.strip())}</p>" for part in re.split(r"\n\s*\n", value) if part.strip())


def score(value):
    level = "low" if value <= 2 else "mid" if value == 3 else "high"
    return f'<span class="score {level}" aria-label="{value} out of 5">{value}</span>'


def average(values):
    return sum(values) / len(values)


cases = []
for prompt in prompts["cases"]:
    ident = prompt["id"]
    base = base_by_id[ident]
    result = analysis["cases"][ident]
    base_text = (V1 / "drafts" / base["file"]).read_text()
    v2_text = (HERE / "long-v2" / f"{ident}.md").read_text()
    short_v1 = (HERE / "short-v1" / f"{ident}.md").read_text().strip()
    short_v2 = (HERE / "short-v2" / f"{ident}.md").read_text().strip()
    cases.append({**prompt, "base": base, "result": result, "base_text": base_text,
                  "v2_text": v2_text, "short_v1": short_v1, "short_v2": short_v2})

rows = []
long_sections = []
short_sections = []
feedback_sections = []
for item in cases:
    ident = item["id"]
    result = item["result"]
    a1 = average(list(item["base"]["scores"].values()))
    a2 = average(list(result["longScores"].values()))
    delta = a2 - a1
    delta_text = f"{delta:+.1f}" if abs(delta) > 0.001 else "0.0"
    rows.append(f'<tr><th scope="row">{esc(item["domain"])}</th><td>{a1:.1f}</td><td>{a2:.1f}</td><td>{delta_text}</td><td>{esc(result["longVerdict"])}</td></tr>')
    dimension_grid = "".join(
        f'<div><span class="dim-label">{esc(d["short"])}</span><span class="dim-pair">{score(item["base"]["scores"][d["id"]])}<span aria-hidden="true">→</span>{score(result["longScores"][d["id"]])}</span></div>'
        for d in baseline["dimensions"]
    )
    long_sections.append(f'''
      <article class="case" id="long-{esc(ident)}" data-case="{esc(ident)}">
        <div class="case-head"><span class="eyebrow">{esc(item["domain"])} / long form</span><h3>{esc(item["base"]["title"])}</h3></div>
        <p class="prompt"><strong>Prompt</strong> {esc(item["longPrompt"])} <span class="muted">{esc(prompts["sharedLongInstructions"])}</span></p>
        <div class="pair">
          <div class="paper"><div class="version">V1 · original trial · {len(item["base_text"].split())} words</div><div class="draft">{prose(item["base_text"])}</div></div>
          <div class="paper"><div class="version">V2 · Dan reference techniques · {len(item["v2_text"].split())} words</div><div class="draft">{prose(item["v2_text"])}</div></div>
        </div>
        <div class="dimension-grid" aria-label="V1 then V2 scores">{dimension_grid}</div>
        <div class="review"><strong>Editorial read:</strong> {esc(result["longVerdict"])} <span class="muted">{esc(result["longEvidence"])}</span></div>
      </article>''')
    short_sections.append(f'''
      <article class="case" id="short-{esc(ident)}" data-case="{esc(ident)}">
        <div class="case-head"><span class="eyebrow">{esc(item["domain"])} / short form</span><h3>{esc(item["domain"])}</h3></div>
        <p class="prompt"><strong>Prompt</strong> {esc(item["shortPrompt"])} <span class="muted">{esc(prompts["sharedShortInstructions"])}</span></p>
        <div class="pair short-pair">
          <div class="paper"><div class="version">V1 · {len(item["short_v1"])} characters · voice {result["shortScores"]["v1"]}/5</div><p>{esc(item["short_v1"])}</p></div>
          <div class="paper"><div class="version">V2 · {len(item["short_v2"])} characters · voice {result["shortScores"]["v2"]}/5</div><p>{esc(item["short_v2"])}</p></div>
        </div>
        <div class="review"><strong>Editorial read:</strong> {esc(result["shortVerdict"])}</div>
      </article>''')
    feedback_sections.append(f'''
      <fieldset class="feedback-case"><legend>{esc(item["domain"])}</legend>
        <label for="long-choice-{esc(ident)}">Long form: which sounds more like you?</label>
        <select id="long-choice-{esc(ident)}" data-feedback="long-choice" data-case="{esc(ident)}"><option value="">Choose</option><option value="v1">V1</option><option value="v2">V2</option><option value="neither">Neither</option><option value="both">Both</option></select>
        <label for="short-choice-{esc(ident)}">Short form: which sounds more like you?</label>
        <select id="short-choice-{esc(ident)}" data-feedback="short-choice" data-case="{esc(ident)}"><option value="">Choose</option><option value="v1">V1</option><option value="v2">V2</option><option value="neither">Neither</option><option value="both">Both</option></select>
        <label for="note-{esc(ident)}">Sentence to keep, change, or reject</label><textarea id="note-{esc(ident)}" data-feedback="note" data-case="{esc(ident)}"></textarea>
      </fieldset>''')

source_lines = (HOME / "examples" / "dan-shipper-reading-list.md").read_text().splitlines()
sources = []
for line in source_lines:
    match = re.match(r"\d+\. \[(.*?)\]\((.*?)\) — (.*)", line)
    if match:
        title, url, note = match.groups()
        sources.append(f'<li><a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(title)}</a><p>{esc(note)}</p></li>')

page = r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Drafts v1 ↔ v2 writing comparison</title><style>__THEME__</style>
<style>
body { max-width: 1440px; margin:auto; padding:0 clamp(18px,4vw,55px) 80px; }
header { padding:44px 0 24px; border-bottom:1px solid var(--a20); }
h1 { font-size:clamp(2.2rem,5vw,4.2rem); line-height:1.04; letter-spacing:-.045em; margin:8px 0 15px; }
h2 { font-size:clamp(1.55rem,3vw,2rem); letter-spacing:-.025em; }
h3 { margin:5px 0 0; font-size:1.22rem; }
.eyebrow,.version { font:600 .76rem var(--font-mono); text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); }
.lede { max-width:760px; line-height:1.58; font-size:1.08rem; }
.muted,.fine { color:var(--text-muted); }
.fine { font-size:.85rem; }
.nav { position:sticky; top:0; z-index:10; display:flex; gap:8px; flex-wrap:wrap; background:var(--background); border-bottom:1px solid var(--a20); padding:12px 0; }
.nav a { color:var(--foreground); border:1px solid var(--a20); padding:8px 11px; border-radius:6px; text-decoration:none; font-size:.85rem; }
.nav a:hover { border-color:var(--foreground); }
section { scroll-margin-top:86px; margin-top:45px; }
.intro { max-width:850px; color:var(--text-muted); margin-top:0; }
.callout { border-left:3px solid var(--accent); padding:8px 17px; max-width:850px; background:var(--a4); }
.table-wrap { overflow-x:auto; border:1px solid var(--a20); border-radius:6px; }
table { border-collapse:collapse; min-width:790px; width:100%; }
th,td { padding:12px; text-align:left; border-bottom:1px solid var(--a12); vertical-align:top; }
th { background:var(--a4); }
thead th { text-transform:uppercase; font-size:.76rem; letter-spacing:.05em; }
tr:last-child td,tr:last-child th { border-bottom:0; }
.score { display:inline-flex; width:2rem; height:2rem; border:1px solid var(--a40); border-radius:50%; align-items:center; justify-content:center; font-weight:700; }
.score.high { color:var(--accent-deep); border-color:var(--accent); }
.score.mid { color:var(--warning-ink); border-color:var(--warning-line); background:var(--warning-bg); }
.score.low { color:var(--danger-ink); border-color:var(--danger-line); background:var(--danger-bg); }
.case { padding:26px 0 36px; border-top:1px solid var(--a20); scroll-margin-top:90px; }
.case:first-of-type { border-top:0; }
.case-head { margin-bottom:12px; }
.prompt { border-left:3px solid var(--foreground); padding:9px 14px; background:var(--a4); line-height:1.5; max-width:1000px; }
.prompt strong { display:block; text-transform:uppercase; font:.7rem var(--font-mono); letter-spacing:.08em; margin-bottom:5px; }
.pair { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; align-items:start; }
.paper { border:1px solid var(--a20); border-radius:6px; padding:clamp(17px,2vw,26px); }
.draft { line-height:1.7; max-width:680px; }
.draft p { margin:1.05em 0; }
.dimension-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(135px,1fr)); gap:10px; margin-top:12px; }
.dimension-grid>div { border:1px solid var(--a20); padding:9px; border-radius:6px; }
.dim-label { display:block; font-size:.73rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; margin-bottom:7px; }
.dim-pair { display:flex; align-items:center; gap:6px; }
.short-pair .paper p { font-size:1.12rem; line-height:1.5; margin-bottom:0; }
.review { max-width:1000px; margin:14px 0 0; line-height:1.55; }
.toolbar { display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin:18px 0; }
select,button,textarea { font:inherit; border:1px solid var(--a40); border-radius:6px; background:var(--background); color:var(--foreground); }
select,button { padding:9px 12px; }
button { cursor:pointer; }
button:hover,select:hover { border-color:var(--foreground); }
button:focus-visible,select:focus-visible,textarea:focus-visible,a:focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
.guide-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
.guide-grid article { border:1px solid var(--a20); padding:20px; border-radius:6px; }
.guide-grid li { margin:9px 0; }
.sources { columns:2; column-gap:38px; padding-left:22px; }
.sources li { break-inside:avoid; margin-bottom:15px; }
.sources p { margin:4px 0 0; color:var(--text-muted); line-height:1.45; }
.feedback-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:14px; }
.feedback-case { border:1px solid var(--a20); border-radius:6px; padding:17px; }
.feedback-case legend { font-weight:700; padding:0 5px; }
.feedback-case label { display:block; font-size:.88rem; font-weight:600; margin:13px 0 5px; }
textarea { width:100%; min-height:100px; padding:10px; }
.actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:15px; }
footer { margin-top:55px; padding-top:16px; border-top:1px solid var(--a20); color:var(--text-muted); font-size:.83rem; }
@media(max-width:760px){.pair,.guide-grid{grid-template-columns:1fr}.sources{columns:1}.nav{position:static}header{padding-top:25px}}
</style></head><body>
<header><div class="eyebrow">Drafts / voice calibration / September 2026</div><h1>What changed from v1 to v2?</h1>
<p class="lede">The original five drafts stay fixed. New drafts answer the same long prompts using a guide revised after reading 12 Dan Shipper essays. Five paired short posts test whether the change works when there is almost no room.</p>
<p class="fine">V1 is based on your supplied passage. V2 adds techniques from Dan’s articles as an experiment; it does not assume you want to sound exactly like him. Scores are editorial judgments, and your feedback is the final signal.</p></header>
<nav class="nav" aria-label="Page views"><a href="#overview">Overview</a><a href="#long">Long form</a><a href="#short">Short form</a><a href="#guides">Guide changes</a><a href="#sources">12 sources</a><a href="#feedback">Your feedback</a></nav>
<main>
<section id="overview"><h2>Comparison at a glance</h2><p class="intro">The long-form averages use the same five dimensions as the original eval. The old v1 drafts were not regenerated. A higher score means closer to the provisional guide on those dimensions, not confirmed authorship.</p><div class="callout"><strong>Current read:</strong> __SUMMARY__</div><div class="table-wrap"><table><thead><tr><th>Subject</th><th>V1 avg.</th><th>V2 avg.</th><th>Change</th><th>Editorial judgment</th></tr></thead><tbody>__ROWS__</tbody></table></div></section>
<section id="long"><h2>Same prompts, longer pieces</h2><p class="intro">V1 is the original Luna output. V2 uses the new guide. Prompts and length constraints appear above every pair.</p><div class="toolbar"><label for="long-filter">Show subject</label><select id="long-filter"><option value="all">All five</option>__FILTER_OPTIONS__</select></div>__LONG_SECTIONS__</section>
<section id="short"><h2>Short-form trials</h2><p class="intro">Each pair uses the same standalone post prompt. The v1 post was written before that agent opened the v2 guide. The score shown is an editorial voice-fit judgment; each post also needs your verdict.</p><div class="toolbar"><label for="short-filter">Show subject</label><select id="short-filter"><option value="all">All five</option>__FILTER_OPTIONS__</select></div>__SHORT_SECTIONS__</section>
<section id="guides"><h2>The guide change</h2><div class="guide-grid"><article><div class="eyebrow">V1 / source passage</div><h3>Direct and humane</h3><ul><li>Ordinary wants and obstacles carry a larger moral claim.</li><li>Short declarations interrupt longer accumulating sentences.</li><li>One common vision-essay shape: want, friction, cost, possibility.</li><li>Strong claim discipline kept the trial drafts careful.</li></ul><p><a href="../../versions/v1/VOICE.md">V1 voice</a> · <a href="../../versions/v1/STYLE.md">V1 style</a></p></article><article><div class="eyebrow">V2 / external reference</div><h3>More discovery and range</h3><ul><li>Real first-person experiments, candid doubt, and fair opposition can earn a bigger thesis.</li><li>Precise scenes and a little self-awareness can interrupt an abstract argument.</li><li>Several shapes support reflective, explanatory, and product writing.</li><li>Short posts keep one observation and one turn.</li></ul><p><a href="../../versions/v2/VOICE.md">V2 voice</a> · <a href="../../versions/v2/STYLE.md">V2 style</a></p></article></div><h3>Rubric</h3><p class="intro">Long-form dimensions: sentence voice, human grounding, earned movement, restraint, and claim discipline, each scored from 1 to 5. Short-form voice fit is scored from 1 to 5 for clarity, specificity, and a turn that feels earned. No score can establish that a draft truly sounds like you.</p></section>
<section id="sources"><h2>Every articles read</h2><p class="intro">Links point to full articles on Every. The writing home saves reading notes, not article text. These pieces informed the v2 guide as external examples.</p><ol class="sources">__SOURCES__</ol></section>
<section id="feedback"><h2>Your judgment</h2><p class="intro">Choose the better fit for each pair and name a sentence or move you would keep or reject. The form saves locally in your browser and can export JSON; it sends nothing automatically.</p><div class="feedback-grid">__FEEDBACK_SECTIONS__</div><label for="overall"><strong>What should become a durable voice rule?</strong></label><textarea id="overall" data-feedback="overall" placeholder="Tell me what v2 learned, missed, or exaggerated."></textarea><div class="actions"><button type="button" id="download">Download feedback JSON</button><button type="button" id="copy">Copy feedback</button><span id="status" class="fine" role="status"></span></div></section>
</main><footer>Self-contained comparison viewer. Drafts, prompts, scores, guides, and source notes are saved alongside it in the tracked writing home.</footer>
<script>
const key='drafts-voice-comparison-2026-09-25';
let saved={}; try { saved=JSON.parse(localStorage.getItem(key)||'{}'); } catch (_) {}
document.querySelectorAll('[data-feedback]').forEach(el=>{const id=el.dataset.case?`${el.dataset.case}.${el.dataset.feedback}`:el.dataset.feedback; el.value=saved[id]||''; el.addEventListener('input',()=>{saved[id]=el.value;try{localStorage.setItem(key,JSON.stringify(saved));}catch(_){document.querySelector('#status').textContent='Browser storage unavailable; use Download feedback JSON';}});});
for(const kind of ['long','short']){document.querySelector(`#${kind}-filter`).addEventListener('change',e=>{document.querySelectorAll(`#${kind} .case`).forEach(el=>el.hidden=e.target.value!=='all'&&el.dataset.case!==e.target.value);});}
function exportData(){return {schemaVersion:1,eval:'voice-comparison-2026-09-25',feedback:saved};}
document.querySelector('#download').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(exportData(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='drafts-v1-v2-feedback.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(JSON.stringify(exportData(),null,2));document.querySelector('#status').textContent='Feedback copied';}catch(_){document.querySelector('#status').textContent='Clipboard unavailable; use Download feedback JSON';}});
</script></body></html>'''

filters = "".join(f'<option value="{esc(item["id"])}">{esc(item["domain"])}</option>' for item in cases)
page = (page.replace("__THEME__", THEME)
        .replace("__SUMMARY__", esc(analysis["summary"]))
        .replace("__ROWS__", "".join(rows))
        .replace("__FILTER_OPTIONS__", filters)
        .replace("__LONG_SECTIONS__", "".join(long_sections))
        .replace("__SHORT_SECTIONS__", "".join(short_sections))
        .replace("__SOURCES__", "".join(sources))
        .replace("__FEEDBACK_SECTIONS__", "".join(feedback_sections)))
(HERE / "viewer.html").write_text(page)
print(HERE / "viewer.html")
