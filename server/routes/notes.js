import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// 1. UPLOAD NOTE (Link Save karo)
router.post("/add", async (req, res) => {
  try {
    const newNote = new Note(req.body);
    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET NOTES (Branch ke hisaab se)
router.get("/:branch", async (req, res) => {
  try {
    // Agar branch "All" hai toh sab dikhao, warna filter karo
    const branch = req.params.branch;
    let notes;
    
    if (branch === "All") {
      notes = await Note.find().sort({ createdAt: -1 });
    } else {
      notes = await Note.find({ branch: branch }).sort({ createdAt: -1 });
    }
    
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;