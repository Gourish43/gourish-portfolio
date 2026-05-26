import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { getAllProjects, seedIfNeeded } from '../store/projectStore';
import './Home.css';
import mePic from './me.png';


function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

export default function Home() {
const [projects, setProjects] = useState([]);
const [loading, setLoading]   = useState(true);
  useReveal();

  useEffect(() => {
    async function load() {
      await seedIfNeeded();
      const all = await getAllProjects();
      setProjects(all.slice(0, 4));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-watermark" aria-hidden="true">UX</div>
          <div className="hero-inner">
            <div className="hero-eyebrow"><span className="status-dot" /> Available for opportunities</div>
            <h1 className="hero-name">I make complex things <br /><em>feel simple</em></h1>
            <p className="hero-title">UI/UX Designer · SaaS &amp; AI Platforms</p>
            <p className="hero-desc">Product-focused designer crafting accessible, human-centred experiences for enterprise SaaS, AI-driven platforms, and government systems. Based in Bengaluru, Karnataka.</p>
            <div className="hero-actions">
              <Link to="/portfolio" className="btn-primary">View Portfolio</Link>
              <Link to="/contact" className="btn-outline">Let's Talk</Link>
            </div>
            <div className="hero-stats">
              {[['4+','Years experience'],['20+','Products shipped'],['5','Certifications']].map(([n,l]) => (
                <div key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-photo-panel" aria-hidden="true">
          <img src={mePic} alt="Gourish Pawaskar" className="hero-photo" />
          <div className="hero-photo-fade" />
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="section skills-section">
        <div className="container">
          <div className="section-label">What I bring</div>
          <h2 className="section-title reveal">Skills &amp; Tools</h2>
          <p className="section-sub reveal d1">A full-stack design toolkit spanning research, prototyping, design systems, and front-end implementation.</p>
          <div className="skills-grid reveal d2">
            {[
              { icon:'✦', title:'Core Tools', tags:['Figma','Adobe XD','Photoshop','InDesign','Framer','Notion'] },
              { icon:'◈', title:'Design Skills', tags:['Wireframing','Prototyping','User Research','Design Systems','Info Architecture','WCAG 2.1'] },
              { icon:'⬡', title:'Domain Expertise', tags:['SaaS Design','AI Product Design','ESG Platforms','Enterprise Apps','Agentic AI'] },
              { icon:'◻', title:'Development', tags:['HTML/CSS','ReactJS','Lovable AI','Builder.io','Bolt.new'] },
            ].map(cell => (
              <div key={cell.title} className="skill-cell">
                <div className="skill-icon">{cell.icon}</div>
                <div className="skill-cell-title">{cell.title}</div>
                <div className="skill-tags">{cell.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOME PROJECTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-label">Selected work</div>
          <h2 className="section-title reveal">Projects</h2>
          <p className="section-sub reveal d1">A snapshot of recent work — from AI enterprise platforms to regional news apps.</p>
          {loading ? (
            <div className="projects-loading">
              {[1,2].map(i => <div key={i} className="proj-card-skeleton" />)}
            </div>
          ) : (
            <div className="home-proj-grid">
              {projects.map((p, i) => (
                <div key={p.id} className={`reveal ${i > 0 ? `d${i}` : ''}`}>
                  <ProjectCard {...p} featured={i === 0} />
                </div>
              ))}
            </div>
          )}
          <div className="home-proj-cta reveal">
            <Link to="/portfolio" className="btn-outline">See all projects →</Link>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="section exp-section">
        <div className="container">
          <div className="section-label">Career history</div>
          <h2 className="section-title reveal">Work Experience</h2>
          <p className="section-sub reveal d1">From print layout to AI product design — a steady evolution across publishing, enterprise SaaS, and defence.</p>
          <div className="timeline">
            {[
              { current:true, date:'Nov 2025 — Present', loc:'Bengaluru, KA', role:'UI/UX Designer', company:'Sustainext Digital Pvt Ltd', badge:'Current',
                points:['Designing scalable UI/UX for an enterprise SaaS platform focused on ESG management and Agentic AI-driven workflows.','Delivered Agentic AI and Supply Assessment modules from concept to production.','Simplified enterprise user journeys, reducing user complexity and improving efficiency.','Built and maintained scalable design systems to accelerate design-to-dev cycles.'] },
              { date:'Jan – Nov 2025', loc:'Bengaluru, KA', role:'UI/UX Designer', company:'Bharat Electronics Limited', badge:'Contract · Quantum Asia',
                points:['Led end-to-end UI/UX design for confidential government and defence platforms.','Streamlined design-to-dev handoffs, cutting turnaround time by 20%.','Delivered accessible, WCAG-compliant interfaces optimised for usability and security.'] },
              { date:'Sep 2023 – Dec 2024', loc:'Karwar, KA', role:'UI/UX Designer', company:'Nudijenu Publishers',
                points:['Redesigned and launched responsive websites, improving digital reach by 30%.','Conducted user research, wireframing, and prototyping for multiple web projects.','Strengthened brand identity through accessible, scalable design systems.'] },
              { date:'Aug 2020 – Mar 2023', loc:'Karwar, KA', role:'Layout Artist', company:'Nudijenu Publishers',
                points:['Modernised print layouts and visual hierarchy — resulting in a 42% increase in NPS.','Standardised reusable templates, improving design efficiency by 25%.','Designed print ads and visuals that enhanced audience engagement.'] },
            ].map((job, i) => (
              <div key={i} className={`tl-item reveal d${i}`}>
                <div className="tl-dot" />
                <div className="tl-date">
                  <strong>{job.current ? 'Current' : job.date.split('—')[0].trim()}</strong>
                  {job.date}<br />{job.loc}
                </div>
                <div className="tl-body">
                  <div className="tl-role">{job.role}</div>
                  <div className="tl-company">{job.company}{job.badge && <span className="tl-badge">{job.badge}</span>}</div>
                  <ul className="tl-points">{job.points.map((p,j) => <li key={j}>{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="section certs-section">
        <div className="container">
          <div className="section-label">Credentials</div>
          <h2 className="section-title reveal">Certifications</h2>
          <p className="section-sub reveal d1">Continuous learning across design theory, web dynamics, and project management.</p>
          <div className="certs-grid">
            {[
              { icon:'🎨', title:'UI/UX Design', issuer:'Information Technology Learning Hub' },
              { icon:'🌐', title:'Dynamic Web Design', issuer:'IxDF — Interaction Design Foundation' },
              { icon:'💡', title:'Emotional Design', issuer:'IxDF — Interaction Design Foundation' },
              { icon:'📋', title:'Project Management Foundation', issuer:'LinkedIn Learning' },
              { icon:'💻', title:'Advanced Diploma in Computer Applications', issuer:'KEONICS' },
            ].map((c,i) => (
              <div key={i} className={`cert-card reveal d${i%4}`}>
                <div className="cert-icon">{c.icon}</div>
                <div><div className="cert-title">{c.title}</div><div className="cert-issuer">{c.issuer}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="section edu-section">
        <div className="container">
          <div className="section-label">Academic background</div>
          <h2 className="section-title reveal">Education</h2>
          <div className="edu-cards">
            <div className="edu-card reveal">
              <div>
                <div className="edu-degree">Master of Computer Applications</div>
                <div className="edu-school">The National Institute of Engineering, Mysuru</div>
                <div className="edu-period">Feb 2022 — Dec 2023</div>
              </div>
              <div style={{textAlign:'right'}}><div className="edu-grade">7.53</div><div className="edu-grade-label">GPA / 10</div></div>
            </div>
            <div className="edu-card reveal d1">
              <div>
                <div className="edu-degree">Bachelor of Science</div>
                <div className="edu-school">Government Arts and Science College, Karwar</div>
                <div className="edu-period">Jul 2018 — Nov 2021</div>
              </div>
              <div style={{textAlign:'right'}}><div className="edu-grade">66%</div><div className="edu-grade-label">Percentage</div></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
