// ── PROJECT STORE — Supabase backend ──
// All reads/writes go to Supabase so every visitor sees the same data.
// localStorage is only used as a fast cache to avoid flicker on repeat visits.

import { supabase } from '../lib/supabase';

const CACHE_KEY    = 'gourish_projects_cache';
// const SEEDED_KEY   = 'gourish_supabase_seeded_v1';

// ── ROW SHAPE CONVERSION ──
// Supabase row  → app project object
function rowToProject(row) {
  return {
    id:         row.id,
    slug:       row.slug,
    to:         `/portfolio/${row.slug}`,
    title:      row.title,
    desc:       row.description,
    year:       row.year,
    tags:       row.tags       || [],
    visual:     row.visual     || 'pv-1',
    thumbnail:  row.thumbnail  || null,
    accentBg:   row.accent_bg  || '',
    heroStats:  row.hero_stats || [],
    sections:   row.sections   || [],
    hardcoded:  false,
    createdAt:  row.created_at,
    updatedAt:  row.updated_at,
  };
}

// app project object → Supabase row
function projectToRow(p) {
  return {
    id:          p.id,
    slug:        p.slug,
    title:       p.title,
    description: p.desc,
    year:        p.year,
    tags:        p.tags       || [],
    visual:      p.visual     || 'pv-1',
    thumbnail:   p.thumbnail  || null,
    accent_bg:   p.accentBg   || '',
    hero_stats:  p.heroStats  || [],
    sections:    p.sections   || [],
    created_at:  p.createdAt  || Date.now(),
    updated_at:  p.updatedAt  || Date.now(),
  };
}

// ── CACHE HELPERS ──
function writeCache(projects) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(projects)); } catch {}
}
function readCache() {
  try { const r = localStorage.getItem(CACHE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}

// ── SEED Supabase once ──
export async function seedIfNeeded() {
  // Seeding disabled — manage all projects via admin panel
  return;
}

// ── READ ALL ──
export async function getAllProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    const projects = data.map(rowToProject);
    writeCache(projects);
    return projects;
  } catch (e) {
    console.error('getAllProjects error:', e);
    return readCache() || [];
  }
}

// ── READ ONE BY SLUG ──
export async function getProjectBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return rowToProject(data);
  } catch {
    const cached = readCache();
    return cached ? cached.find(p => p.slug === slug) || null : null;
  }
}

// ── READ ONE BY ID ──
export async function getProjectById(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return rowToProject(data);
  } catch {
    const cached = readCache();
    return cached ? cached.find(p => p.id === id) || null : null;
  }
}

// ── ADD ──
export async function addProject(project) {
  const { error } = await supabase.from('projects').insert(projectToRow(project));
  if (error) throw error;
  // Invalidate cache
  const cached = readCache() || [];
  writeCache([...cached, project]);
}

// ── UPDATE ──
export async function updateProject(id, project) {
  const { error } = await supabase
    .from('projects')
    .update(projectToRow(project))
    .eq('id', id);
  if (error) throw error;
  const cached = readCache() || [];
  writeCache(cached.map(p => p.id === id ? { ...p, ...project } : p));
}

// ── DELETE ──
export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  const cached = readCache() || [];
  writeCache(cached.filter(p => p.id !== id));
}

// ── LEGACY ALIASES (used by existing components) ──
export const getAdminProjects   = getAllProjects;
export const addAdminProject    = addProject;
export const updateAdminProject = updateProject;
export const deleteAdminProject = deleteProject;
// export const HARDCODED_PROJECTS = SEED_PROJECTS;

export function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const SECTION_TYPES = [
  { type:'overview',      label:'Overview',       icon:'', desc:'General project introduction' },
  { type:'problem',       label:'Problem',         icon:'', desc:'Problem statement & context' },
  { type:'challenge',     label:'Challenge',       icon:'', desc:'Design challenges faced' },
  { type:'research',      label:'Research',        icon:'', desc:'User research & findings' },
  { type:'role',          label:'My Role',         icon:'', desc:'Your responsibilities' },
  { type:'process',       label:'Design Process',  icon:'', desc:'Step-by-step process' },
  { type:'decisions',     label:'Key Decisions',   icon:'', desc:'Important design choices' },
  { type:'design-system', label:'Design System',   icon:'', desc:'Design system work' },
  { type:'outcome',       label:'Outcome',         icon:'', desc:'Results & impact metrics' },
  { type:'learnings',     label:'Learnings',       icon:'', desc:'Key takeaways' },
  { type:'custom',        label:'Custom Section',  icon:'', desc:'Your own section name' },
];

export const VISUAL_OPTIONS = [
  { value:'pv-1', label:'Warm Beige',  preview:'linear-gradient(135deg,#C8C4BB,#8C8880)' },
  { value:'pv-2', label:'Sage Green',  preview:'linear-gradient(135deg,#A8C490,#6B9E52)' },
  { value:'pv-3', label:'Golden Warm', preview:'linear-gradient(135deg,#D4B882,#A08848)' },
  { value:'pv-4', label:'Sky Blue',    preview:'linear-gradient(135deg,#7EB0D8,#4880B0)' },
  { value:'pv-5', label:'Lavender',    preview:'linear-gradient(135deg,#B4A8D8,#7860B8)' },
  { value:'pv-6', label:'Rose',        preview:'linear-gradient(135deg,#D8A0A0,#B06868)' },
];
