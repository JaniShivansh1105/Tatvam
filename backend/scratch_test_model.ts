import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function test() {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  try {
    const res = await ai.getGenerativeModel({ model: "gemini-pro" }).generateContent("hello");
    console.log(res.response.text());
  } catch(e) {
    console.log("gemini-pro failed", e);
  }
}
test();
