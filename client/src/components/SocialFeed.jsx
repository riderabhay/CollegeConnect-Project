import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function SocialFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(""); // Yahan image data aayega
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Hidden file input ke liye ref
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // 📸 Gallery se Photo lene ka magic function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Photo ko code mein badlo
      reader.onloadend = () => {
        setImage(reader.result); // Code ko state mein save karo
      };
    }
  };

  const handlePost = async () => {
    if (!caption && !image) return alert("Write something or add a photo!");
    
    setLoading(true);
    const newPost = {
      userId: user._id,
      username: user.username || "Student",
      caption: caption,
      image: image || "", // Gallery wali photo ya khali
    };

    try {
      await axios.post(`${API_URL}/api/posts`, newPost);
      setCaption("");
      setImage("");
      if (fileInputRef.current) fileInputRef.current.value = ""; // Input clear karo
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Post failed! (Photo size might be too big)");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`${API_URL}/api/posts/${id}/like`);
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative z-10 p-4">
      
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 bg-gray-900/80 p-4 rounded-2xl border border-green-500/30 sticky top-4 z-50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          CAMPUS FEED 🌍
        </h1>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-800 px-4 py-2 rounded-xl text-sm hover:bg-gray-700">Back</button>
      </div>

      {/* ✍️ CREATE POST BOX */}
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-6 rounded-3xl mb-8 shadow-xl">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
            {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="flex-1">
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`What's on your mind?`}
              className="w-full bg-transparent border-none text-white focus:outline-none resize-none text-lg"
              rows="2"
            />

            {/* Preview Image: Agar photo select ki hai to yahan dikhegi */}
            {image && (
              <div className="relative mt-2">
                <img src={image} alt="Preview" className="w-full max-h-60 object-cover rounded-lg border border-gray-700" />
                <button onClick={() => setImage("")} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">X</button>
              </div>
            )}

            {/* Hidden Input for File Upload */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
            />

            <div className="flex justify-between items-center mt-3 border-t border-gray-800 pt-3">
              <div className="flex gap-4 text-cyan-400 text-sm cursor-pointer font-bold">
                {/* 📸 Photo Button ab Hidden Input ko click karega */}
                <span onClick={() => fileInputRef.current.click()} className="flex items-center gap-1 hover:text-white transition">
                  📷 Photo
                </span>
                <span className="flex items-center gap-1 hover:text-white transition opacity-50 cursor-not-allowed">
                  🎥 Video (Pro)
                </span>
              </div>
              <button 
                onClick={handlePost}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-bold shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Posting..." : "POST"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 POSTS FEED */}
      <div className="w-full max-w-2xl space-y-6 pb-20">
        {posts.map((post) => (
          <div key={post._id} className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300">
                {(post.username || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white">{post.username || "Anonymous"}</h3>
                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="px-4 pb-2"><p className="text-gray-300 mb-3">{post.caption}</p></div>
            
            {post.image && (
              <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
            )}

            <div className="p-4 flex gap-6 text-gray-400">
              <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 hover:text-red-500 transition group">
                <span className="group-hover:scale-125 transition text-xl">❤️</span> 
                <span>{post.likes} Likes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}