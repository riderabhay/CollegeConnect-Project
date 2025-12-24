import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// 1. ADD MESSAGE (Jab koi message bhejega)
router.post('/', async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    // Message save hote hi usme User ka data (Photo/Name) jod do
    const populatedMessage = await savedMessage.populate('senderId', 'username profilePic');
    res.status(200).json(populatedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET MESSAGES (Jab chat box khulega)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'username profilePic') // Bhej ne wale ka naam aur photo lao
      .sort({ createdAt: 1 }); // Purane pehle, naye baad mein
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;