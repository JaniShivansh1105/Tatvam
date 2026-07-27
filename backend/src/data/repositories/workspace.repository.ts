import { prisma } from "../prisma.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { Prisma } from "@prisma/client";

export class WorkspaceRepository implements IWorkspaceRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  // ─── Bookmarks ────────────────────────────────────────────────────────
  async getBookmarks(userId: string, lessonId: string, query?: { search?: string; folder?: string; pinned?: boolean; favorite?: boolean }) {
    return prisma.bookmark.findMany({
      where: {
        userId,
        lessonId,
        deletedAt: null,
        ...(query?.folder && { folder: query.folder }),
        ...(query?.pinned !== undefined && { isPinned: query.pinned }),
        ...(query?.favorite !== undefined && { isFavorite: query.favorite }),
        ...(query?.search && {
          OR: [
            { content: { contains: query.search, mode: "insensitive" } },
            { note: { contains: query.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  }

  async getBookmarkById(id: string) {
    return prisma.bookmark.findUnique({ where: { id } });
  }

  async createBookmark(data: Prisma.BookmarkUncheckedCreateInput) {
    return prisma.bookmark.create({ data });
  }

  async updateBookmark(id: string, data: Prisma.BookmarkUncheckedUpdateInput) {
    return prisma.bookmark.update({ where: { id }, data });
  }

  // ─── Smart Notes ──────────────────────────────────────────────────────
  async getNotes(userId: string, lessonId: string, query?: { search?: string; folder?: string }) {
    return prisma.smartNote.findMany({
      where: {
        userId,
        lessonId,
        deletedAt: null,
        ...(query?.folder && { folder: query.folder }),
        ...(query?.search && {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { text: { contains: query.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });
  }

  async getNoteById(id: string) {
    return prisma.smartNote.findUnique({ where: { id } });
  }

  async createNote(data: Prisma.SmartNoteUncheckedCreateInput) {
    return prisma.smartNote.create({ data });
  }

  async updateNote(id: string, data: Prisma.SmartNoteUncheckedUpdateInput) {
    return prisma.smartNote.update({ where: { id }, data });
  }

  // ─── Flashcards ───────────────────────────────────────────────────────
  async getFlashcards(userId: string, lessonId: string) {
    return prisma.flashcard.findMany({
      where: { userId, lessonId, deletedAt: null },
      orderBy: { nextReviewAt: "asc" },
    });
  }

  async getFlashcardById(id: string) {
    return prisma.flashcard.findUnique({ where: { id } });
  }

  async createFlashcard(data: Prisma.FlashcardUncheckedCreateInput) {
    return prisma.flashcard.create({ data });
  }

  async updateFlashcard(id: string, data: Prisma.FlashcardUncheckedUpdateInput) {
    return prisma.flashcard.update({ where: { id }, data });
  }
}
