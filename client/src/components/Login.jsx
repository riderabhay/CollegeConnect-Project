import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("user", JSON.stringify(res.data)); // Save User
      toast.success("Login Successful! 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-400">Welcome Back</h2>
        
        <input 
          className="w-full bg-gray-800 p-3 rounded-lg mb-4 text-white focus:outline-none border border-gray-700 focus:border-green-500" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="w-full bg-gray-800 p-3 rounded-lg mb-6 text-white focus:outline-none border border-gray-700 focus:border-green-500" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button 
          onClick={handleLogin} 
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-500">
          New here? <Link to="/register" className="text-green-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}