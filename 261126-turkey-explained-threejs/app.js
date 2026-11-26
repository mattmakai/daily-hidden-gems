import { cuts, ideas } from "./guide.js";

const icons = {
  cube: '<path d="m12 2 9 5v10l-9 5-9-5V7zm-9 5 9 5 9-5m-9 5v10M7.5 4.5l9 5"/>',
  book: '<path d="M12 6c-2-2-6-3-10-2v15c4-1 8 0 10 2 2-2 6-3 10-2V4c-4-1-8 0-10 2zm0 0v15"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  hand: '<path d="m8 11-2-5c-.9-2 1.7-3.1 2.5-1.2l3 6-2-8c-.5-1.8 2.4-2.6 2.9-.5l2 7.5-.7-5.2c-.3-2 2.5-2.4 2.9-.4l1.1 6-.1-3c0-2 2.7-2 2.9 0l.6 7c.7 8-7.4 11.3-12.5 6.7l-6-5.5c-1.5-1.6.5-3.5 2-2.4l4 2.7z"/>',
  orbit:
    '<ellipse cx="12" cy="13" rx="10" ry="4" transform="rotate(-16 12 13)"/><path d="M7 10c.4-5 2.1-7 4-7 2.5 0 4.6 3.6 5.3 7.8M8 17c1.4 4 3.1 5 5 4 1.4-.7 2.5-2.4 2.9-4.8"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 5 .3c0 2.2-2.6 2.4-2.6 4.4m0 3h.01"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  next: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m4 12 5 6L20 6"/>',
};
const icon = (name) =>
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
  icons[name] +
  "</svg>";
document
  .querySelectorAll("[data-icon]")
  .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
const $ = (id) => document.getElementById(id);
const removed = new Set();
let model;
const number = (i) => String(i + 1).padStart(2, "0");
const isLocked = (id) =>
  id === "carcass" && cuts.slice(0, 4).some((c) => !removed.has(c.id));
function updateIndex() {
  $("cuts").innerHTML = cuts
    .map(
      (c, i) =>
        `<button class="cut-row ${removed.has(c.id) ? "carved" : ""}" data-cut="${c.id}"><span class="cut-number">${removed.has(c.id) ? icon("check") : number(i)}</span><img src="assets/art/${c.id}.webp" alt=""><span><span class="cut-name">${c.name}</span><span class="cut-sub">${c.short}</span></span><span class="chev">${icon("next")}</span></button>`,
    )
    .join("");
  $("progress-count").textContent = removed.size + " of 5 cuts";
  $("progress-track").innerHTML = cuts
    .map((c) => '<i class="' + (removed.has(c.id) ? "done" : "") + '"></i>')
    .join("");
}
function showIndex(focusId) {
  $("detail-view").hidden = true;
  $("index-view").hidden = false;
  if (focusId)
    $("cuts")
      .querySelector('[data-cut="' + focusId + '"]')
      .focus({ preventScroll: true });
}
function carve(id, moveFocus = false) {
  const c = cuts.find((c) => c.id === id);
  if (!c) return;
  const locked = isLocked(id);
  if (!locked && !removed.has(id)) {
    removed.add(id);
    model?.setCarved(id, true);
    $("announcer").textContent = c.name + " carved. " + c.taste;
  }
  updateIndex();
  $("index-view").hidden = true;
  $("detail-view").hidden = false;
  $("detail-view").innerHTML =
    `<div class="detail"><button id="back" class="back">${icon("next")} All cuts</button><div class="detail-head"><div><span class="type">${number(cuts.indexOf(c))} · ${c.type}</span><h2>${c.name}</h2></div><img alt="" src="assets/art/${c.id}.webp"></div><p>${c.taste}</p><h3>At dinner</h3><p>${c.dinner}</p><h3>For leftovers</h3><p>${c.later}</p>${locked ? '<p class="locked">Carve the four meat cuts to lift out the frame.</p>' : '<button id="restore" class="restore">' + icon("reset") + " Put cut back</button>"}</div>`;
  $("back").onclick = () => showIndex(id);
  if (!locked)
    $("restore").onclick = () => {
      if (removed.has("carcass") && id !== "carcass") {
        removed.delete("carcass");
        model?.setCarved("carcass", false);
      }
      removed.delete(id);
      model?.setCarved(id, false);
      updateIndex();
      showIndex(id);
      $("announcer").textContent = c.name + " returned to the platter.";
    };
  if (moveFocus) $("back").focus({ preventScroll: true });
  if (matchMedia("(max-width:730px)").matches)
    $("detail-view").scrollIntoView({ block: "nearest" });
}
$("cuts").addEventListener("click", (e) => {
  const row = e.target.closest("[data-cut]");
  if (row) carve(row.dataset.cut, true);
});
$("reset").onclick = () => {
  removed.clear();
  model?.reset();
  updateIndex();
  showIndex();
  $("announcer").textContent = "Whole turkey restored.";
};
const dialog = $("dialog");
function openDialog(html) {
  $("dialog-copy").innerHTML = html;
  dialog.showModal();
}
$("close-dialog").onclick = () => dialog.close();
dialog.onclick = (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
};
$("help").onclick = () =>
  openDialog(
    '<p class="overline">The carving board</p><h2 id="dialog-title">How to explore</h2><ol><li>Drag the platter or the space around it to turn the bird.</li><li>Pull a piece away, tap its label, or choose it in the cut index. Its tasting and serving notes appear beside the board.</li><li>Choose <b>All cuts</b> to keep carving. After the four meat cuts, lift out the frame for soup.</li></ol><p>Use <b>Put cut back</b> for one piece, or <b>Reset bird</b> to start again.</p>',
  );
$("credits").onclick = () =>
  openDialog(
    '<h2 id="dialog-title">Credits</h2><p>Carving model adapted from <a href="https://grab3d.com/models/food/roast-turkey/">Roast Turkey by Grab3D</a> (CC0). Meshes were separated for carving, with a new skin texture and a modeled frame. Rendered with <a href="https://threejs.org/">Three.js</a>. Cookbook illustrations and roast texture generated for this guide.</p>',
  );
function renderIdeas() {
  $("ideas").innerHTML = ideas
    .map(
      (i) =>
        `<button class="idea" data-idea="${i.id}" aria-haspopup="dialog"><img src="assets/art/${i.id}.webp" alt=""><span><span class="card-tag">${i.group === "dinner" ? "At dinner" : "Leftovers"}</span><span class="idea-title">${i.name}</span><span class="idea-sub">${i.sub}</span></span></button>`,
    )
    .join("");
}
$("ideas").onclick = (e) => {
  const b = e.target.closest("[data-idea]");
  if (!b) return;
  const i = ideas.find((i) => i.id === b.dataset.idea);
  openDialog(
    `<img src="assets/art/${i.id}.webp" alt=""><p class="overline">${i.group === "dinner" ? "At dinner" : "Leftovers"}</p><h2 id="dialog-title">${i.name}</h2><p>${i.text}</p><button class="dialog-action" id="see-cut">Explore the ${i.cut}</button>`,
  );
  $("see-cut").onclick = () => {
    dialog.close();
    carve(i.cut, true);
    $("board").scrollIntoView({ block: "start" });
  };
};
updateIndex();
renderIdeas();

try {
  const { createBoard } = await import("./board.js");
  model = await createBoard({ onCarve: carve });
  for (const id of removed) model.setCarved(id, true);
  document.querySelector(".poster").hidden = true;
  $("loading").hidden = true;
  $("zoom-out").onclick = () => model.zoom(-1);
  $("zoom-in").onclick = () => model.zoom(1);
} catch (error) {
  console.warn("The carving board could not start.", error);
  $("stage").classList.add("fallback");
  $("markers").replaceChildren();
  document.querySelector(".board-caption").textContent =
    "Choose a cut in the index to uncover its tasting notes.";
  $("loading").textContent =
    "3D view unavailable. Choose a cut in the index to explore.";
  document.querySelector(".bottom-ui").hidden = true;
  document.querySelector(".view-label").textContent = "Carving board";
}
