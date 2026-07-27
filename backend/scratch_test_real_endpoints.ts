import { prisma } from "./src/data/prisma.js";
import { generateAccessToken } from "./src/utils/jwt.js";

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");
  
  const token = generateAccessToken({ userId: user.id });
  
  console.log("USER:", user.email);
  
  // 1. Practice Generation
  console.log("\n=== 1. Testing Practice API ===");
  const pRes = await fetch("http://localhost:4000/api/practice/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ type: "practice", difficulty: "easy" })
  });
  console.log("Practice Status:", pRes.status);
  const pData = await pRes.json();
  console.log("Practice Output:", JSON.stringify(pData).substring(0, 100) + "...");

  // 2. Study Plan Generation
  console.log("\n=== 2. Testing Study Plan API ===");
  const sRes = await fetch("http://localhost:4000/api/plans", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ type: "weekly" })
  });
  console.log("Plan Status:", sRes.status);
  const sData = await sRes.json();
  console.log("Plan Output:", JSON.stringify(sData).substring(0, 100) + "...");

  // 3. Dashboard Recommendations
  console.log("\n=== 3. Testing Dashboard API ===");
  const dRes = await fetch("http://localhost:4000/api/content/dashboard", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  console.log("Dashboard Status:", dRes.status);
  const dData = await dRes.json();
  console.log("Dashboard Output:", JSON.stringify(dData).substring(0, 100) + "...");

  // 4. AI Mentor (Stream)
  console.log("\n=== 4. Testing Mentor API ===");
  const chatRes = await fetch(`http://localhost:4000/api/ai/mentor/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ messages: [{ role: "user", content: "What is physics?" }], context: {} })
  });
  
  console.log("Mentor Status:", chatRes.status);
  const reader = chatRes.body?.getReader();
  const decoder = new TextDecoder();
  let firstChunk = "";
  if (reader) {
    const { value } = await reader.read();
    firstChunk = decoder.decode(value);
  }
  console.log("Mentor Output First Chunk:", firstChunk);

}

main().catch(console.error).finally(async () => await prisma.$disconnect());
