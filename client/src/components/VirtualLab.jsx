import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation added
import axios from "axios";

export default function VirtualLab() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Hook to catch data
  
  const [components, setComponents] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [circuitName, setCircuitName] = useState("My Project 01");
  const [saving, setSaving] = useState(false);
  
  const [dragId, setDragId] = useState(null);
  const workbenchRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem("user"));

  // --- 🔄 LOAD SAVED PROJECT LOGIC ---
  useEffect(() => {
    // Agar hum "Saved Experiments" page se aaye hain aur data laye hain
    if (location.state && location.state.loadCircuit) {
      const savedData = location.state.loadCircuit;
      setComponents(savedData.components);
      setCircuitName(savedData.name);
      // alert("✅ Project Loaded: " + savedData.name);
    }
  }, [location]);

  // Tools Configuration
  const tools = [
    { id: 1, name: "Resistor", icon: "〰️", color: "text-yellow-400", type: "passive" },
    { id: 2, name: "LED Light", icon: "💡", color: "text-gray-500", type: "output" },
    { id: 3, name: "Battery (9V)", icon: "🔋", color: "text-green-400", type: "power" },
    { id: 4, name: "Switch", icon: "🎚️", color: "text-white", type: "control" },
  ];

  // Actions
  const addComponent = (tool) => {
    setComponents([...components, { uniqueId: Date.now(), ...tool, x: 50, y: 50, isOn: false }]);
  };

  const deleteComponent = (uniqueId) => {
    setComponents(components.filter((c) => c.uniqueId !== uniqueId));
  };

  // --- 💾 SAVE FUNCTION ---
  const saveCircuit = async () => {
    if (!user) return alert("Please Login to Save!");
    setSaving(true);
    try {
      await axios.post("http://localhost:5000/api/circuits/save", {
        userId: user._id,
        name: circuitName,
        components: components
      });
      alert("✅ Circuit Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Save Failed!");
    } finally {
      setSaving(false);
    }
  };

  // --- DRAG LOGIC ---
  const handleMouseDown = (e, id) => setDragId(id);
  const handleMouseUp = () => setDragId(null);
  
  const handleMouseMove = (e) => {
    if (!dragId || !workbenchRef.current) return;
    const rect = workbenchRef.current.getBoundingClientRect();
    // 30px offset taaki mouse center mein rahe
    const x = e.clientX - rect.left - 30;
    const y = e.clientY - rect.top - 30;
    
    setComponents(prev => prev.map(c => c.uniqueId === dragId ? { ...c, x, y } : c));
  };

  // --- SIMULATION LOGIC ---
  const runSimulation = () => {
    setIsSimulating(true);
    const hasPower = components.some(c => c.type === "power");
    const hasLED = components.some(c => c.type === "output");
    
    if (hasPower && hasLED) {
      setComponents(prev => prev.map(c => 
        c.type === "output" ? { ...c, color: "text-red-500 drop-shadow-[0_0_25px_rgba(255,0,0,1)]", isOn: true } : c
      ));
    } else {
      alert("⚠️ Circuit Incomplete! Add Battery + LED."); 
      setIsSimulating(false);
    }
  };
  
  const stopSimulation = () => {
    setIsSimulating(false);
    setComponents(prev => prev.map(c => 
      c.type === "output" ? { ...c, color: "text-gray-500", isOn: false } : c
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative z-10" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col z-20 shadow-xl">
        <button onClick={() => navigate("/dashboard")} className="mb-4 text-gray-400 hover:text-white self-start flex items-center gap-2">
          ⬅️ Dashboard
        </button>
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6">
          VIRTUAL LAB ⚡
        </h1>
        
        {/* Project Name */}
        <input 
          value={circuitName}
          onChange={(e) => setCircuitName(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded border border-gray-600 mb-6 text-sm w-full focus:border-yellow-500 outline-none"
          placeholder="Project Name..."
        />

        <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Toolbox</p>
        <div className="space-y-3">
          {tools.map((tool) => (
            <div key={tool.id} onClick={() => addComponent(tool)} className="bg-gray-800 p-3 rounded-xl cursor-pointer hover:border-yellow-500 border border-transparent flex gap-3 transition active:scale-95">
              <span className="text-2xl">{tool.icon}</span>
              <span className="font-bold text-gray-300">{tool.name}</span>
            </div>
          ))}
        </div>
        
        {/* Save Button */}
        <button onClick={saveCircuit} disabled={saving} className="mt-auto w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl font-bold transition shadow-lg shadow-blue-900/20">
          {saving ? "Saving..." : "💾 SAVE PROJECT"}
        </button>
      </div>

      {/* WORKBENCH AREA */}
      <div ref={workbenchRef} className="flex-1 relative bg-gray-900/50" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="absolute top-4 left-4 text-gray-500 text-xs">Workspace: {circuitName}</div>
        
        {components.map((comp) => (
          <div 
            key={comp.uniqueId}
            onMouseDown={(e) => handleMouseDown(e, comp.uniqueId)}
            className={`absolute p-4 rounded-lg border shadow-xl flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing hover:border-cyan-500 transition-colors ${dragId === comp.uniqueId ? 'z-50 scale-110' : 'z-10'} ${comp.isOn ? 'bg-gray-800 border-red-500 shadow-red-900/50' : 'bg-black/80 border-gray-600'}`}
            style={{ top: `${comp.y}px`, left: `${comp.x}px` }}
          >
            <button onClick={(e) => { e.stopPropagation(); deleteComponent(comp.uniqueId); }} className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition">✕</button>
            <div className={`text-4xl transition-all duration-300 ${comp.color}`}>{comp.icon}</div>
            <span className="text-xs font-bold text-gray-400 select-none">{comp.name}</span>
          </div>
        ))}

        {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div className="text-center">
                    <div className="text-6xl mb-2">⚡</div>
                    <p>Drag components here to build</p>
                </div>
            </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-64 bg-gray-900 border-l border-gray-800 p-4 z-20 shadow-xl">
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">Monitor</h2>
        <div className="bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700">
          <div className="flex justify-between mb-2"><span className="text-gray-400">Voltage:</span> <span className={`font-bold ${isSimulating ? "text-yellow-400" : "text-gray-600"}`}>{isSimulating ? "9.0V" : "0.0V"}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Current:</span> <span className={`font-bold ${isSimulating ? "text-cyan-400" : "text-gray-600"}`}>{isSimulating ? "0.02A" : "0.0A"}</span></div>
        </div>
        
        {!isSimulating ? (
          <button onClick={runSimulation} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 active:scale-95 transition">▶ RUN SIMULATION</button>
        ) : (
          <button onClick={stopSimulation} className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 active:scale-95 transition animate-pulse">⏹ STOP SIMULATION</button>
        )}
      </div>

    </div>
  );
}