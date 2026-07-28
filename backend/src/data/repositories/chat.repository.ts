import { IChatRepository } from "../../domain/interfaces/repositories.interface.js";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

export class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  async findActiveSession(userId: string, lessonId?: string) {
    let targetLessonId: string | null | undefined = lessonId;
    if (lessonId === "null" || lessonId === "") {
      targetLessonId = null;
    }
    
    return this.prisma.chatSession.findFirst({
      where: { 
        userId, 
        lessonId: targetLessonId !== undefined ? targetLessonId : undefined, 
        status: "active" 
      },
    });
  }

  async createSession(data: Prisma.ChatSessionUncheckedCreateInput) {
    return this.prisma.chatSession.create({ data });
  }

  async getSessionById(id: string) {
    return this.prisma.chatSession.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } }
    });
  }

  async updateSession(id: string, data: Prisma.ChatSessionUpdateInput) {
    return this.prisma.chatSession.update({
      where: { id },
      data
    });
  }

  async deleteSession(id: string) {
    return this.prisma.chatSession.delete({
      where: { id }
    });
  }

  async searchSessions(userId: string, query: string) {
    return this.prisma.chatSession.findMany({
      where: {
        userId,
        status: { not: "deleted" },
        title: { contains: query, mode: "insensitive" }
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  async getPinnedSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: {
        userId,
        isPinned: true,
        status: { not: "deleted" }
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  async createMessage(data: Prisma.ChatMessageUncheckedCreateInput) {
    return this.prisma.chatMessage.create({ data });
  }

  async updateMessage(id: string, data: Prisma.ChatMessageUpdateInput) {
    return this.prisma.chatMessage.update({
      where: { id },
      data
    });
  }

  async getMessageById(id: string) {
    return this.prisma.chatMessage.findUnique({ where: { id } });
  }

  async getHistory(userId: string, lessonId?: string, query?: any) {
    let targetLessonId: string | null | undefined = lessonId;
    if (lessonId === "null" || lessonId === "") {
      targetLessonId = null;
    }

    return this.prisma.chatSession.findMany({
      where: {
        userId,
        lessonId: targetLessonId !== undefined ? targetLessonId : undefined,
        status: { not: "deleted" },
        ...(query?.isPinned ? { isPinned: true } : {})
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: query?.take || 20,
    });
  }
}
