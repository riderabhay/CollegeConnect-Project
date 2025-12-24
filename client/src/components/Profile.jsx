import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { API_URL } from "../config"; // ✅ Config Import

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!storedUser) return;
    try {
      // ✅ API_URL Updated
      const res = await axios.get(`${API_URL}/api/auth/${storedUser._id}`);
      setUser(res.data);
      setBranch(res.data.branch || "");
      setYear(res.data.year || "");
      setBio(res.data.bio || "");
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleUpdate = async () => {
    if (!storedUser) return;
    setLoading(true);
    const updatedData = { branch, year, bio, skills };
    try {
      // ✅ API_URL Updated
      const res = await axios.put(`${API_URL}/api/auth/update/${storedUser._id}`, updatedData);
      let currentUserData = JSON.parse(localStorage.getItem("user"));
      currentUserData = { ...currentUserData, ...res.data };
      localStorage.setItem("user", JSON.stringify(currentUserData));
      setUser(res.data);
      alert("✅ Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Update Failed!");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => { if (skillInput && !skills.includes(skillInput)) { setSkills([...skills, skillInput]); setSkillInput(""); } };
  const removeSkill = (skillToRemove) => { setSkills(skills.filter(s => s !== skillToRemove)); };

  if (!storedUser || !user || loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center relative z-10 p-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 flex flex-col items-center border-r border-gray-800 pr-0 md:pr-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-5xl font-bold mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">{user.username ? user.username.charAt(0).toUpperCase() : "?"}</div>
          <h2 className="text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-cyan-400 font-bold">{branch || "Branch N/A"} • {year || "Year N/A"}</p>
          <div className="mt-6 w-full"><h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Skills</h3><div className="flex flex-wrap gap-2 justify-center">{skills.length > 0 ? skills.map((s, i) => (<span key={i} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">{s}</span>)) : <span className="text-gray-600 text-xs">No skills added yet</span>}</div></div>
          <button onClick={() => navigate("/dashboard")} className="mt-auto bg-gray-800 hover:bg-gray-700 w-full py-2 rounded-xl text-sm font-bold mt-8 transition">⬅️ Back to Dashboard</button>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6">EDIT PROFILE ✏️</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="text-gray-500 text-xs uppercase ml-1">Branch</label><select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"><option value="">Select Branch</option><option value="CSE">CSE</option><option value="ECE">ECE</option><option value="ME">Mechanical</option><option value="CE">Civil</option></select></div>
            <div><label className="text-gray-500 text-xs uppercase ml-1">Year</label><select value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"><option value="">Select Year</option><option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option></select></div>
          </div>
          <div className="mb-4"><label className="text-gray-500 text-xs uppercase ml-1">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none h-24 resize-none" /></div>
          <div className="mb-6"><label className="text-gray-500 text-xs uppercase ml-1">Add Skills (Press Enter)</label><div className="flex gap-2"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addSkill()} placeholder="e.g. Java, IoT..." className="flex-1 bg-black border border-gray-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" /><button onClick={addSkill} className="bg-gray-800 px-4 rounded-xl font-bold hover:bg-gray-700">+</button></div><div className="flex flex-wrap gap-2 mt-2">{skills.map((skill, index) => (<span key={index} className="bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2">{skill} <button onClick={() => removeSkill(skill)} className="hover:text-white">×</button></span>))}</div></div>
          <button onClick={handleUpdate} disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 rounded-xl font-bold shadow-lg transition active:scale-95">{loading ? "Saving..." : "💾 SAVE CHANGES"}</button>
        </div>
      </div>
    </div>
  );
}