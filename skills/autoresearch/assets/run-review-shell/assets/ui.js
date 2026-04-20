// Shared UI helpers for the Autoresearch Run Review frontend.
// Intentionally framework-free, no bundler required.

(function (root) {
  "use strict";

  var ui = {};

  ui.escape = function (s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  ui.fmtInt = function (n) {
    if (n === null || n === undefined || isNaN(n)) return "—";
    return Number(n).toLocaleString("en-US");
  };

  ui.fmtDuration = function (ms) {
    if (!ms && ms !== 0) return "—";
    if (ms < 1000) return ms + "ms";
    var s = ms / 1000;
    if (s < 60) return s.toFixed(s < 10 ? 1 : 0) + "s";
    var m = Math.floor(s / 60);
    var r = Math.round(s - m * 60);
    return m + "m " + r + "s";
  };

  ui.fmtDate = function (iso) {
    if (!iso) return "—";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      var pad = function (x) { return x < 10 ? "0" + x : "" + x; };
      return (
        d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
        " " + pad(d.getHours()) + ":" + pad(d.getMinutes())
      );
    } catch (e) { return iso; }
  };

  ui.statusPill = function (status) {
    var s = (status || "").toLowerCase();
    var cls = "pill";
    var label = status || "unknown";
    if (s === "completed" || s === "passed" || s === "pass") { cls += " pill--pass"; label = "Pass"; }
    else if (s === "failed" || s === "fail") { cls += " pill--fail"; label = "Fail"; }
    else if (s === "partial" || s === "warn") { cls += " pill--warn"; label = "Partial"; }
    else { cls += " pill--accent"; label = status; }
    return '<span class="' + cls + '">' + ui.escape(label) + "</span>";
  };

  ui.statusGlyph = function (status) {
    var s = (status || "").toLowerCase();
    var cls = "status-glyph ";
    if (s === "completed" || s === "passed" || s === "pass") cls += "status-glyph--pass";
    else if (s === "failed" || s === "fail") cls += "status-glyph--fail";
    else if (s === "partial" || s === "warn") cls += "status-glyph--warn";
    else cls += "status-glyph--info";
    return '<span class="' + cls + '"></span>';
  };

  // Minimal markdown → HTML (headings, lists, code, bold/italic, rules, paragraphs).
  ui.renderMarkdown = function (text) {
    if (!text) return "";
    var src = String(text).replace(/\r\n?/g, "\n");
    var out = [];
    var lines = src.split("\n");
    var i = 0;
    var inCode = false;
    var codeBuf = [];
    var inList = null; // 'ul' | 'ol' | null
    var paraBuf = [];

    function flushPara() {
      if (paraBuf.length) {
        out.push("<p>" + inline(paraBuf.join(" ")) + "</p>");
        paraBuf = [];
      }
    }
    function closeList() {
      if (inList) {
        out.push("</" + inList + ">");
        inList = null;
      }
    }
    function inline(s) {
      var e = ui.escape(s);
      e = e.replace(/`([^`]+)`/g, "<code>$1</code>");
      e = e.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      e = e.replace(/(^|[\s(])_([^_]+)_(?=[\s).,:;!?]|$)/g, "$1<em>$2</em>");
      e = e.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
      // basic link handling
      e = e.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_m, label, href) {
        return '<a href="' + href + '" target="_blank" rel="noopener">' + label + "</a>";
      });
      return e;
    }

    for (; i < lines.length; i++) {
      var line = lines[i];
      var fence = line.match(/^```(.*)$/);
      if (fence) {
        if (inCode) {
          out.push("<pre><code>" + ui.escape(codeBuf.join("\n")) + "</code></pre>");
          codeBuf = [];
          inCode = false;
        } else {
          flushPara();
          closeList();
          inCode = true;
        }
        continue;
      }
      if (inCode) { codeBuf.push(line); continue; }

      if (/^\s*$/.test(line)) { flushPara(); closeList(); continue; }

      var heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushPara(); closeList();
        var lv = heading[1].length;
        out.push("<h" + lv + ">" + inline(heading[2]) + "</h" + lv + ">");
        continue;
      }
      if (/^\s*---+\s*$/.test(line)) {
        flushPara(); closeList();
        out.push("<hr>");
        continue;
      }
      var uli = line.match(/^\s*[-*+]\s+(.+)$/);
      if (uli) {
        flushPara();
        if (inList !== "ul") { closeList(); out.push("<ul>"); inList = "ul"; }
        out.push("<li>" + inline(uli[1]) + "</li>");
        continue;
      }
      var oli = line.match(/^\s*(\d+)\.\s+(.+)$/);
      if (oli) {
        flushPara();
        if (inList !== "ol") { closeList(); out.push("<ol>"); inList = "ol"; }
        out.push("<li>" + inline(oli[2]) + "</li>");
        continue;
      }
      closeList();
      paraBuf.push(line.trim());
    }
    flushPara(); closeList();
    if (inCode) out.push("<pre><code>" + ui.escape(codeBuf.join("\n")) + "</code></pre>");
    return out.join("\n");
  };

  ui.renderDiff = function (diffText, meta) {
    if (!diffText) {
      return '<div class="muted" style="font-family:var(--mono);font-size:12px">No diff.</div>';
    }
    var header = "";
    if (meta && meta.title) {
      header = '<div class="diff-head"><span>' + ui.escape(meta.title) +
        "</span>" + (meta.path ? '<span class="path">' + ui.escape(meta.path) + "</span>" : "") +
        "</div>";
    }
    var rows = diffText.split("\n").map(function (line) {
      var cls = "line";
      if (/^@@/.test(line)) cls += " hunk";
      else if (/^\+\+\+|^---/.test(line)) cls += " meta";
      else if (/^\+/.test(line)) cls += " add";
      else if (/^-/.test(line)) cls += " del";
      return '<div class="' + cls + '">' + ui.escape(line || " ") + "</div>";
    }).join("");
    return '<div class="diff">' + header + '<div class="diff-body">' + rows + "</div></div>";
  };

  ui.copyButton = function (text, label) {
    var id = "cp-" + Math.random().toString(36).slice(2, 8);
    // inline handler; text escaped and base64-encoded to avoid string issues.
    var b64 = (typeof btoa === "function")
      ? btoa(unescape(encodeURIComponent(String(text || ""))))
      : "";
    return '<button class="copy-btn" data-copy="' + b64 + '" data-copy-id="' + id + '">' +
      (label || "Copy") + "</button>";
  };

  ui.bindCopyButtons = function (root) {
    (root || document).querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
      if (btn.__bound) return;
      btn.__bound = true;
      btn.addEventListener("click", function () {
        var b64 = btn.getAttribute("data-copy") || "";
        var txt = "";
        try { txt = decodeURIComponent(escape(atob(b64))); } catch (e) { txt = ""; }
        var prev = btn.textContent;
        function done(ok) {
          btn.textContent = ok ? "Copied" : "Copy failed";
          setTimeout(function () { btn.textContent = prev; }, 1100);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { done(false); });
        } else {
          // fallback
          var ta = document.createElement("textarea");
          ta.value = txt;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(true); } catch (e) { done(false); }
          document.body.removeChild(ta);
        }
      });
    });
  };

  root.RunReviewUI = ui;
}(typeof window !== "undefined" ? window : this));
