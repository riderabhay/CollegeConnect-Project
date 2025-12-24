import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config"; // ✅ Config Import

export default function ResourceHub() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filterBranch, setFilterBranch] = useState("All");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", branch: "CSE", link: "", type: "PDF" });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => { if (!user) navigate("/login"); fetchNotes(); }, [filterBranch]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      // ✅ API_URL Updated
      const res = await axios.get(`${API_URL}/api/notes/${filterBranch}`);
      setNotes(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpload = async () => {
    if (!form.title || !form.link) return alert("Please fill all details!");
    try {
      // ✅ API_URL Updated
      await axios.post(`${API_URL}/api/notes/add`, { ...form, addedBy: user.username });
      alert("✅ Resource Uploaded!");
      setForm({ title: "", subject: "", branch: "CSE", link: "", type: "PDF" }); fetchNotes();
    } catch (err) { console.error(err); alert("❌ Upload Failed"); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative z-10 flex flex-col items-center">
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 bg-gray-900/80 p-6 rounded-2xl border border-blue-500/30">
        <div><h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">📚 RESOURCE HUB</h1></div>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-700 px-6 py-2 rounded-xl font-bold">Back</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="lg:w-1/3 bg-gray-900 border border-gray-800 p-6 rounded-2xl h-fit shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">📤 Upload Material</h2>
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white" />
            <input value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} placeholder="Subject" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white" />
            <div className="flex gap-2"><select value={form.branch} onChange={(e) => setForm({...form, branch: e.target.value})} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white"><option value="CSE">CSE</option><option value="ECE">ECE</option><option value="ME">ME</option><option value="CE">CE</option></select></div>
            <input value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} placeholder="Link (Drive/PDF)" className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white" />
            <button onClick={handleUpload} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 py-2 rounded-lg font-bold shadow-lg mt-2">UPLOAD NOW</button>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2">{["All", "CSE", "ECE", "ME", "CE"].map((branch) => (<button key={branch} onClick={() => setFilterBranch(branch)} className={`px-4 py-1 rounded-full text-sm font-bold border transition ${filterBranch === branch ? "bg-cyan-500 text-black border-cyan-500" : "bg-black text-gray-400 border-gray-700"}`}>{branch}</button>))}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? <div className="text-gray-500 animate-pulse">Loading...</div> : notes.map((note) => (
              <div key={note._id} className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl hover:border-cyan-500/50 transition">
                <h3 className="text-lg font-bold text-white">{note.title}</h3>
                <p className="text-sm text-gray-400">{note.subject} • by {note.addedBy}</p>
                <a href={note.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm font-bold mt-2">🔗 OPEN</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}