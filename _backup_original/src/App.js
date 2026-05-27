import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import DynamicProject from './pages/DynamicProject';
import Contact from './pages/Contact';
import AdminRoot from './admin/AdminRoot';
import './components/DynamicImages.css';

function Layout({ children }) {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                      element={<Home />} />
        <Route path="/portfolio"             element={<Portfolio />} />
        {/* ALL projects — built-in and admin-created — go through DynamicProject */}
        <Route path="/portfolio/:slug"       element={<DynamicProject />} />
        <Route path="/contact"              element={<Contact />} />
        <Route path="/admin/*"              element={<AdminRoot />} />
      </Routes>
    </Layout>
  );
}
