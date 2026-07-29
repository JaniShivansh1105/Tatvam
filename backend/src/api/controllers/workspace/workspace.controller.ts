import { getBookmarksUseCase, addBookmarkUseCase, updateBookmarkUseCase, removeBookmarkUseCase, restoreBookmarkUseCase, getNotesUseCase, addNoteUseCase, updateNoteUseCase, removeNoteUseCase, getFlashcardsUseCase, generateFlashcardUseCase, reviewFlashcardUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { GetBookmarksUseCase, AddBookmarkUseCase, UpdateBookmarkUseCase, RemoveBookmarkUseCase, RestoreBookmarkUseCase } from "../../../application/workspace/bookmarks.use-case.js";
import { GetNotesUseCase, AddNoteUseCase, UpdateNoteUseCase, RemoveNoteUseCase } from "../../../application/workspace/notes.use-case.js";
import { GetFlashcardsUseCase, GenerateFlashcardUseCase, ReviewFlashcardUseCase } from "../../../application/workspace/flashcards.use-case.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class WorkspaceController {
  constructor() {}
  // ─── Bookmarks ───────────────────────────────────────────────────────────
  async getBookmarks(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { search, folder, pinned, favorite } = req.query;
    const bookmarks = await getBookmarksUseCase.execute(userId, lessonId, {
      search: search as string | undefined,
      folder: folder as string | undefined,
      pinned: pinned === "true" ? true : undefined,
      favorite: favorite === "true" ? true : undefined,
    });
    return sendSuccess({ res, data: { bookmarks } });
  }

  async addBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const bookmark = await addBookmarkUseCase.execute(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { bookmark } });
  }

  async updateBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const bookmark = await updateBookmarkUseCase.execute(userId, id, req.body);
    return sendSuccess({ res, data: { bookmark } });
  }

  async removeBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await removeBookmarkUseCase.execute(userId, id);
    return sendSuccess({ res, data: { message: "Bookmark archived" } });
  }

  async restoreBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const bookmark = await restoreBookmarkUseCase.execute(userId, id);
    return sendSuccess({ res, data: { bookmark } });
  }

  // ─── Smart Notes ─────────────────────────────────────────────────────────
  async getNotes(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { search, folder } = req.query;
    const notes = await getNotesUseCase.execute(userId, lessonId, {
      search: search as string | undefined,
      folder: folder as string | undefined,
    });
    return sendSuccess({ res, data: { notes } });
  }

  async addNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const note = await addNoteUseCase.execute(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { note } });
  }

  async updateNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const note = await updateNoteUseCase.execute(userId, id, req.body);
    return sendSuccess({ res, data: { note } });
  }

  async removeNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await removeNoteUseCase.execute(userId, id);
    return sendSuccess({ res, data: { message: "Note archived" } });
  }

  // ─── Flashcards ──────────────────────────────────────────────────────────
  async getFlashcards(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const flashcards = await getFlashcardsUseCase.execute(userId, lessonId);
    return sendSuccess({ res, data: { flashcards } });
  }

  async generateFlashcard(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const flashcard = await generateFlashcardUseCase.execute(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { flashcard } });
  }

  async reviewFlashcard(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const flashcard = await reviewFlashcardUseCase.execute(userId, id, req.body);
    return sendSuccess({ res, data: { flashcard } });
  }

  // ─── Educational Artifacts ───────────────────────────────────────────────
  async getArtifacts(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { prisma } = await import("../../../data/prisma.js");
    const artifacts = await prisma.educationalArtifact.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" }
    });
    return sendSuccess({ res, data: { artifacts } });
  }

  async createArtifact(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { prisma } = await import("../../../data/prisma.js");
    
    let artifact;
    if (req.body.sourceConversationId) {
      const [newArtifact] = await prisma.$transaction([
        prisma.educationalArtifact.create({
          data: {
            ...req.body,
            ownerId: userId
          }
        }),
        prisma.chatSession.update({
          where: { id: req.body.sourceConversationId },
          data: { updatedAt: new Date() }
        })
      ]);
      artifact = newArtifact;
    } else {
      artifact = await prisma.educationalArtifact.create({
        data: {
          ...req.body,
          ownerId: userId
        }
      });
    }

    return sendSuccess({ res, status: 201, data: { artifact } });
  }

  async updateArtifact(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { prisma } = await import("../../../data/prisma.js");
    const artifact = await prisma.educationalArtifact.update({
      where: { id, ownerId: userId },
      data: req.body
    });
    return sendSuccess({ res, data: { artifact } });
  }

  async deleteArtifact(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { prisma } = await import("../../../data/prisma.js");
    await prisma.educationalArtifact.delete({
      where: { id, ownerId: userId }
    });
    return sendSuccess({ res, data: { message: "Artifact deleted" } });
  }
}
