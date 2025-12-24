import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // ✅ Loader Import kiya

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Shuru mein null rakho

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Agar user nahi hai to Login par bhejo
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Landing Page par jao
  };

  // ✅ Saare Features ki List
  const features = [
    { title: "👤 My Profile", path: "/profile", color: "from-blue-500 to-cyan-500", icon: "🆔", desc: "Edit your identity & skills" },
    { title: "🤖 Ask JARVIS", path: "/ai-chat", color: "from-purple-500 to-pink-500", icon: "🧠", desc: "AI Doubt Solver 24/7" },
    { title: "🌍 Campus Feed", path: "/social", color: "from-green-500 to-emerald-500", icon: "📸", desc: "Share photos & updates" },
    { title: "💬 Group Chat", path: "/chat", color: "from-pink-500 to-rose-500", icon: "💬", desc: "Live discussions room" },
    { title: "📚 Resource Hub", path: "/resources", color: "from-blue-600 to-indigo-600", icon: "📚", desc: "Download Notes & PYQs" },
    { title: "🤝 Find Partner", path: "/find-partner", color: "from-orange-500 to-red-500", icon: "🤝", desc: "Match with project buddies" },
    
    // ⚡ ECE Special Features
    { title: "⚡ Virtual Lab", path: "/lab", color: "from-yellow-400 to-orange-500", icon: "🔌", desc: "Simulate Electronics" },
    { title: "📂 My Projects", path: "/saved-experiments", color: "from-gray-600 to-gray-400", icon: "💾", desc: "Your saved circuits" },
  ];

  // ✅ Safety Check: Jab tak user load na ho, Loader dikhao
  if (!user) {
     return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 text-white">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-12 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tight drop-shadow-lg">
            COLLEGECONNECT
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-lg">
            Your Digital Campus • <span className="text-cyan-400 font-bold">Welcome, {user?.username} 👋</span>
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition duration-300 border border-red-600/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
        >
          LOGOUT 🚪
        </button>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {features.map((item, index) => (
          <div 
            key={index}
            onClick={() => navigate(item.path)}
            className="group relative cursor-pointer bg-gray-900/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col justify-between h-44 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition duration-500`}></div>

            <div className="flex justify-between items-start z-10">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="text-gray-600 group-hover:text-white transition text-2xl group-hover:translate-x-1">➔</div>
            </div>
            
            <div className="z-10 mt-4">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-300 transition">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-gray-600 text-xs tracking-[0.2em] uppercase opacity-60">
        System Online • Secure Connection • V1.0
      </div>
    </div>
  );
}