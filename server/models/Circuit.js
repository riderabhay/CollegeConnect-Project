import mongoose from "mongoose";

const CircuitSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Kis student ka circuit hai
  name: { type: String, default: "Untitled Circuit" }, // Project ka naam
  components: { type: Array, required: true }, // Resistor, LED, unki position
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Circuit", CircuitSchema);