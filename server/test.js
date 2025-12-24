const axios = require('axios');

// Tumhari Nayi Key
const key = "AIzaSyDYS3irVDX3dCsXpDzx6_rfFrkHU2AOeBU";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("🔍 Checking Google AI Status...");

axios.get(url)
  .then(res => {
    console.log("\n✅ SUCCESS! Google se connection jud gaya!");
    console.log("📜 Available Models ki list ye rahi:");
    // Sirf Gemini wale models filter karke dikhayenge
    const models = res.data.models.filter(m => m.name.includes('gemini'));
    models.forEach(m => console.log(`   👉 ${m.name}`));
    console.log("\nAb hum inme se koi ek naam use karenge!");
  })
  .catch(err => {
    console.log("\n❌ ERROR! Abhi bhi dikkat hai:");
    if (err.response) {
      console.log(`   Status: ${err.response.status}`);
      console.log(`   Message: ${JSON.stringify(err.response.data, null, 2)}`);
    } else {
      console.log(`   Reason: ${err.message}`);
    }
    console.log("💡 Tip: Agar Error 400/403 hai, toh API Key ya Project permission ka issue hai.");
  });