import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import VisionCTA from './components/VisionCTA';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import DynamicProject from './pages/DynamicProject';
import Contact from './pages/Contact';
import AdminPanel from './admin/AdminPanel';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/portfolio"       element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<DynamicProject />} />
        <Route path="/contact"         element={<Contact />} />
        <Route path="/admin"           element={<AdminPanel />} />
      </Routes>
      {!isAdmin && <VisionCTA />}
    </>
  );
}
