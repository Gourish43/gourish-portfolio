# Gourish Pawaskar — Portfolio

A static React portfolio site. Project data lives in a single JSON file; there
is no backend, no database, and no admin panel.

---

## Quick start

```bash
npm install
npm start          # dev server at http://localhost:3000
npm run build      # production build into ./build
```

---

## Adding a new project (the most common task)

All projects live in **one file**: `public/data/projects.json`.

It's a JSON array. To add a project, open the file and add a new object to the
array. The easiest way is to **copy the `starter-template` entry** at the
bottom of the file and edit the fields.

### Minimum fields

```jsonc
{
  "id": "my-cool-project",            // unique id, kebab-case
  "slug": "my-cool-project",          // URL slug → /portfolio/my-cool-project
  "title": "My Cool Project",
  "desc": "One-line description shown on the case study hero.",
  "year": "2026",                     // free-text, e.g. "Jan – Jun 2026"
  "tags": ["SaaS", "Mobile"],         // first tag = category shown on the card
  "visual": "pv-2",                   // fallback gradient (pv-1 … pv-6, see below)
  "thumbnail": null,                  // or "/assets/projects/my-cool.jpg"
  "sections": []                      // see below
}
```

Save the file. Reload the dev server (`npm start` already running? It hot-reloads).
The project shows up on `/portfolio` and is reachable at
`/portfolio/my-cool-project`.

### Optional fields

| Field | What it does |
|---|---|
| `accentBg` | CSS gradient string used on the case study hero. e.g. `"linear-gradient(150deg, #EAF3DE 0%, #F7F6F3 70%)"`. Leave `""` to use the default. |
| `heroStats` | Array of `{val, label}` shown at the top of the case study. |
| `sections` | Array of content blocks — see schema below. |

### Section schema

Each entry in `sections` is one content block on the case study page.

```jsonc
{
  "id": "unique-section-id",            // anchor for the sidebar TOC
  "type": "overview",                   // see Section types below
  "title": "Optional heading shown above the section",
  "content": "Body paragraph. Use \\n\\n for new paragraphs. **bold** with double-asterisks.",

  // Any of the following are optional — set the matching `show…` flag to true
  // to make them render.
  "showHighlight": false,
  "highlightText": "A pull-quote or key insight, rendered in a calm box.",

  "showBullets": false,
  "bulletPoints": ["First point", "Second point — supports **bold**"],

  "showSteps": false,
  "steps": [
    { "num": "01", "name": "Discover", "desc": "What I learned in research." },
    { "num": "02", "name": "Define",   "desc": "How I framed the problem." }
  ],

  "showMetrics": false,
  "metrics": [
    { "num": "+25%", "label": "Adoption" },
    { "num": "−40%", "label": "Time on task" }
  ],

  "showImages": false,
  "images": [
    { "id": "img-1", "url": "/assets/projects/my-cool/screen-1.jpg", "caption": "Caption", "position": "full" }
    // position: "full" | "half" | "inline"
  ]
}
```

### Section `type` values

`overview`, `problem`, `challenge`, `research`, `role`, `process`, `decisions`,
`design-system`, `outcome`, `learnings`, `custom`.

For `custom`, also set `customLabel: "Your label"`.

### Visual fallback colors

When `thumbnail` is `null`, the project card shows a gradient. Pick one:

| Value | Color |
|---|---|
| `pv-1` | Warm Beige |
| `pv-2` | Sage Green |
| `pv-3` | Golden Warm |
| `pv-4` | Sky Blue |
| `pv-5` | Lavender |
| `pv-6` | Rose |

### Adding project images

Drop your images into `public/assets/projects/<slug>/` and reference them with
a root-relative URL:

```
public/assets/projects/my-cool/hero.jpg
                                screen-1.jpg
                                screen-2.jpg
```

Then in `projects.json`:

```jsonc
"thumbnail": "/assets/projects/my-cool/hero.jpg"
```

(Any path under `public/` is served as a static asset at the same URL.)

---

## File structure

```
gourish-pawaskar/
├── public/
│   ├── data/
│   │   └── projects.json      ← edit this to add/edit projects
│   ├── assets/                ← create this folder for project images
│   │   └── projects/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── index.js               app entry
│   ├── App.js                 routes
│   ├── index.css              global tokens (colors, fonts, vars)
│   │
│   ├── pages/
│   │   ├── Home.js / Home.css
│   │   ├── Portfolio.js / Portfolio.css
│   │   ├── DynamicProject.js  renders one project from JSON
│   │   ├── Contact.js / Contact.css
│   │   └── me.png             profile photo (used on Home)
│   │
│   ├── components/
│   │   ├── Navbar.js / Navbar.css
│   │   ├── Footer.js
│   │   ├── ProjectCard.js / ProjectCard.css
│   │   ├── ProjectPage.js / ProjectPage.css   case study layout
│   │   └── DynamicImages.css
│   │
│   └── store/
│       └── projectStore.js    loads + caches projects.json
│
├── _backup_original/          original files from before the static refactor
└── package.json
```

---

## Other content you'll want to edit

| What | Where |
|---|---|
| Hero text, skills, experience, education, certifications | `src/pages/Home.js` |
| Contact email, phone, social links | `src/pages/Contact.js` + `src/components/Footer.js` |
| Featured project links in footer | `src/components/Footer.js` (the four `<Link to="/portfolio/...">`) |
| Portfolio filter categories | `src/pages/Portfolio.js` (`FILTERS` array + filter logic) |
| Colors, fonts, spacing tokens | `src/index.css` |

---

## Contact form (EmailJS)

The contact form uses **EmailJS** (no server needed). Credentials are
hardcoded in `src/pages/Contact.js`:

```js
const SERVICE_ID  = 'service_ygdkyib';
const TEMPLATE_ID = 'template_plpf7rj';
const PUBLIC_KEY  = 'ed6OBjHy4tQLdn-u2';
```

These are safe to commit (the EmailJS public key is meant to be public). To
limit abuse, add your domain to the allowlist in your EmailJS dashboard.

---

## Cleanup: files you can delete

The refactor stubbed out the Supabase and admin files but left them in place
so the build wouldn't break mid-refactor. You can safely delete the following
via File Explorer:

```
F:\gourish-portfolio-react\gourish-pawaskar\src\admin\         ← entire folder
F:\gourish-portfolio-react\gourish-pawaskar\src\lib\           ← entire folder (only contains supabase.js)
F:\gourish-portfolio-react\gourish-pawaskar\_backup_original\  ← once you're confident the new build works
```

Then run:

```bash
npm uninstall @supabase/supabase-js     # already removed from package.json,
                                         # this just clears node_modules/
```

Nothing in the new code imports from those folders.

---

## Deploying

This builds to plain HTML/CSS/JS. Run `npm run build` and upload `./build` to
any static host:

- **Netlify / Vercel** — drag-and-drop the `build/` folder, or connect the git repo.
- **GitHub Pages** — push `build/` contents to a `gh-pages` branch.
- **Cloudflare Pages**, **S3 + CloudFront**, any static host works.

For client-side routing (`/portfolio/...`), make sure your host serves
`index.html` for unmatched paths. Netlify / Vercel do this automatically; for
others, see [react-router-dom docs](https://reactrouter.com/en/main/start/overview).
