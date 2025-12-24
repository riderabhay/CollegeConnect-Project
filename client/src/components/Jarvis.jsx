// client/src/components/Jarvis.jsx
import React from 'react';

// Yeh component background mein chalta hai aur voice commands ko Dashboard ko bhejta hai
const Jarvis = ({ onCommand }) => {
  
  // Dummy voice command simulation for now (API Bypassed)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onCommand('open chat');
  //   }, 15000);
  //   return () => clearTimeout(timer);
  // }, [onCommand]);
  
  return (
    <div className="absolute top-0 right-1/2 transform translate-x-1/2 p-2 bg-black/50 text-xs text-gray-500 rounded-b-lg z-50">
      <span className='animate-pulse text-cyan-400'>•</span> Voice Command Listener Active
    </div>
  );
};

export default Jarvis;