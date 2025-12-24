import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Topic ka naam (e.g. "Ohm's Law Notes")
  subject: { type: String, required: true },     // Subject (e.g. "Basic Electronics")
  branch: { type: String, required: true },      // Branch (e.g. "ECE")
  link: { type: String, required: true },        // Google Drive/PDF Link
  type: { type: String, default: "PDF" },        // PDF or Video?
  addedBy: { type: String, required: true },     // Kisne upload kiya
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Note", NoteSchema);