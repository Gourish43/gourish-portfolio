import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <span className="nav-logo-icon">✦</span> Gourish Pawaskar
      </Link>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/portfolio" className={isActive('/portfolio') ? 'active' : ''}>Portfolio</Link></li>
        <li>
          <a
            href="public/thumbnails/Gourish_Pawaskar_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="nav-resume"
          >
            Resume ↗
          </a>
        </li>
        <li><Link to="/contact" className={`nav-cta ${isActive('/contact') ? 'active-cta' : ''}`}>Let's Talk</Link></li>
      </ul>

      <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}
