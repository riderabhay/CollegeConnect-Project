import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; // ✅ Config Import

export default function FindPartner() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const colors = ["from-pink-500 to-purple-500", "from-blue-500 to-cyan-500", "from-orange-500 to-red-500", "from-green-500 to-emerald-500"];

  useEffect(() => { if (!currentUser) { navigate("/login"); return; } fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      // ✅ API_URL Updated
      const res = await axios.get(`${API_URL}/api/auth/all/students`);
      const others = res.data.filter(s => s._id !== currentUser._id);
      setStudents(others);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleConnect = () => { alert(`Request sent to ${students[currentIndex].username}! 📩`); nextProfile(); };
  const handleSkip = () => { nextProfile(); };
  const nextProfile = () => { if (currentIndex < students.length - 1) { setCurrentIndex(currentIndex + 1); } else { alert("No more profiles!"); setCurrentIndex(0); } };
  
  if (loading) return <div className="text-white text-center mt-20">Searching Campus... 📡</div>;
  if (students.length === 0) return <div className="text-white text-center mt-20">No other students found yet!</div>;

  const currentProfile = students[currentIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative z-10 p-4">
      <button onClick={() => navigate("/dashboard")} className="absolute top-6 left-6 text-gray-400 hover:text-white bg-black/50 px-3 py-1 rounded-full border border-gray-700">⬅️ Dashboard</button>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 mb-8">FIND PROJECT PARTNER 🤝</h1>
      <div className="relative w-full max-w-sm h-[520px]">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[currentIndex % 4]} opacity-20 blur-3xl rounded-full`}></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-3xl p-6 h-full shadow-2xl flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors[currentIndex % 4]} flex items-center justify-center text-4xl mb-4 shadow-lg border-4 border-black font-bold text-white`}>{currentProfile.username.charAt(0).toUpperCase()}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{currentProfile.username}</h2>
          <p className="text-cyan-400 font-bold text-sm mb-4">{currentProfile.branch || "Unknown"} • {currentProfile.year || "Year N/A"}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6 h-16 overflow-hidden">{currentProfile.skills?.map((skill, idx) => (<span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-600">{skill}</span>))}</div>
          <div className="bg-black/40 p-4 rounded-xl text-gray-400 text-sm italic w-full mb-auto h-24 overflow-y-auto border border-gray-800">"{currentProfile.bio || "Hey there!"}"</div>
          <div className="flex gap-4 w-full mt-6">
            <button onClick={handleSkip} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:bg-gray-800 font-bold">❌ SKIP</button>
            <button onClick={handleConnect} className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${colors[currentIndex % 4]} text-white font-bold shadow-lg`}>✨ CONNECT</button>
          </div>
        </div>
      </div>
    </div>
  );
}