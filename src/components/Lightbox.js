import React, { useEffect, useCallback } from 'react';
import './Lightbox.css';

export default function Lightbox({ images = [], index = 0, onClose, onChangeIndex, title }) {
  const total = images.length;

  const goPrev = useCallback(() => {
    onChangeIndex((index - 1 + total) % total);
  }, [index, total, onChangeIndex]);

  const goNext = useCallback(() => {
    onChangeIndex((index + 1) % total);
  }, [index, total, onChangeIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   goPrev();
      if (e.key === 'ArrowRight')  goNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!images.length) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Title */}
      {title && <div className="lightbox-title">{title}</div>}

      {/* Close */}
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>

      {/* Stage — stop propagation so clicks on image don't close */}
      <div className="lightbox-stage" onClick={e => e.stopPropagation()}>
        {/* Prev arrow */}
        {total > 1 && (
          <button className="lightbox-arrow prev" onClick={goPrev} aria-label="Previous">‹</button>
        )}

        {/* Image */}
        <img
          key={index}
          className="lightbox-img"
          src={images[index]}
          alt={`${title || 'Design'} ${index + 1}`}
          draggable={false}
        />

        {/* Next arrow */}
        {total > 1 && (
          <button className="lightbox-arrow next" onClick={goNext} aria-label="Next">›</button>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="lightbox-dots" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <div
              key={i}
              className={`lightbox-dot ${i === index ? 'active' : ''}`}
              onClick={() => onChangeIndex(i)}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {total > 1 && (
        <div className="lightbox-counter" onClick={e => e.stopPropagation()}>
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
}
