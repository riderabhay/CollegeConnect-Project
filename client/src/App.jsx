import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- 📦 Components Import ---
import LandingPage from './components/LandingPage'; // ✅ NEW IMPORT
import LoginRegister from './components/LoginRegister';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SocialFeed from './components/SocialFeed';
import AIChat from './components/AIChat';           
import Chat from './components/Chat';               
import FindPartner from './components/FindPartner'; 
import Hero3D from './components/Hero3D';           
import VirtualLab from './components/VirtualLab';   
import SavedExperiments from './components/SavedExperiments'; 
import ResourceHub from './components/ResourceHub'; 

function App() {
  const user = localStorage.getItem("user");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      
      {/* 🌌 UNIVERSE BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Hero3D />
      </div>

      {/* 📄 MAIN CONTENT */}
      <div className="relative z-10 w-full min-h-screen">
        <Routes>
          {/* ✅ CHANGE 1: Home Route ab Landing Page hai */}
          <Route path="/" element={<LandingPage />} />
          
          {/* ✅ CHANGE 2: Login Route alag se */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginRegister />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Features */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/social" element={<SocialFeed />} />    
          <Route path="/ai-chat" element={<AIChat />} />       
          <Route path="/chat" element={<Chat />} />            
          <Route path="/find-partner" element={<FindPartner />} /> 
          <Route path="/resources" element={<ResourceHub />} />
          <Route path="/lab" element={<VirtualLab />} />
          <Route path="/saved-experiments" element={<SavedExperiments />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default App;