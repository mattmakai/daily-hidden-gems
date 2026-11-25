import {
  audio,
  createDiagramRunner,
  drawCoil,
  drawLamp,
  drawRoundedRect,
  drawWire,
  getCanvasPoint,
} from './core.js';

/* ==========================================================================
   DIAGRAM 11: MECHANICAL SCORE REELS, CASCADE CARRY & ZERO RESET
   ========================================================================== */
function initDiagram11() {
  const figure = document.getElementById('fig-reels');
  const canvas = document.getElementById('d11-canvas');
  if (!figure || !canvas) return;

  const btnP1 = document.getElementById('d11-p1');
  const btnP2 = document.getElementById('d11-p2');
  const btn10 = document.getElementById('d11-add-10');
  const btn100 = document.getElementById('d11-add-100');
  const btn300 = document.getElementById('d11-add-300');
  const btn1000 = document.getElementById('d11-add-1000');
  const btn5000 = document.getElementById('d11-add-5000');
  const btn9990 = document.getElementById('d11-set-9990');
  const btnReset = document.getElementById('d11-reset-zero');

  const p1ScoreOut = document.getElementById('d11-p1-score');
  const p2ScoreOut = document.getElementById('d11-p2-score');
  const swStatusOut = document.getElementById('d11-sw-status');
  const dotCarry = document.getElementById('d11-dot-carry');

  // 4 mechanical drums per player: [10000s, 1000s, 100s, 10s]
  function makeBank() {
    return {
      digits: [0, 0, 0, 0],
      animPos: [0, 0, 0, 0],
      rollover100k: false,
    };
  }

  const state = {
    activePlayer: 0, // 0 or 1
    banks: [makeBank(), makeBank()],
    queue: [],       // queued pulses { place: 0..3, chime: 0..2 }
    pulseTimer: 0,
    resetting: false,
    pawlAnim: 0,     // 100s drum X-ray solenoid animation
    carryFlash: 0,
    phase: 0,
  };

  function formatScore(bank) {
    const val = bank.digits[0] * 10000 + bank.digits[1] * 1000 + bank.digits[2] * 100 + bank.digits[3] * 10;
    const prefix = bank.rollover100k ? '1' : '';
    return prefix + String(val).padStart(5, '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function syncTelemetry() {
    p1ScoreOut.textContent = formatScore(state.banks[0]);
    p2ScoreOut.textContent = formatScore(state.banks[1]);

    const d100 = state.banks[state.activePlayer].digits[2];
    const zeroOpen = d100 === 0;
    const carryClosed = d100 === 9;
    swStatusOut.textContent = `${zeroOpen ? 'Zero Notch OPEN (Stop Reset)' : 'Zero Switch CLOSED (Resetting)'} · ${carryClosed ? '9-Carry CLOSED (Ready!)' : '9-Carry Open'}`;
    dotCarry.className = carryClosed ? 'telemetry-dot is-active' : zeroOpen ? 'telemetry-dot' : 'telemetry-dot is-ok';
  }

  function stepReel(bank, place) {
    if (place < 0) {
      bank.rollover100k = true;
      return;
    }
    const prev = bank.digits[place];
    bank.digits[place] = (prev + 1) % 10;
    if (place === 2) state.pawlAnim = 1;
    // 9th-position carry-over switch triggers the next higher drum!
    if (prev === 9) {
      if (place === 2) state.carryFlash = 1;
      stepReel(bank, place - 1);
    }
  }

  function enqueueScore(place, count, chimeBar) {
    if (state.resetting) return;
    for (let i = 0; i < count; i++) {
      state.queue.push({ place, chime: chimeBar });
    }
    runner.wake();
  }

  function setPlayer(idx) {
    state.activePlayer = idx;
    btnP1.setAttribute('aria-pressed', String(idx === 0));
    btnP2.setAttribute('aria-pressed', String(idx === 1));
    audio.relayClick(0.24);
    syncTelemetry();
    runner.renderOnce();
  }

  btnP1.addEventListener('click', () => setPlayer(0));
  btnP2.addEventListener('click', () => setPlayer(1));
  btn10.addEventListener('click', () => enqueueScore(3, 1, 0));
  btn100.addEventListener('click', () => enqueueScore(2, 1, 1));
  btn300.addEventListener('click', () => enqueueScore(2, 3, 1));
  btn1000.addEventListener('click', () => enqueueScore(1, 1, 2));
  btn5000.addEventListener('click', () => enqueueScore(1, 5, 2));

  btn9990.addEventListener('click', () => {
    state.queue = [];
    state.resetting = false;
    const bank = state.banks[state.activePlayer];
    bank.digits = [0, 9, 9, 9];
    bank.animPos = [0, 9, 9, 9];
    bank.rollover100k = false;
    audio.relayClick(0.25);
    syncTelemetry();
    runner.renderOnce();
  });

  btnReset.addEventListener('click', () => {
    state.queue = [];
    state.resetting = true;
    state.pulseTimer = 0.05;
    runner.wake();
  });

  function update(dt) {
    let busy = false;
    state.phase += dt * 2.5;

    if (state.pawlAnim > 0) {
      state.pawlAnim = Math.max(0, state.pawlAnim - dt * 5.5);
      busy = true;
    }
    if (state.carryFlash > 0) {
      state.carryFlash = Math.max(0, state.carryFlash - dt * 2.4);
      busy = true;
    }

    // Smooth drum rotation toward target digits
    state.banks.forEach((bank) => {
      for (let i = 0; i < 4; i++) {
        let diff = bank.digits[i] - bank.animPos[i];
        if (diff < -5) diff += 10;
        if (diff > 5) diff -= 10;
        if (Math.abs(diff) > 0.01) {
          bank.animPos[i] = (bank.animPos[i] + diff * Math.min(1, dt * 18) + 10) % 10;
          busy = true;
        } else {
          bank.animPos[i] = bank.digits[i];
        }
      }
    });

    if (state.resetting) {
      busy = true;
      state.pulseTimer -= dt;
      if (state.pulseTimer <= 0) {
        let anyStepped = false;
        state.banks.forEach((bank) => {
          bank.rollover100k = false;
          for (let i = 0; i < 4; i++) {
            // Only pulse drums whose Zero-Position switch is still CLOSED (digit != 0)!
            if (bank.digits[i] !== 0) {
              bank.digits[i] = (bank.digits[i] + 1) % 10;
              anyStepped = true;
              if (i === 2) state.pawlAnim = 1;
            }
          }
        });
        if (anyStepped) {
          audio.solenoidClack(210, 0.22);
          syncTelemetry();
          state.pulseTimer = 0.13;
        } else {
          state.resetting = false;
          audio.relayClick(0.28);
          syncTelemetry();
        }
      }
    } else if (state.queue.length > 0) {
      busy = true;
      state.pulseTimer -= dt;
      if (state.pulseTimer <= 0) {
        const job = state.queue.shift();
        stepReel(state.banks[state.activePlayer], job.place);
        audio.solenoidClack(240, 0.18);
        audio.chime(job.chime);
        syncTelemetry();
        state.pulseTimer = 0.14;
      }
    }

    return busy;
  }

  function drawReelDrumWindow(ctx, x, y, w, h, animPos, highlight) {
    ctx.save();
    ctx.fillStyle = '#0d1016';
    drawRoundedRect(ctx, x, y, w, h, 5);
    ctx.fill();
    ctx.strokeStyle = highlight ? '#f4c652' : '#4f5d70';
    ctx.lineWidth = highlight ? 2 : 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 4);
    ctx.clip();

    // Cylindrical white plastic drum shading
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, '#9ea4ad');
    grad.addColorStop(0.22, '#f9f6ef');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.78, '#ece7dc');
    grad.addColorStop(1, '#8c929c');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    // Draw scrolling numeral and adjacent digits
    const baseDigit = Math.floor(animPos);
    const frac = animPos - baseDigit;
    ctx.fillStyle = '#181613';
    ctx.font = '700 32px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    [-1, 0, 1].forEach((offset) => {
      const d = ((baseDigit + offset) % 10 + 10) % 10;
      const dy = (offset - frac) * (h * 0.85);
      ctx.fillText(String(d), x + w / 2, y + h / 2 + dy + 2);
    });
    ctx.restore();
  }

  function draw(ctx, w, h) {
    ctx.fillStyle = '#141821';
    ctx.fillRect(0, 0, w, h);

    // TOP HALF: Solar City 2-Player Illuminated Backglass Score Display
    const panels = [
      { idx: 0, x: 34, label: 'PLAYER 1 UP' },
      { idx: 1, x: 454, label: 'PLAYER 2 UP' },
    ];

    panels.forEach((pan) => {
      const active = state.activePlayer === pan.idx;
      const bank = state.banks[pan.idx];
      ctx.fillStyle = active ? '#1f2738' : '#181d28';
      ctx.strokeStyle = active ? '#f4c652' : '#3a4354';
      ctx.lineWidth = active ? 2.4 : 1.5;
      drawRoundedRect(ctx, pan.x, 22, 372, 128, 10);
      ctx.fill();
      ctx.stroke();

      // Player up lamp header
      drawLamp(ctx, pan.x + 26, 46, 8, active);
      ctx.fillStyle = active ? '#ffd466' : '#8592a6';
      ctx.font = '700 11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'start';
      ctx.fillText(pan.label, pan.x + 44, 50);

      if (bank.rollover100k) {
        ctx.fillStyle = '#ff7654';
        ctx.textAlign = 'end';
        ctx.fillText('100,000 WHEN LIT', pan.x + 356, 50);
      }

      // 4 rotating mechanical reels + 1 stationary painted "0"
      const labels = ['10K', '1K', '100', '10', '0*'];
      for (let i = 0; i < 4; i++) {
        const rx = pan.x + 20 + i * 68;
        drawReelDrumWindow(ctx, rx, 66, 58, 56, bank.animPos[i], active && i === 2);
        ctx.fillStyle = '#9aa8ba';
        ctx.font = '600 9.5px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], rx + 29, 136);
      }
      // Stationary backglass "0"
      const zx = pan.x + 20 + 4 * 68;
      ctx.fillStyle = '#252d3d';
      drawRoundedRect(ctx, zx, 66, 54, 56, 5);
      ctx.fill();
      ctx.strokeStyle = '#475366';
      ctx.stroke();
      ctx.fillStyle = '#f4c652';
      ctx.font = '700 32px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('0', zx + 27, 96);
      ctx.font = '600 9px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#8b97aa';
      ctx.fillText('FIXED', zx + 27, 136);
    });

    // BOTTOM HALF: X-Ray Side Cutaway of Active Player's 100s Score Reel Mechanism
    const activeBank = state.banks[state.activePlayer];
    const d100 = activeBank.digits[2];
    const anim100 = activeBank.animPos[2];
    const isZero = d100 === 0;
    const isNine = d100 === 9;

    ctx.fillStyle = '#1b212d';
    ctx.strokeStyle = '#3a4559';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 34, 174, 792, 232, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText(`X-RAY SIDE MECHANISM: PLAYER ${state.activePlayer + 1} — 100s SCORE REEL (CURRENT DIGIT: ${d100})`, 54, 198);

    // Rotating 10-tooth Score Drum Wheel (center cx=355, cy=296)
    const cx = 355;
    const cy = 296;
    const drumAngle = -(anim100 / 10) * Math.PI * 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(drumAngle);

    // Outer white numeral wheel (radius 78)
    ctx.fillStyle = '#efeae0';
    ctx.strokeStyle = '#8b97aa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 78, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 10 digits printed around drum rim (digit 0 sits at angle 0 = right viewing window!)
    ctx.fillStyle = '#1d1a16';
    ctx.font = '700 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let n = 0; n < 10; n++) {
      const a = (n / 10) * Math.PI * 2;
      const nx = Math.cos(a) * 62;
      const ny = Math.sin(a) * 62;
      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = n === 9 ? '#b8341d' : n === 0 ? '#184e82' : '#1d1a16';
      ctx.fillText(String(n), 0, 0);
      ctx.restore();
    }

    // Inner metal ratchet cam with ZERO notch at digit 0 and CARRY pin at digit 9!
    ctx.fillStyle = '#58667a';
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();

    // Blue zero-reset notch cutout at angle 0
    ctx.fillStyle = '#1b212d';
    ctx.beginPath();
    ctx.arc(40, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Red carry-over cam lobe at digit 9 (angle = 9/10 * 2pi = -36°)
    const a9 = (9 / 10) * Math.PI * 2;
    ctx.fillStyle = '#ff6a4a';
    ctx.beginPath();
    ctx.arc(Math.cos(a9) * 44, Math.sin(a9) * 44, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d4a33b';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Viewing window bracket on right side of drum
    ctx.strokeStyle = '#ffd466';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, cx + 49, cy - 14, 34, 28, 4);
    ctx.stroke();

    // Solenoid Coil & Advancing Pawl on the left of the drum
    drawCoil(ctx, 76, 264, 88, 64, {
      energized: state.pawlAnim > 0.15,
      label: 'REEL COIL',
      windings: 7,
    });
    // Plunger + ratcheting pawl engaging drum teeth
    const pull = state.pawlAnim * 20;
    ctx.fillStyle = '#cfd8e3';
    ctx.fillRect(164 - pull, 288, 72, 16);
    ctx.strokeStyle = '#e8b948';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(236 - pull, 296);
    ctx.lineTo(cx - 64, cy - 26 + pull * 0.6);
    ctx.stroke();

    // Right side of X-ray: Live Switches Readout Boxes (9-Carry & 0-Reset!)
    // 1. 9th-Position Carry-Over Switch Box
    ctx.fillStyle = isNine || state.carryFlash > 0.1 ? 'rgba(227, 75, 45, 0.24)' : '#232a38';
    ctx.strokeStyle = isNine || state.carryFlash > 0.1 ? '#ff6a4a' : '#4a5568';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 492, 220, 306, 74, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('9th-POSITION CARRY-OVER SWITCH', 508, 244);
    ctx.fillStyle = isNine ? '#ffd466' : state.carryFlash > 0.1 ? '#ff8b70' : '#9aa8ba';
    ctx.font = '500 11.5px "IBM Plex Sans", sans-serif';
    ctx.fillText(
      state.carryFlash > 0.1
        ? 'CARRY FIRED! Pulsed 1,000s drum forward!'
        : isNine
          ? 'CLOSED — Next +100 pulse carries to 1,000s!'
          : 'Open on digits 0–8 (no carry pulse sent)',
      508,
      270
    );

    // 2. Zero-Position Reset Notch Switch Box
    ctx.fillStyle = isZero ? 'rgba(40, 166, 115, 0.2)' : 'rgba(47, 130, 207, 0.2)';
    ctx.strokeStyle = isZero ? '#52c493' : '#6fb3f2';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 492, 310, 306, 74, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.fillText('ZERO-POSITION RESET NOTCH SWITCH', 508, 334);
    ctx.fillStyle = isZero ? '#6adca9' : '#8cc4f8';
    ctx.font = '500 11.5px "IBM Plex Sans", sans-serif';
    ctx.fillText(
      isZero
        ? 'OPEN IN NOTCH — Z1/Z2 reset stops here!'
        : 'CLOSED — Z1/Z2 keeps stepping toward 0',
      508,
      360
    );

    // Wire link from drum switches to status boxes
    drawWire(ctx, [[cx + 78, cy - 26], [492, 256]], {
      color: isNine || state.carryFlash > 0.1 ? '#ff6a4a' : '#536073',
      energized: isNine || state.carryFlash > 0.1,
      phase: state.phase,
    });
    drawWire(ctx, [[cx + 78, cy + 20], [492, 346]], {
      color: !isZero ? '#6fb3f2' : '#52c493',
      energized: state.resetting && !isZero,
      phase: state.phase,
    });
  }

  syncTelemetry();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 430,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 12: 3-BAR ACOUSTIC CHIME BOX + 00-90 MATCH UNIT & REPLAY PLUG
   ========================================================================== */
function initDiagram12() {
  const figure = document.getElementById('fig-chime-match');
  const canvas = document.getElementById('d12-canvas');
  if (!figure || !canvas) return;

  const btn10 = document.getElementById('d12-chime-10');
  const btn100 = document.getElementById('d12-chime-100');
  const btn1000 = document.getElementById('d12-chime-1000');
  const btnChord = document.getElementById('d12-chord');
  const btnSpin = document.getElementById('d12-match-spin');
  const btnWin = document.getElementById('d12-match-win');
  const btnPlug = document.getElementById('d12-plug');

  const playerEndOut = document.getElementById('d12-player-end');
  const matchNumOut = document.getElementById('d12-match-num');
  const resultOut = document.getElementById('d12-result');
  const dotAward = document.getElementById('d12-dot-award');

  const bars = [
    { label: '10 PTS', note: 'LOW C5', len: 126, ring: 0, plunger: 0, x: 74 },
    { label: '100 PTS', note: 'MID E5', len: 108, ring: 0, plunger: 0, x: 184 },
    { label: '1,000 PTS', note: 'HIGH G5', len: 92, ring: 0, plunger: 0, x: 294 },
  ];

  const state = {
    playerLastTwo: 70, // e.g., final score ends in 70
    matchStep: 4,      // 0..9 -> 00..90
    displayStep: 4,
    spinning: false,
    spinStepsLeft: 0,
    spinTimer: 0,
    addABallMode: false,
    knockerAnim: 0,
    wonMatch: false,
    credits: 1,
    extraBalls: 0,
    t: 0,
  };

  function strikeBar(idx) {
    bars[idx].ring = 1;
    bars[idx].plunger = 1;
    audio.chime(idx);
    // Scoring ticks the 00-90 Match Unit!
    if (!state.spinning) {
      state.matchStep = (state.matchStep + 1) % 10;
      matchNumOut.textContent = String(state.matchStep * 10).padStart(2, '0');
    }
    runner.wake();
  }

  function evaluateMatch() {
    const mNum = state.matchStep * 10;
    matchNumOut.textContent = String(mNum).padStart(2, '0');
    if (mNum === state.playerLastTwo) {
      state.wonMatch = true;
      state.knockerAnim = 1;
      audio.knockerCrack();
      if (state.addABallMode) {
        state.extraBalls += 1;
        resultOut.textContent = `MATCH ${String(mNum).padStart(2, '0')}! Add-a-Ball Plug awards +1 EXTRA BALL!`;
      } else {
        state.credits += 1;
        resultOut.textContent = `MATCH ${String(mNum).padStart(2, '0')}! Knocker CRACKS — +1 FREE REPLAY CREDIT!`;
      }
      dotAward.className = 'telemetry-dot is-active';
    } else {
      state.wonMatch = false;
      resultOut.textContent = `No match (Score ended in ${String(state.playerLastTwo).padStart(2, '0')} vs Match ${String(mNum).padStart(2, '0')}). Try again or click Demo Match Win!`;
      dotAward.className = 'telemetry-dot';
    }
  }

  function startMatchSpin(forceWin = false) {
    if (state.spinning) return;
    state.spinning = true;
    state.wonMatch = false;
    const targetStep = forceWin ? state.playerLastTwo / 10 : Math.floor(Math.random() * 10);
    const delta = ((targetStep - state.matchStep) % 10 + 10) % 10;
    state.spinStepsLeft = 10 + delta;
    state.spinTimer = 0.04;
    resultOut.textContent = '00–90 Match Unit stepping through game-over evaluation...';
    dotAward.className = 'telemetry-dot is-lamp';
    runner.wake();
  }

  btn10.addEventListener('click', () => strikeBar(0));
  btn100.addEventListener('click', () => strikeBar(1));
  btn1000.addEventListener('click', () => strikeBar(2));
  btnChord.addEventListener('click', () => {
    strikeBar(1);
    setTimeout(() => strikeBar(1), 115);
    setTimeout(() => strikeBar(1), 230);
  });

  btnSpin.addEventListener('click', () => startMatchSpin(false));
  btnWin.addEventListener('click', () => startMatchSpin(true));

  btnPlug.addEventListener('click', () => {
    state.addABallMode = !state.addABallMode;
    btnPlug.setAttribute('aria-pressed', String(state.addABallMode));
    btnPlug.textContent = state.addABallMode ? 'Mode: Add-a-Ball (Extra Ball)' : 'Mode: Replay (Free Game)';
    audio.relayClick(0.24);
    runner.renderOnce();
  });

  canvas.addEventListener('click', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 415);
    bars.forEach((b, idx) => {
      if (pt.x >= b.x - 16 && pt.x <= b.x + 82 && pt.y >= 65 && pt.y <= 320) {
        strikeBar(idx);
      }
    });
  });

  function update(dt) {
    state.t += dt;
    let busy = false;

    bars.forEach((b) => {
      if (b.ring > 0.005) {
        b.ring = Math.max(0, b.ring - dt * 1.15);
        busy = true;
      }
      if (b.plunger > 0.005) {
        b.plunger = Math.max(0, b.plunger - dt * 6.5);
        busy = true;
      }
    });

    if (state.knockerAnim > 0.005) {
      state.knockerAnim = Math.max(0, state.knockerAnim - dt * 3.8);
      busy = true;
    }

    let stepDiff = state.matchStep - state.displayStep;
    if (stepDiff < -5) stepDiff += 10;
    if (stepDiff > 5) stepDiff -= 10;
    if (Math.abs(stepDiff) > 0.01) {
      state.displayStep = (state.displayStep + stepDiff * Math.min(1, dt * 18) + 10) % 10;
      busy = true;
    } else {
      state.displayStep = state.matchStep;
    }

    if (state.spinning) {
      busy = true;
      state.spinTimer -= dt;
      if (state.spinTimer <= 0) {
        if (state.spinStepsLeft > 0) {
          state.matchStep = (state.matchStep + 1) % 10;
          state.spinStepsLeft -= 1;
          matchNumOut.textContent = String(state.matchStep * 10).padStart(2, '0');
          audio.relayClick(0.18);
          state.spinTimer = state.spinStepsLeft < 4 ? 0.14 : 0.065;
        } else {
          state.spinning = false;
          evaluateMatch();
        }
      }
    }

    return busy;
  }

  function draw(ctx, w, h) {
    ctx.fillStyle = '#141821';
    ctx.fillRect(0, 0, w, h);

    // LEFT HALF: 3-Bar Gottlieb Chime Box & Cabinet Knocker (x: 24..432)
    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('ACOUSTIC 3-BAR CHIME BOX (CLICK ANY BAR)', 28, 32);

    // Wooden acoustic resonator chamber behind bars
    ctx.fillStyle = '#4e331f';
    ctx.strokeStyle = '#8b5e34';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, 36, 134, 344, 154, 8);
    ctx.fill();
    ctx.stroke();

    // Resonator sound ports
    [106, 214, 324].forEach((px, idx) => {
      ctx.fillStyle = '#22140a';
      ctx.beginPath();
      ctx.arc(px, 210, 22, 0, Math.PI * 2);
      ctx.fill();
      if (bars[idx].ring > 0.05) {
        ctx.strokeStyle = `rgba(255, 212, 102, ${bars[idx].ring * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, 210, 22 + (1 - bars[idx].ring) * 34, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // 3 Tuned Aluminum Tone Bars + Vertical Striker Solenoids underneath
    bars.forEach((b) => {
      const cx = b.x + 32;
      const barY = 104;
      const vib = b.ring * Math.sin(state.t * 48) * 3.5;

      // Sound ripples above ringing aluminum bar
      if (b.ring > 0.05) {
        ctx.strokeStyle = `rgba(255, 224, 110, ${b.ring * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, barY, 16 + (1 - b.ring) * 36, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }

      // Aluminum bar (shorter = higher pitch!)
      const barGrad = ctx.createLinearGradient(cx - 34, barY, cx + 34, barY);
      barGrad.addColorStop(0, '#9aa8ba');
      barGrad.addColorStop(0.5, b.ring > 0.1 ? '#fff7d6' : '#eef3f9');
      barGrad.addColorStop(1, '#7e8da3');
      ctx.fillStyle = barGrad;
      ctx.strokeStyle = b.ring > 0.1 ? '#f4c652' : '#58667a';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, cx - b.len * 0.34, barY + vib - 10, b.len * 0.68, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Label above bar
      ctx.fillStyle = b.ring > 0.1 ? '#ffd466' : '#cfd8e3';
      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, cx, 72);
      ctx.fillStyle = '#9aa8ba';
      ctx.font = '500 9.5px "IBM Plex Mono", monospace';
      ctx.fillText(b.note, cx, 86);

      // Vertical striker plunger shooting UP from solenoid!
      const strikeY = 148 - b.plunger * 34;
      ctx.fillStyle = '#dce4ee';
      ctx.fillRect(cx - 5, strikeY, 10, 48);
      ctx.fillStyle = '#e34b2d';
      ctx.beginPath();
      ctx.arc(cx, strikeY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Solenoid coil beneath resonator
      drawCoil(ctx, cx - 22, 246, 44, 58, {
        energized: b.plunger > 0.15,
        windings: 5,
      });
    });

    // Cabinet Replay Knocker assembly at bottom-left
    ctx.fillStyle = '#202633';
    ctx.strokeStyle = state.knockerAnim > 0.1 ? '#ff6a4a' : '#4a5568';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 36, 326, 344, 66, 8);
    ctx.fill();
    ctx.stroke();

    drawCoil(ctx, 56, 338, 76, 42, {
      energized: state.knockerAnim > 0.2,
      label: 'KNOCKER',
      windings: 6,
      color: '#c84b2b',
    });
    const kSlide = state.knockerAnim * 44;
    ctx.fillStyle = '#cfd8e3';
    ctx.fillRect(132 + kSlide, 353, 52, 12);
    // Steel strike plate bolted to cabinet wall
    ctx.fillStyle = '#8b97aa';
    ctx.fillRect(228, 336, 12, 46);
    if (state.knockerAnim > 0.25) {
      ctx.fillStyle = '#ffd466';
      ctx.font = '700 13px "IBM Plex Mono", monospace';
      ctx.textAlign = 'start';
      ctx.fillText('CRACK!!', 252, 364);
    } else {
      ctx.fillStyle = '#9aa8ba';
      ctx.font = '600 10.5px "IBM Plex Mono", monospace';
      ctx.textAlign = 'start';
      ctx.fillText('CABINET KNOCKER', 248, 355);
      ctx.font = '500 10px "IBM Plex Sans", sans-serif';
      ctx.fillText('Strikes wood on Match', 248, 372);
    }

    // RIGHT HALF: 00-90 Match Stepper Wheel & Replay vs Add-a-Ball Plug (x: 424..832)
    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('00–90 MATCH UNIT & OPERATOR CONVERSION', 436, 32);

    // Rotary Match Disc (center cx=564, cy=188)
    const mcx = 564;
    const mcy = 188;
    ctx.fillStyle = '#1e2533';
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(mcx, mcy, 114, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const rx = mcx + Math.cos(a) * 86;
      const ry = mcy + Math.sin(a) * 86;
      const active = i === state.matchStep;
      const isPlayer = i * 10 === state.playerLastTwo;

      drawLamp(ctx, rx, ry, active ? 17 : 13, active, String(i * 10).padStart(2, '0'));
      if (isPlayer) {
        ctx.strokeStyle = '#52c493';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rx, ry, 21, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Rotating wiper arm inside Match wheel
    const wa = -Math.PI / 2 + (state.displayStep / 10) * Math.PI * 2;
    ctx.save();
    ctx.translate(mcx, mcy);
    ctx.rotate(wa);
    ctx.strokeStyle = '#e8b948';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(66, 0);
    ctx.stroke();
    ctx.fillStyle = '#cfd8e3';
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right-most comparison & Jones Plug box (x: 702..834)
    ctx.fillStyle = '#1f2634';
    ctx.strokeStyle = '#52c493';
    ctx.lineWidth = 1.8;
    drawRoundedRect(ctx, 700, 68, 134, 96, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#9aa8ba';
    ctx.font = '700 9.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOUR SCORE', 767, 90);
    ctx.fillStyle = '#52c493';
    ctx.font = '700 26px "IBM Plex Mono", monospace';
    ctx.fillText(`..${String(state.playerLastTwo).padStart(2, '0')}`, 767, 126);
    ctx.fillStyle = '#cfd8e3';
    ctx.font = '500 10px "IBM Plex Sans", sans-serif';
    ctx.fillText('(Green ring)', 767, 150);

    ctx.fillStyle = state.wonMatch ? 'rgba(255, 212, 102, 0.2)' : '#1f2634';
    ctx.strokeStyle = state.wonMatch ? '#ffd466' : '#536073';
    drawRoundedRect(ctx, 700, 180, 134, 114, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#9aa8ba';
    ctx.font = '700 9.5px "IBM Plex Mono", monospace';
    ctx.fillText('JONES PLUG', 767, 202);
    ctx.fillStyle = '#ffd466';
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillText(state.addABallMode ? 'ADD-A-BALL' : 'REPLAY MODE', 767, 230);
    ctx.fillStyle = '#f6efe0';
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillText(`CREDITS: ${state.credits}`, 767, 258);
    ctx.fillText(`EXTRA BALLS: ${state.extraBalls}`, 767, 278);

    // Bottom legend under Match wheel
    ctx.fillStyle = '#9aa8ba';
    ctx.font = '500 11px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Every chime hit steps the 00–90 wiper, randomizing the end-of-game match.', 632, 344);
    ctx.fillText('Green ring marks your score’s tens digit (70).', 632, 364);
  }

  playerEndOut.textContent = String(state.playerLastTwo).padStart(2, '0');
  matchNumOut.textContent = String(state.matchStep * 10).padStart(2, '0');

  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 415,
    update,
    draw,
  });
}

/* ==========================================================================
   INTERACTIVE 7-GAME EL DORADO -> SOLAR CITY FAMILY TREE
   ========================================================================== */
function initFamilyTree() {
  const grid = document.getElementById('family-grid');
  const titleEl = document.getElementById('fam-title');
  const eraEl = document.getElementById('fam-era');
  const descEl = document.getElementById('fam-desc');
  const pillsEl = document.getElementById('fam-pills');
  if (!grid || !titleEl) return;

  const FAMILY = [
    {
      id: 'el-dorado',
      year: '1975',
      name: 'El Dorado',
      short: '1-Player · Original',
      era: 'Electromechanical · 1 Player',
      desc: 'Where it all began. Ed Krynski introduced this sweeping 15-drop-target, 4-flipper playfield in a classic single-player Western theme filled with cowboys and frontier gold imagery. Unlike Solar City, clearing all targets on El Dorado reset the bank during play.',
      pills: ['1 Player', 'Western Theme', 'Electromechanical', 'Original 1975 Layout'],
    },
    {
      id: 'gold-strike',
      year: '1975',
      name: 'Gold Strike',
      short: '1-Player · Add-a-Ball',
      era: 'Electromechanical · 1 Player (Add-a-Ball)',
      desc: 'A single-player sibling to El Dorado configured specifically as an add-a-ball machine—awarding extra balls instead of free replay credits so arcade operators could place Krynski’s hit layout in jurisdictions that restricted free games.',
      pills: ['1 Player', 'Add-a-Ball Variant', 'Electromechanical', 'Western Frontier'],
    },
    {
      id: 'lucky-strike',
      year: '1975',
      name: 'Lucky Strike',
      short: '1-Player · Italian Market',
      era: 'Electromechanical · 1 Player (Export)',
      desc: 'A dedicated export variant of the single-player El Dorado layout produced specifically for the Italian arcade market, demonstrating how universally appealing Krynski’s precision target geometry proved beyond North America.',
      pills: ['1 Player', 'Italian Export Market', 'Electromechanical', 'Add-a-Ball Rules'],
    },
    {
      id: 'target-alpha',
      year: '1976',
      name: 'Target Alpha',
      short: '4-Player · Best Seller',
      era: 'Electromechanical · 4 Players',
      desc: 'The four-player powerhouse and the most commercially successful member of the entire family. Featuring Gordon Morison’s vivid retro-futuristic archery artwork, Target Alpha brought the 15-target layout to bustling multiplayer arcades.',
      pills: ['4 Players', 'Most Commercially Successful', 'Gordon Morison Art', 'Electromechanical'],
    },
    {
      id: 'canada-dry',
      year: '1976',
      name: 'Canada Dry',
      short: '4-Player · France Promo',
      era: 'Electromechanical · 4 Players (Promotional)',
      desc: 'A rare promotional adaptation of Target Alpha produced for the Canada Dry soft drink brand in France—re-theming the iconic 15-target playfield and backglass for European commercial marketing.',
      pills: ['4 Players', 'Promotional Edition (France)', 'Canada Dry Brand', 'Electromechanical'],
    },
    {
      id: 'solar-city',
      year: '1977',
      name: 'Solar City',
      short: '2-Player · Our Spotlight',
      era: 'Electromechanical · 2 Players (Model #393)',
      desc: 'Released in February 1977 as the lower-cost two-player alternative to Target Alpha, dressed in original science-fantasy artwork by Gordon Morison. Every drop target scores a flat 300 pts + 1,000 bonus, stays down for the ball, and pairs with Replay/Add-a-Ball operator conversion.',
      pills: ['2 Players', 'Model #393', '~2,525–2,634 Built', 'Replay / Add-a-Ball', '50th Anniversary Feb 2027'],
    },
    {
      id: 'city-of-gold',
      year: '1984',
      name: 'El Dorado: City of Gold',
      short: '4-Player · Solid-State Revival',
      era: 'Solid-State Computerized · 4 Players',
      desc: 'Nine full years after El Dorado debuted, Gottlieb (under Premier Technology) revived Ed Krynski’s timeless layout as a fully computerized, solid-state machine with digital displays and electronic sound—a remarkable testament to an unforgettable mechanical design.',
      pills: ['4 Players', 'Solid-State (Microprocessor)', '9 Years After Original', '1984 Revival'],
    },
  ];

  function select(id) {
    const item = FAMILY.find((f) => f.id === id) || FAMILY[5];
    grid.querySelectorAll('.family-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.id === item.id));
    });
    titleEl.textContent = `${item.name} (${item.year})`;
    eraEl.textContent = item.era;
    descEl.textContent = item.desc;
    pillsEl.innerHTML = '';
    item.pills.forEach((txt) => {
      const span = document.createElement('span');
      span.className = 'pill';
      span.textContent = txt;
      pillsEl.appendChild(span);
    });
  }

  FAMILY.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'family-btn';
    btn.dataset.id = item.id;
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = `
      <span class="family-year">${item.year}</span>
      <span class="family-name">${item.name}</span>
      <span class="family-tag">${item.short}</span>
    `;
    btn.addEventListener('click', () => {
      audio.relayClick(0.2);
      select(item.id);
    });
    grid.appendChild(btn);
  });

  select('solar-city');
}

document.addEventListener('DOMContentLoaded', () => {
  initDiagram11();
  initDiagram12();
  initFamilyTree();
});
