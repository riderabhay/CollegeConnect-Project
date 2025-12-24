import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // User model se link kiya taaki naam aur photo dikha sakein
    required: true 
  },
  text: { type: String, required: true },
}, { timestamps: true }); // Isse apne aap time save ho jayega

export default mongoose.model("Message", MessageSchema);