import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import VisualDesignCard from '../components/VisualDesignCard';
import { getAllProjects, seedIfNeeded } from '../store/projectStore';
import './Portfolio.css';

const FILTERS = ['All','Entertainment','SaaS','Artificial Intelligence','Visual Design'];

export default function Portfolio() {
  const [active, setActive]     = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      await seedIfNeeded();
      const all = await getAllProjects();
      setProjects(all);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (loading) return;
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [active, loading]);

  const filtered = projects.filter(p => {
    if (active === 'All')                    return true;
    if (active === 'Entertainment')          return (p.tags||[]).some(t => /entertainment/i.test(t));
    if (active === 'SaaS')                   return (p.tags||[]).some(t => /\bsaas\b/i.test(t));
    if (active === 'Artificial Intelligence') return (p.tags||[]).some(t => /\bai\b|agentic/i.test(t));
    if (active === 'Visual Design')          return p.type === 'visual-design';
    return true;
  });

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <div className="section-label">Selected work</div>
          <h1 className="page-title">Portfolio</h1>
          <p className="page-desc">Case studies and projects across SaaS, AI, enterprise, and government platforms. Click any card to open the full case study.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-inner container">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>
      </div>

      <section className="portfolio-section">
        <div className="container">
          {loading ? (
            <div className="portfolio-grid">
              {[1,2,3,4].map(i => <div key={i} className="proj-card-skeleton" style={{height:'380px', borderRadius:'14px', background:'linear-gradient(90deg,#F0EEE9 25%,#E8E5DC 50%,#F0EEE9 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite'}} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">No projects match this filter.</div>
          ) : (
            <div className="portfolio-grid">
              {filtered.map((p, i) => (
                <div key={p.id} className={`reveal d${i % 3}`}
                  style={i === 0 && filtered.length > 1 ? {gridColumn:'span 2'} : {}}>
                  {p.type === 'visual-design'
                    ? <VisualDesignCard {...p} featured={i === 0 && filtered.length > 1} />
                    : <ProjectCard {...p} featured={i === 0 && filtered.length > 1} />
                  }
                </div>
              ))}
            </div>
          )}
          
        </div>
      </section>
    </main>
  );
}
