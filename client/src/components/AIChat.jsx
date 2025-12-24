import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { API_URL } from "../config"; // ✅ Config Import

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Radhe Radhe Abhay! Main JARVIS hu. Padhai mein kya madad karu?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false); // 🎤 Listening State
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 🗣️ SPEAKING (JARVIS Bolne Wala Logic) ---
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // Indian English Accent
    utterance.rate = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // --- 🎤 LISTENING (Meri Awaaz Sunne Wala Logic) ---
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser doesn't support Voice Input. Try Chrome.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; // English samajhne ke liye
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Jo bola wo input box mein likh do
      setIsListening(false);
      handleSend(transcript); // Aur turant bhej bhi do (Optional)
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- SEND MESSAGE LOGIC ---
  const handleSend = async (manualText = null) => {
    const textToSend = manualText || input; // Ya toh bola hua text lo, ya type kiya hua
    if (!textToSend.trim()) return;

    const userMessage = { text: textToSend, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    stopSpeaking(); // User bole toh JARVIS chup ho jaye

    try {
      const contextPrompt = `
        You are JARVIS, a helpful AI tutor for engineering students.
        The user is ${user?.username || "Abhay"}.
        Answer in Hinglish (Easy Hindi + English).
        Keep it short and conceptual.
        User's Question: ${textToSend}
      `;

      // ✅ API_URL Updated
      const res = await axios.post(`${API_URL}/api/ai/chat`, { prompt: contextPrompt });
      
      const aiResponse = res.data.reply;
      const aiMessage = { text: aiResponse, sender: "ai" };
      
      setMessages((prev) => [...prev, aiMessage]);
      speakText(aiResponse); // Jawaab bol kar sunao

    } catch (err) {
      setMessages((prev) => [...prev, { text: "Network Error: Server slow hai.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative z-10">
      
      {/* Header */}
      <div className="p-4 bg-gray-900 border-b border-cyan-500/30 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-widest flex items-center gap-2">
          ● JARVIS <span className="text-xs text-gray-400 border border-gray-600 px-1 rounded">V3.0</span>
          {isSpeaking && <span className="text-xs text-green-400 animate-pulse">🔊 Speaking...</span>}
        </h1>
        
        <div className="flex gap-3">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-red-400 border border-red-500/50 px-3 py-1 rounded hover:bg-red-900/20 text-xs font-bold">
              ⏹ STOP
            </button>
          )}
          <button onClick={() => { stopSpeaking(); navigate("/dashboard"); }} className="text-sm font-bold text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded">
            EXIT
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            
            {msg.sender === "ai" ? (
              <div className="max-w-[85%] flex gap-2">
                 {/* AI Icon */}
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold mt-1">AI</div>
                
                <div className="bg-gray-900/90 border border-gray-700 p-5 rounded-2xl rounded-tl-none shadow-xl">
                  <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  
                  {/* 🔊 Re-Play Button */}
                  <button 
                    onClick={() => speakText(msg.text)}
                    className="mt-3 text-cyan-500 hover:text-cyan-300 text-xs flex items-center gap-1 font-bold"
                  >
                    🔊 Listen
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-[80%] bg-cyan-700 text-white p-3 rounded-2xl rounded-tr-none shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse ml-10">
            <div className="bg-gray-800 p-3 rounded-xl rounded-tl-none text-cyan-400 text-xs">
              Thinking... 🧠
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (With Mic) */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-2 items-center">
          
          {/* 🎤 MIC BUTTON */}
          <button
            onClick={startListening}
            className={`p-3 rounded-full transition shadow-lg flex items-center justify-center ${
              isListening 
                ? "bg-red-600 animate-pulse text-white shadow-red-500/50" 
                : "bg-gray-800 text-cyan-400 hover:bg-gray-700 border border-gray-600"
            }`}
          >
            {isListening ? "🛑" : "🎤"}
          </button>

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={isListening ? "Listening... 👂" : "Ask JARVIS..."}
            className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition"
          />
          <button onClick={() => handleSend()} className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)]">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}