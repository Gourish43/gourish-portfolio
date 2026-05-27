import React from 'react';
import { Link } from 'react-router-dom';
import './VisionCTA.css';

export default function VisionCTA() {
  return (
    <section className="vision-cta-section">
      <div className="vision-cta-inner">
        <div className="vision-cta-left">
          <div className="vision-cta-eyebrow">
            <span className="status-dot" />
            Available for opportunities
          </div>
          <h2 className="vision-cta-title">Got a Vision?<br />Let's Bring It<br />to Life!</h2>
          <p className="vision-cta-sub">
            I'm always excited to collaborate on new and innovative projects. Whether you're starting from scratch or refining an existing idea — let's make it happen.
          </p>
          <div className="vision-cta-actions">
            <Link to="/contact" className="btn-primary">Let's Talk →</Link>
            <Link to="/portfolio" className="btn-outline-light">See My Work</Link>
          </div>
        </div>

        <div className="vision-cta-right">
          <div className="vision-contact-label">Reach me at</div>
          <a href="mailto:gourish63pawaskar@gmail.com" className="vision-email">
            gourish63pawaskar<br />@gmail.com
          </a>
          <div className="vision-socials">
            <a href="https://www.linkedin.com/in/gourish-pawaskar-0b042b245/" target="_blank" rel="noreferrer" className="vision-social-link">
              LinkedIn ↗
            </a>
            <a href="https://www.behance.net/gourishpawaskar" target="_blank" rel="noreferrer" className="vision-social-link">
              Behance ↗
            </a>
            <a href="/Gourish_Pawaskar_Resume.pdf" target="_blank" rel="noreferrer" className="vision-social-link">
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
