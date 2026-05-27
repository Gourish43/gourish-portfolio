import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ to, visual, tags, title, thumbnail, featured = false }) {
  const category = tags?.[0] || '';

  return (
    <Link to={to} className={`proj-card ${featured ? 'featured' : ''}`}>
      <div
        className="proj-bg"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
      >
        {!thumbnail && <div className={`proj-bg-gradient ${visual || 'pv-1'}`} />}
        <div className="proj-scrim" />
        <div className="proj-overlay">
          {category && <div className="proj-category">{category}</div>}
          <div className="proj-title">{title || 'Project Title'}</div>
        </div>
      </div>
    </Link>
  );
}
