// Autoresearch Run Review — run detail page renderer.

(function () {
  "use strict";
  var ui = window.RunReviewUI;
  var run = window.__RUN_REVIEW_RUN__;
  if (!run) return;

  var state = {
    scenarioIdx: 0,
    logFilter: { agent: true, cmd: true, file: true, turn: true, error: true },
    logQuery: "",
  };

  function el(id) { return document.getElementById(id); }

  // ----- Run header -----
  function renderHeader() {
    el("run-title").textContent = run.title || run.runId;
    el("run-id").textContent = run.runId;
    el("run-skill").innerHTML = "<strong>" + ui.escape(run.skill) + "</strong>";
    el("run-created").innerHTML = "<strong>" + ui.fmtDate(run.createdAt) + "</strong>";
    el("run-model").innerHTML = "<strong>" + ui.escape(run.model || "—") + "</strong>";
    el("run-status").innerHTML = ui.statusPill(run.outcome || "completed");

    var scen = (run.completedScenarios || 0) + "/" + (run.scenarioCount || 0) + " pass";
    if (run.failedScenarios) scen += "  · " + run.failedScenarios + " fail";
    el("run-scenarios").innerHTML = "<strong>" + ui.escape(scen) + "</strong>";

    var links = [];
    if (run.benchmarkJsonHref) {
      links.push('<a href="' + run.benchmarkJsonHref + '" target="_blank" rel="noopener">Open raw benchmark JSON</a>');
    }
    if (run.usageLogHref) {
      links.push('<a href="' + run.usageLogHref + '" target="_blank" rel="noopener">Open observed usage</a>');
    }
    el("run-links").innerHTML = links.join("");
  }

  // ----- Outcome snapshot -----
  function renderOutcome() {
    var sc = run.scenarios || [];
    var pass = 0, fail = 0, partial = 0;
    sc.forEach(function (s) {
      var status = (s.status || "").toLowerCase();
      var vpass = (s.verifierResults || []).every(function (v) { return v.status === "passed"; });
      if (status === "completed" && vpass) pass++;
      else if (status === "failed" || !vpass) fail++;
      else partial++;
    });
    var total = sc.length || 1;

    el("outcome-lede").textContent = run.outcomeLede || run.outcomeSummary || "";

    el("stat-passfail").innerHTML =
      '<div class="value">' + pass + "<span class=\"sub\">/ " + total + " scenarios</span></div>" +
      '<div class="pass-bar">' +
      '<div class="pass" style="width:' + (100 * pass / total) + '%"></div>' +
      '<div class="warn" style="width:' + (100 * partial / total) + '%"></div>' +
      '<div class="fail" style="width:' + (100 * fail / total) + '%"></div>' +
      "</div>";

    el("stat-tokens").innerHTML = '<div class="value">' + ui.fmtInt(run.avgTotalTokens) +
      '<span class="sub">avg total</span></div>';
    el("stat-files").innerHTML = '<div class="value">' + ui.fmtInt(run.generatedFileCount) +
      '<span class="sub">files</span></div>';
    el("stat-verifier").innerHTML = '<div class="value">' +
      (run.verifierPassCount || 0) + "/" + ((run.verifierPassCount || 0) + (run.verifierFailCount || 0)) +
      '<span class="sub">verifier pass</span></div>';
  }

  // ----- Scenario strip -----
  function renderScenarioStrip() {
    var html = (run.scenarios || []).map(function (s, idx) {
      var status = s.status || "completed";
      var vpass = (s.verifierResults || []).every(function (v) { return v.status === "passed"; });
      var renderStatus = !vpass ? "failed" : status;
      var sel = idx === state.scenarioIdx ? "true" : "false";
      var tokens = s.usage && s.usage.total_tokens ? ui.fmtInt(s.usage.total_tokens) : "—";
      return (
        '<button class="scenario-chip" role="tab" aria-selected="' + sel +
          '" data-idx="' + idx + '">' +
          '<div class="idx">SCENARIO ' + String(idx + 1).padStart(2, "0") + "</div>" +
          '<div class="chip-title">' + ui.escape(s.title || s.id) + "</div>" +
          '<div class="chip-meta">' +
            ui.statusPill(renderStatus) +
            '<span>' + ui.fmtDuration(s.durationMs) + "</span>" +
            '<span>' + tokens + " tok</span>" +
          "</div>" +
        "</button>"
      );
    }).join("");
    el("scenario-strip").innerHTML = html;
    el("scenario-strip").querySelectorAll(".scenario-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var idx = parseInt(chip.getAttribute("data-idx"), 10);
        if (!isNaN(idx)) selectScenario(idx);
      });
    });
    // Keyboard nav
    el("scenario-strip").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var delta = e.key === "ArrowRight" ? 1 : -1;
      var n = (run.scenarios || []).length;
      var next = (state.scenarioIdx + delta + n) % n;
      selectScenario(next);
    });
  }

  function selectScenario(idx) {
    state.scenarioIdx = idx;
    renderScenarioStrip();
    renderScenarioBody();
    renderArtifacts();
    renderFileChanges();
    renderTimeline();
    renderAdapterPanels();
    var anchor = (run.scenarios[idx] && run.scenarios[idx].id) || "scenario";
    if (history && history.replaceState) {
      history.replaceState(null, "", "#" + anchor);
    }
  }

  // ----- Selected scenario story -----
  function renderScenarioBody() {
    var s = run.scenarios[state.scenarioIdx];
    if (!s) return;
    var vpass = (s.verifierResults || []).every(function (v) { return v.status === "passed"; });

    var html = "";
    html += '<div class="story-block"><h3>Purpose</h3><div class="body">' +
      ui.escape(s.purpose || "—") + "</div></div>";

    html += '<div class="story-block"><h3>Prompt ' +
      ui.copyButton(s.prompt || "", "Copy prompt") + "</h3>" +
      "<pre>" + ui.escape(s.prompt || "") + "</pre></div>";

    if (s.successChecklist && s.successChecklist.length) {
      html += '<div class="story-block"><h3>Success checklist</h3><ul class="checklist">' +
        s.successChecklist.map(function (c) {
          return '<li><span class="glyph">—</span>' + ui.escape(c) + "</li>";
        }).join("") + "</ul></div>";
    }

    html += '<div class="story-block"><h3>Final message ' +
      ui.copyButton(s.finalMessagePreview || "", "Copy") + "</h3>" +
      '<div class="md">' + ui.renderMarkdown(s.finalMessagePreview || "") + "</div></div>";

    html += '<div class="story-block"><h3>Verifier</h3>' + renderVerifiers(s.verifierResults) + "</div>";

    // kv block: usage / duration
    html += '<div class="story-block"><h3>Metrics</h3>' +
      kv("Status", ui.statusPill(vpass && s.status === "completed" ? "completed" : "failed")) +
      kv("Duration", ui.fmtDuration(s.durationMs)) +
      kv("Input tokens", ui.fmtInt(s.usage && s.usage.input_tokens)) +
      kv("Output tokens", ui.fmtInt(s.usage && s.usage.output_tokens)) +
      kv("Total tokens", ui.fmtInt(s.usage && s.usage.total_tokens)) +
      kv("Event count", ui.fmtInt(s.telemetry && s.telemetry.eventCount)) +
      "</div>";

    el("scenario-body").innerHTML = html;
    ui.bindCopyButtons(el("scenario-body"));
  }

  function kv(k, v) {
    return '<div class="kv-row"><div class="k">' + ui.escape(k) + '</div><div class="v">' + v + "</div></div>";
  }

  function renderVerifiers(results) {
    if (!results || !results.length) {
      return '<div class="muted">No verifier ran.</div>';
    }
    return results.map(function (v, idx) {
      var status = v.status || (v.exitCode === 0 ? "passed" : "failed");
      var html = '<div class="artifact">' +
        '<div class="artifact-head">' +
          '<div class="name">Verifier ' + (idx + 1) +
            '<span class="role">' + ui.escape(v.command || "") + "</span></div>" +
          '<div class="actions">' + ui.statusPill(status) + "</div>" +
        "</div>";
      if (v.stdoutPreview) {
        html += '<div class="artifact-body"><pre>' + ui.escape(v.stdoutPreview) + "</pre></div>";
      }
      if (v.stderrPreview) {
        html += '<div class="artifact-body"><div class="muted" style="margin-bottom:6px;font-family:var(--mono);font-size:11px">stderr</div>' +
          "<pre>" + ui.escape(v.stderrPreview) + "</pre></div>";
      }
      html += "</div>";
      return html;
    }).join("");
  }

  // ----- Artifacts -----
  function renderArtifacts() {
    var s = run.scenarios[state.scenarioIdx];
    if (!s) return;
    var arts = s.artifacts || [];
    if (!arts.length) {
      el("artifacts").innerHTML = '<div class="muted">No copied artifacts for this scenario.</div>';
      return;
    }
    el("artifacts").innerHTML = arts.map(renderArtifact).join("");
    ui.bindCopyButtons(el("artifacts"));
  }

  function renderArtifact(a) {
    var body;
    if (a.kind === "diff") {
      body = ui.renderDiff(a.content, { title: a.displayName, path: a.sourcePath });
    } else if (a.kind === "markdown") {
      body = '<div class="md">' + ui.renderMarkdown(a.content || "") + "</div>";
    } else if (a.kind === "json") {
      var pretty = a.content;
      try {
        pretty = JSON.stringify(JSON.parse(a.content), null, 2);
      } catch (e) { /* leave as-is */ }
      body = "<pre>" + ui.escape(pretty) + "</pre>";
    } else {
      body = "<pre>" + ui.escape(a.content || "") + "</pre>";
    }
    var actions = [];
    if (a.href) actions.push('<a href="' + a.href + '" target="_blank" rel="noopener">Open raw</a>');
    actions.push(ui.copyButton(a.content || "", "Copy"));
    return (
      '<div class="artifact">' +
        '<div class="artifact-head">' +
          '<div class="name">' + ui.escape(a.displayName || "Artifact") +
            (a.role ? '<span class="role">' + ui.escape(a.role) + "</span>" : "") +
          "</div>" +
          '<div class="actions">' + actions.join("") + "</div>" +
        "</div>" +
        '<div class="artifact-body">' + body + "</div>" +
      "</div>"
    );
  }

  // ----- File changes -----
  function renderFileChanges() {
    var s = run.scenarios[state.scenarioIdx];
    if (!s) return;
    var changes = s.workspaceChanges || [];
    if (!changes.length) {
      el("files").innerHTML = '<div class="muted">No workspace changes recorded.</div>';
      return;
    }
    var rows = changes.map(function (c) {
      var delta = c.lineDelta === null || c.lineDelta === undefined ? "" : (c.lineDelta > 0 ? "+" : "") + c.lineDelta;
      var tag = classifyPath(c.path);
      return (
        '<div class="row">' +
          '<div class="status">' + ui.escape(c.status || "") + "</div>" +
          '<div class="path">' + ui.escape(c.path) + "</div>" +
          '<div class="delta">' + delta + "</div>" +
          '<div class="tag ' + tag.css + '">' + tag.label + "</div>" +
        "</div>"
      );
    }).join("");
    el("files").innerHTML = '<div class="file-list">' + rows + "</div>";
  }

  function classifyPath(p) {
    if (!p) return { label: "", css: "" };
    if (/\.autoresearch\//.test(p)) return { label: "Eval", css: "eval" };
    if (/SKILL\.md$/.test(p)) return { label: "Target", css: "target" };
    if (/^out\//.test(p) || /\/out\//.test(p)) return { label: "Output", css: "output" };
    return { label: "Other", css: "" };
  }

  // ----- Timeline / raw log -----
  function renderTimeline() {
    var s = run.scenarios[state.scenarioIdx];
    if (!s) return;
    var events = s.eventTimeline || [];
    var q = (state.logQuery || "").toLowerCase();

    var filtered = events.filter(function (ev) {
      if (!state.logFilter[ev.type]) return false;
      if (q && JSON.stringify(ev).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    if (!filtered.length) {
      el("timeline").innerHTML = '<div class="muted">No events match this filter.</div>';
    } else {
      el("timeline").innerHTML = '<div class="timeline">' + filtered.map(function (ev) {
        var label = ({
          agent: "Agent",
          cmd: "Command",
          file: "Files",
          turn: "Turn",
          error: "Error",
        })[ev.type] || ev.type;
        var content = "";
        if (ev.type === "agent") {
          content = '<div class="md">' + ui.renderMarkdown(ev.text || "") + "</div>";
        } else if (ev.type === "cmd") {
          content = '<code>' + ui.escape(ev.command || "") + "</code>" +
            (ev.exitCode !== undefined && ev.exitCode !== null ?
              '<span class="muted"> · exit ' + ev.exitCode + "</span>" : "");
        } else if (ev.type === "file") {
          content = "<pre>" + ui.escape((ev.paths || []).join("\n")) + "</pre>";
        } else if (ev.type === "turn") {
          content = '<span class="muted">' + ui.escape(ev.text || "turn completed") + "</span>";
        } else if (ev.type === "error") {
          content = "<pre>" + ui.escape(ev.text || "") + "</pre>";
        }
        return '<div class="event ' + ev.type + '">' +
          '<div class="label">' + label + "</div>" +
          '<div class="content">' + content + "</div>" +
          "</div>";
      }).join("") + "</div>";
    }

    // Raw links
    var rawLinks = el("raw-log-links");
    var links = [];
    if (s.rawLog && s.rawLog.href) links.push('<a href="' + s.rawLog.href + '" target="_blank" rel="noopener">codex.stdout.jsonl</a>');
    if (s.stderrLog && s.stderrLog.href) links.push('<a href="' + s.stderrLog.href + '" target="_blank" rel="noopener">codex.stderr.log</a>');
    (s.verifierResults || []).forEach(function (v, i) {
      if (v.stdoutHref) links.push('<a href="' + v.stdoutHref + '" target="_blank" rel="noopener">verifier-' + (i + 1) + '.stdout</a>');
      if (v.stderrHref) links.push('<a href="' + v.stderrHref + '" target="_blank" rel="noopener">verifier-' + (i + 1) + '.stderr</a>');
    });
    rawLinks.innerHTML = links.join(" · ");
  }

  function bindLogControls() {
    document.querySelectorAll("[data-log-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-log-filter");
        state.logFilter[f] = !state.logFilter[f];
        chip.setAttribute("aria-pressed", state.logFilter[f] ? "true" : "false");
        renderTimeline();
      });
    });
    var search = el("log-search");
    if (search) {
      search.addEventListener("input", function (e) {
        state.logQuery = e.target.value;
        renderTimeline();
      });
    }
  }

  // ----- Adapter panels (skill-specific) -----
  function renderAdapterPanels() {
    var s = run.scenarios[state.scenarioIdx];
    var panels = (s && s.adapterPanels) || [];
    if (!panels.length) {
      el("adapter-panels").innerHTML = "";
      el("adapter-panels").style.display = "none";
      return;
    }
    el("adapter-panels").style.display = "";
    el("adapter-panels").innerHTML = panels.map(renderPanel).join("");
    ui.bindCopyButtons(el("adapter-panels"));
  }

  function renderPanel(p) {
    var head = '<div class="section"><h2>' + ui.escape(p.title || "") + "</h2>";
    if (p.kind === "matrix") return head + renderMatrix(p) + "</div>";
    if (p.kind === "ledger") return head + renderLedger(p) + "</div>";
    if (p.kind === "diff") return head + ui.renderDiff(p.content, { title: p.title, path: p.path || "" }) + "</div>";
    if (p.kind === "markdown") return head + '<div class="md">' + ui.renderMarkdown(p.content || "") + "</div></div>";
    if (p.kind === "kv") {
      return head + p.items.map(function (it) { return kv(it.k, ui.escape(it.v || "")); }).join("") + "</div>";
    }
    return head + "<pre>" + ui.escape(p.content || "") + "</pre></div>";
  }

  function renderMatrix(p) {
    if (!p.rows || !p.cols) return '<div class="muted">Matrix unavailable.</div>';
    var header = '<div class="cell head"></div>' + p.cols.map(function (c) {
      return '<div class="cell head">' + ui.escape(c) + "</div>";
    }).join("");
    var body = p.rows.map(function (row) {
      var cells = '<div class="cell row-head">' + ui.escape(row.label) + "</div>";
      cells += row.values.map(function (v) {
        if (v === true || v === "pass") return '<div class="cell pass">pass</div>';
        if (v === false || v === "fail") return '<div class="cell fail">fail</div>';
        if (v === "" || v === null || v === undefined) return '<div class="cell na">—</div>';
        return '<div class="cell">' + ui.escape(v) + "</div>";
      }).join("");
      return cells;
    }).join("");
    return '<div class="matrix-grid" style="--cols:' + p.cols.length + '">' + header + body + "</div>";
  }

  function renderLedger(p) {
    if (!p.rows || !p.rows.length) return '<div class="muted">Iteration ledger unavailable.</div>';
    var header = '<div class="ledger-row" style="color:var(--ink-mute);text-transform:uppercase;letter-spacing:.08em;font-size:11px">' +
      '<div>iter</div><div class="hyp">hypothesis</div><div>calibration</div><div class="hold">holdout</div><div class="decision">decision</div></div>';
    var body = p.rows.map(function (r) {
      return '<div class="ledger-row">' +
        '<div class="iter">' + ui.escape(r.iteration) + "</div>" +
        '<div class="hyp">' + ui.escape(r.hypothesis || "") + "</div>" +
        '<div>' + formatOutcome(r.calibration) + "</div>" +
        '<div class="hold">' + formatOutcome(r.holdout) + "</div>" +
        '<div class="decision">' + ui.escape(r.decision || "") + "</div>" +
      "</div>";
    }).join("");
    return header + body;
  }

  function formatOutcome(o) {
    if (!o) return '<span class="muted">—</span>';
    var pass = o.passed || 0, fail = o.failed || 0;
    var cls = fail === 0 ? "ok" : (pass === 0 ? "bad" : "");
    return '<span class="' + cls + '">' + pass + " / " + (pass + fail) + "</span>";
  }

  function mount() {
    renderHeader();
    renderOutcome();
    renderScenarioStrip();

    // jump-to anchor
    var hash = (location.hash || "").replace("#", "");
    if (hash) {
      var idx = (run.scenarios || []).findIndex(function (s) { return s.id === hash; });
      if (idx >= 0) state.scenarioIdx = idx;
    }
    renderScenarioBody();
    renderArtifacts();
    renderFileChanges();
    renderTimeline();
    renderAdapterPanels();
    bindLogControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}());
