export const kit = "report";
export const inputs = { pr: "pr-walkthrough.json" };

export default function(h, {pr}) {
  const {page,html,section,walkthrough,review,reviewPoint,disclosure,code,diff,table,callout} = h;
  const p = text => html`<p>${text}</p>`;
  const sourceURL = (file, commit = pr.head) => `https://github.com/rishirsv/dots/blob/${commit}/${file}`;
  const excerpt = key => {
    const e = pr.excerpts[key];
    return [
      html`<p><a href="${sourceURL(e.file)}#L${e.start}-L${e.end}">${e.file.replace('plugins/dots/skills/html/','')} · head lines ${e.start}–${e.end}</a>. Exact excerpt; surrounding source is available at the link.</p>`,
      code(e.source)
    ];
  };
  const patch = file => disclosure(`Full patch: ${file.replace('plugins/dots/skills/html/','')}`, [code(pr.patches[file])]);
  const command = text => html`<pre class="pr-command"><code>${text}</code></pre>`;
  const tileGrid = (after) => html`<div class="pr-tiles ${after ? 'pr-tiles-after' : ''}">${['12 pages','3 sources','5 blocks'].map(value => html`<div>${value}</div>`)}</div>`;

  return page({
    title:"Find a building block. Keep the source.",
    dek:"Dots PR #65 helps HTML authors choose an existing block, carry editable source inside a finished page, and restore that source for another edit.",
    layout:"article", tools:true,
    footer:`Dots PR #65 (${pr.url}), merged September 24, 2026. Historical snapshot: base ${pr.base}; head ${pr.head}. This walkthrough explains that change; it does not report the current branch's behavior.`
  }, [
    html`<style>
      .pr-pair { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
      .pr-pair > div { min-width:0; }
      #coverage td a, #proof td, .sources { overflow-wrap:anywhere; }
      .pr-pair h4 { margin:0 0 12px; font-size:20px; letter-spacing:-.5px; }
      .pr-pair p { margin:12px 0 0; font-size:14px; }
      .pr-command { padding:16px; margin:0; border-radius:var(--r-card); background:var(--code-surface); color:var(--code-ink); font:13px/1.7 var(--font-mono); white-space:pre-wrap; overflow-wrap:anywhere; }
      .pr-bundle { display:grid; gap:8px; margin-block:16px; }
      .pr-bundle > div { border:1px solid var(--a20); padding:16px; border-radius:var(--r-card); }
      .pr-bundle > .pr-portable { border-color:var(--accent); background:var(--a4); }
      .pr-bundle strong { display:block; font-size:20px; letter-spacing:-.6px; }
      .pr-bundle span { display:block; color:var(--text-muted); margin-top:4px; }
      .pr-bundle .pr-arrow { padding:0; border:0; font-size:14px; color:var(--accent-deep); }
      .pr-tiles { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--a20); border:1px solid var(--a20); border-radius:var(--r-card); overflow:hidden; }
      .pr-tiles div { background:var(--background); padding:20px 12px; font-size:22px; font-weight:600; letter-spacing:-.6px; }
      .pr-tiles-after > :last-child { grid-column:span 2; color:var(--accent-deep); background:var(--a4); }
      @media(max-width:640px) { .pr-pair { grid-template-columns:1fr; gap:24px; } }
      @media print { .pr-command { white-space:pre-wrap; } }
    </style>`,
    walkthrough({id:"author-experience",label:"What changes for the author",steps:[
      {title:"Choose a block",body:[
        html`<div class="pr-pair"><div><h4>Before</h4>${command('Open the gallery\nRead helper source\nFind the call signature')}<p>The author finds examples and signatures by reading the existing assets and code.</p></div><div><h4>After</h4>${command('node scripts/catalog.mjs --list\nnode scripts/catalog.mjs --help code')}<p>The author can ask for a helper's signature, rules, and maintained example.</p></div></div>`,
        p("This schematic summarizes the source and instruction changes. It is not a captured terminal session.")
      ]},
      {title:"Restore source",body:[
        html`<div class="pr-bundle"><div><strong>Editable page files</strong><span>A page module and its declared text inputs.</span></div><div class="pr-arrow">↓ Build with --embed-source</div><div class="pr-portable"><strong>One portable HTML file</strong><span>The rendered page plus a text copy of those source files.</span></div><div class="pr-arrow">↓ Extract to a new folder</div><div><strong>Editable files again</strong><span>Inspect the restored module, then build it when you trust the code.</span></div></div>`,
        p("Without --embed-source, the finished page contains no recoverable source payload. Extraction writes text; a later build executes the module.")
      ]},
      {title:"Fill the last row",body:[
        html`<div class="pr-pair"><div><h4>Before</h4>${tileGrid(false)}<p>The third stat occupies half of the last row.</p></div><div><h4>After</h4>${tileGrid(true)}<p>The third stat fills the row at mobile widths.</p></div></div>`,
        p("Illustration of the CSS change at widths up to 620px. Values are sample content; these are not observed page screenshots. Desktop columns also adjust to two, three, or five tiles.")
      ]}
    ]}),
    callout.note("Extraction leaves time to inspect the code.","Restoring text does not run the page module. Building the restored module does. A matching kit version establishes compatibility, not trust in the code."),
    review({id:"pr65",title:"Dots PR #65 — helper discovery and source restoration",revision:`${pr.url}; base ${pr.base}; head ${pr.head}`,kind:"pull-request"}, [
      section("mechanism","How the change produces the result",[
        reviewPoint({id:"discovery",title:"Helper examples drive discovery and galleries",summary:"The author can find a block without scanning the whole gallery. The gallery can be checked against the same maintained examples."},[
          p("The new catalog command reads the helper metadata. Its list and help routes expose signatures and examples. Its write and check routes generate gallery sections from those examples and detect stale output. The retained templates supply the authored page layout. Helper metadata clarifies required chart sources and other rules. The atlas starts helper-generated diagram IDs at 1000 to keep them distinct from the earlier gallery diagrams."),
          disclosure("The exact list and help routes",excerpt("catalog")),
          patch('plugins/dots/skills/html/scripts/catalog.mjs'),
          disclosure("Proof that changed examples are detected",[p("The catalog test changes a helper example, expects the gallery check to fail, writes fresh output, and expects the check to pass. It also detects a stale copied theme."),code(pr.patches['plugins/dots/skills/html/scripts/catalog.test.mjs'])])
        ]),
        reviewPoint({id:"restoration",title:"A finished page can carry its editable source",summary:"Source embedding is opt-in. Extraction validates the destination and writes files; a later build imports and executes the module."},[
          p("The build records the module text, declared text inputs, and kit version in an inert JSON script tag. Extraction rejects an existing destination, duplicate paths, and paths outside the target before creating the folder. The version record lets a later build reject an incompatible kit."),
          disclosure("How source is embedded and restored",[
            p("Embedding escapes less-than characters so source containing a closing script tag cannot end the JSON tag early."),...excerpt("embed"),
            p("The first loop validates all destination paths. The second loop writes the restored text files."),...excerpt("extract"),
            p("Building is the execution boundary: the module is imported after the initial major-version guard. That guard does not inspect whether the code is trustworthy."),...excerpt("build")
          ]),
          patch('plugins/dots/skills/html/scripts/build.mjs'),
          disclosure("What the restoration tests establish",[p("The tests build with embedded source, extract and rebuild it, preserve text containing a closing script tag, and reject a path that escapes the target folder. They also check that an incompatible major version fails before the extracted module executes."),code(pr.patches['plugins/dots/skills/html/scripts/build.test.mjs'])])
        ]),
        reviewPoint({id:"tile-layout",title:"An odd final stat fills the mobile row",summary:"The CSS gives the last tile two columns when the tile count is odd. Desktop columns match supported tile counts."},[
          disclosure("The exact CSS change",[
            diff({title:"stat-tiles.html · deletion: base line 26; additions: head lines 26–32",lines:[
              ['-', pr.excerpts.tilesBefore.source,pr.excerpts.tilesBefore.start],
              ...pr.excerpts.tiles.source.split('\n').map((text,i)=>['+',text,26+i])
            ],note:"The final mobile tile spans both columns when the count is odd. The source links preserve the original line numbers."}),
            html`<p><a href="${sourceURL(pr.excerpts.tiles.file,pr.base)}#L26">Base line 26</a> · <a href="${sourceURL(pr.excerpts.tiles.file)}#L26-L32">Head lines 26–32</a></p>`,
          ]),
          patch(pr.excerpts.tiles.file)
        ])
      ]),
      section("coverage","Where all 13 files fit",[
        p("The main explanation covers discovery, restoration, and layout. These supporting files carry the instructions, proof, authored gallery layouts, and generated output. No file is omitted from the inventory."),
        table({columns:['File at the PR head','Role in this change'],stacked:true,rows:pr.files.map(file=>[
          html`<a href="${sourceURL(file.path)}">${file.path.replace('plugins/dots/skills/html/','')}</a>`,file.role
        ])}),
        html`<p><a href="https://github.com/rishirsv/dots/compare/${pr.base}...${pr.head}">Complete change at the inspected commits</a>. The API omitted the large atlas-template patch; the walkthrough inspection recovered it from this Git commit range. The two templates are authored source, even though their HTML output is generated.</p>`
      ]),
      section("proof","What was checked",[
        table({columns:['Evidence','Result and limit'],stacked:true,rows:[
          ['PR author’s report','59 HTML tests and the Python suites passed. This is the author’s report in the PR description.'],
          ['Fresh check of the archived PR head','Ran node --test plugins/dots/skills/html/scripts/*.test.mjs in an isolated export of the head commit. All 59 HTML tests passed. This includes source round trips, path rejection, discovery, and gallery freshness.'],
          ['Visual explanation','The stat-grid comparison above is a code-derived illustration. The historical gallery was not visually inspected in this walkthrough.']
        ]}),
        p("Review the places where the result depends on a boundary: source remains optional, all extraction paths must validate before writes, and restored code needs inspection before a build. Comments below each behavior stay local until you export one response. Completing this walkthrough does not approve or submit a review of the PR.")
      ])
    ])
  ]);
}
