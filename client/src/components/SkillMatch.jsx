import React, { useState } from 'react';
import axios from 'axios';

const SkillMatch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPartner = async () => {
    if(!query) return;
    setLoading(true);
    try {
      // Backend ko bolo: "Is skill wale bande dhundo"
      const res = await axios.get(`http://localhost:5000/api/users/match/find?skill=${query}`);
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="h-full p-6 text-white flex flex-col items-center overflow-y-auto">
      
      {/* Header */}
      <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
        🔥 Skill Match
      </h2>
      <p className="text-gray-400 mb-8">Find a study partner based on skills!</p>

      {/* Search Bar */}
      <div className="flex gap-2 w-full max-w-md mb-10">
        <input 
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
          placeholder="e.g. React, Python, ECE, Robotics..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={searchPartner}
          className="bg-yellow-600 px-6 py-2 rounded-lg font-bold hover:bg-yellow-500"
        >
          {loading ? "..." : "Find"}
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {results.map((u) => (
          <div key={u._id} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/20 transition">
            
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center font-bold text-xl">
              {u.username[0].toUpperCase()}
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{u.username}</h3>
              <p className="text-sm text-gray-300">{u.branch} | {u.year}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {u.skills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-gray-700 px-2 py-1 rounded-full text-cyan-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <button className="ml-auto bg-cyan-600 px-3 py-1 rounded text-sm hover:bg-cyan-500">
              Message
            </button>

          </div>
        ))}
        
        {results.length === 0 && !loading && (
          <p className="text-gray-500 col-span-2 text-center">No partners found. Try searching 'Common' or 'ECE'.</p>
        )}
      </div>

    </div>
  );
};

export default SkillMatch;