import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import TempUser from '../models/TempUser.js'; // Temp storage
import nodemailer from 'nodemailer'; 

const router = express.Router();

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // ⚠️ IMPORTANT: Yahan apni ASLI Gmail ID likhein (jis par App Password banaya hai)
    user: 'abhayankl60@gmail.com', // Maine screenshot se dekh kar likh diya hai, check kar lena
    
    // ✅ Aapka App Password
    pass: 'ckpj zwmy ttwt qxrg' 
  }
});

// 🔥 DEBUG: Server start hote hi check karega ki Email Connection juda ya nahi
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email Server Connection Error:", error);
  } else {
    console.log("✅ Email Server is Ready to send messages!");
  }
});

// 1. REGISTER (Save to TempUser & Send OTP)
router.post('/register', async (req, res) => {
  try {
    // Step 1: Check Real User Table
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json("User already exists! Please Login.");

    // Step 2: Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Step 3: Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 4: Save to TempUser (Kachcha Account)
    const newTempUser = new TempUser({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      otp: otpCode
    });

    const savedTempUser = await newTempUser.save();

    // Step 5: Send Email
    await transporter.sendMail({
      from: '"CollegeConnect Security" <abhaynishadofficial7@gmail.com>', // Sender Name badhiya dikhega
      to: req.body.email,
      subject: '🔐 Verify Your Account - CollegeConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #0891b2; text-align: center;">Radhe Radhe, ${req.body.username}! 🙏</h2>
          <p style="font-size: 16px; color: #555; text-align: center;">You are just one step away from joining the Future of Campus Life.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px dashed #0891b2;">
            <p style="margin: 0; color: #888; font-size: 14px;">Your Verification Code:</p>
            <h1 style="color: #22c55e; letter-spacing: 5px; font-size: 32px; margin: 10px 0;">${otpCode}</h1>
          </div>

          <p style="text-align: center; color: #999; font-size: 12px;">This code is valid for 10 minutes. If you didn't request this, please ignore.</p>
        </div>
      `
    });

    console.log(`OTP Sent to ${req.body.email}`); // Terminal mein bhi print karega confirm karne ke liye
    res.status(200).json({ message: "OTP sent to email", userId: savedTempUser._id });

  } catch (err) {
    console.log("Error in Register:", err);
    res.status(500).json(err);
  }
});

// 2. VERIFY OTP & CREATE REAL ACCOUNT
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Find in TempUser
    const tempUser = await TempUser.findById(userId);
    if (!tempUser) return res.status(400).json("OTP Expired or Invalid Data. Please Register again.");

    // Match OTP
    if (tempUser.otp === otp) {
      
      // ✅ Create Real User
      const newUser = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password, // Already hashed
        isVerified: true
      });

      await newUser.save();

      // Delete Temp Data
      await TempUser.deleteOne({ _id: userId });

      res.status(200).json("Account Verified! Login Success.");
    } else {
      res.status(400).json("Wrong OTP! Please try again.");
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 3. LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).json("Incorrect password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;