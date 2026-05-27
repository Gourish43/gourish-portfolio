import React, { useState } from 'react';
import './AdminLogin.css';

const ADMIN_PASSWORD = 'gourishfolio@design';

export default function AdminLogin({ onLogin }) {
  const [pw, setPw]         = useState('');
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState('');
  const [shaking, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('gourish_admin_auth', '1');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-text" aria-hidden>Admin</div>
      <div className={`login-card ${shaking ? 'shake' : ''}`}>
        <div className="login-logo">Gourish.</div>
        <div className="login-title">Admin Access</div>
        <p className="login-sub">Enter your password to manage projects.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                autoFocus
              />
              <button type="button" className="pw-toggle" onClick={() => setShow(s => !s)}>
                {show ? '🙈' : '👁'}
              </button>
            </div>
            {error && <div className="login-error">{error}</div>}
          </div>
          <button type="submit" className="login-btn">Enter Admin Panel →</button>
        </form>

        <div className="login-back">
          <a href="/">← Back to portfolio</a>
        </div>
      </div>
    </div>
  );
}
