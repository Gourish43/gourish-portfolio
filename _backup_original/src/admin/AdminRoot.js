import React, {useState} from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminProjectForm from './AdminProjectForm';
import './AdminLogin.css';
import './AdminDashboard.css';
import './AdminProjectForm.css';

export default function AdminRoot() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('gourish_admin_auth') === '1'
  );
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleLogin  = () => { setAuthed(true); };
  const handleLogout = () => {
    sessionStorage.removeItem('gourish_admin_auth');
    setAuthed(false);
    setEditId(null);
  };

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  return (
    <Routes>
      <Route path="/" element={
        <AdminDashboard
          onLogout={handleLogout}
          onEdit={(id) => { setEditId(id); navigate('/admin/edit'); }}
        />
      } />
      <Route path="/new" element={
        <AdminProjectForm
          editId={null}
          onSave={() => { setEditId(null); navigate('/admin'); }}
        />
      } />
      <Route path="/edit" element={
        editId
          ? <AdminProjectForm editId={editId} onSave={() => { setEditId(null); navigate('/admin'); }} />
          : <Navigate to="/admin" replace />
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
