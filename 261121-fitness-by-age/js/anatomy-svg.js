/**
 * Exercise by Age Explainer — Mid-Century Swiss Anatomical Body-Impact SVG Generator
 * Dynamically illuminates muscles, skeletal bone-load zones, heart/lungs,
 * joints, and balance/vestibular pathways using the 5-color CSS design tokens.
 */

export const ZONE_LABELS = {
  brain_vestibular: 'Brain & Vestibular',
  heart_lungs: 'Heart & Lungs',
  shoulders: 'Shoulders & Rotator Cuff',
  chest: 'Chest & Anterior Torso',
  back: 'Upper & Mid Back',
  spine: 'Spinal Column',
  core: 'Deep Core & Obliques',
  grip: 'Forearms & Grip',
  hips_femur: 'Hips & Femoral Bone',
  glutes: 'Glutes & Hip Stabilizers',
  quads: 'Quadriceps',
  hamstrings: 'Hamstrings',
  calves: 'Calves & Achilles',
  ankles_feet: 'Ankles & Feet',
  proprioceptors: 'Balance Proprioceptors'
};

/**
 * Generates an accessible, CSS-token-driven SVG showing an anatomical figure
 * with highlighted body regions and subtle Swiss editorial grid accents.
 */
export function renderAnatomySVG({
  activeZones = [],
  activeSystems = [],
  title = 'Anatomical body-impact diagram',
  idPrefix = 'anat'
} = {}) {
  const zoneSet = new Set(activeZones);
  const sysSet = new Set(activeSystems);
  const isOn = (z) => zoneSet.has(z);

  const zoneClass = (z, category) =>
    `anat-zone anat-cat-${category}${isOn(z) ? ' is-active' : ''}`;

  const activeLabels = activeZones
    .map((z) => ZONE_LABELS[z])
    .filter(Boolean)
    .join(', ');

  const fullTitle = activeLabels
    ? `${title}: highlights ${activeLabels}`
    : title;

  return `
<svg class="anatomy-svg" viewBox="0 0 320 490" role="img" aria-labelledby="${idPrefix}-title">
  <title id="${idPrefix}-title">${escapeXml(fullTitle)}</title>
  <defs>
    <radialGradient id="${idPrefix}-glow-red" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--sys-muscular)" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="var(--sys-muscular)" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${idPrefix}-glow-gold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--sys-skeletal)" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="var(--sys-skeletal)" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${idPrefix}-glow-slate" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="var(--sys-cardio)" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="var(--sys-cardio)" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Subtle Swiss Poster Measurement Grid -->
  <g class="anat-grid" aria-hidden="true">
    <line x1="160" y1="16" x2="160" y2="474" stroke="var(--anat-grid)" stroke-width="1" stroke-dasharray="3 5"/>
    <line x1="36" y1="120" x2="284" y2="120" stroke="var(--anat-grid)" stroke-width="1"/>
    <line x1="36" y1="242" x2="284" y2="242" stroke="var(--anat-grid)" stroke-width="1"/>
    <line x1="36" y1="358" x2="284" y2="358" stroke="var(--anat-grid)" stroke-width="1"/>
    <line x1="56" y1="458" x2="264" y2="458" stroke="var(--anat-grid)" stroke-width="1.5"/>
    <circle cx="160" cy="215" r="118" fill="none" stroke="var(--anat-grid)" stroke-width="1" stroke-dasharray="2 6"/>
    <circle cx="160" cy="215" r="78" fill="none" stroke="var(--anat-grid)" stroke-width="1"/>
  </g>

  <!-- Base Stylized Anatomical Silhouette -->
  <g class="anat-silhouette">
    <!-- Head & Neck -->
    <ellipse cx="160" cy="54" rx="22" ry="26" class="anat-body-fill"/>
    <path d="M148 76 L148 96 L172 96 L172 76 Z" class="anat-body-fill"/>
    <!-- Torso -->
    <path d="M114 102 C126 94, 194 94, 206 102 L214 118 L200 182 L195 234 C195 248, 125 248, 125 234 L120 182 L106 118 Z" class="anat-body-fill"/>
    <!-- Left Arm (viewer left) -->
    <path d="M112 104 C98 108, 88 124, 83 148 L72 206 L64 250 C62 258, 75 262, 80 253 L92 208 L104 156 L112 126 Z" class="anat-body-fill"/>
    <!-- Right Arm (viewer right) -->
    <path d="M208 104 C222 108, 232 124, 237 148 L248 206 L256 250 C258 258, 245 262, 240 253 L228 208 L216 156 L208 126 Z" class="anat-body-fill"/>
    <!-- Left Leg -->
    <path d="M126 234 L156 238 L153 336 L148 432 L152 454 C146 458, 120 458, 114 453 L126 432 L123 338 L119 266 Z" class="anat-body-fill"/>
    <!-- Right Leg -->
    <path d="M194 234 L164 238 L167 336 L172 432 L168 454 C174 458, 200 458, 206 453 L194 432 L197 338 L201 266 Z" class="anat-body-fill"/>
  </g>

  <!-- Structural Skeletal Axis (subtle always-on editorial linework) -->
  <g class="anat-skeleton-base" aria-hidden="true">
    <line x1="160" y1="88" x2="160" y2="232" stroke="var(--anat-line)" stroke-width="2" stroke-dasharray="4 3"/>
    <path d="M118 112 L202 112" stroke="var(--anat-line)" stroke-width="1.5"/>
    <path d="M132 232 L188 232" stroke="var(--anat-line)" stroke-width="1.5"/>
    <line x1="138" y1="238" x2="136" y2="438" stroke="var(--anat-line)" stroke-width="1.25"/>
    <line x1="182" y1="238" x2="184" y2="438" stroke="var(--anat-line)" stroke-width="1.25"/>
  </g>

  <!-- ==================== DYNAMIC ACTIVE ZONES ==================== -->

  <!-- Brain & Vestibular Balance (Inner Ear + Neural Halo) -->
  <g class="${zoneClass('brain_vestibular', 'neural')}" data-zone="brain_vestibular">
    <circle cx="160" cy="52" r="34" fill="url(#${idPrefix}-glow-gold)"/>
    <circle cx="160" cy="52" r="29" fill="none" stroke="var(--sys-neural)" stroke-width="2" stroke-dasharray="5 4"/>
    <circle cx="160" cy="52" r="39" fill="none" stroke="var(--sys-neural)" stroke-width="1.25" opacity="0.7"/>
    <path d="M144 48 C147 36, 173 36, 176 48 C176 58, 168 62, 160 62 C152 62, 144 58, 144 48 Z" fill="var(--sys-neural)" opacity="0.82"/>
    <!-- Vestibular ear balance arcs -->
    <path d="M130 48 A10 10 0 0 0 130 60" fill="none" stroke="var(--sys-neural)" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M190 48 A10 10 0 0 1 190 60" fill="none" stroke="var(--sys-neural)" stroke-width="2.2" stroke-linecap="round"/>
  </g>

  <!-- Shoulders & Rotator Cuff -->
  <g class="${zoneClass('shoulders', 'muscular')}" data-zone="shoulders">
    <ellipse cx="111" cy="116" rx="15" ry="13" fill="var(--sys-muscular)" opacity="0.86"/>
    <ellipse cx="209" cy="116" rx="15" ry="13" fill="var(--sys-muscular)" opacity="0.86"/>
    <circle cx="111" cy="116" r="19" fill="none" stroke="var(--sys-muscular)" stroke-width="1.5" stroke-dasharray="3 3"/>
    <circle cx="209" cy="116" r="19" fill="none" stroke="var(--sys-muscular)" stroke-width="1.5" stroke-dasharray="3 3"/>
  </g>

  <!-- Chest / Pectorals -->
  <g class="${zoneClass('chest', 'muscular')}" data-zone="chest">
    <path d="M124 115 C134 109, 152 110, 158 118 L158 144 C146 149, 128 144, 123 132 Z" fill="var(--sys-muscular)" opacity="0.85"/>
    <path d="M196 115 C186 109, 168 110, 162 118 L162 144 C174 149, 192 144, 197 132 Z" fill="var(--sys-muscular)" opacity="0.85"/>
  </g>

  <!-- Upper & Mid Back (Lats / Scapular Wings) -->
  <g class="${zoneClass('back', 'muscular')}" data-zone="back">
    <path d="M118 128 L136 124 L134 176 L122 170 Z" fill="var(--sys-muscular)" opacity="0.8"/>
    <path d="M202 128 L184 124 L186 176 L198 170 Z" fill="var(--sys-muscular)" opacity="0.8"/>
    <path d="M138 106 L160 132 L182 106 L176 146 L160 158 L144 146 Z" fill="none" stroke="var(--sys-muscular)" stroke-width="2.5" stroke-linejoin="round"/>
  </g>

  <!-- Heart & Lungs (Cardiovascular / Respiratory) -->
  <g class="${zoneClass('heart_lungs', 'cardio')}" data-zone="heart_lungs">
    <circle cx="162" cy="140" r="38" fill="url(#${idPrefix}-glow-slate)"/>
    <!-- Ribcage / Lung arcs -->
    <path d="M132 125 C127 140, 130 158, 145 163" fill="none" stroke="var(--sys-cardio)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M188 125 C193 140, 190 158, 175 163" fill="none" stroke="var(--sys-cardio)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M138 134 C135 144, 137 154, 147 157" fill="none" stroke="var(--sys-cardio)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
    <path d="M182 134 C185 144, 183 154, 173 157" fill="none" stroke="var(--sys-cardio)" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
    <!-- Stylized Heart -->
    <path d="M164 134 C164 128, 173 128, 173 135 C173 143, 163 149, 161 152 C159 149, 149 143, 149 135 C149 128, 158 128, 158 134 C159 136, 163 136, 164 134 Z" fill="var(--sys-muscular)" stroke="var(--anat-stroke-contrast)" stroke-width="1.4"/>
    <circle cx="161" cy="140" r="22" fill="none" stroke="var(--sys-cardio)" stroke-width="1.5" stroke-dasharray="4 4"/>
  </g>

  <!-- Spinal Column (Skeletal / Thoracic-Lumbar) -->
  <g class="${zoneClass('spine', 'skeletal')}" data-zone="spine">
    <line x1="160" y1="92" x2="160" y2="232" stroke="var(--sys-skeletal)" stroke-width="5.5" stroke-linecap="round"/>
    <g fill="var(--anat-stroke-contrast)">
      <circle cx="160" cy="104" r="2.2"/>
      <circle cx="160" cy="122" r="2.2"/>
      <circle cx="160" cy="140" r="2.2"/>
      <circle cx="160" cy="158" r="2.2"/>
      <circle cx="160" cy="176" r="2.2"/>
      <circle cx="160" cy="194" r="2.2"/>
      <circle cx="160" cy="212" r="2.2"/>
    </g>
  </g>

  <!-- Deep Core & Obliques -->
  <g class="${zoneClass('core', 'muscular')}" data-zone="core">
    <rect x="137" y="160" width="46" height="58" rx="14" fill="var(--sys-muscular)" opacity="0.78"/>
    <path d="M137 178 L183 178 M137 196 L183 196 M160 162 L160 216" stroke="var(--anat-stroke-contrast)" stroke-width="1.4" opacity="0.7"/>
  </g>

  <!-- Forearms & Grip -->
  <g class="${zoneClass('grip', 'muscular')}" data-zone="grip">
    <path d="M84 196 L72 252 L82 255 L94 200 Z" fill="var(--sys-muscular)" opacity="0.88"/>
    <path d="M236 196 L248 252 L238 255 L226 200 Z" fill="var(--sys-muscular)" opacity="0.88"/>
    <circle cx="72" cy="252" r="11" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.2"/>
    <circle cx="248" cy="252" r="11" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.2"/>
  </g>

  <!-- Hips & Femoral Bone Density (Osteogenic Load Rings) -->
  <g class="${zoneClass('hips_femur', 'skeletal')}" data-zone="hips_femur">
    <circle cx="136" cy="236" r="22" fill="url(#${idPrefix}-glow-gold)"/>
    <circle cx="184" cy="236" r="22" fill="url(#${idPrefix}-glow-gold)"/>
    <path d="M130 228 Q160 244 190 228" fill="none" stroke="var(--sys-skeletal)" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="136" cy="238" r="11" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.5"/>
    <circle cx="136" cy="238" r="17" fill="none" stroke="var(--sys-skeletal)" stroke-width="1.3" stroke-dasharray="3 3"/>
    <circle cx="184" cy="238" r="11" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.5"/>
    <circle cx="184" cy="238" r="17" fill="none" stroke="var(--sys-skeletal)" stroke-width="1.3" stroke-dasharray="3 3"/>
    <line x1="136" y1="248" x2="136" y2="334" stroke="var(--sys-skeletal)" stroke-width="3" stroke-linecap="round"/>
    <line x1="184" y1="248" x2="184" y2="334" stroke="var(--sys-skeletal)" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Glutes & Lateral Hip Stabilizers -->
  <g class="${zoneClass('glutes', 'muscular')}" data-zone="glutes">
    <path d="M123 224 C118 242, 124 260, 146 258 L156 244 L154 226 Z" fill="var(--sys-muscular)" opacity="0.82"/>
    <path d="M197 224 C202 242, 196 260, 174 258 L164 244 L166 226 Z" fill="var(--sys-muscular)" opacity="0.82"/>
  </g>

  <!-- Quadriceps -->
  <g class="${zoneClass('quads', 'muscular')}" data-zone="quads">
    <path d="M124 262 C121 294, 125 322, 137 338 C149 326, 152 292, 152 262 Z" fill="var(--sys-muscular)" opacity="0.88"/>
    <path d="M196 262 C199 294, 195 322, 183 338 C171 326, 168 292, 168 262 Z" fill="var(--sys-muscular)" opacity="0.88"/>
  </g>

  <!-- Hamstrings (Outer/Posterior Thigh Stripes) -->
  <g class="${zoneClass('hamstrings', 'muscular')}" data-zone="hamstrings">
    <path d="M119 266 C115 294, 118 324, 126 340" fill="none" stroke="var(--sys-muscular)" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M201 266 C205 294, 202 324, 194 340" fill="none" stroke="var(--sys-muscular)" stroke-width="5.5" stroke-linecap="round"/>
  </g>

  <!-- Calves & Achilles -->
  <g class="${zoneClass('calves', 'muscular')}" data-zone="calves">
    <path d="M126 358 C122 380, 125 404, 134 422 C144 404, 147 380, 145 358 Z" fill="var(--sys-muscular)" opacity="0.86"/>
    <path d="M194 358 C198 380, 195 404, 186 422 C176 404, 173 380, 175 358 Z" fill="var(--sys-muscular)" opacity="0.86"/>
  </g>

  <!-- Ankles & Feet (Bone Impact + Dorsiflexion) -->
  <g class="${zoneClass('ankles_feet', 'skeletal')}" data-zone="ankles_feet">
    <circle cx="136" cy="442" r="14" fill="url(#${idPrefix}-glow-gold)"/>
    <circle cx="184" cy="442" r="14" fill="url(#${idPrefix}-glow-gold)"/>
    <circle cx="136" cy="442" r="9" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.5"/>
    <circle cx="184" cy="442" r="9" fill="none" stroke="var(--sys-skeletal)" stroke-width="2.5"/>
    <path d="M114 454 L152 454" stroke="var(--sys-skeletal)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M168 454 L206 454" stroke="var(--sys-skeletal)" stroke-width="3.5" stroke-linecap="round"/>
  </g>

  <!-- Balance Proprioceptors (Ground Wave + Hip/Ankle Equilibrium) -->
  <g class="${zoneClass('proprioceptors', 'neural')}" data-zone="proprioceptors">
    <ellipse cx="160" cy="462" rx="74" ry="12" fill="none" stroke="var(--sys-neural)" stroke-width="2" stroke-dasharray="5 4"/>
    <ellipse cx="160" cy="462" rx="50" ry="7" fill="none" stroke="var(--sys-neural)" stroke-width="1.6"/>
    <circle cx="136" cy="346" r="7" fill="none" stroke="var(--sys-neural)" stroke-width="2"/>
    <circle cx="184" cy="346" r="7" fill="none" stroke="var(--sys-neural)" stroke-width="2"/>
    <path d="M104 238 L122 238 M198 238 L216 238" stroke="var(--sys-neural)" stroke-width="2.2" stroke-linecap="round"/>
  </g>

  <!-- Subtle System Indicator Corner Badges -->
  <g class="anat-corner-marks" aria-hidden="true">
    <circle cx="24" cy="24" r="4" fill="${sysSet.has('muscular') ? 'var(--sys-muscular)' : 'var(--anat-grid)'}"/>
    <circle cx="38" cy="24" r="4" fill="${sysSet.has('skeletal') ? 'var(--sys-skeletal)' : 'var(--anat-grid)'}"/>
    <circle cx="52" cy="24" r="4" fill="${sysSet.has('cardiovascular') ? 'var(--sys-cardio)' : 'var(--anat-grid)'}"/>
    <circle cx="66" cy="24" r="4" fill="${sysSet.has('neuromuscular') ? 'var(--sys-neural)' : 'var(--anat-grid)'}"/>
  </g>
</svg>`.trim();
}

function escapeXml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
