import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
      toast.success("Account Created! Login now.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration Failed (Email might be taken)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">Join Campus</h2>
        
        <input 
          className="w-full bg-gray-800 p-3 rounded-lg mb-4 text-white focus:outline-none border border-gray-700 focus:border-blue-500" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          className="w-full bg-gray-800 p-3 rounded-lg mb-4 text-white focus:outline-none border border-gray-700 focus:border-blue-500" 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="w-full bg-gray-800 p-3 rounded-lg mb-6 text-white focus:outline-none border border-gray-700 focus:border-blue-500" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button 
          onClick={handleRegister} 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}