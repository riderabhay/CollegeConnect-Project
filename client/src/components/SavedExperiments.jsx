import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SavedExperiments() {
  const navigate = useNavigate();
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/circuits/${user._id}`);
      setCircuits(res.data);
    } catch (err) {
      console.error("Error fetching circuits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (circuit) => {
    // ⚡ MAGIC: Hum circuit ka data lekar Lab mein jayenge
    navigate("/lab", { state: { loadCircuit: circuit } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      // Delete API abhi banayi nahi hai, par UI se hata dete hain
      // Real backend delete baad mein add karenge
      setCircuits(circuits.filter(c => c._id !== id));
      alert("Project removed from list.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative z-10 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 bg-gray-900/80 p-6 rounded-2xl border border-yellow-500/30">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            📂 MY SAVED EXPERIMENTS
          </h1>
          <p className="text-gray-400 mt-1">Your engineering masterpieces safe in cloud.</p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl font-bold">
          Back
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-yellow-400 animate-pulse text-xl">Loading Projects... 📡</div>}

      {/* Empty State */}
      {!loading && circuits.length === 0 && (
        <div className="text-center mt-20 opacity-50">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold">No Saved Projects Found</h2>
          <button onClick={() => navigate("/lab")} className="mt-4 text-cyan-400 underline">
            Go to Lab & Create One
          </button>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {circuits.map((circuit) => (
          <div key={circuit._id} className="bg-gray-900/60 border border-gray-700 rounded-2xl p-5 hover:border-yellow-500 transition-all hover:-translate-y-1 shadow-lg group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center text-2xl border border-yellow-500/30 group-hover:bg-yellow-500/20">
                ⚡
              </div>
              <span className="text-xs text-gray-500 bg-black px-2 py-1 rounded border border-gray-800">
                {new Date(circuit.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{circuit.name}</h3>
            <p className="text-sm text-gray-400 mb-6">
              {circuit.components.length} Components Used
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => handleOpen(circuit)}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-2 rounded-lg font-bold text-sm shadow-lg"
              >
                📂 OPEN PROJECT
              </button>
              <button 
                onClick={() => handleDelete(circuit._id)}
                className="px-3 bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}