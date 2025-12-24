import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config"; 

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      } else {
        // --- REGISTER ---
        await axios.post(`${API_URL}/api/auth/register`, {
          username,
          email,
          password,
        });
        alert("✅ Registration Successful! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      
      // 🛠️ FIX: Asli Error Message Nikalo
      if (err.response) {
        // Agar error ek object hai, to use text mein badlo
        const errorMessage = typeof err.response.data === 'object' 
          ? JSON.stringify(err.response.data) // Object ko string banao
          : err.response.data; // Ya seedha message dikhao
          
        alert(`Server Error: ${errorMessage}`);
      } else if (err.request) {
        alert("❌ Network Error: Server se connect nahi ho pa raha. Laptop par Backend chal raha hai?");
      } else {
        alert(`Something went wrong: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative z-10">
      <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          {isLogin ? "Welcome Back" : "Join the Future"}
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          {isLogin ? "Access your 3D Campus." : "Create your student identity."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Username" className="w-full p-3 bg-black border border-gray-700 rounded-xl focus:border-cyan-500 outline-none text-white" value={username} onChange={(e) => setUsername(e.target.value)} required />
          )}
          <input type="email" placeholder="Email Address" className="w-full p-3 bg-black border border-gray-700 rounded-xl focus:border-cyan-500 outline-none text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 bg-black border border-gray-700 rounded-xl focus:border-cyan-500 outline-none text-white" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg transition active:scale-95">
            {loading ? "Processing..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "New here? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline font-bold">
            {isLogin ? "Create Account" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}