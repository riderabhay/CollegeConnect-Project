import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from "http"; 
import { Server } from "socket.io";  

// --- ✅ ROUTES IMPORT ---
import authRoutes from './routes/auth.js';       
import aiRoutes from './routes/aiRoutes.js';     
import postRoutes from './routes/posts.js';      
import circuitRoutes from './routes/circuits.js';
import noteRoutes from './routes/notes.js';      // 📚 NEW: Notes Route

dotenv.config();
const app = express();

// --- 🛠️ MIDDLEWARES ---
app.use(express.json()); 
app.use(cors());         
app.use("/uploads", express.static("uploads")); 

// --- 🔗 DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err);
    }
};
connectDB();

// --- 🚦 API ROUTES SETUP ---
app.use('/api/auth', authRoutes);      
app.use('/api/ai', aiRoutes);          
app.use('/api/posts', postRoutes);     
app.use('/api/circuits', circuitRoutes); 
app.use('/api/notes', noteRoutes);     // ✅ Notes Route Active

// --- 🔌 SOCKET.IO SETUP ---
const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ New User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- 🚀 START SERVER ---
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on Port ${PORT}`);
    console.log(`📡 WebSocket Active`);
    console.log(`📚 Notes Hub Active: /api/notes`);
});