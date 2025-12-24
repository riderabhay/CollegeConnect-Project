import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Campus Assistant. Ask me anything!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // User Message Add karo
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Backend se baat karo
      // Note: Agar backend route alag hai to yahan error aa sakta hai, par UI chal jayega
      const res = await axios.post(`${API_URL}/api/chat/ask`, { prompt: input });
      
      // Bot Message Add karo
      setMessages([...newMessages, { text: res.data.response, sender: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { text: "Sorry, brain connection lost! 🤯 (Check Backend)", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4 sticky top-0 bg-black z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">🤖</div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI JARVIS</h1>
        </div>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">Back</button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gray-900/50 rounded-2xl p-4 space-y-4 mb-4 border border-gray-800 min-h-[60vh] max-h-[75vh]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-lg ${
              msg.sender === "user" 
                ? "bg-purple-600 text-white rounded-br-none" 
                : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none text-gray-400 animate-pulse text-sm">
                Thinking... 🤔
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 sticky bottom-4">
        <input 
          className="flex-1 bg-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none border border-gray-700 focus:border-purple-500 text-lg shadow-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about assignments, exams, or code..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 px-8 rounded-xl font-bold disabled:opacity-50 transition transform active:scale-95"
        >
          SEND
        </button>
      </div>
    </div>
  );
}