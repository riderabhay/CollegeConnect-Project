import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // 🆕 Nayi Cheezein (Profile ke liye)
  branch: { type: String, default: "Not Updated" },     // e.g. ECE, CSE
  year: { type: String, default: "1st Year" },          // e.g. 2nd Year
  skills: { type: Array, default: [] },                 // e.g. ["React", "Python"]
  bio: { type: String, default: "Engineering Student" },// e.g. "I love coding"
  avatar: { type: String, default: "" },                // Profile Pic URL
});

export default mongoose.model("User", UserSchema);