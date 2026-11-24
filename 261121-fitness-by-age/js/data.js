/**
 * Exercise by Age Explainer — Lifelong Exercise Physiology Dataset
 * 7 overlapping age stages (starting at age 10), 6 exercise modalities,
 * and 42 tailored exercises mapped to physiological body systems & biomechanical visuals.
 */

export const MODALITIES = [
  {
    id: 'strength',
    name: 'Strength & Resistance',
    shortName: 'Strength',
    tagline: 'Muscle fiber density, tendon load capacity & skeletal force',
    colorToken: 'brown-red',
    icon: 'strength',
    description:
      'External or bodyweight resistance signals muscle protein synthesis, thickens connective tendons, and applies bone-preserving mechanical tension.'
  },
  {
    id: 'power',
    name: 'Power & Plyometrics',
    shortName: 'Power',
    tagline: 'Fast-twitch Type II fibers, speed of force & bone stimulus',
    colorToken: 'honey-bronze',
    icon: 'power',
    description:
      'Moving with crisp intent protects fast-twitch fibers—essential for explosive sport at 20 and catching yourself from a stumble at 70.'
  },
  {
    id: 'hiit',
    name: 'HIIT & Anaerobic',
    shortName: 'HIIT',
    tagline: 'Peak VO₂max ceiling, cardiac stroke volume & anaerobic drive',
    colorToken: 'night-bordeaux',
    icon: 'hiit',
    description:
      'Short bursts near maximal effort expand top-end aerobic capacity. Most potent in youth/prime decades; scaled to low-impact or steady work later in life.'
  },
  {
    id: 'aerobic',
    name: 'Aerobic Base (Zone 2)',
    shortName: 'Aerobic Base',
    tagline: 'Mitochondrial density, capillary growth & metabolic health',
    colorToken: 'dark-slate',
    icon: 'aerobic',
    description:
      'Conversational steady-state endurance builds cellular energy factories, improves insulin sensitivity, and lowers resting heart strain at every age.'
  },
  {
    id: 'balance',
    name: 'Balance & Proprioception',
    shortName: 'Balance',
    tagline: 'Vestibular reflexes, joint sensors & confident single-leg control',
    colorToken: 'honey-bronze',
    icon: 'balance',
    description:
      'Trains the continuous feedback loop between inner ear, eyes, spine, and ankle receptors—preventing ACL injuries in youth and falls in older age.'
  },
  {
    id: 'mobility',
    name: 'Mobility & Recovery',
    shortName: 'Mobility',
    tagline: 'Joint capsule nutrition, posture & pain-free full range',
    colorToken: 'dark-slate',
    icon: 'mobility',
    description:
      'Active end-range movement circulates synovial fluid, counters desk stiffness, and protects natural stride length and overhead reach.'
  }
];

export const BODY_SYSTEMS = {
  muscular: {
    id: 'muscular',
    name: 'Muscular System',
    shortName: 'Muscles',
    colorVar: 'var(--sys-muscular)',
    summary: 'Hypertrophy, fast-twitch retention, metabolic glucose uptake & posture'
  },
  skeletal: {
    id: 'skeletal',
    name: 'Skeletal & Bone Density',
    shortName: 'Bones',
    colorVar: 'var(--sys-skeletal)',
    summary: 'Osteoblast remodeling, femur/spine density & impact absorption'
  },
  cardiovascular: {
    id: 'cardiovascular',
    name: 'Heart & Lungs',
    shortName: 'Cardio',
    colorVar: 'var(--sys-cardio)',
    summary: 'Stroke volume, VO₂max, mitochondrial output & arterial elasticity'
  },
  neuromuscular: {
    id: 'neuromuscular',
    name: 'Balance & Nervous System',
    shortName: 'Neural / Balance',
    colorVar: 'var(--sys-neural)',
    summary: 'Proprioception, motor coordination, reaction speed & vestibular reflex'
  },
  joints: {
    id: 'joints',
    name: 'Joints & Tendons',
    shortName: 'Joints',
    colorVar: 'var(--sys-joints)',
    summary: 'Tendon stiffness, cartilage hydration, hip/thoracic & ankle mobility'
  }
};

/**
 * Priority status values for each modality within an age group:
 * - 'core'     (level 85-100): Primary cornerstone
 * - 'high'     (level 68-84):  Strong regular pillar
 * - 'moderate' (level 45-67):  Supportive weekly component
 * - 'adapt'    (level 22-44):  Use selectively / low-impact adaptations
 * - 'caution'  (level 0-21):   Generally skipped or replaced by safer modalities
 */
export const STATUS_META = {
  core: { label: 'Core Pillar', symbol: '●', tone: 'core' },
  high: { label: 'High Priority', symbol: '◉', tone: 'high' },
  moderate: { label: 'Supportive', symbol: '◐', tone: 'moderate' },
  adapt: { label: 'Adapt / Low-Impact', symbol: '△', tone: 'adapt' },
  caution: { label: 'Skip or Substitute', symbol: '○', tone: 'caution' }
};

export const AGE_GROUPS = [
  {
    id: '10-18',
    label: '10–18',
    minAge: 10,
    maxAge: 18,
    stageNum: '01',
    title: 'Adolescent Foundations',
    eyebrow: 'Stage 01 · Ages 10 to 18',
    tagline: 'Bank peak bone density and wire lifelong movement fluency.',
    imageBase: 'assets/images/group-10-18',
    imageAlt:
      'Editorial illustration of two adolescents practicing athletic hop landings and single-leg squat balance framed by concentric rings',
    physiologyOverview:
      'Nearly 90% of adult bone mineral density is built before age 20. Rapid limb growth can temporarily disrupt coordination, making skill mastery, playful impact landings, and bodyweight control far more valuable than chasing heavy max lifts.',
    weeklyRhythm: '60 min daily active play/sport · 2–3×/wk movement & bodyweight strength',
    effortTarget: 'RPE 5–7 · Technique First',
    focusBullets: [
      'Multidirectional jumping and soft landings to signal osteoblast bone banking',
      'Clean squat, hinge, push, and pull patterns before adding heavy external load',
      'Varied sports and aerobic play to avoid single-sport overuse injuries'
    ],
    guardrails: [
      'Skip maximal 1-rep lifts—growth plates respond best to crisp 8–15 rep skill work',
      'Balance intense club sports with deliberate rest days and full-range mobility'
    ],
    mix: {
      strength: { score: 78, status: 'high', note: 'Bodyweight & light-load technique mastery' },
      power: { score: 85, status: 'core', note: 'Playful hops & soft-landing mechanics' },
      hiit: { score: 56, status: 'moderate', note: 'Natural bursts inside games & sports' },
      aerobic: { score: 88, status: 'core', note: 'Playful endurance & aerobic engine growth' },
      balance: { score: 82, status: 'high', note: 'Re-wiring coordination during growth spurts' },
      mobility: { score: 72, status: 'high', note: 'Preserving hip, ankle & shoulder range' }
    },
    exercises: [
      {
        id: 'ex-10-squat-push',
        name: 'Bodyweight Squat & Push-Up Mastery',
        modality: 'strength',
        motionType: 'squat',
        effort: 'RPE 6 · 3 × 10–12 reps',
        frequency: '2–3× / week',
        summary: 'Foundational lower- and upper-body patterns that build joint alignment and motor fluency.',
        whyThisAge:
          'During rapid growth spurts, teaching the knees, hips, and shoulder blades to track smoothly builds a permanent neuromuscular blueprint before adding barbells.',
        bodyImpact: {
          headline: 'Wires coordinated strength across quads, glutes, core & chest',
          systems: ['muscular', 'skeletal', 'joints'],
          zones: ['quads', 'glutes', 'chest', 'core', 'hips_femur'],
          mechanisms: [
            { system: 'muscular', text: 'Recruits large lower-body and pushing muscles harmoniously without spinal compression.' },
            { system: 'skeletal', text: 'Muscular pull on the femur and humerus stimulates early bone thickening.' },
            { system: 'joints', text: 'Full-depth squatting keeps hip capsules and ankles mobile through adolescence.' }
          ]
        },
        steps: [
          { phase: 'Setup', cue: 'Stand shoulder-width apart with toes turned slightly out; brace ribs gently over hips.' },
          { phase: 'Lower', cue: 'Sit hips back and down over 2 seconds, tracking knees directly over middle toes.' },
          { phase: 'Drive', cue: 'Press evenly through whole foot to stand tall; pair with crisp elevated or floor push-ups.' }
        ],
        easier: 'Squat to a bench tap; perform push-ups with hands on a sturdy bench or wall.',
        harder: 'Add a 2-second pause at the bottom of each squat or hold a light medicine ball.'
      },
      {
        id: 'ex-10-band-row-hinge',
        name: 'Resistance Band Rows & Hip Hinges',
        modality: 'strength',
        motionType: 'pull',
        effort: 'RPE 6 · 3 × 12 reps',
        frequency: '2–3× / week',
        summary: 'Strengthens the upper back and hamstrings to offset school desks and heavy backpacks.',
        whyThisAge:
          'Hours seated at screens and carrying backpacks tighten the chest and weaken posterior muscles. Teaching a neutral-spine hip hinge early protects the lower back for decades.',
        bodyImpact: {
          headline: 'Reinforces posterior chain, scapular control & upright posture',
          systems: ['muscular', 'joints', 'skeletal'],
          zones: ['back', 'hamstrings', 'glutes', 'spine', 'shoulders'],
          mechanisms: [
            { system: 'muscular', text: 'Strengthens rhomboids, mid-traps, and hamstrings to balance front-dominant sports.' },
            { system: 'skeletal', text: 'Supports healthy thoracic and lumbar spinal alignment during vertical growth.' },
            { system: 'joints', text: 'Stabilizes the shoulder joint for overhead throwing and swimming.' }
          ]
        },
        steps: [
          { phase: 'Anchor', cue: 'Loop a medium resistance band at chest height; hold handles with long arms and tall spine.' },
          { phase: 'Pull', cue: 'Draw elbows back beside ribs, gently squeezing shoulder blades together without shrugging.' },
          { phase: 'Control', cue: 'Return smoothly over 2 seconds; follow with dowel-on-back hip hinges.' }
        ],
        easier: 'Step closer to the anchor point for lighter band tension.',
        harder: 'Perform single-arm band rows while resisting torso rotation.'
      },
      {
        id: 'ex-10-hop-stick',
        name: 'Multidirectional Hop & "Stick" Landings',
        modality: 'power',
        motionType: 'jump_land',
        effort: 'RPE 6–7 · 3 × 6 crisp hops',
        frequency: '2–3× / week',
        summary: 'Playful hops with quiet, frozen 2-second landings that build bone density and knee protection.',
        whyThisAge:
          'Brief, varied ground-reaction forces are the single strongest trigger for adolescent bone mineral accrual—and sticking soft landings cuts youth ACL injury risk dramatically.',
        bodyImpact: {
          headline: 'Banks lifelong bone density while training knee-safe landing reflexes',
          systems: ['skeletal', 'neuromuscular', 'joints'],
          zones: ['hips_femur', 'ankles_feet', 'quads', 'glutes', 'proprioceptors'],
          mechanisms: [
            { system: 'skeletal', text: 'Multidirectional impact forces drive peak bone mineral deposition in hips and shins.' },
            { system: 'neuromuscular', text: 'Teaches rapid knee-alignment control when decelerating and cutting.' },
            { system: 'joints', text: 'Builds elastic Achilles and patellar tendon resilience safely.' }
          ]
        },
        steps: [
          { phase: 'Load', cue: 'Start tall, swing arms back, and dip slightly into an athletic quarter-squat.' },
          { phase: 'Leap', cue: 'Hop forward or laterally a modest distance—control matters more than distance.' },
          { phase: 'Stick', cue: 'Land softly on midfoot with knees bent and freeze motionless for 2 full seconds.' }
        ],
        easier: 'Use two-foot small hops over a taped floor line before trying single-leg hops.',
        harder: 'Hop diagonally onto one leg and freeze cleanly without wobbling.'
      },
      {
        id: 'ex-10-sport-tempo',
        name: 'Sport & Tempo Endurance Play',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 5–7 · 30–45 min varied',
        frequency: '4–5× / week',
        summary: 'Cycling, trail runs, swimming, or field games that build an expansive aerobic engine.',
        whyThisAge:
          'Varied aerobic play builds mitochondrial capacity and joyful movement identity while sparing growing tendons from repetitive single-pace pounding.',
        bodyImpact: {
          headline: 'Expands heart chamber capacity, lung efficiency & capillary beds',
          systems: ['cardiovascular', 'muscular'],
          zones: ['heart_lungs', 'quads', 'calves'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Increases cardiac stroke volume and expands oxygen-delivering capillaries.' },
            { system: 'muscular', text: 'Builds fatigue-resistant slow-twitch fibers that speed recovery between bursts.' }
          ]
        },
        steps: [
          { phase: 'Warm Up', cue: 'Spend 5 minutes moving lightly—easy jog, bike spin, or casual passing.' },
          { phase: 'Cruise', cue: 'Stay at a conversational rhythm with natural playful bursts of speed.' },
          { phase: 'Cool Down', cue: 'Walk gently for 5 minutes until breathing settles smoothly through the nose.' }
        ],
        easier: 'Break into two 15-minute brisk bike rides or active playground sessions.',
        harder: 'Include playful 30-second hill pickups within a steady 35-minute outing.'
      },
      {
        id: 'ex-10-single-reach',
        name: 'Single-Leg Reach & Ball Catch',
        modality: 'balance',
        motionType: 'balance_single',
        effort: 'RPE 5 · 3 × 30 sec / side',
        frequency: '3× / week',
        summary: 'Balancing on one leg while tapping compass points or tossing a ball against a wall.',
        whyThisAge:
          'Rapid limb elongation temporarily makes teens feel gangly. Reactive single-leg play recalibrates ankle and hip proprioceptors fast.',
        bodyImpact: {
          headline: 'Sharpens brain-to-ankle coordination & reactive stability',
          systems: ['neuromuscular', 'joints', 'muscular'],
          zones: ['brain_vestibular', 'proprioceptors', 'ankles_feet', 'glutes', 'core'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Synchronizes visual tracking with rapid ankle and hip micro-adjustments.' },
            { system: 'joints', text: 'Strengthens small ankle stabilizers to prevent common sports sprains.' },
            { system: 'muscular', text: 'Activates gluteus medius to keep the pelvis level while moving.' }
          ]
        },
        steps: [
          { phase: 'Root', cue: 'Stand barefoot or in flat shoes on one foot with a soft micro-bend in the knee.' },
          { phase: 'Reach', cue: 'Tap the free foot lightly forward, sideways, and back—or gently toss and catch a tennis ball.' },
          { phase: 'Stabilize', cue: 'Keep knee aligned over second toe and hips level throughout.' }
        ],
        easier: 'Stand near a wall for light fingertip taps when resetting balance.',
        harder: 'Catch off-center wall bounces or close eyes briefly on a flat floor.'
      },
      {
        id: 'ex-10-worlds-greatest',
        name: "World's Greatest Stretch & Pass-Throughs",
        modality: 'mobility',
        motionType: 'mobility_flow',
        effort: 'RPE 3–4 · 5–8 min flow',
        frequency: 'Daily / pre-sport',
        summary: 'A dynamic lunge-and-rotate flow paired with band shoulder pass-throughs.',
        whyThisAge:
          'Tight hip flexors and stiff upper backs emerge quickly during growth spurts and long school days; dynamic mobility keeps every joint gliding freely.',
        bodyImpact: {
          headline: 'Lubricates hips, thoracic spine, hamstrings & shoulders in one flow',
          systems: ['joints', 'neuromuscular'],
          zones: ['spine', 'hips_femur', 'shoulders', 'hamstrings'],
          mechanisms: [
            { system: 'joints', text: 'Circulates synovial fluid through hip sockets, spine, and shoulder capsules.' },
            { system: 'neuromuscular', text: 'Primes active end-range control prior to jumping or sprinting.' }
          ]
        },
        steps: [
          { phase: 'Lunge', cue: 'Step into a long runner’s lunge with back knee lifted and hands inside front foot.' },
          { phase: 'Rotate', cue: 'Drop inside elbow toward the floor, then sweep that arm skyward while watching your hand.' },
          { phase: 'Extend', cue: 'Shift hips gently back to lengthen the front hamstring, then switch sides.' }
        ],
        easier: 'Rest the back knee comfortably on a folded mat during the rotation.',
        harder: 'Flow smoothly without resting hands between lunges and add overhead dowel pass-throughs.'
      }
    ]
  },

  {
    id: '17-28',
    label: '17–28',
    minAge: 17,
    maxAge: 28,
    stageNum: '02',
    title: 'Athletic Prime & Peak Output',
    eyebrow: 'Stage 02 · Ages 17 to 28',
    tagline: 'Raise your physiological ceiling—VO₂max, power, and peak structural reserve.',
    imageBase: 'assets/images/group-17-28',
    imageAlt:
      'Editorial illustration of young adult athletes executing an explosive box jump and high-speed sprint interval with kinetic waves',
    physiologyOverview:
      'Recovery hormones, tendon elasticity, and cardiovascular adaptability peak during late teens through the late 20s. This is the ideal window for structured HIIT, explosive plyometrics, and progressive compound strength to build the highest possible lifetime reserve.',
    weeklyRhythm: '3–4×/wk progressive strength & power · 1–2×/wk HIIT · 2×/wk Zone 2 base',
    effortTarget: 'RPE 7–9 · High Output + Smart Recovery',
    focusBullets: [
      'High-intensity interval training (HIIT) to push peak VO₂max and stroke volume',
      'Heavy compound lifting (squats, deadlifts, presses, pulls) to maximize peak lean mass & bone density',
      'Explosive plyometrics and rotational power while fast-twitch adaptability is highest'
    ],
    guardrails: [
      'Cap true all-out HIIT to 1–2 sessions/week—more breaks down recovery without extra VO₂max gain',
      'Pair heavy training with 7–9 hours of sleep and Zone 2 aerobic base work'
    ],
    mix: {
      strength: { score: 96, status: 'core', note: 'Progressive heavy compounds & hypertrophy' },
      power: { score: 92, status: 'core', note: 'Box jumps, sprints & rotational power' },
      hiit: { score: 90, status: 'core', note: 'Peak VO₂max intervals & anaerobic drive' },
      aerobic: { score: 80, status: 'high', note: 'Zone 2 engine for rapid session recovery' },
      balance: { score: 62, status: 'moderate', note: 'Unilateral athletic cutting & knee control' },
      mobility: { score: 65, status: 'moderate', note: 'Deep squat, overhead & ankle range' }
    },
    exercises: [
      {
        id: 'ex-17-hiit-4x4',
        name: '4×4 Norwegian or Sprint Intervals',
        modality: 'hiit',
        motionType: 'sprint_hiit',
        effort: 'RPE 8.5–9 · 85–95% Max HR',
        frequency: '1–2× / week',
        summary: 'Four crisp 4-minute hard aerobic intervals (or 30-sec sprints) separated by active recovery.',
        whyThisAge:
          'Young adult hearts remodel rapidly under high cardiac output. Driving near-maximal heart rate safely elevates VO₂max—the strongest long-term cardiovascular ceiling you can build.',
        bodyImpact: {
          headline: 'Expands cardiac stroke volume, VO₂max & mitochondrial output',
          systems: ['cardiovascular', 'muscular'],
          zones: ['heart_lungs', 'quads', 'hamstrings', 'calves'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Stretches left-ventricular filling capacity so the heart pumps more blood per beat.' },
            { system: 'muscular', text: 'Triggers rapid mitochondrial biogenesis and lactate-clearing enzymes in leg fibers.' }
          ]
        },
        steps: [
          { phase: 'Ramp', cue: 'Warm up 10 minutes progressively on track, rower, or assault bike.' },
          { phase: 'Drive', cue: 'Hold a hard, sustainable pace for 4 minutes (or 30s all-out sprint) with tall posture.' },
          { phase: 'Recover', cue: 'Keep moving gently for 3 minutes until breathing steadies before repeating 4 rounds.' }
        ],
        easier: 'Start with 4 × 2-minute intervals on a stationary bike or incline treadmill.',
        harder: 'Progress to true 4 × 4-minute hill runs or track repeats with 3-minute active jog recovery.'
      },
      {
        id: 'ex-17-barbell-compound',
        name: 'Barbell Squat & Deadlift Variations',
        modality: 'strength',
        motionType: 'hinge',
        effort: 'RPE 7.5–8.5 · 4 × 5–8 reps',
        frequency: '2× / week',
        summary: 'Progressive multi-joint lower-body lifts that forge maximal strength and skeletal reserve.',
        whyThisAge:
          'Peak bone mineral density locks in during the 20s. Progressive axial loading through squats and deadlifts builds dense trabecular bone and high-force muscle tissue.',
        bodyImpact: {
          headline: 'Maximizes full-body lean mass, spinal bone density & force output',
          systems: ['muscular', 'skeletal', 'joints'],
          zones: ['quads', 'glutes', 'hamstrings', 'back', 'core', 'spine', 'hips_femur'],
          mechanisms: [
            { system: 'muscular', text: 'Recruits high-threshold motor units across glutes, quads, hamstrings, and erectors.' },
            { system: 'skeletal', text: 'Axial compression strengthens lumbar vertebrae and femoral neck density.' },
            { system: 'joints', text: 'Gradual progressive overload thickens knee and hip tendons.' }
          ]
        },
        steps: [
          { phase: 'Brace', cue: 'Inhale 360° into your midsection, lock lats down, and grip floor with tripod feet.' },
          { phase: 'Load', cue: 'Hinge hips back (deadlift) or descend smoothly (squat) keeping bar centered over midfoot.' },
          { phase: 'Lockout', cue: 'Drive feet firmly through the floor to stand tall without hyperextending the lower back.' }
        ],
        easier: 'Use a trap bar or goblet squat to keep the torso more upright while mastering bracing.',
        harder: 'Add paused reps (2 seconds below parallel) or structured linear progression.'
      },
      {
        id: 'ex-17-box-medball',
        name: 'Box Jumps & Rotational Med-Ball Slams',
        modality: 'power',
        motionType: 'jump_land',
        effort: 'RPE 7–8 · 4 × 5 explosive reps',
        frequency: '2× / week',
        summary: 'High-velocity jumps and full-body rotational slams executed fresh at the start of a workout.',
        whyThisAge:
          'Elastic tendons and fast-twitch Type II fibers respond electric-fast in your late teens and 20s—building speed, athleticism, and reactive force absorption.',
        bodyImpact: {
          headline: 'Trains Type II fast-twitch fibers & elastic tendon recoil',
          systems: ['neuromuscular', 'muscular', 'skeletal'],
          zones: ['quads', 'glutes', 'calves', 'core', 'shoulders', 'ankles_feet'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Accelerates motor-unit firing rate for faster rate of force development.' },
            { system: 'muscular', text: 'Develops explosive triple extension (ankles, knees, hips) and rotational core snap.' },
            { system: 'skeletal', text: 'Delivers dynamic loading pulses that reinforce bone architecture.' }
          ]
        },
        steps: [
          { phase: 'Countermove', cue: 'Dip swiftly into an athletic stance while swinging arms cleanly behind hips.' },
          { phase: 'Explode', cue: 'Drive hips up and forward onto a knee-high box, landing quietly in a half-squat.' },
          { phase: 'Reset', cue: 'Always step down one foot at a time to spare Achilles tendons; rest 60–90s between sets.' }
        ],
        easier: 'Jump onto a low 12–16 inch sturdy step or perform standing broad jumps on turf.',
        harder: 'Pair seated box jumps with explosive rotational wall throws.'
      },
      {
        id: 'ex-17-pullup-ohp',
        name: 'Pull-Ups & Overhead Press',
        modality: 'strength',
        motionType: 'pull',
        effort: 'RPE 7.5–8.5 · 3–4 × 6–10 reps',
        frequency: '2× / week',
        summary: 'Vertical pulling and overhead pressing for complete upper-body armor and shoulder health.',
        whyThisAge:
          'Balancing heavy pushing with strict vertical pulling builds resilient rotator cuffs, strong grip, and an athletic upper-back chassis.',
        bodyImpact: {
          headline: 'Builds balanced upper-body strength, grip & overhead stability',
          systems: ['muscular', 'joints', 'skeletal'],
          zones: ['back', 'shoulders', 'chest', 'grip', 'core', 'spine'],
          mechanisms: [
            { system: 'muscular', text: 'Develops lats, deltoids, triceps, forearm flexors, and deep core stabilizers.' },
            { system: 'joints', text: 'Full-range scapular upward rotation keeps shoulder mechanics pain-free.' }
          ]
        },
        steps: [
          { phase: 'Set', cue: 'Hang with active shoulders (pulling blades gently down) or rack dumbbells at collarbone.' },
          { phase: 'Move', cue: 'Pull chest cleanly toward the bar—or press straight overhead while keeping ribs stacked.' },
          { phase: 'Lower', cue: 'Control the descent smoothly for 2–3 seconds to maximize tendon and muscle adaptation.' }
        ],
        easier: 'Use band-assisted pull-ups or ring rows paired with seated dumbbell presses.',
        harder: 'Add weight via dip belt or transition to single-arm standing kettlebell presses.'
      },
      {
        id: 'ex-17-zone2',
        name: 'Zone 2 Endurance Run, Row, or Ride',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4–5 · 65–75% Max HR · 45 min',
        frequency: '2× / week',
        summary: 'Steady conversational endurance that quietly powers faster recovery between intense sessions.',
        whyThisAge:
          'Many young athletes train exclusively in the exhausting "gray zone." True Zone 2 builds capillary density and parasympathetic recovery without burning out the nervous system.',
        bodyImpact: {
          headline: 'Deepens aerobic efficiency, resting heart rate & fat oxidation',
          systems: ['cardiovascular', 'muscular'],
          zones: ['heart_lungs', 'quads', 'calves', 'hamstrings'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Lowers resting heart rate and improves heart-rate variability (HRV).' },
            { system: 'muscular', text: 'Multiplies slow-twitch mitochondria to clear fatigue byproducts faster.' }
          ]
        },
        steps: [
          { phase: 'Settle', cue: 'Ease into a smooth rhythm where you can speak in complete sentences.' },
          { phase: 'Sustain', cue: 'Hold nasal-friendly breathing for 35–50 steady minutes without chasing pace spikes.' },
          { phase: 'Unwind', cue: 'Taper to an easy 5-minute walk and hydrate.' }
        ],
        easier: 'Start with 25–30 minutes of brisk cycling or flat trail jogging.',
        harder: 'Extend to 60 minutes while holding heart rate strictly inside Zone 2.'
      },
      {
        id: 'ex-17-bss-flow',
        name: 'Bulgarian Split Squat & Deep Hip/Ankle Flow',
        modality: 'balance',
        motionType: 'step_up',
        effort: 'RPE 7–8 · 3 × 8–10 / leg',
        frequency: '2× / week',
        summary: 'Rear-foot-elevated unilateral squats paired with weighted ankle and hip-opener drills.',
        whyThisAge:
          'Single-leg strength exposes hidden side-to-side asymmetries before they become sports injuries while dynamically loading hip stability under full balance demand.',
        bodyImpact: {
          headline: 'Bulletproofs single-leg stability, hip stabilizers & knee tracking',
          systems: ['muscular', 'neuromuscular', 'joints'],
          zones: ['quads', 'glutes', 'hips_femur', 'ankles_feet', 'proprioceptors'],
          mechanisms: [
            { system: 'muscular', text: 'Challenges glute medius and quads deeply with far less spinal load than back squats.' },
            { system: 'neuromuscular', text: 'Improves single-leg pelvic stability during running and sudden direction changes.' },
            { system: 'joints', text: 'Actively stretches the trailing hip flexor while building front-ankle dorsiflexion.' }
          ]
        },
        steps: [
          { phase: 'Align', cue: 'Place back laces lightly on a low bench; hop front foot out to a balanced stance.' },
          { phase: 'Descend', cue: 'Drop back knee straight down with a slight athletic forward torso lean.' },
          { phase: 'Drive', cue: 'Push strongly through the front heel and midfoot to return smoothly to tall stance.' }
        ],
        easier: 'Keep both feet on the floor in a standard split squat using bodyweight only.',
        harder: 'Hold dumbbells in each hand and pause 1 second at the bottom.'
      }
    ]
  },

  {
    id: '25-39',
    label: '25–39',
    minAge: 25,
    maxAge: 39,
    stageNum: '03',
    title: 'Strength & Metabolic Resilience',
    eyebrow: 'Stage 03 · Ages 25 to 39',
    tagline: 'Lock in lean muscle, metabolic vigor, and desk-proof posture on a busy schedule.',
    imageBase: 'assets/images/group-25-39',
    imageAlt:
      'Editorial illustration of adults in their 30s performing a dynamic kettlebell swing and barbell deadlift over rhythmic wave bands',
    physiologyOverview:
      'Career demands, family schedules, and sitting hours accelerate right as natural recovery begins to require more intention. High-return compound strength, Zone 2 endurance, threshold conditioning, and spinal/thoracic mobility keep your metabolic engine humming.',
    weeklyRhythm: '3×/wk compound strength · 2×/wk Zone 2 · 1×/wk threshold intervals · daily desk mobility',
    effortTarget: 'RPE 7–8.5 · High Return per Minute',
    focusBullets: [
      'Posterior-chain compound lifts (trap-bar/Romanian deadlifts) to reverse prolonged sitting',
      'Time-efficient Zone 2 + low-impact threshold intervals for insulin sensitivity and stress buffering',
      'Daily thoracic rotation and anti-rotation core work to protect neck, shoulders, and lower back'
    ],
    guardrails: [
      'Avoid "weekend warrior" spikes—consistent 35–45 min sessions beat erratic 2-hour marathons',
      'Always spend 5 minutes warming hips and upper back before heavy lifting after desk work'
    ],
    mix: {
      strength: { score: 94, status: 'core', note: 'Time-efficient hypertrophy & posterior chain' },
      power: { score: 70, status: 'high', note: 'Kettlebell hip snap & crisp speed work' },
      hiit: { score: 78, status: 'high', note: 'Threshold intervals on bike, row, or hills' },
      aerobic: { score: 88, status: 'core', note: 'Zone 2 insulin sensitivity & stress recovery' },
      balance: { score: 58, status: 'moderate', note: 'Unilateral control & anti-rotation core' },
      mobility: { score: 80, status: 'high', note: 'Undoing desk posture in hips & mid-back' }
    },
    exercises: [
      {
        id: 'ex-25-trap-rdl',
        name: 'Trap-Bar or Romanian Deadlift',
        modality: 'strength',
        motionType: 'hinge',
        effort: 'RPE 7.5–8 · 3–4 × 6–10 reps',
        frequency: '2× / week',
        summary: 'Joint-friendly hip-hinge strength that awakens dormant glutes and strengthens the entire back.',
        whyThisAge:
          'Sitting 8+ hours a day switches off glutes and strains the lower spine. The trap-bar or Romanian deadlift delivers maximal posterior muscle stimulus with friendly lower-back leverage.',
        bodyImpact: {
          headline: 'Strengthens glutes, hamstrings, grip & lumbar resilience',
          systems: ['muscular', 'skeletal', 'joints'],
          zones: ['glutes', 'hamstrings', 'back', 'grip', 'spine', 'hips_femur'],
          mechanisms: [
            { system: 'muscular', text: 'Preserves large metabolically active muscle mass that keeps resting insulin sensitivity high.' },
            { system: 'skeletal', text: 'Loads the hips and spine directly to maintain peak bone density.' },
            { system: 'joints', text: 'Eccentric hamstring loading strengthens hip and knee tendons.' }
          ]
        },
        steps: [
          { phase: 'Set', cue: 'Stand inside trap bar (or hold dumbbells at thighs) with soft knees and proud chest.' },
          { phase: 'Hinge', cue: 'Push hips straight back as if closing a car door behind you until hamstrings feel taut.' },
          { phase: 'Drive', cue: 'Squeeze glutes forward to stand tall, stacking ribs smoothly over pelvis.' }
        ],
        easier: 'Use moderate dumbbells for Romanian deadlifts to mid-shin height.',
        harder: 'Slow the lowering phase to 3 seconds or progress load steadily on the trap bar.'
      },
      {
        id: 'ex-25-incline-row',
        name: 'Incline Dumbbell Press & Single-Arm Row',
        modality: 'strength',
        motionType: 'push',
        effort: 'RPE 7.5–8 · 3 × 8–12 reps',
        frequency: '2× / week',
        summary: 'Paired push-pull superset that builds upper-body lean muscle while pulling rounded shoulders back.',
        whyThisAge:
          'Supersets cut gym time nearly in half while ensuring every pushing set is counterbalanced by heavy rowing to prevent desk-induced shoulder impingement.',
        bodyImpact: {
          headline: 'Builds upper-body lean mass & counteracts rounded posture',
          systems: ['muscular', 'joints'],
          zones: ['chest', 'back', 'shoulders', 'core', 'grip'],
          mechanisms: [
            { system: 'muscular', text: 'Stimulates balanced hypertrophy across pecs, lats, mid-back, and arms.' },
            { system: 'joints', text: 'Dumbbells allow each shoulder to track its natural anatomical arc.' }
          ]
        },
        steps: [
          { phase: 'Press', cue: 'Set bench to 30°; lower dumbbells with elbows ~45° from torso and press cleanly up.' },
          { phase: 'Brace', cue: 'Immediately support one hand on the bench with a flat spine for single-arm rows.' },
          { phase: 'Row', cue: 'Pull the dumbbell smoothly toward your back hip pocket, pausing 1 second at the top.' }
        ],
        easier: 'Use lighter dumbbells with slow, controlled 12-rep sets.',
        harder: 'Hold a 2-second squeeze at peak contraction on rows and add a slight tempo on presses.'
      },
      {
        id: 'ex-25-threshold-hiit',
        name: 'Threshold Intervals (Bike, Row, or Hills)',
        modality: 'hiit',
        motionType: 'sprint_hiit',
        effort: 'RPE 8–8.5 · 6 × 2 min hard',
        frequency: '1× / week',
        summary: 'Controlled high-output intervals on low-impact ergs or hills to keep VO₂max sharp.',
        whyThisAge:
          'Switching high-intensity work from flat concrete pounding to cycling, rowing, or uphill intervals preserves top-end cardiovascular fitness while sparing knees and shins.',
        bodyImpact: {
          headline: 'Protects VO₂max, cardiac output & vascular flexibility',
          systems: ['cardiovascular', 'muscular'],
          zones: ['heart_lungs', 'quads', 'hamstrings', 'back'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Maintains high stroke volume and arterial dilation under load.' },
            { system: 'muscular', text: 'Improves glucose uptake directly into working skeletal muscle.' }
          ]
        },
        steps: [
          { phase: 'Warm', cue: 'Build rhythm smoothly for 6–8 minutes before the first hard interval.' },
          { phase: 'Push', cue: 'Drive at a challenging 8/10 pace for 2 minutes—focused breathing, zero form collapse.' },
          { phase: 'Flush', cue: 'Spin or walk easily for 90 seconds between efforts; repeat 5–6 rounds.' }
        ],
        easier: 'Perform 5 × 1-minute brisk surges with 2 minutes easy spinning.',
        harder: 'Progress to 5 × 3-minute uphill or rower intervals at threshold effort.'
      },
      {
        id: 'ex-25-kb-swing',
        name: 'Kettlebell Swings',
        modality: 'power',
        motionType: 'swing',
        effort: 'RPE 7–8 · 5 × 12–15 crisp reps',
        frequency: '1–2× / week',
        summary: 'Crisp ballistic hip-hinge power that trains fast-twitch glutes and cardiovascular drive in 10 minutes.',
        whyThisAge:
          'Fast-twitch fibers start quietly tapering in your 30s if untrained. Swings deliver explosive posterior power with zero jumping impact on joints.',
        bodyImpact: {
          headline: 'Preserves explosive hip power, grip & aerobic-anaerobic conditioning',
          systems: ['muscular', 'cardiovascular', 'neuromuscular'],
          zones: ['glutes', 'hamstrings', 'core', 'back', 'grip', 'heart_lungs'],
          mechanisms: [
            { system: 'muscular', text: 'Recruits fast-twitch glute and hamstring fibers via rapid hip extension.' },
            { system: 'cardiovascular', text: 'Elevates heart rate briskly through whole-body rhythmic contractions.' },
            { system: 'neuromuscular', text: 'Sharpens rapid brace-and-relax core timing.' }
          ]
        },
        steps: [
          { phase: 'Hike', cue: 'Start bell a foot ahead of toes; hike it high between upper thighs with flat back.' },
          { phase: 'Snap', cue: 'Drive hips sharply forward into a standing plank—arms act only as relaxed ropes.' },
          { phase: 'Float', cue: 'Let bell float weightlessly to chest height, then wait until forearms touch hips to hinge.' }
        ],
        easier: 'Practice dead-stop single swings (setting bell down between reps) to master the hinge.',
        harder: 'Perform alternating single-arm swings for extra anti-rotation core demand.'
      },
      {
        id: 'ex-25-zone2-cardio',
        name: '40-Minute Zone 2 Steady Cardio',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4–5 · Conversational pace',
        frequency: '2× / week',
        summary: 'Uninterrupted running, cycling, swimming, or incline walking at a calm, rhythmic pace.',
        whyThisAge:
          'Zone 2 is an antidote to high-stress modern life: it trains metabolic flexibility (fat & glucose burning) while calming elevated cortisol rather than adding to it.',
        bodyImpact: {
          headline: 'Enhances mitochondrial health, blood sugar regulation & stress resilience',
          systems: ['cardiovascular', 'neuromuscular'],
          zones: ['heart_lungs', 'quads', 'calves', 'brain_vestibular'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Expands capillary network and improves baseline aerobic fat oxidation.' },
            { system: 'neuromuscular', text: 'Shifts autonomic balance toward restorative parasympathetic tone.' }
          ]
        },
        steps: [
          { phase: 'Settle', cue: 'Pick a joint-friendly modality—run, swim, cycle, or brisk incline walk.' },
          { phase: 'Cruise', cue: 'Maintain an easy effort where talking in full sentences feels comfortable.' },
          { phase: 'Finish', cue: 'Step down gradually for 3–5 minutes so heart rate drops cleanly.' }
        ],
        easier: 'Start with 25–30 minutes of brisk outdoor walking or stationary cycling.',
        harder: 'Build to 50–60 minutes on rolling hills or tempo-free trail runs.'
      },
      {
        id: 'ex-25-thoracic-pallof',
        name: 'Thoracic Open-Book & Pallof Press',
        modality: 'mobility',
        motionType: 'mobility_flow',
        effort: 'RPE 4–6 · 3 × 8–10 / side',
        frequency: '3–5× / week',
        summary: 'Side-lying mid-back rotation paired with band anti-rotation core presses.',
        whyThisAge:
          'When the thoracic spine stiffens from laptop work, the lower back and shoulders take the hit. Restoring upper-back rotation + deep core bracing eliminates most 30s aches.',
        bodyImpact: {
          headline: 'Restores thoracic rotation & deep spinal stabilization',
          systems: ['joints', 'muscular', 'neuromuscular'],
          zones: ['spine', 'core', 'shoulders', 'hips_femur'],
          mechanisms: [
            { system: 'joints', text: 'Frees stiff mid-back segments so shoulders move overhead without pinching.' },
            { system: 'muscular', text: 'Strengthens obliques and transverse abdominis to shield lumbar discs.' }
          ]
        },
        steps: [
          { phase: 'Rotate', cue: 'Lie on side with top knee pinned on a foam roller; open top arm wide while exhaling.' },
          { phase: 'Anchor', cue: 'Stand sideways to a chest-height resistance band, gripping handle tightly at sternum.' },
          { phase: 'Resist', cue: 'Press hands straight forward and hold 2 seconds without letting the band twist your torso.' }
        ],
        easier: 'Use a lighter band and wider stance for extra stability during Pallof presses.',
        harder: 'Perform Pallof presses in a half-kneeling stance or draw slow circles with extended arms.'
      }
    ]
  },

  {
    id: '38-52',
    label: '38–52',
    minAge: 38,
    maxAge: 52,
    stageNum: '04',
    title: 'Longevity Pivot & Joint Preservation',
    eyebrow: 'Stage 04 · Ages 38 to 52',
    tagline: 'Outsmart early sarcopenia, fortify tendons, and build an unshakeable longevity base.',
    imageBase: 'assets/images/group-38-52',
    imageAlt:
      'Editorial illustration of mid-40s adults performing an upright heavy farmer carry and controlled goblet squat framed by arches',
    physiologyOverview:
      'Without deliberate strength training, adults lose 3–8% of muscle mass per decade starting in their late 30s and 40s, alongside shifting hormones and stiffer tendons. Controlled tempo lifting, heavy grip carries, non-impact power, and Zone 2 rucking flip the trajectory.',
    weeklyRhythm: '3×/wk tempo strength · 2–3×/wk Zone 2 (ruck/bike/incline) · 1×/wk short low-impact sprints · daily hip mobility',
    effortTarget: 'RPE 7–8 · Crisp Tempo, Zero Ego Lifting',
    focusBullets: [
      'Slow 3-second lowering tempos to thicken tendons and stimulate muscle with safer loads',
      'Loaded carries to build grip strength—one of the strongest clinical biomarkers of longevity',
      'Low-impact power (med-ball throws) and Zone 2 rucking/cycling to protect knees and bone density'
    ],
    guardrails: [
      'Respect longer tendon recovery (48h between hard lower-body sessions)',
      'Trade high-impact repetitive plyometrics for medicine-ball power and crisp bike/rower sprints'
    ],
    mix: {
      strength: { score: 96, status: 'core', note: 'Tempo resistance & grip carries vs. sarcopenia' },
      power: { score: 72, status: 'high', note: 'Low-impact med-ball throws & slams' },
      hiit: { score: 42, status: 'adapt', note: 'Short low-impact bike/rower sprints only' },
      aerobic: { score: 90, status: 'core', note: 'Zone 2 incline walking, rucking & cycling' },
      balance: { score: 68, status: 'high', note: 'Single-leg hinges & loaded symmetry' },
      mobility: { score: 86, status: 'core', note: 'Hip capsule rotation & tendon elasticity' }
    },
    exercises: [
      {
        id: 'ex-38-tempo-goblet',
        name: 'Tempo Goblet or Front Squat',
        modality: 'strength',
        motionType: 'squat',
        effort: 'RPE 7.5 · 3 × 8–10 (3s lower)',
        frequency: '2× / week',
        summary: 'Front-loaded squats with a deliberate 3-second descent that build dense legs while sparing the back.',
        whyThisAge:
          'Slow eccentric loading stimulates collagen remodeling inside patellar and quad tendons while delivering robust anti-sarcopenia hypertrophy with manageable spinal load.',
        bodyImpact: {
          headline: 'Remodels knee tendons, preserves lean leg mass & strengthens core',
          systems: ['muscular', 'joints', 'skeletal'],
          zones: ['quads', 'glutes', 'core', 'hips_femur', 'spine'],
          mechanisms: [
            { system: 'muscular', text: 'Counters 40s muscle-mass drift with high time-under-tension.' },
            { system: 'joints', text: '3-second lowering strengthens tendon fibers and improves knee-joint stability.' },
            { system: 'skeletal', text: 'Axial front load keeps hip and thoracic spine bone mineral density strong.' }
          ]
        },
        steps: [
          { phase: 'Hold', cue: 'Cup a heavy dumbbell or kettlebell tight to sternum with elbows tucked down.' },
          { phase: 'Tempo Lower', cue: 'Count "one-thousand-one, two, three" as hips sink between knees with upright chest.' },
          { phase: 'Rise', cue: 'Pause briefly at the bottom without bouncing, then stand smoothly and briskly.' }
        ],
        easier: 'Elevate heels slightly on thin plates and squat to a chair-height target.',
        harder: 'Progress to dual kettlebell front-rack squats with a 2-second bottom pause.'
      },
      {
        id: 'ex-38-farmers-carry',
        name: "Heavy Farmer's & Suitcase Carries",
        modality: 'strength',
        motionType: 'carry',
        effort: 'RPE 7.5–8 · 4 × 30–40m walks',
        frequency: '2–3× / week',
        summary: 'Tall, purposeful loaded walks carrying heavy dumbbells in both hands or one hand at a time.',
        whyThisAge:
          'Grip strength correlates powerfully with lifelong healthspan and cardiovascular resilience. Carries train grip, lateral core, shoulders, and hip stability all at once.',
        bodyImpact: {
          headline: 'Fortifies grip strength, lateral core & axial bone loading',
          systems: ['muscular', 'skeletal', 'neuromuscular'],
          zones: ['grip', 'core', 'shoulders', 'back', 'glutes', 'spine', 'hips_femur'],
          mechanisms: [
            { system: 'muscular', text: 'Builds crushing forearm/grip endurance, upper-back traps, and deep obliques.' },
            { system: 'skeletal', text: 'Walking under vertical load sends bone-strengthening signals through hips and spine.' },
            { system: 'neuromuscular', text: 'Single-arm suitcase carries force every step to stabilize against side-bending.' }
          ]
        },
        steps: [
          { phase: 'Hinge Pick', cue: 'Lift weights cleanly with a flat back; pack shoulders gently down and back.' },
          { phase: 'Stride Tall', cue: 'Walk briskly with smooth, quiet steps—imagine a glass of water balanced on your crown.' },
          { phase: 'Set Down', cue: 'Maintain core brace until weights are safely lowered via a controlled hinge.' }
        ],
        easier: 'Use moderate dumbbells for 20-meter walks with 60 seconds rest.',
        harder: 'Carry a single heavy kettlebell on one side only (suitcase carry) without leaning.'
      },
      {
        id: 'ex-38-medball-power',
        name: 'Medicine Ball Chest Pass & Overhead Slam',
        modality: 'power',
        motionType: 'medball',
        effort: 'RPE 7 · 4 × 6–8 crisp reps',
        frequency: '1–2× / week',
        summary: 'Explosive non-impact throws that keep fast-twitch athleticism sharp without pounding joints.',
        whyThisAge:
          'You don’t need risky high box jumps in your 40s to retain speed and power. Medicine ball throws fire Type II fibers safely with virtually zero eccentric joint soreness.',
        bodyImpact: {
          headline: 'Retains fast-twitch power fibers without knee or ankle impact',
          systems: ['neuromuscular', 'muscular'],
          zones: ['core', 'chest', 'shoulders', 'back', 'glutes'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Keeps high-velocity neural drive humming across core and upper limbs.' },
            { system: 'muscular', text: 'Integrates leg drive, trunk snap, and arm velocity into one fluid wave.' }
          ]
        },
        steps: [
          { phase: 'Extend', cue: 'Rise tall onto balls of feet lifting a 6–12 lb non-bouncing slam ball overhead.' },
          { phase: 'Snap', cue: 'Drive hips back and whip arms down, slamming the ball firmly into the floor.' },
          { phase: 'Reset', cue: 'Catch or pick up cleanly with bent knees; keep every single rep snappy, not fatigued.' }
        ],
        easier: 'Use a lighter 4–6 lb ball for controlled wall chest passes.',
        harder: 'Add rotational scoop tosses into a concrete wall from a staggered athletic stance.'
      },
      {
        id: 'ex-38-zone2-ruck',
        name: 'Zone 2 Rucking, Incline Walking, or Cycling',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4–5 · 40–50 min steady',
        frequency: '2–3× / week',
        summary: 'Brisk walking with a modest weighted pack (10–20 lb), uphill walking, or smooth cycling.',
        whyThisAge:
          'Rucking merges Zone 2 cardiovascular longevity with gentle bone-loading resistance—building heart health, posture, and calorie burn with a fraction of running’s impact.',
        bodyImpact: {
          headline: 'Strengthens heart compliance, bone density & joint-friendly endurance',
          systems: ['cardiovascular', 'skeletal', 'muscular'],
          zones: ['heart_lungs', 'hips_femur', 'spine', 'glutes', 'calves'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Boosts mitochondrial efficiency and keeps blood vessels supple.' },
            { system: 'skeletal', text: 'Modest backpack load adds osteogenic stimulus to hips and lumbar vertebrae.' }
          ]
        },
        steps: [
          { phase: 'Fit', cue: 'Snug a comfortable backpack high between shoulder blades (start with 10% bodyweight or less).' },
          { phase: 'March', cue: 'Walk briskly at a smooth conversational breath rhythm for 35–50 minutes.' },
          { phase: 'Posture', cue: 'Keep gaze ahead and ribs stacked rather than leaning forward under the pack.' }
        ],
        easier: 'Walk briskly without a pack on a 4–6% treadmill incline or neighborhood hills.',
        harder: 'Gradually add undulating trails or up to 15% bodyweight once posture feels effortless.'
      },
      {
        id: 'ex-38-bike-sprints',
        name: 'Short Low-Impact Bike or Rower Sprints',
        modality: 'hiit',
        motionType: 'sprint_hiit',
        effort: 'RPE 8.5 · 6 × 20–30s / 90s rest',
        frequency: '1× / week',
        summary: 'Brief, crisp low-impact bursts followed by full easy spinning to keep top-end VO₂max alive.',
        whyThisAge:
          'VO₂max naturally declines ~10% per decade if never challenged. Short, well-rested ergometer sprints preserve cardiac reserve without spiking joint inflammation or cortisol.',
        bodyImpact: {
          headline: 'Defends VO₂max ceiling with near-zero joint impact',
          systems: ['cardiovascular', 'muscular'],
          zones: ['heart_lungs', 'quads', 'hamstrings'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Delivers a targeted high-output signal to sustain peak oxygen uptake.' },
            { system: 'muscular', text: 'Recruits fast-twitch lower-body fibers cleanly against smooth flywheel resistance.' }
          ]
        },
        steps: [
          { phase: 'Warm', cue: 'Spin easily for 8 minutes including two gentle 10-second accelerations.' },
          { phase: 'Surge', cue: 'Push firmly for 20–30 seconds—strong, smooth cadence without flailing.' },
          { phase: 'Recover', cue: 'Pedal very lightly for 90–120 seconds until breath returns to calm before next rep.' }
        ],
        easier: 'Start with 4 × 15-second brisk pickups at RPE 7.5.',
        harder: 'Build to 8 × 30-second hard intervals with 90-second easy recovery.'
      },
      {
        id: 'ex-38-9090-slrdl',
        name: 'Single-Leg RDL & 90/90 Hip Switches',
        modality: 'mobility',
        motionType: 'mobility_flow',
        effort: 'RPE 5–7 · 3 × 8 / side',
        frequency: '2–3× / week',
        summary: 'Seated 90/90 hip-capsule rotations paired with balanced single-leg hinges.',
        whyThisAge:
          'Loss of internal hip rotation quietly triggers midlife back and knee discomfort. Pairing active hip rotation with single-leg hinging keeps both mobility and stability sharp.',
        bodyImpact: {
          headline: 'Preserves hip-socket rotation, hamstring tendon health & balance',
          systems: ['joints', 'neuromuscular', 'muscular'],
          zones: ['hips_femur', 'hamstrings', 'glutes', 'ankles_feet', 'proprioceptors'],
          mechanisms: [
            { system: 'joints', text: 'Nourishes hip-joint cartilage through both internal and external rotation.' },
            { system: 'neuromuscular', text: 'Links ankle balance, hip control, and hamstring length in one movement.' }
          ]
        },
        steps: [
          { phase: 'Rotate', cue: 'Sit tall with both knees bent at 90°; smoothly windshield-wiper legs side to side.' },
          { phase: 'Balance', cue: 'Stand tall on one slightly softened knee holding a light dumbbell in the opposite hand.' },
          { phase: 'Hinge', cue: 'Sweep the back leg straight behind as torso tips level, then drive hips back upright.' }
        ],
        easier: 'Keep the back toes lightly touching the floor in a kickstand stance during the hinge.',
        harder: 'Transition smoothly through 90/90 switches hands-free before performing weighted single-leg RDLs.'
      }
    ]
  },

  {
    id: '50-65',
    label: '50–65',
    minAge: 50,
    maxAge: 65,
    stageNum: '05',
    title: 'Vitality, Bone & Power Protection',
    eyebrow: 'Stage 05 · Ages 50 to 65',
    tagline: 'Defend bone mineral density, fast-twitch power, and vestibular sharpness.',
    imageBase: 'assets/images/group-50-65',
    imageAlt:
      'Editorial illustration of fit adults in their late 50s doing weighted step-ups and composed single-leg balance amid golden solar arcs',
    physiologyOverview:
      'Between 50 and 65, power (force × speed) declines nearly twice as fast as raw strength, and hormonal shifts accelerate bone thinning (osteopenia). Targeted single-leg loading, safe osteogenic heel drops, upper-back armor, and vestibular balance work pay huge dividends.',
    weeklyRhythm: '2–3×/wk strength & bone power · 3–4×/wk Zone 2 cardio · daily 5-min balance & mobility',
    effortTarget: 'RPE 6.5–8 · Strong, Controlled, Brisk Intent',
    focusBullets: [
      'Direct hip and femur loading (step-ups, split squats) to protect against osteopenia',
      'Safe bone-loading bursts (heel drops or fast-concentric stands) to keep fast-twitch fibers alive',
      'Vestibular balance drills (head turns on one leg) before balance subtly erodes'
    ],
    guardrails: [
      'Prioritize crisp joint alignment over chasing ego maxes; leave 2–3 solid reps in reserve',
      'If cleared for intervals, keep them low-impact (cycling, swimming, brisk uphill walking)'
    ],
    mix: {
      strength: { score: 94, status: 'core', note: 'Hip/spine bone loading & postural upper back' },
      power: { score: 74, status: 'high', note: 'Heel drops & brisk-up controlled stands' },
      hiit: { score: 30, status: 'adapt', note: 'Optional gentle uphill or bike surges' },
      aerobic: { score: 90, status: 'core', note: 'Brisk walking, swimming & vascular Zone 2' },
      balance: { score: 86, status: 'core', note: 'Single-leg & inner-ear vestibular drills' },
      mobility: { score: 86, status: 'core', note: 'Ankle dorsiflexion & thoracic extension' }
    },
    exercises: [
      {
        id: 'ex-50-stepup-split',
        name: 'Dumbbell Step-Ups & Supported Split Squats',
        modality: 'strength',
        motionType: 'step_up',
        effort: 'RPE 7–7.5 · 3 × 8–10 / leg',
        frequency: '2–3× / week',
        summary: 'Controlled step-ups onto a sturdy platform that load the hip joint and mimic real stair power.',
        whyThisAge:
          'Single-leg vertical loading puts targeted mechanical force directly through the femoral neck—the prime site to fortify against osteopenia—while building effortless stair strength.',
        bodyImpact: {
          headline: 'Fortifies hip bone density, stair-climbing quads & knee balance',
          systems: ['skeletal', 'muscular', 'neuromuscular'],
          zones: ['hips_femur', 'quads', 'glutes', 'ankles_feet', 'proprioceptors'],
          mechanisms: [
            { system: 'skeletal', text: 'Direct weight-bearing load stimulates hip and femur bone maintenance.' },
            { system: 'muscular', text: 'Strengthens glutes and quads independently without compressing the lower back.' },
            { system: 'neuromuscular', text: 'Trains controlled single-leg stepping symmetry.' }
          ]
        },
        steps: [
          { phase: 'Plant', cue: 'Place entire lead foot flat on a sturdy 8–14 inch step with torso tall.' },
          { phase: 'Drive', cue: 'Push straight through the lead foot to stand fully—avoid pushing off the back toes.' },
          { phase: 'Lower', cue: 'Control the step down over 2–3 seconds so the lead knee and glute absorb the work.' }
        ],
        easier: 'Use a single standard stair step with one hand lightly touching the handrail.',
        harder: 'Hold dumbbells in both hands and step onto a 14–16 inch box with zero back-foot push.'
      },
      {
        id: 'ex-50-facepull-row',
        name: 'Cable / Band Face Pulls & Seated Rows',
        modality: 'strength',
        motionType: 'pull',
        effort: 'RPE 7 · 3 × 12–15 reps',
        frequency: '2–3× / week',
        summary: 'External-rotation pulls and rows that open the chest and armor the rotator cuff.',
        whyThisAge:
          'Rotator cuff tendons and thoracic posture benefit immensely from high-quality upper-back pulling—keeping overhead reaching, tennis, and luggage lifting pain-free.',
        bodyImpact: {
          headline: 'Protects rotator cuffs, thoracic uprightness & shoulder longevity',
          systems: ['muscular', 'joints', 'skeletal'],
          zones: ['back', 'shoulders', 'spine', 'grip'],
          mechanisms: [
            { system: 'muscular', text: 'Strengthens rear deltoids, external rotators, and mid-traps.' },
            { system: 'joints', text: 'Creates space inside the shoulder joint to prevent impingement.' },
            { system: 'skeletal', text: 'Reinforces upright thoracic extension to oppose age-related rounding.' }
          ]
        },
        steps: [
          { phase: 'Grip', cue: 'Hold resistance band or rope at face height with thumbs pointing back toward you.' },
          { phase: 'Pull & Open', cue: 'Draw hands toward temples while elbows flare slightly high and chest lifts gently.' },
          { phase: 'Hold', cue: 'Pause 1–2 seconds feeling shoulder blades glide smoothly together, then release slowly.' }
        ],
        easier: 'Step closer to the anchor and perform seated band rows at chest height first.',
        harder: 'Finish each rep with an overhead "Y" reach while maintaining slight band tension.'
      },
      {
        id: 'ex-50-heel-drops',
        name: 'Heel Drops & Fast-Concentric Stands',
        modality: 'power',
        motionType: 'heel_drop',
        effort: 'RPE 6–7 · 3 × 10–12 crisp reps',
        frequency: '3× / week',
        summary: 'Controlled rises onto tiptoes followed by a crisp heel drop—plus quick-up, slow-down squats.',
        whyThisAge:
          'Bone cells respond best to brief, brisk mechanical vibration rather than endless pounding. Firm heel drops and fast-intent rises protect both bone density and fast-twitch muscle speed.',
        bodyImpact: {
          headline: 'Delivers bone-building osteogenic signals & preserves Type II speed',
          systems: ['skeletal', 'neuromuscular', 'muscular'],
          zones: ['hips_femur', 'spine', 'ankles_feet', 'calves', 'quads'],
          mechanisms: [
            { system: 'skeletal', text: 'Crisp heel impact sends a safe osteogenic pulse up the tibia, femur, and spine.' },
            { system: 'neuromuscular', text: 'Fast-intent rising fires Type II fibers that protect quick movement reactions.' }
          ]
        },
        steps: [
          { phase: 'Rise', cue: 'Stand tall near a counter for optional balance; lift high onto the balls of your feet.' },
          { phase: 'Drop', cue: 'Release cleanly so heels land firmly (not painfully) with soft, unlocked knees.' },
          { phase: 'Pair', cue: 'Follow with 8 bodyweight squats: lower slowly for 3 seconds, stand up briskly in 1 second.' }
        ],
        easier: 'Perform gentle heel drops on a cushioned rug or stick to brisk-up chair stands.',
        harder: 'Progress to soft, quiet low mini-hops (1–2 inches) if knees and ankles are completely pain-free.'
      },
      {
        id: 'ex-50-brisk-cardio',
        name: 'Brisk Walking, Swimming, or Cycling',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4.5–6 · 35–45 min steady',
        frequency: '3–5× / week',
        summary: 'Consistent Zone 2 aerobic sessions that nourish blood vessels, heart rhythm, and deep sleep.',
        whyThisAge:
          'Arterial stiffness rises subtly in the 50s and 60s. Regular rhythmic aerobic movement triggers endothelial nitric oxide, keeping vessels supple and blood pressure healthy.',
        bodyImpact: {
          headline: 'Preserves arterial elasticity, heart health & steady daily energy',
          systems: ['cardiovascular', 'joints'],
          zones: ['heart_lungs', 'quads', 'calves', 'hips_femur'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Supports flexible blood vessels, healthy blood pressure, and lipid balance.' },
            { system: 'joints', text: 'Rhythmic cyclic motion bathes knee and hip cartilage with fresh joint fluid.' }
          ]
        },
        steps: [
          { phase: 'Ease In', cue: 'Start at a relaxed pace for 5 minutes to warm joints and circulation.' },
          { phase: 'Hold Rhythm', cue: 'Walk briskly, swim, or cycle where breathing is deepened yet still conversational.' },
          { phase: 'Optional Surge', cue: 'Include 3–4 gentle 45-second uphill pickups if cleared and energized.' }
        ],
        easier: 'Split into two enjoyable 20-minute brisk walks after meals (great for blood sugar!).',
        harder: 'Add hilly routes or alternating 3-minute brisk / 3-minute moderate interval walking.'
      },
      {
        id: 'ex-50-vestibular-balance',
        name: 'Single-Leg Stance with Head Turns',
        modality: 'balance',
        motionType: 'balance_single',
        effort: 'RPE 5 · 3 × 20–30s / leg',
        frequency: 'Daily (e.g., while brushing teeth)',
        summary: 'Standing steadily on one foot while slowly turning the head left and right to train the inner ear.',
        whyThisAge:
          'Humans lean heavily on vision for balance, masking subtle declines in vestibular (inner-ear) and ankle sensors. Adding gentle head turns keeps all three balance systems razor sharp.',
        bodyImpact: {
          headline: 'Sharpens vestibular inner-ear reflexes & ankle stabilization',
          systems: ['neuromuscular', 'joints'],
          zones: ['brain_vestibular', 'proprioceptors', 'ankles_feet', 'glutes'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Forces the inner ear and foot proprioceptors to coordinate while visual reference shifts.' },
            { system: 'joints', text: 'Builds deep micro-stabilizer endurance around the ankle and hip.' }
          ]
        },
        steps: [
          { phase: 'Setup', cue: 'Stand beside a kitchen counter or sturdy chair so fingertip support is inches away.' },
          { phase: 'Lift', cue: 'Shift smoothly onto one foot, keeping standing hip tucked in (not jutting out).' },
          { phase: 'Scan', cue: 'Slowly turn head left, center, then right while staying tall and calm.' }
        ],
        easier: 'Keep eyes fixed on a single point straight ahead with one finger resting on the counter.',
        harder: 'Stand barefoot on a folded yoga mat or briefly close your eyes for 5–10 seconds safely.'
      },
      {
        id: 'ex-50-thread-ankle',
        name: 'Thread-the-Needle & Wall Ankle Stretch',
        modality: 'mobility',
        motionType: 'mobility_flow',
        effort: 'RPE 3 · 6–8 slow breaths / side',
        frequency: '4–7× / week',
        summary: 'Gentle mid-back rotation paired with knee-to-wall ankle dorsiflexion mobility.',
        whyThisAge:
          'Stiff ankles silently shorten walking stride and elevate trip risk later on, while thoracic mobility keeps posture tall and breathing full.',
        bodyImpact: {
          headline: 'Protects full walking stride length, ankle spring & spinal rotation',
          systems: ['joints', 'neuromuscular'],
          zones: ['ankles_feet', 'calves', 'spine', 'shoulders'],
          mechanisms: [
            { system: 'joints', text: 'Maintains ankle bend needed for smooth stairs and natural heel-to-toe walking.' },
            { system: 'neuromuscular', text: 'Calms tight calf and upper-back tone through slow nasal exhales.' }
          ]
        },
        steps: [
          { phase: 'Ankle Drive', cue: 'Face a wall in a split stance; glide front knee gently toward wall while heel stays glued down.' },
          { phase: 'Thread', cue: 'On hands and knees (or standing with hands on a counter), slide one arm underneath to gently twist.' },
          { phase: 'Breathe', cue: 'Hold each gentle stretch for 3–5 unhurried breaths without forcing any pinch.' }
        ],
        easier: 'Perform standing thoracic rotations with hands on a table if kneeling is uncomfortable.',
        harder: 'Add slow calf raises straight into deep heel stretches off the bottom stair.'
      }
    ]
  },

  {
    id: '63-75',
    label: '63–75',
    minAge: 63,
    maxAge: 75,
    stageNum: '06',
    title: 'Active Independence & Balance',
    eyebrow: 'Stage 06 · Ages 63 to 75',
    tagline: 'Sub-maximal functional strength, dynamic balance, and quick step confidence.',
    imageBase: 'assets/images/group-63-75',
    imageAlt:
      'Editorial illustration of active older adults practicing a tandem heel-to-toe balance walk and controlled chair sit-to-stand inside concentric rings',
    physiologyOverview:
      'Adults 65+ make dramatic gains in strength, independence, and bone protection—without ever testing a risky 1-rep max. Sub-maximal controlled strength (RPE 6–7, 8–12 smooth reps), dynamic balance for fall prevention, and gentle reaction power keep travel, hobbies, and everyday life effortless.',
    weeklyRhythm: '2–3×/wk sub-max functional strength · daily 5–10 min balance · 4–5×/wk brisk walking/water',
    effortTarget: 'RPE 6–7.5 · Sub-Maximal, Smooth Breathing (No 1RM)',
    focusBullets: [
      'Sub-maximal functional strength (8–12 controlled reps, leaving 2–3 reps in reserve—never max-strain 1RM)',
      'Dynamic balance & lateral stepping (tandem walk, clock reaches) proven to cut fall risk by 30–40%',
      'Controlled "quick up, slow down" power to recover instantly from an unexpected curb or stumble'
    ],
    guardrails: [
      'Avoid breath-holding max lifts (Valsalva blood-pressure spikes) and high-impact HIIT sprints',
      'Always exhale smoothly on exertion and keep a sturdy support nearby when progressing balance'
    ],
    mix: {
      strength: { score: 92, status: 'core', note: 'Sub-maximal RPE 6–7 functional strength (not 1RM)' },
      power: { score: 66, status: 'moderate', note: 'Quick-up controlled stands for stumble reflex' },
      hiit: { score: 15, status: 'caution', note: 'Generally replaced by brisk steady cardio' },
      aerobic: { score: 88, status: 'core', note: 'Brisk walking, cycling & water aerobics' },
      balance: { score: 98, status: 'core', note: 'Top daily priority: tandem gait & lateral stability' },
      mobility: { score: 90, status: 'core', note: 'Overhead reach, posture & confident stride' }
    },
    exercises: [
      {
        id: 'ex-63-sit-stand',
        name: 'Controlled Sit-to-Stand (Sub-Maximal)',
        modality: 'strength',
        motionType: 'sit_to_stand',
        effort: 'RPE 6–7 · 3 × 8–12 reps (No 1RM)',
        frequency: '2–3× / week',
        summary: 'Rising smoothly from a sturdy chair—optionally holding a light weight—to build lifelong leg independence.',
        whyThisAge:
          'You never need maximal 1-rep lifts at 65+. Moderate, controlled sets (stopping 2–3 reps shy of fatigue) stimulate muscle hypertrophy and leg power safely without joint overload or blood-pressure spikes.',
        bodyImpact: {
          headline: 'Preserves effortless standing, stair power & healthy blood sugar',
          systems: ['muscular', 'skeletal', 'joints'],
          zones: ['quads', 'glutes', 'hips_femur', 'core'],
          mechanisms: [
            { system: 'muscular', text: 'Rebuilds quad and glute strength—the #1 predictor of independent daily living.' },
            { system: 'skeletal', text: 'Safe vertical loading preserves hip and femoral bone integrity.' },
            { system: 'joints', text: 'Smooth controlled lowering protects knee cartilage and strengthens tracking muscles.' }
          ]
        },
        steps: [
          { phase: 'Align', cue: 'Sit toward front edge of a sturdy chair, feet flat and slightly wider than hips.' },
          { phase: 'Stand', cue: 'Lean nose slightly over toes, exhale smoothly, and press evenly through feet to stand tall.' },
          { phase: 'Lower', cue: 'Reach hips back and lower smoothly over 3 seconds—tap seat gently without plopping.' }
        ],
        easier: 'Use a slightly higher chair cushion or place hands lightly on armrests to assist the rise.',
        harder: 'Hold a 5–15 lb dumbbell close to your chest or pause 1 inch above the seat.'
      },
      {
        id: 'ex-63-incline-push-row',
        name: 'Wall / Incline Push-Ups & Band Rows',
        modality: 'strength',
        motionType: 'push',
        effort: 'RPE 6–7 · 3 × 10–12 reps',
        frequency: '2–3× / week',
        summary: 'Joint-friendly upper-body pushing and pulling for groceries, heavy doors, and protective bracing.',
        whyThisAge:
          'Upper-body strength makes daily errands effortless and improves arm-bracing resilience. Elevating the hands adjusts difficulty smoothly while keeping shoulders happy.',
        bodyImpact: {
          headline: 'Strengthens pushing/pulling capacity, posture & wrist/arm bones',
          systems: ['muscular', 'skeletal', 'joints'],
          zones: ['chest', 'back', 'shoulders', 'grip', 'core'],
          mechanisms: [
            { system: 'muscular', text: 'Maintains chest, tricep, and upper-back strength for carrying and lifting.' },
            { system: 'skeletal', text: 'Gentle weight-bearing through hands helps protect wrist and forearm bone density.' }
          ]
        },
        steps: [
          { phase: 'Incline Push', cue: 'Place hands shoulder-width on a sturdy kitchen counter; keep a straight line from crown to heels.' },
          { phase: 'Press', cue: 'Lower chest smoothly toward counter with elbows angled softly back; exhale as you press away.' },
          { phase: 'Band Row', cue: 'Loop a light-to-medium band around a secure doorknob and pull elbows gently back beside ribs.' }
        ],
        easier: 'Perform push-ups vertically against a wall and use a light resistance band.',
        harder: 'Move hands down to a sturdy low bench or slow the lowering phase to 3 seconds.'
      },
      {
        id: 'ex-63-brisk-power',
        name: '"Quick Up, Slow Down" Stands & Step-Ups',
        modality: 'power',
        motionType: 'step_up',
        effort: 'RPE 6.5 · 3 × 6–8 crisp reps',
        frequency: '2× / week',
        summary: 'Controlled power training: rising briskly on the way up, lowering smoothly over 3 seconds.',
        whyThisAge:
          'Preventing a fall often depends on how quickly your leg can step out to catch you. Safe, low-load speed training wakes up fast-twitch fibers without jumping.',
        bodyImpact: {
          headline: 'Trains rapid stumble-recovery speed & quick stair drive',
          systems: ['neuromuscular', 'muscular'],
          zones: ['quads', 'glutes', 'calves', 'proprioceptors', 'ankles_feet'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Sharpens nerve-to-muscle firing speed for quick protective steps.' },
            { system: 'muscular', text: 'Maintains Type II power fibers using bodyweight rather than heavy weights.' }
          ]
        },
        steps: [
          { phase: 'Set', cue: 'Start seated tall in a firm chair (or standing at the bottom stair with railing handy).' },
          { phase: 'Quick Up', cue: 'Stand up or step up briskly with crisp, deliberate intent and smooth exhale.' },
          { phase: 'Slow Down', cue: 'Take a full, graceful 3 seconds to lower back down; rest briefly between reps.' }
        ],
        easier: 'Perform quick-up rises from a taller chair with light fingertip touch on a sturdy table.',
        harder: 'Perform brisk step-ups onto an 8-inch sturdy step with minimal rail touch.'
      },
      {
        id: 'ex-63-tandem-clock',
        name: 'Tandem Heel-to-Toe Walk & Clock Reaches',
        modality: 'balance',
        motionType: 'tandem_walk',
        effort: 'RPE 5–6 · 3 × 10 steps + 2 rounds',
        frequency: 'Daily (5–8 min)',
        summary: 'Walking cleanly along an imaginary tightrope paired with controlled multi-directional foot taps.',
        whyThisAge:
          'Dynamic balance—controlling your center of mass while moving—is far more protective against real-world falls than standing still alone.',
        bodyImpact: {
          headline: 'Dramatically reduces fall risk & sharpens lateral hip stability',
          systems: ['neuromuscular', 'muscular', 'joints'],
          zones: ['brain_vestibular', 'proprioceptors', 'glutes', 'ankles_feet', 'core'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Integrates visual horizon, inner-ear balance, and dynamic foot placement.' },
            { system: 'muscular', text: 'Activates lateral hip stabilizers (glute medius) that guard against side-falls.' }
          ]
        },
        steps: [
          { phase: 'Hallway Setup', cue: 'Walk beside a wall or counter so a light hand touch is always within easy reach.' },
          { phase: 'Heel-to-Toe', cue: 'Place the heel of your front foot directly in front of the toes of your back foot; look ahead, not down.' },
          { phase: 'Clock Reach', cue: 'Stand on one foot and lightly tap the other foot toward 12, 3, and 6 o’clock before switching sides.' }
        ],
        easier: 'Walk in a "semi-tandem" stance (feet slightly staggered side-by-side) along the counter.',
        harder: 'Pause 2 seconds on each tandem step or gently turn head side-to-side while stepping.'
      },
      {
        id: 'ex-63-walk-water',
        name: 'Brisk Walking or Water Aerobics',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4.5–6 · 30–40 min',
        frequency: '4–5× / week',
        summary: 'Purposeful outdoor walking, cycling, or buoyant pool conditioning for heart and brain vitality.',
        whyThisAge:
          'Brisk aerobic walking improves cerebral blood flow (supporting memory and mood), lowers cardiovascular risk, and lubricates joints with gentle rhythmic loading.',
        bodyImpact: {
          headline: 'Nourishes heart endurance, brain blood flow & joint comfort',
          systems: ['cardiovascular', 'neuromuscular', 'joints'],
          zones: ['heart_lungs', 'brain_vestibular', 'quads', 'calves', 'hips_femur'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Strengthens heart efficiency and healthy blood vessel tone.' },
            { system: 'neuromuscular', text: 'Boosts brain-derived neurotrophic factor (BDNF) tied to cognitive sharpness.' }
          ]
        },
        steps: [
          { phase: 'Posture', cue: 'Stand tall with relaxed shoulders, swinging arms naturally from the shoulder joint.' },
          { phase: 'Stride', cue: 'Land smoothly through the heel and roll through the toes at a lively conversational pace.' },
          { phase: 'Socialize', cue: 'Walk with a friend or join a pool class—consistency thrives on enjoyment.' }
        ],
        easier: 'Start with three pleasant 10–15 minute walks spread across the day.',
        harder: 'Add gentle park hills or Nordic walking poles for extra upper-body and balance engagement.'
      },
      {
        id: 'ex-63-wall-slides',
        name: 'Wall Shoulder Slides & Standing Hip Circles',
        modality: 'mobility',
        motionType: 'mobility_flow',
        effort: 'RPE 3–4 · 2 × 8–10 smooth reps',
        frequency: 'Daily',
        summary: 'Gliding forearms smoothly upward on a wall plus slow, supported hip circles.',
        whyThisAge:
          'Maintaining comfortable overhead reach (cabinets, dressing) and fluid hip extension prevents shuffling gait and keeps daily movement graceful.',
        bodyImpact: {
          headline: 'Keeps overhead reach effortless & preserves natural stride length',
          systems: ['joints', 'muscular'],
          zones: ['shoulders', 'spine', 'hips_femur', 'back'],
          mechanisms: [
            { system: 'joints', text: 'Gently mobilizes shoulder blades and hip capsules through pain-free arcs.' },
            { system: 'muscular', text: 'Activates lower traps and serratus to support tall, open-chested posture.' }
          ]
        },
        steps: [
          { phase: 'Wall Slide', cue: 'Face a wall with pinky sides of forearms resting lightly on the surface.' },
          { phase: 'Glide', cue: 'Slide arms gently upward into a comfortable "V" while exhaling; avoid shrugging shoulders.' },
          { phase: 'Hip Circles', cue: 'Place hands on hips and draw 6 slow, smooth circles in each direction.' }
        ],
        easier: 'Use a lightweight towel under forearms to glide smoothly up the wall without friction.',
        harder: 'Step 6 inches from the wall and lift forearms half an inch away at the top of the reach.'
      }
    ]
  },

  {
    id: '75-plus',
    label: '75+',
    minAge: 75,
    maxAge: 95,
    stageNum: '07',
    title: 'Graceful Mobility & Resilience',
    eyebrow: 'Stage 07 · Ages 75 and Beyond',
    tagline: 'Preserve autonomy, calm balance confidence, circulation, and joy in motion.',
    imageBase: 'assets/images/group-75-plus',
    imageAlt:
      'Editorial illustration of radiant senior adults performing supported balance near a handrail and taking a confident sunlit walk',
    physiologyOverview:
      'Muscle and nervous-system tissue remain responsive to gentle training well into the 80s and 90s. Supported functional strength, counter-side balance practice, dual-task brain-body coordination, and rib-expanding breathing keep everyday autonomy and vitality flourishing.',
    weeklyRhythm: 'Daily 10–20 min gentle movement · 2–3×/wk supported strength · daily balance & breathing',
    effortTarget: 'RPE 4–6 · Comfortable, Steady, Supported',
    focusBullets: [
      'Chair-assisted leg strength and grip work to keep rising, carrying, and dressing independent',
      'Supported balance and weight shifts next to a sturdy counter to build fearless footing',
      'Brain-body dual-task marching and deep rib breathing for gait rhythm, circulation, and alertness'
    ],
    guardrails: [
      'Skip HIIT, jumping, or unassisted balance challenges—confidence and safety come first',
      'Always keep a solid support (counter, sturdy chair back, handrail) within fingertip reach'
    ],
    mix: {
      strength: { score: 86, status: 'core', note: 'Chair-assisted & light-band functional strength' },
      power: { score: 26, status: 'adapt', note: 'Gentle brisk sit-to-stand intent only if steady' },
      hiit: { score: 5, status: 'caution', note: 'Not recommended—focus on gentle steady motion' },
      aerobic: { score: 84, status: 'core', note: 'Daily short walks or recumbent cycling' },
      balance: { score: 98, status: 'core', note: 'Top daily focus: supported single-leg & weight shifts' },
      mobility: { score: 95, status: 'core', note: 'Rib breathing, ankle pumps & gentle posture' }
    },
    exercises: [
      {
        id: 'ex-75-chair-stand',
        name: 'Chair-Assisted Sit-to-Stand & Leg Extensions',
        modality: 'strength',
        motionType: 'sit_to_stand',
        effort: 'RPE 5–6 · 2–3 × 6–10 reps',
        frequency: '2–3× / week',
        summary: 'Supported rising from a firm chair paired with slow seated knee straightening.',
        whyThisAge:
          'Even modest, gentle thigh strength gains in your 70s, 80s, and 90s translate immediately into easier standing, steadier walking, and greater confidence at home.',
        bodyImpact: {
          headline: 'Protects thigh strength, knee stability & daily independence',
          systems: ['muscular', 'joints', 'skeletal'],
          zones: ['quads', 'glutes', 'hips_femur'],
          mechanisms: [
            { system: 'muscular', text: 'Stimulates quadriceps and glute fibers safely even with chair-arm assistance.' },
            { system: 'joints', text: 'Seated leg extensions nourish knee joints without impact stress.' }
          ]
        },
        steps: [
          { phase: 'Prepare', cue: 'Sit forward on a sturdy, non-rolling chair with feet planted firmly beneath knees.' },
          { phase: 'Rise', cue: 'Place hands on armrests (or thighs), lean slightly forward, exhale, and stand tall.' },
          { phase: 'Extend', cue: 'Lower gently back to seat; follow with 8 slow seated leg lifts pausing 2 seconds straight.' }
        ],
        easier: 'Add a firm folded cushion to raise seat height, or focus primarily on seated leg extensions.',
        harder: 'Lighten hand support on the armrests gradually while keeping control smooth.'
      },
      {
        id: 'ex-75-band-grip',
        name: 'Light Band Pull-Aparts & Grip Squeezes',
        modality: 'strength',
        motionType: 'pull',
        effort: 'RPE 5 · 2 × 10–12 reps',
        frequency: '3× / week',
        summary: 'Gentle elastic band chest openers paired with soft stress-ball hand squeezes.',
        whyThisAge:
          'Hand strength and upright upper-back muscles directly empower everyday tasks—opening jars, steadying on railings, carrying a teacup, and breathing openly.',
        bodyImpact: {
          headline: 'Maintains hand dexterity, upper-back uprightness & chest openness',
          systems: ['muscular', 'joints'],
          zones: ['grip', 'back', 'shoulders', 'spine'],
          mechanisms: [
            { system: 'muscular', text: 'Preserves forearm flexor grip strength and postural mid-back endurance.' },
            { system: 'joints', text: 'Gently opens rounded shoulders and keeps finger joints supple.' }
          ]
        },
        steps: [
          { phase: 'Hold', cue: 'Sit or stand tall holding a light therapy band at chest height, palms facing up.' },
          { phase: 'Open', cue: 'Draw hands gently apart until band touches chest, feeling shoulder blades glide together.' },
          { phase: 'Squeeze', cue: 'Hold a soft foam ball, squeeze comfortably for 3 seconds, then open fingers wide.' }
        ],
        easier: 'Widen your grip on the therapy band for ultra-gentle resistance.',
        harder: 'Pause 2 seconds with shoulder blades gently drawn together on each pull-apart.'
      },
      {
        id: 'ex-75-supported-balance',
        name: 'Counter-Supported Single-Leg Hold & Weight Shifts',
        modality: 'balance',
        motionType: 'balance_single',
        effort: 'RPE 4–5 · 2–3 × 10–20s / side',
        frequency: 'Daily',
        summary: 'Gentle side-to-side weight shifts and brief single-leg holds with hands ready on a kitchen counter.',
        whyThisAge:
          'Practicing balance in a 100% safe, supported setup builds real neuromuscular reflexes and replaces fear of falling with calm physical confidence.',
        bodyImpact: {
          headline: 'Awakens ankle proprioceptors & safe lateral stepping control',
          systems: ['neuromuscular', 'joints'],
          zones: ['proprioceptors', 'ankles_feet', 'brain_vestibular', 'glutes'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Keeps foot-to-brain balance sensors active and responsive.' },
            { system: 'joints', text: 'Strengthens ankle and outer-hip steadying muscles gently.' }
          ]
        },
        steps: [
          { phase: 'Anchor', cue: 'Stand facing a sturdy kitchen counter with both hands resting comfortably on the edge.' },
          { phase: 'Shift', cue: 'Glide bodyweight smoothly onto your right foot, lifting the left heel—or foot—just an inch.' },
          { phase: 'Breathe', cue: 'Hold calmly for 10–20 seconds looking straight ahead, then switch cleanly to the other foot.' }
        ],
        easier: 'Keep the lifted foot’s toes lightly resting on the floor like a kickstand.',
        harder: 'Lighten touch to just two fingertips on the counter while keeping steady posture.'
      },
      {
        id: 'ex-75-daily-walk',
        name: 'Daily Short Walks or Recumbent Cycling',
        modality: 'aerobic',
        motionType: 'aerobic_stride',
        effort: 'RPE 4–5 · 10–20 min (1–2×/day)',
        frequency: 'Daily',
        summary: 'Pleasant, steady short walks (indoors or sunlit paths) or back-supported recumbent cycling.',
        whyThisAge:
          'Frequent short bouts of gentle movement stimulate circulation, brighten mood, aid digestion and sleep, and keep cardiovascular capacity resilient without exhaustion.',
        bodyImpact: {
          headline: 'Boosts circulation, cognitive alertness & gentle heart vitality',
          systems: ['cardiovascular', 'neuromuscular'],
          zones: ['heart_lungs', 'brain_vestibular', 'quads', 'calves'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Promotes steady venous return and healthy resting heart rhythm.' },
            { system: 'neuromuscular', text: 'Sustains walking rhythm, spatial orientation, and daytime energy.' }
          ]
        },
        steps: [
          { phase: 'Pace', cue: 'Wear supportive, non-slip shoes and start at an unhurried, comfortable rhythm.' },
          { phase: 'Flow', cue: 'Focus on lifting toes cleanly on each step and letting arms swing gently.' },
          { phase: 'Enjoy', cue: 'Stop feeling refreshed rather than tired—two 10-minute walks match one 20-minute outing.' }
        ],
        easier: 'Use a back-supported recumbent stationary bike or stroll 5–8 minutes along a level hallway.',
        harder: 'Gradually build to a pleasant 25-minute outdoor neighborhood stroll.'
      },
      {
        id: 'ex-75-dual-march',
        name: 'Seated or Standing Opposite-Arm March',
        modality: 'balance',
        motionType: 'march_dual',
        effort: 'RPE 4–5 · 2 × 20 slow steps',
        frequency: 'Daily',
        summary: 'Rhythmic marching lifting one knee with the opposite hand—optional word/counting pairing.',
        whyThisAge:
          'Coordinating opposite limbs (and optionally naming cities or counting smoothly) fires cross-hemisphere brain pathways directly tied to steady, confident gait.',
        bodyImpact: {
          headline: 'Reinforces brain-body cross-coordination & smooth gait rhythm',
          systems: ['neuromuscular', 'cardiovascular', 'muscular'],
          zones: ['brain_vestibular', 'core', 'hips_femur', 'quads', 'shoulders'],
          mechanisms: [
            { system: 'neuromuscular', text: 'Strengthens left-right brain communication and real-world walking coordination.' },
            { system: 'muscular', text: 'Gently exercises hip flexors needed to clear curbs and rugs cleanly.' }
          ]
        },
        steps: [
          { phase: 'Posture', cue: 'Sit tall near the front of a sturdy chair (or stand lightly beside a counter).' },
          { phase: 'Cross-March', cue: 'Lift right knee gently while raising left hand comfortably toward chest height.' },
          { phase: 'Rhythm', cue: 'Alternate smoothly for 20 steps; add fun mental focus like naming fruits A–Z.' }
        ],
        easier: 'Perform seated with small, comfortable knee lifts and relaxed breathing.',
        harder: 'Perform standing beside a sturdy counter with slow, poised pauses at the top of each lift.'
      },
      {
        id: 'ex-75-breath-ankle',
        name: 'Diaphragmatic Rib Breathing & Ankle Pumps',
        modality: 'mobility',
        motionType: 'breathing',
        effort: 'RPE 2–3 · 5–8 slow cycles',
        frequency: 'Daily (morning & evening)',
        summary: 'Slow 360° rib-expanding breaths paired with seated ankle pumps and gentle neck/torso turns.',
        whyThisAge:
          'Ribcage stiffness and reduced lower-leg pumping creep in silently. Deep diaphragmatic breathing boosts oxygen uptake and calm, while ankle pumps keep blood flowing briskly.',
        bodyImpact: {
          headline: 'Expands lung capacity, lower-leg circulation & comfortable turning',
          systems: ['cardiovascular', 'joints', 'neuromuscular'],
          zones: ['heart_lungs', 'ankles_feet', 'calves', 'spine'],
          mechanisms: [
            { system: 'cardiovascular', text: 'Calf contractions act as a "second heart" aiding leg circulation; deep breaths boost oxygenation.' },
            { system: 'joints', text: 'Keeps ankles flexible for walking and neck/mid-back comfortable for checking surroundings.' }
          ]
        },
        steps: [
          { phase: 'Inhale', cue: 'Rest hands gently on lower side ribs; inhale through nose for 4 seconds feeling ribs widen.' },
          { phase: 'Exhale', cue: 'Exhale softly through pursed lips for 6 seconds, relaxing shoulders downward.' },
          { phase: 'Pump & Turn', cue: 'Flex toes gently toward shins then point away 12 times; finish with easy left-right head glances.' }
        ],
        easier: 'Perform comfortably reclined in a supportive armchair with pillows.',
        harder: 'Pair slow inhales with sweeping both arms gently out and overhead.'
      }
    ]
  }
];

export function getModalityById(id) {
  return MODALITIES.find((m) => m.id === id);
}

export function getMatchingGroupsForAge(age) {
  return AGE_GROUPS.filter((g) => age >= g.minAge && age <= g.maxAge);
}
