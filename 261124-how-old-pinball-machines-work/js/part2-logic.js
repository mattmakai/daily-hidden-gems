import {
  audio,
  createDiagramRunner,
  drawBlueprintGrid,
  drawCoil,
  drawLamp,
  drawRoundedRect,
  drawWire,
  getCanvasPalette,
  syncSlider,
} from './core.js';

/* ==========================================================================
   DIAGRAM 6: TRANSFORMER, FUSES, SLAM SWITCH & DUAL-VOLTAGE POWER BUS
   ========================================================================== */
function initDiagram6() {
  const figure = document.getElementById('fig-power');
  const canvas = document.getElementById('d6-canvas');
  if (!figure || !canvas) return;

  const btnPower = document.getElementById('d6-power');
  const btnHold = document.getElementById('d6-hold');
  const btnSlam = document.getElementById('d6-slam');
  const dotPri = document.getElementById('d6-dot-pri');
  const dotLamp = document.getElementById('d6-dot-lamp');
  const dotSol = document.getElementById('d6-dot-sol');
  const priText = document.getElementById('d6-pri');
  const lampText = document.getElementById('d6-lamp');
  const solText = document.getElementById('d6-sol');

  const state = {
    powerOn: true,
    holdLatched: true,
    slamBounce: 0,
    phase: 0,
  };

  function syncUI() {
    btnPower.setAttribute('aria-pressed', String(state.powerOn));
    btnPower.textContent = state.powerOn ? 'Cabinet Power: ON' : 'Cabinet Power: OFF';
    btnHold.setAttribute('aria-pressed', String(state.holdLatched && state.powerOn));
    btnHold.disabled = !state.powerOn;

    const priLive = state.powerOn;
    const holdLive = state.powerOn && state.holdLatched && state.slamBounce <= 0.05;

    priText.textContent = priLive ? '120V AC (60 Hz)' : '0V (Disconnected)';
    dotPri.className = priLive ? 'telemetry-dot is-active' : 'telemetry-dot';

    lampText.textContent = holdLive ? '6.3V AC — Backglass & Playfield Lit' : priLive ? '6.3V AC — Waiting for Hold Relay' : '0V — Dark';
    dotLamp.className = holdLive ? 'telemetry-dot is-lamp' : 'telemetry-dot';

    solText.textContent = holdLive ? '24V AC — Hold Relay (H) Latched' : priLive ? '24V AC Standby — Press Engage Hold (H)' : '0V — Off';
    dotSol.className = holdLive ? 'telemetry-dot is-ok' : 'telemetry-dot';
  }

  btnPower.addEventListener('click', () => {
    state.powerOn = !state.powerOn;
    if (!state.powerOn) state.holdLatched = false;
    audio.relayClick(0.28);
    syncUI();
    runner.wake();
  });

  btnHold.addEventListener('click', () => {
    if (!state.powerOn) return;
    state.holdLatched = !state.holdLatched;
    audio.solenoidClack(200, 0.28);
    syncUI();
    runner.wake();
  });

  btnSlam.addEventListener('click', () => {
    state.slamBounce = 1;
    state.holdLatched = false;
    audio.tiltClang();
    syncUI();
    runner.wake();
  });

  function update(dt) {
    if (state.powerOn) state.phase += dt * 2.2;
    if (state.slamBounce > 0) {
      state.slamBounce = Math.max(0, state.slamBounce - dt * 1.6);
      if (state.slamBounce === 0) syncUI();
    }
    return state.powerOn || state.slamBounce > 0;
  }

  function drawSineWave(ctx, x, y, w, amp, freq, phase, color, active) {
    ctx.save();
    ctx.strokeStyle = active ? color : 'rgba(130, 145, 165, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const px = x + (w * i) / 48;
      const py = y + (active ? Math.sin(i * freq - phase * 6) * amp : 0);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const priLive = state.powerOn;
    const holdLive = state.powerOn && state.holdLatched && state.slamBounce <= 0.05;

    // 1. Wall Plug + Power Switch (Left)
    ctx.fillStyle = p.dark ? '#232934' : '#e6dfd1';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, 24, 118, 108, 124, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('120V AC', 78, 144);
    ctx.fillText('WALL MAINS', 78, 160);
    drawSineWave(ctx, 38, 190, 80, 16, 0.42, state.phase, p.wireHot, priLive);

    // Cabinet toggle switch on upper wire
    drawWire(ctx, [[132, 146], [176, 146]], { color: p.wireHot, energized: priLive, phase: state.phase });
    drawWire(ctx, [[222, 146], [268, 146]], { color: priLive ? p.wireHot : p.wireNeutral, energized: priLive, phase: state.phase });
    drawWire(ctx, [[132, 214], [268, 214]], { color: priLive ? p.wireHold : p.wireNeutral, energized: priLive, phase: state.phase });

    // Switch blade
    ctx.strokeStyle = priLive ? '#e34b2d' : '#7b879a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(176, 146);
    ctx.lineTo(222, priLive ? 146 : 124);
    ctx.stroke();
    ctx.fillStyle = p.inkMuted;
    ctx.font = '600 9.5px "IBM Plex Mono", monospace';
    ctx.fillText('MAIN SW', 198, 116);

    // 2. Iron-Core Step-Down Transformer (Center-Left: x=268..434)
    ctx.fillStyle = p.dark ? '#1f2531' : '#e0d8c8';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 268, 66, 166, 228, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.fillText('IRON TRANSFORMER', 351, 88);

    // Primary coil (many turns)
    drawCoil(ctx, 282, 128, 42, 108, { energized: priLive, windings: 12, color: '#b85028' });
    // Laminated iron core bars
    ctx.fillStyle = '#5c6a7d';
    ctx.fillRect(336, 104, 10, 174);
    ctx.fillRect(352, 104, 10, 174);
    if (priLive) {
      ctx.strokeStyle = 'rgba(244, 198, 82, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -state.phase * 28;
      drawRoundedRect(ctx, 329, 98, 40, 186, 6);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Secondary #1: 6.3V AC (upper, few turns)
    drawCoil(ctx, 376, 104, 42, 68, { energized: priLive, windings: 4, color: '#c48d24' });
    // Secondary #2: 24-25V AC (lower, medium turns)
    drawCoil(ctx, 376, 192, 42, 82, { energized: priLive, windings: 7, color: '#2b6da8' });

    // 3. Upper Branch: 6.3V AC Illumination Bus + Fuse + Lamps
    drawWire(ctx, [[418, 118], [508, 118]], { color: priLive ? p.wireLamp : p.wireNeutral, energized: priLive, phase: state.phase });
    drawWire(ctx, [[554, 118], [678, 118]], { color: holdLive ? p.wireLamp : p.wireNeutral, energized: holdLive, phase: state.phase });
    drawWire(ctx, [[418, 158], [678, 158]], { color: holdLive ? p.wireLamp : p.wireNeutral, energized: holdLive, phase: state.phase });

    // 15A Lamp Fuse
    ctx.fillStyle = p.dark ? '#252c38' : '#ffffff';
    ctx.strokeStyle = p.brass;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 508, 108, 46, 20, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 9px "IBM Plex Mono", monospace';
    ctx.fillText('15A', 531, 121);

    // Illumination Bus Box (right upper)
    ctx.fillStyle = p.dark ? '#171c26' : '#232833';
    drawRoundedRect(ctx, 678, 66, 158, 116, 10);
    ctx.fill();
    ctx.strokeStyle = holdLive ? '#f4c652' : '#4f5b6e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.fillText('6.3V AC LIGHTING', 757, 88);
    drawLamp(ctx, 714, 126, 13, holdLive, '#44');
    drawLamp(ctx, 757, 126, 13, holdLive, '#47');
    drawLamp(ctx, 800, 126, 13, holdLive, 'GI');
    ctx.fillStyle = holdLive ? '#ffd466' : '#8b97aa';
    ctx.font = '500 10px "IBM Plex Sans", sans-serif';
    ctx.fillText(holdLive ? 'Backglass & Playfield Lit' : 'Lamps Dark (H Open)', 757, 164);

    // 4. Lower Branch: 24V AC Solenoid/Logic Bus -> 10A Fuse -> Slam Switch (N.C.) -> Hold Relay (H) -> Coils
    drawWire(ctx, [[418, 212], [472, 212]], { color: priLive ? p.wireHot : p.wireNeutral, energized: priLive, phase: state.phase });
    // 10A Slow-Blow Fuse
    ctx.fillStyle = p.dark ? '#252c38' : '#ffffff';
    ctx.strokeStyle = p.crimson;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 472, 202, 46, 20, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 9px "IBM Plex Mono", monospace';
    ctx.fillText('10A SB', 495, 215);

    drawWire(ctx, [[518, 212], [548, 212]], { color: priLive ? p.wireHot : p.wireNeutral, energized: priLive, phase: state.phase });

    // Normally Closed Slam Switch (bounces OPEN when slamBounce > 0!)
    const slamOpen = state.slamBounce > 0.1;
    ctx.strokeStyle = slamOpen ? '#e34b2d' : '#28a673';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(548, 212);
    ctx.lineTo(594, slamOpen ? 192 : 212);
    ctx.stroke();
    ctx.fillStyle = slamOpen ? '#e34b2d' : p.inkMuted;
    ctx.font = '700 9.5px "IBM Plex Mono", monospace';
    ctx.fillText(slamOpen ? 'SLAM OPEN!' : 'SLAM (N.C.)', 571, 236);

    drawWire(ctx, [[594, 212], [622, 212]], { color: holdLive ? p.wireHot : p.wireNeutral, energized: holdLive, phase: state.phase });

    // Hold Relay (H) Contact Block
    ctx.fillStyle = holdLive ? 'rgba(227, 75, 45, 0.16)' : p.dark ? '#202633' : '#e9e2d4';
    ctx.strokeStyle = holdLive ? '#e34b2d' : p.inkMuted;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 622, 194, 40, 38, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillText('H', 642, 218);

    drawWire(ctx, [[662, 212], [678, 212]], { color: holdLive ? p.wireHot : p.wireNeutral, energized: holdLive, phase: state.phase });
    drawWire(ctx, [[418, 260], [678, 260]], { color: holdLive ? p.wireHold : p.wireNeutral, energized: holdLive, phase: state.phase });

    // 24V AC Logic/Solenoid Bus Box (right lower)
    ctx.fillStyle = p.dark ? '#171c26' : '#232833';
    drawRoundedRect(ctx, 678, 198, 158, 128, 10);
    ctx.fill();
    ctx.strokeStyle = holdLive ? '#e34b2d' : '#4f5b6e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.fillText('24–25V AC BUS', 757, 220);
    drawSineWave(ctx, 700, 248, 114, 11, 0.38, state.phase, '#e34b2d', holdLive);
    ctx.fillStyle = holdLive ? '#ffd466' : '#8b97aa';
    ctx.font = '500 10px "IBM Plex Sans", sans-serif';
    ctx.fillText('Flippers · Relays · Motor', 757, 282);
    ctx.fillText('Reels · Steppers · Chimes', 757, 298);
    ctx.fillText(holdLive ? 'ACTIVE & ARMED' : 'DE-ENERGIZED', 757, 316);
  }

  syncUI();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 360,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 7: ELECTROMECHANICAL RELAY, SELF-HOLDING & LATCH-TRIP MEMORY
   ========================================================================== */
function initDiagram7() {
  const figure = document.getElementById('fig-relay');
  const canvas = document.getElementById('d7-canvas');
  if (!figure || !canvas) return;

  const btnMomentary = document.getElementById('d7-mode-momentary');
  const btnHold = document.getElementById('d7-mode-hold');
  const btnLatch = document.getElementById('d7-mode-latch');
  const btnPulse = document.getElementById('d7-pulse');
  const btnRelease = document.getElementById('d7-release');

  const dotCoil = document.getElementById('d7-dot-coil');
  const dotMem = document.getElementById('d7-dot-mem');
  const coilStateOut = document.getElementById('d7-coil-state');
  const memStateOut = document.getElementById('d7-mem-state');
  const pathStateOut = document.getElementById('d7-path-state');

  const state = {
    mode: 'momentary', // 'momentary' | 'hold' | 'latch'
    inputHeld: false,
    pulseTimer: 0,
    tripTimer: 0,
    latchedBit: false,
    armature: 0,       // 0 = up/rest, 1 = pulled down
    phase: 0,
  };

  function setMode(mode) {
    state.mode = mode;
    state.latchedBit = false;
    state.pulseTimer = 0;
    state.tripTimer = 0;
    btnMomentary.setAttribute('aria-pressed', String(mode === 'momentary'));
    btnHold.setAttribute('aria-pressed', String(mode === 'hold'));
    btnLatch.setAttribute('aria-pressed', String(mode === 'latch'));
    btnRelease.disabled = mode === 'momentary';
    btnPulse.textContent = mode === 'momentary' ? 'Hold Input Trigger' : mode === 'hold' ? 'Tap Input Pulse (Lock ON)' : 'Pulse Latch Coil';
    btnRelease.textContent = mode === 'hold' ? 'Break Lock-In Circuit' : 'Pulse Trip Coil (Reset)';
    audio.relayClick(0.2);
    runner.wake();
  }

  btnMomentary.addEventListener('click', () => setMode('momentary'));
  btnHold.addEventListener('click', () => setMode('hold'));
  btnLatch.addEventListener('click', () => setMode('latch'));

  btnPulse.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (state.mode === 'momentary') {
      state.inputHeld = true;
      audio.relayClick(0.32);
    } else {
      state.pulseTimer = 0.45;
      state.latchedBit = true;
      audio.solenoidClack(230, 0.32);
    }
    runner.wake();
  });
  window.addEventListener('pointerup', () => {
    if (state.inputHeld) {
      state.inputHeld = false;
      audio.relayClick(0.18);
      runner.wake();
    }
  });
  btnPulse.addEventListener('click', () => {
    // Support keyboard click (Enter/Space)
    if (state.mode === 'momentary' && !state.inputHeld) {
      state.pulseTimer = 0.7;
      audio.relayClick(0.32);
      runner.wake();
    } else if (state.mode !== 'momentary' && state.pulseTimer <= 0) {
      state.pulseTimer = 0.45;
      state.latchedBit = true;
      audio.solenoidClack(230, 0.32);
      runner.wake();
    }
  });

  btnRelease.addEventListener('click', () => {
    if (state.mode === 'hold') {
      state.latchedBit = false;
      audio.relayClick(0.26);
    } else if (state.mode === 'latch') {
      state.tripTimer = 0.45;
      state.latchedBit = false;
      audio.solenoidClack(185, 0.3);
    }
    runner.wake();
  });

  function update(dt) {
    let busy = false;
    if (state.pulseTimer > 0) {
      state.pulseTimer = Math.max(0, state.pulseTimer - dt);
      busy = true;
    }
    if (state.tripTimer > 0) {
      state.tripTimer = Math.max(0, state.tripTimer - dt);
      busy = true;
    }

    const inputPulse = state.inputHeld || state.pulseTimer > 0;
    const coilHot = state.mode === 'momentary' ? inputPulse : state.mode === 'hold' ? inputPulse || state.latchedBit : inputPulse;
    const targetArm = state.mode === 'momentary' ? (inputPulse ? 1 : 0) : state.latchedBit ? 1 : 0;

    if (Math.abs(state.armature - targetArm) > 0.005) {
      state.armature += (targetArm - state.armature) * Math.min(1, dt * 16);
      busy = true;
    } else {
      state.armature = targetArm;
    }

    if (coilHot || state.tripTimer > 0) {
      state.phase += dt * 2.8;
      busy = true;
    }

    const active = state.armature > 0.6;
    coilStateOut.textContent = coilHot ? 'ENERGIZED (24V AC)' : state.tripTimer > 0 ? 'TRIP COIL FIRING' : 'De-energized (0A)';
    dotCoil.className = coilHot || state.tripTimer > 0 ? 'telemetry-dot is-active' : 'telemetry-dot';

    memStateOut.textContent = active
      ? state.mode === 'latch'
        ? '1 (Mechanically Latched — Zero Power!)'
        : state.mode === 'hold'
          ? '1 (Self-Held via Lock-In Contact)'
          : '1 (Active While Pulsed)'
      : '0 (At Rest)';
    dotMem.className = active ? 'telemetry-dot is-ok' : 'telemetry-dot';

    pathStateOut.textContent = active ? 'N.O. CLOSED · N.C. OPEN · C → Top' : 'N.O. Open · N.C. CLOSED · C → Bottom';

    return busy;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const inputPulse = state.inputHeld || state.pulseTimer > 0;
    const coilHot = state.mode === 'momentary' ? inputPulse : state.mode === 'hold' ? inputPulse || state.latchedBit : inputPulse;
    const active = state.armature > 0.6;

    // Header explanation tag
    ctx.fillStyle = p.ink;
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    const modeLabel =
      state.mode === 'momentary'
        ? 'MODE 1: MOMENTARY RELAY (Standard Scoring / Feature Relay)'
        : state.mode === 'hold'
          ? 'MODE 2: SELF-HOLDING LOCK-IN RELAY (e.g. Hold "H" / Start "S")'
          : 'MODE 3: DUAL-COIL LATCH / TRIP RELAY (Zero-Power Mechanical RAM)';
    ctx.fillText(modeLabel, 24, 34);

    // Left: Electromagnet Coil & L-Shaped Frame
    ctx.fillStyle = '#536073';
    ctx.fillRect(150, 294, 178, 16);
    ctx.fillRect(150, 140, 16, 156);

    drawCoil(ctx, 184, 188, 92, 106, {
      energized: coilHot,
      label: state.mode === 'latch' ? 'LATCH' : '24V COIL',
      windings: 9,
    });

    // Iron core pole face sticking out top of coil
    ctx.fillStyle = '#8b99ad';
    ctx.fillRect(218, 168, 24, 20);

    // Input trigger wire to coil
    drawWire(ctx, [[34, 218], [92, 218]], { color: p.wireHot, energized: inputPulse, phase: state.phase });
    // Trigger switch symbol
    ctx.strokeStyle = inputPulse ? '#e34b2d' : '#c6922c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(92, 218);
    ctx.lineTo(132, inputPulse ? 218 : 200);
    ctx.stroke();
    drawWire(ctx, [[132, 218], [184, 218]], { color: coilHot ? p.wireHot : p.wireNeutral, energized: coilHot, phase: state.phase });
    drawWire(ctx, [[184, 268], [34, 268]], { color: coilHot ? p.wireHold : p.wireNeutral, energized: coilHot, phase: state.phase });

    ctx.fillStyle = p.inkMuted;
    ctx.font = '600 10px "IBM Plex Mono", monospace';
    ctx.fillText('24V IN', 34, 206);
    ctx.fillText('TRIGGER', 88, 244);

    // Hinged Steel Armature Plate pivoting at (158, 146)
    const pivotX = 158;
    const pivotY = 146;
    const armAngle = -0.14 + state.armature * 0.17;
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(armAngle);
    ctx.fillStyle = '#cfd8e3';
    ctx.strokeStyle = '#475366';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, -6, -8, 198, 16, 4);
    ctx.fill();
    ctx.stroke();
    // Pivot pin
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#b8341d';
    ctx.fill();
    ctx.restore();

    // Mechanical Hook & Trip Coil in Dual-Coil Latch/Trip Mode!
    if (state.mode === 'latch') {
      const hookEngaged = state.latchedBit && state.tripTimer <= 0.1;
      const hookX = 354 + (hookEngaged ? -10 : 12);
      ctx.fillStyle = '#d4a33b';
      ctx.strokeStyle = '#6c4912';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hookX, 134);
      ctx.lineTo(hookX + 18, 134);
      ctx.lineTo(hookX + 18, 198);
      ctx.lineTo(hookX + 8, 198);
      ctx.lineTo(hookX + 8, 150);
      ctx.lineTo(hookX, 150);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      drawCoil(ctx, 318, 212, 66, 62, {
        energized: state.tripTimer > 0,
        label: 'TRIP',
        windings: 6,
        color: '#2f6ca3',
      });
      ctx.fillStyle = p.ink;
      ctx.font = '700 9.5px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hookEngaged ? 'LOCKED!' : 'UNLATCHED', 352, 122);
    }

    // Brown Bakelite Actuator Comb pushed downward by armature tip (x ~ 336)
    const combY = 148 + state.armature * 26;
    ctx.fillStyle = '#7b4125';
    ctx.strokeStyle = '#421e0e';
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, 412, combY - 36, 16, 218, 4);
    ctx.fill();
    ctx.stroke();

    // Connecting rod from armature tip to Bakelite comb
    ctx.strokeStyle = '#536073';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(346, 136 + state.armature * 26);
    ctx.lineTo(412, combY - 14);
    ctx.stroke();

    // Self-Holding Feedback Wire shown clearly in Mode 2!
    if (state.mode === 'hold') {
      drawWire(
        ctx,
        [[606, 134], [606, 86], [156, 86], [156, 218]],
        {
          color: state.latchedBit ? '#e34b2d' : '#8090a6',
          width: 2.8,
          energized: state.latchedBit,
          phase: state.phase,
          glow: true,
        }
      );
      ctx.fillStyle = state.latchedBit ? '#e34b2d' : p.inkMuted;
      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SELF-HOLDING FEEDBACK LOOP (N.O. FEEDS OWN COIL)', 380, 74);
    }

    // THREE LEAF SWITCH STACKS (Right Half: x = 445..790)
    const stacks = [
      {
        y: 146,
        code: 'A · NORMALLY OPEN (N.O.)',
        closed: active,
        lampLabel: state.mode === 'hold' ? 'LOCK' : '100',
        type: 'no',
      },
      {
        y: 236,
        code: 'B · NORMALLY CLOSED (N.C.)',
        closed: !active,
        lampLabel: 'IDLE',
        type: 'nc',
      },
      {
        y: 326,
        code: 'C · MAKE / BREAK (SPDT)',
        closed: active,
        lampLabel: active ? 'ALT' : 'DEF',
        type: 'mb',
      },
    ];

    stacks.forEach((st) => {
      const deflect = state.armature * 18;
      ctx.fillStyle = p.ink;
      ctx.font = '700 10.5px "IBM Plex Mono", monospace';
      ctx.textAlign = 'start';
      ctx.fillText(st.code, 446, st.y - 30);

      // Bakelite mounting spacer on right
      ctx.fillStyle = '#5c331d';
      ctx.fillRect(588, st.y - 16, 18, 36);

      if (st.type === 'no') {
        // Upper moving blade pushed DOWN onto lower stationary blade
        ctx.strokeStyle = st.closed ? '#e34b2d' : '#c6922c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(588, st.y - 10);
        ctx.lineTo(446, st.y - 14 + deflect);
        ctx.moveTo(588, st.y + 8);
        ctx.lineTo(446, st.y + 8);
        ctx.stroke();
        drawWire(ctx, [[606, st.y], [728, st.y]], {
          color: st.closed ? '#e34b2d' : p.wireNeutral,
          energized: st.closed,
          phase: state.phase,
        });
        drawLamp(ctx, 756, st.y, 16, st.closed, st.lampLabel);
      } else if (st.type === 'nc') {
        // Upper blade sits touching lower blade at rest; comb pushes lower blade DOWN to break!
        ctx.strokeStyle = st.closed ? '#28a673' : '#8592a6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(588, st.y - 6);
        ctx.lineTo(446, st.y - 6);
        ctx.moveTo(588, st.y + 4);
        ctx.lineTo(446, st.y - 2 + deflect);
        ctx.stroke();
        drawWire(ctx, [[606, st.y], [728, st.y]], {
          color: st.closed ? '#28a673' : p.wireNeutral,
          energized: st.closed,
          phase: state.phase,
        });
        drawLamp(ctx, 756, st.y, 16, st.closed, st.lampLabel);
      } else {
        // Changeover center blade switches from top contact to bottom contact!
        ctx.strokeStyle = '#c6922c';
        ctx.lineWidth = 3;
        // Top stationary blade
        ctx.beginPath();
        ctx.moveTo(588, st.y - 14);
        ctx.lineTo(454, st.y - 14);
        // Bottom stationary blade
        ctx.moveTo(588, st.y + 14);
        ctx.lineTo(454, st.y + 14);
        ctx.stroke();
        // Moving center wiper blade
        ctx.strokeStyle = active ? '#2f82cf' : '#28a673';
        ctx.beginPath();
        ctx.moveTo(588, st.y);
        ctx.lineTo(446, st.y - 11 + deflect * 1.25);
        ctx.stroke();

        drawWire(ctx, [[606, st.y - 14], [728, st.y - 14]], {
          color: !active ? '#28a673' : p.wireNeutral,
          energized: !active,
          phase: state.phase,
        });
        drawWire(ctx, [[606, st.y + 14], [728, st.y + 14]], {
          color: active ? '#2f82cf' : p.wireNeutral,
          energized: active,
          phase: state.phase,
        });
        drawLamp(ctx, 756, st.y - 14, 11, !active, '1');
        drawLamp(ctx, 756, st.y + 14, 11, active, '2');
      }
    });
  }

  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 410,
    update,
    draw,
  });
  setMode('momentary');
}

/* ==========================================================================
   DIAGRAM 8: GOTTLIEB SCORE MOTOR (1/3-REVOLUTION CAM SEQUENCER + TIMING CHART)
   ========================================================================== */
function initDiagram8() {
  const figure = document.getElementById('fig-motor');
  const canvas = document.getElementById('d8-canvas');
  if (!figure || !canvas) return;

  const btn500 = document.getElementById('d8-score-500');
  const btnReset = document.getElementById('d8-full-reset');
  const btnPause = document.getElementById('d8-pause');
  const angleSlider = document.getElementById('d8-angle');
  const angleVal = document.getElementById('d8-angle-val');

  const dotRun = document.getElementById('d8-dot-run');
  const idxState = document.getElementById('d8-idx-state');
  const pulsesOut = document.getElementById('d8-pulses');
  const phaseOut = document.getElementById('d8-phase');

  // Cam lobe profile functions returning boolean (true = switch closed / lifted)
  function is1CClosed(deg) {
    const m = ((deg % 120) + 120) % 120;
    return m > 5 && m < 115; // Drops into deep notch at 0°, 120°, 240°!
  }

  // 5 crisp scoring pulses per 120° cycle (at 16°, 34°, 52°, 70°, 88° inside each 120° sector)
  function is1AClosed(deg) {
    const m = ((deg % 120) + 120) % 120;
    const starts = [14, 32, 50, 68, 86];
    return starts.some((s) => m >= s && m < s + 9);
  }

  // 2B Reset / Z1-Z2 Relay pulse window (active mid-sector)
  function is2BClosed(deg) {
    const m = ((deg % 120) + 120) % 120;
    return m >= 24 && m <= 94;
  }

  // 4C Outhole Serve pulse near end of 120° turn
  function is4CClosed(deg) {
    const m = ((deg % 120) + 120) % 120;
    return m >= 98 && m <= 112;
  }

  const state = {
    angle: 0,           // 0..360
    targetAngle: 0,
    running: false,
    paused: false,
    mode: 'idle',       // 'idle' | 'score500' | 'reset360'
    pulses: 0,
    prev1A: false,
  };

  function updateAngleUI() {
    const mod = Math.round(state.angle) % 360;
    const atNotch = !is1CClosed(mod);
    angleSlider.value = String(mod);
    syncSlider(angleSlider);
    angleVal.textContent = atNotch ? `${mod}° (Index Notch)` : `${mod}°`;

    idxState.textContent = atNotch ? `STOPPED IN NOTCH (${mod}°)` : `CLOSED — SELF-RUNNING (${mod}°)`;
    dotRun.className = atNotch ? 'telemetry-dot' : 'telemetry-dot is-active';
    pulsesOut.textContent = String(state.pulses);

    if (state.mode === 'reset360') {
      if (mod < 120) phaseOut.textContent = '1st 1/3 Turn (0°–120°): Latch S/H Relays & Play Meter';
      else if (mod < 240) phaseOut.textContent = '2nd 1/3 Turn (120°–240°): Z1/Z2 Zero Score Reels & Steppers';
      else phaseOut.textContent = '3rd 1/3 Turn (240°–360°): Reset Banks & Outhole Ball Serve';
    } else if (state.mode === 'score500') {
      phaseOut.textContent = `1/3 Turn Scoring Cycle: Cam 1A pulsing 100-pt relay (${state.pulses}/5)`;
    } else {
      phaseOut.textContent = atNotch ? 'Idle at 120° home notch' : 'Manual shaft inspection';
    }
  }

  btn500.addEventListener('click', () => {
    const nextStop = (Math.floor(state.angle / 120) + 1) * 120;
    state.targetAngle = nextStop;
    state.running = true;
    state.paused = false;
    btnPause.textContent = 'Pause';
    state.mode = 'score500';
    state.pulses = 0;
    audio.relayClick(0.26);
    runner.wake();
  });

  btnReset.addEventListener('click', () => {
    state.angle = 0;
    state.targetAngle = 360;
    state.running = true;
    state.paused = false;
    btnPause.textContent = 'Pause';
    state.mode = 'reset360';
    state.pulses = 0;
    audio.solenoidClack(190, 0.3);
    runner.wake();
  });

  btnPause.addEventListener('click', () => {
    if (!state.running) return;
    state.paused = !state.paused;
    btnPause.textContent = state.paused ? 'Play' : 'Pause';
    if (!state.paused) runner.wake();
  });

  angleSlider.addEventListener('input', () => {
    state.running = false;
    state.mode = 'idle';
    state.angle = Number(angleSlider.value);
    const now1A = is1AClosed(state.angle);
    if (now1A && !state.prev1A) {
      state.pulses += 1;
      audio.chime(1);
    }
    state.prev1A = now1A;
    updateAngleUI();
    runner.renderOnce();
  });

  function update(dt) {
    if (!state.running || state.paused) return false;
    const speedDegPerSec = state.mode === 'reset360' ? 92 : 76;
    state.angle = Math.min(state.targetAngle, state.angle + dt * speedDegPerSec);

    const now1A = is1AClosed(state.angle);
    if (now1A && !state.prev1A) {
      state.pulses += 1;
      if (state.mode === 'score500') audio.chime(1);
      else audio.relayClick(0.18);
    }
    state.prev1A = now1A;

    if (state.angle >= state.targetAngle) {
      if (state.angle >= 360) {
        state.angle = 0;
        state.targetAngle = 0;
        audio.solenoidClack(160, 0.35);
      } else {
        audio.relayClick(0.24);
      }
      state.running = false;
      state.mode = 'idle';
      updateAngleUI();
      return false;
    }

    updateAngleUI();
    return true;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const mod = ((state.angle % 360) + 360) % 360;
    const rad = (mod * Math.PI) / 180;
    const c1C = is1CClosed(mod);
    const c1A = is1AClosed(mod);
    const c2B = is2BClosed(mod);
    const c4C = is4CClosed(mod);

    // LEFT SIDE: Rotating Concentric Gottlieb Cam Disc Stack (center 195, 224)
    const cx = 195;
    const cy = 224;

    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GOTTLIEB CAM DISC STACK', cx, 32);

    // Outer 1A 5-Lobe Scoring Cam (radius 114, 15 teeth around 360°!)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-rad);

    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 2) {
      const a = (deg * Math.PI) / 180;
      const r = is1AClosed(deg) ? 124 : 108;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (deg === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = p.dark ? '#382a20' : '#9c6844';
    ctx.fill();
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner 1C Index Cam (radius 78, 3 deep notches at 0°, 120°, 240°!)
    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 2) {
      const a = (deg * Math.PI) / 180;
      const r = is1CClosed(deg) ? 80 : 62;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (deg === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = p.dark ? '#233044' : '#355175';
    ctx.fill();
    ctx.strokeStyle = '#8cc4f8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 120° sector divider lines printed on cam face
    [0, 120, 240].forEach((d) => {
      const a = (d * Math.PI) / 180;
      ctx.strokeStyle = 'rgba(255, 244, 214, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 105, Math.sin(a) * 105);
      ctx.stroke();
    });

    // Brass center motor hub
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#d4a33b';
    ctx.fill();
    ctx.strokeStyle = '#5e400b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Stationary Switch Followers pressing against right side of cams (at angle 0°!)
    // Outer 1A Switch Follower
    const f1AX = cx + (c1A ? 126 : 110);
    ctx.strokeStyle = c1A ? '#e34b2d' : '#c6922c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(f1AX, cy - 42);
    ctx.lineTo(f1AX, cy + 42);
    ctx.stroke();
    ctx.fillStyle = c1A ? '#e34b2d' : '#cfd8e3';
    ctx.beginPath();
    ctx.arc(f1AX, cy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner 1C Index Follower (pointing vertically at top? Let's place at 0° right inside!)
    const f1CX = cx + (c1C ? 82 : 64);
    ctx.fillStyle = c1C ? '#28a673' : '#9aa8ba';
    ctx.beginPath();
    ctx.arc(f1CX, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cam legend badges below disc
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = c1A ? '#e34b2d' : p.inkMuted;
    ctx.fillText(`CAM 1A (5-PULSE): ${c1A ? 'PULSE!' : 'OPEN'}`, cx, 382);
    ctx.fillStyle = c1C ? '#28a673' : p.inkMuted;
    ctx.fillText(`CAM 1C (INDEX): ${c1C ? 'SELF-HOLD' : 'HOME NOTCH'}`, cx, 404);

    // RIGHT SIDE: Synchronized Gottlieb Schematic Timing Chart (x: 382..832)
    const chartX = 382;
    const chartY = 58;
    const chartW = 450;
    const chartH = 330;

    ctx.fillStyle = p.dark ? '#131822' : '#ffffff';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, chartX, chartY, chartW, chartH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('GOTTLIEB SCORE MOTOR TIMING CHART (3 × 120° CYCLES)', chartX, 42);

    // 3 Sector columns (0–120°, 120–240°, 240–360°)
    const secW = chartW / 3;
    ['1st 1/3 (0°–120°)', '2nd 1/3 (120°–240°)', '3rd 1/3 (240°–360°)'].forEach((lbl, i) => {
      const sx = chartX + i * secW;
      if (i > 0) {
        ctx.strokeStyle = p.wireNeutral;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, chartY);
        ctx.lineTo(sx, chartY + chartH);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = p.inkMuted;
      ctx.font = '700 9.5px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lbl, sx + secW / 2, chartY + 20);
    });

    // Draw 4 switch tracks across the chart
    const tracks = [
      { name: '1C Index', fn: is1CClosed, y: chartY + 76, color: '#28a673', active: c1C },
      { name: '1A Score (5×)', fn: is1AClosed, y: chartY + 152, color: '#e34b2d', active: c1A },
      { name: '2B Reset Bus', fn: is2BClosed, y: chartY + 228, color: '#2f82cf', active: c2B },
      { name: '4C Ball Serve', fn: is4CClosed, y: chartY + 300, color: '#d4a33b', active: c4C },
    ];

    tracks.forEach((tr) => {
      ctx.fillStyle = tr.active ? tr.color : p.inkMuted;
      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'start';
      ctx.fillText(tr.name, chartX + 10, tr.y - 24);

      // Baseline
      ctx.strokeStyle = p.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, tr.y);
      ctx.lineTo(chartX + chartW, tr.y);
      ctx.stroke();

      // Square-wave cam profile
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let d = 0; d <= 360; d += 1) {
        const px = chartX + (d / 360) * chartW;
        const py = tr.fn(d) ? tr.y - 18 : tr.y;
        if (d === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Live vertical playhead cursor across timing chart
    const cursorX = chartX + (mod / 360) * chartW;
    ctx.strokeStyle = '#e34b2d';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cursorX, chartY + 26);
    ctx.lineTo(cursorX, chartY + chartH);
    ctx.stroke();

    // Glowing dots on active track intersections
    tracks.forEach((tr) => {
      const py = tr.active ? tr.y - 18 : tr.y;
      ctx.fillStyle = tr.active ? tr.color : p.inkMuted;
      ctx.beginPath();
      ctx.arc(cursorX, py, tr.active ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  updateAngleUI();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 445,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 9: SOLAR CITY BONUS STEPPER UNIT (0–15K + LAST-BALL DOUBLE BONUS)
   ========================================================================== */
function initDiagram9() {
  const figure = document.getElementById('fig-stepper');
  const canvas = document.getElementById('d9-canvas');
  if (!figure || !canvas) return;

  const btnStepUp = document.getElementById('d9-step-up');
  const btnFill5 = document.getElementById('d9-fill-five');
  const btnDouble = document.getElementById('d9-double');
  const btnDrain = document.getElementById('d9-drain');
  const posOut = document.getElementById('d9-pos');
  const zeroOut = document.getElementById('d9-zero');
  const dotZero = document.getElementById('d9-dot-zero');
  const awardedOut = document.getElementById('d9-awarded');

  const state = {
    step: 0,           // 0..15 (1,000 per drop target!)
    displayStep: 0,
    doubleBonus: false,
    draining: false,
    drainTimer: 0,
    stepUpAnim: 0,
    stepDownAnim: 0,
    awarded: 0,
  };

  function syncTelemetry() {
    posOut.textContent = `${state.step} / 15 (${(state.step * 1000).toLocaleString()} pts${state.doubleBonus ? ' ×2' : ''})`;
    const atZero = state.step === 0;
    zeroOut.textContent = atZero ? 'OPEN (At Home — Serve Next Ball)' : 'CLOSED (Bonus Remaining)';
    dotZero.className = atZero ? 'telemetry-dot' : 'telemetry-dot is-active';
    awardedOut.textContent = `${state.awarded.toLocaleString()} pts`;
  }

  function stepUp(count = 1) {
    if (state.draining) return;
    const prev = state.step;
    state.step = Math.min(15, state.step + count);
    if (state.step > prev) {
      state.stepUpAnim = 1;
      audio.solenoidClack(235, 0.3);
      syncTelemetry();
      runner.wake();
    }
  }

  btnStepUp.addEventListener('click', () => stepUp(1));
  btnFill5.addEventListener('click', () => stepUp(5));

  btnDouble.addEventListener('click', () => {
    state.doubleBonus = !state.doubleBonus;
    btnDouble.setAttribute('aria-pressed', String(state.doubleBonus));
    audio.relayClick(0.24);
    syncTelemetry();
    runner.renderOnce();
  });

  btnDrain.addEventListener('click', () => {
    if (state.step === 0 || state.draining) return;
    state.draining = true;
    state.drainTimer = 0.08;
    runner.wake();
  });

  function update(dt) {
    let busy = false;
    if (Math.abs(state.displayStep - state.step) > 0.01) {
      state.displayStep += (state.step - state.displayStep) * Math.min(1, dt * 16);
      busy = true;
    } else {
      state.displayStep = state.step;
    }

    if (state.stepUpAnim > 0) {
      state.stepUpAnim = Math.max(0, state.stepUpAnim - dt * 5);
      busy = true;
    }
    if (state.stepDownAnim > 0) {
      state.stepDownAnim = Math.max(0, state.stepDownAnim - dt * 5);
      busy = true;
    }

    if (state.draining) {
      busy = true;
      state.drainTimer -= dt;
      if (state.drainTimer <= 0) {
        if (state.step > 0) {
          state.step -= 1;
          state.stepDownAnim = 1;
          state.awarded += state.doubleBonus ? 2000 : 1000;
          audio.chime(2);
          if (state.doubleBonus) {
            setTimeout(() => audio.chime(2), 95);
          }
          syncTelemetry();
          state.drainTimer = state.doubleBonus ? 0.32 : 0.24;
        } else {
          state.draining = false;
          audio.solenoidClack(150, 0.36); // Outhole serves next ball!
          syncTelemetry();
        }
      }
    }

    return busy;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    // LEFT/CENTER: Circular Bakelite Rivet Board & Ratchet Stepper (cx=280, cy=212)
    const cx = 285;
    const cy = 212;
    const startAngle = -Math.PI * 0.8;
    const sweepAngle = Math.PI * 1.6;

    // Bakelite board disc
    ctx.fillStyle = '#5e3521';
    ctx.strokeStyle = '#33180b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 136, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner steel ratchet gear wheel
    const wiperAngle = startAngle + (state.displayStep / 15) * sweepAngle;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(wiperAngle);
    ctx.fillStyle = '#aeb9c7';
    ctx.strokeStyle = '#475366';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const teeth = 24;
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? 56 : 47;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 16 Brass Contact Rivets (0..15)
    for (let i = 0; i <= 15; i++) {
      const a = startAngle + (i / 15) * sweepAngle;
      const rx = cx + Math.cos(a) * 102;
      const ry = cy + Math.sin(a) * 102;
      const active = i === state.step;
      const lit = i > 0 && i <= state.step;

      ctx.beginPath();
      ctx.arc(rx, ry, active ? 7.5 : 5.5, 0, Math.PI * 2);
      ctx.fillStyle = active ? '#ffd466' : lit ? '#d4a33b' : '#8d6c3a';
      ctx.fill();
      ctx.strokeStyle = '#29150b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Rivet label outside ring
      const lx = cx + Math.cos(a) * 121;
      const ly = cy + Math.sin(a) * 121;
      ctx.fillStyle = active ? '#ffd466' : '#e6dcd0';
      ctx.font = '700 9px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i === 0 ? '0' : `${i}K`, lx, ly);
    }

    // Rotating Brass Wiper Arm sweeping over current rivet
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(wiperAngle);
    ctx.fillStyle = '#e8b948';
    ctx.strokeStyle = '#6c4912';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, -10, -7, 118, 14, 5);
    ctx.fill();
    ctx.stroke();
    // Contact shoe at rivet tip
    ctx.fillStyle = '#fff5be';
    ctx.beginPath();
    ctx.arc(102, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    // Center shaft nut
    ctx.fillStyle = '#475366';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Left Coils: Step-Up (top-left) & Step-Down (bottom-left)
    drawCoil(ctx, 26, 76, 86, 54, {
      energized: state.stepUpAnim > 0.1,
      label: 'STEP UP',
      windings: 7,
      color: '#c85c2b',
    });
    // Drive pawl bar
    ctx.strokeStyle = '#536073';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(112, 103);
    ctx.lineTo(192 + state.stepUpAnim * 18, 156);
    ctx.stroke();

    drawCoil(ctx, 26, 286, 86, 54, {
      energized: state.stepDownAnim > 0.1,
      label: 'STEP DN',
      windings: 7,
      color: '#2b6da8',
    });
    ctx.strokeStyle = '#536073';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(112, 313);
    ctx.lineTo(192 + state.stepDownAnim * 18, 266);
    ctx.stroke();

    // Zero Position Switch callout at top
    const zeroClosed = state.step > 0;
    ctx.fillStyle = p.ink;
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(zeroClosed ? 'ZERO SW: CLOSED (Keep Counting)' : 'ZERO SW: OPEN (Count Done!)', cx, 386);

    // RIGHT PANEL: Solar City Playfield Bonus Ladder & Double Bonus Relay (x: 478..832)
    ctx.fillStyle = p.dark ? '#141923' : '#1b2230';
    drawRoundedRect(ctx, 478, 32, 354, 352, 12);
    ctx.fill();
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SOLAR CITY BONUS LADDER', 655, 58);

    // 15 Drop-Target Bonus Lamps in 3×5 grid
    for (let i = 1; i <= 15; i++) {
      const col = (i - 1) % 5;
      const row = Math.floor((i - 1) / 5);
      const lx = 528 + col * 63;
      const ly = 104 + row * 54;
      drawLamp(ctx, lx, ly, 17, i <= state.step, `${i}K`);
    }

    // Double Bonus Relay Banner
    ctx.fillStyle = state.doubleBonus ? 'rgba(227, 75, 45, 0.25)' : 'rgba(255,255,255,0.06)';
    ctx.strokeStyle = state.doubleBonus ? '#ff7654' : '#536073';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 506, 260, 298, 46, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = state.doubleBonus ? '#ffd466' : '#9aa8ba';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.fillText(
      state.doubleBonus ? '★ LAST BALL: DOUBLE BONUS ACTIVE (2×) ★' : 'REGULAR BALL: 1× BONUS PER TARGET',
      655,
      284
    );

    // Awarded Score Tally window
    ctx.fillStyle = '#0e1118';
    drawRoundedRect(ctx, 506, 318, 298, 48, 6);
    ctx.fill();
    ctx.fillStyle = '#ffd466';
    ctx.font = '700 18px "IBM Plex Mono", monospace';
    ctx.fillText(`BONUS SCORE: ${state.awarded.toLocaleString()}`, 655, 344);
  }

  syncTelemetry();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 415,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 10: PLUMB-BOB TILT PENDULUM & COIN-DOOR SLAM SWITCH
   ========================================================================== */
function initDiagram10() {
  const figure = document.getElementById('fig-tilt');
  const canvas = document.getElementById('d10-canvas');
  if (!figure || !canvas) return;

  const btnSoft = document.getElementById('d10-nudge-soft');
  const btnHard = document.getElementById('d10-nudge-hard');
  const btnSlam = document.getElementById('d10-slam');
  const btnReset = document.getElementById('d10-reset');
  const sensSlider = document.getElementById('d10-sens');
  const sensVal = document.getElementById('d10-sens-val');

  const dotStatus = document.getElementById('d10-dot-status');
  const statusOut = document.getElementById('d10-status');
  const gapOut = document.getElementById('d10-gap');
  const angleOut = document.getElementById('d10-angle');
  const dotAngle = document.getElementById('d10-dot-angle');

  const state = {
    theta: 0,          // radians
    omega: 0,
    sensitivity: 0.52, // 0.15..0.90 (higher = bob raised closer to ring!)
    tilted: false,
    slammed: false,
    slamOpenAnim: 0,
    cabinetShake: 0,
    sparkAnim: 0,
    phase: 0,
  };

  function getMaxSafeAngle() {
    // At low sensitivity (0.15), ~17° clearance; at high sensitivity (0.90), ~4.5°!
    return ((19.5 - state.sensitivity * 16.5) * Math.PI) / 180;
  }

  function syncUI() {
    const gapMm = (19.5 - state.sensitivity * 16.5) * 0.9;
    gapOut.textContent = `${gapMm.toFixed(1)} mm`;
    sensVal.textContent =
      state.sensitivity > 0.72 ? 'Hair-Trigger (Tight)' : state.sensitivity < 0.35 ? 'Loose (Forgiving)' : 'Medium (Arcade Std)';

    if (state.slammed) {
      statusOut.textContent = 'GAME OVER — Coin-Door Slam Switch Opened!';
      dotStatus.className = 'telemetry-dot is-active';
    } else if (state.tilted) {
      statusOut.textContent = 'TILT! — Flippers, Bumpers & Scoring Killed';
      dotStatus.className = 'telemetry-dot is-active';
    } else {
      statusOut.textContent = 'PLAYING — Flippers & Coils Live';
      dotStatus.className = 'telemetry-dot is-ok';
    }
  }

  btnSoft.addEventListener('click', () => {
    const dir = state.omega >= 0 ? 1 : -1;
    state.omega += dir * 0.52;
    state.cabinetShake = dir * 6;
    audio.solenoidClack(145, 0.22);
    runner.wake();
  });

  btnHard.addEventListener('click', () => {
    const dir = state.omega >= 0 ? 1 : -1;
    state.omega += dir * 1.45;
    state.cabinetShake = dir * 16;
    audio.solenoidClack(115, 0.38);
    runner.wake();
  });

  btnSlam.addEventListener('click', () => {
    state.slammed = true;
    state.slamOpenAnim = 1;
    state.cabinetShake = 18;
    audio.tiltClang();
    syncUI();
    runner.wake();
  });

  btnReset.addEventListener('click', () => {
    state.tilted = false;
    state.slammed = false;
    state.theta = 0;
    state.omega = 0;
    state.slamOpenAnim = 0;
    audio.relayClick(0.26);
    syncUI();
    runner.wake();
  });

  sensSlider.addEventListener('input', () => {
    state.sensitivity = Number(sensSlider.value) / 100;
    syncUI();
    runner.renderOnce();
  });

  function update(dt) {
    state.phase += dt * 2.5;
    const gOverL = 22.0;
    const damping = 1.65;
    const alpha = -gOverL * Math.sin(state.theta) - damping * state.omega;
    state.omega += alpha * dt;
    state.theta += state.omega * dt;

    const maxAng = getMaxSafeAngle();
    if (Math.abs(state.theta) >= maxAng) {
      state.theta = Math.sign(state.theta) * maxAng;
      state.omega = -state.omega * 0.45;
      if (!state.tilted && !state.slammed) {
        state.tilted = true;
        state.sparkAnim = 1;
        audio.tiltClang();
        syncUI();
      }
    }

    state.cabinetShake *= Math.max(0, 1 - dt * 12);
    if (state.sparkAnim > 0) state.sparkAnim = Math.max(0, state.sparkAnim - dt * 2.8);
    if (state.slamOpenAnim > 0) state.slamOpenAnim = Math.max(0, state.slamOpenAnim - dt * 1.4);

    const deg = Math.abs((state.theta * 180) / Math.PI);
    angleOut.textContent = `${deg.toFixed(1)}°`;
    dotAngle.className = deg > (maxAng * 180) / Math.PI * 0.8 ? 'telemetry-dot is-active' : 'telemetry-dot';

    return (
      Math.abs(state.theta) > 0.002 ||
      Math.abs(state.omega) > 0.002 ||
      Math.abs(state.cabinetShake) > 0.1 ||
      state.sparkAnim > 0 ||
      state.slamOpenAnim > 0
    );
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const shake = state.cabinetShake;

    // LEFT HALF: Plumb-Bob Tilt Pendulum Assembly (center x = 235)
    const cx = 235 + shake;
    const topY = 58;
    const ringY = 236;

    ctx.fillStyle = p.ink;
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('1. PLUMB-BOB TILT (NORMALLY OPEN)', 28, 34);

    // Cabinet wall bracket
    ctx.fillStyle = '#4f5d70';
    ctx.fillRect(cx - 88, topY - 8, 176, 12);
    ctx.fillRect(cx - 88, topY, 12, 232);

    // Conductive brass Tilt Ring mounted at ringY
    const ringRadius = 46;
    ctx.strokeStyle = state.tilted ? '#e34b2d' : '#c6922c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 76, ringY);
    ctx.lineTo(cx - ringRadius, ringY);
    ctx.stroke();

    // Ring front/back ellipse
    ctx.strokeStyle = state.tilted ? '#e34b2d' : '#d4a33b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, ringY, ringRadius, 12, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Swinging Pendulum Rod & Conical Brass Bob
    const rodLen = 228;
    const bobDistFromTop = 216 - state.sensitivity * 56; // Raised bob puts wider base inside ring!

    ctx.save();
    ctx.translate(cx, topY + 4);
    ctx.rotate(state.theta);

    // Threaded steel rod
    ctx.strokeStyle = '#9aa8ba';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, rodLen);
    ctx.stroke();

    // Conical brass plumb-bob (wider at bottom, narrower at top!)
    const bobH = 66;
    const bobTopY = bobDistFromTop - bobH;
    const bobGrad = ctx.createLinearGradient(-26, bobTopY, 26, bobTopY);
    bobGrad.addColorStop(0, '#8f6415');
    bobGrad.addColorStop(0.45, '#f2ca62');
    bobGrad.addColorStop(1, '#7a520c');
    ctx.fillStyle = bobGrad;
    ctx.strokeStyle = '#4f3305';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-10, bobTopY);
    ctx.lineTo(10, bobTopY);
    ctx.lineTo(29, bobTopY + bobH);
    ctx.lineTo(-29, bobTopY + bobH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Thumbscrew below bob
    ctx.fillStyle = '#cfd8e3';
    ctx.fillRect(-10, bobTopY + bobH, 20, 7);
    ctx.restore();

    // Spark flash at ring contact on tilt!
    if (state.sparkAnim > 0.05) {
      const sx = cx + Math.sign(state.theta || 1) * (ringRadius - 4);
      ctx.save();
      ctx.fillStyle = `rgba(255, 224, 90, ${state.sparkAnim})`;
      ctx.beginPath();
      ctx.arc(sx, ringY, 18 * state.sparkAnim, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Tilt wire to Tilt Relay
    drawWire(ctx, [[cx + ringRadius, ringY], [420, ringY], [420, 146], [472, 146]], {
      color: state.tilted ? '#e34b2d' : p.wireNeutral,
      energized: state.tilted,
      phase: state.phase,
      glow: true,
    });

    // RIGHT TOP: Backglass TILT / PLAYING Indicator & Tilt Relay
    ctx.fillStyle = p.dark ? '#141923' : '#1b2230';
    drawRoundedRect(ctx, 472, 62, 356, 136, 10);
    ctx.fill();
    ctx.strokeStyle = state.tilted || state.slammed ? '#e34b2d' : '#28a673';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.fillStyle = '#9aa8ba';
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BACKGLASS STATUS & TILT RELAY', 650, 88);

    ctx.font = '700 28px "IBM Plex Mono", monospace';
    ctx.fillStyle = state.slammed ? '#ff573d' : state.tilted ? '#ff573d' : '#52c493';
    ctx.fillText(state.slammed ? 'GAME OVER' : state.tilted ? 'T I L T' : 'BALL IN PLAY', 650, 136);

    ctx.font = '500 11px "IBM Plex Sans", sans-serif';
    ctx.fillStyle = '#dfe6f0';
    ctx.fillText(
      state.slammed
        ? 'Slam switch broke 24V Hold Relay — all credits/ball halted'
        : state.tilted
          ? 'Tilt Relay latched — Flippers & score coils dead until drain'
          : 'Tilt Relay open — 4 flippers & 2 pop bumpers live',
      650,
      172
    );

    // RIGHT BOTTOM: Coin-Door Slam Switch (Normally Closed weighted leaf!)
    ctx.fillStyle = p.ink;
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('2. COIN-DOOR SLAM SWITCH (NORMALLY CLOSED)', 472, 232);

    ctx.fillStyle = p.dark ? '#1e2430' : '#ebe4d6';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, 472, 246, 356, 114, 10);
    ctx.fill();
    ctx.stroke();

    // Weighted spring leaf blade (closed at rest; bounces OPEN on kick!)
    const bouncePx = Math.sin(state.slamOpenAnim * Math.PI * 3) * state.slamOpenAnim * 22;
    const isSlamOpen = Math.abs(bouncePx) > 4;

    drawWire(ctx, [[492, 304], [562, 304]], {
      color: state.slammed ? p.wireNeutral : '#28a673',
      energized: !state.slammed && !isSlamOpen,
      phase: state.phase,
    });
    drawWire(ctx, [[708, 304], [806, 304]], {
      color: state.slammed ? p.wireNeutral : '#28a673',
      energized: !state.slammed && !isSlamOpen,
      phase: state.phase,
    });

    // Stationary lower blade
    ctx.strokeStyle = '#c6922c';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(562, 304);
    ctx.lineTo(682, 304);
    ctx.stroke();

    // Weighted upper blade bouncing open!
    ctx.strokeStyle = isSlamOpen || state.slammed ? '#e34b2d' : '#28a673';
    ctx.beginPath();
    ctx.moveTo(708, 294);
    ctx.lineTo(590, 296 - Math.abs(bouncePx));
    ctx.stroke();
    // Brass inertia weight cylinder on tip of leaf
    ctx.fillStyle = '#d4a33b';
    ctx.strokeStyle = '#6c4912';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(588, 286 - Math.abs(bouncePx), 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.inkMuted;
    ctx.font = '600 10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      state.slammed ? 'HOLD RELAY DROPPED — PRESS RESET' : 'CLOSED AT REST · INERTIA WEIGHT BOUNCES OPEN ON KICK',
      650,
      344
    );
  }

  syncUI();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 390,
    update,
    draw,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDiagram6();
  initDiagram7();
  initDiagram8();
  initDiagram9();
  initDiagram10();
});
