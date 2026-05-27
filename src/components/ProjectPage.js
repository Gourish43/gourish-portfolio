import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

export function MetricStrip({ metrics }) {
  return (
    <div className="cs-metric-strip">
      {metrics.map(([num, label]) => (
        <div key={label} className="cs-metric-cell">
          <div className="cs-metric-num">{num}</div>
          <div className="cs-metric-lbl">{label}</div>
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }) {
  return (
    <div className="cs-steps">
      {steps.map(([num, name, desc]) => (
        <div key={num} className="cs-step">
          <div className="cs-step-num">{num}</div>
          <div className="cs-step-body">
            <div className="cs-step-name">{name}</div>
            <div className="cs-step-desc">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ToolRow({ tools }) {
  return (
    <div className="cs-tool-row">
      {tools.map(t => <span key={t} className="tag">{t}</span>)}
    </div>
  );
}

export function Highlight({ children }) {
  return (
    <div className="cs-highlight-box">
      <span className="cs-highlight-icon">❝</span>
      <p>{children}</p>
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <ul className="cs-list">
      {items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

export default function ProjectPage({ accentBg = 'var(--off-white)', heroStats, tags, title, desc, thumbnail, toc, children, nextTitle, nextTo }) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.cs-block');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <div className="proj-hero" style={{ background: accentBg }}>
        <div className="proj-hero-inner container">

          {/* Top row: back button ← → tags */}
          <div className="proj-hero-top">
            <Link to="/portfolio" className="proj-back">
              <span className="proj-back-arrow">←</span>
              Back to Portfolio
            </Link>
            <div className="proj-hero-meta">
              {tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>

          {/* 2-col: title left, description right */}
          <div className="proj-hero-grid">
            <h1 className="proj-hero-title">{title}</h1>
            <p className="proj-hero-desc">{desc}</p>
          </div>

          {/* Stats strip */}
          {heroStats && (
            <div className="proj-hero-stats">
              {heroStats.map(([val, label]) => (
                <div key={label} className="proj-stat-item">
                  <div className="proj-stat-val">{val}</div>
                  <div className="proj-stat-label">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail — shown below stats if available */}
        {thumbnail && (
          <div className="proj-hero-thumbnail">
            <div className="proj-hero-thumbnail-inner">
              <img src={thumbnail} alt={title} className="proj-hero-img" />
            </div>
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div className="proj-body-wrap">
        <aside className="proj-sidebar">
          <div className="proj-sidebar-title">Contents</div>
          <ul className="proj-sidebar-nav">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeSection === id ? 'active' : ''}
                  onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="proj-content">{children}</div>
      </div>

      {/* ── CTA STRIP ── */}
      <div className="contact-cta-strip">
        <div className="cta-inner">
          <div className="cta-eyebrow">Let's work together</div>
          <h2 className="cta-title">Interested in my work?</h2>
          <p className="cta-sub">Let's discuss how I can bring this depth of thinking to your product.</p>
          <Link to="/contact" className="btn-primary">Let's Talk →</Link>
        </div>
      </div>

      {/* ── NEXT PROJECT ── */}
      {nextTitle && (
        <div className="proj-next">
          <div className="proj-next-label">Next project</div>
          <div className="proj-next-title">{nextTitle} →</div>
          <Link to={nextTo} className="btn-white">View case study</Link>
        </div>
      )}
    </main>
  );
}
