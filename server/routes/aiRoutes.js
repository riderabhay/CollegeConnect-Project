import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log("🤖 Asking JARVIS (Gemini 3):", prompt);

    // 🔥 UPDATED DIRECT LINK: Using 'gemini-3-flash-preview'
    // Ye aapki list mein available tha, isliye ye 100% chalega.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();

    // Error Check
    if (data.error) {
      console.error("❌ Google Error:", data.error.message);
      // Agar '3' me dikkat aaye to user ko batao
      throw new Error(data.error.message);
    }

    // Response nikaalo
    const text = data.candidates[0].content.parts[0].text;
    console.log("✅ JARVIS (Gemini 3) Replied!");
    
    res.json({ reply: text });

  } catch (error) {
    console.error("🚨 Server Error:", error.message);
    res.status(500).json({ reply: "JARVIS Error: " + error.message });
  }
});

export default router;