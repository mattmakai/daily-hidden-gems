import {
  AGE_GROUPS,
  BODY_SYSTEMS,
  MODALITIES,
  STATUS_META,
  getMatchingGroupsForAge,
  getModalityById
} from './data.js';
import { ZONE_LABELS, renderAnatomySVG } from './anatomy-svg.js';
import { renderModalityIcon, renderMovementSVG } from './movement-svg.js';

/* ==========================================================================
   Application State
   ========================================================================== */

const state = {
  stageId: AGE_GROUPS[0].id,
  exactAge: 15,
  modalityFilter: 'all',
  inspectedExerciseId: null,
  dialogExerciseId: null,
  dialogPhase: 0,
  isPlayingMotion: false,
  motionTimer: null
};

/* ==========================================================================
   DOM References
   ========================================================================== */

const els = {
  colorSchemeMeta: document.querySelector('meta[name="color-scheme"]'),
  themeToggle: document.getElementById('theme-toggle'),
  ageSlider: document.getElementById('age-slider'),
  ageOutput: document.getElementById('age-output'),
  ageMatchSummary: document.getElementById('age-match-summary'),
  ageMatchChips: document.getElementById('age-match-chips'),
  stageTablist: document.getElementById('stage-tablist'),
  stageTabs: Array.from(document.querySelectorAll('.stage-tab')),
  stagePanel: document.getElementById('stage-panel'),

  stageEyebrow: document.getElementById('stage-eyebrow'),
  stageTitle: document.getElementById('stage-title'),
  stageTagline: document.getElementById('stage-tagline'),
  stageOverview: document.getElementById('stage-overview'),
  stageRhythm: document.getElementById('stage-rhythm'),
  stageEffort: document.getElementById('stage-effort'),
  stageFocusList: document.getElementById('stage-focus-list'),
  stageGuardrailList: document.getElementById('stage-guardrail-list'),
  stageSourceWebp: document.getElementById('stage-source-webp'),
  stageImage: document.getElementById('stage-image'),
  stageCaption: document.getElementById('stage-caption'),

  mixStageLabel: document.getElementById('mix-stage-label'),
  mixGrid: document.getElementById('mix-grid'),
  modalityFilters: document.getElementById('modality-filters'),
  exerciseGrid: document.getElementById('exercise-grid'),
  exerciseEmpty: document.getElementById('exercise-empty'),
  emptyMessage: document.getElementById('empty-message'),
  resetFilterBtn: document.getElementById('reset-filter-btn'),

  anatomyKicker: document.getElementById('anatomy-kicker'),
  anatomyPanelTitle: document.getElementById('anatomy-panel-title'),
  anatomyResetBtn: document.getElementById('anatomy-reset-btn'),
  anatomySvgHost: document.getElementById('anatomy-svg-host'),
  anatomyHeadline: document.getElementById('anatomy-headline'),
  anatomyMechanisms: document.getElementById('anatomy-mechanisms'),

  matrixHeadRow: document.getElementById('matrix-head-row'),
  matrixBody: document.getElementById('matrix-body'),
  liveAnnouncer: document.getElementById('live-announcer'),

  dialog: document.getElementById('exercise-dialog'),
  dialogClose: document.getElementById('dialog-close'),
  dialogModalityPill: document.getElementById('dialog-modality-pill'),
  dialogStagePill: document.getElementById('dialog-stage-pill'),
  dialogTitle: document.getElementById('dialog-title'),
  dialogMovementHost: document.getElementById('dialog-movement-host'),
  phasePlayBtn: document.getElementById('phase-play-btn'),
  phasePlayIcon: document.getElementById('phase-play-icon'),
  phasePlayLabel: document.getElementById('phase-play-label'),
  phaseControls: document.getElementById('phase-controls'),
  phaseActiveCue: document.getElementById('phase-active-cue'),
  dialogZoneCount: document.getElementById('dialog-zone-count'),
  dialogAnatomyHost: document.getElementById('dialog-anatomy-host'),
  dialogZoneTags: document.getElementById('dialog-zone-tags'),
  dialogEffort: document.getElementById('dialog-effort'),
  dialogFrequency: document.getElementById('dialog-frequency'),
  dialogWhyAgeLabel: document.getElementById('dialog-why-age-label'),
  dialogWhyText: document.getElementById('dialog-why-text'),
  dialogImpactHeadline: document.getElementById('dialog-impact-headline'),
  dialogMechanisms: document.getElementById('dialog-mechanisms'),
  dialogSteps: document.getElementById('dialog-steps'),
  dialogEasier: document.getElementById('dialog-easier'),
  dialogHarder: document.getElementById('dialog-harder'),
  dialogPrev: document.getElementById('dialog-prev'),
  dialogNext: document.getElementById('dialog-next'),
  dialogCounter: document.getElementById('dialog-counter')
};

/* ==========================================================================
   Utilities
   ========================================================================== */

function getCurrentGroup() {
  return AGE_GROUPS.find((g) => g.id === state.stageId) || AGE_GROUPS[0];
}

function announce(message) {
  els.liveAnnouncer.textContent = '';
  requestAnimationFrame(() => {
    els.liveAnnouncer.textContent = message;
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* ==========================================================================
   1. Two-State System-Aware Theme Toggle (modern-web-guidance compliant)
   ========================================================================== */

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getRenderedScheme() {
  const metaContent = els.colorSchemeMeta?.content;
  if (metaContent === 'light' || metaContent === 'dark') {
    return metaContent;
  }
  return darkMediaQuery.matches ? 'dark' : 'light';
}

function applySchemeOverride(schemeOrNull) {
  if (!els.colorSchemeMeta) return;
  if (schemeOrNull === 'light' || schemeOrNull === 'dark') {
    els.colorSchemeMeta.content = schemeOrNull;
  } else {
    els.colorSchemeMeta.content = 'light dark';
  }
}

function initThemeToggle() {
  els.themeToggle?.addEventListener('click', () => {
    const rendered = getRenderedScheme();
    const target = rendered === 'dark' ? 'light' : 'dark';
    const systemScheme = darkMediaQuery.matches ? 'dark' : 'light';

    if (target !== systemScheme) {
      applySchemeOverride(target);
      try {
        localStorage.setItem('color-scheme', target);
      } catch {
        // Storage unavailable; override still applied for this session.
      }
      announce(`Switched to ${target} theme.`);
    } else {
      // Returning to system preference — remove stored value rather than pinning.
      applySchemeOverride(null);
      try {
        localStorage.removeItem('color-scheme');
      } catch {}
      announce(`Switched to ${target} theme, matching system preference.`);
    }
  });

  // Sync manual scheme override across open tabs
  window.addEventListener('storage', (event) => {
    if (event.key !== 'color-scheme') return;
    if (event.newValue === 'light' || event.newValue === 'dark') {
      applySchemeOverride(event.newValue);
    } else {
      applySchemeOverride(null);
    }
  });
}

/* ==========================================================================
   2. Exact-Age Finder & Overlapping Stage Highlighter
   ========================================================================== */

function updateSliderFallbackProgress() {
  if (CSS.supports('accent-color', '#9e2a2b')) return;
  const min = Number(els.ageSlider.min);
  const max = Number(els.ageSlider.max);
  const val = Number(els.ageSlider.value);
  const pct = ((val - min) / (max - min)) * 100;
  els.ageSlider.style.setProperty('--progress', `${pct}%`);
}

function renderAgeMatcher(age, { autoSwitchStage = false } = {}) {
  state.exactAge = age;
  els.ageOutput.textContent = age >= 85 ? '85+ yrs' : `${age} yrs`;
  updateSliderFallbackProgress();

  const matches = getMatchingGroupsForAge(age);
  const matchIds = new Set(matches.map((m) => m.id));

  for (const tab of els.stageTabs) {
    tab.classList.toggle('is-age-match', matchIds.has(tab.dataset.stage));
  }

  const ageLabel = age >= 85 ? '85+' : String(age);
  if (matches.length === 1) {
    els.ageMatchSummary.innerHTML = `Age <strong>${ageLabel}</strong> fits 1 age stage:`;
  } else if (matches.length > 1) {
    els.ageMatchSummary.innerHTML = `Age <strong>${ageLabel}</strong> fits ${matches.length} overlapping stages:`;
  }

  els.ageMatchChips.innerHTML = matches
    .map((m) => {
      const isCurrent = m.id === state.stageId;
      const shortName = MATRIX_SHORT_LABELS[m.id] || m.title;
      return `<button type="button" class="match-chip-btn" data-match-stage="${m.id}"${isCurrent ? ' aria-current="true"' : ''}>
        <span>${escapeHtml(m.label)}</span>
        <span>· ${escapeHtml(shortName)}</span>
      </button>`;
    })
    .join('');

  if (autoSwitchStage && matches.length > 0 && !matchIds.has(state.stageId)) {
    selectStage(matches[0].id, { fromSlider: true });
  }
}

/* ==========================================================================
   3. Lifespan Tablist (Keyboard Fallback + Scroll Fade Fallback + View Transitions)
   ========================================================================== */

function initTablistEnhancements() {
  // Click delegation on tabs
  els.stageTablist.addEventListener('click', (event) => {
    const tab = event.target.closest('.stage-tab');
    if (!tab) return;
    selectStage(tab.dataset.stage, { focusTab: false });
  });

  // Keyboard arrow navigation fallback when native focusgroup isn't present
  const hasNativeFocusgroup = Object.hasOwn(HTMLElement.prototype, 'focusGroup');
  if (!hasNativeFocusgroup) {
    syncRovingTabindex();
    els.stageTablist.addEventListener('keydown', (event) => {
      const currentIndex = els.stageTabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % els.stageTabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + els.stageTabs.length) % els.stageTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = els.stageTabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        const nextTab = els.stageTabs[nextIndex];
        selectStage(nextTab.dataset.stage, { focusTab: true });
      }
    });
  }

  // IntersectionObserver edge-fade fallback for browsers without animation-timeline: scroll()
  if (!CSS.supports('animation-timeline', 'scroll()')) {
    const scroller = els.stageTablist;
    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (first && last) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const { target, intersectionRatio } of entries) {
            scroller.classList.toggle(
              target === first ? 'more-start' : 'more-end',
              intersectionRatio < 1
            );
          }
        },
        { root: scroller, threshold: 1, rootMargin: '1px' }
      );
      observer.observe(first);
      observer.observe(last);
    }
  }
}

function syncRovingTabindex() {
  if (Object.hasOwn(HTMLElement.prototype, 'focusGroup')) return;
  for (const tab of els.stageTabs) {
    tab.tabIndex = tab.dataset.stage === state.stageId ? 0 : -1;
  }
}

function scrollTabIntoViewHorizontally(tab) {
  const scroller = els.stageTablist;
  if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
  const tabLeft = tab.offsetLeft;
  const tabRight = tabLeft + tab.offsetWidth;
  const pad = 44;
  if (tabLeft - pad < scroller.scrollLeft) {
    scroller.scrollTo({ left: Math.max(0, tabLeft - pad), behavior: 'smooth' });
  } else if (tabRight + pad > scroller.scrollLeft + scroller.clientWidth) {
    scroller.scrollTo({ left: tabRight + pad - scroller.clientWidth, behavior: 'smooth' });
  }
}

function selectStage(stageId, { fromSlider = false, focusTab = false, updateHash = true } = {}) {
  const targetGroup = AGE_GROUPS.find((g) => g.id === stageId);
  if (!targetGroup) return;

  const isChanging = state.stageId !== targetGroup.id;
  state.stageId = targetGroup.id;
  state.modalityFilter = 'all';
  state.inspectedExerciseId = null;

  const applyDOM = () => {
    for (const tab of els.stageTabs) {
      const selected = tab.dataset.stage === targetGroup.id;
      tab.setAttribute('aria-selected', String(selected));
      tab.toggleAttribute('focusgroupstart', selected);
      if (selected) {
        els.stagePanel.setAttribute('aria-labelledby', tab.id);
        scrollTabIntoViewHorizontally(tab);
      }
    }
    syncRovingTabindex();
    renderStage(targetGroup);
    renderMatrixHighlight();

    // Update age-matcher chip highlight without overriding the slider value if user is dragging
    if (!fromSlider) {
      renderAgeMatcher(state.exactAge, { autoSwitchStage: false });
    } else {
      for (const chip of els.ageMatchChips.querySelectorAll('.match-chip-btn')) {
        if (chip.dataset.matchStage === targetGroup.id) {
          chip.setAttribute('aria-current', 'true');
        } else {
          chip.removeAttribute('aria-current');
        }
      }
    }
  };

  if (isChanging && !fromSlider && document.startViewTransition) {
    const transition = document.startViewTransition(() => applyDOM());
    transition.ready.catch(() => {});
    transition.finished
      .catch(() => {})
      .finally(() => {
        if (focusTab) {
          document.getElementById(`tab-${targetGroup.id}`)?.focus();
        }
      });
  } else {
    applyDOM();
    if (focusTab) {
      document.getElementById(`tab-${targetGroup.id}`)?.focus();
    }
  }

  document.title = `${targetGroup.title} (${targetGroup.label}) | Exercise by Age Explainer`;

  if (updateHash && window.location.hash !== `#age-${targetGroup.id}`) {
    history.replaceState(null, '', `#age-${targetGroup.id}`);
  }

  if (isChanging) {
    announce(`Showing ${targetGroup.title}, ages ${targetGroup.label}.`);
  }
}

/* ==========================================================================
   4. Stage Hero, Training Mix, Exercises & Live Body-Impact Atlas
   ========================================================================== */

function renderStage(group) {
  // Editorial Hero
  els.stageEyebrow.textContent = group.eyebrow;
  els.stageTitle.textContent = group.title;
  els.stageTagline.textContent = group.tagline;
  els.stageOverview.textContent = group.physiologyOverview;
  els.stageRhythm.textContent = group.weeklyRhythm;
  els.stageEffort.textContent = group.effortTarget;

  els.stageFocusList.innerHTML = group.focusBullets
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  els.stageGuardrailList.innerHTML = group.guardrails
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  els.stageSourceWebp.srcset = `${group.imageBase}-640.webp 640w, ${group.imageBase}.webp 1280w`;
  els.stageImage.src = `${group.imageBase}.jpg`;
  els.stageImage.alt = group.imageAlt;
  els.stageCaption.textContent = `Plate ${group.stageNum} · ${group.title} (${group.label})`;

  els.mixStageLabel.textContent = `Ages ${group.label}`;

  renderTrainingMix(group);
  renderModalityFilters(group);
  renderExercises(group);
  renderAnatomyPanel(group, null);
}

function renderTrainingMix(group) {
  els.mixGrid.innerHTML = MODALITIES.map((mod) => {
    const data = group.mix[mod.id];
    const statusInfo = STATUS_META[data.status];
    const isPressed = state.modalityFilter === mod.id;

    return `
      <div role="listitem">
        <button
          type="button"
          class="mix-card"
          data-filter-modality="${mod.id}"
          aria-pressed="${isPressed}"
        >
          <div class="mix-card-top">
            <span class="mix-name-wrap">
              <span class="mix-icon-badge">${renderModalityIcon(mod.id, { size: 18 })}</span>
              <span>${escapeHtml(mod.name)}</span>
            </span>
            <span class="status-pill status-${statusInfo.tone}">
              <span aria-hidden="true">${statusInfo.symbol}</span>
              <span>${escapeHtml(statusInfo.label)}</span>
            </span>
          </div>
          <div class="mix-bar-track" aria-hidden="true">
            <div class="mix-bar-fill tone-${statusInfo.tone}" style="--score: ${data.score}%"></div>
          </div>
          <p class="mix-note">${escapeHtml(data.note)}</p>
        </button>
      </div>
    `;
  }).join('');
}

function renderModalityFilters(group) {
  const counts = {};
  for (const ex of group.exercises) {
    counts[ex.modality] = (counts[ex.modality] || 0) + 1;
  }

  const pills = [
    { id: 'all', label: 'All Exercises', count: group.exercises.length },
    ...MODALITIES.map((m) => ({
      id: m.id,
      label: m.shortName,
      count: counts[m.id] || 0
    }))
  ];

  els.modalityFilters.innerHTML = pills
    .map((p) => {
      const pressed = state.modalityFilter === p.id;
      return `
        <button
          type="button"
          class="filter-pill"
          data-filter="${p.id}"
          aria-pressed="${pressed}"
        >
          ${p.id !== 'all' ? renderModalityIcon(p.id, { size: 15 }) : ''}
          <span>${escapeHtml(p.label)}</span>
          <span class="filter-count">(${p.count})</span>
        </button>
      `;
    })
    .join('');
}

function setModalityFilter(modalityId) {
  const group = getCurrentGroup();
  state.modalityFilter = state.modalityFilter === modalityId && modalityId !== 'all' ? 'all' : modalityId;
  state.inspectedExerciseId = null;

  renderTrainingMix(group);
  renderModalityFilters(group);
  renderExercises(group);
  renderAnatomyPanel(group, null);

  const label =
    state.modalityFilter === 'all'
      ? `all ${group.exercises.length} exercises`
      : `${getModalityById(state.modalityFilter)?.name || state.modalityFilter} exercises`;
  announce(`Filtered to ${label} for ages ${group.label}.`);
}

function renderExercises(group) {
  const list =
    state.modalityFilter === 'all'
      ? group.exercises
      : group.exercises.filter((ex) => ex.modality === state.modalityFilter);

  if (list.length === 0) {
    const mod = getModalityById(state.modalityFilter);
    const modNote = group.mix[state.modalityFilter]?.note || '';
    els.exerciseGrid.innerHTML = '';
    els.exerciseEmpty.hidden = false;
    els.emptyMessage.innerHTML = `<strong>${escapeHtml(mod?.name || 'This modality')}</strong> is intentionally scaled back for ages ${escapeHtml(group.label)} (${escapeHtml(modNote)}). Explore the core exercises for this stage instead.`;
    return;
  }

  els.exerciseEmpty.hidden = true;
  els.exerciseGrid.innerHTML = list
    .map((ex) => {
      const mod = getModalityById(ex.modality);
      const isActive = state.inspectedExerciseId === ex.id;
      const sysChips = ex.bodyImpact.systems
        .map((sId) => {
          const sys = BODY_SYSTEMS[sId];
          if (!sys) return '';
          return `<span class="sys-chip"><span class="sys-dot" style="background: ${sys.colorVar}" aria-hidden="true"></span>${escapeHtml(sys.shortName)}</span>`;
        })
        .join('');

      return `
        <article class="exercise-card${isActive ? ' is-highlighted' : ''}" data-exercise-id="${ex.id}">
          <div class="exercise-card-visual">
            ${renderMovementSVG(ex.motionType, 1, '', { decorative: true })}
          </div>
          <div class="exercise-card-body">
            <div class="exercise-card-meta">
              <span class="modality-pill mod-${ex.modality}">
                ${renderModalityIcon(ex.modality, { size: 13 })}
                <span>${escapeHtml(mod?.shortName || ex.modality)}</span>
              </span>
              <span class="effort-tag">${escapeHtml(ex.frequency)}</span>
            </div>
            <h3 class="exercise-card-title">${escapeHtml(ex.name)}</h3>
            <p class="exercise-card-summary">${escapeHtml(ex.summary)}</p>
            <div class="system-chips" aria-label="Target body systems">${sysChips}</div>
            <button type="button" class="card-cta-btn" data-open-exercise="${ex.id}">
              <span>Walk Through &amp; Body Impact</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderAnatomyPanel(group, exercise) {
  if (exercise) {
    state.inspectedExerciseId = exercise.id;
    els.anatomyKicker.textContent = 'Exercise Body Impact';
    els.anatomyPanelTitle.textContent = exercise.name;
    els.anatomyResetBtn.hidden = false;

    els.anatomySvgHost.innerHTML = renderAnatomySVG({
      activeZones: exercise.bodyImpact.zones,
      activeSystems: exercise.bodyImpact.systems,
      title: `Body systems improved by ${exercise.name}`,
      idPrefix: 'panel-anat'
    });

    els.anatomyHeadline.textContent = exercise.bodyImpact.headline;
    els.anatomyMechanisms.innerHTML = exercise.bodyImpact.mechanisms
      .map((m) => {
        const sysName = BODY_SYSTEMS[m.system]?.shortName || m.system;
        return `<li data-system="${m.system}"><strong>${escapeHtml(sysName)}:</strong> ${escapeHtml(m.text)}</li>`;
      })
      .join('');
  } else {
    state.inspectedExerciseId = null;
    const allZones = [...new Set(group.exercises.flatMap((e) => e.bodyImpact.zones))];
    const allSystems = [...new Set(group.exercises.flatMap((e) => e.bodyImpact.systems))];

    els.anatomyKicker.textContent = `Full Stage Overview · Ages ${group.label}`;
    els.anatomyPanelTitle.textContent = group.title;
    els.anatomyResetBtn.hidden = true;

    els.anatomySvgHost.innerHTML = renderAnatomySVG({
      activeZones: allZones,
      activeSystems: allSystems,
      title: `Full-body adaptation profile for ${group.title} (${group.label})`,
      idPrefix: 'panel-anat'
    });

    els.anatomyHeadline.textContent = `Hover or focus any exercise card to isolate its exact physiological adaptations.`;
    els.anatomyMechanisms.innerHTML = group.focusBullets
      .map((bullet, idx) => {
        const sysKey = idx === 0 ? 'muscular' : idx === 1 ? 'skeletal' : 'cardiovascular';
        return `<li data-system="${sysKey}">${escapeHtml(bullet)}</li>`;
      })
      .join('');
  }

  for (const card of els.exerciseGrid.querySelectorAll('.exercise-card')) {
    card.classList.toggle('is-highlighted', card.dataset.exerciseId === state.inspectedExerciseId);
  }
}

/* ==========================================================================
   5. Full Lifespan Comparison Matrix
   ========================================================================== */

const MATRIX_SHORT_LABELS = {
  '10-18': 'Adolescent',
  '17-28': 'Athletic Prime',
  '25-39': 'Metabolic',
  '38-52': 'Longevity',
  '50-65': 'Bone & Power',
  '63-75': 'Independence',
  '75-plus': 'Mobility'
};

const MATRIX_CELL_SHORT = {
  core: 'Core Pillar',
  high: 'High Priority',
  moderate: 'Supportive',
  adapt: 'Adapt',
  caution: 'Skip / Swap'
};

function buildLifespanMatrix() {
  // Header columns
  const headCols = AGE_GROUPS.map(
    (g) => `
      <th scope="col">
        <button type="button" class="matrix-col-btn" data-matrix-stage="${g.id}">
          <span>${escapeHtml(g.label)}</span>
          <span class="matrix-col-sub">${escapeHtml(MATRIX_SHORT_LABELS[g.id] || g.title)}</span>
        </button>
      </th>
    `
  ).join('');
  els.matrixHeadRow.innerHTML = `<th scope="col">Exercise Modality</th>${headCols}`;

  // Body rows
  els.matrixBody.innerHTML = MODALITIES.map((mod) => {
    const cells = AGE_GROUPS.map((g) => {
      const entry = g.mix[mod.id];
      const meta = STATUS_META[entry.status];
      return `
        <td data-col-stage="${g.id}">
          <span class="matrix-cell-badge status-${meta.tone}">
            <span aria-hidden="true">${meta.symbol}</span>
            <span>${escapeHtml(MATRIX_CELL_SHORT[entry.status] || meta.label)}</span>
          </span>
        </td>
      `;
    }).join('');

    return `
      <tr>
        <th scope="row">
          <span class="matrix-row-label">
            ${renderModalityIcon(mod.id, { size: 17 })}
            <span>${escapeHtml(mod.name)}</span>
          </span>
        </th>
        ${cells}
      </tr>
    `;
  }).join('');

  els.matrixHeadRow.addEventListener('click', (event) => {
    const btn = event.target.closest('.matrix-col-btn');
    if (!btn) return;
    selectStage(btn.dataset.matrixStage);
    document.getElementById('stage-explorer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function renderMatrixHighlight() {
  for (const btn of els.matrixHeadRow.querySelectorAll('.matrix-col-btn')) {
    if (btn.dataset.matrixStage === state.stageId) {
      btn.setAttribute('aria-current', 'true');
    } else {
      btn.removeAttribute('aria-current');
    }
  }
  for (const cell of els.matrixBody.querySelectorAll('td[data-col-stage]')) {
    cell.classList.toggle('is-active-col', cell.dataset.colStage === state.stageId);
  }
}

/* ==========================================================================
   6. Native <dialog> Exercise Walkthrough + Top-Layer & closedby Fallbacks
   ========================================================================== */

let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay());
}

async function closeTopLayer(dialog) {
  stopMotionPlayback();
  if (!dialog.open) return;

  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 400))
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }

  dialog.close();
}

function stopMotionPlayback() {
  if (state.motionTimer) {
    clearInterval(state.motionTimer);
    state.motionTimer = null;
  }
  state.isPlayingMotion = false;
  if (els.phasePlayIcon) els.phasePlayIcon.textContent = '▶';
  if (els.phasePlayLabel) els.phasePlayLabel.textContent = 'Play Motion';
}

function toggleMotionPlayback() {
  if (state.isPlayingMotion) {
    stopMotionPlayback();
    return;
  }
  state.isPlayingMotion = true;
  els.phasePlayIcon.textContent = '⏸';
  els.phasePlayLabel.textContent = 'Pause Motion';

  state.motionTimer = setInterval(() => {
    const nextPhase = (state.dialogPhase + 1) % 3;
    setDialogPhase(nextPhase, { keepPlaying: true });
  }, 1500);
}

function getCurrentDialogExercise() {
  const group = getCurrentGroup();
  return group.exercises.find((e) => e.id === state.dialogExerciseId) || group.exercises[0];
}

function setDialogPhase(phaseIndex, { keepPlaying = false } = {}) {
  if (!keepPlaying) stopMotionPlayback();
  const ex = getCurrentDialogExercise();
  if (!ex) return;

  state.dialogPhase = Math.max(0, Math.min(2, phaseIndex));
  const step = ex.steps[state.dialogPhase];

  els.dialogMovementHost.innerHTML = renderMovementSVG(
    ex.motionType,
    state.dialogPhase,
    `${ex.name}, phase ${state.dialogPhase + 1}: ${step.phase} — ${step.cue}`
  );

  const buttons = els.phaseControls.querySelectorAll('.phase-btn');
  buttons.forEach((btn, idx) => {
    btn.textContent = `${idx + 1} · ${ex.steps[idx]?.phase || `Phase ${idx + 1}`}`;
    btn.setAttribute('aria-pressed', String(idx === state.dialogPhase));
  });

  els.phaseActiveCue.innerHTML = `<strong>${escapeHtml(step.phase)}:</strong> ${escapeHtml(step.cue)}`;

  for (const stepBtn of els.dialogSteps.querySelectorAll('.step-item-btn')) {
    const idx = Number(stepBtn.dataset.stepIndex);
    if (idx === state.dialogPhase) {
      stepBtn.setAttribute('aria-current', 'step');
    } else {
      stepBtn.removeAttribute('aria-current');
    }
  }
}

function populateDialog(group, exercise) {
  stopMotionPlayback();
  state.dialogExerciseId = exercise.id;
  state.dialogPhase = 0;

  const mod = getModalityById(exercise.modality);
  const idx = group.exercises.findIndex((e) => e.id === exercise.id);

  els.dialogModalityPill.className = `modality-pill mod-${exercise.modality}`;
  els.dialogModalityPill.innerHTML = `${renderModalityIcon(exercise.modality, { size: 14 })}<span>${escapeHtml(mod?.name || exercise.modality)}</span>`;
  els.dialogStagePill.textContent = `${group.title} · Ages ${group.label}`;
  els.dialogTitle.textContent = exercise.name;

  els.dialogEffort.textContent = exercise.effort;
  els.dialogFrequency.textContent = exercise.frequency;
  els.dialogWhyAgeLabel.textContent = `Ages ${group.label}`;
  els.dialogWhyText.textContent = exercise.whyThisAge;
  els.dialogImpactHeadline.textContent = exercise.bodyImpact.headline;

  els.dialogMechanisms.innerHTML = exercise.bodyImpact.mechanisms
    .map((m) => {
      const sysName = BODY_SYSTEMS[m.system]?.name || m.system;
      return `<li data-system="${m.system}"><strong>${escapeHtml(sysName)}:</strong> ${escapeHtml(m.text)}</li>`;
    })
    .join('');

  els.dialogSteps.innerHTML = exercise.steps
    .map(
      (s, stepIdx) => `
        <li>
          <button type="button" class="step-item-btn" data-step-index="${stepIdx}"${stepIdx === 0 ? ' aria-current="step"' : ''}>
            <span class="step-num" aria-hidden="true">${stepIdx + 1}</span>
            <span><strong>${escapeHtml(s.phase)}:</strong> ${escapeHtml(s.cue)}</span>
          </button>
        </li>
      `
    )
    .join('');

  els.dialogEasier.textContent = exercise.easier;
  els.dialogHarder.textContent = exercise.harder;

  els.dialogZoneCount.textContent = `${exercise.bodyImpact.zones.length} active regions`;
  els.dialogAnatomyHost.innerHTML = renderAnatomySVG({
    activeZones: exercise.bodyImpact.zones,
    activeSystems: exercise.bodyImpact.systems,
    title: `Active anatomy for ${exercise.name}`,
    idPrefix: 'dialog-anat'
  });
  els.dialogZoneTags.innerHTML = exercise.bodyImpact.zones
    .map((z) => `<li>${escapeHtml(ZONE_LABELS[z] || z)}</li>`)
    .join('');

  els.dialogCounter.textContent = `Exercise ${idx + 1} of ${group.exercises.length}`;

  setDialogPhase(0);
}

function openExerciseDialog(exerciseId) {
  const group = getCurrentGroup();
  const ex = group.exercises.find((e) => e.id === exerciseId);
  if (!ex) return;

  populateDialog(group, ex);
  els.dialog.removeAttribute('data-closing');
  els.dialog.showModal();
  els.dialogClose.focus();
}

function initDialogEvents() {
  els.dialogClose.addEventListener('click', () => closeTopLayer(els.dialog));

  // Route native cancel requests (Esc, closedby) through top-layer exit fallback when needed
  els.dialog.addEventListener('cancel', (event) => {
    if (!supportsTopLayerExit()) {
      event.preventDefault();
      closeTopLayer(els.dialog);
    } else {
      stopMotionPlayback();
    }
  });

  // Always clear returnValue & playback timer on close
  els.dialog.addEventListener('close', () => {
    stopMotionPlayback();
    els.dialog.removeAttribute('data-closing');
    els.dialog.returnValue = '';
  });

  // Light-dismiss fallback for browsers without native <dialog closedby="any">
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    els.dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutside(e, els.dialog);
    });
    els.dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutside(e, els.dialog)) {
        closeTopLayer(els.dialog);
      }
      pressedOutside = false;
    });
  }

  // Phase controls + Play/Pause
  els.phaseControls.addEventListener('click', (event) => {
    const btn = event.target.closest('.phase-btn');
    if (!btn) return;
    setDialogPhase(Number(btn.dataset.phase));
  });

  els.dialogSteps.addEventListener('click', (event) => {
    const btn = event.target.closest('.step-item-btn');
    if (!btn) return;
    setDialogPhase(Number(btn.dataset.stepIndex));
  });

  els.phasePlayBtn.addEventListener('click', toggleMotionPlayback);

  // Previous / Next exercise navigation inside the stage
  const stepExercise = (delta) => {
    const group = getCurrentGroup();
    const currentIdx = group.exercises.findIndex((e) => e.id === state.dialogExerciseId);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + delta + group.exercises.length) % group.exercises.length;
    populateDialog(group, group.exercises[nextIdx]);
  };

  els.dialogPrev.addEventListener('click', () => stepExercise(-1));
  els.dialogNext.addEventListener('click', () => stepExercise(1));
}

/* ==========================================================================
   7. Global Delegated Listeners & Bootstrap
   ========================================================================== */

function initInteractions() {
  // Exact-age slider
  els.ageSlider.addEventListener('input', (event) => {
    renderAgeMatcher(Number(event.target.value), { autoSwitchStage: true });
  });

  // Clicking an overlapping stage match chip
  els.ageMatchChips.addEventListener('click', (event) => {
    const chip = event.target.closest('.match-chip-btn');
    if (!chip) return;
    selectStage(chip.dataset.matchStage, { fromSlider: true });
  });

  // Training mix card click filters exercises
  els.mixGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.mix-card');
    if (!card) return;
    setModalityFilter(card.dataset.filterModality);
    document.getElementById('body-atlas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Modality filter bar click
  els.modalityFilters.addEventListener('click', (event) => {
    const pill = event.target.closest('.filter-pill');
    if (!pill) return;
    setModalityFilter(pill.dataset.filter);
  });

  // Reset filter button in empty state
  els.resetFilterBtn.addEventListener('click', () => setModalityFilter('all'));

  // Exercise grid hover/focus -> update live anatomical atlas; click -> open modal
  els.exerciseGrid.addEventListener('pointerover', (event) => {
    const card = event.target.closest('.exercise-card');
    if (!card || card.dataset.exerciseId === state.inspectedExerciseId) return;
    const group = getCurrentGroup();
    const ex = group.exercises.find((e) => e.id === card.dataset.exerciseId);
    if (ex) renderAnatomyPanel(group, ex);
  });

  els.exerciseGrid.addEventListener('focusin', (event) => {
    const card = event.target.closest('.exercise-card');
    if (!card || card.dataset.exerciseId === state.inspectedExerciseId) return;
    const group = getCurrentGroup();
    const ex = group.exercises.find((e) => e.id === card.dataset.exerciseId);
    if (ex) renderAnatomyPanel(group, ex);
  });

  els.exerciseGrid.addEventListener('click', (event) => {
    const openBtn = event.target.closest('[data-open-exercise]');
    if (openBtn) {
      openExerciseDialog(openBtn.dataset.openExercise);
      return;
    }
    const card = event.target.closest('.exercise-card');
    if (card) {
      openExerciseDialog(card.dataset.exerciseId);
    }
  });

  // Reset anatomy panel to stage overview
  els.anatomyResetBtn.addEventListener('click', () => {
    renderAnatomyPanel(getCurrentGroup(), null);
  });

  // Support deep links like #age-63-75
  window.addEventListener('hashchange', () => {
    const match = window.location.hash.match(/^#age-([a-z0-9-]+)$/);
    if (match && AGE_GROUPS.some((g) => g.id === match[1])) {
      selectStage(match[1], { updateHash: false });
    }
  });
}

function init() {
  initThemeToggle();
  buildLifespanMatrix();
  initTablistEnhancements();
  initDialogEvents();
  initInteractions();

  // Check initial URL hash for deep-linking
  const hashMatch = window.location.hash.match(/^#age-([a-z0-9-]+)$/);
  const initialStage =
    hashMatch && AGE_GROUPS.some((g) => g.id === hashMatch[1])
      ? hashMatch[1]
      : AGE_GROUPS[0].id;

  const initialGroup = AGE_GROUPS.find((g) => g.id === initialStage) || AGE_GROUPS[0];
  const initialAge = Math.round((initialGroup.minAge + Math.min(initialGroup.maxAge, 85)) / 2);
  els.ageSlider.value = String(initialAge);

  selectStage(initialStage, { updateHash: false });
  renderAgeMatcher(initialAge, { autoSwitchStage: false });
}

init();
