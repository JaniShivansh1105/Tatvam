import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import OpenAI from "openai";
import { AIProvider, AIConfig } from "../ai.types.js";

export class GrokProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const key = process.env.GROK_API_KEY;
    if (key) {
      this.client = new OpenAI({ 
        apiKey: key,
        baseURL: "https://api.x.ai/v1"
      });
    } else {
      this.client = null as any;
    }
  }

  async generateText(prompt: string, config: AIConfig): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config.models.grok,
      messages: [{ role: "user", content: prompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });
    return response.choices[0].message.content || "";
  }

  async generateJSON(prompt: string, config: AIConfig): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: config.models.grok,
      messages: [{ role: "user", content: prompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });
    let text = response.choices[0]?.message?.content?.trim() || "";
    if (text.startsWith("```json")) text = text.replace(/^```json/g, "").replace(/```$/g, "").trim();
    else if (text.startsWith("```")) text = text.replace(/^```/g, "").replace(/```$/g, "").trim();
    return JSON.parse(text || "{}");
  }

  async *generateStream(prompt: string, config: AIConfig): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: config.models.grok,
      messages: [{ role: "user", content: prompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: true,
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) yield content;
    }
  }
}
