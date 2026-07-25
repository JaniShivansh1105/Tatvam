import { Request, Response } from "express";
import { WorkspaceService } from "../../../core/services/workspace/workspace.service.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class WorkspaceController {
  // ─── Bookmarks ───────────────────────────────────────────────────────────
  static async getBookmarks(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { search, folder, pinned, favorite } = req.query;
    const bookmarks = await WorkspaceService.getBookmarks(userId, lessonId, {
      search: search as string | undefined,
      folder: folder as string | undefined,
      pinned: pinned === "true" ? true : undefined,
      favorite: favorite === "true" ? true : undefined,
    });
    return sendSuccess({ res, data: { bookmarks } });
  }

  static async addBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const bookmark = await WorkspaceService.addBookmark(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { bookmark } });
  }

  static async updateBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const bookmark = await WorkspaceService.updateBookmark(userId, id, req.body);
    return sendSuccess({ res, data: { bookmark } });
  }

  static async removeBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await WorkspaceService.removeBookmark(userId, id);
    return sendSuccess({ res, data: { message: "Bookmark archived" } });
  }

  static async restoreBookmark(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const bookmark = await WorkspaceService.restoreBookmark(userId, id);
    return sendSuccess({ res, data: { bookmark } });
  }

  // ─── Smart Notes ─────────────────────────────────────────────────────────
  static async getNotes(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { search, folder } = req.query;
    const notes = await WorkspaceService.getNotes(userId, lessonId, {
      search: search as string | undefined,
      folder: folder as string | undefined,
    });
    return sendSuccess({ res, data: { notes } });
  }

  static async addNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const note = await WorkspaceService.addNote(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { note } });
  }

  static async updateNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const note = await WorkspaceService.updateNote(userId, id, req.body);
    return sendSuccess({ res, data: { note } });
  }

  static async removeNote(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    await WorkspaceService.removeNote(userId, id);
    return sendSuccess({ res, data: { message: "Note archived" } });
  }

  // ─── Flashcards ──────────────────────────────────────────────────────────
  static async getFlashcards(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const flashcards = await WorkspaceService.getFlashcards(userId, lessonId);
    return sendSuccess({ res, data: { flashcards } });
  }

  static async generateFlashcard(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const flashcard = await WorkspaceService.generateFlashcard(userId, lessonId, req.body);
    return sendSuccess({ res, status: 201, data: { flashcard } });
  }

  static async reviewFlashcard(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const flashcard = await WorkspaceService.reviewFlashcard(userId, id, req.body);
    return sendSuccess({ res, data: { flashcard } });
  }
}
