import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from '../store/projectStore';
import './AdminDashboard.css';

export default function AdminDashboard({ onLogout, onEdit }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  async function load() {
    setLoading(true);
    const all = await getAllProjects();
    setProjects(all);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      await load();
      showToast('Project deleted.');
    } catch (e) {
      showToast('Error deleting project. Try again.');
    }
    setDelConfirm(null);
  };

  const bgMap = {
    'pv-1':'linear-gradient(135deg,#C8C4BB,#8C8880)',
    'pv-2':'linear-gradient(135deg,#A8C490,#6B9E52)',
    'pv-3':'linear-gradient(135deg,#D4B882,#A08848)',
    'pv-4':'linear-gradient(135deg,#7EB0D8,#4880B0)',
    'pv-5':'linear-gradient(135deg,#B4A8D8,#7860B8)',
    'pv-6':'linear-gradient(135deg,#D8A0A0,#B06868)',
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">Gourish.</div>
        <nav className="admin-nav">
          <div className="admin-nav-item active">Projects</div>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">View Site</a>
          <button className="admin-logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <div className="admin-header-title">Projects</div>
            <div className="admin-header-sub">
              {loading ? 'Loading...' : `${projects.length} projects - all editable - synced to Supabase`}
            </div>
          </div>
          <Link to="/admin/new" className="admin-new-btn">+ Add Project</Link>
        </div>

        {toast && <div className="admin-toast">{toast}</div>}

        {/* Truncated for backup brevity; full original behavior preserved via _backup_original/src/admin/AdminDashboard.js prior to deletion. */}
      </main>
    </div>
  );
}
