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

// ── SEED DATA — inserted into Supabase once ──
// const SEED_PROJECTS = [
//   {
//     id: 'trusting-news', slug: 'trusting-news',
//     title: 'TrustIn News', desc: 'A customised regional news and job discovery platform for readers and job seekers. Full end-to-end UX shipped in under 4 months.',
//     year: 'Dec 2023 – Mar 2024', tags: ['Mobile App','UX Research','Figma','Agile'],
//     visual: 'pv-1', thumbnail: null, accentBg: 'linear-gradient(150deg,#F0EEE9 0%,#F7F6F3 70%)',
//     heroStats: [{val:'<4',label:'Months to ship'},{val:'Solo',label:'UX Lead'},{val:'Mobile',label:'Platform'},{val:'2024',label:'Year'}],
//     sections: [
//       { id:'tn-overview', type:'overview', customLabel:'', title:'What is TrustIn News?',
//         content:'TrustIn News is a personalised regional news and job discovery mobile app designed for readers who feel underserved by national-first news aggregators. The platform surfaces hyper-local news stories and district-level job openings in one unified feed.\n\nThis was a self-initiated project I led from concept to high-fidelity prototype, managing the full design process under an Agile framework.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false,
//         steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'tn-problem', type:'problem', customLabel:'', title:'What problem were we solving?',
//         content:'Regional news consumers in smaller Indian cities lacked a platform that surfaced genuinely local content alongside job opportunities.',
//         showHighlight:true, highlightText:'Core tension: How do we give users control over their feed without overwhelming them with settings?',
//         showBullets:true, bulletPoints:['Existing aggregators are national-first; regional content is buried','No platform combined news + local job openings in one experience','Job discovery required switching between multiple apps and portals'],
//         showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'tn-process', type:'process', customLabel:'', title:'How I designed it',
//         content:'The project followed a structured, iterative design process managed in Agile sprints.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''],
//         showSteps:true, steps:[
//           {num:'01',name:'Research & Discovery',desc:'Competitor analysis, empathy mapping, persona creation, and user journey mapping.'},
//           {num:'02',name:'Wireframing',desc:'Low-fidelity Figma wireframes covering 12 key screens.'},
//           {num:'03',name:'High-Fidelity Prototype',desc:'Full visual design with interaction flows optimised for one-handed mobile use.'},
//           {num:'04',name:'User Testing',desc:'Tested with 6 participants. Iterated on feed setup flow based on feedback.'}],
//         showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'tn-outcome', type:'outcome', customLabel:'', title:'Results & impact',
//         content:'The project generated public interest and demonstrated the viability of a hyperlocal-first news model.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}],
//         showMetrics:true, metrics:[{num:'<4',label:'Months shipped'},{num:'12+',label:'Screens designed'},{num:'6',label:'User tests run'},{num:'100%',label:'Mobile responsive'}],
//         showImages:false, images:[] },
//     ],
//     createdAt: 1700000000000, updatedAt: 1700000000000,
//   },
//   {
//     id: 'esg-platform', slug: 'esg-platform',
//     title: 'ESG Management Platform', desc: 'Agentic AI and Supply Assessment modules for an enterprise ESG SaaS at Sustainext Digital. Concept to production.',
//     year: 'Nov 2025 – Present', tags: ['SaaS','Agentic AI','ESG','Figma'],
//     visual: 'pv-2', thumbnail: null, accentBg: 'linear-gradient(160deg,#EAF3DE 0%,#F7F6F3 60%)',
//     heroStats: [{val:'2',label:'Modules shipped'},{val:'↑',label:'Client engagement'},{val:'WCAG',label:'2.1 compliant'},{val:'2025',label:'Current role'}],
//     sections: [
//       { id:'esg-overview', type:'overview', customLabel:'', title:'The platform',
//         content:'Sustainext Digital\'s ESG management platform helps enterprise clients manage ESG reporting obligations through a unified SaaS dashboard powered by Agentic AI.\n\nI joined as the UI/UX Designer in November 2025 and own end-to-end design across all product modules.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'esg-challenge', type:'challenge', customLabel:'', title:'The design challenge',
//         content:'ESG compliance is inherently complex — enterprise users deal with fragmented data sources and multi-stakeholder approval chains.',
//         showHighlight:true, highlightText:'How do you design an AI-driven enterprise platform that feels transparent, trustworthy, and controllable?',
//         showBullets:true, bulletPoints:['Fragmented workflows across multiple disconnected tools','ESG data collection was largely manual and error-prone','Agentic AI actions needed to be visible, auditable, and reversible','Supply chain assessment required complex multi-party data flows'],
//         showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'esg-role', type:'role', customLabel:'', title:'What I owned',
//         content:'', showHighlight:false, highlightText:'',
//         showBullets:true, bulletPoints:['Led UX research, ideation, and experience planning for multiple product modules','Designed and delivered the Agentic AI module from concept to production','Designed the Supply Assessment system — supplier onboarding flows, questionnaires, scoring dashboards','Created wireframes, user flows, high-fidelity UI designs, and interactive prototypes in Figma'],
//         showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'esg-outcome', type:'outcome', customLabel:'', title:'Impact delivered',
//         content:'The Agentic AI and Supply Assessment modules were shipped from concept to production. Client engagement and platform adoption increased following launch.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}],
//         showMetrics:true, metrics:[{num:'2',label:'Modules shipped'},{num:'↑',label:'Client engagement'},{num:'↑',label:'Platform adoption'},{num:'Faster',label:'Design delivery'}],
//         showImages:false, images:[] },
//     ],
//     createdAt: 1700000001000, updatedAt: 1700000001000,
//   },
//   {
//     id: 'defence-ux', slug: 'defence-ux',
//     title: 'Defence Platform UX', desc: 'End-to-end UI/UX for confidential government and defence platforms at Bharat Electronics Limited. WCAG-compliant, security-first.',
//     year: 'Jan – Nov 2025', tags: ['Government','Defence','WCAG 2.1','Enterprise'],
//     visual: 'pv-3', thumbnail: null, accentBg: 'linear-gradient(150deg,#FAEEDA 0%,#F7F6F3 70%)',
//     heroStats: [{val:'20%',label:'Faster handoff'},{val:'WCAG',label:'2.1 compliant'},{val:'11',label:'Months'},{val:'2025',label:'Year'}],
//     sections: [
//       { id:'bel-context', type:'overview', customLabel:'', title:'About the project',
//         content:'Bharat Electronics Limited (BEL) is India\'s premier defence electronics company. I worked as a UI/UX Designer on contract from January to November 2025 on confidential government and defence platforms.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'bel-challenge', type:'challenge', customLabel:'', title:'The design challenge',
//         content:'', showHighlight:true, highlightText:'Defence platform users operate under high-stakes, time-constrained conditions. The UI must communicate clearly and never mislead.',
//         showBullets:true, bulletPoints:['Strict security constraints impacted what could be shown and how','Users range from technical operators to administrative staff','WCAG 2.1 accessibility compliance was non-negotiable','Design-to-dev handoff was slow and needed systematic improvement'],
//         showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'bel-outcome', type:'outcome', customLabel:'', title:'Impact delivered',
//         content:'All modules delivered on time with full WCAG 2.1 compliance. Streamlined handoff reduced turnaround time by 20%.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}],
//         showMetrics:true, metrics:[{num:'20%',label:'Faster dev handoff'},{num:'WCAG',label:'2.1 Compliant'},{num:'11',label:'Months delivered'},{num:'↑',label:'Interface clarity'}],
//         showImages:false, images:[] },
//     ],
//     createdAt: 1700000002000, updatedAt: 1700000002000,
//   },
//   {
//     id: 'warehouse-dashboard', slug: 'warehouse-dashboard',
//     title: 'Smart Warehouse Dashboard', desc: 'Responsive warehouse management dashboard built during a front-end internship at RDL Technologies.',
//     year: 'Jun – Sep 2023', tags: ['ReactJS','Material UI','Front-end','Internship'],
//     visual: 'pv-4', thumbnail: null, accentBg: 'linear-gradient(150deg,#E6F1FB 0%,#F7F6F3 70%)',
//     heroStats: [{val:'3',label:'Modules built'},{val:'ReactJS',label:'Stack'},{val:'Responsive',label:'Design'},{val:'2023',label:'Year'}],
//     sections: [
//       { id:'wh-overview', type:'overview', customLabel:'', title:'About the project',
//         content:'During my front-end internship at RDL Technologies, I contributed to a Smart Warehouse Management System — a responsive web dashboard for managing inventory, products, and invoicing built with ReactJS and Material UI.',
//         showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''], showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'wh-role', type:'role', customLabel:'', title:'Front-end Developer + Design Collaborator',
//         content:'', showHighlight:false, highlightText:'',
//         showBullets:true, bulletPoints:['Developed responsive dashboard shell using ReactJS','Implemented Material UI component library for consistent design','Collaborated with the design team to improve usability','Contributed to Inventory, Product Info, and Invoicing modules'],
//         showSteps:false, steps:[{num:'01',name:'',desc:''}], showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//       { id:'wh-process', type:'process', customLabel:'', title:'How I worked',
//         content:'', showHighlight:false, highlightText:'', showBullets:false, bulletPoints:[''],
//         showSteps:true, steps:[
//           {num:'01',name:'Design Handoff Review',desc:'Reviewed Figma designs, flagging implementation concerns.'},
//           {num:'02',name:'Component Development',desc:'Built reusable React components mapped to Material UI.'},
//           {num:'03',name:'Responsive Implementation',desc:'Used Material UI grid system for desktop, tablet, and mobile.'},
//           {num:'04',name:'Usability Collaboration',desc:'Worked with design team to resolve usability issues during build.'}],
//         showMetrics:false, metrics:[{num:'',label:''}], showImages:false, images:[] },
//     ],
//     createdAt: 1700000003000, updatedAt: 1700000003000,
//   },
// ];

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
