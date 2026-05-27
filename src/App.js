import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VisionCTA from './components/VisionCTA';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import DynamicProject from './pages/DynamicProject';
import Contact from './pages/Contact';
import './components/DynamicImages.css';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/portfolio"       element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<DynamicProject />} />
        <Route path="/contact"         element={<Contact />} />
      </Routes>
      <VisionCTA />
    </>
  );
}
