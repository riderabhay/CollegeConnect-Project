import express from 'express';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Image Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// 1. UPDATE PROFILE ROUTE
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  console.log("📥 Update Request Recieved for ID:", req.params.id); // Check Terminal
  console.log("📦 Data Recieved:", req.body); // Check Data

  try {
    let updateData = req.body;
    
    // Agar photo aayi hai
    if (req.file) {
      updateData.profilePic = req.file.filename;
      console.log("📸 Photo Uploaded:", req.file.filename);
    }

    // Skills string fix
    if (typeof updateData.skills === 'string') {
        updateData.skills = updateData.skills.split(',').map(s => s.trim());
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: updateData,
    }, { new: true });

    console.log("✅ Database Updated Successfully!");
    res.status(200).json(user);

  } catch (err) {
    console.error("❌ Backend Error:", err); // Asli error yahan dikhega
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// 2. GET USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. SKILL MATCH
router.get('/match/find', async (req, res) => {
  const skillQuery = req.query.skill;
  try {
    const regex = new RegExp(skillQuery, 'i');
    const users = await User.find({ skills: { $in: [regex] } }).limit(20);
    const safeUsers = users.map((u) => {
        const { password, ...other } = u._doc;
        return other;
    });
    res.status(200).json(safeUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;