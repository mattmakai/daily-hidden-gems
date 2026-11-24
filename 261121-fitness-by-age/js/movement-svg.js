/**
 * Exercise by Age Explainer — Mid-Century Swiss Biomechanical Movement Phase Diagrams & Icons
 * Generates crisp, 5-color stylized athletic figure SVGs across 3 distinct phases (0, 1, 2)
 * with directional force arrows, apparatus geometry, and zero external dependencies.
 */

export function renderModalityIcon(modalityId, { size = 18 } = {}) {
  const paths = {
    strength:
      '<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    power:
      '<path d="M13 2L4.5 13.5h6.5L10 22l9.5-12H13l0-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    hiit:
      '<path d="M3 13h3.5l2.5-7 4 12 2.5-5H21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    aerobic:
      '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    balance:
      '<circle cx="12" cy="5" r="2.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h16M12 10v5l-3.5 5M12 15l3.5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    mobility:
      '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 3"/><path d="M12 7a5 5 0 1 1-4.3 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 12l-.5 3 3 .5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" class="modality-icon">${paths[modalityId] || paths.strength}</svg>`;
}

/**
 * Helper to draw a stylized mid-century athletic figure from joint coordinates.
 * Coordinates live in a 360x210 stage where ground y = 178.
 */
function figure({
  head,
  shoulder,
  hip,
  knee1,
  foot1,
  knee2,
  foot2,
  elbow1,
  hand1,
  elbow2,
  hand2,
  accentColor = 'var(--brown-red)',
  bodyColor = 'var(--dark-slate-grey)'
}) {
  const [hx, hy] = head;
  const [sx, sy] = shoulder;
  const [px, py] = hip;
  const [k1x, k1y] = knee1;
  const [f1x, f1y] = foot1;
  const [k2x, k2y] = knee2 || knee1;
  const [f2x, f2y] = foot2 || foot1;
  const [e1x, e1y] = elbow1;
  const [h1x, h1y] = hand1;
  const [e2x, e2y] = elbow2 || elbow1;
  const [h2x, h2y] = hand2 || hand1;

  return `
    <!-- Back Limb Layer -->
    <g stroke="${bodyColor}" stroke-linecap="round" stroke-linejoin="round" opacity="0.72">
      <path d="M${px} ${py} L${k2x} ${k2y} L${f2x} ${f2y}" fill="none" stroke-width="9"/>
      <path d="M${sx} ${sy} L${e2x} ${e2y} L${h2x} ${h2y}" fill="none" stroke-width="7"/>
    </g>
    <!-- Torso -->
    <line x1="${sx}" y1="${sy}" x2="${px}" y2="${py}" stroke="${accentColor}" stroke-width="15" stroke-linecap="round"/>
    <!-- Front Leg -->
    <path d="M${px} ${py} L${k1x} ${k1y} L${f1x} ${f1y}" fill="none" stroke="${bodyColor}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Front Arm -->
    <path d="M${sx} ${sy} L${e1x} ${e1y} L${h1x} ${h1y}" fill="none" stroke="${accentColor}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Head -->
    <circle cx="${hx}" cy="${hy}" r="12.5" fill="var(--fig-head)"/>
    <!-- Joint Dots -->
    <circle cx="${px}" cy="${py}" r="3.5" fill="var(--vanilla-custard)"/>
    <circle cx="${k1x}" cy="${k1y}" r="3" fill="var(--vanilla-custard)"/>
    <circle cx="${sx}" cy="${sy}" r="3" fill="var(--vanilla-custard)"/>
  `;
}

function arrow(d, color = 'var(--honey-bronze)', markerId = 'mv-arrow') {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${markerId})"/>`;
}

const SCENES = {
  squat: [
    () => `
      ${figure({
        head: [180, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [182, 146], foot1: [182, 176], knee2: [172, 146], foot2: [172, 176],
        elbow1: [198, 86], hand1: [212, 82], elbow2: [164, 88], hand2: [194, 82]
      })}
      <circle cx="212" cy="82" r="7" fill="var(--honey-bronze)"/>
      ${arrow('M146 78 L146 124')}
    `,
    () => `
      ${figure({
        head: [188, 78], shoulder: [182, 100], hip: [152, 134],
        knee1: [194, 138], foot1: [184, 176], knee2: [186, 140], foot2: [174, 176],
        elbow1: [204, 110], hand1: [216, 102], elbow2: [196, 114], hand2: [210, 102]
      })}
      <circle cx="215" cy="102" r="7.5" fill="var(--honey-bronze)"/>
      <path d="M148 134 A24 24 0 0 1 190 136" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="4 3"/>
      ${arrow('M138 96 L138 134')}
    `,
    () => `
      ${figure({
        head: [180, 42], shoulder: [180, 66], hip: [180, 112],
        knee1: [182, 145], foot1: [182, 176], knee2: [172, 145], foot2: [172, 176],
        elbow1: [198, 84], hand1: [212, 80], elbow2: [166, 86], hand2: [196, 80]
      })}
      <circle cx="212" cy="80" r="7" fill="var(--honey-bronze)"/>
      ${arrow('M146 132 L146 74', 'var(--brown-red)')}
    `
  ],

  hinge: [
    () => `
      <rect x="166" y="158" width="44" height="20" rx="5" fill="var(--night-bordeaux)" opacity="0.25"/>
      ${figure({
        head: [182, 46], shoulder: [180, 70], hip: [176, 116],
        knee1: [182, 147], foot1: [182, 176], knee2: [170, 147], foot2: [170, 176],
        elbow1: [186, 98], hand1: [190, 124], elbow2: [172, 98], hand2: [178, 124]
      })}
      <circle cx="190" cy="126" r="10" fill="var(--honey-bronze)"/>
      ${arrow('M152 114 L122 114')}
    `,
    () => `
      ${figure({
        head: [218, 84], shoulder: [198, 96], hip: [144, 116],
        knee1: [174, 144], foot1: [178, 176], knee2: [166, 144], foot2: [168, 176],
        elbow1: [196, 124], hand1: [194, 152], elbow2: [188, 124], hand2: [186, 152]
      })}
      <circle cx="192" cy="158" r="13" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="2"/>
      ${arrow('M136 112 C118 112, 118 96, 134 94')}
    `,
    () => `
      ${figure({
        head: [182, 44], shoulder: [180, 68], hip: [180, 114],
        knee1: [182, 146], foot1: [182, 176], knee2: [170, 146], foot2: [170, 176],
        elbow1: [184, 96], hand1: [186, 122], elbow2: [172, 96], hand2: [176, 122]
      })}
      <circle cx="186" cy="126" r="13" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="2"/>
      ${arrow('M148 122 L172 114', 'var(--brown-red)')}
    `
  ],

  push: [
    () => `
      <rect x="234" y="106" width="56" height="72" rx="6" fill="var(--dark-slate-grey)" opacity="0.22"/>
      <line x1="234" y1="106" x2="290" y2="106" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      ${figure({
        head: [204, 72], shoulder: [188, 88], hip: [148, 126],
        knee1: [122, 152], foot1: [100, 176], knee2: [128, 154], foot2: [108, 176],
        elbow1: [212, 100], hand1: [236, 108], elbow2: [206, 104], hand2: [232, 110]
      })}
      ${arrow('M196 66 L224 92')}
    `,
    () => `
      <rect x="234" y="106" width="56" height="72" rx="6" fill="var(--dark-slate-grey)" opacity="0.22"/>
      <line x1="234" y1="106" x2="290" y2="106" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      ${figure({
        head: [224, 92], shoulder: [208, 106], hip: [158, 138],
        knee1: [128, 158], foot1: [102, 176], knee2: [134, 160], foot2: [110, 176],
        elbow1: [206, 126], hand1: [236, 108], elbow2: [200, 128], hand2: [232, 110]
      })}
      ${arrow('M224 128 L194 98', 'var(--brown-red)')}
    `,
    () => `
      <rect x="234" y="106" width="56" height="72" rx="6" fill="var(--dark-slate-grey)" opacity="0.22"/>
      <line x1="234" y1="106" x2="290" y2="106" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      ${figure({
        head: [202, 70], shoulder: [186, 86], hip: [146, 124],
        knee1: [120, 150], foot1: [98, 176], knee2: [126, 152], foot2: [106, 176],
        elbow1: [212, 98], hand1: [236, 108], elbow2: [206, 102], hand2: [232, 110]
      })}
      <circle cx="186" cy="86" r="14" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="3 3"/>
    `
  ],

  pull: [
    () => `
      <line x1="278" y1="40" x2="278" y2="178" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      <line x1="278" y1="92" x2="210" y2="92" stroke="var(--honey-bronze)" stroke-width="3.5" stroke-dasharray="6 3"/>
      ${figure({
        head: [144, 48], shoulder: [144, 72], hip: [142, 118],
        knee1: [152, 148], foot1: [154, 176], knee2: [132, 148], foot2: [128, 176],
        elbow1: [176, 84], hand1: [210, 92], elbow2: [174, 90], hand2: [206, 94]
      })}
      ${arrow('M204 72 L162 72')}
    `,
    () => `
      <line x1="278" y1="40" x2="278" y2="178" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      <line x1="278" y1="92" x2="152" y2="92" stroke="var(--honey-bronze)" stroke-width="4"/>
      ${figure({
        head: [142, 48], shoulder: [142, 72], hip: [142, 118],
        knee1: [152, 148], foot1: [154, 176], knee2: [132, 148], foot2: [128, 176],
        elbow1: [116, 88], hand1: [152, 92], elbow2: [122, 92], hand2: [154, 94]
      })}
      <circle cx="136" cy="76" r="14" fill="none" stroke="var(--brown-red)" stroke-width="2" stroke-dasharray="3 3"/>
      ${arrow('M124 62 L106 62', 'var(--brown-red)')}
    `,
    () => `
      <line x1="278" y1="40" x2="278" y2="178" stroke="var(--dark-slate-grey)" stroke-width="4"/>
      <line x1="278" y1="92" x2="202" y2="92" stroke="var(--honey-bronze)" stroke-width="3.5" stroke-dasharray="6 3"/>
      ${figure({
        head: [144, 48], shoulder: [144, 72], hip: [142, 118],
        knee1: [152, 148], foot1: [154, 176], knee2: [132, 148], foot2: [128, 176],
        elbow1: [172, 84], hand1: [202, 92], elbow2: [170, 90], hand2: [198, 94]
      })}
      ${arrow('M164 110 L204 110')}
    `
  ],

  jump_land: [
    () => `
      <rect x="220" y="130" width="64" height="48" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="220" y1="130" x2="284" y2="130" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [132, 74], shoulder: [124, 96], hip: [104, 132],
        knee1: [134, 146], foot1: [126, 176], knee2: [126, 148], foot2: [116, 176],
        elbow1: [98, 116], hand1: [76, 126], elbow2: [104, 118], hand2: [86, 128]
      })}
      ${arrow('M140 120 Q180 42 232 94')}
    `,
    () => `
      <rect x="220" y="130" width="64" height="48" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="220" y1="130" x2="284" y2="130" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [194, 44], shoulder: [184, 66], hip: [176, 102],
        knee1: [208, 108], foot1: [194, 134], knee2: [164, 124], foot2: [148, 146],
        elbow1: [206, 56], hand1: [224, 40], elbow2: [168, 56], hand2: [184, 38]
      })}
      <path d="M126 168 Q174 70 226 112" fill="none" stroke="var(--honey-bronze)" stroke-width="2.2" stroke-dasharray="5 4"/>
    `,
    () => `
      <rect x="220" y="130" width="64" height="48" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="220" y1="130" x2="284" y2="130" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [258, 44], shoulder: [250, 66], hip: [232, 98],
        knee1: [262, 106], foot1: [252, 128], knee2: [254, 108], foot2: [242, 128],
        elbow1: [272, 78], hand1: [292, 74], elbow2: [264, 82], hand2: [284, 78]
      })}
      <circle cx="252" cy="128" r="14" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5"/>
      <circle cx="252" cy="128" r="22" fill="none" stroke="var(--honey-bronze)" stroke-width="1.3" stroke-dasharray="3 3"/>
    `
  ],

  sprint_hiit: [
    () => `
      <path d="M40 148 Q85 118 125 148 T215 148 T315 148" fill="none" stroke="var(--honey-bronze)" stroke-width="2" opacity="0.45"/>
      ${figure({
        head: [176, 52], shoulder: [168, 74], hip: [154, 118],
        knee1: [182, 144], foot1: [174, 176], knee2: [144, 148], foot2: [128, 174],
        elbow1: [190, 92], hand1: [206, 76], elbow2: [148, 96], hand2: [134, 110]
      })}
      ${arrow('M210 72 L256 72')}
    `,
    () => `
      <path d="M40 140 Q70 72 100 140 T160 140 T220 140 T280 140 T330 140" fill="none" stroke="var(--brown-red)" stroke-width="2.5" opacity="0.45"/>
      ${figure({
        head: [204, 58], shoulder: [186, 76], hip: [154, 112],
        knee1: [198, 122], foot1: [184, 152], knee2: [126, 144], foot2: [96, 168],
        elbow1: [212, 86], hand1: [228, 66], elbow2: [156, 94], hand2: [130, 100]
      })}
      ${arrow('M226 60 L282 54', 'var(--brown-red)')}
      <line x1="76" y1="86" x2="124" y2="86" stroke="var(--honey-bronze)" stroke-width="3" stroke-linecap="round"/>
      <line x1="62" y1="104" x2="112" y2="104" stroke="var(--honey-bronze)" stroke-width="2" stroke-linecap="round"/>
    `,
    () => `
      <path d="M40 148 Q105 130 170 148 T315 148" fill="none" stroke="var(--dark-slate-grey)" stroke-width="2.5" opacity="0.5"/>
      ${figure({
        head: [182, 46], shoulder: [180, 70], hip: [178, 116],
        knee1: [188, 148], foot1: [194, 176], knee2: [168, 148], foot2: [160, 176],
        elbow1: [194, 96], hand1: [204, 114], elbow2: [166, 96], hand2: [158, 114]
      })}
      <circle cx="182" cy="86" r="18" fill="none" stroke="var(--dark-slate-grey)" stroke-width="2" stroke-dasharray="4 4"/>
    `
  ],

  carry: [
    () => `
      ${figure({
        head: [188, 76], shoulder: [178, 96], hip: [148, 122],
        knee1: [176, 146], foot1: [176, 176], knee2: [166, 146], foot2: [164, 176],
        elbow1: [182, 126], hand1: [182, 152], elbow2: [172, 126], hand2: [172, 152]
      })}
      <rect x="166" y="150" width="32" height="12" rx="4" fill="var(--honey-bronze)"/>
      ${arrow('M140 124 L140 76')}
    `,
    () => `
      ${figure({
        head: [180, 44], shoulder: [178, 68], hip: [176, 114],
        knee1: [196, 146], foot1: [212, 176], knee2: [160, 146], foot2: [142, 176],
        elbow1: [184, 98], hand1: [188, 126], elbow2: [170, 98], hand2: [168, 126]
      })}
      <rect x="174" y="124" width="28" height="11" rx="4" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="1.5"/>
      <rect x="154" y="124" width="26" height="10" rx="4" fill="var(--honey-bronze)" opacity="0.7"/>
      <line x1="180" y1="22" x2="180" y2="176" stroke="var(--dark-slate-grey)" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${arrow('M216 74 L264 74', 'var(--brown-red)')}
    `,
    () => `
      ${figure({
        head: [182, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [184, 146], foot1: [186, 176], knee2: [170, 146], foot2: [168, 176],
        elbow1: [186, 98], hand1: [190, 126], elbow2: [172, 98], hand2: [170, 126]
      })}
      <circle cx="190" cy="128" r="14" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5"/>
      <rect x="176" y="124" width="28" height="10" rx="4" fill="var(--honey-bronze)"/>
    `
  ],

  swing: [
    () => `
      ${figure({
        head: [212, 82], shoulder: [192, 94], hip: [144, 116],
        knee1: [174, 144], foot1: [176, 176], knee2: [166, 144], foot2: [166, 176],
        elbow1: [176, 120], hand1: [156, 138], elbow2: [170, 120], hand2: [152, 138]
      })}
      <circle cx="148" cy="144" r="11" fill="var(--fig-head)"/>
      ${arrow('M162 146 Q216 144 242 98')}
    `,
    () => `
      ${figure({
        head: [176, 46], shoulder: [174, 70], hip: [176, 114],
        knee1: [178, 146], foot1: [178, 176], knee2: [168, 146], foot2: [168, 176],
        elbow1: [206, 78], hand1: [236, 82], elbow2: [200, 82], hand2: [230, 84]
      })}
      <circle cx="246" cy="82" r="11.5" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="2"/>
      <path d="M156 142 Q216 138 242 92" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5" stroke-dasharray="4 3"/>
      ${arrow('M136 114 L168 114', 'var(--brown-red)')}
    `,
    () => `
      ${figure({
        head: [198, 66], shoulder: [184, 82], hip: [154, 116],
        knee1: [176, 146], foot1: [176, 176], knee2: [168, 146], foot2: [168, 176],
        elbow1: [194, 106], hand1: [186, 128], elbow2: [188, 108], hand2: [180, 128]
      })}
      <circle cx="182" cy="136" r="10.5" fill="var(--honey-bronze)"/>
      ${arrow('M232 96 Q214 128 190 134')}
    `
  ],

  step_up: [
    () => `
      <rect x="200" y="138" width="76" height="40" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="200" y1="138" x2="276" y2="138" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [174, 52], shoulder: [170, 74], hip: [164, 118],
        knee1: [204, 112], foot1: [216, 136], knee2: [158, 148], foot2: [152, 176],
        elbow1: [174, 100], hand1: [178, 124], elbow2: [160, 100], hand2: [160, 124]
      })}
      <rect x="172" y="122" width="16" height="7" rx="3" fill="var(--honey-bronze)"/>
      ${arrow('M218 102 L226 56')}
    `,
    () => `
      <rect x="200" y="138" width="76" height="40" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="200" y1="138" x2="276" y2="138" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [232, 24], shoulder: [230, 46], hip: [228, 86],
        knee1: [232, 112], foot1: [232, 136], knee2: [206, 98], foot2: [198, 122],
        elbow1: [234, 72], hand1: [236, 94], elbow2: [222, 72], hand2: [220, 94]
      })}
      <rect x="230" y="92" width="16" height="7" rx="3" fill="var(--honey-bronze)"/>
      ${arrow('M192 92 L192 48', 'var(--brown-red)')}
    `,
    () => `
      <rect x="200" y="138" width="76" height="40" rx="4" fill="var(--dark-slate-grey)" opacity="0.28"/>
      <line x1="200" y1="138" x2="276" y2="138" stroke="var(--dark-slate-grey)" stroke-width="3.5"/>
      ${figure({
        head: [184, 48], shoulder: [178, 70], hip: [170, 114],
        knee1: [206, 112], foot1: [218, 136], knee2: [162, 144], foot2: [154, 174],
        elbow1: [182, 96], hand1: [186, 120], elbow2: [168, 96], hand2: [168, 120]
      })}
      ${arrow('M146 84 L146 138')}
    `
  ],

  balance_single: [
    () => `
      <line x1="94" y1="98" x2="140" y2="98" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="98" x2="100" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [186, 44], shoulder: [186, 68], hip: [184, 114],
        knee1: [186, 146], foot1: [186, 176], knee2: [176, 146], foot2: [174, 176],
        elbow1: [160, 86], hand1: [134, 96], elbow2: [208, 86], hand2: [228, 94]
      })}
      <circle cx="186" cy="176" r="18" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="4 3"/>
    `,
    () => `
      <line x1="94" y1="98" x2="140" y2="98" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="98" x2="100" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [186, 44], shoulder: [186, 68], hip: [184, 114],
        knee1: [186, 146], foot1: [186, 176], knee2: [216, 122], foot2: [204, 148],
        elbow1: [160, 86], hand1: [136, 96], elbow2: [216, 78], hand2: [242, 74]
      })}
      <circle cx="186" cy="44" r="22" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="4 3"/>
      <ellipse cx="186" cy="176" rx="28" ry="6" fill="none" stroke="var(--honey-bronze)" stroke-width="2"/>
    `,
    () => `
      <line x1="94" y1="98" x2="140" y2="98" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="98" x2="100" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [190, 44], shoulder: [186, 68], hip: [184, 114],
        knee1: [186, 146], foot1: [186, 176], knee2: [224, 134], foot2: [242, 152],
        elbow1: [158, 86], hand1: [142, 92], elbow2: [218, 72], hand2: [248, 60]
      })}
      ${arrow('M162 28 Q186 14 210 28', 'var(--brown-red)')}
      <ellipse cx="186" cy="176" rx="34" ry="7" fill="none" stroke="var(--honey-bronze)" stroke-width="2"/>
    `
  ],

  tandem_walk: [
    () => `
      <line x1="70" y1="176" x2="290" y2="176" stroke="var(--honey-bronze)" stroke-width="4" stroke-dasharray="8 4"/>
      ${figure({
        head: [152, 44], shoulder: [152, 68], hip: [150, 114],
        knee1: [160, 146], foot1: [168, 176], knee2: [146, 146], foot2: [142, 176],
        elbow1: [184, 78], hand1: [212, 82], elbow2: [120, 78], hand2: [92, 82]
      })}
      ${arrow('M186 164 L222 164')}
    `,
    () => `
      <line x1="70" y1="176" x2="290" y2="176" stroke="var(--honey-bronze)" stroke-width="4" stroke-dasharray="8 4"/>
      ${figure({
        head: [184, 44], shoulder: [184, 68], hip: [182, 114],
        knee1: [198, 144], foot1: [204, 176], knee2: [172, 146], foot2: [170, 176],
        elbow1: [216, 76], hand1: [246, 78], elbow2: [152, 76], hand2: [122, 78]
      })}
      <circle cx="187" cy="176" r="14" fill="none" stroke="var(--brown-red)" stroke-width="2.2"/>
    `,
    () => `
      <line x1="70" y1="176" x2="290" y2="176" stroke="var(--honey-bronze)" stroke-width="4" stroke-dasharray="8 4"/>
      ${figure({
        head: [212, 44], shoulder: [212, 68], hip: [210, 114],
        knee1: [216, 146], foot1: [218, 176], knee2: [242, 148], foot2: [262, 172],
        elbow1: [242, 78], hand1: [270, 82], elbow2: [182, 78], hand2: [154, 82]
      })}
      <circle cx="262" cy="172" r="8" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5"/>
    `
  ],

  sit_to_stand: [
    () => `
      <path d="M116 132 L166 132 M122 132 L122 178 M160 132 L160 178 M120 82 L120 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [152, 56], shoulder: [148, 78], hip: [148, 126],
        knee1: [194, 130], foot1: [194, 176], knee2: [186, 130], foot2: [184, 176],
        elbow1: [166, 98], hand1: [184, 102], elbow2: [158, 100], hand2: [176, 104]
      })}
      ${arrow('M174 68 L206 76')}
    `,
    () => `
      <path d="M116 132 L166 132 M122 132 L122 178 M160 132 L160 178 M120 82 L120 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [194, 62], shoulder: [182, 82], hip: [162, 118],
        knee1: [198, 134], foot1: [194, 176], knee2: [190, 134], foot2: [184, 176],
        elbow1: [204, 96], hand1: [224, 94], elbow2: [196, 98], hand2: [216, 96]
      })}
      ${arrow('M216 116 L216 58', 'var(--brown-red)')}
    `,
    () => `
      <path d="M116 132 L166 132 M122 132 L122 178 M160 132 L160 178 M120 82 L120 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [194, 42], shoulder: [192, 66], hip: [192, 112],
        knee1: [194, 145], foot1: [194, 176], knee2: [184, 145], foot2: [184, 176],
        elbow1: [202, 92], hand1: [206, 114], elbow2: [184, 92], hand2: [182, 114]
      })}
      <circle cx="192" cy="66" r="16" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="3 3"/>
    `
  ],

  mobility_flow: [
    () => `
      ${figure({
        head: [216, 86], shoulder: [198, 102], hip: [154, 134],
        knee1: [200, 138], foot1: [204, 176], knee2: [122, 160], foot2: [88, 176],
        elbow1: [198, 136], hand1: [194, 174], elbow2: [184, 136], hand2: [178, 174]
      })}
      ${arrow('M214 146 Q236 106 226 60')}
    `,
    () => `
      ${figure({
        head: [208, 84], shoulder: [192, 100], hip: [152, 134],
        knee1: [198, 138], foot1: [204, 176], knee2: [120, 160], foot2: [88, 176],
        elbow1: [204, 70], hand1: [216, 40], elbow2: [184, 136], hand2: [182, 174]
      })}
      <circle cx="192" cy="100" r="22" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="4 3"/>
    `,
    () => `
      ${figure({
        head: [180, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [186, 146], foot1: [188, 176], knee2: [172, 146], foot2: [168, 176],
        elbow1: [204, 48], hand1: [216, 26], elbow2: [156, 48], hand2: [144, 26]
      })}
      <path d="M144 26 Q180 12 216 26" fill="none" stroke="var(--honey-bronze)" stroke-width="3" stroke-linecap="round"/>
    `
  ],

  breathing: [
    () => `
      <path d="M126 132 L176 132 M132 132 L132 178 M170 132 L170 178 M130 82 L130 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [164, 52], shoulder: [162, 76], hip: [160, 126],
        knee1: [204, 130], foot1: [204, 176], knee2: [196, 130], foot2: [196, 176],
        elbow1: [178, 98], hand1: [172, 108], elbow2: [150, 98], hand2: [154, 108]
      })}
      <circle cx="162" cy="96" r="18" fill="none" stroke="var(--dark-slate-grey)" stroke-width="2" stroke-dasharray="3 3"/>
    `,
    () => `
      <path d="M126 132 L176 132 M132 132 L132 178 M170 132 L170 178 M130 82 L130 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [164, 48], shoulder: [162, 72], hip: [160, 126],
        knee1: [204, 130], foot1: [204, 176], knee2: [196, 130], foot2: [196, 176],
        elbow1: [190, 92], hand1: [182, 104], elbow2: [138, 92], hand2: [144, 104]
      })}
      <circle cx="162" cy="94" r="28" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5"/>
      <circle cx="162" cy="94" r="38" fill="none" stroke="var(--honey-bronze)" stroke-width="1.3" stroke-dasharray="4 4"/>
    `,
    () => `
      <path d="M126 132 L176 132 M132 132 L132 178 M170 132 L170 178 M130 82 L130 132" stroke="var(--dark-slate-grey)" stroke-width="5" stroke-linecap="round"/>
      ${figure({
        head: [164, 52], shoulder: [162, 76], hip: [160, 126],
        knee1: [204, 130], foot1: [236, 166], knee2: [196, 130], foot2: [196, 176],
        elbow1: [176, 100], hand1: [172, 112], elbow2: [150, 100], hand2: [154, 112]
      })}
      ${arrow('M244 150 Q254 166 242 178')}
    `
  ],

  aerobic_stride: [
    () => `
      <path d="M40 162 Q110 144 180 162 T320 162" fill="none" stroke="var(--dark-slate-grey)" stroke-width="2" opacity="0.4"/>
      ${figure({
        head: [168, 46], shoulder: [164, 70], hip: [158, 114],
        knee1: [182, 144], foot1: [198, 176], knee2: [144, 146], foot2: [124, 174],
        elbow1: [186, 92], hand1: [202, 86], elbow2: [144, 94], hand2: [128, 104]
      })}
      ${arrow('M206 74 L250 74')}
    `,
    () => `
      <path d="M40 162 Q110 144 180 162 T320 162" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5" opacity="0.55"/>
      ${figure({
        head: [188, 44], shoulder: [184, 68], hip: [178, 112],
        knee1: [196, 146], foot1: [188, 176], knee2: [176, 140], foot2: [162, 166],
        elbow1: [194, 94], hand1: [208, 96], elbow2: [174, 92], hand2: [188, 86]
      })}
      <circle cx="186" cy="84" r="18" fill="none" stroke="var(--brown-red)" stroke-width="2" stroke-dasharray="4 3"/>
    `,
    () => `
      <path d="M40 162 Q110 144 180 162 T320 162" fill="none" stroke="var(--dark-slate-grey)" stroke-width="2" opacity="0.4"/>
      ${figure({
        head: [208, 46], shoulder: [204, 70], hip: [198, 114],
        knee1: [186, 146], foot1: [164, 174], knee2: [222, 144], foot2: [238, 176],
        elbow1: [184, 94], hand1: [168, 104], elbow2: [226, 92], hand2: [242, 86]
      })}
      ${arrow('M240 74 L282 74')}
    `
  ],

  march_dual: [
    () => `
      ${figure({
        head: [180, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [184, 146], foot1: [184, 176], knee2: [172, 146], foot2: [172, 176],
        elbow1: [196, 94], hand1: [202, 116], elbow2: [164, 94], hand2: [158, 116]
      })}
      <circle cx="180" cy="44" r="20" fill="none" stroke="var(--honey-bronze)" stroke-width="2" stroke-dasharray="3 3"/>
    `,
    () => `
      ${figure({
        head: [180, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [212, 118], foot1: [208, 150], knee2: [174, 146], foot2: [174, 176],
        elbow1: [162, 96], hand1: [152, 114], elbow2: [206, 80], hand2: [220, 60]
      })}
      <path d="M216 64 Q198 86 210 112" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5" stroke-dasharray="4 3"/>
    `,
    () => `
      ${figure({
        head: [180, 44], shoulder: [180, 68], hip: [178, 114],
        knee1: [182, 146], foot1: [182, 176], knee2: [148, 118], foot2: [152, 150],
        elbow1: [206, 78], hand1: [222, 58], elbow2: [162, 96], hand2: [152, 114]
      })}
      <path d="M216 64 Q174 86 150 112" fill="none" stroke="var(--brown-red)" stroke-width="2.5" stroke-dasharray="4 3"/>
    `
  ],

  heel_drop: [
    () => `
      <line x1="104" y1="100" x2="146" y2="100" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="110" y1="100" x2="110" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [184, 34], shoulder: [184, 58], hip: [182, 104],
        knee1: [184, 138], foot1: [186, 166], knee2: [174, 138], foot2: [176, 166],
        elbow1: [162, 82], hand1: [138, 98], elbow2: [202, 84], hand2: [206, 110]
      })}
      ${arrow('M216 152 L216 106')}
    `,
    () => `
      <line x1="104" y1="100" x2="146" y2="100" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="110" y1="100" x2="110" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [184, 46], shoulder: [184, 70], hip: [180, 116],
        knee1: [188, 146], foot1: [184, 176], knee2: [178, 146], foot2: [174, 176],
        elbow1: [162, 88], hand1: [138, 98], elbow2: [202, 92], hand2: [206, 118]
      })}
      ${arrow('M216 106 L216 158', 'var(--brown-red)')}
      <ellipse cx="180" cy="176" rx="28" ry="6" fill="none" stroke="var(--honey-bronze)" stroke-width="2.5"/>
    `,
    () => `
      <line x1="104" y1="100" x2="146" y2="100" stroke="var(--dark-slate-grey)" stroke-width="4" stroke-linecap="round"/>
      <line x1="110" y1="100" x2="110" y2="178" stroke="var(--dark-slate-grey)" stroke-width="3"/>
      ${figure({
        head: [184, 44], shoulder: [184, 68], hip: [182, 114],
        knee1: [184, 146], foot1: [184, 176], knee2: [174, 146], foot2: [174, 176],
        elbow1: [162, 86], hand1: [138, 98], elbow2: [202, 90], hand2: [206, 116]
      })}
      <path d="M180 174 L180 96" stroke="var(--honey-bronze)" stroke-width="2.5" stroke-dasharray="4 3"/>
      <circle cx="180" cy="114" r="14" fill="none" stroke="var(--honey-bronze)" stroke-width="2"/>
    `
  ],

  medball: [
    () => `
      ${figure({
        head: [174, 48], shoulder: [174, 72], hip: [172, 116],
        knee1: [176, 146], foot1: [176, 176], knee2: [166, 146], foot2: [166, 176],
        elbow1: [186, 46], hand1: [186, 26], elbow2: [164, 46], hand2: [176, 26]
      })}
      <circle cx="182" cy="22" r="11" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="2"/>
      ${arrow('M212 36 Q236 86 226 146')}
    `,
    () => `
      ${figure({
        head: [202, 74], shoulder: [186, 92], hip: [152, 124],
        knee1: [184, 146], foot1: [182, 176], knee2: [174, 146], foot2: [170, 176],
        elbow1: [206, 116], hand1: [220, 142], elbow2: [198, 118], hand2: [212, 142]
      })}
      <circle cx="226" cy="166" r="11.5" fill="var(--honey-bronze)" stroke="var(--fig-head)" stroke-width="2"/>
      <ellipse cx="226" cy="176" rx="22" ry="5" fill="none" stroke="var(--brown-red)" stroke-width="2"/>
    `,
    () => `
      ${figure({
        head: [194, 82], shoulder: [182, 100], hip: [150, 134],
        knee1: [186, 142], foot1: [182, 176], knee2: [176, 144], foot2: [170, 176],
        elbow1: [202, 128], hand1: [218, 156], elbow2: [194, 130], hand2: [210, 156]
      })}
      <circle cx="222" cy="164" r="11" fill="var(--honey-bronze)"/>
      ${arrow('M136 132 L136 78')}
    `
  ]
};

let mvUid = 0;

export function renderMovementSVG(motionType, phaseIndex = 0, label = 'Exercise biomechanical phase diagram', { decorative = false } = {}) {
  const frames = SCENES[motionType] || SCENES.squat;
  const idx = Math.max(0, Math.min(2, phaseIndex));
  const markerId = `mv-arrow-${++mvUid}`;
  const content = frames[idx]().replaceAll('url(#mv-arrow)', `url(#${markerId})`);
  const a11yAttrs = decorative
    ? 'aria-hidden="true"'
    : `role="img" aria-label="${escapeXml(label)}"`;

  return `
<svg class="movement-svg" viewBox="0 0 360 205" ${a11yAttrs}>
  <defs>
    <marker id="${markerId}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1.5 L8.5 5 L0 8.5 Z" fill="var(--honey-bronze)"/>
    </marker>
  </defs>
  <!-- Archival Poster Backdrop Accents -->
  <circle cx="180" cy="112" r="76" fill="var(--mv-halo)" opacity="0.55"/>
  <line x1="34" y1="178" x2="326" y2="178" stroke="var(--mv-ground)" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="56" y1="186" x2="304" y2="186" stroke="var(--mv-ground)" stroke-width="1" stroke-dasharray="4 6" opacity="0.6"/>
  ${content}
</svg>`.trim();
}

function escapeXml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
