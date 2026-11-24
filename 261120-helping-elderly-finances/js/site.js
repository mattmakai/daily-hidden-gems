/* Steady Hands — progressive enhancements. Everything works without JS;
   this adds the theme toggle, mobile nav, page TOC, tabs, saved checklists
   and print helpers. Checklist progress is stored only in this browser. */
(function () {
  "use strict";
  var root = document.documentElement;

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ---- Theme ---- */
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function effectiveTheme() {
    return root.getAttribute("data-theme") || (mq && mq.matches ? "dark" : "light");
  }
  function syncThemeButtons() {
    var dark = effectiveTheme() === "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-pressed", String(dark));
      b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store.set("sh-theme", next);
      syncThemeButtons();
    });
  });
  if (mq && mq.addEventListener) mq.addEventListener("change", syncThemeButtons);
  syncThemeButtons();

  /* ---- Current page in nav ---- */
  var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    if ((a.getAttribute("href") || "").toLowerCase() === file) a.setAttribute("aria-current", "page");
  });

  /* ---- Mobile nav ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---- On-this-page TOC ---- */
  var toc = document.getElementById("toc");
  if (toc) {
    var heads = Array.prototype.slice.call(document.querySelectorAll(".content h2[id]"));
    var links = {};
    heads.forEach(function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.getAttribute("data-toc") || h.textContent;
      li.appendChild(a);
      toc.appendChild(li);
      links[h.id] = a;
    });
    if ("IntersectionObserver" in window && heads.length) {
      var visible = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
        var firstVisible = heads.filter(function (h) { return visible[h.id]; })[0];
        if (firstVisible) {
          Object.keys(links).forEach(function (id) { links[id].classList.toggle("active", id === firstVisible.id); });
        }
      }, { rootMargin: "-80px 0px -55% 0px" });
      heads.forEach(function (h) { io.observe(h); });
    }
  }

  /* ---- Saved checklists ---- */
  document.querySelectorAll(".checklist[data-key]").forEach(function (list) {
    var key = "sh-check-" + list.getAttribute("data-key");
    var boxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));
    var saved = [];
    try { saved = JSON.parse(store.get(key) || "[]"); } catch (e) { saved = []; }
    boxes.forEach(function (b, i) { b.checked = !!saved[i]; });

    var head = document.createElement("div");
    head.className = "checklist-head";
    head.innerHTML = '<span class="checklist-count" aria-live="polite"></span>' +
      '<span class="meter" aria-hidden="true"><span></span></span>' +
      '<button type="button" class="link-btn">Reset</button>';
    var title = list.querySelector(".checklist-title");
    if (title) title.insertAdjacentElement("afterend", head); else list.prepend(head);

    var count = head.querySelector(".checklist-count");
    var fill = head.querySelector(".meter span");
    function update() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = n + " of " + boxes.length + " done";
      fill.style.width = (boxes.length ? (n / boxes.length) * 100 : 0) + "%";
      list.classList.toggle("complete", boxes.length > 0 && n === boxes.length);
      store.set(key, JSON.stringify(boxes.map(function (b) { return b.checked ? 1 : 0; })));
    }
    boxes.forEach(function (b) { b.addEventListener("change", update); });
    head.querySelector("button").addEventListener("click", function () {
      boxes.forEach(function (b) { b.checked = false; });
      update();
    });
    update();
  });

  /* ---- Tabs ---- */
  document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") j = 0;
        if (e.key === "End") j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    if (tabs.length) select(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0]);
  });

  /* ---- Print helpers ---- */
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-print");
      var target = sel ? document.querySelector(sel) : null;
      if (target) {
        document.body.classList.add("print-only");
        target.classList.add("print-target");
      }
      window.print();
    });
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("print-only");
    document.querySelectorAll(".print-target").forEach(function (el) { el.classList.remove("print-target"); });
  });
})();
