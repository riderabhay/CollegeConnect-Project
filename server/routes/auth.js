import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ---------------------------------------------------
// 1️⃣ REGISTER (Naya Account Banao)
// ---------------------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Password ko secure (encrypt) karo
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Naya user create karo
    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword 
    });
    
    const user = await newUser.save();
    res.status(200).json(user);
    console.log("✅ New User Registered:", username);
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json(err);
  }
});

// ---------------------------------------------------
// 2️⃣ LOGIN (Purana User Check Karo)
// ---------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    // Email dhundo
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found!");

    // Password match karo
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password!");

    res.status(200).json(user);
    console.log("✅ User Logged In:", user.username);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------------------------------------------------
// 3️⃣ UPDATE PROFILE (Branch, Skills, Bio Update Karo)
// ---------------------------------------------------
router.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Jo data aaya use set karo
      { new: true } // Return updated data
    );
    res.status(200).json(updatedUser);
    console.log("✅ Profile Updated for:", updatedUser.username);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------------------------------------------------
// 4️⃣ GET SINGLE USER (Profile Dekhne ke liye)
// ---------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");
    
    // Password hata kar baaki data bhejo
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    // Agar id galat format ki hai (jaise "all" word aa gaya id ki jagah)
    if(req.params.id !== "all") res.status(500).json(err);
  }
});

// ---------------------------------------------------
// 5️⃣ GET ALL STUDENTS (Find Partner ke liye)
// ---------------------------------------------------
// Note: Is route ko "/all/students" rakha hai taaki upar wale "/:id" se clash na kare
router.get("/all/students", async (req, res) => {
  try {
    // Sabhi users lao, par password mat lao
    const students = await User.find({}, { password: 0 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;