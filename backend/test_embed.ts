import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./src/config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
  try {
    const res = await model.embedContent("Hello world");
    console.log("Success:", res.embedding.values.length);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
