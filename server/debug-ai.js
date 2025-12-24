import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Agar key nahi mili to turant batao
if (!API_KEY) {
    console.error("❌ ERROR: .env file se API Key nahi mili!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
  console.log(`\n👉 Testing Model: "${modelName}"...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    // Ek chhota sa "Hello" bhej kar dekho
    const result = await model.generateContent("Just say Hello");
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS! "${modelName}" kaam kar raha hai.`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: "${modelName}"`);
    // Error ka main hissa print karo
    const cleanError = error.message.includes("]") ? error.message.split(']')[1] : error.message;
    console.log(`   Reason: ${cleanError.trim()}`);
    return false;
  }
}

async function runTests() {
  console.log("🤖 JARVIS DIAGNOSTIC TOOL STARTING...");
  console.log("🔑 API Key Detected: " + API_KEY.substring(0, 10) + "...");
  
  // Hum 3 sabse famous models try karenge
  console.log("-----------------------------------------");
  
  await testModel("gemini-1.5-flash"); // Option 1: Sabse Naya
  await testModel("gemini-pro");       // Option 2: Standard
  await testModel("gemini-1.5-pro");   // Option 3: Powerful
  
  console.log("\n-----------------------------------------");
  console.log("🏁 TEST COMPLETE");
}

runTests();