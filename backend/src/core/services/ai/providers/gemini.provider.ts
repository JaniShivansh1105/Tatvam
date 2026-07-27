import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIConfig } from "../ai.types.js";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    } else {
      this.client = null as any;
    }
  }

  async generateText(prompt: string, config: AIConfig): Promise<string> {
    const model = this.client.getGenerativeModel({ model: config.models.gemini });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });
    return result.response.text();
  }

  async generateJSON(prompt: string, config: AIConfig): Promise<any> {
    const model = this.client.getGenerativeModel({ model: config.models.gemini });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        responseMimeType: "application/json",
      },
    });
    let text = result.response.text().trim();
    if (text.startsWith("```json")) text = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
    else if (text.startsWith("```")) text = text.replace(/^```/g, "").replace(/```$/g, "").trim();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("[GeminiProvider] JSON Parse Error on raw text:", text);
      throw e;
    }
  }

  async *generateStream(prompt: string, config: AIConfig): AsyncGenerator<string> {
    const model = this.client.getGenerativeModel({ model: config.models.gemini });
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    });
    
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}
