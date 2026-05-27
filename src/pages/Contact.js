import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const OPPORTUNITY_TYPES = [
  'Full-time Role',
  'Contract / Freelance',
  'Collaboration',
  'Design Consultation',
  'Just saying hi',
];

const INITIAL = { name: '', email: '', company: '', opportunityType: '', message: '' };

/* ── SVG Icons ── */
const IconMail = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>
  </svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const IconBehance = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 15H4V9h5c1.7 0 3 1 3 3s-1.3 3-3 3zM4 6h4c1.4 0 2.5.8 2.5 2.3S9.4 11 8 11H4V6z"/>
    <path d="M15 10h5.5c-.2-1.5-1.4-2.5-2.8-2.5S15.3 8.5 15 10z"/>
    <path d="M20.5 12H15c.2 1.7 1.3 2.8 2.7 2.8 1 0 1.8-.5 2.2-1.3H22c-.6 2-2.4 3.3-4.3 3.3-2.8 0-4.7-2-4.7-4.8S14.9 7.2 17.7 7.2 22.5 9.3 22.5 12h-2z"/>
    <line x1="15" y1="5.5" x2="20" y2="5.5"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.opportunityType) e.opportunityType = 'Please select a type';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 20) e.message = 'At least 20 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus('sending');
    try {
      const SERVICE_ID  = 'service_ygdkyib';
      const TEMPLATE_ID = 'template_plpf7rj';
      const PUBLIC_KEY  = 'ed6OBjHy4tQLdn-u2';
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: form.name, from_email: form.email,
        company: form.company || 'Not specified',
        opportunity_type: form.opportunityType,
        message: form.message, to_name: 'Gourish', reply_to: form.email,
      }, PUBLIC_KEY);
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const handleReset = () => { setStatus('idle'); setErrors({}); };

  return (
    <main className="contact-page">

      {/* ── HERO ── */}
      <div className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-eyebrow">Get in touch</div>
          <h1 className="contact-title">Let's work<br /><em>together</em></h1>
          <p className="contact-subtitle">
            Open to full-time UI/UX roles, contract projects, and design collaborations.
            Based in Bengaluru — available remotely too.
          </p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="contact-body">

        {/* LEFT: INFO */}
        <div className="contact-info-col">

          {/* Contact items */}
          <div className="contact-info-title">Contact details</div>
          <div className="contact-items">
            {[
              { Icon: IconMail,     label: 'Email',    value: 'gourish63pawaskar@gmail.com', href: 'mailto:gourish63pawaskar@gmail.com' },
              { Icon: IconPhone,    label: 'Phone',    value: '+91 93433 46829',             href: 'tel:+919343346829' },
              { Icon: IconLocation, label: 'Location', value: 'Bengaluru, Karnataka, India', href: null },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="contact-item">
                <div className="contact-item-icon"><Icon /></div>
                <div className="contact-item-text">
                  <div className="contact-item-label">{label}</div>
                  {href
                    ? <a href={href} className="contact-item-value">{value}</a>
                    : <div className="contact-item-value">{value}</div>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="contact-socials">
            <div className="contact-info-title">Connect</div>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/gourish-pawaskar-0b042b245/" target="_blank" rel="noreferrer" className="social-link">
                <span className="social-icon"><IconLinkedIn /></span>
                <span className="social-name">LinkedIn</span>
                <span className="social-arrow">↗</span>
              </a>
              <a href="https://www.behance.net/gourishpawaskar" target="_blank" rel="noreferrer" className="social-link">
                <span className="social-icon"><IconBehance /></span>
                <span className="social-name">Behance</span>
                <span className="social-arrow">↗</span>
              </a>
            </div>
          </div>

          {/* Languages */}
          <div className="contact-languages">
            <div className="contact-info-title">Languages</div>
            <div className="lang-tags">
              {['English', 'Kannada', 'Hindi', 'Konkani'].map(l => (
                <span key={l} className="lang-tag">{l}</span>
              ))}
            </div>
          </div>
            </div>

        {/* RIGHT: FORM */}
        <div className="contact-form-col">
          {status === 'success' ? (
            <div className="form-success">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Message sent!</h2>
              <p className="success-desc">Thanks for reaching out. I'll get back to you within 24–48 hours.</p>
              <button className="btn-primary" onClick={handleReset}>Send another →</button>
            </div>
          ) : (
            <>
              <div className="form-heading">Send a message</div>
              <div className="form-subheading">Fill out the form and I'll get back to you shortly.</div>

              {status === 'error' && (
                <div className="form-error-banner">
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} noValidate className="contact-form">
                <div className="form-row">
                  <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" name="name" type="text" placeholder="Your full name"
                      value={form.name} onChange={handleChange} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" placeholder="your@email.com"
                      value={form.email} onChange={handleChange} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company / Studio</label>
                    <input id="company" name="company" type="text" placeholder="Where you work (optional)"
                      value={form.company} onChange={handleChange} />
                  </div>
                  <div className={`form-group ${errors.opportunityType ? 'has-error' : ''}`}>
                    <label htmlFor="opportunityType">Opportunity Type *</label>
                    <select id="opportunityType" name="opportunityType"
                      value={form.opportunityType} onChange={handleChange}>
                      <option value="">Select one…</option>
                      {OPPORTUNITY_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.opportunityType && <span className="field-error">{errors.opportunityType}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" rows={6}
                    placeholder="Tell me about the opportunity, project, or just say hello…"
                    value={form.message} onChange={handleChange} />
                  <div className="char-count"
                    style={{ color: form.message.length >= 20 ? 'var(--text-3)' : '#c0392b' }}>
                    {form.message.length} / 20 min
                  </div>
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <hr className="form-divider" />

                <div className="form-footer">
                  <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                    {status === 'sending' ? (<><span className="spinner" /> Sending…</>) : 'Send message →'}
                  </button>
                  <span className="form-note">I typically respond within 24–48 hours.</span>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </main>
  );
}
