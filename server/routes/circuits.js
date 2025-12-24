import express from "express";
import Circuit from "../models/Circuit.js";

const router = express.Router();

// 💾 SAVE CIRCUIT ROUTE
router.post("/save", async (req, res) => {
  try {
    const { userId, name, components } = req.body;
    
    const newCircuit = new Circuit({
      userId,
      name,
      components
    });

    const savedCircuit = await newCircuit.save();
    res.status(200).json(savedCircuit);
    console.log("✅ Circuit Saved:", name);
  } catch (err) {
    res.status(500).json(err);
    console.error("❌ Save Failed:", err);
  }
});

// 📂 GET USER'S CIRCUITS (Load karne ke liye)
router.get("/:userId", async (req, res) => {
  try {
    const circuits = await Circuit.find({ userId: req.params.userId });
    res.status(200).json(circuits);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;