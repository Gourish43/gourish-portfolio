// ── PROJECT STORE — Static JSON backend ──
// Reads project data from /data/projects.json (served as a static asset from
// public/data/projects.json). No backend, no database, no admin panel.
//
// To add, edit, or remove a project: just edit public/data/projects.json.
// See README.md for the schema and a step-by-step.

const DATA_URL = `${process.env.PUBLIC_URL || ''}/data/projects.json`;

// In-memory cache so we only fetch once per page load.
let _cache = null;
let _inflight = null;

async function loadAll() {
  if (_cache) return _cache;
  if (_inflight) return _inflight;
  _inflight = fetch(DATA_URL, { cache: 'no-cache' })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load projects.json (HTTP ${res.status})`);
      const raw = await res.json();
      if (!Array.isArray(raw)) throw new Error('projects.json must be an array');
      _cache = raw.map(normaliseProject);
      return _cache;
    })
    .catch((e) => {
      console.error('[projectStore] could not load projects.json:', e);
      _cache = [];
      return _cache;
    })
    .finally(() => { _inflight = null; });
  return _inflight;
}

// Normalise a raw JSON project entry into the shape the rest of the app expects.
function normaliseProject(p) {
  const slug = p.slug || p.id;
  return {
    id:         p.id || slug,
    slug,
    to:         `/portfolio/${slug}`,
    title:      p.title || 'Untitled project',
    desc:       p.desc || p.description || '',
    year:       p.year || '',
    tags:       Array.isArray(p.tags) ? p.tags : [],
    visual:     p.visual || 'pv-1',
    thumbnail:  p.thumbnail || null,
    accentBg:   p.accentBg || '',
    heroStats:  Array.isArray(p.heroStats) ? p.heroStats : [],
    sections:   Array.isArray(p.sections) ? p.sections : [],
    type:       p.type || 'case-study',
    images:     Array.isArray(p.images) ? p.images : [],
    hardcoded:  true,
    createdAt:  p.createdAt || 0,
    updatedAt:  p.updatedAt || 0,
  };
}

// ── PUBLIC API ──
// Kept compatible with the old Supabase-backed signature so pages don't need
// to change. All functions are async and return Promises.

export async function seedIfNeeded() {
  // No-op. Kept so existing callers (Home.js, Portfolio.js) don't break.
  return;
}

export async function getAllProjects() {
  return loadAll();
}

export async function getProjectBySlug(slug) {
  const all = await loadAll();
  return all.find(p => p.slug === slug) || null;
}

export async function getProjectById(id) {
  const all = await loadAll();
  return all.find(p => p.id === id) || null;
}

// ── LEGACY ALIASES ──
// These pointed at Supabase mutations in the old code. They now throw so any
// stray import surfaces loudly during development. In production they're
// unreachable because the admin panel has been removed.
const removedFn = (name) => async () => {
  throw new Error(`[projectStore] ${name}() was removed when the site became static. Edit public/data/projects.json instead.`);
};
export const addProject         = removedFn('addProject');
export const updateProject      = removedFn('updateProject');
export const deleteProject      = removedFn('deleteProject');
export const getAdminProjects   = getAllProjects;
export const addAdminProject    = addProject;
export const updateAdminProject = updateProject;
export const deleteAdminProject = deleteProject;

export function slugify(str) {
  return String(str || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const SECTION_TYPES = [
  { type: 'overview',      label: 'Overview',       desc: 'General project introduction' },
  { type: 'problem',       label: 'Problem',        desc: 'Problem statement & context' },
  { type: 'challenge',     label: 'Challenge',      desc: 'Design challenges faced' },
  { type: 'research',      label: 'Research',       desc: 'User research & findings' },
  { type: 'role',          label: 'My Role',        desc: 'Your responsibilities' },
  { type: 'process',       label: 'Design Process', desc: 'Step-by-step process' },
  { type: 'decisions',     label: 'Key Decisions',  desc: 'Important design choices' },
  { type: 'design-system', label: 'Design System',  desc: 'Design system work' },
  { type: 'outcome',       label: 'Outcome',        desc: 'Results & impact metrics' },
  { type: 'learnings',     label: 'Learnings',      desc: 'Key takeaways' },
  { type: 'custom',        label: 'Custom Section', desc: 'Your own section name' },
];

// Kept exported because some legacy imports may still reference it. Safe to
// remove once the admin folder has been deleted from disk.
export const VISUAL_OPTIONS = [
  { value: 'pv-1', label: 'Warm Beige',  preview: 'linear-gradient(135deg,#C8C4BB,#8C8880)' },
  { value: 'pv-2', label: 'Sage Green',  preview: 'linear-gradient(135deg,#A8C490,#6B9E52)' },
  { value: 'pv-3', label: 'Golden Warm', preview: 'linear-gradient(135deg,#D4B882,#A08848)' },
  { value: 'pv-4', label: 'Sky Blue',    preview: 'linear-gradient(135deg,#7EB0D8,#4880B0)' },
  { value: 'pv-5', label: 'Lavender',    preview: 'linear-gradient(135deg,#B4A8D8,#7860B8)' },
  { value: 'pv-6', label: 'Rose',        preview: 'linear-gradient(135deg,#D8A0A0,#B06868)' },
];
