import express from 'express';
import Post from '../models/Post.js'; // Model import
import multer from 'multer';
import path from 'path';

const router = express.Router();

// --- IMAGE UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Images 'server/uploads' folder mein save hongi
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // File ka naam unique banane ke liye Date add karte hain
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 1. CREATE POST ROUTE (Image + Text)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const newPost = new Post(req.body);
    
    // Agar photo upload hui hai toh uska naam save karo
    if (req.file) {
      newPost.img = req.file.filename;
    }
    
    const savedPost = await newPost.save();
    // Post save hone ke turant baad user details ke saath wapas bhejein
    const populatedPost = await savedPost.populate('userId', 'username profilePicture');
    
    res.status(200).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// 2. GET ALL POSTS (Timeline)
router.get('/timeline/all', async (req, res) => {
  try {
    // ✅ FIX: .populate() add kiya hai. 
    // Ye 'userId' field ko padh ke User table se 'username' aur 'profilePicture' le aayega.
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePicture");
      
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;