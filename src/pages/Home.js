import React, { useEffect, useState, useCallback } from 'react';
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
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── Certificate data ── */
const CERTS = [
  {
    abbr: 'UI',
    color: '#1A1916',
    title: 'UI/UX Design',
    issuer: 'Information Technology Learning Hub',
    image: '/certs/uiux-design.png',
  },
  {
    abbr: 'WD',
    color: '#2D3748',
    title: 'Dynamic Web Design',
    issuer: 'IxDF — Interaction Design Foundation',
    image: '/certs/Dynamic User experience.png',
  },
  {
    abbr: 'ED',
    color: '#2D3748',
    title: 'Emotional Design',
    issuer: 'IxDF — Interaction Design Foundation',
    image: '/certs/emotion-design.png',
  },
  {
    abbr: 'PM',
    color: '#1A1916',
    title: 'Project Management Foundation',
    issuer: 'LinkedIn Learning',
    image: '/certs/project-management.jpg',
  },
];

/* ── Cert Lightbox Modal ── */
function CertModal({ cert, onClose }) {
  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div className="cert-modal-overlay" onClick={onClose}>
      <div className="cert-modal" onClick={e => e.stopPropagation()}>
        <button className="cert-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="cert-modal-header">
          <div className="cert-modal-abbr" style={{ background: cert.color }}>{cert.abbr}</div>
          <div>
            <div className="cert-modal-title">{cert.title}</div>
            <div className="cert-modal-issuer">{cert.issuer}</div>
          </div>
        </div>
        <div className="cert-modal-img-wrap">
          <img
            src={cert.image}
            alt={`${cert.title} certificate`}
            className="cert-modal-img"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className="cert-modal-placeholder">
            <div className="cert-placeholder-abbr" style={{ background: cert.color }}>{cert.abbr}</div>
            <p>Certificate image not yet uploaded.<br />Add it to <code>/public/certs/</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [activeCert, setActiveCert] = useState(null);
  const [loading, setLoading] = useState(true);
  useReveal();

  useEffect(() => {
    async function load() {
      await seedIfNeeded();
      const all = await getAllProjects();
      setProjects(all.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main>

      {/* ══════════════════════════════════════════
          HERO — editorial 3-column layout
      ══════════════════════════════════════════ */}
      <section className="hero">
        {/* Left: text content */}
        <div className="hero-center">
          <div className="hero-eyebrow">
            <span className="status-dot" />
            Available for opportunities
          </div>
          <h1 className="hero-display">
            I make complex<br />things <em>feel simple</em>
          </h1>
          <p className="hero-byline">— Gourish Pawaskar, UI/UX Designer</p>
          <p className="hero-subtitle">SaaS · AI Platforms · Enterprise</p>
          <div className="hero-actions">
            <Link to="/portfolio" className="btn-primary">View Portfolio →</Link>
            <Link to="/contact" className="btn-outline">Let's Talk</Link>
          </div>

          {/* Stats strip below CTAs */}
          <div className="hero-stats-strip">
            {[['4+','Years experience'],['20+','Products shipped'],['5','Certifications']].map(([n,l]) => (
              <div key={l} className="hero-stat-item">
                <div className="hero-stat-num">{n}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: full-height photo */}
        <div className="hero-photo-panel">
          <img src={mePic} alt="Gourish Pawaskar" className="hero-photo" />
          <div className="hero-photo-fade" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT ME — 2-column with metric
      ══════════════════════════════════════════ */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            {/* Left: text + metric */}
            {/* Left: text */}
            <div className="about-left">
              <div className="section-label">About Me</div>
              <p className="about-lead">
                I specialise in solving complex problems through elegant solutions — blending creativity with
                strategic thinking to deliver designs that not only look great but work seamlessly.
              </p>
              <p className="about-body">
                Product-focused designer crafting accessible, human-centred experiences for enterprise SaaS,
                AI-driven platforms, and government systems. Based in Bengaluru, Karnataka.
              </p>
            </div>

            {/* Right: metric card + bullets */}
            <div className="about-right">
              <div className="about-metric-card reveal">
                <div className="about-metric-num">40%</div>
                <p className="about-metric-desc">
                  Average increase in client engagement in the first 6 months — backed by measurable outcomes across every project.
                </p>
              </div>
              <div className="about-bullets reveal d1">
                {[
                  'With 4+ years of experience, specialising in crafting intuitive, user-focused designs that deliver seamless digital experiences.',
                  'I enjoy working directly with clients, blending creativity and logic to bring their vision to life through thoughtful, impactful design solutions.',
                ].map((point, i) => (
                  <div key={i} className="about-bullet">
                    <span className="about-bullet-icon">✓</span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LATEST WORKS — 3-column project cards
      ══════════════════════════════════════════ */}
      <section className="section works-section">
        <div className="container">
          <div className="works-header reveal">
            <div>
              <div className="section-label">Portfolio</div>
              <h2 className="section-title">Latest Works</h2>
            </div>
          </div>

          {loading ? (
            <div className="works-grid">
              {[1,2,3].map(i => <div key={i} className="proj-card-skeleton" />)}
            </div>
          ) : (
            <div className="works-grid">
              {projects.map((p, i) => (
                <div key={p.id} className={`reveal d${i}`}>
                  <ProjectCard {...p} featured={false} />
                </div>
              ))}
            </div>
          )}

          <div className="works-footer reveal">
            <Link to="/portfolio" className="btn-outline">Check out More →</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXPERIENCE — clean list style
      ══════════════════════════════════════════ */}
      <section className="section exp-section">
        <div className="container">
          <div className="exp-header reveal">
            <div>
              <div className="section-label">Experiences</div>
              <h2 className="section-title">Explore My Design Journey</h2>
            </div>
            <div className="exp-header-right">
              <p className="exp-intro">
                Over the past 4+ years, I've had the opportunity to work on a wide range of design projects, collaborating with diverse teams and clients to bring creative visions to life.
              </p>
            </div>
          </div>

          <div className="exp-list">
            {[
              {
                company: 'Sustainext Digital Pvt Ltd',
                loc: 'Bengaluru, KA',
                date: 'Nov 2025 — Present',
                role: 'UI/UX Designer',
                desc: 'Designing scalable UI/UX for an enterprise SaaS platform focused on ESG management and Agentic AI-driven workflows.',
                tags: ['SaaS', 'Agentic AI'],
                current: true,
              },
              {
                company: 'Bharat Electronics Limited',
                loc: 'Bengaluru, KA',
                date: 'Jan – Nov 2025',
                role: 'UI/UX Designer',
                desc: 'Led end-to-end UI/UX for confidential government & defence platforms. Streamlined handoffs, cutting turnaround 20%.',
                tags: ['UX', 'WCAG 2.1'],
              },
              {
                company: 'Nudijenu Publishers',
                loc: 'Karwar, KA',
                date: 'Jun 2024 – Dec 2024',
                role: 'UI/UX Designer',
                desc: 'Redesigned and launched responsive websites, improving digital reach by 30%. Conducted user research, wireframing, and prototyping.',
                tags: ['Branding', 'UX'],
              },
              {
                company: 'Nudijenu Publishers',
                loc: 'Karwar, KA',
                date: 'Aug 2020 – Mar 2023',
                role: 'Layout Artist',
                desc: 'Modernised print layouts and visual hierarchy resulting in a 42% increase in NPS. Standardised reusable templates.',
                tags: ['Print', 'Branding'],
              },
            ].map((job, i) => (
              <div key={i} className={`exp-row reveal d${i % 3}`}>
                <div className="exp-row-meta">
                  <div className="exp-company">{job.company}{job.current && <span className="exp-badge">Current</span>}</div>
                  <div className="exp-loc-date">{job.loc} · {job.date}</div>
                </div>
                <div className="exp-row-body">
                  <div className="exp-role">{job.role}</div>
                  <p className="exp-desc">{job.desc}</p>
                </div>
                <div className="exp-row-right">
                  <div className="exp-tags">
                    {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SKILLS — 4-cell grid
      ══════════════════════════════════════════ */}
      <section className="section skills-section">
        <div className="container">
          <div className="section-label">What I bring</div>
          <h2 className="section-title reveal">Skills &amp; Tools</h2>
          <p className="section-sub reveal d1">A full-stack design toolkit spanning research, prototyping, design systems, and front-end implementation.</p>
          <div className="skills-grid reveal d2">
            {[
              { icon: '✦', title: 'Core Tools', tags: ['Figma', 'Adobe XD', 'Photoshop', 'InDesign', 'Framer', 'Notion'] },
              { icon: '◈', title: 'Design Skills', tags: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Info Architecture', 'WCAG 2.1'] },
              { icon: '⬡', title: 'Domain Expertise', tags: ['SaaS Design', 'AI Product Design', 'ESG Platforms', 'Enterprise Apps', 'Agentic AI'] },
              { icon: '◻', title: 'Development', tags: ['HTML/CSS', 'ReactJS', 'Lovable AI', 'Builder.io', 'Bolt.new'] },
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

      {/* ══════════════════════════════════════════
          CERTIFICATIONS
      ══════════════════════════════════════════ */}
      <section className="section certs-section">
        <div className="container">
          <div className="section-label">Credentials</div>
          <h2 className="section-title reveal">Certifications</h2>
          <p className="section-sub reveal d1">Continuous learning across design theory, web dynamics, and project management. Click any card to view the certificate.</p>
          <div className="certs-grid">
            {CERTS.map((c, i) => (
              <button
                key={i}
                className={`cert-card reveal d${i % 4}`}
                onClick={() => setActiveCert(c)}
                aria-label={`View ${c.title} certificate`}
              >
                <div className="cert-card-body">
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
                <div className="cert-view-hint">
                  <span className="cert-arrow">↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cert lightbox */}
      {activeCert && <CertModal cert={activeCert} onClose={() => setActiveCert(null)} />}

      {/* ══════════════════════════════════════════
          EDUCATION
      ══════════════════════════════════════════ */}
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
            </div>
            <div className="edu-card reveal d1">
              <div>
                <div className="edu-degree">Bachelor of Science</div>
                <div className="edu-school">Government Arts and Science College, Karwar</div>
                <div className="edu-period">Jul 2018 — Nov 2021</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
