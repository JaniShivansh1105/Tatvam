import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const candidateModels = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-flash-latest",
    "gemini-3.5-flash",
  ];

  for (const modelName of candidateModels) {
    console.log(`Testing model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test generateContent
      const res1 = await model.generateContent("Say 'hello' in one word.");
      console.log(`- generateContent SUCCESS: ${res1.response.text().trim()}`);
      
      // Test generateContentStream
      const res2 = await model.generateContentStream("Say 'stream' in one word.");
      let streamResult = "";
      for await (const chunk of res2.stream) {
        streamResult += chunk.text();
      }
      console.log(`- streamGenerateContent SUCCESS: ${streamResult.trim()}`);
      
      console.log(`>>> MODEL ${modelName} FULLY SUPPORTS BOTH!`);
      break; // Found the one!
    } catch(e: any) {
      console.log(`- FAILED: ${e.message}`);
    }
  }
}
test();
