import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function test() {
  try {
    let allModels = [];
    let pageToken = "";
    do {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY!}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.models) allModels.push(...data.models);
      pageToken = data.nextPageToken;
    } while(pageToken);

    // Filter to find models supporting BOTH generateContent AND streamGenerateContent
    // Note: streamGenerateContent is usually implied if generateContent is supported, 
    // but the API lists them. Actually, streamGenerateContent is NOT listed in supportedGenerationMethods, 
    // it's just a method on the model. But let's check.
    
    for (const m of allModels) {
      if (m.name.includes("gemini")) {
        console.log(m.name, m.supportedGenerationMethods);
      }
    }
    
    console.log("Total models:", allModels.length);
  } catch(e) {
    console.log("Failed", e);
  }
}
test();
