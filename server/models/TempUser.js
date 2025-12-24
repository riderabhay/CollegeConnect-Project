import mongoose from 'mongoose';

const TempUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true }, // Hashed password yahan store hoga
  otp:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 🔥 Magic: 10 minute baad ye apne aap delete ho jayega agar verify nahi hua toh
});

export default mongoose.model("TempUser", TempUserSchema);