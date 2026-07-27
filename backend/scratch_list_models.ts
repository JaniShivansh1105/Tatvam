import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function test() {
  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // There is no listModels method directly on GoogleGenerativeAI in older SDK versions?
    // Let's check if there is one.
    // Or we can use fetch directly.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY!}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Failed", e);
  }
}
test();
