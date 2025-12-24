import dotenv from "dotenv";
dotenv.config();

const key = process.env.GEMINI_API_KEY;
// Direct Google Link (Library bypass)
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("🔍 Checking Google Server directly for Key:", key ? key.substring(0, 10) + "..." : "NONE");

async function check() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.log("❌ GOOGLE ERROR:", data.error.message);
            console.log("👉 Matlab: API Key galat hai ya Project mein API ON nahi hai.");
        } else if (data.models) {
            console.log("✅ SUCCESS! Ye Models Available hain:");
            console.log("--------------------------------------");
            // Sirf wahi models dikhao jo 'generateContent' support karte hain
            const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            
            if(chatModels.length === 0) {
                console.log("⚠️ Models toh hain, par Chat wale nahi hain. Ajeeb baat hai.");
            }
            
            chatModels.forEach(m => {
                // Model ka asli naam print karo (jaise 'models/gemini-pro')
                console.log(`   🌟 ${m.name.replace("models/", "")}`);
            });
            console.log("--------------------------------------");
            console.log("👉 Jo naam upar 'Star' 🌟 ke saath hai, wahi use karna padega.");
        } else {
            console.log("⚠️ LIST EMPTY: Google ne khali list bheji hai.");
        }
    } catch (e) {
        console.log("❌ NETWORK ERROR:", e.message);
    }
}

check();