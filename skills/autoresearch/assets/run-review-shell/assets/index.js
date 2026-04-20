// Autoresearch Run Review — combined index page.

(function () {
  "use strict";
  var ui = window.RunReviewUI;
  var data = window.__RUN_REVIEW_INDEX__;
  if (!data) return;

  var state = {
    skill: "all",
    status: "all",
    sort: "created-desc",
    query: "",
  };

  var listEl = document.getElementById("run-list");
  var countEl = document.getElementById("run-count");

  function skills() {
    var s = {};
    (data.runs || []).forEach(function (r) { s[r.skill] = true; });
    return Object.keys(s).sort();
  }

  function render() {
    var runs = (data.runs || []).slice();

    if (state.skill !== "all") {
      runs = runs.filter(function (r) { return r.skill === state.skill; });
    }
    if (state.status !== "all") {
      runs = runs.filter(function (r) { return (r.outcome || "").toLowerCase() === state.status; });
    }
    if (state.query) {
      var q = state.query.toLowerCase();
      runs = runs.filter(function (r) {
        return (r.runId + " " + r.skill + " " + (r.outcomeSummary || "")).toLowerCase().indexOf(q) !== -1;
      });
    }

    runs.sort(function (a, b) {
      switch (state.sort) {
        case "created-asc": return a.createdAt.localeCompare(b.createdAt);
        case "tokens-desc": return (b.avgTotalTokens || 0) - (a.avgTotalTokens || 0);
        case "tokens-asc": return (a.avgTotalTokens || 0) - (b.avgTotalTokens || 0);
        case "failures-desc": return (b.failedScenarios || 0) - (a.failedScenarios || 0);
        case "created-desc":
        default: return b.createdAt.localeCompare(a.createdAt);
      }
    });

    countEl.textContent = runs.length + " run" + (runs.length === 1 ? "" : "s");

    if (!runs.length) {
      listEl.innerHTML = '<div class="run-list-empty">No runs match this filter.</div>';
      return;
    }

    listEl.innerHTML = runs.map(function (r) {
      var status = r.outcome || "completed";
      var glyph = ui.statusGlyph(status);
      var pill = ui.statusPill(status);
      var scen = (r.completedScenarios || 0) + "/" + (r.scenarioCount || 0) + " pass";
      if (r.failedScenarios) { scen += "  · " + r.failedScenarios + " fail"; }

      return (
        '<a class="run-row" href="' + r.detailPage + '" tabindex="0">' +
          '<div class="col-status">' + glyph + pill + "</div>" +
          '<div class="col-title">' +
            '<div class="title">' + ui.escape(r.title || r.runId) + "</div>" +
            '<div class="meta">' + ui.escape(r.runId) + " · " + ui.fmtDate(r.createdAt) + "</div>" +
            (r.outcomeSummary ? '<div class="outcome">' + ui.escape(r.outcomeSummary) + "</div>" : "") +
          "</div>" +
          '<div class="col-skill">' + ui.escape(r.skill) + "</div>" +
          '<div class="col-scenarios">' + ui.escape(scen) + "</div>" +
          '<div class="col-tokens">' + ui.fmtInt(r.avgTotalTokens) + " tok</div>" +
          '<div class="col-duration">' + ui.fmtDuration(r.totalDurationMs) + "</div>" +
        "</a>"
      );
    }).join("");
  }

  function bindChip(group, key, allowAll) {
    document.querySelectorAll('[data-filter="' + group + '"]').forEach(function (chip) {
      chip.addEventListener("click", function () {
        var val = chip.getAttribute("data-value");
        state[key] = val;
        document.querySelectorAll('[data-filter="' + group + '"]').forEach(function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-value") === val ? "true" : "false");
        });
        render();
      });
    });
  }

  function mount() {
    // populate skill chips dynamically
    var skillBar = document.getElementById("skill-chips");
    var allSkills = skills();
    var html = '<button class="chip" data-filter="skill" data-value="all" aria-pressed="true">All</button>';
    allSkills.forEach(function (s) {
      html += '<button class="chip" data-filter="skill" data-value="' + ui.escape(s) +
        '" aria-pressed="false">' + ui.escape(s) + "</button>";
    });
    skillBar.innerHTML = html;

    bindChip("skill", "skill", true);
    bindChip("status", "status", true);

    document.getElementById("sort-select").addEventListener("change", function (e) {
      state.sort = e.target.value;
      render();
    });
    var search = document.getElementById("search-input");
    if (search) {
      search.addEventListener("input", function (e) {
        state.query = e.target.value;
        render();
      });
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}());
