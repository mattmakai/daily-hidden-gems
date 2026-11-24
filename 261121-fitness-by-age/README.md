# Exercise by Age Explainer

An interactive static website exploring how exercise types and specific movements evolve across **7 overlapping age stages** (ages **10–18** through **75+**), featuring custom mid-century editorial illustrations, live anatomical body-impact diagrams, biomechanical walkthroughs, and light/dark themes built around your 5-color palette.

## Structure

- `index.html` — Semantic HTML5 entry point with FOUC-free theme resolution, accessible tabs, and native `<dialog>` walkthrough modal.
- `styles.css` — Responsive design system using `--dark-slate-grey`, `--vanilla-custard`, `--honey-bronze`, `--brown-red`, and `--night-bordeaux` across Light, Dark, and Forced Colors modes.
- `js/data.js` — 7 overlapping age groups, 6 exercise modalities, and 42 age-tailored exercises with physiological benefits and regressions/progressions.
- `js/anatomy-svg.js` — Interactive anatomical body-impact SVG visualizer highlighting muscles, bone-density zones, cardiovascular output, and vestibular/proprioceptive balance pathways.
- `js/movement-svg.js` — 3-phase biomechanical movement diagrams and modality iconography.
- `js/app.js` — Modular vanilla ES JavaScript controller (zero build step, zero runtime dependencies).
- `assets/images/` — Optimized responsive WebP (640w & 1280w) + JPG fallback illustrations for every age group, plus `favicon.svg`.

## Local Preview

Because the site uses native ES modules (`type="module"`), serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploying to Cloudflare Pages

No build step is required:

1. **Direct Upload:** Drag and drop this directory into **Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets**.
2. **Git Integration:** Connect your repository and set:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (or `.`)
