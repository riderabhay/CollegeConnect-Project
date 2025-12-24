import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; // ✅ Config Import

export default function SocialFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // ✅ API_URL Updated
    const res = await axios.get(`${API_URL}/api/posts`);
    setPosts(res.data);
  };

  const handlePost = async () => {
    if (!caption) return alert("Write something!");
    const newPost = { userId: user._id, username: user.username, caption: caption, image: imageUrl || "https://source.unsplash.com/random/800x600/?college,tech", };
    try {
      // ✅ API_URL Updated
      await axios.post(`${API_URL}/api/posts`, newPost);
      setCaption(""); setImageUrl(""); fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleLike = async (id) => {
    try {
      // ✅ API_URL Updated
      await axios.put(`${API_URL}/api/posts/${id}/like`);
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative z-10 p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 bg-gray-900/80 p-4 rounded-2xl border border-green-500/30 sticky top-4 z-50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">CAMPUS FEED 🌍</h1>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-800 px-4 py-2 rounded-xl text-sm hover:bg-gray-700">Back</button>
      </div>
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-6 rounded-3xl mb-8 shadow-xl">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">{user?.username.charAt(0)}</div>
          <div className="flex-1">
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={`What's on your mind, ${user?.username}?`} className="w-full bg-transparent border-none text-white focus:outline-none resize-none text-lg" rows="2" />
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste Image Link (Optional)..." className="w-full bg-black/30 text-gray-400 text-xs p-2 rounded-lg mt-2 mb-2 focus:outline-none focus:border-green-500 border border-transparent" />
            <div className="flex justify-between items-center mt-3 border-t border-gray-800 pt-3">
              <div className="flex gap-4 text-cyan-400 text-sm cursor-pointer"><span>📷 Photo</span><span>🎥 Video</span></div>
              <button onClick={handlePost} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-bold shadow-lg transition">POST</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300">{post.username.charAt(0)}</div>
              <div><h3 className="font-bold text-white">{post.username}</h3><p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="px-4 pb-2"><p className="text-gray-300 mb-3">{post.caption}</p></div>
            {post.image && <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />}
            <div className="p-4 flex gap-6 text-gray-400"><button onClick={() => handleLike(post._id)} className="flex items-center gap-2 hover:text-red-500 transition group"><span className="group-hover:scale-125 transition text-xl">❤️</span> <span>{post.likes} Likes</span></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}