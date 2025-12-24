import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import toast from "react-hot-toast"; // ✅ Professional Alert

export default function SocialFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // ✅ Loading State
  const fileInputRef = useRef(null);
  
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
      console.error(err);
      toast.error("Failed to load feed!"); // ❌ Error Alert
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Size Check (2MB se zyada mana karo)
      if (file.size > 2 * 1024 * 1024) return toast.error("Image too big! Max 2MB.");
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        toast.success("Photo selected!"); // ✅ Success Alert
      };
    }
  };

  const handlePost = async () => {
    if (!caption && !image) return toast.error("Write something first!");
    
    setLoading(true);
    const newPost = {
      userId: user._id,
      username: user.username || "Student",
      caption: caption,
      image: image || "",
    };

    try {
      await axios.post(`${API_URL}/api/posts`, newPost);
      setCaption("");
      setImage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Post Uploaded Successfully! 🎉"); // ✅ Mast Alert
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Try again.");
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
              placeholder={`What's on your mind, ${user?.username}?`}
              className="w-full bg-transparent border-none text-white focus:outline-none resize-none text-lg"
              rows="2"
            />
            {image && (
              <div className="relative mt-2">
                <img src={image} alt="Preview" className="w-full max-h-60 object-cover rounded-lg border border-gray-700" />
                <button onClick={() => setImage("")} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">X</button>
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

            <div className="flex justify-between items-center mt-3 border-t border-gray-800 pt-3">
              <div className="flex gap-4 text-cyan-400 text-sm cursor-pointer font-bold">
                <span onClick={() => fileInputRef.current.click()} className="flex items-center gap-1 hover:text-white transition">📷 Photo</span>
              </div>
              <button 
                onClick={handlePost}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full font-bold shadow-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : "POST"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 POSTS FEED (Loading Spinner) */}
      {fetching ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="text-gray-500 mt-4">Loading Campus Gossips...</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6 pb-20">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No posts yet. Be the first! 🚀</div>
          ) : (
            posts.map((post) => (
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
                {post.image && <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />}
                <div className="p-4 flex gap-6 text-gray-400">
                  <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 hover:text-red-500 transition group">
                    <span className="group-hover:scale-125 transition text-xl">❤️</span> 
                    <span>{post.likes} Likes</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}