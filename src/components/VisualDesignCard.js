import React, { useState } from 'react';
import Lightbox from './Lightbox';
import './VisualDesignCard.css';

export default function VisualDesignCard({ title, tags, images = [], visual, thumbnail, featured = false }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const category = tags?.[0] || 'Visual Design';

  // Build the image list: prefer the images array; fall back to thumbnail if provided
  const allImages = images.length > 0
    ? images
    : (thumbnail ? [thumbnail] : []);

  // Show at most 4 thumbs in the mosaic
  const mosaicImages = allImages.slice(0, 4);
  const count = mosaicImages.length;

  function openAt(i) {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }

  function handleCardClick() {
    if (allImages.length > 0) openAt(0);
  }

  return (
    <>
      <div
        className={`vd-card ${featured ? 'featured' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        aria-label={`View ${title} gallery`}
      >
        <div className="vd-bg">
          {/* Gradient fallback background */}
          <div className={`vd-bg-gradient ${visual || 'pv-1'}`} />

          {/* Image mosaic */}
          {count > 0 ? (
            <div className={`vd-mosaic count-${count}`}>
              {mosaicImages.map((src, i) => (
                <div key={i} className="vd-thumb">
                  <img src={src} alt={`${title} ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className="vd-placeholder">
              <span className="vd-placeholder-icon">🖼</span>
              <span>Images coming soon</span>
            </div>
          )}

          {/* Dark scrim */}
          <div className="vd-scrim" />

          {/* Image count badge */}
          {allImages.length > 1 && (
            <div className="vd-count-badge">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M3 3V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              {allImages.length}
            </div>
          )}

          {/* Gallery icon on hover */}
          <div className="vd-gallery-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>

          {/* Bottom overlay */}
          <div className="vd-overlay">
            {category && <div className="vd-category">{category}</div>}
            <div className="vd-title">{title || 'Design Work'}</div>
            {allImages.length > 0 && (
              <div className="vd-cta-row">
                <span className="vd-cta">View Gallery</span>
                <span className="vd-arrow">→</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          title={title}
          onClose={() => setLightboxOpen(false)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </>
  );
}
