# The Python Programming Language's Journey... So Far

An interactive, static explainer of how the Python language, its standard library and the PEP process evolved, from 1989 to the changes scheduled for 2027–2028.

There's no build step: it's plain HTML, CSS and JavaScript, and the only external dependency is Google Fonts.

```
index.html          page structure and static sections (PEP process, footer)
assets/data.js      ALL timeline content: releases, milestones, features, PEPs, code samples,
                    the Python 2 → 3 breakdown, support lifecycle and look-ahead
assets/app.js       rendering and interaction (chart, version strip, detail panel, search, theme)
assets/styles.css   design tokens (light + dark) and layout
assets/favicon.svg
```

## Editing content

Everything lives in `assets/data.js`. Each entry is either a release or a milestone and has a list of features built with `F(category, title, [peps], description, code)`. Wrap inline code in backticks in descriptions. Code samples are either `{ ex, label }` or `{ before, after, bl, al }`; add `lang: "shell" | "toml" | "text"` for non-Python code.

When a new release ships, update these:
- the new entry, with its `status` removed and `line` changed from `"next"` to `"py3"`
- `state.selected` (the default selection) in `app.js`, and the "Latest release" badge check in `lineBadge()`
- `lifecycle` and `ahead` in `data.js`, and `verified` (the date that sets the "Today" marker)

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to Cloudflare Pages

Connect the repository with **no build command** and the output directory set to `/` (the repository root), or upload directly:

```sh
npx wrangler pages deploy . --project-name python-journey
```

Any static host (GitHub Pages, Netlify, S3) works the same way.
