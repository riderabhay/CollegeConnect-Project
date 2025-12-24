import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  caption: { type: String, required: true }, // Jo likha hai
  image: { type: String }, // Photo ka URL (Optional)
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", PostSchema);