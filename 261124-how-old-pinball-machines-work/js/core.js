/**
 * Shared Core Utilities for "How Electromechanical Pinball Works"
 * - Responsive single-tree navbar with native popover + ResizeObserver sync
 * - Cross-document directional View Transitions (pagereveal)
 * - Scroll progress indicator JS fallback
 * - Range slider CSS custom property sync (--attr-min, --attr-max, --control-value)
 * - Viewport-aware Canvas animation runner (contentvisibilityautostatechange + IO fallback)
 * - Authentic Web Audio electromechanical sound synthesizer (strictly user opt-in)
 */

export const PAGE_ORDER = ['index.html', 'logic.html', 'score-and-legacy.html'];

/* ==========================================================================
   0. COLOR SCHEME TOGGLE & EFFECTIVE SCHEME RESOLUTION
      Follows <meta name="color-scheme"> ("light dark" | "light" | "dark")
      and persists explicit overrides in localStorage with cross-tab sync.
   ========================================================================== */
const COLOR_SCHEME_KEY = 'color-scheme';
const darkSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

function getColorSchemeMeta() {
  let meta = document.querySelector('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    meta.content = 'light dark';
    document.head.prepend(meta);
  }
  return meta;
}

function getStoredColorScheme() {
  try {
    const val = localStorage.getItem(COLOR_SCHEME_KEY);
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

function getSystemColorScheme() {
  return darkSchemeMedia.matches ? 'dark' : 'light';
}

export function getEffectiveColorScheme() {
  const content = document.querySelector('meta[name="color-scheme"]')?.content;
  if (content === 'light' || content === 'dark') {
    return content;
  }
  return getSystemColorScheme();
}

function applyColorScheme(stored) {
  const meta = getColorSchemeMeta();
  meta.content = stored === 'light' || stored === 'dark' ? stored : 'light dark';
  window.dispatchEvent(new CustomEvent('colorschemechange', {
    detail: { scheme: getEffectiveColorScheme() },
  }));
}

function toggleColorScheme() {
  const current = getEffectiveColorScheme();
  const target = current === 'dark' ? 'light' : 'dark';
  const system = getSystemColorScheme();
  const nextStored = target === system ? null : target;

  try {
    if (nextStored === null) {
      localStorage.removeItem(COLOR_SCHEME_KEY);
    } else {
      localStorage.setItem(COLOR_SCHEME_KEY, nextStored);
    }
  } catch {
    // Theme still applies in-memory via <meta> even if storage is blocked
  }

  applyColorScheme(nextStored);
  audio.relayClick(0.22);
}

function initThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleColorScheme);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === COLOR_SCHEME_KEY || event.key === null) {
      applyColorScheme(getStoredColorScheme());
    }
  });
}

/* ==========================================================================
   1. CROSS-DOCUMENT DIRECTIONAL VIEW TRANSITIONS
   ========================================================================== */
function getPageIndex(urlStr) {
  try {
    const pathname = new URL(urlStr, window.location.href).pathname;
    const file = pathname.split('/').pop() || 'index.html';
    const idx = PAGE_ORDER.indexOf(file);
    return idx === -1 ? 0 : idx;
  } catch {
    return 0;
  }
}

if ('onpagereveal' in window) {
  window.addEventListener('pagereveal', (e) => {
    if (e.viewTransition && window.navigation?.activation?.from) {
      const fromIdx = getPageIndex(window.navigation.activation.from.url);
      const toIdx = getPageIndex(window.navigation.activation.entry.url);
      if (toIdx > fromIdx) {
        e.viewTransition.types.add('next');
      } else if (toIdx < fromIdx) {
        e.viewTransition.types.add('previous');
      }
    }
  });
}

/* ==========================================================================
   2. RESPONSIVE SINGLE-TREE NAVBAR (Popover + ResizeObserver)
   ========================================================================== */
function initNavbar() {
  if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
    import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
  }

  const header = document.querySelector('.site-header');
  const inner = header?.querySelector('.header-inner');
  const menu = document.getElementById('site-menu');
  if (!header || !inner || !menu) return;

  let lastHeaderWidth = 0;

  function updateLayout(force = false) {
    const currentWidth = header.clientWidth;
    const wasWide = header.classList.contains('is-wide');
    if (!force && !wasWide && currentWidth <= lastHeaderWidth) {
      lastHeaderWidth = currentWidth;
      return;
    }
    lastHeaderWidth = currentWidth;

    const wasOpen = menu.matches(':popover-open') || menu.classList.contains(':popover-open');
    header.classList.add('is-measuring');
    header.classList.add('is-wide');
    menu.removeAttribute('popover');

    const fitsInline = inner.scrollWidth <= inner.clientWidth + 1;

    if (!fitsInline) {
      header.classList.remove('is-wide');
      menu.setAttribute('popover', 'auto');
      if (wasOpen && typeof menu.showPopover === 'function') {
        try {
          menu.showPopover();
        } catch {
          // ignore if already open or detached
        }
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove('is-measuring');
    });
  }

  const ro = new ResizeObserver(() => updateLayout(false));
  ro.observe(header);
  ro.observe(menu);

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => updateLayout(true));
  }
  updateLayout(true);
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR FALLBACK
   ========================================================================== */
function initScrollProgressFallback() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  if (!CSS.supports('animation-timeline', 'scroll()')) {
    let ticking = false;
    const sync = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, window.scrollY / scrollable));
      bar.style.transform = `scaleX(${pct})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sync);
      }
    }, { passive: true });
    sync();
  }
}

/* ==========================================================================
   4. NATIVE RANGE SLIDER SYNC (Fallback for attr() / progress())
   ========================================================================== */
export function syncSlider(slider) {
  slider.style.setProperty('--attr-min', slider.min === '' ? '0' : slider.min);
  slider.style.setProperty('--attr-max', slider.max === '' ? '100' : slider.max);
  slider.style.setProperty('--control-value', slider.value);
}

function initSliders() {
  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    syncSlider(slider);
    slider.addEventListener('input', () => syncSlider(slider));
  });
}

/* ==========================================================================
   5. ELECTROMECHANICAL WEB AUDIO SYNTHESIZER (Strict User Opt-In)
   ========================================================================== */
class PinballAudioEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    try {
      this.enabled = sessionStorage.getItem('em-pinball-audio') === 'on';
    } catch {
      this.enabled = false;
    }
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setEnabled(next) {
    this.enabled = Boolean(next);
    try {
      sessionStorage.setItem('em-pinball-audio', this.enabled ? 'on' : 'off');
    } catch {
      // ignore storage errors
    }
    if (this.enabled) {
      this.ensureContext();
      this.relayClick(0.35);
    }
    document.querySelectorAll('[data-audio-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(this.enabled));
      const label = btn.querySelector('[data-audio-label]');
      if (label) label.textContent = this.enabled ? 'Sound: On' : 'Sound: Off';
    });
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  /* Crisp tungsten leaf relay click */
  relayClick(volume = 0.25) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.018);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /* Heavy solenoid clack (flipper, drop target reset bar, stepper coil) */
  solenoidClack(pitch = 165, volume = 0.35) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(pitch * 1.8, now);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, now + 0.045);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /* Pop bumper hollow thump + steel ring */
  popThump() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(62, now + 0.09);
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);

    this.relayClick(0.28);
  }

  /* Drop target plastic thwack */
  targetDrop() {
    this.solenoidClack(260, 0.3);
    this.chime(1);
  }

  /* Gottlieb 3-bar aluminum chime box: 0 = 10pt Low (C5), 1 = 100pt Mid (E5), 2 = 1000pt High (G5) */
  chime(barIndex = 1) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99];
    const base = freqs[barIndex] || freqs[1];
    const now = ctx.currentTime;

    // Fundamental + bright metallic overtone (2.756x for free-free bar!)
    [
      { ratio: 1, amp: 0.24, dur: 0.72 },
      { ratio: 2.756, amp: 0.08, dur: 0.28 },
      { ratio: 5.4, amp: 0.025, dur: 0.11 },
    ].forEach(({ ratio, amp, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * ratio, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    });
  }

  /* Iconic replay knocker CRACK against cabinet wall */
  knockerCrack() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(420, now);
    bp.Q.setValueAtTime(1.4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    noise.connect(bp).connect(gain).connect(ctx.destination);
    noise.start(now);

    this.solenoidClack(110, 0.45);
  }

  /* Tilt buzz / dead clang */
  tiltClang() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [138, 184].forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }
}

export const audio = new PinballAudioEngine();

function initAudioButtons() {
  document.querySelectorAll('[data-audio-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(audio.enabled));
    const label = btn.querySelector('[data-audio-label]');
    if (label) label.textContent = audio.enabled ? 'Sound: On' : 'Sound: Off';
    btn.addEventListener('click', () => audio.toggle());
  });
}

/* ==========================================================================
   6. VIEWPORT-AWARE HIGH-DPI CANVAS CONTROLLER
      Uses contentvisibilityautostatechange + IntersectionObserver fallback
   ========================================================================== */
export function createDiagramRunner(figureEl, canvas, { width, height, draw, update }) {
  const ctx = canvas.getContext('2d');
  let rafId = null;
  let visible = true;
  let lastTs = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, width, height);
  }

  function frame(ts) {
    if (!visible) {
      rafId = null;
      return;
    }
    const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
    lastTs = ts;
    const keepRunning = update ? update(dt, ts / 1000) : false;
    draw(ctx, width, height);
    if (keepRunning) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
      lastTs = 0;
    }
  }

  function wake() {
    if (!visible) return;
    if (rafId === null) {
      lastTs = 0;
      rafId = requestAnimationFrame(frame);
    }
  }

  function renderOnce() {
    draw(ctx, width, height);
  }

  function pause() {
    visible = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastTs = 0;
    }
  }

  function resume() {
    visible = true;
    wake();
  }

  // Modern contentvisibilityautostatechange with IntersectionObserver fallback
  if ('contentVisibility' in document.documentElement.style && figureEl) {
    figureEl.addEventListener('contentvisibilityautostatechange', (event) => {
      if (event.skipped) {
        pause();
      } else {
        resume();
      }
    });
  } else if (figureEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) resume();
        else pause();
      });
    }, { rootMargin: '220px' });
    io.observe(figureEl);
  }

  // Re-render when OS preference or manual theme override changes
  darkSchemeMedia.addEventListener('change', () => {
    renderOnce();
  });
  window.addEventListener('colorschemechange', () => {
    renderOnce();
  });

  resize();
  wake();

  return { wake, renderOnce, pause, resume, ctx, width, height };
}

/* Canvas palette helper respecting explicit color-scheme override and OS preference */
export function getCanvasPalette() {
  const dark = getEffectiveColorScheme() === 'dark';
  return {
    dark,
    blueprintBg: dark ? '#161c26' : '#f6f2e8',
    blueprintGrid: dark ? 'rgba(130, 165, 210, 0.09)' : 'rgba(24, 78, 130, 0.075)',
    cabinetBg: dark ? '#0d1016' : '#161b24',
    cabinetWood: dark ? '#2a221c' : '#3d2d20',
    ink: dark ? '#efeae0' : '#1e1b18',
    inkMuted: dark ? '#a6a095' : '#5e564c',
    wireNeutral: dark ? '#4d5b72' : '#738296',
    wireHot: '#e34b2d',
    wireHold: '#2f82cf',
    wireLamp: '#f4c652',
    copper: '#c87137',
    copperLight: '#e3965e',
    brass: '#d4a33b',
    brassDark: '#8c6518',
    steel: '#cfd8e3',
    steelDark: '#69778a',
    bakelite: '#6b3a24',
    emerald: '#28a673',
    crimson: '#d63e28',
    cobalt: '#2265a3',
  };
}

/* Helper to map pointer event to logical canvas coordinates */
export function getCanvasPoint(canvas, event, logicalWidth, logicalHeight) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * logicalWidth,
    y: ((event.clientY - rect.top) / rect.height) * logicalHeight,
  };
}

/* Helper to draw crisp rounded rectangles and animated AC dashed wires */
export function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function drawWire(ctx, points, { color, width = 3, energized = false, phase = 0, glow = false } = {}) {
  if (points.length < 2) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (glow && energized) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }
  ctx.stroke();

  if (energized) {
    ctx.shadowBlur = 0;
    ctx.setLineDash([7, 9]);
    ctx.lineDashOffset = -phase * 48;
    ctx.strokeStyle = 'rgba(255, 250, 220, 0.85)';
    ctx.lineWidth = Math.max(1.5, width - 1.2);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawBlueprintGrid(ctx, w, h, step = 20) {
  const p = getCanvasPalette();
  ctx.fillStyle = p.blueprintBg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = p.blueprintGrid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();
}

export function drawCoil(ctx, x, y, w, h, { energized = false, heat = 0, label = '', windings = 9, color = '#c87137' } = {}) {
  ctx.save();
  // End bobbins
  ctx.fillStyle = '#5c331d';
  drawRoundedRect(ctx, x, y, 7, h, 2);
  ctx.fill();
  drawRoundedRect(ctx, x + w - 7, y, 7, h, 2);
  ctx.fill();

  // Copper winding body
  const bodyX = x + 7;
  const bodyW = w - 14;
  const grad = ctx.createLinearGradient(bodyX, y, bodyX, y + h);
  if (heat > 0.1) {
    const r = Math.min(255, Math.round(200 + heat * 55));
    const g = Math.max(45, Math.round(115 - heat * 65));
    grad.addColorStop(0, `rgb(${r}, ${g + 40}, 65)`);
    grad.addColorStop(0.5, `rgb(${r}, ${g}, 42)`);
    grad.addColorStop(1, `rgb(${Math.round(r * 0.6)}, ${Math.round(g * 0.5)}, 28)`);
  } else {
    grad.addColorStop(0, energized ? '#f3a464' : '#d68548');
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, '#7a3f1a');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(bodyX, y + 3, bodyW, h - 6);

  // Winding grooves
  ctx.strokeStyle = 'rgba(40, 18, 6, 0.35)';
  ctx.lineWidth = 1;
  const spacing = bodyW / windings;
  for (let i = 1; i < windings; i++) {
    const wx = bodyX + i * spacing;
    ctx.beginPath();
    ctx.moveTo(wx, y + 3);
    ctx.lineTo(wx, y + h - 3);
    ctx.stroke();
  }

  // Magnetic field rings when energized
  if (energized) {
    ctx.strokeStyle = 'rgba(227, 75, 45, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    drawRoundedRect(ctx, x - 6, y - 6, w + 12, h + 12, 8);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (label) {
    ctx.fillStyle = '#fff9ef';
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + w / 2, y + h / 2);
  }
  ctx.restore();
}

export function drawSteelBall(ctx, x, y, r = 10) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.12, x, y, r);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.32, '#dce4ee');
  g.addColorStop(0.75, '#7c8b9e');
  g.addColorStop(1, '#3d4756');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawLamp(ctx, x, y, r, lit, label = '') {
  ctx.save();
  if (lit) {
    const glow = ctx.createRadialGradient(x, y, 2, x, y, r * 2.5);
    glow.addColorStop(0, 'rgba(255, 215, 95, 0.9)');
    glow.addColorStop(0.5, 'rgba(244, 180, 50, 0.32)');
    glow.addColorStop(1, 'rgba(244, 180, 50, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = lit ? '#ffe68c' : '#3a3f4a';
  ctx.strokeStyle = lit ? '#d48d12' : '#656e7e';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (label) {
    ctx.fillStyle = lit ? '#2e1d02' : '#cfd4dc';
    ctx.font = '700 9.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + 0.5);
  }
  ctx.restore();
}

/* Boot shared systems on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initScrollProgressFallback();
  initSliders();
  initAudioButtons();
});
