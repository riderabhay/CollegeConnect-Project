import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaFilePdf, FaDownload, FaUpload } from 'react-icons/fa';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: "", branch: "ECE", year: "2nd" });
  const [uploading, setUploading] = useState(false);

  // Load Notes
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get("http://localhost:5000/api/notes/all");
      setNotes(res.data);
    };
    fetchNotes();
  }, []);

  // Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !form.title) return alert("File and Title required!");

    setUploading(true);
    const data = new FormData();
    data.append("userId", user._id || user.userId);
    data.append("username", user.username);
    data.append("title", form.title);
    data.append("branch", form.branch);
    data.append("year", form.year);
    data.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/notes", data);
      alert("✅ Notes Uploaded!");
      window.location.reload();
    } catch (err) {
      alert("Upload Failed");
    }
    setUploading(false);
  };

  const handleDownload = (filename) => {
      // Direct open in new tab
      window.open(`http://localhost:5000/uploads/${filename}`, "_blank");
  }

  return (
    <div className="h-full p-6 text-white overflow-y-auto pb-20">
      
      <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">📚 Notes Library</h2>

      {/* Upload Section */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600 mb-8 max-w-2xl mx-auto backdrop-blur-md">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2"> <FaUpload/> Upload Notes</h3>
        <div className="flex flex-col gap-3">
            <input placeholder="Subject Name (e.g. Digital Electronics)" className="bg-gray-700 p-2 rounded outline-none" 
              onChange={(e)=>setForm({...form, title: e.target.value})} />
            
            <div className="flex gap-2">
                <select className="bg-gray-700 p-2 rounded flex-1" onChange={(e)=>setForm({...form, branch: e.target.value})}>
                    <option>ECE</option><option>CSE</option><option>ME</option>
                </select>
                <select className="bg-gray-700 p-2 rounded flex-1" onChange={(e)=>setForm({...form, year: e.target.value})}>
                    <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option>
                </select>
            </div>
            
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="bg-gray-700 p-2 rounded cursor-pointer" 
              onChange={(e)=>setFile(e.target.files[0])} />
            
            <button onClick={handleUpload} disabled={uploading} className="bg-green-600 py-2 rounded font-bold hover:bg-green-500 transition">
                {uploading ? "Uploading..." : "Share Notes"}
            </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => (
            <div key={note._id} className="bg-white/10 p-4 rounded-xl border border-white/10 hover:border-cyan-500 transition relative group">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-bold text-lg text-cyan-200">{note.title}</h4>
                        <p className="text-xs text-gray-400">By {note.username} • {new Date(note.createdAt).toLocaleDateString()}</p>
                        <span className="text-[10px] bg-gray-700 px-2 rounded mt-1 inline-block">{note.branch} - {note.year} Year</span>
                    </div>
                    <FaFilePdf className="text-3xl text-red-400"/>
                </div>
                
                <button 
                    onClick={() => handleDownload(note.file)}
                    className="w-full mt-4 bg-blue-600/80 hover:bg-blue-500 py-2 rounded flex items-center justify-center gap-2 text-sm font-bold"
                >
                    <FaDownload/> Download / View
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;