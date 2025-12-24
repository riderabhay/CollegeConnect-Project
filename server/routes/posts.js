import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// 1. Nayi Post Banao (Create)
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Saari Posts Dikhao (Read)
router.get("/", async (req, res) => {
  try {
    // Sabse nayi post sabse upar (.sort)
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. Like Badhao (Update)
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $inc: { likes: 1 } }); // Likes +1
    res.status(200).json("Post liked!");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;