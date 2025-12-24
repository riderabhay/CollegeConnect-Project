import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { title: "🤖 AI JARVIS", desc: "Your personal AI tutor for 24/7 doubt solving.", icon: "🧠", color: "border-purple-500 text-purple-400" },
    { title: "⚡ Virtual Lab", desc: "Design & simulate circuits without hardware.", icon: "🔌", color: "border-yellow-500 text-yellow-400" },
    { title: "🤝 Find Partner", desc: "Connect with students matching your skills.", icon: "🔍", color: "border-pink-500 text-pink-400" },
    { title: "📚 Resource Hub", desc: "Access notes, PYQs & lectures instantly.", icon: "📂", color: "border-blue-500 text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative z-10 overflow-hidden">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 animate-pulse tracking-tight">
          COLLEGE CONNECT
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The Ultimate Ecosystem for Engineering Students. <br/>
          <span className="text-cyan-300">Learn. Build. Connect.</span>
        </p>
        
        <div className="flex gap-6">
          <button 
            onClick={() => navigate("/login")}
            className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] transition transform hover:-translate-y-1"
          >
            GET STARTED 🚀
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="border border-gray-600 hover:border-white px-8 py-3 rounded-full font-bold text-lg transition"
          >
            LOGIN
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl px-6 w-full mb-20">
        {features.map((f, i) => (
          <div key={i} className={`bg-gray-900/50 backdrop-blur-md border ${f.color} border-opacity-30 p-6 rounded-2xl hover:bg-gray-800 transition transform hover:-translate-y-2`}>
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className={`text-xl font-bold mb-2 ${f.color.split(" ")[1]}`}>{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto w-full text-center py-6 text-gray-600 text-xs border-t border-gray-900">
        Designed by Abhay Nishad • Powered by MERN Stack
      </div>

    </div>
  );
}