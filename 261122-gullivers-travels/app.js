(function () {
  "use strict";

  const QUIZ = window.QUIZ || [];
  const SECTIONS = window.QUIZ_SECTIONS || {};
  const STORE_KEY = "gulliver-quiz-v1";
  const LETTERS = ["A", "B", "C", "D"];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------- State ----------------
  let answers = {};
  try { answers = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { answers = {}; }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(answers)); } catch (e) { /* storage blocked: answers still work for this visit */ } }

  // ---------------- Quiz rendering ----------------
  function renderQuizBlocks() {
    $$(".quiz-block").forEach(block => {
      const section = block.dataset.section;
      const qs = QUIZ.filter(q => q.section === section);
      if (!qs.length) return;
      const head = document.createElement("div");
      head.className = "quiz-head";
      head.innerHTML = `<h3>Check your memory</h3><span class="qcount" data-count="${section}"></span>`;
      const list = document.createElement("div");
      list.className = "quiz-list";
      qs.forEach(q => list.appendChild(renderQuestion(q)));
      block.append(head, list);
    });
  }

  // Stable per-question shuffle so the right answer isn't always in the same slot.
  // Stored answers keep the ORIGINAL option index, so this never corrupts saved progress.
  function orderFor(q) {
    if (q._order) return q._order;
    let h = 2166136261;
    for (const c of q.id + "lemuel59") { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
    const order = q.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return (q._order = order);
  }

  function renderQuestion(q) {
    const n = QUIZ.indexOf(q) + 1;
    const el = document.createElement("article");
    el.className = "q";
    el.id = "q-" + q.id;
    el.innerHTML = `
      <div class="qnum">Question ${n} of ${QUIZ.length}</div>
      <div class="qtext" id="qt-${q.id}"></div>
      <div class="opts" role="group" aria-labelledby="qt-${q.id}"></div>
      <div class="explain" aria-live="polite"></div>`;
    $(".qtext", el).textContent = q.q;
    const opts = $(".opts", el);
    orderFor(q).forEach((orig, pos) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.dataset.letter = LETTERS[pos];
      b.dataset.orig = orig;
      b.textContent = q.options[orig];
      b.addEventListener("click", () => choose(q, orig));
      opts.appendChild(b);
    });
    paintQuestion(q, el);
    return el;
  }

  function paintQuestion(q, el = document.getElementById("q-" + q.id)) {
    if (!el) return;
    const chosen = answers[q.id];
    const btns = $$(".opt", el);
    const exp = $(".explain", el);
    btns.forEach(b => {
      const i = +b.dataset.orig;
      b.classList.remove("correct", "wrong", "dim");
      b.disabled = chosen !== undefined;
      b.removeAttribute("aria-pressed");
      if (chosen === undefined) return;
      if (i === q.answer) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
      else b.classList.add("dim");
      if (i === chosen) b.setAttribute("aria-pressed", "true");
    });
    el.classList.toggle("answered", chosen !== undefined);
    if (chosen === undefined) { exp.innerHTML = ""; return; }
    const right = chosen === q.answer;
    exp.innerHTML = right
      ? `<b class="ok">✓ Correct</b><br>`
      : `<b class="no">✗ Not quite</b>. The answer is <b>${LETTERS[orderFor(q).indexOf(q.answer)]}</b>.<br>`;
    exp.appendChild(document.createTextNode(q.explain));
  }

  function choose(q, i) {
    if (answers[q.id] !== undefined) return;
    answers[q.id] = i;
    save();
    paintQuestion(q);
    updateScore();
  }

  // ---------------- Scoring ----------------
  function tally(filterFn = () => true) {
    const qs = QUIZ.filter(filterFn);
    let answered = 0, correct = 0;
    qs.forEach(q => {
      if (answers[q.id] !== undefined) { answered++; if (answers[q.id] === q.answer) correct++; }
    });
    return { total: qs.length, answered, correct };
  }

  function rankFor(pct) {
    if (pct >= 0.95) return ["Wise as a Houyhnhnm", "Practically perfect. You clearly remember the whole book, and how the parts fit together."];
    if (pct >= 0.8) return ["Favourite of the Giant Queen", "Excellent! You know this book really well. Review the few you missed below."];
    if (pct >= 0.6) return ["Nardac of Lilliput", "A solid score. Revisit the sections where you dropped points and you'll have it nailed."];
    if (pct >= 0.4) return ["Ship's Surgeon", "You've got the outline. Re-read the story beats for the voyages with the lowest bars."];
    return ["Shipwrecked Sailor", "Plenty to rediscover! Scroll back through each voyage's story beats, then reset and try again."];
  }

  function updateScore() {
    const all = tally();
    // nav pill + progress bar
    $("#scorepill").textContent = `Score ${all.correct}/${all.total}`;
    $("#progressbar").style.width = (all.answered / all.total * 100) + "%";

    // section counters
    $$("[data-count]").forEach(span => {
      const t = tally(q => q.section === span.dataset.count);
      span.textContent = t.answered ? `${t.correct} of ${t.total} correct · ${t.answered}/${t.total} answered` : `${t.total} questions`;
    });

    // ring
    const C = 2 * Math.PI * 52;
    $("#ring-meter").style.strokeDashoffset = C * (1 - all.correct / all.total);
    $("#score-num").textContent = all.correct;
    $("#score-of").textContent = `out of ${all.total}`;

    const rankEl = $("#rank"), rankText = $("#rank-text");
    if (all.answered === 0) {
      rankEl.textContent = "Not started yet";
      rankText.textContent = "Answer the questions throughout the guide. Your score builds up here as you go.";
    } else if (all.answered < all.total) {
      rankEl.textContent = `${all.answered} of ${all.total} answered`;
      rankText.textContent = `So far you have ${all.correct} correct. ${all.total - all.answered} question${all.total - all.answered === 1 ? "" : "s"} to go before your final rank is revealed.`;
    } else {
      const [title, msg] = rankFor(all.correct / all.total);
      rankEl.textContent = `Rank: ${title}`;
      rankText.textContent = `You scored ${all.correct} out of ${all.total} (${Math.round(all.correct / all.total * 100)}%). ${msg}`;
    }

    // breakdown
    const bd = $("#breakdown");
    bd.innerHTML = "";
    Object.keys(SECTIONS).forEach(key => {
      const t = tally(q => q.section === key);
      const row = document.createElement("div");
      row.className = "bd-row";
      row.innerHTML = `<span></span><div class="bd-track"><span></span></div><span class="num">${t.correct}/${t.total}</span>`;
      row.firstChild.textContent = SECTIONS[key].label;
      const bar = $(".bd-track span", row);
      bar.style.background = SECTIONS[key].color;
      bd.appendChild(row);
      requestAnimationFrame(() => { bar.style.width = (t.correct / t.total * 100) + "%"; });
    });

    // missed questions
    const missed = QUIZ.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.answer);
    const box = $("#missed");
    box.innerHTML = "";
    if (missed.length) {
      const h = document.createElement("h3");
      h.textContent = `Questions to review (${missed.length})`;
      const ul = document.createElement("ul");
      missed.forEach(q => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#q-" + q.id;
        a.innerHTML = `<small></small>`;
        a.firstChild.textContent = `Q${QUIZ.indexOf(q) + 1} · ${SECTIONS[q.section].label}`;
        a.appendChild(document.createTextNode(q.q));
        li.appendChild(a);
        ul.appendChild(li);
      });
      box.append(h, ul);
    }

    // continue button
    const next = QUIZ.find(q => answers[q.id] === undefined);
    const cont = $("#continue-btn");
    if (next) { cont.href = "#q-" + next.id; cont.textContent = all.answered ? "Go to next unanswered question" : "Start with question 1"; }
    else { cont.href = "#top"; cont.textContent = "Back to the beginning"; }
  }

  // Reset: two-step confirmation without a browser dialog
  function setupReset() {
    const btn = $("#reset-btn");
    let armed = false, timer;
    btn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        btn.textContent = "Click again to erase all answers";
        timer = setTimeout(() => { armed = false; btn.textContent = "Reset all answers"; }, 4000);
        return;
      }
      clearTimeout(timer);
      armed = false;
      btn.textContent = "Reset all answers";
      answers = {};
      save();
      QUIZ.forEach(q => paintQuestion(q));
      updateScore();
    });
  }

  // ---------------- Nav highlight ----------------
  function setupNav() {
    const links = $$(".navlinks a");
    const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove("active"));
          const a = map.get(e.target.id);
          if (a) { a.classList.add("active"); a.scrollIntoView({ block: "nearest", inline: "center" }); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }

  // ---------------- Map ----------------
  const PLACES = [
    { id: "england", x: 78, y: 58, real: true, name: "England", part: "Home",
      text: "Gulliver's home. He sails from Bristol, the Downs and Portsmouth, and each time stays only a few months before leaving his wife Mary and their children again." },
    { id: "lilliput", x: 590, y: 405, name: "Lilliput", part: "Part I",
      text: "An island empire of people under six inches tall, in the southern Indian Ocean north-west of Van Diemen's Land. Capital: Mildendo. Gulliver is shipwrecked here in November 1699." },
    { id: "blefuscu", x: 618, y: 387, name: "Blefuscu", part: "Part I",
      text: "Lilliput's rival empire, across a channel only 800 yards wide. Home of the exiled Big-Endians. Gulliver steals its fleet, then later escapes here when Lilliput charges him with treason." },
    { id: "brob", x: 955, y: 112, name: "Brobdingnag", part: "Part II",
      text: "A huge peninsula of giants, cut off from the rest of North America by impassable volcanic mountains. Capital: Lorbrulgrud, \"Pride of the Universe.\" Its king is the wisest ruler in the book." },
    { id: "laputa", x: 900, y: 226, name: "Laputa & Balnibarbi", part: "Part III",
      text: "Laputa is the flying island; Balnibarbi is the kingdom on the ground beneath it, with its capital Lagado and its famous Academy of useless projects." },
    { id: "glubb", x: 849, y: 246, name: "Glubbdubdrib", part: "Part III",
      text: "The small \"island of sorcerers\" south-west of Balnibarbi. Its governor summons ghosts, so Gulliver can question the great figures of history." },
    { id: "lugg", x: 871, y: 276, name: "Luggnagg", part: "Part III",
      text: "A kingdom south-east of Japan. Visitors must lick the dust before the king's throne. Home of the Struldbrugs, who are immortal but miserable." },
    { id: "japan", x: 828, y: 172, real: true, name: "Japan", part: "Part III",
      text: "The only real country Gulliver visits on his travels. He lands at Xamoschi, pretends to be Dutch, and sails home from Nagasaki to Amsterdam." },
    { id: "houy", x: 615, y: 515, name: "Land of the Houyhnhnms", part: "Part IV",
      text: "Somewhere south-west of New Holland (Australia), where Gulliver's mutinous crew dumps him in 1711. He stays about five years, his longest voyage." }
  ];

  function setupMap() {
    const g = $("#pins");
    const info = $("#map-info");
    if (!g) return;
    const NS = "http://www.w3.org/2000/svg";
    PLACES.forEach(p => {
      const pin = document.createElementNS(NS, "g");
      pin.setAttribute("class", "pin");
      pin.setAttribute("tabindex", "0");
      pin.setAttribute("role", "button");
      pin.setAttribute("aria-label", p.name);
      pin.setAttribute("transform", `translate(${p.x} ${p.y})`);
      const fill = p.real ? "#e8eedb" : "#b5ca8d";
      pin.innerHTML = `<circle class="ring" r="10" fill="${fill}" fill-opacity=".25" stroke="${fill}" stroke-width="2"/><circle r="4.5" fill="${fill}"/>`;
      const label = document.createElementNS(NS, "text");
      label.setAttribute("x", 14); label.setAttribute("y", 4);
      label.setAttribute("font-family", "Inter"); label.setAttribute("font-size", p.real ? "0" : "13");
      label.setAttribute("font-weight", "700"); label.setAttribute("fill", "#f4f6ee");
      label.textContent = p.name.split(" & ")[0].replace("Land of the ", "");
      if (p.id === "glubb") { label.setAttribute("x", -14); label.setAttribute("text-anchor", "end"); }
      if (p.id === "brob") { label.setAttribute("x", -14); label.setAttribute("text-anchor", "end"); }
      pin.appendChild(label);
      const activate = () => {
        $$(".pin", g).forEach(x => x.classList.remove("active"));
        pin.classList.add("active");
        info.innerHTML = `<div class="eyebrow"></div><h3></h3><p></p>`;
        info.children[0].textContent = p.part + (p.real ? " · real place" : " · imaginary");
        info.children[1].textContent = p.name;
        info.children[2].textContent = p.text;
      };
      pin.addEventListener("click", activate);
      pin.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
      g.appendChild(pin);
    });
  }

  // ---------------- Scale explorer ----------------
  const SCALES = {
    lilliput: {
      lil: [140, 0.2], gul: [280, 2.4], brob: [400, 0, 0],
      caption: "In Lilliput: Gulliver is 12× taller",
      note: "Gulliver towers over everyone. He can step over the city walls, needs 600 beds sewn together for a mattress, and eats the food of 1,724 people."
    },
    england: {
      lil: [130, 0.017], gul: [190, 0.2], brob: [330, 2.45],
      caption: "All three together",
      note: "Side by side, a Brobdingnagian is 144 times taller than a Lilliputian (12 × 12). The Lilliputian is that tiny dot on the left. Gulliver is exactly in the middle."
    },
    brob: {
      lil: [120, 0, 0], gul: [170, 0.2], brob: [330, 2.45],
      caption: "In Brobdingnag: everyone is 12× taller than Gulliver",
      note: "Now Gulliver is the size of a Lilliputian. Rats are as big as mastiffs, wasps as big as partridges, and a hailstone can knock him flat."
    }
  };

  function setupScale() {
    const btns = $$("[data-scale]");
    const figs = { lil: $("#fig-lil"), gul: $("#fig-gul"), brob: $("#fig-brob") };
    const labels = $$("#scale-svg .scale-label");
    if (!figs.gul) return;
    function apply(key) {
      const s = SCALES[key];
      ["lil", "gul", "brob"].forEach((k, i) => {
        const [x, sc, op] = s[k];
        figs[k].removeAttribute("transform");
        figs[k].style.transform = `translate(${x}px, 300px) scale(${Math.max(sc, 0.001)})`;
        figs[k].style.opacity = op === 0 ? 0 : 1;
        labels[i].setAttribute("x", x);
        labels[i].style.opacity = op === 0 ? 0 : 1;
      });
      $("#scale-caption").textContent = s.caption;
      $("#scale-note").textContent = s.note;
      btns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.scale === key)));
    }
    btns.forEach(b => b.addEventListener("click", () => apply(b.dataset.scale)));
    apply("lilliput");
  }

  // ---------------- Lagado flip cards ----------------
  function setupFlips() {
    $$(".flip").forEach(card => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });
    });
  }

  // ---------------- Struldbrug slider ----------------
  function setupStruldbrug() {
    const slider = $("#age");
    if (!slider) return;
    const spot = $("#s-spot"), spotLabel = $("#s-spot-label"), hair = $("#s-hair"),
          wrinkles = $("#s-wrinkles"), mouth = $("#s-mouth"), face = $("#s-face");
    function update() {
      const a = +slider.value;
      $("#age-num").textContent = a;
      let color = "#c0392b", cname = "red";
      if (a >= 45) { color = "#111"; cname = "coal black"; }
      else if (a >= 25) { color = "#22406e"; cname = "deep blue"; }
      else if (a >= 12) { color = "#4f8a3d"; cname = "green"; }
      spot.setAttribute("fill", color);
      spot.setAttribute("r", a >= 45 ? 9 : 6 + a / 15);
      spotLabel.textContent = "spot: " + cname;
      hair.style.opacity = a < 60 ? 1 : Math.max(0, 1 - (a - 60) / 30);
      hair.setAttribute("fill", a > 50 ? "#bdb6aa" : "#8a7a63");
      wrinkles.style.opacity = a < 40 ? 0 : Math.min(1, (a - 40) / 40);
      face.setAttribute("fill", a > 80 ? "#ddd3c2" : "#e9dcc6");
      mouth.setAttribute("d", a < 30 ? "M80 136 Q100 148 120 136" : a < 80 ? "M80 140 Q100 140 120 140" : "M80 146 Q100 132 120 146");

      let t;
      if (a < 12) t = "A Struldbrug baby is born with a red circular spot over the left eyebrow, the size of a silver threepence. It acts like any other child.";
      else if (a < 25) t = "At twelve the spot turns green. So far, life is normal.";
      else if (a < 30) t = "At twenty-five the spot turns deep blue. Still acting like an ordinary person.";
      else if (a < 45) t = "After about thirty, Struldbrugs grow gloomy and depressed, and it keeps getting worse.";
      else if (a < 80) t = "At forty-five the spot turns coal black and grows to the size of a shilling. They become more and more miserable.";
      else if (a < 90) t = "At eighty they are declared legally dead. Their property goes to their heirs, their marriages are dissolved, and they live on a tiny allowance. They're peevish, greedy, and envious of anyone who gets to die.";
      else if (a < 200) t = "At ninety they lose their teeth and hair and can no longer taste food. They forget the names of their friends, and can't even read, because they forget the start of a sentence before reaching the end.";
      else t = "After two hundred years the language has changed so much that they can't talk to their neighbours. They live like foreigners in their own country, and they are still ageing.";
      $("#age-text").textContent = t;
    }
    slider.addEventListener("input", update);
    update();
  }

  // ---------------- Init ----------------
  renderQuizBlocks();
  updateScore();
  setupReset();
  setupNav();
  setupMap();
  setupScale();
  setupFlips();
  setupStruldbrug();
})();
