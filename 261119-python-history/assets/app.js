/* The Python Programming Language's Journey... So Far — interactive behavior.
   No dependencies. Reads window.PYHIST from data.js. */
(function () {
  "use strict";

  var DATA = window.PYHIST;
  var SVGNS = "http://www.w3.org/2000/svg";
  var TODAY = new Date(DATA.verified + "T12:00:00Z");
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var LANE_BY_ID = {};
  DATA.lanes.forEach(function (l) { LANE_BY_ID[l.id] = l; });
  var LINE_NAMES = { early: "Python 0.9–1.6", py2: "Python 2", py3: "Python 3", next: "Future" };

  /* ---------------------------------------------------------------- */
  /* Utilities                                                        */
  /* ---------------------------------------------------------------- */

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Escape, then turn `code` spans into <code>.
  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function parseDate(s) {
    var p = s.split("-").map(Number);
    return new Date(Date.UTC(p[0], (p[1] || 7) - 1, p[2] || (p[1] ? 15 : 1)));
  }

  function fmtDate(s, short) {
    var p = s.split("-").map(Number);
    if (p.length === 1) return String(p[0]);
    var m = short ? MONTHS[p[1] - 1].slice(0, 3) : MONTHS[p[1] - 1];
    if (p.length === 2) return m + " " + p[0];
    return (short ? m + " " + p[0] : p[2] + " " + m + " " + p[0]);
  }

  function yearFrac(d) {
    var y = d.getUTCFullYear();
    var start = Date.UTC(y, 0, 1), end = Date.UTC(y + 1, 0, 1);
    return y + (d - start) / (end - start);
  }

  function pepUrl(n) {
    return "https://peps.python.org/pep-" + String(n).padStart(4, "0") + "/";
  }

  function pepLinks(peps) {
    if (!peps || !peps.length) return "";
    return '<ul class="peps">' + peps.map(function (n) {
      return '<li><a href="' + pepUrl(n) + '">PEP ' + n + "</a></li>";
    }).join("") + "</ul>";
  }

  function svg(tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------------------------------------------------------------- */
  /* Syntax highlighting (small, purpose-built)                       */
  /* ---------------------------------------------------------------- */

  var KW = new Set(("False None True and as assert async await break class continue def del elif else except " +
    "finally for from global if import in is lambda nonlocal not or pass raise return try while with yield exec").split(" "));
  var SOFT_KW = new Set(["match", "case", "type", "lazy"]);
  var BUILTINS = new Set(("print len range xrange open sum map filter reduce zip enumerate sorted reversed isinstance int str " +
    "float list dict set frozenset frozendict tuple bytes repr super object property classmethod staticmethod abs pow " +
    "input raw_input iter next any all apply callable hash id help quit exit dataclass Enum Path Template " +
    "ValueError TypeError KeyError OSError IOError FileNotFoundError ZeroDivisionError SyntaxError UnicodeDecodeError " +
    "BaseException Exception ExceptionGroup RuntimeError").split(" "));

  var PY_RE = /(#[^\n]*)|((?:\b[rRbBuUfFtT]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b0[xXoObB][\da-fA-F_]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[jJlL]?\b)|(@[\w.]+)|(\b[A-Za-z_]\w*\b)|(^(?:>>>|\.\.\.)(?= |$))/gm;

  function span(cls, text) { return '<span class="' + cls + '">' + esc(text) + "</span>"; }

  function highlightPython(src) {
    var out = "", last = 0, m;
    PY_RE.lastIndex = 0;
    while ((m = PY_RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      var t = m[0];
      if (m[1]) out += span("tok-com", t);
      else if (m[2]) out += span("tok-str", t);
      else if (m[3]) out += span("tok-num", t);
      else if (m[4]) {
        // "@" at the start of a line (after whitespace) is a decorator; elsewhere it's the matmul operator.
        var lineStart = src.lastIndexOf("\n", m.index - 1) + 1;
        if (/^\s*$/.test(src.slice(lineStart, m.index))) out += span("tok-dec", t);
        else { out += esc(t.charAt(0)); PY_RE.lastIndex = m.index + 1; last = m.index + 1; continue; }
      }
      else if (m[5]) {
        if (KW.has(t)) out += span("tok-kw", t);
        else if (SOFT_KW.has(t) && isSoftKeyword(src, m.index, t)) out += span("tok-kw", t);
        else if (t === "self" || t === "cls") out += span("tok-self", t);
        else if (BUILTINS.has(t)) out += span("tok-fn", t);
        else out += esc(t);
      }
      else if (m[6]) out += span("tok-prompt", t);
      last = m.index + t.length;
    }
    return out + esc(src.slice(last));
  }

  function isSoftKeyword(src, idx, word) {
    var lineStart = src.lastIndexOf("\n", idx - 1) + 1;
    var before = src.slice(lineStart, idx).replace(/^(>>>|\.\.\.) /, "");
    if (!/^\s*$/.test(before)) return false;
    var after = src.slice(idx + word.length);
    return /^ +[\w"'\[\(\*{_]/.test(after) && !/^ *=[^=]/.test(after);
  }

  function highlightShell(src) {
    return src.split("\n").map(function (line) {
      var m = line.match(/^(\(\w+\) )?(\$ )(.*)$/);
      if (m) return (m[1] ? span("tok-com", m[1]) : "") + span("tok-prompt", m[2]) + esc(m[3]);
      return span("tok-com", line);
    }).join("\n");
  }

  function highlightToml(src) {
    return src.split("\n").map(function (line) {
      if (/^\s*#/.test(line)) return span("tok-com", line);
      if (/^\s*\[.*\]\s*$/.test(line)) return span("tok-head", line);
      var m = line.match(/^(\s*[\w.-]+)(\s*=\s*)(.*)$/);
      if (m) return span("tok-key", m[1]) + esc(m[2]) + m[3].replace(/("(?:\\.|[^"])*")|([^"]+)/g, function (s, str, other) {
        return str ? span("tok-str", str) : esc(other);
      });
      return esc(line);
    }).join("\n");
  }

  function highlightText(src) {
    return src.split("\n").map(function (line) {
      var m = line.match(/^(>>> |\.\.\. )(.*)$/);
      if (m) return span("tok-prompt", m[1]) + highlightPython(m[2]);
      return esc(line);
    }).join("\n");
  }

  function highlight(src, lang) {
    if (lang === "shell") return highlightShell(src);
    if (lang === "toml") return highlightToml(src);
    if (lang === "text") return highlightText(src);
    return highlightPython(src);
  }

  function codeFigure(src, label, cls, lang) {
    return '<figure class="code ' + (cls || "") + '">' +
      (label ? "<figcaption>" + esc(label) + "</figcaption>" : "") +
      "<pre><code>" + highlight(src, lang) + "</code></pre></figure>";
  }

  function codeBlock(code) {
    if (!code) return "";
    if (code.ex) return codeFigure(code.ex, code.label, "", code.lang);
    return '<div class="code-pair">' +
      codeFigure(code.before, code.bl || "Before", "before", code.lang) +
      codeFigure(code.after, code.al || "After", "after", code.lang) + "</div>";
  }

  /* ---------------------------------------------------------------- */
  /* State                                                            */
  /* ---------------------------------------------------------------- */

  var entries = DATA.entries.slice().sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
  var byId = {};
  entries.forEach(function (e, i) { e.index = i; e.t = yearFrac(parseDate(e.date)); byId[e.id] = e; });

  var state = {
    selected: "v3.15",
    mode: "entry",      // "entry" | "thread"
    thread: null,
    lanes: new Set(DATA.lanes.map(function (l) { return l.id; })),
    query: "",
    matches: null       // Set of "entryId|laneId" when searching
  };

  /* ---------------------------------------------------------------- */
  /* Theme toggle                                                     */
  /* ---------------------------------------------------------------- */

  function initTheme() {
    var root = document.documentElement;
    var btn = $("theme-toggle");
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

    function effective() {
      var explicit = root.getAttribute("data-theme");
      if (explicit) return explicit;
      return mq && mq.matches ? "dark" : "light";
    }
    function sync() {
      var eff = effective();
      root.setAttribute("data-theme-effective", eff);
      btn.setAttribute("aria-label", eff === "dark" ? "Switch to light theme" : "Switch to dark theme");
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", eff === "dark" ? "#132c43" : "#306998");
    }
    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pyjourney-theme", next); } catch (e) {}
      sync();
    });
    if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (!root.getAttribute("data-theme")) sync(); });
    sync();
  }

  /* ---------------------------------------------------------------- */
  /* Hero REPL                                                        */
  /* ---------------------------------------------------------------- */

  function renderRepl() {
    var lines = [
      { p: ">>>", c: 'print "Hello, world!"', when: "Python 1 and 2" },
      { out: "Hello, world!" },
      { p: ">>>", c: 'print("Hello, world!")', when: "3.0, 2008" },
      { p: ">>>", c: 'name = "world"' },
      { p: ">>>", c: 'print(f"Hello, {name}!")', when: "3.6, 2016" },
      { out: "Hello, world!" },
      { p: ">>>", c: "lazy import json", when: "3.15, 2026" },
      { p: ">>>", cursor: true }
    ];
    var animate = !prefersReducedMotion();
    $("repl-lines").innerHTML = lines.map(function (l, i) {
      var cls = (l.out ? "out" : "") + (animate ? " reveal" : "");
      var style = animate ? ' style="animation-delay:' + (180 + i * 220) + 'ms"' : "";
      var code = l.out ? esc(l.out)
        : '<span class="prompt">' + l.p + "</span> " + (l.cursor ? '<span class="cursor" aria-hidden="true"></span>' : highlightPython(l.c));
      return '<li class="' + cls.trim() + '"' + style + '><span class="code">' + code + "</span>" +
        (l.when ? '<span class="when">' + esc(l.when) + "</span>" : "<span></span>") + "</li>";
    }).join("");
  }

  /* ---------------------------------------------------------------- */
  /* Lane filters                                                     */
  /* ---------------------------------------------------------------- */

  function renderChips() {
    var html = DATA.lanes.map(function (l) {
      return '<button type="button" class="chip" data-lane="' + l.id + '" aria-pressed="' + state.lanes.has(l.id) + '">' + esc(l.name) + "</button>";
    }).join("");
    var allOn = state.lanes.size === DATA.lanes.length;
    if (!allOn) html += '<button type="button" class="chip reset" data-lane="*">Show all</button>';
    $("lane-chips").innerHTML = html;
  }

  function onChipClick(e) {
    var b = e.target.closest("button[data-lane]");
    if (!b) return;
    var id = b.getAttribute("data-lane");
    if (id === "*") DATA.lanes.forEach(function (l) { state.lanes.add(l.id); });
    else if (state.lanes.has(id)) {
      if (state.lanes.size > 1) state.lanes.delete(id);
    } else state.lanes.add(id);
    renderChips();
    var again = $("lane-chips").querySelector('[data-lane="' + id + '"]');
    if (again) again.focus();
    renderChart();
    renderDetail(false);
  }

  /* ---------------------------------------------------------------- */
  /* Swimlane chart                                                   */
  /* ---------------------------------------------------------------- */

  var CH = { top: 92, laneH: 46, bottom: 26, padL: 18, padR: 28, start: 1989, end: 2029.2 };
  var chartGeom = null;

  function visibleLanes() {
    return DATA.lanes.filter(function (l) { return state.lanes.has(l.id); });
  }

  function renderChart() {
    var scroller = $("chart-scroll");
    var lanes = visibleLanes();
    var avail = scroller.clientWidth || 800;
    var W = Math.max(avail, 920);
    var H = CH.top + lanes.length * CH.laneH + CH.bottom;
    var x = function (t) { return CH.padL + (t - CH.start) / (CH.end - CH.start) * (W - CH.padL - CH.padR); };
    chartGeom = { x: x, W: W };

    // Lane labels column (real buttons, outside the horizontal scroller)
    var labels = '<div class="spacer" style="height:' + CH.top + 'px">Python lines</div>';
    labels += lanes.map(function (l) {
      var cur = state.mode === "thread" && state.thread === l.id;
      return '<button type="button" class="lane-label" data-thread="' + l.id + '" style="height:' + CH.laneH + 'px"' +
        (cur ? ' aria-current="true"' : "") + ' title="Follow ' + esc(l.name) + ' through time">' +
        '<span class="long">' + esc(l.name) + '</span><span class="short">' + esc(l.short) + "</span></button>";
    }).join("");
    labels += '<div style="height:' + CH.bottom + 'px"></div>';
    $("chart-labels").innerHTML = labels;

    var s = svg("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, class: "chart-svg", "aria-hidden": "true", focusable: "false" });
    var defs = svg("defs", {}, s);
    var p1 = svg("pattern", { id: "future-hatch", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    svg("rect", { width: 8, height: 8, fill: "var(--c-next)", "fill-opacity": "0.06" }, p1);
    svg("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "var(--c-next)", "stroke-opacity": "0.35", "stroke-width": 1.5 }, p1);
    var p2 = svg("pattern", { id: "py2-hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    svg("rect", { width: 6, height: 6, fill: "var(--c-py2)", "fill-opacity": "0.25" }, p2);
    svg("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "var(--c-py2)", "stroke-width": 2.5 }, p2);

    var todayT = yearFrac(TODAY);
    var lanesTop = CH.top, lanesBottom = CH.top + lanes.length * CH.laneH;

    // Future zone
    svg("rect", { x: x(todayT), y: 22, width: x(CH.end) - x(todayT), height: H - 22, class: "future-zone" }, s);

    // Year grid
    for (var y = 1990; y <= 2029; y++) {
      var major = y % 5 === 0;
      svg("line", { x1: x(y), x2: x(y), y1: major ? 16 : 22, y2: lanesBottom, class: major ? "axis-major" : "axis-minor" }, s);
      if (major) {
        var tx = svg("text", { x: x(y), y: 12, "text-anchor": "middle" }, s);
        tx.textContent = y;
      }
    }

    // Lifelines: early + Python 2 on one row, Python 3 on the next — the overlap shows the long transition.
    var r1 = 34, r2 = 62, bh = 10;
    function bar(t0, t1, row, cls) {
      svg("rect", { x: x(t0), y: row, width: Math.max(2, x(t1) - x(t0)), height: bh, rx: 2, class: cls }, s);
    }
    function lbl(t, row, text, anchor) {
      var el = svg("text", { x: x(t) + (anchor === "end" ? -6 : 0), y: row - 4, class: "lifeline-label", "text-anchor": anchor || "start" }, s);
      el.textContent = text;
    }
    var T = function (d) { return yearFrac(parseDate(d)); };
    bar(T("1991-02-20"), T("2000-10-16"), r1, "ll-early");
    lbl(T("1991-02-20"), r1, "Python 0.9–1.6");
    bar(T("2000-10-16"), T("2010-07-03"), r1, "ll-py2");
    bar(T("2010-07-03"), T("2020-04-20"), r1, "ll-py2-maint");
    lbl(T("2000-10-16"), r1, "Python 2");
    var maintLbl = svg("text", { x: x(T("2010-07-03")) + 4, y: r1 - 4, class: "lifeline-label" }, s);
    maintLbl.textContent = "2.7 maintenance until 2020";
    bar(T("2008-12-03"), todayT, r2, "ll-py3");
    svg("rect", { x: x(todayT), y: r2, width: x(T("2028-12")) - x(todayT), height: bh, rx: 2, class: "ll-next", "fill-opacity": 0.85 }, s);
    lbl(T("2008-12-03"), r2, "Python 3", "end");
    var py3l = s.lastChild; py3l.setAttribute("y", r2 + bh - 1);

    // Today marker
    svg("line", { x1: x(todayT), x2: x(todayT), y1: 18, y2: lanesBottom, class: "today-line" }, s);
    var tl = svg("text", { x: x(todayT) + 5, y: 12, class: "today-label" }, s);
    tl.textContent = "Today";

    // Lane rules
    lanes.forEach(function (l, i) {
      svg("line", { x1: 0, x2: W, y1: lanesTop + i * CH.laneH, y2: lanesTop + i * CH.laneH, class: "lane-rule" }, s);
    });

    // Selection band
    var sel = byId[state.selected];
    if (sel && state.mode === "entry") {
      svg("rect", { x: x(sel.t) - 9, y: 18, width: 18, height: lanesBottom - 18, class: "sel-band" }, s);
    }

    // Marks
    var marksG = svg("g", {}, s);
    lanes.forEach(function (l, li) {
      var cy = lanesTop + li * CH.laneH + CH.laneH / 2;
      var placed = [];
      entries.forEach(function (e) {
        var feats = e.features.filter(function (f) { return f.cat === l.id; });
        if (!feats.length) return;
        var r = Math.min(10, 4.5 + 1.9 * Math.sqrt(feats.length));
        var cx = x(e.t);
        // Nudge vertically if this mark would overlap a neighbor in the same lane.
        var offsets = [0, -11, 11, -6, 6], dy = 0;
        for (var k = 0; k < offsets.length; k++) {
          var ok = placed.every(function (p) {
            var dx = p.x - cx, dyy = p.y - (cy + offsets[k]);
            return Math.sqrt(dx * dx + dyy * dyy) > p.r + r + 1;
          });
          if (ok) { dy = offsets[k]; break; }
          dy = offsets[k];
        }
        placed.push({ x: cx, y: cy + dy, r: r });

        var cls = "mark " + e.line;
        if (state.mode === "entry" && e.id === state.selected) cls += " selected";
        if (state.matches) cls += state.matches.has(e.id + "|" + l.id) ? " hit" : " dim";
        var el;
        if (e.kind === "milestone") {
          var d = r * 1.15;
          el = svg("path", { d: "M" + cx + " " + (cy + dy - d) + " L" + (cx + d) + " " + (cy + dy) + " L" + cx + " " + (cy + dy + d) + " L" + (cx - d) + " " + (cy + dy) + " Z", class: cls }, marksG);
        } else {
          el = svg("circle", { cx: cx, cy: cy + dy, r: r, class: cls }, marksG);
        }
        el.setAttribute("data-entry", e.id);
        el.setAttribute("data-lane", l.id);
      });
    });

    scroller.innerHTML = "";
    scroller.appendChild(s);
  }

  function scrollChartTo(entry, smooth) {
    if (!chartGeom || !entry) return;
    var scroller = $("chart-scroll");
    if (scroller.scrollWidth <= scroller.clientWidth) return;
    var target = chartGeom.x(entry.t) - scroller.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, target), behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" });
  }

  // Tooltip
  var tip;
  function showTip(evt, entryId, laneId) {
    var e = byId[entryId];
    var feats = e.features.filter(function (f) { return f.cat === laneId; });
    var name = e.kind === "release" ? "Python " + e.label : e.title;
    tip.innerHTML = "<strong>" + esc(name) + "</strong>" +
      '<span class="tt-date">' + esc(fmtDate(e.date)) + (e.status ? " (" + e.status + ")" : "") + "</span>" +
      '<span class="tt-lane">' + esc(LANE_BY_ID[laneId].name) + "</span>" +
      "<ul>" + feats.map(function (f) { return "<li>" + inline(f.title) + "</li>"; }).join("") + "</ul>";
    tip.hidden = false;
    moveTip(evt);
  }
  function moveTip(evt) {
    var pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
    var left = evt.clientX + pad, top = evt.clientY + pad;
    if (left + w > window.innerWidth - 8) left = evt.clientX - w - pad;
    if (top + h > window.innerHeight - 8) top = evt.clientY - h - pad;
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { tip.hidden = true; }

  function initChartEvents() {
    var scroller = $("chart-scroll");
    scroller.addEventListener("pointerover", function (evt) {
      var m = evt.target.closest && evt.target.closest(".mark");
      if (m && evt.pointerType !== "touch") showTip(evt, m.getAttribute("data-entry"), m.getAttribute("data-lane"));
    });
    scroller.addEventListener("pointermove", function (evt) { if (!tip.hidden) moveTip(evt); });
    scroller.addEventListener("pointerout", function (evt) {
      if (evt.target.closest && evt.target.closest(".mark")) hideTip();
    });
    scroller.addEventListener("click", function (evt) {
      var m = evt.target.closest && evt.target.closest(".mark");
      if (!m) return;
      hideTip();
      select(m.getAttribute("data-entry"), { scrollToDetail: true, focusLane: m.getAttribute("data-lane") });
    });
    $("chart-labels").addEventListener("click", function (evt) {
      var b = evt.target.closest("[data-thread]");
      if (b) openThread(b.getAttribute("data-thread"));
    });
  }

  /* ---------------------------------------------------------------- */
  /* Version strip                                                    */
  /* ---------------------------------------------------------------- */

  function renderStrip() {
    $("strip").innerHTML = entries.map(function (e) {
      var cur = state.mode === "entry" && e.id === state.selected;
      var year = e.date.slice(0, 4);
      return '<li><button type="button" class="strip-item ' + e.line + (e.kind === "milestone" ? " milestone" : "") + '" data-id="' + e.id + '"' +
        (cur ? ' aria-current="true"' : "") + ' tabindex="' + (cur ? 0 : -1) + '"' +
        ' aria-label="' + esc((e.kind === "release" ? "Python " + e.label : e.title) + ", " + fmtDate(e.date)) + '">' +
        '<span class="v">' + esc(e.label) + '</span><span class="y">' + year + "</span></button></li>";
    }).join("");
    if (state.mode === "thread") {
      var first = $("strip").querySelector(".strip-item");
      if (first) first.tabIndex = 0;
    }
    updateStepButtons();
  }

  function updateStrip() {
    var items = $("strip").querySelectorAll(".strip-item");
    items.forEach(function (b) {
      var cur = state.mode === "entry" && b.getAttribute("data-id") === state.selected;
      if (cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      b.tabIndex = cur ? 0 : -1;
    });
    updateStepButtons();
  }

  function scrollStripTo(id, smooth) {
    var list = $("strip");
    var b = list.querySelector('[data-id="' + id + '"]');
    if (!b) return;
    var li = b.parentNode;
    var target = li.offsetLeft - list.clientWidth / 2 + li.offsetWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" });
  }

  function updateStepButtons() {
    var e = byId[state.selected];
    $("strip-prev").disabled = state.mode === "entry" && e.index === 0;
    $("strip-next").disabled = state.mode === "entry" && e.index === entries.length - 1;
  }

  function step(delta, focusStrip) {
    var e = byId[state.selected];
    var i = state.mode === "thread" ? e.index : Math.min(entries.length - 1, Math.max(0, e.index + delta));
    select(entries[i].id, { scrollToDetail: false });
    if (focusStrip) {
      var b = $("strip").querySelector('[data-id="' + entries[i].id + '"]');
      if (b) b.focus();
    }
  }

  function initStrip() {
    $("strip").addEventListener("click", function (evt) {
      var b = evt.target.closest(".strip-item");
      if (b) select(b.getAttribute("data-id"), { scrollToDetail: false });
    });
    $("strip").addEventListener("keydown", function (evt) {
      if (evt.key === "ArrowRight" || evt.key === "ArrowLeft") {
        evt.preventDefault();
        step(evt.key === "ArrowRight" ? 1 : -1, true);
      } else if (evt.key === "Home" || evt.key === "End") {
        evt.preventDefault();
        select(entries[evt.key === "Home" ? 0 : entries.length - 1].id, {});
        var b = $("strip").querySelector('[aria-current="true"]');
        if (b) b.focus();
      }
    });
    $("strip-prev").addEventListener("click", function () { step(-1); });
    $("strip-next").addEventListener("click", function () { step(1); });
  }

  /* ---------------------------------------------------------------- */
  /* Detail panel                                                     */
  /* ---------------------------------------------------------------- */

  function lineBadge(e) {
    if (e.line === "next") {
      return '<span class="badge next">' + (e.status === "scheduled" ? "Scheduled" : "Expected") + "</span>";
    }
    var html = '<span class="badge ' + e.line + '">' + LINE_NAMES[e.line] + "</span>";
    if (e.id === "v3.15") html += '<span class="badge now">Latest release</span>';
    return html;
  }

  function renderEntry(e) {
    var feats = e.features.filter(function (f) { return state.lanes.has(f.cat); });
    var hidden = e.features.length - feats.length;
    var isRel = e.kind === "release";
    var head =
      '<header class="detail-head">' +
        '<div class="detail-version' + (isRel ? "" : " milestone") + '">' +
          (isRel ? '<span class="pre">Python</span>' + esc(e.label) : esc(e.label)) +
        "</div>" +
        "<div>" +
          '<p class="detail-meta">' + lineBadge(e) + "<time datetime=\"" + e.date + "\">" + esc(fmtDate(e.date)) + "</time>" +
            (isRel ? "" : "<span>Milestone</span>") + "</p>" +
          "<h3>" + (isRel ? "" : esc(e.title) + ": ") + inline(e.headline) + "</h3>" +
          '<p class="summary">' + inline(e.summary) + "</p>" +
          detailLinks(e) +
        "</div>" +
      "</header>";

    var body;
    if (!feats.length) {
      body = '<p class="empty-note">No changes in the selected categories for this entry. <button type="button" class="link-button" data-action="show-all">Show all categories</button></p>';
    } else {
      body = '<ol class="features">' + feats.map(function (f, i) {
        return '<li class="feature" data-lane="' + f.cat + '" id="feat-' + e.id + "-" + i + '">' +
          '<div class="feature-lane"><button type="button" data-thread="' + f.cat + '" title="Follow this thread through time">' + esc(LANE_BY_ID[f.cat].name) + "</button></div>" +
          '<div class="feature-body"><h4>' + inline(f.title) + "</h4>" + pepLinks(f.peps) +
            "<p>" + inline(f.desc) + "</p>" + codeBlock(f.code) + "</div></li>";
      }).join("") + "</ol>";
      if (hidden) body += '<p class="empty-note">' + hidden + " more " + (hidden === 1 ? "change is" : "changes are") + ' hidden by the category filter. <button type="button" class="link-button" data-action="show-all">Show all categories</button></p>';
    }

    var prev = entries[e.index - 1], next = entries[e.index + 1];
    var nav = '<nav class="detail-nav" aria-label="Adjacent entries">' +
      (prev ? '<button type="button" data-go="' + prev.id + '"><span class="dir">Previous</span><span class="nm">' + esc(navName(prev)) + "</span></button>" : "") +
      (next ? '<button type="button" class="next-btn" data-go="' + next.id + '"><span class="dir">Next</span><span class="nm">' + esc(navName(next)) + "</span></button>" : "") +
      "</nav>";
    return head + body + nav;
  }

  function navName(e) { return e.kind === "release" ? "Python " + e.label : e.title; }

  function detailLinks(e) {
    var links = [];
    if (e.whatsnew) links.push('<a href="' + e.whatsnew + '">What’s New in Python ' + esc(e.label) + "</a>");
    if (e.deepLink) links.push('<a href="#' + e.deepLink + '">Python 2 → 3 in detail</a>');
    if (e.line === "next") links.push('<a href="#ahead">More on what’s next</a>');
    return links.length ? '<p class="detail-links">' + links.join("") + "</p>" : "";
  }

  function renderThread(laneId) {
    var lane = LANE_BY_ID[laneId];
    var rows = entries.map(function (e) {
      var feats = e.features.filter(function (f) { return f.cat === laneId; });
      return feats.length ? { e: e, feats: feats } : null;
    }).filter(Boolean);
    var count = rows.reduce(function (n, r) { return n + r.feats.length; }, 0);
    var back = byId[state.selected];
    var head = '<header class="detail-head"><div class="detail-version milestone">' + esc(lane.short) + "</div><div>" +
      '<p class="detail-meta"><span class="badge py3">Thread</span><span>' + count + " changes across " + rows.length + " releases and milestones</span></p>" +
      "<h3>" + esc(lane.name) + ", from " + rows[0].e.date.slice(0, 4) + " to " + rows[rows.length - 1].e.date.slice(0, 4) + "</h3>" +
      '<p class="detail-links"><button type="button" class="link-button" data-go="' + back.id + '">Back to ' + esc(navName(back)) + "</button></p>" +
      "</div></header>";
    var list = '<ol class="thread-list">' + rows.map(function (r) {
      var e = r.e;
      return '<li class="thread-item"><div class="thread-when"><button type="button" data-go="' + e.id + '">' +
        '<span class="v' + (e.kind === "milestone" ? " milestone" : "") + '">' + esc(e.label) + "</span>" +
        '<span class="y">' + esc(fmtDate(e.date, true)) + (e.status ? ", " + e.status : "") + "</span></button></div>" +
        '<ul class="thread-feats">' + r.feats.map(function (f) {
          return "<li><h4>" + inline(f.title) + "</h4>" + pepLinks(f.peps) + "<p>" + inline(f.desc) + "</p></li>";
        }).join("") + "</ul></li>";
    }).join("") + "</ol>";
    return head + list;
  }

  function renderDetail(focus) {
    var el = $("detail");
    el.innerHTML = state.mode === "thread" ? renderThread(state.thread) : renderEntry(byId[state.selected]);
    if (focus) el.focus({ preventScroll: true });
  }

  function initDetailEvents() {
    $("detail").addEventListener("click", function (evt) {
      var go = evt.target.closest("[data-go]");
      if (go) { select(go.getAttribute("data-go"), { scrollToDetail: true }); return; }
      var th = evt.target.closest("[data-thread]");
      if (th) { openThread(th.getAttribute("data-thread")); return; }
      var act = evt.target.closest('[data-action="show-all"]');
      if (act) {
        DATA.lanes.forEach(function (l) { state.lanes.add(l.id); });
        renderChips(); renderChart(); renderDetail(false);
      }
    });
  }

  function scrollDetailIntoView() {
    var el = $("detail");
    var rect = el.getBoundingClientRect();
    if (rect.top < 60 || rect.top > window.innerHeight * 0.6) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Selection & routing                                              */
  /* ---------------------------------------------------------------- */

  function select(id, opts) {
    opts = opts || {};
    if (!byId[id]) return;
    var changed = state.selected !== id || state.mode !== "entry";
    state.selected = id;
    state.mode = "entry";
    state.thread = null;
    if (changed) {
      renderChart();
      updateStrip();
      renderDetail(false);
      try { history.replaceState(null, "", "#" + id); } catch (e) {}
    }
    scrollChartTo(byId[id], true);
    scrollStripTo(id, true);
    if (opts.scrollToDetail) scrollDetailIntoView();
    if (opts.focusLane) {
      var f = $("detail").querySelector('.feature[data-lane="' + opts.focusLane + '"]');
      if (f) {
        f.classList.remove("flash");
        void f.offsetWidth;
        if (!prefersReducedMotion()) f.classList.add("flash");
      }
    }
    if (opts.focusFeature !== undefined) {
      var ff = $("feat-" + id + "-" + opts.focusFeature);
      if (ff) {
        ff.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        if (!prefersReducedMotion()) { ff.classList.remove("flash"); void ff.offsetWidth; ff.classList.add("flash"); }
      }
    }
  }

  function openThread(laneId) {
    state.mode = "thread";
    state.thread = laneId;
    if (!state.lanes.has(laneId)) { state.lanes.add(laneId); renderChips(); }
    renderChart();
    updateStrip();
    renderDetail(true);
    scrollDetailIntoView();
  }

  function fromHash() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (byId[h]) {
      select(h, {});
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------- */
  /* Search                                                           */
  /* ---------------------------------------------------------------- */

  var index = [];
  function buildIndex() {
    entries.forEach(function (e) {
      e.features.forEach(function (f, i) {
        var text = [e.label, e.title || "", "python " + e.label, f.title, f.desc, LANE_BY_ID[f.cat].name,
          f.peps.map(function (n) { return "pep " + n + " pep" + n; }).join(" "),
          f.code ? JSON.stringify(f.code) : ""].join(" ").toLowerCase();
        index.push({ e: e, f: f, i: i, text: text });
      });
    });
  }

  function runSearch(q) {
    state.query = q;
    var box = $("search-results");
    var terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    // Let "pep 484" match as a phrase.
    var joined = q.toLowerCase().trim().replace(/\bpep\s+(\d+)/g, "pep$1");
    if (joined !== q.toLowerCase().trim()) terms = joined.split(/\s+/).filter(Boolean);
    if (!terms.length) {
      state.matches = null;
      box.hidden = true;
      renderChart();
      return;
    }
    var hits = index.filter(function (it) { return terms.every(function (t) { return it.text.indexOf(t) !== -1; }); });
    state.matches = new Set(hits.map(function (h) { return h.e.id + "|" + h.f.cat; }));
    renderChart();
    box.hidden = false;
    if (!hits.length) {
      box.innerHTML = "<p>No features match “" + esc(q) + "”. Try a module name, a keyword or a PEP number.</p>";
      return;
    }
    var shown = hits.slice(0, 24);
    box.innerHTML = "<p>" + hits.length + (hits.length === 1 ? " match" : " matches") + (hits.length > shown.length ? ", showing the first " + shown.length : "") + ". Matching marks are outlined in the chart.</p>" +
      "<ul>" + shown.map(function (h) {
        return '<li><button type="button" data-id="' + h.e.id + '" data-feat="' + h.i + '"><span class="ver">' + esc(h.e.label) + "</span><span>" + inline(h.f.title) + "</span></button></li>";
      }).join("") + "</ul>";
  }

  function initSearch() {
    var input = $("search"), timer;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { runSearch(input.value); }, 120);
    });
    input.addEventListener("keydown", function (evt) {
      if (evt.key === "Escape") { input.value = ""; runSearch(""); }
    });
    $("search-results").addEventListener("click", function (evt) {
      var b = evt.target.closest("button[data-id]");
      if (!b) return;
      var id = b.getAttribute("data-id"), fi = Number(b.getAttribute("data-feat"));
      var feat = byId[id].features[fi];
      if (!state.lanes.has(feat.cat)) { state.lanes.add(feat.cat); renderChips(); }
      // Index of this feature among the currently visible ones.
      var visible = byId[id].features.filter(function (f) { return state.lanes.has(f.cat); });
      state.selected = null;
      select(id, {});
      var vi = visible.indexOf(feat);
      var el = $("feat-" + id + "-" + vi);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
        if (!prefersReducedMotion()) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Python 2 → 3 section                                             */
  /* ---------------------------------------------------------------- */

  function renderPy3() {
    var d = DATA.py2to3;
    $("migration").innerHTML = d.timeline.map(function (t) {
      return "<li><time>" + esc(t.date) + "</time>" + inline(t.text) + "</li>";
    }).join("");
    $("migration-note").innerHTML = "<p>" + inline(d.tools) + "</p>";
    $("changes").innerHTML = d.changes.map(function (c) {
      return '<li class="change"><div class="change-head"><h3>' + inline(c.title) + "</h3>" + pepLinks(c.peps) + "</div>" +
        "<p>" + inline(c.why) + "</p>" +
        '<div class="code-pair">' + codeFigure(c.before, "Python 2", "before", c.lang) + codeFigure(c.after, "Python 3", "after", c.lang) + "</div></li>";
    }).join("");
  }

  /* ---------------------------------------------------------------- */
  /* What's next                                                      */
  /* ---------------------------------------------------------------- */

  function renderLifecycle() {
    var host = $("lifecycle");
    var rows = DATA.lifecycle;
    var W = Math.max(host.clientWidth || 700, 720);
    var left = 56, right = 116, top = 26, rowH = 30, bh = 16;
    var H = top + rows.length * rowH + 22;
    var t0 = 2021, t1 = 2034;
    var x = function (t) { return left + (t - t0) / (t1 - t0) * (W - left - right); };
    var T = function (d) { return yearFrac(parseDate(d)); };
    var todayT = yearFrac(TODAY);

    var s = svg("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, class: "lc-svg", role: "img",
      "aria-label": "Support timeline for Python 3.10 to 3.17, showing bug-fix and security-only periods and today's date." });
    for (var y = t0; y <= t1; y++) {
      svg("line", { x1: x(y), x2: x(y), y1: 16, y2: H - 18, class: "grid", "stroke-opacity": y % 2 ? 0.45 : 1 }, s);
      if (y % 2 === 1 || y === t1) {
        var tx = svg("text", { x: x(y), y: 11, "text-anchor": "middle" }, s);
        tx.textContent = y;
      }
    }
    rows.forEach(function (r, i) {
      var cy = top + i * rowH;
      var ended = T(r.eol) <= todayT;
      var g = svg("g", { class: ended ? "ended" : "" }, s);
      var lv = svg("text", { x: 8, y: cy + bh - 3, class: "lc-ver" }, g);
      lv.textContent = r.v;
      var pc = r.planned ? " planned" : "";
      svg("rect", { x: x(T(r.release)), y: cy, width: x(T(r.bugfixEnd)) - x(T(r.release)), height: bh, rx: 2, class: "bugfix" + pc + (r.expected ? " expected" : "") }, g);
      svg("rect", { x: x(T(r.bugfixEnd)), y: cy, width: x(T(r.eol)) - x(T(r.bugfixEnd)), height: bh, rx: 2, class: "security" + pc + (r.expected ? " expected" : "") }, g);
      var note = svg("text", { x: x(T(r.eol)) + 6, y: cy + bh - 3, class: "lc-note" }, g);
      note.textContent = ended ? "ended " + fmtDate(r.eol, true) : (r.expected ? "expected" : "EOL " + fmtDate(r.eol, true));
    });
    svg("line", { x1: x(todayT), x2: x(todayT), y1: 16, y2: H - 16, class: "today-line" }, s);
    var tl = svg("text", { x: x(todayT), y: H - 3, class: "today-label", "text-anchor": "middle" }, s);
    tl.textContent = "Today";
    host.innerHTML = "";
    host.appendChild(s);
  }

  function renderAhead() {
    var a = DATA.ahead;
    var v316 = byId["v3.16"];
    var accepted = v316.features.filter(function (f) { return f.peps.length; });
    var alpha = v316.features.filter(function (f) { return /^In the alphas/.test(f.title); });

    var html = "";
    html += '<div class="ahead-block"><div class="status-line"><h3>Key dates</h3></div>' +
      '<p class="block-note">From PEP 826 (the 3.16 release schedule) and the developer guide.</p>' +
      '<ul class="date-list">' + a.dates.map(function (d) {
        return "<li><time>" + esc(d.date) + "</time><span>" + inline(d.text) + (d.status === "expected" ? ' <span class="status expected">expected</span>' : "") + "</span></li>";
      }).join("") + "</ul></div>";

    html += '<div class="ahead-block"><div class="status-line"><h3>Coming in 3.16</h3></div>' +
      '<p class="block-note">Alpha features can still change before beta 1 on 4 May 2027.</p><ul class="prop-list">' +
      accepted.map(function (f) {
        return '<li><div class="status-line"><span class="status accepted">Accepted PEP</span></div><h4>' + inline(f.title.replace(/ \(accepted\)$/, "")) + "</h4>" + pepLinks(f.peps) + "<p>" + inline(f.desc) + "</p></li>";
      }).join("") +
      alpha.map(function (f) {
        return '<li><div class="status-line"><span class="status scheduled">In 3.16 alphas</span></div><h4>' + inline(f.title.replace(/^In the alphas: /, "")) + "</h4><p>" + inline(f.desc) + "</p></li>";
      }).join("") +
      '</ul><p style="margin:12px 0 0"><button type="button" class="link-button" data-go="v3.16">See 3.16 on the timeline</button></p></div>';

    html += '<div class="ahead-block wide"><div class="status-line"><h3>Scheduled removals</h3><span class="status scheduled">Scheduled</span></div>' +
      '<p class="block-note">Deprecated features with a fixed removal version, from the official deprecations list. If your code still uses them, it will break when you upgrade.</p>' +
      '<div class="removals">' + a.removals.map(function (r) {
        return "<div><h4>Python " + r.v + "</h4><ul>" + r.items.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div></div>";

    html += '<div class="ahead-block"><div class="status-line"><h3>Stated direction</h3><span class="status direction">No PEP or date yet</span></div>' +
      '<p class="block-note">Goals the core team is clearly working toward, but that no accepted PEP schedules.</p><ul class="prop-list">' +
      a.direction.map(function (d) {
        return "<li><h4>" + inline(d.title) + "</h4>" + pepLinks(d.peps) + "<p>" + inline(d.text) + "</p></li>";
      }).join("") + "</ul></div>";

    html += '<div class="ahead-block"><div class="status-line"><h3>Under discussion</h3><span class="status draft">Draft PEPs</span></div>' +
      '<p class="block-note">Draft PEPs targeting 3.16 that change syntax. Drafts are often rejected or substantially revised, so none of these are certain.</p><ul class="prop-list">' +
      a.discussion.map(function (d) {
        return "<li><h4>" + inline(d.title) + "</h4>" + pepLinks(d.peps) + "<p>" + inline(d.text) + "</p></li>";
      }).join("") + "</ul></div>";

    $("ahead-grid").innerHTML = html;
    $("ahead-grid").addEventListener("click", function (evt) {
      var go = evt.target.closest("[data-go]");
      if (go) {
        select(go.getAttribute("data-go"), {});
        $("timeline").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Boot                                                             */
  /* ---------------------------------------------------------------- */

  function init() {
    tip = $("tooltip");
    initTheme();
    renderRepl();
    renderChips();
    $("lane-chips").addEventListener("click", onChipClick);
    buildIndex();
    renderStrip();
    initStrip();
    initChartEvents();
    initDetailEvents();
    initSearch();
    renderPy3();
    renderLifecycle();
    renderAhead();

    var fromUrl = byId[decodeURIComponent(location.hash.slice(1))];
    if (fromUrl) state.selected = fromUrl.id;
    renderChart();
    updateStrip();
    renderDetail(false);
    requestAnimationFrame(function () {
      scrollChartTo(byId[state.selected], false);
      scrollStripTo(state.selected, false);
      if (fromUrl) $("timeline").scrollIntoView();
    });

    window.addEventListener("hashchange", function () {
      if (fromHash()) $("detail").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    });

    var rt;
    var lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      clearTimeout(rt);
      rt = setTimeout(function () { renderChart(); renderLifecycle(); scrollChartTo(byId[state.selected], false); }, 150);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
