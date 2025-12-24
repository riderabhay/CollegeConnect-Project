import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Professional Alerts ke liye

// Components Import (Ensure karna ki ye files aapke folder mein hain)
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import SocialFeed from "./components/SocialFeed";
import ChatAssistant from "./components/ChatAssistant"; 
// Agar koi component nahi hai toh use comment kar dena taaki error na aaye

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Toaster: Ye screen ke upar alerts dikhayega */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#1F2937', // Dark Gray background
            color: '#fff',         // White Text
            borderRadius: '10px',
            border: '1px solid #10B981', // Green Border
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Login ke baad wale) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/social" element={<SocialFeed />} />
        <Route path="/chat" element={<ChatAssistant />} />
        
        {/* Agar koi galat link khole toh wapas Home bhej do */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}