import {
  audio,
  createDiagramRunner,
  drawBlueprintGrid,
  drawCoil,
  drawLamp,
  drawRoundedRect,
  drawSteelBall,
  drawWire,
  getCanvasPalette,
  getCanvasPoint,
  syncSlider,
} from './core.js';

/* ==========================================================================
   DIAGRAM 1: SOLAR CITY (1977) PLAYFIELD & CABINET CUTAWAY EXPLORER
   ========================================================================== */
function initDiagram1() {
  const figure = document.getElementById('fig-anatomy');
  const canvas = document.getElementById('d1-canvas');
  if (!figure || !canvas) return;

  const btnPlayfield = document.getElementById('d1-view-playfield');
  const btnCabinet = document.getElementById('d1-view-cabinet');
  const btnShot = document.getElementById('d1-demo-shot');
  const btnReset = document.getElementById('d1-reset-targets');
  const infoTitle = document.getElementById('d1-info-title');
  const infoDesc = document.getElementById('d1-info-desc');

  const PLAYFIELD_HOTSPOTS = [
    {
      id: 'top-lanes',
      x: 370, y: 74, r: 44,
      title: 'Top Arch & 5,000-Point Rollover Lanes',
      desc: 'Guided off the shooter arch, balls drop through upper wire rollover lanes. Clearing targets lights the coveted 5,000-point lane—a cornerstone of Solar City high-score strategy.',
    },
    {
      id: 'bank-10',
      x: 330, y: 158, r: 58,
      title: '10-Target Upper Drop Target Bank',
      desc: 'Ed Krynski’s unmistakable signature from El Dorado and Target Alpha. Ten drop targets sweep across the upper deck—each scores a flat 300 pts and adds +1,000 to your end-of-ball bonus.',
    },
    {
      id: 'pop-bumpers',
      x: 410, y: 226, r: 42,
      title: 'Dual Gottlieb Pop Bumpers ("Thumper Bumpers")',
      desc: 'Two active pop bumpers sit mid-field, kicking the ball chaotically toward the upper flippers and drop banks while firing 100-point impulses through the score motor.',
    },
    {
      id: 'bank-5',
      x: 590, y: 235, r: 46,
      title: '5-Target Right-Side Drop Bank',
      desc: 'Five drop targets stacked along the right flank. The uppermost target is the famous long diagonal shot from the lower-left flipper—widely praised as one of classic pinball’s best skill shots.',
    },
    {
      id: 'upper-flippers',
      x: 390, y: 298, r: 46,
      title: 'Dual 2-Inch Upper Flippers',
      desc: 'Solar City adds two nimble 2-inch upper flippers mid-playfield, letting skilled players attack the 10-target bank and top lanes from razor-sharp angles.',
    },
    {
      id: 'lower-flippers',
      x: 395, y: 408, r: 52,
      title: 'Dual 3-Inch Main Lower Flippers',
      desc: 'Standard Gottlieb 3-inch flippers powered by dual-wound 24V AC coils and protected by tungsten EOS switches. Wired in tandem with the upper flippers through stacked cabinet leaf switches.',
    },
    {
      id: 'plunger',
      x: 728, y: 335, r: 42,
      title: 'Shooter Lane & Spring Plunger',
      desc: 'A mechanical coil spring launches the 1-1/16" steel ball up the right shooter lane around the curved upper arch and into the top lanes.',
    },
  ];

  const CABINET_HOTSPOTS = [
    {
      id: 'backbox',
      x: 165, y: 130, r: 76,
      title: 'Backbox: Backglass, Score Reels & Player Unit',
      desc: 'Behind Gordon Morison’s fantasy-sci-fi backglass sit two complete banks of mechanical 5-digit score reels (Player 1 & Player 2), the 00–90 Match Unit, and the Player Unit stepper.',
    },
    {
      id: 'playfield-slope',
      x: 465, y: 225, r: 65,
      title: 'Tempered Glass & 6.5° Inclined Playfield',
      desc: 'The hardwood playfield tilts downward at 6.5° toward the player. Underneath hang all 4 flipper coils, 2 pop bumper solenoids, 15 drop-target switches, reset coils, and 6.3V illumination lamps.',
    },
    {
      id: 'score-motor',
      x: 325, y: 342, r: 46,
      title: 'Gottlieb Score Motor (Bottom Cabinet Floor)',
      desc: 'The mechanical heartbeat of the game. Driven by a 24V AC gearmotor, stacked cams rotate in strict 1/3-revolution (120°) cycles to sequence multi-pulse scoring, resets, and bonus countdowns.',
    },
    {
      id: 'transformer',
      x: 210, y: 350, r: 42,
      title: 'Heavy Iron Transformer & Fuse Block',
      desc: 'Steps 120V AC wall power down to 6.3V AC for dozens of warm incandescent lamps and 24–25V AC for heavy solenoids, coils, relays, and the score motor.',
    },
    {
      id: 'bonus-relays',
      x: 458, y: 342, r: 48,
      title: 'Relay Bank & Bonus Stepper Unit',
      desc: 'Electromechanical relays act as the machine’s logic gates and memory bits, while the ratcheting Bonus Stepper counts up to 15,000 bonus points (doubled to 30,000 on the last ball!).',
    },
    {
      id: 'chime-tilt',
      x: 598, y: 332, r: 50,
      title: '3-Bar Acoustic Chime Box, Tilt Pendulum & Coin Door',
      desc: 'Three tuned aluminum bars over a wood resonance box ring out 10, 100, and 1,000-point chords. Beside them hang the plumb-bob Tilt Pendulum and the coin door’s 25¢ mech and Slam Switch.',
    },
  ];

  // Upper 10 targets + right 5 targets coordinates (in playfield top-down coordinates, landscape orientation where left=top of table? Wait: let's draw top-down VERTICAL playfield centered left-to-right or clean portrait-in-landscape!)
  // Wait: let's draw the playfield upright on the left/center (x: 170..750) cleanly framed with generous callouts!
  const upperTargets = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    return {
      x: 225 + t * 285,
      y: 162 - Math.sin(t * Math.PI) * 20,
      angle: (t - 0.5) * 0.28,
      down: false,
    };
  });
  const rightTargets = Array.from({ length: 5 }, (_, i) => ({
    x: 586 + i * 7,
    y: 185 + i * 27,
    angle: Math.PI / 2 - 0.24,
    down: false,
  }));

  const state = {
    view: 'playfield', // 'playfield' | 'cabinet'
    selectedId: 'bank-10',
    hoveredId: null,
    t: 0,
    shotActive: false,
    shotProgress: 0,
    leftFlipAnim: 0,
    upperFlipAnim: 0,
    popFlash: 0,
  };

  function selectHotspot(hs) {
    state.selectedId = hs.id;
    infoTitle.textContent = hs.title;
    infoDesc.textContent = hs.desc;
    audio.relayClick(0.2);
    runner.wake();
  }

  function setView(view) {
    state.view = view;
    btnPlayfield.setAttribute('aria-pressed', String(view === 'playfield'));
    btnCabinet.setAttribute('aria-pressed', String(view === 'cabinet'));
    btnShot.disabled = view !== 'playfield';
    const first = view === 'playfield' ? PLAYFIELD_HOTSPOTS[1] : CABINET_HOTSPOTS[2];
    selectHotspot(first);
  }

  btnPlayfield.addEventListener('click', () => setView('playfield'));
  btnCabinet.addEventListener('click', () => setView('cabinet'));

  btnShot.addEventListener('click', () => {
    if (state.view !== 'playfield') setView('playfield');
    rightTargets[0].down = false;
    state.shotActive = true;
    state.shotProgress = 0;
    state.leftFlipAnim = 1;
    audio.solenoidClack(180, 0.35);
    selectHotspot(PLAYFIELD_HOTSPOTS[3]);
    runner.wake();
  });

  btnReset.addEventListener('click', () => {
    upperTargets.forEach((tg) => { tg.down = false; });
    rightTargets.forEach((tg) => { tg.down = false; });
    state.shotActive = false;
    state.shotProgress = 0;
    audio.solenoidClack(135, 0.32);
    runner.wake();
  });

  canvas.addEventListener('click', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 480);
    const list = state.view === 'playfield' ? PLAYFIELD_HOTSPOTS : CABINET_HOTSPOTS;
    let best = null;
    let bestDist = Infinity;
    for (const hs of list) {
      const d = Math.hypot(pt.x - hs.x, pt.y - hs.y);
      if (d <= hs.r + 14 && d < bestDist) {
        best = hs;
        bestDist = d;
      }
    }
    if (best) selectHotspot(best);
  });

  canvas.addEventListener('pointermove', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 480);
    const list = state.view === 'playfield' ? PLAYFIELD_HOTSPOTS : CABINET_HOTSPOTS;
    let found = null;
    for (const hs of list) {
      if (Math.hypot(pt.x - hs.x, pt.y - hs.y) <= hs.r + 14) {
        found = hs.id;
        break;
      }
    }
    if (found !== state.hoveredId) {
      state.hoveredId = found;
      runner.renderOnce();
    }
  });

  function update(dt) {
    state.t += dt;
    let active = false;
    if (state.leftFlipAnim > 0) {
      state.leftFlipAnim = Math.max(0, state.leftFlipAnim - dt * 3.8);
      active = true;
    }
    if (state.popFlash > 0) {
      state.popFlash = Math.max(0, state.popFlash - dt * 3.2);
      active = true;
    }
    if (state.shotActive) {
      const prev = state.shotProgress;
      state.shotProgress = Math.min(1, state.shotProgress + dt * 1.15);
      if (prev < 0.72 && state.shotProgress >= 0.72) {
        rightTargets[0].down = true;
        audio.targetDrop();
      }
      if (prev < 0.9 && state.shotProgress >= 0.9) {
        state.popFlash = 1;
        audio.popThump();
      }
      if (state.shotProgress >= 1) {
        state.shotActive = false;
      }
      active = true;
    }
    // Gentle pulse on selected hotspot
    return active || true;
  }

  function drawHotspotRing(ctx, hs, isSelected, isHovered) {
    const pulse = 0.5 + 0.5 * Math.sin(state.t * 3.5);
    ctx.save();
    ctx.beginPath();
    ctx.arc(hs.x, hs.y, isSelected ? hs.r * 0.42 + pulse * 4 : 11, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? 'rgba(244, 198, 82, 0.22)' : isHovered ? 'rgba(111, 179, 242, 0.22)' : 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.lineWidth = isSelected ? 2.4 : 1.5;
    ctx.strokeStyle = isSelected ? '#ffd466' : isHovered ? '#8cc4f8' : 'rgba(255, 240, 210, 0.65)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hs.x, hs.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#ff6a4a' : '#f4c652';
    ctx.fill();
    ctx.restore();
  }

  function drawPlayfieldView(ctx, w, h) {
    const p = getCanvasPalette();
    ctx.fillStyle = p.cabinetBg;
    ctx.fillRect(0, 0, w, h);

    // Outer wooden cabinet frame (Solar City wide playfield box)
    ctx.fillStyle = '#2d231c';
    drawRoundedRect(ctx, 130, 18, 636, 444, 18);
    ctx.fill();
    ctx.strokeStyle = '#6c533c';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Solar City art-inspired playfield surface (deep cosmos blue + sunburst gold)
    const pfGrad = ctx.createLinearGradient(150, 32, 740, 448);
    pfGrad.addColorStop(0, '#192a49');
    pfGrad.addColorStop(0.45, '#263a5e');
    pfGrad.addColorStop(0.75, '#473041');
    pfGrad.addColorStop(1, '#222130');
    ctx.fillStyle = pfGrad;
    drawRoundedRect(ctx, 148, 32, 600, 416, 12);
    ctx.fill();

    // Sunburst geometric art lines inspired by Gordon Morison
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(148, 32, 600, 416, 12);
    ctx.clip();
    const sunX = 415;
    const sunY = 235;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(a) * 420, sunY + Math.sin(a) * 420);
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(244, 198, 82, 0.08)' : 'rgba(227, 75, 45, 0.06)';
      ctx.lineWidth = 14;
      ctx.stroke();
    }
    ctx.restore();

    // Shooter lane divider wall on right
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(702, 444);
    ctx.lineTo(702, 118);
    ctx.quadraticCurveTo(700, 46, 610, 42);
    ctx.lineTo(240, 42);
    ctx.quadraticCurveTo(160, 46, 158, 130);
    ctx.stroke();

    // Shooter plunger rod inside right lane
    ctx.fillStyle = '#cfd8e3';
    ctx.fillRect(721, 355, 8, 82);
    ctx.fillStyle = '#b8341d';
    drawRoundedRect(ctx, 713, 434, 24, 14, 4);
    ctx.fill();
    // Spring coils
    ctx.strokeStyle = '#9aa8ba';
    ctx.lineWidth = 2;
    for (let y = 370; y <= 426; y += 7) {
      ctx.beginPath();
      ctx.moveTo(718, y);
      ctx.lineTo(732, y + 3);
      ctx.stroke();
    }
    drawSteelBall(ctx, 725, 344, 9);

    // Top rollover lanes (5,000-pt lane center)
    const laneXs = [295, 345, 395, 445];
    laneXs.forEach((lx, idx) => {
      ctx.fillStyle = '#c94c2c';
      drawRoundedRect(ctx, lx - 4, 52, 8, 44, 4);
      ctx.fill();
      if (idx < 3) {
        const cx = lx + 25;
        drawLamp(ctx, cx, 78, 12, idx === 1, idx === 1 ? '5K' : '1K');
      }
    });

    // 10-target upper drop bank
    upperTargets.forEach((tg, i) => {
      ctx.save();
      ctx.translate(tg.x, tg.y);
      ctx.rotate(tg.angle);
      if (tg.down) {
        ctx.fillStyle = 'rgba(20, 26, 36, 0.85)';
        ctx.strokeStyle = '#68768c';
        ctx.lineWidth = 1.2;
        drawRoundedRect(ctx, -11, -5, 22, 10, 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = i % 2 === 0 ? '#f6efe0' : '#f4c652';
        ctx.strokeStyle = '#b8341d';
        ctx.lineWidth = 1.6;
        drawRoundedRect(ctx, -11, -7, 22, 14, 3);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      drawLamp(ctx, tg.x, tg.y + 18, 4.5, tg.down);
    });

    // 5-target right-side drop bank
    rightTargets.forEach((tg) => {
      ctx.save();
      ctx.translate(tg.x, tg.y);
      ctx.rotate(tg.angle);
      if (tg.down) {
        ctx.fillStyle = 'rgba(20, 26, 36, 0.85)';
        ctx.strokeStyle = '#68768c';
        ctx.lineWidth = 1.2;
        drawRoundedRect(ctx, -10, -5, 20, 10, 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = '#f6efe0';
        ctx.strokeStyle = '#e34b2d';
        ctx.lineWidth = 1.8;
        drawRoundedRect(ctx, -10, -7, 20, 14, 3);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
      drawLamp(ctx, tg.x - 19, tg.y + 3, 4.5, tg.down);
    });

    // 2 Pop Bumpers
    const bumpers = [
      { x: 378, y: 224 },
      { x: 446, y: 228 },
    ];
    bumpers.forEach((b) => {
      const lit = state.popFlash > 0.1;
      ctx.save();
      if (lit) {
        ctx.shadowColor = '#ffd466';
        ctx.shadowBlur = 18;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#f2ede4';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#9aa8ba';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(b.x, b.y, 17, 0, Math.PI * 2);
      ctx.fillStyle = lit ? '#ff7d4d' : '#c83c24';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = lit ? '#fff5be' : '#f4c652';
      ctx.fill();
      ctx.restore();
    });

    // Bonus Ladder lamps down the center
    const bonusY = [322, 344, 366];
    ['10K', '5K', '1K'].forEach((lbl, idx) => {
      drawLamp(ctx, 412, bonusY[idx], 10, idx === 2 || rightTargets[0].down, lbl);
    });

    // Helper to draw a tapered pinball flipper bat
    function drawFlipper(px, py, len, angle) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = '#f4efe6';
      ctx.strokeStyle = '#c83c24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, Math.PI / 2, -Math.PI / 2);
      ctx.lineTo(len, -4);
      ctx.arc(len, 0, 4, -Math.PI / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#5c6678';
      ctx.fill();
      ctx.restore();
    }

    // 2 Upper 2-inch Flippers
    drawFlipper(255, 290, 44, 0.34 - state.leftFlipAnim * 0.45);
    drawFlipper(525, 294, 44, Math.PI - 0.34);

    // Slingshots & inlanes flanking lower flippers
    ctx.strokeStyle = '#f4c652';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(222, 336);
    ctx.lineTo(222, 382);
    ctx.lineTo(295, 408);
    ctx.moveTo(576, 336);
    ctx.lineTo(576, 382);
    ctx.lineTo(503, 408);
    ctx.stroke();

    // 2 Lower 3-inch Flippers
    const lowerLeftAngle = 0.32 - state.leftFlipAnim * 0.62;
    drawFlipper(310, 408, 68, lowerLeftAngle);
    drawFlipper(488, 408, 68, Math.PI - 0.32);

    // Famous diagonal shot path & animated ball
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 212, 102, 0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(356, 412);
    ctx.lineTo(578, 188);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    if (state.shotActive) {
      let bx, by;
      if (state.shotProgress < 0.72) {
        const u = state.shotProgress / 0.72;
        bx = 354 + (576 - 354) * u;
        by = 410 + (188 - 410) * u;
      } else {
        const u = (state.shotProgress - 0.72) / 0.28;
        bx = 576 + (454 - 576) * u;
        by = 188 + (226 - 188) * u;
      }
      drawSteelBall(ctx, bx, by, 9);
    }

    // Crisp side annotations (left margin)
    ctx.fillStyle = '#e7dfd0';
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('SOLAR CITY', 14, 42);
    ctx.fillStyle = '#f4c652';
    ctx.fillText('1977 · #393', 14, 58);
    ctx.fillStyle = '#9aa6ba';
    ctx.font = '500 10.5px "IBM Plex Sans", sans-serif';
    ctx.fillText('4 Flippers', 14, 86);
    ctx.fillText('15 Drop Targets', 14, 104);
    ctx.fillText('2 Pop Bumpers', 14, 122);
    ctx.fillText('2 Players · EM', 14, 140);
    ctx.fillStyle = '#f4c652';
    ctx.fillText('Click glowing', 14, 424);
    ctx.fillText('nodes to inspect', 14, 440);

    // Hotspot indicators
    PLAYFIELD_HOTSPOTS.forEach((hs) => {
      drawHotspotRing(ctx, hs, state.selectedId === hs.id, state.hoveredId === hs.id);
    });
  }

  function drawCabinetView(ctx, w, h) {
    const p = getCanvasPalette();
    ctx.fillStyle = p.cabinetBg;
    ctx.fillRect(0, 0, w, h);

    // Floor shadow line
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 448);
    ctx.lineTo(800, 448);
    ctx.stroke();

    // 4 Chrome legs (2 visible in side cutaway)
    ctx.fillStyle = '#7c8b9e';
    ctx.fillRect(148, 386, 14, 62);
    ctx.fillRect(674, 386, 14, 62);

    // Backbox silhouette
    ctx.fillStyle = '#2c221b';
    ctx.strokeStyle = '#a07e5b';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 112, 34, 122, 232, 6);
    ctx.fill();
    ctx.stroke();

    // Illuminated backglass front strip
    ctx.fillStyle = '#f4c652';
    ctx.fillRect(226, 44, 8, 210);

    // Score reel stacks inside backbox
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillStyle = '#d8dde6';
        ctx.fillRect(128 + col * 20, 62 + row * 48, 15, 32);
        ctx.fillStyle = '#1d1a16';
        ctx.font = '700 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String((col + row * 3) % 10), 135 + col * 20, 82 + row * 48);
      }
    }
    // Player unit & match wheel in lower backbox
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(166, 206, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#cfd8e3';
    ctx.font = '600 9px "IBM Plex Mono", monospace';
    ctx.fillText('MATCH /', 166, 203);
    ctx.fillText('PLAYER', 166, 214);

    // Main horizontal cabinet body
    ctx.fillStyle = '#25201c';
    ctx.strokeStyle = '#a07e5b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(126, 266);
    ctx.lineTo(724, 266);
    ctx.lineTo(724, 392);
    ctx.lineTo(126, 392);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tempered playfield glass top (6.5° slope from backbox down to front rail!)
    ctx.strokeStyle = 'rgba(180, 224, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(234, 174);
    ctx.lineTo(722, 238);
    ctx.stroke();

    // Inclined wooden playfield slab (6.5° slope)
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(236, 208);
    ctx.lineTo(718, 271);
    ctx.stroke();

    // Slope angle callout
    ctx.strokeStyle = 'rgba(244, 198, 82, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(236, 271);
    ctx.lineTo(718, 271);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffd466';
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('6.5° SLOPE', 546, 232);

    // Tiny pop bumper, drop target, flipper silhouettes on playfield
    ctx.fillStyle = '#e34b2d';
    ctx.fillRect(365, 203, 24, 18);
    ctx.fillStyle = '#f6efe0';
    ctx.fillRect(452, 214, 10, 20);
    ctx.fillStyle = '#f4c652';
    ctx.fillRect(615, 244, 34, 10);
    drawSteelBall(ctx, 512, 234, 7);

    // Under-playfield coils hanging below board
    drawCoil(ctx, 355, 232, 42, 20, { windings: 5 });
    drawCoil(ctx, 608, 266, 46, 20, { windings: 5 });

    // Lower Cabinet Floor Hardware:
    // 1. Transformer
    ctx.fillStyle = '#475264';
    ctx.strokeStyle = '#9aa8ba';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 168, 326, 78, 52, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c87137';
    ctx.fillRect(184, 332, 46, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 9.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('120V→24V', 207, 355);

    // 2. Score Motor (cam stack)
    ctx.fillStyle = '#2d3748';
    ctx.strokeStyle = '#f4c652';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(325, 348, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f4c652';
    ctx.fillText('SCORE', 325, 345);
    ctx.fillText('MOTOR', 325, 357);

    // 3. Relay Bank & Bonus Stepper
    for (let i = 0; i < 4; i++) {
      drawCoil(ctx, 404 + i * 28, 336, 24, 36, { windings: 4 });
    }
    ctx.fillStyle = '#cfd8e3';
    ctx.fillText('RELAYS & BONUS STEPPER', 458, 326);

    // 4. Chime Box (3 bars)
    ctx.fillStyle = '#6b472b';
    drawRoundedRect(ctx, 548, 342, 74, 36, 4);
    ctx.fill();
    ctx.fillStyle = '#dfe7f0';
    ctx.fillRect(556, 334, 16, 7);
    ctx.fillRect(577, 334, 16, 7);
    ctx.fillRect(598, 334, 16, 7);
    ctx.fillStyle = '#f6efe0';
    ctx.fillText('CHIMES', 585, 365);

    // 5. Tilt pendulum hanging inside front left wall
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(650, 294);
    ctx.lineTo(650, 354);
    ctx.stroke();
    ctx.fillStyle = '#d4a33b';
    ctx.beginPath();
    ctx.moveTo(641, 354);
    ctx.lineTo(659, 354);
    ctx.lineTo(650, 338);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#cfd8e3';
    ctx.fillText('TILT', 650, 372);

    // Coin Door on far right
    ctx.fillStyle = '#3b4454';
    ctx.strokeStyle = '#9aa8ba';
    ctx.fillRect(722, 290, 14, 86);
    ctx.strokeRect(722, 290, 14, 86);
    ctx.fillStyle = '#e34b2d';
    ctx.fillRect(726, 304, 8, 16);
    ctx.fillStyle = '#f4c652';
    ctx.textAlign = 'start';
    ctx.font = '700 10px "IBM Plex Mono", monospace';
    ctx.fillText('25¢ COIN DOOR', 744, 316);
    ctx.fillText('& PLUNGER', 744, 332);

    // Wire harness linking zones
    drawWire(ctx, [[180, 266], [180, 326]], { color: '#e34b2d', width: 2.5 });
    drawWire(ctx, [[246, 352], [295, 352]], { color: '#e34b2d', width: 2.5 });
    drawWire(ctx, [[355, 352], [404, 352]], { color: '#2f82cf', width: 2.5 });
    drawWire(ctx, [[516, 354], [548, 354]], { color: '#f4c652', width: 2.5 });

    // Hotspots
    CABINET_HOTSPOTS.forEach((hs) => {
      drawHotspotRing(ctx, hs, state.selectedId === hs.id, state.hoveredId === hs.id);
    });
  }

  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 480,
    update,
    draw(ctx, w, h) {
      if (state.view === 'playfield') drawPlayfieldView(ctx, w, h);
      else drawCabinetView(ctx, w, h);
    },
  });
}

/* ==========================================================================
   DIAGRAM 2: PLUNGER SPRING ENERGY & 6.5° PLAYFIELD SLOPE
   ========================================================================== */
function initDiagram2() {
  const figure = document.getElementById('fig-plunger');
  const canvas = document.getElementById('d2-canvas');
  if (!figure || !canvas) return;

  const pullSlider = document.getElementById('d2-pull');
  const pitchSlider = document.getElementById('d2-pitch');
  const pullVal = document.getElementById('d2-pull-val');
  const pitchVal = document.getElementById('d2-pitch-val');
  const btnLaunch = document.getElementById('d2-launch');
  const btnReset = document.getElementById('d2-reset');
  const energyOut = document.getElementById('d2-energy');
  const gravOut = document.getElementById('d2-grav');
  const resultOut = document.getElementById('d2-result');

  // Normalized track s in [0, 1] along shooter lane up to top lanes
  const state = {
    pull: 0.62,      // 0..1 compression
    pitchDeg: 6.5,
    ballS: 0.0,      // position along track (0 = resting on plunger tip, 1.0 = far over-shoot)
    ballV: 0,
    phase: 'ready',  // 'ready' | 'moving' | 'settled'
    dragging: false,
    sweetSpotHit: null,
  };

  function updateReadouts() {
    const k = 2.0; // effective spring constant (scaled to J)
    const energy = 0.5 * k * state.pull * state.pull;
    const gSin = 9.81 * Math.sin((state.pitchDeg * Math.PI) / 180);
    pullVal.textContent = `${Math.round(state.pull * 100)}%`;
    pitchVal.textContent = `${state.pitchDeg.toFixed(1)}°`;
    energyOut.textContent = `${energy.toFixed(2)} J`;
    gravOut.textContent = `${gSin.toFixed(2)} m/s²`;
  }

  function reloadBall() {
    state.phase = 'ready';
    state.ballS = 0;
    state.ballV = 0;
    state.sweetSpotHit = null;
    resultOut.textContent = 'Ready in shooter lane — aim for the 5,000-pt sweet spot!';
    runner.renderOnce();
  }

  function launchBall() {
    state.phase = 'moving';
    state.ballS = 0;
    // Launch velocity proportional to pull (sqrt(2E/m))
    state.ballV = 0.45 + state.pull * 1.48;
    state.sweetSpotHit = null;
    resultOut.textContent = 'Ball accelerating up the shooter lane...';
    audio.solenoidClack(210, 0.3);
    runner.wake();
  }

  pullSlider.addEventListener('input', () => {
    state.pull = Number(pullSlider.value) / 100;
    if (state.phase !== 'moving') reloadBall();
    updateReadouts();
    runner.renderOnce();
  });

  pitchSlider.addEventListener('input', () => {
    state.pitchDeg = Number(pitchSlider.value);
    updateReadouts();
    runner.renderOnce();
  });

  btnLaunch.addEventListener('click', launchBall);
  btnReset.addEventListener('click', reloadBall);

  // Direct pointer drag on plunger handle
  canvas.addEventListener('pointerdown', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 350);
    if (pt.x > 40 && pt.x < 290 && pt.y > 180) {
      state.dragging = true;
      canvas.setPointerCapture(e.pointerId);
      reloadBall();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!state.dragging) return;
    const pt = getCanvasPoint(canvas, e, 860, 350);
    const pull = Math.min(1, Math.max(0.15, (195 - pt.x) / 115));
    state.pull = pull;
    pullSlider.value = String(Math.round(pull * 100));
    syncSlider(pullSlider);
    updateReadouts();
    runner.renderOnce();
  });

  function finishDrag() {
    if (!state.dragging) return;
    state.dragging = false;
    launchBall();
  }
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);

  function update(dt) {
    if (state.phase !== 'moving') return false;
    const gSin = 9.81 * Math.sin((state.pitchDeg * Math.PI) / 180);
    const decel = gSin * 0.78 + 0.12; // gravity along incline + mild rolling drag
    state.ballV -= decel * dt;
    state.ballS += state.ballV * dt;

    if (state.ballS >= 0.98) {
      state.ballS = 0.98;
      state.phase = 'settled';
      state.sweetSpotHit = 'over';
      resultOut.textContent = 'Full plunge! Ball rebounds off top arch into the pop bumpers.';
      audio.popThump();
      return false;
    }

    if (state.ballV <= 0) {
      if (state.ballS >= 0.66 && state.ballS <= 0.86) {
        state.phase = 'settled';
        state.sweetSpotHit = 'sweet';
        resultOut.textContent = 'Skill shot! Ball drops cleanly into the 5,000-pt top lane!';
        audio.chime(2);
        return false;
      }
      if (state.ballS < 0.66 && state.ballS <= 0.01) {
        state.ballS = 0;
        state.ballV = 0;
        state.phase = 'settled';
        state.sweetSpotHit = 'short';
        resultOut.textContent = 'Short plunge — gravity pulled the ball back down to the plunger.';
        audio.relayClick(0.22);
        return false;
      }
      if (state.ballS > 0.86) {
        state.phase = 'settled';
        state.sweetSpotHit = 'over';
        resultOut.textContent = 'Past the 5,000-pt lane — ball enters upper-left 1,000-pt lane.';
        audio.chime(1);
        return false;
      }
    }
    return true;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const rad = (state.pitchDeg * Math.PI) / 180;
    const baseX = 215;
    const baseY = 266;
    const laneLen = 545;

    // Horizontal reference line for pitch angle
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = p.wireNeutral;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY + 14);
    ctx.lineTo(baseX + laneLen, baseY + 14);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle arc indicator
    ctx.strokeStyle = p.crimson;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(baseX, baseY + 14, 95, -rad, 0);
    ctx.stroke();
    ctx.fillStyle = p.crimson;
    ctx.font = '700 12px "IBM Plex Mono", monospace';
    ctx.fillText(`θ = ${state.pitchDeg.toFixed(1)}°`, baseX + 104, baseY + 10);

    // Rotated inclined shooter lane coordinate system
    ctx.translate(baseX, baseY);
    ctx.rotate(-rad);

    // Wooden playfield deck
    ctx.fillStyle = '#c49a6c';
    ctx.strokeStyle = '#6c4928';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, -18, 12, laneLen + 36, 18, 4);
    ctx.fill();
    ctx.stroke();

    // Skill shot target zone (5,000-pt rollover lane window: s in [0.66, 0.86])
    const sweetStart = laneLen * 0.66;
    const sweetW = laneLen * 0.20;
    ctx.fillStyle = state.sweetSpotHit === 'sweet' ? 'rgba(40, 166, 115, 0.34)' : 'rgba(244, 198, 82, 0.24)';
    ctx.strokeStyle = state.sweetSpotHit === 'sweet' ? '#196244' : '#b87a14';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, sweetStart, -38, sweetW, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('5,000-PT LANE', sweetStart + sweetW / 2, -20);
    ctx.font = '500 10px "IBM Plex Sans", sans-serif';
    ctx.fillStyle = p.inkMuted;
    ctx.fillText('(Skill Shot Apex)', sweetStart + sweetW / 2, -6);

    // Upper rebound arch wall
    ctx.strokeStyle = '#b8341d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(laneLen - 4, -8, 22, -Math.PI * 0.5, Math.PI * 0.45);
    ctx.stroke();

    // Plunger housing bracket at front cabinet wall (x = -18)
    ctx.fillStyle = '#4c5769';
    ctx.fillRect(-30, -18, 14, 48);

    // Plunger shaft + barrel compression spring
    const pullPx = state.phase === 'ready' ? state.pull * 95 : 0;
    const tipX = -10 - pullPx;
    const handleX = tipX - 108;

    // Compression barrel spring between bracket (-30) and washer behind tip (tipX - 8)
    const springLeft = handleX + 26;
    const springRight = -30;
    const coils = 10;
    ctx.strokeStyle = p.cobalt;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= coils; i++) {
      const sx = springLeft + ((springRight - springLeft) * i) / coils;
      const sy = i === 0 || i === coils ? -1 : i % 2 === 0 ? -11 : 9;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Steel shooter rod
    ctx.fillStyle = '#cfd8e3';
    ctx.strokeStyle = '#536073';
    ctx.lineWidth = 1.4;
    ctx.fillRect(handleX, -4.5, tipX - handleX, 9);
    ctx.strokeRect(handleX, -4.5, tipX - handleX, 9);

    // Rubber shooter tip
    ctx.fillStyle = '#242933';
    drawRoundedRect(ctx, tipX - 2, -9, 12, 18, 3);
    ctx.fill();

    // Knurled knob handle (draggable!)
    ctx.fillStyle = '#b8341d';
    ctx.strokeStyle = '#6e190b';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, handleX - 20, -15, 22, 30, 8);
    ctx.fill();
    ctx.stroke();

    // Steel pinball along shooter lane
    const ballX = state.phase === 'ready' ? tipX + 22 : 12 + state.ballS * (laneLen - 28);
    drawSteelBall(ctx, ballX, -1, 12);

    // Force vector arrow (gravity component down the slope)
    if (state.ballS > 0.08) {
      ctx.strokeStyle = '#e34b2d';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(ballX, -22);
      ctx.lineTo(ballX - 34, -22);
      ctx.lineTo(ballX - 26, -27);
      ctx.moveTo(ballX - 34, -22);
      ctx.lineTo(ballX - 26, -17);
      ctx.stroke();
      ctx.fillStyle = '#e34b2d';
      ctx.font = '700 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('g·sinθ', ballX - 18, -32);
    }

    ctx.restore();

    // Energy quadratic mini-bar at top-left
    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('HOOKE’S LAW: E = ½ k x²', 24, 34);
    ctx.fillStyle = p.dark ? '#232a36' : '#e6dfd0';
    drawRoundedRect(ctx, 24, 44, 190, 14, 7);
    ctx.fill();
    const eFrac = state.pull * state.pull;
    ctx.fillStyle = '#b8341d';
    drawRoundedRect(ctx, 24, 44, Math.max(8, 190 * eFrac), 14, 7);
    ctx.fill();
    ctx.fillStyle = p.inkMuted;
    ctx.font = '500 10.5px "IBM Plex Sans", sans-serif';
    ctx.fillText('Pull handle left & release, or click Release Plunger', 24, 78);
  }

  updateReadouts();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 350,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 3: DUAL-WOUND FLIPPER SOLENOID & EOS SWITCH
   ========================================================================== */
function initDiagram3() {
  const figure = document.getElementById('fig-flipper');
  const canvas = document.getElementById('d3-canvas');
  if (!figure || !canvas) return;

  const holdBtn = document.getElementById('d3-hold-btn');
  const latchBtn = document.getElementById('d3-latch-btn');
  const faultBtn = document.getElementById('d3-fault-btn');
  const speedSlider = document.getElementById('d3-speed');
  const speedVal = document.getElementById('d3-speed-val');

  const dotEos = document.getElementById('d3-dot-eos');
  const dotCurr = document.getElementById('d3-dot-curr');
  const dotTemp = document.getElementById('d3-dot-temp');
  const stateEos = document.getElementById('d3-state-eos');
  const stateCurr = document.getElementById('d3-state-curr');
  const stateTemp = document.getElementById('d3-state-temp');

  const SPEED_MAP = [
    { factor: 0.1, label: 'Ultra Slow (0.1×)' },
    { factor: 0.25, label: 'Slow-Mo (0.25×)' },
    { factor: 0.6, label: 'Half Speed (0.6×)' },
    { factor: 1.0, label: 'Real-Time (1×)' },
  ];

  const state = {
    buttonDown: false,
    latched: false,
    weldedFault: false,
    stroke: 0,      // 0 = rest, 1 = fully raised
    eosOpen: false,
    currentA: 0,
    tempC: 28,
    phase: 0,
    speedIdx: 1,
    wasActive: false,
  };

  function isPressed() {
    return state.buttonDown || state.latched;
  }

  function pressDown() {
    if (!state.buttonDown) {
      state.buttonDown = true;
      audio.solenoidClack(170, 0.35);
      runner.wake();
    }
  }

  function pressUp() {
    if (state.buttonDown) {
      state.buttonDown = false;
      if (!state.latched) audio.relayClick(0.2);
      runner.wake();
    }
  }

  holdBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pressDown();
  });
  window.addEventListener('pointerup', pressUp);
  holdBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      pressDown();
    }
  });
  holdBtn.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      pressUp();
    }
  });

  latchBtn.addEventListener('click', () => {
    state.latched = !state.latched;
    latchBtn.setAttribute('aria-pressed', String(state.latched));
    if (state.latched) audio.solenoidClack(170, 0.35);
    else audio.relayClick(0.2);
    runner.wake();
  });

  faultBtn.addEventListener('click', () => {
    state.weldedFault = !state.weldedFault;
    faultBtn.setAttribute('aria-pressed', String(state.weldedFault));
    audio.relayClick(0.25);
    runner.wake();
  });

  speedSlider.addEventListener('input', () => {
    state.speedIdx = Number(speedSlider.value) - 1;
    speedVal.textContent = SPEED_MAP[state.speedIdx].label;
  });

  function update(dt) {
    const sp = SPEED_MAP[state.speedIdx].factor;
    const pressed = isPressed();
    state.phase += dt * (pressed ? 2.4 : 0);

    if (pressed) {
      const targetSpeed = 8.5 * sp;
      state.stroke = Math.min(1, state.stroke + dt * targetSpeed);
    } else {
      const returnSpeed = 6.5 * sp;
      state.stroke = Math.max(0, state.stroke - dt * returnSpeed);
    }

    const prevEos = state.eosOpen;
    state.eosOpen = !state.weldedFault && state.stroke >= 0.86;
    if (!prevEos && state.eosOpen && pressed) {
      audio.relayClick(0.18);
    }

    if (!pressed) {
      state.currentA = 0;
    } else if (!state.eosOpen) {
      state.currentA = 9.6; // Heavy power winding surge!
    } else {
      state.currentA = 0.85; // Safe hold winding in series!
    }

    // Coil thermal model
    if (state.currentA > 5) {
      state.tempC = Math.min(165, state.tempC + dt * (state.weldedFault ? 34 : 18));
    } else if (state.currentA > 0.2) {
      state.tempC += (38 - state.tempC) * dt * 1.4;
    } else {
      state.tempC += (28 - state.tempC) * dt * 1.6;
    }

    // Update live telemetry
    if (state.weldedFault) {
      stateEos.textContent = 'WELDED SHUT! (Fault)';
      dotEos.className = 'telemetry-dot is-active';
    } else if (state.eosOpen) {
      stateEos.textContent = 'OPEN (Hold Winding Active)';
      dotEos.className = 'telemetry-dot is-ok';
    } else {
      stateEos.textContent = 'CLOSED (Power Bypass)';
      dotEos.className = 'telemetry-dot is-lamp';
    }

    stateCurr.textContent = `${state.currentA.toFixed(1)} A`;
    dotCurr.className = state.currentA > 5 ? 'telemetry-dot is-active' : state.currentA > 0 ? 'telemetry-dot is-ok' : 'telemetry-dot';

    const overheat = state.tempC > 85;
    stateTemp.textContent = `${Math.round(state.tempC)}°C ${overheat ? '(OVERHEATING!)' : '(Safe)'}`;
    dotTemp.className = overheat ? 'telemetry-dot is-active' : 'telemetry-dot is-ok';

    return pressed || state.stroke > 0.001 || Math.abs(state.tempC - 28) > 0.4;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    const pressed = isPressed();
    const powerHot = pressed && !state.eosOpen;
    const holdHot = pressed && state.eosOpen;
    const heatNorm = Math.max(0, Math.min(1, (state.tempC - 45) / 100));

    // Left: 24V AC Supply & Cabinet Flipper Button
    ctx.fillStyle = p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('24V AC BUS', 24, 68);
    ctx.fillText('RETURN', 24, 344);

    // Cabinet Button Leaf Switch
    ctx.fillStyle = p.dark ? '#232934' : '#e4dccb';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, 26, 118, 108, 74, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.fillText('CABINET', 44, 138);
    ctx.fillText('BUTTON', 44, 152);

    // Red external button plunger
    const btnPush = pressed ? 10 : 0;
    ctx.fillStyle = '#c83c24';
    drawRoundedRect(ctx, 8 + btnPush, 160, 26, 20, 4);
    ctx.fill();

    // Leaf switch blades inside cabinet box
    ctx.strokeStyle = pressed ? '#e34b2d' : '#b88b32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(46, 178);
    ctx.lineTo(106, pressed ? 172 : 178);
    ctx.moveTo(106, 166);
    ctx.lineTo(124, 166);
    ctx.stroke();

    // Main wires from 24V AC -> Button -> Dual Coil
    drawWire(ctx, [[56, 78], [56, 178]], { color: p.wireHot, energized: pressed, phase: state.phase });
    drawWire(ctx, [[124, 166], [190, 166], [190, 148], [225, 148]], {
      color: powerHot ? p.wireHot : holdHot ? p.wireHold : p.wireNeutral,
      energized: pressed,
      phase: state.phase,
    });

    // Dual-Wound Solenoid Assembly (x=225..425, y=104..192)
    // Power Winding (thick copper, left 60%)
    drawCoil(ctx, 225, 104, 116, 86, {
      energized: powerHot || holdHot,
      heat: heatNorm,
      windings: 8,
      color: '#c85c2b',
    });
    // Hold Winding (fine wire, right 40%)
    drawCoil(ctx, 343, 104, 84, 86, {
      energized: holdHot,
      heat: heatNorm * 0.3,
      windings: 16,
      color: '#34689a',
    });

    // Clear above-coil labels so plunger never overlaps text
    ctx.fillStyle = p.wireHot;
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POWER (1.8Ω)', 283, 94);
    ctx.fillStyle = p.wireHold;
    ctx.fillText('HOLD (24Ω)', 385, 94);

    // Center tap wire between Power and Hold windings -> down to EOS Switch!
    drawWire(ctx, [[342, 190], [342, 274], [435, 274]], {
      color: powerHot ? p.wireHot : p.wireNeutral,
      energized: powerHot,
      phase: state.phase,
    });
    // Hold winding exit -> down to Return bus
    drawWire(ctx, [[406, 190], [406, 336], [56, 336]], {
      color: holdHot ? p.wireHold : p.wireNeutral,
      energized: holdHot,
      phase: state.phase,
    });
    // EOS switch exit -> down to Return bus
    drawWire(ctx, [[512, 274], [512, 336], [406, 336]], {
      color: powerHot ? p.wireHot : p.wireNeutral,
      energized: powerHot,
      phase: state.phase,
    });

    // Steel Plunger inside coil moving left as it pulls in!
    const plungerShift = -state.stroke * 42;
    const plungerX = 434 + plungerShift;
    // Coil stop on left
    ctx.fillStyle = '#3f4857';
    ctx.fillRect(204, 134, 21, 26);

    // Return spring around plunger
    ctx.strokeStyle = '#7e8da3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 7; i++) {
      const sx = 427 + (i * (plungerX + 44 - 427)) / 7;
      const sy = 147 + (i % 2 === 0 ? -12 : 12);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Steel plunger bar + fiber link
    ctx.fillStyle = '#cfd8e3';
    ctx.strokeStyle = '#536073';
    ctx.lineWidth = 1.6;
    drawRoundedRect(ctx, plungerX - 42, 136, 94, 22, 3);
    ctx.fill();
    ctx.stroke();

    // Mechanical Crank & Flipper Bat Pivot (pivot at x=546, y=208)
    const pivX = 546;
    const pivY = 208;
    const batAngle = 0.42 - state.stroke * 0.88; // swings upward!
    const crankArmAngle = -Math.PI / 2 - state.stroke * 0.72;
    const crankTipX = pivX + Math.cos(crankArmAngle) * 60;
    const crankTipY = pivY + Math.sin(crankArmAngle) * 60;

    // Fiber linkage connecting plunger to crank tip
    ctx.strokeStyle = '#6b3a24';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(plungerX + 46, 147);
    ctx.lineTo(crankTipX, crankTipY);
    ctx.stroke();

    // Crank arm
    ctx.strokeStyle = '#7d8a9c';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(pivX, pivY);
    ctx.lineTo(crankTipX, crankTipY);
    ctx.stroke();

    // EOS Pawl actuator finger extending down-left from pivot
    const pawlAngle = Math.PI * 0.68 - state.stroke * 0.36;
    const pawlX = pivX + Math.cos(pawlAngle) * 58;
    const pawlY = pivY + Math.sin(pawlAngle) * 58;
    ctx.strokeStyle = '#4f5d70';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(pivX, pivY);
    ctx.lineTo(pawlX, pawlY);
    ctx.stroke();

    // EOS Switch Leaf Blades right at (435..512, 274)
    const eosGap = state.eosOpen ? 14 : 0;
    ctx.strokeStyle = state.weldedFault ? '#e34b2d' : '#c6922c';
    ctx.lineWidth = 3.5;
    // Lower stationary blade
    ctx.beginPath();
    ctx.moveTo(435, 274);
    ctx.lineTo(486, 274);
    ctx.stroke();
    // Upper movable blade pushed up by pawl
    ctx.beginPath();
    ctx.moveTo(512, 274);
    ctx.lineTo(476, 274 - eosGap);
    ctx.stroke();

    // Tungsten contact dots
    ctx.fillStyle = state.weldedFault ? '#ff4422' : '#eef4fa';
    ctx.beginPath();
    ctx.arc(478, 274, 4, 0, Math.PI * 2);
    ctx.arc(478, 274 - eosGap, 4, 0, Math.PI * 2);
    ctx.fill();

    // EOS label
    ctx.fillStyle = state.weldedFault ? '#d63e28' : p.ink;
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.weldedFault ? 'EOS WELDED!' : state.eosOpen ? 'EOS OPEN' : 'EOS CLOSED', 474, 304);

    // Flipper Bat attached to pivot
    ctx.save();
    ctx.translate(pivX, pivY);
    ctx.rotate(batAngle);
    ctx.fillStyle = '#f6f0e4';
    ctx.strokeStyle = '#c83c24';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 15, Math.PI / 2, -Math.PI / 2);
    ctx.lineTo(136, -8);
    ctx.arc(136, 0, 8, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#536073';
    ctx.fill();
    ctx.restore();

    // Right-Side Meters: Current (A) and Coil Temperature (°C)
    const meterX = 716;
    ctx.fillStyle = p.dark ? '#1f2530' : '#ebe4d6';
    ctx.strokeStyle = p.inkMuted;
    ctx.lineWidth = 1.4;
    drawRoundedRect(ctx, meterX, 42, 124, 338, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LIVE METERS', meterX + 62, 66);

    // Ammeter Bar
    ctx.fillStyle = p.inkMuted;
    ctx.fillText('CURRENT', meterX + 36, 94);
    ctx.fillStyle = p.dark ? '#11151c' : '#d8d0c0';
    drawRoundedRect(ctx, meterX + 24, 104, 24, 180, 5);
    ctx.fill();
    const currH = (state.currentA / 11) * 176;
    ctx.fillStyle = state.currentA > 5 ? '#e34b2d' : '#2f82cf';
    drawRoundedRect(ctx, meterX + 26, 282 - currH, 20, Math.max(0, currH), 4);
    ctx.fill();
    ctx.fillStyle = p.ink;
    ctx.fillText(`${state.currentA.toFixed(1)}A`, meterX + 36, 304);

    // Temp Bar
    ctx.fillStyle = p.inkMuted;
    ctx.fillText('TEMP', meterX + 88, 94);
    ctx.fillStyle = p.dark ? '#11151c' : '#d8d0c0';
    drawRoundedRect(ctx, meterX + 76, 104, 24, 180, 5);
    ctx.fill();
    const tempH = Math.min(1, Math.max(0, (state.tempC - 20) / 145)) * 176;
    ctx.fillStyle = state.tempC > 85 ? '#e34b2d' : state.tempC > 55 ? '#e59a24' : '#28a673';
    drawRoundedRect(ctx, meterX + 78, 282 - tempH, 20, Math.max(4, tempH), 4);
    ctx.fill();
    ctx.fillStyle = p.ink;
    ctx.fillText(`${Math.round(state.tempC)}°C`, meterX + 88, 304);

    // Legend banner at top
    ctx.textAlign = 'start';
    ctx.font = '600 11px "IBM Plex Sans", sans-serif';
    ctx.fillStyle = p.wireHot;
    ctx.fillText('■ Red: High-Current Power Surge (~10A)', 225, 42);
    ctx.fillStyle = p.wireHold;
    ctx.fillText('■ Blue: Safe Series Hold Current (~0.9A)', 225, 62);
  }

  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 420,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 4: POP BUMPER ("THUMPER BUMPER") 40ms CHAIN REACTION
   ========================================================================== */
function initDiagram4() {
  const figure = document.getElementById('fig-bumper');
  const canvas = document.getElementById('d4-canvas');
  if (!figure || !canvas) return;

  const btnLeft = document.getElementById('d4-send-left');
  const btnRight = document.getElementById('d4-send-right');
  const btnSlow = document.getElementById('d4-slowmo');
  const phaseText = document.getElementById('d4-phase-text');
  const swText = document.getElementById('d4-sw-text');
  const hitsOut = document.getElementById('d4-hits');
  const dotPhase = document.getElementById('d4-dot-phase');
  const dotSw = document.getElementById('d4-dot-sw');

  const state = {
    slowMo: true,
    ballX: 120,
    ballV: 0,
    ballDir: 1, // 1 = from left, -1 = from right
    active: false,
    skirtTilt: 0,
    spoonClosed: false,
    yokeDrop: 0, // 0..1 downward strike!
    coilOn: false,
    lampFlash: 0,
    hits: 0,
    phase: 'idle',
    wirePhase: 0,
  };

  function sendBall(dir) {
    state.ballDir = dir;
    state.ballX = dir === 1 ? 115 : 745;
    state.ballV = dir * 320;
    state.active = true;
    state.skirtTilt = 0;
    state.spoonClosed = false;
    state.yokeDrop = 0;
    state.coilOn = false;
    state.phase = 'approach';
    phaseText.textContent = '1. Steel ball rolling toward bumper skirt...';
    dotPhase.className = 'telemetry-dot is-lamp';
    runner.wake();
  }

  btnLeft.addEventListener('click', () => sendBall(1));
  btnRight.addEventListener('click', () => sendBall(-1));
  btnSlow.addEventListener('click', () => {
    state.slowMo = !state.slowMo;
    btnSlow.setAttribute('aria-pressed', String(state.slowMo));
    btnSlow.textContent = state.slowMo ? 'Slow Motion (0.15×)' : 'Real-Time (1×)';
  });

  canvas.addEventListener('click', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 390);
    sendBall(pt.x < 430 ? 1 : -1);
  });

  function update(dt) {
    const simDt = dt * (state.slowMo ? 0.24 : 1.0);
    state.wirePhase += dt * (state.coilOn ? 3.5 : 0);

    if (state.lampFlash > 0) {
      state.lampFlash = Math.max(0, state.lampFlash - dt * 2.2);
    }

    if (!state.active) {
      state.skirtTilt *= Math.max(0, 1 - dt * 10);
      state.yokeDrop *= Math.max(0, 1 - dt * 10);
      return state.lampFlash > 0 || Math.abs(state.skirtTilt) > 0.01 || state.yokeDrop > 0.01;
    }

    state.ballX += state.ballV * simDt;
    const dist = Math.abs(state.ballX - 430);

    if (state.phase === 'approach' && dist <= 78) {
      // Ball hits plastic skirt!
      state.phase = 'skirt';
      state.skirtTilt = state.ballDir * 1.0;
      state.spoonClosed = true;
      state.coilOn = true;
      swText.textContent = 'CLOSED (24V Active)';
      dotSw.className = 'telemetry-dot is-active';
      phaseText.textContent = '2. Skirt tilts → Spoon switch closes → 24V solenoid fires!';
      dotPhase.className = 'telemetry-dot is-active';
      audio.relayClick(0.26);
    }

    if (state.phase === 'skirt') {
      state.yokeDrop = Math.min(1, state.yokeDrop + simDt * 18);
      if (state.yokeDrop >= 0.85) {
        state.phase = 'kick';
        state.ballV = -state.ballDir * 560;
        state.lampFlash = 1;
        state.hits += 1;
        hitsOut.textContent = `${state.hits} (+${state.hits * 100} pts)`;
        phaseText.textContent = '3. Yoke yanks steel ring DOWN — ball blasted away (+100 pts)!';
        dotPhase.className = 'telemetry-dot is-ok';
        audio.popThump();
        audio.chime(1);
      }
    }

    if (state.phase === 'kick') {
      if (dist > 95) {
        state.spoonClosed = false;
        state.coilOn = false;
        state.skirtTilt *= Math.max(0, 1 - simDt * 14);
        state.yokeDrop = Math.max(0, state.yokeDrop - simDt * 9);
        swText.textContent = 'OPEN';
        dotSw.className = 'telemetry-dot';
      }
      if (state.ballX < 65 || state.ballX > 795) {
        state.active = false;
        state.phase = 'idle';
        state.coilOn = false;
        state.spoonClosed = false;
        phaseText.textContent = 'Idle — Ready for next impact (click canvas or buttons)';
        dotPhase.className = 'telemetry-dot';
      }
    }

    return true;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    ctx.fillStyle = p.cabinetBg;
    ctx.fillRect(0, 0, w, h);

    const cx = 430;
    const deckY = 186;

    // Zone labels
    ctx.fillStyle = 'rgba(255, 245, 225, 0.55)';
    ctx.font = '700 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('ABOVE PLAYFIELD (VISIBLE TO PLAYER)', 24, 30);
    ctx.fillText('BENEATH PLAYFIELD (HIDDEN SOLENOID & SPOON SWITCH)', 24, 232);

    // Playfield hardwood deck slab with cutout hole in center
    ctx.fillStyle = '#6c4d31';
    ctx.fillRect(0, deckY, cx - 34, 24);
    ctx.fillRect(cx + 34, deckY, w - (cx + 34), 24);
    ctx.strokeStyle = '#b48c60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, deckY);
    ctx.lineTo(cx - 34, deckY);
    ctx.moveTo(cx + 34, deckY);
    ctx.lineTo(w, deckY);
    ctx.stroke();

    // Tilting plastic skirt + lower actuator stem passing through playfield!
    ctx.save();
    ctx.translate(cx, deckY + 12);
    ctx.rotate(state.skirtTilt * 0.16);
    // White flared plastic skirt above playfield
    ctx.fillStyle = '#efeae0';
    ctx.strokeStyle = '#9aa8ba';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-64, -14);
    ctx.lineTo(64, -14);
    ctx.lineTo(44, -30);
    ctx.lineTo(-44, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Stem extending downward into spoon switch dish
    ctx.fillStyle = '#dcd4c5';
    ctx.fillRect(-5, -14, 10, 62);
    ctx.restore();

    // Moving metal kicker ring + vertical rods + under-playfield fiber yoke
    const dropPx = state.yokeDrop * 24;
    // Vertical steel rods linking upper kicker ring to lower fiber yoke
    ctx.strokeStyle = '#cfd8e3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 46, deckY - 38 + dropPx);
    ctx.lineTo(cx - 46, deckY + 102 + dropPx);
    ctx.moveTo(cx + 46, deckY - 38 + dropPx);
    ctx.lineTo(cx + 46, deckY + 102 + dropPx);
    ctx.stroke();

    // Steel kicker ring (above playfield, strikes down onto ball!)
    ctx.fillStyle = state.yokeDrop > 0.3 ? '#ffd466' : '#aeb9c7';
    ctx.strokeStyle = '#475366';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, cx - 58, deckY - 46 + dropPx, 116, 13, 5);
    ctx.fill();
    ctx.stroke();

    // Glowing Bumper Cap (translucent Solar City vermilion dome)
    ctx.save();
    if (state.lampFlash > 0.05) {
      const glow = ctx.createRadialGradient(cx, deckY - 76, 8, cx, deckY - 76, 95);
      glow.addColorStop(0, `rgba(255, 224, 110, ${0.75 * state.lampFlash})`);
      glow.addColorStop(1, 'rgba(255, 140, 40, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, deckY - 76, 95, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = state.lampFlash > 0.2 ? '#ff6944' : '#b8341d';
    ctx.strokeStyle = '#f4c652';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 56, deckY - 58);
    ctx.quadraticCurveTo(cx, deckY - 122, cx + 56, deckY - 58);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 6.3V Lamp bulb inside cap
    drawLamp(ctx, cx, deckY - 74, 11, state.lampFlash > 0.12, '6V');
    ctx.restore();

    // Under-playfield Spoon / Wafer Switch right below the skirt stem
    const spoonY = deckY + 62;
    const spoonPush = state.spoonClosed ? 10 : 0;
    ctx.fillStyle = '#c6922c';
    ctx.beginPath();
    ctx.arc(cx, spoonY + spoonPush * 0.5, 13, 0, Math.PI);
    ctx.fill();

    // Leaf switch blades for spoon switch (to the right of stem)
    ctx.strokeStyle = state.spoonClosed ? '#e34b2d' : '#d4a33b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 12, spoonY + spoonPush * 0.4);
    ctx.lineTo(cx + 135, spoonY + spoonPush * 0.6);
    ctx.moveTo(cx + 68, spoonY + 14);
    ctx.lineTo(cx + 135, spoonY + 14);
    ctx.stroke();

    // Heavy Vertical Pop Bumper Solenoid below playfield
    drawCoil(ctx, cx - 32, deckY + 112, 64, 58, {
      energized: state.coilOn,
      label: '24V COIL',
      windings: 7,
    });

    // Fiber yoke + steel plunger pulled downward into coil
    ctx.fillStyle = '#7b472b';
    drawRoundedRect(ctx, cx - 54, deckY + 96 + dropPx, 108, 12, 4);
    ctx.fill();
    ctx.fillStyle = '#cfd8e3';
    ctx.fillRect(cx - 11, deckY + 108 + dropPx, 22, 42);

    // Electrical schematic lines connecting Spoon Switch -> 24V Coil -> Pop Relay
    drawWire(ctx, [[cx + 135, spoonY + 4], [648, spoonY + 4], [648, deckY + 142], [cx + 32, deckY + 142]], {
      color: state.coilOn ? '#e34b2d' : '#5e6d82',
      energized: state.coilOn,
      phase: state.wirePhase,
      glow: true,
    });
    drawWire(ctx, [[cx + 135, spoonY + 14], [688, spoonY + 14], [688, 355], [160, 355], [160, deckY + 142], [cx - 32, deckY + 142]], {
      color: state.coilOn ? '#2f82cf' : '#4a5568',
      energized: state.coilOn,
      phase: state.wirePhase,
    });

    // Pop bumper relay box on right
    ctx.fillStyle = state.coilOn ? '#3f221d' : '#202633';
    ctx.strokeStyle = state.coilOn ? '#e34b2d' : '#657288';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 698, 250, 134, 68, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f6efe0';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POP RELAY', 765, 276);
    ctx.fillStyle = state.coilOn ? '#ffd466' : '#9aa8ba';
    ctx.font = '500 10.5px "IBM Plex Sans", sans-serif';
    ctx.fillText(state.coilOn ? 'Pulses +100 pts!' : 'Standing by', 765, 298);

    // Callout labels
    ctx.fillStyle = '#dfe6f0';
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('360° Tilting Skirt', cx + 72, deckY - 22);
    ctx.fillText('Steel Kicker Ring', cx + 72, deckY - 40);
    ctx.fillText('Spoon / Wafer Switch', cx + 142, spoonY - 8);
    ctx.fillText('Fiber Yoke (Pulls DOWN)', cx - 225, deckY + 106);

    // Rolling steel pinball
    if (state.active || state.ballX > 65) {
      drawSteelBall(ctx, state.ballX, deckY - 14, 14);
    }
  }

  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 390,
    update,
    draw,
  });
}

/* ==========================================================================
   DIAGRAM 5: DROP TARGET BANK & MECHANICAL RESET BAR
   ========================================================================== */
function initDiagram5() {
  const figure = document.getElementById('fig-droptargets');
  const canvas = document.getElementById('d5-canvas');
  if (!figure || !canvas) return;

  const btnShoot = document.getElementById('d5-shoot');
  const btnReset = document.getElementById('d5-reset-bank');
  const downCountOut = document.getElementById('d5-down-count');
  const scoreOut = document.getElementById('d5-score');
  const bonusOut = document.getElementById('d5-bonus');

  const targets = Array.from({ length: 5 }, (_, i) => ({
    index: i,
    state: 'up',     // 'up' | 'dropping' | 'down' | 'rising'
    dropAnim: 0,     // 0 = upright, 1 = fully dropped
    pushBack: 0,     // momentary horizontal deflection off shelf
  }));

  const state = {
    focusIndex: 0,
    resetBarAnim: 0, // 0 = rest, 1 = lifting targets
    resetting: false,
    ballAnim: null,  // { targetIdx, progress }
    score: 0,
    bonus: 0,
  };

  function updateTelemetry() {
    const downCount = targets.filter((t) => t.state === 'down' || t.state === 'dropping').length;
    downCountOut.textContent = `${downCount} / 5`;
    scoreOut.textContent = `${state.score.toLocaleString()} pts`;
    bonusOut.textContent = `+${state.bonus.toLocaleString()} pts`;
  }

  function hitTarget(idx) {
    const tg = targets[idx];
    if (!tg || tg.state !== 'up' || state.resetting) return;
    state.focusIndex = idx;
    state.ballAnim = { targetIdx: idx, progress: 0 };
    runner.wake();
  }

  function resetBank() {
    const anyDown = targets.some((t) => t.state !== 'up');
    if (!anyDown) return;
    state.resetting = true;
    state.resetBarAnim = 0;
    audio.solenoidClack(130, 0.45);
    runner.wake();
  }

  btnShoot.addEventListener('click', () => {
    const next = targets.find((t) => t.state === 'up');
    if (next) hitTarget(next.index);
    else resetBank();
  });

  btnReset.addEventListener('click', resetBank);

  figure.querySelectorAll('[data-drop-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      hitTarget(Number(btn.dataset.dropTarget));
    });
  });

  canvas.addEventListener('click', (e) => {
    const pt = getCanvasPoint(canvas, e, 860, 410);
    if (pt.x >= 45 && pt.x <= 445 && pt.y >= 70 && pt.y <= 265) {
      const idx = Math.floor((pt.x - 56) / 76);
      if (idx >= 0 && idx < 5) hitTarget(idx);
    }
  });

  function update(dt) {
    let busy = false;

    if (state.ballAnim) {
      busy = true;
      state.ballAnim.progress += dt * 4.2;
      if (state.ballAnim.progress >= 1) {
        const tg = targets[state.ballAnim.targetIdx];
        tg.state = 'dropping';
        tg.pushBack = 1;
        state.score += 300;
        state.bonus += 1000;
        updateTelemetry();
        audio.targetDrop();
        state.ballAnim = null;
      }
    }

    targets.forEach((tg) => {
      if (tg.pushBack > 0) {
        tg.pushBack = Math.max(0, tg.pushBack - dt * 6);
        busy = true;
      }
      if (tg.state === 'dropping') {
        tg.dropAnim = Math.min(1, tg.dropAnim + dt * 5.8);
        if (tg.dropAnim >= 1) tg.state = 'down';
        busy = true;
      }
    });

    if (state.resetting) {
      busy = true;
      state.resetBarAnim += dt * 3.2;
      const lift = Math.sin(Math.min(1, state.resetBarAnim) * Math.PI);
      if (state.resetBarAnim <= 0.55) {
        const upFactor = 1 - Math.min(1, state.resetBarAnim / 0.5);
        targets.forEach((tg) => {
          if (tg.state === 'down' || tg.state === 'rising') {
            tg.state = 'rising';
            tg.dropAnim = Math.min(tg.dropAnim, upFactor);
          }
        });
      } else {
        targets.forEach((tg) => {
          if (tg.state === 'rising') {
            tg.dropAnim = 0;
            tg.state = 'up';
          }
        });
      }
      if (state.resetBarAnim >= 1) {
        state.resetBarAnim = 0;
        state.resetting = false;
        state.bonus = 0;
        updateTelemetry();
        audio.relayClick(0.28);
      }
      void lift;
    }

    return busy;
  }

  function draw(ctx, w, h) {
    const p = getCanvasPalette();
    drawBlueprintGrid(ctx, w, h);

    // Divider between Front Bank View (left) and Mechanical Side Cutaway (right)
    ctx.strokeStyle = p.wireNeutral;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(465, 20);
    ctx.lineTo(465, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // LEFT HALF: 5-Target Playfield Front View
    ctx.fillStyle = p.ink;
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('PLAYFIELD VIEW: 5-TARGET BANK', 24, 34);
    ctx.fillStyle = p.inkMuted;
    ctx.font = '500 11px "IBM Plex Sans", sans-serif';
    ctx.fillText('Click any standing target to knock it below the deck (+300 pts, +1,000 bonus)', 24, 54);

    // Playfield slotted surface
    ctx.fillStyle = '#25324a';
    drawRoundedRect(ctx, 28, 178, 412, 165, 10);
    ctx.fill();
    ctx.strokeStyle = '#d4a33b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the 5 drop targets
    targets.forEach((tg, i) => {
      const tx = 62 + i * 76;
      const slotY = 204;

      // Dark slot opening in wood
      ctx.fillStyle = '#0e131c';
      drawRoundedRect(ctx, tx - 2, slotY - 4, 52, 11, 3);
      ctx.fill();

      // Standing plastic target blade emerging upward out of slot
      const visibleH = Math.max(0, (1 - tg.dropAnim) * 76);
      if (visibleH > 2) {
        ctx.fillStyle = i === state.focusIndex ? '#fff4d6' : '#f7f2e7';
        ctx.strokeStyle = '#b8341d';
        ctx.lineWidth = 2.2;
        drawRoundedRect(ctx, tx, slotY - visibleH, 48, visibleH, 4);
        ctx.fill();
        ctx.stroke();

        // Solar City sunburst target emblem
        if (visibleH > 32) {
          ctx.fillStyle = '#b8341d';
          ctx.beginPath();
          ctx.arc(tx + 24, slotY - visibleH + 24, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f4c652';
          ctx.font = '700 10px "IBM Plex Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(i + 1), tx + 24, slotY - visibleH + 28);
        }
      }

      // Status lamp underneath each target (Solar City: lights UP when target is knocked down!)
      drawLamp(ctx, tx + 24, 258, 14, tg.dropAnim > 0.75, '1K');
      ctx.fillStyle = '#cfd8e3';
      ctx.font = '600 9.5px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(tg.dropAnim > 0.75 ? 'DOWN' : 'UP', tx + 24, 294);
    });

    // Status banner on playfield
    const allDown = targets.every((t) => t.state === 'down');
    ctx.fillStyle = allDown ? '#ffd466' : '#9eb0c8';
    ctx.font = '700 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      allDown
        ? 'BANK CLEARED! STAYS DOWN UNTIL END OF BALL (SOLAR CITY RULE)'
        : 'LIGHTS TRACK KNOCKED-DOWN TARGETS FOR END-OF-BALL BONUS',
      234,
      324
    );

    // Incoming ball animation on left half
    if (state.ballAnim) {
      const tx = 86 + state.ballAnim.targetIdx * 76;
      const by = 372 - state.ballAnim.progress * 176;
      drawSteelBall(ctx, tx, by, 12);
    }

    // RIGHT HALF: Mechanical Side Cross-Section of focused target
    const focus = targets[state.focusIndex];
    const rx = 625;
    const deckY = 178;

    ctx.fillStyle = p.ink;
    ctx.font = '700 11.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText(`SIDE CUTAWAY: TARGET #${focus.index + 1}`, 490, 34);
    ctx.fillStyle = p.inkMuted;
    ctx.font = '500 11px "IBM Plex Sans", sans-serif';
    ctx.fillText('Latch shelf holds target up; spring snaps it down', 490, 54);

    // Playfield deck cross-section with slot
    ctx.fillStyle = '#a37b51';
    ctx.fillRect(490, deckY, rx - 490 - 12, 18);
    ctx.fillRect(rx + 18, deckY, 840 - (rx + 18), 18);

    // Metal chassis frame + retaining knife-edge latch shelf (left of target)
    ctx.fillStyle = '#586578';
    ctx.fillRect(rx - 32, deckY + 18, 12, 148);
    // Retaining shelf lip!
    ctx.fillStyle = '#d4a33b';
    ctx.fillRect(rx - 20, deckY + 72, 17, 7);

    // Moving Drop Target Plastic + Guitar Bracket
    const dropY = focus.dropAnim * 72;
    const pushX = focus.pushBack * 12;
    const targetTopY = deckY - 70 + dropY;

    ctx.fillStyle = '#f6efe0';
    ctx.strokeStyle = '#b8341d';
    ctx.lineWidth = 2;
    // Main plastic blade
    drawRoundedRect(ctx, rx - 3 + pushX, targetTopY, 14, 152, 3);
    ctx.fill();
    ctx.stroke();

    // Catch notch that sits ON TOP of the retaining shelf when upright!
    ctx.fillStyle = '#c83c24';
    ctx.fillRect(rx - 15 + pushX, targetTopY + 134, 13, 8);

    // Pull-down tension spring anchored to bottom of chassis!
    ctx.strokeStyle = '#2265a3';
    ctx.lineWidth = 2;
    const spTop = targetTopY + 150;
    const spBot = 368;
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const sy = spTop + ((spBot - spTop) * i) / 8;
      const sx = rx + 4 + (i === 0 || i === 8 ? 0 : i % 2 === 0 ? -7 : 7);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Behind-Bank Leaf Switch (closes when target tail drops down!)
    const swClosed = focus.dropAnim > 0.72;
    ctx.strokeStyle = swClosed ? '#28a673' : '#c6922c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rx + 62, deckY + 134);
    ctx.lineTo(rx + 28, deckY + (swClosed ? 120 : 106));
    ctx.moveTo(rx + 62, deckY + 146);
    ctx.lineTo(rx + 28, deckY + 124);
    ctx.stroke();

    // U-Shaped Reset Bar + Heavy Reset Solenoid below!
    const liftAngle = Math.sin(Math.min(1, state.resetBarAnim) * Math.PI);
    const barY = deckY + 162 - liftAngle * 78;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(rx - 52, deckY + 166);
    ctx.lineTo(rx + 24, barY);
    ctx.stroke();

    // Reset coil
    drawCoil(ctx, 496, 306, 72, 46, {
      energized: state.resetting && state.resetBarAnim < 0.55,
      label: 'RESET',
      windings: 6,
    });

    // Crisp schematic labels on right cutaway
    ctx.fillStyle = p.ink;
    ctx.font = '600 10.5px "IBM Plex Mono", monospace';
    ctx.textAlign = 'start';
    ctx.fillText('Latch Shelf', 494, deckY + 68);
    ctx.fillText(swClosed ? 'Switch CLOSED (+300 / +1K)' : 'Target Leaf Switch (Open)', rx + 68, deckY + 136);
    ctx.fillText('Pull-Down Spring', rx + 26, 366);
    ctx.fillText('U-Shaped Reset Bar', rx + 34, barY + 4);
  }

  updateTelemetry();
  const runner = createDiagramRunner(figure, canvas, {
    width: 860,
    height: 410,
    update,
    draw,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDiagram1();
  initDiagram2();
  initDiagram3();
  initDiagram4();
  initDiagram5();
});
