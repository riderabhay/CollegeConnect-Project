import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { API_URL } from "../config"; // ✅ Config Import

// ✅ Server Connection with Config
const socket = io.connect(API_URL);

export default function Chat() {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = { author: user?.username || "Anonymous", message: currentMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white relative z-10">
      <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center shadow-lg">
        <div><h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">💬 COMMUNITY ROOM</h1><p className="text-xs text-gray-500">Live Campus Discussion</p></div>
        <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded">EXIT</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
        {messageList.map((msg, index) => {
          const isMe = msg.author === user?.username;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"}`}>
                {!isMe && <p className="text-xs font-bold text-green-400 mb-1">{msg.author}</p>}
                <p className="text-sm">{msg.message}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-500"}`}>{msg.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex gap-2">
          <input type="text" value={currentMessage} placeholder="Type a message..." onChange={(event) => setCurrentMessage(event.target.value)} onKeyPress={(event) => event.key === "Enter" && sendMessage()} className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-3 text-white focus:outline-none focus:border-green-500 transition" />
          <button onClick={sendMessage} className="bg-green-600 hover:bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition">➤</button>
        </div>
      </div>
    </div>
  );
}