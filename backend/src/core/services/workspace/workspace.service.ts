import { IWorkspaceService } from "../../../domain/interfaces/services.interface.js";
import { IWorkspaceRepository, IProgressRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { prisma } from "../../../data/prisma.js";
import { NotFoundError, ForbiddenError } from "../../../utils/errors.js";

export class WorkspaceService implements IWorkspaceService {
  constructor(private readonly workspaceRepo: IWorkspaceRepository, private readonly progressRepo: IProgressRepository, private readonly eventBus: IEventBus) {}
  // ─── Bookmarks (Lesson-Scoped) ─────────────────────────────────────────
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
            { content: { contains: query.search, mode: "insensitive" as const } },
            { note: { contains: query.search, mode: "insensitive" as const } },
          ],
        }),
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
  }

  async addBookmark(
    userId: string,
    lessonId: string,
    data: { type: string; content: string; sectionId?: string; note?: string; folder?: string; tags?: string[]; color?: string }
  ) {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        lessonId,
        type: data.type,
        content: data.content,
        sectionId: data.sectionId,
        note: data.note,
        folder: data.folder,
        tags: data.tags || [],
        color: data.color,
      },
    });
    await prisma.activity.create({
      data: { userId, lessonId, type: "BOOKMARK_CREATED", details: { bookmarkId: bookmark.id } },
    });
    return bookmark;
  }

  async updateBookmark(userId: string, id: string, data: { note?: string; isPinned?: boolean; isFavorite?: boolean; folder?: string; tags?: string[]; color?: string }) {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) throw new NotFoundError("Bookmark not found");
    if (bookmark.userId !== userId) throw new ForbiddenError("Unauthorized");

    return prisma.bookmark.update({ where: { id }, data });
  }

  async removeBookmark(userId: string, id: string) {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) throw new NotFoundError("Bookmark not found");
    if (bookmark.userId !== userId) throw new ForbiddenError("Unauthorized");

    return prisma.bookmark.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreBookmark(userId: string, id: string) {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) throw new NotFoundError("Bookmark not found");
    if (bookmark.userId !== userId) throw new ForbiddenError("Unauthorized");

    return prisma.bookmark.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  // ─── Smart Notes (Lesson-Scoped) ──────────────────────────────────────
  async getNotes(userId: string, lessonId: string, query?: { search?: string; folder?: string }) {
    return prisma.smartNote.findMany({
      where: {
        userId,
        lessonId,
        deletedAt: null,
        ...(query?.folder && { folder: query.folder }),
        ...(query?.search && {
          OR: [
            { title: { contains: query.search, mode: "insensitive" as const } },
            { text: { contains: query.search, mode: "insensitive" as const } },
          ],
        }),
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });
  }

  async addNote(
    userId: string,
    lessonId: string,
    data: { text: string; title?: string; summary?: string; tags?: string[]; folder?: string; isDraft?: boolean }
  ) {
    const title = data.title || data.text.split(" ").slice(0, 4).join(" ") + "...";

    const note = await prisma.smartNote.create({
      data: {
        userId,
        lessonId,
        text: data.text,
        title,
        summary: data.summary,
        tags: data.tags || [],
        folder: data.folder,
        isDraft: data.isDraft || false,
      },
    });
    await prisma.activity.create({
      data: { userId, lessonId, type: "NOTE_CREATED", details: { noteId: note.id } },
    });
    return note;
  }

  async updateNote(
    userId: string,
    id: string,
    data: { text?: string; title?: string; summary?: string; tags?: string[]; folder?: string; isDraft?: boolean }
  ) {
    const note = await prisma.smartNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundError("Note not found");
    if (note.userId !== userId) throw new ForbiddenError("Unauthorized");

    return prisma.smartNote.update({
      where: { id },
      data: { ...data, versionCount: { increment: 1 } },
    });
  }

  async removeNote(userId: string, id: string) {
    const note = await prisma.smartNote.findUnique({ where: { id } });
    if (!note) throw new NotFoundError("Note not found");
    if (note.userId !== userId) throw new ForbiddenError("Unauthorized");

    return prisma.smartNote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Flashcards (Lesson-Scoped) ───────────────────────────────────────
  async getFlashcards(userId: string, lessonId: string) {
    return prisma.flashcard.findMany({
      where: { userId, lessonId, deletedAt: null },
      orderBy: { nextReviewAt: "asc" },
    });
  }

  async generateFlashcard(
    userId: string,
    lessonId: string,
    data: { front: string; back: string; sourceNoteId?: string; sourceBookmarkId?: string; deck?: string; tags?: string[] }
  ) {
    const flashcard = await prisma.flashcard.create({
      data: {
        userId,
        lessonId,
        front: data.front,
        back: data.back,
        sourceNoteId: data.sourceNoteId,
        sourceBookmarkId: data.sourceBookmarkId,
        deck: data.deck,
        tags: data.tags || [],
        nextReviewAt: new Date(),
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      },
    });
    await prisma.activity.create({
      data: { userId, lessonId, type: "FLASHCARD_GENERATED", details: { flashcardId: flashcard.id } },
    });
    return flashcard;
  }

  async reviewFlashcard(userId: string, id: string, data: { difficulty: "again" | "hard" | "good" | "easy" }) {
    const flashcard = await prisma.flashcard.findUnique({ where: { id } });
    if (!flashcard) throw new NotFoundError("Flashcard not found");
    if (flashcard.userId !== userId) throw new ForbiddenError("Unauthorized");

    // SM-2 Algorithm
    let { easeFactor, interval, repetitions } = flashcard;
    const qualityMapping = { again: 0, hard: 2, good: 4, easy: 5 };
    const q = qualityMapping[data.difficulty];

    if (q < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    const updated = await prisma.flashcard.update({
      where: { id },
      data: {
        status: q < 3 ? "learning" : "review",
        easeFactor,
        interval,
        repetitions,
        nextReviewAt,
      },
    });
    await prisma.activity.create({
      data: { userId, lessonId: flashcard.lessonId, type: "FLASHCARD_REVIEWED", details: { flashcardId: id, difficulty: data.difficulty } },
    });
    return updated;
  }
}
