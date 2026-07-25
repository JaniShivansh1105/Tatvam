import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace/workspace.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const workspaceRouter = Router();

workspaceRouter.use(requireAuth);

// ─── Bookmarks (Lesson-Scoped) ──────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/bookmarks", asyncHandler(WorkspaceController.getBookmarks));
workspaceRouter.post("/lessons/:lessonId/bookmarks", asyncHandler(WorkspaceController.addBookmark));
workspaceRouter.patch("/bookmarks/:id", asyncHandler(WorkspaceController.updateBookmark));
workspaceRouter.delete("/bookmarks/:id", asyncHandler(WorkspaceController.removeBookmark));
workspaceRouter.post("/bookmarks/:id/restore", asyncHandler(WorkspaceController.restoreBookmark));

// ─── Smart Notes (Lesson-Scoped) ────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/notes", asyncHandler(WorkspaceController.getNotes));
workspaceRouter.post("/lessons/:lessonId/notes", asyncHandler(WorkspaceController.addNote));
workspaceRouter.put("/notes/:id", asyncHandler(WorkspaceController.updateNote));
workspaceRouter.delete("/notes/:id", asyncHandler(WorkspaceController.removeNote));

// ─── Flashcards (Lesson-Scoped) ─────────────────────────────────────────
workspaceRouter.get("/lessons/:lessonId/flashcards", asyncHandler(WorkspaceController.getFlashcards));
workspaceRouter.post("/lessons/:lessonId/flashcards/generate", asyncHandler(WorkspaceController.generateFlashcard));
workspaceRouter.put("/flashcards/:id/review", asyncHandler(WorkspaceController.reviewFlashcard));

export { workspaceRouter };
