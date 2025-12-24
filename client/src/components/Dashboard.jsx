import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check karo user login hai ya nahi
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first!");
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  if (!user) return null; // Jab tak user load na ho, kuch mat dikhao

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* Navbar */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Welcome, {user.username}! 👋
        </h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-bold text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Main Grid Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* 1. Social Feed Card */}
        <div 
          onClick={() => navigate("/social")}
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-green-500 cursor-pointer transition transform hover:-translate-y-2 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition">🌍</div>
          <h2 className="text-2xl font-bold mb-2 text-green-400">Campus Feed</h2>
          <p className="text-gray-400">See what's happening in college. Share photos & gossips!</p>
        </div>

        {/* 2. AI Chat Card */}
        <div 
          onClick={() => navigate("/chat")}
          className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-purple-500 cursor-pointer transition transform hover:-translate-y-2 group"
        >
          <div className="text-5xl mb-4 group-hover:scale-110 transition">🤖</div>
          <h2 className="text-2xl font-bold mb-2 text-purple-400">AI Jarvis</h2>
          <p className="text-gray-400">Stuck in code? Ask your personal AI assistant for help.</p>
        </div>

        {/* 3. Resources Card (Coming Soon) */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl opacity-70">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2 text-blue-400">Study Hub</h2>
          <p className="text-gray-500">Notes & Assignments (Coming Soon...)</p>
        </div>

      </div>
    </div>
  );
}